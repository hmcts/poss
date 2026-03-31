/** 
 * @fileoverview CreatePayment.js:
 * This file contains the form and field configurations for UC059 - Create Payments screen.
 *
 * @author Steve Blair
 *
 * Change History
 * 20-June-2006 Kevin Gichohi (EDS): Separated the saving of the payment and calling of the receipt to two different transactions
 * 23-June-2006 Kevin Gichohi (EDS): Only Run Counter Receipts on saving the payment if the report type is 'CVER'
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 27/11/2006 - Chris Vincent, configured Court_LovBtn.additionalBindings so the executing courts triggered the
 * 				LOV button with the F6 keybinding.  Also updated the codedPartySearch_subform.raise to include 
 * 				the Payee Name (F6).  Finally, updated the tab order of the Paid In By and Payee fields so goes
 * 				Code, Text, LOV Button.  UCT Defect 739.
 * 18/01/2007 - Steve Blair, UCT Defect 670.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 13/02/2007 - Steve Blair, Defect 5956.
 *
 * 17-06-2009 - Mark Groen - TRAC 707. - Incorporate changes defined by Chris Vincent re scalabilty 
 *                              for Navigate to Transfer Case and View Payments
 * 26-05-2010 - Nilesh Mistry - TRAC 2898. Fix live defect where incorrect coded party details are being displayed
 * 06/08/2010 - Chris Vincent.  Trac 2207, change to Payment_Amount.validate in way that overpayments are recorded for
 *				AEs and Warrants.
 * 19/09/2011 - Chris Vincent, change to function determineCPAdminCourtCode to use new generic 
 *				CaseManUtils function.  Trac 4553.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Enforcement Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function for Home Warrants.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes, CONTROL warrants are replacing EXECUTION warrants so Payment_Amount.validate
 *				is changing to identify Execution Warrants as either CONTROL or EXECUTION.
 */

//-----------------------------------------------------------------------------------------------
//                                        GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

var BASE_XPATH = "/ds/var/page";
var REF_XPATH = "/ds/var/form";
var ENFORCEMENT_XPATH = "/ds/Enforcement";
var PAYMENT_XPATH = "/ds/Payment";
var SEARCH_RESULTS_XPATH = BASE_XPATH + "/SearchResults";
var PAYMENT_TYPES_XPATH = BASE_XPATH + "/PaymentTypes";
var RETENTION_TYPES_XPATH = BASE_XPATH + "/RetentionTypes";
var LODGMENT_PARTIES_XPATH = BASE_XPATH + "/LodgmentParties";
var COURTS_XPATH = REF_XPATH + "/Courts";
var FORM_STATE_XPATH = REF_XPATH + "/state";
var FORM_DIRTY_XPATH = REF_XPATH + "/dirty";
var DEFAULT_PAYEE_XPATH = BASE_XPATH + "/DefaultPayee";

var CACHED_PAYMENT_TYPES_XPATH = BASE_XPATH + "/CachedPaymentTypes";
var CACHED_RETENTION_TYPES_XPATH = BASE_XPATH + "/CachedRetentionTypes";

var FLAGS_XPATH = BASE_XPATH + "/Flags";
var BUSINESS_LIFECYCLE_COMPLETED_XPATH = FLAGS_XPATH + "/BusinessLifecycleCompeted";
var DISABLE_CODED_PARTY_CLEAR_XPATH = FLAGS_XPATH + "/DisableCodedPartyClear";
var ABORT_LOAD_XPATH = FLAGS_XPATH + "/AbortLoadEnforcement";
var RELOAD_XPATH = REF_XPATH + "/ReloadEnforcement";
var PROCESSING_SAVE_XPATH = FLAGS_XPATH + "/ProcessingSave";
var PROCESSING_SEARCH_XPATH = FLAGS_XPATH + "/ProcessingSearch";
var APP_CLOSING_XPATH = FLAGS_XPATH + "/AppClosing";
var SCREEN_CLOSING_XPATH = FLAGS_XPATH + "/ScreenClosing";
var INVALID_CODED_PARTY_XPATH = FLAGS_XPATH + "/InvalidCodedParty";

var IS_NAVIGATING_XPATH = "/ds/var/app/PaymentParams/IsNavigating";
var REPORT_DATA_XPATH = "/ds/var/app/PaymentParams/ReportData";
var PAYMENT_METHOD_XPATH = "/ds/var/app/PaymentParams/PaymentMethod";
var ENFORCE_NO_XPATH = "/ds/var/app/PaymentParams/EnforcementNumber";
var ENFORCE_TYPE_XPATH = "/ds/var/app/PaymentParams/EnforcementType";
var ISSUING_COURT_XPATH = "/ds/var/app/PaymentParams/IssuingCourtCode";
var OWNING_COURT_XPATH = "/ds/var/app/PaymentParams/OwningCourtCode";
var EXECUTING_COURT_XPATH = "/ds/var/app/PaymentParams/ExecutingCourtCode";

//-----------------------------------------------------------------------------------------------
//                                        FUNCTION CLASSES
//-----------------------------------------------------------------------------------------------

function CreatePayment() {};
function exitScreenHandler() {};

function Header_EnforcementNumber() {};
function Header_EnforcementType() {};
function Header_ExecutingCourtCode() {};
function Header_ExecutingCourtName() {};
function Court_LovBtn() {};
function Lov_Court() {};
function Header_UserCourtCode() {};
function Header_UserCourtName() {};
function Header_SearchBtn() {};
function Lov_SearchResults() {};

function Parties_Grid() {};

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

CreatePayment.dataBinding = REF_XPATH;

Header_EnforcementNumber.dataBinding = PAYMENT_XPATH + "/EnforcementNumber";
Header_EnforcementType.dataBinding = PAYMENT_XPATH + "/EnforcementType";
Header_ExecutingCourtCode.dataBinding = BASE_XPATH + "/CourtCode";
Header_ExecutingCourtName.dataBinding = BASE_XPATH + "/CourtName";
Lov_Court.dataBinding = Header_ExecutingCourtCode.dataBinding;
Header_UserCourtCode.dataBinding = CaseManFormParameters.COURTNUMBER_XPATH;
Header_UserCourtName.dataBinding = COURTS_XPATH + "/Court[Code = " + Header_UserCourtCode.dataBinding + "]/Name";
Lov_SearchResults.dataBinding = BASE_XPATH + "/SelectedEnforcement";

Parties_Grid.dataBinding = BASE_XPATH + "/SelectedParty";

Payment_Amount.dataBinding = PAYMENT_XPATH + "/Amount";
Payment_AmountCurrency.dataBinding = PAYMENT_XPATH + "/AmountCurrency";
Payment_Type.dataBinding = PAYMENT_XPATH + "/PaymentType";
Payment_RetentionType.dataBinding = PAYMENT_XPATH + "/RetentionType";

Lodgment_Name.dataBinding = PAYMENT_XPATH + "/Lodgment/Name";
Lov_Lodgment.dataBinding = BASE_XPATH + "/SelectedLodgment";

Payee_PartyCode.dataBinding = BASE_XPATH + "/PartyCode";
Payee_Name.dataBinding = PAYMENT_XPATH + "/Payee/Name";
Payee_Address1.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[1]";
Payee_Address2.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[2]";
Payee_Address3.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[3]";
Payee_Address4.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[4]";
Payee_Address5.dataBinding = PAYMENT_XPATH + "/Payee/Address/Line[5]";
Payee_PostCode.dataBinding = PAYMENT_XPATH + "/Payee/Address/PostCode";
Payee_Reference.dataBinding = PAYMENT_XPATH + "/Payee/Address/Reference";
Payee_DXNumber.dataBinding = PAYMENT_XPATH + "/Payee/DX";

//-----------------------------------------------------------------------------------------------
//                                        MAIN FORM
//-----------------------------------------------------------------------------------------------

CreatePayment.startupState = {mode: "blank"}

CreatePayment.refDataServices = [
	{name: "EnforcementTypes", dataBinding: REF_XPATH, fileName: "EnforcementTypes.xml"},
	{name: "RetentionTypes", dataBinding: REF_XPATH, serviceName: "getRetentionTypes", serviceParams: []},
	{name: "PaymentTypes", dataBinding: REF_XPATH, serviceName: "getPaymentTypes", serviceParams: []},
	{name: "SystemDate", dataBinding: REF_XPATH, serviceName: "getSystemDate", serviceParams: []},
	{name: "Courts", dataBinding: REF_XPATH, serviceName:"getCourtsShort", serviceParams: []},
	{name: "CurrentCurrency", dataBinding: REF_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{name: "SystemData", dataBinding: REF_XPATH, serviceName:"getPaymentSystemData", serviceParams: []}
];

CreatePayment.initialise = checkStartOfDay;

CreatePayment.createLifeCycle = {
	serviceName: "getEnforcement",
	serviceParams: [
		{name: "enforcementNumber", value: ENFORCE_NO_XPATH},
		{name: "enforcementType", value: ENFORCE_TYPE_XPATH},
		{name: "issuingCourt", value: ISSUING_COURT_XPATH},
		{name: "owningCourt", value: OWNING_COURT_XPATH}
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
// Is called after the Create lifecycle event to perform post lifecycle checks.
Payment_AmountCurrency.logicOn = [FORM_STATE_XPATH];
Payment_AmountCurrency.logic = function(event)
{
	if(event.getXPath() != FORM_STATE_XPATH) {
		return;
	}

	var lifecycle = Services.getValue(FORM_STATE_XPATH);
	if(lifecycle == "create") {
		if(Services.exists(ENFORCEMENT_XPATH)) {
			if(validateEnforcement() && checkCourtCode()) {
				loadBlankPayment();
				Services.setFocus("Payment_Amount");
				Services.setValue(BUSINESS_LIFECYCLE_COMPLETED_XPATH, "true");
			}
			else {
				Services.setValue(ABORT_LOAD_XPATH, "true");
			}
		}
		else {
			alert(Messages.NO_ENFORCEMENTS_FOUND);
			Services.setValue(ABORT_LOAD_XPATH, "true");
		}
		Services.setValue(PROCESSING_SEARCH_XPATH, "false");
	}
	else if(lifecycle == "blank" && Services.getValue(RELOAD_XPATH) == "true") {
		Services.setValue(RELOAD_XPATH, null);
		Header_SearchBtn.actionBinding();
	}
}

// To get around asynch timing issues.
Payee_Address5.logicOn = [ABORT_LOAD_XPATH];
Payee_Address5.logic = function()
{
	if(Services.getValue(ABORT_LOAD_XPATH) == "true") {
		setTimeout("clearScreen()", 100);
	}
}

CreatePayment.submitLifeCycle = {
	create: {
		name: "createPayment",
		params: [{name: "payment", node: PAYMENT_XPATH}],
		errorHandler: {
/**
 * @param e
 * @author tzzmr4
 * 
 */
			onError:	function(e)
							{
								alert(Messages.ERROR_SAVING_PAYMENT + "\n\n" + e);
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
			var enforceCourt = XML.getNodeTextContent(dom.selectSingleNode("/Payment/AdminCourt"));
			Services.setValue(REPORT_DATA_XPATH + "/EnforcementCourtCode", enforceCourt);
			
			var transNo = XML.getNodeTextContent(dom.selectSingleNode("/Payment/TransactionNumber"));
			alert("Transaction number " + transNo + " has been assigned to this payment.");
			
			if(Services.getValue(REPORT_DATA_XPATH + "/ReportType") == "CVER") {
				runCounterReceiptReport(dom);
			}
			else {
				runCounterReceiptReport.onSuccess();
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

Header_EnforcementNumber.transformToModel = trimTransform;
Header_EnforcementNumber.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_EnforcementNumber.isReadOnly = function() {return !inQueryMode() || isProcessingSearch();}
Header_EnforcementNumber.helpText = "Enter AE No, Home Warrant No, Foreign Warrant No, AO/CAEO No or Case No";
Header_EnforcementNumber.maxLength = 8;
Header_EnforcementNumber.tabIndex = 1;
Header_EnforcementNumber.isMandatory = function() {return true;}
Header_EnforcementNumber.logicOn = [FORM_STATE_XPATH, ENFORCE_NO_XPATH];
Header_EnforcementNumber.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "blank") {
		setTimeout('Services.setFocus("Header_EnforcementNumber")', 100);
	}
}
Header_EnforcementNumber.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Header_EnforcementNumber.setDefault = function()
{
	Services.setValue(this.dataBinding, Services.getValue(ENFORCE_NO_XPATH));
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

Header_ExecutingCourtCode.transformToModel = trimTransform;
Header_ExecutingCourtCode.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_ExecutingCourtCode.isReadOnly = function()
{
	return !inQueryMode() || isProcessingSearch();
}
Header_ExecutingCourtCode.enableOn = [Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.isEnabled = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	return enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT";
}
Header_ExecutingCourtCode.helpText = "Code of the court executing the warrant";
Header_ExecutingCourtCode.maxLength = 3;
Header_ExecutingCourtCode.tabIndex = 3;
Header_ExecutingCourtCode.mandatoryOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.isMandatory = function() {return Header_ExecutingCourtCode.isEnabled();}
Header_ExecutingCourtCode.logicOn = [Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.logic = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT") {
		if(CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
			Services.setValue(this.dataBinding, CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
		}
	}
	else {
		Services.setValue(this.dataBinding, null);
	}
}
Header_ExecutingCourtCode.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Header_ExecutingCourtCode.setDefault = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT") {
		Services.setValue(this.dataBinding, Services.getValue(EXECUTING_COURT_XPATH));
	}
}
Header_ExecutingCourtCode.validateOn = [Header_ExecutingCourtCode.dataBinding];
Header_ExecutingCourtCode.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if(!Services.exists(COURTS_XPATH + "/Court[Code = " + this.dataBinding + "]")) {
		return ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	else {
		Services.setValue(Header_ExecutingCourtName.dataBinding, value);
	}
	return null;
}

Header_UserCourtCode.isReadOnly = function() {return true;}
Header_UserCourtCode.helpText = "Code of the user's home court";

Header_UserCourtName.isReadOnly = function() {return true;}
Header_UserCourtName.helpText = "Name of the user's home court";

Payment_AmountCurrency.enableOn = [FORM_STATE_XPATH];
Payment_AmountCurrency.isEnabled = function() {return !inQueryMode();}
Payment_AmountCurrency.isReadOnly = function() {return true;}
Payment_AmountCurrency.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Payment_AmountCurrency.setDefault = function()
{
	if(!inQueryMode()) {
		var defaultCurrency = Services.getValue(REF_XPATH + "/CurrentCurrency/CurrencyCode");
		Services.setValue(this.dataBinding, defaultCurrency);
	}
}
Payment_AmountCurrency.transformToDisplay = convertCurrencyToSymbol;
// Payment_AmountCurrency.logic used above.

Payment_Amount.enableOn = [FORM_STATE_XPATH];
Payment_Amount.isEnabled = function() {return !inQueryMode();}
Payment_Amount.isMandatory = function() {return true;}
Payment_Amount.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payment_Amount.isReadOnly = isProcessingSave;
Payment_Amount.transformToModel = trimTransformCurrency;
Payment_Amount.helpText = "Payment amount";
Payment_Amount.tabIndex = 7;
Payment_Amount.maxLength = 11;
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
	
	// Handle overpayments checks
	var warrantType = Services.getValue(ENFORCEMENT_XPATH + "/WarrantType");
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	var isExecutionWarrant = (warrantType == "EXECUTION" || warrantType == "CONTROL") ? true : false;
	var balance;
	if ( enforcementType == "CO" )
	{
		balance = CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance")) * 1;
		Services.startTransaction();
		if(value > balance) 
		{
			var overpaymentAmount = parseFloat(value - balance).toFixed(2);
			if(overpaymentAmount > value) 
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
		}
		Services.endTransaction();
	}
	else if ( enforcementType == "AE" || isExecutionWarrant )
	{
		/**
		 * Trac 2207 - AE and Warrant overpayments that are <= £1.00 should automatically be included in the 
		 * amount to be paid to the payee and not flagged as overpayments.
		 */		
		balance = CaseManUtils.getValidNodeValue(Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance")) * 1;
		Services.startTransaction();
		if ( value > balance && parseFloat(value - balance).toFixed(2) > 1.00 )		
		{
			var overpaymentAmount = parseFloat(value - balance).toFixed(2);
			if(overpaymentAmount > value) 
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
		}
		Services.endTransaction();
	}
		
	return null;
}

Lodgment_Name.enableOn = [FORM_STATE_XPATH];
Lodgment_Name.isEnabled = function() {return !inQueryMode();}
Lodgment_Name.isMandatory = function() {return true;}
Lodgment_Name.readOnlyOn = [PROCESSING_SAVE_XPATH];
Lodgment_Name.isReadOnly = isProcessingSave;
Lodgment_Name.transformToModel = trimTransform;
Lodgment_Name.helpText = "Lodgment details";
Lodgment_Name.maxLength = 70;
Lodgment_Name.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Lodgment_Name.setDefault = function()
{
	filterLodgmentParties();
	var partyId = Services.getValue(LODGMENT_PARTIES_XPATH + "/Party[1]/PartyID");
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	if(enforcementType == "CASE") {
		partyId = Services.getValue(LODGMENT_PARTIES_XPATH + "/Party[Role = 'DEFENDANT'][1]/PartyID");
	}
	else if(enforcementType == "CO") {
		if(Services.exists(LODGMENT_PARTIES_XPATH + "/Party[Role = 'EMPLOYER']")) {
			partyId = Services.getValue(LODGMENT_PARTIES_XPATH + "/Party[Role = 'EMPLOYER'][1]/PartyID");
		}
	}
	if(CaseManUtils.isBlank(partyId)) {
		// This will tell the LOV to use the temporary ID the grid has assigned the party.
		partyId = 0;
	}
	Services.setValue(Lov_Lodgment.dataBinding, partyId);
}
Lodgment_Name.tabIndex = 10;

Payee_PartyCode.enableOn = [FORM_STATE_XPATH];
Payee_PartyCode.isEnabled = payeeFieldsEnabled;
Payee_PartyCode.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_PartyCode.isReadOnly = isProcessingSave;
Payee_PartyCode.transformToModel = trimTransform;
Payee_PartyCode.tabIndex = 12;
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
	if(!CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		var isPartyDetailXpath = 	event.getXPath() == Payee_Name.dataBinding ||
												event.getXPath() == Payee_Address1.dataBinding ||
												event.getXPath() == Payee_Address2.dataBinding ||
												event.getXPath() == Payee_Address3.dataBinding ||
												event.getXPath() == Payee_Address4.dataBinding ||
												event.getXPath() == Payee_Address5.dataBinding ||
												event.getXPath() == Payee_PostCode.dataBinding ||
												event.getXPath() == Payee_DXNumber.dataBinding;
		if(isPartyDetailXpath) {
			if(Services.getValue(DISABLE_CODED_PARTY_CLEAR_XPATH) != "true") {
				Services.setValue(this.dataBinding, null);
			}
			else {
				Services.setValue(DISABLE_CODED_PARTY_CLEAR_XPATH, "false");
			}
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
Payee_Name.tabIndex = 13;
Payee_Name.helpText = "Payee Name";
Payee_Name.maxLength = 70;
Payee_Name.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Payee_Name.setDefault = function()
{
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	if(enforcementType != "CO") {
		var xpath = getDefaultPayeeXpath();
		var partyCode = Services.getValue(xpath + "/Code");
		if(!CaseManUtils.isBlank(partyCode)) {
			Services.setValue(Payee_PartyCode.dataBinding, partyCode);
		}
		else {
			Services.startTransaction();
			Services.setValue(this.dataBinding, Services.getValue(xpath + "/Name"));
			Services.setValue(PAYMENT_XPATH + "/Payee/PartyID", Services.getValue(xpath + "/PartyID"));
			Services.setValue(Payee_Address1.dataBinding, Services.getValue(xpath + "/Address/Line[1]"));
			Services.setValue(Payee_Address2.dataBinding, Services.getValue(xpath + "/Address/Line[2]"));
			Services.setValue(Payee_Address3.dataBinding, Services.getValue(xpath + "/Address/Line[3]"));
			Services.setValue(Payee_Address4.dataBinding, Services.getValue(xpath + "/Address/Line[4]"));
			Services.setValue(Payee_Address5.dataBinding, Services.getValue(xpath + "/Address/Line[5]"));
			Services.setValue(Payee_PostCode.dataBinding, Services.getValue(xpath + "/Address/PostCode"));
			Services.setValue(Payee_Reference.dataBinding, Services.getValue(xpath + "/Address/Reference"));
			Services.setValue(Payee_DXNumber.dataBinding, Services.getValue(xpath + "/DX"));
			Services.endTransaction();
		}
	}
}

Payee_Address1.enableOn = [FORM_STATE_XPATH];
Payee_Address1.isEnabled = payeeFieldsEnabled;
Payee_Address1.isMandatory = payeeFieldsEnabled;
Payee_Address1.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address1.isReadOnly = isProcessingSave;
Payee_Address1.transformToModel = trimTransform;
Payee_Address1.tabIndex = 15;
Payee_Address1.helpText = "Payee Address Line 1";
Payee_Address1.maxLength = 35;

Payee_Address2.enableOn = [FORM_STATE_XPATH];
Payee_Address2.isEnabled = payeeFieldsEnabled;
Payee_Address2.isMandatory = payeeFieldsEnabled;
Payee_Address2.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address2.isReadOnly = isProcessingSave;
Payee_Address2.transformToModel = trimTransform;
Payee_Address2.tabIndex = 16;
Payee_Address2.helpText = "Payee Address Line 2";
Payee_Address2.maxLength = 35;

Payee_Address3.enableOn = [FORM_STATE_XPATH];
Payee_Address3.isEnabled = payeeFieldsEnabled;
Payee_Address3.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address3.isReadOnly = isProcessingSave;
Payee_Address3.transformToModel = trimTransform;
Payee_Address3.tabIndex = 17;
Payee_Address3.helpText = "Payee Address Line 3";
Payee_Address3.maxLength = 35;

Payee_Address4.enableOn = [FORM_STATE_XPATH];
Payee_Address4.isEnabled = payeeFieldsEnabled;
Payee_Address4.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address4.isReadOnly = isProcessingSave;
Payee_Address4.transformToModel = trimTransform;
Payee_Address4.tabIndex = 18;
Payee_Address4.helpText = "Payee Address Line 4";
Payee_Address4.maxLength = 35;

Payee_Address5.enableOn = [FORM_STATE_XPATH];
Payee_Address5.isEnabled = payeeFieldsEnabled;
Payee_Address5.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Address5.isReadOnly = isProcessingSave;
Payee_Address5.transformToModel = trimTransform;
Payee_Address5.tabIndex = 19;
Payee_Address5.helpText = "Payee Address Line 5";
Payee_Address5.maxLength = 35;
// Payee_Address5.logic used above.

Payee_PostCode.enableOn = [FORM_STATE_XPATH];
Payee_PostCode.isEnabled = payeeFieldsEnabled;
Payee_PostCode.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_PostCode.isReadOnly = isProcessingSave;
Payee_PostCode.transformToModel = trimTransform;
Payee_PostCode.tabIndex = 20;
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
Payee_DXNumber.tabIndex = 21;
Payee_DXNumber.helpText = "Payee Representative DX";
Payee_DXNumber.maxLength = 35;

Payee_Reference.enableOn = [FORM_STATE_XPATH];
Payee_Reference.isEnabled = payeeFieldsEnabled;
Payee_Reference.readOnlyOn = [PROCESSING_SAVE_XPATH];
Payee_Reference.isReadOnly = isProcessingSave;
Payee_Reference.transformToModel = trimTransform;
Payee_Reference.tabIndex = 22;
Payee_Reference.helpText = "Payee Reference";
Payee_Reference.maxLength = 24;

//-----------------------------------------------------------------------------------------------
//                                        BUTTONS
//-----------------------------------------------------------------------------------------------

Court_LovBtn.enableOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding, PROCESSING_SEARCH_XPATH];
Court_LovBtn.isEnabled = function()
{
	return Header_ExecutingCourtCode.isEnabled() && !Header_ExecutingCourtCode.isReadOnly();
}
Court_LovBtn.tabIndex = 5;
/**
 * @author tzzmr4
 * 
 */
Court_LovBtn.actionBinding = function()
{
	Services.dispatchEvent("Lov_Court", PopupGUIAdaptor.EVENT_RAISE);
}

Court_LovBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_ExecutingCourtCode" }, 
			    { key: Key.F6, element: "Header_ExecutingCourtName" } ]
	}
};

Header_SearchBtn.enableOn = [
	Header_EnforcementNumber.dataBinding,
	Header_EnforcementType.dataBinding,
	Header_ExecutingCourtCode.dataBinding,
	FORM_STATE_XPATH,
	PROCESSING_SEARCH_XPATH
];
Header_SearchBtn.isEnabled = function()
{
	if(!inQueryMode() || isProcessingSearch()) {
		return false;
	}
	var areParamsBlank =	CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) ||
										CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding));
	if(Header_ExecutingCourtCode.isEnabled()) {
		areParamsBlank = areParamsBlank || CaseManUtils.isBlank(Services.getValue(Header_ExecutingCourtCode.dataBinding));
	}

	if(areParamsBlank || Header_EnforcementNumber.validate() != null) {
		return false;
	}
	else {
		if(Header_ExecutingCourtCode.isEnabled()) {
			return Header_ExecutingCourtCode.validate() == null;
		}
		else {
			return true;
		}
	}
}
/**
 * @author tzzmr4
 * 
 */
Header_SearchBtn.actionBinding = function()
{
	// If type=CASE then check if AEs and Warrants exist for that case. If warrant then result may not be unique.
	// COs may have attached CAEO warrants.
	var params = new ServiceParams();
	var serviceName;
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	switch(enforcementType) {
		case "CASE":
			params.addSimpleParameter("caseNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
			serviceName = "searchEnforcements";
			break;
		case "CO":
			params.addSimpleParameter("coNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
			serviceName = "searchCos";
			break;
		case "HOME WARRANT":
			params.addSimpleParameter("warrantNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
			params.addSimpleParameter("executingCourt", Services.getValue(Header_ExecutingCourtCode.dataBinding));
			serviceName = "searchHomeWarrants";
			break;
		case "FOREIGN WARRANT":
			params.addSimpleParameter("localWarrantNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
			params.addSimpleParameter("executingCourt", Services.getValue(Header_ExecutingCourtCode.dataBinding));
			serviceName = "searchForeignWarrants";
			break;
	}
	if(!CaseManUtils.isBlank(Services.getValue(ENFORCE_NO_XPATH))) {
		createBlankPayment();
	}
	else if(CaseManUtils.isBlank(serviceName)) {
		setDefaultFormPersistantData();
		createBlankPayment();
	}
	else {
		Services.callService(serviceName, params, Header_SearchBtn, true);
	}
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
			if(Services.countNodes(SEARCH_RESULTS_XPATH + "/Enforcement") > 1) {
				Services.dispatchEvent("Lov_SearchResults", PopupGUIAdaptor.EVENT_RAISE);
			}
			else {
				setFormPersistantData(SEARCH_RESULTS_XPATH + "/Enforcement");
				createBlankPayment();
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
Header_SearchBtn.tabIndex = 6;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F1, element: "CreatePayment"}]
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
		keys: [ {key: Key.F6, element: "Lodgment_Name"} ]
	}
}

Payee_LovBtn.enableOn = [FORM_STATE_XPATH, PROCESSING_SAVE_XPATH];
Payee_LovBtn.isEnabled = payeeFieldsEnabled;
Payee_LovBtn.tabIndex = 14;

Status_SaveBtn.enableOn = [FORM_DIRTY_XPATH, PROCESSING_SAVE_XPATH];
Status_SaveBtn.isEnabled = function() {return !inQueryMode() && !isProcessingSave();}
Status_SaveBtn.actionBinding = savePayment;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F3, element: "CreatePayment"}]
	}
}
Status_SaveBtn.tabIndex = 30;

/**
 * @author tzzmr4
 * 
 */
Status_ClearBtn.actionBinding = function()
{
	if(saveChangesPrompt()) {
		savePayment();
	}
	else {
		clearScreen();
	}
}
Status_ClearBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_ClearBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.CHAR_C, element: "CreatePayment", alt: true}]
	}
}
Status_ClearBtn.tabIndex = 31;

Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.enableOn = [PROCESSING_SAVE_XPATH, PROCESSING_SEARCH_XPATH];
Status_CloseBtn.isEnabled = function() {return !isProcessingSearch() && !isProcessingSave();}
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [{key: Key.F4, element: "CreatePayment"}]
	}
}
Status_CloseBtn.tabIndex = 32;

//-----------------------------------------------------------------------------------------------
//                                        SELECTS
//-----------------------------------------------------------------------------------------------

Header_EnforcementType.srcData = REF_XPATH + "/EnforcementTypes";
Header_EnforcementType.rowXPath = "EnforcementType";
Header_EnforcementType.keyXPath = "Code";
Header_EnforcementType.displayXPath = "Code";
Header_EnforcementType.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SEARCH_XPATH];
Header_EnforcementType.isReadOnly = function()
{
	return !inQueryMode() || isProcessingSearch();
}
Header_EnforcementType.helpText = "Case/Enforcement Type";
Header_EnforcementType.tabIndex = 2;
Header_EnforcementType.isMandatory = function() {return true;}
Header_EnforcementType.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Header_EnforcementType.setDefault = function()
{
	Services.setValue(this.dataBinding, Services.getValue(ENFORCE_TYPE_XPATH));
}

Header_ExecutingCourtName.srcData = COURTS_XPATH;
Header_ExecutingCourtName.rowXPath = "Court";
Header_ExecutingCourtName.keyXPath = "Code";
Header_ExecutingCourtName.displayXPath = "Name";
Header_ExecutingCourtName.readOnlyOn = [PROCESSING_SEARCH_XPATH];
Header_ExecutingCourtName.isReadOnly = Header_ExecutingCourtCode.isReadOnly;
Header_ExecutingCourtName.enableOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Header_ExecutingCourtName.isEnabled = Header_ExecutingCourtCode.isEnabled;
Header_ExecutingCourtName.mandatoryOn = [
	FORM_STATE_XPATH,
	Header_EnforcementType.dataBinding,
	Header_ExecutingCourtName.dataBinding
];
Header_ExecutingCourtName.isMandatory = function()
{
	return CaseManUtils.isBlank(Services.getValue(this.dataBinding)) && Header_ExecutingCourtCode.isEnabled();
}
Header_ExecutingCourtName.tabIndex = 4;
Header_ExecutingCourtName.validateOn = [Header_ExecutingCourtName.dataBinding];
Header_ExecutingCourtName.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if(!Services.exists(COURTS_XPATH + "/Court[Code = " + this.dataBinding + "]")) {
		return ErrorCode.getErrorCode("CaseMan_valueNotInList_Msg");
	}
	else {
		Services.setValue(Header_ExecutingCourtCode.dataBinding, value);
	}
	return null;
}
Header_ExecutingCourtName.logicOn = [Header_EnforcementType.dataBinding];
Header_ExecutingCourtName.logic = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT") {
		if(CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
			Services.setValue(this.dataBinding, CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
		}
	}
	else {
		Services.setValue(this.dataBinding, null);
	}
}
Header_ExecutingCourtName.helpText = "Name of the court executing the warrant";
Header_ExecutingCourtName.transformToModel = trimTransform;

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
Payment_Type.tabIndex = 8;
Payment_Type.transformToDisplay = function(value) {return (null != value) ? value.toUpperCase() : null;}
Payment_Type.logicOn = [Payment_Type.dataBinding];
Payment_Type.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "create") {
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
Payment_RetentionType.readOnlyOn = [FORM_STATE_XPATH, PROCESSING_SAVE_XPATH];
Payment_RetentionType.isReadOnly = function()
{
	return isProcessingSave() || Services.getValue(ENFORCE_TYPE_XPATH) == "CO";
}
Payment_RetentionType.helpText = "Retention type";
Payment_RetentionType.transformToDisplay = function(value) {return (null != value) ? value.toUpperCase() : null;}
Payment_RetentionType.logicOn = [Payment_RetentionType.dataBinding];
Payment_RetentionType.logic = function()
{
	if(Services.getValue(FORM_STATE_XPATH) == "create") {
		filterPaymentTypes();
	}
}
Payment_RetentionType.setDefaultOn = [BUSINESS_LIFECYCLE_COMPLETED_XPATH];
/**
 * @author tzzmr4
 * 
 */
Payment_RetentionType.setDefault = function()
{
	if(Services.getValue(ENFORCEMENT_XPATH + "/PreIssueBalance") > 1000) {
		Services.setValue(this.dataBinding, "JGMT(1000+)");
	}
	else if(Services.getValue(ENFORCE_TYPE_XPATH) == "CO") {
		Services.setValue(this.dataBinding, "AO/CAEO");
	}
}
Payment_RetentionType.tabIndex = 9;

//-----------------------------------------------------------------------------------------------
//                                        LOVS & GRIDS
//-----------------------------------------------------------------------------------------------

Lov_Court.srcData = COURTS_XPATH;
Lov_Court.rowXPath = "Court";
Lov_Court.keyXPath = "Code";
Lov_Court.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

Lov_SearchResults.srcData = SEARCH_RESULTS_XPATH;
Lov_SearchResults.rowXPath = "Enforcement";
Lov_SearchResults.keyXPath = "Number";
Lov_SearchResults.columns = [
	{
		xpath: "Type",
		transformToDisplay: function(value)
		{
			if(value == "HOME WARRANT") {
				return "H/W";
			}
			else if(value == "FOREIGN WARRANT") {
				return "F/W";
			}
			return value;
		},
/**
 * @param a
 * @param b
 * @author tzzmr4
 * @return 1;}, -1;}, 0;} 
 */
		sort:	function(a, b)
				{
					if(a == "CASE") {return 1;}
					if(b == "CASE") {return -1;}
					
					if(a < b) {return 1;}
					else if(a == b) {return 0;}
					else {return -1;}
				},
		additionalSortColumns: [
			{columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending"},
			{columnNumber: 6, orderOnAsc: "descending", orderOnDesc: "ascending"}
		]
	},
	{xpath: "DisplayNumber"},
	{xpath: "ExecutingCourt"},
	{xpath: "IssuingCourt"},
	{xpath: "Defendant1"},
	{xpath: "Defendant2"},
	{xpath: "Outstanding"}
];
Lov_SearchResults.logicOn = [Lov_SearchResults.dataBinding];
Lov_SearchResults.logic = function()
{
	if(!CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
		var xpath = SEARCH_RESULTS_XPATH + "/Enforcement[Number = " + this.dataBinding + "]";
		var enforcementNumber = Services.getValue(xpath + "/DisplayNumber");
		var enforcementType = Services.getValue(xpath + "/Type");
		
		if(!CaseManUtils.isBlank(enforcementNumber) && !CaseManUtils.isBlank(enforcementType)) {
			Services.setFocus("Payment_Amount");
			setFormPersistantData(xpath);
			createBlankPayment();
		}
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
		// If party has no ID then find out temporary ID grid component has assigned it.
		var partyId= Services.getValue(this.dataBinding);
		if(partyId == 0) {
			partyId = Services.getValue(LODGMENT_PARTIES_XPATH + "/Party[1]/PartyID");
		}
	
		var xpath = LODGMENT_PARTIES_XPATH + "/Party[PartyID = '" + partyId + "']";
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
		keys: [ {key: Key.F6, element: "Payee_PartyCode"}, {key: Key.F6, element: "Payee_Name"} ]
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
function createBlankPayment()
{
	Services.setValue(PROCESSING_SEARCH_XPATH, "true");
	Services.dispatchEvent("CreatePayment", BusinessLifeCycleEvents.EVENT_CREATE, null);
}

/**
 * @author tzzmr4
 * @return Services.getValue(FORM_STATE_XPATH) != "create"  
 */
function inQueryMode()
{
	return Services.getValue(FORM_STATE_XPATH) != "create";
}

/**
 * @author tzzmr4
 * 
 */
function clearFormPersistantData()
{
	Services.startTransaction();
	Services.removeNode(ENFORCE_NO_XPATH);
	Services.removeNode(ENFORCE_TYPE_XPATH);
	Services.removeNode(ISSUING_COURT_XPATH);
	Services.removeNode(OWNING_COURT_XPATH);
	Services.removeNode(EXECUTING_COURT_XPATH);
	Services.removeNode(IS_NAVIGATING_XPATH);
	Services.removeNode("/ds/var/app/CaseData");
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function clearSessionPersistantData()
{
	Services.removeNode(REPORT_DATA_XPATH);
	Services.setValue(PAYMENT_METHOD_XPATH, null);
}

/**
 * @author tzzmr4
 * 
 */
function setDefaultFormPersistantData()
{
	Services.startTransaction();
	Services.setValue(ENFORCE_NO_XPATH, Services.getValue(Header_EnforcementNumber.dataBinding));
	Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(Header_EnforcementType.dataBinding));
	Services.setValue(EXECUTING_COURT_XPATH, Services.getValue(Header_ExecutingCourtCode.dataBinding));
	Services.setValue(ISSUING_COURT_XPATH, null);
	Services.setValue(OWNING_COURT_XPATH, null);
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
	Services.setValue(ENFORCE_NO_XPATH, Services.getValue(xpath + "/DisplayNumber"));
	Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(xpath + "/Type"));
	Services.setValue(EXECUTING_COURT_XPATH, Services.getValue(xpath + "/ExecutingCourt"));
	Services.setValue(ISSUING_COURT_XPATH, Services.getValue(xpath + "/IssuingCourt"));
	Services.setValue(OWNING_COURT_XPATH, Services.getValue(xpath + "/OwningCourt"));
	Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function clearScreen()
{
	if(Services.getValue(RELOAD_XPATH) != "true") {
		clearFormPersistantData();
	}
	setDirtyFlagFalse();
	Services.dispatchEvent("CreatePayment", BusinessLifeCycleEvents.EVENT_CLEAR, null);
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
 * @author tzzmr4
 * 
 */
function populatePaymentDom()
{
	Services.startTransaction();
	
	switch(Services.getValue(PAYMENT_METHOD_XPATH)) {
		case "CreatePostalPayment":
			Services.setValue(PAYMENT_XPATH + "/ReceiptRequired", "Y");
			Services.setValue(PAYMENT_XPATH + "/BailiffKnowledge", "N");
			Services.setValue(PAYMENT_XPATH + "/CounterPayment", "N");
			break;
		case "CreateBailiffPayment":
			Services.setValue(PAYMENT_XPATH + "/ReceiptRequired", "N");
			Services.setValue(PAYMENT_XPATH + "/BailiffKnowledge", "Y");
			Services.setValue(PAYMENT_XPATH + "/CounterPayment", "N");
			break;
		case "CreateCounterPayment":
			Services.setValue(PAYMENT_XPATH + "/ReceiptRequired", "Y");
			Services.setValue(PAYMENT_XPATH + "/BailiffKnowledge", "N");
			Services.setValue(PAYMENT_XPATH + "/CounterPayment", "Y");
			break;
	}
	
	populateReleaseDate();
	Services.setValue(PAYMENT_XPATH + "/PaymentDate", getSystemDate());
	Services.setValue(PAYMENT_XPATH + "/Passthrough", "N");
	Services.setValue(PAYMENT_XPATH + "/Error", "N");
	if(CaseManUtils.isBlank(Services.getValue(Payee_PartyCode.dataBinding))) {
		Services.setValue(PAYMENT_XPATH + "/Payee/PartyID", "");
	}
	payeeNotDefaultActions();
	
	var usersCourt = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAYMENT_XPATH + "/IssuingCourt", usersCourt);
	Services.setValue(PAYMENT_XPATH + "/AdminCourt", usersCourt);
	if(Services.getValue(ENFORCE_TYPE_XPATH) == "HOME WARRANT") {
		Services.setValue(PAYMENT_XPATH + "/EnforcementCourt", Services.getValue(ISSUING_COURT_XPATH));
	}
	else {
		Services.setValue(PAYMENT_XPATH + "/EnforcementCourt", Services.getValue(ENFORCEMENT_XPATH + "/CourtCode"));
	}
	
	checkLodgmentDetails();

	Services.setValue(PAYMENT_XPATH + "/ReportType", Services.getValue(REPORT_DATA_XPATH + "/ReportType"));
	Services.setValue(PAYMENT_XPATH + "/ReportNumber", Services.getValue(REPORT_DATA_XPATH + "/ReportNumber"));
	Services.setValue(PAYMENT_XPATH + "/CreatedBy", Services.getCurrentUser());

    // .......start code insert for TRAC 707
    var enforcementParent = "";
	var caseNumber = Services.getValue(ENFORCEMENT_XPATH + "/CaseNumber");
	var coInfo = Services.getValue(ENFORCEMENT_XPATH + "/COInfo");
	switch ( Services.getValue(ENFORCE_TYPE_XPATH) ){
		case "CASE":
		case "AE":
			// For Cases and AE's, set the parent to be the Case Number
			enforcementParent = caseNumber;
			break;
		case "CO":
			// For CO's, set the parent to be the Enforcement Number (CO Number)
			enforcementParent = Services.getValue(ENFORCEMENT_XPATH + "/Number");
			break;
		case "HOME WARRANT":
		case "FOREIGN WARRANT":
			// For warrants, determine whether the warrant is linked to a Case or a CO
			// and assign the parent accordingly.
			if ( !CaseManUtils.isBlank(caseNumber) ){
				enforcementParent = caseNumber;
			}
			else{
				enforcementParent = coInfo;
			}
			break;
	}
	// Set the Enforcement parent node
	Services.setValue(PAYMENT_XPATH + "/EnforcementParent", enforcementParent);

    // ........end code insert for TRAC 707 

    Services.endTransaction();
}

/**
 * @author tzzmr4
 * 
 */
function populateReleaseDate()
{
	var sysDate = CaseManUtils.createDate(getSystemDate());
	switch(Services.getValue(Payment_RetentionType.dataBinding)) {
		case "AO/CAEO":
			var retentionDays = 0 * 1;
			if(Services.getValue(Payment_Type.dataBinding) == "CHQ RT") {
				retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'CHQ RETENTION']/Value") * 1;
			}
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(sysDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "CHEQUE":
			var retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'CHQ RETENTION']/Value") * 1;
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(sysDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "JGMT(1000+)":
			var retentionDays = Services.getValue(REF_XPATH + "/SystemData/Item[Name = 'JGMT1000+']/Value") * 1;
			var releaseDate = CaseManUtils.convertDateToPattern(CaseManUtils.daysInFuture(sysDate, retentionDays, true), "YYYY-MM-DD");
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", releaseDate);
			break;
		case "ORDINARY":
			Services.setValue(PAYMENT_XPATH + "/ReleaseDate", getSystemDate());
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
		Services.setValue(PAYMENT_XPATH + "/Notes", "DEFAULT PAYEE DETAILS AMENDED ON CREATION OF PAYMENT");
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
function loadBlankPayment()
{
	var template = Services.loadDOMFromURL("NewPayment.xml");
	if(Services.exists(PAYMENT_XPATH)) {
		Services.replaceNode(PAYMENT_XPATH, template.selectSingleNode("/Payment"));
	}
	else {
		Services.addNode(template.selectSingleNode("/Payment"), "/ds");
	}
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function checkCourtCode()
{
	var courtCode = Services.getValue(ENFORCEMENT_XPATH + "/CourtCode");
	var checkCourt = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
	if(courtCode != CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH) && checkCourt != "true") {
		Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
		switch(Services.getValue(ENFORCE_TYPE_XPATH)) {
			case "CASE":
			case "AE":
				alert(Messages.OWNING_COURT_MESSAGE);
				break;
			case "HOME WARRANT":
			case "FOREIGN WARRANT":
				alert(Messages.WRONG_WARRANT_COURT);
				break;
			case "CO":
				alert(Messages.CO_OWNING_COURT_ERROR);
				return false;
				break;
		}
	}
	return true;
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function validateEnforcement()
{
	var enforcementNumber = Services.getValue(ENFORCE_NO_XPATH);
	var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
	
	if(enforcementType == "AE" && Services.getValue(ENFORCEMENT_XPATH + "/NumberEvents") > 0) {
		alert(Messages.DETAILS_SENT_TO_CAPS);
		return false;
	}
	
	// The following should never happen but will cause save to fail so check anyway.
	if(Services.countNodes(ENFORCEMENT_XPATH + "/WarrantID") > 1) {
		alert("Error - There is more than one AO Warrant associated with this CO.");
		return false;
	}
	
	// Node value is CO # for Warrant or CO Status for a CO or 1 if associated
	// enforcement case has any live COs attached.
	var coInfo = Services.getValue(ENFORCEMENT_XPATH + "/COInfo");
	if(!CaseManUtils.isBlank(coInfo) && coInfo != 0) {
		switch(enforcementType) {
			case "CO":
				if(coInfo == "NOT LIVE") {
					alert(Messages.CO_NOT_LIVE_ERROR);
					return false;
				}
				break;
			case "HOME WARRANT":
				if(Services.getValue(ENFORCEMENT_XPATH + "/COType") == "AO") {
					if(coInfo.length > 1) {
						var proceed = confirm(
							"This Warrant Number relates to an AO warrant.\n" +
							"It needs to be allocated against\n" +
							"CO Number " + coInfo +
							"\nDo you wish to Proceed?"
						);
						if(proceed) {
							Services.startTransaction();
							Services.setValue(ENFORCE_NO_XPATH, coInfo);
							Services.setValue(ENFORCE_TYPE_XPATH, "CO");
							Services.setValue(RELOAD_XPATH, "true");
							Services.endTransaction();
						}
						return false;
					}
				}
			// Fallthrough.
			default:
				alert(Messages.CO_IN_FORCE_WARNING);
				break;
		}
	}
	return true;
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
function setDirtyFlagFalse()
{
	var adaptor = Services.getAdaptorById("CreatePayment");
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
		populatePaymentDom();
		Services.dispatchEvent("CreatePayment", BusinessLifeCycleEvents.EVENT_SUBMIT, null);
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
function populateReportData(reportType)
{
	Services.startTransaction();
	Services.setValue(REPORT_DATA_XPATH + "/ReportType", reportType);
	Services.setValue(REPORT_DATA_XPATH + "/ReportDate", getSystemDate());
	Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", 0);
	Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser());
	Services.setValue(REPORT_DATA_XPATH + "/CourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.endTransaction();
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
	var reportType = Services.getValue(REPORT_DATA_XPATH + "/ReportType");
	if(reportType != "CVER" && Services.getValue(IS_NAVIGATING_XPATH) != "true") {
		var reportNumber = Services.getValue(REPORT_DATA_XPATH + "/ReportNumber");
		if(!CaseManUtils.isBlank(reportNumber) && reportNumber != 0) {
			Services.setValue("/ds/var/app/businessProcessId", reportType + reportNumber);
			performPreExitUpdates();
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
function performPreExitUpdates()
{
	var dom = XML.createDOM(null, null, null);
	dom.appendChild(Services.getNode(REPORT_DATA_XPATH));
	var params = new ServiceParams();
	params.addDOMParameter("reportData", dom);
	Services.callService("exitCreateUpdates", params, performPreExitUpdates, true);
}
/**
 * @author tzzmr4
 * 
 */
performPreExitUpdates.onSuccess = function()
{
	executeExit();
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
performPreExitUpdates.onError = function(e)
{
	alert(Messages.EXIT_CREATE_UPDATES_ERROR + "\n\n" + e);
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
	if(NavigationController.getNextScreen() == Services.getValue(PAYMENT_METHOD_XPATH)) {
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
	var reportType;
	switch(Services.getValue(PAYMENT_METHOD_XPATH)) {
		case "CreatePostalPayment":
			reportType = "PREC";
			break;
		case "CreateBailiffPayment":
			reportType = "BVER";
			break;
		case "CreateCounterPayment":
			reportType = "CVER";
			break;
	}
	
	populateReportData(reportType);
	if(reportType != "CVER") {
		insertReportData();
	}
	
	Services.setFocus("Header_EnforcementNumber");
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
 * @param dom
 * @author tzzmr4
 * 
 */
function runCounterReceiptReport(dom)
{
	var params = new ServiceParams();
	params.addDOMParameter("payment", dom);
	Services.callService("runCounterReceiptReport", params, runCounterReceiptReport, true);
}
/**
 * @author tzzmr4
 * 
 */
runCounterReceiptReport.onSuccess = function()
{
	if(Services.getValue(SCREEN_CLOSING_XPATH) == "true") {
		performScreenCleanup();
	}
	else {
		Services.setValue(PROCESSING_SAVE_XPATH, "false");
		clearScreen();
	}
}
/**
 * @author tzzmr4
 * 
 */
runCounterReceiptReport.onError = function()
{
	alert("The receipt was not printed.");
}

/**
 * @param codedPartyCode
 * @author tzzmr4
 * @return adminCourtCode
 *
 * Change History:
 * 26/05/2010 - N Mistry, Fixed Trac 2898.  Local Coded Parties loaded are linked to 
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
	else if ( codedPartyCode >= 7000 ) {
	    // Party is a non CPC national coded party
		adminCourtCode = CaseManUtils.GLOBAL_COURT_CODE;
	}
	else 
	{
	    // Party is a local coded party, use the Enforcement Owning Court
		adminCourtCode = Services.getValue(ENFORCEMENT_XPATH + "/CourtCode");
	}
	return adminCourtCode;
}
