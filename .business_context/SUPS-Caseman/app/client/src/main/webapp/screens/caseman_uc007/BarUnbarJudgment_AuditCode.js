/** 
 * @fileoverview BarUnbarJudgment_AuditCode.js:
 * Configurations for the UC007 (Maintain Bar on Judgment) Audit Adaptors
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
 * Currently Selected Hearing Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedDefendantPanel() {}
currentlySelectedDefendantPanel.panelName = "Currently Selected Party";
currentlySelectedDefendantPanel.auditTables = [
	{ tableName: "CASE_PARTY_ROLES", 
	  keys: [ 
				{ xpath: CaseDetail_CaseNumber.dataBinding },
				{ xpath: XPathConstants.DATA_XPATH + "/Defendants/Defendant[./PartyID = " + Defendants_ResultsGrid.dataBinding + "]/CasePartyNumber" },
				{ xpath: XPathConstants.DATA_XPATH + "/Defendants/Defendant[./PartyID = " + Defendants_ResultsGrid.dataBinding + "]/PartyRole" }
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
