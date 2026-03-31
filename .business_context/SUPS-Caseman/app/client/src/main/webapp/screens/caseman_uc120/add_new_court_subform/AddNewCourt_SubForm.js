/** 
 * @fileoverview AddNewCourt_SubForm.js:
 * This file contains the configurations for the Add New Court Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the text fields without special validation.
 * 19/06/2006 - Chris Vincent, changed the AddNewCourt_CourtId to be mandatory.
 * 25/08/2006 - Chris Vincent, added validation to the AddNewCourt_CourtName field preventing the
 * 				entry of a court with a name already in use which can cause screen crashes with
 * 				court name autocomplete fields.  Defect 4750.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 21/09/2006 - Chris Vincent, changed the maximum lengths of the Bailiff Telephone and Fax Number
 * 				fields from 24 to 12 characters.  This is a temporary fix for defect 5346.  The real 
 * 				fix is to make a schema change to increase the field lengths on the PERSONALISE table.
 * 				Phil Hardy has confirmed this can go into live with non SUPS standard max lengths but
 * 				the real fix must be made post live.
 * 04/02/2008 - Chris Vincent, fixed CaseMan Defect 6154 which was the inability of the screen to cope
 * 				with courts that had duplicate names.  The autocompletes, now use the court code as a
 * 				key value and the display value of [Court Name] ([Court Code]) if duplicate names exist.
 * 09/02/2010 - Chris Vincent, changes required for Trac 2629 which includes new Welsh Court Name fields.
 *                                  Tab ordering has been updated to include the new fields.
 * 05/09/2012 - Chris Vincent: Added DR Telephone, DR Opening Hours and By Appointment Flag fields.  Trac 4718
 */

/************************** FORM CONFIGURATIONS *************************************/

function addNewCourtSubform() {}

addNewCourtSubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "NewCourt.xml",
	dataBinding: "/ds"
}

addNewCourtSubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "NewCourt.xml",
	dataBinding: "/ds"
}

addNewCourtSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddNewCourt_OkButton"} ],
                    doubleClicks: []
                  },

	create: {},
	
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

addNewCourtSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addNewCourtSubform" } ],
					singleClicks: [ {element: "AddNewCourt_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** LOV POPUPS *****************************************/

function AddNewCourt_GroupingCourtLOVGrid() {};
AddNewCourt_GroupingCourtLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/LOVGrids/GroupingCourtCode";
AddNewCourt_GroupingCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
AddNewCourt_GroupingCourtLOVGrid.rowXPath = "Court[./InService = 'Y']";
AddNewCourt_GroupingCourtLOVGrid.keyXPath = "Code";
AddNewCourt_GroupingCourtLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

AddNewCourt_GroupingCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddNewCourt_GroupingCourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "AddNewCourt_GroupingCourtCode" }, { key: Key.F6, element: "AddNewCourt_GroupingCourtName" } ]
	}
};

/**
 * @author rzxd7g
 * @return "AddNewCourt_GroupingCourtCode"  
 */
AddNewCourt_GroupingCourtLOVGrid.nextFocusedAdaptorId = function() {
	return "AddNewCourt_GroupingCourtCode";
}

AddNewCourt_GroupingCourtLOVGrid.logicOn = [AddNewCourt_GroupingCourtLOVGrid.dataBinding];
AddNewCourt_GroupingCourtLOVGrid.logic = function(event)
{	
	if ( event.getXPath() != AddNewCourt_GroupingCourtLOVGrid.dataBinding )
	{
		return;
	}
	
	var value = Services.getValue(AddNewCourt_GroupingCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		Services.setValue(AddNewCourt_GroupingCourtCode.dataBinding, value);
	}
}

/****************************** DATA BINDINGS **************************************/

AddNewCourt_CourtCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Code";
AddNewCourt_CourtName.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Name";
AddNewCourt_Welsh_HighCourt_Name.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/WelshHighCourtName";
AddNewCourt_Welsh_CountyCourt_Name.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/WelshCountyCourtName";
AddNewCourt_CourtId.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Id";
AddNewCourt_DistrictRegistry.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DistrictRegistry";
AddNewCourt_InService.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/InService";
AddNewCourt_GroupingCourtCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/GroupingCourtCode";
AddNewCourt_GroupingCourtName.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/GroupingCourtName";
AddNewCourt_DX.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/DXNumber";
AddNewCourt_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/TelephoneNumber";
AddNewCourt_FaxNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/FaxNumber";
AddNewCourt_DR_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ContactDetails/DRTelephoneNumber";
AddNewCourt_Court_OpenFrom.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/OpenFrom";
AddNewCourt_Court_OpenTo.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/OpenTo";
AddNewCourt_Court_AccountType.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/AccountType";
AddNewCourt_Court_AccountingCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/AccountingCode";
AddNewCourt_Bailiff_OpenFrom.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/BailiffOpenFrom";
AddNewCourt_Bailiff_OpenTo.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/BailiffOpenTo";
AddNewCourt_Bailiff_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/BailiffTelephoneNumber";
AddNewCourt_Bailiff_FaxNumber.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/BailiffFaxNumber";
AddNewCourt_CourtDR_OpenFrom.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DROpenFrom";
AddNewCourt_CourtDR_OpenTo.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DROpenTo";
AddNewCourt_ByAppointment.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ByAppointment";

/******************************* INPUT FIELDS **************************************/

function AddNewCourt_CourtCode() {}
AddNewCourt_CourtCode.tabIndex = 1;
AddNewCourt_CourtCode.maxLength = 3;
AddNewCourt_CourtCode.helpText = "Unique three digit court code";
AddNewCourt_CourtCode.componentName = "Court Code";
AddNewCourt_CourtCode.isMandatory = function() { return true; }
AddNewCourt_CourtCode.validate = function()
{
	var ec = null;
	var courtCode = Services.getValue(AddNewCourt_CourtCode.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		if ( !CaseManValidationHelper.validateNumber(courtCode) )
		{
			// Court court entered is not a number
			ec = ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
		}
		else if ( courtCode < 1 || courtCode > 999 )
		{
			// Court code is outside of the valid range (1-999)
			ec = ErrorCode.getErrorCode("CaseMan_courtCodeInvalidRange_Msg");
		}
		else if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + courtCode + "']") )
		{
			// The Court code entered already exists
			ec = ErrorCode.getErrorCode("CaseMan_courtAlreadyExists_Msg");
		}
	}
	return ec;
}

AddNewCourt_CourtCode.logicOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_CourtCode.logic = function(event)
{
	if ( event.getXPath() != AddNewCourt_CourtCode.dataBinding)
	{
		// Do not proceed if input not from this field
		return;
	}
	
	var courtCode = Services.getValue(AddNewCourt_CourtCode.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) || !CaseManValidationHelper.validateNumber(courtCode) )
	{
		// Court Code has been blanked or is invalid - clear the subform
		clearSubformData();
	}
	else
	{
		// Set the default values
		Services.setValue(AddNewCourt_InService.dataBinding, "Y");
		Services.setValue(AddNewCourt_DistrictRegistry.dataBinding, "N");
	}
}

/*********************************************************************************/

function AddNewCourt_CourtName() {}
AddNewCourt_CourtName.tabIndex = 2;
AddNewCourt_CourtName.maxLength = 30;
AddNewCourt_CourtName.helpText = "Court name";
AddNewCourt_CourtName.componentName = "Court Name";
AddNewCourt_CourtName.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_CourtName.isEnabled = newCourtFieldsEnabled;
AddNewCourt_CourtName.isMandatory = function() { return true; }
AddNewCourt_CourtName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddNewCourt_CourtName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

AddNewCourt_CourtName.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(AddNewCourt_CourtName.dataBinding);
	if ( !CaseManUtils.isBlank(courtName) )
	{
		if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + AddNewCourt_CourtName.dataBinding + "]") )
		{
			// The court name entered already exists
			ec = ErrorCode.getErrorCode("CaseMan_courtNameAlreadyExists_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function AddNewCourt_Welsh_HighCourt_Name () {};
AddNewCourt_Welsh_HighCourt_Name.maxLength = 60;
AddNewCourt_Welsh_HighCourt_Name.tabIndex = 3;
AddNewCourt_Welsh_HighCourt_Name.componentName = "Welsh High Court Name";
AddNewCourt_Welsh_HighCourt_Name.helpText = "Welsh High Court Name including description e.g. Cofrestrfa Ddosbarth";
AddNewCourt_Welsh_HighCourt_Name.mandatoryOn = [AddNewCourt_Welsh_CountyCourt_Name.dataBinding];
AddNewCourt_Welsh_HighCourt_Name.isMandatory = function()
{
	var blnMandatory = false;
	if ( !CaseManUtils.isBlank( Services.getValue(AddNewCourt_Welsh_CountyCourt_Name.dataBinding) ) )
	{
		// High Court Name is mandatory if County Court name is populated
		blnMandatory = true;
	}
	return blnMandatory;
}

AddNewCourt_Welsh_HighCourt_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewCourt_Welsh_HighCourt_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

AddNewCourt_Welsh_HighCourt_Name.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Welsh_HighCourt_Name.isEnabled = newCourtFieldsEnabled

/*********************************************************************************/

function AddNewCourt_Welsh_CountyCourt_Name () {};
AddNewCourt_Welsh_CountyCourt_Name.maxLength = 60;
AddNewCourt_Welsh_CountyCourt_Name.tabIndex = 4;
AddNewCourt_Welsh_CountyCourt_Name.componentName = "Welsh County Court Name";
AddNewCourt_Welsh_CountyCourt_Name.helpText = "Welsh County Court Name including description e.g. Llys Sirol";
AddNewCourt_Welsh_CountyCourt_Name.mandatoryOn = [AddNewCourt_Welsh_HighCourt_Name.dataBinding];
AddNewCourt_Welsh_CountyCourt_Name.isMandatory = function()
{
	var blnMandatory = false;
	if ( !CaseManUtils.isBlank( Services.getValue(AddNewCourt_Welsh_HighCourt_Name.dataBinding) ) )
	{
		// County Court Name is mandatory if High Court name is populated
		blnMandatory = true;
	}
	return blnMandatory;
}

AddNewCourt_Welsh_CountyCourt_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewCourt_Welsh_CountyCourt_Name.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

AddNewCourt_Welsh_CountyCourt_Name.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Welsh_CountyCourt_Name.isEnabled = newCourtFieldsEnabled

/*********************************************************************************/

function AddNewCourt_CourtId() {}
AddNewCourt_CourtId.tabIndex = 5;
AddNewCourt_CourtId.maxLength = 2;
AddNewCourt_CourtId.helpText = "The court's identification code";
AddNewCourt_CourtId.componentName = "Id";
AddNewCourt_CourtId.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_CourtId.isEnabled = newCourtFieldsEnabled;
AddNewCourt_CourtId.isMandatory = function() { return true; }
AddNewCourt_CourtId.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddNewCourt_CourtId.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewCourt_CourtId.validate = function()
{
	var ec = null;
	var id = Services.getValue(AddNewCourt_CourtId.dataBinding);
	if ( !CaseManUtils.isBlank(id) )
	{
		var idExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + AddNewCourt_CourtId.dataBinding + "]");
		if ( idExists )
		{
			// The Court Id must be unique
			ec = ErrorCode.getErrorCode("CaseMan_courtIdAlreadyExists_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function AddNewCourt_DistrictRegistry() {}
AddNewCourt_DistrictRegistry.tabIndex = 6;
AddNewCourt_DistrictRegistry.helpText = "Is court District Registry";
AddNewCourt_DistrictRegistry.componentName = "District Registry";
AddNewCourt_DistrictRegistry.modelValue = {checked: "Y", unchecked: "N"};
AddNewCourt_DistrictRegistry.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_DistrictRegistry.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_InService() {}
AddNewCourt_InService.tabIndex = 7;
AddNewCourt_InService.helpText = "Is court in service";
AddNewCourt_InService.componentName = "In Service";
AddNewCourt_InService.modelValue = {checked: "Y", unchecked: "N"};
AddNewCourt_InService.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_InService.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_GroupingCourtCode() {};
AddNewCourt_GroupingCourtCode.tabIndex = 8;
AddNewCourt_GroupingCourtCode.maxLength = 3;
AddNewCourt_GroupingCourtCode.helpText = "Grouping court code";
AddNewCourt_GroupingCourtCode.componentName = "Grouping Court Code";
AddNewCourt_GroupingCourtCode.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_GroupingCourtCode.isEnabled = newCourtFieldsEnabled;

AddNewCourt_GroupingCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + AddNewCourt_GroupingCourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

AddNewCourt_GroupingCourtCode.logicOn = [AddNewCourt_GroupingCourtCode.dataBinding]
AddNewCourt_GroupingCourtCode.logic = function(event)
{
	// Set the dirty flag if dataBinding changes when a court has been loaded
	if ( event.getXPath() != AddNewCourt_GroupingCourtCode.dataBinding )
	{
		return;
	}
	
	var courtCode = Services.getValue(AddNewCourt_GroupingCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) )
	{
		Services.setValue(AddNewCourt_GroupingCourtName.dataBinding, "");
	}
	
	if ( !CaseManUtils.isBlank(courtCode) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + AddNewCourt_GroupingCourtCode.dataBinding + "]") )
	{
		Services.setValue(AddNewCourt_GroupingCourtName.dataBinding, courtCode);
	}
}

/*********************************************************************************/

function AddNewCourt_GroupingCourtName() {};
AddNewCourt_GroupingCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
AddNewCourt_GroupingCourtName.rowXPath = "Court";
AddNewCourt_GroupingCourtName.keyXPath = "Code";
AddNewCourt_GroupingCourtName.displayXPath = "DisplayName";
AddNewCourt_GroupingCourtName.strictValidation = true;
AddNewCourt_GroupingCourtName.tabIndex = 9;
AddNewCourt_GroupingCourtName.helpText = "Grouping court name";
AddNewCourt_GroupingCourtName.componentName = "Grouping Court Name";
AddNewCourt_GroupingCourtName.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_GroupingCourtName.isEnabled = newCourtFieldsEnabled;

AddNewCourt_GroupingCourtName.logicOn = [AddNewCourt_GroupingCourtName.dataBinding];
AddNewCourt_GroupingCourtName.logic = function(event)
{
	if( event.getXPath() != AddNewCourt_GroupingCourtName.dataBinding )
	{
		return;
	}

	var courtName = Services.getValue(AddNewCourt_GroupingCourtName.dataBinding);
	if ( CaseManUtils.isBlank(courtName) )
	{
		Services.setValue(AddNewCourt_GroupingCourtCode.dataBinding, "");
	}
	
	if ( !CaseManUtils.isBlank(courtName) && Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./InService = 'Y' and ./Code = " + AddNewCourt_GroupingCourtName.dataBinding + "]") )
	{
		Services.setValue(AddNewCourt_GroupingCourtCode.dataBinding, courtName);
	}
}

/*********************************************************************************/

function AddNewCourt_DX() {}
AddNewCourt_DX.tabIndex = 12;
AddNewCourt_DX.maxLength = 35;
AddNewCourt_DX.helpText = "Court document exchange number";
AddNewCourt_DX.componentName = "DX Number";
AddNewCourt_DX.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_DX.isEnabled = newCourtFieldsEnabled;
AddNewCourt_DX.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddNewCourt_DX.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function AddNewCourt_TelephoneNumber() {}
AddNewCourt_TelephoneNumber.tabIndex = 13;
AddNewCourt_TelephoneNumber.maxLength = 24;
AddNewCourt_TelephoneNumber.helpText = "Court telephone number";
AddNewCourt_TelephoneNumber.componentName = "Telephone Number";
AddNewCourt_TelephoneNumber.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_TelephoneNumber.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_FaxNumber() {}
AddNewCourt_FaxNumber.tabIndex = 14;
AddNewCourt_FaxNumber.maxLength = 24;
AddNewCourt_FaxNumber.helpText = "Court fax number";
AddNewCourt_FaxNumber.componentName = "Fax Number";
AddNewCourt_FaxNumber.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_FaxNumber.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_DR_TelephoneNumber() {}
AddNewCourt_DR_TelephoneNumber.tabIndex = 15;
AddNewCourt_DR_TelephoneNumber.maxLength = 24;
AddNewCourt_DR_TelephoneNumber.helpText = "Court District Registry telephone number";
AddNewCourt_DR_TelephoneNumber.componentName = "DR Telephone Number";
AddNewCourt_DR_TelephoneNumber.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_DR_TelephoneNumber.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_Court_OpenFrom() {}
AddNewCourt_Court_OpenFrom.tabIndex = 16;
AddNewCourt_Court_OpenFrom.maxLength = 5;
AddNewCourt_Court_OpenFrom.helpText = "Court opening time";
AddNewCourt_Court_OpenFrom.componentName = "Open From";
AddNewCourt_Court_OpenFrom.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Court_OpenFrom.isEnabled = newCourtFieldsEnabled;

AddNewCourt_Court_OpenFrom.validate = function()
{
	var time = Services.getValue(AddNewCourt_Court_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.COURT_OPENTIMEVALID_XPATH, time);
}

AddNewCourt_Court_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

AddNewCourt_Court_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_Court_OpenTo() {}
AddNewCourt_Court_OpenTo.tabIndex = 17;
AddNewCourt_Court_OpenTo.maxLength = 5;
AddNewCourt_Court_OpenTo.helpText = "Court closing time";
AddNewCourt_Court_OpenTo.componentName = "Open To";
AddNewCourt_Court_OpenTo.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Court_OpenTo.isEnabled = newCourtFieldsEnabled;

AddNewCourt_Court_OpenTo.validate = function()
{
	var time = Services.getValue(AddNewCourt_Court_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.COURT_CLOSETIMEVALID_XPATH, time);
}

AddNewCourt_Court_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

AddNewCourt_Court_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_Court_AccountType() {}
AddNewCourt_Court_AccountType.srcData = XPathConstants.REF_DATA_XPATH + "/AccountTypes";
AddNewCourt_Court_AccountType.rowXPath = "AccountType";
AddNewCourt_Court_AccountType.keyXPath = "Value";
AddNewCourt_Court_AccountType.displayXPath = "Value";
AddNewCourt_Court_AccountType.tabIndex = 18;
AddNewCourt_Court_AccountType.maxLength = 10;
AddNewCourt_Court_AccountType.helpText = "Court account type";
AddNewCourt_Court_AccountType.componentName = "Account Type";
AddNewCourt_Court_AccountType.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Court_AccountType.isEnabled = newCourtFieldsEnabled;
AddNewCourt_Court_AccountType.isMandatory = function() { return true; }

/*********************************************************************************/

function AddNewCourt_Court_AccountingCode() {}
AddNewCourt_Court_AccountingCode.tabIndex = 19;
AddNewCourt_Court_AccountingCode.maxLength = 5;
AddNewCourt_Court_AccountingCode.helpText = "Court accounting code";
AddNewCourt_Court_AccountingCode.componentName = "Accounting Code";
AddNewCourt_Court_AccountingCode.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Court_AccountingCode.isEnabled = newCourtFieldsEnabled;
AddNewCourt_Court_AccountingCode.isMandatory = function() { return true; }
AddNewCourt_Court_AccountingCode.validate = function()
{
	var accountingCode = Services.getValue(AddNewCourt_Court_AccountingCode.dataBinding);
	if ( !CaseManValidationHelper.validateNumber(accountingCode) )
	{
		return ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
	}
	return null;
}

/*********************************************************************************/

function AddNewCourt_Bailiff_OpenFrom() {}
AddNewCourt_Bailiff_OpenFrom.tabIndex = 20;
AddNewCourt_Bailiff_OpenFrom.maxLength = 5;
AddNewCourt_Bailiff_OpenFrom.helpText = "Bailiff opening time";
AddNewCourt_Bailiff_OpenFrom.componentName = "Bailiff Opening";
AddNewCourt_Bailiff_OpenFrom.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Bailiff_OpenFrom.isEnabled = newCourtFieldsEnabled;

AddNewCourt_Bailiff_OpenFrom.validate = function()
{
	var time = Services.getValue(AddNewCourt_Bailiff_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, time);
}

AddNewCourt_Bailiff_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, value);
}

AddNewCourt_Bailiff_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.BAILIFF_OPENTIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_Bailiff_OpenTo() {}
AddNewCourt_Bailiff_OpenTo.tabIndex = 21;
AddNewCourt_Bailiff_OpenTo.maxLength = 5;
AddNewCourt_Bailiff_OpenTo.helpText = "Bailiff closing time";
AddNewCourt_Bailiff_OpenTo.componentName = "Bailiff Closing";
AddNewCourt_Bailiff_OpenTo.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Bailiff_OpenTo.isEnabled = newCourtFieldsEnabled;

AddNewCourt_Bailiff_OpenTo.validate = function()
{
	var time = Services.getValue(AddNewCourt_Bailiff_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, time);
}

AddNewCourt_Bailiff_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, value);
}

AddNewCourt_Bailiff_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.BAILIFF_CLOSETIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_Bailiff_TelephoneNumber() {}
AddNewCourt_Bailiff_TelephoneNumber.tabIndex = 22;
AddNewCourt_Bailiff_TelephoneNumber.maxLength = 12;
AddNewCourt_Bailiff_TelephoneNumber.helpText = "Bailiff telephone number";
AddNewCourt_Bailiff_TelephoneNumber.componentName = "Bailiff Telephone Number";
AddNewCourt_Bailiff_TelephoneNumber.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Bailiff_TelephoneNumber.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_Bailiff_FaxNumber() {}
AddNewCourt_Bailiff_FaxNumber.tabIndex = 23;
AddNewCourt_Bailiff_FaxNumber.maxLength = 12;
AddNewCourt_Bailiff_FaxNumber.helpText = "Bailiff fax number";
AddNewCourt_Bailiff_FaxNumber.componentName = "Bailiff Fax Number";
AddNewCourt_Bailiff_FaxNumber.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_Bailiff_FaxNumber.isEnabled = newCourtFieldsEnabled;

/*********************************************************************************/

function AddNewCourt_CourtDR_OpenFrom() {}
AddNewCourt_CourtDR_OpenFrom.tabIndex = 24;
AddNewCourt_CourtDR_OpenFrom.maxLength = 5;
AddNewCourt_CourtDR_OpenFrom.helpText = "Court District Registry opening time";
AddNewCourt_CourtDR_OpenFrom.componentName = "DR Open From";
AddNewCourt_CourtDR_OpenFrom.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_CourtDR_OpenFrom.isEnabled = newCourtFieldsEnabled;

AddNewCourt_CourtDR_OpenFrom.validate = function()
{
	var time = Services.getValue(AddNewCourt_CourtDR_OpenFrom.dataBinding);
	return localValidateTime(XPathConstants.COURT_OPENTIMEVALID_XPATH, time);
}

AddNewCourt_CourtDR_OpenFrom.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

AddNewCourt_CourtDR_OpenFrom.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_OPENTIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_CourtDR_OpenTo() {}
AddNewCourt_CourtDR_OpenTo.tabIndex = 25;
AddNewCourt_CourtDR_OpenTo.maxLength = 5;
AddNewCourt_CourtDR_OpenTo.helpText = "Court District Registry closing time";
AddNewCourt_CourtDR_OpenTo.componentName = "DR Open To";
AddNewCourt_CourtDR_OpenTo.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_CourtDR_OpenTo.isEnabled = newCourtFieldsEnabled;

AddNewCourt_CourtDR_OpenTo.validate = function()
{
	var time = Services.getValue(AddNewCourt_CourtDR_OpenTo.dataBinding);
	return localValidateTime(XPathConstants.COURT_CLOSETIMEVALID_XPATH, time);
}

AddNewCourt_CourtDR_OpenTo.transformToDisplay = function(value)
{
	return localTransformTimeToDisplay(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

AddNewCourt_CourtDR_OpenTo.transformToModel = function(value)
{
	return localTransformTimeToModel(XPathConstants.COURT_CLOSETIMEVALID_XPATH, value);
}

/*********************************************************************************/

function AddNewCourt_ByAppointment() {}
AddNewCourt_ByAppointment.tabIndex = 26;
AddNewCourt_ByAppointment.helpText = "Indicator that court is open by appointment only";
AddNewCourt_ByAppointment.componentName = "Open By Appointment";
AddNewCourt_ByAppointment.modelValue = {checked: "Y", unchecked: "N"};
AddNewCourt_ByAppointment.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_ByAppointment.isEnabled = newCourtFieldsEnabled;

/****************************** BUTTON FIELDS **************************************/

function AddNewCourt_GroupingCourtLOVButton() {}
AddNewCourt_GroupingCourtLOVButton.tabIndex = 10;
AddNewCourt_GroupingCourtLOVButton.enableOn = [AddNewCourt_CourtCode.dataBinding];
AddNewCourt_GroupingCourtLOVButton.isEnabled = newCourtFieldsEnabled;

/**********************************************************************************/

function AddNewCourt_OkButton() {}
AddNewCourt_OkButton.tabIndex = 30;

/**********************************************************************************/

function AddNewCourt_CancelButton() {}
AddNewCourt_CancelButton.tabIndex = 31;