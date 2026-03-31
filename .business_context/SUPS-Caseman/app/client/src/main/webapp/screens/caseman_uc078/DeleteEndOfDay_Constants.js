/** 
 * @fileoverview DeleteEndOfDay_Constants.js:
 * This file contains the constants used for UC078 - Delete End Of Day
 *
 * @author Chris Vincent
 * @version 0.1
 */

var ROOT_XPATH = "/ds";
var VAR_FORM_XPATH = ROOT_XPATH + "/var/form";
var VAR_PAGE_XPATH = ROOT_XPATH + "/var/page";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";
var DATA_XPATH = ROOT_XPATH + "/EndOfDayRecords";
var PAYMENTIN_DATA_XPATH = DATA_XPATH + "/PaymentSummaries/PaymentSummary[./InOutFlag = 'I']";
var PAYMENTOUT_DATA_XPATH = DATA_XPATH + "/PaymentSummaries/PaymentSummary[./InOutFlag = 'O']";
var ACCOUNTING_PERIOD_XPATH = DATA_XPATH + "/AccountingPeriodEnded";
var BROUGHT_FORWARD_ROW_XPATH = DATA_XPATH + "/NoBroughtForwardRow";
