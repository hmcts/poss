/** 
 * @fileoverview MaintainSystemData_SubForm.js:
 * This file contains the configurations for the Maintain System Data Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed the transform to model of the item field to remove trailing
 *				and leading whitespace.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 */

/************************** FORM CONFIGURATIONS *************************************/

function maintainSystemDataSubform() {}

/**
 * @author rzxd7g
 * 
 */
maintainSystemDataSubform.initialise = function()
{
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	if ( mode == FormStates.MODE_MODIFY )
	{
		// Modify mode, copy the node to the data xpath
		var dataNode = Services.getNode(XPathConstants.SUBFORM_NODE_XPATH);
		Services.replaceNode(XPathConstants.SUBFORM_DATA_XPATH, dataNode);

		var currency = Services.getValue(MaintainSystemDataSubform_ItemCurrency.dataBinding);
		var type = Services.getValue(XPathConstants.SUBFORM_TYPE_XPATH);
		if ( !CaseManUtils.isBlank(currency) || type == SystemDataTypes.TYPE_PER )
		{
			// Per System Data is always an amount or amount already has a currency
			Services.setValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding, "Y");
		}
	}
	else if ( mode == FormStates.MODE_CREATE )
	{
		// Create mode, set the court code
		var courtCode = Services.getValue(XPathConstants.SUBFORM_COURT_XPATH);
		Services.setValue(XPathConstants.SUBFORM_DATA_XPATH + "/AdminCourtCode", courtCode);
	}
}

maintainSystemDataSubform.startupState = 
{
/**
 * @author rzxd7g
 * @return ( mode == FormStates.MODE_CREATE ) ? "create", "modify"  
 */
	mode: 	function()
		  	{
		  		var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
		  		return ( mode == FormStates.MODE_CREATE ) ? "create" : "modify";
		  	}
}

maintainSystemDataSubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "SystemDataDOM.xml",
	dataBinding: "/ds"
}

maintainSystemDataSubform.loadExisting = 
{
	name: "formLoadNew",
	fileName: "SystemDataDOM.xml",
	dataBinding: "/ds"
}

maintainSystemDataSubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "SystemDataDOM.xml",
	dataBinding: "/ds"
}

maintainSystemDataSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "SystemDataDOM.xml",
	dataBinding: "/ds"
}

maintainSystemDataSubform.submitLifeCycle = 
{
	eventBinding: { keys: [ { key: Key.F3, element: "maintainSystemDataSubform" } ],
                    singleClicks: [ { element: "MaintainSystemDataSubform_SaveButton"} ],
                    doubleClicks: []
                  },

	create: {},
	
	modify: {},
	
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

maintainSystemDataSubform.cancelLifeCycle = {
	eventBinding: {	keys: [ { key: Key.F4, element: "maintainSystemDataSubform" } ],
					singleClicks: [ { element: "MaintainSystemDataSubform_CancelButton" } ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

MaintainSystemDataSubform_Item.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Item";
MaintainSystemDataSubform_IsAmountFlag.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/IsAmount";
MaintainSystemDataSubform_ItemCurrency.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ItemValueCurrency";
MaintainSystemDataSubform_ItemValue.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/ItemValue";

/******************************* INPUT FIELDS **************************************/

function MaintainSystemDataSubform_Item() {}
MaintainSystemDataSubform_Item.tabIndex = 1;
MaintainSystemDataSubform_Item.maxLength = 30;
MaintainSystemDataSubform_Item.helpText = "Unique item code";
MaintainSystemDataSubform_Item.readOnlyOn = [XPathConstants.SUBFORM_MODE_XPATH];
MaintainSystemDataSubform_Item.isReadOnly = function()
{
	// Read Only if updating a System Data item
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	return ( mode == FormStates.MODE_MODIFY ) ? true : false;
}

MaintainSystemDataSubform_Item.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

MaintainSystemDataSubform_Item.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

MaintainSystemDataSubform_Item.isMandatory = function() { return true; }

MaintainSystemDataSubform_Item.validateOn = [XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH]
MaintainSystemDataSubform_Item.validate = function()
{
	var ec = null;
	var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
	var itemValue = Services.getValue(MaintainSystemDataSubform_Item.dataBinding);
	
	if ( mode == FormStates.MODE_CREATE && !CaseManUtils.isBlank(itemValue) )
	{
		// Only validate if in create mode and value is not blank
		var itemExists = Services.getValue(XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH);
		if ( itemExists == "true" )
		{
			// The Item entered already exists
			ec =  ErrorCode.getErrorCode("CaseMan_systemDataItemAlreadyExists_Msg");
		}
	}
	
	return ec;
}

MaintainSystemDataSubform_Item.logicOn = [MaintainSystemDataSubform_Item.dataBinding, XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH];
MaintainSystemDataSubform_Item.logic = function(event)
{
	var itemValue = Services.getValue(MaintainSystemDataSubform_Item.dataBinding);
	var xp = event.getXPath();
	if ( xp == XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH )
	{
		if ( CaseManUtils.isBlank(itemValue) || !this.getValid() )
		{
			// Blank or invalid value entered, clear other details
			Services.startTransaction();
			Services.setValue(MaintainSystemDataSubform_ItemValue.dataBinding, "");
			Services.setValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding, "N");
			Services.setValue(MaintainSystemDataSubform_ItemCurrency.dataBinding, "");
			Services.endTransaction();
		}
	}
	
	if ( xp == MaintainSystemDataSubform_Item.dataBinding )
	{
		var mode = Services.getValue(XPathConstants.SUBFORM_MODE_XPATH);
		var type = Services.getValue(XPathConstants.SUBFORM_TYPE_XPATH);
		if ( mode == FormStates.MODE_CREATE && !CaseManUtils.isBlank(itemValue) )
		{
			// Create Mode, item value entered for a global item - check if item already exists
			var params = new ServiceParams();
			params.addSimpleParameter("item", itemValue);
			Services.callService("checkSystemDataItemExists", params, MaintainSystemDataSubform_Item, true);
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
MaintainSystemDataSubform_Item.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.VAR_PAGE_XPATH + "/Subform/SystemDataCheck", dom);
	
	var type = Services.getValue(XPathConstants.SUBFORM_TYPE_XPATH);
	var itemValue = Services.getValue(MaintainSystemDataSubform_Item.dataBinding);
	if ( type == SystemDataTypes.TYPE_COURT )
	{
		// Court specific data item
		var court = Services.getValue(XPathConstants.SUBFORM_COURT_XPATH);
		var xp = XPathConstants.VAR_PAGE_XPATH + "/Subform/SystemDataCheck/SystemDataItem[(./AdminCourtCode = '" + court + "' and ./Item = " + MaintainSystemDataSubform_Item.dataBinding + ") or (./AdminCourtCode = '0' and ./Item = " + MaintainSystemDataSubform_Item.dataBinding + ")]";
	}
	else
	{
		// Global data item
		var xp = XPathConstants.VAR_PAGE_XPATH + "/Subform/SystemDataCheck/SystemDataItem[./Item = " + MaintainSystemDataSubform_Item.dataBinding + "]";
	}
	
	if ( Services.countNodes(xp) != 0 )
	{
		Services.setValue(XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH, "true");
		Services.setFocus("MaintainSystemDataSubform_Item");
	}
	else
	{
		Services.setValue(XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH, "");
		Services.setFocus("MaintainSystemDataSubform_IsAmountFlag");
	}
}

/*********************************************************************************/

function MaintainSystemDataSubform_IsAmountFlag() {}
MaintainSystemDataSubform_IsAmountFlag.tabIndex = 2;
MaintainSystemDataSubform_IsAmountFlag.helpText = "Is amount flag";
MaintainSystemDataSubform_IsAmountFlag.modelValue = {checked: "Y", unchecked: "N"};
MaintainSystemDataSubform_IsAmountFlag.isTemporary = function() { return true; }
MaintainSystemDataSubform_IsAmountFlag.enableOn = [MaintainSystemDataSubform_Item.dataBinding, XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH];
MaintainSystemDataSubform_IsAmountFlag.isEnabled = enableSubformFields;
MaintainSystemDataSubform_IsAmountFlag.readOnlyOn = [XPathConstants.SUBFORM_TYPE_XPATH];
MaintainSystemDataSubform_IsAmountFlag.isReadOnly = function()
{
	// Read only for PER System Data as it must be an amount
	var type = Services.getValue(XPathConstants.SUBFORM_TYPE_XPATH);
	return ( type == SystemDataTypes.TYPE_PER ) ? true : false;
}

MaintainSystemDataSubform_IsAmountFlag.logicOn = [MaintainSystemDataSubform_IsAmountFlag.dataBinding];
MaintainSystemDataSubform_IsAmountFlag.logic = function(event)
{
	if ( event.getXPath() != MaintainSystemDataSubform_IsAmountFlag.dataBinding )
	{
		return;
	}
	
	var isAmount = Services.getValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding);
	if ( isAmount == "Y" )
	{
		var currency = Services.getValue(MaintainSystemDataSubform_ItemCurrency.dataBinding);
		if ( CaseManUtils.isBlank(currency) )
		{
			// Currency is not already populated so give it the default currency
			var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
			Services.setValue(MaintainSystemDataSubform_ItemCurrency.dataBinding, defaultCurrency);
		}
	}
	else
	{
		// Not a currency field, blank out the currency field
		Services.setValue(MaintainSystemDataSubform_ItemCurrency.dataBinding, "");
	}
}

/*********************************************************************************/

function MaintainSystemDataSubform_ItemCurrency() {}
MaintainSystemDataSubform_ItemCurrency.retrieveOn = [MaintainSystemDataSubform_IsAmountFlag.dataBinding];
MaintainSystemDataSubform_ItemCurrency.tabIndex = -1;
MaintainSystemDataSubform_ItemCurrency.maxLength = 3;
MaintainSystemDataSubform_ItemCurrency.helpText = "Item currency";
MaintainSystemDataSubform_ItemCurrency.isReadOnly = function() { return true; }
MaintainSystemDataSubform_ItemCurrency.enableOn = [MaintainSystemDataSubform_Item.dataBinding, MaintainSystemDataSubform_IsAmountFlag.dataBinding];
MaintainSystemDataSubform_ItemCurrency.isEnabled = function()
{
	if ( !enableSubformFields() )
	{
		return false;
	}

	var isAmount = Services.getValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding);
	return ( isAmount == "Y" ) ? true : false;
}

MaintainSystemDataSubform_ItemCurrency.transformToDisplay = function(value)
{
	var isAmount = Services.getValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding);
	if ( isAmount == "Y" )
	{
		return transformCurrencyToDisplay(value);
	}
	return "";
}

/*********************************************************************************/

function MaintainSystemDataSubform_ItemValue() {}
MaintainSystemDataSubform_ItemValue.retrieveOn = [MaintainSystemDataSubform_IsAmountFlag.dataBinding];
MaintainSystemDataSubform_ItemValue.tabIndex = 3;
MaintainSystemDataSubform_ItemValue.maxLength = 38;
MaintainSystemDataSubform_ItemValue.helpText = "Item value";
MaintainSystemDataSubform_ItemValue.enableOn = [MaintainSystemDataSubform_Item.dataBinding, XPathConstants.SUBFORM_ITEM_RETRIEVED_XPATH];
MaintainSystemDataSubform_ItemValue.isEnabled = enableSubformFields;
MaintainSystemDataSubform_ItemValue.validate = function()
{
	var ec = null;
	var itemValue = Services.getValue(MaintainSystemDataSubform_ItemValue.dataBinding);
	if ( !CaseManUtils.isBlank(itemValue) )
	{
		if ( !CaseManValidationHelper.validateNumber(itemValue) && !CaseManValidationHelper.validateFloatNumber(itemValue) )
		{
			// Item value must be a number
			ec = ErrorCode.getErrorCode("CaseMan_nonNumericValueEntered_Msg");
		}
	}
	return ec;
}

MaintainSystemDataSubform_ItemValue.transformToDisplay = function(value)
{
	var isAmount = Services.getValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding);
	if ( isAmount == "Y" )
	{
		return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
	}
	return value
}

MaintainSystemDataSubform_ItemValue.transformToModel = function(value)
{
	var isAmount = Services.getValue(MaintainSystemDataSubform_IsAmountFlag.dataBinding);
	if ( isAmount == "Y" )
	{
		return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
	}
	return value
}

/****************************** BUTTON FIELDS **************************************/

function MaintainSystemDataSubform_SaveButton() {}
MaintainSystemDataSubform_SaveButton.tabIndex = 10;

/**********************************************************************************/

function MaintainSystemDataSubform_CancelButton() {}
MaintainSystemDataSubform_CancelButton.tabIndex = 11;
