/** 
 * @fileoverview CalculatePERateCommon.js:
 * This file contains common code for use case UC102 - AE calculate protected earnings rate 
 * and use case UC115 - CO calculate protected earnings rate 
 *
 * @author Ian Stainer
 * @version 0.1
 *
 * Change History:
 * 20/06/2006 - Chris Vincent, Changed global variables to class variables and added javadoc 
 *				style comments to all helper functions.
 * 04/10/2006 - Chris Vincent, Defect 5586 - StandardAllowances_Popup_Code.validate() function
 * 				updated so will ensure that an allowance code filtered out of the LOV Popup cannot
 * 				be entered manually by checking for the allowance in the LOV Grid srcData.
 * 04/01/2007 - Chris Vincent, Temp_CaseMan defect 331 fixed by changing filterStandardAllowanceRefData()
 * 				so that an allowance is removed from the list of values if it has already been selected
 * 				regardless of whether or not multiples are allowed.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Removed CurrencySymbols and CurrencyCodes.  Temp_CaseMan Defect 309.
 */

/******************************* CONSTANTS *****************************************/

/**
 * Enumeration of popup modes.
 * @author kznwpr
 * 
 */
function PopupMode() {}
PopupMode.ADD = "Add";
PopupMode.EDIT = "Edit";

/**
 * Enumeration of standard allowances
 * @author kznwpr
 * 
 */
function StandardAllowances() {}
StandardAllowances.PERSONAL_ALLOWANCES	= "Personal Allowances";
StandardAllowances.PREMIUMS 			= "Premiums";
StandardAllowances.OTHER_LIABILITIES 	= "Other Liabilities";
StandardAllowances.OTHER_RESOURCES 		= "Other Resources";

/**
 * Enumeration of calculated periods
 * @author kznwpr
 * 
 */
function CalculatedPeriods() {}
CalculatedPeriods.WEEKLY = "WK";
CalculatedPeriods.MONTHLY = "MTH";

/**
 * Enumeration of status types. These define the states that any standard allowance can be in.
 * @author kznwpr
 * 
 */
function Status() {}
Status.NEW = "NEW";
Status.EXISTING = "EXISTING";
Status.MODIFIED = "MODIFIED";

/**
 * Enumeration of total status values used to indicate whether or not a total has previously been saved
 * @author kznwpr
 * 
 */
function TotalStatus() {}
TotalStatus.NEW      = "NEW";
TotalStatus.EXISTING = "EXISTING";

/**
 * Actions After Saving
 * @author kznwpr
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_RUNPERREPORT = "PER_REPORT";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";

/**
 * XPath Constants
 * @author kznwpr
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT = XPathConstants.REF_DATA_XPATH + "/StandardAllowances/PersonalAllowances";
XPathConstants.PREMIUMS_REF_DATA_ROOT = XPathConstants.REF_DATA_XPATH + "/StandardAllowances/Premiums";
XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT = XPathConstants.REF_DATA_XPATH + "/StandardAllowances/OtherLiabilities";
XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT = XPathConstants.REF_DATA_XPATH + "/StandardAllowances/OtherResources";
XPathConstants.BUSINESS_DATA_BINDING_ROOT = "/ds/CalculatePER";
XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./SurrogateId = ";
XPathConstants.PREMIUMS_DATA_BINDING_ROOT = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./SurrogateId = ";
XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./SurrogateId = ";
XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./SurrogateId = ";
XPathConstants.SELECTED_STANDARD_ALLOWANCE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedStandardAllowance"; // Set before raising the standard allowance popup so that it knows which data to display
XPathConstants.SAVED_ALLOWANCES_XPATH = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/SavedAllowances";
XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/StandardAllowance";
XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH = XPathConstants.VAR_FORM_XPATH + "/UnselectedPersonalAllowances" // The personal allowances that have not been selected in the personal allowances grid
XPathConstants.FILTERED_PREMIUMS_XPATH = XPathConstants.VAR_FORM_XPATH + "/UnselectedPremiums" // The premiums that have not been selected in the premiums grid
XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH	= XPathConstants.VAR_FORM_XPATH + "/UnselectedLiabilities" // The liabilities that have not been selected in the liabilities grid
XPathConstants.FILTERED_OTHER_RESOURCES_XPATH = XPathConstants.VAR_FORM_XPATH + "/UnselectedResources" // The resources that have not been selected in the resources grid
XPathConstants.EVENT_857_COUNT_XPATH = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Event857Count";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.POPUP_MODE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/PopupMode";
XPathConstants.TOTALS_DATA_BINDING_ROOT = XPathConstants.VAR_PAGE_XPATH + "/Totals";
XPathConstants.NUMBER_READ_ONLY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NumberFieldReadOnly";
XPathConstants.AMOUNT_READ_ONLY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/AmountFieldReadOnly";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.LASTCALCULATEDPERIOD_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/LastCalculatedPeriodValue";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ActionAfterSave";
XPathConstants.STANDARD_ALLOWANCES_POPUP_GROUP_XPATH = XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Group";

/******************************* GRIDS *********************************************/

function PersonalAllowancesGrid() {};
PersonalAllowancesGrid.tabIndex = 30;
PersonalAllowancesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/PersonalAllowancesGrid/SelectedRow";
PersonalAllowancesGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance/DeleteFlag"];
PersonalAllowancesGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances";
PersonalAllowancesGrid.rowXPath = "Allowance[./DeleteFlag='N']";
PersonalAllowancesGrid.keyXPath = "SurrogateId";
PersonalAllowancesGrid.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Description"},
	{xpath: "DefaultAllowanceCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "DefaultAllowance", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},
	{xpath: "Number", sort: "numerical"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Amount", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},
	{xpath: "DateEntered", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},	
	{xpath: "CreatedBy"}
];

/*********************************************************************************/

function PremiumsGrid() {};
PremiumsGrid.tabIndex = 30;
PremiumsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "PremiumsGrid/SelectedRow";
PremiumsGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium/DeleteFlag"];
PremiumsGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums";
PremiumsGrid.rowXPath = "Premium[./DeleteFlag='N']";
PremiumsGrid.keyXPath = "SurrogateId";
PremiumsGrid.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Description"},
	{xpath: "DefaultAllowanceCurrency", transformToDisplay: transformCurrencyToDisplay},	
	{xpath: "DefaultAllowance", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},
	{xpath: "Number", sort: "numerical"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},	
	{xpath: "Amount", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},	
	{xpath: "DateEntered", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},	
	{xpath: "CreatedBy"}
];

/*********************************************************************************/

function OtherLiabilitiesGrid() {};
OtherLiabilitiesGrid.tabIndex = 30;
OtherLiabilitiesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/LiabilitiesGrid/SelectedRow";
OtherLiabilitiesGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability/DeleteFlag"];
OtherLiabilitiesGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities";
OtherLiabilitiesGrid.rowXPath = "Liability[./DeleteFlag='N']";
OtherLiabilitiesGrid.keyXPath = "SurrogateId";
OtherLiabilitiesGrid.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Description"},
	{xpath: "DefaultAllowanceCurrency", transformToDisplay: transformCurrencyToDisplay},		
	{xpath: "DefaultAllowance", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},
	{xpath: "Number", sort: "numerical"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},		
	{xpath: "Amount", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},	
	{xpath: "DateEntered", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},	
	{xpath: "CreatedBy"}
];

/*********************************************************************************/

function OtherResourcesGrid() {};
OtherResourcesGrid.tabIndex = 30;
OtherResourcesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/ResourcesGrid/SelectedRow";
OtherResourcesGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource/DeleteFlag"];
OtherResourcesGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources";
OtherResourcesGrid.rowXPath = "Resource[./DeleteFlag='N']";
OtherResourcesGrid.keyXPath = "SurrogateId";
OtherResourcesGrid.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Description"},
	{xpath: "DefaultAllowanceCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "DefaultAllowance", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},
	{xpath: "Number", sort: "numerical"},
	{xpath: "AmountCurrency", transformToDisplay: transformCurrencyToDisplay},	
	{xpath: "Amount", sort: "numerical", transformToDisplay: CaseManUtils.transformAmountToTwoDP},	
	{xpath: "DateEntered", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},	
	{xpath: "CreatedBy"}
];

/******************************* DATA BINDINGS *************************************/

Main_CalculatedPeriod.dataBinding = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CalculatedPeriod";

StandardAllowances_Popup_Code.dataBinding 				= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Code";
StandardAllowances_Popup_Description.dataBinding 		= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Description";
StandardAllowances_Popup_Allowance.dataBinding 			= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/DefaultAllowance";
StandardAllowances_Popup_AllowanceCurrency.dataBinding 	= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/DefaultAllowanceCurrency";
StandardAllowances_Popup_Number.dataBinding 			= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Number";
StandardAllowances_Popup_Amount.dataBinding 			= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Amount";
StandardAllowances_Popup_AmountCurrency.dataBinding		= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/AmountCurrency";
StandardAllowances_Popup_DateEntered.dataBinding 		= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/DateEntered";
StandardAllowances_Popup_CreatedBy.dataBinding 			= XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/CreatedBy";

Totals_PersonalAllowances.dataBinding			= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/PersonalAllowances";
Totals_PersonalAllowancesCurrency.dataBinding	= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency";
Totals_Premiums.dataBinding 					= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Premiums";
Totals_PremiumsCurrency.dataBinding				= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency";
Totals_OtherLiabilities.dataBinding				= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/OtherLiabilities";
Totals_OtherLiabilitiesCurrency.dataBinding		= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency";
Totals_OtherResources.dataBinding				= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/OtherResources";
Totals_OtherResourcesCurrency.dataBinding		= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency";
Totals_Total.dataBinding						= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Total";
Totals_TotalCurrency.dataBinding				= XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency";

/*********************************** TABS ******************************************/

function myTabSelector() {};
myTabSelector.tabIndex = 20;
myTabSelector.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

/******************************* LOV POPUPS ****************************************/

function PersonalAllowancesLOV() {};
PersonalAllowancesLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Code";
PersonalAllowancesLOV.srcData = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH;
PersonalAllowancesLOV.rowXPath = "Allowance";
PersonalAllowancesLOV.keyXPath = "Code";
PersonalAllowancesLOV.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
PersonalAllowancesLOV.styleURL = "/css/StandardAllowancesLOVGrid.css";
PersonalAllowancesLOV.destroyOnClose = false;

/*********************************************************************************/

function PremiumsLOV() {};
PremiumsLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Code";
PremiumsLOV.srcData = XPathConstants.FILTERED_PREMIUMS_XPATH;
PremiumsLOV.rowXPath = "Premium";
PremiumsLOV.keyXPath = "Code";
PremiumsLOV.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
PremiumsLOV.styleURL = "/css/StandardAllowancesLOVGrid.css";
PremiumsLOV.destroyOnClose = false;

/*********************************************************************************/

function OtherLiabilitiesLOV() {};
OtherLiabilitiesLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Code";
OtherLiabilitiesLOV.srcData = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH;
OtherLiabilitiesLOV.rowXPath = "Liability";
OtherLiabilitiesLOV.keyXPath = "Code";
OtherLiabilitiesLOV.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
OtherLiabilitiesLOV.styleURL = "/css/StandardAllowancesLOVGrid.css";
OtherLiabilitiesLOV.destroyOnClose = false;

/*********************************************************************************/

function OtherResourcesLOV() {};
OtherResourcesLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Code";
OtherResourcesLOV.srcData = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH;
OtherResourcesLOV.rowXPath = "Resource";
OtherResourcesLOV.keyXPath = "Code";
OtherResourcesLOV.columns = [
	{xpath: "Code", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
OtherResourcesLOV.styleURL = "/css/StandardAllowancesLOVGrid.css";
OtherResourcesLOV.destroyOnClose = false;

// This logic is fired for all four LOVs
OtherResourcesLOV.logicOn = [OtherResourcesLOV.dataBinding];
OtherResourcesLOV.logic = function(event) {
	var value = Services.getValue(OtherResourcesLOV.dataBinding);
	if (!CaseManUtils.isBlank(value))
	{
		// Check that the value has not changed
		var oldValue = Services.getValue(XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Code");
		if(oldValue == value)
		{
			return;
		}
	
		Services.startTransaction();
		// Set the code field.  This will result in the code logic being called, just
		// as if the user had keyed in the code manually.
		Services.setValue(XPathConstants.STANDARD_ALLOWANCE_POPUP_XPATH + "/Code", value);

		// Now reset the value in the LOV
		Services.setValue(OtherResourcesLOV.dataBinding, null);
		
		Services.endTransaction();
	}
}

/******************************* MAIN FUNCTIONS ************************************/

/**
 * Function indicates whether or not changes have been made on the screen.
 *
 * @returns [Boolean] True if changes have been made, else false.
 * @author kznwpr
 */
function changesMade()
{
	var personal_allowances_added	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./Status = '" + Status.NEW+ "']";
	var premiums_added				= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./Status = '" + Status.NEW+ "']";
	var other_liabilities_added 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./Status = '" + Status.NEW+ "']";
	var other_resources_added		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./Status = '" + Status.NEW+ "']";
	
	var personal_allowances_changed	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./Status = '" + Status.MODIFIED+ "']";
	var premiums_changed			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./Status = '" + Status.MODIFIED+ "']";
	var other_liabilities_changed 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./Status = '" + Status.MODIFIED+ "']";
	var other_resources_changed		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./Status = '" + Status.MODIFIED+ "']";
	
	var standardAllowances = [
		personal_allowances_added, premiums_added, other_liabilities_added, other_resources_added,
		personal_allowances_changed, premiums_changed, other_liabilities_changed, other_resources_changed
	];	
		
	// Deal with all 4 categories of standard allowances
	for (var i = 0; i < standardAllowances.length; i ++)
	{
		if (Services.countNodes(standardAllowances[i]) > 0) {return true;}	
	}
	
	return false;	
}

/*********************************************************************************/

/**
 * Returns whether or not there are standard allowances in any of the four grids
 * which are still active and have not been deleted.
 *
 * @returns [Boolean] True if standard allowances exist, else false.
 * @author kznwpr
 */
function standardAllowancesExist()
{
	var personal_allowances_exist	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./DeleteFlag = 'N']";
	var premiums_exist 				= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./DeleteFlag = 'N']";
	var other_liabilities_exist	 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./DeleteFlag = 'N']";
	var other_resources_exist 		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./DeleteFlag = 'N']";
	
	var standardAllowancesExist = [personal_allowances_exist, premiums_exist, other_liabilities_exist, other_resources_exist];	
		
	// Deal with all 4 categories of standard allowances
	for (var i = 0; i < standardAllowancesExist.length; i ++)
	{
		if (Services.countNodes(standardAllowancesExist[i]) > 0) {return true;}	
	}
	
	return false;
}

/*********************************************************************************/

/**
 * Function to handle closing the screen down and returning to the previous screen.
 * @author kznwpr
 * 
 */
function exitScreen()
{
	// Clean the app params used by the PER Calculator screens
	Services.removeNode(PERCalculatorParams.PARENT);
	if ( NavigationController.callStackExists() ) 
	{
		// Go back to calling screen
		NavigationController.nextScreen();
	}
	else
	{
		// No next screen to go to, return to main menu
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Calculate the totals for the 4 categories of standard allowance and updates the DOM
 * @author kznwpr
 * 
 */
function calculateTotals()
{
	// Calculate the total for personal allowances
	setSelectedStandardAllowance(StandardAllowances.PERSONAL_ALLOWANCES);
	setTotalForCategory();						
	// Calculate the total for premiums
	setSelectedStandardAllowance(StandardAllowances.PREMIUMS);
	setTotalForCategory();						
	// Calculate the total for other liabilities
	setSelectedStandardAllowance(StandardAllowances.OTHER_LIABILITIES);
	setTotalForCategory();						
	// Calculate the total for other resources
	setSelectedStandardAllowance(StandardAllowances.OTHER_RESOURCES);
	setTotalForCategory();	
}

/*********************************************************************************/

/**
 * This function returns a boolean indicating whether or not the buttons can be enabled.
 * The value is based upon whether or not the per calculated period drop down has a valid value.
 *
 * @returns [Boolean] True if the buttons can enable, else false.
 * @author kznwpr
 */
function buttonsCanEnable()
{
	return !CaseManUtils.isBlank(Services.getValue(Main_CalculatedPeriod.dataBinding)) && 		
	CaseManValidationHelper.validateFields(["Main_CalculatedPeriod"])
}

/*********************************************************************************/

/**
 * Function returns the default currency code (e.g. GBP or EUR) from the reference data
 *
 * @returns [String] The current default currency code
 * @author kznwpr
 */
function getDefaultCurrencyCode()
{
	var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	return defaultCurrency;
}

/*********************************************************************************/

/**
 * Function to clear out any data stored in the part of the dom that the standard 
 * allowance popup is bound to.
 * @author kznwpr
 * 
 */
function resetStandardAllowance()
{
	var myXPaths = [StandardAllowances_Popup_Code.dataBinding,
					XPathConstants.STANDARD_ALLOWANCES_POPUP_GROUP_XPATH,
					StandardAllowances_Popup_Description.dataBinding,
					StandardAllowances_Popup_Allowance.dataBinding,
					StandardAllowances_Popup_AllowanceCurrency.dataBinding,
					StandardAllowances_Popup_Number.dataBinding,
					StandardAllowances_Popup_Amount.dataBinding,
					StandardAllowances_Popup_AmountCurrency.dataBinding,
					StandardAllowances_Popup_DateEntered.dataBinding,
					StandardAllowances_Popup_CreatedBy.dataBinding];

	// Prevent unnecessary events from being fired until all the changes have been made to the dom
	Services.startTransaction();

	for (var i = 0; i < myXPaths.length; i ++)
	{
		Services.setValue(myXPaths[i], "");	
	}
	
	// Indicate that the dom events should now be fired
	Services.endTransaction();			
}

/*********************************************************************************/

/**
 * Function to set data in the part of the dom that the
 * standard allowance popup is bound to in preparation
 * for it to be edited when called from the personal allowances tab page
 * @author kznwpr
 * 
 */
function loadPersonalAllowanceEditData()
{
	loadEditDataForCategory(XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT + PersonalAllowancesGrid.dataBinding);
}

/*********************************************************************************/


/**
 * Function to set data in the part of the dom that the
 * standard allowance popup is bound to in preparation
 * for it to be edited when called from the premiums tab page.
 * @author kznwpr
 * 
 */
function loadPremiumsEditData()
{
	loadEditDataForCategory(XPathConstants.PREMIUMS_DATA_BINDING_ROOT + PremiumsGrid.dataBinding);
}

/*********************************************************************************/

/**
 * Function to set data in the part of the dom that the
 * standard allowance popup is bound to in preparation
 * for it to be edited when called from the other liabilities tab page.
 * @author kznwpr
 * 
 */
function loadOtherLiabilityEditData()
{
	loadEditDataForCategory(XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT + OtherLiabilitiesGrid.dataBinding);
}

/*********************************************************************************/

/**
 * Function to set data in the part of the dom that the
 * standard allowance popup is bound to in preparation
 * for it to be edited when called from the other resources tab page.
 * @author kznwpr
 * 
 */
function loadOtherResourceEditData()
{
	loadEditDataForCategory(XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT + OtherResourcesGrid.dataBinding);
}

/*********************************************************************************/

/**
 * Function copies the data for an existing allowance record to the popup for editing.
 *
 * @param [String] categoryXpath The root xpath for the data to be copied.
 * @author kznwpr
 * 
 */
function loadEditDataForCategory(categoryXpath)
{
	// Prevent unnecessary events from being fired until all the changes have been made to the dom
	Services.startTransaction();

	Services.setValue(StandardAllowances_Popup_Code.dataBinding, Services.getValue(categoryXpath + "]/Code"));
	Services.setValue(StandardAllowances_Popup_Description.dataBinding, Services.getValue(categoryXpath + "]/Description"));
	Services.setValue(StandardAllowances_Popup_Allowance.dataBinding, Services.getValue(categoryXpath + "]/DefaultAllowance"));
	Services.setValue(StandardAllowances_Popup_AllowanceCurrency.dataBinding, Services.getValue(categoryXpath + "]/DefaultAllowanceCurrency"));
	Services.setValue(StandardAllowances_Popup_Number.dataBinding, Services.getValue(categoryXpath + "]/Number"));
	Services.setValue(StandardAllowances_Popup_Amount.dataBinding, Services.getValue(categoryXpath + "]/Amount"));
	Services.setValue(StandardAllowances_Popup_AmountCurrency.dataBinding, Services.getValue(categoryXpath + "]/AmountCurrency"));	
	Services.setValue(StandardAllowances_Popup_DateEntered.dataBinding, Services.getValue(categoryXpath + "]/DateEntered"));
	Services.setValue(StandardAllowances_Popup_CreatedBy.dataBinding, Services.getValue(categoryXpath + "]/CreatedBy"));
		
	// Indicate that the dom events should now be fired
	Services.endTransaction();			
}

/*********************************************************************************/

/**
 * Function returns the next temporary surrogate key to be used for new parties and 
 * addresses.
 *
 * @return [String] The next surrogate key in the sequence
 * @author kznwpr
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/*********************************************************************************/

/**
 * This function must be invoked prior to raising the standard allowance popup
 * It sets the standard allowance type so that the popup will know which data
 * to display (1 of the following: personal allowances, premiums, other liabilities or other resources).
 *
 * @param [String] standardAllowance The type of allowance to be referenced in the popup
 * @author kznwpr
 * 
 */
function setSelectedStandardAllowance(standardAllowance)
{
	Services.setValue(XPathConstants.SELECTED_STANDARD_ALLOWANCE_XPATH, standardAllowance);
}

/*********************************************************************************/

/**
 * This function returns which type of standard allowance data the standard alowance popup is dealing with.
 *
 * @returns [String] The type of standard allowance being referenced in the popup
 * @author kznwpr
 */
function getSelectedStandardAllowance()
{
	return Services.getValue(XPathConstants.SELECTED_STANDARD_ALLOWANCE_XPATH);
}

/*********************************************************************************/

/**
 * This function returns whether or not the popup is launched in add mode.
 *
 * @returns [Boolean] True if the popup is in add mode, else false.
 * @author kznwpr
 */
function isPopupInAddMode()
{
	return Services.getValue(XPathConstants.POPUP_MODE_XPATH) == PopupMode.ADD;
}

/*********************************************************************************/

/**
 * This function returns whether or not the popup is launched in edit mode.
 *
 * @returns [Boolean] True if the popup is in edit mode, else false.
 * @author kznwpr
 */
function isPopupInEditMode()
{
	return !isPopupInAddMode();
}

/*********************************************************************************/

/**
 * Depending on which tab page this function is called from (personal allowances, 
 * premiums, other liabilities or other resources) this function filters the ref data that is displayed
 * in the lov popup that is launched from the standard allowance popup. The result of this is
 * that the only values displayed in the lov are those which have not already been selected in the grid on
 * the selected tab.
 *
 * @param [String] category The category the reference data should be filtered for
 * @returns [Integer] The number of reference data records for the category
 * @author kznwpr
 */
function filterStandardAllowanceRefData(category)
{
	// Prevent unnecessary events from being fired until all the changes have been made to the dom
	Services.startTransaction();

	var myXpath = null;
	switch (category)
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Set the xpath to those personal allowances which have already been chosen and not subsequently deleted
			myXpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./DeleteFlag = 'N']";
			break;
		case StandardAllowances.PREMIUMS:
			// Set the xpath to those premiums which have already been chosen and not subsequently deleted
			myXpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./DeleteFlag = 'N']";
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			// Set the xpath to those premiums which have already been chosen and not subsequently deleted
			myXpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./DeleteFlag = 'N']";
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Set the xpath to those resources which have already been chosen and not subsequently deleted
			myXpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./DeleteFlag = 'N']";
	}	
		
	// Get the list of items that have already been chosen in the category
	var selectedItemsList = Services.getNodes(myXpath);
	
	// Fast array lookup storage for codes and groups
	var codes = new Array();
	var groups = new Array();
	
	// Parse the list and store the codes and groups in fast array lookup storage
	for (var i = 0; i < selectedItemsList.length; i++)
	{
		// Get the code and group out of the node
		var groupNode = selectedItemsList[i].getElementsByTagName("Group");
		var codeNode = selectedItemsList[i].getElementsByTagName("Code");
		// Get the text from the nodes
		var groupTextNode = groupNode.item(0).firstChild;
		var codeTextNode = codeNode.item(0).firstChild;
		
		// Store the data in fast lookup storage
		codes[codeTextNode.nodeValue] = codeTextNode.nodeValue;
		if (null != groupTextNode)
		{
			groups[groupTextNode.nodeValue] = groupTextNode.nodeValue;
		}
	}

	// Set the xpath to access all the items in the appropriate standard allowance category in ref data
	myXpath = null;
	switch (category)
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			myXpath = XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance";
			break;
		case StandardAllowances.PREMIUMS:
			myXpath = XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium";
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			myXpath = XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability";
			break;
		case StandardAllowances.OTHER_RESOURCES:
			myXpath = XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource";
	}	

	// Iterate over all the items in the appropriate standard allowance category in ref data
	var allRefDataItemsInCategory = Services.getNodes(myXpath);

	// The filtered items will be stored in this list
	var filteredList = new Array();

	// Iterate over all items in the category and store in the filtered list those items which pass the filter criteria
	for (var i = 0; i < allRefDataItemsInCategory.length; i++)
	{
		// Get the code
		var code = allRefDataItemsInCategory[i].getElementsByTagName("Code").item(0).firstChild.nodeValue;
		
		// Get the group
		var group = null;
		var groupNode = allRefDataItemsInCategory[i].getElementsByTagName("Group").item(0).firstChild;
		
		// Get the text
		if (null != groupNode) {group = groupNode.nodeValue;}
		
		// If it has a group but none of the group has already been selected then include the allowance
		if (null != group && undefined == groups[group])
		{
			filteredList[filteredList.length] = allRefDataItemsInCategory[i];				
		}
		// If it has no group and it has not already been selected then include the allowance
		else if (null == group && undefined == codes[code])		
		{
			filteredList[filteredList.length] = allRefDataItemsInCategory[i];			
		}	
	}

	// Set the xpath to access all the items in the appropriate standard allowance category in ref data
	var filteredItemsXpath = null;
	switch (category)
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Clear existing filtered data
			Services.removeNode(XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH);
			// Set the xpath		
			filteredItemsXpath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH;
			break;
		case StandardAllowances.PREMIUMS:
			// Clear existing filtered data
			Services.removeNode(XPathConstants.FILTERED_PREMIUMS_XPATH);
			// Set the xpath				
			filteredItemsXpath = XPathConstants.FILTERED_PREMIUMS_XPATH;		
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			// Clear existing filtered data
			Services.removeNode(XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH);
			// Set the xpath				
			filteredItemsXpath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH;		
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Clear existing filtered data
			Services.removeNode(XPathConstants.FILTERED_OTHER_RESOURCES_XPATH);
			// Set the xpath				
			filteredItemsXpath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH;		
	}	

	// Parse the filtered list and store the filtered nodes in the filtered part of the dom
	for (var i = 0; i < filteredList.length; i++)
	{
		Services.addNode(filteredList[i], filteredItemsXpath);
	}		

	// Indicate that the dom events should now be fired
	Services.endTransaction();				
	
	// Inform the caller how big the filtered list is
	return filteredList.length;
}

/*********************************************************************************/

/**
 * Calculate the total of all non-deleted items for the current category and set the
 * total in the appropriate control that displays the total
 * @author kznwpr
 * 
 */
function setTotalForCategory()
{
	var xpath = null;
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Set the xpath to those personal allowances that are in the grid which have not been deleted
			xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./DeleteFlag = 'N']";
			// Set the xpath for the personal allowances where the calculated total will be stored
			categoryTotalXpath = Totals_PersonalAllowances.dataBinding;
			break;
		case StandardAllowances.PREMIUMS:
			// Set the xpath to those premiums that are in the grid which have not been deleted		
			xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./DeleteFlag = 'N']";
			// Set the xpath for the premiums where the calculated total will be stored			
			categoryTotalXpath = Totals_Premiums.dataBinding;			
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			// Set the xpath to those liabilities that are in the grid which have not been deleted		
			xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./DeleteFlag = 'N']";
			// Set the xpath for the other liabilities where the calculated total will be stored			
			categoryTotalXpath = Totals_OtherLiabilities.dataBinding;			
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Set the xpath to those resources that are in the grid which have not been deleted		
			xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./DeleteFlag = 'N']";
			// Set the xpath for the other resources where the calculated total will be stored			
			categoryTotalXpath = Totals_OtherResources.dataBinding;			
	}
		
	// Get the list of items in the category
	var itemList = Services.getNodes(xpath);

	var total = 0;
	
	// Parse the list and calculate the total
	for (var i = 0; i < itemList.length; i++)
	{
		// Get the amount node out of the item node
		var amountNode = itemList[i].getElementsByTagName("Amount");
		// Get the text from the node
		var amountTextNode = amountNode.item(0).firstChild;
		// Convert to a number and add to the total
		total += Number(amountTextNode.nodeValue);
	}
	Services.setValue(categoryTotalXpath, total);
}

/*********************************************************************************/

/**
 * Updates all the default allowance amounts for all rows already selected in the standard allowance grids.
 * It recalculates the amounts based upon the new default allowances. The default allowance is set for each
 * row based upon the calculated period that is selected.
 * @author kznwpr
 * 
 */
function updateStandardAllowancesForCalculatedPeriod()
{
	// Prevent unnecessary events from being fired until all the changes have been made to the dom
	Services.startTransaction();

	var personal_allowances_root	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance";
	var premiums_root 				= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium";
	var other_liabilities_root	 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability";
	var other_resources_root 		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource";
	
	var standardAllowances = [personal_allowances_root, premiums_root, other_liabilities_root, other_resources_root];	
	
	var refDataRoots = [XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance", 
					XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium", 
					XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability", 
					XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource"]
	
	var calculatedPeriod = Services.getValue(Main_CalculatedPeriod.dataBinding);
	
	// Deal with all 4 categories of standard allowances
	for (var i = 0; i < standardAllowances.length; i ++)
	{
		var xpath = standardAllowances[i] + "[./DeleteFlag = 'N']/SurrogateId";	
	
		// Get all the primary key nodes for the current category of standard allowance excluding any which have already been deleted
		var primaryKeys = Services.getNodes(xpath);

		// Parse the list of keys
		for (var j = 0; j < primaryKeys.length; j++)
		{
			var codeXpath = standardAllowances[i] + "[./SurrogateId = '" + primaryKeys[j].text + "']/Code";
			var code = Services.getValue(codeXpath);
			var numberXpath = standardAllowances[i] + "[./SurrogateId = '" + primaryKeys[j].text + "']/Number";
			var number = Services.getValue(numberXpath);
			var allowanceXpath = null;

			if (calculatedPeriod == CalculatedPeriods.WEEKLY)
			{
				allowanceXpath = refDataRoots[i] + "[./Code = '" + code + "']/WeeklyAllowance";				
			}
			else if (calculatedPeriod == CalculatedPeriods.MONTHLY)
			{
				allowanceXpath = refDataRoots[i] + "[./Code = '" + code + "']/MonthlyAllowance";				
			}			

			// Update the allowance
			var allowance = Services.getValue(allowanceXpath);			
			var updateAllowanceXpath = standardAllowances[i] + "[./SurrogateId = '" + primaryKeys[j].text + "']/DefaultAllowance";
			Services.setValue(updateAllowanceXpath, allowance);

			// Update the amount
			var updateAmountXpath = standardAllowances[i] + "[./SurrogateId = '" + primaryKeys[j].text + "']/Amount";
			var	amount = CaseManUtils.transformAmountToTwoDP(Number(allowance) * Number(number));						
			Services.setValue(updateAmountXpath, amount.toString());
			
			// Update the status
			var updateStatusXpath = standardAllowances[i] + "[./SurrogateId = '" + primaryKeys[j].text + "']/Status";
			Services.setValue(updateStatusXpath, Status.MODIFIED);
		}	
	}

	// Indicate that the dom events should now be fired
	Services.endTransaction();		
	
	calculateTotals();
}

/*********************************************************************************/

/**
 * Called from the generic add/edit popup when the user clicks the ok button
 * to close the popup when the popup is in add mode. This function adds the new
 * standard allowance to the appropriate grid and selects the new row.
 * @author kznwpr
 * 
 */
function closePopupInAddMode()
{
	// A DOM that contains the elements for an empty new allowance/premium/liability/resource
	var newItem = null;
	var root = null;
	
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Load the DOM with the xml structure for a new allowance
			var newItem = Services.loadDOMFromURL("NewAllowance.xml");
			root = "/Allowance";
			break;
		case StandardAllowances.PREMIUMS:
			// Load the DOM with the xml structure for a new premium
			var newItem = Services.loadDOMFromURL("NewPremium.xml");
			root = "/Premium";
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			// Load the DOM with the xml structure for a new liability
			var newItem = Services.loadDOMFromURL("NewLiability.xml");
			root = "/Liability";
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Load the DOM with the xml structure for a new resource
			var newItem = Services.loadDOMFromURL("NewResource.xml");
			root = "/Resource";
	}	

	// Set the data in the DOM for the new allowance
	var surrogateId = getNextSurrogateKey();

	newItem.selectSingleNode(root + "/SurrogateId").appendChild(newItem.createTextNode(surrogateId));

	// Set the status
	newItem.selectSingleNode(root + "/Status").appendChild(newItem.createTextNode(Status.NEW));		

	newItem.selectSingleNode(root + "/Code").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_Code.dataBinding)));		

	if (CaseManUtils.isBlank(Services.getValue(XPathConstants.STANDARD_ALLOWANCES_POPUP_GROUP_XPATH))) 
	{	
		newItem.selectSingleNode(root + "/Group").appendChild(newItem.createTextNode(""));					
	}
	else
	{
		newItem.selectSingleNode(root + "/Group").appendChild(newItem.createTextNode(Services.getValue(XPathConstants.STANDARD_ALLOWANCES_POPUP_GROUP_XPATH)));
	}

	newItem.selectSingleNode(root + "/Description").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_Description.dataBinding)));

	if (CaseManUtils.isBlank(Services.getValue(StandardAllowances_Popup_Allowance.dataBinding))) 
	{	
		newItem.selectSingleNode(root + "/DefaultAllowance").appendChild(newItem.createTextNode(""));	
	}
	else
	{
		newItem.selectSingleNode(root + "/DefaultAllowance").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_Allowance.dataBinding)));
	}

	if (CaseManUtils.isBlank(Services.getValue(StandardAllowances_Popup_AllowanceCurrency.dataBinding))) 
	{	
		newItem.selectSingleNode(root + "/DefaultAllowanceCurrency").appendChild(newItem.createTextNode(getDefaultCurrencyCode()));	
	}
	else
	{
		newItem.selectSingleNode(root + "/DefaultAllowanceCurrency").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_AllowanceCurrency.dataBinding)));
	}

	newItem.selectSingleNode(root + "/Number").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_Number.dataBinding)));		
		
	if (CaseManUtils.isBlank(Services.getValue(StandardAllowances_Popup_Amount.dataBinding))) 
	{	
		newItem.selectSingleNode(root + "/Amount").appendChild(newItem.createTextNode(""));	
	}
	else
	{
		newItem.selectSingleNode(root + "/Amount").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_Amount.dataBinding)));
	}

	if (CaseManUtils.isBlank(Services.getValue(StandardAllowances_Popup_AmountCurrency.dataBinding))) 
	{	
		newItem.selectSingleNode(root + "/AmountCurrency").appendChild(newItem.createTextNode(getDefaultCurrencyCode()));	
	}
	else
	{
		newItem.selectSingleNode(root + "/AmountCurrency").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_AmountCurrency.dataBinding)));
	}
			
	newItem.selectSingleNode(root + "/DateEntered").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_DateEntered.dataBinding)));	
	newItem.selectSingleNode(root + "/CreatedBy").appendChild(newItem.createTextNode(Services.getValue(StandardAllowances_Popup_CreatedBy.dataBinding)));	
	newItem.selectSingleNode(root + "/DeleteFlag").appendChild(newItem.createTextNode("N"));			

	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			var allowancesNode = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances";
		
			// Add the entire new allowance structure to the allowances node
			Services.addNode(newItem, allowancesNode);
			
			break;
		case StandardAllowances.PREMIUMS:
			var premiumsNode = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums";
		
			// Add the entire new premium structure to the premiums node
			Services.addNode(newItem, premiumsNode);

			break;
		case StandardAllowances.OTHER_LIABILITIES:
			var liabilitiesNode = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities";
		
			// Add the entire new liability structure to the liabilities node
			Services.addNode(newItem, liabilitiesNode);

			break;
		case StandardAllowances.OTHER_RESOURCES:	
			var resourcesNode = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources";
		
			// Add the entire new resource structure to the resources node
			Services.addNode(newItem, resourcesNode);
	}	
			
	// Force the grid to select the new row
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Force the allowances grid to select the new allowance row
			Services.setValue(PersonalAllowancesGrid.dataBinding, surrogateId);
			break;
		case StandardAllowances.PREMIUMS:
			// Force the premiums grid to select the new premium row
			Services.setValue(PremiumsGrid.dataBinding, surrogateId);
			break;
		case StandardAllowances.OTHER_LIABILITIES:	
			// Force the liabilities grid to select the new liability row
			Services.setValue(OtherLiabilitiesGrid.dataBinding, surrogateId);
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Force the resources grid to select the new resource row
			Services.setValue(OtherResourcesGrid.dataBinding, surrogateId);
	}	
}

/*********************************************************************************/

/**
 * Called from the generic add/edit popup when the user clicks the ok button
 * to close the popup when the popup is in edit mode. This function updates the selected
 * standard allowance with the data that was modified in the popup
 * @author kznwpr
 * 
 */
function closePopupInEditMode() 
{
	var editRowXpath = null;
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			// Set the edit row xpath for allowances
			editRowXpath = XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT + PersonalAllowancesGrid.dataBinding;
			break;
		case StandardAllowances.PREMIUMS:
			// Set the edit row xpath for premiums
			editRowXpath = XPathConstants.PREMIUMS_DATA_BINDING_ROOT + PremiumsGrid.dataBinding;
			break;
		case StandardAllowances.OTHER_LIABILITIES:	
			// Set the edit row xpath for liabilities
			editRowXpath = XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT + OtherLiabilitiesGrid.dataBinding;
			break;
		case StandardAllowances.OTHER_RESOURCES:
			// Set the edit row xpath for resources
			editRowXpath = XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT + OtherResourcesGrid.dataBinding;
	}			
			
	// Prevent unnecessary events from being fired until all the changes have been made to the dom
	Services.startTransaction();
	
	Services.setValue(editRowXpath + "]/Status", Status.MODIFIED);
	Services.setValue(editRowXpath + "]/Allowance", Services.getValue(StandardAllowances_Popup_Allowance.dataBinding));
	Services.setValue(editRowXpath + "]/Number", Services.getValue(StandardAllowances_Popup_Number.dataBinding));
	Services.setValue(editRowXpath + "]/Amount", Services.getValue(StandardAllowances_Popup_Amount.dataBinding));
	Services.setValue(editRowXpath + "]/DateEntered", Services.getValue(StandardAllowances_Popup_DateEntered.dataBinding));
	
	// Indicate that the dom events should now be fired
	Services.endTransaction();			
}

/*********************************************************************************/

/**
 * Function transforms the currency code to the currency symbol displayed on screen 
 * (e.g. GBP to £).
 *
 * @param [String] value The currency code to be transformed to a symbol
 * @returns [String] The correct currency symbol for the code passed in
 * @author kznwpr
 */
function transformCurrencyToDisplay(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

/**
 * Function to determine if a total has already been saved. Note that this could have occured 
 * outside of this screen by the user directly entering a value rather than using the calculator.
 *
 * @returns [Boolean] True if the total has been saved, else false
 * @author kznwpr
 */
function hasTotalAlreadyBeenSaved()
{
	var totalStatus = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/TotalStatus");
	if (totalStatus == TotalStatus.EXISTING) {return true;}
	return false;
}

/*********************************************************************************/

/**
 * Function called by currency fields on the screen to validate the data entered.
 * To be valid, the amount must be a positive floating point number. 
 *
 * @param [String] dataBinding The dataBinding of the currency field to be validated
 * @returns [Boolean] True if the currency is valid, else false
 * @author kznwpr
 */
function validateCurrency(dataBinding)
{
	var amount = Services.getValue(dataBinding);
	if ( Services.hasValue(dataBinding) && !validatePositiveFloatNumber(amount) )
	{
		// It's not a valid number
		return false;
	}
	// It is a valid number
	return true;
}

/*********************************************************************************/

/**
 * Performs strict validation on data to see if it is a positive floating point number.
 * Also tests to see if the max number of digits has been exceeded. It allows 4 to the left
 * of the decimal point and two to the right.
 *
 * @param [Float] value The value to validate
 * @returns [Boolean] True if the value passed in is a floating point number, else false
 * @author kznwpr
 */
validatePositiveFloatNumber = function(value)
{
	// Test to see if it is a valid positive float number
	var positiveFloat = /^\d*(\.\d{1,2})?$/
	var valid = value.search(positiveFloat);	

	if(value.length > 0 && 0 != valid) { return false; }
	
	// If the value contains a decimal point then extract the digits to the left
	if (value.indexOf(".") != -1)
	{
		var leftOfDecimalPoint = value.slice(0, value.indexOf("."));
		value = leftOfDecimalPoint;
	}

	// We only allow a max of 4 digits to the left of the decimal point
	if (value.length > 4) {return false;}

	return true;
}

/*********************************************************************************/

/**
 * Return today's date stored in the reference data.
 *
 * @return [String] The current system date in the DOM format (YYYY-MM-DD)
 * @author kznwpr
 */
function getTodaysDate()
{
	return CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
}

/*********************************************************************************/

/**
 * Returns the total of the fields specified in the fields array - 
 * personal allowances + premiums + other liabilities - other resources.
 *
 * @param [Array] fields An array of field dataBindings to total up
 * @returns [Float] The total amount from all all the dataBindings passed in corrected to 2 dp.
 * @author kznwpr
 */
function getCalculatedTotal(fields)
{
	var total = 0;

	for (var i = 0; i < fields.length; i++)
	{
		var value = Services.getValue(fields[i])
		if (null != value) 
		{
			if (fields[i] == Totals_OtherResources.dataBinding)
			{
				total -= Number(value);
			}
			else
			{
				total += Number(value);
			}
		}
	}
	// Two decimal places
	return total.toFixed(2);
}

/*********************************************************************************/

/**
 * Works out if the total exceeds the maximum allowed as supported by the db.
 *
 * @returns [Boolean] True if the total amount exceeds the database limit, else false.
 * @author kznwpr
 */
function isTotalTooBig()
{
	// Calculate the grand total as the sum of all the other total fields
	var fields = [Totals_PersonalAllowances.dataBinding, Totals_Premiums.dataBinding, Totals_OtherLiabilities.dataBinding, Totals_OtherResources.dataBinding];

	// We only allow a max of 5 digits to the left of the decimal point
	if (getCalculatedTotal(fields) > 99999.99) {return true;}

	return false;	
}
 
/******************************* MAIN PANEL ****************************************/

function Main_CalculatedPeriod() {};
Main_CalculatedPeriod.tabIndex = 10;
Main_CalculatedPeriod.componentName = "Calculated period";
Main_CalculatedPeriod.srcData = XPathConstants.REF_DATA_XPATH + "/CalculatedPeriods";
Main_CalculatedPeriod.rowXPath = "Period";
Main_CalculatedPeriod.keyXPath = "Id";
Main_CalculatedPeriod.displayXPath = "Description";
Main_CalculatedPeriod.strictValidation = true;
Main_CalculatedPeriod.isMandatory = function() {return true;}
Main_CalculatedPeriod.helpText = "Period for which to calculate standard allowances";
Main_CalculatedPeriod.revertedToPreviousValue = false;
Main_CalculatedPeriod.logicOn = [Main_CalculatedPeriod.dataBinding];
Main_CalculatedPeriod.logic = function(event)
{
	if (event.getXPath() != this.dataBinding || 
		CaseManUtils.isBlank(Services.getValue(this.dataBinding)) ||
		!CaseManValidationHelper.validateFields(["Main_CalculatedPeriod"]))
		{return;}
	
	if (Main_CalculatedPeriod.revertedToPreviousValue)
	{
		Main_CalculatedPeriod.revertedToPreviousValue = false;
		return;
	}
	
	// Only execute this code if we have active standard allowances in any of the four grids
	var lastCalculatedPeriodValue = Services.getValue(XPathConstants.LASTCALCULATEDPERIOD_XPATH);
	if ( standardAllowancesExist() && Services.getValue(this.dataBinding) != lastCalculatedPeriodValue )	
	{
		var answer = confirm(Messages.PER_CALCULATED_PERIOD_CHANGED_MESSAGE);
		if (answer)
		{
			updateStandardAllowancesForCalculatedPeriod();
			calculateTotals();
		}
		else
		{
			// If the user selected the cancel button then put the old value back in		
			Services.setValue(Main_CalculatedPeriod.dataBinding, lastCalculatedPeriodValue);
			// Indicate that the logic has mutated the adapter's value so that we can filter the subsequent logic event that is fired
			Main_CalculatedPeriod.revertedToPreviousValue = true;
		}
	}
	
	// Update the last value to what is currently selected in the drop down
	var newCalculatedPeriodValue = Services.getValue(this.dataBinding);
	Services.setValue(XPathConstants.LASTCALCULATEDPERIOD_XPATH, newCalculatedPeriodValue);
}

/******************************* PERSONAL ALLOWANCES TAB ***************************/

function PersonalAllowances_AddBtn() {};
PersonalAllowances_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "PersonalAllowancesGrid" } ]
	}
};

PersonalAllowances_AddBtn.tabIndex = 40;
PersonalAllowances_AddBtn.enableOn = [Main_CalculatedPeriod.dataBinding];
PersonalAllowances_AddBtn.isEnabled = function() {return buttonsCanEnable();}
/**
 * @author kznwpr
 * 
 */
PersonalAllowances_AddBtn.actionBinding = function()
{
	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.PERSONAL_ALLOWANCES);

	// Filter the allowances that the user can select from so that the only ones offered are the ones
	// which have not already been selected in the allowances grid
	filterStandardAllowanceRefData(StandardAllowances.PERSONAL_ALLOWANCES);
	
	// Set the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.ADD);

	// Set the default user
	Services.setValue(StandardAllowances_Popup_CreatedBy.dataBinding, Services.getCurrentUser() );

	// Raise the popup
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function PersonalAllowances_EditBtn() {};
PersonalAllowances_EditBtn.tabIndex = 50;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
PersonalAllowances_EditBtn.dataBinding = XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT + PersonalAllowancesGrid.dataBinding + "]/DeleteFlag";

PersonalAllowances_EditBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "PersonalAllowancesGrid"} ]
	}
};

PersonalAllowances_EditBtn.enableOn = [PersonalAllowances_EditBtn.dataBinding, Main_CalculatedPeriod.dataBinding];

PersonalAllowances_EditBtn.isEnabled = function()
{
	// If there are allowances whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
PersonalAllowances_EditBtn.actionBinding = function()
{
	// Set the variable so the logic for the amount field does not fire
	// when the number data is loaded
	StandardAllowances_Popup_Amount.editDataLoading = true;
	
	// Set the popup mode first. This must be done before loading the data
	// because the data load will fire the logic code, which is dependant
	// on the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.EDIT);

	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.PERSONAL_ALLOWANCES);
	
	loadPersonalAllowanceEditData();
		
	// Raise the popup	
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	// Reset the variable so that the logic for the amount field now works correctly
	StandardAllowances_Popup_Amount.editDataLoading = false;
}

/*********************************************************************************/

function PersonalAllowances_DeleteBtn() {};
PersonalAllowances_DeleteBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "PersonalAllowancesGrid", alt: true } ]
	}
};

PersonalAllowances_DeleteBtn.tabIndex = 60;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
PersonalAllowances_DeleteBtn.dataBinding = XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT + PersonalAllowancesGrid.dataBinding + "]/DeleteFlag";

PersonalAllowances_DeleteBtn.enableOn = [PersonalAllowances_DeleteBtn.dataBinding, Main_CalculatedPeriod.dataBinding];

PersonalAllowances_DeleteBtn.isEnabled = function()
{
	// If there are allowances whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PersonalAllowances/Allowance[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
PersonalAllowances_DeleteBtn.actionBinding = function() 
{
	// Indicate which type of data we are dealing with
	setSelectedStandardAllowance(StandardAllowances.PERSONAL_ALLOWANCES);

	// Update the status and set the flag on the selected row
	Services.setValue(XPathConstants.PERSONAL_ALLOWANCES_DATA_BINDING_ROOT + PersonalAllowancesGrid.dataBinding + "]/Status" , Status.MODIFIED);
	Services.setValue(PersonalAllowances_DeleteBtn.dataBinding, 'Y');
	
	setTotalForCategory();	
}

/******************************* PREMIUMS TAB **************************************/

function Premiums_AddBtn() {};
Premiums_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "PremiumsGrid" } ]
	}
};

Premiums_AddBtn.tabIndex = 40;
Premiums_AddBtn.enableOn = [Main_CalculatedPeriod.dataBinding];
Premiums_AddBtn.isEnabled = function() {return buttonsCanEnable();}
/**
 * @author kznwpr
 * 
 */
Premiums_AddBtn.actionBinding = function()
{
	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.PREMIUMS);

	// Filter the premiums that the user can select from so that the only ones offered are the ones
	// which have not already been selected in the premiums grid
	filterStandardAllowanceRefData(StandardAllowances.PREMIUMS);
		
	// Set the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.ADD);

	// Set the default user
	Services.setValue(StandardAllowances_Popup_CreatedBy.dataBinding, Services.getCurrentUser() );

	// Raise the popup
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function Premiums_EditBtn() {};
Premiums_EditBtn.tabIndex = 50;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
Premiums_EditBtn.dataBinding = XPathConstants.PREMIUMS_DATA_BINDING_ROOT + PremiumsGrid.dataBinding + "]/DeleteFlag";

Premiums_EditBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "PremiumsGrid"} ]
	}
};

Premiums_EditBtn.enableOn = [Premiums_EditBtn.dataBinding, Main_CalculatedPeriod.dataBinding];

Premiums_EditBtn.isEnabled = function()
{
	// If there are premiums whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
Premiums_EditBtn.actionBinding = function()
{
	// Set the variable so the logic for the amount field does not fire
	// when the number data is loaded
	StandardAllowances_Popup_Amount.editDataLoading = true;
	
	// Set the popup mode first. This must be done before loading the data
	// because the data load will fire the logic code, which is dependant
	// on the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.EDIT);

	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.PREMIUMS);

	loadPremiumsEditData();
		
	// Raise the popup	
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	// Reset the variable so that the logic for the amount field now works correctly
	StandardAllowances_Popup_Amount.editDataLoading = false;
}

/*********************************************************************************/

function Premiums_DeleteBtn() {};
Premiums_DeleteBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "PremiumsGrid", alt: true } ]
	}
};

Premiums_DeleteBtn.tabIndex = 60;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
Premiums_DeleteBtn.dataBinding = XPathConstants.PREMIUMS_DATA_BINDING_ROOT + PremiumsGrid.dataBinding + "]/DeleteFlag";

Premiums_DeleteBtn.enableOn = [Premiums_DeleteBtn.dataBinding, Main_CalculatedPeriod.dataBinding];

Premiums_DeleteBtn.isEnabled = function()
{
	// If there are premiums whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Premiums/Premium[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
Premiums_DeleteBtn.actionBinding = function() 
{
	// Indicate which type of data we are dealing with
	setSelectedStandardAllowance(StandardAllowances.PREMIUMS);

	// Update the status and set the flag on the selected row
	Services.setValue(XPathConstants.PREMIUMS_DATA_BINDING_ROOT + PremiumsGrid.dataBinding + "]/Status" , Status.MODIFIED);
	Services.setValue(Premiums_DeleteBtn.dataBinding, 'Y');
	
	setTotalForCategory();	
}

/******************************* OTHER LIABILITIES TAB *****************************/

function OtherLiabilities_AddBtn() {};
OtherLiabilities_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "OtherLiabilitiesGrid" } ]
	}
};

OtherLiabilities_AddBtn.tabIndex = 40;
OtherLiabilities_AddBtn.enableOn = [Main_CalculatedPeriod.dataBinding];
OtherLiabilities_AddBtn.isEnabled = function() {return buttonsCanEnable();}
/**
 * @author kznwpr
 * @return null 
 */
OtherLiabilities_AddBtn.actionBinding = function()
{
	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_LIABILITIES);

	// Filter the liabilities that the user can select from so that the only ones offered are the ones
	// which have not already been selected in the liabilities grid
	var size = filterStandardAllowanceRefData(StandardAllowances.OTHER_LIABILITIES);
	
	if (size == 0)
	{
		alert(Messages.PER_ALL_LIABILITIES_SELECTED_MESSAGE);
		return;
	}	
	
	// Set the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.ADD);

	// Set the default user
	Services.setValue(StandardAllowances_Popup_CreatedBy.dataBinding, Services.getCurrentUser() );

	// Set the standard allowance code because there is only 1 for this tab
	Services.setValue(StandardAllowances_Popup_Code.dataBinding, "CLIAB");
	
	// Raise the popup
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function OtherLiabilities_EditBtn() {};

OtherLiabilities_EditBtn.tabIndex = 50;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
OtherLiabilities_EditBtn.dataBinding = XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT + OtherLiabilitiesGrid.dataBinding + "]/DeleteFlag";

OtherLiabilities_EditBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "OtherLiabilitiesGrid"} ]
	}
};

OtherLiabilities_EditBtn.enableOn = [OtherLiabilities_EditBtn.dataBinding, Main_CalculatedPeriod.dataBinding];
OtherLiabilities_EditBtn.isEnabled = function()
{
	// If there are liabilities whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
OtherLiabilities_EditBtn.actionBinding = function()
{
	// Set the variable so the logic for the amount field does not fire
	// when the number data is loaded
	StandardAllowances_Popup_Amount.editDataLoading = true;
	
	// Set the popup mode first. This must be done before loading the data
	// because the data load will fire the logic code, which is dependant
	// on the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.EDIT);

	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_LIABILITIES);
	
	loadOtherLiabilityEditData();
		
	// Raise the popup	
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	// Reset the variable so that the logic for the amount field now works correctly
	StandardAllowances_Popup_Amount.editDataLoading = false;
}

/*********************************************************************************/

function OtherLiabilities_DeleteBtn() {};
OtherLiabilities_DeleteBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "OtherLiabilitiesGrid", alt: true } ]
	}
};

OtherLiabilities_DeleteBtn.tabIndex = 60;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
OtherLiabilities_DeleteBtn.dataBinding = XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT + OtherLiabilitiesGrid.dataBinding + "]/DeleteFlag";

OtherLiabilities_DeleteBtn.enableOn = [OtherLiabilities_DeleteBtn.dataBinding, Main_CalculatedPeriod.dataBinding];
OtherLiabilities_DeleteBtn.isEnabled = function()
{
	// If there are liabilities whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherLiabilities/Liability[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
OtherLiabilities_DeleteBtn.actionBinding = function() 
{
	// Indicate which type of data we are dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_LIABILITIES);

	// Update the status and set the flag on the selected row
	Services.setValue(XPathConstants.OTHER_LIABILITIES_DATA_BINDING_ROOT + OtherLiabilitiesGrid.dataBinding + "]/Status" , Status.MODIFIED);
	Services.setValue(OtherLiabilities_DeleteBtn.dataBinding, 'Y');
	
	setTotalForCategory();	
}

/******************************* OTHER RESOURCES TAB *******************************/

function OtherResources_AddBtn() {};
OtherResources_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "OtherResourcesGrid" } ]
	}
};

OtherResources_AddBtn.tabIndex = 40;
OtherResources_AddBtn.enableOn = [Main_CalculatedPeriod.dataBinding];
OtherResources_AddBtn.isEnabled = function() {return buttonsCanEnable();}
/**
 * @author kznwpr
 * 
 */
OtherResources_AddBtn.actionBinding = function()
{
	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_RESOURCES);

	// Filter the resources that the user can select from so that the only ones offered are the ones
	// which have not already been selected in the resources grid
	filterStandardAllowanceRefData(StandardAllowances.OTHER_RESOURCES);
	
	// Set the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.ADD);

	// Set the default user
	Services.setValue(StandardAllowances_Popup_CreatedBy.dataBinding, Services.getCurrentUser() );

	// Raise the popup
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function OtherResources_EditBtn() {};
OtherResources_EditBtn.tabIndex = 50;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
OtherResources_EditBtn.dataBinding = XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT + OtherResourcesGrid.dataBinding + "]/DeleteFlag";

OtherResources_EditBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "OtherResourcesGrid"} ]
	}
};

OtherResources_EditBtn.enableOn = [OtherResources_EditBtn.dataBinding, Main_CalculatedPeriod.dataBinding];
OtherResources_EditBtn.isEnabled = function()
{
	// If there are resources whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
OtherResources_EditBtn.actionBinding = function()
{
	// Set the variable so the logic for the amount field does not fire
	// when the number data is loaded
	StandardAllowances_Popup_Amount.editDataLoading = true;
	
	// Set the popup mode first. This must be done before loading the data
	// because the data load will fire the logic code, which is dependant
	// on the popup mode
	Services.setValue(XPathConstants.POPUP_MODE_XPATH, PopupMode.EDIT);

	// Tell the popup which type of data it will be dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_RESOURCES);
	
	loadOtherResourceEditData();
		
	// Raise the popup	
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	// Reset the variable so that the logic for the amount field now works correctly
	StandardAllowances_Popup_Amount.editDataLoading = false;
}

/*********************************************************************************/

function OtherResources_DeleteBtn() {};
OtherResources_DeleteBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "OtherResourcesGrid", alt: true } ]
	}
};

OtherResources_DeleteBtn.tabIndex = 60;
// Give the button a dataBinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
OtherResources_DeleteBtn.dataBinding = XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT + OtherResourcesGrid.dataBinding + "]/DeleteFlag";

OtherResources_DeleteBtn.enableOn = [OtherResources_DeleteBtn.dataBinding, Main_CalculatedPeriod.dataBinding];
OtherResources_DeleteBtn.isEnabled = function()
{
	// If there are resources whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OtherResources/Resource[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0 && buttonsCanEnable())
	{
		// The button is enabled
		return true;
	}

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
OtherResources_DeleteBtn.actionBinding = function() 
{
	// Indicate which type of data we are dealing with
	setSelectedStandardAllowance(StandardAllowances.OTHER_RESOURCES);

	// Update the status and set the flag on the selected row
	Services.setValue(XPathConstants.OTHER_RESOURCES_DATA_BINDING_ROOT + OtherResourcesGrid.dataBinding + "]/Status" , Status.MODIFIED);
	Services.setValue(OtherResources_DeleteBtn.dataBinding, 'Y');
	
	setTotalForCategory();	
}

/******************************* STANDARD ALLOWANCES POPUP *************************/

function StandardAllowances_Popup_CodeDynamicLabel() {}
StandardAllowances_Popup_CodeDynamicLabel.labelOn = [myTabSelector.dataBinding];
/**
 * @author kznwpr
 * @return label  
 */
StandardAllowances_Popup_CodeDynamicLabel.label = function() 
{ 
	var labels = new Array();
	labels["firstPage"]		= "Personal Allowances";
	labels["secondPage"]	= "Premiums";
	labels["thirdPage"]		= "Other Liabilities";
	labels["fourthPage"]	= "Other Resources";			
	
	var selectedTabPage = Services.getValue(myTabSelector.dataBinding);
	var label = labels[selectedTabPage];
	return label;
}

/*********************************************************************************/

function StandardAllowances_Popup_Code() {};
StandardAllowances_Popup_Code.readOnlyOn = [XPathConstants.POPUP_MODE_XPATH];
StandardAllowances_Popup_Code.isReadOnly = isPopupInEditMode; // Read only when the popup is in edit mode
StandardAllowances_Popup_Code.isMandatory = function() {return true;}
StandardAllowances_Popup_Code.isTemporary = function() {return true;}
StandardAllowances_Popup_Code.helpText = "Standard allowance code";
StandardAllowances_Popup_Code.maxLength = 5;
StandardAllowances_Popup_Code.validate = function()
{
	// This code should only be executed when the popup is in add mode
	if (isPopupInEditMode()) {return;}

	// Lookup in ref data to see if the code exists
	var xpath = null;
	var filterXPath = null;
	
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			xpath = XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance[./Code = " + this.dataBinding + "]/Description";
			filterXPath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.PREMIUMS:
			xpath = XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium[./Code = " + this.dataBinding + "]/Description";
			filterXPath = XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			xpath = XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability[./Code = " + this.dataBinding + "]/Description";
			filterXPath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.OTHER_RESOURCES:
			xpath = XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource[./Code = " + this.dataBinding + "]/Description";
			filterXPath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]";
	}	

	var errCode = null;
	var standardAllowance = Services.getValue(xpath);
	var allowanceInFilterGrid = Services.exists(filterXPath);

	// If the standard allowance was not found then fail validation
	// Defect 5586 - Also fail validation if the allowance is not present in the filtered LOV Grid
	// (i.e. has been filtered out as has already been added to the AE/CO record).
	if ( null == standardAllowance || !allowanceInFilterGrid )
	{
		// The allowance does not exist
		errCode = ErrorCode.getErrorCode("CaseMan_genericInvalidCode_Msg");
	}
	return errCode;
}
StandardAllowances_Popup_Code.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

StandardAllowances_Popup_Code.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

StandardAllowances_Popup_Code.logicOn = [StandardAllowances_Popup_Code.dataBinding];
StandardAllowances_Popup_Code.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) {return;}

	// This code should only be executed when the popup is in edit mode
	if (isPopupInEditMode()) 
	{
		var allowMultiplesXpath = null;
		switch (getSelectedStandardAllowance())
		{
			case StandardAllowances.PERSONAL_ALLOWANCES:
				allowMultiplesXpath = XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance[./Code = " + this.dataBinding + "]/AllowMultiples";
				allowEditableXpath = XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance[./Code = " + this.dataBinding + "]/AmountAllowedEditable";
				break;
			case StandardAllowances.PREMIUMS:
				allowMultiplesXpath = XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium[./Code = " + this.dataBinding + "]/AllowMultiples";
				allowEditableXpath = XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium[./Code = " + this.dataBinding + "]/AmountAllowedEditable";
				break;
			case StandardAllowances.OTHER_LIABILITIES:
				allowMultiplesXpath = XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability[./Code = " + this.dataBinding + "]/AllowMultiples";
				allowEditableXpath = XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability[./Code = " + this.dataBinding + "]/AmountAllowedEditable";
				break;
			case StandardAllowances.OTHER_RESOURCES:
				allowMultiplesXpath = XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource[./Code = " + this.dataBinding + "]/AllowMultiples";
				allowEditableXpath = XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource[./Code = " + this.dataBinding + "]/AmountAllowedEditable";
		}
	
		var allowMultiples = Services.getValue(allowMultiplesXpath);
		if ("N" == allowMultiples)
		{
			// The number field should be read only
			Services.setValue(XPathConstants.NUMBER_READ_ONLY_XPATH, "Y");
		}
		else
		{
			// The number field should be editable			
			Services.setValue(XPathConstants.NUMBER_READ_ONLY_XPATH, "N");
		}	
		
		var amountEditable = Services.getValue(allowEditableXpath);
		if ("N" == amountEditable)
		{
			// The number field should be read only
			Services.setValue(XPathConstants.AMOUNT_READ_ONLY_XPATH, "Y");
		}
		else
		{
			// The number field should be editable			
			Services.setValue(XPathConstants.AMOUNT_READ_ONLY_XPATH, "N");
		}
		return;
	}

	// Set the xpath to lookup in ref data to see if the code exists
	var codeXpath = null;
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			codeXpath = XPathConstants.PERSONAL_ALLOWANCES_REF_DATA_ROOT + "/Allowance[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.PREMIUMS:
			codeXpath = XPathConstants.PREMIUMS_REF_DATA_ROOT + "/Premium[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			codeXpath = XPathConstants.OTHER_LIABILITIES_REF_DATA_ROOT + "/Liability[./Code = " + this.dataBinding + "]";
			break;
		case StandardAllowances.OTHER_RESOURCES:
			codeXpath = XPathConstants.OTHER_RESOURCES_REF_DATA_ROOT + "/Resource[./Code = " + this.dataBinding + "]";
	}	

	// This code should only be executed when the popup is in add mode	
	// If the entered code is not blank and it exists in ref data then execute the code below
	if(!CaseManUtils.isBlank(Services.getValue(StandardAllowances_Popup_Code.dataBinding)) && null != Services.getNode(codeXpath))
	{
		var descriptionXpath = null;
		var groupXpath = null;
		var allowanceXpath = null;
		var allowMultiplesXpath = null;
		var amountAllowedEditableXpath = null;
		switch (getSelectedStandardAllowance())
		{
			case StandardAllowances.PERSONAL_ALLOWANCES:
				descriptionXpath	= XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/Description";
				groupXpath			= XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/Group";
				allowMultiplesXpath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/AllowMultiples";
				amountAllowedEditableXpath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/AmountAllowedEditable";

				// Get the appropriate allowance based on the value in the calculated period control		
				if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.WEEKLY)
				{
					allowanceXpath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/WeeklyAllowance";				
				}
				else if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.MONTHLY)
				{
					allowanceXpath = XPathConstants.FILTERED_PERSONAL_ALLOWANCES_XPATH + "/Allowance[./Code = " + this.dataBinding + "]/MonthlyAllowance";				
				}			
				break;
			case StandardAllowances.PREMIUMS:
				descriptionXpath	= XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/Description";
				groupXpath			= XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/Group";
				allowMultiplesXpath = XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/AllowMultiples";
				amountAllowedEditableXpath = XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/AmountAllowedEditable";

				// Get the appropriate allowance based on the value in the calculated period control		
				if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.WEEKLY)
				{
					allowanceXpath = XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/WeeklyAllowance";				
				}
				else if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.MONTHLY)
				{
					allowanceXpath = XPathConstants.FILTERED_PREMIUMS_XPATH + "/Premium[./Code = " + this.dataBinding + "]/MonthlyAllowance";
				}			
				break;
			case StandardAllowances.OTHER_LIABILITIES:
				descriptionXpath	= XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/Description";
				groupXpath			= XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/Group";
				allowMultiplesXpath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/AllowMultiples";
				amountAllowedEditableXpath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/AmountAllowedEditable";

				// Get the appropriate allowance based on the value in the calculated period control		
				if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.WEEKLY)
				{
					allowanceXpath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/WeeklyAllowance";
				}
				else if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.MONTHLY)
				{
					allowanceXpath = XPathConstants.FILTERED_OTHER_LIABILITIES_XPATH + "/Liability[./Code = " + this.dataBinding + "]/MonthlyAllowance";
				}			
				break;
			case StandardAllowances.OTHER_RESOURCES:
				descriptionXpath	= XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/Description";
				groupXpath			= XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/Group";
				allowMultiplesXpath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/AllowMultiples";
				amountAllowedEditableXpath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/AmountAllowedEditable";

				// Get the appropriate allowance based on the value in the calculated period control		
				if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.WEEKLY)
				{
					allowanceXpath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/WeeklyAllowance";
				}
				else if (Services.getValue(Main_CalculatedPeriod.dataBinding) == CalculatedPeriods.MONTHLY)
				{
					allowanceXpath = XPathConstants.FILTERED_OTHER_RESOURCES_XPATH + "/Resource[./Code = " + this.dataBinding + "]/MonthlyAllowance";
				}							
		}		
	
		// Populate the description, group and allowance fields by looking up the allowance in the filtered reference data
		var description = Services.getValue(descriptionXpath);
		Services.setValue(StandardAllowances_Popup_Description.dataBinding, description);
		// This one is hidden data used when filtering the list of allowances
		var group = Services.getValue(groupXpath);
		Services.setValue(XPathConstants.STANDARD_ALLOWANCES_POPUP_GROUP_XPATH, group);
		var allowance = Services.getValue(allowanceXpath);
		Services.setValue(StandardAllowances_Popup_Allowance.dataBinding, CaseManUtils.transformAmountToTwoDP(allowance));
		var allowMultiples = Services.getValue(allowMultiplesXpath);
		if ("N" == allowMultiples)
		{
			// No multiples allowed so set the number to 1
			Services.setValue(StandardAllowances_Popup_Number.dataBinding, "1");
			// The number field should be read only
			Services.setValue(XPathConstants.NUMBER_READ_ONLY_XPATH, "Y");
		}
		else
		{
			Services.setValue(StandardAllowances_Popup_Number.dataBinding, "");
			// The number field should be editable			
			Services.setValue(XPathConstants.NUMBER_READ_ONLY_XPATH, "N");
		}
		
		var amountEditable = Services.getValue(amountAllowedEditableXpath);
		if ("N" == amountEditable)
		{
			// The number field should be read only
			Services.setValue(XPathConstants.AMOUNT_READ_ONLY_XPATH, "Y");
		}
		else
		{
			// The number field should be editable			
			Services.setValue(XPathConstants.AMOUNT_READ_ONLY_XPATH, "N");
		}

		var currentDate = getTodaysDate();
		Services.setValue(StandardAllowances_Popup_DateEntered.dataBinding, currentDate);
	}
	else
	{
		// The code is blank or it does not exist in ref data so clear out the data
		Services.setValue(StandardAllowances_Popup_Description.dataBinding, "");
		Services.setValue(StandardAllowances_Popup_Allowance.dataBinding, "");
		Services.setValue(StandardAllowances_Popup_Number.dataBinding, "");		
		Services.setValue(StandardAllowances_Popup_Amount.dataBinding, "");		
		Services.setValue(StandardAllowances_Popup_DateEntered.dataBinding, "");
		// The number field should be editable			
		Services.setValue(XPathConstants.NUMBER_READ_ONLY_XPATH, "N");	
		Services.setValue(XPathConstants.AMOUNT_READ_ONLY_XPATH, "N");		
	}
}

/*********************************************************************************/

function StandardAllowances_Popup_Description() {};
StandardAllowances_Popup_Description.tabIndex = -1;
StandardAllowances_Popup_Description.isReadOnly = function() {return true;}
StandardAllowances_Popup_Description.helpText = "Description of the standard allowance";

/*********************************************************************************/

function StandardAllowances_Popup_LOVBtn() {}
StandardAllowances_Popup_LOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "StandardAllowances_Popup_Code" } ]
	}
};

StandardAllowances_Popup_LOVBtn.enableOn = [XPathConstants.POPUP_MODE_XPATH];
StandardAllowances_Popup_LOVBtn.isEnabled = isPopupInAddMode; // Only enabled when the popup is in add mode

/**
 * @author kznwpr
 * 
 */
StandardAllowances_Popup_LOVBtn.actionBinding = function()
{
	switch (getSelectedStandardAllowance())
	{
		case StandardAllowances.PERSONAL_ALLOWANCES:
			Services.dispatchEvent("PersonalAllowancesLOV", BusinessLifeCycleEvents.EVENT_RAISE);												
			break;
		case StandardAllowances.PREMIUMS:
			Services.dispatchEvent("PremiumsLOV", BusinessLifeCycleEvents.EVENT_RAISE);												
			break;
		case StandardAllowances.OTHER_LIABILITIES:
			Services.dispatchEvent("OtherLiabilitiesLOV", BusinessLifeCycleEvents.EVENT_RAISE);												
			break;
		case StandardAllowances.OTHER_RESOURCES:
			Services.dispatchEvent("OtherResourcesLOV", BusinessLifeCycleEvents.EVENT_RAISE);												
	}	
}

/*********************************************************************************/

function StandardAllowances_Popup_AllowanceCurrency() {}
StandardAllowances_Popup_AllowanceCurrency.tabIndex = -1;
StandardAllowances_Popup_AllowanceCurrency.maxLength = 3;
StandardAllowances_Popup_AllowanceCurrency.isReadOnly = function() {return true;}
StandardAllowances_Popup_AllowanceCurrency.isTemporary = function() {return true;}
StandardAllowances_Popup_AllowanceCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function StandardAllowances_Popup_Allowance() {};
StandardAllowances_Popup_Allowance.helpText = "The amount of the standard allowance";
StandardAllowances_Popup_Allowance.isReadOnly = function() {return true;}
StandardAllowances_Popup_Allowance.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

/*********************************************************************************/

function StandardAllowances_Popup_Number() {};
StandardAllowances_Popup_Number.helpText = "The number of standard allowances";
StandardAllowances_Popup_Number.maxLength = 2;
StandardAllowances_Popup_Number.isTemporary = function() {return true;}
StandardAllowances_Popup_Number.isMandatory = function() {return true;}
StandardAllowances_Popup_Number.readOnlyOn = [XPathConstants.NUMBER_READ_ONLY_XPATH];
StandardAllowances_Popup_Number.isReadOnly = function()
{
	return (Services.getValue(XPathConstants.NUMBER_READ_ONLY_XPATH) == "Y");
}

StandardAllowances_Popup_Number.validate = function()
{
	var value = Services.getValue(StandardAllowances_Popup_Number.dataBinding);
	var errCode = null;
	if (!CaseManValidationHelper.validateNumber(value))
	{
		errCode = ErrorCode.getErrorCode("CaseMan_invalid_integer_format");		
	}
	return errCode;
}

/*********************************************************************************/

function StandardAllowances_Popup_AmountCurrency() {}
StandardAllowances_Popup_AmountCurrency.tabIndex = -1;
StandardAllowances_Popup_AmountCurrency.maxLength = 3;
StandardAllowances_Popup_AmountCurrency.isReadOnly = function() {return true;}
StandardAllowances_Popup_AmountCurrency.isTemporary = function() {return true;}
StandardAllowances_Popup_AmountCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function StandardAllowances_Popup_Amount() {};
StandardAllowances_Popup_Amount.editDataLoading = false;
StandardAllowances_Popup_Amount.helpText = "The total amount allowed";
StandardAllowances_Popup_Amount.readOnlyOn = [XPathConstants.AMOUNT_READ_ONLY_XPATH];
StandardAllowances_Popup_Amount.isReadOnly = function() 
{
	var readOnly = Services.getValue(XPathConstants.AMOUNT_READ_ONLY_XPATH);
	if ("Y" == readOnly)
	{
		return true;
	}
	else
	{
		return false;
	}
}

StandardAllowances_Popup_Amount.isTemporary = function() {return true;}
StandardAllowances_Popup_Amount.isMandatory = function() {return true;}
StandardAllowances_Popup_Amount.maxLength = 7;
StandardAllowances_Popup_Amount.logicOn = [StandardAllowances_Popup_Number.dataBinding, StandardAllowances_Popup_Allowance.dataBinding];
StandardAllowances_Popup_Amount.logic = function(event)
{
	if ( true == StandardAllowances_Popup_Amount.editDataLoading || 
		 CaseManUtils.isBlank( Services.getValue(StandardAllowances_Popup_Description.dataBinding) ) ) 
	{
		return;
	}

	if ( !CaseManValidationHelper.validateFields(["StandardAllowances_Popup_Number"]) )
	{
		// The number field is invalid so clear out the amount field
		Services.setValue(this.dataBinding, "");
		return;
	}

	var allowance = Services.getValue(StandardAllowances_Popup_Allowance.dataBinding);
	var number = Services.getValue(StandardAllowances_Popup_Number.dataBinding);
	var result = "";
	
	if (CaseManUtils.isBlank(allowance) || CaseManUtils.isBlank(number))
	{
		result = "";
	}
	else
	{
		result = CaseManUtils.transformAmountToTwoDP(Number(allowance) * Number(number));
	}
	Services.setValue(this.dataBinding, result.toString());
}

StandardAllowances_Popup_Amount.validate = function()
{
	if (!validateCurrency(this.dataBinding))
	{
		var errCode = ErrorCode.getErrorCode("CaseMan_PER_AmountAllowed_Msg");
		return errCode;
	}	
}

StandardAllowances_Popup_Amount.transformToDisplay = function(value)
{
	// Only apply the formatting if the data is a valid number
	if (validateCurrency(this.dataBinding))
	{
		return CaseManUtils.transformAmountToTwoDP(value);
	}
	else
	{
		return value;
	}
}

/*********************************************************************************/

function StandardAllowances_Popup_DateEntered() {};
StandardAllowances_Popup_DateEntered.tabIndex = -1;
StandardAllowances_Popup_DateEntered.helpText = "The date the allowance was entered";
StandardAllowances_Popup_DateEntered.isReadOnly = function() {return true;}

/*********************************************************************************/

function StandardAllowances_Popup_CreatedBy() {};
StandardAllowances_Popup_CreatedBy.tabIndex = -1;
StandardAllowances_Popup_CreatedBy.helpText = "The user who created the allowance";
StandardAllowances_Popup_CreatedBy.isReadOnly = function() {return true;}

/*********************************************************************************/

function StandardAllowances_Popup_OkBtn() {};
StandardAllowances_Popup_OkBtn.validationList = ["StandardAllowances_Popup_Code", "StandardAllowances_Popup_Number", "StandardAllowances_Popup_Amount"];
StandardAllowances_Popup_OkBtn.enableOn = [StandardAllowances_Popup_Code.dataBinding, StandardAllowances_Popup_Number.dataBinding, StandardAllowances_Popup_Amount.dataBinding];
StandardAllowances_Popup_OkBtn.isEnabled = function(event)
{

	var fields = StandardAllowances_Popup_OkBtn.validationList;
	
	for (var i = 0; i < fields.length; i ++)
	{
		if (CaseManUtils.isBlank(Services.getValue(Services.getAdaptorById(fields[i]).dataBinding))) {return false;}
	}
	
	if (!CaseManValidationHelper.validateFields(StandardAllowances_Popup_OkBtn.validationList))
	{
		return false;
	}
	return true;
}

/**
 * @author kznwpr
 * 
 */
StandardAllowances_Popup_OkBtn.actionBinding = function()
{
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	
	if (isPopupInAddMode())
	{
		closePopupInAddMode();
	}
	else
	{
		// We're in edit mode
		closePopupInEditMode();		
	}

	// Clear out the data
	resetStandardAllowance();	
	
	// Calculate the total for the category that the popup is dealing with
	setTotalForCategory();			
}

/*********************************************************************************/

function StandardAllowances_Popup_CancelBtn() {};
StandardAllowances_Popup_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "StandardAllowances_Popup" } ]
	}
};

/**
 * @author kznwpr
 * 
 */
StandardAllowances_Popup_CancelBtn.actionBinding = function()
{
	Services.dispatchEvent("StandardAllowances_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	
	// Clear out data the popup is bound to
	resetStandardAllowance();	
}

/******************************* TOTALS PANEL **************************************/

function Totals_PersonalAllowances() {};
Totals_PersonalAllowances.tabIndex = -1;
Totals_PersonalAllowances.isReadOnly = function() {return true;}
Totals_PersonalAllowances.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

/*********************************************************************************/

function Totals_PersonalAllowancesCurrency() {}
Totals_PersonalAllowancesCurrency.tabIndex = -1;
Totals_PersonalAllowancesCurrency.maxLength = 3;
Totals_PersonalAllowancesCurrency.isReadOnly = function() {return true;}
Totals_PersonalAllowancesCurrency.isTemporary = function() {return true;}
Totals_PersonalAllowancesCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Totals_Premiums() {};
Totals_Premiums.tabIndex = -1;
Totals_Premiums.isReadOnly = function() {return true;}
Totals_Premiums.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

/*********************************************************************************/

function Totals_PremiumsCurrency() {}
Totals_PremiumsCurrency.tabIndex = -1;
Totals_PremiumsCurrency.maxLength = 3;
Totals_PremiumsCurrency.isReadOnly = function() {return true;}
Totals_PremiumsCurrency.isTemporary = function() {return true;}
Totals_PremiumsCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Totals_OtherLiabilities() {};
Totals_OtherLiabilities.tabIndex = -1;
Totals_OtherLiabilities.isReadOnly = function() {return true;}
Totals_OtherLiabilities.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

/*********************************************************************************/

function Totals_OtherLiabilitiesCurrency() {}
Totals_OtherLiabilitiesCurrency.tabIndex = -1;
Totals_OtherLiabilitiesCurrency.maxLength = 3;
Totals_OtherLiabilitiesCurrency.isReadOnly = function() {return true;}
Totals_OtherLiabilitiesCurrency.isTemporary = function() {return true;}
Totals_OtherLiabilitiesCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Totals_OtherResources() {};
Totals_OtherResources.tabIndex = -1;
Totals_OtherResources.isReadOnly = function() {return true;}
Totals_OtherResources.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

/*********************************************************************************/

function Totals_OtherResourcesCurrency() {}
Totals_OtherResourcesCurrency.tabIndex = -1;
Totals_OtherResourcesCurrency.maxLength = 3;
Totals_OtherResourcesCurrency.isReadOnly = function() {return true;}
Totals_OtherResourcesCurrency.isTemporary = function() {return true;}
Totals_OtherResourcesCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Totals_Total() {};
Totals_Total.tabIndex = -1;
Totals_Total.isReadOnly = function() {return true;}
Totals_Total.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value);
}

Totals_Total.logicOn = [Totals_PersonalAllowances.dataBinding, Totals_Premiums.dataBinding, Totals_OtherLiabilities.dataBinding, Totals_OtherResources.dataBinding];
Totals_Total.logic = function(event)
{
	// Set the grand total as the sum of all the other total fields
	var fields = Totals_Total.logicOn;
	
	Services.setValue(Totals_Total.dataBinding, getCalculatedTotal(fields));	
}

/*********************************************************************************/

function Totals_TotalCurrency() {}
Totals_TotalCurrency.tabIndex = -1;
Totals_TotalCurrency.maxLength = 3;
Totals_TotalCurrency.isReadOnly = function() {return true;}
Totals_TotalCurrency.isTemporary = function() {return true;}
Totals_TotalCurrency.transformToDisplay = transformCurrencyToDisplay;
