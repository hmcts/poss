/** 
 * @fileoverview MaintainCourtData.js:
 * This file contains the form and field configurations for the UC120 - Maintain 
 * Court Data screen.
 *
 * @author Dave Turner, Tony White, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 06/06/2006 - Chris Vincent, called reference data service (getAllCourtsShort) after adding 
 *				a new court so the new court would be in the reference data and the court code
 *				fields would be valid.
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the text fields without special validation.
 * 19/06/2006 - Chris Vincent, changed the Query_CourtId to be mandatory if the screen is in
 *				update mode.
 * 25/08/2006 - Chris Vincent, moved the call to setDirtyFlag() in Master_RemoveAddressButton.actionBinding
 * 				to within the confirm() if statement so dirty flag is only set when user confirms the 
 * 				address removal.  Defect 4754.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 21/09/2006 - Chris Vincent, changed the maximum lengths of the Bailiff Telephone and Fax Number
 * 				fields from 24 to 12 characters.  This is a temporary fix for defect 5346.  The real 
 * 				fix is to make a schema change to increase the field lengths on the PERSONALISE table.
 * 				Phil Hardy has confirmed this can go into live with non SUPS standard max lengths but
 * 				the real fix must be made post live.
 * 14/11/2006 - Chris Vincent, added Query_Court_Code.validateOn so the Court Code field validates
 *				when the reference data service getAllCourtsShort is retreived when adding a new case.
 *				UCT Defect 679.
 * 04/02/2008 - Chris Vincent, fixed CaseMan Defect 6154 which was the inability of the screen to cope
 * 				with courts that had duplicate names.  The autocompletes, now use the court code as a
 * 				key value and the display value of [Court Name] ([Court Code]) if duplicate names exist.
 * 09/02/2010 - Chris Vincent, changes required for Trac 2629 which includes new Welsh Court Name fields.
 *                                  Tab ordering has been updated to include the new fields.
 * 08/11/2011 - Chris Vincent, multiple changes to add a default printer field and a subform to change the
 *				court name.  Trac 4591.
 * 05/09/2012 - Chris Vincent, added DR Telephone, DR Opening Hours and By Appointment Flag fields.  Trac 4718
 */

/******************************* MAIN FORM *****************************************/

function MaintainCourtData() {};

MaintainCourtData.initialise = function()
{
	// Call courts reference data here so can process the data
	var params = new ServiceParams();
	Services.callService("getAllCourtsShort", params, MaintainCourtData, true);
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
MaintainCourtData.onSuccess = function(dom)
{
	// When add new court, need to call the reference data service getAllCourtsShort
	// so the newly added court will be present in the ref data.
	Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Courts", dom);
}

MaintainCourtData.refDataServices = [
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[] },
	{name:"AccountTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtAccountTypeList", serviceParams:[] },
	{name:"AddressTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtAddressTypeList", serviceParams:[] }
];

/******************************* SUB-FORMS *****************************************/

function addNewCourt_subform() {};
addNewCourt_subform.subformName = "AddNewCourtSubform";

addNewCourt_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_AddCourtButton"} ],
		keys: [ { key: Key.F2, element: "MaintainCourtData" } ],
		isEnabled: function()
		{
			return Services.hasAccessToForm(addNewCourt_subform.subformName);
		}
	}
};

addNewCourt_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewCourt/Court" } ];
/**
 * @author pz9j2w
 * 
 */
addNewCourt_subform.processReturnedData = function() 
{
	// Call the add new court service
	var newCourt = XML.createDOM(null, null, null);
	var courtNode = Services.getNode(XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewCourt/Court");
	newCourt.appendChild(courtNode);
	
	var params = new ServiceParams();
	params.addDOMParameter("courtDetails", newCourt);
	Services.callService("addCourt", params, addNewCourt_subform, true);
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
addNewCourt_subform.onSuccess = function(dom)
{
	// Re-retrieve the reference data (list of courts)
	var params = new ServiceParams();
	Services.callService("getAllCourtsShort", params, MaintainCourtData, true);

	// Retrieve the details of the new court
	var newCourtCode = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewCourt/Court/Code");
	loadCourtDetails(newCourtCode);
}

/**
 * @param exception
 * @author pz9j2w
 * 
 */
addNewCourt_subform.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**
 * @author pz9j2w
 * @return "Master_CourtAddressGrid"  
 */
addNewCourt_subform.nextFocusedAdaptorId = function() 
{
	return "Master_CourtAddressGrid";
}

/*********************************************************************************/

function addNewAddress_subform() {};
addNewAddress_subform.subformName = "addNewAddressSubform";

addNewAddress_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewAddress/Address" } ];
/**
 * @author pz9j2w
 * 
 */
addNewAddress_subform.processReturnedData = function() 
{
	var xp = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewAddress/Address";
	var addressType = Services.getValue(Master_CourtAddressType.dataBinding);
	var systemDate = Services.getValue(XPathConstants.REF_DATA_XPATH + "/SystemDate");
	var courtCode = Services.getValue(Query_Court_Code.dataBinding);
	
	Services.setValue( xp + "/Type", addressType );
	Services.setValue( xp + "/SurrogateId", getNextSurrogateKey() );
	Services.setValue( xp + "/DateFrom", systemDate );
	Services.setValue( xp + "/DateTo", "");
	Services.setValue( xp + "/CourtCode", courtCode);

	// Add the new address to the appropriate place in the DOM
	var addressNode = Services.getNode(xp);
	Services.addNode(addressNode, XPathConstants.DATA_XPATH + "/ContactDetails/Addresses[position()=last()+1]");
	
	// Set the dirty flag
	setDirtyFlag();
}

/**
 * @author pz9j2w
 * @return "Master_CourtAddressGrid"  
 */
addNewAddress_subform.nextFocusedAdaptorId = function() 
{
	return "Master_CourtAddressGrid";
}

/*********************************************************************************/

function changeCourtName_subform() {};
changeCourtName_subform.subformName = "ChangeCourtNameSubform";

changeCourtName_subform.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var courtName = Services.getValue(XPathConstants.DATA_XPATH + "/Name");
	Services.setValue(XPathConstants.VAR_FORM_XPATH + "/SubForms/ChangeCourtName/Court/CurrentName", courtName);
}

changeCourtName_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_FORM_XPATH + "/SubForms/ChangeCourtName/Court" } ];
changeCourtName_subform.processReturnedData = function() 
{
	// Set the Court Name in the data model to the value set in the subform
	var newCourtName = Services.getValue(XPathConstants.VAR_FORM_XPATH + "/SubForms/ChangeCourtName/Court/NewName");
	Services.setValue(XPathConstants.DATA_XPATH + "/Name", newCourtName);
	
	var dataNode = XML.createDOM(null, null, null);
	var courtNode = Services.getNode(XPathConstants.DATA_XPATH);
	dataNode.appendChild(courtNode);
	
	// Call update service
	var params = new ServiceParams();
	params.addDOMParameter("courtDetails", dataNode);
	Services.callService("updateCourt", params, Status_SaveButton, true);
	
	// Set flag to reload the Courts reference data (as name has been changed)
	Services.setValue(XPathConstants.RELOADREFDATA_XPATH, "Y");
}

/***************************** DATA BINDINGS ***************************************/

Query_Court_Code.dataBinding = XPathConstants.DATA_XPATH + "/Code";
Query_Court_Name.dataBinding = XPathConstants.DATA_XPATH + "/TempCourtName";
Query_CourtId.dataBinding = XPathConstants.DATA_XPATH + "/ID";
Query_DistrictRegistry.dataBinding = XPathConstants.DATA_XPATH + "/DistrictRegistry";
Query_SUPSCourt.dataBinding = XPathConstants.DATA_XPATH + "/SUPSCourt";

CourtData_Welsh_HighCourt_Name.dataBinding = XPathConstants.DATA_XPATH + "/WelshHighCourtName";
CourtData_Welsh_CountyCourt_Name.dataBinding = XPathConstants.DATA_XPATH + "/WelshCountyCourtName";
CourtData_InService.dataBinding = XPathConstants.DATA_XPATH + "/InService";
CourtData_DXNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/DXNumber";
CourtData_TelephoneNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/TelephoneNumber";
CourtData_FaxNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/FaxNumber";
CourtData_DR_TelephoneNumber.dataBinding = XPathConstants.DATA_XPATH + "/ContactDetails/DRTelephoneNumber";
CourtData_DefaultPrinter.dataBinding = XPathConstants.DATA_XPATH + "/DefaultPrinter";
CourtData_GroupingCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/GroupingCourtCode";
CourtData_GroupingCourtName.dataBinding = XPathConstants.DATA_XPATH + "/GroupingCourtName";
CourtData_DMCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/DMCourtCode";
CourtData_DMCourtName.dataBinding = XPathConstants.DATA_XPATH + "/DMCourtName";
CourtData_OpenFrom.dataBinding = XPathConstants.DATA_XPATH + "/OpenFrom";
CourtData_OpenTo.dataBinding = XPathConstants.DATA_XPATH + "/OpenTo";
CourtData_AccountType.dataBinding = XPathConstants.DATA_XPATH + "/AccountType";
CourtData_AccountingCode.dataBinding = XPathConstants.DATA_XPATH + "/AccountingCode";
CourtData_Bailiff_OpenFrom.dataBinding = XPathConstants.DATA_XPATH + "/BailiffOpenFrom";
CourtData_Bailiff_OpenTo.dataBinding = XPathConstants.DATA_XPATH + "/BailiffOpenTo";
CourtData_Bailiff_TelephoneNumber.dataBinding = XPathConstants.DATA_XPATH + "/BailiffTelephoneNumber";
CourtData_Bailiff_FaxNumber.dataBinding = XPathConstants.DATA_XPATH + "/BailiffFaxNumber";
CourtData_DR_OpenFrom.dataBinding = XPathConstants.DATA_XPATH + "/DROpenFrom";
CourtData_DR_OpenTo.dataBinding = XPathConstants.DATA_XPATH + "/DROpenTo";
CourtData_ByAppointment.dataBinding = XPathConstants.DATA_XPATH + "/ByAppointment";

CourtAddress_AddressType.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Type";
CourtAddress_Line1.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Line[1]";
CourtAddress_Line2.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Line[2]";
CourtAddress_Line3.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Line[3]";
CourtAddress_Line4.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Line[4]";
CourtAddress_Line5.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/Line[5]";
CourtAddress_Postcode.dataBinding = XPathConstants.SELECTED_ADDRESS_XPATH + "/PostCode";

Master_CourtAddressType.dataBinding 	= XPathConstants.VAR_PAGE_XPATH + "/NewAddress/Type";

/******************************** POPUPS *******************************************/

function QueryCourt_Popup() {};

QueryCourt_Popup.lower = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "QueryCourt_Popup" } ],
		singleClicks: [ {element: "QueryPopup_CancelButton"} ]
	}
};

/**
 * @author pz9j2w
 * @return "Query_CourtId"  
 */
QueryCourt_Popup.nextFocusedAdaptorId = function() 
{
	return "Query_CourtId";
}

/****************************** LOV POPUPS *****************************************/

function Query_CourtNameLOVGrid() {};
Query_CourtNameLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedCourt";
Query_CourtNameLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Query_CourtNameLOVGrid.rowXPath = "Court";
Query_CourtNameLOVGrid.keyXPath = "Code";
Query_CourtNameLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

Query_CourtNameLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Query_CourtName_LOVButton"} ],
		keys: [ { key: Key.F6, element: "Query_Court_Code" }, { key: Key.F6, element: "Query_Court_Name" } ]
	}
};

/**
 * @author pz9j2w
 * @return "Query_CourtId"  
 */
Query_CourtNameLOVGrid.nextFocusedAdaptorId = function() {
	return "Query_CourtId";
}

Query_CourtNameLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
Query_CourtNameLOVGrid.destroyOnClose = false;
Query_CourtNameLOVGrid.logicOn = [Query_CourtNameLOVGrid.dataBinding];
Query_CourtNameLOVGrid.logic = function(event)
{	
	if ( event.getXPath().indexOf(Query_CourtNameLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(Query_CourtNameLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(Query_Court_Code.dataBinding, courtCode);
		Services.setValue(Query_CourtNameLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/*********************************************************************************/

function CourtData_GroupingCourtLOVGrid() {};
CourtData_GroupingCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedGroupingCourt";
CourtData_GroupingCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtData_GroupingCourtLOVGrid.rowXPath = "Court[./InService = 'Y']";
CourtData_GroupingCourtLOVGrid.keyXPath = "Code";
CourtData_GroupingCourtLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

CourtData_GroupingCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "CourtData_GroupingCourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "CourtData_GroupingCourtCode" }, { key: Key.F6, element: "CourtData_GroupingCourtName" } ]
	}
};

/**
 * @author pz9j2w
 * @return "CourtData_GroupingCourtCode"  
 */
CourtData_GroupingCourtLOVGrid.nextFocusedAdaptorId = function() {
	return "CourtData_GroupingCourtCode";
}

CourtData_GroupingCourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtData_GroupingCourtLOVGrid.destroyOnClose = false;
CourtData_GroupingCourtLOVGrid.logicOn = [CourtData_GroupingCourtLOVGrid.dataBinding];
CourtData_GroupingCourtLOVGrid.logic = function(event)
{	
	if ( event.getXPath().indexOf(CourtData_GroupingCourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(CourtData_GroupingCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(CourtData_GroupingCourtCode.dataBinding, courtCode);
		Services.setValue(CourtData_GroupingCourtLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/*********************************************************************************/

function CourtData_DMCourtLOVGrid() {};
CourtData_DMCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedDMCourt";
CourtData_DMCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtData_DMCourtLOVGrid.rowXPath = "Court[./InService = 'Y' and ./SUPSCourt = 'Y']";
CourtData_DMCourtLOVGrid.keyXPath = "Code";
CourtData_DMCourtLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

CourtData_DMCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "CourtData_DMCourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "CourtData_DMCourtCode" }, { key: Key.F6, element: "CourtData_DMCourtName" } ]
	}
};

CourtData_DMCourtLOVGrid.nextFocusedAdaptorId = function() {
	return "CourtData_DMCourtCode";
}

CourtData_DMCourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtData_DMCourtLOVGrid.destroyOnClose = false;
CourtData_DMCourtLOVGrid.logicOn = [CourtData_DMCourtLOVGrid.dataBinding];
CourtData_DMCourtLOVGrid.logic = function(event)
{	
	if ( event.getXPath().indexOf(CourtData_DMCourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var courtCode = Services.getValue(CourtData_DMCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(CourtData_DMCourtCode.dataBinding, courtCode);
		Services.setValue(CourtData_DMCourtLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**********************************************************************************/

function CourtData_PrintersLOVGrid() {};
CourtData_PrintersLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedDefaultPrinter";
CourtData_PrintersLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Printers";
CourtData_PrintersLOVGrid.rowXPath = "Printer";
CourtData_PrintersLOVGrid.keyXPath = "PrintShareName";
CourtData_PrintersLOVGrid.columns = [
	{xpath: "PrintShareName", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "PrinterName"}
];

CourtData_PrintersLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "CourtData_DefaultPrinterLOVButton"} ],
		keys: [ { key: Key.F6, element: "CourtData_DefaultPrinter" } ]
	}
};

CourtData_PrintersLOVGrid.nextFocusedAdaptorId = function() {
	return "CourtData_DefaultPrinter";
}

CourtData_PrintersLOVGrid.styleURL = "/css/PrintersLOVGrid.css";
CourtData_PrintersLOVGrid.destroyOnClose = false;
CourtData_PrintersLOVGrid.logicOn = [CourtData_PrintersLOVGrid.dataBinding];
CourtData_PrintersLOVGrid.logic = function(event)
{	
	if ( event.getXPath().indexOf(CourtData_PrintersLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var printer = Services.getValue(CourtData_PrintersLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(printer) )
	{
		// Set the default printer field
		Services.startTransaction();
		Services.setValue(CourtData_DefaultPrinter.dataBinding, printer);
		Services.setValue(CourtData_PrintersLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/********************************* GRIDS *******************************************/

function QueryPopup_CourtResultsGrid() {};
QueryPopup_CourtResultsGrid.dataBinding = XPathConstants.COURT_GRID_XPATH;
QueryPopup_CourtResultsGrid.tabIndex = 80;
QueryPopup_CourtResultsGrid.srcData = XPathConstants.RESULTS_XPATH;
QueryPopup_CourtResultsGrid.rowXPath = "Court";
QueryPopup_CourtResultsGrid.keyXPath = "CourtCode";
QueryPopup_CourtResultsGrid.columns = [
	{xpath: "CourtCode", sort: "numerical"},
	{xpath: "CourtName"},
	{xpath: "ID"},
	{xpath: "DistrictRegistry"}	
];

/*********************************************************************************/

function Master_CourtAddressGrid() {};
Master_CourtAddressGrid.componentName = "Court Addresses Grid";
Master_CourtAddressGrid.dataBinding = XPathConstants.ADDRESS_GRID_XPATH;
Master_CourtAddressGrid.tabIndex = 50;
Master_CourtAddressGrid.srcDataOn = [XPathConstants.SELECTED_ADDRESS_XPATH + "/DateTo"];
Master_CourtAddressGrid.srcData = XPathConstants.DATA_XPATH + "/ContactDetails/Addresses";
Master_CourtAddressGrid.rowXPath = "Address[DateTo = '']";
Master_CourtAddressGrid.keyXPath = "SurrogateId";
Master_CourtAddressGrid.columns = [
	{xpath: "Type", transformToDisplay: transformAddressTypeToDisplay },
	{xpath: "Line[1]"},
	{xpath: "Line[2]"}
];

Master_CourtAddressGrid.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_CourtAddressGrid.isEnabled = isCourtRecordLoaded

/************************** FIELD CONFIGURATIONS ***********************************/

function Query_Court_Code() {};
Query_Court_Code.tabIndex = 1;
Query_Court_Code.maxLength = 3;
Query_Court_Code.helpText = "Unique three digit court location code";
Query_Court_Code.componentName = "Court Code";
Query_Court_Code.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_Court_Code.isReadOnly = isCourtRecordLoaded;

Query_Court_Code.validateOn = [XPathConstants.REF_DATA_XPATH + "/Courts"];
Query_Court_Code.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(Query_Court_Code.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		var courtExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_Court_Code.dataBinding + "]");
		if ( !courtExists )
		{
			// The entered court code does not exist
			ec = ErrorCode.getErrorCode("CaseMan_courtDoesNotExist_Msg");
		}
	}
	return ec;
}

Query_Court_Code.logicOn = [Query_Court_Code.dataBinding];
Query_Court_Code.logic = function(event)
{
	if( event.getXPath() != Query_Court_Code.dataBinding )
	{
		return;
	}

	var courtCode = Services.getValue(Query_Court_Code.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(Query_Court_Name.dataBinding, "");
	}
	
	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_Court_Code.dataBinding + "]") )
	{
		Services.setValue(Query_Court_Name.dataBinding, courtCode);
	}
}

/*********************************************************************************/

function Query_Court_Name() {};
Query_Court_Name.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Query_Court_Name.rowXPath = "Court";
Query_Court_Name.keyXPath = "Code";
Query_Court_Name.displayXPath = "DisplayName";
Query_Court_Name.strictValidation = false;
Query_Court_Name.validateOn = [XPathConstants.FORM_STATE_XPATH];
Query_Court_Name.validate = function()
{
	var ec = null;
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	if ( formState != FormStates.STATE_MODIFY )
	{
		var valueEntered = Services.getValue(Query_Court_Name.dataBinding);
		if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_Court_Name.dataBinding + "]") )
		{
			ec = ErrorCode.getErrorCode("InvalidFieldLength");
			ec.m_message = "Field value not in source data";
		}
	}
	return ec;
}

Query_Court_Name.tabIndex = 2;
Query_Court_Name.helpText = "Name of the court";
Query_Court_Name.componentName = "Court Name";
Query_Court_Name.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_Court_Name.isReadOnly = isCourtRecordLoaded;

Query_Court_Name.logicOn = [Query_Court_Name.dataBinding];
Query_Court_Name.logic = function(event)
{
	if( event.getXPath() != Query_Court_Name.dataBinding )
	{
		return;
	}

	var courtName = Services.getValue(Query_Court_Name.dataBinding);
	if ( CaseManUtils.isBlank(courtName) )
	{
		Services.setValue(Query_Court_Code.dataBinding, "");
	}
	
	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_Court_Name.dataBinding + "]") )
	{
		Services.setValue(Query_Court_Code.dataBinding, courtName);
	}
}

/*********************************************************************************/

function Query_CourtId() {};
Query_CourtId.tabIndex = 4;
Query_CourtId.maxLength = 2;
Query_CourtId.helpText = "The court's alpha identification code";
Query_CourtId.componentName = "Court Id";

Query_CourtId.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_CourtId.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_CourtId.mandatoryOn = [XPathConstants.FORM_STATE_XPATH];
Query_CourtId.isMandatory = isCourtRecordLoaded;
Query_CourtId.logicOn = [Query_CourtId.dataBinding]
Query_CourtId.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != Query_CourtId.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

Query_CourtId.validate = function()
{
	var ec = null;
	var id = Services.getValue(Query_CourtId.dataBinding);
	if ( isCourtRecordLoaded() && !CaseManUtils.isBlank(id) )
	{
		var currentCourtCode = Services.getValue(Query_Court_Code.dataBinding);
		var idExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = '" + id + "' and ./Code != '" + currentCourtCode + "']");
		if ( idExists )
		{
			// The Court Id must be unique
			ec = ErrorCode.getErrorCode("CaseMan_courtIdAlreadyExists_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function Query_DistrictRegistry() {};
Query_DistrictRegistry.tabIndex = 5;
Query_DistrictRegistry.helpText = "Court District Registry";
Query_DistrictRegistry.modelValue = {checked: "Y", unchecked: "N"};
Query_DistrictRegistry.componentName = "District Registry";
Query_DistrictRegistry.logicOn = [Query_DistrictRegistry.dataBinding]
Query_DistrictRegistry.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != Query_DistrictRegistry.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function Query_SUPSCourt() {};
Query_SUPSCourt.tabIndex = 6;
Query_SUPSCourt.helpText = "SUPS court indicator";
Query_SUPSCourt.modelValue = {checked: "Y", unchecked: "N"};
Query_SUPSCourt.componentName = "SUPS Court";
Query_SUPSCourt.logicOn = [Query_SUPSCourt.dataBinding]
Query_SUPSCourt.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != Query_SUPSCourt.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Welsh_HighCourt_Name () {};
CourtData_Welsh_HighCourt_Name.maxLength = 60;
CourtData_Welsh_HighCourt_Name.tabIndex = 10;
CourtData_Welsh_HighCourt_Name.componentName = "Welsh High Court Name";
CourtData_Welsh_HighCourt_Name.helpText = "Welsh High Court Name including description e.g. Cofrestrfa Ddosbarth";
CourtData_Welsh_HighCourt_Name.mandatoryOn = [XPathConstants.DATA_XPATH + "/ContactDetails/Addresses", XPathConstants.SELECTED_ADDRESS_XPATH, CourtData_Welsh_CountyCourt_Name.dataBinding];
CourtData_Welsh_HighCourt_Name.isMandatory = function()
{
	var blnMandatory = false;
	var numberResults = Services.countNodes(XPathConstants.DATA_XPATH + "/ContactDetails/Addresses/Address[DateTo = '' and Type = 'WELSH_OFFICE']");
	if ( numberResults > 0 )
	{
		// Welsh Court Name is mandatory if a Welsh Office address exists
		blnMandatory = true;
	}
	else if ( !CaseManUtils.isBlank( Services.getValue(CourtData_Welsh_CountyCourt_Name.dataBinding) ) )
	{
		// High Court Name is mandatory if County Court name is populated
		blnMandatory = true;
	}
	return blnMandatory;
}

CourtData_Welsh_HighCourt_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtData_Welsh_HighCourt_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtData_Welsh_HighCourt_Name.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Welsh_HighCourt_Name.isEnabled = isCourtRecordLoaded
CourtData_Welsh_HighCourt_Name.logicOn = [CourtData_Welsh_HighCourt_Name.dataBinding]
CourtData_Welsh_HighCourt_Name.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Welsh_HighCourt_Name.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Welsh_CountyCourt_Name () {};
CourtData_Welsh_CountyCourt_Name.maxLength = 60;
CourtData_Welsh_CountyCourt_Name.tabIndex = 11;
CourtData_Welsh_CountyCourt_Name.componentName = "Welsh County Court Name";
CourtData_Welsh_CountyCourt_Name.helpText = "Welsh County Court Name including description e.g. Llys Sirol";
CourtData_Welsh_CountyCourt_Name.mandatoryOn = [XPathConstants.DATA_XPATH + "/ContactDetails/Addresses", XPathConstants.SELECTED_ADDRESS_XPATH, CourtData_Welsh_HighCourt_Name.dataBinding];
CourtData_Welsh_CountyCourt_Name.isMandatory = function()
{
	var blnMandatory = false;
	var numberResults = Services.countNodes(XPathConstants.DATA_XPATH + "/ContactDetails/Addresses/Address[DateTo = '' and Type = 'WELSH_OFFICE']");
	if ( numberResults > 0 )
	{
		// Welsh Court Name is mandatory if a Welsh Office address exists
		blnMandatory = true;
	}
	else if ( !CaseManUtils.isBlank( Services.getValue(CourtData_Welsh_HighCourt_Name.dataBinding) ) )
	{
		// County Court Name is mandatory if High Court name is populated
		blnMandatory = true;
	}
	return blnMandatory;
}

CourtData_Welsh_CountyCourt_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtData_Welsh_CountyCourt_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtData_Welsh_CountyCourt_Name.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Welsh_CountyCourt_Name.isEnabled = isCourtRecordLoaded
CourtData_Welsh_CountyCourt_Name.logicOn = [CourtData_Welsh_CountyCourt_Name.dataBinding]
CourtData_Welsh_CountyCourt_Name.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Welsh_CountyCourt_Name.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_InService () {};
CourtData_InService.tabIndex = 12;
CourtData_InService.modelValue = {checked: "Y", unchecked: "N"};
CourtData_InService.componentName = "In Service";
CourtData_InService.helpText = "Court In Service";
CourtData_InService.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_InService.isEnabled = isCourtRecordLoaded
CourtData_InService.logicOn = [CourtData_InService.dataBinding]
CourtData_InService.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_InService.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_DXNumber() {};
CourtData_DXNumber.tabIndex = 19;
CourtData_DXNumber.helpText = "Court DX number";
CourtData_DXNumber.maxLength = 35;
CourtData_DXNumber.componentName = "DX Number";
CourtData_DXNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_DXNumber.isEnabled = isCourtRecordLoaded
CourtData_DXNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtData_DXNumber.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtData_DXNumber.logicOn = [CourtData_DXNumber.dataBinding]
CourtData_DXNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_DXNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_TelephoneNumber() {};
CourtData_TelephoneNumber.tabIndex = 20;
CourtData_TelephoneNumber.maxLength = 24;
CourtData_TelephoneNumber.componentName = "Telephone Number";
CourtData_TelephoneNumber.helpText = "Court telephone number";
CourtData_TelephoneNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_TelephoneNumber.isEnabled = isCourtRecordLoaded
CourtData_TelephoneNumber.logicOn = [CourtData_TelephoneNumber.dataBinding]
CourtData_TelephoneNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_TelephoneNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_FaxNumber() {};
CourtData_FaxNumber.tabIndex = 21;
CourtData_FaxNumber.helpText = "Court fax number";
CourtData_FaxNumber.componentName = "Fax Number";
CourtData_FaxNumber.maxLength = 24;
CourtData_FaxNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_FaxNumber.isEnabled = isCourtRecordLoaded
CourtData_FaxNumber.logicOn = [CourtData_FaxNumber.dataBinding]
CourtData_FaxNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_FaxNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_DR_TelephoneNumber() {};
CourtData_DR_TelephoneNumber.tabIndex = 22;
CourtData_DR_TelephoneNumber.maxLength = 24;
CourtData_DR_TelephoneNumber.componentName = "DR Telephone Number";
CourtData_DR_TelephoneNumber.helpText = "Court District Registry telephone number";
CourtData_DR_TelephoneNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_DR_TelephoneNumber.isEnabled = isCourtRecordLoaded
CourtData_DR_TelephoneNumber.logicOn = [CourtData_DR_TelephoneNumber.dataBinding]
CourtData_DR_TelephoneNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_DR_TelephoneNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_DefaultPrinter() {}
CourtData_DefaultPrinter.srcData = XPathConstants.REF_DATA_XPATH + "/Printers";
CourtData_DefaultPrinter.rowXPath = "Printer";
CourtData_DefaultPrinter.keyXPath = "PrintShareName";
CourtData_DefaultPrinter.displayXPath = "PrintShareName";
CourtData_DefaultPrinter.tabIndex = 23;
CourtData_DefaultPrinter.helpText = "The court's default printer";
CourtData_DefaultPrinter.strictValidation = true;
CourtData_DefaultPrinter.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.DATA_XPATH + "/FAPId"];
CourtData_DefaultPrinter.isEnabled = function()
{
	var blnEnabled = false;
	if ( isCourtRecordLoaded() )
	{
		// Court loaded, test if FAP Id on Court is set
		var courtFap = Services.getValue(XPathConstants.DATA_XPATH + "/FAPId");
		if ( !CaseManUtils.isBlank(courtFap) )
		{
			blnEnabled = true;
		}
	}
	return blnEnabled;
}

CourtData_DefaultPrinter.onSuccess = function(dom)
{
	// Place the printers on the FAP in the DOM
	Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Printers", dom);
}

CourtData_DefaultPrinter.logicOn = [CourtData_DefaultPrinter.dataBinding]
CourtData_DefaultPrinter.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_DefaultPrinter.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_GroupingCourtCode() {};
CourtData_GroupingCourtCode.tabIndex = 13;
CourtData_GroupingCourtCode.maxLength = 3;
CourtData_GroupingCourtCode.componentName = "Grouping Court Code";
CourtData_GroupingCourtCode.helpText = "Grouping court code";
CourtData_GroupingCourtCode.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_GroupingCourtCode.isEnabled = isCourtRecordLoaded

CourtData_GroupingCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_GroupingCourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

CourtData_GroupingCourtCode.logicOn = [CourtData_GroupingCourtCode.dataBinding]
CourtData_GroupingCourtCode.logic = function(event)
{
	var groupingCourt = Services.getValue(CourtData_GroupingCourtCode.dataBinding);
	var courtCode = Services.getValue(Query_Court_Code.dataBinding);
	if ( CaseManUtils.isBlank(groupingCourt) )
	{
		Services.setValue(CourtData_GroupingCourtName.dataBinding, "");
		
		// Call service to determine if the court is still a grouping court for someone else
		isGroupingCourt();
	}
	
	if ( !CaseManUtils.isBlank(groupingCourt) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_GroupingCourtCode.dataBinding + "]") )
	{
		Services.setValue(CourtData_GroupingCourtName.dataBinding, groupingCourt);
		if ( groupingCourt == courtCode )
		{
			// Court is definately a grouping court so enable the DM Court fields
			Services.setValue(XPathConstants.DM_CRT_ENABLED_XPATH, "Y");
		}
		else
		{
			// Call service to determine if the court is still a grouping court for someone else
			isGroupingCourt();
		}
	}
	
	if ( isCourtRecordLoaded() && event.getXPath() == CourtData_GroupingCourtCode.dataBinding )
	{
		setDirtyFlag();
	}
}

CourtData_GroupingCourtCode.onSuccess = function(dom)
{
	if ( dom != null )
	{
		var isGroupingCourt = XML.getPathTextContent(dom, "/ds/Court/IsGroupingCourt");
		if ( isGroupingCourt == "Y" )
		{
			// Court is still a grouping court, enable the DM Court fields
			Services.setValue(XPathConstants.DM_CRT_ENABLED_XPATH, "Y");
		}
		else
		{
			// Court is NOT a grouping court, disable the DM Court fields and blank out value
			Services.setValue(XPathConstants.DM_CRT_ENABLED_XPATH, "N");
			Services.setValue(CourtData_DMCourtCode.dataBinding, "");
		}
	}
}

/*********************************************************************************/

function CourtData_GroupingCourtName() {};
CourtData_GroupingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtData_GroupingCourtName.rowXPath = "Court";
CourtData_GroupingCourtName.keyXPath = "Code";
CourtData_GroupingCourtName.displayXPath = "DisplayName";
CourtData_GroupingCourtName.strictValidation = true;
CourtData_GroupingCourtName.tabIndex = 14;
CourtData_GroupingCourtName.componentName = "Grouping Court Name";
CourtData_GroupingCourtName.helpText = "Grouping court name";
CourtData_GroupingCourtName.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_GroupingCourtName.isEnabled = isCourtRecordLoaded

CourtData_GroupingCourtName.logicOn = [CourtData_GroupingCourtName.dataBinding];
CourtData_GroupingCourtName.logic = function(event)
{
	if( event.getXPath() != CourtData_GroupingCourtName.dataBinding )
	{
		return;
	}

	var courtName = Services.getValue(CourtData_GroupingCourtName.dataBinding);
	if ( CaseManUtils.isBlank(courtName) )
	{
		Services.setValue(CourtData_GroupingCourtCode.dataBinding, "");
	}
	
	if ( !CaseManUtils.isBlank(courtName) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_GroupingCourtName.dataBinding + "]") )
	{
		Services.setValue(CourtData_GroupingCourtCode.dataBinding, courtName);
	}
}

/*********************************************************************************/

function CourtData_DMCourtCode() {};
CourtData_DMCourtCode.tabIndex = 16;
CourtData_DMCourtCode.maxLength = 3;
CourtData_DMCourtCode.componentName = "Diary Manager Court Code";
CourtData_DMCourtCode.helpText = "Diary Manager court code";
CourtData_DMCourtCode.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.DM_CRT_ENABLED_XPATH];
CourtData_DMCourtCode.isEnabled = function()
{
	var blnEnabled = false;
	var isDMFieldEnabled = Services.getValue(XPathConstants.DM_CRT_ENABLED_XPATH);
	if ( isCourtRecordLoaded() && isDMFieldEnabled == 'Y' )
	{
		blnEnabled = true;
	}
	return blnEnabled;
}

CourtData_DMCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_DMCourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

CourtData_DMCourtCode.logicOn = [CourtData_DMCourtCode.dataBinding]
CourtData_DMCourtCode.logic = function(event)
{
	var courtCode = Services.getValue(CourtData_DMCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(CourtData_DMCourtName.dataBinding, "");
	}
	
	if ( !CaseManUtils.isBlank(courtCode) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_DMCourtCode.dataBinding + "]") )
	{
		Services.setValue(CourtData_DMCourtName.dataBinding, courtCode);
	}
	
	if ( isCourtRecordLoaded() && event.getXPath() == CourtData_DMCourtCode.dataBinding )
	{
		setDirtyFlag();
	}
}

/*********************************************************************************/

function CourtData_DMCourtName() {};
CourtData_DMCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtData_DMCourtName.rowXPath = "Court[./InService = 'Y' and ./SUPSCourt = 'Y']";
CourtData_DMCourtName.keyXPath = "Code";
CourtData_DMCourtName.displayXPath = "DisplayName";
CourtData_DMCourtName.strictValidation = true;
CourtData_DMCourtName.tabIndex = 17;
CourtData_DMCourtName.componentName = "Diary Manager Court Name";
CourtData_DMCourtName.helpText = "Diary Manager court name";
CourtData_DMCourtName.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.DM_CRT_ENABLED_XPATH];
CourtData_DMCourtName.isEnabled = function()
{
	var blnEnabled = false;
	var isDMFieldEnabled = Services.getValue(XPathConstants.DM_CRT_ENABLED_XPATH);
	if ( isCourtRecordLoaded() && isDMFieldEnabled == 'Y' )
	{
		blnEnabled = true;
	}
	return blnEnabled;
}

CourtData_DMCourtName.logicOn = [CourtData_DMCourtName.dataBinding];
CourtData_DMCourtName.logic = function(event)
{
	if( event.getXPath() != CourtData_DMCourtName.dataBinding )
	{
		return;
	}

	var courtName = Services.getValue(CourtData_DMCourtName.dataBinding);
	if ( CaseManUtils.isBlank(courtName) )
	{
		Services.setValue(CourtData_DMCourtCode.dataBinding, "");
	}
	
	if ( !CaseManUtils.isBlank(courtName) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + CourtData_DMCourtName.dataBinding + "]") )
	{
		Services.setValue(CourtData_DMCourtCode.dataBinding, courtName);
	}
}

/*********************************************************************************/

function CourtData_OpenFrom() {};
CourtData_OpenFrom.tabIndex = 30;
CourtData_OpenFrom.maxLength = 5;
CourtData_OpenFrom.componentName = "Open From";
CourtData_OpenFrom.helpText = "Opening time of the court";
CourtData_OpenFrom.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_OpenFrom.isEnabled = isCourtRecordLoaded

CourtData_OpenFrom.validate = function()
{
	var time = Services.getValue(CourtData_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.COURT_OPENTIMEVALID_XPATH, time);
}

CourtData_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

CourtData_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

CourtData_OpenFrom.logicOn = [CourtData_OpenFrom.dataBinding]
CourtData_OpenFrom.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_OpenFrom.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_OpenTo() {};
CourtData_OpenTo.tabIndex = 31;
CourtData_OpenTo.maxLength = 5;
CourtData_OpenTo.componentName = "Open To";
CourtData_OpenTo.helpText = "Closing time of the court";
CourtData_OpenTo.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_OpenTo.isEnabled = isCourtRecordLoaded

CourtData_OpenTo.validate = function()
{
	var time = Services.getValue(CourtData_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.COURT_CLOSETIMEVALID_XPATH, time);
}

CourtData_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

CourtData_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

CourtData_OpenTo.logicOn = [CourtData_OpenTo.dataBinding]
CourtData_OpenTo.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_OpenTo.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_AccountType() {};
CourtData_AccountType.srcData = XPathConstants.REF_DATA_XPATH + "/AccountTypes";
CourtData_AccountType.rowXPath = "AccountType";
CourtData_AccountType.keyXPath = "Value";
CourtData_AccountType.displayXPath = "Value";
CourtData_AccountType.tabIndex = 32;
CourtData_AccountType.maxLength = 10;
CourtData_AccountType.componentName = "Account Type";
CourtData_AccountType.helpText = "Court account type";
CourtData_AccountType.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_AccountType.isEnabled = isCourtRecordLoaded;
CourtData_AccountType.isMandatory = function() { return true; }
CourtData_AccountType.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtData_AccountType.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtData_AccountType.logicOn = [CourtData_AccountType.dataBinding]
CourtData_AccountType.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_AccountType.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_AccountingCode() {};
CourtData_AccountingCode.tabIndex = 33;
CourtData_AccountingCode.maxLength = 5;
CourtData_AccountingCode.componentName = "Accounting Code";
CourtData_AccountingCode.helpText = "Court accounting code";
CourtData_AccountingCode.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_AccountingCode.isEnabled = isCourtRecordLoaded;
CourtData_AccountingCode.isMandatory = function() { return true; }
CourtData_AccountingCode.validate = function()
{
	var accountingCode = Services.getValue(CourtData_AccountingCode.dataBinding);
	if ( !CaseManValidationHelper.validateNumber(accountingCode) )
	{
		return ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
	}
	return null;
}

CourtData_AccountingCode.logicOn = [CourtData_AccountingCode.dataBinding]
CourtData_AccountingCode.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_AccountingCode.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Bailiff_OpenFrom() {};
CourtData_Bailiff_OpenFrom.tabIndex = 34;
CourtData_Bailiff_OpenFrom.maxLength = 5;
CourtData_Bailiff_OpenFrom.componentName = "Bailiff Open From";
CourtData_Bailiff_OpenFrom.helpText = "Opening time for the bailiff";
CourtData_Bailiff_OpenFrom.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Bailiff_OpenFrom.isEnabled = isCourtRecordLoaded

CourtData_Bailiff_OpenFrom.validate = function()
{
	var time = Services.getValue(CourtData_Bailiff_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, time);
}

CourtData_Bailiff_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, value);
}

CourtData_Bailiff_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, value);
}

CourtData_Bailiff_OpenFrom.logicOn = [CourtData_Bailiff_OpenFrom.dataBinding]
CourtData_Bailiff_OpenFrom.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Bailiff_OpenFrom.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Bailiff_OpenTo() {};
CourtData_Bailiff_OpenTo.tabIndex = 35;
CourtData_Bailiff_OpenTo.maxLength = 5;
CourtData_Bailiff_OpenTo.componentName = "Bailiff Open To";
CourtData_Bailiff_OpenTo.helpText = "Closing time for the bailiff";
CourtData_Bailiff_OpenTo.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Bailiff_OpenTo.isEnabled = isCourtRecordLoaded

CourtData_Bailiff_OpenTo.validate = function()
{
	var time = Services.getValue(CourtData_Bailiff_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, time);
}

CourtData_Bailiff_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, value);
}

CourtData_Bailiff_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, value);
}

CourtData_Bailiff_OpenTo.logicOn = [CourtData_Bailiff_OpenTo.dataBinding]
CourtData_Bailiff_OpenTo.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Bailiff_OpenTo.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Bailiff_TelephoneNumber() {};
CourtData_Bailiff_TelephoneNumber.tabIndex = 36;
CourtData_Bailiff_TelephoneNumber.maxLength = 12;
CourtData_Bailiff_TelephoneNumber.componentName = "Bailiff Telephone Number";
CourtData_Bailiff_TelephoneNumber.helpText = "Bailiff telephone number";
CourtData_Bailiff_TelephoneNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Bailiff_TelephoneNumber.isEnabled = isCourtRecordLoaded
CourtData_Bailiff_TelephoneNumber.logicOn = [CourtData_Bailiff_TelephoneNumber.dataBinding]
CourtData_Bailiff_TelephoneNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Bailiff_TelephoneNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_Bailiff_FaxNumber() {};
CourtData_Bailiff_FaxNumber.tabIndex = 37;
CourtData_Bailiff_FaxNumber.maxLength = 12;
CourtData_Bailiff_FaxNumber.componentName = "Bailiff Fax Number";
CourtData_Bailiff_FaxNumber.helpText = "Bailiff fax number";
CourtData_Bailiff_FaxNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_Bailiff_FaxNumber.isEnabled = isCourtRecordLoaded
CourtData_Bailiff_FaxNumber.logicOn = [CourtData_Bailiff_FaxNumber.dataBinding]
CourtData_Bailiff_FaxNumber.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_Bailiff_FaxNumber.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_DR_OpenFrom() {};
CourtData_DR_OpenFrom.tabIndex = 38;
CourtData_DR_OpenFrom.maxLength = 5;
CourtData_DR_OpenFrom.componentName = "DR Open From";
CourtData_DR_OpenFrom.helpText = "District Registry opening time of the court";
CourtData_DR_OpenFrom.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_DR_OpenFrom.isEnabled = isCourtRecordLoaded

CourtData_DR_OpenFrom.validate = function()
{
	var time = Services.getValue(CourtData_DR_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.COURT_OPENTIMEVALID_XPATH, time);
}

CourtData_DR_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

CourtData_DR_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

CourtData_DR_OpenFrom.logicOn = [CourtData_DR_OpenFrom.dataBinding]
CourtData_DR_OpenFrom.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_DR_OpenFrom.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_DR_OpenTo() {};
CourtData_DR_OpenTo.tabIndex = 39;
CourtData_DR_OpenTo.maxLength = 5;
CourtData_DR_OpenTo.componentName = "DR Open To";
CourtData_DR_OpenTo.helpText = "District Registry closing time of the court";
CourtData_DR_OpenTo.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_DR_OpenTo.isEnabled = isCourtRecordLoaded

CourtData_DR_OpenTo.validate = function()
{
	var time = Services.getValue(CourtData_DR_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.COURT_CLOSETIMEVALID_XPATH, time);
}

CourtData_DR_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

CourtData_DR_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

CourtData_DR_OpenTo.logicOn = [CourtData_DR_OpenTo.dataBinding]
CourtData_DR_OpenTo.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_DR_OpenTo.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtData_ByAppointment () {};
CourtData_ByAppointment.tabIndex = 40;
CourtData_ByAppointment.modelValue = {checked: "Y", unchecked: "N"};
CourtData_ByAppointment.componentName = "Open By Appointment";
CourtData_ByAppointment.helpText = "Indicator that court is open by appointment only";
CourtData_ByAppointment.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_ByAppointment.isEnabled = isCourtRecordLoaded
CourtData_ByAppointment.logicOn = [CourtData_ByAppointment.dataBinding]
CourtData_ByAppointment.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtData_ByAppointment.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function Master_CourtAddressType() {};
Master_CourtAddressType.srcData = XPathConstants.REF_DATA_XPATH + "/AddressTypes";
Master_CourtAddressType.rowXPath = "AddressType";
Master_CourtAddressType.keyXPath = "Value";
Master_CourtAddressType.displayXPath = "Description";
Master_CourtAddressType.tabIndex = 51;
Master_CourtAddressType.maxLength = 15;
Master_CourtAddressType.componentName = "Select Address Type";
Master_CourtAddressType.helpText = "Type of Address";
Master_CourtAddressType.isTemporary = function(){ return true; }
Master_CourtAddressType.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_CourtAddressType.isEnabled = isCourtRecordLoaded

/*********************************************************************************/

function CourtAddress_AddressType() {};
CourtAddress_AddressType.tabIndex = -1;
CourtAddress_AddressType.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_AddressType.maxLength = 15;
CourtAddress_AddressType.componentName = "Address Type";
CourtAddress_AddressType.helpText = "The type of address";
CourtAddress_AddressType.isReadOnly = function() { return true; }
CourtAddress_AddressType.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_AddressType.isEnabled = function()
{
	return !isAddressGridEmpty();
}
CourtAddress_AddressType.transformToDisplay = transformAddressTypeToDisplay;

/*********************************************************************************/

function CourtAddress_Line1() {};
CourtAddress_Line1.tabIndex = 60;
CourtAddress_Line1.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line1.maxLength = 35;
CourtAddress_Line1.componentName = "Address Line 1";
CourtAddress_Line1.helpText = "First line of court address";
CourtAddress_Line1.isMandatory = function() { return true; }
CourtAddress_Line1.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line1.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtAddress_Line1.logicOn = [CourtAddress_Line1.dataBinding]
CourtAddress_Line1.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Line1.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtAddress_Line2() {};
CourtAddress_Line2.tabIndex = 61;
CourtAddress_Line2.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line2.maxLength = 35;
CourtAddress_Line2.componentName = "Address Line 2";
CourtAddress_Line2.helpText = "Second line of court address";
CourtAddress_Line2.isMandatory = function() { return true; }
CourtAddress_Line2.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line2.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtAddress_Line2.logicOn = [CourtAddress_Line2.dataBinding]
CourtAddress_Line2.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Line2.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtAddress_Line3() {};
CourtAddress_Line3.tabIndex = 62;
CourtAddress_Line3.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line3.maxLength = 35;
CourtAddress_Line3.componentName = "Address Line 3";
CourtAddress_Line3.helpText = "Third line of court address";

CourtAddress_Line3.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line3.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
CourtAddress_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtAddress_Line3.logicOn = [CourtAddress_Line3.dataBinding]
CourtAddress_Line3.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Line3.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtAddress_Line4() {};
CourtAddress_Line4.tabIndex = 63;
CourtAddress_Line4.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line4.maxLength = 35;
CourtAddress_Line4.componentName = "Address Line 4";
CourtAddress_Line4.helpText = "Fourth line of court address";

CourtAddress_Line4.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line4.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtAddress_Line4.logicOn = [CourtAddress_Line4.dataBinding]
CourtAddress_Line4.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Line4.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtAddress_Line5() {};
CourtAddress_Line5.tabIndex = 64;
CourtAddress_Line5.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line5.maxLength = 35;
CourtAddress_Line5.componentName = "Address Line 5";
CourtAddress_Line5.helpText = "Fifth line of court address";

CourtAddress_Line5.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Line5.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

CourtAddress_Line5.logicOn = [CourtAddress_Line5.dataBinding]
CourtAddress_Line5.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Line5.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/*********************************************************************************/

function CourtAddress_Postcode() {};
CourtAddress_Postcode.tabIndex = 65;
CourtAddress_Postcode.retrieveOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Postcode.maxLength = 8;
CourtAddress_Postcode.componentName = "Postcode";
CourtAddress_Postcode.helpText = "Postcode of court address";

CourtAddress_Postcode.enableOn = [Master_CourtAddressGrid.dataBinding];
CourtAddress_Postcode.isEnabled = function()
{
	return !isAddressGridEmpty();
}

CourtAddress_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

CourtAddress_Postcode.validate = function() 
{
	var postCode = Services.getValue(CourtAddress_Postcode.dataBinding);
	if( !CaseManValidationHelper.validatePostCode(postCode) )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
	}
	return null;
}

CourtAddress_Postcode.logicOn = [CourtAddress_Postcode.dataBinding]
CourtAddress_Postcode.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != CourtAddress_Postcode.dataBinding || !isCourtRecordLoaded() )
	{
		return;
	}
	
	setDirtyFlag();
}

/******************************** BUTTONS ******************************************/

function Query_CourtName_LOVButton() {};
Query_CourtName_LOVButton.tabIndex = 3;
Query_CourtName_LOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Query_CourtName_LOVButton.isEnabled = function()
{
	return !isCourtRecordLoaded();
}

/*********************************************************************************/

function Query_SearchButton() {};
Query_SearchButton.tabIndex = 6;

Query_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "MaintainCourtData" } ]
	}
};

Query_SearchButton.enableOn = [Query_Court_Code.dataBinding, Query_Court_Name.dataBinding, Query_CourtId.dataBinding, Query_DistrictRegistry.dataBinding, Query_SUPSCourt.dataBinding, XPathConstants.FORM_STATE_XPATH]
Query_SearchButton.isEnabled = function(event)
{
	var courtCodeValue = Services.getValue(Query_Court_Code.dataBinding);
	var courtNameValue = Services.getValue(Query_Court_Name.dataBinding);
	var courtIdValue = Services.getValue(Query_CourtId.dataBinding);
	var courtDRValue = Services.getValue(Query_DistrictRegistry.dataBinding);
	var supsCourtValue = Services.getValue(Query_SUPSCourt.dataBinding);
	
	if ( CaseManUtils.isBlank(courtCodeValue) && CaseManUtils.isBlank(courtNameValue) &&
		 CaseManUtils.isBlank(courtIdValue) && CaseManUtils.isBlank(courtDRValue) && 
		 CaseManUtils.isBlank(supsCourtValue) )
	{
		// No search criteria entered, disable button
		return false;
	}
	else if ( null != Query_Court_Code.validate() || null != Query_CourtId.validate() || 
			  !Services.getAdaptorById("Query_Court_Name").getValid() )
	{
		// The input is invalid, disable button
		return false;
	}

	if ( isCourtRecordLoaded() && Services.countNodes(XPathConstants.RESULTS_XPATH + "/Court") <= 1 )
	{
		// Record is loaded, but only 1 record returned in search, disable button
		return false;
	}

	return true;
}

/**
 * @author pz9j2w
 * @return null 
 */
Query_SearchButton.actionBinding = function()
{
	// Extra safety net
	if ( !Query_SearchButton.isEnabled() )
	{
		return;
	}

	if ( isCourtRecordLoaded() )
	{
		Services.dispatchEvent("QueryCourt_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		// Retrieve values from the DOM
		var owningCourtCode = Services.getValue(Query_Court_Code.dataBinding);
		var owningCourtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_Court_Name.dataBinding + "]/Name");
		var owningCourtId = Services.getValue(Query_CourtId.dataBinding);
		var owningCourtDistrictRegistry = Services.getValue(Query_DistrictRegistry.dataBinding);
		var supsCourtValue = Services.getValue(Query_SUPSCourt.dataBinding);
		var tempValue = "";
	
		// Build and submit search query to service	
		var params = new ServiceParams();
		
		tempValue = ( CaseManUtils.isBlank(owningCourtCode) ) ? "" : owningCourtCode;
		params.addSimpleParameter("code", tempValue);
		
		tempValue = ( CaseManUtils.isBlank(owningCourtName) ) ? "" : owningCourtName;
		params.addSimpleParameter("courtName", tempValue);
		
		tempValue = ( CaseManUtils.isBlank(owningCourtId) ) ? "" : "%" + owningCourtId + "%";
		params.addSimpleParameter("id", tempValue);
		
		tempValue = ( CaseManUtils.isBlank(owningCourtDistrictRegistry) ) ? "" : owningCourtDistrictRegistry;
		params.addSimpleParameter("districtregistry", tempValue);
		
		tempValue = ( CaseManUtils.isBlank(supsCourtValue) ) ? "" : supsCourtValue;
		params.addSimpleParameter("supsCourtInd", tempValue);
	
		Services.callService("getCourtsQueryMaintain", params, Query_SearchButton, true);
	}
};

/**
 * @param dom
 * @author pz9j2w
 * 
 */
Query_SearchButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.RESULTS_XPATH, dom);
	var numberResults = Services.countNodes(XPathConstants.RESULTS_XPATH + "/Court");
	if ( numberResults > 1 )
	{
		// Multiple records returned from query, launch popup
		Services.dispatchEvent("QueryCourt_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if ( numberResults == 1 )
	{
		var courtCode = Services.getValue(XPathConstants.RESULTS_XPATH + "/Court/CourtCode");
		loadCourtDetails(courtCode);
	}
	else
	{
		// No results returned
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setFocus("Query_Court_Code");
	}
}

/*********************************************************************************/

function Header_AddCourtButton() {};
Header_AddCourtButton.tabIndex = 7;
Header_AddCourtButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_AddCourtButton.isEnabled = function()
{
	if ( !isCourtRecordLoaded() && Services.hasAccessToForm(addNewCourt_subform.subformName) )
	{
		// Add button enabled if no court details are loaded and the user has access
		return true;
	}
	return false;
}

/*********************************************************************************/

function CourtData_GroupingCourtLOVButton() {};
CourtData_GroupingCourtLOVButton.tabIndex = 15;
CourtData_GroupingCourtLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
CourtData_GroupingCourtLOVButton.isEnabled = isCourtRecordLoaded;

/*********************************************************************************/

function CourtData_DMCourtLOVButton() {};
CourtData_DMCourtLOVButton.tabIndex = 18;
CourtData_DMCourtLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.DM_CRT_ENABLED_XPATH];
CourtData_DMCourtLOVButton.isEnabled = function()
{
	var blnEnabled = false;
	var isDMFieldEnabled = Services.getValue(XPathConstants.DM_CRT_ENABLED_XPATH);
	if ( isCourtRecordLoaded() && isDMFieldEnabled == 'Y' )
	{
		blnEnabled = true;
	}
	return blnEnabled;
}

/*********************************************************************************/

function CourtData_DefaultPrinterLOVButton() {}
CourtData_DefaultPrinterLOVButton.tabIndex = 24;
CourtData_DefaultPrinterLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.DATA_XPATH + "/FAPId"];
CourtData_DefaultPrinterLOVButton.isEnabled = function()
{
	var blnEnabled = false;
	if ( isCourtRecordLoaded() )
	{
		// Court loaded, test if FAP Id on Court is set
		var courtFap = Services.getValue(XPathConstants.DATA_XPATH + "/FAPId");
		if ( !CaseManUtils.isBlank(courtFap) )
		{
			blnEnabled = true;
		}
	}
	return blnEnabled;
}

/*********************************************************************************/

function Status_SaveButton() {};
Status_SaveButton.tabIndex = 70;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainCourtData" } ]
	}
};

/**
 * @author pz9j2w
 * 
 */
Status_SaveButton.actionBinding = function()
{
	if ( isCourtRecordLoaded() && isDataDirty() )
	{
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if ( 0 == invalidFields.length )
		{
			// Call the add new court service
			var dataNode = XML.createDOM(null, null, null);
			var courtNode = Services.getNode(XPathConstants.DATA_XPATH);
			dataNode.appendChild(courtNode);
			
			var params = new ServiceParams();
			params.addDOMParameter("courtDetails", dataNode);
			Services.callService("updateCourt", params, Status_SaveButton, true);
		}
	}
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	// Determine if the reference data needs to be refreshed, i.e. in the event of a court name change
	if ( Services.getValue(XPathConstants.RELOADREFDATA_XPATH) == "Y" )
	{
		Services.setValue(XPathConstants.RELOADREFDATA_XPATH, "");
		
		var params = new ServiceParams();
		Services.callService("getAllCourtsShort", params, MaintainCourtData, true);	
	}
	
	postSaveHandler();
}

/**
 * @param exception
 * @author pz9j2w
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	postSaveHandler();
}

/*********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 71;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "MaintainCourtData", alt: true } ]
	}
};

/**
 * @author pz9j2w
 * 
 */
Status_ClearButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// Data is dirty and user wishes to save before clearing the form
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CLEARFORM);
		Status_SaveButton.actionBinding();
	}
	else
	{
		clearFormData();
	}
}

/*********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 72;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainCourtData" } ]
	}
};

/**
 * @author pz9j2w
 * 
 */
Status_CloseButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// Data is dirty and user wishes to save before exiting the screen
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
};

/*********************************************************************************/

function Master_AddAddressButton() {};
Master_AddAddressButton.tabIndex = 52;
Master_AddAddressButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "Master_CourtAddressGrid" } ]
	}
};

Master_AddAddressButton.enableOn = [Master_CourtAddressType.dataBinding, XPathConstants.FORM_STATE_XPATH];
Master_AddAddressButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(addNewCourt_subform.subformName) )
	{
		// Disabled if user does not have update access to the screen (can tell from add court subform)
		return false;
	}

	// Disabled if the address type is blank or invalid
	var type = Services.getValue(Master_CourtAddressType.dataBinding);
	if ( CaseManUtils.isBlank(type) )
	{
		return false;
	}
	
	// Disabled if the courts grid is empty
	return isCourtRecordLoaded() ? true : false;
}

/**
 * @author pz9j2w
 * 
 */
Master_AddAddressButton.actionBinding = function()
{
	var ec = null;
	var xp = XPathConstants.DATA_XPATH + "/ContactDetails/Addresses/Address[./DateTo = '' and ./Type = '";
	var type = Services.getValue(Master_CourtAddressType.dataBinding);
	switch (type)
	{
		case "OFFICE":
		
			// Check if already have an office address
			if ( Services.countNodes(xp + type + "']") > 0 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_maximumCourtOfficeAddressExceded_Msg");
			}
			break;
			
		case "WELSH_OFFICE":
		
			// Check if already have a welsh office address
			if ( Services.countNodes(xp + type + "']") > 0 )
			{
				ec = ErrorCode.getErrorCode("CaseMan_maximumCourtWelshAddressExceded_Msg");
			}
	}

	if ( null == ec )
	{
		// Address Type is valid, open the popup
		Services.dispatchEvent("addNewAddress_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		// Display error message instead of opening the popup
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
}

/*********************************************************************************/

function Master_RemoveAddressButton() {};
Master_RemoveAddressButton.tabIndex = 53;
Master_RemoveAddressButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "Master_CourtAddressGrid", alt: true } ]
	}
};

Master_RemoveAddressButton.enableOn = [Master_CourtAddressGrid.dataBinding];
Master_RemoveAddressButton.isEnabled = function()
{
	return !isAddressGridEmpty();
}

/**
 * @author pz9j2w
 * 
 */
Master_RemoveAddressButton.actionBinding = function()
{
	if( confirm(Messages.CONFIRM_DELETE_COURT_ADDRESS) )
	{
		var addressId = Services.getValue(XPathConstants.SELECTED_ADDRESS_XPATH + "/AddressId");
		if ( CaseManUtils.isBlank(addressId) )
		{
			// New Address (not yet saved), remove from DOM
			Services.removeNode(XPathConstants.SELECTED_ADDRESS_XPATH);
		}
		else
		{
			// Set Address' Date To to today's date
			var systemDate = Services.getValue(XPathConstants.REF_DATA_XPATH + "/SystemDate");
			Services.setValue(XPathConstants.SELECTED_ADDRESS_XPATH + "/DateTo", systemDate);
		}
		
		// Set the dirty flag if user wishes to remove the address
		setDirtyFlag();
	}
}

/*********************************************************************************/

function QueryPopup_OkButton() {};
QueryPopup_OkButton.tabIndex = 81;
QueryPopup_OkButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "QueryPopup_CourtResultsGrid"} ]
	}
};

/**
 * @author pz9j2w
 * 
 */
QueryPopup_OkButton.actionBinding = function()
{
	var courtCode = Services.getValue(QueryPopup_CourtResultsGrid.dataBinding);
	Services.dispatchEvent("QueryCourt_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	
	if ( isCourtRecordLoaded() )
	{
		// Court has already been loaded
		var currentCourtCode = Services.getValue(Query_Court_Code.dataBinding);
		if ( currentCourtCode != courtCode )
		{
			// New record selected
			if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
			{
				// Data is dirty and user wishes to save before loading a new court
				Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_LOADNEWCOURT);
				Status_SaveButton.actionBinding();
			}
			else
			{
				loadCourtDetails(courtCode);
			}
		}
	}
	else
	{
		loadCourtDetails(courtCode);
	}
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
QueryPopup_OkButton.onSuccess = function(dom)
{
	var dataNode = dom.selectSingleNode(XPathConstants.DATA_XPATH);
	if ( null != dataNode )
	{
		Services.replaceNode(XPathConstants.DATA_XPATH, dataNode);
		
		// Set the court name autocomplete databinding to the actual name which cannot be altered 
		var courtName = Services.getValue(XPathConstants.DATA_XPATH + "/Name");
		Services.setValue(Query_Court_Name.dataBinding, courtName);
		Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_MODIFY);
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "false");
		
		var courtFap = Services.getValue(XPathConstants.DATA_XPATH + "/FAPId");
		if ( !CaseManUtils.isBlank(courtFap) )
		{
			// Retrieve the list of printers available to the court from the FAP (Providing FAP has been set
			var courtCode = Services.getValue(Query_Court_Code.dataBinding);
			var params = new ServiceParams();
			params.addSimpleParameter("courtId", courtCode);
			Services.callService("getPrintersList", params, CourtData_DefaultPrinter, true);		
		}
		
		var isGroupingCourt = Services.getValue(XPathConstants.DATA_XPATH + "/GroupingCourtStatus/IsGroupingCourt");
		if ( isGroupingCourt == "Y")
		{
			Services.setValue(XPathConstants.DM_CRT_ENABLED_XPATH, "Y");
		}
	}
}

/*********************************************************************************/

function QueryPopup_CancelButton() {};
QueryPopup_CancelButton.tabIndex = 82;
