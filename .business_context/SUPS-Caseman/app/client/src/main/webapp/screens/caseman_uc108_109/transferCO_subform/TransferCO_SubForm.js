/** 
 * @fileoverview TransferCO_SubForm.js:
 * This file contains the configurations for the Transfer CO Subform
 *
 * @author Anthony Bonnar
 *
 * Amended MGG 11/01/2006
 * Description:
 * Set flag in onSuccess method so know whether to set the CO status 
 * to TRANSFERRED and create 777 events.
 * Amended MGG 17/01/2006
 * Description:
 * After transing with report discovered onSuvcces not called so now set using returnSourceNodes: etc
 *
 * Change History
 * 12/06/2006 - Chris Vincent: Added missing keyBinding of F4 on the close button.
 *				Also changed global variables to static variables as per code review defect.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 14/06/2007 - Mark Groen. Caseman defect 6252 - improve performance re loading subform.  Now use dummy file name in modifyLifeCycle
 *				as already got court data from Maintain CO.
 * 15/02/2011 - Chris Vincent, multiple changes to allow full transfer of Consolidated Order (including Court validation and call to
 *				Transfer CO Details report removed).  Trac 4215.
 */
 
/**
 * XPath Constants
 * @author hzw6j7
 * 
 */
function XPathConstants() {};
XPathConstants.DATA_XPATH = "/ds/transferred";
XPathConstants.VAR_FORM_XPATH = "/ds/var/app";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.SUBFORM_DATA_XPATH = "/ds/var/form/SubForms/TransferCO";

/************************** FORM CONFIGURATIONS *************************************/

function transferCOSubform() {}

transferCOSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "transferDOM.xml",
	dataBinding: XPathConstants.REF_DATA_XPATH
}

transferCOSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "TransferCO_TransferButton"} ],
                    doubleClicks: []
                  },
	returnSourceNodes: ["/ds/transferred"],
	
	modify: {},
/**
 * @author hzw6j7
 * 
 */
	preprocess: function()
				{
					// Retrieve the parameter from the calling screen
					var CONumber = Services.getValue(TransferCOParams.CO_NUMBER);
					if ( !CaseManUtils.isBlank(CONumber) )
					{
						// generate a parameter dom that we shall pass to the interface service
						Services.setValue(XPathConstants.DATA_XPATH + "/CONumber", CONumber);
					}
				},

	postSubmitAction: {
		close: {}
	}

}

transferCOSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "transferCOSubform" } ],
					singleClicks: [ {element: "TransferCO_CloseButton"} ],
					doubleClicks: []
				  },
	raiseWarningIfDOMDirty: false
}
/****************************** DATA BINDINGS **************************************/
TransferCO_Court_Name.dataBinding = XPathConstants.DATA_XPATH + "/courtName";
TransferCO_Court_Code.dataBinding = XPathConstants.DATA_XPATH + "/courtCode";
/***********************************************************************************/

/******************************* LOV POPUPS ****************************************/

function TransferCO_CourtName_LOVGrid() {};

TransferCO_CourtName_LOVGrid.dataBinding = XPathConstants.DATA_XPATH + "/courtCode";
TransferCO_CourtName_LOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
TransferCO_CourtName_LOVGrid.rowXPath = "Court";
TransferCO_CourtName_LOVGrid.keyXPath = "Code";
TransferCO_CourtName_LOVGrid.columns = [
	{xpath: "Code", sort: "numerical"},
	{xpath: "Name"}
];


TransferCO_CourtName_LOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "TransferCO_CourtName_LovBtn"} ],
		keys: [ { key: Key.F6, element: "TransferCO_Court_Code" }, { key: Key.F6, element: "TransferCO_Court_Name" } ]
	}
};

/**
 * @author hzw6j7
 * @return "TransferCO_Court_Name"  
 */
TransferCO_CourtName_LOVGrid.nextFocusedAdaptorId = function() {
	return "TransferCO_Court_Name";
}

function runTransferCOReportHandler(){};
       	  	
/**
 * @param exception
 * @author hzw6j7
 * 
 */
 	runTransferCOReportHandler.onError = function(exception)
    { 
    	// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var preExceptionMethod = null;
		// Loop through the exception hierachy from highest to lowest
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
		{
	    	preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception?
			if(preExceptionMethod != undefined)
			{
			preExceptionMethod.call(this, exception);
			break;
			}
		}
	
    	Logging.error(exception.message);
		var err = null;
		if (exception.message.indexOf("'") < 0)
		{
			ErrorCode.getErrorCode("Caseman_Err" + exception.name);
		}
    
    	// if no message exists for exception type.
    	if (err == null || err.getMessage() == null || err.getMessage() == "")
    	{
    		//FormController.getInstance().setStatusBarMessage(exception.message);
    		Services.setTransientStatusBarMessage(exception.message);
    		alert(exception.message);
    	}
    	else // display message.
    	{
    		//FormController.getInstance().setStatusBarMessage(err.getMessage());
    		Services.setTransientStatusBarMessage(err.message);
    		alert(err.message);
   		}
    
		// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var postExceptionMethod = null;
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
		{
	    	postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception
			if(postExceptionMethod != undefined)
			{
			postExceptionMethod.call(this, exception);
			break;
			}
		}
         	  
     }
     
/**
 * @author hzw6j7
 * 
 */
    runTransferCOReportHandler.onSuccess = function()
    {     	    	
		Services.setTransientStatusBarMessage("Transfer CO Report Complete.");		
    }

/********************************  FIELDS ******************************************/

function TransferCO_Court_Code() {}
TransferCO_Court_Code.componentName = "Court Code";
TransferCO_Court_Code.tabIndex = 1;
TransferCO_Court_Code.maxLength = 3;
TransferCO_Court_Code.helpText = "Unique three digit court location code";
TransferCO_Court_Code.isMandatory = function() { return true; }
TransferCO_Court_Code.validate = function()
{
	var ec = null;
	var code = Services.getValue(TransferCO_Court_Code.dataBinding);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCO_Court_Code.dataBinding + "]/Name");
	if ( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	else if ( code == Services.getValue(XPathConstants.SUBFORM_DATA_XPATH + "/CurrentOwningCourt") )
	{
		// The Court Code entered is identical to the current Owning Court Code
		ec = ErrorCode.getErrorCode("CaseMan_transferCO_transferToSelf_Msg");
	}
	else if ( code == CaseManUtils.CCBC_COURT_CODE )
	{
		// Cannot transfer a CO to CCBC
		ec = ErrorCode.getErrorCode("CaseMan_transferCO_transferToCCBC_Msg");
	}
	return ec;
}

// Configure the location in the model which will generate data change events
TransferCO_Court_Code.logicOn = [TransferCO_Court_Code.dataBinding];
TransferCO_Court_Code.logic = function(event)
{
	if (event.getXPath() != TransferCO_Court_Code.dataBinding)
	{
		return;
	}
	
	var value = Services.getValue(TransferCO_Court_Code.dataBinding);
	if (!CaseManUtils.isBlank( value ) )
	{
		// Populate the Name field
		var name = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + TransferCO_Court_Code.dataBinding + "]/Name");
		if (Services.getValue(TransferCO_Court_Name.dataBinding) != name)
		{
			Services.setValue(TransferCO_Court_Name.dataBinding, name);			
		}
	}
	else
	{
		Services.setValue(TransferCO_Court_Name.dataBinding, "");
	}
}

/**
 * @param forward
 * @author hzw6j7
 * @return "TransferCO_Court_Name" , "TransferCO_CloseButton"  
 */
TransferCO_Court_Code.moveFocus = function(forward)
{
	if (forward)
	{
		return "TransferCO_Court_Name";
	}
	return "TransferCO_CloseButton";
}

/*********************************************************************************/

function TransferCO_Court_Name() {}
TransferCO_Court_Name.componentName = "Court Name";
TransferCO_Court_Name.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
TransferCO_Court_Name.rowXPath = "Court";
TransferCO_Court_Name.keyXPath = "Name";
TransferCO_Court_Name.displayXPath = "Name";
TransferCO_Court_Name.strictValidation = true;
TransferCO_Court_Name.tabIndex = 2;
TransferCO_Court_Name.helpText = "Name of the court";
TransferCO_Court_Name.isMandatory = function() { return true; }
TransferCO_Court_Name.logicOn = [TransferCO_Court_Name.dataBinding];
TransferCO_Court_Name.logic = function(event)
{
	if (event.getXPath() != TransferCO_Court_Name.dataBinding)
	{
		return;
	}
	var value = Services.getValue(TransferCO_Court_Name.dataBinding);
	if (!CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + TransferCO_Court_Name.dataBinding + "]/Code");
		if (!CaseManUtils.isBlank(code) && Services.getValue(TransferCO_Court_Code.dataBinding) != code)
		{
			Services.setValue(TransferCO_Court_Code.dataBinding, code);			
		}
	}
}

/****************************** BUTTON FIELDS **************************************/

function TransferCO_CourtName_LovBtn() {}
TransferCO_CourtName_LovBtn.tabIndex = 3;

/**********************************************************************************/
function TransferCO_TransferButton() {}

TransferCO_TransferButton.tabIndex = 4;

/**********************************************************************************/
function TransferCO_CloseButton() {}
TransferCO_CloseButton.tabIndex = 5;
