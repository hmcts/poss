/** 
 * @fileoverview ManageAE_AuditCode.js:
 * Configurations for the UC091 (Manage AE) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_SaveBtn"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveBtn";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

function aeDetailsPanel() {}

aeDetailsPanel.panelName = "AE Details";
aeDetailsPanel.auditTables = [
	{ tableName: "AE_APPLICATIONS", keys: [ { xpath: AEDetails_AENumber.dataBinding } ] }
];

aeDetailsPanel.enableOn = [AEDetails_ExistingAEsLov.dataBinding];
aeDetailsPanel.isEnabled = isExistingAERecord;

/**********************************************************************************/

function serviceDetailsPanel() {}

serviceDetailsPanel.panelName = "Service Details";
serviceDetailsPanel.auditTables = [
	{ tableName: "PARTIES", keys: [ { xpath: Header_Party_Against.dataBinding } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[TypeCode = 'SERVICE' and ValidTo = '']/AddressId" } ] }
];

serviceDetailsPanel.enableOn = [AEDetails_ExistingAEsLov.dataBinding];
serviceDetailsPanel.isEnabled = isExistingAERecord;

/**********************************************************************************/

function employmentDetailsPanel() {}

employmentDetailsPanel.panelName = "Employment Details";
employmentDetailsPanel.auditTables = [
	{ tableName: "PARTIES", keys: [ { xpath: XPathConstants.SELECTED_AE_XPATH + "/Employer/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[TypeCode = 'EMPLOYER' and ValidTo = '']/AddressId" } ] }
];

employmentDetailsPanel.enableOn = [AEDetails_ExistingAEsLov.dataBinding, XPathConstants.SELECTED_AE_XPATH + "/Employer/PartyId"];
employmentDetailsPanel.isEnabled = function()
{
	// Disabled if not an existing AE Record or no employer details
	var empId = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/PartyId");
	return ( !isExistingAERecord() || CaseManUtils.isBlank(empId) ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
