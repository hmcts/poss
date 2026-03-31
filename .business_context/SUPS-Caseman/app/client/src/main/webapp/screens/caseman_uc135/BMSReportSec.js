/**
 * @fileoverview BMSReportSec.js:
 *
 * @version 2.0
 *
 * Change History:
 * 14/08/2006 - MGG - defect 4354 - Default value not being set correctly. 
 *				Params_SectionName_Sel should default to "%".  Added initialise function
 * 21/09/2007 - Chris Vincent, fixing CaseMan Defect 6195 by amending the function 
 * 				Params_PrintReport_Btn.isEnabled()
 */
	
/*************************** GLOBAL VARIABLES *******************************************/

// XPath constants
var REF_DATA_XPATH = "/ds/var/form/ReferenceData";
var PAGE_XPATH = "/ds/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/BMSReport";  // Place all input/output data in page context

/**************************** MAIN FORM *************************************************/

/**
 * @author rzmb1g
 */
function BMSReport() {};
BMSReport.initialise = function () 
{
	// Set default values
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(OwningCourt_Code.dataBinding, ADMIN_CROWN_COURT);
	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
	Services.setValue(Params_EndDate_Txt.dataBinding, getTodaysDate());
	Services.setValue(Params_SectionName_Sel.dataBinding, "%");
	
	var supsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/SUPSLivedate/ItemValue");
	if ((supsLiveDate == null) || (supsLiveDate == ''))
	{
		alert("SUPS Live date is not specified in SYSTEM_DATA table for this court.(item=SUPS_LIVE_DATE, item_value=YYYYMMDD).\r\n\r\nClick OK button to return to Main Menu");
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

BMSReport.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"CourtSections", dataBinding:REF_DATA_XPATH, serviceName:"getCourtSectionList", serviceParams:[]},
	{name:"SystemData", dataBinding:REF_DATA_XPATH, serviceName:"getSupsLiveDate", serviceParams:[{name:"courtCode",value:CaseManFormParameters.COURTNUMBER_XPATH}]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

/*************************** HELPER FUNCTIONS *******************************************/

/**
 * @author rzmb1g
 */
function exitScreen()
{
	if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/****************************************************************************************/

/**
 * @author rzmb1g
 */
function requestReport()
{
	if ( Params_PrintReport_Btn.isEnabled() )
	{
		Popup_Cancel.cancelled = false;
		var dom = Reports.createReportDom("CM_BMS_SEC.rdf");
		var startDateValue = Services.getValue(Params_StartDate_Txt.dataBinding);
		var endDateValue = Services.getValue(Params_EndDate_Txt.dataBinding);
		var sectionNameValue = Services.getValue(Params_SectionName_Sel.dataBinding);
	
		Reports.setValue(dom, "P_START_DATE", CaseManUtils.convertDateToDisplay(startDateValue) );
		Reports.setValue(dom, "P_END_DATE",   CaseManUtils.convertDateToDisplay(endDateValue) );
		Reports.setValue(dom, "P_SECTION", '"' + sectionNameValue + '"');
		Reports.runReport(dom);
	}
}

/****************************************************************************************/

/**
 * @param ec
 * @author rzmb1g
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

/****************************************************************************************/

/**
 * @author rzmb1g
 * @return supsLiveDateObj  
 */
function getTransformedSUPSLiveDate()
{
	var dateParseRegex = /^(\d{4})(\d{2})(\d{2})$/;
	var supsLiveDateString = Services.getValue(REF_DATA_XPATH + "/ds/SUPSLivedate/ItemValue");
	var supsLiveDateObj = dateParseRegex.exec(supsLiveDateString) ? new Date (RegExp.$1, (RegExp.$2 - 1), RegExp.$3, 0, 0, 0): null;
	return supsLiveDateObj;
}

/****************************************************************************************/

/**
 * @author rzmb1g
 * @return CaseManUtils.convertDateToPattern(supsLiveDateObj, CaseManUtils.DATE_DISPLAY_FORMAT)  
 */
function getTransformedSUPSLiveDateForDisplay()
{
	var dateParseRegex = /^(\d{4})(\d{2})(\d{2})$/;
	var supsLiveDateString = Services.getValue(REF_DATA_XPATH + "/ds/SUPSLivedate/ItemValue");
	var supsLiveDateObj = dateParseRegex.exec(supsLiveDateString) ? new Date (RegExp.$1, (RegExp.$2 - 1), RegExp.$3, 0, 0, 0): null;
	return CaseManUtils.convertDateToPattern(supsLiveDateObj, CaseManUtils.DATE_DISPLAY_FORMAT);
}

/****************************************************************************************/

/**
 * @param dateObj
 * @author rzmb1g
 * @return null , faildedValidation (ec)  
 */
function validateDate(dateObj)
{    
	var todayDateObj = CaseManUtils.createDate(getTodaysDate());
	var supsLiveDateObj = getTransformedSUPSLiveDate();  
	if(CaseManUtils.compareDates(todayDateObj, dateObj)!= 1 )
	{ 
		if(CaseManUtils.compareDates(supsLiveDateObj, dateObj) != -1)
		{
			return null;
		}
		else
		{
			//uct  defect 516 - message required for start date and bms validation
			// I.e. Start date cannot be prior to the Live Date
			alert("Start date cannot be prior to the SUPS Live Date. The SUPS Live Date is : " + getTransformedSUPSLiveDateForDisplay());
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeEarlierThanSUPSLiveDate_Msg");
			return faildedValidation (ec);
		}
	}
	else
	{
		ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		return faildedValidation (ec);
	}      
	return null;   
}

/****************************************************************************************/

/**
 * @author rzmb1g
 * @return date  
 */
function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	if(date == null)
	{
		var date = CaseManUtils.convertDateToPattern(new Date(),"YYYY-MM-DD");
	}
	return date;
}

/****************************************************************************************/

/**
 * @param value
 * @author rzmb1g
 * @return null , ec  
 */
function validateParams_SectionName_Sel(value)
{
	var enteredValue = Services.getValue(Params_SectionName_Sel.dataBinding);
	if (enteredValue == "%")
	{
		return null;
	}
	var found = false;
	var ec = null;
	var numberOfParams_SectionName_Sels = Services.getNodes(REF_DATA_XPATH + "/Sections/Section").length; 
	for(var i=1; i <= numberOfParams_SectionName_Sels; i++)
	{
		var type = Services.getValue(REF_DATA_XPATH + "/Sections/Section[" + i + "]/Id");
		if (type == enteredValue)
		{
			found = true;
			break;
		}
	}
	if (!found)
	{
		Services.setFocus("Params_SectionName_Sel");
		ec = ErrorCode.getErrorCode("CaseMan_warrantTypeInvalid_Msg");
		failedValidation (ec);
	}
	return ec;
}			

/****************************************************************************************/

/**
 * @param ec
 * @author rzmb1g
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

/**************************** DATA BINDINGS *********************************************/

OwningCourt_Code.dataBinding = 		 PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = 		 REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
Params_EndDate_Txt.dataBinding =     PAGE_BMSR_XPATH + "/EndDate";
Params_StartDate_Txt.dataBinding =   PAGE_BMSR_XPATH + "/StartDate";
Params_SectionName_Sel.dataBinding = PAGE_BMSR_XPATH + "/Section";
Params_PrintReport_Btn.dataBinding = PAGE_XPATH + "/printval";

/************************ INPUT FIELD DEFINITIONS ***************************************/

function OwningCourt_Code() {};
OwningCourt_Code.tabIndex = -1;
OwningCourt_Code.isReadOnly = function() { return true; }

/****************************************************************************************/

function OwningCourt_Name() {};
OwningCourt_Name.tabIndex = -1;
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
OwningCourt_Name.isReadOnly = function() { return true; }

/****************************************************************************************/

function Params_StartDate_Txt() {};
Params_StartDate_Txt.weekends = true;
Params_StartDate_Txt.tabIndex = 1;
Params_StartDate_Txt.helpText = "Enter the start date of the required reporting period";
Params_StartDate_Txt.isMandatory = function() { return true; }
Params_StartDate_Txt.validateOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding];
Params_StartDate_Txt.validate = function()
{
	var supsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/SUPSLivedate/ItemValue");
	if ( CaseManUtils.isBlank(supsLiveDate) )
	{
		return;
	}
	
    var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
    var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
    var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
    var ec = null;
    if(startDateObj != null)
    {
		ec = validateDate(startDateObj);    
		if(ec == null)
		{
			if(null == endDateObj)
			{
				endDate = getTodaysDate();
				Services.setValue(Params_EndDate_Txt.dataBinding, endDate);
				endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
			}
			if (CaseManUtils.compareDates(startDateObj, endDateObj) == -1)
			{
	      		ec = ErrorCode.getErrorCode("CaseMan_startDateCannotBeLaterThanEndDate_Msg");
	    	}
		}      
    }
    return ec;
}

/****************************************************************************************/

function Params_EndDate_Txt() {};
Params_EndDate_Txt.weekends = true;
Params_EndDate_Txt.tabIndex = 2;
Params_EndDate_Txt.helpText = "Enter the end date of the required reporting period";
Params_EndDate_Txt.isMandatory = function() {  return true; }
Params_EndDate_Txt.validateOn = [Params_EndDate_Txt.dataBinding];
Params_EndDate_Txt.validate = function()
{
	var supsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/SUPSLivedate/ItemValue");
	if ((supsLiveDate == null) || (supsLiveDate == ''))
	{
		return;
	}
    var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
    var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);    
    var ec = null;
    if(endDateObj == null || endDateObj == "")
    {
		endDate = getTodaysDate();
		Services.setValue(Params_EndDate_Txt.dataBinding, endDate);
		endDateObj = CaseManUtils.createDate(endDate);
    }
    ec = validateDate(endDateObj);
    return ec;
}

/****************************************************************************************/

function Params_SectionName_Sel(){};
Params_SectionName_Sel.srcData = REF_DATA_XPATH + "/Sections"; 
Params_SectionName_Sel.rowXPath = "Section";
Params_SectionName_Sel.keyXPath = "Id";
Params_SectionName_Sel.displayXPath = "Description";
Params_SectionName_Sel.helpText = "Select a section using the LOV or type % for all sections";
Params_SectionName_Sel.tabIndex = 3;
Params_SectionName_Sel.isMandatory = function() { return true; }
Params_SectionName_Sel.validateOn = [Params_SectionName_Sel.dataBinding];
Params_SectionName_Sel.validate = function (value)
{
	return validateParams_SectionName_Sel(value);
}

/****************************************************************************************/

function Params_SectionName_SelLOVButton() {};
Params_SectionName_SelLOVButton.tabIndex = 4;

/****************************************************************************************/

function Params_SectionName_SelLOVGrid() {};
Params_SectionName_SelLOVGrid.dataBinding = Params_SectionName_Sel.dataBinding;
Params_SectionName_SelLOVGrid.srcData = REF_DATA_XPATH + "/Sections";
Params_SectionName_SelLOVGrid.rowXPath = "Section";
Params_SectionName_SelLOVGrid.keyXPath = "Id";
Params_SectionName_SelLOVGrid.columns = [
	{xpath: "Id"},
	{xpath: "Description"}
];
Params_SectionName_SelLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Params_SectionName_SelLOVButton"} ],
		keys: [ { key: Key.F6, element: "Params_SectionName_Sel" } ]
	}
};

/****************************************************************************************/

function Params_PrintReport_Btn() {};
Params_PrintReport_Btn.tabIndex = 5;
Params_PrintReport_Btn.retrieveOn=[Params_EndDate_Txt.dataBinding];
Params_PrintReport_Btn.enableOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding, Params_SectionName_Sel.dataBinding];
Params_PrintReport_Btn.isEnabled = function()
{
	// CaseMan Defect 6195 - re-wrote the enablement functionality as just wasn't working
	var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
	var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
	var sectionName = Services.getValue(Params_SectionName_Sel.dataBinding);
	var blnEnabled = true;

	if ( CaseManUtils.isBlank(startDate) || !Services.getAdaptorById("Params_StartDate_Txt").getValid() )
	{
		// Start date is either blank or invalid
		blnEnabled = false;
	}
	else if ( CaseManUtils.isBlank(endDate) || !Services.getAdaptorById("Params_EndDate_Txt").getValid() )
	{
		// End date is either blank or invalid
		blnEnabled = false;
	}
	else if ( CaseManUtils.isBlank(sectionName) || !Services.getAdaptorById("Params_SectionName_Sel").getValid() )
	{
		// Section Name is either blank or invalid
		blnEnabled = false;
	}

	return blnEnabled;
}

Params_PrintReport_Btn.actionBinding = requestReport;

/****************************************************************************************/

function Status_Close_Btn() {};
Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "BMSReport" } ]
	}
};

Status_Close_Btn.tabIndex = 6;
Status_Close_Btn.actionBinding = exitScreen;

/***************** ORACLE REPORT POPUP FIELDS *******************************************/

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author rzmb1g
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}