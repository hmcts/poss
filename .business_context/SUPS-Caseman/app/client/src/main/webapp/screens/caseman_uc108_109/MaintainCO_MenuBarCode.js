/** 
 * @fileoverview MaintainCO_MenuBarCode.js:
 * Configurations for the UC108 (Create/Maintain CO) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Error message when attempt to transfer CO with no CO loaded changed to
 *				CaseMan_cannotTransferCO_Msg (new) as previously referred to Audit.
 * 13/06/2006 - Chris Vincent: replaced all Messages.CANNOT_NAVIGATE_SAVE_REQUIRED_MESSAGE with a
 *				Messages.DETSLOST_MESSAGE dirty flag check to match all other screens.
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_COEventsButton",
			formName: NavigationController.CO_EVENTS_FORM,
			label: "CO Events",
/**
 * @author rzxd7g
 * @return allowed  
 */
			guard:   function()
					 {
						var allowed = true;
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						if(CaseManUtils.isBlank(coNumber) ){
							// Existing CO record not loaded, throw error message							
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE);
							allowed = false;
						}
						
					 	// Dirty Flag check
						if ( allowed && MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.CO_EVENTS_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ManageCOEventsParams.CO_NUMBER, coNumber);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
						return allowed;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Manage CO Events parameters
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						Services.setValue(ManageCOEventsParams.CO_NUMBER, coNumber);
						// Set up the Call Stack to return to the CO screen
						var navArray = new Array( NavigationController.MAINTAINCO_FORM );
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
 * @return allowed  
 */
			guard:   function() 
					 {
						var allowed = true;						
					 	// Dirty Flag check
						if ( MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.QUERYBYPARTYCO_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
						
						return allowed;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
					 	var navArray = new Array(NavigationController.MAINTAINCO_FORM);
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ViewPaymentsButton",
			formName: NavigationController.VIEW_PAYMENTS_FORM,
			label: "View Payments",
/**
 * @author rzxd7g
 * @return allowed  
 */
			guard:   function() 
					 {						
						var allowed = true;
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						var moniesInCourt = Services.getValue(CO_Money_MoniesInCourt.dataBinding);
						var div = Services.getValue(CO_Money_TotalPaidOut.dataBinding);
						// defect 3743 MGG 28/06/06 - allow payment screen to be displayed for passthroughs as per CO Events
						var passthrough = Services.getValue(CO_Money_TotalPassthroughs.dataBinding);

						if(CaseManUtils.isBlank(coNumber) ){
							// Existing CO record not loaded, throw error message
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE);
							allowed = false;
						}
						else if(moniesInCourt == null || moniesInCourt == "" || parseFloat(moniesInCourt) <= 0){
					 		// If user attempts to navigate to View Payments and no payments exist on the CO record, 
							// throw error code: CaseMan_noPaymentsExistForCO_Msg
							// NB payments screen displays the payments made that have now become dividends. So test for divs as well
							if(div == null || div == "" || parseFloat(div) <= 0){
								// defect 3743 - allow payment screen to be displayed for passthroughs as per CO Events
								if(passthrough == null || passthrough == "" || parseFloat(passthrough) <= 0){								
									var errCode = ErrorCode.getErrorCode("CaseMan_noPaymentsExistForCO_Msg");
									Services.setTransientStatusBarMessage(errCode.getMessage());
									allowed = false;
								}
							}							
						 }
						 
					 	// Dirty Flag check
						if ( allowed && MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, coNumber);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CO);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
						return allowed;		 	
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the View Payments parameters
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, coNumber);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, ViewPaymentsParamsConstants.CO);
				
						// Set up the Call Stack to return to the CO screen
						var navArray = new Array( NavigationController.MAINTAINCO_FORM );
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
 * @return allowed  
 */
			guard:   function() 
					 {
						var allowed = true;
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						var div = Services.getValue(CO_Money_TotalPaidOut.dataBinding);
						if(CaseManUtils.isBlank(coNumber) ){
							// Existing CO record not loaded, throw error message							
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE);
							allowed = false;
						}
						else if(div == null || div == "" || parseFloat(div) <= 0){
					 		// If user attempts to navigate to View Dividends and no dividends exist on the CO record, 
					 		// throw error code: CaseMan_noDividendsExistForCO_Msg
							var errCode = ErrorCode.getErrorCode("CaseMan_noDividendsExistForCO_Msg");
							Services.setTransientStatusBarMessage(errCode.getMessage());
							allowed = false;
						}
						 
					 	// Dirty Flag check
						if ( allowed && MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.VIEW_DIVIDENDS_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ViewDividendsParams.CO_NUMBER, coNumber);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
						return allowed;		 	
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Manage CO Events parameters
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						Services.setValue(ViewDividendsParams.CO_NUMBER, coNumber);
				
						// Set up the Call Stack to return to the CO screen
						var navArray = new Array( NavigationController.MAINTAINCO_FORM );
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
			id: "NavBar_PERCalculatorButton",
			formName: NavigationController.CO_PER_FORM,
			label: "PER Calculator",
/**
 * @author rzxd7g
 * @return allowed  
 */
			guard:   function() 
					 {
					 	var allowed = true;
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						if(CaseManUtils.isBlank(coNumber) ){
							// Existing CO record not loaded, throw error message 
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE);
							allowed = false;
						}
						
					 	// Dirty Flag check
						if ( allowed && MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.CO_PER_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(PERCalculatorParams.CO_NUMBER, coNumber);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
								 	
						return allowed;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the PER Calculator parameters
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						Services.setValue(PERCalculatorParams.CO_NUMBER, coNumber);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.MAINTAINCO_FORM );
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_DOMCalculatorButton",
			formName: NavigationController.DOM_CALC_FORM,
			label: "Determination Of Means",
/**
 * @author rzxd7g
 * @return allowed  
 */
			guard:   function() 
					 {
					 	var allowed = true;
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						var coType = Services.getValue(Header_Type.dataBinding);
						if(CaseManUtils.isBlank(coNumber) ){
							// Existing CO record not loaded, throw error message &&& change message
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_NUMBER_REQUIRED_MESSAGE);
							allowed = false;
						}
						else if(coType != null && coType != "" && coType == "CAEO"){
							// Existing CO record not loaded, throw error message &&& change message
							Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CAEO_MESSAGE);
							allowed = false;
						}
						
					 	// Dirty Flag check
						if ( allowed && MaintainCOFunctions.isSaveRequired() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// User wishes to save before navigating
							var navArray = new Array(NavigationController.DOM_CALC_FORM, NavigationController.MAINTAINCO_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(DeterminationOfMeansParams.CO_NUMBER, coNumber);
							Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_NAVIGATE);
							Status_Save.actionBinding();
							allowed = false;
						}
						
						return allowed;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the DOM Calculator parameters
						var coNumber = Services.getValue(Header_CONumber.dataBinding);
						Services.setValue(DeterminationOfMeansParams.CO_NUMBER, coNumber);
				
						// Set up the Call Stack to return to the CO Events screen
						var navArray = new Array( NavigationController.MAINTAINCO_FORM );
						
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: false
		},
		{
			id: "NavBar_TransferCOButton",
			label: "Transfer CO",
			subformId: "transferCO_subform",
/**
 * @author rzxd7g
 * @return allowed  
 */
			guard: function() {
				 	var allowed = true;
					var coNumber = Services.getValue(Header_CONumber.dataBinding);
					var moneyInCourt = Services.getValue("/ds/MaintainCO/DebtSummary/MoniesInCourt");						
					Services.setValue(TransferCOParams.CO_NUMBER, coNumber);
					if(CaseManUtils.isBlank(coNumber) ){
						// Existing CO record not loaded, throw error message
						var ec = ErrorCode.getErrorCode("CaseMan_cannotTransferCO_Msg");
						Services.setTransientStatusBarMessage(ec.getMessage());							
						allowed = false;
					}
					else if(null != moneyInCourt && moneyInCourt != "" && parseFloat(moneyInCourt) > 0){	
						// Existing CO record not loaded, throw error message &&& change message
						Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO_MONIESINCOURT_MESSAGE);
						allowed = false;
					} 	
					return allowed;
				 },
			onMenuBar: false
		}
	]
}
