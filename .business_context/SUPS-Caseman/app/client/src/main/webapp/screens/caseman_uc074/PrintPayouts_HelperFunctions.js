/** 
 * @fileoverview PrintPayouts_HelperFunctions.js:
 * This file contains the helper functions used for UC074 - PrintPayouts (Complete Payout)
 *
 * @author A.Bonnar
 * @version 0.1
 */

/*********************************************************************************/

/**
 * Function handles the exit from the screen back to the menu
 * @author hzw6j7
 * 
 */
function exitScreen()
{
	//debugger;
	Services.removeNode(CompletePayoutParams.PARENT);
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function calls a service to check if the Suitors Cash Start of Day Report 
 * has been run today on the user's owning court.
 * @author hzw6j7
 * 
 */
function checkSuitorsCashStartOfDay()
{
	// Get the system date in YYYY-MM-DD format
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	 
	// Return system date as a string in YYYYMMDD format (i.e. remove the hyphens)
	var systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	// check and see if the start of day reports have been run 
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var params = new ServiceParams();
	params.addSimpleParameter("runDate", "CFO RUNDATE");
	params.addSimpleParameter("systemDate", systemDate);
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getRunStartOfDayStatus", params, printPayouts, true);
}

/*********************************************************************************/

/**
 * Function calls a service to check if the Suitors Cash End of Day Report 
 * has been run today on the user's owning court.
 * @author hzw6j7
 * 
 */
function checkSuitorsCashEndOfDay()
{
	// check and see if the start of day reports have been run
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getSuitorsCashEndOfDayStatus", params, printPayouts, true);
}

/*********************************************************************************/

/**
 * Function calls a service to check if the PPL report has been run today for the user's 
 * owning court.  A lock is set in the database if the report is being run, the service
 * also looks for this lock and if not in place, will set the lock.
 * @author hzw6j7
 * 
 */
function checkCompletePayoutStatus()
{
	var params = new ServiceParams();
	var dataNode = XML.createDOM(null, null, null);
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);

     //Check the Suitors Cash End Of Day report has run
	Services.setValue(REPORT_DATA_XPATH + "/ReportType", "PAY");
	Services.setValue(REPORT_DATA_XPATH + "/ReportDate", CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );
	Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", 0);
	Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser());
	Services.setValue(REPORT_DATA_XPATH + "/CourtCode", courtCode);
	
	dataNode.appendChild( Services.getNode(REPORT_DATA_XPATH) );
	params.addDOMParameter("reportData", dataNode);
	params.addSimpleParameter("adminCourtCode", courtCode);
	// Checks for a lock and if not set, then sets the lock.  Also checks if payout has been run yet today
	Services.callService("checkCompletePayoutStatus", params, printPayouts, true);
}


/*********************************************************************************/

/**
 * Function calls a service to check if the Complete Payout
 * has been run today for this user's owning court. The Complete Payout
 * Process can only be run once per day.
 * @author hzw6j7
 * 
 */
function getCompletePayoutStatus()
{
	// Get the system date in YYYY-MM-DD format
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	 
	// Return system date as a string in YYYYMMDD format (i.e. remove the hyphens)
	var systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	// check and see if the start of day reports have been run 
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var params = new ServiceParams();
	params.addSimpleParameter("runDate", "CP RUNDATE");
	params.addSimpleParameter("systemDate", systemDate);
	params.addSimpleParameter("adminCourtCode", courtCode);
	Services.callService("getCompletePayoutStatus", params, printPayouts, true);
}

/*********************************************************************************/

/**
 * Function calls a service to clear the lock on the screen and remove any data from 
 * relevant tables as the user wishes to exit the screen without running the report.
 * @author hzw6j7
 * 
 */
function cancelPrintPayouts()
{

	var params = new ServiceParams();
	var runDivIndicator = Services.getValue(CompletePayoutParams.RUNDIVIDEND_IND);				
	if (runDivIndicator == "true") {
		//We have come from the RunDividend Screen,  
		//so we need to release the DividendPayout Lock (DIV)	
		Services.callService("cancelDividendPayout", params, Status_Close_Btn, true);
	}  else { //Called from CompletePayout(print payout)
		    if ((Services.getValue(ENDOFDAY_RUN_IND_XPATH) == "true") || 
					(Services.getValue(PAYOUT_LOCK_IND_XPATH) == "true")) {
				//We need to release the CompletePayout Lock (PAY), only if we have locked it.	
				Services.callService("cancelCompletePayout", params, Status_Close_Btn, true);
			}	
			else
			{
				exitScreen();	
			}
	}
	
}

