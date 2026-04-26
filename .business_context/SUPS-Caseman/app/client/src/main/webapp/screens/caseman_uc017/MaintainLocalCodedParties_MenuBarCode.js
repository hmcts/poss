/** 
 * @fileoverview MaintainLocalCodedParties_MenuBarCode.js:
 * Configurations for the UC017 (Maintain Local Coded Parties) Navigation Buttons
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
