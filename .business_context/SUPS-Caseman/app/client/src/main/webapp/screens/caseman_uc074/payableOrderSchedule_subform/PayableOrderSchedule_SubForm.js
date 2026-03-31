/** 
 * @fileoverview PayableOrder_SubForm.js:
 * This file contains the configurations for the PayableOrderSchedule Subform
 *
 * @author Anthony Bonnar
 */
 
/****************************** CONSTANTS ******************************************/

var DATA_XPATH = "/ds/PayableOrderSchedule";
var VAR_FORM_XPATH = "/ds/var/form";
var VAR_PAGE_XPATH = "/ds/var/page";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";
var COMPLETE_PAYOUT_LOCK_XPATH = VAR_PAGE_XPATH + "/insertUpdateRunStartOfDayStatus/row";

var PROCESSING_REPORTS_XPATH = VAR_FORM_XPATH + "/ProcessingReports";



/************************** FORM CONFIGURATIONS *************************************/

function payableOrderScheduleSubform() {}

/**
 * @author hzw6j7
 * 
 */
payableOrderScheduleSubform.initialise = function() 
{
  	Services.setValue(PROCESSING_REPORTS_XPATH, "false");  // enable the processing reports flag, this is used to enable the OK and Cancel buttons
}


payableOrderScheduleSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "PayableOrderScheduleDOM.xml",
	dataBinding: REF_DATA_XPATH
}

payableOrderScheduleSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },
	fileName: "PayableOrderScheduleDOM.xml",
	dataBinding: REF_DATA_XPATH
}

payableOrderScheduleSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },
    modify: {},
	postSubmitAction: {
		close: {}
	}

}

payableOrderScheduleSubform.cancelLifeCycle = {

	raiseWarningIfDOMDirty: false				  
}


/**
 * @author hzw6j7
 * 
 */
function requestCompletePayoutReports()
{
	// If the validation of the button status succeeds, request the report. 
	if (CaseManValidationHelper.validateFields(PayableOrderSchedule_OkButton.validationList) )
	{ 
	    //Lock the Complete Payout Process, 
	    //stop other users from running it on the same day
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
	
		
		
/**		20-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and runCompletePayoutReports is
		never called. This was implemented as part of CR 0153 - KG						   
		//Services.callService("runCompletePayoutReports", params, completePayoutReportsHandler, false);   	   */
		
		Reports.callAsync("asyncPrintPayoutReports", params, CaseMan_AsyncMonitor.srcData);
		Util.openPopup("CaseMan_AsyncMonitorPopup");
				   		
		
	}				
}

/**********************************************************************************/
PayableOrderSchedule_OkButton.validationList = [];
function PayableOrderSchedule_OkButton() {}
PayableOrderSchedule_OkButton.tabIndex = 2;

PayableOrderSchedule_OkButton.enableOn = [PROCESSING_REPORTS_XPATH];
PayableOrderSchedule_OkButton.isEnabled = function() 
{
  return !isProcessingReports();
}



/**
 * @author hzw6j7
 * 
 */
PayableOrderSchedule_OkButton.actionBinding = function() {
	Services.setValue(PROCESSING_REPORTS_XPATH, "true"); // enable the processing reports flag, this is used to disable the OK and Cancel buttons
	requestCompletePayoutReports();
	Services.setValue(VAR_FORM_XPATH + "/schedulesPrinted", "Y");
};

/**
 * @param dom
 * @author hzw6j7
 * 
 */
PayableOrderSchedule_OkButton.onSuccess = function(dom) {
 	Services.dispatchEvent("payableOrderScheduleSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/**********************************************************************************/
function PayableOrderSchedule_CancelButton() {}
PayableOrderSchedule_CancelButton.tabIndex = 3;

PayableOrderSchedule_CancelButton.enableOn = [PROCESSING_REPORTS_XPATH];
PayableOrderSchedule_CancelButton.isEnabled = function() 
{
  return !isProcessingReports();
}

/**
 * @author hzw6j7
 * 
 */
PayableOrderSchedule_CancelButton.actionBinding = function() {
	if (!(Services.getValue(VAR_FORM_XPATH + "/schedulesPrinted") == "Y")) {
		Services.setValue(VAR_FORM_XPATH + "/schedulesPrinted", "N");
	}
 	Services.dispatchEvent("payableOrderScheduleSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
};


/**
 * @author hzw6j7
 * @return boolean 
 */
function isProcessingReports()
{
	return CaseManUtils.getValidNodeValue(Services.getValue(PROCESSING_REPORTS_XPATH)) == "true";
}

/*****************************************************************************************************************
											GET COMPLETE PAYOUT REPORTS HANDLER
											
				20-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and completePayoutReportsHandler is
				never called. This was implemented as part of CR 0153 - KG														
*****************************************************************************************************************/
function completePayoutReportsHandler (){};
         	
/**
 * @param dom
 * @author hzw6j7
 * 
 */
   	completePayoutReportsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
 		Services.dispatchEvent("payableOrderScheduleSubform", BusinessLifeCycleEvents.EVENT_CANCEL);	
	} // END onSuccess
        	
/**
 * @param exception
 * @author hzw6j7
 * 
 */
    completePayoutReportsHandler.onError = function(exception) {  
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
	

// 20 Apr 2006 - KG. As part of CR 0153, Added Asynchronisation logic to this module  

/**
 * Async Stuff
 * @author hzw6j7
 * 
 */
function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};


CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";
/**
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onComplete = function()
{
	//debugger;
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	var dom = Services.getNode(CaseMan_AsyncMonitor.srcData + "/Response");
	
	Services.setValue(PROCESSING_REPORTS_XPATH, "false"); // enable the processing reports flag, this is used to enable the OK and Cancel buttons
	//close the window
	Services.dispatchEvent("payableOrderScheduleSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/**
 * @param error
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onError = function(error)
{
	//debugger;
    alert("Unable to initiate report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
    Services.setValue(PROCESSING_REPORTS_XPATH, "false"); // enable the processing reports flag, this is used to enable the OK and Cancel buttons
	//close the window
	Services.dispatchEvent("payableOrderScheduleSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
    
}

/**
 * @param error
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onCancelError = function(error)
{
	//debugger;
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}
	
