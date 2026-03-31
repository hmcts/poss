#!/bin/bash
#####################################################################################
# Module Name: Transfer CAPS events into SUPS Caseman                               #
# Module ID:   sups_transfer_caps_events_to_caseman                                 #
# File Name:   sups_transfer_caps_events_to_caseman.sh                              #
# Author:      Chris Hutt                                                           #
# Version:     1.1                                                                  #
# Date:        21-JUN-07                                                            #
#                                                                                   #
# Purpose                                                                           #
# -------                                                                           #
# To Transfer CAPS events into SUPS Caseman via the CMCS_AE_EVENTS staging table    #
#                                                                                   #
# Change Control                                                                    #
# --------------                                                                    #
# Version   Date        Author        Description                        RFC/IR     #
# -------   ----        ------        -----------                        ------     #
#   1.0     14-JUN-07   Chris Hutt                                                  #
#   1.1     21-JUN-07   Chris Hutt    Changes as recommended by Paul Ridout as part #
#                                     peer review / testing                         #
#                                                                                   #
#####################################################################################

#####################################################################################
# Set the script to catch any unset variables.
#####################################################################################
shopt -o nounset

#####################################################################################
# Redirect all standard and error output to a Log file. 
#####################################################################################
APP_SCRIPT_LOGFILE_TMP=${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman.tmp
exec 1>>${APP_SCRIPT_LOGFILE_TMP}
exec 2>&1

declare -x SCRIPT_NAME=${0##*/};
declare -x AUDIT_TYPE=batch;

#####################################################################################
# Announce the start of module in the Log file.
#####################################################################################
AUDIT_MESSAGE="EVENT_STATUS=Start| DETAILS= Transfer CAPS events into SUPS Caseman" ;
AuditTimestamp;
echo " ";

#####################################################################################
# Log on to SQL*Plus and run the job                                                #
#####################################################################################
${SQLPLUS} -s $ORA >${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman_sql.tmp <<endsql
set serveroutput on size 100000
exec sups_caps_events_transfer_pack.p_trans_caps_events_to_caseman('${USER_ID}','Y');
exit
endsql

#####################################################################################
# Check to make sure that temporary report exists.
# If it does then append contents to the regular log file and then delete the temp file
#####################################################################################
if [ -f ${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman_sql.tmp ]; then
      cat ${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman_sql.tmp 
      rm -f ${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman_sql.tmp 
else
      AUDIT_MESSAGE="EVENT_STATUS=Failure| DETAILS= ${APP_SCRIPT_TMP_DIR}/sups_transfer_caps_events_to_caseman_sql.tmp - not found";
      AuditTimestamp;
      echo " ";
      cat ${APP_SCRIPT_LOGFILE_TMP} >> ${APP_SCRIPT_LOGFILE}
      rm -f ${APP_SCRIPT_LOGFILE_TMP}
      exit 1
fi

#####################################################################################
# Mark the job as finished
#####################################################################################
AUDIT_MESSAGE="EVENT_STATUS=Success| DETAILS= Transfer CAPS events into SUPS Caseman";
AuditTimestamp;
echo " ";
cat ${APP_SCRIPT_LOGFILE_TMP} >> ${APP_SCRIPT_LOGFILE}
rm -f ${APP_SCRIPT_LOGFILE_TMP}
exit 0
