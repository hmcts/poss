/** 
 * @fileoverview CreateUpdateCase.js:
 * This file contains the configurations, constants and helper functions for the Copy Case Details form
 *
 * @author Chris Vincent
 */

/******************************* CONSTANTS ******************************************/

/**
 * Form constants
 * @author rzxd7g
 * 
 */
function FormConstants() {};
FormConstants.SOLICITOR_PAGE = "secondPage";
FormConstants.LITIGIOUS_PARTY_PAGE = "firstPage";
FormConstants.LITIGIOUS_PARTY_LABEL = "Party";
FormConstants.ENABLED = "on";
FormConstants.DISABLED = "off";
FormConstants.STATUS_EXISTING = "EXISTING";
FormConstants.STATUS_NEW = "NEW";
FormConstants.STATUS_REMOVED = "REMOVED";
FormConstants.MAGS_ORDER = "MAGS ORDER";
FormConstants.CCBC_CASE_TYPE = "CLAIM - SPEC ONLY";

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
XPathConstants.COPY_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/CopyCaseParams/ManageCase";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT = XPathConstants.DATA_XPATH + "/Parties/LitigiousParty[./SurrogateId = ";
XPathConstants.SOLICITOR_DATA_BINDING_ROOT = XPathConstants.DATA_XPATH + "/Parties/Solicitor[./SurrogateId = ";
XPathConstants.SELECTED_SOLICITOR_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedSolicitor";
XPathConstants.LITIGIOUS_PARTY_PAGE_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tab/EnablePageOne";
XPathConstants.SOLICITOR_PAGE_ENABLER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tab/EnablePageTwo";
XPathConstants.LITIGIOUS_PARTY_PAGE_LABEL = XPathConstants.VAR_PAGE_XPATH + "/Tab/LitigiousPartyPageLabel";
XPathConstants.CASE_STATUS = XPathConstants.DATA_XPATH + "/Status";
XPathConstants.MASTERGRID_CHANGED = XPathConstants.VAR_PAGE_XPATH + "/MasterGridChanged"
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.NAVIGATIONLIST_XPATH = XPathConstants.VAR_PAGE_XPATH + "/NavigationList";
XPathConstants.NEWCASEVALID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CopyCaseParams/Validation/CaseNumberValid";
XPathConstants.JUDGMENTS_XPATH = XPathConstants.ROOT_XPATH + "/MaintainJudgment";
XPathConstants.COPY_JUDGMENT_XPATH = XPathConstants.VAR_FORM_XPATH + "/CopyJudgmentParams/Judgments";

/************************** FORM CONFIGURATIONS *************************************/

function createUpdateCase() {}

// Menubar configuration
menubar = {
	quickLinks: [
		{
			id: "NavBar_JudgmentsButton",
			formName: NavigationController.JUDGMENT_FORM,
			label: "Judgments",
/**
 * @author rzxd7g
 * @return boolean 
 */
			guard:  function() 
					{
					 	var ec = null;
						if ( !isExistingCase() )
						{
							// Existing Case not loaded, throw error message
							ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToJudgmentsScreen_Msg");
							Services.setTransientStatusBarMessage(ec.getMessage());
						}
					 	return ( null == ec ) ? true : false;
					},
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
						// Set the Judgments parameters
						var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
						Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
				
						// Set up the Call Stack to return to the Events screen
						var navArray = new Array("CopyCreateUpdateCase");
						NavigationController.createCallStack(navArray);	
					 },
			onMenuBar: true
		},
		{
			id: "NavBar_QueryButton",
			formName: NavigationController.QUERYBYPARTYCASE_FORM,
			label: "Query",
/**
 * @author rzxd7g
 * 
 */
			prepare: function() 
					 {
					 	var navArray = new Array("CopyCreateUpdateCase");
						NavigationController.createCallStack(navArray);
					 },
			onMenuBar: true
		}
	]
}

/**
 * @author rzxd7g
 * 
 */
createUpdateCase.initialise = function()
{
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
			break;
		case "getCaseTypes":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CaseTypes", dom);
			break;
		case "getPartyRoles":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/PartyRoles", dom);
			break;
		case "getSystemDate":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/SystemDate", dom);
			break;
		case "getPrefCommMethodList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods", dom);
			break;
	}
}

/**************************** HELPER FUNCTIONS *************************************/

/**
 * Function calls the getCase service to retrieve data about the Case Number specified.  The
 * Reference Data required by the form is also loaded.
 *
 * @param [String] caseNumber The Case Number to be queried
 * @author rzxd7g
 * 
 */
function loadCaseData(caseNumber)
{
	// Load the reference data required by the screen in add/update mode
	loadReferenceData();

	// Query the Case Number
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber );
	Services.callService("getCase", params, Header_CaseNumber, true);
}

/*********************************************************************************/

/**
 * Resets the data on the form so a new case can be entered.
 * NOTE - Case Number should not be removed so cannot Services.removeNode(XPathConstants.DATA_XPATH)
 * @author rzxd7g
 * 
 */
function resetForm()
{
	Services.startTransaction();

	// Clear the header data
	Services.setValue(Header_CaseType.dataBinding, "");
	Services.setValue(Header_CaseStatus.dataBinding, "");
	Services.setValue(Header_OwningCourtCode.dataBinding, "");
	Services.setValue(Header_CaseDetails.dataBinding, "");
	Services.setValue(XPathConstants.CASE_STATUS, "");

	// Clear all other branches of data
	Services.removeNode(XPathConstants.JUDGMENTS_XPATH);
	Services.removeNode(XPathConstants.DATA_XPATH + "/DetailsOfClaim");
	Services.removeNode(XPathConstants.DATA_XPATH + "/HearingDetails");
	Services.removeNode(XPathConstants.DATA_XPATH + "/OtherPossessionAddress");
	Services.removeNode(XPathConstants.DATA_XPATH + "/Parties/Solicitor");
	Services.removeNode(XPathConstants.DATA_XPATH + "/Parties/LitigiousParty");
	Services.removeNode(XPathConstants.DATA_XPATH + "/CaseEvents");

	// Remove any SCN Nodes	
	removeSCNNodes(XPathConstants.DATA_XPATH);

	// Clear the var sections of the DOM
	Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	Services.removeNode(XPathConstants.VAR_APP_XPATH + "/CaseData");
	Services.removeNode(CreateCaseParams.PARENT);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function hnadles the exiting from the screen either to the menu or a previous screen.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.removeNode(CreateCaseParams.PARENT);
	Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	Services.navigate(NavigationController.MAIN_MENU);
}

/**********************************************************************************/

/**
 * Function removes any SCN nodes under the parent node specified.
 *
 * @param [String] parentNode Xpath of the node under which to look for SCN nodes
 * @author rzxd7g
 * 
 */
function removeSCNNodes(parentNode)
{
	var scnNodes = Services.countNodes(parentNode + "/SCN");
	for ( var i=0; i<scnNodes; i++ )
	{
		// Will always be the first SCN node in the DOM as are reordered when removed
		Services.removeNode(parentNode + "/SCN[1]");
	}
}

/**********************************************************************************/

/**
 * Function returns the party type code of the currently party in the master grid.
 *
 * @return [String] The party type code of the currently selected party
 * @author rzxd7g
 */
function getCurrentlySelectedPartyTypeCode()
{
	var selectedItemIdentifier = Services.getValue(masterGrid.dataBinding);
	var xpath = masterGrid.srcData + "/*[SurrogateId =  '" + selectedItemIdentifier + "']/TypeCode"; /**/
	var partyType = Services.getValue(xpath);
	return partyType;
}

/**********************************************************************************/

/**
 * Function returns the party type description for the party type code specified.
 *
 * @param [String] The party type code
 * @return [String] The party type description for the code specified
 * @author rzxd7g
 */
function getPartyTypeDescription(code)
{
	var xpath = XPathConstants.REF_DATA_XPATH + "/PartyRoles/PartyRole[Code = '" + code + "']/Description";
	var description = Services.getValue(xpath);
	return description;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case is MAGS ORDER (i.e. has a case number
 * in the format LL/NNNNN or a case type of MAGS ORDER).
 *
 * @return [Boolean] True if the case is MAGS ORDER else false
 * @author rzxd7g
 */
function isMagsOrder()
{
	return ( Services.getValue(Header_CaseType.dataBinding) == FormConstants.MAGS_ORDER );
}

/**********************************************************************************/

/**
 * Function indicates whether or not the current case is a CCBC Case (court 335)
 *
 * @return [Boolean] True if the case is CCBC, else false
 * @author rzxd7g
 */
function isCCBCCase()
{
	// Case is CCBC if court is 335
	var court = Services.getValue(Header_OwningCourtCode.dataBinding);
	return ( court == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
}

/**********************************************************************************/

/**
 * Function indicates whether or not the case is existing or new.
 *
 * @return [Boolean] True if the case is existing else false
 * @author rzxd7g
 */
function isExistingCase()
{
	return (Services.getValue(XPathConstants.CASE_STATUS) == FormConstants.STATUS_EXISTING);
}

/**********************************************************************************/

/**
 * Function validates a coded party code to determine whether or not the code
 * is that of a National Coded Party (ranges 1500-1999 & 7000-9999).
 *
 * @param [Integer] code The coded party code to be tested
 * @return [ErrorCode] The appropriate error code if the code is a national coded party, else null
 * @author rzxd7g
 */
function isNationalCodedParty(code)
{
	if ( code >= 1500 && code < 2000 )
	{
		// Normal National Coded Party
		return true;
	}
	
	if ( code >= 7000 )
	{
		// Non CPC National Coded Party
		return true;
	}

	return false;
}

/**********************************************************************************/

/**
 * Indicates whether or not the party fields should be enabled.  Fields should
 * only be enabled if the Case Number, Case Type and Owning Court have a value.
 *
 * @return [Boolean] True if the fields can be enabled else false
 * @author rzxd7g
 */
function isPartyFieldEnabled()
{
	if ( CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) || 
	 	 CaseManUtils.isBlank(Services.getValue(Header_CaseType.dataBinding)) ||
		 CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)) )
	{
		return false;
	}
	if ( CaseManUtils.isBlank( Services.getValue(masterGrid.dataBinding) ) )
	{
		return false;
	}
	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/*") == 0 )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

/**
 * Function converts a string to upper case 
 *
 * @param [String] The string to be converted to upper case
 * @return [String] The converted string
 * @author rzxd7g
 */
function convertToUpper(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

/**
 * Function to call the reference data required when a Case record is loaded
 * @author rzxd7g
 * 
 */
function loadReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts") )
	{
		Services.callService("getCourtsShort", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypes") )
	{
		Services.callService("getCaseTypes", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/PartyRoles") )
	{
		Services.callService("getPartyRoles", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/SystemDate") )
	{
		Services.callService("getSystemDate", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods") )
	{
		Services.callService("getPrefCommMethodList", params, createUpdateCase, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CaseTypeRules") )
	{
		var caseTypeRules = Services.loadDOMFromURL("../../CaseTypeRules.xml");
		Services.addNode(caseTypeRules, XPathConstants.REF_DATA_XPATH);
	}
}

/******************************* SUB-FORMS *****************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/*********************************** TABS ******************************************/

function myTabSelector() {}; // Instantiate the tabbed area
myTabSelector.tabIndex = 20;
myTabSelector.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

/********************************** POPUPS *****************************************/

function Create_Copy_Popup() {};

/**
 * @author rzxd7g
 * 
 */
Create_Copy_Popup.prePopupPrepare = function()
{
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	Services.startTransaction();
	Services.setValue(CreateCopyPopup_NewCaseNumber.dataBinding, "");
	Services.setValue(CreateCopyPopup_OwningCourtCode.dataBinding, courtCode);
	Services.setValue(CreateCopyPopup_CopyJudgmentsFlag.dataBinding, "N");
	Services.setValue(XPathConstants.NEWCASEVALID_XPATH, "");
	Services.endTransaction();
}

Create_Copy_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "CreateCopyPopup_CancelButton"} ],
		keys: [ { key: Key.F4, element: "Create_Copy_Popup" } ]
	}
};

/******************************** LOV POPUPS ***************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Court";
CourtsLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtsLOVGrid.raise = {
    eventBinding: {
        singleClicks: [ { element: "CreateCopyPopup_OwningCourtLOVButton" } ],
		keys: [ { key: Key.F6, element: "CreateCopyPopup_OwningCourtCode" },
				{ key: Key.F6, element: "CreateCopyPopup_OwningCourtName" } ]
    }
};

CourtsLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtsLOVGrid.destroyOnClose = false;
CourtsLOVGrid.logicOn = [CourtsLOVGrid.dataBinding];
CourtsLOVGrid.logic = function(event)
{
	var value = Services.getValue(CourtsLOVGrid.dataBinding);
	if (!CaseManUtils.isBlank(value))
	{
		Services.startTransaction();
		// Set the code field.  This will result in the code logic being called, just
		// as if the user had keyed in the code manually.
		Services.setValue(CreateCopyPopup_OwningCourtCode.dataBinding, value);
		
		// Now reset the value in the LOV
		Services.setValue(CourtsLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
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

masterGrid.tabIndex = 10;
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
  	}
  	else
  	{
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

/*****************************  DATA BINDINGS *************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_CaseType.dataBinding = XPathConstants.DATA_XPATH + "/CaseType";
Header_CaseStatus.dataBinding = XPathConstants.DATA_XPATH + "/CaseStatus";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/OwningCourtNameAutocomplete"
Header_CaseDetails.dataBinding = XPathConstants.DATA_XPATH + "/CaseDetails";

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
LitigiousParty_SelectSolicitor.dataBinding = XPathConstants.LITIGIOUS_PARTY_DATA_BINDING_ROOT + masterGrid.dataBinding + "]/SolicitorSurrogateId";

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

/********************************  FIELDS ******************************************/

function Header_CaseNumber() {}
Header_CaseNumber.transformToDisplay = convertToUpper;
Header_CaseNumber.transformToModel = convertToUpper;
Header_CaseNumber.tabIndex = 1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.readOnlyOn = [XPathConstants.CASE_STATUS];
Header_CaseNumber.isReadOnly = isExistingCase;
Header_CaseNumber.validate = function()
{
	var ec = null;
	var value = Services.getValue(Header_CaseNumber.dataBinding);
	if ( null != value )
	{
		// Check the format of the Case Number is correct
		ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.VALID_CASE_PATTERN, 'Caseman_invalidCaseNumberFormat_Msg');
		
		// Check if MAGS ORDER Case, the first 2 characters are alphabetic
		if ( null == ec && value.charAt(2) == "/" )
		{
			ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.MAGSORDER_CASE_PATTERN, 'Caseman_invalidMAGSORDERCaseNumberFormat_Msg');
		}
	}
	return ec;
}

Header_CaseNumber.logicOn = [Header_CaseNumber.dataBinding];
Header_CaseNumber.logic = function(event)
{
	if ( event.getXPath() != Header_CaseNumber.dataBinding )
	{
		return;
	}
	
	var value = Services.getValue(Header_CaseNumber.dataBinding);
	
	// If Case Number is cleared, wipe out all data
	if ( CaseManUtils.isBlank(value) )
	{
		resetForm();
	}
	else
	{
		if ( null == Header_CaseNumber.validate() )
		{
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
	}
	else
	{
		// A new case number has been entered, so clear out the dom and set the defaults for a new case.
		alert("The Case Number entered does not exist");
	}
	Services.endTransaction();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onError = function(exception)
{
	if( confirm(Messages.FAILEDCASEDATALOAD_MESSAGE) )
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

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isReadOnly = function() { return true; }
Header_OwningCourtCode.enableOn = [Header_CaseNumber.dataBinding];
Header_OwningCourtCode.isEnabled = function()
{
	return ( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() );
}

Header_OwningCourtCode.logicOn = [Header_OwningCourtCode.dataBinding];
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
				if ( isCCBCCase() )
				{
					// Set the default case type for a New CCBC Case 
					Services.setValue(Header_CaseType.dataBinding, FormConstants.CCBC_CASE_TYPE);
				}
			}
		}
	}
}

/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_OwningCourtName.rowXPath = "Court";
Header_OwningCourtName.keyXPath = "Code";
Header_OwningCourtName.displayXPath = "Name";
Header_OwningCourtName.strictValidation = true;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.validate = function() { return null; }
Header_OwningCourtName.transformToDisplay = convertToUpper;
Header_OwningCourtName.enableOn = [Header_CaseNumber.dataBinding];
Header_OwningCourtName.isEnabled = function()
{
	return ( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() );
}
Header_OwningCourtName.isReadOnly = function() { return true; }
Header_OwningCourtName.logicOn = [Header_OwningCourtName.dataBinding];
Header_OwningCourtName.logic = function()
{
	var value = Services.getValue(Header_OwningCourtName.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + value + "']/Name");
	if( null != courtName ) 
	{
		// The entered value must be valid
		Services.startTransaction();
		Services.setValue(Header_OwningCourtCode.dataBinding, value);
		Services.setValue(XPathConstants.DATA_XPATH + "/OwningCourtName", courtName);
		Services.endTransaction();
	}	
}

/*********************************************************************************/

function Header_CaseType() {}
Header_CaseType.srcData = XPathConstants.REF_DATA_XPATH + "/CaseTypes";
Header_CaseType.rowXPath = "CaseType";
Header_CaseType.keyXPath = "Type";
Header_CaseType.displayXPath = "Type";
Header_CaseType.tabIndex = -1;
Header_CaseType.maxLength = 20;
Header_CaseType.helpText = "The type of claim issued (e.g. Claim specified etc)";
Header_CaseType.isReadOnly = function() { return true; }
Header_CaseType.enableOn = [Header_CaseNumber.dataBinding];
Header_CaseType.isEnabled = function()
{
	return ( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() );
}

/*********************************************************************************/

function Header_CaseDetails() {}
Header_CaseDetails.tabIndex = -1;
Header_CaseDetails.maxLength = 90;
Header_CaseDetails.helpText = "Brief details of claim";
Header_CaseDetails.transformToDisplay = convertToUpper;
Header_CaseDetails.isReadOnly = function() { return true; }
Header_CaseDetails.enableOn = [Header_CaseNumber.dataBinding];
Header_CaseDetails.isEnabled = function()
{
	return ( !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && null == Header_CaseNumber.validate() );
}

/*********************************************************************************/

function Header_CaseStatus() {}
Header_CaseStatus.tabIndex = -1;
Header_CaseStatus.maxLength = 12;
Header_CaseStatus.helpText = "The status of the case";
Header_CaseStatus.isReadOnly = function() { return true; }
Header_CaseStatus.transformToDisplay = convertToUpper;
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

function LitigiousParty_Code() {};
LitigiousParty_Code.tabIndex = -1;
LitigiousParty_Code.maxLength = 4;
LitigiousParty_Code.helpText = "Unique four digit code for party - list available";
LitigiousParty_Code.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Code.isReadOnly = function() { return true; }
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

/*********************************************************************************/

function LitigiousParty_Name() {};
LitigiousParty_Name.tabIndex = -1;
LitigiousParty_Name.maxLength = 70;
LitigiousParty_Name.helpText = "Name of party";
LitigiousParty_Name.isReadOnly = function() { return true; }
LitigiousParty_Name.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Name.transformToDisplay = convertToUpper;
LitigiousParty_Name.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
LitigiousParty_Name.isEnabled = function()
{
	if ( getCurrentlySelectedPartyTypeCode() == PartyTypeCodesEnum.SOLICITOR )
	{
		return false;
	}
	return isPartyFieldEnabled();
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line1() {};
LitigiousParty_ContactDetails_Address_Line1.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Line1.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line1.helpText = "First line of party's address";
LitigiousParty_ContactDetails_Address_Line1.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Line1.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line1.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line1.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line2() {};
LitigiousParty_ContactDetails_Address_Line2.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Line2.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line2.helpText = "Second line of party's address";
LitigiousParty_ContactDetails_Address_Line2.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line2.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Line2.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line2.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line3() {};
LitigiousParty_ContactDetails_Address_Line3.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Line3.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line3.helpText = "Third line of party's address";
LitigiousParty_ContactDetails_Address_Line3.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line3.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Line3.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line3.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line4() {};
LitigiousParty_ContactDetails_Address_Line4.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Line4.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line4.helpText = "Fourth line of party's address";
LitigiousParty_ContactDetails_Address_Line4.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line4.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Line4.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line4.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Line5() {};
LitigiousParty_ContactDetails_Address_Line5.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Line5.maxLength = 35;
LitigiousParty_ContactDetails_Address_Line5.helpText = "Fifth line of party's address";
LitigiousParty_ContactDetails_Address_Line5.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Line5.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Line5.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Line5.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_Address_Postcode() {};
LitigiousParty_ContactDetails_Address_Postcode.tabIndex = -1;
LitigiousParty_ContactDetails_Address_Postcode.maxLength = 8;
LitigiousParty_ContactDetails_Address_Postcode.helpText = "Party's postcode";
LitigiousParty_ContactDetails_Address_Postcode.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_Address_Postcode.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_Address_Postcode.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_Address_Postcode.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_DX() {};
LitigiousParty_ContactDetails_DX.tabIndex = -1;
LitigiousParty_ContactDetails_DX.maxLength = 35;
LitigiousParty_ContactDetails_DX.helpText = "Party's document exchange reference number";
LitigiousParty_ContactDetails_DX.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_DX.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_DX.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_DX.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_DX.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_TelephoneNumber() {};
LitigiousParty_ContactDetails_TelephoneNumber.tabIndex = -1;
LitigiousParty_ContactDetails_TelephoneNumber.maxLength = 24;
LitigiousParty_ContactDetails_TelephoneNumber.helpText = "The telephone number of the party";
LitigiousParty_ContactDetails_TelephoneNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_TelephoneNumber.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_TelephoneNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_TelephoneNumber.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_FaxNumber() {};
LitigiousParty_ContactDetails_FaxNumber.tabIndex = -1;
LitigiousParty_ContactDetails_FaxNumber.maxLength = 24;
LitigiousParty_ContactDetails_FaxNumber.helpText = "The fax number of the party";
LitigiousParty_ContactDetails_FaxNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_FaxNumber.transformToDisplay = convertToUpper;
LitigiousParty_ContactDetails_FaxNumber.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_FaxNumber.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_FaxNumber.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_EmailAddress() {};
LitigiousParty_ContactDetails_EmailAddress.tabIndex = -1;
LitigiousParty_ContactDetails_EmailAddress.maxLength = 80;
LitigiousParty_ContactDetails_EmailAddress.helpText = "The email address of the party";
LitigiousParty_ContactDetails_EmailAddress.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_EmailAddress.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_EmailAddress.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_EmailAddress.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_TranslationToWelsh() {};
LitigiousParty_ContactDetails_TranslationToWelsh.modelValue = {checked: "Y", unchecked: "N"}; 
LitigiousParty_ContactDetails_TranslationToWelsh.tabIndex = -1;
LitigiousParty_ContactDetails_TranslationToWelsh.helpText = "Tick box if the party is to receive documents translated into Welsh";
LitigiousParty_ContactDetails_TranslationToWelsh.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_TranslationToWelsh.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_TranslationToWelsh.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_TranslationToWelsh.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_ContactDetails_PreferredMethodOfCommunication() {};
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.rowXPath = "/Method";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.keyXPath = "/Id";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.displayXPath = "/Name";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.tabIndex = -1;
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.isReadOnly = function() { return true; }
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.helpText = "Select the preferred communication method of the party";
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_ContactDetails_PreferredMethodOfCommunication.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_Reference() {};
LitigiousParty_Reference.tabIndex = -1;
LitigiousParty_Reference.maxLength = 24;
LitigiousParty_Reference.helpText = "Reference used by the party in the case";
LitigiousParty_Reference.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_Reference.transformToDisplay = convertToUpper;
LitigiousParty_Reference.isReadOnly = function() { return true; }
LitigiousParty_Reference.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,LitigiousParty_Name.dataBinding];
LitigiousParty_Reference.isEnabled = function()
{
	return isPartyFieldEnabled() && !CaseManUtils.isBlank(Services.getValue(LitigiousParty_Name.dataBinding));
}

/*********************************************************************************/

function LitigiousParty_DateOfService() {};
LitigiousParty_DateOfService.tabIndex = -1;
LitigiousParty_DateOfService.maxLength = 11;
LitigiousParty_DateOfService.helpText = "Date of service";
LitigiousParty_DateOfService.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_DateOfService.weekends = true;
LitigiousParty_DateOfService.isReadOnly = function() { return true; }
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

/*********************************************************************************/

function LitigiousParty_LastDateForService() {};
LitigiousParty_LastDateForService.tabIndex = -1;
LitigiousParty_LastDateForService.maxLength = 11;
LitigiousParty_LastDateForService.helpText = "Last date for service";
LitigiousParty_LastDateForService.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
LitigiousParty_LastDateForService.weekends = true;
LitigiousParty_LastDateForService.isReadOnly = function() { return true; }
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

/*********************************************************************************/

function LitigiousParty_SelectSolicitor() {};
LitigiousParty_SelectSolicitor.srcData = XPathConstants.VAR_PAGE_XPATH + "/solicitorSelectList";
LitigiousParty_SelectSolicitor.rowXPath = "/Solicitor";
LitigiousParty_SelectSolicitor.keyXPath = "/SurrogateId";
LitigiousParty_SelectSolicitor.displayXPath = "/Name";
LitigiousParty_SelectSolicitor.nullDisplayValue = "No Solicitor";
LitigiousParty_SelectSolicitor.tabIndex = -1;
LitigiousParty_SelectSolicitor.helpText = "Select the party's solicitor";
LitigiousParty_SelectSolicitor.isReadOnly = function() { return true; }
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
	Services.endTransaction();
}

/*********************************************************************************/

function SolicitorParty_Code() {};
SolicitorParty_Code.tabIndex = -1;
SolicitorParty_Code.maxLength = 4;
SolicitorParty_Code.helpText = "Unique four digit code for solicitor - list available";
SolicitorParty_Code.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_Code.isReadOnly = function() { return true; }
SolicitorParty_Code.enableOn = [XPathConstants.MASTERGRID_CHANGED,Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
SolicitorParty_Code.isEnabled = isPartyFieldEnabled;

/*********************************************************************************/

function SolicitorParty_Name() {};
SolicitorParty_Name.tabIndex = -1;
SolicitorParty_Name.maxLength = 70;
SolicitorParty_Name.helpText = "Solicitor name";
SolicitorParty_Name.retrieveOn = [XPathConstants.MASTERGRID_CHANGED, XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_Name.transformToDisplay = convertToUpper;
SolicitorParty_Name.isReadOnly = function() { return true; }
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
			return true;
		}
	}
	return true;
}

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line1() {};
SolicitorParty_ContactDetails_Address_Line1.tabIndex = -1;
SolicitorParty_ContactDetails_Address_Line1.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line1.helpText = "First line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line1.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Line1.transformToDisplay = convertToUpper;
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

/*********************************************************************************/

function SolicitorParty_ContactDetails_Address_Line2() {};
SolicitorParty_ContactDetails_Address_Line2.tabIndex = -1;
SolicitorParty_ContactDetails_Address_Line2.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line2.helpText = "Second line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line2.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Line2.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_Address_Line3.tabIndex = -1;
SolicitorParty_ContactDetails_Address_Line3.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line3.helpText = "Third line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line3.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Line3.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_Address_Line4.tabIndex = -1;
SolicitorParty_ContactDetails_Address_Line4.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line4.helpText = "Fourth line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line4.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Line4.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_Address_Line5.tabIndex = 48;
SolicitorParty_ContactDetails_Address_Line5.maxLength = 35;
SolicitorParty_ContactDetails_Address_Line5.helpText = "Fifth line of solicitor's address";
SolicitorParty_ContactDetails_Address_Line5.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Line5.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_Address_Postcode.tabIndex = -1;
SolicitorParty_ContactDetails_Address_Postcode.maxLength = 8;
SolicitorParty_ContactDetails_Address_Postcode.helpText = "Postcode of the solicitor";
SolicitorParty_ContactDetails_Address_Postcode.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_Address_Postcode.transformToDisplay = convertToUpper;
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

/*********************************************************************************/

function SolicitorParty_ContactDetails_DX() {};
SolicitorParty_ContactDetails_DX.tabIndex = -1;
SolicitorParty_ContactDetails_DX.maxLength = 35;
SolicitorParty_ContactDetails_DX.helpText = "Document exchange reference number of the solicitor";
SolicitorParty_ContactDetails_DX.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_DX.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_DX.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_TelephoneNumber.tabIndex = -1;
SolicitorParty_ContactDetails_TelephoneNumber.maxLength = 24;
SolicitorParty_ContactDetails_TelephoneNumber.helpText = "Solicitor's telephone number";
SolicitorParty_ContactDetails_TelephoneNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_TelephoneNumber.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_FaxNumber.tabIndex = -1;
SolicitorParty_ContactDetails_FaxNumber.maxLength = 24;
SolicitorParty_ContactDetails_FaxNumber.helpText = "Solicitor's fax number";
SolicitorParty_ContactDetails_FaxNumber.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_FaxNumber.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_FaxNumber.transformToDisplay = convertToUpper;
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
SolicitorParty_ContactDetails_EmailAddress.tabIndex = -1;
SolicitorParty_ContactDetails_EmailAddress.maxLength = 80;
SolicitorParty_ContactDetails_EmailAddress.helpText = "Solicitor's email address";
SolicitorParty_ContactDetails_EmailAddress.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
SolicitorParty_ContactDetails_EmailAddress.isReadOnly = function() { return true; }
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

/*********************************************************************************/

function SolicitorParty_ContactDetails_PreferredMethodOfCommunication() {};
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.srcData = XPathConstants.REF_DATA_XPATH + "/PreferredCommunicationMethods";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.rowXPath = "/Method";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.keyXPath = "/Id";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.displayXPath = "/Name";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.tabIndex = -1;
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.helpText = "Select the preferred communication method of the solicitor";
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.isReadOnly = function() { return true; }
SolicitorParty_ContactDetails_PreferredMethodOfCommunication.retrieveOn = [XPathConstants.MASTERGRID_CHANGED,XPathConstants.SELECTED_SOLICITOR_XPATH];
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
SolicitorParty_Reference.tabIndex = -1;
SolicitorParty_Reference.maxLength = 24;
SolicitorParty_Reference.helpText = "Solicitors Reference Number";
SolicitorParty_Reference.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Reference.transformToDisplay = convertToUpper;
SolicitorParty_Reference.isReadOnly = function() { return true; }
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

/*********************************************************************************/

function SolicitorParty_Payee() {}; 
SolicitorParty_Payee.modelValue = {checked: "Y", unchecked: "N"}; 
SolicitorParty_Payee.tabIndex = -1;
SolicitorParty_Payee.helpText = "Tick box if solicitor is Payee or clear if claimant is Payee";
SolicitorParty_Payee.retrieveOn = [XPathConstants.MASTERGRID_CHANGED];
SolicitorParty_Payee.isReadOnly = function() { return true; }
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

/******************************** BUTTONS *****************************************/

function Header_ParticularsOfClaimButton() {}
Header_ParticularsOfClaimButton.tabIndex = 9;
Header_ParticularsOfClaimButton.enableOn = [Header_CaseNumber.dataBinding,Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,XPathConstants.DATA_XPATH + "/ParticularsOfClaimPresent"];
Header_ParticularsOfClaimButton.isEnabled = function() { return false; }

/*********************************************************************************/

function Footer_DetailsOfClaimButton() {};
Footer_DetailsOfClaimButton.tabIndex = 60;
Footer_DetailsOfClaimButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Footer_DetailsOfClaimButton.isEnabled = function() { return false; }

/*********************************************************************************/

function Footer_HearingDetailsButton() {};
Footer_HearingDetailsButton.tabIndex = 62;
Footer_HearingDetailsButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding,XPathConstants.CASE_STATUS];
Footer_HearingDetailsButton.isEnabled = function() { return false; }

/*********************************************************************************/

function Footer_OtherPossessionAddressButton() {};
Footer_OtherPossessionAddressButton.tabIndex = 63;
Footer_OtherPossessionAddressButton.enableOn = [Header_CaseNumber.dataBinding, Header_CaseType.dataBinding,Header_OwningCourtCode.dataBinding];
Footer_OtherPossessionAddressButton.isEnabled = function() { return false; }

/*********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "createUpdateCase" } ]
	}
};

Status_SaveButton.tabIndex = 70;
/**
 * @author rzxd7g
 * 
 */
Status_SaveButton.actionBinding = function()
{
	var screen_status = Services.getValue(XPathConstants.CASE_STATUS);
	if ( screen_status == FormConstants.STATUS_EXISTING )
	{
		Services.dispatchEvent("Create_Copy_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		Services.setTransientStatusBarMessage("Please retrieve a valid existing case.");
	}
};

/*********************************************************************************/

function Status_ClearButton() {}
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "createUpdateCase", alt: true } ]
	}
};
Status_ClearButton.tabIndex = 71;
/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	if ( confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE) )
	{
		// Clear out the case number, this will cause the form to be reset
		Services.setValue(Header_CaseNumber.dataBinding, "");
		Services.setFocus("Header_CaseNumber");
	}
};

/*********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.tabIndex = 72;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "createUpdateCase" } ]
	}
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

/**************************** COPY CASE FIELDS ************************************/

function CreateCopyPopup_NewCaseNumber() {};
CreateCopyPopup_NewCaseNumber.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CopyCaseParams/CaseNumber";
CreateCopyPopup_NewCaseNumber.tabIndex = 100;
CreateCopyPopup_NewCaseNumber.maxLength = 8;
CreateCopyPopup_NewCaseNumber.isMandatory = function() { return true; }
CreateCopyPopup_NewCaseNumber.transformToModel = convertToUpper;
CreateCopyPopup_NewCaseNumber.transformToDisplay = convertToUpper;
CreateCopyPopup_NewCaseNumber.validateOn = [XPathConstants.NEWCASEVALID_XPATH];
CreateCopyPopup_NewCaseNumber.validate = function()
{
	var ec = null;
	var value = Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding);
	if ( null != value )
	{
		// Check the format of the Case Number is correct
		ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.VALID_CASE_PATTERN, 'Caseman_invalidCaseNumberFormat_Msg');
		
		// Check if MAGS ORDER Case, the first 2 characters are alphabetic
		if ( null == ec && value.charAt(2) == "/" )
		{
			ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.MAGSORDER_CASE_PATTERN, 'Caseman_invalidMAGSORDERCaseNumberFormat_Msg');
		}
		
		if ( null == ec && !isMagsOrder() && value.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) == 0 )
		{
			// Non MAGS Order case trying to be copied and turned into a MAGS ORDER case
			ec = ErrorCode.getErrorCode("Caseman_invalidCaseNumberFormat_Msg");
			ec.m_message = "You cannot use a copy of a non MAGS ORDER case to create a MAGS ORDER case.";
		}
		
		if ( null == ec && isMagsOrder() && value.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) != 0 )
		{
			// MAGS Order case trying to be copied and turned into a non MAGS ORDER case
			ec = ErrorCode.getErrorCode("Caseman_invalidCaseNumberFormat_Msg");
			ec.m_message = "You cannot use a copy of a MAGS ORDER case to create a non MAGS ORDER case.";
		}
		
		var validCaseNumber = Services.getValue(XPathConstants.NEWCASEVALID_XPATH);
		if ( null == ec && validCaseNumber == "false" )
		{
			// Case Number already exists
			ec = ErrorCode.getErrorCode("Caseman_invalidCaseNumberFormat_Msg");
			ec.m_message = "The Case Number entered already exists.";
			Services.setFocus("CreateCopyPopup_NewCaseNumber");
		}
		else if ( null == ec && validCaseNumber == "true" )
		{
			// New Case Number entered, check the case number is in a valid new case pattern
			var patternMatchOne = value.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_ONE);
			var patternMatchTwo = value.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_TWO);
			if ( 0 != patternMatchOne && 0 != patternMatchTwo )
			{
				// New Case Number entered does not match any of the valid patterns
				ec = ErrorCode.getErrorCode("Caseman_invalidNewCaseNumberFormat_Msg");
				Services.setFocus("CreateCopyPopup_NewCaseNumber");
			}
		}
	}
	return ec;
}

CreateCopyPopup_NewCaseNumber.logicOn = [CreateCopyPopup_NewCaseNumber.dataBinding];
CreateCopyPopup_NewCaseNumber.logic = function(event)
{
	if( event.getXPath() != CreateCopyPopup_NewCaseNumber.dataBinding )
	{
		return;
	}
	
	var newCaseNumber = Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(newCaseNumber) )
	{
		// Query the Case Number
		var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", newCaseNumber );
		Services.callService("getCase", params, CreateCopyPopup_NewCaseNumber, true);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
CreateCopyPopup_NewCaseNumber.onSuccess = function(dom)
{
	// Select the ManageCase tag rather than the ds tag
	var data = dom.selectSingleNode(XPathConstants.DATA_XPATH);
	if( null != data )
	{
		// The Case Number entered already exists
		Services.setValue(XPathConstants.NEWCASEVALID_XPATH, "false");
	}
	else
	{
		Services.setValue(XPathConstants.NEWCASEVALID_XPATH, "true");
		var caseNumber = Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding);
		var patternMatchOne = caseNumber.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_ONE);
		var patternMatchTwo = caseNumber.search(CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_TWO);
		if ( 0 == patternMatchOne || 0 == patternMatchTwo )
		{
			Services.setFocus("CreateCopyPopup_OwningCourtCode");
		}
	}
}

/**********************************************************************************/

function CreateCopyPopup_OwningCourtCode() {};
CreateCopyPopup_OwningCourtCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CopyCaseParams/OwningCourtCode";
CreateCopyPopup_OwningCourtCode.tabIndex = 101;
CreateCopyPopup_OwningCourtCode.maxLength = 3;
CreateCopyPopup_OwningCourtCode.isMandatory = function() { return true; }
CreateCopyPopup_OwningCourtCode.logicOn = [CreateCopyPopup_OwningCourtCode.dataBinding];
CreateCopyPopup_OwningCourtCode.logic = function(event)
{
	if( event.getXPath() != CreateCopyPopup_OwningCourtCode.dataBinding )
	{
		return;
	}

	var courtCode = Services.getValue(CreateCopyPopup_OwningCourtCode.dataBinding);
	if( this.getValid() )
	{
		if ( !CaseManUtils.isBlank(courtCode) )
		{
			var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + courtCode + "']/Name");
			Services.setValue(CreateCopyPopup_OwningCourtName.dataBinding, courtName);
		}
		else
		{
			Services.setValue(CreateCopyPopup_OwningCourtName.dataBinding, "");
		}
	}
}

CreateCopyPopup_OwningCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + CreateCopyPopup_OwningCourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

/**********************************************************************************/

function CreateCopyPopup_OwningCourtName() {};
CreateCopyPopup_OwningCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CopyCaseParams/OwningCourtName";
CreateCopyPopup_OwningCourtName.tabIndex = 102;
CreateCopyPopup_OwningCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CreateCopyPopup_OwningCourtName.rowXPath = "Court";
CreateCopyPopup_OwningCourtName.keyXPath = "Name";
CreateCopyPopup_OwningCourtName.displayXPath = "Name";
CreateCopyPopup_OwningCourtName.strictValidation = true;
CreateCopyPopup_OwningCourtName.helpText = "Owning court name";
CreateCopyPopup_OwningCourtName.isMandatory = function() { return true; }
CreateCopyPopup_OwningCourtName.transformToDisplay = convertToUpper;
CreateCopyPopup_OwningCourtName.logicOn = [CreateCopyPopup_OwningCourtName.dataBinding];
CreateCopyPopup_OwningCourtName.logic = function(event)
{
	if( event.getXPath() != CreateCopyPopup_OwningCourtName.dataBinding )
	{
		return;
	}

	var courtName = Services.getValue(CreateCopyPopup_OwningCourtName.dataBinding);
	if( !CaseManUtils.isBlank(courtName) ) 
	{
		// The entered value must be valid
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = '" + courtName + "']/Code");
		Services.setValue(CreateCopyPopup_OwningCourtCode.dataBinding, courtCode);
	}
	else
	{
		Services.setValue(CreateCopyPopup_OwningCourtCode.dataBinding, "");
	}
}

/**********************************************************************************/

function CreateCopyPopup_OwningCourtLOVButton() {};
CreateCopyPopup_OwningCourtLOVButton.tabIndex = 103;

/**********************************************************************************/

function CreateCopyPopup_CopyJudgmentsFlag() {};
CreateCopyPopup_CopyJudgmentsFlag.tabIndex = 104;
CreateCopyPopup_CopyJudgmentsFlag.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CopyCaseParams/CopyJudgmentsFlag";
CreateCopyPopup_CopyJudgmentsFlag.modelValue = {checked: "Y", unchecked: "N"};
CreateCopyPopup_CopyJudgmentsFlag.logicOn = [CreateCopyPopup_CopyJudgmentsFlag.dataBinding];
CreateCopyPopup_CopyJudgmentsFlag.logic = function(event)
{
	if ( event.getXPath() != CreateCopyPopup_CopyJudgmentsFlag.dataBinding )
	{
		return;
	}
	
	var copyJudgmentsFlag = Services.getValue(CreateCopyPopup_CopyJudgmentsFlag.dataBinding);
	if ( copyJudgmentsFlag == "Y" )
	{
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var params = new ServiceParams();
		params.addSimpleParameter("CaseNumber", caseNumber);
		Services.callService("getJudgment", params, CreateCopyPopup_CopyJudgmentsFlag, true);
	}
	else
	{
		// Clean up the Judgments Node
		Services.removeNode(XPathConstants.JUDGMENTS_XPATH);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
CreateCopyPopup_CopyJudgmentsFlag.onSuccess = function(dom)
{
	var judgmentsNode = dom.selectSingleNode(XPathConstants.JUDGMENTS_XPATH);
	Services.replaceNode(XPathConstants.JUDGMENTS_XPATH, judgmentsNode);
}

/**********************************************************************************/

function CreateCopyPopup_SaveButton() {};
CreateCopyPopup_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "Create_Copy_Popup" } ]
	}
};
CreateCopyPopup_SaveButton.tabIndex = 105;
CreateCopyPopup_SaveButton.enableOn = [CreateCopyPopup_NewCaseNumber.dataBinding, CreateCopyPopup_OwningCourtCode.dataBinding, XPathConstants.NEWCASEVALID_XPATH];
CreateCopyPopup_SaveButton.isEnabled = function()
{
	// Button disabled if any of the copy popup fields are blank or invalid
	var caseNumber = Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding);
	var caseNumberAdaptor = Services.getAdaptorById("CreateCopyPopup_NewCaseNumber");
	var courtCode = Services.getValue(CreateCopyPopup_OwningCourtCode.dataBinding);
	var courtCodeAdaptor = Services.getAdaptorById("CreateCopyPopup_OwningCourtCode");
	
	if ( CaseManUtils.isBlank(caseNumber) || !caseNumberAdaptor.getValid() || 
		 CaseManUtils.isBlank(courtCode) || !courtCodeAdaptor.getValid() )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * @return null 
 */
CreateCopyPopup_SaveButton.actionBinding = function()
{
	if ( !CreateCopyPopup_SaveButton.isEnabled() )
	{
		// Popup not valid
		return;
	}
	
	// Lower the popup
	Services.dispatchEvent("Create_Copy_Popup", BusinessLifeCycleEvents.EVENT_LOWER);

	// Determine if the court has changed (and need to remove coded parties)
	var originalCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	var newCourt = Services.getValue(CreateCopyPopup_OwningCourtCode.dataBinding);
	var newCourtName = Services.getValue(CreateCopyPopup_OwningCourtName.dataBinding);
	var removeCodedParties = ( originalCourt == newCourt ) ? false : true;
	var copyJudgmentsFlag = Services.getValue(CreateCopyPopup_CopyJudgmentsFlag.dataBinding);
	var countJudgments = Services.countNodes(XPathConstants.JUDGMENTS_XPATH + "/Judgments/Judgment");
	var currentDate = CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH);
	var currentUser = Services.getCurrentUser();
	
	Services.startTransaction();
	var originalData = Services.getNode(XPathConstants.DATA_XPATH);
	Services.replaceNode(XPathConstants.COPY_DATA_XPATH, originalData);

	// Get rid of SCN Numbers
	removeSCNNodes(XPathConstants.COPY_DATA_XPATH);
	
	// Remove any Judgment SCNs and clear any Applications to Vary, Set Aside or Judgment Hearings
	if ( copyJudgmentsFlag == "Y" && countJudgments > 0)
	{
		var judgmentXPath = null;
		var partyForXPath = null;
		var hearingXPath = null;
		var appVaryXPath = null;
		var appAsideXPath = null;
		for ( var i=0; i<countJudgments; i++ )
		{
			// Get rid of Judgment SCN Numbers
			judgmentXPath = XPathConstants.JUDGMENTS_XPATH + "/Judgments/Judgment[" + (i+1) + "]";
			removeSCNNodes(judgmentXPath);
			for ( var j=0, l=Services.countNodes(judgmentXPath + "/InFavourParties/Party"); j<l; j++ )
			{
				partyForXPath = judgmentXPath + "/InFavourParties/Party[" + (j+1) + "]";
				removeSCNNodes(partyForXPath);
				Services.removeNode(partyForXPath + "/JudgmentSequence");
			}
			
			// Clear any Judgment Hearings
			for ( var j=0, l=Services.countNodes(judgmentXPath + "/JudgmentHearing/Hearing"); j<l; j++ )
			{
				// Comment back in if need to add Judgment Hearings
				//hearingXPath = judgmentXPath + "/JudgmentHearing/Hearing[" + (j+1) + "]";
				//removeSCNNodes(hearingXPath);
				Services.removeNode(judgmentXPath + "/JudgmentHearing/Hearing[1]");
			}
			
			// Clear any Applications to Set Aside
			for ( var j=0, l=Services.countNodes(judgmentXPath + "/ApplicationsToSetAside/Application"); j<l; j++ )
			{
				// Comment back in if need to add Applications to Vary
				//appAsideXPath = judgmentXPath + "/ApplicationsToSetAside/Application[" + (j+1) + "]";
				//removeSCNNodes(appAsideXPath);
				Services.removeNode(judgmentXPath + "/ApplicationsToSetAside/Application[1]");
			}
			
			// Clear any Applications to Vary
			for ( var j=0, l=Services.countNodes(judgmentXPath + "/ApplicationsToVary/Variation"); j<l; j++ )
			{
				// Comment back in if need to add Judgment Hearings
				//appVaryXPath = judgmentXPath + "/ApplicationsToVary/Variation[" + (j+1) + "]";
				//removeSCNNodes(appVaryXPath);
				Services.removeNode(judgmentXPath + "/ApplicationsToVary/Variation[1]");
			}
			
			// Set the Judgment Defaults
			Services.setValue(judgmentXPath + "/JudgmentId", "");
			Services.setValue(judgmentXPath + "/WarrantId", "");
			Services.setValue(judgmentXPath + "/WarrantParty", "");
			Services.setValue(judgmentXPath + "/Status", "");
			Services.setValue(judgmentXPath + "/VenueCode", newCourt);
			Services.setValue(judgmentXPath + "/VenueName", newCourtName);
			Services.removeNode(judgmentXPath + "/PartyId");
			Services.setValue(judgmentXPath + "/Date", currentDate);
			Services.setValue(judgmentXPath + "/DateRTL", "");
			Services.setValue(judgmentXPath + "/PaidInFullDate", "");
			Services.setValue(judgmentXPath + "/NotificationDate", "");

			// First Pay Date can be blank already so test is populated before set it
			var firstPayDate = Services.getValue(judgmentXPath + "/FirstPayDate");
			if ( !CaseManUtils.isBlank(firstPayDate) )
			{
				Services.setValue(judgmentXPath + "/FirstPayDate", currentDate);
			}
			
			// Add Judgment Events (Only Create 375 if has RTL Date)
			//Services.setValue(judgmentXPath + "/JudgmentEvents/Event/EventID", 375);
			//Services.setValue(judgmentXPath + "/JudgmentEvents/Event/EventSequence", "");
		}
		
		// Send the processed Judgment data to a temporary area of the DOM
		var judgmentsNode = Services.getNode(XPathConstants.JUDGMENTS_XPATH + "/Judgments");
		Services.replaceNode(XPathConstants.COPY_JUDGMENT_XPATH, judgmentsNode);
	}
	

	
	// Update the Litigious Parties
	var countLitigiousParties = Services.countNodes(XPathConstants.COPY_DATA_XPATH + "/Parties/LitigiousParty");
	for ( var i=0, l=countLitigiousParties; i<l; i++ )
	{
		var rootXPath = XPathConstants.COPY_DATA_XPATH + "/Parties/LitigiousParty[" + (i + 1) + "]";
		
		// Remove any SCN Nodes on the party
		removeSCNNodes(rootXPath);
		removeSCNNodes(rootXPath + "/ContactDetails/Address");

		// Set the Party's status node to 'NEW'
		Services.setValue(rootXPath + "/Status", FormConstants.STATUS_NEW);
		
		var code = Services.getValue(rootXPath + "/Code");
		if ( removeCodedParties && !CaseManUtils.isBlank(code) && !isNationalCodedParty(code) )
		{
			// Party is local coded party and needs to be converted to a non coded party
			Services.setValue(rootXPath + "/Code", "");
			Services.setValue(rootXPath + "/PartyId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/AddressId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/DateFrom", currentDate);
			Services.setValue(rootXPath + "/ContactDetails/Address/CreatedBy", currentUser);
		}
		else if ( CaseManUtils.isBlank(code) )
		{
			// Party is a non coded party, clear the party and address id
			Services.setValue(rootXPath + "/PartyId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/AddressId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/DateFrom", currentDate);
			Services.setValue(rootXPath + "/ContactDetails/Address/CreatedBy", currentUser);
		}

		// Remove the party's historical addresses
		Services.removeNode(rootXPath + "/HistoricalAddresses");
	}
	
	// Update the Solicitor Parties
	var countSolicitorParties = Services.countNodes(XPathConstants.COPY_DATA_XPATH + "/Parties/Solicitor");
	for ( var i=0, l=countSolicitorParties; i<l; i++ )
	{
		var solNumber = i + 1;
		var rootXPath = XPathConstants.COPY_DATA_XPATH + "/Parties/Solicitor[" + solNumber + "]";
		
		// Remove any SCN Nodes on the party
		removeSCNNodes(rootXPath);
		removeSCNNodes(rootXPath + "/ContactDetails/Address");

		// Set the Party's status node to 'NEW'
		Services.setValue(rootXPath + "/Status", FormConstants.STATUS_NEW);
		
		// Reorder the numbering of the Solicitors which can be out of step on existing cases
		Services.setValue(rootXPath + "/Number", solNumber);
		
		var code = Services.getValue(rootXPath + "/Code");
		if ( removeCodedParties && !CaseManUtils.isBlank(code) && !isNationalCodedParty(code) )
		{
			// Party is local coded party and needs to be converted to a non coded party
			Services.setValue(rootXPath + "/Code", "");
			Services.setValue(rootXPath + "/PartyId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/AddressId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/DateFrom", currentDate);
		}
		else if ( CaseManUtils.isBlank(code) )
		{
			// Party is a non coded party, clear the party and address id
			Services.setValue(rootXPath + "/PartyId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/AddressId", "");
			Services.setValue(rootXPath + "/ContactDetails/Address/DateFrom", currentDate);
		}
	}

	// Remove the Hearing Node (if present)
	Services.removeNode(XPathConstants.COPY_DATA_XPATH + "/HearingDetails");
	
	var otherPossnAddressId = Services.getValue(XPathConstants.COPY_DATA_XPATH + "/OtherPossessionAddress/Address/AddressId");
	if ( !CaseManUtils.isBlank(otherPossnAddressId) )
	{
		// Other Possession Address is present
		removeSCNNodes(XPathConstants.COPY_DATA_XPATH + "/OtherPossessionAddress/Address");
		Services.setValue(XPathConstants.COPY_DATA_XPATH + "/OtherPossessionAddress/Address/AddressId", "");
		Services.setValue(XPathConstants.COPY_DATA_XPATH + "/OtherPossessionAddress/Address/CreatedBy", currentUser);
	}

	// Apply the new values
	Services.setValue(XPathConstants.COPY_DATA_XPATH + "/CreditorCode", "");
	Services.setValue(XPathConstants.COPY_DATA_XPATH + "/Status", FormConstants.STATUS_NEW);
	Services.setValue(XPathConstants.COPY_DATA_XPATH + "/CaseNumber", Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding) );
	Services.setValue(XPathConstants.COPY_DATA_XPATH + "/OwningCourtCode", newCourt);
	Services.setValue(XPathConstants.COPY_DATA_XPATH + "/OwningCourtName", Services.getValue(CreateCopyPopup_OwningCourtName.dataBinding) );
	Services.endTransaction();

	// Set up the DOM parameter
	var newDOM = XML.createDOM(null, null, null);
	var dataNode = Services.getNode(XPathConstants.COPY_DATA_XPATH);
	var dsNode = XML.createElement(newDOM, "ds");
	dsNode.appendChild(dataNode);
	newDOM.appendChild(dsNode);

	// Call the insert service
	var params = new ServiceParams();
	params.addDOMParameter("caseNumber", newDOM);
	Services.callService("addCase", params, CreateCopyPopup_SaveButton, true);
}

/**
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
CreateCopyPopup_SaveButton.onSuccess = function(dom, serviceName)
{
	var blnProcessNavData = false;
	
	if ( serviceName == "addCase" )
	{
		// Put the navigation list in the DOM
		Services.replaceNode(XPathConstants.NAVIGATIONLIST_XPATH, dom);
		
		// Determine if need to add Judgments
		var copyJudgmentsFlag = Services.getValue(CreateCopyPopup_CopyJudgmentsFlag.dataBinding);
		var countJudgments = Services.countNodes(XPathConstants.JUDGMENTS_XPATH + "/Judgments/Judgment");
		if ( copyJudgmentsFlag == "Y" && countJudgments > 0 )
		{
			// Need to call getJudgment on the newly created case to get the relevant SCN nodes
			var newCaseNumber = Services.getValue(CreateCopyPopup_NewCaseNumber.dataBinding);
			var params = new ServiceParams();
			params.addSimpleParameter("CaseNumber", newCaseNumber);
			Services.callService("getJudgment", params, CreateCopyPopup_SaveButton, true);
		}
		else
		{
			blnProcessNavData = true;
		}
	}
	else if ( serviceName == "getJudgment" )
	{
		// Replace the MaintainJudgments Node
		var dataNode = dom.selectSingleNode(XPathConstants.JUDGMENTS_XPATH);
		Services.replaceNode(XPathConstants.JUDGMENTS_XPATH, dataNode);
		
		// Add the Judgment Nodes from the old case
		var judgmentNodes = Services.getNode(XPathConstants.COPY_JUDGMENT_XPATH);
		Services.replaceNode(XPathConstants.JUDGMENTS_XPATH + "/Judgments", judgmentNodes);
		
		// Call the maintain judgments service
		var newDOM = XML.createDOM(null, null, null);
		var mcNode = Services.getNode(XPathConstants.JUDGMENTS_XPATH);
		var dsNode = XML.createElement(newDOM, "ds");
		dsNode.appendChild(mcNode);
		newDOM.appendChild(dsNode);		
		var params = new ServiceParams();		
		params.addDOMParameter("JudgmentSequence", newDOM);
		Services.callService("maintainJudgment", params, CreateCopyPopup_SaveButton, true);
	}
	else if ( serviceName == "maintainJudgment" )
	{
		// Have now added Judgments so continue where addCase left off
		blnProcessNavData = true;
	}

	if ( blnProcessNavData )
	{
		var NavWP = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/NavigateTo/WordProcessing");
		var NavAE = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/NavigateTo/AttachmentOfEarnings");
		
		if ( NavWP == "true" )
		{		
			// Normal Case, Make call to WP Controller
			var wpDOM = XML.createDOM(null, null, null);
			
			Services.setValue(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/WordProcessing/Request", "Create");
			var wpNode = Services.getNode(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/WordProcessing");
			wpDOM.appendChild( wpNode );
			WP.ProcessWP(FormController.getInstance(), wpDOM, "CopyCreateUpdateCase");
	
			// Clear out the case number, this will cause the form to be reset
			Services.setValue(Header_CaseNumber.dataBinding, "");
			Services.setFocus("Header_CaseNumber");
		}
		else if ( NavAE == "true" )
		{
			// MAGS ORDER Case, navigate to Create/Maintain AE
			var caseNumber = Services.getValue(XPathConstants.NAVIGATIONLIST_XPATH + "/Params/AttachmentOfEarnings/CaseNumber");
			Services.setValue(ManageAEParams.CASE_NUMBER, caseNumber);
			var navArray = Array(NavigationController.MANAGE_AE_FORM, "CopyCreateUpdateCase");
			NavigationController.createCallStack( navArray );
			NavigationController.nextScreen();
		}
	}
}

/**********************************************************************************/

function CreateCopyPopup_CancelButton() {};
CreateCopyPopup_CancelButton.tabIndex = 106;
