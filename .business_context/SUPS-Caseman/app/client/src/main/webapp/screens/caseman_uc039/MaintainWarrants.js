/** 
 * @fileoverview MaintainWarrants.js:
 * This file contains the field configurations for UC039 - Maintain Warrants screen
 *
 * @author Tim Connor
 * @version 0.1
 *
 * Changes:
 * 31/05/2006 - Chris Vincent, added JavaDoc comments and changed Global Variables to
 *              Static variables.  Also added dirty check on the Clear button.
 * 02/06/2006 - Chris Vincent, changed logic around setting the Live flag for warrants
 *				as the previous logic was incorrect.
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 * 07/08/2006 - Defect 4108 - allow CCBC legacy warrant numbers (format: XXnnnnn) to be included in validation criteria.
 * 10/08/2006 - Chris Vincent, applied guard to Header_IssueDate.validate() so only validates if
 * 				the date field is updated and not when data is loaded as was causing issue in DMST.
 * 04/09/2006 - Chris Vincent, all currency code symbols were set to '?' so changed them to £ or € where
 * 				appropriate.  Fixed defect 5028.
 * 08/09/2006 - Paul Roberts, defect 5170 - added warrent number validate on.
 * 25/09/2006 - Paul Robinson, defect 5211 - CCBC warrants can be either Legacy or SUPS format
 * 15/12/2007 - Chris Vincent, hint text applied to WarrantDetails_Total, WarrantDetails_BalanceAfterPaid, 
 * 				WarrantDetails_AdditionalFees, WarrantDetails_FeeRefunds, WarrantDetails_PaymentsToDate, 
 * 				WarrantDetails_TotalRemaining and WarrantDetails_PrintStatus (Temp_CaseMan defect 323).
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 02/05/2007 - Chris Vincent, updates for defect 6155 including calling getAllCourtsShort to include those 
 * 				courts not in service which are required for the Issuing Court Code field and changes to the
 * 				executing court code fields validation preventing selection of a court not in service.  The  
 * 				error message for the issuing court code has also been updated.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearScreen() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 28/09/2009 - Chris Vincent, added flags for checking when the Warrant Fee field is updated so that the
 *              service method only performs Warrant Fee processing if the fee changes.  TRAC 1676.
 * 09/08/2010 - Chris Vincent, added different alert message when forward a Reissued Warrant.  Trac 2848.
 * 05/10/2010 - Chris Vincent, added checkWarrantPaymentsExist() for validation prior to navigation to
 *				View Payments screen.  Trac 3818.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Warrant Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes mean where EXECUTION warrants are referenced, CONTROL warrants must be 
 *				processed in the same way as they are replacing EXECUTION warrants.
 */

/*****************************************************************************************************************
		FUNCTION CLASSES
*****************************************************************************************************************/

function Header_WarrantNumber() {};
function Header_CaseNumber() {};
function Header_ExecutingCourtCode() {};
function Header_ExecutingCourtName() {};
function Header_IssuedByCourtCode() {};
function Header_IssuedByCourtName() {};
function Header_CONumber() {};
function Header_LocalNumber() {};
function Header_IssueDate() {};
function Header_WarrantType() {};

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
XPathConstants.WARRANT_ID_XPATH = XPathConstants.WARRANT_BASE + "/WarrantID";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='WARRANT_FEE']/ItemValue";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.LOVCOURT_DESTINATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/LOVCourtDestinationXPath";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ActionAfterSave";

/***************************** DATA BINDINGS **************************************/

Header_WarrantNumber.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantNumber";
Header_CaseNumber.dataBinding = XPathConstants.WARRANT_BASE + "/CaseNumber";
Header_ExecutingCourtCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/Header_ExecutingCourtCode";
Header_ExecutingCourtName.dataBinding = "/ds/var/page/tmp/Header_ExecutingCourtNameAutocomplete";
Header_IssuedByCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/IssuedBy";
Header_IssuedByCourtName.dataBinding = "/ds/var/page/tmp/IssuedByAutocomplete";
Header_CONumber.dataBinding = XPathConstants.WARRANT_BASE + "/CONumber";
Header_LocalNumber.dataBinding = XPathConstants.WARRANT_BASE + "/LocalNumber";
Header_IssueDate.dataBinding = XPathConstants.WARRANT_BASE + "/IssueDate";
Header_WarrantType.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantType";

/*****************************************************************************************************************/

/**
 * Actions After Saving
 * @author fzj0yl
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_RELOAD = "RELOAD";
ActionAfterSave.ACTION_NAVIGATE = "NAVIGATE";
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";

/******************************* FUNCTIONS *****************************************/

/**
 * Function which determines if the warrant record should be read-only
 * @author fzj0yl
 * @return boolean, maintainWarrants.isReadOnlyFlag  
 */
function isReadOnly() 
{
    if( !isWarrantFound() ) 
    {
        return true;
    }
    
    if( null == maintainWarrants.isReadOnlyFlag )
    {
        // The read-only checks have not been done for this warrant yet
        
	    // Check for a final return
	    var count = Services.countNodes(XPathConstants.WARRANT_BASE + "/FinalReturnCodes/Code");
	    if ( count > 0 ) 
	    {
	        maintainWarrants.isReadOnlyFlag = true;
	        return true;
	    }
	
	    // check the print status
	    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
	    if ( printStatus == "TRANSFERRED" ) 
	    {
	        maintainWarrants.isReadOnlyFlag = true;
	        return true;
	    }
	    
	    // check the users court against executing court
	    var userCourtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	    var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	    if ( userCourtCode != executingCourtCode)
	    {
	    	maintainWarrants.isReadOnlyFlag = true;
	        return true;
	    }
	    
	    maintainWarrants.isReadOnlyFlag = false;
    }
    return maintainWarrants.isReadOnlyFlag;
}

/*********************************************************************************/

/**
 * Function converts a currency code into the appropriate currency symbol for display.
 *
 * @param [String] value The currency code to be converted
 * @return [String] The appropriate currency symbol for the code passed in
 * @author fzj0yl
 */
function transformCurrencyToDisplay(value) 
{
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
 * Function clears the screen and resets all the default values.
 * @author fzj0yl
 * 
 */
function clearScreen() 
{
    Services.startTransaction();
    Services.removeNode(XPathConstants.WARRANT_BASE);
    Services.setValue(Header_ExecutingCourtCode.dataBinding, Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
    maintainWarrants.isReadOnlyFlag = null;
    
    // Clear links to other screens
	Services.removeNode(MaintainWarrantsParams.PARENT);
	Services.removeNode("/ds/var/app/CaseData");
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
    
    Services.endTransaction();
    
    // This must be done outside of the transaction
    Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
    Services.setFocus("Header_ExecutingCourtCode");
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
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.removeNode(MaintainWarrantsParams.PARENT);
		Services.removeNode("/ds/var/app/CaseData");
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * This method and its onSuccess counterpart handle the validation check to determine if
 * there are any payments on the Warrant prior to navigation to the View Payments screen.
 * Trac 3818
 * 
 * @author Chris Vincent
 */
function checkWarrantPaymentsExist()
{
	// Call the validation service
	var warrantID = Services.getValue(XPathConstants.WARRANT_ID_XPATH);
	var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
	var methodName = CaseManUtils.isBlank(localNumber) ? "checkHomeWarrantPaymentsExist" : "checkForeignWarrantPaymentsExist";
	var params = new ServiceParams();
	params.addSimpleParameter("warrantID", warrantID);
	Services.callService(methodName, params, checkWarrantPaymentsExist, true);
}

checkWarrantPaymentsExist.onSuccess = function(dom)
{
	// Put the returned node in the DOM
    var node = dom.selectSingleNode("/ds/WarrantPaymentData/PaymentsExist");
    Services.replaceNode(XPathConstants.VAR_PAGE_XPATH + "/PaymentsExist", node);
	
	var paymentsExist = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/PaymentsExist");
	if ( paymentsExist == "false" )
	{
		// No payments exist on the warrant, throw error message
		var ec = ErrorCode.getErrorCode("CaseMan_paymentsDoNotExistForWarrant_Msg");
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
	else
	{
		// Proceed with navigation to View Payments screen
		var navArray = new Array(NavigationController.VIEW_PAYMENTS_FORM, NavigationController.WARRANT_FORM);
		NavigationController.createCallStack(navArray);
		var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
		var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
		var currentlyOwnedBy = Services.getValue(XPathConstants.WARRANT_BASE + "/OwnedBy");
		if( !CaseManUtils.isBlank(localNumber) ) 
		{
			// Foreign Warrant
			var enfNumber = localNumber;
			var enfType = ViewPaymentsParamsConstants.FOREIGNWARRANT;
		}
		else
		{
			// Home Warrant
			var enfNumber = Services.getValue(Header_WarrantNumber.dataBinding);
			var enfType = ViewPaymentsParamsConstants.HOMEWARRANT;
		}
		Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, enfNumber);
		Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, enfType);
		Services.setValue(ViewPaymentsParams.ISSUING_COURT, issuingCourt);
		Services.setValue(ViewPaymentsParams.CURRENTLY_OWNED_BY_COURT, currentlyOwnedBy);
		
		// Dirty Flag check
		if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
		{
			// User wishes to save before navigating, setup the params
			Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
			Status_SaveButton.actionBinding();
		}
		else
		{
			// No changes or wish to navigate without saving
			NavigationController.nextScreen();
		}
	}
}

/******************************* FORM ELEMENT ***************************************/

function maintainWarrants() {}

// Flag to hold the read-only status of the selected warrant.  This is used so that the
// read-only rules are not executed hundreds of times, hurting performance
maintainWarrants.isReadOnlyFlag = null;

// Load the reference data from the xml into the model
maintainWarrants.refDataServices = [
	{ name:"Courts",          dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getAllCourtsShort",  serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{ name:"SystemDate",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate",      serviceParams:[] },
	{ name:"SystemData",      dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData",      serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/**
 * @author fzj0yl
 * 
 */
maintainWarrants.initialise = function() 
{
    // Get external parameters passed in
    var warrantID = Services.getValue(MaintainWarrantsParams.WARRANT_ID);
    var caseNumber = Services.getValue(MaintainWarrantsParams.CASE_NUMBER);
    var coNumber = Services.getValue(MaintainWarrantsParams.CO_NUMBER);
    
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
    
    Services.setValue(Header_ExecutingCourtCode.dataBinding, Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
}

/******************************* HEADER FIELDS *************************************/

Header_ExecutingCourtCode.tabIndex = 1;
Header_ExecutingCourtCode.maxLength = 3;
Header_ExecutingCourtCode.componentName = "Executing Court Code";
Header_ExecutingCourtCode.helpText = "The code of the court who is to execute the warrant.";
Header_ExecutingCourtCode.validate = function()
{
    var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + " and ./InService = 'Y']/Name");
	if(courtName == null || value == CaseManUtils.CCBC_COURT_CODE) 
	{
		// The entered court code does not exist
		return ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return null;	
}
Header_ExecutingCourtCode.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_ExecutingCourtCode.isReadOnly = isWarrantFound;
Header_ExecutingCourtCode.isTemporary = isWarrantFound;
Header_ExecutingCourtCode.logicOn = [Header_ExecutingCourtCode.dataBinding];
Header_ExecutingCourtCode.logic = function()
{
	if ( this.getValid() ) 
	{
	   var value = Services.getValue(this.dataBinding)
	   Services.setValue(Header_ExecutingCourtName.dataBinding, value);
	}
}

Header_ExecutingCourtCode.mandatoryOn = [XPathConstants.WARRANT_BASE + "/IssuedBy"];
Header_ExecutingCourtCode.isMandatory = function()
{
	// Mandatory if the issued by field is blank, else optional
	var issuedByCourtCode = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	return CaseManUtils.isBlank(issuedByCourtCode) ? true : false;
}

/***********************************************************************************/

Header_ExecutingCourtName.tabIndex = 2;
Header_ExecutingCourtName.componentName = "Executing Court Name";
Header_ExecutingCourtName.helpText = "The name of the court who is to execute the warrant";
Header_ExecutingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_ExecutingCourtName.rowXPath = "Court[./InService = 'Y']";
Header_ExecutingCourtName.keyXPath = "Code";
Header_ExecutingCourtName.displayXPath = "Name";
Header_ExecutingCourtName.strictValidation = true;
Header_ExecutingCourtName.logicOn = [Header_ExecutingCourtName.dataBinding];
Header_ExecutingCourtName.logic = function(event)
{
	if ( event.getXPath() != Header_ExecutingCourtName.dataBinding )
	{
		return;
	}

	var value = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + " and ./InService = 'Y']/Name");
		if ( null != courtName ) 
		{
			// The entered value must be valid
			Services.setValue(Header_ExecutingCourtCode.dataBinding, value);
		}
	}
	else
	{
		// Court Name blanked so blank the code field
		Services.setValue(Header_ExecutingCourtCode.dataBinding, "");
	}
}

Header_ExecutingCourtName.transformToDisplay = toUpperCase;
Header_ExecutingCourtName.transformToModel = toUpperCase;
Header_ExecutingCourtName.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_ExecutingCourtName.isReadOnly = isWarrantFound;
Header_ExecutingCourtName.isTemporary = isWarrantFound;
Header_ExecutingCourtName.mandatoryOn = [XPathConstants.WARRANT_BASE + "/IssuedBy"];
Header_ExecutingCourtName.isMandatory = function()
{
	// Mandatory if the issued by field is blank, else optional
	var issuedByCourtCode = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	return CaseManUtils.isBlank(issuedByCourtCode) ? true : false;
}

/***********************************************************************************/

function Header_ExecutingCourtLOVButton() {};
Header_ExecutingCourtLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_ExecutingCourtCode" }, { key: Key.F6, element: "Header_ExecutingCourtName" } ]
	}
};
Header_ExecutingCourtLOVButton.tabIndex = 3;
/**
 * @author fzj0yl
 * 
 */
Header_ExecutingCourtLOVButton.actionBinding = function() {
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_ExecutingCourtCode.dataBinding);
    Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_ExecutingCourtLOVButton.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Header_ExecutingCourtLOVButton.isEnabled = function() {
    if(isWarrantFound()) {
        return false;
    }
    return true;
}

/***********************************************************************************/

Header_IssuedByCourtCode.tabIndex = 6;
Header_IssuedByCourtCode.maxLength = 3;
Header_IssuedByCourtCode.componentName = "Issued By";
Header_IssuedByCourtCode.helpText = "The code of the court who originally issued the warrant.";
Header_IssuedByCourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_IssuedByCourtCode.dataBinding + "]/Name");
	if ( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_courtDoesNotExist_Msg");
	}
	return ec;	
}
Header_IssuedByCourtCode.logicOn = [Header_IssuedByCourtCode.dataBinding];
Header_IssuedByCourtCode.logic = function()
{
	if( this.getValid() ) 
	{
		var value = Services.getValue(this.dataBinding);
		Services.setValue(Header_IssuedByCourtName.dataBinding, value);		
	}
}
Header_IssuedByCourtCode.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtCode.isReadOnly = isWarrantFound;
Header_IssuedByCourtCode.isTemporary = isWarrantFound;
Header_IssuedByCourtCode.mandatoryOn = [Header_ExecutingCourtCode.dataBinding];
Header_IssuedByCourtCode.isMandatory = function()
{
	// Field is mandatory if the Executing Court Code field is blank, else is optional
	var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	return CaseManUtils.isBlank(executingCourtCode) ? true : false;
}

/***********************************************************************************/

Header_WarrantNumber.tabIndex = 4;
Header_WarrantNumber.maxLength = 8;
Header_WarrantNumber.componentName = "Warrant Number";
Header_WarrantNumber.helpText = "The number allocated to the warrant.";
Header_WarrantNumber.transformToDisplay = toUpperCase;
Header_WarrantNumber.transformToModel = toUpperCase;
Header_WarrantNumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_WarrantNumber.isReadOnly = isWarrantFound;
Header_WarrantNumber.isTemporary = isWarrantFound;
Header_WarrantNumber.validateOn = [Header_WarrantNumber.dataBinding, Header_IssuedByCourtCode.dataBinding];
Header_WarrantNumber.validate = function()
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
	} 
	else {
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

Header_CaseNumber.tabIndex = 5;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties.";
Header_CaseNumber.transformToDisplay = toUpperCase;
Header_CaseNumber.transformToModel = toUpperCase;
Header_CaseNumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_CaseNumber.isReadOnly = isWarrantFound;
Header_CaseNumber.isTemporary = isWarrantFound;
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

Header_IssuedByCourtName.tabIndex = 7;
Header_IssuedByCourtName.componentName = "Issued By";
Header_IssuedByCourtName.helpText = "The name of the court who originally issued the warrant.";
Header_IssuedByCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_IssuedByCourtName.rowXPath = "Court";
Header_IssuedByCourtName.keyXPath = "Code";
Header_IssuedByCourtName.displayXPath = "Name";
Header_IssuedByCourtName.strictValidation = true;
Header_IssuedByCourtName.logicOn = [Header_IssuedByCourtName.dataBinding];
Header_IssuedByCourtName.logic = function(event)
{
	if ( event.getXPath() != Header_IssuedByCourtName.dataBinding )
	{
		return;
	}

	var value = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
		if ( null != courtName ) 
		{
			// The entered value must be valid
			Services.setValue(Header_IssuedByCourtCode.dataBinding, value);
		}
	}
	else
	{
		// The Court Name has been blanked so blank the Court Code
		Services.setValue(Header_IssuedByCourtCode.dataBinding, "");
	}
}
Header_IssuedByCourtName.transformToDisplay = toUpperCase;
Header_IssuedByCourtName.transformToModel = toUpperCase;
Header_IssuedByCourtName.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtName.isReadOnly = isWarrantFound;
Header_IssuedByCourtName.isTemporary = isWarrantFound;
Header_IssuedByCourtName.mandatoryOn = [Header_ExecutingCourtCode.dataBinding];
Header_IssuedByCourtName.isMandatory = function()
{
	// Field is mandatory if the Executing Court Code field is blank, else is optional
	var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	return CaseManUtils.isBlank(executingCourtCode) ? true : false;
}

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
Header_IssuedByCourtLOVButton.actionBinding = function() {
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_IssuedByCourtCode.dataBinding);    
	Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_IssuedByCourtLOVButton.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssuedByCourtLOVButton.isEnabled = function() {
    return !isWarrantFound();
}

/***********************************************************************************/

Header_CONumber.tabIndex = 9;
Header_CONumber.maxLength = 8;
Header_CONumber.componentName = "CO Number";
Header_CONumber.helpText = "The CO Number as quoted on the warrant.";
Header_CONumber.transformToDisplay = toUpperCase;
Header_CONumber.transformToModel = toUpperCase;
Header_CONumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_CONumber.isReadOnly = isWarrantFound;
Header_CONumber.isTemporary = isWarrantFound;
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

Header_LocalNumber.tabIndex = 10;
Header_LocalNumber.maxLength = 8;
Header_LocalNumber.componentName = "Local Number";
Header_LocalNumber.helpText = "The Local Warrant Number as quoted on the warrant.";
Header_LocalNumber.transformToDisplay = toUpperCase;
Header_LocalNumber.transformToModel = toUpperCase;
Header_LocalNumber.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_LocalNumber.isReadOnly = isWarrantFound;
Header_LocalNumber.isTemporary = isWarrantFound;
Header_LocalNumber.validate = function()
{
	var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
	return CaseManValidationHelper.validateLocalWarrantNumber(localNumber);
}

/***********************************************************************************/

Header_IssueDate.tabIndex = 11;
Header_IssueDate.componentName = "Home Court Issue Date";
Header_IssueDate.helpText = "Enter the date the warrant was issued at the home court.";
Header_IssueDate.readOnlyOn = [XPathConstants.WARRANT_ID_XPATH];
Header_IssueDate.isReadOnly = function()
{
	if ( !isWarrantFound() )
	{
		// Editable if the screen is in query mode
		return false;
	}
	
	// Editable if the current user is a warrant control supervisor
	var userRole = Services.getValue(CaseManFormParameters.SECURITYROLE_XPATH);
	return ( userRole == "wcSuper" ) ? false : true;
}

Header_IssueDate.validate = function(event) 
{
	if ( event.getXPath() != Header_IssueDate.dataBinding )
	{
		// Only want to validate if the date itself is updated, not when data is
		// loaded as it could be valid existing data.
		return null;
	}
	
	var value = Services.getValue(Header_IssueDate.dataBinding);
	
	// The format of the date, and the weekend checking have already been done by the
	// date picker, so in the validate we just need to check for a future date, or a date
	// more than 1 month in the past
	var valid = CaseManUtils.convertDateToDisplay(value);
	if (valid == null) {
		return ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');		
	}

	var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	var date = CaseManUtils.createDate(value);

	// Check for a future date
	var compare = CaseManUtils.compareDates(today, date);
	if(compare > 0) {
		return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
	}
	
	// If a warrant has been found, and the date is being updated, check that the issue date is not changed
	// to anything more than 12 months ago
	if(isWarrantFound()) {
	    compare = CaseManUtils.compareDates(date, CaseManUtils.monthsInPast(today, 12));
	    if(compare >= 0) {
	        return ErrorCode.getErrorCode("CaseMan_warrantMoreThanOrEqualToOneYearInPast_Msg");
	    }
	    
	    compare = CaseManUtils.compareDates(date, CaseManUtils.monthsInPast(today, 11));
	    if(compare > 0) {
	        alert(Messages.WARRANT_11_MONTHS_OLD);
	    }	    
	}

	return null;
}

/***********************************************************************************/

Header_WarrantType.tabIndex = -1;
Header_WarrantType.componentName = "Warrant Type";
Header_WarrantType.helpText = "Enter the type of warrant issued.";
Header_WarrantType.isReadOnly = function() { return true; }

/***********************************************************************************/

function SearchButton() {};

SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "maintainWarrants" } ]
	}
};

SearchButton.tabIndex = 13;
SearchButton.enableOn = [Header_WarrantNumber.dataBinding, Header_CaseNumber.dataBinding, Header_LocalNumber.dataBinding, Header_IssueDate.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_IssuedByCourtName.dataBinding, Header_CONumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Header_ExecutingCourtName.dataBinding];
SearchButton.isEnabled = function() 
{
    if ( isWarrantFound() ) 
    {
    	// Disable the Search button if a warrant record has been loaded
        return false;
    }

    var issuedByCourtCode = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
    if ( CaseManUtils.isBlank(executingCourtCode) && CaseManUtils.isBlank(issuedByCourtCode) )
    {
    	// Disable the Search button if both the issued by and executing court code are blank
		return false;
    }

	var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var localNumber = Services.getValue(Header_LocalNumber.dataBinding)
	var issueDate = Services.getValue(Header_IssueDate.dataBinding);
	var coNumber = Services.getValue(Header_CONumber.dataBinding);
    if ( CaseManUtils.isBlank(warrantNumber) &&
         CaseManUtils.isBlank(caseNumber) &&
         CaseManUtils.isBlank(localNumber) &&
         CaseManUtils.isBlank(issueDate) &&
         CaseManUtils.isBlank(coNumber) ) 
	{
		// Disable the Search button if all of warrant number, case number, local number, issue date
		// and co number are blank
		return false;
    }
    
    var blnValidFields = true;
    var adaptorIdArray = ["Header_IssuedByCourtName","Header_IssuedByCourtCode","Header_ExecutingCourtName","Header_ExecutingCourtCode","Header_WarrantNumber","Header_CaseNumber","Header_CONumber","Header_IssueDate","Header_LocalNumber"];
    for ( i=0, l=adaptorIdArray.length; i<l; i++ )
    {
	    // Disable the Search button if any of the search fields are invalid
    	if ( !Services.getAdaptorById(adaptorIdArray[i]).getValid() )
    	{
    		blnValidFields = false;
    		break;
    	}
    }
    return blnValidFields;
}

/**
 * @author fzj0yl
 * 
 */
SearchButton.actionBinding = function() 
{
	var params = new ServiceParams();
	var paramValue = null;

    var executingCourt = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	paramValue = CaseManUtils.isBlank(executingCourt) ? "" : executingCourt;
	params.addSimpleParameter("executedBy", paramValue);
	
    var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
	paramValue = CaseManUtils.isBlank(warrantNumber) ? "" : warrantNumber;
	params.addSimpleParameter("warrantNumber", paramValue);
	
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	paramValue = CaseManUtils.isBlank(caseNumber) ? "" : caseNumber;
	params.addSimpleParameter("caseNumber", paramValue);
	
    var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
	paramValue = CaseManUtils.isBlank(localNumber) ? "" : localNumber;
	params.addSimpleParameter("localNumber", paramValue);
	
    var CONumber = Services.getValue(Header_CONumber.dataBinding);
	paramValue = CaseManUtils.isBlank(CONumber) ? "" : CONumber;
	params.addSimpleParameter("CONumber", paramValue);
	
    var issueDate = Services.getValue(Header_IssueDate.dataBinding);
	paramValue = CaseManUtils.isBlank(issueDate) ? "" : issueDate;
	params.addSimpleParameter("issueDate", paramValue);
	
    var issuedBy = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	paramValue = CaseManUtils.isBlank(issuedBy) ? "" : issuedBy;
	params.addSimpleParameter("issuedBy", paramValue);

    Services.callService("searchWarrants", params, SearchButton, true);
}

/**
 * @param dom
 * @author fzj0yl
 * @return AgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]") , AgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]") , AgainstD2 ) 
 */
SearchButton.onSuccess = function(dom) 
{
    Services.startTransaction();
    var node = dom.selectSingleNode("/ds/Warrants");
    Services.replaceNode(XPathConstants.SEARCH_RESULTS_XPATH, node);
    
    var count = Services.countNodes(XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant");
    if ( count == 0 ) 
    {
       alert(Messages.NO_RESULTS_MESSAGE); 
    } 
    else if ( count == 1 ) 
    {
       var warrantID = Services.getValue(XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant/WarrantID");

       // Retrieve the details of the warrant.
       var params = new ServiceParams();
       params.addSimpleParameter("warrantID", warrantID);
       Services.callService("getWarrant", params, SearchResultsLOVGrid, true);		    
       
    } 
    else 
    {
        // Create the live flag to be displayed in the search results grid
        for ( var i=0; i<count; i++ )
        {
        	// Set the root xpath for the current warrant in the loop
        	var warrantXPath = XPathConstants.SEARCH_RESULTS_XPATH + "/Warrant[" + (i+1) + "]";
        	var isWarrantLive = "Y";
        	
        	// Warrant is live if there are no final warrant returns
        	var countFinalReturns = Services.countNodes(warrantXPath + "/FinalReturnCodes/FinalReturn");
        	if ( countFinalReturns > 0 )
        	{
	        	// Determine if there are two parties against, or just one
	        	var def2Name = Services.getValue(warrantXPath + "/Defendant2/Name");
	        	var twoDefendants = CaseManUtils.isBlank(def2Name) ? false : true;
	        	
	        	if ( twoDefendants )
	        	{
	        		// Two parties against, so is not live if a final return exists against
	        		// both parties, else live.
	        		var returnAgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]");
	        		var returnAgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]");
					if ( returnAgainstD1 && returnAgainstD2 )
					{
						isWarrantLive = "N";
					}
	        	}
	        	else
	        	{
	        		// One party against so if any final returns exist, is not live
	        		isWarrantLive = "N";
	        	}
            }
            Services.setValue(warrantXPath + "/Live", isWarrantLive);
        }
        
        Services.dispatchEvent("SearchResultsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
    }
    Services.endTransaction();
}

/******************************* CLAIMANT FIELDS **********************************/

function Claimant_Name() {};
Claimant_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Name";
Claimant_Name.helpText = "Name of party";
Claimant_Name.tabIndex = -1;
Claimant_Name.isReadOnly = function() { return true; }
Claimant_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Claimant_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Name() {};
Solicitor_Name.tabIndex = -1;
Solicitor_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Name";
Solicitor_Name.helpText = "Name of party's representative";
Solicitor_Name.isReadOnly = function() { return true; }
Solicitor_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line1() {};
Solicitor_Address_Line1.tabIndex = -1;
Solicitor_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[1]";
Solicitor_Address_Line1.helpText = "First line of party's address";
Solicitor_Address_Line1.isReadOnly = function() { return true; }
Solicitor_Address_Line1.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line1.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line2() {};
Solicitor_Address_Line2.tabIndex = -1;
Solicitor_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[2]";
Solicitor_Address_Line2.helpText = "Second line of party's address";
Solicitor_Address_Line2.isReadOnly = function() { return true; }
Solicitor_Address_Line2.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line2.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line3() {};
Solicitor_Address_Line3.tabIndex = -1;
Solicitor_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[3]";
Solicitor_Address_Line3.helpText = "Third line of party's address";
Solicitor_Address_Line3.isReadOnly = function() { return true; }
Solicitor_Address_Line3.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line3.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line4() {};
Solicitor_Address_Line4.tabIndex = -1;
Solicitor_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[4]";
Solicitor_Address_Line4.helpText = "Fourth line of party's address";
Solicitor_Address_Line4.isReadOnly = function() { return true; }
Solicitor_Address_Line4.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line4.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_Line5() {};
Solicitor_Address_Line5.tabIndex = -1;
Solicitor_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[5]";
Solicitor_Address_Line5.helpText = "Fifth line of party's address";
Solicitor_Address_Line5.isReadOnly = function() { return true; }
Solicitor_Address_Line5.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_Line5.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Address_PostCode() {};
Solicitor_Address_PostCode.tabIndex = -1;
Solicitor_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/PostCode";
Solicitor_Address_PostCode.helpText = "Party's postcode";
Solicitor_Address_PostCode.isReadOnly = function() { return true; }
Solicitor_Address_PostCode.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Address_PostCode.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_DX() {};
Solicitor_DX.tabIndex = -1;
Solicitor_DX.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/DX";
Solicitor_DX.helpText = "Party's document exchange reference number";
Solicitor_DX.isReadOnly = function() { return true; }
Solicitor_DX.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_DX.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_TelephoneNumber() {};
Solicitor_TelephoneNumber.tabIndex = -1;
Solicitor_TelephoneNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/TelephoneNumber";
Solicitor_TelephoneNumber.helpText = "The telephone number of the party";
Solicitor_TelephoneNumber.isReadOnly = function() { return true; }
Solicitor_TelephoneNumber.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_TelephoneNumber.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_FaxNumber() {};
Solicitor_FaxNumber.tabIndex = -1;
Solicitor_FaxNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/FaxNumber";
Solicitor_FaxNumber.helpText = "The fax number of the party";
Solicitor_FaxNumber.isReadOnly = function() { return true; }
Solicitor_FaxNumber.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_FaxNumber.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_EmailAddress() {};
Solicitor_EmailAddress.tabIndex = -1;
Solicitor_EmailAddress.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/EmailAddress";
Solicitor_EmailAddress.helpText = "The email address of the party";
Solicitor_EmailAddress.isReadOnly = function() { return true; }
Solicitor_EmailAddress.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_EmailAddress.isEnabled = isWarrantFound;

/***********************************************************************************/

function Solicitor_Reference() {};
Solicitor_Reference.tabIndex = -1;
Solicitor_Reference.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Reference";
Solicitor_Reference.helpText = "Reference used by the party";
Solicitor_Reference.isReadOnly = function() { return true; }
Solicitor_Reference.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Solicitor_Reference.isEnabled = isWarrantFound;

/******************************* DEFENDANT FIELDS **********************************/

function Defendant1_Name() {};
Defendant1_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Name";
Defendant1_Name.tabIndex = -1;
Defendant1_Name.helpText = "Name of party.";
Defendant1_Name.isReadOnly = function() { return true; }
Defendant1_Name.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Name.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line1() {};
Defendant1_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[1]";
Defendant1_Address_Line1.tabIndex = 41;
Defendant1_Address_Line1.maxLength = 35;
Defendant1_Address_Line1.componentName = "Address Line 1";
Defendant1_Address_Line1.helpText = "First line of party's address.";
Defendant1_Address_Line1.isMandatory = function() { return true; }
Defendant1_Address_Line1.transformToDisplay = toUpperCase;
Defendant1_Address_Line1.transformToModel = convertToUpperStripped;
Defendant1_Address_Line1.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_Line1.isReadOnly = isReadOnly;
Defendant1_Address_Line1.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line1.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line2() {};
Defendant1_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[2]";
Defendant1_Address_Line2.tabIndex = 42;
Defendant1_Address_Line2.maxLength = 35;
Defendant1_Address_Line2.componentName = "Address Line 2";
Defendant1_Address_Line2.helpText = "Second line of party's address.";
Defendant1_Address_Line2.isMandatory = function() { return true; }
Defendant1_Address_Line2.transformToDisplay = toUpperCase;
Defendant1_Address_Line2.transformToModel = convertToUpperStripped;
Defendant1_Address_Line2.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_Line2.isReadOnly = isReadOnly;
Defendant1_Address_Line2.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line2.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line3() {};
Defendant1_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[3]";
Defendant1_Address_Line3.tabIndex = 43;
Defendant1_Address_Line3.maxLength = 35;
Defendant1_Address_Line3.componentName = "Address Line 3";
Defendant1_Address_Line3.helpText = "Third line of party's address.";
Defendant1_Address_Line3.transformToDisplay = toUpperCase;
Defendant1_Address_Line3.transformToModel = convertToUpperStripped;
Defendant1_Address_Line3.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_Line3.isReadOnly = isReadOnly;
Defendant1_Address_Line3.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line3.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line4() {};
Defendant1_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[4]";
Defendant1_Address_Line4.tabIndex = 44;
Defendant1_Address_Line4.maxLength = 35;
Defendant1_Address_Line4.componentName = "Address Line 4";
Defendant1_Address_Line4.helpText = "Fourth line of party's address.";
Defendant1_Address_Line4.transformToDisplay = toUpperCase;
Defendant1_Address_Line4.transformToModel = convertToUpperStripped;
Defendant1_Address_Line4.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_Line4.isReadOnly = isReadOnly;
Defendant1_Address_Line4.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line4.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_Line5() {};
Defendant1_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[5]";
Defendant1_Address_Line5.tabIndex = 45;
Defendant1_Address_Line5.maxLength = 35;
Defendant1_Address_Line5.componentName = "Address Line 5";
Defendant1_Address_Line5.helpText = "Fifth line of party's address.";
Defendant1_Address_Line5.transformToDisplay = toUpperCase;
Defendant1_Address_Line5.transformToModel = convertToUpperStripped;
Defendant1_Address_Line5.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_Line5.isReadOnly = isReadOnly;
Defendant1_Address_Line5.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Defendant1_Address_Line5.isEnabled = isWarrantFound;

/***********************************************************************************/

function Defendant1_Address_PostCode() {};
Defendant1_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/PostCode";
Defendant1_Address_PostCode.tabIndex = 46;
Defendant1_Address_PostCode.maxLength = 8;
Defendant1_Address_PostCode.componentName = "Postcode";
Defendant1_Address_PostCode.helpText = "Party's postcode.";
Defendant1_Address_PostCode.transformToDisplay = toUpperCase;
Defendant1_Address_PostCode.transformToModel = toUpperCase;
Defendant1_Address_PostCode.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant1_Address_PostCode.isReadOnly = isReadOnly;
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
Defendant2_Address_Line1.tabIndex = 48;
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
Defendant2_Address_Line1.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_Line1.isReadOnly = isReadOnly;
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
Defendant2_Address_Line2.tabIndex = 49;
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
Defendant2_Address_Line2.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_Line2.isReadOnly = isReadOnly;
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
Defendant2_Address_Line3.tabIndex = 50;
Defendant2_Address_Line3.maxLength = 35;
Defendant2_Address_Line3.componentName = "Address Line 3";
Defendant2_Address_Line3.helpText = "Third line of party's address.";
Defendant2_Address_Line3.transformToDisplay = toUpperCase;
Defendant2_Address_Line3.transformToModel = convertToUpperStripped;
Defendant2_Address_Line3.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_Line3.isReadOnly = isReadOnly;
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
Defendant2_Address_Line4.tabIndex = 51;
Defendant2_Address_Line4.maxLength = 35;
Defendant2_Address_Line4.componentName = "Address Line 4";
Defendant2_Address_Line4.helpText = "Fourth line of party's address.";
Defendant2_Address_Line4.transformToDisplay = toUpperCase;
Defendant2_Address_Line4.transformToModel = convertToUpperStripped;
Defendant2_Address_Line4.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_Line4.isReadOnly = isReadOnly;
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
Defendant2_Address_Line5.tabIndex = 52;
Defendant2_Address_Line5.maxLength = 35;
Defendant2_Address_Line5.componentName = "Address Line 5";
Defendant2_Address_Line5.helpText = "Fifth line of party's address.";
Defendant2_Address_Line5.transformToDisplay = toUpperCase;
Defendant2_Address_Line5.transformToModel = convertToUpperStripped;
Defendant2_Address_Line5.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_Line5.isReadOnly = isReadOnly;
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
Defendant2_Address_PostCode.tabIndex = 53;
Defendant2_Address_PostCode.maxLength = 8;
Defendant2_Address_PostCode.componentName = "Postcode";
Defendant2_Address_PostCode.helpText = "Party's postcode.";
Defendant2_Address_PostCode.transformToDisplay = toUpperCase;
Defendant2_Address_PostCode.transformToModel = toUpperCase;
Defendant2_Address_PostCode.readOnlyOn = [XPathConstants.WARRANT_BASE];
Defendant2_Address_PostCode.isReadOnly = isReadOnly;
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

/******************************* OTHER WARRENT DETAILS FIELDS *******************************/

function ExecutingCourtCode() {};
ExecutingCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/ExecutingCourtCode";
ExecutingCourtCode.tabIndex = 60;
ExecutingCourtCode.maxLength = 3;
ExecutingCourtCode.componentName = "Executing Court Code";
ExecutingCourtCode.helpText = "The code of the court who is to execute the warrant.";
ExecutingCourtCode.isMandatory = function() { return true; }
ExecutingCourtCode.validate = function()
{
    var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + " and ./InService = 'Y']/Name");
	if(courtName == null || value == CaseManUtils.CCBC_COURT_CODE) {
		// The entered court code does not exist
		return ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	
	var localNumber = Services.getValue(Header_LocalNumber.dataBinding);
	if(!CaseManUtils.isBlank(localNumber)) {
	    // The warrant is a foreign warrant, check that the executing court has not been set to the issuing court	    
	    var issuingCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	    if(value == issuingCourt) {
		    return ErrorCode.getErrorCode("CaseMan_warrantCannotBeReturned_Msg");	        
	    }
	}
	
	return null;	
}
ExecutingCourtCode.logicOn = [ExecutingCourtCode.dataBinding];
ExecutingCourtCode.logic = function(event)
{
	if ( this.getValid() ) 
	{
		Services.startTransaction();
	    var executingCourtCode = Services.getValue(ExecutingCourtCode.dataBinding)
		Services.setValue(ExecutingCourtName.dataBinding, executingCourtCode);
		var userCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
		if ( event.getXPath() == ExecutingCourtCode.dataBinding && 
			 executingCourtCode != userCourt ) 
		{
			// The executing court has been changed to a court other than the user's
			// home court
		    Services.setValue(BailiffAreaNo.dataBinding, "99");
		}
		Services.endTransaction();
	}
}

ExecutingCourtCode.enableOn = [XPathConstants.WARRANT_ID_XPATH];
ExecutingCourtCode.isEnabled = isWarrantFound;

/***********************************************************************************/

function ExecutingCourtName() {};
ExecutingCourtName.dataBinding = "/ds/var/page/tmp/ExecutingCourtNameAutocomplete";
ExecutingCourtName.tabIndex = 61;
ExecutingCourtName.componentName = "Executing Court Name";
ExecutingCourtName.helpText = "The name of the court who is to execute the warrant";
ExecutingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
ExecutingCourtName.isMandatory = function() { return true; }
ExecutingCourtName.rowXPath = "Court[./InService = 'Y']";
ExecutingCourtName.keyXPath = "Code";
ExecutingCourtName.displayXPath = "Name";
ExecutingCourtName.strictValidation = true;
ExecutingCourtName.logicOn = [ExecutingCourtName.dataBinding];
ExecutingCourtName.logic = function()
{
	Services.startTransaction();
	
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + " and ./InService = 'Y']/Name");
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
ExecutingCourtLOVButton.tabIndex = 62;
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
BailiffAreaNo.tabIndex = 63;
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
BailiffAreaNo.readOnlyOn = [XPathConstants.WARRANT_BASE];
BailiffAreaNo.isReadOnly = isReadOnly;
BailiffAreaNo.enableOn = [XPathConstants.WARRANT_ID_XPATH];
BailiffAreaNo.isEnabled = isWarrantFound;

/***********************************************************************************/

function Additional_Notes() {};
Additional_Notes.dataBinding = XPathConstants.WARRANT_BASE + "/AdditionalNotes";
Additional_Notes.tabIndex = 64;
Additional_Notes.maxLength = 120;
Additional_Notes.componentName = "Additional Notes";
Additional_Notes.helpText = "Enter any further information regarding the execution of this warrant.";
Additional_Notes.transformToDisplay = toUpperCase;
Additional_Notes.transformToModel = convertToUpperStripped;
Additional_Notes.readOnlyOn = [XPathConstants.WARRANT_BASE];
Additional_Notes.isReadOnly = isReadOnly;
Additional_Notes.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Additional_Notes.isEnabled = isWarrantFound;

/******************************* WARRANT DETAILS FIELDS *************************************/

function WarrantDetails_BalanceOfDebt() {};
WarrantDetails_BalanceOfDebt.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebt";
WarrantDetails_BalanceOfDebt.tabIndex = 101;
WarrantDetails_BalanceOfDebt.maxLength = 12;
WarrantDetails_BalanceOfDebt.componentName = "Balance of Debt";
WarrantDetails_BalanceOfDebt.helpText = "Enter the outstanding balance of the judgment debt.";
WarrantDetails_BalanceOfDebt.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_BalanceOfDebt.transformToModel = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_BalanceOfDebt.readOnlyOn = [XPathConstants.WARRANT_BASE + "/PrintStatus"];
WarrantDetails_BalanceOfDebt.isReadOnly = function() {
	var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    if(isReadOnly()) {
        return true;
    }
    if(CaseManUtils.isBlank(printStatus) || printStatus == "TO PRINT") {
        return false;
    }
    return true;
}
WarrantDetails_BalanceOfDebt.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_BalanceOfDebt.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "EXECUTION" || warrantType == "CONTROL") {
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

/***********************************************************************************/

function WarrantDetails_BalanceOfDebtCurrency() {};
WarrantDetails_BalanceOfDebtCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebtCurrency";
WarrantDetails_BalanceOfDebtCurrency.tabIndex = -1;
WarrantDetails_BalanceOfDebtCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceOfDebtCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceOfDebtCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_AmountOfWarrant() {};
WarrantDetails_AmountOfWarrant.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrant";
WarrantDetails_AmountOfWarrant.tabIndex = 103;
WarrantDetails_AmountOfWarrant.maxLength = 12;
WarrantDetails_AmountOfWarrant.componentName = "Amount of Warrant";
WarrantDetails_AmountOfWarrant.helpText = "Enter the amount the warrant is issued for";
WarrantDetails_AmountOfWarrant.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_AmountOfWarrant.transformToModel = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_AmountOfWarrant.readOnlyOn = [XPathConstants.WARRANT_BASE + "/PrintStatus"];
WarrantDetails_AmountOfWarrant.isReadOnly = function() {
    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    if(isReadOnly()) {
        return true;
    } else if(CaseManUtils.isBlank(printStatus) || printStatus == "TO PRINT") {
        return false;
    }
    
    return true;
}
WarrantDetails_AmountOfWarrant.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_AmountOfWarrant.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "EXECUTION" || warrantType == "CONTROL") {
        return true;
    }
    return false;
}
WarrantDetails_AmountOfWarrant.validateOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding];
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

/***********************************************************************************/

function WarrantDetails_AmountOfWarrantCurrency() {};
WarrantDetails_AmountOfWarrantCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/AmountOfWarrantCurrency";
WarrantDetails_AmountOfWarrantCurrency.tabIndex = -1;
WarrantDetails_AmountOfWarrantCurrency.isReadOnly = function() { return true; }
WarrantDetails_AmountOfWarrantCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_AmountOfWarrantCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_Fee() {};
WarrantDetails_Fee.dataBinding = XPathConstants.WARRANT_BASE + "/Fee";
WarrantDetails_Fee.tabIndex = 105;
WarrantDetails_Fee.maxLength = 11;
WarrantDetails_Fee.componentName = "Warrant Fee";
WarrantDetails_Fee.helpText = "The fee for issuing the warrant";
WarrantDetails_Fee.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_Fee.isReadOnly = function() {
    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    if(!CaseManUtils.isBlank(printStatus) && printStatus != "TO PRINT") {
        return true;
    }    
    
    var issueDate = Services.getValue(Header_IssueDate.dataBinding);
    var today = CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate");
    if(isReadOnly() || issueDate != today) {
        return true;
    }

    return false;
}
WarrantDetails_Fee.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	var maximum = parseFloat(Services.getValue(XPathConstants.MAX_FEE_XPATH));
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && CaseManUtils.isBlank(Services.getValue(XPathConstants.WARRANT_BASE + "/LocalNumber")) && parseFloat(value) > maximum) {
			// Only validate against maximum for Home Warrants (Defect #4506).
			var currencyCode = Services.getValue(WarrantDetails_FeeCurrency.dataBinding);
			var currencySymbol = CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
			errCode = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg");
			errCode.m_message = errCode.m_message.replace(/XXX/, currencySymbol + parseFloat(maximum).toFixed(2));
		}
	}
	return errCode;
}

WarrantDetails_Fee.logicOn = [WarrantDetails_Fee.dataBinding];
WarrantDetails_Fee.logic = function(event)
{
	// TRAC 1676 - Set the Warrant Fee Updated Flag if fee updated
    if ( event.getXPath().indexOf(WarrantDetails_Fee.dataBinding) == -1 )
	{
		return;
	}

    Services.setValue(XPathConstants.WARRANT_BASE + "/WarrantFeeUpdated", "Y");
}

/***********************************************************************************/

function WarrantDetails_FeeCurrency() {};
WarrantDetails_FeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/FeeCurrency";
WarrantDetails_FeeCurrency.tabIndex = -1;
WarrantDetails_FeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_FeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_FeeCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_SolicitorsCosts() {};
WarrantDetails_SolicitorsCosts.dataBinding = XPathConstants.WARRANT_BASE + "/SolicitorsCosts";
WarrantDetails_SolicitorsCosts.tabIndex = 107;
WarrantDetails_SolicitorsCosts.maxLength = 11;
WarrantDetails_SolicitorsCosts.componentName = "Solicitors Costs";
WarrantDetails_SolicitorsCosts.helpText = "Enter the fixed costs claimed on warrant issue where a solicitor is acting";
WarrantDetails_SolicitorsCosts.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_SolicitorsCosts.transformToModel = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_SolicitorsCosts.readOnlyOn = [WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_SolicitorsCosts.isReadOnly = function() {
    if(isReadOnly()) {
        return true;
    }
    
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    if(CaseManUtils.isBlank(amountOfWarrant) || isNaN(amountOfWarrant) || amountOfWarrant <= 25) {
        Services.setValue(this.dataBinding, "");
        return true;
    }
    
    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    if(CaseManUtils.isBlank(printStatus) || printStatus == "TO PRINT") {
        return false;
    }

    return true;
}
WarrantDetails_SolicitorsCosts.logicOn = [WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_SolicitorsCosts.logic = function() {
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    if(CaseManUtils.isBlank(amountOfWarrant) || isNaN(amountOfWarrant) || amountOfWarrant <= 25) {
        if(CaseManUtils.isBlank(Services.getValue(this.dataBinding))) {
            Services.setValue(this.dataBinding, "");    
        }
    }
}
WarrantDetails_SolicitorsCosts.validate = function() {
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

/***********************************************************************************/

function WarrantDetails_SolicitorsCostsCurrency() {};
WarrantDetails_SolicitorsCostsCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/SolicitorsCostsCurrency";
WarrantDetails_SolicitorsCostsCurrency.tabIndex = -1;
WarrantDetails_SolicitorsCostsCurrency.isReadOnly = function() { return true; }
WarrantDetails_SolicitorsCostsCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_SolicitorsCostsCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_LandRegistryFee() {};
WarrantDetails_LandRegistryFee.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFee";
WarrantDetails_LandRegistryFee.tabIndex = 109;
WarrantDetails_LandRegistryFee.maxLength = 11;
WarrantDetails_LandRegistryFee.componentName = "Land Registry Fee";
WarrantDetails_LandRegistryFee.helpText = "Enter the fee paid for a search under the Agricultural Credits Act 1928";
WarrantDetails_LandRegistryFee.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_LandRegistryFee.transformToModel = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal) || fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_LandRegistryFee.readOnlyOn = [XPathConstants.WARRANT_BASE + "/PrintStatus"];
WarrantDetails_LandRegistryFee.isReadOnly = function() {
    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    if(isReadOnly()) {
        return true;
    } else if(CaseManUtils.isBlank(printStatus) || printStatus == "TO PRINT") {
        return false;
    } 
    
    return true;
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

/***********************************************************************************/

function WarrantDetails_LandRegistryFeeCurrency() {};
WarrantDetails_LandRegistryFeeCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/LandRegistryFeeCurrency";
WarrantDetails_LandRegistryFeeCurrency.tabIndex = -1;
WarrantDetails_LandRegistryFeeCurrency.isReadOnly = function() { return true; }
WarrantDetails_LandRegistryFeeCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_LandRegistryFeeCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_Total() {};
WarrantDetails_Total.dataBinding = XPathConstants.WARRANT_BASE + "/Total";
WarrantDetails_Total.tabIndex = -1;
WarrantDetails_Total.helpText = "The total sum of the warrant";
WarrantDetails_Total.isReadOnly = function() { return true; }
WarrantDetails_Total.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_Total.logicOn = [WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
WarrantDetails_Total.logic = function(event) {
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

/***********************************************************************************/

function WarrantDetails_TotalCurrency() {};
WarrantDetails_TotalCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/TotalCurrency";
WarrantDetails_TotalCurrency.tabIndex = -1;
WarrantDetails_TotalCurrency.isReadOnly = function() { return true; }
WarrantDetails_TotalCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_TotalCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaid() {};
WarrantDetails_BalanceAfterPaid.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaid";
WarrantDetails_BalanceAfterPaid.tabIndex = -1;
WarrantDetails_BalanceAfterPaid.helpText = "The balance of the debt after payments";
WarrantDetails_BalanceAfterPaid.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaid.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
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

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaidCurrency() {};
WarrantDetails_BalanceAfterPaidCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaidCurrency";
WarrantDetails_BalanceAfterPaidCurrency.tabIndex = -1;
WarrantDetails_BalanceAfterPaidCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaidCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceAfterPaidCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_AdditionalFees() {};
WarrantDetails_AdditionalFees.helpText = "Additional fees on the warrant";
WarrantDetails_AdditionalFees.dataBinding = "/ds/var/page/tmp/AdditionalFees";
WarrantDetails_AdditionalFees.tabIndex = -1;
WarrantDetails_AdditionalFees.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_AdditionalFees.isReadOnly = function() { return true; }
WarrantDetails_AdditionalFees.logicOn = [XPathConstants.WARRANT_BASE + "/Fees/Fee"];
WarrantDetails_AdditionalFees.logic = function() {
    var baseFee = parseFloat(Services.getValue(WarrantDetails_Fee.dataBinding));
    
    var nodes = Services.getNodes(XPathConstants.WARRANT_BASE + "/Fees/Fee");
    var total = 0;
    for(var i = 0 ; i < nodes.length ; i++) {
        var fee = parseFloat(XML.getNodeTextContent(nodes[i]));
        if(fee > 0) {
            total = total + fee;
        }
    }

    if(!isNaN(baseFee)) {
        total = total - baseFee;
    }
    
    Services.setValue(this.dataBinding, total);
}


/***********************************************************************************/

function WarrantDetails_AdditionalFeesCurrency() {};
WarrantDetails_AdditionalFeesCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/AdditionalFeesCurrency";
WarrantDetails_AdditionalFeesCurrency.tabIndex = -1;
WarrantDetails_AdditionalFeesCurrency.isReadOnly = function() { return true; }
WarrantDetails_AdditionalFeesCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_AdditionalFeesCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_FeeRefunds() {};
WarrantDetails_FeeRefunds.dataBinding = "/ds/var/page/tmp/FeeRefunds";
WarrantDetails_FeeRefunds.tabIndex = -1;
WarrantDetails_FeeRefunds.helpText = "Refunds recorded on the warrant";
WarrantDetails_FeeRefunds.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_FeeRefunds.isReadOnly = function() { return true; }
WarrantDetails_FeeRefunds.logicOn = [XPathConstants.WARRANT_BASE + "/Fees/Fee"];
WarrantDetails_FeeRefunds.logic = function() {
    var nodes = Services.getNodes(XPathConstants.WARRANT_BASE + "/Fees/Fee");
    var total = 0;
    for(var i = 0 ; i < nodes.length ; i++) {
        var fee = parseFloat(XML.getNodeTextContent(nodes[i]));
        if(fee < 0) {
            total = total + fee;
        }
    }
    Services.setValue(this.dataBinding, (total*-1));
}

/***********************************************************************************/

function WarrantDetails_FeeRefundsCurrency() {};
WarrantDetails_FeeRefundsCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/FeeRefundsCurrency";
WarrantDetails_FeeRefundsCurrency.tabIndex = -1;
WarrantDetails_FeeRefundsCurrency.isReadOnly = function() { return true; }
WarrantDetails_FeeRefundsCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_FeeRefundsCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_PaymentsToDate() {};
WarrantDetails_PaymentsToDate.dataBinding = "/ds/var/page/tmp/PaymentsToDate";
WarrantDetails_PaymentsToDate.helpText = "Total sum of payments made on the warrant to date";
WarrantDetails_PaymentsToDate.tabIndex = -1;
WarrantDetails_PaymentsToDate.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_PaymentsToDate.isReadOnly = function() { return true; }
WarrantDetails_PaymentsToDate.logicOn = [XPathConstants.WARRANT_BASE + "/Payments/Payment"];
WarrantDetails_PaymentsToDate.logic = function() {
    var nodes = Services.getNodes(XPathConstants.WARRANT_BASE + "/Payments/Payment");
    var total = 0;
    for(var i = 0 ; i < nodes.length ; i++) {
        var amount = parseFloat(XML.getNodeTextContent(nodes[i].selectSingleNode("Amount")));
        var overpaymentAmount = parseFloat(XML.getNodeTextContent(nodes[i].selectSingleNode("OverpaymentAmount")));
        if(amount > 0) {
            total = total + amount;
            if(overpaymentAmount > 0) {
                total = total - overpaymentAmount;
            }
        }
    }
    Services.setValue(this.dataBinding, total);
}

/***********************************************************************************/

function WarrantDetails_PaymentsToDateCurrency() {};
WarrantDetails_PaymentsToDateCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/PaymentsToDateCurrency";
WarrantDetails_PaymentsToDateCurrency.tabIndex = -1;
WarrantDetails_PaymentsToDateCurrency.isReadOnly = function() { return true; }
WarrantDetails_PaymentsToDateCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_PaymentsToDateCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_TotalRemaining() {};
WarrantDetails_TotalRemaining.helpText = "Total outstanding on the warrant";
WarrantDetails_TotalRemaining.dataBinding = XPathConstants.WARRANT_BASE + "/TotalRemaining";
WarrantDetails_TotalRemaining.tabIndex = -1;
WarrantDetails_TotalRemaining.transformToDisplay = function(value) {
	var fVal = parseFloat(value).toFixed(2);
	if (isNaN(fVal))
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;
}
WarrantDetails_TotalRemaining.isReadOnly = function() { return true; }
WarrantDetails_TotalRemaining.logicOn = [WarrantDetails_Total.dataBinding, WarrantDetails_AdditionalFees.dataBinding, WarrantDetails_FeeRefunds.dataBinding, WarrantDetails_PaymentsToDate.dataBinding];
WarrantDetails_TotalRemaining.logic = function(event) {
    var value = parseFloat(Services.getValue(WarrantDetails_Total.dataBinding));
    
    var temp = Services.getValue(WarrantDetails_AdditionalFees.dataBinding);
    if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) ) {
		value = value + parseFloat(temp);
	}
    
    temp = Services.getValue(WarrantDetails_FeeRefunds.dataBinding);
    if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) ) {
		value = value - parseFloat(temp);
	}
    
    temp = Services.getValue(WarrantDetails_PaymentsToDate.dataBinding);
    if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) ) {
		value = value - parseFloat(temp);
	}
    
	Services.setValue(this.dataBinding, value);
}

/***********************************************************************************/

function WarrantDetails_TotalRemainingCurrency() {};
WarrantDetails_TotalRemainingCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/TotalRemainingCurrency";
WarrantDetails_TotalRemainingCurrency.tabIndex = -1;
WarrantDetails_TotalRemainingCurrency.isReadOnly = function() { return true; }
WarrantDetails_TotalRemainingCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_TotalRemainingCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_PrintStatus() {};
WarrantDetails_PrintStatus.helpText = "Print status of the warrant";
WarrantDetails_PrintStatus.dataBinding = XPathConstants.WARRANT_BASE + "/PrintStatus";
WarrantDetails_PrintStatus.tabIndex = -1;
WarrantDetails_PrintStatus.isReadOnly = function() { return true; }

/***********************************************************************************/

function WarrantDetails_OkButton() {};
WarrantDetails_OkButton.tabIndex = 123;
/**
 * @author fzj0yl
 * 
 */
WarrantDetails_OkButton.actionBinding = function() {
    Services.dispatchEvent("Warrant_Details_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}
WarrantDetails_OkButton.validationList = ["WarrantDetails_BalanceOfDebt", "WarrantDetails_AmountOfWarrant", "WarrantDetails_Fee", "WarrantDetails_SolicitorsCosts", "WarrantDetails_LandRegistryFee"];
WarrantDetails_OkButton.enableOn = [WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
WarrantDetails_OkButton.isEnabled = function() {
	var validFields = CaseManValidationHelper.validateFields(WarrantDetails_OkButton.validationList);
	return validFields;    
}

/***********************************************************************************/

function WarrantDetails_CancelButton() {};
WarrantDetails_CancelButton.tabIndex = 124;
WarrantDetails_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Warrant_Details_Popup" } ]
	}
};
/**
 * @author fzj0yl
 * 
 */
WarrantDetails_CancelButton.actionBinding = function() {
    Services.startTransaction();
    Services.dispatchEvent("Warrant_Details_Popup", BusinessLifeCycleEvents.EVENT_LOWER);	
    Services.setValue(WarrantDetails_BalanceOfDebt.dataBinding,   Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/BalanceOfDebt"));
    Services.setValue(WarrantDetails_AmountOfWarrant.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/AmountOfWarrant"));
    Services.setValue(WarrantDetails_Fee.dataBinding,			  Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/Fee"));
    Services.setValue(WarrantDetails_SolicitorsCosts.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/SolicitorsCosts"));
    Services.setValue(WarrantDetails_LandRegistryFee.dataBinding, Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/LandRegistryFee"));
    Services.endTransaction();	
}

/******************************* FOOTER FIELDS ********************************************/

function Footer_DetailsOfWarrantButton() {};
Footer_DetailsOfWarrantButton.tabIndex = 70;
Footer_DetailsOfWarrantButton.labelOn=[WarrantDetails_PrintStatus.dataBinding, WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding];
/**
 * @author fzj0yl
 * @return "View Details" , "Add Details" , "Update Details"  
 */
Footer_DetailsOfWarrantButton.label = function() {
    var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
    
    if(isReadOnly()) {
        return "View Details";
    }
    if(!(CaseManUtils.isBlank(printStatus) || printStatus == "TO PRINT")) {
        return "View Details";
    }
    
    // Check if there are any details
    var balanceOfDebt   = Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding);
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    var fee				= Services.getValue(WarrantDetails_Fee.dataBinding);
    var solicitorsCosts = Services.getValue(WarrantDetails_SolicitorsCosts.dataBinding);
    var registryFee		= Services.getValue(WarrantDetails_LandRegistryFee.dataBinding);
    
    if(CaseManUtils.isBlank(balanceOfDebt) &&
            CaseManUtils.isBlank(amountOfWarrant) &&
            CaseManUtils.isBlank(fee) &&
            CaseManUtils.isBlank(solicitorsCosts) &&
            CaseManUtils.isBlank(registryFee)) {
        return "Add Details";
    }
    
    return "Update Details";
}
Footer_DetailsOfWarrantButton.enableOn = [XPathConstants.WARRANT_ID_XPATH];
Footer_DetailsOfWarrantButton.isEnabled = isWarrantFound;

/******************************* STATUS BAR FIELDS *****************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainWarrants" } ]
	}
};

Status_CloseButton.tabIndex = 82;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;

/***********************************************************************************/

function Status_ClearButton() {}

Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "maintainWarrants", alt: true } ]
	}
};

Status_ClearButton.tabIndex = 81;
/**
 * @author fzj0yl
 * 
 */
Status_ClearButton.actionBinding = function() 
{
	if ( confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE) ) 
	{
		if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
		{
			Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CLEARFORM);
			Status_SaveButton.actionBinding();
		}
		else
		{
			clearScreen();
		}
	}	
}

/***********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainWarrants" } ]
	}
};

Status_SaveButton.tabIndex = 80;
/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	if ( isWarrantFound() && changesMade() )
	{
		var invalidFields = FormController.getInstance().validateForm(true);
		if( 0 == invalidFields.length ) 
		{
			var node = Services.getNode(XPathConstants.WARRANT_BASE).cloneNode(true);

            // TRAC 1676 - Ensure the Warrant Fee Updated flag is correctly set
	        var warrantFeeUpdated = Services.getValue(XPathConstants.WARRANT_BASE + "/WarrantFeeUpdated");
            if ( CaseManUtils.isBlank(warrantFeeUpdated) )
            {
                // field is blank so Warrant Fee not changed, set the flag accordingly
                Services.setValue(XPathConstants.WARRANT_BASE + "/WarrantFeeUpdated", "N");
            }
			
			// Save the details
			var newDOM = XML.createDOM(null, null, null);
			var dsNode = XML.createElement(newDOM, "ds");
			dsNode.appendChild(node);
			newDOM.appendChild(dsNode);
			var params = new ServiceParams();
			params.addDOMParameter("warrantDetails", newDOM);
			Services.callService("updateWarrant", params, Status_SaveButton, true);
		}
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
		var warrantType = Services.getValue(Header_WarrantType.dataBinding);
		if (warrantType == "EXECUTION" || warrantType == "CONTROL")
	    {
	        var executingCourt = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/ExecutingCourtCode"));
	        var originalExecutingCourt = Services.getValue(XPathConstants.WARRANT_BASE + "/OriginalExecutingCourt");
			if (originalExecutingCourt != executingCourt) 
			{	    
			    // The executing court had been changed
				var printStatus = Services.getValue(WarrantDetails_PrintStatus.dataBinding);
				if (printStatus == "TO PRINT") 
				{
				    if (CaseManUtils.isBlank(Services.getValue(Header_LocalNumber.dataBinding))) 
				    {
				        // Warrant is a home warrant
				        var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
						if ( warrantNumber.indexOf("/") == -1 )
						{
							alert(Messages.WARRANT_UPDATED_SUCCESSFULLY_TRANSFERRED);
						}						
						else
						{
							// Special message for Reissued Warrant which are not transferred automatically.  Trac 2848
							alert(Messages.WARRANT_UPDATED_SUCCESSFULLY);
						}
				    } 
				    else 
				    {
				        // Warrant is a foreign warrant
				        if (Services.getValue(BailiffAreaNo.dataBinding) != "99") 
				        {
				            // Warrant was manually entered
				            alert(Messages.WARRANT_UPDATED_SUCCESSFULLY_FOREIGN);
				        } 
				        else 
				        {
				            alert(Messages.WARRANT_UPDATED_SUCCESSFULLY_TRANSFERRED);
				        }
				    }
				} 
				else if (printStatus == "PRINTED" || printStatus == "REPRINTED") 
				{
				    if (CaseManUtils.isBlank(Services.getValue(Header_LocalNumber.dataBinding))) 
				    {
				        // Warrant is a home warrant
				        alert(Messages.WARRANT_UPDATED_SUCCESSFULLY_PRINTED);
				    } 
				    else 
				    {
				        // Warrant is a foreign warrant
				        alert(Messages.WARRANT_UPDATED_SUCCESSFULLY_FOREIGN);
				    }
				} 
				else 
				{
					// Put a success message in the status bar
				    Services.setTransientStatusBarMessage("Changes saved.");		    
				}	        			        
			} 
			else 
			{
				// Put a success message in the status bar
			    Services.setTransientStatusBarMessage("Changes saved.");		    			    
			}
	    } 
	    else 
	    {
			// Put a success message in the status bar
		    Services.setTransientStatusBarMessage("Changes saved.");		    	        
	    }
	    
		var temp = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		switch (temp)
		{
			case ActionAfterSave.ACTION_NAVIGATE:
				NavigationController.nextScreen();
				break;
			case ActionAfterSave.ACTION_CLEARFORM:
			    clearScreen();
				break;
			case ActionAfterSave.ACTION_EXIT:
				exitScreen();
				break;
			default:
			    // Reload the warrant details from the database
				var params = new ServiceParams();
				params.addSimpleParameter("warrantID", XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/WarrantID")));
				Services.callService("getWarrant", params, SearchResultsLOVGrid, true);					    
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

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author fzj0yl
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
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
		var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
		Services.startTransaction();
		Services.setValue(xpath, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/**
 * @author fzj0yl
 * @return adaptor  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() 
{
	// Return focus to the correct field
    var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
    var adaptor = null;
    switch (xpath)
    {
    	case Header_ExecutingCourtCode.dataBinding:
    		adaptor = "Header_ExecutingCourtCode";
    		break;
    	case Header_IssuedByCourtCode.dataBinding:
    		adaptor = "Header_IssuedByCourtCode";
    		break;
    	case ExecutingCourtCode.dataBinding:
    		adaptor = "ExecutingCourtCode";
    		break;
    	default:
    		adaptor = "Status_SaveButton";
    }
    return adaptor;
}

/***********************************************************************************/

function SearchResultsLOVGrid() {};
SearchResultsLOVGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedWarrant";
SearchResultsLOVGrid.srcData = XPathConstants.SEARCH_RESULTS_XPATH;
SearchResultsLOVGrid.rowXPath = "Warrant";
SearchResultsLOVGrid.keyXPath = "WarrantID";
SearchResultsLOVGrid.columns = [
	{xpath: "IssuedByName"},
	{xpath: "IssueDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "WarrantNumber"},
	{xpath: "LocalNumber"},
	{xpath: "CaseNumber"},
	{xpath: "CONumber"},
	{xpath: "Live"}
];
SearchResultsLOVGrid.logicOn = [SearchResultsLOVGrid.dataBinding];
SearchResultsLOVGrid.logic = function(event) 
{
    var value = Services.getValue(this.dataBinding);
    if(!CaseManUtils.isBlank(value)) {
    	// Retrieve the details of the warrant.
    	var params = new ServiceParams();
    	params.addSimpleParameter("warrantID", value);
    	Services.callService("getWarrant", params, SearchResultsLOVGrid, true);
    	Services.setValue(this.dataBinding, "");
    }
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
SearchResultsLOVGrid.onSuccess = function(dom) 
{
    // Select the ManageCase tag rather than the ds tag
    var data = dom.selectSingleNode(XPathConstants.WARRANT_BASE);
    if ( null != data )
    {
	    Services.startTransaction();
	    Services.replaceNode(XPathConstants.WARRANT_BASE, data);
	    
	    // Set the original executing court in the appropriate fields
	    var originalExecutingCourtCode = Services.getValue(ExecutingCourtCode.dataBinding);
	    Services.setValue(XPathConstants.WARRANT_BASE + "/OriginalExecutingCourt", originalExecutingCourtCode);
	    Services.setValue(Header_ExecutingCourtCode.dataBinding, originalExecutingCourtCode);

        // Set Warrant Fee updated flag (TRAC 1676)
        Services.setValue(XPathConstants.WARRANT_BASE + "/WarrantFeeUpdated", "N");

	    // Set values in /ds/var/app
	    Services.setValue( MaintainWarrantsParams.WARRANT_ID, Services.getValue(XPathConstants.WARRANT_ID_XPATH) );
	    Services.setValue( MaintainWarrantsParams.CASE_NUMBER, Services.getValue(Header_CaseNumber.dataBinding) );
	    Services.setValue( MaintainWarrantsParams.CO_NUMBER, Services.getValue(Header_CONumber.dataBinding) );
		Services.endTransaction();
	}
    
    // This must be done outside of the transaction
    Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
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
SearchResultsLOVGrid.onSystemException = function(exception) {
    alert("Unable to load warrant details.");
}
/**
 * @author fzj0yl
 * @return "Header_WarrantNumber"  
 */
SearchResultsLOVGrid.nextFocusedAdaptorId = function() {
    return "Header_WarrantNumber";
}

/******************************** POPUPS ******************************************/

function Warrant_Details_Popup() {};

/**
 * @author fzj0yl
 * 
 */
Warrant_Details_Popup.prePopupPrepare = function()
{
    Services.startTransaction();
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/BalanceOfDebt",   Services.getValue(WarrantDetails_BalanceOfDebt.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/AmountOfWarrant", Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/Fee", 			  Services.getValue(WarrantDetails_Fee.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/SolicitorsCosts", Services.getValue(WarrantDetails_SolicitorsCosts.dataBinding));
    Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantDetails/LandRegistryFee", Services.getValue(WarrantDetails_LandRegistryFee.dataBinding));
    Services.endTransaction();
}

Warrant_Details_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "Footer_DetailsOfWarrantButton"} ]
	}
};

/**
 * @author fzj0yl
 * @return "Status_SaveButton"  
 */
Warrant_Details_Popup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/**********************************************************************************/

/**
 * Logic to detect when fields have been updated so the user can be prompted to
 * Save when navigating away from the screen.
 * @author fzj0yl
 * 
 */
function updateDetailsLogic() {}
updateDetailsLogic.logicOn = [Header_IssueDate.dataBinding, ExecutingCourtCode.dataBinding, BailiffAreaNo.dataBinding, WarrantDetails_BalanceOfDebt.dataBinding, WarrantDetails_AmountOfWarrant.dataBinding, WarrantDetails_Fee.dataBinding, WarrantDetails_SolicitorsCosts.dataBinding, WarrantDetails_LandRegistryFee.dataBinding, Defendant1_Address_Line1.dataBinding, Defendant1_Address_Line2.dataBinding, Defendant1_Address_Line3.dataBinding, Defendant1_Address_Line4.dataBinding, Defendant1_Address_Line5.dataBinding, Defendant1_Address_PostCode.dataBinding, Defendant2_Address_Line1.dataBinding, Defendant2_Address_Line2.dataBinding, Defendant2_Address_Line3.dataBinding, Defendant2_Address_Line4.dataBinding, Defendant2_Address_Line5.dataBinding, Defendant2_Address_PostCode.dataBinding, Additional_Notes.dataBinding];
updateDetailsLogic.logic = function(event)
{
	if ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" || 
		 event.getXPath() == "/" || event.getType() != DataModelEvent.UPDATE )
	{
		return;
	}

	// Check the correct input has called this function
	var validInput = false;
	for ( var i=0, l=updateDetailsLogic.logicOn.length; i<l; i++ )
	{
		if (event.getXPath() == updateDetailsLogic.logicOn[i])
		{
			validInput = true;
			break;
		}
	}

	// Check if fields are updated
	if (!validInput)
	{
		return;
	}

	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
}

