/** 
 * @fileoverview ViewCourtData.js:
 * This file contains the form and field configurations for the UC016 - View Court Data screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 09/02/2010 - Chris Vincent, changes required for Trac 2629 which includes new Welsh Court Name fields.
 * 22/02/2010 - Chris Vincent, changed the hint text for the Welsh Court Names to match the Maintain Court
 *				screen at request of MoJ.  Trac 2629.
 * 07/09/2012 - Chris Vincent, added DR Telephone Number field.  Trac 4718.
 */

/**
 * XPath Constants
 * @author szt44s
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/ViewCourtData"
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.RESULTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SearchResults/Courts";

/****************************** MAIN FORM *****************************************/

function viewCourtData() {}

// Load reference data from server-side service calls
viewCourtData.refDataServices = [
    {name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];

/**************************** OTHER FUNCTIONS **************************************/

/**
 * Exits the screen and goes back to the main menu
 * @author szt44s
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function indicates if court record data has been loaded or not
 *
 * @return [Boolean] True if data has been loaded, else false
 * @author szt44s
 */
function courtDataLoaded()
{
	var gridDB = Services.getValue(Header_CourtNameListGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

/******************************** LOV POPUPS ***************************************/

function HeaderCourtNameLovBtnGrid() {};
HeaderCourtNameLovBtnGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/CourtCode";
HeaderCourtNameLovBtnGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
HeaderCourtNameLovBtnGrid.rowXPath = "Court";
HeaderCourtNameLovBtnGrid.keyXPath = "Code";
HeaderCourtNameLovBtnGrid.columns = [
	{xpath: "Code", sort: "numerical"},
	{xpath: "Name"}
];

HeaderCourtNameLovBtnGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_CourtName_LovBtn"} ],
		keys: [ { key: Key.F6, element: "Header_Court_Code" }, { key: Key.F6, element: "Header_Court_Name" } ]
	}
};

HeaderCourtNameLovBtnGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
HeaderCourtNameLovBtnGrid.destroyOnClose = false;
HeaderCourtNameLovBtnGrid.logicOn = [HeaderCourtNameLovBtnGrid.dataBinding];
HeaderCourtNameLovBtnGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(HeaderCourtNameLovBtnGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(HeaderCourtNameLovBtnGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(Header_Court_Code.dataBinding, courtCode);
		Services.setValue(HeaderCourtNameLovBtnGrid.dataBinding, "");
	}
}

/**
 * @author szt44s
 * @return "Header_Id"  
 */
HeaderCourtNameLovBtnGrid.nextFocusedAdaptorId = function() {
	return "Header_Id";
}

/********************************** GRIDS *****************************************/

function Header_CourtNameListGrid() {};
Header_CourtNameListGrid.tabIndex = 7;
Header_CourtNameListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedCourt";
Header_CourtNameListGrid.srcData = XPathConstants.RESULTS_XPATH;
Header_CourtNameListGrid.rowXPath = "Court";
Header_CourtNameListGrid.keyXPath = "CourtCode";
Header_CourtNameListGrid.columns = [
	{xpath: "CourtCode", sort: "numerical"},
	{xpath: "CourtName"},
	{xpath: "ID"},
	{xpath: "DistrictRegistry"}	
];

Header_CourtNameListGrid.enableOn = [XPathConstants.RESULTS_XPATH + "/Court"];
Header_CourtNameListGrid.isEnabled = function()
{
	return Services.countNodes(XPathConstants.RESULTS_XPATH + "/Court") > 0;
}

/*********************************************************************************/

function Results_CourtAddressListGrid() {};
Results_CourtAddressListGrid.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_CourtAddressListGrid.srcDataOn =  [Header_CourtNameListGrid.dataBinding];
Results_CourtAddressListGrid.tabIndex = 8;
Results_CourtAddressListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedAddress";
Results_CourtAddressListGrid.srcData = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses";
Results_CourtAddressListGrid.rowXPath = "Address";
Results_CourtAddressListGrid.keyXPath = "AddressId";
Results_CourtAddressListGrid.columns = [
	{xpath: "Type"},
	{xpath: "Line[1]"},
	{xpath: "Line[2]"}
];

Results_CourtAddressListGrid.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_CourtAddressListGrid.isEnabled = courtDataLoaded;

/***************************** DATA BINDINGS **************************************/

Header_Court_Code.dataBinding = XPathConstants.DATA_XPATH + "/CourtCode";
Header_Court_Name.dataBinding = XPathConstants.DATA_XPATH + "/Name";
Header_Id.dataBinding = XPathConstants.DATA_XPATH + "/Id";
Header_District_Registry.dataBinding = XPathConstants.DATA_XPATH + "/DistrictRegistry";

Results_Welsh_HighCourt_Name.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/WelshHighCourtName";
Results_Welsh_CountyCourt_Name.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/WelshCountyCourtName";
Results_Grouping_Court.dataBinding = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/GroupingCourt ]/Name";
Results_DMCourt.dataBinding = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/DMCourtCode ]/Name";
Results_ContactDetails_DX.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/DX";
Results_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/TelephoneNumber";
Results_ContactDetails_FaxNumber.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/FaxNumber";
Results_ContactDetails_DRTelephoneNumber.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/DRTelephoneNumber";
Results_ContactDetails_Address_Type.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Type";
Results_ContactDetails_Address_Line1.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Line[1]";
Results_ContactDetails_Address_Line2.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Line[2]";
Results_ContactDetails_Address_Line3.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Line[3]";
Results_ContactDetails_Address_Line4.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Line[4]";
Results_ContactDetails_Address_Line5.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/Line[5]";
Results_ContactDetails_Address_Postcode.dataBinding = XPathConstants.RESULTS_XPATH + "/Court[./CourtCode=" + Header_CourtNameListGrid.dataBinding + "]/ContactDetails/Addresses/Address[./AddressId=" + Results_CourtAddressListGrid.dataBinding + "]/PostCode";

/********************************  FIELDS ******************************************/

function Header_Court_Code() {}
Header_Court_Code.tabIndex = 1;
Header_Court_Code.maxLength = 3;
Header_Court_Code.helpText = "Unique three digit court location code";
Header_Court_Code.validate = function()
{
	var errCode = null;
	
	// User can only enter court codes that are already loaded in the ref data.
	var courtCode = Services.getValue(Header_Court_Code.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		var courtExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_Court_Code.dataBinding + "]");
		if ( !courtExists )
		{
			// The entered court code does not exist
			errCode = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
		}
	}
	return errCode;
}

Header_Court_Code.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

// Configure the location in the model which will generate data change events
Header_Court_Code.logicOn = [Header_Court_Code.dataBinding];
Header_Court_Code.logic = function(event)
{
	if (event.getXPath() != Header_Court_Code.dataBinding)
	{
		return;
	}
	
	var courtCode = Services.getValue(Header_Court_Code.dataBinding);
	if ( !CaseManUtils.isBlank( courtCode ) )
	{
		// Populate the Name field
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Header_Court_Code.dataBinding + "]/Name");
		if ( !CaseManUtils.isBlank(courtName) && Services.getValue(Header_Court_Name.dataBinding) != courtName)
		{
			Services.setValue(Header_Court_Name.dataBinding, courtName);
		}
	}
	else
	{
		Services.setValue(Header_Court_Name.dataBinding, "");
	}
}

/*********************************************************************************/

function Header_Court_Name() {}
Header_Court_Name.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Header_Court_Name.rowXPath = "Court";
Header_Court_Name.keyXPath = "Name";
Header_Court_Name.displayXPath = "Name";
Header_Court_Name.tabIndex = 2;
Header_Court_Name.strictValidation = true;
Header_Court_Name.helpText = "Name of the court";
Header_Court_Name.logicOn = [Header_Court_Name.dataBinding];
Header_Court_Name.logic = function(event)
{
	if (event.getXPath() != Header_Court_Name.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(Header_Court_Name.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Header_Court_Name.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(Header_Court_Code.dataBinding) != courtCode)
		{
			Services.setValue(Header_Court_Code.dataBinding, courtCode);
		}
	}
	else
	{
		Services.setValue(Header_Court_Code.dataBinding, "");
	}
}


/*********************************************************************************/

function Header_Id() {}
Header_Id.tabIndex = 4;
Header_Id.maxLength = 2;
Header_Id.helpText = "The court's alpha identification code";
Header_Id.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_Id.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function Header_District_Registry() {}
Header_District_Registry.modelValue = {checked: "Y", unchecked: "N"};
Header_District_Registry.tabIndex = 5;
Header_District_Registry.helpText = "Court District Registry";

/*********************************************************************************/

function Results_Welsh_HighCourt_Name() {}
Results_Welsh_HighCourt_Name.tabIndex = -1;
Results_Welsh_HighCourt_Name.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_Welsh_HighCourt_Name.maxLength = 60;
Results_Welsh_HighCourt_Name.helpText = "Welsh High Court Name including description e.g. Cofrestrfa Ddosbarth";
Results_Welsh_HighCourt_Name.isReadOnly = function() { return true; }
Results_Welsh_HighCourt_Name.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_Welsh_HighCourt_Name.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_Welsh_CountyCourt_Name() {}
Results_Welsh_CountyCourt_Name.tabIndex = -1;
Results_Welsh_CountyCourt_Name.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_Welsh_CountyCourt_Name.maxLength = 60;
Results_Welsh_CountyCourt_Name.helpText = "Welsh County Court Name including description e.g. Llys Sirol";
Results_Welsh_CountyCourt_Name.isReadOnly = function() { return true; }
Results_Welsh_CountyCourt_Name.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_Welsh_CountyCourt_Name.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_Grouping_Court() {}
Results_Grouping_Court.tabIndex = -1;
Results_Grouping_Court.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_Grouping_Court.maxLength = 3;
Results_Grouping_Court.helpText = "Grouping Court";
Results_Grouping_Court.isReadOnly = function() { return true; }
Results_Grouping_Court.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_Grouping_Court.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_DMCourt() {}
Results_DMCourt.tabIndex = -1;
Results_DMCourt.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_DMCourt.helpText = "Diary Manager Court";
Results_DMCourt.maxLength = 80;
Results_DMCourt.isReadOnly = function() { return true; }
Results_DMCourt.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_DMCourt.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_DX() {}
Results_ContactDetails_DX.tabIndex = -1;
Results_ContactDetails_DX.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_DX.helpText = "Court DX number";
Results_ContactDetails_DX.maxLength = 35;
Results_ContactDetails_DX.isReadOnly = function() { return true; }
Results_ContactDetails_DX.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_DX.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_TelephoneNumber() {}
Results_ContactDetails_TelephoneNumber.tabIndex = -1;
Results_ContactDetails_TelephoneNumber.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_TelephoneNumber.maxLength = 24;
Results_ContactDetails_TelephoneNumber.helpText = "Court telephone number";
Results_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }
Results_ContactDetails_TelephoneNumber.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_TelephoneNumber.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_FaxNumber() {}
Results_ContactDetails_FaxNumber.tabIndex = -1;
Results_ContactDetails_FaxNumber.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_FaxNumber.helpText = "Court fax number";
Results_ContactDetails_FaxNumber.maxLength = 24;
Results_ContactDetails_FaxNumber.isReadOnly = function() { return true; }
Results_ContactDetails_FaxNumber.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_FaxNumber.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_DRTelephoneNumber() {}
Results_ContactDetails_DRTelephoneNumber.tabIndex = -1;
Results_ContactDetails_DRTelephoneNumber.retrieveOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_DRTelephoneNumber.maxLength = 24;
Results_ContactDetails_DRTelephoneNumber.helpText = "Court District Registry telephone number";
Results_ContactDetails_DRTelephoneNumber.isReadOnly = function() { return true; }
Results_ContactDetails_DRTelephoneNumber.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_DRTelephoneNumber.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Type() {}
Results_ContactDetails_Address_Type.tabIndex = -1;
Results_ContactDetails_Address_Type.retrieveOn = [Header_CourtNameListGrid.dataBinding,Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Type.maxLength = 15;
Results_ContactDetails_Address_Type.helpText = "The type of address, i.e. Office or Court House";
Results_ContactDetails_Address_Type.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Type.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Type.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Line1() {}
Results_ContactDetails_Address_Line1.tabIndex = -1;
Results_ContactDetails_Address_Line1.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Line1.maxLength = 35;
Results_ContactDetails_Address_Line1.helpText = "1st line of court's address";
Results_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Line1.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Line1.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Line2() {}
Results_ContactDetails_Address_Line2.tabIndex = -1;
Results_ContactDetails_Address_Line2.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Line2.maxLength = 35;
Results_ContactDetails_Address_Line2.helpText = "2nd line of court's address";
Results_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Line2.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Line2.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Line3() {}
Results_ContactDetails_Address_Line3.tabIndex = -1;
Results_ContactDetails_Address_Line3.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Line3.maxLength = 35;
Results_ContactDetails_Address_Line3.helpText = "3rd line of court's address";
Results_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Line3.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Line3.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Line4() {}
Results_ContactDetails_Address_Line4.tabIndex = -1;
Results_ContactDetails_Address_Line4.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Line4.maxLength = 35;
Results_ContactDetails_Address_Line4.helpText = "4th line of court's address";
Results_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Line4.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Line4.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Line5() {}
Results_ContactDetails_Address_Line5.tabIndex = -1;
Results_ContactDetails_Address_Line5.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Line5.maxLength = 35;
Results_ContactDetails_Address_Line5.helpText = "5th line of court's address";
Results_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Line5.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Line5.isEnabled = courtDataLoaded;

/*********************************************************************************/

function Results_ContactDetails_Address_Postcode() {}
Results_ContactDetails_Address_Postcode.tabIndex = -1;
Results_ContactDetails_Address_Postcode.retrieveOn = [Results_CourtAddressListGrid.dataBinding];
Results_ContactDetails_Address_Postcode.maxLength = 8;
Results_ContactDetails_Address_Postcode.helpText = "Postcode of court's address";
Results_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
Results_ContactDetails_Address_Postcode.enableOn = [Header_CourtNameListGrid.dataBinding];
Results_ContactDetails_Address_Postcode.isEnabled = courtDataLoaded;

/******************************** BUTTONS *****************************************/

function Header_CourtName_LovBtn() {}
Header_CourtName_LovBtn.tabIndex = 3;

/**********************************************************************************/

function Header_SearchBtn() {}
Header_SearchBtn.tabIndex = 6;
Header_SearchBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "viewCourtData" } ]
	}
};

Header_SearchBtn.enableOn = [Header_Court_Code.dataBinding, Header_Court_Name.dataBinding, Header_Id.dataBinding, Header_District_Registry.dataBinding];
Header_SearchBtn.isEnabled = function()
{
	var owningCourtCode = Services.getValue(Header_Court_Code.dataBinding);
	var owningCourtName = Services.getValue(Header_Court_Name.dataBinding);
	var owningCourtId = Services.getValue(Header_Id.dataBinding);
	var owningCourtDistrictRegistry = Services.getValue(Header_District_Registry.dataBinding);

	if ( CaseManUtils.isBlank(owningCourtCode) &&
		 CaseManUtils.isBlank(owningCourtId) &&
		 CaseManUtils.isBlank(owningCourtName) &&
		 CaseManUtils.isBlank(owningCourtDistrictRegistry) )
	{
		// Disabled if all search fields are blank
		return false;
	}

	if (!Services.getAdaptorById("Header_Court_Name").getValid())
    {
        return false;
    }
    
    if (!Services.getAdaptorById("Header_Court_Code").getValid())
    {
        return false;
    }
	
	return true;
}

/**
 * @author szt44s
 * @return null 
 */
Header_SearchBtn.actionBinding = function()
{
	if ( !Header_SearchBtn.isEnabled() )
	{
		// The enablement rules have not been met, do not continue
		return;
	}
	
	// Retrieve values from the DOM
	var owningCourtCode = Services.getValue(Header_Court_Code.dataBinding);
	var owningCourtName = Services.getValue(Header_Court_Name.dataBinding);
	var owningCourtId = Services.getValue(Header_Id.dataBinding);
	var owningCourtDistrictRegistry = Services.getValue(Header_District_Registry.dataBinding);

	// Build and submit search query to service	
	var params = new ServiceParams();

	// It is permissable to submit "", which the service will ignore.
	// Any submitted 'like' search criteria must be surrounded by "%"
	// Removed wildcard searches from certain fields.
	var paramValue = CaseManUtils.isBlank(owningCourtCode) ? "" : owningCourtCode;
	params.addSimpleParameter("code", paramValue);

	var paramValue = CaseManUtils.isBlank(owningCourtId) ? "" : "%" + owningCourtId + "%";
	params.addSimpleParameter("id", paramValue);

	var paramValue = CaseManUtils.isBlank(owningCourtName) ? "" : owningCourtName;
	params.addSimpleParameter("courtName", paramValue);

	var paramValue = CaseManUtils.isBlank(owningCourtDistrictRegistry) ? "" :  owningCourtDistrictRegistry;
	params.addSimpleParameter("districtregistry", paramValue);

	Services.callService("getCourtsFilter", params, Header_SearchBtn, true);
};

/**
 * @param dom
 * @author szt44s
 * 
 */
Header_SearchBtn.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.RESULTS_XPATH, dom);
	if ( Services.countNodes(XPathConstants.RESULTS_XPATH + "/Court") == 0 )
	{
		alert(Messages.NO_RESULTS_MESSAGE);
	}
}

/**********************************************************************************/

function Status_ClearBtn() {}
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "viewCourtData", alt: true } ]
	}
};

Status_ClearBtn.tabIndex = 9;
/**
 * @author szt44s
 * 
 */
Status_ClearBtn.actionBinding = function()
{
	// Clear details and set focus on the Court Code field
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.endTransaction();
	Services.setFocus("Header_Court_Code");
};

/**********************************************************************************/

function Status_CloseBtn() {}
Status_CloseBtn.tabIndex = 10;
Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "viewCourtData" } ]
	}
};
