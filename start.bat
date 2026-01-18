@echo off
REM RiskGuard Complete Startup Script

echo.
echo ========================================
echo RiskGuard - Full Stack Application
echo ========================================
echo.

set MAVEN_HOME=C:\Users\%USERNAME%\.maven\maven-3.9.12

echo Checking prerequisites...
echo.

REM Check Maven
if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo WARNING: Maven not found at default location
    echo Installing Maven...
    REM Maven will be installed via the tool
)

echo.
echo Choose what to start:
echo 1. Backend only (Spring Boot)
echo 2. Frontend only (React)
echo 3. Both Backend and Frontend
echo.

set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    call :start_backend
) else if "%choice%"=="2" (
    call :start_frontend
) else if "%choice%"=="3" (
    call :start_both
) else (
    echo Invalid choice
    pause
    exit /b 1
)

goto :eof

:start_backend
echo.
echo Starting Backend...
cd /d backend
"%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run
goto :eof

:start_frontend
echo.
echo Starting Frontend...
cd /d frontend
call npm install
call npm start
goto :eof

:start_both
echo.
echo Starting both services in separate windows...
start cmd /k "cd backend && %MAVEN_HOME%\bin\mvn.cmd spring-boot:run"
timeout /t 2
start cmd /k "cd frontend && npm install && npm start"
goto :eof
