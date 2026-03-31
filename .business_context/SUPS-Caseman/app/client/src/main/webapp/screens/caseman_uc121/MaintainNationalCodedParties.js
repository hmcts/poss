/** 
 * @fileoverview MaintainNationalCodedParties.js:
 * This file contains the form and field configurations for the  
 * UC121 - Maintain National Coded Parties Screen.
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 25/11/2006 - Chris Vincent, when retrieve search results, set focus on the grid except when no matching
 * 				records are found, then set focus on first query field.  UCT Defect 714.
 * 15/01/2007 - Chris Vincent, Group2 Defect 2576, searches should require the user to enter at least one
 * 				search criteria so Header_Search.isEnabled() introduced.  Also made changes to the 
 * 				maintainNationalCodedParty_subform.processReturnedData() for action when save.
 */

/****************************** MAIN FORM *****************************************/

function maintainNationalCodedParties() {}
/**
 * @author rzxd7g
 * 
 */
maintainNationalCodedParties.initialise = function()
{
	Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 0);
}

/********************************* SUBFORMS ****************************************/

function maintainNationalCodedParty_subform() {};
maintainNationalCodedParty_subform.subformName = "MaintainNationalCodedPartySubform";
/**
 * @author rzxd7g
 * @return "Status_CloseButton"  
 */
maintainNationalCodedParty_subform.nextFocusedAdaptorId = function() 
{
	return "Status_CloseButton";
}

maintainNationalCodedParty_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/CodedParty" } ];
/**
 * @author rzxd7g
 * 
 */
maintainNationalCodedParty_subform.processReturnedData = function() 
{
	var code = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/PartyCode");
	var partyName = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/PartyName");
	var addressLine1 = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/AddressLine1");
	var addressLine2 = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/AddressLine2");
	var addressPostcode = Services.getValue(XPathConstants.SEARCH_TEMPQUERY_XPATH + "/Postcode");
	if ( !CaseManUtils.isBlank(code) || !CaseManUtils.isBlank(partyName) || !CaseManUtils.isBlank(addressLine1) ||
		 !CaseManUtils.isBlank(addressLine2) || !CaseManUtils.isBlank(addressPostcode) )
	{
		// Group2 Defect 2576 - Only search if the user has specified at least one search criteria.
		retrieveSearchResults();
	}
}

/******************************** GRIDS *******************************************/

function Results_ResultsGrid() {};
Results_ResultsGrid.tabIndex = 10;
Results_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedValues/PartyCode";
Results_ResultsGrid.srcData = XPathConstants.QUERY_XPATH + "/Results/CodedParties";
Results_ResultsGrid.rowXPath = "CodedParty";
Results_ResultsGrid.keyXPath = "Code";
Results_ResultsGrid.columns = [
	{xpath: "Code", sort: "numerical",defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"},
	{xpath: "Line[1]"},
	{xpath: "Line[2]"},
	{xpath: "PostCode"}	
];

Results_ResultsGrid.enableOn = [Results_ResultsGrid.dataBinding];
Results_ResultsGrid.isEnabled = function()
{
	return isResultsGridEmpty() ? false : true;
}

/**************************** DATA BINDINGS ***************************************/

Header_PartyCode.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/PartyCode"; 
Header_PartyName.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/PartyName"; 
Header_AddressLine1.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/AddressLine1"; 
Header_AddressLine2.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/AddressLine2"; 
Header_Postcode.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/Postcode"; 

/**************************** INPUT FIELDS ****************************************/

function Header_PartyCode() {}
Header_PartyCode.tabIndex = 1;
Header_PartyCode.maxLength = 4;
Header_PartyCode.helpText = "Unique four digit code identifier for Party";
Header_PartyCode.validateOn = [Header_PartyCode.dataBinding ];
Header_PartyCode.validate = function()
{
	var code = Services.getValue(Header_PartyCode.dataBinding);
	if( !CaseManUtils.isBlank(code) )
	{
    	if( CaseManValidationHelper.validateNumber(code) == false )
    	{
    		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
    	}
 	}
 	return null;
}  

/*********************************************************************************/

function Header_PartyName() {}
Header_PartyName.maxLength = 70;
Header_PartyName.tabIndex = 2;
Header_PartyName.helpText = "Name of Party/name of solicitor/litigation dept etc";
Header_PartyName.transformToDisplay = toUpper;
Header_PartyName.transformToModel = toUpper;

/*********************************************************************************/

function Header_AddressLine1() {}
Header_AddressLine1.maxLength = 35;
Header_AddressLine1.tabIndex = 3;
Header_AddressLine1.helpText = "First line of Party's address";
Header_AddressLine1.transformToDisplay = toUpper;
Header_AddressLine1.transformToModel = toUpper;

/*********************************************************************************/

function Header_AddressLine2() {}
Header_AddressLine2.maxLength = 35;
Header_AddressLine2.tabIndex = 4;
Header_AddressLine2.transformToDisplay = toUpper;
Header_AddressLine2.transformToModel = toUpper;
Header_AddressLine2.helpText = "Second line of Party's address";

/*********************************************************************************/

function Header_Postcode() {}
Header_Postcode.maxLength = 8;
Header_Postcode.tabIndex = 5;
Header_Postcode.helpText = "Party's postcode";
Header_Postcode.transformToDisplay = toUpper;
Header_Postcode.transformToModel = toUpper;

/******************************* BUTTONS ******************************************/

function Header_Search() {}
Header_Search.tabIndex = 6;
Header_Search.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "maintainNationalCodedParties" } ]
	}
};

Header_Search.enableOn = [Header_PartyCode.dataBinding,Header_PartyName.dataBinding,Header_AddressLine1.dataBinding,Header_AddressLine2.dataBinding,Header_Postcode.dataBinding];
Header_Search.isEnabled = function()
{
	// Group2 defect 2576, user must enter at least one search criteria before searching.
	var buttonEnabled = false;
	for ( var i=0, l=Header_Search.enableOn.length; i<l; i++ )
	{
		var tempValue = Services.getValue(Header_Search.enableOn[i]);
		if ( !CaseManUtils.isBlank(tempValue) )
		{
			buttonEnabled = true;
			break;
		}
	}

	// Check to see if the Code field is valid.	
	if ( buttonEnabled == true && null != Header_PartyCode.validate() )
	{
		buttonEnabled = false;
	}
	
	return buttonEnabled;
}

/**
 * @author rzxd7g
 * 
 */
Header_Search.actionBinding = function()
{
	// When click Search, set the page number to be 1
	Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 1);

	// Copy the search criteria to a temporary area of the DOM
	var queryNode = Services.getNode(XPathConstants.QUERY_XPATH + "/SearchCriteria");
	Services.replaceNode(XPathConstants.SEARCH_TEMPQUERY_XPATH, queryNode);
	
	// Retrieve the search results
	retrieveSearchResults();
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Header_Search.onSuccess = function(dom)
{
    Services.replaceNode(Results_ResultsGrid.srcData, dom);
	var countResults = Services.countNodes(XPathConstants.QUERY_XPATH + "/Results/CodedParties/CodedParty");
	if ( countResults == 0 )
	{
		// No results, warn user and reset focus on the first query field
		Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 0);
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setFocus("Header_PartyCode");
	}
	else
	{
		// Matching records, set focus on grid (UCT Defect 714)
		Services.setFocus("Results_ResultsGrid");
	}
}

/*********************************************************************************/

function Results_PreviousButton() {}
Results_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "maintainNationalCodedParties", alt: true } ]
	}
};
Results_PreviousButton.tabIndex = 11;
Results_PreviousButton.enableOn = [XPathConstants.SEARCH_PAGENUMBER_XPATH];
Results_PreviousButton.isEnabled = function()
{
	// Disable Previous button if on first page
	var pageNumber = parseInt( Services.getValue(XPathConstants.SEARCH_PAGENUMBER_XPATH) );
	if ( pageNumber == 0 || pageNumber == 1 )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Results_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.SEARCH_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.SEARCH_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Retrieve the search results
	retrieveSearchResults();
}

/**********************************************************************************/

function Results_NextButton() {}
Results_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "maintainNationalCodedParties", alt: true } ]
	}
};
Results_NextButton.tabIndex = 12;
Results_NextButton.enableOn = [Results_ResultsGrid.srcData];
Results_NextButton.isEnabled = function()
{
	var countRecords = Services.countNodes( Results_ResultsGrid.srcData + "/" + Results_ResultsGrid.rowXPath );
	if ( countRecords == CaseManFormParameters.DEFAULT_PAGE_SIZE )
	{
		return true;
	}
	return false;
}

/**
 * @author rzxd7g
 * 
 */
Results_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.SEARCH_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.SEARCH_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Retrieve the search results
	retrieveSearchResults(true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Results_NextButton.onSuccess = function(dom)
{
    Services.replaceNode(Results_ResultsGrid.srcData, dom);
    // Set focus on grid (UCT Defect 714)
    Services.setFocus("Results_ResultsGrid");
}

/*********************************************************************************/

function Results_AddButton() {}
Results_AddButton.tabIndex = 13;
Results_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "maintainNationalCodedParties" } ]
	}
};

Results_AddButton.isEnabled = function()
{
	// Add button disabled if the user does not have update access
	return Services.hasAccessToForm(maintainNationalCodedParty_subform.subformName);
}

/**
 * @author rzxd7g
 * 
 */
Results_AddButton.actionBinding = function()
{
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_CREATE);
	Services.dispatchEvent("maintainNationalCodedParty_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function Results_UpdateButton() {}
Results_UpdateButton.tabIndex = 14;
Results_UpdateButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "Results_ResultsGrid"} ]
	}
};

Results_UpdateButton.enableOn = [Results_ResultsGrid.dataBinding];
Results_UpdateButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainNationalCodedParty_subform.subformName) )
	{
		// Update button disabled if the user does not have update access
		return false;
	}
	return isResultsGridEmpty() ? false : true;
}

/**
 * @author rzxd7g
 * 
 */
Results_UpdateButton.actionBinding = function()
{
	var code = Services.getValue(Results_ResultsGrid.dataBinding);
	var courtCode = isNonCPCCodedParty(code) ? CaseManUtils.GLOBAL_COURT_CODE : CaseManUtils.CCBC_COURT_CODE;
	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_CODE_XPATH, code);
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_MODIFY);
	Services.setValue(XPathConstants.SUBFORM_COURTCODE_XPATH, courtCode);
	Services.endTransaction();
	Services.dispatchEvent("maintainNationalCodedParty_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

/*********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 20;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "maintainNationalCodedParties", alt: true } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.QUERY_XPATH);
	Services.removeNode(XPathConstants.SEARCH_TEMPQUERY_XPATH);
	Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 0);
	Services.endTransaction();
	Services.setFocus("Header_PartyCode");
};

/*********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 21;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainNationalCodedParties" } ]
	}
};
