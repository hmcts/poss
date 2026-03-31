Prompt Trigger MCOL_NEW_CREDITOR;

CREATE OR REPLACE TRIGGER "MCOL_NEW_CREDITOR"
BEFORE INSERT ON "MCOL_DATA"
FOR EACH ROW
DECLARE
  
	v_cred_code NUMBER(4);
  
BEGIN

	IF inserting
	THEN
		-- Determine if the creditor column is blank
		IF ( NVL(:OLD."NEW_CREDITOR",:NEW."NEW_CREDITOR") IS NULL )
		THEN
			
			-- Retrieve the creditor code
			SELECT c.cred_code
			INTO v_cred_code
			FROM cases c
			WHERE c.case_number = NVL(:OLD."CLAIM_NUMBER",:NEW."CLAIM_NUMBER");
			
			:NEW."NEW_CREDITOR" := v_cred_code;

		END IF;	-- End Determine if the creditor column is blank

	END IF;	-- End if inserting
	
EXCEPTION
	WHEN NO_DATA_FOUND THEN
		:NEW."NEW_CREDITOR" := :OLD."NEW_CREDITOR";
	WHEN OTHERS THEN
		:NEW."NEW_CREDITOR" := :OLD."NEW_CREDITOR";
  
END;
/
SHOW ERRORS;