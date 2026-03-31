-- cREATE A 'CFO' ITEM IN THE SYSTEM_DATA TABLE FOR COURTS WHICH DO NOT ALREADY HAVE AN ENTRY
--
-- CJH 16 JAN 06
-- ******************************************************************************************



INSERT INTO SYSTEM_DATA (
	ITEM 
, 	ITEM_VALUE
, 	ADMIN_COURT_CODE )
SELECT 
	'CFO' 	AS ITEM
, 	'1' 	AS ITEM_VALUE 
, 	C.CODE 	AS ADMIN_COURT_CODE 
FROM 	COURTS C 
WHERE 	C.CODE NOT IN (	SELECT 
				ADMIN_COURT_CODE 
			FROM 
				SYSTEM_DATA SD 
			WHERE 	ADMIN_COURT_CODE = C.CODE
			AND 	ITEM ='CFO'  );





