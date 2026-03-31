/** 
 * @fileoverview ChangeCaseType_SubForm.js:
 * This file contains the configurations for the Change Court Name Subform
 *
 * @author Chris Vincent
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.DATA_XPATH  = "/ds/Court";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/SubForms/ChangeCourtName/Court";

/*************************** HELPER FUNCTIONS **************************************/

/**
 * @author rzxd7g
 * 
 */
function handleSubformAuthorisationException()
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	Services.dispatchEvent("changeCourtNameSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/************************** FORM CONFIGURATIONS *************************************/

function changeCourtNameSubform() {}

changeCourtNameSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "UpdateCourtDOM.xml",
	dataBinding: "/ds"
}

changeCourtNameSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "UpdateCourtDOM.xml",
	dataBinding: "/ds"
}

changeCourtNameSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "ChangeCourtName_OkButton"} ],
                    doubleClicks: []
                  },

    modify: {},

	returnSourceNodes: [XPathConstants.DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

changeCourtNameSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "changeCourtNameSubform" } ],
					singleClicks: [ {element: "ChangeCourtName_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

ChangeCourtName_CurrentName.dataBinding = XPathConstants.FORM_DATA_XPATH + "/CurrentName"
ChangeCourtName_NewName.dataBinding = XPathConstants.DATA_XPATH + "/NewName";

/******************************* INPUT FIELDS **************************************/

function ChangeCourtName_CurrentName() {}
ChangeCourtName_CurrentName.tabIndex = -1;
ChangeCourtName_CurrentName.maxLength = 30;
ChangeCourtName_CurrentName.helpText = "Current court name";
ChangeCourtName_CurrentName.isTemporary = function() { return true; }
ChangeCourtName_CurrentName.isReadOnly = function() { return true; }

/*********************************************************************************/

function ChangeCourtName_NewName() {}
ChangeCourtName_NewName.tabIndex = 1;
ChangeCourtName_NewName.maxLength = 30;
ChangeCourtName_NewName.helpText = "New court name";
ChangeCourtName_NewName.isMandatory = function() { return true; }
ChangeCourtName_NewName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

ChangeCourtName_NewName.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

ChangeCourtName_NewName.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(ChangeCourtName_NewName.dataBinding);
	if ( !CaseManUtils.isBlank(courtName) )
	{
		var originalName = Services.getValue(ChangeCourtName_CurrentName.dataBinding);
		if ( courtName == originalName )
		{
			// New value entered is identical to the orginal
			ec = ErrorCode.getErrorCode("CaseMan_courtNameSameAsOriginal_Msg");
		}
		else if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + ChangeCourtName_NewName.dataBinding + "]") )
		{
			// The court name entered already exists
			ec = ErrorCode.getErrorCode("CaseMan_courtNameAlreadyExists_Msg");
		}
	}
	return ec;
}

/****************************** BUTTON FIELDS **************************************/

function ChangeCourtName_OkButton() {}
ChangeCourtName_OkButton.tabIndex = 3;

/**********************************************************************************/

function ChangeCourtName_CancelButton() {}
ChangeCourtName_CancelButton.tabIndex = 4;