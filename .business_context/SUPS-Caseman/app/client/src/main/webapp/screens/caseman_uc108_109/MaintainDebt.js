/** 
 * @fileoverview MaintainDebt.js:
 * This file contains the form configurations for the UC108 & UC109 - Maintain Consolidated Orders screen
 *
 * @author MGG
 * @version 1.0
 * local
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Added missing keyBindings including F6 on the fields associated with 
 *				LOV buttons, F4 on the close buttons of the popups and F2 on the main Add Debt button.
 *				Also removed the AddDebts_Popup_CancelBtn as was obsolete code.
 * 14/06/2006 - Chris Vincent: on text fields with no special validation updated transform to model to remove
 *				trailing and leading whitespace, particularly important on mandatory text fields where a blank
 *				space can be entered which can cause the screen to crash.
 *				Removed transforms to display/model on permanently read only fields (e.g. address) as is no need.
 *				Email address is no longer converted to upper case to match other screens.
 * 11/07/2006 - Kevin Gichohi (EDS) - Changed error message from "Flag to identify if Payee is to received dividend" 
 *				to "Flag to identify if Payee is to receive dividend".
 * 18/10/2006 - Mark groen (EDS) - Defect 5653 - Amount field having trouble with 1.2, 4.7, when retrieving from database
 * 24/11/2006 - Chris Vincent, updated hint text of all fields to be "Creditor's" instead of "Creditors's" and "Payee's"
 * 				instead of "Payees's" to match the use case.  UCT Defect 678.
 * 08/01/2007 - Mark Groen, defect TEMP_CASEMAN 325 - if in create mode disable the history buttons.
 * 09/01/2007 - Mark Groen, defect TEMP_CASEMAN 367 - Defect states - - In the maintain debts screen for CO 060010NN when the pending debt 
 *				is clicked on the debt status is errored and goes red giving a message about dividends being declared, and 
 *				the status can not be changed.
 * 21/01/2008 - Mark Groen, defect CASEMAN 6474 - Defect states - - In some cases the outstanding balance field has a 
 * 				red border around it due to the amount being to long. To the user the value looks correct, but 
 * 				javascript produces a number with a large amount of decimal places and therefore the appication 
 * 				believes it to be invalid.
 * 16/05/2011 - Chris Vincent, Trac 3373, in function MaintainDebt_AmountAllowed.validate(), set the float variable total
 *              to two fixed decimal places.
 */

/*****************************************************************************************************************
                                               MAIN FORM
****************************************************************************************************************/
function MaintainDebt() {}

/**
 * @author rzhh8k
 * 
 */
MaintainDebt.initialise = function()
{
	Services.startTransaction();
	MaintainCOFunctions.loadCOReferenceData(MaintainCOVariables.MAINTAIN_DEBT_REFDATA);

	// Set the correct tab to be displayed - defect uct 592, moved to below with new functionality
	//Services.setValue(CODebtTabSelector.dataBinding, "TabCreditorAdd");
	
	// Get the screen mode
	var mode = Services.getValue(ManageCOParams.MODE);
	// check we have a co number
	var coNumber = Services.getValue(ManageCOParams.CO_NUMBER);	
	Services.setFocus("MaintainDebt_DebtGrid");
	
	
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		if(coNumber != null && coNumber != ""){
			// Get the CO via a service and the ref data
			MaintainCOFunctions.getCOForMaintainDebtsOnly(coNumber);
		}		
	}
	else{		
		// copy the data
		MaintainCOFunctions.copyData(false, false);//pCopyToAppFlags, pRemoveOrigNode
	}
	
	// Set the correct tab to be displayed - defect uct 592
	// if payee exists on teh debt display that the payee tab
	var selectedDebt = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	if(MaintainCOFunctions.payeeExistsOnDebt(selectedDebt) == true){		
		Services.setValue(CODebtTabSelector.dataBinding, "TabPayeeAdd");
	}
	else{
		Services.setValue(CODebtTabSelector.dataBinding, "TabCreditorAdd");
	}
	
	Services.endTransaction();
}

/**
 * onSucess to handle the retrieval of reference data that is lazy loaded
 * @param dom
 * @param serviceName
 * @author rzhh8k
 * 
 */
MaintainDebt.onSuccess = function(dom, serviceName)
{
	switch (serviceName){
		case "getCourtsShort":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/Courts", dom);
			break;		
		case "getDebtStatusList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus", dom);
			// set up the temp debt status list
			var debtStatus = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtStatus");
			MaintainCOFunctions.setUpTempDebtStatusList(debtStatus);
			MaintainCOFunctions.setUpTempAddDebtStatusList();
			break;
		case "getCurrentCurrency":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency", dom);
			break;		
		case "getPrefCommMethodList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods", dom);
			break;		
		default:
			break;				
	}
}

/**
 * load data is a div tag in the html and is used to make the callback to onSuccess from the
 * @author rzhh8k
 * 
 */
function loadData() {}

/**
 * @param dom
 * @author rzhh8k
 * 
 */
loadData.onSuccess = function(dom)
{
	if(dom != null){
		var result = dom.selectSingleNode("/ds/MaintainCO");
		if(null != result){
			Services.replaceNode("/ds/MaintainCO", result);
		}		
 	}// end of if (dom != null) 	
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
loadData.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "CO Details"));
}

/******************************* SUBFORMS ******************************************/
function addDebt_subform() {};
addDebt_subform.subformName = "AddDebtSubform";
/**
 * @author rzhh8k
 * 
 */
addDebt_subform.prePopupPrepare = function()
{
    // Pass the debt type and owning court details to the subform
    Services.setValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/Type", Services.getValue(MaintainDebt_Header_Type.dataBinding));
    Services.setValue(MaintainCOVariables.ADD_DEBT_SUBFORM_PATH + "/OwningCourtCode", Services.getValue(MaintainDebt_Header_OwningCourtCode.dataBinding));
}
addDebt_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: MaintainCOVariables.NEW_DEBT_TMP_PATH } ];
/**
 * @author rzhh8k
 * 
 */
addDebt_subform.processReturnedData = function() 
{
    Services.startTransaction();
    
    // Set the necessary surrogate IDs
    var pSurrogateID = MaintainCOFunctions.getNextSurrogateKey();
    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtSurrogateId", pSurrogateID);
	Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/AddressSurrogateId", MaintainCOFunctions.getNextSurrogateKey());
	if(!CaseManUtils.isBlank(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Name"))) {
	    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/AddressSurrogateId", MaintainCOFunctions.getNextSurrogateKey());
	}

	// Set the creditor address status if it is not already set
	var addStatus = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Status");
	if(CaseManUtils.isBlank(addStatus)) {
	    var credCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/CPCode");
		if(CaseManUtils.isBlank(credCode)) {
		    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		} else {
		    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Creditor/Address/Status", MaintainCOVariables.STATUS_FLAG_EXISTING);
		}
	}

	// Set the payee address status if it is not already set
	addStatus = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Status");
	if(CaseManUtils.isBlank(addStatus)) {
	    credCode = Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/CPCode");
		if(CaseManUtils.isBlank(credCode)) {
		    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Status", MaintainCOVariables.STATUS_FLAG_NEW);
		} else {
		    Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Status", MaintainCOVariables.STATUS_FLAG_EXISTING);
		}
	}
	
	// Defect 3439 - need to set the address unknown flag
	Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/AddressUnknown", "N");
	
	// Add the new debt branch to the debts node
	Services.addNode(Services.getNode(MaintainCOVariables.NEW_DEBT_TMP_PATH), "/ds/MaintainCO/Debts");
	Services.setValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/Payee/Address/Status", MaintainCOVariables.STATUS_FLAG_EXISTING);
	
	
	// Check if require a event 705 to be fired?
	// Do this if a case number has been entered
	if(!CaseManUtils.isBlank(Services.getValue(MaintainCOVariables.NEW_DEBT_TMP_PATH + "/DebtCaseNumber"))) {
		Services.setValue(MaintainCOVariables.EVENT705_IN_FORCE, MaintainCOVariables.YES);
	}	

	// Force the master grid to select the newly added Judgment
	Services.setValue(MaintainDebt_DebtGrid.dataBinding, pSurrogateID);
	
	Services.endTransaction();
}
addDebt_subform.destroyOnClose = true;

/*****************************************************************************************************************/
function addCoAddress_subform() {};
addCoAddress_subform.subformName = "AddCoAddressSubform";
addCoAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: MaintainCOVariables.NEW_ADDRESS_TMP_PATH } ];
/**
 * @author rzhh8k
 * 
 */
addCoAddress_subform.processReturnedData = function() 
{
    Services.startTransaction();
    var mainDebtAdd1 = null;
    var addToHistory = false;
    var surrId = null;
    var debtId = null;
    var changedBefore = null;
    
    var isAddCreditor = Services.getValue(MaintainCOVariables.ADDING_CREDITOR_ADDRESS);
    if(null != isAddCreditor && isAddCreditor == MaintainCOVariables.YES){
	    // need to see if address already added to history - i.e. removed a coded party
		// do this by checking the value in the add line 1 field
		mainDebtAdd1 = Services.getValue(MaintainDebt_Creditor_Address_Line1.dataBinding);
		
		if(mainDebtAdd1 != null && mainDebtAdd1!= ""){
			addToHistory = true;
		}
		surrId = MaintainCOFunctions.getNextSurrogateKey();
		MaintainCOFunctions.addAddressMaintainDebt(	MaintainCOVariables.CREDITOR_ADDRESS_XP, //pAddressType 
													surrId, //pSurrogateID, 
													addToHistory); //pAddToHistory	
		
    }// end  if(null != isAddCreditor && isAddCreditor == MaintainCOVariables.YES){
    else if(null != isAddCreditor && isAddCreditor == MaintainCOVariables.NO){
   		// need to see if address already added to history - i.e. removed a coded party
		// do this by checking the value in the add line 1 field
		mainDebtAdd1 = Services.getValue(MaintainDebt_Payee_Address_Line1.dataBinding);
		if(mainDebtAdd1 != null && mainDebtAdd1!= ""){
			addToHistory = true;
		}
		surrId = MaintainCOFunctions.getNextSurrogateKey();
		MaintainCOFunctions.addAddressMaintainDebt(	MaintainCOVariables.PAYEE_ADDRESS_XP, //pAddressType
													surrId, //pSurrogateID, 
													addToHistory); //pAddToHistory
		
    }// end else if(null != isAddCreditor && isAddCreditor == MaintainCOVariables.NO){
    
    
    // now do some generic stuff
    MaintainCOFunctions.setCancelMessage(MaintainCOVariables.NO, null);//pFlagValue, pFieldValue		
	debtId = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	// set the flag for event 985
	changedBefore = MaintainCOFunctions.hasDebtBeenChangedReCreditorChangedEvent(debtId);//pDebtId
	if(changedBefore == false){
		// set
		MaintainCOFunctions.addDebtIdForEvent(debtId, true);//pDebtId,pTemp
	}
	Services.setFocus("MaintainDebt_DebtGrid");
    
	Services.endTransaction();
}
addCoAddress_subform.destroyOnClose = true;

/************************* CODED PARTY SEARCH SUBFORM ******************************/
function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";

/**
 * @author rzhh8k
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var owningCourtCode = Services.getValue("/ds/MaintainCO/OwningCourtCode");
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, owningCourtCode);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: "/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode" }
];

/**
 * @author rzhh8k
 * 
 */
codedPartySearch_subform.processReturnedData = function() 
{
	var partyCode = Services.getValue("/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	var flag = Services.getValue(MaintainCOVariables.WHICH_LOV_MAINTAIN_DEBT_CODED_PARTY_CODE);
	if(partyCode != null && partyCode != ""){
		if(flag != null && flag == "cred"){
			Services.setValue(MaintainDebt_CreditorCode.dataBinding, partyCode);
		}
		else if(flag != null && flag == "pay"){
			Services.setValue(MaintainDebt_PayeeCode.dataBinding, partyCode);
		}
	}
}

/**
 * @author rzhh8k
 * @return adaptor  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function() 
{
	var flag = Services.getValue(MaintainCOVariables.WHICH_LOV_MAINTAIN_DEBT_CODED_PARTY_CODE);
	var adaptor = null;
	if(flag != null && flag == "cred"){
		adaptor = "MaintainDebt_CreditorCode";
	}
	else if(flag != null && flag == "pay"){
		adaptor = "MaintainDebt_PayeeCode";
	}	
	return adaptor;
	
}

/*****************************************************************************************************************
                                       POPUP DEFINITIONS
*****************************************************************************************************************/

function MaintainDebt_CreditorAddressHistory() {};
MaintainDebt_CreditorAddressHistory.lower = {
	eventBinding: {
		singleClicks: [ {element: "MaintainDebt_CreditorAddressHistory_Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "MaintainDebt_CreditorAddressHistory" } ]
	}
};

/*****************************************************************************************************************/

function MaintainDebt_PayeeAddressHistory() {};
MaintainDebt_PayeeAddressHistory.lower = {
	eventBinding: {
		singleClicks: [ {element: "MaintainDebt_PayeeAddressHistory_Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "MaintainDebt_PayeeAddressHistory" } ]
	}
};

/*****************************************************************************************************************
                                        GRID DEFINITIONS
*****************************************************************************************************************/

function MaintainDebt_DebtGrid() {};
MaintainDebt_DebtGrid.dataBinding = "/ds/var/page/SelectedGridRow/Debt";
MaintainDebt_DebtGrid.srcData = "/ds/MaintainCO/Debts";
MaintainDebt_DebtGrid.rowXPath = "Debt";
MaintainDebt_DebtGrid.keyXPath = "DebtSurrogateId";
MaintainDebt_DebtGrid.columns = [	
	{xpath: "Creditor/Name"},
	{xpath: "DebtStatus"}
];
// Configure the location in the model which will generate data change events
MaintainDebt_DebtGrid.logicOn = [MaintainDebt_DebtGrid.dataBinding];
/**
 * Implement the callback
 * @author rzhh8k
 * 
 */
MaintainDebt_DebtGrid.logic = function()
{
	Services.startTransaction();
	var debtStatus = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtStatus");
	MaintainCOFunctions.setUpTempDebtStatusList(debtStatus);
	
	// Set the correct tab to be displayed - defect uct 592
	// if payee exists on teh debt display that the payee tab
	var selectedDebt = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	if(MaintainCOFunctions.payeeExistsOnDebt(selectedDebt) == true){		
		Services.setValue(CODebtTabSelector.dataBinding, "TabPayeeAdd");
	}
	else{
		Services.setValue(CODebtTabSelector.dataBinding, "TabCreditorAdd");
	}
	
	Services.endTransaction();
	
}
MaintainDebt_DebtGrid.tabIndex = 1000;

/*********************************************************************/

function MaintainDebt_CreditorAddressHistoryGrid() {};
MaintainDebt_CreditorAddressHistoryGrid.dataBinding = "/ds/var/page/SelectedGridRow/CreditorHistoryAddress";
/**
 * @param pIndex
 * @author rzhh8k
 * @return addressString  
 */
MaintainDebt_CreditorAddressHistoryGrid.concatAddrLines = function(pIndex)
{
	var addressString = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[2]");
	return addressString;
}
MaintainDebt_CreditorAddressHistoryGrid.srcData = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory";
MaintainDebt_CreditorAddressHistoryGrid.rowXPath = "Address";
MaintainDebt_CreditorAddressHistoryGrid.keyXPath = "AddressSurrogateId";
MaintainDebt_CreditorAddressHistoryGrid.columns = [
	{xpath: "AddressSurrogateId", transformToDisplay: MaintainDebt_CreditorAddressHistoryGrid.concatAddrLines},
	{xpath: "ValidFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ValidTo", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"}
];

/*********************************************************************/

function MaintainDebt_PayeeAddressHistoryGrid() {};
/**
 * @param pIndex
 * @author rzhh8k
 * @return addressString  
 */
MaintainDebt_PayeeAddressHistoryGrid.concatAddrLines = function(pIndex)
{
	var addressString = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[2]");
	if(addressString == "null, null" || addressString == ", " ){
		addressString = ""; // it's a blank address in database due to selecting a coded party in maintain mode
	}
	return addressString;
}
MaintainDebt_PayeeAddressHistoryGrid.dataBinding = "/ds/var/page/SelectedGridRow/PayeeHistoryAddress";
MaintainDebt_PayeeAddressHistoryGrid.srcData = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory";
MaintainDebt_PayeeAddressHistoryGrid.rowXPath = "Address";
MaintainDebt_PayeeAddressHistoryGrid.keyXPath = "AddressSurrogateId";
MaintainDebt_PayeeAddressHistoryGrid.columns = [
	{xpath: "AddressSurrogateId", transformToDisplay: MaintainDebt_PayeeAddressHistoryGrid.concatAddrLines},
	{xpath: "ValidFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ValidTo", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"}
];


/*****************************************************************************************************************
                                        DATA BINDINGS
*****************************************************************************************************************/

/*********************  HEADER DETAILS  - MAIN SCREEN *******/
MaintainDebt_Header_CONumber.dataBinding = "/ds/MaintainCO/CONumber";
MaintainDebt_Header_COOldNumber.dataBinding = "/ds/MaintainCO/OldNumber";
MaintainDebt_Header_OwningCourtCode.dataBinding = "/ds/MaintainCO/OwningCourtCode";
MaintainDebt_Header_OwningCourtName.dataBinding = "/ds/MaintainCO/OwningCourt";
MaintainDebt_Header_Type.dataBinding = "/ds/MaintainCO/COType";
MaintainDebt_Header_Status.dataBinding = "/ds/MaintainCO/COStatus";
MaintainDebt_Header_Debtor.dataBinding = "/ds/MaintainCO/DebtorName";

/*********************  MAINTAIN DEBTS DETAILS *******/
MaintainDebt_AmountAllowedCurrency.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtAmountAllowedCurrency";
MaintainDebt_AmountAllowed.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtAmountAllowed";
MaintainDebt_Status.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtStatus";
MaintainDebt_TotalPassthroughsCurrency.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/PassthroughsCurrency";
MaintainDebt_TotalPassthroughs.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Passthroughs";
MaintainDebt_TotalDividendCurrency.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DividendsCurrency";
MaintainDebt_TotalDividend.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Dividends";
MaintainDebt_OutstandingBalanceCurrency.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/BalanceCurrency";
MaintainDebt_OutstandingBalance.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Balance";
MaintainDebt_CourtCode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtAdminCourtCode";
MaintainDebt_CourtName.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtAdminCourtName";
MaintainDebt_CaseNumber.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtCaseNumber";
MaintainDebt_CaseParty.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/PartyKey";

/*********************  MAINTAIN DEBTS DETAILS - CREDITOR TAB *************/
MaintainDebt_CreditorCode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/CPCode";
MaintainDebt_CreditorName.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Name";
MaintainDebt_Creditor_Address_Line1.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/Line[1]";
MaintainDebt_Creditor_Address_Line2.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/Line[2]";
MaintainDebt_Creditor_Address_Line3.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/Line[3]";
MaintainDebt_Creditor_Address_Line4.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/Line[4]";
MaintainDebt_Creditor_Address_Line5.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/Line[5]";
MaintainDebt_Creditor_Address_Postcode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/PostCode";
MaintainDebt_Creditor_Address_DXNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/DX";
MaintainDebt_Creditor_Address_TelNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/TelNo";
MaintainDebt_Creditor_Address_FaxNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/FaxNo";
MaintainDebt_Creditor_Address_Email.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Email";
MaintainDebt_Creditor_Address_CommMethod.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/CommMethod";
MaintainDebt_Creditor_Address_Welsh.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/TranslationToWelsh";
MaintainDebt_PayeeUnknown.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/AddressUnknown";
MaintainDebt_CreditorReference.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Reference";

/********************* MAINTAIN DEBT CREDITOR ADDRESS HISTORY POPUP ******/
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/Line[1]";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/Line[2]";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/Line[3]";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/Line[4]";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/Line[5]";
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_CreditorAddressHistoryGrid.dataBinding + "]/PostCode";

/*********************  MAINTAIN DEBTS DETAILS - PAYEE TAB *************/
MaintainDebt_PayeeCode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/CPCode";
MaintainDebt_PayeeName.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Name";
MaintainDebt_Payee_Address_Line1.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/Line[1]";
MaintainDebt_Payee_Address_Line2.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/Line[2]";
MaintainDebt_Payee_Address_Line3.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/Line[3]";
MaintainDebt_Payee_Address_Line4.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/Line[4]";
MaintainDebt_Payee_Address_Line5.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/Line[5]";
MaintainDebt_Payee_Address_Postcode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/PostCode";
MaintainDebt_Payee_Address_DXNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/DX";
MaintainDebt_Payee_Address_TelNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/TelNo";
MaintainDebt_Payee_Address_FaxNo.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/FaxNo";
MaintainDebt_Payee_Address_Email.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Email";
MaintainDebt_Payee_Address_CommMethod.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/CommMethod";
MaintainDebt_Payee_Address_Welsh.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/TranslationToWelsh";
MaintainDebt_Payee.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtPayeeIndicator";
MaintainDebt_PayeeReference.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Reference";

/*********************  MAINTAIN DEBT PAYEE ADD ADDRESS POPUP *************/
//AddPayeeAddress_Popup_Address_Line1.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[1]";
//AddPayeeAddress_Popup_Address_Line2.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[2]";
//AddPayeeAddress_Popup_Address_Line3.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[3]";
//AddPayeeAddress_Popup_Address_Line4.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[4]";
//AddPayeeAddress_Popup_Address_Line5.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/Line[5]";
//AddPayeeAddress_Popup_Address_Postcode.dataBinding = MaintainCOVariables.NEW_ADDRESS_TMP_PATH + "/PostCode";

/********************* MAINTAIN DEBT PAYEE ADDRESS HISTORY POPUP ******/
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/Line[1]";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/Line[2]";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/Line[3]";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/Line[4]";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/Line[5]";
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.dataBinding = "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory/Address[./AddressSurrogateId = " + MaintainDebt_PayeeAddressHistoryGrid.dataBinding + "]/PostCode";



/*****************************************************************************************************************
                                        TAB DEFINITIONS
*****************************************************************************************************************/
function CODebtTabSelector() {}; // Instantiate the tabbed area
CODebtTabSelector.tabIndex = 1004;
CODebtTabSelector.dataBinding = MaintainCOVariables.CURRENT_TAB_PAGE_DEBT;

function COCreditorPayeePagedArea() {};
COCreditorPayeePagedArea.dataBinding = CODebtTabSelector.dataBinding;


/******************************* TAB PAGES ***************************************/

function TabCreditorAdd() {};
TabCreditorAdd.isEnabled = function()
{
	return true;
}

/**********************************************************************************/

function TabPayeeAdd() {};
TabPayeeAdd.isEnabled = function()
{
	return true;
}



/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/*****************************************************************************************************************
                                        HEADER INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_Header_CONumber() {}
MaintainDebt_Header_CONumber.tabIndex = -1;
MaintainDebt_Header_CONumber.maxLength = 8;
MaintainDebt_Header_CONumber.helpText = "Unique Consolidation Order identifier.  Enter a CO Number to query on or leave blank when creating.";
MaintainDebt_Header_CONumber.isReadOnly = function()
{
	return true;
}

/****************************************************************************************************************/
function MaintainDebt_Header_COOldNumber() {}
MaintainDebt_Header_COOldNumber.tabIndex = -1;
MaintainDebt_Header_COOldNumber.maxLength = 9;
MaintainDebt_Header_COOldNumber.helpText = "Enter previous AO, CAEO or CO Number, if relevant.";
MaintainDebt_Header_COOldNumber.isReadOnly = function()
{
	return true;
}

/****************************************************************************************************************/
function MaintainDebt_Header_OwningCourtCode() {}
MaintainDebt_Header_OwningCourtCode.tabIndex = -1;
MaintainDebt_Header_OwningCourtCode.maxLength = 3;
MaintainDebt_Header_OwningCourtCode.helpText = "Owning Court Code";
MaintainDebt_Header_OwningCourtCode.isReadOnly = function()
{
	return true;
}

/****************************************************************************************************************/
function MaintainDebt_Header_OwningCourtName() {}
MaintainDebt_Header_OwningCourtName.tabIndex = -1;
MaintainDebt_Header_OwningCourtName.maxLength = 70;
MaintainDebt_Header_OwningCourtName.helpText = "Owning Court Name";
MaintainDebt_Header_OwningCourtName.isReadOnly = function()
{
	return true;
}
MaintainDebt_Header_OwningCourtName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Header_OwningCourtName.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/****************************************************************************************************************/
function MaintainDebt_Header_Type() {}
MaintainDebt_Header_Type.tabIndex = -1;
MaintainDebt_Header_Type.maxLength = 4;
MaintainDebt_Header_Type.helpText = "Type of CO Record";
MaintainDebt_Header_Type.isReadOnly = function()
{
	return true;
}

/****************************************************************************************************************/
function MaintainDebt_Header_Status() {}
MaintainDebt_Header_Status.tabIndex = -1;
MaintainDebt_Header_Status.maxLength = 11;
MaintainDebt_Header_Status.helpText = "Current status of the CO";
MaintainDebt_Header_Status.isReadOnly = function()
{
	return true;
}
MaintainDebt_Header_Status.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Header_Status.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/****************************************************************************************************************/
function MaintainDebt_Header_Debtor() {}
MaintainDebt_Header_Debtor.tabIndex = -1;
MaintainDebt_Header_Debtor.maxLength = 70;
MaintainDebt_Header_Debtor.helpText = "The name of the Debtor.";
MaintainDebt_Header_Debtor.isReadOnly = function()
{
	return true;
}
MaintainDebt_Header_Debtor.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Header_Debtor.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*****************************************************************************************************************
                                        CO MAINTAIN DEBTS POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_AmountAllowedCurrency() {}
MaintainDebt_AmountAllowedCurrency.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AmountAllowedCurrency.tabIndex = -1;
MaintainDebt_AmountAllowedCurrency.maxLength = 3;
MaintainDebt_AmountAllowedCurrency.helpText = "Amount allowed for this individual debt.";
MaintainDebt_AmountAllowedCurrency.isReadOnly = function()
{
	return true;
}
MaintainDebt_AmountAllowedCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
MaintainDebt_AmountAllowedCurrency.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AmountAllowedCurrency.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_AmountAllowed() {}
MaintainDebt_AmountAllowed.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AmountAllowed.tabIndex = 1002;
MaintainDebt_AmountAllowed.maxLength = 11;
MaintainDebt_AmountAllowed.helpText = "Amount allowed for this individual debt.";
MaintainDebt_AmountAllowed.isReadOnly = function()
{
	Services.startTransaction();
	// Read Only if screen is in Read only mode
	var readonly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readonly == false){
		// If payment/dividend in progress - read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
	}
	Services.endTransaction();
	return readonly;
}
MaintainDebt_AmountAllowed.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AmountAllowed.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_AmountAllowed.validateOn = [MaintainDebt_AmountAllowed.dataBinding,
										 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AmountAllowed.validate = function()
{
	var errCode = null;
	
	// Defect 5653 - needs to be 2dp
	var amt = CaseManUtils.transformAmountToTwoDP(Services.getValue(MaintainDebt_AmountAllowed.dataBinding), null);
	//var amt = Services.getValue(MaintainDebt_AmountAllowed.dataBinding);
	
	if(amt != null && amt != ""){
		// check conforms to pattern
		var validCurrency = amt.search(MaintainCOVariables.CURRENCY_MAX_10_PATTERN);
		if(validCurrency < 0){			
			errCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat9_Msg');
		}
	
		if(null == errCode){
			// amount dividends + passthroughs > debt amount allowed  
			// then throw error CaseMan_debtNegative_Msg
			var dividends = Services.getValue(MaintainDebt_TotalDividend.dataBinding);
			var passThroughs = Services.getValue(MaintainDebt_TotalPassthroughs.dataBinding);
			var total = parseFloat(dividends) + parseFloat(passThroughs);
			
			// Added for Trac 3373
			total = total.toFixed(2);
			
			if(parseFloat(total) > parseFloat(amt)){
				errCode = ErrorCode.getErrorCode('CaseMan_debtNegative_Msg');
			}
			if(null == errCode){
				// check the CO will not be negative
				MaintainCOFunctions.calculateCOTotals();
				var balDue = Services.getValue("/ds/MaintainCO/DebtSummary/BalanceDueFromDebtor");
				if(balDue != null && parseFloat(balDue) < 0){
					// error
					errCode = ErrorCode.getErrorCode('CaseMan_moneyInCourtDebtNegative_Msg');
				} 
			
			}// if(null == errCode){
		} // end if(null == errCode){
	}// end if(amt != null && amt != ""){

	return errCode;
}
MaintainDebt_AmountAllowed.isMandatory = function(){
	return true;
}
MaintainDebt_AmountAllowed.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
MaintainDebt_AmountAllowed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/******************************************************************************/
function MaintainDebt_Status() {}
MaintainDebt_Status.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
//MaintainDebt_Status.srcData = MaintainCOVariables.REF_DATA_XPATH + "/DebtStatus";
MaintainDebt_Status.srcData = MaintainCOVariables.DEBT_STATUS_LIST_TMP_PATH;
MaintainDebt_Status.rowXPath = "Status";
MaintainDebt_Status.keyXPath = "Value";
MaintainDebt_Status.displayXPath = "Value";
MaintainDebt_Status.tabIndex = 1003;
MaintainDebt_Status.maxLength = 10;
MaintainDebt_Status.helpText = "The status of the debt.";
MaintainDebt_Status.readOnlyOn = [MaintainDebt_Status.dataBinding,
								  MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Status.isReadOnly = function()
{
	Services.startTransaction();
	
	// Read Only if screen is in Read only mode
	var readonly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readonly == false){
		// If payment/dividend in progress - read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
	}
	
	Services.endTransaction();
	return readonly;
}
MaintainDebt_Status.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Status.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Status.isMandatory = function(){
	return true;
}
MaintainDebt_Status.logicOn = [	MaintainDebt_Status.dataBinding];
MaintainDebt_Status.logic = function(event)
{
	if(event.getXPath() == MaintainDebt_Status.dataBinding){
		Services.startTransaction();
		
		// only worry about below if case number exists.
		var caseNumber = Services.getValue(MaintainDebt_CaseNumber.dataBinding);
		if(null != caseNumber && caseNumber != ""){
			// if original debt status not Deleted and new status is. Setup co case event 777
			var originalStatus = Services.getValue(MaintainCOVariables.DATA_STORE + "/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtStatus");
			var debtStatus = Services.getValue(MaintainDebt_Status.dataBinding);
			if(originalStatus != null && originalStatus != MaintainCOVariables.STATUS_DELETED){
				var debtSeq = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
				if(debtStatus != null && debtStatus == MaintainCOVariables.STATUS_DELETED){			
					// additional stuff for defect uct 596
					var debtorName = Services.getValue(MaintainDebt_Header_Debtor.dataBinding);
					if(null == debtorName){
						debtorName = "";
					}
					MaintainCOFunctions.setSevenSevenSevenCOCaseEvent(MaintainCOVariables.DEBT_DELETED, debtSeq, debtorName); //(pEventType, pDebtSurrID, pDebtorName)
				}
				else{
					// if original status not deleted and new status is not  - ensure not already created co case event 777
					MaintainCOFunctions.unsetSevenSevenSevenCOCaseEvent(debtSeq); //pDebtSurrID
				}
			}//if(originalStatus != null || originalStatus== MaintainCOVariables.STATUS_DELETED){
		}	
		
		Services.endTransaction();
	}
}
MaintainDebt_Status.validateOn = [MaintainDebt_Status.dataBinding,
								  MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Status.validate = function(event)
{
	var errCode = null;
	
	Services.startTransaction();
	
	if(event.getXPath() == MaintainDebt_Status.dataBinding || event.getXPath() == MaintainDebt_DebtGrid.dataBinding){
		var debtStatus = Services.getValue(MaintainDebt_Status.dataBinding);
		var debtDividend = Services.getValue(MaintainDebt_TotalDividend.dataBinding);
		var debtAmountAllowed = Services.getValue(MaintainDebt_AmountAllowed.dataBinding);
		if(null != debtStatus && debtStatus != ""){
			// need original value
			var originalStatus = Services.getValue(MaintainCOVariables.DATA_STORE + "/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtStatus");
			if(originalStatus == null || originalStatus == ""){
				// must be a new debt and not effected
				// have put comment here so know reasoning - no code required
			}
			else{
				// If status changes from PENDING,  SCHEDULE2 or DELETED 
				if(originalStatus == MaintainCOVariables.STATUS_PENDING || originalStatus == MaintainCOVariables.STATUS_SCHEDULE2 ||
						originalStatus == MaintainCOVariables.STATUS_DELETED){
					// and if not being set to either PENDING,  SCHEDULE2 or DELETED
					if(debtStatus != MaintainCOVariables.STATUS_PENDING && debtStatus != MaintainCOVariables.STATUS_SCHEDULE2 &&
						debtStatus != MaintainCOVariables.STATUS_DELETED){												
						if(MaintainCOFunctions.releasablePaymentsExist() == true){
							// and there are releasable payments ...
							// need to display the error in an alert and reset the status to original value
							errCode = ErrorCode.getErrorCode("Caseman_releasableMoneyInCourt_Msg");
							alert(errCode.getMessage());
							// reset the status to original
							Services.setValue(MaintainDebt_Status.dataBinding, originalStatus);
							// set errCode to null as dealt with issue
							errCode = null;
						}
						else if(MaintainCOFunctions.nonReleasablePaymentsExist() == true){											
							alert(Messages.NON_RELEASABLE_MONEY_IN_COURT_MSG);					
						}
					}// end if(debtStatus != MaintainCOVariables.STATUS_PENDING && d...						
				}// end if(originalStatus == MaintainCOVariables.STATUS_PENDING ||...
				
				if(errCode == null){
					// defect TEMP_CASEMAN 367  - added clause - originalStatus != MaintainCOVariables.STATUS_DELETED to if
					if(debtStatus == MaintainCOVariables.STATUS_DELETED && originalStatus != MaintainCOVariables.STATUS_DELETED){
						if(debtDividend != null && debtDividend != "" && parseFloat(debtDividend) > 0 ){
							errCode = ErrorCode.getErrorCode("Caseman_dividendDeclaredNoDelete_Msg");
						}
						else if(MaintainCOFunctions.makeCONegative(debtAmountAllowed) == true){
							errCode = ErrorCode.getErrorCode("Caseman_balanceWillBeNegNoDelete_Msg");
						}
						else if(MaintainCOFunctions.releasablePaymentsExist() == true){
							errCode = ErrorCode.getErrorCode("Caseman_needToDeclareDividendNoDelete_Msg");
						}
					}
					// defect TEMP_CASEMAN 367  - added clause - originalStatus != MaintainCOVariables.STATUS_PENDING to if
					else if(debtStatus == MaintainCOVariables.STATUS_PENDING && originalStatus != MaintainCOVariables.STATUS_PENDING){
						if(debtDividend != null && debtDividend != "" && parseFloat(debtDividend) > 0 ){
							errCode = ErrorCode.getErrorCode("Caseman_dividendExistsNoPending_Msg");
						}
						else if(MaintainCOFunctions.makeCONegative(debtAmountAllowed) == true){
							errCode = ErrorCode.getErrorCode("Caseman_coNegativeNoPending_Msg");
						}
						else if(MaintainCOFunctions.releasablePaymentsExist() == true){
							errCode = ErrorCode.getErrorCode("Caseman_releasablePaymentsNoPending_Msg");
						}
						else if(MaintainCOFunctions.nonReleasablePaymentsExist() == true){
							errCode = ErrorCode.getErrorCode("Caseman_nonReleasablePaymentsNoPending_Msg");
						}
					}
				}// if(errCode == null){
			}// end if else
	
			if(null == errCode){
				// If the CO type is CAEO and status being set to SCHEDULE2, throw error  Caseman_coTypeCAEO_Msg.
				var coType = Services.getValue(MaintainDebt_Header_Type.dataBinding);
				if(coType == MaintainCOVariables.COTypeCAEO && debtStatus == MaintainCOVariables.STATUS_SCHEDULE2){
					errCode = ErrorCode.getErrorCode("Caseman_coTypeCAEO_Msg");
				}
			}
		} // end if(null != debtStatus && debtStatus != ""){
	}
	
	Services.endTransaction();
	
	return errCode;
}

/******************************************************************************/
function MaintainDebt_TotalPassthroughsCurrency() {}
MaintainDebt_TotalPassthroughsCurrency.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalPassthroughsCurrency.tabIndex = -1;
MaintainDebt_TotalPassthroughsCurrency.maxLength = 3;
MaintainDebt_TotalPassthroughsCurrency.isReadOnly = function()
{
	return true;
}
MaintainDebt_TotalPassthroughsCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
MaintainDebt_TotalPassthroughsCurrency.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalPassthroughsCurrency.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_TotalPassthroughs() {}
MaintainDebt_TotalPassthroughs.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalPassthroughs.tabIndex = -1;
MaintainDebt_TotalPassthroughs.maxLength = 11;
MaintainDebt_TotalPassthroughs.helpText = "Total value of passthroughs for this debt.";
MaintainDebt_TotalPassthroughs.isReadOnly = function()
{
	return true;
}
MaintainDebt_TotalPassthroughs.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalPassthroughs.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_TotalPassthroughs.transformToDisplay = function(value)
{
	var returnCurrency = CaseManUtils.transformAmountToTwoDP(value, null);
	if(null == returnCurrency || returnCurrency == ""){
		returnCurrency = "0.00";
	
	}
	return returnCurrency;
}
MaintainDebt_TotalPassthroughs.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/******************************************************************************/
function MaintainDebt_TotalDividendCurrency() {}
MaintainDebt_TotalDividendCurrency.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalDividendCurrency.tabIndex = -1;
MaintainDebt_TotalDividendCurrency.maxLength = 3;
MaintainDebt_TotalDividendCurrency.isReadOnly = function()
{
	return true;
}
MaintainDebt_TotalDividendCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
MaintainDebt_TotalDividendCurrency.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalDividendCurrency.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_TotalDividend() {}
MaintainDebt_TotalDividend.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalDividend.tabIndex = -1;
MaintainDebt_TotalDividend.maxLength = 11;
MaintainDebt_TotalDividend.helpText = "Total dividend paid on this debt.";
MaintainDebt_TotalDividend.isReadOnly = function()
{
	return true;
}
MaintainDebt_TotalDividend.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_TotalDividend.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_TotalDividend.transformToDisplay = function(value)
{
	var returnCurrency = CaseManUtils.transformAmountToTwoDP(value, null);
	if(null == returnCurrency || returnCurrency == ""){
		returnCurrency = "0.00";
	
	}
	return returnCurrency;
}
MaintainDebt_TotalDividend.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/******************************************************************************/
function MaintainDebt_OutstandingBalanceCurrency() {}
MaintainDebt_OutstandingBalanceCurrency.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_OutstandingBalanceCurrency.tabIndex = -1;
MaintainDebt_OutstandingBalanceCurrency.maxLength = 3;
MaintainDebt_OutstandingBalanceCurrency.isReadOnly = function()
{
	return true;
}
MaintainDebt_OutstandingBalanceCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
MaintainDebt_OutstandingBalanceCurrency.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_OutstandingBalanceCurrency.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_OutstandingBalance() {}
MaintainDebt_OutstandingBalance.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_OutstandingBalance.tabIndex = -1;
MaintainDebt_OutstandingBalance.maxLength = 11;
MaintainDebt_OutstandingBalance.helpText = "The outstanding balance of the debt.";
MaintainDebt_OutstandingBalance.isReadOnly = function()
{
	return true;
}
MaintainDebt_OutstandingBalance.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_OutstandingBalance.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_OutstandingBalance.logicOn = [	MaintainDebt_DebtGrid.dataBinding,
											MaintainDebt_AmountAllowed.dataBinding];
MaintainDebt_OutstandingBalance.logic = function()
{
	Services.startTransaction();
	
	var passthrough = Services.getValue(MaintainDebt_TotalPassthroughs.dataBinding);
	var dividend = Services.getValue(MaintainDebt_TotalDividend.dataBinding);
	var amtAllowed = Services.getValue(MaintainDebt_AmountAllowed.dataBinding);
	
	if(null == passthrough || passthrough == ""){
		passthrough = "0.00";	
	}
	if(null == dividend || dividend == ""){
		dividend = "0.00";	
	}
	if(null == amtAllowed || amtAllowed == ""){
		amtAllowed = "0.00";	
	}
	
	var totOutstanding = parseFloat(amtAllowed) - parseFloat(dividend) - parseFloat(passthrough);
	// defect caseman 6474 - ensure 2dp
	var totOutstandingFormatted = CaseManUtils.transformAmountToTwoDP(totOutstanding, null);
	Services.setValue(MaintainDebt_OutstandingBalance.dataBinding, totOutstandingFormatted);
	
	Services.endTransaction();
}
MaintainDebt_OutstandingBalance.transformToDisplay = function(value)
{
	var returnCurrency = CaseManUtils.transformAmountToTwoDP(value, null);
	if(null == returnCurrency || returnCurrency == ""){
		returnCurrency = "0.00";
	
	}
	return returnCurrency;
}
MaintainDebt_OutstandingBalance.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/******************************************************************************/
function MaintainDebt_CaseNumber() {}
MaintainDebt_CaseNumber.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CaseNumber.tabIndex = -1;
MaintainDebt_CaseNumber.maxLength = 8;
MaintainDebt_CaseNumber.helpText = "Case number for a case debt.";
MaintainDebt_CaseNumber.isReadOnly = function()
{
	return true;
}
MaintainDebt_CaseNumber.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CaseNumber.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_CaseNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_CourtCode() {}
MaintainDebt_CourtCode.tabIndex = -1;
MaintainDebt_CourtCode.maxLength = 3;
MaintainDebt_CourtCode.helpText = "The administering court code.";
MaintainDebt_CourtCode.isReadOnly = function()
{
	return true;
}
MaintainDebt_CourtCode.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CourtCode.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_CourtCode.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
/****************************************************************************************************************/
function MaintainDebt_CourtName() {}
MaintainDebt_CourtName.tabIndex = -1;
MaintainDebt_CourtName.maxLength = 70;
MaintainDebt_CourtName.helpText = "The administering court name.";
MaintainDebt_CourtName.isReadOnly = function()
{
	return true; 
}
MaintainDebt_CourtName.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CourtName.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_CourtName.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
/****************************************************************************************************************/
function MaintainDebt_CaseParty() {}
MaintainDebt_CaseParty.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CaseParty.tabIndex = -1;
MaintainDebt_CaseParty.maxLength = 12;
MaintainDebt_CaseParty.helpText = "The name of the selected Party from the case defined as the debtor.";
MaintainDebt_CaseParty.isReadOnly = function()
{
	return true;
}
MaintainDebt_CaseParty.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CaseParty.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/

/*****************************************************************************************************************
                                        CO MAINTAIN DEBTS POPUP CREDITOR TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_CreditorCode() {}
MaintainDebt_CreditorCode.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorCode.tabIndex = 1005;
MaintainDebt_CreditorCode.maxLength = 4;
MaintainDebt_CreditorCode.helpText = "The code for a locally-coded party.";
MaintainDebt_CreditorCode.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorCode.isReadOnly = function()
{
	Services.startTransaction();
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_CreditorCode.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorCode.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

MaintainDebt_CreditorCode.validateOn = [MaintainCOVariables.VALIDATE_CRED_MAINTAIN_DEBT_CODED_PARTY_CODE, 
										MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorCode.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	if(MaintainCOFunctions.readOnlyMaintainDebtField() != true){
		var code = Services.getValue(MaintainDebt_CreditorCode.dataBinding);	
		
		// check it's numeric
		var isNumeric = CaseManValidationHelper.validateNumber(code);
		if(isNumeric == false){
			errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
		}
		else if(null != code && code != ""){
			var validateFlag = Services.getValue(MaintainCOVariables.VALIDATE_CRED_MAINTAIN_DEBT_CODED_PARTY_CODE);	
			if(null != validateFlag && validateFlag == MaintainCOVariables.YES){
				errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
			}
		}	
	}
	Services.endTransaction();
	return errCode;
}
MaintainDebt_CreditorCode.logicOn = [MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_CreditorCode.logic = function(event)
{	
	if(event.getXPath() == MaintainDebt_CreditorCode.dataBinding){
		Services.startTransaction();
		var owningCourtCode = Services.getValue(MaintainDebt_Header_OwningCourtCode.dataBinding);
		
		if(owningCourtCode != null && owningCourtCode != ""){
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_CRED_MAINTAIN_DEBT_CODED_PARTY_CODE, MaintainCOVariables.NO);
			// need to get the relevant creditor details for the selected coded party
			var credCode = Services.getValue(MaintainDebt_CreditorCode.dataBinding);
			var mainDebtAdd1 = Services.getValue(MaintainDebt_Creditor_Address_Line1.dataBinding); // used for history
			var today = MaintainCOFunctions.getTodaysDate();// used for history
			credCode = CaseManUtils.stripSpaces(credCode);
			if(null == credCode || credCode == ""){
				// need to clear the fields and save the address to history if address exists
				if(mainDebtAdd1 != null && mainDebtAdd1!= ""){
					MaintainCOFunctions.addAddressToHistory(today, MaintainCOVariables.CREDITOR_ADDRESS_XP);
					MaintainCOFunctions.clearMaintainDebtTab(MaintainCOVariables.CREDITOR_ADDRESS_XP);
				}
				Services.endTransaction();
			}
			else if(MaintainDebt_CreditorCode.validate() == null){
				//Services.setValue(MaintainCOVariables.SERVICE_CALLED, MaintainCOVariables.YES);
				var courtCode = MaintainCOFunctions.isNonCPCNationalCodedParty(credCode) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourtCode;
				Services.endTransaction();
				// need to get the creditor details via a service
				var params = new ServiceParams();
				params.addSimpleParameter("adminCourtCode", courtCode);
				params.addSimpleParameter("codedPartyCode", credCode);
				Services.callService("getCreditorCodedParty", params, MaintainDebt_CreditorCode, true);
			}
			else{
				Services.endTransaction();
			}
		}
		else{		
			alert(Messages.NEED_VALID_COURT_MESSAGE); 
			// reset the creditor code
			Services.setValue(MaintainDebt_CreditorCode.dataBinding, "");
			Services.endTransaction();
		}		
	}
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorCode.onSuccess = function(dom)
{
	if(dom != null){	
		var creditorNode = dom.selectSingleNode("/ds/Creditor");
		if(null != creditorNode){
			Services.startTransaction();
			
			// need to save the current address to history if address exists
			var mainDebtAdd1 = Services.getValue(MaintainDebt_Creditor_Address_Line1.dataBinding); // used for history
			if(mainDebtAdd1 != null && mainDebtAdd1!= ""){
				var today = MaintainCOFunctions.getTodaysDate();// used for his
				MaintainCOFunctions.addAddressToHistory(today, MaintainCOVariables.CREDITOR_ADDRESS_XP);
			}
			// need to protect the history as might have changed and will get over written
			var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory");
			// need to set creditor and payee details
			Services.replaceNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor", creditorNode);				
			// now reset the history
			Services.replaceNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory", historyNode);				
			
			// set the AddressTypeCode - needed to define if address is coded party or not when adding to history
			Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/Address/AddressTypeCode", MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY);
			
			Services.endTransaction();
		}
		else{
			// Coded Party Entered is invalid
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_CRED_MAINTAIN_DEBT_CODED_PARTY_CODE, MaintainCOVariables.YES);
			Services.setFocus("MaintainDebt_CreditorCode");
		}
 	}// end of if (dom != null)
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorCode.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Local Coded Party Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorCode.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
/******************************************************************************/
function MaintainDebt_CreditorName() {}
MaintainDebt_CreditorName.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorName.tabIndex = 1006;
MaintainDebt_CreditorName.maxLength = 70;
MaintainDebt_CreditorName.helpText = "The creditor name for this debt.";
MaintainDebt_CreditorName.logicOn = [MaintainDebt_CreditorName.dataBinding,
									 MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_CreditorName.logic = function(event)
{	
	if (event.getXPath() == MaintainDebt_CreditorName.dataBinding || event.getXPath() == MaintainDebt_CreditorCode.dataBinding){
		Services.startTransaction();
		
		var debtId = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
		// set the flag for event 985
		var changedBefore = MaintainCOFunctions.hasDebtBeenChangedReCreditorChangedEvent(debtId);//pDebtId
		if(changedBefore == false){
			// set
			MaintainCOFunctions.addDebtIdForEvent(debtId, true);//pDebtId,pTemp		
		}
		
		Services.endTransaction();
	}
}
MaintainDebt_CreditorName.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
										MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_CreditorName.isReadOnly = function()
{
	Services.startTransaction();
	
	// screen mode read only?
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();	
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_CreditorName.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorName.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_CreditorName.isMandatory = function()
{
	return true;
}
MaintainDebt_CreditorName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_CreditorName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_Line1() {}
MaintainDebt_Creditor_Address_Line1.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line1.tabIndex = -1;
MaintainDebt_Creditor_Address_Line1.maxLength = 35;
MaintainDebt_Creditor_Address_Line1.helpText = "First line of the Creditor's address.";
MaintainDebt_Creditor_Address_Line1.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Line1.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line1.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Creditor_Address_Line1.isMandatory = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_Line2() {}
MaintainDebt_Creditor_Address_Line2.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line2.tabIndex = -1;
MaintainDebt_Creditor_Address_Line2.maxLength = 35;
MaintainDebt_Creditor_Address_Line2.helpText = "Second line of the Creditor's address.";
MaintainDebt_Creditor_Address_Line2.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Line2.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line2.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Creditor_Address_Line2.isMandatory = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_Line3() {}
MaintainDebt_Creditor_Address_Line3.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line3.tabIndex = -1;
MaintainDebt_Creditor_Address_Line3.maxLength = 35;
MaintainDebt_Creditor_Address_Line3.helpText = "Third line of the Creditor's address.";
MaintainDebt_Creditor_Address_Line3.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Line3.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line3.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Creditor_Address_Line4() {}
MaintainDebt_Creditor_Address_Line4.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line4.tabIndex = -1;
MaintainDebt_Creditor_Address_Line4.maxLength = 35;
MaintainDebt_Creditor_Address_Line4.helpText = "Fourth line of the Creditor's address.";
MaintainDebt_Creditor_Address_Line4.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Line4.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line4.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Creditor_Address_Line5() {}
MaintainDebt_Creditor_Address_Line5.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line5.tabIndex = -1;
MaintainDebt_Creditor_Address_Line5.maxLength = 35;
MaintainDebt_Creditor_Address_Line5.helpText = "Fifth line of the Creditor's address.";
MaintainDebt_Creditor_Address_Line5.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Line5.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Line5.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Creditor_Address_Postcode() {}
MaintainDebt_Creditor_Address_Postcode.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Postcode.tabIndex = -1;
MaintainDebt_Creditor_Address_Postcode.maxLength = 35;
MaintainDebt_Creditor_Address_Postcode.helpText = "Postcode of the Creditor's address.";
MaintainDebt_Creditor_Address_Postcode.isReadOnly = function()
{
	return true;
}
MaintainDebt_Creditor_Address_Postcode.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Postcode.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Creditor_Address_DXNo() {}
MaintainDebt_Creditor_Address_DXNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_DXNo.tabIndex = 1008;
MaintainDebt_Creditor_Address_DXNo.maxLength = 35;
MaintainDebt_Creditor_Address_DXNo.helpText = "Document exchange reference number.";
MaintainDebt_Creditor_Address_DXNo.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_DXNo.isReadOnly = function()
{
	Services.startTransaction();
	
	// screen mode read only?
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();	
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
	
	Services.endTransaction();
	
	return readOnly;	
}
MaintainDebt_Creditor_Address_DXNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_DXNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Creditor_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Creditor_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_TelNo() {}
MaintainDebt_Creditor_Address_TelNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_TelNo.tabIndex = 1009;
MaintainDebt_Creditor_Address_TelNo.maxLength = 24;
MaintainDebt_Creditor_Address_TelNo.helpText = "Creditor's telephone number.";
MaintainDebt_Creditor_Address_TelNo.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_TelNo.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_Creditor_Address_TelNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_TelNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Creditor_Address_TelNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Creditor_Address_TelNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_FaxNo() {}
MaintainDebt_Creditor_Address_FaxNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_FaxNo.tabIndex = 1010;
MaintainDebt_Creditor_Address_FaxNo.maxLength = 24;
MaintainDebt_Creditor_Address_FaxNo.helpText = "Creditor's fax number.";
MaintainDebt_Creditor_Address_FaxNo.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_FaxNo.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_Creditor_Address_FaxNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_FaxNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Creditor_Address_FaxNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Creditor_Address_FaxNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_Email() {}
MaintainDebt_Creditor_Address_Email.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Email.tabIndex = 1011;
MaintainDebt_Creditor_Address_Email.maxLength = 80;
MaintainDebt_Creditor_Address_Email.helpText = "Creditor's email address.";
MaintainDebt_Creditor_Address_Email.validateOn = [MaintainDebt_Creditor_Address_Email.dataBinding];
MaintainDebt_Creditor_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(MaintainDebt_Creditor_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
MaintainDebt_Creditor_Address_Email.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_Email.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_Creditor_Address_Email.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Email.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Creditor_Address_CommMethod() {}
MaintainDebt_Creditor_Address_CommMethod.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
MaintainDebt_Creditor_Address_CommMethod.rowXPath = "Method";
MaintainDebt_Creditor_Address_CommMethod.keyXPath = "Id";
MaintainDebt_Creditor_Address_CommMethod.displayXPath = "Name";
MaintainDebt_Creditor_Address_CommMethod.tabIndex = 1012;
MaintainDebt_Creditor_Address_CommMethod.maxLength = 24;
MaintainDebt_Creditor_Address_CommMethod.helpText = "The preferred communication method of the Creditors.";
MaintainDebt_Creditor_Address_CommMethod.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_CommMethod.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	/* As per case screen translation to welsh and comms method are editable , even if local coded party
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
 */
	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_Creditor_Address_CommMethod.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_CommMethod.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Creditor_Address_Welsh() {}
MaintainDebt_Creditor_Address_Welsh.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
MaintainDebt_Creditor_Address_Welsh.tabIndex = 1013;
MaintainDebt_Creditor_Address_Welsh.helpText = "Tick box if the Creditor is to receive documents translated into Welsh.";
MaintainDebt_Creditor_Address_Welsh.isMandatory = function(){
	return true;
}
MaintainDebt_Creditor_Address_Welsh.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_Creditor_Address_Welsh.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	/* As per case screen translation to welsh and comms method are editable , even if local coded party
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		if(MaintainCOFunctions.codedPartyCodeEntered(MaintainDebt_CreditorCode.dataBinding) == true){
			readOnly = true;
		}
	}
 */
	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_Creditor_Address_Welsh.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_Address_Welsh.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_PayeeUnknown() {}
MaintainDebt_PayeeUnknown.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeUnknown.modelValue = {checked: 'Y', unchecked: 'N'};
MaintainDebt_PayeeUnknown.tabIndex = 1015;
MaintainDebt_PayeeUnknown.helpText = "Tick box if payee address known to be invalid.";
MaintainDebt_PayeeUnknown.isMandatory = function(){
	return true;
}
MaintainDebt_PayeeUnknown.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_PayeeUnknown.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();

	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_PayeeUnknown.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeUnknown.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_CreditorReference() {}
MaintainDebt_CreditorReference.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorReference.tabIndex = 1014;
MaintainDebt_CreditorReference.maxLength = 24;
MaintainDebt_CreditorReference.helpText = "Creditor's reference.";
MaintainDebt_CreditorReference.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding,
												MaintainDebt_CreditorCode.dataBinding];
MaintainDebt_CreditorReference.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();

	Services.endTransaction();
		
	return readOnly;
}
MaintainDebt_CreditorReference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_CreditorReference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
MaintainDebt_CreditorReference.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorReference.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/*****************************************************************************************************************
                                        MAINTAIN DEBT CREDITOR ADDRESS HISTORY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Line1() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.helpText = "First line of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line1.isReadOnly = function()
{
	return true;
}

/******************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Line2() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.helpText = "Second line of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line2.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Line3() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.helpText = "Third line of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line3.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Line4() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.helpText = "Fourth line of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line4.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Line5() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.helpText = "Fifth line of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Line5.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode() {}
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.retrieveOn = [MaintainDebt_CreditorAddressHistoryGrid.dataBinding];
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.tabIndex = -1;
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.maxLength = 35;
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.helpText = "Postcode of the Creditor's address.";
MaintainDebt_CreditorAddressHistory_Popup_Address_Postcode.isReadOnly = function()
{
	return true;
}

/*****************************************************************************************************************
                                        CO MAINTAIN DEBTS POPUP PAYEE TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_PayeeCode() {}
MaintainDebt_PayeeCode.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeCode.tabIndex = 1020;
MaintainDebt_PayeeCode.maxLength = 4;
MaintainDebt_PayeeCode.helpText = "The code for a locally-coded payee.";
MaintainDebt_PayeeCode.readOnlyOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeCode.isReadOnly = function()
{
	Services.startTransaction();
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_PayeeCode.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeCode.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

MaintainDebt_PayeeCode.validateOn = [MaintainCOVariables.VALIDATE_PAYEE_MAINTAIN_DEBT_CODED_PARTY_CODE, 
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeCode.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	if(MaintainCOFunctions.readOnlyMaintainDebtField() != true){
		var code = Services.getValue(MaintainDebt_PayeeCode.dataBinding);	
		
		// check it's numeric
		var isNumeric = CaseManValidationHelper.validateNumber(code);
		if(isNumeric == false){
			errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
		}
		else if(null != code && code != ""){
			var validateFlag = Services.getValue(MaintainCOVariables.VALIDATE_PAYEE_MAINTAIN_DEBT_CODED_PARTY_CODE);	
			if(null != validateFlag && validateFlag == MaintainCOVariables.YES){
				errCode = ErrorCode.getErrorCode("Caseman_notDefinedAsLocalParty_Msg");
			}
		}
	}
	
	Services.endTransaction();
	return errCode;
}


MaintainDebt_PayeeCode.logicOn = [MaintainDebt_PayeeCode.dataBinding];
MaintainDebt_PayeeCode.logic = function(event)
{	
	if (event.getXPath() == MaintainDebt_PayeeCode.dataBinding){
		Services.startTransaction();
	
		var owningCourtCode = Services.getValue(MaintainDebt_Header_OwningCourtCode.dataBinding);	
		
		if(owningCourtCode != null && owningCourtCode != ""){
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_PAYEE_MAINTAIN_DEBT_CODED_PARTY_CODE, MaintainCOVariables.NO);
			// need to get the relevant creditor deatils for the selected coded party
			var payCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
			if(null == payCode || payCode == ""){
				// need to clear the fields and save the address to history if address exists
				var mainDebtPayeeAdd1 = Services.getValue(MaintainDebt_Payee_Address_Line1.dataBinding); // used for history
				if(mainDebtPayeeAdd1 != null && mainDebtPayeeAdd1 != ""){
					var today = MaintainCOFunctions.getTodaysDate();// used for history
					MaintainCOFunctions.addAddressToHistory(today, MaintainCOVariables.PAYEE_ADDRESS_XP);
					MaintainCOFunctions.clearMaintainDebtTab(MaintainCOVariables.PAYEE_ADDRESS_XP);
				}
				Services.endTransaction();
			}
			else if(MaintainDebt_PayeeCode.validate() == null){
				//Services.setValue(MaintainCOVariables.SERVICE_CALLED, MaintainCOVariables.YES);		
				Services.endTransaction();
				var courtCode = MaintainCOFunctions.isNonCPCNationalCodedParty(payCode) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourtCode;
				// need to get the creditor details via a service
				var params = new ServiceParams();
				params.addSimpleParameter("adminCourtCode", courtCode);
				params.addSimpleParameter("codedPartyCode", payCode);
				Services.callService("getPayeeCodedParty", params, MaintainDebt_PayeeCode, true);
			}
			else{
				Services.endTransaction();
			}
		}
		else{		
			alert(Messages.NEED_VALID_COURT_MESSAGE); 
			// reset the creditor code
			Services.setValue(MaintainDebt_PayeeCode.dataBinding, "");
			Services.endTransaction();
		}
	}
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeCode.onSuccess = function(dom)
{
 	if(dom != null){	
		var payeeNode = dom.selectSingleNode("/ds/Payee");
		if(null != payeeNode){
			Services.startTransaction();
			
			// need to save the current address to history if address exists
			var today = MaintainCOFunctions.getTodaysDate();// used for history
			MaintainCOFunctions.addAddressToHistory(today, MaintainCOVariables.PAYEE_ADDRESS_XP);
			// need to protect the history as might have changed and will get over written
			var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory");
			// need to set creditor and payee details
			Services.replaceNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee", payeeNode);				
			// now reset the history
			Services.replaceNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory", historyNode);				
			// set the AddressTypeCode - needed to define if address is coded party or not when adding to history
			Services.setValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/Address/AddressTypeCode", MaintainCOVariables.ADDRESS_TYPE_CODED_PARTY);
			
			Services.endTransaction();
		}// if(null != payeeNode){
		else{
			// Coded Party Entered is invalid
			// set validate flag
			Services.setValue(MaintainCOVariables.VALIDATE_PAYEE_MAINTAIN_DEBT_CODED_PARTY_CODE, MaintainCOVariables.YES);
			Services.setFocus("MaintainDebt_PayeeCode");
		}	
 	}// end of if (dom != null)
 	
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeCode.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Local Coded Party Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeCode.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
/******************************************************************************/
function MaintainDebt_PayeeName() {}
MaintainDebt_PayeeName.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeName.tabIndex = 1021;
MaintainDebt_PayeeName.maxLength = 70;
MaintainDebt_PayeeName.helpText = "The payee name for this debt.";
MaintainDebt_PayeeName.readOnlyOn = [	MaintainDebt_PayeeName.dataBinding,
									 	MaintainDebt_PayeeCode.dataBinding,
									 	MaintainDebt_Payee_Address_Line1.dataBinding,
									 	MaintainDebt_Payee_Address_DXNo.dataBinding,
										MaintainDebt_Payee_Address_TelNo.dataBinding,
										MaintainDebt_Payee_Address_FaxNo.dataBinding,
										MaintainDebt_Payee_Address_Email.dataBinding,
										MaintainDebt_Payee_Address_CommMethod.dataBinding,
										MaintainDebt_Payee_Address_Welsh.dataBinding,
										MaintainDebt_Payee.dataBinding,
										MaintainDebt_PayeeReference.dataBinding,
										MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeName.isReadOnly = function()
{
	Services.startTransaction();
	
	// screen mode read only?
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_PayeeName.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeName.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_PayeeName.mandatoryOn = [	MaintainDebt_PayeeCode.dataBinding,
										MaintainDebt_PayeeName.dataBinding,
										MaintainDebt_Payee_Address_Line1.dataBinding,
										MaintainDebt_Payee_Address_Line2.dataBinding,
										MaintainDebt_Payee_Address_Line3.dataBinding,
										MaintainDebt_Payee_Address_Line4.dataBinding,
										MaintainDebt_Payee_Address_Line5.dataBinding,
										MaintainDebt_Payee_Address_Postcode.dataBinding,
										MaintainDebt_Payee_Address_DXNo.dataBinding,
										MaintainDebt_Payee_Address_TelNo.dataBinding,
										MaintainDebt_Payee_Address_FaxNo.dataBinding,
										MaintainDebt_Payee_Address_Email.dataBinding,
										MaintainDebt_Payee_Address_CommMethod.dataBinding,
										MaintainDebt_Payee_Address_Welsh.dataBinding,
										MaintainDebt_Payee.dataBinding,
										MaintainDebt_PayeeReference.dataBinding];
MaintainDebt_PayeeName.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]")== true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
MaintainDebt_PayeeName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_PayeeName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
MaintainDebt_PayeeName.logicOn = [	MaintainDebt_PayeeName.dataBinding,
									MaintainDebt_PayeeCode.dataBinding,
									MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeName.logic = function(event)
{	
	if (event.getXPath() == MaintainDebt_PayeeName.dataBinding || event.getXPath() == MaintainDebt_PayeeCode.dataBinding){
		Services.startTransaction();
		
		var debtId = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
		// set the flag for event 985
		var changedBefore = MaintainCOFunctions.hasDebtBeenChangedReCreditorChangedEvent(debtId);//pDebtId
		if(changedBefore == false){
			// set
			MaintainCOFunctions.addDebtIdForEvent(debtId, true);//pDebtId,pTemp
		
		}
		
		Services.endTransaction();
	}
}

/******************************************************************************/
function MaintainDebt_Payee_Address_Line1() {}
MaintainDebt_Payee_Address_Line1.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line1.tabIndex = -1;
MaintainDebt_Payee_Address_Line1.maxLength = 35;
MaintainDebt_Payee_Address_Line1.helpText = "First line of the Payee's address.";
MaintainDebt_Payee_Address_Line1.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Line1.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line1.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Payee_Address_Line1.mandatoryOn = [	MaintainDebt_PayeeCode.dataBinding,
													MaintainDebt_PayeeName.dataBinding,
													MaintainDebt_Payee_Address_Line1.dataBinding,
													MaintainDebt_Payee_Address_Line2.dataBinding,
													MaintainDebt_Payee_Address_Line3.dataBinding,
													MaintainDebt_Payee_Address_Line4.dataBinding,
													MaintainDebt_Payee_Address_Line5.dataBinding,
													MaintainDebt_Payee_Address_Postcode.dataBinding,
													MaintainDebt_Payee_Address_DXNo.dataBinding,
													MaintainDebt_Payee_Address_TelNo.dataBinding,
													MaintainDebt_Payee_Address_FaxNo.dataBinding,
													MaintainDebt_Payee_Address_Email.dataBinding,
													MaintainDebt_Payee_Address_CommMethod.dataBinding,
													MaintainDebt_Payee_Address_Welsh.dataBinding,
													MaintainDebt_Payee.dataBinding,
													MaintainDebt_PayeeReference.dataBinding];
MaintainDebt_Payee_Address_Line1.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]")== true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Line2() {}
MaintainDebt_Payee_Address_Line2.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line2.tabIndex = -1;
MaintainDebt_Payee_Address_Line2.maxLength = 35;
MaintainDebt_Payee_Address_Line2.helpText = "Second line of the Payee's address.";
MaintainDebt_Payee_Address_Line2.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Line2.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line2.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Payee_Address_Line2.mandatoryOn = [	MaintainDebt_PayeeCode.dataBinding,
													MaintainDebt_PayeeName.dataBinding,
													MaintainDebt_Payee_Address_Line1.dataBinding,
													MaintainDebt_Payee_Address_Line2.dataBinding,
													MaintainDebt_Payee_Address_Line3.dataBinding,
													MaintainDebt_Payee_Address_Line4.dataBinding,
													MaintainDebt_Payee_Address_Line5.dataBinding,
													MaintainDebt_Payee_Address_Postcode.dataBinding,
													MaintainDebt_Payee_Address_DXNo.dataBinding,
													MaintainDebt_Payee_Address_TelNo.dataBinding,
													MaintainDebt_Payee_Address_FaxNo.dataBinding,
													MaintainDebt_Payee_Address_Email.dataBinding,
													MaintainDebt_Payee_Address_CommMethod.dataBinding,
													MaintainDebt_Payee_Address_Welsh.dataBinding,
													MaintainDebt_Payee.dataBinding,
													MaintainDebt_PayeeReference.dataBinding];
MaintainDebt_Payee_Address_Line2.isMandatory = function()
{	
	var mandatory = false;
	Services.startTransaction();
	
	if(MaintainCOFunctions.payeeAddressFieldMandatory("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]")== true){
		mandatory = true;
	}
	
	Services.endTransaction();
	return mandatory;
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Line3() {}
MaintainDebt_Payee_Address_Line3.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line3.tabIndex = -1;
MaintainDebt_Payee_Address_Line3.maxLength = 35;
MaintainDebt_Payee_Address_Line3.helpText = "Third line of the Payee's address.";
MaintainDebt_Payee_Address_Line3.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Line3.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line3.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Line4() {}
MaintainDebt_Payee_Address_Line4.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line4.tabIndex = -1;
MaintainDebt_Payee_Address_Line4.maxLength = 35;
MaintainDebt_Payee_Address_Line4.helpText = "Fourth line of the Payee's address.";
MaintainDebt_Payee_Address_Line4.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Line4.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line4.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Line5() {}
MaintainDebt_Payee_Address_Line5.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line5.tabIndex = -1;
MaintainDebt_Payee_Address_Line5.maxLength = 35;
MaintainDebt_Payee_Address_Line5.helpText = "Fifth line of the Payee's address.";
MaintainDebt_Payee_Address_Line5.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Line5.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Line5.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Postcode() {}
MaintainDebt_Payee_Address_Postcode.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Postcode.tabIndex = -1;
MaintainDebt_Payee_Address_Postcode.maxLength = 35;
MaintainDebt_Payee_Address_Postcode.helpText = "Postcode of the Payee's address.";
MaintainDebt_Payee_Address_Postcode.isReadOnly = function()
{
	return true;
}
MaintainDebt_Payee_Address_Postcode.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Postcode.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Payee_Address_DXNo() {}
MaintainDebt_Payee_Address_DXNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_DXNo.tabIndex = 1023;
MaintainDebt_Payee_Address_DXNo.maxLength = 35;
MaintainDebt_Payee_Address_DXNo.helpText = "Document exchange reference number.";
MaintainDebt_Payee_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Payee_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
MaintainDebt_Payee_Address_DXNo.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 		  MaintainDebt_PayeeCode.dataBinding,
									 		  MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_DXNo.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_DXNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_DXNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Payee_Address_TelNo() {}
MaintainDebt_Payee_Address_TelNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_TelNo.tabIndex = 1024;
MaintainDebt_Payee_Address_TelNo.maxLength = 24;
MaintainDebt_Payee_Address_TelNo.helpText = "Payee's telephone number.";
MaintainDebt_Payee_Address_TelNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Payee_Address_TelNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
MaintainDebt_Payee_Address_TelNo.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_TelNo.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_TelNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_TelNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Payee_Address_FaxNo() {}
MaintainDebt_Payee_Address_FaxNo.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_FaxNo.tabIndex = 1025;
MaintainDebt_Payee_Address_FaxNo.maxLength = 24;
MaintainDebt_Payee_Address_FaxNo.helpText = "Payee's fax number.";
MaintainDebt_Payee_Address_FaxNo.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_FaxNo.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_FaxNo.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_FaxNo.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
MaintainDebt_Payee_Address_FaxNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_Payee_Address_FaxNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function MaintainDebt_Payee_Address_Email() {}
MaintainDebt_Payee_Address_Email.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Email.tabIndex = 1026;
MaintainDebt_Payee_Address_Email.maxLength = 80;
MaintainDebt_Payee_Address_Email.helpText = "Payee's email address.";
MaintainDebt_Payee_Address_Email.validateOn = [MaintainDebt_Payee_Address_Email.dataBinding];
MaintainDebt_Payee_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(MaintainDebt_Payee_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
MaintainDebt_Payee_Address_Email.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Email.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_Email.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Email.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}
/******************************************************************************/
function MaintainDebt_Payee_Address_CommMethod() {}
MaintainDebt_Payee_Address_CommMethod.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
MaintainDebt_Payee_Address_CommMethod.rowXPath = "Method";
MaintainDebt_Payee_Address_CommMethod.keyXPath = "Id";
MaintainDebt_Payee_Address_CommMethod.displayXPath = "Name";
MaintainDebt_Payee_Address_CommMethod.tabIndex = 1027;
MaintainDebt_Payee_Address_CommMethod.maxLength = 24;
MaintainDebt_Payee_Address_CommMethod.helpText = "The preferred communication method of the Payee's.";
MaintainDebt_Payee_Address_CommMethod.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_CommMethod.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	/* As per case screen translation to welsh and comms method are editable , even if local coded party
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
 */
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_CommMethod.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_CommMethod.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Payee_Address_Welsh() {}
MaintainDebt_Payee_Address_Welsh.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
MaintainDebt_Payee_Address_Welsh.tabIndex = 1028;
MaintainDebt_Payee_Address_Welsh.helpText = "Tick box if the Payee is to receive documents translated into Welsh.";
MaintainDebt_Payee_Address_Welsh.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 		MaintainDebt_PayeeCode.dataBinding,
									 		MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Welsh.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	/* As per case screen translation to welsh and comms method are editable , even if local coded party
	if(readOnly == false){
		// Read only if creditor code has been entered - valid or not.
		var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
		if(payeeCode != null && payeeCode != ""){
			readOnly = true;
		}
	}
 */
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee_Address_Welsh.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_Address_Welsh.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_Payee() {}
MaintainDebt_Payee.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee.modelValue = {checked: 'Y', unchecked: 'N'};
MaintainDebt_Payee.tabIndex = 1030;
MaintainDebt_Payee.helpText = "Flag to identify if Payee is to receive dividend.";
MaintainDebt_Payee.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_Payee.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/******************************************************************************/
function MaintainDebt_PayeeReference() {}
MaintainDebt_PayeeReference.retrieveOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeReference.tabIndex = 1029;
MaintainDebt_PayeeReference.maxLength = 24;
MaintainDebt_PayeeReference.helpText = "The payee reference.";
MaintainDebt_PayeeReference.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
MaintainDebt_PayeeReference.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
MaintainDebt_PayeeReference.readOnlyOn = [MaintainDebt_PayeeName.dataBinding,
									 MaintainDebt_PayeeCode.dataBinding,
									 MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeReference.isReadOnly = function()
{
	Services.startTransaction();
	
	var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
	
	Services.endTransaction();
	
	return readOnly;
}
MaintainDebt_PayeeReference.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeReference.isEnabled = function()
{
	return MaintainCOFunctions.debtsExistsOnCO();
}

/*****************************************************************************************************************
                                        MAINTAIN DEBT PAYEE ADDRESS HISTORY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Line1() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.helpText = "First line of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line1.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Line2() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.helpText = "Second line of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line2.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Line3() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.helpText = "Third line of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line3.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Line4() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.helpText = "Fourth line of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line4.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Line5() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.helpText = "Fifth line of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Line5.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode() {}
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.retrieveOn = [MaintainDebt_PayeeAddressHistoryGrid.dataBinding];
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.tabIndex = -1;
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.maxLength = 35;
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.helpText = "Postcode of the Payee's address.";
MaintainDebt_PayeeAddressHistory_Popup_Address_Postcode.isReadOnly = function()
{
	return true;
}

/*****************************************************************************************************************
                                        BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/
function Status_MaintainDebtOk() {}
Status_MaintainDebtOk.tabIndex = 1034;
/**
 * @author rzhh8k
 * 
 */
Status_MaintainDebtOk.actionBinding = function()
{
	Services.startTransaction();
	if(MaintainCOFunctions.isScreenModeReadOnly() == false){
		if(MaintainCOFunctions.isValidMaintainDebt() == true){
			Services.startTransaction();
			// check for event 985 - only do in maintain mode
			if(MaintainCOFunctions.isScreenModeMaintain() == true){
				// set message re save required
				Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
				// get the list of debts that have been changed and add them to the correct place
				// get list of debts		
				var debtIdTempList = Services.getNodes(MaintainCOVariables.TMP_DEBT_SEQ_AMENDED + "/DebtSeqNumber");
				// now loop through each 
				// and if so, is it for the Party we are looking for.
				if(debtIdTempList != null && debtIdTempList.length != 0){
					var id = null;
					for(var i = 0;i < debtIdTempList.length; i++){
						id = debtIdTempList[i].text;
						if(id != null && id != ""){
							// add to correct place
							MaintainCOFunctions.addDebtIdForEvent(id, false) //pDebtId, pTemp
						}
					}//for
				}//if(debtIdTempList != null && debtIdTempList.length != 0){
			}//	if(MaintainCOFunctions.isScreenModeMaintain() == true){
			// copy the data
			// Remove the node that is used to reset if button selected
			//Services.removeNode(MaintainCOVariables.DATA_STORE + "/MaintainCO"); 
			MaintainCOFunctions.copyData(true, true);//pCopyToAppFlags, pRemoveOrigNode
			Services.endTransaction();
			NavigationController.nextScreen();
		}//if(MaintainCOFunctions.isValidMaintainDebt() == true){
		else{
			alert(Messages.INVALID_MESSAGE);
		}
	}//if(MaintainCOFunctions.isScreenModeReadOnly() == false){
	else{		
		MaintainCOFunctions.exitScreen();
	}
	Services.endTransaction();
}
Status_MaintainDebtOk.enableOn = [MaintainDebt_DebtGrid.dataBinding];
Status_MaintainDebtOk.isEnabled = function()
{
	// Get the screen mode
	var mode = Services.getValue(ManageCOParams.MODE);
	var enableLOV = true;
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		enableLOV = false;		
	}
	else if(MaintainCOFunctions.debtsExistsOnCO() == false){
		enableLOV = false;
	}
	
	return enableLOV;
}

/************************************************************************************/
function Status_MaintainDebtCancel() {}
Status_MaintainDebtCancel.tabIndex = 1035;
Status_MaintainDebtCancel.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainDebt" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
Status_MaintainDebtCancel.actionBinding = function()
{
	//MaintainCOFunctions.copyData(false, true);//pCopyToAppFlags, pRemoveOrigNode
	var mode = Services.getValue(ManageCOParams.MODE);
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		// need to remove refdata
		Services.removeNode(MaintainCOVariables.REF_DATA_XPATH);
	}
	NavigationController.nextScreen();
}

/************************************************************************************/
function MaintainDebt_AddDebtBtn() {}
MaintainDebt_AddDebtBtn.tabIndex = 1001;
MaintainDebt_AddDebtBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainDebt" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_AddDebtBtn.actionBinding = function()
{	
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		// if CO Status is not one of LIVE, APPLN, SUSPENDED, SET ASIDE or DEBTR PAYING -
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else if(MaintainCOFunctions.releasablePaymentsExist == true){
		// If there are releasable payments where the accumulated amount > 0 for this CO then
		// display RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG message.
		alert(Messages.Messages.RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG);
	}
	else if(MaintainCOFunctions.nonReleasablePaymentsExist == true){
		// If there are NON releasable payments where the accumulated amount > 0 then warning
		// message NON_RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG is displayed.
		alert(Messages.Messages.NON_RELEASABLE_MONEY_IN_COURT_ADDBUTTON_MSG);
	}
	else{
		// load refdata
		MaintainCOFunctions.loadCOReferenceData(MaintainCOVariables.ADD_DEBT_REFDATA);
	    Services.dispatchEvent("addDebt_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}
MaintainDebt_AddDebtBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_AddDebtBtn.isEnabled = function()
{
	var enabled = true;
	if(MaintainCOFunctions.isScreenModeReadOnly() == true){
		enabled = false;
	}
	return enabled;
}
/************************************************************************************/
function MaintainDebt_CreditorAddAddressBtn() {}
MaintainDebt_CreditorAddAddressBtn.tabIndex = 1016;
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorAddAddressBtn.actionBinding = function()
{
	Services.startTransaction();
	
	var creditorCode = Services.getValue(MaintainDebt_CreditorCode.dataBinding);
	
	if(MaintainCOFunctions.isScreenModeReadOnly() == true){
		// if screen status is Read Only display correct message
		alert(Messages.READ_ONLY_CANNOT_ADD);
	}
	else if(MaintainCOFunctions.statusAllowsUpdate() == false){
		// if CO Status is not one of LIVE, APPLN, SUSPENDED, SET ASIDE or DEBTR PAYING -
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else if(creditorCode != null && creditorCode != ""){
		// If a local coded party code has been entered can not add new address 
		// before clearing the local coded party code field.
		alert(Messages.CODED_PARTY_SELECTED_NO_ADD_ADDR_MESSAGE);
	}
	else{
		// ok display subform
		MaintainCOFunctions.resetTempAddress();
		// need to set up the flag re which addrtess adding creditor or payee
		Services.setValue(MaintainCOVariables.ADDING_CREDITOR_ADDRESS, MaintainCOVariables.YES);	
		Services.dispatchEvent("addCoAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	
	Services.endTransaction();
}
MaintainDebt_CreditorAddAddressBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorAddAddressBtn.isEnabled = function()
{
	var enabled = MaintainCOFunctions.debtsExistsOnCO();
	if(enabled == true){
		var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
		if(readOnly == true){
			enabled = false;
		}
	}
	
	return enabled;
}

/************************************************************************************/
function MaintainDebt_CreditorViewHistoricalAddressBtn() {}
MaintainDebt_CreditorViewHistoricalAddressBtn.tabIndex = 1017;
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorViewHistoricalAddressBtn.actionBinding = function()
{
	Services.startTransaction();

	var historyExists = true;
	// have we got history already
	var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory");
	if(historyNode == null || historyNode.childNodes.length < 1){
		historyExists = false;
	}
	var debtNumber = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	var flagPath = "/HistoryFor" + debtNumber;
	var previousHistoryRetrieved = Services.getValue(MaintainCOVariables.CREDITOR_HISTORY_RETRIEVED + flagPath);
	
	
	// look at retrieve history flag
	if(null != previousHistoryRetrieved && previousHistoryRetrieved == MaintainCOVariables.YES){		
		if(historyExists == false){
			alert(Messages.NO_ADDRESS_HISTORY);
		}
		else{
			Services.dispatchEvent("MaintainDebt_CreditorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
		}
	}	
	else{
		var coNo = Services.getValue(MaintainDebt_Header_CONumber.dataBinding);
		var debtId = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtSeq");
		if(coNo != null && coNo != "" && debtId != null && debtId != ""){			
			var params = new ServiceParams();
			params.addSimpleParameter("addressTypeCode", MaintainCOVariables.ADDRESS_HISTORY_CREDITOR);
			params.addSimpleParameter("coNumber", coNo.toUpperCase());
			params.addSimpleParameter("debtSeq", debtId);
			
			Services.callService("getAddressHistory", params, MaintainDebt_CreditorViewHistoricalAddressBtn, true);
		}
		else{
			if(historyExists == false){
				alert(Messages.NO_ADDRESS_HISTORY);
			}
			else{
				Services.dispatchEvent("MaintainDebt_CreditorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
			}
		}
	}
	Services.endTransaction();
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorViewHistoricalAddressBtn.onSuccess = function(dom)
{	
	var debtNumber = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	var flagPath = "/HistoryFor" + debtNumber;
	Services.setValue(MaintainCOVariables.CREDITOR_HISTORY_RETRIEVED + flagPath, MaintainCOVariables.YES);
	if(dom != null){
		// Need to get any address history that is already there - i.e. new history
		var historyExists = false
		var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory");
		if(historyNode == null || historyNode.childNodes.length > 0){
			historyExists = true;
		}
		var historyNode = dom.selectSingleNode("/ds/AddressHistory");
		if(null != historyNode && historyNode.childNodes.length > 0){
			var historyIdList = dom.selectNodes("/ds/AddressHistory/Address/AddressId");

			// Now loop through each 
			if(historyIdList != null && historyIdList.length != 0){
				// Loop through the list and ...
				var id = null;
				var addressNode = null;
				for(var i = 0;i < historyIdList.length; i++){
					id = historyIdList[i].text;
					if(id != null && id != ""){
						addressNode = dom.selectSingleNode("ds/AddressHistory/Address[./AddressId = '" + id + "']");
						// add the node
						Services.addNode(addressNode, "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Creditor/AddressHistory");
					}					
					
				}// for
			} // end if(historyIdList != null && historyIdList.length != 0){		
			
			Services.dispatchEvent("MaintainDebt_CreditorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);			
		}
		else if(historyExists == true){
			// view new history
			Services.dispatchEvent("MaintainDebt_CreditorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);		
		}
		else{
			alert(Messages.NO_ADDRESS_HISTORY);
		}	
 	}// end of if (dom != null)
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorViewHistoricalAddressBtn.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Creditor/Payee History Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_CreditorViewHistoricalAddressBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
MaintainDebt_CreditorViewHistoricalAddressBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_CreditorViewHistoricalAddressBtn.isEnabled = function()
{
	// defect 325 - if in create mode disable the history button
	var enabled = MaintainCOFunctions.debtsExistsOnCO();
	if(null != enabled && enabled != false){
		if(MaintainCOFunctions.isScreenModeCreate() == true){
			enabled = false;
		}
	}
	return enabled;
}

/************************************************************************************/
function MaintainDebt_CreditorAddressHistory_Popup_CloseBtn() {}
MaintainDebt_CreditorAddressHistory_Popup_CloseBtn.tabIndex = 1109;

/************************************************************************************/
function MaintainDebt_PayeeViewHistoricalAddressBtn() {}
MaintainDebt_PayeeViewHistoricalAddressBtn.tabIndex = 1032;
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeViewHistoricalAddressBtn.actionBinding = function()
{
	Services.startTransaction();

	var historyExists = true;
	// have we got history already
	var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory");
	if(historyNode == null || historyNode.childNodes.length < 1){
		historyExists = false;
	}
	var debtNumber = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	var flagPath = "/HistoryFor" + debtNumber;
	var previousHistoryRetrieved = Services.getValue(MaintainCOVariables.PAYEE_HISTORY_RETRIEVED + flagPath);
		
	// look at retrieve history flag
	if(null != previousHistoryRetrieved && previousHistoryRetrieved == MaintainCOVariables.YES){		
		if(historyExists == false){
			alert(Messages.NO_ADDRESS_HISTORY);
		}
		else{
			Services.dispatchEvent("MaintainDebt_PayeeAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
		}
	}	
	else{
		var coNo = Services.getValue(MaintainDebt_Header_CONumber.dataBinding);
		var debtId = Services.getValue("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/DebtSeq");
		if(coNo != null && coNo != "" && debtId != null && debtId != ""){			
			var params = new ServiceParams();
			params.addSimpleParameter("addressTypeCode", MaintainCOVariables.ADDRESS_HISTORY_PAYEE);
			params.addSimpleParameter("coNumber", coNo.toUpperCase());
			params.addSimpleParameter("debtSeq", debtId);
			
			Services.callService("getAddressHistory", params, MaintainDebt_PayeeViewHistoricalAddressBtn, true);
		}
		else{
			if(historyExists == false){
				alert(Messages.NO_ADDRESS_HISTORY);
			}
			else{
				Services.dispatchEvent("MaintainDebt_PayeeAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
			}
		}
	}
	Services.endTransaction();
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeViewHistoricalAddressBtn.onSuccess = function(dom)
{
	Services.startTransaction();
	var debtNumber = Services.getValue(MaintainDebt_DebtGrid.dataBinding);
	var flagPath = "/HistoryFor" + debtNumber;
	Services.setValue(MaintainCOVariables.PAYEE_HISTORY_RETRIEVED + flagPath, MaintainCOVariables.YES);
	if(dom != null){
		// Need to get any address history that is already there - i.e. new history
		var historyExists = false
		var historyNode = Services.getNode("/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory");
		if(historyNode != null && historyNode.childNodes.length > 0){
			historyExists = true;
		}
		var historyNode = dom.selectSingleNode("/ds/AddressHistory");
		if(null != historyNode && historyNode.childNodes.length > 0){
			var historyIdList = dom.selectNodes("/ds/AddressHistory/Address/AddressId");

			// Now loop through each 
			if(historyIdList != null && historyIdList.length != 0){
				// Loop through the list and ...
				var id = null;
				var addressNode = null;
				for(var i = 0;i < historyIdList.length; i++){
					id = historyIdList[i].text;
					if(id != null && id != ""){
						addressNode = dom.selectSingleNode("/ds/AddressHistory/Address[./AddressId = '" + id + "']");
						// add the node
						Services.addNode(addressNode, "/ds/MaintainCO/Debts/Debt[./DebtSurrogateId = " + MaintainDebt_DebtGrid.dataBinding + "]/Payee/AddressHistory");
					}					
					
				}// for
			} // end if(historyIdList != null && historyIdList.length != 0){		
			
			Services.dispatchEvent("MaintainDebt_PayeeAddressHistory", PopupGUIAdaptor.EVENT_RAISE);			
		}
		else if(historyExists == true){
			// view new history
			Services.dispatchEvent("MaintainDebt_PayeeAddressHistory", PopupGUIAdaptor.EVENT_RAISE);		
		}
		else{
			alert(Messages.NO_ADDRESS_HISTORY);
		}	
 	}// end of if (dom != null)
 	Services.endTransaction();
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeViewHistoricalAddressBtn.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Payee History Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeViewHistoricalAddressBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
MaintainDebt_PayeeViewHistoricalAddressBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeViewHistoricalAddressBtn.isEnabled = function()
{
	// defect 325 - if in create mode disable the history button
	var enabled = MaintainCOFunctions.debtsExistsOnCO();
	if(null != enabled && enabled != false){
		if(MaintainCOFunctions.isScreenModeCreate() == true){
			enabled = false;
		}
	}
	return enabled;
}

/************************************************************************************/
function MaintainDebt_PayeeAddressHistory_Popup_CloseBtn() {}
MaintainDebt_PayeeAddressHistory_Popup_CloseBtn.tabIndex = 1119;

/************************************************************************************/
function MaintainDebt_PayeeAddAddressBtn() {}
MaintainDebt_PayeeAddAddressBtn.tabIndex = 1031;
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_PayeeAddAddressBtn.actionBinding = function()
{
	Services.startTransaction();
	
	var payeeCode = Services.getValue(MaintainDebt_PayeeCode.dataBinding);
	
	if(MaintainCOFunctions.isScreenModeReadOnly() == true){
		// if screen status is Read Only display correct message
		alert(Messages.READ_ONLY_CANNOT_ADD);
	}
	else if(MaintainCOFunctions.statusAllowsUpdate() == false){
		// if CO Status is not one of LIVE, APPLN, SUSPENDED, SET ASIDE or DEBTR PAYING -
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else if(payeeCode != null && payeeCode != ""){
		// If a local coded party code has been entered can not add new address 
		// before clearing the local coded party code field.
		alert(Messages.CODED_PARTY_SELECTED_NO_ADD_ADDR_MESSAGE);	
	}
	else{
		// ok display popup
		MaintainCOFunctions.resetTempAddress();
		//Services.dispatchEvent("AddPayeeAddress", PopupGUIAdaptor.EVENT_RAISE);
		
		// ok display subform
		// need to set up the flag re which addrtess adding creditor or payee
		Services.setValue(MaintainCOVariables.ADDING_CREDITOR_ADDRESS, MaintainCOVariables.NO);	
		Services.dispatchEvent("addCoAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	
	Services.endTransaction();
}
MaintainDebt_PayeeAddAddressBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_PayeeAddAddressBtn.isEnabled = function()
{
	var enabled = MaintainCOFunctions.debtsExistsOnCO();
	if(enabled == true){
		var readOnly = MaintainCOFunctions.readOnlyMaintainDebtField();
		if(readOnly == true){
			enabled = false;
		}
	}
	
	return enabled;
}

/*****************************************************************************************************************
										LOV BUTTONS															
********************************************************************************/
function MaintainDebt_Creditor_LOVBtn() {}
MaintainDebt_Creditor_LOVBtn.tabIndex = 1007;
MaintainDebt_Creditor_LOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "MaintainDebt_CreditorCode" }, { key: Key.F6, element: "MaintainDebt_CreditorName" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_Creditor_LOVBtn.actionBinding = function()
{
	var owningCourtCode = Services.getValue(MaintainDebt_Header_OwningCourtCode.dataBinding);	
	
	if(owningCourtCode != null && owningCourtCode != ""){
		Services.setValue(MaintainCOVariables.WHICH_LOV_MAINTAIN_DEBT_CODED_PARTY_CODE, "cred");
		Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else{
		Services.endTransaction();
		alert(Messages.NEED_VALID_COURT_MESSAGE);
	}	
}
MaintainDebt_Creditor_LOVBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Creditor_LOVBtn.isEnabled = function()
{
	// Get the screen mode
	var mode = Services.getValue(ManageCOParams.MODE);
	var enableLOV = true;
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		enableLOV = false;		
	}
	else if(MaintainCOFunctions.debtsExistsOnCO() == false){
		enableLOV = false;
	}
	else if(MaintainCOFunctions.readOnlyMaintainDebtField() == true){
		enableLOV = false;	
	}
	
	return enableLOV;
}
/********************************************************************************/
function MaintainDebt_Payee_LOVBtn() {}
MaintainDebt_Payee_LOVBtn.tabIndex = 1023;
MaintainDebt_Payee_LOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "MaintainDebt_PayeeCode" }, { key: Key.F6, element: "MaintainDebt_PayeeName" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
MaintainDebt_Payee_LOVBtn.actionBinding = function()
{
	Services.startTransaction();
	
	var getPartyList = false;
	// need to get list of coded parties if required
	
	var owningCourtCode = Services.getValue(MaintainDebt_Header_OwningCourtCode.dataBinding);	
	
	if(owningCourtCode != null && owningCourtCode != ""){
		Services.setValue(MaintainCOVariables.WHICH_LOV_MAINTAIN_DEBT_CODED_PARTY_CODE, "pay");
		Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else{
		
		alert(Messages.NEED_VALID_COURT_MESSAGE);
	}
	Services.endTransaction();
}

MaintainDebt_Payee_LOVBtn.enableOn = [MaintainDebt_DebtGrid.dataBinding];
MaintainDebt_Payee_LOVBtn.isEnabled = function()
{
	// Get the screen mode
	var mode = Services.getValue(ManageCOParams.MODE);
	var enableLOV = true;
	if(mode != null && mode == ManageCOParamsConstants.READONLY_MODE){
		enableLOV = false;		
	}
	else if(MaintainCOFunctions.debtsExistsOnCO() == false){
		enableLOV = false;
	}
	else if(MaintainCOFunctions.readOnlyMaintainDebtField() == true){
		enableLOV = false;	
	}
	
	return enableLOV;
}
