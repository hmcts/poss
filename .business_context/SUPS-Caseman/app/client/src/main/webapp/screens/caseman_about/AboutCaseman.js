/** 
 * @fileoverview AboutCaseman.js:
 * This file contains the configurations for the About CaseMan screen
 *
 * @author Chris Hutt, Chris Vincent
 */

/**
 * XPath Constants
 * @author gzyysf
 * 
 */
function XPathConstants() {};
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";

/**************************** MAIN FORM ********************************************/

function AboutCaseman() {}

// Load build specific data into the model
AboutCaseman.refDataServices = 
[
	{name:"AboutCasemanDetails", dataBinding:XPathConstants.REF_DATA_XPATH, fileName:"AboutCaseman.xml"},
    {name:"DbName", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getDbnameDetails", serviceParams:[]},                	                                	                                	                                
    {name:"User", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getUserDetails", serviceParams:[]},
    {name:"DbScripts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getScriptDetails", serviceParams:[]}
];

/************************** FIELD CONFIGS ******************************************/

function Header_BuildVersion() {};
Header_BuildVersion.dataBinding = XPathConstants.REF_DATA_XPATH + "/Caseman/Build/Version";
Header_BuildVersion.tabIndex = -1;
Header_BuildVersion.maxLength = 15;
Header_BuildVersion.helpText = "Version of build being tested";
Header_BuildVersion.isReadOnly = function() { return true; }
Header_BuildVersion.transformToDisplay = function(value) { return (null != value) ? value.toUpperCase() : null; }

/***********************************************************************************/

function Header_BuildDate() {};
Header_BuildDate.dataBinding = XPathConstants.REF_DATA_XPATH + "/Caseman/Build/Date";
Header_BuildDate.tabIndex = -1;
Header_BuildDate.maxLength = 15;
Header_BuildDate.helpText = "Date version being tested was produced";
Header_BuildDate.isReadOnly = function() { return true; }
Header_BuildDate.transformToDisplay = function(value) { return (null != value) ? value.toUpperCase() : null; }

/***********************************************************************************/

function Header_FwkVersion() {};
Header_FwkVersion.dataBinding = XPathConstants.REF_DATA_XPATH + "/Caseman/Framework/Version";
Header_FwkVersion.tabIndex = -1;
Header_FwkVersion.maxLength = 15;
Header_FwkVersion.helpText = "Version of framework incorporated in build";
Header_FwkVersion.isReadOnly = function() { return true; }
Header_FwkVersion.transformToDisplay = function(value) { return (null != value) ? value.toUpperCase() : null; }

/***********************************************************************************/

function Header_Url() {};
Header_Url.dataBinding = XPathConstants.REF_DATA_XPATH + "/Database/Name";
Header_Url.tabIndex = -1;
Header_Url.maxLength = 40;
Header_Url.helpText = "Database URL";
Header_Url.isReadOnly = function() { return true; }
Header_Url.transformToDisplay = function(value) { return (null != value) ? value.toUpperCase() : null; }

/***********************************************************************************/

function Header_DbUser() {}
Header_DbUser.dataBinding = XPathConstants.REF_DATA_XPATH + "/User/Name";
Header_DbUser.tabIndex = -1;
Header_DbUser.maxLength = 15;
Header_DbUser.helpText = "Database User";
Header_DbUser.isReadOnly = function() { return true; }
Header_DbUser.transformToDisplay = function(value) { return (null != value) ? value.toUpperCase() : null; }

/***************************** GRIDS ***********************************************/

function Header_DbScriptsListGrid() {};
Header_DbScriptsListGrid.tabIndex = 1;
Header_DbScriptsListGrid.dataBinding = "/ds/var/page/SelectedItem";
Header_DbScriptsListGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Scripts";
Header_DbScriptsListGrid.rowXPath = "Script";
Header_DbScriptsListGrid.keyXPath = "Id";   // Not really required as read only? 
Header_DbScriptsListGrid.columns = [
	{xpath: "Schema"},
	{xpath: "DateRun", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate, defaultSort:"true"},
	{xpath: "ScriptName"},
	{xpath: "ChangeNumber"}
];

/******************************* BUTTONS *******************************************/

function Status_Close() {}
Status_Close.tabIndex = 2;
Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AboutCaseman" } ]
	}
};

/**
 * @author gzyysf
 * 
 */
Status_Close.actionBinding = function()
{
	Services.navigate(NavigationController.MAIN_MENU);		
}
