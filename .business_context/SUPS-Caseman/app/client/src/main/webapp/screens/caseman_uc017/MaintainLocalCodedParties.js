/** 
 * @fileoverview MaintainLocalCodedParties.js:
 * This file contains the configurations used for UC17 - Maintain Local 
 * Coded Parties screen.
 *
 * ISSUES: The remove button (Results_RemoveButton) will always be disabled as the RFC1297
 * change involving removal of Coded Parties will not be available for CaseMan Go Live Date.
 *
 * @author Chris Vincent
 * @version 0.1
 */

/******************************* MAIN FORM *****************************************/

function maintainLocalCodedParties() {}
/**
 * @author rzxd7g
 * 
 */
maintainLocalCodedParties.initialise = function()
{
	Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 0);
}

/********************************* SUBFORMS ****************************************/

function maintainLocalCodedParty_subform() {};
maintainLocalCodedParty_subform.subformName = "MaintainLocalCodedPartySubform";
/**
 * @author rzxd7g
 * @return "Status_CloseButton"  
 */
maintainLocalCodedParty_subform.nextFocusedAdaptorId = function() 
{
	return "Status_CloseButton";
}

maintainLocalCodedParty_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/CodedParty" } ];
/**
 * @author rzxd7g
 * 
 */
maintainLocalCodedParty_subform.processReturnedData = function() 
{
	retrieveSearchResults();
}

/********************************* GRIDS *******************************************/

function Results_ResultsGrid() {};
Results_ResultsGrid.tabIndex = 7;
Results_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedValues/PartyCode";
Results_ResultsGrid.srcData = XPathConstants.QUERY_XPATH + "/Results/CodedParties";
Results_ResultsGrid.rowXPath = "CodedParty";
Results_ResultsGrid.keyXPath = "Code";
Results_ResultsGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"},
	{xpath: "ContactDetails/Address/Line[1]"},
	{xpath: "ContactDetails/Address/Line[2]"},
	{xpath: "ContactDetails/Address/PostCode"}	
];

Results_ResultsGrid.enableOn = [Results_ResultsGrid.dataBinding];
Results_ResultsGrid.isEnabled = function()
{
	return isResultsGridEmpty() ? false : true;
}

/***************************** DATA BINDINGS ***************************************/

Header_PartyCode.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/PartyCode"; 
Header_PartyName.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/PartyName"; 
Header_AddressLine1.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/AddressLine1"; 
Header_AddressLine2.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/AddressLine2"; 
Header_Postcode.dataBinding = XPathConstants.QUERY_XPATH + "/SearchCriteria/Postcode";

/*************************** FIELD DEFINITIONS *************************************/

function Header_PartyCode() {}
Header_PartyCode.maxLength = 4;
Header_PartyCode.tabIndex = 1;
Header_PartyCode.helpText = "Unique four digit code identifier for Party";
Header_PartyCode.validateOn = [Header_PartyCode.dataBinding];
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

/***********************************************************************************/

function Header_PartyName() {}
Header_PartyName.maxLength = 70;
Header_PartyName.tabIndex = 2;
Header_PartyName.helpText = "Name of Party/solicitor/litigation dept etc";
Header_PartyName.transformToDisplay = toUpper;
Header_PartyName.transformToModel = toUpper;

/***********************************************************************************/

function Header_AddressLine1() {}
Header_AddressLine1.maxLength = 35;
Header_AddressLine1.tabIndex = 3;
Header_AddressLine1.helpText = "First line of Party's address";
Header_AddressLine1.transformToDisplay = toUpper;
Header_AddressLine1.transformToModel = toUpper;

/***********************************************************************************/

function Header_AddressLine2() {}
Header_AddressLine2.maxLength = 35;
Header_AddressLine2.tabIndex = 4;
Header_AddressLine2.helpText = "Second line of Party's address";
Header_AddressLine2.transformToDisplay = toUpper;
Header_AddressLine2.transformToModel = toUpper;

/***********************************************************************************/

function Header_Postcode() {}
Header_Postcode.maxLength = 8;
Header_Postcode.tabIndex = 5;
Header_Postcode.helpText = "Party's postcode";
Header_Postcode.transformToDisplay = toUpper;
Header_Postcode.transformToModel = toUpper;

/******************************** BUTTONS ******************************************/

function Header_Search() {}
Header_Search.tabIndex = 6;
Header_Search.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "maintainLocalCodedParties" } ]
	}
};

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
		Services.setValue(XPathConstants.SEARCH_PAGENUMBER_XPATH, 0);
		alert(Messages.NO_RESULTS_MESSAGE);
	}
}

/*********************************************************************************/

function Results_PreviousButton() {}
Results_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "maintainLocalCodedParties", alt: true } ]
	}
};
Results_PreviousButton.tabIndex = 8;
Results_PreviousButton.enableOn = [XPathConstants.SEARCH_PAGENUMBER_XPATH];
Results_PreviousButton.isEnabled = function(event)
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
		keys: [ { key: Key.CHAR_N, element: "maintainLocalCodedParties", alt: true } ]
	}
};
Results_NextButton.tabIndex = 9;
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
}

/***********************************************************************************/

function Results_AddButton() {}
Results_AddButton.tabIndex = 10;
Results_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "maintainLocalCodedParties" } ]
	}
};

Results_AddButton.isEnabled = function()
{
	// Add button disabled if the user does not have update access
	return Services.hasAccessToForm(maintainLocalCodedParty_subform.subformName);
}

/**
 * @author rzxd7g
 * 
 */
Results_AddButton.actionBinding = function()
{
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, PopupModes.MODE_CREATE);
	Services.dispatchEvent("maintainLocalCodedParty_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

/***********************************************************************************/

function Results_RemoveButton() {}
Results_RemoveButton.tabIndex = 11;
Results_RemoveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainLocalCodedParties", alt: true } ]
	}
};

Results_RemoveButton.enableOn = [Results_ResultsGrid.dataBinding];
Results_RemoveButton.isEnabled = function()
{
	// CPV (06/02/2006) Always Disabled as the removal of Coded Parties will not be available for
	// Go Live Date
	return false;

	/*
	var code = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( isNationalCodedParty(code) )
	{
		// Disabled if currently selected coded party is a National Coded Party
		return false;
	}

	// Disabled if the grid is empty
	return isResultsGridEmpty() ? false : true;
 */
}

/**
 * @author rzxd7g
 * 
 */
Results_RemoveButton.actionBinding = function()
{
	var code = Services.getValue(Results_ResultsGrid.dataBinding);
 	if( !CaseManUtils.isBlank(code) )
  	{
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
		var params = new ServiceParams();
    	params.addSimpleParameter("adminCourtCode", courtCode);
    	params.addSimpleParameter("codedPartyCode", code);
		Services.callService("getCodedPartyStats", params, Results_RemoveButton, false);
    }
}

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
Results_RemoveButton.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "getCodedPartyStats" )
	{
		// Handle check on Coded Party after request for delete
		Services.replaceNode(XPathConstants.DELETE_PARTYDATA_XPATH, dom);
   		var caseCount = Services.getValue(XPathConstants.DELETE_PARTYDATA_XPATH + "/CodedParty/CaseCount");
   		if ( parseInt(caseCount) > 0 )
 		{
 			// Cannot delete coded party, is being used on a case
 			alert( Messages.DEL_USED_CODEDPARTY_MESSAGE );
 		}
 		else
		{
			// Ok to delete, ask user to confirm removal
			if( confirm(Messages.DELETE_LOCALCODE_MESSAGE) )
			{
		    	var params = new ServiceParams();
				params.addDOMParameter("codedPartyCode", dom);
				Services.callService("deleteCodedParty", params, Results_RemoveButton, false);
			}
 		}
	}
	else if ( serviceName == "deleteCodedParty" )
	{
		// Handle return from successful deletion
		retrieveSearchResults();
	}
}

/***********************************************************************************/

function Results_UpdateButton() {}
Results_UpdateButton.tabIndex = 12;
Results_UpdateButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "Results_ResultsGrid"} ]
	}
};

Results_UpdateButton.enableOn = [Results_ResultsGrid.dataBinding];
Results_UpdateButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainLocalCodedParty_subform.subformName) )
	{
		// Update button disabled if the user does not have update access
		return false;
	}

	var code = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( isNationalCodedParty(code) )
	{
		// Disabled if currently selected coded party is a National Coded Party
		return false;
	}

	// Disabled if the grid is empty
	return isResultsGridEmpty() ? false : true;
}

/**
 * @author rzxd7g
 * 
 */
Results_UpdateButton.actionBinding = function()
{
	var code = Services.getValue(Results_ResultsGrid.dataBinding);
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_CODE_XPATH, code);
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, PopupModes.MODE_MODIFY);
	Services.setValue(XPathConstants.SUBFORM_COURTCODE_XPATH, courtCode);
	Services.endTransaction();
	Services.dispatchEvent("maintainLocalCodedParty_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

/***********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 20;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "maintainLocalCodedParties", alt: true } ]
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

/***********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 21;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainLocalCodedParties" } ]
	}
};
