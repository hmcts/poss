WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes required for the 
|                   introduction of new Family Enforcement BMS tasks 
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5884.log

PROMPT ************************************************************************
PROMPT Inserting into CCBC_REF_CODES table
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('DISTRICT REGISTRY','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('ENFORCEMENT','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('ISSUE','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('JUDGMENT','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('LISTING','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('PAYMENT','100 DESCRIPTION','CFG');

INSERT INTO ccbc_ref_codes
(rv_low_value, rv_domain, rv_type)
VALUES
('FAMILY ENFORCEMENT','100 DESCRIPTION','CFG');

PROMPT ************************************************************************
PROMPT Inserting into TASKS table
PROMPT ************************************************************************

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA004','B','General application (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA005','B','Notice of non service (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA006','B','General Order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA007','B','Lodging Documents (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA008','B','Re-issue and amend process (excluding warrants) no hrg (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA009','B','Re-issue and amend process (excl warrants) hrg required (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA010','B','Document forwarded post transfer (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA011','B','Correspondence replies (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA012','B','Correspondence received (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA013','B','Transfer out after order (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA014','B','Issue warrant of control (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA015','B','Issue of Charging Order (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA016','B','Drawing and dispatching interim Charging Order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA017','B','Charging Order discharged (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA018','B','Final Charging Order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA019','B','Application and order to attend court for questioning (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA020','B','Suspended committal order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA021','B','Warrant of committal judgement summons inc A of E (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA022','B','Issue third party debt app (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA023','B','Interim Third Party Debt Order (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA024','B','Final Third Party Debt Order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA025','B','Third Party Debt Order Discharged (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA026','B','Issue of judgement summons (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA027','B','Order for attendance at adjourned hearing of judg summons (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA028','B','Order for committal judgement summons (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA029','B','Warrant of arrest / committal (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA030','B','Respondents application to suspend a home warrant (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA031','B','Bailiff interim return - home warrant (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA032','B','Bailiff interim return - foreign warrant (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA033','B','Claimants instruction to suspend home warrant Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA034','B','Final return on suspended home warrant - following order (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA035','B','Bailiff final return - home warrant (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA036','B','Reissue or amendment of any warrant (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA037','B','Application for fee exemption / remission (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA038','B','Issue of Attachment of earnings application - judg debt (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA039','B','A of E (judgment debt) - no N56 returned (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA040','B','Order for defendant to attend adjourned A of E hrg (Family Enf)','E');
	
INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA041','B','A of E order for committal / arrest (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA042','B','A of E order - to calculation of PER (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA043','B','Issue attachment of earnings application - maintenance (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA044','B','Order for defendant to attend A of E hrg - maintenance (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA045','B','Issue of summons - offence Section 23 A of E Act (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA046','B','Order from N62 hrg A of E Act Section 23 (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA047','B','A of E application judgment debt - no N338 returned (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA048','B','Drawing and dispatching A of E hrg - judgement debt (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA049','B','Attachment of earnings order - maintenance (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA050','B','Drawing and dispatching susp A of E order - judg debt (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA051','B','Suspended A of E order - maintenance (Family Enf)','E');

INSERT INTO tasks
(task_number, task_type, task_description, action_event_ind)
VALUES
('MA052','B','Consent Order (Family Enf)','E');
	
COMMIT;

SPOOL OFF