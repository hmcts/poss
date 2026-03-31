/** 
 * @fileoverview MaintainPayment.js:
 * This file contains the form and field configurations for UC061 - Maintain Payments screen.
 *
 * @author Steve Blair
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 18/01/2007 - Steve Blair, UCT Defect 670.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 13/02/2007 - Steve Blair, Defect 5956.
 * 17/02/2010 - Troy Baines, Defect 2606
 * 26-05-2010 - Nilesh Mistry - TRAC 2898. Fix live defect where incorrect coded party details are being displayed
 * 06/08/2010 - Chris Vincent.  Trac 2207, change to Payment_Amount.validate in way that overpayments are recorded for
 *				AEs and Warrants.
 * 19/09/2011 - Chris Vincent, change to function determineCPAdminCourtCode to use new generic 
 *				CaseManUtils function.  Trac 4553.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Enforcement Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function for Home Warrants.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes, CONTROL warrants are replacing EXECUTION warrants so Payment_Amount.validate
 *				and Payment_ReferredToDrawer.logic are changing to identify Execution Warrants as either CONTROL or EXECUTION.
 */

//-----------------------------------------------------------------------------------------------
//                                        GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

var BASE_XPATH = "/ds/var/page";
var REF_XPATH = "/ds/var/form";
var ENFORCEMENT_XPATH = "/ds/PaymentData/Enforcement";
var PAYMENT_XPATH = "/ds/PaymentData/Payment";
var SEARCH_RESULTS_XPATH = BASE_XPATH + "/SearchResults";
var OVERPAYMENTS_XPATH = BASE_XPATH + "/Overpayments/SearchResults";
var PAYMENT_TYPES_XPATH = BASE_XPATH + "/PaymentTypes";
var RETENTION_TYPES_XPATH = BASE_XPATH + "/RetentionTypes";
var LODGMENT_PARTIES_XPATH = BASE_XPATH + "/LodgmentParties";
var COURTS_XPATH = REF_XPATH + "/Courts";
var FORM_STATE_XPATH = REF_XPATH + "/state";
var FORM_DIRTY_XPATH = REF_XPATH + "/dirty";

var CACHED_PAYMENT_TYPES_XPATH = BASE_XPATH + "/CachedPaymentTypes";
var CACHED_RETENTION_TYPES_XPATH = BASE_XPATH + "/CachedRetentionTypes";
var CACHED_AMOUNT_XPATH = BASE_XPATH + "/CachedAmount";
var CACHED_OVERPAYMENT_AMOUNT_XPATH = BASE_XPATH + "/CachedOverpaymentAmount";
var CACHED_RETENTION_TYPE_XPATH = BASE_XPATH + "/CachedRetentionType";

var FLAGS_XPATH = BASE_XPATH + "/Flags";
var BUSINESS_LIFECYCLE_COMPLETED_XPATH = FLAGS_XPATH + "/BusinessLifecycleCompeted";
var DISABLE_CODED_PARTY_CLEAR_XPATH = FLAGS_XPATH + "/DisableCodedPartyClear";
var PAYEE_DETAILS_EDITED_XPATH = FLAGS_XPATH + "/PayeeDetailsEdited";
var PROCESSING_SAVE_XPATH = FLAGS_XPATH + "/ProcessingSave";
var PROCESSING_SEARCH_XPATH = FLAGS_XPATH + "/ProcessingSearch";
var APP_CLOSING_XPATH = FLAGS_XPATH + "/AppClosing";
var SCREEN_CLOSING_XPATH = FLAGS_XPATH + "/ScreenClosing";
var INVALID_CODED_PARTY_XPATH = FLAGS_XPATH + "/InvalidCodedParty";

var IS_NAVIGATING_XPATH = "/ds/var/app/PaymentParams/IsNavigating";
var REPORT_DATA_XPATH = "/ds/var/app/PaymentParams/ReportData";
var ENFORCE_NO_XPATH = "/ds/var/app/PaymentParams/EnforcementNumber";
var ENFORCE_TYPE_XPATH = "/ds/var/app/PaymentParams/EnforcementType";
var TRANS_NO_XPATH = "/ds/var/app/PaymentParams/TransactionNumber";

//-----------------------------------------------------------------------------------------------
//                                        FUNCTION CLASSES
//-----------------------------------------------------------------------------------------------

function MaintainPayment() {};
function exitScreenHandler() {};

function Header_TransactionNumber() {};
function Header_EnforcementNumber() {};
function Header_EnforcementType() {};
function Header_CourtCode() {};
function Header_CourtName() {};
function Header_SearchBtn() {};
function Lov_SearchResults() {};

function Parties_Grid() {};

function Payment_ReferredToDrawer() {};
function Payment_ReferredToDrawerDate() {};
function Payment_Amount() {};
function Payment_AmountCurrency() {};
function Payment_Type() {};
function Payment_RetentionType() {};

function Lodgment_Name() {};
function Lodgment_LovBtn() {};
function Lov_Lodgment() {};

function Payee_PartyCode() {};
function Payee_Name() {};
function Payee_LovBtn() {};
function Payee_Address1() {};
function Payee_Address2() {};
function Payee_Address3() {};
function Payee_Address4() {};
function Payee_Address5() {};
function Payee_PostCode() {};
function Payee_DXNumber() {};
function Payee_Reference() {};

function Status_SaveBtn() {};
function Status_ClearBtn() {};
function Status_CloseBtn() {};

//-----------------------------------------------------------------------------------------------
//                                        DATA BINDINGS
//-----------------------------------------------------------------------------------------------

MaintainPayment.dataBinding = REF_XPATH;

Header_TransactionNumber.dataBinding = PAYMENT_XPATH + "/TransactionNumber";
Header_EnforcementNumber.dataBinding = PAYMENT_XPATH + "/EnforcementNumber";
Header_EnforcementType.dataBinding = PAYMENT_XPATH + "/EnforcementType";
Header_CourtCode.dataBinding = CaseManFormParameters.COURTNUMBER_XPATH;
Header_CourtName.dataBinding = COURTS_XPATH + "/Court[Code = " + Header_CourtCode.dataBinding + "]/Name";
Lov_SearchResults.dataBinding = BASE_XPATH + "/SelectedEnforcement";

Parties_Grid.dataBinding = BASE_XPATH + "/SelectedParty";

Payment_ReferredToDrawer.dataBinding = BASE_XPATH + "/ReferredToDrawer";
Payment_ReferredToDrawerDate.dataBinding = PAYMENT_XPATH + "/RDDate";
Payment_Amount.dataBinding = PAYMENT_XPATH + "/Amount";
Payment_AmountCurrency.dataBinding = PAYMENT_XPATH + "/AmountCurrency";
Payment_Type.dataBinding = PAYMENT_XPATH + "/PaymentType";
Payment_RetentionType.dataBinding = PAYMENT_XPATH + "/RetentionType";

Lodgment_Name.dataBinding = PAYMENT_XPATH + "/Lodgment/Name";
Lov_Lodgment.dataBinding = BASE_XPATH + "/SelectedLodgment";

Payee_PartyCode.dataBinding = PAYMENT_XPATH + "/Payee/Code";
Payee_Name.dataBinding = PAYMENT_XPATH + "/Payee/Name";
Payee_Address1.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[1]";
Payee_Address2.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[2]";
Payee_Address3.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[3]";
Payee_Address4.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[4]";
Payee_Address5.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[5]";
Payee_PostCode.dataBinding = PAYMENT_XPATH + "/Payee/Address/PostCode";
Payee_DXNumber.dataBinding = PAYMENT_XPATH + "/Payee/DX";
Payee_Reference.dataBinding = PAYMENT_XPATH + "/Payee/Address/Reference";

//-----------------------------------------------------------------------------------------------
//                                        MAIN FORM
//-----------------------------------------------------------------------------------------------

MaintainPayment.startupState = {mode: "blank"}

MaintainPayment.refDataServices = [
	{name: "EnforcementTypes", dataBinding: REF_XPATH, fileName: "EnforcementTypes.xml"},
	{name: "RetentionTypes", dataBinding: REF_XPATH, serviceName: "getRetentionTypes", serviceParams: []},
	{name: "PaymentTypes", dataBinding: REF_XPATH, serviceName: "getPaymentTypes", serviceParams: []},
	{name: "SystemDate", dataBinding: REF_XPATH, serviceName: "getSystemDate", serviceParams: []},
	{name: "Courts", dataBinding: REF_XPATH, serviceName:"getCourtsShort", serviceParams: []},
	{name: "SystemData", dataBinding: REF_XPATH, serviceName:"getPaymentSystemData", serviceParams: []}
];

MaintainPayment.initialise = checkStartOfDay;

MaintainPayment.modifyLifeCycle = {
	serviceName: "getPaymentWithEnforcement",
	serviceParams: [{name: "transactionNumber", value: TRANS_NO_XPATH}],
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
Payment_AmountCurrency.logic = function(event)
{
	if(event.getXPath() != FORM_STATE_XPATH) {
		return;
	}

	var lifecycle = Services.getValue(FORM_STATE_XPATH);
	if(lifecycle == "modify") {
		if(Services.exists(ENFORCEMENT_XPATH) && Services.exists(PAYMENT_XPATH)) {
			if(validatePayment()) {
				getOverpayments();
				showWarnings();
				filterLodgmentParties();
				Services.setFocus("Payment_Amount");
				Services.setValue(DISABLE_CODED_PARTY_CLEAR_XPATH, "false");
				Services.setValue(BUSINESS_LIFECYCLE_COMPLETED_XPATH, "true");
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

MaintainPayment.submitLifeCycle = {
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
									alert(Messages.ERROR_SAVING_PAYMENT + "\n\n" + e);
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
			if(Services.getValue(PAYEE_DETAILS_EDITED_XPATH) == "true") {
				alert(Messages.UPDATE_PAYEE_DETAILS_WARNING);
			}
			
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
Header_EnforcementNumber.logicOn = [FORM_STATE_XPATH];
Header_EnforcementNumber.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "blank") {
		setTimeout('Services.setFocus("Header_EnforcementNumber")', 100);
	}
}
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

Payment_AmountCurrency.enableOn = [FORM_STATE_XPATH];
Payment_AmountCurrency.isEnabled = function() {return !inQueryMode();}
Payment_AmountCurrency.transformToDisplay = convertCurrencyToSymbol;
Payment_AmountCurrency.isReadOnly = function() {return true;}
Payment_Amount.enableOn = [FORM_STATE_XPATH];
Payment_Amount.isEnabled = function() {return !inQueryMode();}
Payment_Amount.isMandatory = function() {return true;}
Payment_Amount.readOnlyOn = [PROCESSING_SAVE_XPATH, Payment_ReferredToDrawer.dataBinding];
Payment_Amount.isReadOnly = isProcessingSave;
Payment_Amount.transformToModel = trimTransformCurrency;
Payment_Amount.helpText = "Payment amount";
Payment_Amount.tabIndex = 6;
Payment_Amount.maxLength = 11;
Payment_Amount.transformToDisplay = transformToCurrency;
Payment_Amount.validateOn = [Payment_Amount.dataBinding];
Payment_Amount.validate = function()
{
	var value = CaseManUtils.getValidNodeValue(Services.getValue(this.dataBinding));

	var formatError = ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg");
	var format = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, formatError);
	if(format != null) {
		return formatError;
	}
	
	value = value * 1; // Converting to number at initialisation causes previous check to always pass.
	var rangeError = ErrorCode.getErrorCode("Caseman_paymentRangeError_Msg");
	var range = CaseManValidationHelper.validateValueInRange(value, 0.01, 99999999.99, rangeError);
	if(range != null) {
		return rangeError;
	}

	if(!Services.exists(CACHED_AMOUNT_XPATH)) {
		Services.setValue(CACHED_AMOUNT_XPATH, value);
	}
	
	var warrantType = Services.getValue(ENFORCEMENT_XPATH + "/WarrantType");
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	var isExecutionWarrant = (warrantType == "EXECUTION" || warrantType == "EXONEMP" || warrantType == "EXONPLFF" || warrantType == "CONTROL") ? true : false;
	if ( enforcementType == "CO" || enforcementType == "AE" || isExecutionWarrant ) 
	{
		Services.startTransaction();
	
		// Else clause ensures overpayment amount not recalculated when field is first populated.
		if ( !Services.exists(CACHED_OVERPAYMENT_AMOUNT_XPATH) ) 
		{
			var oldOverpaymentAmount = CaseManUtils.getValidNodeValue(Services.getValue(PAYMENT_XPATH + "/OverpaymentAmount")) * 1;
			Services.setValue(CACHED_OVERPAYMENT_AMOUNT_XPATH, oldOverpaymentAmount);
		}
		else 
		{
			// Balance includes this payment so subtract original payment amount to calculate overpayments correctly.
			var balance = Services.getValue(CACHED_AMOUNT_XPATH) * 1;
			
			if ( enforcementType == "CO" )
			{
				balance += CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance")) * 1;
				if ( value > balance ) 
				{
					var overpaymentAmount = parseFloat(value - balance).toFixed(2);
					if ( overpaymentAmount > value ) 
					{
						overpaymentAmount = parseFloat(value).toFixed(2);
					}
					
					alert("Warning - Overpaid by £" + overpaymentAmount + ".");
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", overpaymentAmount);
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", Services.getValue(Payment_AmountCurrency.dataBinding));
				}
				else 
				{
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", null);
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", null);
					if ( Services.getValue(CACHED_OVERPAYMENT_AMOUNT_XPATH) > 0 ) 
					{
						alert(Messages.OVERPAYMENT_CLEARED_WARNING);
					}
				}
				
			}
			else if ( enforcementType == "AE" || isExecutionWarrant )
			{
				/**
				 * Trac 2207 - AE and Warrant overpayments that are <= £1.00 should automatically be included in the 
				 * amount to be paid to the payee and not flagged as overpayments.
				 */
				balance += CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance")) * 1;
				if ( value > balance && parseFloat(value - balance).toFixed(2) > 1.00 )				
				{
					var overpaymentAmount = parseFloat(value - balance).toFixed(2);
					if ( overpaymentAmount > value ) 
					{
						overpaymentAmount = parseFloat(value).toFixed(2);
					}
					
					alert("Warning - Overpaid by £" + overpaymentAmount + ".");
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", overpaymentAmount);
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", Services.getValue(Payment_AmountCurrency.dataBinding));
				}
				else 
				{
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", null);
					Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", null);
					if ( Services.getValue(CACHED_OVERPAYMENT_AMOUNT_XPATH) > 0 ) 
					{
						alert(Messages.OVERPAYMENT_CLEARED_WARNING);
					}
				}
				
			}
			
			/**
			if ( isExecutionWarrant ) 
			{
				balance += CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingDebt")) * 1;
			}
			else 
			{
				balance += CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance")) * 1;
			}
			
			if ( value > balance ) 
			{
				var overpaymentAmount = parseFloat(value - balance).toFixed(2);
				if ( overpaymentAmount > value ) 
				{
					overpaymentAmount = parseFloat(value).toFixed(2);
				}
				
				alert("Warning - Overpaid by £" + overpaymentAmount + ".");
				Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", overpaymentAmount);
				Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", Services.getValue(Payment_AmountCurrency.dataBinding));
			}
			else 
			{
				Services.setValue(PAYMENT_XPATH + "/OverpaymentAmount", null);
				Services.setValue(PAYMENT_XPATH + "/OverpaymentAmountCurrency", null);
				if ( Services.getValue(CACHED_OVERPAYMENT_AMOUNT_XPATH) > 0 ) 
				{
					alert(Messages.OVERPAYMENT_CLEARED_WARNING);
				}
			}
			*/
			
			if ( Services.countNodes(OVERPAYMENTS_XPATH + "/Payment") > 1 ) 
			{
				alert(Messages.OTHER_OVERPAYMENTS_EXIST_WARNING);
			}
		}
		Services.endTransaction();
	}

	return null;
}

Payment_ReferredToDrawer.enableOn = [FORM_STATE_XPATH, Payment_RetentionType.dataBinding, Payment_Type.dataBinding];
Payment_ReferredToDrawer.isEnabled = function()
{
	if(inQueryMode() || isProcessingSave()) {
		return false;
	}
	var retentionType = Services.getValue(Payment_RetentionType.dataBinding);
	var paymentType = Services.getValue(Payment_Type.dataBinding);
	if(retentionType == "CHEQUE" || (retentionType == "AO/CAEO" && paymentType == "CHQ RT")) {
		return true;
	}
	return false;
}
Payment_ReferredToDrawer.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payment_ReferredToDrawer.isReadOnly = isProcessingSave;
Payment_ReferredToDrawer.tabIndex = 9;
Payment_ReferredToDrawer.helpText = "Payment has been referred to drawer?";
Payment_ReferredToDrawer.logicOn = [Payment_ReferredToDrawer.dataBinding];
Payment_ReferredToDrawer.logic = function()
{
	if(Services.getValue(this.dataBinding) == "true") {
		alert(Messages.NO_FURTHER_AMENDMENTS_POSSIBLE);
	}
	
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	var warrantType = Services.getValue(ENFORCEMENT_XPATH + "/WarrantType");
	var isExecutionWarrant = (warrantType == "EXECUTION" || warrantType == "EXONEMP" || warrantType == "EXONPLFF" || warrantType == "CONTROL") ? true : false;
	if(enforcementType == "CO" || enforcementType == "AE" || isExecutionWarrant) {
		if(Services.countNodes(OVERPAYMENTS_XPATH + "/Payment") > 0) {
			alert(Messages.OVERPAYMENTS_EXIST_WARNING);
		}
	}
}

Payment_ReferredToDrawerDate.enableOn = [Payment_ReferredToDrawer.dataBinding];
Payment_ReferredToDrawerDate.isEnabled = function()
{
	if(Services.getValue(Payment_ReferredToDrawer.dataBinding) != "true") {
		return false;
	}
	else {
		return true;
	}
}
Payment_ReferredToDrawerDate.isReadOnly = function() {return true;}
Payment_ReferredToDrawerDate.logicOn = [Payment_ReferredToDrawer.dataBinding];
Payment_ReferredToDrawerDate.logic = function()
{
	if(Services.getValue(Payment_ReferredToDrawer.dataBinding) != "true") {
		Services.setValue(this.dataBinding, null);
	}
	else {
		Services.setValue(this.dataBinding, getSystemDate());
	}
}
Payment_ReferredToDrawerDate.tabIndex = 10;

Lodgment_Name.enableOn = [FORM_STATE_XPATH];
Lodgment_Name.isEnabled = function() {return !inQueryMode();}
Lodgment_Name.isMandatory = function() {return true;}
Lodgment_Name.readOnlyOn = [PROCESSING_SAVE_XPATH];
Lodgment_Name.isReadOnly = isProcessingSave;
Lodgment_Name.transformToModel = trimTransform;
Lodgment_Name.helpText = "Lodgment details";
Lodgment_Name.maxLength = 70;
Lodgment_Name.tabIndex = 12;

Payee_PartyCode.enableOn = [FORM_STATE_XPATH];
Payee_PartyCode.isEnabled = payeeFieldsEnabled;
Payee_PartyCode.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_PartyCode.isReadOnly = isProcessingSave;
Payee_PartyCode.transformToModel = trimTransform;
Payee_PartyCode.tabIndex = 13;
Payee_PartyCode.helpText = "Unique four digit code for party";
Payee_PartyCode.maxLength = 4;
Payee_PartyCode.logicOn = [
	Payee_PartyCode.dataBinding,
	Payee_Name.dataBinding,
	Payee_Address1.dataBinding,
	Payee_Address2.dataBinding,
	Payee_Address3.dataBinding,
	Payee_Address4.dataBinding,
	Payee_Address5.dataBinding,
	Payee_PostCode.dataBinding,
	Payee_DXNumber.dataBinding
];
Payee_PartyCode.logic = function(event)
{
	var isPartyDetailXpath = 	event.getXPath() == Payee_Name.dataBinding ||
											event.getXPath() == Payee_Address1.dataBinding ||
											event.getXPath() == Payee_Address2.dataBinding ||
											event.getXPath() == Payee_Address3.dataBinding ||
											event.getXPath() == Payee_Address4.dataBinding ||
											event.getXPath() == Payee_Address5.dataBinding ||
											event.getXPath() == Payee_PostCode.dataBinding ||
											event.getXPath() == Payee_DXNumber.dataBinding;
	if(isPartyDetailXpath) {
		if(!Services.exists(PAYEE_DETAILS_EDITED_XPATH)) {
			Services.setValue(PAYEE_DETAILS_EDITED_XPATH, "true");
		}
		if(Services.getValue(DISABLE_CODED_PARTY_CLEAR_XPATH) != "true") {
			Services.setValue(this.dataBinding, null);
		}
		else {
			Services.setValue(DISABLE_CODED_PARTY_CLEAR_XPATH, "false");
		}
		return;
	}
	
	if(CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		return;
	}
	
	Services.setValue(INVALID_CODED_PARTY_XPATH, "false");
	if(Payee_PartyCode.validate() != null) {
		return;
	}
	var value = Services.getValue(this.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", determineCPAdminCourtCode(value));
	params.addSimpleParameter("codedPartyCode", value);
	Services.callService("getCodedParty", params, Payee_PartyCode, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
Payee_PartyCode.onSuccess = function(dom)
{
	var root = "/CodedParties/CodedParty";
	if(dom.selectSingleNode(root) != null) {
	    Services.startTransaction();
	    Services.setValue(DISABLE_CODED_PARTY_CLEAR_XPATH, "true");
		Services.setValue(Payee_Name.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")));
		var partyId = XML.getNodeTextContent(dom.selectSingleNode(root + "/PartyId"));
		Services.setValue(PAYMENT_XPATH + "/Payee/PartyID", partyId);
		Services.setValue(Payee_Address1.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[1]")));
		Services.setValue(Payee_Address2.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[2]")));
		Services.setValue(Payee_Address3.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[3]")));
		Services.setValue(Payee_Address4.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[4]")));
		Services.setValue(Payee_Address5.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[5]")));
		Services.setValue(Payee_PostCode.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/PostCode")));
		Services.setValue(Payee_DXNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/DX")));
		
		var partyXpath = ENFORCEMENT_XPATH + "/Parties/Party[PartyID = '" + partyId + "']";
		if(Services.exists(partyXpath)) {
			Services.setValue(Payee_Reference.dataBinding, Services.getValue(partyXpath + "/Address/Reference"));
		}
		else {
			Services.setValue(Payee_Reference.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Reference")));
		}
		Services.endTransaction();
	}
	else {
		Services.setValue(INVALID_CODED_PARTY_XPATH, "true");
		Services.setFocus("Payee_PartyCode");
	}
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
Payee_PartyCode.onError = function(e)
{
	alert(Messages.FAILEDPARTYDATALOAD_MESSAGE + "\n\n" + e);
}
Payee_PartyCode.validateOn = [Payee_PartyCode.dataBinding, INVALID_CODED_PARTY_XPATH];
Payee_PartyCode.validate = function()
{
	if(Services.getValue(INVALID_CODED_PARTY_XPATH) == "true") {
		return ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
	}

	var value = Services.getValue(this.dataBinding);
	if(CaseManUtils.isBlank(value)) {
		return null;
	}
	
	if(!CaseManValidationHelper.validateNumber(value)) {
		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
}

Payee_Name.enableOn = [FORM_STATE_XPATH];
Payee_Name.isEnabled = payeeFieldsEnabled;
Payee_Name.isMandatory = payeeFieldsEnabled;
Payee_Name.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Name.isReadOnly = isProcessingSave;
Payee_Name.transformToModel = trimTransform;
Payee_Name.tabIndex = 14;
Payee_Name.helpText = "Payee Name";
Payee_Name.maxLength = 70;

Payee_Address1.enableOn = [FORM_STATE_XPATH];
Payee_Address1.isEnabled = payeeFieldsEnabled;
Payee_Address1.isMandatory = payeeFieldsEnabled;
Payee_Address1.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address1.isReadOnly = isProcessingSave;
Payee_Address1.transformToModel = trimTransform;
Payee_Address1.tabIndex = 16;
Payee_Address1.helpText = "Payee Address Line 1";
Payee_Address1.maxLength = 35;

Payee_Address2.enableOn = [FORM_STATE_XPATH];
Payee_Address2.isEnabled = payeeFieldsEnabled;
Payee_Address2.isMandatory = payeeFieldsEnabled;
Payee_Address2.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address2.isReadOnly = isProcessingSave;
Payee_Address2.transformToModel = trimTransform;
Payee_Address2.tabIndex = 17;
Payee_Address2.helpText = "Payee Address Line 2";
Payee_Address2.maxLength = 35;

Payee_Address3.enableOn = [FORM_STATE_XPATH];
Payee_Address3.isEnabled = payeeFieldsEnabled;
Payee_Address3.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address3.isReadOnly = isProcessingSave;
Payee_Address3.transformToModel = trimTransform;
Payee_Address3.tabIndex = 18;
Payee_Address3.helpText = "Payee Address Line 3";
Payee_Address3.maxLength = 35;

Payee_Address4.enableOn = [FORM_STATE_XPATH];
Payee_Address4.isEnabled = payeeFieldsEnabled;
Payee_Address4.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address4.isReadOnly = isProcessingSave;
Payee_Address4.transformToModel = trimTransform;
Payee_Address4.tabIndex = 19;
Payee_Address4.helpText = "Payee Address Line 4";
Payee_Address4.maxLength = 35;

Payee_Address5.enableOn = [FORM_STATE_XPATH];
Payee_Address5.isEnabled = payeeFieldsEnabled;
Payee_Address5.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address5.isReadOnly = isProcessingSave;
Payee_Address5.transformToModel = trimTransform;
Payee_Address5.tabIndex = 20;
Payee_Address5.helpText = "Payee Address Line 5";
Payee_Address5.maxLength = 35;

Payee_PostCode.enableOn = [FORM_STATE_XPATH];
Payee_PostCode.isEnabled = payeeFieldsEnabled;
Payee_PostCode.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_PostCode.isReadOnly = isProcessingSave;
Payee_PostCode.transformToModel = trimTransform;
Payee_PostCode.tabIndex = 21;
Payee_PostCode.helpText = "Payee Postcode";
Payee_PostCode.maxLength = 8;
Payee_PostCode.validateOn = [Payee_PostCode.dataBinding];
Payee_PostCode.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	
	if(!CaseManValidationHelper.validatePostCode(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

Payee_DXNumber.enableOn = [FORM_STATE_XPATH];
Payee_DXNumber.isEnabled = payeeFieldsEnabled;
Payee_DXNumber.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_DXNumber.isReadOnly = isProcessingSave;
Payee_DXNumber.transformToModel = trimTransform;
Payee_DXNumber.tabIndex = 22;
Payee_DXNumber.helpText = "Payee Representative DX";
Payee_DXNumber.maxLength = 35;

Payee_Reference.enableOn = [FORM_STATE_XPATH];
Payee_Reference.isEnabled = payeeFieldsEnabled;
Payee_Reference.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Reference.isReadOnly = isProcessingSave;
Payee_Reference.transformToModel = trimTransform;
Payee_Reference.tabIndex = 23;
Payee_Reference.helpText = "Payee Reference";
Payee_Reference.maxLength = 24;

//-----------------------------------------------------------------------------------------------
//                                        BUTTONS
//-----------------------------------------------------------------------------------------------

Header_SearchBtn.enableOn = [
	Header_EnforcementNumber.dataBinding,
	Header_EnforcementType.dataBinding,
	Header_TransactionNumber.dataBinding,
	FORM_STATE_XPATH,
	PROCESSING_SEARCH_XPATH
];
Header_SearchBtn.isEnabled = function()
{
	if(!inQueryMode() || isProcessingSearch()) {
		return false;
	}
	var areParamsBlank =	(CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) ||
										CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding))) &&
										CaseManUtils.isBlank(Services.getValue(Header_TransactionNumber.dataBinding));
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
	/* TRAC 2606 Payment Screen Error Message When Searching By Case */
	var serviceName = "searchValidPayments";
		var enforcementType = CaseManUtils.getValidNodeValue(Services.getValue(ENFORCE_TYPE_XPATH));
		if ( enforcementType == "CASE" )
		{
			// Is a Case based payment search.  Use a different method depending upon whether transaction number supplied
			if ( CaseManUtils.isBlank( Services.getValue(TRANS_NO_XPATH) ) )
			{
				serviceName = "searchValidCasePaymentsNoTrans";
			}
			else
			{
				serviceName = "searchValidCasePaymentsTrans";
			}
		}
	Services.callService(serviceName, params, Header_SearchBtn, true);
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
				setFormPersistantData(SEARCH_RESULTS_XPATH + "/Payment");
				loadPayment();
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
Header_SearchBtn.tabIndex = 5;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F1, element: "MaintainPayment"}]
	}
}

Lodgment_LovBtn.enableOn = [FORM_STATE_XPATH, PROCESSING_SAVE_XPATH];
Lodgment_LovBtn.isEnabled = function() {return !inQueryMode() && !isProcessingSave();}
/**
 * @author tzzmr4
 * 
 */
Lodgment_LovBtn.actionBinding = function()
{
	Services.dispatchEvent("Lov_Lodgment", PopupGUIAdaptor.EVENT_RAISE);
}
Lodgment_LovBtn.tabIndex = 11;
Lodgment_LovBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F6, element: "Lodgment_Name"}]
	}
}

Payee_LovBtn.enableOn = [FORM_STATE_XPATH, PROCESSING_SAVE_XPATH];
Payee_LovBtn.isEnabled = payeeFieldsEnabled;
Payee_LovBtn.tabIndex = 15;
/**
 * @author tzzmr4
 * 
 */
Payee_LovBtn.actionBinding = function()
{
	Services.dispatchEvent("Lov_Payee", PopupGUIAdaptor.EVENT_RAISE);
}
Payee_LovBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F6, element: "Payee_PartyCode"}]
	}
}

Status_SaveBtn.enableOn = [FORM_DIRTY_XPATH, PROCESSING_SAVE_XPATH];
Status_SaveBtn.isEnabled = function()
{
	return !inQueryMode() && Services.getValue(FORM_DIRTY_XPATH) == "true" && !isProcessingSave();
}
Status_SaveBtn.actionBinding = savePayment;
Status_SaveBtn.tabIndex = 24;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F3, element: "MaintainPayment"}]
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
Status_ClearBtn.tabIndex = 25;
Status_ClearBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_ClearBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.CHAR_C, element: "MaintainPayment", alt: true}]
	}
}

Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.tabIndex = 26;
Status_CloseBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_CloseBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F4, element: "MaintainPayment"}]
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
Header_EnforcementType.helpText = "Case/Enforcement Type";
Header_EnforcementType.tabIndex = 2;
Header_EnforcementType.mandatoryOn = [Header_EnforcementNumber.dataBinding];
Header_EnforcementType.isMandatory = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding));
}

Payment_Type.srcDataOn = [PAYMENT_TYPES_XPATH];
Payment_Type.srcData = PAYMENT_TYPES_XPATH;
Payment_Type.rowXPath = "PaymentType";
Payment_Type.keyXPath = "Code";
Payment_Type.displayXPath = "Display";
Payment_Type.isMandatory = function() {return true;}
Payment_Type.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payment_Type.isReadOnly = isProcessingSave;
Payment_Type.enableOn = [FORM_STATE_XPATH];
Payment_Type.isEnabled = function() {return !inQueryMode();}
Payment_Type.helpText = "Payment type";
Payment_Type.tabIndex = 7;
Payment_Type.transformToDisplay = function(value) {return (null != value) ? value.toUpperCase() : null;}
Payment_Type.logicOn = [FORM_STATE_XPATH, Payment_Type.dataBinding];
Payment_Type.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "modify") {
		filterRetentionTypes();
	}
}

Payment_RetentionType.srcDataOn = [RETENTION_TYPES_XPATH];
Payment_RetentionType.srcData = RETENTION_TYPES_XPATH;
Payment_RetentionType.rowXPath = "RetentionType";
Payment_RetentionType.keyXPath = "Code";
Payment_RetentionType.displayXPath = "Display";
Payment_RetentionType.isMandatory = function() {return true;}
Payment_RetentionType.enableOn = [FORM_STATE_XPATH];
Payment_RetentionType.isEnabled = function() {return !inQueryMode();}
Payment_RetentionType.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payment_RetentionType.isReadOnly = function()
{
	return isProcessingSave() || Services.getValue(ENFORCE_TYPE_XPATH) == "CO";
}
Payment_RetentionType.helpText = "Retention type";
Payment_RetentionType.transformToDisplay = function(value) {return (null != value) ? value.toUpperCase() : null;}
Payment_RetentionType.logicOn = [FORM_STATE_XPATH, Payment_RetentionType.dataBinding];
Payment_RetentionType.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "modify") {
		if(!Services.exists(CACHED_RETENTION_TYPE_XPATH)) {
			Services.setValue(CACHED_RETENTION_TYPE_XPATH, Services.getValue(PAYMENT_XPATH + "/RetentionType"));
		}
		filterPaymentTypes();
	}
}
Payment_RetentionType.tabIndex = 8;

//-----------------------------------------------------------------------------------------------
//                                        LOV GRIDS
//-----------------------------------------------------------------------------------------------

Lov_SearchResults.srcData = SEARCH_RESULTS_XPATH;
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
		Services.setFocus("Payment_Amount");
		setFormPersistantData(SEARCH_RESULTS_XPATH + "/Payment[TransactionNumber = " + this.dataBinding + "]");
		loadPayment();
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

Lov_Lodgment.srcData = LODGMENT_PARTIES_XPATH;
Lov_Lodgment.rowXPath = "Party";
Lov_Lodgment.keyXPath = "PartyID";
Lov_Lodgment.columns = [
	{xpath: "Role"},
	{xpath: "Name"}
];
Lov_Lodgment.logicOn = [Lov_Lodgment.dataBinding];
Lov_Lodgment.logic = function()
{
	if(!CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		var xpath = LODGMENT_PARTIES_XPATH + "/Party[PartyID = " + this.dataBinding + "]";
		var partyRole = Services.getValue(xpath + "/Role");
		if(partyRole == "CLAIMANT" || partyRole == "SOLICITOR") {
			alert(Messages.PLAINTIFF_AS_PAYEE_WARNING);
		}
		Services.startTransaction();
		Services.setValue(Lodgment_Name.dataBinding, Services.getValue(xpath + "/Name"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/PartyRole", partyRole);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/CasePartyNumber", Services.getValue(xpath + "/Number"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[1]", Services.getValue(xpath + "/Address/Line[1]"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[2]", Services.getValue(xpath + "/Address/Line[2]"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[3]", Services.getValue(xpath + "/Address/Line[3]"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[4]", Services.getValue(xpath + "/Address/Line[4]"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[5]", Services.getValue(xpath + "/Address/Line[5]"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/PostCode", Services.getValue(xpath + "/Address/PostCode"));
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Reference", Services.getValue(xpath + "/Address/Reference"));
		// Reset so updates correctly if user selects same party in future after editing Lodgment_Name field.
		Services.setValue(this.dataBinding, null);
		Services.endTransaction();
	}
}

//-----------------------------------------------------------------------------------------------
//                                        SUB FORMS
//-----------------------------------------------------------------------------------------------

function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";
codedPartySearch_subform.raise = {
	eventBinding: {
		singleClicks: [{element: "Payee_LovBtn"}],
		keys: [{key: Key.F6, element: "Payee_PartyCode"}]
	}
};

/**
 * @author tzzmr4
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var adminCourtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, adminCourtCode);
	Services.setValue(CodedPartySearchParams.RETRIEVAL_SERVICE, CodedPartySearchParamsConstants.COURTANDNATIONAL);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{sourceNodeIndex: "0", dataBinding: "/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode"}
];

/**
 * @author tzzmr4
 * 
 */
codedPartySearch_subform.processReturnedData = function()
{
	var partyCode = Services.getValue("/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	Services.setValue(Payee_PartyCode.dataBinding, partyCode);
}

/**
 * @author tzzmr4
 * @return "Payee_PartyCode"  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function()
{
	return "Payee_PartyCode";
}

//-----------------------------------------------------------------------------------------------
//                                        HELPER FUNCTIONS
//-----------------------------------------------------------------------------------------------

/**
 * @author tzzmr4
 * 
 */
function loadPayment()
{
	Services.setValue(PROCESSING_SEARCH_XPATH, "true");
	Services.dispatchEvent("MaintainPayment", BusinessLifeCycleEvents.EVENT_MODIFY, null);
}

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
 * 
 */
function clearFormPersistantData()
{
	Services.startTransaction();
	Services.setValue(ENFORCE_NO_XPATH, null);
	Services.setValue(ENFORCE_TYPE_XPATH, null);
	Services.setValue(TRANS_NO_XPATH, null);
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
function setDefaultFormPersistantData()
{
	Services.startTransaction();
	Services.setValue(TRANS_NO_XPATH, Services.getValue(Header_TransactionNumber.dataBinding));
	Services.setValue(ENFORCE_NO_XPATH, Services.getValue(Header_EnforcementNumber.dataBinding));
	Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(Header_EnforcementType.dataBinding));
	Services.endTransaction();
}

/**
 * @param xpath
 * @author tzzmr4
 * 
 */
function setFormPersistantData(xpath)
{
	Services.startTransaction();
	Services.setValue(TRANS_NO_XPATH, Services.getValue(xpath + "/TransactionNumber"));
	Services.setValue(ENFORCE_NO_XPATH, Services.getValue(xpath + "/EnforcementNumber"));
	Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(xpath + "/EnforcementType"));
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function clearScreen()
{
	clearFormPersistantData();
	setDirtyFlagFalse();
	Services.dispatchEvent("MaintainPayment", BusinessLifeCycleEvents.EVENT_CLEAR, null);
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
 * 
 */
function filterLodgmentParties()
{
	var xpath;
	switch(Services.getValue(ENFORCE_TYPE_XPATH)) {
		case "CASE":
		case "CO":
			xpath = ENFORCEMENT_XPATH + "/Parties/Party";
			break;
		case "HOME WARRANT":
		case "FOREIGN WARRANT":
			xpath = ENFORCEMENT_XPATH + "/Parties/Party[Role != 'PARTY FOR']";
			break;
		case "AE":
			xpath = ENFORCEMENT_XPATH + "/Parties/Party[Role != 'JUDGMENT CREDITOR']";
			break;
	}
	copyNodes(xpath, LODGMENT_PARTIES_XPATH);
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function payeeFieldsEnabled()
{
	if(Services.getValue(ENFORCE_TYPE_XPATH) == "CO" || inQueryMode()) {
		return false;
	}
	return true;
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
function filterPaymentTypes()
{
	var xpath;
	switch(Services.getValue(Payment_RetentionType.dataBinding)) {
		case "CHEQUE":
			xpath = REF_XPATH + "/PaymentTypes/PaymentType[Code != 'CASH' and Code != 'CHEQUE' and Code != 'PO']";
			break;
		case "ORDINARY":
			xpath = REF_XPATH + "/PaymentTypes/PaymentType[Code != 'CHQ RT']";
			break;
		default:
			xpath = REF_XPATH + "/PaymentTypes/PaymentType";
			break;
	}
	if(xpath != Services.getValue(CACHED_PAYMENT_TYPES_XPATH)) {
		Services.setValue(CACHED_PAYMENT_TYPES_XPATH, xpath);
		copyNodes(xpath, PAYMENT_TYPES_XPATH);
	}
}

/**
 * @author tzzmr4
 * 
 */
function filterRetentionTypes()
{
	var xpath = REF_XPATH + "/RetentionTypes/RetentionType[Code != ''";
	switch(Services.getValue(Payment_Type.dataBinding)) {
		case "CASH":
		case "CHEQUE":
		case "PO":
			xpath += " and Code != 'CHEQUE'";
			break;
		case "CHQ RT":
			xpath += " and Code != 'ORDINARY'";
			break;
	}
	switch(Services.getValue(ENFORCE_TYPE_XPATH)) {
		case "CO":
			xpath += " and Code = 'AO/CAEO'";
			break;
		case "AE":
		case "CASE":
			xpath += " and Code != 'JGMT(1000+)' and Code != 'AO/CAEO'";
			break;
		case "HOME WARRANT":
		case "FOREIGN WARRANT":
			xpath += " and Code != 'AO/CAEO'";
			break;
	}
	xpath += "]";
	if(xpath != Services.getValue(CACHED_RETENTION_TYPES_XPATH)) {
		Services.setValue(CACHED_RETENTION_TYPES_XPATH, xpath);
		copyNodes(xpath, RETENTION_TYPES_XPATH);
	}
}

/**
 * @param source
 * @param destination
 * @author tzzmr4
 * 
 */
function copyNodes(source, destination)
{
	if(Services.exists(destination)) {
		Services.removeNode(destination);
	}
	var noNodes = Services.countNodes(source);
	var nodes = Services.getNodes(source);
	for(i = 0; i < noNodes; ++i) {
		Services.addNode(nodes[i], destination);
	}
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
	return CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, null, "");;
}

/**
 * @author tzzmr4
 * 
 */
function showWarnings()
{
	var enforcementNumber = Services.getValue(ENFORCE_NO_XPATH);
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
				
	var isTransferred = Services.getValue(ENFORCEMENT_XPATH + "/NumberEvents") > 0;
	var isAe = enforcementType == "AE";
	var isTransferredAe = isTransferred && isAe;
	
	var isFullyPaid = Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance") <= 0;
	if(isTransferredAe || isFullyPaid) {
		alert(Messages.PAID_OR_TRANSFERRED_WARNING);
	}
	
	// Node value is CO # for Warrant or CO Status for a CO.
	var coInfo = Services.getValue(ENFORCEMENT_XPATH + "/COInfo");
	if(!CaseManUtils.isBlank(coInfo) && coInfo != 0) {
		switch(enforcementType) {
			case "AE":
			case "FOREIGN WARRANT":
			case "CASE":
			case "HOME WARRANT":
				alert(Messages.CO_IN_FORCE_WARNING);
				break;
		}
	}
}

/**
 * @author tzzmr4
 * 
 */
function getOverpayments()
{
	var params = new ServiceParams();
	params.addSimpleParameter("transactionNumber", null);
	params.addSimpleParameter(
		"enforcementNumber",
		CaseManUtils.getValidNodeValue(Services.getValue(ENFORCE_NO_XPATH))
	);
	params.addSimpleParameter(
		"enforcementType",
		CaseManUtils.getValidNodeValue(Services.getValue(ENFORCE_TYPE_XPATH))
	);
	Services.callService("searchOverpayments", params, getOverpayments, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
getOverpayments.onSuccess = function(dom)
{
	if(dom != null) {
		var results = dom.selectSingleNode("/SearchResults");
		if(results != null) {
			Services.replaceNode(OVERPAYMENTS_XPATH, results);
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
getOverpayments.onError = function(e)
{
	alert(Messages.CANNOT_GET_OVERPAYMENTS_WARNING + "\n\n" + e);
}

/**
 * @author tzzmr4
 * 
 */
function setDirtyFlagFalse()
{
	var adaptor = Services.getAdaptorById("MaintainPayment");
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
	Services.dispatchEvent("MaintainPayment", BusinessLifeCycleEvents.EVENT_SUBMIT, null);
}

/**
 * @author tzzmr4
 * 
 */
function populatePaymentDom()
{
	Services.startTransaction();
	
	populateReleaseDate();
	payeeNotDefaultActions();
	checkLodgmentDetails();
	
	Services.setValue(PAYMENT_XPATH + "/OldAmount", Services.getValue(CACHED_AMOUNT_XPATH));
	Services.setValue(PAYMENT_XPATH + "/OldRetentionType", Services.getValue(CACHED_RETENTION_TYPE_XPATH));
	Services.setValue(PAYMENT_XPATH + "/OldError", Services.getValue(PAYMENT_XPATH + "/Error"));
	Services.setValue(PAYMENT_XPATH + "/ReportType", Services.getValue(REPORT_DATA_XPATH + "/ReportType"));
	Services.setValue(PAYMENT_XPATH + "/ReportNumber", Services.getValue(REPORT_DATA_XPATH + "/ReportNumber"));
	
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * @return null 
 */
function populateReleaseDate()
{
	if(!CaseManUtils.isBlank(Services.getValue(PAYMENT_XPATH + "/RDDate"))) {
		Services.setValue(PAYMENT_XPATH + "/ReleaseDate", null);
		return;
	}
	
	var paymentDate = CaseManUtils.createDate(Services.getValue(PAYMENT_XPATH + "/PaymentDate"));
	switch(Services.getValue(Payment_RetentionType.dataBinding)) {
		case "AO/CAEO":
			var retentionDays = 0 * 1;
			if(Services.getValue(Payment_Type.dataBinding) == "CHQ RT") {
				retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'CHQ RETENTION']/Value") * 1;
			}
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(paymentDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "CHEQUE":
			var retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'CHQ RETENTION']/Value") * 1;
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(paymentDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "JGMT(1000+)":
			var retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'JGMT1000+']/Value") * 1;
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(paymentDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "ORDINARY":
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", Services.getValue(PAYMENT_XPATH + "/PaymentDate"));
			break;
		case "MISCELLANEOUS":
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", "2999-12-31");
			break;
	}
}

/**
 * @author tzzmr4
 * 
 */
function payeeNotDefaultActions()
{
	var xpath = getDefaultPayeeXpath();
	var isDefaultPayee =	Services.getValue(Payee_Name.dataBinding) == Services.getValue(xpath + "/Name") &&
									Services.getValue(Payee_Address1.dataBinding) == Services.getValue(xpath + "/Address/Line[1]") &&
									Services.getValue(Payee_Address2.dataBinding) == Services.getValue(xpath + "/Address/Line[2]") &&
									Services.getValue(Payee_Address3.dataBinding) == Services.getValue(xpath + "/Address/Line[3]") &&
									Services.getValue(Payee_Address4.dataBinding) == Services.getValue(xpath + "/Address/Line[4]") &&
									Services.getValue(Payee_Address5.dataBinding) == Services.getValue(xpath + "/Address/Line[5]") &&
									Services.getValue(Payee_PostCode.dataBinding) == Services.getValue(xpath + "/Address/PostCode") &&
									Services.getValue(Payee_Reference.dataBinding) == Services.getValue(xpath + "/Address/Reference") &&
									Services.getValue(Payee_DXNumber.dataBinding) == Services.getValue(xpath + "/DX");
	if(!isDefaultPayee) {
		if(CaseManUtils.isBlank(Services.getValue(Payee_PartyCode.dataBinding))) {
			Services.setValue(PAYMENT_XPATH + "/Payee/PartyID", null);
		}
	}
}

/**
 * @author tzzmr4
 * 
 */
function checkLodgmentDetails()
{
	if(!Services.exists(LODGMENT_PARTIES_XPATH + "/Party[Name = " + Lodgment_Name.dataBinding + "]")) {
		//Services.setValue(PAYMENT_XPATH + "/Lodgment/PartyRole", null);
		//Services.setValue(PAYMENT_XPATH + "/Lodgment/CasePartyNumber", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[1]", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[2]", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[3]", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[4]", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Line[5]", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/PostCode", null);
		Services.setValue(PAYMENT_XPATH + "/Lodgment/Address/Reference", null);
	}
}

/**
 * @author tzzmr4
 * @return ENFORCEMENT_XPATH + "/Parties/Party[Role = 'JUDGMENT CREDITOR']" , ENFORCEMENT_XPATH + "/Parties/Party[Role = 'PARTY FOR']" , ENFORCEMENT_XPATH + "/Parties/Party[Role = 'SOLICITOR'][1]" , ENFORCEMENT_XPATH + "/Parties/Party[Role = 'CLAIMANT'][1]"  
 */
function getDefaultPayeeXpath()
{
	switch(Services.getValue(ENFORCE_TYPE_XPATH)) {
		case "AE":
			return ENFORCEMENT_XPATH + "/Parties/Party[Role = 'JUDGMENT CREDITOR']";
		case "HOME WARRANT":
		case "FOREIGN WARRANT":
			return ENFORCEMENT_XPATH + "/Parties/Party[Role = 'PARTY FOR']";
		case "CASE":
			if(Services.getValue(ENFORCEMENT_XPATH + "/Parties/Party[Role = 'CLAIMANT'][1]/PayeeFlag") == "Y") {
				return ENFORCEMENT_XPATH + "/Parties/Party[Role = 'SOLICITOR'][1]";
			}
			else {
				return ENFORCEMENT_XPATH + "/Parties/Party[Role = 'CLAIMANT'][1]";
			}
	}
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
function requestReport()
{
	var dom = XML.createDOM(null, null, null);
	dom.appendChild(Services.getNode(REPORT_DATA_XPATH));
	var params = new ServiceParams();
	params.addDOMParameter("reportData", dom);
	//Services.callService("produceAmendmentVerificationReport", params, requestReport, true);
	Reports.callAsync("asyncAmendmentVerificationReport", params, CaseMan_AsyncMonitor.srcData);
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
	if(NavigationController.getNextScreen() == "MaintainPayment") {
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
	populateReportDataTable("AMR");
	insertReportData();
	
	Services.setFocus("Header_EnforcementNumber");
	
	// If Enforcement # present then load the enforcement.
	if(!CaseManUtils.isBlank(Services.getValue(ENFORCE_NO_XPATH))) {
		Services.setValue(Header_TransactionNumber.dataBinding, Services.getValue(TRANS_NO_XPATH));
		Services.setValue(Header_EnforcementNumber.dataBinding, Services.getValue(ENFORCE_NO_XPATH));
		Services.setValue(Header_EnforcementType.dataBinding, Services.getValue(ENFORCE_TYPE_XPATH));
		Header_SearchBtn.actionBinding();
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

/**
 * @param codedPartyCode
 * @author tzzmr4
 * @return adminCourtCode
 *
 * Change History:
 * 26/05/2010 - N. Mistry, Fixed Trac 2898.  Local Coded Parties loaded are linked to 
 * 		Enforcement Owning Court.
	 */
function determineCPAdminCourtCode(codedPartyCode)
{
	var adminCourtCode = null;
	if ( CaseManUtils.isCCBCNationalCodedParty(codedPartyCode) ) 
	{
	    // Party is a national coded party
		adminCourtCode = CaseManUtils.CCBC_COURT_CODE;
	}
	else if(codedPartyCode >= 7000) {
	    // Party is a non CPC national coded party
		adminCourtCode = CaseManUtils.GLOBAL_COURT_CODE;
	}
	else {
	    // Party is a local coded party, use the Enforcement Owning Court
		adminCourtCode = Services.getValue(ENFORCEMENT_XPATH + "/CourtCode");
	}
	return adminCourtCode;
}
