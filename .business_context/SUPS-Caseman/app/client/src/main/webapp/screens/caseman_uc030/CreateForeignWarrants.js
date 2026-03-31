/** 
 * @fileoverview CreateForeignWarrants.js:
 * This file contains the configurations for the UC030 - Create Foreign Warrants screen
 *
 * @author Tim Connor
 *
 * Changes:
 * 30/05/2006 - Chris Vincent, added JavaDoc comments and changed Global Variables to
 *              Static variables.
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 22/06/2006 - Chris Vincent, reference data call to getSystemData changed to use the global
 *				court code instead of a court specific court code.
 * 12/07/2006 - Chris Vincent, removed the Coded Party LOV popup and replaced it with the new
 * 				Coded Party Search Subform.  This affects the Party For and Solicitor code fields.
 * 				Where the data was previously in the reference data, the code fields need to do
 * 				a lookup themselves to see if the code entered is valid.
 * 23/08/2006 - Paul Roberts, fixed defect 3880 - currency transforms and validation.
 * 20/09/2--6 - Paul Robinson, defect 5213 - amount of Fee cannot be zero
 * 27/11/2006 - Chris Vincent, added Header_IssueDate.logic() which sets focus in the Party For Code
 * 				field on completion of the Issue Date and the other header fields are complete.
 * 				UCT Defect 727.
 * 04/12/2006 - Steve Blair - UCT defect 824, manually entered foreign warrants shouldn't be printed
 * 				up by WAREX report. Set date printed so won't be picked up by report.
 * 22/12/2006 - Steve Blair - UCT defect 824, manually entered foreign warrants shouldn't be reprinted. 
 * 				Set date reprinted so won't be picked up by report.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 23/04/2007 - Chris Vincent, updated Status_SaveButton.actionBinding to set the CCBCWarrant flag to 'Y'
 * 				if the issuing court is CCBC, otherwise leaves as null.  CaseMan defect 6170.
 * 20/05/2011 - Chris Vincent, update to Header_WarrantNumber.validate() to allow CCBC 7 Digit Warrant Numbers
 *				to be added.  Trac 4206.
 * 19/09/2011 - Chris Vincent, change to function determineCPAdminCourtCode to use new generic 
 *				CaseManUtils function.  Trac 4553.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering changes including a new refdata service isNewNumberingActive and
 *				function isNewNumberingSystemActive() to read it.  Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.  Warrant number validation enhanced to use different
 *				validation based upon whether new numbering is active and also includes a new server side call to check to
 *				see if the foreign warrant for this warrant/case record already exists on this court.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes where EXECUTION warrants are being replaced with CONTROL warrants.
 */

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
XPathConstants.WARRANT_BASE = "/ds/Warrant";
XPathConstants.MAX_FEE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDataList/SystemData[./Item='WARRANT_FEE']/ItemValue";
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.LOVPARTY_DESTINATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/LOVPartyDestinationXPath";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ActionAfterSave";
XPathConstants.DATERECEIVED_MESSAGE_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ShownDateRequestReceivedAlert";
XPathConstants.CLAIM_CODE_VALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/ClaimantCodedPartyCodeValid";
XPathConstants.SOL_CODE_VALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/SolicitorCodedPartyCodeValid";
XPathConstants.WARRANT_EXISTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/tmp/WarrantExists";

/**
 * Actions After Saving
 * @author fzj0yl
 * 
 */
function ActionAfterSave() {};
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
    createForeignWarrants.initialise();
    Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
	Services.setValue(XPathConstants.WARRANT_EXISTS_XPATH,"");
    Services.endTransaction();
    Services.setFocus("Header_DateRequestReceived");
}

/***********************************************************************************/

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

/***********************************************************************************/

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

/***********************************************************************************/

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

/***********************************************************************************/

/**
 * Indicates whether or not the claimant is a coded party.
 *
 * @return [Boolean] True if the claimant is a coded party, else False
 * @author fzj0yl
 */
function isClaimantCodedParty() 
{
    var code = Services.getValue(Claimant_Code.dataBinding);
    if( !CaseManUtils.isBlank(code) && null == Claimant_Code.validate() ) 
    {
        return true;
    }
    return false;
}

/***********************************************************************************/

/**
 * Indicates whether or not the solicitor is a coded party.
 *
 * @return [Boolean] True if the solicitor is a coded party, else False
 * @author fzj0yl
 */
function isSolicitorCodedParty() 
{
    var code = Services.getValue(Solicitor_Code.dataBinding);
    if( !CaseManUtils.isBlank(code) ) 
    {
        if(Solicitor_Code.validate() == null) 
        {
            return true;
        }
    }
    return false;
}

/***********************************************************************************/

/**
 * Function indicates whether or not the header fields are complete and valid.
 *
 * @return [Boolean] True if the header fields have been entered and are all valid, else False
 * @author fzj0yl
 */
function areHeaderFieldsEntered() 
{
    var dateRequestReceived = Services.getValue(Header_DateRequestReceived.dataBinding);
    if(CaseManUtils.isBlank(dateRequestReceived) || Header_DateRequestReceived.validate() != null) 
    {
        return false;
    }

    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(CaseManUtils.isBlank(warrantType)) 
    {
        return false;
    }
    
    var issuedBy = Services.getValue(Header_IssuedByCourtCode.dataBinding);
    if(CaseManUtils.isBlank(issuedBy) || Header_IssuedByCourtCode.validate() != null) 
    {
        return false;
    }
    
    var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
    if(CaseManUtils.isBlank(caseNumber) || Header_CaseNumber.validate() != null) 
    {
        return false;
    }

    var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
    if(CaseManUtils.isBlank(warrantNumber) || Header_WarrantNumber.validate() != null) 
    {
        return false;
    }

    var issueDate = Services.getValue(Header_IssueDate.dataBinding);
    if(CaseManUtils.isBlank(issueDate) || Header_IssueDate.validate() != null) 
    {
        return false;
    }

    var executedBy = Services.getValue(Header_ExecutingCourtCode.dataBinding);
    if(CaseManUtils.isBlank(executedBy) || Header_ExecutingCourtCode.validate() != null) 
    {
        return false;
    }
    return true;
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
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function determines which admin court code to use for the coded party code
 * specified based on the range it is in.
 * 
 * @param codedPartyCode [Integer] The coded party code to test
 * @return [Integer] The admin court code of the coded party code passed in
 * @author fzj0yl
 */
function determineCPAdminCourtCode(codedPartyCode)
{
	var adminCourtCode = null;
	if ( CaseManUtils.isCCBCNationalCodedParty(codedPartyCode) ) 
	{
	    // Party is a national coded party
		adminCourtCode = CaseManUtils.CCBC_COURT_CODE;
	}
	else if ( codedPartyCode >= 7000 ) 
	{
	    // Party is a non CPC national coded party
		adminCourtCode = CaseManUtils.GLOBAL_COURT_CODE;
	}
	else 
	{
	    // Party is a local coded party
	    var executingCourt = Services.getValue(Header_ExecutingCourtCode.dataBinding);
		adminCourtCode = executingCourt;
	}
	return adminCourtCode;
}

/*********************************************************************************/

/**
 * Indicates whether or not the new case numbering system is active or not
 * @return [Boolean] true if active, else false
 */
function isNewNumberingSystemActive()
{
	var isActive = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseNumbering/NewNumbering/IsActive");
	return (isActive == "true") ? true : false;
}

/******************************* FORM ELEMENT ***************************************/

function createForeignWarrants() {}

// Load the reference data from the xml into the model
createForeignWarrants.refDataServices = [
	{name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]},
	{name:"CaseTypeRules", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"../../CaseTypeRules.xml"},
	{name:"WarrantTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getWarrantTypes", serviceParams:[]},
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"CaseNumbering", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"isNewNumberingActive", serviceParams:[] },
	{name:"SystemData", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemData", serviceParams:[ { name:"adminCourtCode", constant:CaseManUtils.GLOBAL_COURT_CODE } ] }
];

/**
 * @author fzj0yl
 * 
 */
createForeignWarrants.initialise = function() 
{
    Services.startTransaction();
	// Load an empty warrant structure
	var newWarrant = Services.loadDOMFromURL("Warrant.xml");
	Services.replaceNode("/ds/Warrant", newWarrant);
	Services.setValue(XPathConstants.WARRANT_BASE + "/ExecutingCourtCode", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.setValue(XPathConstants.WARRANT_BASE + "/IssueDate", CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	Services.setValue(XPathConstants.WARRANT_BASE + "/CreatedBy", Services.getCurrentUser() );
	Services.setValue(Header_DateRequestReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	Services.setValue(Header_WarrantType.dataBinding, "CONTROL");
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
	Services.endTransaction();
}

/************************* CODED PARTY SEARCH SUBFORM ******************************/

function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";

/**
 * @author fzj0yl
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var adminCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, adminCourtCode);
	Services.setValue(CodedPartySearchParams.RETRIEVAL_SERVICE, CodedPartySearchParamsConstants.COURTANDNATIONAL);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: "/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode" }
];

/**
 * @author fzj0yl
 * 
 */
codedPartySearch_subform.processReturnedData = function() 
{
	var partyCode = Services.getValue("/ds/var/page/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	if ( !CaseManUtils.isBlank(partyCode) )
	{
		var xpath = Services.getValue(XPathConstants.LOVPARTY_DESTINATION_XPATH);
		Services.setValue(xpath, partyCode);
	}
}

/**
 * @author fzj0yl
 * @return ( xpath == Claimant_Code.dataBinding ) ? "Claimant_Code", "Solicitor_Code"  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function() 
{
    var xpath = Services.getValue(XPathConstants.LOVPARTY_DESTINATION_XPATH);
    return ( xpath == Claimant_Code.dataBinding ) ? "Claimant_Code" : "Solicitor_Code";
}
	
/******************************* HEADER FIELDS *************************************/

function Header_DateRequestReceived() {};
Header_DateRequestReceived.dataBinding = XPathConstants.WARRANT_BASE + "/DateRequestReceived";
Header_DateRequestReceived.tabIndex = 1;
Header_DateRequestReceived.componentName = "Date Warrant Received";
Header_DateRequestReceived.helpText = "The date when the warrant was received at the court.";
Header_DateRequestReceived.weekends = false;
Header_DateRequestReceived.isMandatory = function() { return true; }

Header_DateRequestReceived.logicOn = [Header_DateRequestReceived.dataBinding];
Header_DateRequestReceived.logic = function() 
{
	Services.setValue(XPathConstants.DATERECEIVED_MESSAGE_IND_XPATH, "N");
}

Header_DateRequestReceived.validateOn = [Header_DateRequestReceived.dataBinding, XPathConstants.WARRANT_BASE + "/HomeCourtIssueDate"];
Header_DateRequestReceived.validate = function()
{
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
        issueDate = CaseManUtils.createDate(issueDate);
        if(!CaseManUtils.isBlank(issueDate)) {
            var compare = CaseManUtils.compareDates(date, issueDate);
            if(compare > 0) {
                return ErrorCode.getErrorCode("CaseMan_dateBeforeIssueDate_Msg");
            }
        }
    }

	// Check for a future date
	if ( null != date ) 
	{
		var compare = CaseManUtils.compareDates(today, date);
		if(compare > 0) {
		    return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}

		var oneMonthAgo = CaseManUtils.oneMonthEarlier(today);
		compare = CaseManUtils.compareDates(date, oneMonthAgo);
		var alertShown = Services.getValue(XPathConstants.DATERECEIVED_MESSAGE_IND_XPATH);
		if ( compare > 0 && alertShown != "Y" )
		{
			alert(Messages.DATEOVER1MONTH_MESSAGE);
			Services.setValue(XPathConstants.DATERECEIVED_MESSAGE_IND_XPATH, "Y");
		}	
	}	
}

/***********************************************************************************/

function Header_WarrantType() {};
Header_WarrantType.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantType";
Header_WarrantType.tabIndex = 2;
Header_WarrantType.componentName = "Warrant Type";
Header_WarrantType.helpText = "Enter the type of warrant issued.";
Header_WarrantType.isMandatory = function() { return true; }
Header_WarrantType.srcData = XPathConstants.REF_DATA_XPATH + "/WarrantTypes";
Header_WarrantType.rowXPath = "WarrantType";
Header_WarrantType.keyXPath = "Type";
Header_WarrantType.displayXPath = "Type";

/***********************************************************************************/

function Header_WarrantTypeLOVButton() {};
Header_WarrantTypeLOVButton.tabIndex = 3;

/***********************************************************************************/

function Header_IssuedByCourtCode() {};
Header_IssuedByCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/IssuedBy";
Header_IssuedByCourtCode.tabIndex = 4;
Header_IssuedByCourtCode.maxLength = 3;
Header_IssuedByCourtCode.componentName = "Issued By";
Header_IssuedByCourtCode.helpText = "The code of the court who originally issued the warrant.";
Header_IssuedByCourtCode.isMandatory = function() { return true; }
Header_IssuedByCourtCode.validateOn = [Header_IssuedByCourtCode.dataBinding, XPathConstants.WARRANT_BASE + "/ExecutingCourtCode"];
Header_IssuedByCourtCode.validate = function() {
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName == null)
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	} else {
	    var executingCourtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	    var issuedBy = Services.getValue(Header_IssuedByCourtCode.dataBinding);
	    if(!CaseManUtils.isBlank(executingCourtCode) && executingCourtCode == issuedBy) {
	        ec = ErrorCode.getErrorCode("CaseMan_invalidIssuingCourt_Msg");
	    }
	}
	return ec;	
}
Header_IssuedByCourtCode.logicOn = [Header_IssuedByCourtCode.dataBinding];
Header_IssuedByCourtCode.logic = function() {
	var value = Services.getValue(this.dataBinding);
	
	if(this.getValid()) {
		Services.setValue(Header_IssuedByCourtName.dataBinding, value);		
	}
}

/***********************************************************************************/

function Header_IssuedByCourtName() {};
Header_IssuedByCourtName.dataBinding = "/ds/var/page/tmp/IssuedByAutocomplete";
Header_IssuedByCourtName.tabIndex = 5;
Header_IssuedByCourtName.componentName = "Issued By Name";
Header_IssuedByCourtName.helpText = "The name of the court who originally issued the warrant.";
Header_IssuedByCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_IssuedByCourtName.isMandatory = function() { return true; }
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

/***********************************************************************************/

function Header_IssuedByCourtLOVButton() {};
Header_IssuedByCourtLOVButton.tabIndex = 6;

/***********************************************************************************/

function Header_CaseNumber() {};
Header_CaseNumber.dataBinding = XPathConstants.WARRANT_BASE + "/CaseNumber";
Header_CaseNumber.tabIndex = 7;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties.";
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if (value != null) {
		return CaseManValidationHelper.validateCaseNumber(value);
	}
	return null;
}
Header_CaseNumber.transformToDisplay = toUpperCase;
Header_CaseNumber.transformToModel = toUpperCase;

/***********************************************************************************/

function Header_WarrantNumber() {};
Header_WarrantNumber.dataBinding = XPathConstants.WARRANT_BASE + "/WarrantNumber";
Header_WarrantNumber.tabIndex = 8;
Header_WarrantNumber.maxLength = 8;
Header_WarrantNumber.componentName = "Warrant Number";
Header_WarrantNumber.helpText = "Enter the warrant number as quoted on the warrant.";
Header_WarrantNumber.isMandatory = function() { return true; }
Header_WarrantNumber.validateOn = [Header_WarrantNumber.dataBinding, Header_IssuedByCourtCode.dataBinding, XPathConstants.WARRANT_EXISTS_XPATH];
Header_WarrantNumber.validate = function() 
{
	var ec = null;
	var ecWarrant = null;
	var ecCCBC = null;
	var warrantNumber =  Services.getValue(Header_WarrantNumber.dataBinding);
	var issuingCourtId =  Services.getValue(Header_IssuedByCourtCode.dataBinding);
	var newNumberingActive = isNewNumberingSystemActive();
	if ( !CaseManUtils.isBlank(issuingCourtId) )
	{
		// If it's CCBC check validate against CCBC criteria
		if ( issuingCourtId == CaseManUtils.CCBC_COURT_CODE )
		{
			// Different validation method based upon whether new numbering system active
			ecWarrant = newNumberingActive ? CaseManValidationHelper.validateNewWarrantNumber(warrantNumber) : CaseManValidationHelper.validateWarrantNumber(warrantNumber);
			ecCCBC = CaseManValidationHelper.validateCCBCWarrantNumber(warrantNumber);
			if ( ecWarrant != null && ecCCBC != null )
			{
				ec = ecCCBC;
			}
		} 
		else 
		{	
			// Different validation method based upon whether new numbering system active
			ec = newNumberingActive ? CaseManValidationHelper.validateNewWarrantNumber(warrantNumber) : CaseManValidationHelper.validateWarrantNumber(warrantNumber);
		}
	} 
	else 
	{
		// Different validation method based upon whether new numbering system active
		ecWarrant = newNumberingActive ? CaseManValidationHelper.validateNewWarrantNumber(warrantNumber) : CaseManValidationHelper.validateWarrantNumber(warrantNumber);
		ecCCBC = CaseManValidationHelper.validateCCBCWarrantNumber(warrantNumber);
		if ( ecWarrant != null && ecCCBC != null )
		{
			ec = ecWarrant;
		}
	}
	
	if ( null == ec && newNumberingActive )
	{
		// All other Warrant validation passed, check the server side indicator of warrant existence
		// (only when new numbering system active)
		var warrantExists = Services.getValue(XPathConstants.WARRANT_EXISTS_XPATH);
		if ( warrantExists == "true" )
		{
			ec = ErrorCode.getErrorCode("CaseMan_foreignWarrantAlreadyExists_Msg");	
		}
	}
	
	return ec;
}
Header_WarrantNumber.transformToDisplay = toUpperCase;
Header_WarrantNumber.transformToModel = toUpperCase;

Header_WarrantNumber.logicOn = [Header_WarrantNumber.dataBinding, Header_CaseNumber.dataBinding];
Header_WarrantNumber.logic = function(event)
{
	if ( event.getXPath() != Header_WarrantNumber.dataBinding && event.getXPath() != Header_CaseNumber.dataBinding )
	{
		return;		
	}

	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) && !CaseManUtils.isBlank(warrantNumber) && isNewNumberingSystemActive() )
	{
		// Case Number and Warrant Number entered and new numbering system is active
		var owningCourt = Services.getValue(Header_ExecutingCourtCode.dataBinding);
		
		var params = new ServiceParams();
		params.addSimpleParameter("warrantNumber", warrantNumber );
		params.addSimpleParameter("caseNumber", caseNumber);
		params.addSimpleParameter("owningCourt", owningCourt);
		Services.callService("checkForeignWarrantExists", params, Header_WarrantNumber, true);
	}
}

/**
 * Handles the response from the server side regarding whether a foreign warrant copy for this particular warrant already exists
 */
Header_WarrantNumber.onSuccess = function(dom) 
{
	if ( dom != null )
	{
		// Retrieve response and place in the DOM
		var warrantExists = dom.selectSingleNode("/ds/WarrantSearch/WarrantExists").text;
		Services.setValue(XPathConstants.WARRANT_EXISTS_XPATH, warrantExists);
	}
	else
	{
		Services.setValue(XPathConstants.WARRANT_EXISTS_XPATH, "");
	}
}

/***********************************************************************************/

function Header_IssueDate() {};
Header_IssueDate.dataBinding = XPathConstants.WARRANT_BASE + "/HomeCourtIssueDate";
Header_IssueDate.tabIndex = 9;
Header_IssueDate.componentName = "Home Court Issue Date";
Header_IssueDate.helpText = "Enter the date the warrant was issued at the home court.";
Header_IssueDate.isMandatory = function() { return true; }
Header_IssueDate.validateOn = [Header_DateRequestReceived.dataBinding, Header_IssueDate.dataBinding];
Header_IssueDate.validate = function() {
	var value = Services.getValue(this.dataBinding);
	
	var valid = CaseManUtils.convertDateToDisplay(value);
	if (valid == null) {
		return ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");		
	}

	var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate"));
	var date = CaseManUtils.createDate(value);
	
	if (null != date) {
	    // Check for a future date
		var compare = CaseManUtils.compareDates(today, date);
		if(compare > 0) {
		    return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}	    
	    
	    // Check that the date is not after the date request received
	    var dateRequestReceived = Services.getValue(Header_DateRequestReceived.dataBinding);
	    if(!CaseManUtils.isBlank(dateRequestReceived)) {
	        var compare = CaseManUtils.compareDates(date, CaseManUtils.createDate(dateRequestReceived));
	        if(compare < 0) {
	            return ErrorCode.getErrorCode("CaseMan_dateBeforeIssueDate_Msg");
	        }
	    }
	    
	    var oneYearAgo = CaseManUtils.oneYearEarlier(today);
	    if (date <= oneYearAgo) {
	    	return ErrorCode.getErrorCode("CaseMan_dateMoreThanOrEqualToOneYearInPast_Msg");
	    }
	}
	return null;
}

Header_IssueDate.logicOn = [Header_IssueDate.dataBinding];
Header_IssueDate.logic = function(event)
{
	if ( event.getXPath() != Header_IssueDate.dataBinding )
	{
		return;		
	}
	
	// UCT Defect 727 - if on completion of the Issue Date, the Party fields
	// can be enabled, set focus in the Party For Code field.
	if ( areHeaderFieldsEntered() )
	{
		Services.setFocus("Claimant_Code")
	}
}

/***********************************************************************************/

function Header_ExecutingCourtCode() {};
Header_ExecutingCourtCode.dataBinding = XPathConstants.WARRANT_BASE + "/ExecutingCourtCode";
Header_ExecutingCourtCode.tabIndex = -1;
Header_ExecutingCourtCode.maxLength = 3;
Header_ExecutingCourtCode.componentName = "Executing Court Code";
Header_ExecutingCourtCode.helpText = "The code of the court who is to execute the warrant.";
Header_ExecutingCourtCode.isMandatory = function() { return true; }
Header_ExecutingCourtCode.isReadOnly = function() { return true; }
Header_ExecutingCourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Header_ExecutingCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = '" + courtCode + "']/Name");
		if ( courtCode == CaseManUtils.CCBC_COURT_CODE )
		{
			// CCBC not allowed
			ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
		}
		else if ( null == courtName ) 
		{
			// Thecourt entered is not a SUPS Court
			// Defect 2650 - allow non-SUPS courts
			// ec = ErrorCode.getErrorCode("CaseMan_invalidSUPSCourtCode_Msg");
		} 
		else 
		{
			// Test the executing court is not the same as the issuing court
		    var issuedBy = Services.getValue(Header_IssuedByCourtCode.dataBinding);
		    if( courtCode == issuedBy )
		    {
		        ec = ErrorCode.getErrorCode("CaseMan_invalidIssuingCourt_Msg");
		    }
		}
	}
	return ec;	
}
Header_ExecutingCourtCode.logicOn = [Header_ExecutingCourtCode.dataBinding];
Header_ExecutingCourtCode.logic = function()
{
	if ( this.getValid() ) 
	{
	    var courtCode = Services.getValue(this.dataBinding);
		//Services.setValue(Header_ExecutingCourtName.dataBinding, courtCode);
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = '" + courtCode + "']/Name");
		if ( null != courtName) 
		{
			Services.setValue(XPathConstants.WARRANT_BASE + "/OwnedBy", courtCode);  // The owning court of a foreign warrant should be its executing court
			Services.setValue(Header_ExecutingCourtName.dataBinding, courtName);
		} 
		else 
		{
			Services.setValue(XPathConstants.WARRANT_BASE + "/OwnedBy", Services.getValue(Header_IssuedByCourtName.dataBinding));  // Unless it's non-SUPS
		}
	}
}

/***********************************************************************************/

function Header_ExecutingCourtName() {};
Header_ExecutingCourtName.dataBinding = "/ds/var/page/tmp/ExecutingCourtNameAutocomplete";
Header_ExecutingCourtName.tabIndex = -1;
Header_ExecutingCourtName.componentName = "Executing Court Name";
Header_ExecutingCourtName.helpText = "The name of the court who is to execute the warrant";
Header_ExecutingCourtName.isReadOnly = function() { return true; }
Header_ExecutingCourtName.logicOn = [Header_ExecutingCourtName.dataBinding];
Header_ExecutingCourtName.logic = function()
{
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if(courtName != null) {
		// The entered value must be valid
		Services.setValue(Header_ExecutingCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.WARRANT_BASE + "/ExecutingCourtName", courtName);
	}
}
Header_ExecutingCourtName.transformToDisplay = toUpperCase;
Header_ExecutingCourtName.transformToModel = toUpperCase;

/******************************* CLAIMANT FIELDS **********************************/

function Claimant_Code() {};
Claimant_Code.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Code";
Claimant_Code.tabIndex = 20;
Claimant_Code.maxLength = 4;
Claimant_Code.componentName = "Party For Code";
Claimant_Code.helpText = "Unique four digit code for party - list available.";

Claimant_Code.validateOn = [XPathConstants.CLAIM_CODE_VALID_XPATH];
Claimant_Code.validate = function() 
{
	var code = Services.getValue(this.dataBinding);
	var ec = null;

	// Check that the code is a number
	if(!CaseManValidationHelper.validateNumber(code)) {
		ec = ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
	
	if ( null == ec ) 
	{
		// A code has been entered so try and look up the data for the code
		var serverSideCheckValid = Services.getValue(XPathConstants.CLAIM_CODE_VALID_XPATH);
		if ( "false" == serverSideCheckValid )
		{
			ec = ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
		}
	}
	return ec;
}

Claimant_Code.logicOn = [Claimant_Code.dataBinding];
Claimant_Code.logic = function(event) 
{
	if ( event.getXPath() != Claimant_Code.dataBinding ) 
	{
		return;
	}
	
	var codedPartyCode = Services.getValue(this.dataBinding);	
	if ( !CaseManUtils.isBlank(codedPartyCode) ) 
	{
		Services.setValue(XPathConstants.CLAIM_CODE_VALID_XPATH, "true");
		if ( null != Claimant_Code.validate() )
		{
			return;
		}
		
		var params = new ServiceParams();
		params.addSimpleParameter( "adminCourtCode", determineCPAdminCourtCode(codedPartyCode) );
		params.addSimpleParameter("codedPartyCode", codedPartyCode);
		Services.callService("getCodedParty", params, Claimant_Code, true);
	} 
	else 
	{
	    Services.setValue(Claimant_Name.dataBinding, "");
	}
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
Claimant_Code.onSuccess = function(dom) 
{
	var root = "/CodedParties/CodedParty";
	if ( null != dom.selectSingleNode(root) )
	{
	    Services.setValue(Claimant_Name.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")));
	}
	else
	{
		// Coded Party Entered is invalid
		Services.setValue(XPathConstants.CLAIM_CODE_VALID_XPATH, "false");
		Services.setFocus("Claimant_Code");
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Claimant_Code.onError = function(exception)
{
	if(confirm(Messages.FAILEDPARTYDATALOAD_MESSAGE))
	{
		// Try again
		var partyCode = Services.getValue(Claimant_Code.dataBinding);
		Services.setValue(Claimant_Code.dataBinding, partyCode);
	}
	else
	{
		exitScreen();
	}
}

Claimant_Code.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Claimant_Code.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Claimant_Name() {};
Claimant_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Name";
Claimant_Name.tabIndex = 21;
Claimant_Name.maxLength = 70;
Claimant_Name.componentName = "Party For Name";
Claimant_Name.helpText = "Name of party.";
Claimant_Name.isMandatory = function() { return true; }
Claimant_Name.transformToDisplay = toUpperCase;
Claimant_Name.transformToModel = convertToUpperStripped;
Claimant_Name.readOnlyOn = [Claimant_Code.dataBinding, XPathConstants.CLAIM_CODE_VALID_XPATH];
Claimant_Name.isReadOnly = isClaimantCodedParty;
Claimant_Name.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Claimant_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Claimant_NameLOVButton() {};
Claimant_NameLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Claimant_Code" }, { key: Key.F6, element: "Claimant_Name" } ]
	}
};
Claimant_NameLOVButton.tabIndex = 22;
/**
 * @author fzj0yl
 * 
 */
Claimant_NameLOVButton.actionBinding = function() 
{
    Services.setValue(XPathConstants.LOVPARTY_DESTINATION_XPATH, Claimant_Code.dataBinding);
	Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

Claimant_NameLOVButton.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Claimant_NameLOVButton.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Solicitor_Code() {};
Solicitor_Code.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Code";
Solicitor_Code.tabIndex = 23;
Solicitor_Code.maxLength = 4;
Solicitor_Code.componentName = "Party For Code";
Solicitor_Code.helpText = "Unique four digit code for party - list available.";

Solicitor_Code.validateOn = [XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Code.validate = function() 
{
	var code = Services.getValue(this.dataBinding);
	var ec = null;

	// Check that the code is a number
	if ( !CaseManValidationHelper.validateNumber(code) ) 
	{
		ec = ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
	
	if ( null == ec ) 
	{
		// A code has been entered so try and look up the data for the code
		var serverSideCheckValid = Services.getValue(XPathConstants.SOL_CODE_VALID_XPATH);
		if ( "false" == serverSideCheckValid )
		{
			ec = ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
		}
	}
	return ec;
}

Solicitor_Code.logicOn = [Solicitor_Code.dataBinding];
Solicitor_Code.logic = function(event) 
{
	if ( event.getXPath() != Solicitor_Code.dataBinding ) 
	{
		return;
	}
	
	var codedPartyCode = Services.getValue(this.dataBinding);	
	if ( !CaseManUtils.isBlank(codedPartyCode) ) 
	{
		Services.setValue(XPathConstants.SOL_CODE_VALID_XPATH, "true");
		if ( null != Solicitor_Code.validate() )
		{
			return;
		}
		
		var params = new ServiceParams();
		params.addSimpleParameter( "adminCourtCode", determineCPAdminCourtCode(codedPartyCode) );
		params.addSimpleParameter("codedPartyCode", codedPartyCode);
		Services.callService("getCodedParty", params, Solicitor_Code, true);
	} 
	else 
	{
	    Services.setValue(Solicitor_Name.dataBinding, "");
	}
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
Solicitor_Code.onSuccess = function(dom) 
{
	var root = "/CodedParties/CodedParty";
	if ( null != dom.selectSingleNode(root) )
	{
	    Services.startTransaction();
	    Services.setValue(Solicitor_Name.dataBinding,				XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")));
	    Services.setValue(Solicitor_Address_Line1.dataBinding,		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[1]")));
	    Services.setValue(Solicitor_Address_Line2.dataBinding,		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[2]")));
	    Services.setValue(Solicitor_Address_Line3.dataBinding,		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[3]")));
	    Services.setValue(Solicitor_Address_Line4.dataBinding,		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[4]")));
	    Services.setValue(Solicitor_Address_Line5.dataBinding,		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/Line[5]")));
	    Services.setValue(Solicitor_Address_PostCode.dataBinding,	XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/Address/PostCode")));
	    Services.setValue(Solicitor_DX.dataBinding,					XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/DX")));
	    Services.setValue(Solicitor_TelephoneNumber.dataBinding, 	XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/TelephoneNumber")));
	    Services.setValue(Solicitor_FaxNumber.dataBinding, 			XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/FaxNumber")));
	    Services.setValue(Solicitor_EmailAddress.dataBinding, 		XML.getNodeTextContent(dom.selectSingleNode(root + "/ContactDetails/EmailAddress")));
	    Services.endTransaction();
	}
	else
	{
		// Coded Party Entered is invalid
		Services.setValue(XPathConstants.SOL_CODE_VALID_XPATH, "false");
		Services.setFocus("Solicitor_Code");
	}
}

/**
 * @param exception
 * @author fzj0yl
 * 
 */
Solicitor_Code.onError = function(exception)
{
	if(confirm(Messages.FAILEDPARTYDATALOAD_MESSAGE))
	{
		// Try again
		var partyCode = Services.getValue(Solicitor_Code.dataBinding);
		Services.setValue(Solicitor_Code.dataBinding, partyCode);
	}
	else
	{
		exitScreen();
	}
}
Solicitor_Code.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Claimant_Name.dataBinding];
Solicitor_Code.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Claimant_Name.dataBinding));
}

/***********************************************************************************/
function Solicitor_Name() {};
Solicitor_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Name";
Solicitor_Name.tabIndex = 24;
Solicitor_Name.maxLength = 70;
Solicitor_Name.componentName = "Representative Name";
Solicitor_Name.helpText = "Name of party's representative.";
Solicitor_Name.isMandatory = function() { return true; }
Solicitor_Name.transformToDisplay = toUpperCase;
Solicitor_Name.transformToModel = convertToUpperStripped;
Solicitor_Name.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Name.isReadOnly = isSolicitorCodedParty;
Solicitor_Name.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Claimant_Name.dataBinding];
Solicitor_Name.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Claimant_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_NameLOVButton() {};
Solicitor_NameLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Solicitor_Code" }, { key: Key.F6, element: "Solicitor_Name" } ]
	}
};
Solicitor_NameLOVButton.tabIndex = 25;
/**
 * @author fzj0yl
 * 
 */
Solicitor_NameLOVButton.actionBinding = function() 
{
    Services.setValue(XPathConstants.LOVPARTY_DESTINATION_XPATH, Solicitor_Code.dataBinding);
	Services.dispatchEvent("codedPartySearch_subform", BusinessLifeCycleEvents.EVENT_RAISE);
}

Solicitor_NameLOVButton.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Claimant_Name.dataBinding];
Solicitor_NameLOVButton.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Claimant_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_Line1() {};
Solicitor_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[1]";
Solicitor_Address_Line1.tabIndex = 26;
Solicitor_Address_Line1.maxLength = 35;
Solicitor_Address_Line1.componentName = "Address Line 1";
Solicitor_Address_Line1.helpText = "First line of party's address.";
Solicitor_Address_Line1.isMandatory = function() { return true; }
Solicitor_Address_Line1.transformToDisplay = toUpperCase;
Solicitor_Address_Line1.transformToModel = convertToUpperStripped;
Solicitor_Address_Line1.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_Line1.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_Line1.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_Line1.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_Line2() {};
Solicitor_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[2]";
Solicitor_Address_Line2.tabIndex = 27;
Solicitor_Address_Line2.maxLength = 35;
Solicitor_Address_Line2.componentName = "Address Line 2";
Solicitor_Address_Line2.helpText = "Second line of party's address.";
Solicitor_Address_Line2.isMandatory = function() { return true; }
Solicitor_Address_Line2.transformToDisplay = toUpperCase;
Solicitor_Address_Line2.transformToModel = convertToUpperStripped;
Solicitor_Address_Line2.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_Line2.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_Line2.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_Line2.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_Line3() {};
Solicitor_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[3]";
Solicitor_Address_Line3.tabIndex = 28;
Solicitor_Address_Line3.maxLength = 35;
Solicitor_Address_Line3.componentName = "Address Line 3";
Solicitor_Address_Line3.helpText = "Third line of party's address.";
Solicitor_Address_Line3.transformToDisplay = toUpperCase;
Solicitor_Address_Line3.transformToModel = convertToUpperStripped;
Solicitor_Address_Line3.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_Line3.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_Line3.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_Line3.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_Line4() {};
Solicitor_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[4]";
Solicitor_Address_Line4.tabIndex = 29;
Solicitor_Address_Line4.maxLength = 35;
Solicitor_Address_Line4.componentName = "Address Line 4";
Solicitor_Address_Line4.helpText = "Fourth line of party's address.";
Solicitor_Address_Line4.transformToDisplay = toUpperCase;
Solicitor_Address_Line4.transformToModel = convertToUpperStripped;
Solicitor_Address_Line4.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_Line4.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_Line4.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_Line4.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_Line5() {};
Solicitor_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/Line[5]";
Solicitor_Address_Line5.tabIndex = 30;
Solicitor_Address_Line5.maxLength = 35;
Solicitor_Address_Line5.componentName = "Address Line 5";
Solicitor_Address_Line5.helpText = "Fifth line of party's address.";
Solicitor_Address_Line5.transformToDisplay = toUpperCase;
Solicitor_Address_Line5.transformToModel = convertToUpperStripped;
Solicitor_Address_Line5.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_Line5.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_Line5.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_Line5.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_Address_PostCode() {};
Solicitor_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/Address/PostCode";
Solicitor_Address_PostCode.tabIndex = 31;
Solicitor_Address_PostCode.maxLength = 8;
Solicitor_Address_PostCode.componentName = "Postcode";
Solicitor_Address_PostCode.helpText = "Party's postcode";
Solicitor_Address_PostCode.transformToDisplay = toUpperCase;
Solicitor_Address_PostCode.transformToModel = toUpperCase;
Solicitor_Address_PostCode.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_Address_PostCode.isReadOnly = isSolicitorCodedParty;
Solicitor_Address_PostCode.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Address_PostCode.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}
Solicitor_Address_PostCode.validate = function() 
{
	var ec = null;
	if ( !CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding)) ) 
	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return ec;
}

/***********************************************************************************/

function Solicitor_DX() {};
Solicitor_DX.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/DX";
Solicitor_DX.tabIndex = 32;
Solicitor_DX.maxLength = 35;
Solicitor_DX.componentName = "DX Number";
Solicitor_DX.helpText = "Party's document exchange reference number.";
Solicitor_DX.transformToDisplay = toUpperCase;
Solicitor_DX.transformToModel = convertToUpperStripped;
Solicitor_DX.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_DX.isReadOnly = isSolicitorCodedParty;
Solicitor_DX.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_DX.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_TelephoneNumber() {};
Solicitor_TelephoneNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/TelephoneNumber";
Solicitor_TelephoneNumber.tabIndex = 33;
Solicitor_TelephoneNumber.maxLength = 24;
Solicitor_TelephoneNumber.componentName = "Telephone Number";
Solicitor_TelephoneNumber.helpText = "The telephone number of the party";
Solicitor_TelephoneNumber.transformToDisplay = toUpperCase;
Solicitor_TelephoneNumber.transformToModel = convertToUpperStripped;
Solicitor_TelephoneNumber.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_TelephoneNumber.isReadOnly = isSolicitorCodedParty;
Solicitor_TelephoneNumber.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_TelephoneNumber.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_FaxNumber() {};
Solicitor_FaxNumber.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/FaxNumber";
Solicitor_FaxNumber.tabIndex = 34;
Solicitor_FaxNumber.maxLength = 24;
Solicitor_FaxNumber.componentName = "Fax Number";
Solicitor_FaxNumber.helpText = "The fax number of the party.";
Solicitor_FaxNumber.transformToDisplay = toUpperCase;
Solicitor_FaxNumber.transformToModel = convertToUpperStripped;
Solicitor_FaxNumber.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_FaxNumber.isReadOnly = isSolicitorCodedParty;
Solicitor_FaxNumber.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_FaxNumber.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/***********************************************************************************/

function Solicitor_EmailAddress() {};
Solicitor_EmailAddress.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/ContactDetails/EmailAddress";
Solicitor_EmailAddress.tabIndex = 35;
Solicitor_EmailAddress.maxLength = 80;
Solicitor_EmailAddress.componentName = "Email Address";
Solicitor_EmailAddress.helpText = "The email address of the party.";
Solicitor_EmailAddress.transformToDisplay = toUpperCase;
Solicitor_EmailAddress.transformToModel = toUpperCase;
Solicitor_EmailAddress.readOnlyOn = [Solicitor_Code.dataBinding, XPathConstants.SOL_CODE_VALID_XPATH];
Solicitor_EmailAddress.isReadOnly = isSolicitorCodedParty;
Solicitor_EmailAddress.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_EmailAddress.isEnabled = function() 
{
    if(!areHeaderFieldsEntered()) 
    {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}
Solicitor_EmailAddress.validate = function() 
{
	return CaseManValidationHelper.validatePattern(Services.getValue(this.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

/***********************************************************************************/

function Solicitor_Reference() {};
Solicitor_Reference.dataBinding = XPathConstants.WARRANT_BASE + "/Claimant/Representative/Reference";
Solicitor_Reference.tabIndex = 36;
Solicitor_Reference.maxLength = 24;
Solicitor_Reference.componentName = "Reference";
Solicitor_Reference.helpText = "Reference used by the party.";
Solicitor_Reference.transformToDisplay = toUpperCase;
Solicitor_Reference.transformToModel = convertToUpperStripped;
Solicitor_Reference.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Solicitor_Name.dataBinding];
Solicitor_Reference.isEnabled = function() 
{
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Solicitor_Name.dataBinding));
}

/******************************* DEFENDANT FIELDS **********************************/

function Defendant1_Name() {};
Defendant1_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Name";
Defendant1_Name.tabIndex = 41;
Defendant1_Name.maxLength = 70;
Defendant1_Name.componentName = "First Party Against Name";
Defendant1_Name.helpText = "Name of party.";
Defendant1_Name.isMandatory = function() { return true; }
Defendant1_Name.transformToDisplay = toUpperCase;
Defendant1_Name.transformToModel = convertToUpperStripped;
Defendant1_Name.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Defendant1_Name.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Defendant1_Address_Line1() {};
Defendant1_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[1]";
Defendant1_Address_Line1.tabIndex = 42;
Defendant1_Address_Line1.maxLength = 35;
Defendant1_Address_Line1.componentName = "Address Line 1";
Defendant1_Address_Line1.helpText = "First line of party's address.";
Defendant1_Address_Line1.isMandatory = function() { return true; }
Defendant1_Address_Line1.transformToDisplay = toUpperCase;
Defendant1_Address_Line1.transformToModel = convertToUpperStripped;
Defendant1_Address_Line1.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_Line1.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant1_Address_Line2() {};
Defendant1_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[2]";
Defendant1_Address_Line2.tabIndex = 43;
Defendant1_Address_Line2.maxLength = 35;
Defendant1_Address_Line2.componentName = "Address Line 2";
Defendant1_Address_Line2.helpText = "Second line of party's address.";
Defendant1_Address_Line2.isMandatory = function() { return true; }
Defendant1_Address_Line2.transformToDisplay = toUpperCase;
Defendant1_Address_Line2.transformToModel = convertToUpperStripped;
Defendant1_Address_Line2.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_Line2.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant1_Address_Line3() {};
Defendant1_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[3]";
Defendant1_Address_Line3.tabIndex = 44;
Defendant1_Address_Line3.maxLength = 35;
Defendant1_Address_Line3.componentName = "Address Line 3";
Defendant1_Address_Line3.helpText = "Third line of party's address.";
Defendant1_Address_Line3.transformToDisplay = toUpperCase;
Defendant1_Address_Line3.transformToModel = convertToUpperStripped;
Defendant1_Address_Line3.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_Line3.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant1_Address_Line4() {};
Defendant1_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[4]";
Defendant1_Address_Line4.tabIndex = 45;
Defendant1_Address_Line4.maxLength = 35;
Defendant1_Address_Line4.componentName = "Address Line 4";
Defendant1_Address_Line4.helpText = "Fourth line of party's address.";
Defendant1_Address_Line4.transformToDisplay = toUpperCase;
Defendant1_Address_Line4.transformToModel = convertToUpperStripped;
Defendant1_Address_Line4.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_Line4.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant1_Address_Line5() {};
Defendant1_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/Line[5]";
Defendant1_Address_Line5.tabIndex = 46;
Defendant1_Address_Line5.maxLength = 35;
Defendant1_Address_Line5.componentName = "Address Line 5";
Defendant1_Address_Line5.helpText = "Fifth line of party's address.";
Defendant1_Address_Line5.transformToDisplay = toUpperCase;
Defendant1_Address_Line5.transformToModel = convertToUpperStripped;
Defendant1_Address_Line5.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_Line5.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant1_Address_PostCode() {};
Defendant1_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant1/Address/PostCode";
Defendant1_Address_PostCode.tabIndex = 47;
Defendant1_Address_PostCode.maxLength = 8;
Defendant1_Address_PostCode.componentName = "Postcode";
Defendant1_Address_PostCode.helpText = "Party's postcode.";
Defendant1_Address_PostCode.transformToDisplay = toUpperCase;
Defendant1_Address_PostCode.transformToModel = toUpperCase;
Defendant1_Address_PostCode.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant1_Address_PostCode.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}
Defendant1_Address_PostCode.validate = function() 
{
	var ec = null;
	if ( !CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding)) ) 
	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return ec;
}

/***********************************************************************************/

function Defendant2_Name() {};
Defendant2_Name.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Name";
Defendant2_Name.tabIndex = 48;
Defendant2_Name.maxLength = 70;
Defendant2_Name.componentName = "Second Party Against Name";
Defendant2_Name.helpText = "Name of party.";
Defendant2_Name.transformToDisplay = toUpperCase;
Defendant2_Name.transformToModel = convertToUpperStripped;
Defendant2_Name.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant1_Name.dataBinding];
Defendant2_Name.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant1_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line1() {};
Defendant2_Address_Line1.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[1]";
Defendant2_Address_Line1.tabIndex = 49;
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
Defendant2_Address_Line1.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_Line1.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line2() {};
Defendant2_Address_Line2.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[2]";
Defendant2_Address_Line2.tabIndex = 50;
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
Defendant2_Address_Line2.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_Line2.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line3() {};
Defendant2_Address_Line3.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[3]";
Defendant2_Address_Line3.tabIndex = 51;
Defendant2_Address_Line3.maxLength = 35;
Defendant2_Address_Line3.componentName = "Address Line 3";
Defendant2_Address_Line3.helpText = "Third line of party's address.";
Defendant2_Address_Line3.transformToDisplay = toUpperCase;
Defendant2_Address_Line3.transformToModel = convertToUpperStripped;
Defendant2_Address_Line3.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_Line3.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line4() {};
Defendant2_Address_Line4.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[4]";
Defendant2_Address_Line4.tabIndex = 52;
Defendant2_Address_Line4.maxLength = 35;
Defendant2_Address_Line4.componentName = "Address Line 4";
Defendant2_Address_Line4.helpText = "Fourth line of party's address.";
Defendant2_Address_Line4.transformToDisplay = toUpperCase;
Defendant2_Address_Line4.transformToModel = convertToUpperStripped;
Defendant2_Address_Line4.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_Line4.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_Line5() {};
Defendant2_Address_Line5.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/Line[5]";
Defendant2_Address_Line5.tabIndex = 53;
Defendant2_Address_Line5.maxLength = 35;
Defendant2_Address_Line5.componentName = "Address Line 5";
Defendant2_Address_Line5.helpText = "Fifth line of party's address.";
Defendant2_Address_Line5.transformToDisplay = toUpperCase;
Defendant2_Address_Line5.transformToModel = convertToUpperStripped;
Defendant2_Address_Line5.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_Line5.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}

/***********************************************************************************/

function Defendant2_Address_PostCode() {};
Defendant2_Address_PostCode.dataBinding = XPathConstants.WARRANT_BASE + "/Defendant2/Address/PostCode";
Defendant2_Address_PostCode.tabIndex = 54;
Defendant2_Address_PostCode.maxLength = 8;
Defendant2_Address_PostCode.componentName = "Postcode";
Defendant2_Address_PostCode.helpText = "Party's postcode.";
Defendant2_Address_PostCode.transformToDisplay = toUpperCase;
Defendant2_Address_PostCode.transformToModel = toUpperCase;
Defendant2_Address_PostCode.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding, Defendant2_Name.dataBinding];
Defendant2_Address_PostCode.isEnabled = function() {
    if(!areHeaderFieldsEntered()) {
        return false;
    }
    return !CaseManUtils.isBlank(Services.getValue(Defendant2_Name.dataBinding));
}
Defendant2_Address_PostCode.validate = function() 
{
	var ec = null;
	if ( !CaseManValidationHelper.validatePostCode(Services.getValue(this.dataBinding)) ) 
	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return ec;
}

/************************* OTHER WARRENT DETAILS FIELDS ****************************/

function BailiffAreaNo() {};
BailiffAreaNo.dataBinding = XPathConstants.WARRANT_BASE + "/BailiffAreaNo";
BailiffAreaNo.tabIndex = 73;
BailiffAreaNo.maxLength = 2;
BailiffAreaNo.componentName = "Bailiff Area No";
BailiffAreaNo.helpText = "Enter the Bailiff's area number.";
BailiffAreaNo.validate = function()
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);
	if ( !CaseManValidationHelper.validateNumber(value) || value == "99" ) 
	{
	    ec = ErrorCode.getErrorCode("CaseMan_invalidBailiffAreaNo_Msg");
	}
	return ec;
}
BailiffAreaNo.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
BailiffAreaNo.isEnabled = areHeaderFieldsEntered;

/***********************************************************************************/

function Additional_Notes() {};
Additional_Notes.dataBinding = XPathConstants.WARRANT_BASE + "/AdditionalNotes";
Additional_Notes.tabIndex = 74;
Additional_Notes.maxLength = 120;
Additional_Notes.componentName = "Additional Notes";
Additional_Notes.helpText = "Enter any further information regarding the execution of this warrant.";
Additional_Notes.transformToDisplay = toUpperCase;
Additional_Notes.transformToModel = convertToUpperStripped;
Additional_Notes.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Additional_Notes.isEnabled = areHeaderFieldsEntered;

/******************************* WARRANT DETAILS FIELDS *************************************/

function WarrantDetails_BalanceOfDebt() {};
WarrantDetails_BalanceOfDebt.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceOfDebt";
WarrantDetails_BalanceOfDebt.tabIndex = 101;
WarrantDetails_BalanceOfDebt.maxLength = 12;
WarrantDetails_BalanceOfDebt.componentName = "Balance of Debt";
WarrantDetails_BalanceOfDebt.helpText = "Enter the outstanding balance of the judgment debt.";
WarrantDetails_BalanceOfDebt.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_BalanceOfDebt.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_BalanceOfDebt.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "CONTROL") {
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
	    if(errCode == null && value == 0 && warrantType == "CONTROL") {
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
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_AmountOfWarrant.mandatoryOn = [Header_WarrantType.dataBinding];
WarrantDetails_AmountOfWarrant.isMandatory = function() {
    var warrantType = Services.getValue(Header_WarrantType.dataBinding);
    if(warrantType == "CONTROL") {
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
	    if(errCode == null && value == 0 && warrantType == "CONTROL") {
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
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		} else if (errCode == null && value >= 100000000) {
			errCode = ErrorCode.getErrorCode("CaseMan_amountIncorrectRange10_Msg");
		} 
		else if (errCode == null && parseFloat(value) > maximum) 
		{
			var currencyCode = Services.getValue(WarrantDetails_FeeCurrency.dataBinding);
			var currencySymbol = CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");

			var message = ErrorCode.getErrorCode("CaseMan_maximumWarrantFeeExceded_Msg").getMessage();
			alert(message.replace(/XXX/, currencySymbol + parseFloat(maximum).toFixed(2)));
		}
	}
	return errCode;
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
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_SolicitorsCosts.transformToModel = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}
WarrantDetails_SolicitorsCosts.readOnlyOn = [WarrantDetails_AmountOfWarrant.dataBinding];
WarrantDetails_SolicitorsCosts.isReadOnly = function() {
    var amountOfWarrant = Services.getValue(WarrantDetails_AmountOfWarrant.dataBinding);
    if(CaseManUtils.isBlank(amountOfWarrant) || isNaN(amountOfWarrant) || amountOfWarrant <= 25) {
        Services.setValue(this.dataBinding, "");
        return true;
    }
    return false;
}
WarrantDetails_SolicitorsCosts.validate = function() {
	var value = Services.getValue(this.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value)) {
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
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
		if (errCode == null && value == 0) {
			errCode = ErrorCode.getErrorCode("CaseMan_zeroAmountCannotBeEntered_Msg");
	    } else if (errCode == null && value < 0) {
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
WarrantDetails_Total.isReadOnly = function() { return true; }
WarrantDetails_Total.tabIndex = -1;
WarrantDetails_Total.transformToDisplay = function(value) {
	return CaseManUtils.transformAmountToTwoDP(value, null);
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
WarrantDetails_BalanceAfterPaid.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaid.transformToDisplay = function(value) {
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

/***********************************************************************************/

function WarrantDetails_BalanceAfterPaidCurrency() {};
WarrantDetails_BalanceAfterPaidCurrency.dataBinding = XPathConstants.WARRANT_BASE + "/BalanceAfterPaidCurrency";
WarrantDetails_BalanceAfterPaidCurrency.tabIndex = -1;
WarrantDetails_BalanceAfterPaidCurrency.isReadOnly = function() { return true; }
WarrantDetails_BalanceAfterPaidCurrency.transformToDisplay = transformCurrencyToDisplay;
WarrantDetails_BalanceAfterPaidCurrency.transformToModel = transformCurrencyToModel;

/***********************************************************************************/

function WarrantDetails_OkButton() {};
WarrantDetails_OkButton.tabIndex = 114;
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
WarrantDetails_CancelButton.tabIndex = 115;
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
Footer_DetailsOfWarrantButton.tabIndex = 80;
Footer_DetailsOfWarrantButton.enableOn = [Header_DateRequestReceived.dataBinding, Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding, Header_ExecutingCourtCode.dataBinding];
Footer_DetailsOfWarrantButton.isEnabled = areHeaderFieldsEntered;

/******************************* STATUS BAR FIELDS *****************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "createForeignWarrants" } ]
	}
};

Status_CloseButton.tabIndex = 92;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;

/***********************************************************************************/

function Status_ClearButton() {}

Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "createForeignWarrants", alt: true } ]
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
		keys: [ { key: Key.F3, element: "createForeignWarrants" } ]
	}
};

Status_SaveButton.tabIndex = 90;
/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() {
	var invalidFields = FormController.getInstance().validateForm(true);
	
	if(0 == invalidFields.length) 
	{
		// UCT Defect 824 - Set date printed & date reprinted to not null so not picked up by WAREX report.
		var sysDate = CaseManUtils.getSystemDate(XPathConstants.REF_DATA_XPATH + "/SystemDate");
		Services.setValue(XPathConstants.WARRANT_BASE + "/DatePrinted", sysDate);
		Services.setValue(XPathConstants.WARRANT_BASE + "/DateReprinted", sysDate);
		
		// CaseMan Defect 6170, set the CCBCWarrant flag for warrants issued by CCBC
		var issCourt = Services.getValue(Header_IssuedByCourtCode.dataBinding);
		if ( issCourt == CaseManUtils.CCBC_COURT_CODE )
		{
			Services.setValue(XPathConstants.WARRANT_BASE + "/CCBCWarrant", "Y");
		}
		
		// Save the details
		var newDOM = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.WARRANT_BASE).cloneNode(true);
		var dsNode = XML.createElement(newDOM, "ds");
		dsNode.appendChild(node);
		newDOM.appendChild(dsNode);
		Logging.error("<pre>" + encodeXML(newDOM.xml) + "</pre>");
		var params = new ServiceParams();
		params.addDOMParameter("warrantDetails", newDOM);
		Services.callService("addWarrant", params, Status_SaveButton, true);
		
	}
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName) {
	if (dom != null) {
		var warrantNumber = XML.getNodeTextContent(dom.selectSingleNode("/ds/Warrant/LocalNumber"));
		alert(Messages.FOREIGN_WARRANT_CREATED_SUCCESSFULLY.replace(/XXX/, warrantNumber));

		var action = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		switch (action)
		{
			case ActionAfterSave.ACTION_EXIT:
				exitScreen();
				break;
			case ActionAfterSave.ACTION_CLEARFORM:
			default:
				// Clear form by default
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
		// Reload the court code field so that all data gets reloaded
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		Services.setValue(Header_CaseNumber.dataBinding, "");
		Services.setValue(Header_CaseNumber.dataBinding, caseNumber);
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
    if(exception.message.indexOf("ORA-00001") != -1) {
        var warrantNumber = Services.getValue(Header_WarrantNumber.dataBinding);
        var ec = ErrorCode.getErrorCode("CaseMan_warrantAlreadyExists_Msg");
        alert(ec.getMessage().replace(/XXX/, warrantNumber));
    } else {
    	alert(Messages.FAILEDSAVE_MESSAGE);
    	exitScreen();        
    }
}

/*********************************** LOV GRIDS *********************************************/

function WarrantTypeLOVGrid() {};
WarrantTypeLOVGrid.dataBinding = Header_WarrantType.dataBinding;
WarrantTypeLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/WarrantTypes";
WarrantTypeLOVGrid.rowXPath = "WarrantType";
WarrantTypeLOVGrid.keyXPath = "Type";
WarrantTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];
WarrantTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_WarrantTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "Header_WarrantType" } ]
	}
};
/**
 * @author fzj0yl
 * @return "Header_WarrantType"  
 */
WarrantTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "Header_WarrantType";
}

/***********************************************************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubFormGrids/SelectedIssuingCourt";
CourtsLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtsLOVGrid.raise = {
    eventBinding: {
        singleClicks: [ { element: "Header_IssuedByCourtLOVButton" } ],
		keys: [ { key: Key.F6, element: "Header_IssuedByCourtCode" },
				{ key: Key.F6, element: "Header_IssuedByCourtName" } ]
    }
};

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
		Services.startTransaction();
		Services.setValue(Header_IssuedByCourtCode.dataBinding, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/**
 * @author fzj0yl
 * @return "Header_IssuedByCourtCode"  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() 
{
    return "Header_IssuedByCourtCode";
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
updateDetailsLogic.logicOn = [Header_WarrantType.dataBinding, Header_IssuedByCourtCode.dataBinding, Header_CaseNumber.dataBinding, Header_WarrantNumber.dataBinding, Header_IssueDate.dataBinding];
updateDetailsLogic.logic = function(event)
{
	if ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" || 
		 event.getXPath() == "/" || event.getType() != DataModelEvent.UPDATE)
	{
		return;
	}

	// Check the correct input has called this function
	var validInput = false;
	for (var i=0; i<updateDetailsLogic.logicOn.length; i++)
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
