-- Project:     SUPS Caseman
-- File:        init_personalise.sql
-- Author:      Chris Hutt
-- Created:     20 Feb 2006 
-- Description: 
--              This PL/SQL will created one PERSONALISE row (with a defualt set of values)
--              for each court that does not already have one.
--              
--
-- Change History:

INSERT INTO PERSONALISE ( 
	CRT_CODE,
	ACCOUNT_TYPE,
	ACCOUNTING_CODE)
SELECT
	C.CODE 		AS CRT_CODE ,
        'COMBINED' 	AS ACCOUNT_TYPE ,
        '0' 		AS ACCOUNTING_CODE 
FROM COURTS C 
WHERE C.CODE NOT IN (	SELECT 
				P.CRT_CODE 
			FROM 
				PERSONALISE P 
			WHERE 
				P.CRT_CODE = C.CODE);
	
COMMIT;

/