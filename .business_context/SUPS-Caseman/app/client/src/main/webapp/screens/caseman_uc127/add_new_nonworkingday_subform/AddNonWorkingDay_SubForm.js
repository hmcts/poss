/** 
 * @fileoverview AddNonWorkingDay_SubForm.js:
 * This file contains the configurations for the Add New Non Working Day Subform
 *
 * @author Chris Vincent
 *
 * Changes:
 * 07/06/2006 - Chris Vincent, changed global variables to static variables.
 * 14/06/2006 - Chris Vincent, changed the transform to model of the item field to remove trailing
 *				and leading whitespace.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.SUBFORM_DATA_XPATH = "/ds/NonWorkingDay";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";

/************************** FORM CONFIGURATIONS *************************************/

function addNonWorkingDaySubform() {}

addNonWorkingDaySubform.loadNew = 
{
	name: "formLoadNew",
	fileName: "NewNonWorkingDay.xml",
	dataBinding: "/ds"
}

addNonWorkingDaySubform.createLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "NewNonWorkingDay.xml",
	dataBinding: "/ds"
}

addNonWorkingDaySubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddNonWorkingDayPopup_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},
	
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

addNonWorkingDaySubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addNonWorkingDaySubform" } ],
					singleClicks: [ {element: "AddNonWorkingDayPopup_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

AddNonWorkingDayPopup_Date.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Date";
AddNonWorkingDayPopup_Notes.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Notes";

/******************************* INPUT FIELDS **************************************/

function AddNonWorkingDayPopup_Date() {}
AddNonWorkingDayPopup_Date.tabIndex = 1;
AddNonWorkingDayPopup_Date.helpText = "Enter a non working date";
AddNonWorkingDayPopup_Date.isMandatory = function() { return true; }
AddNonWorkingDayPopup_Date.weekends = false;
AddNonWorkingDayPopup_Date.validate = function() 
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		var xpath = XPathConstants.VAR_FORM_XPATH + "/NonWorkingDays/NonWorkingDay[./Date=" + AddNonWorkingDayPopup_Date.dataBinding + " and ./ErrorIndicator = 'N']";
		if( Services.exists(xpath) ) 
		{
			ec = ErrorCode.getErrorCode("CaseMan_nonWorkingDayAlreadyExists_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function AddNonWorkingDayPopup_Notes() {}
AddNonWorkingDayPopup_Notes.tabIndex = 2;
AddNonWorkingDayPopup_Notes.maxLength = 30;
AddNonWorkingDayPopup_Notes.helpText = "Non working date notes";
AddNonWorkingDayPopup_Notes.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddNonWorkingDayPopup_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/****************************** BUTTON FIELDS **************************************/

function AddNonWorkingDayPopup_OkButton() {}
AddNonWorkingDayPopup_OkButton.tabIndex = 10;

/**********************************************************************************/

function AddNonWorkingDayPopup_CancelButton() {}
AddNonWorkingDayPopup_CancelButton.tabIndex = 11;
