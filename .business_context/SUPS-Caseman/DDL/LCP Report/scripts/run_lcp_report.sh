#--------------------------------------------------------------------------------
#
# $HeadURL$:
#
# SYNOPSIS      : Controlling Script that is used to extract the LCP report for
#                 the required courts,
#
#
# $Author: fanej $Jon Fane
#
# CLIENT        : Ministry of Justice
#
# COPYRIGHT     : (c) 2010 Logica UK Limited.
#                 This file contains information which is confidential and of
#                 value to Logica. It may be used only for the specific purpose for
#                 which it has been provided. Logica's prior written consent is
#                 required before any part is reproduced.
#
# COMMENTS      : This script does not accept any input parameters, it uses a 
#                 configuration file stored under:
#                 LCP report base directory/configFiles to determine the courts 
#                 that the report should be run for.
#
#---------------------------------------------------------------------------------
#
# $Rev: 7135 $
# $Date:  $
# $Id:  $
#
#--------------------------------------------------------------------------------

###################################################
# Configurable Parameters
#
# *** The V_DB_PASSWORD requires updating
# *** to match the password for the CC_USER
# *** in the supsb database
#
# *** Set the Oracle sid to the SUPSB instance
##############################################

# Database connection information for the court 
# closure schemas
V_DB_USERNAME=cc_user
V_DB_PASSWORD=password
ORACLE_SID=supsb

##############################################
# Base UNIX commands
##############################################

export ECHO=/bin/echo
export MKDIR=/bin/mkdir
export MV=/bin/mv
export CP=/bin/cp
export RM=/bin/rm
export GZIP=/usr/bin/gzip
export DATE=$(/bin/date +'%Y-%m-%d')
export DATETIME=`/bin/date +%Y%m%d_%H%M%S`
export CAT=/bin/cat
export GREP=/bin/grep
export SYSTEM=cc

##############################################
# Directories
##############################################

export BASEDIR=/u01/app/datamig/court_closure/lcp_report
export SCRIPTDIR=${BASEDIR}/scripts
export LOGDIR=${BASEDIR}/logs
export OUTPUTDIR=${BASEDIR}/output
export SQLDIR=${BASEDIR}/sql
export CONFFILEDIR=${BASEDIR}/configFiles

##############################################
# FileName
##############################################

export RUNFILE=lcp_report_courts_to_process.txt

###################################################
#        Report an info message and time         #
###################################################
InfoMsg()
{
${ECHO} "`/bin/date +%Y%m%d_%H%M%S` INFO:" $1
${ECHO} ""
}

###################################################
#        Report an error message and time         #
###################################################
function ErrorMsg
{
${ECHO} "`/bin/date +%Y%m%d_%H%M%S` ERROR:" $1
${ECHO} "`/bin/date +%Y%m%d_%H%M%S` ERROR: Program Terminated Unsuccessfully"
exit 1
}

####################################################
# Function to run a SQL statement as the CC_USER.  #
# This is called to actually run the LCP Report.   #
####################################################
function RunSqlFG
{

 COMMAND=$1
 LOGFILE=$2
  
 sqlplus -s  << EOF >/dev/null
 ${V_DB_USERNAME}/${V_DB_PASSWORD}@${ORACLE_SID}
SPOOL ${OUTPUTDIR}/${LOGFILE}
WHENEVER SQLERROR EXIT 1
WHENEVER OSERROR EXIT 2
SET TIME OFF
SET TIMING OFF
SET FEEDBACK OFF
SET ECHO OFF
SET TERMOUT OFF
SET TRIMSPOOL ON
SET TRIMOUT ON
SET PAGESIZE 0
SET VERIFY OFF
SET SERVEROUTPUT ON
SET LINESIZE 2000

${COMMAND}

EXIT

EOF

SQL_RESP=$?

## Check to ensure that the command has run successfully.
if [ ${SQL_RESP} -gt 0 ]
then
 ErrorMsg "Exception Running ${COMMAND} on ${ORACLE_SID} see: ${LOGFILE}"
else
 InfoMsg "Report Produced Successfully, output file: ${OUTPUTDIR}/${LOGFILE}"
fi

}

####################################################
# Controlling function that is responsible for     #
# running the LCP report for all of the courts that#
# are listed in the Configuration file             #
####################################################
function RunLCPReport
{

 # Loop through each line in the file, get the court 
 # id, then run the LCP report for each of the 
 # courts in the File.
 while read line
 do

   # Set the variable V_COURT to the Court ID 
   V_COURT=`echo ${line} | cut -d ':' -f1`

   # Document that the LCP report is being run.
   InfoMsg "Running the LCP Report for Court: ${V_COURT}"

   # Run the LCP report.
   RunSqlFG "exec lcp_report (${V_COURT});" "lcp_report_${V_COURT}.txt"

 done <  ${CONFFILEDIR}/${RUNFILE}

}


###################################################
# Check that the Court Code is a valid court in
# the Database.
###################################################
function ValidDBCourtCode
{

 # Get the result into the variable.
 V_COURT_VALID=`sqlplus -s ${V_DB_USERNAME}/${V_DB_PASSWORD}@${ORACLE_SID} << EOF
 set heading off
 set feedback off
 set echo off
 set timing off
 set termout off
 set verify off
 set pagesize 0

 SELECT DECODE(COUNT(*),0,'N','Y') 
   FROM cman_courts 
  WHERE code=${V_CC};


 EXIT;
EOF`

 # Check to see if the Court Code is valid, if it is then
 # write an informational message, otherwise exit with an error.
 if [ ${V_COURT_VALID} == 'N' ]
 then
  ErrorMsg "Entry ${V_COUNTER} in the config file is Invalid, Court ${V_CC} is NOT a valid court"
 fi

 }

###################################################
# Check that the Court Code is a valid 3 digit
# number, then call the function ValidDBCourtCode
# to ensure that the court code is a real court
# code in the database.
###################################################
function CheckCourtValid
{

  # Set the Input Parameter to a local Variable.
  V_CC=$1

  # Ensure that the court code in the file is a
  # 3 digit number, if it is a 3 digit number then
  # login to the database and ensure that the court
  # code is a valid court code in the DB.
  if [ `echo ${V_CC} | grep '[0-9][0-9][0-9]' | wc -l` -eq 1 ]
  then
     # Validate the Court Code  in the caseman database
     ValidDBCourtCode
  else
     ErrorMsg "Invalid Court Code in configuration File ${CONFFILEDIR}/${RUNFILE}"
  fi

}

###################################################
# Validate the Run Configuration File Contents    #
###################################################
function ValidateFileEntries
{

 # Set the Entry Counter
 V_COUNTER=0

 # Loop through each line in the file
 # and then validate the entries.
 while read line
 do

  # Increment the counter.
  V_COUNTER=`expr ${V_COUNTER} + 1`

  # Check that the Court is Valid.
  CheckCourtValid `echo ${line} | cut -d ':' -f1`

  InfoMsg "Line ${V_COUNTER} is a valid data line in the Configuration File"
 
 done <  ${CONFFILEDIR}/${RUNFILE}

}


###################################################
# Check to see if the run configuration file      #
# exists and is valid.                            #
###################################################

function ValidateConfigurationFile
{

  # Check to see of the Configuration File Exists.
  if [ `ls ${CONFFILEDIR} | grep ${RUNFILE} | wc -l` -gt 0 ]
  then
    
   InfoMsg "Configuration File exists, check that its populated."

   # Check that the Run File has Entries in it
   if [ -s ${CONFFILEDIR}/${RUNFILE} ]
   then
    InfoMsg "The Configuration file is popuated, check that the entries are correctly formatted"
   else
    InfoMsg "The Configuration file is Empty, exiting processing."
    exit 0
   fi

   # Validate the Configuration File Contents
   ValidateFileEntries

   else
    InfoMsg "The Configuration file specifying the courts to process does not exist, exiting"
    exit 0
   fi

}

#######################################################
#                 MAIN PROCESSING                     #
#######################################################

# Validate the Configuration file and that the 
# court id's are valid Court ID's.
ValidateConfigurationFile

# Run the LCP report for the Courts specified in
# the configuration files
RunLCPReport

exit 0