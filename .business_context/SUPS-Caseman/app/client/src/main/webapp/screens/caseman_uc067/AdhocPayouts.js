/** 
 * @fileoverview AdhocPayouts.js:
 * This file contains the form and field configurations for UC067 - Record Adhoc Payouts screen.
 *
 * @author Steve Blair
 * 
 * Change History:
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 13/02/2007 - Steve Blair, Defect 5956.
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

var REPORT_DATA_XPATH = REF_XPATH + "/ReportData";

var FLAGS_XPATH = BASE_XPATH + "/Flags";
var PROCESSING_SAVE_XPATH = FLAGS_XPATH + "/ProcessingSave";
var PROCESSING_SEARCH_XPATH = FLAGS_XPATH + "/ProcessingSearch";
var APP_CLOSING_XPATH = FLAGS_XPATH + "/AppClosing";
var SCREEN_CLOSING_XPATH = FLAGS_XPATH + "/ScreenClosing";

var TRANS_NO_XPATH = "/ds/var/app/PaymentParams/TransactionNumber";
var ENFORCE_NO_XPATH = "/ds/var/app/PaymentParams/EnforcementNumber";
var ENFORCE_TYPE_XPATH = "/ds/var/app/PaymentParams/EnforcementType";

//-----------------------------------------------------------------------------------------------
//                                        FUNCTION CLASSES
//-----------------------------------------------------------------------------------------------

function AdhocPayouts() {};
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
function Payment_OverpaymentAmount() {};
function Payment_OverpaymentAmountCurrency() {};
function Payment_Date() {};
function Payment_ReleaseDate() {};

function Payout_Reason() {};
function Payout_Date() {};
function Payout_Notes() {};

function Status_SaveBtn() {};
function Status_ClearBtn() {};
function Status_CloseBtn() {};

//-----------------------------------------------------------------------------------------------
//                                        DATA BINDINGS
//-----------------------------------------------------------------------------------------------

AdhocPayouts.dataBinding = REF_XPATH;

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
Payment_OverpaymentAmount.dataBinding = PAYMENT_XPATH + "/OverpaymentAmount";
Payment_OverpaymentAmountCurrency.dataBinding = PAYMENT_XPATH + "/OverpaymentAmountCurrency";
Payment_Date.dataBinding = PAYMENT_XPATH + "/PaymentDate";
Payment_ReleaseDate.dataBinding = PAYMENT_XPATH + "/ReleaseDate";

Payout_Reason.dataBinding = PAYMENT_XPATH + "/PayoutReason";
Payout_Date.dataBinding = PAYMENT_XPATH + "/PayoutDate";
Payout_Notes.dataBinding = PAYMENT_XPATH + "/PayoutNotes";

//-----------------------------------------------------------------------------------------------
//                                        MAIN FORM
//-----------------------------------------------------------------------------------------------

AdhocPayouts.startupState = {
/**
 * @author tzzmr4
 * @return "modify" , "blank"  
 */
	mode: function()
	{
		if(!inQueryMode()) {
			return "modify";
		}
		return "blank";
	}
}

AdhocPayouts.initialise = checkStartOfDay;

AdhocPayouts.refDataServices = [
	{name: "EnforcementTypes", dataBinding: REF_XPATH, fileName: "EnforcementTypes.xml"},
	{name: "PayoutReasons", dataBinding: REF_XPATH, fileName: "PayoutReasons.xml"},
	{name: "RetentionTypes", dataBinding: REF_XPATH, serviceName: "getRetentionTypes", serviceParams: []},
	{name: "PaymentTypes", dataBinding: REF_XPATH, serviceName: "getPaymentTypes", serviceParams: []},
	{name: "SystemDate", dataBinding: REF_XPATH, serviceName: "getSystemDate", serviceParams: []},
	{name: "Courts", dataBinding: REF_XPATH, serviceName:"getCourtsShort", serviceParams: []}
];

AdhocPayouts.modifyLifeCycle = {
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
	if(Services.getValue(FORM_STATE_XPATH) == "modify") {
		if(Services.exists(PAYMENT_XPATH) && Services.exists(ENFORCEMENT_XPATH)) {
			if(validatePayment()) {
				showWarnings();
				Services.setFocus("Payout_Reason");
			}
			else {
				clearScreen();
			}
		}
		else {
			alert(Messages.CANNOT_LOAD_PAYMENT_ERROR);
		}
		Services.setValue(PROCESSING_SEARCH_XPATH, "false");
	}
}

AdhocPayouts.submitLifeCycle = {
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
									alert(Messages.CANNOT_SAVE_PAYOUT_ERROR + "\n\n" + e);
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
//                                        MENU BAR
//-----------------------------------------------------------------------------------------------



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
Payment_Amount.enableOn = [FORM_STATE_XPATH];
Payment_Amount.isEnabled = function() {return !inQueryMode();}
Payment_Amount.helpText = "The original Payment amount";
Payment_Amount.transformToDisplay = transformToCurrency;
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

Payment_OverpaymentAmount.isReadOnly = function() {return true;}
Payment_OverpaymentAmount.enableOn = [FORM_STATE_XPATH];
Payment_OverpaymentAmount.isEnabled = function() {return !inQueryMode();}
Payment_OverpaymentAmount.helpText = "Overpaid amount";
Payment_OverpaymentAmount.transformToDisplay = transformToCurrency;
Payment_OverpaymentAmountCurrency.isReadOnly = function() {return true;}
Payment_OverpaymentAmountCurrency.enableOn = [FORM_STATE_XPATH];
Payment_OverpaymentAmountCurrency.isEnabled = function() {return !inQueryMode();}
Payment_OverpaymentAmountCurrency.transformToDisplay = convertCurrencyToSymbol;
Payment_OverpaymentAmountCurrency.logicOn = [Payment_OverpaymentAmount.dataBinding];
Payment_OverpaymentAmountCurrency.logic = function()
{
	var ovpAmount = Services.getValue(PAYMENT_XPATH + "OverpaymentAmount") * 1;
	var ovpAmountCrncyXpath = PAYMENT_XPATH + "/OverpaymentAmountCurrency";
	if(ovpAmount == 0 && Services.getValue(ovpAmountCrncyXpath) == null) {
		Services.setValue(ovpAmountCrncyXpath, Services.getValue(PAYMENT_XPATH + "/AmountCurrency"));
	}
}

Payment_Date.isReadOnly = function() {return true;}
Payment_Date.enableOn = [FORM_STATE_XPATH];
Payment_Date.isEnabled = function() {return !inQueryMode();}
Payment_Date.helpText = "Date the payment in was made";

Payment_ReleaseDate.isReadOnly = function() {return true;}
Payment_ReleaseDate.enableOn = [FORM_STATE_XPATH];
Payment_ReleaseDate.isEnabled = function() {return !inQueryMode();}
Payment_ReleaseDate.helpText = "The date the payment can be released";

Payout_Date.isReadOnly = function() {return true;}
Payout_Date.enableOn = [FORM_STATE_XPATH];
Payout_Date.isEnabled = function() {return !inQueryMode();}
Payout_Date.setDefaultOn = [Payout_Reason.dataBinding];
/**
 * @author tzzmr4
 * 
 */
Payout_Date.setDefault = function()
{
	Services.setValue(this.dataBinding, getSystemDate());
}
Payout_Date.helpText = "Date adhoc payout was made";
Payout_Date.tabIndex = 6;

Payout_Notes.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payout_Notes.isReadOnly = isProcessingSave;
Payout_Notes.enableOn = [FORM_STATE_XPATH, Payout_Reason.dataBinding];
Payout_Notes.isEnabled = function()
{
	return !inQueryMode() && !CaseManUtils.isBlank(Services.getValue(Payout_Reason.dataBinding));
}
Payout_Notes.helpText = "Notes/Reason for adhoc payout";
Payout_Notes.maxLength = 210;
Payout_Notes.transformToModel = trimTransform;
Payout_Notes.tabIndex = 7;

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
	var params = new ServiceParams();
	params.addSimpleParameter(
		"transactionNumber",
		CaseManUtils.getValidNodeValue(Services.getValue(Header_TransactionNumber.dataBinding))
	);
	params.addSimpleParameter(
		"enforcementNumber",
		CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementNumber.dataBinding))
	);
	params.addSimpleParameter(
		"enforcementType",
		CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementType.dataBinding))
	);
	Services.callService("searchValidAdhocPayoutPayments", params, Header_SearchBtn, true);
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
				alert(Messages.NO_PAYMENTS_FOUND);
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
		keys: [{key: Key.F1, element: "AdhocPayouts"}]
	}
}

Status_SaveBtn.enableOn = [PROCESSING_SAVE_XPATH, Payout_Reason.dataBinding];
Status_SaveBtn.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Payout_Reason.dataBinding)) && !isProcessingSave();
}
Status_SaveBtn.actionBinding = savePayout;
Status_SaveBtn.tabIndex = 8;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F3, element: "AdhocPayouts"}]
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
		savePayout();
	}
	else {
		clearScreen();
	}
}
Status_ClearBtn.tabIndex = 9;
Status_ClearBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_ClearBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.CHAR_C, element: "AdhocPayouts", alt: true}]
	}
}

Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.tabIndex = 10;
Status_CloseBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_CloseBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F4, element: "AdhocPayouts"}]
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

Payout_Reason.srcData = REF_XPATH + "/PayoutReasons";
Payout_Reason.rowXPath = "Reason";
Payout_Reason.keyXPath = "Description";
Payout_Reason.displayXPath = "Description";
Payout_Reason.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SAVE_XPATH];
Payout_Reason.isReadOnly = function() {return isCOPayment() || isProcessingSave();}
Payout_Reason.enableOn = [FORM_STATE_XPATH];
Payout_Reason.isEnabled = function() {return !inQueryMode();}
Payout_Reason.logicOn = [FORM_STATE_XPATH];
Payout_Reason.logic = function()
{
	if(isCOPayment()) {
		Services.setValue(this.dataBinding, "PAID IN ERROR");
	}
}
Payout_Reason.helpText = "Reason for adhoc payout";
Payout_Reason.isMandatory = function() {return true;}
Payout_Reason.tabIndex = 5;

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
		Services.dispatchEvent("AdhocPayouts", BusinessLifeCycleEvents.EVENT_MODIFY, null);
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
	Services.dispatchEvent("AdhocPayouts", BusinessLifeCycleEvents.EVENT_CLEAR, null);
	Services.setFocus("Header_EnforcementNumber");
}

/**
 * @param value
 * @author tzzmr4
 * @return null , value , amount  
 */
function transformToCurrency(value)
{
	if(inQueryMode()) {
		return null;
	}
	else {
		var amount = (CaseManUtils.isBlank(value)) ? "0.00" : parseFloat(value).toFixed(2);
		if(isNaN(amount)) {
			return value;
		}
		else {
			return amount;
		}
	}
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
 * @return Services.getValue(Header_EnforcementType.dataBinding) == "CO"  
 */
function isCOPayment()
{
	return Services.getValue(Header_EnforcementType.dataBinding) == "CO";
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
 * @author tzzmr4
 * 
 */
function setDirtyFlagFalse()
{
	var adaptor = Services.getAdaptorById("AdhocPayouts");
	adaptor._setDirty(false);
	adaptor.update();
}

/**
 * @author tzzmr4
 * @return confirm(Messages.DETSLOST_MESSAGE) , boolean 
 */
function saveChangesPrompt()
{
	if(isFormDirty()) {
		return confirm(Messages.DETSLOST_MESSAGE);
	}
	return false;
}

/**
 * @author tzzmr4
 * 
 */
function savePayout()
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
		Services.callService("preMaintainChecks", params, savePayout, true);
	}
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
savePayout.onSuccess = function(dom)
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
savePayout.onError = function(e)
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
	Services.dispatchEvent("AdhocPayouts", BusinessLifeCycleEvents.EVENT_SUBMIT, null);
}

/**
 * @author tzzmr4
 * 
 */
function populatePaymentDom()
{
	Services.startTransaction();
	
	var notes = Services.getValue(PAYMENT_XPATH + "/Notes");
	if(!CaseManUtils.isBlank(notes)) {
		notes = notes + ". ";
	}
	else {
		notes = "";
	}
	notes = notes + Services.getValue(Payout_Reason.dataBinding);
	
	var payoutNotes = Services.getValue(Payout_Notes.dataBinding);
	// Check reason is not null or else JScript converts to string "null", see
	// UCT defect 824.
	if(!CaseManUtils.isBlank(payoutNotes)) {
		notes = notes + ". " + Services.getValue(Payout_Notes.dataBinding);
	}
	
	Services.setValue(PAYMENT_XPATH + "/Notes", notes);
	
	if(Services.getValue(Payout_Reason.dataBinding) == "PAID IN ERROR") {
		Services.setValue(PAYMENT_XPATH + "/Error", "Y");
	}
	
	Services.setValue(PAYMENT_XPATH + "/OldAmount", Services.getValue(Payment_Amount.dataBinding));
	Services.setValue(PAYMENT_XPATH + "/OldRetentionType", Services.getValue(Payment_RetentionType.dataBinding));
	Services.setValue(PAYMENT_XPATH + "/OldError", "N");
	Services.setValue(PAYMENT_XPATH + "/ReportType", Services.getValue(REPORT_DATA_XPATH + "/ReportType"));
	Services.setValue(PAYMENT_XPATH + "/ReportNumber", Services.getValue(REPORT_DATA_XPATH + "/ReportNumber"));
	
	Services.endTransaction();
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
	Services.callService("insertReportData", params, populateReportDataTable, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
populateReportDataTable.onSuccess = function(dom)
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
populateReportDataTable.onError = function(e)
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
				performScreenCleanup()
			}
		}
		else {
			Services.setValue(SCREEN_CLOSING_XPATH, "true");
			savePayout();
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
	var reportNumber = Services.getValue(REPORT_DATA_XPATH + "/ReportNumber");
	if(!CaseManUtils.isBlank(reportNumber) && reportNumber != "0") {
		requestReport();
	}
	else {
		deleteReportData();
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
	//Services.callService("produceAdhocPayoutReport", params, requestReport, true);
	Reports.callAsync("asyncAdhocPayoutReport", params, CaseMan_AsyncMonitor.srcData);
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
function executeExit()
{
	setDirtyFlagFalse();
	Services.setValue("/ds/var/app/businessProcessId", "DummyProcessId");
	if(NavigationController.callStackExists()) {
		NavigationController.nextScreen();
	}
	else {
		clearFormPersistantData();
		Services.navigate(NavigationController.MAIN_MENU);
	}
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
 * @param screen
 * @author tzzmr4
 * 
 */
function navigateToScreen(screen)
{
	if(NavigationController.callStackExists()) {
		NavigationController.resetCallStack();
	}
	var navArray = new Array(screen, NavigationController.RECORD_ADHOC_PAYOUT_FORM);
	NavigationController.createCallStack(navArray);
	exitScreen();
}

/**
 * @author tzzmr4
 * 
 */
function checkStartOfDay()
{
	// Stop screen calling itself on exit.
	if(NavigationController.getNextScreen() == "AdhocPayouts") {
		NavigationController.resetCallStack();
	}

	var params = new ServiceParams();
	params.addSimpleParameter("runDate", StartOfDayUtils.SUITORS_CASH_START_OF_DAY);
	params.addSimpleParameter("systemDate", getSystemDate().replace(new RegExp(/-/g), ""));
	params.addSimpleParameter("adminCourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.callService("getRunStartOfDayStatus", params, checkStartOfDay, true);
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
	populateReportDataTable("ADH");
	insertReportData();
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
 * @author tzzmr4
 * 
 */
function showWarnings()
{
	var enforcementType = Services.getValue(PAYMENT_XPATH + "/EnforcementType");
	var releaseDate = CaseManUtils.createDate(Services.getValue(PAYMENT_XPATH + "/ReleaseDate"));
	var systemDate = CaseManUtils.createDate(getSystemDate());
	
	if(!CaseManUtils.isBlank(Services.getValue(Payment_OverpaymentAmount.dataBinding))) {
		alert(Messages.OVERPAYMENT_EXISTS);
	}
	if(enforcementType == "CO") {
		alert(Messages.MUST_BE_PAID_IN_ERROR);
	}
	else if(CaseManUtils.compareDates(releaseDate, systemDate) == -1) {
		alert(Messages.PAYOUT_BEFORE_RELEASE_DATE_WARNING);
	}
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
function trimTransform(value)
{
	if(CaseManUtils.stripSpaces(value).length == 0) {
		value = null;
	}
	return (null != value) ? value.toUpperCase() : null;
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
