/** 
 * @fileoverview CreateUpdatePassthrough.js:
 * This file contains the form and field configurations for the UC059 - Create Update
 * Passthrough Payments
 * @author Tony White
 * @version 0.1
 *
 * Change History:
 * 03/08/2006 - Chris Vincent, added keybindings to Add_Payment_CancelBtn (F4) and Payment_AddPaymentBtn (F2)
 *				which were previously missing.
 * 18/01/2007 - Steve Blair, UCT Defect 670.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 13/02/2007 - Steve Blair, Defect 5956.
 * 01/05/2007 - Mark Groen , CASEMAN Defect 6179. Validating against Old Numer to check if CO live. This is wrong.   
 * Should only validate on the status of the CO. 
 * 10/05/2007 - Chris Vincent, re-fixing defect 6016 so message in addPayment.onSuccess() says passthrough instead of
 *				payment.
 * 21/09/2007 - Chris Vincent, CaseMan Defect 6432, update to validateEnforcement().  Previous AE validation around
 * 				number of CAPS AE Events was an error message but is now a warning message as per legacy.
 *
 * 17-06-2009 - Mark Groen - TRAC 707. - Incorporate changes defined by Chris Vincent re scalabilty 
 *                              for Navigate to Transfer Case and View Payments
 * 01-12-2011 - Chris Vincent, change to validateEnforcement() to prevent COs from being loaded if there is money in
 *					court.  Trac 4587.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Enforcement Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function for Home Warrants.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes, CONTROL warrants are replacing EXECUTION warrants so validatePayment
 *				is changing to identify Execution Warrants as either CONTROL or EXECUTION.
 */


//-----------------------------------------------------------------------------------------------
//                                        GLOBAL VARIABLES
//-----------------------------------------------------------------------------------------------

var BASE_XPATH                      = "/ds/var/page";
var REF_XPATH                       = "/ds/var/form";
var PASSTHROUGH_XPATH               = "/ds/var/Passthrough";
var ENFORCEMENT_XPATH               = PASSTHROUGH_XPATH + "/Enforcement";
var PAYMENT_XPATH                   = PASSTHROUGH_XPATH + "/Payments";
var SEARCH_RESULTS_XPATH            = PASSTHROUGH_XPATH + "/SearchResults";
var PAYMENT_TYPES_XPATH             = PASSTHROUGH_XPATH + "/PaymentTypes";
var RETENTION_TYPES_XPATH           = PASSTHROUGH_XPATH + "/RetentionTypes";
var CODED_PARTIES_XPATH             = REF_XPATH + "/CodedParties";
var COURTS_XPATH                    = REF_XPATH + "/Courts";
var FORM_STATE_XPATH                = REF_XPATH + "/state";
var FORM_DIRTY_XPATH                = REF_XPATH + "/dirty";
var DEFAULT_PAYEE_XPATH             = PASSTHROUGH_XPATH + "/DefaultPayee";
var NEW_PAYMENT_XPATH               = BASE_XPATH + "/NewPayment/Payment";
var CO_CREDITORS_XPATH              = PASSTHROUGH_XPATH + "/COCreditors";
var DEBTS_XPATH                     = PASSTHROUGH_XPATH + "/MaintainCO/Debts";
var DEFAULT_CURRENCY_XPATH          = REF_XPATH + "/DefaultCurrency";

var SYSTEMDATE_XPATH                = REF_XPATH + "/SystemDate";
var FLAGS_XPATH                     = PASSTHROUGH_XPATH + "/Flags";
var BUSINESS_LIFECYCLE_COMPLETED_XPATH = FLAGS_XPATH + "/BusinessLifecycleCompeted";
var DISABLE_CODED_PARTY_CLEAR_XPATH = FLAGS_XPATH + "/DisableCodedPartyClear";
var ABORT_LOAD_XPATH                = FLAGS_XPATH + "/AbortLoadEnforcement";
var NEW_PAYMENT                     = FLAGS_XPATH + "/NewPayment";
var SELECTED_DEBT_XPATH             = FLAGS_XPATH + "/SelectedDebt";
var ENABLE_ADD                      = FLAGS_XPATH + "/AddButton";
var ENABLE_SAVE                     = FLAGS_XPATH + "/SaveButton";
var SCREEN_CLOSING_XPATH 			= FLAGS_XPATH + "/ScreenClosing";
var RELOAD_XPATH 					= REF_XPATH + "/ReloadEnforcement";
var ERROR_IND_XPATH                 = FLAGS_XPATH + "/ErrorIndFired";
var GET_PAYMENTS_XPATH              = FLAGS_XPATH + "/GetPayments";
var ADD_PAYMENT_AFTER_UPDATE_XPATH 	= BASE_XPATH + "/Flags/AddAfterUpdate";

var USER_OWNING_COURTCODE;
var DEFAULT_USER;

var IS_NAVIGATING_XPATH 			= "/ds/var/app/PaymentParams/IsNavigating";
var REPORT_DATA_XPATH 				= "/ds/var/app/PaymentParams/ReportData";
var REPORT_NUMBER                   = "/ds/var/app/PaymentParams/ReportID";
var PAYMENT_TYPE_XPATH              = "/ds/var/app/PaymentParams/PaymentType";
var ENFORCE_NO_XPATH                = "/ds/var/app/PaymentParams/EnforcementNumber";
var ENFORCE_TYPE_XPATH              = "/ds/var/app/PaymentParams/EnforcementType";
//var COURT_CODE_XPATH                = "/ds/var/app/PaymentParams/CourtCode";
var ISSUING_COURT_XPATH             = "/ds/var/app/PaymentParams/IssuingCourtCode";
var OWNING_COURT_XPATH              = "/ds/var/app/PaymentParams/OwningCourtCode";
var EXECUTING_COURT_XPATH           = "/ds/var/app/PaymentParams/ExecutingCourtCode";


var nextSurrogateKey = 0;
var GET_PAYMENTS                    = true;
var SAVE_PAYMENT                    = true;
var ERROR_PAYMENT                   = true;

//-----------------------------------------------------------------------------------------------
//                                        FUNCTION CLASSES
//-----------------------------------------------------------------------------------------------

function CreateUpdatePassthrough() {};
function Add_Payment() {};
function exitScreenHandler() {};

function Header_EnforcementNumber() {};
function Header_EnforcementType() {};
function Header_EnforcementType() {};
function Header_ExecutingCourtCode() {};
function Header_ExecutingCourtName() {};
function Header_UserCourtCode() {};
function Header_UserCourtName() {};
function Court_LovBtn() {};
function Lov_Court() {};
function Header_SearchBtn() {};
function Lov_SearchResults() {};
//function Add_Payment_DebtLOV() {};

function Parties_Grid() {};
function Payment_PaymentDetails_Grid() {};

function Payment_TransNo() {};
function Payment_DateEntered() {};
function Payment_Amount_Currency() {};
function Payment_Amount() {};
function Payment_PaidTo() {};
function Payment_Error() {};
function Payment_AddPaymentBtn() {};

function Add_Payment_Amount_Currency() {};
function Add_Payment_Amount() {};
function Add_Payment_PaidTo() {};
function Add_Payment_OkBtn() {};
function Add_Payment_CancelBtn() {};

function Status_SaveBtn() {};
function Status_ClearBtn() {};
function Status_CloseBtn() {};

//-----------------------------------------------------------------------------------------------
//                                        KEY BINDINGS
//-----------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------
//                                        DATA BINDINGS
//-----------------------------------------------------------------------------------------------

CreateUpdatePassthrough.dataBinding             = REF_XPATH;

Header_EnforcementNumber.dataBinding            = ENFORCEMENT_XPATH + "/Number";
Header_EnforcementType.dataBinding              = ENFORCEMENT_XPATH + "/Type";
Header_ExecutingCourtCode.dataBinding             = BASE_XPATH + "/CourtCode";
Header_ExecutingCourtName.dataBinding             = Header_ExecutingCourtCode.dataBinding;
Lov_Court.dataBinding                           = Header_ExecutingCourtCode.dataBinding;
Header_UserCourtCode.dataBinding                = REF_XPATH + "/UserCourtCode";
Header_UserCourtName.dataBinding                = REF_XPATH + "/UserCourtName";
Lov_SearchResults.dataBinding                   = BASE_XPATH + "/SelectedEnforcement";

Parties_Grid.dataBinding                        = BASE_XPATH + "/SelectedParty";

Payment_PaymentDetails_Grid.dataBinding         = BASE_XPATH + "/SelectedPaymentDetail";

Payment_TransNo.dataBinding                     = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/TransactionNumber";
Payment_DateEntered.dataBinding                 = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/PaymentDate";
Payment_Amount.dataBinding                      = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Amount";
Payment_Amount_Currency.dataBinding             = DEFAULT_CURRENCY_XPATH;
Payment_PaidTo.dataBinding                      = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/RetentionType";
Payment_Error.dataBinding                       = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Error";

Add_Payment_Amount.dataBinding                  = NEW_PAYMENT_XPATH + "/Amount";
Add_Payment_Amount_Currency.dataBinding         = DEFAULT_CURRENCY_XPATH;
Add_Payment_PaidTo.dataBinding                  = NEW_PAYMENT_XPATH + "/Code";


//-----------------------------------------------------------------------------------------------
//                                        MAIN FORM
//-----------------------------------------------------------------------------------------------

CreateUpdatePassthrough.startupState = {mode: "blank"}

CreateUpdatePassthrough.refDataServices = [
  {name: "PassthroughRetentionTypes", dataBinding: REF_XPATH, serviceName: "getPassthroughRetentionTypes", serviceParams:[]},
  {name: "PaymentTypes", dataBinding: REF_XPATH, serviceName: "getPaymentTypes", serviceParams:[]},
  {name: "SystemDate", dataBinding: REF_XPATH, serviceName: "getSystemDate", serviceParams:[]},
  {name: "Courts", dataBinding: REF_XPATH, serviceName:"getCourtsShort", serviceParams:[]},
  {name: "CurrentCurrency", dataBinding: REF_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
  {name: "EnforcementTypes", dataBinding: REF_XPATH, fileName: "EnforcementTypes.xml"}
];

/**
 * @author tzzmr4
 * 
 */
CreateUpdatePassthrough.initialise = function()
{
  checkStartOfDay();
  
  DEFAULT_USER = Services.getCurrentUser();
  USER_OWNING_COURTCODE = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH, "111");

  var defaultCurrency = Services.getValue(REF_XPATH + "/CurrentCurrency/CurrencyCode");
  Services.setValue(DEFAULT_CURRENCY_XPATH, defaultCurrency);
  
  var enforcementNumber = Services.getValue(ENFORCE_NO_XPATH);
  var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
  var executingCourtCode = Services.getValue(ENFORCE_TYPE_XPATH);
  if(!CaseManUtils.isBlank(enforcementNumber) && !CaseManUtils.isBlank(enforcementType)) {
    Services.setValue(Header_EnforcementNumber.dataBinding, Services.getValue(ENFORCE_NO_XPATH));
    Services.setValue(Header_EnforcementType.dataBinding, Services.getValue(ENFORCE_TYPE_XPATH));
    Services.setValue(Header_ExecutingCourtCode.dataBinding, Services.getValue(EXECUTING_COURT_XPATH));
    getEnforcement();
  }
  else {
    Services.setFocus("Header_EnforcementNumber");
  }

}

CreateUpdatePassthrough.modifyLifeCycle = {
  serviceName: "getEnforcement",
  serviceParams: [
    {name: "enforcementNumber", value: ENFORCE_NO_XPATH},
    {name: "enforcementType", value: ENFORCE_TYPE_XPATH},
    {name: "issuingCourt", value: ISSUING_COURT_XPATH},
    {name: "owningCourt", value: OWNING_COURT_XPATH}
  ],
  dataBinding: PASSTHROUGH_XPATH,
  errorHandler: {
/**
 * @param e
 * @author tzzmr4
 * 
 */
    onError:  function(e)
            {
              alert("Error - Cannot connect to database.\n\n" + e);
              clearScreen();
            }
  }
};

//-----------------------------------------------------------------------------------------------
//                                        INPUTS
//-----------------------------------------------------------------------------------------------

Header_EnforcementNumber.transformToModel = trimTransform;
Header_EnforcementNumber.readOnlyOn = [FORM_STATE_XPATH];
Header_EnforcementNumber.isReadOnly = function() {return !inQueryMode();}
Header_EnforcementNumber.helpText = "Enter AE No, Home Warrant No, Foreign Warrant No, AO/CAEO No or Case No";
Header_EnforcementNumber.maxLength = 8;
Header_EnforcementNumber.tabIndex = 1;
Header_EnforcementNumber.isMandatory = function() {return true;}
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
Header_ExecutingCourtCode.readOnlyOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.isReadOnly = function()
{
  var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
  return !inQueryMode() || (enforcementType != "HOME WARRANT" && enforcementType != "FOREIGN WARRANT");
}
Header_ExecutingCourtCode.helpText = "Code of the court executing the warrant";
Header_ExecutingCourtCode.maxLength = 3;
Header_ExecutingCourtCode.tabIndex = 3;
Header_ExecutingCourtCode.mandatoryOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.isMandatory = function() {return !Header_ExecutingCourtCode.isReadOnly();}
Header_ExecutingCourtCode.logicOn = [Header_EnforcementType.dataBinding];
Header_ExecutingCourtCode.logic = function()
{
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT") {
		if(CaseManUtils.isBlank(Services.getValue(this.dataBinding)) && inQueryMode()) {
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
  Services.setValue(this.dataBinding, Services.getValue(EXECUTING_COURT_XPATH));
}
Header_ExecutingCourtCode.validateOn = [Header_ExecutingCourtCode.dataBinding];
Header_ExecutingCourtCode.validate = function()
{
  var value = Services.getValue(this.dataBinding);
  if(!CaseManUtils.isBlank(value) && !Services.exists(COURTS_XPATH + "/Court[Code = " + this.dataBinding + "]")) {
    return ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
  }
  return null;
}

Header_UserCourtCode.tabIndex = -1;
Header_UserCourtCode.isReadOnly = function() {return true;}
Header_UserCourtCode.helpText = "Code of the user's home court";
Header_UserCourtCode.setDefaultOn = [FORM_STATE_XPATH];
/**
 * @author tzzmr4
 * 
 */
Header_UserCourtCode.setDefault = function()
{
  Services.setValue(this.dataBinding, CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
}

Header_UserCourtName.tabIndex = -1;
Header_UserCourtName.isReadOnly = function() {return true;}
Header_UserCourtName.helpText = "Name of the user's home court";
Header_UserCourtName.setDefaultOn = [Header_UserCourtCode.dataBinding];
/**
 * @author tzzmr4
 * 
 */
Header_UserCourtName.setDefault = function()
{
  var xpath = COURTS_XPATH + "/Court[Code = " + Header_UserCourtCode.dataBinding + "]/Name";
  Services.setValue(this.dataBinding, Services.getValue(xpath));
}

Payment_TransNo.retrieveOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_TransNo.isReadOnly = function() {return true}
Payment_TransNo.helpText = "Transaction number for payment";
Payment_TransNo.maxLength = 10;
Payment_TransNo.tabIndex = -1;
Payment_TransNo.logicOn = [FORM_STATE_XPATH];
Payment_TransNo.logic = function()
{
  //**********************************************************************
  //LOGIC USED TO DO POST LIFECYCLE EVENT CHANGES...
  //**********************************************************************
  
  var lifecycle = Services.getValue(FORM_STATE_XPATH);
  if(lifecycle == "modify")
  {
    if(Services.exists(ENFORCEMENT_XPATH + "/Parties"))
    {     
      if(validateEnforcement())
      {        
        getPassthroughPayments();                       
        Services.setValue(BUSINESS_LIFECYCLE_COMPLETED_XPATH, "true");
      }
      else
      {
        Services.setValue(ABORT_LOAD_XPATH, "true");
      }
    }
    else
    {
      displayNoEnforcement();      
    }
  }
  else if(lifecycle == "blank") {
  		setTimeout('Services.setFocus("Header_EnforcementNumber")', 100);
  		if(Services.getValue(RELOAD_XPATH) == "true") {
  			Services.startTransaction();
  			Services.setValue(Header_EnforcementNumber.dataBinding, Services.getValue(ENFORCE_NO_XPATH));
			Services.setValue(Header_EnforcementType.dataBinding, Services.getValue(ENFORCE_TYPE_XPATH));
			Services.setValue(RELOAD_XPATH, null);
			Services.endTransaction();
			Header_SearchBtn.actionBinding();
		}
	}
  
}

Payment_DateEntered.retrieveOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_DateEntered.isReadOnly = function() {return true}
Payment_DateEntered.helpText = "Date entered of payment";
Payment_DateEntered.maxLength = 10;
Payment_DateEntered.tabIndex = -1;
//Payment_DateEntered.transformToDisplay = CaseManUtils.formatGridDate;
//Place holder for abort load
Payment_DateEntered.logicOn = [ABORT_LOAD_XPATH];
Payment_DateEntered.logic = function()
{
  if(Services.getValue(ABORT_LOAD_XPATH) == "true") {
    setTimeout("clearScreen()", 100);
  }
}

Payment_Amount_Currency.isReadOnly = function()
{
  return true;
}
Payment_Amount_Currency.tabIndex = -1;
Payment_Amount_Currency.maxLength = 3;
Payment_Amount_Currency.transformToDisplay = convertCurrencyToSymbol;

Payment_Amount.retrieveOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_Amount.isReadOnly = function() {return true}
//Payment_Amount.transformToDisplay = formatCurrency;
Payment_Amount.transformToModel = transformToCurrency;
Payment_Amount.transformToDisplay = transformToCurrency;
Payment_Amount.helpText = "Amount of payment";
Payment_Amount.maxLength = 10;
Payment_Amount.tabIndex = -1;

Payment_PaidTo.retrieveOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_PaidTo.isReadOnly = function() {return true}
Payment_PaidTo.helpText = "Payment paid to";
Payment_PaidTo.maxLength = 20;
Payment_PaidTo.tabIndex = -1;

Payment_Error.retrieveOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_Error.tabIndex = 60;
Payment_Error.modelValue = {checked: "Y", unchecked: "N"};
Payment_Error.helpText = "Mark payment in error";
Payment_Error.enableOn = [GET_PAYMENTS_XPATH];
Payment_Error.isEnabled = enablePayments;
Payment_Error.logicOn = [Payment_Error.dataBinding];
Payment_Error.logic = function(event)
{  
  if ( event.getXPath() != Payment_Error.dataBinding )
  {
    return;
  }
  
  // Cache original error node.
  var xpath = PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/OldError";
  if(CaseManUtils.isBlank(Services.getValue(xpath))) {
  	if(Services.getValue(this.dataBinding) == "Y") {
  		Services.setValue(xpath, "N");
  	}
  	else {
  		Services.setValue(xpath, "Y");
  	}
  }
  
  if(Services.getValue(xpath) != Services.getValue(this.dataBinding)) {
  	Services.setValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Changed", "true");
  }
  else {
  	Services.setValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Changed", "false");
  }
  
  // Stop un-erroring of payments that would result in an overpayment for COs and Home Warrant.
  if(Services.getValue(this.dataBinding) == "N" && validatePayment(false) == false) {
	Services.setValue(this.dataBinding, "Y");
	return;
  }
  
  //Fire off a dataBinding to allow the Save button to enable.
	setErrorIndFlag();
}

Add_Payment_Amount_Currency.isReadOnly = function()
{
  return true;
}
Add_Payment_Amount_Currency.tabIndex = -1;
Add_Payment_Amount_Currency.maxLength = 3;
Add_Payment_Amount_Currency.transformToDisplay = convertCurrencyToSymbol;


Add_Payment_Amount.isReadOnly = function() {return false}
Add_Payment_Amount.isMandatory = function() {return true;}
Add_Payment_Amount.helpText = "Amount to be paid";
Add_Payment_Amount.tabIndex = 80;
Add_Payment_Amount.maxLength = 11;
Add_Payment_Amount.transformToModel = trimTransformCurrency;
Add_Payment_Amount.logicOn = [Payment_Error.dataBinding];
Add_Payment_Amount.logic = function(event)
{
  if ( event.getXPath() != Add_Payment_Amount.dataBinding )
  {
    return;
  }
}
Add_Payment_Amount.validateOn = [Add_Payment_Amount.dataBinding,Add_Payment_PaidTo.dataBinding];
Add_Payment_Amount.validate = function()
{
  var value = Services.getValue(this.dataBinding);
  if(!CaseManUtils.isBlank(value))
  {
    var errorCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
    if(errorCode != null)
    {
      return errorCode;
    }
  
    if(value <= 0)
    {
      return ErrorCode.getErrorCode("CaseMan_paymentsInvalidAmount_Msg");
    }
    
    var rangeError = ErrorCode.getErrorCode("Caseman_paymentRangeError_Msg");
	var range = CaseManValidationHelper.validateValueInRange(value, 0.01, 99999999.99, rangeError);
	if(range != null) {
	  return rangeError;
	}
  }
  return null;
}
Add_Payment_Amount.isTemporary = function(){return true;}


//-----------------------------------------------------------------------------------------------
//                                        BUTTONS
//-----------------------------------------------------------------------------------------------

Court_LovBtn.enableOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Court_LovBtn.isEnabled = function() {return !Header_ExecutingCourtCode.isReadOnly();}
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
    keys: [{key: Key.F6, element: "CreateUpdatePassthrough"}]
  }
}

Header_SearchBtn.enableOn = [
  Header_EnforcementNumber.dataBinding,
  Header_EnforcementType.dataBinding,
  Header_ExecutingCourtCode.dataBinding,
  FORM_STATE_XPATH
];
Header_SearchBtn.isEnabled = function()
{
  if(!inQueryMode()) {
    return false;
  }
  var areParamsBlank =  CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) ||
                    CaseManUtils.isBlank(Services.getValue(Header_EnforcementType.dataBinding));
  if(Header_ExecutingCourtCode.isReadOnly() == false) {
    areParamsBlank = areParamsBlank || CaseManUtils.isBlank(Services.getValue(Header_ExecutingCourtCode.dataBinding));
  }

  if(areParamsBlank || Header_EnforcementNumber.validate() != null) {
    return false;
  }
  return true;
}
/**
 * @author tzzmr4
 * 
 */
Header_SearchBtn.actionBinding = function()
{
  var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
  switch(enforcementType) {
    case "CASE":      
      searchEnforcement();
      break;
    case "CO":
      searchCo();
      break;
    case "HOME WARRANT":
      searchHomeWarrant();            
      break;
    case "FOREIGN WARRANT":
      searchForeignWarrant();
      break;
    default:
      getEnforcement();
      break;
  }
}
Header_SearchBtn.tabIndex = 6;
Header_SearchBtn.additionalBindings = {
  eventBinding: {
    keys: [{key: Key.F1, element: "CreateUpdatePassthrough"}]
  }
}

Payment_AddPaymentBtn.tabIndex = 61;
Payment_AddPaymentBtn.enableOn = [FORM_STATE_XPATH,ENABLE_ADD,GET_PAYMENTS_XPATH];
Payment_AddPaymentBtn.isEnabled = function()
{
  if(CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)) || Services.countNodes(RETENTION_TYPES_XPATH + "/RetentionType") == 0)
  {
    return false;
  }
  return isAddEnabled();
}
/**
 * @author tzzmr4
 * 
 */
Payment_AddPaymentBtn.actionBinding = function()
{
  Services.startTransaction();
  Services.setValue(NEW_PAYMENT, "true");
  Services.endTransaction();
  //load blank payment.
  loadBlankPayment(); 
  Services.dispatchEvent("Add_Payment", PopupGUIAdaptor.EVENT_RAISE);
}
Payment_AddPaymentBtn.additionalBindings = {
 eventBinding: {
    keys: [{key: Key.F2, element: "CreateUpdatePassthrough"}]
  }
}

Add_Payment_OkBtn.enableOn = [Add_Payment_Amount.dataBinding, Add_Payment_PaidTo.dataBinding];
Add_Payment_OkBtn.isEnabled = function()
{
	var amount = Services.getValue(Add_Payment_Amount.dataBinding);
	var retention = Services.getValue(Add_Payment_PaidTo.dataBinding);
	if(CaseManUtils.isBlank(amount) || Add_Payment_Amount.validate() != null || CaseManUtils.isBlank(retention)) {
		return false;
	}
	return true;
}
Add_Payment_OkBtn.tabIndex = 82;
/**
 * @author tzzmr4
 * 
 */
Add_Payment_OkBtn.actionBinding = function()
{
  if(validatePayment(true))
  {
    //fill in the retention type
    var retType = Services.getValue(RETENTION_TYPES_XPATH + "/RetentionType[Code = " + Add_Payment_PaidTo.dataBinding + "]/Display");
    if(retType.length > 20) {
    	retType = retType.substring(0, 20);
    }
    Services.setValue(NEW_PAYMENT_XPATH + "/RetentionType", retType);
    
    //if CO add debt ses to dom for processing in UpdateCODebtCustomProcessor
    if(Services.getValue(Header_EnforcementType.dataBinding) == "CO")
    {     
      Services.setValue(NEW_PAYMENT_XPATH + "/DebtSeq",Services.getValue(Add_Payment_PaidTo.dataBinding));      
      //calulate the total remaining on the co
      var retTypes = Services.getNodes(RETENTION_TYPES_XPATH + "/RetentionType");	  
	  var coAmount = 0;
      for(var i = 0 ; i < retTypes.length ; i++)
      {       
        if(XML.getNodeTextContent(retTypes[i].selectSingleNode("/DebtStatus")) == "LIVE")
        {
          coAmount += XML.getNodeTextContent(retTypes[i].selectSingleNode("/DebtBalance")) * 1;
        }        
      }
      Services.setValue(NEW_PAYMENT_XPATH + "/DebtBalance", Services.getValue(RETENTION_TYPES_XPATH + "/RetentionType[Code = " + Add_Payment_PaidTo.dataBinding + "]/DebtBalance"));
    }
    
    if(saveChangesPrompt()) {
    	Services.setValue(ADD_PAYMENT_AFTER_UPDATE_XPATH, "true");
    	savePayment();
    }
    else {
    	resetPaymentChangedFlags();
    	if(validatePayment(true)) {
		    addPayment();
    	}
	}
    //#Services.removeNode(NEW_PAYMENT);
    //#Services.removeNode(NEW_PAYMENT_XPATH);
    //#Services.dispatchEvent("Add_Payment", PopupGUIAdaptor.EVENT_LOWER);
  }
}
Add_Payment_OkBtn.additionalBindings = {
 eventBinding: {
    keys: [{key: Key.F3, element: "Add_Payment"}]
  }
}

/**
 * @author tzzmr4
 * 
 */
Add_Payment_CancelBtn.actionBinding = function()
{
  Services.removeNode(NEW_PAYMENT);
  Services.removeNode(NEW_PAYMENT_XPATH);
  Services.dispatchEvent("Add_Payment", PopupGUIAdaptor.EVENT_LOWER);
}

Add_Payment_CancelBtn.additionalBindings = {
 eventBinding: {
    keys: [{key: Key.F4, element: "Add_Payment"}]
  }
}

Status_SaveBtn.enableOn = [
	GET_PAYMENTS_XPATH,
	ERROR_IND_XPATH,
	Payment_PaymentDetails_Grid.dataBinding
];
Status_SaveBtn.isEnabled = hasPaymentsChanged;
Status_SaveBtn.actionBinding = savePayment;
Status_SaveBtn.additionalBindings = {
  eventBinding: {
    keys: [{key: Key.F3, element: "CreateUpdatePassthrough"}]
  }
}

/**
 * @author tzzmr4
 * 
 */
Status_ClearBtn.actionBinding = function()
{
  if(saveChangesPrompt()) {
    savePayment();
  }
  clearScreen();
}
Status_ClearBtn.additionalBindings = {
  eventBinding: {
    keys: [{key: Key.CHAR_C, element: "CreateUpdatePassthrough", alt: true}]
  }
}

Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.additionalBindings = {
  eventBinding: {
    keys: [{key: Key.F4, element: "CreateUpdatePassthrough"}]
  }
}

//-----------------------------------------------------------------------------------------------
//                                        SELECTS
//-----------------------------------------------------------------------------------------------

Header_EnforcementType.srcData = REF_XPATH + "/EnforcementTypes";
Header_EnforcementType.rowXPath = "EnforcementType";
Header_EnforcementType.keyXPath = "Code";
Header_EnforcementType.displayXPath = "Code";
Header_EnforcementType.readOnlyOn = [FORM_STATE_XPATH];
Header_EnforcementType.isReadOnly = function() {return !inQueryMode();}
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
Header_ExecutingCourtName.helpText = "Court name of the court executing the warrant";
Header_ExecutingCourtName.readOnlyOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Header_ExecutingCourtName.isReadOnly = Header_ExecutingCourtCode.isReadOnly;
Header_ExecutingCourtName.tabIndex = 4;
Header_ExecutingCourtName.transformToDisplay = function(value)
{
  if(!Services.exists(COURTS_XPATH + "/Court[Code = " + this.dataBinding + "]")) {
    return "";
  }
  return value;
}
Header_ExecutingCourtName.transformToModel = trimTransform;

Add_Payment_PaidTo.srcData = RETENTION_TYPES_XPATH;
Add_Payment_PaidTo.srcDataOn = [FORM_STATE_XPATH];
Add_Payment_PaidTo.rowXPath = "RetentionType";
Add_Payment_PaidTo.keyXPath = "Code";
Add_Payment_PaidTo.displayXPath = "Display";
//Add_Payment_PaidTo.isReadOnly = function() {return true;}
Add_Payment_PaidTo.readOnlyOn = [NEW_PAYMENT,Add_Payment_Amount.dataBinding];
Add_Payment_PaidTo.isReadOnly = function()
{
  if(CaseManUtils.isBlank(Services.getValue(Add_Payment_Amount.dataBinding)))
  {
    return true;
  }
  return false;
}  
Add_Payment_PaidTo.isMandatory = function() {return true;}
Add_Payment_PaidTo.helpText = "Amount paid to";
Add_Payment_PaidTo.tabIndex = 81;
Add_Payment_PaidTo.isTemporary = function(){return true;}

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
Lov_Court.readOnlyOn = [FORM_STATE_XPATH, Header_EnforcementType.dataBinding];
Lov_Court.isReadOnly = Header_ExecutingCourtCode.isReadOnly;

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
    sort: function(a, b)
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
    var executingCourtCode = Services.getValue(xpath + "/ExecutingCourt");
    Services.setValue(ISSUING_COURT_XPATH, Services.getValue(xpath + "/IssuingCourt"));
    Services.setValue(OWNING_COURT_XPATH, Services.getValue(xpath + "/OwningCourt"));
    Services.setValue(EXECUTING_COURT_XPATH, executingCourtCode);
    
    if(!CaseManUtils.isBlank(enforcementNumber) && !CaseManUtils.isBlank(enforcementType)) {
      Services.startTransaction();
      Services.setValue(Header_EnforcementNumber.dataBinding, enforcementNumber);
      Services.setValue(Header_EnforcementType.dataBinding, enforcementType);
      Services.setValue(Header_ExecutingCourtCode.dataBinding, executingCourtCode);     
      Services.endTransaction();
      getEnforcement();
    }
  }
}

Parties_Grid.tabIndex = 20;
Parties_Grid.srcData = ENFORCEMENT_XPATH + "/Parties";
Parties_Grid.rowXPath = "Party[Role != 'SOLICITOR']";
Parties_Grid.keyXPath = "Name";
Parties_Grid.columns = [
  {xpath: "Role"},
  {xpath: "Number"},
  {xpath: "Name"}
];

Payment_PaymentDetails_Grid.tabIndex = 40;
Payment_PaymentDetails_Grid.srcDataOn = [Lov_SearchResults.dataBinding];
Payment_PaymentDetails_Grid.srcData = PAYMENT_XPATH;
Payment_PaymentDetails_Grid.rowXPath = "Payment";
Payment_PaymentDetails_Grid.keyXPath = "SurrogateId";
Payment_PaymentDetails_Grid.columns = [{xpath: "TransactionNumber"},
             {xpath: "PaymentDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
             {xpath: "AmountCurrency", transformToDisplay: function() { return "£"; }},
             {xpath: "Amount", transformToDisplay: transformToCurrency},
             {xpath: "RetentionType"}];
Payment_PaymentDetails_Grid.helpText = "Enforcement Payment Details";
Payment_PaymentDetails_Grid.logicOn = [Payment_PaymentDetails_Grid.dataBinding];
Payment_PaymentDetails_Grid.logic = function()
{
	//alert(Services.getValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + this.dataBinding + "]/SurrogateId"));
  Services.setValue(ENABLE_SAVE,!SAVE_PAYMENT);  
}

/**
 * -----------------------------------------------------------------------------------------------
 * HELPER FUNCTIONS
 * -----------------------------------------------------------------------------------------------
 * @author tzzmr4
 * 
 */
function showDOM()
{
  CaseManUtils.showDOM();
}

/**
 * @author tzzmr4
 * 
 */
exitScreenHandler.handleExit = function()
{
  exitScreen();
}

/**
 * @author tzzmr4
 * 
 */
function exitScreen()
{ 
  if(saveChangesPrompt()) {
  	Services.setValue(SCREEN_CLOSING_XPATH, "true");
    savePayment();
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
  setDirtyFlagFalse();
  if(Services.getValue(IS_NAVIGATING_XPATH) != "true") {
  	var reportType   = "PVER"; 
	var reportNumber = Services.getValue(REPORT_NUMBER);
    
    // set to 0 if Services.getValue(REPORT_NUMBER) is null
    if (null == reportNumber)
    {
    	reportNumber = "0";
	}
  	
	//Call the PVER (Passthrough Verification) report here
	if( (reportType == "PVER") && (reportNumber != "0") )
	{
		//set report data xpath
  	    setReportData(reportType, reportNumber);
  	    
  	    // Set businessProcessId to report ID.
  	    Services.setValue("/ds/var/app/businessProcessId", reportType + reportNumber);	
		
		//execute PVER (Pass-through verification Report) 
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
 * @param reportType
 * @param reportNumber
 * @author tzzmr4
 * 
 */
function setReportData(reportType, reportNumber)
{
			    		
	    //Enforcement court code removed, uses User court code set by default
	    //var courtCode	 = "367"; // Services.getValue(ENFORCEMENT_XPATH + "/CourtCode"); // <-- change this when it works
				
		//set report data xpath
		Services.setValue(REPORT_DATA_XPATH + "/ReportType", reportType);
		Services.setValue(REPORT_DATA_XPATH + "/ReportNumber", reportNumber);
		Services.setValue(REPORT_DATA_XPATH + "/EnforcementCourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH)); //Current user's code code
				
		//May be required to run PVER.
		Services.setValue(REPORT_DATA_XPATH + "/ReportDate", Services.getValue(SYSTEMDATE_XPATH));

		// Required to delete report data
        Services.setValue(REPORT_DATA_XPATH + "/UserID", Services.getCurrentUser()); 
		Services.setValue(REPORT_DATA_XPATH + "/CourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH) );  //Current user's code code

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
	Services.callService("produceCreatePaymentsReports", params, requestReport, true);
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
}

/**
 * @author tzzmr4
 * 
 */
function getEnforcement()
{
  populateFormPersistantData();
  //set dirty flag to false
  setDirtyFlagFalse();
  refreshScreen();
  
  Services.dispatchEvent("CreateUpdatePassthrough", BusinessLifeCycleEvents.EVENT_MODIFY, null);
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function enablePayments() 
{
  if(Services.getValue(Header_EnforcementType.dataBinding) == "CO" && Services.getValue(ENFORCEMENT_XPATH + "/COInfo") == "NOT LIVE")
  {
    return false;
  }  
  if(Services.countNodes(Payment_PaymentDetails_Grid.srcData + "/Payment") == 0)
  {
    return false;
  }  
  return true;
}
/**
 * @author tzzmr4
 * @return Services.getValue(FORM_STATE_XPATH) != "modify"  
 */
function inQueryMode()
{
  return Services.getValue(FORM_STATE_XPATH) != "modify";
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
  //Services.removeNode(COURT_CODE_XPATH);
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
	Services.removeNode(REPORT_NUMBER);
}

/**
 * @author tzzmr4
 * 
 */
function populateFormPersistantData()
{
  Services.startTransaction();
  Services.setValue(ENFORCE_NO_XPATH, Services.getValue(Header_EnforcementNumber.dataBinding));
  Services.setValue(ENFORCE_TYPE_XPATH, Services.getValue(Header_EnforcementType.dataBinding));
  Services.setValue(EXECUTING_COURT_XPATH, Services.getValue(Header_ExecutingCourtCode.dataBinding));
  //Services.setValue(ISSUING_COURT_XPATH, null);
  //Services.setValue(OWNING_COURT_XPATH, null)
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
  Services.startTransaction();
  Services.removeNode(ENFORCEMENT_XPATH);
  Services.endTransaction();
  setDirtyFlagFalse();
  Services.dispatchEvent("CreateUpdatePassthrough", BusinessLifeCycleEvents.EVENT_CLEAR, null);
}
/**
 * @author tzzmr4
 * 
 */
function refreshScreen()
{
  Services.startTransaction();
  Services.removeNode(ENFORCEMENT_XPATH);
  Services.endTransaction();
  setDirtyFlagFalse();
  Services.dispatchEvent("CreateUpdatePassthrough", BusinessLifeCycleEvents.EVENT_CLEAR, null);
}

/**
 * @param value
 * @author tzzmr4
 * @return "£" + value , ""  
 */
function formatCurrency(value)
{
  if(!CaseManUtils.isBlank(value))
  { 
    return "£" + value;
  }
  else
  {
    return "";
  }
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
function preNavigateSetup()
{
  var navArray = new Array(Services.getValue(PAYMENT_TYPE_XPATH));
  NavigationController.createCallStack(navArray);
  if(saveChangesPrompt())
  {
    savePayment();
  }
  setDirtyFlagFalse();
}


/**
 * @param source
 * @param destination
 * @author tzzmr4
 * 
 */
function copyNodes(source, destination)
{
  if(Services.exists(destination))
  {
    Services.removeNode(destination);
  }
  var noNodes = Services.countNodes(source);
  var nodes = Services.getNodes(source);
  for(i = 0; i < noNodes; ++i)
  {
    Services.addNode(nodes[i], destination);
  }
}

/**
 * @author tzzmr4
 * 
 */
function setErrorIndFlag()
{
	// Make sure the value changes so it fires databindings, actual value not important.
	if(Services.getValue(ERROR_IND_XPATH) == "true") {
		Services.setValue(ERROR_IND_XPATH, "false");
	}
	else {
		Services.setValue(ERROR_IND_XPATH, "true");
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
 * @return boolean 
 */
function validateEnforcement()
{
  var enforcementNumber = Services.getValue(ENFORCE_NO_XPATH);
  var enforcementType = Services.getValue(ENFORCE_TYPE_XPATH);
 
  // Node value is CO # for Warrant or CO Status for a CO.
	var coInfo = Services.getValue(ENFORCEMENT_XPATH + "/COInfo");
	var moneyInCourt = Services.getValue(ENFORCEMENT_XPATH + "/MoneyInCourt");

    switch(enforcementType)
    {
      case "AE":
        if(Services.getValue(ENFORCEMENT_XPATH + "/NumberEvents") > 0)
        {
          // CaseMan Defect 6432 - was previously an error message, now is warning
          alert(Messages.CAP_INPUT_PRODUCED);
        }
        break;   
      case "FOREIGN WARRANT":       
        break;
      case "HOME WARRANT":
        if(!CaseManUtils.isBlank(coInfo) && coInfo != 0 && Services.getValue(ENFORCEMENT_XPATH + "/COType") == "AO") {
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
		break;
      case "CO":
        if(!CaseManUtils.isBlank(coInfo) && coInfo != 0 && coInfo != "LIVE") // || coInfo == "DEBTRPAYNG")) -- CASEMAN Defect 6179
        {          
          alert(ErrorCode.getErrorCode("CaseMan_paymentCOStatusNotLive_Msg").getMessage());
          Services.setValue(ENABLE_ADD, "false");
        }
		else if ( !CaseManUtils.isBlank(moneyInCourt) && moneyInCourt == "true" )
		{
			alert(Messages.PTHROUGH_CO_MONEY_IN_COURT_MESSAGE);
			return false;
		}
        break;
      case "CASE":        
        var status = Services.getValue(ENFORCEMENT_XPATH + "/CaseStatus");
        if(!CaseManUtils.isBlank(status))
        {
          //check status of case for either PAID or TRANSFERRRED and display error.          
          if(status == "PAID" || status == "TRANSFERRED")
          {
            alert(ErrorCode.getErrorCode("CaseMan_paymentCasePaidTransferred_Msg").getMessage());
            Services.setValue(ENABLE_ADD, "false");
          }
          //display the status of the case in status bar.
          Services.setTransientStatusBarMessage("Case has been " + status);
          //alert("Case has been " + status);
        }                
        break;
    }
//  }

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
  var adaptor = Services.getAdaptorById("CreateUpdatePassthrough");
  adaptor._setDirty(false);
  adaptor.update();
}

/**
 * @author tzzmr4
 * @return confirm(Messages.DETSLOST_MESSAGE) , boolean 
 */
function saveChangesPrompt()
{  
  if(hasPaymentsChanged())
  {
    return confirm(Messages.DETSLOST_MESSAGE);
  }
  return false;
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function hasPaymentsChanged()
{
  if(Services.countNodes(PAYMENT_XPATH + "/Payment[Changed = 'true']") > 0)
  {
    return true;
  }
  return false;
}

/**
 * @author tzzmr4
 * 
 */
function savePayment()
{
  updatePayments();
  //Services.dispatchEvent("CreateUpdatePassthrough", BusinessLifeCycleEvents.EVENT_SUBMIT, null);
}

/**
 * @author tzzmr4
 * 
 */
function addPayment()
{     
  //refresh report number
  if(!CaseManUtils.isBlank(Services.getValue(REPORT_NUMBER)))
  {
    Services.setValue(NEW_PAYMENT_XPATH + "/ReportNumber", Services.getValue(REPORT_NUMBER));
  }
  else
  {
    Services.setValue(NEW_PAYMENT_XPATH + "/ReportNumber", "0");
  }
  // add payment
  var dom = XML.createDOM(null, null, null);
  dom.appendChild(Services.getNode(NEW_PAYMENT_XPATH));
  var params = new ServiceParams();
  params.addDOMParameter("payment", dom);
  Services.callService("createPayment", params, addPayment, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
addPayment.onSuccess = function(dom)
{
  //alert(dom.xml);  
  if(dom != null)
  {
    var results = dom.selectSingleNode("/Payment/VerificationReportID");
    if(results != null)
    {      
      var reportID = XML.getNodeTextContent(dom.selectSingleNode("/Payment/VerificationReportID"));
      var reportNo = reportID.substring(4,reportID.length);
      Services.setValue(REPORT_NUMBER,reportNo);
      //alert("REPORT NUMBER = " + Services.getValue(REPORT_NUMBER));
      
      //alert("GETENF");
      //#getEnforcement();
            
      var transNo = XML.getNodeTextContent(dom.selectSingleNode("/Payment/TransactionNumber"));
      alert("Transaction number " + transNo + " has been assigned to this passthrough.");
      Services.dispatchEvent("Add_Payment", PopupGUIAdaptor.EVENT_LOWER);
      clearScreen();
    }
    else {
      this.onError();
    }
  }
  else
  {
    this.onError();
  }
}
/**
 * @param e
 * @author tzzmr4
 * 
 */
addPayment.onError = function(e)
{
  //alert("addPayment.onError");
  alert(Messages.ERROR_SAVING_PAYMENT + "\n\n" + e);
}

/**
 * Call this function to get the next generated surrogate key
 * @author tzzmr4
 * @return "S" + (++nextSurrogateKey)  
 */
function getNextSurrogateKey()
{
  return "S" + (++nextSurrogateKey);
}
/**
 * @author tzzmr4
 * 
 */
function getPassthroughPayments()
{
  //get the payment details for enforcement
  if(!CaseManUtils.isBlank(Services.getValue(Header_EnforcementNumber.dataBinding)))
  {
    var params = new ServiceParams();
    params.addSimpleParameter(
      "enforcementNumber",
      CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementNumber.dataBinding))
    );
    params.addSimpleParameter(
      "enforcementType",
      CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementType.dataBinding))
    );
   
    var courtCode = Services.getValue(ENFORCEMENT_XPATH + "/CourtCode");
    if(Services.getValue(Header_EnforcementType.dataBinding) == "HOME WARRANT") {
      courtCode = Services.getValue(ISSUING_COURT_XPATH);
    }
    
    params.addSimpleParameter(
      "enforcementCourt",
      CaseManUtils.getValidNodeValue(courtCode)
    );
    
    Services.callService("getPassthroughPaymentsWithDebts", params, getPassthroughPayments, true);
  }

}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
getPassthroughPayments.onSuccess = function(dom)
{
  if(dom != null)
  {
    var results = dom.selectSingleNode("/Payments");
    if(results != null)
    {
      if(Services.getValue(Header_EnforcementType.dataBinding) == "CO")
      {
        //alert("getPassthroughPayments.onSuccess 1");          
        //getCOCreditors();
        var retTypes = dom.selectSingleNode("/Payments/RetentionTypes");
        if(retTypes != null)
        {
          Services.replaceNode(Add_Payment_PaidTo.srcData, retTypes);
        }
      }
      else
      {
        Services.replaceNode(Add_Payment_PaidTo.srcData, Services.getNode(REF_XPATH + "/RetentionTypes")); 
      }
      //take out any co debts used for ref data in Add_Payment_PaidTo.srcData
      Services.replaceNode(PAYMENT_XPATH, results);
      Services.removeNode(PAYMENT_XPATH + "/RetentionTypes");
      //alert(Services.getValue(Header_EnforcementType.dataBinding));
      //Services.removeNode(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Changed");
      Services.setValue(GET_PAYMENTS_XPATH,!GET_PAYMENTS);
    }
    else {
      this.onError();
    }
  }
  else
  {
    this.onError();
  }
}
/**
 * @author tzzmr4
 * 
 */
getPassthroughPayments.onError = function()
{
  //alert("getPassthroughPayments.onError");
  alert(Messages.ERROR_PERFORMING_SEARCH);
}

/**
 * @author tzzmr4
 * 
 */
function getCOCreditors()
{
  //alert("getCOCreditors = " + Services.getValue(Header_EnforcementNumber.dataBinding));
  var params = new ServiceParams();
  params.addSimpleParameter(
    "coNumber",
    CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementNumber.dataBinding))
  );        
  Services.callService("getCoDebtList", params, getCOCreditors, true);

}

/**
 * @param dom
 * @author tzzmr4
 * 
 */
getCOCreditors.onSuccess = function(dom)
{ 
  //alert("getCOCreditors.onSuccess");
  //alert(dom.xml);
  if(dom != null)
  {
    var results = dom.selectSingleNode(PASSTHROUGH_XPATH + "/MaintainCO");
    //alert("dklfnl");
    var parties = dom.selectNodes(PASSTHROUGH_XPATH + "/MaintainCO/Debts/Debt");
    //alert(parties.length);
    //Services.replaceNode(CO_CREDITORS_XPATH, results);
   
    //var parties = Services.getNodes(DEBTS_XPATH + "/Debt");
    if(Services.exists(Add_Payment_PaidTo.srcData))
    {     
      Services.removeNode(Add_Payment_PaidTo.srcData);
    }   
    for(var i = 0 ; i < parties.length ; i++)
    {
      Services.setValue(PASSTHROUGH_XPATH + "/Temp/RetentionType/Display", XML.getNodeTextContent(parties[i].selectSingleNode("/Creditor/Name")));
      Services.setValue(PASSTHROUGH_XPATH + "/Temp/RetentionType/Code", XML.getNodeTextContent(parties[i].selectSingleNode("/DebtSeq")));
  
      Services.addNode(Services.getNode(PASSTHROUGH_XPATH + "/Temp/RetentionType"), RETENTION_TYPES_XPATH);
      Services.removeNode(PASSTHROUGH_XPATH + "/Temp/RetentionType"); 
    }    
  }
  else
  {
    this.onError();
  }
}

/**
 * @author tzzmr4
 * 
 */
getCOCreditors.onError = function()
{
  alert(Messages.ERROR_PERFORMING_SEARCH);
}

/**
 * @author tzzmr4
 * 
 */
function searchEnforcement()
{
  var params = new ServiceParams();
  params.addSimpleParameter(
    "caseNumber",
    CaseManUtils.getValidNodeValue(Services.getValue(Header_EnforcementNumber.dataBinding))
  );
  Services.callService("searchEnforcements", params, searchEnforcement, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
searchEnforcement.onSuccess = function(dom)
{ 
  if(dom != null)
  {
    var results = dom.selectSingleNode("/SearchResults");
    if(results != null)
    {
      Services.replaceNode(SEARCH_RESULTS_XPATH, results);       
      var noEnforcements = Services.countNodes(SEARCH_RESULTS_XPATH + "/Enforcement");
      if(noEnforcements > 1)
      {
        Services.dispatchEvent("Lov_SearchResults", PopupGUIAdaptor.EVENT_RAISE);        
      }
      else if(noEnforcements == 1) {
      	var enforceNumber = Services.getValue(SEARCH_RESULTS_XPATH + "/Enforcement/Number");
		Services.setValue(Lov_SearchResults.dataBinding, enforceNumber);
      }
      else
      {
        //getEnforcement();       
        displayNoEnforcement();
      }
    }
    else
    {
      this.onError();
    }
  }
  else
  {
    this.onError();
  }
}
/**
 * @author tzzmr4
 * 
 */
searchEnforcement.onError = function()
{
  //alert("searchEnforcement.onError");
  alert(Messages.ERROR_PERFORMING_SEARCH);
}
/**
 * @author tzzmr4
 * 
 */
function searchHomeWarrant()
{
  var params = new ServiceParams();
  params.addSimpleParameter("warrantNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
  params.addSimpleParameter("executingCourt", Services.getValue(Header_ExecutingCourtCode.dataBinding));
  Services.callService("searchHomeWarrants", params, searchEnforcement, true);
}
/**
 * @author tzzmr4
 * 
 */
function searchForeignWarrant()
{
  var params = new ServiceParams();
  params.addSimpleParameter("localWarrantNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
  params.addSimpleParameter("executingCourt", Services.getValue(Header_ExecutingCourtCode.dataBinding));
  Services.callService("searchForeignWarrants", params, searchEnforcement, true);
}
/**
 * @author tzzmr4
 * 
 */
function searchCo()
{
  var params = new ServiceParams();
  params.addSimpleParameter("coNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
  Services.callService("searchCos", params, searchEnforcement, true);
}

/**
 * @author tzzmr4
 * 
 */
function displayNoEnforcement()
{
/*  var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
  alert("displayNoEnforcement - " + enforcementType);
  switch(enforcementType)
  {
    case "AE":      
      alert(ErrorCode.getErrorCode("CaseMan_paymentNoEnforcementAE_Msg").getMessage());
      break;   
    case "FOREIGN WARRANT":      
      alert(ErrorCode.getErrorCode("CaseMan_paymentNoEnforcementForeignWarrant_Msg").getMessage());;      
      break;
    case "HOME WARRANT":      
      alert(ErrorCode.getErrorCode("CaseMan_paymentNoEnforcementHomeWarrant_Msg").getMessage());
      break;
    case "CO":      
      alert(ErrorCode.getErrorCode("CaseMan_paymentNoEnforcementCO_Msg").getMessage());
      break;
    case "CASE":      
      alert(ErrorCode.getErrorCode("CaseMan_paymentNoEnforcementCase_Msg").getMessage());           
      break;
  }
*/
  alert(Messages.NO_ENFORCEMENTS_FOUND);
  Services.setValue(ABORT_LOAD_XPATH, "true");
}

/**
 * @param isNewPayment
 * @author tzzmr4
 * @return boolean 
 */
function validatePayment(isNewPayment)
{
	var amount = getCurrentPaymentAmount(isNewPayment);

	// Disallow negative or zero amount payments.
	if(amount <= 0) return false;

	// Case overpayments are okay.
	var enforcementType = Services.getValue(Header_EnforcementType.dataBinding);
	if(enforcementType == "CASE") return true;
	
	// Non-execution warrant overpayments are okay.
	var warrantType = Services.getValue(ENFORCEMENT_XPATH + "/WarrantType");
	var isWarrant = enforcementType == "HOME WARRANT" || enforcementType == "FOREIGN WARRANT";
	if(isWarrant && warrantType != "EXECUTION" && warrantType != "CONTROL") return true;
	
	// Disallow all other overpayments.
	var debtBalance = null;
	var changedPaymentsXPath = null;
	
	// Get current outstanding balance as was at the start of the screen session.
	if(enforcementType == "CO") {
		var debtCode = getCurrentPaymentDebtCode(isNewPayment);
		debtBalance = Services.getValue(RETENTION_TYPES_XPATH + "/RetentionType[./Code = '" + debtCode + "']/DebtBalance") * 1;
		changedPaymentsXPath = PAYMENT_XPATH + "/Payment[Changed = 'true' and DebtSeq = '" + debtCode + "']";
	}
	else {
		debtBalance = Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance") * 1;
		changedPaymentsXPath = PAYMENT_XPATH + "/Payment[Changed = 'true']";
	}
	
	// Adjust debt balance by the amounts of the payments modified in this screen session.
	var numberNodes = Services.countNodes(changedPaymentsXPath);
	for(i = 0; i < numberNodes; ++i) {
		var error = Services.getValue(changedPaymentsXPath + "[" + (i + 1) + "]/Error");
		var paymentAmount = Services.getValue(changedPaymentsXPath + "[" + (i + 1) + "]/Amount") * 1;
		if(error == "Y") {
			debtBalance += paymentAmount;
		}
		else {
			debtBalance -= paymentAmount;
		}
	}
    
    // Adjust by amount of potential new payment if applicable.
	if(isNewPayment) {
		debtBalance -= amount;
	}

	// Check for overpayment.
	if(!CaseManUtils.isBlank(amount) && !CaseManUtils.isBlank(debtBalance) && debtBalance < 0) {
		alert("Current outstanding balance is £" + transformToCurrency(debtBalance + amount));
		return false;
	}

	return true;
}

/**
 * @param isNewPayment
 * @author tzzmr4
 * @return Services.getValue(Add_Payment_Amount.dataBinding) * 1 , Services.getValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Amount") * 1  
 */
function getCurrentPaymentAmount(isNewPayment)
{
 	if(isNewPayment) {
		return Services.getValue(Add_Payment_Amount.dataBinding) * 1;
	}

	return Services.getValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/Amount") * 1;
}

/**
 * @param isNewPayment
 * @author tzzmr4
 * @return Services.getValue(Add_Payment_PaidTo.dataBinding) , Services.getValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/DebtSeq")  
 */
function getCurrentPaymentDebtCode(isNewPayment)
{
 	if(isNewPayment) {
		return Services.getValue(Add_Payment_PaidTo.dataBinding);
	}

	return Services.getValue(PAYMENT_XPATH + "/Payment[SurrogateId = " + Payment_PaymentDetails_Grid.dataBinding + "]/DebtSeq");
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function isAddEnabled()
{
  if(!CaseManUtils.isBlank(Services.getValue(ENABLE_ADD)) && Services.getValue(ENABLE_ADD) == "false")
  {
    return false;
  }
  return true;
}

/**
 * @author tzzmr4
 * @return boolean 
 */
function isSaveEnabled()
{
  if(Services.exists(PAYMENT_XPATH) && Services.countNodes(PAYMENT_XPATH + "/Payment"))
  {
    return true;
  }
  return false;
}

/**
 * @author tzzmr4
 * 
 */
function loadBlankPayment()
{
  var node = Services.loadDOMFromURL("NewPayment.xml");
  node.selectSingleNode("/Payment");
  Services.addNode(node, BASE_XPATH + "/NewPayment");
  setDefaultPaymentValues();
}

/**
 * @author tzzmr4
 * 
 */
function setDefaultPaymentValues()
{
  Services.setValue(NEW_PAYMENT_XPATH + "/SurrogateId", getNextSurrogateKey());  
  Services.setValue(NEW_PAYMENT_XPATH + "/Passthrough", "Y");
  Services.setValue(NEW_PAYMENT_XPATH + "/CounterPayment", "N");
  Services.setValue(NEW_PAYMENT_XPATH + "/CreatedBy", DEFAULT_USER);
  Services.setValue(NEW_PAYMENT_XPATH + "/BailiffKnowledge", "N");
  Services.setValue(NEW_PAYMENT_XPATH + "/AmountCurrency", Services.getValue(DEFAULT_CURRENCY_XPATH) );
  Services.setValue(NEW_PAYMENT_XPATH + "/PaymentDate", Services.getValue(SYSTEMDATE_XPATH));
  Services.setValue(NEW_PAYMENT_XPATH + "/EnforcementNumber", Services.getValue(Header_EnforcementNumber.dataBinding));
  Services.setValue(NEW_PAYMENT_XPATH + "/EnforcementType", Services.getValue(Header_EnforcementType.dataBinding));
  Services.setValue(NEW_PAYMENT_XPATH + "/IssuingCourt", USER_OWNING_COURTCODE);
  Services.setValue(NEW_PAYMENT_XPATH + "/AdminCourt", USER_OWNING_COURTCODE);
  Services.setValue(NEW_PAYMENT_XPATH + "/Error", "N");
  
  Services.setValue(NEW_PAYMENT_XPATH + "/EnforcementCourt", Services.getValue(ENFORCEMENT_XPATH + "/CourtCode")); 
  //THIS IS SPECIFIC TO WARRANTS AND NEEDS CHANGING TO THE ISSING COURT ON THE WARRANT/CASE.
  if(Services.getValue(Header_EnforcementType.dataBinding) == "HOME WARRANT") {
    Services.setValue(NEW_PAYMENT_XPATH + "/EnforcementCourt", Services.getValue(ISSUING_COURT_XPATH));
  }

  // ADD RETENTION TYPE ON ADD CLICK EVENT FROM Add_Payment_PaidTo.dataBinding
  // Services.setValue(NEW_PAYMENT_XPATH + "/RetentionType", );
  Services.setValue(NEW_PAYMENT_XPATH + "/PayoutDate", Services.getValue(SYSTEMDATE_XPATH));
  
  //CO SPECIFIC - SET THE AMOUNT LEFT ON CO NEEDED TO FIRE EVENT WHEN PAID IN FULL
  if(Services.getValue(Header_EnforcementType.dataBinding) == "CO")
  { 
    Services.setValue(NEW_PAYMENT_XPATH + "/AmountNowDue", Services.getValue(ENFORCEMENT_XPATH + "/OutstandingBalance"));
  }
  //REPORT SPECIFIC DATA.
  Services.setValue(NEW_PAYMENT_XPATH + "/ReportType", "PVER");
  //Services.setValue(NEW_PAYMENT_XPATH + "/ReportID", "");


    // ........start code insert for TRAC 707
    var enforcementParent = "";
	var caseNumber = Services.getValue(ENFORCEMENT_XPATH + "/CaseNumber");
	var coInfo = Services.getValue(ENFORCEMENT_XPATH + "/COInfo");
	switch ( Services.getValue(Header_EnforcementType.dataBinding) ) {
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
	Services.setValue(NEW_PAYMENT_XPATH + "/EnforcementParent", enforcementParent);
    // ...........end code insert for TRAC 707
}

/**
 * @author tzzmr4
 * 
 */
function updatePayments()
{
  //Remove all payments that have not been amended...
  Services.removeNode(PAYMENT_XPATH + "/Payment[not(./Changed = 'true')]");
  
  Services.setValue(PAYMENT_XPATH + "/ReportData/SystemDate", Services.getValue(SYSTEMDATE_XPATH));
  
  // Set parameters for updating warrant returns if neccessary.
  var noPayments = Services.countNodes(PAYMENT_XPATH + "/Payment");
  for(i = 0; i < noPayments; ++i) {
  	  Services.setValue(PAYMENT_XPATH + "/Payment[" + (i + 1) + "]/OldAmount", Services.getValue(PAYMENT_XPATH + "/Payment[" + (i + 1) + "]/Amount"));
  	  Services.setValue(PAYMENT_XPATH + "/Payment[" + (i + 1) + "]/ReportType", "PVER");
	  if(!CaseManUtils.isBlank(Services.getValue(REPORT_NUMBER)))
	  {
	    Services.setValue(PAYMENT_XPATH + "/Payment[" + (i + 1) + "]/ReportNumber", Services.getValue(REPORT_NUMBER));
	  }
	  else
	  {
	    Services.setValue(PAYMENT_XPATH + "/Payment[" + (i + 1) + "]/ReportNumber", "0");
	  }
  }
  
  //update the error indicator
  var dom = XML.createDOM(null, null, null);
  //    dom.appendChild(Services.getNode(BASE_XPATH + "/temp/Payments"));
  dom.appendChild(Services.getNode(PAYMENT_XPATH));    
  var params = new ServiceParams();
  params.addDOMParameter("payments", dom);
  //alert(dom.xml);
  Services.callService("updatePassthroughPayments", params, updatePayments, true);
}
/**
 * @param dom
 * @author tzzmr4
 * 
 */
updatePayments.onSuccess = function(dom)
{
//  alert(dom.xml); 
  if(dom != null)
  {
    var results = dom.selectSingleNode("/ReportData/ReportNumber");
    if(results != null)
    {      
//	  alert(XML.getNodeTextContent(dom.selectSingleNode("/Payment/ReportID")));
//      var reportNo = reportID.substring(4,reportID.length);
      Services.setValue(REPORT_NUMBER,XML.getNodeTextContent(results));
//      alert(reportID);
//      alert(XML.getNodeTextContent(dom.selectSingleNode("ReportData/ReportNumber")));
      //#getEnforcement();
      if(Services.getValue(ADD_PAYMENT_AFTER_UPDATE_XPATH) != "true") {
	      	if(Services.getValue(SCREEN_CLOSING_XPATH) == "true") {
				performScreenCleanup();
			}
			else {
				clearScreen();
			}
	  }
	  else {
	  	addPayment();
	  }
    }
    else {
      this.onError();
    }
  }
  else
  {
    this.onError();
  }

}
/**
 * @param e
 * @author tzzmr4
 * 
 */
updatePayments.onError = function(e)
{
 alert(Messages.ERROR_SAVING_PAYMENT + "\n\n" + e);
}

/**
 * @author tzzmr4
 * 
 */
function executeExit()
{
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
function setNavigationController()
{
  var navigationArray = new Array(NavigationController.CREATE_UPDATE_PASSTHROUGH_FORM);
  if(NavigationController.callStackExists()){
    NavigationController.addToStack(navigationArray);
  }
  else{
    NavigationController.createCallStack(navigationArray);
  }
}

/**
 * @author tzzmr4
 * 
 */
function checkStartOfDay()
{
	// If Enforcement # is present then don't perform database updates.
	if(Services.getValue(IS_NAVIGATING_XPATH) != "true") {
	  var params = new ServiceParams();
	  params.addSimpleParameter("runDate", StartOfDayUtils.SUITORS_CASH_START_OF_DAY);
	  params.addSimpleParameter("systemDate", getSystemDate().replace(new RegExp(/-/g), ""));
	  params.addSimpleParameter("adminCourtCode", CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH));
	  Services.callService("getRunStartOfDayStatus", params, checkStartOfDay, true);
	}
	else {
		Services.setValue(IS_NAVIGATING_XPATH, "false");
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
    var node = dom.selectSingleNode("//StartOfDay");
    if(node == null) {
      setNavigationController();
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
 * @author tzzmr4
 * 
 */
checkStartOfDay.onError = function()
{
  alert(Messages.START_OF_DAY_CHECK_ERROR);
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
  //alert(dom.xml);
  if(dom != null) {
    var node = dom.selectSingleNode("//EndOfDay");
    if(node != null) {
      alert(Messages.END_OF_DAY_RAN_ERROR);
      executeExit();
    }
    else {
    	populateReportData("PVER");
		insertReportData();
    }
  }
  else {
    this.onError();
  }
}
/**
 * @author tzzmr4
 * 
 */
checkEndOfDay.onError = function()
{
  alert(Messages.END_OF_DAY_CHECK_ERROR);
  executeExit();
}

/**
 * @author tzzmr4
 * 
 */
function resetPaymentChangedFlags()
{
	var xpath = PAYMENT_XPATH + "/Payment[Changed = 'true']";
	var numberNodes = Services.countNodes(xpath);
	for(i = 0; i < numberNodes; ++i) {
		var oldError = Services.getValue(xpath + "[1]/OldError");
		Services.setValue(xpath + "[1]/Error", oldError);
		Services.setValue(xpath + "[1]/Changed", "false");
	}
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
}
