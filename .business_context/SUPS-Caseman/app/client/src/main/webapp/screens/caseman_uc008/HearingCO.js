/** 
 * @fileoverview CreateUpdateHearing.js:
 * Configurations for the UC008 (specific to the Maintain Hearings (Case) screen)
 *
 * @author Mark Groen, Chris Vincent
 * 
 * Change History:
 * 16/08/2006 - Chris Vincent, added enablement rule to the Add button to prevent the user
 * 				from entering multiple hearings in a single transaction.  Defect 4202.
 */

/****************************** MAIN FORM ******************************************/

function HearingCO() {}

/**
 * @author rzhh8k
 * 
 */
HearingCO.initialise = function()
{
	retrieveHearings();		
}

// Load reference data from server-side service calls		
HearingCO.refDataServices = [
   	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/*************************** HELPER FUNCTIONS *************************************/

/**
 * Exits the screen and returns to the previous screen
 * @author rzhh8k
 * 
 */
function exitScreen()
{
	Services.removeNode(HearingParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**********************************************************************************/

/**
 * Function calls the getHearings service for the form
 * @author rzhh8k
 * 
 */
function retrieveHearings()
{
	// Clear the existing page data and retrieve the CO Number
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	var coNumber = Services.getValue(HearingParams.CO_NUMBER);

	// Make call to service to retrieve the Hearing details for the case
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber.toUpperCase() ); 
	Services.callService("getHearingCO", params, loadData, true);
}

/***************************** DATA BINDINGS **************************************/

Header_CONumber.dataBinding = XPathConstants.DATA_XPATH + "/CONumber";
Header_COType.dataBinding = XPathConstants.DATA_XPATH + "/COType";
Header_Debtor.dataBinding = XPathConstants.DATA_XPATH + "/Defendant";

HearingDetails_HearingOutcomeCode.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcomeCode";
HearingDetails_HearingOutcome.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcome";

/***************************** INPUT FIELDS ***************************************/

function Header_CONumber() {}
Header_CONumber.tabIndex = -1;
Header_CONumber.maxLength = 8;
Header_CONumber.helpText = "CO Number";
Header_CONumber.isReadOnly = function() { return true; }
Header_CONumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function Header_COType() {}
Header_COType.tabIndex = -1;
Header_COType.maxLength = 4;
Header_COType.helpText = "CO Type";
Header_COType.isReadOnly = function() { return true; }
Header_COType.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function Header_Debtor() {}
Header_Debtor.tabIndex = -1;
Header_Debtor.maxLength = 70;
Header_Debtor.helpText = "Debtor Name";
Header_Debtor.isReadOnly = function() { return true; }
Header_Debtor.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

/**
 * DISABLED FIELD - NOT MUCH POINT TO ITS EXISTENCE BUT MUST REMAIN ON SCREEN
 * @author rzhh8k
 * @return boolean 
 */
function HearingDetails_HearingOutcomeCode() {}
HearingDetails_HearingOutcomeCode.isEnabled = function() { return false; }

/**********************************************************************************/

function HearingDetails_HearingOutcome() {}
HearingDetails_HearingOutcome.srcData = XPathConstants.REF_DATA_XPATH + "/HearingOutcomes";
HearingDetails_HearingOutcome.rowXPath = "HearingOutcome";
HearingDetails_HearingOutcome.keyXPath = "Description";
HearingDetails_HearingOutcome.displayXPath = "Description";
HearingDetails_HearingOutcome.strictValidation = true;
HearingDetails_HearingOutcome.isEnabled = function() { return false; }

/******************************* BUTTONS ******************************************/

function Master_AddHearingButton() {}
Master_AddHearingButton.tabIndex = 3;

Master_AddHearingButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "HearingCO" } ]
	}
};

/**
 * @author rzhh8k
 * 
 */
Master_AddHearingButton.actionBinding = function()
{
    Services.dispatchEvent("addHearing_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

Master_AddHearingButton.enableOn = [XPathConstants.HEARING_PATH + "/HearingID"];
Master_AddHearingButton.isEnabled = function()
{
	// Disable the add button to prevent creation of multiple hearings in one transaction
	var countNewHearings = Services.countNodes(XPathConstants.HEARING_PATH + "[./HearingID = '']");
	return ( countNewHearings > 0 ) ? false : true;
}

/**********************************************************************************/

function HearingDetails_HearingOutcome_LOVBtn() {}
HearingDetails_HearingOutcome_LOVBtn.tabIndex = 16;
HearingDetails_HearingOutcome_LOVBtn.enableOn = ["/"];
HearingDetails_HearingOutcome_LOVBtn.isEnabled = function() { return false; }

/**********************************************************************************/

function Status_Save() {}
Status_Save.tabIndex = 20;

Status_Save.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "HearingCO" } ]
	}
};

/**
 * @author rzhh8k
 * 
 */
Status_Save.actionBinding = function()
{
	var rowsInGrid = Services.countNodes(XPathConstants.DATA_XPATH + "/Hearings/Hearing");
	if(rowsInGrid > 0)
	{
		var invalidFields = FormController.getInstance().validateForm(true);
		if (invalidFields.length == 0)
		{
			serviceName = "updateHearingCO";
			// Make service call
			var newDOM = XML.createDOM(null, null, null);		
			var mcNode = Services.getNode(XPathConstants.DATA_XPATH);		
			var dsNode = XML.createElement(newDOM, "ds");		
			dsNode.appendChild(mcNode);		
			newDOM.appendChild(dsNode);
			
			var params = new ServiceParams();
			params.addDOMParameter("HearingID", newDOM);
			Services.callService(serviceName, params, Status_Save, true);			
		}
	}
	else
	{
		alert(Messages.NOHEARINGS_MESSAGE);
	}
}

/**
 * @param dom
 * @author rzhh8k
 * 
 */
Status_Save.onSuccess = function(dom)
{
	var navigating = Services.getValue(XPathConstants.NAVIGATE_AFTER_SAVE_XPATH);
	if ( navigating == "true" )
	{
		exitScreen();
	}
	else
	{
		if ( null != dom )
		{
			var result = dom.selectSingleNode(XPathConstants.DATA_XPATH);		
			if ( null != result )
			{
				alert(Messages.SAVEDSUCESSFULLY_MESSAGE);
				retrieveHearings();
			}
		}
		else
		{
			alert(Messages.NO_RESULTS_MESSAGE);
		}
	}
}

/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		retrieveHearings();		
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**********************************************************************************/

function Status_Close() {}
Status_Close.tabIndex = 21;

Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "HearingCO" } ]
	}
};

/**
 * @author rzhh8k
 * 
 */
Status_Close.actionBinding = function()
{
	if( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.NAVIGATE_AFTER_SAVE_XPATH, "true");
		Status_Save.actionBinding();
	}
	else
	{		
		exitScreen();
	}
}

/**
 * @param forward
 * @author rzhh8k
 * @return "Header_CONumber"  
 */
Status_Close.moveFocus = function(forward) 
{
	if(forward) 
	{
		// Wrap the tabbing around to the first field of the screen.
		return "Header_CONumber";
	}
}
