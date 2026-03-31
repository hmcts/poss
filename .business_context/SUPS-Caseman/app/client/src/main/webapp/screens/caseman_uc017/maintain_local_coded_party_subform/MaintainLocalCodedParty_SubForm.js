/** 
 * @fileoverview MaintainLocalCodedParty_SubForm.js:
 * This file contains the configurations for the Maintain Local Coded Party Subform
 *
 * ISSUES: The new code fields will always be disabled as the RFC1297 change involving
 * replacement of Coded Parties will not be available for CaseMan Go Live Date.
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, transform to model on mandatory fields (Party Name 
 *				and first 2 address lines) to strip out trailing and leading spaces.
 * 30/08/2006 - Chris Vincent, updated MaintainCodedParty_Code.logic() to reference the validate()
 * 				function rather than getValid().  Defect 4868.
 * 02/09/2016 - Chris Vincent, removed server side call in initialise function.  Trac 5875
 */

/************************** FORM CONFIGURATIONS *************************************/

function maintainLocalCodedPartySubform() {}

maintainLocalCodedPartySubform.startupState = 
{
/**
 * @author rzxd7g
 * @return ( mode == PopupModes.MODE_CREATE ) ? "create", "modify"  
 */
	mode: function() {
		var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
		return ( mode == PopupModes.MODE_CREATE ) ? "create" : "modify";
	}
}

maintainLocalCodedPartySubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "LocalCodedPartyDOM.xml",
	dataBinding: "/ds"
}

maintainLocalCodedPartySubform.loadExisting = 
{
	name: "formLoadExisting",
	serviceName: "getCodedParty",
	serviceParams: [ { name: "codedPartyCode", value: XPathConstants.SUBFORM_CODE_XPATH }, { name: "adminCourtCode", value: XPathConstants.SUBFORM_COURTCODE_XPATH } ],
	dataBinding: "/ds"
}

maintainLocalCodedPartySubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "LocalCodedPartyDOM.xml",
	dataBinding: "/ds"
}

maintainLocalCodedPartySubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	name: "formLoadExisting",
	serviceName: "getCodedParty",
	serviceParams: [ { name: "codedPartyCode", value: XPathConstants.SUBFORM_CODE_XPATH }, { name: "adminCourtCode", value: XPathConstants.SUBFORM_COURTCODE_XPATH } ],
	dataBinding: "/ds"
}

maintainLocalCodedPartySubform.submitLifeCycle = 
{
	create: {
		name:  "addCodedParty",
        params: [ { name: "codedPartyCode", node: "/ds/CodedParties" } ],
        errorHandler: {
/**
 * @param e
 * @author rzxd7g
 * 
 */
        	onAuthorizationException: function(e) { alert(Messages.AUTHORIZATION_FAILED_MESSAGE); }
        }
	},
	
	modify: {
		name:  "updateCodedParty",
        params: [ { name: "codedPartyCode", node: "/ds/CodedParties" } ],
        errorHandler: {
/**
 * @param e
 * @author rzxd7g
 * @return SourceNodes, [XPathConstants.SUBFORM_DATA_XPATH],, addressString , null, "MaintainCodedParty_NewCode" , boolean, ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg") , ErrorCode.getErrorCode("CaseMan_invalidInsertNationalCode_Msg")  
 */
        	onAuthorizationException: function(e) { alert(Messages.AUTHORIZATION_FAILED_MESSAGE); }
        }
	},

	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

maintainLocalCodedPartySubform.cancelLifeCycle = {
	eventBinding: {	keys: [ { key: Key.F4, element: "maintainLocalCodedPartySubform" } ],
					singleClicks: [ { element: "MaintainLocalCodedPartySubform_CancelButton" } ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/******************************** LOV POPUPS ***************************************/

function MaintainCodedParty_NewCodeLOVGrid() {};
MaintainCodedParty_NewCodeLOVGrid.mergeAddressLines = function(index)
{
	var rootXp = MaintainCodedParty_NewCodeLOVGrid.srcData + "/CodedParty[./Code = '" + index + "']/ContactDetails/Address";
	var addressString = "" + Services.getValue(rootXp + "/Line[1]");
	addressString = addressString + ", " + Services.getValue(rootXp + "/Line[2]");
	return addressString;
}

MaintainCodedParty_NewCodeLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedLOVRow/CodedParty";
MaintainCodedParty_NewCodeLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/ReplaceList/CodedParties";
MaintainCodedParty_NewCodeLOVGrid.rowXPath = "CodedParty";
MaintainCodedParty_NewCodeLOVGrid.keyXPath = "Code";
MaintainCodedParty_NewCodeLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"},
	{xpath: "Code", transformToDisplay: MaintainCodedParty_NewCodeLOVGrid.mergeAddressLines }
];

MaintainCodedParty_NewCodeLOVGrid.logicOn = [MaintainCodedParty_NewCodeLOVGrid.dataBinding];
MaintainCodedParty_NewCodeLOVGrid.logic = function(event)
{
	if ( event.getXPath() != MaintainCodedParty_NewCodeLOVGrid.dataBinding )
	{
		return;
	}

	var lovValue = Services.getValue(MaintainCodedParty_NewCodeLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(lovValue) )
	{
		Services.setValue(MaintainCodedParty_NewCode.dataBinding, lovValue);
	}
}

MaintainCodedParty_NewCodeLOVGrid.prePopupPrepare = function()
{
	// Clear the previous value used when enter the LOV
	Services.setValue(MaintainCodedParty_NewCodeLOVGrid.dataBinding, "");
}

MaintainCodedParty_NewCodeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ { element: "MaintainCodedParty_NewCodeLOVButton" } ]
	}
};

MaintainCodedParty_NewCodeLOVGrid.nextFocusedAdaptorId = function() 
{
	return "MaintainCodedParty_NewCode";
}

/****************************** DATA BINDINGS **************************************/

MaintainCodedParty_Code.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Code";
MaintainCodedParty_NewCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/NewCode";
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

/******************************* INPUT FIELDS **************************************/

function MaintainCodedParty_Code() {}
MaintainCodedParty_Code.maxLength = 4;
MaintainCodedParty_Code.tabIndex = 1;
MaintainCodedParty_Code.helpText = "Unique four digit code identifier for Party";
MaintainCodedParty_Code.componentName = "Code";
MaintainCodedParty_Code.isMandatory = function() { return true; }
MaintainCodedParty_Code.readOnlyOn = [XPathConstants.SUBFORM_MODE_XPATH];
MaintainCodedParty_Code.isReadOnly = function()
{
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	return ( mode == PopupModes.MODE_MODIFY ) ? true : false;
}

MaintainCodedParty_Code.validateOn = [XPathConstants.CODE_EXISTS_XPATH];
MaintainCodedParty_Code.validate = function()
{
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
		
	if( !CaseManUtils.isBlank(code) )
	{
    	if( CaseManValidationHelper.validateNumber(code) == false )
    	{
    		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
    	}
    	if( isNationalCodedParty(code) )
		{
			return ErrorCode.getErrorCode("CaseMan_invalidInsertNationalCode_Msg");
		}
		
		var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
		if( mode == PopupModes.MODE_CREATE )
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
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
		var params = new ServiceParams();
		params.addSimpleParameter("codedPartyCode", code);
		params.addSimpleParameter("courtCode", courtCode);
		Services.callService("getCodedPartyShort", params, MaintainCodedParty_Code, false);	
	}
	else if ( CaseManUtils.isBlank(code) )
	{
		Services.setValue(XPathConstants.CODE_EXISTS_XPATH, "");
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
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

/***********************************************************************************/

function MaintainCodedParty_NewCode() {}

MaintainCodedParty_NewCode.maxLength = 4;
MaintainCodedParty_NewCode.tabIndex = 2;
MaintainCodedParty_NewCode.helpText = "Enter an existing coded party code to replace the party details";
MaintainCodedParty_NewCode.componentName = "New Code";
MaintainCodedParty_NewCode.enableOn = [XPathConstants.SUBFORM_MODE_XPATH];
MaintainCodedParty_NewCode.isEnabled = function()
{
	// CPV (06/02/2006) Always Disabled as the replacement of Coded Parties will not be available for
	// Go Live Date
	return false;

	/*
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	return ( mode == PopupModes.MODE_MODIFY ) ? true : false;
 */
}

MaintainCodedParty_NewCode.validate = function()
{
	var ec = null;
	var newCode = Services.getValue(MaintainCodedParty_NewCode.dataBinding);
	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
	var codeExists = Services.exists(MaintainCodedParty_NewCodeLOVGrid.srcData + "/CodedParty[./Code = '" + newCode + "']");
	if ( !codeExists )
	{
		// Code entered does not already exist
		ec = ErrorCode.getErrorCode("CaseMan_replacementCodeMustBeExisting_Msg");
	}
	else if ( newCode == code )
	{
		// Code entered is the same as the current code
		ec = ErrorCode.getErrorCode("CaseMan_replacementCodeSameAsCurrent_Msg");
	}
	return ec;
}

/***********************************************************************************/

function MaintainCodedParty_Name() {}
MaintainCodedParty_Name.maxLength = 70;
MaintainCodedParty_Name.tabIndex = 4;
MaintainCodedParty_Name.componentName = "Name";
MaintainCodedParty_Name.isMandatory = function() { return true; }
MaintainCodedParty_Name.helpText = "Name of Party/name of solicitor/litigation dept etc";
MaintainCodedParty_Name.transformToDisplay = toUpper;
MaintainCodedParty_Name.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_AddressLine1() {}
MaintainCodedParty_AddressLine1.maxLength = 35;
MaintainCodedParty_AddressLine1.tabIndex = 5;
MaintainCodedParty_AddressLine1.componentName = "Address Line 1";
MaintainCodedParty_AddressLine1.isMandatory = function() { return true; }
MaintainCodedParty_AddressLine1.helpText = "First line of Party's address";
MaintainCodedParty_AddressLine1.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine1.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_AddressLine2() {}
MaintainCodedParty_AddressLine2.maxLength = 35;
MaintainCodedParty_AddressLine2.tabIndex = 6;
MaintainCodedParty_AddressLine2.componentName = "Address Line 2";
MaintainCodedParty_AddressLine2.helpText = "Second line of Party's address";
MaintainCodedParty_AddressLine2.isMandatory = function() { return true; }
MaintainCodedParty_AddressLine2.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine2.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_AddressLine3() {}
MaintainCodedParty_AddressLine3.maxLength = 35;
MaintainCodedParty_AddressLine3.tabIndex = 7;
MaintainCodedParty_AddressLine3.componentName = "Address Line 3";
MaintainCodedParty_AddressLine3.helpText = "Third line of Party's address";
MaintainCodedParty_AddressLine3.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine3.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_AddressLine4() {}
MaintainCodedParty_AddressLine4.maxLength = 35;
MaintainCodedParty_AddressLine4.tabIndex = 8;
MaintainCodedParty_AddressLine4.helpText = "Fourth line of Party's address";
MaintainCodedParty_AddressLine4.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine4.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_AddressLine5() {}
MaintainCodedParty_AddressLine5.maxLength = 35;
MaintainCodedParty_AddressLine5.helpText = "Fifth line of Party's address";
MaintainCodedParty_AddressLine5.tabIndex = 9;
MaintainCodedParty_AddressLine5.transformToDisplay = toUpper;
MaintainCodedParty_AddressLine5.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_PostCode() {}
MaintainCodedParty_PostCode.maxLength = 8;
MaintainCodedParty_PostCode.helpText = "Party's postcode";
MaintainCodedParty_PostCode.componentName = "Postcode";
MaintainCodedParty_PostCode.tabIndex = 10;
MaintainCodedParty_PostCode.transformToDisplay = toUpper;
MaintainCodedParty_PostCode.transformToModel = toUpper;
MaintainCodedParty_PostCode.validate = function()
{
	var value = Services.getValue(MaintainCodedParty_PostCode.dataBinding);
	if( !CaseManValidationHelper.validatePostCode(value) )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/***********************************************************************************/

function MaintainCodedParty_DXNumber() {}
MaintainCodedParty_DXNumber.maxLength = 35;
MaintainCodedParty_DXNumber.tabIndex = 11;
MaintainCodedParty_DXNumber.helpText = "DX Number of party";
MaintainCodedParty_DXNumber.transformToDisplay = toUpper;
MaintainCodedParty_DXNumber.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_Telephone() {}
MaintainCodedParty_Telephone.maxLength = 24;
MaintainCodedParty_Telephone.tabIndex = 12;
MaintainCodedParty_Telephone.helpText = "Telephone number of party";
MaintainCodedParty_Telephone.transformToDisplay = toUpper;
MaintainCodedParty_Telephone.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_FaxNumber() {}
MaintainCodedParty_FaxNumber.maxLength = 24;
MaintainCodedParty_FaxNumber.tabIndex = 13;
MaintainCodedParty_FaxNumber.helpText = "Fax number of Party";
MaintainCodedParty_FaxNumber.transformToDisplay = toUpper;
MaintainCodedParty_FaxNumber.transformToModel = toUpperStripped;

/***********************************************************************************/

function MaintainCodedParty_Email() {}
MaintainCodedParty_Email.maxLength = 80;
MaintainCodedParty_Email.helpText = "Email address of Party";
MaintainCodedParty_Email.componentName = "Email";
MaintainCodedParty_Email.tabIndex = 14;
MaintainCodedParty_Email.validate = function()
{
	var emailAddress = Services.getValue(MaintainCodedParty_Email.dataBinding);
	return CaseManValidationHelper.validatePattern(emailAddress, CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

/****************************** BUTTON FIELDS **************************************/

function MaintainCodedParty_NewCodeLOVButton() {};
MaintainCodedParty_NewCodeLOVButton.tabIndex = 3;
MaintainCodedParty_NewCodeLOVButton.enableOn = [XPathConstants.SUBFORM_MODE_XPATH];
MaintainCodedParty_NewCodeLOVButton.isEnabled = function()
{
	// CPV (06/02/2006) Always Disabled as the replacement of Coded Parties will not be available for
	// Go Live Date
	return false;

	/*
	// Only enabled for updates
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH)
	return ( mode == PopupModes.MODE_MODIFY ) ? true : false;
 */
}

/**********************************************************************************/

function MaintainLocalCodedPartySubform_SaveButton() {}
MaintainLocalCodedPartySubform_SaveButton.tabIndex = 20;
MaintainLocalCodedPartySubform_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainLocalCodedPartySubform" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
MaintainLocalCodedPartySubform_SaveButton.actionBinding = function()
{
	// Set the default hidden data for the National Coded Party (create only)
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	if ( mode == PopupModes.MODE_CREATE )
	{
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
		var user = Services.getCurrentUser();
		
	    Services.startTransaction();
	    Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/CourtCode", courtCode);
	    Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/Address/CreatedBy", user);
	    Services.endTransaction();
    }
    else
    {
    	var code = Services.getValue(MaintainCodedParty_Code.dataBinding);
  		var newCode = Services.getValue(MaintainCodedParty_NewCode.dataBinding);
  		var msg = Messages.format(Messages.CONFIRM_REPLACE_CODEDPARTY_MESSAGE, [code, newCode] );
  		if ( !CaseManUtils.isBlank(newCode) && !confirm(msg) )
  		{
  			// User does not wish to replace one coded party's details with the current party's details
  			Services.setValue(MaintainCodedParty_NewCode.dataBinding, "");
  		}
    }

	// Call the submit lifecycle
	Services.dispatchEvent("maintainLocalCodedPartySubform", BusinessLifeCycleEvents.EVENT_SUBMIT );
}

/**********************************************************************************/

function MaintainLocalCodedPartySubform_CancelButton() {}
MaintainLocalCodedPartySubform_CancelButton.tabIndex = 21;
