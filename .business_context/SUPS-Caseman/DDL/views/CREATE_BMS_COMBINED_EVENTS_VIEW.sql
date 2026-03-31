/*******************************************************************************
*      Module:          CREATE_BMS_COMBINED_EVENTS_VIEW.sql                    *
*                                                                              *
*      Description:     Script to create the CM_BMS_COMBINED_EVENTS_VIEW for   *
*                       reports.                                               *
*                                                                              *
*      (c) copyright EDS 2005                                                  *
*                                                                              *
*      Amendment History:                                                      *
* Version         Date            Changed By    Description                    *
*  1.0            06 May 2005     David Holder  Original Version               *
*  1.1            04/12/ 2005     M.Godley      use creating_court             *
*                                               in place of admin_court_code   *
*                                               on table co_events             *
*  1.2            25/01/2006      M.Godley      wrap NVL function around       *
*                                               creating_court and default to  *
*                                               admin_court_code if null       *  
*******************************************************************************
*/


CREATE OR REPLACE VIEW CM_BMS_COMBINED_EVENTS_VIEW
 AS 
SELECT
	caev.age_category age_category,
	caev.bms_task_number bms_task_number,
	task.task_description task_description,
	caev.event_date event_date,
        caev.deleted_flag error_indicator,
	NVL(caev.creating_court,caev.crt_code) crt_code
 FROM	case_events caev,
        tasks task
WHERE caev.bms_task_number = task.task_number
AND 
      task.action_event_ind = 'E'
  AND task.task_type = 'B'
  AND caev.deleted_flag = 'N'
UNION ALL
SELECT
	coev.age_category age_category,
	coev.bms_task_number bms_task_number,
	task.task_description task_description,
        coev.event_date event_date,
        coev.error_indicator,
        NVL(coev.creating_court,co.admin_court_code) crt_code
FROM	
        co_events coev, 
        consolidated_orders co,
        tasks task
WHERE co.co_number = coev.co_number
AND 
       coev.bms_task_number = task.task_number
AND 
       task.action_event_ind = 'E'
AND 
       task.task_type = 'B'
AND 
       coev.error_indicator = 'N';
