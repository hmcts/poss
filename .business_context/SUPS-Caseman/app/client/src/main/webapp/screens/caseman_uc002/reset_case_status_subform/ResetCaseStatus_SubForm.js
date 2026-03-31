/** 
 * @fileoverview ResetCaseStatus_SubForm.js:
 * This file contains the configurations for the Reset Case Type Subform
 *
 * @author Chris Vincent
 *
 *
 * LOADING SUBFORM:
 * No service required
 *
 * SUBMITTING SUBFORM:
 * Service to be called is mUpdateCaseStatus which requires a DOM parameter (param: caseNumber)
 * DOM schema is:
 * <Case>
 * 		<SCN .... >
 * 		<CaseNumber/>
 * 		<CaseType/>
 * 		<Status/>
 * </Case>
 *
 * The SCN Number(s) need to be passed from the main form to the subform on loading (see handleResetCaseStatus() 
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
XPathConstants.FORM_DATA_XPATH = "/ds/var/form/SubForms/ResetCaseStatus/Case";

/*************************** HELPER FUNCTIONS **************************************/

/**
 * @author rzxd7g
 * 
 */
function handleSubformAuthorisationException()
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	Services.dispatchEvent("resetCaseStatusSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/************************** FORM CONFIGURATIONS *************************************/

function resetCaseStatusSubform() {}

resetCaseStatusSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "UpdateCaseDOM.xml",
	dataBinding: "/ds"
}

resetCaseStatusSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "UpdateCaseDOM.xml",
	dataBinding: "/ds"
}

resetCaseStatusSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

    modify: {
    	name:  "mUpdateCaseStatus",
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

resetCaseStatusSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "resetCaseStatusSubform" } ],
					singleClicks: [ {element: "ResetCaseStatus_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/****************************** BUTTON FIELDS **************************************/

function ResetCaseStatus_OkButton() {}
ResetCaseStatus_OkButton.tabIndex = 1;
/**
 * @author rzxd7g
 * 
 */
ResetCaseStatus_OkButton.actionBinding = function()
{
	// Hack to make the data dirty so it can be submitted
	Services.setValue("/ds/Case/CaseNumber", "ABC");
	Services.dispatchEvent("resetCaseStatusSubform", BusinessLifeCycleEvents.EVENT_SUBMIT);
}

/**********************************************************************************/

function ResetCaseStatus_CancelButton() {}
ResetCaseStatus_CancelButton.tabIndex = 2;
