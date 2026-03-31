
@echo off
cls
echo CASEMAN CLIENT BUILD
echo.

SET /P BLD=Enter BuildNumber or Q(Quit)

IF %BLD%==q goto end
IF %BLD%==Q goto end

SET /P FWK=Enter Framework Version or Q(Quit)

IF %FWK%==q goto end
IF %FWK%==Q goto end

SET TARGET_DIR=caseman\screens\caseman_about
SET TARGET_FILE=%TARGET_DIR%/AboutCaseman.xml


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

ant -f app-build.xml

:end