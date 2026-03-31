PROMPT ************************************************************************
PROMPT Insert tmp_mcol_mig_event_mapping reference data
PROMPT ************************************************************************

INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(38
	,'AS'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(50
	,'DE'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(52
	,'DC'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(57
	,'DK'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(60
	,'PA'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(72
	,'K1'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(73
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(74
	,'DI'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(75
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(76
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(78
	,'MP'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(79
	,'MP'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(140
	,'V1'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(160
	,'X1'
	);
	
INSERT INTO tmp_mcol_mig_event_mapping
	(std_event_id
	,mcol_type
	)
VALUES
	(620
	,'FR'
	);
	
PROMPT ************************************************************************
PROMPT tmp_mcol_mig_event_mapping reference data inserted
PROMPT ************************************************************************
	
PROMPT ************************************************************************
PROMPT Insert tmp_mcol_mig_status_mapping reference data
PROMPT ************************************************************************

INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('BLANK'
	,'00'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('WITHDRAWN'
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('SETTLED'
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('WRITTEN OFF'
	,'D1'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('DISCONTINUED'
	,'D1'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('STRUCK OUT'
	,'K1'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('SETTLED/WDRN'
	,'WD'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('PAID'
	,'MP'
	);
	
INSERT INTO tmp_mcol_mig_status_mapping
	(claim_status
	,mcol_type
	)
VALUES
	('STAYED'
	,'01'
	);

PROMPT ************************************************************************
PROMPT tmp_mcol_mig_status_mapping reference data inserted
PROMPT ************************************************************************
	
COMMIT;