/** 
 * @fileoverview MaintainJudgment_MenuBarCode.js:
 * Configurations for the UC004 (Manage Judgments) Navigation Buttons
 *
 * @author Chris Vincent
 * 03/07/2006 - Chris Vincent, Added enablement rule for the Transfer Case & Bar on Judgment 
 * 				buttons so disabled if user does not have access to the screens.
 * 03/09/2007 - Chris Vincent, updated the Transfer Cases validation so now will make a call to 
 * 				checkOutstandingPaymentsExist() which makes a service call to determine if payments
 * 				are actually outstanding.  CaseMan Defect 6420.
 * 03/10/2007 - Chris Vincent, as part of UCT_Group2 Defect 1413, the Print Judgment Orders button
 * 				config changed to call different service if court is CCBC.
 * 29-07-2009 - Chris Vincent - Changes to the Transfer Cases navigation functionality (both guard and prepare functions)
 *		    		as Outstanding Payments validation check no longer required.  See TRAC Ticket 1155.
 */

menubar = {
	quickLinks: [
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
						if ( JudgmentFunctions.isSaveRequired() == true )
						{
							alert(Messages.SAVE_JUDGMENT_MESSAGE);
							return false;
						}
						
						var ec = null;
						if ( Services.getValue("/ds/MaintainJudgment/OutstandingWarrant") == "true" )
						{
							// Cannot transfer a case with an outstanding warrant
							ec = ErrorCode.getErrorCode("CaseMan_cannotTransferCaseOustandingWarrant_Msg");
							Services.setTransientStatusBarMessage( ec.getMessage() );
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
						JudgmentFunctions.setAppCaseNumberParameter(TransferCaseParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Judgments screen
						var navArray = new Array( NavigationController.JUDGMENT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.TRANSFER_CASE_FORM); }
		},
		{
			id: "NavBar_PrintJudgOrdersButton",
			formName: NavigationController.MAIN_MENU,
			label: "Print Judgment Orders",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						if( JudgmentFunctions.isSaveRequired() == true )
						{
							alert(Messages.SAVE_JUDGMENT_MESSAGE);
							return false;
						}
						
						// If the selected judgment has been set aside then display a warning in the status bar
						if (Services.getValue(JudgmentDetails_Status.dataBinding) == JudgmentVariables.STATUS_SET_ASIDE)
						{
							Services.setTransientStatusBarMessage(Messages.ERR_JUDGMENT_SET_ASIDE_MESSAGE);
						}
						else
						{
							// Otherwise call the report service...
							// Get the data that needs to be passed to the service
							var judgmentId        = Services.getValue(Master_AgainstGrid.dataBinding);
							var caseNumber        = Services.getValue(Header_CaseNumber.dataBinding);
							var casePartyNumber   = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[SurrogateId='" + judgmentId + "']/CasePartyNumber");
							var casePartyRoleCode = Services.getValue(JudgmentVariables.JUDGMENT_PATH + "[SurrogateId='" + judgmentId + "']/PartyRoleCode");
							// UCT_Group2 Defect 1413, CCBC have slightly different requirements to non-CCBC.
							var serviceName = (JudgmentFunctions.isCCBCCourt()) ? "getCcbcJudgmentOrderOutputs" : "getJudgmentOrderOutputs";
																				
							var params = new ServiceParams();
							params.addSimpleParameter("judgmentId", judgmentId);
							params.addSimpleParameter("caseNumber", caseNumber);
							params.addSimpleParameter("casePartyNumber", casePartyNumber);
							params.addSimpleParameter("casePartyRole", casePartyRoleCode);
							// Call the service to fetch the info for the judgment
							Services.callService(serviceName, params, MenuBarPrintJudgmentOrders, true);	
						}
						return false;
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_BarJudgmentButton",
			formName: NavigationController.BARJUDGMENT_FORM,
			label: "Bar Judgmt/Enfmt",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:   function() 
					 {
						if( JudgmentFunctions.isSaveRequired() == true )
						{
							alert(Messages.SAVE_JUDGMENT_MESSAGE);
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
						// Set the Bar Judgment parameters
						JudgmentFunctions.setAppCaseNumberParameter(BarJudgmentParams.CASE_NUMBER);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array( NavigationController.JUDGMENT_FORM );
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true,
			isEnabled: function() { return Services.hasAccessToForm(NavigationController.BARJUDGMENT_FORM); }
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
