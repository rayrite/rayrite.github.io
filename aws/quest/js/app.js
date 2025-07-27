// Global variables
let allQuestions = [];
let filteredQuestions = [];
let currentQuizQuestions = [];
let currentQuizIndex = 0;
let quizScore = 0;
let currentView = 'compact';

// DOM elements
const elements = {
    // Navigation
    navTabs: document.querySelectorAll('.nav-tab'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Browse tab
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    domainFilter: document.getElementById('domain-filter'),
    topicFilter: document.getElementById('topic-filter'),
    difficultyFilter: document.getElementById('difficulty-filter'),
    resetFilters: document.getElementById('reset-filters'),
    resultsCount: document.getElementById('results-count'),
    compactView: document.getElementById('compact-view'),
    detailedView: document.getElementById('detailed-view'),
    questionsList: document.getElementById('questions-list'),
    loading: document.getElementById('loading'),
    
    // Quiz tab
    quizDomain: document.getElementById('quiz-domain'),
    quizCount: document.getElementById('quiz-count'),
    startQuiz: document.getElementById('start-quiz'),
    quizContent: document.getElementById('quiz-content'),
    quizResults: document.getElementById('quiz-results'),
    
    // Quiz content
    currentQuestion: document.getElementById('current-question'),
    totalQuestions: document.getElementById('total-questions'),
    progressFill: document.querySelector('.progress-fill'),
    quizQuestionNumber: document.getElementById('quiz-question-number'),
    quizQuestionDomain: document.getElementById('quiz-question-domain'),
    quizQuestionDifficulty: document.getElementById('quiz-question-difficulty'),
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizOptions: document.getElementById('quiz-options'),
    quizAnswerSection: document.getElementById('quiz-answer-section'),
    quizCorrectAnswer: document.getElementById('quiz-correct-answer'),
    quizExplanation: document.getElementById('quiz-explanation'),
    quizTableContainer: document.getElementById('quiz-table-container'),
    quizTable: document.getElementById('quiz-table'),
    revealAnswer: document.getElementById('reveal-answer'),
    nextQuestion: document.getElementById('next-question'),
    finishQuiz: document.getElementById('finish-quiz'),
    
    // Quiz results
    finalScore: document.getElementById('final-score'),
    finalTotal: document.getElementById('final-total'),
    scorePercentage: document.getElementById('score-percentage'),
    restartQuiz: document.getElementById('restart-quiz'),
    reviewAnswers: document.getElementById('review-answers'),
    
    // Modal
    modal: document.getElementById('question-modal'),
    modalClose: document.querySelector('.modal-close'),
    modalQuestionId: document.getElementById('modal-question-id'),
    modalDomain: document.getElementById('modal-domain'),
    modalDifficulty: document.getElementById('modal-difficulty'),
    modalQuestionText: document.getElementById('modal-question-text'),
    modalOptions: document.getElementById('modal-options'),
    modalCorrectAnswer: document.getElementById('modal-correct-answer'),
    modalExplanation: document.getElementById('modal-explanation'),
    modalTableContainer: document.getElementById('modal-table-container'),
    modalTable: document.getElementById('modal-table')
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadQuestions();
    setupEventListeners();
    populateFilters();
    displayQuestions();
});

// Load questions from JSON file
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        const data = await response.json();
        allQuestions = data.questions;
        filteredQuestions = [...allQuestions];
        
        console.log(`Loaded ${allQuestions.length} questions`);
        elements.loading.style.display = 'none';
    } catch (error) {
        console.error('Error loading questions:', error);
        elements.loading.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error loading questions. Please refresh the page.';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation tabs
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Search and filters
    elements.searchInput.addEventListener('input', debounce(handleSearch, 300));
    elements.clearSearch.addEventListener('click', clearSearch);
    elements.domainFilter.addEventListener('change', applyFilters);
    elements.topicFilter.addEventListener('change', applyFilters);
    elements.difficultyFilter.addEventListener('change', applyFilters);
    elements.resetFilters.addEventListener('click', resetFilters);
    
    // View options
    elements.compactView.addEventListener('click', () => setView('compact'));
    elements.detailedView.addEventListener('click', () => setView('detailed'));
    
    // Quiz controls
    elements.startQuiz.addEventListener('click', startQuiz);
    elements.revealAnswer.addEventListener('click', revealAnswer);
    elements.nextQuestion.addEventListener('click', nextQuizQuestion);
    elements.finishQuiz.addEventListener('click', finishQuiz);
    elements.restartQuiz.addEventListener('click', restartQuiz);
    elements.reviewAnswers.addEventListener('click', reviewAnswers);
    
    // Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Handle keyboard shortcuts
function handleKeyboard(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Switch between tabs
function switchTab(tabName) {
    elements.navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// Populate filter dropdowns
function populateFilters() {
    const domains = [...new Set(allQuestions.map(q => q.domain))].sort();
    const topics = [...new Set(allQuestions.map(q => q.topic))].sort();
    
    // Populate domain filters
    [elements.domainFilter, elements.quizDomain].forEach(select => {
        domains.forEach(domain => {
            const option = document.createElement('option');
            option.value = domain;
            option.textContent = domain;
            select.appendChild(option);
        });
    });
    
    // Populate topic filter
    topics.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic;
        option.textContent = topic;
        elements.topicFilter.appendChild(option);
    });
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle search input
function handleSearch() {
    applyFilters();
}

// Clear search
function clearSearch() {
    elements.searchInput.value = '';
    applyFilters();
}

// Apply all filters
function applyFilters() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const domainFilter = elements.domainFilter.value;
    const topicFilter = elements.topicFilter.value;
    const difficultyFilter = elements.difficultyFilter.value;
    
    filteredQuestions = allQuestions.filter(question => {
        // Search filter
        const matchesSearch = !searchTerm || 
            question.question.toLowerCase().includes(searchTerm) ||
            question.explanation.toLowerCase().includes(searchTerm) ||
            question.options.some(opt => opt.toLowerCase().includes(searchTerm)) ||
            question.correct_answer.toLowerCase().includes(searchTerm);
        
        // Domain filter
        const matchesDomain = !domainFilter || question.domain === domainFilter;
        
        // Topic filter
        const matchesTopic = !topicFilter || question.topic === topicFilter;
        
        // Difficulty filter
        const matchesDifficulty = !difficultyFilter || question.difficulty === difficultyFilter;
        
        return matchesSearch && matchesDomain && matchesTopic && matchesDifficulty;
    });
    
    displayQuestions();
}

// Reset all filters
function resetFilters() {
    elements.searchInput.value = '';
    elements.domainFilter.value = '';
    elements.topicFilter.value = '';
    elements.difficultyFilter.value = '';
    applyFilters();
}

// Set view mode
function setView(viewMode) {
    currentView = viewMode;
    elements.compactView.classList.toggle('active', viewMode === 'compact');
    elements.detailedView.classList.toggle('active', viewMode === 'detailed');
    elements.questionsList.classList.toggle('detailed', viewMode === 'detailed');
    displayQuestions();
}

// Display questions
function displayQuestions() {
    elements.resultsCount.textContent = `Showing ${filteredQuestions.length} of ${allQuestions.length} questions`;
    
    if (filteredQuestions.length === 0) {
        elements.questionsList.innerHTML = '<div class="no-results">No questions found matching your criteria.</div>';
        return;
    }
    
    const questionsHTML = filteredQuestions.map(question => {
        return createQuestionCard(question, currentView);
    }).join('');
    
    elements.questionsList.innerHTML = questionsHTML;
    
    // Add click listeners to question cards
    document.querySelectorAll('.question-card').forEach(card => {
        card.addEventListener('click', () => {
            const questionId = parseInt(card.dataset.questionId);
            const question = allQuestions.find(q => q.id === questionId);
            showQuestionModal(question);
        });
    });
}

// Create question card HTML
function createQuestionCard(question, viewMode) {
    const optionsHTML = viewMode === 'detailed' ? `
        <div class="options-preview">
            <h4>Answer Choices:</h4>
            ${question.options.map(option => `
                <div class="option-item">
                    <div class="option-bullet"></div>
                    <span>${option}</span>
                </div>
            `).join('')}
        </div>
    ` : '';
    
    return `
        <div class="question-card" data-question-id="${question.id}">
            <div class="question-header">
                <span class="question-number">Question #${question.id}</span>
                <div class="question-meta">
                    <span class="domain-badge">${question.domain}</span>
                    <span class="difficulty-badge ${question.difficulty}">${question.difficulty}</span>
                </div>
            </div>
            <div class="question-text">
                ${viewMode === 'compact' ? 
                    `<div class="question-preview">${truncateText(question.question, 150)}</div>` :
                    question.question
                }
            </div>
            ${optionsHTML}
        </div>
    `;
}

// Truncate text for preview
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Show question modal
function showQuestionModal(question) {
    elements.modalQuestionId.textContent = question.id;
    elements.modalDomain.textContent = question.domain;
    elements.modalDifficulty.textContent = question.difficulty;
    elements.modalDifficulty.className = `difficulty-badge ${question.difficulty}`;
    elements.modalQuestionText.textContent = question.question;
    
    // Display options
    const optionsHTML = question.options.map(option => `
        <div class="option-item">
            <div class="option-bullet"></div>
            <span>${option}</span>
        </div>
    `).join('');
    elements.modalOptions.innerHTML = optionsHTML;
    
    // Display answer and explanation
    elements.modalCorrectAnswer.textContent = question.correct_answer;
    elements.modalExplanation.innerHTML = formatText(question.explanation);
    
    // Display table if available
    if (question.table && question.table.length > 0) {
        elements.modalTableContainer.classList.remove('hidden');
        elements.modalTable.innerHTML = createTable(question.table);
    } else {
        elements.modalTableContainer.classList.add('hidden');
    }
    
    elements.modal.classList.add('active');
}

// Close modal
function closeModal() {
    elements.modal.classList.remove('active');
}

// Format text with line breaks
function formatText(text) {
    if (!text) return '';
    
    // Check if text contains HTML table elements
    if (text.includes('<table') || text.includes('<div class="table-container">')) {
        // Return HTML content as-is for proper table rendering
        return text;
    }
    
    // For regular text, convert newlines to breaks
    return text.replace(/\n/g, '<br>');
}

// Create table HTML
function createTable(tableData) {
    if (!tableData || tableData.length === 0) return '';
    
    // Try to parse the table data
    const rows = [];
    let headers = [];
    
    // Look for common table patterns
    for (let i = 0; i < tableData.length; i++) {
        const rowData = tableData[i];
        if (Array.isArray(rowData)) {
            if (i === 0 || rowData.some(cell => 
                cell.toLowerCase().includes('service') || 
                cell.toLowerCase().includes('type') ||
                cell.toLowerCase().includes('feature')
            )) {
                headers = rowData;
            } else {
                rows.push(rowData);
            }
        }
    }
    
    if (headers.length === 0 && rows.length === 0) {
        // Fallback: treat each item as a row
        headers = ['Property', 'Value'];
        rows = tableData.map(item => {
            if (typeof item === 'string') {
                const parts = item.split(':');
                if (parts.length >= 2) {
                    return [parts[0].trim(), parts.slice(1).join(':').trim()];
                }
                return [item, ''];
            }
            return [item.toString(), ''];
        });
    }
    
    let tableHTML = '<table class="reference-table">';
    
    if (headers.length > 0) {
        tableHTML += '<thead><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr></thead>';
    }
    
    if (rows.length > 0) {
        tableHTML += '<tbody>';
        rows.forEach(row => {
            tableHTML += '<tr>';
            if (Array.isArray(row)) {
                row.forEach(cell => {
                    tableHTML += `<td>${cell}</td>`;
                });
            } else {
                tableHTML += `<td colspan="${headers.length || 1}">${row}</td>`;
            }
            tableHTML += '</tr>';
        });
        tableHTML += '</tbody>';
    }
    
    tableHTML += '</table>';
    return tableHTML;
}

// Quiz functionality
function startQuiz() {
    const domain = elements.quizDomain.value;
    const count = parseInt(elements.quizCount.value);
    
    // Filter questions by domain if selected
    let availableQuestions = domain ? 
        allQuestions.filter(q => q.domain === domain) : 
        allQuestions;
    
    // Shuffle and select questions
    currentQuizQuestions = shuffleArray([...availableQuestions]).slice(0, count);
    currentQuizIndex = 0;
    quizScore = 0;
    
    // Update UI
    elements.totalQuestions.textContent = currentQuizQuestions.length;
    elements.quizContent.classList.remove('hidden');
    elements.quizResults.classList.add('hidden');
    
    showQuizQuestion();
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Show current quiz question
function showQuizQuestion() {
    const question = currentQuizQuestions[currentQuizIndex];
    
    // Update progress
    const progress = ((currentQuizIndex + 1) / currentQuizQuestions.length) * 100;
    elements.progressFill.style.width = `${progress}%`;
    elements.currentQuestion.textContent = currentQuizIndex + 1;
    
    // Update question info
    elements.quizQuestionNumber.textContent = question.id;
    elements.quizQuestionDomain.textContent = question.domain;
    elements.quizQuestionDifficulty.textContent = question.difficulty;
    elements.quizQuestionDifficulty.className = `difficulty-badge ${question.difficulty}`;
    elements.quizQuestionText.textContent = question.question;
    
    // Create options
    const optionsHTML = question.options.map((option, index) => `
        <div class="quiz-option" data-option="${option}">
            <div class="option-letter">${String.fromCharCode(65 + index)}</div>
            <span>${option}</span>
        </div>
    `).join('');
    elements.quizOptions.innerHTML = optionsHTML;
    
    // Add click listeners to options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', selectOption);
    });
    
    // Reset UI state
    elements.quizAnswerSection.classList.add('hidden');
    elements.revealAnswer.classList.remove('hidden');
    elements.nextQuestion.classList.add('hidden');
    elements.finishQuiz.classList.add('hidden');
}

// Select quiz option
function selectOption(e) {
    const option = e.currentTarget;
    
    // Remove previous selections
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Select current option
    option.classList.add('selected');
}

// Reveal answer
function revealAnswer() {
    const question = currentQuizQuestions[currentQuizIndex];
    const selectedOption = document.querySelector('.quiz-option.selected');
    
    // Check if answer is correct
    let isCorrect = false;
    if (selectedOption) {
        const selectedAnswer = selectedOption.dataset.option;
        isCorrect = selectedAnswer === question.correct_answer;
        
        if (isCorrect) {
            quizScore++;
            selectedOption.classList.add('correct');
        } else {
            selectedOption.classList.add('incorrect');
        }
    }
    
    // Highlight correct answer
    document.querySelectorAll('.quiz-option').forEach(option => {
        if (option.dataset.option === question.correct_answer) {
            option.classList.add('correct');
        }
        option.style.pointerEvents = 'none';
    });
    
    // Show answer section
    elements.quizCorrectAnswer.textContent = question.correct_answer;
    elements.quizExplanation.innerHTML = formatText(question.explanation);
    
    // Show table if available
    if (question.table && question.table.length > 0) {
        elements.quizTableContainer.classList.remove('hidden');
        elements.quizTable.innerHTML = createTable(question.table);
    } else {
        elements.quizTableContainer.classList.add('hidden');
    }
    
    elements.quizAnswerSection.classList.remove('hidden');
    elements.revealAnswer.classList.add('hidden');
    
    // Show appropriate next button
    if (currentQuizIndex < currentQuizQuestions.length - 1) {
        elements.nextQuestion.classList.remove('hidden');
    } else {
        elements.finishQuiz.classList.remove('hidden');
    }
}

// Next quiz question
function nextQuizQuestion() {
    currentQuizIndex++;
    showQuizQuestion();
}

// Finish quiz
function finishQuiz() {
    const percentage = Math.round((quizScore / currentQuizQuestions.length) * 100);
    
    elements.finalScore.textContent = quizScore;
    elements.finalTotal.textContent = currentQuizQuestions.length;
    elements.scorePercentage.textContent = `${percentage}%`;
    
    elements.quizContent.classList.add('hidden');
    elements.quizResults.classList.remove('hidden');
}

// Restart quiz
function restartQuiz() {
    elements.quizResults.classList.add('hidden');
    elements.quizContent.classList.add('hidden');
}

// Review answers
function reviewAnswers() {
    // Switch to browse tab and show quiz questions
    switchTab('browse');
    
    // Filter to show only quiz questions
    filteredQuestions = currentQuizQuestions;
    displayQuestions();
}

// Initialize the app
console.log('AWS Quiz App initialized');

