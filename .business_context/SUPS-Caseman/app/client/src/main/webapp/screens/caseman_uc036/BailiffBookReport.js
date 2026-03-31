/** 
 * Changes:
 * 03/08/2006 - Mark Groen, Defect 3842 -  - The validation of the ReportReference XML returned to 
 *				client does not currently check to see whether a value has been returned for the Id tag.  
 *				When a report has not been generated for some reason, this Id tag will be empty.  
 *				The clients-side should check this, and report an error saying "Report 
 *				not generated!" when the Id tag is blank. 
 * 11/08/2006   MGG - defect 4198 - Default value not being set correctly. 
 *				Moved from the setDefault method - as setDefault needs a setDefaultOn and replaced with an initialise call
 */


var reportModuleGroup = ""

var __tabIdx = 300;

var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context



function OracleReportForm() {}
		
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];					


OracleReportForm.keyBindings = [
/**
 * @author rzmb1g
 * 
 */
		{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
		{ key: Key.F4, action: exitScreen }
];			
	

function IssueDate() {}
IssueDate.dataBinding = "/ds/var/page/OracleReportForm/IssueDate";

		
IssueDate.tabIndex = __tabIdx++;
IssueDate.componentName = "Issue Date";		IssueDate.srcData = null;
IssueDate.rowXPath = null;
IssueDate.keyXPath = null;
IssueDate.displayXPath = null;
IssueDate.helpText = "Enter an Issue Date in Past, eg 01-APR-2001";

IssueDate.isMandatory = function()
{
	return true;
}

IssueDate.validateOn = [IssueDate.dataBinding];

IssueDate.validate = function(value)
{

    var issueDate = Services.getValue(IssueDate.dataBinding);
    var issueDateObj = CaseManUtils.isBlank(issueDate) ? null : CaseManUtils.createDate(issueDate);
    var ec = null;
    if(issueDateObj != null)
    {
      ec = validatePastDate(issueDateObj);     
    }
    return ec;		
}

/**
 * @author rzmb1g
 * 
 */
IssueDate.initialise = function()
{
	Services.setValue(IssueDate.dataBinding, CaseManUtils.convertDateToPattern(CaseManUtils.daysInPast(CaseManUtils.createDate(getTodaysDate()), 1, true), CaseManUtils.DATE_MODEL_FORMAT));
}

Status_RunReportButton.validationList = ["IssueDate"];	
/**
 * @param dateObj
 * @author rzmb1g
 * @return faildedValidation (ec) , null  
 */
function validatePastDate(dateObj)
{    
  //debugger;
  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
  if(CaseManUtils.compareDates(todayDateObj, dateObj) == 0 || CaseManUtils.compareDates(todayDateObj, dateObj) == 1)
  {
    ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
    return faildedValidation (ec);
  }
  else
  {
	return null;
  }      
  return null;   
}		

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

/**
 * @author rzmb1g
 * 
 */
OracleReportForm.initialise = function()
{
	//debugger;
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
}			

function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * @author rzmb1g
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
	    var params = new ServiceParams();
	   params.addSimpleParameter("IssueDate", CaseManUtils.convertDateToDisplay(Services.getValue(IssueDate.dataBinding)));

		//call the interface service	
 	    Services.callService("printBailiffBookReport", params, printBailiffBookReport, true);
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}

/**
 * @author rzmb1g
 * 
 */
function printBailiffBookReport()
{
}

/**
 * @param resultDom
 * @author rzmb1g
 * 
 */
printBailiffBookReport.onSuccess = function(resultDom)
{
	var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");
	// defect 3842, not used - var reportRefIdNode = resultDom.selectSingleNode("/ReportReference/Reference");
	if (reportIdNode != null)
	{
		// defect 3842 - if report id not present, do no processing as something gone wrong		
		var reportId = XML.getNodeTextContent(reportIdNode);
		// defect 3842, not used - var reportRefId = XML.getNodeTextContent(reportRefIdNode);
		if(reportId != null && reportId != ""){
			Services.replaceNode("/ds/ReportReference", resultDom);
			Services.setValue(Progress_Bar.dataBinding, "||");
			document.getElementById('Progress_Status').innerHTML = "";
			Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_RAISE);
			pollContentStore();
		}
		else{
			Services.setTransientStatusBarMessage("Report not generated.")       
		}		
	}
	else{
		Services.setTransientStatusBarMessage("Report not generated.")       
	}	
}			

/**
 * @author rzmb1g
 * 
 */
function pollContentStore() 
{
	Services.setValue(Progress_Bar.dataBinding, Services.getValue(Progress_Bar.dataBinding) + "||");
	var resultNode = Services.getNode("/ds/ReportReference");
	var params = new ServiceParams();
	params.addNodeParameter("ReportReference", resultNode);		
	
	if(!Popup_Cancel.cancelled) 
	{
		Services.callService("getReport", params, PollReport, null);
	}
}

/**
 * @author rzmb1g
 * 
 */
function PollReport()
{
}

/**
 * @param dom
 * @author rzmb1g
 * 
 */
PollReport.onSuccess = function(dom)
{
	//debugger;
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	
	document.getElementById('Progress_Status').innerHTML = getStatusBarMessage(status);
	
	if(status == '5') // Cancelled
	{
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		//NavigationController.nextScreen(); // Goes back to calling screen
	}
	else if(status == '4') // Error
	{
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		document.getElementById('Progress_Status').innerHTML = errorDesc;	
		//NavigationController.nextScreen(); // Goes back to calling screen
	}	
	else if (status == "2")
	{
		// Show PDF
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);
		// defect 3842
		Services.setTransientStatusBarMessage("Report generated successfully.");
		//NavigationController.nextScreen(); // Goes back to calling screen
	}
	else
	{
		getcontentStore = window.setTimeout("pollContentStore()", 2000);
		
	}

}

var getcontentStore = null;


/**
 * @param status
 * @author rzmb1g
 * @return " Status, Report has been queued" , Report is being generated" , Report is being saved" , Report generation has completed" , " Ststus, Error in producing Report" , " "  
 */
function getStatusBarMessage(status) {
	switch(status) {
		case "0":
		return " Status: Report has been queued";
		break;
		
		case "1":
		return " Status: Report is being generated";
		break;
		
		case "2":
		return " Status: Report is being saved";
		break;
		
		case "3":
		return " Status: Report generation has completed";
		break;
		
		case "4":
		return " Ststus: Error in producing Report";
		break;
		
		case "5":
		return " ";
		break;
	}
}



function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author rzmb1g
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/**
 * @param p_startDate
 * @param p_endDate
 * @author rzmb1g
 * @return ec  
 */
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
		      //faildedValidation (ec);
		    }
	    }
      }      
    }
    return ec;				
}

/**
 * @param p_startDate
 * @param p_endDate
 * @author rzmb1g
 * @return ec  
 */
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

/**
 * @param p_startDate
 * @param p_endDate
 * @author rzmb1g
 * @return ec  
 */
function validateStartDateForBMSLiveDate(p_startDate, p_endDate)
{
    var startDate = Services.getValue(p_startDate.dataBinding);
    var endDate = Services.getValue(p_endDate.dataBinding);
    var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
    var ec = null;
    if(startDateObj != null)
    {
      ec = validateDateForBMSLiveDate(startDateObj);
      if(ec == null)
      {
      	if (endDateObj != null)
      	{
	        if (CaseManUtils.compareDates(startDateObj, endDateObj) == -1)
		    {
		      ec = ErrorCode.getErrorCode("CaseMan_startDateCannotBeLaterThanEndDate_Msg");
		      //faildedValidation (ec);
		    }
	    }
      }      
    }
    return ec;				
}

/**
 * @param dateObj
 * @author rzmb1g
 * @return null , faildedValidation (ec)  
 */
function validateDateForBMSLiveDate(dateObj)
{    
  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
  var bmsLiveDateObj = new Date(2005, 0, 1);
  if(CaseManUtils.compareDates(todayDateObj, dateObj)!= 1 )
  { 
    if(CaseManUtils.compareDates(bmsLiveDateObj, dateObj) != -1)
    {
      return null;
    }
    else
    {
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

/**
 * @param dateObj
 * @author rzmb1g
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
 * @author rzmb1g
 * @return monthStartDateObj  
 */
function getMonthStartDate()
{    
  var todaysDate = CaseManUtils.createDate(getTodaysDate()); 
  todaysDate.setDate("01");
  //alert(todaysDate);
  var monthStartDateObj = CaseManUtils.convertDateToPattern(todaysDate,"YYYY-MM-DD");
  //alert(monthStartDateObj);
  return monthStartDateObj;
}

/**
 * @author rzmb1g
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

/**
 * @param inputString
 * @author rzmb1g
 * @return inputString  
 */
function removeSpaces(inputString) {
   // Removes any spaces from the passed string.
   if (typeof inputString != "string") return inputString;
   var retValue = inputString;
   var ch = retValue.substring(0, 1);
	
   while (ch == " ") { // Check for spaces at the beginning of the string
	  retValue = retValue.substring(1, retValue.length);
	  ch = retValue.substring(0, 1);
   }
   ch = retValue.substring(retValue.length - 1, retValue.length);
	
   while (ch == " ") { // Check for spaces at the end of the string
	  retValue = retValue.substring(0, retValue.length - 1);
	  ch = retValue.substring(retValue.length - 1, retValue.length);
   }
	
	// Note that there are two spaces in the string - look for multiple spaces within the string
   while (retValue.indexOf(" ") != -1) {
		// Again, there are spaces in each of the strings
	  retValue = retValue.substring(0, retValue.indexOf(" ")) + retValue.substring(retValue.indexOf(" ") + 1, retValue.length);
   }
   return retValue; // Return the trimmed string back to the user
}			

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author rzmb1g
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}


/**
 * @author rzmb1g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
