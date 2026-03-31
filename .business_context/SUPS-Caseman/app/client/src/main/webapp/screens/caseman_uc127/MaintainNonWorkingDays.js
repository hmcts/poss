/** 
 * @fileoverview MaintainNonWorkingDays.js:
 * This file contains the form and field configurations for the UC127 - Maintain 
 * Non Working Days screen.
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 07/06/2006 - Chris Vincent, changed global variables to static variables.
 */

/**
 * XPath Constants
 * @author fzj0yl
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form"; 
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/NonWorkingDays";
XPathConstants.NEW_DATE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NonWorkingDay";
XPathConstants.DIRTYFLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DirtyFlag";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.EXITAFTERSAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ExitAfterSave";

/******************************* FUNCTIONS *****************************************/

/**
 * Returns the screen to the menu
 * @author fzj0yl
 * 
 */
function exitScreen() 
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Calls the non working days retrieval service
 * @author fzj0yl
 * 
 */
function loadNonWorkingDays()
{
	var params = new ServiceParams();
	Services.callService("getAllNonWorkingDays", params, maintainNonWorkingDays, true);
}

/*********************************************************************************/

/**
 * Function generates the next unique surrogate key for the address surrogate id node
 *
 * @return string The next unique surrogate id
 * @author fzj0yl
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form
 * @author fzj0yl
 * 
 */
function setDirtyFlag()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	if ( dirtyFlag != "true" )
	{
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "true");
	}
}

/*********************************************************************************/

/**
 * Function returns the state of the data i.e. dirty or not
 *
 * @returns Boolean true if data is dirty, else false
 * @author fzj0yl
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	return (dirtyFlag == "true") ? true : false;
}

/******************************* FORM ELEMENT ***************************************/

function maintainNonWorkingDays() {}

/**
 * @author fzj0yl
 * 
 */
maintainNonWorkingDays.initialise = function() 
{
	loadNonWorkingDays();
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
maintainNonWorkingDays.onSuccess = function(dom) 
{
	Services.startTransaction();
	Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "false");
	Services.replaceNode(XPathConstants.DATA_XPATH, dom); 
	Services.endTransaction();
}

// Load the reference data from the xml into the model
maintainNonWorkingDays.refDataServices = [
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/******************************* SUB-FORMS *****************************************/

function addNewNonWorkingDay_subform() {};
addNewNonWorkingDay_subform.subformName = "AddNonWorkingDaySubform";

addNewNonWorkingDay_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_AddNonWorkingDayButton"} ],
		keys: [ { key: Key.F2, element: "maintainNonWorkingDays" } ],
		isEnabled: function()
		{
			return Services.hasAccessToForm(addNewNonWorkingDay_subform.subformName);
		}
	}
};

addNewNonWorkingDay_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.NEW_DATE_XPATH } ];
/**
 * @author fzj0yl
 * 
 */
addNewNonWorkingDay_subform.processReturnedData = function() 
{
	var date = Services.getValue(XPathConstants.NEW_DATE_XPATH + "/Date");
	var currentUser = Services.getCurrentUser();
	var sysDate = CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate");

	Services.startTransaction();	
	var searchXpath = XPathConstants.DATA_XPATH + "/NonWorkingDay[./Date = '" + date + "' and ./ErrorIndicator = 'Y']";
	if( Services.exists(searchXpath) )
	{
		// The date has been created previously and then removed (marked in error) therefore unmark in error
		var sequenceNumber = Services.getValue(XPathConstants.DATA_XPATH + "/NonWorkingDay[./Date = '" + date + "']/SequenceNumber");
		var notes = Services.getValue(XPathConstants.NEW_DATE_XPATH + "/Notes");
		var rootXpath = XPathConstants.DATA_XPATH + "/NonWorkingDay[./SequenceNumber = " + sequenceNumber + "]";
		Services.setValue(rootXpath + "/ErrorIndicator", "N");
		Services.setValue(rootXpath + "/CreatedBy", currentUser);
		Services.setValue(rootXpath + "/CreationDate", sysDate);
		Services.setValue(rootXpath + "/Notes", notes);
	}
	else
	{
		// Completely new date
		Services.setValue(XPathConstants.NEW_DATE_XPATH + "/SurrogateSequenceNumber", getNextSurrogateKey());
		Services.setValue(XPathConstants.NEW_DATE_XPATH + "/ErrorIndicator", "N");
		Services.setValue(XPathConstants.NEW_DATE_XPATH + "/CreatedBy", currentUser );
		Services.setValue(XPathConstants.NEW_DATE_XPATH + "/CreationDate", sysDate );
		var newDateNode = Services.getNode(XPathConstants.NEW_DATE_XPATH);
		Services.addNode(newDateNode, Master_NonWorkingDaysGrid.srcData);
	}
	setDirtyFlag();
	Services.endTransaction();
}

/**
 * @author fzj0yl
 * @return "Status_SaveButton"  
 */
addNewNonWorkingDay_subform.nextFocusedAdaptorId = function() 
{
	return "Status_SaveButton";
}

/******************************* FORM FIELDS ***************************************/

function Master_NonWorkingDaysGrid() {};
//Master_NonWorkingDaysGrid.isRecord = true;
Master_NonWorkingDaysGrid.tabIndex = 1;
Master_NonWorkingDaysGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Grids/SelectedNonWorkingDate";
Master_NonWorkingDaysGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/NonWorkingDay/ErrorIndicator"];
Master_NonWorkingDaysGrid.srcData = XPathConstants.DATA_XPATH;
Master_NonWorkingDaysGrid.rowXPath = "NonWorkingDay[./ErrorIndicator = 'N']";
Master_NonWorkingDaysGrid.keyXPath = "SurrogateSequenceNumber";
Master_NonWorkingDaysGrid.columns = [
	{xpath: "Date", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"},
	{xpath: "CreationDate", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "Notes"}
];

/***********************************************************************************/

function Master_AddNonWorkingDayButton() {}
Master_AddNonWorkingDayButton.tabIndex = 2;
Master_AddNonWorkingDayButton.isEnabled = function()
{
	// Disabled if user does not have update access to the screen
	return Services.hasAccessToForm(addNewNonWorkingDay_subform.subformName);
}

/***********************************************************************************/

function Master_RemoveNonWorkingDayButton() {}
Master_RemoveNonWorkingDayButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainNonWorkingDays", alt: true } ]
	}
};
Master_RemoveNonWorkingDayButton.tabIndex = 3;
/**
 * @author fzj0yl
 * 
 */
Master_RemoveNonWorkingDayButton.actionBinding = function()
{
	if ( confirm(Messages.CONFIRM_DELETE_NONWORKINGDAY) )
	{
		var selectedDate = Services.getValue(Master_NonWorkingDaysGrid.dataBinding);
		var sequenceNumber = Services.getValue(XPathConstants.DATA_XPATH + "/NonWorkingDay[./SurrogateSequenceNumber = '" + selectedDate + "']/SequenceNumber");
		if ( CaseManUtils.isBlank(sequenceNumber) )
		{
			// Non Working Day has not been persisted yet, remove node
			Services.removeNode(XPathConstants.DATA_XPATH + "/NonWorkingDay[./SurrogateSequenceNumber = '" + selectedDate + "']");
		}
		else
		{
			// Non Working Day has been persisted, set error flag to 'Y'
			Services.setValue(XPathConstants.DATA_XPATH + "/NonWorkingDay[./SurrogateSequenceNumber = '" + selectedDate + "']/ErrorIndicator", "Y");
		}
		setDirtyFlag();
	}
}

/***********************************************************************************/

function Status_SaveButton() {}
Status_SaveButton.tabIndex = 10;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainNonWorkingDays" } ]
	}
};

/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	if ( isDataDirty() )
	{
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH)
		//var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
		//dataNode.appendChild(strippedNode);
		dataNode.appendChild(node);
	
		var params = new ServiceParams();
		params.addDOMParameter("nonWorkingDays", dataNode);
		Services.callService("updateNonWorkingDays", params, Status_SaveButton, true);
	}
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSuccess = function(dom) 
{
	var tempAction = Services.getValue(XPathConstants.EXITAFTERSAVE_XPATH);
	if ( tempAction == "true" )
	{
		// User wishes to exit the screen following a save
		exitScreen();
	}
	else
	{
		// No actions, retrieve the non working days
		Services.setTransientStatusBarMessage("Changes saved.");
		loadNonWorkingDays();
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		// Reload the data
		loadNonWorkingDays();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/***********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.tabIndex = 11;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainNonWorkingDays" } ]
	}
};

/**
 * @author fzj0yl
 * 
 */
Status_CloseButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// Data is dirty and user wishes to save before exiting
		Services.setValue(XPathConstants.EXITAFTERSAVE_XPATH, "true");
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}
