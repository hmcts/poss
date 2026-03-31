/** 
 * @fileoverview MaintainJudgment_AuditCode.js:
 * Configurations for the UC004 (Maintain Judgments) Audit Adaptors
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
 * Currently Selected Event Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedJudgmentAgainstPanel() {}

currentlySelectedJudgmentAgainstPanel.panelName = "Currently Selected Judgment Against";
currentlySelectedJudgmentAgainstPanel.auditTables = [
	{ tableName: "JUDGMENTS", keys: [ { xpath: Master_AgainstGrid.dataBinding } ] }
];

currentlySelectedJudgmentAgainstPanel.enableOn = [Master_AgainstGrid.dataBinding];
currentlySelectedJudgmentAgainstPanel.isEnabled = function()
{
	// Disabled if no Judgments exist
	var gridDB = Services.getValue(Master_AgainstGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		return false;
	}
	
	// Disabled if the Judgment is new (hasn't been saved yet)
	var JudgmentId = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/JudgmentId");
	return ( CaseManUtils.isBlank(JudgmentId) ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
