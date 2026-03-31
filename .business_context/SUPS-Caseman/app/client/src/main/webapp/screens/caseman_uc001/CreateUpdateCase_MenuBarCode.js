/** 
 * @fileoverview CreateUpdateCase_MenuBarCode.js:
 * Configurations for the UC001 (Create Case) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 03/07/2006 - Chris Vincent, Added enablement rule for the Obligations button so disabled
 * 				if user does not have access to the Obligations screen.
 * 23/11/2007 - Chris Vincent, Added enablement rule for the Query button so disabled
 * 				if user does not have access to the Query By Party Case screen (CaseMan Defect 6467).
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_QueryButton",
			formName: NavigationController.QUERYBYPARTYCASE_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	 function()
					 {
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.QUERYBYPARTYCASE_FORM, NavigationController.CASES_FORM);
							NavigationController.createCallStack(navArray);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
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
					 	var navArray = new Array(NavigationController.CASES_FORM);
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.QUERYBYPARTYCASE_FORM); }
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
			id: "NavBar_WindowForTrialButton",
			formName: NavigationController.WFT_FORM,
			label: "Window For Trial",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isExistingCase() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWFTScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMagsOrder() )
						{
							// MAGS ORDER Case, unable to navigate to the screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWFTScreenWithMAGSORDER_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WFT_FORM, NavigationController.CASES_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(MaintainWftParams.CASE_NUMBER, caseNumber);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return (null == ec) ? true : false;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the WFT parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(MaintainWftParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack
						var navArray = new Array( NavigationController.CASES_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ActiveObligationsButton",
			formName: NavigationController.OBLIGATIONS_FORM,
			label: "Active Obligations",
/**
 * @author rzxd7g
 * @return boolean, validNav  
 */
			guard:   function() 
					 {
						if ( !isExistingCase() )
						{
							// Existing Case not loaded, throw error message
							var ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToObligationsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
						}
						 
						var validNav = false;
						var activeObligations = Services.getValue(XPathConstants.DATA_XPATH + "/ActiveObligationsExist");
						var deletedObligations = Services.getValue(XPathConstants.DATA_XPATH + "/DeletedObligationsExist");
						if (activeObligations == "false" && deletedObligations == "true")
						{
							// No active Obligations but some deleted ones, prompt for confirmation
							if ( confirm(Messages.NO_OBL_MESSAGE) )
							{
								validNav = true;
							}
						}
						else if (activeObligations == "false" && deletedObligations == "false")
						{
							// No obligations at all, alert user
							alert(Messages.OBL_DONOTEXIST_MESSAGE);
						}
						else
						{
							validNav = true;
						}
						 
					 	// Dirty Flag check
						if ( validNav && changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.OBLIGATIONS_FORM, NavigationController.CASES_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(MaintainObligationsParams.CASE_NUMBER, caseNumber);
							Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return validNav;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Active Obligations exist, take user to Obligations screen.
						// Set the Obligations parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(MaintainObligationsParams.CASE_NUMBER, caseNumber);
						Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
						
						// Set up the Call Stack
						var navArray = new Array( NavigationController.CASES_FORM );
						NavigationController.createCallStack(navArray);		
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.OBLIGATIONS_FORM); }
		},
		{
			id: "NavBar_DuplicateNoticeButton",
			formName: NavigationController.MAIN_MENU,
			label: "Duplicate Notice",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isExistingCase() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotCreateDuplicateNotice_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
						}
						else if ( isMagsOrder() )
						{
							 // MAGS ORDER Case, unable to navigate to the screen
							 ec = ErrorCode.getErrorCode("CaseMan_cannotCreateDuplicateNoticeWithMAGSORDER_Msg");
							 Services.setTransientStatusBarMessage(ec.getMessage());
							 return false;
						}
					 
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_DUPNOTICE
							Status_SaveButton.actionBinding();
						}
						else
						{
							createDuplicateNotice();
						}
					 	
					 	return false;
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
			guard:  function() 
					 {
					 	var ec = null;
						if ( !isExistingCase() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMagsOrder() )
						{
							 // MAGS ORDER Case, unable to navigate to the screen
							 ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreenWithMAGSORDER_Msg");
							 Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.CASES_FORM);
							NavigationController.createCallStack(navArray);
							var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
							Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return (null == ec) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Events screen parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack
						var navArray = new Array( NavigationController.CASES_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		}
	]
}
