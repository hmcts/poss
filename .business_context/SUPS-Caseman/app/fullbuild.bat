
@echo off
cls
echo FULL CASEMAN BUILD
echo ------------------
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

xcopy client %EXTRACT_DIR%\client\ /R /E /F /H /Q 
xcopy common %EXTRACT_DIR%\common\ /R /E /F /H /Q
xcopy server %EXTRACT_DIR%\server\ /R /E /F /H /Q


echo.
rem cd %EXTRACT_DIR%/client

REM ===================== CLIENT =======================================================
REM make all files writable
attrib -r %EXTRACT_DIR%\* /s

SET TARGET_DIR=%EXTRACT_DIR%\client\caseman\screens\caseman_about
SET TARGET_FILE=%TARGET_DIR%\AboutCaseman.xml


echo ^<?xml version="1.0" encoding="UTF-8"?^> > %TARGET_FILE%
echo ^<Caseman^> >> %TARGET_FILE%
echo ^<Build^> >> %TARGET_FILE%
echo ^<Version^>%BLD%^</Version^> >> %TARGET_FILE%
echo ^<Date^>%date%^</Date^> >> %TARGET_FILE%
echo ^</Build^> >> %TARGET_FILE%
echo ^<Framework^> >> %TARGET_FILE%
echo ^<Version^>%FWK%^</Version^> >> %TARGET_FILE%
echo ^</Framework^> >> %TARGET_FILE%
echo ^<Database^> >> %TARGET_FILE%
echo ^<connection-url^>jdbc:oracle:thin:@168.185.39.16:1521:casemft^</connection-url^> >> %TARGET_FILE%
echo ^<user-name^>caseman2^</user-name^> >> %TARGET_FILE%
echo ^</Database^> >>%TARGET_FILE%
echo ^</Caseman^> >> %TARGET_FILE%

set TARGET=N

rem SET /P TARGET=Enter Target FT, UCT,  N (Neither) or Q(Quit)

rem IF %TARGET%==q goto end
rem IF %TARGET%==Q goto end

rem if %TARGET%==FT COPY client\target_specifics\WEB-INF\FT\web.xml %EXTRACT_DIR%\client\caseman\WEB-INF\web.xml
rem if %TARGET%==UCT COPY client\target_specifics\WEB-INF\UCT\web.xml %EXTRACT_DIR%\client\caseman\WEB-INF\web.xml

chdir /D %EXTRACT_DIR%\client

call ant -f caseman_client_build.xml

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