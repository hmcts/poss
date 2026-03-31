/** 
 * @fileoverview MaintainWarrantReturns_MenuBarCode.js:
 * Configurations for the UC045 (Maintain Warrant Returns) Navigation Buttons
 *
 * @author Chris Vincent
 *
 * Change History
 * 22/02/2010 - Chris Vincent, set the Oracle Report Court Code to be the owning court of the Warrant before the
 *				Warrant Returns Report is called.  Trac 2849.
 */

menubar = {
	quickLinks: [
		{
			id: "NavBar_MaintainWarrantsButton",
			formName: NavigationController.WARRANT_FORM,
			label: "Maintain Warrants",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.WARRANT_FORM, NavigationController.WARRANT_RETURNS_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(MaintainWarrantsParams.WARRANT_ID, warrantID);
							ACTION_AFTER_SAVE = ACTION_NAVIGATE;
							Status_Save_Btn.actionBinding();
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
						// Set the Maintain Warrants parameters
						Services.setValue(MaintainWarrantsParams.WARRANT_ID, warrantID);
				
						// Set up the Call Stack to return to the Warranr Returns screen
						var navArray = new Array( NavigationController.WARRANT_RETURNS_FORM );
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
					    if( CaseManUtils.isBlank(warrantID) ) 
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToReissueWarrantScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					    // Return 158 check - do not navigate if the warrant has already been re-issued
						var reissuedReturn = Services.countNodes("/ds/WarrantReturns/WarrantEvents/WarrantEvent/Code[text() = '158']");
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
							var navArray = new Array(NavigationController.REISSUE_WARRANT_FORM, NavigationController.WARRANT_RETURNS_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ReissueWarrantsParams.WARRANT_ID, warrantID);
					
							ACTION_AFTER_SAVE = ACTION_NAVIGATE;
							Status_Save_Btn.actionBinding();
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
						Services.setValue(ReissueWarrantsParams.WARRANT_ID, warrantID);
				
						// Set up the Call Stack to return to the Maintain Warrants screen
						var navArray = new Array( NavigationController.WARRANT_RETURNS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_ManageEventsButton",
			formName: NavigationController.EVENTS_FORM,
			label: "Events",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						var LocalNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
						var caseNumber = Services.getValue(Header_CaseNumber_Txt.dataBinding);
						if ( CaseManUtils.isBlank(caseNumber) && caseNumber != "%" ) 
						{
					    	// Existing (home) warrant not loaded, throw error message
					   		ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreenWithForeignWarrant_Msg");
					    	Services.setTransientStatusBarMessage(ec.getMessage());
					    	return false;
						}
					  	else if ( !CaseManUtils.isBlank(localNumber) && localNumber != "%" )
					  	{
					    	// Foreign warrant is loaded, throw error message
					    	ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreenWithForeignWarrant_Msg");
					    	Services.setTransientStatusBarMessage(ec.getMessage());
					    	return false;
					  	}
					  	
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.EVENTS_FORM, NavigationController.WARRANT_RETURNS_FORM);
							NavigationController.createCallStack(navArray);
							Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
							ACTION_AFTER_SAVE = ACTION_NAVIGATE;
							Status_Save_Btn.actionBinding();
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
						var caseNumber = Services.getValue(Header_CaseNumber_Txt.dataBinding);
					  	Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
			
						// Set up the Call Stack to return to the Warranr Returns screen
						var navArray = new Array( NavigationController.WARRANT_RETURNS_FORM );
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
 * @return boolean 
 */
			guard:   function() 
					 {
					    if( CaseManUtils.isBlank(warrantID) )  
					    {
							// Existing warrant not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToPaymentsWarrantScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					    var localNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
					    var xp = ( CaseManUtils.isBlank(localNumber) ) ? "/HomeWarrantPaymentsExist" : "/ForeignWarrantPaymentsExist";
					    var paymentsExist = Services.getValue("/ds/PaymentDetails" + xp);
					    if ( paymentsExist != "true" )
					    {
							// No payments exist on the warrant, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_paymentsDoNotExistForWarrant_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
							return false;
					    }
					    
					 	// Dirty Flag check
						if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.WARRANT_RETURNS_FORM);
							NavigationController.createCallStack(navArray);
						 	
						 	var issuingCourt = Services.getValue(Def_IssuingCourtId_Txt.dataBinding);
						 	var currentlyOwnedBy = Services.getValue(WARRANT_XPATH + "/WarrantOwnedBy");
	    					if( !CaseManUtils.isBlank(localNumber) ) 
	    					{
	    						// Foreign Warrant
	    						var enfNumber = localNumber;
	    						var enfType = ViewPaymentsParamsConstants.FOREIGNWARRANT;
	    					}
	    					else
	    					{
	    						// Home Warrant
	    						var enfNumber = Services.getValue(Header_WarrantNumber_Txt.dataBinding);
	    						var enfType = ViewPaymentsParamsConstants.HOMEWARRANT;
	    					}
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, enfNumber);
							Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, enfType);
							Services.setValue(ViewPaymentsParams.ISSUING_COURT, issuingCourt);
							Services.setValue(ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT, currentlyOwnedBy);
					
							ACTION_AFTER_SAVE = ACTION_NAVIGATE;
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
					 	var localNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
					 	var issuingCourt = Services.getValue(Def_IssuingCourtId_Txt.dataBinding);
					 	var currentlyOwnedBy = Services.getValue(WARRANT_XPATH + "/WarrantOwnedBy");
    					if( !CaseManUtils.isBlank(localNumber) ) 
    					{
    						// Foreign Warrant
    						var enfNumber = localNumber;
    						var enfType = ViewPaymentsParamsConstants.FOREIGNWARRANT;
    					}
    					else
    					{
    						// Home Warrant
    						var enfNumber = Services.getValue(Header_WarrantNumber_Txt.dataBinding);
    						var enfType = ViewPaymentsParamsConstants.HOMEWARRANT;
    					}
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, enfNumber);
						Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, enfType);
						Services.setValue(ViewPaymentsParams.ISSUING_COURT, issuingCourt);
						Services.setValue(ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT, currentlyOwnedBy);
						
						// Set up the Call Stack to return to the AE Events screen
						var navArray = new Array( NavigationController.WARRANT_RETURNS_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_WarrantReturnsReportButton",
			formName: NavigationController.MAIN_MENU,
			label: "Warrant Returns Report",
/**
 * @author rzxd7g
 * @return Code = Services.getValue(Details_Code_Txt.dataBinding) , Code)), boolean 
 */
			guard:   function() 
					 {
						// If a warrant has not been retrieved, do not allow the report to run
						// Else if error flag is set to true, throw error
						// Else allow report to run
						var error = Services.getValue(Details_Error_Check.dataBinding);
						if ( CaseManUtils.isBlank(error) )
						{
							// Do nothing
						}
						else if (error == "Y")
						{
							var ec = ErrorCode.getErrorCode("CaseMan_warrantReturnHasAnError_Msg");
						    Services.setTransientStatusBarMessage(ec.getMessage());
						}
						else
						{
							var reportRDFName = "";
						    var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
							
							// Set Oracle Report Court Code to the owning court of the Warrant record loaded TRAC 2849
							Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(WARRANT_XPATH + "/WarrantOwnedBy") );
							
						    regExp = /^[0-9]*$/; // Regular expression that tests true for a string containing numbers
						    if (regExp.test(returnCode))
						    {
						    	if (returnCode == "147") // i.e. 147 Final Return report required
						      	{
						        	reportRDFName = "CM_WRR_147.rdf";
						      	}
						      	else  // i.e. Final Return report required
						      	{
						        	reportRDFName = "CM_WRR.rdf";
						      	}
						    }
						    else // i.e. Interim Return report required
						    {
						    	reportRDFName = "CM_WRRI.rdf";
						    }
						    
						    // Run report
						    requestReport(reportRDFName);
						}
					 
					 	// Never allow navigation as are calling a report service, not a form/subform
						return false;
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
		}
	]
}
