/** 
 * @fileoverview BMSReport.js:
 *
 * @version 1.0
 * local V2
 *
 * Change History
 * 22/08/2006 - Mark Groen: Defect 4518. Ensure the start and end dates are valid before selecting the run report button
 * 29/09/2006 - Mark Groen: Defect 5491. Message re bms live being displayed 3 times
 * 20/09/2007 - Chris Vincent: CaseMan Defect 6317.  Removed getTransformedBMSLiveDate() as has been replaced by
 * 				CaseManUtils.getBMSLiveDateObject().
 *
 */
/*****************************************************************************************************************
                                        GLOBAL VARIABLES
*****************************************************************************************************************/

// XPath constants
var REF_DATA_XPATH = "/ds/var/form/ReferenceData";
var PAGE_XPATH = "/ds/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/BMSReport";  // Place all input/output data in page context

var startDateValue;
var endDateValue;
//var sectionNameValue;
/*****************************************************************************************************************
                                        OBJECTS
*****************************************************************************************************************/
function BMSReport() {};
function Params_StartDate_Txt() {};
function Params_EndDate_Txt() {};
function Status_Close_Btn() {};
var endDateValid = false;
var startDateValid = false;
/*****************************************************************************************************************
                                        DATA BINDINGS
*****************************************************************************************************************/
Params_EndDate_Txt.dataBinding =     PAGE_BMSR_XPATH + "/EndDate";
Params_StartDate_Txt.dataBinding =   PAGE_BMSR_XPATH + "/StartDate";
Params_PrintReport_Btn.dataBinding = "/ds/var/page/printval";
/*****************************************************************************************************************/
BMSReport.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"SystemData", dataBinding:REF_DATA_XPATH, serviceName:"getBmsLiveDate", serviceParams:[{name:"courtCode",value:CaseManFormParameters.COURTNUMBER_XPATH}]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

function OwningCourt_Name() {}
function OwningCourt_Code() {}

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
OwningCourt_Code.isReadOnly = function()
{ 
	return true;
}
OwningCourt_Name.isReadOnly = function()
{ 
	return true;
}


/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/**
 * @author sz0sb5
 * @return to Main Menu")  
 */
BMSReport.initialise = function () 
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);	
		
	var bmsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
	if ((bmsLiveDate == null) || (bmsLiveDate == ''))
	{
		alert("BMS Live date is not specified in SYSTEM_DATA table for this court.(item=BMS_LIVE_DATE, item_value=YYYYMMDD).\r\n\r\nClick OK button to return to Main Menu");
		Services.navigate(NavigationController.MAIN_MENU);
	}
	// uct 516 - do not require message here - moved to validation re start date
	/*else
	{
		alert("BMS Live Date is : " + getTransformedBMSLiveDateForDisplay());
		//transformBMSLiveDate();
	}*/
}

Params_StartDate_Txt.weekends = true;
Params_StartDate_Txt.tabIndex = 1;
Params_StartDate_Txt.helpText = "Enter the start date of the required reporting period";
Params_StartDate_Txt.isMandatory = function()
{
  return true;
}

Params_StartDate_Txt.validateOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding];

Params_StartDate_Txt.validate = function(event)
{

			var bmsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
			if ((bmsLiveDate == null) || (bmsLiveDate == ''))
			{
				return;
			}
		    var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
		    var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
		    var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
			var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
		    startDateValid = false;
		    var ec = null;
		    if(startDateObj != null)
		    {
		      // Defect 4518. Ensure the start and end dates are valid before selecting the run report button.  
		      // Make a call to ensure the date is valid
		      var validDate = FWDateUtil.parseXSDDate(startDate);
		      if(validDate == null){
		      	ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		      }
		      else{
			      ec = validateDate(startDateObj, event);    
			      if(ec == null)
			      {
			      	var bmsDateAsObj = CaseManUtils.getBMSLiveDateObject(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
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
				    else
				    {
				      startDateValue = startDate;
				      startDateValid = true;
				    }
			      } 
			  }    
		    }

    return ec;
   // Params_PrintReport_Btn.isEnabled();
 }

/**********************************************************************************/
Params_EndDate_Txt.weekends = true;
Params_EndDate_Txt.tabIndex = 2;
Params_EndDate_Txt.helpText = "Enter the end date of the required reporting period";
Params_EndDate_Txt.isMandatory = function()
{
  return true;
}
Params_EndDate_Txt.setDefaultOn = ['/'];
/**
 * @author sz0sb5
 * 
 */
Params_EndDate_Txt.setDefault = function()
{
	Services.setValue(Params_EndDate_Txt.dataBinding, getTodaysDate());
}
Params_EndDate_Txt.validateOn = [Params_EndDate_Txt.dataBinding];

Params_EndDate_Txt.validate = function(event)
{

		var bmsLiveDate = Services.getValue(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
		if ((bmsLiveDate == null) || (bmsLiveDate == ''))
		{
			return;
		}
	    var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
	    var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);    
	    var ec = null;
	    endDateValid = false;
	    if(endDateObj == null || endDateObj == "")
	    {
	      endDate = getTodaysDate();
	      Services.setValue(Params_EndDate_Txt.dataBinding, endDate);
	      endDateObj = CaseManUtils.createDate(endDate);
	    }
	    // Defect 4518. Ensure the start and end dates are valid before selecting the run report button.  
	    // Make a call to ensure the date is valid
	    var validDate = FWDateUtil.parseXSDDate(endDate);
	    if(validDate == null){
	      	ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
	      }
	    else{
		    ec = validateDate(endDateObj, event);
		    if(ec == null)
		    {
		      endDateValue = endDate;
		      endDateValid = true;
		    }
		    else
		    {
		      endDateValid = false;
		    }
		    Params_StartDate_Txt.validate();
		}

    //Params_PrintReport_Btn.isEnabled();
    return ec;
}



/**********************************************************************************/
function Params_PrintReport_Btn() {};

Params_PrintReport_Btn.tabIndex = 4;
Params_PrintReport_Btn.enableOn = [Params_StartDate_Txt.dataBinding, Params_EndDate_Txt.dataBinding];
Params_PrintReport_Btn.isEnabled = function()
{
  // Defect 4518. Ensure the start and end dates are valid before selecting the run report button.  
  // Ensure the button is enabled correctly - therefore re write was required.
  /*  old code that didn't work
  if(endDateValid && startDateValid)
  {
    return true;
  }
  else
  {
    return false;
  }
  */
  var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
  var endDate = Services.getValue(Params_EndDate_Txt.dataBinding);
  var enabled = true;
  var ec = null;
  
  if(endDate == null || endDate == "" || startDate == null || startDate == ""){
  	enabled = false;  
  }
  else{
  	ec = Params_EndDate_Txt.validate();
  	if(ec == null){
  		ec = Params_StartDate_Txt.validate();  
  		if(ec != null){
  			enabled = false;
  		}  
  	}
  	else{
  		enabled = false; 
  	}
  }
  return enabled;
  
}

/**
 * @author sz0sb5
 * 
 */
Params_PrintReport_Btn.actionBinding = function()
{
	requestReport();
}

Params_PrintReport_Btn.retrieveOn=[Params_EndDate_Txt.dataBinding, Params_StartDate_Txt.dataBinding];
/*****************************************************************************************************************
                                        HELPER FUNCTIONS
*****************************************************************************************************************/

/**
 * @author sz0sb5
 * 
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
/****************************************************************************************************/
/**
 * @author sz0sb5
 * 
 */
function requestReport()
{
	Popup_Cancel.cancelled = false;
	var dom = Reports.createReportDom("CM_BMS_ALL.rdf");
	CaseManUtils.convertDateToDisplay(startDateValue)

	Reports.setValue(dom, "P_REPORT_START_DATE", CaseManUtils.convertDateToDisplay(startDateValue) );
	Reports.setValue(dom, "P_REPORT_END_DATE",   CaseManUtils.convertDateToDisplay(endDateValue));
	Reports.setValue(dom, "P_SECTION", "");
	Reports.runReport(dom);
}

/**
 * @param ec
 * @author sz0sb5
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
 * @author sz0sb5
 * @return CaseManUtils.convertDateToPattern(bmsLiveDateObj, CaseManUtils.DATE_DISPLAY_FORMAT)  
 */
function getTransformedBMSLiveDateForDisplay()
{
	var bmsLiveDateObj = CaseManUtils.getBMSLiveDateObject(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
	return CaseManUtils.convertDateToPattern(bmsLiveDateObj, CaseManUtils.DATE_DISPLAY_FORMAT);
}

/**
 * @param dateObj
 * @param event
 * @author sz0sb5
 * @return null , faildedValidation (ec)  
 */
function validateDate(dateObj, event)
{    
  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
  var bmsLiveDateObj = CaseManUtils.getBMSLiveDateObject(REF_DATA_XPATH + "/ds/BMSLivedate/ItemValue");
  if(CaseManUtils.compareDates(todayDateObj, dateObj)!= 1 )
  { 
    if(CaseManUtils.compareDates(bmsLiveDateObj, dateObj) != -1)
    {
      return null;
    }
    else
    {
      //uct  defect 516 - message required for start date and bms validation
	  // I.e. Start date cannot be prior to BMS Live Date
	  
	  // defect 5491 - message being displayed 3 times
	  if(event != null){
	  	if(event.getXPath() == Params_StartDate_Txt.dataBinding || 
	  			event.getXPath() == Params_EndDate_Txt.dataBinding){
	  		alert("Start date cannot be prior to the BMS Live Date. The BMS Live Date is : " + getTransformedBMSLiveDateForDisplay());
     	}
     }
      ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeEarlierThanBMSLiveDate_Msg");
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


Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "BMSReport" } ]
	}
};

Status_Close_Btn.tabIndex = 5;
/**
 * @author sz0sb5
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/**
 * @author sz0sb5
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

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author sz0sb5
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}
