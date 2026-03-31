/** 
 * @fileoverview MaintainCourtData_MenuBarCode.js:
 * Configurations for the UC120 (Maintain Court Data) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * Change History
 * 08/11/2011 - Chris Vincent, added the Change Court Name subform to the menubar. Trac 4591.
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_AuditButton",
			label: "Audit",
			subformId: "auditSubform",
			guard: function() { return false; },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm("auditSubform"); }
		},
		{
			id: "NavBar_ChangeCourtNameButton",
			subformId: "changeCourtName_subform",
			label: "Change Court Name",
			guard:  function() 
					{
						var blnEnabled = false;
					
						if ( isCourtRecordLoaded() )
						{
							// Only load subform if a Court is loaded
							if ( isDataDirty() )
							{
								// Data dirty, force user to save before opening subform to change name.
								alert(Messages.SAVE_BEFORE_PROCEED_MESSAGE);
							}
							else
							{
								// Data not dirty, launch the subform
								blnEnabled = true;
							}
						}
						else
						{
							// Court not loaded, set error message
							var ec = ErrorCode.getErrorCode("CaseMan_cannotChangeCourtName_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	return blnEnabled;
					},
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm("ChangeCourtNameSubform"); }
		}
	]
}
