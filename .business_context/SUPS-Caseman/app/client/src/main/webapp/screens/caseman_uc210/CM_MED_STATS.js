/********************** GLOBAL VARIABLES *******************************************/

var reportModuleGroup = ""
var __tabIdx = 300;

// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

/***************************** MAIN FORM *******************************************/

function OracleReportForm() {}
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

OracleReportForm.keyBindings = [
	{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
	{ key: Key.F4, action: exitScreen }
];

OracleReportForm.initialise = function()
{
	var ADMIN_CROWN_COURT = null;
	if ( CaseManUtils.isBlank(Services.getValue(CaseManFormParameters.OR_COURT_CODE_XPATH)) ){
		// Xpath Constant for Oracle Report Court Code not setup, use user's home court instead
		ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	}
	else{
		// Use Xpath Constant for Oracle Report Court Code
		ADMIN_CROWN_COURT = Services.getValue(CaseManFormParameters.OR_COURT_CODE_XPATH);
	}
	
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
}

/***********************************************************************************/

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";

Params_StartDate_Txt.dataBinding = "/ds/var/page/OracleReportForm/StartDate";
Params_EndDate_Txt.dataBinding = "/ds/var/page/OracleReportForm/EndDate";

/***********************************************************************************/

function OwningCourt_Code() {}
OwningCourt_Code.tabIndex = -1;
OwningCourt_Code.isReadOnly = function() { return true; }

/***********************************************************************************/

function OwningCourt_Name() {}
OwningCourt_Name.tabIndex = -1;
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
OwningCourt_Name.isReadOnly = function() { return true; }

/***********************************************************************************/

function Params_StartDate_Txt() {}
Params_StartDate_Txt.tabIndex = __tabIdx++;
Params_StartDate_Txt.componentName = "Start Date";		
Params_StartDate_Txt.helpText = "Enter the Start Date of the required reporting period";
Params_StartDate_Txt.isMandatory = function() { return true; }
Params_StartDate_Txt.validateOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding];
Params_StartDate_Txt.validate = function(value)
{
	var ec = validateStartDate(Params_StartDate_Txt, Params_EndDate_Txt);
	return ec;
}

/***********************************************************************************/

function Params_EndDate_Txt() {}
Params_EndDate_Txt.tabIndex = __tabIdx++;
Params_EndDate_Txt.componentName = "End Date";
Params_EndDate_Txt.helpText = "Enter the End Date of the required reporting period";
Params_EndDate_Txt.weekends = true;	
Params_EndDate_Txt.isMandatory = function() { return true; }
Params_EndDate_Txt.validateOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding];
Params_EndDate_Txt.validate = function(value)
{
	var ec = validateEndDate(Params_StartDate_Txt, Params_EndDate_Txt);
	return ec;
}

/***********************************************************************************/

function Status_RunReportButton() {}
Status_RunReportButton.validationList = ["Params_StartDate_Txt", "Params_EndDate_Txt"];
Status_RunReportButton.tabIndex = __tabIdx++;
Status_RunReportButton.actionBinding = function() 
{
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		requestReport();
	}
	else
	{
		alert(Messages.POPUP_INVALID_MESSAGE);
	}				
}

/***********************************************************************************/

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/***********************************************************************************/

function requestReport()
{
	Services.setTransientStatusBarMessage("Report Generation Requested. Please Wait..");
	// If the validation of the run report button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) ) { 
		//create a dom to pass to the interface service
		var dom = XML.createDOM(null, null, null);

		var params = new ServiceParams();
		params.addSimpleParameter("startDate", CaseManUtils.convertDateToDisplay(Services.getValue(Params_StartDate_Txt.dataBinding)) );
		params.addSimpleParameter("endDate", CaseManUtils.convertDateToDisplay(Services.getValue(Params_EndDate_Txt.dataBinding)) );

		Reports.callAsync("asyncMediationReport", params, CaseMan_AsyncMonitor.srcData);
		Util.openPopup("CaseMan_AsyncMonitorPopup");		
	}
}

/***********************************************************************************/
			
function validateEndDate(p_startDate, p_endDate)
{
	var endDate = Services.getValue(p_endDate.dataBinding);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);    
	var ec = null;
	if (endDateObj != null)
	{
		ec = validateDate(endDateObj);
		//p_startDate.validate();
	}
	return ec;				
}

/***********************************************************************************/

function validateStartDate(p_startDate, p_endDate)
{
	var startDate = Services.getValue(p_startDate.dataBinding);
	var endDate = Services.getValue(p_endDate.dataBinding);
	var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
	var ec = null;
	if(startDateObj != null)
	{
	  ec = validateDate(startDateObj);
	  if(ec == null)
	  {
		if (endDateObj != null)
		{
			if (CaseManUtils.compareDates(startDateObj, endDateObj) == -1)
			{
			  ec = ErrorCode.getErrorCode("CaseMan_startDateCannotBeLaterThanEndDate_Msg");
			}
		}
	  }      
	}
	return ec;				
}

/***********************************************************************************/

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

/***********************************************************************************/

function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	return date;
}

/***********************************************************************************/

function faildedValidation (ec)
{
  if(ec != null)
  {
	Services.setTransientStatusBarMessage(ec.getMessage());
  }
  return ec;
}

/***********************************************************************************/

function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						

/***********************************************************************************/

function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};
CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";

CaseMan_AsyncMonitor.onComplete = function()
{
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	Services.setTransientStatusBarMessage("Report Completed");
}

CaseMan_AsyncMonitor.onError = function(exception)
{
	var message = "An error occurred running the mediation statistics report";
	if (exception.message.length > 0) {
		message = exception.message;
	}
	Services.setTransientStatusBarMessage(message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

CaseMan_AsyncMonitor.onCancelError = function(error)
{
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}