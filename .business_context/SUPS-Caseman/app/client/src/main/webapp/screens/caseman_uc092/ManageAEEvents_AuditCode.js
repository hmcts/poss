/** 
 * @fileoverview ManageAEEvents_AuditCode.js:
 * Configurations for the UC092 (Manage AE Events) Audit Adaptors
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
 * PER / NDR Details Panel
 * @author rzxd7g
 * 
 */
function PERNDRPanel() {}

PERNDRPanel.panelName = "PER/NDR Details";
PERNDRPanel.auditTables = [
	{ tableName: "AE_APPLICATIONS", keys: [ { xpath: Query_AENumber.dataBinding } ] }
];

PERNDRPanel.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERNDRPanel.isEnabled = function()
{
	// Disabled if no AE record loaded
	return isAERecordLoaded();
}

/**********************************************************************************/

/**
 * Currently Selected AE Event Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedEventPanel() {}

currentlySelectedEventPanel.panelName = "Currently Selected Event";
currentlySelectedEventPanel.auditTables = [
	{ tableName: "AE_EVENTS", keys: [ { xpath: Master_AEEventGrid.dataBinding } ] }
];

currentlySelectedEventPanel.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.srcData];
currentlySelectedEventPanel.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
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
