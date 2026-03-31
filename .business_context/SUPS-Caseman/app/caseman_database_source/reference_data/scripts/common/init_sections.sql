-- Project:     SUPS Caseman
-- File:        init_sections.sql
-- Author:      Chris Hutt
-- Created:     28 nov 2006 
-- Description: 
--              This PL/SQL will created one SECTIONS row called 'SYSTEM TRANSFER SECTION'
--              for each court that does not already have one.
--              
--
-- Change History:
-- Chris Hutt 10/1/07 - should be 'SYSTEM TRANSFER SECTION' , not 'SYSTEM TRANSFER SERVICE'

INSERT INTO SECTIONS ( 
	ADMIN_COURT_CODE,
	SECTION_NAME
)
SELECT
	C.CODE 				AS ADMIN_COURT_CODE ,
        'SYSTEM TRANSFER SECTION' 	AS SECTION_NAME
FROM COURTS C 
WHERE C.CODE NOT IN (	SELECT 
				P.ADMIN_COURT_CODE 
			FROM 
				SECTIONS P 
			WHERE 
				P.ADMIN_COURT_CODE = C.CODE
			AND 	P.SECTION_NAME = 'SYSTEM TRANSFER SECTION');
	
COMMIT;

/