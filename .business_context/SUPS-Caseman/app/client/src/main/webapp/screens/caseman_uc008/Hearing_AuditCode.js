/** 
 * @fileoverview Hearing_AuditCode.js:
 * Configurations for the UC008 (Maintain Hearings (Case & CO)) Audit Adaptors
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
function currentlySelectedHearingPanel() {}

currentlySelectedHearingPanel.panelName = "Currently Selected Hearing";
currentlySelectedHearingPanel.auditTables = [
	{ tableName: "HEARINGS", keys: [ { xpath: XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingID" } ] }
];

currentlySelectedHearingPanel.enableOn = [XPathConstants.HEARING_PATH, Master_HearingsListGrid.dataBinding];
currentlySelectedHearingPanel.isEnabled = function()
{
	// Will always be passed a Case Number / CO Number
	// Disabled if no Hearings exist or the currently selected hearing is new
	if ( Services.countNodes(XPathConstants.HEARING_PATH) == 0 )
	{
		return false;
	}
	
	var currentHearingId = Services.getValue(XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingID");
	return ( CaseManUtils.isBlank(currentHearingId) ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
