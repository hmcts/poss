/** 
 * @fileoverview QueryByPartyWarrant.js:
 * This file contains the form and field configurations for the UC200 - Query By Party (Warrant) screen. 
 *
 * @author Tim Connor, Chris Vincent
 * @version 0.1
 *
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 04/01/2007 - Chris Vincent, added the Executing Court Code which the user can search on instead of
 * 				the Owning Court for foreign warrants.  The two court codes can be combined in a query but
 * 				at least one of Owning or Executing Court code must be entered.  Temp_CaseMan defect 317.
 * 02/05/2007 - Chris Vincent, updates for defect 6155 including calling getAllCourtsShort to include those
 * 				courts not in service which are required for the Issuing Court Code field and changes to the
 * 				executing court code field validation preventing selection of a court not in service.  The 
 * 				error message for the issuing court code has also been updated.
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
XPathConstants.LOVCOURT_DESTINATION_XPATH = "/ds/var/page/Temp/LOVCourtDestinationXPath";

/****************************** MAIN FORM *****************************************/

function QueryByPartyWarrant() {};

/**
 * @author rzxd7g
 * 
 */
QueryByPartyWarrant.initialise = function()
{
	Services.setValue(XPathConstants.QBP_PAGENUMBER_XPATH, 0);
	var court = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(court) )
	{
		// Default executing court to the user's owning court if not previously entered
		var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH, "");
		if ( !CaseManUtils.isBlank(courtCode) )
		{
			Services.setValue(Header_ExecutingCourtCode.dataBinding, courtCode);
		}
	}
}

QueryByPartyWarrant.refDataServices = [
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getAllCourtsShort", serviceParams:[]}
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
 * Checks if either the Issuing Court or Executing Court codes are valid and not blank
 *
 * @returns [Boolean] True if either of the court codes are valid and not blank, else false
 * @author rzxd7g
 */
function validCourtCodes()
{
	var blnOk = false;
	var owningCourtCode = Services.getValue(Header_IssuingCourtCode.dataBinding);
	var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank(owningCourtCode) && null == Header_IssuingCourtCode.validate() )
	{	
		blnOk = true;
	}
	else if ( !CaseManUtils.isBlank(executingCourtCode) && null == Header_ExecutingCourtCode.validate() )
	{
		blnOk = true;
	}
	return blnOk;
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
	var owningCourtCode =	 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtCode");
	var owningCourtName = 	 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtName");
	var executingCourtCode = Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/ExecutingCourtCode");
	var executingCourtName = Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/ExecutingCourtName");
	var caseNumber = 		 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/CaseNumber");
	var CONumber = 			 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/CONumber");
	var partyName = 		 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/PartyName");
	var address1 = 			 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address1");
	var address2 = 			 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address2");
	var postCode = 			 Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/PostCode");
	
	// Validate against rules for required search criteria
	var callService = false;
	if ( !validCourtCodes() )
	{
		var errCode = ErrorCode.getErrorCode('CaseMan_invalidCourtCode_Msg');
		Services.setTransientStatusBarMessage(errCode.getMessage());
	}
	else
	{
	 	if  ( CaseManUtils.isBlank(caseNumber) && CaseManUtils.isBlank(CONumber) && CaseManUtils.isBlank(partyName) &&
			  CaseManUtils.isBlank(address1) && CaseManUtils.isBlank(postCode) )
		{
			var errCode = ErrorCode.getErrorCode('CaseMan_invalidWarrantSearchFields_Msg');
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
		
		var paramValue = CaseManUtils.isBlank(executingCourtCode) ? "" : executingCourtCode;
		params.addSimpleParameter("executingCourtCode", paramValue);
		
		var paramValue = CaseManUtils.isBlank(executingCourtName) ? "" : executingCourtName.toUpperCase();
		params.addSimpleParameter("executingCourtName", paramValue);
		
		var paramValue = CaseManUtils.isBlank(caseNumber) ? "" : "%" + caseNumber.toUpperCase() + "%";
		params.addSimpleParameter("caseNumber", paramValue);
		
		var paramValue = CaseManUtils.isBlank(CONumber) ? "" : "%" + CONumber.toUpperCase() + "%";
		params.addSimpleParameter("CONumber", paramValue);
		
		var paramValue = CaseManUtils.isBlank(partyName) ? "" : "%" + partyName.toUpperCase() + "%";
		params.addSimpleParameter("partyName", paramValue);
	
		var paramValue = CaseManUtils.isBlank(address1) ? "" : "%" + address1.toUpperCase() + "%";
		params.addSimpleParameter("address1", paramValue);
		
		var paramValue = CaseManUtils.isBlank(address2) ? "" : "%" + address2.toUpperCase() + "%";
		params.addSimpleParameter("address2", paramValue);
	
		var paramValue = CaseManUtils.isBlank(postCode) ? "" : postCode.toUpperCase();
		params.addSimpleParameter("postCode", paramValue);
		
		var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
		params.addSimpleParameter("pageNumber", pageNumber );
		params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
		
		// Use a different onSuccess handler for the Next button	
		if ( blnNextButton )
		{
			Services.callService("getWarrantParties", params, Status_NextButton, true);
		}
		else
		{
	    	Services.callService("getWarrantParties", params, Header_SearchBtn, true);
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
		var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
		Services.setValue(xpath, courtCode);
		Services.setValue(OwningCourtLOV.dataBinding, "");
	}
}

/**
 * @author rzxd7g
 * @return "Header_CaseNumber"  
 */
OwningCourtLOV.nextFocusedAdaptorId = function() 
{
	// Return focus to the correct field
    var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
    var adaptor = null;
    switch (xpath)
    {
    	case Header_IssuingCourtCode.dataBinding:
    		adaptor = "Header_IssuingCourtCode";
    		break;
    	case Header_ExecutingCourtCode.dataBinding:
    		adaptor = "Header_ExecutingCourtCode";
    		break;
    }
    return adaptor;
}

/********************************** GRIDS *****************************************/

function Results_ResultsGrid() {};
Results_ResultsGrid.dataBinding = XPathConstants.QBP_XPATH + "/SelectedGridRow/SelectedWarrantId";
Results_ResultsGrid.tabIndex = 14;
Results_ResultsGrid.srcData = XPathConstants.QBP_XPATH + "/PartyQueryResults";	// List of PartyCases
Results_ResultsGrid.rowXPath = "PartyQueryResult";								// Individual PartyCase
Results_ResultsGrid.keyXPath = "id"                    			// Unique identifier for a PartyCase is autogenerated
Results_ResultsGrid.columns = [									// Column bindings
	{xpath: "WarrantNumber"},
	{xpath: "LocalWarrantNumber"},
	{xpath: "PartyType"},
	{xpath: "Name"},
	{xpath: "Address1"},
	{xpath: "Address2"},
	{xpath: "Live"}
];

Results_ResultsGrid.enableOn = [XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult"];
Results_ResultsGrid.isEnabled = function()
{
	return Services.countNodes(XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult") > 0
}

/****************************** DATA BINDINGS **************************************/

Header_IssuingCourtCode.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/OwningCourtCode";
Header_IssuingCourtName.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/OwningCourtName";
Header_ExecutingCourtCode.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/ExecutingCourtCode";
Header_ExecutingCourtName.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/ExecutingCourtName";
Header_CaseNumber.dataBinding      = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/CaseNumber";
Header_PartyName.dataBinding       = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/PartyName";
Header_CONumber.dataBinding        = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/CONumber";
Header_Address1.dataBinding        = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address1";
Header_Address2.dataBinding        = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address2";
Header_PostCode.dataBinding        = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/PostCode";

/********************************* FIELDS ******************************************/

function Header_IssuingCourtCode() {};
Header_IssuingCourtCode.tabIndex = 4;
Header_IssuingCourtCode.maxLength = 3;
Header_IssuingCourtCode.helpText = "Issuing court code";
Header_IssuingCourtCode.mandatoryOn = [Header_ExecutingCourtCode.dataBinding];
Header_IssuingCourtCode.isMandatory = function() 
{ 
	// Mandatory if the executing court code field is blank, else optional
	var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	return CaseManUtils.isBlank(executingCourtCode) ? true : false;
}
Header_IssuingCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_IssuingCourtCode.dataBinding + "]/Name");
	var courtCode = Services.getValue(Header_IssuingCourtCode.dataBinding);
	if  ( !CaseManUtils.isBlank(courtCode) && null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_courtDoesNotExist_Msg");
	}
	return ec;
}

// Configure the location in the model which will generate data change events
Header_IssuingCourtCode.logicOn = [Header_IssuingCourtCode.dataBinding];
Header_IssuingCourtCode.logic = function(event)
{
	if (event.getXPath() != Header_IssuingCourtCode.dataBinding)
	{
		return;
	}
	
	var value = Services.getValue(Header_IssuingCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( value ) && null == Header_IssuingCourtCode.validate() )
	{
		// Populate the Name field
		var name = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + value + "']/Name");
		if (Services.getValue(Header_IssuingCourtName.dataBinding) != name)
		{
			Services.setValue(Header_IssuingCourtName.dataBinding, name);
		}
	}
	else
	{
		// The Owning Court Code is blank or invalid, clear the Court Name field
		Services.startTransaction();
		Services.setValue(Header_IssuingCourtName.dataBinding, "");

		// If the Executing Court code field is also blank then clear all other query fields
		var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
		if ( CaseManUtils.isBlank( executingCourtCode ) )
		{
			Services.setValue(Header_ExecutingCourtName.dataBinding, "");
			Services.setValue(Header_CaseNumber.dataBinding, "");
			Services.setValue(Header_PartyName.dataBinding, "");
			Services.setValue(Header_CONumber.dataBinding, "");
			Services.setValue(Header_Address1.dataBinding, "");
			Services.setValue(Header_Address2.dataBinding, "");
			Services.setValue(Header_PostCode.dataBinding, "");
		}
		Services.endTransaction();
	}
}

/*********************************************************************************/

function Header_IssuingCourtName() {};
Header_IssuingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_IssuingCourtName.rowXPath = "Court";
Header_IssuingCourtName.keyXPath = "Name";
Header_IssuingCourtName.displayXPath = "Name";
Header_IssuingCourtName.strictValidation = true;
Header_IssuingCourtName.tabIndex = 5;
Header_IssuingCourtName.helpText = "Issuing court name";
Header_IssuingCourtName.mandatoryOn = [Header_ExecutingCourtCode.dataBinding];
Header_IssuingCourtName.isMandatory = function() 
{ 
	// Mandatory if the executing court code field is blank, else optional
	var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	return CaseManUtils.isBlank(executingCourtCode) ? true : false;
}
Header_IssuingCourtName.logicOn = [Header_IssuingCourtName.dataBinding];
Header_IssuingCourtName.logic = function(event)
{
	if (event.getXPath() != Header_IssuingCourtName.dataBinding)
	{
		return;
	}

	var value = Services.getValue(Header_IssuingCourtName.dataBinding);
	if (!CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Header_IssuingCourtName.dataBinding + "]/Code");
		if (!CaseManUtils.isBlank(code) && Services.getValue(Header_IssuingCourtCode.dataBinding) != code)
		{
			Services.setValue(Header_IssuingCourtCode.dataBinding, code);
		}
	}
}

/*********************************************************************************/

function Header_ExecutingCourtCode() {};
Header_ExecutingCourtCode.tabIndex = 1;
Header_ExecutingCourtCode.maxLength = 3;
Header_ExecutingCourtCode.helpText = "Executing court code";
Header_ExecutingCourtCode.mandatoryOn = [Header_IssuingCourtCode.dataBinding];
Header_ExecutingCourtCode.isMandatory = function() 
{ 
	// Mandatory if the owning court code field is blank, else optional
	var owningCourtCode = Services.getValue(Header_IssuingCourtCode.dataBinding);
	return CaseManUtils.isBlank(owningCourtCode) ? true : false;
}
Header_ExecutingCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_ExecutingCourtCode.dataBinding + " and ./InService = 'Y']/Name");
	var courtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	if  ( !CaseManUtils.isBlank(courtCode) && null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

// Configure the location in the model which will generate data change events
Header_ExecutingCourtCode.logicOn = [Header_ExecutingCourtCode.dataBinding];
Header_ExecutingCourtCode.logic = function(event)
{
	if (event.getXPath() != Header_ExecutingCourtCode.dataBinding)
	{
		return;
	}
	
	var value = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( value ) && null == Header_ExecutingCourtCode.validate() )
	{
		// Populate the Name field
		var name = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + value + "' and ./InService = 'Y']/Name");
		if (Services.getValue(Header_ExecutingCourtName.dataBinding) != name)
		{
			Services.setValue(Header_ExecutingCourtName.dataBinding, name);
		}
	}
	else
	{
		// The Executing Court Code is blank or invalid, clear the Court Name field
		Services.startTransaction();
		Services.setValue(Header_ExecutingCourtName.dataBinding, "");

		// If the Owning Court code field is also blank then clear all other query fields
		var owningCourtCode = Services.getValue(Header_IssuingCourtCode.dataBinding);
		if ( CaseManUtils.isBlank( owningCourtCode ) )
		{
			Services.setValue(Header_IssuingCourtName.dataBinding, "");
			Services.setValue(Header_CaseNumber.dataBinding, "");
			Services.setValue(Header_PartyName.dataBinding, "");
			Services.setValue(Header_CONumber.dataBinding, "");
			Services.setValue(Header_Address1.dataBinding, "");
			Services.setValue(Header_Address2.dataBinding, "");
			Services.setValue(Header_PostCode.dataBinding, "");
		}
		Services.endTransaction();
	}
}

/*********************************************************************************/

function Header_ExecutingCourtName() {};
Header_ExecutingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_ExecutingCourtName.rowXPath = "Court[./InService = 'Y']";
Header_ExecutingCourtName.keyXPath = "Name";
Header_ExecutingCourtName.displayXPath = "Name";
Header_ExecutingCourtName.strictValidation = true;
Header_ExecutingCourtName.tabIndex = 2;
Header_ExecutingCourtName.helpText = "Executing court name";
Header_ExecutingCourtName.mandatoryOn = [Header_IssuingCourtCode.dataBinding];
Header_ExecutingCourtName.isMandatory = function() 
{ 
	// Mandatory if the owning court code field is blank, else optional
	var owningCourtCode = Services.getValue(Header_IssuingCourtCode.dataBinding);
	return CaseManUtils.isBlank(owningCourtCode) ? true : false;
}
Header_ExecutingCourtName.logicOn = [Header_ExecutingCourtName.dataBinding];
Header_ExecutingCourtName.logic = function(event)
{
	if (event.getXPath() != Header_ExecutingCourtName.dataBinding)
	{
		return;
	}

	var value = Services.getValue(Header_ExecutingCourtName.dataBinding);
	if (!CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Header_ExecutingCourtName.dataBinding + " and ./InService = 'Y']/Code");
		if (!CaseManUtils.isBlank(code) && Services.getValue(Header_ExecutingCourtCode.dataBinding) != code)
		{
			Services.setValue(Header_ExecutingCourtCode.dataBinding, code);
		}
	}
}

/*********************************************************************************/

function Header_CaseNumber() {};
Header_CaseNumber.tabIndex = 7;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.enableOn = [Header_IssuingCourtCode.dataBinding,Header_ExecutingCourtCode.dataBinding];
Header_CaseNumber.isEnabled = validCourtCodes;

/*********************************************************************************/

function Header_CONumber() {};
Header_CONumber.tabIndex = 8;
Header_CONumber.maxLength = 8;
Header_CONumber.helpText = "Unique identifier of a consolidated order quoted by all parties";
Header_CONumber.enableOn = [Header_IssuingCourtCode.dataBinding,Header_ExecutingCourtCode.dataBinding];
Header_CONumber.isEnabled = validCourtCodes;

/*********************************************************************************/

function Header_PartyName() {};
Header_PartyName.tabIndex = 9;
Header_PartyName.maxLength = 70;
Header_PartyName.helpText = "The name of the party";
Header_PartyName.enableOn = [Header_IssuingCourtCode.dataBinding,Header_ExecutingCourtCode.dataBinding];
Header_PartyName.isEnabled = validCourtCodes;

/*********************************************************************************/

function Header_Address1() {};
Header_Address1.tabIndex = 10;
Header_Address1.maxLength = 35;
Header_Address1.helpText = "First line of address";
Header_Address1.enableOn = [Header_IssuingCourtCode.dataBinding,Header_ExecutingCourtCode.dataBinding];
Header_Address1.isEnabled = validCourtCodes;

/*********************************************************************************/

function Header_Address2() {};
Header_Address2.tabIndex = 11;
Header_Address2.maxLength = 35;
Header_Address2.helpText = "Second line of address";
Header_Address2.enableOn = [Header_IssuingCourtCode.dataBinding, Header_Address1.dataBinding, Header_ExecutingCourtCode.dataBinding];
Header_Address2.isEnabled = function()
{
	// Enabled if owning court and address line one entered
	var address1   = Services.getValue(Header_Address1.dataBinding);
	if ( validCourtCodes() && !CaseManUtils.isBlank(address1) )
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

function Header_PostCode() {};
Header_PostCode.tabIndex = 12;
Header_PostCode.maxLength = 8;
Header_PostCode.helpText = "Parties Postcode";
Header_PostCode.enableOn = [Header_IssuingCourtCode.dataBinding,Header_ExecutingCourtCode.dataBinding];
Header_PostCode.isEnabled = validCourtCodes;

/******************************** BUTTONS *****************************************/

function Header_IssuingCourtLOVBtn() {};
Header_IssuingCourtLOVBtn.tabIndex = 6;
Header_IssuingCourtLOVBtn.actionBinding = function()
{
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_IssuingCourtCode.dataBinding);
    Services.dispatchEvent("OwningCourtLOV", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_IssuingCourtLOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_IssuingCourtCode" }, { key: Key.F6, element: "Header_IssuingCourtName" } ]
	}
};

/*********************************************************************************/

function Header_ExecutingCourtLOVBtn() {};
Header_ExecutingCourtLOVBtn.tabIndex = 3;
Header_ExecutingCourtLOVBtn.actionBinding = function()
{
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_ExecutingCourtCode.dataBinding);
    Services.dispatchEvent("OwningCourtLOV", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_ExecutingCourtLOVBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_ExecutingCourtCode" }, { key: Key.F6, element: "Header_ExecutingCourtName" } ]
	}
};

/*********************************************************************************/

function Header_SearchBtn() {};
Header_SearchBtn.tabIndex = 13;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "QueryByPartyWarrant" } ]
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

Header_SearchBtn.enableOn = [Header_IssuingCourtCode.dataBinding, Header_ExecutingCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_CONumber.dataBinding, Header_PartyName.dataBinding, Header_Address1.dataBinding, Header_PostCode.dataBinding];
Header_SearchBtn.isEnabled = function()
{
	// At least one of Issuing Court or Executing Court entered (but both valid) 
	// AND at least one of Case Number, CO Number, Party Name, Address 1, postcode entered
	var issuedBy   = Services.getValue(Header_IssuingCourtCode.dataBinding);
	var executedBy = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var CONumber   = Services.getValue(Header_CONumber.dataBinding);
	var partyName  = Services.getValue(Header_PartyName.dataBinding);
	var address1   = Services.getValue(Header_Address1.dataBinding);
	var postCode   = Services.getValue(Header_PostCode.dataBinding);
	
	if ( ( !CaseManUtils.isBlank(issuedBy) || !CaseManUtils.isBlank(executedBy) ) 
		 && null == Header_IssuingCourtCode.validate() && null == Header_ExecutingCourtCode.validate() )
	{
		if ( !CaseManUtils.isBlank(caseNumber) || !CaseManUtils.isBlank(CONumber) || !CaseManUtils.isBlank(partyName) ||
			 !CaseManUtils.isBlank(address1) || !CaseManUtils.isBlank(postCode) )
		{
			return true;
		}
	}
	return false;
}

/**
* Callback function stores the given dom in the QueryByParty model node
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
		keys: [ { key: Key.CHAR_P, element: "QueryByPartyWarrant", alt: true } ]
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
		keys: [ { key: Key.CHAR_N, element: "QueryByPartyWarrant", alt: true } ]
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
		// Row is selected, set the warrant id else return to the state you came in with
		var warrantId = Services.getValue(XPathConstants.QBP_XPATH + "/PartyQueryResults/*[./id = " + rowId + "]/WarrantID"); /**/
		Services.setValue(MaintainWarrantsParams.WARRANT_ID, warrantId);
	}
	exitScreen();
};

/*********************************************************************************/

function Status_CancelBtn() {};
Status_CancelBtn.tabIndex = 53;
Status_CancelBtn.actionBinding = exitScreen;
Status_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "QueryByPartyWarrant" } ]
	}
};
