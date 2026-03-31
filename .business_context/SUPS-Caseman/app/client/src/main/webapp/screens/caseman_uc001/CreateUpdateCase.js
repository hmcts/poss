/** 
 * @fileoverview CreateUpdateCase.js:
 * This file contains the configurations for the Create Update Case Details form
 *
 * @author Chris Vincent, Ian Stainer, Tim Connor
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, mandatory party name and first two address lines altered
 *				so transform to model strips leading and trailing space to prevent a blank
 *				value to be entered which could break the application.
 * 11/07/2006 - Chris Vincent, removed the Coded Party LOV popup and replaced it with the new
 * 				Coded Party Search Subform.  The mechanism in which the Two Code field logics
 * 				works has also changed as it must perform an existance check because the reference
 * 				data is no longer loaded into the screen.
 * 02/08/2006 - Chris Vincent, updated Details of Claim popup preprepare function to set the currency
 * 				field to the default currency as previously was setting to blank.  The Details of
 * 				Claim currency fields also were updated to increase the max length to 3 characters as
 * 				migrated data with GBP in these fields were flagging as incorrect.  Problem discovered
 * 				in DMST, awaiting defect number.
 * 03/08/2006 - Chris Vincent, updated the read only rule of the DetailsOfClaim_DateRequestReceived field
 * 				to allow the user to edit the field is blank on existing cases.  Migrated CCBC cases
 * 				come accross to CaseMan without it (Defect 4139).
 * 14/08/2006 - Chris Vincent, undid the change for defect 4139 following advice from DCA.  Date Request
 * 				Received is always read only for existing cases.  Polar Lake to populate the field if
 * 				blank.
 * 15/08/2006 - Chris Vincent, fixed defect 4262 by changing some coded party xpaths on the LitigiousParty_Code.logic
 * 				and SolicitorParty_Code.logic.  The Code node required ' characters to accept non numeric
 * 				characters.
 * 17/08/2006 - Chris Vincent, fixed defect 4422 so that the Last Date for Service defaults to the Date of
 * 				Issue + 4 months on existing cases when a new defendant is added.
 * 21/08/2006 - Chris Vincent, fixed defect 4415 so the LitigiousParty_DateOfService.validate() references
 * 				the actual Date of Issue value in the DOM instead of the temporary Details of Claim popup
 * 				field.
 * 31/08/2006 - Chris Vincent, small change to LitigiousParty_Code.onSuccess when determining if changing from
 * 				a coded party to another coded party due to a change in requirement.  Server side changes
 * 				handled by Phil Haferer.
 * 01/09/2006 - Chris Vincent, refixed defect 4262 on the party code logic fields as there were other scenarios
 * 				where certain characters could cause a crash.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 20/11/2006 - Chris Vincent, fixed UCT Defect 701 by adding a filter to SolicitorParty_ContactDetails_Address_Line1.logic
 * 				preventing action if the selected solicitor xpath is null.
 * 22/11/2006 - Chris Vincent, fixed UCT Defect 709 by adding validateOn = [XPathConstants.MASTERGRID_CHANGED] to
 * 				the Litigious Party Code, Postcode & Email fields and the Solicitor Postcode & Email fields to
 * 				enable correct validation when switching between party records in the grid.
 * 23/11/2006 - Chris Vincent, fixed UCT Defect 733 by adding code in addNewSolicitor_subform.processReturnedData
 * 				to correctly set the isCodedParty flag for the new solicitor.
 * 23/11/2006 - Chris Vincent, fixed defect 5832 by adding a dataDependancyOn configuration for all the Solicitor
 * 				fields to register them as children of the grid so the grid knows one of its children is invalid.
 * 24/11/2006 - Chris Vincent, removed LitigiousParty_Name.moveFocus() as was no longer required.  UCT Defect 716.
 * 16/01/2007 - Chris Vincent, added read only Header_MCOLCaseFlag field to indicate that a case is MCOL.
 * 				UCT_Group2 defect 1125.
 * 23/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 22/03/2007 - Chris Vincent, changes made to Master_AddPartyButton.actionBinding() and LitigiousParty_DateOfService.logic()
 * 				for Temp_CaseMan defect 292.  For a new party (Defendants and Part 20 Defendants only), if the
 * 				Date of Service is less than 2 days after the Date of Issue, a warning message informs the user and
 * 				offers the user the chance to revert to the previous value.  Now CaseMan Defect 6012.
 * 03/04/2007 - Chris Vincent, change to Details_Of_Claim_Popup.prePopupPrepare() to set the Total field to 0.00 instead
 * 				of "" which with Framework 9.0.33 causes the field to be rendered invalid.
 * 17/04/2007 - Chris Vincent, for CCBC cases, set the Creditor Code node to whatever the Code for the Solicitor of
 * 				Claimant 1 is.  UCT_Group2 Defect 1365
 * 20/06/2007 - Chris Vincent, updated mandatory rules for claimant solicitor on CCBC cases so if updating an existing MCOL
 * 				case, is not mandatory.  Solicitor coded party validation and mandatory rules also updated so sol on MCOL case 
 * 				cannot be nat coded party.  Had to tinker with save actionbinding as well to ensure that if no solicitor, will
 * 				retain the creditor code of 1999.  Finally, updated SolicitorParty_ContactDetails_Address_Line1.logic() so that
 * 				the AddressUpdated node is only set if the soliictor represents a Claimant.  UCT Group2 Defect 1371.
 * 20/06/2007 - Chris Vincent, changes to LitigiousParty_DateOfService.logic() to set an invisible CCBC column in the database
 * 				(CASE_PARTY_ROLES.DEFT_LAST_DATE_FOR_REPLY) to Date of Service + 14 days.  UCT Group2 Defect 1385.
 * 28/06/2007 - Chris Vincent, added an AddressUpdated node when add a new litigious party address so will write MCOL_DATA.
 * 				Group2 Defect 5129.
 * 10/07/2007 - Chris Vincent, changes to how isNationalCodedParty() is called (new parameter) for UCT_Group2 Defect 1478.
 * 16-07-1008 - Struan Keer-Liddell - Changes to add insolvency number & year
 * 11-08-2008 - Sandeep Mullangi - Changes to remove autotabbing for insolvency number & year
 * 11-11-2008 - Sandeep Mullangi - insolvency Number search - removing autotabbing of owning court field
 * 13-11-2008 - Sandeep Mullangi - Insolvency Number Changing the tabbing order and pre-populating owning court
 * 20-04-2009 - Chris Vincent - Changed Insolvency Number field validation to cope with alphanumeric values and numeric values
 * 				less than 4 digits long.  TRAC Ticket 334.
 * 13/12/2010 - Chris Vincent, TRAC 4104.  Moved getCourtFeeDataLists ref data call to the screen's refDataServices configuration as
 * 				opposed to previously being called when the Owning Court of the Case is set.  References to the function waitForReferenceData
 *				and the constant REF_DATA_LOADING_FLAG_XPATH also removed as no longer required.
 * 19/09/2011 - Chris Vincent, changes to SolicitorParty_Code.isReadOnly and SolicitorParty_CodeLOVButton.isEnabled functions to use
 *				a new generic CaseManUtils function for determining if coded party code is a CCBC National Coded Party code or not.
 *				Trac 4553.
 * 08/12/2011 - Nilesh Mistry, amended Status_SaveButton.actionBinding so that it prompts user to enter the mandatory Company party for the new case type
 *                             Company Administration Order. TRAC #4594
 * 29/01/2013 - Chris Vincent, added Preferred Court Code (Trac 4764) and Track (Trac 4763) fields as part of RFS 3719.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering changes including adding new refdata service isNewNumberingActive and changes to
 *				Header_CaseNumber.validate() to use different validation based upon whether new number system is active or not.
 * 14/10/2016 - Chris Vincent (Trac 5880). Added LitigiousParty_Confidential field.
 */

/**
 * Form constants
 * @author rzxd7g
 * 
 */
function FormConstants() {};
FormConstants.SOLICITOR_PAGE = "secondPage";
FormConstants.LITIGIOUS_PARTY_PAGE = "firstPage";
FormConstants.MEDIATION_PAGE = "thirdPage";
FormConstants.LITIGIOUS_PARTY_LABEL = "Party";
FormConstants.ENABLED = "on";
FormConstants.DISABLED = "off";
FormConstants.STATUS_EXISTING = "EXISTING";
FormConstants.STATUS_NEW = "NEW";
FormConstants.STATUS_REMOVED = "REMOVED";
FormConstants.MAGS_ORDER = "MAGS ORDER";
FormConstants.CCBC_CASE_TYPE = "CLAIM - SPEC ONLY";
FormConstants.DEFAULT_COMM_METHOD = "LE";

/**
 * Form variables (are updated by methods in the form)
 * @author rzxd7g
 * 
 */
function FormVariables() {};
FormVariables.SOLICITOR_FIELDS_TEMPORARY = true;
FormVariables.LITPARTY_FIELDS_TEMPORARY = true;
FormVariables.DETAILSOFCLAIM_FIELDS_TEMPORARY = false;

/**
 * Event constants for automatic events created on screen
 * @author rzxd7g
 * 
 */
function EventConstants() {};
EventConstants.NOTIFDATE_CLAIMANT_EVENT = 65;
EventConstants.NOTIFDATE_DEF_ADDSOL_EVENT = 34;
EventConstants.NOTIFDATE_DEF_REMSOL_EVENT = 35;
EventConstants.DEF_ADDRESS_CHANGE_EVENT = 132;
EventConstants.CREATE_HEARING_EVENT = 200;

/**
 * Constants used to indicate the action to perform following a save
 * @author rzxd7g
 * 
 */
function PostSaveActions() {};
PostSaveActions.ACTION_AFTER_SAVE = "";
PostSaveActions.ACTION_NAVIGATE = "NAVIGATE";
PostSaveActions.ACTION_CLEARFORM = "CLEAR_FORM";
PostSaveActions.ACTION_EXIT = "EXIT_SCREEN";
PostSaveActions.ACTION_DUPNOTICE = "DUPLICATE_NOTICE";

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.ROOT_XPATH = "/ds";
XPathConstants.DATA_XPATH = XPathConstants.ROOT_XPATH + "/ManageCase";
XPathConstants.VAR_APP_XPATH = XPathConstants.ROOT_XPATH + "/var/app";
XPathConstants.VAR_FORM_XPATH = XPathConstants.ROOT_XPATH + "/var/form";
XPathConstants.VAR_PAGE_XPATH = XPathConstants.ROOT_XPATH + "/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.CONSTANTS_XPATH = XPathConstants.VAR_FORM_XPATH + "/Constants";
XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./SurrogateId = ";
XPathConstants.SOLICITOR_DATA_BINDING_ROOT = XPathConstants.DATA_XPATH + "/Parties/Solicitor[./SurrogateId = ";
XPathConstants.SELECTED_SOLICITOR_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedSolicitor";
XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tab/EnablePageOne";
XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tab/EnablePageTwo";
XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL = XPathConstants.VAR_PAGE_XPATH + "/Tab/LitigiousPartyPageLabel";
XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/RemovePartyButton";
XPathConstants.CASE_STATUS = XPathConstants.DATA_XPATH + "/Status";
XPathConstants.OTHER_POSSESSION_ADDRESS_XPATH = XPathConstants.DATA_XPATH + "/OtherPossessionAddress/Address";
XPathConstants.DETAILS_OF_CLAIM_XPATH = XPathConstants.DATA_XPATH + "/DetailsOfClaim";
XPathConstants.HEARING_DETAILS_XPATH = XPathConstants.DATA_XPATH + "/HearingDetails";
XPathConstants.MASTERGRID_CHANGED = XPathConstants.VAR_PAGE_XPATH + "/MasterGridChanged"
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.CLAIMANT_CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ClaimantChangesMade";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.NAVIGATIONLIST_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NavigationList";
XPathConstants.TMP_AUDIT_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/AuditData";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.LP_CODE_VALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/LitigiousPartyCodeValid";
XPathConstants.SOL_CODE_VALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/SolicitorPartyCodeValid";
XPathConstants.INSOLVENCY_NO_LOADED = XPathConstants.VAR_PAGE_XPATH + "/Temp/InsolvencyNoSetWhenLoaded";
XPathConstants.INSOLVENCY_NO_AND_YEAR = XPathConstants.DATA_XPATH + "/InsolvencyNumber";
XPathConstants.CHECK_INSOLVENCY_CASE_FLAG = XPathConstants.VAR_PAGE_XPATH + "/Temp/CheckInsolvencyFlag";
XPathConstants.LOVCOURT_DESTINATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/LOVCourtDestinationXPath";

/************************** FORM CONFIGURATIONS *************************************/

function createUpdateCase() {}

/**
 * @author rzxd7g
 * 
 */
createUpdateCase.initialise = function()
{
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts") )
	{
		var params = new ServiceParams();
		Services.callService("getCourtsShort", params, createUpdateCase, true);
	}
    
    var extCaseNumber = Services.getValue(CreateCaseParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank(extCaseNumber) )
	{
		loadCaseData(extCaseNumber);
	}
}

/**
 * Load the reference data from the xml into the model but only when needed
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
createUpdateCase.onSuccess = function(dom, serviceName)
{
	switch (serviceName)
	{
		case "getCourtsShort":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Courts", dom);
		    // Set the owning court defaulted to be the users home court, 
			// which will be required while searching for insolvency cases.
			// This is not used while searching for case using casenumber  
			var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			Services.setValue(Header_OwningCourtCode.dataBinding, userOwningCourt);
//			var extCaseNumber = Services.getValue(CreateCaseParams.CASE_NUMBER);
//			if ( CaseManUtils.isBlank(extCaseNumber) )
//			{
//				var courtId = Services.getValue('/ds/var/app/currentCourt');
//				Services.setValue(Header_OwningCourtCode.dataBinding,courtId);
//			}
			break;
		case "getCaseTypes":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CaseTypes", dom);
			break;
		case "getPartyRoles":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/PartyRoles", dom);
			break;
		case "getNonWorkingDays":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays", dom);
			break;
		case "getSystemDate":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/SystemDate", dom);
			break;
		case "getPrefCommMethodList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods", dom);
			break;
		case "getTrackList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/TrackList", dom);
			break;
	}
}

createUpdateCase.refDataServices = [
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{name:"CaseNumbering", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"isNewNumberingActive", serviceParams:[] },
	{name:"CourtFeeData", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtFeeDataLists", serviceParams:[] }
	
];

/*********************************** TABS ******************************************/

function myTabSelector() {}; // Instantiate the tabbed area
myTabSelector.tabIndex = 200;
myTabSelector.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

/******************************* SUB-FORMS *****************************************/

function hearingDetails_subform() {}
hearingDetails_subform.subformName = "hearingDetailsSubform";
hearingDetails_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Footer_HearingDetailsButton"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
hearingDetails_subform.prePopupPrepare = function()
{
	Services.startTransaction();
	if (Services.getValue(XPathConstants.DATA_XPATH + "/HearingDetailsPresent") == "false")
	{
		var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
		Services.setValue(XPathConstants.VAR_FORM_XPATH + "/Subforms/HearingDetailsSubform/OwningCourt", owningCourt);
	} 
	else 
	{
		// Move the data from the DOM to the popup's temporary area
		var hearingNode = Services.getNode(XPathConstants.HEARING_DETAILS_XPATH);
		Services.replaceNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/HearingDetailsSubform/HearingDetails", hearingNode);
		Services.setValue(XPathConstants.VAR_FORM_XPATH + "/Subforms/HearingDetailsSubform/OwningCourt", "");
	}
	Services.endTransaction();
}

hearingDetails_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.HEARING_DETAILS_XPATH } ];
/**
 * @author rzxd7g
 * 
 */
hearingDetails_subform.processReturnedData = function() 
{
	if (Services.getValue(XPathConstants.DATA_XPATH + "/HearingDetailsPresent") == "false")
	{
		// Create New Hearing Record
		addNewCaseEvent(EventConstants.CREATE_HEARING_EVENT);
		Services.setValue(XPathConstants.DATA_XPATH + "/HearingDetailsPresent", "true");
	}
}

/**
 * @author rzxd7g
 * @return "Footer_HearingDetailsButton"  
 */
hearingDetails_subform.nextFocusedAdaptorId = function() 
{
	return "Footer_HearingDetailsButton";
}

/*********************************************************************************/

function otherPossnAddress_subform() {}
otherPossnAddress_subform.subformName = "otherPossnAddressSubform";
otherPossnAddress_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Footer_OtherPossessionAddressButton"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
otherPossnAddress_subform.prePopupPrepare = function()
{
	if ( Services.getValue(XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent") == "true" )
	{
		// Move the data from the DOM to the popup's temporary area
		var addressNode = Services.getNode(XPathConstants.OTHER_POSSESSION_ADDRESS_XPATH);
		Services.replaceNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/OtherPossnAddressSubform/Address", addressNode);
	}
}

otherPossnAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.OTHER_POSSESSION_ADDRESS_XPATH } ];
/**
 * @author rzxd7g
 * 
 */
otherPossnAddress_subform.processReturnedData = function() 
{
	if ( Services.getValue(XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent") == "false" )
	{
		Services.setValue(XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent", "true");
	}
	Services.setValue(XPathConstants.OTHER_POSSESSION_ADDRESS_XPATH + "/CreatedBy", Services.getCurrentUser());
	setChangesMade();
}

/**
 * @author rzxd7g
 * @return "Footer_OtherPossessionAddressButton"  
 */
otherPossnAddress_subform.nextFocusedAdaptorId = function() {
	return "Footer_OtherPossessionAddressButton";
}

/*********************************************************************************/

function viewHistAddresses_subform() {};
viewHistAddresses_subform.subformName = "viewHistAddressesSubform";
viewHistAddresses_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "LitigiousParty_ViewHistoricalAddressesButton"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
viewHistAddresses_subform.prePopupPrepare = function()
{
	// Pass the currently selected party's historical addresses to the subform
	var histAddressesNode = Services.getNode(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./SurrogateId = " + masterGrid.dataBinding + "]/HistoricalAddresses");
	Services.replaceNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/ViewHistAddressesSubform/HistoricalAddresses", histAddressesNode);
}

/**
 * @author rzxd7g
 * @return "LitigiousParty_ViewHistoricalAddressesButton"  
 */
viewHistAddresses_subform.nextFocusedAdaptorId = function() {
	return "LitigiousParty_ViewHistoricalAddressesButton";
}

/*********************************************************************************/

function addNewAddress_subform() {};
addNewAddress_subform.subformName = "addNewAddressSubform";
addNewAddress_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "LitigiousParty_AddAddressButton"} ]
	}
};

addNewAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewAddress/Address" } ];
/**
 * @author rzxd7g
 * 
 */
addNewAddress_subform.processReturnedData = function() 
{
	Services.startTransaction();
	var hasAddress = Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[1]");
	var existingAddressRoot = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address";

	if ( !CaseManUtils.isBlank(hasAddress) )
	{
		// Update the existing address details with an end date and copy it to the historical addresses section
		Services.setValue(existingAddressRoot + "/DateTo", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.setValue(existingAddressRoot + "/Status", FormConstants.STATUS_NEW);
		Services.setValue(existingAddressRoot + "/SurrogateId", getNextSurrogateKey() );
		var currentAddress = Services.getNode(existingAddressRoot);
		Services.addNode(currentAddress, XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/HistoricalAddresses");
	}
	
	// Replace the old address with the new address
	var newAddressRoot = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewAddress/Address";
	Services.setValue(newAddressRoot + "/AddressId", "");
	Services.setValue(newAddressRoot + "/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));
	Services.setValue(newAddressRoot + "/CreatedBy", Services.getCurrentUser());
	Services.setValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/AddressUpdated", "Y");
	var newAddress = Services.getNode(newAddressRoot);
	Services.replaceNode(existingAddressRoot, newAddress);

	// Mark dirty flag to indicate a change has been made
	setChangesMade();
	setClaimantChangesMade();

	// If Defendant, create Event 132 via notification date popup
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.DEFENDANT )
	{
		Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode", EventConstants.DEF_ADDRESS_CHANGE_EVENT);
		Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationPartyId", Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/PartyId") );
		Services.setValue( Notification_Date.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.dispatchEvent("Notification_Date_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	Services.endTransaction();
}

/**
 * @author rzxd7g
 * @return "LitigiousParty_AddAddressButton"  
 */
addNewAddress_subform.nextFocusedAdaptorId = function() {
	return "LitigiousParty_AddAddressButton";
}

/*********************************************************************************/

function addNewSolicitor_subform() {};
addNewSolicitor_subform.subformName = "addNewSolicitorSubform";
addNewSolicitor_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "LitigiousParty_AddSolicitorButton"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
addNewSolicitor_subform.prePopupPrepare = function()
{
	Services.startTransaction();
	
	var rootXPath = XPathConstants.VAR_FORM_XPATH + "/Subforms/newSolicitorSubform";
	Services.removeNode(rootXPath + "/PartyCodes");
	var codedPartyList = Services.getNodes(XPathConstants.DATA_XPATH + "/Parties/*[Status != '" + FormConstants.STATUS_REMOVED + "']/Code");
	/* Send the codes accross so can be tested if try to use a coded party for new solicitor */
	for ( var i=0, l=codedPartyList.length; i < l; i++ )
	{
		Services.addNode( codedPartyList[i], rootXPath + "/PartyCodes");
	}
	
	// Get the currently selected party's type code
	Services.setValue(rootXPath + "/PartyTypeCode", getCurrentlySelectedPartyTypeCode() );
	
	// Get the case's owning court code
	var owningCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	Services.setValue(rootXPath + "/OwningCourtCode", owningCourtCode );
	
	// Set the Creditor Code
	var currentCreditorCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
	Services.setValue(rootXPath + "/CreditorCode", currentCreditorCode );
	
	Services.endTransaction();
}

addNewSolicitor_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewSolicitor/Solicitor" }, 
	{ sourceNodeIndex: "1", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewSolicitor/Party" }
];

/**
 * @author rzxd7g
 * 
 */
addNewSolicitor_subform.processReturnedData = function() 
{
	// XPath roots
	var solRootXPath = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewSolicitor/Solicitor";
	var partyRootXPath = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewSolicitor/Party";

	// Set the hidden Solicitor fields and add the solicitor to the DOM
	var surrogateId = getNextSurrogateKey();
	Services.startTransaction();
	Services.setValue( solRootXPath + "/SurrogateId", surrogateId );
	Services.setValue( solRootXPath + "/Type", getPartyTypeDescription(PartyTypeCodesEnum.SOLICITOR) );
	Services.setValue( solRootXPath + "/TypeCode", PartyTypeCodesEnum.SOLICITOR );
	Services.setValue( solRootXPath + "/Number", getNextPartyNumber(PartyTypeCodesEnum.SOLICITOR) );
	Services.setValue( solRootXPath + "/Status", FormConstants.STATUS_NEW );
	Services.setValue( solRootXPath + "/ContactDetails/Address/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.setValue( solRootXPath + "/ContactDetails/Address/CreatedBy", Services.getCurrentUser() );
	Services.setValue( solRootXPath + "/AddressUpdated", "N" );
	
	// UCT Defect 733 - When add new Solicitor need to set IsCodedParty flag
	var codedPartyCode = Services.getValue(solRootXPath + "/Code");
	var isCodedParty = CaseManUtils.isBlank(codedPartyCode) ? "false" : "true";
	Services.setValue( solRootXPath + "/IsCodedParty", isCodedParty );
	
	var newSolicitor = Services.getNode(solRootXPath);
	Services.addNode(newSolicitor, XPathConstants.DATA_XPATH + "/Parties");

	// Set the solicitor related fields on the currently selected litigious party
	var litigiousPartyRoot = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding;
	Services.setValue(litigiousPartyRoot + "]/SolicitorSurrogateId", surrogateId);
	Services.setValue(litigiousPartyRoot + "]/SolicitorReference", Services.getValue(partyRootXPath + "/SolicitorReference") );
	Services.setValue(litigiousPartyRoot + "]/SolicitorPayee", Services.getValue(partyRootXPath + "/SolicitorPayee") );
	
	// Update the selected solicitor variable in the model so that the new solicitor will be shown
	Services.setValue(XPathConstants.SELECTED_SOLICITOR_XPATH, surrogateId);

	// Force the tab selector to display the solicitor page
	Services.setValue(myTabSelector.dataBinding, FormConstants.SOLICITOR_PAGE);
	
	// Set the dirty flag
	setChangesMade();
	setClaimantChangesMade();
	Services.endTransaction();
}

/**
 * @author rzxd7g
 * @return "LitigiousParty_AddSolicitorButton"  
 */
addNewSolicitor_subform.nextFocusedAdaptorId = function() {
	return "LitigiousParty_AddSolicitorButton";
}

/*********************************************************************************/

function codedPartySearch_subform() {};
codedPartySearch_subform.subformName = "codedPartySearchSubform";
codedPartySearch_subform.raise = {
	eventBinding: {
		singleClicks: [ { element: "LitigiousParty_CodeLOVButton" }, 
						{ element: "SolicitorParty_CodeLOVButton" } ],
		keys: [ { key: Key.F6, element: "LitigiousParty_Code" }, 
				{ key: Key.F6, element: "SolicitorParty_Code" } ],
        enableOn: [myTabSelector.dataBinding, XPathConstants.MASTERGRID_CHANGED],
        isEnabled: function()
        {
        	var currentPartyType = getCurrentlySelectedPartyTypeCode() 
        	var currentPage = Services.getValue(myTabSelector.dataBinding);
        	if ( currentPartyType != PartyTypeCodesEnum.SOLICITOR && currentPage == FormConstants.SOLICITOR_PAGE )
        	{
        		// Disabled if on the Solicitor page of a non solicitor party
        		return false;
        	}
        	return true;
        }
	}
};

/**
 * @author rzxd7g
 * 
 */
codedPartySearch_subform.prePopupPrepare = function()
{
	var adminCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	Services.setValue(CodedPartySearchParams.ADMIN_COURT_CODE, adminCourtCode);
}

codedPartySearch_subform.replaceTargetNode = [ 
	{ sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/CodedPartySearch/SelectedCodedPartyCode" }
];

/**
 * @author rzxd7g
 * 
 */
codedPartySearch_subform.processReturnedData = function() 
{
	var partyCode = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/Tmp/CodedPartySearch/SelectedCodedPartyCode");
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		Services.setValue(SolicitorParty_Code.dataBinding, partyCode);
	}
	else
	{
		Services.setValue(LitigiousParty_Code.dataBinding, partyCode);
	}
}

/**
 * @author rzxd7g
 * @return "SolicitorParty_Code" , "LitigiousParty_Code"  
 */
codedPartySearch_subform.nextFocusedAdaptorId = function() 
{
	if(getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR)
	{
		return "SolicitorParty_Code";
	}
	return "LitigiousParty_Code";
}

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";
/**
 * @author rzxd7g
 * @return "Header_CaseNumber"  
 */
ProgressBar_SubForm.nextFocusedAdaptorId = function() 
{
	return "Header_CaseNumber";
}

/******************************** LOV POPUPS ***************************************/

function Header_CaseTypeLOVGrid() {};
Header_CaseTypeLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/CaseType";
Header_CaseTypeLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/CaseTypes";
Header_CaseTypeLOVGrid.rowXPath = "CaseType";
Header_CaseTypeLOVGrid.keyXPath = "Type";
Header_CaseTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];

Header_CaseTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_CaseTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "Header_CaseType" } ]
	}
};
Header_CaseTypeLOVGrid.styleURL = "../common_lov_subforms/CaseTypeLOVGrid.css";
Header_CaseTypeLOVGrid.destroyOnClose = false;
/**
 * @author rzxd7g
 * @return "Header_CaseType"  
 */
Header_CaseTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "Header_CaseType";
}
Header_CaseTypeLOVGrid.logicOn = [Header_CaseTypeLOVGrid.dataBinding];
Header_CaseTypeLOVGrid.logic = function(event)
{
	var value = Services.getValue(Header_CaseTypeLOVGrid.dataBinding);
	if (!CaseManUtils.isBlank(value))
	{
		// Check that the value has not changed
		var oldValue = Services.getValue(Header_CaseType.dataBinding);
		if( oldValue == value )
		{
			return;
		}
	
		Services.startTransaction();
		// Set the code field.  This will result in the code logic being called, just
		// as if the user had keyed in the code manually.
		Services.setValue(Header_CaseType.dataBinding, value);
		
		// Now reset the value in the LOV
		Services.setValue(Header_CaseTypeLOVGrid.dataBinding, null);
		
		Services.endTransaction();
	}
}

/**********************************************************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Court";
CourtsLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court[./SUPSCourt = 'Y']";
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
		Services.setValue(xpath, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, "");
	}
}

CourtsLOVGrid.nextFocusedAdaptorId = function() 
{
	// Return focus to the correct field
    var xpath = Services.getValue(XPathConstants.LOVCOURT_DESTINATION_XPATH);
    var adaptor = null;
    switch (xpath)
    {
    	case Header_PreferredCourtCode.dataBinding:
    		adaptor = "Header_PreferredCourtCode";
    		break;
    	case Header_OwningCourtCode.dataBinding:
    		adaptor = "Header_OwningCourtCode";
    		break;
    }
    return adaptor;
}

/********************************** GRIDS *****************************************/

function masterGrid() {};
masterGrid.retrieveOn = [XPathConstants.DATA_XPATH + "/CaseNumber"];
masterGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
/**
 * @param id
 * @author rzxd7g
 * @return ( !CaseManUtils.isBlank(id) ) ? "Y", "N"  
 */
masterGrid.transformSolicitorColumn = function(id)
{
	return ( !CaseManUtils.isBlank(id) ) ? "Y" : "N";
}

masterGrid.tabIndex = 100;
masterGrid.srcData = XPathConstants.DATA_XPATH + "/Parties";
masterGrid.rowXPath = "*[./Status != '" + FormConstants.STATUS_REMOVED + "']";
masterGrid.keyXPath = "SurrogateId";
masterGrid.columns = [
	{xpath: "Type"},
	{xpath: "Number", sort: "numerical", additionalSortColumns: [ { columnNumber: 0, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"},
	{xpath: "SolicitorSurrogateId", transformToDisplay: masterGrid.transformSolicitorColumn	}	
];

masterGrid.enableOn = [XPathConstants.DATA_XPATH + "/CaseNumber", XPathConstants.DATA_XPATH + "/CaseType", XPathConstants.DATA_XPATH + "/OwningCourtCode", XPathConstants.DATA_XPATH + "/Parties"];
masterGrid.isEnabled = isPartyFieldEnabled;

masterGrid.logicOn = [masterGrid.dataBinding];
masterGrid.logic = function(event) 
{
	Services.startTransaction();
	
	var pageId = null;
  
	var value = Services.getValue(masterGrid.dataBinding);
	if (getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR)
	{
		pageId = FormConstants.SOLICITOR_PAGE; 		
		// Store the solicitor id in the appropriate place in the model
		Services.setValue(XPathConstants.SELECTED_SOLICITOR_XPATH, value);

		// Enable the solicitor tab
		Services.setValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH, FormConstants.ENABLED);
		// Disable the litigious party tab
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH, FormConstants.DISABLED);		
		// Set the label to display on the litigious tab page
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL, FormConstants.LITIGIOUS_PARTY_LABEL);
		
		// Only parties with a status of NEW can be removed
		var status = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
		if (status == FormConstants.STATUS_NEW)
		{
			Services.setValue(XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH, FormConstants.ENABLED);
		}
		else
		{
			// There is a primary key for the selected solicitor so disable the remove button
			Services.setValue(XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH, FormConstants.DISABLED);		
		}		
  	}
  	else
  	{	
		// Only parties with a status of NEW can be removed
		var status = Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
		if (status == FormConstants.STATUS_NEW)
		{
			Services.setValue(XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH, FormConstants.ENABLED);
		}
		else
		{
			// There is a primary key for the selected litigious party so disable the remove button
			Services.setValue(XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH, FormConstants.DISABLED);		
		}			  		

		// It's a litigious party so get the solicitor reference
		var xpath = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId";		
		// Read the id of the solicitor
		var solicitorSurrogateId = Services.getValue(xpath);	

		// Store the selected solicitor in the appropriate place in the model
		Services.setValue(XPathConstants.SELECTED_SOLICITOR_XPATH, solicitorSurrogateId);		

		// Enable the litigious party tab
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH, FormConstants.ENABLED);		
		// If the litigious party does not have a solicitor representing
		// them then disable the solicitor page
		var solicitorSurrogateId = Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId");
		if (CaseManUtils.isBlank(solicitorSurrogateId))
		{
			// Disable the solicitor tab
			Services.setValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH, FormConstants.DISABLED);  				
	  		pageId = FormConstants.LITIGIOUS_PARTY_PAGE;
		}
		else
		{
			// Enable the solicitor tab
			Services.setValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH, FormConstants.ENABLED);  		
			
			// As the selected litigious party has an associated solicitor, display
			// the solicitor tab instead of the party tab.  This is because the solicitor
			// is always the first point of contact.
	  		pageId = FormConstants.SOLICITOR_PAGE; 				
		}
		// Set the label to display on the litigious tab page
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL, getPartyTypeDescription(getCurrentlySelectedPartyTypeCode()));
	}
    
	Services.setValue(myTabSelector.dataBinding, pageId);
  
	// Set the mastergrid changed field so that all dependant enables/disables/logics/etc are fired
	Services.setValue(XPathConstants.MASTERGRID_CHANGED, value);
	Services.endTransaction();
};

/******************************** POPUPS ******************************************/

function Details_Of_Claim_Popup() {};

/**
 * @author rzxd7g
 * 
 */
Details_Of_Claim_Popup.prePopupPrepare = function()
{
	Services.startTransaction();
	if (Services.getValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent") == "false")
	{
		// Details of Claim do not yet exist, set default values
		var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
		if ( CaseManUtils.isBlank(defaultCurrency) )
		{
			defaultCurrency = "";
		}
		
		Services.setValue(DetailsOfClaim_DateRequestReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));
		Services.setValue(DetailsOfClaim_AmountClaimedCurrency.dataBinding, defaultCurrency);
		Services.setValue(DetailsOfClaim_AmountClaimed.dataBinding, "");
		Services.setValue(DetailsOfClaim_CourtFeeCurrency.dataBinding, defaultCurrency);
		Services.setValue(DetailsOfClaim_CourtFee.dataBinding, "");
		Services.setValue(DetailsOfClaim_SolicitorsCostsCurrency.dataBinding, defaultCurrency);
		Services.setValue(DetailsOfClaim_SolicitorsCosts.dataBinding, "");
		Services.setValue(DetailsOfClaim_TotalCurrency.dataBinding, defaultCurrency);
		Services.setValue(DetailsOfClaim_Total.dataBinding, "0.00");
		Services.setValue(DetailsOfClaim_DateOfIssue.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));
	} 
	else 
	{
		// Move the data from the DOM to the popup's temporary area
		Services.setValue(DetailsOfClaim_DateRequestReceived.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateRequestReceived"));
		Services.setValue(DetailsOfClaim_AmountClaimedCurrency.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimedCurrency"));
		Services.setValue(DetailsOfClaim_AmountClaimed.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimed"));
		Services.setValue(DetailsOfClaim_CourtFeeCurrency.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFeeCurrency"));
		Services.setValue(DetailsOfClaim_CourtFee.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFee"));
		Services.setValue(DetailsOfClaim_SolicitorsCostsCurrency.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCostsCurrency"));
		Services.setValue(DetailsOfClaim_SolicitorsCosts.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCosts"));
		Services.setValue(DetailsOfClaim_TotalCurrency.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/TotalCurrency"));
		Services.setValue(DetailsOfClaim_Total.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/Total"));
		Services.setValue(DetailsOfClaim_DateOfIssue.dataBinding, Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue"));
	}
	Services.endTransaction();
}

Details_Of_Claim_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "Footer_DetailsOfClaimButton"} ]
	}
};

/**
 * @author rzxd7g
 * @return "Footer_DetailsOfClaimButton"  
 */
Details_Of_Claim_Popup.nextFocusedAdaptorId = function() {
	return "Footer_DetailsOfClaimButton";
}

/**********************************************************************************/

function Particulars_Of_Claim_Popup() {};

Particulars_Of_Claim_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_ParticularsOfClaimButton"} ]
	}
};

Particulars_Of_Claim_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "ParticularsOfClaim_CloseButton"} ],
		keys: [ { key: Key.F4, element: "Particulars_Of_Claim_Popup" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Header_ParticularsOfClaimButton"  
 */
Particulars_Of_Claim_Popup.nextFocusedAdaptorId = function() {
	return "Header_ParticularsOfClaimButton";
}

/**********************************************************************************/

function Notification_Date_Popup() {};

/*****************************  DATA BINDINGS *************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_InsolvNo.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Temp/InsolvencyNumber";
Header_InsolvYear.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Temp/InsolvencyYear";
Header_CaseType.dataBinding = XPathConstants.DATA_XPATH + "/CaseType";
Header_CaseStatus.dataBinding = XPathConstants.DATA_XPATH + "/CaseStatus";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/OwningCourtNameAutocomplete";
Header_CaseDetails.dataBinding = XPathConstants.DATA_XPATH + "/CaseDetails";
Header_MCOLCaseFlag.dataBinding = XPathConstants.DATA_XPATH + "/MCOLCase";
Header_PreferredCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/PreferredCourtCode";
Header_PreferredCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/PreferredCourtNameAutocomplete";
Header_CaseAllocatedTo.dataBinding = XPathConstants.DATA_XPATH + "/Track";

Master_PartyType.dataBinding = XPathConstants.REF_DATA_XPATH + "/SelectedSelectListRow/SelectedParty";

LitigiousParty_Code.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Code";
LitigiousParty_Name.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Name";
LitigiousParty_ContactDetails_Address_Line1.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[1]";
LitigiousParty_ContactDetails_Address_Line2.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[2]";
LitigiousParty_ContactDetails_Address_Line3.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[3]";
LitigiousParty_ContactDetails_Address_Line4.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[4]";
LitigiousParty_ContactDetails_Address_Line5.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/Line[5]";
LitigiousParty_ContactDetails_Address_Postcode.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/PostCode";
LitigiousParty_ContactDetails_DX.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/DX";
LitigiousParty_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/TelephoneNumber";
LitigiousParty_ContactDetails_FaxNumber.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/FaxNumber";
LitigiousParty_ContactDetails_EmailAddress.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/EmailAddress";
LitigiousParty_ContactDetails_TranslationToWelsh.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/TranslationToWelsh";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/PreferredCommunicationMethod";
LitigiousParty_Reference.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Reference";
LitigiousParty_DateOfService.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/DateOfService";
LitigiousParty_LastDateForService.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/LastDateForService";
LitigiousParty_DateOfBirth.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/DateOfBirth";
LitigiousParty_SelectSolicitor.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId";
LitigiousParty_Confidential.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/RequestConfidentiality";

SolicitorParty_Code.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/Code";
SolicitorParty_Name.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/Name";
SolicitorParty_Reference.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorReference";
SolicitorParty_Payee.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorPayee";
SolicitorParty_ContactDetails_Address_Line1.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/Line[1]";
SolicitorParty_ContactDetails_Address_Line2.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/Line[2]";
SolicitorParty_ContactDetails_Address_Line3.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/Line[3]";
SolicitorParty_ContactDetails_Address_Line4.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/Line[4]";
SolicitorParty_ContactDetails_Address_Line5.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/Line[5]";
SolicitorParty_ContactDetails_Address_Postcode.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address/PostCode";
SolicitorParty_ContactDetails_DX.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/DX";
SolicitorParty_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/TelephoneNumber";
SolicitorParty_ContactDetails_FaxNumber.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/FaxNumber";
SolicitorParty_ContactDetails_EmailAddress.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/EmailAddress";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.dataBinding = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/PreferredCommunicationMethod";

Mediation_ContactName.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Mediation/ContactName";
Mediation_TelephoneNumber.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Mediation/TelephoneNumber";
Mediation_EmailAddress.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Mediation/EmailAddress";
Mediation_Availability.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Mediation/Availability";
Mediation_Notes.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Mediation/Notes";

ParticularsOfClaim_Details.dataBinding = XPathConstants.DATA_XPATH + "/ParticularsOfClaimDetails";

DetailsOfClaim_DateRequestReceived.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/DateRequestReceived";
DetailsOfClaim_AmountClaimedCurrency.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/AmountClaimedCurrency";
DetailsOfClaim_AmountClaimed.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/AmountClaimed";
DetailsOfClaim_CourtFeeCurrency.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/CourtFeeCurrency";
DetailsOfClaim_CourtFee.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/CourtFee";
DetailsOfClaim_SolicitorsCostsCurrency.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/SolicitorsCostsCurrency";
DetailsOfClaim_SolicitorsCosts.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/SolicitorsCosts";
DetailsOfClaim_TotalCurrency.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/TotalCurrency";
DetailsOfClaim_Total.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/Total";
DetailsOfClaim_DateOfIssue.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/DetailsOfClaim/DateOfIssue";

Notification_Date.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/NewNotificationDate";

Footer_DetailsOfClaimButton.labelXpath = XPathConstants.VAR_PAGE_XPATH + "/Labels/DetailsOfClaimButton";
Footer_OtherPossessionAddressButton.labelXpath = XPathConstants.VAR_PAGE_XPATH + "/Labels/OtherPossessionAddressButton";

/********************************  FIELDS ******************************************/

function Header_CaseNumber() {}

Header_CaseNumber.tabIndex = 10;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.readOnlyOn = [XPathConstants.CASE_STATUS];
Header_CaseNumber.isReadOnly = isExistingCase;

Header_CaseNumber.enableOn =[Header_CaseNumber.dataBinding, Header_InsolvNo.dataBinding, Header_InsolvYear.dataBinding];
Header_CaseNumber.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding))
		|| (CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding))
			&& CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)));
}

Header_CaseNumber.validateOn = [XPathConstants.CASE_STATUS];
Header_CaseNumber.validate = function()
{
	var ec = null;
	var value = Services.getValue(Header_CaseNumber.dataBinding);
	if ( null != value )
	{
		var caseStatus = Services.getValue(XPathConstants.CASE_STATUS);
		
		// Check the format of the Case Number is correct
		ec = CaseManValidationHelper.validateCaseNumber(value);
		
		// Check if MAGS ORDER Case, the first 2 characters are alphabetic
		if ( null == ec && value.charAt(2) == "/" )
		{
			ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.MAGSORDER_CASE_PATTERN, 'Caseman_invalidMAGSORDERCaseNumberFormat_Msg');
		}
		else if ( null == ec && FormConstants.STATUS_NEW == caseStatus )
		{
			// New Case Number entered, check the case number is in a valid new case pattern
			
			// Check to see if using the old or new numbering format of case number
			if ( isNewNumberingSystemActive() )
			{
				var errorCodeId = "Caseman_invalidNewCaseNumberFormat2_Msg"
				var patternMatchOne = value.search(CaseManValidationHelper.NEW_NONMAGSCREATE_CASE_PATTERN_ONE);
				var patternMatchTwo = value.search(CaseManValidationHelper.NEW_NONMAGSCREATE_CASE_PATTERN_TWO);
			}
			else
			{
				var errorCodeId = "Caseman_invalidNewCaseNumberFormat_Msg"
				var patternMatchOne = value.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_ONE);
				var patternMatchTwo = value.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_TWO);
			}

			if ( 0 != patternMatchOne && 0 != patternMatchTwo )
			{
				// New Case Number entered does not match any of the valid patterns
				ec = ErrorCode.getErrorCode(errorCodeId);
				Services.setFocus("Header_CaseNumber");
			}
		}
	}
	return ec;
}

Header_CaseNumber.transformToDisplay = convertToUpper;
Header_CaseNumber.transformToModel = convertToUpper;


Header_CaseNumber.logicOn = [Header_CaseNumber.dataBinding];
Header_CaseNumber.logic = function(event)
{
	if ( event.getXPath() != Header_CaseNumber.dataBinding )
	{
		return;
	}
	
	var value = Services.getValue(Header_CaseNumber.dataBinding);
	
	// If Case Number is cleared, wipe out all data
	if (CaseManUtils.isBlank(value))
	{
		resetForm();
	}
	else
	{
		// Perform validation as should ignore the new case format validation
		var patternMatchOne = value.search(CaseManValidationHelper.VALID_CASE_PATTERN);
		if ( 0 == patternMatchOne )
		{
			// Valid case format, check if a MAGS ORDER that is in correct format
			var patternMatchTwo = value.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN);
			if ( value.charAt(2) == "/" && patternMatchTwo != 0 )
			{
				return;
			}
		
			// Load the case data
			loadCaseData(value);
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onSuccess = function(dom)
{
	
	Services.startTransaction();
	
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	if ( CaseManUtils.isBlank(caseNumber) )
	{
		caseNumber = Services.getValue(CreateCaseParams.CASE_NUMBER);
	}

	// Select the ManageCase tag rather than the ds tag
	var data = dom.selectSingleNode(XPathConstants.DATA_XPATH);
	if( null != data )
	{
		Services.replaceNode(XPathConstants.DATA_XPATH, data);
		
		// Set some defaults
		Services.setValue(XPathConstants.CASE_STATUS, FormConstants.STATUS_EXISTING);
		
		// Add the Case Number to the app section to share with other screens
		Services.setValue( CreateCaseParams.CASE_NUMBER, caseNumber );
		
		
		//Set flag to say if insolvancy number is blank at load
		var insolvencyNumber = Services.getValue(XPathConstants.INSOLVENCY_NO_AND_YEAR);
		var insolvencyBlank = CaseManUtils.isBlank(insolvencyNumber);
		Services.setValue(XPathConstants.INSOLVENCY_NO_LOADED,''+!insolvencyBlank);
		if (insolvencyBlank || insolvencyNumber.length!=8)
		{
			Services.setValue(Header_InsolvNo.dataBinding,'');
			Services.setValue(Header_InsolvYear.dataBinding,'');
		} else
		{
			Services.setValue(Header_InsolvNo.dataBinding,insolvencyNumber.substr(0,4));
			Services.setValue(Header_InsolvYear.dataBinding,insolvencyNumber.substr(4));
		}
		// Check if owning court is different
		var court = Services.getValue(Header_OwningCourtCode.dataBinding);
		var msg_ind = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
		var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
		if ( !CaseManUtils.isBlank(court) && court != userOwningCourt && msg_ind != "true" )
		{
			alert(Messages.OWNING_COURT_MESSAGE);
			Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
		}
		
		// Add the isCodedParty flags
		addIsCodedPartyFlags(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty");
		addIsCodedPartyFlags(XPathConstants.DATA_XPATH + "/Parties/Solicitor");
		
		// UCT_Group2 Defect 1125 - set the MCOL Case flag
		var mcolCaseCredCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
		if ( mcolCaseCredCode == CaseManUtils.MCOL_CRED_CODE )
		{
			Services.setValue(Header_MCOLCaseFlag.dataBinding, "Y");
		}
		else
		{
			Services.setValue(Header_MCOLCaseFlag.dataBinding, "N");
		}
	}
	else
	{
		// A new case number has been entered, so clear out the dom and set the defaults for a new case.
		resetForm();
		Services.setValue(XPathConstants.CASE_STATUS, FormConstants.STATUS_NEW);
		
		// Check if MAGS ORDER Case
		if (caseNumber.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) == 0)
		{
			// MAGS ORDER Case
			Services.setValue(Header_CaseType.dataBinding, FormConstants.MAGS_ORDER);
			
			// Set Details of Claim fields to blank as they must exist for a save
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateRequestReceived", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimedCurrency", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimed", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFeeCurrency", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFee", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCostsCurrency", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCosts", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/TotalCurrency", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/Total", "");
			Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue", "");
		}
		
		// Set the owning court to be the users home court
		var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
		Services.setValue(Header_OwningCourtCode.dataBinding, userOwningCourt);
		
		// Set the Creditor Code for CCBC/MCOL purposes
		Services.setValue(XPathConstants.DATA_XPATH + "/CreditorCode", "");
	}
	
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
	Services.setValue(XPathConstants.CLAIMANT_CHANGES_MADE_XPATH, "N");
	Services.endTransaction();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onError = function(exception)
{
	
	if(confirm(Messages.FAILEDCASEDATALOAD_MESSAGE))
	{
		// Reload the case number field so that all data gets reloaded
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		Services.setValue(Header_CaseNumber.dataBinding, "");
		loadCaseData(caseNumber);
	}
	else
	{
		exitScreen();
	}
}


/*********************************************************************************/

 function Header_InsolvNo() {}
 
Header_InsolvNo.tabIndex = 11;
Header_InsolvNo.maxLength = 4;
Header_InsolvNo.helpText = "Insolvency Number";
Header_InsolvNo.componentName = "Insolvency Number";
Header_InsolvNo.mandatoryOn = [Header_CaseType.dataBinding,Header_CaseNumber.dataBinding];
Header_InsolvNo.isMandatory = function() {
	
	return isInsolvencyCase() || CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding));
};

Header_InsolvNo.moveFocus = function(isForward)
{
	if (isForward &&
		CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && 
		CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)))
		{
			return 'Header_CaseNumber';
		}
	return null;
}				

Header_InsolvNo.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding];
Header_InsolvNo.isEnabled = function() {
	
	return isInsolvencyCase() 
		|| CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding));
};


Header_InsolvNo.readOnlyOn = [Header_CaseType.dataBinding];
Header_InsolvNo.isReadOnly = function()
{
	/** Read only if:
	 * 1. is an existing case and isInsolvency No is not blank 
	 **/
	return (isExistingCase() && Services.getValue(XPathConstants.INSOLVENCY_NO_LOADED)==='true');
}

Header_InsolvNo.validateOn = [XPathConstants.CASE_STATUS];
Header_InsolvNo.validate = function () 
{ 	
	var insolvNo = Services.getValue(Header_InsolvNo.dataBinding);
	return CaseManValidationHelper.validateInsolvencyNumber(insolvNo);
}

Header_InsolvNo.logicOn = [Header_InsolvNo.dataBinding, Header_InsolvYear.dataBinding,Header_CaseType.dataBinding];
Header_InsolvNo.logic = function (evnt)
{
	if (evnt !=null && evnt.getXPath() === Header_CaseType.dataBinding)
	{
		if (!isInsolvencyCase())
		{
			Services.startTransaction();
			Services.setValue(Header_InsolvNo.dataBinding,"");
			Services.setValue(Header_InsolvYear.dataBinding,"");
    		Services.setValue(XPathConstants.INSOLVENCY_NO_AND_YEAR, "");			
			Services.endTransaction();
		}
	} else
	{
		//Set the full insolvency number in the model - used for insert & update
		var insolvNo = Services.getValue(Header_InsolvNo.dataBinding);
		var insolYear = Services.getValue(Header_InsolvYear.dataBinding);
		
		//setting the insolvency number when the case is new 
		// or updating the insolvency number for existing case 
		if(!CaseManUtils.isBlank(insolvNo) && !CaseManUtils.isBlank(insolYear)){
			
			if(Services.getAdaptorById("Header_InsolvNo").getValid() && 
			   Services.getAdaptorById("Header_InsolvYear").getValid()){
				
				var fullInsolvencyNo = Services.getValue(Header_InsolvNo.dataBinding)+Services.getValue(Header_InsolvYear.dataBinding);
				
				//only set the new insolvency number if its different from the existing one
				if(fullInsolvencyNo != Services.getValue(XPathConstants.INSOLVENCY_NO_AND_YEAR)){
					Services.setValue(XPathConstants.INSOLVENCY_NO_AND_YEAR,fullInsolvencyNo);
					
					//only check for insolvency number in the DB when the casenumber exists. 
					// This will ensure that the validation doesn't happen when the user is searching for case 
					// using insolvency number. It should happen when the user is Creating a new case or updating an existing case
	                if (!CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding))){
	                    Services.setValue(XPathConstants.CHECK_INSOLVENCY_CASE_FLAG, "true");	
	                }				  
				}
				
			}
		}
		
	}
}
/*********************************************************************************/

function Header_InsolvYear() {}
Header_InsolvYear.tabIndex = 12;
Header_InsolvYear.maxLength = 4;
Header_InsolvYear.helpText = "Insolvency Number";
Header_InsolvYear.componentName = "Insolvency Number";
Header_InsolvYear.mandatoryOn = Header_InsolvNo.mandatoryOn;
Header_InsolvYear.isMandatory = Header_InsolvNo.isMandatory;
Header_InsolvYear.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding];
Header_InsolvYear.isEnabled = Header_InsolvNo.isEnabled;


Header_InsolvYear.readOnlyOn = [Header_CaseType.dataBinding];
Header_InsolvYear.isReadOnly = function()
{
	/** Read only if:
	 * 1. is an existing case and isInsolvency year is not blank 
	 **/
	return (isExistingCase() && Services.getValue(XPathConstants.INSOLVENCY_NO_LOADED)==='true');
}
Header_InsolvYear.validateOn = [XPathConstants.CASE_STATUS];
Header_InsolvYear.validate = function () 
{ 	
	var insolvNo = Services.getValue(Header_InsolvYear.dataBinding);
	return CaseManValidationHelper.validateInsolvencyNumber(insolvNo);
}

Header_InsolvYear.moveFocus = function(isForward)
{
	if (isForward &&
		CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)))
		{
			if (CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)) && 
				CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)))
			{
				return 'Header_CaseNumber';
			}
			else if (!Services.getAdaptorById('Header_InsolvNo').getValid())
			{
				return 'Header_InsolvNo';
			}
			else if (Services.getAdaptorById('Header_InsolvYear').getValid())
			{
				return 'Header_OwningCourtCode';
			} else
				return 'Header_InsolvYear';
		}
	return null;
}	

Header_InsolvYear.onSuccess = function(dom)
{
	if (CaseManUtils.isBlank(XML.getPathTextContent(dom,XPathConstants.DATA_XPATH+'/CaseNumber')))
	{
		var insolvancy = Services.getValue(Header_InsolvNo.dataBinding) + ' of ' + Services.getValue(Header_InsolvYear.dataBinding);
		var courtNum = Services.getValue(Header_OwningCourtName.dataBinding); 
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + courtNum + "]/Name"); 
		Services.showDialog(StandardDialogTypes.OK,function(){},Messages.format(Messages.INSOLVENCY_NUMBER_NOT_FOUND,[insolvancy,courtName]),'Case Not Found');
		//Services.setValue(Header_OwningCourtCode.dataBinding,'');
		Services.setFocus('Header_InsolvNo');
	}
	else {
			Header_CaseNumber.onSuccess(dom);
	}
}

Header_InsolvYear.logicOn = [XPathConstants.CHECK_INSOLVENCY_CASE_FLAG];
Header_InsolvYear.logic = function(){
	
	if ("true" == Services.getValue(XPathConstants.CHECK_INSOLVENCY_CASE_FLAG)){
		
		if(	!CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding))){
			
			checkInsolvencyCaseExists();
			Services.setValue(XPathConstants.CHECK_INSOLVENCY_CASE_FLAG, "false");
			
		}
	}
}


Header_InsolvYear.onError = Header_CaseNumber.onError;

/*********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = 13;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.componentName = "Owning Court Code";
Header_OwningCourtCode.isMandatory = function() { return true; }
Header_OwningCourtCode.enableOn = [Header_CaseNumber.dataBinding, Header_InsolvNo.dataBinding, Header_InsolvYear.dataBinding];
Header_OwningCourtCode.isEnabled = function()
{
//	return (( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() )
//			|| (!CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)) && !CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding))));

    // Set the owning court defaulted to be the users home court, 
	// which will be required while searching for insolvency cases.
	// This is not use while searching for case using casenumber
	return true;  
    
}

Header_OwningCourtCode.readOnlyOn = [XPathConstants.CASE_STATUS,LitigiousParty_Code.dataBinding,SolicitorParty_Code.dataBinding];
Header_OwningCourtCode.isReadOnly = function()
{
	if ( isExistingCase() )
	{
		return true;
	}
	return codedPartiesExist();
}

Header_OwningCourtCode.validate = function(event)
{
	var ec = null;
	if(event.getXPath() == Header_OwningCourtCode.dataBinding){
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + Header_OwningCourtCode.dataBinding + "]/Name");
		if( null == courtName )
		{
			// The entered court code is not a SUPS Court
			ec = ErrorCode.getErrorCode("CaseMan_invalidSUPSCourtCode_Msg");
		}
	}
	return ec;
}

Header_OwningCourtCode.logicOn = [Header_OwningCourtCode.dataBinding, XPathConstants.INSOLVENCY_NO_AND_YEAR];
Header_OwningCourtCode.logic = function(event)
{
	if(event.getXPath() == XPathConstants.REF_DATA_XPATH + "/CourtFeeData/SystemDataList[position() = 1]" ||
	   event.getXPath() == "/" )
	{
		return;
	}

	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	if( this.getValid() )
	{
		Services.setValue(Header_OwningCourtName.dataBinding, courtCode);
		
		if( !CaseManUtils.isBlank(courtCode) ) 
		{
			if ( !isExistingCase() )
			{
				/*
				 * This should only be done if the case number is not blank, i.e. you are searching for an existing case. This allows the 
				 * user to search for an insolvency case in CCBC
				 */ 
				if ( isCCBCCase() && !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)))
				{
					// Set the default case type for a New CCBC Case 
					Services.setValue(Header_CaseType.dataBinding, FormConstants.CCBC_CASE_TYPE);
				}
			}
		}
	}
	
	
	//perform this only for owning court event
	if(event.getXPath() == Header_OwningCourtCode.dataBinding){
	//if casenumber and insolvency number exists then check if the insolvency number is present in the DB
	if (!CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)))
	{
	    if(Services.getAdaptorById("Header_InsolvNo").getValid() &&
		   Services.getAdaptorById("Header_InsolvYear").getValid() &&
		   Services.getAdaptorById("Header_OwningCourtCode").getValid())
		{
			Services.setValue(XPathConstants.CHECK_INSOLVENCY_CASE_FLAG, "true");
		}
	}
	}   
	
	
	// Might need to load the case by insolvency no.
	//If the casenumber is blank, and the 2 insolvancy fields and the court code are not blank
	//and are valid then get the case by insolvancy no.
	if (CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvNo.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)))
	{
	    if(Services.getAdaptorById("Header_InsolvNo").getValid() &&
		   Services.getAdaptorById("Header_InsolvYear").getValid() &&
		   Services.getAdaptorById("Header_OwningCourtCode").getValid())
		{
			getCaseFromInsolvancy();
		}
	}
}

/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.componentName = "Owning Court Name";
Header_OwningCourtName.tabIndex = 14;
Header_OwningCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_OwningCourtName.rowXPath = "Court[./SUPSCourt = 'Y']";
Header_OwningCourtName.keyXPath = "Code";
Header_OwningCourtName.displayXPath = "Name";
Header_OwningCourtName.strictValidation = true;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isMandatory = function() { return true; }
Header_OwningCourtName.validate = function() { return null; }
Header_OwningCourtName.transformToDisplay = convertToUpper;
Header_OwningCourtName.transformToModel = convertToUpper;
Header_OwningCourtName.enableOn = Header_OwningCourtCode.enableOn;
Header_OwningCourtName.isEnabled = Header_OwningCourtCode.isEnabled;

Header_OwningCourtName.logicOn = [Header_OwningCourtName.dataBinding];
Header_OwningCourtName.logic = function()
{
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_OwningCourtName.dataBinding + "]/Name");
	if( null != courtName ) 
	{
		// The entered value must be valid
		Services.startTransaction();
		var value = Services.getValue(Header_OwningCourtName.dataBinding);
		Services.setValue(Header_OwningCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.DATA_XPATH + "/OwningCourtName", courtName);
		Services.endTransaction();
	}	
}

Header_OwningCourtName.readOnlyOn = [XPathConstants.CASE_STATUS,LitigiousParty_Code.dataBinding,SolicitorParty_Code.dataBinding];
Header_OwningCourtName.isReadOnly = function()
{
	if ( isExistingCase() )
	{
		return true;
	}
	return codedPartiesExist();
}

/*********************************************************************************/

function Header_PreferredCourtCode() {}
Header_PreferredCourtCode.tabIndex = 23;
Header_PreferredCourtCode.maxLength = 3;
Header_PreferredCourtCode.helpText = "Preferred court code";
Header_PreferredCourtCode.componentName = "Preferred Court Code";
Header_PreferredCourtCode.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Header_PreferredCourtCode.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return !isMagsOrder();
}

Header_PreferredCourtCode.validate = function(event)
{
	var ec = null;
	if(event.getXPath() == Header_PreferredCourtCode.dataBinding){
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + Header_PreferredCourtCode.dataBinding + "]/Name");
		if( null == courtName )
		{
			// The entered court code is not a SUPS Court
			ec = ErrorCode.getErrorCode("CaseMan_invalidSUPSCourtCode_Msg");
		}
	}
	return ec;
}

Header_PreferredCourtCode.logicOn = [Header_PreferredCourtCode.dataBinding];
Header_PreferredCourtCode.logic = function(event)
{
	if(event.getXPath() == XPathConstants.REF_DATA_XPATH + "/CourtFeeData/SystemDataList[position() = 1]" ||
	   event.getXPath() == "/" )
	{
		return;
	}

	var courtCode = Services.getValue(Header_PreferredCourtCode.dataBinding);
	if( this.getValid() )
	{
		Services.setValue(Header_PreferredCourtName.dataBinding, courtCode);
	}
}

/*********************************************************************************/

function Header_PreferredCourtName() {}
Header_PreferredCourtName.componentName = "Preferred Court Name";
Header_PreferredCourtName.tabIndex = 24;
Header_PreferredCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_PreferredCourtName.rowXPath = "Court[./SUPSCourt = 'Y']";
Header_PreferredCourtName.keyXPath = "Code";
Header_PreferredCourtName.displayXPath = "Name";
Header_PreferredCourtName.strictValidation = true;
Header_PreferredCourtName.helpText = "Preferred court name";
Header_PreferredCourtName.transformToDisplay = convertToUpper;
Header_PreferredCourtName.transformToModel = convertToUpper;
Header_PreferredCourtName.enableOn = Header_PreferredCourtCode.enableOn;
Header_PreferredCourtName.isEnabled = Header_PreferredCourtCode.isEnabled;
Header_PreferredCourtName.logicOn = [Header_PreferredCourtName.dataBinding];
Header_PreferredCourtName.logic = function()
{
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_PreferredCourtName.dataBinding + "]/Name");
	if( null != courtName ) 
	{
		// The entered value must be valid
		Services.startTransaction();
		var value = Services.getValue(Header_PreferredCourtName.dataBinding);
		Services.setValue(Header_PreferredCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.DATA_XPATH + "/PreferredCourtName", courtName);
		Services.endTransaction();
	}	
}

/*********************************************************************************/

function Header_CaseType() {}
Header_CaseType.srcData = XPathConstants.REF_DATA_XPATH + "/CaseTypes";
Header_CaseType.rowXPath = "CaseType";
Header_CaseType.keyXPath = "Type";
Header_CaseType.displayXPath = "Type";
Header_CaseType.tabIndex = 20;
Header_CaseType.maxLength = 30;
Header_CaseType.helpText = "The type of claim issued (e.g. Claim specified etc)";
Header_CaseType.componentName = "Case Type";
Header_CaseType.isMandatory = function() { return true; }
Header_CaseType.validate = function()
{
	// Own validation method written as opposed to using strict validation on the
	// autocomplete because MAGS ORDER is a valid value but not in the list.
	var ec = null;
	
	if ( !isExistingCase() )
	{
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var caseType = Services.getValue(Header_CaseType.dataBinding);
		
		if ( !CaseManUtils.isBlank(caseType) )
		{
			if ( caseNumber.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) == 0 )
			{
				// Perform MAGS ORDER validation
				if ( caseType != FormConstants.MAGS_ORDER )
				{
					ec = ErrorCode.getErrorCode("CaseMan_invalidCaseType_Msg");
				}
			}
			else if ( isCCBCCase() )
			{
				// Perform CCBC Case Type validation
				if ( caseType != FormConstants.CCBC_CASE_TYPE )
				{
					ec = ErrorCode.getErrorCode("CaseMan_invalidCaseType_Msg");
				}
			}
			else
			{
				// Perform non MAGS ORDER validation
				if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypes/CaseType[./Type = " + Header_CaseType.dataBinding + "]") )
				{
					ec = ErrorCode.getErrorCode("CaseMan_invalidCaseType_Msg");
				}
			}
		}
	}
	return ec;
}

Header_CaseType.enableOn = [Header_CaseNumber.dataBinding];
Header_CaseType.isEnabled = function()
{
	return ( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() );
}

Header_CaseType.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.CASE_STATUS, Header_CaseType.dataBinding, Header_OwningCourtCode.dataBinding];
Header_CaseType.isReadOnly = function()
{
	if ( isExistingCase() || isMagsOrder() || isCCBCCase() || 
		 Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*") > 0 )
	{ 
		/* */
		return true;
	}
	return false;
}

Header_CaseType.logicOn = [Header_CaseType.dataBinding, XPathConstants.REF_DATA_XPATH + "/CourtFeeData/SystemDataList"];
Header_CaseType.logic = function(event)
{
	if ( event.getXPath() == "/" )
	{
		return;
	}
	
	var xpath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/FeeType";
	var feeType = Services.getValue(xpath);
	var maxFee = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CourtFeeData/SystemDataList/SystemData[./Item = '" + feeType + "']/ItemValue");

	Services.setValue(XPathConstants.CONSTANTS_XPATH + "/MaxCourtFee", parseFloat(maxFee).toFixed(2));
}

/*********************************************************************************/

function Header_CaseDetails() {}
Header_CaseDetails.tabIndex = 22;
Header_CaseDetails.maxLength = 90;
Header_CaseDetails.helpText = "Brief details of claim";
Header_CaseDetails.componentName = "Case Details";
Header_CaseDetails.transformToDisplay = convertToUpper;
Header_CaseDetails.transformToModel = convertToUpperStripped;
Header_CaseDetails.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Header_CaseDetails.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return !isMagsOrder();
}

/*********************************************************************************/

function Header_MCOLCaseFlag() {}
Header_MCOLCaseFlag.tabIndex = -1;
Header_MCOLCaseFlag.modelValue = {checked: 'Y', unchecked: 'N'};
Header_MCOLCaseFlag.helpText = "Indicates MCOL Case";
Header_MCOLCaseFlag.componentName = "MCOL Case";
Header_MCOLCaseFlag.isReadOnly = function() { return true; }
Header_MCOLCaseFlag.enableOn = [XPathConstants.CASE_STATUS];
Header_MCOLCaseFlag.isEnabled = isExistingCase

/*********************************************************************************/

function Header_CaseStatus() {}
Header_CaseStatus.tabIndex = 30;
Header_CaseStatus.maxLength = 12;
Header_CaseStatus.helpText = "The status of the case";
Header_CaseStatus.componentName = "Case Status";
Header_CaseStatus.isReadOnly = function() { return true; }
Header_CaseStatus.transformToDisplay = convertToUpper;
Header_CaseStatus.transformToModel = convertToUpper;
Header_CaseStatus.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Header_CaseStatus.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return !isMagsOrder();
}

/*********************************************************************************/

function Header_CaseAllocatedTo() {}
Header_CaseAllocatedTo.srcData = XPathConstants.REF_DATA_XPATH + "/TrackList";
Header_CaseAllocatedTo.rowXPath = "/Track";
Header_CaseAllocatedTo.keyXPath = "/Value";
Header_CaseAllocatedTo.displayXPath = "/Description";
Header_CaseAllocatedTo.tabIndex = 31;
Header_CaseAllocatedTo.helpText = "Track that the case is provisionally allocated to";
Header_CaseAllocatedTo.componentName = "Case Provisionally Allocated To";
Header_CaseAllocatedTo.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Header_CaseAllocatedTo.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return !isMagsOrder();
}

/*********************************************************************************/

function Master_PartyType() {};
Master_PartyType.srcData = XPathConstants.VAR_PAGE_XPATH + "/partyTypeSelectList";
Master_PartyType.rowXPath = "/PartyRole";
Master_PartyType.keyXPath = "/Code";
Master_PartyType.displayXPath = "/Description";
Master_PartyType.tabIndex = 110;
Master_PartyType.helpText = "Select a party type";
Master_PartyType.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding, XPathConstants.CASE_STATUS];
Master_PartyType.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if ( isExistingCase() && isMagsOrder() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function LitigiousParty_Code() {};
LitigiousParty_Code.tabIndex = 210;
LitigiousParty_Code.maxLength = 4;
LitigiousParty_Code.helpText = "Unique four digit code for party - list available";
LitigiousParty_Code.componentName = "Party Code";
LitigiousParty_Code.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_Code.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Code.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
LitigiousParty_Code.isEnabled = function()
{
	if ( !isPartyFieldEnabled() )
	{
		return false;
	}
	var code = getCurrentlySelectedPartyTypeCode();
	// Disabled if party type is Defendant, Debtor, Applicant, the Company or is a Claimant for a CCBC Case
	return ( isCCBCCase() && code == PartyTypeCodesEnum.CLAIMANT ) 
		|| ( code == PartyTypeCodesEnum.DEFENDANT )
		|| ( code == PartyTypeCodesEnum.DEBTOR ) 
		|| ( code == PartyTypeCodesEnum.APPLICANT )
		|| ( code == PartyTypeCodesEnum.THE_COMPANY ) ? false : true;
}

LitigiousParty_Code.readOnlyOn = [Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_Code.isReadOnly = function()
{
	return ( isExistingCase() && isMagsOrder() );
}

LitigiousParty_Code.validateOn = [XPathConstants.LP_CODE_VALID_XPATH,XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Code.validate = function()
{
	var code = Services.getValue(LitigiousParty_Code.dataBinding);
	var ec = null;

	// Check that the code is a number
	if(!CaseManValidationHelper.validateNumber(code))
	{
		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
	ec = isNationalCodedParty(code, false);
	
	if ( null == ec )
	{
		// A code has been entered so try and look up the data for the code
		// Lookup the litigious parties name
		var serverSideCheckValid = Services.getValue(XPathConstants.LP_CODE_VALID_XPATH);
		if ( "false" == serverSideCheckValid )
		{
			ec = ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
		}
	}
	return ec;
}

LitigiousParty_Code.logicOn = [LitigiousParty_Code.dataBinding];
LitigiousParty_Code.logic = function(event) 
{
	if (event.getXPath() != LitigiousParty_Code.dataBinding)
	{
		return;
	}

	var currentPartyType = getCurrentlySelectedPartyTypeCode();
	if ( null == currentPartyType || currentPartyType == PartyTypeCodesEnum.SOLICITOR)
	{
		// Exit because a solicitor is selected rather than a litigious party
		return;
	}
	
	// Set the current litigious party root
	var currentPartyRoot = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding;

	var value = Services.getValue(LitigiousParty_Code.dataBinding);	
	if ( null == value )//|| !CaseManValidationHelper.validateNumber(value) )
	{
		// Only happens on initialisation of a new litigious party, so
		// we don't need to do anything in this case
		return;
	}
	else if ( CaseManUtils.isBlank(value) )
	{
		var isCodedParty = Services.getValue(currentPartyRoot + "]/IsCodedParty");
		if ( isCodedParty == "true" )
		{
			// Changing from a coded party to a non coded party
			Services.startTransaction();
			
			if ( isExistingParty() )
			{
				// Need to blank address id and shift address to the historical addresses
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/AddressId", "");
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/PartyId", "");
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateTo", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/Status", FormConstants.STATUS_NEW);
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/SurrogateId", getNextSurrogateKey() );
				var currentAddress = Services.getNode(currentPartyRoot + "]/ContactDetails/Address");
				Services.addNode(currentAddress, currentPartyRoot + "]/HistoricalAddresses");
			}
	
			// Clear any appropriate fields - keeping surrogate id, role and number	
			Services.setValue(currentPartyRoot + "]/PartyId", "");
			Services.setValue(LitigiousParty_Name.dataBinding, "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/AddressId", "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/PartyId", "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Line1.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Line2.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Line3.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Line4.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Line5.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_Address_Postcode.dataBinding, "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/CreatedBy", Services.getCurrentUser() );
			Services.setValue(LitigiousParty_ContactDetails_DX.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_TelephoneNumber.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_FaxNumber.dataBinding, "");
			Services.setValue(LitigiousParty_ContactDetails_EmailAddress.dataBinding, "");			
			Services.setValue(LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, FormConstants.DEFAULT_COMM_METHOD);
			Services.setValue(currentPartyRoot + "]/IsCodedParty", "false");
			Services.endTransaction();
		}
	}
	else
	{
		// Changing Non Coded Party to Coded Party

		// Check to see if the coded party is active on the case
		var xpath = XPathConstants.DATA_XPATH + "/Parties/*[Code = " + LitigiousParty_Code.dataBinding + " and Status != '" + FormConstants.STATUS_REMOVED + "' and SurrogateId != " + masterGrid.dataBinding + "]";
		if ( Services.exists(xpath) )
		{
			alert(Messages.DUPLICATE_PARTYCODE_MESSAGE);
			Services.setValue(LitigiousParty_Code.dataBinding, "");				
			return;
		}
		
		Services.setValue(XPathConstants.LP_CODE_VALID_XPATH, "true");
		
		if ( null != LitigiousParty_Code.validate() )
		{
			// Exit as not a valid code entered
			return;
		}
		
		// Call service to retrieve coded party details
		var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
		var courtCode = isNonCPCNationalCodedParty(value) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourt;
		var params = new ServiceParams();
		params.addSimpleParameter( "codedPartyCode", value );
		params.addSimpleParameter( "adminCourtCode", courtCode );
		Services.callService("getCodedParty", params, LitigiousParty_Code, true);
	}
	
	// Set the dirty flag for the claimant
	setClaimantChangesMade();
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
LitigiousParty_Code.onSuccess = function(dom)
{
	var root = "/CodedParties/CodedParty";
	if ( null != dom.selectSingleNode(root) )
	{
		Services.startTransaction();
		var currentPartyRoot = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding;
		
		// Remove the non coded party details
		var partyId = Services.getValue(currentPartyRoot + "]/PartyId");
		if ( !CaseManUtils.isBlank(partyId) )
		{
			var node = Services.loadDOMFromURL("DeleteNonCodedParty.xml");
			node.selectSingleNode("/DeleteNonCodedParty/PartyId").appendChild( node.createTextNode( partyId ) );
			node.selectSingleNode("/DeleteNonCodedParty").removeChild( node.selectSingleNode("/DeleteNonCodedParty/AddressId") ); // Remove AddressId node
			Services.addNode(node, currentPartyRoot + "]/DeleteNonCodedParties");
		}
		
		// Copy current address to the historical address section
		var addressId = Services.getValue(currentPartyRoot + "]/ContactDetails/Address/AddressId");
		if ( !CaseManUtils.isBlank(addressId) )
		{
			// Blank address id if changing from coded party to another coded party
			var isCurrentlyCodedParty = Services.getValue(currentPartyRoot + "]/IsCodedParty");
			if ( isCurrentlyCodedParty == "true" )
			{
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/AddressId", "" );
				Services.setValue(currentPartyRoot + "]/ContactDetails/Address/PartyId", "" );
			}

			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateTo", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/Status", FormConstants.STATUS_NEW);
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/SurrogateId", getNextSurrogateKey() );
			var currentAddress = Services.getNode(currentPartyRoot + "]/ContactDetails/Address");
			Services.addNode(currentAddress, currentPartyRoot + "]/HistoricalAddresses");
		}
		
		// Set the new coded party details
		var cdroot = root + "/ContactDetails";
		var adroot = cdroot + "/Address";
		var currentPartyRoot = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding;
	
		Services.setValue(currentPartyRoot + "]/PartyId", XML.getNodeTextContent(dom.selectSingleNode(root + "/PartyId")) );
		Services.setValue(LitigiousParty_Name.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")) );
		Services.setValue(currentPartyRoot + "]/ContactDetails/Address/AddressId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/AddressId")) );
		Services.setValue(currentPartyRoot + "]/ContactDetails/Address/PartyId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PartyId")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Line1.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[1]")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Line2.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[2]")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Line3.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[3]")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Line4.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[4]")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Line5.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[5]")) );
		Services.setValue(LitigiousParty_ContactDetails_Address_Postcode.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PostCode")) );
		Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateTo", "" );
		Services.setValue(currentPartyRoot + "]/ContactDetails/Address/CreatedBy", "");
		Services.setValue(LitigiousParty_ContactDetails_DX.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/DX")) );
		Services.setValue(LitigiousParty_ContactDetails_TelephoneNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/TelephoneNumber")) );
		Services.setValue(LitigiousParty_ContactDetails_FaxNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/FaxNumber")) );
		Services.setValue(LitigiousParty_ContactDetails_EmailAddress.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/EmailAddress")) );
		Services.setValue(LitigiousParty_ContactDetails_TranslationToWelsh.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/TranslationToWelsh")) );	
		var communicationMethod = XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/PreferredCommunicationMethod"));
		if ( CaseManUtils.isBlank(communicationMethod) )
		{
			communicationMethod = FormConstants.DEFAULT_COMM_METHOD;  // Default to the first item in the list, which is POSTAL
		}
		Services.setValue(LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, communicationMethod);
		Services.setValue(LitigiousParty_DateOfBirth.dataBinding, "");
		Services.setValue(currentPartyRoot + "]/IsCodedParty", "true");
		Services.endTransaction();
	}
	else
	{
		// Coded Party Entered is invalid
		Services.setValue(XPathConstants.LP_CODE_VALID_XPATH, "false");
		Services.setFocus("LitigiousParty_Code");
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
LitigiousParty_Code.onError = function(exception)
{
	if(confirm(Messages.FAILEDPARTYDATALOAD_MESSAGE))
	{
		// Try again
		var partyCode = Services.getValue(LitigiousParty_Code.dataBinding);
		Services.setValue(LitigiousParty_Code.dataBinding, partyCode);
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

function LitigiousParty_Name() {};
LitigiousParty_Name.tabIndex = 220;
LitigiousParty_Name.maxLength = 70;
LitigiousParty_Name.helpText = "Name of party";
LitigiousParty_Name.componentName = "Party Name";
LitigiousParty_Name.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_Name.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Name.isMandatory = function() { return true; }
LitigiousParty_Name.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Name.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
LitigiousParty_Name.isEnabled = function()
{
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		return false;
	}
	return isPartyFieldEnabled();
}

LitigiousParty_Name.transformToDisplay = convertToUpper;
LitigiousParty_Name.transformToModel = convertToUpperStripped;
LitigiousParty_Name.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_Name.isReadOnly = function()
{
	if ( (isExistingCase() && isMagsOrder()) || isCodedParty() )
	{
		return true;
	}
	return false;
}

LitigiousParty_Name.logicOn = [LitigiousParty_Name.dataBinding];
LitigiousParty_Name.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_Name.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line1() {};
LitigiousParty_ContactDetails_Address_Line1.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Line1.tabIndex = 240;
LitigiousParty_ContactDetails_Address_Line1.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line1.helpText = "First line of party's address";
LitigiousParty_ContactDetails_Address_Line1.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line1.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Line1.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Line1.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line1.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_Address_Line1.componentName = "Party Address Line 1";
LitigiousParty_ContactDetails_Address_Line1.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line1.isMandatory = function() { return true; }
LitigiousParty_ContactDetails_Address_Line1.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line1.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line2() {};
LitigiousParty_ContactDetails_Address_Line2.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Line2.tabIndex = 250;
LitigiousParty_ContactDetails_Address_Line2.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line2.helpText = "Second line of party's address";
LitigiousParty_ContactDetails_Address_Line2.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line2.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line2.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_Address_Line2.componentName = "Party Address Line 2";
LitigiousParty_ContactDetails_Address_Line2.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line2.isMandatory = function() { return true; }
LitigiousParty_ContactDetails_Address_Line2.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Line2.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Line2.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line2.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line3() {};
LitigiousParty_ContactDetails_Address_Line3.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Line3.tabIndex = 260;
LitigiousParty_ContactDetails_Address_Line3.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line3.helpText = "Third line of party's address";
LitigiousParty_ContactDetails_Address_Line3.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line3.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line3.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_Address_Line3.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Line3.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Line3.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line3.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line4() {};
LitigiousParty_ContactDetails_Address_Line4.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Line4.tabIndex = 270;
LitigiousParty_ContactDetails_Address_Line4.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line4.helpText = "Fourth line of party's address";
LitigiousParty_ContactDetails_Address_Line4.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line4.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line4.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_Address_Line4.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Line4.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Line4.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line4.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line5() {};
LitigiousParty_ContactDetails_Address_Line5.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Line5.tabIndex = 280;
LitigiousParty_ContactDetails_Address_Line5.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line5.helpText = "Fifth line of party's address";
LitigiousParty_ContactDetails_Address_Line5.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line5.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line5.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_Address_Line5.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Line5.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Line5.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line5.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Postcode() {};
LitigiousParty_ContactDetails_Address_Postcode.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_Address_Postcode.tabIndex = 290;
LitigiousParty_ContactDetails_Address_Postcode.maxLength = 8;
LitigiousParty_ContactDetails_Address_Postcode.helpText = "Party's postcode";
LitigiousParty_ContactDetails_Address_Postcode.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Postcode.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Postcode.transformToModel = convertToUpper;
LitigiousParty_ContactDetails_Address_Postcode.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding];
LitigiousParty_ContactDetails_Address_Postcode.isReadOnly = function()
{
	return isExistingParty() || isCodedParty();
}

LitigiousParty_ContactDetails_Address_Postcode.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Postcode.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

LitigiousParty_ContactDetails_Address_Postcode.validateOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Postcode.validate = function()
{
	var value = Services.getValue(LitigiousParty_ContactDetails_Address_Postcode.dataBinding);
	
	if(!CaseManValidationHelper.validatePostCode(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_DX() {};
LitigiousParty_ContactDetails_DX.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_DX.tabIndex = 300;
LitigiousParty_ContactDetails_DX.maxLength = 35;
LitigiousParty_ContactDetails_DX.helpText = "Party's document exchange reference number";
LitigiousParty_ContactDetails_DX.componentName = "Party DX Number";
LitigiousParty_ContactDetails_DX.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_DX.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_DX.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_DX.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_DX.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

LitigiousParty_ContactDetails_DX.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_DX.isReadOnly = function()
{
	if ((isExistingCase() && isMagsOrder()) || isCodedParty())
	{
		return true;
	}
	return false;
}

LitigiousParty_ContactDetails_DX.logicOn = [LitigiousParty_ContactDetails_DX.dataBinding];
LitigiousParty_ContactDetails_DX.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_DX.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_TelephoneNumber() {};
LitigiousParty_ContactDetails_TelephoneNumber.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_TelephoneNumber.tabIndex = 310;
LitigiousParty_ContactDetails_TelephoneNumber.maxLength = 24;
LitigiousParty_ContactDetails_TelephoneNumber.helpText = "The telephone number of the party";
LitigiousParty_ContactDetails_TelephoneNumber.componentName = "Party Telephone Number";
LitigiousParty_ContactDetails_TelephoneNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_TelephoneNumber.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_TelephoneNumber.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_TelephoneNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_TelephoneNumber.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

LitigiousParty_ContactDetails_TelephoneNumber.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_TelephoneNumber.isReadOnly = function()
{
	if ( ( isExistingCase() && isMagsOrder() ) || isCodedParty() )
	{
		return true;
	}
	return false;
}

LitigiousParty_ContactDetails_TelephoneNumber.logicOn = [LitigiousParty_ContactDetails_TelephoneNumber.dataBinding];
LitigiousParty_ContactDetails_TelephoneNumber.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_TelephoneNumber.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_FaxNumber() {};
LitigiousParty_ContactDetails_FaxNumber.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_FaxNumber.tabIndex = 320;
LitigiousParty_ContactDetails_FaxNumber.maxLength = 24;
LitigiousParty_ContactDetails_FaxNumber.helpText = "The fax number of the party";
LitigiousParty_ContactDetails_FaxNumber.componentName = "Party Fax Number";
LitigiousParty_ContactDetails_FaxNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_FaxNumber.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_FaxNumber.transformToModel = convertToUpperStripped;
LitigiousParty_ContactDetails_FaxNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_FaxNumber.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

// IAN CHANGE ADDED DATA BINDING
LitigiousParty_ContactDetails_FaxNumber.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_FaxNumber.isReadOnly = function()
{
	if ( ( isExistingCase() && isMagsOrder() ) || isCodedParty() )
	{
		return true;
	}
	return false;
}

LitigiousParty_ContactDetails_FaxNumber.logicOn = [LitigiousParty_ContactDetails_FaxNumber.dataBinding];
LitigiousParty_ContactDetails_FaxNumber.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_FaxNumber.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_EmailAddress() {};
LitigiousParty_ContactDetails_EmailAddress.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_EmailAddress.tabIndex = 330;
LitigiousParty_ContactDetails_EmailAddress.maxLength = 80;
LitigiousParty_ContactDetails_EmailAddress.helpText = "The email address of the party";
LitigiousParty_ContactDetails_EmailAddress.componentName = "Party Email Address";
LitigiousParty_ContactDetails_EmailAddress.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_EmailAddress.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_EmailAddress.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}
	
LitigiousParty_ContactDetails_EmailAddress.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_EmailAddress.isReadOnly = function()
{
	if ( ( isExistingCase() && isMagsOrder() ) || isCodedParty() )
	{
		return true;
	}

	return false;
}

LitigiousParty_ContactDetails_EmailAddress.validateOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_EmailAddress.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(LitigiousParty_ContactDetails_EmailAddress.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

LitigiousParty_ContactDetails_EmailAddress.logicOn = [LitigiousParty_ContactDetails_EmailAddress.dataBinding];
LitigiousParty_ContactDetails_EmailAddress.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_EmailAddress.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_TranslationToWelsh() {};
LitigiousParty_ContactDetails_TranslationToWelsh.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_TranslationToWelsh.modelValue = {checked: "Y", unchecked: "N"}; 
LitigiousParty_ContactDetails_TranslationToWelsh.tabIndex = 350;
LitigiousParty_ContactDetails_TranslationToWelsh.helpText = "Tick box if the party is to receive documents translated into Welsh";
LitigiousParty_ContactDetails_TranslationToWelsh.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_TranslationToWelsh.componentName = "Party Translation To Welsh Flag";
LitigiousParty_ContactDetails_TranslationToWelsh.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_TranslationToWelsh.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

LitigiousParty_ContactDetails_TranslationToWelsh.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_TranslationToWelsh.isReadOnly = function()
{
	if ( isExistingCase() && isMagsOrder() )
	{
		return true;
	}
	return false;
}

LitigiousParty_ContactDetails_TranslationToWelsh.logicOn = [LitigiousParty_ContactDetails_TranslationToWelsh.dataBinding];
LitigiousParty_ContactDetails_TranslationToWelsh.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_TranslationToWelsh.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_PreferredMethodOfCommunication() {};
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.rowXPath = "/Method";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.keyXPath = "/Id";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.displayXPath = "/Name";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.tabIndex = 340;
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.helpText = "Select the preferred communication method of the party";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}
																		  
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,LitigiousParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.isReadOnly = function()
{
	if ( isExistingCase() && isMagsOrder() )
	{
		return true;
	}
	return false;
}

LitigiousParty_ContactDetails_PreferredMethodOfCommunication.logicOn = [LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_Reference() {};
LitigiousParty_Reference.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_Reference.tabIndex = 360;
LitigiousParty_Reference.maxLength = 24;
LitigiousParty_Reference.helpText = "Reference used by the party in the case";
LitigiousParty_Reference.componentName = "Party Reference";
LitigiousParty_Reference.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Reference.transformToDisplay = convertToUpper;
LitigiousParty_Reference.transformToModel = convertToUpperStripped;
LitigiousParty_Reference.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_Reference.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

LitigiousParty_Reference.readOnlyOn = [Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_Reference.isReadOnly = function()
{
	if ( isExistingCase() && isMagsOrder() )
	{
		return true;
	}
	return false;
}

LitigiousParty_Reference.logicOn = [LitigiousParty_Reference.dataBinding];
LitigiousParty_Reference.logic = function(event)
{
	if ( event.getXPath() == LitigiousParty_Reference.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function LitigiousParty_DateOfService() {};
LitigiousParty_DateOfService.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_DateOfService.tabIndex = 370;
LitigiousParty_DateOfService.maxLength = 11;
LitigiousParty_DateOfService.helpText = "Date of service";
LitigiousParty_DateOfService.componentName = "Party Date of Service";
LitigiousParty_DateOfService.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_DateOfService.weekends = true;
LitigiousParty_DateOfService.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_DateOfService.isEnabled = function()
{
	if ( isMagsOrder() || !isPartyFieldEnabled() || CaseManUtils.isBlank( Services.getValue(LitigiousParty_Name.dataBinding) ) )
	{
		return false;
	}

	var code = getCurrentlySelectedPartyTypeCode()
	// Only enabled if party type is Defendant or Part 20 Defendant
	return (code == PartyTypeCodesEnum.DEFENDANT)
		|| (code == PartyTypeCodesEnum.PART_20_DEFENDANT) ? true : false;
	
}

LitigiousParty_DateOfService.readOnlyOn = [Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_DateOfService.isReadOnly = function()
{
	if ( isExistingCase() && isMagsOrder() )
	{
		return true;
	}
	return false;
}

LitigiousParty_DateOfService.validateOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue"];
LitigiousParty_DateOfService.validate = function()
{
	var dateOfService = Services.getValue(LitigiousParty_DateOfService.dataBinding);
	var ec = null;

	// Make sure it is not before the date of issue
	var dateOfIssue = Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue");
	if ( !CaseManUtils.isBlank(dateOfIssue) )
	{
		var dateOfIssueObj = CaseManUtils.createDate(dateOfIssue);
		var dateOfServiceObj = CaseManUtils.createDate(dateOfService);
		// Make sure date is not before date of issue
		if( CaseManUtils.compareDates(dateOfIssueObj, dateOfServiceObj) < 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_serviceDateBeforeIssueDate_Msg");
		}
	}
	return ec;
}

/**
 * Logic maintains the Litigious Party's <DateOfServiceUpdated> node which is required for
 * CCBC.  If an existing party updates their Date of Service, the flag should be changed to 'Y'.
 */
LitigiousParty_DateOfService.logicOn = [LitigiousParty_DateOfService.dataBinding]
LitigiousParty_DateOfService._warningCancelButtonClicked = false;
LitigiousParty_DateOfService.logic = function(event)
{
	if ( event.getXPath() != LitigiousParty_DateOfService.dataBinding )
	{
		return;
	}
	
	// UCT Group2 Defect 1385 - set the Date of Reply to Date of Service + 14 days
	if ( isCCBCCase() )
	{
		var dateOfServiceValue = Services.getValue(LitigiousParty_DateOfService.dataBinding);
		if ( !CaseManUtils.isBlank(dateOfServiceValue) && null == FWDateUtil.validateXSDDate(dateOfServiceValue, true) )
		{
			// Set the date of reply to date of service + 14 days (cannot fall on weekend).  If the date is set to null
			// then leave the date of reply as it is.
			var dateOfServiceObj = CaseManUtils.createDate(dateOfServiceValue);
			var dateOfReplyObj = CaseManUtils.daysInFuture(dateOfServiceObj, 14, false);
			var dateOfReplyValue = CaseManUtils.convertDateToPattern(dateOfReplyObj, CaseManUtils.DATE_MODEL_FORMAT);
			Services.setValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/DateOfReply", dateOfReplyValue);
		}
	}
	
	if ( isExistingParty() )
	{
		var xp = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/DateOfServiceUpdated";
		var updatedFlag = Services.getValue(xp);
		if ( updatedFlag != "Y" )
		{
			Services.setValue(xp, "Y");
		}
	}
	else
	{
		// For new parties, compare the Date of Service to the Date of Issue
		var dateOfService = Services.getValue(LitigiousParty_DateOfService.dataBinding);
		var dateOfIssue = Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue");
		if ( LitigiousParty_DateOfService._warningCancelButtonClicked == true )
		{
			LitigiousParty_DateOfService._warningCancelButtonClicked = false;
}
		else if ( !CaseManUtils.isBlank(dateOfService) && !CaseManUtils.isBlank(dateOfIssue) )
		{
			var dateOfIssueObj = CaseManUtils.createDate(dateOfIssue);
			var dateOfServiceObj = CaseManUtils.createDate(dateOfService);
			var testDate = CaseManUtils.daysInFuture(dateOfIssueObj, 1, true);

			if ( null == FWDateUtil.validateXSDDate(dateOfService, true) && 
				 CaseManUtils.compareDates(testDate, dateOfServiceObj) != 1 &&
				 !confirm(Messages.CONFIRM_CASES_DATEOFSERVICE_MESSAGE) )
			{
				// Date of Service is less than 2 days after the date of issue, and user wishes to cancel
				var originalValue = Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/OriginalDateOfService");
				Services.setValue(LitigiousParty_DateOfService.dataBinding, originalValue);
				dateOfService = originalValue;
				LitigiousParty_DateOfService._warningCancelButtonClicked = true;
			}
		}
		
		// Update the Original Value node
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/OriginalDateOfService",dateOfService);
	}
}

/*********************************************************************************/

function LitigiousParty_LastDateForService() {};
LitigiousParty_LastDateForService.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_LastDateForService.tabIndex = 380;
LitigiousParty_LastDateForService.maxLength = 11;
LitigiousParty_LastDateForService.helpText = "Last date for service";
LitigiousParty_LastDateForService.componentName = "Party Last Date For Service";
LitigiousParty_LastDateForService.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_LastDateForService.weekends = true;
LitigiousParty_LastDateForService.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_LastDateForService.isEnabled = function()
{
	if ( isMagsOrder() || !isPartyFieldEnabled() || CaseManUtils.isBlank( Services.getValue(LitigiousParty_Name.dataBinding) ) )
	{
		return false;
	}

	// Only enabled if party type is Defendant
	return getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.DEFENDANT ? true : false;
}

LitigiousParty_LastDateForService.readOnlyOn = [Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_LastDateForService.isReadOnly = function()
{
	if ( isExistingCase() && isMagsOrder() )
	{
		return true;
	}
	return false;
}

// DO NOT REMOVE - only validation is handled by the framework but need to refresh
LitigiousParty_LastDateForService.validateOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_LastDateForService.logicOn = [LitigiousParty_Name.dataBinding];
LitigiousParty_LastDateForService.logic = function(event)
{
	if ( event.getXPath() != LitigiousParty_Name.dataBinding )
	{
		return;
	}
	
	var dateOfIssueField = Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue");
	if (CaseManUtils.isBlank( dateOfIssueField ) )
	{
		return;
	}

	var value = Services.getValue(LitigiousParty_LastDateForService.dataBinding);
	var dateOfIssue = CaseManUtils.createDate( dateOfIssueField );
	var addressLineOne = Services.getValue(LitigiousParty_ContactDetails_Address_Line1.dataBinding);

	// Check current party type is Defendant, there is no current last date for
	// service and date of issue has a value.
	if (getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.DEFENDANT &&
		CaseManUtils.isBlank(value) && !CaseManUtils.isBlank(dateOfIssue) && CaseManUtils.isBlank(addressLineOne) )
	{
		var newDate = CaseManUtils.fourMonthsInFuture(dateOfIssue, LitigiousParty_LastDateForService.weekends);
		Services.setValue( LitigiousParty_LastDateForService.dataBinding, CaseManUtils.convertDateToPattern(newDate, CaseManUtils.DATE_MODEL_FORMAT) );
	}
}

/*********************************************************************************/

function LitigiousParty_DateOfBirth() {};
LitigiousParty_DateOfBirth.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_DateOfBirth.tabIndex = 390;
LitigiousParty_DateOfBirth.maxLength = 11;
LitigiousParty_DateOfBirth.helpText = "Enter party's date of birth if known";
LitigiousParty_DateOfBirth.componentName = "Date of Birth";
LitigiousParty_DateOfBirth.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_DateOfBirth.weekends = true;
LitigiousParty_DateOfBirth.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding,LitigiousParty_Code.dataBinding];
LitigiousParty_DateOfBirth.isEnabled = function()
{
	if ( !isPartyFieldEnabled() || CaseManUtils.isBlank( Services.getValue(LitigiousParty_Name.dataBinding) ) 
		 || isCodedParty() )
	{
		// Disabled if no case loaded, party name not entered or is a coded party
		return false;
	}
	
	var currentParty = getCurrentlySelectedPartyTypeCode();
	if ( currentParty == PartyTypeCodesEnum.SOLICITOR || 
		 currentParty == PartyTypeCodesEnum.OFFICIAL_RECEIVER ||
		 currentParty == PartyTypeCodesEnum.THE_COMPANY || 
		 currentParty == PartyTypeCodesEnum.TRUSTEE || 
		 currentParty == PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER )
	{
		// Date of Birth is disabled for solicitors, official receivers, trustees, insolvency practitioners and company parties
		return false;
	}
	
	return true;
}

LitigiousParty_DateOfBirth.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_DateOfBirth.isReadOnly = function()
{
	if ( ( isExistingCase() && isMagsOrder() ) )
	{
		return true;
	}
	return false;
}

// DO NOT REMOVE - only validation is handled by the framework but need to refresh
LitigiousParty_DateOfBirth.validateOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_DateOfBirth.validate = function()
{
	return 	CaseManValidationHelper.validateDateOfBirth(
				LitigiousParty_DateOfBirth.dataBinding, 
				XPathConstants.SYSTEMDATE_XPATH
			);
}

/*********************************************************************************/

function LitigiousParty_SelectSolicitor() {};
LitigiousParty_SelectSolicitor.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_SelectSolicitor.srcData = XPathConstants.VAR_PAGE_XPATH + "/solicitorSelectList";
LitigiousParty_SelectSolicitor.rowXPath = "/Solicitor";
LitigiousParty_SelectSolicitor.keyXPath = "/SurrogateId";
LitigiousParty_SelectSolicitor.displayXPath = "/Name";
LitigiousParty_SelectSolicitor.nullDisplayValue = "No Solicitor";
LitigiousParty_SelectSolicitor.tabIndex = 400;
LitigiousParty_SelectSolicitor.helpText = "Select the party's solicitor";
LitigiousParty_SelectSolicitor.componentName = "Party Select Solicitor Select List";
LitigiousParty_SelectSolicitor.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_SelectSolicitor.isMandatory = function()
{
	var isMandatory = false;
	if ( isCCBCCase() && getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.CLAIMANT )
	{
		// For CCBC Cases (excluding MCOL cases), the claimant must have a solicitor
		var mcolCaseCredCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
		if ( mcolCaseCredCode != CaseManUtils.MCOL_CRED_CODE )
		{
			isMandatory = true;
		}
	}
	return isMandatory;
}

LitigiousParty_SelectSolicitor.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_SelectSolicitor.isEnabled = function()
{
	if ( isMagsOrder() )
	{
		return false;
	}
	
	if( CaseManUtils.isBlank( Services.getValue(LitigiousParty_Name.dataBinding) ) )
	{
		return false
	}

	if ( isPartyFieldEnabled() && getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{	
		return false;
	}
	return true;
}

LitigiousParty_SelectSolicitor.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_SelectSolicitor.logicOn = [LitigiousParty_SelectSolicitor.dataBinding];
LitigiousParty_SelectSolicitor.logic = function(event)
{
	if (event.getXPath() == XPathConstants.DATA_XPATH + "/Parties/LitigiousParty" ||
		event.getXPath() == "/" )
	{
		return;
	}

	Services.startTransaction();
	
	var currentPartyType = getCurrentlySelectedPartyTypeCode();
	if ( null != currentPartyType && currentPartyType != PartyTypeCodesEnum.SOLICITOR )
	{
		var value = Services.getValue(LitigiousParty_SelectSolicitor.dataBinding);
		var valid = this.getValid();
		var solicitorSurrogateId = Services.getValue(LitigiousParty_SelectSolicitor.dataBinding);
	
		// Set the selected solicitor variable associated with the master grid
		Services.setValue(XPathConstants.SELECTED_SOLICITOR_XPATH, solicitorSurrogateId);
		
		// Enable the solicitor page if the litigious party is now represented by a solicitor
		if ( !CaseManUtils.isBlank(solicitorSurrogateId) )
		{
			// Enable the solicitor tab
			Services.setValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH, FormConstants.ENABLED);
			if ( currentPartyType == PartyTypeCodesEnum.CLAIMANT )
			{
				var currentPayeeValue = Services.getValue(SolicitorParty_Payee.dataBinding);
				if ( currentPayeeValue != "N" )
				{
					// Set the Payee flag to Y unless previously set to 'N'
					Services.setValue(SolicitorParty_Payee.dataBinding, "Y");
				}
			}
		}
		else
		{
			// Disable the solicitor tab
			Services.setValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH, FormConstants.DISABLED);
			
			// Wrap the next two set statements around isBlanks as when case loads and is no
			// solicitor on the first selected party, they are fired which causes the updateLogic to
			// fire.  If this doesn't work can filter out based on event.getXPath == /ds/ManageCase[pos() = 1]
			if ( event.getXPath() == LitigiousParty_SelectSolicitor.dataBinding )
			{
				if ( !CaseManUtils.isBlank( Services.getValue(SolicitorParty_Reference.dataBinding) ) )
				{
					Services.setValue(SolicitorParty_Reference.dataBinding, "");
				}
				if ( !CaseManUtils.isBlank( Services.getValue(SolicitorParty_Payee.dataBinding) ) )
				{
					Services.setValue(SolicitorParty_Payee.dataBinding, "");
				}
			}
		}
	}

	// Notification Date Popup Code
	if ( LitigiousParty_SelectSolicitor.dataBinding == event.getXPath() &&
		 isExistingCase() &&
		 isExistingParty() &&
		 null != currentPartyType && 
		 currentPartyType != PartyTypeCodesEnum.SOLICITOR )
	{
		if (currentPartyType == PartyTypeCodesEnum.DEFENDANT)
		{
			 if (CaseManUtils.isBlank(solicitorSurrogateId))
			 {
			 	// No new solicitor, just remove
				 Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode", EventConstants.NOTIFDATE_DEF_REMSOL_EVENT);
			 }
			 else
			 {
			 	// User replaces solicitor
				Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode", EventConstants.NOTIFDATE_DEF_ADDSOL_EVENT);
			 }
		}
		else
		{
			 Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode", EventConstants.NOTIFDATE_CLAIMANT_EVENT);
		}
		Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationPartyId",Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/PartyId") );
		Services.setValue( Notification_Date.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.dispatchEvent("Notification_Date_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	
	setClaimantChangesMade();
	Services.endTransaction();
}

/*********************************************************************************/

function LitigiousParty_Confidential() {};
LitigiousParty_Confidential.isTemporary = function() { return FormVariables.LITPARTY_FIELDS_TEMPORARY; }
LitigiousParty_Confidential.modelValue = {checked: "Y", unchecked: "N"}; 
LitigiousParty_Confidential.tabIndex = 415;
LitigiousParty_Confidential.helpText = "Tick box if the party has requested confidentiality";
LitigiousParty_Confidential.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Confidential.componentName = "Request Confidentiality";
LitigiousParty_Confidential.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_Confidential.isEnabled = function()
{
	var blnEnabled = true;
	var grouping = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/Grouping");
	if ( !isPartyFieldEnabled() || CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding)) || grouping != "FAMILY_ENFORCEMENT" )
	{
		// Disabled if party fields should be disabled, if the party name is blank or if the case type is not family enforcement
		blnEnabled = false;
	}
	return blnEnabled;
}

/*********************************************************************************/

function SolicitorParty_Code() {};
SolicitorParty_Code.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_Code.tabIndex = 500;
SolicitorParty_Code.maxLength = 4;
SolicitorParty_Code.helpText = "Unique four digit code for solicitor - list available";
SolicitorParty_Code.componentName = "Solicitor Code";
SolicitorParty_Code.retrieveOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_Code.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Code.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_Code.isMandatory = function()
{
	var isFieldMandatory = false;
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		var solicitorId = Services.getValue(masterGrid.dataBinding);
		var blnUsedByClaimant = Services.exists( XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.CLAIMANT + "' and ./SolicitorSurrogateId = '" + solicitorId + "']" );
		var currentCreditorCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
		if ( isCCBCCase() && 
			 currentCreditorCode != CaseManUtils.MCOL_CRED_CODE &&
			 blnUsedByClaimant )
		{
			// Claimant's Solicitor must be a coded party if the case is CCBC (excluding MCOL cases)
			isFieldMandatory = true;
		}
	}
	return isFieldMandatory;
}

SolicitorParty_Code.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Code.isReadOnly = function(event)
{
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		if ( null != event && event.getXPath() == SolicitorParty_Code.dataBinding )
		{
			// If the read only rule is invoked from a change to the field, always remain editable
			return false;
		}
		
		var partyStatus = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
		var code = Services.getValue(SolicitorParty_Code.dataBinding);
		if ( !isCCBCCase() && partyStatus == FormConstants.STATUS_EXISTING && CaseManUtils.isCCBCNationalCodedParty(code) )
		{
			// Read only if the solicitor is an existing national coded party on a non CCBC court
			return true;
		}
		else
		{
			return false;
		}
	}
	
	// Always read only if the currently selected party is not a solicitor
	return true;
}

SolicitorParty_Code.validateOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.SOL_CODE_VALID_XPATH];
SolicitorParty_Code.validate = function(event)
{
	var code = Services.getValue(SolicitorParty_Code.dataBinding);
	var ec = null;

	// Check that the code is a number
	if ( !CaseManValidationHelper.validateNumber(code) )
	{
		return ErrorCode.getErrorCode("Caseman_nonNumericPartyCode_Msg");
	}
	ec = isNationalCodedParty(code, true);
	
	if ( null == ec )
	{		
		// A code has been entered so try and look up the data for the code
		// Lookup the solicitor's name
		var serverSideCheckValid = Services.getValue(XPathConstants.SOL_CODE_VALID_XPATH);
		if ( "false" == serverSideCheckValid )
		{
			ec = ErrorCode.getErrorCode("Caseman_nonExistantCodedParty_Msg");
		}
	}
	return ec;
}

SolicitorParty_Code.logicOn = [SolicitorParty_Code.dataBinding];
SolicitorParty_Code.logic = function(event)
{
	if (event.getXPath() != SolicitorParty_Code.dataBinding)
	{
		return;
	}

	var currentPartyType = getCurrentlySelectedPartyTypeCode();
	if ( null != currentPartyType && currentPartyType != PartyTypeCodesEnum.SOLICITOR)
	{
		// Exit because a solicitor is not selected
		return;
	}

	var value = Services.getValue(SolicitorParty_Code.dataBinding);	
	if( null == value )
	{
		// Only happens on initialisation of a new litigious party, so
		// we don't need to do anything in this case
		return;
	}
	else if ( CaseManUtils.isBlank(value) )
	{
		// Will be changing a coded party to a non coded party
		var currentPartyRoot = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding;
		var isCodedParty = Services.getValue(currentPartyRoot + "]/IsCodedParty");
		if ( isCodedParty == "true" )
		{
			// Clear the party fields leaving surrogate id and party number / role
			Services.startTransaction();
			Services.setValue(currentPartyRoot + "]/PartyId", "");	
			Services.setValue(SolicitorParty_Name.dataBinding, "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/AddressId", "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/PartyId", "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Line1.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Line2.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Line3.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Line4.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Line5.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_Address_Postcode.dataBinding, "");
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			Services.setValue(currentPartyRoot + "]/ContactDetails/Address/CreatedBy", Services.getCurrentUser() );
			Services.setValue(SolicitorParty_ContactDetails_DX.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_TelephoneNumber.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_FaxNumber.dataBinding, "");
			Services.setValue(SolicitorParty_ContactDetails_EmailAddress.dataBinding, "");			
			Services.setValue(SolicitorParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, FormConstants.DEFAULT_COMM_METHOD);
			Services.setValue(currentPartyRoot + "]/IsCodedParty", "false");
			Services.endTransaction();
		}
		return;
	}
	else
	{
		// Will either be changing a non coded party to a coded party or
		// a coded party to another coded party.

		// Check to see if the coded party is active on the case
		var xpath = XPathConstants.DATA_XPATH + "/Parties/*[Code = " + SolicitorParty_Code.dataBinding + " and Status != '" + FormConstants.STATUS_REMOVED + "' and SurrogateId != " + masterGrid.dataBinding +"]";
		if ( Services.exists(xpath) )
		{
			alert(Messages.DUPLICATE_PARTYCODE_MESSAGE);
			Services.setValue(SolicitorParty_Code.dataBinding, "");
			return;
		}
		
		Services.setValue(XPathConstants.SOL_CODE_VALID_XPATH, "true");
		
		// Exit as invalid code entered
		if ( null != SolicitorParty_Code.validate() )
		{
			return;
		}

		// Call the service to retrieve the coded party's details
		var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
		var courtCode = isNonCPCNationalCodedParty(value) ? CaseManUtils.GLOBAL_COURT_CODE : owningCourt;
		var params = new ServiceParams();
		params.addSimpleParameter( "codedPartyCode", value );
		params.addSimpleParameter( "adminCourtCode", courtCode );
		Services.callService("getCodedParty", params, SolicitorParty_Code, true);
	}
}

SolicitorParty_Code.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
SolicitorParty_Code.isEnabled = isPartyFieldEnabled;

/**
 * @param dom
 * @author rzxd7g
 * 
 */
SolicitorParty_Code.onSuccess = function(dom)
{
	var root = "/CodedParties/CodedParty";
	if ( null != dom.selectSingleNode(root) )
	{
		Services.startTransaction();
		
		var solicitorRootXPath = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding;
		var node = Services.loadDOMFromURL("DeleteNonCodedParty.xml");
		
		var partyId = Services.getValue(solicitorRootXPath + "]/PartyId");
		if ( !CaseManUtils.isBlank(partyId) )
		{
			Services.setValue(solicitorRootXPath + "]/DeleteNonCodedParty/PartyId", partyId);		
			node.selectSingleNode("/DeleteNonCodedParty/PartyId").appendChild( node.createTextNode( partyId ) );
		}
		var addressId = Services.getValue(solicitorRootXPath + "]/ContactDetails/Address/AddressId");
		if ( !CaseManUtils.isBlank(addressId) )
		{		
			Services.setValue(solicitorRootXPath + "]/DeleteNonCodedParty/AddressId", addressId);
			node.selectSingleNode("/DeleteNonCodedParty/AddressId").appendChild( node.createTextNode( addressId ) );
		}
		
		if ( !CaseManUtils.isBlank(partyId) || !CaseManUtils.isBlank(addressId) )
		{
			Services.addNode(node, solicitorRootXPath + "]/DeleteNonCodedParties");
		}
		
		var cdroot = root + "/ContactDetails";
		var adroot = cdroot + "/Address";
	
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/PartyId", XML.getNodeTextContent(dom.selectSingleNode(root + "/PartyId")) );
		Services.setValue(SolicitorParty_Name.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(root + "/Name")) );
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/AddressId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/AddressId")) );
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/PartyId", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PartyId")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Line1.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[1]")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Line2.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[2]")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Line3.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[3]")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Line4.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[4]")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Line5.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/Line[5]")) );
		Services.setValue(SolicitorParty_ContactDetails_Address_Postcode.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(adroot + "/PostCode")) );
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/DateFrom", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/DateFrom")) );
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/DateTo", XML.getNodeTextContent(dom.selectSingleNode(adroot + "/DateTo")) );
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/ContactDetails/Address/CreatedBy", "");
		Services.setValue(SolicitorParty_ContactDetails_DX.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/DX")) );
		Services.setValue(SolicitorParty_ContactDetails_TelephoneNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/TelephoneNumber")) );
		Services.setValue(SolicitorParty_ContactDetails_FaxNumber.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/FaxNumber")) );
		Services.setValue(SolicitorParty_ContactDetails_EmailAddress.dataBinding, XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/EmailAddress")) );
	
		var communicationMethod = XML.getNodeTextContent(dom.selectSingleNode(cdroot + "/PreferredCommunicationMethod"));
		if(CaseManUtils.isBlank(communicationMethod))
		{
			communicationMethod = FormConstants.DEFAULT_COMM_METHOD;  // Default to the first item in the list, which is POSTAL
		}	
		Services.setValue(SolicitorParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, communicationMethod);
		Services.setValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/IsCodedParty", "true");
	
		Services.endTransaction();
	}
	else
	{
		// Coded Party Entered is invalid
		Services.setValue(XPathConstants.SOL_CODE_VALID_XPATH, "false");
		Services.setFocus("SolicitorParty_Code");
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
SolicitorParty_Code.onError = function(exception)
{
	if(confirm(Messages.FAILEDSOLDATALOAD_MESSAGE))
	{
		// Try again
		var solicitorCode = Services.getValue(SolicitorParty_Code.dataBinding);
		Services.setValue(SolicitorParty_Code.dataBinding, solicitorCode);
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

function SolicitorParty_Name() {};
SolicitorParty_Name.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_Name.tabIndex = 510;
SolicitorParty_Name.maxLength = 70;
SolicitorParty_Name.helpText = "Solicitor name";
SolicitorParty_Name.componentName = "Solicitor Name";
SolicitorParty_Name.retrieveOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_Name.dataDependencyOn = [masterGrid.dataBinding];
/**
 * @param forward
 * @author rzxd7g
 * @return "SolicitorParty_Code" , "SolicitorParty_ContactDetails_Address_Line1" , "SolicitorParty_CodeLOVButton"  
 */
SolicitorParty_Name.moveFocus = function(forward)
{
	if(!forward)
	{
		return "SolicitorParty_Code";
	}
	else if(!CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)))
	{
		return "SolicitorParty_ContactDetails_Address_Line1";
	}
	return "SolicitorParty_CodeLOVButton";
}

SolicitorParty_Name.transformToDisplay = convertToUpper;
SolicitorParty_Name.transformToModel = convertToUpperStripped;
SolicitorParty_Name.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_Name.isMandatory = function() { return true;}
SolicitorParty_Name.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_Name.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_Name.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
SolicitorParty_Name.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		// Litigious Party selected and with no solicitor
		// Disable field so is not validated by form
		if (CaseManUtils.isBlank(Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId")))
		{
			return false;
		}
	}
	return true;
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line1() {};
SolicitorParty_ContactDetails_Address_Line1.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Line1.tabIndex = 530;
SolicitorParty_ContactDetails_Address_Line1.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line1.helpText = "First line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line1.componentName = "Solicitor Address Line 1";
SolicitorParty_ContactDetails_Address_Line1.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line1.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Line1.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Line1.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Line1.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line1.isMandatory = function() { return true;}
SolicitorParty_ContactDetails_Address_Line1.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Line1.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_Address_Line1.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Line1.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/**
 * Logic to maintain the solicitor's <AddressUpdated> node.  This node is required by CCBC
 * and if an existing solicitor updates any address fields, the node should be changed to 'Y'.
 */
SolicitorParty_ContactDetails_Address_Line1.logicOn = [
	SolicitorParty_ContactDetails_Address_Line1.dataBinding,
	SolicitorParty_ContactDetails_Address_Line2.dataBinding,
	SolicitorParty_ContactDetails_Address_Line3.dataBinding,
	SolicitorParty_ContactDetails_Address_Line4.dataBinding,
	SolicitorParty_ContactDetails_Address_Line5.dataBinding,
	SolicitorParty_ContactDetails_Address_Postcode.dataBinding
];
SolicitorParty_ContactDetails_Address_Line1.logic = function(event)
{
	var eventXPath = event.getXPath();
	var validInput = false;
	for ( var i=0, l=SolicitorParty_ContactDetails_Address_Line1.logicOn.length; i<l; i++ )
	{
		// Setup to exit if logic entered without address line changing
		if ( eventXPath == SolicitorParty_ContactDetails_Address_Line1.logicOn[i] )
		{
			validInput = true;
			break;
		}
	}
	
	// UCT Defect 701 - exit if no selected solicitor path setup
	var selSol = Services.getValue(XPathConstants.SELECTED_SOLICITOR_XPATH);
	if ( !validInput || CaseManUtils.isBlank(selSol) )
	{
		return;
	}

	var partyTypeCode = getCurrentlySelectedPartyTypeCode();
	if ( partyTypeCode == PartyTypeCodesEnum.SOLICITOR && isExistingParty() )
	{
		// Only set the flag if the Solicitor represents a Claimant.
		var solicitorId = Services.getValue(masterGrid.dataBinding);
		var blnUsedByClaimant = Services.exists( XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.CLAIMANT + "' and ./SolicitorSurrogateId = '" + solicitorId + "']" );
		if ( !blnUsedByClaimant )
		{
			return;
		}
		
		var xp = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/AddressUpdated";
		var addressUpdatedValue = Services.getValue(xp);
		if ( addressUpdatedValue != "Y" )
		{
			Services.setValue(xp, "Y");
		}
		
		// Copy the address node to a safe place incase is stripped out by server side XSL.
		var addressNode = Services.getNode(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/Address");
		Services.replaceNode(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + XPathConstants.SELECTED_SOLICITOR_XPATH + "]/ContactDetails/MCOLUpdateAddress/Address", addressNode);
	}
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line2() {};
SolicitorParty_ContactDetails_Address_Line2.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Line2.tabIndex = 540;
SolicitorParty_ContactDetails_Address_Line2.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line2.helpText = "Second line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line2.componentName = "Solicitor Address Line 2";
SolicitorParty_ContactDetails_Address_Line2.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line2.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Line2.mandatoryOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line2.isMandatory = function() { return true;}
SolicitorParty_ContactDetails_Address_Line2.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Line2.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Line2.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Line2.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_Address_Line2.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Line2.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line3() {};
SolicitorParty_ContactDetails_Address_Line3.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Line3.tabIndex = 550;
SolicitorParty_ContactDetails_Address_Line3.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line3.helpText = "Third line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line3.componentName = "Solicitor Address Line 3";
SolicitorParty_ContactDetails_Address_Line3.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line3.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Line3.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Line3.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Line3.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Line3.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_Address_Line3.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Line3.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line4() {};
SolicitorParty_ContactDetails_Address_Line4.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Line4.tabIndex = 560;
SolicitorParty_ContactDetails_Address_Line4.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line4.helpText = "Fourth line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line4.componentName = "Solicitor Address Line 4";
SolicitorParty_ContactDetails_Address_Line4.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line4.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Line4.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Line4.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Line4.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Line4.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_Address_Line4.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Line4.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line5() {};
SolicitorParty_ContactDetails_Address_Line5.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Line5.tabIndex = 570;
SolicitorParty_ContactDetails_Address_Line5.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line5.helpText = "Fifth line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line5.componentName = "Solicitor Address Line 5";
SolicitorParty_ContactDetails_Address_Line5.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line5.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Line5.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Line5.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Line5.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Line5.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_Address_Line5.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Line5.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Postcode() {};
SolicitorParty_ContactDetails_Address_Postcode.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_Address_Postcode.tabIndex = 580;
SolicitorParty_ContactDetails_Address_Postcode.maxLength = 8;
SolicitorParty_ContactDetails_Address_Postcode.helpText = "Postcode of the solicitor";
SolicitorParty_ContactDetails_Address_Postcode.componentName = "Solicitor Postcode";
SolicitorParty_ContactDetails_Address_Postcode.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Postcode.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_Address_Postcode.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_Address_Postcode.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_Address_Postcode.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_Address_Postcode.transformToModel = convertToUpper;
SolicitorParty_ContactDetails_Address_Postcode.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_Address_Postcode.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

SolicitorParty_ContactDetails_Address_Postcode.validateOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_ContactDetails_Address_Postcode.validate = function()
{
	var value = Services.getValue(SolicitorParty_ContactDetails_Address_Postcode.dataBinding);
	
	if(!CaseManValidationHelper.validatePostCode(value)) {
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_DX() {};
SolicitorParty_ContactDetails_DX.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_DX.tabIndex = 590;
SolicitorParty_ContactDetails_DX.maxLength = 35;
SolicitorParty_ContactDetails_DX.helpText = "Document exchange reference number of the solicitor";
SolicitorParty_ContactDetails_DX.componentName = "Solicitor DX Number";
SolicitorParty_ContactDetails_DX.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_DX.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_DX.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_DX.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_DX.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_DX.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_DX.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_DX.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_TelephoneNumber() {};
SolicitorParty_ContactDetails_TelephoneNumber.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_TelephoneNumber.tabIndex = 600;
SolicitorParty_ContactDetails_TelephoneNumber.maxLength = 24;
SolicitorParty_ContactDetails_TelephoneNumber.helpText = "Solicitor's telephone number";
SolicitorParty_ContactDetails_TelephoneNumber.componentName = "Solicitor Telephone Number";
SolicitorParty_ContactDetails_TelephoneNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_TelephoneNumber.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_TelephoneNumber.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_TelephoneNumber.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_TelephoneNumber.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_TelephoneNumber.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_TelephoneNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_TelephoneNumber.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_FaxNumber() {};
SolicitorParty_ContactDetails_FaxNumber.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_FaxNumber.tabIndex = 610;
SolicitorParty_ContactDetails_FaxNumber.maxLength = 24;
SolicitorParty_ContactDetails_FaxNumber.helpText = "Solicitor's fax number";
SolicitorParty_ContactDetails_FaxNumber.componentName = "Solicitor Fax Number";
SolicitorParty_ContactDetails_FaxNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_FaxNumber.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_FaxNumber.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_FaxNumber.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_FaxNumber.transformToDisplay = convertToUpper;
SolicitorParty_ContactDetails_FaxNumber.transformToModel = convertToUpperStripped;
SolicitorParty_ContactDetails_FaxNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_FaxNumber.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_EmailAddress() {};
SolicitorParty_ContactDetails_EmailAddress.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_EmailAddress.tabIndex = 620;
SolicitorParty_ContactDetails_EmailAddress.maxLength = 80;
SolicitorParty_ContactDetails_EmailAddress.helpText = "Solicitor's email address";
SolicitorParty_ContactDetails_EmailAddress.componentName = "Solicitor Email Address";
SolicitorParty_ContactDetails_EmailAddress.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_EmailAddress.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_EmailAddress.isReadOnly = solicitorReadOnlyFields;
SolicitorParty_ContactDetails_EmailAddress.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH,SolicitorParty_Code.dataBinding];
SolicitorParty_ContactDetails_EmailAddress.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_EmailAddress.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

SolicitorParty_ContactDetails_EmailAddress.validateOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_ContactDetails_EmailAddress.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(SolicitorParty_ContactDetails_EmailAddress.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_PreferredMethodOfCommunication() {};
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.rowXPath = "/Method";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.keyXPath = "/Id";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.displayXPath = "/Name";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.tabIndex = 630;
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.helpText = "Select the preferred communication method of the solicitor";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.componentName = "Solicitor Preferred Communication Method";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.readOnlyOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH, SolicitorParty_Code.dataBinding, Header_CaseType.dataBinding, XPathConstants.CASE_STATUS];
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.dataDependencyOn = [masterGrid.dataBinding];
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.isReadOnly = function()
{
	if (isExistingCase() && isMagsOrder())
	{
		return true;
	}
	return false;
}

SolicitorParty_ContactDetails_PreferredMethodOfCommunication.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.isEnabled = function()
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(SolicitorParty_Name.dataBinding)));
}

/*********************************************************************************/

function SolicitorParty_Reference() {};
SolicitorParty_Reference.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_Reference.tabIndex = 640;
SolicitorParty_Reference.maxLength = 24;
SolicitorParty_Reference.helpText = "Solicitors Reference Number";
SolicitorParty_Reference.componentName = "Solicitor Reference";
SolicitorParty_Reference.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Reference.transformToDisplay = convertToUpper;
SolicitorParty_Reference.transformToModel = convertToUpperStripped;
SolicitorParty_Reference.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_Reference.isEnabled = function(event)
{
	// Check if Litigious Party selected
	if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
	{
		return (isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)));
	}
	return false;
}

SolicitorParty_Reference.logicOn = [SolicitorParty_Reference.dataBinding];
SolicitorParty_Reference.logic = function(event)
{
	if ( event.getXPath() == SolicitorParty_Reference.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function SolicitorParty_Payee() {}; 
SolicitorParty_Payee.isTemporary = function() { return FormVariables.SOLICITOR_FIELDS_TEMPORARY; }
SolicitorParty_Payee.modelValue = {checked: "Y", unchecked: "N"}; 
SolicitorParty_Payee.tabIndex = 650;
SolicitorParty_Payee.helpText = "Tick box if solicitor is Payee or clear if claimant is Payee";
SolicitorParty_Payee.componentName = "Solicitor Payee Flag";
SolicitorParty_Payee.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Payee.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,SolicitorParty_Name.dataBinding,LitigiousParty_SelectSolicitor.dataBinding];
SolicitorParty_Payee.isEnabled = function(event)
{
	if (!isPartyFieldEnabled() || CaseManUtils.isBlank(Services.getValue(LitigiousParty_SelectSolicitor.dataBinding)))
	{
		return false;
	}

	// Enabled if the party type is a claimant
	return getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.CLAIMANT ? true : false;
}

SolicitorParty_Payee.logicOn = [SolicitorParty_Payee.dataBinding];
SolicitorParty_Payee.logic = function(event)
{
	if ( event.getXPath() == SolicitorParty_Payee.dataBinding )
	{
		// Set the dirty flag for the claimant
		setClaimantChangesMade();
	}
}

/*********************************************************************************/

function Mediation_ContactName() {}
Mediation_ContactName.tabIndex = 660;
Mediation_ContactName.maxLength = 70;
Mediation_ContactName.helpText = "Contact name for mediation";
Mediation_ContactName.transformToDisplay = convertToUpper;
Mediation_ContactName.transformToModel = convertToUpperStripped;
Mediation_ContactName.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];

/*********************************************************************************/

function Mediation_TelephoneNumber() {}
Mediation_TelephoneNumber.tabIndex = 661;
Mediation_TelephoneNumber.maxLength = 24;
Mediation_TelephoneNumber.helpText = "Contact telephone number for mediation";
Mediation_TelephoneNumber.transformToDisplay = convertToUpper;
Mediation_TelephoneNumber.transformToModel = convertToUpperStripped;
Mediation_TelephoneNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];

/*********************************************************************************/

function Mediation_EmailAddress() {}
Mediation_EmailAddress.tabIndex = 662;
Mediation_EmailAddress.maxLength = 80;
Mediation_EmailAddress.helpText = "Contact email address for mediation";
Mediation_EmailAddress.transformToDisplay = convertToUpper;
Mediation_EmailAddress.transformToModel = convertToUpperStripped;
Mediation_EmailAddress.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
Mediation_EmailAddress.validateOn = [XPathConstants.MASTERGRID_CHANGED];
Mediation_EmailAddress.validate = function()
{
	return CaseManValidationHelper.validatePattern(Services.getValue(Mediation_EmailAddress.dataBinding), CaseManValidationHelper.EMAIL_PATTERN, "CaseMan_invalidEmailAddress_Msg");
}

/*********************************************************************************/

function Mediation_Availability() {}
Mediation_Availability.tabIndex = 663;
Mediation_Availability.maxLength = 2000;
Mediation_Availability.helpText = "Mediation availability notes";
Mediation_Availability.transformToDisplay = convertToUpper;
Mediation_Availability.transformToModel = convertToUpperStripped;
Mediation_Availability.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];

/*********************************************************************************/

function Mediation_Notes() {}
Mediation_Notes.tabIndex = 664;
Mediation_Notes.maxLength = 2000;
Mediation_Notes.helpText = "Additional mediation information";
Mediation_Notes.transformToDisplay = convertToUpper;
Mediation_Notes.transformToModel = convertToUpperStripped;
Mediation_Notes.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];

/*********************************************************************************/

function ParticularsOfClaim_Details() {}
ParticularsOfClaim_Details.tabIndex = 3000;
ParticularsOfClaim_Details.maxLength = 2000;
ParticularsOfClaim_Details.helpText = "Particulars of claim";
ParticularsOfClaim_Details.transformToDisplay = convertToUpper;
ParticularsOfClaim_Details.transformToModel = convertToUpperStripped;

/*********************************************************************************/

function DetailsOfClaim_DateRequestReceived() {}
DetailsOfClaim_DateRequestReceived.weekends = false;
DetailsOfClaim_DateRequestReceived.tabIndex = 4000;
DetailsOfClaim_DateRequestReceived.maxLength = 11;
DetailsOfClaim_DateRequestReceived.helpText = "Date when claim issue request received";
DetailsOfClaim_DateRequestReceived.componentName = "Date Request Received";
DetailsOfClaim_DateRequestReceived.readOnlyOn = [Header_CaseNumber.dataBinding];
DetailsOfClaim_DateRequestReceived.isReadOnly = function()
{
	return ( isExistingCase() ) ? true : false;
}

DetailsOfClaim_DateRequestReceived.mandatoryOn = [Header_CaseType.dataBinding];
DetailsOfClaim_DateRequestReceived.isMandatory = function()
{
	return ( isMagsOrder() ) ? false : true;
}

DetailsOfClaim_DateRequestReceived.isTemporary = function()
{
	if ( FormVariables.DETAILSOFCLAIM_FIELDS_TEMPORARY || isMagsOrder() )
	{
		return true;
	}
	return (Services.getValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent") == "true");
}

DetailsOfClaim_DateRequestReceived.validate = function()
{
	var ec = null;
	var value = Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding);
	var date = CaseManUtils.createDate(value);

	if ( null != date ) 
	{
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );

		// Check date is not in the future
		if ( CaseManUtils.compareDates(today, date) == 1 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		if ( null == ec )
		{
			// Check date is not on a bank holiday
			ec = validateNonWorkingDate(value);
		}
	}

	return ec;
}

DetailsOfClaim_DateRequestReceived.logicOn = [DetailsOfClaim_DateRequestReceived.dataBinding]
DetailsOfClaim_DateRequestReceived.logic = function(event)
{
	if ( event.getXPath() != DetailsOfClaim_DateRequestReceived.dataBinding )
	{
		return;
	}

	var value = Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding);	
	if ( isExistingCase() || CaseManUtils.isBlank(value) )
	{
		// Do nothing as field is read only if existing case or is blank
		return;
	}
	
	var date = CaseManUtils.createDate(value);
	if ( null != date ) 
	{
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		var monthAgo = CaseManUtils.oneMonthEarlier(today);

		// Check if date is more than 1 month in the past, if so give warning
		if (CaseManUtils.compareDates(monthAgo, date) == -1)
		{
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}	
	}
}

/*********************************************************************************/

function DetailsOfClaim_AmountClaimedCurrency() {}
DetailsOfClaim_AmountClaimedCurrency.tabIndex = -1;
DetailsOfClaim_AmountClaimedCurrency.maxLength = 3;
DetailsOfClaim_AmountClaimedCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_AmountClaimedCurrency.isTemporary = function() { return true; }
DetailsOfClaim_AmountClaimedCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

DetailsOfClaim_AmountClaimedCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

function DetailsOfClaim_AmountClaimed() {}
DetailsOfClaim_AmountClaimed.tabIndex = 4020;
DetailsOfClaim_AmountClaimed.maxLength = 11;
DetailsOfClaim_AmountClaimed.helpText = "Amount claimed by claimant";
DetailsOfClaim_AmountClaimed.componentName = "Amount Claimed";
DetailsOfClaim_AmountClaimed.isTemporary = function() { return true; }
DetailsOfClaim_AmountClaimed.validate = function()
{
	var value = Services.getValue(DetailsOfClaim_AmountClaimed.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value))
	{
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if ( null == errCode && value <= 0)
		{
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		}
		else if ( null == errCode && value >= 100000000)
		{
			errCode = ErrorCode.getErrorCode("CaseMan_maximumClaimedExceded_Msg");
		}
		
	}
	return errCode;
}

DetailsOfClaim_AmountClaimed.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

DetailsOfClaim_AmountClaimed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_CourtFeeCurrency() {}
DetailsOfClaim_CourtFeeCurrency.tabIndex = -1;
DetailsOfClaim_CourtFeeCurrency.maxLength = 3;
DetailsOfClaim_CourtFeeCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_CourtFeeCurrency.isTemporary = function() { return true; }
DetailsOfClaim_CourtFeeCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

DetailsOfClaim_CourtFeeCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

function DetailsOfClaim_CourtFee() {}
DetailsOfClaim_CourtFee.tabIndex = 4040;
DetailsOfClaim_CourtFee.maxLength = 7;
DetailsOfClaim_CourtFee.helpText = "The fee for issue of the claim";
DetailsOfClaim_CourtFee.componentName = "Court Fee";
DetailsOfClaim_CourtFee.isTemporary = function() { return true; }
DetailsOfClaim_CourtFee.validateOn = [DetailsOfClaim_AmountClaimed.dataBinding];
DetailsOfClaim_CourtFee.validate = function()
{
	var value = Services.getValue(DetailsOfClaim_CourtFee.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value))
	{
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if ( null == errCode && value < 0)
		{
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		}
	}
	
	if ( null == DetailsOfClaim_AmountClaimed.validate() )
	{
		var maximum = calculateMaximumCourtFee();
		if ( null == errCode && parseFloat(value) > maximum )
		{
			// This error message is variable so it needs modifying
			errCode = ErrorCode.getErrorCode("CaseMan_maximumFeeExceded_Msg");
			var currencyCode = Services.getValue(DetailsOfClaim_CourtFeeCurrency.dataBinding);
			var currencySymbol = CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
			errCode.m_message = errCode.m_message.replace(/XXX/, currencySymbol + parseFloat(maximum).toFixed(2));
		}
	}
	return errCode;
}

DetailsOfClaim_CourtFee.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

DetailsOfClaim_CourtFee.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_SolicitorsCostsCurrency() {}
DetailsOfClaim_SolicitorsCostsCurrency.tabIndex = -1;
DetailsOfClaim_SolicitorsCostsCurrency.maxLength = 3;
DetailsOfClaim_SolicitorsCostsCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_SolicitorsCostsCurrency.isTemporary = function() { return true; }
DetailsOfClaim_SolicitorsCostsCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

DetailsOfClaim_SolicitorsCostsCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

function DetailsOfClaim_SolicitorsCosts() {}
DetailsOfClaim_SolicitorsCosts.tabIndex = 4060;
DetailsOfClaim_SolicitorsCosts.maxLength = 7;
DetailsOfClaim_SolicitorsCosts.helpText = "Costs on issue of the claim";
DetailsOfClaim_SolicitorsCosts.componentName = "Solicitor's Costs";
DetailsOfClaim_SolicitorsCosts.isTemporary = function() { return true; }
DetailsOfClaim_SolicitorsCosts.validate = function()
{
	var value = Services.getValue(DetailsOfClaim_SolicitorsCosts.dataBinding);
	var errCode = null;
	if (!CaseManUtils.isBlank(value))
	{
		errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if ( null == errCode && value < 0)
		{
			errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");
		}
		else if ( null == errCode && value >= 10000)
		{
			errCode = ErrorCode.getErrorCode("CaseMan_maximumSolicitorsCostsExceded_Msg");
		}
	}
	return errCode;
}

DetailsOfClaim_SolicitorsCosts.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

DetailsOfClaim_SolicitorsCosts.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_TotalCurrency() {}
DetailsOfClaim_TotalCurrency.tabIndex = -1;
DetailsOfClaim_TotalCurrency.maxLength = 3;
DetailsOfClaim_TotalCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_TotalCurrency.isTemporary = function() { return true; }
DetailsOfClaim_TotalCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

DetailsOfClaim_TotalCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

function DetailsOfClaim_Total() {}
DetailsOfClaim_Total.tabIndex = -1;
DetailsOfClaim_Total.helpText = "Total costs";
DetailsOfClaim_Total.componentName = "Total Costs";
DetailsOfClaim_Total.isReadOnly = function() { return true; }
DetailsOfClaim_Total.isTemporary = function() { return true; }
DetailsOfClaim_Total.transformToDisplay = function(value)
{
	return CaseManUtils.isBlank(value) ? "0.00" : parseFloat(value).toFixed(2);
}

DetailsOfClaim_Total.transformToModel = function(value)
{
	return CaseManUtils.isBlank(value) ? "0.00" : parseFloat(value).toFixed(2);
}

DetailsOfClaim_Total.logicOn = [DetailsOfClaim_AmountClaimed.dataBinding, DetailsOfClaim_CourtFee.dataBinding, DetailsOfClaim_SolicitorsCosts.dataBinding];
DetailsOfClaim_Total.logic = function(event)
{
	var evtXPath = event.getXPath();
	if (evtXPath == DetailsOfClaim_AmountClaimed.dataBinding ||
		evtXPath == DetailsOfClaim_CourtFee.dataBinding ||
		evtXPath == DetailsOfClaim_SolicitorsCosts.dataBinding)
	{
		// Add up the total of the fees
		var value = 0;
		for (var i=0; i<DetailsOfClaim_Total.logicOn.length; i++)
		{
			var temp = Services.getValue(DetailsOfClaim_Total.logicOn[i]);
			if ( !CaseManUtils.isBlank(temp) && !isNaN(temp) )
			{
				value = value + parseFloat(temp);
			}
		}
		Services.setValue(DetailsOfClaim_Total.dataBinding, value);
	}
}

/*********************************************************************************/

function DetailsOfClaim_DateOfIssue() {}
DetailsOfClaim_DateOfIssue.weekends = false;
DetailsOfClaim_DateOfIssue.tabIndex = 4090;
DetailsOfClaim_DateOfIssue.maxLength = 11;
DetailsOfClaim_DateOfIssue.helpText = "The date claim issued";
DetailsOfClaim_DateOfIssue.componentName = "Date of Issue";
DetailsOfClaim_DateOfIssue.mandatoryOn = [Header_CaseType.dataBinding];
DetailsOfClaim_DateOfIssue.isMandatory = function()
{
	if ( isMagsOrder() )
	{
		return false;
	}
	return true;
}

DetailsOfClaim_DateOfIssue.isTemporary = function()
{
	if ( FormVariables.DETAILSOFCLAIM_FIELDS_TEMPORARY || isMagsOrder() )
	{
		return true;
	}
	return (Services.getValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent") == "true");
}

DetailsOfClaim_DateOfIssue.readOnlyOn = [Header_CaseNumber.dataBinding];
DetailsOfClaim_DateOfIssue.isReadOnly = function()
{
	return ( isExistingCase() );
}


DetailsOfClaim_DateOfIssue.validateOn = [DetailsOfClaim_DateRequestReceived.dataBinding];
DetailsOfClaim_DateOfIssue.validate = function()
{
	var ec = null;
	var value = Services.getValue(DetailsOfClaim_DateOfIssue.dataBinding);
	var date = CaseManUtils.createDate(value);

	if ( null != date ) 
	{
		// Check for a future date
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		if( CaseManUtils.compareDates(today, date) > 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		// Must have a valid value in the date request received field for us to perform the next check
		else if (!CaseManUtils.isBlank(Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding)) &&
			Services.getAdaptorById("DetailsOfClaim_DateRequestReceived").getValid() )
		{
			// Check that this date is not earlier than the date requested
			var dateRequested = CaseManUtils.createDate(Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding).toUpperCase());
			if( CaseManUtils.compareDates(dateRequested, date) < 0 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_issueDateBeforeRequestDate_Msg");
			}
		}
	}

	if( null == ec ) 
	{
		ec = validateNonWorkingDate(value);
	}	
	
	return ec;
}

/*********************************************************************************/

function Notification_Date() {}
Notification_Date.weekends = false;
Notification_Date.tabIndex = 7000;
Notification_Date.helpText = "Please enter the notification date";
Notification_Date.isTemporary =  function() { return true; }
Notification_Date.isMandatory = function() { return true; }
Notification_Date.validate = function()
{
	var ec = null;
	var value = Services.getValue(Notification_Date.dataBinding);

	var dateObject = CaseManUtils.createDate(value);
	if ( null != dateObject ) 
	{
		// Check for a future date
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		var monthAgo = CaseManUtils.oneMonthEarlier(today);

		// Check if date is more than 1 month in the past, if so give warning
		if (CaseManUtils.compareDates(monthAgo, dateObject) == -1)
		{
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}

		// Check date is not in the future
		if (CaseManUtils.compareDates(today, dateObject) == 1)
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		if ( null == ec )
		{
			// Check date is not on a bank holiday
			ec = validateNonWorkingDate(value);
		}
	}

	return ec;
}

/******************************** BUTTONS *****************************************/

function Header_CaseTypeLOVButton() {}
Header_CaseTypeLOVButton.tabIndex = 21;
Header_CaseTypeLOVButton.enableOn = [XPathConstants.MASTERGRID_CHANGED, Header_CaseNumber.dataBinding,XPathConstants.CASE_STATUS, Header_CaseType.dataBinding, Header_OwningCourtCode.dataBinding];
Header_CaseTypeLOVButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
		 null != Header_CaseNumber.validate() )
	{
		return false;
	}
	if ( isExistingCase() || isMagsOrder() || isCCBCCase() )
	{ 
		return false;
	}
	
	// If there are any parties linked to this case, you cannot change the case type
	if(Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*") > 0)
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function Header_OwningCourtLOVButton() {}
Header_OwningCourtLOVButton.tabIndex = 15;
Header_OwningCourtLOVButton.enableOn = Header_OwningCourtCode.enableOn;
Header_OwningCourtLOVButton.isEnabled = function()
{
	return Header_OwningCourtCode.isEnabled() && !Header_OwningCourtCode.isReadOnly();
}
Header_OwningCourtLOVButton.actionBinding = function()
{
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_OwningCourtCode.dataBinding);
    Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_OwningCourtLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_OwningCourtCode" }, { key: Key.F6, element: "Header_OwningCourtName" } ]
	}
};

/*********************************************************************************/

function Header_PreferredCourtLOVButton() {}
Header_PreferredCourtLOVButton.tabIndex = 25;
Header_PreferredCourtLOVButton.enableOn = Header_PreferredCourtCode.enableOn;
Header_PreferredCourtLOVButton.isEnabled = function()
{
	return Header_PreferredCourtCode.isEnabled();
}
Header_PreferredCourtLOVButton.actionBinding = function()
{
    Services.setValue(XPathConstants.LOVCOURT_DESTINATION_XPATH, Header_PreferredCourtCode.dataBinding);
    Services.dispatchEvent("CourtsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
}
Header_PreferredCourtLOVButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F6, element: "Header_PreferredCourtCode" }, { key: Key.F6, element: "Header_PreferredCourtName" } ]
	}
};

/*********************************************************************************/

function Header_ParticularsOfClaimButton() {}
Header_ParticularsOfClaimButton.tabIndex = 32;
Header_ParticularsOfClaimButton.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,XPathConstants.DATA_XPATH + "/ParticularsOfClaimPresent"];
Header_ParticularsOfClaimButton.isEnabled = function()
{
	// Disabled if no case is loaded or not creating a new case
	if ( CaseManUtils.isBlank( Services.getValue(Header_CaseNumber.dataBinding) ) || 
	 	 CaseManUtils.isBlank( Services.getValue(Header_CaseType.dataBinding) ) ||
		 CaseManUtils.isBlank( Services.getValue(Header_OwningCourtCode.dataBinding) ) ||
		 isMagsOrder() )
	{
		return false;
	}
	
	// Enabled if a CCBC Case or existing particulars of claim details exist
	if ( isCCBCCase() || Services.getValue(XPathConstants.DATA_XPATH + "/ParticularsOfClaimPresent") == "true" )
	{
		return true;
	}

	// For all other cirmcumstances, the button is disabled
	return false;
}

/*********************************************************************************/

function Master_AddPartyButton() {};

Master_AddPartyButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "createUpdateCase" } ]
	}
};

Master_AddPartyButton.tabIndex = 120;
/**
 * @author rzxd7g
 * @return null 
 */
Master_AddPartyButton.actionBinding = function ()
{
	var myPartyTypeId = Services.getValue(Master_PartyType.dataBinding);
	if ( CaseManUtils.isBlank(myPartyTypeId) )
	{
		// No party type selected
		alert(Messages.VALIDPARTYTYPE_MESSAGE);
		return;
	}

	// Check that this will not exceed the maximum number of this type of party
	var xpath = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = " + Master_PartyType.dataBinding + "]";
	var count = Services.countNodes(xpath);
	xpath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding
			+ "]/AllowedPartyRoles/PartyRole[./Code = '" + myPartyTypeId + "']/NumberAllowed";

	var maximum = Services.getValue(xpath);
	if( maximum != "*" && count >= maximum ) 
	{
		// We have reached the maximum of this party type, so don't let them add it
		var message = Messages.MAX_PARTIES_EXCEEDED_MESSAGE.replace(/XXX/, maximum);
		alert(message);
		return;
	}

	// A DOM that contains the elements for an empty new party
	var newParty = Services.loadDOMFromURL("NewLitigiousParty.xml");
	var myPartyTypeName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/PartyRoles/PartyRole[./Code=" + Master_PartyType.dataBinding + "]/Description");
	var surrogateId = getNextSurrogateKey();

	// Set default values
	XML.setElementTextContent(newParty, "/LitigiousParty/SurrogateId", surrogateId);
	XML.setElementTextContent(newParty, "/LitigiousParty/Type", myPartyTypeName);
	XML.setElementTextContent(newParty, "/LitigiousParty/TypeCode", myPartyTypeId);		
	XML.setElementTextContent(newParty, "/LitigiousParty/ContactDetails/TranslationToWelsh", "N");
	XML.setElementTextContent(newParty, "/LitigiousParty/ContactDetails/PreferredCommunicationMethod", FormConstants.DEFAULT_COMM_METHOD);
	XML.setElementTextContent(newParty, "/LitigiousParty/Number", getNextPartyNumber(myPartyTypeId) );
	XML.setElementTextContent(newParty, "/LitigiousParty/ContactDetails/Address/DateFrom", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	XML.setElementTextContent(newParty, "/LitigiousParty/ContactDetails/Address/CreatedBy", Services.getCurrentUser());
	XML.setElementTextContent(newParty, "/LitigiousParty/Status", FormConstants.STATUS_NEW);
	XML.setElementTextContent(newParty, "/LitigiousParty/DateOfServiceUpdated", "N");

	if ( myPartyTypeId == PartyTypeCodesEnum.CLAIMANT )
	{
		XML.setElementTextContent(newParty, "/LitigiousParty/SolicitorPayee", "N");
	}
	
	// Add the entire party branch to the parties node
	Services.startTransaction();
	Services.addNode(newParty, XPathConstants.DATA_XPATH + "/Parties");
							
	// Force the master grid to select the newly added party
	Services.setValue(masterGrid.dataBinding, surrogateId);
	
	// Force the solicitor select list to have no default selection
	Services.setValue(LitigiousParty_SelectSolicitor.dataBinding, null);
	
	if ( myPartyTypeId == PartyTypeCodesEnum.DEFENDANT || myPartyTypeId == PartyTypeCodesEnum.PART_20_DEFENDANT )
	{
		// Temp_CaseMan defect 292 - need to store the original value for the date of service in case select
		// Cancel in are you sure question.
		Services.setValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/OriginalDateOfService", "");
	}
	Services.endTransaction();
	
	// Set the focus into the name field of the new party
	Services.setFocus("LitigiousParty_Name");	
}

Master_AddPartyButton.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding, XPathConstants.CASE_STATUS];
Master_AddPartyButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if ( isExistingCase() && isMagsOrder() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function Master_RemovePartyButton() {};

Master_RemovePartyButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "createUpdateCase", alt: true } ]
	}
};

Master_RemovePartyButton.tabIndex = 130;
/**
 * @author rzxd7g
 * 
 */
Master_RemovePartyButton.actionBinding = function()
{
	Services.startTransaction();
	
	var partyType = getCurrentlySelectedPartyTypeCode();
	if (partyType == PartyTypeCodesEnum.SOLICITOR )
	{		
	    // We need to check and see if the solicitor represents any LPs before we remove the solicitor	
	    // Set the xpath to get all litigious parties represented by this solicitor
	    xpath = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./SolicitorSurrogateId = " + masterGrid.dataBinding + "]/Name";
	
	    // Get the list of litigious parties
	    var namesList = Services.getNodes(xpath);
   		// The solicitor represents other parties so do not remove
	    if (namesList.length > 0)
	    {
			// Create the string that contains the parties represented
		    var partyNames = "";
		    
	    	for (var i = 0; i < namesList.length; i ++)
	    	{
	    		partyNames = partyNames + "\n" + XML.getNodeTextContent(namesList[i]);
	    	}
			alert(Messages.REMOVESOLICITOR_MESSAGE + partyNames);
		}
		else
		{
			// Set up the xpath which points to the solicitor to remove
			var solicitorXPath = XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]";
			// Remove
			Services.removeNode(solicitorXPath);		
		}
	}
	else
	{
		// Set up the xpath which points to the litigious party to remove
		litigiousPartyXPath = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]";				
		Services.removeNode(litigiousPartyXPath);
		
		// Party removed was the only one, reset tabbed panel
		if ( Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*") == 0 )
		{
			/**/
			Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH, FormConstants.DISABLED);		
			Services.setValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL, FormConstants.LITIGIOUS_PARTY_LABEL);
		}
	}
	
	Services.endTransaction();
}

Master_RemovePartyButton.enableOn = [XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding, XPathConstants.CASE_STATUS];
Master_RemovePartyButton.isEnabled = function()
{	
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if (isExistingCase() && isMagsOrder())
	{
		return false;
	}
	return Services.getValue(XPathConstants.REMOVE_PARTY_BUTTON_ENABLER_XPATH) == FormConstants.ENABLED ? true : false;; 
}

/*********************************************************************************/

function LitigiousParty_AddAddressButton() {};
LitigiousParty_AddAddressButton.tabIndex = 420;
LitigiousParty_AddAddressButton.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Code.dataBinding,LitigiousParty_Name.dataBinding, XPathConstants.CASE_STATUS];
LitigiousParty_AddAddressButton.isEnabled = function()
{
	if (!isPartyFieldEnabled() || !isExistingParty() ||
		(isMagsOrder() && getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.CLAIMANT) )
	{
		return false;
	}
	
	if(CaseManUtils.isBlank(Services.getValue(LitigiousParty_Code.dataBinding))
		&& !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding)))
	{
		return true;
	}
	return false;
}

/**********************************************************************************/

function LitigiousParty_ViewHistoricalAddressesButton() {};
LitigiousParty_ViewHistoricalAddressesButton.tabIndex = 430;
LitigiousParty_ViewHistoricalAddressesButton.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Code.dataBinding,LitigiousParty_Name.dataBinding,LitigiousParty_ContactDetails_Address_Line1.dataBinding];
LitigiousParty_ViewHistoricalAddressesButton.isEnabled = function()
{
	if (!isPartyFieldEnabled() || CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding)))
	{
		return false;
	}
	if (!CaseManUtils.isBlank(Services.getValue(LitigiousParty_Code.dataBinding)))
	{
		return false;
	}
	if (Services.countNodes(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/HistoricalAddresses/Address") == 0)
	{
		return false;
	}
	return true;
}

/**********************************************************************************/

function LitigiousParty_AddSolicitorButton() {}
LitigiousParty_AddSolicitorButton.tabIndex = 410;
LitigiousParty_AddSolicitorButton.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_AddSolicitorButton.isEnabled = function()
{
	if ( isMagsOrder() )
	{
		return false;
	}
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/**********************************************************************************/

function Footer_DetailsOfClaimButton() {};
Footer_DetailsOfClaimButton.tabIndex = 700;
Footer_DetailsOfClaimButton.labelOn=[XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent"];
/**
 * @author rzxd7g
 * @return "Update Details" , "Add Details"  
 */
Footer_DetailsOfClaimButton.label = function()
{
	if (Services.getValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent") == "true")
	{
		return "Update Details";
	}
	return "Add Details";
}

Footer_DetailsOfClaimButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Footer_DetailsOfClaimButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return enableButton("Footer_DetailsOfClaimButton");
}

/*********************************************************************************/

function Footer_HearingDetailsButton() {};
Footer_HearingDetailsButton.tabIndex = 710;
Footer_HearingDetailsButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,XPathConstants.CASE_STATUS];
Footer_HearingDetailsButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if ( isExistingCase() )
	{
		return false;
	}	
	return enableButton("Footer_HearingDetailsButton");
}

/*********************************************************************************/

function Footer_OtherPossessionAddressButton() {};
Footer_OtherPossessionAddressButton.tabIndex = 720;
Footer_OtherPossessionAddressButton.labelOn=[XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent"];
/**
 * @author rzxd7g
 * @return "Update Details" , "Add Details"  
 */
Footer_OtherPossessionAddressButton.label = function()
{
	if (Services.getValue(XPathConstants.DATA_XPATH + "/OtherPossessionAddressPresent") == "true")
	{
		return "Update Details";
	}
	return "Add Details";
}

Footer_OtherPossessionAddressButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Footer_OtherPossessionAddressButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	return enableButton("Footer_OtherPossessionAddressButton");
}

/*********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "createUpdateCase" } ]
	}
};

Status_SaveButton.tabIndex = 800;
/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	Services.startTransaction();

	// Remove the new unlinked solicitors from the list
	var xpath = XPathConstants.DATA_XPATH + "/Parties/Solicitor[not (./SurrogateId = " + XPathConstants.DATA_XPATH + "/Parties/LitigiousParty/SolicitorSurrogateId) and ./PartyId = '']";
	Services.removeNode(xpath);

	// Reorder the new parties so no gaps
	reorderNewParties(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty");
	reorderNewParties(XPathConstants.DATA_XPATH + "/Parties/Solicitor");

	// Check for the mandatory party types
	xpath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/AllowedPartyRoles/PartyRole[./Mandatory = 'true']/Code";
	var mandatoryParties = Services.getNodes(xpath);
	xpath = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty/TypeCode";
	var nodes = Services.getNodes(xpath);
	var error = null;
	
	for( var i = 0; i < mandatoryParties.length; i++ ) 
	{
		var mandatoryParty = XML.getNodeTextContent(mandatoryParties[i]);
		var found = false;
		for( var j = 0; j < nodes.length; j++ ) 
		{
			var text = XML.getNodeTextContent(nodes[j]);
			if(text == mandatoryParty) 
			{
				found = true;
			}
		}
		if (!found) 
		{
			// A mandatory party is missing.  Select the error message based on the case type
			var caseType = Services.getValue(Header_CaseType.dataBinding);
			if ( caseType == CaseManUtils.INSOLV_CASETYPE_CREDPET || 
				 caseType == CaseManUtils.INSOLV_CASETYPE_DEBTPET ||
				 caseType == CaseManUtils.INSOLV_CASETYPE_APPONDEBTPET ||
				 caseType == CaseManUtils.INSOLV_CASETYPE_APPINTORD ) 
			{
				alert(Messages.MISSING_DEBTOR_MESSAGE);
			}
			else if( caseType == CaseManUtils.INSOLV_CASETYPE_WINPET || caseType == CaseManUtils.INSOLV_CASETYPE_COMPANYADMINORDER ) 
			{
				alert(Messages.MISSING_COMPANY_MESSAGE);
			}
			else if( caseType == CaseManUtils.INSOLV_CASETYPE_APPSETSTATDEMD ) 
			{
				alert(Messages.MISSING_APPLICANT_MESSAGE);
			} 
			else 
			{
				alert(Messages.MISSING_PARTIES_MESSAGE);
			}
			Services.endTransaction();
			return;
		}
	}
	
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 == invalidFields.length )
	{
		// Ensure the correct Date of Issue is passed to the Event 200
		if ( Services.exists(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./StandardEventId = " + EventConstants.CREATE_HEARING_EVENT + "]") )
		{
			var dateReqRec = Services.getValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateRequestReceived");
			Services.setValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./StandardEventId = " + EventConstants.CREATE_HEARING_EVENT + "]/ReceiptDate", dateReqRec);
		}
		
		// UCT_Group2 Defect 1365 - Set the Creditor Code field for CCBC Cases
		var currentCreditorCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
		if ( isCCBCCase() && currentCreditorCode != CaseManUtils.MCOL_CRED_CODE )
		{
			// Non MCOL CCBC Case, set the Creditor code to whatever the national coded party solicitor is
			var claimOneSol = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.CLAIMANT + "' and ./Number = 1]/SolicitorSurrogateId");
			var credCode = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + "'" + claimOneSol + "']/Code");
			Services.setValue(XPathConstants.DATA_XPATH + "/CreditorCode", credCode);
		}
		
		// Call a different service depending upon whether adding or updating a case
		var s = Services.getValue(XPathConstants.CASE_STATUS);
		var serviceName = "addCase";
		if ( s == FormConstants.STATUS_EXISTING )
		{
			serviceName = "updateCase";

			// Display warning message if claimant with payee of N has been updated on an existing case with payments
			var paymentsExists = Services.getValue(XPathConstants.DATA_XPATH + "/PaymentsExist");
			var claimantChangesMade = Services.getValue(XPathConstants.CLAIMANT_CHANGES_MADE_XPATH);
			if ( claimantChangesMade == "Y" && paymentsExists == "true" )
			{
				alert(Messages.UPDATE_PAYMENTPAYEE_MESSAGE);
			}
		}
		
		// Make service call
		var newDOM = XML.createDOM(null, null, null);
		var mcNode = Services.getNode(XPathConstants.DATA_XPATH);
		var dsNode = XML.createElement(newDOM, "ds");
		dsNode.appendChild(mcNode);
		newDOM.appendChild(dsNode);
		var params = new ServiceParams();
		params.addDOMParameter("caseNumber", newDOM);
		Services.callService(serviceName, params, Status_SaveButton, true);
	}
	
	Services.endTransaction();
};

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName)
{
	if ( null != dom )
	{
		// Put a success message in the status bar
		Services.setTransientStatusBarMessage("Changes saved.");
		
		if (serviceName == "addCase")
		{
			// Put the navigation list in the DOM
			Services.replaceNode(XPathConstants.NAVIGATIONLIST_XPATH, dom);
			
			var NavWP = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/NavigateTo/WordProcessing");
			var NavAE = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/NavigateTo/AttachmentOfEarnings");
			
			if ( NavWP == "true" )
			{
				// Normal Case, Make call to WP Controller
				var wpDOM = XML.createDOM(null, null, null);
				
				Services.setValue(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/WordProcessing/Request", "Create");
				
				var hearingCreated = Services.exists(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./StandardEventId = '" + EventConstants.CREATE_HEARING_EVENT + "']");
				if ( hearingCreated )
				{
					Services.setValue(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/WordProcessing/HearingCreated", "true");
				}
				
				var wpNode = Services.getNode(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/WordProcessing");
				wpDOM.appendChild( wpNode );
				WP.ProcessWP(FormController.getInstance(), wpDOM, NavigationController.CASES_FORM);
	
				// Clear out the case number, this will cause the form to be reset
				Services.setValue(Header_CaseNumber.dataBinding, "");
				Services.setFocus("Header_CaseNumber");
			}
			else if ( NavAE == "true" )
			{
				// MAGS ORDER Case, navigate to Create/Maintain AE
				var caseNumber = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/AttachmentOfEarnings/CaseNumber");
				Services.setValue(ManageAEParams.CASE_NUMBER, caseNumber);
				var navArray = Array(NavigationController.MANAGE_AE_FORM, NavigationController.CASES_FORM);
				NavigationController.createCallStack( navArray );
				NavigationController.nextScreen();
			}
			else
			{
				// Clear out the case number, this will cause the form to be reset
				Services.setValue(Header_CaseNumber.dataBinding, "");
				Services.setFocus("Header_CaseNumber");
			}
		}
		else if (serviceName == "updateCase")
		{
			if ( !CaseManUtils.isBlank(PostSaveActions.ACTION_AFTER_SAVE) )
			{
				postSaveHandler();
			}
			else
			{
				var caseNumber = XML.getNodeTextContent( dom.selectSingleNode(XPathConstants.DATA_XPATH + "/CaseNumber") );
				loadCaseData(caseNumber);
			}
		}
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
		Services.setValue(XPathConstants.CLAIMANT_CHANGES_MADE_XPATH, "N");
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
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
 * @author rzxd7g
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
 * @author rzxd7g
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/*********************************************************************************/

function Status_ClearButton() {}
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "createUpdateCase", alt: true } ]
	}
};
Status_ClearButton.tabIndex = 810;
/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_CLEARFORM;
		Status_SaveButton.actionBinding();
	}
	else
	{
		handleClearForm();
	}
};

/*********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "createUpdateCase" } ]
	}
};
Status_CloseButton.tabIndex = 820;
/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.actionBinding = function()
{
	checkChangesMadeBeforeExit();
};

/**********************************************************************************/

function LitigiousParty_CodeLOVButton() {};
LitigiousParty_CodeLOVButton.tabIndex = 230;
LitigiousParty_CodeLOVButton.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
LitigiousParty_CodeLOVButton.isEnabled = function()
{ 
	if ( !isPartyFieldEnabled() || ((isExistingCase()) && (isMagsOrder())))
	{
		return false;
	}

	var code = getCurrentlySelectedPartyTypeCode();
	// Disabled if party type is Defendant, Debtor, Applicant, the Company or is a Claimant for a CCBC Case
	return ( isCCBCCase() && code == PartyTypeCodesEnum.CLAIMANT ) 
		|| ( code == PartyTypeCodesEnum.DEFENDANT )
		|| ( code == PartyTypeCodesEnum.DEBTOR ) 
		|| ( code == PartyTypeCodesEnum.APPLICANT )
		|| ( code == PartyTypeCodesEnum.THE_COMPANY ) ? false : true;
}

/**********************************************************************************/

function SolicitorParty_CodeLOVButton() {};
SolicitorParty_CodeLOVButton.tabIndex = 520;
SolicitorParty_CodeLOVButton.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
SolicitorParty_CodeLOVButton.isEnabled = function()
{
	if ( !isPartyFieldEnabled() )
	{
		return false;
	}
	
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		var partyStatus = Services.getValue(XPathConstants.SOLICITOR_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/Status");
		var code = Services.getValue(SolicitorParty_Code.dataBinding);
		if ( !isCCBCCase() && partyStatus == FormConstants.STATUS_EXISTING && CaseManUtils.isCCBCNationalCodedParty(code) )
		{
			// Disabled if the solicitor is an existing national coded party on a non CCBC court
			return false;
		}
		else
		{
			return true;
		}
	}
	
	// Disabled for litigious parties
	return false;
}

/**********************************************************************************/

function ParticularsOfClaim_CloseButton() {}
ParticularsOfClaim_CloseButton.tabIndex = 3010;

/*********************************************************************************/

function DetailsOfClaim_OkButton() {}
DetailsOfClaim_OkButton.tabIndex = 4100;
DetailsOfClaim_OkButton.validationList = ["DetailsOfClaim_DateRequestReceived","DetailsOfClaim_AmountClaimed","DetailsOfClaim_CourtFee","DetailsOfClaim_SolicitorsCosts","DetailsOfClaim_DateOfIssue"];
/**
 * @author rzxd7g
 * 
 */
DetailsOfClaim_OkButton.actionBinding = function()
{
	Services.startTransaction();
	
	var validFields = CaseManValidationHelper.validateFields(DetailsOfClaim_OkButton.validationList);
	if ( validFields )
	{
		// Copy the data accross from the temporary area to the main part of the DOM.
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateRequestReceived", Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimedCurrency", Services.getValue(DetailsOfClaim_AmountClaimedCurrency.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/AmountClaimed", Services.getValue(DetailsOfClaim_AmountClaimed.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFeeCurrency", Services.getValue(DetailsOfClaim_CourtFeeCurrency.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/CourtFee", Services.getValue(DetailsOfClaim_CourtFee.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCostsCurrency", Services.getValue(DetailsOfClaim_SolicitorsCostsCurrency.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/SolicitorsCosts", Services.getValue(DetailsOfClaim_SolicitorsCosts.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/TotalCurrency", Services.getValue(DetailsOfClaim_TotalCurrency.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/Total", Services.getValue(DetailsOfClaim_Total.dataBinding));
		Services.setValue(XPathConstants.DETAILS_OF_CLAIM_XPATH + "/DateOfIssue", Services.getValue(DetailsOfClaim_DateOfIssue.dataBinding));
		Services.setValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent", "true");
		
		// Set the last date of service for all defendants who do not yet have one
		var dateOfIssue = CaseManUtils.createDate( Services.getValue(DetailsOfClaim_DateOfIssue.dataBinding).toUpperCase() );
		var newDate = CaseManUtils.fourMonthsInFuture(dateOfIssue, LitigiousParty_LastDateForService.weekends);
		var xpath = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = \"" + PartyTypeCodesEnum.DEFENDANT + "\"]";
		var defendantList = Services.getNodes(xpath);
		for(i = 0; i < defendantList.length; i++)
		{
			var element = defendantList[i].getElementsByTagName("LastDateForService").item(0);
			var lastDateForService = null;
			if( null != element.firstChild )
			{
				lastDateForService = element.firstChild.nodeValue;
			}
			
			if(CaseManUtils.isBlank(lastDateForService))
			{
				element = defendantList[i].getElementsByTagName("SurrogateId");
				var surrogateId = element.item(0).firstChild.nodeValue;

				Services.setValue(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[SurrogateId = \"" + surrogateId + "\"]/LastDateForService", CaseManUtils.convertDateToPattern(newDate, CaseManUtils.DATE_MODEL_FORMAT));
			}
		}
		
		setChangesMade();
		Services.dispatchEvent("Details_Of_Claim_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	}
	
	Services.endTransaction();
}

DetailsOfClaim_OkButton.enableOn = [DetailsOfClaim_DateRequestReceived.dataBinding,DetailsOfClaim_AmountClaimed.dataBinding,DetailsOfClaim_CourtFee.dataBinding,DetailsOfClaim_SolicitorsCosts.dataBinding,DetailsOfClaim_DateOfIssue.dataBinding]
DetailsOfClaim_OkButton.isEnabled = function()
{
	// The ok button is only enabled when the mandatory fields are filled in
	if (CaseManUtils.isBlank(Services.getValue(DetailsOfClaim_DateRequestReceived.dataBinding))
	 || CaseManUtils.isBlank(Services.getValue(DetailsOfClaim_DateOfIssue.dataBinding)))
	{
		return false;
	}

	var validFields = CaseManValidationHelper.validateFields(DetailsOfClaim_OkButton.validationList);
	return validFields;
}

/*********************************************************************************/

function DetailsOfClaim_CancelButton() {}
DetailsOfClaim_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Details_Of_Claim_Popup" } ]
	}
};
DetailsOfClaim_CancelButton.tabIndex = 4110;
/**
 * @author rzxd7g
 * 
 */
DetailsOfClaim_CancelButton.actionBinding = function()
{
	Services.startTransaction();	
	if (Services.getValue(XPathConstants.DATA_XPATH + "/DetailsOfClaimPresent") == "false")
	{
		Services.setValue(DetailsOfClaim_DateRequestReceived.dataBinding, "");
		Services.setValue(DetailsOfClaim_AmountClaimedCurrency.dataBinding, "");
		Services.setValue(DetailsOfClaim_AmountClaimed.dataBinding, "");
		Services.setValue(DetailsOfClaim_CourtFeeCurrency.dataBinding, "");
		Services.setValue(DetailsOfClaim_CourtFee.dataBinding, "");
		Services.setValue(DetailsOfClaim_SolicitorsCostsCurrency.dataBinding, "");
		Services.setValue(DetailsOfClaim_SolicitorsCosts.dataBinding, "");
		Services.setValue(DetailsOfClaim_TotalCurrency.dataBinding, "");
		Services.setValue(DetailsOfClaim_Total.dataBinding, "");
		Services.setValue(DetailsOfClaim_DateOfIssue.dataBinding, "");
	}

	Services.dispatchEvent("Details_Of_Claim_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	Services.endTransaction();
}

/*********************************************************************************/

function Notification_CloseButton() {}
Notification_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Notification_Date_Popup" } ]
	}
};
Notification_CloseButton.tabIndex = 7010;
Notification_CloseButton.enableOn = [Notification_Date.dataBinding];
Notification_CloseButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(Notification_Date.dataBinding)) )
	{
		return false;
	}
	return Services.getAdaptorById("Notification_Date").getValid();
}

/**
 * @author rzxd7g
 * 
 */
Notification_CloseButton.actionBinding = function()
{
	Services.startTransaction();
	if (Notification_CloseButton.isEnabled())
	{
		// When click Close, take notification date in variables section, add a new CaseEvent under 
		// /ds/ManageCase/CaseEvents, add the event number, and clear the value in the 
		// variables section.
		var nDate = Services.getValue(Notification_Date.dataBinding);
		var eventId = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode");
		var partyId = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationPartyId");
		addNewCaseEvent(eventId, nDate, partyId);
		
		// Clear the old values
		Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationEventCode","");
		Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/NewNotificationPartyId","");
		setChangesMade();
		
		Services.dispatchEvent("Notification_Date_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	}
	Services.endTransaction();
};

/******************************* TAB PAGES ***************************************/

function firstPage() {};
firstPage.enableOn = [XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH, Header_CaseNumber.dataBinding, Header_CaseType.dataBinding, Header_OwningCourtCode.dataBinding, XPathConstants.MASTERGRID_CHANGED];
firstPage.isEnabled = function()
{
	// Check status of Case
	if ( !isPartyFieldEnabled() )
	{
		return false;
	}
	
	var enabler = Services.getValue(XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH);
	return ( enabler == FormConstants.DISABLED ) ? false : true;
}

firstPage.labelOn = [XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL];
/**
 * @author rzxd7g
 * @return FormConstants.LITIGIOUS_PARTY_LABEL , Services.getValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL)  
 */
firstPage.label = function()
{
	if( CaseManUtils.isBlank( Services.getValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL) ) )
	{
		return FormConstants.LITIGIOUS_PARTY_LABEL;
	}
	return Services.getValue(XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL);
}

/**********************************************************************************/

function secondPage() {};
secondPage.enableOn = [XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding, XPathConstants.MASTERGRID_CHANGED];
secondPage.isEnabled = function()
{
	// Check status of Case
	if ( !isPartyFieldEnabled() )
	{
		return false;
	}

	var enabler = Services.getValue(XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH);
	return (enabler == FormConstants.DISABLED) ? false : true;
}

/**********************************************************************************/

function thirdPage() {};
thirdPage.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding, XPathConstants.MASTERGRID_CHANGED];
thirdPage.isEnabled = function()
{
	var blnEnabled = true;
	if ( !isPartyFieldEnabled() )
	{
		// Check status of Case
		blnEnabled = false;
	}
	else if ( isInsolvencyCase() )
	{
		// Mediation page is not available on insolvency cases
		blnEnabled = false;
	}
	else if (getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR)
	{
		// Mediation page is not available for solicitor parties
		blnEnabled = false;
	}
	return blnEnabled;
}

/******************************* LOGIC DIVS ***************************************/

/**
 * Logic object to populate the Party Select Solicitor list.  
 * When a party is selected in the master grid, the list is regenerated.  Claimants can only select
 * solicitors who are not representing Defendants and vice versa.  Other party types, e.g. Part 20
 * Parties can select all solicitors
 * @author rzxd7g
 * 
 */
function populateSolicitorListLogic() {}
populateSolicitorListLogic.logicOn = [ XPathConstants.MASTERGRID_CHANGED, SolicitorParty_Name.dataBinding, XPathConstants.DATA_XPATH + "/Parties", LitigiousParty_SelectSolicitor.dataBinding ];
populateSolicitorListLogic.logic = function(event)
{
	Services.startTransaction();
	
	// get the data model and the current selected party type.
	var dom = Services.getNode("/");

	var currentPartyType = getCurrentlySelectedPartyTypeCode();
	var xpath;
	if ( null != currentPartyType && currentPartyType != PartyTypeCodesEnum.SOLICITOR)  
	{
		// clear existing data
		Services.removeNode(LitigiousParty_SelectSolicitor.srcData);
		if ( currentPartyType == PartyTypeCodesEnum.CLAIMANT )
		{
			// set the xpath to get the list of solicitors who are not assigned to defendants
			xpath = XPathConstants.DATA_XPATH + "/Parties/Solicitor[not (./SurrogateId = " + XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.DEFENDANT + "']/SolicitorSurrogateId) and ./Status != '" + FormConstants.STATUS_REMOVED + "']";
		}
		else if ( currentPartyType == PartyTypeCodesEnum.DEFENDANT )
		{
			// set the xpath to get the list of solicitors who are not assigned to claimants
			xpath = XPathConstants.DATA_XPATH + "/Parties/Solicitor[not (./SurrogateId = " + XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./TypeCode = '" + PartyTypeCodesEnum.CLAIMANT + "']/SolicitorSurrogateId) and ./Status != '" + FormConstants.STATUS_REMOVED + "']";
		}
		else
		{
			// set the xpath to get all solicitors
			xpath = XPathConstants.DATA_XPATH + "/Parties/Solicitor[./Status != '" + FormConstants.STATUS_REMOVED + "']";
		}
		// get the list of solicitors
		var solicitorList = Services.getNodes(xpath);
		
		// No longer needed as select list has a default null value
		// add the solicitors to the dom (starting with a no solicitor value)
		//Services.setValue(LitigiousParty_SelectSolicitor.srcData + LitigiousParty_SelectSolicitor.rowXPath + "/SurrogateId", "");
		//Services.setValue(LitigiousParty_SelectSolicitor.srcData + LitigiousParty_SelectSolicitor.rowXPath + "/Name", "No Solicitor");
	
		for (var i = 0; i < solicitorList.length; i++)
		{
			var surrogateKey = solicitorList[i].getElementsByTagName("SurrogateId");
			var solicitorName = solicitorList[i].getElementsByTagName("Name");
			// ensure solicitor has a key and a name
			if (surrogateKey.length > 0 && solicitorName.length > 0)
			{
				// do the add
				var keyTextNode = surrogateKey.item(0).firstChild;
				var nameTextNode = solicitorName.item(0).firstChild;
			
				if ( null != keyTextNode && null != nameTextNode && keyTextNode.nodeValue != "" && nameTextNode.nodeValue != "")
				{
					var key = keyTextNode.nodeValue;
					var name = nameTextNode.nodeValue;
				
					var solicitor = XML.createElement(dom, "Solicitor");
					solicitor.appendChild(XML.createElement(solicitor, "SurrogateId"));
					solicitor.selectSingleNode("SurrogateId").appendChild(dom.createTextNode(key));
					solicitor.appendChild(XML.createElement(solicitor, "Name"));
					solicitor.selectSingleNode("Name").appendChild(dom.createTextNode(name));
				
					Services.addNode(solicitor, LitigiousParty_SelectSolicitor.srcData);
				}
			}
		}
	}
	
	Services.endTransaction();
}

/**********************************************************************************/

/**
 * Logic populates the party type select list based upon the selected case type
 * @author rzxd7g
 * 
 */
function populatePartyTypeListLogic() {}
populatePartyTypeListLogic.logicOn = [Header_CaseType.dataBinding, Header_OwningCourtCode.dataBinding];
populatePartyTypeListLogic.logic = function(event)
{
	if ( event.getXPath() == Header_OwningCourtCode.dataBinding && !isCCBCCase() )
	{
		// Only proceed if have changed the court to a CCBC court
		return;
	}

	// Get the case type
	var caseType = Services.getValue(Header_CaseType.dataBinding);
	if( CaseManUtils.isBlank(caseType) )
	{
		return;
	}

	Services.startTransaction();
	
	// Get the list of allowed party types for this case type
	if ( isCCBCCase() )
	{
		var allowedPartiesXPath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/AllowedPartyRoles/PartyRole[./CCBC = 'true']/Code";
	}
	else
	{
		var allowedPartiesXPath = XPathConstants.REF_DATA_XPATH + "/CaseTypeRules/CaseType[./Type = " + Header_CaseType.dataBinding + "]/AllowedPartyRoles/PartyRole/Code";
	}
	var xpath = XPathConstants.REF_DATA_XPATH + "/PartyRoles/PartyRole[./Code = " + allowedPartiesXPath + "]";

    // clear existing data
    Services.removeNode(Master_PartyType.srcData);

    // Get the list of parties from ref data
    var partyTypeList = Services.getNodes(xpath);

    // Add the party types to the dom
    for (var i = 0; i < partyTypeList.length; i++)
    {
    	var partyCode = partyTypeList[i].getElementsByTagName("Code");
    	var partyName = partyTypeList[i].getElementsByTagName("Description");

    	// Ensure party has a key and a name
		if (partyCode.length > 0 && partyName.length > 0)
		{
			// Get the textual data from the elements
        	var codeTextNode = partyCode.item(0).firstChild;
        	var nameTextNode = partyName.item(0).firstChild;

        	// Do the add	
        	if ( null != codeTextNode && null != nameTextNode &&
        		 codeTextNode.nodeValue != "" && nameTextNode.nodeValue != "")
        	{
          		var code = codeTextNode.nodeValue;
				var name = nameTextNode.nodeValue;
          		Services.setValue(Master_PartyType.srcData + Master_PartyType.rowXPath + "[." + Master_PartyType.keyXPath + " = '" + code + "']/Code", code);
          		Services.setValue(Master_PartyType.srcData + Master_PartyType.rowXPath + "[." + Master_PartyType.keyXPath + " = '" + code + "']/Description", name);
        	}
      	}
    }
    
    Services.endTransaction();
}

/**********************************************************************************/

/**
 * Logic sets the temporary flags for party and solicitor fields based upon certain circumstances
 * The flags will be used in the isTemporary functions which determine if fields should be validated
 * or checked on submit.
 * @author rzxd7g
 * 
 */
function makeFieldsTemporaryLogic() {}
makeFieldsTemporaryLogic.logicOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId"];
makeFieldsTemporaryLogic.logic = function(event)
{
	if (event.getXPath() != XPathConstants.MASTERGRID_CHANGED &&
		event.getXPath() != XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId" )
	{
		return;
	}

	if ( null == Services.getValue(masterGrid.dataBinding) )
	{
		// No party selected
		FormVariables.SOLICITOR_FIELDS_TEMPORARY = true;
		FormVariables.LITPARTY_FIELDS_TEMPORARY = true;
	}
	else
	{
		if (getCurrentlySelectedPartyTypeCode() != PartyTypeCodesEnum.SOLICITOR)
		{
			FormVariables.LITPARTY_FIELDS_TEMPORARY = false;
			if ( CaseManUtils.isBlank(Services.getValue(XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId")) )
			{
				// Litigious Party not represented
				FormVariables.SOLICITOR_FIELDS_TEMPORARY = true;
			}
			else
			{
				// Litigious Party that is represented
				FormVariables.SOLICITOR_FIELDS_TEMPORARY = false;			
			}
		}
		else
		{
			// Solicitor Party, set litigious party fields to temporary
			FormVariables.SOLICITOR_FIELDS_TEMPORARY = false;
			FormVariables.LITPARTY_FIELDS_TEMPORARY = true;
		}
	}
}

/**********************************************************************************/

/**
 * Logic to determine if changes are made on the screen so that the user can be prompted
 * when attempting to clear or navigate away from the screen with unsaved changes.
 * @author rzxd7g
 * 
 */
function updateDetailsLogic() {}
updateDetailsLogic.logicOn = [Header_CaseDetails.dataBinding, Header_PreferredCourtCode.dataBinding, Header_CaseAllocatedTo.dataBinding, LitigiousParty_Code.dataBinding, 
LitigiousParty_Name.dataBinding, LitigiousParty_ContactDetails_Address_Line1.dataBinding, LitigiousParty_ContactDetails_Address_Line2.dataBinding, 
LitigiousParty_ContactDetails_Address_Line3.dataBinding, LitigiousParty_ContactDetails_Address_Line4.dataBinding, LitigiousParty_ContactDetails_Address_Line5.dataBinding, 
LitigiousParty_ContactDetails_Address_Postcode.dataBinding, LitigiousParty_ContactDetails_DX.dataBinding, LitigiousParty_ContactDetails_TelephoneNumber.dataBinding, 
LitigiousParty_ContactDetails_FaxNumber.dataBinding, LitigiousParty_ContactDetails_EmailAddress.dataBinding, LitigiousParty_ContactDetails_TranslationToWelsh.dataBinding, 
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, LitigiousParty_Reference.dataBinding, LitigiousParty_DateOfService.dataBinding, 
LitigiousParty_LastDateForService.dataBinding, LitigiousParty_DateOfBirth.dataBinding, LitigiousParty_SelectSolicitor.dataBinding, LitigiousParty_Confidential.dataBinding, SolicitorParty_Code.dataBinding, 
SolicitorParty_Name.dataBinding, SolicitorParty_Reference.dataBinding, SolicitorParty_Payee.dataBinding, SolicitorParty_ContactDetails_Address_Line1.dataBinding, 
SolicitorParty_ContactDetails_Address_Line2.dataBinding, SolicitorParty_ContactDetails_Address_Line3.dataBinding, SolicitorParty_ContactDetails_Address_Line4.dataBinding, 
SolicitorParty_ContactDetails_Address_Line5.dataBinding, SolicitorParty_ContactDetails_Address_Postcode.dataBinding, SolicitorParty_ContactDetails_DX.dataBinding, 
SolicitorParty_ContactDetails_TelephoneNumber.dataBinding, SolicitorParty_ContactDetails_FaxNumber.dataBinding, SolicitorParty_ContactDetails_EmailAddress.dataBinding, 
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.dataBinding, Mediation_ContactName.dataBinding, Mediation_TelephoneNumber.dataBinding, Mediation_EmailAddress.dataBinding,
Mediation_Availability.dataBinding, Mediation_Notes.dataBinding];
updateDetailsLogic.logic = function(event)
{
	if ( Services.getValue(XPathConstants.CASE_STATUS) == FormConstants.STATUS_NEW || 
		 Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" || 
		 event.getXPath() == "/" )
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
	if (!validInput || event.getType() != DataModelEvent.UPDATE)
	{
		return;
	}
	
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
}
