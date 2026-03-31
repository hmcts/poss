/** 
 * @fileoverview MaintainPaymentMenuBar.js:
 * Configurations for UC061 (Maintain Payments) nav buttons and nav functions.
 *
 * @author Steve Blair
 */

//-----------------------------------------------------------------------------------------------
//                                        MENU BAR
//-----------------------------------------------------------------------------------------------

function Navigation_CreateCaseBtn() {};
function Navigation_CaseEventsBtn() {};
function Navigation_WarrantsBtn() {};
function Navigation_AeBtn() {};
function Navigation_CoBtn() {};

Navigation_CreateCaseBtn.tabIndex = 30;
/**
 * @author tzzmr4
 * @return null 
 */
Navigation_CreateCaseBtn.actionBinding = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	
	if(inQueryMode()) {
		Services.setTransientStatusBarMessage(Messages.ENFORCEMENT_NOT_SELECTED);
		return;
	}
	else if(enforcementType == "CO") {
		Services.setTransientStatusBarMessage(Messages.NAVIGATION_CASE_NOT_ALLOWED);
		return;
	}
	
	var caseNumber = Services.getValue(ENFORCEMENT_XPATH + "/CaseNumber");
	Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
	navigateToScreen(NavigationController.CASES_FORM);
}

Navigation_CaseEventsBtn.tabIndex = 31;
/**
 * @author tzzmr4
 * @return null 
 */
Navigation_CaseEventsBtn.actionBinding = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	
	if(inQueryMode()) {
		Services.setTransientStatusBarMessage(Messages.ENFORCEMENT_NOT_SELECTED);
		return;
	}
	else if(enforcementType == "CO") {
		Services.setTransientStatusBarMessage(Messages.NAVIGATION_CASE_EVENTS_NOT_ALLOWED);
		return;
	}
	
	var caseNumber = Services.getValue(ENFORCEMENT_XPATH + "/CaseNumber");
	Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
	navigateToScreen(NavigationController.EVENTS_FORM);
}

Navigation_WarrantsBtn.tabIndex = 32;
/**
 * @author tzzmr4
 * @return null 
 */
Navigation_WarrantsBtn.actionBinding = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
				
	if(inQueryMode()) {
		Services.setTransientStatusBarMessage(Messages.MUST_SELECT_WARRANT);
		return;
	}
	else if(enforcementType != "HOME WARRANT" && enforcementType != "FOREIGN WARRANT") {
		Services.setTransientStatusBarMessage(Messages.ENFORCEMENT_MUST_BE_WARRANT);
		return;
	}
	
	var warrantId = Services.getValue(ENFORCEMENT_XPATH + "/WarrantID");
	Services.setValue(MaintainWarrantsParams.WARRANT_ID, warrantId);
	navigateToScreen(NavigationController.WARRANT_FORM);
}

Navigation_AeBtn.tabIndex = 33;
/**
 * @author tzzmr4
 * @return null 
 */
Navigation_AeBtn.actionBinding = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	
	if(inQueryMode()) {
		Services.setTransientStatusBarMessage(Messages.ENFORCEMENT_NOT_SELECTED);
		return;
	}
	else if(enforcementType == "CO") {
		Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_AE);
		return;
	}
	
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	var caseNumber = Services.getValue(ENFORCEMENT_XPATH + "/CaseNumber");
	var aeNumber = Services.getValue(ENFORCEMENT_XPATH + "/Number");
	Services.setValue(ManageAEParams.CASE_NUMBER, caseNumber);
	if(enforcementType == "AE") {
		Services.setValue(ManageAEParams.AE_NUMBER, aeNumber);
	}
	navigateToScreen(NavigationController.MANAGE_AE_FORM);
}

Navigation_CoBtn.tabIndex = 34;
/**
 * @author tzzmr4
 * @return null 
 */
Navigation_CoBtn.actionBinding = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	
	if(inQueryMode()) {
		Services.setTransientStatusBarMessage(Messages.ENFORCEMENT_NOT_SELECTED);
		return;
	}
	else if(enforcementType != "CO") {
		Services.setTransientStatusBarMessage(Messages.CANNOT_NAVIGATE_CO);
		return;
	}
	
	var coNumber = Services.getValue(ENFORCEMENT_XPATH + "/Number");
	Services.setValue(ManageCOParams.CO_NUMBER, coNumber);
	navigateToScreen(NavigationController.MAINTAINCO_FORM);
}

/**
 * @param screen
 * @author tzzmr4
 * 
 */
function navigateToScreen(screen)
{
	// Start of Day navigation occurs before screen init updates so we don't
	// want to set this flag in that case.
	if(screen != StartOfDayUtils.SUITORS_CASH_START_OF_DAY_SCREEN) {
		Services.setValue(IS_NAVIGATING_XPATH, "true");
	}
	
	if(NavigationController.callStackExists()) {
		NavigationController.resetCallStack();
	}
	var navArray = new Array(screen, NavigationController.MAINTAIN_PAYMENT_FORM);
	NavigationController.createCallStack(navArray);
	exitScreen();
}
