-- ICR 0470 : DCA_USER column PRINTER_COURT_CODE added to cater for
-- user being able to print at a court different to his/her 'homer' court.
-- Populated with USER_COURT.COURT_CODE as default value.   
--
-- Chris Hutt 11Feb08
--


update dca_user dca
set dca.printer_court_code =
(select  uc.court_code from user_court uc
where uc.user_id = dca.user_id)
where dca.printer_court_code is null;

commit;