/** 
 * @fileoverview MaintainLocalCodedParties_AuditCode.js:
 * Configurations for the UC017 (Maintain Local Coded Parties) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_Close"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_Close";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Hearing Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedCodedPartyPanel() {}

currentlySelectedCodedPartyPanel.panelName = "Currently Selected Coded Party";
currentlySelectedCodedPartyPanel.auditTables = [
	{ 
		tableName: "CODED_PARTIES", 
		keys: [ 
				{ xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Code" },
				{ xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/CourtCode" }
			  ] 
	},
	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/ContactDetails/Address/AddressId" } ] }
];

currentlySelectedCodedPartyPanel.enableOn = [Results_ResultsGrid.dataBinding];
currentlySelectedCodedPartyPanel.isEnabled = function()
{
	// Disabled if Grid databinding is blank
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
