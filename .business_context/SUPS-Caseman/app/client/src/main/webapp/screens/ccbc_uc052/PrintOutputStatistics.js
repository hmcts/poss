/** 
 * @fileoverview PrintOutputStatistics.js:
 * This file contains the form and field configurations for the CCBC UC052
 * Print Output Statistics screen. 
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 08/01/2007 - Chris Vincent, updated start and end date validation methods to call appropriate error
 * 				message (Group2 Defects 3362, 3363 & 3364)
 * 08/01/2007 - Chris Vincent, Run Report button actionBinding updated so no longer invokes IE alert box 
 * 				(Group2 Defect 4011)
 * 08/01/2007 - Chris Vincent, added report parameter P_USER to requestReport() (Group2 Defect 3988)
 */
		
/**
 * XPath Constants
 * @author rzxd7g
 */
function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.PAGE_XPATH = "/ds/var/page";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";

/******************************* FORM ELEMENT ***************************************/

function OracleReportForm() {}
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

OracleReportForm.initialise = function()
{
	// Set the owning court to the user's home court
	var adminCourtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(OwningCourt_Code.dataBinding, adminCourtCode);
	
	// Set the start and end dates
	Services.setValue(Params_StartDate_Txt.dataBinding, getFirstDayOfPreviousMonth());
	Services.setValue(Params_EndDate_Txt.dataBinding, getLastDayofPreviousMonth());
}

/******************************* FUNCTIONS *****************************************/

/**
 * Exits the screen and returns to the Main Menu
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Runs the Output Statistics report (BC_ST_R2)
 * @author rzxd7g
 */
function requestReport()
{
	Popup_Cancel.cancelled = false;
	var dom = Reports.createReportDom("BC_ST_R2.rdf");
	Reports.setValue(dom, "P_START_DATE",  CaseManUtils.convertDateToDisplay(Services.getValue(Params_StartDate_Txt.dataBinding)) );								
	Reports.setValue(dom, "P_END_DATE",  CaseManUtils.convertDateToDisplay(Services.getValue(Params_EndDate_Txt.dataBinding)) );								
	Reports.setValue(dom, "P_USER",  Services.getCurrentUser() );								
	Reports.runReport(dom);
}	

/*********************************************************************************/

/**
 * Returns the first day of the previous month
 * @author rzxd7g
 * 
 * @return [String] The first day of the previous month
 */
function getFirstDayOfPreviousMonth()
{
	var todaysDate = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ); 
	var firstDayOfPreviousMonth = CaseManUtils.monthsInPast(todaysDate, 1);
	firstDayOfPreviousMonth.setDate("01");
	firstDayOfPreviousMonth = CaseManUtils.convertDateToPattern(firstDayOfPreviousMonth,"YYYY-MM-DD");
	return firstDayOfPreviousMonth;
}

/*********************************************************************************/

/**
 * Returns the last day of the previous month
 * @author rzxd7g
 * 
 * @return [String] The last day of the previous month
 */
function getLastDayofPreviousMonth()
{
	var todaysDate = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) ); 
	todaysDate.setDate("01");
	var lastDayofPreviousMonth = CaseManUtils.daysInPast(todaysDate, 1, true);
	lastDayofPreviousMonth = CaseManUtils.convertDateToPattern(lastDayofPreviousMonth,"YYYY-MM-DD");
	return lastDayofPreviousMonth;
}

/****************************** DATA BINDINGS ************************************/

OwningCourt_Code.dataBinding = XPathConstants.PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + OwningCourt_Code.dataBinding + "]/Name";
Params_StartDate_Txt.dataBinding = XPathConstants.PAGE_XPATH + "/OracleReportForm/StartDate";
Params_EndDate_Txt.dataBinding = XPathConstants.PAGE_XPATH + "/OracleReportForm/EndDate";

/******************************* FORM FIELDS *************************************/

function OwningCourt_Code() {};
OwningCourt_Code.tabIndex = -1;
OwningCourt_Code.isReadOnly = function() { return true; }

/*********************************************************************************/

function OwningCourt_Name() {};
OwningCourt_Name.tabIndex = -1;
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
OwningCourt_Name.isReadOnly = function() { return true; }

/*********************************************************************************/

function Params_StartDate_Txt() {};
Params_StartDate_Txt.tabIndex = 1;
Params_StartDate_Txt.weekends = true;
Params_StartDate_Txt.componentName = "Start Date";
Params_StartDate_Txt.helpText = "Start Date for the Output Statistics report.";
Params_StartDate_Txt.isMandatory = function() { return true; }
Params_StartDate_Txt.validateOn = [Params_EndDate_Txt.dataBinding];
Params_StartDate_Txt.validate = function()
{
	var ec = null;
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
	var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
	if ( null != startDateObj )
	{
		if ( CaseManUtils.compareDates(startDateObj, today) != 1 )
		{
			// Start date is not in the past, throw error message
			ec = ErrorCode.getErrorCode("CaseMan_CCBC_DateMustBeInPast_Msg");
		}
		else
		{
			// Check that Start Date is before or the same as the End Date
			var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
			var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
			if ( null != endDateObj && CaseManUtils.compareDates(startDateObj, endDateObj) == -1 )
			{
				// Start Date is after the end date entered, throw error message
				ec = ErrorCode.getErrorCode("CaseMan_CCBC_StartDateAfterEndDate_Msg");
			}
		}
	}
	return ec;
}

/*********************************************************************************/

function Params_EndDate_Txt() {};
Params_EndDate_Txt.weekends = true;
Params_EndDate_Txt.tabIndex = 2;
Params_EndDate_Txt.componentName = "End Date";
Params_EndDate_Txt.helpText = "End Date for the Output Statistics report.";
Params_EndDate_Txt.isMandatory = function() { return true; }
Params_EndDate_Txt.validate = function()
{
	var ec = null;
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
	if ( null != endDateObj )
	{
		if ( CaseManUtils.compareDates(endDateObj, today) != 1 )
		{
			// End date is not in the past, throw error message
			ec = ErrorCode.getErrorCode("CaseMan_CCBC_DateMustBeInPast_Msg");
		}
	}
	return ec;
}

/********************************* BUTTONS ***************************************/
	
function Status_RunReportButton() {};
Status_RunReportButton.tabIndex = 10;
Status_RunReportButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "OracleReportForm" } ]
	}
};

Status_RunReportButton.actionBinding = function() 
{
	// Validate form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length )
	{
		return;
	}
	else
	{
		requestReport();
	}				
}

/*********************************************************************************/

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = 11;
Status_Close_Btn.actionBinding = exitScreen;
Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "OracleReportForm" } ]
	}
};

/*************************** PROGRESS BAR POPUP **********************************/

function Progress_Bar() {}
Progress_Bar.tabIndex = -1;
Progress_Bar.dataBinding = "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }	

function Popup_Cancel() {};
Popup_Cancel.tabIndex = 20;
Popup_Cancel.cancelled = false;
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}