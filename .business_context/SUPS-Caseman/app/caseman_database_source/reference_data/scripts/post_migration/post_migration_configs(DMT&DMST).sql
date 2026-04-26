-- post_migration_configs.sql
-- 1. Loads user-reference data specific to DMST environments (admin roles - aka managers)
-- 2. Sets up printer allocation
-- Based on SQL supplied by Amit Narang, Sarndip Sandhu
--
-- Chris Hutt 23 Oct 2006
--
-- Change history
-- Chris Hutt 30 nov 2006 : @init_sections.sql added

set define off


--DEED PACK NUMBERS
UPDATE COURTS SET DEED_PACK_NUMBER = '000233' WHERE CODE= '180';
UPDATE COURTS SET DEED_PACK_NUMBER = '000676' WHERE CODE= '282';
UPDATE COURTS SET DEED_PACK_NUMBER = '000649' WHERE CODE= '378';

-- SECTIONS REQUIRED TO SUPPORT THE ADMIN USERS
@mig_sections.sql

-- SECTIONS TO SUPPORT TRANSFERS
@init_sections.sql

-- CREATE THE ADMIN USERS (AKA 'MANAGERS')
@mig_dca_user.sql
@mig_user_court.sql
@mig_user_role.sql



-- PRINTER ALLOCATIONS
UPDATE COURTS SET FAP_ID = 'CSF20099' , DEFAULT_PRINTER = 'CSP00001' WHERE CODE= '180';
UPDATE COURTS SET FAP_ID = 'CSF20099' , DEFAULT_PRINTER = 'CSP00001' WHERE CODE= '282';
UPDATE COURTS SET FAP_ID = 'CSF20099' , DEFAULT_PRINTER = 'CSP00001' WHERE CODE= '378';

UPDATE DCA_USER SET USER_DEFAULT_PRINTER = 'CSP00001';

COMMIT;






