/** 
 * @fileoverview AddDebt_SubForm.js:
 * This file contains the configurations for the Add Debt Subform used 
 * on the Maintain Debt screen
 *
 * @author Tim Connor
 * Changed and amended MGG 07/12/05
 * author made changes to change to sub form. Unfortunately a lot of functionality changes were made - why???
 * Hopefully found them all.
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Added missing keyBindings including F6 on the fields associated with 
 *				LOV buttons and F4 on the cancel button.
 * 14/06/2006 - Chris Vincent: on text fields with no special validation updated transform to model to remove
 *				trailing and leading whitespace, particularly important on mandatory text fields where a blank
 *				space can be entered which can cause the screen to crash.
 *				Email address is no longer converted to upper case to match other screens.
 * 11/07/2006 - Kevin Gichohi (EDS) - Changed error message from "Flag to identify if Payee is to received dividend"
 *				to "Flag to identify if Payee is to receive dividend".
 * 13/07/2006 - Mark Groen, removed the Coded Party LOV popup and replaced it with the new
 * 				Coded Party Search Subform.  The mechanism in which the Solicitor Code field logic
 * 				works has also changed as it must perform an existance check because the reference
 * 				data is no longer loaded into the screen.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 24/11/2006 - Chris Vincent, gave a tab index to the Creditor/Payee Tab Selector COAddDebtTabSelector and 
 * 				had to update the other tab indexes to ensure the indexes were unique and in the correct order.
 * 				Also gave the grid on the Add Creditor From Case popup so focus is correctly set on entering
 * 				the popup.  UCT Defect 761.
 * 15/02/2010 - Mark Groen, a new debt status should default to LIVE and not PENDING. TRAC 2209
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.
 */

/*****************************************************************************************************************
 										FORM CONFIGURATIONS
*****************************************************************************************************************/

function addDebtSubform() {}

/**
 * @author fzj0yl
 * 
 */
addDebtSubform.initialise = function()
{
    Services.startTransaction();
    
    Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);
    
    var defaultCurrency = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
    
	// Set the correct tab to be displayed
	Services.setValue(COAddDebtTabSelector.dataBinding, "TabAddDebtCreditor");
	
	// set the status droplist to pending
	// TRAC 2209 set default to live rather than pending
	Services.setValue(AddDebt_Status.dataBinding, MaintainCOVariables.STATUS_LIVE);

	// set other default values
	Services.setValue(AddDebt_AmountAllowedCurrency.dataBinding, defaultCurrency);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAmountOriginalCurrency", defaultCurrency);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PassthroughsCurrency", defaultCurrency);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DividendsCurrency", defaultCurrency);
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/BalanceCurrency", defaultCurrency);
	
	Services.endTransaction();
}

addDebtSubform.createLifeCycle =
{
    eventBinding: {
        keys: [],
        singleClicks: [],
        doubleClicks: []
    },
    fileName: "NewDebt.xml",
    dataBinding: "/ds"
}

addDebtSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddDebt_OKBtn"} ],
                    doubleClicks: []
                  },
	create : {},
	returnSourceNodes: [MaintainCOVariables.SUBFORM_DEBT_XPATH],
/**
 * @author fzj0yl
 * 
 */
	preProcess: function() {
	    setAddressCreatedBy();
	},
	postSubmitAction: {
		close: {}
	}
}

addDebtSubform.cancelLifeCycle = {

	/*eventBinding: {	keys: [],
					singleClicks: [ { element: "AddDebt_CancelBtn"} ],
					doubleClicks: []
				  },
 */
	raiseWarningIfDOMDirty: false
}

/******************************* SUBFORMS ******************************************/
/************************* CODED PARTY SEARCH SUBFORM ******************************/

function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";

/**
 * @author fzj0yl
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var owningCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, owningCourtCode);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: "/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode" }
];

/**
 * @author fzj0yl
 * 
 */
codedPartySearch_subform.processReturnedData = function() 
{
	var partyCode = Services.getValue("/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	var flag = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/tmp/flagLOVSelected");
	if(partyCode != null && partyCode != ""){
		if(flag != null && flag == "cred"){
			Services.setValue(AddDebt_CreditorCode.dataBinding, partyCode);
		}
		else if(flag != null && flag == "pay"){
			Services.setValue(AddDebt_PayeeCode.dataBinding, partyCode);
		}	
	}	
}

/**
 * @author fzj0yl
 * @return adaptor  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function() 
{
	var flag = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/tmp/flagLOVSelected");
	var adaptor = null;
	if(flag != null && flag == "cred"){
		adaptor = "AddDebt_CreditorCode";
	}
	else if(flag != null && flag == "pay"){
		adaptor = "AddDebt_PayeeCode";
	}	
	return adaptor;
}

/*****************************************************************************************************************
 										HELPER FUNCTIONS
*****************************************************************************************************************/

/**
 * @author fzj0yl
 * 
 */
function setAddressCreatedBy() {
	var validCase = Services.getValue(MaintainCOVariables.VALID_CASE);
	if(validCase != MaintainCOVariables.YES) {
		var credCode = Services.getValue(AddDebt_CreditorCode.dataBinding);
		if(CaseManUtils.isBlank(credCode)) {
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/CreatedBy", Services.getCurrentUser());
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/ValidFrom", MaintainCOFunctions.getTodaysDate());
		}
			
		var payeeCode = Services.getValue(AddDebt_PayeeCode.dataBinding);
		if(CaseManUtils.isBlank(payeeCode)) {
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/CreatedBy", Services.getCurrentUser());
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/ValidFrom", MaintainCOFunctions.getTodaysDate());
		}	    
	}
}

/*****************************************************************************************************************
 										DATA BINDINGS
*****************************************************************************************************************/

AddDebt_AmountAllowedCurrency.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAmountAllowedCurrency";
AddDebt_AmountAllowed.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAmountAllowed";
AddDebt_CourtCode.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAdminCourtCode";
AddDebt_CourtName.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAdminCourtName";
AddDebt_CaseNumber.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtCaseNumber";
AddDebt_CaseParty.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PartyKey";
AddDebt_Status.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtStatus";

/*********************  CREDITOR TAB *************/
AddDebt_CreditorCode.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/CPCode";
AddDebt_CreditorName.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Name";
AddDebt_Creditor_Address_Line1.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/Line[1]";
AddDebt_Creditor_Address_Line2.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/Line[2]";
AddDebt_Creditor_Address_Line3.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/Line[3]";
AddDebt_Creditor_Address_Line4.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/Line[4]";
AddDebt_Creditor_Address_Line5.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/Line[5]";
AddDebt_Creditor_Address_Postcode.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/PostCode";
AddDebt_Creditor_Address_DXNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/DX";
AddDebt_Creditor_Address_TelNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/TelNo";
AddDebt_Creditor_Address_FaxNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/FaxNo";
AddDebt_Creditor_Address_Email.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Email";
AddDebt_Creditor_Address_CommMethod.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/CommMethod";
AddDebt_Creditor_Address_Welsh.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/TranslationToWelsh";
AddDebt_CreditorReference.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Reference";

/*********************  PAYEE TAB *************/
AddDebt_PayeeCode.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/CPCode";
AddDebt_PayeeName.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Name";
AddDebt_Payee_Address_Line1.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/Line[1]";
AddDebt_Payee_Address_Line2.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/Line[2]";
AddDebt_Payee_Address_Line3.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/Line[3]";
AddDebt_Payee_Address_Line4.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/Line[4]";
AddDebt_Payee_Address_Line5.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/Line[5]";
AddDebt_Payee_Address_Postcode.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/PostCode";
AddDebt_Payee_Address_DXNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/DX";
AddDebt_Payee_Address_TelNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/TelNo";
AddDebt_Payee_Address_FaxNo.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/FaxNo";
AddDebt_Payee_Address_Email.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Email";
AddDebt_Payee_Address_CommMethod.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/CommMethod";
AddDebt_Payee_Address_Welsh.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/TranslationToWelsh";

AddDebt_Payee.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtPayeeIndicator";
AddDebt_PayeeReference.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Reference";

/*****************************************************************************************************************
 										TAB DEFINITIONS
*****************************************************************************************************************/

function COAddDebtTabSelector() {}; // Instantiate the tabbed area
COAddDebtTabSelector.tabIndex = 1207;
COAddDebtTabSelector.dataBinding = MaintainCOVariables.CURRENT_TAB_PAGE_ADD_DEBT;

function COAddDebtCreditorPayeePagedArea() {};
COAddDebtCreditorPayeePagedArea.dataBinding = COAddDebtTabSelector.dataBinding;

/******************************* TAB PAGES ***************************************/

function TabAddDebtCreditor() {};
TabAddDebtCreditor.isEnabled = function()
{
	return true;
}

/**********************************************************************************/
function TabAddDebtPayee() {};
TabAddDebtPayee.isEnabled = function()
{
	return true;
}

/*****************************************************************************************************************
 										INPUT FIELDS
*****************************************************************************************************************/
function AddDebt_AmountAllowedCurrency() {}
AddDebt_AmountAllowedCurrency.tabIndex = -1;
AddDebt_AmountAllowedCurrency.isReadOnly = function()
{
	return true;
}
AddDebt_AmountAllowedCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}

/******************************************************************************/
function AddDebt_AmountAllowed() {}
AddDebt_AmountAllowed.tabIndex = 1200;
AddDebt_AmountAllowed.maxLength = 11;
AddDebt_AmountAllowed.helpText = "Amount allowed for this individual debt.";
AddDebt_AmountAllowed.isMandatory = function()
{
	return true;
}
AddDebt_AmountAllowed.componentName = "Amount Allowed";
AddDebt_AmountAllowed.validateOn = [AddDebt_AmountAllowed.dataBinding];
AddDebt_AmountAllowed.validate = function()
{
	var errCode = null;
	
	var amt = Services.getValue(AddDebt_AmountAllowed.dataBinding);
	if(amt != null && amt != ""){
		// check conforms to pattern
		var validCurrency = amt.search(MaintainCOVariables.CURRENCY_MAX_10_PATTERN);
		if(validCurrency < 0){			
			errCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat9_Msg');
		}
	}// end if(amt != null && amt != ""){
	
	return errCode;
}
AddDebt_AmountAllowed.logicOn = [AddDebt_AmountAllowed.dataBinding];
AddDebt_AmountAllowed.logic = function()
{
	// set the original amount field and the outstanding balance
	var amt = Services.getValue(AddDebt_AmountAllowed.dataBinding);
	
	if(amt != null && amt != ""){
		var originalAmt = CaseManUtils.transformAmountToTwoDP(amt, null);
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAmountOriginal", originalAmt);
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Balance", originalAmt);
	}// end if(amt != null && amt != "")
}
AddDebt_AmountAllowed.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
AddDebt_AmountAllowed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
/******************************************************************************/
function AddDebt_CaseNumber() {}
AddDebt_CaseNumber.tabIndex = 1201;
AddDebt_CaseNumber.maxLength = 8;
AddDebt_CaseNumber.helpText = "Case number for a case debt.";
AddDebt_CaseNumber.componentName = "Case Number";
AddDebt_CaseNumber.validateOn = [AddDebt_CaseNumber.dataBinding];
AddDebt_CaseNumber.validate = function()
{
	var errCode = null;
	var value = Services.getValue(AddDebt_CaseNumber.dataBinding);
	if(null != value ){
		errCode = CaseManValidationHelper.validateCaseNumber(value.toUpperCase());
	}
	return errCode;
}
AddDebt_CaseNumber.mandatoryOn = [AddDebt_Status.dataBinding];
AddDebt_CaseNumber.isMandatory = function()
{
	// mandatory if type is caeo
	var type = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/Type");
	var mandatory = false;
	if(type != null && type == MaintainCOVariables.COTypeCAEO){
		mandatory = true;
	}
	return mandatory;
}

AddDebt_CaseNumber.logicOn = [AddDebt_CaseNumber.dataBinding];
AddDebt_CaseNumber.logic = function(event)
{	
	// need to call the service etc and validate the field
	if(event.getXPath() == AddDebt_CaseNumber.dataBinding){	
		if(AddDebt_CaseNumber.validate() == null){
			var caseNumber = Services.getValue(AddDebt_CaseNumber.dataBinding);
			if(caseNumber == null || caseNumber == ""){
				Services.startTransaction();
				// unset the flag
				Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);
				// remove list of creditors - as no longer required
				Services.removeNode(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties");
				//need to set the values in the dom for case party role etc
				Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PartyRoleCode", "");
				Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasePartyNumber", "");
				Services.setValue(AddDebt_CaseParty.dataBinding, "");
				MaintainCOFunctions.clearAddDebtTab(MaintainCOVariables.CREDITOR_ADDRESS_XP); // clear creditor tab
				MaintainCOFunctions.clearAddDebtTab(MaintainCOVariables.PAYEE_ADDRESS_XP);	// clear payee tab
				Services.endTransaction();
			}
			else{
				var params = new ServiceParams();
				params.addSimpleParameter("caseNumber", caseNumber.toUpperCase());
				Services.callService("getCoDebtPartyList", params, AddDebt_CaseNumber, true);			
				
			}// end if/else
		} // end if(AddDebt_CaseNumber.validate() == null){		
	} // end if(event.getXPath() == AddDebt_CaseNumber.dataBinding){
}
/**
 * @param dom
 * @author fzj0yl
 * 
 */
AddDebt_CaseNumber.onSuccess = function(dom)
{
	if(null != dom){
		Services.startTransaction();
		// does the case exist?
		var result = dom.selectSingleNode("/ds/Parties");
		if(null != result && result.childNodes.length > 0){			
		// if case exists
		 	// set the case details in correct area of dom so popup can use them
		 	Services.replaceNode(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties", result);		 	
		 	// set grid binding to explicitly set it
		 	Services.setValue(AddDebt_SelectCreditorFromCaseGrid.dataBinding, "");
		 	// ensure the party(defendant) field is set to ""			
			Services.setValue(AddDebt_CaseParty.dataBinding, "");		 	
		 	// display the select creditor popup/lov
		 	Services.dispatchEvent("MaintainDebt_AddCreditorFromCasePopup", PopupGUIAdaptor.EVENT_RAISE);
		}
		else{		 	
		// if case doesn't exist		 
		 	// display a warning message
		 	alert(Messages.CASE_NOT_FOUND_MESSAGE);
		 	
		 	// remove list of previous creditors
			Services.removeNode(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties");
			// set grid binding to explicitly set it
		 	Services.setValue(AddDebt_SelectCreditorFromCaseGrid.dataBinding, "");
		 	
		 	// set the flag re whether creditor/payee details should be read only or not - 
		 	// this flag also represnets that the user must not select a party as a debtor
			Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);
			
			Services.setValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE, MaintainCOVariables.NO);
			
			// ensure the party(defendant) field is set to ""			
			Services.setValue(AddDebt_CaseParty.dataBinding, "");
		}
		Services.endTransaction();
	} // end if(null != dom){
}
/**
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_CaseNumber.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "The Case Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_CaseNumber.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

AddDebt_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_CaseNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_CourtCode() {}
AddDebt_CourtCode.tabIndex = 1203;
AddDebt_CourtCode.maxLength = 3;
AddDebt_CourtCode.helpText = "The administering court code.";
AddDebt_CourtCode.componentName = "Court Code";
AddDebt_CourtCode.mandatoryOn = [AddDebt_CaseNumber.dataBinding];
AddDebt_CourtCode.isMandatory = function()
{
	// mandatory if a case entered
	return MaintainCOFunctions.isCourtMandatory();
}
AddDebt_CourtCode.readOnlyOn = [MaintainCOVariables.VALID_CASE];
AddDebt_CourtCode.isReadOnly = function()
{	
	return MaintainCOFunctions.validCaseNoEntered(true); // pAddDebt
}
AddDebt_CourtCode.validateOn = [AddDebt_CourtCode.dataBinding,
								AddDebt_CourtName.dataBinding];
AddDebt_CourtCode.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var venueCode = Services.getValue(AddDebt_CourtCode.dataBinding);
	if(venueCode != null && venueCode != ""){
		var xpathName = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[./Code = " + AddDebt_CourtCode.dataBinding + "]/Name";
		var courtDesc = Services.getValue(xpathName);		
		if(courtDesc == null || courtDesc == ""){
			errCode = ErrorCode.getErrorCode('CaseMan_invalidCourtCode_Msg');
		}	
	}
	
	Services.endTransaction();
	
	return errCode;
}
/****************************************************************************************************************/
function AddDebt_CourtName() {}
AddDebt_CourtName.tabIndex = 1204;
AddDebt_CourtName.srcData = MaintainCOVariables.REF_DATA_XPATH + "/Courts";
AddDebt_CourtName.rowXPath = "Court";
AddDebt_CourtName.keyXPath = "Name";
AddDebt_CourtName.displayXPath = "Name";
AddDebt_CourtName.strictValidation = true;
AddDebt_CourtName.helpText = "The administering court name.";
AddDebt_CourtName.logicOn = [AddDebt_CourtName.dataBinding];
AddDebt_CourtName.logic = function(event)
{
	if (event.getXPath() != "/"){
		Services.startTransaction();
		var venueName = Services.getValue(AddDebt_CourtName.dataBinding);
		if(venueName != null && venueName != ""){
			var xpathCode = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[./Name = " + AddDebt_CourtName.dataBinding + "]/Code";
			var courtCode = Services.getValue(xpathCode);		
			Services.setValue(AddDebt_CourtCode.dataBinding, courtCode);
		}
		
		Services.endTransaction();
	}
}
AddDebt_CourtName.mandatoryOn = [AddDebt_CaseNumber.dataBinding];
AddDebt_CourtName.isMandatory = function()
{
	// mandatory if a case entered
	return MaintainCOFunctions.isCourtMandatory();
}
AddDebt_CourtName.readOnlyOn = [MaintainCOVariables.VALID_CASE];
AddDebt_CourtName.isReadOnly = function()
{	
	return MaintainCOFunctions.validCaseNoEntered(true); // pAddDebt
}
/****************************************************************************************************************/
function AddDebt_CaseParty() {}
AddDebt_CaseParty.tabIndex = -1;
AddDebt_CaseParty.maxLength = 12;
AddDebt_CaseParty.helpText = "The name of the selected Party from the case defined as the debtor.";
AddDebt_CaseParty.isReadOnly = function()
{
	return true;
}
AddDebt_CaseParty.componentName = "Case Party";
AddDebt_CaseParty.mandatoryOn = [MaintainCOVariables.VALID_CASE];
AddDebt_CaseParty.isMandatory = function()
{
	var mandatory = false;
	var caseSelected = Services.getValue(MaintainCOVariables.VALID_CASE);
	if(caseSelected != null && caseSelected != null && caseSelected == MaintainCOVariables.YES){
		mandatory = true;
	}	
	
	return mandatory;
}
/******************************************************************************/
function AddDebt_Status() {}
//AddDebt_Status.srcData = MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus";
AddDebt_Status.srcData = MaintainCOVariables.ADD_DEBT_STATUS_LIST_TMP_PATH;
AddDebt_Status.rowXPath = "Status";
AddDebt_Status.keyXPath = "Value";
AddDebt_Status.displayXPath = "Value";
AddDebt_Status.tabIndex = 1206;
AddDebt_Status.maxLength = 12;
AddDebt_Status.helpText = "The status of the debt.";
AddDebt_Status.isMandatory = function()
{
	return true;
}
AddDebt_Status.componentName = "Status";
AddDebt_Status.validateOn = [AddDebt_Status.dataBinding];
AddDebt_Status.validate = function()
{
	var errCode = null;
	Services.startTransaction();

	var debtStatus = Services.getValue(AddDebt_Status.dataBinding);
		if(null != debtStatus && debtStatus != ""){
			if(debtStatus == MaintainCOVariables.STATUS_PENDING || debtStatus == MaintainCOVariables.STATUS_SCHEDULE2 ||
							debtStatus == MaintainCOVariables.STATUS_LIVE){
				// carry on
				// If the CO type is CAEO and status being set to SCHEDULE2, throw error  Caseman_coTypeCAEO_Msg.
				var coType = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/Type");
				if(coType == MaintainCOVariables.COTypeCAEO && debtStatus == MaintainCOVariables.STATUS_SCHEDULE2){
					errCode = ErrorCode.getErrorCode("Caseman_coTypeCAEO_Msg");
				}
			}
			else{
				// invalid status
				errCode = ErrorCode.getErrorCode("CaseMan_invalidStatusForAddDebt_Msg");
			}
		}
		
	Services.endTransaction();
	
	return errCode;
}
/*****************************************************************************************************************
                                        CO MAINTAIN DEBTS ADD POPUP CREDITOR TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function AddDebt_CreditorCode() {}
AddDebt_CreditorCode.tabIndex = 1208;
AddDebt_CreditorCode.maxLength = 4;
AddDebt_CreditorCode.helpText = "The code for a locally-coded party.";
AddDebt_CreditorCode.componentName = "Creditor Code";
//AddDebt_CreditorCode.validateOn = [AddDebt_CreditorCode.dataBinding];
AddDebt_CreditorCode.validateOn = [MaintainCOVariables.VALIDATE_CRED_ADD_DEBT_CODED_PARTY_CODE];

AddDebt_CreditorCode.validate = function()
{	
	var errCode = null;
	Services.startTransaction();
	var credCode = Services.getValue(AddDebt_CreditorCode.dataBinding);	
	// check it's numeric
	var isNumeric = CaseManValidationHelper.validateNumber(credCode);
	if(isNumeric == false){
		errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
	}
	else if(null != credCode && credCode != ""){
		var validateFlag = Services.getValue(MaintainCOVariables.VALIDATE_CRED_ADD_DEBT_CODED_PARTY_CODE);	
		if(null != validateFlag && validateFlag == MaintainCOVariables.YES){
			errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
		}
	}
	Services.endTransaction();
	return errCode;
}
AddDebt_CreditorCode.logicOn = [AddDebt_CreditorCode.dataBinding];
AddDebt_CreditorCode.logic = function(event)
{	
	
	if(event.getXPath() == AddDebt_CreditorCode.dataBinding){
		Services.startTransaction();
		var owningCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");	
		if(owningCourtCode != null && owningCourtCode != ""){
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_CRED_ADD_DEBT_CODED_PARTY_CODE, MaintainCOVariables.NO);
			// need to get the relevant creditor deatils for the selected coded party
			var credCode = Services.getValue(AddDebt_CreditorCode.dataBinding);
			credCode = CaseManUtils.stripSpaces(credCode);
			var addingCourtDetailsFlag = Services.getValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE);
			if(addingCourtDetailsFlag == null || addingCourtDetailsFlag == MaintainCOVariables.NO){
				if(null == credCode || credCode == ""){				
					MaintainCOFunctions.clearAddDebtTab(MaintainCOVariables.CREDITOR_ADDRESS_XP); // clear creditor tab
				}
				else if(AddDebt_CreditorCode.validate() == null){
					var courtCode = MaintainCOFunctions.isNonCPCNationalCodedParty(credCode) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourtCode;
					// need to get the creditor details via a service
					var params = new ServiceParams();
					params.addSimpleParameter("adminCourtCode", courtCode);
					params.addSimpleParameter("codedPartyCode", credCode);
					Services.callService("getCreditorCodedParty", params, AddDebt_CreditorCode, true);
				}
			}
			else{
				//Services.setValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE, MaintainCOVariables.NO);
			}
		}
		else{
			alert(Messages.NEED_VALID_COURT_MESSAGE);
			// reset the creditor code
			Services.setValue(AddDebt_CreditorCode.dataBinding, "");
		}
		Services.endTransaction();
	}
}
/**
 * @param dom
 * @author fzj0yl
 * 
 */
AddDebt_CreditorCode.onSuccess = function(dom)
{
	if(dom != null){	
		var creditorNode = dom.selectSingleNode("/ds/Creditor");
		if(null != creditorNode){
			// need to set creditor and payee details
			Services.replaceNode(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor", creditorNode);
			// set the AddressTypeCode - needed to define if address is coded party or not when adding to history
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Creditor/Address/AddressTypeCode", MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY);
		}
		else{
			// Coded Party Entered is invalid
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_CRED_ADD_DEBT_CODED_PARTY_CODE, MaintainCOVariables.YES);
			Services.setFocus("AddDebt_CreditorCode");
		}		
 	}// end of if (dom != null)
}// end onSuccess
/**
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_CreditorCode.onError = function(exception)
{
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_CreditorCode.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/******************************************************************************/
function AddDebt_CreditorName() {}
AddDebt_CreditorName.tabIndex = 1209;
AddDebt_CreditorName.maxLength = 70;
AddDebt_CreditorName.helpText = "The creditor's name for this debt.";
AddDebt_CreditorName.componentName = "Creditor Name";
AddDebt_CreditorName.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
									AddDebt_CreditorCode.dataBinding];
AddDebt_CreditorName.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_CreditorName.isMandatory = function()
{
	return true;
}
AddDebt_CreditorName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_CreditorName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Line1() {}
AddDebt_Creditor_Address_Line1.tabIndex = 1211;
AddDebt_Creditor_Address_Line1.maxLength = 35;
AddDebt_Creditor_Address_Line1.helpText = "First line of the Creditor's address.";
AddDebt_Creditor_Address_Line1.componentName = "Creditor Address Line 1";
AddDebt_Creditor_Address_Line1.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Line1.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Line1.isMandatory = function()
{
	return true;
}
AddDebt_Creditor_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Line2() {}
AddDebt_Creditor_Address_Line2.tabIndex = 1212;
AddDebt_Creditor_Address_Line2.maxLength = 35;
AddDebt_Creditor_Address_Line2.helpText = "Second line of the Creditor's address.";
AddDebt_Creditor_Address_Line2.componentName = "Creditor Address Line 2";
AddDebt_Creditor_Address_Line2.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Line2.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Line2.isMandatory = function()
{
	return true;
}
AddDebt_Creditor_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Line3() {}
AddDebt_Creditor_Address_Line3.tabIndex = 1213;
AddDebt_Creditor_Address_Line3.maxLength = 35;
AddDebt_Creditor_Address_Line3.helpText = "Third line of the Creditor's address.";
AddDebt_Creditor_Address_Line3.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Line3.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Line4() {}
AddDebt_Creditor_Address_Line4.tabIndex = 1214;
AddDebt_Creditor_Address_Line4.maxLength = 35;
AddDebt_Creditor_Address_Line4.helpText = "Fourth line of the Creditor's address.";
AddDebt_Creditor_Address_Line4.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Line4.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Line5() {}
AddDebt_Creditor_Address_Line5.tabIndex = 1215;
AddDebt_Creditor_Address_Line5.maxLength = 35;
AddDebt_Creditor_Address_Line5.helpText = "Fifth line of the Creditor's address.";
AddDebt_Creditor_Address_Line5.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Line5.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Postcode() {}
AddDebt_Creditor_Address_Postcode.tabIndex = 1216;
AddDebt_Creditor_Address_Postcode.maxLength = 35;
AddDebt_Creditor_Address_Postcode.helpText = "Postcode of the Creditor's address.";
AddDebt_Creditor_Address_Postcode.componentName = "Creditor Postcode";
AddDebt_Creditor_Address_Postcode.readOnlyOn = [MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Postcode.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_Postcode.validateOn = [AddDebt_Creditor_Address_Postcode.dataBinding];
AddDebt_Creditor_Address_Postcode.validate = function()
{
	var errCode = null;
	var postCode = Services.getValue(AddDebt_Creditor_Address_Postcode.dataBinding);
	if(null != postCode && postCode != ""){
		if(CaseManValidationHelper.validatePostCode(postCode) == false){
			errCode  = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
		}
	}
	return errCode;
}
AddDebt_Creditor_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_DXNo() {}
AddDebt_Creditor_Address_DXNo.tabIndex = 1217;
AddDebt_Creditor_Address_DXNo.maxLength = 35;
AddDebt_Creditor_Address_DXNo.helpText = "Document exchange reference number.";
AddDebt_Creditor_Address_DXNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_DXNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Creditor_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Creditor_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Creditor_Address_TelNo() {}
AddDebt_Creditor_Address_TelNo.tabIndex = 1218;
AddDebt_Creditor_Address_TelNo.maxLength = 24;
AddDebt_Creditor_Address_TelNo.helpText = "Creditor's telephone number.";
AddDebt_Creditor_Address_TelNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_TelNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
/******************************************************************************/
function AddDebt_Creditor_Address_FaxNo() {}
AddDebt_Creditor_Address_FaxNo.tabIndex = 1219;
AddDebt_Creditor_Address_FaxNo.maxLength = 24;
AddDebt_Creditor_Address_FaxNo.helpText = "Creditor's fax number.";
AddDebt_Creditor_Address_FaxNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_FaxNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Email() {}
AddDebt_Creditor_Address_Email.tabIndex = 1220;
AddDebt_Creditor_Address_Email.maxLength = 80;
AddDebt_Creditor_Address_Email.helpText = "Creditor's email address."
AddDebt_Creditor_Address_Email.componentName = "Creditor Email";
AddDebt_Creditor_Address_Email.validateOn = [AddDebt_Creditor_Address_Email.dataBinding];
AddDebt_Creditor_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(AddDebt_Creditor_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
AddDebt_Creditor_Address_Email.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Email.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
/******************************************************************************/
function AddDebt_Creditor_Address_CommMethod() {}
AddDebt_Creditor_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
AddDebt_Creditor_Address_CommMethod.rowXPath = "Method";
AddDebt_Creditor_Address_CommMethod.keyXPath = "Id";
AddDebt_Creditor_Address_CommMethod.displayXPath = "Name";
AddDebt_Creditor_Address_CommMethod.tabIndex = 1221;
AddDebt_Creditor_Address_CommMethod.maxLength = 24;
AddDebt_Creditor_Address_CommMethod.helpText = "The preferred communication method of the Creditor's";
AddDebt_Creditor_Address_CommMethod.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_CommMethod.isReadOnly = function()
{	
	var readOnly = false;
/*	removed as part of UCT testing defect 291
Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
 */
	return readOnly;
}
/******************************************************************************/
function AddDebt_Creditor_Address_Welsh() {}
AddDebt_Creditor_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
AddDebt_Creditor_Address_Welsh.tabIndex = 1222;
AddDebt_Creditor_Address_Welsh.helpText = "Tick box if the Creditor is to receive documents translated into Welsh.";
AddDebt_Creditor_Address_Welsh.isMandatory = function(){
	return true;
}
AddDebt_Creditor_Address_Welsh.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_CreditorCode.dataBinding];
AddDebt_Creditor_Address_Welsh.isReadOnly = function()
{	
	var readOnly = false;
	/*	removed as part of UCT testing defect 291
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_CreditorCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
 */
	return readOnly;
}
/******************************************************************************/
function AddDebt_CreditorReference() {}
AddDebt_CreditorReference.tabIndex = 1223;
AddDebt_CreditorReference.maxLength = 24;
AddDebt_CreditorReference.helpText = "Creditor's reference.";
AddDebt_CreditorReference.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_CreditorCode.dataBinding];
AddDebt_CreditorReference.isReadOnly = function()
{	
	return false;
}
AddDebt_CreditorReference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_CreditorReference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/*****************************************************************************************************************
                                        CO MAINTAIN DEBTS ADD POPUP PAYEE TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function AddDebt_PayeeCode() {}
AddDebt_PayeeCode.tabIndex = 1230;
AddDebt_PayeeCode.maxLength = 4;
AddDebt_PayeeCode.helpText = "The code for a locally-coded payee.";
AddDebt_PayeeCode.componentName = "Payee Code";
AddDebt_PayeeCode.validateOn = [MaintainCOVariables.VALIDATE_PAYEE_ADD_DEBT_CODED_PARTY_CODE];
AddDebt_PayeeCode.validate = function()
{	
	var errCode = null;
	Services.startTransaction();
	
	var payCode = Services.getValue(AddDebt_PayeeCode.dataBinding);	
	
	// check it's numeric
	var isNumeric = CaseManValidationHelper.validateNumber(payCode);
	if(isNumeric == false){
		errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
	}
	else if(null != payCode && payCode != ""){
		var validateFlag = Services.getValue(MaintainCOVariables.VALIDATE_PAYEE_ADD_DEBT_CODED_PARTY_CODE);	
		if(null != validateFlag && validateFlag == MaintainCOVariables.YES){
			errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
		}
	}		
	
	
	Services.endTransaction();
	return errCode;
}
AddDebt_PayeeCode.logicOn = [AddDebt_PayeeCode.dataBinding];
AddDebt_PayeeCode.logic = function(event)	
{
	if(event.getXPath() == AddDebt_PayeeCode.dataBinding){
		Services.startTransaction();

		var owningCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");	
		
		if(owningCourtCode != null && owningCourtCode != ""){
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_PAYEE_ADD_DEBT_CODED_PARTY_CODE, MaintainCOVariables.NO);
			// need to get the relevant creditor details for the selected coded party
			var payeeCode = Services.getValue(AddDebt_PayeeCode.dataBinding);
			payeeCode = CaseManUtils.stripSpaces(payeeCode);
			var addingCourtDetailsFlag = Services.getValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE);
			if(addingCourtDetailsFlag == null || addingCourtDetailsFlag == MaintainCOVariables.NO){
				if(null == payeeCode || payeeCode == ""){
					MaintainCOFunctions.clearAddDebtTab(MaintainCOVariables.PAYEE_ADDRESS_XP); // clear creditor tab
				}
				else if(AddDebt_PayeeCode.validate() == null){				
					var courtCode = MaintainCOFunctions.isNonCPCNationalCodedParty(payeeCode) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourtCode;
					// need to get the creditor details via a service
					var params = new ServiceParams();
					params.addSimpleParameter("adminCourtCode", courtCode);
					params.addSimpleParameter("codedPartyCode", payeeCode);
					Services.callService("getPayeeCodedParty", params, AddDebt_PayeeCode, true);
				}
			}
			else{
				 Services.setValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE, MaintainCOVariables.NO);
			}
		}
		else{		
			alert(Messages.NEED_VALID_COURT_MESSAGE); 
			// reset the creditor code
			Services.setValue(AddDebt_PayeeCode.dataBinding, "");
		}
	
		Services.endTransaction();		
	}
}
/**
 * @param dom
 * @author fzj0yl
 * 
 */
AddDebt_PayeeCode.onSuccess = function(dom)
{
	if(dom != null){	
		var payeeNode = dom.selectSingleNode("/ds/Payee");
		if(null != payeeNode){
			// need to set creditor and payee details
			Services.replaceNode(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee", payeeNode);
			
			// set the AddressTypeCode - needed to define if address is coded party or not when adding to history
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/Payee/Address/AddressTypeCode", MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY);
		}
		else{
			// Coded Party Entered is invalid
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_PAYEE_ADD_DEBT_CODED_PARTY_CODE, MaintainCOVariables.YES);
			Services.setFocus("AddDebt_PayeeCode");
		}			
 	}// end of if (dom != null)
}// end onSuccess
/**
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_PayeeCode.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Local Coded Party Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author fzj0yl
 * 
 */
AddDebt_PayeeCode.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
/******************************************************************************/
function AddDebt_PayeeName() {}
AddDebt_PayeeName.tabIndex = 1231;
AddDebt_PayeeName.maxLength = 70;
AddDebt_PayeeName.helpText = "The payee name for this debt.";
AddDebt_PayeeName.componentName = "Payee Name";
AddDebt_PayeeName.mandatoryOn = [	AddDebt_PayeeName.dataBinding,
									AddDebt_PayeeCode.dataBinding,
									AddDebt_Payee_Address_Line1.dataBinding,
									AddDebt_Payee_Address_Line2.dataBinding,
									AddDebt_Payee_Address_Line3.dataBinding,
									AddDebt_Payee_Address_Line4.dataBinding,
									AddDebt_Payee_Address_Line5.dataBinding,
									AddDebt_Payee_Address_Postcode.dataBinding,
									AddDebt_Payee_Address_DXNo.dataBinding,
									AddDebt_Payee_Address_TelNo.dataBinding,
									AddDebt_Payee_Address_FaxNo.dataBinding,
									AddDebt_Payee_Address_Email.dataBinding,
									AddDebt_Payee_Address_CommMethod.dataBinding,
									AddDebt_Payee_Address_Welsh.dataBinding,
									AddDebt_Payee.dataBinding,
									AddDebt_PayeeReference.dataBinding];									

AddDebt_PayeeName.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory(MaintainCOVariables.SUBFORM_DEBT_XPATH)== true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
AddDebt_PayeeName.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
									AddDebt_PayeeCode.dataBinding];
AddDebt_PayeeName.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_PayeeName.logicOn = [AddDebt_PayeeName.dataBinding];
AddDebt_PayeeName.logic = function(event)
{	
	if (event.getXPath() != "/"){		
		var commMeth = Services.getValue(AddDebt_Payee_Address_CommMethod.dataBinding);
		if(commMeth == null || commMeth == ""){
			var field = Services.getValue(AddDebt_PayeeName.dataBinding);
			if(field != null && field != ""){
				Services.setValue(AddDebt_Payee_Address_CommMethod.dataBinding, "LE");
			}
		}
	}
}

AddDebt_PayeeName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_PayeeName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************************************************************/
function AddDebt_Payee_Address_Line1() {}
AddDebt_Payee_Address_Line1.tabIndex = 1233;
AddDebt_Payee_Address_Line1.maxLength = 35;
AddDebt_Payee_Address_Line1.helpText = "First line of the Payee's address.";
AddDebt_Payee_Address_Line1.componentName = "Payee Address Line 1";
AddDebt_Payee_Address_Line1.mandatoryOn = [	AddDebt_PayeeName.dataBinding,
											AddDebt_PayeeCode.dataBinding,
											AddDebt_Payee_Address_Line1.dataBinding,
											AddDebt_Payee_Address_Line2.dataBinding,
											AddDebt_Payee_Address_Line3.dataBinding,
											AddDebt_Payee_Address_Line4.dataBinding,
											AddDebt_Payee_Address_Line5.dataBinding,
											AddDebt_Payee_Address_Postcode.dataBinding,
											AddDebt_Payee_Address_DXNo.dataBinding,
											AddDebt_Payee_Address_TelNo.dataBinding,
											AddDebt_Payee_Address_FaxNo.dataBinding,
											AddDebt_Payee_Address_Email.dataBinding,
											AddDebt_Payee_Address_CommMethod.dataBinding,
											AddDebt_Payee_Address_Welsh.dataBinding,
											AddDebt_Payee.dataBinding,
											AddDebt_PayeeReference.dataBinding];
AddDebt_Payee_Address_Line1.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory(MaintainCOVariables.SUBFORM_DEBT_XPATH) == true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
AddDebt_Payee_Address_Line1.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Line1.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Line1.logicOn = [AddDebt_Payee_Address_Line1.dataBinding];
AddDebt_Payee_Address_Line1.logic = function(event)
{	
	if (event.getXPath() != "/"){		
		var commMeth = Services.getValue(AddDebt_Payee_Address_CommMethod.dataBinding);
		if(commMeth == null || commMeth == ""){
			var field = Services.getValue(AddDebt_Payee_Address_Line1.dataBinding);
			if(field != null && field != ""){
				Services.setValue(AddDebt_Payee_Address_CommMethod.dataBinding, "LE");
			}
		}
	}
}
AddDebt_Payee_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_Line2() {}
AddDebt_Payee_Address_Line2.tabIndex = 1234;
AddDebt_Payee_Address_Line2.maxLength = 35;
AddDebt_Payee_Address_Line2.helpText = "Second line of the Payee's address.";
AddDebt_Payee_Address_Line2.componentName = "Payee Address Line 2";
AddDebt_Payee_Address_Line2.mandatoryOn = [	AddDebt_PayeeName.dataBinding,
											AddDebt_Payee_Address_Line1.dataBinding,
											AddDebt_PayeeCode.dataBinding,
											AddDebt_Payee_Address_Line2.dataBinding,
											AddDebt_Payee_Address_Line3.dataBinding,
											AddDebt_Payee_Address_Line4.dataBinding,
											AddDebt_Payee_Address_Line5.dataBinding,
											AddDebt_Payee_Address_Postcode.dataBinding,
											AddDebt_Payee_Address_DXNo.dataBinding,
											AddDebt_Payee_Address_TelNo.dataBinding,
											AddDebt_Payee_Address_FaxNo.dataBinding,
											AddDebt_Payee_Address_Email.dataBinding,
											AddDebt_Payee_Address_CommMethod.dataBinding,
											AddDebt_Payee_Address_Welsh.dataBinding,
											AddDebt_Payee.dataBinding,
											AddDebt_PayeeReference.dataBinding];
AddDebt_Payee_Address_Line2.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory(MaintainCOVariables.SUBFORM_DEBT_XPATH) == true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
AddDebt_Payee_Address_Line2.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Line2.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Line2.logicOn = [AddDebt_Payee_Address_Line2.dataBinding];
AddDebt_Payee_Address_Line2.logic = function(event)
{	
	if (event.getXPath() != "/"){		
		var commMeth = Services.getValue(AddDebt_Payee_Address_CommMethod.dataBinding);
		if(commMeth == null || commMeth == ""){
			var field = Services.getValue(AddDebt_Payee_Address_Line2.dataBinding);
			if(field != null && field != ""){
				Services.setValue(AddDebt_Payee_Address_CommMethod.dataBinding, "LE");
			}
		}		
	}
}
AddDebt_Payee_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_Line3() {}
AddDebt_Payee_Address_Line3.tabIndex = 1235;
AddDebt_Payee_Address_Line3.maxLength = 35;
AddDebt_Payee_Address_Line3.helpText = "Third line of the Payee's address.";
AddDebt_Payee_Address_Line3.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Line3.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_Line4() {}
AddDebt_Payee_Address_Line4.tabIndex = 1236;
AddDebt_Payee_Address_Line4.maxLength = 35;
AddDebt_Payee_Address_Line4.helpText = "Fourth line of the Payee's address.";
AddDebt_Payee_Address_Line4.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Line4.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Line4.logicOn = [AddDebt_Payee_Address_Line4.dataBinding];
AddDebt_Payee_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_Line5() {}
AddDebt_Payee_Address_Line5.tabIndex = 1237;
AddDebt_Payee_Address_Line5.maxLength = 35;
AddDebt_Payee_Address_Line5.helpText = "Fifth line of the Payee's address.";
AddDebt_Payee_Address_Line5.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Line5.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_Postcode() {}
AddDebt_Payee_Address_Postcode.tabIndex = 1238;
AddDebt_Payee_Address_Postcode.maxLength = 35;
AddDebt_Payee_Address_Postcode.helpText = "Postcode of the Payee's address.";
AddDebt_Payee_Address_Postcode.componentName = "Payee Postcode";
AddDebt_Payee_Address_Postcode.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
												AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Postcode.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_Postcode.validateOn = [AddDebt_Payee_Address_Postcode.dataBinding];
AddDebt_Payee_Address_Postcode.validate = function()
{
	var errCode = null;
	var postCode = Services.getValue(AddDebt_Payee_Address_Postcode.dataBinding);
	if(null != postCode && postCode != ""){
		if(CaseManValidationHelper.validatePostCode(postCode) == false){
			errCode  = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
		}
	}
	return errCode;
}
AddDebt_Payee_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_DXNo() {}
AddDebt_Payee_Address_DXNo.tabIndex = 1239;
AddDebt_Payee_Address_DXNo.maxLength = 35;
AddDebt_Payee_Address_DXNo.helpText = "Document exchange reference number.";
AddDebt_Payee_Address_DXNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_DXNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_TelNo() {}
AddDebt_Payee_Address_TelNo.tabIndex = 1240;
AddDebt_Payee_Address_TelNo.maxLength = 24;
AddDebt_Payee_Address_TelNo.helpText = "Payee's telephone number.";
AddDebt_Payee_Address_TelNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_TelNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
AddDebt_Payee_Address_TelNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_Payee_Address_TelNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddDebt_Payee_Address_FaxNo() {}
AddDebt_Payee_Address_FaxNo.tabIndex = 1241;
AddDebt_Payee_Address_FaxNo.maxLength = 24;
AddDebt_Payee_Address_FaxNo.helpText = "Payee's fax number.";
AddDebt_Payee_Address_FaxNo.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_FaxNo.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
/******************************************************************************/
function AddDebt_Payee_Address_Email() {}
AddDebt_Payee_Address_Email.tabIndex = 1242;
AddDebt_Payee_Address_Email.maxLength = 80;
AddDebt_Payee_Address_Email.componentName = "Payee Email";
AddDebt_Payee_Address_Email.helpText = "Payee's email address.";
AddDebt_Payee_Address_Email.validateOn = [AddDebt_Payee_Address_Email.dataBinding];
AddDebt_Payee_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(AddDebt_Payee_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
AddDebt_Payee_Address_Email.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Email.isReadOnly = function()
{	
	var readOnly = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
	return readOnly;
}
/******************************************************************************/
function AddDebt_Payee_Address_CommMethod() {}
AddDebt_Payee_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
AddDebt_Payee_Address_CommMethod.rowXPath = "Method";
AddDebt_Payee_Address_CommMethod.keyXPath = "Id";
AddDebt_Payee_Address_CommMethod.displayXPath = "Name";
AddDebt_Payee_Address_CommMethod.tabIndex = 1243;
AddDebt_Payee_Address_CommMethod.maxLength = 24;
AddDebt_Payee_Address_CommMethod.helpText = "The preferred communication method of the Payee's.";
AddDebt_Payee_Address_CommMethod.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
									AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_CommMethod.isReadOnly = function()
{	
	var readOnly = false;
	/*	removed as part of UCT testing defect 291
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
 */
	return readOnly;
}
/******************************************************************************/
function AddDebt_Payee_Address_Welsh() {}
AddDebt_Payee_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
AddDebt_Payee_Address_Welsh.tabIndex = 1244;
AddDebt_Payee_Address_Welsh.helpText = "Tick box if the Payee is to receive documents translated into Welsh.";
AddDebt_Payee_Address_Welsh.readOnlyOn = [	MaintainCOVariables.VALID_CASE, 
											AddDebt_PayeeCode.dataBinding];
AddDebt_Payee_Address_Welsh.isReadOnly = function()
{	
	var readOnly = false;
	/*	removed as part of UCT testing defect 291
	Services.startTransaction();
	
	if(MaintainCOFunctions.codedPartyCodeEntered(AddDebt_PayeeCode.dataBinding) == true){
		readOnly = true;
	}
	
	Services.endTransaction();
 */
	return readOnly;
}
/******************************************************************************/
function AddDebt_Payee() {}
AddDebt_Payee.modelValue = {checked: 'Y', unchecked: 'N'};
AddDebt_Payee.tabIndex = 1245;
AddDebt_Payee.helpText = "Flag to identify if Payee is to receive dividend.";
AddDebt_Payee.isReadOnly = function()
{	
	return false;
}
AddDebt_Payee.logicOn = [AddDebt_PayeeName.dataBinding];
AddDebt_Payee.logic = function(event)
{		
	if(event.getXPath() == AddDebt_PayeeName.dataBinding ){	
		Services.startTransaction();
		var payeeName = Services.getValue(AddDebt_PayeeName.dataBinding);
		if(payeeName != null && payeeName != ""){
			Services.setValue(AddDebt_Payee.dataBinding, MaintainCOVariables.YES);
		}
		else{
			Services.setValue(AddDebt_Payee.dataBinding, MaintainCOVariables.NO);
		}
		Services.endTransaction();
	}
}
/******************************************************************************/
function AddDebt_PayeeReference() {}
AddDebt_PayeeReference.tabIndex = 1246;
AddDebt_PayeeReference.maxLength = 24;
AddDebt_PayeeReference.helpText = "The payee reference.";
AddDebt_PayeeReference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddDebt_PayeeReference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*****************************************************************************************************************
 										BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/

function AddDebt_OKBtn() {}
AddDebt_OKBtn.tabIndex = 1250;
/******************************************************************************/

function AddDebt_CancelBtn() {}
AddDebt_CancelBtn.tabIndex = 1251;
AddDebt_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "addDebtSubform" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
AddDebt_CancelBtn.actionBinding = function()
{
	// Always display cancel message - this is due to the framework 'isDirty' flag, always being set to true
	// as we set default values. 	
	Services.startTransaction();
	if(confirm(Messages.CANCEL_MESSAGE)){
			// reset temp area
			MaintainCOFunctions.resetNewDebt();
			Services.dispatchEvent("addDebtSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
	}	
	
	Services.endTransaction();	
}

/******************************************************************************/

function AddDebt_Court_LOV() {}
AddDebt_Court_LOV.tabIndex = 1205;
AddDebt_Court_LOV.enableOn = [	MaintainCOVariables.VALID_CASE,
								AddDebt_CaseNumber.dataBinding];
AddDebt_Court_LOV.isEnabled = function()
{	
	var enable = true;
	var validCase = MaintainCOFunctions.validCaseNoEntered(true); // pAddDebt
	if(validCase == true){
		enable = false;
	}
	return enable;
}
/********************************************************************************/

function AddDebt_Defendant_LOVBtn() {}
AddDebt_Defendant_LOVBtn.tabIndex = 1202;
/**
 * @author fzj0yl
 * 
 */
AddDebt_Defendant_LOVBtn.actionBinding = function()
{
	// if no case selected yet
	var validCase = Services.getValue(MaintainCOVariables.VALID_CASE);
	if(validCase == null || validCase == "" || validCase == MaintainCOVariables.NO){
		alert(Messages.CANNOT_ADD_PARTY);	
	}
	else {
		Services.dispatchEvent("AddDebt_Defendant_LOV", PopupGUIAdaptor.EVENT_RAISE);
	}	
}

/******************************************************************************/

function AddDebt_Creditor_LOVBtn() {}
AddDebt_Creditor_LOVBtn.tabIndex = 1210;
AddDebt_Creditor_LOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "AddDebt_CreditorCode" }, { key: Key.F6, element: "AddDebt_CreditorName" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
AddDebt_Creditor_LOVBtn.actionBinding = function()
{
	var owningCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");
	if(!CaseManUtils.isBlank(owningCourtCode)){
		Services.setValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/tmp/flagLOVSelected", "cred");
		Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else{
		alert(Messages.NEED_VALID_COURT_MESSAGE); 
	}	
}

/******************************************************************************/

function AddDebt_Payee_LOVBtn() {}
AddDebt_Payee_LOVBtn.tabIndex = 1232;
AddDebt_Payee_LOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "AddDebt_PayeeCode" }, { key: Key.F6, element: "AddDebt_PayeeName" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
AddDebt_Payee_LOVBtn.actionBinding = function()
{
	var owningCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");
	if(owningCourtCode != null && owningCourtCode != ""){
		Services.setValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/tmp/flagLOVSelected", "pay");
		Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else{
		alert(Messages.NEED_VALID_COURT_MESSAGE); 
	}	
}

/******************************************************************************/
function AddCreditorFromCase_Popup_OKBtn() {}
AddCreditorFromCase_Popup_OKBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "AddDebt_SelectCreditorFromCaseGrid"} ]
	}
};
AddCreditorFromCase_Popup_OKBtn.tabIndex = 8000;
/**
 * @author fzj0yl
 * 
 */
AddCreditorFromCase_Popup_OKBtn.actionBinding = function()
{
	Services.startTransaction();
	var caseNumber = Services.getValue(AddDebt_CaseNumber.dataBinding);
	var partyKey = Services.getValue(AddDebt_SelectCreditorFromCaseGrid.dataBinding);
	var partyRoleCode = Services.getValue(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[./PartyKey = '" + partyKey + "']/PartyRoleCode");
	var casePartyNo = Services.getValue(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[./PartyKey = '" + partyKey + "']/CasePartyNumber");
	
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber.toUpperCase());
	params.addSimpleParameter("partyRoleCode", partyRoleCode);
	params.addSimpleParameter("casePartyNo", casePartyNo);
	
	// reset the caseman debt flag as in effect starting again
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasemanDebt", MaintainCOVariables.NO);
	
	// remove this party from the list as do not want to select as a 'debtor'
	Services.removeNode(MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[./PartyKey = '" + partyKey + "']");
	// set the debtor party data binding to blank as was having a pronblem with this
	Services.setValue(AddDebt_Defendant_LOV.dataBinding, "");
	
	Services.endTransaction();
	Services.callService("getCoDebtCreditorAndPayee", params, AddCreditorFromCase_Popup_OKBtn, true);	
	
}
/**
 * @param dom
 * @author fzj0yl
 * 
 */
AddCreditorFromCase_Popup_OKBtn.onSuccess = function(dom)
{
	if(dom != null){		
		var debtNode = dom.selectSingleNode("/ds/Debt");
		if(null != debtNode && debtNode.childNodes.length > 0){
			Services.startTransaction();
			// need to set creditor and payee details
			Services.replaceNode(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt", debtNode);
			
			// set the court details			
			var caseCourtCode = Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/DebtAdminCourtCode");
			var caseCourtName = Services.getValue(MaintainCOVariables.CREDITOR_PAYEE_TMP_PATH + "/Debt/DebtAdminCourtName");			
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAdminCourtCode", caseCourtCode);
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAdminCourtName", caseCourtName);
			
			// is it a case from the local court
			var localCourt = false;
			var thisCourtCode = Services.getValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode");
			if(thisCourtCode != null && thisCourtCode == caseCourtCode){
				localCourt = true;
			}
			
			//Set Details
			var credSurrId = MaintainCOFunctions.getNextSurrogateKey();
			var payeeSurrId = MaintainCOFunctions.getNextSurrogateKey();
			MaintainCOFunctions.addCreditorAndPayeeDetailTabFields(credSurrId, payeeSurrId, localCourt);// pCredAddSurrID, pPayeeAddSurrID, pLocalCourt
	
			// make the fields read only if necessary - set the flag
			Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.YES);
			
			// need to set the debtor field if only one  - e.g. select a creditor and 
			// only one debtor left then set the debtor filed with this debtor
			MaintainCOFunctions.setDebtor();
			
			
			// set the caseman debt flag
			Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasemanDebt", MaintainCOVariables.YES);

			Services.setValue(MaintainCOVariables.ADDING_DETAILS_FROM_CASE, MaintainCOVariables.YES);
			Services.endTransaction();
		}
				
 	}// end of if (dom != null)
 	Services.dispatchEvent("MaintainDebt_AddCreditorFromCasePopup", PopupGUIAdaptor.EVENT_LOWER);
}// end onSuccess
/**
 * @param exception
 * @author fzj0yl
 * 
 */
AddCreditorFromCase_Popup_OKBtn.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Creditor/Payee Details"));
	Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author fzj0yl
 * 
 */
AddCreditorFromCase_Popup_OKBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/************************************************************************************/
function AddCreditorFromCase_Popup_CancelBtn() {}
AddCreditorFromCase_Popup_CancelBtn.tabIndex = 8001;
AddCreditorFromCase_Popup_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainDebt_AddCreditorFromCasePopup" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
AddCreditorFromCase_Popup_CancelBtn.actionBinding = function()
{
	Services.startTransaction();
	// clear the case number
	Services.setValue(AddDebt_CaseNumber.dataBinding, "");	
	//need to set the values in the dom for case party role etc
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PartyRoleCode", "");
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasePartyNumber", "");
	Services.setValue(AddDebt_CaseParty.dataBinding, "");
	// reset the caseman debt flag
	Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasemanDebt", "");	
	
	// make the fields editable
	// un set flag
	Services.setValue(MaintainCOVariables.VALID_CASE, MaintainCOVariables.NO);
	
	Services.endTransaction();
	
	Services.dispatchEvent("MaintainDebt_AddCreditorFromCasePopup", PopupGUIAdaptor.EVENT_LOWER);
}

/*****************************************************************************************************************
 										LOV DEFINITIONS
*****************************************************************************************************************/

function selectCourtLOV() {};
selectCourtLOV.dataBinding = MaintainCOVariables.SUBFORM_DEBT_XPATH + "/DebtAdminCourtCode";
selectCourtLOV.srcData = MaintainCOVariables.REF_DATA_XPATH + "/Courts";
selectCourtLOV.rowXPath = "Court";
selectCourtLOV.keyXPath = "Code";
selectCourtLOV.columns = [
	{xpath: "Code", filterXPath: "/ds/var/page/filters/grid/selectCourtOne"},
	{xpath: "Name", filterXPath: "/ds/var/page/filters/grid/selectCourtTwo"}
];
// Configure the location in the model which will generate data change events
selectCourtLOV.logicOn = [selectCourtLOV.dataBinding];
/**
 * Implement the callback
 * @author fzj0yl
 * 
 */
selectCourtLOV.logic = function()
{
	Services.startTransaction();
	var id = Services.getValue(selectCourtLOV.dataBinding);
	if (id != null){
		// Lookup the court details in ref data from the code that is stored in value				
		var xpathName = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[Code = " + selectCourtLOV.dataBinding + "]/Name";		
		var courtName = Services.getValue(xpathName);
		Services.setValue(AddDebt_CourtName.dataBinding, courtName);
	}
	
	Services.endTransaction();
} // end of logic()

selectCourtLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddDebt_Court_LOV"} ],
		keys: [ { key: Key.F6, element: "AddDebt_CourtCode" }, { key: Key.F6, element: "AddDebt_CourtName" } ]
	}
};

/*****************************************************************************************************/

function AddDebt_Defendant_LOV() {};
AddDebt_Defendant_LOV.dataBinding = "/ds/var/page/SelectedLOVRow/AddDebtDefendantParty";
AddDebt_Defendant_LOV.srcData = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties";
AddDebt_Defendant_LOV.rowXPath = "Party";
AddDebt_Defendant_LOV.keyXPath = "PartyKey";
AddDebt_Defendant_LOV.columns = [
	{xpath: "PartyRoleCode", filterXPath: "/ds/var/page/filters/grid/addDebtDebitorCodeOne"},
	{xpath: "CasePartyNumber", filterXPath: "/ds/var/page/filters/grid/addDebtDebitorCodeTwo"},
	{xpath: "Name", filterXPath: "/ds/var/page/filters/grid/addDebtDebitorCodeThree"}
];
// Configure the location in the model which will generate data change events
AddDebt_Defendant_LOV.logicOn = [AddDebt_Defendant_LOV.dataBinding];
/**
 * Implement the callback
 * @author fzj0yl
 * 
 */
AddDebt_Defendant_LOV.logic = function()
{	
	Services.startTransaction();
	var id = Services.getValue(AddDebt_Defendant_LOV.dataBinding);
	if (id != null && id != ""){
		// Lookup the court details in ref data from the code that is stored in value				
		var xpathPartyRoleCode = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[PartyKey = '" + id + "']/PartyRoleCode";
		var xpathcasePartyNumber = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties/Party[PartyKey = '" + id + "']/CasePartyNumber";
		
		var partyRole = Services.getValue(xpathPartyRoleCode);
		var partyNumber = Services.getValue(xpathcasePartyNumber);
		
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/PartyRoleCode", partyRole);
		Services.setValue(MaintainCOVariables.SUBFORM_DEBT_XPATH + "/CasePartyNumber", partyNumber);
		Services.setValue(AddDebt_CaseParty.dataBinding, id);
	}
	
	Services.endTransaction();
} // end of logic()



/*****************************************************************************************************************
 										GRID DEFINITIONS
*****************************************************************************************************************/


function AddDebt_SelectCreditorFromCaseGrid() {};
AddDebt_SelectCreditorFromCaseGrid.tabIndex = 7999;
AddDebt_SelectCreditorFromCaseGrid.dataBinding = "/ds/var/page/SelectedGridRow/AddCreditorFromCase";
AddDebt_SelectCreditorFromCaseGrid.srcData = MaintainCOVariables.PARTY_CASE_LIST_TMP_PATH + "/Parties";
AddDebt_SelectCreditorFromCaseGrid.rowXPath = "Party";
AddDebt_SelectCreditorFromCaseGrid.keyXPath = "PartyKey";
AddDebt_SelectCreditorFromCaseGrid.columns = [
	{xpath: "PartyRoleCode"},
	{xpath: "CasePartyNumber"},
	{xpath: "Name", defaultSort:"true", defaultSortOrder:"ascending"}
];
