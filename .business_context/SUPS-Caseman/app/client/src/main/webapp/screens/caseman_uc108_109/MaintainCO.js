/** 
 * @fileoverview MaintainCO.js:
 * This file contains the form configurations for the UC108 & UC109 - Maintain Consolidated Orders screen
 *
 * @author MGG
 * @version 1.0
 * local V2
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Added missing keyBindings including F6 on the owning court code & name fields,
 *				Alt + C on the clear button and F4 on the close buttons of the popups.
 * 13/06/2006 - Chris Vincent: added the action after save mechanism in Status_Save.onSuccess() and altered
 *				Status_Close.actionBinding & Status_Clear.actionBinding to use the mechanism.
 * 14/06/2006 - Chris Vincent: on text fields with no special validation updated transform to model to remove
 *				trailing and leading whitespace, particularly important on mandatory text fields where a blank
 *				space can be entered which can cause the screen to crash.
 *				Removed transforms to display/model on permanently read only fields (e.g. address) as is no need.
 *				Email address and Created By fields no longer converted to upper case to match other screens.
 *				Email address should no be transformed to upper case in particular.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 12/09/2006 - Chris Vincent, fixed defect 5185 which was causing the screen to clear when the Maintain
 *				Debts button was clicked multiple times.  CO_MaintainDebtBtn.actionBinding updated so only calls
 *				the copyData() function once ensuring data is not cleared.
 * 21/09/2006 - Mark Groen, fixed defect 5217 re there was an error with validating the instalment amount when it was 
 *				set to 12.50, 6.20 etc.
 * 24/11/2006 - Mark Groen, fixed defect uct 766 - If only change the application date, cannot save
 * 28/11/2006 - Chris Vincent, added a few lines to CODetails_Target.logic to set the Target Amount Currency field
 * 				with the default currency from the reference data at the same time Target Amount is set.  This is
 * 				to prevent the currency field being blank on loading of an existing CO.  UCT Defect 760
 * 08/01/2007 - Mark Groen, TEMP_CASEMAN defect 325 - if in create mode disable the history buttons
 * 24/01/2007 - Chris Vincent, updated CODetails_Target.logic() to use the CaseManUtils currency constant
 * 				instead of the COVariables.  Temp_CaseMan Defect 309.
 * 26/04/2007 - Mark Groen, CASEMAN defect 6178 - unable to remove Old CO number without amending another field 
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in Status_Clear.actionBinding and 
 * 				Status_Save.onSuccess which clears any navigation stack and form parameters allowing the user to return 
 * 				back to the main menu when click close immediately after.  UCT_Group2 Defect 1415.
 * 15/02/2011 - Chris Vincent, added transferCO_subform.prePopupPrepare to send data to subform for validation, amended
 *				transferCO_subform.processReturnedData to change owning court, maintain the current CO status and CO
 *				Event creation.  Also changed Header_OwningCourtCode.logic() to prevent foreign record popup.  Trac 4215.
 */
 
/****************************************************************************************************************
                                  MAIN FUNCTION CALLED BY HTML
****************************************************************************************************************/

/*****************************************************************************************************************
                                               MAIN FORM
****************************************************************************************************************/
function MaintainCO() {}

/**
 * @author rzhh8k
 * 
 */
MaintainCO.initialise = function()
{
	Services.startTransaction();	
	// Set the correct tab to be displayed
	Services.setValue(COTabSelector.dataBinding, "TabDebtorAddress");	
	// Get the screen mode
	var coMode = Services.getValue(ManageCOParams.MODE);
	// check we have a co number
	var coNumber = Services.getValue(ManageCOParams.CO_NUMBER);
	if(MaintainCOFunctions.maintainedDebts() == true){
		// user has maintained debts - i.e. are they returning from there to this screen
		// copy the details back to the correct part of the DOM
		MaintainCOFunctions.copyData(false, true);//pCopyToAppFlags, pRemoveOrigNode
		// set the totals in case new debts added or deleted
		MaintainCOFunctions.calculateCOTotals();
		Services.setFocus("Status_Save");
	}
	else if(null == coNumber || coNumber == ""){
		// If no CO Numer has to be in initial mode
		Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.INITIAL_MODE);
		Services.setFocus("Header_CONumber");
	}
	else{
		// load refdata
		MaintainCOFunctions.loadCOReferenceData(MaintainCOVariables.MAINTAIN_CO_REFDATA);
		// check if the user has not maintained debts 	
		// Set the CO number in the dom
		Services.setValue("/ds/MaintainCO/CONumber", coNumber);
		Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.MAINTAIN_MODE);
		// Get the CO via a service.
		MaintainCOFunctions.getCO(	coNumber,
									true); //pInitialising
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
MaintainCO.onSuccess = function(dom, serviceName)
{
	switch (serviceName){
		case "getCourtsShort":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/Courts", dom);
			break;		
		case "getCoCompositionTypeList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/COCompTypes", dom);
			break;
		case "getCurrentCurrency":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency", dom);
			break;		
		case "getPrefCommMethodList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods", dom);
			break;
		case "getCoFrequencyList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/COFrequency", dom);
			break;
		case "getCoTypeList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/COTypes", dom);
			break;
		case "getFeeRateList":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/FeeRates", dom);
			break;
		case "getSystemDate":
			Services.replaceNode(MaintainCOVariables.REF_DATA_XPATH + "/SystemDate", dom);
			break;
		default:
			break;				
	}
}
/**
 * load data is a div tag in the html and is used to make the callback to onSuccess from the load up
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
		Services.startTransaction();
		var result = dom.selectSingleNode("/ds/MaintainCO");
		if(null != result){
			Services.replaceNode("/ds/MaintainCO", result);
		}
		
		// set some original values to test on
		var debtor = Services.getValue(Header_Debtor.dataBinding);
		Services.setValue(MaintainCOVariables.ORIGINAL_DEBTOR_NAME, debtor);
		
		var employer = Services.getValue(CO_EmploymentDetails_Employer.dataBinding);
		Services.setValue(MaintainCOVariables.ORIGINAL_EMPLOYER_NAME, employer);
		// Set the correct tab to be displayed
		Services.setValue(COTabSelector.dataBinding, "TabDebtorAddress");
		// set the totals
		MaintainCOFunctions.calculateCOTotals();
		
		MaintainCOFunctions.setScreenMode(ManageCOParamsConstants.MAINTAIN_MODE);
		
		// display message to user if payment/duividend in progress
		if(MaintainCOFunctions.isPaymentDividendInProgress() == true){
			alert(Messages.PAYMENT_DIVIDEND_IN_PROGRESS);
		}		
		Services.setFocus("Header_COOldNumber");
		
		Services.endTransaction();
 	}// end of if (dom != null) 	
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
loadData.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Loading CO Details"));
	aintainCOFunctions.exitScreen(false);
}

/*****************************************************************************************************************
                                               SUBFORMS
*****************************************************************************************************************/
function transferCO_subform() {}
transferCO_subform.subformName = "TransferCOSubform";

transferCO_subform.prePopupPrepare = function()
{
	// Send the current Court Code to prevent user from transferring to themselves
	var currentCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	Services.setValue(MaintainCOVariables.VAR_FORM_XPATH + "/SubForms/TransferCO/CurrentOwningCourt", currentCode);
}

transferCO_subform.replaceTargetNode = [ {sourceNodeIndex: "0", dataBinding: MaintainCOVariables.VAR_FORM_XPATH + "/transferred"} ];
/**
 * @author rzhh8k
 * 
 */
transferCO_subform.processReturnedData = function()
{
	//set status to transferred and send an 777 event for each debt that has a case associated with it
	//Services.setValue(Header_Status.dataBinding, MaintainCOVariables.STATUS_TRANSFERRED);
	
	// Set the Transfer CO Flag
	Services.setValue(MaintainCOVariables.CO_TRANSFERRED, "true");
	
	// Set flag so that Foreign Court popup does not appear
	Services.setValue(MaintainCOVariables.DISPLAYED_OWNING_COURT_MESSAGE, MaintainCOVariables.YES);
	
	var currentCourtName = Services.getValue(Header_OwningCourtName.dataBinding);
	
	// Defect 618 Transfer CO - require event detail to include Transferred to Court.
	var transferToCourtCode = Services.getValue(MaintainCOVariables.VAR_FORM_XPATH + "/transferred/courtCode");
	//var transferToCourtName = Services.getValue(MaintainCOVariables.VAR_FORM_XPATH + "/transferred/courtName");
	// build event details text string
	var eventDetail = "TRANSFERRED FROM " + currentCourtName;
	
	// Set the Owning Court of the CO to the new value
	Services.setValue(Header_OwningCourtCode.dataBinding, transferToCourtCode);
	
	MaintainCOFunctions.setEventsReTransfer("", eventDetail);//pDebtorName, pEventDetail980
	// now save changes and events
	Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	Status_Save.actionBinding();		
}

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
    var maintainMode = MaintainCOFunctions.isScreenModeMaintain();
    var surrId = MaintainCOFunctions.getNextSurrogateKey();
    var cancelMsg = Services.getValue(MaintainCOVariables.DISPLAY_CANCEL_MESSAGE);
    var addressType = Services.getValue(MaintainCOVariables.ADDING_ADDRESS_TYPE);
    if(null != addressType && addressType == MaintainCOVariables.ADD_DEBTOR_ADDRESS_TYPE){    
	    MaintainCOFunctions.addAddress(	MaintainCOVariables.DEBTOR_ADDRESS_XP, //pAddressType 
										surrId, //pSurrogateID, 
										maintainMode);//pAddDateToHistory)	
		
		Services.setValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_ADDRESS, MaintainCOVariables.YES);
    } //end if(null != addressType && addressType == MaintainCOVariables.ADD_DEBTOR_ADDRESS_TYPE){
    else if(null != addressType && addressType == MaintainCOVariables.ADD_EMPLOYER_ADDRESS_TYPE){    
    	MaintainCOFunctions.addAddress(	MaintainCOVariables.EMPLOYMENT_ADDRESS_XP, //pAddressType 
										surrId, //pSurrogateID, 
										maintainMode);//pAddDateToHistory)	
		if(maintainMode == true){
			// set the flag for firing event 986
			Services.setValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS, MaintainCOVariables.YES);
			Services.setValue(MaintainCOVariables.EMPLOYMENT_ADDRESS_CHANGED, MaintainCOVariables.YES);
		}    
    }
    else if(null != addressType && addressType == MaintainCOVariables.ADD_WORKPLACE_ADDRESS_TYPE){    
		MaintainCOFunctions.addAddress(	MaintainCOVariables.WORKPLACE_ADDRESS_XP, //pAddressType 
										surrId, //pSurrogateID, 
										maintainMode);//pAddDateToHistory)	
    }
    
    if(cancelMsg != null && cancelMsg != "" && cancelMsg == MaintainCOVariables.YES){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.NO, null);//pFlagValue, pFieldValue
	}
    // reset value
    Services.setValue(MaintainCOVariables.ADDING_ADDRESS_TYPE, "");
	Services.endTransaction();
}
addCoAddress_subform.destroyOnClose = true;

/*****************************************************************************************************************
                                        LOV DEFINITIONS
*****************************************************************************************************************/
function selectCourtMaintainCOLOV() {};
selectCourtMaintainCOLOV.dataBinding = "/ds/MaintainCO/OwningCourtCode";
selectCourtMaintainCOLOV.srcData = MaintainCOVariables.REF_DATA_XPATH + "/Courts";
selectCourtMaintainCOLOV.rowXPath = "Court[./SUPSCourt = 'Y']";
selectCourtMaintainCOLOV.keyXPath = "Code";
selectCourtMaintainCOLOV.columns = [
	{xpath: "Code", filterXPath: "/ds/var/page/filters/grid/selectCourtOneMainCO"},
	{xpath: "Name", filterXPath: "/ds/var/page/filters/grid/selectCourtTwoMainCO"}
];
selectCourtMaintainCOLOV.styleURL = "selectCourtMaintainCOLOV.css";
selectCourtMaintainCOLOV.destroyOnClose = false;
// Configure the location in the model which will generate data change events
selectCourtMaintainCOLOV.logicOn = [selectCourtMaintainCOLOV.dataBinding];
/**
 * Implement the callback
 * @author rzhh8k
 * 
 */
selectCourtMaintainCOLOV.logic = function()
{
	Services.startTransaction();
	
	var id = Services.getValue(selectCourtMaintainCOLOV.dataBinding);
	if (id != null){
		// Lookup the court details in ref data from the code that is stored in value				
		var xpathName = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[Code = " + selectCourtMaintainCOLOV.dataBinding + "]/Name";		
		var courtName = Services.getValue(xpathName);
		Services.setValue(Header_OwningCourtName.dataBinding, courtName);
	}
	
	Services.endTransaction();
} // end of logic()

selectCourtMaintainCOLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_Court_LOV"} ],
		keys: [ { key: Key.F6, element: "Header_OwningCourtCode" }, { key: Key.F6, element: "Header_OwningCourtName" } ]
	}
};

/*****************************************************************************************************************
                                       POPUP DEFINITIONS
*****************************************************************************************************************/

function WorkplaceAddressHistory() {};
WorkplaceAddressHistory.lower = {
	eventBinding: {
		singleClicks: [ {element: "WorkplaceAddressHistory_Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "WorkplaceAddressHistory" } ]
	}
};

/*****************************************************************************************************************/

function EmployerAddressHistory() {};
EmployerAddressHistory.lower = {
	eventBinding: {
		singleClicks: [ {element: "EmployerAddressHistory_Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "EmployerAddressHistory" } ]
	}
};

/*****************************************************************************************************************/

function DebtorAddressHistory() {};
DebtorAddressHistory.lower = {
	eventBinding: {
		singleClicks: [ {element: "DebtorAddressHistory_Popup_CloseBtn"} ],
		keys: [ { key: Key.F4, element: "DebtorAddressHistory" } ]
	}
};

/*****************************************************************************************************************
                                        GRID DEFINITIONS
*****************************************************************************************************************/
function DebtorAddressHistoryGrid() {};
/**
 * @param pIndex
 * @author rzhh8k
 * @return addressString  
 */
DebtorAddressHistoryGrid.concatAddrLines = function(pIndex)
{
	var addressString = Services.getValue("/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue("/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[2]");
	return addressString;
}
DebtorAddressHistoryGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedDebtorAddress";
DebtorAddressHistoryGrid.srcData = "/ds/MaintainCO/Debtor/AddressHistory";
DebtorAddressHistoryGrid.rowXPath = "Address";
DebtorAddressHistoryGrid.keyXPath = "AddressSurrogateId";
DebtorAddressHistoryGrid.columns = [
	{xpath: "AddressSurrogateId", transformToDisplay: DebtorAddressHistoryGrid.concatAddrLines},
	{xpath: "ValidFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ValidTo", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"}
];
DebtorAddressHistoryGrid.tabIndex = 78;
/*********************************************************************/
function EmployerAddressHistoryGrid() {};
/**
 * @param pIndex
 * @author rzhh8k
 * @return addressString  
 */
EmployerAddressHistoryGrid.concatAddrLines = function(pIndex)
{
	var addressString = Services.getValue("/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue("/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[2]");
	return addressString;
}
EmployerAddressHistoryGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedEmployerAddress";
EmployerAddressHistoryGrid.srcData = "/ds/MaintainCO/Employer/AddressHistory";
EmployerAddressHistoryGrid.rowXPath = "Address";
EmployerAddressHistoryGrid.keyXPath = "AddressSurrogateId";
EmployerAddressHistoryGrid.columns = [
	{xpath: "AddressSurrogateId", transformToDisplay: EmployerAddressHistoryGrid.concatAddrLines},
	{xpath: "ValidFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ValidTo", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"}
];
EmployerAddressHistoryGrid.tabIndex = 88;
/*********************************************************************/
function WorkplaceAddressHistoryGrid() {};
/**
 * @param pIndex
 * @author rzhh8k
 * @return addressString  
 */
WorkplaceAddressHistoryGrid.concatAddrLines = function(pIndex)
{
	var addressString = Services.getValue("/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[1]");
	addressString = addressString + ", " + Services.getValue("/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = '" + pIndex + "']/Line[2]");
	return addressString;
}
WorkplaceAddressHistoryGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedWorkplaceAddress";
WorkplaceAddressHistoryGrid.srcData = "/ds/MaintainCO/Workplace/AddressHistory";
WorkplaceAddressHistoryGrid.rowXPath = "Address";
WorkplaceAddressHistoryGrid.keyXPath = "AddressSurrogateId";
WorkplaceAddressHistoryGrid.columns = [
	{xpath: "AddressSurrogateId", transformToDisplay: WorkplaceAddressHistoryGrid.concatAddrLines},
	{xpath: "ValidFrom", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ValidTo", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "CreatedBy"}
];
WorkplaceAddressHistoryGrid.tabIndex = 98;

/*****************************************************************************************************************
                                        DATA BINDINGS
*****************************************************************************************************************/
//NavBar_NavigationList.dataBinding = MaintainCOVariables.VAR_FORM_XPATH + "/SelectedValues/NavigationOption";

/*********************  HEADER DETAILS  - MAIN SCREEN *******/
Header_CONumber.dataBinding = "/ds/MaintainCO/CONumber";
Header_COOldNumber.dataBinding = "/ds/MaintainCO/OldNumber";
Header_OwningCourtCode.dataBinding = "/ds/MaintainCO/OwningCourtCode";
Header_OwningCourtName.dataBinding = "/ds/MaintainCO/OwningCourt";
Header_Type.dataBinding = "/ds/MaintainCO/COType";
Header_Status.dataBinding = "/ds/MaintainCO/COStatus";
Header_Debtor.dataBinding = "/ds/MaintainCO/DebtorName";
Header_DateOfBirth.dataBinding = "/ds/MaintainCO/Debtor/DateOfBirth";

/*********************  CO DETAILS PANEL - MAIN SCREEN *****/
CODetails_AppDate.dataBinding = "/ds/MaintainCO/ApplnReceivedDate";
CODetails_OrderDate.dataBinding = "/ds/MaintainCO/OrderDate";
CODetails_CompType.dataBinding = "/ds/MaintainCO/CompType";
CODetails_CompRate.dataBinding = "/ds/MaintainCO/CompRate";
CODetails_Target.dataBinding = "/ds/MaintainCO/DividendTarget";
CODetails_TargetAmount.dataBinding = "/ds/MaintainCO/tmp/DivTargetAmount";// derived, move to temp area
CODetails_TargetAmountCurrency.dataBinding = "/ds/MaintainCO/tmp/DivTargetAmountCurrency";// derived, move to temp area
CODetails_FeeRate.dataBinding = "/ds/MaintainCO/FeeRate";
CODetails_AdhocDiv.dataBinding = "/ds/MaintainCO/AdhocDividend";
CODetails_InstlAmount.dataBinding = "/ds/MaintainCO/InstalAmount";
CODetails_InstlAmountCurrency.dataBinding = "/ds/MaintainCO/InstalAmountCurrency";
CODetails_Frequency.dataBinding = "/ds/MaintainCO/Frequency";
CODetails_FirstPayDate.dataBinding = "/ds/MaintainCO/FirstPaymentDate";
CODetails_ReviewDate.dataBinding = "/ds/MaintainCO/ReviewDate";
CODetails_RevokedDischargedDate.dataBinding = "/ds/MaintainCO/RevokedDischargeDate";
CO_EmploymentDetailsPERCurrency.dataBinding = "/ds/MaintainCO/ProtectedEarningsRateCurrency"
CO_EmploymentDetailsPER.dataBinding = "/ds/MaintainCO/ProtectedEarningsRate";
/*********************  CO DEBTOR ADDRESS DETAILS TAB - MAIN SCREEN *****/
CO_ContactDetails_Address_Line1.dataBinding = "/ds/MaintainCO/Debtor/Address/Line[1]";
CO_ContactDetails_Address_Line2.dataBinding = "/ds/MaintainCO/Debtor/Address/Line[2]";
CO_ContactDetails_Address_Line3.dataBinding = "/ds/MaintainCO/Debtor/Address/Line[3]";
CO_ContactDetails_Address_Line4.dataBinding = "/ds/MaintainCO/Debtor/Address/Line[4]";
CO_ContactDetails_Address_Line5.dataBinding = "/ds/MaintainCO/Debtor/Address/Line[5]";
CO_ContactDetails_Address_Postcode.dataBinding = "/ds/MaintainCO/Debtor/Address/PostCode";
CO_DebtorAddressCreatedBy.dataBinding = "/ds/MaintainCO/Debtor/Address/CreatedBy";
CO_ContactDetails_Address_DXNo.dataBinding = "/ds/MaintainCO/Debtor/DX";
CO_ContactDetails_Address_TelNo.dataBinding = "/ds/MaintainCO/Debtor/TelNo";
CO_ContactDetails_Address_FaxNo.dataBinding = "/ds/MaintainCO/Debtor/FaxNo";
CO_ContactDetails_Address_Email.dataBinding = "/ds/MaintainCO/Debtor/Email";
CO_ContactDetails_Address_CommMethod.dataBinding = "/ds/MaintainCO/Debtor/CommMethod";
CO_ContactDetails_Address_Welsh.dataBinding = "/ds/MaintainCO/Debtor/TranslationToWelsh";
/*********************  CO EMPLOYER DETAILS TAB - MAIN SCREEN *****/
CO_EmploymentDetails_Address_NamedPerson.dataBinding = "/ds/MaintainCO/NamedEmployer";
CO_EmploymentDetailsOccupation.dataBinding = "/ds/MaintainCO/DebtorOccupation";
CO_EmploymentDetailsPayRef.dataBinding = "/ds/MaintainCO/PayrollNumber";
CO_EmploymentDetails_Employer.dataBinding = "/ds/MaintainCO/Employer/Name";
CO_EmploymentDetails_Address_Line1.dataBinding = "/ds/MaintainCO/Employer/Address/Line[1]";
CO_EmploymentDetails_Address_Line2.dataBinding = "/ds/MaintainCO/Employer/Address/Line[2]";
CO_EmploymentDetails_Address_Line3.dataBinding = "/ds/MaintainCO/Employer/Address/Line[3]";
CO_EmploymentDetails_Address_Line4.dataBinding = "/ds/MaintainCO/Employer/Address/Line[4]";
CO_EmploymentDetails_Address_Line5.dataBinding = "/ds/MaintainCO/Employer/Address/Line[5]";
CO_EmploymentDetails_Address_Postcode.dataBinding = "/ds/MaintainCO/Employer/Address/PostCode";
CO_EmploymentDetails_Address_CreatedBy.dataBinding = "/ds/MaintainCO/Employer/Address/CreatedBy";
CO_EmploymentDetails_Address_DXNo.dataBinding = "/ds/MaintainCO/Employer/DX";
CO_EmploymentDetails_Address_TelNo.dataBinding = "/ds/MaintainCO/Employer/TelNo";
CO_EmploymentDetails_Address_FaxNo.dataBinding = "/ds/MaintainCO/Employer/FaxNo";
CO_EmploymentDetails_Address_Email.dataBinding = "/ds/MaintainCO/Employer/Email";
CO_EmploymentDetails_Address_CommMethod.dataBinding = "/ds/MaintainCO/Employer/CommMethod";
CO_EmploymentDetails_Address_Welsh.dataBinding = "/ds/MaintainCO/Employer/TranslationToWelsh";


/*********************  CO WORKPLACE DETAILS TAB - MAIN SCREEN *****/
CO_WorkplaceDetails_Address_Line1.dataBinding = "/ds/MaintainCO/Workplace/Address/Line[1]";
CO_WorkplaceDetails_Address_Line2.dataBinding = "/ds/MaintainCO/Workplace/Address/Line[2]";
CO_WorkplaceDetails_Address_Line3.dataBinding = "/ds/MaintainCO/Workplace/Address/Line[3]";
CO_WorkplaceDetails_Address_Line4.dataBinding = "/ds/MaintainCO/Workplace/Address/Line[4]";
CO_WorkplaceDetails_Address_Line5.dataBinding = "/ds/MaintainCO/Workplace/Address/Line[5]";
CO_WorkplaceDetails_Address_Postcode.dataBinding = "/ds/MaintainCO/Workplace/Address/PostCode";

/*********************  CO FINANCE DETAILS - MAIN SCREEN ******/
CO_Money_TotalAllowedCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalAllowed.dataBinding = "/ds/MaintainCO/DebtSummary/AmountAllowed";
CO_Money_TotalPaidOutCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalPaidOut.dataBinding = "/ds/MaintainCO/DebtSummary/TotalPaidOut";
CO_Money_MoniesInCourtCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_MoniesInCourt.dataBinding = "/ds/MaintainCO/DebtSummary/MoniesInCourt";
CO_Money_TotalFeeCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalFee.dataBinding = "/ds/MaintainCO/DebtSummary/FeeAmountForScreen";
CO_Money_TotalFeesPaidCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalFeesPaid.dataBinding = "/ds/MaintainCO/DebtSummary/TotalFeesPaid";
CO_Money_ScheduleTwoFeeCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_ScheduleTwoFee.dataBinding = "/ds/MaintainCO/DebtSummary/ScheduleTwoFee";
CO_Money_TotalDueCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalDue.dataBinding = "/ds/MaintainCO/DebtSummary/TotalDue";
CO_Money_TotalPassthroughsCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalPassthroughs.dataBinding = "/ds/MaintainCO/DebtSummary/TotalPassthroughs";
CO_Money_ScheduleTwoTotalCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_ScheduleTwoTotal.dataBinding = "/ds/MaintainCO/DebtSummary/ScheduleTwoTotal";
CO_Money_TotalOutstandingCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_TotalOutstanding.dataBinding = "/ds/MaintainCO/DebtSummary/TotalOutstanding";
CO_Money_BalanceDueCurrency.dataBinding = "/ds/MaintainCO/DebtSummary/Currency";
CO_Money_BalanceDue.dataBinding = "/ds/MaintainCO/DebtSummary/BalanceDueFromDebtor";

/*********************  CO DEBTOR ADDRESS HISTORY POPUP ******/
DebtorAddressHistory_Popup_Address_Line1.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/Line[1]";
DebtorAddressHistory_Popup_Address_Line2.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/Line[2]";
DebtorAddressHistory_Popup_Address_Line3.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/Line[3]";
DebtorAddressHistory_Popup_Address_Line4.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/Line[4]";
DebtorAddressHistory_Popup_Address_Line5.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/Line[5]";
DebtorAddressHistory_Popup_Address_Postcode.dataBinding = "/ds/MaintainCO/Debtor/AddressHistory/Address[./AddressSurrogateId = " + DebtorAddressHistoryGrid.dataBinding + "]/PostCode";

/*********************  CO EMPLOYER ADDRESS HISTORY POPUP ******/
EmployerAddressHistory_Popup_Address_Line1.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/Line[1]";
EmployerAddressHistory_Popup_Address_Line2.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/Line[2]";
EmployerAddressHistory_Popup_Address_Line3.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/Line[3]";
EmployerAddressHistory_Popup_Address_Line4.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/Line[4]";
EmployerAddressHistory_Popup_Address_Line5.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/Line[5]";
EmployerAddressHistory_Popup_Address_Postcode.dataBinding = "/ds/MaintainCO/Employer/AddressHistory/Address[./AddressSurrogateId = " + EmployerAddressHistoryGrid.dataBinding + "]/PostCode";

/*********************  CO WORKPLACE ADDRESS HISTORY POPUP ******/
WorkplaceAddressHistory_Popup_Address_Line1.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/Line[1]";
WorkplaceAddressHistory_Popup_Address_Line2.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/Line[2]";
WorkplaceAddressHistory_Popup_Address_Line3.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/Line[3]";
WorkplaceAddressHistory_Popup_Address_Line4.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/Line[4]";
WorkplaceAddressHistory_Popup_Address_Line5.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/Line[5]";
WorkplaceAddressHistory_Popup_Address_Postcode.dataBinding = "/ds/MaintainCO/Workplace/AddressHistory/Address[./AddressSurrogateId = " + WorkplaceAddressHistoryGrid.dataBinding + "]/PostCode";

/*****************************************************************************************************************
                                        TAB DEFINITIONS
*****************************************************************************************************************/
function COTabSelector() {}; // Instantiate the tabbed area
COTabSelector.tabIndex = 24;
COTabSelector.dataBinding = MaintainCOVariables.CURRENT_TAB_PAGE_MAIN;

function COAddressesPagedArea() {};
COAddressesPagedArea.dataBinding = COTabSelector.dataBinding;

/******************************* TAB PAGES ***************************************/

/******************************* MAIN CO SCREEN ***************************************/
function TabDebtorAddress() {};
TabDebtorAddress.isEnabled = function()
{
	return true;
}

/**********************************************************************************/
function TabEmploymentDetails() {};
TabEmploymentDetails.isEnabled = function()
{
	return true;
}

/**********************************************************************************/
function TabWorkplaceDetails() {};
TabWorkplaceDetails.isEnabled = function()
{
	return true;
}

/*******************************END TAB PAGES *************************************/

/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/*****************************************************************************************************************
                                        HEADER INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function Header_CONumber() {}
Header_CONumber.tabIndex = 1;
Header_CONumber.maxLength = 8;
Header_CONumber.helpText = "Unique Consolidation Order identifier. Enter a CO Number to query on or leave blank when creating.";
Header_CONumber.readOnlyOn = [Header_CONumber.dataBinding,
							  ManageCOParams.MODE];
Header_CONumber.isReadOnly = function()
{
	var readOnly = false;	
	// NOT Read Only when screen is in initial mode, is Read Only for all other modes
	var initialMode = MaintainCOFunctions.isScreenModeInitial();
	if(initialMode == false){
		readOnly = true;
	}
	return readOnly;
}
Header_CONumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_CONumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_CONumber.validateOn = [Header_CONumber.dataBinding,
							  MaintainCOVariables.CO_EXISTS_IN_DATABASE];
Header_CONumber.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	if(null != coNumber || coNumber != ""){
		// Check if format of CONumber is correct -  NB Do not need to check this as in legacy can create a court ID as WB, W" or 02.  
		// Therefore the length check is good enough
		if(coNumber.length == 8){
			var coExists = Services.getValue(MaintainCOVariables.CO_EXISTS_IN_DATABASE);
			if(coExists != null && coExists != "" && coExists == MaintainCOVariables.NO){				
				errCode = ErrorCode.getErrorCode("Caseman_CONumberNotExist_Msg");
			}
		}// end if(coNumber.length == 8){
		else{
			// co number must be 8 chars
			errCode = ErrorCode.getErrorCode("Caseman_invalidCONumberFormat_Msg");
		}
		
	} // end if(null != coNumber || coNumber != ""){
	
	Services.endTransaction();
	
	return errCode;
}
Header_CONumber.logicOn = [Header_CONumber.dataBinding];
Header_CONumber.logic = function(event)
{
	Services.startTransaction();
	// load refdata
	MaintainCOFunctions.loadCOReferenceData(MaintainCOVariables.MAINTAIN_CO_REFDATA);
	
	var coNumber = Services.getValue(Header_CONumber.dataBinding);	
	if(event.getXPath() == Header_CONumber.dataBinding && coNumber != null && coNumber != ""){
		// retrieve the CO
		MaintainCOFunctions.getCO(	coNumber,
									false); //pInitialising
	}	
	Services.endTransaction();
}

/**
 * @param dom
 * @author rzhh8k
 * 
 */
Header_CONumber.onSuccess = function(dom)
{
	if(null != dom){
		Services.startTransaction();
		// reset exists flag		
		// Select and insert the main node
		var data = dom.selectSingleNode(MaintainCOVariables.CO_XPATH);
		if(null != data){
			Services.removeNode(MaintainCOVariables.CO_XPATH);
			// Add the new data to the data model			
			Services.replaceNode(MaintainCOVariables.CO_XPATH, data);
			// removed not required as do else where MaintainCOFunctions.reSetFlagsAfterSave();			
			
			// set exists flag
			Services.setValue(MaintainCOVariables.CO_EXISTS_IN_DATABASE, MaintainCOVariables.YES);
			
			// set some original values to test on
			var debtor = Services.getValue(Header_Debtor.dataBinding);
			Services.setValue(MaintainCOVariables.ORIGINAL_DEBTOR_NAME, debtor);
			var revokeDate = Services.getValue(CODetails_RevokedDischargedDate.dataBinding);
			Services.setValue(MaintainCOVariables.ORIGINAL_REVOKED_DATE, revokeDate);
			
			MaintainCOFunctions.setScreenMode(ManageCOParamsConstants.MAINTAIN_MODE);
			// Set the correct tab to be displayed
			Services.setValue(COTabSelector.dataBinding, "TabDebtorAddress");		
			// set the totals
			MaintainCOFunctions.calculateCOTotals();
			
			// display message to user if payment/dividend in progress
			if(MaintainCOFunctions.isPaymentDividendInProgress() == true){
				alert(Messages.PAYMENT_DIVIDEND_IN_PROGRESS);
			}
			
			// Check if owning court is different
			var court = Services.getValue(Header_OwningCourtCode.dataBinding);
			var homeCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			if(homeCourt == null){
				homeCourt = "";
			}
			if (null != court && court != "" && court != homeCourt){
				var displayedMsg = Services.getValue(MaintainCOVariables.DISPLAYED_OWNING_COURT_MESSAGE);
				if(displayedMsg == null || displayedMsg == "" || displayedMsg == MaintainCOVariables.NO){
					Services.setValue(MaintainCOVariables.DISPLAYED_OWNING_COURT_MESSAGE, MaintainCOVariables.YES);
					alert(Messages.OWNING_COURT_MESSAGE);
				}
			}
			
			Services.setFocus("Header_COOldNumber");
		} // end if(null != data){
		else{
			// A CO Number which does not exist has been entered, flag field as invalid
			// set exists flag
			Services.setValue(MaintainCOVariables.CO_EXISTS_IN_DATABASE, MaintainCOVariables.NO);
			//set maintain mode to reset fields
			Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.INITIAL_MODE);
			Services.setFocus("Header_CONumber");
		}
		
		Services.endTransaction();
	} // end if(null != dom){
	else{
		alert(Messages.PROBLEM_RETREIVING_CO_MESSAGE);
	}
}
/**
 * @param exception
 * @author rzhh8k
 * 
 */
Header_CONumber.onError = function(exception)
{
	if(confirm(Messages.FAILEDCASEDATALOAD_MESSAGE)){
		// Reload the case number field so that all data gets reloaded
		var coNumber = Services.getValue(Header_CONumber.dataBinding);
		Services.setValue(Header_CONumber.dataBinding, "");  
		// retrieve the CO
		MaintainCOFunctions.getCO(	coNumber,
									false); // pInitialising
	}
	else{
		MaintainCOFunctions.exitScreen(true);
	}
}

/****************************************************************************************************************/
function Header_COOldNumber() {}
Header_COOldNumber.tabIndex = 3;
Header_COOldNumber.maxLength = 9;
Header_COOldNumber.componentName = "Old CO Number";
Header_COOldNumber.helpText = "Enter previous AO, CAEO or CO Number, if relevant.";
Header_COOldNumber.readOnlyOn = [ Header_CONumber.dataBinding,
								  Header_Status.dataBinding,
						          ManageCOParams.MODE];
Header_COOldNumber.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}
	return readOnly;
}
Header_COOldNumber.enableOn = [Header_CONumber.dataBinding,
							   ManageCOParams.MODE];
Header_COOldNumber.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
Header_COOldNumber.validateOn = [Header_COOldNumber.dataBinding,
								 MaintainCOVariables.OLD_CO_EXISTS_IN_DATABASE];
Header_COOldNumber.validate = function()
{
	// need to ensure the number is unique
	var errCode = null;
	var exists = Services.getValue(MaintainCOVariables.OLD_CO_EXISTS_IN_DATABASE);
	if(exists != null && exists != "" && exists == MaintainCOVariables.YES){
		errCode = ErrorCode.getErrorCode("Caseman_oldNumberAlreadyInUse_Msg");	
	}
		
	return errCode;
}
Header_COOldNumber.logicOn = [Header_COOldNumber.dataBinding];
Header_COOldNumber.logic = function(event)
{
	var oldCONumber = Services.getValue(Header_COOldNumber.dataBinding);	
	if(event.getXPath() == Header_COOldNumber.dataBinding ){ //CASEMAN defect 6178 removed '&& oldCONumber != null && oldCONumber != ""'
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		/* Remove validation re unique CO Number as per conversation with Phil Hardy re
		migration issues re old number not unique in Legacy- 07/02/2006
		
		var oldNumber = Services.getValue(Header_COOldNumber.dataBinding);
		//service call here
		var params = new ServiceParams();
		params.addSimpleParameter("oldNumber", oldNumber.toUpperCase());
		Services.callService("getOldNumberExistence", params, Header_COOldNumber, true);
 */
	}
}

Header_COOldNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_COOldNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = 4;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning Court Code";
Header_OwningCourtCode.componentName = "Owning Court Code";
Header_OwningCourtCode.isMandatory = function(){
	return true;
}
Header_OwningCourtCode.readOnlyOn = [Header_CONumber.dataBinding,
							         ManageCOParams.MODE];
Header_OwningCourtCode.isReadOnly = function()
{
	// RO in maintain mode - updateable in create
	var readOnly = true;
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		readOnly = false;
	}
	return readOnly;
}

Header_OwningCourtCode.validateOn = [Header_OwningCourtCode.dataBinding,
									 Header_OwningCourtName.dataBinding];
Header_OwningCourtCode.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	if(null != courtCode && courtCode != ""){
		var xpathName = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + Header_OwningCourtCode.dataBinding + "]/Name";
		var courtDesc = Services.getValue(xpathName);		
		if(null == courtDesc || courtDesc == ""){
			errCode = ErrorCode.getErrorCode('CaseMan_invalidSUPSCourtCode_Msg');
		}	
	}
	else{
		// need to reset the coded party list if there is one
		var listRetrieved = Services.getValue(MaintainCOVariables.CODED_PARTY_LIST_RETRIEVED);
		if(listRetrieved == null || listRetrieved == "" || listRetrieved == MaintainCOVariables.YES){
			// need to set creditor and payee details
			Services.removeNode(MaintainCOVariables.REF_DATA_XPATH + "/CodedParties");		
			//reset the flags
			Services.SetValue(MaintainCOVariables.CODED_PARTY_LIST_RETRIEVED, MaintainCOVariables.NO);
			Services.setValue(MaintainCOVariables.ADMIN_COURT_CHANGED, MaintainCOVariables.NO);
			Services.setValue(MaintainCOVariables.CODED_PARTY_LIST_RETRIEVED, MaintainCOVariables.NO);
		}		
	}
	
	Services.endTransaction();	
	return errCode;
}

Header_OwningCourtCode.enableOn = [Header_CONumber.dataBinding,
							       ManageCOParams.MODE];
Header_OwningCourtCode.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
Header_OwningCourtCode.logicOn = [Header_OwningCourtCode.dataBinding];
Header_OwningCourtCode.logic = function(event)
{
	if(event.getXPath() == Header_OwningCourtCode.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		
		var courtNumberHome = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
		var coCourtNumber = Services.getValue(Header_OwningCourtCode.dataBinding);
		if(courtNumberHome != null && courtNumberHome != "" && coCourtNumber != null && coCourtNumber != "" && courtNumberHome != coCourtNumber){
			// Check if transferring CO in which case, message should not appear
			var transferCOFlag = Services.getValue(MaintainCOVariables.CO_TRANSFERRED);
			if(Header_OwningCourtCode.validate() == null && transferCOFlag != "true" ){
				alert(Messages.OWNING_COURT_MESSAGE);
			}
		}
	}
}

/****************************************************************************************************************/
function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = 5;
Header_OwningCourtName.srcData = MaintainCOVariables.REF_DATA_XPATH + "/Courts";
Header_OwningCourtName.rowXPath = "Court[./SUPSCourt = 'Y']";
Header_OwningCourtName.keyXPath = "Name";
Header_OwningCourtName.displayXPath = "Name";
Header_OwningCourtName.strictValidation = true;
Header_OwningCourtName.helpText = "Owning Court Name";
Header_OwningCourtName.componentName = "Owning Court Name";
Header_OwningCourtName.isMandatory = function()
{
	return true;
}
Header_OwningCourtName.readOnlyOn = [Header_CONumber.dataBinding,
							         ManageCOParams.MODE];
Header_OwningCourtName.isReadOnly = function()
{
	// RO in maintain mode - updateable in create
	var readOnly = true;
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		readOnly = false;
	}
	return readOnly;
}

Header_OwningCourtName.logicOn = [Header_OwningCourtName.dataBinding];
Header_OwningCourtName.logic = function(event)
{
	Services.startTransaction();
	if(event.getXPath() == Header_OwningCourtName.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		var courtName = Services.getValue(Header_OwningCourtName.dataBinding);
		if(courtName != null && courtName != ""){
			var xpathCode = MaintainCOVariables.REF_DATA_XPATH + "/Courts/Court[./Name = " + Header_OwningCourtName.dataBinding + "]/Code";
			var courtCode = Services.getValue(xpathCode);		
			Services.setValue(Header_OwningCourtCode.dataBinding, courtCode);
			
			Services.setValue(MaintainCOVariables.ADMIN_COURT_CHANGED, MaintainCOVariables.YES);
		}
		else{
			Services.setValue(MaintainCOVariables.ADMIN_COURT_CHANGED, MaintainCOVariables.NO);
		}
	}	
	
	Services.endTransaction();
}
Header_OwningCourtName.enableOn = [Header_CONumber.dataBinding,
							       ManageCOParams.MODE];
Header_OwningCourtName.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/****************************************************************************************************************/
function Header_Type() {}
Header_Type.tabIndex = 7;
Header_Type.maxLength = 4;
Header_Type.srcData = MaintainCOVariables.REF_DATA_XPATH + "/COTypes";
Header_Type.rowXPath = "Type";
Header_Type.keyXPath = "Value";
Header_Type.displayXPath = "Value";
Header_Type.helpText = "Type of CO Record";
Header_Type.componentName = "Type of CO Record";

Header_Type.isMandatory = function(){
	return true;
}
Header_Type.readOnlyOn = [ 	Header_CONumber.dataBinding,
							Header_Status.dataBinding,
					        ManageCOParams.MODE];
Header_Type.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	return readOnly;
}
Header_Type.validateOn = [Header_Type.dataBinding];
Header_Type.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var type = Services.getValue(Header_Type.dataBinding);
	if(null != type && type != ""){
		if(type == MaintainCOVariables.COTypeCAEO){
			// no sched2 debts allowed
			var schedTwo = Services.getValue(CO_Money_ScheduleTwoTotal.dataBinding);
			if(schedTwo != null && schedTwo != "" && schedTwo > 0){
				errCode = ErrorCode.getErrorCode("Caseman_NoSchedule2DebtsAllowed_Msg");
			}
			else if(MaintainCOFunctions.debtWithNoCase() == true){
				errCode = ErrorCode.getErrorCode("Caseman_CAEO_DebtWithNoCase_Msg");
			}
		}// if(type == MaintainCOVariables.COTypeCAEO){
	}
	
	Services.endTransaction();
	return errCode;
}
Header_Type.logicOn = [Header_Type.dataBinding];
Header_Type.logic = function(event)
{
	if(event.getXPath() == Header_Type.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
Header_Type.enableOn = [Header_CONumber.dataBinding,
							       ManageCOParams.MODE];
Header_Type.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/****************************************************************************************************************/
function Header_Status() {}
Header_Status.tabIndex = 8;
Header_Status.maxLength = 11;
Header_Status.componentName = "Current status of the CO";
Header_Status.componentName = "CO Status";
Header_Status.helpText = "Current Status of the Consolidation Order";
Header_Status.isMandatory = function(){
	return true;
}
Header_Status.isReadOnly = function()
{
	return true;
}
Header_Status.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_Status.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Header_Status.enableOn = [Header_CONumber.dataBinding,
						  ManageCOParams.MODE];
Header_Status.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
Header_Status.logicOn = [Header_Status.dataBinding];
Header_Status.logic = function(event)
{
	if(event.getXPath() == Header_Status.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/****************************************************************************************************************/
function Header_Debtor() {}
Header_Debtor.tabIndex = 9;
Header_Debtor.maxLength = 70;
Header_Debtor.helpText = "The name of the Debtor";
Header_Debtor.componentName = "Debtor Name";
Header_Debtor.isMandatory = function(){
	return true;
}
Header_Debtor.readOnlyOn = [ 	Header_CONumber.dataBinding,
								Header_Status.dataBinding,
						        ManageCOParams.MODE];
Header_Debtor.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	return readOnly;
}
Header_Debtor.logicOn = [Header_Debtor.dataBinding];
Header_Debtor.logic = function(event)
{
	if(event.getXPath() == Header_Debtor.dataBinding){
		Services.startTransaction();
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		
		if(MaintainCOFunctions.isScreenModeMaintain() == true){
			var origDebtor = Services.getValue(MaintainCOVariables.ORIGINAL_DEBTOR_NAME);
			var debtor = Services.getValue(Header_Debtor.dataBinding);
			if(origDebtor.toUpperCase() == debtor.toUpperCase()){
				// unset the event flag
				Services.setValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_NAME, MaintainCOVariables.NO);
			}
			else{
				// set the event flag
				Services.setValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_NAME, MaintainCOVariables.YES);
			}
		}
		// set the event flag
				
		Services.endTransaction();
	}
}
Header_Debtor.enableOn = [Header_CONumber.dataBinding,
						  ManageCOParams.MODE];
Header_Debtor.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
Header_Debtor.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_Debtor.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/****************************************************************************************************************/

function Header_DateOfBirth() {};
Header_DateOfBirth.tabIndex = 10;
Header_DateOfBirth.maxLength = 11;
Header_DateOfBirth.helpText = "Enter debtor's date of birth if known";
Header_DateOfBirth.componentName = "Date of Birth";
Header_DateOfBirth.weekends = true;
Header_DateOfBirth.enableOn = [Header_CONumber.dataBinding,
						  	   ManageCOParams.MODE];
Header_DateOfBirth.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

Header_DateOfBirth.readOnlyOn = [ 	Header_CONumber.dataBinding,
									Header_Status.dataBinding,
							        ManageCOParams.MODE];
Header_DateOfBirth.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	return readOnly;
}
Header_DateOfBirth.validateOn = [Header_DateOfBirth.dataBinding];
Header_DateOfBirth.validate = function()
{
	return 	CaseManValidationHelper.validateDateOfBirth(
				Header_DateOfBirth.dataBinding,
				MaintainCOVariables.REF_DATA_XPATH + "/SystemDate" 
			);
}
Header_DateOfBirth.logicOn = [Header_DateOfBirth.dataBinding];
Header_DateOfBirth.logic = function(event)
{
	if(event.getXPath() == Header_DateOfBirth.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);		
	}
}
/*****************************************************************************************************************
                                        CO DETAILS INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function CODetails_AppDate() {}
CODetails_AppDate.weekends = true; 
CODetails_AppDate.tabIndex = 11;
CODetails_AppDate.maxLength = 11;
CODetails_AppDate.updateMode="clickCellMode";
CODetails_AppDate.helpText = "Application Date for the Consolidated Order";
CODetails_AppDate.componentName = "Application Date";
CODetails_AppDate.validateOn = [CODetails_AppDate.dataBinding,
								CODetails_OrderDate.dataBinding];
CODetails_AppDate.validate = function()
{	
	var date = Services.getValue(CODetails_AppDate.dataBinding);
	var errCode = MaintainCOFunctions.validateDateInFuture( date,
															true);//pTestNotinFuture
	if(errCode == null){
		// check precedes Order Date
		errCode = MaintainCOFunctions.validateDateNotAfterOrderDate(date);
	}
	return errCode;
}
CODetails_AppDate.enableOn = [Header_CONumber.dataBinding,
						  ManageCOParams.MODE];
CODetails_AppDate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_AppDate.isMandatory = function(){
	return true;
}
CODetails_AppDate.logicOn = [CODetails_AppDate.dataBinding];
CODetails_AppDate.logic = function(event)
{
	//uct 766
	if(event.getXPath() == CODetails_AppDate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);		
	}
}
CODetails_AppDate.readOnlyOn = [ Header_CONumber.dataBinding,
								 Header_Status.dataBinding,
						         ManageCOParams.MODE];
CODetails_AppDate.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	if(readOnly == false){
		readOnly == MaintainCOFunctions.isPaymentDividendInProgress();
	}
	return readOnly;
}

/****************************************************************************************************************/
function CODetails_OrderDate() {}
CODetails_OrderDate.weekends = true;
CODetails_OrderDate.tabIndex = 12;
CODetails_OrderDate.maxLength = 11;
CODetails_OrderDate.updateMode="clickCellMode";
CODetails_OrderDate.helpText = "The Order Date for the AO or CAEO";
CODetails_OrderDate.componentName = "Order Date";
CODetails_OrderDate.componentName = "Order Date";
CODetails_OrderDate.readOnlyOn = [ 	Header_CONumber.dataBinding,
								 	Header_Status.dataBinding,
						         	ManageCOParams.MODE];
CODetails_OrderDate.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	Services.startTransaction();
	
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
	}		
	
	Services.endTransaction();
	return readOnly;
}

CODetails_OrderDate.validateOn = [CODetails_OrderDate.dataBinding];
CODetails_OrderDate.validate = function()
{

	var date = Services.getValue(CODetails_OrderDate.dataBinding);
	var errCode = MaintainCOFunctions.validateDateInFuture( date,
															true);//pTestNotinFuture	
	return errCode;
}
CODetails_OrderDate.enableOn = [Header_CONumber.dataBinding,
						  ManageCOParams.MODE];
CODetails_OrderDate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_OrderDate.logicOn = [CODetails_OrderDate.dataBinding];
CODetails_OrderDate.logic = function(event)
{
	if(event.getXPath() == CODetails_OrderDate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);		
	}
}
/****************************************************************************************************************/
function CODetails_CompType() {}
CODetails_CompType.srcData = MaintainCOVariables.REF_DATA_XPATH + "/COCompTypes";
CODetails_CompType.rowXPath = "CompType";
CODetails_CompType.keyXPath = "Value";
CODetails_CompType.displayXPath = "Description";
CODetails_CompType.tabIndex = 13;
CODetails_CompType.helpText = "Calculation basis of Composition Order";
CODetails_CompType.componentName = "Composition Type";
CODetails_CompType.mandatoryOn = [CODetails_CompRate.dataBinding];
CODetails_CompType.isMandatory = function()
{
	// If Composition Rate entered this field is Mandatory
	var mandatory = false;
	var compRate = Services.getValue(CODetails_CompRate.dataBinding);
	if(compRate != null && compRate != ""){
		mandatory = true;
	}	
	return mandatory;
}
CODetails_CompType.readOnlyOn = [ 	Header_CONumber.dataBinding,
								 	Header_Status.dataBinding,
						         	ManageCOParams.MODE,
						         	Header_Type.dataBinding];
CODetails_CompType.isReadOnly = function()
{
	Services.startTransaction();
	// RO in create mode.  Updateable in maintain as long as no dividend made.
	var readOnly = false;
	
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		readOnly = MaintainCOFunctions.isCompositionFieldReadOnly();
	}
	
	Services.endTransaction();	
	return readOnly;
}
CODetails_CompType.enableOn = [Header_CONumber.dataBinding,
						  	   ManageCOParams.MODE];
CODetails_CompType.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_CompType.logicOn = [CODetails_CompType.dataBinding];
CODetails_CompType.logic = function(event)
{
	if(event.getXPath() == CODetails_CompType.dataBinding){
		Services.startTransaction();
		
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		
		MaintainCOFunctions.recalculateDueToComposition();
		
		Services.endTransaction();
	}
}
/****************************************************************************************************************/
function CODetails_CompRate() {}
CODetails_CompRate.tabIndex = 14;
CODetails_CompRate.maxLength = 2;
CODetails_CompRate.helpText = "Composition rate to be applied";
CODetails_CompRate.componentName = "Composition Rate";
CODetails_CompRate.mandatoryOn = [CODetails_CompType.dataBinding];
CODetails_CompRate.isMandatory = function()
{
	// If Composition Type entered this field is Mandatory
	var mandatory = false;
	var compType = Services.getValue(CODetails_CompType.dataBinding);
	if(compType != null && compType != ""){
		mandatory = true;
	}	
	return mandatory;
}
CODetails_CompRate.readOnlyOn = [ 	Header_CONumber.dataBinding,
								 	Header_Status.dataBinding,
						         	ManageCOParams.MODE,
						         	Header_Type.dataBinding];
CODetails_CompRate.isReadOnly = function()
{
	var readOnly = false;
	Services.startTransaction();
	// RO in create mode.  Updateable in maintain as long as no dividend made.
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		readOnly = MaintainCOFunctions.isCompositionFieldReadOnly();
	}
	
	Services.endTransaction();	
	return readOnly;
}
CODetails_CompRate.enableOn = [Header_CONumber.dataBinding,
						  	   ManageCOParams.MODE];
CODetails_CompRate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_CompRate.validateOn = [CODetails_CompType.dataBinding,
								 CODetails_CompRate.dataBinding];
CODetails_CompRate.validate = function()
{
	// allowed to have null/"" and 0 if not manndatory - they have same meaning
	// if mandatory must be between 1 and 99
	var errCode = null;
	Services.startTransaction();
	
	var compType = Services.getValue(CODetails_CompType.dataBinding);
	var compRate = Services.getValue(CODetails_CompRate.dataBinding);
	
	if(compRate != null && compRate != ""){
		// check numeric, the between 1 and 99
		var valid = compRate.search(CaseManValidationHelper.NUMERIC_PATTERN);
		if(valid < 0){
			errCode = ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
		}	
		if(parseFloat(compRate) < 0){ // NB no check for > 99 as can only enter 2 digits in field
			errCode = ErrorCode.getErrorCode("CaseMan_PercentageNotInCorrectRange_Msg");
		}
		else if(parseFloat(compRate) == 0){
			var compRate = Services.getValue(CODetails_CompRate.dataBinding);
			// NB can be 0 if no composition type exists
			if(compType != null && compType != ""){
				errCode = ErrorCode.getErrorCode("CaseMan_PercentageNotInCorrectRange_Msg");		
			}		
		}
	}
	Services.endTransaction();
	
	return errCode;
}
CODetails_CompRate.logicOn = [CODetails_CompRate.dataBinding];
CODetails_CompRate.logic = function(event)
{
	if(event.getXPath() == CODetails_CompRate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		if(CODetails_CompRate.validate() == null){
			MaintainCOFunctions.recalculateDueToComposition();
			if(MaintainCOFunctions.debtsExist() == true){
				alert(Messages.NEW_COMPOSITION_MESSAGE);
			}
		}
	}
}
/****************************************************************************************************************/
function CODetails_Target() {}
CODetails_Target.tabIndex = 16;
CODetails_Target.maxLength = 2;
CODetails_Target.helpText = "The target percentage";
CODetails_Target.componentName = "Target";
CODetails_Target.isMandatory = function(){
	return true;
}
CODetails_Target.isTemporary = function()
{
	return false;
}
CODetails_Target.readOnlyOn = [ Header_CONumber.dataBinding,
								 Header_Status.dataBinding,
						         ManageCOParams.MODE];
CODetails_Target.isReadOnly = function()
{
	Services.startTransaction();
	
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
	}
	
	Services.endTransaction();
	return readOnly;
}
CODetails_Target.enableOn = [Header_CONumber.dataBinding,
						  	 ManageCOParams.MODE];
CODetails_Target.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_Target.validateOn = [CODetails_Target.dataBinding,
							   CO_Money_TotalDue.dataBinding];
CODetails_Target.validate = function()
{
	// allowed to have null/"" and 0 if not mandatory - they have same meaning
	// if mandatory must be between 1 and 99
	var errCode = null;
	Services.startTransaction();
	
	var target = Services.getValue(CODetails_Target.dataBinding);
	
	if(target != null && target != ""){
		// check conforms to pattern - i.e. is a number
		var valid = target.search(CaseManValidationHelper.NUMERIC_PATTERN);
		if(valid < 0){
			errCode = ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
		}		
		else if(target < 1){ // nb no check for > 99 as can only enter 2 digits in field
			errCode = ErrorCode.getErrorCode("CaseMan_PercentageNotInCorrectRange_Msg");
		}
	}
	Services.endTransaction();
	
	return errCode;
}
CODetails_Target.logicOn = [CODetails_Target.dataBinding,
							CO_Money_TotalDue.dataBinding];
CODetails_Target.logic = function(event)
{
	Services.startTransaction();
	if(event.getXPath() == CODetails_Target.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}// if(event.getXPath(
	// if enter a value in this field - set the Target amount and the currency amount
	var target = Services.getValue(CODetails_Target.dataBinding);
	if(target != null && target != ""){		
		// set the target amount if total due has an entry
		var totalDue = Services.getValue(CO_Money_TotalDue.dataBinding);
		if(totalDue != null && totalDue != "" && parseFloat(totalDue) != 0){
			// check conforms to pattern - i.e. is a number
			var valid = target.search(CaseManValidationHelper.NUMERIC_PATTERN);
			if(valid > -1){
				var tmpTargetAmount = parseFloat(target)/100 * parseFloat(totalDue);
				var targetAmount = tmpTargetAmount.toFixed(2);
				Services.setValue(CODetails_TargetAmount.dataBinding, targetAmount);
			}	
		}		
	}
	else{
		Services.setValue(CODetails_TargetAmount.dataBinding, "0.00");
	}
	
	// UCT Defect 760, set the Target Amount Currency field
	var defaultCurrency = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	if ( CaseManUtils.isBlank(defaultCurrency) ) { defaultCurrency = CaseManUtils.CURRENCY_POUNDCODE; }
	Services.setValue(CODetails_TargetAmountCurrency.dataBinding, defaultCurrency);
	
	Services.endTransaction();
}
/****************************************************************************************************************/
function CODetails_TargetAmount() {}
CODetails_TargetAmount.tabIndex = -1;
CODetails_TargetAmount.maxLength = 12;
CODetails_TargetAmount.isReadOnly = function()
{
	return true;
}
CODetails_TargetAmount.enableOn = [Header_CONumber.dataBinding,
						  	       ManageCOParams.MODE];
CODetails_TargetAmount.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_TargetAmount.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CODetails_TargetAmount.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/****************************************************************************************/
function CODetails_TargetAmountCurrency() {}
CODetails_TargetAmountCurrency.tabIndex = -1;
CODetails_TargetAmountCurrency.maxLength = 3;
CODetails_TargetAmountCurrency.isReadOnly = function()
{
	return true;
}
CODetails_TargetAmountCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CODetails_TargetAmountCurrency.enableOn = [Header_CONumber.dataBinding,
						  	 			   ManageCOParams.MODE];
CODetails_TargetAmountCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/******************************************************************************/
function CODetails_FeeRate() {}
CODetails_FeeRate.srcData = MaintainCOVariables.REF_DATA_XPATH + "/FeeRates";
CODetails_FeeRate.rowXPath = "Fee";
CODetails_FeeRate.keyXPath = "Value";
CODetails_FeeRate.displayXPath = "Value";
CODetails_FeeRate.tabIndex = 17;
CODetails_FeeRate.maxLength = 2;
CODetails_FeeRate.helpText = "Denotes the percentage rate of fees for the Consolidation Order.";
CODetails_FeeRate.componentName = "Fee Rate";
CODetails_FeeRate.isMandatory = function(){
	return true;
}
CODetails_FeeRate.readOnlyOn = [ Header_CONumber.dataBinding,
								 Header_Status.dataBinding,
						         ManageCOParams.MODE];
CODetails_FeeRate.isReadOnly = function(event)
{
	Services.startTransaction();
	var readOnly = false;

	// only updateable for certain CO Status		
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
	}// end if/else
	
	Services.endTransaction();
	return readOnly;
}
CODetails_FeeRate.enableOn = [Header_CONumber.dataBinding,
						  	  ManageCOParams.MODE];
CODetails_FeeRate.isEnabled = function(event)
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_FeeRate.logicOn = [CODetails_FeeRate.dataBinding];
CODetails_FeeRate.logic = function(event)
{
	Services.startTransaction();
	if(event.getXPath() == CODetails_FeeRate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		
		// if enter a value in this field - set the Fee amount and Scedule2 Fee Amount and any relevant totals
		var feeRate = Services.getValue(CODetails_FeeRate.dataBinding);
		var totalAllowed = Services.getValue(CO_Money_TotalAllowed.dataBinding);
		var totalPassthroughs = Services.getValue(CO_Money_TotalPassthroughs.dataBinding);
		var totalScheduleTwo = MaintainCOFunctions.getTotalAmount(	MaintainCOVariables.DEBT_AMOUNT_ALLOWED_XPATH,
																	true);//pScheduleTwo
		// calculate fee
		MaintainCOFunctions.setFees(	feeRate, //pFeeRate
										totalAllowed, //pTotalAllowed)
										totalPassthroughs,//pTotalPassthrough
										totalScheduleTwo); //pTotalSchedule2
		
		// set total due
		var feeTotal = Services.getValue(CO_Money_TotalFee.dataBinding); 
		MaintainCOFunctions.setTotalDue(	totalAllowed,//pTotalAllowed, 
											feeTotal); //pFee										
		
		// now can set the schedule 2 total
		// Legacy includes fees in this total - therefore so do we
		var schedTwoFee = Services.getValue(CO_Money_ScheduleTwoFee.dataBinding);
		if(schedTwoFee == null || schedTwoFee == ""){
			schedTwoFee = "0.00";
		}
		totalSceduleTwo = parseFloat(totalScheduleTwo) + parseFloat(schedTwoFee);
		// set the value
		Services.setValue(CO_Money_ScheduleTwoTotal.dataBinding, totalSceduleTwo);
		
		MaintainCOFunctions.setTotalOutstanding();
		MaintainCOFunctions.setTotalDueFromDebtor();
	}
	
	Services.endTransaction();
}
/*************************************************************************************************/
function CODetails_InstlAmount() {}
CODetails_InstlAmount.tabIndex = 18;
CODetails_InstlAmount.maxLength = 11;
CODetails_InstlAmount.helpText = "The instalment amount";
CODetails_InstlAmount.componentName = "Instalment Amount";
CODetails_InstlAmount.readOnlyOn = [ Header_CONumber.dataBinding,
									 Header_Status.dataBinding,
							         ManageCOParams.MODE];
CODetails_InstlAmount.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		if(MaintainCOFunctions.isPaymentDividendInProgress() == true){
			readOnly = true;
		}
	}// end if/else
	
	return readOnly;
}
CODetails_InstlAmount.validateOn = [CODetails_InstlAmount.dataBinding,
									CODetails_CompType.dataBinding,
									CODetails_CompRate.dataBinding,
									CO_Money_TotalOutstanding.dataBinding];
CODetails_InstlAmount.validate = function()
{
	var errCode = null;
	
	// Defect 5217 - needs to be 2dp
	var instAmt = CaseManUtils.transformAmountToTwoDP(Services.getValue(CODetails_InstlAmount.dataBinding), null);

	var totalOutstanding = Services.getValue(CO_Money_TotalOutstanding.dataBinding);
	if(instAmt != null && instAmt != ""){
		// check conforms to pattern
		var validCurrency = instAmt.search(MaintainCOVariables.CURRENCY_MAX_10_PATTERN);
		if(validCurrency < 0){
			errCode = ErrorCode.getErrorCode('CaseMan_amountIncorrectFormat10_Msg');
		}
		else if(parseFloat(instAmt) < 0.01){
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
		}
		/* as per email from Phil Hardy - validation not required
		else if(parseFloat(instAmt) > parseFloat(totalOutstanding)){
			errCode = ErrorCode.getErrorCode("CaseMan_greaterThanTotalOutstanding_Msg");
		}*/
	}
	
	return errCode;
}
CODetails_InstlAmount.enableOn = [Header_CONumber.dataBinding,
						  	  	  ManageCOParams.MODE];
CODetails_InstlAmount.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_InstlAmount.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CODetails_InstlAmount.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CODetails_InstlAmount.logicOn = [CODetails_InstlAmount.dataBinding];
CODetails_InstlAmount.logic = function(event)
{
	if(event.getXPath() == CODetails_InstlAmount.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/**************************************************************************************************/
function CODetails_InstlAmountCurrency() {}
CODetails_InstlAmountCurrency.tabIndex = -1;
CODetails_InstlAmountCurrency.maxLength = 3;
CODetails_InstlAmountCurrency.isReadOnly = function()
{
	return true;
}
CODetails_InstlAmountCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CODetails_InstlAmountCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	    			ManageCOParams.MODE];
CODetails_InstlAmountCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/******************************************************************************/
function CODetails_Frequency() {}
CODetails_Frequency.srcData = MaintainCOVariables.REF_DATA_XPATH + "/COFrequency";
CODetails_Frequency.rowXPath = "Frequency";
CODetails_Frequency.keyXPath = "Value";
CODetails_Frequency.displayXPath = "Description";
CODetails_Frequency.tabIndex = 19;
CODetails_Frequency.helpText = "Frequency of payment";
CODetails_Frequency.componentName = "Frequency";
CODetails_Frequency.readOnlyOn = [ 	 Header_CONumber.dataBinding,
									 Header_Status.dataBinding,
							         ManageCOParams.MODE];
CODetails_Frequency.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}	
	return readOnly;
}
CODetails_Frequency.enableOn = [Header_CONumber.dataBinding,
						  	    ManageCOParams.MODE];
CODetails_Frequency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_Frequency.logicOn = [CODetails_Frequency.dataBinding];
CODetails_Frequency.logic = function(event)
{
	if(event.getXPath() == CODetails_Frequency.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/******************************************************************************/
function CODetails_FirstPayDate() {}
CODetails_FirstPayDate.weekends = true;
CODetails_FirstPayDate.tabIndex = 20;
CODetails_FirstPayDate.maxLength = 11;
CODetails_FirstPayDate.updateMode="clickCellMode";
CODetails_FirstPayDate.helpText = "Date first payment is scheduled to be made";
CODetails_FirstPayDate.componentName = "First payment date";
CODetails_FirstPayDate.componentName = "First payment date";
CODetails_FirstPayDate.validateOn = [CODetails_FirstPayDate.dataBinding,
									 CODetails_OrderDate.dataBinding];
CODetails_FirstPayDate.validate = function()
{	
	Services.startTransaction();
	
	var date = Services.getValue(CODetails_FirstPayDate.dataBinding);
	var errCode = MaintainCOFunctions.validateDateNotBeforeOrderDate(date);
	
	Services.endTransaction();
	return errCode;
}
CODetails_FirstPayDate.readOnlyOn = [Header_CONumber.dataBinding,
									 Header_Status.dataBinding,
							         ManageCOParams.MODE];
CODetails_FirstPayDate.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CODetails_FirstPayDate.enableOn = [Header_CONumber.dataBinding,
						  	       ManageCOParams.MODE];
CODetails_FirstPayDate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_FirstPayDate.logicOn = [CODetails_FirstPayDate.dataBinding];
CODetails_FirstPayDate.logic = function(event)
{
	if(event.getXPath() == CODetails_FirstPayDate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/****************************************************************************************************************/
function CODetails_ReviewDate() {}
CODetails_ReviewDate.weekends = true;
CODetails_ReviewDate.tabIndex = 22;
CODetails_ReviewDate.maxLength = 11;
CODetails_ReviewDate.updateMode="clickCellMode";
CODetails_ReviewDate.helpText = "The date the order is scheduled for a review.";
CODetails_ReviewDate.componentName = "Review Date";
CODetails_ReviewDate.componentName = "Review Date";
CODetails_ReviewDate.enableOn = [Header_CONumber.dataBinding,
						  	     ManageCOParams.MODE];
CODetails_ReviewDate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_ReviewDate.readOnlyOn = [	Header_CONumber.dataBinding,
								 	Header_Status.dataBinding,
						         	ManageCOParams.MODE];
CODetails_ReviewDate.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}
	return readOnly;
}
CODetails_ReviewDate.validateOn = [CODetails_ReviewDate.dataBinding];
CODetails_ReviewDate.validate = function(event)
{	
	var errCode = null;
	if(event.getXPath() == CODetails_ReviewDate.dataBinding){
		Services.startTransaction();
		// ensure the date is in the future
		var date = Services.getValue(CODetails_ReviewDate.dataBinding);
		errCode = MaintainCOFunctions.validateDateInFuture( date,
																false);//pTestNotinFuture
		
		Services.endTransaction();
	}
	return errCode;
}
CODetails_ReviewDate.logicOn = [CODetails_ReviewDate.dataBinding];
CODetails_ReviewDate.logic = function(event)
{
	if(event.getXPath() == CODetails_ReviewDate.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/****************************************************************************************************************/
function CODetails_RevokedDischargedDate() {}
CODetails_RevokedDischargedDate.weekends = true;
CODetails_RevokedDischargedDate.tabIndex = 23;
CODetails_RevokedDischargedDate.maxLength = 11;
CODetails_RevokedDischargedDate.updateMode="clickCellMode";
CODetails_RevokedDischargedDate.helpText = "The date the order was revoked or discharged.";
CODetails_RevokedDischargedDate.componentName = "Revoke/Discharge Date";
CODetails_RevokedDischargedDate.componentName = "Revoke/Discharge Date";
CODetails_RevokedDischargedDate.enableOn = [Header_CONumber.dataBinding,
						  	    			ManageCOParams.MODE];
CODetails_RevokedDischargedDate.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_RevokedDischargedDate.readOnlyOn = [ 	Header_CONumber.dataBinding,
									 			Header_Status.dataBinding,
							         			ManageCOParams.MODE];
CODetails_RevokedDischargedDate.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
			
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		readOnly = MaintainCOFunctions.isPaymentDividendInProgress();
		if(readOnly == false){
			var updatable = MaintainCOFunctions.statusAllowsUpdate();
			if(updatable == false){
				// need to check if status is revoked
				var status = Services.getValue("/ds/MaintainCO/COStatus");
				if(null != status && status != "" && status != MaintainCOVariables.STATUS_REVOKED
					 && status != MaintainCOVariables.STATUS_DISCHARGED){
					readOnly = true;
				}
			}
		}
	}// end if/else	
	
	return readOnly;
}
CODetails_RevokedDischargedDate.validateOn = [	CODetails_RevokedDischargedDate.dataBinding,
												CODetails_OrderDate.dataBinding];
CODetails_RevokedDischargedDate.validate = function(event)
{	
	var errCode = null;
	if(event.getXPath() == CODetails_RevokedDischargedDate.dataBinding || event.getXPath() == CODetails_OrderDate.dataBinding){
		var date = Services.getValue(CODetails_RevokedDischargedDate.dataBinding);
		errCode = MaintainCOFunctions.validateDateInFuture( date,
																true);//pTestNotinFuture
		if(errCode == null){
			// check precedes Order Date
			errCode = MaintainCOFunctions.validateDateNotBeforeOrderDate(date);
		}
	}
	return errCode;
}
CODetails_RevokedDischargedDate.logicOn = [	CODetails_RevokedDischargedDate.dataBinding];
CODetails_RevokedDischargedDate.logic = function(event)
{
	if(event.getXPath() == CODetails_RevokedDischargedDate.dataBinding){
		Services.startTransaction();
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		var disDate = Services.getValue(CODetails_RevokedDischargedDate.dataBinding);
		// need to check to see if event needs to be written -- 705 or 706
		var origDate = Services.getValue(MaintainCOVariables.ORIGINAL_REVOKED_DATE);
		if(disDate != null && disDate != ""){
			// set the status to revoked
			Services.setValue(Header_Status.dataBinding, MaintainCOVariables.STATUS_REVOKED);
			if(origDate == null || origDate == "" || origDate != disDate){
				// set the event 706 flag
				Services.setValue(MaintainCOVariables.EVENT706_CHANGE_TO_REVOKED, MaintainCOVariables.YES);
			}
			else{
				// unset the event 706 flag
				Services.setValue(MaintainCOVariables.EVENT706_CHANGE_TO_REVOKED, MaintainCOVariables.NO);
			}
			
		}
		else{
			// set to live
			Services.setValue(Header_Status.dataBinding, MaintainCOVariables.STATUS_LIVE);
			if(origDate != null && origDate != ""){
				// set the event 705 flag
				Services.setValue(MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED, MaintainCOVariables.YES);
				
			}
			else{
				// unset the event 705 flag
				Services.setValue(MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED, MaintainCOVariables.NO);
			}
		}
		Services.endTransaction();
	}
}
/****************************************************************************************************************/
function CODetails_AdhocDiv() {}
CODetails_AdhocDiv.modelValue = {checked: 'Y', unchecked: 'N'};
CODetails_AdhocDiv.tabIndex = 15;
CODetails_AdhocDiv.helpText = "Include Consolidation Order in next dividend run?";
CODetails_AdhocDiv.enableOn = [Header_CONumber.dataBinding,
						  	   ManageCOParams.MODE];
CODetails_AdhocDiv.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CODetails_AdhocDiv.readOnlyOn = [ Header_CONumber.dataBinding,
								 Header_Status.dataBinding,
						         ManageCOParams.MODE];
CODetails_AdhocDiv.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		readOnly = true;
	}
	else{
		// If payment/dividend in progress - this field is read only.
		if(MaintainCOFunctions.isPaymentDividendInProgress() == true){
			readOnly = true;
		}
		else if(MaintainCOFunctions.releasablePaymentsExist() == false){
			// Update prevented if monies in court are not yet available for dividend declaration.
			readOnly = true;
		}
		else if(MaintainCOFunctions.isUnresolvedOverpayment() == true){
			// Update prevented if Overpayment exists which must be resolved.
			readOnly = true;
		}
	}// end if/else
	
	return readOnly;
}
CODetails_AdhocDiv.logicOn = [CODetails_AdhocDiv.dataBinding];
CODetails_AdhocDiv.logic = function(event)
{
	if(event.getXPath() == CODetails_AdhocDiv.dataBinding){
		Services.startTransaction();
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		var adHoc = Services.getValue(CODetails_AdhocDiv.dataBinding);
		if(null != adHoc && adHoc == 'Y'){
			if(MaintainCOFunctions.hasPayoutListRan() == true){
				// Display a warning message if pre payout list has already run.
				alert(Messages.PREPAYOUT_LIST_RUN);
			}	
		}
		Services.endTransaction();
	}
}
/**********************************************************************************/
function CO_EmploymentDetailsPERCurrency() {}
CO_EmploymentDetailsPERCurrency.tabIndex = -1;
CO_EmploymentDetailsPERCurrency.maxLength = 3;
CO_EmploymentDetailsPERCurrency.helpText = "Amount to which earnings are protected";
CO_EmploymentDetailsPERCurrency.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetailsPERCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_EmploymentDetailsPERCurrency.enableOn = [Header_CONumber.dataBinding,
						  	 			   ManageCOParams.MODE];
CO_EmploymentDetailsPERCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
/**********************************************************************************/
function CO_EmploymentDetailsPER() {}
CO_EmploymentDetailsPER.tabIndex = 21;
CO_EmploymentDetailsPER.maxLength = 8; 
CO_EmploymentDetailsPER.helpText = "Amount to which earnings are protected";
CO_EmploymentDetailsPER.componentName = "PER";
CO_EmploymentDetailsPER.readOnlyOn = [	Header_CONumber.dataBinding,
										 Header_Status.dataBinding,
								         ManageCOParams.MODE];
CO_EmploymentDetailsPER.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetailsPER.enableOn = [Header_CONumber.dataBinding,
						  	 			   ManageCOParams.MODE];
CO_EmploymentDetailsPER.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetailsPER.validateOn = [CO_EmploymentDetailsPER.dataBinding];
CO_EmploymentDetailsPER.validate = function()
{
	var errCode = null;
	
	var per = Services.getValue(CO_EmploymentDetailsPER.dataBinding);

	if(per != null && per != ""){
		// check conforms to pattern
		var rangeError = ErrorCode.getErrorCode("CaseMan_amountIncorrectFormat7_Msg");
		errCode = CaseManValidationHelper.validatePattern(per, CaseManValidationHelper.CURRENCY_PATTERN, rangeError);
		if(errCode != null) {
			return rangeError;
		}
		errCode = CaseManValidationHelper.validateValueInRange(per, -99999.99, 99999.99, rangeError);
		if(errCode != null) {
			return rangeError;
		}
	}
	
	return errCode;
}
CO_EmploymentDetailsPER.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
CO_EmploymentDetailsPER.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
CO_EmploymentDetailsPER.logicOn = [CO_EmploymentDetailsPER.dataBinding];
CO_EmploymentDetailsPER.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetailsPER.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/****************************************************************************************************************/

/*****************************************************************************************************************
                                        CO ADDRESS DETAILS TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function CO_ContactDetails_Address_Line1() {}
CO_ContactDetails_Address_Line1.tabIndex = -1;
CO_ContactDetails_Address_Line1.maxLength = 35;
CO_ContactDetails_Address_Line1.helpText = "First line of the Debtor's address.";
CO_ContactDetails_Address_Line1.componentName = "Debtor Address Line 1";
CO_ContactDetails_Address_Line1.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Line1.isMandatory = function()
{
	return true;
}
CO_ContactDetails_Address_Line1.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_Line1.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_Line2() {}
CO_ContactDetails_Address_Line2.tabIndex = -1;
CO_ContactDetails_Address_Line2.maxLength = 35;
CO_ContactDetails_Address_Line2.helpText = "Second line of the Debtor's address.";
CO_ContactDetails_Address_Line2.componentName = "Debtor Address Line 2";
CO_ContactDetails_Address_Line2.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Line2.isMandatory = function()
{
	return true;
}
CO_ContactDetails_Address_Line2.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_Line2.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_Line3() {}
CO_ContactDetails_Address_Line3.tabIndex = -1;
CO_ContactDetails_Address_Line3.maxLength = 35;
CO_ContactDetails_Address_Line3.helpText = "Third line of the Debtor's address.";
CO_ContactDetails_Address_Line3.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Line3.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_Line3.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_Line4() {}
CO_ContactDetails_Address_Line4.tabIndex = -1;
CO_ContactDetails_Address_Line4.maxLength = 35;
CO_ContactDetails_Address_Line4.helpText = "Fourth line of the Debtor's address.";
CO_ContactDetails_Address_Line4.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Line4.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_Line4.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_Line5() {}
CO_ContactDetails_Address_Line5.tabIndex = -1;
CO_ContactDetails_Address_Line5.maxLength = 35;
CO_ContactDetails_Address_Line5.helpText = "Fifth line of the Debtor's address.";
CO_ContactDetails_Address_Line5.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Line5.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_Line5.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_Postcode() {}
CO_ContactDetails_Address_Postcode.tabIndex = -1;
CO_ContactDetails_Address_Postcode.maxLength = 35;
CO_ContactDetails_Address_Postcode.helpText = "Postcode of the Debtor's address.";
CO_ContactDetails_Address_Postcode.componentName = "Debtor Postcode";
CO_ContactDetails_Address_Postcode.isReadOnly = function()
{
	return true;
}
CO_ContactDetails_Address_Postcode.enableOn = [Header_CONumber.dataBinding,
						  	 			       ManageCOParams.MODE];
CO_ContactDetails_Address_Postcode.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_ContactDetails_Address_DXNo() {}
CO_ContactDetails_Address_DXNo.tabIndex = 30;
CO_ContactDetails_Address_DXNo.maxLength = 35;
CO_ContactDetails_Address_DXNo.helpText = "Document exchange reference number";
CO_ContactDetails_Address_DXNo.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_DXNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_ContactDetails_Address_DXNo.enableOn = [Header_CONumber.dataBinding,
						  	 			   ManageCOParams.MODE];
CO_ContactDetails_Address_DXNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_DXNo.logicOn = [CO_ContactDetails_Address_DXNo.dataBinding];
CO_ContactDetails_Address_DXNo.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_DXNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
CO_ContactDetails_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_ContactDetails_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/**********************************************************************************/
function CO_ContactDetails_Address_TelNo() {}
CO_ContactDetails_Address_TelNo.tabIndex = 31;
CO_ContactDetails_Address_TelNo.maxLength = 24;
CO_ContactDetails_Address_TelNo.helpText = "Debtor's telephone number.";
CO_ContactDetails_Address_TelNo.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_TelNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_ContactDetails_Address_TelNo.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_TelNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_TelNo.logicOn = [CO_ContactDetails_Address_TelNo.dataBinding];
CO_ContactDetails_Address_TelNo.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_TelNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/**********************************************************************************/
function CO_ContactDetails_Address_FaxNo() {}
CO_ContactDetails_Address_FaxNo.tabIndex = 32;
CO_ContactDetails_Address_FaxNo.maxLength = 24;
CO_ContactDetails_Address_FaxNo.helpText = "Debtor's fax number.";
CO_ContactDetails_Address_FaxNo.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_FaxNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_ContactDetails_Address_FaxNo.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_ContactDetails_Address_FaxNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_FaxNo.logicOn = [CO_ContactDetails_Address_FaxNo.dataBinding];
CO_ContactDetails_Address_FaxNo.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_FaxNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/**********************************************************************************/
function CO_ContactDetails_Address_Email() {}
CO_ContactDetails_Address_Email.tabIndex = 33;
CO_ContactDetails_Address_Email.maxLength = 80;
CO_ContactDetails_Address_Email.helpText = "Debtor's email address";
CO_ContactDetails_Address_Email.componentName = "Debtor's email address";
CO_ContactDetails_Address_Email.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_Email.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}
	return readOnly;
}
CO_ContactDetails_Address_Email.enableOn = [Header_CONumber.dataBinding,
						  	 			       ManageCOParams.MODE];
CO_ContactDetails_Address_Email.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_Email.validateOn = [CO_ContactDetails_Address_Email.dataBinding];
CO_ContactDetails_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(CO_ContactDetails_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
CO_ContactDetails_Address_Email.logicOn = [CO_ContactDetails_Address_Email.dataBinding];
CO_ContactDetails_Address_Email.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_Email.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}

/**********************************************************************************/
function CO_ContactDetails_Address_CommMethod() {}
CO_ContactDetails_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
CO_ContactDetails_Address_CommMethod.rowXPath = "Method";
CO_ContactDetails_Address_CommMethod.keyXPath = "Id";
CO_ContactDetails_Address_CommMethod.displayXPath = "Name";
CO_ContactDetails_Address_CommMethod.tabIndex = 34;
CO_ContactDetails_Address_CommMethod.maxLength = 24;
CO_ContactDetails_Address_CommMethod.helpText = "The preferred communication method of the Debtor.";
CO_ContactDetails_Address_CommMethod.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_CommMethod.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_ContactDetails_Address_CommMethod.enableOn = [Header_CONumber.dataBinding,
						  	 			         ManageCOParams.MODE];
CO_ContactDetails_Address_CommMethod.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_CommMethod.logicOn = [CO_ContactDetails_Address_CommMethod.dataBinding];
CO_ContactDetails_Address_CommMethod.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_CommMethod.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/******************************************************************************/
function CO_ContactDetails_Address_Welsh() {}
CO_ContactDetails_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
CO_ContactDetails_Address_Welsh.tabIndex = 35;
CO_ContactDetails_Address_Welsh.helpText = "Tick box if the Debtor is to receive documents translated into Welsh.";
CO_ContactDetails_Address_Welsh.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_ContactDetails_Address_Welsh.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_ContactDetails_Address_Welsh.enableOn = [Header_CONumber.dataBinding,
						  	 			       ManageCOParams.MODE];
CO_ContactDetails_Address_Welsh.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_ContactDetails_Address_Welsh.logicOn = [CO_ContactDetails_Address_Welsh.dataBinding];
CO_ContactDetails_Address_Welsh.logic = function(event)
{
	if(event.getXPath() == CO_ContactDetails_Address_Welsh.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/******************************************************************************/
function CO_DebtorAddressCreatedBy() {}
CO_DebtorAddressCreatedBy.tabIndex = -1;
CO_DebtorAddressCreatedBy.maxLength = 35;
CO_DebtorAddressCreatedBy.helpText = "The name of User who created the Address.";
CO_DebtorAddressCreatedBy.isReadOnly = function()
{
	return true;
}
CO_DebtorAddressCreatedBy.enableOn = [Header_CONumber.dataBinding,
						  	 		  ManageCOParams.MODE];
CO_DebtorAddressCreatedBy.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/

/*****************************************************************************************************************
                                        CO EMPLOYER DETAILS TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function CO_EmploymentDetails_Address_NamedPerson() {}
CO_EmploymentDetails_Address_NamedPerson.tabIndex = 41;
CO_EmploymentDetails_Address_NamedPerson.maxLength = 70;
CO_EmploymentDetails_Address_NamedPerson.helpText = "Employer's contact name.";
CO_EmploymentDetails_Address_NamedPerson.readOnlyOn = [	Header_CONumber.dataBinding,
													 	Header_Status.dataBinding,
											         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_NamedPerson.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_NamedPerson.logicOn = [CO_EmploymentDetails_Address_NamedPerson.dataBinding];
CO_EmploymentDetails_Address_NamedPerson.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_NamedPerson.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}// end if(event.getXPath() == CO_EmploymentDetails...
}
CO_EmploymentDetails_Address_NamedPerson.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_EmploymentDetails_Address_NamedPerson.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
CO_EmploymentDetails_Address_NamedPerson.enableOn = [	Header_CONumber.dataBinding,
						  	 		  					ManageCOParams.MODE];
CO_EmploymentDetails_Address_NamedPerson.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_EmploymentDetails_Employer() {}
CO_EmploymentDetails_Employer.tabIndex = 40;
CO_EmploymentDetails_Employer.maxLength = 70;
CO_EmploymentDetails_Employer.helpText = "Employer's Name.";
CO_EmploymentDetails_Employer.componentName = "Employer's Name.";
CO_EmploymentDetails_Employer.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetails_Employer.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Employer.mandatoryOn = [   CO_EmploymentDetails_Address_NamedPerson.dataBinding,
												CO_EmploymentDetailsOccupation.dataBinding,
												CO_EmploymentDetailsPayRef.dataBinding,
												CO_EmploymentDetails_Address_Line1.dataBinding,
												CO_EmploymentDetails_Address_DXNo.dataBinding,
												CO_EmploymentDetails_Address_TelNo.dataBinding,
												CO_EmploymentDetails_Address_FaxNo.dataBinding,
												CO_EmploymentDetails_Address_Email.dataBinding,
												CO_EmploymentDetails_Address_CommMethod.dataBinding,
												CO_EmploymentDetails_Address_Welsh.dataBinding];

CO_EmploymentDetails_Employer.isMandatory = function()
{
	var mandatory = false;
	// mandatory if Employer address or extra details entered
	var namedPerson = Services.getValue(CO_EmploymentDetails_Address_NamedPerson.dataBinding);
	var occ = Services.getValue(CO_EmploymentDetailsOccupation.dataBinding);
	var payRef = Services.getValue(CO_EmploymentDetailsPayRef.dataBinding);
	var add1 = Services.getValue(CO_EmploymentDetails_Address_Line1.dataBinding);
	var dx = Services.getValue(CO_EmploymentDetails_Address_DXNo.dataBinding);
	var tel = Services.getValue(CO_EmploymentDetails_Address_TelNo.dataBinding);
	var fax = Services.getValue(CO_EmploymentDetails_Address_FaxNo.dataBinding);
	var email = Services.getValue(CO_EmploymentDetails_Address_Email.dataBinding);
	var comm = Services.getValue(CO_EmploymentDetails_Address_CommMethod.dataBinding);
	var welsh = Services.getValue(CO_EmploymentDetails_Address_Welsh.dataBinding);
	
	if(add1 != null && add1 != ""){
		mandatory = true;
	}
	else if(namedPerson != null && namedPerson != ""){
		mandatory = true;
	}
	else if(occ != null && occ != ""){
		mandatory = true;
	}
	else if(payRef != null && payRef != ""){
		mandatory = true;
	}
	else if(add1 != null && add1 != ""){
		mandatory = true;
	}
	else if(dx != null && dx != ""){
		mandatory = true;
	}
	else if(tel != null && tel != ""){
		mandatory = true;
	}
	else if(fax != null && fax != ""){
		mandatory = true;
	}
	else if(email != null && email != ""){
		mandatory = true;
	}
	else if(comm != null && comm != ""){
		mandatory = true;
	}
	else if(welsh != null && welsh != "" && welsh == MaintainCOVariables.YES){
		mandatory = true;
	}
	
	return mandatory; 
}
CO_EmploymentDetails_Employer.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_EmploymentDetails_Employer.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
CO_EmploymentDetails_Employer.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_EmploymentDetails_Employer.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Employer.logicOn = [CO_EmploymentDetails_Employer.dataBinding];
CO_EmploymentDetails_Employer.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Employer.dataBinding){
		Services.startTransaction();
		
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
		var employer = Services.getValue(CO_EmploymentDetails_Employer.dataBinding);
		var commMeth = Services.getValue(CO_EmploymentDetails_Address_CommMethod.dataBinding);
		if(commMeth == null || commMeth == ""){
			if(employer != null && employer != ""){
				Services.setValue(CO_EmploymentDetails_Address_CommMethod.dataBinding, "LE");
			}
		}
		// Need to set event when changed in Maintain Mode
		if(MaintainCOFunctions.isScreenModeMaintain() == true){
			var origEmployer = Services.getValue(MaintainCOVariables.ORIGINAL_EMPLOYER_NAME);			
			if(origEmployer != null && origEmployer != "" && employer != null && employer != "" ){
				if(origEmployer.toUpperCase() == employer.toUpperCase()){
					var employerAddChange = Services.getValue(MaintainCOVariables.EMPLOYMENT_ADDRESS_CHANGED);
					if(employerAddChange == null || employerAddChange == "" || employerAddChange == MaintainCOVariables.NO){
						// unset the event flag
						Services.setValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS, MaintainCOVariables.NO);
					}
				}
				else{
					// set the event flag
					Services.setValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS, MaintainCOVariables.YES);
				}// end if/else
			}// end if(origEmployer != null && origEmployer != "" ...
		}// if(MaintainCOFunctions.isScreenModeMaintain() == true){
		Services.endTransaction();
	}
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_Line1() {}
CO_EmploymentDetails_Address_Line1.tabIndex = -1;
CO_EmploymentDetails_Address_Line1.maxLength = 35;
CO_EmploymentDetails_Address_Line1.helpText = "First line of the Employer's address.";
CO_EmploymentDetails_Address_Line1.componentName = "Employer's First Line of Address.";
CO_EmploymentDetails_Address_Line1.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Line1.mandatoryOn = [CO_EmploymentDetails_Employer.dataBinding];
CO_EmploymentDetails_Address_Line1.isMandatory = function()
{
	var mandatory = false;
	//only mandatory if Employer address entered
	var emp = Services.getValue(CO_EmploymentDetails_Employer.dataBinding);
	if(emp != null && emp != ""){
		mandatory = true;
	}	
	return mandatory; 
}
CO_EmploymentDetails_Address_Line1.enableOn = [Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Line1.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_Line1.logicOn = [CO_EmploymentDetails_Address_Line1.dataBinding];
CO_EmploymentDetails_Address_Line1.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_Line1.dataBinding){		
		var employerAdd1 = Services.getValue(CO_EmploymentDetails_Address_Line1.dataBinding);
		var commMeth = Services.getValue(CO_EmploymentDetails_Address_CommMethod.dataBinding);
		if(commMeth == null || commMeth == ""){
			if(employerAdd1 != null && employerAdd1 != ""){
				Services.setValue(CO_EmploymentDetails_Address_CommMethod.dataBinding, "LE");
			}
		}		
	}
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_Line2() {}
CO_EmploymentDetails_Address_Line2.tabIndex = -1;
CO_EmploymentDetails_Address_Line2.maxLength = 35;
CO_EmploymentDetails_Address_Line2.helpText = "Second line of the Employer's address.";
CO_EmploymentDetails_Address_Line2.mandatoryOn = [CO_EmploymentDetails_Employer.dataBinding];
CO_EmploymentDetails_Address_Line2.isMandatory = function()
{
	// added re defect 3865 - Address line 2 is mandatory
	var mandatory = false;
	//only mandatory if Employer address entered
	var emp = Services.getValue(CO_EmploymentDetails_Employer.dataBinding);
	if(emp != null && emp != ""){
		mandatory = true;
	}	
	return mandatory; 
}
CO_EmploymentDetails_Address_Line2.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Line2.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Line2.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}


/**********************************************************************************/
function CO_EmploymentDetails_Address_Line3() {}
CO_EmploymentDetails_Address_Line3.tabIndex = -1;
CO_EmploymentDetails_Address_Line3.maxLength = 35;
CO_EmploymentDetails_Address_Line3.helpText = "Third line of the Employer's address.";
CO_EmploymentDetails_Address_Line3.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Line3.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Line3.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}


/**********************************************************************************/
function CO_EmploymentDetails_Address_Line4() {}
CO_EmploymentDetails_Address_Line4.tabIndex = -1;
CO_EmploymentDetails_Address_Line4.maxLength = 35;
CO_EmploymentDetails_Address_Line4.helpText = "Fourth line of the Employer's address.";
CO_EmploymentDetails_Address_Line4.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Line4.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Line4.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}


/**********************************************************************************/
function CO_EmploymentDetails_Address_Line5() {}
CO_EmploymentDetails_Address_Line5.tabIndex = -1;
CO_EmploymentDetails_Address_Line5.maxLength = 35;
CO_EmploymentDetails_Address_Line5.helpText = "Fifth line of the Employer's address.";
CO_EmploymentDetails_Address_Line5.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Line5.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Line5.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}


/**********************************************************************************/
function CO_EmploymentDetails_Address_Postcode() {}
CO_EmploymentDetails_Address_Postcode.tabIndex = -1;
CO_EmploymentDetails_Address_Postcode.maxLength = 35;
CO_EmploymentDetails_Address_Postcode.helpText = "Postcode of the Employer's address.";
CO_EmploymentDetails_Address_Postcode.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_Postcode.enableOn = [	Header_CONumber.dataBinding,
						  	 		  				ManageCOParams.MODE];
CO_EmploymentDetails_Address_Postcode.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_CreatedBy() {}
CO_EmploymentDetails_Address_CreatedBy.tabIndex = -1;
CO_EmploymentDetails_Address_CreatedBy.maxLength = 35;
CO_EmploymentDetails_Address_CreatedBy.helpText = "The name of User who created the Address.";
CO_EmploymentDetails_Address_CreatedBy.isReadOnly = function()
{
	return true;
}
CO_EmploymentDetails_Address_CreatedBy.enableOn = [	Header_CONumber.dataBinding,
						  	 		  				ManageCOParams.MODE];
CO_EmploymentDetails_Address_CreatedBy.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_DXNo() {}
CO_EmploymentDetails_Address_DXNo.tabIndex = 42;
CO_EmploymentDetails_Address_DXNo.maxLength = 35;
CO_EmploymentDetails_Address_DXNo.helpText = "Document exchange reference number.";
CO_EmploymentDetails_Address_DXNo.readOnlyOn = [Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_DXNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_DXNo.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_DXNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_DXNo.logicOn = [CO_EmploymentDetails_Address_DXNo.dataBinding];
CO_EmploymentDetails_Address_DXNo.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_DXNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
CO_EmploymentDetails_Address_DXNo.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_EmploymentDetails_Address_DXNo.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/**********************************************************************************/
function CO_EmploymentDetails_Address_TelNo() {}
CO_EmploymentDetails_Address_TelNo.tabIndex = 43;
CO_EmploymentDetails_Address_TelNo.maxLength = 24;
CO_EmploymentDetails_Address_TelNo.helpText = "Employer's telephone number.";
CO_EmploymentDetails_Address_TelNo.readOnlyOn = [Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_TelNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_TelNo.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_TelNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_TelNo.logicOn = [CO_EmploymentDetails_Address_TelNo.dataBinding];
CO_EmploymentDetails_Address_TelNo.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_TelNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_FaxNo() {}
CO_EmploymentDetails_Address_FaxNo.tabIndex = 44;
CO_EmploymentDetails_Address_FaxNo.maxLength = 24;
CO_EmploymentDetails_Address_FaxNo.helpText = "Employer's fax number.";
CO_EmploymentDetails_Address_FaxNo.readOnlyOn = [Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_FaxNo.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_FaxNo.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_FaxNo.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_FaxNo.logicOn = [CO_EmploymentDetails_Address_FaxNo.dataBinding];
CO_EmploymentDetails_Address_FaxNo.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_FaxNo.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_Email() {}
CO_EmploymentDetails_Address_Email.tabIndex = 45;
CO_EmploymentDetails_Address_Email.maxLength = 80;
CO_EmploymentDetails_Address_Email.helpText = "Employer's email address.";
CO_EmploymentDetails_Address_Email.componentName = "Employer's email address.";
CO_EmploymentDetails_Address_Email.readOnlyOn = [Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_Email.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_Email.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Email.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_Email.validateOn = [CO_EmploymentDetails_Address_Email.dataBinding];
CO_EmploymentDetails_Address_Email.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(CO_EmploymentDetails_Address_Email.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}
CO_EmploymentDetails_Address_Email.logicOn = [CO_EmploymentDetails_Address_Email.dataBinding];
CO_EmploymentDetails_Address_Email.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_Email.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}

/**********************************************************************************/
function CO_EmploymentDetails_Address_CommMethod() {}
CO_EmploymentDetails_Address_CommMethod.srcData = MaintainCOVariables.REF_DATA_XPATH + "/PreferredCommunicationMethods";
CO_EmploymentDetails_Address_CommMethod.rowXPath = "Method";
CO_EmploymentDetails_Address_CommMethod.keyXPath = "Id";
CO_EmploymentDetails_Address_CommMethod.displayXPath = "Name";
CO_EmploymentDetails_Address_CommMethod.tabIndex = 48;
CO_EmploymentDetails_Address_CommMethod.maxLength = 24;
CO_EmploymentDetails_Address_CommMethod.helpText = "The preferred communication method of the Employer.";
CO_EmploymentDetails_Address_CommMethod.readOnlyOn = [	Header_CONumber.dataBinding,
													 	Header_Status.dataBinding,
											         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_CommMethod.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_CommMethod.enableOn = [Header_CONumber.dataBinding,
						  	 		  				ManageCOParams.MODE];
CO_EmploymentDetails_Address_CommMethod.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_CommMethod.logicOn = [	CO_EmploymentDetails_Address_CommMethod.dataBinding];
							
CO_EmploymentDetails_Address_CommMethod.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_CommMethod.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/******************************************************************************/
function CO_EmploymentDetails_Address_Welsh() {}
CO_EmploymentDetails_Address_Welsh.modelValue = {checked: 'Y', unchecked: 'N'};
CO_EmploymentDetails_Address_Welsh.tabIndex = 49;
CO_EmploymentDetails_Address_Welsh.helpText = "Tick box if the Employer is to receive documents translated into Welsh.";
CO_EmploymentDetails_Address_Welsh.isTemporary = function()
{
	return true;
}
CO_EmploymentDetails_Address_Welsh.readOnlyOn = [	Header_CONumber.dataBinding,
												 	Header_Status.dataBinding,
										         	ManageCOParams.MODE];
CO_EmploymentDetails_Address_Welsh.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetails_Address_Welsh.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_EmploymentDetails_Address_Welsh.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetails_Address_Welsh.logicOn = [CO_EmploymentDetails_Address_Welsh.dataBinding];
CO_EmploymentDetails_Address_Welsh.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetails_Address_Welsh.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/******************************************************************************/
function CO_EmploymentDetailsOccupation() {}
CO_EmploymentDetailsOccupation.tabIndex = 46;
CO_EmploymentDetailsOccupation.maxLength = 30;
CO_EmploymentDetailsOccupation.helpText = "Debtor's occupation.";
CO_EmploymentDetailsOccupation.readOnlyOn = [	Header_CONumber.dataBinding,
											 	Header_Status.dataBinding,
									         	ManageCOParams.MODE];
CO_EmploymentDetailsOccupation.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetailsOccupation.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_EmploymentDetailsOccupation.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
CO_EmploymentDetailsOccupation.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_EmploymentDetailsOccupation.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetailsOccupation.logicOn = [CO_EmploymentDetailsOccupation.dataBinding];
CO_EmploymentDetailsOccupation.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetailsOccupation.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
/**********************************************************************************/
function CO_EmploymentDetailsPayRef() {}
CO_EmploymentDetailsPayRef.tabIndex = 47;
CO_EmploymentDetailsPayRef.maxLength = 30;
CO_EmploymentDetailsPayRef.helpText = "Employee's works or pay reference.";
CO_EmploymentDetailsPayRef.readOnlyOn = [	Header_CONumber.dataBinding,
										 	Header_Status.dataBinding,
								         	ManageCOParams.MODE];
CO_EmploymentDetailsPayRef.isReadOnly = function()
{
	// only updateable for certain CO Status
	var readOnly = false;
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		readOnly = true;
	}	
	return readOnly;
}
CO_EmploymentDetailsPayRef.enableOn = [Header_CONumber.dataBinding,
						  	 		  ManageCOParams.MODE];
CO_EmploymentDetailsPayRef.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_EmploymentDetailsPayRef.logicOn = [CO_EmploymentDetailsPayRef.dataBinding];
CO_EmploymentDetailsPayRef.logic = function(event)
{
	if(event.getXPath() == CO_EmploymentDetailsPayRef.dataBinding){
		// set message re save required
		Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
	}
}
CO_EmploymentDetailsPayRef.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CO_EmploymentDetailsPayRef.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/**********************************************************************************/

/*****************************************************************************************************************
                                        CO WORKPLACE DETAILS TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function CO_WorkplaceDetails_Address_Line1() {}
CO_WorkplaceDetails_Address_Line1.tabIndex = -1;
CO_WorkplaceDetails_Address_Line1.maxLength = 35;
CO_WorkplaceDetails_Address_Line1.helpText = "First line of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Line1.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Line1.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Line1.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_WorkplaceDetails_Address_Line2() {}
CO_WorkplaceDetails_Address_Line2.tabIndex = -1;
CO_WorkplaceDetails_Address_Line2.maxLength = 35;
CO_WorkplaceDetails_Address_Line2.helpText = "Second line of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Line2.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Line2.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Line2.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_WorkplaceDetails_Address_Line3() {}
CO_WorkplaceDetails_Address_Line3.tabIndex = -1;
CO_WorkplaceDetails_Address_Line3.maxLength = 35;
CO_WorkplaceDetails_Address_Line3.helpText = "Third line of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Line3.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Line3.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Line3.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_WorkplaceDetails_Address_Line4() {}
CO_WorkplaceDetails_Address_Line4.tabIndex = -1;
CO_WorkplaceDetails_Address_Line4.maxLength = 35;
CO_WorkplaceDetails_Address_Line4.helpText = "Fourth line of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Line4.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Line4.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Line4.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_WorkplaceDetails_Address_Line5() {}
CO_WorkplaceDetails_Address_Line5.tabIndex = -1;
CO_WorkplaceDetails_Address_Line5.maxLength = 35;
CO_WorkplaceDetails_Address_Line5.helpText = "Fifth line of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Line5.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Line5.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Line5.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**********************************************************************************/
function CO_WorkplaceDetails_Address_Postcode() {}
CO_WorkplaceDetails_Address_Postcode.tabIndex = -1;
CO_WorkplaceDetails_Address_Postcode.maxLength = 35;
CO_WorkplaceDetails_Address_Postcode.helpText = "Postcode of the Debtor's workplace address.";
CO_WorkplaceDetails_Address_Postcode.isReadOnly = function()
{
	return true;
}
CO_WorkplaceDetails_Address_Postcode.enableOn = [	Header_CONumber.dataBinding,
						  	 		  				ManageCOParams.MODE];
CO_WorkplaceDetails_Address_Postcode.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*****************************************************************************************************************
                                        CO FINANCE DETAILS INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function CO_Money_TotalAllowedCurrency() {}
CO_Money_TotalAllowedCurrency.tabIndex = -1;
CO_Money_TotalAllowedCurrency.maxLength = 3;
CO_Money_TotalAllowedCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalAllowedCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalAllowedCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_Money_TotalAllowedCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/******************************************************************************/
function CO_Money_TotalAllowed() {}
CO_Money_TotalAllowed.tabIndex = -1;
CO_Money_TotalAllowed.maxLength = 15;
CO_Money_TotalAllowed.helpText = "Total Allowed on all debts for this CO.";
CO_Money_TotalAllowed.isReadOnly = function()
{
	return true;
}
CO_Money_TotalAllowed.enableOn = [	Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_Money_TotalAllowed.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalAllowed.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalAllowed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalPaidOutCurrency() {}
CO_Money_TotalPaidOutCurrency.tabIndex = -1;
CO_Money_TotalPaidOutCurrency.maxLength = 3;
CO_Money_TotalPaidOutCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalPaidOutCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalPaidOutCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_Money_TotalPaidOutCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/**************************************************************************/
function CO_Money_TotalPaidOut() {}
CO_Money_TotalPaidOut.tabIndex = -1;
CO_Money_TotalPaidOut.maxLength = 15;
CO_Money_TotalPaidOut.helpText = "Total amount paid out so far on this CO.";
CO_Money_TotalPaidOut.isReadOnly = function()
{
	return true;
}
CO_Money_TotalPaidOut.enableOn = [	Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_Money_TotalPaidOut.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalPaidOut.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalPaidOut.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_MoniesInCourtCurrency() {}
CO_Money_MoniesInCourtCurrency.tabIndex = -1;
CO_Money_MoniesInCourtCurrency.maxLength = 3;
CO_Money_MoniesInCourtCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_MoniesInCourtCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_MoniesInCourtCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_Money_MoniesInCourtCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/****************************************************************************/
function CO_Money_MoniesInCourt() {}
CO_Money_MoniesInCourt.tabIndex = -1;
CO_Money_MoniesInCourt.maxLength = 15;
CO_Money_MoniesInCourt.helpText = "Total money for CO in court system.";
CO_Money_MoniesInCourt.isReadOnly = function()
{
	return true;
}
CO_Money_MoniesInCourt.enableOn = [	Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_Money_MoniesInCourt.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_MoniesInCourt.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_MoniesInCourt.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalFeeCurrency() {}
CO_Money_TotalFeeCurrency.tabIndex = -1;
CO_Money_TotalFeeCurrency.maxLength = 3;
CO_Money_TotalFeeCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalFeeCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalFeeCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  	ManageCOParams.MODE];
CO_Money_TotalFeeCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*******************************************************************************/
function CO_Money_TotalFee() {}
CO_Money_TotalFee.tabIndex = -1;
CO_Money_TotalFee.maxLength = 15;
CO_Money_TotalFee.helpText = "Total fees for all debts on current CO.";
CO_Money_TotalFee.isReadOnly = function()
{
	return true;
}
CO_Money_TotalFee.enableOn = [	Header_CONumber.dataBinding,
						  	 	ManageCOParams.MODE];
CO_Money_TotalFee.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalFee.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalFee.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalFeesPaidCurrency() {}
CO_Money_TotalFeesPaidCurrency.tabIndex = -1;
CO_Money_TotalFeesPaidCurrency.maxLength = 3;
CO_Money_TotalFeesPaidCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalFeesPaidCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalFeesPaidCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_Money_TotalFeesPaidCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*********************************************************************/
function CO_Money_TotalFeesPaid() {}
CO_Money_TotalFeesPaid.tabIndex = -1;
CO_Money_TotalFeesPaid.maxLength = 15;
CO_Money_TotalFeesPaid.helpText = "The total amount paid out on this CO";
CO_Money_TotalFeesPaid.isReadOnly = function()
{
	return true;
}
CO_Money_TotalFeesPaid.enableOn = [	Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_Money_TotalFeesPaid.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalFeesPaid.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalFeesPaid.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_ScheduleTwoFeeCurrency() {}
CO_Money_ScheduleTwoFeeCurrency.tabIndex = -1;
CO_Money_ScheduleTwoFeeCurrency.maxLength = 3;
CO_Money_ScheduleTwoFeeCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_ScheduleTwoFeeCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_ScheduleTwoFeeCurrency.enableOn = [Header_CONumber.dataBinding,
						  	 		  		ManageCOParams.MODE];
CO_Money_ScheduleTwoFeeCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*********************************************************************************/
function CO_Money_ScheduleTwoFee() {}
CO_Money_ScheduleTwoFee.tabIndex = -1;
CO_Money_ScheduleTwoFee.maxLength = 15;
CO_Money_ScheduleTwoFee.helpText = "Total Schedule 2 fees associated with this CO.";
CO_Money_ScheduleTwoFee.isReadOnly = function()
{
	return true;
}
CO_Money_ScheduleTwoFee.enableOn = [Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_Money_ScheduleTwoFee.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_ScheduleTwoFee.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_ScheduleTwoFee.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalDueCurrency() {}
CO_Money_TotalDueCurrency.tabIndex = -1;
CO_Money_TotalDueCurrency.maxLength = 3;
CO_Money_TotalDueCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalDueCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalDueCurrency.enableOn = [Header_CONumber.dataBinding,
						  	 		  ManageCOParams.MODE];
CO_Money_TotalDueCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/******************************************************************************/
function CO_Money_TotalDue() {}
CO_Money_TotalDue.tabIndex = -1;
CO_Money_TotalDue.maxLength = 15;
CO_Money_TotalDue.helpText = "Total amount due to be paid including fees (excluding schedule 2 debts/fees).";
CO_Money_TotalDue.isReadOnly = function()
{
	return true;
}
CO_Money_TotalDue.enableOn = [	Header_CONumber.dataBinding,
						  	 	ManageCOParams.MODE];
CO_Money_TotalDue.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalDue.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalDue.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalPassthroughsCurrency() {}
CO_Money_TotalPassthroughsCurrency.tabIndex = -1;
CO_Money_TotalPassthroughsCurrency.maxLength = 3;
CO_Money_TotalPassthroughsCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalPassthroughsCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalPassthroughsCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_Money_TotalPassthroughsCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/********************************************************************************/
function CO_Money_TotalPassthroughs() {}
CO_Money_TotalPassthroughs.tabIndex = -1;
CO_Money_TotalPassthroughs.maxLength = 15;
CO_Money_TotalPassthroughs.helpText = "Amount of debts defined as passthroughs for this CO.";
CO_Money_TotalPassthroughs.isReadOnly = function()
{
	return true;
}
CO_Money_TotalPassthroughs.enableOn = [	Header_CONumber.dataBinding,
						  	 		  	ManageCOParams.MODE];
CO_Money_TotalPassthroughs.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalPassthroughs.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalPassthroughs.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_ScheduleTwoTotalCurrency() {}
CO_Money_ScheduleTwoTotalCurrency.tabIndex = -1;
CO_Money_ScheduleTwoTotalCurrency.maxLength = 3;
CO_Money_ScheduleTwoTotalCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_ScheduleTwoTotalCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_ScheduleTwoTotalCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_Money_ScheduleTwoTotalCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/********************************************************************************/
function CO_Money_ScheduleTwoTotal() {}
CO_Money_ScheduleTwoTotal.tabIndex = -1;
CO_Money_ScheduleTwoTotal.maxLength = 15;
CO_Money_ScheduleTwoTotal.helpText = "Total amount owed under schedule 2. This includes schedule 2 fees.";
CO_Money_ScheduleTwoTotal.isReadOnly = function()
{
	return true;
}
CO_Money_ScheduleTwoTotal.enableOn = [	Header_CONumber.dataBinding,
						  	 		  	ManageCOParams.MODE];
CO_Money_ScheduleTwoTotal.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_ScheduleTwoTotal.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_ScheduleTwoTotal.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_TotalOutstandingCurrency() {}
CO_Money_TotalOutstandingCurrency.tabIndex = -1;
CO_Money_TotalOutstandingCurrency.maxLength = 3;
CO_Money_TotalOutstandingCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_TotalOutstandingCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_TotalOutstandingCurrency.enableOn = [	Header_CONumber.dataBinding,
						  	 		  			ManageCOParams.MODE];
CO_Money_TotalOutstandingCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*************************************************************************************/
function CO_Money_TotalOutstanding() {}
CO_Money_TotalOutstanding.tabIndex = -1;
CO_Money_TotalOutstanding.maxLength = 15;
CO_Money_TotalOutstanding.helpText = "Total amount of debt still outstanding on this CO.";
CO_Money_TotalOutstanding.isReadOnly = function()
{
	return true;
}
CO_Money_TotalOutstanding.enableOn = [	Header_CONumber.dataBinding,
						  	 		  	ManageCOParams.MODE];
CO_Money_TotalOutstanding.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_TotalOutstanding.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_TotalOutstanding.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/**********************************************************************************/
function CO_Money_BalanceDueCurrency() {}
CO_Money_BalanceDueCurrency.tabIndex = -1;
CO_Money_BalanceDueCurrency.maxLength = 3;
CO_Money_BalanceDueCurrency.isReadOnly = function()
{
	return true;
}
CO_Money_BalanceDueCurrency.transformToDisplay = function(value)
{
	return MaintainCOFunctions.transformToDisplayCurrency(value);
}
CO_Money_BalanceDueCurrency.enableOn = [Header_CONumber.dataBinding,
						  	 		  	ManageCOParams.MODE];
CO_Money_BalanceDueCurrency.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/*********************************************************************************/
function CO_Money_BalanceDue() {}
CO_Money_BalanceDue.tabIndex = -1;
CO_Money_BalanceDue.maxLength = 15;
CO_Money_BalanceDue.helpText = "Total amount due after all fees etc have been included for both schedules less monies already in court.";
CO_Money_BalanceDue.isReadOnly = function()
{
	return true;
}
CO_Money_BalanceDue.enableOn = [Header_CONumber.dataBinding,
						  	 	ManageCOParams.MODE];
CO_Money_BalanceDue.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
CO_Money_BalanceDue.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
CO_Money_BalanceDue.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, null);
}

/*****************************************************************************************************************
                                        CO DEBTOR ADDRESS HISTORY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function DebtorAddressHistory_Popup_Address_Line1() {}
DebtorAddressHistory_Popup_Address_Line1.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Line1.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Line1.maxLength = 35;
DebtorAddressHistory_Popup_Address_Line1.helpText = "First line of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Line1.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function DebtorAddressHistory_Popup_Address_Line2() {}
DebtorAddressHistory_Popup_Address_Line2.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Line2.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Line2.maxLength = 35;
DebtorAddressHistory_Popup_Address_Line2.helpText = "Second line of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Line2.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function DebtorAddressHistory_Popup_Address_Line3() {}
DebtorAddressHistory_Popup_Address_Line3.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Line3.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Line3.maxLength = 35;
DebtorAddressHistory_Popup_Address_Line3.helpText = "Third line of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Line3.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function DebtorAddressHistory_Popup_Address_Line4() {}
DebtorAddressHistory_Popup_Address_Line4.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Line4.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Line4.maxLength = 35;
DebtorAddressHistory_Popup_Address_Line4.helpText = "Fourth line of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Line4.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function DebtorAddressHistory_Popup_Address_Line5() {}
DebtorAddressHistory_Popup_Address_Line5.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Line5.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Line5.maxLength = 35;
DebtorAddressHistory_Popup_Address_Line5.helpText = "Fifth line of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Line5.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function DebtorAddressHistory_Popup_Address_Postcode() {}
DebtorAddressHistory_Popup_Address_Postcode.retrieveOn = [DebtorAddressHistoryGrid.dataBinding];
DebtorAddressHistory_Popup_Address_Postcode.tabIndex = -1;
DebtorAddressHistory_Popup_Address_Postcode.maxLength = 35;
DebtorAddressHistory_Popup_Address_Postcode.helpText = "Postcode of the Debtors's address.";
DebtorAddressHistory_Popup_Address_Postcode.isReadOnly = function()
{
	return true;
}
/******************************************************************************/

/*****************************************************************************************************************
                                        CO EMPLOYER ADDRESS HISTORY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function EmployerAddressHistory_Popup_Address_Line1() {}
EmployerAddressHistory_Popup_Address_Line1.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Line1.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Line1.maxLength = 35;
EmployerAddressHistory_Popup_Address_Line1.helpText = "First line of the Employer's address.";
EmployerAddressHistory_Popup_Address_Line1.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function EmployerAddressHistory_Popup_Address_Line2() {}
EmployerAddressHistory_Popup_Address_Line2.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Line2.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Line2.maxLength = 35;
EmployerAddressHistory_Popup_Address_Line2.helpText = "Second line of the Employer's address.";
EmployerAddressHistory_Popup_Address_Line2.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function EmployerAddressHistory_Popup_Address_Line3() {}
EmployerAddressHistory_Popup_Address_Line3.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Line3.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Line3.maxLength = 35;
EmployerAddressHistory_Popup_Address_Line3.helpText = "Third line of the Employer's address.";
EmployerAddressHistory_Popup_Address_Line3.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function EmployerAddressHistory_Popup_Address_Line4() {}
EmployerAddressHistory_Popup_Address_Line4.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Line4.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Line4.maxLength = 35;
EmployerAddressHistory_Popup_Address_Line4.helpText = "Fourth line of the Employer's address.";
EmployerAddressHistory_Popup_Address_Line4.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function EmployerAddressHistory_Popup_Address_Line5() {}
EmployerAddressHistory_Popup_Address_Line5.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Line5.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Line5.maxLength = 35;
EmployerAddressHistory_Popup_Address_Line5.helpText = "Fifth line of the Employer's address.";
EmployerAddressHistory_Popup_Address_Line5.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function EmployerAddressHistory_Popup_Address_Postcode() {}
EmployerAddressHistory_Popup_Address_Postcode.retrieveOn = [EmployerAddressHistoryGrid.dataBinding];
EmployerAddressHistory_Popup_Address_Postcode.tabIndex = -1;
EmployerAddressHistory_Popup_Address_Postcode.maxLength = 35;
EmployerAddressHistory_Popup_Address_Postcode.helpText = "Postcode of the Employer's address.";
EmployerAddressHistory_Popup_Address_Postcode.isReadOnly = function()
{
	return true;
}
/******************************************************************************/

/*****************************************************************************************************************
                                        CO WORKPLACE ADDRESS HISTORY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Line1() {}
WorkplaceAddressHistory_Popup_Address_Line1.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Line1.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Line1.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Line1.helpText = "First line of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Line1.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Line2() {}
WorkplaceAddressHistory_Popup_Address_Line2.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Line2.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Line2.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Line2.helpText = "Second line of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Line2.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Line3() {}
WorkplaceAddressHistory_Popup_Address_Line3.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Line3.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Line3.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Line3.helpText = "Third line of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Line3.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Line4() {}
WorkplaceAddressHistory_Popup_Address_Line4.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Line4.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Line4.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Line4.helpText = "Fourth line of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Line4.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Line5() {}
WorkplaceAddressHistory_Popup_Address_Line5.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Line5.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Line5.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Line5.helpText = "Fifth line of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Line5.isReadOnly = function()
{
	return true;
}
/******************************************************************************/
function WorkplaceAddressHistory_Popup_Address_Postcode() {}
WorkplaceAddressHistory_Popup_Address_Postcode.retrieveOn = [WorkplaceAddressHistoryGrid.dataBinding];
WorkplaceAddressHistory_Popup_Address_Postcode.tabIndex = -1;
WorkplaceAddressHistory_Popup_Address_Postcode.maxLength = 35;
WorkplaceAddressHistory_Popup_Address_Postcode.helpText = "Postcode of the Debtor's workplace address.";
WorkplaceAddressHistory_Popup_Address_Postcode.isReadOnly = function()
{
	return true;
}
/*****************************************************************************************************************
                                        BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/
function Status_Save() {}
Status_Save.tabIndex = 71;
Status_Save.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainCO" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
Status_Save.actionBinding = function()
{
	if(MaintainCOFunctions.isSaveRequired() == true){
		var invalidFields = FormController.getInstance().validateForm(true, true, false);
		if(invalidFields.length == 0){
			var debtsExists = true;
			var serviceName = null;
			Services.startTransaction();
			// if creating display the new co number and then set to initial mode
			if(MaintainCOFunctions.isScreenModeCreate() == true){
				debtsExists = MaintainCOFunctions.debtsExist();
				
				// need to check for event 705's
				var event705 = Services.getValue(MaintainCOVariables.EVENT705_IN_FORCE);
				if(null != event705 && event705 == MaintainCOVariables.YES){
					// get list of debt ids and then see if they have a case associated with them set the event id in the dom if yes
					MaintainCOFunctions.setCOCaseEvent(MaintainCOVariables.EVENT_705_ID, false, true); // pEvent, pDeleteFlag, pNewDebtsOnly
				}
				
				serviceName = "addCo";			
			}
			else{
				// else maintaining
				// need to check for events
				var event984DebtorNameChanged = Services.getValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_NAME);
				var event984AddressChanged = Services.getValue(MaintainCOVariables.EVENT984_CHANGE_DEBTOR_ADDRESS);
				var event986 = Services.getValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS);
				var event705 = Services.getValue(MaintainCOVariables.EVENT705_IN_FORCE);
				var event706 = Services.getValue(MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED);
				if(null == event706 || event706 == "" || event706 == MaintainCOVariables.NO){
					event706 = Services.getValue(MaintainCOVariables.EVENT706_CHANGE_TO_REVOKED);
				}
				// set the dom correctly for the events
				if(null != event984DebtorNameChanged && event984DebtorNameChanged == MaintainCOVariables.YES){
					MaintainCOFunctions.setCOEvent(MaintainCOVariables.EVENT_984_ID, "", ""); //pEvent, pDebtId, pEventDetail
				}
				else if(null != event984AddressChanged && event984AddressChanged == MaintainCOVariables.YES){
					MaintainCOFunctions.setCOEvent(MaintainCOVariables.EVENT_984_ID, "", ""); //pEvent, pDebtId, pEventDetail
				}
				
				// get list of debt ids that have been changed re event 985
				var debtIdTempList = Services.getNodes(MaintainCOVariables.DEBT_SEQ_AMENDED + "/DebtSeqNumber");
				// now loop through each 
				if(debtIdTempList != null && debtIdTempList.length != 0){
					// Loop through the list and ...
					var debtSurrId = null;
					var debSeqId = null;
					for(var i = 0;i < debtIdTempList.length; i++){
						debtSurrId = debtIdTempList[i].text;
						if(debtSurrId != null && debtSurrId != ""){
							MaintainCOFunctions.setCOEvent(MaintainCOVariables.EVENT_985_ID, debtSurrId, ""); //pEvent, pDebtId, pEventDetail
						}
					}
				}			
	
				if(null != event986 && event986 == MaintainCOVariables.YES){
					MaintainCOFunctions.setCOEvent(MaintainCOVariables.EVENT_986_ID, "", ""); //pEvent, pDebtId, pEventDetail
				}
				
				if(null != event705 && event705 == MaintainCOVariables.YES){
					// get list of debt ids and then see if they have a case associated with them set the event id in the dom if yes
					MaintainCOFunctions.setCOCaseEvent(MaintainCOVariables.EVENT_705_ID, false, true); // pEvent, pDeleteFlag, pNewDebtsOnly
				}
				
				if(null != event706 && event706 == MaintainCOVariables.YES){
					var inError = false;
					var unRevoked = Services.getValue(MaintainCOVariables.EVENT706_CHANGE_FROM_REVOKED);
					if(unRevoked != null && unRevoked != "" && unRevoked == MaintainCOVariables.YES){
						inError = true;
					}
					MaintainCOFunctions.setCOCaseEvent(MaintainCOVariables.EVENT_706_ID, inError, false);//pEvent, pDeleteFlag, pNewDebtsOnly
				}
							
				serviceName = "updateCo";
			}
			
			if(debtsExists == true){
				// Set the status appropriately
				var orderDate = Services.getValue(CODetails_OrderDate.dataBinding);
				var status = Services.getValue(Header_Status.dataBinding);
				if(orderDate != null && orderDate != "" && status != null && 
							status != "" && status.toUpperCase() == MaintainCOVariables.STATUS_APPLN){
					// set the status to live
					Services.setValue(Header_Status.dataBinding, MaintainCOVariables.STATUS_LIVE);
					// need to set all debt status that were PENDING to live as well.
					MaintainCOFunctions.setPendingDebtsToLive();
					// need to recalculate the debt totals for save - as now they are live debts
					// calculate fee
					MaintainCOFunctions.calculateCOTotals();
					// set currency field
					var curr = Services.getValue(CO_Money_TotalFeeCurrency.dataBinding);
					if(curr == null || curr == ""){
						var defaultCurrency = Services.getValue(MaintainCOVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
						Services.setValue(CO_Money_TotalFeeCurrency.dataBinding, defaultCurrency);
					}
					
				}
				
				 // Defect 3275 - The database field for fees needs to contain fees for all debt (except deleted).
 				 // The screen however need to display them seperately
 				 MaintainCOFunctions.setTotalFeesForSave(); 				 
				
				// now save details
				// Make service call
				var newDOM = XML.createDOM(null, null, null);
				var mcNode = Services.getNode("/ds/MaintainCO");
				var dsNode = XML.createElement(newDOM, "ds");
				dsNode.appendChild(mcNode);
				newDOM.appendChild(dsNode);	
				
				Services.endTransaction();
				
				var params = new ServiceParams();
				params.addDOMParameter("co", newDOM);
				Services.callService(serviceName, params, Status_Save, true);			
			
			}// end if(debtsExists == true){
			else{
				Services.endTransaction();
				var errCode = ErrorCode.getErrorCode("Caseman_noDebtsExist_Msg");
				alert(errCode.getMessage());
			}		
		} // end if(invalidFields.length == 0)
		else
		{
			// Invalid form, clear the action after save node
			Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, "");
		}
	} //end if(MaintainCOFunctions.isSaveRequired() == true){
	else{
		// Put a  message in the status bar
		Services.setTransientStatusBarMessage("There have been no changes since the last save.");
	}
}
/**
 * @param dom
 * @param serviceName
 * @author rzhh8k
 * 
 */
Status_Save.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "addCo" )
	{
		// Have just created a new CO
		var coNumber = dom.selectSingleNode("/ds/CONumber").text;
		alert(Messages.CO_CREATED_SUCCESSFULLY.replace(/XXX/, coNumber));
		// now clear the screen and reset stuff
		MaintainCOFunctions.reSetCO();
		Services.setValue(ManageCOParams.MODE, ManageCOParamsConstants.INITIAL_MODE);
		Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, "");
		// set co number as the focus
		Services.setFocus("Header_CONumber");
	}
	else
	{
		// Have just updated an existing CO
		var tempAction = Services.getValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, "");
		
		switch (tempAction)
		{
			case MaintainCOVariables.ACTION_NAVIGATE:
				// User wishes to navigate following a save
				MaintainCOFunctions.reSetFlagsAfterSave();
				NavigationController.nextScreen();
				break;
				
			case MaintainCOVariables.ACTION_CLEARFORM:
				// User wishes to clear the form following a save
				MaintainCOFunctions.reSetCO();
				
				// Reset the navigation links
				CaseManUtils.clearNavigationLinks();
				
				Services.setFocus("Header_CONumber");
				break;
				
			case MaintainCOVariables.ACTION_EXIT:
				// User wishes to exit the screen following a save
				if( NavigationController.callStackExists() )
				{
					MaintainCOFunctions.exitScreen(true);
				}
				else
				{
					MaintainCOFunctions.exitScreen(false);	
					Services.navigate(NavigationController.MAIN_MENU);
				}
				break;
				
			default:
				// No actions to perform after save, re-retrieve the updated details
				MaintainCOFunctions.reSetFlagsAfterSave();	// moved from outside the if statement
				// need to re get the CO
				var coNumber = dom.selectSingleNode("/ds/CONumber").text;
				MaintainCOFunctions.getCO(coNumber, false); //(pCONumber, pInitialising)
				// Put a success message in the status bar
				Services.setTransientStatusBarMessage(Messages.SAVEDSUCESSFULLY_MESSAGE);
				Services.setFocus("Status_Clear");
		}
	}
}
/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	MaintainCOFunctions.exitScreen(true);
}

/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onUpdateLockedException = function (exception)
{
	if(MaintainCOFunctions.isScreenModeMaintain() == true){
		if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)){
			// need to re get the CO
			var coNumber = Services.getValue(Header_CONumber.dataBinding);
			if(null != coNumber && coNumber != ""){
				MaintainCOFunctions.getCO(coNumber, false); //(pCONumber, pInitialising)
			}
			else{
				alert(Messages.PROBLEM_RETREIVING_CO_MESSAGE);
			}				
		}
		else{
			MaintainCOFunctions.exitScreen(true);
		}
	}
	else{
		alert(Messages.PROBLEM_SAVING_NEW_CO_MESSAGE);
	}
}

/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	MaintainCOFunctions.exitScreen(true);
}
/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	MaintainCOFunctions.exitScreen(true);
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
Status_Save.enableOn = [	Header_CONumber.dataBinding,
						  	ManageCOParams.MODE];
Status_Save.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
/************************************************************************************/
function Status_Clear() {}
Status_Clear.tabIndex = 72;
Status_Clear.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "MaintainCO", alt: true } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
Status_Clear.actionBinding = function()
{
	// check if need saving
	var changesMade = MaintainCOFunctions.isSaveRequired();
	if(changesMade == true && confirm(Messages.DETSLOST_MESSAGE)){
		Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_CLEARFORM);
		Status_Save.actionBinding();
	}
	else{
		// if yes clear all fields and reset the screen mode.
		MaintainCOFunctions.reSetCO();
		
		// Reset the navigation links
		CaseManUtils.clearNavigationLinks();
		
		Services.setFocus("Header_CONumber");
	}
}
Status_Clear.enableOn = [	Header_CONumber.dataBinding,
						  	 ManageCOParams.MODE];
Status_Clear.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
/************************************************************************************/
function Status_Close() {}
Status_Close.tabIndex = 73;
Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainCO" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
Status_Close.actionBinding = function()
{
	// check if need saving
	var changesMade = MaintainCOFunctions.isSaveRequired();
	if(changesMade == true && confirm(Messages.DETSLOST_MESSAGE)){
		Services.setValue(MaintainCOVariables.ACTION_AFTER_SAVE_XPATH, MaintainCOVariables.ACTION_EXIT);
		Status_Save.actionBinding();		
	}
	else{
		
		if(NavigationController.callStackExists()){
			MaintainCOFunctions.exitScreen(true);
		}
		else{
			MaintainCOFunctions.exitScreen(false);	
			Services.navigate(NavigationController.MAIN_MENU);
		}
	}
}

/************************************************************************************/
function CreateCOBtn() {}
CreateCOBtn.tabIndex = 2;
CreateCOBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainCO" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
CreateCOBtn.actionBinding = function()
{
	Services.startTransaction();
	// load refdata
	MaintainCOFunctions.loadCOReferenceData(MaintainCOVariables.MAINTAIN_CO_REFDATA);
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	if(coNumber == null || coNumber == ""){
		MaintainCOFunctions.setCreateCODefaultData();
	}
	else{
		// display a message stating co number must be empty
		alert(Messages.CLEAR_CONUMBER);
	}
	
	Services.endTransaction();
}
CreateCOBtn.enableOn = [Header_CONumber.dataBinding,
						ManageCOParams.MODE];
CreateCOBtn.isEnabled = function()
{
	// ensure if a co number is entered can not select this button!!
	// only enabled in intial mode
	var enabled = true;
	var initialMode = MaintainCOFunctions.isScreenModeInitial();
	if(initialMode == false){
		enabled = false;
	}

	return enabled;
}
/************************************************************************************/
function CO_DebtorAddAddressBtn() {}
CO_DebtorAddAddressBtn.tabIndex = 46;
/**
 * @author rzhh8k
 * 
 */
CO_DebtorAddAddressBtn.actionBinding = function()
{
	Services.startTransaction();
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else if(MaintainCOFunctions.event920ExistsForToday() == true){
		alert(Messages.EVENT920_EXISTS_TODAY);
	}
	else{
		// ok display subform
		MaintainCOFunctions.resetTempAddress();
		// need to set up the flag re which addrtess adding creditor or payee
		Services.setValue(MaintainCOVariables.ADDING_ADDRESS_TYPE, MaintainCOVariables.ADD_DEBTOR_ADDRESS_TYPE);
		Services.dispatchEvent("addCoAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	Services.endTransaction();
}
CO_DebtorAddAddressBtn.enableOn = [	Header_CONumber.dataBinding,
						  	 		ManageCOParams.MODE];
CO_DebtorAddAddressBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
/************************************************************************************/
function CO_DebtorViewHistoricalAddressBtn() {}
CO_DebtorViewHistoricalAddressBtn.tabIndex = 47;
/**
 * @author rzhh8k
 * 
 */
CO_DebtorViewHistoricalAddressBtn.actionBinding = function()
{
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		alert(Messages.NO_ADDRESS_HISTORY);
	}
	else{
		if(MaintainCOFunctions.historyRetrieved(MaintainCOVariables.ADDRESS_HISTORY_DEBTOR) == false){
			// get history
			var params = new ServiceParams();
			params.addSimpleParameter("addressTypeCode", MaintainCOVariables.ADDRESS_HISTORY_DEBTOR);
			params.addSimpleParameter("coNumber", Services.getValue(Header_CONumber.dataBinding));
			
			Services.callService("getAddressHistory", params, CO_DebtorViewHistoricalAddressBtn, true);
		}
		else{
			// now navigate too popup if history exists
 			var historyExists = Services.getValue(MaintainCOVariables.DEBTOR_HISTORY_EXISTS);
			if(historyExists != null && historyExists == MaintainCOVariables.YES){
				Services.dispatchEvent("DebtorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
			}
			else{
				alert(Messages.NO_ADDRESS_HISTORY);
			}
		}		
	}		
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
CO_DebtorViewHistoricalAddressBtn.onSuccess = function(dom)
{
	Services.startTransaction();
	//set the flag so know tried to retrieve before
	Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_RETRIEVED, MaintainCOVariables.YES);
	if(dom != null){
		
		var addressHistoryNode = dom.selectSingleNode("ds/AddressHistory");
		if(null != addressHistoryNode && addressHistoryNode.childNodes.length > 0){
			// need to set history details details as retrieved some
			var addIdList = dom.selectNodes("ds/AddressHistory/Address/AddressId");

			//Now loop through each 
			if(addIdList != null && addIdList.length != 0){
				//Loop through the list and ...
				var id = null;
				var addressNode = null;
				for(var i = 0;i < addIdList.length; i++){
					id = addIdList[i].text;
					if(id != null && id != ""){
						Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_EXISTS, MaintainCOVariables.YES);
						addressNode = dom.selectSingleNode("ds/AddressHistory/Address[./AddressId = '" + id + "']");
						Services.addNode(addressNode, MaintainCOVariables.CO_XPATH + "/Debtor/AddressHistory");	
					}	
				}// for
			}
		}		
 	}// end of if (dom != null)
 	
 	// now navigate too popup if history exists
 	var historyExists = Services.getValue(MaintainCOVariables.DEBTOR_HISTORY_EXISTS);
 	Services.endTransaction();
 	if(historyExists != null && historyExists == MaintainCOVariables.YES){
		Services.dispatchEvent("DebtorAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
	}
	else{
		alert(Messages.NO_ADDRESS_HISTORY);
	}

}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
CO_DebtorViewHistoricalAddressBtn.onError = function(exception)
{
	Services.setValue(MaintainCOVariables.DEBTOR_HISTORY_RETRIEVED, MaintainCOVariables.NO);
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Address History Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
CO_DebtorViewHistoricalAddressBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
CO_DebtorViewHistoricalAddressBtn.enableOn = [Header_CONumber.dataBinding,
						  	 			    ManageCOParams.MODE];
CO_DebtorViewHistoricalAddressBtn.isEnabled = function()
{
	// defect 325 - if in create mode disable the history button
	var enabled = MaintainCOFunctions.isFieldEnabled();
	if(null != enabled && enabled != false){
		if(MaintainCOFunctions.isScreenModeCreate() == true){
			enabled = false;
		}
	}
	return enabled;
}

/************************************************************************************/
function CO_EmployerClearAddressBtn() {}
CO_EmployerClearAddressBtn.tabIndex = 51;
/**
 * @author rzhh8k
 * 
 */
CO_EmployerClearAddressBtn.actionBinding = function()
{
	Services.startTransaction();
	
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else{	
		// clear the current selected address.
		// First check there is one to clear. Do this by seeing if the add1 field has a value
		// As it is mandatory - if address exists must have an address line 1
		var add1 = Services.getValue(CO_EmploymentDetails_Address_Line1.dataBinding);
		if(add1 == null || add1 == ""){
			alert(Messages.NO_ADDRESS_TO_CLEAR);
		}
		else{
			if(confirm(Messages.CLEAR_ADDRESS)){
				// set message re save required
				Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
				var createMode = MaintainCOFunctions.isScreenModeCreate();
				MaintainCOFunctions.clearEmployerAndWorkplaceAddress(createMode);
				if(MaintainCOFunctions.isScreenModeMaintain() == true){
					// set the flag for firing event 986
					Services.setValue(MaintainCOVariables.EVENT986_CHANGE_EMPLOYER_DETAILS, MaintainCOVariables.YES);
					Services.setValue(MaintainCOVariables.EMPLOYMENT_ADDRESS_CHANGED, MaintainCOVariables.YES);
				}
			}// end of if(confirm(Messages.CLEAR_ADDRESS)){
			else{
				// do nothing as user doesn't want to clear address
			}
		}
	}

	Services.endTransaction();
}
CO_EmployerClearAddressBtn.enableOn = [	Header_CONumber.dataBinding,
						  	 			ManageCOParams.MODE];
CO_EmployerClearAddressBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/************************************************************************************/
function CO_EmployerAddAddressBtn() {}
CO_EmployerAddAddressBtn.tabIndex = 50;
/**
 * @author rzhh8k
 * 
 */
CO_EmployerAddAddressBtn.actionBinding = function()
{
	var updatable = MaintainCOFunctions.statusAllowsUpdate();
	if(updatable == false){
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else{
		// ok display subform
		MaintainCOFunctions.resetTempAddress();
		// need to set up the flag re which addrtess adding creditor or payee
		Services.setValue(MaintainCOVariables.ADDING_ADDRESS_TYPE, MaintainCOVariables.ADD_EMPLOYER_ADDRESS_TYPE);
		Services.dispatchEvent("addCoAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}	
}
CO_EmployerAddAddressBtn.enableOn = [	Header_CONumber.dataBinding,
						  	 			ManageCOParams.MODE];
CO_EmployerAddAddressBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/************************************************************************************/
function CO_EmployerViewHistoricalAddressBtn() {}
CO_EmployerViewHistoricalAddressBtn.tabIndex = 52;
/**
 * @author rzhh8k
 * 
 */
CO_EmployerViewHistoricalAddressBtn.actionBinding = function()
{
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		alert(Messages.NO_ADDRESS_HISTORY);
	}
	else{
		if(MaintainCOFunctions.historyRetrieved(MaintainCOVariables.ADDRESS_HISTORY_EMPLOYER) == false){
			// get history
			var params = new ServiceParams();
			params.addSimpleParameter("addressTypeCode", MaintainCOVariables.ADDRESS_HISTORY_EMPLOYER);
			params.addSimpleParameter("coNumber", Services.getValue(Header_CONumber.dataBinding));
			
			Services.callService("getAddressHistory", params, CO_EmployerViewHistoricalAddressBtn, true);
		}
		else{
			// now navigate too popup if history exists
 			var historyExists = Services.getValue(MaintainCOVariables.EMPLOYER_HISTORY_EXISTS);
			if(historyExists != null && historyExists == MaintainCOVariables.YES){
				Services.dispatchEvent("EmployerAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
			}
			else{
				alert(Messages.NO_ADDRESS_HISTORY);
			}
		}		
	}		
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
CO_EmployerViewHistoricalAddressBtn.onSuccess = function(dom)
{
	Services.startTransaction();
	//set the flag so know tried to retrieve before
	Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_RETRIEVED, MaintainCOVariables.YES);
	if(dom != null){
		
		var addressHistoryNode = dom.selectSingleNode("ds/AddressHistory");
		if(null != addressHistoryNode && addressHistoryNode.childNodes.length > 0){
			// need to set history details details as retrieved some
			var addIdList = dom.selectNodes("ds/AddressHistory/Address/AddressId");

			//Now loop through each 
			if(addIdList != null && addIdList.length != 0){
				//Loop through the list and ...
				var id = null;
				var addressNode = null;
				for(var i = 0;i < addIdList.length; i++){
					id = addIdList[i].text;
					if(id != null && id != ""){
						Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_EXISTS, MaintainCOVariables.YES);
						addressNode = dom.selectSingleNode("ds/AddressHistory/Address[./AddressId = '" + id + "']");
						Services.addNode(addressNode, MaintainCOVariables.CO_XPATH + "/Employer/AddressHistory");	
					}	
				}// for
			}
		}		
 	}// end of if (dom != null)
 	
 	// now navigate too popup if history exists
 	var historyExists = Services.getValue(MaintainCOVariables.EMPLOYER_HISTORY_EXISTS);
 	Services.endTransaction();
 	if(historyExists != null && historyExists == MaintainCOVariables.YES){
		Services.dispatchEvent("EmployerAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
	}
	else{
		alert(Messages.NO_ADDRESS_HISTORY);
	}

}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
CO_EmployerViewHistoricalAddressBtn.onError = function(exception)
{
	Services.setValue(MaintainCOVariables.EMPLOYER_HISTORY_RETRIEVED, MaintainCOVariables.NO);
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Address History Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
CO_EmployerViewHistoricalAddressBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
CO_EmployerViewHistoricalAddressBtn.enableOn = [	Header_CONumber.dataBinding,
						  	 						ManageCOParams.MODE];
CO_EmployerViewHistoricalAddressBtn.isEnabled = function()
{
	// defect 325 - if in create mode disable the history button
	var enabled = MaintainCOFunctions.isFieldEnabled();
	if(null != enabled && enabled != false){
		if(MaintainCOFunctions.isScreenModeCreate() == true){
			enabled = false;
		}
	}
	return enabled;
}

/************************************************************************************/
function CO_WorkplaceClearAddressBtn() {}
CO_WorkplaceClearAddressBtn.tabIndex = 61;
/**
 * @author rzhh8k
 * 
 */
CO_WorkplaceClearAddressBtn.actionBinding = function()
{
	Services.startTransaction();
	if(MaintainCOFunctions.statusAllowsUpdate() == false){
		alert(Messages.STATUS_NOT_ALLOW_UPDATE);
	}
	else{	
		// clear the current selected address.
		// First check there is one to clear. Do this by seeing if the add1 field has a value
		// As it is mandatory - if address exists must have an address line 1
		var add1 = Services.getValue(CO_WorkplaceDetails_Address_Line1.dataBinding);
		if(add1 == null || add1 == ""){
			alert(Messages.NO_ADDRESS_TO_CLEAR);
		}
		else{
			if(confirm(Messages.CLEAR_ADDRESS)){
				// set message re save required
				Services.setValue(MaintainCOVariables.SAVE_REQUIRED_MESSAGE, MaintainCOVariables.YES);
				var createMode = MaintainCOFunctions.isScreenModeCreate();
				MaintainCOFunctions.clearWorkplaceAddress(createMode);
			}// end of if(confirm(Messages.CLEAR_ADDRESS)){
			else{
				// do nothing as user doesn't want to clear address
			}
		}
	}
	Services.endTransaction();
}
CO_WorkplaceClearAddressBtn.enableOn = [Header_CONumber.dataBinding,
						  	 			ManageCOParams.MODE];
CO_WorkplaceClearAddressBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}
/************************************************************************************/
function CO_WorkplaceAddAddressBtn() {}
CO_WorkplaceAddAddressBtn.tabIndex = 60;
/**
 * @author rzhh8k
 * 
 */
CO_WorkplaceAddAddressBtn.actionBinding = function()
{
	// can only add workplace addresses if a workplace address exists
	var empAdd1 = Services.getValue(CO_EmploymentDetails_Address_Line1.dataBinding);
	if(empAdd1 != null && empAdd1 != ""){
		var updatable = MaintainCOFunctions.statusAllowsUpdate();
		if(updatable == false){
			alert(Messages.STATUS_NOT_ALLOW_UPDATE);
		}
		else{
			// ok display subform
			MaintainCOFunctions.resetTempAddress();
			// need to set up the flag re which addrtess adding creditor or payee
			Services.setValue(MaintainCOVariables.ADDING_ADDRESS_TYPE, MaintainCOVariables.ADD_WORKPLACE_ADDRESS_TYPE);
			Services.dispatchEvent("addCoAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
		}
	}
	else{
		alert(Messages.ENTER_EMPLOYER_DETAILS);
	}
}
CO_WorkplaceAddAddressBtn.enableOn = [Header_CONumber.dataBinding,
						  	 		  ManageCOParams.MODE];
CO_WorkplaceAddAddressBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/************************************************************************************/
function CO_WorkplaceViewHistoricalAddressBtn() {}
CO_WorkplaceViewHistoricalAddressBtn.tabIndex = 62;
/**
 * @author rzhh8k
 * 
 */
CO_WorkplaceViewHistoricalAddressBtn.actionBinding = function()
{
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		alert(Messages.NO_ADDRESS_HISTORY);
	}
	else{
		if(MaintainCOFunctions.historyRetrieved(MaintainCOVariables.ADDRESS_HISTORY_WORKPLACE) == false){
			// get history
			var params = new ServiceParams();
			params.addSimpleParameter("addressTypeCode", MaintainCOVariables.ADDRESS_HISTORY_WORKPLACE);
			params.addSimpleParameter("coNumber", Services.getValue(Header_CONumber.dataBinding));
			
			Services.callService("getAddressHistory", params, CO_WorkplaceViewHistoricalAddressBtn, true);
		}
		else{
			// now navigate too popup if history exists
 			var historyExists = Services.getValue(MaintainCOVariables.WORKPLACE_HISTORY_EXISTS);
			if(historyExists != null && historyExists == MaintainCOVariables.YES){
				Services.dispatchEvent("WorkplaceAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
			}
			else{
				alert(Messages.NO_ADDRESS_HISTORY);
			}
		}		
	}
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
CO_WorkplaceViewHistoricalAddressBtn.onSuccess = function(dom)
{
	Services.startTransaction();
	//set the flag so know tried to retrieve before
	Services.setValue(MaintainCOVariables.WORKPLACE_HISTORY_RETRIEVED, MaintainCOVariables.YES);
	if(dom != null){		
		var addressHistoryNode = dom.selectSingleNode("ds/AddressHistory");
		if(null != addressHistoryNode && addressHistoryNode.childNodes.length > 0){
			// need to set history details details as retrieved some
			var addIdList = dom.selectNodes("ds/AddressHistory/Address/AddressId");

			//Now loop through each 
			if(addIdList != null && addIdList.length != 0){
				//Loop through the list and ...
				var id = null;
				var addressNode = null;
				for(var i = 0;i < addIdList.length; i++){
					id = addIdList[i].text;
					if(id != null && id != ""){
						Services.setValue(MaintainCOVariables.WORKPLACE_HISTORY_EXISTS, MaintainCOVariables.YES);
						addressNode = dom.selectSingleNode("ds/AddressHistory/Address[./AddressId = '" + id + "']");
						Services.addNode(addressNode, MaintainCOVariables.CO_XPATH + "/Workplace/AddressHistory");	
					}	
				}// for
			}
		}		
 	}// end of if (dom != null)
 	
 	// now navigate too popup if history exists
 	var historyExists = Services.getValue(MaintainCOVariables.WORKPLACE_HISTORY_EXISTS);
 	Services.endTransaction();
 	if(historyExists != null && historyExists == MaintainCOVariables.YES){
		Services.dispatchEvent("WorkplaceAddressHistory", PopupGUIAdaptor.EVENT_RAISE);
	}
	else{
		alert(Messages.NO_ADDRESS_HISTORY);
	}

}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
CO_WorkplaceViewHistoricalAddressBtn.onError = function(exception)
{
	alert(Messages.ERR_RET_CO_MESSAGE.replace(/XXX/, "Address History Details"));
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
CO_WorkplaceViewHistoricalAddressBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
CO_WorkplaceViewHistoricalAddressBtn.enableOn = [Header_CONumber.dataBinding,
						  	 		  			 ManageCOParams.MODE];
CO_WorkplaceViewHistoricalAddressBtn.isEnabled = function()
{
	// defect 325 - if in create mode disable the history button
	var enabled = MaintainCOFunctions.isFieldEnabled();
	if(null != enabled && enabled != false){
		if(MaintainCOFunctions.isScreenModeCreate() == true){
			enabled = false;
		}
	}
	return enabled;
}

/************************************************************************************/
function CO_MaintainDebtBtn() {}
CO_MaintainDebtBtn.tabIndex = 70;
CO_MaintainDebtBtn._buttonClicked = false;
/**
 * @author rzhh8k
 * @return null 
 */
CO_MaintainDebtBtn.actionBinding = function()
{
	if ( CO_MaintainDebtBtn._buttonClicked == true )
	{
		// Defect 5185 - Prevents user from clicking button multiple times and calling
		// copyData repeatedly which causes the data to be cleared on the screen.
		return;
	}
	// Set the button clicked variable
	CO_MaintainDebtBtn._buttonClicked = true;
	
	Services.startTransaction();

	var navigationArray = new Array(NavigationController.MAINTAINDEBT_FORM, NavigationController.MAINTAINCO_FORM);
	if(NavigationController.callStackExists()){
		NavigationController.addToStack(navigationArray);
	}
	else{
		NavigationController.createCallStack(navigationArray);
	}
	// set the flag so know come back from maintain debts
	Services.setValue(MaintainCOVariables.VISITED_MAINTAIN_DEBTS, MaintainCOVariables.YES);
	// copy the data
	MaintainCOFunctions.copyData(true, true);//pCopyToAppFlags, pRemoveOrigNode
	
	NavigationController.nextScreen();

	Services.endTransaction();
}

CO_MaintainDebtBtn.enableOn = [	Header_CONumber.dataBinding,
						  	 	ManageCOParams.MODE];
CO_MaintainDebtBtn.isEnabled = function()
{
	return MaintainCOFunctions.isFieldEnabled();
}

/************************************************************************************/
function DebtorAddressHistory_Popup_CloseBtn() {}
DebtorAddressHistory_Popup_CloseBtn.tabIndex = 79;

/************************************************************************************/
function EmployerAddressHistory_Popup_CloseBtn() {}
EmployerAddressHistory_Popup_CloseBtn.tabIndex = 89;

/************************************************************************************/
function WorkplaceAddressHistory_Popup_CloseBtn() {}
WorkplaceAddressHistory_Popup_CloseBtn.tabIndex = 99;

/*****************************************************************************************************************
										LOV BUTTONS															
********************************************************************************/
function Header_Court_LOV() {}
Header_Court_LOV.tabIndex = 6;
Header_Court_LOV.enableOn = [Header_CONumber.dataBinding,
							 ManageCOParams.MODE];
Header_Court_LOV.isEnabled = function()
{
	var enabled = false;
	// check to see if mode allows button to be enabled
	if(MaintainCOFunctions.isScreenModeCreate() == true){
		enabled = true;
	}	
	return enabled;
}

/******************************************************************************/

/*****************************************************************************************************************
										SUB FORM - MAINTAIN DEBTS															
****************************************************************************************************************/
