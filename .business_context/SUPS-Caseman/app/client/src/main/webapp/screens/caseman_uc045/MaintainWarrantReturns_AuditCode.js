/** 
 * @fileoverview MaintainWarrantReturns_AuditCode.js:
 * Configurations for the UC045 (Manage Warrant Returns) Audit Adaptors
 *
 * @author Chris Vincent
 */
 
/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_Save_Btn"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_Save_Btn";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Warrant Return Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedWarrantReturnPanel() {}

currentlySelectedWarrantReturnPanel.panelName = "Currently Selected Warrant Return";
currentlySelectedWarrantReturnPanel.auditTables = [
	{ tableName: "WARRANT_RETURNS", 
	  keys: [ { xpath: "/ds/WarrantReturns/WarrantEvents/WarrantEvent[./SurrogateKey = " + Details_Results_Grid.dataBinding + "]/WarrantReturnsID" } ]
	}
];

currentlySelectedWarrantReturnPanel.enableOn = [Details_Results_Grid.dataBinding, Header_WarrantID_Txt.dataBinding];
currentlySelectedWarrantReturnPanel.isEnabled = function()
{
	// Disabled if no warrant record loaded or no warrant returns exist
	var warrantId = Services.getValue(Header_WarrantID_Txt.dataBinding);
	var gridDB = Services.getValue(Details_Results_Grid.dataBinding);
	if ( CaseManUtils.isBlank(warrantId) || CaseManUtils.isBlank(gridDB) )
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
