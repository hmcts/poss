/** 
 * @fileoverview CaseManMenu.js:
 * This is the JavaScript configuration file for the Main Menu form 
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 05/07/2006 - Chris Vincent, used the new framework method Services.getFormsNode() to load
 * 				the applicationconfig.xml form nodes instead of loading applicationconfig.xml
 * 				via reference data.  This change reduces screen load time by 1.5 seconds.
 * 21/02/2012 - Chris Vincent, change to screen initialise function to clear down the Oracle Report 
 *				court code in /ds/var/app when load the menu.  Trac 4554.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_APP_XPATH = "/ds/var/app";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.GRID_SRC_DATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Forms";
XPathConstants.FORM_INDEX_XPATH = XPathConstants.VAR_APP_XPATH + "/MainMenu/FormMenuIndex";

/**
 * Form constants
 * @author rzxd7g
 * 
 */
function FormConstants() {};
FormConstants.MAINMENU = "MainMenu";
FormConstants.MENU_TYPE = "menu";
FormConstants.SCREEN_TYPE = "screen";
FormConstants.CSS_FORM = "form";
FormConstants.CSS_SCREEN = "normal";
FormConstants.LOGOUT_FORM = "LogoutForm";
FormConstants.EXIT_FORM = "ExitForm";

/************************** MAIN FORM **************************************/

function caseManMenu() {}

/**
 * @author rzxd7g
 * 
 */
caseManMenu.initialise = function()
{
	// Set Dummy Security Data
	Services.setValue("/ds/var/app/businessProcessId", "DummyProcessId");
	
	// Temp fix - we need to remove all calls to USERNAME_XPATH in the app
	// If the user has not logged in then the user defaults to "anonymous"
	var loggedInUser = Services.getCurrentUser();
	Services.setValue(CaseManFormParameters.USERNAME_XPATH, loggedInUser);
	
	// Load the contents of applicationconfig.xml from the framework Services function
    var appConfigNodes = Services.getFormsNode();
    Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/application-config/forms", appConfigNodes);

	// Display the forms in the grid
	if ( !Services.exists(XPathConstants.FORM_INDEX_XPATH) || CaseManUtils.isBlank( Services.getValue(XPathConstants.FORM_INDEX_XPATH) ) )
	{
		Services.setValue(XPathConstants.FORM_INDEX_XPATH, "");
	}
	
	// Clear down the Oracle Report court code to prevent reports being run for the wrong courts.
	Services.removeNode(CaseManFormParameters.OR_COURT_CODE_XPATH);
	
	// Retrieve the user alias
	var userAlias = CaseManUtils.getCurrentUserAlias();
	if ( null == userAlias && loggedInUser != "anonymous" )
	{
		var params = new ServiceParams();
	    Services.callService("getUserAlias", params, caseManMenu, true);
	}
	
	loadFormsForGrid();
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
caseManMenu.onSuccess = function(dom)
{
	Services.replaceNode("/ds/var/app/UserData", dom);
}

/************************ HELPER FUNCTIONS *********************************/

/**
 * Creates the node structure which the grid uses to display forms
 * @author rzxd7g
 * 
 */
function loadFormsForGrid()
{
	Services.startTransaction();
	
	// Remove the existing nodes
	Services.removeNode(XPathConstants.GRID_SRC_DATA_XPATH);
	
	// Add the first node for Main Menu
	var blankNode = Services.loadDOMFromURL("NewForm.xml");
	
	var formNode = blankNode.cloneNode(true);
	formNode.selectSingleNode("/Form/Name").text = FormConstants.MAINMENU;
	formNode.selectSingleNode("/Form/Title").text = "Main Menu";
	formNode.selectSingleNode("/Form/Type").text = FormConstants.MENU_TYPE;
	Services.addNode(formNode, XPathConstants.GRID_SRC_DATA_XPATH);
	
	// Display all the child forms for the selection
	var level = 1;
	setupFormsForMenu(level, FormConstants.MAINMENU, blankNode);
	
	Services.endTransaction();
}

/***************************************************************************/

/**
 * Recursive function to display all the forms under the menu specified by parentNode
 * @param [Integer] level The depth of the parentNode in the hierarchy
 * @param [String] parentNode The form name of the menu to display the child forms
 * @author rzxd7g
 * 
 */
function setupFormsForMenu(level, parentNode, blankNode)
{
	// Get a list of matching nodes
	var formList = Services.getNodes(XPathConstants.REF_DATA_XPATH + "/application-config/forms/form[./@screen = '" + parentNode + "']");
	var formNode = null;
	var node = null;
	var formIndex = Services.getValue(XPathConstants.FORM_INDEX_XPATH);
	
	// Loop through all child forms of the parentNode and display them in the grid
	for ( var i=0, l=formList.length; i<l; i++ )
	{
		node = formList[i];
		
		// Application Config stores data in attributes
		var nameAtt = node.getAttribute("name");
		var titleAtt = node.getAttribute("title");
		var typeAtt = node.getAttribute("type");
		
		// Add the child form to the Grid's data source
		formNode = blankNode.cloneNode(true);
		formNode.selectSingleNode("/Form/Name").text = nameAtt;
		formNode.selectSingleNode("/Form/Title").text = getLeadingTabs(level) + titleAtt;
		formNode.selectSingleNode("/Form/Type").text = ( null == typeAtt) ? "screen" : typeAtt;
		Services.addNode(formNode, XPathConstants.GRID_SRC_DATA_XPATH);
		
		// Check if a further menu structure needs to be displayed under the current one
		if ( typeAtt == FormConstants.MENU_TYPE && !CaseManUtils.isBlank(formIndex) && 
			 ( nameAtt == formIndex || isFormUnderCurrentMenu(nameAtt, formIndex) ) )
		{
			// Display all the screens for this menu
			var newLevel = level + 1;
			setupFormsForMenu(newLevel, nameAtt, blankNode);
		}
		
		node = null;
	}
	
	if ( parentNode == FormConstants.MAINMENU )
	{
		// Add the Logout and Exit options under the Main Menu
		var logoutNode = blankNode.cloneNode(true);
		logoutNode.selectSingleNode("/Form/Name").text = FormConstants.LOGOUT_FORM;
		logoutNode.selectSingleNode("/Form/Title").text = getLeadingTabs(level) + "Logout";
		logoutNode.selectSingleNode("/Form/Type").text = FormConstants.SCREEN_TYPE;
		Services.addNode(logoutNode, XPathConstants.GRID_SRC_DATA_XPATH);
		
		var exitNode = blankNode.cloneNode(true);
		exitNode.selectSingleNode("/Form/Name").text = FormConstants.EXIT_FORM;
		exitNode.selectSingleNode("/Form/Title").text = getLeadingTabs(level) + "Exit";
		exitNode.selectSingleNode("/Form/Type").text = FormConstants.SCREEN_TYPE;
		Services.addNode(exitNode, XPathConstants.GRID_SRC_DATA_XPATH);
	}
}

/***************************************************************************/

/**
 * Function indicates if the current menu contains a submenu that the user wishes
 * to access.
 * @param [String] currentMenu The current menu
 * @param [String] formName The form name to search for under the current menu
 * @returns boolean Returns true if the formName resides somewhere under the current menu
 * @author rzxd7g
 */
function isFormUnderCurrentMenu(currentMenu, formName)
{
	var blnFinish = false;
	var blnFound = false;
	var form = formName;
	
	// Starting from the target formName, move upwards to the top level node (MainMenu) or until
	// the formName is found under the current menu
	while ( blnFinish == false && blnFound == false )
	{
		var formNode = Services.getNode(XPathConstants.REF_DATA_XPATH + "/application-config/forms/form[./@name = '" + form + "']");
		var parentAtt = formNode.getAttribute("screen");
		
		if ( parentAtt == currentMenu )
		{
			blnFound = true;
		}
		else if ( parentAtt == FormConstants.MAINMENU )
		{
			blnFinish = true;
		}
		else
		{
			form = parentAtt;
		}
	}
	return blnFound;
}

/***************************************************************************/

/**
 * Return a string to prefix a form title to indent it in the grid
 * @param [Integer] depth The depth of the form in the hierarchy
 * @returns boolean The indent string
 * @author rzxd7g
 */
function getLeadingTabs(depth)
{
	var tabs = ".";
	for(var i=0;i<depth;i++)
	{
		tabs = tabs + "    ";
	}
	if(depth == 0)
	{
		tabs = "";
	}
	return tabs;
}

/**************************** GRIDS ****************************************/

/**
 * Pointless SrcDataOn added due to a problem with framework version 9.0.12
 * @author rzxd7g
 * 
 */
function Detail_FormsGrid () {};
Detail_FormsGrid.tabIndex = 1;
/**
 * @author rzxd7g
 * 
 */
Detail_FormsGrid.isSortable = function(){ return false; }
Detail_FormsGrid.dataBinding = "/ds/var/form/FormsGrid";
Detail_FormsGrid.srcDataOn = [XPathConstants.GRID_SRC_DATA_XPATH];
Detail_FormsGrid.srcData = XPathConstants.GRID_SRC_DATA_XPATH;
Detail_FormsGrid.rowXPath = "Form";
Detail_FormsGrid.keyXPath = "Name";
Detail_FormsGrid.columns = [
	{ xpath: "Title"}
];

/**
 * @param key
 * @author rzxd7g
 * @return FormConstants.CSS_FORM , FormConstants.CSS_SCREEN  
 */
Detail_FormsGrid.rowRenderingRule = function(key)
{
	if( !CaseManUtils.isBlank(key) )
	{
		var formType = Services.getValue(XPathConstants.GRID_SRC_DATA_XPATH + "/Form[./Name = '" + key + "']/Type");
	
		if ( formType == FormConstants.MENU_TYPE )
		{
			// Menu forms to be displayed differently to screen forms
			return FormConstants.CSS_FORM;
		}
		return FormConstants.CSS_SCREEN;
	}
}

/*************************** BUTTONS ***************************************/

function Status_SelectButton () {};

Status_SelectButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "Detail_FormsGrid"} ],
		keys: [ { key: Key.Return, element: "Detail_FormsGrid" } ]
	}
};

Status_SelectButton.tabIndex = 10;
/**
 * @author rzxd7g
 * @return null 
 */
Status_SelectButton.actionBinding = function()
{
	var formKey = Services.getValue(Detail_FormsGrid.dataBinding);
	if ( CaseManUtils.isBlank(formKey) )
	{
		// No row in the grid has been selected, exit without performing an action
		return;
	}

	var formType = Services.getValue(XPathConstants.GRID_SRC_DATA_XPATH + "/Form[./Name = '" + formKey + "']/Type");
	var formIndex = Services.getValue(XPathConstants.FORM_INDEX_XPATH);
	if ( formType == FormConstants.MENU_TYPE )
	{
		if ( formIndex != formKey )
		{
			if ( formKey == FormConstants.MAINMENU )
			{
				Services.setValue(XPathConstants.FORM_INDEX_XPATH, "");
			}
			else
			{
				Services.setValue(XPathConstants.FORM_INDEX_XPATH, formKey);
			}
		
			// Handle opening a new menu
			loadFormsForGrid();
			Services.setFocus("Detail_FormsGrid");

			// Framework hack to set the cursor row of the grid to the currently selected row
			// This needs to be done because when a menu is selected, the source data of the grid
			// is destroyed and then rebuilt so the cursor row is still set based on the previous
			// structure of the grid.
			var a = Services.getAdaptorById("Detail_FormsGrid");
			var row = a.m_model.getDataRowNumberByKey( Services.getValue(Detail_FormsGrid.dataBinding) );
			a.setCursorRow(row);
		}
	}
	else
	{
		// Must be a form, navigate
		switch (formKey)
		{
			case FormConstants.LOGOUT_FORM:
				// Logout
				Services.logoff("CasemanLogin", false);
				break;
				
			case FormConstants.EXIT_FORM:
				// Exit the application
				Services.getAppController().exit();
				break;
				
			case "CreatePostalPayment":
			case "CreateBailiffPayment":
			case "CreateCounterPayment":
				// Payments screen set a parameter
				Services.setValue("/ds/var/app/PaymentParams/PaymentMethod", formKey);
				
			default:
				Services.navigate(formKey);
		}
		
		/*
		if (formKey == "CreatePostalPayment" || formKey == "CreateBailiffPayment" || formKey == "CreateCounterPayment") {
			Services.setValue("/ds/var/app/PaymentParams/PaymentMethod", formKey);
		}
		Services.navigate(formKey);
		*/
	}
}
