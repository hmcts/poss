#!/bin/ksh
#***********************************************************************
# Name: sleep_wft_newline.sh
# Date written : 18th July 2007
# Description: Script to concatenate a newline character to the end of
#              all sups wft files that are present in the directory
#              /tools/app/CaseMan/wft_central_sups.
#              The newline character is present in the file
#              /usr/users/casmutil/sups_scripts/chr10.txt
#***********************************************************************
secstogo=`sqlplus -s casm/casm1 <<endofsql
set headi off
set termout off
select trunc ((to_date(to_char(sysdate+1,'DD-MON-YYYY')
       ||' 02:00','DD-MON-YYYY HH24:MI')- sysdate) *24*60*60) a1 from dual;
endofsql`
echo  "i am waiting for $secstogo seconds"
sleep $secstogo

for file in `ls /tools/app/CaseMan/wft_central_sups/*`
do
   cat $file /usr/users/casmutil/sups_scripts/chr10.txt > /usr/users/casmutil/sups_scripts/temp_wft.dat
   mv /usr/users/casmutil/sups_scripts/temp_wft.dat $file
done

nohup sleep_wft_newline.sh &
exit 0


