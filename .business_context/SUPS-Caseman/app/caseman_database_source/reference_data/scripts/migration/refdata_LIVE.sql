-- Project:     SUPS Caseman
-- File:        refdata_DEVINT.sql
-- Author:      Chris Hutt
-- Created:     30 NOV 2006 
-- Description: A fix ref data refresh for the DEVINT environment
--
-- Change History:
-- 

@refdata_refresh_BuildSpecificEnvNeutral.sql
@refdata_EnvSpecificsLIVE.sql

commit;