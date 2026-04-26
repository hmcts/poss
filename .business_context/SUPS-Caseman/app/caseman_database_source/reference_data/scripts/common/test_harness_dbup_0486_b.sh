#!/bin/bash
if [ -f $1/dbup_0486_b_output_for_court_code_$5*.log ]; then
    rm $1/dbup_0486_b_output_for_court_code_$5*.log 
fi
if [ -f $1/dbup_0486_b_output_for_court_code_$5*.err ]; then
    rm $1/dbup_0486_b_output_for_court_code_$5*.err 
fi
export ORACLE_SID=supsdb01; export ORACLE_SID
ORACLE_HOME=/u01/app/oracle/product/10.2.0/db_1; export ORACLE_HOME
PATH=$PATH:$ORACLE_HOME/bin; export PATH
sqlplus -S $2/$2 <<EOF
set feed off pagesize 0 head off linesize 100 trimspool ON serverout ON
spool $1/Test_$3.out
BEGIN
DBMS_OUTPUT.PUT_LINE(CHR(10));
DBMS_OUTPUT.PUT_LINE('-------------------- Test : ' || $3 || ' --------------------');
DBMS_OUTPUT.PUT_LINE((REPLACE('$4','~',' ')));
END;
/
spool off
@$1/dbup_0486_b.sql $5
exit;
EOF
if [ -f $1/dbup_0486_b_output_for_court_code_$5*.log ]; then
    cat $1/dbup_0486_b_output_for_court_code_$5*.log >> $1/Test_$3.out 
fi
if [ -f $1/dbup_0486_b_output_for_court_code_$5*.err ]; then
    cat $1/dbup_0486_b_output_for_court_code_$5*.err >> $1/Test_$3.out 
fi
