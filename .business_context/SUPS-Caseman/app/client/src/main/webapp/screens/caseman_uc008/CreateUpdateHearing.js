/** 
 * @fileoverview CreateUpdateHearing.js:
 * Configurations for the UC008 (specific to the Maintain Hearings (Case) screen)
 *
 * @author Mark Groen, Chris Vincent
 * 
 * Change History:
 * 16/08/2006 - Chris Vincent, added enablement rule to the Add button to prevent the user
 * 				from entering multiple hearings in a single transaction.  Defect 4202.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 */

/**
 * Hearing (Case) Specific XPath Constants
 */
XPathConstants.NAVIGATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/HearingsNavigationList";

/****************************** MAIN FORM ******************************************/

function CreateUpdateHearing() {}

/**
 * @author szt44s
 * 
 */
CreateUpdateHearing.initialise = function()
{
	retrieveHearings();
}

/**
 * @param dom
 * @author szt44s
 * 
 */
CreateUpdateHearing.onSuccess = function(dom)
{
	var result = dom.selectSingleNode(XPathConstants.DATA_XPATH);		
	if ( null != result )
	{
		Services.startTransaction();
		Services.replaceNode(XPathConstants.DATA_XPATH, result);
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
		
		// Set the parties for the header grid
		var caseType = Services.getValue(XPathConstants.DATA_XPATH + "/CaseType");
		CaseManUtils.setPartiesForHeaderGrid(caseType, XPathConstants.DATA_XPATH + "/Parties/Party", "PartyType");
		Services.endTransaction();
	}
}

/**
 * @param exception
 * @author szt44s
 * 
 */
CreateUpdateHearing.onError = function(exception)
{
	alert(Messages.ERR_RET_HRGS_MESSAGE);
}

// Load reference data from server-side service calls		
CreateUpdateHearing.refDataServices = [
	{name:"RefDataHearingOutcomes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getHearingOutcomes", serviceParams:[]},
   	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/*************************** HELPER FUNCTIONS *************************************/

/**
 * Exits the screen and returns to the previous screen
 * @author szt44s
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
 * @author szt44s
 * 
 */
function retrieveHearings()
{
	// Clear the existing page data and retrieve the case number
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	var caseNumber = Services.getValue(HearingParams.CASE_NUMBER);

	// Make call to service to retrieve the Hearing details for the case
	var params = new ServiceParams();
	params.addSimpleParameter( "caseNumber", caseNumber.toUpperCase() ); 
	Services.callService("getHearing", params, CreateUpdateHearing, true);	
}

/**********************************************************************************/

/**
 * Validate method checking the Outcome field
 *
 * @param string pOutcomeCode The Hearing outcome value
 * @param string pHearingDate The Hearing date in the model format (YYYY-MM-DD)
 * @return ErrorCode An error code if the hearing outcome is invalid else null 
 * @author szt44s
 */
function validateOutcomeCode(pOutcomeCode, pHearingDate)
{
	var errCode = null;
	if( !CaseManUtils.isBlank(pOutcomeCode) )
	{
		if( !CaseManUtils.isBlank(pHearingDate) )
		{
			errCode = validateDateInFuture(pHearingDate);
		}
		if( errCode != null )
		{
			// test to see if illegal code entered.  Can not have C, J or O when date is in the future.				
			pOutcomeCode = pOutcomeCode.toUpperCase();
			if( pOutcomeCode == 'C' || pOutcomeCode == 'J'|| pOutcomeCode == 'O' )
			{
				errCode = ErrorCode.getErrorCode('CaseMan_invalidHearingOutcomeForFuture_Msg');
			}
			else
			{
				// date in future but not a problem as allowed to enter value.
				// Reset the errCode so OK
				errCode = null;
			}			
		}
		else
		{
			// date not in future so do not return an error
			errCode = null;
		}
				
		// need to ensure that correct value has been entered.  
		// If a one has there will be a corresponding Description
		// &&& NB Will need to look at this in future when auto complete is implemented
		if( errCode == null )
		{
			if( !Services.exists(XPathConstants.REF_DATA_XPATH + "/HearingOutcomes/HearingOutcome[./Type = " + HearingDetails_HearingOutcomeCode.dataBinding + "]") )
			{
				errCode = ErrorCode.getErrorCode('CaseMan_invalidHearingOutcome_Msg');
			}	
		}
	}
	return errCode;
}

/******************************** GRIDS *******************************************/

function Header_PartyTypeListGrid() {};
Header_PartyTypeListGrid.tabIndex = 1;
Header_PartyTypeListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Header_PartyTypeListGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/Parties/Party/DisplayInHeader"];
Header_PartyTypeListGrid.srcData = XPathConstants.DATA_XPATH + "/Parties";
Header_PartyTypeListGrid.rowXPath = "Party[./DisplayInHeader = 'true']";
Header_PartyTypeListGrid.keyXPath = "Id";
Header_PartyTypeListGrid.columns = [
	{xpath: "PartyTypeDescription"},
	{xpath: "Number", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

/***************************** DATA BINDINGS **************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourt";

HearingDetails_HearingOutcomeCode.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcomeCode";
HearingDetails_HearingOutcome.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/HearingOutcome";

/***************************** INPUT FIELDS ***************************************/

function Header_CaseNumber() {}
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.isReadOnly = function() { return true; }
Header_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isMandatory = function() { return true; }
Header_OwningCourtCode.isReadOnly = function() { return true; }
Header_OwningCourtCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -2;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isMandatory = function() { return true; }
Header_OwningCourtName.isReadOnly = function() { return true; }
Header_OwningCourtName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_HearingOutcomeCode() {}
HearingDetails_HearingOutcomeCode.maxLength = 1;
HearingDetails_HearingOutcomeCode.helpText = "Please enter Hearing Outcome Code or select the LOV button.";
HearingDetails_HearingOutcomeCode.tabIndex = 14;
HearingDetails_HearingOutcomeCode.componentName = "Hearing Outcome Code";

HearingDetails_HearingOutcomeCode.retrieveOn = [Master_HearingsListGrid.dataBinding,
												HearingDetails_HearingOutcomeCode.dataBinding];
HearingDetails_HearingOutcomeCode.logicOn = [HearingDetails_HearingOutcomeCode.dataBinding, Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOutcomeCode.logic = function()
{
	if ( Services.countNodes(XPathConstants.HEARING_PATH) == 0 || CaseManUtils.isBlank(Master_HearingsListGrid.dataBinding) )
	{
		return;
	}

	var type = Services.getValue(HearingDetails_HearingOutcomeCode.dataBinding);
	var description = Services.getValue(XPathConstants.REF_DATA_XPATH + "/HearingOutcomes/HearingOutcome[./Type = " + HearingDetails_HearingOutcomeCode.dataBinding + "]/Description");

	// Clear description field if outcome type is blank
	if ( CaseManUtils.isBlank(type) )
	{
		Services.setValue(HearingDetails_HearingOutcome.dataBinding, "");
		return;
	}
	
	// Set the data in the business part of the model
	if( !CaseManUtils.isBlank(description) )
	{
		// set the description field appropriately
		Services.setValue(HearingDetails_HearingOutcome.dataBinding, description);
	}
}

HearingDetails_HearingOutcomeCode.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOutcomeCode.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

HearingDetails_HearingOutcomeCode.validateOn = [Master_HearingsListGrid.dataBinding,
												HearingDetails_HearingOutcomeCode.dataBinding,
												HearingDetails_HearingOnDate.dataBinding];
HearingDetails_HearingOutcomeCode.validate = function()
{
	var outcomeCode = Services.getValue(HearingDetails_HearingOutcomeCode.dataBinding);
	var hearingDate = Services.getValue(HearingDetails_HearingOnDate.dataBinding);	
	return validateOutcomeCode(outcomeCode, hearingDate);	
}

HearingDetails_HearingOutcomeCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

HearingDetails_HearingOutcomeCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_HearingOutcome() {}

HearingDetails_HearingOutcome.srcData = XPathConstants.REF_DATA_XPATH + "/HearingOutcomes";
HearingDetails_HearingOutcome.rowXPath = "HearingOutcome";
HearingDetails_HearingOutcome.keyXPath = "Description";
HearingDetails_HearingOutcome.displayXPath = "Description";
HearingDetails_HearingOutcome.strictValidation = true;
HearingDetails_HearingOutcome.tabIndex = 15;
HearingDetails_HearingOutcome.componentName = "Hearing Outcome Description";
HearingDetails_HearingOutcome.helpText = "Please enter Hearing Outcome Code or select the LOV button.";
HearingDetails_HearingOutcome.retrieveOn = [Master_HearingsListGrid.dataBinding,
					    					HearingDetails_HearingOutcome.dataBinding];

HearingDetails_HearingOutcome.logicOn = [HearingDetails_HearingOutcome.dataBinding];
HearingDetails_HearingOutcome.logic = function()
{
	if ( Services.countNodes(XPathConstants.HEARING_PATH) == 0 || CaseManUtils.isBlank(Master_HearingsListGrid.dataBinding) )
	{
		return;
	}

	var description = Services.getValue(HearingDetails_HearingOutcome.dataBinding);
	if ( !CaseManUtils.isBlank( description ) )
	{
		var type = Services.getValue(XPathConstants.REF_DATA_XPATH + "/HearingOutcomes/HearingOutcome[./Description = " + HearingDetails_HearingOutcome.dataBinding + "]/Type");
		if ( !CaseManUtils.isBlank(type) )
		{
			Services.setValue(HearingDetails_HearingOutcomeCode.dataBinding, type);
			Services.setValue(XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcome", description);
		}
	}
	else
	{
		var currentValue = Services.getValue(HearingDetails_HearingOutcomeCode.dataBinding);
		// Only set the code if the current value of the code is not null.
		// It is null when it the control is first loaded and it has no value stored in the database.
		// We need to be careful when setting this to the empty string because it will set the dirty 
		// status of the screen and prompt the user to save upon closing.
		if (currentValue != null)
		{
			Services.setValue(HearingDetails_HearingOutcomeCode.dataBinding, "");
		}
		Services.setValue(XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcome", "");	
	}
}

HearingDetails_HearingOutcome.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOutcome.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

/******************************* BUTTONS ******************************************/

function Master_AddHearingButton() {}

Master_AddHearingButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "CreateUpdateHearing" } ]
	}
};

Master_AddHearingButton.tabIndex = 3;

/**
 * @author szt44s
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

HearingDetails_HearingOutcome_LOVBtn.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOutcome_LOVBtn.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

/**********************************************************************************/

function Status_Save() {}

Status_Save.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "CreateUpdateHearing" } ]
	}
};

Status_Save.tabIndex = 20;

/**
 * @author szt44s
 * 
 */
Status_Save.actionBinding = function()
{
	var rowsInGrid = Services.countNodes(XPathConstants.DATA_XPATH + "/Hearings/Hearing");
	if(rowsInGrid > 0)
	{
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if (invalidFields.length == 0)
		{
			serviceName = "updateHearing";
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
 * @author szt44s
 * 
 */
Status_Save.onSuccess = function(dom)
{
	if (null != dom)
	{
		var blnNavigating = false;
		var data = dom.selectSingleNode("/HearingsNavigationList");
		
		// Check if any navigation data has been sent back
		if ( null != data )
		{
			Services.startTransaction();
			
			// Set up the Navigation Array
			var navArray = new Array();
			
			// Place the navigation rules in the DOM
			Services.replaceNode(XPathConstants.NAVIGATION_XPATH, data);
			
			// Get Navigation Rules
			var NavObl = Services.getValue(XPathConstants.NAVIGATION_XPATH + "/NavigateTo/Obligations");
			var NavWft = Services.getValue(XPathConstants.NAVIGATION_XPATH + "/NavigateTo/WindowForTrial");

			// Navigating to the Obligations screen
			if ( NavObl == "true" )
			{
				// Set the Obligations screen parameters
				var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
				Services.setValue(MaintainObligationsParams.CASE_NUMBER, caseNumber);
				Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
				navArray.push(NavigationController.OBLIGATIONS_FORM);
			}
			
			// Navigating to the Window for Trial screen
			if ( NavWft == "true" )
			{
				// Set the Window for Trial screen parameters
				var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
				Services.setValue(MaintainWftParams.CASE_NUMBER, caseNumber);
				
				// If not called directly from this screen, set the message in the
				// app section for another screen
				if (navArray.length > 0)
				{
					Services.setValue(CaseManFormParameters.WFTMESSAGE_XPATH, Messages.WFT_MESSAGE_C);
				}
				navArray.push(NavigationController.WFT_FORM);
			}
			
			// Build Call Stack
			if ( navArray.length > 0 )
			{
				// Set Call Stack to return to the Hearings screen
				navArray.push(NavigationController.HEARING_FORM);
				if ( NavigationController.callStackExists() )
				{
					NavigationController.addToStack(navArray);
				}
				else
				{
					NavigationController.createCallStack(navArray);
				}
			}
			
			Services.endTransaction();
			
			for (var i=0; i<navArray.length; i++)
			{
				switch (navArray[i])
				{
					// Handle Navigation to Obligations screen
					case NavigationController.OBLIGATIONS_FORM:
					
						// Navigate to the Obligations screen
						blnNavigating = true;
						NavigationController.nextScreen();
						break;
						
					// Handle Navigation to Window for Trial Screen
					case NavigationController.WFT_FORM:

						// Navigation is optional, ask user to confirm
						if ( confirm(Messages.WFT_MESSAGE_C) )
						{
							// User wishes to Navigate to Window for Trial screen
							blnNavigating = true;
							NavigationController.nextScreen();
						}
						else
						{
							// Skip screen twice, firstly to skip Window for Trial screen
							// and secondly to skip the entry to return to Hearings after WFT
							NavigationController.skipScreen();
							NavigationController.skipScreen();
						}
						break;
				}
				
				// Exit as are navigating
				if (blnNavigating) { break; }
			}
		}
		
		// If not navigating, refresh the screen details
		if ( false == blnNavigating)
		{
			alert(Messages.SAVEDSUCESSFULLY_MESSAGE);
			var navigating = Services.getValue(XPathConstants.NAVIGATE_AFTER_SAVE_XPATH);
			if ( navigating == "true" )
			{
				exitScreen();
			}
			else
			{
				retrieveHearings();
			}
		}
	}
	else
	{
		alert(Messages.NO_RESULTS_MESSAGE);
	}
}

/**
 * @param exception
 * @author szt44s
 * 
 */
Status_Save.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author szt44s
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
 * @author szt44s
 * 
 */
Status_Save.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author szt44s
 * 
 */
Status_Save.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**********************************************************************************/

function Status_Close() {}

Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "CreateUpdateHearing" } ]
	}
};

Status_Close.tabIndex = 21;

/**
 * @author szt44s
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
 * @author szt44s
 * @return "Header_CaseNumber"  
 */
Status_Close.moveFocus = function(forward) 
{
	if(forward) 
	{
		// Wrap the tabbing around to the first field of the screen.
		return "Header_CaseNumber";
	}
}
