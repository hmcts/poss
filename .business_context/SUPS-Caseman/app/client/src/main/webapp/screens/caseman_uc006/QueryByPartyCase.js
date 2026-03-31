/** 
 * @fileoverview QueryByPartyCase.js:
 * This file contains the form and field configurations for the UC006 - Query By Party (Case) screen. 
 *
 * @author Alex Peterson, Chris Vincent
 * @version 0.1
 *
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 03/10/2007 - Chris Vincent, updated submitQueryByPartySearch to convert values to upper case
 * 				before calling service.
 * 12/11/2007 - Chris Vincent, performance change for Owning Court 335 including some validation changes
 *				on Case Number and change to automatic addition of wildcard characters on this field.
 *				CaseMan Defect 6467.
 * 23/11/2007 - Chris Vincent, change to Header_OwningCourtCode.validate to prevent searches on court 335
 * 				CaseMan Defect 6467.
 * 13/12/2007 - Chris Vincent, CaseMan Defect 6473 to remove the constraints on court 335.
 * 03/01/2008 - Chris Vincent, CaseMan Defect 6473 party type read only and default to Defendant for court 335.
 */

/** 
* @author Struan, Sandeep Mullangi
* @version 1.1
* 
* @changes
* 14/07/2008 - Struan (Logica) Adding Insolvency Number changes. RFC486
* 11-08-2008 Sandeep Mullangi - Changes to remove autotabbing for insolvency number & year
* 20-04-2009 Chris Vincent - Changed Insolvency Number field validation to cope with alphanumeric values and numeric values
* less than 4 digits long.  TRAC Ticket 334.
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

function QueryByPartyCase() {};

/**
 * @author rzxd7g
 * 
 */
QueryByPartyCase.initialise = function()
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

QueryByPartyCase.refDataServices = [
    {name:"PartyRoles", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPartyRoles", serviceParams:[]},
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
	var owningCourtCode = Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtCode");
	var owningCourtName = Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/OwningCourtName");
	var caseNumber = 	  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/CaseNumber");
	var partyName = 	  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/PartyName");
	var partyType = 	  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/SelectedSelectListRow/SelectedParty");
	var address1 = 		  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address1");
	var address2 = 		  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/Address2");
	var insolvNo = 		  Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/InsolvNo");
	var insolvYear =      Services.getValue(XPathConstants.QBP_TEMPQUERY_XPATH + "/InsolvYear");
	var insolvencyNumber =(CaseManUtils.isBlank(insolvNo)? '' : insolvNo)
							+ (CaseManUtils.isBlank(insolvYear)? '' : insolvYear);
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
	 	if  ( CaseManUtils.isBlank(caseNumber) && CaseManUtils.isBlank(partyName) &&
			  CaseManUtils.isBlank(address1) && CaseManUtils.isBlank(insolvencyNumber))
		{
			var errCode = ErrorCode.getErrorCode('CaseMan_invalidCaseSearchFields_Msg');
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
	
		if ( owningCourtCode == CaseManUtils.CCBC_COURT_CODE )
		{
			// CCBC cases use only trailing wildcards
			var paramValue = CaseManUtils.isBlank(caseNumber) ? "" : caseNumber.toUpperCase() + "%";
		}
		else
		{
			// Non-CCBC cases uses leading AND trailing wildcards if partial case number entered
			var paramValue = CaseManUtils.isBlank(caseNumber) ? "" : "%" + caseNumber.toUpperCase() + "%";
		}
		params.addSimpleParameter("caseNumber", paramValue);
	
		var paramValue = CaseManUtils.isBlank(partyName) ? "" : "%" + partyName.toUpperCase() + "%";
		params.addSimpleParameter("partyName", paramValue);
	
		var paramValue = CaseManUtils.isBlank(partyType) ? "" : partyType.toUpperCase();
		params.addSimpleParameter("partyType", paramValue);
		
		var paramValue = CaseManUtils.isBlank(address1) ? "" : "%" + address1.toUpperCase() + "%";
		params.addSimpleParameter("address1", paramValue);
		
		var paramValue = CaseManUtils.isBlank(address2) ? "" : "%" + address2.toUpperCase() + "%";
		params.addSimpleParameter("address2", paramValue);
		
		var paramValue = CaseManUtils.isBlank(insolvencyNumber) ? "" : insolvencyNumber;
		params.addSimpleParameter("insolvencyNumber",insolvencyNumber);
				
		var pageNumber = parseInt( Services.getValue(XPathConstants.QBP_PAGENUMBER_XPATH) );
		params.addSimpleParameter("pageNumber", pageNumber );
		params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
		
		// Use a different onSuccess handler for the Next button	
		if ( blnNextButton )
		{
			Services.callService("getCaseParties", params, Status_NextButton, true);
		}
		else
		{
	    	Services.callService("getCaseParties", params, Header_SearchBtn, true);
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
Results_ResultsGrid.tabIndex = 100;
Results_ResultsGrid.srcData = XPathConstants.QBP_XPATH + "/PartyQueryResults";	// List of PartyCases
Results_ResultsGrid.rowXPath = "PartyQueryResult";				// Individual PartyCase
Results_ResultsGrid.keyXPath = "id"                    			// Unique identifier for a PartyCase is autogenerated
Results_ResultsGrid.columns = [									// Column bindings
	{xpath: "CaseNumber"},
	{xpath: "InsolvencyNumber", transformToDisplay: function(value){
		if (value==null)
			return '';
		else if (value.length!==8)
			return value;
		return value.substring(0,4)+' of '+value.substring(4,8);
	}},
	{xpath: "PartyType"},
	{xpath: "PartyName"},
	{xpath: "Address1"},
	{xpath: "Address2"}
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
Header_PartyType_Sel.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/SelectedSelectListRow/SelectedParty";
Header_Address1.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address1";
Header_Address2.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/Address2";
Header_InsolvNo.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/InsolvNo";
Header_InsolvYear.dataBinding = CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH + "/InsolvYear";

/********************************* FIELDS ******************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = 10;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isMandatory = function() { return true; }

Header_OwningCourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
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
	if (!CaseManUtils.isBlank( value ) && null == Header_OwningCourtCode.validate() )
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
		Services.setValue(Header_PartyName.dataBinding, "");
		Services.setValue(Header_PartyType_Sel.dataBinding, "");
		Services.setValue(Header_Address1.dataBinding, "");
		Services.setValue(Header_Address2.dataBinding, "");
		Services.setValue(Header_InsolvNo.dataBinding,"");
		Services.setValue(Header_InsolvYear.dataBinding,"");
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
Header_OwningCourtName.tabIndex = 20;
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
Header_CaseNumber.tabIndex = 40;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.enableOn = [Header_OwningCourtCode.dataBinding];
Header_CaseNumber.isEnabled = validOwningCourtCode;
Header_CaseNumber.validateOn = [Header_OwningCourtCode.dataBinding];
Header_CaseNumber.validate = function()
{
	var ec = null;
	var caseNumberString = Services.getValue(Header_CaseNumber.dataBinding);
	var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( owningCourt == CaseManUtils.CCBC_COURT_CODE && !CaseManUtils.isBlank(caseNumberString) )
	{
		// Specific CCBC (Court 335) Case Number Validation
		if ( caseNumberString.length < 3 )
		{
			// At least 3 characters of the Case Number must be entered
			ec = ErrorCode.getErrorCode("CaseMan_QBP_InvalidFieldLength");
		}
		else if ( 0 != caseNumberString.search(/^[a-zA-Z0-9]*$/) )
		{
			// The partial case number must not contain a wildcard character '%'
			ec = ErrorCode.getErrorCode("CaseMan_QBP_InvalidFieldCharacter");
		}
	}
	return ec;
}

/*********************************************************************************/

function Header_PartyName() {};
Header_PartyName.tabIndex = 50;
Header_PartyName.maxLength = 70;
Header_PartyName.helpText = "The name of the party";
Header_PartyName.enableOn = [Header_OwningCourtCode.dataBinding];
Header_PartyName.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_PartyType_Sel() {};
Header_PartyType_Sel.tabIndex = 60;
Header_PartyType_Sel.maxLength = 70;
Header_PartyType_Sel.helpText = "A list of Party Types";
Header_PartyType_Sel.srcData = XPathConstants.REF_DATA_XPATH + "/PartyRoles";
Header_PartyType_Sel.rowXPath = "/PartyRole";
Header_PartyType_Sel.keyXPath = "/Code";
Header_PartyType_Sel.displayXPath = "/Description";

Header_PartyType_Sel.enableOn = [Header_OwningCourtCode.dataBinding, Header_PartyName.dataBinding];
Header_PartyType_Sel.isEnabled = function()
{
	// Owning Court entered AND Party Name entered.
	// PartyType will automatically clear when Party Name is cleared.
	var partyName = Services.getValue(Header_PartyName.dataBinding);
	
	if ( CaseManUtils.isBlank(partyName) )
	{	
		Services.setValue(Header_PartyType_Sel.dataBinding, "");
		return false;
	}

	return validOwningCourtCode();
}


Header_PartyType_Sel.logicOn = [Header_PartyName.dataBinding, Header_OwningCourtCode.dataBinding];
Header_PartyType_Sel.logic = function()
{
	var partyName = Services.getValue(Header_PartyName.dataBinding);
	if ( CaseManUtils.isBlank(partyName) )
	{
		// If all party name which allows this field to be enabled is blank, blank party type
		Services.setValue(Header_PartyType_Sel.dataBinding, "");
	}
	else
	{
		// CCBC Specific functionality - default to Defendant if party name not blank
		var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
		if ( owningCourt == CaseManUtils.CCBC_COURT_CODE )
		{
			Services.setValue(Header_PartyType_Sel.dataBinding, PartyTypeCodesEnum.DEFENDANT);
		}
	}
}

Header_PartyType_Sel.readOnlyOn = [Header_OwningCourtCode.dataBinding];
Header_PartyType_Sel.isReadOnly = function()
{
	// Read only if the owning court is 335 (CCBC)
	var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	return ( owningCourt == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}

/*********************************************************************************/

function Header_Address1() {};
Header_Address1.tabIndex = 70;
Header_Address1.maxLength = 35;
Header_Address1.helpText = "First line of address";
Header_Address1.enableOn = [Header_OwningCourtCode.dataBinding];
Header_Address1.isEnabled = validOwningCourtCode;

/*********************************************************************************/

function Header_Address2() {};
Header_Address2.tabIndex = 80;
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

/**********************************************************************************/
function Header_InsolvNo(){};
Header_InsolvNo.tabIndex=44;
Header_InsolvNo.maxLength = 4;
Header_InsolvNo.helpText = "Insolvency Number";
Header_InsolvNo.componentName = "Insolvency Number";
Header_InsolvNo.enableOn = [Header_OwningCourtCode.dataBinding];
Header_InsolvNo.isEnabled = validOwningCourtCode;

Header_InsolvNo.validateOn = [Header_InsolvNo.dataBinding];
Header_InsolvNo.validate = function()
{
	var insolvNo = Services.getValue(Header_InsolvNo.dataBinding);
	return CaseManValidationHelper.validateInsolvencyNumber(insolvNo);
}

Header_InsolvNo.mandatoryOn=[Header_InsolvYear.dataBinding];
Header_InsolvNo.isMandatory=function(){
	return !CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding));
}

/**********************************************************************************/
function Header_InsolvYear(){};
Header_InsolvYear.tabIndex=45;
Header_InsolvYear.maxLength = 4;
Header_InsolvYear.helpText = "Insolvency Year";
Header_InsolvYear.componentName = "Insolvency Year";
Header_InsolvYear.enableOn = [Header_OwningCourtCode.dataBinding];
Header_InsolvYear.isEnabled = validOwningCourtCode;

Header_InsolvYear.validateOn = [Header_InsolvYear.dataBinding];
Header_InsolvYear.validate = function()
{	
	var insolvYear = Services.getValue(Header_InsolvYear.dataBinding);
	return CaseManValidationHelper.validateInsolvencyNumber(insolvYear);
}

Header_InsolvYear.mandatoryOn=[Header_InsolvNo.dataBinding];
Header_InsolvYear.isMandatory=function(){
	return !CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding));
}
/******************************** BUTTONS *****************************************/

function Header_OwningCourtLOVBtn() {};
Header_OwningCourtLOVBtn.tabIndex = 30;

/*********************************************************************************/

function Header_SearchBtn() {};
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "QueryByPartyCase" } ]
	}
};

Header_SearchBtn.tabIndex = 90;
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

Header_SearchBtn.enableOn = [Header_OwningCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_PartyName.dataBinding, Header_Address1.dataBinding, Header_InsolvNo.dataBinding, Header_InsolvYear.dataBinding];
Header_SearchBtn.isEnabled = function()
{
	// Owning Court entered  AND one of Case Number, Party Name, Address 1 entered)
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var partyName  = Services.getValue(Header_PartyName.dataBinding);
	var address1   = Services.getValue(Header_Address1.dataBinding);
	var insolvNo   = Services.getValue(Header_InsolvNo.dataBinding);
	var insolvYear = Services.getValue(Header_InsolvYear.dataBinding);
	var blnEnabled = false;

	if ( validOwningCourtCode() )
	{
		if ( !CaseManUtils.isBlank(caseNumber) 
			|| !CaseManUtils.isBlank(partyName) 
			|| !CaseManUtils.isBlank(address1) 
			|| (!CaseManUtils.isBlank(insolvNo) && !CaseManUtils.isBlank(insolvYear)))
		{
			// Disabled if Case Number is invalid.
			blnEnabled = true;
			if ( (!CaseManUtils.isBlank(caseNumber) && !Services.getAdaptorById("Header_CaseNumber").getValid()) ||
					//Insolvency Number and year must both be blank or both not blank
					(CaseManUtils.isBlank(insolvNo) != CaseManUtils.isBlank(insolvYear)) || 
					//If used both insolvency number and year must be valid
					(!CaseManUtils.isBlank(insolvNo) && (!Services.getAdaptorById("Header_InsolvNo").getValid() || !Services.getAdaptorById("Header_InsolvYear").getValid())))
					
			{
				blnEnabled = false;
			}
	    }
	}
	return blnEnabled;
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
		keys: [ { key: Key.CHAR_P, element: "QueryByPartyCase", alt: true } ]
	}
};
Status_PreviousButton.tabIndex = 500;
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
		keys: [ { key: Key.CHAR_N, element: "QueryByPartyCase", alt: true } ]
	}
};
Status_NextButton.tabIndex = 510;
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

Status_OKBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "Results_ResultsGrid"} ]
	}
};

Status_OKBtn.tabIndex = 520;
/**
 * @author rzxd7g
 * 
 */
Status_OKBtn.actionBinding = function()
{
	var rowId = Services.getValue(Results_ResultsGrid.dataBinding);
	if ( !CaseManUtils.isBlank(rowId) )
	{
		// Row is selected, set the case number else return to the state you came in with
		var caseXPath = XPathConstants.QBP_XPATH + "/PartyQueryResults/PartyQueryResult[./id = " + rowId + "]/CaseNumber";
		var caseNumber = Services.getValue(caseXPath);
		var nextScreen = NavigationController.getNextScreen();
		
		// Determine calling screen as destination of Case Number will be different
		if ( nextScreen == NavigationController.CASES_FORM )
		{
			Services.setValue(CreateCaseParams.CASE_NUMBER, caseNumber);
		}
		else if ( nextScreen == NavigationController.EVENTS_FORM )
		{
			Services.setValue(ManageCaseEventsParams.CASE_NUMBER, caseNumber);
		}
	    else if ( nextScreen == "CreatePostalPayment" || nextScreen == "CreateBailiffPayment" || nextScreen == "CreateCounterPayment" || nextScreen == "CreateUpdatePassthrough")
	    {
	      Services.setValue("/ds/var/app/PaymentParams/EnforcementNumber", caseNumber);
	      Services.setValue("/ds/var/app/PaymentParams/EnforcementType", "CASE");
	    }
	}
	exitScreen();
};

/*********************************************************************************/

function Status_CancelBtn() {};
Status_CancelBtn.tabIndex = 530;
Status_CancelBtn.actionBinding = exitScreen;
Status_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "QueryByPartyCase" } ]
	}
};
