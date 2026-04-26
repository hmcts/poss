/** 
 * @fileoverview ObsoleteCaseType_SubForm.js:
 * This file contains the configurations for the Obsolete Case Type Subform
 *
 * @author Chris Vincent
 *
 *
 * LOADING SUBFORM:
 * Service to be called is getObsoleteCaseTypeAlternativeList which requires a Case Number (param: caseNumber)
 * DOM returned is:
 *	<Case>
 *		<CaseNumber>${C.CASE_NUMBER}</CaseNumber>
 *		<CaseType>${C.CASE_TYPE}</CaseType>
 *		<CaseTypeList>
 *			<CaseType>
 *				<Type>${REF.RV_LOW_VALUE}</Type>
 *	    		<Description>${REF.RV_MEANING}</Description>	
 *			</CaseType>
 *		</CaseTypeList>
 *	</Case>
 *
 * SUBMITTING SUBFORM:
 * Service to be called is mUpdateCaseType which requires a DOM parameter (param: caseNumber)
 * DOM schema is:
 * <Case>
 * 		<SCN .... >
 * 		<CaseNumber/>
 * 		<CaseType/>
 * 		<Status/>
 * </Case>
 *
 * The SCN Number(s) need to be passed from the main form to the subform on loading (see updateCaseType() 
 * in ManageEvents.js for more details.
 *
 * When return to the main form, the main form needs to be refreshed again.  There is no cancel button -
 * only a submit button.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Case";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/SubForms/ObsoleteCaseType/Case";

/*************************** HELPER FUNCTIONS **************************************/

/**
 * @author rzxd7g
 * 
 */
function handleSubformAuthorisationException()
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	Services.dispatchEvent("obsoleteCaseTypeSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/************************** FORM CONFIGURATIONS *************************************/

function obsoleteCaseTypeSubform() {}

obsoleteCaseTypeSubform.loadExisting = 
{
	name: "formLoadExisting",
	serviceName: "getObsoleteCaseTypeAlternativeList",
	serviceParams: [ { name: "caseNumber", value: XPathConstants.FORM_DATA_XPATH + "/CaseNumber"} ],
	dataBinding: "/ds",
    errorHandler: {
    	onAuthorizationException: handleSubformAuthorisationException
    }
}

obsoleteCaseTypeSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	serviceName: "getObsoleteCaseTypeAlternativeList",
	serviceParams: [ { name: "caseNumber", value: XPathConstants.FORM_DATA_XPATH + "/CaseNumber"} ],
	dataBinding: "/ds",
    errorHandler: {
    	onAuthorizationException: handleSubformAuthorisationException
    }
}

obsoleteCaseTypeSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "ObsoleteCaseType_CloseButton"} ],
                    doubleClicks: []
                  },

/**
 * @author rzxd7g
 * 
 */
	preprocess: function()
				{
					// update the New Case Type node under form with the case type selected
					var newCaseType = Services.getValue(ObsoleteCaseType_NewCaseType.dataBinding);
					Services.setValue(XPathConstants.FORM_DATA_XPATH + "/CaseType", newCaseType);
				},

    modify: {
    	name:  "mUpdateCaseType",
        params: [ {name: "caseNumber", node: XPathConstants.FORM_DATA_XPATH } ],
	    errorHandler: {
	    	onAuthorizationException: handleSubformAuthorisationException
	    }
	},

	returnSourceNodes: [XPathConstants.FORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

/******************************* LOV POPUPS ****************************************/

function ObsoleteCaseType_NewCaseTypeLOVGrid() {};

ObsoleteCaseType_NewCaseTypeLOVGrid.dataBinding = XPathConstants.DATA_XPATH + "/NewCaseType";
ObsoleteCaseType_NewCaseTypeLOVGrid.srcData = XPathConstants.DATA_XPATH + "/CaseTypeList";
ObsoleteCaseType_NewCaseTypeLOVGrid.rowXPath = "CaseType";
ObsoleteCaseType_NewCaseTypeLOVGrid.keyXPath = "Type";
ObsoleteCaseType_NewCaseTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];

ObsoleteCaseType_NewCaseTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "ObsoleteCaseType_NewCaseTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "ObsoleteCaseType_NewCaseType" } ]
	}
};

/**
 * @author rzxd7g
 * @return "ObsoleteCaseType_NewCaseType"  
 */
ObsoleteCaseType_NewCaseTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "ObsoleteCaseType_NewCaseType";
}

/****************************** DATA BINDINGS **************************************/

ObsoleteCaseType_OldCaseType.dataBinding = XPathConstants.DATA_XPATH + "/CaseType";
ObsoleteCaseType_NewCaseType.dataBinding = XPathConstants.DATA_XPATH + "/NewCaseType";

/******************************* INPUT FIELDS **************************************/

function ObsoleteCaseType_OldCaseType() {}

ObsoleteCaseType_OldCaseType.tabIndex = -1;
ObsoleteCaseType_OldCaseType.maxLength = 30;
ObsoleteCaseType_OldCaseType.helpText = "Current case type";

ObsoleteCaseType_OldCaseType.isTemporary = function()
{
	return true;
}

ObsoleteCaseType_OldCaseType.isReadOnly = function()
{
	return true;
}

/*********************************************************************************/

function ObsoleteCaseType_NewCaseType() {}

ObsoleteCaseType_NewCaseType.srcData = XPathConstants.DATA_XPATH + "/CaseTypeList";
ObsoleteCaseType_NewCaseType.rowXPath = "CaseType";
ObsoleteCaseType_NewCaseType.keyXPath = "Type";
ObsoleteCaseType_NewCaseType.displayXPath = "Type";
ObsoleteCaseType_NewCaseType.strictValidation = true;

ObsoleteCaseType_NewCaseType.tabIndex = 1;
ObsoleteCaseType_NewCaseType.helpText = "New case type";

ObsoleteCaseType_NewCaseType.isMandatory = function()
{
	return true;
}

ObsoleteCaseType_NewCaseType.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

ObsoleteCaseType_NewCaseType.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/****************************** BUTTON FIELDS **************************************/

function ObsoleteCaseType_NewCaseTypeLOVButton() {}

ObsoleteCaseType_NewCaseTypeLOVButton.tabIndex = 2;

/**********************************************************************************/

function ObsoleteCaseType_CloseButton() {}

ObsoleteCaseType_CloseButton.tabIndex = 3;
