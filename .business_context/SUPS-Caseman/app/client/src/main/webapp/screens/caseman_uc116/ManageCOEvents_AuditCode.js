/** 
 * @fileoverview ManageCOEvents_AuditCode.js:
 * Configurations for the UC116 (Manage CO Events) Audit Adaptors
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
 * Currently Selected CO Event Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedEventPanel() {}

currentlySelectedEventPanel.panelName = "Currently Selected Event";
currentlySelectedEventPanel.auditTables = [
	{ tableName: "CO_EVENTS", keys: [ { xpath: Master_COEventGrid.dataBinding } ] }
];

currentlySelectedEventPanel.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.srcData];
currentlySelectedEventPanel.isEnabled = function()
{
	// Disabled if no CO loaded or no CO Events exist
	if ( !isCORecordLoaded() || isEventGridEmpty() )
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
