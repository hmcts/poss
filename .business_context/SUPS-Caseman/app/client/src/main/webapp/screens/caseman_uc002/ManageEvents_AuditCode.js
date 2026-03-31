/** 
 * @fileoverview ManageEvents_AuditCode.js:
 * Configurations for the UC002 (Manage Case Events) Audit Adaptors
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
 * Currently Selected Event Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedEventPanel() {}

currentlySelectedEventPanel.panelName = "Currently Selected Event";
currentlySelectedEventPanel.auditTables = [
	{ tableName: "CASE_EVENTS", keys: [ { xpath: Master_EventGrid.dataBinding } ] }
];

currentlySelectedEventPanel.enableOn = [XPathConstants.DATA_XPATH + "/CaseNumber", XPathConstants.CASE_EXISTS_XPATH];
currentlySelectedEventPanel.isEnabled = function()
{
	// Disabled if not an existing Case
	// Will never be no Case Events - will always be at least Event 1
	return caseExists();
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
