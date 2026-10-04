@echo off
title Refresh rayrite.github.io front door
cd /d %~dp0
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 refresh_site.py --verbose
) else (
  python refresh_site.py --verbose
)
echo.
pause
