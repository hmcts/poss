/** 
 * @fileoverview ViewPayments_AuditCode.js:
 * Configurations for the UC110 (View Payments) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_CloseButton"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_CloseButton";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Payment
 * @author rzxd7g
 * 
 */
function currentlySelectedPaymentPanel() {}

currentlySelectedPaymentPanel.panelName = "Currently Selected Payment";
currentlySelectedPaymentPanel.auditTables = [
	{ tableName: "PAYMENTS", 
	  keys: [ 
		{ xpath: XPathConstants.PAYMENTS_XPATH + "/Payment[./Id = " + Master_PaymentsGrid.dataBinding + "]/TransactionNumber" },
		{ xpath: XPathConstants.ENFORCEMENT_XPATH + "/CourtCode" }
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
