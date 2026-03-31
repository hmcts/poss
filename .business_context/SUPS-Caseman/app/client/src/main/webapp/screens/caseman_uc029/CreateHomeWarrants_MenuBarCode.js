/** 
 * @fileoverview CreateHomeWarrants_MenuBarCode.js:
 * Configurations for the UC029 (Create Home Warrants) Navigation Buttons
 *
 * @author Chris Vincent
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_CasesButton",
			formName: NavigationController.CASES_FORM,
			label: "Cases",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
					    if( CaseManUtils.isBlank(caseNumber) || !Services.getAdaptorById("Header_CaseNumber").getValid() ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCasesScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.CASES_FORM, NavigationController.HOME_WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
							Status_SaveButton.actionBinding();
							return false;
						}
					    
					    return true;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Manage Case parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Create Home Warrants screen
						var navArray = new Array( NavigationController.HOME_WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_JudgmentsButton",
			formName: NavigationController.JUDGMENT_FORM,
			label: "Judgments",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
					    if( CaseManUtils.isBlank(caseNumber) || !Services.getAdaptorById("Header_CaseNumber").getValid() ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.JUDGMENT_FORM, NavigationController.HOME_WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
							Status_SaveButton.actionBinding();
							return false;
						}
					    
					    return true;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Judgments parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Create Home Warrants screen
						var navArray = new Array( NavigationController.HOME_WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_EventsButton",
			formName: NavigationController.EVENTS_FORM,
			label: "Events",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
					    if( CaseManUtils.isBlank(caseNumber) || !Services.getAdaptorById("Header_CaseNumber").getValid() ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.HOME_WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
							Status_SaveButton.actionBinding();
							return false;
						}
					    
					    return true;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Manage Case Events parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Create Home Warrants screen
						var navArray = new Array( NavigationController.HOME_WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		}
	]
}
