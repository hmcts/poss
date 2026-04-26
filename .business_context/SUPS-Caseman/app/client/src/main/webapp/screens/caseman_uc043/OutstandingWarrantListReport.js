/** 
 * @fileoverview OutstandingWarrantListReport.js:
 * This file conains the form and field configurations for the UC043 - 
 * Outstanding Warrant List screen.
 *
 * @author 
 * @version 0.1
 *
 * Change History:
 * 03/08/2006 - Chris Vincent, changed maxLength of the currency field from 1 to 3 as needs to store
 * 				either GBP or EUR.
 * 03/08/2006 - Mark Groen, Defect 3842 -  - The validation of the ReportReference XML returned to 
 *				client does not currently check to see whether a value has been returned for the Id tag.  
 *				When a report has not been generated for some reason, this Id tag will be empty.  
 *				The clients-side should check this, and report an error saying "Report 
 *				not generated!" when the Id tag is blank. 
 * 14/08/2006 - MGG - defect 4215 - Default values not being set correctly. 
 *				Moved from the setDefault method - as setDefault needs a setDefaultOn, 
 *				changed to initialize. 
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
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
	{name:"WarrantTypes", dataBinding:REF_DATA_XPATH, serviceName:"getWarrantTypes", serviceParams:[]},
	{name:"CurrentCurrency", dataBinding:REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

function DefaultCurrency() {}
DefaultCurrency.dataBinding = "/ds/OracleReportForm/curr";
DefaultCurrency.tabIndex = -1;
DefaultCurrency.maxLength = 3;
DefaultCurrency.isReadOnly = function(){return true;}
DefaultCurrency.isTemporary = function(){return true;}
DefaultCurrency.transformToDisplay = function(value) 
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}
DefaultCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}								


function IssueDate() {}
IssueDate.dataBinding = "/ds/var/page/OracleReportForm/IssueDate";


function WarrantAmount() {}
WarrantAmount.dataBinding = "/ds/var/page/OracleReportForm/WarrantAmount";

	
function BailiffId() {}
BailiffId.dataBinding = "/ds/var/page/OracleReportForm/BailiffId";

		
function WarrantType() {}
WarrantType.dataBinding = "/ds/var/page/OracleReportForm/WarrantType";

	
function ReturnClass() {}
ReturnClass.dataBinding = "/ds/var/page/OracleReportForm/ReturnClass";

		
IssueDate.tabIndex = __tabIdx++;
IssueDate.componentName = "Warrant Issued Before";		IssueDate.srcData = null;
IssueDate.rowXPath = null;
IssueDate.keyXPath = null;
IssueDate.displayXPath = null;
IssueDate.helpText = "Enter A Date One Month Prior To Todays Date";
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
      ec = validateDate(issueDateObj);     
    }
    return ec;		

	}
/**
 * @author rzmb1g
 * 
 */
IssueDate.initialise = function()
	{

Services.setValue(IssueDate.dataBinding, getOneMonthBeforeDate());

	}

Status_RunReportButton.validationList = ["IssueDate", "WarrantAmount", "BailiffId", "WarrantType", "ReturnClass"];	
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
 * @return oneMonthBeforeDateObj  
 */
function getOneMonthBeforeDate()
{    
  var todaysDate = CaseManUtils.createDate(getTodaysDate()); 
  var oneMonthBeforeDateObj = CaseManUtils.monthsInPast(todaysDate, 1);
  oneMonthBeforeDateObj = CaseManUtils.convertDateToPattern(oneMonthBeforeDateObj,"YYYY-MM-DD");
  return oneMonthBeforeDateObj;
}					
		
WarrantAmount.tabIndex = __tabIdx++;
WarrantAmount.componentName = "Minimum Warrant Amount";		WarrantAmount.srcData = null;
WarrantAmount.rowXPath = null;
WarrantAmount.keyXPath = null;
WarrantAmount.displayXPath = null;
WarrantAmount.helpText = "Enter minimum amount for inclusion in report, 0 for all amounts";
WarrantAmount.maxLength = 8;
WarrantAmount.isMandatory = function()
{
	return true;
}
WarrantAmount.validate = function(value)
{

	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) 
	{
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
	}
	return errCode;
}
/**
 * @author rzmb1g
 * 
 */
WarrantAmount.initialise = function()
{
	Services.setValue(WarrantAmount.dataBinding, "0");
}
		

BailiffId.tabIndex = __tabIdx++;
BailiffId.componentName = "Bailiff Id";		BailiffId.srcData = null;
BailiffId.rowXPath = null;
BailiffId.keyXPath = null;
BailiffId.displayXPath = null;
BailiffId.helpText = "Enter the bailiff identifier. Use % for all areas";
BailiffId.maxLength = 2;
BailiffId.isMandatory = function()
{
		return true;
}
BailiffId.validate = function(value)
{
	
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (value == "%")
	{
		return null;
	}
	if (!CaseManUtils.isBlank(value)) 
	{
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.NUMERIC_PATTERN, "CaseMan_NotNumericValue_Msg");
	}
	if (value == "99")
	{
		errCode = ErrorCode.getErrorCode("CaseMan_BailiffCannotBe99_Msg");				
	}
	return errCode;	

}

/**
 * @author rzmb1g
 * 
 */
BailiffId.initialise = function()
{
	Services.setValue(BailiffId.dataBinding, "%");
}
			
WarrantType.tabIndex = __tabIdx++;
WarrantType.componentName = "Warrant Type";		WarrantType.srcData = null;
WarrantType.rowXPath = null;
WarrantType.keyXPath = null;
WarrantType.displayXPath = null;
WarrantType.helpText = "Enter the type of warrant required. Use % for all types.";
WarrantType.maxLength = 10;
WarrantType.isMandatory = function()
{
	return true;
}
WarrantType.validate = function(value)
{
	return validateWarrantType();	
}
/**
 * @author rzmb1g
 * 
 */
WarrantType.initialise = function()
{
	Services.setValue(WarrantType.dataBinding, "%");
}
	/** Misc Code for question WarrantType support**/


WarrantType.srcData = REF_DATA_XPATH + "/WarrantTypes";
WarrantType.rowXPath = "WarrantType";
WarrantType.keyXPath = "Type";
WarrantType.displayXPath = "Type";
	
/**
 * @author rzmb1g
 * @return null , ec  
 */
function validateWarrantType()
{
	var enteredValue = Services.getValue(WarrantType.dataBinding);
	if (enteredValue == "%")
	{
		return null;
	}
	var found = false;
	var ec = null;
	var numberOfWarrantTypes = Services.getNodes(REF_DATA_XPATH + "/WarrantTypes/WarrantType").length;
	for(var i=1; i <= numberOfWarrantTypes; i++)
	{
		var type = Services.getValue(REF_DATA_XPATH + "/WarrantTypes/WarrantType[" + i + "]/Type");
		if (type == enteredValue)
		{
			found = true;
			break;
		}
	}
	if (!found)
	{
		Services.setFocus("WarrantType");
		ec = ErrorCode.getErrorCode("CaseMan_warrantTypeInvalid_Msg");
		faildedValidation (ec);
	}
	return ec;
}			
	
function WarrantTypeLOVButton() {}
WarrantTypeLOVButton.tabIndex = __tabIdx++;

function WarrantTypeLOVGrid() {};
WarrantTypeLOVGrid.dataBinding = WarrantType.dataBinding;
WarrantTypeLOVGrid.srcData = REF_DATA_XPATH + "/WarrantTypes";
WarrantTypeLOVGrid.rowXPath = "WarrantType";
WarrantTypeLOVGrid.keyXPath = "Type";
WarrantTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];
/**
 * @author rzmb1g
 * @return "WarrantType"  
 */
WarrantTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "WarrantType";
}
WarrantTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "WarrantTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "WarrantType" } ]
	}
};
					
/** End of Misc Code for question WarrantType support **/		
/** End of WarrantType **/

			/**
			Question: 
		../Questions/CM_OSWF_QUESTION_5.xml
			**/			
ReturnClass.tabIndex = __tabIdx++;
ReturnClass.componentName = "Return Class";		ReturnClass.srcData = null;
ReturnClass.rowXPath = null;
ReturnClass.keyXPath = null;
ReturnClass.displayXPath = null;
ReturnClass.helpText = "Enter (1)-held by bailiff or (2)-held in office. Press % for all.";
ReturnClass.maxLength = 1;
ReturnClass.isMandatory = function()
{
	return true;
}
ReturnClass.validate = function(value)
{
	var value = Services.getValue(this.dataBinding);
	if (value == "%")
	{
		return null;
	}
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.NUMERIC_PATTERN, "CaseMan_returnClassInvalid_Msg");
	}
	if ((value > 2) || (value < 1))
	{
		errCode = ErrorCode.getErrorCode("CaseMan_returnClassInvalid_Msg");
	}
	return errCode;

}
/**
 * @author rzmb1g
 * 
 */
ReturnClass.initialise = function()
{
	Services.setValue(ReturnClass.dataBinding, "%");
}
		
/** End of ReturnClass **/
	
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
	   params.addSimpleParameter("P_WARRANT_ISSUE_DATE", CaseManUtils.convertDateToDisplay(Services.getValue(IssueDate.dataBinding)));
	   params.addSimpleParameter("P_WARRANT_AMOUNT", Services.getValue(WarrantAmount.dataBinding));
	   params.addSimpleParameter("P_BAILIFF_ID", Services.getValue(BailiffId.dataBinding));
	   params.addSimpleParameter("P_WARRANT_TYPE", Services.getValue(WarrantType.dataBinding));
	   params.addSimpleParameter("P_RETURN_CLASS", Services.getValue(ReturnClass.dataBinding));

		//call the interface service	
 	    Services.callService("printOutstandingWarrantListReport", params, printOutstandingWarrantListReport, true);
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
function printOutstandingWarrantListReport()
{
}

/**
 * @param resultDom
 * @author rzmb1g
 * 
 */
printOutstandingWarrantListReport.onSuccess = function(resultDom)
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
	// defect 3842 - removed, output if succesfull or not - Services.setTransientStatusBarMessage("Report generated successfully.")       	 
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
}


/**
 * @author rzmb1g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
