/** 
 * @fileoverview maintainPerDetails.js:
 * This file contains the form and field configurations for the UC126 - Maintain 
 * PER Details screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the text fields without special validation.
 */

/******************************** MAIN FORM *****************************************/

function maintainPerDetails () {};
maintainPerDetails.refDataServices = [
	{name:"CurrentCurrency", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[] }
];

/******************************* SUB-FORMS *****************************************/

function addNewPerDetail_subform() {};
addNewPerDetail_subform.subformName = "AddPERDetailSubform";

addNewPerDetail_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Query_AddPERDetailButton"} ],
		keys: [ { key: Key.F2, element: "maintainPerDetails" } ],
		isEnabled: function()
		{
			return Services.hasAccessToForm(addNewPerDetail_subform.subformName);
		}
	}
};

addNewPerDetail_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.ADD_PERDETAIL_XPATH } ];
/**
 * @author qz8rkl
 * 
 */
addNewPerDetail_subform.processReturnedData = function() 
{
	// Update the per record with the missing details
	var detailCode = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/DetailCode");
	var category = detailCode.charAt(0);
	var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
	var itemW = detailCode + "_W";
	var itemM = detailCode + "_M";
	
	Services.startTransaction();
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/PerCategory", category);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[1]/Item", itemW);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[1]/AdminCourtCode", CaseManUtils.GLOBAL_COURT_CODE );
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[1]/ItemValueCurrency", defaultCurrency);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[1]/ItemValue", 0.00);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[2]/Item", itemM);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[2]/AdminCourtCode", CaseManUtils.GLOBAL_COURT_CODE );
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[2]/ItemValueCurrency", defaultCurrency);
	Services.setValue(XPathConstants.ADD_PERDETAIL_XPATH + "/SystemDataList/SystemDataItem[2]/ItemValue", 0.00);
	Services.endTransaction();

	// Call the add new court service
	var newPerNode = XML.createDOM(null, null, null);
	var dataNode = Services.getNode(XPathConstants.ADD_PERDETAIL_XPATH);
	newPerNode.appendChild(dataNode);
	
	// Call the add service
	var params = new ServiceParams();
	params.addDOMParameter("perDetails", newPerNode);
	Services.callService("addPerDetail", params, addNewPerDetail_subform, true);
}

/**
 * @param dom
 * @author qz8rkl
 * 
 */
addNewPerDetail_subform.onSuccess = function(dom)
{
	// Call the query service to retrieve the details of the new PER Record
	var detailCode = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/DetailCode");
	var group = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/PerGroup");
	var groupText = CaseManUtils.isBlank(group) ? "" : groupText;
	var category = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/PerCategory");
	var multiples = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/AllowMultiples");
	var promptText = Services.getValue(XPathConstants.ADD_PERDETAIL_XPATH + "/Prompt");
	
	var params = new ServiceParams();
	params.addSimpleParameter("code", detailCode);
	params.addSimpleParameter("group", groupText);
	params.addSimpleParameter("category", category);
	params.addSimpleParameter("multiples", multiples);
	params.addSimpleParameter("order", "");
	params.addSimpleParameter("prompt", promptText);
	Services.callService("getPerDetailsFilter", params, Query_SearchButton, true);
}

/**
 * @param exception
 * @author qz8rkl
 * 
 */
addNewPerDetail_subform.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**
 * @author qz8rkl
 * @return "Master_PERDetailsGrid"  
 */
addNewPerDetail_subform.nextFocusedAdaptorId = function() 
{
	return "Master_PERDetailsGrid";
}

/********************************* GRIDS *******************************************/

function Master_PERDetailsGrid() {};
Master_PERDetailsGrid.isRecord = true;
Master_PERDetailsGrid.dataBinding = XPathConstants.GRID_XPATH;
Master_PERDetailsGrid.tabIndex = 10;
Master_PERDetailsGrid.srcData = XPathConstants.DATA_XPATH;	
Master_PERDetailsGrid.rowXPath = "PerDetail";					
Master_PERDetailsGrid.keyXPath = "OrderNumber";                    		
Master_PERDetailsGrid.columns = [										
	{xpath: "DetailCode"},
	{xpath: "Prompt"},
	{xpath: "PerGroup"},
	{xpath: "PerCategory"}
];

Master_PERDetailsGrid.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_PERDetailsGrid.isEnabled = isScreenInUpdateMode;

/***************************** DATA BINDINGS ***************************************/

Query_DetailCode.dataBinding = XPathConstants.SEARCH_XPATH + "/DetailCode";
Query_PERGroup.dataBinding = XPathConstants.SEARCH_XPATH + "/PerGroup";
Query_PERCategory.dataBinding = XPathConstants.SEARCH_XPATH + "/PerCategory";
Query_AllowMultiples.dataBinding = XPathConstants.SEARCH_XPATH + "/AllowMultiples";
Query_OrderNumber.dataBinding = XPathConstants.SEARCH_XPATH + "/OrderNumber";
Query_Prompt.dataBinding = XPathConstants.SEARCH_XPATH + "/Prompt";

PERDetail_DetailCode.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/DetailCode";
PERDetail_PERGroup.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/PerGroup";
PERDetail_PERCategory.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/PerCategory";
PERDetail_AllowMultiples.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/AllowMultiples";
PERDetail_OrderNumber.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/OrderNumber";
PERDetail_Prompt.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/Prompt";
PERDetail_AmountAllowedEditable.dataBinding = XPathConstants.SELECTED_PERDETAIL_XPATH + "/AmountAllowedEditable";

/***************************** INPUT FIELDS ****************************************/

function Query_DetailCode () {};
Query_DetailCode.tabIndex = 1;
Query_DetailCode.maxLength = 10;
Query_DetailCode.helpText = "Unique PER detail code";
Query_DetailCode.isTemporary = function() { return true; }
Query_DetailCode.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_DetailCode.isReadOnly = isScreenInUpdateMode;

Query_DetailCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_DetailCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/***********************************************************************************/

function Query_PERGroup() {};
Query_PERGroup.tabIndex = 2;
Query_PERGroup.maxLength = 1;
Query_PERGroup.helpText = "PER group";
Query_PERGroup.isTemporary = function() { return true; }
Query_PERGroup.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_PERGroup.isReadOnly = isScreenInUpdateMode;
Query_PERGroup.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_PERGroup.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/***********************************************************************************/

function Query_PERCategory() {};
Query_PERCategory.tabIndex = 3;
Query_PERCategory.maxLength = 1;
Query_PERCategory.helpText = "PER category";
Query_PERCategory.isTemporary = function() { return true; }
Query_PERCategory.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_PERCategory.isReadOnly = isScreenInUpdateMode;
Query_PERCategory.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_PERCategory.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/***********************************************************************************/

function Query_AllowMultiples() {};
Query_AllowMultiples.tabIndex = 4;
Query_AllowMultiples.helpText = "Allow multiples flag";
Query_AllowMultiples.modelValue = {checked: "Y", unchecked: "N"};
Query_AllowMultiples.isTemporary = function() { return true; }
Query_AllowMultiples.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_AllowMultiples.isReadOnly = isScreenInUpdateMode;

/***********************************************************************************/

function Query_OrderNumber() {};
Query_OrderNumber.tabIndex = 5;
Query_OrderNumber.maxLength = 10;
Query_OrderNumber.helpText = "Order number";
Query_OrderNumber.isTemporary = function() { return true; }
Query_OrderNumber.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_OrderNumber.isReadOnly = isScreenInUpdateMode;

/***********************************************************************************/

function Query_Prompt() {};
Query_Prompt.tabIndex = 6;
Query_Prompt.maxLength = 60;
Query_Prompt.helpText = "PER detail prompt text";
Query_Prompt.isTemporary = function() { return true; }
Query_Prompt.readOnlyOn = [XPathConstants.FORM_STATE_XPATH]
Query_Prompt.isReadOnly = isScreenInUpdateMode;

/***********************************************************************************/

function PERDetail_DetailCode () {};
PERDetail_DetailCode.tabIndex = -1;
PERDetail_DetailCode.maxLength = 10;
PERDetail_DetailCode.helpText = "Unique PER detail code";
PERDetail_DetailCode.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_DetailCode.isReadOnly = function() { return true; }
PERDetail_DetailCode.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_DetailCode.isEnabled = isScreenInUpdateMode;

/***********************************************************************************/

function PERDetail_PERGroup() {};
PERDetail_PERGroup.tabIndex = 20;
PERDetail_PERGroup.maxLength = 1;
PERDetail_PERGroup.helpText = "PER group";
PERDetail_PERGroup.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_PERGroup.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_PERGroup.isEnabled = isScreenInUpdateMode;
PERDetail_PERGroup.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

PERDetail_PERGroup.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

PERDetail_PERGroup.logicOn = [PERDetail_PERGroup.dataBinding];
PERDetail_PERGroup.logic = function(event)
{
	if ( event.getXPath() != PERDetail_PERGroup.dataBinding )
	{
		return;
	}
	
	var group = Services.getValue(PERDetail_PERGroup.dataBinding);
	if ( !CaseManUtils.isBlank(group) )
	{
		// If the group has a value then set allow multiples to 'N'
		Services.setValue(PERDetail_AllowMultiples.dataBinding, "N");
	}
	
	// Set the dirty flag if the field is updated
	setDirtyFlag();
}

/***********************************************************************************/

function PERDetail_PERCategory() {};
PERDetail_PERCategory.tabIndex = -1;
PERDetail_PERCategory.maxLength = 1;
PERDetail_PERCategory.helpText = "PER category";
PERDetail_PERCategory.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_PERCategory.isReadOnly = function () { return true };
PERDetail_PERCategory.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_PERCategory.isEnabled = isScreenInUpdateMode;

/***********************************************************************************/

function PERDetail_AllowMultiples() {};
PERDetail_AllowMultiples.tabIndex = 21;
PERDetail_AllowMultiples.helpText = "Allow multiples flag";
PERDetail_AllowMultiples.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_AllowMultiples.modelValue = {checked: "Y", unchecked: "N"};
PERDetail_AllowMultiples.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_AllowMultiples.isEnabled = isScreenInUpdateMode;
PERDetail_AllowMultiples.readOnlyOn = [PERDetail_PERGroup.dataBinding, Master_PERDetailsGrid.dataBinding];
PERDetail_AllowMultiples.isReadOnly = function()
{
	var group = Services.getValue(PERDetail_PERGroup.dataBinding);
	return ( CaseManUtils.isBlank(group) ) ? false : true;
}

PERDetail_AllowMultiples.logicOn = [PERDetail_AllowMultiples.dataBinding];
PERDetail_AllowMultiples.logic = function(event)
{
	if ( event.getXPath() != PERDetail_AllowMultiples.dataBinding )
	{
		return;
	}
	
	// Set the dirty flag if the field is updated
	setDirtyFlag();
}

/***********************************************************************************/

function PERDetail_OrderNumber() {};
PERDetail_OrderNumber.tabIndex = -1;
PERDetail_OrderNumber.maxLength = 10;
PERDetail_OrderNumber.helpText = "Order number";
PERDetail_OrderNumber.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_OrderNumber.isReadOnly = function() { return true; }
PERDetail_OrderNumber.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_OrderNumber.isEnabled = isScreenInUpdateMode;

/***********************************************************************************/

function PERDetail_Prompt() {};
PERDetail_Prompt.tabIndex = 22;
PERDetail_Prompt.maxLength = 60;
PERDetail_Prompt.helpText = "PER detail prompt text";
PERDetail_Prompt.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_Prompt.isMandatory = function () { return true };
PERDetail_Prompt.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_Prompt.isEnabled = isScreenInUpdateMode;

PERDetail_Prompt.logicOn = [PERDetail_Prompt.dataBinding];
PERDetail_Prompt.logic = function(event)
{
	if ( event.getXPath() != PERDetail_Prompt.dataBinding )
	{
		return;
	}
	
	// Set the dirty flag if the field is updated
	setDirtyFlag();
}

PERDetail_Prompt.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

/***********************************************************************************/

function PERDetail_AmountAllowedEditable() {};
PERDetail_AmountAllowedEditable.tabIndex = -1;
PERDetail_AmountAllowedEditable.helpText = "Amount Allowed Editable flag";
PERDetail_AmountAllowedEditable.retrieveOn = [Master_PERDetailsGrid.dataBinding];
PERDetail_AmountAllowedEditable.modelValue = {checked: "Y", unchecked: "N"};
PERDetail_AmountAllowedEditable.isReadOnly = function() { return true; }
PERDetail_AmountAllowedEditable.enableOn = [XPathConstants.FORM_STATE_XPATH];
PERDetail_AmountAllowedEditable.isEnabled = isScreenInUpdateMode;

/******************************** BUTTONS ******************************************/

function Query_SearchButton() {};
Query_SearchButton.tabIndex = 8;
Query_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "maintainPerDetails" } ]
	}
};

Query_SearchButton.enableOn = [XPathConstants.FORM_STATE_XPATH, Query_DetailCode.dataBinding, Query_PERGroup.dataBinding, Query_PERCategory.dataBinding, Query_AllowMultiples.dataBinding, Query_OrderNumber.dataBinding, Query_Prompt.dataBinding];
Query_SearchButton.isEnabled = function()
{
	if ( isScreenInUpdateMode() )
	{
		// Disabled if the screen is in update mode
		return false;
	}

	var codeField = Services.getValue(Query_DetailCode.dataBinding);
	var groupField = Services.getValue(Query_PERGroup.dataBinding);
	var categoryField = Services.getValue(Query_PERCategory.dataBinding);
	var multiplesField = Services.getValue(Query_AllowMultiples.dataBinding);
	var orderField = Services.getValue(Query_OrderNumber.dataBinding);
	var promptField = Services.getValue(Query_Prompt.dataBinding);
	
	if ( CaseManUtils.isBlank(codeField) && CaseManUtils.isBlank(groupField) && CaseManUtils.isBlank(categoryField) &&
		 CaseManUtils.isBlank(multiplesField) && CaseManUtils.isBlank(orderField) && CaseManUtils.isBlank(promptField) )
	{
		// Disable button if no search criteria entered
		return false;
	}
	
	var codeObj = Services.getAdaptorById("Query_DetailCode");
	var groupObj = Services.getAdaptorById("Query_PERGroup");
	var categoryObj = Services.getAdaptorById("Query_PERCategory");
	var multiplesObj = Services.getAdaptorById("Query_AllowMultiples");
	var orderObj = Services.getAdaptorById("Query_OrderNumber");
	var promptObj = Services.getAdaptorById("Query_Prompt");
	
	if ( !codeObj.getValid() || !groupObj.getValid() || !categoryObj.getValid() ||
		 !multiplesObj.getValid() || !orderObj.getValid() || !promptObj.getValid() )
	{
		// At least one of the fields are invalid, disable button
		return false;
	}
	
	return true;
}

/**
 * @author qz8rkl
 * @return null 
 */
Query_SearchButton.actionBinding = function()
{
	if ( !Query_SearchButton.isEnabled() && !isScreenInUpdateMode() )
	{
		// Exit if the search button is not enabled and the screen is in query mode
		return;
	}
	
	var codeField = Services.getValue(Query_DetailCode.dataBinding);
	var groupField = Services.getValue(Query_PERGroup.dataBinding);
	var categoryField = Services.getValue(Query_PERCategory.dataBinding);
	var multiplesField = Services.getValue(Query_AllowMultiples.dataBinding);
	var orderField = Services.getValue(Query_OrderNumber.dataBinding);
	var promptField = Services.getValue(Query_Prompt.dataBinding);
	
	// Build and submit search query to service	
	var params = new ServiceParams();

	// It is permissable to submit "", which the service will ignore.
	// Any submitted 'like' search criteria must be surrounded by "%"
	var paramValue = CaseManUtils.isBlank(codeField) ? "" : "%" + codeField + "%";
	params.addSimpleParameter("code", paramValue);

	var paramValue = CaseManUtils.isBlank(groupField) ? "" : groupField;
	params.addSimpleParameter("group", paramValue);

	var paramValue = CaseManUtils.isBlank(categoryField) ? "" : categoryField;
	params.addSimpleParameter("category", paramValue);

	var paramValue = CaseManUtils.isBlank(multiplesField) ? "" : multiplesField;
	params.addSimpleParameter("multiples", paramValue);
	
	var paramValue = CaseManUtils.isBlank(orderField) ? "" : "%" + orderField + "%";
	params.addSimpleParameter("order", paramValue);
	
	var paramValue = CaseManUtils.isBlank(promptField) ? "" : "%" + promptField + "%";
	params.addSimpleParameter("prompt", paramValue);
	
	Services.callService("getPerDetailsFilter", params, Query_SearchButton, true);
};

/**
 * @param dom
 * @author qz8rkl
 * 
 */
Query_SearchButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.DATA_XPATH, dom);
	if ( Services.countNodes(XPathConstants.DATA_XPATH + "/PerDetail") == 0 )
	{
		// No results found in query
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setFocus("Query_DetailCode");
	}
	else
	{
		Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_MODIFY);
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "false");
	}
}

/***********************************************************************************/

function Query_AddPERDetailButton() {};
Query_AddPERDetailButton.tabIndex = 7;
Query_AddPERDetailButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Query_AddPERDetailButton.isEnabled = function()
{
	if ( !Services.hasAccessToForm(addNewPerDetail_subform.subformName) )
	{
		// Disabled if user does not have update access to the screen
		return false;
	}

	// Add button is only enabled if the screen is in query mode
	return isScreenInUpdateMode() ? false : true;
}

/***********************************************************************************/

function Status_SaveButton() {};
Status_SaveButton.tabIndex = 30;

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainPerDetails" } ]
	}
};

/**
 * @author qz8rkl
 * 
 */
Status_SaveButton.actionBinding = function()
{
	if ( isScreenInUpdateMode() && isDataDirty() )
	{
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if ( 0 == invalidFields.length )
		{
			var paramNode = XML.createDOM(null, null, null);
			var dataNode = Services.getNode(XPathConstants.DATA_XPATH);
			//paramNode.appendChild(dataNode);
			
			var strippedNode = RecordsProtocol.stripCleanRecords(dataNode, XPathConstants.DATA_XPATH);
			paramNode.appendChild(strippedNode);
			
			var params = new ServiceParams();
		    params.addDOMParameter("details",  paramNode);
		    Services.callService("updatePerDetail", params, Status_SaveButton, true);
	    }
    }
};

/**
 * @author qz8rkl
 * 
 */
Status_SaveButton.onSuccess = function()
{
	var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
	
	switch (tempAction)
	{
		case ActionAfterSave.ACTION_CLEARFORM:
			// User wishes to clear the form following a save
			clearFormData();
			break;
			
		case ActionAfterSave.ACTION_EXIT:
			// User wishes to exit the screen following a save
			exitScreen();
			break;
			
		default:
			// No actions, retrieve the search results again
			Query_SearchButton.actionBinding();
	}
}

/**
 * @param exception
 * @author qz8rkl
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/***********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 31;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "maintainPerDetails", alt: true } ]
	}
};

/**
 * @author qz8rkl
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

/***********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 32;

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainPerDetails" } ]
	}
};

/**
 * @author qz8rkl
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
}
