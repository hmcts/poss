/** &&&
 * @fileoverview AddDebt_SubForm.js:
 * This file contains the configurations for the Add Debt Subform used 
 * on the Maintain Debt screen
 *
 * @author Tim Connor
 * Chnaged and amended MGG 07/12/05
 * author made changes to change to sub form. Unfortunately a lot of functionality changes were made - why???
 * Hopefully found them all.
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Added missing keyBinding of F4 on the cancel button.
 * 14/06/2006 - Chris Vincent: on text fields with no special validation updated transform to model to remove
 *				trailing and leading whitespace, particularly important on mandatory text fields where a blank
 *				space can be entered which can cause the screen to crash.
 */

/*****************************************************************************************************************
 										FORM CONFIGURATIONS
*****************************************************************************************************************/

function AddCoAddressSubform() {}

AddCoAddressSubform.initialise = function(){}

AddCoAddressSubform.createLifeCycle =
{
    eventBinding: {
        keys: [],
        singleClicks: [],
        doubleClicks: []
    },
    fileName: "NewAddress.xml",
    dataBinding: "/ds"
}

AddCoAddressSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddAddress_OKBtn"} ],
                    doubleClicks: []
                  },
	create : {},
	returnSourceNodes: [MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH],
	postSubmitAction: {
		close: {}
	}
}

AddCoAddressSubform.cancelLifeCycle = {

	/*eventBinding: {	keys: [],
					singleClicks: [ { element: "AddAddrerss_CancelBtn"} ],
					doubleClicks: []
				  },
 */
	raiseWarningIfDOMDirty: false
}


/*****************************************************************************************************************
 										DATA BINDINGS
*****************************************************************************************************************/

AddCoAddress_Subform_Address_Line1.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/Line[1]";
AddCoAddress_Subform_Address_Line2.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/Line[2]";
AddCoAddress_Subform_Address_Line3.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/Line[3]";
AddCoAddress_Subform_Address_Line4.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/Line[4]";
AddCoAddress_Subform_Address_Line5.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/Line[5]";
AddCoAddress_Subform_Address_Postcode.dataBinding = MaintainCOVariables.SUBFORM_ADD_ADDRESS_XPATH + "/PostCode";

/*****************************************************************************************************************
 										INPUT FIELDS
*****************************************************************************************************************/
/*****************************************************************************************************************
                                        MAINTAIN DEBT ADD ADDRESS CREDITOR TAB INPUT FIELD DEFINITIONS
*****************************************************************************************************************/
function AddCoAddress_Subform_Address_Line1() {}
AddCoAddress_Subform_Address_Line1.tabIndex = 1100;
AddCoAddress_Subform_Address_Line1.maxLength = 35;
AddCoAddress_Subform_Address_Line1.helpText = "First line of the address.";
AddCoAddress_Subform_Address_Line1.isReadOnly = function()
{
	return false;
}
AddCoAddress_Subform_Address_Line1.logicOn = [AddCoAddress_Subform_Address_Line1.dataBinding];
AddCoAddress_Subform_Address_Line1.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Line1.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Line1.isMandatory = function()
{
	return true;
}
AddCoAddress_Subform_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Line1.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddCoAddress_Subform_Address_Line2() {}
AddCoAddress_Subform_Address_Line2.tabIndex = 1101;
AddCoAddress_Subform_Address_Line2.maxLength = 35;
AddCoAddress_Subform_Address_Line2.helpText = "Second line of the address.";
AddCoAddress_Subform_Address_Line2.logicOn = [AddCoAddress_Subform_Address_Line2.dataBinding];
AddCoAddress_Subform_Address_Line2.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Line2.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Line2.isMandatory = function()
{
	return true;
}
AddCoAddress_Subform_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Line2.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
/******************************************************************************/
function AddCoAddress_Subform_Address_Line3() {}
AddCoAddress_Subform_Address_Line3.tabIndex = 1102;
AddCoAddress_Subform_Address_Line3.maxLength = 35;
AddCoAddress_Subform_Address_Line3.helpText = "Third line of the address.";
AddCoAddress_Subform_Address_Line3.logicOn = [AddCoAddress_Subform_Address_Line3.dataBinding];
AddCoAddress_Subform_Address_Line3.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Line3.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Line3.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************************************************************/
function AddCoAddress_Subform_Address_Line4() {}
AddCoAddress_Subform_Address_Line4.tabIndex = 1103;
AddCoAddress_Subform_Address_Line4.maxLength = 35;
AddCoAddress_Subform_Address_Line4.helpText = "Fourth line of the address.";
AddCoAddress_Subform_Address_Line4.logicOn = [AddCoAddress_Subform_Address_Line4.dataBinding];
AddCoAddress_Subform_Address_Line4.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Line4.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Line4.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************************************************************/
function AddCoAddress_Subform_Address_Line5() {}
AddCoAddress_Subform_Address_Line5.tabIndex = 1104;
AddCoAddress_Subform_Address_Line5.maxLength = 35;
AddCoAddress_Subform_Address_Line5.helpText = "Fifth line of the address.";
AddCoAddress_Subform_Address_Line5.logicOn = [AddCoAddress_Subform_Address_Line5.dataBinding];
AddCoAddress_Subform_Address_Line5.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Line5.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Line5.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************************************************************/
function AddCoAddress_Subform_Address_Postcode() {}
AddCoAddress_Subform_Address_Postcode.tabIndex = 1105;
AddCoAddress_Subform_Address_Postcode.maxLength = 35;
AddCoAddress_Subform_Address_Postcode.helpText = "Postcode of the address.";
AddCoAddress_Subform_Address_Postcode.validateOn = [AddCoAddress_Subform_Address_Postcode.dataBinding];
AddCoAddress_Subform_Address_Postcode.validate = function()
{
	var errCode = null;
	var postCode = Services.getValue(AddCoAddress_Subform_Address_Postcode.dataBinding);
	if(null != postCode && postCode != ""){
		if(CaseManValidationHelper.validatePostCode(postCode) == false){
			errCode  = ErrorCode.getErrorCode("CaseMan_invalidPostcodeFormat_Msg");
		}
	}
	return errCode;
}
AddCoAddress_Subform_Address_Postcode.logicOn = [AddCoAddress_Subform_Address_Postcode.dataBinding];
AddCoAddress_Subform_Address_Postcode.logic = function(event)
{	
	if (event.getXPath() != "/"){
		var line = Services.getValue(AddCoAddress_Subform_Address_Postcode.dataBinding);
		// set flag to indict changes made and if cancel button select will need to display the message
		MaintainCOFunctions.setCancelMessage(MaintainCOVariables.YES, line);//pFlagValue, pFieldValue
	}
}
AddCoAddress_Subform_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddCoAddress_Subform_Address_Postcode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*****************************************************************************************************************
 										BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/

function AddAddress_OKBtn() {}
AddAddress_OKBtn.tabIndex = 1106;

/******************************************************************************/

function AddAddrerss_CancelBtn() {}
AddAddrerss_CancelBtn.tabIndex = 1107;
AddAddrerss_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddCoAddressSubform" } ]
	}
};
/**
 * @author rzhh8k
 * 
 */
AddAddrerss_CancelBtn.actionBinding = function()
{
	if(confirm(Messages.CANCEL_MESSAGE)){
		Services.startTransaction();
		// reset temp area
		MaintainCOFunctions.resetTempAddress();
		Services.dispatchEvent("AddCoAddressSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
		Services.endTransaction();	
	}
}
