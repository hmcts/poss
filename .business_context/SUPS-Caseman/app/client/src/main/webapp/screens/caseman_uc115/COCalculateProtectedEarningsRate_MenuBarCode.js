/** 
 * @fileoverview COCalculateProtectedEarningsRate_MenuBarCode.js:
 * Configurations for the UC115 (PER Calculator) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * Change History:
 * 20/06/2006 - Chris Vincent, Added dirty flag check to the PER Report 
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_PerReportButton",
			formName: NavigationController.MAIN_MENU,
			label: "PER Report",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	function() 
					{
					 	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
					 	{
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_RUNPERREPORT);
					 		Status_SaveBtn.actionBinding();
					 	}
					 	else
					 	{
					 		// No changes or ignore changes before running report
							runCOPERReport();
						}
						return false;
					},
			onMenuBar: true
		}
	]
}
