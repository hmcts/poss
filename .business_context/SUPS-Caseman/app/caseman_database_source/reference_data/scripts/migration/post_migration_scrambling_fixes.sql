------------ fix defect 668 make column upper case--------------------------------
update coded_parties set PERSON_REQUESTED_NAME=UPPER(PERSON_REQUESTED_NAME);

------------ fix defect 662 set colums to char 1----------------------------------
update AE_EVENTS set REPORT_VALUE_1='N', REPORT_VALUE_2='Y' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '880'; 
update AE_EVENTS set REPORT_VALUE_1='Y', REPORT_VALUE_2='Y' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '881';
update AE_EVENTS set REPORT_VALUE_1='Y', REPORT_VALUE_2='Y' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '882';
update AE_EVENTS set REPORT_VALUE_1='N', REPORT_VALUE_2='N' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '897';
update AE_EVENTS set REPORT_VALUE_1='N', REPORT_VALUE_2='N' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '898';
update AE_EVENTS set REPORT_VALUE_1='N', REPORT_VALUE_2='N' , REPORT_VALUE_3='Y'
where STD_EVENT_ID = '899';

------------ fix defect 684 update coded parties address in in payments table ----

UPDATE PAYMENTS p
SET 
(p.PAYEE_ADDR_1, p.PAYEE_ADDR_2, p.PAYEE_ADDR_3, p.PAYEE_ADDR_4, p.PAYEE_ADDR_5, p.PAYEE_postcode)
=
(select cp.ADDRESS_LINE1, cp.ADDRESS_LINE2, cp.ADDRESS_LINE3, cp.ADDRESS_LINE4, cp.ADDRESS_LINE5, cp.POSTCODE
from coded_parties cp where cp.party_id = p.payee_id)
where p.payee_id is not null
and p.payout_date is null
and p.payee_id in 
(select c.party_id from coded_parties c
where c.party_id = p.payee_id);