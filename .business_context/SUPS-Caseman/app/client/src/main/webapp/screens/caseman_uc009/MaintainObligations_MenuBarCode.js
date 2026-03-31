/** 
 * @fileoverview MaintainObligations_MenuBarCode.js:
 * Configurations for the UC009 (Maintain Obligations) Navigation Buttons
 *
 * @author Chris Vincent
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_AuditButton",
			label: "Audit",
			subformId: "auditSubform",
/**
 * @author rzxd7g
 * 
 */
			guard: function() { return false; },
			onMenuBar: true
		}
	]
}
