/** 
 * @fileoverview MaintainDebt_AuditCode.js:
 * Configurations for the UC109 (Manage CO Debts) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_Close"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_Close";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Hearing Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedDebtPanel() {}

currentlySelectedDebtPanel.panelName = "Currently Selected Debt";
currentlySelectedDebtPanel.auditTables = [
	{ tableName: "ALLOWED_DEBTS", keys: [ { xpath: MaintainDebt_DebtGrid.dataBinding } ] },
	{ tableName: "PARTIES", keys: [ { xpath: "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/PartyId" } ] },
	{ tableName: "GIVEN_ADDRESSES", keys: [ { xpath: "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/AddressId" } ] }
];

currentlySelectedDebtPanel.enableOn = [MaintainDebt_DebtGrid.dataBinding];
currentlySelectedDebtPanel.isEnabled = function()
{
	if ( Services.countNodes(MaintainDebt_DebtGrid.srcData + "/Debt") == 0 )
	{
		// No debts exist, disable panel
		return false;
	}
	
	var debtSeq = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtSeq");
	if ( CaseManUtils.isBlank(debtSeq) )
	{
		// The currently selected debt has no DebtSeq value so must be new, disable panel
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
