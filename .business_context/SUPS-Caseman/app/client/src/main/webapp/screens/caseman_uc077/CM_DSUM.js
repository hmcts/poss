/****************************************************************************************************************
						Run End of Day Report: CM_DSUM
						
 * Change History *
 26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 									on the client as wrong message was being displayed. CaseMan TD4061, TD4065
 * 03/08/2006 - Mark Groen, Defect 3842 -  - The validation of the ReportReference XML returned to 
 *				client does not currently check to see whether a value has been returned for the Id tag.  
 *				When a report has not been generated for some reason, this Id tag will be empty.  
 *				The clients-side should check this, and report an error saying "Report 
 *				not generated!" when the Id tag is blank.  				
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


var aeRunDate 		= "";
var date 			= "";
var systemDate 		= "";
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
function YesOrNo() {}

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
YesOrNo.dataBinding = "/ds/var/page/OracleReportForm/YesOrNo";

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/
OwningCourt_Code.isReadOnly = function()
{ 
	return true;
}
OwningCourt_Name.isReadOnly = function()
{ 
	return true;
}


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
//	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
//	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);

	 // Get the court code
	 adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
	 
	StartOfDayUtils.checkSuitorsCashStartOfDay("SuitorsCashEndOfDay");

	StartOfDayUtils.checkSuitorsCashEndOfDay();

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
	// If the validation of the run report button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{ 
 	   //create a dom to pass to the interface service
 	   var dom = XML.createDOM(null, null, null);
 	   
 	   // generate a parameter dom that we shall pass to the interface service that will run the reports
	   var params = new ServiceParams();
	   //Services.callService("runSuitorsCashEndOfDayReport", params, runEndOfDayReportHandler, true);
	   Reports.callAsync("asyncSuitorsCashEndOfDayReport", params, CaseMan_AsyncMonitor.srcData);
	   Util.openPopup("CaseMan_AsyncMonitorPopup");		   
	   
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}	

/*****************************************************************************************************************
											GET RUN SUITORS CASH END OF DAY REPORT HANDLER
*****************************************************************************************************************/

 function runEndOfDayReportHandler (){};
         	
/**
 * @param exception
 * @author bz6s80
 * 
 */
runEndOfDayReportHandler.onError = function(exception)
{  
	var message = "An error occurred running the end of day report";
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

/**
 * @param resultDom
 * @author bz6s80
 * 
 */
runEndOfDayReportHandler.onSuccess = function(resultDom)
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
 * @author bz6s80
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
 * @author bz6s80
 * 
 */
function PollReport()
{
}

/**
 * @param dom
 * @author bz6s80
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
		Services.setTransientStatusBarMessage("Report Complete");
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
 * @author bz6s80
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

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author bz6s80
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
			
/** Misc Code for question YesOrNo support**/
YesOrNo.tabIndex = __tabIdx++;
YesOrNo.componentName = "Click on Run Report button to print this report.";		
YesOrNo.srcData = null;
YesOrNo.rowXPath = null;
YesOrNo.keyXPath = null;
YesOrNo.displayXPath = null;
YesOrNo.helpText = null;
		
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

Status_RunReportButton.validationList = [];
			
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
 * Displays the error message on the status bar
 * @param ec
 * @author bz6s80
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

/**
 * @author bz6s80
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
	
//Enable the Run report button when certain conditions are satisfied.
//Set the fields to watch, the nodes for the ref data shown below
Status_RunReportButton.enableOn = [REF_DATA_XPATH + "/EndOfDay"];
Status_RunReportButton.isEnabled = function()
{ 
	var hasRun = false;
    var endOfDay = Services.getNode(REF_DATA_XPATH + "/EndOfDay");
   	if ( endOfDay != null ) { 	
		hasRun = true;		
 	}	
 	return !hasRun;
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
	exitScreen();
}

/**
 * @param exception
 * @author bz6s80
 * 
 */
CaseMan_AsyncMonitor.onError = function(exception)
{
	//debugger;
	var message = "An error occurred running the end of day report";
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
    //exitScreen();
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
