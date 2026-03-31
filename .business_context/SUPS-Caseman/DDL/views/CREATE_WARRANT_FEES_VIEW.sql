/*******************************************************************************
 *      Module:         CREATE_WARRANT_FEES_VIEW.sql                           *
 *                                                                             *
 *      Description:    Script to create the WARRANT_FEES view used in reports.*
 *                                                                             *
 *      (c) copyright EDS 2005                                                 *
 *                                                                             *
 *      Amendment History:                                                     *
 *      Version         Date            Changed By      Description            *
 *      1.0             06 May 2005     David Holder    Original Version       *
 *							modified from the      *
 *							CaseMan version for    *
 *							SUPS.                  *
 *	1.1		20 Sep 2005	Ian Yates	'Issued By' court      *
 *							added to View	       *
 *	1.2		21 Sep 2005	Ian Yates	'Currently Owned By'   *
 *							added to View	       *
 *	1.3		21 Sep 2005	Ian Yates	'CO Number' and	       *
 *							'Local_Warrant_Number' *
 *							added to View	       *
 *	1.4		09 Feb 2006	Mike Brock	executed_by added to   *
 *                                                      view.Check deleted flag*
 *******************************************************************************
*/

CREATE OR REPLACE VIEW warrant_fees AS
SELECT	w.case_number,
	w.warrant_number,
	w.warrant_type,
	NVL( f.amount, 0 )		FEE_AMOUNT,
	NVL( w.solicitor_costs, 0 )	SOLICITOR_COSTS,
	c.name				COURT,
	f.allocation_date		FEE_DATE,
	w.warrant_issue_date		WARRANT_ISSUE,
	w.warrant_id,
	w.issued_by,					-- v1.1 ADDED
	w.currently_owned_by,				-- v1.2 ADDED
	w.co_number,					-- v1.3 ADDED
	w.local_warrant_number,				-- v1.3 ADDED
        w.executed_by                                   -- v1.4 ADDED
FROM	warrants	w,
	courts		c,
	fees_paid	f
WHERE	w.executed_by = c.code
AND	w.warrant_number = f.process_number
AND	w.issued_by = f.issuing_court
AND     w.local_warrant_number IS NULL
AND	f.process_type = 'W'
AND     f.deleted_flag = 'N';

