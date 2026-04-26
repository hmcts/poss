/** 
 * @fileoverview TestScreenLoader.js:
 * This file contains the field configurations for the Test Screen Loader screen.
 * The purpose of the screen is to allow a stubbed method to enter a number of screens
 * which cannot be accessed directly from the main menu.
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
XPathConstants.DATA_XPATH = "/ds/TestScreenLoader";

/****************************** MAIN FORM *****************************************/

function testScreenLoader() {};
testScreenLoader.refDataServices = [
	{name:"ScreenConfig", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"TestScreenConfig.xml" },
	{name:"ScreenParams", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"TestScreenParams.xml" }
];

/**************************** HELPER FUNCTIONS ************************************/

/**
 * Function handles the exit from the screen back to the main menu.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function converts a string to upper case.
 *
 * @param [String] value The text to be converted to upper case
 * @return [String] The parameter passed in converted to upper case
 * @author rzxd7g
 */
function convertTextToUpper(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*****************************  DATA BINDINGS *************************************/

Header_ScreenSelectList.dataBinding = XPathConstants.DATA_XPATH + "/Destination";
Params_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/Params/CaseNumber";
Params_CONumber.dataBinding = XPathConstants.DATA_XPATH + "/Params/CONumber";
Params_AENumber.dataBinding = XPathConstants.DATA_XPATH + "/Params/AENumber";
Params_WarrantNumber.dataBinding = XPathConstants.DATA_XPATH + "/Params/WarrantNumber";
Params_EventSequence.dataBinding = XPathConstants.DATA_XPATH + "/Params/EventSequence";
Params_EventId.dataBinding = XPathConstants.DATA_XPATH + "/Params/EventId";
Params_EventType.dataBinding = XPathConstants.DATA_XPATH + "/Params/EventType";
Params_Mechanism.dataBinding = XPathConstants.DATA_XPATH + "/Params/Mechanism";
Params_Action.dataBinding = XPathConstants.DATA_XPATH + "/Params/Params_Action";
Params_MaintenanceMode.dataBinding = XPathConstants.DATA_XPATH + "/Params/MaintenanceMode";
Params_ObligationType.dataBinding = XPathConstants.DATA_XPATH + "/Params/ObligationType";
Params_DefaultDays.dataBinding = XPathConstants.DATA_XPATH + "/Params/DefaultDays";
Params_COMode.dataBinding = XPathConstants.DATA_XPATH + "/Params/COMode";
Params_EnforcementNumber.dataBinding = XPathConstants.DATA_XPATH + "/Params/EnforcementNumber";
Params_EnforcementType.dataBinding = XPathConstants.DATA_XPATH + "/Params/EnforcementType";

/********************************* FIELDS ******************************************/

function Header_ScreenSelectList() {};
Header_ScreenSelectList.srcData = XPathConstants.REF_DATA_XPATH + "/Screens";
Header_ScreenSelectList.rowXPath = "/Screen";
Header_ScreenSelectList.keyXPath = "/Code";
Header_ScreenSelectList.displayXPath = "/Name";
Header_ScreenSelectList.tabIndex = 1;
Header_ScreenSelectList.helpText = "Select a screen to navigate to";
Header_ScreenSelectList.componentName = "Select Screen";
Header_ScreenSelectList.isMandatory = function() { return true; }

/*********************************************************************************/

function Params_CaseNumber() {};
Params_CaseNumber.tabIndex = 10;
Params_CaseNumber.maxLength = 8;
Params_CaseNumber.helpText = "Case Number";
Params_CaseNumber.componentName = "Case Number";
Params_CaseNumber.enableOn = [Header_ScreenSelectList.dataBinding];
Params_CaseNumber.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'CaseNumber']");
	return (isEnabled == true) ? true : false;
}

Params_CaseNumber.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_CaseNumber.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'CaseNumber']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

Params_CaseNumber.transformToDisplay = convertTextToUpper;
Params_CaseNumber.transformToModel = convertTextToUpper;

/*********************************************************************************/

function Params_CONumber() {};
Params_CONumber.tabIndex = 11;
Params_CONumber.maxLength = 8;
Params_CONumber.helpText = "CO Number";
Params_CONumber.componentName = "CO Number";
Params_CONumber.enableOn = [Header_ScreenSelectList.dataBinding];
Params_CONumber.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'CONumber']");
	return (isEnabled == true) ? true : false;
}

Params_CONumber.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_CONumber.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'CONumber']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

Params_CONumber.transformToDisplay = convertTextToUpper;
Params_CONumber.transformToModel = convertTextToUpper;

/*********************************************************************************/

function Params_AENumber() {};
Params_AENumber.tabIndex = 12;
Params_AENumber.maxLength = 8;
Params_AENumber.helpText = "AE Number";
Params_AENumber.componentName = "AE Number";
Params_AENumber.enableOn = [Header_ScreenSelectList.dataBinding];
Params_AENumber.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'AENumber']");
	return (isEnabled == true) ? true : false;
}

Params_AENumber.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_AENumber.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'AENumber']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

Params_AENumber.transformToDisplay = convertTextToUpper;
Params_AENumber.transformToModel = convertTextToUpper;

/*********************************************************************************/

function Params_WarrantNumber() {};
Params_WarrantNumber.tabIndex = 13;
Params_WarrantNumber.maxLength = 8;
Params_WarrantNumber.helpText = "Warrant Number";
Params_WarrantNumber.componentName = "Warrant Number";
Params_WarrantNumber.enableOn = [Header_ScreenSelectList.dataBinding];
Params_WarrantNumber.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'WarrantNumber']");
	return (isEnabled == true) ? true : false;
}

Params_WarrantNumber.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_WarrantNumber.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'WarrantNumber']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

Params_WarrantNumber.transformToDisplay = convertTextToUpper;
Params_WarrantNumber.transformToModel = convertTextToUpper;

/*********************************************************************************/

function Params_EventSequence() {};
Params_EventSequence.tabIndex = 14;
Params_EventSequence.helpText = "Event Sequence";
Params_EventSequence.componentName = "Event Sequence";
Params_EventSequence.enableOn = [Header_ScreenSelectList.dataBinding];
Params_EventSequence.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventSequence']");
	return (isEnabled == true) ? true : false;
}

Params_EventSequence.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_EventSequence.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventSequence']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_EventId() {};
Params_EventId.tabIndex = 15;
Params_EventId.maxLength = 3;
Params_EventId.helpText = "Event Id";
Params_EventId.componentName = "Event Id";
Params_EventId.enableOn = [Header_ScreenSelectList.dataBinding];
Params_EventId.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventId']");
	return (isEnabled == true) ? true : false;
}

Params_EventId.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_EventId.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventId']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_EventType() {};
Params_EventType.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'EventType']/Options";
Params_EventType.rowXPath = "/Option";
Params_EventType.keyXPath = "/Value";
Params_EventType.displayXPath = "/Description";
Params_EventType.tabIndex = 16;
Params_EventType.helpText = "Event Type";
Params_EventType.componentName = "Event Type";
Params_EventType.enableOn = [Header_ScreenSelectList.dataBinding];
Params_EventType.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventType']");
	return (isEnabled == true) ? true : false;
}

Params_EventType.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_EventType.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EventType']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_Mechanism() {};
Params_Mechanism.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'Mechanism']/Options";
Params_Mechanism.rowXPath = "/Option";
Params_Mechanism.keyXPath = "/Value";
Params_Mechanism.displayXPath = "/Description";
Params_Mechanism.tabIndex = 17;
Params_Mechanism.helpText = "Mechanism";
Params_Mechanism.componentName = "Mechanism";
Params_Mechanism.enableOn = [Header_ScreenSelectList.dataBinding];
Params_Mechanism.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'Mechanism']");
	return (isEnabled == true) ? true : false;
}

Params_Mechanism.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_Mechanism.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'Mechanism']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_Action() {};
Params_Action.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'Action']/Options";
Params_Action.rowXPath = "/Option";
Params_Action.keyXPath = "/Value";
Params_Action.displayXPath = "/Description";
Params_Action.tabIndex = 18;
Params_Action.helpText = "Action";
Params_Action.componentName = "Action";
Params_Action.enableOn = [Header_ScreenSelectList.dataBinding];
Params_Action.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'Action']");
	return (isEnabled == true) ? true : false;
}

Params_Action.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_Action.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'Action']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_MaintenanceMode() {};
Params_MaintenanceMode.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'MaintenanceMode']/Options";
Params_MaintenanceMode.rowXPath = "/Option";
Params_MaintenanceMode.keyXPath = "/Value";
Params_MaintenanceMode.displayXPath = "/Description";
Params_MaintenanceMode.tabIndex = 19;
Params_MaintenanceMode.helpText = "Maintenance Mode";
Params_MaintenanceMode.componentName = "Maintenance Mode";
Params_MaintenanceMode.enableOn = [Header_ScreenSelectList.dataBinding];
Params_MaintenanceMode.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'MaintenanceMode']");
	return (isEnabled == true) ? true : false;
}

Params_MaintenanceMode.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_MaintenanceMode.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'MaintenanceMode']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_ObligationType() {};
Params_ObligationType.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'ObligationType']/Options";
Params_ObligationType.rowXPath = "/Option";
Params_ObligationType.keyXPath = "/Value";
Params_ObligationType.displayXPath = "/Description";
Params_ObligationType.tabIndex = 20;
Params_ObligationType.helpText = "Obligation Type";
Params_ObligationType.componentName = "Obligation Type";
Params_ObligationType.enableOn = [Header_ScreenSelectList.dataBinding];
Params_ObligationType.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'ObligationType']");
	return (isEnabled == true) ? true : false;
}

Params_ObligationType.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_ObligationType.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'ObligationType']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_DefaultDays() {};
Params_DefaultDays.tabIndex = 21;
Params_DefaultDays.maxLength = 3;
Params_DefaultDays.helpText = "Default Days";
Params_DefaultDays.componentName = "Default Days";
Params_DefaultDays.enableOn = [Header_ScreenSelectList.dataBinding];
Params_DefaultDays.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'DefaultDays']");
	return (isEnabled == true) ? true : false;
}

Params_DefaultDays.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_DefaultDays.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'DefaultDays']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_COMode() {};
Params_COMode.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'COMode']/Options";
Params_COMode.rowXPath = "/Option";
Params_COMode.keyXPath = "/Value";
Params_COMode.displayXPath = "/Description";
Params_COMode.tabIndex = 22;
Params_COMode.helpText = "Maintain Debts Mode";
Params_COMode.componentName = "Maintain Debts Mode";
Params_COMode.enableOn = [Header_ScreenSelectList.dataBinding];
Params_COMode.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'COMode']");
	return (isEnabled == true) ? true : false;
}

Params_COMode.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_COMode.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'COMode']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/*********************************************************************************/

function Params_EnforcementNumber() {};
Params_EnforcementNumber.tabIndex = 23;
Params_EnforcementNumber.maxLength = 8;
Params_EnforcementNumber.helpText = "Enforcement Number";
Params_EnforcementNumber.componentName = "Enforcement Number";
Params_EnforcementNumber.enableOn = [Header_ScreenSelectList.dataBinding];
Params_EnforcementNumber.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EnforcementNumber']");
	return (isEnabled == true) ? true : false;
}

Params_EnforcementNumber.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_EnforcementNumber.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EnforcementNumber']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

Params_EnforcementNumber.transformToDisplay = convertTextToUpper;
Params_EnforcementNumber.transformToModel = convertTextToUpper;

/*********************************************************************************/

function Params_EnforcementType() {};
Params_EnforcementType.srcData = XPathConstants.REF_DATA_XPATH + "/Params/Param[./Name = 'EnforcementType']/Options";
Params_EnforcementType.rowXPath = "/Option";
Params_EnforcementType.keyXPath = "/Value";
Params_EnforcementType.displayXPath = "/Description";
Params_EnforcementType.tabIndex = 24;
Params_EnforcementType.helpText = "Enforcement Type";
Params_EnforcementType.componentName = "Enforcement Type";
Params_EnforcementType.enableOn = [Header_ScreenSelectList.dataBinding];
Params_EnforcementType.isEnabled = function()
{
	var isEnabled = Services.exists(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EnforcementType']");
	return (isEnabled == true) ? true : false;
}

Params_EnforcementType.mandatoryOn = [Header_ScreenSelectList.dataBinding];
Params_EnforcementType.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Screens/Screen[./Code = " + Header_ScreenSelectList.dataBinding + "]/Params/Param[./Name = 'EnforcementType']/Mandatory");
	return (isMandatory == "true") ? true : false;
}

/******************************** BUTTONS *****************************************/

function Status_GoButton() {};
Status_GoButton.tabIndex = 30;
Status_GoButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "testScreenLoader" } ]
	}
};
/**
 * @author rzxd7g
 * @return null 
 */
Status_GoButton.actionBinding = function()
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length )
	{
		return;
	}
	else
	{
		var destination = Services.getValue(Header_ScreenSelectList.dataBinding);
		switch (destination)
		{
			case NavigationController.TRANSFER_CASE_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(TransferCaseParams.CASE_NUMBER, caseNumber);
				break;
		
			case NavigationController.JUDGMENT_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(JudgmentParams.CASE_NUMBER, caseNumber);
				break;
		
			case NavigationController.BARJUDGMENT_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(BarJudgmentParams.CASE_NUMBER, caseNumber);
				break;

			case NavigationController.HEARING_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(HearingParams.CASE_NUMBER, caseNumber);
				break;

			case NavigationController.HEARINGCO_FORM:
				var coNumber = Services.getValue(Params_CONumber.dataBinding);
				Services.setValue(HearingParams.CO_NUMBER, coNumber);
				Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CO);
				break;

			case NavigationController.OBLIGATIONS_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(MaintainObligationsParams.CASE_NUMBER, caseNumber);
				
				var eventSeq = CaseManUtils.getValidNodeValue( Services.getValue(Params_EventSequence.dataBinding) );
				Services.setValue(MaintainObligationsParams.EVENT_SEQ, eventSeq);
				
				var eventId = CaseManUtils.getValidNodeValue( Services.getValue(Params_EventId.dataBinding) );
				Services.setValue(MaintainObligationsParams.EVENT_ID, eventId);
				
				var eventType = Services.getValue(Params_EventType.dataBinding);
				Services.setValue(MaintainObligationsParams.EVENT_TYPE, eventType);
				
				var mechanism = CaseManUtils.getValidNodeValue( Services.getValue(Params_Mechanism.dataBinding) );
				Services.setValue(MaintainObligationsParams.MECHANISM, mechanism);
				
				var action = CaseManUtils.getValidNodeValue( Services.getValue(Params_Action.dataBinding) );
				Services.setValue(MaintainObligationsParams.ACTION, action);
				
				var maintenanceMode = Services.getValue(Params_MaintenanceMode.dataBinding);
				Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, maintenanceMode);
				
				var obligationType = CaseManUtils.getValidNodeValue( Services.getValue(Params_ObligationType.dataBinding) );
				Services.setValue(MaintainObligationsParams.OBLIGATION_TYPE, obligationType);
				
				var defaultDays = CaseManUtils.getValidNodeValue( Services.getValue(Params_DefaultDays.dataBinding) );
				Services.setValue(MaintainObligationsParams.DEFAULT_DAYS, defaultDays);
				break;
				
			case NavigationController.WFT_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(MaintainWftParams.CASE_NUMBER, caseNumber);
				break;
				
			case NavigationController.WARRANT_REFUNDS_FEES_FORM:
				var warrantId = Services.getValue(Params_WarrantNumber.dataBinding);
				Services.setValue(MaintainWarrantAmountParams.WARRANT_ID, warrantId);
				break;
				
			case NavigationController.AE_AMOUNTS_FORM:
				var caseNumber = Services.getValue(Params_CaseNumber.dataBinding);
				Services.setValue(MaintainAEAmountParams.CASE_NUMBER, caseNumber);
				
				var aeNumber = Services.getValue(Params_AENumber.dataBinding);
				Services.setValue(MaintainAEAmountParams.AE_NUMBER, aeNumber);
				break;
				
			case NavigationController.MAINTAINDEBT_FORM:
				var coNumber = Services.getValue(Params_CONumber.dataBinding);
				Services.setValue(ManageCOParams.CO_NUMBER, coNumber);
				
				var coMode = Services.getValue(Params_COMode.dataBinding);
				Services.setValue(ManageCOParams.MODE, coMode);
				break;
				
			case NavigationController.AE_PER_FORM:
				var aeNumber = Services.getValue(Params_AENumber.dataBinding);
				Services.setValue(PERCalculatorParams.AE_NUMBER, aeNumber);
				break;
				
			case NavigationController.CO_PER_FORM:
				var coNumber = Services.getValue(Params_CONumber.dataBinding);
				Services.setValue(PERCalculatorParams.CO_NUMBER, coNumber);
				break;
				
			case NavigationController.DOM_CALC_FORM:
				var coNumber = Services.getValue(Params_CONumber.dataBinding);
				Services.setValue(DeterminationOfMeansParams.CO_NUMBER, coNumber);
				break;
				
			case NavigationController.VIEW_DIVIDENDS_FORM:
				var coNumber = Services.getValue(Params_CONumber.dataBinding);
				Services.setValue(ViewDividendsParams.CO_NUMBER, coNumber);
				break;
				
			case NavigationController.VIEW_PAYMENTS_FORM:
				var enfNumber = Services.getValue(Params_EnforcementNumber.dataBinding);
				var enfType = Services.getValue(Params_EnforcementType.dataBinding);
				var courtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH)
				Services.setValue(ViewPaymentsParams.ENFORCEMENT_NUMBER, enfNumber);
				Services.setValue(ViewPaymentsParams.ENFORCEMENT_TYPE, enfType);
				Services.setValue(ViewPaymentsParams.ISSUING_COURT, courtCode);
				break;
		}
		
		// Navigate to screen and set to return to this screen afterwards
		var navArray = new Array(destination, "testScreenLoader");
		NavigationController.createCallStack(navArray);
		NavigationController.nextScreen();
	}
};

/*********************************************************************************/

function Status_ClearButton() {};
Status_ClearButton.tabIndex = 31;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "testScreenLoader", alt: true } ]
	}
};

/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.setFocus("Header_ScreenSelectList");
};

/*********************************************************************************/

function Status_CloseButton() {};
Status_CloseButton.tabIndex = 32;
Status_CloseButton.actionBinding = exitScreen;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "testScreenLoader" } ]
	}
};
