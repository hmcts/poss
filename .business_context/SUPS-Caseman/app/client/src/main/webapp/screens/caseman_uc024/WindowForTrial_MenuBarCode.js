/** 
 * @fileoverview WindowForTrial_MenuBarCode.js:
 * Configurations for the UC024 (Maintain Window for Trial) Navigation Buttons
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
