/** 
 * @fileoverview MaintainCourtData_AuditCode.js:
 * Configurations for the UC120 (Maintain Court Data) Audit Adaptors
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

function courtDataPanel() {}

courtDataPanel.panelName = "Court Data";
courtDataPanel.auditTables = [
	{ 
		tableName: "COURTS", 
		keys: [ 
				{ xpath: Query_Court_Code.dataBinding }
			  ] 
	},
	{ 
		tableName: "PERSONALISE", 
		keys: [ 
				{ xpath: Query_Court_Code.dataBinding }
			  ] 
	}
];

courtDataPanel.enableOn = [XPathConstants.FORM_STATE_XPATH];
courtDataPanel.isEnabled = isCourtRecordLoaded;

/**********************************************************************************/

function currentlySelectedAddressPanel() {}

currentlySelectedAddressPanel.panelName = "Currently Selected Court Address";
currentlySelectedAddressPanel.auditTables = [
	{ 
		tableName: "GIVEN_ADDRESSES", 
		keys: [ 
				{ xpath: XPathConstants.SELECTED_ADDRESS_XPATH + "/AddressId" }
			  ] 
	}
];

currentlySelectedAddressPanel.enableOn = [Master_CourtAddressGrid.dataBinding];
currentlySelectedAddressPanel.isEnabled = function()
{
	if ( isAddressGridEmpty() )
	{
		// Disabled if the address grid is empty
		return false;
	}

	var addressId = Services.getValue(XPathConstants.SELECTED_ADDRESS_XPATH + "/AddressId");
	if ( CaseManUtils.isBlank(addressId) )
	{
		// Disabled if address has not been persisted to the database yet
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
