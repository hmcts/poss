#!/bin/bash
#####################################################################################
# Module Name: Extract AE Orders from SUPS Caseman                                  #
# Module ID:   sups_ae_order_extract_for_caps                                       #
# File Name:   sups_ae_order_extract_for_caps.sh                                    #
# Author:      Chris Hutt                                                           #
# Version:     1.1                                                                  #
# Date:        21-JUN-07                                                            #
#                                                                                   #
# Purpose                                                                           #
# -------                                                                           #
# To extract AE Orders from SUPS Caseman and insert the info into CMCS_CAPS_ORDERS  #
# which is an interim table used by a second stage process which will extract from  #
# CMCS_CAPS_ORDERS and update the CAPS database                                     #
#                                                                                   #
# Change Control                                                                    #
# --------------                                                                    #
# Version   Date        Author        Description                        RFC/IR     #
# -------   ----        ------        -----------                        ------     #
#   1.0     14-JUN-07   Chris Hutt                                                  #
#   1.1     21-JUN-07   Chris Hutt    Changes as recommended by Paul Ridout as part #
#                                     peer review / testing                         #
#   1.2     02-OCT-07   Paul Scanlon  Defect Group2 5380                            #
#                                     Pass extra parameter (p_cleardown) to         #
#                                     p_transfer_ae_orders_out to request           #
#                                     housekeeping tasks to be performed on         #
#                                     cmcs_transfer_control and cmcs_caps_orders.   #
#                                     Also set debug flag to N for this proc. call. #
#####################################################################################

#####################################################################################
# Set the script to catch any unset variables.
#####################################################################################
shopt -o nounset

#####################################################################################
# Redirect all standard and error output to a Log file. 
#####################################################################################
APP_SCRIPT_LOGFILE_TMP=${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps.tmp
exec 1>>${APP_SCRIPT_LOGFILE_TMP}
exec 2>&1

declare -x SCRIPT_NAME=${0##*/};
declare -x AUDIT_TYPE=batch;

#####################################################################################
# Announce the start of module in the Log file.
#####################################################################################
AUDIT_MESSAGE="EVENT_STATUS=Start| DETAILS= Extract AE Orders from SUPS Caseman as part of extract to CAPS" ;
AuditTimestamp;
echo " ";

#####################################################################################
# Log on to SQL*Plus and run the job                                                #
#####################################################################################
${SQLPLUS} -s $ORA >${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps_sql.tmp <<endsql
set serveroutput on size 100000
exec sups_ae_order_transfer_pack.p_transfer_ae_orders_out('${USER_ID}','N','Y');
exit
endsql

#####################################################################################
# Check to make sure that temporary report exists.
# If it does then append contents to the regular log file and then delete the temp file
#####################################################################################
if [ -f ${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps_sql.tmp ]; then
      cat ${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps_sql.tmp 
      rm -f ${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps_sql.tmp 
else
      AUDIT_MESSAGE="EVENT_STATUS=Failure| DETAILS= ${APP_SCRIPT_TMP_DIR}/sups_ae_order_extract_for_caps.tmp - not found";
      AuditTimestamp;
      echo " ";
      cat ${APP_SCRIPT_LOGFILE_TMP} >> ${APP_SCRIPT_LOGFILE}
      rm -f ${APP_SCRIPT_LOGFILE_TMP}
      exit 1
fi

#####################################################################################
# Mark the job as finished
#####################################################################################
AUDIT_MESSAGE="EVENT_STATUS=Success| DETAILS= Extract AE Orders from SUPS Caseman as part of extract to CAPS";
AuditTimestamp;
echo " ";
cat ${APP_SCRIPT_LOGFILE_TMP} >> ${APP_SCRIPT_LOGFILE}
rm -f ${APP_SCRIPT_LOGFILE_TMP}
exit 0
