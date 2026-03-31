/** 
 * @fileoverview OtherPossnAddress_SubForm.js:
 * This file contains the configurations for the Other Possession Address Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, mandatory first two address lines altered so transform to 
 *				model strips leading and trailing space to prevent a blank value to be 
 *				entered which could break the application.
 */

/****************************** CONSTANTS ******************************************/

function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Address";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/Subforms/OtherPossnAddressSubform/Address";

/************************** FORM CONFIGURATIONS *************************************/

function otherPossnAddressSubform() {}

/**
 * @author rzxd7g
 * 
 */
otherPossnAddressSubform.initialise = function()
{
	var addressNode = Services.getNode(XPathConstants.FORM_DATA_XPATH);
	if ( null != addressNode )
	{
		Services.replaceNode(XPathConstants.DATA_XPATH, addressNode);
	}
}

otherPossnAddressSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "AddressDOM.xml",
	dataBinding: "/ds"
}

otherPossnAddressSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "AddressDOM.xml",
	dataBinding: "/ds"
}

otherPossnAddressSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "OtherPossessionAddress_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},
	
	returnSourceNodes: [XPathConstants.DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

otherPossnAddressSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "otherPossnAddressSubform" } ],
					singleClicks: [ {element: "OtherPossessionAddress_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

OtherPossessionAddress_ContactDetails_Address_Line1.dataBinding = XPathConstants.DATA_XPATH + "/Line[1]";
OtherPossessionAddress_ContactDetails_Address_Line2.dataBinding = XPathConstants.DATA_XPATH + "/Line[2]";
OtherPossessionAddress_ContactDetails_Address_Line3.dataBinding = XPathConstants.DATA_XPATH + "/Line[3]";
OtherPossessionAddress_ContactDetails_Address_Line4.dataBinding = XPathConstants.DATA_XPATH + "/Line[4]";
OtherPossessionAddress_ContactDetails_Address_Line5.dataBinding = XPathConstants.DATA_XPATH + "/Line[5]";
OtherPossessionAddress_ContactDetails_Address_Postcode.dataBinding = XPathConstants.DATA_XPATH + "/PostCode";
OtherPossessionAddress_CreatedBy.dataBinding = XPathConstants.DATA_XPATH + "/CreatedBy";

/******************************* INPUT FIELDS **************************************/

function OtherPossessionAddress_ContactDetails_Address_Line1() {}
OtherPossessionAddress_ContactDetails_Address_Line1.tabIndex = 1;
OtherPossessionAddress_ContactDetails_Address_Line1.maxLength = 35;
OtherPossessionAddress_ContactDetails_Address_Line1.helpText = "First line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Line1.componentName = "Other Possession Address Line 1";
OtherPossessionAddress_ContactDetails_Address_Line1.isMandatory = function() { return true; }
OtherPossessionAddress_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
OtherPossessionAddress_ContactDetails_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_ContactDetails_Address_Line2() {}
OtherPossessionAddress_ContactDetails_Address_Line2.tabIndex = 2;
OtherPossessionAddress_ContactDetails_Address_Line2.maxLength = 35;
OtherPossessionAddress_ContactDetails_Address_Line2.helpText = "Second line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Line2.componentName = "Other Possession Address Line 2";
OtherPossessionAddress_ContactDetails_Address_Line2.isMandatory = function() { return true; }
OtherPossessionAddress_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
OtherPossessionAddress_ContactDetails_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_ContactDetails_Address_Line3() {}
OtherPossessionAddress_ContactDetails_Address_Line3.tabIndex = 3;
OtherPossessionAddress_ContactDetails_Address_Line3.maxLength = 35;
OtherPossessionAddress_ContactDetails_Address_Line3.helpText = "Third line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Line3.componentName = "Other Possession Address Line 3";
OtherPossessionAddress_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
OtherPossessionAddress_ContactDetails_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_ContactDetails_Address_Line4() {}
OtherPossessionAddress_ContactDetails_Address_Line4.tabIndex = 4;
OtherPossessionAddress_ContactDetails_Address_Line4.maxLength = 35;
OtherPossessionAddress_ContactDetails_Address_Line4.helpText = "Fourth line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Line4.componentName = "Other Possession Address Line 4";
OtherPossessionAddress_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
OtherPossessionAddress_ContactDetails_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_ContactDetails_Address_Line5() {}
OtherPossessionAddress_ContactDetails_Address_Line5.tabIndex = 5;
OtherPossessionAddress_ContactDetails_Address_Line5.maxLength = 35;
OtherPossessionAddress_ContactDetails_Address_Line5.helpText = "Fifth line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Line5.componentName = "Other Possession Address Line 5";
OtherPossessionAddress_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
OtherPossessionAddress_ContactDetails_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_ContactDetails_Address_Postcode() {}
OtherPossessionAddress_ContactDetails_Address_Postcode.tabIndex = 6;
OtherPossessionAddress_ContactDetails_Address_Postcode.maxLength = 8;
OtherPossessionAddress_ContactDetails_Address_Postcode.helpText = "Postcode line of Possession Address";
OtherPossessionAddress_ContactDetails_Address_Postcode.componentName = "Other Possession Address Postcode";
OtherPossessionAddress_ContactDetails_Address_Postcode.validate = function()
{
	var value = Services.getValue(OtherPossessionAddress_ContactDetails_Address_Postcode.dataBinding);
	
	if(!CaseManValidationHelper.validatePostCode(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

OtherPossessionAddress_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

OtherPossessionAddress_ContactDetails_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function OtherPossessionAddress_CreatedBy() {}
OtherPossessionAddress_CreatedBy.tabIndex = -1;
OtherPossessionAddress_CreatedBy.maxLength = 30;
OtherPossessionAddress_CreatedBy.helpText = "The user name of the creator of the possession address";
OtherPossessionAddress_CreatedBy.isReadOnly = function() { return true; }
OtherPossessionAddress_CreatedBy.isTemporary = function() { return true; }

/****************************** BUTTON FIELDS **************************************/

function OtherPossessionAddress_OkButton() {}
OtherPossessionAddress_OkButton.tabIndex = 10;

/**********************************************************************************/

function OtherPossessionAddress_CancelButton() {}
OtherPossessionAddress_CancelButton.tabIndex = 11;
