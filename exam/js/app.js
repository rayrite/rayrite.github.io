// AWS CLF-C02 Exam Simulator - Enhanced Version with Fixed Multi-Response Support
class ExamSimulator {
    constructor() {
        this.initializeProperties();
        this.initializeState();
        this.initializeGlobalTimers();
    }
    
    initializeProperties() {
        // Core data
        this.allQuestions = [];
        this.examQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questionTimes = {};
        this.questionRemainingTimes = {};
        
        // Global timer properties - shared across desktop/mobile
        this.globalTimer = null;
        this.questionTimer = null;
        this.globalTimeRemaining = 90 * 60; // 90 minutes in seconds
        this.questionTimeRemaining = 90; // 1:30 in seconds
        this.questionStartTime = null;
        
        // State flags
        this.examStarted = false;
        this.examFinished = false;
        this.examInitialized = false;
        this.globalTimerPaused = true; // Start paused
        this.mode = 'exam'; // 'exam' or 'study'
        
        // Tracking
        this.visitedQuestions = new Set();
        
        // Configuration - Updated to use "domain" field mapping
        this.domainDistribution = {
            'Cloud Concepts': 0.26,
            'Security and Compliance': 0.25,
            'Cloud Technology and Services': 0.33, // Updated to match JSON structure
            'Billing, Pricing, and Support': 0.16
        };
        
        // Minimum percentage of multichoice questions (numchoices > 1)
        this.minMultichoicePercentage = 0.34; // 34%
    }
    
    initializeState() {
        // Reset all state to initial values
        this.examStarted = false;
        this.examFinished = false;
        this.examInitialized = false;
        this.globalTimerPaused = true;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questionTimes = {};
        this.questionRemainingTimes = {};
        this.visitedQuestions.clear();
        this.clearTimers();
    }
    
    initializeGlobalTimers() {
        // Set up global timer update intervals that work across desktop/mobile
        this.timerUpdateInterval = null;
        this.startGlobalTimerUpdates();
    }
    
    startGlobalTimerUpdates() {
        // Global timer display update - runs continuously
        this.timerUpdateInterval = setInterval(() => {
            this.updateAllTimerDisplays();
        }, 100); // Update every 100ms for smooth display
    }
    
    updateAllTimerDisplays() {
        // Update all timer displays across desktop and mobile
        const globalTimeStr = this.formatTime(this.globalTimeRemaining);
        const questionTimeStr = this.formatTime(this.questionTimeRemaining);
        
        // Global timer displays
        ['globalTimer', 'globalTimerMobile', 'mobileGlobalTimer'].forEach(id => {
            this.setElementContent(id, globalTimeStr);
        });
        
        // Question timer displays  
        ['questionTimer', 'mobileQuestionTimer'].forEach(id => {
            this.setElementContent(id, questionTimeStr);
        });
        
        // Update timer button states
        this.updateTimerButtonStates();
        
        // Add visual indicator if timer is running (for debugging)
        if (this.mode === 'exam' && this.examStarted && !this.examFinished) {
            // Add visual feedback that countdown is active
            const globalTimerElement = this.getElement('globalTimer');
            if (globalTimerElement && !this.globalTimerPaused) {
                globalTimerElement.style.color = this.globalTimeRemaining < 300 ? '#ff4444' : '#333'; // Red when < 5 minutes
            }
            
            const questionTimerElement = this.getElement('questionTimer');
            if (questionTimerElement && !this.globalTimerPaused) {
                questionTimerElement.style.color = this.questionTimeRemaining < 30 ? '#ff4444' : '#333'; // Red when < 30 seconds
            }
        }
    }
    
    updateTimerButtonStates() {
        const isPaused = this.globalTimerPaused;
        const buttonText = isPaused ? 'Resume' : 'Pause';
        
        ['pauseGlobalTimer', 'pauseGlobalTimerMobile'].forEach(id => {
            this.setElementContent(id, buttonText);
        });
        
        this.setElementContent('pauseResumeExam', isPaused ? 'Resume' : 'Pause');
        
        // Update mobile timer visual state
        const mobileTimer = this.getElement('mobileGlobalTimer');
        if (mobileTimer) {
            if (isPaused) {
                mobileTimer.classList.add('paused');
            } else {
                mobileTimer.classList.remove('paused');
            }
        }
    }
    
    // Utility method to safely get DOM elements
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Element with ID '${id}' not found`);
        }
        return element;
    }
    
    // Utility method to safely set element content
    setElementContent(id, content) {
        const element = this.getElement(id);
        if (element) {
            if (typeof content === 'string') {
                element.textContent = content;
            } else {
                element.innerHTML = content;
            }
        }
    }
    
    // Utility method to safely set element HTML
    setElementHTML(id, html) {
        const element = this.getElement(id);
        if (element) {
            element.innerHTML = html;
        }
    }
    
    // Utility method to safely add event listeners
    addEventHandler(id, event, handler) {
        const element = this.getElement(id);
        if (element) {
            element.addEventListener(event, handler.bind(this));
            return true;
        }
        return false;
    }
    
    // Main initialization method
    async init() {
        try {
            console.log('Initializing AWS CLF-C02 Exam Simulator...');
            
            // Validate that we can access basic DOM elements
            if (!this.validateBasicDOM()) {
                throw new Error('Critical DOM elements are missing');
            }
            
            // Show loading state
            this.showLoadingState();
            
            // Set up event listeners
            this.setupAllEventListeners();
            
            // Set up UI components
            this.setupUIComponents();
            
            // Load questions
            await this.loadAllQuestions();
            
            // Show initial state
            this.showInitialState();
            
            console.log('Initialization complete');
            
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showCriticalError(error);
            throw error;
        }
    }
    
    validateBasicDOM() {
        const criticalElements = [
            'examStatus', 'startSessionButton', 'examControls', 
            'examInterface', 'questionText', 'questionOptions'
        ];
        
        const missing = criticalElements.filter(id => !document.getElementById(id));
        
        if (missing.length > 0) {
            console.error('Missing critical DOM elements:', missing);
            return false;
        }
        
        return true;
    }
    
    showLoadingState() {
        this.setElementHTML('examStatus', '<div class="loading-message">Initializing simulator...</div>');
    }
    
    showCriticalError(error) {
        const errorHtml = `
            <div class="error-message">
                <strong>Critical Error:</strong><br>
                ${error.message}<br><br>
                Please check the browser console for more details and ensure all required files are present.
            </div>`;
        this.setElementHTML('examStatus', errorHtml);
    }
    
    setupAllEventListeners() {
        try {
            // Core exam controls
            this.addEventHandler('startSessionButton', 'click', this.handleStartSession);
            this.addEventHandler('stopExam', 'click', this.handleStopExam);
            this.addEventHandler('pauseResumeExam', 'click', this.handleTogglePauseResume);
            this.addEventHandler('finishExam', 'click', this.handleFinishExam);
            this.addEventHandler('checkAnswer', 'click', this.handleCheckAnswer);
            
            // Navigation
            this.addEventHandler('prevQuestion', 'click', this.handlePreviousQuestion);
            this.addEventHandler('nextQuestion', 'click', this.handleNextQuestion);
            
            // Mode selection
            this.addEventHandler('modeSelection', 'click', this.handleModeSelection);
            
            // Timer controls (desktop)
            this.addEventHandler('startGlobalTimer', 'click', this.handleStartGlobalTimer);
            this.addEventHandler('pauseGlobalTimer', 'click', this.handlePauseGlobalTimer);
            this.addEventHandler('stopGlobalTimer', 'click', this.handleStopExam);
            this.addEventHandler('resetGlobalTimer', 'click', this.handleResetGlobalTimer);
            
            // Timer controls (mobile)
            this.addEventHandler('startGlobalTimerMobile', 'click', this.handleStartGlobalTimer);
            this.addEventHandler('pauseGlobalTimerMobile', 'click', this.handlePauseGlobalTimer);
            this.addEventHandler('stopGlobalTimerMobile', 'click', this.handleStopExam);
            this.addEventHandler('resetGlobalTimerMobile', 'click', this.handleResetGlobalTimer);
            
            // Export results
            this.addEventHandler('exportResults', 'click', this.handleExportResults);
            
            // Question options change
            const optionsElement = this.getElement('questionOptions');
            if (optionsElement) {
                optionsElement.addEventListener('change', this.handleAnswerChange.bind(this));
            }
            
            // Legend navigation
            this.addEventHandler('examLegendDots', 'click', this.handleLegendClick);
            this.addEventHandler('examLegendDotsMobile', 'click', this.handleLegendClickMobile);
            
            // Tab navigation
            this.addEventHandler('examTab', 'click', this.handleExamTabClick);
            this.addEventHandler('reviewTab', 'click', this.handleReviewTabClick);
            this.addEventHandler('examTabMobile', 'click', this.handleExamTabClick);
            this.addEventHandler('reviewTabMobile', 'click', this.handleReviewTabClick);
            
            // Side panel
            this.addEventHandler('hamburgerMenu', 'click', this.handleOpenSidePanel);
            this.addEventHandler('closeSidePanel', 'click', this.handleCloseSidePanel);
            this.addEventHandler('overlay', 'click', this.handleCloseSidePanel);
            
        } catch (error) {
            console.error('Error setting up event listeners:', error);
            throw new Error('Failed to set up event listeners: ' + error.message);
        }
    }
    
    setupUIComponents() {
        try {
            // Initialize timer displays to default values
            this.globalTimeRemaining = 90 * 60; // 90 minutes
            this.questionTimeRemaining = 90; // 1:30 minutes
            this.globalTimerPaused = true;
            
            // Force initial timer display update
            this.updateAllTimerDisplays();
            
            // Set initial mode
            this.updateModeDescription();
            
            console.log('UI components initialized - timer displays set to default values');
            
        } catch (error) {
            console.error('Error setting up UI components:', error);
        }
    }
    
    async loadAllQuestions() {
        try {
            this.setElementHTML('examStatus', '<div class="loading-message">Loading questions...</div>');
            
            const questionFiles = [
                'data/aws_mcq_questions.json',
                'data/aws_e2_exams.json',
                'data/aws_e3_exams.json', 
                'data/aws_e4_exams.json',
                'data/aws_e5_exams.json',
                'data/aws_e6_exams.json',
                'data/aws_e6b_exams.json',
		'data/aws_e8_exams.json',
		'data/aws_e9_exams.json',
                'data/aws_mock_exams.json'
            ];
            
            const loadedQuestions = await this.loadQuestionsFromFiles(questionFiles);
            
            if (loadedQuestions.length === 0) {
                throw new Error('No questions could be loaded. Please ensure JSON files exist in the data/ folder.');
            }
            
            this.allQuestions = loadedQuestions;
            this.processLoadedQuestions();
            this.mapQuestionDomains();
            
            // Log question statistics
            const stats = this.analyzeQuestionStats();
            console.log(`Successfully loaded ${this.allQuestions.length} questions`);
            console.log(`Multichoice questions: ${stats.multichoice} (${stats.multichoicePercentage}%)`);
            console.log('Domain distribution:', stats.domainCounts);
            
            this.setElementHTML('examStatus', `<p><strong>${this.allQuestions.length} questions loaded and ready!</strong></p>`);
            
        } catch (error) {
            console.error('Error loading questions:', error);
            this.setElementHTML('examStatus', `
                <div class="error-message">
                    <strong>Error loading questions:</strong><br>
                    ${error.message}
                </div>`);
            throw error;
        }
    }
    
    async loadQuestionsFromFiles(files) {
        const allQuestions = [];
        
        for (const file of files) {
            try {
                console.log(`Loading ${file}...`);
                const response = await fetch(file);
                
                if (!response.ok) {
                    console.warn(`Failed to load ${file}: ${response.status}`);
                    continue;
                }
                
                const questions = await response.json();
                if (Array.isArray(questions)) {
                    allQuestions.push(...questions);
                    console.log(`Loaded ${questions.length} questions from ${file}`);
                } else {
                    console.warn(`Invalid format in ${file}: expected array`);
                }
                
            } catch (error) {
                console.warn(`Error loading ${file}:`, error.message);
            }
        }
        
        return allQuestions.filter(q => q && typeof q === 'object');
    }
    
    processLoadedQuestions() {
        this.allQuestions.forEach((question, index) => {
            try {
                // Ensure required properties
                if (!question.id) {
                    question.id = `q_${index}_${Math.random().toString(36).substr(2, 9)}`;
                }
                if (!Array.isArray(question.options)) {
                    question.options = [];
                }
                if (!Array.isArray(question.correct_answers)) {
                    question.correct_answers = [];
                }
                if (!question.explanation) {
                    question.explanation = 'No explanation available.';
                }
                
                // Use numchoices field if available, otherwise calculate from correct_answers
                if (typeof question.numchoices === 'number' && question.numchoices > 0) {
                    question.expectedChoices = question.numchoices;
                } else {
                    question.expectedChoices = question.correct_answers.length;
                }
                
                // Process answer letters for compatibility
                question.answer_letters = this.extractAnswerLetters(question);
                
                // Ensure answer letters match expected choices
                if (question.answer_letters.length !== question.expectedChoices) {
                    console.warn(`Question ${question.id}: Answer letters (${question.answer_letters.length}) don't match expected choices (${question.expectedChoices})`);
                }
                
            } catch (error) {
                console.warn(`Error processing question ${index}:`, error);
                // Set default values for problematic questions
                question.expectedChoices = 1;
                question.answer_letters = [];
            }
        });
    }
    
    // FIXED: Enhanced extractAnswerLetters method to properly handle multi-response questions
    extractAnswerLetters(question) {
        const letters = new Set();
        const correctAnswers = question.correct_answers || [];
        
        correctAnswers.forEach(answer => {
            if (typeof answer !== 'string') return;
            
            // First check if the answer contains multiple choices separated by <br>
            if (answer.includes('<br>')) {
                // Split by <br> and extract letters from each part
                answer.split('<br>').forEach(item => {
                    const itemTrim = item.trim();
                    const match = itemTrim.match(/^([A-Z])\./);
                    if (match) {
                        letters.add(match[1]);
                    }
                });
            } else {
                // Single answer format - try to match letter patterns
                const letterMatch = answer.match(/^([A-Z])\./) || answer.match(/<b>([A-Z])\./);
                if (letterMatch) {
                    letters.add(letterMatch[1]);
                } else {
                    // Try to match content with options
                    const cleanAnswer = answer.replace(/<[^>]*>/g, '').trim();
                    question.options.forEach((option, index) => {
                        const cleanOption = option.replace(/<[^>]*>/g, '').trim();
                        if (cleanOption === cleanAnswer || cleanAnswer.includes(cleanOption) || cleanOption.includes(cleanAnswer)) {
                            letters.add(String.fromCharCode(65 + index));
                        }
                    });
                }
            }
        });
        
        return Array.from(letters).sort();
    }
    
    mapQuestionDomains() {
        // Updated domain mapping to use the "domain" field primarily
        const domainMap = {
            // Direct domain mappings from JSON
            'Cloud Concepts': 'Cloud Concepts',
            'Security and Compliance': 'Security and Compliance', 
            'Cloud Technology and Services': 'Cloud Technology and Services',
            'Billing, Pricing, and Support': 'Billing, Pricing, and Support',
            
            // Legacy category mappings for backwards compatibility
            'Technology': 'Cloud Technology and Services',
            'Billing and Pricing': 'Billing, Pricing, and Support',
            'Compute': 'Cloud Technology and Services',
            'Storage': 'Cloud Technology and Services',
            'Database': 'Cloud Technology and Services',
            'Networking': 'Cloud Technology and Services',
            'Storage Services': 'Cloud Technology and Services'
        };
        
        this.allQuestions.forEach(question => {
            // Use "domain" field first, then fall back to "category"
            const primaryField = question.domain || question.category || 'Cloud Technology and Services';
            question.mappedDomain = domainMap[primaryField] || 'Cloud Technology and Services';
        });
    }
    
    analyzeQuestionStats() {
        const multichoice = this.allQuestions.filter(q => q.expectedChoices > 1).length;
        const multichoicePercentage = Math.round((multichoice / this.allQuestions.length) * 100);
        
        const domainCounts = {};
        this.allQuestions.forEach(q => {
            const domain = q.mappedDomain;
            domainCounts[domain] = (domainCounts[domain] || 0) + 1;
        });
        
        return { multichoice, multichoicePercentage, domainCounts };
    }
    
    showInitialState() {
        try {
            // Reset UI to initial state
            this.setElementStyle('examControls', 'display', 'block');
            this.setElementStyle('examInterface', 'display', 'none');
            
            // Reset timers to initial values
            this.globalTimeRemaining = 90 * 60; // 90 minutes
            this.questionTimeRemaining = 90; // 1:30 minutes
            this.globalTimerPaused = true;
            
            // Clear any running timers
            this.clearTimers();
            
            // Reset body class
            document.body.className = 'initial-state';
            
            // Show desktop timer controls
            const timerControls = document.querySelector('.timer-controls.desktop');
            if (timerControls) {
                timerControls.style.display = 'flex';
                console.log('Desktop timer controls shown');
            }
            
            // Hide exam legend
            const legend = this.getElement('examLegend');
            if (legend) legend.classList.remove('active');
            
            const legendMobile = this.getElement('examLegendMobile');
            if (legendMobile) legendMobile.style.display = 'none';
            
            // Disable review tabs
            this.setTabState('reviewTab', false);
            this.setTabState('reviewTabMobile', false);
            
            // Update mode description
            this.updateModeDescription();
            
            // Force timer display update
            this.updateAllTimerDisplays();
            
        } catch (error) {
            console.error('Error showing initial state:', error);
        }
    }
    
    setElementStyle(id, property, value) {
        const element = this.getElement(id);
        if (element) {
            element.style[property] = value;
        }
    }
    
    setTabState(id, enabled) {
        const tab = this.getElement(id);
        if (tab) {
            tab.style.opacity = enabled ? '1' : '0.5';
            tab.style.pointerEvents = enabled ? 'auto' : 'none';
        }
    }
    
    updateModeDescription() {
        const description = this.getElement('modeDescription');
        const status = this.getElement('examStatus');
        
        if (this.mode === 'study') {
            this.setElementContent('modeDescription', 'Get instant feedback on each question. No timers.');
            this.setElementHTML('examStatus', `<p>Study all <strong>${this.allQuestions.length}</strong> available questions at your own pace.</p>`);
        } else {
            this.setElementContent('modeDescription', 'Timed exam simulation with a final score.');
            this.setElementHTML('examStatus', '<p>The exam will consist of 65 questions with a 90-minute time limit.</p>');
        }
    }
    
    // Event Handlers
    handleStartSession() {
        try {
            if (this.allQuestions.length === 0) {
                alert('No questions available. Please reload the page and try again.');
                return;
            }
            
            this.startNewSession();
        } catch (error) {
            console.error('Error starting session:', error);
            alert('Error starting session: ' + error.message);
        }
    }
    
    startNewSession() {
        console.log(`Starting ${this.mode} session...`);
        
        // Reset state
        this.initializeState();
        
        // Prepare questions
        if (this.mode === 'study') {
            this.examQuestions = this.shuffleArray([...this.allQuestions]);
            document.body.className = 'study-mode';
            console.log('Study mode activated - no timers');
        } else {
            this.generateExamQuestions();
            document.body.className = 'exam-mode';
            console.log('Exam mode activated - countdown timers will start');
        }
        
        // Initialize session
        this.examInitialized = true;
        this.examStarted = true;
        this.currentQuestionIndex = 0;
        
        // Update UI
        this.setElementStyle('examControls', 'display', 'none');
        this.setElementStyle('examInterface', 'display', 'block');
        
        if (this.mode === 'exam') {
            this.setupExamMode();
            console.log('Exam setup complete - timers should be counting down');
        }
        
        // Display first question
        this.displayCurrentQuestion();
        this.updateNavigationUI();
    }
    
    generateExamQuestions() {
        const totalQuestions = 65;
        const minMultichoice = Math.ceil(totalQuestions * this.minMultichoicePercentage);
        
        console.log(`Generating exam with ${totalQuestions} questions (minimum ${minMultichoice} multichoice)`);
        
        // Separate questions by type
        const multichoiceQuestions = this.allQuestions.filter(q => q.expectedChoices > 1);
        const singleChoiceQuestions = this.allQuestions.filter(q => q.expectedChoices === 1);
        
        console.log(`Available: ${multichoiceQuestions.length} multichoice, ${singleChoiceQuestions.length} single choice`);
        
        // Group by domain
        const questionsByDomain = {};
        Object.keys(this.domainDistribution).forEach(domain => {
            questionsByDomain[domain] = {
                multichoice: multichoiceQuestions.filter(q => q.mappedDomain === domain),
                single: singleChoiceQuestions.filter(q => q.mappedDomain === domain)
            };
        });
        
        const selectedQuestions = [];
        
        // First, ensure we have enough multichoice questions
        const shuffledMultichoice = this.shuffleArray(multichoiceQuestions);
        const selectedMultichoice = shuffledMultichoice.slice(0, Math.min(minMultichoice, shuffledMultichoice.length));
        selectedQuestions.push(...selectedMultichoice);
        
        // Fill remaining slots with domain distribution
        const remainingSlots = totalQuestions - selectedQuestions.length;
        const usedQuestionIds = new Set(selectedQuestions.map(q => q.id));
        
        Object.keys(this.domainDistribution).forEach(domain => {
            const targetCount = Math.round(totalQuestions * this.domainDistribution[domain]);
            const currentCount = selectedQuestions.filter(q => q.mappedDomain === domain).length;
            const needed = Math.max(0, targetCount - currentCount);
            
            if (needed > 0) {
                const availableQuestions = [
                    ...questionsByDomain[domain].multichoice,
                    ...questionsByDomain[domain].single
                ].filter(q => !usedQuestionIds.has(q.id));
                
                const shuffled = this.shuffleArray(availableQuestions);
                const selected = shuffled.slice(0, Math.min(needed, shuffled.length));
                
                selected.forEach(q => {
                    selectedQuestions.push(q);
                    usedQuestionIds.add(q.id);
                });
            }
        });
        
        // Fill any remaining slots randomly
        if (selectedQuestions.length < totalQuestions) {
            const remainingQuestions = this.allQuestions.filter(q => !usedQuestionIds.has(q.id));
            const shuffled = this.shuffleArray(remainingQuestions);
            const needed = totalQuestions - selectedQuestions.length;
            selectedQuestions.push(...shuffled.slice(0, needed));
        }
        
        this.examQuestions = this.shuffleArray(selectedQuestions).slice(0, totalQuestions);
        
        // Log final statistics
        const finalMultichoice = this.examQuestions.filter(q => q.expectedChoices > 1).length;
        const finalPercentage = Math.round((finalMultichoice / this.examQuestions.length) * 100);
        
        console.log(`Generated exam: ${this.examQuestions.length} total questions`);
        console.log(`Multichoice: ${finalMultichoice} (${finalPercentage}%)`);
        
        const domainCounts = {};
        this.examQuestions.forEach(q => {
            domainCounts[q.mappedDomain] = (domainCounts[q.mappedDomain] || 0) + 1;
        });
        console.log('Domain distribution:', domainCounts);
    }
    
    setupExamMode() {
        // Show exam legend
        const legend = this.getElement('examLegend');
        if (legend) legend.classList.add('active');
        
        const legendMobile = this.getElement('examLegendMobile');
        if (legendMobile) legendMobile.style.display = 'block';
        
        // Keep desktop timer controls visible during exam (they show countdown)
        const timerControls = document.querySelector('.timer-controls.desktop');
        if (timerControls) {
            timerControls.style.display = 'flex';
            console.log('Desktop timer controls kept visible for countdown');
        }
        
        // Create exam legend
        this.createExamLegend();
        
        // Start global timer with countdown
        this.startGlobalTimer();
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    createExamLegend() {
        ['examLegendDots', 'examLegendDotsMobile'].forEach(containerId => {
            const container = this.getElement(containerId);
            if (!container) return;
            
            container.innerHTML = '';
            this.examQuestions.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'legend-dot-nav';
                dot.dataset.questionIndex = index;
                dot.textContent = index + 1;
                container.appendChild(dot);
            });
        });
        
        this.updateExamLegend();
    }
    
    updateExamLegend() {
        if (this.mode !== 'exam' || !this.examStarted) return;
        
        ['examLegendDots', 'examLegendDotsMobile'].forEach(containerId => {
            const container = this.getElement(containerId);
            if (!container) return;
            
            container.querySelectorAll('.legend-dot-nav').forEach((dot, index) => {
                const questionId = this.examQuestions[index]?.id;
                const hasAnswer = questionId && this.userAnswers[questionId]?.length > 0;
                
                dot.className = 'legend-dot-nav';
                
                if (index === this.currentQuestionIndex) {
                    dot.classList.add('current');
                }
                if (hasAnswer) {
                    dot.classList.add('answered');
                } else if (this.visitedQuestions.has(index)) {
                    dot.classList.add('visited');
                } else {
                    dot.classList.add('not-visited');
                }
            });
        });
    }
    
    displayCurrentQuestion() {
        if (!this.examQuestions.length) return;
        
        const question = this.examQuestions[this.currentQuestionIndex];
        this.visitedQuestions.add(this.currentQuestionIndex);
        
        // Update question text
        this.setElementHTML('questionText', question.question || 'Question text not available');
        
        // Create options using numchoices/expectedChoices
        this.createQuestionOptions(question);
        
        // Hide feedback
        this.setElementStyle('instantFeedback', 'display', 'none');
        
        // Restore previous answers
        this.restorePreviousAnswers();
        
        // Start question timer for exam mode
        if (this.mode === 'exam') {
            this.startQuestionTimer();
            this.updateExamLegend();
        }
        
        this.updateNavigationUI();
    }
    
    createQuestionOptions(question) {
        const container = this.getElement('questionOptions');
        if (!container) return;
        
        container.innerHTML = '';
        container.className = 'question-options';
        
        // Use expectedChoices (from numchoices field) to determine if multichoice
        const isMultiple = question.expectedChoices > 1;
        const inputType = isMultiple ? 'checkbox' : 'radio';
        
        if (isMultiple) {
            const instruction = document.createElement('div');
            instruction.className = 'question-instruction';
            instruction.textContent = `Select ${question.expectedChoices} answers:`;
            container.appendChild(instruction);
        }
        
        question.options.forEach((optionText, index) => {
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
            label.innerHTML = optionText;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            container.appendChild(optionDiv);
        });
    }
    
    restorePreviousAnswers() {
        const questionId = this.examQuestions[this.currentQuestionIndex]?.id;
        const savedAnswers = questionId ? this.userAnswers[questionId] : [];
        
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.checked = savedAnswers?.includes(input.value) || false;
        });
    }
    
    updateNavigationUI() {
        const current = this.currentQuestionIndex + 1;
        const total = this.examQuestions.length;
        
        // Update counters
        this.setElementContent('currentQuestion', current);
        this.setElementContent('totalQuestions', total);
        this.setElementContent('mobileQuestionCounter', `${current} / ${total}`);
        
        // Update progress bar
        const progressFill = this.getElement('progressFill');
        if (progressFill) {
            progressFill.style.width = `${(current / total) * 100}%`;
        }
        
        // Update navigation buttons
        const prevBtn = this.getElement('prevQuestion');
        const nextBtn = this.getElement('nextQuestion');
        const finishBtn = this.getElement('finishExam');
        const checkBtn = this.getElement('checkAnswer');
        
        if (prevBtn) prevBtn.disabled = this.currentQuestionIndex === 0;
        if (nextBtn) nextBtn.disabled = current === total;
        
        if (this.mode === 'exam') {
            if (finishBtn) finishBtn.style.display = current === total ? 'inline-block' : 'none';
            if (checkBtn) checkBtn.style.display = 'none';
        } else {
            if (finishBtn) finishBtn.style.display = 'none';
            if (checkBtn) checkBtn.style.display = 'none';
        }
    }
    
    // Enhanced Timer Methods with Global State
    startGlobalTimer() {
        if (this.mode !== 'exam') return;
        
        this.globalTimerPaused = false;
        
        // Clear any existing timer
        clearInterval(this.globalTimer);
        
        this.globalTimer = setInterval(() => {
            if (!this.globalTimerPaused) {
                this.globalTimeRemaining--;
                if (this.globalTimeRemaining <= 0) {
                    this.globalTimeRemaining = 0;
                    this.finishExam();
                }
            }
        }, 1000);
        
        this.startQuestionTimer();
        console.log('Global timer started - countdown active');
    }
    
    pauseGlobalTimer() {
        if (this.mode !== 'exam') return;
        
        clearInterval(this.globalTimer);
        this.globalTimerPaused = true;
        this.stopQuestionTimer();
        console.log('Global timer paused');
    }
    
    startQuestionTimer() {
        if (this.mode !== 'exam' || this.globalTimerPaused) return;
        
        clearInterval(this.questionTimer);
        
        const questionId = this.examQuestions[this.currentQuestionIndex]?.id;
        this.questionTimeRemaining = questionId ? (this.questionRemainingTimes[questionId] ?? 90) : 90;
        this.questionStartTime = Date.now();
        
        this.questionTimer = setInterval(() => {
            if (!this.globalTimerPaused) {
                this.questionTimeRemaining--;
                if (this.questionTimeRemaining <= 0) {
                    this.questionTimeRemaining = 0;
                    // Don't clear the timer, just let it stay at 0
                }
            }
        }, 1000);
        
        console.log(`Question timer started: ${this.formatTime(this.questionTimeRemaining)}`);
    }
    
    stopQuestionTimer() {
        clearInterval(this.questionTimer);
        if (this.examQuestions.length > 0 && this.examStarted) {
            const questionId = this.examQuestions[this.currentQuestionIndex]?.id;
            if (questionId) {
                this.questionRemainingTimes[questionId] = this.questionTimeRemaining;
            }
        }
    }
    
    clearTimers() {
        clearInterval(this.globalTimer);
        clearInterval(this.questionTimer);
        this.globalTimer = null;
        this.questionTimer = null;
    }
    
    formatTime(seconds) {
        const sign = seconds < 0 ? '-' : '';
        const absSeconds = Math.abs(seconds);
        const mins = Math.floor(absSeconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(absSeconds % 60).toString().padStart(2, '0');
        return `${sign}${mins}:${secs}`;
    }
    
    // Event Handler Methods
    handleModeSelection(event) {
        if (!event.target.matches('.mode-button')) return;
        
        this.mode = event.target.dataset.mode;
        
        // Update button states
        document.querySelectorAll('.mode-button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        this.updateModeDescription();
    }
    
    handleAnswerChange(event) {
        if (!event.target.matches('input[name="answer"]')) return;
        
        this.recordCurrentAnswer();
        
        if (this.mode === 'exam') {
            this.updateExamLegend();
        } else {
            this.setElementStyle('checkAnswer', 'display', 'inline-block');
        }
    }
    
    recordCurrentAnswer() {
        const questionId = this.examQuestions[this.currentQuestionIndex]?.id;
        if (!questionId) return;
        
        const answers = Array.from(document.querySelectorAll('input[name="answer"]:checked'))
            .map(input => input.value);
        
        this.userAnswers[questionId] = answers;
    }
    
    handleCheckAnswer() {
        this.submitStudyAnswer();
    }
    
    submitStudyAnswer() {
        this.setElementStyle('checkAnswer', 'display', 'none');
        
        const question = this.examQuestions[this.currentQuestionIndex];
        const userAnswers = this.userAnswers[question.id] || [];
        const isCorrect = this.isAnswerCorrect(question, userAnswers);
        
        // Disable inputs and add styling
        const container = this.getElement('questionOptions');
        if (container) container.classList.add('study-answered');
        
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
        });
        
        // Highlight correct/incorrect answers
        document.querySelectorAll('.option').forEach((optionDiv, index) => {
            const letter = String.fromCharCode(65 + index);
            if (question.answer_letters.includes(letter)) {
                optionDiv.classList.add('study-correct');
            } else if (userAnswers.includes(letter)) {
                optionDiv.classList.add('study-incorrect-user');
            }
        });
        
        // Show feedback with numchoices info
        this.showInstantFeedback(isCorrect, question);
    }
    
    showInstantFeedback(isCorrect, question) {
        const container = this.getElement('instantFeedback');
        if (!container) return;
        
        const expectedText = question.expectedChoices > 1 ? 
            ` (Expected ${question.expectedChoices} answers)` : '';
        
        container.className = `instant-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        container.innerHTML = `
            <div class="feedback-result">${isCorrect ? 'Correct!' : 'Incorrect'}${expectedText}</div>
            <div class="feedback-explanation">
                <h4>Explanation:</h4>
                <div>${question.explanation || 'No explanation available.'}</div>
            </div>`;
        container.style.display = 'block';
    }
    
    // FIXED: Enhanced isAnswerCorrect method with better comparison logic
    isAnswerCorrect(question, userAnswers) {
        const correctAnswers = [...question.answer_letters].sort();
        const sortedUserAnswers = [...userAnswers].sort();
        
        // Must have the same number of answers
        if (sortedUserAnswers.length !== correctAnswers.length) {
            return false;
        }
        
        // All answers must match exactly
        return correctAnswers.every((val, index) => val === sortedUserAnswers[index]);
    }
    
    handlePreviousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.saveCurrentQuestionState();
            this.currentQuestionIndex--;
            this.displayCurrentQuestion();
        }
    }
    
    handleNextQuestion() {
        if (this.currentQuestionIndex < this.examQuestions.length - 1) {
            this.saveCurrentQuestionState();
            this.currentQuestionIndex++;
            this.displayCurrentQuestion();
        } else if (this.mode === 'exam') {
            this.finishExam();
        } else {
            alert("You've completed the study session!");
            this.showInitialState();
        }
    }
    
    saveCurrentQuestionState() {
        if (this.mode !== 'exam') return;
        
        this.recordCurrentAnswer();
        
        if (this.questionStartTime) {
            const timeSpent = Date.now() - this.questionStartTime;
            const questionId = this.examQuestions[this.currentQuestionIndex]?.id;
            if (questionId) {
                this.questionTimes[questionId] = (this.questionTimes[questionId] || 0) + timeSpent;
            }
        }
        
        this.stopQuestionTimer();
    }
    
    handleLegendClick(event) {
        if (!event.target.matches('.legend-dot-nav')) return;
        
        const index = parseInt(event.target.dataset.questionIndex, 10);
        this.navigateToQuestion(index);
    }
    
    handleLegendClickMobile(event) {
        if (!event.target.matches('.legend-dot-nav')) return;
        
        this.handleCloseSidePanel();
        const index = parseInt(event.target.dataset.questionIndex, 10);
        this.navigateToQuestion(index);
    }
    
    navigateToQuestion(index) {
        if (!this.examStarted || this.examFinished || index === this.currentQuestionIndex) return;
        if (index < 0 || index >= this.examQuestions.length) return;
        
        this.saveCurrentQuestionState();
        this.currentQuestionIndex = index;
        this.displayCurrentQuestion();
    }
    
    handleTogglePauseResume() {
        if (this.mode !== 'exam' || !this.examStarted || this.examFinished) return;
        
        if (this.globalTimerPaused) {
            this.startGlobalTimer();
        } else {
            this.pauseGlobalTimer();
        }
    }
    
    handleStartGlobalTimer() {
        this.startGlobalTimer();
    }
    
    handlePauseGlobalTimer() {
        if (this.globalTimerPaused) {
            this.startGlobalTimer();
        } else {
            this.pauseGlobalTimer();
        }
    }
    
    handleResetGlobalTimer() {
        if (this.mode !== 'exam') return;
        
        console.log('Resetting global timer');
        
        this.clearTimers();
        this.globalTimerPaused = true;
        this.globalTimeRemaining = 90 * 60; // Reset to 90 minutes
        this.questionTimeRemaining = 90; // Reset to 1:30
        
        // Force immediate display update
        this.updateAllTimerDisplays();
        
        console.log('Timer reset complete - Global:', this.formatTime(this.globalTimeRemaining), 'Question:', this.formatTime(this.questionTimeRemaining));
    }
    
    handleStopExam() {
        const message = this.mode === 'exam' 
            ? 'Are you sure you want to stop the exam? Your progress will be scored.'
            : 'Are you sure you want to end this study session?';
            
        if (confirm(message)) {
            if (this.mode === 'exam') {
                this.finishExam(false);
                alert('Exam stopped! Check the Review tab for your results.');
            } else {
                this.examFinished = true;
                this.showInitialState();
            }
        }
    }
    
    handleFinishExam() {
        this.finishExam();
    }
    
    finishExam(showAlert = true) {
        if (this.examFinished || this.mode !== 'exam') return;
        
        this.saveCurrentQuestionState();
        this.examFinished = true;
        this.clearTimers();
        
        // Keep desktop timer controls visible to show final times
        const timerControls = document.querySelector('.timer-controls.desktop');
        if (timerControls) {
            timerControls.style.display = 'flex';
            console.log('Desktop timer controls kept visible for final time display');
        }
        
        // Enable review tabs
        this.setTabState('reviewTab', true);
        this.setTabState('reviewTabMobile', true);
        
        // Switch to review tab
        this.handleReviewTabClick();
        
        if (showAlert) {
            alert('Exam completed! Check the Review tab for your results.');
        }
    }
    
    handleExamTabClick() {
        this.switchToTab('exam');
    }
    
    handleReviewTabClick() {
        if (!this.examFinished && this.mode === 'exam') {
            alert('Please finish the exam first to view results.');
            return;
        }
        
        this.switchToTab('review');
        this.displayReviewResults();
    }
    
    switchToTab(tabType) {
        // Remove active from all tabs
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        if (tabType === 'review') {
            ['reviewTab', 'reviewTabMobile'].forEach(id => {
                const tab = this.getElement(id);
                if (tab) tab.classList.add('active');
            });
            
            const content = this.getElement('reviewContent');
            if (content) content.classList.add('active');
        } else {
            ['examTab', 'examTabMobile'].forEach(id => {
                const tab = this.getElement(id);
                if (tab) tab.classList.add('active');
            });
            
            const content = this.getElement('examContent');
            if (content) content.classList.add('active');
        }
        
        this.handleCloseSidePanel();
    }
    
    displayReviewResults() {
        try {
            const scoreResult = this.calculateFinalScore();
            const percentage = scoreResult.totalVisited > 0 ? 
                Math.round((scoreResult.correct / scoreResult.totalVisited) * 100) : 0;
            
            // Update score display
            this.setElementContent('scorePercentage', `${percentage}%`);
            this.setElementContent('correctAnswers', scoreResult.correct);
            this.setElementContent('totalAnswered', scoreResult.totalVisited);
            this.setElementContent('totalTime', this.formatTime(this.calculateTotalTimeSpent()));
            
            // Update score circle styling
            this.updateScoreCircle(percentage);
            
            // Update time statistics
            this.updateTimeStatistics();
            
            // Display detailed review
            this.displayDetailedReview();
            
        } catch (error) {
            console.error('Error displaying review results:', error);
        }
    }
    
    calculateFinalScore() {
        let correct = 0;
        this.examQuestions.forEach((question, index) => {
            if (this.visitedQuestions.has(index)) {
                const userAnswers = this.userAnswers[question.id] || [];
                if (this.isAnswerCorrect(question, userAnswers)) {
                    correct++;
                }
            }
        });
        
        return { correct, totalVisited: this.visitedQuestions.size };
    }
    
    calculateTotalTimeSpent() {
        return Math.floor(Object.values(this.questionTimes).reduce((total, time) => total + time, 0) / 1000);
    }
    
    updateScoreCircle(percentage) {
        const circle = document.querySelector('.score-circle');
        if (circle) {
            circle.className = 'score-circle';
            if (percentage >= 72) {
                circle.classList.add('pass');
            } else if (percentage >= 50) {
                circle.classList.add('average');
            } else {
                circle.classList.add('fail');
            }
        }
    }
    
    updateTimeStatistics() {
        const times = Object.values(this.questionTimes).map(t => Math.floor(t / 1000));
        if (times.length === 0) {
            ['avgTime', 'minTime', 'maxTime', 'medianTime'].forEach(id => {
                this.setElementContent(id, '--:--');
            });
            return;
        }
        
        const avg = Math.floor(times.reduce((sum, time) => sum + time, 0) / times.length);
        const sorted = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? 
            sorted[mid] : Math.floor((sorted[mid - 1] + sorted[mid]) / 2);
        
        this.setElementContent('avgTime', this.formatTime(avg));
        this.setElementContent('minTime', this.formatTime(sorted[0]));
        this.setElementContent('maxTime', this.formatTime(sorted[sorted.length - 1]));
        this.setElementContent('medianTime', this.formatTime(median));
    }
    
    displayDetailedReview() {
        const container = this.getElement('reviewQuestions');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            if (!this.visitedQuestions.has(index)) return;
            
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            const timeSpent = this.questionTimes[question.id] || 0;
            
            const questionDiv = this.createReviewQuestionElement(question, index, userAnswers, isCorrect, timeSpent);
            container.appendChild(questionDiv);
        });
    }
    
    createReviewQuestionElement(question, index, userAnswers, isCorrect, timeSpent) {
        const questionDiv = document.createElement('div');
        questionDiv.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
        
        const optionsHtml = question.options.map((optionText, optionIndex) => {
            const letter = String.fromCharCode(65 + optionIndex);
            const isUserAnswer = userAnswers.includes(letter);
            const isCorrectAnswer = question.answer_letters.includes(letter);
            
            let classNames = 'review-answer';
            if (isCorrectAnswer) {
                classNames += ' correct-answer';
            } else if (isUserAnswer) {
                classNames += ' user-incorrect';
            }
            
            const marker = isUserAnswer ? ' <span class="review-answer-marker">(Your Answer)</span>' : '';
            return `<div class="${classNames}">${letter}. ${optionText}${marker}</div>`;
        }).join('');
        
        // Enhanced header with numchoices info
        const questionTypeInfo = question.expectedChoices > 1 ? 
            ` (${question.expectedChoices} choices required)` : ' (single choice)';
        
        questionDiv.innerHTML = `
            <div class="review-question-header">
                <span class="review-question-number">Question ${index + 1}${questionTypeInfo}</span>
                <span class="review-question-time">Time: ${this.formatTime(Math.floor(timeSpent / 1000))}</span>
                <span class="review-question-status ${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct' : 'Incorrect'}</span>
            </div>
            <div class="review-question-text">${question.question || ''}</div>
            <div class="review-answers"><h4>Options:</h4>${optionsHtml}</div>
            <div class="review-explanation"><h4>Explanation:</h4><div>${question.explanation || 'No explanation available.'}</div></div>`;
        
        return questionDiv;
    }
    
    handleOpenSidePanel() {
        const sidePanel = this.getElement('sidePanel');
        const overlay = this.getElement('overlay');
        if (sidePanel) sidePanel.classList.add('open');
        if (overlay) overlay.classList.add('active');
    }
    
    handleCloseSidePanel() {
        const sidePanel = this.getElement('sidePanel');
        const overlay = this.getElement('overlay');
        if (sidePanel) sidePanel.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
    }
    
    handleExportResults() {
        if (!this.examFinished) {
            alert("Please complete the exam before exporting results.");
            return;
        }
        
        try {
            const results = this.generateResultsReport();
            this.downloadFile(results, 'text/markdown', 'aws-clf-c02-exam-results');
        } catch (error) {
            console.error('Error exporting results:', error);
            alert('Error exporting results: ' + error.message);
        }
    }
    
    generateResultsReport() {
        const scoreResult = this.calculateFinalScore();
        const percentage = scoreResult.totalVisited > 0 ? 
            Math.round((scoreResult.correct / scoreResult.totalVisited) * 100) : 0;
        
        let markdown = `# AWS CLF-C02 Exam Results\n\n`;
        markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
        markdown += `**Final Score:** ${scoreResult.correct}/${scoreResult.totalVisited} (${percentage}%)\n`;
        markdown += `**Total Time Spent:** ${this.formatTime(this.calculateTotalTimeSpent())}\n\n`;
        markdown += `## Detailed Question Review\n\n---\n\n`;
        
        this.examQuestions.forEach((question, index) => {
            if (!this.visitedQuestions.has(index)) return;
            
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            const timeSpent = this.formatTime(Math.floor((this.questionTimes[question.id] || 0) / 1000));
            const questionType = question.expectedChoices > 1 ? 
                ` (${question.expectedChoices} choices required)` : ' (single choice)';
            
            markdown += `### Question ${index + 1}${questionType}: ${isCorrect ? '✅ Correct' : '❌ Incorrect'}\n\n`;
            markdown += `**Time Spent:** ${timeSpent}\n\n`;
            markdown += `**Question:**\n${question.question.replace(/<br\s*\/?>/gi, '\n')}\n\n`;
            markdown += `**Your Answer(s):** ${userAnswers.length > 0 ? userAnswers.join(', ') : 'Not Answered'}\n`;
            markdown += `**Correct Answer(s):** ${question.answer_letters.join(', ')}\n\n`;
            markdown += `**Explanation:**\n${question.explanation.replace(/<br\s*\/?>/gi, '\n')}\n\n---\n\n`;
        });
        
        return markdown;
    }
    
    downloadFile(content, mimeType, filename) {
        const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Cleanup method
    destroy() {
        // Clear all timers
        this.clearTimers();
        if (this.timerUpdateInterval) {
            clearInterval(this.timerUpdateInterval);
        }
    }
}

// Application initialization
function initializeApplication() {
    try {
        console.log('Starting AWS CLF-C02 Exam Simulator initialization...');
        
        const simulator = new ExamSimulator();
        
        // Store reference globally for cleanup if needed
        window.examSimulator = simulator;
        
        simulator.init().then(() => {
            console.log('Application initialized successfully');
        }).catch(error => {
            console.error('Application initialization failed:', error);
            
            // Try to show error in UI
            const examStatus = document.getElementById('examStatus');
            if (examStatus) {
                examStatus.innerHTML = `
                    <div class="error-message">
                        <strong>Failed to Initialize:</strong><br>
                        ${error.message}<br><br>
                        Please check the browser console for more details.
                    </div>`;
            } else {
                alert(`Failed to initialize: ${error.message}`);
            }
        });
        
    } catch (error) {
        console.error('Critical error during startup:', error);
        alert(`Critical startup error: ${error.message}`);
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.examSimulator) {
        window.examSimulator.destroy();
    }
});

// Wait for DOM to be ready before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    // DOM is already ready
    initializeApplication();
}