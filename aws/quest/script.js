class MCQApp {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.categories = new Set();
        this.currentQuizQuestions = [];
        this.currentQuizIndex = 0;
        this.quizInProgress = false;
        this.currentDataset = 'aws_mcq_questions.json';
        this.tablesData = []; // To store aws_mcq_tables.json

        // Modal elements
        this.modal = document.getElementById('tableModal');
        this.modalContent = document.getElementById('tableModalContainer');
        this.modalCloseBtn = document.getElementById('tableModalClose');

        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            await this.loadTablesData(); // Load table data on init
            this.setupEventListeners();
            this.setupModalEventListeners(); // Setup listeners for the modal
            this.populateCategories();
            this.renderQuestions();
            this.updateStats();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load questions. Please refresh the page.');
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch(this.currentDataset);
            if (!response?.ok) {
                throw new Error(`HTTP error! status: ${response?.status ?? 'unknown'}`);
            }
            this.questions = await response.json() ?? [];
            // Derive answer_letters for quiz mode based on correct_answers
            this.questions.forEach(q => {
                const letters = [];
                (q.correct_answers || []).forEach(entry => {
                    entry.split('<br>').forEach(item => {
                        const m = item.trim().match(/^([A-Z])\./);
                        if (m) letters.push(m[1]);
                    });
                });
                q.answer_letters = letters;
            });
            this.filteredQuestions = [...this.questions];
            
            // Extract unique categories
            this.categories.clear();
            this.questions?.forEach?.(q => {
                if (q?.category) {
                    this.categories.add(q.category);
                }
            });
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    async loadTablesData() {
        try {
            const response = await fetch('aws_mcq_tables.json');
            if (response.ok) {
                this.tablesData = await response.json() ?? [];
            } else {
                console.warn('Could not load aws_mcq_tables.json. Table feature will be unavailable.');
                this.tablesData = [];
            }
        } catch (error) {
            console.error('Error loading tables data:', error);
            this.tablesData = [];
        }
    }

    async switchDataset(newDataset) {
        try {
            this.currentDataset = newDataset;
            
            // Show loading state
            this.showLoading();
            
            // Load new dataset
            await this.loadQuestions();
            
            // Reset filters and UI
            this.resetFilters();
            this.populateCategories();
            this.renderQuestions();
            this.updateStats();
            
            // Hide loading state
            this.hideLoading();
            
            // Reset quiz if in progress
            if (this.quizInProgress) {
                this.endQuiz();
            }
            
        } catch (error) {
            console.error('Failed to switch dataset:', error);
            this.showError('Failed to load the selected dataset. Please try again.');
            this.hideLoading();
        }
    }

    setupModalEventListeners() {
        if (this.modalCloseBtn) {
            this.modalCloseBtn.addEventListener('click', () => this.closeTableModal());
        }
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                // Close if clicking on the overlay itself, not the content
                if (e.target === this.modal) {
                    this.closeTableModal();
                }
            });
        }
    }

    closeTableModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
        if (this.modalContent) {
            this.modalContent.innerHTML = ''; // Clear content for next use
        }
    }

    setupEventListeners() {
        // Dataset selector
        document.getElementById('datasetSelect')?.addEventListener?.('change', (e) => {
            const selectedDataset = e?.target?.value;
            if (selectedDataset && selectedDataset !== this.currentDataset) {
                this.switchDataset(selectedDataset);
            }
        });

        // Navigation
        document.getElementById('searchInput')?.addEventListener?.('input', () => {
            this.filterQuestions();
        });

        document.getElementById('categoryFilter')?.addEventListener?.('change', () => {
            this.filterQuestions();
        });

        // Tab switching
        document.querySelectorAll('.tab-button')?.forEach?.(button => {
            button?.addEventListener?.('click', (e) => {
                const tabName = e?.target?.dataset?.tab;
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });

        // Quiz functionality
        document.getElementById('startQuiz')?.addEventListener?.('click', () => {
            this.startQuiz();
        });

        document.getElementById('endQuiz')?.addEventListener?.('click', () => {
            this.endQuiz();
        });

        document.getElementById('checkAnswer')?.addEventListener?.('click', () => {
            this.checkUserAnswer();
        });

        document.getElementById('showAnswer')?.addEventListener?.('click', () => {
            this.showCurrentAnswer();
        });

        document.getElementById('nextQuestion')?.addEventListener?.('click', () => {
            this.nextQuizQuestion();
        });

        // View Tables Button functionality
        const datasetSelect = document.getElementById('datasetSelect');
        const viewTablesBtn = document.getElementById('viewTablesBtn');
        if (viewTablesBtn && datasetSelect) {
            viewTablesBtn.addEventListener('click', () => {
                window.open('aws1600t.html', '_blank');
            });
            const toggleViewTablesBtn = () => {
                if (datasetSelect.value === 'aws_mcq_questions.json') {
                    viewTablesBtn.style.display = 'inline-block';
                } else {
                    viewTablesBtn.style.display = 'none';
                }
            };
            datasetSelect.addEventListener('change', toggleViewTablesBtn);
            toggleViewTablesBtn();
        }
    }

    resetFilters() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.value = '';
        }
        
        this.filteredQuestions = [...this.questions];
    }

    showLoading() {
        const questionsList = document.getElementById('questionsList');
        if (questionsList) {
            questionsList.innerHTML = '<div class="loading">Loading questions...</div>';
        }
    }

    hideLoading() {
        // Loading state will be hidden when questions are rendered
    }

    showError(message) {
        const questionsList = document.getElementById('questionsList');
        if (questionsList) {
            questionsList.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    populateCategories() {
        const categoryFilter = document.getElementById('categoryFilter');
        const quizCategory = document.getElementById('quizCategory');
        
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">All Categories</option>';
            [...this.categories]?.sort()?.forEach?.(category => {
                if (category) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categoryFilter.appendChild(option);
                }
            });
        }

        if (quizCategory) {
            quizCategory.innerHTML = '<option value="">All Categories</option>';
            [...this.categories]?.sort()?.forEach?.(category => {
                if (category) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    quizCategory.appendChild(option);
                }
            });
        }
    }

    updateStats() {
        const totalQuestions = document.getElementById('totalQuestions');
        const totalCategories = document.getElementById('totalCategories');
        
        if (totalQuestions) {
            totalQuestions.textContent = `${this.questions?.length ?? 0} Questions`;
        }
        
        if (totalCategories) {
            totalCategories.textContent = `${this.categories?.size ?? 0} Categories`;
        }
    }

    filterQuestions() {
        const searchTerm = document.getElementById('searchInput')?.value?.toLowerCase() ?? '';
        const selectedCategory = document.getElementById('categoryFilter')?.value ?? '';

        this.filteredQuestions = this.questions?.filter?.(q => {
            const matchesSearch = !searchTerm || 
                q?.question?.toLowerCase()?.includes?.(searchTerm) ||
                q?.options?.some?.(option => option?.toLowerCase()?.includes?.(searchTerm));
            
            const matchesCategory = !selectedCategory || q?.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        }) ?? [];

        this.renderQuestions();
    }

    renderQuestions() {
        const questionsList = document.getElementById('questionsList');
        if (!questionsList) return;

        if (!this.filteredQuestions?.length) {
            questionsList.innerHTML = '<div class="no-results">No questions found matching your criteria.</div>';
            return;
        }

        questionsList.innerHTML = this.filteredQuestions?.map?.(q => this.createQuestionCard(q))?.join?.('') ?? '';
    }

    createQuestionCard(question) {
        const correctAnswers = question?.correct_answers?.join?.(', ') ?? 'No answer provided';
        const hasExplanation = question?.explanation && question.explanation.trim() !== '';
        
        const chapterMap = {
            'Assessment Test': 'A', 'Chapter 1': '1', 'Chapter 2': '2', 'Chapter 3': '3',
            'Chapter 4': '4', 'Chapter 5': '5', 'Chapter 6': '6', 'Chapter 7': '7',
            'Chapter 8': '8', 'Chapter 9': '9', 'Chapter 10': '10', 'Chapter 11': '11', 'Chapter 12': '12'
        };
        let questionNumber = (question.chapter && chapterMap[question.chapter] && question.pdf_question_number)
            ? `${chapterMap[question.chapter]}${question.pdf_question_number.toString().padStart(2, '0')}`
            : question.id;
            
        const verificationStatus = question?.answer_verified !== undefined
            ? (question.answer_verified ? `<span class="verified" title="Answer verified">✅</span>` : `<span class="unverified" title="Answer not verified">❌</span>`)
            : '';

        const tableButtonContainer = this.currentDataset === 'aws_mcq_questions.json'
            ? `<div class="table-action-container">
                 <span class="table-question-label">Question ${question.id}:</span>
                 <button class="view-table-btn" onclick="app.openTableForQuestion(${question.id})">See Table</button>
               </div>`
            : '';
        
        return `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-id">${questionNumber}</span>
                    <span class="question-category">${question?.category ?? 'Uncategorized'}</span>
                    ${verificationStatus}
                </div>
                <div class="question-text">${question?.question ?? 'Question text not available'}</div>
                <div class="options">
                    ${question?.options?.map?.((option, index) => 
                        `<div class="option">
                            <span class="option-label">${String.fromCharCode(65 + index)})</span>
                            <span class="option-text">${option ?? ''}</span>
                        </div>`
                    )?.join?.('') ?? ''}
                </div>
                <div class="question-actions">
                    <button class="show-answer-btn" onclick="app.toggleAnswer(${question?.id ?? 0})">Show Answer</button>
                </div>
                <div id="answer-${question?.id ?? 0}" class="correct-answer" style="display: none;">
                    <div class="check-icon">✓</div>
                    <div class="answer-content">
                        <div class="answer-text">
                            <strong>Correct Answer:</strong> ${correctAnswers}
                        </div>
                        ${hasExplanation ? `<div class="explanation">${question.explanation}</div>` : ''}
                        ${tableButtonContainer}
                    </div>
                </div>
            </div>`;
    }

    openTableForQuestion(questionId) {
        if (!this.tablesData.length) {
            alert('Table data is not available.');
            return;
        }
        const tableData = this.tablesData.find(t => t.question == questionId.toString());

        if (!tableData) {
            alert(`No table found for Question ${questionId}.`);
            return;
        }

        let tableHtml = `<h3>Table for Question ${questionId}</h3><table>`;
        if (tableData.headers && tableData.headers.length > 0) {
            tableHtml += '<thead><tr>';
            tableData.headers.forEach(header => {
                tableHtml += `<th>${header.replace(/\n/g, '<br>')}</th>`;
            });
            tableHtml += '</tr></thead>';
        }

        if (tableData.data && tableData.data.length > 0) {
            tableHtml += '<tbody>';
            tableData.data.forEach(row => {
                tableHtml += '<tr>';
                row.forEach(cell => {
                    tableHtml += `<td>${cell.toString().replace(/\n/g, '<br>')}</td>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</tbody>';
        }
        tableHtml += '</table>';

        this.modalContent.innerHTML = tableHtml;
        this.modal.style.display = 'flex';
    }

    toggleAnswer(questionId) {
        const answerDiv = document.getElementById(`answer-${questionId}`);
        const button = document.querySelector(`button[onclick="app.toggleAnswer(${questionId})"]`);
        
        if (answerDiv && button) {
            if (answerDiv.style.display === 'none') {
                answerDiv.style.display = 'flex';
                button.textContent = 'Hide Answer';
            } else {
                answerDiv.style.display = 'none';
                button.textContent = 'Show Answer';
            }
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-button')?.forEach?.(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.querySelectorAll('.tab-content')?.forEach?.(content => content.classList.remove('active'));
        document.getElementById(`${tabName}Tab`)?.classList.add('active');
    }

    startQuiz() {
        const selectedCategory = document.getElementById('quizCategory')?.value ?? '';
        const questionCount = parseInt(document.getElementById('questionCount')?.value ?? '10');
        let availableQuestions = selectedCategory ? this.questions.filter(q => q.category === selectedCategory) : [...this.questions];

        if (!availableQuestions.length) {
            alert('No questions available for the selected category.');
            return;
        }

        this.currentQuizQuestions = this.shuffleArray(availableQuestions).slice(0, questionCount);
        this.currentQuizIndex = 0;
        this.quizInProgress = true;
        document.getElementById('quizSetup').style.display = 'none';
        document.getElementById('quizContainer').style.display = 'block';
        this.displayCurrentQuizQuestion();
    }

    endQuiz() {
        this.quizInProgress = false;
        this.currentQuizQuestions = [];
        this.currentQuizIndex = 0;
        document.getElementById('quizSetup').style.display = 'block';
        document.getElementById('quizContainer').style.display = 'none';
    }

    displayCurrentQuizQuestion() {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        if (!question) return;

        document.getElementById('questionNumber').textContent = `Question ${this.currentQuizIndex + 1} of ${this.currentQuizQuestions.length}`;
        const isMultipleChoice = question.answer_letters?.length > 1;
        const inputType = isMultipleChoice ? 'checkbox' : 'radio';

        document.getElementById('quizQuestion').innerHTML = `
            <div class="question-text">${question.question}</div>
            <div class="quiz-instructions">
                <p><strong>${isMultipleChoice ? `Select ${question.answer_letters.length} answers` : 'Select one answer'}:</strong></p>
            </div>
            <div class="quiz-options">
                ${question.options.map((option, index) => {
                    const letter = String.fromCharCode(65 + index);
                    return `
                        <div class="quiz-option" onclick="app.toggleQuizOption('${letter}')">
                            <input type="${inputType}" id="option-${letter}" name="quiz-answer" value="${letter}">
                            <span class="quiz-option-label">${letter}.</span>
                            <span class="quiz-option-text">${option}</span>
                        </div>`;
                }).join('')}
            </div>`;

        document.getElementById('answerSection').style.display = 'none';
        document.getElementById('checkAnswer').style.display = 'inline-block';
        document.getElementById('showAnswer').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'none';
        const existingResult = document.querySelector('.quiz-result');
        if (existingResult) existingResult.remove();
    }

    showCurrentAnswer() {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        if (!question) return;

        const correctAnswers = question.correct_answers.join(', ');
        const hasExplanation = question.explanation && question.explanation.trim() !== '';
        document.getElementById('correctAnswerText').innerHTML = correctAnswers;
        const explanationText = document.getElementById('explanationText');
        explanationText.innerHTML = hasExplanation ? question.explanation : '';
        explanationText.style.display = hasExplanation ? 'block' : 'none';

        const answerContentDiv = document.querySelector('#answerSection .answer-content');
        if (answerContentDiv) {
            const oldContainer = answerContentDiv.querySelector('.table-action-container');
            if(oldContainer) oldContainer.remove();

            if (this.currentDataset === 'aws_mcq_questions.json') {
                const questionId = question.id;
                const tableContainer = document.createElement('div');
                tableContainer.className = 'table-action-container';
                tableContainer.innerHTML = `
                    <span class="table-question-label">Question ${questionId}:</span>
                    <button class="view-table-btn">See Table</button>`;
                tableContainer.querySelector('button').addEventListener('click', () => this.openTableForQuestion(questionId));
                answerContentDiv.appendChild(tableContainer);
            }
        }

        document.getElementById('answerSection').style.display = 'block';
        document.getElementById('checkAnswer').style.display = 'none';
        document.getElementById('showAnswer').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'inline-block';
    }

    nextQuizQuestion() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex >= this.currentQuizQuestions.length) {
            alert('Quiz completed! Well done!');
            this.endQuiz();
        } else {
            this.displayCurrentQuizQuestion();
        }
    }

    toggleQuizOption(letter) {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        if (!question) return;

        const isMultipleChoice = question.answer_letters.length > 1;
        const checkbox = document.getElementById(`option-${letter}`);
        const option = checkbox?.closest('.quiz-option');
        if (!checkbox || !option) return;

        if (isMultipleChoice) {
            checkbox.checked = !checkbox.checked;
            option.classList.toggle('selected', checkbox.checked);
        } else {
            document.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
                const input = opt.querySelector('input');
                if (input) input.checked = false;
            });
            checkbox.checked = true;
            option.classList.add('selected');
        }
    }

    checkUserAnswer() {
        const question = this.currentQuizQuestions[this.currentQuizIndex];
        if (!question) return;

        const selectedInputs = document.querySelectorAll('.quiz-option input:checked');
        const userAnswers = Array.from(selectedInputs).map(input => input.value).sort();
        const correctAnswers = [...(question.answer_letters || [])].sort();

        if (userAnswers.length === 0) {
            alert('Please select an answer before checking.');
            return;
        }

        const isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctAnswers);

        document.querySelectorAll('.quiz-option').forEach(option => {
            const input = option.querySelector('input');
            const letter = input?.value;
            if (correctAnswers.includes(letter)) {
                option.classList.add('correct');
            } else if (userAnswers.includes(letter)) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
            if (input) input.disabled = true;
        });

        this.showQuizResult(isCorrect, question);
        this.showCurrentAnswer(); // Immediately show correct answer details
    }

    showQuizResult(isCorrect, question) {
        const resultDiv = document.createElement('div');
        resultDiv.className = `quiz-result ${isCorrect ? 'correct' : 'incorrect'}`;
        const icon = isCorrect ? '✓' : '✗';
        const message = isCorrect ? 'Correct!' : 'Incorrect!';
        resultDiv.innerHTML = `<span class="result-icon">${icon}</span> ${message}`;
        document.getElementById('quizQuestion').appendChild(resultDiv);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize the app
const app = new MCQApp();

/* ======== Lightbox (minimal, self-contained) BEGIN ======== */
(function () {
  // Inject base styles
  const style = document.createElement('style');
  style.textContent = `
    .lb-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85);
      display: none; z-index: 9999;
    }
    .lb-overlay.active { display: block; }
    .lb-stage {
      position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      overflow: hidden; cursor: grab;
    }
    .lb-stage:active { cursor: grabbing; }
    .lb-img {
      max-width: 90vw; max-height: 90vh; user-select: none; -webkit-user-drag: none;
      transform-origin: 0 0; /* top-left origin so we can compute translate + scale easily */
      will-change: transform;
      image-rendering: auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.4);
      border-radius: 8px;
      background: #111;
    }
    .lb-ui {
      position: absolute; top: 12px; right: 12px; display: flex; gap: 8px; z-index: 2;
    }
    .lb-btn {
      border: none; border-radius: 6px; padding: 6px 10px; font-size: 14px;
      background: rgba(255,255,255,0.15); color: #fff; cursor: pointer;
    }
    .lb-btn:hover { background: rgba(255,255,255,0.25); }
    .lb-caption {
      position: absolute; left: 16px; bottom: 12px; right: 16px; color: #eee;
      font-size: 12px; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
  `;
  document.head.appendChild(style);

  // Build overlay DOM
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.innerHTML = `
    <div class="lb-stage">
      <img class="lb-img" alt="Preview"/>
      <div class="lb-ui">
        <button class="lb-btn" data-action="reset" title="Reset (double-click image)">Reset</button>
        <button class="lb-btn" data-action="close" title="Close (Esc)">Close</button>
      </div>
      <div class="lb-caption"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const stage = overlay.querySelector('.lb-stage');
  const img = overlay.querySelector('.lb-img');
  const caption = overlay.querySelector('.lb-caption');

  let scale = 1;
  let tx = 0;
  let ty = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function applyTransform() {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function openLightbox(url) {
    img.src = url;
    caption.textContent = url;
    scale = 1; tx = 0; ty = 0;
    applyTransform();
    overlay.classList.add('active');
  }
  function closeLightbox() {
    overlay.classList.remove('active');
    img.src = '';
  }
  function resetView() {
    scale = 1; tx = 0; ty = 0; applyTransform();
  }

  // Wheel zoom (zoom to cursor)
  stage.addEventListener('wheel', (e) => {
    if (!overlay.classList.contains('active')) return;
    e.preventDefault();
    const rect = img.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const prevScale = scale;
    const delta = Math.sign(e.deltaY) < 0 ? 0.1 : -0.1;
    scale = Math.min(6, Math.max(0.2, scale + delta));

    // Keep the mouse point stationary (translate adjust)
    tx -= (mouseX / prevScale - mouseX / scale);
    ty -= (mouseY / prevScale - mouseY / scale);

    applyTransform();
  }, { passive: false });

  // Drag to pan
  stage.addEventListener('mousedown', (e) => {
    if (!overlay.classList.contains('active')) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    tx += dx;
    ty += dy;
    applyTransform();
  });
  window.addEventListener('mouseup', () => dragging = false);

  // Double-click image to reset
  img.addEventListener('dblclick', (e) => {
    e.preventDefault();
    resetView();
  });

  // Close actions
  overlay.addEventListener('click', (e) => {
    // Close only when clicking the backdrop, not when dragging/panning
    if (e.target === overlay) closeLightbox();
  });
  overlay.querySelector('[data-action="close"]').addEventListener('click', closeLightbox);
  overlay.querySelector('[data-action="reset"]').addEventListener('click', resetView);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeLightbox();
  });

  // Event delegation: clicks inside .explanation
  document.addEventListener('click', (e) => {
    // Find an <a class="lightbox"> or an <img> inside .explanation
    const anchor = e.target.closest('.explanation a.lightbox');
    const imgEl = e.target.closest('.explanation img');
    if (!anchor && !imgEl) return;

    let url = null;
    if (anchor) {
      // Prefer href from the anchor
      url = anchor.getAttribute('href');
    } else if (imgEl) {
      // If the image is not wrapped, use its src
      url = imgEl.getAttribute('src');
      // If the image is wrapped in an anchor but missing class, still respect its href
      const wrapA = imgEl.closest('a[href]');
      if (wrapA && wrapA.getAttribute('href')) url = wrapA.getAttribute('href');
    }
    if (!url) return;

    // If we handle it, prevent default navigation
    e.preventDefault();
    openLightbox(url);
  });
})();
/* ======== Lightbox (minimal, self-contained) END ======== */
