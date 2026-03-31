/** 
 * @fileoverview BarUnbarJudgment.js:
 * This file contains the form and field configurations for the UC007 - Bar/Unbar Judgment screen. 
 *
 * @author David Turner, Chris Vincent
 * @version 0.1
 */

/**
 * XPath Constants
 * @author qz8rkl
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.DATA_XPATH = "/ds/JudgmentDetails";
XPathConstants.DIRTY_FLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DataDirty";

/**
 * Constants used to indicate the action to perform following a save
 * @author qz8rkl
 * 
 */
function PostSaveActions() {};
PostSaveActions.ACTION_AFTER_SAVE = "";
PostSaveActions.ACTION_EXIT = "EXIT_SCREEN";

/****************************** MAIN FORM *****************************************/

function BarUnbarJudgment () {};
/**
 * @author qz8rkl
 * 
 */
BarUnbarJudgment.initialise = function()
{
	loadData();
	closeClicked = false;
}

/**
 * @param resultDom
 * @author qz8rkl
 * 
 */
BarUnbarJudgment.onSuccess = function(resultDom)
{
	var results = resultDom.selectSingleNode(XPathConstants.DATA_XPATH);
	if( results != null && results.getElementsByTagName("Defendant").length != 0)
	{
		Services.replaceNode(XPathConstants.DATA_XPATH, results);
	}
	else
	{
		alert(Messages.BAR_NOFIND_MESSAGE);
	}
	Services.setValue(XPathConstants.DIRTY_FLAG_XPATH, "false");
}

/************************** HELPER FUNCTIONS **************************************/

/**
 * Function calls the retrieval service based on the Case Number passed in
 * @author qz8rkl
 * 
 */
function loadData ()
{
	var caseNumber = Services.getValue(BarJudgmentParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		Services.setValue(CaseDetail_CaseNumber.dataBinding,caseNumber);
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber", caseNumber);
		Services.callService("getDefendantBarStatus", params, BarUnbarJudgment, true);
	}
}

/*********************************************************************************/

/**
 * Function calls the save service
 * @author qz8rkl
 * 
 */
function saveData()
{
	var results = Services.getNode(XPathConstants.DATA_XPATH);
	var newDOM = XML.createDOM(null, null, null);
	var dsNode = XML.createElement(newDOM, "ds");
	dsNode.appendChild(results);
	newDOM.appendChild(dsNode);
	var params = new ServiceParams();
	params.addDOMParameter("CaseNumber", newDOM);
	Services.callService("updateDefendantBarStatus", params, Status_SaveButton, true); 
}

/*********************************************************************************/

/**
 * Function handles the exiting from the screen back to the calling screen
 * @author qz8rkl
 * 
 */
function exitScreen()
{
	Services.removeNode(BarJudgmentParams.PARENT);
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

function Defendants_ResultsGrid() {};
Defendants_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Defendants_ResultsGrid.tabIndex = 1;
Defendants_ResultsGrid.srcData = XPathConstants.DATA_XPATH + "/Defendants";	
Defendants_ResultsGrid.rowXPath = "Defendant";					
Defendants_ResultsGrid.keyXPath = "PartyID";												
Defendants_ResultsGrid.columns = [	
	{xpath: "PartyRoleDescription"},									
	{xpath: "CasePartyNumber", sort: "numerical"},
	{xpath: "Parties"},
	{xpath: "Bar"}
];

/********************************* FIELDS ******************************************/

function CaseDetail_CaseNumber() {};
CaseDetail_CaseNumber.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/JudgmentDetails/CaseNumber";
CaseDetail_CaseNumber.isReadOnly = function(){ return true; }
CaseDetail_CaseNumber.tabIndex = -1;

/******************************** BUTTONS *****************************************/

function Parties_MaintainBarButton() {}
Parties_MaintainBarButton.tabIndex = 2;

/**
 * @author qz8rkl
 * 
 */
Parties_MaintainBarButton.actionBinding = function()
{
	var partyId = Services.getValue(Defendants_ResultsGrid.dataBinding);
	var barStatus = Services.getValue(XPathConstants.DATA_XPATH + "/Defendants/Defendant[./PartyID='" + partyId + "']/Bar");
	var alternate = ( barStatus == "Y" ) ? "N" : "Y";
	
	Services.startTransaction();
	Services.setValue(XPathConstants.DATA_XPATH + "/Defendants/Defendant[./PartyID='" + partyId + "']/Bar", alternate);
	Services.setValue(XPathConstants.DIRTY_FLAG_XPATH, "true");
	Services.endTransaction();
}

Parties_MaintainBarButton.enableOn = [Defendants_ResultsGrid.dataBinding];
Parties_MaintainBarButton.isEnabled = function ()
{
	// Enabled if defendant records exist in the grid
	var gridDB = Services.getValue(Defendants_ResultsGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

/*********************************************************************************/

function Status_SaveButton() {};
Status_SaveButton.tabIndex = 3;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "BarUnbarJudgment" } ]
	}
};

Status_SaveButton.enableOn = [XPathConstants.DIRTY_FLAG_XPATH];
Status_SaveButton.isEnabled = function ()
{
	// Enabled if changes have been made
	var dataDirty = Services.getValue(XPathConstants.DIRTY_FLAG_XPATH);
	return ( dataDirty == "true" ) ? true : false;
}

/**
 * @author qz8rkl
 * 
 */
Status_SaveButton.actionBinding = function()
{
	var dataDirty = Services.getValue(XPathConstants.DIRTY_FLAG_XPATH);
	if( dataDirty == "true" )
	{	
		saveData();
	}
};

/**
 * @param dom
 * @author qz8rkl
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	var temp = PostSaveActions.ACTION_AFTER_SAVE;
	PostSaveActions.ACTION_AFTER_SAVE = "";
	switch (temp)
	{
		case PostSaveActions.ACTION_EXIT:
			// Exit the screen
			exitScreen();
			break;
		default:
			// Reload the screen data
			loadData();
	}
}

/**
 * @param exception
 * @author qz8rkl
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		loadData();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author qz8rkl
 * 
 */
Status_SaveButton.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/*********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 4;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "BarUnbarJudgment" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
Status_CloseButton.actionBinding = function()
{ 
	var dataDirty = Services.getValue(XPathConstants.DIRTY_FLAG_XPATH);
	if ( dataDirty == "true" && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// Data is dirty and the user wishes to save before exiting
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_EXIT;
		saveData();
	}
	else
	{
		exitScreen();
	}
};
