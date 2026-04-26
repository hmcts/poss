-- Project:     SUPS Caseman
-- File:        refdata_EnvSpecificsPreProd.sql
-- Author:      Chris Hutt
-- Created:     30 NOV 2006 
-- Description: Run scripts loading reference data which is classified as being specific to
--              the PreProduction environment 
--		
--
-- Change History:
-- 

set define off

exec set_sups_app_ctx('a','b','c');

@refdata_refresh_SpecificToAllMigrationEnvs.sql





