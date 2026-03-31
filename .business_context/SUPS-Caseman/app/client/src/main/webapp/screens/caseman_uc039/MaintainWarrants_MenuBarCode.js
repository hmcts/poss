/** 
 * @fileoverview MaintainWarrants_MenuBarCode.js:
 * Configurations for the UC039 (Maintain Warrants) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * Change History:
 * 22/06/2006 - Chris Vincent, removed MaintainWarrantAmountParams.COURT_CODE passed to the Maintain
 *				Warrant Fees/Refunds as the screen now uses the global court code, not a specific court 
 *				code passed to it.
 * 03/07/2006 - Chris Vincent, Added enablement rule for the Warrant Returns & Reissue Warrant 
 * 				buttons so disabled if user does not have access to the screens.
 * 05/10/2010 - Chris Vincent, added checkWarrantPaymentsExist() to guard function for navigation to
 *				View Payments screen.  Trac 3818.
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_QueryButton",
			formName: NavigationController.QUERYBYPARTYWARRANT_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard: function()
				   {
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.QUERYBYPARTYWARRANT_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
					
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
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
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
					    if( CaseManUtils.isBlank(caseNumber) ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCasesScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.CASES_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
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
			
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
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
					    if( CaseManUtils.isBlank(caseNumber) ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.JUDGMENT_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
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
						// Set the Maintain Judgments parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ReissueButton",
			formName: NavigationController.REISSUE_WARRANT_FORM,
			label: "Re-Issue Warrant",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					    var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
					    if( CaseManUtils.isBlank(warrantID) ) 
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToReissueWarrantScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					    // Return 158 check - do not navigate if the warrant has already been re-issued
						var reissuedReturn = Services.countNodes(XPathConstants.WARRANT_BASE + "/FinalReturnCodes/Code[text() = '158']");
						if( reissuedReturn > 0 )
					    {
							// Warrant has been reissued, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToReissueWarrantScreenAlreadyReissued_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.REISSUE_WARRANT_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ReissueWarrantsParams.WARRANT_ID, warrantID);
					
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
						// Set the Reissue Warrants parameters
						var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
						Services.setValue(ReissueWarrantsParams.WARRANT_ID, warrantID);
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.REISSUE_WARRANT_FORM); }
		},
		{
			id: "NavBar_ReturnsButton",
			formName: NavigationController.WARRANT_RETURNS_FORM,
			label: "Warrant Returns",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					    var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
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
							var navArray = new Array(NavigationController.WARRANT_RETURNS_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(WarrantReturnsParams.WARRANT_ID, warrantID);
					
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
						// Set the Warrant Returns parameters
						var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
						Services.setValue(WarrantReturnsParams.WARRANT_ID, warrantID);
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.WARRANT_RETURNS_FORM); }
		},
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
					    if( CaseManUtils.isBlank(caseNumber) ) 
					    {
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
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
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_ViewPaymentsButton",
			formName: NavigationController.VIEW_PAYMENTS_FORM,
			label: "View Payments",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					    var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
					    if( CaseManUtils.isBlank(warrantID) ) 
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPaymentsWarrantScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
						// Check for payments on the Warrant
					    checkWarrantPaymentsExist();
					    return false;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
					 	var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
					 	var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
					 	var currentlyOwnedBy = Services.getValue(XPathConstants.WARRANT_BASE + "/OwnedBy");
    					if( !CaseManUtils.isBlank(localNumber) ) 
    					{
    						// Foreign Warrant
    						var enfNumber = localNumber;
    						var enfType = ViewPaymentsParamsConstants.FOREIGNWARRANT;
    					}
    					else
    					{
    						// Home Warrant
    						var enfNumber = Services.getValue(Header_WarrantNumber.dataBinding);
    						var enfType = ViewPaymentsParamsConstants.HOMEWARRANT;
    					}
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, enfNumber);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, enfType);
						Services.setValue(ViewPaymentsParams.ISSUING_COURT, issuingCourt);
						Services.setValue(ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT, currentlyOwnedBy);
						
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_RefundsFeesButton",
			formName: NavigationController.WARRANT_REFUNDS_FEES_FORM,
			label: "Maintain Fees",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					    var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
					    if( CaseManUtils.isBlank(warrantID) ) 
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWRFScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
					    if( warrantNumber.indexOf("/") != -1 ) 
					    {
					        // The warrant is a re-issued warrant, so can't navigate to the fees/refunds screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWRFScreenReissued_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;        
					    }
					    
					    var issuedBy = Services.getValue(XPathConstants.WARRANT_BASE + "/IssuedBy");
					    if( issuedBy != Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) ) 
					    {
							// Warrant was issued by a different court
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWRFScreenIssueCourt_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_REFUNDS_FEES_FORM, NavigationController.WARRANT_FORM);
							NavigationController.createCallStack(navArray);
							
							// Set the Maintain Refunds/Fees parameters
							Services.setValue(MaintainWarrantAmountParams.WARRANT_ID, warrantID);
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
						// Set the Maintain Refunds/Fees parameters
						var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
						Services.setValue(MaintainWarrantAmountParams.WARRANT_ID, warrantID);
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		}
	]
}
