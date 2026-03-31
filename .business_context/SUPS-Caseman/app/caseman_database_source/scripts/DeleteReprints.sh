@echo off

set LOG_EXT=%random%%random%

set DATABASE_CONNECT_STRING=devr6/devr6@casemdev
rem set DATABASE_CONNECT_STRING=casmdev_devr6/casmdev_devr6@supsdb01

echo Deleting reports older than 7 days on %DATABASE_CONNECT_STRING%...

echo Log file will be saved with name : DeleteReprints.log.%LOG_EXT%
echo --------------------------------------------------------------------

sqlplus %DATABASE_CONNECT_STRING% @DeleteReprints.sql > DeleteReprints.log.%LOG_EXT%

echo Reports Deleted Successfully