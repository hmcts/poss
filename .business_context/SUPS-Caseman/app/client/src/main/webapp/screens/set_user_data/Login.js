/** 
 * @fileoverview Login.js:
 * This file contains the field configurations for the Stubbed Set User Data screen.
 * The purpose of the screen is to allow the user to set user data but will only work
 * if the user skips login and has security turned off.
 *
 * @author Chris Vincent
 */

/**
 * XPath Constants
 * @author kznwpr
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";

/****************************** MAIN FORM *****************************************/

function login() {};
/**
 * @author kznwpr
 * 
 */
login.initialise = function()
{
	var userName = Services.getCurrentUser();
	Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/UserName", userName);
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/OwningCourtCode", courtCode);
}

login.refDataServices = [
	{ name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourts", serviceParams:[] }
];

/***************************** HELPER FUNCTIONS ************************************/

/**
 * Function indicates whether or not the user is currently logged in or they decided
 * to skip login.
 *
 * @return [Boolean] True if the user logged in, else false
 * @author kznwpr
 */
function isUserLoggedIn()
{
	var loggedInUser = Services.getCurrentUser();
	return ( loggedInUser == "anonymous" ) ? false : true;
}

/******************************* LOV GRIDS *****************************************/

function OwningCourt_LOVGrid() {};
OwningCourt_LOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/OwningCourtCode";
OwningCourt_LOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
OwningCourt_LOVGrid.rowXPath = "Court";
OwningCourt_LOVGrid.keyXPath = "Code";
OwningCourt_LOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

OwningCourt_LOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
OwningCourt_LOVGrid.destroyOnClose = false;

OwningCourt_LOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "OwningCourt_LOVButton"} ],
		keys: [ 
			{ key: Key.F6, element: "OwningCourt_Code" },
			{ key: Key.F6, element: "OwningCourt_Name" }
		],
		isEnabled: function()
		{
			return isUserLoggedIn() ? false : true;
		}
	}
};

OwningCourt_LOVGrid.logicOn = [OwningCourt_LOVGrid.dataBinding];
OwningCourt_LOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(OwningCourt_LOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(OwningCourt_LOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(OwningCourt_Code.dataBinding, courtCode);
		Services.setValue(OwningCourt_LOVGrid.dataBinding, "");
	}
}

/********************************* FIELDS ******************************************/

function UserName() {};
UserName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/UserName";
UserName.tabIndex = -1;
UserName.helpText = "User Name";
UserName.isReadOnly = function() { return true; }

/***********************************************************************************/

function UserAlias() {};
UserAlias.dataBinding = CaseManFormParameters.USER_ALIAS_XPATH
UserAlias.tabIndex = -1;
UserAlias.helpText = "User Alias";
UserAlias.isReadOnly = function() { return true; }

/***********************************************************************************/

function UserRole() {};
UserRole.dataBinding = CaseManFormParameters.SECURITYROLE_XPATH;
UserRole.tabIndex = -1;
UserRole.helpText = "User Role";
UserRole.isReadOnly = function() { return true; }

/***********************************************************************************/

function CourtId() {};
CourtId.dataBinding = CaseManFormParameters.COURTID_XPATH;
CourtId.tabIndex = -1;
CourtId.helpText = "Court Id";
CourtId.isReadOnly = function() { return true; }

/***********************************************************************************/

function OwningCourt_Code() {};
OwningCourt_Code.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Code.tabIndex = 2;
OwningCourt_Code.maxLength = 3;
OwningCourt_Code.helpText = "Owning court code";
OwningCourt_Code.isReadOnly = isUserLoggedIn;
OwningCourt_Code.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + OwningCourt_Code.dataBinding + "]/Name");
	if ( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

OwningCourt_Code.logicOn = [OwningCourt_Code.dataBinding];
OwningCourt_Code.logic = function(event)
{
	if (event.getXPath() != OwningCourt_Code.dataBinding)
	{
		return;
	}
	
	var courtCode = Services.getValue(OwningCourt_Code.dataBinding);
	if ( !CaseManUtils.isBlank( courtCode ) )
	{
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + OwningCourt_Code.dataBinding + "]/Name");
		if ( Services.getValue(OwningCourt_Name.dataBinding) != courtName )
		{
			Services.setValue(OwningCourt_Name.dataBinding, courtName);
		}
	}
	else
	{
		Services.setValue(OwningCourt_Name.dataBinding, "");
	}
}

/***********************************************************************************/

function OwningCourt_Name() {};
OwningCourt_Name.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/OwningCourtName";
OwningCourt_Name.tabIndex = 3;
OwningCourt_Name.maxLength = 70;
OwningCourt_Name.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
OwningCourt_Name.rowXPath = "Court";
OwningCourt_Name.keyXPath = "Name";
OwningCourt_Name.displayXPath = "Name";
OwningCourt_Name.isReadOnly = isUserLoggedIn;
OwningCourt_Name.helpText = "Owning court name";
OwningCourt_Name.logicOn = [OwningCourt_Name.dataBinding];
OwningCourt_Name.logic = function(event)
{
	if (event.getXPath() != OwningCourt_Name.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(OwningCourt_Name.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = '" + courtName + "']/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(OwningCourt_Code.dataBinding) != courtCode )
		{
			Services.setValue(OwningCourt_Code.dataBinding, courtCode);
		}
	}
	else
	{
		if ( null == OwningCourt_Code.validate() )
		{
			Services.setValue(OwningCourt_Code.dataBinding, "");
		}
	}
}

OwningCourt_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

OwningCourt_Name.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/***********************************************************************************/

function OwningCourt_LOVButton() {};
OwningCourt_LOVButton.tabIndex = 4;
OwningCourt_LOVButton.isEnabled = function()
{
	return isUserLoggedIn() ? false : true;
}

/**********************************************************************************/

function UserData_SetButton() {};
UserData_SetButton.tabIndex = 6;
UserData_SetButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "login" } ]
	}
};

UserData_SetButton.isEnabled = function()
{
	return isUserLoggedIn() ? false : true;
}

/**
 * @author kznwpr
 * 
 */
UserData_SetButton.actionBinding = function()
{
	var adminCC = Services.getValue(OwningCourt_Code.dataBinding);
	var adminCN = Services.getValue(OwningCourt_Name.dataBinding);

	if ( !CaseManUtils.isBlank(adminCC) )
	{
		Services.setValue(CaseManFormParameters.COURTNUMBER_XPATH, adminCC);
		Services.setValue(CaseManFormParameters.COURTNAME_XPATH, adminCN);
	}
	alert("Details saved");
}

/**********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 8;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "login" } ]
	}
};
/**
 * @author kznwpr
 * 
 */
Status_CloseButton.actionBinding = function()
{
	Services.navigate(NavigationController.MAIN_MENU);
};
