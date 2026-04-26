/** 
 * @fileoverview AddNewEmpAddress_SubForm.js:
 * This file contains the configurations for the Add New Employer Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on address line fields (excluding postcode).
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Address";

/************************** FORM CONFIGURATIONS *************************************/

function addNewEmpAddressSubform() {}

addNewEmpAddressSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "AddressDOM.xml",
	dataBinding: "/ds"
}

addNewEmpAddressSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "AddressDOM.xml",
	dataBinding: "/ds"
}

addNewEmpAddressSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddAddress_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},
	
	returnSourceNodes: [XPathConstants.DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

addNewEmpAddressSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addNewEmpAddressSubform" } ],
					singleClicks: [ {element: "AddAddress_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

AddAddress_ContactDetails_Address_Line1.dataBinding = XPathConstants.DATA_XPATH + "/Line[1]";
AddAddress_ContactDetails_Address_Line2.dataBinding = XPathConstants.DATA_XPATH + "/Line[2]";
AddAddress_ContactDetails_Address_Line3.dataBinding = XPathConstants.DATA_XPATH + "/Line[3]";
AddAddress_ContactDetails_Address_Line4.dataBinding = XPathConstants.DATA_XPATH + "/Line[4]";
AddAddress_ContactDetails_Address_Line5.dataBinding = XPathConstants.DATA_XPATH + "/Line[5]";
AddAddress_ContactDetails_Address_Postcode.dataBinding = XPathConstants.DATA_XPATH + "/PostCode";
AddAddress_ContactDetails_Address_Reference.dataBinding = XPathConstants.DATA_XPATH + "/Reference";

/******************************* INPUT FIELDS **************************************/

function AddAddress_ContactDetails_Address_Line1() {}
AddAddress_ContactDetails_Address_Line1.componentName = "Address Line 1";
AddAddress_ContactDetails_Address_Line1.tabIndex = 1;
AddAddress_ContactDetails_Address_Line1.maxLength = 35;
AddAddress_ContactDetails_Address_Line1.helpText = "First line of address";
AddAddress_ContactDetails_Address_Line1.isMandatory = function() { return true; }
AddAddress_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Line2() {};
AddAddress_ContactDetails_Address_Line2.componentName = "Address Line 2";
AddAddress_ContactDetails_Address_Line2.tabIndex = 2;
AddAddress_ContactDetails_Address_Line2.maxLength = 35;
AddAddress_ContactDetails_Address_Line2.helpText = "Second line of address";
AddAddress_ContactDetails_Address_Line2.isMandatory = function() { return true; }
AddAddress_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Line3() {};
AddAddress_ContactDetails_Address_Line3.tabIndex = 3;
AddAddress_ContactDetails_Address_Line3.maxLength = 35;
AddAddress_ContactDetails_Address_Line3.helpText = "Third line of address";
AddAddress_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Line4() {};
AddAddress_ContactDetails_Address_Line4.tabIndex = 4;
AddAddress_ContactDetails_Address_Line4.maxLength = 35;
AddAddress_ContactDetails_Address_Line4.helpText = "Fourth line of address";
AddAddress_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Line5() {};
AddAddress_ContactDetails_Address_Line5.tabIndex = 5;
AddAddress_ContactDetails_Address_Line5.maxLength = 35;
AddAddress_ContactDetails_Address_Line5.helpText = "Fifth line of address";
AddAddress_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Postcode() {};
AddAddress_ContactDetails_Address_Postcode.tabIndex = 6;
AddAddress_ContactDetails_Address_Postcode.maxLength = 8;
AddAddress_ContactDetails_Address_Postcode.helpText = "Postcode";
AddAddress_ContactDetails_Address_Postcode.validate = function()
{
	var value = Services.getValue(AddAddress_ContactDetails_Address_Postcode.dataBinding);
	if( !CaseManValidationHelper.validatePostCode(value) ) 
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

AddAddress_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddAddress_ContactDetails_Address_Reference() {};
AddAddress_ContactDetails_Address_Reference.tabIndex = 7;
AddAddress_ContactDetails_Address_Reference.maxLength = 25;
AddAddress_ContactDetails_Address_Reference.helpText = "Employer reference";
AddAddress_ContactDetails_Address_Reference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddAddress_ContactDetails_Address_Reference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/****************************** BUTTON FIELDS **************************************/

function AddAddress_OkButton() {};
AddAddress_OkButton.tabIndex = 10;

/**********************************************************************************/

function AddAddress_CancelButton() {};
AddAddress_OkButton.tabIndex = 11;
