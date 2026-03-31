/** 
 * @fileoverview MaintainWarrants_AuditCode.js:
 * Configurations for the UC039 (Maintain Warrants) Audit Adaptors
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

function partyAgainstPanel() {}

partyAgainstPanel.panelName = "Party Against";
partyAgainstPanel.auditTables = [
	{ tableName: "WARRANTS", keys: [ { xpath: XPathConstants.WARRANT_ID_XPATH } ] }
];

partyAgainstPanel.enableOn = [XPathConstants.WARRANT_ID_XPATH];
partyAgainstPanel.isEnabled = function()
{
	// Disabled if no warrant record loaded
	return isWarrantFound();
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
