/** 
 * @fileoverview MaintainAdminUsers.js:
 * This file contains the form and field configurations for the UC208 - Maintain Admin Users
 * @author Chris Vincent
 *
 * Changes:
 */

/**
 * Actions After Saving
 * @author kznwpr
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";
 
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_DATALOADED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DataLoaded";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ActionAfterSave";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.BUSINESS_DATA_BINDING_ROOT = "/ds/User";

/******************************* FORM ELEMENT **************************************/

function MaintainAdminUsers() {}

// Load the reference data into the model
MaintainAdminUsers.refDataServices = [
	{name:"Roles", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"Roles.xml"}
];

MaintainAdminUsers.initialise = function()
{
	Services.setValue(XPathConstants.VAR_DATALOADED_XPATH, "false");
	clearChangesMade();
}

/******************************* DATA BINDINGS *************************************/

Header_UserId.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/UserId";
Main_CourtCode.dataBinding    	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OwningCourtCode";
Main_CourtName.dataBinding	 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OwningCourtName";
Main_Title.dataBinding			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Title";
Main_Forenames.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Forenames";
Main_Surname.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Surname";
Main_UserShortName.dataBinding	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/UserShortName";
Main_Role.dataBinding			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Role";
Main_AdminRole.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/AdminRole";

/******************************* MAIN FUNCTIONS ************************************/

/**
 * Used by the form fields to enforce lower case
 * @param [String] value The string to be converted to lower case
 * @return [String] The string passed in converted to lower case or null if param was null
 */
function lowerCaseData(value)
{
	return (null != value) ? value.toLowerCase() : null;
}

/**********************************************************************************/

/**
 * Closes down the screen and returns to the main menu
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/**********************************************************************************/

/**
 * Clears the details on the screen
 */
function clearScreen()
{
	Services.removeNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	Services.setValue(XPathConstants.VAR_DATALOADED_XPATH, "false");
	clearChangesMade();
}

/**********************************************************************************/

/**
 * Loads user details
 */
function loadUser()
{
	var params = new ServiceParams();
	var userId = Services.getValue(Header_UserId.dataBinding);
	params.addSimpleParameter("dcaUserId", userId);
	Services.callService("getAdminUser", params, Header_SearchButton, true);
}

/**********************************************************************************/

/**
 * Indicates if data has been loaded
 * @return [Boolean] True if data has been loaded, else false
 */
function isDataLoaded()
{
	var blnDataLoaded = false;
	if ( Services.getValue(XPathConstants.VAR_DATALOADED_XPATH) == "true" ) { blnDataLoaded = true }
	return blnDataLoaded;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the user has made any changes.
 * @return [Boolean] True if there are unsaved changes, else False
 */
function changesMade() 
{
	return (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y")
}

/**********************************************************************************/

/**
 * Function clears the changes made status
 */
function clearChangesMade() 
{
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
}

/**********************************************************************************/

/**
 * Function sets the changes made flag
 */
function setChangesMade()
{
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "Y")
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
	}
}

/******************************* HEADER PANEL **************************************/

function Header_UserId() {};
Header_UserId.componentName = "User Id";
Header_UserId.tabIndex = 10;
Header_UserId.maxLength = 10;
Header_UserId.helpText = "The user Id";
Header_UserId.isMandatory = function() { return true; } 
Header_UserId.readOnlyOn = [XPathConstants.VAR_DATALOADED_XPATH];
Header_UserId.isReadOnly = isDataLoaded;
Header_UserId.validate = function()
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);

	// A valid user id consists of lower case letters or numbers with at least 1 character present
	var validUserIdPattern = /^[a-z0-9]+$/;		
	var valid = value.search(validUserIdPattern);
	
	if(0 != valid)
  	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidUserId_Msg");		
  	}

	return ec;
}
Header_UserId.transformToModel = function(value)
{
	return lowerCaseData(value);
}
Header_UserId.transformToDisplay = function(value)
{
	return lowerCaseData(value);
}

/*********************************************************************************/

function Header_SearchButton() {};
Header_SearchButton.tabIndex = 20;
Header_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "MaintainAdminUsers" } ]
	}
};

Header_SearchButton.enableOn = [Header_UserId.dataBinding, XPathConstants.VAR_DATALOADED_XPATH];
Header_SearchButton.isEnabled = function()
{
	var blnEnabled = false;
	var userId = Services.getValue(Header_UserId.dataBinding);
	var dataLoaded = Services.getValue(XPathConstants.VAR_DATALOADED_XPATH);
	if ( !CaseManUtils.isBlank(userId) && null == Header_UserId.validate() && !isDataLoaded() )
	{
		blnEnabled = true;
	}
	return blnEnabled;
}

Header_SearchButton.actionBinding = function()
{
	loadUser();
}

Header_SearchButton.onSuccess = function(dom)
{ 
	if( null != dom )
	{
		var data = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
		if( null != data )
		{
			Services.replaceNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT, data);
			
			// Setup the correct user administrator status
			var adminUser = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Admin");
			var superAdminUser = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/SuperAdmin");
			if ( adminUser == "true") { Services.setValue(Main_AdminRole.dataBinding, "admin"); }
			else if ( superAdminUser == "true") { Services.setValue(Main_AdminRole.dataBinding, "sAdmin"); }
			else { Services.setValue(Main_AdminRole.dataBinding, ""); }
			
			Services.setValue(XPathConstants.VAR_DATALOADED_XPATH, "true");
			clearChangesMade();
		}
		else
		{
			alert(Messages.NO_RESULTS_MESSAGE);
		}
	}
}

/******************************* MAIN PANEL ****************************************/

function Main_CourtCode() {}
Main_CourtCode.tabIndex = -1;
Main_CourtCode.helpText = "Owning Court Code";
Main_CourtCode.componentName = "Owning Court Code";
Main_CourtCode.isReadOnly = function() { return true; }
Main_CourtCode.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_CourtCode.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_CourtName() {}
Main_CourtName.tabIndex = -1;
Main_CourtName.isReadOnly = function() { return true; }
Main_CourtName.helpText = "Owning Court Name";
Main_CourtName.componentName = "Owning Court Name";
Main_CourtName.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_CourtName.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_Title() {};
Main_Title.tabIndex = -1;
Main_Title.isReadOnly = function() { return true; }
Main_Title.helpText = "The user's title";
Main_Title.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_Title.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_Forenames() {};
Main_Forenames.tabIndex = -1;
Main_Forenames.isReadOnly = function() { return true; }
Main_Forenames.helpText = "The user's forenames";
Main_Forenames.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_Forenames.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_Surname() {};
Main_Surname.tabIndex = -1;
Main_Surname.isReadOnly = function() { return true; }
Main_Surname.helpText = "The user's surname";
Main_Surname.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_Surname.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_UserShortName() {};
Main_UserShortName.tabIndex = -1;
Main_UserShortName.isReadOnly = function() { return true; }
Main_UserShortName.helpText = "The user's alias";
Main_UserShortName.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_UserShortName.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_Role() {};
Main_Role.tabIndex = -1;
Main_Role.componentName = "Role";
Main_Role.srcData = XPathConstants.REF_DATA_XPATH + "/Roles";
Main_Role.rowXPath = "Role[./BusinessRole = 'true']";
Main_Role.keyXPath = "Id";
Main_Role.displayXPath = "Description";
Main_Role.isReadOnly = function() { return true; }
Main_Role.helpText = "The role the user is assigned";
Main_Role.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_Role.isEnabled = isDataLoaded;

/**********************************************************************************/

function Main_AdminRole() {};
Main_AdminRole.tabIndex = 100;
Main_AdminRole.componentName = "Administrator Role";
Main_AdminRole.srcData = XPathConstants.REF_DATA_XPATH + "/Roles";
Main_AdminRole.rowXPath = "Role[./AdminRole = 'true']";
Main_AdminRole.keyXPath = "Id";
Main_AdminRole.displayXPath = "Description";
Main_AdminRole.helpText = "The administrator role the user is assigned";
Main_AdminRole.nullDisplayValue = "None";
Main_AdminRole.enableOn = [XPathConstants.VAR_DATALOADED_XPATH];
Main_AdminRole.isEnabled = isDataLoaded;
Main_AdminRole.logicOn = [Main_AdminRole.dataBinding];
Main_AdminRole.logic = function(event)
{
	// Set changes made flag
	if ( event.getXPath().indexOf(Main_AdminRole.dataBinding) == -1 )
	{
		return;
	}
	setChangesMade();
}

/******************************* STATUS BUTTONS ************************************/

function Status_SaveBtn() {}
Status_SaveBtn.tabIndex = 200;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainAdminUsers" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.actionBinding = function()
{
	if ( changesMade() )
	{
		// Create a new dom to send to the server
		var businessDataDOM = XML.createDOM(null, null, null);
		var dsNode = XML.createElement(businessDataDOM, "ds");
		var maintainUserNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
		dsNode.appendChild(maintainUserNode);
		businessDataDOM.appendChild(dsNode);
		
		// Pass the dom to the server
		var params = new ServiceParams();
		params.addDOMParameter("maintainUser", businessDataDOM);
		Services.callService("maintainAdminUser", params, Status_SaveBtn, true);
	}
}

Status_SaveBtn.onSuccess = function(dom, serviceName)
{
	if ( null != dom )
	{		
		// If we have come here by clicking the close button and there were changes to
		// save then close the screen down and don't bother reloading the data after the save
		var action = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		switch (action)
		{
			case ActionAfterSave.ACTION_EXIT:
				// Exit screen after saving
				exitScreen();
				break;

			case ActionAfterSave.ACTION_CLEARFORM:
				// Clear screen after saving
				clearScreen();
				break;
				
			default:
				// Reload the user details
				loadUser();
				break;
		}
	}					
}	

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**********************************************************************************/

function Status_ClearBtn() {}
Status_ClearBtn.tabIndex = 210;
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "MaintainAdminUsers", alt: true } ]
	}
};

Status_ClearBtn.actionBinding = function()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE))
	{
		// User wishes to save unsaved changes before clearing
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CLEARFORM);
		Status_SaveBtn.actionBinding();
	}
	else
	{
		clearScreen();
	}
}

/**********************************************************************************/

function Status_CloseBtn() {}
Status_CloseBtn.tabIndex = 220;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainAdminUsers" } ]
	}
};

Status_CloseBtn.actionBinding = function()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE))
	{
		// User wishes to save unsaved changes before exiting
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveBtn.actionBinding();
	}
	else
	{
		exitScreen();
	}
}