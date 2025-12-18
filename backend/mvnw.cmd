@echo off
REM Maven Wrapper for Windows

set MAVEN_VERSION=3.9.6
set MAVEN_HOME=%~dp0.mvn\wrapper

if not exist "%MAVEN_HOME%" mkdir "%MAVEN_HOME%"

REM Use system Maven if available
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

REM Try to use Java directly to run Maven
echo Maven not found in PATH. Attempting direct execution...
echo Please install Maven from: https://maven.apache.org/download.cgi
pause
exit /b 1
