/** 
 * @fileoverview ManageAEEvents_MenuBarCode.js:
 * Configurations for the UC092 (Manage AE Events) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 15/11/2006 - Chris Vincent, added additional validation step on the Maintain AE Fees/Refunds button
 * 				to prevent users accessing the screen if the AE's CAPS Sequence is not blank (Existing Case).
 * 				Required for UCT Defect 669.
 * 03/09/2007 - Chris Vincent, updated the Transfer Cases validation so now will make a call to 
 * 				checkOutstandingPaymentsExist() which makes a service call to determine if payments
 * 				are actually outstanding.  CaseMan Defect 6420.
 * 29-07-2009 - Chris Vincent - Changes to the Transfer Cases navigation functionality (both guard and prepare functions)
 *		    		as Outstanding Payments validation check no longer required.  See TRAC Ticket 1155.
 * 10/11/2011 - Des Johnston, Added if statment to NavBar_MaintainAEAmountsButton guard function to prevent navigation if 
 *              user does not belong to the court that issued the AE - Trac 2480
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_AEButton",
			formName: NavigationController.MANAGE_AE_FORM,
			label: "AE",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	 var ec = null;
						 if ( !isAERecordLoaded() )
						 {
							 // Existing AE record not loaded, throw error message
							 ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCreateAEScreen_Msg");
							 Services.setTransientStatusBarMessage(ec.getMessage());
						 }
						 
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.MANAGE_AE_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(ManageAEParams.CASE_NUMBER);
							setAENumberToApp(ManageAEParams.AE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						// Set the Manage AE parameters
						setCaseNumberToApp(ManageAEParams.CASE_NUMBER);
						setAENumberToApp(ManageAEParams.AE_NUMBER);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.MANAGE_AE_FORM); }
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
					 	 var ec = null;
						 if ( !isAERecordLoaded() )
						 {
							 // Existing AE record not loaded, throw error message
							 ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCasesScreen_Msg");
							 Services.setTransientStatusBarMessage(ec.getMessage());
						 }
						 
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.CASES_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(CreateCaseParams.CASE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						setCaseNumberToApp(CreateCaseParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_CaseEventsButton",
			formName: NavigationController.EVENTS_FORM,
			label: "Case Events",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(ManageCaseEventsParams.CASE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						// Set the Manage Case Events parameters
						setCaseNumberToApp(ManageCaseEventsParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_PERCalculatorButton",
			formName: NavigationController.AE_PER_FORM,
			label: "PER Calculator",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPERScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.AE_PER_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setAENumberToApp(PERCalculatorParams.AE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						// Set the PER Calculator parameters
						setAENumberToApp(PERCalculatorParams.AE_NUMBER);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
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
			formName: NavigationController.QUERYBYPARTYAE_FORM,
			label: "Query",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard: 	function()
					{
					 	// Dirty Flag check
						if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.QUERYBYPARTYAE_FORM, NavigationController.AE_EVENTS_FORM);
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
					 	var navArray = new Array(NavigationController.AE_EVENTS_FORM);
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_TransferCaseButton",
			formName: NavigationController.TRANSFER_CASE_FORM,
			label: "Transfer Case",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToTransferScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						else if ( Services.getValue(XPathConstants.DATA_XPATH + "/OutstandingWarrant") == "true" )
						{
							// Cannot transfer a case with an outstanding warrant
							ec = ErrorCode.getErrorCode("CaseMan_cannotTransferCaseOustandingWarrant_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.TRANSFER_CASE_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(TransferCaseParams.CASE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						setCaseNumberToApp(TransferCaseParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
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
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPaymentsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
						var paymentsExist = Services.getValue(XPathConstants.DATA_XPATH + "/PaymentsExist");
						if ( null == ec && paymentsExist == "false" )
						{
							// No payments exist on the AE, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_paymentsDoNotExistForAE_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setAENumberToApp(ViewPaymentsParams.ENFORCEMENT_NUMBER);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.AE);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						setAENumberToApp(ViewPaymentsParams.ENFORCEMENT_NUMBER);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.AE);
						
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_HearingsButton",
			formName: NavigationController.HEARING_FORM,
			label: "Hearings",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToHearingsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.HEARING_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(HearingParams.CASE_NUMBER);
							Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CASE);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						setCaseNumberToApp(HearingParams.CASE_NUMBER);
						Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CASE);
				
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_PERReportButton",
			formName: NavigationController.MAIN_MENU,
			label: "PER Report",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:  function() 
					{
						var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPERReportScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							// PER Report not available for MAGS ORDER
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						else
						{
							var aePERItemsExist = Services.getValue(XPathConstants.DATA_XPATH + "/AEPERItemsExist");
							if ( aePERItemsExist != "true" )
							{
								// PER Report not available if no AE PER Items exist
								var ec = ErrorCode.getErrorCode("CaseMan_AE_noPERItemsExist_Msg");
								Services.setTransientStatusBarMessage( ec.getMessage() );
							}
						}

						if ( null == ec )
						{
						 	// Dirty Flag check
							if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
							{
								Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_PERREPORT);
								Status_SaveButton.actionBinding();
							}
							else
							{
								runPERReport();
							}
						}
					 	return false;
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
			guard:   function() 
					 {
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToObligationsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
						}
						else if ( isMAGSOrderCase() )
						{
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
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
						if ( validNav && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.OBLIGATIONS_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(MaintainObligationsParams.CASE_NUMBER);
							Services.setValue(MaintainObligationsParams.EVENT_TYPE, "A");
							Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						setCaseNumberToApp(MaintainObligationsParams.CASE_NUMBER);
						Services.setValue(MaintainObligationsParams.EVENT_TYPE, "A");
						Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
						
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);		
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_MaintainAEAmountsButton",
			formName: NavigationController.AE_AMOUNTS_FORM,
			label: "Maintain Fees/Refunds",
			/**
			 * @author rzxd7g
			 * @return boolean 
			 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isAERecordLoaded() )
						{
							// Existing AE record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToAEFeesScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( isMAGSOrderCase() )
						{
							var ec = ErrorCode.getErrorCode("CaseMan_navigationNotAvailableForMAGSORDER_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						else if ( !CaseManUtils.isBlank( Services.getValue(XPathConstants.DATA_XPATH + "/CAPSSequence") ) )
						{
							// CAPS Sequence is NOT blank so is an Existing Case AE - do not allow access (UCT Defect 669)
							var ec = ErrorCode.getErrorCode("CaseMan_AE_maintainFeesForExistingCase_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
						
	                       // Add if statment to NavBar_MaintainAEAmountsButton guard function to prevent navigation if court code not correct (trac 2480)
	                    else if ( Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) != Services.getValue(XPathConstants.DATA_XPATH + "/IssuingCourtCode") )
	                    {
		                   // User does not belong to the court that issued the AE
		                   var ec = ErrorCode.getErrorCode("Caseman_aeFeesNavigationIncorrectCourt_Msg");
		                   Services.setTransientStatusBarMessage( ec.getMessage() );
	                    }
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.AE_AMOUNTS_FORM, NavigationController.AE_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCaseNumberToApp(MaintainAEAmountParams.CASE_NUMBER);
							setAENumberToApp(MaintainAEAmountParams.AE_NUMBER);
					
							Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
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
						// Set the Maintain AE Amounts parameters
						setCaseNumberToApp(MaintainAEAmountParams.CASE_NUMBER);
						setAENumberToApp(MaintainAEAmountParams.AE_NUMBER);

						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.AE_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		}
	]
}