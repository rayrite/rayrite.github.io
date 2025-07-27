
// Global variables
let glossaryData = null;
let currentTerms = [];
let quizTerms = [];
let currentQuizIndex = 0;
let isQuizActive = false;

// DOM elements
const elements = {
    loading: null,
    glossarySection: null,
    quizSection: null,
    glossaryBtn: null,
    quizBtn: null,
    searchInput: null,
    categoryFilter: null,
    sortSelect: null,
    termsContainer: null,
    termCount: null,
    categoryCount: null,
    quizCategorySelect: null,
    startQuizBtn: null,
    quizDisplay: null,
    quizTerm: null,
    quizDefinition: null,
    revealBtn: null,
    nextBtn: null,
    endQuizBtn: null,
    quizProgress: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadGlossaryData();
});

// Initialize DOM elements
function initializeElements() {
    elements.loading = document.getElementById('loading');
    elements.glossarySection = document.getElementById('glossarySection');
    elements.quizSection = document.getElementById('quizSection');
    elements.glossaryBtn = document.getElementById('glossaryBtn');
    elements.quizBtn = document.getElementById('quizBtn');
    elements.searchInput = document.getElementById('searchInput');
    elements.categoryFilter = document.getElementById('categoryFilter');
    elements.sortSelect = document.getElementById('sortSelect');
    elements.termsContainer = document.getElementById('termsContainer');
    elements.termCount = document.getElementById('termCount');
    elements.categoryCount = document.getElementById('categoryCount');
    elements.quizCategorySelect = document.getElementById('quizCategorySelect');
    elements.startQuizBtn = document.getElementById('startQuizBtn');
    elements.quizDisplay = document.getElementById('quizDisplay');
    elements.quizTerm = document.getElementById('quizTerm');
    elements.quizDefinition = document.getElementById('quizDefinition');
    elements.revealBtn = document.getElementById('revealBtn');
    elements.nextBtn = document.getElementById('nextBtn');
    elements.endQuizBtn = document.getElementById('endQuizBtn');
    elements.quizProgress = document.getElementById('quizProgress');
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    elements.glossaryBtn?.addEventListener('click', () => showSection('glossary'));
    elements.quizBtn?.addEventListener('click', () => showSection('quiz'));
    
    // Search and filters
    elements.searchInput?.addEventListener('input', debounce(filterTerms, 300));
    elements.categoryFilter?.addEventListener('change', filterTerms);
    elements.sortSelect?.addEventListener('change', filterTerms);
    
    // Quiz controls
    elements.startQuizBtn?.addEventListener('click', startQuiz);
    elements.revealBtn?.addEventListener('click', revealDefinition);
    elements.nextBtn?.addEventListener('click', nextQuizTerm);
    elements.endQuizBtn?.addEventListener('click', endQuiz);
    
    // Quiz mode radio buttons
    const quizModeRadios = document.querySelectorAll('input[name="quizMode"]');
    quizModeRadios.forEach(radio => {
        radio.addEventListener('change', toggleCategorySelect);
    });
}

// Load glossary data from JSON
async function loadGlossaryData() {
    try {
        const response = await fetch('glossary_data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        glossaryData = await response.json();
        
        // Validate data structure
        if (!glossaryData?.terms || !Array.isArray(glossaryData.terms)) {
            throw new Error('Invalid data structure: missing terms array');
        }
        
        currentTerms = [...glossaryData.terms];
        
        // Initialize UI
        populateCategoryFilters();
        displayTerms();
        updateStats();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading glossary data:', error);
        showError('Failed to load glossary data. Please check the console for details.');
    }
}

// Hide loading screen
function hideLoading() {
    if (elements.loading) {
        elements.loading.classList.add('hidden');
    }
}

// Show error message
function showError(message) {
    hideLoading();
    if (elements.termsContainer) {
        elements.termsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #e53e3e;">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

// Show specific section (glossary or quiz)
function showSection(section) {
    // Update navigation buttons
    elements.glossaryBtn?.classList.toggle('active', section === 'glossary');
    elements.quizBtn?.classList.toggle('active', section === 'quiz');
    
    // Show/hide sections
    elements.glossarySection?.classList.toggle('active', section === 'glossary');
    elements.quizSection?.classList.toggle('active', section === 'quiz');
    
    // End quiz if switching away from quiz section
    if (section !== 'quiz' && isQuizActive) {
        endQuiz();
    }
}

// Populate category filter dropdowns
function populateCategoryFilters() {
    if (!glossaryData?.categories) return;
    
    const categories = [...glossaryData.categories].sort();
    
    // Populate main category filter
    if (elements.categoryFilter) {
        elements.categoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `Category ${category}`;
            elements.categoryFilter.appendChild(option);
        });
    }
    
    // Populate quiz category filter
    if (elements.quizCategorySelect) {
        elements.quizCategorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = `Category ${category}`;
            elements.quizCategorySelect.appendChild(option);
        });
    }
}

// Filter and sort terms
function filterTerms() {
    if (!glossaryData?.terms) return;
    
    const searchTerm = elements.searchInput?.value?.toLowerCase()?.trim() || '';
    const selectedCategory = elements.categoryFilter?.value || '';
    const sortBy = elements.sortSelect?.value || 'alphabetical';
    
    // Filter terms
    let filteredTerms = glossaryData.terms.filter(term => {
        const matchesSearch = !searchTerm || 
            term.term?.toLowerCase()?.includes(searchTerm) || 
            term.definition?.toLowerCase()?.includes(searchTerm);
        
        const matchesCategory = !selectedCategory || term.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // Sort terms
    if (sortBy === 'alphabetical') {
        filteredTerms.sort((a, b) => (a.term || '').localeCompare(b.term || ''));
    } else if (sortBy === 'category') {
        filteredTerms.sort((a, b) => {
            const categoryCompare = (a.category || '').localeCompare(b.category || '');
            if (categoryCompare !== 0) return categoryCompare;
            return (a.term || '').localeCompare(b.term || '');
        });
    }
    
    currentTerms = filteredTerms;
    displayTerms();
    updateStats();
}

// Display terms in the container
function displayTerms() {
    if (!elements.termsContainer || !currentTerms) return;
    
    if (currentTerms.length === 0) {
        elements.termsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #4a5568;">
                <h3>No terms found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    const termsHTML = currentTerms.map((term, index) => `
        <div class="term-card" style="animation-delay: ${Math.min(index * 0.05, 1)}s">
            <div class="term-title">
                ${escapeHtml(term.term || 'Unknown Term')}
                <span class="term-category">${escapeHtml(term.category || 'N/A')}</span>
            </div>
            <div class="term-definition">
                ${escapeHtml(term.definition || 'No definition available.')}
            </div>
        </div>
    `).join('');
    
    elements.termsContainer.innerHTML = termsHTML;
}

// Update statistics
function updateStats() {
    if (elements.termCount) {
        const count = currentTerms?.length || 0;
        elements.termCount.textContent = `${count} term${count !== 1 ? 's' : ''}`;
    }
    
    if (elements.categoryCount && glossaryData?.categories) {
        const count = glossaryData.categories.length;
        elements.categoryCount.textContent = `${count} categor${count !== 1 ? 'ies' : 'y'}`;
    }
}

// Quiz functionality
function toggleCategorySelect() {
    const categoryModeSelected = document.querySelector('input[name="quizMode"]:checked')?.value === 'category';
    if (elements.quizCategorySelect) {
        elements.quizCategorySelect.disabled = !categoryModeSelected;
    }
}

function startQuiz() {
    if (!glossaryData?.terms) {
        alert('No glossary data available for quiz.');
        return;
    }
    
    const quizMode = document.querySelector('input[name="quizMode"]:checked')?.value;
    let availableTerms = [...glossaryData.terms];
    
    if (quizMode === 'category') {
        const selectedCategory = elements.quizCategorySelect?.value;
        if (!selectedCategory) {
            alert('Please select a category for the quiz.');
            return;
        }
        availableTerms = availableTerms.filter(term => term.category === selectedCategory);
    }
    
    if (availableTerms.length === 0) {
        alert('No terms available for the selected quiz options.');
        return;
    }
    
    // Shuffle terms for random order
    quizTerms = shuffleArray([...availableTerms]);
    currentQuizIndex = 0;
    isQuizActive = true;
    
    elements.quizDisplay.style.display = 'block';
    showQuizTerm();
}

function showQuizTerm() {
    if (!quizTerms?.[currentQuizIndex]) {
        endQuiz();
        return;
    }
    
    const currentTerm = quizTerms[currentQuizIndex];
    
    // Update progress
    if (elements.quizProgress) {
        elements.quizProgress.textContent = `Question ${currentQuizIndex + 1} of ${quizTerms.length}`;
    }
    
    // Show term
    if (elements.quizTerm) {
        elements.quizTerm.textContent = currentTerm.term || 'Unknown Term';
    }
    
    // Hide definition and next button, show reveal button
    if (elements.quizDefinition) {
        elements.quizDefinition.style.display = 'none';
    }
    if (elements.revealBtn) {
        elements.revealBtn.style.display = 'flex';
    }
    if (elements.nextBtn) {
        elements.nextBtn.style.display = 'none';
    }
}

function revealDefinition() {
    const currentTerm = quizTerms?.[currentQuizIndex];
    if (!currentTerm) return;
    
    // Show definition
    if (elements.quizDefinition) {
        elements.quizDefinition.textContent = currentTerm.definition || 'No definition available.';
        elements.quizDefinition.style.display = 'block';
    }
    
    // Hide reveal button, show next button
    if (elements.revealBtn) {
        elements.revealBtn.style.display = 'none';
    }
    if (elements.nextBtn) {
        elements.nextBtn.style.display = 'flex';
    }
}

function nextQuizTerm() {
    currentQuizIndex++;
    
    if (currentQuizIndex >= quizTerms.length) {
        // Quiz completed
        alert(`Quiz completed! You've reviewed all ${quizTerms.length} terms.`);
        endQuiz();
    } else {
        showQuizTerm();
    }
}

function endQuiz() {
    isQuizActive = false;
    quizTerms = [];
    currentQuizIndex = 0;
    
    if (elements.quizDisplay) {
        elements.quizDisplay.style.display = 'none';
    }
}

// Utility functions
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

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});
