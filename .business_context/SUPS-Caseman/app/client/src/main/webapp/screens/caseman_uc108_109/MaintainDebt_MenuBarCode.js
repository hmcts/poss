/** 
 * @fileoverview MaintainDebt_MenuBarCode.js:
 * Configurations for the UC109 (Manage CO Debts) Navigation Buttons
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
