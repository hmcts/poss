-- Project:     SUPS Caseman
-- File:        refdata_refresh_SpecificToAllMigrationEnvs.sql
-- Author:      Chris Hutt
-- Created:     30 NOV 2006 
-- Description: Run scripts loading reference data which is classified as being specific to
--              migration environments.
--              A 'migration environment' to taken to be:
--              1) DMST
--              2) PreProd
--              3) Live
--              
--
-- Change History:
--

set define off

@mig_courts.sql
@mig_given_addresses.sql
@mig_personalise.sql
@init_personalise.sql


-- NOTE!!
-- system_data.sql contains court 0 details only
@system_data.sql








