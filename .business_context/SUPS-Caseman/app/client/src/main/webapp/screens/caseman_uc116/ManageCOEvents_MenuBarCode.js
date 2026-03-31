/** 
 * @fileoverview ManageCOEvents_MenuBarCode.js:
 * Configurations for the UC116 (Manage CO Events) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 31/08/2006 - Chris Vincent, fixed defects 4893 & 4933 which loads the wrong data for warrant
 * 				screens in some scenarios.  Now navigation to all warrant screens clear down any
 * 				previous warrant screen parameters before setting new values.
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_MaintainCOButton",
			formName: NavigationController.MAINTAINCO_FORM,
			label: "Maintain CO",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	function() 
					{
					 	var ec = null;
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.MAINTAINCO_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(ManageCOParams.CO_NUMBER);
							Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.MAINTAIN_MODE);
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
						// Set the Manage CO parameters
						setCONumberToApp(ManageCOParams.CO_NUMBER);
						Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.MAINTAIN_MODE);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ViewCreditorsButton",
			formName: NavigationController.MAINTAINDEBT_FORM,
			label: "View Creditors",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.MAINTAINDEBT_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(ManageCOParams.CO_NUMBER);
							Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.READONLY_MODE);
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
						// Set the View Creditors parameters
						setCONumberToApp(ManageCOParams.CO_NUMBER);
						Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.READONLY_MODE);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
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
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPaymentsCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						
						var paymentsExist = Services.getValue(XPathConstants.DATA_XPATH + "/PaymentsExist");
						if ( null == ec && paymentsExist == "false" )
						{
							// No payments exist on the CO, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_noPaymentsExistForCO_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(ViewPaymentsParams.ENFORCEMENT_NUMBER);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CO);
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
						// Set the View Payments screen parameters
						setCONumberToApp(ViewPaymentsParams.ENFORCEMENT_NUMBER);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CO);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ViewDividendsButton",
			formName: NavigationController.VIEW_DIVIDENDS_FORM,
			label: "View Dividends",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToDividendsCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						
						var dividendsExist = Services.getValue(XPathConstants.DATA_XPATH + "/DividendsExist");
						if ( null == ec && dividendsExist == "false" )
						{
							// No dividends exist on the CO, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_noDividendsExistForCO_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.VIEW_DIVIDENDS_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(ViewDividendsParams.CO_NUMBER);
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
						// Set the View Dividends parameters
						setCONumberToApp(ViewDividendsParams.CO_NUMBER);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_QueryButton",
			formName: NavigationController.QUERYBYPARTYCO_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	function()
					{
					 	// Dirty Flag check
						if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.QUERYBYPARTYCO_FORM, NavigationController.CO_EVENTS_FORM);
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
					 	var navArray = new Array(NavigationController.CO_EVENTS_FORM);
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_DOMCalculatorButton",
			formName: NavigationController.DOM_CALC_FORM,
			label: "DoM Calculator",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
					 	var coType = Services.getValue(Header_COType.dataBinding);
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToDoMScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else if ( coType == "CAEO" )
						{
							// Determination of Means Calculator not applicable to CAEO Consolidated Orders
							ec = ErrorCode.getErrorCode("CaseMan_domNotApplicableToCAEO_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.DOM_CALC_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(DeterminationOfMeansParams.CO_NUMBER);
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
						// Set the DOM Calculator parameters
						setCONumberToApp(DeterminationOfMeansParams.CO_NUMBER);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_PERCalculatorButton",
			formName: NavigationController.CO_PER_FORM,
			label: "PER Calculator",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPERCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.CO_PER_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(PERCalculatorParams.CO_NUMBER);
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
						setCONumberToApp(PERCalculatorParams.CO_NUMBER);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_HearingsButton",
			formName: NavigationController.HEARINGCO_FORM,
			label: "Hearings",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					 	var ec = null;
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToHearingsCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						
						var hearingsExist = Services.getValue(XPathConstants.DATA_XPATH + "/HearingsExist");
						if ( hearingsExist == "N" )
						{
							// No Hearings exist, provide user with warning message before navigate
							alert(Messages.CO_NOHEARINGSFORCO_MESSAGE);
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.HEARINGCO_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							setCONumberToApp(HearingParams.CO_NUMBER);
							Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CO);
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
						setCONumberToApp(HearingParams.CO_NUMBER);
						Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CO);

						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
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
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWarrantsCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						 
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							Services.removeNode(MaintainWarrantsParams.PARENT);
							setCONumberToApp(MaintainWarrantsParams.CO_NUMBER);
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
						// Set the Warrants parameters
						Services.removeNode(MaintainWarrantsParams.PARENT);
						setCONumberToApp(MaintainWarrantsParams.CO_NUMBER);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
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
						if ( !isCORecordLoaded() )
						{
							// Existing CO record not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToWarrantReturnsCOScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
						
					 	// Dirty Flag check
						if ( null == ec && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_RETURNS_FORM, NavigationController.CO_EVENTS_FORM);
							NavigationController.createCallStack(navArray);
							Services.removeNode(WarrantReturnsParams.PARENT);
							setCONumberToApp(WarrantReturnsParams.CO_NUMBER);
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
						// Set the Warrant Returns parameters
						Services.removeNode(WarrantReturnsParams.PARENT);
						setCONumberToApp(WarrantReturnsParams.CO_NUMBER);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.CO_EVENTS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		}
	]
}
