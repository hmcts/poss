Prompt Trigger MCOL_BAR_JUDGMENT;

CREATE OR REPLACE TRIGGER "MCOL_BAR_JUDGMENT"
AFTER UPDATE ON "CASE_PARTY_ROLES"
FOR EACH ROW
DECLARE
  
	v_court_code NUMBER(3);
	v_mcol_type VARCHAR2(2);
	v_cred_code NUMBER(4);
  
BEGIN

	IF updating
	THEN
		-- Determine if the Bar on Judgment has changed
		IF (:OLD."DEFT_BAR_JUDGMENT" != :NEW."DEFT_BAR_JUDGMENT")
		OR (:OLD."DEFT_BAR_JUDGMENT" IS NULL AND :NEW."DEFT_BAR_JUDGMENT" IS NOT NULL)
		OR (:OLD."DEFT_BAR_JUDGMENT" IS NOT NULL AND :NEW."DEFT_BAR_JUDGMENT" IS NULL)
		THEN
			
			-- Retrieve case owning court for the case in question
			SELECT c.admin_crt_code, c.cred_code
			INTO v_court_code, v_cred_code
			FROM cases c
			WHERE c.case_number = :OLD."CASE_NUMBER";
			
			IF :OLD."PARTY_ROLE_CODE" = 'DEFENDANT' AND v_court_code = 335 THEN
			
				-- Determine which MCOL_DATA type code to use
				IF :new."DEFT_BAR_JUDGMENT" = 'Y' THEN
					v_mcol_type := 'I1';
				ELSE
					v_mcol_type := 'I0';
				END IF;

				-- Insert MCOL_DATA record
				INSERT INTO mcol_data (
					claim_number
					,deft_id
					,type
					,event_date
					,new_creditor)
				VALUES (
					:OLD."CASE_NUMBER"
					,:OLD."CASE_PARTY_NO"
					,v_mcol_type
					,TRUNC(SYSDATE)
					,v_cred_code
				);
		
			END IF;	-- End if Defendant on CCBC case

		END IF;	-- End if DEFT_BAR_JUDGMENT changed

	END IF;	-- End if updating
  
END;
/
SHOW ERRORS;