PROMPT ************************************************************************
PROMPT Insert CCBC_REF_CODES user roles reference data
PROMPT ************************************************************************

INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('viewOnly'
    ,'USER_ROLE'
	,'View Only'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('medium'
    ,'USER_ROLE'
	,'Medium'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('high'
    ,'USER_ROLE'
	,'High'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('wcSuper'
    ,'USER_ROLE'
	,'Warrant Control Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('scSuper'
    ,'USER_ROLE'
	,'Suitors Cash Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('bmsSuper'
    ,'USER_ROLE'
	,'BMS Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('aeSuper'
    ,'USER_ROLE'
	,'Attachment of Earnings Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('dmSuper'
    ,'USER_ROLE'
	,'Diary Manager Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('cpSuper'
    ,'USER_ROLE'
	,'Coded Party Supervisor'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('ccbcMan'
    ,'USER_ROLE'
	,'CCBC Manager'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('ccbcUser'
    ,'USER_ROLE'
	,'CCBC User'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('ccbcSGB2'
    ,'USER_ROLE'
	,'CCBC SGB II'
    );
	
INSERT INTO ccbc_ref_codes
    (rv_low_value
    ,rv_domain
	,rv_meaning
    )
VALUES
    ('ccbcTape'
    ,'USER_ROLE'
	,'CCBC Tape Logger'
    );
 

PROMPT ************************************************************************
PROMPT Inserting into ORDER_TYPES table
PROMPT ************************************************************************

INSERT INTO order_types
	(order_id
	,order_description
  ,display_order_id
  ,document_type
  ,legal_description
  ,module_name
  ,printer_type
  ,report_type
  ,tray)
VALUES
  ('CM_USER_LST'
  ,'Produce Court User List'
  ,'USER'
  ,'N'
  ,'Produce Court User List'
  ,'CM_USER_LST'
  ,'P'
  ,'R25'
  ,'2');
    
COMMIT;