/** 
 * @fileoverview ResolveOverpayments.js:
 * This file contains the form and field configurations for UC063 - Resolve Overpayments screen.
 *
 * @author Steve Blair
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 18/01/2007 - Steve Blair, UCT Defect 670.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 13/02/2007 - Steve Blair, Defect 5956.
 * 06/08/2010 - Chris Vincent, change to Payee_OverpaymentAmount validation and read only methods.  Field is now read only if
 *				the enforcement type is CO.  The validation check on the amount being greater than 1 pound has been altered so
 *				now checks is greater than 0.00.  Trac 2207.
 * 06/05/2011 - Chris Vincent, added Payee_Name.validate method for Trac 3627 to prevent the overpayee name being the same as the 
 *				payee name.
 * 21/06/2012 - Des Johnston, Trac 4624.  Amended function trimTransform and added a transformToDisplay configuration to the Payee_Name object to prevent
 *              the overpayee name being the same as the payee name.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Enforcement Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function for Home Warrants.
 */
//-----------------------------------------------------------------------------------------------
//                                        GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

var BASE_XPATH = "/ds/var/page";
var REF_XPATH = "/ds/var/form";
var ENFORCEMENT_XPATH = "/ds/PaymentData/Enforcement";
var PAYMENT_XPATH = "/ds/PaymentData/Payment";
var SEARCH_RESULTS_XPATH = BASE_XPATH + "/SearchResults";
var COURTS_XPATH = REF_XPATH + "/Courts";
var FORM_STATE_XPATH = REF_XPATH + "/state";
var FORM_DIRTY_XPATH = REF_XPATH + "/dirty";

var FLAGS_XPATH = BASE_XPATH + "/Flags";
var PROCESSING_SAVE_XPATH = FLAGS_XPATH + "/ProcessingSave";
var PROCESSING_SEARCH_XPATH = FLAGS_XPATH + "/ProcessingSearch";
var PARTY_SELECTED_XPATH = FLAGS_XPATH + "/PartySelected";
var APP_CLOSING_XPATH = FLAGS_XPATH + "/AppClosing";
var SCREEN_CLOSING_XPATH = FLAGS_XPATH + "/ScreenClosing";

var IS_NAVIGATING_XPATH = "/ds/var/app/PaymentParams/IsNavigating";
var REPORT_DATA_XPATH = "/ds/var/app/PaymentParams/ReportData";
var TRANS_NO_XPATH = "/ds/var/app/PaymentParams/TransactionNumber";
var ENFORCE_NO_XPATH = "/ds/var/app/PaymentParams/EnforcementNumber";
var ENFORCE_TYPE_XPATH = "/ds/var/app/PaymentParams/EnforcementType";

//-----------------------------------------------------------------------------------------------
//                                        FUNCTION CLASSES
//-----------------------------------------------------------------------------------------------

function ResolveOverpayments() {};
function exitScreenHandler() {};

function Header_TransactionNumber() {};
function Header_EnforcementNumber() {};
function Header_EnforcementType() {};
function Header_CourtCode() {};
function Header_CourtName() {};
function Header_SearchBtn() {};
function Lov_SearchResults() {};

function Parties_Grid() {};

function Payment_Amount() {};
function Payment_AmountCurrency() {};
function Payment_PaymentType() {};
function Payment_RetentionType() {};

function Payee_OverpaymentAmount() {};
function Payee_OverpaymentAmountCurrency() {};
function Payee_AmountNowDue() {};
function Payee_AmountNowDueCurrency() {};
function Payee_Name() {};
function Payee_LovBtn() {};
function Lov_Payee() {};
function Payee_Address1() {};
function Payee_Address2() {};
function Payee_Address3() {};
function Payee_Address4() {};
function Payee_Address5() {};
function Payee_PostCode() {};

function Status_SaveBtn() {};
function Status_ClearBtn() {};
function Status_CloseBtn() {};

//-----------------------------------------------------------------------------------------------
//                                        DATA BINDINGS
//-----------------------------------------------------------------------------------------------

ResolveOverpayments.dataBinding = REF_XPATH;

Header_TransactionNumber.dataBinding = PAYMENT_XPATH + "/TransactionNumber";
Header_EnforcementNumber.dataBinding = PAYMENT_XPATH + "/EnforcementNumber";
Header_EnforcementType.dataBinding = PAYMENT_XPATH + "/EnforcementType";
Header_CourtCode.dataBinding = CaseManFormParameters.COURTNUMBER_XPATH;
Header_CourtName.dataBinding = COURTS_XPATH + "/Court[Code = " + Header_CourtCode.dataBinding + "]/Name";
Lov_SearchResults.dataBinding = BASE_XPATH + "/SelectedOverpayment";

Parties_Grid.dataBinding = BASE_XPATH + "/SelectedParty";

Payment_Amount.dataBinding = PAYMENT_XPATH + "/Amount";
Payment_AmountCurrency.dataBinding = PAYMENT_XPATH + "/AmountCurrency";
Payment_PaymentType.dataBinding = PAYMENT_XPATH + "/PaymentType";
Payment_RetentionType.dataBinding = PAYMENT_XPATH + "/RetentionType";

Payee_OverpaymentAmount.dataBinding = PAYMENT_XPATH + "/OverpaymentAmount";
Payee_OverpaymentAmountCurrency.dataBinding = PAYMENT_XPATH + "/OverpaymentAmountCurrency";
Payee_AmountNowDue.dataBinding = PAYMENT_XPATH + "/AmountNowDue";
Payee_AmountNowDueCurrency.dataBinding = Payment_AmountCurrency.dataBinding;
Payee_Name.dataBinding = PAYMENT_XPATH + "/Overpayee/Name";
Lov_Payee.dataBinding = BASE_XPATH + "/SelectedPayee";
Payee_Address1.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/Line[1]";
Payee_Address2.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/Line[2]";
Payee_Address3.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/Line[3]";
Payee_Address4.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/Line[4]";
Payee_Address5.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/Line[5]";
Payee_PostCode.dataBinding = PAYMENT_XPATH + "/Overpayee/Address/PostCode";

//-----------------------------------------------------------------------------------------------
//                                        MAIN FORM
//-----------------------------------------------------------------------------------------------

ResolveOverpayments.initialise = checkStartOfDay;

ResolveOverpayments.startupState = {mode: "blank"}

ResolveOverpayments.refDataServices = [
	{name: "EnforcementTypes", dataBinding: REF_XPATH, fileName: "EnforcementTypes.xml"},
	{name: "RetentionTypes", dataBinding: REF_XPATH, serviceName: "getRetentionTypes", serviceParams: []},
	{name: "PaymentTypes", dataBinding: REF_XPATH, serviceName: "getPaymentTypes", serviceParams: []},
	{name: "SystemDate", dataBinding: REF_XPATH, serviceName: "getSystemDate", serviceParams: []},
	{name: "Courts", dataBinding: REF_XPATH, serviceName:"getCourtsShort", serviceParams: []}
];

ResolveOverpayments.modifyLifeCycle = {
	serviceName: "getPaymentWithEnforcement",
	serviceParams: [
		{name: "transactionNumber", value: TRANS_NO_XPATH}
	],
	dataBinding: "/ds",
	errorHandler: {
/**
 * @param e
 * @author tzzmr4
 * 
 */
		onError:	function(e)
						{
							alert("Error - Cannot connect to database.\n\n" + e);
							Services.setValue(PROCESSING_SEARCH_XPATH, "false");
							clearScreen();
						}
	}
};

// Is called after the Modify lifecycle event to perform post lifecycle checks.
Payment_AmountCurrency.logicOn = [FORM_STATE_XPATH];
Payment_AmountCurrency.logic = function()
{
	var lifecycle = Services.getValue(FORM_STATE_XPATH);
	if(lifecycle == "modify") {
		if(Services.exists(ENFORCEMENT_XPATH) && Services.exists(PAYMENT_XPATH)) {
			if(validatePayment()) {
				Services.setFocus("Payee_OverpaymentAmount");
			}
			else {
				clearScreen();
			}
		}
		else {
			alert(Messages.NO_PAYMENTS_FOUND);
			clearScreen();
		}
		Services.setValue(PROCESSING_SEARCH_XPATH, "false");
	}
}

ResolveOverpayments.submitLifeCycle = {
	modify: {
		name: "updatePayment",
		params: [{name: "payment", node: PAYMENT_XPATH}],
		errorHandler: {
/**
 * @param e
 * @author tzzmr4
 * 
 */
			onError:	function(e)
							{
								var message = e.message.slice(e.message.lastIndexOf(":") + 1);
								if(message == "Write/write conflict occurred on table 'PAYMENTS'") {
									alert(Messages.OTHER_TRANSACTIONS_ERROR);
								}
								else {
									alert(Messages.CANNOT_SAVE_OVERPAYMENT_ERROR + "\n\n" + e);
								}
								Services.setValue(PROCESSING_SAVE_XPATH, "false");
							}
		}
	},
	postSubmitAction: {
/**
 * @param dom
 * @author tzzmr4
 * 
 */
		custom: function(dom)
		{
			var reportNumber = XML.getNodeTextContent(dom.selectSingleNode("/Payment/ReportNumber"));
			Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", reportNumber);
			
			if(Services.getValue(SCREEN_CLOSING_XPATH) == "true") {
				performScreenCleanup();
			}
			else {
				Services.setValue(PROCESSING_SAVE_XPATH, "false");
				clearScreen();
			}
		}
	}
};

/**
 * @author tzzmr4
 * 
 */
exitScreenHandler.handleExit = function()
{
	Services.setValue(APP_CLOSING_XPATH, "true");
	exitScreen();
}

//-----------------------------------------------------------------------------------------------
//                                        INPUTS
//-----------------------------------------------------------------------------------------------

Header_TransactionNumber.transformToModel = trimTransform;
Header_TransactionNumber.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_TransactionNumber.isReadOnly = function() {return !inQueryMode() || isProcessingSearch();}
Header_TransactionNumber.tabIndex = 3;
Header_TransactionNumber.helpText = "Enter Transaction Number";
Header_TransactionNumber.maxLength = 10;
Header_TransactionNumber.validateOn = [Header_TransactionNumber.dataBinding];
Header_TransactionNumber.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if(!CaseManValidationHelper.validateNumber(value)) {
		return ErrorCode.getErrorCode("Caseman_invalidTransactionNumber_Msg");
	}
	return null;
}

Header_EnforcementNumber.transformToModel = trimTransform;
Header_EnforcementNumber.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_EnforcementNumber.isReadOnly = function() {return !inQueryMode() || isProcessingSearch();}
Header_EnforcementNumber.helpText = "Enter AE No, Home Warrant No, Foreign Warrant No, AO/CAEO No or Case No";
Header_EnforcementNumber.maxLength = 8;
Header_EnforcementNumber.tabIndex = 1;
Header_EnforcementNumber.validateOn = [Header_EnforcementNumber.dataBinding, Header_EnforcementType.dataBinding];
Header_EnforcementNumber.validate = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(!CaseManUtils.isBlank(enforcementType)) {
		var value = Services.getValue(this.dataBinding);
		switch(enforcementType) {
			case "HOME WARRANT":
				return CaseManValidationHelper.validateNewWarrantNumber(value);
			case "FOREIGN WARRANT":
				return CaseManValidationHelper.validateLocalWarrantNumber(value);
			case "CASE":
				return CaseManValidationHelper.validateCaseNumber(value);
			case "CO":
				return CaseManValidationHelper.validateCoNumber(value);
			case "AE":
				return CaseManValidationHelper.validateAeNumber(value);
		}
	}
	return null;
}
Header_EnforcementNumber.mandatoryOn = [Header_EnforcementType.dataBinding];
Header_EnforcementNumber.isMandatory = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding));
}

Header_CourtCode.isReadOnly = function() {return true;}
Header_CourtCode.helpText = "Code of the court that issued the payment";

Header_CourtName.isReadOnly = function() {return true;}
Header_CourtName.helpText = "Name of the court that issued the payment";

Payment_Amount.isReadOnly = function() {return true;}
Payment_Amount.helpText = "The original Payment amount";
Payment_Amount.transformToDisplay = transformToCurrency;
Payment_Amount.enableOn = [FORM_STATE_XPATH];
Payment_Amount.isEnabled = function() {return !inQueryMode();}
Payment_AmountCurrency.isReadOnly = function() {return true;}
Payment_AmountCurrency.transformToDisplay = convertCurrencyToSymbol;
Payment_AmountCurrency.enableOn = [FORM_STATE_XPATH];
Payment_AmountCurrency.isEnabled = function() {return !inQueryMode();}

Payment_PaymentType.isReadOnly = function() {return true;}
Payment_PaymentType.enableOn = [FORM_STATE_XPATH];
Payment_PaymentType.isEnabled = function() {return !inQueryMode();}
Payment_PaymentType.helpText = "Method by which payment was originally made";
Payment_PaymentType.transformToDisplay = function(value)
{
	value = Services.getValue(REF_XPATH + "/PaymentTypes/PaymentType[Code = '" + value + "']/Display");
	return (null != value) ? value.toUpperCase() : null;
}

Payment_RetentionType.isReadOnly = function() {return true;}
Payment_RetentionType.enableOn = [FORM_STATE_XPATH];
Payment_RetentionType.isEnabled = function() {return !inQueryMode();}
Payment_RetentionType.helpText = "Retention Type for retrieved Payment";
Payment_RetentionType.transformToDisplay = function(value)
{
	value = Services.getValue(REF_XPATH + "/RetentionTypes/RetentionType[Code = '" + value + "']/Display");
	return (null != value) ? value.toUpperCase() : null;
}

Payee_OverpaymentAmount.readOnlyOn = [PROCESSING_SAVE_XPATH, Header_EnforcementType.dataBinding];
Payee_OverpaymentAmount.isReadOnly = function()
{
	var blnReadOnly = false;
	if ( isProcessingSave() )
	{
		blnReadOnly = true;
	}
	else
	{
		// Trac 2207, Overpayment amount is read only if the enforcement type is CO
		var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
		if ( enforcementType == "CO" )
		{
			blnReadOnly = true;
		}
	}
	return blnReadOnly;
}

Payee_OverpaymentAmount.enableOn = [FORM_STATE_XPATH];
Payee_OverpaymentAmount.isEnabled = function() {return !inQueryMode();}
Payee_OverpaymentAmount.transformToModel = trimTransformCurrency;
Payee_OverpaymentAmount.helpText = "The amount overpaid on the payment";
Payee_OverpaymentAmount.maxLength = 11;
Payee_OverpaymentAmount.validateOn = [Payee_OverpaymentAmount.dataBinding];
Payee_OverpaymentAmount.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	var paymentAmount = Services.getValue(Payment_Amount.dataBinding);
	
	if(CaseManUtils.isBlank(value)) {
		return null;
	}

	var formatError = ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg");
	var format = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, formatError);
	if(format != null) {
		return formatError;
	}
	
	var rangeError = ErrorCode.getErrorCode("Caseman_overpaymentRangeError_Msg");
	// Trac 2207 - changed range from 1.01 to 0.01 as overpayments of £1 or less are not possible anymore
	var range = CaseManValidationHelper.validateValueInRange(value, 0.01, 99999999.99, rangeError);
	if(range != null) {
		return rangeError;
	}
	
	if(value * 1 > paymentAmount * 1) {
		return ErrorCode.getErrorCode("Caseman_overpaymentExceedsAmount_Msg");
	}
	
	return null;
}
Payee_OverpaymentAmount.transformToDisplay = transformToCurrency;
Payee_OverpaymentAmount.tabIndex = 5;
Payee_OverpaymentAmountCurrency.isReadOnly = function() {return true;}
Payee_OverpaymentAmountCurrency.enableOn = [FORM_STATE_XPATH];
Payee_OverpaymentAmountCurrency.isEnabled = function() {return !inQueryMode();}
Payee_OverpaymentAmountCurrency.transformToDisplay = convertCurrencyToSymbol;

Payee_AmountNowDue.isReadOnly = function() {return true;}
Payee_AmountNowDue.enableOn = [FORM_STATE_XPATH];
Payee_AmountNowDue.isEnabled = function() {return !inQueryMode();}
Payee_AmountNowDue.logicOn = [Payee_OverpaymentAmount.dataBinding];
Payee_AmountNowDue.logic = function()
{
	var amount = Services.getValue(Payment_Amount.dataBinding);
	var overpaymentAmount = Services.getValue(Payee_OverpaymentAmount.dataBinding);
	
	if(!isNaN(overpaymentAmount)) {
		Services.setValue(this.dataBinding, amount - overpaymentAmount);
	}
	else {
		Services.setValue(this.dataBinding, "");
	}
}
Payee_AmountNowDue.helpText = "Balance due to be paid after over paid amount has been deducted from original amount";
Payee_AmountNowDue.transformToDisplay = transformToCurrency;
Payee_AmountNowDueCurrency.isReadOnly = function() {return true;}
Payee_AmountNowDueCurrency.enableOn = [FORM_STATE_XPATH];
Payee_AmountNowDueCurrency.isEnabled = function() {return !inQueryMode();}
Payee_AmountNowDueCurrency.transformToDisplay = convertCurrencyToSymbol;

Payee_Name.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Name.isReadOnly = isProcessingSave;
Payee_Name.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Name.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Name.transformToModel = trimTransform;
Payee_Name.transformToDisplay = trimTransform;  /** added for trac 4624 */
Payee_Name.helpText = "Full Name of payee to receive the refund";
Payee_Name.maxLength = 70;
Payee_Name.mandatoryOn = [Payee_OverpaymentAmount.dataBinding];
Payee_Name.isMandatory = function() {return !isAmountCleared();}
Payee_Name.tabIndex = 7;
Payee_Name.logicOn = [FORM_STATE_XPATH];
Payee_Name.logic = function()
{
	var xpath =	ENFORCEMENT_XPATH + "/Parties/Party[Role != 'CLAIMANT' and Role != 'JUDGMENT CREDITOR' " +
						"and Role != 'PARTY FOR'][1]";
	if(Services.countNodes(xpath) == 1) {
		Services.setValue(Lov_Payee.dataBinding, Services.getValue(xpath + "/Number"));
	}
}

/**
 * Validate that the Payee Name is not equal to the Overpayee Name (Trac 3627).
 */
Payee_Name.validate = function()
{
	var payeeName = Services.getValue(PAYMENT_XPATH + "/Payee/Name");
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if ( !CaseManUtils.isBlank(payeeName) && enforcementType != "CO" )
	{
		var overpayeeName = trimTransform(Services.getValue(this.dataBinding));
		if ( overpayeeName == trimTransform(payeeName) ) 
		{
			// Non CO overpayment and Overpayee Name set to Payee Name
			return ErrorCode.getErrorCode("Caseman_invalidOverpayeeName_Msg");
		}
	}
	return null;
}

Payee_Address1.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address1.isReadOnly = isProcessingSave;
Payee_Address1.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Address1.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Address1.transformToModel = trimTransform;
Payee_Address1.helpText = "1st line of Address for the overpayee";
Payee_Address1.maxLength = 35;
Payee_Address1.mandatoryOn = [Payee_OverpaymentAmount.dataBinding];
Payee_Address1.isMandatory = function() {return !isAmountCleared();}
Payee_Address1.tabIndex = 8;
Payee_Address1.logicOn = [Payee_OverpaymentAmount.dataBinding];
Payee_Address1.logic = function()
{
	if(CaseManUtils.isBlank(Services.getValue(Payee_OverpaymentAmount.dataBinding))) {
		clearPayeeDetails();
	}
}

Payee_Address2.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address2.isReadOnly = isProcessingSave;
Payee_Address2.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Address2.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Address2.transformToModel = trimTransform;
Payee_Address2.helpText = "2nd line of Address for the overpayee";
Payee_Address2.maxLength = 35;
Payee_Address2.mandatoryOn = [Payee_OverpaymentAmount.dataBinding];
Payee_Address2.isMandatory = function() {return !isAmountCleared();}
Payee_Address2.tabIndex = 9;

Payee_Address3.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address3.isReadOnly = isProcessingSave;
Payee_Address3.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Address3.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Address3.transformToModel = trimTransform;
Payee_Address3.helpText = "3rd line of Address for the overpayee";
Payee_Address3.maxLength = 35;
Payee_Address3.tabIndex = 10;

Payee_Address4.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address4.isReadOnly = isProcessingSave;
Payee_Address4.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Address4.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Address4.transformToModel = trimTransform;
Payee_Address4.helpText = "4th line of Address for the overpayee";
Payee_Address4.maxLength = 35;
Payee_Address4.tabIndex = 11;

Payee_Address5.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address5.isReadOnly = isProcessingSave;
Payee_Address5.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_Address5.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_Address5.transformToModel = trimTransform;
Payee_Address5.helpText = "5th line of Address for the overpayee";
Payee_Address5.maxLength = 35;
Payee_Address5.tabIndex = 12;

Payee_PostCode.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_PostCode.isReadOnly = isProcessingSave;
Payee_PostCode.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding];
Payee_PostCode.isEnabled = function() {return !inQueryMode() && !isAmountCleared();}
Payee_PostCode.transformToModel = trimTransform;
Payee_PostCode.helpText = "Postcode of overpayee address";
Payee_PostCode.maxLength = 8;
Payee_PostCode.tabIndex = 13;
Payee_PostCode.validateOn = [Payee_PostCode.dataBinding];
Payee_PostCode.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	
	if(!CaseManValidationHelper.validatePostCode(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

//-----------------------------------------------------------------------------------------------
//                                        BUTTONS
//-----------------------------------------------------------------------------------------------

Header_SearchBtn.enableOn = [
	Header_TransactionNumber.dataBinding,
	Header_EnforcementNumber.dataBinding,
	Header_EnforcementType.dataBinding,
	FORM_STATE_XPATH,
	PROCESSING_SEARCH_XPATH
];
Header_SearchBtn.isEnabled = function()
{
	if(!inQueryMode() || isProcessingSearch()) {
		return false;
	}
	var areParamsBlank =	CaseManUtils.isBlank(Services.getValue(Header_TransactionNumber.dataBinding)) &&
										CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) &&
										CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding));
	if(areParamsBlank) {
		return false;
	}
	else {
		var areParamsValid = true;
		if(!CaseManUtils.isBlank(Services.getValue(Header_TransactionNumber.dataBinding))) {
			areParamsValid = Header_TransactionNumber.validate() == null;
		}
		if(!CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding))) {
			areParamsValid =	areParamsValid &&
										!CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) &&
										Header_EnforcementNumber.validate() == null;
		}
		if(!CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding))) {
			areParamsValid =	areParamsValid &&
										!CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding));
		}
		return areParamsValid;
	}
}
/**
 * @author tzzmr4
 * 
 */
Header_SearchBtn.actionBinding = function()
{
	if(CaseManUtils.isBlank(Services.getValue(TRANS_NO_XPATH))) {
		setDefaultFormPersistantData();
	}
	
	var params = new ServiceParams();
	params.addSimpleParameter(
		"transactionNumber",
		CaseManUtils.getValidNodeValue(Services.getValue(TRANS_NO_XPATH))
	);
	params.addSimpleParameter(
		"enforcementNumber",
		CaseManUtils.getValidNodeValue(Services.getValue(ENFORCE_NO_XPATH))
	);
	params.addSimpleParameter(
		"enforcementType",
		CaseManUtils.getValidNodeValue(Services.getValue(ENFORCE_TYPE_XPATH))
	);
	Services.callService("searchOverpayments", params, Header_SearchBtn, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
Header_SearchBtn.onSuccess = function(dom)
{
	if(dom != null) {
		var results = dom.selectSingleNode("/SearchResults");
		if(results != null) {
			Services.replaceNode(SEARCH_RESULTS_XPATH, results);
			var noResults = Services.countNodes(SEARCH_RESULTS_XPATH + "/Payment");
			if(noResults > 1) {
				Services.dispatchEvent("Lov_SearchResults", PopupGUIAdaptor.EVENT_RAISE);
			}
			else if(noResults > 0) {
				var transNo = Services.getValue(SEARCH_RESULTS_XPATH + "/Payment/TransactionNumber");
				Services.setValue(Lov_SearchResults.dataBinding, transNo);
			}
			else {
				alert(Messages.NO_OVERPAYMENTS_FOUND);
			}
		}
		else {
			this.onError();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
Header_SearchBtn.onError = function(e)
{
	alert(Messages.ERROR_PERFORMING_SEARCH + "\n\n" + e);
}
Header_SearchBtn.tabIndex = 4;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F1, element: "ResolveOverpayments"}]
	}
}

Payee_LovBtn.enableOn = [FORM_STATE_XPATH, Payee_OverpaymentAmount.dataBinding, PROCESSING_SAVE_XPATH];
Payee_LovBtn.isEnabled = function() {return !inQueryMode() && !isAmountCleared() && !isProcessingSave();}
/**
 * @author tzzmr4
 * 
 */
Payee_LovBtn.actionBinding = function()
{
	Services.setValue(PARTY_SELECTED_XPATH, "true");
	Services.dispatchEvent("Lov_Payee", PopupGUIAdaptor.EVENT_RAISE);
}
Payee_LovBtn.tabIndex = 6;
Payee_LovBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F6, element: "Payee_Name"}]
	}
}

Status_SaveBtn.enableOn = [FORM_DIRTY_XPATH, PROCESSING_SAVE_XPATH];
Status_SaveBtn.isEnabled = function() {return isFormDirty() && !isProcessingSave();}
Status_SaveBtn.actionBinding = savePayment;
Status_SaveBtn.tabIndex = 14;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F3, element: "ResolveOverpayments"}]
	}
}

/**
 * @author tzzmr4
 * @return null 
 */
Status_ClearBtn.actionBinding = function()
{
	if(saveChangesPrompt()) {
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if(invalidFields.length != 0) {
			return;
		}
		savePayment();
	}
	else {
		clearScreen();
	}
}
Status_ClearBtn.tabIndex = 15;
Status_ClearBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_ClearBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.CHAR_C, element: "ResolveOverpayments", alt: true}]
	}
}

Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.tabIndex = 16;
Status_CloseBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_CloseBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F4, element: "ResolveOverpayments"}]
	}
}

//-----------------------------------------------------------------------------------------------
//                                        SELECTS
//-----------------------------------------------------------------------------------------------

Header_EnforcementType.srcData = REF_XPATH + "/EnforcementTypes";
Header_EnforcementType.rowXPath = "EnforcementType";
Header_EnforcementType.keyXPath = "Code";
Header_EnforcementType.displayXPath = "Code";
Header_EnforcementType.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_EnforcementType.isReadOnly = function() {return !inQueryMode() || isProcessingSearch();}
Header_EnforcementType.helpText = "Case/Enforcement type";
Header_EnforcementType.tabIndex = 2;
Header_EnforcementType.mandatoryOn = [Header_EnforcementNumber.dataBinding];
Header_EnforcementType.isMandatory = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding));
}

//-----------------------------------------------------------------------------------------------
//                                        LOV GRIDS
//-----------------------------------------------------------------------------------------------

Lov_SearchResults.srcData = BASE_XPATH + "/SearchResults";
Lov_SearchResults.rowXPath = "Payment";
Lov_SearchResults.keyXPath = "TransactionNumber";
Lov_SearchResults.columns = [
	{xpath: "EnforcementType"},
	{xpath: "TransactionNumber", defaultSort: "true", sort: "numerical", defaultSortOrder: "descending"},
	{xpath: "EnforcementNumber"}
];
Lov_SearchResults.logicOn = [Lov_SearchResults.dataBinding];
Lov_SearchResults.logic = function()
{
	if(!CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		Services.setValue(PROCESSING_SEARCH_XPATH, "true");
		populateFormPersistantData();
		Services.dispatchEvent("ResolveOverpayments", BusinessLifeCycleEvents.EVENT_MODIFY, null);
	}
}

Parties_Grid.srcData = ENFORCEMENT_XPATH + "/Parties";
Parties_Grid.rowXPath = "Party[Role != 'SOLICITOR']";
Parties_Grid.keyXPath = "Name";
Parties_Grid.columns = [
	{xpath: "Role"},
	{xpath: "Number"},
	{xpath: "Name"}
];
Parties_Grid.tabIndex = -1;

Lov_Payee.srcData = ENFORCEMENT_XPATH + "/Parties";
Lov_Payee.rowXPath = "Party[Role != 'CLAIMANT' and Role != 'JUDGMENT CREDITOR' and Role != 'PARTY FOR']";
Lov_Payee.keyXPath = "Number";
Lov_Payee.columns = [{xpath: "Role"}, {xpath: "Name", defaultSort: "true"}];
Lov_Payee.logicOn = [Lov_Payee.dataBinding];
Lov_Payee.logic = function()
{
	if(!CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		// Blank databinding afterwards so databindings will fire if same party selected again at a later date.
		if(Services.getValue(PARTY_SELECTED_XPATH) == "true" || CaseManUtils.isBlank(Services.getValue(Payee_Name.dataBinding))) {
			var xpath = 	this.srcData + "/Party[Role != 'CLAIMANT' and Role != 'JUDGMENT CREDITOR' and " + 
								"Role != 'PARTY FOR' and Number = " + this.dataBinding + "]";
			var name = Services.getValue(xpath + "/Name");
			var address1 = Services.getValue(xpath + "/Address/Line[1]");
			var address2 = Services.getValue(xpath + "/Address/Line[2]");
			var address3 = Services.getValue(xpath + "/Address/Line[3]");
			var address4 = Services.getValue(xpath + "/Address/Line[4]");
			var address5 = Services.getValue(xpath + "/Address/Line[5]");
			var postCode = Services.getValue(xpath + "/Address/PostCode");
			
			Services.startTransaction();
			Services.setValue(Payee_Name.dataBinding, name);
			Services.setValue(Payee_Address1.dataBinding, address1);
			Services.setValue(Payee_Address2.dataBinding, address2);
			Services.setValue(Payee_Address3.dataBinding, address3);
			Services.setValue(Payee_Address4.dataBinding, address4);
			Services.setValue(Payee_Address5.dataBinding, address5);
			Services.setValue(Payee_PostCode.dataBinding, postCode);
			Services.setValue(this.dataBinding, "");
			Services.endTransaction();
		}
		else {
			Services.setValue(this.dataBinding, "");
		}
	}
}

//-----------------------------------------------------------------------------------------------
//                                        HELPER FUNCTIONS
//-----------------------------------------------------------------------------------------------

/**
 * @author tzzmr4
 * @return CaseManUtils.isBlank(Services.getValue(TRANS_NO_XPATH)) && 
 */
function inQueryMode()
{
	return	CaseManUtils.isBlank(Services.getValue(TRANS_NO_XPATH)) &&
				CaseManUtils.isBlank(Services.getValue(ENFORCE_NO_XPATH)) &&
				CaseManUtils.isBlank(Services.getValue(ENFORCE_TYPE_XPATH));
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function isFormDirty()
{
	return Services.getValue(FORM_DIRTY_XPATH) == "true";
}

/**
 * Function converts a currency code to a currency symbol
 * 
 * @param currencyCode The currency Code
 * @author tzzmr4
 * @return the Currency symbol
 */
function convertCurrencyToSymbol(currencyCode)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, null, "");
}

/**
 * @author tzzmr4
 * 
 */
function clearScreen()
{
	clearFormPersistantData();
	setDirtyFlagFalse();
	Services.dispatchEvent("ResolveOverpayments", BusinessLifeCycleEvents.EVENT_CLEAR, null);
	Services.setFocus("Header_EnforcementNumber");
}

/**
 * @param value
 * @author tzzmr4
 * @return null , value , amount  
 */
function transformToCurrency(value)
{
	if(inQueryMode()) return null;
	
	if(isNaN(value)) return value;
	
	var amount = (CaseManUtils.isBlank(value)) ? null : parseFloat(value).toFixed(2);

	if(amount != null && amount.length > 11) return value;

	return amount;
}

/**
 * @author tzzmr4
 * @return !CaseManUtils.isBlank(Services.getValue(Payee_Name.dataBinding)) || 
 */
function isAddressMandatory()
{
	return 	!CaseManUtils.isBlank(Services.getValue(Payee_Name.dataBinding)) ||
				!CaseManUtils.isBlank(Services.getValue(Payee_Address1.dataBinding)) ||
				!CaseManUtils.isBlank(Services.getValue(Payee_Address2.dataBinding));
}

/**
 * @author tzzmr4
 * 
 */
function clearFormPersistantData()
{
	Services.startTransaction();
	Services.setValue(TRANS_NO_XPATH, null);
	Services.setValue(ENFORCE_NO_XPATH, null);
	Services.setValue(ENFORCE_TYPE_XPATH, null);
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function clearSessionPersistantData()
{
	Services.removeNode(IS_NAVIGATING_XPATH);
	Services.removeNode(REPORT_DATA_XPATH);
}

/**
 * @author tzzmr4
 * 
 */
function populateFormPersistantData()
{
	Services.startTransaction();
		
	Services.setValue(TRANS_NO_XPATH, Services.getValue(Lov_SearchResults.dataBinding));
	
	var xpath = SEARCH_RESULTS_XPATH + "/Payment[TransactionNumber = " + Lov_SearchResults.dataBinding + "]/EnforcementType";
	var value =	Services.getValue(xpath);
	Services.setValue(ENFORCE_TYPE_XPATH, value);
	
	xpath = SEARCH_RESULTS_XPATH + "/Payment[TransactionNumber = " + Lov_SearchResults.dataBinding + "]/EnforcementNumber";
	value =	Services.getValue(xpath);
	Services.setValue(ENFORCE_NO_XPATH, value);
	
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function setDirtyFlagFalse()
{
	var adaptor = Services.getAdaptorById("ResolveOverpayments");
	adaptor._setDirty(false);
	adaptor.update();
}

/**
 * @author tzzmr4
 * @return confirm(Messages.DETSLOST_MESSAGE) , boolean 
 */
function saveChangesPrompt()
{
	if(Services.getValue(FORM_DIRTY_XPATH) == "true") {
		return confirm(Messages.DETSLOST_MESSAGE);
	}
	return false;
}

/**
 * @author tzzmr4
 * 
 */
function savePayment()
{
	// Need to add check for invalid fields here otherwise if fails validation, there is no way to 
	// unset the PROCESSING_SAVE_XPATH flag.
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if(invalidFields.length == 0) {
		Services.setValue(PROCESSING_SAVE_XPATH, "true");
		var params = new ServiceParams();
		params.addSimpleParameter("transactionNumber", Services.getValue(TRANS_NO_XPATH));
		params.addSimpleParameter("userId", Services.getCurrentUser());
		params.addSimpleParameter("userRole", Services.getValue(CaseManFormParameters.SECURITYROLE_XPATH));
		params.addSimpleParameter("reportType", Services.getValue(REPORT_DATA_XPATH + "/ReportType"));
		Services.callService("preMaintainChecks", params, savePayment, true);
	}
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
savePayment.onSuccess = function(dom)
{
	var node = dom.selectSingleNode("/CheckResult");
	if(node != null) {
		// Type zero is an abort error, type non-zero is a warning, type < 0 is a pass.
		var checkResultType = XML.getNodeTextContent(dom.selectSingleNode("/CheckResult/Type")) * 1;
		if(checkResultType >= 0) {
			var message = XML.getNodeTextContent(dom.selectSingleNode("/CheckResult/Message"));
			if(checkResultType == 0) {
				alert(message);
				Services.setValue(PROCESSING_SAVE_XPATH, "false");
			}
			else {
				alert(message);
				commitSave();
			}
		}
		else {
			commitSave();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
savePayment.onError = function(e)
{
	alert(Messages.PRE_MAINTAIN_CHECKS_ERROR + "\n\n" + e);
	Services.setValue(PROCESSING_SAVE_XPATH, "false");
}

/**
 * @author tzzmr4
 * 
 */
function commitSave()
{
	populatePaymentDom();
	Services.dispatchEvent("ResolveOverpayments", BusinessLifeCycleEvents.EVENT_SUBMIT, null);
}

/**
 * @author tzzmr4
 * @return CaseManUtils.isBlank(Services.getValue(Payee_OverpaymentAmount.dataBinding))  
 */
function isAmountCleared()
{
	return CaseManUtils.isBlank(Services.getValue(Payee_OverpaymentAmount.dataBinding));
}

/**
 * @author tzzmr4
 * 
 */
function clearPayeeDetails()
{
	Services.startTransaction();
	Services.setValue(Payee_Name.dataBinding, "");
	Services.setValue(Payee_Address1.dataBinding, "");
	Services.setValue(Payee_Address2.dataBinding, "");
	Services.setValue(Payee_Address3.dataBinding, "");
	Services.setValue(Payee_Address4.dataBinding, "");
	Services.setValue(Payee_Address5.dataBinding, "");
	Services.setValue(Payee_PostCode.dataBinding, "");
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function setDefaultFormPersistantData()
{
	Services.startTransaction();
	Services.setValue(TRANS_NO_XPATH, Services.getValue(Header_TransactionNumber.dataBinding));
	Services.setValue(ENFORCE_NO_XPATH, Services.getValue(Header_EnforcementNumber.dataBinding));
	Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(Header_EnforcementType.dataBinding));
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function populatePaymentDom()
{
	Services.startTransaction();
	
	Services.setValue(PAYMENT_XPATH + "/OldAmount", Services.getValue(Payment_Amount.dataBinding));
	Services.setValue(PAYMENT_XPATH + "/OldRetentionType", Services.getValue(Payment_RetentionType.dataBinding));
	Services.setValue(PAYMENT_XPATH + "/OldError", Services.getValue(PAYMENT_XPATH + "/Error"));
	Services.setValue(PAYMENT_XPATH + "/ReportType", Services.getValue(REPORT_DATA_XPATH + "/ReportType"));
	Services.setValue(PAYMENT_XPATH + "/ReportNumber", Services.getValue(REPORT_DATA_XPATH + "/ReportNumber"));
	
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * @return CaseManUtils.getSystemDate(REF_XPATH + "/SystemDate")  
 */
function getSystemDate()
{
	return CaseManUtils.getSystemDate(REF_XPATH + "/SystemDate");
}

/**
 * @param reportType
 * @author tzzmr4
 * 
 */
function populateReportDataTable(reportType)
{
	Services.setValue(REPORT_DATA_XPATH + "/ReportType", reportType);
	Services.setValue(REPORT_DATA_XPATH + "/ReportDate", getSystemDate());
	Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", 0);
	Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser());
	Services.setValue(REPORT_DATA_XPATH + "/CourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
}

/**
 * @author tzzmr4
 * 
 */
function insertReportData()
{
	var dom = XML.createDOM(null, null, null);
	dom.appendChild(Services.getNode(REPORT_DATA_XPATH));
	var params = new ServiceParams();
	params.addDOMParameter("reportData", dom);
	Services.callService("insertReportData", params, insertReportData, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
insertReportData.onSuccess = function(dom)
{
	if(dom != null) {
		var results = dom.selectSingleNode("/ReportData");
		if(results == null) {
			this.onError();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
insertReportData.onError = function(e)
{
	// SCN exception will occur if row already exists => user already logged on.
	var message = e.message.slice(e.message.lastIndexOf(":") + 1);
	if(message == "Element 'ReportData' requires an SCN transaction child element in order to update") {
		alert(Messages.SCUSER_LOGGED_ON_ERROR);
	}
	else {
		alert(Messages.REPORT_DATA_CREATE_ERROR + "\n\n" + e);
	}
	executeExit();
}

/**
 * @author tzzmr4
 * @return null 
 */
function exitScreen()
{
	if(saveChangesPrompt()) {
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if(invalidFields.length != 0) {
			if(Services.getValue(APP_CLOSING_XPATH) != "true") {
				return;
			}
			else {
				alert("Error - Mandatory fields not populated.\nPayment has not been saved.");
				performScreenCleanup();
			}
		}
		else {
			Services.setValue(SCREEN_CLOSING_XPATH, "true");
			savePayment();
		}
	}
	else {
		performScreenCleanup();
	}
}

/**
 * @author tzzmr4
 * 
 */
function performScreenCleanup()
{
	if(Services.getValue(IS_NAVIGATING_XPATH) != "true") {
		var reportNumber = Services.getValue(REPORT_DATA_XPATH + "/ReportNumber");
		if(!CaseManUtils.isBlank(reportNumber) && reportNumber != "0") {
			requestReport();
		}
		else {
			deleteReportData();
		}
	}
	else {
		executeExit();
	}
}

/**
 * @author tzzmr4
 * 
 */
function executeExit()
{
	setDirtyFlagFalse();
	Services.setValue("/ds/var/app/businessProcessId", "DummyProcessId");
	if(NavigationController.callStackExists()) {
		NavigationController.nextScreen();
	}
	else {
		clearFormPersistantData();
		clearSessionPersistantData();
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**
 * @author tzzmr4
 * 
 */
function requestReport()
{
	var dom = XML.createDOM(null, null, null);
	dom.appendChild(Services.getNode(REPORT_DATA_XPATH));
	var params = new ServiceParams();
	params.addDOMParameter("reportData", dom);
	//Services.callService("produceResolveOverpaymentsReport", params, requestReport, true);
	Reports.callAsync("asyncResolveOverpaymentsReport", params, CaseMan_AsyncMonitor.srcData);
	Util.openPopup("CaseMan_AsyncMonitorPopup");		
}	
/**
 * @author tzzmr4
 * 
 */
requestReport.onSuccess = function()
{
	executeExit();
}
/**
 * @author tzzmr4
 * 
 */
requestReport.onError = function()
{
	alert("Error - REPORT did not run.\nPlease try to exit again.");
	Services.setValue(PROCESSING_SAVE_XPATH, "false");
}

/**
 * @author tzzmr4
 * 
 */
function deleteReportData()
{
	var dom = XML.createDOM(null, null, null);
	var node = Services.getNode(REPORT_DATA_XPATH);
	if(node != null) {
		dom.appendChild(node);
		var params = new ServiceParams();
		params.addDOMParameter("reportData", dom);
		Services.callService("deleteReportData", params, deleteReportData, true);
	}
	else {
		deleteReportData.onSuccess();
	}
}
/**
 * @author tzzmr4
 * 
 */
deleteReportData.onSuccess = function()
{
	executeExit();
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
deleteReportData.onError = function(e)
{
	alert(Messages.REPORT_DATA_DELETE_ERROR + "\n\n" + e);
	Services.setValue(PROCESSING_SAVE_XPATH, "false");
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function isProcessingSearch()
{
	return CaseManUtils.getValidNodeValue(Services.getValue(PROCESSING_SEARCH_XPATH)) == "true";
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function isProcessingSave()
{
	return CaseManUtils.getValidNodeValue(Services.getValue(PROCESSING_SAVE_XPATH)) == "true";
}

/**
 * @author tzzmr4
 * 
 */
function checkStartOfDay()
{
	// Stop screen calling itself on exit.
	if(NavigationController.getNextScreen() == "ResolveOverpayments") {
		NavigationController.resetCallStack();
	}
	
	// If Enforcement # is present then load the enforcement and don't perform
	// database updates.
	if(Services.getValue(IS_NAVIGATING_XPATH) == "true") {
		Services.setValue(IS_NAVIGATING_XPATH, "false");
		if(!CaseManUtils.isBlank(Services.getValue(ENFORCE_NO_XPATH))) {
			Header_SearchBtn.actionBinding();
		}
		else {
			Services.setFocus("Header_EnforcementNumber");
		}
	}
	else {
		var params = new ServiceParams();
		params.addSimpleParameter("runDate", StartOfDayUtils.SUITORS_CASH_START_OF_DAY);
		params.addSimpleParameter("systemDate", getSystemDate().replace(new RegExp(/-/g), ""));
		params.addSimpleParameter("adminCourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
		Services.callService("getRunStartOfDayStatus", params, checkStartOfDay, true);
	}
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
checkStartOfDay.onSuccess = function(dom)
{
	if(dom != null) {
		var node = dom.selectSingleNode("/ds/StartOfDay");
		if(node == null) {
			navigateToScreen(StartOfDayUtils.SUITORS_CASH_START_OF_DAY_SCREEN);
		}
		else {
			checkEndOfDay();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
checkStartOfDay.onError = function(e)
{
	alert(Messages.START_OF_DAY_CHECK_ERROR + "\n\n" + e);
	executeExit();
}

/**
 * @author tzzmr4
 * 
 */
function checkEndOfDay()
{
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.callService("getSuitorsCashEndOfDayStatus", params, checkEndOfDay, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
checkEndOfDay.onSuccess = function(dom)
{
	if(dom != null) {
		var node = dom.selectSingleNode("/ds/EndOfDay");
		if(node != null) {
			alert(Messages.END_OF_DAY_RAN_ERROR);
			executeExit();
		}
		else {
			setupScreen();
		}
	}
	else {
		this.onError();
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
checkEndOfDay.onError = function(e)
{
	alert(Messages.END_OF_DAY_CHECK_ERROR + "\n\n" + e);
	executeExit();
}

/**
 * @author tzzmr4
 * 
 */
function setupScreen()
{
	populateReportDataTable("OVP");
	insertReportData();
	
	// If trans # exists, load payment.
	if(!CaseManUtils.isBlank(Services.getValue(TRANS_NO_XPATH))) {
		Services.dispatchEvent("ResolveOverpayments", BusinessLifeCycleEvents.EVENT_MODIFY, null);
	}
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function validatePayment()
{
	// The following two situations should never happen but will cause save to fail so check anyway.
	if(Services.countNodes(ENFORCEMENT_XPATH + "/WarrantID") > 1) {
		alert("Error - There is more than one AO Warrant associated with this CO.");
		return false;
	}
	if(Services.countNodes(PAYMENT_XPATH + "/AOPassthroughTransactionNumber") > 1) {
		alert("Error - There is more than one AO passthrough associated with this payment.");
		return false;
	}
	return true;
}

/**
 * Async Stuff
 * @author tzzmr4
 * 
 */
function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};


CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";
/**
 * @author tzzmr4
 * 
 */
CaseMan_AsyncMonitor.onComplete = function()
{
	//debugger;
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	executeExit();
}

/**
 * @param exception
 * @author tzzmr4
 * 
 */
CaseMan_AsyncMonitor.onError = function(exception)
{
	//debugger;
	alert("Error - REPORT did not run.\nPlease try to exit again.");
	Services.setValue(PROCESSING_SAVE_XPATH, "false");
	alert(exception.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @author tzzmr4
 * 
 */
CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @param error
 * @author tzzmr4
 * 
 */
CaseMan_AsyncMonitor.onCancelError = function(error)
{
	//debugger;
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @param value
 * @author tzzmr4
 * @return (null != value) ? value.toUpperCase() 
 */
 
 /** Amended for trac 4624 */
 function trimTransform(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
 

/**
 * @param value
 * @author tzzmr4
 * @return (null != value) ? transformToCurrency(value.toUpperCase()) 
 */
function trimTransformCurrency(value)
{
	if(CaseManUtils.stripSpaces(value).length == 0) {
		value = null;
	}
	return (null != value) ? transformToCurrency(value.toUpperCase()) : null;
}
