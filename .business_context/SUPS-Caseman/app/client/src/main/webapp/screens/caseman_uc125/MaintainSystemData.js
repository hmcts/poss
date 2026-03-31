/** 
 * @fileoverview MaintainSystemData.js:
 * This file contains the field configurations for UC125 - Maintain System Data screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 */

/****************************** MAIN FORM *****************************************/

function maintainSystemData() {};

/**
 * @author pz9j2w
 * 
 */
maintainSystemData.initialise = function()
{
	// Set the default tabbed page
	Services.setValue(myTabSelector.dataBinding, "SystemData_PERDetailsPage");
	loadGlobalCourts();
}

maintainSystemData.refDataServices = [
	{ name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] },
	{ name:"PerDetails", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getPerDetailList", serviceParams:[] },
	{ name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] }
];

/**
 * @param dom
 * @author pz9j2w
 * 
 */
maintainSystemData.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.DATA_XPATH, dom);
}

/********************************* SUBFORMS ****************************************/

function maintainSystemData_subform() {};
maintainSystemData_subform.subformName = "MaintainSystemDataSubform";

maintainSystemData_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.TEMP_ITEM_XPATH } ];
/**
 * @author pz9j2w
 * 
 */
maintainSystemData_subform.processReturnedData = function() 
{
	// Call the add new court service
	var newSystemDataNode = XML.createDOM(null, null, null);
	var dataNode = Services.getNode(XPathConstants.TEMP_ITEM_XPATH);
	newSystemDataNode.appendChild(dataNode);
	
	// Call the add/update service
	var params = new ServiceParams();
	params.addDOMParameter("systemData", newSystemDataNode);
	Services.callService("updateSystemData", params, maintainSystemData_subform, true);
}

/**
 * @param dom
 * @author pz9j2w
 * 
 */
maintainSystemData_subform.onSuccess = function(dom)
{
	// Refresh the appropriate data
	var type = Services.getValue(XPathConstants.SUBFORM_TYPE_XPATH);
	switch (type)
	{
		case SystemDataTypes.TYPE_COURT:
			loadCourtSpecificData();
			break;
		
		case SystemDataTypes.TYPE_PER:
			loadPERSpecificData();
			break;
		
		case SystemDataTypes.TYPE_NONPER:
			loadGlobalCourts();
	}
}

/**
 * @param exception
 * @author pz9j2w
 * 
 */
maintainSystemData_subform.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**
 * @author pz9j2w
 * @return "myTabSelector"  
 */
maintainSystemData_subform.nextFocusedAdaptorId = function() 
{
	return "myTabSelector";
}

/*********************************** TABS ******************************************/

function myTabSelector() {};
myTabSelector.tabIndex = 1;
myTabSelector.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CurrentTabPage";

function myPagedArea() {};
myPagedArea.dataBinding = myTabSelector.dataBinding;

function SystemData_PERDetailsPage() {};
function SystemData_OtherDataPage() {};
function SystemData_CourtSpecificPage() {};

/******************************** LOV POPUPS ***************************************/

function PERDetails_PERLOVGrid() {};
PERDetails_PERLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedPERDetail";
PERDetails_PERLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/PerDetailCodes";
PERDetails_PERLOVGrid.rowXPath = "PerDetailCode";
PERDetails_PERLOVGrid.keyXPath = "Code";
PERDetails_PERLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Prompt"}
];

PERDetails_PERLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "PERDetails_PERLOVButton"} ],
		keys: [ { key: Key.F6, element: "PERDetails_DetailCode" }, { key: Key.F6, element: "PERDetails_Prompt" } ]
	}
};

PERDetails_PERLOVGrid.styleURL = "/css/PERDetailsLOVGrid.css";
PERDetails_PERLOVGrid.destroyOnClose = false;
PERDetails_PERLOVGrid.logicOn = [PERDetails_PERLOVGrid.dataBinding];
PERDetails_PERLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(PERDetails_PERLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var per = Services.getValue(PERDetails_PERLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(per) )
	{
		Services.startTransaction();
		Services.setValue(PERDetails_DetailCode.dataBinding, per);
		Services.setValue(PERDetails_PERLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**
 * @author pz9j2w
 * @return "PERDetails_SearchButton"  
 */
PERDetails_PERLOVGrid.nextFocusedAdaptorId = function() 
{
	return "PERDetails_SearchButton";
}

/*********************************************************************************/

function CourtSpecific_CourtLOVGrid() {};
CourtSpecific_CourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/SelectedCourt";
CourtSpecific_CourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtSpecific_CourtLOVGrid.rowXPath = "Court";
CourtSpecific_CourtLOVGrid.keyXPath = "Code";
CourtSpecific_CourtLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtSpecific_CourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "CourtSpecific_CourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "CourtSpecific_CourtCode" }, { key: Key.F6, element: "CourtSpecific_CourtName" } ]
	}
};

CourtSpecific_CourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtSpecific_CourtLOVGrid.destroyOnClose = false;
CourtSpecific_CourtLOVGrid.logicOn = [CourtSpecific_CourtLOVGrid.dataBinding];
CourtSpecific_CourtLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(CourtSpecific_CourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var courtCode = Services.getValue(CourtSpecific_CourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(CourtSpecific_CourtCode.dataBinding, courtCode);
		Services.setValue(CourtSpecific_CourtLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**
 * @author pz9j2w
 * @return "CourtSpecific_SearchButton"  
 */
CourtSpecific_CourtLOVGrid.nextFocusedAdaptorId = function() 
{
	return "CourtSpecific_SearchButton";
}

/********************************** GRIDS ******************************************/

function PERDetails_PERDetailsGrid() {}
PERDetails_PERDetailsGrid.tempKeyXPath = XPathConstants.DATA_XPATH + '/PERTempKeyXPath';
/**
 * @param key
 * @author pz9j2w
 * @return transformAmountToDisplay(amount) , CaseManUtils.isBlank(amount) ? "", amount  
 */
PERDetails_PERDetailsGrid.transformItemValue = function(key)
{
	Services.setValue(PERDetails_PERDetailsGrid.tempKeyXPath, key);
	var amount = Services.getValue(XPathConstants.DATA_XPATH + "/PerData/SystemDataList/SystemDataItem[./Item = " + PERDetails_PERDetailsGrid.tempKeyXPath + "]/ItemValue");
	var currency = Services.getValue(XPathConstants.DATA_XPATH + "/PerData/SystemDataList/SystemDataItem[./Item = " + PERDetails_PERDetailsGrid.tempKeyXPath + "]/ItemValueCurrency");
	if ( !CaseManUtils.isBlank(currency) )
	{
		return transformAmountToDisplay(amount);
	}
	return CaseManUtils.isBlank(amount) ? "" : amount;
}

PERDetails_PERDetailsGrid.tabIndex = 14;
PERDetails_PERDetailsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Grids/SelectedPERDetail";
PERDetails_PERDetailsGrid.srcData = XPathConstants.DATA_XPATH + "/PerData/SystemDataList";	
PERDetails_PERDetailsGrid.rowXPath = "SystemDataItem";					
PERDetails_PERDetailsGrid.keyXPath = "Item";                    	
PERDetails_PERDetailsGrid.columns = [										
	{xpath: "Item"},
	{xpath: "ItemValueCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Item", transformToDisplay: PERDetails_PERDetailsGrid.transformItemValue }
];

PERDetails_PERDetailsGrid.enableOn = [XPathConstants.PERSELECTED_XPATH];
PERDetails_PERDetailsGrid.isEnabled = isPERSelected;

/*********************************************************************************/

function OtherData_OtherDataGrid() {}
OtherData_OtherDataGrid.tempKeyXPath = XPathConstants.DATA_XPATH + '/OtherTempKeyXPath';
/**
 * @param key
 * @author pz9j2w
 * @return transformAmountToDisplay(amount) , CaseManUtils.isBlank(amount) ? "", amount  
 */
OtherData_OtherDataGrid.transformItemValue = function(key)
{
	Services.setValue(OtherData_OtherDataGrid.tempKeyXPath, key);
	var amount = Services.getValue(XPathConstants.DATA_XPATH + "/NonPerData/SystemDataList/SystemDataItem[./Item = " + OtherData_OtherDataGrid.tempKeyXPath + "]/ItemValue");
	var currency = Services.getValue(XPathConstants.DATA_XPATH + "/NonPerData/SystemDataList/SystemDataItem[./Item = " + OtherData_OtherDataGrid.tempKeyXPath + "]/ItemValueCurrency");
	if ( !CaseManUtils.isBlank(currency) )
	{
		return transformAmountToDisplay(amount);
	}
	return CaseManUtils.isBlank(amount) ? "" : amount;
}

OtherData_OtherDataGrid.tabIndex = 20;
OtherData_OtherDataGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Grids/SelectedOtherData";
OtherData_OtherDataGrid.srcData = XPathConstants.DATA_XPATH + "/NonPerData/SystemDataList";	
OtherData_OtherDataGrid.rowXPath = "SystemDataItem";					
OtherData_OtherDataGrid.keyXPath = "Item";
OtherData_OtherDataGrid.columns = [										
	{xpath: "Item"},
	{xpath: "ItemValueCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Item", transformToDisplay: OtherData_OtherDataGrid.transformItemValue }
];

/*********************************************************************************/

function CourtSpecific_ResultsGrid() {}
CourtSpecific_ResultsGrid.tempKeyXPath = XPathConstants.DATA_XPATH + '/CourtTempKeyXPath';
/**
 * @param key
 * @author pz9j2w
 * @return transformAmountToDisplay(amount) , CaseManUtils.isBlank(amount) ? "", amount  
 */
CourtSpecific_ResultsGrid.transformItemValue = function(key)
{
	Services.setValue(CourtSpecific_ResultsGrid.tempKeyXPath, key);
	var amount = Services.getValue(XPathConstants.DATA_XPATH + "/CourtData/NonPerData/SystemDataList/SystemDataItem[./Item = " + CourtSpecific_ResultsGrid.tempKeyXPath + "]/ItemValue");
	var currency = Services.getValue(XPathConstants.DATA_XPATH + "/CourtData/NonPerData/SystemDataList/SystemDataItem[./Item = " + CourtSpecific_ResultsGrid.tempKeyXPath + "]/ItemValueCurrency");
	if ( !CaseManUtils.isBlank(currency) )
	{
		return transformAmountToDisplay(amount);
	}
	return CaseManUtils.isBlank(amount) ? "" : amount;
}

CourtSpecific_ResultsGrid.tabIndex = 34;
CourtSpecific_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Grids/SelectedCourtSpecific";
CourtSpecific_ResultsGrid.srcData = XPathConstants.DATA_XPATH + "/CourtData/NonPerData/SystemDataList";	
CourtSpecific_ResultsGrid.rowXPath = "SystemDataItem";
CourtSpecific_ResultsGrid.keyXPath = "Item";
CourtSpecific_ResultsGrid.columns = [
	{xpath: "Item"},
	{xpath: "ItemValueCurrency", transformToDisplay: transformCurrencyToDisplay},
	{xpath: "Item", transformToDisplay: CourtSpecific_ResultsGrid.transformItemValue }
];

CourtSpecific_ResultsGrid.enableOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_ResultsGrid.isEnabled = isCourtSelected;

/***************************** DATA BINDINGS **************************************/

PERDetails_DetailCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/PerDetails/DetailCode";
PERDetails_Prompt.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/PerDetails/Prompt";

CourtSpecific_CourtCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CourtSpecific/CourtCode";
CourtSpecific_CourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/CourtSpecific/CourtName";

/********************************* FIELDS ******************************************/

function PERDetails_DetailCode() {}
PERDetails_DetailCode.tabIndex = 10;
PERDetails_DetailCode.maxLength = 10;
PERDetails_DetailCode.helpText = "PER Detail Code";
PERDetails_DetailCode.readOnlyOn = [XPathConstants.PERSELECTED_XPATH];
PERDetails_DetailCode.isReadOnly = isPERSelected;
PERDetails_DetailCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
PERDetails_DetailCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

PERDetails_DetailCode.validate = function()
{
	var ec = null;
	var promptText = Services.getValue(XPathConstants.REF_DATA_XPATH + "/PerDetailCodes/PerDetailCode[./Code = " + PERDetails_DetailCode.dataBinding + "]/Prompt");
	if( null == promptText )
	{
		// The detail code entered does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidPerDetailCode_Msg");
	}
	return ec;
}

PERDetails_DetailCode.logicOn = [PERDetails_DetailCode.dataBinding];
PERDetails_DetailCode.logic = function(event)
{
	if (event.getXPath() != PERDetails_DetailCode.dataBinding)
	{
		return;
	}

	var detailCode = Services.getValue(PERDetails_DetailCode.dataBinding);
	if ( !CaseManUtils.isBlank( detailCode ) )
	{
		// Populate the Court Name field
		var promptText = Services.getValue(XPathConstants.REF_DATA_XPATH + "/PerDetailCodes/PerDetailCode[./Code = " + PERDetails_DetailCode.dataBinding + "]/Prompt");
		if ( !CaseManUtils.isBlank(promptText) && Services.getValue(PERDetails_Prompt.dataBinding) != promptText )
		{
			Services.setValue(PERDetails_Prompt.dataBinding, promptText);
		}
	}
	else
	{
		Services.setValue(PERDetails_Prompt.dataBinding, "");
	}
}

/*********************************************************************************/

function PERDetails_Prompt() {}
PERDetails_Prompt.tabIndex = 11;
PERDetails_Prompt.helpText = "PER Detail Prompt Text";
PERDetails_Prompt.srcData = XPathConstants.REF_DATA_XPATH + "/PerDetailCodes";
PERDetails_Prompt.rowXPath = "PerDetailCode";
PERDetails_Prompt.keyXPath = "Prompt";
PERDetails_Prompt.displayXPath = "Prompt";
PERDetails_Prompt.strictValidation = true;
PERDetails_Prompt.readOnlyOn = [XPathConstants.PERSELECTED_XPATH];
PERDetails_Prompt.isReadOnly = isPERSelected;
PERDetails_Prompt.logicOn = [PERDetails_Prompt.dataBinding];
PERDetails_Prompt.logic = function(event)
{
	if (event.getXPath() != PERDetails_Prompt.dataBinding)
	{
		return;
	}

	var promptText = Services.getValue(PERDetails_Prompt.dataBinding);
	if ( !CaseManUtils.isBlank( promptText ) )
	{
		// Populate the Court Code field
		var detailCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/PerDetailCodes/PerDetailCode[./Prompt = " + PERDetails_Prompt.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(detailCode) && Services.getValue(PERDetails_DetailCode.dataBinding) != detailCode )
		{
			Services.setValue(PERDetails_DetailCode.dataBinding, detailCode);
		}
	}
	else
	{
		// Court Name cleared so clear the Court Code field
		Services.setValue(PERDetails_DetailCode.dataBinding, "");
	}
}

/*********************************************************************************/

function CourtSpecific_CourtCode() {}
CourtSpecific_CourtCode.tabIndex = 30;
CourtSpecific_CourtCode.maxLength = 3;
CourtSpecific_CourtCode.helpText = "Court code";

CourtSpecific_CourtCode.readOnlyOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_CourtCode.isReadOnly = isCourtSelected;

CourtSpecific_CourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + CourtSpecific_CourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

CourtSpecific_CourtCode.logicOn = [CourtSpecific_CourtCode.dataBinding];
CourtSpecific_CourtCode.logic = function(event)
{
	if (event.getXPath() != CourtSpecific_CourtCode.dataBinding)
	{
		return;
	}

	var courtCode = Services.getValue(CourtSpecific_CourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( courtCode ) )
	{
		// Populate the Court Name field
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + CourtSpecific_CourtCode.dataBinding + "]/Name");
		if ( !CaseManUtils.isBlank(courtName) && Services.getValue(CourtSpecific_CourtName.dataBinding) != courtName )
		{
			Services.setValue(CourtSpecific_CourtName.dataBinding, courtName);
		}
	}
	else
	{
		Services.setValue(CourtSpecific_CourtName.dataBinding, "");
	}
}

/*********************************************************************************/

function CourtSpecific_CourtName() {}
CourtSpecific_CourtName.tabIndex = 31;
CourtSpecific_CourtName.helpText = "Court name";
CourtSpecific_CourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
CourtSpecific_CourtName.rowXPath = "Court";
CourtSpecific_CourtName.keyXPath = "Name";
CourtSpecific_CourtName.displayXPath = "Name";
CourtSpecific_CourtName.strictValidation = true;
CourtSpecific_CourtName.readOnlyOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_CourtName.isReadOnly = isCourtSelected;
CourtSpecific_CourtName.logicOn = [CourtSpecific_CourtName.dataBinding];
CourtSpecific_CourtName.logic = function(event)
{
	if (event.getXPath() != CourtSpecific_CourtName.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(CourtSpecific_CourtName.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		// Populate the Court Code field
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + CourtSpecific_CourtName.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(CourtSpecific_CourtCode.dataBinding) != courtCode )
		{
			Services.setValue(CourtSpecific_CourtCode.dataBinding, courtCode);
		}
	}
	else
	{
		// Court Name cleared so clear the Court Code field
		Services.setValue(CourtSpecific_CourtCode.dataBinding, "");
	}
}

/******************************** BUTTONS *****************************************/

function PERDetails_PERLOVButton() {}
PERDetails_PERLOVButton.tabIndex = 12;
PERDetails_PERLOVButton.enableOn = [XPathConstants.PERSELECTED_XPATH];
PERDetails_PERLOVButton.isEnabled = function()
{
	// Disabled if a per detail record is loaded
	return isPERSelected() ? false : true;
}

/**********************************************************************************/

function PERDetails_SearchButton() {}
PERDetails_SearchButton.tabIndex = 13;

PERDetails_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ 
				{ key: Key.F1, element: "PERDetails_DetailCode" }, 
				{ key: Key.F1, element: "PERDetails_Prompt" },
				{ key: Key.F1, element: "PERDetails_PERLOVButton" } 
			  ]
	}
};

PERDetails_SearchButton.enableOn = [XPathConstants.PERSELECTED_XPATH, PERDetails_DetailCode.dataBinding];
PERDetails_SearchButton.isEnabled = function()
{
	if ( isPERSelected() )
	{
		// Disable button if a per record is loaded (prevents changing record)
		return false;
	}

	// Disabled if no valid PER detail code has been selected
	var detailCode = Services.getValue(PERDetails_DetailCode.dataBinding);
	var adaptor = Services.getAdaptorById("PERDetails_DetailCode");
	if ( !CaseManUtils.isBlank(detailCode) && adaptor.getValid() )
	{
		return true;
	}
	return false;
}

/**
 * @author pz9j2w
 * 
 */
PERDetails_SearchButton.actionBinding = function()
{
	loadPERSpecificData();
};

/**
 * @param dom
 * @author pz9j2w
 * 
 */
PERDetails_SearchButton.onSuccess = function(dom)
{
	var perNode = dom.selectSingleNode("/SystemData/PerData");
	Services.replaceNode(XPathConstants.DATA_XPATH + "/PerData", perNode);
	Services.setValue(XPathConstants.PERSELECTED_XPATH, "true");
	Services.setFocus("PERDetails_PERDetailsGrid");
}

/**********************************************************************************/

function PERDetails_UpdateButton() {}

PERDetails_UpdateButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ { element: "PERDetails_PERDetailsGrid" } ]
	}
};

PERDetails_UpdateButton.tabIndex = 15;

PERDetails_UpdateButton.enableOn = [PERDetails_PERDetailsGrid.dataBinding];
PERDetails_UpdateButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainSystemData_subform.subformName) )
	{
		// User does not have update access to the screen
		return false;
	}

	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/PerData/SystemDataList/SystemDataItem") == 0 )
	{
		// No data to update
		return false;
	}
	return true;
}

/**
 * @author pz9j2w
 * 
 */
PERDetails_UpdateButton.actionBinding = function()
{
	var itemNode = Services.getNode(XPathConstants.DATA_XPATH + "/PerData/SystemDataList/SystemDataItem[./Item = " + PERDetails_PERDetailsGrid.dataBinding + "]");

	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_MODIFY);
	Services.setValue(XPathConstants.SUBFORM_TYPE_XPATH, SystemDataTypes.TYPE_PER);
	Services.replaceNode(XPathConstants.SUBFORM_NODE_XPATH, itemNode);
	Services.endTransaction();
	Services.dispatchEvent("maintainSystemData_subform", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function PERDetails_ClearButton() {}

PERDetails_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "PERDetails_PERDetailsGrid", alt: true } ]
	}
};

PERDetails_ClearButton.tabIndex = 16;
PERDetails_ClearButton.enableOn = [XPathConstants.PERSELECTED_XPATH];
PERDetails_ClearButton.isEnabled = isPERSelected;

/**
 * @author pz9j2w
 * 
 */
PERDetails_ClearButton.actionBinding = function()
{
	// Clear the search criteria and the PER specific data loaded
	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH + "/PerData");
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH + "/PerDetails");
	Services.setValue(XPathConstants.PERSELECTED_XPATH, "false");
	Services.endTransaction();
	Services.setFocus("PERDetails_DetailCode");
};

/**********************************************************************************/

function OtherData_AddButton() {}
OtherData_AddButton.tabIndex = 21;
OtherData_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "OtherData_OtherDataGrid" } ]
	}
};

OtherData_AddButton.isEnabled = function()
{
	// Disabled if user does not have update access to the screen
	return Services.hasAccessToForm(maintainSystemData_subform.subformName);
}

/**
 * @author pz9j2w
 * 
 */
OtherData_AddButton.actionBinding = function()
{
	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_COURT_XPATH, CaseManUtils.GLOBAL_COURT_CODE);
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_CREATE);
	Services.setValue(XPathConstants.SUBFORM_TYPE_XPATH, SystemDataTypes.TYPE_NONPER);
	Services.endTransaction();
	Services.dispatchEvent("maintainSystemData_subform", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function OtherData_UpdateButton() {}

OtherData_UpdateButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ { element: "OtherData_OtherDataGrid" } ]
	}
};

OtherData_UpdateButton.tabIndex = 22;

OtherData_UpdateButton.enableOn = [OtherData_OtherDataGrid.dataBinding];
OtherData_UpdateButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainSystemData_subform.subformName) )
	{
		// User does not have update access to the screen
		return false;
	}

	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/NonPerData/SystemDataList/SystemDataItem") == 0 )
	{
		// No data to update
		return false;
	}
	return true;
}

/**
 * @author pz9j2w
 * 
 */
OtherData_UpdateButton.actionBinding = function()
{
	var itemNode = Services.getNode(XPathConstants.DATA_XPATH + "/NonPerData/SystemDataList/SystemDataItem[./Item = " + OtherData_OtherDataGrid.dataBinding + "]");

	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_MODIFY);
	Services.setValue(XPathConstants.SUBFORM_TYPE_XPATH, SystemDataTypes.TYPE_NONPER);
	Services.replaceNode(XPathConstants.SUBFORM_NODE_XPATH, itemNode);
	Services.endTransaction();
	Services.dispatchEvent("maintainSystemData_subform", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function CourtSpecific_CourtLOVButton() {}
CourtSpecific_CourtLOVButton.tabIndex = 32;
CourtSpecific_CourtLOVButton.enableOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_CourtLOVButton.isEnabled = function()
{
	// Disabled if a court is loaded
	return isCourtSelected() ? false : true;
}

/**********************************************************************************/

function CourtSpecific_SearchButton() {}
CourtSpecific_SearchButton.tabIndex = 33;

CourtSpecific_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ 
				{ key: Key.F1, element: "CourtSpecific_CourtCode" }, 
				{ key: Key.F1, element: "CourtSpecific_CourtName" },
				{ key: Key.F1, element: "CourtSpecific_CourtLOVButton" } 
			  ]
	}
};

CourtSpecific_SearchButton.enableOn = [XPathConstants.COURTSELECTED_XPATH, CourtSpecific_CourtCode.dataBinding];
CourtSpecific_SearchButton.isEnabled = function()
{
	if ( isCourtSelected() )
	{
		// Disable button if a court is loaded (prevents changing court)
		return false;
	}

	// Disabled if no valid court has been selected
	var courtCode = Services.getValue(CourtSpecific_CourtCode.dataBinding);
	var adaptor = Services.getAdaptorById("CourtSpecific_CourtCode");
	if ( !CaseManUtils.isBlank(courtCode) && adaptor.getValid() )
	{
		return true;
	}
	return false;
}

/**
 * @author pz9j2w
 * 
 */
CourtSpecific_SearchButton.actionBinding = function()
{
	loadCourtSpecificData();
};

/**
 * @param dom
 * @author pz9j2w
 * 
 */
CourtSpecific_SearchButton.onSuccess = function(dom)
{
	var courtNode = dom.selectSingleNode("/SystemData/NonPerData");
	Services.replaceNode(XPathConstants.DATA_XPATH + "/CourtData/NonPerData", courtNode);
	Services.setValue(XPathConstants.COURTSELECTED_XPATH, "true");
	Services.setFocus("CourtSpecific_ResultsGrid");
}

/**********************************************************************************/

function CourtSpecific_AddButton() {}

CourtSpecific_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "CourtSpecific_ResultsGrid" } ]
	}
};

CourtSpecific_AddButton.tabIndex = 35;
CourtSpecific_AddButton.enableOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_AddButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainSystemData_subform.subformName) )
	{
		// User does not have update access to the screen
		return false;
	}
	return isCourtSelected();
}

/**
 * @author pz9j2w
 * 
 */
CourtSpecific_AddButton.actionBinding = function()
{
	var courtCode = Services.getValue(CourtSpecific_CourtCode.dataBinding);
	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_COURT_XPATH, courtCode);
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_CREATE);
	Services.setValue(XPathConstants.SUBFORM_TYPE_XPATH, SystemDataTypes.TYPE_COURT);
	Services.endTransaction();
	Services.dispatchEvent("maintainSystemData_subform", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function CourtSpecific_UpdateButton() {}

CourtSpecific_UpdateButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ { element: "CourtSpecific_ResultsGrid" } ]
	}
};

CourtSpecific_UpdateButton.tabIndex = 36;
CourtSpecific_UpdateButton.enableOn = [XPathConstants.COURTSELECTED_XPATH, CourtSpecific_ResultsGrid.dataBinding];
CourtSpecific_UpdateButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(maintainSystemData_subform.subformName) )
	{
		// User does not have update access to the screen
		return false;
	}

	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/CourtData/NonPerData/SystemDataList/SystemDataItem") == 0 )
	{
		// No data to update
		return false;
	}
	
	if ( !isCourtSelected() )
	{
		// No court has been selected
		return false;
	}

	return true;
}

/**
 * @author pz9j2w
 * 
 */
CourtSpecific_UpdateButton.actionBinding = function()
{
	var itemNode = Services.getNode(XPathConstants.DATA_XPATH + "/CourtData/NonPerData/SystemDataList/SystemDataItem[./Item = " + CourtSpecific_ResultsGrid.dataBinding + "]");

	Services.startTransaction();
	Services.setValue(XPathConstants.SUBFORM_MODE_XPATH, FormStates.MODE_MODIFY);
	Services.setValue(XPathConstants.SUBFORM_TYPE_XPATH, SystemDataTypes.TYPE_COURT);
	Services.replaceNode(XPathConstants.SUBFORM_NODE_XPATH, itemNode);
	Services.endTransaction();
	Services.dispatchEvent("maintainSystemData_subform", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function CourtSpecific_ClearButton() {}

CourtSpecific_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "CourtSpecific_ResultsGrid", alt: true } ]
	}
};

CourtSpecific_ClearButton.tabIndex = 37;
CourtSpecific_ClearButton.enableOn = [XPathConstants.COURTSELECTED_XPATH];
CourtSpecific_ClearButton.isEnabled = isCourtSelected;

/**
 * @author pz9j2w
 * 
 */
CourtSpecific_ClearButton.actionBinding = function()
{
	// Clear the search criteria and the court specific data loaded
	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH + "/CourtData/NonPerData");
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH + "/CourtSpecific");
	Services.setValue(XPathConstants.COURTSELECTED_XPATH, "false");
	Services.endTransaction();
	Services.setFocus("CourtSpecific_CourtCode");
};

/**********************************************************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainSystemData" } ]
	}
};

Status_CloseButton.tabIndex = 40;
/**
 * @author pz9j2w
 * 
 */
Status_CloseButton.actionBinding = function()
{
	Services.navigate(NavigationController.MAIN_MENU);
};
