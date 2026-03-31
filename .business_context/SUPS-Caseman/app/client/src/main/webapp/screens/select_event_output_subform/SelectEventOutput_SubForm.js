/** 
 * @fileoverview SelectEventOutput_SubForm.js:
 * This file contains the configurations for the Select Event Output Subform
 *
 * @author Chris Vincent
 */

/****************************** CONSTANTS ******************************************/

var DATA_XPATH = "/ds/Outputs";
var SELECTED_OUTPUT_XPATH = "/ds/var/page/Grids/OutputId";

/************************** FORM CONFIGURATIONS *************************************/

function selectEventOutputSubform() {}

/**
 * @author rzxd7g
 * 
 */
selectEventOutputSubform.initialise = function()
{
	var dataNode = Services.getNode("/ds/var/form/Subforms/SelectOutputData/Outputs");
	Services.replaceNode(DATA_XPATH, dataNode);
}

selectEventOutputSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "OutputDOM.xml",
	dataBinding: "/ds"
}

selectEventOutputSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "OutputDOM.xml",
	dataBinding: "/ds"
}

selectEventOutputSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "SelectEventOutput_SelectButton"} ],
                    doubleClicks: [ { element: "SelectEventOutput_OutputGrid"} ]
                  },

	modify: {},
	
	returnSourceNodes: [SELECTED_OUTPUT_XPATH],
	postSubmitAction: {
		close: {}
	}
}

selectEventOutputSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "selectEventOutputSubform" } ],
					singleClicks: [ {element: "SelectEventOutput_CancelButton"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/*********************************** GRIDS *****************************************/

function SelectEventOutput_OutputGrid() {};
SelectEventOutput_OutputGrid.tabIndex = 1;
SelectEventOutput_OutputGrid.dataBinding = SELECTED_OUTPUT_XPATH;
SelectEventOutput_OutputGrid.srcData = DATA_XPATH;
SelectEventOutput_OutputGrid.rowXPath = "Output";
SelectEventOutput_OutputGrid.keyXPath = "OutputId";
SelectEventOutput_OutputGrid.columns = [
	{xpath: "OutputId", sort: "disabled", transformToDisplay: function() { return ""; } },
	{xpath: "OutputId"},
	{xpath: "Description"}
];

/**
 * @param rowId
 * @author rzxd7g
 * @return classList  
 */
SelectEventOutput_OutputGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
	    var failedOutput = false;
      	var outputStatus = Services.getValue(DATA_XPATH + "/Output[./OutputId = '" + rowId + "']/Final");
      	
      	var documentId = Services.getValue(DATA_XPATH + "/Output[./OutputId = '" + rowId + "']/DocumentId");
  		if (null == documentId || documentId == "")
  		{
  			failedOutput = true;
  		}
  		
      	if ( outputStatus == "N" )
      	{
      		if (!failedOutput)
      		{
      			// editOutputClass (output to be edited)
          		classList = "editOutputClass";
          	}
          	else
          	{
	          	// failOutputClass (output failed)
          		classList = "failOutputClass";
          	}
      	}
      	else if ( outputStatus == "Y" )
      	{
      		if (!failedOutput)
      		{
      			// openOutputClass (output completed)
          		classList = "openOutputClass";
          	}
          	else
          	{
	          	// failOutputClass (output failed)
          		classList = "failOutputClass";
          	}
      	}
	}
    return classList;
}

/****************************** BUTTON FIELDS **************************************/

function SelectEventOutput_SelectButton() {};
SelectEventOutput_SelectButton.tabIndex = 10;

/***********************************************************************************/

function SelectEventOutput_CancelButton() {};
SelectEventOutput_CancelButton.tabIndex = 11;
