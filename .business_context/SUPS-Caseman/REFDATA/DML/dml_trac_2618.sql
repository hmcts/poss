WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL$:
|
| SYNOPSIS      : Script to insert new refernce data entries in the order_types 
|                 and output_details tables.  The entries are used for output by 
|                 the new Welsh Translation Cover Letter.
|                 Welsh Language Requirements. Trac #2618.
|
| $Author$:       Author of last commit
|
| CLIENT        : Ministry of Justice
|
| COPYRIGHT     : (c) 2010 Logica UK Limited.
|                 This file contains information which is confidential and of
|                 value to Logica. It may be used only for the specific purpose for
|                 which it has been provided. Logica's prior written consent is
|                 required before any part is reproduced.
|
|---------------------------------------------------------------------------------
|
| $Rev$:          Revision of last commit
| $Date$:         Date of last commit
| $Id$:         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_2618.log

PROMPT ************************************************************************
PROMPT Insert the parent entry on order_types
PROMPT ************************************************************************

insert into order_types ( ORDER_ID, ORDER_DESCRIPTION, USER_EDIT, DISPLAY_ORDER_ID, DOCUMENT_TYPE, DOC_PAYEE, DOC_RECIPIENT, FILE_EXTENSION, FILE_PREFIX, LEGAL_DESCRIPTION, MODULE_GROUP, MODULE_NAME, NO_OF_COPIES, PREVIOUS_ORDER_ID, PRINTER_TYPE, REPORT_TYPE, SELECTION_CRITERIA, SERVICE_TYPE, MULT_ADDR_FLAG, TRAY)
values ( 'WELSH_COVER_LETTER', 'Welsh Cover Letter', '', 'WCL', 'N', '', '', '', '', 'Welsh Language Translation Cover Letter', '', 'CM_STD_DOC', null, '', 'P', 'R25', '', '', '', '1');


PROMPT ************************************************************************
PROMPT Insert the child entries on output_details
PROMPT ************************************************************************

insert into output_details (OD_SEQ, ORDER_TYPE_ID, LAYOUT_GROUP, CODE, FORMAT_STYLE, ITEM1, FONT1, ITEM2, FONT2, ITEM3, FONT3, ITEM4, FONT4, ITEM5, FONT5, ITEM6, FONT6, ITEM7, FONT7, ITEM8, FONT8, ITEM9, FONT9, ITEM10, FONT10)
values 
(OUTPUT_DETAIL_SEQ.NEXTVAL, 'WELSH_COVER_LETTER', '10', 1, '10', 'Welsh Language Unit', '10', 'Caernarfon Criminal Justice Centre', '10', 'Llanberis Road', '10', 'Caernarfon', '10', 'Gwynedd', '10', '', '', 'LL55 2DF', '10', 'Minicom VII ', '10', '(Gateshead) 0191 4781476 ', '10', '(Helpline for the deaf and hard of hearing)', '20');

insert into output_details (OD_SEQ, ORDER_TYPE_ID, LAYOUT_GROUP, CODE, FORMAT_STYLE, ITEM1, FONT1, ITEM2, FONT2, ITEM3, FONT3, ITEM4, FONT4, ITEM5, FONT5, ITEM6, FONT6, ITEM7, FONT7, ITEM8, FONT8, ITEM9, FONT9, ITEM10, FONT10)
values (OUTPUT_DETAIL_SEQ.NEXTVAL, 'WELSH_COVER_LETTER', '10', 2, '20', 'www.hmcourts-service.gov.uk ', '10', 'Please find enclosed documents for translation in the above named case.', '10', 'Name and Address of Party to be served', '10', 'Date by which party should be served: ', '10', 'This request form and document is to be faxed to the Welsh Language Unit.', '10', 'Fax No:  01286 669797 ', '10', 'Enquiries:  01286 669800', '10', '', '', '', '', '', '');

COMMIT;

SPOOL OFF

EXIT