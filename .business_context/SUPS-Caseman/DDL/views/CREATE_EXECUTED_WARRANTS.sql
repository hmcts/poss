/*******************************************************************************
 *      Module:         CREATE_EXECUTED_WARRANTS_VIEW.sql                      *
 *                                                                             *
 *      Description:    Script to create the EXECUTED_WARRANTS view used in    *
 *			reports.					       *
 *                                                                             *
 *      (c) copyright EDS 2005                                                 *
 *                                                                             *
 *      Amendment History:                                                     *
 *      Version         Date            Changed By      Description            *
 *      1.0             06 May 2005     David Holder    Original Version       *
 *                                                      modified from the      *
 *                                                      CaseMan version for    *
 *                                                      SUPS.                  *
 *	1.1		04-Jul-2005	David Holder	Altered to match SUPS  *
 *							schema change.         *
 *      1.2             26-Jan-2006     Mike Brock      Add court code to calc *
 *                                                      of warrant payments    *
 *      1.3             09-Feb-2006     Mike Brock      change params to calc  *
 *                                                      of warrant payments    *
 *                                                      Reformat and add comments *
 *		1.4				30-Dec-2013		Chris Vincent	Added CONTROL Warrants *
 *******************************************************************************
*/

CREATE OR REPLACE VIEW EXECUTED_WARRANTS AS
SELECT	w.warrant_number,
	w.issued_by,
	w.currently_owned_by,
        w.executed_by,
	w.warrant_issue_date,
	wr.warrant_return_date,
	wr.return_code,
	w.original_warrant_number,
	 nvl(w.warrant_amount,0)    + 
         nvl(w.solicitor_costs,0)   + 
	 nvl(w.land_registry_fee,0) + 
         nvl( 
              decode(
                      w.local_warrant_number, 
                      -- If Home Warrant (l_w_n IS NULL) then calculate fees, else return fee from warrant record
                      null, 
                      nvl(sups_reports_pack.f_calculate_warrant_fees(w.warrant_number, w.issued_by) ,0),
                      nvl(w.warrant_fee,0)
                    ),
              0)  total_warrant,
	nvl (SUPS_REPORTS_PACK.f_calculate_warrant_payments
               ( w.warrant_number, w.local_warrant_number, w.issued_by, w.currently_owned_by) ,0 ) total_paid
from	warrant_returns wr,
	warrants w
where	w.warrant_type in ('EXONPLFF', 'EXECUTION', 'AO', 'CONTROL')
and 	wr.warrant_return_date = (select min(wr1.warrant_return_date)
				  from warrant_returns wr1,
				  return_codes rt
				  where wr1.warrant_id  = w.warrant_id
				  and wr1.error_indicator = 'N'
				  and wr1.RETURN_CODE_COURT_CODE = rt.ADMIN_COURT_CODE
				  and wr1.return_code = rt.return_code
				  and rt.return_type = 'F')
and	wr.error_indicator = 'N'
and	nvl(w.bailiff_identifier,0) < 99
and	w.warrant_id = wr.warrant_id;
