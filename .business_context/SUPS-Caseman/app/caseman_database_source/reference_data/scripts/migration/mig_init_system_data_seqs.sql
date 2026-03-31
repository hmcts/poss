-- Project:     SUPS Caseman
-- File:        init_suitors_cash_seqs.sql
-- Author:      Steve Blair
-- Created:     14-Dec-2005 
-- Description: Suitors Cash reports are identified by a unique value prefixed with the report ID.
--              The report IDs are PREC, BVER, CVER, AMR, ADH, OVP.
--              The sequence number is derived from a row in the table SYSTEM_DATA.
--              There is one row per Court, identified by the column ITEM = REPORTID.
--              This PL/SQL will created one SYSTEM_DATA row for each court that does not already have one.
--
-- Change History:
-- 18/01/2006 Phil Haferer: Added the item CADU, which is used by Complete Payout.
-- 25/01/2006 Steve Blair:  Added TRANS_NO as transaction numbers now court specific.
-- 02/02/2006 Chris Hutt:   Added AFLS, AUTH, BPRC, CAPS, CEVT, CFEE, CFO, CMON, DCS, DSUM, OBL,
--                                PPL, PSUM, RET (from list supplied by Mike Brock)
-- 03/02/2006 Steve Blair:  Changed TRANS_NO to TRANSACTION NO for consistancy with legacy.
-- 22/02/2006 Chris Hutt:   CO_R8_LAST_EVENT added (not a sequence but similar in that needs to be initialised
--                                to '0' if doesnt exist already)
-- 22/06/06 Chris Hutt - LIST REDRAFTED IN LINE WITH SYSTEM_DATA RATIONALISATION
-- 18/01/07 Chris Hutt - doctored version produced for migration

DECLARE
	ct_code		courts.code%type;
	item_val	system_data.item_value%type;
		
	CURSOR c_courts(p_item_name SYSTEM_DATA.ITEM%type) IS
	SELECT	CT.CODE
	FROM	COURTS CT
    WHERE	CT.SUPS_CENTRALISED_FLAG = 'N'
	AND     CT.CODE != '0'
	AND     CT.CODE NOT IN (
			SELECT	SD.ADMIN_COURT_CODE
			FROM	SYSTEM_DATA SD
			WHERE	ITEM = p_item_name
		);
		
	CURSOR c_transNo(p_court_code SYSTEM_DATA.ADMIN_COURT_CODE%type) IS
	SELECT	MAX(TRANSACTION_NUMBER)
	FROM	PAYMENTS
	WHERE	ADMIN_COURT_CODE = p_court_code;
	
PROCEDURE createSequences(p_item_name IN SYSTEM_DATA.ITEM%type, p_item_value IN SYSTEM_DATA.ITEM_VALUE%type) AS
BEGIN
	OPEN c_courts(p_item_name);
	LOOP
	FETCH c_courts INTO ct_code;
		IF c_courts%NOTFOUND THEN
			CLOSE c_courts;
			EXIT;
		ELSE
			INSERT INTO	SYSTEM_DATA
					(ITEM, ITEM_VALUE, ITEM_VALUE_CURRENCY, ADMIN_COURT_CODE)
			VALUES		(p_item_name, p_item_value, NULL, ct_code);
		END IF;
	END LOOP;
END createSequences;

PROCEDURE createTransNoSeqs(p_item_name IN SYSTEM_DATA.ITEM%type) AS
BEGIN
	DELETE
	FROM	SYSTEM_DATA
	WHERE	ITEM = 'TRANSACTION NO';
	
	OPEN c_courts(p_item_name);
	LOOP
	FETCH c_courts INTO ct_code;
		IF c_courts%NOTFOUND THEN
			CLOSE c_courts;			
			EXIT;
		ELSE
			OPEN c_transNo(ct_code);
			FETCH c_transNo INTO item_val;
			INSERT INTO	SYSTEM_DATA
					(ITEM, ITEM_VALUE, ITEM_VALUE_CURRENCY, ADMIN_COURT_CODE)
			VALUES		(p_item_name, NVL(item_val, 0) + 1, NULL, ct_code);
			CLOSE c_transNo;
		END IF;
	END LOOP;
END createTransNoSeqs;


BEGIN


	createSequences('CVET', 1);
	createSequences('OBL', 1);

	
	COMMIT;
	
END;
/