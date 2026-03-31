
@echo off
cls
echo SERVER CASEMAN BUILD
echo --------------------
echo.

set BLD=test

SET /P BLD=Enter BuildNumber or Q(Quit)

IF %BLD%==q goto end
IF %BLD%==Q goto end

SET /P FWK=Enter Framework Version or Q(Quit)

IF %FWK%==q goto end
IF %FWK%==Q goto end


REM ==================================================================================
set EXTRACT_DIR=c:\sups\BUILD_%BLD%

IF EXIST %EXTRACT_DIR% rmdir /S %EXTRACT_DIR%

mkdir %EXTRACT_DIR%

xcopy common %EXTRACT_DIR%\common\ /R /E /F /H /Q
xcopy server %EXTRACT_DIR%\server\ /R /E /F /H /Q


REM ==================== SERVER ===================================================================

chdir /D %EXTRACT_DIR%\server

rem goto wrap_up

call ant -f caseman_server_build.xml

REM =================== WRAP EVERYTHING UP INTO A ZIP

:wrap_up

SET JBOSS_DEPLOY_DIR=%SUPS_EXTRACTED%\jboss-4.0.1\server\default\deploy

MKDIR %EXTRACT_DIR%\dist
COPY %JBOSS_DEPLOY_DIR%\caseman.war %EXTRACT_DIR%\dist
COPY %JBOSS_DEPLOY_DIR%\caseman.ear %EXTRACT_DIR%\dist
COPY %JBOSS_DEPLOY_DIR%\wpprint.war %EXTRACT_DIR%\dist

chdir /D %EXTRACT_DIR%\dist

zip %TARGET%_Caseman_%BLD%.zip *
:end

pause