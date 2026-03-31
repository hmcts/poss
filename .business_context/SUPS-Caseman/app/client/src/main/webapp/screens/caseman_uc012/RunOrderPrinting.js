/**
 * @fileoverview RunOrderPrinting.js:
 * This file contains the field configurations for UC012 - Run Order Printing screen
 *
 * @author Chris Vincent, Fred Vandendriessche, Anoop Sehdev
 * @version 0.1
 *
 * Change History:
 * 01/06/2006 - Anoop Sehdev, Updated screen in Release 7 to fix Defect 13.
 * 07/07/2006 - Chris Vincent, Added JavaDoc comments, keyBindings and correct tab orders.
 *				Also removed the Cases Popup as was obsolete.
 * 03/07/2007 - Chris Vincent, changes to the screen including adding the Print All button and changing
 * 				the way in which the runOrderPrinting service is called.  CaseMan Defect 6213
 * 05/08/2009 - Mark Groen - made changes for Scalabilty CNN 0042 TRAC 1219
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.
 */

/**
 * XPath Constants
 * @author rzxd7g
 *
 */
function XPathConstants() {};
XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH = "/ds/RunOrderPrinting";
XPathConstants.REF_DATA_XPATH = "/ds/var/form/ReferenceData";
XPathConstants.PRINT_OUTPUTS_NODE_XPATH = "/ds/var/page/Print/Outputs";

/****************************** MAIN FORM *****************************************/

function runOrderPrinting() {}
runOrderPrinting.refDataServices = [
	{ name:"UserInformation", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getUserInformation", serviceParams:[] }
];

/*************************** HELPER FUNCTIONS *************************************/

/**
 * Exits the screen and goes back to the main menu
 * @author rzxd7g
 *
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/**********************************************************************************/
/**
 * Function adds an Output node to the list of Outputs to be printed
 * @param [DOM] blankNode The blank XML Document node to be cloned for insertion
 * @param [String] outputKey The unique identifier of the Output to be printed
 * @author Chris Vincent
 */
function addOutputForPrinting(blankNode, outputKey)
{
	var xpath = XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH + "/Cases/Case/Outputs/WPOutput[Event_Seq="+outputKey+"]";
	var outputID = Services.getValue(xpath + "/OutputId");
	var documentID = Services.getValue(xpath + "/DocumentID");
	var reportID = Services.getValue(xpath + "/ReportID");
	var newOutputNode = blankNode.cloneNode(true);

	newOutputNode.selectSingleNode("/Output/OutputId").appendChild( newOutputNode.createTextNode( outputID ) );
	newOutputNode.selectSingleNode("/Output/DocumentId").appendChild( newOutputNode.createTextNode( documentID ) );
	newOutputNode.selectSingleNode("/Output/ReportId").appendChild( newOutputNode.createTextNode( reportID ) );
	Services.addNode(newOutputNode, XPathConstants.PRINT_OUTPUTS_NODE_XPATH);
}

/******************************* POPUPS *******************************************/

function Outputs_Popup() {}
Outputs_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "Outputs_Popup_CloseButton"} ],
		keys: [ { key: Key.F4, element: "Outputs_Popup" } ]
	}
};

/**
 * @author rzxd7g
 *
 */
Outputs_Popup.onPopupClose = function()
{
	Services.setValue(Main_CaseNumber.dataBinding, "");
}

/**
 * @author rzxd7g
 * @return "Main_CaseNumber"
 */
Outputs_Popup.nextFocusedAdaptorId = function() {
	return "Main_CaseNumber";
}

/******************************** GRIDS *******************************************/

function PrintableOutputs_Grid(){};
PrintableOutputs_Grid.tabIndex = 20;
PrintableOutputs_Grid.dataBinding = "/ds/var/page/PrintableOutputs/Event_Seq";
PrintableOutputs_Grid.srcData = XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH + "/Cases";
PrintableOutputs_Grid.rowXPath = "Case/Outputs/WPOutput";
PrintableOutputs_Grid.keyXPath = "Event_Seq";
PrintableOutputs_Grid.columns = [
	{ xpath: "Event_Seq", sort: "disabled", transformToDisplay: function() { return ""; } },
	{ xpath: "../../CaseNumber"},
	{ xpath: "Event_Id", sort: "numerical"},
	{ xpath: "CreatedOn", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate }
];

/**
 * Display an Adobe Acrobat icon in the first column
 * @param rowId
 * @author rzxd7g
 * @return ( null != rowId ) ? "openOutputClass", ""
 */
PrintableOutputs_Grid.rowRenderingRule = function( rowId )
{
    return ( null != rowId ) ? "openOutputClass" : "";
}

/**************************** INPUT FIELDS ****************************************/

function Main_CaseNumber() {}
Main_CaseNumber.dataBinding = "/ds/var/form/CaseNumber";
Main_CaseNumber.tabIndex = 1;
Main_CaseNumber.maxLength = 8;
Main_CaseNumber.helpText = "Enter a valid case number or use a single wildcard for all cases";

Main_CaseNumber.keyBindings = [
/**
 * @author rzxd7g
 *
 */
	{ key: Key.Return, action: function() {  } }
];

Main_CaseNumber.isMandatory = function() { return true; }
Main_CaseNumber.logicOn = [Main_CaseNumber.dataBinding];
Main_CaseNumber.logic = function()
{
	var value = Services.getValue(Main_CaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		// only retrieve if valid.
        if(null == Main_CaseNumber.validate()){
            var params = new ServiceParams();
            //CNN 0042 TRAC 1219 - add logic
            if (value == '%'){
                // '%' search
                Services.callService("getOutstandingOutputs", params, Main_CaseNumber, true);

            }
            else{
                //full casenumber
                params.addSimpleParameter("caseNumber", value );
                Services.callService("getOutstandingOutputsByCase", params, Main_CaseNumber, true);
            }
        }

	}
}


/**
 * @param dom
 * @author Mark Groen
 *
 * Added as part of scalability changes
 * CNN 0042 TRAC 1219
 * Validates that the case number is valid. Can be '%' or a whole case number.
 *
 */
Main_CaseNumber.validateOn = [Main_CaseNumber.dataBinding];
Main_CaseNumber.validate = function()
{
	// string validation here
	var errCode = null;
	var caseNumber = Services.getValue(Main_CaseNumber.dataBinding);
	// Allowed to be '%' or a full case number

	// check if % first
	if(caseNumber != null && caseNumber.length > 0){

		// Check if format of CaseNumber is correct
		errCode = CaseManValidationHelper.validateCaseNumber(caseNumber);
		if(errCode != null){
			//check if %
			if(caseNumber == '%'){
				errCode = null;
			}
		}
	}

	return errCode;
}



/**
 * @param dom
 * @author rzxd7g
 *
 */
Main_CaseNumber.onSuccess = function(dom)
{
	if ( null != dom )
	{
		Logging.trace("TestShowDOM(): <pre>" + encodeXML(dom.xml + "</pre>"));

		// Place the results in the Reference Data section
		Services.replaceNode(XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH + "/Cases", dom);

		//log the dom
		CaseManUtils.showDOM();

		var resultCount = Services.countNodes(XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH + "/Cases/Case/Outputs/WPOutput");
		if ( resultCount > 0 )
		{
			Services.dispatchEvent("Outputs_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
		}
		else
		{
			// No results found
			alert(Messages.NO_MATCHING_CASES_MESSAGE);
			Services.dispatchEvent("Outputs_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		}
	}
}

Main_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Main_CaseNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*************************** BUTTON FIELDS ****************************************/

function Status_ClearButton() {};
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "runOrderPrinting", alt: true } ]
	}
};

Status_ClearButton.tabIndex = 10;
/**
 * @author rzxd7g
 *
 */
Status_ClearButton.actionBinding = function()
{
	Services.setValue(Main_CaseNumber.dataBinding, "");
}

/*********************************************************************************/

function Status_Close() {}
Status_Close.tabIndex = 11;
Status_Close.actionBinding = exitScreen;
Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "runOrderPrinting" } ]
	}
};

/*********************************************************************************/

function Outputs_Popup_PrintButton() {};
Outputs_Popup_PrintButton.tabIndex = 21;
Outputs_Popup_PrintButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "PrintableOutputs_Grid"} ]
	}
};

/**
 * @author rzxd7g
 *
 */
Outputs_Popup_PrintButton.actionBinding = function()
{
	var printer = Services.getValue(XPathConstants.REF_DATA_XPATH + "/UserInformation/row/PRINTER");
	if ( CaseManUtils.isBlank(printer) )
	{
		alert(Messages.ROP_NOPRINTERSET_MESSAGE);
	}
	else
	{
		var blankNode = Services.loadDOMFromURL("NewOutput.xml");
		var outputKey = Services.getValue(PrintableOutputs_Grid.dataBinding);
		addOutputForPrinting(blankNode, outputKey);

		var outputsNode = XML.createDOM(null, null, null);
		outputsNode.appendChild( Services.getNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH) );

		var params = new ServiceParams();
		params.addSimpleParameter("printer", printer);
		params.addDOMParameter("outputs", outputsNode);
		Services.callService("runOrderPrinting", params, Outputs_Popup_PrintButton, true);
	}
}

/**
 * @param dom
 * @author rzxd7g
 *
 */
Outputs_Popup_PrintButton.onSuccess = function(dom)
{
	alert(Messages.ROP_SINGLEDOCUMENTPRINTED_MESSAGE);
	// Refresh the Grid...
	Services.removeNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH);
	Main_CaseNumber.logic();
}

/**
 * @param exception
 * @author rzxd7g
 *
 */
Outputs_Popup_PrintButton.onError = function(exception)
{
	alert("Error During Printing : " + "\r\n" + exception.message);
	// Refresh the Grid...
	Services.removeNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH);
	Main_CaseNumber.logic();
}

/*********************************************************************************/

function Outputs_Popup_PrintAllButton() {};
Outputs_Popup_PrintAllButton.tabIndex = 22;
Outputs_Popup_PrintAllButton.actionBinding = function()
{
	var printer = Services.getValue(XPathConstants.REF_DATA_XPATH + "/UserInformation/row/PRINTER");
	if ( CaseManUtils.isBlank(printer) )
	{
		alert(Messages.ROP_NOPRINTERSET_MESSAGE);
	}
	else
	{
		var outputList = Services.getNodes(XPathConstants.RUN_ORDER_PRINTING_DATA_XPATH + "/Cases/Case/Outputs/WPOutput/Event_Seq");
		var blankNode = Services.loadDOMFromURL("NewOutput.xml");
		Services.startTransaction();
		for (var i=0, l=outputList.length; i<l; i++)
		{
			var outputKey = XML.getNodeTextContent( outputList[i] );
			addOutputForPrinting(blankNode, outputKey);
		}
		Services.endTransaction();

		var outputsNode = XML.createDOM(null, null, null);
		outputsNode.appendChild( Services.getNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH) );

		var params = new ServiceParams();
		params.addSimpleParameter("printer", printer);
		params.addDOMParameter("outputs", outputsNode);
		Services.callService("runOrderPrinting", params, Outputs_Popup_PrintAllButton, true);
	}
}

Outputs_Popup_PrintAllButton.onSuccess = function(dom)
{
	// Clear the outputs generated
	alert(Messages.ROP_MULTIPLEDOCUMENTSPRINTED_MESSAGE);
	Services.removeNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH);
	Main_CaseNumber.logic();
}

Outputs_Popup_PrintAllButton.onError = function(exception)
{
	alert("Error During Printing : " + "\r\n" + exception.message);
	Services.removeNode(XPathConstants.PRINT_OUTPUTS_NODE_XPATH);
	Main_CaseNumber.logic();
}

/*********************************************************************************/

function Outputs_Popup_CloseButton() {};

Outputs_Popup_CloseButton.tabIndex = 23;
