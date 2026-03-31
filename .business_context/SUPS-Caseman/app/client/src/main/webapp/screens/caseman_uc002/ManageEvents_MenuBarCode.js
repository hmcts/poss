/** 
 * @fileoverview ManageEvents_MenuBarCode.js:
 * Configurations for the UC002 (Manage Case Events) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 03/07/2006 - Chris Vincent, Added enablement rule for the Warrant Returns button so disabled
 * 				if user does not have access to the Warrant Returns screen.
 * 31/08/2006 - Chris Vincent, fixed defects 4893 & 4933 which loads the wrong data for warrant
 * 				screens in some scenarios.  Now navigation to all warrant screens clear down any
 * 				previous warrant screen parameters before setting new values.
 * 03/09/2007 - Chris Vincent, updated the Transfer Cases validation so now will make a call to 
 * 				checkOutstandingPaymentsExist() which makes a service call to determine if payments
 * 				are actually outstanding.  CaseMan Defect 6420.
 * 29-07-2009 - Chris Vincent - Changes to the Transfer Cases navigation functionality (both guard and prepare functions)
 *		    		as Outstanding Payments validation check no longer required.  See TRAC Ticket 1155.
 * 29/01/2013 - Chris Vincent, added new fields Track and Amount Claimed (Trac 4763), Preferred Court (Trac 4764) and Judge (Trac 4768)
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
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCasesScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.CASES_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(CreateCaseParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Manage Case parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(CreateCaseParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			eventBinding: {
				keys: [ { element: "manageEvents", key: Key.F10 } ]
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
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.JUDGMENT_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(JudgmentParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Judgments parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(JudgmentParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			eventBinding: {
				keys: [ { element: "manageEvents", key: Key.F12 } ]
			},
			onMenuBar: true
		},
		{
			id: "NavBar_HearingsButton",
			formName: NavigationController.HEARING_FORM,
			label: "Hearings",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							 // Existing Case not loaded, throw error message
							 ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToHearingsScreen_Msg");
							 Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.HEARING_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(HearingParams.CASE_NUMBER);
							Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CASE);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Hearings parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(HearingParams.CASE_NUMBER);
						Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CASE);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			eventBinding: {
				keys: [ { element: "manageEvents", key: Key.F11 } ]
			},
			onMenuBar: true
		},
		{
			id: "NavBar_WarrantReturnsButton",
			formName: NavigationController.WARRANT_RETURNS_FORM,
			label: "Warrant Returns",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWarrantsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_RETURNS_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							Services.removeNode(WarrantReturnsParams.PARENT);
							setAppCaseNumberParameter(WarrantReturnsParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Warrant Returns parameters
						clearAppParameters(false, true, false);
						Services.removeNode(WarrantReturnsParams.PARENT);
						setAppCaseNumberParameter(WarrantReturnsParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			eventBinding: {
				keys: [ { element: "manageEvents", key: Key.F9 } ]
			},
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.WARRANT_RETURNS_FORM); }
		},
		{
			id: "NavBar_WarrantsButton",
			formName: NavigationController.WARRANT_FORM,
			label: "Warrants",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWarrantsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							Services.removeNode(MaintainWarrantsParams.PARENT);
							setAppCaseNumberParameter(MaintainWarrantsParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Warrant parameters
						clearAppParameters(false, true, false);
						Services.removeNode(MaintainWarrantsParams.PARENT);
						setAppCaseNumberParameter(MaintainWarrantsParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
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
			id: "NavBar_QueryButton",
			formName: NavigationController.QUERYBYPARTYCASE_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard: function()
				   {
					 	// Dirty Flag check
						if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.QUERYBYPARTYCASE_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, false, false);
					
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
					    clearAppParameters(false, false, false);
					 	var navArray = new Array(NavigationController.EVENTS_FORM);
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_TransferCaseButton",
			formName: NavigationController.TRANSFER_CASE_FORM,
			label: "Transfer Case",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToTransferScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( Services.getValue(XPathConstants.DATA_XPATH + "/OutstandingWarrant") == "true" )
						{
							// Cannot transfer a case with an outstanding warrant
							ec = ErrorCode.getErrorCode("CaseMan_cannotTransferCaseOustandingWarrant_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.TRANSFER_CASE_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(TransferCaseParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Transfer Case parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(TransferCaseParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_AEEventsButton",
			formName: NavigationController.AE_EVENTS_FORM,
			label: "AE Events",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToAEScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.AE_EVENTS_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(ManageAEEventsParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the AE Events parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(ManageAEEventsParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_BarJudgmentButton",
			formName: NavigationController.BARJUDGMENT_FORM,
			label: "Bar Judgment/Enforcement",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToBarScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.BARJUDGMENT_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(BarJudgmentParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Bar Judgment parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(BarJudgmentParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
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
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPaymentsScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						 
						var paymentsExist = Services.getValue(XPathConstants.DATA_XPATH + "/PaymentsExist");
						if ( null == ec && paymentsExist == "false" )
						{
							// No payments exist on the CASE, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_paymentsDoNotExistForCase_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(ViewPaymentsParams.ENFORCEMENT_NUMBER);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CASE);

							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the View Payments parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(ViewPaymentsParams.ENFORCEMENT_NUMBER);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CASE);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_WindowForTrialButton",
			formName: NavigationController.WFT_FORM,
			label: "Window For Trial",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWFTScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WFT_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(MaintainWftParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the WFT parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(MaintainWftParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_ActiveObligationsButton",
			formName: NavigationController.OBLIGATIONS_FORM,
			label: "Active Obligations",
/**
 * @author rzxd7g
 * @return boolean, validNav  
 */
			guard:  function() 
					{
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							var ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToObligationsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
						}
						 
						var validNav = false;
						var activeObligations = Services.getValue(XPathConstants.OBLIGATIONS_EXIST_XPATH);
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
						if ( validNav && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.OBLIGATIONS_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setAppCaseNumberParameter(MaintainObligationsParams.CASE_NUMBER);
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
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(MaintainObligationsParams.CASE_NUMBER);
						Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
						
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);		
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_HRADetailsButton",
			formName: NavigationController.HUMAN_RIGHTS_FORM,
			label: "HRA Details",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToHRAScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.HUMAN_RIGHTS_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							setAppCaseNumberParameter(HumanRightsActParams.CASE_NUMBER);
					
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the HRA Details parameters
						clearAppParameters(false, true, false);
						setAppCaseNumberParameter(HumanRightsActParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_ReissueWarrantsButton",
			formName: NavigationController.REISSUE_WARRANT_FORM,
			label: "Re-Issue Warrant",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToReissueWarrantScreenFromCases_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.REISSUE_WARRANT_FORM, NavigationController.EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							clearAppParameters(false, true, false);
							Services.removeNode(ReissueWarrantsParams.PARENT);
							setAppCaseNumberParameter(ReissueWarrantsParams.CASE_NUMBER);

							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the HRA Details parameters
						clearAppParameters(false, true, false);
						Services.removeNode(ReissueWarrantsParams.PARENT);
						setAppCaseNumberParameter(ReissueWarrantsParams.CASE_NUMBER);

						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_ResetCaseStatusButton",
			subformId: "resetCaseStatus_subform",
			label: "Reset Case Status",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
					 	var transferStatus = Services.getValue(XPathConstants.DATA_XPATH + "/TransferStatus");
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotResetCaseStatus_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( !CaseManUtils.isBlank(transferStatus) )
						{
						 	// Case is either being transferred or has been transferred to a Legacy court
						 	ec = ErrorCode.getErrorCode("CaseMan_resetCaseStatusDuringTransfer_Msg");
						 	Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_RESETCASESTATUS;;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
			onMenuBar: false
		},
		{
			id: "NavBar_ResetCaseTypeButton",
			subformId: "changeCaseType_subform",
			label: "Reset Case Type",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
					 	var transferStatus = Services.getValue(XPathConstants.DATA_XPATH + "/TransferStatus");
						if ( !caseExists() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotResetCaseType_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( !CaseManUtils.isBlank(transferStatus) )
						{
						 	// Case is either being transferred or has been transferred to a Legacy court
						 	ec = ErrorCode.getErrorCode("CaseMan_changeCaseTypeDuringTransfer_Msg");
						 	Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
						if ( null == ec && ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
						{
							PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_RESETCASETYPE;
							Status_SaveButton.actionBinding();
							return false;
						}
						 
					 	return ( null == ec ) ? true : false;
					},
			onMenuBar: false
		}
	]
}
