/****************************************************************************************************************
											CM_SOD_F1 : Suitor's Cash Start Of Day	
											
  * Change History *
 26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 									on the client as wrong message was being displayed.	CaseMan TD4061																			
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

var START_OF_DAY_LOCK_IND_XPATH = REF_DATA_XPATH + "/StartOfDayLockApplied";
var REPORT_DATA_XPATH = REF_DATA_XPATH + "/ReportData";
var SYSTEM_DATA_XPATH = REF_DATA_XPATH + "/SystemData";
var START_OF_DAY_IS_RUNNING_XPATH = REF_DATA_XPATH + "/StartOfDayRunning";

var courtCode = "";

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author hzw6j7
 * 
 */
function OracleReportForm() {}
					
// load the System Date into the XML	
OracleReportForm.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
	{ name:"Courts",         dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort",    serviceParams:[]}
];
			
// Define the form key bindings
OracleReportForm.keyBindings = [
	{ 
/**
 * @author hzw6j7
 * 
 */
		key: Key.F3, action: function() 
		{ 
			Status_Proceed_Button.actionBinding(); 
		} 
	},
	
	{ 
		key: Key.F4, action: exitScreen 
	}
];			
			
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
			
/**
 * Create the Owning Court Name and Code objects
 * @author hzw6j7
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}
			
// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode"
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/
/**
 * Make the Owning Court Name, Code fields and text area read only
 * @author hzw6j7
 * @return boolean 
 */
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
 * Create and initialise the variables, XPaths etc.
 * @author hzw6j7
 * 
 */
OracleReportForm.initialise = function()
{
	Services.setValue(START_OF_DAY_LOCK_IND_XPATH, "false");
	Services.setValue(START_OF_DAY_IS_RUNNING_XPATH, "false");

	courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", courtCode);
				
    //Check the Suitors Cash Start Of Day report is not currently running
	Services.setValue(REPORT_DATA_XPATH + "/ReportType", "SOD");
	Services.setValue(REPORT_DATA_XPATH + "/ReportDate", CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );
	Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", 0);
	Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser());
	Services.setValue(REPORT_DATA_XPATH + "/CourtCode", courtCode);

	// Get the system date in YYYY-MM-DD format
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	// Return system date as a string in YYYYMMDD format
	var systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	Services.startTransaction();
    Services.setValue(SYSTEM_DATA_XPATH + "/Item", "CFO RUNDATE");	    
    Services.setValue(SYSTEM_DATA_XPATH + "/ItemValue", systemDate);
    Services.setValue(SYSTEM_DATA_XPATH + "/AdminCourtCode", courtCode);
    //Services.setValue(SYSTEM_DATA_XPATH + "/ItemValueCurrency", 0);
   	Services.endTransaction();
    
}	
	

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
function Status_Proceed_Button() {}
Status_Proceed_Button.tabIndex = __tabIdx++;
/**
 * @author hzw6j7
 * 
 */
Status_Proceed_Button.actionBinding = function() 
{
	var params = new ServiceParams();
	var dataNode = XML.createDOM(null, null, null);
	var dataNode2 = XML.createDOM(null, null, null);
	
	dataNode.appendChild(Services.getNode(REPORT_DATA_XPATH));
	params.addDOMParameter("reportData", dataNode);
	params.addSimpleParameter("adminCourtCode", courtCode);

    dataNode2.appendChild(Services.getNode(SYSTEM_DATA_XPATH));
    params.addDOMParameter("systemData", dataNode2);

/**	19-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and runStartOfDayReports is
	never called. This was implemented as part of CR 0153 - KG						   
	 //Services.callService("runSuitorsCashStartOfDay", params, runSuitorsCashStartOfDayHandler, true);  */
				   
	Reports.callAsync("asyncScStartOfDay", params, CaseMan_AsyncMonitor.srcData);
	Util.openPopup("CaseMan_AsyncMonitorPopup");

				
}

Status_Proceed_Button.validationList = [];
Status_Proceed_Button.enableOn = [START_OF_DAY_LOCK_IND_XPATH];
Status_Proceed_Button.isEnabled = function()
{ 
    var lockStatus = Services.getValue(START_OF_DAY_LOCK_IND_XPATH);
    return (lockStatus == "false");
}	

/*****************************************************************************************************************/	

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author hzw6j7
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

Status_Close_Btn.enableOn = [START_OF_DAY_LOCK_IND_XPATH];
Status_Close_Btn.isEnabled = function()
{ 
    var lockStatus = Services.getValue(START_OF_DAY_LOCK_IND_XPATH);
    return (lockStatus == "true");
}	

/*****************************************************************************************************************/	
		
/**
 * Exits the screen back to the case maintenance menu
 * @author hzw6j7
 * 
 */
function exitScreen()
{
	var startOfDayRunning = Services.getValue(START_OF_DAY_IS_RUNNING_XPATH);
	
	if (startOfDayRunning == "true"){
		//StartOfDay is currently being run by someone else, go back to the main menue.
		Services.navigate(NavigationController.MAIN_MENU);
	} 
	else{
		// defect 2672 - wrong navigationController call - was calling getNextScreen instead of nextScreen
		if(NavigationController.callStackExists()){
			NavigationController.nextScreen();
		}
		else{
			Services.navigate(NavigationController.MAIN_MENU);
		}		
		
	}
}						
	

function runSuitorsCashStartOfDayHandler (){};
         	
/**
 * @param exception
 * @author hzw6j7
 * 
 */
 	runSuitorsCashStartOfDayHandler.onError = function(exception)
    {
		var message = "Start Of Day has failed";
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
 * @param dom
 * @author hzw6j7
 * 
 */
 	runSuitorsCashStartOfDayHandler.onSuccess = function(dom)
    { 
		var node = dom.selectSingleNode("/ds/StartOfDayHasRun");
		var node2 = dom.selectSingleNode("/ds/SodIsRunning");
		
		Services.setValue(START_OF_DAY_LOCK_IND_XPATH, "true");
		if (null != node2) 
		{
			Services.setTransientStatusBarMessage("The Start Of Day Process is currently running.");
			Services.setValue(START_OF_DAY_IS_RUNNING_XPATH, "true");
		} else {
			if (null != node) 
			{
				Services.setTransientStatusBarMessage("The Start Of Day Process has already been run today.");
			} else {
				Services.setTransientStatusBarMessage("The Start Of Day Process has now completed.");
				//Forward to the screen the user intitialy intended to go to.
				exitScreen();
			}    
		}
    }


/*****************************************************************************************************************

		Ensure the user is unable to exit the screen via the 'X' in the top-right of the browser
*****************************************************************************************************************/

function exitScreenHandler() {}

/**
 * @author hzw6j7
 * 
 */
exitScreenHandler.handleExit = function() {
	
    var lockStatus = Services.getValue(START_OF_DAY_LOCK_IND_XPATH);
	if (lockStatus == "false") //Need to run StartOfDay !
	{ 
		var params = new ServiceParams();
		var dataNode = XML.createDOM(null, null, null);
		var dataNode2 = XML.createDOM(null, null, null);
		
		dataNode.appendChild(Services.getNode(REPORT_DATA_XPATH));
		params.addDOMParameter("reportData", dataNode);
		params.addSimpleParameter("adminCourtCode", courtCode);
	
	    dataNode2.appendChild(Services.getNode(SYSTEM_DATA_XPATH));
	    params.addDOMParameter("systemData", dataNode2);
	
		Services.callService("runSuitorsCashStartOfDay", params, runSuitorsCashStartOfDayHandler, false);
		alert('Please exit the screen in the correct manner');			
	}
}

/*************************** PROGRESS BAR **********************************/
function Progress_Bar() {}

Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author hzw6j7
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}	

// 19 Apr 2006 - KG. As part of CR 0153, Added Asynchronisation logic to this module  

/**
 * Async Stuff
 * @author hzw6j7
 * 
 */
function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};


CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";
/**
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onComplete = function()
{
	//debugger;
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	var dom = Services.getNode(CaseMan_AsyncMonitor.srcData + "/Response");
	
	var node = dom.selectSingleNode("/ds/StartOfDayHasRun");
	var node2 = dom.selectSingleNode("/ds/SodIsRunning");
		
		Services.setValue(START_OF_DAY_LOCK_IND_XPATH, "true");
		if (null != node2) 
		{
			Services.setTransientStatusBarMessage("The Start Of Day Process is currently running.");
			Services.setValue(START_OF_DAY_IS_RUNNING_XPATH, "true");
		} else {
			if (null != node) 
			{
				Services.setTransientStatusBarMessage("The Start Of Day Process has already been run today.");
			} else {
				Services.setTransientStatusBarMessage("The Start Of Day Process has now completed.");
				//Forward to the screen the user intitialy intended to go to.
				exitScreen();
			}    
		}
	
}

/**
 * @param error
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onError = function(error)
{
	//debugger;
    alert("Unable to initiate report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @param error
 * @author hzw6j7
 * 
 */
CaseMan_AsyncMonitor.onCancelError = function(error)
{
	//debugger;
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}


