@echo off
setlocal enabledelayedexpansion

REM E-Commerce Backend Application Runner
REM Professional batch script with error handling

echo ========================================
echo    E-Commerce Backend Server
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Display Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Node.js version: %NODE_VERSION%

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found
    echo Please run this script from the Backend directory
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [WARN] node_modules not found. Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [INFO] Dependencies installed successfully
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARN] .env file not found
    echo [INFO] Using default environment variables
)

REM Set environment for production if not specified
if "%NODE_ENV%"=="" set NODE_ENV=production

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

echo [INFO] Environment: %NODE_ENV%
echo [INFO] Starting server...
echo.

REM Start the application with error handling
node server.js
set EXIT_CODE=%errorlevel%

echo.
if %EXIT_CODE% equ 0 (
    echo [INFO] Server stopped gracefully
    timeout /t 2 >nul
) else (
    echo [ERROR] Server stopped with error code: %EXIT_CODE%
    echo Press any key to exit...
    pause >nul
)

exit /b %EXIT_CODE%