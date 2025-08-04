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
                let match = answer.match(/^([A-Z])\.\s*/) || answer.match(/<b>([A-Z])\.\s*/);
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
        });
    }
    
    mapQuestionDomains() {
        const domainMapping = {
            'Cloud Concepts': 'Cloud Concepts', 'Security and Compliance': 'Security and Compliance', 'Technology': 'Technology', 'Billing and Pricing': 'Billing and Pricing',
            'Compute': 'Technology', 'Storage': 'Technology', 'Database': 'Technology', 'Networking': 'Technology', 'Analytics': 'Technology', 'Machine Learning': 'Technology',
            'Management Tools': 'Technology', 'Developer Tools': 'Technology', 'IoT': 'Technology', 'AWS Global Infrastructure': 'Cloud Concepts', 'AWS Well-Architected Framework': 'Cloud Concepts', 
            'AWS Pricing': 'Billing and Pricing', 'AWS Support': 'Billing and Pricing', 'Security': 'Security and Compliance', 'Identity and Access Management': 'Security and Compliance', 
            'Compliance': 'Security and Compliance', 'Unknown': 'Technology', 'Uncategorized': 'Technology'
        };
        this.allQuestions.forEach(q => q.mappedDomain = domainMapping[q.category || q.domain || 'Technology'] || 'Technology');
    }
    
    generateExamQuestions() {
        const totalQuestions = Math.min(65, this.allQuestions.length);
        const selectedQuestions = [];
        const domainTargets = {};
        Object.keys(this.domainDistribution).forEach(d => domainTargets[d] = Math.round(totalQuestions * this.domainDistribution[d]));
        
        const questionsByDomain = {};
        Object.keys(this.domainDistribution).forEach(d => questionsByDomain[d] = []);
        this.allQuestions.forEach(q => { if (questionsByDomain[q.mappedDomain]) questionsByDomain[q.mappedDomain].push(q); });
        
        Object.keys(domainTargets).forEach(domain => {
            const available = this.shuffleArray(questionsByDomain[domain]);
            selectedQuestions.push(...available.slice(0, Math.min(domainTargets[domain], available.length)));
        });
        
        while (selectedQuestions.length < totalQuestions && selectedQuestions.length < this.allQuestions.length) {
            const remaining = this.allQuestions.filter(q => !selectedQuestions.includes(q));
            if (remaining.length > 0) selectedQuestions.push(remaining[Math.floor(Math.random() * remaining.length)]);
            else break;
        }
        
        this.examQuestions = this.shuffleArray(selectedQuestions).slice(0, totalQuestions);
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
        document.getElementById('prevQuestion').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
        document.getElementById('finishExam').addEventListener('click', () => this.finishExam());
        document.getElementById('exportResults').addEventListener('click', () => this.exportResults());
        
        document.addEventListener('change', e => { if (e.target.matches('input[name="answer"]')) this.recordAnswer(); });

        const navigateFromLegend = (e) => {
            if (e.target.matches('.legend-dot-nav')) {
                const index = parseInt(e.target.dataset.questionIndex, 10);
                this.navigateToQuestion(index);
                this.toggleMobileMenu(false); // Close menu if open
            }
        };
        document.getElementById('examLegendDots').addEventListener('click', navigateFromLegend);
        document.getElementById('mobileExamLegendDots').addEventListener('click', navigateFromLegend);

        // Mobile Menu controls
        document.getElementById('mobileMenuToggle').addEventListener('click', () => this.toggleMobileMenu(true));
        document.getElementById('closeMobileMenu').addEventListener('click', () => this.toggleMobileMenu(false));
        document.getElementById('overlay').addEventListener('click', () => this.toggleMobileMenu(false));
        document.getElementById('stopExamMobile').addEventListener('click', () => {
            this.toggleMobileMenu(false);
            this.stopExam();
        });
    }

    toggleMobileMenu(open) {
        document.body.classList.toggle('menu-open', open);
    }
    
    showInitialState() {
        document.getElementById('examControls').style.display = 'block';
        document.getElementById('examInterface').style.display = 'none';
        document.getElementById('examLegend').style.display = 'none';
        document.getElementById('reviewTab').style.opacity = '0.5';
        document.getElementById('reviewTab').style.pointerEvents = 'none';
        this.updateGlobalTimerDisplay();
        this.updateQuestionTimerDisplay();
    }
    
    async startExam() {
        if (this.allQuestions.length === 0) return alert('No questions available.');
        
        document.getElementById('examStatus').innerHTML = '<div class="loading-message">Generating exam questions...</div>';
        this.generateExamQuestions();
        if (this.examQuestions.length === 0) return alert('No exam questions could be generated.');
            
        this.examStarted = true;
        this.examFinished = false;
        this.userAnswers = {};
        this.questionTimes = {};
        this.visitedQuestions = new Set();
        this.currentQuestionIndex = 0;
        this.globalTimeRemaining = 90 * 60;
            
        document.getElementById('examControls').style.display = 'none';
        document.getElementById('examInterface').style.display = 'block';
        document.getElementById('examLegend').style.display = 'flex';
        
        this.startGlobalTimer();
        this.createExamLegend();
        this.displayQuestion();
    }
    
    stopExam() {
        if (confirm('Are you sure you want to stop the exam? Your progress will be scored.')) {
            this.examFinished = true;
            if (this.examStarted) this.saveCurrentQuestionState();
            this.stopGlobalTimer();
            document.getElementById('reviewTab').style.opacity = '1';
            document.getElementById('reviewTab').style.pointerEvents = 'auto';
            document.getElementById('reviewTab').click();
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
            }
        });
    }
    
    displayQuestion() {
        if (this.examQuestions.length === 0) return;
        
        if(this.questionStartTime) this.saveCurrentQuestionState(false); // Save time for previous question

        const question = this.examQuestions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.question || 'Question text not available';
        
        const questionOptions = document.getElementById('questionOptions');
        questionOptions.innerHTML = '';
        
        const isMultiple = question.answer_letters && question.answer_letters.length > 1;
        const inputType = isMultiple ? 'checkbox' : 'radio';
        
        if (isMultiple) {
            const instruction = document.createElement('div');
            instruction.className = 'question-instruction';
            instruction.textContent = `Select ${question.answer_letters.length} answers:`;
            questionOptions.appendChild(instruction);
        }
        
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
                    if (inputType === 'radio') input.checked = true;
                    else input.checked = !input.checked;
                    this.recordAnswer();
                }
            });
            questionOptions.appendChild(optionDiv);
        });
        
        this.visitedQuestions.add(this.currentQuestionIndex);
        this.restoreAnswers();
        this.startQuestionTimer();
        this.updateUI();
        this.updateExamLegend();
    }

    createExamLegend() {
        const desktopContainer = document.getElementById('examLegendDots');
        const mobileContainer = document.getElementById('mobileExamLegendDots');
        desktopContainer.innerHTML = '';
        mobileContainer.innerHTML = '';

        this.examQuestions.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'legend-dot-nav';
            dot.dataset.questionIndex = index;
            dot.textContent = index + 1;
            desktopContainer.appendChild(dot);
            mobileContainer.appendChild(dot.cloneNode(true));
        });
        this.updateExamLegend();
    }

    updateExamLegend() {
        if (!this.examStarted) return;
        const dots = document.querySelectorAll('.legend-dot-nav');
        dots.forEach(dot => {
            const index = parseInt(dot.dataset.questionIndex, 10);
            const questionId = this.examQuestions[index].id;
            const hasAnswer = this.userAnswers[questionId] && this.userAnswers[questionId].length > 0;
            const isVisited = this.visitedQuestions.has(index);

            dot.className = 'legend-dot-nav'; // Reset classes

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
        if (!this.examStarted || this.examFinished || index === this.currentQuestionIndex) return;
        if (index >= 0 && index < this.examQuestions.length) {
            this.currentQuestionIndex = index;
            this.displayQuestion();
        }
    }
    
    restoreAnswers() {
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        const savedAnswers = this.userAnswers[questionId];
        
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.checked = savedAnswers && savedAnswers.includes(input.value);
            input.closest('.option').classList.toggle('selected', input.checked);
        });
    }
    
    recordAnswer() {
        const questionId = this.examQuestions[this.currentQuestionIndex].id;
        const selectedInputs = document.querySelectorAll('input[name="answer"]:checked');
        this.userAnswers[questionId] = Array.from(selectedInputs).map(input => input.value);
        
        document.querySelectorAll('.option').forEach(option => {
            const input = option.querySelector('input');
            option.classList.toggle('selected', input && input.checked);
        });
        this.updateExamLegend();
    }
    
    startGlobalTimer() {
        if (this.globalTimer) clearInterval(this.globalTimer);
        this.globalTimer = setInterval(() => {
            this.globalTimeRemaining--;
            this.updateGlobalTimerDisplay();
            if (this.globalTimeRemaining <= 0) this.finishExam();
        }, 1000);
    }
    
    stopGlobalTimer() {
        clearInterval(this.globalTimer);
        clearInterval(this.questionTimer);
    }
    
    startQuestionTimer() {
        if (this.questionTimer) clearInterval(this.questionTimer);
        this.questionTimeRemaining = 90;
        this.questionStartTime = Date.now();
        this.updateQuestionTimerDisplay();
        
        this.questionTimer = setInterval(() => {
            if (!this.examFinished) {
                this.questionTimeRemaining--;
                this.updateQuestionTimerDisplay();
                if (this.questionTimeRemaining < 0) this.questionTimeRemaining = 0;
            }
        }, 1000);
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
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.examQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        }
    }
    
    saveCurrentQuestionState(recordAnswer = true) {
        if(recordAnswer) this.recordAnswer();
        if (this.questionStartTime) {
            const timeSpent = Date.now() - this.questionStartTime;
            const questionId = this.examQuestions[this.currentQuestionIndex].id;
            this.questionTimes[questionId] = (this.questionTimes[questionId] || 0) + timeSpent;
        }
    }
    
    finishExam() {
        this.saveCurrentQuestionState();
        this.examFinished = true;
        this.stopGlobalTimer();
        document.getElementById('reviewTab').style.opacity = '1';
        document.getElementById('reviewTab').style.pointerEvents = 'auto';
        document.getElementById('reviewTab').click();
    }
    
    displayReview() {
        const scoreResult = this.calculateScore();
        const percentage = scoreResult.totalVisited > 0 ? Math.round((scoreResult.correct / scoreResult.totalVisited) * 100) : 0;
        const totalTimeSpent = Object.values(this.questionTimes).reduce((a, b) => a + b, 0);
        
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
            incompleteNote.textContent = `Incomplete Exam: ${scoreResult.totalVisited}/${this.examQuestions.length} attempted`;
            scoreDetails.appendChild(incompleteNote);
        }
        
        const scoreCircle = document.querySelector('.score-circle');
        if (percentage >= 70) scoreCircle.style.background = '#28a745';
        else if (percentage >= 50) scoreCircle.style.background = '#ffc107';
        else scoreCircle.style.background = '#dc3545';
        
        const timeStats = this.calculateTimeStats();
        document.getElementById('avgTime').textContent = this.formatTime(timeStats.avg);
        document.getElementById('minTime').textContent = this.formatTime(timeStats.min);
        document.getElementById('maxTime').textContent = this.formatTime(timeStats.max);
        document.getElementById('medianTime').textContent = this.formatTime(timeStats.median);

        this.displayReviewQuestions();
    }

    calculateTimeStats() {
        const times = Object.values(this.questionTimes);
        if (times.length === 0) return { min: 0, max: 0, avg: 0, median: 0 };
        const min = Math.min(...times);
        const max = Math.max(...times);
        const avg = times.reduce((s, t) => s + t, 0) / times.length;
        const sorted = [...times].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
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
            
            const userAnswerTexts = userAnswers.map(l => `${l}. ${this.getOptionText(question, l)}`);
            const correctAnswerTexts = question.answer_letters.map(l => `${l}. ${this.getOptionText(question, l)}`);
            
            questionDiv.innerHTML = `
                <div class="review-question-header">
                    <span class="review-question-number">Question ${index + 1}</span>
                    <span class="review-question-time">Time: ${this.formatTime(timeSpent)}</span>
                    <span class="review-question-status">${isCorrect ? 'Correct' : 'Incorrect'}</span>
                </div>
                <div class="review-question-text">${question.question}</div>
                <div class="review-answers">
                    <h4>Your Answer(s):</h4>
                    ${userAnswerTexts.length > 0 ? userAnswerTexts.map(a => `<div>${a}</div>`).join('') : '<div>No answer selected</div>'}
                    <h4>Correct Answer(s):</h4>
                    ${correctAnswerTexts.map(a => `<div>${a}</div>`).join('')}
                </div>
                <div class="review-explanation">
                    <h4>Explanation:</h4>
                    <div>${question.explanation || 'No explanation available.'}</div>
                </div>
            `;
            reviewContainer.appendChild(questionDiv);
        });
    }

    getOptionText(question, letter) {
        const optionIndex = letter.charCodeAt(0) - 65;
        return question.options[optionIndex] || letter;
    }
    
    calculateScore() {
        let correct = 0;
        this.examQuestions.forEach((question, index) => {
            if (this.visitedQuestions.has(index)) {
                if (this.isAnswerCorrect(question, this.userAnswers[question.id] || [])) correct++;
            }
        });
        return { correct, totalVisited: this.visitedQuestions.size };
    }
    
    isAnswerCorrect(question, userAnswers) {
        const correct = (question.answer_letters || []).sort();
        const user = userAnswers.sort();
        return correct.length === user.length && correct.every((val, i) => val === user[i]);
    }
    
    calculateTotalTime() {
        return Object.values(this.questionTimes).reduce((t, c) => t + c, 0);
    }
    
    formatTime(ms) {
        const s = Math.floor(ms / 1000);
        return `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
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
        
        let markdown = `# AWS CLF-C02 Exam Results\n\n`;
        markdown += `**Score:** ${scoreResult.correct}/${scoreResult.totalVisited} (${percentage}%)\n`;
        markdown += `**Total Time:** ${this.formatTime(this.calculateTotalTime())}\n\n`;
        
        this.examQuestions.forEach((question, index) => {
            if (!this.visitedQuestions.has(index)) return;
            const userAnswers = this.userAnswers[question.id] || [];
            const isCorrect = this.isAnswerCorrect(question, userAnswers);
            
            markdown += `### Question ${index + 1} ${isCorrect ? '✅' : '❌'}\n\n`;
            markdown += `**Question:** ${question.question}\n\n`;
            markdown += `**Your Answer(s):** ${userAnswers.join(', ') || 'N/A'}\n`;
            markdown += `**Correct Answer(s):** ${question.answer_letters.join(', ')}\n\n`;
        });
        
        return markdown;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ExamSimulator();
});
