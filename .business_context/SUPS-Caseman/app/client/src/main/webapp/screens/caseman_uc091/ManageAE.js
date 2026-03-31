/** 
 * @fileoverview ManageAE.js:
 * This file contains the form and field configurations for the UC091 - Manage AE screen
 *
 * @author Tony White, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 05/06/2006 - Chris Vincent, changed some of the static variables which were
 *				not constants e.g. actions after save and the surrogate key.
 * 13/06/2006 - Chris Vincent, made some changes to the section where Oracle Reports
 *				called to use CaseManFormParameters.ORNODE_XPATH instead of WPNODE_XPATH.
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on occupation, payroll, named person and employer
 *				name fields.
 * 10/07/2006 - Chris Vincent, changed saveCaseAe() and addNewAEEvent() so that an automatic
 *				AE Event is not created on creation of a Magistrates AE.  postAddAEEventNavigate()
 *				also updated so clears screen if create Magistrates AE when have not come from the
 * 				Create Cases screen.
 * 16/08/2006 - TD4309: Kevin Gichohi (EDS). Removed validation items for CAPS ID (digits = 6) and 
 * 			    date of issue (Static date of 30-Sep-1998 if a case exists) fields.
 * 16/08/2006 - Chris Vincent, added validation to field Fee_Amount_Of_AE to prevent values
 *				above £999,999,999.99 being entered (defect 4379).
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 08/09/2006 - Chris Vincent, updated the function which updates the Fee totals (updateFees) so if the
 * 				Amount of Ae or Fee entered is blank or not a number, the totals are refreshed using 0.00
 * 				for those amounts instead.  Previously, if the fields were invalid, the totals were not being
 * 				refreshed at all.  Defect 5169.
 * 15/11/2006 - Chris Vincent, updated saveCaseAe() to not add a new AE Fee to the Fees Paid table if the
 * 				Existing AE Flag is checked - UCT Defect 669.
 * 04/12/2006 - Chris Vincent, updated the xpath for XPathConstants.OTHER_FEE which was missing a '/'.  UCT
 * 				Defect 838/839.
 * 09/01/2007 - Chris Vincent, made change to Status_ClearBtn.actionBinding to Alt + C on an IE Select list, focus
 * 				is lost when clearForm() runs.  Need to move focus to a non IE Select field before run function.
 * 				Temp_CaseMan defect 362.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 21/09/2007 - Chris Vincent, CaseMan Defect 6433 requires the validation on Header_Party_Against.validate() to be
 * 				extended to include AE Type in the check to make sure a live AE between the two selected parties
 * 				doesn't already exist.
 * 24/09/2007 - Chris Vincent, CaseMan Defect 6218.  Introduction of validJudgmentDebtor() function to determine if
 * 				the Judgment Debtor is populated and valid and if so, enable the address tabbed pages which are
 * 				all linked to the Judgment Debtor.  Add Address and Historical Address button enablement also linked to
 * 				valid Judgment Debtor. 
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearForm() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 01/02/2008 - Chris Vincent, Fixing CaseMan defect 6499 by adding additional validation listener to the Judgment Debtor field
 * 15/01/2009 - Sandeep Mullangi - ServiceDays changes RFC0655
 * 10/02/2010 - Mark Groen, In postAddAEEventNavigate(), set Oracle Report Court Code constant TRAC 2446
 *				Clear the Oracle Report Court Code constant when load case events in Header_Case_Number.onSuccess() TRAC 2446
 * 06/08/2010 - Chris Vincent, updated Fee_Amount_Of_AE.validate and Fee_Fee.validate to remove validation where payments to date 
 *				is greater than the Amount of AE + Fees.  Trac 2207.
 * 07/09/2010 - Chris Vincent, updated AEDetails_AENumber.validate so AE Number validation only occurs on new AEs.  Trac 3392.
 * 04/05/2011 - Chris Vincent, change to function addNewFee to correctly set the owning court to the case's owning court instead
 *				of the user's owning court.  Trac 2236.
 * 21/02/2012 - Chris Vincent, change to exitScreen() to clear down the Oracle Report court code in /ds/var/app when 
 *				exit the screen.  Trac 4554.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.
 * 25/11/2015 - Chris Vincent - AE Event bulk printing changes including adding Welsh translation flags and opening certain
 *				outputs in a new window rather than reprinting them.  Trac #5725
 * 09/12/2015 - Chris Vincent - Changes in the way the AE Number is generated.  Also changed AE issuing court and AE Fee court
 *				to be the user court rather than the case owning court.  Trac #5719
 */
 
/**
 * XPath Constants
 * @author pz9j2w
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_APP_XPATH = "/ds/var/app";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SYSTEMDATE_XPATH	= XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.MANAGE_AE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ManageAE";
XPathConstants.CASE_RESULTS_XPATH = XPathConstants.MANAGE_AE_XPATH + "/Case";
XPathConstants.AE_RESULTS_XPATH = XPathConstants.CASE_RESULTS_XPATH + "/AEApplications";
XPathConstants.SELECTED_AE_XPATH = XPathConstants.MANAGE_AE_XPATH + "/SelectedAE/AEApplication";
XPathConstants.SELECTED_PARTIES_XPATH = XPathConstants.MANAGE_AE_XPATH + "/SelectedAE";
XPathConstants.VARIABLES = XPathConstants.VAR_PAGE_XPATH + "/Variables";
XPathConstants.AE_EVENT_XPATH = XPathConstants.VARIABLES + "/AEEvent";
XPathConstants.JUDGMENT_ID = XPathConstants.VARIABLES + "/JudgmentId";
XPathConstants.CHECK_EXISTING = XPathConstants.VARIABLES + "/CheckExisting";
XPathConstants.OTHER_FEE = XPathConstants.VARIABLES + "/OtherFee";
XPathConstants.EXCLUDE_PARTYFOR_XPATH = XPathConstants.VARIABLES + "/ExcludePartyForType";
XPathConstants.EXCLUDE_PARTYAGAINST_XPATH = XPathConstants.VARIABLES + "/ExcludePartyAgainstType";
XPathConstants.PARTYFORID_XPATH = XPathConstants.VARIABLES + "/PartyForId";
XPathConstants.PARTYAGAINSTID_XPATH = XPathConstants.VARIABLES + "/PartyAgainstId";
XPathConstants.ENABLE_FIELDS_XPATH = XPathConstants.VARIABLES + "/EnableAEFields";
XPathConstants.DIRTY_DATA_XPATH = XPathConstants.VARIABLES + "/DirtyData";
XPathConstants.ADD_ADDRESS_FLAG_XPATH = XPathConstants.VARIABLES + "/AddressUpdateTrigger";
XPathConstants.TEMP_NEW_ADDRESS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NewAddress/Address";
XPathConstants.AENUMBER_RETRIEVED_IND_XPATH = XPathConstants.VARIABLES + "/AENumberExistsCheckInd";
XPathConstants.AENUMBER_EXISTS_LIST_XPATH = XPathConstants.VARIABLES + "/AeExistsCheck";
XPathConstants.READONLY_CASESTATUS_IND_XPATH = XPathConstants.VARIABLES + "/ReadOnlyCaseStatusInd";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ActionAfterSave";
XPathConstants.ACTION_AFTER_RET_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ActionAfterRetrieval";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.VAR_SERVICEDATE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ServiceDate";

/**
 * Manage AE Action Constants
 * @author pz9j2w
 * 
 */
function ManageAEActions() {};
ManageAEActions.ACTION_NAVIGATE = "NAVIGATE";
ManageAEActions.ACTION_CLEARFORM = "CLEAR_FORM";
ManageAEActions.ACTION_EXIT = "EXIT_SCREEN";
ManageAEActions.ACTION_LOADNEWAE = "LOAD_NEW_AE";

/**
 * Form Constants
 * @author pz9j2w
 * 
 */
function FormConstants() {};
FormConstants.JARGON_CONSTANT = "@@@###&&&";

/**
 * Enumeration of AE Type Codes
 * @author pz9j2w
 * 
 */
function AETypeCodes() {};
AETypeCodes.JUDGMENTDEBT = "JD";
AETypeCodes.PRIORITYMAIN = "PM";
AETypeCodes.MAINTENANCEARREARS = "MN";
AETypeCodes.MAGSORDER = "MG";

/**
 * Enumeration of Address Type Codes
 * @author pz9j2w
 * 
 */
function AddressTypeCodes() {};
AddressTypeCodes.SERVICE = "SERVICE";
AddressTypeCodes.SUBSERVICE = "SUBSERV";
AddressTypeCodes.EMPLOYER = "EMPLOYER";
AddressTypeCodes.WORKPLACE = "WORKPLACE";

/**
 * Enumeration of Invalid Case Statuses
 * @author pz9j2w
 * 
 */
function InvalidCaseStatuses() {};
InvalidCaseStatuses.PAID = "PAID";
InvalidCaseStatuses.TRANSFERRED = "TRANSFERRED";
InvalidCaseStatuses.SETTLED = "SETTLED";
InvalidCaseStatuses.WITHDRAWN = "WITHDRAWN";

/****************************** MAIN FORM *****************************************/

function ManageAE() {};

/**
 * @author pz9j2w
 * 
 */
ManageAE.initialise = function()
{
	var extCaseNumber = Services.getValue(ManageAEParams.CASE_NUMBER);
	var extAENumber = Services.getValue(ManageAEParams.AE_NUMBER); 
	
	if( !CaseManUtils.isBlank(extCaseNumber) )
	{
		Services.setValue(Header_Case_Number.dataBinding, extCaseNumber);
		if( !CaseManUtils.isBlank(extAENumber) )
		{
			Services.setValue(XPathConstants.VARIABLES + "/ExternalAENumber", extAENumber);
		}
	}
	else
	{
		initialiseForm();
	}
}

ManageAE.refDataServices = [
	{ name:"Courts",	dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] },
	{ name:"AETypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getAeAppTypes", serviceParams:[] },
	{ name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[] },
	{ name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[] },
	{ name:"PreferredCommunicationMethods", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPrefCommMethodList", serviceParams:[] },
	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency",   serviceParams:[] },
	{ name:"StandardFees", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getStandardFees", serviceParams:[] }
];

/******************************* SUB-FORMS *****************************************/

/**
 * View Historical Service Address Subform
 * @author pz9j2w
 * 
 */
function viewHistAddresses_subform() {};
viewHistAddresses_subform.subformName = "viewHistAddressesSubform";
/**
 * @author pz9j2w
 * 
 */
viewHistAddresses_subform.prePopupPrepare = function()
{
	// Pass the currently selected party's historical addresses to the subform
	var historicalAddresses = Services.getNodes(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = " + Address_Paged_Area.dataBinding + " and ./DateTo != '']");
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/ViewHistAddressesSubform/HistoricalAddresses");
	for ( var i=0, l=historicalAddresses.length; i<l; i++ )
	{
		Services.addNode(historicalAddresses[i], XPathConstants.VAR_FORM_XPATH + "/Subforms/ViewHistAddressesSubform/HistoricalAddresses");
	}
	Services.endTransaction();
}

/**
 * @author pz9j2w
 * @return "View_HistoryBtn"  
 */
viewHistAddresses_subform.nextFocusedAdaptorId = function() {
	return "View_HistoryBtn";
}

/*********************************************************************************/

/**
 * View Historical Employer Address Subform
 * @author pz9j2w
 * 
 */
function viewEmpHistAddresses_subform() {};
viewEmpHistAddresses_subform.subformName = "ViewHistEmpAddressesSubform";
/**
 * @author pz9j2w
 * 
 */
viewEmpHistAddresses_subform.prePopupPrepare = function()
{
	// Pass the currently selected party's historical addresses to the subform
	var historicalAddresses = Services.getNodes(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./DateTo != '']");
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/ViewEmpHistAddressesSubform/HistoricalAddresses");
	for( var i=0, l=historicalAddresses.length; i<l; i++ )
	{
		Services.addNode(historicalAddresses[i], XPathConstants.VAR_FORM_XPATH + "/Subforms/ViewEmpHistAddressesSubform/HistoricalAddresses");
	}
	Services.endTransaction();
}

/**
 * @author pz9j2w
 * @return "View_HistoryBtn"  
 */
viewEmpHistAddresses_subform.nextFocusedAdaptorId = function() {
	return "View_HistoryBtn";
}

/*********************************************************************************/

/**
 * Add New Service/Substituted/Workplace Address Subform
 * @author pz9j2w
 * 
 */
function addNewAddress_subform() {};
addNewAddress_subform.subformName = "addNewAddressSubform";
addNewAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.TEMP_NEW_ADDRESS_XPATH } ];
/**
 * @author pz9j2w
 * 
 */
addNewAddress_subform.processReturnedData = function() 
{
	var tabbedPage = Services.getValue(Address_Paged_Area.dataBinding);
	var surrogateId = getNextSurrogateKey();
	var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var caseNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber");
	var partyRoleCode = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/PartyRoleCode");
	var casePartyNumber = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/CasePartyNumber");

	// Set default address values
	Services.startTransaction();
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/PartyId", "");
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/SurrogateId", surrogateId );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/TypeCode", tabbedPage );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/DateFrom", systemDate );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/DateTo", "");
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/CreatedBy", Services.getCurrentUser() );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/CaseNumber", caseNumber );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/PartyRoleCode", partyRoleCode );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/CasePartyNo", casePartyNumber );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/Reference", "");
	
	if( Services.countNodes(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = " + Address_Paged_Area.dataBinding + " and ./DateTo = '']") > 0 )
	{
		// Change the current address to a historical address by adding Date To
		Services.setValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = " + Address_Paged_Area.dataBinding + " and ./DateTo = '']/DateTo", systemDate );
	}

	var destinationXPath = XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses";
	var addressNode = Services.getNode(XPathConstants.TEMP_NEW_ADDRESS_XPATH);
	Services.addNode(addressNode, destinationXPath);
	Services.setValue(XPathConstants.ADD_ADDRESS_FLAG_XPATH, surrogateId );
	setDirtyFlag();
	Services.endTransaction();
}

/**
 * @author pz9j2w
 * @return "Add_AddressBtn"  
 */
addNewAddress_subform.nextFocusedAdaptorId = function() {
	return "Add_AddressBtn";
}

/*********************************************************************************/

/**
 * Add New Employer Address Subform
 * @author pz9j2w
 * 
 */
function addNewEmpAddress_subform() {};
addNewEmpAddress_subform.subformName = "AddNewEmpAddressSubform";
addNewEmpAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.TEMP_NEW_ADDRESS_XPATH } ];
/**
 * @author pz9j2w
 * 
 */
addNewEmpAddress_subform.processReturnedData = function() 
{
	var surrogateId = getNextSurrogateKey();
	var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);

	// Set default address values
	Services.startTransaction();
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/SurrogateId", surrogateId );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/TypeCode", AddressTypeCodes.EMPLOYER );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/DateFrom", systemDate );
	Services.setValue(XPathConstants.TEMP_NEW_ADDRESS_XPATH + "/CreatedBy", Services.getCurrentUser() );

	if( Services.countNodes(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./DateTo = '']") > 0 )
	{
		// Change the current address to a historical address by adding Date To
		Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./DateTo = '']/DateTo", systemDate );
	}

	var destinationXPath = XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses";
	var addressNode = Services.getNode(XPathConstants.TEMP_NEW_ADDRESS_XPATH);
	Services.addNode(addressNode, destinationXPath);
	Services.setValue(XPathConstants.ADD_ADDRESS_FLAG_XPATH, surrogateId );
	setDirtyFlag();
	Services.endTransaction();
}

/**
 * @author pz9j2w
 * @return "Add_AddressBtn"  
 */
addNewEmpAddress_subform.nextFocusedAdaptorId = function() {
	return "Add_AddressBtn";
}

/***************************** DATA BINDINGS **************************************/

Header_Case_Number.dataBinding						= XPathConstants.MANAGE_AE_XPATH + "/CaseNumber";
Header_OwningCourtCode.dataBinding					= XPathConstants.CASE_RESULTS_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding					= XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_OwningCourtCode.dataBinding + "]/Name";
Header_Party_For.dataBinding						= XPathConstants.VARIABLES + "/PartyFor";
Header_Party_ForLov.dataBinding					    = Header_Party_For.dataBinding;
Header_Party_Against.dataBinding					= XPathConstants.VARIABLES + "/PartyAgainst";
Header_Party_AgainstLov.dataBinding				    = Header_Party_Against.dataBinding;

AEDetails_AENumber.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/AENumber";
AEDetails_Exisiting_Case.dataBinding				= XPathConstants.VARIABLES + "/IsExistingCase";
AEDetails_Caps_Id.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/CAPSSequence";
AEDetails_Caps_Check.dataBinding					= XPathConstants.VARIABLES + "/CapsChk";
AEDetails_ExistingAEsLov.dataBinding				= XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/ExistingAE";
AEDetails_Date_Of_Receipt.dataBinding				= XPathConstants.SELECTED_AE_XPATH + "/DateOfReceipt";
AEDetails_Application_Type.dataBinding				= XPathConstants.SELECTED_AE_XPATH + "/AETypeDescription";
AEDetails_Application_TypeLov.dataBinding			= XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/ApplicationType";
AEDetails_Application_Type_Code.dataBinding		    = XPathConstants.SELECTED_AE_XPATH + "/AEType";
AEDetails_Date_Of_Issue.dataBinding				    = XPathConstants.SELECTED_AE_XPATH + "/DateOfIssue";

Fee_Amount_Currency.dataBinding					    = XPathConstants.REF_DATA_XPATH + "/CurrencySymbol";
Fee_Amount_Of_AE.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/AmountOfAE";
Fee_Total.dataBinding								= XPathConstants.VARIABLES + "/Total";
Fee_Total_Currency.dataBinding						= Fee_Amount_Currency.dataBinding;
Fee_Fee.dataBinding								    = XPathConstants.SELECTED_AE_XPATH + "/AEFee";
Fee_Currency.dataBinding							= Fee_Amount_Currency.dataBinding;

Fee_Other_Fees.dataBinding							= XPathConstants.OTHER_FEE;
Fee_Other_Fees_Currency.dataBinding				    = Fee_Amount_Currency.dataBinding;
Fee_Payment_To_Date.dataBinding					    = XPathConstants.SELECTED_AE_XPATH + "/TotalFees/TotalFee";
Fee_Payment_To_Date_Currency.dataBinding			= Fee_Amount_Currency.dataBinding;
Fee_Total_Remaining.dataBinding					    = XPathConstants.VARIABLES + "/TotalRemaining";
Fee_Total_Remaining_Currency.dataBinding			= Fee_Amount_Currency.dataBinding;

Employer_Occupation.dataBinding					    = XPathConstants.SELECTED_AE_XPATH + "/Occupation";
Employer_Payroll_No.dataBinding					    = XPathConstants.SELECTED_AE_XPATH + "/PayrollNo";
Employer_Named_Person.dataBinding					= XPathConstants.SELECTED_AE_XPATH + "/NamedEmployer";
								 
Service_Line1.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/Line[1]";
Service_Line2.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/Line[2]";
Service_Line3.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/Line[3]";
Service_Line4.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/Line[4]";
Service_Line5.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/Line[5]";
Service_PostCode.dataBinding						= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SERVICE + "' and ./DateTo = '']/PostCode";
Service_Telephone.dataBinding						= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/TelephoneNumber";
Service_Fax.dataBinding							    = XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/FaxNumber";
Service_Email.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/EmailAddress";
Service_PreferredMethodOfCommunication.dataBinding	= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/PreferredCommunicationMethod";
Service_TranslationToWelsh.dataBinding				= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/WelshIndicator";

Sub_Line1.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/Line[1]";
Sub_Line2.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/Line[2]";
Sub_Line3.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/Line[3]";
Sub_Line4.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/Line[4]";
Sub_Line5.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/Line[5]";
Sub_PostCode.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.SUBSERVICE + "' and ./DateTo = '']/PostCode";

Employer_Name.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/PersonRequestedName";													
Employer_Telephone.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/TelephoneNumber";
Employer_Fax.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/FaxNumber";
Employer_Email.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/EmailAddress";
Employer_PreferredMethodOfCommunication.dataBinding = XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/DebtorsEmplPrefCommsMethod";
Employer_TranslationToWelsh.dataBinding			    = XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/DebtorsEmplWelshindicator";

Employer_Line1.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Line[1]";
Employer_Line2.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Line[2]";
Employer_Line3.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Line[3]";
Employer_Line4.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Line[4]";
Employer_Line5.dataBinding							= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Line[5]";
Employer_PostCode.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/PostCode";
Employer_Reference.dataBinding						= XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.EMPLOYER + "' and ./DateTo = '']/Reference";;

Work_Line1.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/Line[1]";
Work_Line2.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/Line[2]";
Work_Line3.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/Line[3]";
Work_Line4.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/Line[4]";
Work_Line5.dataBinding								= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/Line[5]";
Work_PostCode.dataBinding							= XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = '" + AddressTypeCodes.WORKPLACE + "' and ./DateTo = '']/PostCode";

/*********************************** TABS ******************************************/

function Address_Paged_Area() {};
Address_Paged_Area.dataBinding = XPathConstants.VARIABLES + "/SelectedAddressTab";

function Address_Tab_Selector() {};
Address_Tab_Selector.tabIndex = 40;
Address_Tab_Selector.dataBinding = Address_Paged_Area.dataBinding;
Address_Tab_Selector.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Address_Tab_Selector.isEnabled = isValidCase;

/**
 * Tab Pages
 * @author pz9j2w
 * 
 */
function SERVICE() {};
SERVICE.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Case_Number.dataBinding, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
SERVICE.isEnabled = function()
{
	if ( !isValidCase() || isMagsCase() || !validJudgmentDebtor() )
	{
		// Disabled if a valid case has NOT been loaded or the case is MAGS ORDER or the Judgment Debtor is invalid
		return false;
	}
	return true;
}

function SUBSERV() {};
SUBSERV.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Case_Number.dataBinding, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
SUBSERV.isEnabled = function()
{
	if ( !isValidCase() || isMagsCase() || !validJudgmentDebtor() )
	{
		// Disabled if a valid case has NOT been loaded or the case is MAGS ORDER or the Judgment Debtor is invalid
		return false;
	}
	return true;
}

function EMPLOYER() {};
EMPLOYER.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
EMPLOYER.isEnabled = function()
{
	// Disabled if a valid case is not loaded or the Judgment Debtor is invalid
	if ( !isValidCase() || !validJudgmentDebtor() )
	{
		return false;
	}
	return true;
}

function WORKPLACE() {};
WORKPLACE.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
WORKPLACE.isEnabled = function()
{
	// Disabled if a valid case is not loaded or the Judgment Debtor is invalid
	if ( !isValidCase() || !validJudgmentDebtor() )
	{
		return false;
	}
	return true;
}

/******************************** LOV POPUPS ***************************************/

function Header_Party_ForLov() {};
Header_Party_ForLov.raise = {
	eventBinding: {
		singleClicks: [ { element: "Header_Party_ForLovBtn" } ],
		keys: [ { key: Key.F6, element: "Header_Party_For" } ]
	}
};
Header_Party_ForLov.srcDataOn = [Header_Case_Number.dataBinding, XPathConstants.EXCLUDE_PARTYFOR_XPATH, XPathConstants.PARTYAGAINSTID_XPATH, AEDetails_Application_Type_Code.dataBinding];
Header_Party_ForLov.srcData = XPathConstants.SELECTED_PARTIES_XPATH + "/Creditor/Parties";
Header_Party_ForLov.rowXPath = "Party[./PartyRoleCode != " + XPathConstants.EXCLUDE_PARTYFOR_XPATH	+ " and ./PartyId != " + XPathConstants.PARTYAGAINSTID_XPATH + "]";
Header_Party_ForLov.keyXPath = "PartyId";
Header_Party_ForLov.columns = [{xpath: "PersonRequestedName"}];

/*********************************************************************************/

function Header_Party_AgainstLov() {};
Header_Party_AgainstLov.raise = {
	eventBinding: {
		singleClicks: [ { element: "Header_Party_AgainstLovBtn" } ],
		keys: [ { key: Key.F6, element: "Header_Party_Against" } ]
	}
};
Header_Party_AgainstLov.srcDataOn = [Header_Case_Number.dataBinding, XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, XPathConstants.PARTYFORID_XPATH, AEDetails_Application_Type_Code.dataBinding];
Header_Party_AgainstLov.srcData = XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties";
Header_Party_AgainstLov.rowXPath = "Party[./PartyRoleCode != " + XPathConstants.EXCLUDE_PARTYAGAINST_XPATH	+ " and ./PartyId != " + XPathConstants.PARTYFORID_XPATH + "]";
Header_Party_AgainstLov.keyXPath = "PartyId";
Header_Party_AgainstLov.columns = [{xpath: "PersonRequestedName"}];

/*********************************************************************************/

function AEDetails_ExistingAEsLov() {};
AEDetails_ExistingAEsLov.srcDataOn = [Header_Case_Number.dataBinding];
AEDetails_ExistingAEsLov.srcData = XPathConstants.VAR_FORM_XPATH + "/AEApplications";
AEDetails_ExistingAEsLov.rowXPath = "AEApplication";
AEDetails_ExistingAEsLov.keyXPath = "AENumber";
AEDetails_ExistingAEsLov.columns = [
	{xpath: "AENumber"}, 
	{xpath: "AEType"}, 
	{xpath: "PartyForRequestedName"}, 
	{xpath: "PartyAgainstRequestedName"}, 
	{xpath: "LiveStatus"}
];
AEDetails_ExistingAEsLov.styleURL = "/css/ExistingAEsLOVGrid.css";
AEDetails_ExistingAEsLov.destroyOnClose = false;
AEDetails_ExistingAEsLov.logicOn = [AEDetails_ExistingAEsLov.dataBinding];
AEDetails_ExistingAEsLov.logic = function(event)
{
	if ( event.getXPath().indexOf(AEDetails_ExistingAEsLov.dataBinding) == -1 )
	{
		return;
	}

	var aeNumber = Services.getValue(AEDetails_ExistingAEsLov.dataBinding);
	if( !CaseManUtils.isBlank(aeNumber) )
	{
		Services.startTransaction();
		Services.setValue(ManageAEParams.AE_NUMBER, aeNumber);
		Services.setValue(AEDetails_AENumber.dataBinding, aeNumber);
		Services.setValue(Address_Paged_Area.dataBinding, AddressTypeCodes.EMPLOYER);
	 
		var selectedAe = Services.getNode(XPathConstants.AE_RESULTS_XPATH + "/AEApplication[./AENumber = '" + aeNumber + "']");
		if( null != selectedAe )
		{
			Services.replaceNode(XPathConstants.SELECTED_AE_XPATH, selectedAe);
		}
		setApplicationAETypes();
		copyPartiesForSelection();

		// Set Existing Case flag to 'N' if Caps Id is blank, else 'Y'
		var existingCaseValue = CaseManUtils.isBlank( Services.getValue(AEDetails_Caps_Id.dataBinding) ) ? "N" : "Y";
		Services.setValue(AEDetails_Exisiting_Case.dataBinding, existingCaseValue);

		Services.setValue(XPathConstants.CHECK_EXISTING, "change");
		Services.setValue(XPathConstants.OTHER_FEE, Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/OtherFees/OtherFee") - Services.getValue(Fee_Fee.dataBinding));
		Services.endTransaction();
	}
}

/*********************************************************************************/

function AEDetails_Application_TypeLov() {};
AEDetails_Application_TypeLov.raise = {
	eventBinding: {
		singleClicks: [ {element: "AEDetails_Application_TypeLovBtn"} ],
		keys: [ { key: Key.F6, element: "AEDetails_Application_Type_Code" }, 
				{ key: Key.F6, element: "AEDetails_Application_Type" } ]
	}
};
AEDetails_Application_TypeLov.srcDataOn = [XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType/SelectForAE"];
AEDetails_Application_TypeLov.srcData = XPathConstants.REF_DATA_XPATH + "/AEAppTypes";
AEDetails_Application_TypeLov.rowXPath = "AEAppType[./SelectForAE = 'true']";
AEDetails_Application_TypeLov.keyXPath = "Id";
AEDetails_Application_TypeLov.columns = [ 
	{xpath: "Id"}, 
	{xpath: "Name"} 
];
AEDetails_Application_TypeLov.styleURL = "/css/ApplicationTypeLOVGrid.css";
AEDetails_Application_TypeLov.destroyOnClose = false;
AEDetails_Application_TypeLov.logicOn = [AEDetails_Application_TypeLov.dataBinding];
AEDetails_Application_TypeLov.logic = function(event) 
{
	var value = Services.getValue(AEDetails_Application_TypeLov.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		Services.startTransaction();
		Services.setValue(AEDetails_Application_Type_Code.dataBinding, value);

		// Now reset the value in the LOV
		Services.setValue(AEDetails_Application_TypeLov.dataBinding, null);
		Services.endTransaction();
	}		
}

/********************************* FIELDS ******************************************/

function Header_Case_Number() {};
Header_Case_Number.tabIndex = 1;
Header_Case_Number.isMandatory = function() { return true; }
Header_Case_Number.maxLength = 8;
Header_Case_Number.helpText = "Unique identifier of a case quoted by all parties";
Header_Case_Number.transformToModel = function(value) {return (null != value) ? value.toUpperCase() : null;}
Header_Case_Number.readOnlyOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_Case_Number.isReadOnly = isValidCase;
Header_Case_Number.validateOn = [Header_Case_Number.dataBinding];
Header_Case_Number.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);
	}
	return ec;
}

Header_Case_Number.logicOn = [Header_Case_Number.dataBinding];
Header_Case_Number.logic = function(event) 
{
	if ( event.getXPath() != Header_Case_Number.dataBinding )
	{
		return;
	}
	
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	if( !CaseManUtils.isBlank(caseNumber) && null == Header_Case_Number.validate() )
	{
		var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", caseNumber);		
		Services.callService("getCaseAe", params, Header_Case_Number, true);
	}
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
Header_Case_Number.onSuccess = function(dom)
{
	var results = dom.selectSingleNode("/ds/Case");
	if( null != results )
	{
		Services.replaceNode(XPathConstants.CASE_RESULTS_XPATH, results);
		setAELiveStatusFlags();
		Services.setValue(XPathConstants.ENABLE_FIELDS_XPATH, "true");
		
		var externalAENumber = Services.getValue(XPathConstants.VARIABLES + "/ExternalAENumber");
		if( !CaseManUtils.isBlank( externalAENumber ) )
		{
			if ( !isCaseStatusValid() )
			{
				// Case has invalid status, make screen read only
				Services.setValue(XPathConstants.READONLY_CASESTATUS_IND_XPATH, "true");
			}
			
			// An AE Number has already been specified, load the details
			Services.setValue(AEDetails_ExistingAEsLov.dataBinding, externalAENumber );
			
			var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_RET_XPATH);
			Services.setValue(XPathConstants.ACTION_AFTER_RET_XPATH, "");
			if ( tempAction == ManageAEActions.ACTION_LOADNEWAE )
			{
				// User wishes to load another existing AE following retrieval
				loadExistingAEs();
			}
		}
		else
		{
			// No AE Number specified, set up screen to create a new AE
			if ( isCaseStatusValid() )
			{
				// The case loaded has a valid status, set up the screen
				Services.startTransaction();
				var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
				Services.setValue(ManageAEParams.CASE_NUMBER, caseNumber);
				Services.setFocus("Header_Party_For");
				setDefaultAEFields();
				setDefaultAEType();
			
				// Check if owning court is different
				var caseCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
				var msg_ind = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
				var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
				if ( !CaseManUtils.isBlank(caseCourtCode) && caseCourtCode != owningCourt && msg_ind != "true" )
				{
					alert(Messages.OWNING_COURT_MESSAGE);
					Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
				}
				Services.endTransaction();
				
				// Due to problems with the framework, this should be outside the transaction
				setMagistratesFields();
			}
			else
			{
				// Invalid case status, load the AE details in read only mode (if exist)
				var countAEs = Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication");
				if ( countAEs > 0 )
				{
					Services.setValue(XPathConstants.READONLY_CASESTATUS_IND_XPATH, "true");
					loadExistingAEs();
				}
				else
				{
					// No existing AEs on the invalid case so just clear the form
					clearForm();
				}
			}
		}
	}
	else
	{
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setValue(XPathConstants.ENABLE_FIELDS_XPATH, "false");
	}
	Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "false");
	
	// Clear the Oracle Report Court Code constant when load case events in Header_Case_Number.onSuccess() TRAC 2446
	Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, "");
}

/**
 * @author pz9j2w
 * 
 */
Header_Case_Number.onError = function()
{
	Services.setValue(XPathConstants.ENABLE_FIELDS_XPATH, "false");
	alert("Error: Could not retrieve AE details from database");
	initialiseForm();
}

/*********************************************************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.helptext = "The owning court code of the user";
Header_OwningCourtCode.isReadOnly = function() {return true;}
Header_OwningCourtCode.retrieveOn = [Header_Case_Number.dataBinding];
Header_OwningCourtCode.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_OwningCourtCode.isEnabled = isValidCase;

/*********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.helptext = "The owning court name of the user";
Header_OwningCourtName.isReadOnly = function() {return true;}
Header_OwningCourtName.retrieveOn = [Header_OwningCourtCode.dataBinding];
Header_OwningCourtName.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_OwningCourtName.isEnabled = isValidCase;

/*********************************************************************************/

function Header_Party_For() {};
Header_Party_For.tabIndex = 3;
Header_Party_For.srcDataOn = [Header_Case_Number.dataBinding, XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, XPathConstants.PARTYAGAINSTID_XPATH, AEDetails_Application_Type_Code.dataBinding, AEDetails_ExistingAEsLov.dataBinding];
Header_Party_For.srcData = XPathConstants.SELECTED_PARTIES_XPATH + "/Creditor/Parties";
Header_Party_For.rowXPath = "Party[./PartyRoleCode != " + XPathConstants.EXCLUDE_PARTYFOR_XPATH + " and ./PartyId != " + XPathConstants.PARTYAGAINSTID_XPATH + "]";	
Header_Party_For.keyXPath = "PartyId";
Header_Party_For.displayXPath = "PersonRequestedName";
Header_Party_For.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_Party_For.isEnabled = isValidCase;
Header_Party_For.helpText = "Name";
Header_Party_For.maxLength = 70;
Header_Party_For.retrieveOn = [XPathConstants.EXCLUDE_PARTYFOR_XPATH, XPathConstants.PARTYFORID_XPATH, AEDetails_Application_Type_Code.dataBinding];
Header_Party_For.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_Party_For.isMandatory = function() { return true; }
Header_Party_For.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding, Header_Party_Against.dataBinding, Header_Case_Number.dataBinding];
Header_Party_For.isReadOnly = function()
{
	if ( isExistingAERecord() || isMagsCase() )
	{
		// Read Only if an existing AE has been retrieved
		return true;
	}
	
	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	var partyAgainst = Services.getValue(Header_Party_Against.dataBinding);
	if ( aeType == AETypeCodes.JUDGMENTDEBT && CaseManUtils.isBlank(partyAgainst) )
	{
		// Read Only if new AE with type of Judgment Debt and the Debtor has not been selected
		return true;
	}
	return false;
}

Header_Party_For.logicOn = [Header_Party_For.dataBinding];
Header_Party_For.logic = function(event)
{
	if ( event.getXPath() != Header_Party_For.dataBinding )
	{
		return;
	}

	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if( aeType != AETypeCodes.JUDGMENTDEBT)
	{
		var partyId = Services.getValue(Header_Party_For.dataBinding);
		if( CaseManUtils.isBlank(partyId) )
		{
			partyId = FormConstants.JARGON_CONSTANT;
		}
		Services.setValue(XPathConstants.PARTYFORID_XPATH, partyId);
		
		// If the Judgment Creditor is a Claimant, the Judgment Debtor cannot be a Claimant
		var partyRole = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Creditor/Parties/Party[./PartyId = '" + partyId + "']/PartyRoleCode");
		if( partyRole != "CLAIMANT" )
		{
			partyRole = FormConstants.JARGON_CONSTANT;
		}
		Services.setValue(XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, partyRole);
		
		// If there is only one available Judgment Debtor, automatically select them
		var predicate = XPathConstants.SELECTED_PARTIES_XPATH + "/Creditor/Parties/Party[./PartyRoleCode != '" + partyRole + "' and ./PartyId != '" + partyId + "']";
		if( Services.countNodes(predicate) == 1 )
		{
			Services.setValue(Header_Party_Against.dataBinding, Services.getValue(predicate + "/PartyId"));
		}
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Header_Party_Against() {};
Header_Party_Against.tabIndex = 5;
Header_Party_Against.srcDataOn = [Header_Case_Number.dataBinding, XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, XPathConstants.PARTYFORID_XPATH, AEDetails_Application_Type_Code.dataBinding];
Header_Party_Against.srcData = XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties";
Header_Party_Against.rowXPath = "Party[./PartyRoleCode != " + XPathConstants.EXCLUDE_PARTYAGAINST_XPATH + " and ./PartyId != " + XPathConstants.PARTYFORID_XPATH +"]";
Header_Party_Against.keyXPath = "PartyId";
Header_Party_Against.displayXPath = "PersonRequestedName";
Header_Party_Against.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_Party_Against.isEnabled = isValidCase;
Header_Party_Against.helpText = "Name";
Header_Party_Against.maxLength = 70;
Header_Party_Against.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
Header_Party_Against.isReadOnly = function()
{
	if ( isExistingAERecord() || isMagsCase() )
	{
		// Read Only for existing cases or MAGS ORDER cases
		return true;
	}
	return false;
}

Header_Party_Against.logicOn = [Header_Party_Against.dataBinding];
Header_Party_Against.logic = function(event)
{
	if ( event.getXPath() != Header_Party_Against.dataBinding )
	{
		return;
	}

	// Check if app type JD and populate the creditor lov
	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if( aeType == AETypeCodes.JUDGMENTDEBT )
	{
		var partyId = Services.getValue(Header_Party_Against.dataBinding);
		var judgmentId = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = '" + partyId + "']/JudgmentID");
		Services.setValue(XPathConstants.JUDGMENT_ID, judgmentId);		
		
		if ( !CaseManUtils.isBlank( Services.getValue(AEDetails_ExistingAEsLov.dataBinding) ) )
		{
			// An existing AE is selected, populate the Debtor and Creditor fields
			setHeaderParties();
		}
		else
		{
			if ( CaseManUtils.isBlank(partyId) )
			{
				// If Judgment Debtor is blanked, for JD AE's, blank the Judgment Creditor as well
				Services.setValue(Header_Party_For.dataBinding, "");
			}
			else
			{
				// Is a new AE, set the Creditor if only one on the Judgment against the selected Debtor
				var countPartiesFor = Services.countNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment[./JudgmentId = '" + judgmentId + "']/InFavourParties/Party");
				if ( countPartiesFor == 1 )
				{
					var partyFor = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment[./JudgmentId = '" + judgmentId + "']/InFavourParties/Party/PartyId");
					Services.setValue(Header_Party_For.dataBinding, partyFor);
				}
			}
		}
	}
	else
	{
		var partyId = Services.getValue(this.dataBinding);
		if( CaseManUtils.isBlank(partyId) )
		{
			partyId = FormConstants.JARGON_CONSTANT;		
		}
		Services.setValue(XPathConstants.PARTYAGAINSTID_XPATH, partyId);

		// If the Judgment Debtor is a Claimant, the Judgment Creditor cannot be a Claimant
		var partyRole = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = '" + partyId + "']/PartyRoleCode");
		if( partyRole != "CLAIMANT" )
		{
			partyRole = FormConstants.JARGON_CONSTANT;
		}
		Services.setValue(XPathConstants.EXCLUDE_PARTYFOR_XPATH, partyRole);
		
		// If there is only one available Judgment Creditor, automatically populate the field
		var predicate = XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyRoleCode != '" + partyRole + "' and ./PartyId != '" + partyId + "']";
		if( Services.countNodes(predicate) == 1 )
		{
			Services.setValue(Header_Party_For.dataBinding, Services.getValue(predicate + "/PartyId"));
		}
	}
	setDirtyFlag();
}

Header_Party_Against.isTemporary = function()
{
	// Temporary if existing record so will not validate
	return isExistingAERecord();
}

Header_Party_Against.retrieveOn = [XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, XPathConstants.PARTYAGAINSTID_XPATH, AEDetails_Application_Type_Code.dataBinding];
Header_Party_Against.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Header_Party_Against.isMandatory = function() {return true;}
Header_Party_Against.validateOn = [Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding, XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties"];
Header_Party_Against.validate = function(event)
{
	// Perform validation if Party Against is not blank and is a new AE
	var partyIdAgainst = Services.getValue(Header_Party_Against.dataBinding);
	if ( !CaseManUtils.isBlank(partyIdAgainst) && !isExistingAERecord() )
	{
		var codedPartyCode = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = '" + partyIdAgainst + "']/CodedParty/Code");
		if( !CaseManUtils.isBlank(codedPartyCode) )
		{
			// The Judgment Debtor cannot be a coded party
			return ErrorCode.getErrorCode("CaseMan_AE_DebtorCodedParties_Msg"); 
		}
		
		// Check for existing live AEs on the same case
		var partyIdFor = Services.getValue(Header_Party_For.dataBinding);
		var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
		if ( !CaseManUtils.isBlank(partyIdFor) && !CaseManUtils.isBlank(aeType) )
		{
			// Cannot have more than one AE with the same combination of party for, party against and AE type
			var partyRootXPath = XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party";
			var partyForCode = Services.getValue(partyRootXPath + "[./PartyId = '" + partyIdFor + "']/PartyRoleCode");
			var partyForNumber = Services.getValue(partyRootXPath + "[./PartyId = '" + partyIdFor + "']/CasePartyNumber");
			var partyAgainstCode = Services.getValue(partyRootXPath + "[./PartyId = '" + partyIdAgainst + "']/PartyRoleCode");
			var partyAgainstNumber = Services.getValue(partyRootXPath + "[./PartyId = '" + partyIdAgainst + "']/CasePartyNumber");
			var combinationExists = Services.exists(XPathConstants.AE_RESULTS_XPATH + "/AEApplication[./LiveStatus = 'Y' and " +
													"./AEType = '" + aeType + "' and " +
													"./PartyForPartyRoleCode = '" + partyForCode + "' and " +
													"./PartyForCasePartyNumber = '" + partyForNumber + "' and " +
													"./PartyAgainstPartyRoleCode = '" + partyAgainstCode + "' and " +
													"./PartyAgainstCasePartyNumber = '" + partyAgainstNumber + "']");
			if ( combinationExists )
			{
				return ErrorCode.getErrorCode("CaseMan_AE_Existing_AE_Msg");
			}
		}
	}
	return null;
}

/*********************************************************************************/

function AEDetails_Exisiting_Case() {};
AEDetails_Exisiting_Case.tabIndex = 10;
AEDetails_Exisiting_Case.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Exisiting_Case.isEnabled = isValidCase;
AEDetails_Exisiting_Case.modelValue = {checked: "Y", unchecked: "N"};
AEDetails_Exisiting_Case.helpText = "Application just issued (New) or in progress (Existing)?";
AEDetails_Exisiting_Case.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
AEDetails_Exisiting_Case.isReadOnly = isExistingOrMags;
AEDetails_Exisiting_Case.logicOn = [AEDetails_Exisiting_Case.dataBinding];
AEDetails_Exisiting_Case.logic = function(event)
{
	if ( event.getXPath() != AEDetails_Exisiting_Case.dataBinding )
	{
		return;
	}
	
	if ( !isExistingAERecord() )
	{
		var existingCaseFlag = Services.getValue(AEDetails_Exisiting_Case.dataBinding);
		if ( existingCaseFlag == "Y")
		{
			// Clear the date of issue field
			Services.setValue(AEDetails_Date_Of_Issue.dataBinding, "");
		}
		else if ( existingCaseFlag == "N" )
		{
			// Are returning fields to their previous value
			var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
			Services.startTransaction();
			Services.setValue(AEDetails_Caps_Id.dataBinding, "");
			Services.setValue(AEDetails_Caps_Check.dataBinding, "");
			Services.setValue(AEDetails_AENumber.dataBinding, "");
			Services.setValue(AEDetails_Date_Of_Issue.dataBinding, systemDate);
			Services.endTransaction();
		}
	}
}

/*********************************************************************************/

function AEDetails_Caps_Id() {};
AEDetails_Caps_Id.tabIndex = 11;
AEDetails_Caps_Id.enableOn = [AEDetails_Exisiting_Case.dataBinding];
AEDetails_Caps_Id.isEnabled = isExistingCase;
AEDetails_Caps_Id.maxLength = 6;
AEDetails_Caps_Id.helpText = "The CAPS Sequence";
AEDetails_Caps_Id.validateOn = [AEDetails_Caps_Id.dataBinding];
AEDetails_Caps_Id.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	
	/*
	 * TD4309: Kevin Gichohi (EDS)
	 * To improve compatibility with legacy whereby in Legacy, the CAPS ID can be entered with less than 6 digits.
	 * In practice, the CAPS IDs generated will not be less than 6 digits. However, the user can still enter a <
	 * a CAPS ID. Removing validation.
	 */
	/*
	if(value.length != 6)
	{
		return ErrorCode.getErrorCode("CaseMan_AE_CapsIdLength_Msg");
	}
 */
	if(!CaseManValidationHelper.validateNumber(value))
	{
		return ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
	}
	return null;
}
AEDetails_Caps_Id.retrieveOn = [AEDetails_AENumber.dataBinding];
AEDetails_Caps_Id.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
AEDetails_Caps_Id.isReadOnly = isExistingOrMags;
AEDetails_Caps_Id.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_Exisiting_Case.dataBinding];
AEDetails_Caps_Id.isMandatory = function() {return isExistingCase() ? true : false;}

/*********************************************************************************/

function AEDetails_Caps_Check() {};
AEDetails_Caps_Check.tabIndex = 12;
AEDetails_Caps_Check.enableOn = [AEDetails_Exisiting_Case.dataBinding];
AEDetails_Caps_Check.isEnabled = isExistingCase;
AEDetails_Caps_Check.helpText = "The CAPS sequence check digit";
AEDetails_Caps_Check.maxLength = 1;
AEDetails_Caps_Check.validateOn = [AEDetails_Caps_Id.dataBinding];
AEDetails_Caps_Check.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	if(!CaseManValidationHelper.validateNumber(value))
	{
		return ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
	}
	//validate CAPS chk digit is correct (see julia for algorithm)
	if(value != verifyCheckDigit(Services.getValue(AEDetails_Caps_Id.dataBinding)))
	{
		return ErrorCode.getErrorCode("CaseMan_AE_invalidCheckDigit_Msg");
	}
	return null;
}
AEDetails_Caps_Check.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
AEDetails_Caps_Check.isReadOnly = isExistingOrMags;
AEDetails_Caps_Check.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_Exisiting_Case.dataBinding];
AEDetails_Caps_Check.isMandatory = function() {return isExistingCase() && !isExistingAERecord() ? true : false;}

/*********************************************************************************/

function AEDetails_AENumber() {};
AEDetails_AENumber.tabIndex = 13;
AEDetails_AENumber.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_AENumber.isEnabled = isValidCase;
AEDetails_AENumber.readOnlyOn = [AEDetails_Exisiting_Case.dataBinding, AEDetails_ExistingAEsLov.dataBinding];
AEDetails_AENumber.isReadOnly = function() {return !(isExistingCase() && !isExistingAERecord());}
AEDetails_AENumber.helpText = "Unique identifier for an Attachment of Earnings";
AEDetails_AENumber.maxLength = 8;
AEDetails_AENumber.transformToModel = function(value) {return (null != value) ? value.toUpperCase() : null;}
AEDetails_AENumber.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_Exisiting_Case.dataBinding];
AEDetails_AENumber.isMandatory = function() {return isExistingCase() ? true : false;}

AEDetails_AENumber.validateOn = [XPathConstants.AENUMBER_RETRIEVED_IND_XPATH, AEDetails_ExistingAEsLov.dataBinding];
AEDetails_AENumber.validate = function()
{
	var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
	if ( !isMagsCase() && !CaseManUtils.isBlank(aeNumber) && !isExistingAERecord() )
	{
		var retrieved = Services.getValue(XPathConstants.AENUMBER_RETRIEVED_IND_XPATH);
		if ( retrieved == "true" )
		{
			if ( Services.countNodes(XPathConstants.AENUMBER_EXISTS_LIST_XPATH + "/AeList/AeNumber") > 0 )
			{
				// The AE Number entered manually already exists
				return ErrorCode.getErrorCode("CaseMan_AE_AENumberAlreadyExists_Msg");
			}
		}
		else
		{
			var aeSearch = aeNumber.search(CaseManValidationHelper.VALID_NONMAGSAE_PATTERN);
			var existingCaseAeSearch = aeNumber.search(CaseManValidationHelper.VALID_EXISTINGCASEAE_PATTERN);
			var newAeSearch = aeNumber.search(CaseManValidationHelper.VALID_NEW_NONMAGSAE_PATTERN);
		
			if ( aeSearch != 0 && existingCaseAeSearch != 0 && newAeSearch != 0 )
			{
				// Does not match any valid AE Number pattern
				return ErrorCode.getErrorCode("CaseMan_AE_invalidAENumberFormat_Msg");
			}
			else if ( existingCaseAeSearch == 0 )
			{
				var countCourts = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + aeNumber.substring(0, 3) + "']");
				if ( countCourts == 0 )
				{
					// For the existing case AE number format, the first 3 characters must match a valid court code
					return ErrorCode.getErrorCode("CaseMan_aeNumberCourtCodeValidation_Msg");
				}
			}
		}
	}
	return null;
}

AEDetails_AENumber.logicOn = [AEDetails_AENumber.dataBinding];
AEDetails_AENumber.logic = function(event)
{
	if ( event.getXPath() != AEDetails_AENumber.dataBinding )
	{
		return;
	}
	
	if ( isNewApplication() && isExistingCase() )
	{
		Services.setValue(XPathConstants.AENUMBER_RETRIEVED_IND_XPATH, "false");
		var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
		if ( !CaseManUtils.isBlank(aeNumber) && null == AEDetails_AENumber.validate() )
		{
			// Make service call to check if the AE Number already exists
			var params = new ServiceParams();
			params.addSimpleParameter("aeNumber", aeNumber);
			Services.callService("getAeExists", params, AEDetails_AENumber, true);
		}
	}
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
AEDetails_AENumber.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.AENUMBER_EXISTS_LIST_XPATH, dom);
	Services.setValue(XPathConstants.AENUMBER_RETRIEVED_IND_XPATH, "true");
	if ( Services.countNodes(XPathConstants.AENUMBER_EXISTS_LIST_XPATH + "/AeList/AeNumber") > 0 )
	{
		// The AE Number entered manually already exists
		Services.setFocus("AEDetails_AENumber");
	}
}

/*********************************************************************************/

function AEDetails_Date_Of_Receipt() {};
AEDetails_Date_Of_Receipt.tabIndex = 14;
AEDetails_Date_Of_Receipt.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Date_Of_Receipt.isEnabled = isValidCase;
AEDetails_Date_Of_Receipt.weekends = false;
AEDetails_Date_Of_Receipt.validateOn = [AEDetails_Date_Of_Receipt.dataBinding];
AEDetails_Date_Of_Receipt.validate = function()
{
	var dateOfReceipt = Services.getValue(AEDetails_Date_Of_Receipt.dataBinding);
	if( dateOfReceipt > CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) )
	{
		return ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
	}
	if(Services.countNodes(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + dateOfReceipt + "']") > 0)
	{
		return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
	}
	return null;
}
AEDetails_Date_Of_Receipt.logicOn = [Header_Case_Number.dataBinding];
AEDetails_Date_Of_Receipt.logic = function(event)
{
	if ( event.getXPath() != Header_Case_Number.dataBinding )
	{
		return;
	}

	if( isValidCase() )
	{
		Services.setValue(AEDetails_Date_Of_Receipt.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		setDirtyFlag();
	}
}
AEDetails_Date_Of_Receipt.helpText = "Date the application was received";
AEDetails_Date_Of_Receipt.retrieveOn = [AEDetails_AENumber.dataBinding];
AEDetails_Date_Of_Receipt.readOnlyOn = [AEDetails_ExistingAEsLov.dataBinding,Header_Case_Number.dataBinding];
AEDetails_Date_Of_Receipt.isReadOnly = isExistingOrMags;
AEDetails_Date_Of_Receipt.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Date_Of_Receipt.isMandatory = function() {return true;}

/*********************************************************************************/

function AEDetails_Application_Type_Code() {};
AEDetails_Application_Type_Code.tabIndex = 15;
AEDetails_Application_Type_Code.maxLength = 2;
AEDetails_Application_Type_Code.helpText = "Type code of application";
AEDetails_Application_Type_Code.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Application_Type_Code.isEnabled = isValidCase;
AEDetails_Application_Type_Code.retrieveOn = [AEDetails_AENumber.dataBinding];
AEDetails_Application_Type_Code.readOnlyOn = [Header_Case_Number.dataBinding, XPathConstants.READONLY_CASESTATUS_IND_XPATH];
AEDetails_Application_Type_Code.isReadOnly = function()
{
	if ( isMagsCase() || isScreenReadOnlyForCaseStatus() )
	{
		return true;
	}
	return false;
}
AEDetails_Application_Type_Code.transformToModel = function(value) {return (null != value) ? value.toUpperCase() : null;}
AEDetails_Application_Type_Code.isMandatory = function() { return true; }

AEDetails_Application_Type_Code.validate = function()
{
	var AETypeExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[./Id = " + AEDetails_Application_Type_Code.dataBinding + " and ./SelectForAE = 'true']");
	return AETypeExists ? null : ErrorCode.getErrorCode("CaseMan_AE_invalidAEType_Msg");
}

AEDetails_Application_Type_Code.logicOn = [AEDetails_Application_Type_Code.dataBinding, AEDetails_ExistingAEsLov.dataBinding];
AEDetails_Application_Type_Code.logic = function(event)
{
	if ( event.getXPath().indexOf(AEDetails_ExistingAEsLov.dataBinding) == -1 && 
		 event.getXPath() != AEDetails_Application_Type_Code.dataBinding )
	{
		return;
	}
	
	var typeCode = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if ( CaseManUtils.isBlank(typeCode) )
	{
		// If the Code field is blanked, blank the type description field
		Services.setValue(AEDetails_Application_Type.dataBinding, "");
	}
	else
	{
		var typeDesc = Services.getValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[./Id = " + AEDetails_Application_Type_Code.dataBinding + " and ./SelectForAE = 'true']/Name");
		if ( !CaseManUtils.isBlank(typeDesc) )
		{
			// If the Type code is valid, populate the type decsription field
			Services.setValue(AEDetails_Application_Type.dataBinding, typeDesc);
		}
	}
	
	copyPartiesForSelection();
	setDirtyFlag();
}

/*********************************************************************************/

function AEDetails_Application_Type() {};
AEDetails_Application_Type.tabIndex = 16;
AEDetails_Application_Type.srcDataOn = [XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType/SelectForAE"];
AEDetails_Application_Type.srcData = XPathConstants.REF_DATA_XPATH + "/AEAppTypes";
AEDetails_Application_Type.rowXPath = "AEAppType[./SelectForAE = 'true']";
AEDetails_Application_Type.keyXPath = "Name";
AEDetails_Application_Type.displayXPath = "Name";
AEDetails_Application_Type.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Application_Type.isEnabled = isValidCase;
AEDetails_Application_Type.helpText = "Type of application";
AEDetails_Application_Type.retrieveOn = [AEDetails_Application_Type_Code.dataBinding];
AEDetails_Application_Type.readOnlyOn = [Header_Case_Number.dataBinding, XPathConstants.READONLY_CASESTATUS_IND_XPATH];
AEDetails_Application_Type.isReadOnly = function()
{
	if ( isMagsCase() || isScreenReadOnlyForCaseStatus() )
	{
		return true;
	}
	return false;
}
AEDetails_Application_Type.isMandatory = function() { return true; }
AEDetails_Application_Type.logicOn = [AEDetails_Application_Type.dataBinding];
AEDetails_Application_Type.logic = function(event)
{
	if ( event.getXPath() != AEDetails_Application_Type.dataBinding )
	{
		return;
	}

	var typeDesc = Services.getValue(AEDetails_Application_Type.dataBinding);
	if ( CaseManUtils.isBlank(typeDesc) )
	{
		// If the Description field is blanked, blank the type code field
		Services.setValue(AEDetails_Application_Type_Code.dataBinding, "");
	}
	else
	{
		var typeCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[./Name = " + AEDetails_Application_Type.dataBinding + " and ./SelectForAE = 'true']/Id");
		if ( !CaseManUtils.isBlank(typeCode) )
		{
			// If the Type description is valid, populate the code field
			Services.setValue(AEDetails_Application_Type_Code.dataBinding, typeCode);
		}
	}
}

/*********************************************************************************/

function AEDetails_Date_Of_Issue() {};
AEDetails_Date_Of_Issue.tabIndex = 18;
AEDetails_Date_Of_Issue.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
AEDetails_Date_Of_Issue.isEnabled = isValidCase;
AEDetails_Date_Of_Issue.validateOn = [AEDetails_Date_Of_Receipt.dataBinding];
AEDetails_Date_Of_Issue.validate = function()
{
	var dateOfIssue = Services.getValue(AEDetails_Date_Of_Issue.dataBinding);
	if ( !CaseManUtils.isBlank(dateOfIssue) )
	{
		if( dateOfIssue < Services.getValue(AEDetails_Date_Of_Receipt.dataBinding))
		{
			return ErrorCode.getErrorCode("CaseMan_issueDateBeforeRequestDate_Msg");
		}
		
		/*
		 * TD4309: Kevin Gichohi (EDS)
		 * To improve compatibility with legacy whereby AEs are created in SUPS transfered to legacy and transfered back to SUPS.
		 * In this case, those with a date of issue later than 30-Sep-1998 will be flagged as invalid. Removing validation.
		 */
		/*
		if(Services.getValue(AEDetails_Exisiting_Case.dataBinding) == "Y" && CaseManUtils.createDate(dateOfIssue) > CaseManUtils.createDate("1998-09-30"))
		{
			return ErrorCode.getErrorCode("Caseman_AE_ExistingDateOfIssue_Msg");
		}
 */
	} 
	return null;
}

AEDetails_Date_Of_Issue.readOnlyOn = [AEDetails_Exisiting_Case.dataBinding, AEDetails_ExistingAEsLov.dataBinding];
AEDetails_Date_Of_Issue.isReadOnly = function() {return !isExistingCase() || isExistingAERecord();}
AEDetails_Date_Of_Issue.helpText = "Date of issue of Attachment of Earnings ";
AEDetails_Date_Of_Issue.retrieveOn = [AEDetails_AENumber.dataBinding];
AEDetails_Date_Of_Issue.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_Exisiting_Case.dataBinding];
AEDetails_Date_Of_Issue.isMandatory = function() {return isExistingCase() ? true : false;}

/*********************************************************************************/

function Fee_Amount_Currency() {};
Fee_Amount_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Amount_Currency.isReadOnly = function() { return true; }
Fee_Amount_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Amount_Currency.tabIndex = -1;
Fee_Amount_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Amount_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Total_Currency() {};
Fee_Total_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total_Currency.isReadOnly = function() { return true; }
Fee_Total_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Total_Currency.tabIndex = -1;
Fee_Total_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Currency() {};
Fee_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Currency.isReadOnly = function() { return true; }
Fee_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Currency.tabIndex = -1;
Fee_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Other_Fees_Currency() {};
Fee_Other_Fees_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Other_Fees_Currency.isReadOnly = function() { return true; }
Fee_Other_Fees_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Other_Fees_Currency.tabIndex = -1;
Fee_Other_Fees_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Other_Fees_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Payment_To_Date_Currency() {};
Fee_Payment_To_Date_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Payment_To_Date_Currency.isReadOnly = function() { return true; }
Fee_Payment_To_Date_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Payment_To_Date_Currency.tabIndex = -1;
Fee_Payment_To_Date_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Payment_To_Date_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Total_Remaining_Currency() {};
Fee_Total_Remaining_Currency.retrieveOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total_Remaining_Currency.isReadOnly = function() { return true; }
Fee_Total_Remaining_Currency.transformToDisplay = transformCurrencyToDisplay;
Fee_Total_Remaining_Currency.tabIndex = -1;
Fee_Total_Remaining_Currency.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total_Remaining_Currency.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Amount_Of_AE() {};
Fee_Amount_Of_AE.tabIndex = 20;
Fee_Amount_Of_AE.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Amount_Of_AE.isEnabled = isValidCase;
Fee_Amount_Of_AE.helpText = "Amount of Attachment of Earnings";
Fee_Amount_Of_AE.maxLength = 12;
Fee_Amount_Of_AE.transformToDisplay = convertToCurrencyBlank;

Fee_Amount_Of_AE.mandatoryOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_Application_Type_Code.dataBinding];
Fee_Amount_Of_AE.isMandatory = function() 
{
	var type = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if(type == AETypeCodes.JUDGMENTDEBT || type == AETypeCodes.MAINTENANCEARREARS)
	{
		return true;
	}
	return false;
}

Fee_Amount_Of_AE.validateOn = [Fee_Amount_Of_AE.dataBinding,AEDetails_Application_Type_Code.dataBinding];
Fee_Amount_Of_AE.validate = function()
{
	var value = Services.getValue(this.dataBinding);	
	if(CaseManValidationHelper.checkRegExp(value, [CaseManValidationHelper.CURRENCY_PATTERN], "1") != null)
	{		
		return ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg");
	}
	if(value < 0)
	{	 
		return ErrorCode.getErrorCode("CaseMan_AE_Amount_Msg");
	}
	if ( value >= 1000000000 )
	{
		// The maximum amount has been exceded (assuming 12 chars must be adhered to).
		var ec = ErrorCode.getErrorCode("CaseMan_maximumAmountXExceded_Msg");
		ec.m_message = ec.m_message.replace(/XXX/, 999999999.99);
		return ec;
	}
	
	var type = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if((value == null || value == 0) && (type == AETypeCodes.JUDGMENTDEBT || type == AETypeCodes.MAINTENANCEARREARS))
	{
		return ErrorCode.getErrorCode("CaseMan_AE_Amount_Msg");
	}
	
	/**
	 * Trac 2207 - Removed validation to cater for AEs that are overpaid by £1 or less
	if(Services.getValue(Fee_Payment_To_Date.dataBinding) * 1 > value * 1 + Services.getValue(Fee_Fee.dataBinding) * 1)
	{
		return ErrorCode.getErrorCode("CaseMan_AE_TotalPaidValidation_Msg");
	}
	*/
	
	return null;
}
Fee_Amount_Of_AE.logicOn = [Fee_Amount_Of_AE.dataBinding];
Fee_Amount_Of_AE.logic = function(event)
{
	if ( event.getXPath() == Fee_Amount_Of_AE.dataBinding )
	{
		setDirtyFlag();
	}
	// Update the totals fields
	updateFees();
}
Fee_Amount_Of_AE.retrieveOn = [AEDetails_AENumber.dataBinding];
Fee_Amount_Of_AE.readOnlyOn = [AEDetails_Application_Type_Code.dataBinding, XPathConstants.READONLY_CASESTATUS_IND_XPATH];
Fee_Amount_Of_AE.isReadOnly = function()
{
	if ( isScreenReadOnlyForCaseStatus() )
	{
		// Read Only for invalid case statuses
		return true;
	}

	var appTypeCode = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if( appTypeCode == AETypeCodes.PRIORITYMAIN || appTypeCode == AETypeCodes.MAGSORDER )
	{
		return true;
	}
	return false;
}

/*********************************************************************************/

function Fee_Fee() {};
Fee_Fee.tabIndex = 21;
Fee_Fee.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Fee.isEnabled = isValidCase;
Fee_Fee.helpText = "Fees for this Attachment of Earnings";
Fee_Fee.maxLength = 6;
Fee_Fee.transformToDisplay = convertToCurrencyBlank;
Fee_Fee.validateOn = [Fee_Fee.dataBinding];
Fee_Fee.validate = function()
{
	var ec = null;
	var fee = Services.getValue(Fee_Fee.dataBinding);
	
	if( CaseManValidationHelper.checkRegExp(fee, [CaseManValidationHelper.CURRENCY_PATTERN], "1") != null )
	{
		ec = ErrorCode.getErrorCode("CaseMan_invalidAmountFormat_Msg");
	}
	else if( CaseManValidationHelper.validateValueInRange(fee, 0.00, 999.99, "1") != null )
	{
		ec = new ErrorCode("1", "Amount must be in range " + 0.00 + " to " + 999.99);
	}
	/**
	 * Trac 2207 - Removed validation to cater for AEs that are overpaid by £1 or less
	else if(Services.getValue(Fee_Payment_To_Date.dataBinding) * 1 > Services.getValue(Fee_Amount_Of_AE.dataBinding) * 1 + Services.getValue(this.dataBinding) * 1)
	{
		ec = ErrorCode.getErrorCode("CaseMan_aeTotalPaidValidation_Msg");
	}
	*/
	return ec;
}
Fee_Fee.readOnlyOn = [AEDetails_Application_Type_Code.dataBinding, AEDetails_ExistingAEsLov.dataBinding];
Fee_Fee.isReadOnly = function()
{
	if ( isNewApplication() )
	{
		// Only editable on new AEs with a status of MN or JD
		var appTypeCode = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
		if ( appTypeCode == AETypeCodes.PRIORITYMAIN || appTypeCode == AETypeCodes.MAGSORDER )
		{
			return true;
		}
		return false;
	}
	return true;
}
Fee_Fee.logicOn = [Fee_Fee.dataBinding]
Fee_Fee.logic = function(event)
{
	var srcXPath = event.getXPath();
	if ( srcXPath == Fee_Fee.dataBinding )
	{
		// Handle warning messages
		var fee = Services.getValue(Fee_Fee.dataBinding);
		if( !CaseManUtils.isBlank(fee) && isNewApplication() )
		{
			var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
			if( aeType == AETypeCodes.JUDGMENTDEBT )
			{
				if( fee != Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardFees/JudgmentFee/Amount"))
				{
					alert(Messages.AE_TOTALFEESEXCEEDED_MESSAGE);
				}
			}
			else if( aeType == AETypeCodes.MAINTENANCEARREARS || aeType == AETypeCodes.PRIORITYMAIN)
			{
				if( fee != Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardFees/MaintenanceFee/Amount"))
				{
					alert(Messages.AE_TOTALFEESEXCEEDED_MESSAGE);
				}
			}
		}
		setDirtyFlag();
	}
	
	// Update the amount fields if the fee changes
	updateFees();
}

/*********************************************************************************/

function Fee_Total() {};
Fee_Total.tabIndex = -1;
Fee_Total.retrieveOn = [AEDetails_AENumber.dataBinding];
Fee_Total.isReadOnly = function() {return true;}
Fee_Total.transformToDisplay = convertToCurrency;
Fee_Total.helpText = "Total amount for this Attachment of Earnings";
Fee_Total.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Other_Fees() {};
Fee_Other_Fees.tabIndex = -1;
Fee_Other_Fees.retrieveOn = [AEDetails_AENumber.dataBinding];
Fee_Other_Fees.isReadOnly = function() {return true;}
Fee_Other_Fees.transformToDisplay = convertToCurrency;
Fee_Other_Fees.helpText = "Amount of other fees";
Fee_Other_Fees.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Other_Fees.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Payment_To_Date() {};
Fee_Payment_To_Date.tabIndex = -1;
Fee_Payment_To_Date.retrieveOn = [AEDetails_AENumber.dataBinding];
Fee_Payment_To_Date.isReadOnly = function() {return true;}
Fee_Payment_To_Date.transformToDisplay = convertToCurrency;
Fee_Payment_To_Date.helpText = "Amount paid so far";
Fee_Payment_To_Date.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Payment_To_Date.isEnabled = isValidCase;

/*********************************************************************************/

function Fee_Total_Remaining() {};
Fee_Total_Remaining.tabIndex = -1;
Fee_Total_Remaining.retrieveOn = [AEDetails_AENumber.dataBinding];
Fee_Total_Remaining.isReadOnly = function() {return true;}
Fee_Total_Remaining.transformToDisplay = convertToCurrency;
Fee_Total_Remaining.helpText = "Total remaining for this Attachment of Earnings";
Fee_Total_Remaining.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Fee_Total_Remaining.isEnabled = isValidCase;
Fee_Total_Remaining.logicOn = [XPathConstants.CHECK_EXISTING];
Fee_Total_Remaining.logic = function(event)
{
	if ( event.getXPath() != XPathConstants.CHECK_EXISTING )
	{
		return;
	}

	if(!CaseManUtils.isBlank(Services.getValue(XPathConstants.CHECK_EXISTING)))
	{
		Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "false");
		Services.setValue(XPathConstants.CHECK_EXISTING, "");
	}
}

/*********************************************************************************/

function Employer_Occupation() {};
Employer_Occupation.tabIndex = 30;
Employer_Occupation.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Occupation.isEnabled = isValidCase;
Employer_Occupation.helpText = "Occupation";
Employer_Occupation.maxLength = 30;
Employer_Occupation.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Occupation.transformToModel = function(value) { return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null; }
Employer_Occupation.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Occupation.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Occupation.logicOn = [Employer_Occupation.dataBinding];
Employer_Occupation.logic = function(event)
{
	if ( event.getXPath() != Employer_Occupation.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_Payroll_No() {};
Employer_Payroll_No.tabIndex = 31;
Employer_Payroll_No.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Payroll_No.isEnabled = isValidCase;
Employer_Payroll_No.helpText = "Payroll Number";
Employer_Payroll_No.maxLength = 30;
Employer_Payroll_No.transformToModel = function(value) { return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null; }
Employer_Payroll_No.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Payroll_No.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Payroll_No.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Payroll_No.logicOn = [Employer_Payroll_No.dataBinding];
Employer_Payroll_No.logic = function(event)
{
	if ( event.getXPath() != Employer_Payroll_No.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_Named_Person() {};
Employer_Named_Person.tabIndex = 32;
Employer_Named_Person.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Named_Person.isEnabled = isValidCase;
Employer_Named_Person.helpText = "Employer named person";
Employer_Named_Person.maxLength = 70;
Employer_Named_Person.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Named_Person.transformToModel = function(value) { return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null; }
Employer_Named_Person.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Named_Person.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Named_Person.logicOn = [Employer_Named_Person.dataBinding];
Employer_Named_Person.logic = function(event)
{
	if ( event.getXPath() != Employer_Named_Person.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Service_Line1() {};
Service_Line1.tabIndex = -1;
Service_Line1.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Line1.maxLength = 35;
Service_Line1.helpText = "First line of address";
Service_Line1.isReadOnly = function() {return true;}
Service_Line1.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Line1.isEnabled = isValidCase;

/*********************************************************************************/

function Service_Line2() {};
Service_Line2.tabIndex = -1;
Service_Line2.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Line2.maxLength = 35;
Service_Line2.helpText = "Second line of address";
Service_Line2.isReadOnly = function() {return true;}
Service_Line2.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Line2.isEnabled = isValidCase;

/*********************************************************************************/

function Service_Line3() {};
Service_Line3.tabIndex = -1;
Service_Line3.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Line3.maxLength = 35;
Service_Line3.helpText = "Third line of address";
Service_Line3.isReadOnly = function() {return true;}
Service_Line3.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Line3.isEnabled = isValidCase;

/*********************************************************************************/

function Service_Line4() {};
Service_Line4.tabIndex = -1;
Service_Line4.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Line4.maxLength = 35;
Service_Line4.helpText = "Fourth line of address";
Service_Line4.isReadOnly = function() {return true;}
Service_Line4.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Line4.isEnabled = isValidCase;

/*********************************************************************************/

function Service_Line5() {};
Service_Line5.tabIndex = -1;
Service_Line5.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Line5.maxLength = 35;
Service_Line5.helpText = "Fifth line of address";
Service_Line5.isReadOnly = function() {return true;}
Service_Line5.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Line5.isEnabled = isValidCase;

/*********************************************************************************/

function Service_PostCode() {};
Service_PostCode.tabIndex = -1;
Service_PostCode.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_PostCode.maxLength = 8;
Service_PostCode.helpText = "Post code of address";
Service_PostCode.isReadOnly = function() {return true;}
Service_PostCode.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_PostCode.isEnabled = isValidCase;

/*********************************************************************************/

function Service_Telephone() {};
Service_Telephone.tabIndex = 50;
Service_Telephone.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Telephone.helpText = "Telephone number of address";
Service_Telephone.maxLength = 24;
Service_Telephone.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Telephone.isEnabled = isValidCase;
Service_Telephone.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Service_Telephone.isReadOnly = isScreenReadOnlyForCaseStatus;
Service_Telephone.logicOn = [Service_Telephone.dataBinding];
Service_Telephone.logic = function(event)
{
	if ( event.getXPath() != Service_Telephone.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Service_Fax() {};
Service_Fax.tabIndex = 51;
Service_Fax.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Fax.helpText = "Fax number of address";
Service_Fax.maxLength = 24;
Service_Fax.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Fax.isEnabled = isValidCase;
Service_Fax.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Service_Fax.isReadOnly = isScreenReadOnlyForCaseStatus;
Service_Fax.logicOn = [Service_Fax.dataBinding];
Service_Fax.logic = function(event)
{
	if ( event.getXPath() != Service_Fax.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Service_Email() {};
Service_Email.tabIndex = 52;
Service_Email.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_Email.helpText = "Contact e-mail address";
Service_Email.maxLength = 254;
Service_Email.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_Email.isEnabled = isValidCase;
Service_Email.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Service_Email.isReadOnly = isScreenReadOnlyForCaseStatus;
Service_Email.validateOn = [Service_Email.dataBinding];
Service_Email.validate = function()
{
	var value = Services.getValue(this.dataBinding);	
	if(CaseManValidationHelper.checkRegExp(value, [CaseManValidationHelper.EMAIL_PATTERN], "1") != null)
	{
		return ErrorCode.getErrorCode("CaseMan_invalidEmailAddress_Msg");
	}
}
Service_Email.logicOn = [Service_Email.dataBinding];
Service_Email.logic = function(event)
{
	if ( event.getXPath() != Service_Email.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Service_PreferredMethodOfCommunication() {};
Service_PreferredMethodOfCommunication.tabIndex = 53;
Service_PreferredMethodOfCommunication.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_PreferredMethodOfCommunication.isEnabled = isValidCase;
Service_PreferredMethodOfCommunication.helpText = "Preferred method of communication";
Service_PreferredMethodOfCommunication.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_PreferredMethodOfCommunication.srcDataOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
Service_PreferredMethodOfCommunication.rowXPath = "Method";
Service_PreferredMethodOfCommunication.keyXPath = "Id";
Service_PreferredMethodOfCommunication.displayXPath = "Name";
Service_PreferredMethodOfCommunication.nullDisplayValue = "-- Select An Option --";
Service_PreferredMethodOfCommunication.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Service_PreferredMethodOfCommunication.isReadOnly = isScreenReadOnlyForCaseStatus;
Service_PreferredMethodOfCommunication.logicOn = [Service_PreferredMethodOfCommunication.dataBinding];
Service_PreferredMethodOfCommunication.logic = function(event)
{
	if ( event.getXPath() != Service_PreferredMethodOfCommunication.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Service_TranslationToWelsh() {};
Service_TranslationToWelsh.tabIndex = 54;
Service_TranslationToWelsh.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Service_TranslationToWelsh.isEnabled = isValidCase;
Service_TranslationToWelsh.helpText = "Welsh translation required";
Service_TranslationToWelsh.maxLength = 1;
Service_TranslationToWelsh.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Service_TranslationToWelsh.modelValue = {checked: "Y", unchecked: "N"};
Service_TranslationToWelsh.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Service_TranslationToWelsh.isReadOnly = isScreenReadOnlyForCaseStatus;
Service_TranslationToWelsh.logicOn = [Service_TranslationToWelsh.dataBinding];
Service_TranslationToWelsh.logic = function(event)
{
	if ( event.getXPath() != Service_TranslationToWelsh.dataBinding )
	{
		return;
	}
	setDirtyFlag();;
}

/*********************************************************************************/

function Sub_Line1() {};
Sub_Line1.tabIndex = -1;
Sub_Line1.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_Line1.maxLength = 35;
Sub_Line1.helpText = "First line of address";
Sub_Line1.isReadOnly = function() {return true;}
Sub_Line1.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_Line1.isEnabled = isValidCase;

/*********************************************************************************/

function Sub_Line2() {};
Sub_Line2.tabIndex = -1;
Sub_Line2.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_Line2.maxLength = 35;
Sub_Line2.helpText = "Second line of address";
Sub_Line2.isReadOnly = function() {return true;}
Sub_Line2.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_Line2.isEnabled = isValidCase;

/*********************************************************************************/

function Sub_Line3() {};
Sub_Line3.tabIndex = -1;
Sub_Line3.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_Line3.maxLength = 35;
Sub_Line3.helpText = "Third line of address";
Sub_Line3.isReadOnly = function() {return true;}
Sub_Line3.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_Line3.isEnabled = isValidCase;

/*********************************************************************************/

function Sub_Line4() {};
Sub_Line4.tabIndex = -1;
Sub_Line4.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_Line4.maxLength = 35;
Sub_Line4.helpText = "Fourth line of address";
Sub_Line4.isReadOnly = function() {return true;}
Sub_Line4.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_Line4.isEnabled = isValidCase;

/*********************************************************************************/

function Sub_Line5() {};
Sub_Line5.tabIndex = -1;
Sub_Line5.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_Line5.maxLength = 35;
Sub_Line5.helpText = "Fifth line of address";
Sub_Line5.isReadOnly = function() {return true;}
Sub_Line5.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_Line5.isEnabled = isValidCase;

/*********************************************************************************/

function Sub_PostCode() {};
Sub_PostCode.tabIndex = -1;
Sub_PostCode.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Sub_PostCode.maxLength = 8;
Sub_PostCode.helpText = "Post code of address";
Sub_PostCode.isReadOnly = function() {return true;}
Sub_PostCode.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Sub_PostCode.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Line1() {};
Employer_Line1.tabIndex = -1;
Employer_Line1.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Line1.maxLength = 35;
Employer_Line1.helpText = "First line of address";
Employer_Line1.isReadOnly = function() {return true;}
Employer_Line1.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Line1.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Line2() {};
Employer_Line2.tabIndex = -1;
Employer_Line2.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Line2.maxLength = 35;
Employer_Line2.helpText = "Second line of address";
Employer_Line2.isReadOnly = function() {return true;}
Employer_Line2.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Line2.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Line3() {};
Employer_Line3.tabIndex = -1;
Employer_Line3.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Line3.maxLength = 35;
Employer_Line3.helpText = "Third line of address";
Employer_Line3.isReadOnly = function() {return true;}
Employer_Line3.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Line3.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Line4() {};
Employer_Line4.tabIndex = -1;
Employer_Line4.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Line4.maxLength = 35;
Employer_Line4.helpText = "Fourth line of address";
Employer_Line4.isReadOnly = function() {return true;}
Employer_Line4.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Line4.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Line5() {};
Employer_Line5.tabIndex = -1;
Employer_Line5.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Line5.maxLength = 35;
Employer_Line5.helpText = "Fifth line of address";
Employer_Line5.isReadOnly = function() {return true;}
Employer_Line5.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Line5.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_PostCode() {};
Employer_PostCode.tabIndex = -1;
Employer_PostCode.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_PostCode.maxLength = 8;
Employer_PostCode.helpText = "Post code of address";
Employer_PostCode.isReadOnly = function() {return true;}
Employer_PostCode.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_PostCode.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Reference() {};
Employer_Reference.tabIndex = -1;
Employer_Reference.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Employer_Reference.maxLength = 25;
Employer_Reference.helpText = "Employer reference";
Employer_Reference.isReadOnly = function() {return true;}
Employer_Reference.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Reference.isEnabled = isValidCase;

/*********************************************************************************/

function Employer_Name() {};
Employer_Name.tabIndex = 60;
Employer_Name.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Name.isEnabled = isValidCase;
Employer_Name.helpText = "Employer Name";
Employer_Name.maxLength = 70;
Employer_Name.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Name.transformToModel = function(value) { return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null; }
Employer_Name.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Name.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Name.logicOn = [Employer_Name.dataBinding];
Employer_Name.logic = function(event)
{
	if ( event.getXPath() != Employer_Name.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_Telephone() {};
Employer_Telephone.tabIndex = 61;
Employer_Telephone.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Telephone.isEnabled = isValidCase;
Employer_Telephone.helpText = "Telephone number of address";
Employer_Telephone.maxLength = 24;
Employer_Telephone.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Telephone.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Telephone.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Telephone.logicOn = [Employer_Telephone.dataBinding];
Employer_Telephone.logic = function(event)
{
	if ( event.getXPath() != Employer_Telephone.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_Fax() {};
Employer_Fax.tabIndex = 62;
Employer_Fax.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Fax.isEnabled = isValidCase;
Employer_Fax.helpText = "Fax number of address";
Employer_Fax.maxLength = 24;
Employer_Fax.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Fax.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Fax.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Fax.logicOn = [Employer_Fax.dataBinding];
Employer_Fax.logic = function(event)
{
	if ( event.getXPath() != Employer_Fax.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_Email() {};
Employer_Email.tabIndex = 63;
Employer_Email.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_Email.isEnabled = isValidCase;
Employer_Email.helpText = "Contact e-mail address";
Employer_Email.maxLength = 254;
Employer_Email.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_Email.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_Email.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_Email.validateOn = [Service_Email.dataBinding];
Employer_Email.validate = function()
{
	var value = Services.getValue(this.dataBinding);	
	if(CaseManValidationHelper.checkRegExp(value, [CaseManValidationHelper.EMAIL_PATTERN], "1") != null)
	{
		return ErrorCode.getErrorCode("CaseMan_invalidEmailAddress_Msg");
	}
}
Employer_Email.logicOn = [Employer_Email.dataBinding];
Employer_Email.logic = function(event)
{
	if ( event.getXPath() != Employer_Email.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_PreferredMethodOfCommunication() {};
Employer_PreferredMethodOfCommunication.tabIndex = 64;
Employer_PreferredMethodOfCommunication.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_PreferredMethodOfCommunication.isEnabled = isValidCase;
Employer_PreferredMethodOfCommunication.helpText = "Preferred method of communication";
Employer_PreferredMethodOfCommunication.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_PreferredMethodOfCommunication.srcDataOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
Employer_PreferredMethodOfCommunication.rowXPath = "Method";
Employer_PreferredMethodOfCommunication.keyXPath = "Id";
Employer_PreferredMethodOfCommunication.displayXPath = "Name";
Employer_PreferredMethodOfCommunication.nullDisplayValue = "-- Select An Option --";
Employer_PreferredMethodOfCommunication.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_PreferredMethodOfCommunication.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_PreferredMethodOfCommunication.logicOn = [Employer_PreferredMethodOfCommunication.dataBinding];
Employer_PreferredMethodOfCommunication.logic = function(event)
{
	if ( event.getXPath() != Employer_PreferredMethodOfCommunication.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Employer_TranslationToWelsh() {};
Employer_TranslationToWelsh.tabIndex = 65;
Employer_TranslationToWelsh.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Employer_TranslationToWelsh.isEnabled = isValidCase;
Employer_TranslationToWelsh.helpText = "Welsh translation required"
Employer_TranslationToWelsh.maxLength = 1;
Employer_TranslationToWelsh.retrieveOn = [AEDetails_AENumber.dataBinding];
Employer_TranslationToWelsh.modelValue = {checked: "Y", unchecked: "N"};
Employer_TranslationToWelsh.readOnlyOn = [XPathConstants.READONLY_CASESTATUS_IND_XPATH]
Employer_TranslationToWelsh.isReadOnly = isScreenReadOnlyForCaseStatus;
Employer_TranslationToWelsh.logicOn = [Employer_TranslationToWelsh.dataBinding];
Employer_TranslationToWelsh.logic = function(event)
{
	if ( event.getXPath() != Employer_TranslationToWelsh.dataBinding )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function Work_Line1() {};
Work_Line1.tabIndex = -1;
Work_Line1.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_Line1.maxLength = 35;
Work_Line1.helpText = "First line of address";
Work_Line1.isReadOnly = function() {return true;}
Work_Line1.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_Line1.isEnabled = isValidCase;

/*********************************************************************************/

function Work_Line2() {};
Work_Line2.tabIndex = -1;
Work_Line2.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_Line2.maxLength = 35;
Work_Line2.helpText = "Second line of address";
Work_Line2.isReadOnly = function() {return true;}
Work_Line2.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_Line2.isEnabled = isValidCase;

/*********************************************************************************/

function Work_Line3() {};
Work_Line3.tabIndex = -1;
Work_Line3.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_Line3.maxLength = 35;
Work_Line3.helpText = "Third line of address";
Work_Line3.isReadOnly = function() {return true;}
Work_Line3.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_Line3.isEnabled = isValidCase;

/*********************************************************************************/

function Work_Line4() {};
Work_Line4.tabIndex = -1;
Work_Line4.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_Line4.maxLength = 35;
Work_Line4.helpText = "Fourth line of address";
Work_Line4.isReadOnly = function() {return true;}
Work_Line4.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_Line4.isEnabled = isValidCase;

/*********************************************************************************/

function Work_Line5() {};
Work_Line5.tabIndex = -1;
Work_Line5.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_Line5.maxLength = 35;
Work_Line5.helpText = "Fifth line of address";
Work_Line5.isReadOnly = function() {return true;}
Work_Line5.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_Line5.isEnabled = isValidCase;

/*********************************************************************************/

function Work_PostCode() {};
Work_PostCode.tabIndex = -1;
Work_PostCode.retrieveOn = [Header_Party_Against.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH];
Work_PostCode.maxLength = 8;
Work_PostCode.helpText = "Post code of address";
Work_PostCode.isReadOnly = function() {return true;}
Work_PostCode.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH];
Work_PostCode.isEnabled = isValidCase;

/******************************** BUTTONS *****************************************/

function Header_Party_ForLovBtn() {};
Header_Party_ForLovBtn.tabIndex = 4;
Header_Party_ForLovBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding, Header_Party_Against.dataBinding];
Header_Party_ForLovBtn.isEnabled = function() 
{
	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	var partyAgainst = Services.getValue(Header_Party_Against.dataBinding);
	if ( aeType == AETypeCodes.JUDGMENTDEBT && CaseManUtils.isBlank(partyAgainst) )
	{
		// Retrieved if new AE with type of Judgment Debt and the Debtor has not been selected
		return false;
	}

	// Enabled if a valid case is loaded and the case is not existing or not MAGS ORDER
	return areLovsEnabled() ? true : false;
}

/*********************************************************************************/

function Header_Party_AgainstLovBtn() {};
Header_Party_AgainstLovBtn.tabIndex = 6;
Header_Party_AgainstLovBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
Header_Party_AgainstLovBtn.isEnabled = function() 
{
	// Enabled if a valid case is loaded and the case is not existing or not MAGS ORDER
	return areLovsEnabled() ? true : false;
}

/*********************************************************************************/

function AEDetails_ExistingAEsLovBtn() {};
AEDetails_ExistingAEsLovBtn.tabIndex = 2;
AEDetails_ExistingAEsLovBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Case_Number.dataBinding];
AEDetails_ExistingAEsLovBtn.isEnabled = function()
{
	if ( isValidCase() && !isMagsCase() && Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication") > 0)
	{ 
		return true;
	}
	return false;
}
/**
 * @author pz9j2w
 * 
 */
AEDetails_ExistingAEsLovBtn.actionBinding = function()
{
	if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_LOADNEWAE);
		Status_SaveBtn.actionBinding();
	}
	else
	{
		loadExistingAEs();
	}
}

/*********************************************************************************/

function AEDetails_Application_TypeLovBtn() {};
AEDetails_Application_TypeLovBtn.tabIndex = 17;
AEDetails_Application_TypeLovBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, XPathConstants.READONLY_CASESTATUS_IND_XPATH, AEDetails_ExistingAEsLov.dataBinding, Header_Case_Number.dataBinding];
AEDetails_Application_TypeLovBtn.isEnabled = function()
{
	if ( isValidCase() && !isMagsCase() && !isScreenReadOnlyForCaseStatus() )
	{
		// Enabled for valid cases which are not MAGS ORDER and have a valid case status
		return true;
	}
	return false;
}

/*********************************************************************************/

function Add_AddressBtn() {};
Add_AddressBtn.tabIndex = 70;
Add_AddressBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, XPathConstants.READONLY_CASESTATUS_IND_XPATH, Address_Paged_Area.dataBinding, Header_Case_Number.dataBinding, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
Add_AddressBtn.isEnabled = function()
{
	if ( isValidCase() && validJudgmentDebtor() && !isScreenReadOnlyForCaseStatus() )
	{
		// Valid Case loaded with a valid case status and a valid Judgment Debtor
		var tabbedPage = Services.getValue(Address_Paged_Area.dataBinding);
		if ( tabbedPage == AddressTypeCodes.SERVICE || tabbedPage == AddressTypeCodes.SUBSERVICE )
		{
			// Service and SubService Details are always disabled for MAGS ORDER AEs
			return isMagsCase() ? false : true;
		}
		else
		{
			// Always enabled for Workplace and Employer Details
			return true;
		}
	}
	else
	{
		// Disabled if a valid case has not been loaded or if the Judgment Debtor is not valid
		return false;
	}
}

/**
 * @author pz9j2w
 * @return null 
 */
Add_AddressBtn.actionBinding = function()
{
	var tabbedPage = Services.getValue(Address_Paged_Area.dataBinding);
	if( tabbedPage == AddressTypeCodes.SERVICE )
	{
		var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
		var currentAddressDateFrom = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = " + Address_Paged_Area.dataBinding + " and ./DateTo = '']/DateFrom");
		if( currentAddressDateFrom == systemDate )
		{
			// Can only add new Service Address once a day
			var ec = ErrorCode.getErrorCode("Caseman_AE_ServiceAddressUpdate_Msg");
			Services.setTransientStatusBarMessage( ec.getMessage() );				
			return;
		}
	}
	
	if( tabbedPage != AddressTypeCodes.EMPLOYER)
	{
		// Launch the Add New Service/Substituted/Workplace Address Subform
		Services.dispatchEvent("addNewAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		// Launch the Add New Employer Address Subform
		Services.dispatchEvent("addNewEmpAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/*********************************************************************************/

function View_HistoryBtn() {};
View_HistoryBtn.tabIndex = 71;
View_HistoryBtn.enableOn = [Address_Paged_Area.dataBinding, XPathConstants.ADD_ADDRESS_FLAG_XPATH, XPathConstants.ENABLE_FIELDS_XPATH, Header_Case_Number.dataBinding, Header_Party_Against.dataBinding, Header_Party_For.dataBinding, AEDetails_Application_Type_Code.dataBinding];
View_HistoryBtn.isEnabled = function()
{
	if ( isValidCase() && validJudgmentDebtor() )
	{
		var tabbedPage = Services.getValue(Address_Paged_Area.dataBinding);
		if ( tabbedPage == AddressTypeCodes.SERVICE || tabbedPage == AddressTypeCodes.SUBSERVICE )
		{
			// Service and SubService Details are always disabled for MAGS ORDER AEs
			if ( isMagsCase() )
			{
				return false;
			}
			// Enabled if historical details exist
			return isValidHistory() ? true : false;
		}
		else
		{
			// Always enabled for Workplace and Employer Details (if historical details exist)
			return isValidHistory() ? true : false;
		}
	}
	else
	{
		// Disabled if a valid case has not been loaded or if the Judgment Debtor is not valid
		return false;
	}
}

/**
 * @author pz9j2w
 * 
 */
View_HistoryBtn.actionBinding = function()
{
	var tabbedPage = Services.getValue(Address_Paged_Area.dataBinding);
	if( tabbedPage != AddressTypeCodes.EMPLOYER)
	{
		Services.dispatchEvent("viewHistAddresses_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		Services.dispatchEvent("viewEmpHistAddresses_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/*********************************************************************************/

function Status_SaveBtn() {};
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "ManageAE" } ]
	}
};
Status_SaveBtn.tabIndex = 80;
Status_SaveBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, XPathConstants.READONLY_CASESTATUS_IND_XPATH, AEDetails_ExistingAEsLov.dataBinding, XPathConstants.DIRTY_DATA_XPATH];
Status_SaveBtn.isEnabled = function()
{
	if ( !isValidCase() || isScreenReadOnlyForCaseStatus() )
	{
		// Disabled if no valid case loaded, or the case status is invalid
		return false;
	}
	
	if ( isNewApplication() )
	{
		// Enabled if a new application
		return true;
	}

	if ( isExistingAERecord() && isDirtyData() )
	{
		// Enabled if existing dirty record
		return true;
	}
	return false;
}

/**
 * @author pz9j2w
 * 
 */
Status_SaveBtn.actionBinding = function()
{
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( invalidFields.length == 0 )
	{
		// Form is valid, set the Judgment Debtor and Creditor fields and save the AE
		setPartyRoles();
		
		if( !isExistingOrMags() && !isExistingCase() )
		{
			// The AE requires a new AE Number
			getNewAENumber();
		}
		else
		{
			saveCaseAe();
		}
	}
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
Status_SaveBtn.onSuccess = function(dom)
{
	Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "false");
	var aeStatus = Services.getValue(XPathConstants.VARIABLES + "/NewAE");
	if ( aeStatus == "New" )
	{
		var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
		alert( Messages.format(Messages.AE_CREATED_MESSAGE, [aeNumber]) );
        
		// See if need to go to Oracle Reports
		if ( !postAddAEEventNavigate(dom) )
		{
			// No navigation so clear the screen
			initialiseForm();
		}
	}
	else
	{
		var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
		
		switch ( tempAction )
		{
			case ManageAEActions.ACTION_NAVIGATE:
				// User wishes to navigate following a save
				NavigationController.nextScreen();
				break;
				
			case ManageAEActions.ACTION_CLEARFORM:
				// User wishes to clear the form following a save
				clearForm();
				break;
				
			case ManageAEActions.ACTION_EXIT:
				// User wishes to exit the screen following a save
				exitScreen();
				break;
			
			case ManageAEActions.ACTION_LOADNEWAE:
				// User loading another AE record after data retrieved
				Services.setValue(XPathConstants.ACTION_AFTER_RET_XPATH, ManageAEActions.ACTION_LOADNEWAE);
			default:
				// No actions, retrieve the data on screen
				getExistingCaseAe();
		}
        Services.setTransientStatusBarMessage(Messages.AE_SAVED_MESSAGE); 
	}
}

/**
 * @param exception
 * @author pz9j2w
 * 
 */
Status_SaveBtn.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		initialiseForm();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author pz9j2w
 * 
 */
Status_SaveBtn.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/*********************************************************************************/

function Status_ClearBtn() {};
Status_ClearBtn.tabIndex = 81;
Status_ClearBtn.enableOn = [XPathConstants.ENABLE_FIELDS_XPATH, Header_Case_Number.dataBinding];
Status_ClearBtn.isEnabled = isValidCase;
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "ManageAE", alt: true } ]
	}
};
/**
 * @author pz9j2w
 * 
 */
Status_ClearBtn.actionBinding = function()
{
	// Change focus to Clear button so won't be on an IE select which can lose focus
	Services.setFocus("Status_ClearBtn");
	if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_CLEARFORM);
		Status_SaveBtn.actionBinding();
	}
	else
	{
		setTimeout("clearForm();",0);
	}
}

/*********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ManageAE" } ]
	}
};
Status_CloseBtn.tabIndex = 82;
/**
 * @author pz9j2w
 * 
 */
Status_CloseBtn.actionBinding = function()
{
	if( isDirtyData() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ManageAEActions.ACTION_EXIT);
		Status_SaveBtn.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/************************** HELPER FUNCTIONS *************************************/

/**
 * Function handles the exit from the screen
 * @author pz9j2w
 * 
 */
function exitScreen()
{
	Services.removeNode(ManageAEParams.PARENT);
	Services.removeNode(CaseManFormParameters.OR_COURT_CODE_XPATH);
	if( NavigationController.callStackExists() )
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
 * Function indicates whether or not the current AE record is a new application
 *
 * @return [Boolean] True if is a new AE application, else false
 * @author pz9j2w
 */
function isNewApplication()
{
	var aeStatus = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/AEStatus");
	return ( aeStatus == "NEW" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function indicates whether or not a valid case is loaded
 *
 * @return [Boolean] True if a valid case is loaded, else false
 * @author pz9j2w
 */
function isValidCase()
{
	var fieldsEnabled = Services.getValue(XPathConstants.ENABLE_FIELDS_XPATH);
	return ( fieldsEnabled == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function indicates whether or not the historical addresses exist for the currently
 * selected address type
 *
 * @return [Boolean] True if historical addresses exist, else false
 * @author pz9j2w
 */
function isValidHistory()
{
	if(Services.getValue(Address_Paged_Area.dataBinding) == AddressTypeCodes.EMPLOYER)
	{
		if(Services.countNodes(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/Addresses/Address[./DateTo != '']"))
		{
			return true;
		}
	}
	else
	{
		if(Services.countNodes(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails/Addresses/Address[./TypeCode = " + Address_Paged_Area.dataBinding + " and ./DateTo != '']"))
		{
			return true;
		}
	}
	return false;
}

/*********************************************************************************/

/**
 * Function indicates whether or not the Existing Case flag is set to Y
 *
 * @return [Boolean] True if the Existing Case flag is set to Y, else false
 * @author pz9j2w
 */
function isExistingCase()
{
	return Services.getValue(AEDetails_Exisiting_Case.dataBinding) == "Y";
}

/*********************************************************************************/

/**
 * Function indicates whether or not an existing AE record is loaded
 *
 * @return [Boolean] True an existing AE record is loaded, else false
 * @author pz9j2w
 */
function isExistingAERecord()
{
	var lovValue = Services.getValue(AEDetails_ExistingAEsLov.dataBinding);
	return CaseManUtils.isBlank(lovValue) ? false : true;
}

/*********************************************************************************/

/**
 * Function indicates whether or not the Judgment Debtor and Judgment Creditor LOV
 * buttons should be enabled or not
 *
 * @return [Boolean] True if the LOV buttons should be enabled, else false
 * @author pz9j2w
 */
function areLovsEnabled()
{
	return isValidCase() && !isExistingOrMags();
}

/*********************************************************************************/

/**
 * Function converts an amount field to 2 decimal places.  If the amount is blank
 * then nothing is displayed
 *
 * @param [Float] value The amount to be converted
 * @return [Float] The amount converted to 2 decimal places or blan
 * @author pz9j2w
 */
function convertToCurrencyBlank(value)
{
	if(isNaN(value))
	{
		return value;
	}
	var fVal = parseFloat(value).toFixed(2);
	if (fVal.length > this.maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;

	//return (CaseManUtils.isBlank(value)) ? "" : parseFloat(value).toFixed(2);
}

/*********************************************************************************/

/**
 * Function converts an amount field to 2 decimal places.  If the amount is blank
 * then 0.00 is displayed
 *
 * @param [Float] value The amount to be converted
 * @return [Float] The amount converted to 2 decimal places or blank if no case loaded
 * @author pz9j2w
 */
function convertToCurrency(value)
{
	if ( !isValidCase() )
	{
		return "";
	}
	if(isNaN(value))
	{
		return value;
	}
	return (CaseManUtils.isBlank(value)) ? "0.00" : parseFloat(value).toFixed(2);
}

/*********************************************************************************/

/**
 * Function, together with the onSuccess generates a new AE Number from the database,
 * displays the new AE Number on screen via an alert popup
 * and continues saving the new AE
 * @author pz9j2w
 * 
 */
function getNewAENumber()
{
	// Call the service to generate the new AE Number
	var params = new ServiceParams();
	Services.callService("getNextAeNumber", params, getNewAENumber, true);
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
getNewAENumber.onSuccess = function(dom)
{
	var results = dom.selectSingleNode("/ds/Ae/AeNumber");
	if( null != results )
	{	 
		var newAENumber = CaseManUtils.stripSpaces(XML.getNodeTextContent(results));		 
		Services.setValue(AEDetails_AENumber.dataBinding, newAENumber); 
		saveCaseAe();
	}
	else
	{
		this.onError();
	}
}

/**
 * @author pz9j2w
 * 
 */
getNewAENumber.onError = function()
{
	Services.removeNode(XPathConstants.VARIABLES + "/AENumber");
	alert("Error: Could not generate a new AE number, application has not been saved");
}

/*********************************************************************************/

/**
 * Function handles the clearing of the form
 * @author pz9j2w
 * 
 */
function clearForm()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_APP_XPATH + "/CaseData");
	Services.removeNode(ManageAEParams.PARENT);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.setValue(AEDetails_ExistingAEsLov.dataBinding, "");
	Services.setValue(Address_Paged_Area.dataBinding, AddressTypeCodes.SERVICE);
	Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "false");
	Services.setValue(XPathConstants.ENABLE_FIELDS_XPATH, "false");
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	
	Services.endTransaction();
	Services.setFocus("Header_Case_Number");
}

/*********************************************************************************/

/**
 * Function handles the initialisation of the form
 * @author pz9j2w
 * 
 */
function initialiseForm()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.setValue(Address_Paged_Area.dataBinding, AddressTypeCodes.SERVICE);
	Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "false");
	Services.endTransaction();
	Services.setFocus("Header_Case_Number");
}

/*********************************************************************************/

/**
 * Function sets the Dirty flag once a change has been made
 * @author pz9j2w
 * 
 */
function setDirtyFlag()
{
	if ( isValidCase() && Services.getValue(XPathConstants.DIRTY_DATA_XPATH) != "true" )
	{	
		Services.setValue(XPathConstants.DIRTY_DATA_XPATH, "true");
	}
}

/*********************************************************************************/

/**
 * Function indicates whether or not the data is dirty (unsaved changes)
 *
 * @return [Boolean] True if the data is dirty, else false
 * @author pz9j2w
 */
function isDirtyData()
{
	var isDirty = Services.getValue(XPathConstants.DIRTY_DATA_XPATH);
	return ( isValidCase() && isDirty == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * Function sets the Judgment Debtor and Judgment Creditor nodes in the data model
 * based upon the parties selected in the fields.
 * @author pz9j2w
 * 
 */
function setPartyRoles()
{
	Services.startTransaction();
	var partyRoleCode = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH	+ "/Creditor/Parties/Party[./PartyId = " + Header_Party_For.dataBinding + "]/PartyRoleCode");
	var casePartyNumber = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH	+ "/Creditor/Parties/Party[./PartyId = " + Header_Party_For.dataBinding + "]/CasePartyNumber");
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/PartyForPartyRoleCode", partyRoleCode);
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/PartyForCasePartyNumber", casePartyNumber);
	
	partyRoleCode = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/PartyRoleCode");
	casePartyNumber = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/CasePartyNumber");
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/PartyAgainstPartyRoleCode", partyRoleCode);
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/PartyAgainstCasePartyNumber", casePartyNumber);
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets the additional default fields for a new Magistates AE Application
 * @author pz9j2w
 * 
 */
function setMagistratesFields()
{
	// Set the Fee & AE Number fields differently based on AE Type (MAGS ORDER)
	if( isMagsCase() )
	{
		var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
		Services.setValue(AEDetails_AENumber.dataBinding, caseNumber);
		Services.setValue(Fee_Amount_Of_AE.dataBinding, "0.00");	
		Services.setValue(Fee_Fee.dataBinding, "0.00");
		
		if ( Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication") == 0 )
		{
			// Existing MAGS ORDER AE (Case Number is same as AE Number)
			Services.setValue(AEDetails_ExistingAEsLov.dataBinding, caseNumber);
		}
	}
	else
	{
		Services.setValue(AEDetails_AENumber.dataBinding, "");
		Services.setValue(Fee_Amount_Of_AE.dataBinding, "");	
		Services.setValue(Fee_Fee.dataBinding, "");
	}
}

/*********************************************************************************/

/**
 * Function sets the default fields for a new AE Application
 * @author pz9j2w
 * 
 */
function setDefaultAEFields()
{
	var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	//var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding); // Case owning court
	var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH); // User court
	
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/AEStatus", "NEW" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/DateOfCreation", systemDate );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/AmountOfAECurrency", defaultCurrency );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/AEFeeCurrency", defaultCurrency );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/CaseNumber", caseNumber );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/CourtCode", owningCourt );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/JudgementSeq", "");
	Services.setValue(Employer_Occupation.dataBinding, "" );
	Services.setValue(Employer_Payroll_No.dataBinding, "" );
	Services.setValue(Employer_Named_Person.dataBinding, "" );
	Services.setValue(AEDetails_Exisiting_Case.dataBinding, "N" );
	Services.setValue(AEDetails_Caps_Id.dataBinding, "" );
	Services.setValue(AEDetails_Caps_Check.dataBinding, "" );
	Services.setValue(AEDetails_Date_Of_Receipt.dataBinding, systemDate );
	Services.setValue(AEDetails_Date_Of_Issue.dataBinding, systemDate );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/DebtorsEmployersPartyId", "" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/PartyId", "" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/PersonRequestedName", "" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/TypeCode", AddressTypeCodes.EMPLOYER);
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/TelephoneNumber", "" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/FaxNumber", "" );
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/Employer/ContactDetails/EmailAddress", "" );
	Services.setValue(Employer_PreferredMethodOfCommunication.dataBinding, "LE" );
	Services.setValue(Employer_TranslationToWelsh.dataBinding, "N" );
}

/*********************************************************************************/

/**
 * Function adds a new fee to the DOM just prior to creating a new AE
 * @author pz9j2w
 * 
 */
function addNewFee()
{
	var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
	var fee = Services.getValue(Fee_Fee.dataBinding);
	var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	//var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding); // Case owning court
	var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH); // User court

	var newAmount = Services.loadDOMFromURL("NewAmount.xml");
	XML.setElementTextContent(newAmount, "/NewFee/ProcessNo", aeNumber);
	XML.setElementTextContent(newAmount, "/NewFee/AllocationDate", systemDate);
	XML.setElementTextContent(newAmount, "/NewFee/IssuingCourt", owningCourt);
	XML.setElementTextContent(newAmount, "/NewFee/CreatedBy", Services.getCurrentUser() );
	XML.setElementTextContent(newAmount, "/NewFee/CreatedDate", systemDate);
	XML.setElementTextContent(newAmount, "/NewFee/AmountCurrency", defaultCurrency);
	XML.setElementTextContent(newAmount, "/NewFee/Amount", fee);
	
	Services.replaceNode(XPathConstants.SELECTED_AE_XPATH + "/NewFee", newAmount);
}

/*********************************************************************************/

/**
 * Function handles the saving of a new/existing AE record
 * @author pz9j2w
 * 
 */
function saveCaseAe()
{
	// Check to see if AE is new before saving
	var countAe = Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication[./AENumber = " + AEDetails_AENumber.dataBinding + "]/AENumber");
	if( countAe == 0 )
	{
		var AeEventNew = "Y";
		Services.setValue(XPathConstants.VARIABLES + "/NewAE", "New");
		
		// Create a new AE Fee for a new AE (unless Existing AE Flag is checked - UCT Defect 669)
		var existingAEFlag = Services.getValue(AEDetails_Exisiting_Case.dataBinding);
		var aeFee = Services.getValue(Fee_Fee.dataBinding);
		if( !CaseManUtils.isBlank(aeFee) && existingAEFlag != "Y" )
		{
			addNewFee();
		}
		
		// Set the Judgment Sequence Number for Oracle Reports
		var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
		if( aeType == AETypeCodes.JUDGMENTDEBT )
		{
			var judgmentId = Services.getValue(XPathConstants.JUDGMENT_ID);
			Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/JudgementSeq", judgmentId );
		}
	}
	
	// Replace the selected AE back into existing Ae's on the case before saving case
	var aeNode = Services.getNode(XPathConstants.SELECTED_AE_XPATH);
	Services.replaceNode(XPathConstants.AE_RESULTS_XPATH + "/AEApplication[./AENumber = " + AEDetails_ExistingAEsLov.dataBinding + "]", aeNode );
	
	// Replace the Debtor's contact details with the details entered in AE
	var debtorContactDetailsNode = Services.getNode(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails");
	Services.replaceNode(XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/ContactDetails", debtorContactDetailsNode);
	
	// Set AE Event fields
	addNewAEEvent();

	// Save case and associated AE's
	var newDOM = XML.createDOM(null, null, null);
	var rootNode = XML.createElement(newDOM, "ds");
	
	// AE fields
	var caseNode = Services.getNode(XPathConstants.CASE_RESULTS_XPATH);
	rootNode.appendChild(caseNode);
	var dsNode = newDOM.appendChild(rootNode);
	
	// AE Event fields
	var resultsAE = Services.getNode(XPathConstants.AE_EVENT_XPATH);
	if ( null != resultsAE )
	{
		var AEEventNode = XML.createElement(rootNode, "AEEvents");
		AEEventNode.appendChild(resultsAE);
		dsNode.appendChild(AEEventNode);
	}
	else
	{
		// MAGS ORDER Cases do not create an AE Event
		AeEventNew = "N";
	}
	
	// Add Service Parameters and call service
	var params = new ServiceParams();
	params.addDOMParameter("AEDetails",	newDOM);
	var newEventParam = ( AeEventNew == "Y" ) ? "Y" : "N";
	params.addSimpleParameter("AEEventNew",	newEventParam);
	Services.callService("updateCaseAeAddEvent", params, Status_SaveBtn, true);
}

/*********************************************************************************/

/**
 * Function handles the retrieval of screen data following a save
 * @author pz9j2w
 * 
 */
function getExistingCaseAe()
{
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
	Services.setValue(XPathConstants.VARIABLES + "/ExternalAENumber", aeNumber);
	Services.setValue(AEDetails_ExistingAEsLov.dataBinding, "");

	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber );
	Services.callService("getCaseAe", params, Header_Case_Number, true);
}

/*********************************************************************************/

/**
 * Function handles the navigation following the creation of a new AE
 * If the new AE is MAGS ORDER, the user returns to the Create Case screen in blank mode.
 * Otherwise, the user navigates to the oracle reports parameter screen.
 *
 * @param [Object] dom The DOM object returned by the commit service
 * @return [Boolean] True if navigating away from the screen following save, else false.
 * @author pz9j2w
 */
function postAddAEEventNavigate(dom)
{
	if ( isMagsCase() )
	{
		if ( NavigationController.callStackExists() )
		{
			// Have just created a new MAGS ORDER AE so return to the Create Case screen (if came from there)
			Services.removeNode(ManageAEParams.PARENT);
			NavigationController.nextScreen();		
			return true;
		}
		else
		{
			// Have create MAGS ORDER Case after NOT creating it after the Create Case screen.
			// Return false so the screen is cleared.
			return false;
		}
	}
	else
	{
		var EVENTDATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/EventData";
		var EVENTNAVIGATION_XPATH = EVENTDATA_XPATH + "/AeEventNavigationList";
		Services.replaceNode(EVENTNAVIGATION_XPATH, dom);
		
		var navigateToOR = Services.getValue(EVENTNAVIGATION_XPATH + "/NavigateTo/OracleReport");
		if ( navigateToOR == "true" )
		{
			// Set Oracle Report Court Code to the owning court of the case record loaded - trac 2446
			Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Header_OwningCourtCode.dataBinding) );
			
			var orNode = Services.getNode(EVENTNAVIGATION_XPATH + "/Params/WordProcessing");
			var orDom = XML.createDOM();
			orDom.loadXML(orNode.xml);
			Services.replaceNode(CaseManFormParameters.ORNODE_XPATH, orNode);
			
			
		
			
			// Set up to return to the screen in blank mode
			Services.removeNode(ManageAEParams.PARENT);
			WP.ProcessORA(FormController.getInstance(), orDom, NavigationController.MANAGE_AE_FORM );
			return true;
		}
		return false;
	}
}

/*********************************************************************************/

/**
 * Function updates the AE fee fields if the Amount of AE or Fee fields are updated
 * @author pz9j2w
 * 
 */
function updateFees()
{
	var subTotal = 0.00;
	var amountOfAE = Services.getValue(Fee_Amount_Of_AE.dataBinding);
	var feeAmount = Services.getValue(Fee_Fee.dataBinding);
	var otherFeesAmount = Services.getValue(Fee_Other_Fees.dataBinding);
	var paymentsToDate = Services.getValue(Fee_Payment_To_Date.dataBinding);
	
	var amount = ( CaseManUtils.isBlank(amountOfAE) || isNaN(amountOfAE) ) ? "0.00" : amountOfAE;
	var fee = ( CaseManUtils.isBlank(feeAmount) || isNaN(feeAmount) ) ? "0.00" : feeAmount;
	
	subTotal += amount * 1;
	subTotal += fee * 1;
	Services.setValue(Fee_Total.dataBinding, subTotal);
	
	var otherFees = CaseManUtils.isBlank(otherFeesAmount) ? "0.00" : otherFeesAmount;
	var payToDate = CaseManUtils.isBlank(paymentsToDate) ? "0.00" : paymentsToDate;
	subTotal += otherFees * 1;
	subTotal -= payToDate * 1;
	Services.setValue(Fee_Total_Remaining.dataBinding, subTotal);
}

/*********************************************************************************/

/**
 * Function indicates whether or not the currently selected AE is an existing AE
 * or is a Magistrates AE
 *
 * @return [Boolean] true if the current AE is existing or MAGISTRATES, else false
 * @author pz9j2w
 */
function isExistingOrMags()
{
	if ( isExistingAERecord() || isMagsCase() )
	{
		return true;
	}
	return false;
}

/*********************************************************************************/

/**
 * Function indicates whether or not the Case loaded is MAGS ORDER or not
 *
 * @return [Boolean] true if the case loaded is MAGS ORDER, else false
 * @author pz9j2w
 */
function isMagsCase()
{
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	if ( CaseManUtils.isBlank(caseNumber) )
	{
		return false;
	}
	return ( caseNumber.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) == 0 ) ? true : false;
}

/*********************************************************************************/

/**
 * Function generates a new unique surrogate id on a new record until the record
 * is persisted to the database and is given a proper unique id.
 *
 * @return [String] The surrogate id for the new record
 * @author pz9j2w
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/*********************************************************************************/

/**
 * Function adds a new AE Event to the DOM just prior to creating a new AE
 * @author pz9j2w
 * 
 */
function addNewAEEvent()
{
	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if ( AETypeCodes.MAGSORDER != aeType )
	{
		var systemDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
		var aeNumber = Services.getValue(AEDetails_AENumber.dataBinding);
		var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
		var eventId = ( Services.getValue(AEDetails_Application_Type_Code.dataBinding) == AETypeCodes.JUDGMENTDEBT ) ? "851" : "861"
		var partyRoleCode = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/PartyRoleCode");
		var casePartyNumber = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyId = " + Header_Party_Against.dataBinding + "]/CasePartyNumber");
		var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	
		var newEvent = Services.loadDOMFromURL("NewAEEvent.xml");
		XML.setElementTextContent(newEvent, "/AEEvent/CaseNumber", caseNumber );
		XML.setElementTextContent(newEvent, "/AEEvent/OwningCourtCode", owningCourt );
		XML.setElementTextContent(newEvent, "/AEEvent/AENumber", aeNumber );
		XML.setElementTextContent(newEvent, "/AEEvent/StandardEventId", eventId );
		XML.setElementTextContent(newEvent, "/AEEvent/EventDate", systemDate );
		XML.setElementTextContent(newEvent, "/AEEvent/ReceiptDate", systemDate );
		XML.setElementTextContent(newEvent, "/AEEvent/UserName", Services.getCurrentUser() );
		XML.setElementTextContent(newEvent, "/AEEvent/ServiceDate", calculatePostalServiceDate() );
		XML.setElementTextContent(newEvent, "/AEEvent/JudgmentDebtorPartyRoleCode", partyRoleCode );
		XML.setElementTextContent(newEvent, "/AEEvent/JudgmentDebtorCasePartyNumber", casePartyNumber );
		
		Services.replaceNode(XPathConstants.AE_EVENT_XPATH, newEvent);
	}
}

/*********************************************************************************/


/**
 * Function calculates the service date if the service status is postal
 * @returns Date in the format YYYY-MM-DD
 * @author rzxd7g
 */
function calculatePostalServiceDate()
{
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
//	var futureDate = CaseManUtils.daysInFuture(today, 2, true);
//	var modelDate = CaseManUtils.convertDateToPattern(futureDate);
	return calculateWorkingDay(today, 2, true);
}

function calculateWorkingDay(today, reqWorkingDays, inFuture){
	var params = new ServiceParams();
	params.addSimpleParameter("serviceDate", CaseManUtils.convertDateToPattern(today, CaseManUtils.DATE_MODEL_FORMAT));
	params.addSimpleParameter("reqWorkingDays", 2);
	params.addSimpleParameter("inFuture", true);
	Services.callService("calculateWorkingDay", params, calculateWorkingDay, false);
	//return date in modelDate format
	return Services.getValue(XPathConstants.VAR_SERVICEDATE_XPATH);
}

calculateWorkingDay.onSuccess = function(dom){
	if(dom != null){
		var workingDate = dom.selectSingleNode("/ds/workingDay");
		if (workingDate != null){
		    Services.setValue(XPathConstants.VAR_SERVICEDATE_XPATH, workingDate.text);
		}
	}
}

calculateWorkingDay.onError = function(){
	alert(exception.message);
}

/*********************************************************************************/

/**
 * Function sets the AE Type for a new AE when a user enters a new Case Number
 * @author pz9j2w
 * @return null 
 */
function setDefaultAEType()
{
	// First check for MAGS ORDER case.
	if( isMagsCase() )
	{
		setMagsApplication();
		return;			
	}
	
	Services.setValue(Address_Paged_Area.dataBinding, AddressTypeCodes.SERVICE);
	var countJudgments = Services.countNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment");
	if( countJudgments > 0 )
	{
		// Set AE Type to 'JD' if Judgments exist
		setJudgmentApplication();
		return;
	}
	
	// If neither of the above set the default to MN.
	setMaintananceApplication();
}

/*********************************************************************************/

/**
 * Function sets the AE Type for an existing AE when one is selected
 * @author pz9j2w
 * 
 */
function setApplicationAETypes()
{
	var appType = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/AEType");
	
	switch(appType)
	{
		case AETypeCodes.MAINTENANCEARREARS:
		case AETypeCodes.PRIORITYMAIN:
			setMaintananceApplication();
			break;
		case AETypeCodes.JUDGMENTDEBT:
			setJudgmentApplication();			
			break;
		case AETypeCodes.MAGSORDER:
			setMagsApplication();
			break;
	}
	
	Services.setValue(XPathConstants.SELECTED_AE_XPATH + "/AEType", appType);
}

/*********************************************************************************/

/**
 * Function sets up the AE fields for a Magistrates AE including the AE Type
 * and Judgment Debtor / Judgment Creditor
 * @author pz9j2w
 * 
 */
function setMagsApplication()
{
	Services.startTransaction();																
	Services.setValue(Address_Paged_Area.dataBinding, AddressTypeCodes.EMPLOYER);
	
	// Filter out the invalid AE Types
	var countAETypes = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType");
	var aeType = null;
	var selectable = null;
	for ( var i=0; i<countAETypes; i++ )
	{
		aeType = Services.getValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/Id");
		switch (aeType)
		{
			case AETypeCodes.MAGSORDER:
				selectable = "true";
				break;
			default:
				selectable = "false";
				break;
		}
		Services.setValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/SelectForAE", selectable);
	}					
	
	var caseNumber = Services.getValue(Header_Case_Number.dataBinding);
	if ( Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication") == 0 )
	{
		// New MAGS ORDER AE
		Services.setValue(AEDetails_Application_Type_Code.dataBinding, AETypeCodes.MAGSORDER);

		var claimant = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.CLAIMANT + "' and ./CasePartyNumber = '1']/PartyId");
		var defendant = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.DEFENDANT + "' and ./CasePartyNumber = '1']/PartyId");
		Services.setValue(Header_Party_For.dataBinding, claimant);
		Services.setValue(Header_Party_Against.dataBinding, defendant);
	}
	else
	{
		// Existing MAGS ORDER AE
		Services.setValue(AEDetails_ExistingAEsLov.dataBinding, caseNumber);
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets up the AE fields for a Judgment AE including the AE Type
 * and Judgment Debtor / Judgment Creditor
 * @author pz9j2w
 * 
 */
function setJudgmentApplication()
{
	Services.startTransaction();

	// Filter out the invalid AE Types
	var countAETypes = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType");
	var aeType = null;
	var selectable = null;
	for ( var i=0; i<countAETypes; i++ )
	{
		aeType = Services.getValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/Id");
		switch (aeType)
		{
			case AETypeCodes.JUDGMENTDEBT:
				selectable = "true";
				break;
			default:
				selectable = "false";
				break;
		}
		Services.setValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/SelectForAE", selectable);
	}
	Services.setValue(AEDetails_Application_Type_Code.dataBinding, AETypeCodes.JUDGMENTDEBT);
	
	var countJudgments = Services.countNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment");
	if ( countJudgments == 1 )
	{
		// Set the default Judgment Debtor and Judgment Creditor as the Judgment parties
		var partyAgainst = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment/PartyId");
		var countPartiesFor = Services.countNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment/InFavourParties/Party");
		if ( countPartiesFor == 1 )
		{
			var partyFor = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment/InFavourParties/Party/PartyId");
		}
		else
		{
			var partyFor = "";
		}
		
		Services.setValue(Header_Party_For.dataBinding, partyFor);
		Services.setValue(Header_Party_Against.dataBinding, partyAgainst);
	}
	else
	{
		// No or multiple Judgments so blank the Judgment Debtor and Creditor fields
		Services.setValue(Header_Party_For.dataBinding, "");
		Services.setValue(Header_Party_Against.dataBinding, "");
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets up the AE fields for a Maintenance AE including the AE Type
 * and Judgment Debtor / Judgment Creditor
 * @author pz9j2w
 * 
 */
function setMaintananceApplication()
{
	// Maintenance AEs can be either PM or MN, but by default are MN
	Services.startTransaction();
	
	// Filter out the invalid AE Types
	var countAETypes = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType");
	var aeType = null;
	var selectable = null;
	for ( var i=0; i<countAETypes; i++ )
	{
		aeType = Services.getValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/Id");
		switch (aeType)
		{
			case AETypeCodes.MAINTENANCEARREARS:
			case AETypeCodes.PRIORITYMAIN:
				selectable = "true";
				break;
			default:
				selectable = "false";
				break;
		}
		Services.setValue(XPathConstants.REF_DATA_XPATH + "/AEAppTypes/AEAppType[" + (i+1) + "]/SelectForAE", selectable);
	}

	Services.setValue(AEDetails_Application_Type_Code.dataBinding, AETypeCodes.MAINTENANCEARREARS);	
	Services.setValue(Header_Party_For.dataBinding, "");
	Services.setValue(Header_Party_Against.dataBinding, "");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function indicates whether or not the status of the case loaded is valid for AEs
 * Invalid statuses include 'PAID', 'TRANSFERRED', 'SETTLED' and 'WITHDRAWN'.  If 
 * invalid, a popup message is displayed and the screen is cleared.
 *
 * @return [Boolean] true if the case has a valid status, else false
 * @author pz9j2w
 */
function isCaseStatusValid()
{
	var caseStatus = Services.getValue(XPathConstants.CASE_RESULTS_XPATH + "/CaseStatus");
	var blnValid = true;
	switch ( caseStatus )
	{
		case InvalidCaseStatuses.PAID:
			alert(Messages.AE_CASESTATUSPAID_MESSAGE);
			blnValid = false;
			break;
			
		case InvalidCaseStatuses.TRANSFERRED:
			alert(Messages.AE_CASESTATUSTRANSFERRED_MESSAGE);
			blnValid = false;
			break;
			
		case InvalidCaseStatuses.SETTLED:
		case InvalidCaseStatuses.WITHDRAWN:
			alert(Messages.AE_CASESTATUSSETTLED_MESSAGE);
			blnValid = false;
			break;
	}
	return blnValid;
}

/*********************************************************************************/

/**
 * Function copies the appropiate parties to the Judgment Debtor and Judgment Creditor
 * LOV srcData based on AE Type.  This ensures only the correct parties are selected.
 * @author pz9j2w
 * 
 */
function copyPartiesForSelection()
{
	Services.startTransaction();
	var aeType = Services.getValue(AEDetails_Application_Type_Code.dataBinding);
	if( aeType == AETypeCodes.JUDGMENTDEBT )
	{
		// Need to filter the parties so clear the srcData and build up the DOM
		Services.removeNode(Header_Party_ForLov.srcData);
		Services.removeNode(Header_Party_AgainstLov.srcData);
		
		// No party code filtering for JD's
		Services.setValue(XPathConstants.PARTYFORID_XPATH, FormConstants.JARGON_CONSTANT);
		Services.setValue(XPathConstants.PARTYAGAINSTID_XPATH, FormConstants.JARGON_CONSTANT);
		Services.setValue(XPathConstants.EXCLUDE_PARTYFOR_XPATH, FormConstants.JARGON_CONSTANT);
		Services.setValue(XPathConstants.EXCLUDE_PARTYAGAINST_XPATH, FormConstants.JARGON_CONSTANT);
	
		var judgments = Services.getNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment");
		for( var i=0, l=judgments.length; i<l; i++ )
		{
			var partyId = XML.getNodeTextContent(judgments[i].selectSingleNode("PartyId"));
			var judgmentId = XML.getNodeTextContent(judgments[i].selectSingleNode("JudgmentId"));
			addDebtor(partyId, judgmentId);
			addCreditors(judgmentId);
		}
	}
	else
	{
		var partiesNode = Services.getNode(XPathConstants.CASE_RESULTS_XPATH + "/Parties");
		Services.replaceNode(Header_Party_ForLov.srcData, partiesNode);
		Services.replaceNode(Header_Party_AgainstLov.srcData, partiesNode);
	}
	Services.endTransaction();

	setHeaderParties();
}

/*********************************************************************************/

/**
 * Function adds a new party to the Judgment Debtor LOV Src Data
 *
 * @param [Integer] partyId The primary key identifier of the party
 * @param [Integer] judgmentID The primary key identifier of the judgment the party has against them
 * @author pz9j2w
 * 
 */
function addDebtor(partyId, judgmentID)
{
	var existing = Services.countNodes(Header_Party_AgainstLov.srcData + "/Party[./PartyId='"+partyId+"']");
	if(existing == 0)
	{
		// Only add the party to the list if they have not already been added
		var partyNode = Services.getNode(XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[./PartyId='"+partyId+"']").cloneNode(true);
			
		var judgmentIDNode = XML.createElement(partyNode, "JudgmentID");
		partyNode.appendChild(judgmentIDNode);
		XML.replaceNodeTextContent(judgmentIDNode, judgmentID);
		Services.addNode(partyNode, Header_Party_AgainstLov.srcData);		
	}		
}

/*********************************************************************************/

/**
 * Function adds the Parties For on the Judgment specified to the Judgment Creditor 
 * LOV list.
 * 
 * @param [String] judgmentID The identifier of the Judgment to find Parties For on
 * @author pz9j2w
 * 
 */
function addCreditors(judgmentID)
{
	var creditors = Services.getNodes(XPathConstants.CASE_RESULTS_XPATH + "/Judgments/Judgment[./JudgmentId = '" + judgmentID + "']/InFavourParties/Party"); 
	for( var i=0, l=creditors.length; i<l; i++ )
	{
		var partyId = XML.getNodeTextContent(creditors[i].selectSingleNode("PartyId"));			
		var existing = Services.countNodes(Header_Party_ForLov.srcData + "/Party[./PartyId='"+partyId+"']");
		if ( existing == 0 )
		{
			// Only add the party to the list if they have not already been added
			var partyNode = Services.getNode(XPathConstants.CASE_RESULTS_XPATH + "/Parties/Party[./PartyId='"+partyId+"']").cloneNode(true);					
			Services.addNode(partyNode, Header_Party_ForLov.srcData);
		}			
	}
}

/*********************************************************************************/

/**
 * Function sets the Judgment Debtor and Judgment Creditor fields in the header if an
 * existing AE record is loaded
 * @author pz9j2w
 * 
 */
function setHeaderParties()
{
	if ( !isNewApplication() )
	{
		var partyRoleCode = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/PartyForPartyRoleCode");
		var casePartyNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/PartyForCasePartyNumber");
		var partyId = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Creditor/Parties/Party[./PartyRoleCode = '" + partyRoleCode + "' and ./CasePartyNumber = '" + casePartyNumber + "']/PartyId");
		Services.setValue(Header_Party_For.dataBinding, partyId);
			
		partyRoleCode = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/PartyAgainstPartyRoleCode");
		casePartyNumber = Services.getValue(XPathConstants.SELECTED_AE_XPATH + "/PartyAgainstCasePartyNumber");
		partyId = Services.getValue(XPathConstants.SELECTED_PARTIES_XPATH + "/Debtor/Parties/Party[./PartyRoleCode = '" + partyRoleCode + "' and ./CasePartyNumber = '" + casePartyNumber + "']/PartyId");
		Services.setValue(Header_Party_Against.dataBinding, partyId);
	}
}

/*********************************************************************************/

/**
 * The check digit function to verify the AE Number
 * @param checkDigit
 * @author pz9j2w
 * @return check % 10  
 */
function verifyCheckDigit(checkDigit)
{
	var divisor = 100000;
	var digit = 0;
	var interim = checkDigit;
	var multiple = 0;
	var check = 0;
	
	for(var i=0; i<6; i++)
	{
		if(divisor == 100000 || divisor == 100)
		{			
			multiple = 7;
		}
		else if(divisor == 10000 || divisor == 10)
		{
			multiple = 3;
		}
		else
		{
			multiple = 1;
		}		
		digit = trunc(interim / divisor);		
		check = check + (digit * multiple);		 
		interim = interim - (digit * divisor);
		divisor = divisor / 10;
	}
	return check % 10; 
}

/*********************************************************************************/

/**
 * Function removes any digits after the decimal point and numbers an integer
 *
 * @param [Float] number The number to be truncated
 * @return [Integer] The number passed in converted to a whole number
 * @author pz9j2w
 */
function trunc(number)
{
	var strNumber = String(number);
	var indexOfDP = strNumber.indexOf('.');
	if(indexOfDP == -1)
	{
		return number;
	}
	return Number(strNumber.substring(0,indexOfDP));
}

/*********************************************************************************/

/**
 * Function transforms a currency literal to a currency symbol
 *
 * @param [String] currency The currency literal to be transformed
 * @return [String] The appropriate currency symbol for the literal passed in
 * @author pz9j2w
 */
function transformCurrencyToDisplay(currency)
{
	if ( !isValidCase() )
	{
		return "";
	}
	return CaseManUtils.transformCurrencySymbolToDisplay(currency, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

/**
 * Function handles the loading of new AEs via the AE Exists LOV popup.
 * If only one existing AE, the record is loaded into the screen, otherwise
 * the LOV is raised.
 * @author pz9j2w
 * 
 */
function loadExistingAEs()
{
	var countExistingAEs = Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication");
	if ( countExistingAEs == 1 )
	{
		// Only one existing AE so just populate the screen with that AE.
		var aeNumber = Services.getValue(XPathConstants.AE_RESULTS_XPATH + "/AEApplication/AENumber");
		Services.setValue(AEDetails_ExistingAEsLov.dataBinding, aeNumber);
	}
	else
	{
		// More than one AE in the list so raise the LOV for the user to choose
		Services.replaceNode(AEDetails_ExistingAEsLov.srcData, Services.getNode(XPathConstants.AE_RESULTS_XPATH));
		Services.dispatchEvent("AEDetails_ExistingAEsLov", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/*********************************************************************************/

/**
 * This function sets the LiveStatus flag for each AE on the Case loaded based on AE Events
 * If the AE has any of the following events it is not live:
 * 888: Application Dismissed
 * 889: Application withdrawn
 * 890: Application withdrawn/Fee Refunded
 * However, if the AE subsequentially has an event 900, it is live again.
 * The query returns the AE Events in order of creation, with the latest event first
 * @author pz9j2w
 * 
 */
function setAELiveStatusFlags()
{
	var countAEs = Services.countNodes(XPathConstants.AE_RESULTS_XPATH + "/AEApplication");
	Services.startTransaction();
	for ( var i=0; i<countAEs; i++ )
	{
		var aeRootXPath = XPathConstants.AE_RESULTS_XPATH + "/AEApplication[" + (i + 1) + "]";
		var countEvents = Services.countNodes(aeRootXPath + "/Events/Event");
		var liveStatus = "Y";
		if ( countEvents > 0 )
		{
			var latestEventId = Services.getValue(aeRootXPath + "/Events/Event[1]/EventId");
			liveStatus = ( latestEventId == "900" ) ? "Y" : "N";
		}
		Services.setValue(aeRootXPath + "/LiveStatus", liveStatus);
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * This function indicates whether or not the screen is in read only mode or not.
 * Screen would only be in read only mode if a case with an invalid case status is loaded.
 *
 * @return [Boolean] True if the normally editable fields should be read only, else false
 * @author pz9j2w
 */
function isScreenReadOnlyForCaseStatus()
{
	var isReadOnly = Services.getValue(XPathConstants.READONLY_CASESTATUS_IND_XPATH);
	return ( isReadOnly == "true" ) ? true : false;
}

/*********************************************************************************/

/**
 * This function indicates whether or not the Judgment Debtor is populated and valid.
 * This is used to determine if the address tabbed pages should be enabled or not.
 *
 * @return [Boolean] True if the Judgment Debtor is populated and valid, else false
 * @author Chris Vincent
 */
function validJudgmentDebtor()
{
	var blnOk = true;
	var partyAgainst = Services.getValue(Header_Party_Against.dataBinding);
	var partyAgainstValid = Services.getAdaptorById("Header_Party_Against").getValid();

	if ( CaseManUtils.isBlank(partyAgainst) || !partyAgainstValid )
	{
		blnOk = false;
	}
	return blnOk;
}