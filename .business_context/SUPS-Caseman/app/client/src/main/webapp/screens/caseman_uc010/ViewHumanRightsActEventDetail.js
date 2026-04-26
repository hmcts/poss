/** 
 * @fileoverview ViewHumanRightsActEventDetail.js:
 * This file contains the form and field configurations for the UC010 - View HRA Details screen. 
 *
 * @author Dave Turner, Tun Shwe, Chris Vincent
 * @version 0.1
 * 
 * Change History - 
 * 12/01/2007 - Chris Vincent, added hint text to all the permanently read only fields as previously were
 * 				missing.  Temp_CaseMan 324.
 */

/**
 * XPath Constants
 * @author qz8rkl
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.DATA_XPATH = "/ds/HumanRightsAct";
XPathConstants.SEARCH_RESULTS_XPATH = XPathConstants.VAR_FORM_XPATH + "/HumanRightsAct/Cases";
XPathConstants.HRA_XPATH = XPathConstants.DATA_XPATH + "/Case"; 

/****************************** MAIN FORM *****************************************/

function HumanRightsAct() {};

/**
 * @author qz8rkl
 * 
 */
HumanRightsAct.initialise = function()
{
	var extCaseNumber = Services.getValue(HumanRightsActParams.CASE_NUMBER);
	if( !CaseManUtils.isBlank(extCaseNumber) ) 
	{
		// An external Case Number has been passed into the screen
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber",  extCaseNumber);
		Services.callService("getSingleHRADetails", params, HumanRightsAct, true);  
	} 
}

/**
 * @param resultDom
 * @author qz8rkl
 * 
 */
HumanRightsAct.onSuccess = function (resultDom)
{
    Services.startTransaction();
    
	// Add the new data into the DOM
    var addDOM = resultDom.selectSingleNode(XPathConstants.DATA_XPATH + "/Cases");
    Services.replaceNode(XPathConstants.SEARCH_RESULTS_XPATH, addDOM);
    
    // Check how many results have been returned
    var count = Services.countNodes(XPathConstants.SEARCH_RESULTS_XPATH + "/Case");
    if( count == 0 ) 
    {
        alert(Messages.NO_RESULTS_MESSAGE); 
    } 
    else if( count == 1 ) 
    {
        // There is a single result, so display it
        Services.replaceNode(XPathConstants.HRA_XPATH, Services.getNode(XPathConstants.SEARCH_RESULTS_XPATH + "/Case"));
    } 
    else 
    {
    	// Multiple results, display the Search Results Popup (LOV)
        Services.dispatchEvent("SearchResultsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
    }
    Services.endTransaction();
}

/************************** HELPER FUNCTIONS **************************************/

/**
 * Function validates the start date and end date entered in the header panel
 *
 * @return [ErrorCode] The appropriate error code if fails validation, else null
 * @author qz8rkl
 */
function validateDates()
{
	var errorMsg = null;
	var startDate = Services.getValue(Header_StartDateTxt.dataBinding);
	var endDate = Services.getValue(Header_EndDateTxt.dataBinding);
  
	if ( CaseManUtils.isBlank(startDate) )
	{
		startDate = "1900-01-01";
	}
  	if ( CaseManUtils.isBlank(endDate) )
  	{
    	endDate = "2999-01-01";
  	}

	var firstDate = CaseManUtils.createDate(startDate);
	var secondDate = CaseManUtils.createDate(endDate);
	if ( null != firstDate && null != secondDate )
	{
  		var result = CaseManUtils.compareDates(firstDate, secondDate);
  		if (result < 0)
  		{
    		// Start Date after End Date
    		errorMsg = ErrorCode.getErrorCode("CaseMan_startDateCannotBeLaterThanEndDate_Msg");
  		}
	}

	return errorMsg;
}

/**********************************************************************************/

/**
 * Function handles exiting the screen and returning to the previous screen
 * @author qz8rkl
 * 
 */
function exitScreen()
{
	Services.removeNode(HumanRightsActParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/******************************* LOV SUBFORMS *************************************/

function SearchResultsLOVGrid() {};
SearchResultsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedHRA";
SearchResultsLOVGrid.srcData = XPathConstants.SEARCH_RESULTS_XPATH;
SearchResultsLOVGrid.rowXPath = "Case";
SearchResultsLOVGrid.keyXPath = "EventSequence";
SearchResultsLOVGrid.columns = [
	{xpath: "CaseNumber"},
	{xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "PartyName"},
	{xpath: "ApplicationDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay}
];

SearchResultsLOVGrid.styleURL = "/css/SearchResultsLOVGrid.css";
SearchResultsLOVGrid.destroyOnClose = false;
SearchResultsLOVGrid.logicOn = [SearchResultsLOVGrid.dataBinding];
SearchResultsLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(SearchResultsLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var selectedRecord = Services.getValue(SearchResultsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(selectedRecord) )
	{
		var dataNode = Services.getNode(XPathConstants.SEARCH_RESULTS_XPATH + "/Case[./EventSequence='" + selectedRecord + "']");
        Services.replaceNode(XPathConstants.HRA_XPATH, dataNode);
		Services.setValue(SearchResultsLOVGrid.dataBinding, "");
	}
}

/**
 * @author qz8rkl
 * @return "Parties_ResultsGrid"  
 */
SearchResultsLOVGrid.nextFocusedAdaptorId = function() {
	return "Parties_ResultsGrid";
}

/********************************** GRIDS *****************************************/

function Parties_ResultsGrid() {};
Parties_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/selectedgridrow/selectedparty";
Parties_ResultsGrid.tabIndex = 4;
Parties_ResultsGrid.srcDataOn = [XPathConstants.HRA_XPATH];
Parties_ResultsGrid.srcData = XPathConstants.HRA_XPATH + "/Parties";
Parties_ResultsGrid.rowXPath = "Party";
Parties_ResultsGrid.keyXPath = "PartyId";
Parties_ResultsGrid.columns = [	
  {xpath: "../../CaseNumber", additionalSortColumns: [ { columnNumber: 2, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending"}, 
  {xpath: "Name"}, 
  {xpath: "Number", sort: "numerical"}, 
  {xpath: "Role"}
];

/**********************************************************************************/

function Article_ResultsGrid() {};
Article_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/selectedgridrow/selectedarticle";
Article_ResultsGrid.tabIndex = 10;
Article_ResultsGrid.srcDataOn = [XPathConstants.HRA_XPATH];
Article_ResultsGrid.srcData = XPathConstants.HRA_XPATH + "/Articles";	
Article_ResultsGrid.rowXPath = "Article";					
Article_ResultsGrid.keyXPath = "Number";                    		
Article_ResultsGrid.columns = [										
	{xpath: "Number"},
	{xpath: "Description"}
];

/**********************************************************************************/

function Protocol_ResultsGrid() {};
Protocol_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/selectedgridrow/selectedprotocol";
Protocol_ResultsGrid.tabIndex = 11;
Protocol_ResultsGrid.srcDataOn = [XPathConstants.HRA_XPATH];
Protocol_ResultsGrid.srcData = XPathConstants.HRA_XPATH + "/Protocols";
Protocol_ResultsGrid.rowXPath = "Protocol";					
Protocol_ResultsGrid.keyXPath = "ProtocolNumber";                    		
Protocol_ResultsGrid.columns = [										
	{xpath: "Number"},
	{xpath: "Description"}
];

/****************************** DATA BINDINGS **************************************/

Header_StartDateTxt.dataBinding = 		 XPathConstants.VAR_PAGE_XPATH + "/SearchParams/StartDate";
Header_EndDateTxt.dataBinding =			 XPathConstants.VAR_PAGE_XPATH + "/SearchParams/EndDate";

Master_EventDateTxt.dataBinding =		 XPathConstants.HRA_XPATH + "/EventDate";
Master_UserNameTxt.dataBinding = 		 XPathConstants.HRA_XPATH + "/UserID";
Master_ApplicationDateTxt.dataBinding =	 XPathConstants.HRA_XPATH + "/ApplicationDate";
Master_ApplicationJudgeTxt.dataBinding = XPathConstants.HRA_XPATH + "/ApplicationJudge";
Master_OutcomeTxt.dataBinding =			 XPathConstants.HRA_XPATH + "/Outcome";
Master_ErrorChk.dataBinding =			 XPathConstants.HRA_XPATH + "/DeletedFlag";
Master_PartyTxt.dataBinding =			 XPathConstants.HRA_XPATH + "/PartyType";
Master_PartyNameTxt.dataBinding =		 XPathConstants.HRA_XPATH + "/PartyName";

/********************************* FIELDS ******************************************/

function Header_StartDateTxt() {};
Header_StartDateTxt.tabIndex = 1;
Header_StartDateTxt.helpText = "This will default to '01-JAN-1900'";
Header_StartDateTxt.enableOn = [HumanRightsActParams.CASE_NUMBER];
Header_StartDateTxt.isEnabled = function()
{
	var extCaseNumber = Services.getValue(HumanRightsActParams.CASE_NUMBER);
	return CaseManUtils.isBlank(extCaseNumber) ? true : false;
}

/**********************************************************************************/

function Header_EndDateTxt() {};
Header_EndDateTxt.tabIndex = 2;
Header_EndDateTxt.helpText = "This will default to '01-JAN-2999'";
Header_EndDateTxt.enableOn = [HumanRightsActParams.CASE_NUMBER];
Header_EndDateTxt.isEnabled = function()
{
	var extCaseNumber = Services.getValue(HumanRightsActParams.CASE_NUMBER);
	return CaseManUtils.isBlank(extCaseNumber) ? true : false;
}

/**********************************************************************************/

function Master_EventDateTxt() {};
Master_EventDateTxt.tabIndex = -1;
Master_EventDateTxt.helpText = "The date the event 181 was created";
Master_EventDateTxt.isReadOnly = function() { return true; }
Master_EventDateTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_UserNameTxt() {};
Master_UserNameTxt.tabIndex = -1;
Master_UserNameTxt.helpText = "The username of the user who created the event 181";
Master_UserNameTxt.isReadOnly = function() { return true; }
Master_UserNameTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_ApplicationDateTxt() {};
Master_ApplicationDateTxt.tabIndex = -1;
Master_ApplicationDateTxt.helpText = "The date of application for the Human Rights Act record";
Master_ApplicationDateTxt.isReadOnly = function() { return true; }
Master_ApplicationDateTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_ApplicationJudgeTxt() {};
Master_ApplicationJudgeTxt.tabIndex = -1;
Master_ApplicationJudgeTxt.helpText = "The name of the judge associated with the application";
Master_ApplicationJudgeTxt.isReadOnly = function() { return true; }
Master_ApplicationJudgeTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_OutcomeTxt() {};
Master_OutcomeTxt.tabIndex = -1;
Master_OutcomeTxt.helpText = "The outcome of the application";
Master_OutcomeTxt.isReadOnly = function() { return true; }
Master_OutcomeTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_ErrorChk() {};
Master_ErrorChk.tabIndex = -1;
Master_ErrorChk.helpText = "Indicates if the application has been marked in error";
Master_ErrorChk.isReadOnly = function() { return true; }
Master_ErrorChk.retrieveOn = [XPathConstants.HRA_XPATH];
Master_ErrorChk.modelValue = { checked: 'Y', unchecked: 'N' };

/**********************************************************************************/

function Master_PartyTxt() {};
Master_PartyTxt.tabIndex = -1;
Master_PartyTxt.helpText = "Party type of the party who created the application";
Master_PartyTxt.isReadOnly = function() { return true; }
Master_PartyTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/**********************************************************************************/

function Master_PartyNameTxt() {};
Master_PartyNameTxt.tabIndex = -1;
Master_PartyNameTxt.helpText = "The name of the party who created the application";
Master_PartyNameTxt.isReadOnly = function(){ return true; }
Master_PartyNameTxt.retrieveOn = [XPathConstants.HRA_XPATH];

/******************************** BUTTONS *****************************************/

function Header_SearchBtn() {};
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "HumanRightsAct" } ]
	}
};
Header_SearchBtn.tabIndex = 3;
Header_SearchBtn.enableOn = [Header_StartDateTxt.dataBinding, Header_EndDateTxt.dataBinding];
Header_SearchBtn.isEnabled = function()
{
	var extCaseNumber = Services.getValue(HumanRightsActParams.CASE_NUMBER);
	if( CaseManUtils.isBlank(extCaseNumber) ) 
	{
		var validateDatesMessage = validateDates();
		if ( !CaseManUtils.isBlank(validateDatesMessage) )
		{
    		Services.setTransientStatusBarMessage( validateDatesMessage.getMessage() );
    		return false;
		}
		return true;
	}
	return false;
}

/**
 * @author qz8rkl
 * 
 */
Header_SearchBtn.actionBinding = function ()
{
	var startDate = Services.getValue(Header_StartDateTxt.dataBinding);
	var endDate = Services.getValue(Header_EndDateTxt.dataBinding);
  	if ( CaseManUtils.isBlank(startDate) )
	{
		startDate = "1900-01-01";
    	Services.setValue(Header_StartDateTxt.dataBinding, startDate);
	}
  	if ( CaseManUtils.isBlank(endDate) )
  	{
    	endDate = "2999-01-01";
    	Services.setValue(Header_EndDateTxt.dataBinding, endDate);
  	}
  	
	// Retrieve Human Rights data that match the start and end dates entered
	var params = new ServiceParams();
	params.addSimpleParameter("StartDate", startDate);
	params.addSimpleParameter("EndDate", endDate);
	Services.callService("getMultipleHRADetails", params, HumanRightsAct, true);
}

/***********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.tabIndex = 20;
Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "HumanRightsAct" } ]
	}
};
