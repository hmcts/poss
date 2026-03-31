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
		{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
		{ key: Key.F4, action: exitScreen }
];			
	
function Params_StartDate_Txt() {}
Params_StartDate_Txt.dataBinding = "/ds/var/page/OracleReportForm/StartDate";
Params_StartDate_Txt.tabIndex = __tabIdx++;
Params_StartDate_Txt.componentName = "Return Date";		
Params_StartDate_Txt.weekends = true;
Params_StartDate_Txt.helpText = "Date for the returns";
Params_StartDate_Txt.isMandatory = function() { return true; }
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

//Params_StartDate_Txt.initialise = function()
//{
//	Services.setValue(Params_StartDate_Txt.dataBinding, getTodaysDate());
//}

Status_RunReportButton.validationList = ["Params_StartDate_Txt"];	

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

OracleReportForm.initialise = function()
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
	Services.setValue(Params_StartDate_Txt.dataBinding, getTodaysDate());
}			

function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * @author rzmb1g
 * 
 */
Status_RunReportButton.actionBinding = function() 
{
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
	    var params = new ServiceParams();
		var returnDate = Services.getValue(Params_StartDate_Txt.dataBinding);
		params.addSimpleParameter( "returnDate", returnDate );

		//call the interface service	
 	    Services.callService("getEx77WelshFlags", params, Status_RunReportButton, true);
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}

Status_RunReportButton.onSuccess = function(dom)
{
	if (dom != null)
	{
		Services.replaceNode(PAGE_XPATH + "/EX77Data", dom);
		var welshEX77Count = Services.countNodes(PAGE_XPATH + "/EX77Data/EX77Row[./WelshFlag = 'Y']");
		var EX77Count = Services.countNodes(PAGE_XPATH + "/EX77Data/EX77Row[./WelshFlag = 'N']");
		if ( welshEX77Count == 0 && EX77Count == 0 )
		{
			// Error - no outputs to print
			alert("Warning - there are no EX77 - interim reports to print for this return date.");
		}
		else
		{
			if ( welshEX77Count > 0 )
			{
				// Show Welsh warning
				alert("Warning - at least one EX77 requires a translation to Welsh and cannot be bulk printed.\n"+
					  "Please check your printer for copies that do require translation.");
			}
			var params = new ServiceParams();
			var returnDate = Services.getValue(Params_StartDate_Txt.dataBinding);
			params.addSimpleParameter( "returnDate", CaseManUtils.convertDateToDisplay(returnDate) );
			params.addSimpleParameter( "countWelshEX77", welshEX77Count );
			params.addSimpleParameter( "countEX77", EX77Count );

			//call the interface service	
			Services.callService("printEX77Report", params, printEX77Report, true);
		}
	}
}

/**
 * @author rzmb1g
 * 
 */
function printEX77Report() {}
printEX77Report.onSuccess = function(resultDom)
{
	var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");
	if (reportIdNode != null)
	{	
		var reportId = XML.getNodeTextContent(reportIdNode);
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
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	
	document.getElementById('Progress_Status').innerHTML = getStatusBarMessage(status);
	
	if(status == '5') // Cancelled
	{
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
	}
	else if(status == '4') // Error
	{
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		document.getElementById('Progress_Status').innerHTML = errorDesc;	
	}	
	else if (status == "2")
	{
		// Show PDF
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);
		Services.setTransientStatusBarMessage("Report generated successfully.");
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
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

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
