/*-------------------------------------------------------------------------------
|
| FUNCTION      : NEXT_WARRANT_NUMBER
|
| DESCRIPTION   : Retrieves the next warrant number for a CaseMan/CCBC warrant
|				  by converting the next database sequence value into a string.
|				  Warrant number is 8 characters long, the first character represents
|				  the application that issues the warrant ('1' for CaseMan/CCBC),
|				  the next character represents the enforcement letter and the final
|				  six characters are a numeric sequence.
|
| PARAMETERS    : None
|
| RETURNS       : VARCHAR2
|
--------------------------------------------------------------------------------*/ 

CREATE OR REPLACE FUNCTION "NEXT_WARRANT_NUMBER"
RETURN VARCHAR2 IS

  TYPE array_t IS varray(20) OF VARCHAR2(1);
  enforcement_letters array_t := array_t('A','C','D','E','F','G','H','J','K','M','N','P','Q','R','T','V','W','X','Y','Z');
  
  V_OUTPUT VARCHAR2(8);
  V_NEXT_SEQUENCE NUMBER;
  V_TEMP NUMBER;

BEGIN
  
	-- Get the next database sequence value and convert it into a warrant number
	SELECT WARRANT_NUMBER_SEQUENCE.NEXTVAL 
	INTO V_NEXT_SEQUENCE 
	FROM DUAL;

	-- Loop through the available enforcement letters in the array
	V_TEMP := V_NEXT_SEQUENCE;
	FOR i IN 1 .. enforcement_letters.COUNT LOOP

		V_TEMP := V_TEMP - 1000000;
		IF V_TEMP < 0 THEN
			-- Generate the next number, first character is unique to CaseMan/CCBC, second is the enforcement letter
			-- based upon the loop iteration, final six characters are the next value in the database sequence left
			-- padded with zeros.
			V_OUTPUT := '1' || enforcement_letters(i) || LPAD(TO_CHAR(MOD(V_NEXT_SEQUENCE,1000000)), 6, '0');
			EXIT;

		END IF;

	END LOOP;

	-- Return the generated warrant number
	RETURN V_OUTPUT;
	
EXCEPTION
	WHEN OTHERS THEN RAISE;

END NEXT_WARRANT_NUMBER;
/