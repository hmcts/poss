/** 
 * @fileoverview OtherPossnAddress_SubForm.js:
 * This file contains the configurations for the Other Possession Address Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, text fields updated so transform to model strips leading and trailing
 *				space to prevent a blank value to be entered which could break the application.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Payee";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/Subforms/judgmentPayeeSubform/Payee";

/************************** FORM CONFIGURATIONS *************************************/

function judgmentPayeeSubform() {}

/**
 * @author rzxd7g
 * 
 */
judgmentPayeeSubform.initialise = function()
{
	// Set the default tabbed page
	Services.setValue(myTabSelector.dataBinding, "Payee_Details_Page");

	// Copy the data passed from the main form to the subform data node
	var payeeNode = Services.getNode(XPathConstants.FORM_DATA_XPATH);
	Services.replaceNode(XPathConstants.DATA_XPATH, payeeNode);
}

judgmentPayeeSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "PayeeDOM.xml",
	dataBinding: "/ds"
}

judgmentPayeeSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "PayeeDOM.xml",
	dataBinding: "/ds"
}

judgmentPayeeSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "PayeeDetails_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},
	
	returnSourceNodes: [XPathConstants.DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

judgmentPayeeSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "judgmentPayeeSubform" } ],
					singleClicks: [ {element: "PayeeDetails_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

PayeeDetails_Name.dataBinding = XPathConstants.DATA_XPATH + "/Name";
PayeeDetails_ContactDetails_Address_Line1.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/Line[1]";
PayeeDetails_ContactDetails_Address_Line2.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/Line[2]";
PayeeDetails_ContactDetails_Address_Line3.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/Line[3]";
PayeeDetails_ContactDetails_Address_Line4.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/Line[4]";
PayeeDetails_ContactDetails_Address_Line5.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/Line[5]";
PayeeDetails_ContactDetails_Address_PostCode.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/Address/PostCode";
PayeeDetails_ContactDetails_DXNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/DX";
PayeeDetails_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/TelephoneNumber";
PayeeDetails_ContactDetails_FaxNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/FaxNumber";
PayeeDetails_ContactDetails_Email.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/EmailAddress";
PayeeDetails_Reference.dataBinding = XPathConstants.DATA_XPATH + "/Reference";

PayeeDetails_BankName.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/BankName";
PayeeDetails_AccNumber.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/AccountNumber";
PayeeDetails_SortCode.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/SortCode";
PayeeDetails_AccountHolder.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/AccountHolder";
PayeeDetails_SlipCodeLine1.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/SlipCode/Line[1]";
PayeeDetails_SlipCodeLine2.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/SlipCode/Line[2]";
PayeeDetails_BankInformation1.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/BankInformation/Line[1]";
PayeeDetails_BankInformation2.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/BankInformation/Line[2]";
PayeeDetails_GiroAccountNumber.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/GiroAccountNumber";
PayeeDetails_GiroTransactionCode1.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/GiroTransaction/Code[1]";
PayeeDetails_GiroTransactionCode2.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/GiroTransaction/Code[2]";
PayeeDetails_APACSTransactionCode.dataBinding = XPathConstants.DATA_XPATH + "/BankDetails/APACSTransactionCode";

/******************************* INPUT FIELDS **************************************/

function PayeeDetails_Name() {}
PayeeDetails_Name.tabIndex = 2;
PayeeDetails_Name.maxLength = 70;
PayeeDetails_Name.componentName = "Payee Name";
PayeeDetails_Name.helpText = "Name of the payee";
PayeeDetails_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line1() {}
PayeeDetails_ContactDetails_Address_Line1.tabIndex = 3;
PayeeDetails_ContactDetails_Address_Line1.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line1.componentName = "Payee Address Line 1";
PayeeDetails_ContactDetails_Address_Line1.helpText = "First line of Payee's address";
PayeeDetails_ContactDetails_Address_Line1.isMandatory = function() { return true; }
PayeeDetails_ContactDetails_Address_Line1.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line1.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line2() {}
PayeeDetails_ContactDetails_Address_Line2.tabIndex = 4;
PayeeDetails_ContactDetails_Address_Line2.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line2.componentName = "Payee Address Line 2";
PayeeDetails_ContactDetails_Address_Line2.helpText = "Second line of Payee's address";
PayeeDetails_ContactDetails_Address_Line2.isMandatory = function() { return true; }
PayeeDetails_ContactDetails_Address_Line2.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line2.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line3() {}
PayeeDetails_ContactDetails_Address_Line3.tabIndex = 5;
PayeeDetails_ContactDetails_Address_Line3.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line3.componentName = "Payee Address Line 3";
PayeeDetails_ContactDetails_Address_Line3.helpText = "Third line of Payee's address";

PayeeDetails_ContactDetails_Address_Line3.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line3.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line4() {}
PayeeDetails_ContactDetails_Address_Line4.tabIndex = 6;
PayeeDetails_ContactDetails_Address_Line4.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line4.componentName = "Payee Address Line 4";
PayeeDetails_ContactDetails_Address_Line4.helpText = "Fourth line of Payee's address";

PayeeDetails_ContactDetails_Address_Line4.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line4.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line5() {}
PayeeDetails_ContactDetails_Address_Line5.tabIndex = 7;
PayeeDetails_ContactDetails_Address_Line5.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line5.componentName = "Payee Address Line 5";
PayeeDetails_ContactDetails_Address_Line5.helpText = "Fifth line of Payee's address";

PayeeDetails_ContactDetails_Address_Line5.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line5.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Address_PostCode() {}
PayeeDetails_ContactDetails_Address_PostCode.tabIndex = 8;
PayeeDetails_ContactDetails_Address_PostCode.maxLength = 8;
PayeeDetails_ContactDetails_Address_PostCode.componentName = "Payee Postcode";
PayeeDetails_ContactDetails_Address_PostCode.helpText = "Postcode of the payee";

PayeeDetails_ContactDetails_Address_PostCode.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_PostCode.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_Address_PostCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_Address_PostCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_ContactDetails_Address_PostCode.validate = function()
{
	var value = Services.getValue(PayeeDetails_ContactDetails_Address_PostCode.dataBinding);
	
	if( !CaseManValidationHelper.validatePostCode(value) )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_DXNumber() {}
PayeeDetails_ContactDetails_DXNumber.tabIndex = 9;
PayeeDetails_ContactDetails_DXNumber.maxLength = 35;
PayeeDetails_ContactDetails_DXNumber.componentName = "Payee DX Number";
PayeeDetails_ContactDetails_DXNumber.helpText = "DX number of the payee";

PayeeDetails_ContactDetails_DXNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_DXNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_DXNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_DXNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_TelephoneNumber() {}
PayeeDetails_ContactDetails_TelephoneNumber.tabIndex = 10;
PayeeDetails_ContactDetails_TelephoneNumber.maxLength = 24;
PayeeDetails_ContactDetails_TelephoneNumber.componentName = "Payee Telephone Number";
PayeeDetails_ContactDetails_TelephoneNumber.helpText = "Telephone number of the payee";

PayeeDetails_ContactDetails_TelephoneNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_TelephoneNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_TelephoneNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_TelephoneNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_FaxNumber() {}
PayeeDetails_ContactDetails_FaxNumber.tabIndex = 11;
PayeeDetails_ContactDetails_FaxNumber.maxLength = 24;
PayeeDetails_ContactDetails_FaxNumber.componentName = "Payee Fax Number";
PayeeDetails_ContactDetails_FaxNumber.helpText = "Fax number of the payee";

PayeeDetails_ContactDetails_FaxNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_FaxNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_ContactDetails_FaxNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
} 
PayeeDetails_ContactDetails_FaxNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_ContactDetails_Email() {}
PayeeDetails_ContactDetails_Email.maxLength = 80;
PayeeDetails_ContactDetails_Email.tabIndex = 12;
PayeeDetails_ContactDetails_Email.helpText = "Email address of the payee";
PayeeDetails_ContactDetails_Email.componentName = "Payee Email Address";
PayeeDetails_ContactDetails_Email.validate = function()
{
	var emailAddress = Services.getValue(PayeeDetails_ContactDetails_Email.dataBinding);
	return CaseManValidationHelper.validatePattern(emailAddress, CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

PayeeDetails_ContactDetails_Email.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Email.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/**********************************************************************************/

function PayeeDetails_Reference() {}
PayeeDetails_Reference.tabIndex = 13;
PayeeDetails_Reference.maxLength = 24;
PayeeDetails_Reference.componentName = "Payee Reference";
PayeeDetails_Reference.helpText = "Payee reference";

PayeeDetails_Reference.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_Reference.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

PayeeDetails_Reference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_Reference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_BankName() {}
PayeeDetails_BankName.tabIndex = 20;
PayeeDetails_BankName.maxLength = 30;
PayeeDetails_BankName.componentName = "Bank Name";
PayeeDetails_BankName.helpText = "Bank Name";
PayeeDetails_BankName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_BankName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_AccNumber() {}
PayeeDetails_AccNumber.tabIndex = 21;
PayeeDetails_AccNumber.maxLength = 18;
PayeeDetails_AccNumber.componentName = "Account Number";
PayeeDetails_AccNumber.helpText = "Account Number";

/**********************************************************************************/

function PayeeDetails_SortCode() {}
PayeeDetails_SortCode.tabIndex = 22;
PayeeDetails_SortCode.maxLength = 8;
PayeeDetails_SortCode.componentName = "Sort Code";
PayeeDetails_SortCode.helpText = "Sort Code";
PayeeDetails_SortCode.validate = function()
{
	var sortCode = Services.getValue(PayeeDetails_SortCode.dataBinding);
	if( !CaseManValidationHelper.validateSortCode(sortCode) )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidSortCode_Msg");
	}
	return null;
}

/**********************************************************************************/

function PayeeDetails_AccountHolder() {}
PayeeDetails_AccountHolder.tabIndex = 23;
PayeeDetails_AccountHolder.maxLength = 70;
PayeeDetails_AccountHolder.componentName = "Account Holder";
PayeeDetails_AccountHolder.helpText = "Account Holder";
PayeeDetails_AccountHolder.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_AccountHolder.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_SlipCodeLine1() {}
PayeeDetails_SlipCodeLine1.tabIndex = 24;
PayeeDetails_SlipCodeLine1.maxLength = 58;
PayeeDetails_SlipCodeLine1.componentName = "Slip Code Line 1";
PayeeDetails_SlipCodeLine1.helpText = "Slip Code Line 1";

/**********************************************************************************/

function PayeeDetails_SlipCodeLine2() {}
PayeeDetails_SlipCodeLine2.tabIndex = 25;
PayeeDetails_SlipCodeLine2.maxLength = 100;
PayeeDetails_SlipCodeLine2.componentName = "Slip Code Line 2";
PayeeDetails_SlipCodeLine2.helpText = "Slip Code Line 2";

/**********************************************************************************/

function PayeeDetails_BankInformation1() {}
PayeeDetails_BankInformation1.tabIndex = 26;
PayeeDetails_BankInformation1.maxLength = 30;
PayeeDetails_BankInformation1.componentName = "Bank Information Line 1";
PayeeDetails_BankInformation1.helpText = "Bank Information Line 1";
PayeeDetails_BankInformation1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_BankInformation1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_BankInformation2() {}
PayeeDetails_BankInformation2.tabIndex = 27;
PayeeDetails_BankInformation2.maxLength = 30;
PayeeDetails_BankInformation2.componentName = "Bank Information Line 2";
PayeeDetails_BankInformation2.helpText = "Bank Information Line 2";
PayeeDetails_BankInformation2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_BankInformation2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_GiroAccountNumber() {}
PayeeDetails_GiroAccountNumber.tabIndex = 28;
PayeeDetails_GiroAccountNumber.maxLength = 8;
PayeeDetails_GiroAccountNumber.componentName = "GIRO Account Number";
PayeeDetails_GiroAccountNumber.helpText = "GIRO Account Number";
PayeeDetails_GiroAccountNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PayeeDetails_GiroAccountNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

function PayeeDetails_GiroTransactionCode1() {}
PayeeDetails_GiroTransactionCode1.tabIndex = 29;
PayeeDetails_GiroTransactionCode1.maxLength = 9;
PayeeDetails_GiroTransactionCode1.componentName = "GIRO Transaction Code 1";
PayeeDetails_GiroTransactionCode1.helpText = "First GIRO Transaction Code";

/**********************************************************************************/

function PayeeDetails_GiroTransactionCode2() {}
PayeeDetails_GiroTransactionCode2.tabIndex = 30;
PayeeDetails_GiroTransactionCode2.maxLength = 2;
PayeeDetails_GiroTransactionCode2.componentName = "GIRO Transaction Code 2";
PayeeDetails_GiroTransactionCode2.helpText = "Second GIRO Transaction Code";

/**********************************************************************************/

function PayeeDetails_APACSTransactionCode() {}
PayeeDetails_APACSTransactionCode.tabIndex = 31;
PayeeDetails_APACSTransactionCode.maxLength = 2;
PayeeDetails_APACSTransactionCode.componentName = "APACS Transaction Code";
PayeeDetails_APACSTransactionCode.helpText = "APACS Transaction Code";

/****************************** BUTTON FIELDS **************************************/

function PayeeDetails_OkButton() {}
PayeeDetails_OkButton.tabIndex = 40;

/**********************************************************************************/

function PayeeDetails_CancelButton() {}
PayeeDetails_CancelButton.tabIndex = 41;

/***************************** TABBED PANELS **************************************/

function myTabSelector() {}; // Instantiate the tabbed area
myTabSelector.tabIndex = 1;
myTabSelector.dataBinding = "/ds/var/page/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

/****************************** TABBED PAGES **************************************/

function Payee_Details_Page() {};

Payee_Details_Page.logicOn = [PayeeDetails_Name.dataBinding];
Payee_Details_Page.logic = function(event)
{
	if ( event.getXPath() != PayeeDetails_Name.dataBinding )
	{
		return;
	}
	
	var payeeName = Services.getValue(PayeeDetails_Name.dataBinding);
	if ( CaseManUtils.isBlank(payeeName) )
	{
		// If the Payee Name is cleared, clear all Payee details as well
		Services.startTransaction();
		Services.setValue(PayeeDetails_ContactDetails_Address_Line1.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Address_Line2.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Address_Line3.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Address_Line4.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Address_Line5.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Address_PostCode.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_DXNumber.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_TelephoneNumber.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_FaxNumber.dataBinding, "");
		Services.setValue(PayeeDetails_ContactDetails_Email.dataBinding, "");
		Services.setValue(PayeeDetails_Reference.dataBinding, "");
		Services.setValue(PayeeDetails_BankName.dataBinding, "");
		Services.setValue(PayeeDetails_AccNumber.dataBinding, "");
		Services.setValue(PayeeDetails_SortCode.dataBinding, "");
		Services.setValue(PayeeDetails_AccountHolder.dataBinding, "");
		Services.setValue(PayeeDetails_SlipCodeLine1.dataBinding, "");
		Services.setValue(PayeeDetails_SlipCodeLine2.dataBinding, "");
		Services.setValue(PayeeDetails_BankInformation1.dataBinding, "");
		Services.setValue(PayeeDetails_BankInformation2.dataBinding, "");
		Services.setValue(PayeeDetails_GiroAccountNumber.dataBinding, "");
		Services.setValue(PayeeDetails_GiroTransactionCode1.dataBinding, "");
		Services.setValue(PayeeDetails_GiroTransactionCode2.dataBinding, "");
		Services.setValue(PayeeDetails_APACSTransactionCode.dataBinding, "");
		Services.endTransaction();
	}
}

/**********************************************************************************/

function Payee_BankDetails_Page() {};

Payee_BankDetails_Page.enableOn = [PayeeDetails_Name.dataBinding,PayeeDetails_ContactDetails_Address_Line1.dataBinding,PayeeDetails_ContactDetails_Address_Line2.dataBinding];
Payee_BankDetails_Page.isEnabled = function()
{
	// Disable the Payee Bank Details tab if the mandatory main payee details fields are blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	var adline1 = Services.getValue(PayeeDetails_ContactDetails_Address_Line1.dataBinding);
	var adline2 = Services.getValue(PayeeDetails_ContactDetails_Address_Line2.dataBinding);

	if ( CaseManUtils.isBlank(partyName) || CaseManUtils.isBlank(adline1) || CaseManUtils.isBlank(adline2) )
	{
		return false;
	}
	return true;
}
