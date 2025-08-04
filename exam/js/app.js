// AWS CLF-C02 Exam Simulator
class ExamSimulator {
    constructor() {
        this.allQuestions = [];
        this.examQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.questionTimes = {}; // Total time spent on each question
        this.questionRemainingTimes = {}; // Remaining time for each question (countdown)
        this.globalTimer = null;
        this.questionTimer = null;
        this.globalTimeRemaining = 90 * 60; // 90 minutes in seconds
        this.questionTimeRemaining = 90; // 1:30 in seconds
        this.questionStartTime = null;
        this.examStarted = false;
        this.examFinished = false;
        this.examInitialized = false;
        this.visitedQuestions = new Set(); // Track which questions user has visited
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
                // Format 1: "B. Amazon DynamoDB" (aws_mcq_questions.json)
                let match = answer.match(/^([A-Z])\.\s*/);
                if (match) {
                    letters.push(match[1]);
                    return;
                }
                
                // Format 2: "<b>A. The ability...</b>" (aws_e5_exams.json)
                match = answer.match(/<b>([A-Z])\.\s*/);
                if (match) {
                    letters.push(match[1]);
                    return;
                }
                
                // Format 3: Split by <br> and look for letter patterns
                answer.split('<br>').forEach(item => {
                    const m = item.trim().match(/^([A-Z])\./);
                    if (m) letters.push(m[1]);
                });
                
                // Format 4: Plain answer text - match against options
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
            
            // Remove duplicates and sort
            question.answer_letters = [...new Set(letters)].sort();
            
            // Ensure question has answer_letters, even if we couldn't derive them
            if (question.answer_letters.length === 0 && question.correct_answers.length > 0) {
                // Fallback: assume first correct answer corresponds to option A
                question.answer_letters = ['A'];
            }
        });
    }
    
    mapQuestionDomains() {
        // Map existing categories/domains to CLF-C02 domains
        const domainMapping = {
            // Direct matches
            'Cloud Concepts': 'Cloud Concepts',
            'Security and Compliance': 'Security and Compliance', 
            'Technology': 'Technology',
            'Billing and Pricing': 'Billing and Pricing',
            
            // Category mappings
            'Compute': 'Technology',
            'Storage': 'Technology',
            'Database': 'Technology',
            'Networking': 'Technology',
            'Analytics': 'Technology',
            'Machine Learning': 'Technology',
            'Management Tools': 'Technology',
            'Developer Tools': 'Technology',
            'IoT': 'Technology',
            'Game Development': 'Technology',
            'Mobile Services': 'Technology',
            'AR & VR': 'Technology',
            'Application Integration': 'Technology',
            'AWS Global Infrastructure': 'Cloud Concepts',
            'AWS Well-Architected Framework': 'Cloud Concepts',
            'AWS Pricing': 'Billing and Pricing',
            'AWS Support': 'Billing and Pricing',
            'Security': 'Security and Compliance',
            'Identity and Access Management': 'Security and Compliance',
            'Compliance': 'Security and Compliance',
            
            // Assessment categories
            'Assessment': 'Technology',
            'Set 1': 'Technology',
            'Set 2': 'Technology', 
            'Set 3': 'Technology',
            'Mock Exam 1': 'Technology',
            'Mock Exam 2': 'Technology',
            
            // Default fallbacks
            'Unknown': 'Technology',
            'Uncategorized': 'Technology'
        };
        
        this.allQuestions.forEach(question => {
            const category = question.category || question.domain || 'Technology';
            question.mappedDomain = domainMapping[category] || 'Technology';
        });
    }
    
    generateExamQuestions() {
        const totalQuestions = Math.min(65, this.allQuestions.length);
        const selectedQuestions = [];
        
        // Calculate target counts for each domain
        const domainTargets = {};
        Object.keys(this.domainDistribution).forEach(domain => {
            domainTargets[domain] = Math.round(totalQuestions * this.domainDistribution[domain]);
        });
        
        // Separate questions by domain
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
        
        // Select questions for each domain
        Object.keys(domainTargets).forEach(domain => {
            const target = domainTargets[domain];
            const availableQuestions = questionsByDomain[domain];
            
            if (availableQuestions.length > 0) {
                const shuffled = this.shuffleArray(availableQuestions);
                const selected = shuffled.slice(0, Math.min(target, shuffled.length));
                selectedQuestions.push(...selected);
            }
        });
        
        // If we don't have enough questions, fill from remaining questions
        while (selectedQuestions.length < totalQuestions && selectedQuestions.length < this.allQuestions.length) {
            const remainingQuestions = this.allQuestions.filter(q => !selectedQuestions.includes(q));
            if (remainingQuestions.length > 0) {
                selectedQuestions.push(remainingQuestions[Math.floor(Math.random() * remainingQuestions.length)]);
            } else {
                break;
            }
        }
        
        // Shuffle the final selection
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
        // Exam control buttons
        document.getElementById('startExam').addEventListener('click', () => this.startExam());
        document.getElementById('stopExam').addEventListener('click', () => this.stopExam());
        
        // Timer controls
        document.getElementById('startGlobalTimer').addEventListener('click', () => this.startGlobalTimer());
        document.getElementById('pauseGlobalTimer').addEventListener('click', () => this.pauseGlobalTimer());
        document.getElementById('stopGlobalTimer').addEventListener('click', () => this.stopGlobalTimer());
        document.getElementById('resetGlobalTimer').addEventListener('click', () => this.resetGlobalTimer());
        
        // Navigation
        document.getElementById('prevQuestion').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finishExam').addEventListener('click', () => this.finishExam());
        
        // Export
        document.getElementById('exportResults').addEventListener('click', () => this.exportResults());
        
        // Answer selection
        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="answer"]')) {
                this.recordAnswer();
            }
        });
    }
    
    showInitialState() {
        // Show the initial exam controls and hide the exam interface
        document.getElementById('examControls').style.display = 'block';
        document.getElementById('examInterface').style.display = 'none';
        
        // Reset timer states
        this.globalTimerPaused = false;
        this.updateGlobalTimerDisplay();
        this.updateQuestionTimerDisplay();
        
        // Disable review tab initially
        document.getElementById('reviewTab').style.opacity = '0.5';
        document.getElementById('reviewTab').style.pointerEvents = 'none';
    }
    
    async startExam() {
        try {
            if (this.allQuestions.length === 0) {
                alert('No questions available. Please ensure the data files are loaded correctly.');
                return;
            }
            
            // Show loading state 
            document.getElementById('examStatus').innerHTML = '<div class="loading-message">Generating exam questions...</div>';
            
            // Generate exam questions
            this.generateExamQuestions();
            
            if (this.examQuestions.length === 0) {
                throw new Error('No exam questions could be generated.');
            }
            
            this.examInitialized = true;
            this.examStarted = true;
            this.globalTimerPaused = false;
            
            // Clear any previous question state
            this.questionRemainingTimes = {};
            this.questionTimes = {};
            
            // Hide exam controls and show exam interface
            document.getElementById('examControls').style.display = 'none';
            document.getElementById('examInterface').style.display = 'block';
            
            // Display first question (this will start the question timer)
            this.displayQuestion();
            this.updateUI();
            
            // Start the global timer automatically (this will also ensure question timer runs)
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
            
            // Save current question state
            if (this.examInitialized && this.examQuestions.length > 0) {
                this.saveCurrentQuestionState();
            }
            
            // Enable review tab
            document.getElementById('reviewTab').style.opacity = '1';
            document.getElementById('reviewTab').style.pointerEvents = 'auto';
            
            // Switch to review tab
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
        
        // Track that this question has been visited
        this.visitedQuestions.add(this.currentQuestionIndex);
        
        // Update question text
        questionText.textContent = question.question || 'Question text not available';
        
        // Clear previous options
        questionOptions.innerHTML = '';
        
        // Determine if this is a multiple choice question
        const isMultiple = question.answer_letters && question.answer_letters.length > 1;
        const inputType = isMultiple ? 'checkbox' : 'radio';
        
        // Add instruction for multiple choice
        if (isMultiple) {
            const instruction = document.createElement('div');
            instruction.className = 'question-instruction';
            instruction.textContent = `Select ${question.answer_letters.length} answers:`;
            questionOptions.appendChild(instruction);
        }
        
        // Create options
        if (question.options && question.options.length > 0) {
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'option';
                
                const input = document.createElement('input');
                input.type = inputType;
                input.name = 'answer';
                input.value = String.fromCharCode(65 + index); // A, B, C, D...
                input.id = `option${index}`;
                
                const label = document.createElement('label');
                label.htmlFor = `option${index}`;
                label.className = 'option-text';
                label.textContent = option;
                
                optionDiv.appendChild(input);
                optionDiv.appendChild(label);
                
                // Add click handler for the entire option div
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
        
        // Restore previous answers
        this.restoreAnswers();
        
        // Start question timer (will check if global timer is paused)
        this.startQuestionTimer();
        
        // Update UI
        this.updateUI();
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
        
        // Update visual selection
        document.querySelectorAll('.option').forEach(option => {
            const input = option.querySelector('input');
            if (input && input.checked) {
                option.classList.add('selected');
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Record time spent on this question
        if (this.questionStartTime) {
            const timeSpent = Date.now() - this.questionStartTime;
            this.questionTimes[questionId] = (this.questionTimes[questionId] || 0) + timeSpent;
        }
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
        
        // Resume question timer if we're in an exam
        if (this.examInitialized && this.examQuestions.length > 0) {
            this.startQuestionTimer();
        }
        
        // Update button states
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
        
        // Also pause the question timer
        this.stopQuestionTimer();
        
        // Update button states
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
    }
    
    stopGlobalTimer() {
        if (this.globalTimer) {
            clearInterval(this.globalTimer);
            this.globalTimer = null;
        }
        
        this.globalTimerPaused = true;
        
        // Also stop the question timer
        this.stopQuestionTimer();
        
        // Update button states
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
        document.getElementById('stopGlobalTimer').disabled = true;
    }
    
    resetGlobalTimer() {
        this.stopGlobalTimer();
        this.globalTimeRemaining = 90 * 60;
        this.globalTimerPaused = false;
        this.updateGlobalTimerDisplay();
        
        // Reset question timer to initial state
        this.questionTimeRemaining = 90;
        this.updateQuestionTimerDisplay();
        
        // Clear all stored question times
        this.questionRemainingTimes = {};
        this.questionTimes = {};
        
        // Reset button states
        document.getElementById('startGlobalTimer').disabled = false;
        document.getElementById('pauseGlobalTimer').disabled = true;
        document.getElementById('stopGlobalTimer').disabled = true;
    }
    
    startQuestionTimer() {
        // Don't start question timer if global timer is paused
        if (this.globalTimerPaused) {
            return;
        }
        
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
        }
        
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        
        // Use stored remaining time if available, otherwise start with 90 seconds
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
        
        // Save the remaining time for the current question
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
        // Update question counter
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.examQuestions.length;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex + 1) / this.examQuestions.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // Update navigation buttons
        document.getElementById('prevQuestion').disabled = this.currentQuestionIndex === 0;
        document.getElementById('nextQuestion').disabled = this.currentQuestionIndex === this.examQuestions.length - 1;
        
        // Show finish button on last question
        if (this.currentQuestionIndex === this.examQuestions.length - 1) {
            document.getElementById('finishExam').style.display = 'block';
        } else {
            document.getElementById('finishExam').style.display = 'none';
        }
    }
    
    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            // Save current question state before navigating away
            this.saveCurrentQuestionState();
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.examQuestions.length - 1) {
            // Save current question state before navigating away
            this.saveCurrentQuestionState();
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    saveCurrentQuestionState() {
        // Record the current answer
        this.recordAnswer();
        
        // Stop the question timer and save remaining time
        this.stopQuestionTimer();
    }
    
    finishExam() {
        // Save current question state
        this.saveCurrentQuestionState();
        
        this.examFinished = true;
        this.stopGlobalTimer();
        
        // Enable review tab
        document.getElementById('reviewTab').style.opacity = '1';
        document.getElementById('reviewTab').style.pointerEvents = 'auto';
        
        // Switch to review tab
        document.getElementById('reviewTab').click();
        
        alert('Exam completed! Check the Review tab for your results.');
    }
    
    displayReview() {
        const scoreResult = this.calculateScore();
        const correctAnswers = scoreResult.correct;
        const totalVisited = scoreResult.totalVisited;
        const totalQuestions = this.examQuestions.length;
        const percentage = totalVisited > 0 ? Math.round((correctAnswers / totalVisited) * 100) : 0;
        const totalTimeSpent = this.calculateTotalTime();
        
        // Update score display
        document.getElementById('scorePercentage').textContent = `${percentage}%`;
        document.getElementById('correctAnswers').textContent = correctAnswers;
        document.getElementById('totalAnswered').textContent = totalVisited;
        document.getElementById('totalTime').textContent = this.formatTime(totalTimeSpent);
        
        // Add incomplete exam indicator if applicable
        const scoreDetails = document.querySelector('.score-details');
        // Remove any existing incomplete note
        const existingNote = scoreDetails.querySelector('.incomplete-note');
        if (existingNote) {
            existingNote.remove();
        }
        
        if (totalVisited < totalQuestions) {
            const incompleteNote = document.createElement('p');
            incompleteNote.className = 'incomplete-note';
            incompleteNote.textContent = `Incomplete Exam: ${totalVisited}/${totalQuestions} questions attempted`;
            incompleteNote.style.color = '#dc3545';
            incompleteNote.style.fontWeight = 'bold';
            scoreDetails.appendChild(incompleteNote);
        }
        
        // Update score circle color
        const scoreCircle = document.querySelector('.score-circle');
        if (percentage >= 70) {
            scoreCircle.style.background = '#28a745';
        } else if (percentage >= 50) {
            scoreCircle.style.background = '#ffc107';
        } else {
            scoreCircle.style.background = '#dc3545';
        }
        
        // Display review questions
        this.displayReviewQuestions();
    }
    
    displayReviewQuestions() {
        const reviewContainer = document.getElementById('reviewQuestions');
        reviewContainer.innerHTML = '';
        
        this.examQuestions.forEach((question, index) => {
            // Only show visited questions
            if (!this.visitedQuestions.has(index)) {
                return;
            }
            
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            const timeSpent = this.questionTimes[question.id] || 0;
            
            const questionDiv = document.createElement('div');
            questionDiv.className = `review-question ${isCorrect ? 'correct' : 'incorrect'}`;
            
            // Format user answers for display
            const userAnswerTexts = userAnswers.map(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                return question.options && question.options[optionIndex] 
                    ? `${letter}. ${question.options[optionIndex]}`
                    : letter;
            });
            
            // Format correct answers for display
            const correctAnswerTexts = question.answer_letters.map(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                return question.options && question.options[optionIndex]
                    ? `${letter}. ${question.options[optionIndex]}`
                    : letter;
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
                    ${correctAnswerTexts.map(answer => 
                        `<div class="review-answer correct-answer">${answer}</div>`
                    ).join('')}
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
            // Only count visited questions
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
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
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
        const correctAnswers = scoreResult.correct;
        const totalVisited = scoreResult.totalVisited;
        const totalQuestions = this.examQuestions.length;
        const percentage = totalVisited > 0 ? Math.round((correctAnswers / totalVisited) * 100) : 0;
        const totalTimeSpent = this.calculateTotalTime();
        
        let markdown = `# AWS CLF-C02 Exam Results\n\n`;
        markdown += `**Date:** ${new Date().toLocaleDateString()}\n`;
        markdown += `**Score:** ${correctAnswers}/${totalVisited} (${percentage}%)\n`;
        if (totalVisited < totalQuestions) {
            markdown += `**Exam Status:** Incomplete - ${totalVisited}/${totalQuestions} questions attempted\n`;
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
            // Only include visited questions in export
            if (!this.visitedQuestions.has(index)) {
                return;
            }
            
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
                    const optionText = question.options && question.options[optionIndex] 
                        ? question.options[optionIndex] 
                        : letter;
                    markdown += `- ${letter}. ${optionText}\n`;
                });
            } else {
                markdown += `- No answer selected\n`;
            }
            
            markdown += `\n**Correct Answer(s):**\n`;
            (question.answer_letters || []).forEach(letter => {
                const optionIndex = letter.charCodeAt(0) - 65;
                const optionText = question.options && question.options[optionIndex] 
                    ? question.options[optionIndex] 
                    : letter;
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
            // Only count visited questions
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

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ExamSimulator();
});