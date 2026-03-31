
  CREATE OR REPLACE FORCE VIEW "CASEMAN"."AE" ("AE_NUMBER", "CASE_NUMBER", "PARTY_AGAINST_PARTY_ROLE_CODE", "PARTY_AGAINST_CASE_PARTY_NO", "PARTY_FOR_PARTY_ROLE_CODE", "PARTY_FOR_CASE_PARTY_NO", "OUTSTANDING_BALANCE") AS
  SELECT
  A.AE_NUMBER,
  A.CASE_NUMBER,
  A.PARTY_AGAINST_PARTY_ROLE_CODE,
  A.PARTY_AGAINST_CASE_PARTY_NO,
  A.PARTY_FOR_PARTY_ROLE_CODE,
  A.PARTY_FOR_CASE_PARTY_NO,
  NVL( A.AMOUNT_OF_AE, 0 ) + DECODE( SUM( B.AMOUNT ), NULL, SUM( NVL( A.AE_FEE, 0 )), SUM( B.AMOUNT )) OUTSTANDING_BALANCE
FROM
  FEES_PAID B,
  AE_APPLICATIONS A
WHERE
  A.AE_NUMBER = B.PROCESS_NUMBER AND
  B.PROCESS_TYPE = 'A' AND
  B.DELETED_FLAG = 'N'
GROUP BY
  A.AE_NUMBER,
  A.CASE_NUMBER,
  A.AE_TYPE,
  A.PARTY_AGAINST_PARTY_ROLE_CODE,
  A.PARTY_AGAINST_CASE_PARTY_NO,
  A.PARTY_FOR_PARTY_ROLE_CODE,
  A.PARTY_FOR_CASE_PARTY_NO,
  A.AMOUNT_OF_AE
UNION
SELECT
  AE_NUMBER,
  CASE_NUMBER,
  PARTY_AGAINST_PARTY_ROLE_CODE,
  PARTY_AGAINST_CASE_PARTY_NO,
  PARTY_FOR_PARTY_ROLE_CODE,
  PARTY_FOR_CASE_PARTY_NO,
  NVL( AMOUNT_OF_AE, 0 ) + NVL( AE_FEE, 0 ) OUTSTANDING_BALANCE
FROM
  AE_APPLICATIONS
WHERE
  AE_NUMBER NOT IN (    SELECT  PROCESS_NUMBER
            FROM    FEES_PAID
            WHERE   PROCESS_TYPE = 'A'
            AND DELETED_FLAG = 'N' )
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."AE_FEES" ("AE_NUMBER", "CASE_NUMBER", "AE_TYPE", "FEE_AMOUNT", "FEE_DATE", "AE_ISSUE_DATE", "FEE_COURT_CODE", "AE_COURT_CODE") AS
  SELECT a.AE_NUMBER,
       a.CASE_NUMBER,
       a.AE_TYPE,
       NVL(F.AMOUNT, 0.00),
       f.ALLOCATION_DATE,
       a.DATE_OF_ISSUE,
       f.ISSUING_COURT,
       a.ISSUING_CRT_CODE
FROM   AE_APPLICATIONS a, FEES_PAID f
WHERE  F.PROCESS_NUMBER = A.AE_NUMBER
AND    F.PROCESS_TYPE   = 'A'
AND    F.DELETED_FLAG   = 'N'
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."CASE_PARTIES" ("CASE_NUMBER", "PARTY_ROLE_CODE", "REPORTING_PARTY_ROLE_CODE", "CASE_PARTY_NO", "PARTY_ID", "ADDRESS_TYPE_CODE", "CODED_PARTY_NO", "NAME", "ADDRESS_LINE1", "ADDRESS_LINE2", "ADDRESS_LINE3", "ADDRESS_LINE4", "ADDRESS_LINE5", "POSTCODE", "REFERENCE", "TEL_NO", "DX_NUMBER", "DATE_OF_SERVICE_RO", "DATE_OF_SERVICE", "PAYEE_FLAG") AS
  select    cpr.case_number case_number,
    cpr.party_role_code party_role_code,
    decode(pr.reporting_role_code,'OTHER',CPR.PARTY_ROLE_CODE,PR.REPORTING_ROLE_CODE) REPORTING_PARTY_ROLE_CODE,
    cpr.case_party_no case_party_no,
    cpr.party_id party_id,
    ga.address_type_code address_type_code,
    null coded_party_no,
    pty.person_requested_name name,
    ga.address_line1 address_line1,
    ga.address_line2 address_line2,
    ga.address_line3 address_line3,
    ga.address_line4 address_line4,
    ga.address_line5 address_line5,
    ga.postcode postcode,
    cpr.reference reference,
    pty.tel_no tel_no,
    pty.dx_number dx_number,
    cpr.deft_date_of_service_ro date_of_service_ro,
    cpr.deft_date_of_service date_of_service,
    cpr.payee_flag payee_flag
from    case_party_roles cpr,
    parties pty,
    given_addresses ga,
    party_roles pr
where   pty.party_id = cpr.party_id
and pr.party_role_code = cpr.party_role_code
and ga.case_number = cpr.case_number
and ga.party_role_code = cpr.party_role_code
and ga.case_party_no = cpr.case_party_no
and ga.valid_to is null
and     ga.address_type_code IN ('SERVICE','SUBSERV','WORKPLACE','SOLICITOR')
union
/* Coded parties, joined to case_party_roles via party_id */
select  cpr.case_number case_number,
    cpr.party_role_code party_role_code,
    decode(pr.reporting_role_code,'OTHER',CPR.PARTY_ROLE_CODE,PR.REPORTING_ROLE_CODE) REPORTING_PARTY_ROLE_CODE,
    cpr.case_party_no case_party_no,
    cpr.party_id party_id,
    ga.address_type_code address_type_code,
    ncp.code coded_party_no,
    pty.person_requested_name name,
    ga.address_line1 address_line1,
    ga.address_line2 address_line2,
    ga.address_line3 address_line3,
    ga.address_line4 address_line4,
    ga.address_line5 address_line5,
    ga.postcode postcode,
    cpr.reference reference,
    pty.tel_no tel_no,
    pty.dx_number dx_number,
    cpr.deft_date_of_service_ro date_of_service_ro,
    cpr.deft_date_of_service date_of_service,
    cpr.payee_flag payee_flag
from    case_party_roles cpr,
    parties pty,
    given_addresses ga,
        party_roles pr,
    coded_parties ncp
where   pty.party_id = cpr.party_id
and pr.party_role_code = cpr.party_role_code
and ncp.party_id = cpr.party_id
and ga.party_id = cpr.party_id
and ga.valid_to is null
and     ga.address_type_code = 'CODED PARTY'
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."CM_BMS_COMBINED_EVENTS_VIEW" ("AGE_CATEGORY", "BMS_TASK_NUMBER", "TASK_DESCRIPTION", "EVENT_DATE", "ERROR_INDICATOR", "CRT_CODE") AS
  SELECT
    caev.age_category age_category,
    caev.bms_task_number bms_task_number,
    task.task_description task_description,
    caev.event_date event_date,
        caev.deleted_flag error_indicator,
    NVL(caev.creating_court,caev.crt_code) crt_code
 FROM   case_events caev,
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
       coev.error_indicator = 'N'
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."CM_ENF_EVENTS_VIEW" ("EVENT_ID", "AE_RELEASE_DATE", "AE_FINAL_DATE", "AE_DESCRIPTION") AS
  SELECT S.EVENT_ID,
DECODE (C.RELEASE_DATE,NULL,TO_DATE('01-JAN-1900','DD-MON-YYYY'),C.RELEASE_DATE) AE_RELEASE_DATE,
DECODE (C.FINAL_DATE,NULL,TO_DATE('31-DEC-2100','DD-MON-YYYY'),C.FINAL_DATE) AE_FINAL_DATE,
DECODE (C.EVENT_DESCRIPTION, NULL, S.DESCRIPTION, C.EVENT_DESCRIPTION) AE_DESCRIPTION
FROM   CHANGED_EVENTS C, STANDARD_EVENTS S
WHERE  C.STD_EVENT_ID (+) = S.EVENT_ID
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."EXECUTED_WARRANTS" ("WARRANT_NUMBER", "ISSUED_BY", "CURRENTLY_OWNED_BY", "EXECUTED_BY", "WARRANT_ISSUE_DATE", "WARRANT_RETURN_DATE", "RETURN_CODE", "ORIGINAL_WARRANT_NUMBER", "TOTAL_WARRANT", "TOTAL_PAID") AS
  SELECT    w.warrant_number,
    w.issued_by,
    w.currently_owned_by,
        w.executed_by,
    w.warrant_issue_date,
    wr.warrant_return_date,
    wr.return_code,
    w.original_warrant_number,
     nvl(w.warrant_amount,0)    +
         nvl(w.solicitor_costs,0)   +
     nvl(w.land_registry_fee,0) +
         nvl(
              decode(
                      w.local_warrant_number,
                      -- If Home Warrant (l_w_n IS NULL) then calculate fees, else return fee from warrant record
                      null,
                      nvl(sups_reports_pack.f_calculate_warrant_fees(w.warrant_number, w.issued_by) ,0),
                      nvl(w.warrant_fee,0)
                    ),
              0)  total_warrant,
    nvl (SUPS_REPORTS_PACK.f_calculate_warrant_payments
               ( w.warrant_number, w.local_warrant_number, w.issued_by, w.currently_owned_by) ,0 ) total_paid
from    warrant_returns wr,
    warrants w
where   w.warrant_type in ('EXONPLFF', 'EXECUTION', 'AO', 'CONTROL')
and     wr.warrant_return_date = (select min(wr1.warrant_return_date)
                  from warrant_returns wr1,
                  return_codes rt
                  where wr1.warrant_id  = w.warrant_id
                  and wr1.error_indicator = 'N'
                  and wr1.RETURN_CODE_COURT_CODE = rt.ADMIN_COURT_CODE
                  and wr1.return_code = rt.return_code
                  and rt.return_type = 'F')
and wr.error_indicator = 'N'
and nvl(w.bailiff_identifier,0) < 99
and w.warrant_id = wr.warrant_id
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."PARTIES_NO_CPR" ("PARTY_ID", "ADDRESS_TYPE_CODE", "CODED_PARTY_NO", "NAME", "ADDRESS_LINE1", "ADDRESS_LINE2", "ADDRESS_LINE3", "ADDRESS_LINE4", "ADDRESS_LINE5", "POSTCODE", "ALD_SEQ", "CO_NUMBER", "TEL_NO", "DX_NUMBER", "REFERENCE", "PERSON_DOB", "WELSH_IND") AS
  select    pty.party_id party_id,
    ga.address_type_code address_type_code,
    ncp.code coded_party_no,
    pty.person_requested_name name,
    ga.address_line1 address_line1,
    ga.address_line2 address_line2,
    ga.address_line3 address_line3,
    ga.address_line4 address_line4,
    ga.address_line5 address_line5,
    ga.postcode      postcode,
        ga.ald_seq       ald_seq,
        ga.co_number     co_number,
    pty.tel_no tel_no,
    pty.dx_number dx_number,
        ga.reference reference,
        pty.person_dob person_dob,
        pty.welsh_indicator welsh_ind
from    parties pty,
    given_addresses ga,
        coded_parties ncp
where   ga.party_id = pty.party_id
and ga.valid_to is null
and     ga.party_id = ncp.party_id (+)
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."USER_INFORMATION" ("USER_ID", "NAME", "SECTION", "EXTENSION") AS
  SELECT du.user_id user_id,
     du.user_short_name name,
         du.SECTION_FOR_PRINTOUTS SECTION,
     du.extension extension
  FROM DCA_USER du
;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."V_CMAN_PARTIES" ("ADMIN_CRT_CODE", "CASE_NUMBER", "PARTY_ID", "PARTY_ROLE_CODE", "CASE_PARTY_NO", "CODED_PARTY_NO", "PERSON_REQUESTED_NAME", "TEL_NO", "DX_NUMBER", "REFERENCE", "DATE_OF_SERVICE_RO", "DATE_OF_SERVICE", "PAYEE_FLAG", "REPORTING_PARTY_ROLE_CODE") AS
  SELECT   c.admin_crt_code admin_crt_code
            ,cpr.case_number case_number
            ,p.party_id AS party_id
            ,cpr.party_role_code AS party_role_code
            ,cpr.case_party_no AS case_party_no
            ,ncp.code coded_party_no
            ,p.person_requested_name AS person_requested_name
            ,p.tel_no tel_no
            ,p.dx_number dx_number
            ,cpr.REFERENCE REFERENCE
            ,cpr.deft_date_of_service_ro date_of_service_ro
            ,cpr.deft_date_of_service date_of_service
            ,cpr.payee_flag payee_flag
            ,DECODE (pr.reporting_role_code
                    ,'OTHER', cpr.party_role_code
                    ,pr.reporting_role_code) reporting_party_role_code
    FROM     parties p
            ,cases c
            ,case_party_roles cpr
            ,coded_parties ncp
            ,party_roles pr
    WHERE    c.admin_crt_code != 335
    AND      c.case_number = cpr.case_number
    AND      cpr.party_id = p.party_id
    AND      cpr.party_role_code = pr.party_role_code
    AND      cpr.party_id = ncp.party_id(+)
    ORDER BY 1
            ,2
            ,3
            ,4 ;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."V_CMAN_PARTY_ADDRESSES" ("ADMIN_CRT_CODE", "CASE_NUMBER", "CASE_PARTY_NO", "PARTY_ID", "ADDRESS_LINE1", "ADDRESS_LINE2", "ADDRESS_LINE3", "ADDRESS_LINE4", "ADDRESS_LINE5", "POSTCODE", "ADDRESS_TYPE_CODE", "PARTY_ROLE_CODE") AS
  SELECT   c.admin_crt_code admin_crt_code
            ,c.case_number case_number
            ,cpr.case_party_no case_party_no
            ,cpr.party_id party_id
            ,ga.address_line1 address_line1
            ,ga.address_line2 address_line2
            ,ga.address_line3 address_line3
            ,ga.address_line4 address_line4
            ,ga.address_line5 address_line5
            ,ga.postcode postcode
            ,ga.address_type_code address_type_code
            ,cpr.party_role_code party_role_code
    FROM     cases c
            ,given_addresses ga
            ,case_party_roles cpr
    WHERE    c.admin_crt_code != '335'
    AND      cpr.case_number = c.case_number
    AND      ga.valid_to IS NULL
    AND      (   (    DECODE (ga.address_type_code
                             ,'CODED PARTY', 'CODED PARTY'
                             ,ga.address_type_code) = 'CODED PARTY'
                  AND ga.party_id = cpr.party_id)
              OR (    cpr.case_number = ga.case_number
                  AND cpr.case_party_no = ga.case_party_no
                  AND cpr.party_role_code = ga.party_role_code))
    ORDER BY 1
            ,2 ;



  CREATE OR REPLACE FORCE VIEW "CASEMAN"."WARRANT_FEES" ("CASE_NUMBER", "WARRANT_NUMBER", "WARRANT_TYPE", "FEE_AMOUNT", "SOLICITOR_COSTS", "COURT", "FEE_DATE", "WARRANT_ISSUE", "WARRANT_ID", "ISSUED_BY", "CURRENTLY_OWNED_BY", "CO_NUMBER", "LOCAL_WARRANT_NUMBER", "EXECUTED_BY") AS
  SELECT    w.case_number,
    w.warrant_number,
    w.warrant_type,
    NVL( f.amount, 0 )      FEE_AMOUNT,
    NVL( w.solicitor_costs, 0 ) SOLICITOR_COSTS,
    c.name              COURT,
    f.allocation_date       FEE_DATE,
    w.warrant_issue_date        WARRANT_ISSUE,
    w.warrant_id,
    w.issued_by,                    -- v1.1 ADDED
    w.currently_owned_by,               -- v1.2 ADDED
    w.co_number,                    -- v1.3 ADDED
    w.local_warrant_number,             -- v1.3 ADDED
        w.executed_by                                   -- v1.4 ADDED
FROM    warrants    w,
    courts      c,
    fees_paid   f
WHERE   w.executed_by = c.code
AND w.warrant_number = f.process_number
AND w.issued_by = f.issuing_court
AND     w.local_warrant_number IS NULL
AND f.process_type = 'W'
AND     f.deleted_flag = 'N'
;


