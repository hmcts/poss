-- Project:     SUPS Caseman
-- File:        refresh_omr_specifics.sql
-- Author:      Chris Hutt
-- Created:     24 july 2007
-- Description: Run refresh scripts specific to the Caseman Official Maintenace Release (7.215).
--             
--
-- Change History:
-- 



set define off

exec set_sups_app_ctx('a','b','c');

@ccbc_ref_codes.sql
@co_event_validations.sql
@audit_config.sql
@tasks.sql
@order_types.sql
@return_codes.sql


