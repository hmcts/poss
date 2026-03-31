/** 
 * @fileoverview ViewPayments_MenuBarCode.js:
 * Configurations for the UC110 (View Payments) Navigation Buttons
 *
 * @author Tim Connor, Chris Vincent
 */

menubar = {
    	quickLinks: [
			{
				id: "NavBar_ViewDividendsButton",
				formName: NavigationController.VIEW_DIVIDENDS_FORM,
				label: "View Dividends",
/**
 * @author fzj0yl
 * @return boolean 
 */
				guard:   function() 
						 {
						 	var ec = null;
						 	var enfType = Services.getValue(Header_EnforcementType.dataBinding);
							if ( enfType != "CO" )
							{
								// Enforcement type must be 'CO', else throw error message
								ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToDividendsCOScreenWrongEnfType_Msg");
								Services.setTransientStatusBarMessage(ec.getMessage());
							}
							
							var dividendsExist = Services.getValue(XPathConstants.ENFORCEMENT_XPATH + "/DividendsExist");
							if ( null == ec && dividendsExist != "true" )
							{
								// No dividends exist on the CO, throw error message
								ec = ErrorCode.getErrorCode("CaseMan_noDividendsExistForCO_Msg");
								Services.setTransientStatusBarMessage( ec.getMessage() );
							}
							
						 	return ( null == ec ) ? true : false;
						 },
/**
 * @author fzj0yl
 * 
 */
				prepare: function() 
						 {
							// Set the View Dividends parameters
							var coNumber = Services.getValue(Header_EnforcementNumber.dataBinding);
							Services.setValue(ViewDividendsParams.CO_NUMBER, coNumber);
					
							// Set up the Call Stack to return to the View Payments screen
							var navArray = new Array( NavigationController.VIEW_PAYMENTS_FORM );
							NavigationController.createCallStack(navArray);	
						 },
				onMenuBar: true
			},
    		{
    			id: "NavBar_AuditButton",
    			label: "Audit",
    			subformId: "auditSubform",
/**
 * @author fzj0yl
 * 
 */
    			guard: function() { return false; },
    			onMenuBar: true
    		}
    	]
}
