-- Project:     SUPS Caseman
-- File:        create_court_sections.sql
-- Author:      Chris Hutt
-- Created:     1 feb 2006
-- Description: Creates series of sections per court
--
-- Change History:
-- Chris Hutt 30 Nov 2006: Adding 'SYSTEM TRANSFER SECTION'
--			   Changing 'JUDGEMENTS/ORDERS' to 'JUDGMENTS/ORDERS'
-- Chris Hutt 29 jan 2006: This version tailored for go-live. 
--                         'SYSTEM TRANSFER SECTION' is the only section created (for all courts)

DECLARE
	ct_code		courts.code%type;
		
	CURSOR c_courts(p_section_name IN SECTIONS.SECTION_NAME%type) IS
	SELECT	CT.CODE
	FROM	COURTS CT
	WHERE	CT.CODE NOT IN (
			SELECT	S.ADMIN_COURT_CODE
			FROM	SECTIONS S
			WHERE	SECTION_NAME = p_section_name
		);
	
PROCEDURE createSection(p_section_name IN SECTIONS.SECTION_NAME%type) AS
BEGIN
	OPEN c_courts(p_section_name);
	LOOP
	FETCH c_courts INTO ct_code;
		IF c_courts%NOTFOUND THEN
			CLOSE c_courts;
			EXIT;
		ELSE
			INSERT INTO	SECTIONS
					(SECTION_NAME , ADMIN_COURT_CODE)
			VALUES		(p_section_name , ct_code);
		END IF;
	END LOOP;
END createSection;

BEGIN
	
	createSection('SYSTEM TRANSFER SECTION');


	COMMIT;
END;
/