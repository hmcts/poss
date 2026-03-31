/** 
 * @fileoverview MaintainCourtSections.js:
 * This file contains the form and field configurations for the UC137 - Maintain 
 * Court Sections screen.
 *
 * OUSTANDING ISSUES (CPV 28/02/2006)
 * 1) Should the Court Code be in the header panel as well as the Court Name?
 * 2) The buttons in the popup should be Ok and Cancel (not Add and Close)
 * 3) The New Section field in the popup should be mandatory
 * 4) Duplicate section name validation should be on the New Section field, not the Add button
 *
 * @author Dave Turner, Chris Vincent
 * @version 0.2
 *
 * Change History:
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 24/11/2006 - Chris Vincent, added F4 keybinding to the popup close button.  UCT Defect 710.
 */

/**
 * XPath Constants
 * @author qz8rkl
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.DATA_XPATH = "/ds/CourtDetails";
XPathConstants.DATA_DIRTY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DataDirty";
XPathConstants.NEW_SECTION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NewSection/Section";
XPathConstants.EXIT_AFTER_SAVE_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ExitAfterSave";

/****************************** MAIN FORM *****************************************/

function MaintainCourtSections () {};
/**
 * @author qz8rkl
 * 
 */
MaintainCourtSections.initialise = function()
{
	retrieveSectionData();
}

/**
 * @param resultDom
 * @author qz8rkl
 * 
 */
MaintainCourtSections.onSuccess = function (resultDom)
{
	var results = resultDom.selectSingleNode(XPathConstants.DATA_XPATH);
	if ( null != results )
	{
		Services.startTransaction();
    	Services.replaceNode(XPathConstants.DATA_XPATH, results);
    	Services.setValue(XPathConstants.DATA_DIRTY_XPATH, "false");
    	Services.endTransaction();
    }
}

/***************************** HELPER FUNCTIONS ************************************/

/**
 * Function handles the exit from the screen back to the menu
 * @author qz8rkl
 * 
 */
function exitScreen()
{
    Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function indicates if the data on the screen is dirty
 * @return [Boolean] true if the data is dirty, else false
 * @author qz8rkl
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DATA_DIRTY_XPATH);
	return ( dirtyFlag == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function handles the calling of the retrieval service for the court sections
 * @author qz8rkl
 * 
 */
function retrieveSectionData()
{
	// Get the court number that the logged in user is assigned to out of the app section of the dom
	var courtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	
	var params = new ServiceParams();
	params.addSimpleParameter("courtId", courtCode);  
	Services.callService("getCourtSections", params, MaintainCourtSections, true);
}

/********************************** POPUPS *****************************************/

function AddSection_Popup() {};

// Popup will raise when the Add button is clicked or F2 is clicked
AddSection_Popup.raise = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainCourtSections" } ],
		singleClicks: [ {element: "Master_AddBtn"} ]
	}
};

// Popup will close when the Close button is clicked
AddSection_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "AddSection_Popup" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
AddSection_Popup.prePopupPrepare = function()
{
	// Set the default values for the new section popup
	var courtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.startTransaction();
	Services.setValue(Popup_SectionTxt.dataBinding, "");
	Services.setValue(XPathConstants.NEW_SECTION_XPATH + "/AdminCrtCode", courtCode);
	Services.endTransaction();
}

/**
 * @author qz8rkl
 * @return "Status_SaveBtn"  
 */
AddSection_Popup.nextFocusedAdaptorId = function() {
	return "Status_SaveBtn";
}

/********************************** GRIDS *****************************************/

function Master_Sections_ResultsGrid() {};
Master_Sections_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Master_Sections_ResultsGrid.tabIndex = 1;
Master_Sections_ResultsGrid.srcData = XPathConstants.DATA_XPATH + "/Sections";	
Master_Sections_ResultsGrid.rowXPath = "Section";					
Master_Sections_ResultsGrid.keyXPath = "SectionName";                    		
Master_Sections_ResultsGrid.columns = [										
	{xpath: "SectionName"}
];

/********************************* FIELDS ******************************************/

function Header_CourtName() {};
Header_CourtName.dataBinding = XPathConstants.DATA_XPATH + "/CourtName";
Header_CourtName.isReadOnly = function() { return true; }
Header_CourtName.tabIndex = -1;

/*********************************************************************************/

function Popup_SectionTxt() {};
Popup_SectionTxt.dataBinding = XPathConstants.NEW_SECTION_XPATH + "/SectionName";
Popup_SectionTxt.tabIndex = 20;
Popup_SectionTxt.maxLength = 30;
Popup_SectionTxt.helpText = "The name of the new BMS section";
Popup_SectionTxt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/******************************** BUTTONS *****************************************/

function Master_AddBtn() {};
Master_AddBtn.tabIndex = 2;

/*********************************************************************************/

function Status_SaveBtn() {};
Status_SaveBtn.tabIndex = 10;
Status_SaveBtn.enableOn = [XPathConstants.DATA_DIRTY_XPATH];
Status_SaveBtn.isEnabled = isDataDirty;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainCourtSections" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
Status_SaveBtn.actionBinding = function()
{
	// Save the court sections to the database
	var newDOM = XML.createDOM(null, null, null);	
	var results = Services.getNode(XPathConstants.DATA_XPATH);
	var dsNode = XML.createElement(newDOM, "ds");
	dsNode.appendChild(results);		
	newDOM.appendChild(dsNode);
	var params = new ServiceParams();
	params.addDOMParameter("Sections",  newDOM);
	Services.callService("updateCourtSections", params, Status_SaveBtn, true);
}

/**
 * @author qz8rkl
 * 
 */
Status_SaveBtn.onSuccess = function()
{
	var exitAfterSave = Services.getValue(XPathConstants.EXIT_AFTER_SAVE_IND_XPATH);
	if ( "true" == exitAfterSave )
	{
		// Exit screen after saving
		exitScreen();
	}
	else
	{
		// Refresh the data on screen
		retrieveSectionData();
	}
}

/*********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.tabIndex = 11;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainCourtSections" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
Status_CloseBtn.actionBinding = function()
{
	if( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) ) 
  	{
  		// Data is dirty and user wishes to save before exiting
  		Services.setValue(XPathConstants.EXIT_AFTER_SAVE_IND_XPATH, "true");
  		Status_SaveBtn.actionBinding();
  	}
	else
	{
		// Exit the screen
		exitScreen();
	}
}

/*********************************************************************************/

function Popup_AddBtn() {};
Popup_AddBtn.tabIndex = 21;
Popup_AddBtn.enableOn = [Popup_SectionTxt.dataBinding];
Popup_AddBtn.isEnabled = function()
{
	// Disabled if the section name is blank
	var sectionName = Services.getValue(Popup_SectionTxt.dataBinding);
	return CaseManUtils.isBlank(sectionName) ? false : true;
}

/**
 * @author qz8rkl
 * 
 */
Popup_AddBtn.actionBinding = function()
{
	var newSection = Services.getValue(Popup_SectionTxt.dataBinding)
	if( CaseManUtils.isBlank(newSection) )
	{
		// The section is blank
		alert(Messages.MCS_MESSAGE_NOSECTION);
	}
	else
	{
		var duplicate = Services.exists(XPathConstants.DATA_XPATH + "/Sections/Section[./SectionName = " + Popup_SectionTxt.dataBinding + "]");
		if ( duplicate )
		{
			// The section entered already exists on the user's home court
			alert(Messages.MCS_MESSAGE_DUPSECTION);
		}
		else
		{
			var sectionNode = Services.getNode(XPathConstants.NEW_SECTION_XPATH);
			Services.startTransaction();
			Services.addNode(sectionNode, XPathConstants.DATA_XPATH + "/Sections");
			Services.setValue(XPathConstants.DATA_DIRTY_XPATH, "true");
			Services.endTransaction();
			Services.dispatchEvent("AddSection_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		}
	} 
}

/*********************************************************************************/

function Popup_CloseBtn() {};
Popup_CloseBtn.tabIndex = 22;
