/** 
 * @fileoverview NoticeOfNonExecutionOfWarrant.js:
 * This file conains the form and field configurations for the UC047 - 
 * Notice of Non Execution Of Warrant screen.
 *
 * @author 
 * @version 0.1
 *
 * Change History:
 * 03/08/2006 - Chris Vincent, removed the DefaultCurrency field as not used and moved the form
 * 				keyBindings to the additional Bindings of the buttons they are actually used on.
 * 03/08/2006 - Mark Groen, Defect 3842 -  - The validation of the ReportReference XML returned to 
 *				client does not currently check to see whether a value has been returned for the Id tag.  
 *				When a report has not been generated for some reason, this Id tag will be empty.  
 *				The clients-side should check this, and report an error saying "Report 
 *				not generated!" when the Id tag is blank.  
 * 
 *10 Aug 2006 - TD4177 Kevin Gichohi (EDS) - Changed Params_StartDate_Txt.setDefault to 
 * 	            Params_StartDate_Txt.initialise so that the field can have a default date. 
 */
		
var reportModuleGroup = ""
		
var __tabIdx = 300;


// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context


/**
 * Form element
 * @author rzmb1g
 * 
 */
function OracleReportForm() {}
		
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];
			
/*		
function requestReport()
{
	//debugger;
	Popup_Cancel.cancelled = false;
	var dom = Reports.createReportDom("CM_N317_45.rdf");
	
		//Is Question : 
				
	Reports.setValue(dom, "P_START_DATE",  CaseManUtils.convertDateToDisplay(Services.getValue(Params_StartDate_Txt.dataBinding)) );								
			

	Reports.runReport(dom);
}	
 */

function Params_StartDate_Txt() {}
Params_StartDate_Txt.dataBinding = "/ds/var/page/OracleReportForm/StartDate";

Params_StartDate_Txt.tabIndex = __tabIdx++;
Params_StartDate_Txt.componentName = "Return Date";		Params_StartDate_Txt.srcData = null;
Params_StartDate_Txt.rowXPath = null;
Params_StartDate_Txt.keyXPath = null;
Params_StartDate_Txt.displayXPath = null;
Params_StartDate_Txt.helpText = "Date for the returns";
Params_StartDate_Txt.isMandatory = function()
{
	return true;
}
Params_StartDate_Txt.validateOn = [Params_StartDate_Txt.dataBinding];
Params_StartDate_Txt.validate = function(value)
{
	
	    var startDate = Services.getValue(Params_StartDate_Txt.dataBinding);
	    var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);
	    var ec = null;
	    if(startDateObj != null)
	    {
	      ec = validateDate(startDateObj);      
	    }
	    return ec;		

}
 /** 10 Aug 2006 - TD4177 Kevin Gichohi (EDS) - Changed Params_StartDate_Txt.setDefault to 
  *  	          Params_StartDate_Txt.initialise so that the field can have a default date.
  * @author rzmb1g
  * 
  */
Params_StartDate_Txt.initialise = function()
{
	Services.setValue(Params_StartDate_Txt.dataBinding, getTodaysDate());
}
	

Status_RunReportButton.validationList = ["Params_StartDate_Txt"];
Params_StartDate_Txt.weekends = true;

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
Status_RunReportButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "OracleReportForm" } ]
	}
};
			
/**
 * @author rzmb1g
 * 
 */
Status_RunReportButton.actionBinding = function() 
{
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
	    var params = new ServiceParams();
	   params.addSimpleParameter("P_START_DATE",  CaseManUtils.convertDateToDisplay(Services.getValue(Params_StartDate_Txt.dataBinding)));

		//call the interface service	
 	    Services.callService("noticeOfNonExecutionOfWarrants", params, noticeOfNonExecutionOfWarrants, true);
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
function noticeOfNonExecutionOfWarrants()
{
}

/**
 * @param resultDom
 * @author rzmb1g
 * 
 */
noticeOfNonExecutionOfWarrants.onSuccess = function(resultDom)
{
	var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");
	// defect 3842, not used - var reportRefIdNode = resultDom.selectSingleNode("/ReportReference/Reference");
	if (reportIdNode != null)
	{
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
		Services.setTransientStatusBarMessage("Report generated successfully.");
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);

		//NavigationController.nextScreen(); // Goes back to calling screen
		exitScreen();
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
Status_Close_Btn.actionBinding = exitScreen;
Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "OracleReportForm" } ]
	}
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
	exitScreen();
}


/**
 * @author rzmb1g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
