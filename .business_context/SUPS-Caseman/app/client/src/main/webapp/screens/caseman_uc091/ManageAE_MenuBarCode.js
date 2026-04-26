/** 
 * @fileoverview ManageAE_MenuBarCode.js:
 * Configurations for the UC091 (Manage AE) Navigation Buttons
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 10/07/2006 - Chris Vincent, added extra validation to the Judgments nav button 
 * 				preventing navigation for MAGS ORDER AEs.
 */

menubar = {
	quickLinks: [
	
		{
			id: "NavBar_AeEventsButton",
			formName: NavigationController.AE_EVENTS_FORM,
			label: "AE Events",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	function() 
                    {
						var ec = null;                      
						if( CaseManUtils.isBlank( Services.getValue(AEDetails_AENumber.dataBinding) ) )
						{
							// An existing AE must be selected to navigate to the AE Events screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToAEEventScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						else if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// Dirty Flag check
					 		var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
					 		var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
					 		Services.setValue(ManageAEEventsParams.CASE_NUMBER, caseNumber);
					 		Services.setValue(ManageAEEventsParams.AE_NUMBER, aeNumber);
					 		
					 		var navArray = Array(NavigationController.AE_EVENTS_FORM, NavigationController.MANAGE_AE_FORM);
					 		NavigationController.createCallStack(navArray);
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_NAVIGATE);
							Status_SaveBtn.actionBinding();
							return false;
						} 
						return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: 	function() 
					 	{
					 		// Set the AE Events parameters
					 		var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
					 		var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
					 		Services.setValue(ManageAEEventsParams.CASE_NUMBER, caseNumber);
					 		Services.setValue(ManageAEEventsParams.AE_NUMBER, aeNumber);
					 		var navArray = Array(NavigationController.MANAGE_AE_FORM);
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
			guard:	function() 
					{
						var ec = null;
						if( CaseManUtils.isBlank( Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber") ) )
						{
							// A Case must be loaded to navigate to the Case Events screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreen_Msg");
						    Services.setTransientStatusBarMessage( ec.getMessage() );						    
						}                          
						else if( Services.getValue(AEDetails_Application_Type_Code.dataBinding) == AETypeCodes.MAGSORDER )
						{
							// A Non MAGS ORDER Case must be loaded to navigate to the Case Events screen
						    ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToEventsScreenWithMAGSORDER_Msg");
						    Services.setTransientStatusBarMessage( ec.getMessage() );
						}
						else if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// Dirty Flag Check
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
							
					 		var navArray = Array(NavigationController.EVENTS_FORM, NavigationController.MANAGE_AE_FORM);
					 		NavigationController.createCallStack(navArray);
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_NAVIGATE);
			                Status_SaveBtn.actionBinding();
			                return false;
						}
                          
						return ( null == ec ) ? true : false;                                					 	
					},
/**
 * @author rzxd7g
 * 
 */
			prepare:	function() 
						{
							// Set the Case Events parameters
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
							var navArray = Array(NavigationController.MANAGE_AE_FORM);
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
			id: "NavBar_ManageCaseButton",
			formName: NavigationController.CASES_FORM,
			label: "Cases",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:	function() 
					{
						var ec = null;                        
						if( CaseManUtils.isBlank( Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber") ) )
						{
							// A case must be loaded to navigate to the Manage Case screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToCasesScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
						}
                        else if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
			            {
			            	// Dirty Flag check
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
							
					 		var navArray = Array(NavigationController.CASES_FORM, NavigationController.MANAGE_AE_FORM);
					 		NavigationController.createCallStack(navArray);
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_NAVIGATE);
							Status_SaveBtn.actionBinding();
							return false;
			            }
						return ( null == ec ) ? true : false;
					 },
/**
 * @author rzxd7g
 * 
 */
			prepare:	function() 
						{
							// Set the Manage Case parameters
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
							var navArray = Array(NavigationController.MANAGE_AE_FORM);
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
			guard:  function() 
					{
						var ec = null;
						if( CaseManUtils.isBlank( Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber") ) )
						{
							// A case must be loaded to navigate to the Judgments screen
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreen_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );						  
						}
						else if( Services.getValue(AEDetails_Application_Type_Code.dataBinding) == AETypeCodes.MAGSORDER )
						{
							// A Non MAGS ORDER Case must be loaded to navigate to the Judgments screen
						    ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreenWithMAGSORDER_Msg");
						    Services.setTransientStatusBarMessage( ec.getMessage() );
						}
                        else if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
			            {
			            	// Dirty Flag check
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
							
					 		var navArray = Array(NavigationController.JUDGMENT_FORM, NavigationController.MANAGE_AE_FORM);
					 		NavigationController.createCallStack(navArray);
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_NAVIGATE);
							Status_SaveBtn.actionBinding();
							return false;
			            }
  
						return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare:	function() 
					 	{
							// Set the Maintain Judgments parameters
							var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
							Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
							var navArray = new Array( NavigationController.MANAGE_AE_FORM );
							NavigationController.createCallStack(navArray);	
						},
			onMenuBar: true
		},
		{
			id: "NavBar_QueryAEButton",
			formName: NavigationController.QUERYBYPARTYAE_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * @return boolean 
 */
            guard:	function() 
					{			           		           
						if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
						{
							// Dirty Flag check
					 		var navArray = Array(NavigationController.QUERYBYPARTYAE_FORM, NavigationController.MANAGE_AE_FORM);
					 		NavigationController.createCallStack(navArray);
					 		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_NAVIGATE);
							Status_SaveBtn.actionBinding();
							return false;
						}
						return true;
			         },
/**
 * @author rzxd7g
 * 
 */
			prepare:	function() 
					 	{
							var navArray = Array(NavigationController.MANAGE_AE_FORM);
							NavigationController.createCallStack(navArray);	
						},
			onMenuBar: true
		}
	]
}
