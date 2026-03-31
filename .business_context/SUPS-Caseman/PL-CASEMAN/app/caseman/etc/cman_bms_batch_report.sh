#!/bin/bash
##############################################
#
# $HeadURL: 
#
# SYNOPSIS      :  Master File For Producing Batch
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
APP_DIR_PATH=/filestore/app/caseman
. $APP_DIR_PATH/etc/cm-common-variables

APP_SHORTNAME=CMAN
STARTDATE=`date +%D%t%H:%M:%S`
START=$(date +%s)
echo ${APP_SHORTNAME}" Batch Started At: "$STARTDATE
## Make output dir or delete its contents
OUTDIR=$APP_DIR_PATH/reports/output
if [ -d $OUTDIR ]; then
        rm -fr $OUTDIR/*.csv
        rm -fr $OUTDIR/*.txt
else
        mkdir -p $OUTDIR
fi

##############################################
# START / END DATE RETRIEVAL
##############################################
START_DATE=`${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/SELECT_START_DATE.sql`
END_DATE=`${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/SELECT_END_DATE.sql`

##############################################
# CLEAR DOWN BMS_BATCH_RECONCILIATION
##############################################

${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/TRUNCATE_BMS_BATCH_RECONCILIATION.sql
SQL_RESP=$?

while [ $SQL_RESP -gt 0 ] 
do
	if [  $SQL_RESP -gt 0  ]
		then
			echo "Attempting to create BMS_BATCH_RECONCILIATION TABLE"
			${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/CREATE_BMS_BATCH_RECONCILIATION.sql
			${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/TRUNCATE_BMS_BATCH_RECONCILIATION.sql			
			SQL_RESP=$?
			break
	fi
done

if [ $SQL_RESP -gt 0 ]
	then
		echo "Failed truncating BMS_BATCH_RECONCILIATION "
		exit 1
   	
fi

##############################################
# RETRIEVE ALL LIVE COURTS
##############################################
LIVE_COURTS=`${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/SELECT_CMAN_LIVE_COURTS.sql`
SQL_RESP=$?
if [ $SQL_RESP -gt 0 ]
	then
		echo "Failed Selecting Live Courts"
		exit 1
fi

##############################################
# GENERATE FILENAME
# UPDATE RECONCILIATION TABLE PRIOR TO REPORT GENERATION
# CREATE REPORT 
# UPDATE RECONCILIATION TABLE AFTER REPORT GENERATION
##############################################
REPORT_TYPE=BMS
FILE_TYPE=".csv"
DELIMITTER="_"

for i in ${LIVE_COURTS};
do	 
	TIMESTAMP=`${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/SELECT_FILE_DATE_TIMESTAMP.sql`
	SQL_RESP=$?
	if [ $SQL_RESP -gt 0 ]
		then
			echo "Failed Selecting Timestamp for BMS Report"
			exit 1
	fi
	FILE_NAME=$REPORT_TYPE$DELIMITTER$APP_SHORTNAME$DELIMITTER${i}$DELIMITTER$TIMESTAMP$FILE_TYPE
 
	${SQLPLUS} -s << EOF
${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3}
@${APP_SQL_DIR}/INSERT_BMS_BATCH_RECONCILIATION.sql ${i} ${FILE_NAME} 0
EXIT
EOF
	SQL_RESP=$?
	if [ $SQL_RESP -gt 0 ]
		then
			echo "Failed Inserting record into BMS_BATCH_RECONCILIATION with arguments " ${i} ${FILE_NAME} 0
			exit 1
	fi
		${SQLPLUS} -s << EOF
${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3}
@${APP_SQL_DIR}/BMS_REPORT_CMAN.sql ${START_DATE} ${END_DATE} ${i} ${OUTDIR}/${FILE_NAME}
EXIT
EOF
	SQL_RESP=$?
	if [ $SQL_RESP -gt 0 ]
	then
		echo "Failed Generating BMS_REPORT with arguments " ${START_DATE} ${END_DATE} ${i} ${OUTDIR}/${FILE_NAME}
		${SQLPLUS} -s << EOF
${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3}
@${APP_SQL_DIR}/UPDATE_BMS_BATCH_RECONCILIATION.sql ${FILE_NAME} 1
EXIT
EOF
		SQL_RESP=$?
		if [ $SQL_RESP -gt 0 ]
			then
				echo "Failed To Update BMS_BATCH_RECONCILIATION with arguments " ${FILE_NAME} 1			 	
		fi
	else
		${SQLPLUS} -s << EOF
${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3}
@${APP_SQL_DIR}/UPDATE_BMS_BATCH_RECONCILIATION.sql ${FILE_NAME} 2
EXIT
EOF
		SQL_RESP=$?
		if [ $SQL_RESP -gt 0 ]
			then
				echo "Failed To Update BMS_BATCH_RECONCILIATION with argumnets "${FILE_NAME} 2	
		fi	
	fi		
	
done	
##############################################
# GENERATE RECONCILIATION
##############################################
TIMESTAMP=`${SQLPLUS} -s ${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3} < ${APP_SQL_DIR}/SELECT_FILE_DATE_TIMESTAMP.sql`
SQL_RESP=$?
if [ $SQL_RESP -gt 0 ]
	then
		echo "Failed Selecting Timestamp for Reconciliation File"
		exit 1
fi
REPORT_TYPE=BMSRECONCILIATION 
FILE_TYPE=".txt"
FILE_NAME=$REPORT_TYPE$DELIMITTER$APP_SHORTNAME$DELIMITTER$TIMESTAMP$FILE_TYPE
${SQLPLUS} -s << EOF
${DB_USER}/${DB_IDENTIFIER}@${DB_INSTANCE_3}
@${APP_SQL_DIR}/BMS_BATCH_RECONCILIATION_REPORT.sql ${OUTDIR}/${FILE_NAME}
EXIT
EOF
SQL_RESP=$?
if [ $SQL_RESP -gt 0 ]
	then
		echo "Failed Generating Reconciliation File with arguments "${OUTDIR}/${FILE_NAME}
		exit 1
fi
ENDDATE=`date +%D%t%H:%M:%S`
echo $APP_SHORTNAME" Batch Ended At: "$ENDDATE
END=$(date +%s)
TOTALTIME=$(( $END - $START ))
echo $APP_SHORTNAME" Batch Ran For: "$TOTALTIME" seconds"
