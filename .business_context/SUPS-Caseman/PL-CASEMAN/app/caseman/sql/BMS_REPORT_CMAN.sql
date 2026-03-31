/*-------------------------------------------------------------------------------
|
| $HeadURL: 
|
| SYNOPSIS      :  Generate BMS_REPORT for CaseMan
|
| $Author: :       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2011 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : Des Johnston  22/02/2012
| 				  Increased length of Description column to 32 to prevent the corruption of the BMS Batch weekly export.  This change is
|                 trac 4617 - CM Release 14.
|
|---------------------------------------------------------------------------------
|
| $Rev:            Revision of last commit
| $Date:           Date of last commit
| $Id:
|
--------------------------------------------------------------------------------*/
WHENEVER SQLERROR EXIT 1
WHENEVER OSERROR EXIT 2
SET NEWPAGE 0
SET SPACE 0
SET LINESIZE 158
SET PAGESIZE 0
SET ECHO OFF
SET FEEDBACK OFF
SET VERIFY OFF
SET HEADING OFF
SET MARKUP HTML OFF SPOOL OFF
SET TERMOUT OFF
SET COLSEP ,

REPHEADER OFF

column WeekCommence format a9
column Crt format 999
column Department format a1
column DESCRIPTION format a32
column 0-5 format 99999
column 6-10 format 99999
column >10 format 99999
column Total format 99999

var startDate varchar2(10);
var endDate varchar2(10);
var courtCode number;
var fileName varchar2(30);

exec :startDate := '&1';
exec :endDate := '&2';
exec :courtCode := '&3';
exec :fileName := '&4'

SPOOL &4

truncate table tmp_bms_stats_parameters;
INSERT INTO tmp_bms_stats_parameters
  (start_date, end_date, court_id)
VALUES
  (to_date(:startDate, 'yyyy-MM-dd'),
   to_date(:endDate, 'yyyy-MM-dd'),
   :courtCode);	
SELECT 
prm.start_date  as WeekCommence,
court as Crt,
null as Department, 
'"'||sec.section_name||'"'  as Description,
task_no  as StatType,
SUM("0-5")  as "0-5",
SUM("6-10") as "6-10",
SUM(">10") as ">10", 
SUM("0-5"+"6-10"+">10") as "Total"
  FROM (
        SELECT /*+ index(ca case_events_ix17) */ ca.creating_court COURT,
                       ca.creating_section SECTION, 
                       ca.bms_task_number TASK_NO, 
                       ta.task_description TASK_DESC, 
		    CASE WHEN ca.age_category ='0-5 Days'  THEN 1 ELSE 0 END AS "0-5"
            ,CASE WHEN ca.age_category ='6-10 Days'  THEN 1 ELSE 0 END AS "6-10"
            ,CASE WHEN ca.age_category ='> 10 Days' THEN 1 ELSE 0 END AS ">10"
          FROM case_events ca,
               tasks ta,
			   tmp_bms_stats_parameters prm
         WHERE ca.deleted_flag = 'N'
           AND ca.creating_court = prm.court_id
           AND ca.event_date between prm.start_date AND prm.end_date
           AND ca.bms_task_number = ta.task_number
           AND ta.TASK_TYPE = 'B'
           AND ta.ACTION_EVENT_IND IN ('A','E')
        UNION ALL
        SELECT /*+ index(co co_events_ix10) */ co.creating_Court COURT,
                       co.creating_section SECTION, 
                       co.bms_task_number TASK_NO,
                       ta1.task_description TASK_DESC, 
            CASE WHEN co.age_category ='0-5 Days'  THEN 1 ELSE 0 END AS "0-5"
            ,CASE WHEN co.age_category ='6-10 Days'  THEN 1 ELSE 0 END AS "6-10"
            ,CASE WHEN co.age_category ='> 10 Days' THEN 1 ELSE 0 END AS ">10" 
          FROM co_events co,
               tasks ta1,
			   tmp_bms_stats_parameters prm 
         WHERE co.error_indicator = 'N' 
           AND co.creating_court = prm.court_id
           AND co.EVENT_DATE between prm.start_date AND prm.end_date
           AND co.bms_task_number = ta1.task_number
           AND ta1.TASK_TYPE = 'B'
           AND ta1.ACTION_EVENT_IND IN ('A','E')
        UNION ALL
        SELECT /*+ index(tc task_counts_ix6) */ tc.creating_court COURT,
                       tc.creating_section SECTION, 
                       tc.task_number TASK_NO,
                       ta2.task_description TASK_DESC, 
            CASE WHEN tc.age_category ='0-5 Days'  THEN tc.task_count ELSE 0 END AS "0-5"
            ,CASE WHEN tc.age_category ='6-10 Days'  THEN tc.task_count ELSE 0 END AS "6-10"
            ,CASE WHEN tc.age_category ='> 10 Days' THEN tc.task_count ELSE 0 END AS ">10"
          FROM task_counts tc,
               tasks ta2,
			   tmp_bms_stats_parameters prm
         WHERE tc.creating_court = prm.court_id
           AND tc.task_date between prm.start_date AND prm.end_date
           AND tc.TASK_NUMBER = ta2.task_number
           AND ta2.TASK_TYPE = 'B'
           AND ta2.ACTION_EVENT_IND IN ('A','E')     ),
           SECTIONS SEC,
		   tmp_bms_stats_parameters prm
WHERE sec.section_name = section
       AND sec.admin_court_code = prm.court_id
group by sec.section_name, court, task_no, prm.start_date
     order by sec.section_name, SUBSTR( task_no,1,2), TO_NUMBER( SUBSTR( task_no,3));
  SPOOL off
