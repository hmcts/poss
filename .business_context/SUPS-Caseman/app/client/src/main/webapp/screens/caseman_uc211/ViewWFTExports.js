/** 
 * @fileoverview ViewWFTExports.js:
 * This file contains the form and field configurations for the UC022 - Display Daily DMS 
 * screen.
 *
 * @author Dave Turner, Chris Vincent
 * @version 0.1
 * 
 */

/**
 * XPath Constants
 * @author Chris Vincent
 */
function XPathConstants() {};
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/WftExports";

/****************************** MAIN FORM *****************************************/

function ViewWFTExports () {};	

/**
 * Initialise function for the Display DMS Screen.  Sets the default values for the screen.
 * @author Dave Turner, Chris Vincent
 */
ViewWFTExports.initialise = function()
{
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + CaseManFormParameters.COURTNUMBER_XPATH + "]/Name");
	Services.setValue(Header_OwningCourtCode.dataBinding, courtCode);
	Services.setValue(Header_OwningCourtName.dataBinding, courtName);
	
	// Retrieve all exports for the screen
	var params = new ServiceParams();
	params.addSimpleParameter("courtCode", courtCode);
	Services.callService("getWftExportsForCourt", params, ViewWFTExports, true);
}

ViewWFTExports.onSuccess = function(dom)
{
	var results = dom.selectSingleNode("/WftExports");
	if ( null != results )
	{
		Services.replaceNode(XPathConstants.DATA_XPATH, results);
	}
}

// Load the reference data from the xml into the model
ViewWFTExports.refDataServices = [
	{ name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] }
];

/************************** HELPER FUNCTIONS **************************************/

/**
 * Handles the exit from the screen back to the main menu if not called from elsewhere.
 * @author Dave Turner
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

/********************************** GRIDS *****************************************/

function WFT_ExportsGrid() {};
WFT_ExportsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedExport";
WFT_ExportsGrid.tabIndex = 1;
WFT_ExportsGrid.srcData = XPathConstants.DATA_XPATH;
WFT_ExportsGrid.rowXPath = "WftExport";
WFT_ExportsGrid.keyXPath = "DocumentId";
WFT_ExportsGrid.columns = [
	{ xpath: "GroupingCourt" },
	{ xpath: "ExportDate", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", transformToDisplay: CaseManUtils.formatGridDate },
	{ xpath: "Filename" }
];

/**************************** DATA BINDINGS ***************************************/

Header_OwningCourtCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/UserData/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/UserData/OwningCourtName";

/********************************* FIELDS ******************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isReadOnly = function() { return true; }
 
/***********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isReadOnly = function() { return true; }

/******************************** BUTTONS *****************************************/

function WFT_ExportDownloadButton() {};
WFT_ExportDownloadButton.tabIndex = 20;
WFT_ExportDownloadButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "WFT_ExportsGrid"} ]
	}
};

WFT_ExportDownloadButton.enableOn = [WFT_ExportsGrid.dataBinding];
WFT_ExportDownloadButton.isEnabled = function()
{
	// Button disabled if grid is empty
	var gridValue = Services.getValue(WFT_ExportsGrid.dataBinding);
	var blnEnabled = true;
	if ( CaseManUtils.isBlank(gridValue) ) { blnEnabled = false; }
	return blnEnabled;
}

WFT_ExportDownloadButton.actionBinding = function() 
{
	var gridValue = Services.getValue(WFT_ExportsGrid.dataBinding);
	if ( !CaseManUtils.isBlank(gridValue) )
	{
		Services.showDocument(gridValue, gridValue);
	}
}

/***********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.tabIndex = 30;
Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ViewWFTExports" } ]
	}
};

/************************** PROGRESS BAR POPUP *************************************/

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;

/**
 * Report Progresss Bar popup cancel button action binding - cancels the creation
 * of the DMS report and closes the popup.
 * @author Chris Vincent
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}