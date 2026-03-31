/** 
 * @fileoverview MaintainCO_AuditCode.js:
 * Configurations for the UC108 (Create/Maintain CO) Audit Adaptors
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

function headerPanel() {}

headerPanel.panelName = "Header Panel";
headerPanel.auditTables = [
	{ tableName: "CONSOLIDATED_ORDERS", keys: [ { xpath: Header_CONumber.dataBinding } ] }
];

headerPanel.enableOn = [Header_CONumber.dataBinding];
headerPanel.isEnabled = function()
{
	// Disabled if no CO record loaded
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	return ( CaseManUtils.isBlank(coNumber) ) ? false : true;
}

/**********************************************************************************/

function coDetailsPanel() {}

coDetailsPanel.panelName = "CO Details";
coDetailsPanel.auditTables = [
	{ tableName: "CONSOLIDATED_ORDERS", keys: [ { xpath: Header_CONumber.dataBinding } ] }
];

coDetailsPanel.enableOn = [Header_CONumber.dataBinding];
coDetailsPanel.isEnabled = function()
{
	// Disabled if no CO record loaded
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	return ( CaseManUtils.isBlank(coNumber) ) ? false : true;
}

/**********************************************************************************/

function debtorDetailsPanel() {}

debtorDetailsPanel.panelName = "Debtor Details";
debtorDetailsPanel.auditTables = [
	{ tableName: "PARTIES", keys: [ { xpath: "/ds/MaintainCO/Debtor/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: "/ds/MaintainCO/Debtor/Address/AddressId" } ] }
];

debtorDetailsPanel.enableOn = [Header_CONumber.dataBinding, "/ds/MaintainCO/Debtor/PartyId"];
debtorDetailsPanel.isEnabled = function()
{
	// Disabled if no CO record loaded or no Debtor details exist
	var debtorId = Services.getValue("/ds/MaintainCO/Debtor/PartyId");
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	return ( CaseManUtils.isBlank(coNumber) || CaseManUtils.isBlank(debtorId) ) ? false : true;
}

/**********************************************************************************/

function employmentDetailsPanel() {}

employmentDetailsPanel.panelName = "Employment Details";
employmentDetailsPanel.auditTables = [
	{ tableName: "PARTIES", keys: [ { xpath: "/ds/MaintainCO/Employer/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: "/ds/MaintainCO/Employer/Address/AddressId" } ] }
];

employmentDetailsPanel.enableOn = [Header_CONumber.dataBinding, "/ds/MaintainCO/Employer/PartyId"];
employmentDetailsPanel.isEnabled = function()
{
	// Disabled if no CO record loaded or no Employment details exist
	var employerId = Services.getValue("/ds/MaintainCO/Employer/PartyId");
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	return ( CaseManUtils.isBlank(coNumber) || CaseManUtils.isBlank(employerId) ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
