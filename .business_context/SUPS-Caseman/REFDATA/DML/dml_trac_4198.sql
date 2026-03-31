WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

SPOOL dml_trac_4198.log

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Adds the necessary SYSTEM_DATA items for the Report Reprints 
|				  changes and updates the ORDER_TYPES table.
|
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
| COMMENTS      Run as CMAN user with table creation privileges.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$         Revision at last change
|
--------------------------------------------------------------------------------*/

DECLARE

	n_pynot_added		PLS_INTEGER := 0;
	n_pysch_added		PLS_INTEGER := 0;
	n_pver_added		PLS_INTEGER := 0;
	n_amr_added			PLS_INTEGER := 0;
	n_ovp_added			PLS_INTEGER := 0;
	n_adh_added			PLS_INTEGER := 0;
	n_ret_added			PLS_INTEGER := 0;

	-- Cursors to determine Live CaseMan Courts missing	required SYSTEM_DATA items
	CURSOR cur_pynot_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'PNOT'
	);
	
	CURSOR cur_pysch_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'PSCH'
	);
	
	CURSOR cur_pver_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'PVER'
	);
	
	CURSOR cur_adh_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'ADH'
	);
	
	CURSOR cur_ovp_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'OVP'
	);
	
	CURSOR cur_ret_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'RET'
	);
	
	CURSOR cur_amr_sysdata 
	IS
	SELECT 	 c.code
	FROM 	 courts c
	WHERE 	 c.sups_centralised_flag = 'Y'
	AND		 c.caseman_inservice = 'Y' 
	AND      c.code NOT IN (
		SELECT sd.admin_court_code
		FROM system_data sd
		WHERE sd.item = 'AMR'
	);
	
BEGIN

	-- Handle CM_PYNOT reference data updates
	dbms_output.put_line('Handle CM_PYNOT reference data updates');
	FOR rec_pynot_court IN cur_pynot_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('PNOT', 1, rec_pynot_court.code);
		
		n_pynot_added := n_pynot_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_pynot_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'Payout Notification Schedules',
		ot.legal_description = 'Payout Notification Schedules',
		ot.file_prefix = 'PNOT',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_PYNOT';
	
	-- Handle CM_PYSCH reference data updates
	dbms_output.put_line('Handle CM_PYSCH reference data updates');
	FOR rec_pysch_court IN cur_pysch_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('PSCH', 1, rec_pysch_court.code);

		n_pysch_added := n_pysch_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_pysch_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'Payable Order Schedules',
		ot.legal_description = 'Payable Order Schedules',
		ot.file_prefix = 'PSCH',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_PYSCH';
	
	-- Handle CM_PVER reference data updates
	dbms_output.put_line('Handle CM_PVER reference data updates');
	FOR rec_pver_court IN cur_pver_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('PVER', 1, rec_pver_court.code);

		n_pver_added := n_pver_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_pver_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'P''through Verification Report',
		ot.legal_description = 'Passthrough Verification Report',
		ot.file_prefix = 'PVER',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_PVER';
	
	-- Handle CM_AMR reference data updates
	dbms_output.put_line('Handle CM_AMR reference data updates');
	FOR rec_amr_court IN cur_amr_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('AMR', 1, rec_amr_court.code);

		n_amr_added := n_amr_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_amr_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'Amendment Verification Report',
		ot.legal_description = 'Amendment Verification Report',
		ot.file_prefix = 'AMR',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_AMR';
	
	-- Handle CM_OVP reference data updates
	dbms_output.put_line('Handle CM_OVP reference data updates');
	FOR rec_ovp_court IN cur_ovp_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('OVP', 1, rec_ovp_court.code);

		n_ovp_added := n_ovp_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_ovp_added || ' records added');

	UPDATE order_types ot
	SET ot.order_description = 'Overpayment Resolution Report',
		ot.legal_description = 'Overpayment Resolution Report',
		ot.file_prefix = 'OVP',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_OVP';
	
	-- Handle CM_ADH reference data updates
	dbms_output.put_line('Handle CM_ADH reference data updates');
	FOR rec_adh_court IN cur_adh_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('ADH', 1, rec_adh_court.code);

		n_adh_added := n_adh_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_adh_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'Ad-Hoc Payout Report',
		ot.legal_description = 'Ad-Hoc Payout Report',
		ot.file_prefix = 'ADH',
		ot.module_group = 'CASH'
	WHERE ot.order_id = 'CM_ADH';
	
	-- Handle CM_RET reference data updates
	dbms_output.put_line('Handle CM_RET reference data updates');
	FOR rec_ret_court IN cur_ret_sysdata
	LOOP
	
		INSERT INTO system_data
		(item, item_value, admin_court_code)
		VALUES ('RET', 1, rec_ret_court.code);

		n_ret_added := n_ret_added + 1;

	END LOOP;

	-- Output how many records have been added as a result
	dbms_output.put_line(n_ret_added || ' records added');
	
	UPDATE order_types ot
	SET ot.order_description = 'Retention Summary Report',
		ot.legal_description = 'Retention Summary Report'
	WHERE ot.order_id = 'CM_RET';

	COMMIT;

END;

/

SPOOL OFF
