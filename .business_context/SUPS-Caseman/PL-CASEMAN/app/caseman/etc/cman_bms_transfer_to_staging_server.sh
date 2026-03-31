#!/bin/bash
##############################################
#
# $HeadURL: 
#
# SYNOPSIS      :  Transfer and archive
#
# $Author: :       Author of last commit
#
# CLIENT        : Ministry of Justice
#
# COPYRIGHT     : (c) 2011 Logica UK Limited.
#                 This file contains information which is confidential and of
#                 value to Logica. It may be used only for the specific purpose for
#                 which it has been provided. Logica's prior written consent is
#                 required before any part is reproduced.
#
# COMMENTS      :
#
#---------------------------------------------------------------------------------
#
# $Rev:            Revision of last commit
# $Date:           Date of last commit
# $Id:
#
##############################################
# read in the common variables
APP_DIR_PATH=/filestore/app/caseman
. $APP_DIR_PATH/etc/cm-common-variables

OUTPUT_DIR=${BASE_DIR}/${APP_NAME}/reports/output
ARCHIVE_DIR=$OUTPUT_DIR/archive

# check if files exist i.e. more than one of .txt and .csv for sending
declare -ix TXT_CHK=`ls $OUTPUT_DIR/*.txt 2>/dev/null | wc -c`
declare -ix CSV_CHK=`ls $OUTPUT_DIR/*.csv 2>/dev/null | wc -c`
declare -ix LOG_DAYS=30

#check if text and csv files are created, then archive after sending/delete old ones
if [[ ${TXT_CHK} && ${CSV_CHK} -gt 1 ]]
then
sftp $SFTP_USER@$SFTP_HOST<<endftp
put $OUTPUT_DIR/*.csv
put $OUTPUT_DIR/*.txt
bye
endftp
        mkdir -p $ARCHIVE_DIR
        mv ${OUTPUT_DIR}/*.txt $ARCHIVE_DIR
        mv ${OUTPUT_DIR}/*.csv $ARCHIVE_DIR
        find $ARCHIVE_DIR/*.csv -ctime +$LOG_DAYS -exec rm -v {} \; 2>/dev/null
        find $ARCHIVE_DIR/*.txt -ctime +$LOG_DAYS -exec rm -v {} \; 2>/dev/null
else
        #just clear out the archive directory anyway
        find $ARCHIVE_DIR/*.csv -ctime +$LOG_DAYS -exec rm -v {} \; 2>/dev/null
        find $ARCHIVE_DIR/*.txt -ctime +$LOG_DAYS -exec rm -v {} \; 2>/dev/null
        exit 0
fi

exit 0
