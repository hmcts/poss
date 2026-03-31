#!/bin/bash

# ------------------------------------------------------------------------
# Windows script to extract all ORACLE ddl in a given schema. 
#
# Usage: extract_schema_ddl.bat
#
# ------------------------------------------------------------------------

# ------------------------------------------------------------------------
# Create directory for scripts and then create separate script of each 
# object type in a given schema, and then for each constraint type.
# ------------------------------------------------------------------------

export ORACLE_SID=caseman01
export ORACLE_HOME=/u01/app/oracle/product/10.2.0/db_1

echo "CLEANING GENERATED DIRECTORY"
rm -r ../generated

echo "EXTRACTING DDL FOR SCHEMA CASEMAN"
mkdir -p ../generated/CASEMAN
$ORACLE_HOME/bin/sqlplus -s baj/baj <<LABEL
@extract_objects_ddl.sql CASEMAN
LABEL
$ORACLE_HOME/bin/sqlplus -s baj/baj <<LABEL
@extract_constraints_ddl.sql CASEMAN
LABEL
$ORACLE_HOME/bin/sqlplus -s baj/baj <<LABEL
@extract_grants_ddl.sql CASEMAN
LABEL


echo "OUTPUT WRITTEN TO ../generated"
