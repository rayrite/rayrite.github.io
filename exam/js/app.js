// AWS CLF-C02 Exam Simulator
class ExamSimulator {
    constructor() {
        this.allQuestions = [];
        this.examQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questionTimes = {}; // Total time spent on each question in milliseconds
        this.questionRemainingTimes = {}; // Remaining time for each question (countdown)
        this.globalTimer = null;
        this.questionTimer = null;
        this.globalTimeRemaining = 90 * 60; // 90 minutes in seconds
        this.questionTimeRemaining = 90; // 1:30 in seconds
        this.questionStartTime = null; // Timestamp for when the current question view started
        this.examStarted = false;
        this.examFinished = false;
        this.examInitialized = false;
        this.visitedQuestions = new Set(); // Track which questions user has visited by index
        this.globalTimerPaused = false; // Track if global timer is paused
        
        // Domain distribution for CLF-C02 exam
        this.domainDistribution = {
            'Cloud Concepts': 0.26,
            'Security and Compliance': 0.25,
            'Technology': 0.33,
            'Billing and Pricing': 0.16
        };
        
        this.init();
    }
    
    async init() {
        await this.loadQuestions();
        this.setupEventListeners();
        this.setupTabs();
        this.showInitialState();
    }
    
    async loadQuestions() {
        try {
            document.getElementById('examStatus').innerHTML = '<div class="loading-message">Loading questions...</div>';
            
            const files = [
                'data/aws_mcq_questions.json',
                'data/aws_e2_exams.json',
                'data/aws_e3_exams.json', 
                'data/aws_e4_exams.json',
                'data/aws_e5_exams.json',
                'data/aws_e6_exams.json',
                'data/aws_mock_exams.json'
            ];
            
            for (const file of files) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        const questions = await response.json();
                        if (Array.isArray(questions) && questions.length > 0) {
                            this.allQuestions = this.allQuestions.concat(questions);
                        }
                    }
                } catch (error) {
                    console.warn(`Could not load ${file}:`, error);
                }
            }
            
            if (this.allQuestions.length === 0) {
                throw new Error('No questions could be loaded from any data files.');
            }
            
            console.log(`Loaded ${this.allQuestions.length} questions`);
            this.processQuestions();
            this.mapQuestionDomains();
            
            // Show ready state
            document.getElementById('examStatus').innerHTML = `
                <p>Click "Start Exam" to begin your AWS CLF-C02 practice test.</p>
                <p>The exam will consist of 65 questions with a 90-minute time limit.</p>
                <p><strong>${this.allQuestions.length} questions loaded and ready!</strong></p>
            `;
            
        } catch (error) {
            console.error('Error loading questions:', error);
            document.getElementById('examStatus').innerHTML = `
                <div class="error-message">
                    <strong>Error loading questions:</strong><br>
                    ${error.message}<br><br>
                    Please ensure the JSON data files are available in the data/ folder.
                </div>
            `;
        }
    }
    
    processQuestions() {
        // Process each question to ensure consistent format and derive answer letters
        this.allQuestions.forEach(question => {
            // Ensure basic fields exist
            if (!question.id) {
                question.id = Math.random().toString(36).substr(2, 9);
            }
            
            if (!question.options || !Array.isArray(question.options)) {
                question.options = [];
            }
            
            if (!question.correct_answers || !Array.isArray(question.correct_answers)) {
                question.correct_answers = [];
            }
            
            // Derive answer letters from correct_answers
            const letters = [];
            const correctAnswers = question.correct_answers || [];
            
            correctAnswers.forEach(answer => {
                let match = answer.match(/^([A-Z])\.\s*/);
                if (match) {
                    letters.push(match[1]);
                    return;
                }
                match = answer.match(/<b>([A-Z])\.\s*/);
                if (match) {
                    letters.push(match[1]);
                    return;
                }
                answer.split('<br>').forEach(item => {
                    const m = item.trim().match(/^([A-Z])\./);
                    if (m) letters.push(m[1]);
                });
                if (letters.length === 0 && question.options && question.options.length > 0) {
                    const cleanAnswer = answer.replace(/<[^>]*>/g, '').trim();
                    question.options.forEach((option, index) => {
                        const cleanOption = option.replace(/<[^>]*>/g, '').trim();
                        if (cleanOption === cleanAnswer) {
                            letters.push(String.fromCharCode(65 + index));
                        }
                    });
                }
            });
            
            question.answer_letters = [...new Set(letters)].sort();
            
            if (question.answer_letters.length === 0 && question.correct_answers.length > 0) {
                question.answer_letters = ['A'];
            }
        });
    }
    
    mapQuestionDomains() {
        const domainMapping = {
            'Cloud Concepts': 'Cloud Concepts', 'Security and Compliance': 'Security and Compliance', 'Technology': 'Technology', 'Billing and Pricing': 'Billing and Pricing',
            'Compute': 'Technology', 'Storage': 'Technology', 'Database': 'Technology', 'Networking': 'Technology', 'Analytics': 'Technology', 'Machine Learning': 'Technology',
            'Management Tools': 'Technology', 'Developer Tools': 'Technology', 'IoT': 'Technology', 'Game Development': 'Technology', 'Mobile Services': 'Technology', 'AR & VR': 'Technology',
            'Application Integration': 'Technology', 'AWS Global Infrastructure': 'Cloud Concepts', 'AWS Well-Architected Framework': 'Cloud Concepts', 'AWS Pricing': 'Billing and Pricing',
            'AWS Support': 'Billing and Pricing', 'Security': 'Security and Compliance', 'Identity and Access Management': 'Security and Compliance', 'Compliance': 'Security and Compliance',
            'Assessment': 'Technology', 'Set 1': 'Technology', 'Set 2': 'Technology', 'Set 3': 'Technology', 'Mock Exam 1': 'Technology', 'Mock Exam 2': 'Technology',
            'Unknown': 'Technology', 'Uncategorized': 'Technology'
        };
        
        this.allQuestions.forEach(question => {
            const category = question.category || question.domain || 'Technology';
            question.mappedDomain = domainMapping[category] || 'Technology';
        });
    }
    
    generateExamQuestions() {
        const totalQuestions = Math.min(65, this.allQuestions.length);
        const selectedQuestions = [];
        const domainTargets = {};
        Object.keys(this.domainDistribution).forEach(domain => {
            domainTargets[domain] = Math.round(totalQuestions * this.domainDistribution[domain]);
        });
        
        const questionsByDomain = {};
        Object.keys(this.domainDistribution).forEach(domain => {
            questionsByDomain[domain] = [];
        });
        
        this.allQuestions.forEach(question => {
            const domain = question.mappedDomain;
            if (questionsByDomain[domain]) {
                questionsByDomain[domain].push(question);
            }
        });
        
        Object.keys(domainTargets).forEach(domain => {
            const target = domainTargets[domain];
            const availableQuestions = questionsByDomain[domain];
            if (availableQuestions.length > 0) {
                const shuffled = this.shuffleArray(availableQuestions);
                const selected = shuffled.slice(0, Math.min(target, shuffled.length));
                selectedQuestions.push(...selected);
            }
        });
        
        while (selectedQuestions.length < totalQuestions && selectedQuestions.length < this.allQuestions.length) {
            const remainingQuestions = this.allQuestions.filter(q => !selectedQuestions.includes(q));
            if (remainingQuestions.length > 0) {
                selectedQuestions.push(remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)]);
            } else {
                break;
            }
        }
        
        this.examQuestions = this.shuffleArray(selectedQuestions).slice(0, totalQuestions);
        console.log(`Generated exam with ${this.examQuestions.length} questions`);
        console.log('Domain distribution:', this.getActualDomainDistribution());
    }
    
    getActualDomainDistribution() {
        const distribution = {};
        this.examQuestions.forEach(question => {
            const domain = question.mappedDomain;
            distribution[domain] = (distribution[domain] || 0) + 1;
        });
        return distribution;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    setupEventListeners() {
        document.getElementById('startExam').addEventListener('click', () => this.startExam());
        document.getElementById('stopExam').addEventListener('click', () => this.stopExam());
        document.getElementById('startGlobalTimer').addEventListener('click', () => this.startGlobalTimer());
        document.getElementById('pauseGlobalTimer').addEventListener('click', () => this.pauseGlobalTimer());
        document.getElementById('stopGlobalTimer').addEventListener('click', () => this.stopGlobalTimer());
        document.getElementById('resetGlobalTimer').addEventListener('click', () => this.resetGlobalTimer());
        document.getElementById('prevQuestion').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finishExam').addEventListener('click', () => this.finishExam());
        document.getElementById('exportResults').addEventListener('click', () => this.exportResults());
        
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="answer"]')) {
                this.recordAnswer();
            }
        });

        // Event delegation for clickable legend dots
        document.getElementById('examLegendDots').addEventListener('click', (e) => {
            if (e.target.matches('.legend-dot-nav')) {
                const index = parseInt(e.target.dataset.questionIndex, 10);
                this.navigateToQuestion(index);
            }
        });

        // Mobile Menu controls
        document.getElementById('mobileMenuToggle').addEventListener('click', () => this.toggleMobileMenu(true));
        document.getElementById('closeMobileMenu').addEventListener('click', () => this.toggleMobileMenu(false));
        document.getElementById('overlay').addEventListener('click', () => this.toggleMobileMenu(false));
        document.getElementById('stopExamMobile').addEventListener('click', () => {
            this.toggleMobileMenu(false); // Close menu first
            this.stopExam();
        });
    }

    toggleMobileMenu(open) {
        const body = document.body;
        if (open) {
            body.classList.add('menu-open');
        } else {
            body.classList.remove('menu-open');
        }
    }
    
    showInitialState() {
        document.getElementById('examControls').style.display = 'block';
        document.getElementById('examInterface').style.display = 'none';
        document.getElementById('examLegend').style.display = 'none';
        this.globalTimerPaused = false;
        this.updateGlobalTimerDisplay();
        this.updateQuestionTimerDisplay();
        document.getElementById('reviewTab').style.opacity = '0.5';
        document.getElementById('reviewTab').style.pointerEvents = 'none';
    }
    
    async startExam() {
        try {
            if (this.allQuestions.length === 0) {
                alert('No questions available. Please ensure the data files are loaded correctly.');
                return;
            }
            
            document.getElementById('examStatus').innerHTML = '<div class="loading-message">Generating exam questions...</div>';
            this.generateExamQuestions();
            
            if (this.examQuestions.length === 0) {
                throw new Error('No exam questions could be generated.');
            }
            
            this.examInitialized = true;
            this.examStarted = true;
            this.globalTimerPaused = false;
            this.questionRemainingTimes = {};
            this.questionTimes = {};
            
            document.getElementById('examControls').style.display = 'none';
            document.getElementById('examInterface').style.display = 'block';
            document.getElementById('examLegend').style.display = 'block';

            this.createExamLegend();
            this.displayQuestion();
            this.updateUI();
            this.startGlobalTimer();
            
            console.log('Exam started successfully');
        } catch (error) {
            console.error('Error starting exam:', error);
            document.getElementById('examStatus').innerHTML = `
                <div class="error-message">
                    <strong>Error starting exam:</strong><br>
                    ${error.message}
                </div>
            `;
        }
    }
    
    stopExam() {
        if (confirm('Are you sure you want to stop the exam? Your current progress will be saved and scored.')) {
            this.examFinished = true;
            this.stopGlobalTimer();
            if (this.examInitialized && this.examQuestions.length > 0) {
                this.saveCurrentQuestionState();
            }
            document.getElementById('reviewTab').style.opacity = '1';
            document.getElementById('reviewTab').style.pointerEvents = 'auto';
            document.getElementById('reviewTab').click();
            alert('Exam stopped! Check the Review tab for your results.');
        }
    }
    
    setupTabs() {
        const examTab = document.getElementById('examTab');
        const reviewTab = document.getElementById('reviewTab');
        const examContent = document.getElementById('examContent');
        const reviewContent = document.getElementById('reviewContent');
        
        examTab.addEventListener('click', () => {
            examTab.classList.add('active');
            reviewTab.classList.remove('active');
            examContent.classList.add('active');
            reviewContent.classList.remove('active');
        });
        
        reviewTab.addEventListener('click', () => {
            if (this.examFinished) {
                reviewTab.classList.add('active');
                examTab.classList.remove('active');
                reviewContent.classList.add('active');
                examContent.classList.remove('active');
                this.displayReview();
            } else {
                alert('Please finish the exam first to view results.');
            }
        });
    }
    
    displayQuestion() {
        if (this.examQuestions.length === 0) return;
        
        const question = this.examQuestions[this.currentQuestionIndex];
        const questionText = document.getElementById('questionText');
        const questionOptions = document.getElementById('questionOptions');
        
        this.visitedQuestions.add(this.currentQuestionIndex);
        questionText.textContent = question.question || 'Question text not available';
        questionOptions.innerHTML = '';
        
        const isMultiple = question.answer_letters && question.answer_letters.length > 1;
        const inputType = isMultiple ? 'checkbox' : 'radio';
        
        if (isMultiple) {
            const instruction = document.createElement('div');
            instruction.className = 'question-instruction';
            instruction.textContent = `Select ${question.answer_letters.length} answers:`;
            questionOptions.appendChild(instruction);
        }
        
        if (question.options && question.options.length > 0) {
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                const input = document.createElement('input');
                input.type = inputType;
                input.name = 'answer';
                input.value = String.fromCharCode(65 + index);
                input.id = `option${index}`;
                const label = document.createElement('label');
                label.htmlFor = `option${index}`;
                label.className = 'option-text';
                label.textContent = option;
                optionDiv.appendChild(input);
                optionDiv.appendChild(label);
                optionDiv.addEventListener('click', (e) => {
                    if (e.target !== input) {
                        if (inputType === 'radio') {
                            input.checked = true;
                        } else {
                            input.checked = !input.checked;
                        }
                        this.recordAnswer();
                    }
                });
                questionOptions.appendChild(optionDiv);
            });
        } else {
            questionOptions.innerHTML = '<div class="error-message">No options available for this question.</div>';
        }
        
        this.restoreAnswers();
        this.startQuestionTimer();
        this.updateUI();
        this.updateExamLegend();
    }

    createExamLegend() {
        const dotsContainer = document.getElementById('examLegendDots');
        dotsContainer.innerHTML = ''; // Clear previous legend
        this.examQuestions.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'legend-dot-nav';
            dot.dataset.questionIndex = index;
            dot.textContent = index + 1;
            dotsContainer.appendChild(dot);
        });
        this.updateExamLegend();
    }

    updateExamLegend() {
        if (!this.examStarted) return;
        const dots = document.querySelectorAll('.legend-dot-nav');
        dots.forEach((dot, index) => {
            const questionId = this.examQuestions[index].id;
            const hasAnswer = this.userAnswers[questionId] && this.userAnswers[questionId].length > 0;
            const isVisited = this.visitedQuestions.has(index);

            dot.classList.remove('not-visited', 'visited', 'answered', 'current');

            if (index === this.currentQuestionIndex) {
                dot.classList.add('current');
            }

            if (hasAnswer) {
                dot.classList.add('answered');
            } else if (isVisited) {
                dot.classList.add('visited');
            } else {
                dot.classList.add('not-visited');
            }
        });
    }

    navigateToQuestion(index) {
        if (!this.examStarted || this.examFinished || index === this.currentQuestionIndex) {
            return;
        }
        if (index >= 0 && index < this.examQuestions.length) {
            this.saveCurrentQuestionState();
            this.currentQuestionIndex = index;
            this.displayQuestion();
        }
    }
    
    restoreAnswers() {
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        const savedAnswers = this.userAnswers[questionId];
        
        if (savedAnswers) {
            const inputs = document.querySelectorAll('input[name="answer"]');
            inputs.forEach(input => {
                if (savedAnswers.includes(input.value)) {
                    input.checked = true;
                    input.closest('.option').classList.add('selected');
                }
            });
        }
    }
    
    recordAnswer() {
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        const selectedInputs = document.querySelectorAll('input[name="answer"]:checked');
        const answers = Array.from(selectedInputs).map(input => input.value);
        
        this.userAnswers[questionId] = answers;
        
        document.querySelectorAll('.option').forEach(option => {
            const input = option.querySelector('input');
            if (input && input.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        this.updateExamLegend();
    }
    
    startGlobalTimer() {
        if (!this.examStarted) {
            this.examStarted = true;
        }
        if (this.globalTimer) {
            clearInterval(this.globalTimer);
        }
        this.globalTimerPaused = false;
        this.globalTimer = setInterval(() => {
            this.globalTimeRemaining--;
            this.updateGlobalTimerDisplay();
            if (this.globalTimeRemaining <= 0) {
                this.finishExam();
            }
        }, 1000);
        if (this.examInitialized && this.examQuestions.length > 0) {
            this.startQuestionTimer();
        }
        document.getElementById('startGlobalTimer').disabled = true;
        document.getElementById('pauseGlobalTimer').disabled = false;
        document.getElementById('stopGlobalTimer').disabled = false;
    }
    
    pauseGlobalTimer() {
        if (this.globalTimer) {
            clearInterval(this.globalTimer);
            this.globalTimer = null;
        }
        this.globalTimerPaused = true;
        this.stopQuestionTimer();
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
    }
    
    stopGlobalTimer() {
        if (this.globalTimer) {
            clearInterval(this.globalTimer);
            this.globalTimer = null;
        }
        this.globalTimerPaused = true;
        this.stopQuestionTimer();
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
        document.getElementById('stopGlobalTimer').disabled = true;
    }
    
    resetGlobalTimer() {
        this.stopGlobalTimer();
        this.globalTimeRemaining = 90 * 60;
        this.globalTimerPaused = false;
        this.updateGlobalTimerDisplay();
        this.questionTimeRemaining = 90;
        this.updateQuestionTimerDisplay();
        this.questionRemainingTimes = {};
        this.questionTimes = {};
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
        document.getElementById('stopGlobalTimer').disabled = true;
    }
    
    startQuestionTimer() {
        if (this.globalTimerPaused) return;
        if (this.questionTimer) clearInterval(this.questionTimer);
        
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        this.questionTimeRemaining = this.questionRemainingTimes[questionId] !== undefined 
            ? this.questionRemainingTimes[questionId] 
            : 90;
        
        this.questionStartTime = Date.now();
        this.updateQuestionTimerDisplay();
        
        this.questionTimer = setInterval(() => {
            if (!this.globalTimerPaused) {
                this.questionTimeRemaining--;
                this.updateQuestionTimerDisplay();
                if (this.questionTimeRemaining <= 0) {
                    clearInterval(this.questionTimer);
                    this.questionTimer = null;
                }
            }
        }, 1000);
    }
    
    stopQuestionTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
        if (this.examQuestions.length > 0) {
            const questionId = this.examQuestions[this.currentQuestionIndex].id;
            this.questionRemainingTimes[questionId] = this.questionTimeRemaining;
        }
    }
    
    updateGlobalTimerDisplay() {
        const minutes = Math.floor(this.globalTimeRemaining / 60);
        const seconds = this.globalTimeRemaining % 60;
        document.getElementById('globalTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateQuestionTimerDisplay() {
        const minutes = Math.floor(this.questionTimeRemaining / 60);
        const seconds = this.questionTimeRemaining % 60;
        document.getElementById('questionTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateUI() {
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.examQuestions.length;
        const progress = ((this.currentQuestionIndex + 1) / this.examQuestions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('prevQuestion').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextQuestion').disabled = this.currentQuestionIndex === this.examQuestions.length - 1;
        document.getElementById('finishExam').style.display = this.currentQuestionIndex === this.examQuestions.length - 1 ? 'block' : 'none';
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.saveCurrentQuestionState();
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.examQuestions.length - 1) {
            this.saveCurrentQuestionState();
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    saveCurrentQuestionState() {
        this.recordAnswer();
        if (this.questionStartTime) {
            const timeSpent = Date.now() - this.questionStartTime;
            const questionId = this.examQuestions[this.currentQuestionIndex].id;
            this.questionTimes[questionId] = (this.questionTimes[questionId] || 0) + timeSpent;
            this.questionStartTime = null;
        }
        this.stopQuestionTimer();
    }
    
    finishExam() {
        this.saveCurrentQuestionState();
        this.examFinished = true;
        this.stopGlobalTimer();
        document.getElementById('reviewTab').style.opacity = '1';
        document.getElementById('reviewTab').style.pointerEvents = 'auto';
        document.getElementById('reviewTab').click();
        alert('Exam completed! Check the Review tab for your results.');
    }
    
    displayReview() {
        const scoreResult = this.calculateScore();
        const percentage = scoreResult.totalVisited > 0 ? Math.round((scoreResult.correct / scoreResult.totalVisited) * 100) : 0;
        const totalTimeSpent = this.calculateTotalTime();
        
        document.getElementById('scorePercentage').textContent = `${percentage}%`;
        document.getElementById('correctAnswers').textContent = scoreResult.correct;
        document.getElementById('totalAnswered').textContent = scoreResult.totalVisited;
        document.getElementById('totalTime').textContent = this.formatTime(totalTimeSpent);
        
        const scoreDetails = document.querySelector('.score-details');
        const existingNote = scoreDetails.querySelector('.incomplete-note');
        if (existingNote) existingNote.remove();
        
        if (scoreResult.totalVisited < this.examQuestions.length) {
            const incompleteNote = document.createElement('p');
            incompleteNote.className = 'incomplete-note';
            incompleteNote.textContent = `Incomplete Exam: ${scoreResult.totalVisited}/${this.examQuestions.length} questions attempted`;
            incompleteNote.style.color = '#dc3545';
            incompleteNote.style.fontWeight = 'bold';
            scoreDetails.appendChild(incompleteNote);
        }
        
        const scoreCircle = document.querySelector('.score-circle');
        if (percentage >= 70) scoreCircle.style.background = '#28a745';
        else if (percentage >= 50) scoreCircle.style.background = '#ffc107';
        else scoreCircle.style.background = '#dc3545';
        
        // Display time statistics
        const timeStats = this.calculateTimeStats();
        document.getElementById('avgTime').textContent = this.formatTime(timeStats.avg);
        document.getElementById('minTime').textContent = this.formatTime(timeStats.min);
        document.getElementById('maxTime').textContent = this.formatTime(timeStats.max);
        document.getElementById('medianTime').textContent = this.formatTime(timeStats.median);

        this.displayReviewQuestions();
    }

    calculateTimeStats() {
        const times = Object.values(this.questionTimes);
        if (times.length === 0) {
            return { min: 0, max: 0, avg: 0, median: 0 };
        }

        const min = Math.min(...times);
        const max = Math.max(...times);
        const avg = times.reduce((sum, time) => sum + time, 0) / times.length;

        const sortedTimes = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sortedTimes.length / 2);
        const median = sortedTimes.length % 2 !== 0
            ? sortedTimes[mid]
            : (sortedTimes[mid - 1] + sortedTimes[mid]) / 2;

        return { min, max, avg, median };
    }
    
    displayReviewQuestions() {
        const reviewContainer = document.getElementById('reviewQuestions');
        reviewContainer.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            if (!this.visitedQuestions.has(index)) return;
            
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            const timeSpent = this.questionTimes[question.id] || 0;
            
            const questionDiv = document.createElement('div');
            questionDiv.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const userAnswerTexts = userAnswers.map(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                return question.options && question.options[optionIndex] 
                    ? `${letter}. ${question.options[optionIndex]}` : letter;
            });
            
            const correctAnswerTexts = question.answer_letters.map(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                return question.options && question.options[optionIndex]
                    ? `${letter}. ${question.options[optionIndex]}` : letter;
            });
            
            questionDiv.innerHTML = `
                <div class="review-question-header">
                    <span class="review-question-number">Question ${index + 1}</span>
                    <span class="review-question-time">Time: ${this.formatTime(timeSpent)}</span>
                    <span class="review-question-status ${isCorrect ? 'correct' : 'incorrect'}">
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                <div class="review-question-text">${question.question || 'Question text not available'}</div>
                <div class="review-answers">
                    <h4>Your Answer(s):</h4>
                    ${userAnswerTexts.length > 0 ? 
                        userAnswerTexts.map(answer => `<div class="review-answer user-answer">${answer}</div>`).join('') :
                        '<div class="review-answer user-answer">No answer selected</div>'
                    }
                    <h4>Correct Answer(s):</h4>
                    ${correctAnswerTexts.map(answer => `<div class="review-answer correct-answer">${answer}</div>`).join('')}
                </div>
                <div class="review-explanation">
                    <h4>Explanation:</h4>
                    <div>${question.explanation || 'No explanation available.'}</div>
                </div>
            `;
            reviewContainer.appendChild(questionDiv);
        });
    }
    
    calculateScore() {
        let correct = 0;
        let totalVisited = 0;
        this.examQuestions.forEach((question, index) => {
            if (this.visitedQuestions.has(index)) {
                totalVisited++;
                const userAnswers = this.userAnswers[question.id] || [];
                if (this.isAnswerCorrect(question, userAnswers)) {
                    correct++;
                }
            }
        });
        return { correct, totalVisited };
    }
    
    isAnswerCorrect(question, userAnswers) {
        const correctAnswers = (question.answer_letters || []).sort();
        const sortedUserAnswers = userAnswers.sort();
        return correctAnswers.length === sortedUserAnswers.length &&
               correctAnswers.every((answer, index) => answer === sortedUserAnswers[index]);
    }
    
    calculateTotalTime() {
        return Object.values(this.questionTimes).reduce((total, time) => total + time, 0);
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    exportResults() {
        const results = this.generateResultsMarkdown();
        const blob = new Blob([results], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aws-clf-c02-exam-results-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    generateResultsMarkdown() {
        const scoreResult = this.calculateScore();
        const percentage = scoreResult.totalVisited > 0 ? Math.round((scoreResult.correct / scoreResult.totalVisited) * 100) : 0;
        const totalTimeSpent = this.calculateTotalTime();
        
        let markdown = `# AWS CLF-C02 Exam Results\n\n`;
        markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
        markdown += `**Score:** ${scoreResult.correct}/${scoreResult.totalVisited} (${percentage}%)\n`;
        if (scoreResult.totalVisited < this.examQuestions.length) {
            markdown += `**Exam Status:** Incomplete - ${scoreResult.totalVisited}/${this.examQuestions.length} questions attempted\n`;
        } else {
            markdown += `**Exam Status:** Complete\n`;
        }
        markdown += `**Total Time:** ${this.formatTime(totalTimeSpent)}\n`;
        markdown += `**Pass/Fail:** ${percentage >= 70 ? 'PASS' : 'FAIL'}\n\n`;
        
        markdown += `## Domain Performance\n\n`;
        const domainStats = this.calculateDomainStats();
        Object.keys(domainStats).forEach(domain => {
            const stats = domainStats[domain];
            const domainPercentage = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            markdown += `- **${domain}:** ${stats.correct}/${stats.total} (${domainPercentage}%)\n`;
        });
        
        markdown += `\n## Detailed Results\n\n`;
        
        this.examQuestions.forEach((question, index) => {
            if (!this.visitedQuestions.has(index)) return;
            
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            const timeSpent = this.questionTimes[question.id] || 0;
            
            markdown += `### Question ${index + 1} ${isCorrect ? '✅' : '❌'}\n\n`;
            markdown += `**Domain:** ${question.mappedDomain}\n`;
            markdown += `**Time:** ${this.formatTime(timeSpent)}\n\n`;
            markdown += `**Question:** ${question.question || 'Question text not available'}\n\n`;
            
            markdown += `**Your Answer(s):**\n`;
            if (userAnswers.length > 0) {
                userAnswers.forEach(letter => {
                    const optionIndex = letter.charCodeAt(0) - 65;
                    const optionText = question.options && question.options[optionIndex] ? question.options[optionIndex] : letter;
                    markdown += `- ${letter}. ${optionText}\n`;
                });
            } else {
                markdown += `- No answer selected\n`;
            }
            
            markdown += `\n**Correct Answer(s):**\n`;
            (question.answer_letters || []).forEach(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                const optionText = question.options && question.options[optionIndex] ? question.options[optionIndex] : letter;
                markdown += `- ${letter}. ${optionText}\n`;
            });
            
            markdown += `\n**Explanation:** ${question.explanation || 'No explanation available.'}\n\n`;
            markdown += `---\n\n`;
        });
        
        return markdown;
    }
    
    calculateDomainStats() {
        const stats = {};
        this.examQuestions.forEach((question, index) => {
            if (this.visitedQuestions.has(index)) {
                const domain = question.mappedDomain;
                if (!stats[domain]) {
                    stats[domain] = { correct: 0, total: 0 };
                }
                stats[domain].total++;
                const userAnswers = this.userAnswers[question.id] || [];
                if (this.isAnswerCorrect(question, userAnswers)) {
                    stats[domain].correct++;
                }
            }
        });
        return stats;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ExamSimulator();
});
