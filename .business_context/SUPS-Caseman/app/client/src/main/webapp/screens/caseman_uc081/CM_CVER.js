/****************************************************************************************************************
						Run CM_CVER Counter Verification Report By User				
						
  * Change History *
 26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 									on the client as wrong message was being displayed.	CaseMan TD4061												
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
var adminCourtCode 	= "";

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/			
/**
 * Form element
 * @author bz6s80
 * 
 */
function OracleReportForm() {}
		
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];
			
// Form Keybindings
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
function OwningCourt_Name() {}
function OwningCourt_Code() {}
function InputBy() {}


OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
InputBy.dataBinding = "/ds/var/page/OracleReportForm/InputBy";

OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/
OwningCourt_Code.isReadOnly = function() { return true; }
OwningCourt_Name.isReadOnly = function() { return true; }
			
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
OracleReportForm.initialise = function()
{
	//debugger;
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	Services.setValue(_paymentsExistsXPath, "false");

	// Get the court code
	adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
		 
	StartOfDayUtils.checkSuitorsCashStartOfDay("CounterVerificationReportByUser");

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
	Services.setTransientStatusBarMessage("Report Generation Requested. Please Wait..");
	
	// If the validation of the run report button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{ 
 	   //create a dom to pass to the interface service
 	   var dom = XML.createDOM(null, null, null);
 	   
 	   // generate a parameter dom that we shall pass to the interface service that will run the reports
	   var params = new ServiceParams();
 	   params.addSimpleParameter("inputBy",  Services.getValue(InputBy.dataBinding) );
	   //Services.callService("produceCounterVerificationReport", params, requestReportHandler, true);
	   Reports.callAsync("asyncCounterVerificationReport", params, CaseMan_AsyncMonitor.srcData);
	   Util.openPopup("CaseMan_AsyncMonitorPopup");	  	   
	   
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}	

function requestReportHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
requestReportHandler.onSuccess = function(dom)
{ 
	Services.setTransientStatusBarMessage("Report Completed");
}
       	

/**
 * @param exception
 * @author bz6s80
 * 
 */
requestReportHandler.onError = function(exception)
{  
	var message = "An error occurred running the counter verification report";
	/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
	alert(message);
}

/*****************************************************************************************************************
											GET COUNTER PAYMENTS STATUS BY USER
*****************************************************************************************************************/
/**
 * @param inputBy
 * @author bz6s80
 * 
 */
function checkPaymentsExists(inputBy)
{
	Services.setValue(_paymentsExistsXPath, "false");
	var params = new ServiceParams();
	params.addSimpleParameter("inputBy", inputBy);
    Services.callService("getCounterVerificationStatus", params, CounterVerificationStatusHandler, true);
}

function CounterVerificationStatusHandler (){};
/**
 * @param dom
 * @author bz6s80
 * 
 */
CounterVerificationStatusHandler.onSuccess = function(dom) {
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
		    Services.setTransientStatusBarMessage("No Counter Verification Report for that user to be printed");
		} else {
        	// replace the node to the XPATH. 
            Services.replaceNode(REF_DATA_XPATH + "/CounterPayments", node );

            // check the number of counter payments for today
            if (Services.getValue(REF_DATA_XPATH + "/CounterPayments/noOfCounterPaymments") == 0) {
            	// display to the user that the no counter payments exist for today.
			    Services.setTransientStatusBarMessage("No Counter Verification Report for that user to be printed");
            } else {
            	Services.setValue(_paymentsExistsXPath, "true");
            }
		}
    } else {
	    Services.setTransientStatusBarMessage("No Counter Verification Report for that user to be printed");
    }
}

/**
 * @author bz6s80
 * 
 */
CounterVerificationStatusHandler.onError = function() {
	var message = "An error occurred running the counter verification report";
	/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
	alert(message);
}

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
InputBy.tabIndex = __tabIdx++;
InputBy.componentName = "Clerk's Login";
InputBy.srcData = null;
InputBy.rowXPath = null;
InputBy.keyXPath = null;
InputBy.displayXPath = null;
InputBy.helpText = "Enter the Clerk's login";
InputBy.maxLength = 10;
InputBy.isMandatory = function() { return true;	}
InputBy.validate = function(value) { }
InputBy.logicOn = [InputBy.dataBinding];
InputBy.logic = function(event) {
	var inputBy = Services.getValue(this.dataBinding);

	if(InputBy.validate() == null) {
		if(inputBy != "%") {
			checkPaymentsExists(inputBy);
		}
		else {
			Services.setValue(_paymentsExistsXPath, "false");
		}
	}
}

			
Status_RunReportButton.validationList = ["InputBy"];
			
Status_RunReportButton.enableOn = [_paymentsExistsXPath];
Status_RunReportButton.isEnabled = function()
{
	if(Services.getValue(_paymentsExistsXPath) == "true") {
		return true;
	}
	return false;
}
			
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
 * @param ec
 * @author bz6s80
 * @return ec  
 */
function faildedValidation (ec)
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
	//debugger;
	var message = "An error occurred running the counter verification report";
	/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
	alert(message);
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
	
