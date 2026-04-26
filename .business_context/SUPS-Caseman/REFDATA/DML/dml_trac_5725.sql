WHENEVER SQLERROR EXIT SQL.SQLCODE ROLLBACK
WHENEVER OSERROR EXIT FAILURE

SET SERVEROUT ON
SET TERMOUT   ON
SET VERIFY    OFF

/*-------------------------------------------------------------------------------
|
| $HeadURL:$  
|
| SYNOPSIS      :   This script applies reference data changes for P883 output
|
| $Author:$         Author of last commit
|
| CLIENT        :   Ministry of Justice
|
| COPYRIGHT     :   (c) 2014 CGI Limited.
|                   This file contains information which is confidential and of
|                   value to CGI. It may be used only for the specific purpose for
|                   which it has been provided. CGI's prior written consent is
|                   required before any part is reproduced.
|
| COMMENTS      : 
|
|---------------------------------------------------------------------------------
|
| $Revision:$   Revision of last commit
| $Date:$       Date of last commit
| $Id:$         Revision at last change
|
--------------------------------------------------------------------------------*/

SPOOL dml_trac_5725.log

DECLARE

	new_od_seq	NUMBER;
	n64_od_seq	NUMBER;

BEGIN

	-- Change the existing paragraph to move it down the ordering
	UPDATE output_details
	SET code = 4
	WHERE order_type_id = 'P883'
	AND code = 3;

	-- Change the second paragraph to remove the '(see attached)' text
	UPDATE output_details
	SET item1 = 'The court has made a suspended attachment of earnings order (AEO)(see below) at the judgment debtor''s request. The judgment debtor should pay you direct. If the judgment debtor does not pay you, or pays and then stops, use form N446 (request for reissue of post-judgment process (other than warrant)) to ask the court to send the AEO to the employer.'
	WHERE order_type_id = 'P883'
	AND code = 2;

	-- Retrieve the next OUTPUT_DETAILS sequence
	SELECT output_detail_seq.NEXTVAL INTO new_od_seq FROM DUAL;

	-- Insert new paragraph for the P883
	INSERT INTO output_details
		(od_seq
		,order_type_id
		,layout_group
		,code
		,format_style
		,item1
		,font1
		,item2
		,font2
		,item3
		,font3
		,item4
		,font4)
	VALUES
		(new_od_seq
		,'P883'
		,'10'
		,3
		,'10'
		,'The court orders'
		,'20'
		,'that the attachment of earnings order be suspended and not enforced so long as the judgment debtor punctually pays the judgment creditor instalments of CMF_INSTALL_AMOUNT for every CMF_INSTALL_FREQ, the first instalment to reach the judgment creditor'
		,'10'
		,'by'
		,'40'
		,'CMF_FIRST_INSTALL_DATE until the sum of CMF_AE_OUTSTANDING_BAL, the total amount outstanding on this case has been paid.'
		,'10');
	
	-- Get the OUTPUT_DETAILS sequence for the N64 paragraph 2
	SELECT od_seq
	INTO n64_od_seq
	FROM output_details
	WHERE order_type_id = 'N64'
	AND code = 2;
	
	-- Copy the SUB_DETAIL_VARIABLES for the N64 paragraph 2 for P883
	INSERT INTO sub_detail_variables
	SELECT sub_detail_var_seq.NEXTVAL
		  ,new_od_seq
		  ,sdv.sub_item_number
		  ,sdv.variable_code
	FROM sub_detail_variables sdv
	WHERE sdv.od_seq = n64_od_seq;
	
COMMIT;

END;

/

SPOOL OFF