/****************************************************************************************************************
						Run CM_RCPT Receipts by User and Date
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

var dateCreated = null;

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
			
		
// Header Fields and Save Button for WP Parameter form

	
// Form Keybindings
OracleReportForm.keyBindings = [
/**
 * @author bz6s80
 * 
 */
	{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
	{ key: Key.F4, action: exitScreen }];			
			

/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
function OwningCourt_Name() {}
function OwningCourt_Code() {}

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";

function InputBy() {}
InputBy.dataBinding = "/ds/var/page/OracleReportForm/InputBy";

function PaymentDate() {}
PaymentDate.dataBinding = "/ds/var/page/OracleReportForm/PaymentDate";
		
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
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);

    // get the todays date in YYYY-MM-DD format
	var todaysDate = CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate");
	// set todays date as the default value
	Services.setValue(PaymentDate.dataBinding, todaysDate);

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
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) ) { 
		//create a dom to pass to the interface service
		var dom = XML.createDOM(null, null, null);
	   
		var params = new ServiceParams();
		params.addSimpleParameter("inputBy",  Services.getValue(InputBy.dataBinding));
		params.addSimpleParameter("dateCreated", CaseManUtils.convertDateToDisplay(Services.getValue(PaymentDate.dataBinding)));
		params.addSimpleParameter("runBy", "supervisor");
	   
		//Services.callService("producePaymentReceiptsReport", params, runReportHandler, true);
		Reports.callAsync("asyncPaymentReceiptsReport", params, CaseMan_AsyncMonitor.srcData);
	    Util.openPopup("CaseMan_AsyncMonitorPopup");	 
	}
}	

/*****************************************************************************************************************
											RUN REPORT HANDLER
*****************************************************************************************************************/

 function runReportHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
runReportHandler.onSuccess = function(dom)
{ 
	Services.setTransientStatusBarMessage("Report Completed");
}
       	

/**
 * @param exception
 * @author bz6s80
 * 
 */
runReportHandler.onError = function(exception)
{  
	var message = "An error occurred running the Postal receipts for that user entered.";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
	//alert(message);
}


/*****************************************************************************************************************
                                         FIELD CODE
*****************************************************************************************************************/
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

Status_RunReportButton.validationList = ["PaymentDate"];

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author bz6s80
 * 
 */
Status_Close_Btn.actionBinding = function() {exitScreen(); };

function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * @author bz6s80
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		// Need to check if there are any receipts for this user and date.
		// if none then display error message "There are no receipts to be printed for this user and date"
		requestReport();
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}

InputBy.tabIndex = __tabIdx++;
InputBy.componentName = "Clerk's Login";
InputBy.srcData = null;
InputBy.rowXPath = null;
InputBy.keyXPath = null;
InputBy.displayXPath = null;
InputBy.helpText = "Enter the login name for the clerk";
InputBy.maxLength = 10;
InputBy.isMandatory = function(){ return true;}
		
PaymentDate.tabIndex = __tabIdx++;
PaymentDate.componentName = "Payment Date";
PaymentDate.srcData = null;
PaymentDate.rowXPath = null;
PaymentDate.keyXPath = null;
PaymentDate.displayXPath = null;
PaymentDate.helpText = "Enter Payment Date";
PaymentDate.isMandatory = function(){ return true;}
PaymentDate.validateOn = [PaymentDate.dataBinding];
PaymentDate.validate = function(value) {
    var paymentDate = Services.getValue(PaymentDate.dataBinding);
    var paymentDateObj = CaseManUtils.isBlank(paymentDate) ? null : CaseManUtils.createDate(paymentDate);
    var ec = null;
    
    if (paymentDateObj != null) {
    	ec = validateDate(paymentDateObj);
    }
    return ec;
}

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
/**
 * @param dateObj
 * @author bz6s80
 * @return null , faildedValidation (ec)  
 */
function validateDate(dateObj)
{    
  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
  if(CaseManUtils.compareDates(todayDateObj, dateObj)!= 1 )
  {
      return null;
  }
  else
  {
    ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
    return faildedValidation (ec);
  }      
  return null;   
}

/**
 * @author bz6s80
 * @return date  
 */
function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	//alert(date);
	return date;
}
			
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
	var message = "An error occurred running the Postal receipts for that user entered.";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
	//alert(message);
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
