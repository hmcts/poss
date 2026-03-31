/*****************************************************************************************************************
                                            CONSTANTS
*****************************************************************************************************************/

var REF_DATA_XPATH = "/ds/var/form/ReferenceData";

// CPV TODO - Default user needs to be set by the client side security
// FVDD - DO NOT CHANGE the DEFAULT_USER unless the notice of issue store2() is no longer hard coded too.
var DEFAULT_USER = "DEFAULT_USER";

var FORM_NAME = "WPStub";
/****************************************************************************************************************
                                  MAIN FUNCTION CALLED BY HTML
****************************************************************************************************************/

var frmCtrl = null;
var appCtrl = null;
var session = null;
var wpCtrl = null;
var request = null;
var output = null;
var outputOrder = "";


/**
 * @author rzxd7g
 * 
 */
function initForm()
{ 
   
    FormController.initialise(document.forms.WordProcessingStub);
	Logging.initialise();	
	frmCtrl = FormController.getInstance();
	appCtrl = frmCtrl.getAppController();
	wpCtrl = appCtrl._wpCtrl.getInstance();
	session = appCtrl.getSession();
	Services.setValue(CaseNumber.dataBinding, "NBN11111");	
	
}

/**
 * @author rzxd7g
 * 
 */
function showDOM()
{
	var x = Services.getNode("/");
	Logging.error("showDOM(): <pre>" + encodeXML(x.xml + "</pre>"));
}

/*****************************************************************************************************************
                                               MAIN FORM
*****************************************************************************************************************/

/**
 * Form element
 * @author rzxd7g
 * 
 */
function wordProcessingStub() { }

wordProcessingStub.refDataServices = [
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourts", serviceParams:[]} 
];

// Load the reference data from the xml into the model
//runOrderPrinting.refDataServices = [{name:"Cases", dataBinding:REF_DATA_XPATH, fileName:"Cases.xml"}];

// Load the business data	
//runOrderPrinting.loadModelDataService = {dataBinding:"/ds", fileName:"RunOrderPrinting.xml"};

/*****************************************************************************************************************
                                          OTHER FUNCTIONS
*****************************************************************************************************************/

/**
 * @author rzxd7g
 * 
 */
function clearReferenceData()
{   
	// Clear the Reference Data section of the DOM
	Services.removeNode(REF_DATA_XPATH);
}



function CaseNumber() {}
function EventNumber() {}
function EventPK() {}
function EventCode() {}
/*****************************************************************************************************************
                                            DATA BINDINGS
*****************************************************************************************************************/

CaseNumber.dataBinding = "/ds/WordProcessing/Case/CaseNumber";
EventNumber.dataBinding = "/ds/WordProcessing/Event/CaseEventSeq";
EventPK.dataBinding = "/ds/WordProcessing/Event/StandardEventId";
EventCode.dataBinding = "/ds/WordProcessing/Event/Code";

/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/



EventNumber.tabIndex = 1;
EventNumber.maxLength = 8;
EventNumber.srcData = null;
EventNumber.rowXPath = null;
EventNumber.keyXPath = null;
EventNumber.displayXPath = null;
EventNumber.helpText = "Select a valid event number - list available";

EventNumber.isMandatory = function()
{ 
  
	return true;
}


EventCode.tabIndex = 1;
EventCode.maxLength = 8;
EventCode.srcData = null;
EventCode.rowXPath = null;
EventCode.keyXPath = null;
EventCode.displayXPath = null;
EventCode.helpText = "Enter a valid case code";

EventCode.isMandatory = function()
{ 
	return true;
}


EventPK.tabIndex = 1;
EventPK.maxLength = 8;
EventPK.srcData = null;
EventPK.rowXPath = null;
EventPK.keyXPath = null;
EventPK.displayXPath = null;
EventPK.helpText = "Enter a valid event primary key - yeah... we know...";

EventPK.isMandatory = function()
{ 
	return true;
}


CaseNumber.tabIndex = 1;
CaseNumber.maxLength = 8;
CaseNumber.srcData = null;
CaseNumber.rowXPath = null;
CaseNumber.keyXPath = null;
CaseNumber.displayXPath = null;
CaseNumber.helpText = "Enter a valid case number - list available";

CaseNumber.isMandatory = function()
{  

	return true;
}



function Status_ClearButton() {};
/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	Services.setValue(EventNumber.dataBinding, "");
	Services.setValue(EventCode.dataBinding, "");
}


function Status_SaveButton() {};
/**
 * @author rzxd7g
 * 
 */
Status_SaveButton.actionBinding = function()
{
	//dom = frmCtrl.getDataModel().getInternalDOM();
	
    var caseId = Services.getValue(CaseNumber.dataBinding);	
	var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", caseId );
		Services.callService("getCase", params, LoadCaseHandler, true);
}

/**
 * @param 
 * @author rzxd7g
 * 
 */
function callEvent( )
{	var eventId = Services.getValue(EventPK.dataBinding);
	var code = Services.getValue(EventCode.dataBinding);
	 var caseId = Services.getValue(CaseNumber.dataBinding);	
	
	var scnNo = Services.getValue("/ds/ManageCase/SCN[@table='C']");
	var caseType = Services.getValue("/ds/ManageCase/CaseType");
	
	var wpDom = XML.createDOM();
	wpDom.loadXML("<WordProcessing>"+
					"<Case>"+
						"<SCN table=\"C\">"+scnNo+"</SCN>"+
	  					"<CaseNumber>"+caseId+"</CaseNumber>"+
	  					"<CaseType>"+caseType+"</CaseType>"+
  					"</Case>"+
					"<Event>"+
	  					"<CaseEventSeq>106874</CaseEventSeq>"+
	  					"<StandardEventId>"+eventId+"</StandardEventId>"+
	  					"<Code>"+code+"</Code>"+
  					"</Event>"+
  				"</WordProcessing>");
  				
  				
  				
  	Services.replaceNode("/ds/WordProcessing", wpDom.selectSingleNode("/"));
  	
  				
	Logging.trace("INVOKING interface method on WordProcessing Controller");
	
	
	//FORM_NAME = "ManageEvents";
	wpCtrl.process(wpDom, FORM_NAME);
	

}

function LoadCaseHandler(){}
/**
 * @param dom
 * @author rzxd7g
 * 
 */
LoadCaseHandler.onSuccess = function(dom)
{   
    //copy results into dom
    Services.replaceNode("/ds/ManageCase", dom.selectSingleNode("/ds/ManageCase"));	
	callEvent();	
}

