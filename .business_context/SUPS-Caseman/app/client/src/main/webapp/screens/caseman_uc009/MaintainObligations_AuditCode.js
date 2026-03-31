/** 
 * @fileoverview MaintainObligations_AuditCode.js:
 * Configurations for the UC009 (Maintain Obligations) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_Save"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_Save";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Hearing Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedObligationPanel() {}

currentlySelectedObligationPanel.panelName = "Currently Selected Obligation";
currentlySelectedObligationPanel.auditTables = [
	{ 
		tableName: "OBLIGATIONS", 
		keys: [ 
				{ xpath: Master_ObligationsGrid.dataBinding },
				{ xpath: Header_CaseNumber.dataBinding } 
			  ] 
	}
];

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
