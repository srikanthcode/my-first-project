@echo off
echo ==========================================
echo   Starting WhatsApp Clone Backend
echo ==========================================

cd backend

WHERE mvn >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Maven (mvn) is not installed or not in your PATH.
    echo Please install Maven from https://maven.apache.org/download.cgi
    echo and ensure it is added to your system PATH.
    echo.
    echo Alternatively, if you have an IDE like IntelliJ or Eclipse,
    echo simple open the 'backend' folder and run the Application.
    pause
    exit /b
)

echo [INFO] Building Backend...
call mvn clean install -DskipTests

IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build Failed!
    pause
    exit /b
)

echo [INFO] Starting Spring Boot Application...
call mvn spring-boot:run
pause
