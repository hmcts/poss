WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL: http://sups.disc.uk.logica.com/svn/trunk/Caseman-CCBC/REFDATA/DML/dml_trac_5025.sql $:
|
| SYNOPSIS      : Reference data changes for the CaseMan TCE release
|
| $Author: vincentcp $:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2013 CGI UK Limited.
|                 This file contains information which is confidential and of
|                 value to CGI. It may be used only for the specific purpose for
|                 which it has been provided. CGI's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      : This data will be used as reference data.
|
|---------------------------------------------------------------------------------
|
| $Rev: 3319 $:          Revision of last commit
| $Date: 2009-07-10 10:33:12 +0100 (Fri, 10 Jul 2009) $:         Date of last commit
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5025.log

PROMPT ************************************************************************
PROMPT Update table RETURN_CODES with revised wording for TCE release
PROMPT ************************************************************************

CALL sys.set_sups_app_ctx('support','0','trac 5025');

UPDATE   return_codes
SET   return_code_description = 'The debtor has paid the amount stated below in cash and a cheque will be sent to you within '
|| 'the next seven days. Although the payment is less than the amount outstanding under the warrant, the bailiff reports that '
|| 'the debtor owns insufficient goods which could be sold to cover the cost of removal and sale. All the goods of sufficient '
|| 'value are subject to either hire purchase or rental agreements and the bailiff cannot take control of them. In the '
|| 'circumstances the bailiff cannot do more unless you are able to provide further information to re-issue the warrant '
|| '(for example, giving a description and location of other goods which belong to the debtor).  You may have to pay a fee to '
|| 're-issue the warrant. The amount paid by the debtor is: £'
WHERE	return_code = '103';

UPDATE   return_codes
SET   return_code_description = 'The debtor has paid the amount stated below in cash and a cheque will be sent to you within the next seven days. Although the payment is '
|| 'less than the amount outstanding under the warrant, the bailiff reports that the debtor owns insufficient goods which could be sold to cover the cost of removal and '
|| 'sale. The debtor is a lodger living in furnished accommodation and all the goods of sufficient value belong to the landlord and the bailiff cannot take control of them.  '
|| 'In the circumstances the bailiff cannot do more unless you are able to provide further information to re-issue the warrant (for example, giving a description and location '
|| 'of other goods which belong to the debtor).  You may have to pay a fee to re-issue the warrant. The amount paid by the debtor is: £'
WHERE	return_code = '104';

UPDATE   return_codes
SET   return_code_description = 'The debtor has paid the amount stated below in cash and a cheque will be sent to you within the next seven days. Although the payment is '
|| 'less than the amount outstanding under the warrant, the bailiff reports that the debtor owns insufficient goods which could be sold to cover the cost of removal and '
|| 'sale. The debtor lives with parents and all the goods of sufficient value belong to them and cannot be taken control of by the bailiff. In the circumstances the bailiff '
|| 'cannot do more unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods which belong to '
|| 'the debtor).  You may have to pay a fee to re-issue the warrant. The amount paid by the debtor is: £'
WHERE	return_code = '105';

UPDATE   return_codes
SET   return_code_description = 'The debtor''s cheque about which you were notified previously, has now cleared and you will be sent a cheque within the next seven days. '
|| 'Although the payment is less than the amount outstanding under the warrant, the bailiff reports that the debtor owns insufficient goods which could be sold to cover '
|| 'the cost of removal and sale. The debtor is a lodger living in furnished accommodation and all the goods of sufficient value belong to the landlord and the bailiff '
|| 'cannot take control of them. In the circumstances the bailiff cannot do more unless you are able to provide further information to re-issue the warrant (for example, '
|| 'giving a description and location of other goods which belong to the debtor).  You may have to pay a fee to re-issue the warrant.'
WHERE	return_code = '109';

UPDATE   return_codes
SET   return_code_description = 'The debtor''s cheque about which you were notified previously, has now cleared and you will be sent a cheque within the next seven days. '
|| 'Although the payment is less than the amount outstanding under the warrant, the bailiff reports that the debtor owns insufficient goods which could be sold to cover '
|| 'the cost of removal and sale. The debtor lives with parents and all the goods of sufficient value belong to them and the bailiff is unable to take these goods. In the '
|| 'circumstances the bailiff cannot do more unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of '
|| 'other goods which belong to the debtor).'
WHERE	return_code = '110';

UPDATE   return_codes
SET   return_code_description = 'The debtor''s goods have now been sold but unfortunately the amount raised is insufficient to cover the full amount due under the warrant '
|| 'and the costs. After deduction of the costs of removal and sale, the sum stated below remains to pay the debt and you will receive a cheque for that amount within the '
|| 'next seven days. There are no other goods on which the bailiff can take control of to sell to pay the amount of the warrant. In the circumstances the bailiff cannot do '
|| 'more unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods which belong to the '
|| 'debtor).  You may have to pay a fee to re-issue the warrant. The sum you will be paid is: £'
WHERE	return_code = '113';

UPDATE   return_codes
SET   return_code_description = 'The bailiff visited the debtor who owns insufficient goods which could be sold to cover the cost of removal and sale. The debtor is a '
|| 'lodger living in furnished accommodation and all the goods of sufficient value belong to the landlord and the bailiff is unable to take these goods. In the circumstances '
|| 'the bailiff cannot do more unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods '
|| 'which belong to the debtor).  You may have to pay a fee to re-issue the warrant.'
WHERE	return_code = '116';

UPDATE   return_codes
SET   return_code_description = 'The bailiff visited the debtor who owns insufficient goods which could be sold to cover the cost of removal and sale. The debtor lives '
|| 'with parents and all the goods of sufficient value belong to them and the bailiff is unable to take these goods. In the circumstances the bailiff cannot do more '
|| 'unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods which belong to the debtor). '
|| 'You may to pay a fee to re-issue the warrant.'
WHERE	return_code = '117';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has visited the debtor''s address on the occasions listed below but has been unable to meet the debtor or gain peaceful '
|| 'entry and therefore the bailiff has not had an opportunity to take control of goods. Local enquiries have not indicated the debtor''s whereabouts or movements and '
|| 'the bailiff has no information about when the debtor may be at the address. In the circumstances the bailiff cannot do more unless you are able to provide further '
|| 'information to re-issue the warrant (for example, stating when the debtor will be at the address or giving a description and location of goods which belong to the '
|| 'debtor). You may have to pay a fee to re-issue the warrant. The dates and times of the bailiff''s visit were as follows:'
WHERE	return_code = '120';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has visited the debtor''s address and spoken with the debtor who has refused to allow the bailiff peaceful entry. '
|| 'The bailiff manager has also visited the address and met with a similar response. The debtor is entitled to refuse the bailiff entry to domestic premises and in '
|| 'the circumstances, the bailiff has not had an opportunity to establish whether the debtor has goods on which can be taken into control. The bailiff can take no further '
|| 'action unless you are able to provide further information to re-issue the warrant (for example, giving a description and location of other goods which belong to '
|| 'the debtor). You may have to pay a fee to re-issue the warrant.'
WHERE	return_code = '121';

UPDATE   return_codes
SET   return_code_description = 'You have admitted the claim made on the goods taken into control and there are no other goods on which the bailiff can take control. '
|| 'In the circumstances the bailiff cannot do more unless you are able to provide further information to re-issue the warrant (for example,  giving a description and '
|| 'location of other goods which belong to the debtor). You may have to pay a fee to re-issue the warrant.'
WHERE	return_code = '122';

UPDATE   return_codes
SET   return_code_description = 'The warrant has been filed away as you have not replied to the interim return asking you to indemnify the bailiff for the costs of '
|| 'removing the goods taken into control. The interim return was dated:'
WHERE	return_code = '145';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has taken control of goods belonging to the debtor. The bailiff will remove and  sell the goods if the debtor does not '
|| 'pay. If the proceeds of sale do not cover the costs of removal and sale you are liable for the shortfall. The goods taken into control are:'
WHERE	return_code = 'AB';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has taken control of various goods apparently belonging to the debtor and is waiting for confirmation of ownership of the '
|| 'vehicle(s) taken. If the vehicle(s) belong to the debtor the bailiff will be entitled to remove and sell the goods if the debtor does not pay. If the proceeds of '
|| 'sale do not cover the costs of removal and sale you are liable for the shortfall. The goods taken into control are:'
WHERE	return_code = 'AC';

UPDATE   return_codes
SET   return_code_description = 'The debtor has made an application for judgment to be set aside: if you have not already received a copy of the application one '
|| 'will be sent to you shortly. The bailiff has taken control of goods belonging to the debtor. The bailiff will remove and sell the goods if the application fails '
|| 'and the debtor still does not pay. The goods taken into control are:'
WHERE	return_code = 'AD';

UPDATE   return_codes
SET   return_code_description = 'The debtor has made an application for the warrant to be suspended: if you have not already received a copy of the application one '
|| 'will be sent to you shortly. The bailiff has taken control of goods belonging to the debtor. The bailiff will remove and sell the goods if the application fails '
|| 'and the debtor still does not pay. The goods taken into control are:'
WHERE	return_code = 'AE';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has taken control of goods belonging to the debtor. We require you to provide an indemnity for the costs of removal and '
|| 'sale should the proceeds of sale be insufficient. If you do not provide the indemnity within 14 days, the warrant will be filed away and you may have to pay a fee '
|| 'to re-issue it. The goods taken into control are:'
WHERE	return_code = 'AF';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has taken control of goods belonging to the debtor. We require you to provide an indemnity for the costs of breaking '
|| 'into the premises to remove the goods for sale should the proceeds of sale be insufficient. If you do not provide the indemnity within 14 days, the warrant '
|| 'will be filed away and you may have to pay a fee to re-issue it. The goods taken into control are:'
WHERE	return_code = 'AG';

UPDATE   return_codes
SET   return_code_description = 'The bailiff has removed the debtor''s goods previously taken into control. The goods have been taken to a sale room for auction. '
|| 'Following the sale, the costs of removal and sale will be deducted from the proceeds and the court will send you any remaining money.'
WHERE	return_code = 'AH';

UPDATE   return_codes
SET   return_code_description = 'The ownership of goods on which the bailiff took control has been disputed. Details of the claim to ownership and what you should do now will be sent to you shortly.'
WHERE	return_code = 'AL';

UPDATE   return_codes
SET   return_code_description = 'THE BAILIFF HAS BEEN UNABLE TO MEET THE DEBTOR OR GAIN ACCESS TO TAKE CONTROL OF GOODS. PLEASE PROVIDE FURTHER INFORMATION TO ASSIST THE BAILIFF WITHIN 14 DAYS OR WARRANT FILED'
WHERE	return_code = 'BM'
AND   admin_court_code = 282;

UPDATE   return_codes
SET   return_code_description = 'BAILIFF UNABLE TO MEET DEBTOR OR TAKE CONTROL OF GOODS, PLEASE PROVIDE FURTHER USEFUL INFORMATION WITHIN 14 DAYS OR WARRANT FILED AWAY'
WHERE	return_code = 'BM'
AND   admin_court_code = 236;

UPDATE   return_codes
SET   return_code_description = 'INDEMNITY IN WRITING REQUIRED AS GOODS TAKEN INTO CONTROL MAY BE OF INSUFFICIENT VALUE. PLEASE RESPOND WITHIN 14 DAYS OR WARRANT FILED AWAY.'
WHERE	return_code = 'EI'
AND   admin_court_code = 288;

UPDATE   return_codes
SET   return_code_description = 'APPLICATION TO SET ASIDE JUDGMENT FILED. THE BAILIFF HAS TAKEN CONTROL OF GOODS FOR REMOVAL AND SALE.'
WHERE	return_code = 'MJE'
AND   admin_court_code = 251;

UPDATE   return_codes
SET   return_code_description = 'APPLICATION TO SET ASIDE JUDGMENT FILED. THE DEBTOR HAS NO GOODS ON WHICH TO TAKE CONTROL.'
WHERE	return_code = 'MJN'
AND   admin_court_code = 251;

UPDATE   return_codes
SET   return_code_description = 'APPLICATION TO SUSPEND/VARY THE ORDER FILED. A COPY WILL BE SENT TO YOU. THE BAILIFF HAS TAKEN CONTROL OF GOODS FOR REMOVAL AND SALE.'
WHERE	return_code = 'MVE'
AND   admin_court_code = 251;

UPDATE   return_codes
SET   return_code_description = 'APPLICATION TO SUSPEND/VARY FILED. THE DEBTOR HAS NO GOODS ON WHICH TO TAKE CONTROL.'
WHERE	return_code = 'MVN'
AND   admin_court_code = 251;

UPDATE   return_codes
SET   return_code_description = 'THE DEBTOR HAS NO GOODS OF VALUE ON WHICH TO TAKE CONTROL OR REMOVE. THE BAILIFF HAS RETAINED THE WARRANT ON PROMISE OF PAYMENT.'
WHERE	return_code = 'NGP'
AND   admin_court_code = 251;

UPDATE   return_codes
SET   return_code_description = 'THE BAILIFF HAS BEEN REFUSED PEACEFUL ENTRY TO TAKE CONTROL OF GOODS. FURTHER USEFUL INFO REQUIRED (E.G. CAR REG) WITHIN 14 DAYS OR WARRANT FILED.'
WHERE	return_code = 'RE'
AND   admin_court_code = 236;

UPDATE return_codes rc
SET    rc.return_code_description = REPLACE(rc.return_code_description, 'DEFENDANT', 'DEBTOR')
WHERE  rc.return_code_description like '%DEFENDANT%'
AND    rc.current_return = 'Y'
AND    (rc.admin_court_code IN (335,0)
OR     rc.admin_court_code IN (SELECT c.code 
                               FROM courts c 
                               WHERE c.sups_centralised_flag = 'Y'
                               AND   c.caseman_inservice = 'Y') );
							   
UPDATE return_codes rc
SET    rc.return_code_description = REPLACE(rc.return_code_description, 'defendant', 'debtor')
WHERE  rc.return_code_description like '%defendant%'
AND    rc.current_return = 'Y'
AND    (rc.admin_court_code IN (335,0)
OR     rc.admin_court_code IN (SELECT c.code 
                               FROM courts c 
                               WHERE c.sups_centralised_flag = 'Y'
                               AND   c.caseman_inservice = 'Y') );
							   
UPDATE return_codes rc
SET    rc.return_code_description = REPLACE(rc.return_code_description, 'CLAIMANT', 'CREDITOR')
WHERE  rc.return_code_description like '%CLAIMANT%'
AND    rc.current_return = 'Y'
AND    (rc.admin_court_code IN (335,0)
OR     rc.admin_court_code IN (SELECT c.code 
                               FROM courts c 
                               WHERE c.sups_centralised_flag = 'Y'
                               AND   c.caseman_inservice = 'Y') );
							   
UPDATE return_codes rc
SET    rc.return_code_description = REPLACE(rc.return_code_description, 'claimant', 'creditor')
WHERE  rc.return_code_description like '%claimant%'
AND    rc.current_return = 'Y'
AND    (rc.admin_court_code IN (335,0)
OR     rc.admin_court_code IN (SELECT c.code 
                               FROM courts c 
                               WHERE c.sups_centralised_flag = 'Y'
                               AND   c.caseman_inservice = 'Y') );
							   
UPDATE return_codes 
SET    return_code_summary = 'LEVY/APPLICATION TO SET ASIDE JUDGMENT: CONTROL WARRANT'
WHERE  return_code = 'AD';

UPDATE return_codes 
SET    return_code_summary = 'LEVY/APPLICATION TO SUSPEND: CONTROL WARRANT'
WHERE  return_code = 'AE';

UPDATE return_codes 
SET    return_code_summary = 'FINAL NOTICE - CONTROL WARRANT'
WHERE  return_code = 'FN';

UPDATE return_codes 
SET    return_code_summary = 'Application to set judgment aside: control warrant'
WHERE  return_code = 'SJA'
AND    admin_court_code = 387;

UPDATE return_codes 
SET    return_code_summary = 'Application to suspend/vary: control warrant'
WHERE  return_code = 'SUS'
AND    admin_court_code = 387;
							   
PROMPT ************************************************************************
PROMPT Updated table RETURN_CODES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table TASKS
PROMPT ************************************************************************

UPDATE tasks
SET    task_description = 'Issue warrant of control (system cases - CCBC only)'
WHERE  task_number = 'BC009';

UPDATE tasks
SET    task_description = 'Reissue warrant of control (system cases)'
WHERE  task_number = 'BC011';

UPDATE tasks
SET    task_description = 'Reissue of warrant of control (system cases) duplicates'
WHERE  task_number = 'BC051';

UPDATE tasks
SET    task_description = 'Reissue warrant of control (system cases) - MCOL only'
WHERE  task_number = 'BC063';

UPDATE tasks
SET    task_description = 'ISSUE WARRANT OF CONTROL'
WHERE  task_number = 'EN1';

PROMPT ************************************************************************
PROMPT Updated table TASKS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Insert new event descriptions in the CHANGED_EVENTS table
PROMPT ************************************************************************

INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 380;

INSERT INTO changed_events
VALUES 
	(380
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'WARRANT OF CONTROL ISSUED');

INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 560;

INSERT INTO changed_events
VALUES 
	(560
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'ISSUE WRIT OF CONTROL');
	
INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 562;

INSERT INTO changed_events
VALUES 
	(562
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'WRIT OF CONTROL RENEWED');
	
INSERT INTO changed_events ce
SELECT se.event_id
	   ,TO_DATE('01-Jan-1900','DD-Mon-YYYY')
	   ,TRUNC(SYSDATE-1)
	   ,se.description
FROM standard_events se
WHERE se.event_id = 629;

INSERT INTO changed_events
VALUES 
	(629
	,TRUNC(SYSDATE)
	,TO_DATE('31-Dec-2100','DD-Mon-YYYY')
	,'EXTEND WARRANT OF CONTROL');
	
PROMPT ************************************************************************
PROMPT Updated table CHANGED_EVENTS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update existing events in the STANDARD_EVENTS table
PROMPT ************************************************************************

UPDATE standard_events se
SET se.description = 'WARRANT OF CONTROL ISSUED'
WHERE se.event_id = 380;

UPDATE standard_events se
SET se.description = 'ISSUE WRIT OF CONTROL'
WHERE se.event_id = 560;

UPDATE standard_events se
SET se.description = 'WRIT OF CONTROL RENEWED'
WHERE se.event_id = 562;

UPDATE standard_events se
SET se.description = 'EXTEND WARRANT OF CONTROL'
WHERE se.event_id = 629;

PROMPT ************************************************************************
PROMPT Updated table STANDARD_EVENTS
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table ORDER_TYPES
PROMPT ************************************************************************

UPDATE order_types
SET    order_description = 'Notice Of Issue/Re-issue Of Warrants Of Control - N326'
       ,legal_description = 'Notice Of Issue/Re-issue Of Warrants Of Control - N326'
WHERE  order_id = 'CM_N326';

UPDATE order_types
SET    order_description = 'Print Warrants Of Control - N42'
       ,legal_description = 'Print Warrants Of Control - N42'
WHERE  order_id = 'CM_WAREX';

PROMPT ************************************************************************
PROMPT Updated table ORDER_TYPES
PROMPT ************************************************************************

PROMPT ************************************************************************
PROMPT Update table CCBC_REF_CODES
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('CONTROL'
       ,'CURRENT_WARRANT_TYPE'
       ,'Control');
	   
INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning
       ,rv_type)
VALUES
       ('CONTROL'
       ,'WARRANT TYPE'
       ,'CONTROL'
       ,'CFG');

DELETE FROM ccbc_ref_codes
WHERE rv_domain = 'CURRENT_WARRANT_TYPE'
AND   rv_low_value = 'EXECUTION';

UPDATE ccbc_ref_codes
SET    rv_domain = 'WARRANT TYPE_OBSOLETE'
WHERE  rv_domain = 'WARRANT TYPE'
AND    rv_low_value = 'EXECUTION';

INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('CONTROL'
       ,'STATS_WARRANT_TYPE'
       ,'Control');
	   
INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('COMMITTAL'
       ,'STATS_WARRANT_TYPE'
       ,'Committal');
	   
INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('POSSESSION'
       ,'STATS_WARRANT_TYPE'
       ,'Possession');

INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('DELIVERY'
       ,'STATS_WARRANT_TYPE'
       ,'Delivery');

INSERT INTO ccbc_ref_codes
       (rv_low_value
       ,rv_domain
       ,rv_meaning)
VALUES
       ('EXECUTION'
       ,'STATS_WARRANT_TYPE'
       ,'Execution');

PROMPT ************************************************************************
PROMPT Updated table CCBC_REF_CODES
PROMPT ************************************************************************

COMMIT;

SPOOL OFF