/** 
 * @fileoverview SysDate.js:
 * This file contains the field configurations for the Override System Date screen.
 * The purpose of the screen is to allow a user to enter a date which will be used
 * as the current system date.
 *
 * @author Alex Peterson
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.APP_PAGE_XPATH = "/ds/var/app";

/****************************** MAIN FORM *****************************************/

function overrideDate() {};

/********************************* FIELDS ******************************************/

function OverrideSystem_Date() {};
OverrideSystem_Date.dataBinding = XPathConstants.APP_PAGE_XPATH + "/OverrideSystemDate";
OverrideSystem_Date.weekends = true;
OverrideSystem_Date.tabIndex = 1;
OverrideSystem_Date.helpText = "Enter date to use instead of the real system date";

/*********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 10;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "overrideDate", alt: true } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	Services.setValue(OverrideSystem_Date.dataBinding, "");
	Services.setFocus("OverrideSystem_Date");
};

/**********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 11;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "overrideDate" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.actionBinding = function()
{
	var date = Services.getValue(OverrideSystem_Date.dataBinding);
	if ( CaseManUtils.isBlank(date) )
	{
	 	alert ("Using current system date from central server");
	}
	else
	{
		alert ("Warning! : 'Today' is set to be " + date);
	}
	Services.navigate(NavigationController.MAIN_MENU);
};
