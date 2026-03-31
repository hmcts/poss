REM --------------------------------
REM FILE:	GetSchemaProperties.sql
REM
REM PURPOSE:	Query various properties of the schema for comparison
REM
REM TYPE:	SQL 
REM
REM MODIFICATION HISTORY
REM 20061124	alastair.brown@valtech.co.uk	1st Version
REM 20061003	philip.haferer@eds.com          2nd Version     
REM             Added: Triggers, Sequences, Packages and SET_SUPS_APP_CTX.
REM             Modified: user_constraints - search_condition added to 'order by'.
REM 20061006    philip.haferer@eds.com          2nd Version     
REM             Modified: user_constraints select - order by on search_condition caused 'ORA-00997: illegal use of LONG datatype'.
REM --------------------------------

set head off;
set linesize 10000;
set wrap off;


select table_name, column_name, Data_type, data_length, nullable
from user_Tab_cols
order by table_name, column_name;

select  index_name, index_type, table_name 
from user_indexes
order by index_name, index_type;

select table_name, constraint_name, constraint_type, validated, search_condition
from user_constraints
order by table_name, constraint_name, constraint_type;

select trigger_name, status 
from   user_triggers 
order by trigger_name;

select sequence_name
from   user_sequences 
order by sequence_name;

select object_name
from   user_objects
where  object_type = 'PACKAGE'
order by object_name;

select object_name
from   all_objects
where  object_type = 'PROCEDURE'
and    object_name = 'SET_SUPS_APP_CTX';

