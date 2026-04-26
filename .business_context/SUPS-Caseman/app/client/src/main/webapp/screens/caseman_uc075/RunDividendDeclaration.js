/** 
 * @fileoverview RunDividendDeclaration.js:
 * This file contains the form and field configurations for the UC075 - Run Dividend Declaration 
 * screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Amended:	05/09/06 MGG		
 *			Defect 4966 Amended adding co validation. Service returns 'UnresolvedOverpayment' 
 *			tag instead of 'OverPayment' tag.
 * 13-Nov-2006 Phil Haferer: Candidate Z 171: Three apostrophies in Xpath fix. 
 *
 */

/****************************** MAIN FORM *****************************************/

function runDividendDeclaration() {};

/**
 * @author rzxd7g
 * 
 */
runDividendDeclaration.initialise = function()
{
	getDividendDeclarationData();
}

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
runDividendDeclaration.onSuccess = function(dom, serviceName) 
{
	switch (serviceName)
	{
		case "getDividendsDeclared":
			// List of Consolidated Orders with ADHOC_DIVIDEND flag set to 'Y' returned
			Services.replaceNode(PageOne_ConsolidatedOrderGrid.srcData, dom);
			Services.setFocus("PageOne_ConsolidatedOrderGrid");
			break;
			
		case "getRunDividendDeclarationData":
		
			// Place the court data in the DOM
			var courtDataNode = dom.selectSingleNode("/ds/CourtData");
			Services.replaceNode(VAR_PAGE_XPATH + "/Temp/CourtData", courtDataNode);
		
			// Place the validation data in the DOM
			var validationNode = dom.selectSingleNode("/ds/ValidationData");
			Services.replaceNode(VAR_PAGE_XPATH + "/Temp/ValidationData", validationNode);

			// Get the validation flags			
			var startOfDayRun = Services.getValue(VAR_PAGE_XPATH + "/Temp/ValidationData/StartOfDayRun");
			var endOfDayRun = Services.getValue(VAR_PAGE_XPATH + "/Temp/ValidationData/EndOfDayRun");
			var payoutRun = Services.getValue(VAR_PAGE_XPATH + "/Temp/ValidationData/PayoutRun");
			if ( startOfDayRun == "false" )
			{
				// Start of day has not been run, Redirect to start of day screen
				var navArray = new Array(NavigationController.SUITORS_STARTOFDAY_FORM, NavigationController.RUN_DIVIDEND_DECLARATION_FORM);
				NavigationController.createCallStack(navArray);
				NavigationController.nextScreen();
			}
			else if ( endOfDayRun == "true" )
			{
				// End of Day has been run, set the flag and call save to display the error message
				Services.setValue(ENDOFDAY_RUN_IND_XPATH, "true");
				Status_SaveButton.actionBinding();
			}
			else if ( payoutRun != "NONE" )
			{
				// The payout has been run, set the flag and call save to display the error message
				Services.setValue(PAYOUT_ERRORMESSAGE_XPATH, payoutRun);
				Status_SaveButton.actionBinding();
			}
			else
			{
				// If have gotten to this point, the payout lock must have been applied so set flag
				Services.setValue(PAYOUT_LOCK_IND_XPATH, "true");
			
				// List of Consolidated Orders with ADHOC_DIVIDEND flag set to 'Y' returned
				var coDataNode = dom.selectSingleNode("/ds/ConsolidatedOrderList");
				Services.replaceNode(PageOne_ConsolidatedOrderGrid.srcData, coDataNode);
				Services.setFocus("PageOne_ConsolidatedOrderGrid");
			}
			break;
	}
}

runDividendDeclaration.refDataServices = [
	{ name:"SystemDate",      dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] }
];

/********************************** GRIDS *****************************************/

function PageOne_ConsolidatedOrderGrid() {};
PageOne_ConsolidatedOrderGrid.isRecord = true;
PageOne_ConsolidatedOrderGrid.tabIndex = 1;
PageOne_ConsolidatedOrderGrid.dataBinding = VAR_PAGE_XPATH + "/SelectedGridRow/SelectedCONumber";
PageOne_ConsolidatedOrderGrid.srcData = DATA_XPATH + "/ConsolidatedOrderList";
PageOne_ConsolidatedOrderGrid.rowXPath = "ConsolidatedOrder";
PageOne_ConsolidatedOrderGrid.keyXPath = "CONumber";
PageOne_ConsolidatedOrderGrid.columns = [
	{xpath: "CONumber"},
	{xpath: "DebtorName"},
	{xpath: "MoniesInCourtCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "MoniesInCourt", transformToDisplay: transformAmountToDisplay},
	{xpath: "COStatus"}
];

PageOne_ConsolidatedOrderGrid.enableOn = [PAYOUT_LOCK_IND_XPATH];
PageOne_ConsolidatedOrderGrid.isEnabled = function()
{
	// Check if Lock not applied, then at least one of the pre-requisites have not been met
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	return ( payoutLockApplied == "true" ) ? true : false;
}

/********************************* POPUPS ******************************************/

function AddNewConsolidatedOrder_Popup() {};
/**
 * @author rzxd7g
 * 
 */
AddNewConsolidatedOrder_Popup.prePopupPrepare = function()
{
	Services.setValue(AddNewConsolidatedOrderPopup_CONumber.dataBinding, "");
	Services.setValue(CONUMBER_RETRIEVED_IND_XPATH, "false");
}

AddNewConsolidatedOrder_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "PageOne_AddButton"} ],
		keys: [ { key: Key.F2, element: "runDividendDeclaration" } ]
	}
};

AddNewConsolidatedOrder_Popup.lower = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddNewConsolidatedOrder_Popup" } ],
		singleClicks: [ {element: "AddNewConsolidatedOrderPopup_CancelButton"} ]
	}
};

/**
 * @author rzxd7g
 * @return "PageOne_ConsolidatedOrderGrid"  
 */
AddNewConsolidatedOrder_Popup.nextFocusedAdaptorId = function() {
	return "PageOne_ConsolidatedOrderGrid";
}

/********************************* FIELDS ******************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.dataBinding = VAR_PAGE_XPATH + "/Temp/CourtData/CourtCode";
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.isTemporary = function() { return true; }
Header_OwningCourtCode.isReadOnly = function() { return true; }

/***********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.dataBinding = VAR_PAGE_XPATH + "/Temp/CourtData/CourtName";
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.isTemporary = function() { return true; }
Header_OwningCourtName.isReadOnly = function() { return true; }

/***********************************************************************************/

function AddNewConsolidatedOrderPopup_CONumber() {};
AddNewConsolidatedOrderPopup_CONumber.dataBinding = VAR_PAGE_XPATH + "/AddNewCOPopup/CONumber";
AddNewConsolidatedOrderPopup_CONumber.helpText = "Please enter a CO Number";
AddNewConsolidatedOrderPopup_CONumber.tabIndex = 20;
AddNewConsolidatedOrderPopup_CONumber.maxLength = 8;
AddNewConsolidatedOrderPopup_CONumber.isTemporary = function() { return true; }
AddNewConsolidatedOrderPopup_CONumber.isMandatory = function() { return true; }
AddNewConsolidatedOrderPopup_CONumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewConsolidatedOrderPopup_CONumber.validateOn = [CONUMBER_RETRIEVED_IND_XPATH];
AddNewConsolidatedOrderPopup_CONumber.validate = function()
{
	var ec = null;
	
	var retrieved = Services.getValue(CONUMBER_RETRIEVED_IND_XPATH);
	var coNumber = Services.getValue(AddNewConsolidatedOrderPopup_CONumber.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) )
	{
		if ( retrieved == "true" )
		{
			// Perform validation based on the service retrieval
			var resultCount = Services.countNodes(TEMP_CODATA_XPATH + "/ConsolidatedOrder");
			if ( resultCount == 0 )
			{
				// No matching CO Number found
				ec = ErrorCode.getErrorCode("CaseMan_runDivDecNoCOFound_Msg");
			}
			else
			{
				var COStatus = Services.getValue(TEMP_CODATA_XPATH + "/ConsolidatedOrder/COStatus");
				var moneyInCourt = Services.getValue(TEMP_CODATA_XPATH + "/ConsolidatedOrder/MoniesInCourt");
				var overPayment = Services.getValue(TEMP_CODATA_XPATH + "/ConsolidatedOrder/UnresolvedOverpayment");
				
				if ( COStatus == "PAID" )
				{
					// CO Status cannot be PAID
					ec = ErrorCode.getErrorCode("CaseMan_runDivDecCOStatusPaid_Msg");
				}
				else if ( moneyInCourt == 0 )
				{
					// No money in court
					ec = ErrorCode.getErrorCode("CaseMan_runDivDecCONoMoneyInCourt_Msg");
				}
				else if ( overPayment == "Y" )
				{
					// Overpayment still unresolved
					ec = ErrorCode.getErrorCode("CaseMan_runDivDecCOOverpaymentUnresolved_Msg");
				}
			}
		}
		else
		{
			// Check if the CO Number entered is already in the list
			var count = Services.countNodes(PageOne_ConsolidatedOrderGrid.srcData + "/ConsolidatedOrder[./CONumber = " + AddNewConsolidatedOrderPopup_CONumber.dataBinding + "]");
			if ( count > 0 )
			{
				// CO Number entered is already in the list
				ec = ErrorCode.getErrorCode("CaseMan_runDivDecDuplicateCONumber_Msg");
			}
		}
	}
	
	return ec;
}

AddNewConsolidatedOrderPopup_CONumber.logicOn = [AddNewConsolidatedOrderPopup_CONumber.dataBinding];
AddNewConsolidatedOrderPopup_CONumber.logic = function(event)
{
	if ( event.getXPath() != AddNewConsolidatedOrderPopup_CONumber.dataBinding )
	{
		return;
	}
	
	Services.setValue(CONUMBER_RETRIEVED_IND_XPATH, "false");
	var coNumber = Services.getValue(AddNewConsolidatedOrderPopup_CONumber.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) && null == AddNewConsolidatedOrderPopup_CONumber.validate() )
	{
		// Make service call to retrieve CO data
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
		var params = new ServiceParams();
		params.addSimpleParameter("courtCode", courtCode);
		params.addSimpleParameter("coNumber", coNumber);
		Services.callService("getDividendsCoSummary", params, AddNewConsolidatedOrderPopup_CONumber, false);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
AddNewConsolidatedOrderPopup_CONumber.onSuccess = function(dom)
{
	// Place the data on the CO Number queried in the temporary area of the DOM
	Services.replaceNode(TEMP_CODATA_XPATH, dom);
	Services.setValue(CONUMBER_RETRIEVED_IND_XPATH, "true");
	Services.setFocus("AddNewConsolidatedOrderPopup_CONumber");
}

/******************************** BUTTONS *****************************************/

function PageOne_AddButton() {};
PageOne_AddButton.tabIndex = 2;
PageOne_AddButton.enableOn = [PAYOUT_LOCK_IND_XPATH];
PageOne_AddButton.isEnabled = function()
{
	// Check if Lock not applied, then at least one of the pre-requisites have not been met
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	return ( payoutLockApplied == "true" ) ? true : false;
}

/***********************************************************************************/

function PageOne_RemoveButton() {};

PageOne_RemoveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "runDividendDeclaration", alt: true } ]
	}
};

PageOne_RemoveButton.tabIndex = 3;

PageOne_RemoveButton.enableOn = [PAYOUT_LOCK_IND_XPATH, PageOne_ConsolidatedOrderGrid.dataBinding];
PageOne_RemoveButton.isEnabled = function()
{
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	if ( payoutLockApplied != "true" )
	{
		// Lock not applied, so at least one of the pre-requisites have not been met
		return false;
	}

	var gridDb = Services.getValue(PageOne_ConsolidatedOrderGrid.dataBinding);
	if ( CaseManUtils.isBlank(gridDb) )
	{
		return false;
	}

	var currentCOStatus = Services.getValue(DATA_XPATH + "/ConsolidatedOrderList/ConsolidatedOrder[./CONumber = '" + gridDb + "']/Status");
	if ( currentCOStatus == STATUS_NEW )
	{
		// Only enabled if the Consolidated Order selected is newly added
		return true;
	}
	
	return false;
}

/**
 * @author rzxd7g
 * 
 */
PageOne_RemoveButton.actionBinding = function() 
{
	// Remove the new Consolidated Order
	var gridDb = Services.getValue(PageOne_ConsolidatedOrderGrid.dataBinding);
	Services.removeNode(DATA_XPATH + "/ConsolidatedOrderList/ConsolidatedOrder[./CONumber = '" + gridDb + "']");
}

/***********************************************************************************/

function PageOne_ResetButton() {};

PageOne_ResetButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "runDividendDeclaration" } ]
	}
};

PageOne_ResetButton.tabIndex = 4;
PageOne_ResetButton.enableOn = [PAYOUT_LOCK_IND_XPATH, PageOne_ConsolidatedOrderGrid.dataBinding];
PageOne_ResetButton.isEnabled = function()
{
	var payoutLockApplied = Services.getValue(PAYOUT_LOCK_IND_XPATH);
	if ( payoutLockApplied != "true" )
	{
		// Lock not applied, so at least one of the pre-requisites have not been met
		return false;
	}

	var countNewCOs = Services.countNodes(DATA_XPATH + "/ConsolidatedOrderList/ConsolidatedOrder[./Status = '" + STATUS_NEW + "']");
	if ( countNewCOs == 0 )
	{
		// Disabled if no new Consolidated Orders exist
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
PageOne_ResetButton.actionBinding = function() 
{
	// Retrieve the Consolidated Order list again
	retrieveConsolidatedOrders();
}

/***********************************************************************************/

function Status_SaveButton() {};

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "runDividendDeclaration" } ]
	}
};

Status_SaveButton.tabIndex = 10;
/**
 * @author rzxd7g
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	var message = null;
	var endOfDayRun = Services.getValue(ENDOFDAY_RUN_IND_XPATH);
	var payoutRun = Services.getValue(PAYOUT_LOCK_IND_XPATH);

	if ( endOfDayRun == "true" )
	{
		// End of Day report has already been run, display error message
		message = ErrorCode.getErrorCode("CaseMan_runDivDecEndOfDayRun_Msg").getMessage();
	}
	else if ( payoutRun != "true" )
	{
		// Payout has already been run or is locked, display error message
		var payoutCode = Services.getValue(PAYOUT_ERRORMESSAGE_XPATH);
		switch (payoutCode)
		{
			case "PAYOUT":
				message = ErrorCode.getErrorCode("CaseMan_runDivDecPayoutRun_Msg").getMessage();
				break;
			case "DIV":
				message = ErrorCode.getErrorCode("CaseMan_runDivDecDividendPayoutRun_Msg").getMessage();
				break;
			case "HIST":
				message = ErrorCode.getErrorCode("CaseMan_runDivDecPPLReportRun_Msg").getMessage();
				break;
			case "false":
				// No message has been defined for this scenario
				message = "Cannot save - unspecified error message, raise defect.";
		}
	}
	else
	{
		// Reports have not been run yet
		var countCO = Services.countNodes(PageOne_ConsolidatedOrderGrid.srcData + "/ConsolidatedOrder");
		if ( countCO == 0 )
		{
			// No COs available to run report, throw error message
			message = ErrorCode.getErrorCode("CaseMan_runDivDecNoCORecordsSelected_Msg").getMessage();
		}
		else
		{
			var countNewCOs = Services.countNodes(DATA_XPATH + "/ConsolidatedOrderList/ConsolidatedOrder[./Status = '" + STATUS_NEW + "']");
			if ( countNewCOs > 0 )
			{
				// Call the update Adhoc Dividend Flag service
				// Strip out the original COs so only send the manually added COs to be updated
				var dataNode = XML.createDOM(null, null, null);
				var node = Services.getNode(PageOne_ConsolidatedOrderGrid.srcData)
				var strippedNode = RecordsProtocol.stripCleanRecords(node, PageOne_ConsolidatedOrderGrid.srcData);
				dataNode.appendChild(strippedNode);
				
				var params = new ServiceParams();
				params.addDOMParameter("coList", dataNode);
				Services.callService("updateCoAdhocDividendFlag", params, Status_SaveButton, true);
			}
			else
			{
				// Call the Run Dividend Payout Service
				var params = new ServiceParams();
				Services.callService("runDividendPayoutStage1", params, Status_SaveButton, true);
			}
		}
	}
	
	if ( null != message )
	{
		// Display Error message in the status bar
		Services.setTransientStatusBarMessage(message);
	}
}

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "updateCoAdhocDividendFlag" )
	{
		// Call the Run Dividend Payout Service
		var params = new ServiceParams();
		Services.callService("runDividendPayoutStage1", params, Status_SaveButton, true);
	}
	else
	{
		// Navigate to the Complete Payout Screen
		Services.setValue(CompletePayoutParams.RUNDIVIDEND_IND, "true");
		Services.navigate(NavigationController.PRINT_PAYOUT_REPORTS_FORM);
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onError = function(exception)
{
	cancelDividendPayout();
}

/***********************************************************************************/

function Status_CloseButton() {};

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "runDividendDeclaration" } ]
	}
};

Status_CloseButton.tabIndex = 11;
/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.actionBinding = function()
{
	cancelDividendPayout();
}

/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.onSuccess = function()
{
	exitScreen();
}

/***********************************************************************************/

function AddNewConsolidatedOrderPopup_OkButton() {};
AddNewConsolidatedOrderPopup_OkButton.tabIndex = 21;

AddNewConsolidatedOrderPopup_OkButton.enableOn = [AddNewConsolidatedOrderPopup_CONumber.dataBinding, CONUMBER_RETRIEVED_IND_XPATH];
AddNewConsolidatedOrderPopup_OkButton.isEnabled = function()
{
	var CONumber = Services.getValue(AddNewConsolidatedOrderPopup_CONumber.dataBinding);
	var CONumberAd = Services.getAdaptorById("AddNewConsolidatedOrderPopup_CONumber");
	if ( !CaseManUtils.isBlank(CONumber) && CONumberAd.getValid() )
	{
		return true;
	}
	return false;
}

/**
 * @author rzxd7g
 * 
 */
AddNewConsolidatedOrderPopup_OkButton.actionBinding = function()
{
	// Add the new CO to the Main List on Page One with a Status of 'New'
	Services.setValue(TEMP_CODATA_XPATH + "/ConsolidatedOrder/Status", STATUS_NEW);
	var newCONode = Services.getNode(TEMP_CODATA_XPATH + "/ConsolidatedOrder");
	Services.addNode(newCONode, PageOne_ConsolidatedOrderGrid.srcData);
	
	var coNumber = Services.getValue(AddNewConsolidatedOrderPopup_CONumber.dataBinding);
	Services.setValue(PageOne_ConsolidatedOrderGrid.dataBinding, coNumber);
	Services.dispatchEvent("AddNewConsolidatedOrder_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}

/***********************************************************************************/

function AddNewConsolidatedOrderPopup_CancelButton() {};
AddNewConsolidatedOrderPopup_CancelButton.tabIndex = 22;

/*************************** EXIT SCREEN HANDLER **********************************/

function exitScreenHandler() {};
/**
 * @author rzxd7g
 * 
 */
exitScreenHandler.handleExit = function()
{
	// Call the cancel service just in case
	cancelDividendPayout();
	alert("Please close down properly");
}
