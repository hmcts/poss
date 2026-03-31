/** 
 * @fileoverview PayableOrder_SubForm.js:
 * This file contains the configurations for the PayableOrder Subform
 *
 * @author Anthony Bonnar
 *
 * Change History
 * 14/11/2006 - Chris Vincent, removed the confirm() popup from PayableOrder_OkButton.actionBinding
 * 				as was not required (UCT CaseMan Defect 671).
 */
 
/****************************** CONSTANTS ******************************************/

var DATA_XPATH = "/ds/PayableOrder";
var VAR_FORM_XPATH = "/ds/var/form";
var VAR_PAGE_XPATH = "/ds/var/page";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";


/************************** FORM CONFIGURATIONS *************************************/

function payableOrderSubform() {}

payableOrderSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "PayableOrderDOM.xml",
	dataBinding: REF_DATA_XPATH
}

payableOrderSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },
	fileName: "PayableOrderDOM.xml",
	dataBinding: REF_DATA_XPATH
}
//returnSourceNodes:[VAR_FORM_XPATH + "/poProcessed"],                  
payableOrderSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },
	
/**
 * @author hzw6j7
 * 
 */
	preprocess: function()
				{
					// Retrieve the PONumber
					var poNumber = Services.getValue(PayableOrder_PONumber.dataBinding);
					if ( !CaseManUtils.isBlank(poNumber) )
					{
						// generate a parameter dom that we shall pass to the interface service
						Services.setValue(DATA_XPATH + "/PONumber", poNumber);
					} else {
						alert('PO Number is blank');
					}
				},
    modify: {},
	postSubmitAction: {
		close: {}
	}

}

payableOrderSubform.cancelLifeCycle = {

  	raiseWarningIfDOMDirty: false
}


/********************************  FIELDS ******************************************/

function PayableOrder_PONumber() {}

PayableOrder_PONumber.tabIndex = 1;
PayableOrder_PONumber.maxLength = 6;
PayableOrder_PONumber.dataBinding = DATA_XPATH + "/PONumber";
PayableOrder_PONumber.helpText = "Enter 6 digit Payable Order Number and Press Proceed";

PayableOrder_PONumber.validate = function()
{
	var errCode = null;
	
	// Retrieve value from the DOM
	var poNumber = Services.getValue(PayableOrder_PONumber.dataBinding);
	
	
	if (!isValidPoNumber(poNumber)) {
		errCode = ErrorCode.getErrorCode("CaseMan_completePayoutPONumberLength_Msg");
	}
	 	
	return errCode;
}

// Configure the location in the model which will generate data change events
PayableOrder_PONumber.logicOn = [PayableOrder_PONumber.dataBinding];
PayableOrder_PONumber.logic = function(event)
{
	if (event.getXPath() != PayableOrder_PONumber.dataBinding)
	{
		return;
	}
	
	var value = Services.getValue(PayableOrder_PONumber.dataBinding);
	if (isValidPoNumber(value))
	{
		errCode = ErrorCode.getErrorCode("CaseMan_completePayoutPONumberLength_Msg");
	}
}

/**
 * @author hzw6j7
 * 
 */
function requestPayableOrderReport()
{
	// If the validation of the button status succeeds, request the report. 
	if (CaseManValidationHelper.validateFields(PayableOrder_OkButton.validationList) )
	{ 
		var dom = Reports.createReportDom("CM_PYORD.rdf");
		Reports.setValue(dom, "P_PO_START", Services.getValue(PayableOrder_PONumber.dataBinding));
		Reports.runReport(dom, null, "payableOrderSubform");
	}				
}

/**********************************************************************************/
PayableOrder_OkButton.validationList = [];
function PayableOrder_OkButton() {}

PayableOrder_OkButton.tabIndex = 2;
PayableOrder_OkButton.enableOn = [PayableOrder_PONumber.dataBinding]
PayableOrder_OkButton.isEnabled = function()
{
	// Retrieve value from the DOM
	var poNumber = Services.getValue(PayableOrder_PONumber.dataBinding);
	return (isValidPoNumber(poNumber));
}

/**
 * @author hzw6j7
 * 
 */
PayableOrder_OkButton.actionBinding = function() {
	requestPayableOrderReport();
    Services.setValue(VAR_FORM_XPATH + "/poProcessed", "Y");
}


/**********************************************************************************/
function PayableOrder_CancelButton() {}
PayableOrder_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "payableOrderSubform" } ]
	}
};
PayableOrder_CancelButton.tabIndex = 3;
/**
 * @author hzw6j7
 * 
 */
PayableOrder_CancelButton.actionBinding = function() {
	if (!Services.getValue(VAR_FORM_XPATH + "/poProcessed") == "Y") {
		Services.setValue(VAR_FORM_XPATH + "/poProcessed", "N");
	}
 	Services.dispatchEvent("payableOrderSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
}

/**********************************************************************************/
/**
 * Ensure the PO Number is a valid one
 * @param poNumber
 * @author hzw6j7
 * @return validPoNumber  
 */
function isValidPoNumber(poNumber){

	var validPoNumber = true;
	
	if (CaseManUtils.isBlank(poNumber)){
		validPoNumber = false;
 	} else if (!isNumeric(poNumber)) {
		validPoNumber = false
 	} else if (poNumber.length < 6) {
		validPoNumber = false
	} else if (null == poNumber) {
		validPoNumber = false
	}
	
	return validPoNumber;
}

/**********************************************************************************/
/**
 * Ensure the PO Number is a numeric
 * @param poNumber
 * @author hzw6j7
 * @return boolean 
 */
function isNumeric(poNumber) {

	var numeric = '0123456789';
 
 	if (null != poNumber) {
	 	for (i=0; i<poNumber.length; i++) {
    		if (numeric.indexOf(poNumber.charAt(i),0) == -1) return false;
		}
  	}
  	
  	return true;
}

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author hzw6j7
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}	
