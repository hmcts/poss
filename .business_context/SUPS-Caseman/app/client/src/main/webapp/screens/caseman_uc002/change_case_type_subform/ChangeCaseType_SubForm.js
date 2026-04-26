/** 
 * @fileoverview ChangeCaseType_SubForm.js:
 * This file contains the configurations for the Change Case Type Subform
 *
 * @author Chris Vincent
 *
 *
 * LOADING SUBFORM:
 * Service to be called is getCurrentCaseTypeAlternativeList which requires a Case Number (param: caseNumber)
 * DOM returned is:
 *	<Case>
 *		<CaseNumber>${C.CASE_NUMBER}</CaseNumber>
 *		<CaseType>${C.CASE_TYPE}</CaseType>
 *		<CaseTypeGrouping>${CREF.RV_HIGH_VALUE}</CaseTypeGrouping>
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
 * When return to the main form, the main form needs to be refreshed again.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/Case";
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/SubForms/ChangeCaseType/Case";

/*************************** HELPER FUNCTIONS **************************************/

/**
 * @author rzxd7g
 * 
 */
function handleSubformAuthorisationException()
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	Services.dispatchEvent("changeCaseTypeSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/************************** FORM CONFIGURATIONS *************************************/

function changeCaseTypeSubform() {}

changeCaseTypeSubform.loadExisting = 
{
	name: "formLoadExisting",
	serviceName: "getCurrentCaseTypeAlternativeList",
	serviceParams: [ { name: "caseNumber", value: XPathConstants.FORM_DATA_XPATH + "/CaseNumber"} ],
	dataBinding: "/ds",
    errorHandler: {
    	onAuthorizationException: handleSubformAuthorisationException
    }
}

changeCaseTypeSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	serviceName: "getCurrentCaseTypeAlternativeList",
	serviceParams: [ { name: "caseNumber", value: XPathConstants.FORM_DATA_XPATH + "/CaseNumber"} ],
	dataBinding: "/ds",
    errorHandler: {
    	onAuthorizationException: handleSubformAuthorisationException
    }
}

changeCaseTypeSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "ChangeCaseType_OkButton"} ],
                    doubleClicks: []
                  },

/**
 * @author rzxd7g
 * 
 */
	preprocess: function()
				{
					// update the New Case Type node under form with the case type selected
					var newCaseType = Services.getValue(ChangeCaseType_NewCaseType.dataBinding);
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

changeCaseTypeSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "changeCaseTypeSubform" } ],
					singleClicks: [ {element: "ChangeCaseType_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/******************************* LOV POPUPS ****************************************/

function ChangeCaseType_NewCaseTypeLOVGrid() {};
ChangeCaseType_NewCaseTypeLOVGrid.dataBinding = XPathConstants.DATA_XPATH + "/NewCaseType";
ChangeCaseType_NewCaseTypeLOVGrid.srcData = XPathConstants.DATA_XPATH + "/CaseTypeList";
ChangeCaseType_NewCaseTypeLOVGrid.rowXPath = "CaseType";
ChangeCaseType_NewCaseTypeLOVGrid.keyXPath = "Type";
ChangeCaseType_NewCaseTypeLOVGrid.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];

ChangeCaseType_NewCaseTypeLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "ChangeCaseType_NewCaseTypeLOVButton"} ],
		keys: [ { key: Key.F6, element: "ChangeCaseType_NewCaseType" } ]
	}
};

/**
 * @author rzxd7g
 * @return "ChangeCaseType_NewCaseType"  
 */
ChangeCaseType_NewCaseTypeLOVGrid.nextFocusedAdaptorId = function() {
	return "ChangeCaseType_NewCaseType";
}

/****************************** DATA BINDINGS **************************************/

ChangeCaseType_OldCaseType.dataBinding = XPathConstants.DATA_XPATH + "/CaseType";
ChangeCaseType_NewCaseType.dataBinding = XPathConstants.DATA_XPATH + "/NewCaseType";

/******************************* INPUT FIELDS **************************************/

function ChangeCaseType_OldCaseType() {}
ChangeCaseType_OldCaseType.tabIndex = -1;
ChangeCaseType_OldCaseType.maxLength = 30;
ChangeCaseType_OldCaseType.helpText = "Current case type";
ChangeCaseType_OldCaseType.isTemporary = function() { return true; }
ChangeCaseType_OldCaseType.isReadOnly = function() { return true; }

/*********************************************************************************/

function ChangeCaseType_NewCaseType() {}
ChangeCaseType_NewCaseType.srcData = XPathConstants.DATA_XPATH + "/CaseTypeList";
ChangeCaseType_NewCaseType.rowXPath = "CaseType";
ChangeCaseType_NewCaseType.keyXPath = "Type";
ChangeCaseType_NewCaseType.displayXPath = "Type";
ChangeCaseType_NewCaseType.strictValidation = true;
ChangeCaseType_NewCaseType.tabIndex = 1;
ChangeCaseType_NewCaseType.helpText = "New case type";
ChangeCaseType_NewCaseType.isMandatory = function() { return true; }
ChangeCaseType_NewCaseType.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

ChangeCaseType_NewCaseType.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/****************************** BUTTON FIELDS **************************************/

function ChangeCaseType_NewCaseTypeLOVButton() {}
ChangeCaseType_NewCaseTypeLOVButton.tabIndex = 2;

/**********************************************************************************/

function ChangeCaseType_OkButton() {}
ChangeCaseType_OkButton.tabIndex = 3;

/**********************************************************************************/

function ChangeCaseType_CancelButton() {}
ChangeCaseType_CancelButton.tabIndex = 4;
