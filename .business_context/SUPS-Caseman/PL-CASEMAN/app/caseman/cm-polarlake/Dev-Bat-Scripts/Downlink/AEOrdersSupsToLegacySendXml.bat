@echo off
REM Usage: SendXml <XARP Address> <File To Send> [mail server]
REM
REM You must specify a mail server if using SMTP
REM Including the debug flag will turn on debugging in the polarlake transport layers

if "%JAVA_HOME%" == "" goto perror
if "%POLARLAKE_HOME%" == "" goto perror
if "%CASEMAN_POLARLAKE_HOME%" == "" goto perror

set path=%JAVA_HOME%\bin;%PATH%

set cp=%POLARLAKE_HOME%\polarlake\lib\CircuitRepository.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\pl.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\polarlake.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\plsystem.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\xmlParserAPIs.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\xercesImpl.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\jdom.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\mail.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\activation.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\log4j-full.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\log4j.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\trove.jar
set cp=%cp%;%POLARLAKE_HOME%\polarlake\lib\httpclient.jar

%JAVA_HOME%\bin\java.exe -classpath "%cp%" -Dpl_properties_url=%CASEMAN_POLARLAKE_HOME%/Caseman/PolarLake/Common/config/caseman.props -Dpolarlake_home=%POLARLAKE_HOME% com.polarlake.platform.commandline.SendXml -b "file:///%POLARLAKE_HOME%/polarlake/config/empty-boot.cir" -j "file:///%POLARLAKE_HOME%/polarlake/lib/plsystem.jar" xmlt://localhost:11009 %CASEMAN_POLARLAKE_HOME%/Caseman/PolarLake/Common/config/sups_config.xml %3 %4
goto end

:perror
echo JAVA_HOME and POLARLAKE_HOME and CASEMAN_POLARLAKE_HOME must be set in the environment.

:end

:eof
pause