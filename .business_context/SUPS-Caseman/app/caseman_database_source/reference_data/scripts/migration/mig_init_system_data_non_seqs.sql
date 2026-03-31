-- Project:     SUPS Caseman
-- File:        init_system_data_non_seqs.sql
-- Author:      Chris Hutt
-- Created:     6 feb 2006 
-- Description: Set up SYSTEM_DATA ITEM rows for non sequential items identified as being used in legacy but NOT in SUPS caseman
--
-- Change History:
-- ---------------
-- v1.1 CJH 03/03/2006 BMS_LIVE_DATE & CO_RUNDATE corrected
-- v1.2 CJH 08/03/2006 CFO RUNDATE, SUPS_LIVE_DATE, CP RUNDATE and AE_GOLIVE_DATE added
-- v1.3 CJH 22/05/2006 CO_RUNDATE and AE_RUNDATE replaced with 'CO RUNDATE' and 'AE RUNDATE'
-- v1.4 CJH 26/05/2006 SEVICE_PERIOD, CO_RESPONSE_PERIOD, RESPONSE_PERIOD - underscores removed (TD3462)
-- 22/06/06 Chris Hutt - limited to courts where SUPS_CENTRALISED_FLAG = 'Y'
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

	
PROCEDURE createCurrencyItems(	p_item_name IN SYSTEM_DATA.ITEM%type, p_item_value IN SYSTEM_DATA.ITEM_VALUE%type) AS
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
			VALUES		(p_item_name, p_item_value, 'GBP', ct_code);
		END IF;
	END LOOP;
END createCurrencyItems;

PROCEDURE createNonCurrencyItems(	p_item_name IN SYSTEM_DATA.ITEM%type, p_item_value IN SYSTEM_DATA.ITEM_VALUE%type) AS
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
END createNonCurrencyItems;

PROCEDURE clearUp( p_item_name IN SYSTEM_DATA.ITEM%type ) AS
BEGIN
    DELETE FROM SYSTEM_DATA
    WHERE ITEM = p_item_name;
END clearUp;

BEGIN


	createNonCurrencyItems('CP RUNDATE', '20050728');
	
	
	COMMIT;
END;
/