/** 
 * @fileoverview WindowForTrial_AuditCode.js:
 * Configurations for the UC024 (Maintain Window for Trial) Audit Adaptors
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
function currentlySelectedWFTPanel() {}

currentlySelectedWFTPanel.panelName = "Currently Selected Window for Trial";
currentlySelectedWFTPanel.auditTables = [
	{ 
		tableName: "WINDOW_FOR_TRIAL", 
		keys: [ 
				{ xpath: XPathConstants.WFT_XPATH + "/CaseNumber" },
				{ xpath: Master_WindowForTrialGrid.dataBinding }
			  ] 
	}
];

currentlySelectedWFTPanel.enableOn = [Master_WindowForTrialGrid.dataBinding, XPathConstants.WFT_XPATH + "/Status"];
currentlySelectedWFTPanel.isEnabled = function()
{
	// Disabled if the WFT Grid dataBinding is blank
	var gridDB = Services.getValue(Master_WindowForTrialGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDB) )
	{
		return false;
	}	
	
	// Disabled if the current WFT is new
	var wftStatus = Services.getValue(XPathConstants.WFT_XPATH + "/Status");
	return ( wftStatus == FormConstants.STATUS_NEW ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}

Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
