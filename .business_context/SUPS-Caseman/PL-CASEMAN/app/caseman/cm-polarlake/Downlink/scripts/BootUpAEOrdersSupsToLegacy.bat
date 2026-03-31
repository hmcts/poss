@echo off


if "%JAVA_HOME%" == "" goto perror
if "%POLARLAKE_HOME%" == "" goto perror
if "%CASEMAN_POLARLAKE_HOME%" == "" goto perror

goto set

:set
set path=%JAVA_HOME%\bin;%PATH%

set CLASSPATH=%POLARLAKE_HOME%\polarlake\lib\pmc.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\ConsoleServer.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\monitor.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\commonmonitor.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\xmlParserAPIs.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\xercesImpl.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\plsystem.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\polarlake.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\pl.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\JGo.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\log4j.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\castor.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\commons-logging.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\plsysobjects.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\jdom.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\jaxen.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\jug.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\jhall.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\design.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\mail.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\httpclient.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\trove.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\JGoLayout.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\saxon8-jdom.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\saxon8.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\polarlake\lib\CircuitRepository.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\SystemInformation\lib\RemoteConsoleClient.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\xpatheditor\lib\xpatheditor.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\InstanceManager\lib\ImObjects.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\help\pmchelp\PmcHelp.jar
set CLASSPATH=%CLASSPATH%;%POLARLAKE_HOME%\help\designerhelp\DesignerHelp.jar

echo.
echo.
echo Starting PMC...
echo.

REM   Specify -DredirectOut="N" to prevent the redirecting of System.out and System.err to a panel in the PMC.

%JAVA_HOME%\bin\java -Xmx128000000 -Dpolarlake_dns=%POLARLAKE_DNS% -Dpl_properties_url=%CASEMAN_POLARLAKE_HOME%/Caseman/PolarLake/Common/config/caseman.props -Dpolarlake_home=%POLARLAKE_HOME% -Djava_home=%JAVA_HOME% -Dshell_circuit_id=%USERNAME% com.polarlake.platform.Platform  -b file:///%CASEMAN_POLARLAKE_HOME%/Caseman/PolarLake/Common/server/CaseManSupsToLegacyAEOrderBootCircuit.cir -j file:///%POLARLAKE_HOME%/polarlake/lib/plsystem.jar

pause
goto end

:perror
echo JAVA_HOME, POLARLAKE_HOME, CASEMAN_POLARLAKE_HOME must be set in the environment.

:end
