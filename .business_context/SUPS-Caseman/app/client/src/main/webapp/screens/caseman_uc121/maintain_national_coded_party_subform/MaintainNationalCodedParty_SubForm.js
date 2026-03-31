/** 
 * @fileoverview MaintainNationalCodedParty_SubForm.js:
 * This file contains the configurations for the Maintain National Coded Party Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, text fields updated so transform to model strips leading and trailing
 *				space to prevent a blank value to be entered which could break the application.
 * 30/08/2006 - Chris Vincent, updated MaintainCodedParty_Code.logic() to reference the validate()
 * 				function rather than getValid().  Defect 4868.
 * 18/09/2006 - Chris Vincent, added the Default Claimant tabbed page to the Add Coded Party popup.
 * 				New CCBC requirement. 
 * 05/01/2007 - Chris Vincent, further changes for the Default Claimant functionality in the Save button.
 * 				Temp2 defect 3557.
 * 17/01/2007 - Chris Vincent, updated MaintainNationalCodedPartySubform_SaveButton.actionBinding() to set
 * 				a number of CCBC sequences for Group2 Defect 4387.
 * 12/09/2007 - Chris Vincent, updated CCBCDetails_WarrantRange_ToNumber.validate() to include more detailed
 * 				warrant number validation.  UCT_Group2 Defect 1537.
 * 28/11/2007 - Chris Vincent, amendment to CCBCDetails_WarrantRange_ToNumber.validate() as validation was failing
 * 				when should have passed when the last 5 digits on the range to were less than range from but the 
 * 				second character of range to was greater than range from.  ProgTesting Defect 1308. 
 */

/************************** FORM CONFIGURATIONS *************************************/

function maintainNationalCodedPartySubform() {}

maintainNationalCodedPartySubform.initialise = function()
{
	// Set the default tabbed page
	Services.setValue(myTabSelector.dataBinding, "CodedParty_Details_Page");
}

maintainNationalCodedPartySubform.refDataServices = [
	{ name:"PaperTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPaperTypeList", serviceParams:[] }
];

maintainNationalCodedPartySubform.startupState = 
{
	mode: function() {
		var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
		return ( mode == FormStates.MODE_CREATE ) ? "create" : "modify";
	}
}

maintainNationalCodedPartySubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "NationalCodedPartyDOM.xml",
	dataBinding: "/ds"
}

maintainNationalCodedPartySubform.loadExisting = 
{
	name: "formLoadExisting",
	serviceName: "getNatCodedParty",
	serviceParams: [ { name: "codedPartyCode", value: XPathConstants.SUBFORM_CODE_XPATH }, { name: "courtCode", value: XPathConstants.SUBFORM_COURTCODE_XPATH } ],
	dataBinding: "/ds"
}

maintainNationalCodedPartySubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "NationalCodedPartyDOM.xml",
	dataBinding: "/ds"
}

maintainNationalCodedPartySubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	name: "formLoadExisting",
	serviceName: "getNatCodedParty",
	serviceParams: [ { name: "codedPartyCode", value: XPathConstants.SUBFORM_CODE_XPATH }, { name: "courtCode", value: XPathConstants.SUBFORM_COURTCODE_XPATH } ],
	dataBinding: "/ds"
}

maintainNationalCodedPartySubform.submitLifeCycle = 
{
	create: {
		name:  "addNatCodedParty",
        params: [ { name: "natCodedParty", node: XPathConstants.SUBFORM_DATA_XPATH } ],
        errorHandler: {
        	onAuthorizationException: function(e) { alert(Messages.AUTHORIZATION_FAILED_MESSAGE); }
        }
	},
	
	modify: {
		name:  "updateNatCodedParty",
        params: [ { name: "natCodedParty", node: XPathConstants.SUBFORM_DATA_XPATH } ],
        errorHandler: {
        	onAuthorizationException: function(e) { alert(Messages.AUTHORIZATION_FAILED_MESSAGE); }
        }
	},
	
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

maintainNationalCodedPartySubform.cancelLifeCycle = {
	eventBinding: {	keys: [ { key: Key.F4, element: "maintainNationalCodedPartySubform" } ],
					singleClicks: [ { element: "MaintainNationalCodedPartySubform_CancelButton" } ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/**************************** TABBED PANELS ***************************************/

function myTabSelector() {};
myTabSelector.tabIndex = 1;
myTabSelector.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

/****************************** DATA BINDINGS **************************************/

MaintainCodedParty_Code.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Code";
MaintainCodedParty_Name.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Name";
MaintainCodedParty_AddressLine1.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/Line[1]";
MaintainCodedParty_AddressLine2.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/Line[2]";
MaintainCodedParty_AddressLine3.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/Line[3]";
MaintainCodedParty_AddressLine4.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/Line[4]";
MaintainCodedParty_AddressLine5.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/Line[5]";	
MaintainCodedParty_PostCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/PostCode";
MaintainCodedParty_DXNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/DX";
MaintainCodedParty_Telephone.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/TelephoneNumber";
MaintainCodedParty_FaxNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/FaxNumber";
MaintainCodedParty_Email.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/EmailAddress";

PayeeDetails_Name.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/Name";
PayeeDetails_ContactDetails_Address_Line1.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/Line[1]";
PayeeDetails_ContactDetails_Address_Line2.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/Line[2]";
PayeeDetails_ContactDetails_Address_Line3.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/Line[3]";
PayeeDetails_ContactDetails_Address_Line4.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/Line[4]";
PayeeDetails_ContactDetails_Address_Line5.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/Line[5]";
PayeeDetails_ContactDetails_Address_PostCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/PostCode";
PayeeDetails_ContactDetails_DXNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/DX";
PayeeDetails_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/TelephoneNumber";
PayeeDetails_ContactDetails_FaxNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/FaxNumber";
PayeeDetails_ContactDetails_Email.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/EmailAddress";
PayeeDetails_Reference.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/Reference";

PayeeDetails_BankName.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/BankName";
PayeeDetails_AccNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/AccountNumber";
PayeeDetails_SortCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/SortCode";
PayeeDetails_AccountHolder.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/AccountHolder";
PayeeDetails_BankInformation1.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/BankInformation/Line[1]";
PayeeDetails_BankInformation2.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/BankInformation/Line[2]";
PayeeDetails_GiroAccountNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/GiroAccountNumber";
PayeeDetails_GiroTransactionCode1.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/GiroTransaction/Code[1]";
PayeeDetails_GiroTransactionCode2.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/GiroTransaction/Code[2]";
PayeeDetails_APACSTransactionCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Payee/BankDetails/APACSTransactionCode";

CCBCDetails_WarrantRange_FromNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/WarrantRange/From";
CCBCDetails_WarrantRange_ToNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/WarrantRange/To";
CCBCDetails_PrintJudgment.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/PrintJudgment";
CCBCDetails_Duplex.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/Duplex";
CCBCDetails_PaperTypes_N30Default.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/PaperTypes/N30Default";
CCBCDetails_PaperTypes_N30Admission.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/PaperTypes/N30Admission";

DefaultClaimant_Name.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/Name";
DefaultClaimant_ContactDetails_Address_Line1.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/Line[1]";
DefaultClaimant_ContactDetails_Address_Line2.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/Line[2]";
DefaultClaimant_ContactDetails_Address_Line3.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/Line[3]";
DefaultClaimant_ContactDetails_Address_Line4.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/Line[4]";
DefaultClaimant_ContactDetails_Address_Line5.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/Line[5]";
DefaultClaimant_ContactDetails_Address_PostCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/PostCode";
DefaultClaimant_ContactDetails_DXNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/DX";
DefaultClaimant_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/TelephoneNumber";
DefaultClaimant_ContactDetails_FaxNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/FaxNumber";
DefaultClaimant_ContactDetails_Email.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/EmailAddress";

/**************************** TABBED PAGES ****************************************/

function CodedParty_Details_Page() {};

/**********************************************************************************/

function Payee_Details_Page() {};

Payee_Details_Page.enableOn = [MaintainCodedParty_Code.dataBinding, MaintainCodedParty_Name.dataBinding, MaintainCodedParty_AddressLine1.dataBinding, MaintainCodedParty_AddressLine2.dataBinding];
Payee_Details_Page.isEnabled = function()
{
	// Payee Details are not available for Non CPC National Coded Parties
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	if ( isNonCPCCodedParty(code) )
	{
		return false;
	}

	// Disable the Payee Details tab if the mandatory main party details fields are blank
	var partyName = Services.getValue(MaintainCodedParty_Name.dataBinding);
	var adline1 = Services.getValue(MaintainCodedParty_AddressLine1.dataBinding);
	var adline2 = Services.getValue(MaintainCodedParty_AddressLine2.dataBinding);

	if ( CaseManUtils.isBlank(partyName) || CaseManUtils.isBlank(adline1) || CaseManUtils.isBlank(adline2) )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

function Payee_BankDetails_Page() {};

Payee_BankDetails_Page.enableOn = [MaintainCodedParty_Code.dataBinding, PayeeDetails_Name.dataBinding, PayeeDetails_ContactDetails_Address_Line1.dataBinding, PayeeDetails_ContactDetails_Address_Line2.dataBinding];
Payee_BankDetails_Page.isEnabled = function()
{
	// Payee Details are not available for Non CPC National Coded Parties
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	if ( isNonCPCCodedParty(code) )
	{
		return false;
	}

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

/**********************************************************************************/

function CCBCDetails_Page() {};

CCBCDetails_Page.enableOn = [MaintainCodedParty_Code.dataBinding, MaintainCodedParty_Name.dataBinding, MaintainCodedParty_AddressLine1.dataBinding, MaintainCodedParty_AddressLine2.dataBinding];
CCBCDetails_Page.isEnabled = function()
{
	// CCBC Details are not available for Non CPC National Coded Parties
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	if ( isNonCPCCodedParty(code) )
	{
		return false;
	}

	// Disable the CCBC Details tab if the mandatory main party details fields are blank
	var partyName = Services.getValue(MaintainCodedParty_Name.dataBinding);
	var adline1 = Services.getValue(MaintainCodedParty_AddressLine1.dataBinding);
	var adline2 = Services.getValue(MaintainCodedParty_AddressLine2.dataBinding);

	if ( CaseManUtils.isBlank(partyName) || CaseManUtils.isBlank(adline1) || CaseManUtils.isBlank(adline2) )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

function Default_Claimant_Page() {};

Default_Claimant_Page.enableOn = [MaintainCodedParty_Code.dataBinding, MaintainCodedParty_Name.dataBinding, MaintainCodedParty_AddressLine1.dataBinding, MaintainCodedParty_AddressLine2.dataBinding];
Default_Claimant_Page.isEnabled = function()
{
	// Default Claimant Details are not available for Non CPC National Coded Parties
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	if ( isNonCPCCodedParty(code) )
	{
		return false;
	}

	// Disable the Default Claimant Details tab if the mandatory main party details fields are blank
	var partyName = Services.getValue(MaintainCodedParty_Name.dataBinding);
	var adline1 = Services.getValue(MaintainCodedParty_AddressLine1.dataBinding);
	var adline2 = Services.getValue(MaintainCodedParty_AddressLine2.dataBinding);

	if ( CaseManUtils.isBlank(partyName) || CaseManUtils.isBlank(adline1) || CaseManUtils.isBlank(adline2) )
	{
		return false;
	}
	return true;
}

/******************************* INPUT FIELDS **************************************/

function MaintainCodedParty_Code() {}
MaintainCodedParty_Code.maxLength = 4;
MaintainCodedParty_Code.tabIndex = 10;
MaintainCodedParty_Code.componentName = "Code";
MaintainCodedParty_Code.helpText = "Unique four digit code identifier for Party";
MaintainCodedParty_Code.isMandatory = function() { return true; }

MaintainCodedParty_Code.readOnlyOn = [XPathConstants.SUBFORM_MODE_XPATH];
MaintainCodedParty_Code.isReadOnly = function()
{
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	return (mode == FormStates.MODE_MODIFY) ? true : false;
}

MaintainCodedParty_Code.validateOn = [XPathConstants.CODE_EXISTS_XPATH];
MaintainCodedParty_Code.validate = function()
{
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
    if( !CaseManUtils.isBlank(code) )
	{
   		if( CaseManValidationHelper.validateNumber(code) == false )
    	{
    		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
    	}
    	if( !isNationalCodedParty(code) && !isNonCPCCodedParty(code) )
		{
			// Code is not in the National or Non CPC National Coded Party ranges
			return ErrorCode.getErrorCode("CaseMan_invalidNationalCodedPartyCode_Msg");
		}
		if( mode == FormStates.MODE_CREATE )
		{
	      	if( Services.getValue(XPathConstants.CODE_EXISTS_XPATH) == "true" )
	      	{
				return ErrorCode.getErrorCode("CaseMan_invalidInsertCodeAlreadyExists_Msg");
	      	}
		}
	} 
 	return null;	
}

MaintainCodedParty_Code.logicOn = [MaintainCodedParty_Code.dataBinding];
MaintainCodedParty_Code.logic = function(event)
{
	if ( event.getXPath() != MaintainCodedParty_Code.dataBinding )
	{
		return;
	}

	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	if ( !CaseManUtils.isBlank(code) && ( null == MaintainCodedParty_Code.validate() || Services.getValue(XPathConstants.CODE_EXISTS_XPATH) == "true" ) )
	{
		Services.startTransaction();
		if ( isNonCPCCodedParty(code) )
		{
			// Clear any irrelevant Non CPC National Coded Party fields
			Services.setValue(PayeeDetails_Name.dataBinding, "");
			Services.setValue(CCBCDetails_WarrantRange_FromNumber.dataBinding, "");
			Services.setValue(CCBCDetails_WarrantRange_ToNumber.dataBinding, "");
			Services.setValue(CCBCDetails_PrintJudgment.dataBinding, "");
			Services.setValue(CCBCDetails_Duplex.dataBinding, "");
			Services.setValue(CCBCDetails_PaperTypes_N30Default.dataBinding, null);
			Services.setValue(CCBCDetails_PaperTypes_N30Admission.dataBinding, null);
		}
		else
		{
			// Set any default National Coded Party fields
			Services.setValue(CCBCDetails_PrintJudgment.dataBinding, "N");
			Services.setValue(CCBCDetails_Duplex.dataBinding, "N");
			Services.setValue(CCBCDetails_PaperTypes_N30Default.dataBinding, null);
			Services.setValue(CCBCDetails_PaperTypes_N30Admission.dataBinding, null);
		}
		Services.endTransaction();
		
		// Call the service to determine if the National Coded Party code entered already exists
		var params = new ServiceParams();
		params.addSimpleParameter("codedPartyCode", code);
		Services.callService("getNatCodedPartyShort", params, MaintainCodedParty_Code, false);	
	}
	else if ( CaseManUtils.isBlank(code) )
	{
		// No code entered
		Services.setValue(XPathConstants.CODE_EXISTS_XPATH, "");
	}
}

MaintainCodedParty_Code.onSuccess = function(dom)
{
	var result = dom.selectSingleNode("/CodedParty/Code");
   	if( null != result )
   	{
    	Services.setValue(XPathConstants.CODE_EXISTS_XPATH, "true");
    	Services.setFocus("MaintainCodedParty_Code");
 	}
 	else
 	{
    	Services.setValue(XPathConstants.CODE_EXISTS_XPATH, "false");
    	Services.setFocus("MaintainCodedParty_Name");
 	}
}

/*********************************************************************************/

function MaintainCodedParty_Name() {}
MaintainCodedParty_Name.maxLength = 70;
MaintainCodedParty_Name.tabIndex = 11;
MaintainCodedParty_Name.componentName = "Name";
MaintainCodedParty_Name.helpText = "Name of Party/name of solicitor/litigation dept etc";
MaintainCodedParty_Name.isMandatory = function() { return true; }
MaintainCodedParty_Name.transformToDisplay = toUpper;
MaintainCodedParty_Name.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_AddressLine1() {}
MaintainCodedParty_AddressLine1.maxLength = 35;
MaintainCodedParty_AddressLine1.tabIndex = 12;
MaintainCodedParty_AddressLine1.componentName = "Address Line1";
MaintainCodedParty_AddressLine1.isMandatory = function() { return true; }
MaintainCodedParty_AddressLine1.helpText = "First line of Party's address";
MaintainCodedParty_AddressLine1.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine1.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_AddressLine2() {}
MaintainCodedParty_AddressLine2.maxLength = 35;
MaintainCodedParty_AddressLine2.tabIndex = 13;
MaintainCodedParty_AddressLine2.componentName = "Address Line2";
MaintainCodedParty_AddressLine2.helpText = "Second line of Party's address";
MaintainCodedParty_AddressLine2.isMandatory = function() { return true; }
MaintainCodedParty_AddressLine2.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine2.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_AddressLine3() {}
MaintainCodedParty_AddressLine3.maxLength = 35;
MaintainCodedParty_AddressLine3.tabIndex = 14;
MaintainCodedParty_AddressLine3.componentName = "Address Line3";
MaintainCodedParty_AddressLine3.helpText = "Third line of Party's address";
MaintainCodedParty_AddressLine3.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine3.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_AddressLine4() {}
MaintainCodedParty_AddressLine4.maxLength = 35;
MaintainCodedParty_AddressLine4.tabIndex = 15;
MaintainCodedParty_AddressLine4.helpText = "Fourth line of Party's address";
MaintainCodedParty_AddressLine4.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine4.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_AddressLine5() {}
MaintainCodedParty_AddressLine5.maxLength = 35;
MaintainCodedParty_AddressLine5.tabIndex = 16;
MaintainCodedParty_AddressLine5.helpText = "Fifth line of Party's address";
MaintainCodedParty_AddressLine5.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine5.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_PostCode() {}
MaintainCodedParty_PostCode.maxLength = 8;
MaintainCodedParty_PostCode.componentName = "Postcode";
MaintainCodedParty_PostCode.tabIndex = 17;
MaintainCodedParty_PostCode.helpText = "Party's postcode";
MaintainCodedParty_PostCode.transformToDisplay = toUpper;
MaintainCodedParty_PostCode.transformToModel = toUpper;
MaintainCodedParty_PostCode.validate = function()
{
	var postcode = Services.getValue(MaintainCodedParty_PostCode.dataBinding);
	if( !CaseManValidationHelper.validatePostCode(postcode) ) 
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/*********************************************************************************/

function MaintainCodedParty_DXNumber() {}
MaintainCodedParty_DXNumber.maxLength = 35;
MaintainCodedParty_DXNumber.tabIndex = 18;
MaintainCodedParty_DXNumber.helpText = "DX Number of party";
MaintainCodedParty_DXNumber.transformToDisplay = toUpper;
MaintainCodedParty_DXNumber.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_Telephone() {}
MaintainCodedParty_Telephone.maxLength = 24;
MaintainCodedParty_Telephone.tabIndex = 19;
MaintainCodedParty_Telephone.helpText = "Telephone number of party";
MaintainCodedParty_Telephone.transformToDisplay = toUpper;
MaintainCodedParty_Telephone.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_FaxNumber() {}
MaintainCodedParty_FaxNumber.maxLength = 24;
MaintainCodedParty_FaxNumber.tabIndex = 20;
MaintainCodedParty_FaxNumber.helpText = "Fax number of Party";
MaintainCodedParty_FaxNumber.transformToDisplay = toUpper;
MaintainCodedParty_FaxNumber.transformToModel = toUpperStripped;

/*********************************************************************************/

function MaintainCodedParty_Email() {}
MaintainCodedParty_Email.maxLength = 80;
MaintainCodedParty_Email.tabIndex = 21;
MaintainCodedParty_Email.helpText = "Email address of Party";
MaintainCodedParty_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(MaintainCodedParty_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

/*********************************************************************************/

function PayeeDetails_Name() {}
PayeeDetails_Name.tabIndex = 30;
PayeeDetails_Name.maxLength = 70;
PayeeDetails_Name.componentName = "Payee Name";
PayeeDetails_Name.helpText = "Name of the payee";
PayeeDetails_Name.transformToDisplay = toUpper;
PayeeDetails_Name.transformToModel = toUpperStripped;

PayeeDetails_Name.logicOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_Name.logic = function(event)
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
		Services.setValue(PayeeDetails_BankInformation1.dataBinding, "");
		Services.setValue(PayeeDetails_BankInformation2.dataBinding, "");
		Services.setValue(PayeeDetails_GiroAccountNumber.dataBinding, "");
		Services.setValue(PayeeDetails_GiroTransactionCode1.dataBinding, "");
		Services.setValue(PayeeDetails_GiroTransactionCode2.dataBinding, "");
		Services.setValue(PayeeDetails_APACSTransactionCode.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line1() {}
PayeeDetails_ContactDetails_Address_Line1.tabIndex = 31;
PayeeDetails_ContactDetails_Address_Line1.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line1.componentName = "Payee Address Line 1";
PayeeDetails_ContactDetails_Address_Line1.helpText = "First line of Payee's address";
PayeeDetails_ContactDetails_Address_Line1.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_Line1.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_Line1.isMandatory = function() { return true; }
PayeeDetails_ContactDetails_Address_Line1.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line1.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line2() {}
PayeeDetails_ContactDetails_Address_Line2.tabIndex = 32;
PayeeDetails_ContactDetails_Address_Line2.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line2.componentName = "Payee Address Line 2";
PayeeDetails_ContactDetails_Address_Line2.helpText = "Second line of Payee's address";
PayeeDetails_ContactDetails_Address_Line2.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_Line2.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_Line2.isMandatory = function() { return true; }
PayeeDetails_ContactDetails_Address_Line2.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line2.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line3() {}
PayeeDetails_ContactDetails_Address_Line3.tabIndex = 33;
PayeeDetails_ContactDetails_Address_Line3.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line3.componentName = "Payee Address Line 3";
PayeeDetails_ContactDetails_Address_Line3.helpText = "Third line of Payee's address";
PayeeDetails_ContactDetails_Address_Line3.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_Line3.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_Line3.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line3.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line4() {}
PayeeDetails_ContactDetails_Address_Line4.tabIndex = 34;
PayeeDetails_ContactDetails_Address_Line4.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line4.componentName = "Payee Address Line 4";
PayeeDetails_ContactDetails_Address_Line4.helpText = "Fourth line of Payee's address";
PayeeDetails_ContactDetails_Address_Line4.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_Line4.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_Line4.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line4.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_Line5() {}
PayeeDetails_ContactDetails_Address_Line5.tabIndex = 35;
PayeeDetails_ContactDetails_Address_Line5.maxLength = 35;
PayeeDetails_ContactDetails_Address_Line5.componentName = "Payee Address Line 5";
PayeeDetails_ContactDetails_Address_Line5.helpText = "Fifth line of Payee's address";
PayeeDetails_ContactDetails_Address_Line5.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_Line5.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_Line5.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_Line5.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Address_PostCode() {}
PayeeDetails_ContactDetails_Address_PostCode.tabIndex = 36;
PayeeDetails_ContactDetails_Address_PostCode.maxLength = 8;
PayeeDetails_ContactDetails_Address_PostCode.componentName = "Payee Postcode";
PayeeDetails_ContactDetails_Address_PostCode.helpText = "Postcode of the payee";
PayeeDetails_ContactDetails_Address_PostCode.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_Address_PostCode.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_Address_PostCode.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_Address_PostCode.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
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

/*********************************************************************************/

function PayeeDetails_ContactDetails_DXNumber() {}
PayeeDetails_ContactDetails_DXNumber.tabIndex = 37;
PayeeDetails_ContactDetails_DXNumber.maxLength = 35;
PayeeDetails_ContactDetails_DXNumber.componentName = "Payee DX Number";
PayeeDetails_ContactDetails_DXNumber.helpText = "DX number of the payee";
PayeeDetails_ContactDetails_DXNumber.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_DXNumber.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_DXNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_DXNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_TelephoneNumber() {}
PayeeDetails_ContactDetails_TelephoneNumber.tabIndex = 38;
PayeeDetails_ContactDetails_TelephoneNumber.maxLength = 24;
PayeeDetails_ContactDetails_TelephoneNumber.componentName = "Payee Telephone Number";
PayeeDetails_ContactDetails_TelephoneNumber.helpText = "Telephone number of the payee";
PayeeDetails_ContactDetails_TelephoneNumber.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_TelephoneNumber.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_TelephoneNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_TelephoneNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_FaxNumber() {}
PayeeDetails_ContactDetails_FaxNumber.tabIndex = 39;
PayeeDetails_ContactDetails_FaxNumber.maxLength = 24;
PayeeDetails_ContactDetails_FaxNumber.componentName = "Payee Fax Number";
PayeeDetails_ContactDetails_FaxNumber.helpText = "Fax number of the payee";
PayeeDetails_ContactDetails_FaxNumber.transformToDisplay = toUpper;
PayeeDetails_ContactDetails_FaxNumber.transformToModel = toUpperStripped;
PayeeDetails_ContactDetails_FaxNumber.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_ContactDetails_FaxNumber.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function PayeeDetails_ContactDetails_Email() {}
PayeeDetails_ContactDetails_Email.maxLength = 80;
PayeeDetails_ContactDetails_Email.tabIndex = 40;
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

/*********************************************************************************/

function PayeeDetails_Reference() {}
PayeeDetails_Reference.tabIndex = 41;
PayeeDetails_Reference.maxLength = 24;
PayeeDetails_Reference.componentName = "Payee Reference";
PayeeDetails_Reference.helpText = "Payee reference";
PayeeDetails_Reference.transformToDisplay = toUpper;
PayeeDetails_Reference.transformToModel = toUpperStripped;
PayeeDetails_Reference.enableOn = [PayeeDetails_Name.dataBinding];
PayeeDetails_Reference.isEnabled = function()
{
	// Disabled if the payee name is blank
	var partyName = Services.getValue(PayeeDetails_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/**********************************************************************************/

function PayeeDetails_BankName() {}
PayeeDetails_BankName.tabIndex = 50;
PayeeDetails_BankName.maxLength = 30;
PayeeDetails_BankName.componentName = "Bank Name";
PayeeDetails_BankName.helpText = "Bank Name";
PayeeDetails_BankName.transformToDisplay = toUpper;
PayeeDetails_BankName.transformToModel = toUpperStripped;

/**********************************************************************************/

function PayeeDetails_AccNumber() {}
PayeeDetails_AccNumber.tabIndex = 51;
PayeeDetails_AccNumber.maxLength = 18;
PayeeDetails_AccNumber.componentName = "Account Number";
PayeeDetails_AccNumber.helpText = "Account Number";

/**********************************************************************************/

function PayeeDetails_SortCode() {}
PayeeDetails_SortCode.tabIndex = 52;
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
PayeeDetails_AccountHolder.tabIndex = 53;
PayeeDetails_AccountHolder.maxLength = 70;
PayeeDetails_AccountHolder.componentName = "Account Holder";
PayeeDetails_AccountHolder.helpText = "Account Holder";
PayeeDetails_AccountHolder.transformToDisplay = toUpper;
PayeeDetails_AccountHolder.transformToModel = toUpperStripped;

/**********************************************************************************/

function PayeeDetails_BankInformation1() {}
PayeeDetails_BankInformation1.tabIndex = 54;
PayeeDetails_BankInformation1.maxLength = 30;
PayeeDetails_BankInformation1.componentName = "Bank Information Line 1";
PayeeDetails_BankInformation1.helpText = "Bank Information Line 1";
PayeeDetails_BankInformation1.transformToDisplay = toUpper;
PayeeDetails_BankInformation1.transformToModel = toUpperStripped;

/**********************************************************************************/

function PayeeDetails_BankInformation2() {}
PayeeDetails_BankInformation2.tabIndex = 55;
PayeeDetails_BankInformation2.maxLength = 30;
PayeeDetails_BankInformation2.componentName = "Bank Information Line 2";
PayeeDetails_BankInformation2.helpText = "Bank Information Line 2";
PayeeDetails_BankInformation2.transformToDisplay = toUpper;
PayeeDetails_BankInformation2.transformToModel = toUpperStripped;

/**********************************************************************************/

function PayeeDetails_GiroAccountNumber() {}
PayeeDetails_GiroAccountNumber.tabIndex = 56;
PayeeDetails_GiroAccountNumber.maxLength = 8;
PayeeDetails_GiroAccountNumber.componentName = "GIRO Account Number";
PayeeDetails_GiroAccountNumber.helpText = "GIRO Account Number";
PayeeDetails_GiroAccountNumber.transformToDisplay = toUpper;
PayeeDetails_GiroAccountNumber.transformToModel = toUpperStripped;

/**********************************************************************************/

function PayeeDetails_GiroTransactionCode1() {}
PayeeDetails_GiroTransactionCode1.tabIndex = 57;
PayeeDetails_GiroTransactionCode1.maxLength = 9;
PayeeDetails_GiroTransactionCode1.componentName = "GIRO Transaction Code 1";
PayeeDetails_GiroTransactionCode1.helpText = "First GIRO Transaction Code";

/**********************************************************************************/

function PayeeDetails_GiroTransactionCode2() {}
PayeeDetails_GiroTransactionCode2.tabIndex = 58;
PayeeDetails_GiroTransactionCode2.maxLength = 2;
PayeeDetails_GiroTransactionCode2.componentName = "GIRO Transaction Code 2";
PayeeDetails_GiroTransactionCode2.helpText = "Second GIRO Transaction Code";

/**********************************************************************************/

function PayeeDetails_APACSTransactionCode() {}
PayeeDetails_APACSTransactionCode.tabIndex = 59;
PayeeDetails_APACSTransactionCode.maxLength = 2;
PayeeDetails_APACSTransactionCode.componentName = "APACS Transaction Code";
PayeeDetails_APACSTransactionCode.helpText = "APACS Transaction Code";

/**********************************************************************************/

function CCBCDetails_WarrantRange_FromNumber() {}
CCBCDetails_WarrantRange_FromNumber.tabIndex = 60;
CCBCDetails_WarrantRange_FromNumber.maxLength = 7;
CCBCDetails_WarrantRange_FromNumber.componentName = "Warrant Range from";
CCBCDetails_WarrantRange_FromNumber.helpText = "Warrant range from number";
CCBCDetails_WarrantRange_FromNumber.transformToDisplay = toUpper;
CCBCDetails_WarrantRange_FromNumber.transformToModel = toUpperStripped;
CCBCDetails_WarrantRange_FromNumber.validate = function()
{
	var ec = null;
	
	var warrantNumber = Services.getValue(CCBCDetails_WarrantRange_FromNumber.dataBinding);
	if ( !CaseManUtils.isBlank(warrantNumber) )
	{
		if ( 0 != warrantNumber.search(/^[A-Z][A-Z0-9][\d]{5}$/) )
		{
			// The second character must be alphanumeric and chars 3-8 must be numeric
			ec = ErrorCode.getErrorCode("CaseMan_invalidWarrantNumberFormat_Msg");
		}
	}
	
	return ec;
}

CCBCDetails_WarrantRange_FromNumber.logicOn = [CCBCDetails_WarrantRange_FromNumber.dataBinding];
CCBCDetails_WarrantRange_FromNumber.logic = function(event)
{
	if ( event.getXPath() != CCBCDetails_WarrantRange_FromNumber.dataBinding )
	{
		return;
	}
	
	var warrantNumber = Services.getValue(CCBCDetails_WarrantRange_FromNumber.dataBinding);
	if ( CaseManUtils.isBlank(warrantNumber) )
	{
		// If date from is blanked, then blank date to
		Services.setValue(CCBCDetails_WarrantRange_ToNumber.dataBinding, "");
	}
}

/**********************************************************************************/

function CCBCDetails_WarrantRange_ToNumber() {}
CCBCDetails_WarrantRange_ToNumber.tabIndex = 61;
CCBCDetails_WarrantRange_ToNumber.maxLength = 7;
CCBCDetails_WarrantRange_ToNumber.componentName = "Warrant Range to";
CCBCDetails_WarrantRange_ToNumber.helpText = "Warrant range to number";
CCBCDetails_WarrantRange_ToNumber.isMandatory = function() { return true; }
CCBCDetails_WarrantRange_ToNumber.transformToDisplay = toUpper;
CCBCDetails_WarrantRange_ToNumber.transformToModel = toUpper;
CCBCDetails_WarrantRange_ToNumber.enableOn = [CCBCDetails_WarrantRange_FromNumber.dataBinding];
CCBCDetails_WarrantRange_ToNumber.isEnabled = function()
{
	// Disabled if Range From is blank
	var rangeFrom = Services.getValue(CCBCDetails_WarrantRange_FromNumber.dataBinding);
	return ( CaseManUtils.isBlank(rangeFrom) ) ? false : true;
}

CCBCDetails_WarrantRange_ToNumber.validateOn = [CCBCDetails_WarrantRange_FromNumber.dataBinding];
CCBCDetails_WarrantRange_ToNumber.validate = function()
{
	var ec = null;
	
	var warrantNumber = Services.getValue(CCBCDetails_WarrantRange_ToNumber.dataBinding);
	if ( !CaseManUtils.isBlank(warrantNumber) )
	{
		if ( 0 != warrantNumber.search(/^[A-Z][A-Z0-9][\d]{5}$/) )
		{
			// The second character must be alphanumeric and chars 3-8 must be numeric
			ec = ErrorCode.getErrorCode("CaseMan_invalidWarrantNumberFormat_Msg");
		}

		var rangeFrom = Services.getValue(CCBCDetails_WarrantRange_FromNumber.dataBinding);
		if ( null == ec && !CaseManUtils.isBlank(rangeFrom) )
		{
			var rfChar1 = rangeFrom.charAt(0);		// First character of range from
			var rfChar2 = rangeFrom.charAt(1);		// Second character of range from
			var rtChar1 = warrantNumber.charAt(0);	// First character of range to
			var rtChar2 = warrantNumber.charAt(1);	// Second character of range to

			if ( rfChar1 != rtChar1 )
			{
				// First char of range from is not equal to first char of range to
				ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_YearCodeMatch_Msg"); 
			}
			else
			{
				// Check the second characters and the numeric sequence
				if ( CaseManValidationHelper.validateNumber(rfChar2) )
				{
					// Second char of range from is a number
					var rfSeq = rangeFrom.substring(1);		// Last 6 digits of range from (should be all numbers)
					var rtSeq = warrantNumber.substring(1);	// last 6 digits of range to (should be all numbers)
					if ( !CaseManValidationHelper.validateNumber(rtChar2) )
					{
						// Second char of range from is a number but second char of range to is a letter
						ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_WarrantTo09_Msg");
					}
					else if ( rfSeq >= rtSeq )
					{
						// The last 6 digits of range from is greater than or equal to the last
						// 6 digits of range to.
						ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_WarrantToGreater_Msg");
					}
				}
				else
				{
					// Second char of range from is a letter
					var rfSeq = rangeFrom.substring(2);		// Last 5 digits of range from (should be all numbers)
					var rtSeq = warrantNumber.substring(2);	// Last 5 digits of range to (should be all numbers)
					if ( CaseManValidationHelper.validateNumber(rtChar2) )
					{
						// Second char of range from is a letter but second char of range to is a number
						ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_WarrantToAZ_Msg");
					}
					else if ( rfChar2 > rtChar2 )
					{
						// The 2nd character of range to is lower than the second character of range from
						ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_WarrantToChar2Lower_Msg");
					}
					else if ( rfSeq >= rtSeq && rtChar2 == rfChar2 )
					{
						// The last 5 digits of the range from is greater than or equal to the last 5 digits
						// of range to.  Only applies if the second character of both warrant ranges is the same.
						ec = ErrorCode.getErrorCode("CaseMan_CCBC_WarrantRange_WarrantToGreater_Msg");
					}
				}
			}
		}

	}
	
	return ec;
}

/**********************************************************************************/

function CCBCDetails_PrintJudgment() {}
CCBCDetails_PrintJudgment.tabIndex = 62;
CCBCDetails_PrintJudgment.componentName = "Print Judgment";
CCBCDetails_PrintJudgment.helpText = "Print judgment flag";
CCBCDetails_PrintJudgment.modelValue = {checked: "Y", unchecked: "N"};

/**********************************************************************************/

function CCBCDetails_Duplex() {}
CCBCDetails_Duplex.tabIndex = 63;
CCBCDetails_Duplex.componentName = "Duplex";
CCBCDetails_Duplex.helpText = "Flag for indicating if the Customer's Judgment orders are printed single or doubled sided";
CCBCDetails_Duplex.modelValue = {checked: "Y", unchecked: "N"};

/**********************************************************************************/

function CCBCDetails_PaperTypes_N30Default() {}
CCBCDetails_PaperTypes_N30Default.tabIndex = 64;
CCBCDetails_PaperTypes_N30Default.componentName = "Paper Types - N30 (Default)";
CCBCDetails_PaperTypes_N30Default.helpText = "Indicates the type of paper that the Default N30 Order is printed on";
CCBCDetails_PaperTypes_N30Default.srcData = XPathConstants.REF_DATA_XPATH + "/PaperTypes";
CCBCDetails_PaperTypes_N30Default.rowXPath = "/PaperType";
CCBCDetails_PaperTypes_N30Default.keyXPath = "/Code";
CCBCDetails_PaperTypes_N30Default.displayXPath = "/Description";
CCBCDetails_PaperTypes_N30Default.nullDisplayValue = "";

/**********************************************************************************/

function CCBCDetails_PaperTypes_N30Admission() {}
CCBCDetails_PaperTypes_N30Admission.tabIndex = 65;
CCBCDetails_PaperTypes_N30Admission.componentName = "Paper Types - N30(1) (Admission)";
CCBCDetails_PaperTypes_N30Admission.helpText = "Indicates the type of paper that the Admission N30 Order is printed on";
CCBCDetails_PaperTypes_N30Admission.srcData = XPathConstants.REF_DATA_XPATH + "/PaperTypes";
CCBCDetails_PaperTypes_N30Admission.rowXPath = "/PaperType";
CCBCDetails_PaperTypes_N30Admission.keyXPath = "/Code";
CCBCDetails_PaperTypes_N30Admission.displayXPath = "/Description";
CCBCDetails_PaperTypes_N30Admission.nullDisplayValue = "";

/*********************************************************************************/

function DefaultClaimant_Name() {}
DefaultClaimant_Name.tabIndex = 70;
DefaultClaimant_Name.maxLength = 70;
DefaultClaimant_Name.componentName = "Default Claimant Name";
DefaultClaimant_Name.helpText = "Name of the default claimant";
DefaultClaimant_Name.transformToDisplay = toUpper;
DefaultClaimant_Name.transformToModel = toUpperStripped;

DefaultClaimant_Name.logicOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_Name.logic = function(event)
{
	if ( event.getXPath() != DefaultClaimant_Name.dataBinding )
	{
		return;
	}
	
	var payeeName = Services.getValue(DefaultClaimant_Name.dataBinding);
	if ( CaseManUtils.isBlank(payeeName) )
	{
		// If the Default Claimant Name is cleared, clear all Default Claimant details as well
		Services.startTransaction();
		Services.setValue(DefaultClaimant_ContactDetails_Address_Line1.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Address_Line2.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Address_Line3.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Address_Line4.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Address_Line5.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Address_PostCode.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_DXNumber.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_TelephoneNumber.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_FaxNumber.dataBinding, "");
		Services.setValue(DefaultClaimant_ContactDetails_Email.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_Line1() {}
DefaultClaimant_ContactDetails_Address_Line1.tabIndex = 71;
DefaultClaimant_ContactDetails_Address_Line1.maxLength = 35;
DefaultClaimant_ContactDetails_Address_Line1.componentName = "Default Claimant Address Line 1";
DefaultClaimant_ContactDetails_Address_Line1.helpText = "First line of Default Claimant's address";
DefaultClaimant_ContactDetails_Address_Line1.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_Line1.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_Line1.isMandatory = function() { return true; }
DefaultClaimant_ContactDetails_Address_Line1.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_Line1.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_Line2() {}
DefaultClaimant_ContactDetails_Address_Line2.tabIndex = 72;
DefaultClaimant_ContactDetails_Address_Line2.maxLength = 35;
DefaultClaimant_ContactDetails_Address_Line2.componentName = "Default Claimant Address Line 2";
DefaultClaimant_ContactDetails_Address_Line2.helpText = "Second line of Default Claimant's address";
DefaultClaimant_ContactDetails_Address_Line2.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_Line2.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_Line2.isMandatory = function() { return true; }
DefaultClaimant_ContactDetails_Address_Line2.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_Line2.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_Line3() {}
DefaultClaimant_ContactDetails_Address_Line3.tabIndex = 73;
DefaultClaimant_ContactDetails_Address_Line3.maxLength = 35;
DefaultClaimant_ContactDetails_Address_Line3.componentName = "Default Claimant Address Line 3";
DefaultClaimant_ContactDetails_Address_Line3.helpText = "Third line of Default Claimant's address";
DefaultClaimant_ContactDetails_Address_Line3.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_Line3.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_Line3.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_Line3.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_Line4() {}
DefaultClaimant_ContactDetails_Address_Line4.tabIndex = 74;
DefaultClaimant_ContactDetails_Address_Line4.maxLength = 35;
DefaultClaimant_ContactDetails_Address_Line4.componentName = "Default Claimant Address Line 4";
DefaultClaimant_ContactDetails_Address_Line4.helpText = "Fourth line of Default Claimant's address";
DefaultClaimant_ContactDetails_Address_Line4.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_Line4.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_Line4.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_Line4.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_Line5() {}
DefaultClaimant_ContactDetails_Address_Line5.tabIndex = 75;
DefaultClaimant_ContactDetails_Address_Line5.maxLength = 35;
DefaultClaimant_ContactDetails_Address_Line5.componentName = "Default Claimant Address Line 5";
DefaultClaimant_ContactDetails_Address_Line5.helpText = "Fifth line of Default Claimant's address";
DefaultClaimant_ContactDetails_Address_Line5.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_Line5.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_Line5.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_Line5.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Address_PostCode() {}
DefaultClaimant_ContactDetails_Address_PostCode.tabIndex = 76;
DefaultClaimant_ContactDetails_Address_PostCode.maxLength = 8;
DefaultClaimant_ContactDetails_Address_PostCode.componentName = "Default Claimant Postcode";
DefaultClaimant_ContactDetails_Address_PostCode.helpText = "Postcode of the default claimant";
DefaultClaimant_ContactDetails_Address_PostCode.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_Address_PostCode.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_Address_PostCode.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Address_PostCode.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

DefaultClaimant_ContactDetails_Address_PostCode.validate = function()
{
	var value = Services.getValue(DefaultClaimant_ContactDetails_Address_PostCode.dataBinding);
	
	if( !CaseManValidationHelper.validatePostCode(value) )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_DXNumber() {}
DefaultClaimant_ContactDetails_DXNumber.tabIndex = 77;
DefaultClaimant_ContactDetails_DXNumber.maxLength = 35;
DefaultClaimant_ContactDetails_DXNumber.componentName = "Default Claimant DX Number";
DefaultClaimant_ContactDetails_DXNumber.helpText = "DX number of the default claimant";
DefaultClaimant_ContactDetails_DXNumber.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_DXNumber.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_DXNumber.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_DXNumber.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_TelephoneNumber() {}
DefaultClaimant_ContactDetails_TelephoneNumber.tabIndex = 78;
DefaultClaimant_ContactDetails_TelephoneNumber.maxLength = 24;
DefaultClaimant_ContactDetails_TelephoneNumber.componentName = "Default Claimant Telephone Number";
DefaultClaimant_ContactDetails_TelephoneNumber.helpText = "Telephone number of the default claimant";
DefaultClaimant_ContactDetails_TelephoneNumber.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_TelephoneNumber.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_TelephoneNumber.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_TelephoneNumber.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_FaxNumber() {}
DefaultClaimant_ContactDetails_FaxNumber.tabIndex = 79;
DefaultClaimant_ContactDetails_FaxNumber.maxLength = 24;
DefaultClaimant_ContactDetails_FaxNumber.componentName = "Default Claimant Fax Number";
DefaultClaimant_ContactDetails_FaxNumber.helpText = "Fax number of the default claimant";
DefaultClaimant_ContactDetails_FaxNumber.transformToDisplay = toUpper;
DefaultClaimant_ContactDetails_FaxNumber.transformToModel = toUpperStripped;
DefaultClaimant_ContactDetails_FaxNumber.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_FaxNumber.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/*********************************************************************************/

function DefaultClaimant_ContactDetails_Email() {}
DefaultClaimant_ContactDetails_Email.maxLength = 80;
DefaultClaimant_ContactDetails_Email.tabIndex = 80;
DefaultClaimant_ContactDetails_Email.helpText = "Email address of the default claimant";
DefaultClaimant_ContactDetails_Email.componentName = "Default Claimant Email Address";
DefaultClaimant_ContactDetails_Email.validate = function()
{
	var emailAddress = Services.getValue(DefaultClaimant_ContactDetails_Email.dataBinding);
	return CaseManValidationHelper.validatePattern(emailAddress, CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

DefaultClaimant_ContactDetails_Email.enableOn = [DefaultClaimant_Name.dataBinding];
DefaultClaimant_ContactDetails_Email.isEnabled = function()
{
	// Disabled if the Default Claimant name is blank
	var partyName = Services.getValue(DefaultClaimant_Name.dataBinding);
	return ( CaseManUtils.isBlank(partyName) ) ? false : true;
}

/****************************** BUTTON FIELDS **************************************/

function MaintainNationalCodedPartySubform_SaveButton() {}
MaintainNationalCodedPartySubform_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainNationalCodedPartySubform" } ]
	}
};
MaintainNationalCodedPartySubform_SaveButton.tabIndex = 90;
MaintainNationalCodedPartySubform_SaveButton.actionBinding = function()
{
	// Set the default hidden data for the National Coded Party (create only)
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	var user = Services.getCurrentUser();
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	
	Services.startTransaction();
	if ( mode == FormStates.MODE_CREATE )
	{
		// Determine the court code based on type of National Coded Party
		var courtCode = isNonCPCCodedParty(code) ? CaseManUtils.GLOBAL_COURT_CODE : CaseManUtils.CCBC_COURT_CODE;
	    
	    Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CourtCode", courtCode);
	    Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/CreatedBy", user);

		if ( !isNonCPCCodedParty(code) )
		{
			// Determine if Payee Details entered
			var payeeName = Services.getValue(PayeeDetails_Name.dataBinding);
			if ( !CaseManUtils.isBlank(payeeName) )
			{
				// Payee details entered, set the address created by field
				Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/CreatedBy", user);
			}
			else
			{
				// No Payee Details entered, remove the node
				Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/Payee");
			}
			
			// Determine if Default Claimant Details entered
			var defaultClaimantName = Services.getValue(DefaultClaimant_Name.dataBinding);
			if ( !CaseManUtils.isBlank(defaultClaimantName) )
			{
				// Default Claimant details entered, set the address created by field
				Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/CreatedBy", user);
			}
			else
			{
				// No Default Claimant Details entered, remove the node
				Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant");
			}
			
			// Set the CCBC Details Sequence Numbers (Group2 Defect 4387)
			Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/LastJgSeq", 0);
			Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/LastPdSeq", 0);
			Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/LastWtSeq", 0);
			Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/LastDefSeq", 0);
			Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails/LastAdmSeq", 0);
		}
    }
    else
    {
    	if ( !isNonCPCCodedParty(code) )
    	{
    		var payeeId = Services.getValue(XPathConstants.SUBFORM_DATA_XPATH + "/Payee/PartyId");
	    	var payeeName = Services.getValue(PayeeDetails_Name.dataBinding);
	    	var payeeAddressCreatedBy = Services.getValue(XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/CreatedBy");
	    	if ( CaseManUtils.isBlank(payeeId) && CaseManUtils.isBlank(payeeName) )
	    	{
	    		// No Payee Details exist, remove the node
	    		Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/Payee");
	    	}
	    	else if ( !CaseManUtils.isBlank(payeeName) && CaseManUtils.isBlank(payeeAddressCreatedBy) )
	    	{
	    		// Payee Name entered but no created by so must have been added during update, set created by
	    		Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/Payee/ContactDetails/Address/CreatedBy", user);
	    	}
	    	
	    	var defaultClaimantId = Services.getValue(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/PartyId");
	    	var defaultClaimantName = Services.getValue(DefaultClaimant_Name.dataBinding);
	    	var defaultClaimantAddressCreatedBy = Services.getValue(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/CreatedBy");
	    	if ( CaseManUtils.isBlank(defaultClaimantId) && CaseManUtils.isBlank(defaultClaimantName) )
	    	{
	    		// No Default Claimant Details exist, remove the node
	    		Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant");
	    	}
	    	else if ( !CaseManUtils.isBlank(defaultClaimantName) && CaseManUtils.isBlank(defaultClaimantAddressCreatedBy) )
	    	{
	    		// Default Claimant Name entered but no created by so must have been added during update, set created by
	    		Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant/ContactDetails/Address/CreatedBy", user);
	    	}
    	}
    }
    
	if ( isNonCPCCodedParty(code) )
	{
		// Non CPC National Coded Party - Remove the Payee, Default Claimant and CCBC Details Nodes
		Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/Payee");
		Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/CCBCDetails");
		Services.removeNode(XPathConstants.SUBFORM_DATA_XPATH + "/DefaultClaimant");
	}
	Services.endTransaction();

	// Call the submit lifecycle
	Services.dispatchEvent("maintainNationalCodedPartySubform", BusinessLifeCycleEvents.EVENT_SUBMIT );
}

/**********************************************************************************/

function MaintainNationalCodedPartySubform_CancelButton() {}
MaintainNationalCodedPartySubform_CancelButton.tabIndex = 91;