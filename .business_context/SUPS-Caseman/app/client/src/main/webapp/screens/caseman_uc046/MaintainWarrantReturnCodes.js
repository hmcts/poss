/** 
 * @fileoverview MaintainWarrantReturnCodes.js:
 * This file contains the field configurations for UC046 - Maintain Warrant Return Codes screen
 *
 * @author Tun Shwe, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, updated the summary and full description fields on the add popup
 *				so the transform to model removes trailing and leading whitespace.
 */

/******************************* CONSTANTS *****************************************/

var VAR_APP_XPATH = "/ds/var/app";
var VAR_FORM_XPATH = "/ds/var/form";
var VAR_PAGE_XPATH = "/ds/var/page";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";
var RETURN_CODES_XPATH = "/ds/WarrantReturnCodes"
var NEW_RETURN_CODE_XPATH = VAR_PAGE_XPATH + "/tmp/WarrantReturnCode";
var DIRTYFLAG_XPATH = VAR_PAGE_XPATH + "/DirtyFlag";

/**
 * Constants used to indicate the action to perform following a save
 */
var ACTION_AFTER_SAVE = "";
var ACTION_EXIT = "EXIT_SCREEN";

/****************************** MAIN FORM *****************************************/

function MaintainWarrantReturnCodes() {}

MaintainWarrantReturnCodes.refDataServices = [
	{name:"ReturnCodeClasses", dataBinding:REF_DATA_XPATH, serviceName:"getReturnCodeClasses", serviceParams:[]},
	{name:"ReturnCodeTypes", dataBinding:REF_DATA_XPATH, serviceName:"getReturnCodeTypes", serviceParams:[]}
];

/**
 * @author fzj0yl
 * 
 */
MaintainWarrantReturnCodes.initialise = function() 
{ 
   loadReturnCodes();
}

/**
 * @param dom
 * @author fzj0yl
 * 
 */
MaintainWarrantReturnCodes.onSuccess = function(dom) 
{
	Services.replaceNode(RETURN_CODES_XPATH, dom.selectSingleNode(RETURN_CODES_XPATH));
	Services.setValue(DIRTYFLAG_XPATH, "false");
}

/**************************** OTHER FUNCTIONS **************************************/

/**
 * @param value
 * @author fzj0yl
 * @return (value == "I") ? "INTERIM", "FINAL"  
 */
function transformTypeToDisplay(value) {
    return (value == "I") ? "INTERIM" : "FINAL";    
}

/*********************************************************************************/

/**
 * @param value
 * @author fzj0yl
 * @return (value == "L") ? "LOCAL", "NATIONAL"  
 */
function transformCategoryToDisplay(value) {
    return (value == "L") ? "LOCAL" : "NATIONAL";    
}

/*********************************************************************************/

/**
 * @param value
 * @author fzj0yl
 * @return "" , Services.getValue(xpath)  
 */
function transformClassToDisplay(value) {
    if(CaseManUtils.isBlank(value)) {
        return "";
    }

    var xpath = REF_DATA_XPATH + "/ReturnCodeClasses/ReturnCodeClass[./Class = '" + value + "' and ./Type = " + ReturnCode_Type.dataBinding + "]/Description";
    return Services.getValue(xpath);
}

/*********************************************************************************/

/**
 * Function handles the loading of the form data
 * @author fzj0yl
 * 
 */
function loadReturnCodes()
{
    var params = new ServiceParams();
    params.addSimpleParameter("courtCode", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
    Services.callService("getWarrantReturnCodes", params, MaintainWarrantReturnCodes, true); 
}

/*********************************************************************************/

/**
 * Function handles the exiting from the screen back to the menu
 * @author fzj0yl
 * 
 */
function exitScreen() 
{
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form
 * @author fzj0yl
 * 
 */
function setDirtyFlag()
{
	var dirtyFlag = Services.getValue(DIRTYFLAG_XPATH);
	if ( dirtyFlag != "true" )
	{
		Services.setValue(DIRTYFLAG_XPATH, "true");
	}
}

/*********************************************************************************/

/**
 * Function returns the state of the data i.e. dirty or not
 * @returns Boolean true if data is dirty
 * @author fzj0yl
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(DIRTYFLAG_XPATH);
	return (dirtyFlag == "true") ? true : false;
}

/***************************** DATA BINDINGS **************************************/

MasterGrid.dataBinding = VAR_PAGE_XPATH + "/SelectedGridRow/SelectedWarrantReturnCode";
ReturnCode_Type.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Type";
ReturnCode_Code.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Code";
ReturnCode_Category.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Category";
ReturnCode_Class.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Class";
ReturnCode_Summary.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Summary";
ReturnCode_Description.dataBinding = RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/Description";
NewReturnCode_Type.dataBinding = NEW_RETURN_CODE_XPATH + "/Type";
NewReturnCode_Code.dataBinding = NEW_RETURN_CODE_XPATH + "/Code";
NewReturnCode_Class.dataBinding = NEW_RETURN_CODE_XPATH + "/Class";
NewReturnCode_Summary.dataBinding = NEW_RETURN_CODE_XPATH + "/Summary";
NewReturnCode_Description.dataBinding = NEW_RETURN_CODE_XPATH + "/Description";

/********************************** POPUPS *****************************************/

function NewReturnCode_Popup() {};

NewReturnCode_Popup.lower = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "NewReturnCode_Popup" } ],
		singleClicks: [ {element: "NewReturnCode_CancelButton"} ]
	}
};

/**
 * @author fzj0yl
 * @return "Status_SaveButton"  
 */
NewReturnCode_Popup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/******************************** LOV POPUPS ***************************************/

function ClassesLOVGrid() {};
ClassesLOVGrid.dataBinding = NewReturnCode_Class.dataBinding;
ClassesLOVGrid.srcData = REF_DATA_XPATH + "/ReturnCodeClasses";
ClassesLOVGrid.srcDataOn = [NewReturnCode_Type.dataBinding];
ClassesLOVGrid.rowXPath = "/ReturnCodeClass[./Type = " + NewReturnCode_Type.dataBinding + "]";
ClassesLOVGrid.keyXPath = "Class";
ClassesLOVGrid.columns = [
	{xpath: "Class"},
	{xpath: "Description"}
];

ClassesLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "NewReturnCode_ClassLOVButton"} ],
		keys: [ { key: Key.F6, element: "NewReturnCode_Class" } ]
	}
};

/********************************** GRIDS *****************************************/

function MasterGrid() {}
MasterGrid.isRecord = true;
MasterGrid.tabIndex = 1;
MasterGrid.componentName = "Master Grid";
MasterGrid.srcData = RETURN_CODES_XPATH;
MasterGrid.rowXPath = "WarrantReturnCode";
MasterGrid.keyXPath = "SurrogateKey";
MasterGrid.columns = [										
	{xpath: "Code"},
	{xpath: "Summary"},
	{xpath: "Type", transformToDisplay: transformTypeToDisplay},
	{xpath: "Category", transformToDisplay: transformCategoryToDisplay},
	{xpath: "Class"}
];

/********************************* FIELDS ******************************************/

function ReturnCode_Type() {}
ReturnCode_Type.tabIndex = -1;
ReturnCode_Type.componentName = "Type";
ReturnCode_Type.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Type.helpText = "The type of return code i.e. Interim or Final.";
ReturnCode_Type.isEnabled = function() { return true; }
ReturnCode_Type.isReadOnly = function() { return true; }
ReturnCode_Type.transformToDisplay = transformTypeToDisplay;

/*********************************************************************************/

function ReturnCode_Code() {}
ReturnCode_Code.tabIndex = -1;
ReturnCode_Code.componentName = "Code";
ReturnCode_Code.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Code.helpText = "The return code - Final greater than 300, interim 2 characters in length.";
ReturnCode_Code.isEnabled = function() { return true; }
ReturnCode_Code.isReadOnly = function() { return true; }
ReturnCode_Code.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function ReturnCode_Category() {}
ReturnCode_Category.tabIndex = -1;
ReturnCode_Category.componentName = "Category";
ReturnCode_Category.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Category.helpText = "The category for the return code i.e. National or Local.";
ReturnCode_Category.isEnabled = function() { return true; }
ReturnCode_Category.isReadOnly = function() { return true; }
ReturnCode_Category.transformToDisplay = transformCategoryToDisplay;

/*********************************************************************************/

function ReturnCode_Class() {}
ReturnCode_Class.tabIndex = -1;
ReturnCode_Class.componentName = "Class";
ReturnCode_Class.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Class.helpText = "The classification for this warrant return code.";
ReturnCode_Class.isEnabled = function() { return true; }
ReturnCode_Class.isReadOnly = function() { return true; }
ReturnCode_Class.transformToDisplay = transformClassToDisplay;

/*********************************************************************************/

function ReturnCode_Summary() {}
ReturnCode_Summary.tabIndex = -1;
ReturnCode_Summary.componentName = "Summary Description";
ReturnCode_Summary.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Summary.helpText = "Summary description of the warrant return code.";
ReturnCode_Summary.isEnabled = function() { return true; }
ReturnCode_Summary.isReadOnly = function() { return true; }
ReturnCode_Summary.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function ReturnCode_Description() {}
ReturnCode_Description.tabIndex = -1;
ReturnCode_Description.componentName = "Full Description";
ReturnCode_Description.retrieveOn = [MasterGrid.dataBinding];
ReturnCode_Description.helpText = "Full description of the warrant return code.";
ReturnCode_Description.isEnabled = function() { return true; }
ReturnCode_Description.isReadOnly = function() { return true; }
ReturnCode_Description.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function NewReturnCode_Type() {}
NewReturnCode_Type.tabIndex = 20;
NewReturnCode_Type.componentName = "Popup Type";
NewReturnCode_Type.srcData = REF_DATA_XPATH + "/ReturnCodeTypes";
NewReturnCode_Type.rowXPath = "/ReturnCodeType";
NewReturnCode_Type.keyXPath = "/Type";
NewReturnCode_Type.displayXPath = "/Description";
NewReturnCode_Type.helpText = "The type of return code i.e. Interim or Final.";
NewReturnCode_Type.isMandatory = function() { return true; }
NewReturnCode_Type.isTemporary = function() { return true; }
NewReturnCode_Type.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}
NewReturnCode_Type.transformToModel = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function NewReturnCode_Code() {}
NewReturnCode_Code.tabIndex = 21;
NewReturnCode_Code.maxLength = 3;
NewReturnCode_Code.componentName = "Popup Code";
NewReturnCode_Code.helpText = "The return code - Final greater than 300, interim 2 characters in length.";
NewReturnCode_Code.isTemporary = function() { return true; }
NewReturnCode_Code.isMandatory = function() { return true; }
NewReturnCode_Code.validateOn = [NewReturnCode_Type.dataBinding, NewReturnCode_Code.dataBinding];
NewReturnCode_Code.validate = function() {
    var value = Services.getValue(this.dataBinding);
    var type = Services.getValue(NewReturnCode_Type.dataBinding);
    
    if(type == "I") {
        if(value.length < 2) {
            return ErrorCode.getErrorCode("CaseMan_invalidInterimCodeLength_Msg");
        }
        if(value.search(CaseManValidationHelper.ALPHABETIC_PATTERN) != 0) {
            return ErrorCode.getErrorCode("CaseMan_NumericReturnCode_Msg");
        }
        if(value.substring(0, 1) == "A") {
            return ErrorCode.getErrorCode("CaseMan_invalidInterimCodeChar_Msg");    
        }
    } else {
        if(value.search(CaseManValidationHelper.NUMERIC_PATTERN) != 0 || value <= 300) {
            return ErrorCode.getErrorCode("CaseMan_invalidFinalReturnCode_Msg");
        }
    }
    
    var xpath = RETURN_CODES_XPATH + "/WarrantReturnCode[./Code = '" + value + "' and ./Type = '" + type + "']";
    var exists = Services.countNodes(xpath);
    if(exists > 0) {
        return ErrorCode.getErrorCode("CaseMan_ReturnCodeAlreadyExists_Msg");
    }
    
	return null;
}
NewReturnCode_Code.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}
NewReturnCode_Code.transformToModel = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function NewReturnCode_Class() {}
NewReturnCode_Class.tabIndex = 22;
NewReturnCode_Class.componentName = "Popup Class";
NewReturnCode_Class.srcData = REF_DATA_XPATH + "/ReturnCodeClasses";
NewReturnCode_Class.srcDataOn = [NewReturnCode_Type.dataBinding];
NewReturnCode_Class.rowXPath = "/ReturnCodeClass[./Type = " + NewReturnCode_Type.dataBinding + "]";
NewReturnCode_Class.keyXPath = "/Class";
NewReturnCode_Class.displayXPath = "/Description";
NewReturnCode_Class.helpText = "The classification for this warrant return code.";
NewReturnCode_Class.isTemporary = function() { return true; }
NewReturnCode_Class.isMandatory = function() { return true; }

/*********************************************************************************/

function NewReturnCode_Summary() {}
NewReturnCode_Summary.tabIndex = 24;
NewReturnCode_Summary.maxLength = 80;
NewReturnCode_Summary.componentName = "Popup Summary Description";
NewReturnCode_Summary.helpText = "Summary description of the warrant return code.";
NewReturnCode_Summary.isTemporary = function() { return true; }
NewReturnCode_Summary.isMandatory = function() { return true; }
NewReturnCode_Summary.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}
NewReturnCode_Summary.transformToModel = function(value) 
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function NewReturnCode_Description() {}
NewReturnCode_Description.tabIndex = 25;
NewReturnCode_Description.maxLength = 1000;
NewReturnCode_Description.componentName = "Popup Full Description";
NewReturnCode_Description.helpText = "Full description of the warrant return code.";
NewReturnCode_Description.isTemporary = function() { return true; }
NewReturnCode_Description.isMandatory = function() { return true; }
NewReturnCode_Description.transformToDisplay = function(value) 
{
	return (null != value) ? value.toUpperCase() : null;
}
NewReturnCode_Description.transformToModel = function(value) 
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}
// If the description field is the last entered, and all fields are now valid, the ok button is enabled.
// The problem is that the focus is moved before the button is enabled, so the focus will be on cancel
// rather than ok.  This logic will move the focus back to the ok button
NewReturnCode_Description.logicOn = [NewReturnCode_Description.dataBinding];
NewReturnCode_Description.logic = function(event) {
    if(event.getXPath() != NewReturnCode_Description.dataBinding) {
        return;
    }
    Services.setFocus("NewReturnCode_OkButton");
}

/******************************** BUTTONS *****************************************/

function Master_AddButton() {}

Master_AddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainWarrantReturnCodes" } ]
	}
};

Master_AddButton.tabIndex = 2;
/**
 * @author fzj0yl
 * 
 */
Master_AddButton.actionBinding = function() 
{
	var newReturnCode = Services.loadDOMFromURL("NewReturnCode.xml");
	Services.replaceNode(NEW_RETURN_CODE_XPATH, newReturnCode);
	Services.setValue(NEW_RETURN_CODE_XPATH + "/CourtCode", Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
    Services.dispatchEvent("NewReturnCode_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
};

/**********************************************************************************/

function Master_RemoveButton() {}

Master_RemoveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "MaintainWarrantReturnCodes", alt: true } ]
	}
};

Master_RemoveButton.tabIndex = 3;
Master_RemoveButton.enableOn = [MasterGrid.dataBinding];
Master_RemoveButton.isEnabled = function() {
    // Check if there is an SCN relating to the currently selected record.  If there is, it cannot be deleted.
	var count = Services.countNodes(RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]/SCN");
	if(count > 0) {
	    return false;
	}
	return true;
}
/**
 * @author fzj0yl
 * 
 */
Master_RemoveButton.actionBinding = function() 
{
    Services.removeNode(RETURN_CODES_XPATH + "/WarrantReturnCode[./SurrogateKey = " + MasterGrid.dataBinding + "]");
};

/**********************************************************************************/

function NewReturnCode_ClassLOVButton() {}
NewReturnCode_ClassLOVButton.tabIndex = 23;

/**********************************************************************************/

function NewReturnCode_OkButton() {}
NewReturnCode_OkButton.tabIndex = 26;
NewReturnCode_OkButton.enableOn = [NewReturnCode_Type.dataBinding, NewReturnCode_Code.dataBinding, NewReturnCode_Class.dataBinding, NewReturnCode_Summary.dataBinding, NewReturnCode_Description.dataBinding];
NewReturnCode_OkButton.isEnabled = function() 
{
	var typeValue = Services.getValue(NewReturnCode_Type.dataBinding);
	var codeValue = Services.getValue(NewReturnCode_Code.dataBinding);
	var classValue = Services.getValue(NewReturnCode_Class.dataBinding);
	var summaryValue = Services.getValue(NewReturnCode_Summary.dataBinding);
	var descriptionValue = Services.getValue(NewReturnCode_Description.dataBinding);
	
	// Disabled if any of the mandatory fields are blank
	if ( CaseManUtils.isBlank(typeValue) || CaseManUtils.isBlank(codeValue) || CaseManUtils.isBlank(classValue) ||
		 CaseManUtils.isBlank(summaryValue) || CaseManUtils.isBlank(descriptionValue) )
	{
		return false;
	}
	
	// Disabled if any fields are invalid
	if ( null != NewReturnCode_Code.validate() )
	{
		return false;
	}
	
	// Disabled if the description is too long
	if( descriptionValue.length > NewReturnCode_Description.maxLength ) 
	{
	    return false;
	}
	return true;
}

/**
 * @author fzj0yl
 * @return null 
 */
NewReturnCode_OkButton.actionBinding = function() 
{
	if ( !NewReturnCode_OkButton.isEnabled() )
	{
		// Fields are invalid or mandatory fields are blank
		return;
	}
	
	setDirtyFlag();
	var newReturnCodeNode = Services.getNode(NEW_RETURN_CODE_XPATH);
	Services.addNode(newReturnCodeNode, RETURN_CODES_XPATH);
	Services.dispatchEvent("NewReturnCode_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
};

/**********************************************************************************/

function NewReturnCode_CancelButton() {}
NewReturnCode_CancelButton.tabIndex = 27;

/**********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainWarrantReturnCodes" } ]
	}
};

Status_SaveButton.tabIndex = 17;
/**
 * @author fzj0yl
 * 
 */
Status_SaveButton.actionBinding = function() 
{
	if ( isDataDirty() )
	{
		var dataNode = XML.createDOM(null, null, null);
		var dsNode = XML.createElement(dataNode, "ds");
		var node = Services.getNode(RETURN_CODES_XPATH);

		// Strip out any unmodified return codes
		//var strippedNode = RecordsProtocol.stripCleanRecords(node, RETURN_CODES_XPATH);
		//dsNode.appendChild(strippedNode);
		
		dsNode.appendChild(node);
		dataNode.appendChild(dsNode);
		var params = new ServiceParams();
	    params.addDOMParameter("WarrantReturnCodes", dataNode);
	    Services.callService("updateWarrantReturnCodes", params, Status_SaveButton, true);
	}
};

/**
 * @param dom
 * @author fzj0yl
 * 
 */
Status_SaveButton.onSuccess = function(dom) 
{
	var temp = ACTION_AFTER_SAVE;
	ACTION_AFTER_SAVE = "";
	switch (temp)
	{
		case ACTION_EXIT:
			// Exit the screen
			exitScreen();
			break;
		default:
		    // Show the success message and retrieve the return codes again
		    Services.setTransientStatusBarMessage("Changes saved.");
		    loadReturnCodes();
	}
}

/**********************************************************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainWarrantReturnCodes" } ]
	}
};

Status_CloseButton.tabIndex = 18;
/**
 * @author fzj0yl
 * 
 */
Status_CloseButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		ACTION_AFTER_SAVE = ACTION_EXIT;
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}
