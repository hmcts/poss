@echo off

REM ------------------------------------------------------------------------
REM Windows script to extract all ORACLE ddl in a given schema. 
REM
REM Usage: extract_schema_ddl.bat
REM
REM ------------------------------------------------------------------------

REM ------------------------------------------------------------------------
REM Create directory for scripts and then create separate script of each 
REM object type in a given schema, and then for each constraint type.
REM ------------------------------------------------------------------------


echo EXTRACTING DDL FOR SCHEMA RIDOUTP_CM
rmdir /s /q ..\generated
mkdir ..\generated\RIDOUTP_CM
sqlplus system/logicacmg@supsdb01 @extract_objects_ddl.sql RIDOUTP_CM
sqlplus system/logicacmg@supsdb01 @extract_constraints_ddl.sql RIDOUTP_CM
sqlplus system/logicacmg@supsdb01 @extract_grants_ddl.sql RIDOUTP_CM


echo.
echo.
echo.
echo.
echo OUTPUT WRITTEN TO .\generated
