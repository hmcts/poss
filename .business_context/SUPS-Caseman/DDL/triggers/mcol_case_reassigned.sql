Prompt Trigger MCOL_CASE_REASSIGNED;

CREATE OR REPLACE TRIGGER "MCOL_CASE_REASSIGNED"
AFTER UPDATE ON "CASES"
FOR EACH ROW
DECLARE
  
	v_court_code NUMBER(3);
  
BEGIN

	IF updating
	THEN
		-- Determine if the Creditor Code has changed
		IF (:OLD."CRED_CODE" != :NEW."CRED_CODE")
		OR (:OLD."CRED_CODE" IS NULL AND :NEW."CRED_CODE" IS NOT NULL)
		OR (:OLD."CRED_CODE" IS NOT NULL AND :NEW."CRED_CODE" IS NULL)
		THEN
			
			-- Check only CCBC (Non MCOL) Case
			IF :OLD."CRED_CODE" != 1999 AND :NEW."CRED_CODE" != 1999 AND :OLD."ADMIN_CRT_CODE" = 335 THEN

				-- Insert MCOL_DATA record
				INSERT INTO mcol_data (
					claim_number
					,type
					,event_date
					,previous_creditor
					,new_creditor)
				VALUES (
					:OLD."CASE_NUMBER"
					,'OC'
					,TRUNC(SYSDATE)
					,:OLD."CRED_CODE"
					,:NEW."CRED_CODE"
				);
		
			END IF;	-- End if CCBC case

		END IF;	-- End if CRED_CODE changed

	END IF;	-- End if updating
  
END;
/
SHOW ERRORS;