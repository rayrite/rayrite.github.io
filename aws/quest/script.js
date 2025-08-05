class MCQApp {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.categories = new Set();
        this.domains = new Set();
        this.currentQuizQuestions = [];
        this.quizResults = [];
        this.currentQuizIndex = 0;
        this.quizInProgress = false;
        this.tablesData = null;
        this.tablesWindow = null;
        
        // Timer properties
        this.timeLimit = 90; // Default time in seconds
        this.timerInterval = null;
        this.questionStartTime = 0;

        this.availableDatasets = [
            { value: 'aws_mcq_questions.json', label: 'Original Question Bank (1,623 questions)' },
            { value: 'aws_mock_exams.json', label: 'CLF-C02 Mock Exams (325 questions)' },
            { value: 'aws_e2_exams.json', label: 'AWS Cloud Practitioner E2 (6e-390 questions)' },
            { value: 'aws_e3_exams.json', label: 'AWS Cloud Practitioner E3 (3e-195 questions)' },
            { value: 'aws_e4_exams.json', label: 'AWS Cloud Practitioner E4 (9e-585 questions)' },
            { value: 'aws_e5_exams.json', label: 'AWS E5 Enhanced (252/252 verified)' },
            { value: 'aws_e6_exams.json', label: 'AWS E6a ShadingPixel (1e-1000 questions)' },
            { value: 'aws_e6b_exams.json', label: 'AWS E6b ShadingPixel (1e-425 questions)' },
            { value: 'aws_e7_exams.json', label: 'AWS E7 Video Mock Exam Rip (1e-65 questions)' },
            { value: 'aws_e8_exams.json', label: 'AWS E8 SP Weekend Exam Cram (1e-200 questions)' },
            { value: 'aws_e9_exams.json', label: 'AWS E9 ShadingPixel (1e-1000 questions)' }
        ];
        this.currentDataset = this.availableDatasets[0].value;
        
        this.init();
    }

    async init() {
        try {
            this.populateDatasetSelect();
            await this.loadQuestions();
            await this.loadTablesData();
            this.setupEventListeners();
            this.populateCategories();
            this.populateDomains();
            this.populateDatasetCheckboxes();
            this.renderQuestions();
            this.updateStats();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load questions. Please refresh the page.');
        }
    }

    populateDatasetSelect() {
        const select = document.getElementById('datasetSelect');
        if (!select) return;
        select.innerHTML = '';
        this.availableDatasets.forEach(ds => {
            const option = document.createElement('option');
            option.value = ds.value;
            option.textContent = ds.label;
            select.appendChild(option);
        });
        select.value = this.currentDataset;
    }

    async loadTablesData() {
        try {
            const response = await fetch('aws_mcq_tables.json');
            if (response?.ok) {
                this.tablesData = await response.json() ?? [];
            } else {
                this.tablesData = [];
            }
        } catch (error) {
            console.warn('Error loading tables data:', error);
            this.tablesData = [];
        }
    }
    
    _processLoadedQuestions(questions) {
        questions.forEach(q => {
            // Enhanced processing to use numchoices field
            if (typeof q.numchoices === 'number' && q.numchoices > 0) {
                q.expectedChoices = q.numchoices;
            } else {
                // Fallback to existing logic
                q.expectedChoices = this._extractAnswerLettersCount(q);
            }
            
            // Ensure we have answer_letters for compatibility
            if (!q.answer_letters || q.answer_letters.length === 0) {
                q.answer_letters = this._extractAnswerLetters(q);
            }
            
            // Validate that answer_letters matches expected choices
            if (q.answer_letters.length !== q.expectedChoices) {
                console.warn(`Question ${q.id}: Answer letters (${q.answer_letters.length}) don't match expected choices (${q.expectedChoices})`);
                // Use the more reliable numchoices field if available
                if (q.expectedChoices > 0 && q.expectedChoices <= q.options?.length) {
                    // Keep expectedChoices as authoritative
                } else {
                    q.expectedChoices = q.answer_letters.length;
                }
            }
        });
        return questions;
    }
    
    _extractAnswerLettersCount(q) {
        const letters = new Set();
        const correctAnswers = q.correct_answers || [];
        
        correctAnswers.forEach(answer => {
            let match = answer.match(/^([A-Z])\.\s*/) || answer.match(/<b>([A-Z])\.\s*/);
            if (match) {
                letters.add(match[1]);
                return;
            }
            
            answer.split('<br>').forEach(item => {
                const m = item.trim().match(/^([A-Z])\./);
                if (m) letters.add(m[1]);
            });
        });
        
        return letters.size;
    }
    
    _extractAnswerLetters(q) {
        const letters = new Set();
        const correctAnswers = q.correct_answers || [];
        
        correctAnswers.forEach(answer => {
            let match = answer.match(/^([A-Z])\.\s*/) || answer.match(/<b>([A-Z])\.\s*/);
            if (match) {
                letters.add(match[1]);
                return;
            }
            
            answer.split('<br>').forEach(item => {
                const m = item.trim().match(/^([A-Z])\./);
                if (m) letters.add(m[1]);
            });
            
            if (letters.size === 0 && q.options) {
                const cleanAnswer = answer.replace(/<[^>]*>/g, '').trim();
                q.options.forEach((option, index) => {
                    const cleanOption = option.replace(/<[^>]*>/g, '').trim();
                    if (cleanOption === cleanAnswer) {
                        letters.add(String.fromCharCode(65 + index));
                    }
                });
            }
        });
        
        return [...letters].sort();
    }

    async loadQuestions() {
        try {
            const response = await fetch(this.currentDataset);
            if (!response?.ok) throw new Error(`HTTP error! status: ${response?.status ?? 'unknown'}`);
            
            let questions = await response.json() ?? [];
            this.questions = this._processLoadedQuestions(questions);
            
            this.filteredQuestions = [...this.questions];
            
            // Extract categories and domains
            this.categories.clear();
            this.domains.clear();
            this.questions.forEach(q => {
                if (q?.category) this.categories.add(q.category);
                if (q?.domain) this.domains.add(q.domain);
            });
            
            console.log(`Loaded ${this.questions.length} questions`);
            console.log(`Categories: ${this.categories.size}, Domains: ${this.domains.size}`);
            
            // Log multichoice statistics
            const multichoiceCount = this.questions.filter(q => q.expectedChoices > 1).length;
            console.log(`Multichoice questions: ${multichoiceCount} (${Math.round(multichoiceCount/this.questions.length*100)}%)`);
            
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    async loadMultipleDatasets(datasetFiles) {
        const allQuestions = [];
        for (const datasetFile of datasetFiles) {
            try {
                const response = await fetch(datasetFile);
                if (response?.ok) {
                    let questions = await response.json() ?? [];
                    questions = this._processLoadedQuestions(questions);
                    questions.forEach(q => q.sourceDataset = datasetFile); // Tag source
                    allQuestions.push(...questions);
                }
            } catch (error) {
                console.warn(`Failed to load dataset ${datasetFile}:`, error);
            }
        }
        return allQuestions;
    }
    
    async switchDataset(newDataset) {
        try {
            this.currentDataset = newDataset;
            this.showLoading('browse');
            await this.loadQuestions();
            this.resetFilters();
            this.populateCategories();
            this.populateDomains();
            this.updateDatasetCheckboxes();
            this.renderQuestions();
            this.updateStats();
            this.toggleViewTablesBtn();
            
            if (this.quizInProgress) this.endQuiz();
        } catch (error) {
            console.error('Failed to switch dataset:', error);
            this.showError('Failed to load the selected dataset. Please try again.', 'browse');
        }
    }

    setupEventListeners() {
        // Main dataset selector
        document.getElementById('datasetSelect')?.addEventListener('change', (e) => {
            this.switchDataset(e.target.value);
        });

        // Tabs
        document.querySelectorAll('.tab-button')?.forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // --- BROWSE Tab Listeners ---
        document.getElementById('searchInput')?.addEventListener('input', () => this.filterQuestions());
        document.getElementById('categoryFilter')?.addEventListener('change', () => this.filterQuestions());
        document.getElementById('domainFilter')?.addEventListener('change', () => this.filterQuestions());
        document.getElementById('viewTablesBtn')?.addEventListener('click', () => window.open('aws1600t.html', '_blank'));
        document.getElementById('closeTableModal')?.addEventListener('click', () => this.closeTableModal());
        document.getElementById('tableModal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('tableModal')) this.closeTableModal();
        });

        // --- QUIZ Tab Listeners ---
        document.getElementById('startQuiz')?.addEventListener('click', () => this.startQuiz());
        document.getElementById('endQuiz')?.addEventListener('click', () => this.endQuiz());
        document.getElementById('checkAnswer')?.addEventListener('click', () => this.checkUserAnswer());
        document.getElementById('nextQuestion')?.addEventListener('click', () => this.nextQuizQuestion());

        // Global key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeTableModal();
        });
    }
    
    // --- UI Update & Population ---

    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const quizCategory = document.getElementById('quizCategory');
        const sortedCategories = [...this.categories].sort();
        
        const populateSelect = (select) => {
            if (!select) return;
            const currentValue = select.value;
            select.innerHTML = '<option value="">All Categories</option>';
            sortedCategories.forEach(category => {
                if (category) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    select.appendChild(option);
                }
            });
            select.value = currentValue;
        };

        populateSelect(categoryFilter);
        populateSelect(quizCategory);
    }
    
    populateDomains() {
        const domainFilter = document.getElementById('domainFilter');
        const quizDomain = document.getElementById('quizDomain');
        const sortedDomains = [...this.domains].sort();
        
        const populateSelect = (select) => {
            if (!select) return;
            const currentValue = select.value;
            select.innerHTML = '<option value="">All Domains</option>';
            sortedDomains.forEach(domain => {
                if (domain) {
                    const option = document.createElement('option');
                    option.value = domain;
                    option.textContent = domain;
                    select.appendChild(option);
                }
            });
            select.value = currentValue;
        };

        populateSelect(domainFilter);
        populateSelect(quizDomain);
    }
    
    populateDatasetCheckboxes() {
        const container = document.getElementById('datasetCheckboxGroup');
        if (!container) return;
        container.innerHTML = '';
        
        this.availableDatasets.forEach(dataset => {
            const checkboxDiv = document.createElement('div');
            checkboxDiv.className = 'dataset-checkbox';
            checkboxDiv.innerHTML = `
                <input type="checkbox" id="dataset_${dataset.value.replace('.json', '')}" value="${dataset.value}">
                <label for="dataset_${dataset.value.replace('.json', '')}">${dataset.label}</label>
            `;
            container.appendChild(checkboxDiv);
        });
        this.updateDatasetCheckboxes();
    }

    updateDatasetCheckboxes() {
        const checkboxes = document.querySelectorAll('#datasetCheckboxGroup input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = checkbox.value === this.currentDataset;
        });
    }

    updateStats() {
        document.getElementById('totalQuestions').textContent = `${this.questions?.length ?? 0} Questions`;
        document.getElementById('totalCategories').textContent = `${this.categories?.size ?? 0} Categories`;
        document.getElementById('totalDomains').textContent = `${this.domains?.size ?? 0} Domains`;
    }

    toggleViewTablesBtn() {
        const viewTablesBtn = document.getElementById('viewTablesBtn');
        if (viewTablesBtn) {
            viewTablesBtn.style.display = (this.currentDataset === 'aws_mcq_questions.json') ? 'inline-block' : 'none';
        }
    }

    // --- BROWSE Tab Functionality ---
    
    filterQuestions() {
        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() ?? '';
        const selectedCategory = document.getElementById('categoryFilter')?.value ?? '';
        const selectedDomain = document.getElementById('domainFilter')?.value ?? '';

        this.filteredQuestions = this.questions?.filter(q => {
            const matchesSearch = !searchTerm || 
                q.question?.toLowerCase().includes(searchTerm) ||
                q.options?.some(option => option.toLowerCase().includes(searchTerm));
            const matchesCategory = !selectedCategory || q.category === selectedCategory;
            const matchesDomain = !selectedDomain || q.domain === selectedDomain;
            return matchesSearch && matchesCategory && matchesDomain;
        }) ?? [];

        this.renderQuestions();
    }
    
    renderQuestions() {
        const questionsList = document.getElementById('questionsList');
        if (!questionsList) return;

        if (!this.filteredQuestions?.length) {
            questionsList.innerHTML = '<div class="no-results">No questions found.</div>';
            return;
        }
        questionsList.innerHTML = this.filteredQuestions.map(q => this.createQuestionCard(q)).join('');
    }
    
    createQuestionCard(q) {
        const answerTexts = q.answer_letters.map(letter => {
            const optionIndex = letter.charCodeAt(0) - 65;
            return `${letter}. ${q.options?.[optionIndex] || letter}`;
        });
        const correctAnswersDisplay = answerTexts.join('<br>');
        const hasExplanation = q.explanation && q.explanation.trim() !== '';

        // Enhanced question type display
        const questionTypeInfo = q.expectedChoices > 1 ? 
            ` (${q.expectedChoices} correct answers)` : ' (single choice)';

        const tableControls = this.currentDataset === 'aws_mcq_questions.json' ? `
            <span class="question-number-label">Q-ID ${q.id ?? 'N/A'}</span>
            <button class="see-table-btn" onclick="app.showTableForQuestion(${q.id})">See Table</button>
            <button class="view-table-btn" onclick="app.openTableForQuestion(${q.id})">View Table (New Tab)</button>
        ` : `<span class="question-number-label">Q-ID ${q.id ?? 'N/A'}</span>`;

        return `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-id">ID: ${q.id ?? 'N/A'}${questionTypeInfo}</span>
                    <span class="question-category">${q.category ?? 'Uncategorized'}</span>
                    ${q.domain ? `<span class="question-domain" style="background: #007bff; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem;">${q.domain}</span>` : ''}
                </div>
                <div class="question-text">${q.question ?? ''}</div>
                <div class="options">
                    ${q.options?.map((option, index) => `
                        <div class="option">
                            <span class="option-label">${String.fromCharCode(65 + index)})</span>
                            <span class="option-text">${option ?? ''}</span>
                        </div>`).join('') ?? ''}
                </div>
                <div class="question-actions">
                    <button class="show-answer-btn" onclick="app.toggleAnswer(${q.id})">Show Answer</button>
                </div>
                <div id="answer-${q.id}" class="correct-answer" style="display: none;">
                    <div class="check-icon">✓</div>
                    <div class="answer-content">
                        <div class="answer-text"><strong>Correct Answer(s):</strong><br>${correctAnswersDisplay}</div>
                        ${hasExplanation ? `<div class="explanation">${q.explanation.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>')}</div>` : ''}
                        ${tableControls}
                    </div>
                </div>
            </div>
        `;
    }

    toggleAnswer(questionId) {
        const answerDiv = document.getElementById(`answer-${questionId}`);
        const button = document.querySelector(`button[onclick="app.toggleAnswer(${questionId})"]`);
        if (answerDiv && button) {
            const isHidden = answerDiv.style.display === 'none';
            answerDiv.style.display = isHidden ? 'flex' : 'none';
            button.textContent = isHidden ? 'Hide Answer' : 'Show Answer';
        }
    }

    // --- TABLE Functionality ---

    showTableForQuestion(questionId) {
        if (!this.tablesData || !Array.isArray(this.tablesData)) return alert('Table data not available.');
        const tableEntry = this.tablesData.find(entry => entry.question === questionId.toString());
        if (!tableEntry) return alert(`No table data found for question ${questionId}`);
        this.displayTableModal(tableEntry, questionId);
    }

    displayTableModal(tableEntry, questionId) {
        const modal = document.getElementById('tableModal');
        document.getElementById('tableModalTitle').textContent = `Table for Question ${questionId}`;
        const body = document.getElementById('tableModalBody');
        
        const createTableHTML = (entry) => {
            let html = '<table class="dynamic-table"><thead><tr>';
            entry.headers.forEach(h => html += `<th>${h.replace(/\n/g, '<br>')}</th>`);
            html += '</tr></thead><tbody>';
            entry.data.forEach(row => {
                html += '<tr>';
                row.forEach(cell => html += `<td>${cell.replace(/\n/g, '<br>')}</td>`);
                html += '</tr>';
            });
            return html + '</tbody></table>';
        };
        
        body.innerHTML = createTableHTML(tableEntry);
        if (modal) modal.style.display = 'flex';
    }
    
    closeTableModal() {
        const modal = document.getElementById('tableModal');
        if (modal) modal.style.display = 'none';
    }
    
    openTableForQuestion(questionId) {
        const url = `aws1600t.html#question-${questionId}`;
        if (this.tablesWindow && !this.tablesWindow.closed) {
            this.tablesWindow.location.href = url;
            this.tablesWindow.focus();
        } else {
            this.tablesWindow = window.open(url, 'tablesWindow', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        }
    }

    // --- QUIZ Functionality (Enhanced with Multichoice Support) ---
    
    selectAllDatasets = () => document.querySelectorAll('#datasetCheckboxGroup input').forEach(cb => cb.checked = true);
    selectNoneDatasets = () => document.querySelectorAll('#datasetCheckboxGroup input').forEach(cb => cb.checked = false);
    selectCurrentDataset = () => this.updateDatasetCheckboxes();
    
    async startQuiz() {
        const startBtn = document.getElementById('startQuiz');
        startBtn.disabled = true;
        startBtn.textContent = 'Loading...';

        try {
            this.timeLimit = parseInt(document.getElementById('timeLimit').value) || 90;
            const keywords = document.getElementById('quizKeywords').value.trim();
            const selectedCategory = document.getElementById('quizCategory').value;
            const selectedDomain = document.getElementById('quizDomain').value;
            const questionCount = parseInt(document.getElementById('questionCount').value);
            const multichoiceRatio = parseInt(document.getElementById('multichoiceRatio').value) || 30;
            const selectedDatasets = [...document.querySelectorAll('#datasetCheckboxGroup input:checked')].map(cb => cb.value);

            if (selectedDatasets.length === 0) {
                alert('Please select at least one dataset.');
                return;
            }

            let availableQuestions = await this.loadMultipleDatasets(selectedDatasets);

            // Apply filters
            if (selectedCategory) {
                availableQuestions = availableQuestions.filter(q => q.category === selectedCategory);
            }
            if (selectedDomain) {
                availableQuestions = availableQuestions.filter(q => q.domain === selectedDomain);
            }
            if (keywords) {
                const keywordList = keywords.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
                availableQuestions = availableQuestions.filter(q => {
                    const searchText = `${q.question} ${q.options.join(' ')}`.toLowerCase();
                    return keywordList.some(kw => searchText.includes(kw));
                });
            }

            if (!availableQuestions.length) {
                alert('No questions found matching your criteria.');
                return;
            }

            // Enhanced quiz generation with multichoice ratio support
            this.currentQuizQuestions = this.generateBalancedQuiz(availableQuestions, questionCount, multichoiceRatio);
            
            if (this.currentQuizQuestions.length === 0) {
                 alert('No questions found after filtering and balancing.');
                 return;
            }
            
            this.currentQuizIndex = 0;
            this.quizInProgress = true;
            this.quizResults = [];

            // Enhanced quiz info display
            const quizInfo = document.getElementById('quizInfo');
            if (quizInfo) {
                const datasetNames = selectedDatasets.map(ds => {
                    const dataset = this.availableDatasets.find(d => d.value === ds);
                    return dataset ? dataset.label.split(' (')[0].trim() : ds;
                });
                const multichoiceCount = this.currentQuizQuestions.filter(q => q.expectedChoices > 1).length;
                const actualMultichoiceRatio = Math.round((multichoiceCount / this.currentQuizQuestions.length) * 100);
                
                let infoText = `Sources: ${datasetNames.join(', ')} | Multichoice: ${multichoiceCount}/${this.currentQuizQuestions.length} (${actualMultichoiceRatio}%)`;
                if (keywords) infoText += ` | Keywords: ${keywords}`;
                if (selectedCategory) infoText += ` | Category: ${selectedCategory}`;
                if (selectedDomain) infoText += ` | Domain: ${selectedDomain}`;
                quizInfo.textContent = infoText;
            }

            document.getElementById('quizSetup').style.display = 'none';
            document.getElementById('quizContainer').style.display = 'flex';
            document.getElementById('scoreReport').classList.remove('active');

            this.displayCurrentQuizQuestion();
        } catch (error) {
            console.error("Failed to start quiz:", error);
            alert("An error occurred while starting the quiz.");
        } finally {
            startBtn.disabled = false;
            startBtn.textContent = 'Start Quiz';
        }
    }
    
    generateBalancedQuiz(availableQuestions, questionCount, multichoiceRatio) {
        const multichoiceQuestions = availableQuestions.filter(q => q.expectedChoices > 1);
        const singleChoiceQuestions = availableQuestions.filter(q => q.expectedChoices === 1);
        
        const targetMultichoice = Math.ceil((questionCount * multichoiceRatio) / 100);
        const targetSingleChoice = questionCount - targetMultichoice;
        
        const selectedMultichoice = this.shuffleArray(multichoiceQuestions).slice(0, Math.min(targetMultichoice, multichoiceQuestions.length));
        const selectedSingleChoice = this.shuffleArray(singleChoiceQuestions).slice(0, Math.min(targetSingleChoice, singleChoiceQuestions.length));
        
        // If we don't have enough of one type, fill with the other
        const combined = [...selectedMultichoice, ...selectedSingleChoice];
        if (combined.length < questionCount) {
            const remaining = availableQuestions.filter(q => !combined.includes(q));
            const additional = this.shuffleArray(remaining).slice(0, questionCount - combined.length);
            combined.push(...additional);
        }
        
        return this.shuffleArray(combined).slice(0, questionCount);
    }
    
    displayCurrentQuizQuestion() {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        if (!question) return;

        document.getElementById('questionNumber').textContent = `Question ${this.currentQuizIndex + 1} of ${this.currentQuizQuestions.length}`;
        
        // Enhanced multichoice support using expectedChoices
        const isMultiple = question.expectedChoices > 1;
        const inputType = isMultiple ? 'checkbox' : 'radio';
        const instructions = isMultiple ? 
            `Select ${question.expectedChoices} answers:` : 'Select one answer:';
        
        // Enhanced question display with type info
        const questionTypeDisplay = isMultiple ? 
            `<div class="quiz-question-type" style="color: #007bff; font-weight: bold; margin-bottom: 0.5rem;">Multiple Choice (${question.expectedChoices} correct answers)</div>` :
            `<div class="quiz-question-type" style="color: #28a745; font-weight: bold; margin-bottom: 0.5rem;">Single Choice</div>`;
        
        document.getElementById('quizQuestion').innerHTML = `
            ${questionTypeDisplay}
            <div class="question-text">${question.question}</div>
            <div class="quiz-instructions"><p><strong>${instructions}</strong></p></div>
            <div class="quiz-options">
                ${question.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    return `
                        <div class="quiz-option" onclick="app.toggleQuizOption(this, '${inputType}')">
                            <input type="${inputType}" id="option-${letter}" name="quiz-answer" value="${letter}">
                            <span class="quiz-option-label">${letter}.</span>
                            <span class="quiz-option-text">${option}</span>
                        </div>`;
                }).join('')}
            </div>
            <div class="quiz-question-id-label">Question ID: ${question.id} | Domain: ${question.domain || 'N/A'} | Category: ${question.category || 'N/A'}</div>
        `;
        
        document.getElementById('answerSection').style.display = 'none';
        document.getElementById('checkAnswer').style.display = 'inline-block';
        document.getElementById('nextQuestion').style.display = 'none';
        
        this.startTimer();
    }

    toggleQuizOption(optionDiv, inputType) {
        const input = optionDiv.querySelector('input');
        if (input.disabled) return;
        
        if (inputType === 'radio') {
            document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
            input.checked = true;
            optionDiv.classList.add('selected');
        } else {
            input.checked = !input.checked;
            optionDiv.classList.toggle('selected', input.checked);
        }
    }

    checkUserAnswer(isTimeOut = false) {
        clearInterval(this.timerInterval);
        const timeSpent = isTimeOut ? this.timeLimit : (Date.now() - this.questionStartTime) / 1000;
        
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        const selectedInputs = [...document.querySelectorAll('.quiz-option input:checked')];
        const userAnswers = selectedInputs.map(input => input.value).sort();
        const correctAnswers = question.answer_letters.sort();

        // Enhanced validation for multichoice questions
        if (!isTimeOut && userAnswers.length === 0) {
            this.startTimer(parseInt(document.getElementById('timer').textContent.split(':')[0]) * 60 + parseInt(document.getElementById('timer').textContent.split(':')[1]));
            return alert('Please select an answer.');
        }
        
        // Enhanced correctness check using expectedChoices
        const isCorrect = !isTimeOut && 
            (userAnswers.length === question.expectedChoices) && 
            (JSON.stringify(userAnswers) === JSON.stringify(correctAnswers));

        this.quizResults.push({ 
            question, 
            userAnswers, 
            correctAnswers, 
            expectedChoices: question.expectedChoices,
            isCorrect, 
            timeSpent,
            timedOut: isTimeOut 
        });

        // Visual feedback on options
        document.querySelectorAll('.quiz-option').forEach(optionDiv => {
            const input = optionDiv.querySelector('input');
            input.disabled = true;
            if (correctAnswers.includes(input.value)) {
                optionDiv.classList.add('correct');
            } else if (input.checked) {
                optionDiv.classList.add('incorrect');
            }
        });

        this.showCurrentAnswer(isCorrect, isTimeOut);
        
        document.getElementById('checkAnswer').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'inline-block';
    }
    
    showCurrentAnswer(isCorrect, isTimeOut) {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        const answerSection = document.getElementById('answerSection');
        
        let resultMessage = isCorrect ? 'Correct!' : 'Incorrect';
        if (isTimeOut) resultMessage = 'Time is up!';
        const resultClass = isCorrect ? 'correct' : 'incorrect';

        const correctAnswersDisplay = question.answer_letters.map(letter => {
            const optionIndex = letter.charCodeAt(0) - 65;
            return `${letter}. ${question.options[optionIndex]}`;
        }).join('<br>');

        const questionTypeInfo = question.expectedChoices > 1 ? 
            ` (Required ${question.expectedChoices} answers)` : '';

        answerSection.innerHTML = `
            <div class="quiz-result ${resultClass}">
                <span class="result-icon">${isCorrect ? '✓' : '✗'}</span>
                ${resultMessage}${questionTypeInfo}
            </div>
            <div class="correct-answer">
                <div class="check-icon">✓</div>
                <div class="answer-content">
                    <div class="answer-text">
                        <strong>Correct Answer(s):</strong><br><span id="correctAnswerText">${correctAnswersDisplay}</span>
                    </div>
                    <div id="explanationText" class="explanation" style="${question.explanation ? '' : 'display:none;'}">
                        ${question.explanation || ''}
                    </div>
                </div>
            </div>
        `;
        answerSection.style.display = 'block';
    }
    
    nextQuizQuestion() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex >= this.currentQuizQuestions.length) {
            this.showScoreReport();
        } else {
            this.displayCurrentQuizQuestion();
        }
    }
    
    endQuiz() {
        clearInterval(this.timerInterval);
        this.quizInProgress = false;
        this.currentQuizQuestions = [];
        this.quizResults = [];
        this.currentQuizIndex = 0;

        document.getElementById('quizSetup').style.display = 'flex';
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('scoreReport').classList.remove('active');
    }

    showScoreReport() {
        clearInterval(this.timerInterval);
        document.getElementById('quizContainer').style.display = 'none';
        const scoreReportDiv = document.getElementById('scoreReport');
        
        const total = this.quizResults.length;
        const correct = this.quizResults.filter(r => r.isCorrect).length;
        const score = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        // Enhanced statistics
        const multichoiceResults = this.quizResults.filter(r => r.expectedChoices > 1);
        const singleChoiceResults = this.quizResults.filter(r => r.expectedChoices === 1);
        const multichoiceCorrect = multichoiceResults.filter(r => r.isCorrect).length;
        const singleChoiceCorrect = singleChoiceResults.filter(r => r.isCorrect).length;
        const timedOutCount = this.quizResults.filter(r => r.timedOut).length;
        
        // Time calculations
        const times = this.quizResults.map(r => r.timeSpent);
        const minTime = total > 0 ? Math.min(...times) : 0;
        const maxTime = total > 0 ? Math.max(...times) : 0;
        const avgTime = total > 0 ? times.reduce((a, b) => a + b, 0) / total : 0;
        let medianTime = 0;
        if (total > 0) {
            const sortedTimes = [...times].sort((a, b) => a - b);
            const mid = Math.floor(total / 2);
            medianTime = total % 2 !== 0 ? sortedTimes[mid] : (sortedTimes[mid - 1] + sortedTimes[mid]) / 2;
        }

        const resultsHTML = this.quizResults.map((result, index) => {
            const q = result.question;
            const userAnswerText = result.userAnswers.length > 0 ? 
                result.userAnswers.map(l => `${l}. ${q.options[l.charCodeAt(0)-65]}`).join('<br>') : 'No answer selected';
            const correctAnswerText = result.correctAnswers.map(l => `${l}. ${q.options[l.charCodeAt(0)-65]}`).join('<br>');
            const questionTypeLabel = result.expectedChoices > 1 ? 
                `Multichoice (${result.expectedChoices} required)` : 'Single Choice';
            const statusLabel = result.timedOut ? 'Timed Out' : (result.isCorrect ? 'Correct' : 'Incorrect');
            
            return `
                <div class="score-report-question">
                    <div class="score-question-header">
                        <span class="score-question-number">Question ${index + 1} - ${questionTypeLabel} (ID: ${q.id})</span>
                        <span class="score-time-spent">Time: ${this.formatTime(result.timeSpent)}</span>
                        <span class="score-result-badge ${result.isCorrect ? 'correct' : 'incorrect'}">${statusLabel}</span>
                    </div>
                    <div class="score-question-text">${q.question}</div>
                    <div class="score-user-answer"><span class="score-label">Your Answer(s):</span><br>${userAnswerText}</div>
                    ${!result.isCorrect ? `<div class="score-correct-answer"><span class="score-label">Correct Answer(s):</span><br>${correctAnswerText}</div>` : ''}
                    ${q.domain ? `<div style="margin-top: 0.5rem;"><span class="score-label">Domain:</span> ${q.domain}</div>` : ''}
                    ${q.category ? `<div><span class="score-label">Category:</span> ${q.category}</div>` : ''}
                    ${q.explanation ? `<div class="score-explanation"><span class="score-label">Explanation:</span> ${q.explanation}</div>` : ''}
                </div>
            `;
        }).join('');

        scoreReportDiv.innerHTML = `
            <div class="score-report">
                <div class="score-report-header">
                    <h2>Quiz Results</h2>
                    <div class="score-summary-container">
                        <div class="score-summary">
                            <div class="score-stat"><span class="score-stat-value">${score}%</span><span class="score-stat-label">Overall Score</span></div>
                            <div class="score-stat"><span class="score-stat-value">${correct}/${total}</span><span class="score-stat-label">Total Correct</span></div>
                        </div>
                        <div class="score-summary">
                            <div class="score-stat"><span class="score-stat-value">${multichoiceCorrect}/${multichoiceResults.length}</span><span class="score-stat-label">Multichoice</span></div>
                            <div class="score-stat"><span class="score-stat-value">${singleChoiceCorrect}/${singleChoiceResults.length}</span><span class="score-stat-label">Single Choice</span></div>
                            <div class="score-stat"><span class="score-stat-value">${timedOutCount}</span><span class="score-stat-label">Timed Out</span></div>
                        </div>
                        <div class="score-summary">
                            <div class="score-stat"><span class="score-stat-value">${this.formatTime(avgTime)}</span><span class="score-stat-label">Avg. Time</span></div>
                            <div class="score-stat"><span class="score-stat-value">${this.formatTime(medianTime)}</span><span class="score-stat-label">Median</span></div>
                            <div class="score-stat"><span class="score-stat-value">${this.formatTime(minTime)}</span><span class="score-stat-label">Min Time</span></div>
                            <div class="score-stat"><span class="score-stat-value">${this.formatTime(maxTime)}</span><span class="score-stat-label">Max Time</span></div>
                        </div>
                    </div>
                    <div class="score-timestamp">Completed: ${new Date().toLocaleString()}</div>
                </div>
                <div class="score-actions">
                    <button class="export-json-btn" onclick="app.exportScoreReport()">Export to JSON</button>
                    <button class="back-to-quiz-btn" onclick="app.endQuiz()">New Quiz</button>
                </div>
                <div class="score-report-questions"><h3>Question Review</h3>${resultsHTML}</div>
            </div>
        `;
        scoreReportDiv.classList.add('active');
    }

    exportScoreReport() {
        const exportData = {
            timestamp: new Date().toISOString(),
            summary: {
                totalQuestions: this.quizResults.length,
                correctAnswers: this.quizResults.filter(r => r.isCorrect).length,
                multichoiceQuestions: this.quizResults.filter(r => r.expectedChoices > 1).length,
                timedOutQuestions: this.quizResults.filter(r => r.timedOut).length
            },
            results: this.quizResults.map((r, index) => ({
                questionNumber: index + 1,
                questionId: r.question.id,
                questionText: r.question.question,
                questionType: r.expectedChoices > 1 ? 'multichoice' : 'single',
                expectedChoices: r.expectedChoices,
                domain: r.question.domain,
                category: r.question.category,
                userAnswers: r.userAnswers,
                correctAnswers: r.correctAnswers,
                isCorrect: r.isCorrect,
                timedOut: r.timedOut,
                timeSpent: r.timeSpent.toFixed(2)
            }))
        };
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const dl = document.createElement('a');
        dl.setAttribute('href', dataStr);
        dl.setAttribute('download', `quiz-results-${new Date().toISOString()}.json`);
        document.body.appendChild(dl);
        dl.click();
        dl.remove();
    }
    
    // --- Timer Methods ---
    startTimer() {
        clearInterval(this.timerInterval);
        this.questionStartTime = Date.now();
        let secondsRemaining = this.timeLimit;
        const timerEl = document.getElementById('timer');

        this.updateTimerDisplay(secondsRemaining, timerEl);

        this.timerInterval = setInterval(() => {
            secondsRemaining--;
            this.updateTimerDisplay(secondsRemaining, timerEl);
            if (secondsRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.checkUserAnswer(true); // isTimeOut = true
            }
        }, 1000);
    }

    updateTimerDisplay(seconds, timerEl) {
        timerEl.textContent = this.formatTime(seconds);
        if (seconds < 15) {
            timerEl.classList.add('low-time');
        } else {
            timerEl.classList.remove('low-time');
        }
    }

    formatTime(totalSeconds) {
        totalSeconds = Math.max(0, totalSeconds);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- Generic Helpers ---
    switchTab(tabName) {
        document.querySelectorAll('.tab-button, .tab-content').forEach(el => el.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        if (tabName === 'quiz') {
            this.endQuiz(); // Reset quiz state when switching to quiz tab
        }
    }

    resetFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('domainFilter').value = '';
        this.filteredQuestions = [...this.questions];
    }

    showLoading(tab) {
        if (tab === 'browse') {
            document.getElementById('questionsList').innerHTML = '<div class="loading">Loading...</div>';
        }
    }

    showError(message, tab) {
        if (tab === 'browse') {
            document.getElementById('questionsList').innerHTML = `<div class="error">${message}</div>`;
        }
    }
    
    shuffleArray = (array) => array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}

// Initialize the app
const app = new MCQApp();