/** 
 * @fileoverview MaintainNationalCodedParties_AuditCode.js:
 * Configurations for the UC121 (Maintain National Coded Parties) Audit Adaptors
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 05/01/2007 - Chris Vincent, Added Default Claimant audit panel and changed panel titles.
 * 				UCT_Group2 Defect 1099.
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
 * Currently Selected Coded Party Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedCodedPartyPanel() {}

currentlySelectedCodedPartyPanel.panelName = "Currently Selected Coded Party Details / CCBC Details";
currentlySelectedCodedPartyPanel.auditTables = [
	{ 
		tableName: "CODED_PARTIES", 
		keys: [ 
				{ xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Code" },
				{ xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/CourtCode" }
			  ] 
	},
	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/AddressId" } ] },
	{ tableName: "NATIONAL_CODED_PARTIES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Code" } ] }
];

currentlySelectedCodedPartyPanel.enableOn = [Results_ResultsGrid.dataBinding];
currentlySelectedCodedPartyPanel.isEnabled = function()
{
	// Disabled if Grid databinding is blank
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	return ( CaseManUtils.isBlank(gridDB) ) ? false : true;
}

/**********************************************************************************/

/**
 * Currently Selected Coded Party Payee Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedCodedPartyPayeePanel() {}

currentlySelectedCodedPartyPayeePanel.panelName = "Currently Selected Payee Details / Bank Details";
currentlySelectedCodedPartyPayeePanel.auditTables = [
	{ tableName: "PAYEES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Payee/PayeeId" } ] },
	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Payee/PayeeId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Payee/AddressId" } ] }
];

currentlySelectedCodedPartyPayeePanel.enableOn = [Results_ResultsGrid.dataBinding, XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Payee/PayeeId"];
currentlySelectedCodedPartyPayeePanel.isEnabled = function()
{
	// Disabled if Grid databinding is blank (i.e. no record selected)
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		return false;
	}
	
	// Disabled if either of the Payee Id or Payee Address Id are blank (i.e. no payee attached to the coded party)
	var rootXPath = XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/Payee";
	var payeeId = Services.getValue(rootXPath + "/PayeeId");
	var payeeAddressId = Services.getValue(rootXPath + "/AddressId");
	if ( CaseManUtils.isBlank(payeeId) || CaseManUtils.isBlank(payeeAddressId) )
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

/**
 * Currently Selected Coded Party Default Claimant Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedCodedPartyDefaultClaimantPanel() {}

currentlySelectedCodedPartyDefaultClaimantPanel.panelName = "Currently Selected Default Claimant";
currentlySelectedCodedPartyDefaultClaimantPanel.auditTables = [
	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/DefaultClaimant/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/DefaultClaimant/AddressId" } ] }
];

currentlySelectedCodedPartyDefaultClaimantPanel.enableOn = [Results_ResultsGrid.dataBinding, XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/DefaultClaimant/PartyId"];
currentlySelectedCodedPartyDefaultClaimantPanel.isEnabled = function()
{
	// Disabled if Grid databinding is blank (i.e. no record selected)
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		return false;
	}
	
	// Disabled if either of the Default Claimant Party Id or Address Id are blank 
	// (i.e. no default claimant attached to the coded party)
	var rootXPath = XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty[./Code = " + Results_ResultsGrid.dataBinding + "]/DefaultClaimant";
	var partyId = Services.getValue(rootXPath + "/PartyId");
	var addressId = Services.getValue(rootXPath + "/AddressId");
	if ( CaseManUtils.isBlank(partyId) || CaseManUtils.isBlank(addressId) )
	{
		return false;
	}
	return true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
