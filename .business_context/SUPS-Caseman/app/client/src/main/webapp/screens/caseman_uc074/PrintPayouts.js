/****************************************************************************************************************
											Report Payouts
 * Change History *
 26 July 2006 Kevin Gichohi (EDS) - Check if the exception message being returned from the server is null or empty. CaseMan TD4068
****************************************************************************************************************/

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/

		
var reportModuleGroup = ""
		
var __tabIdx = 300;
						
// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/PrintPayoutsForm";  // Place all input/output data in page context
var VAR_FORM_XPATH = "/ds/var/form";
var PO_PROCESSED = VAR_FORM_XPATH + "/poProcessed";
var SCHEDULES_PRINTED = VAR_FORM_XPATH + "/schedulesPrinted";

var runDivIndicator = null;
var date 			= "";
var systemDate 		= "";
var adminCourtCode 	= "";
var textAreaBoilerPlateText = "    The following options are available for the payout process:\n\n" +
							  "    OPTION 1 : Print payable order lineup.\n" +
							  "    OPTION 2 : Print payable orders.\n" +
							  "    OPTION 3 : Print schedules and notifications.\n" +
							  "           CO Dividend Fee List, CO 'Address Unknown' Report\n\n\n" +
							  "    Select Option 1 and Option 2 as many times as required - A 6 digit \n" +
							  "    payable order number is required for Option 2\n\n" +
							  "    Select Option 3 only after selecting Option 2 and to complete the \n" +
							  "    payout process\n\n" +
							  "    EXIT is not allowed after selecting Option 2\n\n" +
							  "    Please run the Pre-Payout List if any payments have been amended\n";
/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author hzw6j7
 * 
 */
function printPayouts() {}

/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/

/**
 * Create and initialise the variables that hold the Owning Court Name, Code
 * @author hzw6j7
 * 
 */
printPayouts.initialise = function() {
	
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);			
	Services.setValue(PAGE_BMSR_XPATH + "/TextAreaBoilerPlateText", textAreaBoilerPlateText);
	Services.setValue(VAR_FORM_XPATH + "/poProcessed", null);
	
	//set the X_BUTTON_STATE_XPATH to false. This is always false unless the user closes the window by clicking the X button.
   	Services.setValue(X_BUTTON_STATE_XPATH, "false");
	
	// Get the system date in YYYY-MM-DD format
	date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	// Return system date as a string in YYYYMMDD format
	systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");
	// Get the court code
	adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);

	runDivIndicator = Services.getValue(CompletePayoutParams.RUNDIVIDEND_IND);

	if (null == runDivIndicator) { //we have not come from the runDividendDeclaration screen
		checkSuitorsCashStartOfDay();
    } else { 	//we have come from runDividendDeclaration, so all the appropriate 
    			//locks & checks have already been done. So we just need to enable the buttons.
    	Services.setValue(ENDOFDAY_RUN_IND_XPATH, "true");
		Services.setValue(PAYOUT_LOCK_IND_XPATH, "true");
    }
	
}	
	
/**
 * @param dom
 * @param serviceName
 * @author hzw6j7
 * 
 */
printPayouts.onSuccess = function(dom, serviceName) 
{

	
	var message = null;

	switch (serviceName)
	{
		case "getRunStartOfDayStatus":
			// Check to see if start of day has been run results
			var node = dom.selectSingleNode("/ds/StartOfDay");
			if ( null == node ) 
			{
				// Start of day has not been run, Redirect to start of day screen
				var navArray = new Array(NavigationController.SUITORS_STARTOFDAY_FORM, NavigationController.PRINT_PAYOUT_REPORTS_FORM);
				NavigationController.createCallStack(navArray);
				NavigationController.nextScreen();
			} 
			else 
			{  
				//TD 2672
				//If the next screen in the Navigation controller is the same screen as we are in, then clear it
				// this screen from the navigation controller.
				if(NavigationController.getNextScreen() == NavigationController.PRINT_PAYOUT_REPORTS_FORM) 
				{
					NavigationController.resetCallStack();
				}

				// Start of day has run, see if Complete Payout Process has already been run today
				getCompletePayoutStatus();
			}
			break;
		case "getCompletePayoutStatus" :
			// Check to see if Complete Payout Process has already been run today
			var node = dom.selectSingleNode("/ds/CompletePayout");
			if (null == node) {
				//The Complete Payout has not been run today - Now check End Of Day
				checkSuitorsCashEndOfDay();
			}	
			else 
			{  
				message = ErrorCode.getErrorCode("CaseMan_runCompletePayoutTodayRun_Msg").getMessage();			
			}
			break;
		case "getSuitorsCashEndOfDayStatus":
			// Check to see if end of day has been run results
			var node = dom.selectSingleNode("/ds/EndOfDay");
			if ( null == node ) 
			{
				//End Of Day process has not been run today
				Services.setValue(ENDOFDAY_RUN_IND_XPATH, "true");
				checkCompletePayoutStatus();
			} 
			else 
			{
				// End Of Day report has already been run today, 
				// display error message and disable buttons.
				message = ErrorCode.getErrorCode("CaseMan_runCompletePayoutEndOfDayRun_Msg").getMessage();
	        }
			break;
		case "checkCompletePayoutStatus":	
			// Check PPL Status results
			var node = dom.selectSingleNode("/ds/PayoutProceed");
			if ( null != node ) 
			{
				// No-one else is running the payout
				Services.setValue(PAYOUT_LOCK_IND_XPATH, "true");
			} else {
				alert('Payout is still running');
			}
			break;
	}

	//Set the status bar with the appropriate error message if there is one.
	if (null != message) {
		Services.setTransientStatusBarMessage(message);
	}
}

/**
 * @param exception
 * @author hzw6j7
 * 
 */
printPayouts.onError = function(exception)
{
	Services.setValue(ENDOFDAY_RUN_IND_XPATH, "false");
	//The exception's message contains a lot of crap so take a substring to get rid of it.
	// Kevin Gichohi (EDS) 07-June-2006. Framework removes all the :
	// and other unwanted characters and returns the 
	// pure full message if catch(BusinessException e) is not called.
	//var endOfInfoIndex = exception.message.indexOf(":");
	//var message = exception.message.substring(endOfInfoIndex+2, exception.message.length);
	//  26 July 2006 Kevin Gichohi (EDS) - Check if the exception message being returned from the server is null or empty.
	var message = "An error occurred running the payout reports";
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
	Services.setValue(PAYOUT_ERRORMESSAGE_XPATH, message);
}
					
// load the System Date into the XML	
printPayouts.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
	{ name:"Courts",         dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort",    serviceParams:[]}
];
		
			
// Define the form key bindings
printPayouts.keyBindings = [	
	{ 
		key: Key.F4, action: exitPrintPayoutsScreen 
	}
];			
			
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
			
/**
 * Create the Owning Court Name and Code objects
 * @author hzw6j7
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}
function TextAreaBoilerPlateText() {}
			
// Initialise the XPATH for the text area bolier plate text
TextAreaBoilerPlateText.dataBinding = PAGE_BMSR_XPATH + "/TextAreaBoilerPlateText";
			
// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";

OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/

			
/**
 * Make the Owning Court Name, Code fields and text area read only
 * @author hzw6j7
 * @return boolean 
 */
OwningCourt_Code.isReadOnly = function()
{ 
	return true;
}

OwningCourt_Name.isReadOnly = function()
{ 
	return true;
}

TextAreaBoilerPlateText.isReadOnly = function()
{
	return true;
}
		
/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
			
/*****************************************************************************************************************/		
/**
 * Create the close Button object
 * @author hzw6j7
 * 
 */
function Status_Close_Btn() {};

// Assign a value to the the close Button status object tab index
Status_Close_Btn.tabIndex = __tabIdx++;
Status_Close_Btn.enableOn = [VAR_FORM_XPATH + "/poProcessed", VAR_FORM_XPATH + "/schedulesPrinted"];
Status_Close_Btn.isEnabled = function() {

	var retVal = false;
	var poProcessed = Services.getValue(VAR_FORM_XPATH + "/poProcessed");
	var schedulesPrinted = Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted");
	
	if (poProcessed != "Y" || schedulesPrinted == "Y") { 	
		retVal = true;		
 	}	
 	
 	return retVal;
}

/**
 * @author hzw6j7
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	cancelPrintPayouts();
}

/**
 * @author hzw6j7
 * 
 */
Status_Close_Btn.onSuccess = function()
{
	exitScreen();
}

/*****************************************************************************************************************/		

function PayableOrderLineup_Button() {};
// Assign a value to the the Run Report Button status object tab index
PayableOrderLineup_Button.tabIndex = __tabIdx++;
PayableOrderLineup_Button.validationList = [];
PayableOrderLineup_Button.enableOn = [PAYOUT_LOCK_IND_XPATH, ENDOFDAY_RUN_IND_XPATH, VAR_FORM_XPATH + "/schedulesPrinted"];

PayableOrderLineup_Button.isEnabled = function() {
	// Check if Lock not applied, then at least one of the pre-requisites have not been met
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	var endOfDayLockApplied = Services.getValue(ENDOFDAY_RUN_IND_XPATH);
	var shedulesPrinted = Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted");
	return ((payoutLockApplied == "true" 
			|| endOfDayLockApplied == "true") && shedulesPrinted != "Y") ? true : false;
}

/**
 * When the Run Report Button is clicked ....
 * @author hzw6j7
 * 
 */
PayableOrderLineup_Button.actionBinding = function()  {
	if ( CaseManValidationHelper.validateFields(PayableOrderLineup_Button.validationList) ) {
		requestLineUpReport();
	} else {
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}
};

/*****************************************************************************************************************/
function PayableOrder_Button() {};

// Assign a value to the the Run Report Button status object tab index
PayableOrder_Button.tabIndex = __tabIdx++;
PayableOrder_Button.validationList = [];
PayableOrder_Button.enableOn = [PAYOUT_LOCK_IND_XPATH, ENDOFDAY_RUN_IND_XPATH, VAR_FORM_XPATH + "/schedulesPrinted"];
PayableOrder_Button.isEnabled = function() {
	// Check if Lock not applied, then at least one of the pre-requisites have not been met
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	var endOfDayLockApplied = Services.getValue(ENDOFDAY_RUN_IND_XPATH);
	var shedulesPrinted = Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted");
	return ((payoutLockApplied == "true" 
			|| endOfDayLockApplied == "true") && shedulesPrinted != "Y") ? true : false;
}

/*****************************************************************************************************************/
function PayableOrderSchedule_Button() {};
PayableOrderSchedule_Button.enableOn = [VAR_FORM_XPATH + "/poProcessed", VAR_FORM_XPATH + "/schedulesPrinted"];
PayableOrderSchedule_Button.isEnabled = function()
{
	var hasProcessed = false;	
	var poProcessed = Services.getValue(VAR_FORM_XPATH + "/poProcessed");
	var shedulesPrinted = Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted");
   	if (poProcessed == "Y" && shedulesPrinted != "Y") { 	
		hasProcessed = true;		
 	}	
 	return hasProcessed;
}

// Assign a value to the the Run Report Button status object tab index
PayableOrderSchedule_Button.tabIndex = __tabIdx++;
	

/*****************************************************************************************************************
                                         REQUEST REPORT
*****************************************************************************************************************/
			
/**
 * @author hzw6j7
 * 
 */
function requestLineUpReport()
{
	// If the validation of the button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(PayableOrderLineup_Button.validationList) ) { 
		var dom = Reports.createReportDom("CM_LINEUP.rdf");
		Reports.runReport(dom);	   
	} else {
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}	

/*************************** EXIT SCREEN HANDLER **********************************/
function exitScreenHandler() {};
/**
 * @author hzw6j7
 * 
 */
exitScreenHandler.handleExit = function() {

	// Call the cancel service just in case
	var poProcessed = Services.getValue(VAR_FORM_XPATH + "/poProcessed");
	var shedulesPrinted = Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted");
	
   	if (poProcessed == "Y" && shedulesPrinted != "Y") { 
   		//user has attempted to leave the screen by the 'x' part of the browser, so
   		//run the required reports.	
   		
   		//set the X_BUTTON_STATE_XPATH to true. This will tell the custom processor that it needs to run extra methods.
   		Services.setValue(X_BUTTON_STATE_XPATH, "true");
   		   		
		requestCompletePayoutReports();
		alert("Reports Generated: In future, please generate \n the reports before closing the application");
		
 	} else {
		cancelPrintPayouts();
	}
	
	
}

/**
 * @author hzw6j7
 * 
 */
function exitPrintPayoutsScreen()
{
	
	exitScreenHandler.handleExit();
	// Call the cancel service just in case. This is now called in exitScreenHandler.handleExit() method.
	//cancelPrintPayouts();
}	

/*************************** PROGRESS BAR **********************************/
function Progress_Bar() {}

Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author hzw6j7
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}	

/******************************* SUB-FORMS *****************************************/	
function payableOrderSubform() {};
payableOrderSubform.subformName = "PayableOrderSubform";

payableOrderSubform.raise = {
	eventBinding: {
		singleClicks: [ {element: "PayableOrder_Button"} ]
	}
};

function payableOrderScheduleSubform() {};
payableOrderScheduleSubform.subformName = "PayableOrderScheduleSubform";

payableOrderScheduleSubform.raise = {
	eventBinding: {
		singleClicks: [ {element: "PayableOrderSchedule_Button"} ]
	}
};

/*********************************************************************************/
/**
 * Function calls a service to print out the schedules and notifications, 
 * CO Dividend Fee List, CO 'Address Unknown' Report
 * @author hzw6j7
 * 
 */
function requestCompletePayoutReports()
{

	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var params = new ServiceParams();
	var dataNode = XML.createDOM(null, null, null);
	
	var date = CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate")
	// Return system date as a string in YYYYMMDD format
	systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	Services.setValue(COMPLETE_PAYOUT_LOCK_XPATH + "/item", "CP RUNDATE");
	Services.setValue(COMPLETE_PAYOUT_LOCK_XPATH + "/itemValue", systemDate);
	Services.setValue(COMPLETE_PAYOUT_LOCK_XPATH + "/adminCourtCode", courtCode);

	

	dataNode.appendChild(Services.getNode("ds/var/page/insertUpdateRunStartOfDayStatus"));
	params.addDOMParameter("systemDataDbUpdate", dataNode);
	
	//Add parameters to pass to the custom processor.
	params.addSimpleParameter("xButtonClicked", Services.getValue(X_BUTTON_STATE_XPATH));
	
	var runDivIndicator = null;
	if (null == Services.getValue(CompletePayoutParams.RUNDIVIDEND_IND))
		{
		 runDivIndicator = false; //Navigation is from the complete payout screen
		}
	else
		{
		 runDivIndicator = true; //Navigation is from the run dividend screen
		}
	params.addSimpleParameter("runDivIndicator", runDivIndicator);
	
	params.addSimpleParameter("endOfDayRunIndicator", Services.getValue(ENDOFDAY_RUN_IND_XPATH));
	params.addSimpleParameter("payoutLockIndicator", Services.getValue(PAYOUT_LOCK_IND_XPATH));
		
	/**		21-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and runCompletePayoutReports is
		never called. This was implemented as part of CR 0153 - KG						   
		//Services.callService("runCompletePayoutReports", params, completePayoutHandler, false);  	   */
		//Reports.callAsync("asyncPrintPayoutReports", params, CaseMan_AsyncMonitor.srcData);
		
		Services.callService("asyncPrintPayoutReports", params, completePayoutHandler, false);
		//Util.openPopup("CaseMan_AsyncMonitorPopup");
	  
	
}

/*****************************************************************************************************************
											COMPLETE PAYOUT HANDLER
											
				21-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and completePayoutHandler is
				never called. This was implemented as part of CR 0153 - KG														
*****************************************************************************************************************/

function completePayoutHandler (){};
         	
/**
 * @param dom
 * @author hzw6j7
 * 
 */
   	completePayoutHandler.onSuccess = function(dom) { 
   		//cancelPrintPayouts(); exit screen since this same services are now called by the Complete Payouts Custom Processor
   		exitScreen();
	} // END onSuccess
        	
/**
 * @param exception
 * @author hzw6j7
 * 
 */
    completePayoutHandler.onError = function(exception) {  
	   	// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var preExceptionMethod = null;
		// Loop through the exception hierachy from highest to lowest
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception?
			if(preExceptionMethod != undefined) {
				preExceptionMethod.call(this, exception);
				break;
			}
		}
	
    	Logging.error(exception.message);
		var err = null;
		if (exception.message.indexOf("'") < 0)
		{
			ErrorCode.getErrorCode("Caseman_Err" + exception.name);
		}
    
    	// if no message exists for exception type.
    	if (err == null || err.getMessage() == null || err.getMessage() == "") {
    		//FormController.getInstance().setStatusBarMessage(exception.message);
    		Services.setTransientStatusBarMessage(exception.message);
    		alert(exception.message);
    	} else { // display message.
    		//FormController.getInstance().setStatusBarMessage(err.getMessage());
    		Services.setTransientStatusBarMessage(err.message);
    		alert(err.message);
   		}
    
		// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var postExceptionMethod = null;
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception
			if(postExceptionMethod != undefined) {
				postExceptionMethod.call(this, exception);
				break;
			}
		}
	}  // End onError
