Of course. Creating a clear and comprehensive usage guide is a critical step for any reusable tool. Here is a complete `USAGE.md` file in Markdown format. You can save this directly into your project folder.

---

# YSE: YouTube Slide Extractor - Usage Guide

## 1. Overview

**YSE (YouTube Slide Extractor)** is a powerful and configurable Python script designed to automate the process of extracting structured data from slideshow-style videos.

It works by:
1.  Watching an MP4 video file frame-by-frame.
2.  Detecting when a slide changes based on a configurable sensitivity `threshold`.
3.  Taking a snapshot of the new slide and performing Optical Character Recognition (OCR) to get the raw text.
4.  Using a selected `parsing profile` with regular expressions to extract specific fields (like ID, question, options, etc.) from the text.
5.  Saving the output as individual `.png`, `.txt`, and `.json` files for each relevant slide, as well as a consolidated `extracted_mcq_questions.json` file for the entire video.

## 2. Prerequisites

Before running the script, you must have the following installed and configured on your system.

### a. Python 3

Ensure you have Python 3 installed. You can check this by opening a command prompt or terminal and running:
```bash
python --version
```

### b. Google's Tesseract OCR Engine

This is the most critical dependency. The Python libraries only provide a wrapper; they do not include the OCR engine itself.

1.  **Download:** Go to the official Tesseract builds for Windows, maintained by the University of Mannheim:
    *   **Link:** [https://github.com/UB-Mannheim/tesseract/wiki](https://github.com/UB-Mannheim/tesseract/wiki)
2.  **Install:** Run the installer. During installation, it is **highly recommended** to check the box for **"Add Tesseract to system PATH"**.
3.  **Configure:** If you do not add Tesseract to your system PATH, you **must** manually set the path in the `config.py` file:
    ```python
    # config.py
    TESSERACT_CMD = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    ```

### c. Python Dependencies

The script requires several Python libraries. A `setup_and_run.bat` script is provided to automate this process.

**To install dependencies automatically (recommended):**
1.  Make sure `yse.py`, `config.py`, and `setup_and_run.bat` are in the same folder.
2.  Double-click `setup_and_run.bat`.
3.  This will create a Python virtual environment (`venv`), activate it, install the required libraries, and open a new command prompt window ready for use.

**To install dependencies manually:**
```bash
# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Linux/macOS
.\venv\Scripts\activate  # On Windows

# Install libraries using pip
pip install opencv-python pytesseract pillow
```

## 3. Configuration (`config.py`)

This file is the control center for the script. Before running, you should review and customize it.

*   **`TESSERACT_CMD`**: Set the path to your `tesseract.exe` if it's not in your system's PATH.
*   **`REQUIRED_TEXT_IN_SLIDE`**: The script will only process slides containing this text (e.g., `"Correct Answer:"`). This is the primary filter. Use `|` for OR logic (e.g., `"Correct Answer:|Answer :"`).
*   **`DEFAULT_THRESHOLD`**: The default sensitivity for slide change detection. Lower is more sensitive.
*   **`DEFAULT_PROFILE_NAME`**: The default parsing profile to use if `--profile` is not specified.
*   **`PARSING_PROFILES`**: This is the main dictionary of parsing profiles. Each profile contains a `PATTERNS` dictionary with regular expressions tailored to a specific slide layout. You can add as many new profiles as you need.

## 4. How to Run the Script

Open a command prompt or terminal in the project folder (if using the setup script, this is done for you). The basic command structure is:

```bash
python yse.py [path_to_video] [options]
```

### Command-Line Arguments

*   `input_video` (Required): The path to the input MP4 video file. If the path contains spaces, enclose it in quotes.
*   `--output_folder` (Optional): Folder to save all output files. Defaults to `slides_output`.
*   `--threshold` (Optional): Overrides the default sensitivity. Lower values (e.g., `0.2`) are more sensitive to small changes. Higher values (e.g., `5.0`) are less sensitive.
*   `--start_time` (Optional): Start processing the video from a specific time. Format: `HH:MM:SS`.
*   `--profile` (Optional): The name of the parsing profile to use from `config.py`. Defaults to the `DEFAULT_PROFILE_NAME` set in the config.
*   `--debug` (Optional): Enables debug mode. In this mode, the script saves a `.png` and `.txt` file for **every** detected slide change and prints its match status to the console, which is essential for tuning your threshold and patterns.

### Script Examples

#### Example 1: Basic Usage
This will process the entire video using the default threshold and parsing profile.
```bash
python yse.py "C:\My Videos\aws_tutorial.mp4"```

#### Example 2: Using a Specific Profile and Output Folder
This uses the `clean_format` profile and saves files to a folder named `aws_exam_clean`.
```bash
python yse.py "aws_tutorial.mp4" --profile clean_format --output_folder "aws_exam_clean"
```

#### Example 3: Starting from a Specific Time
This starts processing 15 minutes into the video.
```bash
python yse.py "aws_tutorial.mp4" --start_time 00:15:00
```

#### Example 4: High-Sensitivity Run
This is useful for videos where slide changes are very subtle (e.g., only one line of text appears).
```bash
python yse.py "subtle_slides.mp4" --threshold 0.4
```

#### Example 5: Full Debug Mode for Tuning
This is the most important command for troubleshooting. It runs with very high sensitivity and saves everything, allowing you to inspect the output text and find the correct threshold and patterns.
```bash
python yse.py "my_video_to_debug.mp4" --threshold 0.1 --debug```
After running this, check the console logs and the `.txt` files in the output folder to see the `Diff %` for the slides you care about and to check why your patterns might be failing.