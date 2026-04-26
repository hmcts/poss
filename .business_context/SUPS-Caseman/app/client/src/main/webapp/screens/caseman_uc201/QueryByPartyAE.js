/** 
 * @fileoverview QueryByPartyAE.js:
 * This file contains the form and field configurations for the UC201 - Query By Party (AE) screen. 
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 03/10/2007 - Chris Vincent, updated submitQueryByPartySearch to convert values to upper case
 * 				before calling service.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.QBP_XPATH = "/ds/QueryByParty";
XPathConstants.QBP_PAGENUMBER_XPATH = "/ds/var/page/CurrentPageNumber";
XPathConstants.QBP_TEMPQUERY_XPATH = "/ds/var/page/QueryByParty";

/****************************** MAIN FORM *****************************************/

function QueryByPartyAE() {};

/**
 * @author rzxd7g
 * 
 */
QueryByPartyAE.initialise = function()
{
	Services.setValue(XPathConstants.QBP_PAGENUMBER_XPATH, 0);
	var court = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) )
	{
		// Default owning court to the user's owning court if not previously entered
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH, "");
		if ( !CaseManUtils.isBlank(courtCode) )
		{
			Services.setValue(Header_OwningCourtCode.dataBinding, courtCode);
		}
	}
}

QueryByPartyAE.refDataServices = [
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

/************************** HELPER FUNCTIONS **************************************/

/**
 * Function handles the exiting of the screen back to the calling screen
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	if ( !NavigationController.callStackExists() )
	{
		Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
		Services.navigate(NavigationController.MAIN_MENU);
	}
	else
	{
		NavigationController.nextScreen();
	}
}

/*********************************************************************************/

/**
 * Checks if Owning Court code is valid and not blank
 *
 * @returns [Boolean] True if the owning court is valid and not blank, else false
 * @author rzxd7g
 */
function validOwningCourtCode()
{
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) && null == Header_OwningCourtCode.validate() )
	{	
		return true;
	}
	return false;
}

/*********************************************************************************/

/**
 * Collates form input data, validates, and calls the search service
 * @param blnNextButton
 * @author rzxd7g
 * 
 */
function submitQueryByPartySearch(blnNextButton) 
{
	// Retrieve values from the DOM
	var owningCourtCode =	Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtCode");
	var owningCourtName = 	Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtName");
	var caseNumber = 		Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/CaseNumber");
	var partyName = 		Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/PartyName");
	var aeNumber = 		    Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/AENumber");
	var address1 = 			Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address1");
	var address2 = 			Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address2");
	var empName = 			Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/EmployerName");

	// Validation: beware of nulls, empty strings.
	var callService = false;

	// Validate against rules for required search criteria
	if ( CaseManUtils.isBlank(owningCourtCode) )
	{
		var errCode = ErrorCode.getErrorCode('CaseMan_invalidCourtCode_Msg');
		Services.setTransientStatusBarMessage(errCode.getMessage());
	}
	else
	{
	 	if  ( CaseManUtils.isBlank(caseNumber) && CaseManUtils.isBlank(partyName) && CaseManUtils.isBlank(aeNumber) &&
			  CaseManUtils.isBlank(address1) && CaseManUtils.isBlank(empName) )
			{
			var errCode = ErrorCode.getErrorCode('CaseMan_invalidAESearchFields_Msg');
			Services.setTransientStatusBarMessage(errCode.getMessage());
		}
		else
		{
			callService = true;
			Services.setTransientStatusBarMessage("");
		}
	}

	// Build and submit search query to service	
	if (callService)
	{
		var params = new ServiceParams();

		// Permitted to submit "", service will ignore.
		// Any submitted 'like' search criteria must be surounded by "%"
		var paramValue = CaseManUtils.isBlank(owningCourtCode) ? "" : owningCourtCode;
		params.addSimpleParameter("owningCourtCode", paramValue);

		var paramValue = CaseManUtils.isBlank(owningCourtName) ? "" : owningCourtName.toUpperCase();
		params.addSimpleParameter("owningCourtName", paramValue);
	
		var paramValue = CaseManUtils.isBlank(caseNumber) ? "" : "%" + caseNumber.toUpperCase() + "%";
		params.addSimpleParameter("caseNumber", paramValue);
	
		var paramValue = CaseManUtils.isBlank(partyName) ? "" : "%" + partyName.toUpperCase() + "%";
		params.addSimpleParameter("partyName", paramValue);
	
		var paramValue = CaseManUtils.isBlank(aeNumber) ? "" : "%" + aeNumber.toUpperCase() + "%";
		params.addSimpleParameter("aeNumber", paramValue);
		
		var paramValue = CaseManUtils.isBlank(address1) ? "" : "%" + address1.toUpperCase() + "%";
		params.addSimpleParameter("address1", paramValue);
		
		var paramValue = CaseManUtils.isBlank(address2) ? "" : "%" + address2.toUpperCase() + "%";
		params.addSimpleParameter("address2", paramValue);
		
		var paramValue = CaseManUtils.isBlank(empName) ? "" : "%" + empName.toUpperCase() + "%";
		params.addSimpleParameter("empName", paramValue);

		var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
		params.addSimpleParameter("pageNumber", pageNumber );
		params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
		
		// Use a different onSuccess handler for the Next button	
		if ( blnNextButton )
		{
			Services.callService("getAeParties", params, Status_NextButton, true);
		}
		else
		{
	    	Services.callService("getAeParties", params, Header_SearchBtn, true);
	    }
	}
}

/******************************* LOV SUBFORMS *************************************/

function OwningCourtLOV() {};
OwningCourtLOV.dataBinding = "/ds/var/form/LOVSubForms/SelectedCourt";
OwningCourtLOV.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
OwningCourtLOV.rowXPath = "Court";
OwningCourtLOV.keyXPath = "Code";
OwningCourtLOV.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

OwningCourtLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_OwningCourtLOVBtn"} ],
		keys: [ { key: Key.F6, element: "Header_OwningCourtCode" }, { key: Key.F6, element: "Header_OwningCourtName" } ]
	}
};

OwningCourtLOV.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
OwningCourtLOV.destroyOnClose = false;
OwningCourtLOV.logicOn = [OwningCourtLOV.dataBinding];
OwningCourtLOV.logic = function(event)
{
	if ( event.getXPath().indexOf(OwningCourtLOV.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(OwningCourtLOV.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(Header_OwningCourtCode.dataBinding, courtCode);
		Services.setValue(OwningCourtLOV.dataBinding, "");
	}
}

/**
 * @author rzxd7g
 * @return "Header_CaseNumber"  
 */
OwningCourtLOV.nextFocusedAdaptorId = function() {
	return "Header_CaseNumber";
}

/********************************** GRIDS *****************************************/

function Results_ResultsGrid() {};
Results_ResultsGrid.dataBinding = XPathConstants.QBP_XPATH + "/SelectedGridRow/SelectedPartyCaseId";
Results_ResultsGrid.tabIndex = 11;
Results_ResultsGrid.srcData = XPathConstants.QBP_XPATH + "/PartyQueryResults";	// List of PartyCases
Results_ResultsGrid.rowXPath = "PartyQueryResult";				// Individual PartyCase
Results_ResultsGrid.keyXPath = "id"                    			// Unique identifier for a PartyCase is autogenerated
Results_ResultsGrid.columns = [									// Column bindings
	{xpath: "CaseNumber"},
	{xpath: "AENumber"},
	{xpath: "JudgmentDebtor/PartyName" },
	{xpath: "JudgmentDebtor/ContactDetails/Address/Line[1]"},
	{xpath: "JudgmentDebtor/ContactDetails/Address/Line[2]"}
];

Results_ResultsGrid.enableOn = [XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult"];
Results_ResultsGrid.isEnabled = function()
{
	return Services.countNodes(XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult") > 0
}

/****************************** DATA BINDINGS **************************************/

Header_OwningCourtCode.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/OwningCourtName";
Header_CaseNumber.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/CaseNumber";
Header_PartyName.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/PartyName";
Header_AENumber.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/AENumber";
Header_Address1.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address1";
Header_Address2.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address2";
Header_EmployerName.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/EmployerName";

/********************************* FIELDS ******************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = 1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isMandatory = function() { return true; }
Header_OwningCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_OwningCourtCode.dataBinding + "]/Name");
	if  ( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

// Configure the location in the model which will generate data change events
Header_OwningCourtCode.logicOn = [Header_OwningCourtCode.dataBinding];
Header_OwningCourtCode.logic = function(event)
{
	if (event.getXPath() != Header_OwningCourtCode.dataBinding)
	{
		return;
	}
	
	var value = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( value ) && null == Header_OwningCourtCode.validate() )
	{
		// Populate the Name field
		var name = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + value + "']/Name");
		if (Services.getValue(Header_OwningCourtName.dataBinding) != name)
		{
			Services.setValue(Header_OwningCourtName.dataBinding, name);
		}
	}
	else
	{
		Services.startTransaction();
		Services.setValue(Header_OwningCourtName.dataBinding, "");
		Services.setValue(Header_CaseNumber.dataBinding, "");
		Services.setValue(Header_AENumber.dataBinding, "");
		Services.setValue(Header_PartyName.dataBinding, "");
		Services.setValue(Header_EmployerName.dataBinding, "");
		Services.setValue(Header_Address1.dataBinding, "");
		Services.setValue(Header_Address2.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_OwningCourtName.rowXPath = "Court";
Header_OwningCourtName.keyXPath = "Name";
Header_OwningCourtName.displayXPath = "Name";
Header_OwningCourtName.strictValidation = true;
Header_OwningCourtName.tabIndex = 2;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isMandatory = function() { return true; }
Header_OwningCourtName.logicOn = [Header_OwningCourtName.dataBinding];
Header_OwningCourtName.logic = function(event)
{
	if (event.getXPath() != Header_OwningCourtName.dataBinding)
	{
		return;
	}

	var value = Services.getValue(Header_OwningCourtName.dataBinding);
	if (!CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Header_OwningCourtName.dataBinding + "]/Code");
		if (!CaseManUtils.isBlank(code) && Services.getValue(Header_OwningCourtCode.dataBinding) != code)
		{
			Services.setValue(Header_OwningCourtCode.dataBinding, code);
		}
	}
}

/*********************************************************************************/

function Header_CaseNumber() {};
Header_CaseNumber.tabIndex = 4;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.enableOn = [Header_OwningCourtCode.dataBinding];
Header_CaseNumber.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_AENumber() {};
Header_AENumber.tabIndex = 5;
Header_AENumber.maxLength = 8;
Header_AENumber.helpText = "AE Number";
Header_AENumber.enableOn = [Header_OwningCourtCode.dataBinding];
Header_AENumber.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_PartyName() {};
Header_PartyName.tabIndex = 6;
Header_PartyName.maxLength = 70;
Header_PartyName.helpText = "The name of the party";
Header_PartyName.enableOn = [Header_OwningCourtCode.dataBinding];
Header_PartyName.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_Address1() {};
Header_Address1.tabIndex = 7;
Header_Address1.maxLength = 35;
Header_Address1.helpText = "First line of address";
Header_Address1.enableOn = [Header_OwningCourtCode.dataBinding];
Header_Address1.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_Address2() {};
Header_Address2.tabIndex = 8;
Header_Address2.maxLength = 35;
Header_Address2.helpText = "Second line of address";
Header_Address2.enableOn = [Header_OwningCourtCode.dataBinding, Header_Address1.dataBinding];
Header_Address2.isEnabled = function()
{
	// Enabled if owning court and address line one entered
	var address1   = Services.getValue(Header_Address1.dataBinding);
	if ( validOwningCourtCode() && !CaseManUtils.isBlank(address1) )
	{
		return true;
	}
	return false;
}

Header_Address2.logicOn = [Header_Address1.dataBinding];
Header_Address2.logic = function()
{
	var address1 = Services.getValue(Header_Address1.dataBinding);

	if ( CaseManUtils.isBlank(address1) )
	{
		// If address line 1 is blanked, address line 2 will become disabled so clear the value
		Services.setValue(Header_Address2.dataBinding, "");
	}
}

/*********************************************************************************/

function Header_EmployerName() {};
Header_EmployerName.tabIndex = 9;
Header_EmployerName.maxLength = 70;
Header_EmployerName.helpText = "The name of the employer";
Header_EmployerName.enableOn = [Header_OwningCourtCode.dataBinding];
Header_EmployerName.isEnabled = validOwningCourtCode;

/******************************** BUTTONS *****************************************/

function Header_OwningCourtLOVBtn() {};
Header_OwningCourtLOVBtn.tabIndex = 3;

/*********************************************************************************/

function Header_SearchBtn() {};
Header_SearchBtn.tabIndex = 10;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "QueryByPartyAE" } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Header_SearchBtn.actionBinding = function()
{
	// When click Search, set the page number to be 1
	Services.setValue(XPathConstants.QBP_PAGENUMBER_XPATH, 1);

	// Copy the search criteria to a temporary area of the DOM
	var queryNode = Services.getNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	Services.replaceNode(XPathConstants.QBP_TEMPQUERY_XPATH, queryNode);

	// Retrieve the search results
	submitQueryByPartySearch();
}

Header_SearchBtn.enableOn = [Header_OwningCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_PartyName.dataBinding, Header_Address1.dataBinding, Header_EmployerName.dataBinding, Header_AENumber.dataBinding];
Header_SearchBtn.isEnabled = function()
{
	// Owning Court entered  AND (one of Case Number, Party Name, AE Number, Address 1 & Employer Name entered)
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var partyName  = Services.getValue(Header_PartyName.dataBinding);
	var address1   = Services.getValue(Header_Address1.dataBinding);
	var empName    = Services.getValue(Header_EmployerName.dataBinding);
	var aeNumber   = Services.getValue(Header_AENumber.dataBinding);

	if ( validOwningCourtCode() )
	{
		if ( !CaseManUtils.isBlank(caseNumber) || !CaseManUtils.isBlank(partyName) ||
		 	 !CaseManUtils.isBlank(address1) || !CaseManUtils.isBlank(empName) || !CaseManUtils.isBlank(aeNumber) )
		{
			return true;
	    }
	}
	return false;
}

/**
 * Callback function stores the given dom in the FormController's QueryByParty model node
 * @param newResultsDom
 * @author rzxd7g
 * 
 */
Header_SearchBtn.onSuccess = function(newResultsDom)
{
	Services.replaceNode(Results_ResultsGrid.srcData, newResultsDom);
	var countResults = Services.countNodes(XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult");
	if ( countResults == 0 )
	{
		Services.setValue(XPathConstants.QBP_PAGENUMBER_XPATH, 0);
		alert(Messages.NO_RESULTS_MESSAGE);
	}
}

/*********************************************************************************/

function Status_PreviousButton() {}
Status_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "QueryByPartyAE", alt: true } ]
	}
};
Status_PreviousButton.tabIndex = 50;
Status_PreviousButton.enableOn = [XPathConstants.QBP_PAGENUMBER_XPATH];
Status_PreviousButton.isEnabled = function(event)
{
	// Disable Previous button if on first page or search has not been made/returned any results
	var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
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
Status_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.QBP_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Retrieve the search results
	submitQueryByPartySearch();
}

/**********************************************************************************/

function Status_NextButton() {}
Status_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "QueryByPartyAE", alt: true } ]
	}
};
Status_NextButton.tabIndex = 51;
Status_NextButton.enableOn = [Results_ResultsGrid.srcData];
Status_NextButton.isEnabled = function()
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
Status_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.QBP_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Retrieve the search results
	submitQueryByPartySearch(true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_NextButton.onSuccess = function(dom)
{
    Services.replaceNode(Results_ResultsGrid.srcData, dom);
}

/*********************************************************************************/

function Status_OKBtn() {};
Status_OKBtn.tabIndex = 52;
Status_OKBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "Results_ResultsGrid"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_OKBtn.actionBinding = function()
{
	var rowId = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( !CaseManUtils.isBlank(rowId) )
	{
		// Row is selected, return the case number and ae number back to the calling screen
		var rootXPath = XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult[./id = " + rowId + "]";
		var caseNumber = Services.getValue(rootXPath + "/CaseNumber");
		var aeNumber = Services.getValue(rootXPath + "/AENumber");

		// May want to set the selected Case Number in different xpaths based on calling screen
		var nextScreen = NavigationController.getNextScreen()
		Services.startTransaction();
		if ( nextScreen == NavigationController.AE_EVENTS_FORM )
		{
			Services.setValue(ManageAEEventsParams.CASE_NUMBER, caseNumber);
			Services.setValue(ManageAEEventsParams.AE_NUMBER, aeNumber);
		}
		else if ( nextScreen == NavigationController.MANAGE_AE_FORM )
		{
			Services.setValue(ManageAEParams.CASE_NUMBER, caseNumber);
			Services.setValue(ManageAEParams.AE_NUMBER, aeNumber);
		}
		Services.endTransaction();
	}
	exitScreen();
};

/*********************************************************************************/

function Status_CancelBtn() {};
Status_CancelBtn.tabIndex = 53;
Status_CancelBtn.actionBinding = exitScreen;
Status_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "QueryByPartyAE" } ]
	}
};
