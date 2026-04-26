/****************************************************************************************************************
						Run CM_CVER Counter Verification Report 										
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
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

var _paymentsExistsXPath = "/ds/var/page/OracleReportForm/PaymentsExists";

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
/**
 * Form element
 * @author bz6s80
 * 
 */
function OracleReportForm() {}
					
// load the System Date and Non Working Days into the XML	
OracleReportForm.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];
		
// Header Fields and Save Button for WP Parameter form
		
			
// Define the form key bindings
OracleReportForm.keyBindings = [
/**
 * @author bz6s80
 * 
 */
	{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
	{ key: Key.F4, action: exitScreen }
];			
			
		
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
			
/**
 * Create the Owning Court Name and Code objects
 * @author bz6s80
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}
function YesOrNo() {}

// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
YesOrNo.dataBinding = "/ds/var/page/OracleReportForm/YesOrNo";

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/

			
/**
 * Make the Owning Court Name, Code fields and text area read only
 * @author bz6s80
 * @return boolean 
 */
OwningCourt_Code.isReadOnly = function() { return true; }
OwningCourt_Name.isReadOnly = function() { return true; }
				
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/

/**
 * Create and initialise the variables that hold the Owning Court Name, Code and text area bolier plate text objects
 * @author bz6s80
 * 
 */
OracleReportForm.initialise = function()
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	Services.setValue(_paymentsExistsXPath, "false");
					
	StartOfDayUtils.checkSuitorsCashStartOfDay("CounterVerificationReport");

	// check and see if Counter Payments have been made today 
	getCounterVerificationStatus ();
}	
	
/*****************************************************************************************************************
											GET COUNTER VERIFICATION STATUS
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function getCounterVerificationStatus ()
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("inputBy", CaseManUtils.getUserParameter(CaseManFormParameters.USERNAME_XPATH ));
        Services.callService("getCounterVerificationStatus", params, CounterVerificationStatusHandler, true);
}
	
/*****************************************************************************************************************
											GET RUN COUNTER PAYMENTS STATUS HANDLER
*****************************************************************************************************************/

 function CounterVerificationStatusHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
CounterVerificationStatusHandler.onSuccess = function(dom)
{ 
	//check the DOM for contents
    if (dom != null)
    {
    	//select the node where the case number is stored
        var node = dom.selectSingleNode("ds/CounterPayments");
        // if it is empty, inform the user that case entered was not found
        if (node == null) {
        	// replace the empty node to the XPATH
            Services.replaceNode(REF_DATA_XPATH + "/CounterPayments", node );

            // display to the user that the no counter payments exist for today.
		    Services.setTransientStatusBarMessage("There are no counter payments to report on");
		} else {
        	// replace the node to the XPATH. 
            Services.replaceNode(REF_DATA_XPATH + "/CounterPayments", node );
            // check the number of counter payments for today
            if (Services.getValue(REF_DATA_XPATH + "/CounterPayments/noOfCounterPaymments") == 0) {
            	// display to the user that the no counter payments exist for today.
		    	Services.setTransientStatusBarMessage("There are no counter payments to report on");
            } else {
            	Services.setValue(_paymentsExistsXPath, "true");
            }		
		}
    } else {
        Services.setTransientStatusBarMessage("There are no counter payments to report on");
    }
}
       	

/**
 * @param exception
 * @author bz6s80
 * 
 */
CounterVerificationStatusHandler.onError = function(exception)
{  
	var message = exception.message;
	Services.setTransientStatusBarMessage(message);
	alert(message);
}


			
/*****************************************************************************************************************
                                         REQUEST REPORT
*****************************************************************************************************************/
			
/**
 * @author bz6s80
 * 
 */
function requestReport()
{
	// If the validation of the run report button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{ 
 	   //create a dom to pass to the interface service
 	   var dom = XML.createDOM(null, null, null);
 	   
 	   // generate a parameter dom that we shall pass to the interface service that will run the reports
	   var params = new ServiceParams();
 	   params.addSimpleParameter("inputBy",  CaseManUtils.getUserParameter(CaseManFormParameters.USERNAME_XPATH ));
	   //Services.callService("produceCounterVerificationReport", params, runEndOfDayReportHandler, false);
	   Reports.callAsync("asyncCounterVerificationReport", params, CaseMan_AsyncMonitor.srcData);
	   Util.openPopup("CaseMan_AsyncMonitorPopup");	   
	   
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}	

/*****************************************************************************************************************
											GET RUN SUITORS CASH END OF DAY REPORT HANDLER
*****************************************************************************************************************/

 function runEndOfDayReportHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
runEndOfDayReportHandler.onSuccess = function(dom)
{ 
	Services.setTransientStatusBarMessage("Report Completed");
}
       	

/**
 * @param exception
 * @author bz6s80
 * 
 */
runEndOfDayReportHandler.onError = function(exception)
{  
	var message = "An error occurred running the counter verification report";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
	//alert(message);
}


/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
			
/** Misc Code for question YesOrNo support**/
YesOrNo.tabIndex = __tabIdx++;
YesOrNo.componentName = "Click on Run Report button to print this report.";		
YesOrNo.srcData = null;
YesOrNo.rowXPath = null;
YesOrNo.keyXPath = null;
YesOrNo.displayXPath = null;
YesOrNo.helpText = null;
		
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

Status_RunReportButton.validationList = [];
			
function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;
			
/**
 * @author bz6s80
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		requestReport();
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}
Status_RunReportButton.enableOn = [_paymentsExistsXPath];
Status_RunReportButton.isEnabled = function()
{
	if(Services.getValue(_paymentsExistsXPath) == "true") {
		return true;
	}
	return false;
}
			
function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author bz6s80
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/**
 * Displays the error message on the status bar
 * @param ec
 * @author bz6s80
 * @return ec  
 */
function failedValidation (ec)
{
  if(ec != null)
  {
    Services.setTransientStatusBarMessage(ec.getMessage());
  }
  return ec;
}			

/**
 * @author bz6s80
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
	
/**
 * Async Stuff
 * @author bz6s80
 * 
 */
function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};


CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";
/**
 * @author bz6s80
 * 
 */
CaseMan_AsyncMonitor.onComplete = function()
{
	//debugger;
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	Services.setTransientStatusBarMessage("Report Completed");
}

/**
 * @param exception
 * @author bz6s80
 * 
 */
CaseMan_AsyncMonitor.onError = function(exception)
{
	var message = "An error occurred running the counter verification report";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @author bz6s80
 * 
 */
CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @param error
 * @author bz6s80
 * 
 */
CaseMan_AsyncMonitor.onCancelError = function(error)
{
	//debugger;
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}
	
