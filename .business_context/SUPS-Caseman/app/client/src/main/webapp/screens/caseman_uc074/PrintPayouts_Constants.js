/** 
 * @fileoverview PrintPayouts_Constants.js:
 * This file contains the constants used for UC074 - PrintPayouts (Complete Payout)
 *
 * @author A.Bonnar
 * @version 0.1
 */

var ROOT_XPATH = "/ds";
var VAR_FORM_XPATH = ROOT_XPATH + "/var/form";
var VAR_PAGE_XPATH = ROOT_XPATH + "/var/page";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";
var DATA_XPATH = ROOT_XPATH + "/RunDividendDeclaration";
var PAYOUT_LOCK_IND_XPATH = VAR_PAGE_XPATH + "/PageOne/PayoutLockApplied";
var CONUMBER_RETRIEVED_IND_XPATH = VAR_PAGE_XPATH + "/PageOne/CONumberRetrieved";
var ENDOFDAY_RUN_IND_XPATH = VAR_PAGE_XPATH + "/PageOne/EndOfDayRun";
var CONUMBER_RETRIEVED_IND_XPATH = VAR_PAGE_XPATH + "/PageOne/CONumberRetrieved";
var TEMP_CODATA_XPATH = VAR_PAGE_XPATH + "/PageOne/Temp/ConsolidatedOrderList";
var REPORT_DATA_XPATH = VAR_PAGE_XPATH + "/PageOne/ReportData";
var PAYOUT_ERRORMESSAGE_XPATH = VAR_PAGE_XPATH + "/PageOne/PayoutErrorMessage";
var COMPLETE_PAYOUT_LOCK_XPATH = VAR_PAGE_XPATH + "/insertUpdateRunStartOfDayStatus/row";
var X_BUTTON_STATE_XPATH = VAR_FORM_XPATH + "/xButtonState"; //Used as a holder to indicate whether the X button has been clicked.


var STATUS_NEW = "NEW";
