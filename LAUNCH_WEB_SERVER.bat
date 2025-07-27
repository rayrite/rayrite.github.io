@echo off
echo Starting Python web server on port 8000...
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause