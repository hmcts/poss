/** 
 * @fileoverview ReissueWarrants_MenuBarCode.js:
 * Configurations for the UC031 (Reissue Warrants) Navigation Buttons
 *
 * @author Chris Vincent
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_CaseEventsButton",
			formName: NavigationController.EVENTS_FORM,
			label: "Events",
			guard:   function() 
					 {
					    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
					    if( CaseManUtils.isBlank(caseNumber) ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.REISSUE_WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						    Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
							Status_SaveButton.actionBinding();
							return false;
						}
					    
					    return true;
					 },
			prepare: function() 
					 {
						// Set the Manage Case Events parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
					    Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Reissue Warrants screen
						var navArray = new Array( NavigationController.REISSUE_WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_WarrantReturnsButton",
			formName: NavigationController.WARRANT_RETURNS_FORM,
			label: "Warrant Returns",
			guard:   function() 
					 {
					    var warrantID = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantID");
					    if( CaseManUtils.isBlank(warrantID) ) 
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWarrantReturnsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_RETURNS_FORM, NavigationController.REISSUE_WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(WarrantReturnsParams.WARRANT_ID, warrantID);
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
							Status_SaveButton.actionBinding();
							return false;
						}
					    
					    return true;
					 },
			prepare: function() 
					 {
						// Set the Warrant Returns parameters
						var warrantID = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantID");
						Services.setValue(WarrantReturnsParams.WARRANT_ID, warrantID);

						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.REISSUE_WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		}
	]
}