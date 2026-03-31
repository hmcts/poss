/** 
 * @fileoverview AddNonPerDetail_SubForm.js:
 * This file contains the configurations for the Add New PER Detail Subform
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the text fields without special validation.
 * 15/06/2006 - Chris Vincent, changed global variables to static variables.
 * 04/09/2006 - Paul Roberts, changed AddNewPerDetailPopup_DetailCode.validate to cope with apostrophes in code.
 * 07/09/2006 - Chris Vincent, moved the getPerDetailCodeList service call from the 
 * 				refDataServices config to the initialise to ensure it is always called 
 * 				when enter the subform.  Defect 5166.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.SUBFORM_DATA_XPATH = "/ds/PerDetail";

/************************** HELPER FUNCTIONS ***************************************/

/**
 * Indicates whether or not the new PER fields should be enabled.  The rule
 * being the fields should be disabled if the PER Code field is blank or invalid.
 *
 * @return boolean True if the PER fields should be enabled, else false
 * @author rzxd7g
 */
function newPerFieldsEnabled()
{
	var adaptor = Services.getAdaptorById("AddNewPerDetailPopup_DetailCode");
	var value = Services.getValue(AddNewPerDetailPopup_DetailCode.dataBinding);
	
	if ( CaseManUtils.isBlank(value) || !adaptor.getValid() )
	{
		return false;
	}
	return true;
}

/************************** FORM CONFIGURATIONS *************************************/

function addNewPerDetailSubform() {}
/**
 * @author rzxd7g
 * 
 */
addNewPerDetailSubform.initialise = function()
{
	// Call the reference data service here rather than in the refData config for the subform
	// This is because if add a new PER record twice in the same session, the refData isn't 
	// called twice, only the first time the subform is raised.  Setting destoryOnClose did
	// nothing.
	var params = new ServiceParams();
	Services.callService("getPerDetailCodeList", params, addNewPerDetailSubform, true);
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
addNewPerDetailSubform.onSuccess = function(dom)
{
	Services.replaceNode("/ds/var/form/PerDetailCodes", dom);
}

addNewPerDetailSubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "NewPerRecord.xml",
	dataBinding: "/ds"
}

addNewPerDetailSubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "NewPerRecord.xml",
	dataBinding: "/ds"
}

addNewPerDetailSubform.submitLifeCycle = 
{
	eventBinding: { keys: [ { key: Key.F3, element: "addNewPerDetailSubform" } ],
                    singleClicks: [ { element: "AddNewPerDetailPopup_SaveButton"} ],
                    doubleClicks: []
                  },

	create: {},
	
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

addNewPerDetailSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addNewPerDetailSubform" } ],
					singleClicks: [ {element: "AddNewPerDetailPopup_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

AddNewPerDetailPopup_DetailCode.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/DetailCode";
AddNewPerDetailPopup_PERGroup.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/PerGroup";
AddNewPerDetailPopup_AllowMultiples.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/AllowMultiples"
AddNewPerDetailPopup_Prompt.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Prompt"
AddNewPerDetailPopup_AmountAllowedEditable.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/AmountAllowedEditable"

/******************************* INPUT FIELDS **************************************/

function AddNewPerDetailPopup_DetailCode() {}
AddNewPerDetailPopup_DetailCode.tabIndex = 1;
AddNewPerDetailPopup_DetailCode.maxLength = 10;
AddNewPerDetailPopup_DetailCode.helpText = "Unique PER detail code";
AddNewPerDetailPopup_DetailCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewPerDetailPopup_DetailCode.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

AddNewPerDetailPopup_DetailCode.isMandatory = function() { return true; }

AddNewPerDetailPopup_DetailCode.validate = function()
{
	var ec = null;
	var perDetailCode = Services.getValue(AddNewPerDetailPopup_DetailCode.dataBinding)
	if ( !CaseManUtils.isBlank(perDetailCode) )
	{
		var perExists = Services.exists("/ds/var/form/PerDetailCodes/PerDetailCode[./Code = " + AddNewPerDetailPopup_DetailCode.dataBinding + "]");
		if ( perExists )
		{
			// The PER Detail Code entered already exists
			ec =  ErrorCode.getErrorCode("CaseMan_perDetailCodeAlreadyExists_Msg");
		}
	}
	return ec;
}

AddNewPerDetailPopup_DetailCode.logicOn = [AddNewPerDetailPopup_DetailCode.dataBinding];
AddNewPerDetailPopup_DetailCode.logic = function(event)
{
	if ( event.getXPath() != AddNewPerDetailPopup_DetailCode.dataBinding )
	{
		return;
	}
	
	var fieldValue = Services.getValue(AddNewPerDetailPopup_DetailCode.dataBinding);
	if ( CaseManUtils.isBlank(fieldValue) || !this.getValid() )
	{
		Services.startTransaction();
		Services.setValue(AddNewPerDetailPopup_PERGroup.dataBinding, "");
		Services.setValue(AddNewPerDetailPopup_AllowMultiples.dataBinding, "N");
		Services.setValue(AddNewPerDetailPopup_Prompt.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function AddNewPerDetailPopup_PERGroup() {}
AddNewPerDetailPopup_PERGroup.tabIndex = 2;
AddNewPerDetailPopup_PERGroup.maxLength = 1;
AddNewPerDetailPopup_PERGroup.helpText = "PER group";
AddNewPerDetailPopup_PERGroup.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewPerDetailPopup_PERGroup.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNewPerDetailPopup_PERGroup.enableOn = [AddNewPerDetailPopup_DetailCode.dataBinding];
AddNewPerDetailPopup_PERGroup.isEnabled = newPerFieldsEnabled;

AddNewPerDetailPopup_PERGroup.logicOn = [AddNewPerDetailPopup_PERGroup.dataBinding];
AddNewPerDetailPopup_PERGroup.logic = function(event)
{
	if ( event.getXPath() != AddNewPerDetailPopup_PERGroup.dataBinding )
	{
		return;
	}
	
	var group = Services.getValue(AddNewPerDetailPopup_PERGroup.dataBinding);
	if ( !CaseManUtils.isBlank(group) )
	{
		// If the group has a value then set allow multiples to 'N'
		Services.setValue(AddNewPerDetailPopup_AllowMultiples.dataBinding, "N");
	}
}

/*********************************************************************************/

function AddNewPerDetailPopup_AllowMultiples() {}
AddNewPerDetailPopup_AllowMultiples.tabIndex = 3;
AddNewPerDetailPopup_AllowMultiples.helpText = "Allow multiples flag";
AddNewPerDetailPopup_AllowMultiples.modelValue = {checked: "Y", unchecked: "N"};
AddNewPerDetailPopup_AllowMultiples.enableOn = [AddNewPerDetailPopup_DetailCode.dataBinding];
AddNewPerDetailPopup_AllowMultiples.isEnabled = newPerFieldsEnabled;
AddNewPerDetailPopup_AllowMultiples.readOnlyOn = [AddNewPerDetailPopup_PERGroup.dataBinding];
AddNewPerDetailPopup_AllowMultiples.isReadOnly = function()
{
	var group = Services.getValue(AddNewPerDetailPopup_PERGroup.dataBinding);
	return ( CaseManUtils.isBlank(group) ) ? false : true;
}

/*********************************************************************************/

function AddNewPerDetailPopup_Prompt() {}
AddNewPerDetailPopup_Prompt.tabIndex = 4;
AddNewPerDetailPopup_Prompt.maxLength = 60;
AddNewPerDetailPopup_Prompt.helpText = "PER detail prompt text";
AddNewPerDetailPopup_Prompt.isMandatory = function() { return true; }
AddNewPerDetailPopup_Prompt.enableOn = [AddNewPerDetailPopup_DetailCode.dataBinding];
AddNewPerDetailPopup_Prompt.isEnabled = newPerFieldsEnabled;
AddNewPerDetailPopup_Prompt.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

/*********************************************************************************/

function AddNewPerDetailPopup_AmountAllowedEditable() {}
AddNewPerDetailPopup_AmountAllowedEditable.tabIndex = 5;
AddNewPerDetailPopup_AmountAllowedEditable.helpText = "Amount Allowed Editable";
AddNewPerDetailPopup_AmountAllowedEditable.modelValue = {checked: "Y", unchecked: "N"};
AddNewPerDetailPopup_AmountAllowedEditable.enableOn = [AddNewPerDetailPopup_DetailCode.dataBinding];
AddNewPerDetailPopup_AmountAllowedEditable.isEnabled = newPerFieldsEnabled;

/****************************** BUTTON FIELDS **************************************/

function AddNewPerDetailPopup_SaveButton() {}
AddNewPerDetailPopup_SaveButton.tabIndex = 10;

/**********************************************************************************/

function AddNewPerDetailPopup_CancelButton() {}
AddNewPerDetailPopup_CancelButton.tabIndex = 11;
