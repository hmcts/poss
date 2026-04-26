/** 
 * @fileoverview COCalculateProtectedEarningsRate.js:
 * This file conains the form and field configurations for the UC115 - 
 * CO calculate protected earnings rate screen.
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
FormServices.GET_PER_SERVICE = "getCoPer";
FormServices.UPDATE_PER_SERVICE = "updateCoPer";

/******************************* FORM ELEMENT **************************************/

function calculatePER() {}

// Load the reference data into the model
calculatePER.refDataServices = [
	{name:"CalculatedPeriods", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCalculatedPeriods", serviceParams:[]},
	{name:"StandardAllowances", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPerAllowanceCodes", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},		
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[]}
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
	if( null != data )
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
	if (!Services.hasValue(PERCalculatorParams.CO_NUMBER))
	{
		alert("No CO number supplied so not calling any services.");
		return;
	}
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", Services.getValue(PERCalculatorParams.CO_NUMBER));
	Services.callService(FormServices.GET_PER_SERVICE, params, calculatePER, true);					
	
	// Display the first tab page
	Services.setValue(myTabSelector.dataBinding, "firstPage");
}

/*********************************************************************************/

/**
 * This function is called the first time the user saves the PER data. 
 * It inserts a COEvents branch into the dom that is sent to the server.
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
	eventDom.selectSingleNode("/COEvents/COEvent/CONumber").appendChild(eventDom.createTextNode(Services.getValue(Header_CONumber.dataBinding)));
	eventDom.selectSingleNode("/COEvents/COEvent/EventDate").appendChild(eventDom.createTextNode(getTodaysDate()));	
	eventDom.selectSingleNode("/COEvents/COEvent/UserName").appendChild(eventDom.createTextNode(Services.getCurrentUser()));		
	eventDom.selectSingleNode("/COEvents/COEvent/ReceiptDate").appendChild(eventDom.createTextNode(getTodaysDate()));		
	
	// Identify the eventDom root node <COEvents> and take a copy of it
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
 * Function handles the running of the CO PER Report. 
 * @author kznwpr
 * 
 */
function runCOPERReport()
{
	var CONumber = Services.getValue(Header_CONumber.dataBinding);
	var COProcessing_Date = CaseManUtils.convertDateToPattern(CaseManUtils.createDate(getTodaysDate()), "DD-MMM-YYYY");
	var dom = Reports.createReportDom("CM_PER_R2.rdf");			
	Reports.setValue(dom, "P_CO_NUMBER",  CONumber );											
	Reports.setValue(dom, "P_CO_Processing_Date",  COProcessing_Date);								
	Reports.runReport(dom);	
}

/******************************* DATA BINDINGS *************************************/

Header_CONumber.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CONumber";
Header_COType.dataBinding		= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/COType"; 
Header_DebtorName.dataBinding	= XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DebtorName"; 

/******************************* HEADER PANEL **************************************/

function Header_CONumber() {};
Header_CONumber.tabIndex = -1;
Header_CONumber.isReadOnly = function() {return true;}
Header_CONumber.helpText = "Consolidated order number";

/*********************************************************************************/

function Header_COType() {};
Header_COType.tabIndex = -1;
Header_COType.isReadOnly = function() {return true;}
Header_COType.helpText = "Consolidated order type";

/*********************************************************************************/

function Header_DebtorName() {};
Header_DebtorName.tabIndex = -1;
Header_DebtorName.isReadOnly = function() {return true;}
Header_DebtorName.helpText = "The debtor's name";

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
		if (confirm(Messages.PER_TOTAL_CHANGED_MESSAGE))
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
 * @param serviceName
 * @author kznwpr
 * 
 */
Status_SaveBtn.onSuccess = function(dom, serviceName)
{
	var temp = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
	switch (temp)
	{
		case ActionAfterSave.ACTION_RUNPERREPORT:
			// Run the CO PER Report
			runCOPERReport();
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

function Progress_Bar() {};
Progress_Bar.tabIndex = -1;
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
