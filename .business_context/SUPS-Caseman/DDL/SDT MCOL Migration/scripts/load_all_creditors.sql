DECLARE
	
BEGIN

	INSERT INTO tmp_mcol_mig_info
		(cred_code
		,migration_complete)
	SELECT 	code, 'N'
	FROM	national_coded_parties;
	
	COMMIT;

END;

/