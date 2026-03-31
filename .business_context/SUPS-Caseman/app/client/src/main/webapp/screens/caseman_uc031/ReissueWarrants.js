/** 
 * @fileoverview ReissueWarrants.js:
 * This file contains the form and field configurations for the UC031 - Reissue  
 * Warrants screen.
 *
 * @author Tim Connor
 * @version 0.1
 *
 * Changes:
 * 31/05/2006 - Chris Vincent, added JavaDoc comments and changed Global Variables to
 *              Static variables.
 * 02/06/2006 - Chris Vincent, fixed UCT Defect 537 by setting the changes made xpath
 *				when a record has been loaded, instead of when a change is made.  The
 *				updateDetailsLogic has been removed.
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 *
 * 07/08/2006 - Defect 4108 - allow CCBC legacy warrant numbers (format: XXnnnnn) to be included in validation criteria.
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
* 18/09/2006 - Paul Roberts, fixed defect 5206 - enablement of search button.
 * 20/09/2006 - Paul Robinson, defect 5211 - CCBC warrants can be either Legacy or SUPS format
 * 13/11/2006 - Steve Blair - Observation 196 - Reissuing Co warrants should use addWarrantForCo service, not addWarrant.
 * 29/11/2006 - Steve Blair - UCT Defect 806 - removeDefendant() not removing/changing party role code or case party number
 * 				of defendants. Fixed so modifies these two fields along with name and address details.
 * 30/11/2006 - Chris Vincent, replaced the '?' with the pound symbol in transformCurrencyToDisplay() 
 *				and transformCurrencyToModel() UCT Defect 829. 
 * 04/01/2006 - Chris Vincent, added hint text to the fields Claimant_Name,Solicitor_Name,Solicitor_Address_Line1,
 * 				Solicitor_Address_Line2,Solicitor_Address_Line3,Solicitor_Address_Line4,Solicitor_Address_Line5,
 * 				Solicitor_Address_PostCode,WarrantDetails_Total and WarrantDetails_BalanceAfterPaid.  Temp_CaseMan
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 04/06/2007 - Chris Vincent, fixing TD Defect 6276 which filters the Judgments available for reissuing Execution 
 * 				Judgments.  Multiple Judgments against a defendant are possible so need to select a valid one if  
 * 				possible.
 * 07/11/2007 - Chris Vincent.  Fixing UCT_Group2 Defect 1617 where when a CCBC issued warrant was loaded, the fee
 * 				fields were blanked.  Decided that for CCBC issued warrants, fees should not be blanked.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearScreen() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 16/01/2008 - Chris Vincent, change to SearchResultsLOVGrid.onSuccess() so check if the PayDate node is empty before using it
 * 				as it is in rare scenarios which can cause a crash.  CaseMan Defect 6487.
 * 28/02/2008 - Chris Vincent, change to SearchResultsLOVGrid.onSuccess() to prevent foreign warrants from being loaded.
 * 				CaseMan Defect 6501.
 * 09/02/2009 - Chris Vincent, change to SearchResultsLOVGrid.onSuccess() to prevent the original warrant's solicitor's costs
 *				from being copied to the new reissued warrant, the costs is cleared for non-CCBC cases.  CaseMan Defect 6594.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Warrant Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes mean where EXECUTION warrants are referenced, CONTROL warrants must be 
 *				processed in the same way as they are replacing EXECUTION warrants.  Also when reissue an EXECUTION warrant, will
 *				convert to a CONTROL warrant on Save.
 */

function Header_WarrantNumber() {};
function Header_CaseNumber() {};
function Header_CONumber() {};
function Header_IssueDate() {};
function Header_WarrantType() {};
function Header_IssuedByCourtCode() {};
function Header_IssuedByCourtName() {};

/*****************************************************************************************************************/

/**
 * XPath Constants
 * @author fzj0yl
 * 
 */
function XPathConstants() {};
XPathConstants.ROOT_XPATH = "/ds";
XPathConstants.VAR_FORM_XPATH = XPathConstants.ROOT_XPATH + "/var/form";
XPathConstants.VAR_PAGE_XPATH = XPathConstants.ROOT_XPATH + "/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SEARCH_RESULTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/Warrants";
XPathConstants.WARRANT_BASE = XPathConstants.ROOT_XPATH + "/Warrant";
XPathConstants.TEMP_WARRANT_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/Warrant";
XPathConstants.WARRANT_ID_XPATH = XPathConstants.WARRANT_BASE + "/WarrantID";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='WARRANT_FEE']/ItemValue";
XPathConstants.JUDGMENT_BASE = XPathConstants.VAR_PAGE_XPATH + "/tmp/Judgments";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.LOVCOURT_DESTINATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/LOVCourtDestinationXPath";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ActionAfterSave";


/***************************** DATA BINDINGS **************************************/
Header_WarrantNumber.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantNumber";
Header_CaseNumber.dataBinding = XPathConstants.WARRANT_BASE + "/CaseNumber";
Header_CONumber.dataBinding = XPathConstants.WARRANT_BASE + "/CONumber";
Header_IssueDate.dataBinding = XPathConstants.WARRANT_BASE + "/IssueDate";
Header_WarrantType.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantType";
Header_IssuedByCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/IssuedBy";
Header_IssuedByCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/IssuedByAutocomplete";

/*****************************************************************************************************************/

/**
 * Actions After Saving
 * @author fzj0yl
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_NAVIGATE = "NAVIGATE";
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";

/******************************* FUNCTIONS *****************************************/

/**
 * Function clears the screen and resets all the default values.
 * @author fzj0yl
 * 
 */
function clearScreen() 
{
    Services.startTransaction();
    Services.removeNode(XPathConstants.WARRANT_BASE);
    Services.removeNode(XPathConstants.JUDGMENT_BASE);
    Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
    Services.removeNode(ReissueWarrantsParams.PARENT);
	Services.removeNode("/ds/var/app/CaseData");
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	
    Services.endTransaction();
    
    Services.setFocus("Header_WarrantNumber");
}

/*********************************************************************************/

/**
 * Function converts a currency code into the appropriate currency symbol for display.
 *
 * @param [String] value The currency code to be converted
 * @return [String] The appropriate currency symbol for the code passed in, or blank if no warrant loaded
 * @author fzj0yl
 */
function transformCurrencyToDisplay(value) 
{
	if ( !isWarrantFound() )
	{
		return "";
	}
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

/**
 * Function converts a currency symbol into the appropriate currency code for the DOM.
 *
 * @param [String] value The currency symbol to be converted
 * @return [String] The appropriate currency code for the symbol passed in
 * @author fzj0yl
 */
function transformCurrencyToModel(value) 
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

/**
 * Function converts a string to upper case.
 *
 * @param [String] value The string to be converted to upper case
 * @return [String] The string passed in converted to upper case
 * @author fzj0yl
 */
function toUpperCase(value) 
{
   	return (null != value) ? value.toUpperCase() : null;    
}

/*********************************************************************************/

/**
 * Function converts a string to upper case and strips out trailing and leading spaces.
 * Used for mandatory fields.
 *
 * @param [String] The string to be converted to upper case
 * @return [String] The converted string
 * @author fzj0yl
 */
function convertToUpperStripped(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Function indicates whether or not a valid warrant record has been loaded.
 *
 * @return [Boolean] True if a valid warrant record is loaded, else False
 * @author fzj0yl
 */
function isWarrantFound() 
{
    var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
    return !CaseManUtils.isBlank(warrantID);
}

/*********************************************************************************/

/**
 * Function removes a party from the warrant.  This is called when the judgment used to add
 * the party to the warrant has been set aside, or its first payment date has been
 * varied to something in the future.
 *
 * @param [Integer] defendantID The identifier of the party against being removed
 * @return [Boolean] True if the removal means there are no parties against left on the warrant, else False
 * @author fzj0yl
 */
function removeDefendant(defendantID) 
{
    // Check if there are currently 2 defendants, or just one
    var defendant2Name = Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Name"); 
    var numDefendants = 1;
    if (!CaseManUtils.isBlank(defendant2Name)) 
    {
        numDefendants = 2;
    }
    
    // There is only one defendant, and they are being removed, so we cannot continue
    // with the reissue
    if (numDefendants == 1) 
    {
        return true;
    }
    
    /* There are 2 defendants on the warrant, and one is being removed.  If it is the
     * second, just clear their details.  Otherwise, replace the first with the second
     * and then clear the details of the second.
     */
    if ( defendantID == 1 ) 
    {
    	Services.startTransaction();
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Name",             Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Name"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/Line[1]",  Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[1]"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/Line[2]",  Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[2]"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/Line[3]",  Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[3]"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/Line[4]",  Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[4]"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/Line[5]",  Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[5]"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Address/PostCode", Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/PostCode"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/Number", Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Number"));
        Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/PartyType", Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/PartyType"));
        Services.endTransaction();
    }

	Services.startTransaction();
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Name", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[1]", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[2]", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[3]", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[4]", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/Line[5]", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Address/PostCode", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/Number", "");
    Services.setValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/PartyType", "");
    Services.endTransaction();
    
    // One of the two defendants has been removed, so we can still continue with the re-issue
    return false;
}

/*********************************************************************************/

/**
 * Function validates a date entered by checking if is a non working day.
 *
 * @param [String] date The date to be validated in the format YYYY-MM-DD
 * @return [Boolean] True if the date is NOT a non working day (valid), else False (invalid)
 * @author fzj0yl
 */
function validateNonWorkingDate(date) 
{
 	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") ) 
 	{
 		return false;
 	}
 	return true;
}

/*********************************************************************************/

/**
 * Function ensures that a check for unsaved changes is made before exiting
 * @author fzj0yl
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function indicates whether or not there are unsaved changes on the screen.
 * @return [Boolean] True if unsaved changes exist, else False
 * @author fzj0yl
 */
function changesMade()
{
	return ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y")
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen
 * @author fzj0yl
 * 
 */
function exitScreen()
{
	// Clear any relevant data and exit the screen
	Services.removeNode(ReissueWarrantsParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.removeNode("/ds/var/app/CaseData");
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/******************************* FORM ELEMENT ***************************************/

function reissueWarrants() {}

// Load the reference data from the xml into the model
reissueWarrants.refDataServices = [
   	{ name:"Courts",          dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourts",          serviceParams:[] },
   	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
   	{ name:"NonWorkingDays",  dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays",  serviceParams:[] },
	{ name:"SystemDate",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"SystemData",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData",      serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/**
 * @author fzj0yl
 * 
 */
reissueWarrants.initialise = function() 
{
    // Get external parameters passed in
    var warrantID = Services.getValue(ReissueWarrantsParams.WARRANT_ID);
    var caseNumber = Services.getValue(ReissueWarrantsParams.CASE_NUMBER);
    var coNumber = Services.getValue(ReissueWarrantsParams.CO_NUMBER);
    
    if( !CaseManUtils.isBlank(warrantID) ) 
    {
        // Retrieve the details of the warrant.
        var params = new ServiceParams();
        params.addSimpleParameter("warrantID", warrantID);
        Services.callService("getWarrant", params, SearchResultsLOVGrid, true);		            
    }
    else if ( !CaseManUtils.isBlank(caseNumber) )
    {
        // A case number has been provided, so do a warrant search on the caseNumber
        Services.setValue(Header_CaseNumber.dataBinding, caseNumber);
        SearchButton.actionBinding();
    }
    else if ( !CaseManUtils.isBlank(coNumber) )
    {
        // A co number has been provided, so do a warrant search on the caseNumber
        Services.setValue(Header_CONumber.dataBinding, coNumber);
        SearchButton.actionBinding();
    }
}

/******************************* HEADER FIELDS *************************************/

Header_WarrantNumber.tabIndex = 1;
Header_WarrantNumber.maxLength = 8;
Header_WarrantNumber.componentName = "Warrant Number";
Header_WarrantNumber.helpText = "Enter the warrant number as quoted on the warrant.";
Header_WarrantNumber.transformToDisplay = toUpperCase;
Header_WarrantNumber.transformToModel = toUpperCase;
Header_WarrantNumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_WarrantNumber.isReadOnly = isWarrantFound;
Header_WarrantNumber.validateOn = [Header_WarrantNumber.dataBinding, Header_IssuedByCourtCode.dataBinding];
Header_WarrantNumber.validate = function ()
{
    var ec = null;
    var ecWarrant = null;
    var ecCCBC = null;
    var warrantNumber =  Services.getValue(Header_WarrantNumber.dataBinding);
    var issuingCourtId =  Services.getValue(Header_IssuedByCourtCode.dataBinding);
        if (issuingCourtId != null && issuingCourtId != "")
	    {
	    	// if it's CCBC check validate against CCBC criteria
	    	if ( issuingCourtId == CaseManUtils.CCBC_COURT_CODE )
	    	{
	    		ecWarrant = CaseManValidationHelper.validateNewWarrantNumber(warrantNumber);
	    		ecCCBC = CaseManValidationHelper.validateCCBCWarrantNumber(warrantNumber);
	    		if (ecWarrant != null && ecCCBC != null)
	    		{
					ec = ecWarrant;
	    		}
	    	} else {	
	    		ec = CaseManValidationHelper.validateNewWarrantNumber(warrantNumber);
	    	}
	    } else {
	    	ecWarrant = CaseManValidationHelper.validateNewWarrantNumber(warrantNumber);
	    	ecCCBC = CaseManValidationHelper.validateCCBCWarrantNumber(warrantNumber);
	    	if (ecWarrant != null && ecCCBC != null)
	    	{
				ec = ecWarrant;
	    	}
	    }
    return ec;  

}

/***********************************************************************************/


Header_CaseNumber.tabIndex = 2;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties.";
Header_CaseNumber.transformToDisplay = toUpperCase;
Header_CaseNumber.transformToModel = toUpperCase;
Header_CaseNumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_CaseNumber.isReadOnly = isWarrantFound;
Header_CaseNumber.validateOn = [Header_CaseNumber.dataBinding];
Header_CaseNumber.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		// Check if format of CaseNumber is correct
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);

	}
	return ec;
}

/***********************************************************************************/


Header_CONumber.tabIndex = 3;
Header_CONumber.maxLength = 8;
Header_CONumber.componentName = "CO Number";
Header_CONumber.helpText = "The CO Number as quoted on the warrant.";
Header_CONumber.transformToDisplay = toUpperCase;
Header_CONumber.transformToModel = toUpperCase;
Header_CONumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_CONumber.isReadOnly = isWarrantFound;
Header_CONumber.validate = function()
{
   	var ec = null;
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) )
	{ 
		var coSearch = coNumber.search(CaseManValidationHelper.VALID_CONUMBER_PATTERN);
		if ( coSearch != 0 )
		{
			// Does not match any valid CO Number pattern
			ec = ErrorCode.getErrorCode("CaseMan_CO_invalidCONumberFormat_Msg");
		}
	}
	return ec;
}

/***********************************************************************************/

Header_IssueDate.tabIndex = 4;
Header_IssueDate.componentName = "Home Court Issue Date";
Header_IssueDate.helpText = "Enter the date the warrant was issued at the home court.";
Header_IssueDate.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssueDate.isReadOnly = isWarrantFound;

/***********************************************************************************/

Header_WarrantType.tabIndex = -1;
Header_WarrantType.componentName = "Warrant Type";
Header_WarrantType.helpText = "Enter the type of warrant issued.";
Header_WarrantType.isReadOnly = function() { return true; }

/***********************************************************************************/

Header_IssuedByCourtCode.tabIndex = 6;
Header_IssuedByCourtCode.maxLength = 3;
Header_IssuedByCourtCode.componentName = "Owning Court";
Header_IssuedByCourtCode.helpText = "The code of the court who originally issued the warrant.";
Header_IssuedByCourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_IssuedByCourtCode.dataBinding + "]/Name");
	if(courtName == null)
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;	
}
Header_IssuedByCourtCode.logicOn = [Header_IssuedByCourtCode.dataBinding];
Header_IssuedByCourtCode.logic = function()
{
	var value = Services.getValue(this.dataBinding);
	
	if(this.getValid()) {
		Services.setValue(Header_IssuedByCourtName.dataBinding, value);		
	}
}
Header_IssuedByCourtCode.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtCode.isReadOnly = isWarrantFound;

/***********************************************************************************/

Header_IssuedByCourtName.tabIndex = 7;
Header_IssuedByCourtName.componentName = "Owning Court Name";
Header_IssuedByCourtName.helpText = "The name of the court who originally issued the warrant.";
Header_IssuedByCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_IssuedByCourtName.rowXPath = "Court";
Header_IssuedByCourtName.keyXPath = "Code";
Header_IssuedByCourtName.displayXPath = "Name";
Header_IssuedByCourtName.strictValidation = true;
Header_IssuedByCourtName.logicOn = [Header_IssuedByCourtName.dataBinding];
Header_IssuedByCourtName.logic = function()
{
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName != null) {
		// The entered value must be valid
		Services.setValue(Header_IssuedByCourtCode.dataBinding, value);
	}
}
Header_IssuedByCourtName.transformToDisplay = toUpperCase;
Header_IssuedByCourtName.transformToModel = toUpperCase;
Header_IssuedByCourtName.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtName.isReadOnly = isWarrantFound;

/***********************************************************************************/

function Header_IssuedByCourtLOVButton() {};
Header_IssuedByCourtLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_IssuedByCourtCode" }, { key: Key.F6, element: "Header_IssuedByCourtName" } ]
	}
};
Header_IssuedByCourtLOVButton.tabIndex = 8;
/**
 * @author fzj0yl
 * 
 */
Header_IssuedByCourtLOVButton.actionBinding = function() 
{
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_IssuedByCourtCode.dataBinding);
	Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);	
}
Header_IssuedByCourtLOVButton.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtLOVButton.isEnabled = function() {
    return !isWarrantFound();
}
/***********************************************************************************/

function SearchButton() {};

SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "reissueWarrants" } ]
	}
};

SearchButton.tabIndex = 9;
SearchButton.enableOn = [Header_WarrantNumber.dataBinding, Header_CaseNumber.dataBinding, Header_CONumber.dataBinding, Header_IssueDate.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_IssuedByCourtName.dataBinding];
SearchButton.isEnabled = function() {
    if(CaseManUtils.isBlank(Services.getValue(Header_WarrantNumber.dataBinding)) &&
       CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) &&
       CaseManUtils.isBlank(Services.getValue(Header_IssueDate.dataBinding)) &&
       CaseManUtils.isBlank(Services.getValue(Header_CONumber.dataBinding))) {
        return false;
    }
    if(isWarrantFound()) {
        return false;
    }
    if (!Services.getAdaptorById("Header_IssuedByCourtName").getValid())
    {
        return false;
    }
    
    if (!Services.getAdaptorById("Header_IssuedByCourtCode").getValid())
    {
        return false;
    }
    
    if (!Services.getAdaptorById("Header_CaseNumber").getValid())
    {
        return false;
    }
    
    if (!Services.getAdaptorById("Header_CONumber").getValid())
    {
        return false;
    }
   
    if (!Services.getAdaptorById("Header_WarrantNumber").getValid())
    {
        return false;
    }
    
    // Next if added for defect 5206.
    if (!Services.getAdaptorById("Header_IssueDate").getValid())
    {
        return false;
    }
    
    return true;
}
/**
 * @author fzj0yl
 * 
 */
SearchButton.actionBinding = function() {
    var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
    if(CaseManUtils.isBlank(warrantNumber)) {
        warrantNumber = "";
    } else {
        warrantNumber = warrantNumber;
    }

    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    if(CaseManUtils.isBlank(caseNumber)) {
        caseNumber = "";
    } else {
        caseNumber = caseNumber;
    }

    var CONumber = Services.getValue(Header_CONumber.dataBinding);
    if(CaseManUtils.isBlank(CONumber)) {
        CONumber = "";
    } else {
        CONumber = CONumber;
    }
  
    var issueDate = Services.getValue(Header_IssueDate.dataBinding);
    if(CaseManUtils.isBlank(issueDate)) {
        issueDate = "";
    }

    var issuedBy = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(CaseManUtils.isBlank(issuedBy)) {
        issuedBy = "";
    } else {
        issuedBy = issuedBy;
    }
    
    var params = new ServiceParams();
    params.addSimpleParameter("warrantNumber", warrantNumber);
    params.addSimpleParameter("caseNumber", caseNumber);
    params.addSimpleParameter("localNumber", "");
    params.addSimpleParameter("CONumber", CONumber);
    params.addSimpleParameter("executedBy", "");
    params.addSimpleParameter("issueDate", issueDate);
    params.addSimpleParameter("issuedBy", issuedBy);    
    Services.callService("searchWarrants", params, SearchButton, true);
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
SearchButton.onSuccess = function(dom) 
{
    if(dom != null) {
        Services.startTransaction();
        var node = dom.selectSingleNode("/ds/Warrants");
        // Save the search results into the dom
        Services.replaceNode(XPathConstants.SEARCH_RESULTS_XPATH, node);
        // Remove any warrants that are foreign warrants, have already been re-issued, or were issued in error
        Services.removeNode(XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant[./LocalNumber != '' or ./FinalReturnCodes/FinalReturn/Code = '157' or ./FinalReturnCodes/FinalReturn/Code = '158']");
        Services.endTransaction();
        var count = Services.countNodes(XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant");
        if(count == 0) {
           alert(Messages.NO_RESULTS_MESSAGE); 
        } else if(count == 1) {
           var warrantID = Services.getValue(XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant/WarrantID");

           // Retrieve the details of the warrant.
           var params = new ServiceParams();
           params.addSimpleParameter("warrantID", warrantID);
           Services.callService("getWarrant", params, SearchResultsLOVGrid, true);		    
           
        } else {
            Services.dispatchEvent("SearchResultsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
        }
    }
}

/******************************* MAIN PANEL FIELDS *********************************/

function Claimant_Name() {};
Claimant_Name.tabIndex = -1;
Claimant_Name.helpText = "Name of the party for on the warrant";
Claimant_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Name";
Claimant_Name.isReadOnly = function() { return true; }
Claimant_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Claimant_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Name() {};
Solicitor_Name.tabIndex = -1;
Solicitor_Name.helpText = "Name of the solicitor of the party for on the warrant";
Solicitor_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Name";
Solicitor_Name.isReadOnly = function() { return true; }
Solicitor_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line1() {};
Solicitor_Address_Line1.tabIndex = -1;
Solicitor_Address_Line1.helpText = "First address line of the solicitor of the party for on the warrant";
Solicitor_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[1]";
Solicitor_Address_Line1.isReadOnly = function() { return true; }
Solicitor_Address_Line1.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line1.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line2() {};
Solicitor_Address_Line2.tabIndex = -1;
Solicitor_Address_Line2.helpText = "Second address line of the solicitor of the party for on the warrant";
Solicitor_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[2]";
Solicitor_Address_Line2.isReadOnly = function() { return true; }
Solicitor_Address_Line2.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line2.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line3() {};
Solicitor_Address_Line3.tabIndex = -1;
Solicitor_Address_Line3.helpText = "Third address line of the solicitor of the party for on the warrant";
Solicitor_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[3]";
Solicitor_Address_Line3.isReadOnly = function() { return true; }
Solicitor_Address_Line3.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line3.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line4() {};
Solicitor_Address_Line4.tabIndex = -1;
Solicitor_Address_Line4.helpText = "Fourth address line of the solicitor of the party for on the warrant";
Solicitor_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[4]";
Solicitor_Address_Line4.isReadOnly = function() { return true; }
Solicitor_Address_Line4.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line4.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line5() {};
Solicitor_Address_Line5.tabIndex = -1;
Solicitor_Address_Line5.helpText = "Fifth address line of the solicitor of the party for on the warrant";
Solicitor_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[5]";
Solicitor_Address_Line5.isReadOnly = function() { return true; }
Solicitor_Address_Line5.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line5.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_PostCode() {};
Solicitor_Address_PostCode.tabIndex = -1;
Solicitor_Address_PostCode.helpText = "Postcode of the solicitor of the party for on the warrant";
Solicitor_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/PostCode";
Solicitor_Address_PostCode.isReadOnly = function() { return true; }
Solicitor_Address_PostCode.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_PostCode.isEnabled = isWarrantFound;

/***********************************************************************************/

function ExecutingCourtCode() {};
ExecutingCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/ExecutingCourtCode";
ExecutingCourtCode.tabIndex = 20;
ExecutingCourtCode.maxLength = 3;
ExecutingCourtCode.componentName = "Executing Court Code";
ExecutingCourtCode.helpText = "The code of the court who is to execute the warrant.";
ExecutingCourtCode.isMandatory = function() { return true; }
ExecutingCourtCode.validate = function() {
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName == null || Services.getValue(this.dataBinding) == CaseManUtils.CCBC_COURT_CODE) {
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;	
}
ExecutingCourtCode.logicOn = [ExecutingCourtCode.dataBinding];
ExecutingCourtCode.logic = function() {
	Services.startTransaction();

	if(this.getValid()) {
	    var value = Services.getValue(this.dataBinding)
		Services.setValue(ExecutingCourtName.dataBinding, value);
		var issuedBy = Services.getValue(XPathConstants.WARRANT_BASE + "/IssuedBy");
		if(value != issuedBy) {
		    Services.setValue(BailiffAreaNo.dataBinding, "99");
		}
	}

	Services.endTransaction();
}
ExecutingCourtCode.enableOn = [XPathConstants.WARRANT_ID_XPATH];
ExecutingCourtCode.isEnabled = isWarrantFound;

/***********************************************************************************/

function ExecutingCourtName() {};
ExecutingCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/ExecutingCourtNameAutocomplete";
ExecutingCourtName.tabIndex = 21;
ExecutingCourtName.componentName = "Executing Court Name";
ExecutingCourtName.helpText = "The name of the court who is to execute the warrant";
ExecutingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
ExecutingCourtName.isMandatory = function() { return true; }
ExecutingCourtName.rowXPath = "Court";
ExecutingCourtName.keyXPath = "Code";
ExecutingCourtName.displayXPath = "Name";
ExecutingCourtName.strictValidation = true;
ExecutingCourtName.logicOn = [ExecutingCourtName.dataBinding];
ExecutingCourtName.logic = function()
{
	Services.startTransaction();
	
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName != null) {
		// The entered value must be valid
		Services.setValue(ExecutingCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.WARRANT_BASE + "/ExecutingCourtName", courtName);
	}
	
	Services.endTransaction();
}
ExecutingCourtName.logicOn = [ExecutingCourtName.dataBinding];
ExecutingCourtName.logic = function()
{
	Services.startTransaction();
	
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName != null) {
		// The entered value must be valid
		Services.setValue(ExecutingCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.WARRANT_BASE + "/ExecutingCourtName", courtName);
	}
	
	Services.endTransaction();
}
ExecutingCourtName.transformToDisplay = toUpperCase;
ExecutingCourtName.transformToModel = toUpperCase;
ExecutingCourtName.enableOn = [XPathConstants.WARRANT_ID_XPATH];
ExecutingCourtName.isEnabled = isWarrantFound;

/***********************************************************************************/

function ExecutingCourtLOVButton() {};
ExecutingCourtLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "ExecutingCourtCode" }, { key: Key.F6, element: "ExecutingCourtName" } ]
	}
};
ExecutingCourtLOVButton.tabIndex = 22;
/**
 * @author fzj0yl
 * 
 */
ExecutingCourtLOVButton.actionBinding = function() {
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, ExecutingCourtCode.dataBinding);
    Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);    
}
ExecutingCourtLOVButton.enableOn = [XPathConstants.WARRANT_ID_XPATH];
ExecutingCourtLOVButton.isEnabled = isWarrantFound;

/***********************************************************************************/

function BailiffAreaNo() {};
BailiffAreaNo.dataBinding = XPathConstants.WARRANT_BASE + "/BailiffAreaNo";
BailiffAreaNo.tabIndex = 23;
BailiffAreaNo.maxLength = 2;
BailiffAreaNo.componentName = "Bailiff Area No";
BailiffAreaNo.helpText = "Enter the Bailiff's area number.";
BailiffAreaNo.validate = function() {
	var value = Services.getValue(this.dataBinding);
	if(!CaseManValidationHelper.validateNumber(value)) {
	    return ErrorCode.getErrorCode("CaseMan_invalidBailiffAreaNo_Msg");
	}
	return null;
}
BailiffAreaNo.enableOn = [XPathConstants.WARRANT_ID_XPATH];
BailiffAreaNo.isEnabled = isWarrantFound;

/***********************************************************************************/

function DateRequestReceived() {};
DateRequestReceived.dataBinding = XPathConstants.WARRANT_BASE + "/DateRequestReceived";
DateRequestReceived.tabIndex = 24;
DateRequestReceived.componentName = "Date Request Received";
DateRequestReceived.helpText = "The date when the warrant was received at the court.";
DateRequestReceived.isMandatory = function() { return true; }
DateRequestReceived.validate = function() {
	var value = Services.getValue(this.dataBinding);

	if (CaseManUtils.convertDateToDisplay(value) == null) {
		return ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');		
	}
	
	if(!validateNonWorkingDate(value)) {
	    return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
	}

	var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	var date = CaseManUtils.createDate(value);	
	
    // Check that the date is not before the home court issue date
    var issueDate = Services.getValue(Header_IssueDate.dataBinding);
    if(!CaseManUtils.isBlank(issueDate)) {
        var compare = CaseManUtils.compareDates(date, CaseManUtils.createDate(issueDate));
        if(compare > 0) {
            return ErrorCode.getErrorCode("CaseMan_dateBeforeIssueDate_Msg");
        }
    }

	// Check for a future date
	if (null != date) {
		var compare = CaseManUtils.compareDates(today, date);
		if(compare > 0) {
		    return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}

		var oneMonthAgo = CaseManUtils.oneMonthEarlier(today);
		compare = CaseManUtils.compareDates(date, oneMonthAgo);
		if(compare > 0) {
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}	
	}	
}
DateRequestReceived.enableOn = [XPathConstants.WARRANT_ID_XPATH];
DateRequestReceived.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_BalanceOfDebt() {};
WarrantDetails_BalanceOfDebt.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebt";
WarrantDetails_BalanceOfDebt.tabIndex = 31;
WarrantDetails_BalanceOfDebt.maxLength = 12;
WarrantDetails_BalanceOfDebt.componentName = "Balance of Debt";
WarrantDetails_BalanceOfDebt.helpText = "Enter the outstanding balance of the judgment debt.";
WarrantDetails_BalanceOfDebt.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.mandatoryOn = [XPathConstants.WARRANT_BASE + "/WarrantType"];
WarrantDetails_BalanceOfDebt.isMandatory = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    var warrantType = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantType");
    if( (warrantType == "EXECUTION" || warrantType == "CONTROL") && issuingCourt != CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}
WarrantDetails_BalanceOfDebt.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");

	    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
	    if(errCode == null && value == 0 && (warrantType == "EXECUTION" || warrantType == "CONTROL")) {
	        errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 1000000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange11_Msg");
		}
	}
	return errCode;
}
WarrantDetails_BalanceOfDebt.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_BalanceOfDebt.isEnabled = isWarrantFound;
WarrantDetails_BalanceOfDebt.readOnlyOn = [Header_IssuedByCourtCode.dataBinding];
WarrantDetails_BalanceOfDebt.isReadOnly = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(issuingCourt == CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}

/***********************************************************************************/

function WarrantDetails_BalanceOfDebtCurrency() {};
WarrantDetails_BalanceOfDebtCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebtCurrency";
WarrantDetails_BalanceOfDebtCurrency.tabIndex = -1;
WarrantDetails_BalanceOfDebtCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceOfDebtCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceOfDebtCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_BalanceOfDebtCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_BalanceOfDebtCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_AmountOfWarrant() {};
WarrantDetails_AmountOfWarrant.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrant";
WarrantDetails_AmountOfWarrant.tabIndex = 33;
WarrantDetails_AmountOfWarrant.maxLength = 12;
WarrantDetails_AmountOfWarrant.componentName = "Amount of Warrant";
WarrantDetails_AmountOfWarrant.helpText = "Enter the amount the warrant is issued for";
WarrantDetails_AmountOfWarrant.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.mandatoryOn = [XPathConstants.WARRANT_BASE + "/WarrantType"];
WarrantDetails_AmountOfWarrant.isMandatory = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    var warrantType = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantType");
    if((warrantType == "EXECUTION" || warrantType == "CONTROL") && issuingCourt != CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}
WarrantDetails_AmountOfWarrant.validateOn = [WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_BalanceOfDebt.dataBinding];
WarrantDetails_AmountOfWarrant.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;

	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");

		if(errCode == null) {
		    value = parseFloat(value);
		}
		
	    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
	    if(errCode == null && value == 0 && (warrantType == "EXECUTION" || warrantType == "CONTROL")) {
	        errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 1000000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange11_Msg");
		}
		
		var balanceOfDebt = Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding);
		if(errCode == null && balanceOfDebt != null && !isNaN(balanceOfDebt)&& value > parseFloat(balanceOfDebt)) {
	        errCode = ErrorCode.getErrorCode("CaseMan_invalidAmountOfWarrant_Msg");
		}
	}
	return errCode;
}
WarrantDetails_AmountOfWarrant.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_AmountOfWarrant.isEnabled = isWarrantFound;
WarrantDetails_AmountOfWarrant.readOnlyOn = [Header_IssuedByCourtCode.dataBinding];
WarrantDetails_AmountOfWarrant.isReadOnly = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(issuingCourt == CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}

/***********************************************************************************/

function WarrantDetails_AmountOfWarrantCurrency() {};
WarrantDetails_AmountOfWarrantCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrantCurrency";
WarrantDetails_AmountOfWarrantCurrency.tabIndex = -1;
WarrantDetails_AmountOfWarrantCurrency.isReadOnly = function() { return true; }
WarrantDetails_AmountOfWarrantCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_AmountOfWarrantCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_AmountOfWarrantCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_AmountOfWarrantCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_Fee() {};
WarrantDetails_Fee.dataBinding = XPathConstants.WARRANT_BASE + "/Fee";
WarrantDetails_Fee.tabIndex = 35;
WarrantDetails_Fee.maxLength = 11;
WarrantDetails_Fee.componentName = "Warrant Fee";
WarrantDetails_Fee.helpText = "The fee for re-issuing the warrant";
WarrantDetails_Fee.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_Fee.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_Fee.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	var maximum = parseFloat(Services.getValue(XPathConstants.MAX_FEE_XPATH));
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value < 0) 
		{
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} 
		else if (errCode == null && parseFloat(value) > maximum) 
		{
			var currencyCode = Services.getValue(WarrantDetails_FeeCurrency.dataBinding);
			var currencySymbol = transformCurrencyToDisplay(currencyCode);
			errCode = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg");
			errCode.m_message = errCode.m_message.replace(/XXX/, currencySymbol + parseFloat(maximum).toFixed(2));
		}
	}
	return errCode;
}
WarrantDetails_Fee.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_Fee.isEnabled = isWarrantFound;
WarrantDetails_Fee.readOnlyOn = [Header_IssuedByCourtCode.dataBinding];
WarrantDetails_Fee.isReadOnly = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(issuingCourt == CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}

/***********************************************************************************/

function WarrantDetails_FeeCurrency() {};
WarrantDetails_FeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/FeeCurrency";
WarrantDetails_FeeCurrency.tabIndex = -1;
WarrantDetails_FeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_FeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_FeeCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_FeeCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_FeeCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_LandRegistryFee() {};
WarrantDetails_LandRegistryFee.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFee";
WarrantDetails_LandRegistryFee.tabIndex = 37;
WarrantDetails_LandRegistryFee.maxLength = 11;
WarrantDetails_LandRegistryFee.componentName = "Land Registry Fee";
WarrantDetails_LandRegistryFee.helpText = "Enter the fee paid for a search under the Agricultural Credits Act 1928";
WarrantDetails_LandRegistryFee.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_LandRegistryFee.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_LandRegistryFee.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 100000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange10_Msg");
		}
	}
	return errCode;
}
WarrantDetails_LandRegistryFee.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_LandRegistryFee.isEnabled = isWarrantFound;
WarrantDetails_LandRegistryFee.readOnlyOn = [Header_IssuedByCourtCode.dataBinding];
WarrantDetails_LandRegistryFee.isReadOnly = function() {
    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(issuingCourt == CaseManUtils.CCBC_COURT_CODE) {
        return true;
    }
    return false;
}

/***********************************************************************************/

function WarrantDetails_LandRegistryFeeCurrency() {};
WarrantDetails_LandRegistryFeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFeeCurrency";
WarrantDetails_LandRegistryFeeCurrency.tabIndex = -1;
WarrantDetails_LandRegistryFeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_LandRegistryFeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_LandRegistryFeeCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_LandRegistryFeeCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_LandRegistryFeeCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_Total() {};
WarrantDetails_Total.dataBinding = XPathConstants.WARRANT_BASE + "/Total";
WarrantDetails_Total.tabIndex = -1;
WarrantDetails_Total.helpText = "The total sum of the warrant";
WarrantDetails_Total.isReadOnly = function() { return true; }
WarrantDetails_Total.transformToDisplay = function(value) 
{
	if ( !isWarrantFound() ) { return ""; }
	
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
WarrantDetails_Total.logicOn = [WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
WarrantDetails_Total.logic = function(event) 
{
    var value = 0;
	for (var i=0; i<WarrantDetails_Total.logicOn.length; i++)
	{
		var temp = Services.getValue(WarrantDetails_Total.logicOn[i]);
		if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) )
		{
			value = value + parseFloat(temp);
		}
	}
	Services.setValue(WarrantDetails_Total.dataBinding, value);
}
WarrantDetails_Total.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_Total.isEnabled = isWarrantFound;


/***********************************************************************************/

function WarrantDetails_TotalCurrency() {};
WarrantDetails_TotalCurrency.retrieveOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_TotalCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/TotalCurrency";
WarrantDetails_TotalCurrency.tabIndex = -1;
WarrantDetails_TotalCurrency.isReadOnly = function() { return true; }
WarrantDetails_TotalCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_TotalCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_TotalCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_TotalCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaid() {};
WarrantDetails_BalanceAfterPaid.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaid";
WarrantDetails_BalanceAfterPaid.helpText = "The balance of the debt after payments";
WarrantDetails_BalanceAfterPaid.tabIndex = -1;
WarrantDetails_BalanceAfterPaid.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaid.transformToDisplay = function(value) 
{
	if ( !isWarrantFound() ) { return ""; }
	
	return CaseManUtils.transformAmountToTwoDP(value, null);
}
WarrantDetails_BalanceAfterPaid.logicOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_BalanceAfterPaid.logic = function(event) {
    var balanceOfDebt = Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding);
    
    var value = 0;
    if(!CaseManUtils.isBlank(balanceOfDebt) && !isNaN(balanceOfDebt)) {
        var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
        if(!CaseManUtils.isBlank(amountOfWarrant) && !isNaN(amountOfWarrant)) {
            value = balanceOfDebt - amountOfWarrant;
            
        }
    }
    Services.setValue(WarrantDetails_BalanceAfterPaid.dataBinding, value);
}
WarrantDetails_BalanceAfterPaid.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_BalanceAfterPaid.isEnabled = isWarrantFound;

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaidCurrency() {};
WarrantDetails_BalanceAfterPaidCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaidCurrency";
WarrantDetails_BalanceAfterPaidCurrency.tabIndex = -1;
WarrantDetails_BalanceAfterPaidCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaidCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceAfterPaidCurrency.transformToModel = transformCurrencyToModel;
WarrantDetails_BalanceAfterPaidCurrency.enableOn = [XPathConstants.WARRANT_ID_XPATH];
WarrantDetails_BalanceAfterPaidCurrency.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Name() {};
Defendant1_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Name";
Defendant1_Name.tabIndex = -1;
Defendant1_Name.maxLength = 70;
Defendant1_Name.componentName = "First Party Against Name";
Defendant1_Name.helpText = "Name of party.";
Defendant1_Name.isReadOnly = function() { return true; }
Defendant1_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line1() {};
Defendant1_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[1]";
Defendant1_Address_Line1.isMandatory = function() { return true; }
Defendant1_Address_Line1.tabIndex = 61;
Defendant1_Address_Line1.maxLength = 35;
Defendant1_Address_Line1.componentName = "Address Line 1";
Defendant1_Address_Line1.helpText = "First line of party's address.";
Defendant1_Address_Line1.transformToDisplay = toUpperCase;
Defendant1_Address_Line1.transformToModel = convertToUpperStripped;
Defendant1_Address_Line1.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line1.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line2() {};
Defendant1_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[2]";
Defendant1_Address_Line2.isMandatory = function() { return true; }
Defendant1_Address_Line2.tabIndex = 62;
Defendant1_Address_Line2.maxLength = 35;
Defendant1_Address_Line2.componentName = "Address Line 2";
Defendant1_Address_Line2.helpText = "Second line of party's address.";
Defendant1_Address_Line2.transformToDisplay = toUpperCase;
Defendant1_Address_Line2.transformToModel = convertToUpperStripped;
Defendant1_Address_Line2.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line2.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line3() {};
Defendant1_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[3]";
Defendant1_Address_Line3.tabIndex = 63;
Defendant1_Address_Line3.maxLength = 35;
Defendant1_Address_Line3.componentName = "Address Line 3";
Defendant1_Address_Line3.helpText = "Third line of party's address.";
Defendant1_Address_Line3.transformToDisplay = toUpperCase;
Defendant1_Address_Line3.transformToModel = convertToUpperStripped;
Defendant1_Address_Line3.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line3.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line4() {};
Defendant1_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[4]";
Defendant1_Address_Line4.tabIndex = 64;
Defendant1_Address_Line4.maxLength = 35;
Defendant1_Address_Line4.componentName = "Address Line 4";
Defendant1_Address_Line4.helpText = "Fourth line of party's address.";
Defendant1_Address_Line4.transformToDisplay = toUpperCase;
Defendant1_Address_Line4.transformToModel = convertToUpperStripped;
Defendant1_Address_Line4.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line4.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line5() {};
Defendant1_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[5]";
Defendant1_Address_Line5.tabIndex = 65;
Defendant1_Address_Line5.maxLength = 35;
Defendant1_Address_Line5.componentName = "Address Line 5";
Defendant1_Address_Line5.helpText = "Fifth line of party's address.";
Defendant1_Address_Line5.transformToDisplay = toUpperCase;
Defendant1_Address_Line5.transformToModel = convertToUpperStripped;
Defendant1_Address_Line5.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line5.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_PostCode() {};
Defendant1_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/PostCode";
Defendant1_Address_PostCode.tabIndex = 66;
Defendant1_Address_PostCode.maxLength = 8;
Defendant1_Address_PostCode.componentName = "Postcode";
Defendant1_Address_PostCode.helpText = "Party's postcode.";
Defendant1_Address_PostCode.transformToDisplay = toUpperCase;
Defendant1_Address_PostCode.transformToModel = toUpperCase;
Defendant1_Address_PostCode.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_PostCode.isEnabled = isWarrantFound;
Defendant1_Address_PostCode.validate = function() {
	if(!CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding))) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
}

/***********************************************************************************/

function Defendant2_Name() {};
Defendant2_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Name";
Defendant2_Name.tabIndex = -1;
Defendant2_Name.maxLength = 70;
Defendant2_Name.componentName = "Second Party Against Name";
Defendant2_Name.helpText = "Name of party.";
Defendant2_Name.isReadOnly = function() { return true; }
Defendant2_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Name.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line1() {};
Defendant2_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[1]";
Defendant2_Address_Line1.tabIndex = 68;
Defendant2_Address_Line1.maxLength = 35;
Defendant2_Address_Line1.componentName = "Address Line 1";
Defendant2_Address_Line1.helpText = "First line of party's address.";
Defendant2_Address_Line1.transformToDisplay = toUpperCase;
Defendant2_Address_Line1.transformToModel = convertToUpperStripped;
Defendant2_Address_Line1.mandatoryOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line1.isMandatory = function() {
    if(CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding))) {
        return false;
    }
    return true;
}
Defendant2_Address_Line1.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_Line1.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line2() {};
Defendant2_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[2]";
Defendant2_Address_Line2.tabIndex = 69;
Defendant2_Address_Line2.maxLength = 35;
Defendant2_Address_Line2.componentName = "Address Line 2";
Defendant2_Address_Line2.helpText = "Second line of party's address.";
Defendant2_Address_Line2.transformToDisplay = toUpperCase;
Defendant2_Address_Line2.transformToModel = convertToUpperStripped;
Defendant2_Address_Line2.mandatoryOn = [Defendant2_Name.dataBinding];
Defendant2_Address_Line2.isMandatory = function() {
    if(CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding))) {
        return false;
    }
    return true;
}
Defendant2_Address_Line2.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_Line2.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line3() {};
Defendant2_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[3]";
Defendant2_Address_Line3.tabIndex = 70;
Defendant2_Address_Line3.maxLength = 35;
Defendant2_Address_Line3.componentName = "Address Line 3";
Defendant2_Address_Line3.helpText = "Third line of party's address.";
Defendant2_Address_Line3.transformToDisplay = toUpperCase;
Defendant2_Address_Line3.transformToModel = convertToUpperStripped;
Defendant2_Address_Line3.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_Line3.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line4() {};
Defendant2_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[4]";
Defendant2_Address_Line4.tabIndex = 71;
Defendant2_Address_Line4.maxLength = 35;
Defendant2_Address_Line4.componentName = "Address Line 4";
Defendant2_Address_Line4.helpText = "Fourth line of party's address.";
Defendant2_Address_Line4.transformToDisplay = toUpperCase;
Defendant2_Address_Line4.transformToModel = convertToUpperStripped;
Defendant2_Address_Line4.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_Line4.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line5() {};
Defendant2_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[5]";
Defendant2_Address_Line5.tabIndex = 72;
Defendant2_Address_Line5.maxLength = 35;
Defendant2_Address_Line5.componentName = "Address Line 5";
Defendant2_Address_Line5.helpText = "Fifth line of party's address.";
Defendant2_Address_Line5.transformToDisplay = toUpperCase;
Defendant2_Address_Line5.transformToModel = convertToUpperStripped;
Defendant2_Address_Line5.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_Line5.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_PostCode() {};
Defendant2_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/PostCode";
Defendant2_Address_PostCode.tabIndex = 73;
Defendant2_Address_PostCode.maxLength = 8;
Defendant2_Address_PostCode.componentName = "Postcode";
Defendant2_Address_PostCode.helpText = "Party's postcode.";
Defendant2_Address_PostCode.transformToDisplay = toUpperCase;
Defendant2_Address_PostCode.transformToModel = toUpperCase;
Defendant2_Address_PostCode.enableOn = [XPathConstants.WARRANT_ID_XPATH, Defendant2_Name.dataBinding];
Defendant2_Address_PostCode.isEnabled = function() {
    if(!isWarrantFound()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_PostCode.validate = function() {
	if(!CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding))) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
}

/***********************************************************************************/

function Additional_Notes() {};
Additional_Notes.dataBinding = XPathConstants.WARRANT_BASE + "/AdditionalNotes";
Additional_Notes.tabIndex = 74;
Additional_Notes.maxLength = 120;
Additional_Notes.componentName = "Additional Notes";
Additional_Notes.helpText = "Enter any further information regarding the execution of this warrant.";
Additional_Notes.transformToDisplay = toUpperCase;
Additional_Notes.transformToModel = convertToUpperStripped;
Additional_Notes.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Additional_Notes.isEnabled = isWarrantFound;

/******************************* STATUS BAR FIELDS *****************************************/

function Status_CancelButton() {}

Status_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "reissueWarrants" } ]
	}
};

Status_CancelButton.tabIndex = 92;
Status_CancelButton.actionBinding = checkChangesMadeBeforeExit;

/***********************************************************************************/

function Status_ClearButton() {}

Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "reissueWarrants", alt: true } ]
	}
};

Status_ClearButton.tabIndex = 91;
/**
 * @author fzj0yl
 * 
 */
Status_ClearButton.actionBinding = function() {
	if (confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE)) {
		clearScreen();
	}	
}

/***********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "reissueWarrants" } ]
	}
};

Status_SaveButton.tabIndex = 90;
/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	if ( isWarrantFound() && changesMade() )
	{
		var invalidFields = FormController.getInstance().validateForm(true);
		if ( 0 == invalidFields.length ) 
		{
		    // Update some details for the re-issue
			Services.setValue( XPathConstants.WARRANT_BASE + "/IssueDate", CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate") );
			Services.setValue( XPathConstants.WARRANT_BASE + "/OriginalWarrantNumber", Services.getValue(Header_WarrantNumber.dataBinding) );
			
			// If reissuing an EXECUTION warrant, convert it to a CONTROL warrant
			var warrantType = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantType");
			if ( warrantType == "EXECUTION" )
			{
				Services.setValue( XPathConstants.WARRANT_BASE + "/WarrantType", "CONTROL" );
			}
			
			var warrantNode = Services.getNode(XPathConstants.WARRANT_BASE).cloneNode(true);
			
			// Save the details
			var newDOM = XML.createDOM(null, null, null);
			var dsNode = XML.createElement(newDOM, "ds");
			dsNode.appendChild(warrantNode);
			newDOM.appendChild(dsNode);
			var params = new ServiceParams();
			params.addDOMParameter("warrantDetails", newDOM);
			
			var coNumber = Services.getValue(Header_CONumber.dataBinding);
			if(CaseManUtils.isBlank(coNumber)) {
				Services.callService("addWarrant", params, Status_SaveButton, true);
			}
			else {
				Services.callService("addWarrantForCo", params, Status_SaveButton, true);
			}
		}
	} else if (!changesMade()){
		var errCode = ErrorCode.getErrorCode('CaseMan_reissueWarrantNoChangesMade_Msg');
		Services.setTransientStatusBarMessage(errCode.getMessage());
	}
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName) 
{
	if ( null != dom ) 
	{
		var warrantNumber = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/WarrantNumber"));
		alert( Messages.WARRANT_REISSUED_SUCCESSFULLY.replace(/XXX/, warrantNumber) );
		
		var temp = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		switch (temp)
		{
			case ActionAfterSave.ACTION_NAVIGATE:
				NavigationController.nextScreen();
				break;
			case ActionAfterSave.ACTION_EXIT:
				exitScreen();
				break;
			case ActionAfterSave.ACTION_CLEARFORM:
			default:
			    clearScreen();
				break;
		}
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG))
	{
	    // Reload the warrant record
		var warrantID = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantID");
		var params = new ServiceParams();
		params.addSimpleParameter("warrantID", warrantID);
		Services.callService("getWarrant", params, SearchResultsLOVGrid, true);				
	}
	else
	{
		exitScreen();
	}
}

/*********************************** LOV GRIDS *********************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubFormGrids/SelectedCourt";
CourtsLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtsLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtsLOVGrid.destroyOnClose = false;
/**
 * @author fzj0yl
 * @return ( xpath == ExecutingCourtCode.dataBinding ) ? "ExecutingCourtCode", "Header_IssuedByCourtCode"  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() 
{
	// Decide whether should focus on Issued By or Executing Code
    var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
    return ( xpath == ExecutingCourtCode.dataBinding ) ? "ExecutingCourtCode" : "Header_IssuedByCourtCode";
}

CourtsLOVGrid.logicOn = [CourtsLOVGrid.dataBinding];
CourtsLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(CourtsLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(CourtsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		// Set the destination xpath with the new court code and reset the LOV dataBinding
		var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
		Services.startTransaction();
		Services.setValue(xpath, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/***********************************************************************************/

function SearchResultsLOVGrid() {};
SearchResultsLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedWarrant";
SearchResultsLOVGrid.srcData = XPathConstants.SEARCH_RESULTS_XPATH;
SearchResultsLOVGrid.rowXPath = "Warrant";
SearchResultsLOVGrid.keyXPath = "WarrantID";
SearchResultsLOVGrid.columns = [
	{xpath: "IssuedByName"},
	{xpath: "IssueDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "WarrantNumber"},
	{xpath: "CaseNumber"},
	{xpath: "CONumber"}
];
SearchResultsLOVGrid.logicOn = [SearchResultsLOVGrid.dataBinding];
SearchResultsLOVGrid.logic = function(event) {
    var value = Services.getValue(this.dataBinding);
    if(!CaseManUtils.isBlank(value)) {
    	// Retrieve the details of the warrant.
    	var params = new ServiceParams();
    	params.addSimpleParameter("warrantID", value);
    	Services.callService("getWarrant", params, SearchResultsLOVGrid, true);		    
    }
}

SearchResultsLOVGrid.tempDom = null;
/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * @return null 
 */
SearchResultsLOVGrid.onSuccess = function(dom, serviceName) 
{
    if ( serviceName == "getWarrant" ) 
    {
        SearchResultsLOVGrid.tempDom = dom.cloneNode(true);
        var warrantData = dom.selectSingleNode(XPathConstants.WARRANT_BASE).cloneNode(true);
        
        var caseStatusNode = warrantData.selectSingleNode("CaseStatus");
        if( null != caseStatusNode && XML.getNodeTextContent(caseStatusNode) == "TRANSFERRED" ) 
        {
            alert(ErrorCode.getErrorCode("CaseMan_caseTransferredCannotReissue_Msg").getMessage());
            return;
        }
        
        var warrantStatus = XML.getNodeTextContent(warrantData.selectSingleNode("WarrantStatus").cloneNode(true));
        if( warrantStatus == "PAID" )
        {
            alert(ErrorCode.getErrorCode("CaseMan_warrantAlreadyPaid_Msg").getMessage());
            return;
        } 
        else if( warrantStatus == "LIVE" ) 
        {
            alert(ErrorCode.getErrorCode("CaseMan_warrantStillLive_Msg").getMessage());
            return;
        }
        
        var warrantType = XML.getNodeTextContent(warrantData.selectSingleNode("WarrantType").cloneNode(true));
        if ( warrantType == "AO" )
        {
        	var coStatus = XML.getNodeTextContent(warrantData.selectSingleNode("COStatus").cloneNode(true));
        	if ( coStatus != "LIVE" && coStatus != "PAID" )
        	{
        		alert(ErrorCode.getErrorCode("CaseMan_LiveAO_Msg").getMessage());
        		return;
        	}
        }
        
        var localNumber = XML.getNodeTextContent(warrantData.selectSingleNode("LocalNumber").cloneNode(true));
        if ( !CaseManUtils.isBlank(localNumber) )
        {
        	// CaseMan Defect 6501 - Foreign Warrants cannot be reissued
        	alert(Messages.REISSUE_FOREIGN_WARRANT_MESSAGE);
        	return;
        }
        
        /*
         * Retrieve the judgments for the case
         */
        var caseNumber = XML.getNodeTextContent(warrantData.selectSingleNode("CaseNumber").cloneNode(true));
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber", caseNumber);
		Services.callService("getJudgment", params, SearchResultsLOVGrid, true);		
    } 
    else if ( serviceName == "getJudgment" ) 
    {
        var judgmentData = dom.selectSingleNode("/ds/MaintainJudgment/Judgments");
    	if ( null != judgmentData )
    	{
    		// Add the Judgments data to the dom for reference later
	    	Services.replaceNode(XPathConstants.JUDGMENT_BASE, judgmentData);	
	    }
        
        /*
         * Do all of the judgment checks
         */
    	var warrantData = SearchResultsLOVGrid.tempDom.selectSingleNode(XPathConstants.WARRANT_BASE).cloneNode(true);
    	Services.replaceNode(XPathConstants.TEMP_WARRANT_BASE, warrantData);
        var warrantType = XML.getNodeTextContent(warrantData.selectSingleNode("WarrantType"));

        if(warrantType == "EXECUTION" || warrantType == "CONTROL")
        {
            var judgment1ID = null;
            var countD1Judgments = Services.countNodes(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/JudgmentID");
            if ( countD1Judgments == 1 )
            {
            	// Only one Judgment Id against the Defendant
            	judgment1ID = Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/JudgmentID");
            }
            else if ( countD1Judgments > 1 )
            {
            	// Multiple Judgments against the Defendant, search for a valid one
				// By default, use the first Judgment Id, in case no VALID judgments are available.
				judgment1ID = Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/JudgmentID[1]");
				
				// Search for the first Judgment in the list with a status of NULL or VARIED
				var judgmentIdList = Services.getNodes(XPathConstants.TEMP_WARRANT_BASE + "/Defendant1/JudgmentID");
				for (var i=0, l=judgmentIdList.length; i<l; i++)
				{
					var tempJudgmentId = XML.getNodeTextContent( judgmentIdList[i] );
					var tempJudgmentStatus = Services.getValue(XPathConstants.JUDGMENT_BASE + "/Judgment[./JudgmentId='" + tempJudgmentId + "']/Status");
					if( CaseManUtils.isBlank(tempJudgmentStatus) || tempJudgmentStatus == "VARIED" )
					{
						// There is a valid Judgment against Defendant 1
						judgment1ID = tempJudgmentId;
						break;
					}
				}
            }
            
            var judgment2ID = null;
            var countD2Judgments = Services.countNodes(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/JudgmentID");
            if ( countD2Judgments == 1 )
            {
            	// Only one Judgment Id against the Defendant
            	judgment2ID = Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/JudgmentID");
            }
            else if ( countD2Judgments > 1 )
            {
            	// Multiple Judgments against the Defendant, search for a valid one
				// By default, use the first Judgment Id, in case no VALID judgments are available.
				judgment2ID = Services.getValue(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/JudgmentID[1]");
				
				// Search for the first Judgment in the list with a status of NULL or VARIED
				var judgmentIdList = Services.getNodes(XPathConstants.TEMP_WARRANT_BASE + "/Defendant2/JudgmentID");
				for (var i=0, l=judgmentIdList.length; i<l; i++)
				{
					var tempJudgmentId = XML.getNodeTextContent( judgmentIdList[i] );
					var tempJudgmentStatus = Services.getValue(XPathConstants.JUDGMENT_BASE + "/Judgment[./JudgmentId='" + tempJudgmentId + "']/Status");
					if( CaseManUtils.isBlank(tempJudgmentStatus) || tempJudgmentStatus == "VARIED" )
					{
						// There is a valid Judgment against Defendant 2
						judgment2ID = tempJudgmentId;
						break;
					}
				}
            }
            
            // Retrieve the details of the judgments used to create this warrant
            var judgments = new Array(); 
            judgments[0] = Services.getNode(XPathConstants.JUDGMENT_BASE + "/Judgment[./JudgmentId='" + judgment1ID + "']");
            if ( !CaseManUtils.isBlank(judgment2ID) ) 
            { 
                judgments[1] = Services.getNode(XPathConstants.JUDGMENT_BASE + "/Judgment[./JudgmentId='" + judgment2ID + "']");
            }
            
			if ( judgments[0] != null ) 
			{
				for( var i = judgments.length - 1; i >= 0 ; i-- ) 
				{
	                // If the judgment is no longer live, this party can no longer be a party on the warrant
	                var status = XML.getNodeTextContent(judgments[i].selectSingleNode("Status"));
	                if(!CaseManUtils.isBlank(status) && status != "VARIED") 
	                {
		                var partyName = XML.getNodeTextContent(judgments[i].selectSingleNode("PartyAgainstName"));
		        	    var message = ErrorCode.getErrorCode("CaseMan_judgmentExistsWithStatus_Msg").getMessage();
		                alert(message.replace(/XXX/, partyName).replace(/YYY/, status));
		                if( removeDefendant(i+1) ) 
		                {
		                    return;
		                }	        	                    
	                }
				}
			}
        }
        
        /*
         * Do all of the checks which can result in a warning
         */
        var issueDate = CaseManUtils.createDate(XML.getNodeTextContent(warrantData.selectSingleNode("IssueDate")));
        var oneYearAgo = CaseManUtils.oneYearEarlier(CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate")));
        var compare = CaseManUtils.compareDates(issueDate, oneYearAgo);
		if(compare > 0) 
		{
			alert(Messages.ISSUE_DATE_1_YEAR_AGO);
		}	
                
        // Check if this warrant is from the users own court
        var owningCourt = XML.getNodeTextContent(warrantData.selectSingleNode("IssuedBy"));
        if ( owningCourt != Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) ) 
        {
	        var msg_ind = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
	        if ( msg_ind != "true" )
	        {
	            alert(Messages.WRONG_WARRANT_COURT);
	            Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
	        }
            Services.setValue(BailiffAreaNo.dataBinding, "99");
        }
 
        // check for any outstanding hearings
        var hearingNode = warrantData.selectSingleNode("Hearings/Hearing[1]");
        if ( hearingNode != null ) 
        {
            var hearingDate = XML.getNodeTextContent(hearingNode.selectSingleNode("Date"));
            var venueName = XML.getNodeTextContent(hearingNode.selectSingleNode("VenueName"));
	        var message = Messages.PENDING_HEARING.replace(/XXX/, CaseManUtils.convertDateToDisplay(hearingDate));
	        message = message.replace(/YYY/, venueName);
		    alert(message);
        }

		// check for applications to set aside
        if (warrantType == "EXECUTION" || warrantType == "CONTROL") 
        {
        	if (judgments[0] != null) {
	            for(var i = 0 ; i < judgments.length ; i++) 
	            {
	    		    // Check for an outstanding "Application to set aside"
	                var node = judgments[i].selectSingleNode("ApplicationsToSetAside/Application[./Result = '']");
	                if ( node != null ) 
	                {
	    		        var name = XML.getNodeTextContent(judgments[i].selectSingleNode("PartyAgainstName"));
	    		        alert(Messages.PENDING_SET_ASIDE_APPLICATION.replace(/XXX/, name));                
	                }
	    		    
	    		    // Check for an outstanding "Application to vary"
	    		    var found = false;
	    		    var applications = judgments[i].selectNodes("ApplicationsToVary/Variation");
	    		    for (var j = 0 ; j < applications.length ; j++) 
	    		    {
	    		        var result = XML.getNodeTextContent(applications[j].selectSingleNode("Result"));
	    		        if(CaseManUtils.isBlank(result) || result == "REFERRED TO JUDGE") 
	    		        {
	    		            // Application has no result
	    		            found = true;
	    		        } 
	    		        else 
	    		        {
				        	// CaseMan defect 6487, in some scenarios the PayDate node is empty
				        	var payDateNode = applications[j].selectSingleNode("PayDate");
				        	if ( null != payDateNode && !CaseManUtils.isBlank(XML.getNodeTextContent(payDateNode)) )
				        	{
	    		            	var payDate = XML.getNodeTextContent(payDateNode);
		    		            var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
		    		        	var date = CaseManUtils.createDate(payDate);
		    		        	var compare = CaseManUtils.compareDates(today, date);
		    		    		if(compare > 0) 
		    		    		{
		    		    		    // Application has a future payment date
		    		    		    found = true;
		    		    		}
				        	}
	    		        }
	    		    }
	    		    if(found) 
	    		    {
	    		        var name = XML.getNodeTextContent(judgments[i].selectSingleNode("PartyAgainstName"));
	    		        alert(Messages.PENDING_VARY_APPLICATION.replace(/XXX/, name));
	    		    }                
	            }
	        }
        }
        
        Services.startTransaction();
        Services.replaceNode(XPathConstants.WARRANT_BASE, Services.getNode(XPathConstants.TEMP_WARRANT_BASE).cloneNode(true));
        
        // Set some defaults for the re-issue
        Services.setValue(ReissueWarrantsParams.WARRANT_ID, Services.getValue(XPathConstants.WARRANT_ID_XPATH));

		// UCT_Group2 Defect 1617 - Only clear fields for non CCBC warrants
    	var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    	if ( issuingCourt != CaseManUtils.CCBC_COURT_CODE )
    	{
	        Services.setValue(WarrantDetails_BalanceOfDebt.dataBinding, "");
	        Services.setValue(WarrantDetails_AmountOfWarrant.dataBinding, "");
	        Services.setValue(WarrantDetails_Fee.dataBinding, "");
	        Services.setValue(WarrantDetails_LandRegistryFee.dataBinding, "");
	        Services.setValue(XPathConstants.WARRANT_BASE + "/SolicitorsCosts", "");
    	}

        Services.setValue(DateRequestReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
        Services.setValue(SearchResultsLOVGrid.dataBinding, "");  // Clear out the search result
        Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");	// Set dirty flag once have loaded record
        Services.endTransaction();
        Services.setFocus("ExecutingCourtCode");
    }
}
/**
 * @param exception
 * @author fzj0yl
 * 
 */
SearchResultsLOVGrid.onBusinessException = function(exception) {
	alert("Unable to load warrant details.");
}
/**
 * @param exception
 * @author fzj0yl
 * 
 */
SearchResultsLOVGrid.onSystemException = function(exception) 
{
    alert("Unable to load warrant details.");
}
/**
 * @author fzj0yl
 * @return "Header_WarrantNumber"  
 */
SearchResultsLOVGrid.nextFocusedAdaptorId = function() {
    return "Header_WarrantNumber";
}


