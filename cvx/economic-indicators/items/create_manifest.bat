@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "SCRIPT_PATH=%SCRIPT_DIR%create_manifest.py"
set "VENV_PY=%SCRIPT_DIR%..\..\.venv\Scripts\python.exe"

if exist "%VENV_PY%" (
    "%VENV_PY%" "%SCRIPT_PATH%" %*
    exit /b %errorlevel%
)

where py >nul 2>nul
if %errorlevel%==0 (
    py -3 "%SCRIPT_PATH%" %*
    exit /b %errorlevel%
)

where python >nul 2>nul
if %errorlevel%==0 (
    python "%SCRIPT_PATH%" %*
    exit /b %errorlevel%
)

echo Error: Python was not found. Activate your virtual environment or install Python.
exit /b 1
