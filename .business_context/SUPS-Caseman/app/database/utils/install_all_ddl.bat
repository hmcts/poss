@echo off

REM ------------------------------------------------------------------------
REM Windows script to run install_all_ddl.sql. 
REM
REM Usage: install_all_ddl.bat
REM
REM ------------------------------------------------------------------------



echo CREATING USERS RIDOUTP_CM DDL
echo CREATING USERS RIDOUTP_CM DDL >> install_all_ddl_setup.out
sqlplus system/elephant@XE @install_all_ddl_setup.sql ..\generated RIDOUTP_CM > install_all_ddl_setup.out



echo INSTALLING RIDOUTP_CM DDL
echo INSTALLING RIDOUTP_CM DDL >> install_all_ddl.out
sqlplus system/elephant@XE @install_all_ddl.sql ..\generated RIDOUTP_CM > install_all_ddl.out



echo INSTALLING RIDOUTP_CM GRANTS
echo INSTALLING RIDOUTP_CM GRANTS > install_all_grants.out
sqlplus system/elephant@XE @install_all_grants.sql ..\generated RIDOUTP_CM > install_all_grants.out



echo ALL GRANTS COMPLETED >> install_all_grants.out
