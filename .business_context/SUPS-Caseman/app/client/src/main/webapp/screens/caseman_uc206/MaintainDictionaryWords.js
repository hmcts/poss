/** 
 * @fileoverview MaintainDictionaryWords.js:
 * This file contains the field configurations for UC206 - Maintain Dictionary Words screen
 *
 * @author Tim Grant
 * @version 0.1
 *
 * Change History:
 * 25/11/2006 - Chris Vincent, added F4 keybinding to the Close Button.  UCT Defect 713.
 */

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/
			
// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";


/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author kzhr8f
 * 
 */
function MaintainDictionaryWords() {}
					
// load the Court code and name into the XML	
MaintainDictionaryWords.refDataServices = [
	{
		name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]
	}
];
	
/**
 * Create and initialise the variables that hold the Owning Court Name and Code objects
 * @author kzhr8f
 * 
 */
MaintainDictionaryWords.initialise = function()
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
}

/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
		
function MaintainDictionaryWords_EnterWord() {}

MaintainDictionaryWords_EnterWord.dataBinding = "/ds/Word";
		
		
/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS for MaintainDictionaryWords_EnterWord
*****************************************************************************************************************/
	
	
MaintainDictionaryWords_EnterWord.tabIndex = 300;
MaintainDictionaryWords_EnterWord.componentName = "Enter Word";
MaintainDictionaryWords_EnterWord.helpText = null;

MaintainDictionaryWords_EnterWord.isMandatory = function()
{
	return true;
}

MaintainDictionaryWords_EnterWord.validateOn = [ MaintainDictionaryWords_EnterWord.dataBinding ];
MaintainDictionaryWords_EnterWord.validate = function()
{
	var value = Services.getValue(MaintainDictionaryWords_EnterWord.dataBinding);

	if (value.indexOf(" ") >= 0)
	{
		return ErrorCode.getErrorCode("CaseMan_invalidDictionaryWord_Msg");
	}else if (/^[^a-zA-Z]/.test(value))
	{// See defect 4469.
		return ErrorCode.getErrorCode("CaseMan_invalidDictionaryFirstLetter_Msg");
	}else if (/[^a-zA-Z0-9]/.test(value))
	{// See defect 4469.
		return ErrorCode.getErrorCode("CaseMan_invalidDictionaryCharacter_Msg");
	}
}

/*****************************************************************************************************************
                                         BUTTON DEFINITIONS
*****************************************************************************************************************/
	
/**
 * Create the Add Word Button status object
 * @author kzhr8f
 * 
 */
function Status_AddWordButton() {}

// Assign a value to the the Add Word Button status object tab index
Status_AddWordButton.tabIndex = 310;

/**
 * When the Add Word Button is clicked ....
 * @author kzhr8f
 * @return null 
 */
Status_AddWordButton.actionBinding = function() 
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (invalidFields.length > 0) 
	{
		return;
	}
	MaintainDictionaryWords.updateDictionary("add");
}
	
/**
 * Create the Remove Word Button status object
 * @author kzhr8f
 * 
 */
function Status_RemoveWordButton() {}

// Assign a value to the the Remove Word Button status object tab index
Status_RemoveWordButton.tabIndex = 320;

/**
 * When the Remove Word Button is clicked ....
 * @author kzhr8f
 * @return null 
 */
Status_RemoveWordButton.actionBinding = function() 
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (invalidFields.length > 0) 
	{
		return;
	}
	MaintainDictionaryWords.updateDictionary("remove");
}
			
/**
 * Create the close Button object
 * @author kzhr8f
 * 
 */
function Status_Close_Btn() {};
// UCT Defect 713 - add F4 keybinding to the close button
Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainDictionaryWords" } ]
	}
};

// Assign a value to the the close Button status object tab index
Status_Close_Btn.tabIndex = 330;

/**
 * Exit the screen when the close button is clicked.
 * @author kzhr8f
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	MaintainDictionaryWords.exitScreen();
};

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/

/**
 * Create the Owning Court Name and Code objects
 * @author kzhr8f
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}

// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";

//retrieve the court code.
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

/**
 * Make the Owning Court Name and Code fields read only
 * @author kzhr8f
 * @return boolean 
 */
OwningCourt_Code.isReadOnly = function()
{ 
	return true;
}
OwningCourt_Name.isReadOnly = function()
{ 
	return true;
}			

/**
 * @author kzhr8f
 * 
 */
MaintainDictionaryWords.exitScreen = function()
{
	Services.navigate(NavigationController.MAIN_MENU);
}		

/**
 * @param operation
 * @author kzhr8f
 * 
 */
MaintainDictionaryWords.updateDictionary = function(operation)
{
	var handler = new Object();
	handler.onSuccess = function(dom)
	{
		Services.setTransientStatusBarMessage("Update successful");
	}
	
	var params = new ServiceParams();
	params.addSimpleParameter("courtShortName", Services.getValue("/ds/var/app/UserData/CourtId"));
	params.addSimpleParameter("operation", operation);
	params.addSimpleParameter("word", Services.getValue(MaintainDictionaryWords_EnterWord.dataBinding));
	Services.callService("updateDictionary", params, handler, true);
}
