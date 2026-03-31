/** 
 * @fileoverview CalculateProtectedEarningsRate.js:
 * This file conains the form and field configurations for the UC102 - 
 * AE calculate protected earnings rate screen.
 * 
 * Note that you will find generic code for UC102 and UC115 in CalculatePERCommon.js
 *
 * @author Ian Stainer
 * @version 0.1
 *
 * Change History:
 * 20/06/2006 - Chris Vincent, Changed global variables to class variables and added javadoc 
 *				style comments to all helper functions.
 */
 
/******************************* CONSTANTS *****************************************/

/**
 * Enumeration of the services called by this screen
 * @author kznwpr
 * 
 */
function FormServices() {};
FormServices.GET_PER_SERVICE = "getAePer";
FormServices.UPDATE_PER_SERVICE = "updateAePer";

// Xpath to the description for event 857, which is retrieved into ref data
XPathConstants.EVENT_857_DESCRIPTION_XPATH = XPathConstants.REF_DATA_XPATH + "/ds/StandardEvent/EventDescription";
XPathConstants.COURT_CODE_XPATH = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CourtCode"; // Non-visual only used when creating event 857

/******************************* FORM ELEMENT **************************************/

function calculatePER() {}

// Load the reference data into the model
calculatePER.refDataServices = [
	{name:"CalculatedPeriods", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCalculatedPeriods", serviceParams:[]},
	{name:"StandardAllowances", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPerAllowanceCodes", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},		
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[]},
	{name:"CaseEvent", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getStandardEvent", serviceParams:[{name:"eventId", constant:"857"}]}				
];	

/**
 * @author kznwpr
 * 
 */
calculatePER.initialise = function()
{
	loadData();
}

/**
 * @param dom
 * @author kznwpr
 * 
 */
calculatePER.onSuccess = function(dom)
{
	// Select the CalculatePER tag rather than the ds tag
	var data = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	if ( null != data )
	{
		Services.replaceNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT, data);
	}
	
	// Set the default currency for the totals currency fields
	Services.setValue(XPathConstants.TOTALS_DATA_BINDING_ROOT + "/Currency", getDefaultCurrencyCode());
	
	calculateTotals();
	
	// Store the value in the calculated period drop down as it is after data loading
	var newCalculatedPeriodValue = Services.getValue(Main_CalculatedPeriod.dataBinding);
	Services.setValue(XPathConstants.LASTCALCULATEDPERIOD_XPATH, newCalculatedPeriodValue);
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
calculatePER.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/******************************* MAIN FUNCTIONS ************************************/

/**
 * Function handles the loading of the screen data.
 * @author kznwpr
 * @return null 
 */
function loadData()
{
	if (!Services.hasValue(PERCalculatorParams.AE_NUMBER))
	{
		alert("No AE number supplied so not calling any services.");
		return;
	}
	var params = new ServiceParams();
	params.addSimpleParameter("aeNumber", Services.getValue(PERCalculatorParams.AE_NUMBER));
	Services.callService(FormServices.GET_PER_SERVICE, params, calculatePER, true);					
	
	// Display the first tab page
	Services.setValue(myTabSelector.dataBinding, "firstPage");
}

/*********************************************************************************/

/**
 * This function is called the first time the user saves the PER data. 
 * It inserts an AEEvents branch into the dom that is sent to the server.
 * When this branch is present in the dom the server knows that it must create an event 857.
 *
 * @return [DOM] The Business data node to be sent to the server side
 * @author kznwpr
 */
function getBusinessDataWithEvent857()
{
	// Create a dom that contains the structure for a new event
	var eventDom = Services.loadDOMFromURL("NewEvent857.xml");
	
	// Set the data in the event dom
	eventDom.selectSingleNode("/AEEvents/AEEvent/CaseNumber").appendChild(eventDom.createTextNode(Services.getValue(Header_CaseNumber.dataBinding)));
	eventDom.selectSingleNode("/AEEvents/AEEvent/OwningCourtCode").appendChild(eventDom.createTextNode(Services.getValue(XPathConstants.COURT_CODE_XPATH)));	
	eventDom.selectSingleNode("/AEEvents/AEEvent/AENumber").appendChild(eventDom.createTextNode(Services.getValue(Header_AENumber.dataBinding)));	
	eventDom.selectSingleNode("/AEEvents/AEEvent/EventDate").appendChild(eventDom.createTextNode(getTodaysDate()));	
	eventDom.selectSingleNode("/AEEvents/AEEvent/UserName").appendChild(eventDom.createTextNode(Services.getCurrentUser()));		
	eventDom.selectSingleNode("/AEEvents/AEEvent/ReceiptDate").appendChild(eventDom.createTextNode(getTodaysDate()));	
	eventDom.selectSingleNode("/AEEvents/AEEvent/StandardEventDescription").appendChild(eventDom.createTextNode(Services.getValue(XPathConstants.EVENT_857_DESCRIPTION_XPATH)));

	var judgmentDebtorCasePartyNumber = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PartyAgainst/Number");
	var judgmentDebtorPartyRoleCode = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PartyAgainst/RoleCode");
	eventDom.selectSingleNode("/AEEvents/AEEvent/JudgmentDebtorPartyRoleCode").appendChild( eventDom.createTextNode(judgmentDebtorPartyRoleCode) );
	eventDom.selectSingleNode("/AEEvents/AEEvent/JudgmentDebtorCasePartyNumber").appendChild( eventDom.createTextNode(judgmentDebtorCasePartyNumber) );

	// Identify the eventDom root node <AEEvents> and take a copy of it
	var rootNode = XML.getRootNode(eventDom);
	// Identify the /ds/CalculatePER node in the business dom and take a copy of it
	var businessDataNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);	
	// Add the eventDom root node to the business data
	businessDataNode.appendChild(rootNode);
	// Return the business data node
	return businessDataNode;
}

/*********************************************************************************/

/**
 * Function handles the running of the AE PER Report. 
 * @author kznwpr
 * 
 */
function runAEPERReport()
{
	var AENumber = Services.getValue(Header_AENumber.dataBinding);
	var AEProcessing_Date = CaseManUtils.convertDateToPattern(CaseManUtils.createDate(getTodaysDate()), "DD-MMM-YYYY");
	var dom = Reports.createReportDom("CM_PER_R1.rdf");			
	Reports.setValue(dom, "P_AE_NUMBER",  AENumber );											
	Reports.setValue(dom, "P_AE_Processing_Date",  AEProcessing_Date);								
	Reports.runReport(dom);
}

/******************************* DATA BINDINGS *************************************/

Header_CaseNumber.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CaseNumber";
Header_AENumber.dataBinding			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/AENumber";
Header_ApplicationType.dataBinding	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/ApplicationType"; 
Header_PartyFor.dataBinding			= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PartyFor"; 
Header_PartyAgainst.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/PartyAgainst"; 

/******************************* HEADER PANEL **************************************/

function Header_CaseNumber() {};
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.isReadOnly = function() {return true;}
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";

/*********************************************************************************/

function Header_AENumber() {};
Header_AENumber.tabIndex = -1;
Header_AENumber.isReadOnly = function() {return true;}
Header_AENumber.helpText = "Attachment of earnings application number";

/*********************************************************************************/

function Header_ApplicationType() {};
Header_ApplicationType.tabIndex = -1;
Header_ApplicationType.isReadOnly = function() {return true;}
Header_ApplicationType.helpText = "Application type";

/*********************************************************************************/

function Header_PartyFor() {};
Header_PartyFor.tabIndex = -1;
Header_PartyFor.isReadOnly = function() {return true;}
Header_PartyFor.helpText = "Party the AE is in favour of";
Header_PartyFor.transformToDisplay = function(value)
{
	var partyType = Services.getValue(Header_PartyFor.dataBinding + "/Type");
	if (null != partyType) {partyType = partyType.toUpperCase();}
	var partyNumber = Services.getValue(Header_PartyFor.dataBinding + "/Number");
	var partyName = Services.getValue(Header_PartyFor.dataBinding + "/Name");
	return partyType + " " + partyNumber + " - " + partyName;
}

/*********************************************************************************/

function Header_PartyAgainst() {};
Header_PartyAgainst.tabIndex = -1;
Header_PartyAgainst.isReadOnly = function() {return true;}
Header_PartyAgainst.helpText = "Party the AE is against";
Header_PartyAgainst.transformToDisplay = function(value)
{
	var partyType = Services.getValue(Header_PartyAgainst.dataBinding + "/Type");
	if (null != partyType) {partyType = partyType.toUpperCase();}
	var partyNumber = Services.getValue(Header_PartyAgainst.dataBinding + "/Number");
	var partyName = Services.getValue(Header_PartyAgainst.dataBinding + "/Name");
	return partyType + " " + partyNumber + " - " + partyName;
}

/******************************* STATUS BUTTONS ************************************/

function Status_SaveBtn() {}
Status_SaveBtn.tabIndex = 70;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "calculatePER" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.actionBinding = function()
{
	// If there are no changes then quit
	if ( !changesMade() )
	{
		alert("Sorry, there are no changes to save.");
		return;
	}	

	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length ) 
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "false");
		return;
	}	

	if ( isTotalTooBig() )
	{
		// The max total has been exceeded so show a message and stop the save.
		alert(Messages.PER_MAX_TOTAL_EXCEEDED_MESSAGE);
		return;
	}
	
	if ( hasTotalAlreadyBeenSaved() )
	{
		// The user has already saved a total either from this screen or by directly entering
		// a total in the events screen so ask if the user wants to overwrite that total
		if ( confirm(Messages.PER_TOTAL_CHANGED_MESSAGE) )
		{
			// Copy the calculated total into the dom so that it gets persisted
			Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CalculatedRate", Services.getValue(Totals_Total.dataBinding));
		}
	}
	else
	{
		// This is the first time the user has saved from the calculator screen
		// so just copy the calculated total into the dom so that it gets persisted
		Services.setValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CalculatedRate", Services.getValue(Totals_Total.dataBinding));			
	}

	// Make service call...
	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	
	var calculatePerNode = null;
	// If the event 857 count = 0 then we need to generate the event
	if (Services.getValue(XPathConstants.EVENT_857_COUNT_XPATH) == 0)
	{
		// Identify the /ds/CalculatePER node with the event 857 data structure added to it
		calculatePerNode = getBusinessDataWithEvent857();
	}
	else
	{
		// Identify the /ds/CalculatePER node in the existing dom and take a copy of it
		calculatePerNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	}
	// Create the /ds node that will be added to the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	// Append the maintain obligations node to the ds node
	dsNode.appendChild(calculatePerNode);
	// Add the ds node, which now contains a copy of all the business data
	businessDataDOM.appendChild(dsNode);
	
	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("calculatePer", businessDataDOM);
	// Call the update service
	Services.callService(FormServices.UPDATE_PER_SERVICE, params, Status_SaveBtn, true);
}
	
/**
 * @param dom
 * @author kznwpr
 * 
 */
Status_SaveBtn.onSuccess = function(dom)
{
	var temp = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
	switch (temp)
	{
		case ActionAfterSave.ACTION_RUNPERREPORT:
			// Run the AE PER Report
			runAEPERReport();
			break;
		case ActionAfterSave.ACTION_EXIT:
			exitScreen();
			break;
		default:
			// Reload the saved data
			loadData();
			break;
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
	alert("The following exception was thrown from the server::\n" + exception);
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/*********************************************************************************/

function Status_CloseBtn() {}
Status_CloseBtn.tabIndex = 80;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "calculatePER" } ]
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
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveBtn.actionBinding();
	}
	else
	{
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
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
	loadData();
}		
