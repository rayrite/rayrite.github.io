@echo off
rem ====================================================================
rem  combine_md.bat - rebuild _COMBINED.md from the *.md files in a
rem  folder, via combine_md.py (expected next to this .bat).
rem
rem  Launch:
rem    - Desktop shortcut / double-click this .bat with no arguments:
rem      combines the folder THIS .bat lives in.
rem    - Shortcut with a preset Target folder: set the shortcut's
rem      Target to this .bat and Arguments to the folder path.
rem    - Drag any folder onto this .bat (or a shortcut to it):
rem      combines the dropped folder instead.
rem ====================================================================
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 (
    py -3 "%~dp0combine_md.py" %*
) else (
    python "%~dp0combine_md.py" %*
)

echo.
pause
