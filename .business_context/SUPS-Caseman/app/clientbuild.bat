
@echo off
cls
echo CLIENT CASEMAN BUILD
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
echo.
echo ===================
echo Copying from Client
cd
echo to
echo %EXTRACT_DIR%\client\
xcopy client %EXTRACT_DIR%\client\ /R /E /F /H /Q 
echo ===================
echo.
echo.
echo ===================
echo Copying from common...
cd
echo to
echo %EXTRACT_DIR%\common\
xcopy common %EXTRACT_DIR%\common\ /R /E /F /H /Q 
echo ===================
echo.
echo.
echo ===================
echo Copying from server
cd
echo to
echo %EXTRACT_DIR%\server\
xcopy server\src\uk\gov\dca\caseman\wordprocessing_templates\*.xml %EXTRACT_DIR%\server\src\uk\gov\dca\caseman\wordprocessing_templates\ /R /E /F /H /Q 
xcopy server\*.properties %EXTRACT_DIR%\server\ /R /E /F /H /Q 
echo ===================
echo.
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
echo.
chdir /D %EXTRACT_DIR%\client
echo.
echo.
call ant -f caseman_client_build.xml

:end

pause