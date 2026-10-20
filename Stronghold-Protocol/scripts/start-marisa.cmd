@echo off
setlocal
cd /d "%~dp0.."
node scripts/launch.mjs --no-setup --port 3000 --scripts sandbox %*
set "SP_LAUNCH_RESULT=%errorlevel%"
if not "%SP_LAUNCH_RESULT%"=="0" pause
exit /b %SP_LAUNCH_RESULT%
