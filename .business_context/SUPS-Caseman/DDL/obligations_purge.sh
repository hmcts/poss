#!/bin/bash
########################################
#
# FILENAME      : $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/DDL/obligations_purge.sh $:
#
# SYNOPSIS      : Shell script to run remove obligations marked for deletion, that are over a year old from CaseMan.
#
#
# $Author: westm $:       Author of last commit
#
# CLIENT        : Ministry of Justice
#
# COPYRIGHT     : (c) 2010 Logica plc.
#                 This file contains information which is confidential and of
#                 value to Logica. It may be used only for the specific purpose for
#                 which it has been provided. Logica's prior written consent is
#                 required before any part is reproduced.
#
# COMMENTS      : This script is to be invoked with the following command line parameters:
#                 $1 - This parameter to contain the Oracle SID
#
#                 $2 - This parameter to contain the Oracle schema login username
#
#                 $3 - This parameter to contain the Oracle schema login password
#
#
###########################################
#
# $Rev: 3409 $:          Revision of last commit
# $Date: 2009-07-22 13:51:38 +0100 (Wed, 22 Jul 2009) $:         Date of last commit
# $Id: obligations_purge.sh 3409 2009-07-22 12:51:38Z westm $            Revision at last change

#############################################
# Read functions in from common file
#############################################
APP_DIR_PATH=/filestore/app/caseman
. $APP_DIR_PATH/etc/cm-common-variables


#############################
# ScriptName variables
#############################
SCRIPT_NAME_FULL=$0
SCRIPT_NAME=${SCRIPT_NAME_FULL##*/}
SCRIPT_NAME_NOEXT=${SCRIPT_NAME%%\.sh}
REMOVE_OLDER_THAN=30


#############################
# Date Variables
#############################
START_DATE=`date`
DATE_LOG=`date +%Y%m%d_%H%M`
TODAY=${DATE_LOG}

#############################
# Log File Variables
#############################
LOG_FILE_NAME=${SCRIPT_NAME_NOEXT}_${DATE_LOG}.log



#############################
# Define all global functions
#############################

# Function to display message to the log file
function w1
{

    echo "${1}" >>${APP_DIR_PATH}/log/obligations_purge/${LOG_FILE_NAME}

}


function initialiseScript
{

    rm -f ${BASE_DIR}/${APP_NAME}/log/obligations_purge/${LOG_FILE_NAME}
    touch ${BASE_DIR}/${APP_NAME}/log/obligations_purge/${LOG_FILE_NAME}


}

#############################
# SCRIT STARTS HERE
#############################

initialiseScript

w1 " "
w1 "INFO: RUNNING SCRIPT $SCRIPT_NAME." >>$APP_DIR_PATH/log/obligations_purge/${LOG_FILE_NAME}
w1 " "
w1 "INFO: START: TIMESTAMP: $START_DATE" >>$APP_DIR_PATH/log/obligations_purge/${LOG_FILE_NAME}


###################################################################
# Execute the obligations_purge.sql script for the specified user and password
###################################################################
START_TIMESTAMP=$(/bin/date +%s)

${SQLPLUS} ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE}<<ENDSQL
WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE ROLLBACK
SET SERVEROUT ON TERMOUT ON VERIFY OFF NUMWIDTH 20 PAGES 500 LINES 125 ECHO ON
SPOOL $APP_DIR_PATH/log/obligations_purge/${LOG_FILE_NAME} APPEND
TRUNCATE TABLE obligations_purge_errors;
SET ECHO OFF
DECLARE


    n_found     NUMBER;
    n_passed    NUMBER;
    n_failed    NUMBER;

BEGIN

        -- call stored procedure
        obligations_purge       (pn_obligations_found   => n_found
                                ,pn_deleted_succ                => n_passed
                                ,pn_deleted_fail                => n_failed
                                );

        dbms_output.put(CHR(10));
        dbms_output.put_line('Records found         : ' || TO_CHAR(n_found));
        dbms_output.put_line('Records deleted       : ' || TO_CHAR(n_passed));
        dbms_output.put_line('Records failed        : ' || TO_CHAR(n_failed));
        dbms_output.put(CHR(10));


EXCEPTION

        WHEN OTHERS THEN
                RAISE;

END;
/
PROMPT Errors produced from obligations_purge.sh execution.
COL description FORMAT A50 WRAPPED
COL error_date FORMAT A10
SET ECHO ON
SELECT  obligation_seq
       ,description
       ,error_date
FROM    obligations_purge_errors;
SET ECHO OFF
exit;
SPOOL OFF
ENDSQL
SQLPLUS_RETURN_CODE=$?


#define the expected location of the obligations_purge.log files


########################################
# Log the end of script date/time entry
########################################
END_TIMESTAMP=$(/bin/date +%s)
RUNTIME=$((${END_TIMESTAMP} - ${START_TIMESTAMP}))
END_DATE=`date`

w1 " "
w1 "INFO: END: TIMESTAMP: ${END_DATE}" >>$APP_DIR_PATH/log/obligations_purge/${LOG_FILE_NAME}
w1 "INFO: RUNTIME = ${RUNTIME} seconds" >>$APP_DIR_PATH/log/obligations_purge/${LOG_FILE_NAME}
w1 " "


#########################################################################
# Now let's remove old log files greater than the specified days old, as
# determined by the $4 parameter. Log this to the output log file.
# Note: this applies to the sql script's .out file as well as the .log
# file generated by this bash script.
#########################################################################
w1 " "
w1 "Removing old .log files greater than: $REMOVE_OLDER_THAN day(s) old."
w1 " "

find $APP_DIR_PATH/log/obligations_purge/* -mtime $REMOVE_OLDER_THAN -exec rm -v {} \;


