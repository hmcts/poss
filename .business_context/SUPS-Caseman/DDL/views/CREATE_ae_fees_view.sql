/* Script to recreate view ae_fees. column case_number had been left out on latest build
  DATE 5-SEP-2005

Version   Date     Author     Description
  1.1    12/05/06    SW       Defect 3347 add reference to deleted flag
  1.2	 29/07/10	 CV		  Trac 2626, included the Fee issuing court and AE issuing court

*/
CREATE OR REPLACE VIEW AE_FEES
(AE_NUMBER, CASE_NUMBER, AE_TYPE, FEE_AMOUNT, FEE_DATE, AE_ISSUE_DATE, FEE_COURT_CODE, AE_COURT_CODE)
AS
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
AND    F.DELETED_FLAG   = 'N';
