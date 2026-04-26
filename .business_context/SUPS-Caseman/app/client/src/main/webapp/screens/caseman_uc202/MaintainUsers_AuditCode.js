/** 
 * @fileoverview MaintainUsers_AuditCode.js:
 * Configurations for the UC202 (Maintain Users) Audit Adaptors
 *
 * @author Chris Vincent
 */

/**
* @changes
* 23-01-2009 Sandeep Mullangi - Audit Log to USER_ROLE table, RFC 521
*/

/****************************** AUDIT SUBFORM **************************************/

function audit_subform() {}

audit_subform.subformName = "auditSubform";
/**
 * @author rzxd7g
 * @return "Status_SaveBtn"  
 */
audit_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveBtn";
}

/*************************** AUDIT PANEL ADAPTORS *********************************/

/**
 * Currently Selected Event Panel
 * @author rzxd7g
 * 
 */
function currentlySelectedUser() {}

currentlySelectedUser.panelName = "Currently Selected User";
currentlySelectedUser.auditTables = [
	{ tableName: "DCA_USER", keys: [ { xpath: Header_UserId.dataBinding } ] },
	{ tableName: "USER_COURT", 
	  keys: [ 
				{ xpath: Header_UserId.dataBinding },
				{ xpath: Header_CourtCode.dataBinding }
			] 
	},
	{ tableName: "USER_ROLE", 
	  keys: [ 
				{ xpath: Header_UserId.dataBinding },
				{ xpath: Header_CourtCode.dataBinding }
			] 
	}
];

currentlySelectedUser.enableOn = [XPathConstants.USERID_ENABLER_XPATH];
currentlySelectedUser.isEnabled = function()
{
	var enabler = Services.getValue(XPathConstants.USERID_ENABLER_XPATH);
	return ( enabler == "true" ) ? false : true;
}

/********************* AUDIT SELECTION PANEL ADAPTOR ******************************/

/**
 * The Audit Dropdown displayed when click Audit Button
 * @author rzxd7g
 * 
 */
function Audit_PanelSelector() {}
Audit_PanelSelector.auditButtonId = "NavBar_AuditButton";
