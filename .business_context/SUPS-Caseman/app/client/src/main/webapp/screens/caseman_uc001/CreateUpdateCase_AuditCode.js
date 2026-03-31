/** 
 * @fileoverview CreateUpdateCase_AuditCode.js:
 * Configurations for the UC001 (Create Case) Audit Adaptors
 *
 * @author Chris Vincent
 */

/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Header Panel
 * @author rzxd7g
 * 
 */
function headerPanel() {}

headerPanel.panelName = "Header Panel";
headerPanel.auditTables = [
	{ tableName: "CASES", keys: [ { xpath: XPathConstants.DATA_XPATH + "/CaseNumber" } ] }
];

headerPanel.enableOn = [XPathConstants.CASE_STATUS];
headerPanel.isEnabled = function()
{
	// Disabled if not an existing Case
	return isExistingCase();
}

/**********************************************************************************/

/**
 * Master Details Panel (Currently Selected Party)
 * @author rzxd7g
 * 
 */
function masterDetailsPanel() {}

masterDetailsPanel.panelName = "Currently Selected Party";
masterDetailsPanel.auditTables = [

	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.TMP_AUDIT_XPATH + "/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.TMP_AUDIT_XPATH + "/AddressId" } ] },
	{ tableName: "PARTY_ROLES", keys: [ { xpath: XPathConstants.TMP_AUDIT_XPATH + "/TypeCode" } ] },
	{ tableName: "CASE_PARTY_ROLES", 
	  keys: [ 
				{ xpath: XPathConstants.DATA_XPATH + "/CaseNumber" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/Number" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/TypeCode" }
			] 
	},
	// Relationship below will always be a litigious party represented by a solicitor
	{ tableName: "CPR_TO_CPR_RELATIONSHIP", 
	  keys: [ 
				{ xpath: XPathConstants.DATA_XPATH + "/CaseNumber" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/Number" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/TypeCode" },
				{ xpath: XPathConstants.DATA_XPATH + "/CaseNumber" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/SolNumber" },
				{ xpath: XPathConstants.TMP_AUDIT_XPATH + "/SolTypeCode" }
			] 
	}
];

masterDetailsPanel.enableOn = [XPathConstants.CASE_STATUS, masterGrid.dataBinding];
masterDetailsPanel.isEnabled = function()
{
	if ( !isExistingCase() )
	{
		// Disabled if no case loaded
		return false;
	}
	
	// Get the currently selected party's Status xpath
	var xp = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status";
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		xp = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status";
	}
	
	// Panel disabled if currently selected party is new
	return ( Services.getValue(xp) == FormConstants.STATUS_NEW ) ? false : true;
}

masterDetailsPanel.logicOn = [masterGrid.dataBinding];
masterDetailsPanel.logic = function(event)
{
	if ( event.getXPath() != masterGrid.dataBinding )
	{
		return;
	}
	
	// Because the xpath can differ depending upon whether the currently selected party is a solicitor or not
	// the values required for audit key xpaths need to put copied to a temp xpath
	var rootXPath = ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR ) ? XPathConstants.SOLICITOR_DATA_BINDING_ROOT : XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT;
	rootXPath = rootXPath + masterGrid.dataBinding + "]";
	
	Services.startTransaction();
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/PartyId", Services.getValue(rootXPath + "/PartyId") );
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/AddressId", Services.getValue(rootXPath + "/ContactDetails/Address/AddressId") );
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/TypeCode", Services.getValue(rootXPath + "/TypeCode") );
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/Number", Services.getValue(rootXPath + "/Number") );
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/SolTypeCode", Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + rootXPath + "/SolicitorSurrogateId]/TypeCode") );
	Services.setValue(XPathConstants.TMP_AUDIT_XPATH + "/SolNumber", Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + rootXPath + "/SolicitorSurrogateId]/Number") );
	Services.endTransaction();
}

/**********************************************************************************/

/**
 * Other Possession Address Panel
 * @author rzxd7g
 * 
 */
function otherPossessionAddressPanel() {}

otherPossessionAddressPanel.panelName = "Other Possession Address";
otherPossessionAddressPanel.auditTables = [
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.OTHER_POSSESSION_ADDRESS_XPATH + "/AddressId" } ] }
];

otherPossessionAddressPanel.enableOn = [XPathConstants.CASE_STATUS, Header_CaseType.dataBinding];
otherPossessionAddressPanel.isEnabled = function()
{
	if ( !isExistingCase() )
	{
		// Disabled if not an existing case
		return false;
	}
	// Enabled depending upon Case Type
	return enableButton("Footer_OtherPossessionAddressButton");
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
