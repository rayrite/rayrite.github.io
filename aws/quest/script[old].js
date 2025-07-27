

class MCQApp {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.categories = new Set();
        this.currentQuizQuestions = [];
        this.currentQuizIndex = 0;
        this.quizInProgress = false;
        this.currentDataset = 'aws_mcq_questions.json';
        
        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
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

    setupEventListeners() {
        // Dataset selector
        document.getElementById('datasetSelect')?.addEventListener?.('change', (e) => {
            const selectedDataset = e?.target?.value;
            if (selectedDataset && selectedDataset !== this.currentDataset) {
                this.switchDataset(selectedDataset);
            }
        });

        // Navigation
        document.getElementById('searchInput')?.addEventListener?.('input', (e) => {
            this.filterQuestions();
        });

        document.getElementById('categoryFilter')?.addEventListener?.('change', (e) => {
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

        document.getElementById('showAnswer')?.addEventListener?.('click', () => {
            this.showCurrentAnswer();
        });

        document.getElementById('nextQuestion')?.addEventListener?.('click', () => {
            this.nextQuizQuestion();
        });
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
        
        return `
            <div class="question-card">
                <div class="question-header">
                    <span class="question-id">Q${question?.id ?? 'N/A'}</span>
                    <span class="question-category">${question?.category ?? 'Uncategorized'}</span>
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
                    <button class="show-answer-btn" onclick="app.toggleAnswer(${question?.id ?? 0})">
                        Show Answer
                    </button>
                </div>
                <div id="answer-${question?.id ?? 0}" class="correct-answer" style="display: none;">
                    <div class="check-icon">✓</div>
                    <div class="answer-content">
                        <div class="answer-text">
                            <strong>Correct Answer:</strong> ${correctAnswers}
                        </div>
                        ${hasExplanation ? `<div class="explanation">${question.explanation}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
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
        // Update tab buttons
        document.querySelectorAll('.tab-button')?.forEach?.(btn => {
            btn?.classList?.remove?.('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`)?.classList?.add?.('active');

        // Update tab content
        document.querySelectorAll('.tab-content')?.forEach?.(content => {
            content?.classList?.remove?.('active');
        });
        document.getElementById(`${tabName}Tab`)?.classList?.add?.('active');
    }

    startQuiz() {
        const selectedCategory = document.getElementById('quizCategory')?.value ?? '';
        const questionCount = parseInt(document.getElementById('questionCount')?.value ?? '10');

        let availableQuestions = selectedCategory 
            ? this.questions?.filter?.(q => q?.category === selectedCategory) ?? []
            : [...this.questions];

        if (!availableQuestions?.length) {
            alert('No questions available for the selected category.');
            return;
        }

        // Shuffle and limit questions
        this.currentQuizQuestions = this.shuffleArray(availableQuestions)?.slice?.(0, questionCount) ?? [];
        this.currentQuizIndex = 0;
        this.quizInProgress = true;

        // Show quiz container
        document.getElementById('quizSetup')?.style?.setProperty?.('display', 'none');
        document.getElementById('quizContainer')?.style?.setProperty?.('display', 'block');

        this.displayCurrentQuizQuestion();
    }

    endQuiz() {
        this.quizInProgress = false;
        this.currentQuizQuestions = [];
        this.currentQuizIndex = 0;

        // Show setup, hide quiz
        document.getElementById('quizSetup')?.style?.setProperty?.('display', 'block');
        document.getElementById('quizContainer')?.style?.setProperty?.('display', 'none');
    }

    displayCurrentQuizQuestion() {
        const question = this.currentQuizQuestions?.[this.currentQuizIndex];
        if (!question) return;

        // Update question number
        const questionNumber = document.getElementById('questionNumber');
        if (questionNumber) {
            questionNumber.textContent = `Question ${this.currentQuizIndex + 1} of ${this.currentQuizQuestions?.length ?? 0}`;
        }

        // Display question
        const quizQuestion = document.getElementById('quizQuestion');
        if (quizQuestion) {
            quizQuestion.innerHTML = `
                <div class="question-text">${question?.question ?? 'Question not available'}</div>
                <div class="options">
                    ${question?.options?.map?.((option, index) => 
                        `<div class="option">
                            <span class="option-label">${String.fromCharCode(65 + index)})</span>
                            <span class="option-text">${option ?? ''}</span>
                        </div>`
                    )?.join?.('') ?? ''}
                </div>
            `;
        }

        // Reset answer section
        document.getElementById('answerSection')?.style?.setProperty?.('display', 'none');
        document.getElementById('showAnswer')?.style?.setProperty?.('display', 'inline-block');
        document.getElementById('nextQuestion')?.style?.setProperty?.('display', 'none');
    }

    showCurrentAnswer() {
        const question = this.currentQuizQuestions?.[this.currentQuizIndex];
        if (!question) return;

        const correctAnswers = question?.correct_answers?.join?.(', ') ?? 'No answer provided';
        const hasExplanation = question?.explanation && question.explanation.trim() !== '';

        // Update answer content
        const correctAnswerText = document.getElementById('correctAnswerText');
        if (correctAnswerText) {
            correctAnswerText.textContent = correctAnswers;
        }

        const explanationText = document.getElementById('explanationText');
        if (explanationText) {
            explanationText.innerHTML = hasExplanation ? question.explanation : '';
            explanationText.style.display = hasExplanation ? 'block' : 'none';
        }

        // Show answer section and next button
        document.getElementById('answerSection')?.style?.setProperty?.('display', 'block');
        document.getElementById('showAnswer')?.style?.setProperty?.('display', 'none');
        document.getElementById('nextQuestion')?.style?.setProperty?.('display', 'inline-block');
    }

    nextQuizQuestion() {
        this.currentQuizIndex++;
        
        if (this.currentQuizIndex >= (this.currentQuizQuestions?.length ?? 0)) {
            alert('Quiz completed! Well done!');
            this.endQuiz();
        } else {
            this.displayCurrentQuizQuestion();
        }
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
