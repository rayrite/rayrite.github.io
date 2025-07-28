# AWS CLF-C02 Exam Simulator

A comprehensive web-based exam simulator for the AWS Certified Cloud Practitioner (CLF-C02) certification exam. This application provides a realistic exam experience with timing, question navigation, and detailed result analysis.

## Features

### 🎯 **Exam Simulation**
- **65 Questions**: Randomly selected from a pool of 1,495+ questions
- **Domain Distribution**: Questions are distributed according to official CLF-C02 exam format:
  - Cloud Concepts (26%)
  - Security and Compliance (25%)
  - Technology (33%)
  - Billing and Pricing (16%)
- **Question Types**: Both single-choice and multiple-choice questions
- **Realistic Interface**: Professional exam-like interface with progress tracking
- **Start/Stop Functionality**: Manual exam control with proper incomplete exam handling

### ⏱️ **Dual Timer System**
- **Global Timer**: 90-minute countdown for the entire exam
- **Question Timer**: 1:30 countdown per question
- **Timer Controls**: Start, pause, stop, and reset functionality
- **Independent Operation**: Timers work independently for flexible exam management

### 🧭 **Navigation & Progress**
- **Free Navigation**: Move back and forth between questions
- **Progress Bar**: Visual progress indicator
- **Question Counter**: Shows current position (e.g., "4/65")
- **Answer Persistence**: Answers are saved when navigating between questions

### 📊 **Review & Scoring**
- **Comprehensive Scoring**: Detailed score breakdown with percentage
- **Question-by-Question Review**: See all questions with:
  - Your answers vs. correct answers
  - Time spent per question
  - Detailed explanations
  - Correct/incorrect indicators
- **Domain Performance**: Performance breakdown by exam domain
- **Pass/Fail Status**: Based on 70% passing threshold

### 📄 **Export Functionality**
- **Markdown Export**: Export complete exam results to a markdown file
- **Detailed Report**: Includes all questions, answers, explanations, and timing data
- **Domain Statistics**: Performance analysis by domain

## File Structure

```
aws-exam-simulator/
├── index.html          # Main application file
├── css/
│   └── styles.css      # Application styling
├── js/
│   └── app.js          # Main application logic
├── data/
│   ├── aws_e2_exams.json
│   ├── aws_e3_exams.json
│   ├── aws_e4_exams.json
│   └── aws_mock_exams.json
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for loading JSON files)

### Installation & Setup

1. **Download/Clone** the application files
2. **Start a local web server** in the project directory:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
3. **Open your browser** and navigate to `http://localhost:8000`

### Usage Instructions

#### Taking an Exam
1. **Start the Application**: Open the application in your browser
2. **Initial State**: The application shows a "Start Exam" button and instructions
3. **Start the Exam**: Click "Start Exam" to begin
   - Questions are generated and randomized
   - Global timer starts automatically (90 minutes)
   - First question is displayed
4. **Answer Questions**: 
   - Read each question carefully
   - Select your answer(s) - single choice uses radio buttons, multiple choice uses checkboxes
   - Navigate using "Previous" and "Next" buttons
5. **Stop Exam (Optional)**: Click "Stop Exam" button in the top-right corner
   - Confirmation dialog will appear
   - Exam will be scored based on visited questions only
   - Review tab will be enabled automatically
6. **Complete the Exam**: Click "Finish Exam" when ready (appears on the last question)

#### Incomplete Exam Handling
- **Stop Anytime**: Use the "Stop Exam" button to end the exam early
- **Partial Scoring**: Only visited questions are included in the final score
- **Progress Tracking**: The system tracks which questions you've seen
- **Review Available**: Review tab becomes accessible after stopping
- **Export Support**: Incomplete exams can still be exported with full details

#### Reviewing Results
1. **Automatic Switch**: After finishing, you'll be taken to the Review tab
2. **View Score**: See your percentage score and pass/fail status
3. **Review Questions**: Scroll through detailed question-by-question analysis
4. **Export Results**: Click "Export Results" to download a markdown report

#### Timer Management
- **Start**: Begin the global countdown timer
- **Pause**: Pause the global timer (question timer continues)
- **Stop**: Stop the global timer
- **Reset**: Reset global timer to 90:00

## Technical Details

### Question Selection Algorithm
The application uses a sophisticated algorithm to select 65 questions that:
- Maintains proper domain distribution according to CLF-C02 exam blueprint
- Balances single-choice and multiple-choice questions (approximately 60/40 split)
- Randomly selects from the available question pool for variety

### Data Format
Questions are stored in JSON format with the following structure:
```json
{
  "id": 101,
  "question": "Question text here...",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answers": ["Correct Answer"],
  "explanation": "Detailed explanation...",
  "category": "Set 1",
  "domain": "Domain Name"
}
```

### Browser Compatibility
- **Chrome**: Fully supported
- **Firefox**: Fully supported
- **Safari**: Fully supported
- **Edge**: Fully supported
- **Mobile Browsers**: Responsive design supports mobile devices

### Performance
- **Load Time**: Fast initial load with efficient JSON parsing
- **Memory Usage**: Optimized for handling 1,495+ questions
- **Responsive**: Works on desktop, tablet, and mobile devices

## Troubleshooting

### Common Issues

**Questions not loading**
- Ensure you're running a local web server (not opening the HTML file directly)
- Check browser console for CORS errors
- Verify all JSON files are in the `data/` directory

**Timer not working**
- Check if JavaScript is enabled in your browser
- Refresh the page and try again
- Ensure no browser extensions are blocking JavaScript

**Export not working**
- Modern browsers may block downloads - check your download settings
- Ensure pop-ups are allowed for the localhost domain

### Browser Console
Open browser developer tools (F12) and check the console for any error messages.

## Study Tips

### Using This Simulator Effectively
1. **Take Multiple Practice Exams**: The random selection ensures variety
2. **Review Wrong Answers**: Focus on explanations for incorrect responses
3. **Track Domain Performance**: Identify weak areas using the domain breakdown
4. **Time Management**: Practice with the timer to build exam stamina
5. **Export and Review**: Keep exported results to track improvement over time

### CLF-C02 Exam Preparation
- **Official AWS Documentation**: Review AWS service documentation
- **AWS Free Tier**: Get hands-on experience with AWS services
- **Practice Exams**: Use this simulator regularly
- **Study Groups**: Discuss difficult concepts with others
- **AWS Training**: Consider official AWS training courses

## License

This project is for educational purposes. Question content is used for exam preparation and study purposes.

## Support

For issues or questions about this simulator:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all files are properly installed and accessible

## Version History

- **v1.0**: Initial release with full exam simulation functionality
- Features: 65-question exams, dual timers, review interface, export functionality
- Question pool: 1,495+ questions across all CLF-C02 domains

---

**Good luck with your AWS CLF-C02 certification exam!** 🚀

