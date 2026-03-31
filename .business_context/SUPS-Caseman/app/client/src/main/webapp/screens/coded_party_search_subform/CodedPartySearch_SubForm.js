/** 
 * @fileoverview CodedPartySearch_SubForm.js:
 * This file contains the configurations for the Coded Party Search Subform
 *
 * @author Chris Vincent
 * 
 * Change History:
 * 10/10/2006 - CPV, updated CodedPartySearch_PreviousButton.isEnabled so is disabled
 * 				if the page number is 0 (value set when no results found) to fix DMST
 * 				defect 669.
 */
 
/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.CPSEARCH_DATA_XPATH = "/ds/var/form/CodedPartySearchData";
XPathConstants.DATA_XPATH = "/ds/CodedPartyData";
XPathConstants.CODED_PARTIES_SRC_XPATH = XPathConstants.DATA_XPATH + "/CodedParties";
XPathConstants.CPSEARCH_PAGENUMBER_XPATH = XPathConstants.DATA_XPATH + "/PageNumber";
XPathConstants.TEMP_SEARCHCRITERIA_XPATH = "/ds/var/page/TempSearchResults/SearchCriteria";
XPathConstants.SELECTED_CP_XPATH = "/ds/var/page/SelectedGridRow/SelectedCodedPartyCode";

/**************************** HELPER FUNCTIONS **************************************/

/**
 * Function handles the call to the get coded parties service.
 * 
 * @param blnNextButton [Boolean] If true, request has come from the Next button which 
 * 		  should be handled differently.
 * @author rzxd7g
 * 
 */
function loadCodedPartyData(blnNextButton)
{
	var pageNumber = Services.getValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH);
	var partyName = Services.getValue(XPathConstants.TEMP_SEARCHCRITERIA_XPATH + "/PartyName");
	partyName = ( CaseManUtils.isBlank(partyName) ) ? "" : "%" + partyName + "%";
	
	var adminCourtCode = Services.getValue(CodedPartySearchParams.ADMIN_COURT_CODE);

	var params = new ServiceParams();
	params.addSimpleParameter("adminCourtCode", adminCourtCode );
	params.addSimpleParameter("partyName", partyName );
	params.addSimpleParameter("pageNumber", pageNumber );
	params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
	
	var serviceName = Services.getValue(CodedPartySearchParams.RETRIEVAL_SERVICE);
	if ( CaseManUtils.isBlank(serviceName) )
	{
		// If no serviceName specified by calling screen, assume court only.
		serviceName = CodedPartySearchParamsConstants.COURTONLY;
	}
	
	// Use a different onSuccess handler for the Next button
	if ( blnNextButton )
	{
		Services.callService(serviceName, params, CodedPartySearch_NextButton, true);
	}
	else
	{
    	Services.callService(serviceName, params, codedPartySearchSubform, true);
    }
}

/************************** FORM CONFIGURATIONS *************************************/

function codedPartySearchSubform() {}

/**
 * @author rzxd7g
 * 
 */
codedPartySearchSubform.initialise = function()
{
	Services.setValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH, 1);
}

codedPartySearchSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "CodedPartyDOM.xml",
	dataBinding: XPathConstants.DATA_XPATH
}

codedPartySearchSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "CodedPartyDOM.xml",
	dataBinding: XPathConstants.DATA_XPATH
}

codedPartySearchSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "codedPartySearchSubform" } ],
					singleClicks: [ {element: "CodedPartySearch_CancelButton"} ]
				  },
	raiseWarningIfDOMDirty: false
}

codedPartySearchSubform.submitLifeCycle = 
{
	eventBinding: { singleClicks: [ { element: "CodedPartySearch_OkButton"} ],
                    doubleClicks: [ { element: "CodedPartySearch_ResultsGrid"} ]
                  },

    modify: {},
	returnSourceNodes: [XPathConstants.SELECTED_CP_XPATH],
	postSubmitAction: {
		close: {}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
codedPartySearchSubform.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.CODED_PARTIES_SRC_XPATH, dom);
	var countResults = Services.countNodes(CodedPartySearch_ResultsGrid.srcData + "/" + CodedPartySearch_ResultsGrid.rowXPath);
	if ( countResults == 0 )
	{
		Services.setValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH, 0);
		alert(Messages.NO_RESULTS_MESSAGE);
	}
	Services.setFocus("CodedPartySearch_ResultsGrid");
}

/********************************* GRIDS *******************************************/

/**
 * Coded Party Search Results Grid
 * @author rzxd7g
 * 
 */
function CodedPartySearch_ResultsGrid() {};

/**
 * @param code
 * @author rzxd7g
 * @return line1 + ", " + line2  
 */
CodedPartySearch_ResultsGrid.concatenateAddressLines = function(code)
{
	var rootXPath = CodedPartySearch_ResultsGrid.srcData + "/" + CodedPartySearch_ResultsGrid.rowXPath + "[./Code = " + code + "]";
	var line1 = Services.getValue(rootXPath + "/Line[1]");
	var line2 = Services.getValue(rootXPath + "/Line[2]");
	return line1 + ", " + line2;
}

CodedPartySearch_ResultsGrid.dataBinding = XPathConstants.SELECTED_CP_XPATH;
CodedPartySearch_ResultsGrid.tabIndex = 10;
CodedPartySearch_ResultsGrid.srcData = XPathConstants.CODED_PARTIES_SRC_XPATH;
CodedPartySearch_ResultsGrid.rowXPath = "CodedParty";
CodedPartySearch_ResultsGrid.keyXPath = "Code";
CodedPartySearch_ResultsGrid.columns = [
	{ xpath: "Code", sort: "numerical" },
	{ xpath: "Name" },
	{ xpath: "Code", transformToDisplay: CodedPartySearch_ResultsGrid.concatenateAddressLines }
];

CodedPartySearch_ResultsGrid.enableOn = [CodedPartySearch_ResultsGrid.dataBinding];
CodedPartySearch_ResultsGrid.isEnabled = function()
{
	var countResults = Services.countNodes(CodedPartySearch_ResultsGrid.srcData + "/" + CodedPartySearch_ResultsGrid.rowXPath);
	return ( countResults == 0 ) ? false : true;
}

/****************************** INPUT FIELDS ***************************************/

function CodedPartySearch_Name() {};
CodedPartySearch_Name.dataBinding = XPathConstants.DATA_XPATH + "/SearchCriteria/PartyName";
CodedPartySearch_Name.tabIndex = 1;
CodedPartySearch_Name.maxLength = 70;
CodedPartySearch_Name.helpText = "Coded party name";

/****************************** BUTTON FIELDS **************************************/

function CodedPartySearch_SearchButton() {};
CodedPartySearch_SearchButton.tabIndex = 2;
CodedPartySearch_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "codedPartySearchSubform" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
CodedPartySearch_SearchButton.actionBinding = function()
{
	// When click Search, set the page number to be 1
	Services.setValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH, 1);

	// Copy the search criteria to a temporary area of the DOM
	var queryNode = Services.getNode(XPathConstants.DATA_XPATH + "/SearchCriteria");
	Services.replaceNode(XPathConstants.TEMP_SEARCHCRITERIA_XPATH, queryNode);

	// Retrieve the search results
	loadCodedPartyData();
}

CodedPartySearch_SearchButton.enableOn = [CodedPartySearch_Name.dataBinding];
CodedPartySearch_SearchButton.isEnabled = function()
{
	// Only enabled if party name populated
	var partyName   = Services.getValue(CodedPartySearch_Name.dataBinding);
	if ( !CaseManUtils.isBlank(partyName) )
	{
		return true;
	}
	return false;
}

/*********************************************************************************/

function CodedPartySearch_PreviousButton() {}
CodedPartySearch_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "codedPartySearchSubform", alt: true } ]
	}
};
CodedPartySearch_PreviousButton.tabIndex = 20;

CodedPartySearch_PreviousButton.enableOn = [XPathConstants.CPSEARCH_PAGENUMBER_XPATH];
CodedPartySearch_PreviousButton.isEnabled = function(event)
{
	// Disable Previous button if on first page
	var pageNumber = parseInt(Services.getValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH));
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
CodedPartySearch_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt(Services.getValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.CPSEARCH_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Invoke the retrieval service
	loadCodedPartyData();
}

/**********************************************************************************/

function CodedPartySearch_NextButton() {}
CodedPartySearch_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "codedPartySearchSubform", alt: true } ]
	}
};
CodedPartySearch_NextButton.tabIndex = 21;

CodedPartySearch_NextButton.enableOn = [CodedPartySearch_ResultsGrid.srcData];
CodedPartySearch_NextButton.isEnabled = function()
{
	var countRecords = Services.countNodes( CodedPartySearch_ResultsGrid.srcData + "/" + CodedPartySearch_ResultsGrid.rowXPath );
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
CodedPartySearch_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.CPSEARCH_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.CPSEARCH_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Invoke the retrieval service
	loadCodedPartyData(true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
CodedPartySearch_NextButton.onSuccess = function(dom)
{
    Services.replaceNode(XPathConstants.CODED_PARTIES_SRC_XPATH, dom);
    Services.setFocus("CodedPartySearch_ResultsGrid");
}

/**********************************************************************************/

function CodedPartySearch_OkButton() {}
CodedPartySearch_OkButton.tabIndex = 22;

/**********************************************************************************/

function CodedPartySearch_CancelButton() {}
CodedPartySearch_CancelButton.tabIndex = 23;
