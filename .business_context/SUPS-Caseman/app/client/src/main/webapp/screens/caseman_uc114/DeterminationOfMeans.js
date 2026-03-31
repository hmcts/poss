/** 
 * @fileoverview DeterminationOfMeans.js:
 * This file conains the form and field configurations for the UC114 - 
 * Determination of means screen.
 *
 * @author Ian Stainer
 * @version 0.1
 *
 * Change History:
 * 19/06/2006 - Chris Vincent, changed all global variables to class variables and added
 *				comments to all helper functions.
 * 03/08/2006 - Chris Vincent, changed maxLength of the currency fields from 1 to 3 due to
 * 				fields being rendered invalid with migrated data in DMST.
 * 20/09/2006 - Chris Vincent, removed the transformAmount() function and all references to it and
 * 				replaced with the globally maintained function CaseManUtils.transformAmountToTwoDP().
 * 				This fixes defect 5295 whereby the maximum length of the field was being violated as
 * 				the transform to models added a '.00'.  The CaseManUtils function is passed the field
 * 				max length to ensure the problem does not manifest itself.
 * 20/09/2006 - Chris Vincent, updated Main_TotalDisposableIncome.maxLength to 12 instead of 11 to handle
 * 				the maximum values that can be entered in the fields used to calculate the amount.  No 
 * 				database change required - database already set up to handle a 10,2 number.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 21/09/2007 - Chris Vincent, updated Main_NumberOfInstallments.logic to use Math.round instead of Math.floor so the
 * 				screen uses the same function as the report.  CaseMan Defect 6191.
 * 25/09/2007 - Mark Groen CASEMAN 6439 - The disposable income calculation sometimes results in long number. 
 * 				Therefore, now transform it so always 2 d.p 
 */
 
/**
 * Enumeration of the services called by this screen
 * @author kznwpr
 * 
 */
function FormServices() {};
FormServices.GET_DOM_SERVICE = "getDom";
FormServices.UPDATE_DOM_SERVICE = "updateDom";

/**
 * Enumeration of calculated periods
 * @author kznwpr
 * 
 */
function CalculatedPeriods() {};
CalculatedPeriods.WEEKLY = "WK";
CalculatedPeriods.MONTHLY = "MTH";

/**
 * Enumeration of status types. These define the states that any standard allowance can be in.
 * @author kznwpr
 * 
 */
function Status() {};
Status.ERROR = "ERROR";

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
XPathConstants.BUSINESS_DATA_BINDING_ROOT = "/ds/DeterminationOfMeans";
XPathConstants.EVENT_907_COUNT_XPATH = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Event907Count";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.TOTALS_DATA_BINDING_ROOT = XPathConstants.VAR_PAGE_XPATH + "/Totals";
XPathConstants.CURRENCY_DATA_BINDING_ROOT = XPathConstants.VAR_PAGE_XPATH + "/Currency";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.EXITAFTERSAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ExitAfterSave";
XPathConstants.ORIG_COURTORDER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ExitAfterSave";
XPathConstants.CHANGESMADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/Status";

/******************************* FORM ELEMENT **************************************/

function determinationOfMeans() {}

// Load the reference data into the model
determinationOfMeans.refDataServices = [
	{name:"CalculatedPeriods", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCalculatedPeriods", serviceParams:[]},
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}			
];

/**
 * @author kznwpr
 * 
 */
determinationOfMeans.initialise = function()
{
	loadData();
}

/**
 * @param dom
 * @author kznwpr
 * 
 */
determinationOfMeans.onSuccess = function(dom)
{
	// Select the DeterminationOfMeans tag rather than the ds tag
	var data = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	if ( null != data )
	{
		Services.replaceNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT, data);
	}
	
	// Set the default currency for the totals currency fields
	Services.setValue(XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency", getDefaultCurrencyCode() );
	
	// Store the original values
	var originalCourtOrderValue = Services.getValue(Main_CourtOrder.dataBinding);
	Services.setValue(XPathConstants.ORIG_COURTORDER_XPATH, originalCourtOrderValue);

	// Reset the changes made flag
	Services.setValue(XPathConstants.CHANGESMADE_XPATH, "false");
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
determinationOfMeans.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception.getMessage());
}

/******************************* MAIN FUNCTIONS ************************************/

/**
 * This function indicates whether or not the controls can be enabled.  The value is based 
 * upon whether or not the per calculated period drop down has a valid value.
 *
 * @returns [Boolean] True if the controls can be enabled, else false.
 * @author kznwpr
 */
function controlsCanEnable()
{
	return Services.hasValue(Main_CalculatedPeriod.dataBinding) && 	CaseManValidationHelper.validateFields(["Main_CalculatedPeriod"]);
}

/*********************************************************************************/

/**
 * Function sets the flag indicating that changes have been made to the screen.
 * @author kznwpr
 * 
 */
function setChangesMade()
{
	Services.setValue(XPathConstants.CHANGESMADE_XPATH, "true");
}

/*********************************************************************************/

/**
 * Function indicates whether or not changes have been made on the screen.
 *
 * @returns [Boolean] True if changes have been made, else false.
 * @author kznwpr
 */
function changesMade()
{
	var changesMade = Services.getValue(XPathConstants.CHANGESMADE_XPATH);
	return ( changesMade == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function to handle closing the screen down and returning to the previous screen.
 * @author kznwpr
 * 
 */
function exitScreen()
{
	// Clean the app params used by this screen
	Services.removeNode(DeterminationOfMeansParams.PARENT);
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
 * Function handles the loading of the screen data.
 * @author kznwpr
 * @return null 
 */
function loadData()
{
	if ( !Services.hasValue(DeterminationOfMeansParams.CO_NUMBER) )
	{
		alert("No CO number supplied so not calling any services.");
		return;
	}

	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", Services.getValue(DeterminationOfMeansParams.CO_NUMBER));
	Services.callService(FormServices.GET_DOM_SERVICE, params, determinationOfMeans, true);						
}

/*********************************************************************************/

/**
 * Function returns the default currency code (GBP or EUR) as indicated in the reference data.
 *
 * @returns [String] The default currency code.
 * @author kznwpr
 */
function getDefaultCurrencyCode()
{
	var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	return defaultCurrency;
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
 * Function called by all numeric fields on the screen to validate the data entered
 *
 * @param [String] dataBinding The xpath of the field to be validated
 * @returns [Boolean] True if the value passed in is a valid number, else true
 * @author kznwpr
 */
function validateNumber(dataBinding)
{
	var amount = Services.getValue(dataBinding);
	if( Services.hasValue(dataBinding) && !validateSignedFloatNumber(amount) )
	{
		// It's not a valid number
		return false;
	}
	// It is a valid number
	return true;
}

/*********************************************************************************/

/**
 * Performs strict validation on data to see if it is a signed floating point number.
 * Also tests to see if the max number of digits has been exceeded. It allows 8 to the left
 * of the decimal point and two to the right.
 *
 * @param [Float] value The value to validate
 * @returns [Boolean] True if the value passed in is a floating point number 
 * @author kznwpr
 */
function validateSignedFloatNumber(value)
{
	// Test to see if it is a valid signed float number
	var signedFloat = /^[-+]?\d*(\.\d{1,2})?$/
	var valid = value.search(signedFloat);	

	if(value.length > 0 && 0 != valid) { return false; }
	
	// If the value contains a decimal point then extract the digits to the left
	if (value.indexOf(".") != -1)
	{
		var leftOfDecimalPoint = value.slice(0, value.indexOf("."));
		value = leftOfDecimalPoint;
	}

	// We only allow a max of 8 digits to the left of the decimal point
	if (value.length > 8) {return false;}
	return true;
}

/*********************************************************************************/

/**
 * Add a 907 event for the consolidated order. This occurs when the user
 * saves the calculator for the first time and also if any subsequent changes
 * are made to the instalment amount (court order field)
 * @author kznwpr
 * 
 */
function addEvent907()
{
	// Create the dom that will be passed to the service
	var dom = Services.loadDOMFromURL("NewEvent907.xml");
	
	// Set the data in the dom
	var currentDate = getTodaysDate();
	dom.selectSingleNode("/COEvents/COEvent/CONumber").appendChild( dom.createTextNode( Services.getValue(Header_CONumber.dataBinding) ) );
	dom.selectSingleNode("/COEvents/COEvent/EventDate").appendChild( dom.createTextNode( currentDate ) );	
	dom.selectSingleNode("/COEvents/COEvent/UserName").appendChild( dom.createTextNode( Services.getCurrentUser() ) );		
	dom.selectSingleNode("/COEvents/COEvent/ReceiptDate").appendChild( dom.createTextNode( currentDate ) );		

	var params = new ServiceParams();
	params.addDOMParameter("COEvents", dom);
	// Create the 907 event
	Services.callService("insertCoEventsAuto", params, addEvent907, true);
}

addEvent907.onSuccess = function(dom) {}

/**
 * Handle any errors
 * @param exception
 * @author kznwpr
 * 
 */
addEvent907.onError = function(exception)
{
  alert("Failed to add Event 907.\nThe following exception was thrown::\n" + exception.getMessage());
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

/******************************* DATA BINDINGS *************************************/

Header_CONumber.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CONumber";
Header_COType.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/COType"; 
Header_DebtorName.dataBinding	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DebtorName"; 

Main_CalculatedPeriod.dataBinding 				= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CalculatedPeriod";
Main_BankAccount.dataBinding 					= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/BankAccount";
Main_BankAccountCurrency.dataBinding			= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_Savings.dataBinding 						= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Savings";
Main_SavingsCurrency.dataBinding				= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_ExpensesNotAllowed.dataBinding 			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/ExpensesNotAllowed";
Main_ExpensesNotAllowedCurrency.dataBinding		= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_TotalIncome.dataBinding 					= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/TotalIncome";
Main_TotalIncomeCurrency.dataBinding 			= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_Total.dataBinding 							= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/TotalCalc";
Main_TotalCurrency.dataBinding					= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_Expenses.dataBinding 						= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Expenses";
Main_ExpensesCurrency.dataBinding 				= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_DebtorsOffer.dataBinding 					= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DebtorsOffer";
Main_DebtorsOfferCurrency.dataBinding			= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_TotalDisposableIncome.dataBinding			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/TotalDisposableIncome";
Main_TotalDisposableIncomeCurrency.dataBinding	= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_TotalDebts.dataBinding 					= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/TotalDebts";
Main_TotalDebtsCurrency.dataBinding				= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_NumberOfInstallments.dataBinding 			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/NOICalc";
Main_CourtOrder.dataBinding 					= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CourtOrder";
Main_CourtOrderCurrency.dataBinding				= XPathConstants.CURRENCY_DATA_BINDING_ROOT;
Main_ReasonForDisallowedExpenses.dataBinding 	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/ReasonForDisallowedExpenses";

/******************************* HEADER PANEL **************************************/

function Header_CONumber() {};
Header_CONumber.tabIndex = -1;
Header_CONumber.isReadOnly = function() { return true; }
Header_CONumber.helpText = "Consolidated order number";

/*********************************************************************************/

function Header_COType() {};
Header_COType.tabIndex = -1;
Header_COType.isReadOnly = function() { return true; }
Header_COType.helpText = "Consolidated order type";

/*********************************************************************************/

function Header_DebtorName() {};
Header_DebtorName.tabIndex = -1;
Header_DebtorName.isReadOnly = function() { return true; }
Header_DebtorName.helpText = "The debtor's name";

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
Main_CalculatedPeriod.helpText = "Enter value for frequency";
Main_CalculatedPeriod.logicOn = [Main_CalculatedPeriod.dataBinding];
Main_CalculatedPeriod.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }	
	setChangesMade();
}

/*********************************************************************************/

function Main_BankAccount() {}
Main_BankAccount.tabIndex = 20;
Main_BankAccount.helpText = "Enter value for bank account";
Main_BankAccount.maxLength = 11;
Main_BankAccount.componentName = "Bank account";
Main_BankAccount.validate = function()
{
	if ( !validateNumber(this.dataBinding) )
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_BankAccount.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_BankAccount.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_BankAccount.isEnabled = controlsCanEnable;
Main_BankAccount.logicOn = [Main_BankAccount.dataBinding];
Main_BankAccount.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_BankAccountCurrency() {}
Main_BankAccountCurrency.tabIndex = -1;
Main_BankAccountCurrency.maxLength = 3;
Main_BankAccountCurrency.isReadOnly = function() {return true;}
Main_BankAccountCurrency.isTemporary = function() {return true;}
Main_BankAccountCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_Savings() {}
Main_Savings.tabIndex = 30;
Main_Savings.helpText = "Enter value for savings/building society";
Main_Savings.maxLength = 11;
Main_Savings.componentName = "Savings/building society";
Main_Savings.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_Savings.isEnabled = controlsCanEnable;
Main_Savings.validate = function()
{
	if (!validateNumber(this.dataBinding))
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_Savings.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_Savings.logicOn = [Main_Savings.dataBinding];
Main_Savings.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_SavingsCurrency() {}
Main_SavingsCurrency.tabIndex = -1;
Main_SavingsCurrency.maxLength = 3;
Main_SavingsCurrency.isReadOnly = function() {return true;}
Main_SavingsCurrency.isTemporary = function() {return true;}
Main_SavingsCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_ExpensesNotAllowed() {}
Main_ExpensesNotAllowed.tabIndex = 40;
Main_ExpensesNotAllowed.helpText = "Enter value for expenses not allowed";
Main_ExpensesNotAllowed.maxLength = 11;
Main_ExpensesNotAllowed.componentName = "Expenses not allowed";
Main_ExpensesNotAllowed.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_ExpensesNotAllowed.isEnabled = controlsCanEnable;
Main_ExpensesNotAllowed.validate = function()
{
	if (!validateNumber(this.dataBinding))
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_ExpensesNotAllowed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_ExpensesNotAllowed.logicOn = [Main_ExpensesNotAllowed.dataBinding];
Main_ExpensesNotAllowed.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_ExpensesNotAllowedCurrency() {}
Main_ExpensesNotAllowedCurrency.tabIndex = -1;
Main_ExpensesNotAllowedCurrency.maxLength = 3;
Main_ExpensesNotAllowedCurrency.isReadOnly = function() {return true;}
Main_ExpensesNotAllowedCurrency.isTemporary = function() {return true;}
Main_ExpensesNotAllowedCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_TotalIncome() {}
Main_TotalIncome.tabIndex = 50;
Main_TotalIncome.helpText = "Enter value for total income";
Main_TotalIncome.maxLength = 11;
Main_TotalIncome.componentName = "Total income";
Main_TotalIncome.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_TotalIncome.isEnabled = controlsCanEnable;
Main_TotalIncome.validate = function()
{
	if (!validateNumber(this.dataBinding))
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_TotalIncome.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_TotalIncome.logicOn = [Main_TotalIncome.dataBinding];
Main_TotalIncome.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_TotalIncomeCurrency() {}
Main_TotalIncomeCurrency.tabIndex = -1;
Main_TotalIncomeCurrency.maxLength = 3;
Main_TotalIncomeCurrency.isReadOnly = function() {return true;}
Main_TotalIncomeCurrency.isTemporary = function() {return true;}
Main_TotalIncomeCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_Total() {}
Main_Total.tabIndex = -1;
Main_Total.isReadOnly = function() {return true;}
Main_Total.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

Main_Total.logicOn = [Main_BankAccount.dataBinding, Main_Savings.dataBinding, Main_ExpensesNotAllowed.dataBinding, Main_TotalIncome.dataBinding];
Main_Total.logic = function(event)
{
	var dataBindings = this.logicOn;
	for (var i = 0; i < dataBindings.length; i ++)
	{
		// Check to see if any of the controls which are included in the total are invalid
		if (!validateNumber(dataBindings[i]))
		{
			Services.setValue(this.dataBinding, Status.ERROR);
			return;
		}
	}

	var total = 0;

	// Take a copy of the array of data bindings
	var controlList = this.logicOn;
	
	// Parse the control list and calculate the total
	for (var i = 0; i < controlList.length; i++)
	{
		// Get the amount out of the control
		var amount = Services.getValue(controlList[i]);
		// Convert to a number and add to the total
		total += Number(amount);
	}
	Services.setValue(this.dataBinding, total);
}

/*********************************************************************************/

function Main_TotalCurrency() {}
Main_TotalCurrency.tabIndex = -1;
Main_TotalCurrency.maxLength = 3;
Main_TotalCurrency.isReadOnly = function() {return true;}
Main_TotalCurrency.isTemporary = function() {return true;}
Main_TotalCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_Expenses() {}
Main_Expenses.tabIndex = 60;
Main_Expenses.helpText = "Enter value for expenses";
Main_Expenses.maxLength = 11;
Main_Expenses.componentName = "Expenses";
Main_Expenses.validate = function()
{
	if (!validateNumber(this.dataBinding))
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_Expenses.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_Expenses.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_Expenses.isEnabled = controlsCanEnable;
Main_Expenses.logicOn = [Main_Expenses.dataBinding];
Main_Expenses.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_ExpensesCurrency() {}
Main_ExpensesCurrency.tabIndex = -1;
Main_ExpensesCurrency.maxLength = 3;
Main_ExpensesCurrency.isReadOnly = function() {return true;}
Main_ExpensesCurrency.isTemporary = function() {return true;}
Main_ExpensesCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_DebtorsOffer() {}
Main_DebtorsOffer.tabIndex = 70;
Main_DebtorsOffer.helpText = "Enter value for debtor's offer";
Main_DebtorsOffer.maxLength = 11;
Main_DebtorsOffer.componentName = "Debtor's offer";
Main_DebtorsOffer.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_DebtorsOffer.isEnabled = controlsCanEnable;
Main_DebtorsOffer.validate = function()
{
	if (!validateNumber(this.dataBinding))
	{
		var ec = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange_Msg");
		return ec;
	}	
}
Main_DebtorsOffer.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_DebtorsOffer.logicOn = [Main_DebtorsOffer.dataBinding];
Main_DebtorsOffer.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_DebtorsOfferCurrency() {}
Main_DebtorsOfferCurrency.tabIndex = -1;
Main_DebtorsOfferCurrency.maxLength = 3;
Main_DebtorsOfferCurrency.isReadOnly = function() {return true;}
Main_DebtorsOfferCurrency.isTemporary = function() {return true;}
Main_DebtorsOfferCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_TotalDisposableIncome() {}
Main_TotalDisposableIncome.tabIndex = -1;
Main_TotalDisposableIncome.maxLength = 12;
Main_TotalDisposableIncome.isReadOnly = function() {return true;}
Main_TotalDisposableIncome.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
Main_TotalDisposableIncome.logicOn = [Main_Total.dataBinding, Main_Expenses.dataBinding];
Main_TotalDisposableIncome.logic = function(event)
{
	var totalIncome = Number(Services.getValue(Main_Total.dataBinding));
	var totalExpenses = Number(Services.getValue(Main_Expenses.dataBinding));
	
	// Check to see if the controls contain non-numeric data
	if (isNaN(totalIncome) || isNaN(totalExpenses)) 
	{
		Services.setValue(this.dataBinding, Status.ERROR);
		return
	}
	// defect 6439 - calculation sometimes resuts in long number
	var disposableIncomeTmp = totalIncome - totalExpenses;
	
	var disposableIncome = 0;
	
	if(disposableIncomeTmp != null && disposableIncomeTmp != "" && !isNaN(disposableIncomeTmp)){
		var fVal = parseFloat(disposableIncomeTmp).toFixed(2);		
		if(!isNaN(fVal)){
			disposableIncome = CaseManUtils.isBlank(disposableIncomeTmp) ? "" : fVal;
		}		
	}
	Services.setValue(this.dataBinding, disposableIncome);
}

/*********************************************************************************/

function Main_TotalDisposableIncomeCurrency() {}
Main_TotalDisposableIncomeCurrency.tabIndex = -1;
Main_TotalDisposableIncomeCurrency.maxLength = 3;
Main_TotalDisposableIncomeCurrency.isReadOnly = function() {return true;}
Main_TotalDisposableIncomeCurrency.isTemporary = function() {return true;}
Main_TotalDisposableIncomeCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_TotalDebts() {}
Main_TotalDebts.tabIndex = -1;
Main_TotalDebts.isReadOnly = function() {return true;}
Main_TotalDebts.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/*********************************************************************************/

function Main_TotalDebtsCurrency() {}
Main_TotalDebtsCurrency.tabIndex = -1;
Main_TotalDebtsCurrency.maxLength = 3;
Main_TotalDebtsCurrency.isReadOnly = function() {return true;}
Main_TotalDebtsCurrency.isTemporary = function() {return true;}
Main_TotalDebtsCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_NumberOfInstallments() {}
Main_NumberOfInstallments.tabIndex = 90;
Main_NumberOfInstallments.isReadOnly = function() {return true;}
Main_NumberOfInstallments.logicOn = [Main_Expenses.dataBinding, Main_Total.dataBinding, Main_TotalDisposableIncome.dataBinding];
Main_NumberOfInstallments.logic = function(event)
{
	if (event.getXPath() == "/") {return;}
	var expenses 			= Number(Services.getValue(Main_Expenses.dataBinding));
	var income 				= Number(Services.getValue(Main_Total.dataBinding));
	var totalDebts 			= Number(Services.getValue(Main_TotalDebts.dataBinding));
	var disposableIncome 	= Number(Services.getValue(Main_TotalDisposableIncome.dataBinding));

	if (expenses == null || income == null || totalDebts == null || disposableIncome == null) {return;}

	if (isNaN(expenses) || isNaN(income) || isNaN(totalDebts) || isNaN(disposableIncome)) 
	{
		Services.setValue(this.dataBinding, Status.ERROR);	
		return;
	}

	if (expenses > income)
	{
		Services.setValue(this.dataBinding, "0");
	}
	else if (totalDebts < disposableIncome)
	{
		Services.setValue(this.dataBinding, "1");
	}
	else
	{
		var result = null;
		if (disposableIncome == 0) 
		{
			result = 0;
		}
		else
		{
			// Round down the result
			// CaseMan Defect 6191 - change from Math.floor to Math.round which is what the report uses
			result = Math.round(totalDebts/disposableIncome);
		}
		Services.setValue(this.dataBinding, result);
	}	
}

/*********************************************************************************/

function Main_CourtOrder() {}
Main_CourtOrder.tabIndex = 95;
Main_CourtOrder.helpText = "Enter value for court order";
Main_CourtOrder.maxLength = 11;
Main_CourtOrder.componentName = "Court order";
Main_CourtOrder.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_CourtOrder.isEnabled = controlsCanEnable;
Main_CourtOrder.validate = function()
{
	var errCode = null;
	var value = Services.getValue(this.dataBinding);

	// Check conforms to pattern
	var validCurrency = value.search(/^\d{0,8}(\.\d{2})?$/);
	if(validCurrency < 0){
		errCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat10_Msg');
	}
	else if(parseFloat(value) < 0.01){
		errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
	}

	return errCode;
}
Main_CourtOrder.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Main_CourtOrder.logicOn = [Main_CourtOrder.dataBinding];
Main_CourtOrder.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) { return; }
	setChangesMade();
}

/*********************************************************************************/

function Main_CourtOrderCurrency() {}
Main_CourtOrderCurrency.tabIndex = -1;
Main_CourtOrderCurrency.maxLength = 3;
Main_CourtOrderCurrency.isReadOnly = function() {return true;}
Main_CourtOrderCurrency.isTemporary = function() {return true;}
Main_CourtOrderCurrency.transformToDisplay = transformCurrencyToDisplay;

/*********************************************************************************/

function Main_ReasonForDisallowedExpenses() {}
Main_ReasonForDisallowedExpenses.tabIndex = 100;
Main_ReasonForDisallowedExpenses.helpText = "Enter reasons for disallowed expenses";
Main_ReasonForDisallowedExpenses.maxLength = 250;
Main_ReasonForDisallowedExpenses.enableOn = [Main_CalculatedPeriod.dataBinding];
Main_ReasonForDisallowedExpenses.isEnabled = controlsCanEnable;
Main_ReasonForDisallowedExpenses.logicOn = [Main_ReasonForDisallowedExpenses.dataBinding];
Main_ReasonForDisallowedExpenses.logic = function(event)
{
	if (event.getXPath() != this.dataBinding) {return;}
	setChangesMade();
}

Main_ReasonForDisallowedExpenses.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Main_ReasonForDisallowedExpenses.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************* STATUS BUTTONS ************************************/

function Status_SaveBtn() {}
Status_SaveBtn.tabIndex = 110;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "determinationOfMeans" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.actionBinding = function()
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length ) 
	{
		Services.setValue(XPathConstants.EXITAFTERSAVE_XPATH, "false");		
		return;
	}	

	// If there are no changes then quit
	if ( !changesMade() )
	{
		alert("Sorry, there are no changes to save.");
		return;
	}	
	
	/**
	 * If the event 907 count = 0 then this is the first time the user has saved the dom calculator
	 * so generate event 907.  Otherwise if the court order (instalment amount) has changed then 
	 * generate event 907
	 */
	var event907Count = Services.getValue(XPathConstants.EVENT_907_COUNT_XPATH);
	var courtOrder = Services.getValue(Main_CourtOrder.dataBinding);
	var originalCourtOrder = Services.getValue(XPathConstants.ORIG_COURTORDER_XPATH);
	if ( event907Count == 0 || courtOrder != originalCourtOrder )	
	{
		addEvent907();
	}

	// Make service call...
	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	// Identify the /ds/DeterminationOfMeans node in the existing dom and take a copy of it
	var domNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	// Create the /ds node that will be added to the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	// Append the determination of means node to the ds node
	dsNode.appendChild(domNode);
	// Add the ds node, which now contains a copy of all the business data
	businessDataDOM.appendChild(dsNode);
	
	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("determinationOfMeans", businessDataDOM);
	// Call the update service
	Services.callService(FormServices.UPDATE_DOM_SERVICE, params, Status_SaveBtn, true);
}

/**
 * @param dom
 * @param serviceName
 * @author kznwpr
 * 
 */
Status_SaveBtn.onSuccess = function(dom, serviceName)
{
	// If we have come here by clicking the close button and there were changes to
	// save then close the screen down and don't bother reloading the data after the save
	var exitAfterSave = Services.getValue(XPathConstants.EXITAFTERSAVE_XPATH);
	if ( exitAfterSave == "true" )
	{
		exitScreen();
	}
	else
	{
		// Reload the saved data
		loadData();					
	}
}	

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception.getMessage());
}

/*********************************************************************************/

function Status_CloseBtn() {}
Status_CloseBtn.tabIndex = 120;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "determinationOfMeans" } ]
	}
};

/**
 * @author kznwpr
 * 
 */
Status_CloseBtn.actionBinding = function()
{
	// Check if any unsaved data
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.EXITAFTERSAVE_XPATH, "true");
		Status_SaveBtn.actionBinding();
	}
	else
	{
		// No changes to save, just exit the screen
		exitScreen();
	}
}

/******************* ORACLE REPORT PROGRESS BAR POPUP ******************************/

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author kznwpr
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}	
