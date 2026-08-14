@echo off
TITLE Antigravity Official Typing Assessment Portal Launcher
COLOR 0A

echo =======================================================================
echo          ANTIGRAVITY OFFICIAL TYPING ASSESSMENT PORTAL
echo =======================================================================
echo.

cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo  [1/2] Node.js environment detected. Starting Server...
    start /min "" node server.js
    timeout /t 2 /nobreak >nul
) else (
    echo  [1/2] Node.js not installed. Starting Built-in Windows Server...
    start /min "" powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
    timeout /t 2 /nobreak >nul
)

:: Launch Portal in App Mode or Direct File Backup
echo  [2/2] Launching Examination Room...
start "" "msedge.exe" --app="http://127.0.0.1:3000" 2>nul || start "" "chrome.exe" --app="http://127.0.0.1:3000" 2>nul || start "" "%~dp0index.html"

echo.
echo  Portal successfully launched! You can close this window.
timeout /t 3 /nobreak >nul
exit
