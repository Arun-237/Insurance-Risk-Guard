@echo off
REM RiskGuard Backend Startup Script for Windows

echo.
echo ========================================
echo RiskGuard Backend Startup
echo ========================================
echo.

REM Check if Maven is available
if exist "C:\Users\%USERNAME%\.maven\maven-3.9.12\bin\mvn.cmd" (
    echo Maven found at C:\Users\%USERNAME%\.maven\maven-3.9.12\bin\mvn.cmd
    set MAVEN_HOME=C:\Users\%USERNAME%\.maven\maven-3.9.12
) else (
    echo ERROR: Maven not found!
    echo Please install Maven first using the install_maven tool.
    pause
    exit /b 1
)

REM Change to backend directory
cd /d %~dp0
echo Current directory: %cd%

REM Check if pom.xml exists
if not exist "pom.xml" (
    echo ERROR: pom.xml not found in %cd%
    pause
    exit /b 1
)

echo.
echo Starting Maven build and Spring Boot...
echo.

REM Run Maven Spring Boot
"%MAVEN_HOME%\bin\mvn.cmd" spring-boot:run

if errorlevel 1 (
    echo.
    echo ERROR: Application failed to start
    pause
    exit /b 1
)

pause
