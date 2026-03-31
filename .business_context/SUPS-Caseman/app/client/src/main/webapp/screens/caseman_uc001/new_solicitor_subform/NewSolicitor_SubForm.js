/** 
 * @fileoverview NewSolicitor_SubForm.js:
 * This file contains the configurations for the New Solicitor Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, mandatory party name and first two address lines altered
 *				so transform to model strips leading and trailing space to prevent a blank
 *				value to be entered which could break the application.
 * 11/07/2006 - Chris Vincent, removed the Coded Party LOV popup and replaced it with the new
 * 				Coded Party Search Subform.  The mechanism in which the Solicitor Code field logic
 * 				works has also changed as it must perform an existance check because the reference
 * 				data is no longer loaded into the screen.
 * 04/09/2009 - Paul Roberts, defect 5050.  Changed New_Solicitor_Popup_Code.logic to not crash 
 *				when apostrophe entered for solicitor code.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 21/06/2007 - Chris Vincent, changes to party code field validation and mandatory rules to allow CCBC MCOL
 * 				cases to have optional, non-national coded party solicitors on any party.  UCT_Group2 1371.
 * 19/09/2011 - Chris Vincent, changes to functions isNationalCodedParty and isNonCPCNationalCodedParty to use
 *				a new generic CaseManUtils function for determining if coded party code is a CCBC National Coded 
 *				Party code or not.  Trac 4553.
 */

/****************************** CONSTANTS ******************************************/

function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.SOL_XPATH = "/ds/NewSolicitorData/Solicitor";
XPathConstants.PARTY_XPATH = "/ds/NewSolicitorData/Party";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/Subforms/newSolicitorSubform";
XPathConstants.CODE_VALID_XPATH = "/ds/var/page/Temp/CodedPartyCodeValid";

/************************** FORM CONFIGURATIONS *************************************/

function newSolicitorSubform() {}

newSolicitorSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "NewSolicitorDOM.xml",
	dataBinding: "/ds"
}

newSolicitorSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "NewSolicitorDOM.xml",
	dataBinding: "/ds"
}

newSolicitorSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "New_Solicitor_Popup_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},
	
	returnSourceNodes: [XPathConstants.SOL_XPATH, XPathConstants.PARTY_XPATH],
	postSubmitAction: {
		close: {}
	}
}

newSolicitorSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "newSolicitorSubform" } ],
					singleClicks: [ {element: "New_Solicitor_Popup_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}


/************************* CODED PARTY SEARCH SUBFORM ******************************/

function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";
codedPartySearch_subform.raise = {
	eventBinding: {
		singleClicks: [ { element: "New_Solicitor_Popup_CodeLOVButton" } ],
		keys: [ { key: Key.F6, element: "New_Solicitor_Popup_Code" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var adminCourtCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/OwningCourtCode");
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, adminCourtCode);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: "/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode" }
];

/**
 * @author rzxd7g
 * 
 */
codedPartySearch_subform.processReturnedData = function() 
{
	var partyCode = Services.getValue("/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	Services.setValue(New_Solicitor_Popup_Code.dataBinding, partyCode);
}

/**
 * @author rzxd7g
 * @return "New_Solicitor_Popup_Code"  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function() 
{
	return "New_Solicitor_Popup_Code";
}

/***************************** HELPER FUNCTIONS*************************************/

/**
 * @param code
 * @author rzxd7g
 * @return ec  
 */
function isNationalCodedParty(code)
{
	var ec = null;
	var partyTypeCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/PartyTypeCode");
	var creditorCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/CreditorCode");
	if ( isCCBCCase() && 
		 creditorCode != CaseManUtils.MCOL_CRED_CODE && 
		 partyTypeCode == PartyTypeCodesEnum.CLAIMANT )
	{
		if ( !CaseManUtils.isCCBCNationalCodedParty(code) )
		{
			// For a CCBC Case (exluding MCOL Cases), the solicitor of a claimant must be a national coded party 
			ec = ErrorCode.getErrorCode("Caseman_invalidNationalPartyCodeRange_Msg");
		}
	}
	else
	{
		if ( CaseManUtils.isCCBCNationalCodedParty(code) )
		{
			// For all other parties and cases, must be a local coded party
			ec = ErrorCode.getErrorCode("Caseman_invalidPartyCodeRange_Msg");
		}
	}
	
	return ec;
}

/*********************************************************************************/

/**
 * @author rzxd7g
 * @return boolean 
 */
function newSolicitorReadOnlyFields()
{
	var code = Services.getValue(New_Solicitor_Popup_Code.dataBinding)
	// The field is enabled if the solicitor code has no value in it
	if ( CaseManUtils.isBlank(code) )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

/**
 * Function indicates whether or not a coded party code belongs to the Non CPC
 * National Coded Party Range (7000 - 9999).  Note that some CCBC National Coded
 * Party ranges exist in the 7000-9999 range.
 *
 * @param [Integer] The Coded Party Code
 * @return [Boolean] True if the code falls in the range 7000-9999 else false
 * @author rzxd7g
 */
function isNonCPCNationalCodedParty(code)
{
	var blnNonCPC = false;
	if ( code >= 7000 && code <= 9999 )
	{
		// Code in Non CPC Range, test if a CCBC National Coded Party
		blnNonCPC = CaseManUtils.isCCBCNationalCodedParty(code) ? false : true;
	}
	return blnNonCPC;
}

/**********************************************************************************/

/**
 * Function to return whether the current case is a CCBC Case
 * @author rzxd7g
 * @return boolean 
 */
function isCCBCCase()
{
	// Case is CCBC if court is 335
	var court = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/OwningCourtCode");
	return ( court == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}

/****************************** DATA BINDINGS **************************************/

New_Solicitor_Popup_Code.dataBinding = XPathConstants.SOL_XPATH + "/Code";
New_Solicitor_Popup_Name.dataBinding = XPathConstants.SOL_XPATH + "/Name";
New_Solicitor_Popup_ContactDetails_Address_Line1.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/Line[1]";
New_Solicitor_Popup_ContactDetails_Address_Line2.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/Line[2]";
New_Solicitor_Popup_ContactDetails_Address_Line3.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/Line[3]";
New_Solicitor_Popup_ContactDetails_Address_Line4.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/Line[4]";
New_Solicitor_Popup_ContactDetails_Address_Line5.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/Line[5]";
New_Solicitor_Popup_ContactDetails_Address_Postcode.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/Address/PostCode";
New_Solicitor_Popup_ContactDetails_DX.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/DX";
New_Solicitor_Popup_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/TelephoneNumber";
New_Solicitor_Popup_ContactDetails_FaxNumber.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/FaxNumber";
New_Solicitor_Popup_ContactDetails_EmailAddress.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/EmailAddress";
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.dataBinding = XPathConstants.SOL_XPATH + "/ContactDetails/PreferredCommunicationMethod";
New_Solicitor_Popup_Reference.dataBinding = XPathConstants.PARTY_XPATH + "/SolicitorReference";
New_Solicitor_Popup_Payee.dataBinding = XPathConstants.PARTY_XPATH + "/SolicitorPayee";

/******************************* INPUT FIELDS **************************************/

function New_Solicitor_Popup_Code() {};

New_Solicitor_Popup_Code.tabIndex = 1;
New_Solicitor_Popup_Code.maxLength = 4;
New_Solicitor_Popup_Code.helpText = "Unique four digit code for solicitor - list available";

New_Solicitor_Popup_Code.mandatoryOn = [XPathConstants.FORM_DATA_XPATH + "/OwningCourtCode"];
New_Solicitor_Popup_Code.isMandatory = function()
{
	var isFieldMandatory = false;
	var partyTypeCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/PartyTypeCode");
	var creditorCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/CreditorCode");
	if ( isCCBCCase() && 
		 creditorCode != CaseManUtils.MCOL_CRED_CODE && 
		 partyTypeCode == PartyTypeCodesEnum.CLAIMANT )
	{
		// Solicitor of a claimant must be a coded party if the case is CCBC (excluding MCOL cases)
		isFieldMandatory = true;
	}
	return isFieldMandatory;
}

New_Solicitor_Popup_Code.validateOn = [XPathConstants.CODE_VALID_XPATH];
New_Solicitor_Popup_Code.validate = function()
{
	var code = Services.getValue(New_Solicitor_Popup_Code.dataBinding);
	var ec = null;

	// Check that the code is a number
	if( !CaseManValidationHelper.validateNumber(code) )
	{
		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
	ec = isNationalCodedParty(code);
	
	if ( null == ec )
	{
		// A code has been entered so try and look up the data for the code
		// Lookup the solicitor's name
		var serverSideCheckValid = Services.getValue(XPathConstants.CODE_VALID_XPATH);
		if ( "false" == serverSideCheckValid )
		{
			ec = ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
		}
	}
	
	return ec;
}

New_Solicitor_Popup_Code.logicOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_Code.logic = function(event)
{
	if ( event.getXPath() != New_Solicitor_Popup_Code.dataBinding )
	{
		return;
	}

	var value = Services.getValue(New_Solicitor_Popup_Code.dataBinding);
	if (CaseManUtils.isBlank(value))
	{
		// The code is empty so clear all solicitor data by clearing the solicitor name
		Services.setValue(New_Solicitor_Popup_Name.dataBinding, "");
		return;
	}
	else
	{
		// Check to see if the coded party is active on the case	
		var xp = XPathConstants.FORM_DATA_XPATH + "/PartyCodes[./Code = " + New_Solicitor_Popup_Code.dataBinding + "]";
		if ( Services.exists(xp) )
		{
			alert(Messages.DUPLICATE_PARTYCODE_MESSAGE);
			Services.setValue(New_Solicitor_Popup_Code.dataBinding, "");
			return;
		}
		
		Services.setValue(XPathConstants.CODE_VALID_XPATH, "true");
		
		if ( null != New_Solicitor_Popup_Code.validate() )
		{
			return;
		}

		// If the code is null that means that case data has been read from the server 
		// and the solicitor is not a coded solicitor. When the code is null we want
		// to do nothing
		var owningCourt = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/OwningCourtCode");
		var courtCode = isNonCPCNationalCodedParty(value) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourt;
		var params = new ServiceParams();
		params.addSimpleParameter( "codedPartyCode", value );
		params.addSimpleParameter( "adminCourtCode", courtCode );
		Services.callService( "getCodedParty", params, New_Solicitor_Popup_Code, true );
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
New_Solicitor_Popup_Code.onSuccess = function(dom)
{
	var root = "/CodedParties/CodedParty";
	if ( null != dom.selectSingleNode(root) )
	{
		Services.startTransaction();
		// Assign all values individually as the root node of the solicitor does not match the node of the coded party
		var cdroot = root + "/ContactDetails";
		var adroot = cdroot + "/Address";
	
		Services.setValue(XPathConstants.SOL_XPATH + "/PartyId", XML.getNodeTextContent(dom.selectSingleNode(root + "/PartyId")) );
		Services.setValue(New_Solicitor_Popup_Name.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")) );
		Services.setValue(XPathConstants.SOL_XPATH + "/ContactDetails/Address/AddressId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/AddressId")) );
		Services.setValue(XPathConstants.SOL_XPATH + "/ContactDetails/Address/PartyId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PartyId")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Line1.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[1]")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Line2.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[2]")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Line3.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[3]")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Line4.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[4]")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Line5.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[5]")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_Address_Postcode.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PostCode")) );
		Services.setValue(XPathConstants.SOL_XPATH + "/ContactDetails/Address/DateFrom", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/DateFrom")) );
		Services.setValue(XPathConstants.SOL_XPATH + "/ContactDetails/Address/DateTo", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/DateTo")) );
		Services.setValue(XPathConstants.SOL_XPATH + "/ContactDetails/Address/CreatedBy", "");
		Services.setValue(New_Solicitor_Popup_ContactDetails_DX.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/DX")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_TelephoneNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/TelephoneNumber")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_FaxNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/FaxNumber")) );
		Services.setValue(New_Solicitor_Popup_ContactDetails_EmailAddress.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/EmailAddress")) );
		Services.endTransaction();
	}
	else
	{
		// Coded Party Entered is invalid
		Services.setValue(XPathConstants.CODE_VALID_XPATH, "false");
		Services.setFocus("New_Solicitor_Popup_Code");
	}
}

/*********************************************************************************/

function New_Solicitor_Popup_Name() {};

New_Solicitor_Popup_Name.tabIndex = 2;
New_Solicitor_Popup_Name.maxLength = 70;
New_Solicitor_Popup_Name.helpText = "Solicitor name";
New_Solicitor_Popup_Name.isMandatory = function() { return true;}
New_Solicitor_Popup_Name.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_Name.isReadOnly = newSolicitorReadOnlyFields;

/**
 * @param forward
 * @author rzxd7g
 * @return "New_Solicitor_Popup_Code" , "New_Solicitor_Popup_ContactDetails_Address_Line1" , "New_Solicitor_Popup_CodeLOVButton"  
 */
New_Solicitor_Popup_Name.moveFocus = function(forward)
{
	if(!forward)
	{
		return "New_Solicitor_Popup_Code";
	}
	else if(!CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding)))
	{
		return "New_Solicitor_Popup_ContactDetails_Address_Line1";
	}
	return "New_Solicitor_Popup_CodeLOVButton";
}


New_Solicitor_Popup_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_Name.logicOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_Name.logic = function(event)
{
	if ( event.getXPath() != New_Solicitor_Popup_Name.dataBinding )
	{
		return;
	}
	
	Services.startTransaction();
	var name = Services.getValue(New_Solicitor_Popup_Name.dataBinding);
	if ( CaseManUtils.isBlank(name) )
	{
		// Reset the data in the popup if the code field is blanked
		Services.dispatchEvent(
			"newSolicitorSubform",
			BusinessLifeCycleEvents.EVENT_MODIFY,
			{
				raiseWarningIfDOMDirty: false
			}
		);
	}
	else
	{
		// Set default payee flag to Y if Claimant
		var partyTypeCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/PartyTypeCode");
		if ( partyTypeCode == PartyTypeCodesEnum.CLAIMANT )
		{
			Services.setValue(New_Solicitor_Popup_Payee.dataBinding, "Y");
		}
		Services.setValue(New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.dataBinding, "LE");
	}
	Services.endTransaction();
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Line1() {};

New_Solicitor_Popup_ContactDetails_Address_Line1.tabIndex = 4;
New_Solicitor_Popup_ContactDetails_Address_Line1.maxLength = 35;
New_Solicitor_Popup_ContactDetails_Address_Line1.helpText = "First line of solicitor's address";
New_Solicitor_Popup_ContactDetails_Address_Line1.isMandatory = function() { return true;}
New_Solicitor_Popup_ContactDetails_Address_Line1.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line1.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line1.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line1.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Line2() {};

New_Solicitor_Popup_ContactDetails_Address_Line2.tabIndex = 5;
New_Solicitor_Popup_ContactDetails_Address_Line2.maxLength = 35;
New_Solicitor_Popup_ContactDetails_Address_Line2.helpText = "Second line of solicitor's address";
New_Solicitor_Popup_ContactDetails_Address_Line2.isMandatory = function() { return true;}
New_Solicitor_Popup_ContactDetails_Address_Line2.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line2.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line2.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line2.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Line3() {};

New_Solicitor_Popup_ContactDetails_Address_Line3.tabIndex = 6;
New_Solicitor_Popup_ContactDetails_Address_Line3.maxLength = 35;
New_Solicitor_Popup_ContactDetails_Address_Line3.helpText = "Third line of solicitor's address";
New_Solicitor_Popup_ContactDetails_Address_Line3.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line3.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line3.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line3.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Line4() {};

New_Solicitor_Popup_ContactDetails_Address_Line4.tabIndex = 7;
New_Solicitor_Popup_ContactDetails_Address_Line4.maxLength = 35;
New_Solicitor_Popup_ContactDetails_Address_Line4.helpText = "Fourth line of solicitor's address";
New_Solicitor_Popup_ContactDetails_Address_Line4.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line4.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line4.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line4.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Line5() {};

New_Solicitor_Popup_ContactDetails_Address_Line5.tabIndex = 8;
New_Solicitor_Popup_ContactDetails_Address_Line5.maxLength = 35;
New_Solicitor_Popup_ContactDetails_Address_Line5.helpText = "Fifth line of solicitor's address";
New_Solicitor_Popup_ContactDetails_Address_Line5.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line5.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Line5.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Line5.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_Address_Postcode() {};

New_Solicitor_Popup_ContactDetails_Address_Postcode.tabIndex = 9;
New_Solicitor_Popup_ContactDetails_Address_Postcode.maxLength = 8;
New_Solicitor_Popup_ContactDetails_Address_Postcode.helpText = "Postcode of the solicitor";
New_Solicitor_Popup_ContactDetails_Address_Postcode.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Postcode.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_Address_Postcode.validate = function()
{
	var value = Services.getValue(New_Solicitor_Popup_ContactDetails_Address_Postcode.dataBinding);
	if( !CaseManValidationHelper.validatePostCode(value) ) 
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

New_Solicitor_Popup_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_Address_Postcode.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_Address_Postcode.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_DX() {};

New_Solicitor_Popup_ContactDetails_DX.tabIndex = 10;
New_Solicitor_Popup_ContactDetails_DX.maxLength = 35;
New_Solicitor_Popup_ContactDetails_DX.helpText = "Document exchange reference number of the solicitor";
New_Solicitor_Popup_ContactDetails_DX.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_DX.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_DX.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_DX.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_DX.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_DX.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_TelephoneNumber() {};

New_Solicitor_Popup_ContactDetails_TelephoneNumber.tabIndex = 11;
New_Solicitor_Popup_ContactDetails_TelephoneNumber.maxLength = 24;
New_Solicitor_Popup_ContactDetails_TelephoneNumber.helpText = "Solicitor's telephone number";
New_Solicitor_Popup_ContactDetails_TelephoneNumber.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_TelephoneNumber.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_TelephoneNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_TelephoneNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_TelephoneNumber.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_TelephoneNumber.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_FaxNumber() {};

New_Solicitor_Popup_ContactDetails_FaxNumber.tabIndex = 12;
New_Solicitor_Popup_ContactDetails_FaxNumber.maxLength = 24;
New_Solicitor_Popup_ContactDetails_FaxNumber.helpText = "Solicitor's fax number";
New_Solicitor_Popup_ContactDetails_FaxNumber.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_FaxNumber.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_FaxNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_FaxNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_ContactDetails_FaxNumber.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_FaxNumber.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_EmailAddress() {};

New_Solicitor_Popup_ContactDetails_EmailAddress.tabIndex = 13;
New_Solicitor_Popup_ContactDetails_EmailAddress.maxLength = 80;
New_Solicitor_Popup_ContactDetails_EmailAddress.helpText = "Solicitor's email address";
New_Solicitor_Popup_ContactDetails_EmailAddress.readOnlyOn = [New_Solicitor_Popup_Code.dataBinding];
New_Solicitor_Popup_ContactDetails_EmailAddress.isReadOnly = newSolicitorReadOnlyFields;

New_Solicitor_Popup_ContactDetails_EmailAddress.validate = function()
{
	return CaseManValidationHelper.validatePattern(
				Services.getValue(New_Solicitor_Popup_ContactDetails_EmailAddress.dataBinding), 
				CaseManValidationHelper.EMAIL_PATTERN, 
				"CaseMan_invalidEmailAddress_Msg"
		   );
}

New_Solicitor_Popup_ContactDetails_EmailAddress.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_EmailAddress.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication() {};

New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.rowXPath = "/Method";
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.keyXPath = "/Id";
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.displayXPath = "/Name";

New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.tabIndex = 14;
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.helpText = "Select the preferred communication method of the solicitor";

New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_ContactDetails_PreferredMethodOfCommunication.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_Reference() {};

New_Solicitor_Popup_Reference.tabIndex = 15;
New_Solicitor_Popup_Reference.maxLength = 24;
New_Solicitor_Popup_Reference.helpText = "Solicitors Reference Number";

New_Solicitor_Popup_Reference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

New_Solicitor_Popup_Reference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

New_Solicitor_Popup_Reference.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_Reference.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding));
}

/*********************************************************************************/

function New_Solicitor_Popup_Payee() {};

New_Solicitor_Popup_Payee.tabIndex = 16;
New_Solicitor_Popup_Payee.helpText = "Tick box if solicitor is Payee or clear if claimant is Payee";
New_Solicitor_Popup_Payee.modelValue = {checked: "Y", unchecked: "N"}; 

New_Solicitor_Popup_Payee.enableOn = [New_Solicitor_Popup_Name.dataBinding];
New_Solicitor_Popup_Payee.isEnabled = function()
{
	if (CaseManUtils.isBlank(Services.getValue(New_Solicitor_Popup_Name.dataBinding)))
	{
		return false;
	}
	// Enabled if the party type is a claimant
	var partyTypeCode = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/PartyTypeCode");
	return ( partyTypeCode == PartyTypeCodesEnum.CLAIMANT ) ? true : false;
}

/****************************** BUTTON FIELDS **************************************/

function New_Solicitor_Popup_CodeLOVButton() {};
New_Solicitor_Popup_CodeLOVButton.tabIndex = 3;

/**********************************************************************************/

function New_Solicitor_Popup_OkButton() {}
New_Solicitor_Popup_OkButton.tabIndex = 20;

/**********************************************************************************/

function New_Solicitor_Popup_CancelButton() {}
New_Solicitor_Popup_CancelButton.tabIndex = 21;
