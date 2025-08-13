@echo off
setlocal enabledelayedexpansion

REM E-Commerce Backend Development Runner
REM Optimized for development with auto-restart

echo ========================================
echo    E-Commerce Backend (Development)
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not installed
    pause
    exit /b 1
)

REM Check dependencies
if not exist "node_modules" (
    echo [INFO] Installing dependencies...
    npm install
)

REM Set development environment
set NODE_ENV=development

REM Check and kill process using port 3000
echo [INFO] Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    set PID=%%a
    if defined PID (
        echo [WARN] Port 3000 is in use by PID: !PID!
        echo [INFO] Terminating process !PID!...
        taskkill /PID !PID! /F >nul 2>&1
        if errorlevel 1 (
            echo [WARN] Could not terminate process !PID!
        ) else (
            echo [INFO] Process !PID! terminated successfully
        )
        timeout /t 2 >nul
    )
)

echo [INFO] Starting development server with auto-restart...
echo [INFO] Press Ctrl+C to stop
echo.

REM Start with nodemon for development
npm run dev
set EXIT_CODE=%errorlevel%

echo.
if %EXIT_CODE% equ 0 (
    echo [INFO] Development server stopped gracefully
    timeout /t 2 >nul
) else (
    echo [ERROR] Development server stopped with error code: %EXIT_CODE%
    echo Press any key to exit...
    pause >nul
)

exit /b %EXIT_CODE%