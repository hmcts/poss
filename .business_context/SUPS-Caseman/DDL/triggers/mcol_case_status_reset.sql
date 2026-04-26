Prompt Trigger MCOL_CASE_STATUS_RESET;

CREATE OR REPLACE TRIGGER "MCOL_CASE_STATUS_RESET"
AFTER UPDATE ON "CASES"
FOR EACH ROW
DECLARE
  
	v_court_code NUMBER(3);
	v_mcol_type  VARCHAR2(2);
  
BEGIN

	IF updating
	THEN
		-- Determine if the Case status has been changed to NULL
		IF :OLD."STATUS" IS NOT NULL AND :NEW."STATUS" IS NULL
		THEN
			
			-- Check a CCBC owned Case (regardless of Creditor Code)
			IF :OLD."ADMIN_CRT_CODE" = 335 THEN
			
				v_mcol_type := 'XX';
			
				IF :OLD."STATUS" = 'WITHDRAWN' THEN
					v_mcol_type := 'H0';
				END IF;
				
				IF :OLD."STATUS" = 'SETTLED' THEN
					v_mcol_type := 'H0';
				END IF;
				
				IF :OLD."STATUS" = 'WRITTEN OFF' THEN
					v_mcol_type := 'B0';
				END IF;
				
				IF :OLD."STATUS" = 'DISCONTINUED' THEN
					v_mcol_type := 'B0';
				END IF;
				
				IF :OLD."STATUS" = 'STRUCK OUT' THEN
					v_mcol_type := 'K0';
				END IF;
				
				IF :OLD."STATUS" = 'SETTLED/WDRN' THEN
					v_mcol_type := 'B0';
				END IF;
				
				IF :OLD."STATUS" = 'PAID' THEN
					v_mcol_type := 'M0';
				END IF;
				
				IF v_mcol_type != 'XX' THEN

					-- Case changed from an MCOL-related status to NULL
					-- Insert MCOL_DATA record
					INSERT INTO mcol_data (
						claim_number
						,type
						,event_date
						,new_creditor)
					VALUES (
						:OLD."CASE_NUMBER"
						,v_mcol_type
						,TRUNC(SYSDATE)
						,:OLD."CRED_CODE"
					);
				
				END IF;	-- End if Case changed from a MCOL-related status to NULL
		
			END IF;	-- End if CCBC owned case 

		END IF;	-- End if STATUS changed from NOT NULL to NULL

	END IF;	-- End if updating
  
END;
/
SHOW ERRORS;