/****************************************************************************************************************
						Print Payment Summary Report: CM_PSUM
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
OwningCourt_Code.isReadOnly = function() { return true;	}
OwningCourt_Name.isReadOnly = function() { return true; }
		
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
OracleReportForm.initialise = function()
{
	//debugger;
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
//	var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
//	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);

	StartOfDayUtils.checkSuitorsCashStartOfDay("PaymentSummaryReport");

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
	//debugger;
	var dom = Reports.createReportDom("CM_PSUM.rdf");
	
		//Is Question : N
				
	Reports.setValue(dom, "YES_OR_NO",  "Y" );								
			

	Reports.runReport(dom, true);
}	

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
YesOrNo.tabIndex = __tabIdx++;
YesOrNo.componentName = "Click on Run Report button to print this report.";		YesOrNo.srcData = null;
YesOrNo.rowXPath = null;
YesOrNo.keyXPath = null;
YesOrNo.displayXPath = null;
YesOrNo.helpText = null;
		
Status_RunReportButton.validationList = [];
			
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
			
			
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
 * @param ec
 * @author bz6s80
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
