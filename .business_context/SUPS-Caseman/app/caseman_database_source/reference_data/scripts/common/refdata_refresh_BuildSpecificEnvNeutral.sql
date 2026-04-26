-- Project:     SUPS Caseman
-- File:        refdata_refresh_BuildSpecificEnvNeutral.sql
-- Author:      Chris Hutt
-- Created:     29 NOV 2006 
-- Description: Run scripts loading reference data which is classified as being specific to
--              a build and environmentally neutral.
--
-- Change History:
-- 



set define off

exec set_sups_app_ctx('a','b','c');

@address_types.sql
@age_category.sql
@audit_config.sql
@ccbc_ref_codes.sql
@currency.sql
@document_variables.sql
@enforcement_letters.sql
@item_details.sql
@non_working_days.sql
@obligation_events.sql
@obligation_types.sql
@obligation_rules.sql
@order_types.sql
@output_details.sql
@party_roles.sql
@party_types.sql
@per_details.sql
@return_codes.sql
@sub_detail_variables.sql
@task_types.sql
@tasks.sql
@valid_values.sql
@reject_reasons.sql
@ccbc_media_file_types.sql


-- ALL STANDARD EVENTS AND ASSOCIATES
@standard_events.sql
@standard_events_3&4_updates.sql
@standard_events_5&6_updates.sql
@standard_events_7_updates.sql
@changed_events.sql
@co_event_validations.sql
@pre_req_events.sql
@event_outputs.sql

@schemascripts_update.sql



