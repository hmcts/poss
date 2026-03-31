/*******************************************************************************
 *
 * DISC SUPS
 * Copyright Logica UK Ltd. 2008
 *
 * $Revision:  $
 * $Author:  $
 * $Date:  $
 * $Id:  $
 *
 ******************************************************************************/

/** 
 * @fileoverview MaintainUsers.js:
 * This file conains the form and field configurations for the UC202 - 
 * Maintain users screen.
 * 
 * @author Ian Stainer, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 30/05/2006 - Chris Vincent, added JavaDoc comments and changed Global Variables to
 *              Static variables.  User Id field now Read Only instead of Disabled.
 * 09/11/2006 - Chris Vincent, updated Main_Role.rowXPath variable to filter the EDS Administrator
 * 				out of the roles dropdown to prevent users being assigned a non DCA role via the
 * 				screen.  Candidate Release Z issue 199.
 * 15/01/2007 - Chris Vincent, introduced Main_Role.validate() to prevent the CCBC Manager role being applied
 * 				on non CCBC (335) courts.  Temp_CaseMan Defect 350.
 * 15/01/2007 - Chris Vincent, introduced Main_Role.validate() to prevent the CCBC roles being applied
 * 				on non CCBC (335) courts.  Temp_CaseMan Defect 350, now CaseMan Defect 6069 and also
 * 				CaseMan defect 6005.
 * 05/02/2008 - Chris Vincent, added printer court code fields to enable the user to select a court
 * 				other than their home court to print from.  CaseMan Defect 6181
 */
/** 
* @version 1.1 
* 
* @changes
* 11-09-2008 Nilesh Mistry - Adding admin role checkbox, RFC 521
* 1-12-2008 Nilesh Mistry - Changes made so that an admin cannot deactivate their own profile
* 21-3-2009 Sandeep Mullangi - Fixing defect for 'Alias in use' defect. Removing serverValidate feature.
*/

/**
 * Enumeration of popup modes.
 * @author kznwpr
 * 
 */
function ScreenMode() {}
ScreenMode.ADD = "Add";
ScreenMode.EDIT = "Edit";

/**
 * Enumeration of status values. A user will have one of these statuses
 * @author kznwpr
 * 
 */
function UserStatus() {}
UserStatus.NEW = "New";
UserStatus.ACTIVE = "Active";
UserStatus.INACTIVE = "Inactive";

/**
 * Maintain User Services Used
 * @author kznwpr
 * 
 */
function MaintainUserServices() {};
MaintainUserServices.GET_USER_SERVICE = "getUser";
MaintainUserServices.UPDATE_USER_SERVICE = "updateProfile";
MaintainUserServices.ADD_USER_SERVICE = "addUser";
MaintainUserServices.DEACTIVATE_USER_SERVICE = "deactivateUser";
MaintainUserServices.VALIDATE_USER_SERVICE = "validateUser";
MaintainUserServices.GET_USER_ALIAS_COUNT_SERVICE = "getUserAliasCount";

/**
 * Actions After Saving
 * @author kznwpr
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";

/**
 * XPath Constants
 * @author kznwpr
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_ERRORCODE_XPATH = "/ds/var/errorCode";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.BUSINESS_DATA_BINDING_ROOT = "/ds/MaintainUser";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.USERID_ENABLER_XPATH	= XPathConstants.VAR_PAGE_XPATH + "/EnableUserId";
XPathConstants.FIELD_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/EnableFields";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.CURRENT_SCREEN_MODE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ScreenMode";
XPathConstants.IS_ADMINISTRATOR_XPATH = XPathConstants.VAR_PAGE_XPATH + "/IsAdministrator";
XPathConstants.USER_STATUS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/UserStatus";
XPathConstants.ACTIVE_USER_XPATH = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/ActiveUser";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ActionAfterSave";

/******************************* FORM ELEMENT **************************************/

function maintainUsers() {}

// Load the reference data into the model
maintainUsers.refDataServices = [
	{name:"CourtDetails", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtDetails", serviceParams:[]},	
	{name:"Roles", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"Roles.xml"},
	{name:"CourtSections", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtSectionList", serviceParams:[]},
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] },
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/**
 * @author kznwpr
 * 
 */
maintainUsers.initialise = function()
{
	loadUserList();
	
	// The default screen state is the user id field is enabled, 
	// the rest of the form fields are disabled and we are in edit mode
	enableUserId();
	disableFields();
	setCurrentScreenMode(ScreenMode.EDIT);
	
	// Set whether or not the logged in user is an administrator
	setUserAdministratorStatus();
	
	// If the user is not an administrator then the user can only edit his own details
	if ( !userIsAdministrator() )
	{
		// Set the userId
		Services.setValue(Header_UserId.dataBinding, Services.getCurrentUser());
	}
}

/****************************** NAVIGATION BAR *************************************/

menubar = {
	quickLinks: [
		{
			id: "NavBar_CourtUsersReportButton",
			formName: NavigationController.MAIN_MENU,
			label: "Court Users Report",
			guard:   function() 
					 {
					    // Run report
					    requestReport();
					 
					 	// Never allow navigation as are calling a report service, not a form/subform
						return false;
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_AuditButton",
			label: "Audit",
			subformId: "auditSubform",
			guard: function() { return false; },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm("auditSubform"); }
		}
	]
}

/******************************* DATA BINDINGS *************************************/

Header_CourtCode.dataBinding		 = XPathConstants.REF_DATA_XPATH + "/Court/CourtDetails/Code";
Header_CourtName.dataBinding		 = XPathConstants.REF_DATA_XPATH + "/Court/CourtDetails/Name";
Header_UserId.dataBinding			 = XPathConstants.VAR_PAGE_XPATH + "/UserId";

Main_Title.dataBinding				 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Title";
Main_Forenames.dataBinding			 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Forenames";
Main_Surname.dataBinding			 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Surname";
Main_UserShortName.dataBinding		 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/UserShortName";
Main_Extension.dataBinding			 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Extension";
Main_PrinterCourtCode.dataBinding    = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PrinterCourtCode";
Main_PrinterCourtName.dataBinding	 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PrinterCourtName";
Main_DefaultPrinter.dataBinding		 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DefaultPrinter";
Main_SectionForPrintouts.dataBinding = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/SectionForPrintouts";
Main_SectionForBMS.dataBinding		 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/SectionForBMS";
Main_Role.dataBinding				 = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Role";
Main_SystemAdminIndicator.dataBinding = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/AdminRole";

/******************************* LOV POPUPS ****************************************/

function UsersLOV() {};
UsersLOV.dataBinding = Header_UserId.dataBinding;
UsersLOV.srcData = XPathConstants.REF_DATA_XPATH + "/Users";
UsersLOV.rowXPath = "User";
UsersLOV.keyXPath = "UserId";
UsersLOV.columns = [
	{xpath: "UserId", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Forenames"},
	{xpath: "Surname"}
];

UsersLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_UserIdLOVBtn"} ],
		keys: [ { key: Key.F6, element: "Header_UserId" } ]
	}
};

/**********************************************************************************/

function PrintersLOV() {};
PrintersLOV.dataBinding = Main_DefaultPrinter.dataBinding;
PrintersLOV.srcData = XPathConstants.REF_DATA_XPATH + "/Printers";
PrintersLOV.rowXPath = "Printer";
PrintersLOV.keyXPath = "PrintShareName";
PrintersLOV.columns = [
	{xpath: "PrintShareName", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "PrinterName"}
];

PrintersLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "Main_DefaultPrinterLOVBtn"} ],
		keys: [ { key: Key.F6, element: "Main_DefaultPrinter" } ],
		enableOn: [XPathConstants.FIELD_ENABLER_XPATH, Main_PrinterCourtCode.dataBinding],
		isEnabled: function()
		{
			var blnEnabled = true;
			var printerCourtCode = Services.getValue(Main_PrinterCourtCode.dataBinding);
			if ( !getFieldsAreEnabled() )
			{
				// Screen is blank
				blnEnabled = false;
			}
			else if ( CaseManUtils.isBlank(printerCourtCode) || null != Main_PrinterCourtCode.validate() )
			{
				// Printer court code is blank or is not valid
				blnEnabled = false;
			}
			return blnEnabled;
		}
	}
};

/**********************************************************************************/

function Main_PrinterCourtLOVGrid() {};
Main_PrinterCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/TransferCourtCode";
Main_PrinterCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Main_PrinterCourtLOVGrid.rowXPath = "Court";
Main_PrinterCourtLOVGrid.keyXPath = "Code";
Main_PrinterCourtLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

Main_PrinterCourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
Main_PrinterCourtLOVGrid.destroyOnClose = false;
Main_PrinterCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Main_PrinterCourtLOVButton"} ],
		keys: [ 
			{ key: Key.F6, element: "Main_PrinterCourtCode" }, 
			{ key: Key.F6, element: "Main_PrinterCourtName" } 
		],
		enableOn: [XPathConstants.FIELD_ENABLER_XPATH],
		isEnabled: function()
		{
			return getFieldsAreEnabled() ? true : false;
		}
	}
};

Main_PrinterCourtLOVGrid.nextFocusedAdaptorId = function() {
	return "Main_PrinterCourtCode";
}

Main_PrinterCourtLOVGrid.logicOn = [Main_PrinterCourtLOVGrid.dataBinding];
Main_PrinterCourtLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(Main_PrinterCourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(Main_PrinterCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(Main_PrinterCourtCode.dataBinding, courtCode);
		Services.setValue(Main_PrinterCourtLOVGrid.dataBinding, "");
	}
}

/******************************* MAIN FUNCTIONS ************************************/

/** 
 * Function to load the user list data that is displayed in the user lov
 * @author kznwpr
 * 
 */
function loadUserList()
{	
	var params = new ServiceParams();
	// Get the court number that the logged in user is assigned to out of the app section of the dom
	params.addSimpleParameter("courtId", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.callService("getUserList", params, loadUserList, true);
}

/**
 * @param dom
 * @author kznwpr
 * 
 */
loadUserList.onSuccess = function(dom)
{ 
	if(null != dom)
	{
		// Select the data
		var data = dom.selectSingleNode("/Users");
	
		if(data != null)
		{
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Users", data);
		}		
	}  
}

/** 
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
loadUserList.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**********************************************************************************/

/** 
 * Loads the application data for the screen
 * @author kznwpr
 * 
 */
function loadData()
{
	var params = new ServiceParams();
	params.addSimpleParameter("userBeingEdited", Services.getValue(Header_UserId.dataBinding));
	Services.callService(MaintainUserServices.GET_USER_SERVICE, params, Header_UserId, true);
}

/**********************************************************************************/

/** 
 * Disables the main user fields on the screen
 * @author kznwpr
 * 
 */
function disableFields() { Services.setValue(XPathConstants.FIELD_ENABLER_XPATH, 'false'); }

/**********************************************************************************/

/** 
 * Enables the main user fields on the screen
 * @author kznwpr
 * 
 */
function enableFields() { Services.setValue(XPathConstants.FIELD_ENABLER_XPATH, 'true'); }

/**********************************************************************************/

/** 
 * Disables the user id field
 * @author kznwpr
 * 
 */
function disableUserId() { Services.setValue(XPathConstants.USERID_ENABLER_XPATH, 'false'); }

/**********************************************************************************/

/** 
 * Enables the user id field
 * @author kznwpr
 * 
 */
function enableUserId() { Services.setValue(XPathConstants.USERID_ENABLER_XPATH, 'true'); }

/**********************************************************************************/

/** 
 * Function indicates whether or not the main user fields are enabled.
 * @return [Boolean] True if the main user fields are enabled, else False
 * @author kznwpr
 */
function getFieldsAreEnabled()
{
	return Services.getValue(XPathConstants.FIELD_ENABLER_XPATH) == 'true';
}

/**********************************************************************************/

/**
 * Function sets the main user fields to blank.
 * @author kznwpr
 * 
 */
 /*
  * Changed by Nilesh Mistry for RFC 521 (TRAC ticket #10) to ensure that Admin tickbox is cleared as well
  */
function resetForm()
{
	fields = [Main_Title.dataBinding, Main_Forenames.dataBinding, Main_Surname.dataBinding, 
				Main_UserShortName.dataBinding, Main_Extension.dataBinding,
				Main_DefaultPrinter.dataBinding, Main_SectionForPrintouts.dataBinding,
				Main_SectionForBMS.dataBinding, Main_Role.dataBinding, Main_PrinterCourtCode.dataBinding];
				
	Services.startTransaction();
	for (var i = 0; i < fields.length; i++)
	{
		Services.setValue(fields[i], "");
	}
	Services.setValue(Main_SystemAdminIndicator.dataBinding, "N");
	Services.endTransaction();
}

/**********************************************************************************/

/**
 * Function indicates whether or not the user has made any changes.
 * @return [Boolean] True if there are unsaved changes, else False
 * @author kznwpr
 */
function changesMade() 
{
	return (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y")
}

/**********************************************************************************/

/**
 * Function clears the changes made status
 * @author kznwpr
 * 
 */
function clearChangesMade() 
{
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
}

/**********************************************************************************/

/**
 * Function sets the changes made flag
 * @author kznwpr
 * 
 */
function setChangesMade()
{
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "Y")
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
	}
}

/**********************************************************************************/

/**
 * Logic to detect when fields have been updated so the user can be prompted to
 * Save when navigating away from the screen.
 * @author kznwpr
 * 
 */
function changesMadeLogic() {}

changesMadeLogic.logicOn = [Main_Title.dataBinding, 
				Main_UserShortName.dataBinding, Main_Extension.dataBinding,
				Main_DefaultPrinter.dataBinding, Main_SectionForPrintouts.dataBinding,
				Main_SectionForBMS.dataBinding, Main_Role.dataBinding, Main_PrinterCourtCode.dataBinding, Main_SystemAdminIndicator.dataBinding];

changesMadeLogic.logic = function(event)
{
	/* If the event is not an update then quit. This filters out add events which 
	 * occur when the data is first loaded. Obviously when data is first loaded
	 * we don't want that to register as a change to the data - that's what the 
	 * xpath bit is doing.
 */
	if (event.getType() != DataModelEvent.UPDATE || event.getXPath() == "/ds/MaintainUsers[position() = 1]") {return;}
	setChangesMade();
}

/**********************************************************************************/

/**
 * Returns the value of the current screen mode.
 * @return [String] The current screen mode (see ScreenMode enumeration)
 * @author kznwpr
 */
function getCurrentScreenMode()
{
	return Services.getValue(XPathConstants.CURRENT_SCREEN_MODE_XPATH);
}

/**********************************************************************************/

/**
 * Sets the current screen mode.
 * @param [String] mode The screen mode to be set (see ScreenMode enumeration)
 * @author kznwpr
 * @return Services.setValue(XPathConstants.CURRENT_SCREEN_MODE_XPATH, mode)  
 */
function setCurrentScreenMode(mode)
{
	return Services.setValue(XPathConstants.CURRENT_SCREEN_MODE_XPATH, mode);
}

/**********************************************************************************/

/**
 * Used by the form fields to enforce upper case.
 * @param [String] value The string to be converted to upper case
 * @return [String] The string passed in converted to upper case or null if param was null
 * @author kznwpr
 */
function upperCaseData(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

/**
 * Used by the form fields to enforce lower case
 * @param [String] value The string to be converted to lower case
 * @return [String] The string passed in converted to lower case or null if param was null
 * @author kznwpr
 */
function lowerCaseData(value)
{
	return (null != value) ? value.toLowerCase() : null;
}

/**********************************************************************************/

/**
 * Closes down the screen and returns to the main menu
 * @author kznwpr
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/**********************************************************************************/

/**
 * Function validates the form prior to saving
 * @return [Boolean] True if the form is valid, else False
 * @author kznwpr
 */
function validateForm()
{
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (0 != invalidFields.length) 
	{
		return false;
	}	
	return true;
}

/**********************************************************************************/

/**
 * Call this function to validate the user id entered. This function calls the server
 * and checks the user id entered is not already in use.
 * @param userId
 * @author kznwpr
 * 
 */
function validateUser(userId)
{
	var params = new ServiceParams();
	params.addSimpleParameter("getUserId", userId);
	Services.callService(MaintainUserServices.VALIDATE_USER_SERVICE, params, validateUser, true);
}

/**
 * @param dom
 * @author kznwpr
 * 
 */
validateUser.onSuccess = function(dom)
{ 
	var root = "/UserPersonalDetails";
	if ( null != dom && null != dom.selectSingleNode(root) )
	{			
		var status = XML.getNodeTextContent(dom.selectSingleNode(root + "/Status"));
		var userId = XML.getNodeTextContent(dom.selectSingleNode(root + "/UserId"));
		var forenames = XML.getNodeTextContent(dom.selectSingleNode(root + "/Forenames"));
		var surname = XML.getNodeTextContent(dom.selectSingleNode(root + "/Surname"));

		// Store the user status because it affects save functionality eg saving a reactivated user is different
		// from saving a new user or an existing user
		setUserStatus(status);

		// The user exists in the database so load the data for maintenance
		if (UserStatus.ACTIVE == status)
		{
			loadData();
			// It's an existing user so disable the user id field
			disableUserId();		
			enableFields();
			clearChangesMade();		
			setCurrentScreenMode(ScreenMode.EDIT);
		}
		// The user has already been created in the database but is now inactive
		else if (UserStatus.INACTIVE == status)
		{
			// The user exists in link but has not been created in the caseman database so ask if we should create him/her
			if (confirm(Messages.format(Messages.CONFIRM_REACTIVATE_USER_MESSAGE, [userId])))
			{
				loadData();
				// It's an existing user so disable the user id field
				disableUserId();		
				enableFields();
				clearChangesMade();				
			}
			// Administrator has chosen not to reactivate the user
			else
			{
				// Clear out the user
				Services.setValue(Header_UserId.dataBinding, '');
			}
		}
		else
		{
			// The user exists in link but has not been created in the caseman database so ask if we should create him/her
			if (confirm(Messages.format(Messages.CONFIRM_CREATE_NEW_USER_MESSAGE, [userId])))
			{
				// Initialise the visible fields
				resetForm();
				// Copy the user id to the business dom
				Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/UserId", userId);
				// Copy the administrator's court code into the dom
				Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CourtCode", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
				// Set the home flag
				Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/HomeFlag", "Y");
				// Set the from date				
				Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DateFrom", getTodaysDate());

				// Copy the data that is stored in link into the appropriate fields
				Services.setValue(Main_Forenames.dataBinding, forenames);
				Services.setValue(Main_Surname.dataBinding, surname);
								
				// Once it has been confirmed that the user exists in link disable the field
				disableUserId();				
				enableFields();
				setCurrentScreenMode(ScreenMode.ADD);
			}
			else
			{
				resetForm();
				enableUserId();		
				disableFields();
				clearChangesMade();
			}
		}	
	}  	
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
validateUser.onBusinessException = function(exception)
{
	// Display the text of the original message
	alert(exception.message.slice(exception.message.lastIndexOf(":")+1));
	enableUserId();		
	disableFields();	
	resetForm();
	clearChangesMade();			
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
validateUser.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**********************************************************************************/

/**
 * Sets whether or not the logged in user is an administrator
 * @author kznwpr
 * 
 */
function setUserAdministratorStatus()
{
	var isAdmin = Services.hasAccessToRoles(["admin"]);
	Services.setValue(XPathConstants.IS_ADMINISTRATOR_XPATH, isAdmin.toString());
}

/**********************************************************************************/

/**
 * Function indicates whether or not the logged in user is an administrator.
 * @return [Boolean] True if the current user is an administrator, else False
 * @author kznwpr
 */
function userIsAdministrator()
{
	return Services.getValue(XPathConstants.IS_ADMINISTRATOR_XPATH) == 'true';
}

/**********************************************************************************/

/**
 * Function return the current system date which has been read from the server into the dom.
 * @return [String] The current system date in the format YYYY-MM-DD
 * @author kznwpr
 */
function getTodaysDate()
{
	return Services.getValue(XPathConstants.SYSTEMDATE_XPATH);
}

/**********************************************************************************/

/**
 * Function indicates whether or not the profile being edited is active.
 * @return [Boolean] True if the user loaded is active, else False
 * @author kznwpr
 */
function isProfileActive()
{
	return UserStatus.ACTIVE == Services.getValue(XPathConstants.USER_STATUS_XPATH);
}

/**********************************************************************************/

/**
 * We store the status in an xpath because the deactivate button needs to partially base 
 * its enabling on the user status. With an xpath it can use it in its enable on rule
 * @param status
 * @author kznwpr
 * 
 */
function setUserStatus(status)
{
	Services.setValue(XPathConstants.USER_STATUS_XPATH, status);
}

/**********************************************************************************/

/**
 * Function handles the functionality behind the clear button 
 * @author kznwpr
 * 
 */
function clearScreen()
{
	// The screen mode must be set first
	setCurrentScreenMode(ScreenMode.EDIT);
	
	// Clear the user id field and set focus
	Services.setValue(Header_UserId.dataBinding, "");
	Services.setFocus("Header_UserId");
	
	// And enable it
	enableUserId();	
	
	// Clear the form fields
	resetForm();
	
	// And disable them
	disableFields();
	clearChangesMade();
}

/**********************************************************************************/

/** 
 * Executes the Court user list report
 */
function requestReport()
{
	var dom = Reports.createReportDom("CM_USER_LST.rdf");
	Reports.runReport(dom, false);
}

/******************************* HEADER PANEL **************************************/

function Header_CourtCode() {};
Header_CourtCode.tabIndex = -1;
Header_CourtCode.isReadOnly = function() { return true; }
Header_CourtCode.helpText = "The owning court code";

/**********************************************************************************/

function Header_CourtName() {};
Header_CourtName.tabIndex = -1;
Header_CourtName.isReadOnly = function() { return true; }
Header_CourtName.helpText = "The name of the owning court";

/**********************************************************************************/

function Header_UserId() {};
Header_UserId.componentName = "User Id";
Header_UserId.tabIndex = 10;
Header_UserId.maxLength = 10;
Header_UserId.isMandatory = function() { return true; }
Header_UserId.helpText = "The user Id";
Header_UserId.readOnlyOn = [XPathConstants.USERID_ENABLER_XPATH];
Header_UserId.isReadOnly = function()
{
	return Services.getValue(XPathConstants.USERID_ENABLER_XPATH) != "true";
}
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

Header_UserId.logicOn = [Header_UserId.dataBinding];
Header_UserId.logic = function(event)
{
	// Do not run this code if the user id is cleared or we are in add mode or the user is invalid
	if (Services.getValue(this.dataBinding) == "" || getCurrentScreenMode() == ScreenMode.ADD || !this.getValid()) {return;}

	// Check for any changes made to the existing user being maintained
	if (changesMade())
	{
		if (confirm(Messages.DETSLOST_MESSAGE))
		{
			// If the form data does not validate then quit
			if (!validateForm){ return;}

			Status_SaveBtn.actionBinding();
		}
	}

	if ( userIsAdministrator() )	
	{
		validateUser(Services.getValue(this.dataBinding));	
	}
	else
	{
		loadData();
		// It's an existing user so disable the user id field
		disableUserId();		
		enableFields();
		clearChangesMade();		
	}
}

/**
 * Handle the callback after a successful server call.
 * @param dom
 * @author kznwpr
 * 
 */
Header_UserId.onSuccess = function(dom)
{
	if( null != dom )
	{
		// Select the MaintainUsers tag rather than the ds tag
		var data = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	
		if( null != data )
		{
			Services.replaceNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT, data);
		}
	}
	
	// If this has been called by reloading data after a successfully adding a new user
	// then reset the form and go into edit mode
	if ( getCurrentScreenMode() == ScreenMode.ADD )
	{
		clearScreen();
	}	
	clearChangesMade();
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Header_UserId.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**********************************************************************************/

function Header_UserIdLOVBtn() {}
Header_UserIdLOVBtn.tabIndex = 20;
Header_UserIdLOVBtn.enableOn = [XPathConstants.CURRENT_SCREEN_MODE_XPATH, XPathConstants.IS_ADMINISTRATOR_XPATH];
Header_UserIdLOVBtn.isEnabled = function()
{
	// The lov button is enabled when the screen is in edit mode and
	// the logged in user is an administrator
	return getCurrentScreenMode() == ScreenMode.EDIT && userIsAdministrator();
}

/******************************* MAIN PANEL ****************************************/

function Main_Title() {};
Main_Title.tabIndex = 30;
Main_Title.maxLength = 35;
Main_Title.readOnlyOn = [XPathConstants.IS_ADMINISTRATOR_XPATH];
Main_Title.isReadOnly = function() {return !userIsAdministrator();}
Main_Title.helpText = "The user's title";
Main_Title.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_Title.isEnabled = getFieldsAreEnabled;
Main_Title.transformToModel = function(value)
{
	return upperCaseData(value);
}

/**********************************************************************************/

function Main_Forenames() {};
Main_Forenames.tabIndex = -1;
Main_Forenames.maxLength = 70;
Main_Forenames.isReadOnly = function() { return true; }
Main_Forenames.helpText = "The user's forenames";
Main_Forenames.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_Forenames.isEnabled = getFieldsAreEnabled;
Main_Forenames.transformToModel = function(value)
{
	return upperCaseData(value);
}

/**********************************************************************************/

function Main_Surname() {};
Main_Surname.tabIndex = -1;
Main_Surname.maxLength = 35;
Main_Surname.isReadOnly = function() { return true; }
Main_Surname.helpText = "The user's surname";
Main_Surname.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_Surname.isEnabled = getFieldsAreEnabled;
Main_Surname.transformToModel = function(value)
{
	return upperCaseData(value);
}

/**********************************************************************************/

function Main_UserShortName() {};
Main_UserShortName.tabIndex = 60;
Main_UserShortName.maxLength = 20;
Main_UserShortName.readOnlyOn = [XPathConstants.IS_ADMINISTRATOR_XPATH];
Main_UserShortName.isReadOnly = function() { return !userIsAdministrator(); }
Main_UserShortName.helpText = "The user's alias";
Main_UserShortName.componentName = "Alias";
Main_UserShortName.isMandatory = function() { return true; }
Main_UserShortName.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_UserShortName.isEnabled = getFieldsAreEnabled;
Main_UserShortName.validateOn = [Main_UserShortName.dataBinding];
/**
 * The rules for the alias field are as follows:
 * Only editable by the administrator
 * Must be between 4 and 20 characters in length
 * Must have at least 2 capital letters
 * Must have at least one space which cannot be the first or last character
 * Cannot have any numbers
 * Must be unique
 * @author kznwpr
 * @return code  
 */
Main_UserShortName.validate = function()
{
    var code = null;
	var alias = Services.getValue(this.dataBinding);
	var strLength = alias.length;
	if(strLength < 4 || strLength > 20)	{code = ErrorCode.getErrorCode("CaseMan_AliasLength");}
	if( null == code )
	{
	    var capsPattern = /^[A-Z]/;
	    var capsCount = 0;
	    var spaceCount = 0;
	    var numsCount = 0;
	    for(var index = 0; index < strLength; index++) 
	    {
	        var focusChar = alias.charAt(index);
	        if( CaseManValidationHelper.validateNumber(focusChar) )
	        {
	        	numsCount++;
	        }
	        else if(focusChar == " " && index == 0)
	        {
	            code = ErrorCode.getErrorCode("CaseMan_AliasSpaceAsFirstChar");
	            spaceCount++;
	        }	        
	        else if(focusChar == " ")
	        {
	            if(index == strLength -1) {code = ErrorCode.getErrorCode("CaseMan_AliasSpaceAsLastChar");}
	            spaceCount++;
	        }
	        else if(capsPattern.test(focusChar))
	        {
	            capsCount++;	        
	        }
	    }
	    if(capsCount < 2 && code == null) {code = ErrorCode.getErrorCode("CaseMan_AliasCaps");}
	    if(spaceCount == 0 && code == null) {code = ErrorCode.getErrorCode("CaseMan_AliasSpace");}
	    if(numsCount != 0 && code == null) {code = ErrorCode.getErrorCode("CaseMan_AliasNums");}
	}
    //performing server validation
    if( null == code){
        Services.setValue(XPathConstants.VAR_ERRORCODE_XPATH, null);
        var params = new ServiceParams();
        params.addSimpleParameter("userBeingEdited", Services.getValue(Header_UserId.dataBinding));
        params.addSimpleParameter("alias", Services.getValue(Main_UserShortName.dataBinding));
        //calling service with async flag to false
        Services.callService(MaintainUserServices.GET_USER_ALIAS_COUNT_SERVICE, params, Main_UserShortName, false);
        var errorCode = Services.getValue(XPathConstants.VAR_ERRORCODE_XPATH);
        if(!CaseManUtils.isBlank(errorCode)){
            code = ErrorCode.getErrorCode(errorCode);
        }
    }
	return code;
}

/**
 * get the error code if the UserAlias already exists
 *
 */
Main_UserShortName.onSuccess = function(dom){
	if(dom != null){
		var errorCode = dom.selectSingleNode("/Root/ErrorCode");
		if (errorCode != null){
		    Services.setValue(XPathConstants.VAR_ERRORCODE_XPATH, errorCode.text);
		}
	}
}

/**********************************************************************************/

function Main_Extension() {};
Main_Extension.tabIndex = 70;
Main_Extension.maxLength = 40;
Main_Extension.helpText = "The user's extension";
Main_Extension.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_Extension.isEnabled = getFieldsAreEnabled;
Main_Extension.transformToModel = function(value)
{
	return upperCaseData(value);
}
Main_Extension.transformToDisplay = function(value)
{
	return upperCaseData(value);
}

/**********************************************************************************/

function Main_PrinterCourtCode() {}
Main_PrinterCourtCode.tabIndex = 80;
Main_PrinterCourtCode.maxLength = 3;
Main_PrinterCourtCode.helpText = "Printer Court Code";
Main_PrinterCourtCode.componentName = "Printer Court Code";
Main_PrinterCourtCode.isMandatory = function() { return true; }
Main_PrinterCourtCode.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_PrinterCourtCode.isEnabled = getFieldsAreEnabled;
Main_PrinterCourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Main_PrinterCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		var courtExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Main_PrinterCourtCode.dataBinding + "]");
		if ( !courtExists )
		{
			// The entered court code does not exist
			ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
		}
	}
	return ec;
}

Main_PrinterCourtCode.logicOn = [Main_PrinterCourtCode.dataBinding];
Main_PrinterCourtCode.logic = function(event)
{
	var courtCode = Services.getValue(Main_PrinterCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(Main_PrinterCourtName.dataBinding, "");
		Services.setValue(Main_DefaultPrinter.dataBinding, "");
	}
	
	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Main_PrinterCourtCode.dataBinding + "]") )
	{
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Main_PrinterCourtCode.dataBinding + "]/Name");
		Services.setValue(Main_PrinterCourtName.dataBinding, courtName);
		
		// Retrieve the list of printers for the court selected
		var params = new ServiceParams();
		params.addSimpleParameter("courtId", courtCode);
		Services.callService("getPrintersList", params, Main_PrinterCourtCode, true);
	}
}

Main_PrinterCourtCode.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Printers", dom);
}

/**********************************************************************************/

function Main_PrinterCourtName() {}
Main_PrinterCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Main_PrinterCourtName.rowXPath = "Court";
Main_PrinterCourtName.keyXPath = "Name";
Main_PrinterCourtName.displayXPath = "Name";
Main_PrinterCourtName.strictValidation = true;
Main_PrinterCourtName.tabIndex = 90;
Main_PrinterCourtName.helpText = "Printer Court Name";
Main_PrinterCourtName.componentName = "Printer Court Name";
Main_PrinterCourtName.isMandatory = function() { return true; }
Main_PrinterCourtName.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_PrinterCourtName.isEnabled = getFieldsAreEnabled;

Main_PrinterCourtName.logicOn = [Main_PrinterCourtName.dataBinding];
Main_PrinterCourtName.logic = function(event)
{
	if (event.getXPath() != Main_PrinterCourtName.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(Main_PrinterCourtName.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		// Populate the Court Code field
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Main_PrinterCourtName.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(Main_PrinterCourtCode.dataBinding) != courtCode )
		{
			Services.setValue(Main_PrinterCourtCode.dataBinding, courtCode);
		}
	}
	else
	{
		// Court Name cleared so clear the Court Code field
		Services.setValue(Main_PrinterCourtCode.dataBinding, "");
	}
}

/**********************************************************************************/

function Main_PrinterCourtLOVButton() {}
Main_PrinterCourtLOVButton.tabIndex = 100;
Main_PrinterCourtLOVButton.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_PrinterCourtLOVButton.isEnabled = getFieldsAreEnabled;

/**********************************************************************************/

function Main_DefaultPrinter() {}
Main_DefaultPrinter.srcData = XPathConstants.REF_DATA_XPATH + "/Printers";
Main_DefaultPrinter.rowXPath = "Printer";
Main_DefaultPrinter.keyXPath = "PrintShareName";
Main_DefaultPrinter.displayXPath = "PrintShareName";
Main_DefaultPrinter.tabIndex = 110;
Main_DefaultPrinter.helpText = "The user's default printer";
Main_DefaultPrinter.strictValidation = true;
Main_DefaultPrinter.enableOn = [XPathConstants.FIELD_ENABLER_XPATH, Main_PrinterCourtCode.dataBinding];
Main_DefaultPrinter.isEnabled = function()
{
	var blnEnabled = true;
	var printerCourtCode = Services.getValue(Main_PrinterCourtCode.dataBinding);
	if ( !getFieldsAreEnabled() )
	{
		// Screen is blank
		blnEnabled = false;
	}
	else if ( CaseManUtils.isBlank(printerCourtCode) || null != Main_PrinterCourtCode.validate() )
	{
		// Printer court code is blank or is not valid
		blnEnabled = false;
	}
	return blnEnabled;
}

/**********************************************************************************/

function Main_DefaultPrinterLOVBtn() {}
Main_DefaultPrinterLOVBtn.tabIndex = 120;
Main_DefaultPrinterLOVBtn.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_DefaultPrinterLOVBtn.enableOn = [XPathConstants.FIELD_ENABLER_XPATH, Main_PrinterCourtCode.dataBinding];
Main_DefaultPrinterLOVBtn.isEnabled = function()
{
	var blnEnabled = true;
	var printerCourtCode = Services.getValue(Main_PrinterCourtCode.dataBinding);
	if ( !getFieldsAreEnabled() )
	{
		// Screen is blank
		blnEnabled = false;
	}
	else if ( CaseManUtils.isBlank(printerCourtCode) || null != Main_PrinterCourtCode.validate() )
	{
		// Printer court code is blank or is not valid
		blnEnabled = false;
	}
	return blnEnabled;
}

/**********************************************************************************/

function Main_SectionForPrintouts() {};
Main_SectionForPrintouts.tabIndex = 130;
Main_SectionForPrintouts.maxLength = 25;
Main_SectionForPrintouts.helpText = "The user's section information for printouts";
Main_SectionForPrintouts.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_SectionForPrintouts.isEnabled = getFieldsAreEnabled;
Main_SectionForPrintouts.transformToModel = function(value)
{
	return upperCaseData(value);
}
Main_SectionForPrintouts.transformToDisplay = function(value)
{
	return upperCaseData(value);
}

/**********************************************************************************/

function Main_SectionForBMS() {};
Main_SectionForBMS.tabIndex = 140;
Main_SectionForBMS.componentName = "Section for BMS";
Main_SectionForBMS.srcData = XPathConstants.REF_DATA_XPATH + "/Sections";
Main_SectionForBMS.rowXPath = "Section";
Main_SectionForBMS.keyXPath = "Id";
Main_SectionForBMS.displayXPath = "Description";
Main_SectionForBMS.strictValidation = true;
Main_SectionForBMS.readOnlyOn = [XPathConstants.IS_ADMINISTRATOR_XPATH];
Main_SectionForBMS.isReadOnly = function() { return !userIsAdministrator(); }
Main_SectionForBMS.isMandatory = function() { return true; }
Main_SectionForBMS.helpText = "The section the user belongs to";
Main_SectionForBMS.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_SectionForBMS.isEnabled = getFieldsAreEnabled;

/**********************************************************************************/

function Main_Role() {};
Main_Role.tabIndex = 150;
Main_Role.componentName = "Role";
Main_Role.srcData = XPathConstants.REF_DATA_XPATH + "/Roles";
Main_Role.rowXPath = "Role[./Id != 'edsAdmin']";
Main_Role.keyXPath = "Id";
Main_Role.displayXPath = "Description";
Main_Role.strictValidation = true;
Main_Role.readOnlyOn = [XPathConstants.IS_ADMINISTRATOR_XPATH];
Main_Role.isReadOnly = function() { return !userIsAdministrator(); }
Main_Role.isMandatory = function() { return true; }
Main_Role.helpText = "The role the user is assigned";
Main_Role.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_Role.isEnabled = getFieldsAreEnabled;
Main_Role.validate = function()
{
	// Temp_CaseMan defect 350 (CaseMan Defect 6069) and also CaseMan Defect 6005.
	// CCBC Roles should not be applied if the home court is not 335.
	var ec = null;
	var role = Services.getValue(Main_Role.dataBinding);
	var ccbcRole = Services.getValue(Main_Role.srcData + "/Role[./Id = " + Main_Role.dataBinding + "]/CCBCRole");
	var homeCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	if ( !CaseManUtils.isBlank(role) && ccbcRole == "true" && homeCourt != CaseManUtils.CCBC_COURT_CODE )
	{
		ec = ErrorCode.getErrorCode("CaseMan_CCBCRoleOnNonCCBCCourt_Msg");
	}
	return ec;
}

/***********************************************************************************/
/*
 * Added by Nilesh Mistry as part of RFC 521 (TRAC ticket #10) to add checkbox for System Admin Functionality
 */
function Main_SystemAdminIndicator() {};
Main_SystemAdminIndicator.tabIndex = 160;
Main_SystemAdminIndicator.componentName = "System Admin Functionality";
Main_SystemAdminIndicator.helpText = "System Admin Functionality";
Main_SystemAdminIndicator.modelValue = { checked: "Y", unchecked: "N" };
Main_SystemAdminIndicator.enableOn = [XPathConstants.FIELD_ENABLER_XPATH];
Main_SystemAdminIndicator.isEnabled = function () {
	return getFieldsAreEnabled();
};

/*
 * The checkbox should be read-only if user is not administrator or if user is an admin but editing their own details
 */
Main_SystemAdminIndicator.readOnlyOn = [Header_UserId.dataBinding];
Main_SystemAdminIndicator.isReadOnly = function() {
	return !userIsAdministrator() || (userIsAdministrator() && Services.getCurrentUser() == Services.getValue(Header_UserId.dataBinding));
};
Main_SystemAdminIndicator.modelValue = {checked: "Y", unchecked: "N"};


/******************************* STATUS BUTTONS ************************************/

function Status_SaveBtn() {}
Status_SaveBtn.tabIndex = 200;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainUsers" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.actionBinding = function()
{
	// If there are no changes then quit
	if (!changesMade())
	{
		alert("Sorry, there are no changes to save.");
		return;
	}	

	// Validate the form
	if ( !validateForm() )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		return;
	}	

	// Make service call...
	var service = ( getCurrentScreenMode() == ScreenMode.EDIT ) ? MaintainUserServices.UPDATE_USER_SERVICE : MaintainUserServices.ADD_USER_SERVICE;

	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	// Identify the /ds/MaintainUser node in the existing dom and take a copy of it
	var maintainUserNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	
	// If we are adding a new user then add the ActiveUser node to the dom and set its value to active
	// This is only done on an add. When updating we use the value of the flag returned from the server
	// to determine whether to just perform an update on an existing user or to reactivate a deactivated user.
	if ( MaintainUserServices.ADD_USER_SERVICE == service )
	{
		// Create the ActiveUser element and set it to active
		var activeUserNode = XML.createElement(businessDataDOM, "ActiveUser");
		activeUserNode.appendChild(businessDataDOM.createTextNode("Y"));
		// Add the ActiveUser element to the dom being sent to the server									
		maintainUserNode.appendChild(activeUserNode);			
	}
	
	// Create the /ds node that will be added to the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	// Append the maintain user node to the ds node
	dsNode.appendChild(maintainUserNode);
	// Add the ds node, which now contains a copy of all the business data
	businessDataDOM.appendChild(dsNode);
			
	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("maintainUser", businessDataDOM);
	
	// Call the appropriate service
	Services.callService(service, params, Status_SaveBtn, true);
}
	
/**
 * @param dom
 * @param serviceName
 * @author kznwpr
 * 
 */
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
				// Reload the user list
				loadUserList();
				// Reload the user being maintained
				// The load data call back handles reseting the screen after the save.
				loadData();
				// Reset the dirty flag
				clearChangesMade();
				// After a successful save the user is always active
				setUserStatus(UserStatus.ACTIVE);
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

function Status_DeactivateBtn() {}
Status_DeactivateBtn.tabIndex = 205;
Status_DeactivateBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainUsers", alt: true } ]
	}
};

Status_DeactivateBtn.enableOn = [XPathConstants.FIELD_ENABLER_XPATH, XPathConstants.IS_ADMINISTRATOR_XPATH, XPathConstants.USER_STATUS_XPATH, Header_UserId.dataBinding];
Status_DeactivateBtn.isEnabled = function()
{
	// If the user is an administrator and a valid user has been entered, the user is not looking at their own profile and the user is active then the control is enabled
	return userIsAdministrator() && getFieldsAreEnabled() && isProfileActive() && (Services.getCurrentUser() != Services.getValue(Header_UserId.dataBinding));
}

/**
 * @author kznwpr
 * @return ; } 
 */
Status_DeactivateBtn.actionBinding = function()
{
	if (!confirm(Messages.CONFIRM_DEACTIVATE_USER_MESSAGE)) { return; }

	// Validate the form
	if (!validateForm()) { return; }	

	// Clear the data for a deactivated user
	Services.setValue(XPathConstants.ACTIVE_USER_XPATH, 'N');
	Services.setValue(Main_Extension.dataBinding, '');
	Services.setValue(Main_SectionForPrintouts.dataBinding, '');
	Services.setValue(Main_DefaultPrinter.dataBinding, '');		
	
	// Make service call...

	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	// Identify the /ds/MaintainUser node in the existing dom and take a copy of it
	var maintainUserNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	// Create the /ds node that will be added to the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	// Append the maintain user node to the ds node
	dsNode.appendChild(maintainUserNode);
	// Add the ds node, which now contains a copy of all the business data
	businessDataDOM.appendChild(dsNode);

	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("maintainUser", businessDataDOM);
	
	// Call the service
	Services.callService(MaintainUserServices.DEACTIVATE_USER_SERVICE, params, Status_DeactivateBtn, true);		
}
	
/**
 * @param dom
 * @param serviceName
 * @author kznwpr
 * 
 */
Status_DeactivateBtn.onSuccess = function(dom, serviceName)
{
	if ( null != dom )
	{
		// Reload the user list
		loadUserList();
		
		// Clear the screen
		clearScreen();	
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
Status_DeactivateBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Status_DeactivateBtn.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**********************************************************************************/

function Status_ClearBtn() {}
Status_ClearBtn.tabIndex = 210;
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "maintainUsers", alt: true } ]
	}
};

// If the user is an administrator then the control is enabled
Status_ClearBtn.enableOn = [XPathConstants.IS_ADMINISTRATOR_XPATH];
Status_ClearBtn.isEnabled = userIsAdministrator;
/**
 * @author kznwpr
 * 
 */
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
		keys: [ { key: Key.F4, element: "maintainUsers" } ]
	}
};

/**
 * @author kznwpr
 * 
 */
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

/**********************************************************************************/

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}