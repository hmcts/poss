/** 
 * File / Window level variable setting the debug status.  
 * When true, (extra) alertboxes and logging info may be shown/recorded.  
 * When false, the code is expected to run ever slightly more quickly 
 */
var ora_do_D = false;

/** 
 * File / Window level variable setting the perforamce checking status.  
 * When true, (extra) alertboxes and logging info may be shown/recorded.  
 * When false, the code is expected to run ever slightly more quickly 
 */
var ora_do_P = false;

/** 
 * File / Window level variable setting the loggin status.  
 * When true logging text is routed to the application log.  
 * When false, the code is expected to run ever slightly more quickly, as no logging will happen 
 */
var ora_do_L = true && Logging.isTrace();

/**
 * File / Window level variable for OracleReportController singleton testing.
 */
var __OracleReportSingletonTest = -1;

/**
 *	OracleReportController class.
 *
 *	Processes requests for requesting Oracle Report.
 *
 *	Concepts:
 *	=========
 *	- request OracleReport Controller with contextXML
 *	- reference data loading
 *	
 * @constructor		
 */
function OracleReportController(appCtrl)
{
	WPCtrl.apply(this, [appCtrl]);

	/** Instance attribute - to test the singleton use of this processor only */
	this.__id = (++__OracleReportSingletonTest);

	/** Instance attribute - the OracleReportController configuration data */
	this.__configXML = null;
	
	/** Instance attribute - the running request, or the one just created by process() - but not yet ran as there might be WP to do first... */
	this.__runningRequest = null;
	
	if (doLog) do_Log(this + " finished constructor");
}

/**
 *
 */
OracleReportController.prototype = new WPCtrl();

/**
 *
 */
OracleReportController.prototype.constructor = OracleReportController;

/**
 * Class attribute holding the singleton (instance of the) OracleReportController
 */
OracleReportController.__instance = null;

/**
 * Overriding default toString 
 * @returns String describing this OracleReportController (singleton instance)
 */
OracleReportController.prototype.toString = function()
{
	return "CaseManORACtrl";
}

/**
 * overriding the wpprocess method
 */
OracleReportController.prototype.process = function(WPS, formctrl, context, callback, alwaysCallback) {
	if (doLog) do_Log(this + ".process("+formctrl+", "+context+", "+callback+", "+alwaysCallback+")");
	var process = this.processFindRequest(formctrl, context, callback, alwaysCallback);
	if (null != process) {
		//anything to set up on process?
		if (doLog) do_Log(this + ".process(...) to add to processQ: "+process.toString());
		this.addProcessToQ(process, true); }
	else {
		alert("No Oracle Report process started");		
	}
	return process; }
	
/**
 * override the parent - don't change the parent.
 */
OracleReportController.prototype.processFindRequest = function(formctrl, context, callback, alwaysCallback) 
{
	var process = this.identifyProcess(formctrl, context, callback, alwaysCallback); 
	return process;
}
/**
 *	OracleReportController instance getter - returns, and creates if necessary, the singleton
 */
OracleReportController.getInstance = function()
{
	if (null == OracleReportController.__instance)
	{
		OracleReportController.__instance = new OracleReportController();
	}
	return OracleReportController.__instance;
}

/**
 * CaseMan ORA Word Processing Controller identifyRequest function 
 * <pre>Analyzes the contextxml and returning the appropriate process to run or null;
 * This function overrides the superclass' function!</pre>
 * @type WPRequest
 * @argument formctrl			form controller
 * @argument context			xml fragment stating the context for the request
 * @argument cb		callback
 * @argument acb	always callback
 * @returns WPRequest or null
 */
OracleReportController.prototype.identifyProcess = function(formctrl, context, cb, acb) 
{
	 var pro = null;
	 if (null != context) 
	 {
	 	pro = WPProcess.FindProcessFor(this, context, cb, acb); 
	 }
	 return pro; 
}


/**
 * Private function iterating the OracleReportOutput instances till one is found which considers the xml to be its trigger for creation
 */
OracleReportController.prototype._findOutput = function(xml, callback) 
{
	if (doLog) do_Log(this + "_findOutput(...,"+callback+")");
	var output = null;
	var x =	OracleReportOutput.all.length;
	for (var i = 0; i < x; i++) 
	{
		var o = OracleReportOutput.all[i];
		if (o.isOutputFor(xml, callback)) 
		{
			output = o;
			break; 	
		} 
	}
	return output; 
}

/**
 * SUPS OracleReport Word Procesing Controller function returning the url pointing at CaseMan ORA WPController's configuration xml
 * This function overrides the WPCtrl abstract function!
 * @returns String representation of the url hosting the CaseMan ORA WPController's configuration xml
 */
OracleReportController.prototype.getControllerConfigXMLUrl = function() 
{
	return "../caseman_oracle_reports/generated/WordProcessingConfig.xml"; 
}

/**
 *
 */
OracleReportController.prototype.initialize = function() 
{
	if (doLog) do_Log(this + " initialize() starts ")
	//var dom = CaseManWPS.createDOM(null,null,null);
	var url = this.getControllerConfigXMLUrl();
	if (doLog) do_Log(this + " initialize() loading from " +url+"...")	
	var dom = WPS.loadDOMFromURL(url);
	if (doLog) do_Log(this + " initialize() loading from " +url+"... Complete, success=" +s)
	//if (!s) throw new Error(WPCtrlErr.____1);		
	this.configxml = dom;
	//s = (null != dom.selectSingleNode("/configuration"))
	//if (!s) throw new Error(WPCtrlErr.____3);	
	//s = this.initializeXPaths("CaseManWPXPath");
	//if (!s) throw new Error(WPCtrlErr.____4);	
	var s = this.initializeProcess("OracleReportProcess");
	if (!s) throw new Error(WPCtrlErr.____5);	
	
	this._setOutputTypes()
	
	if (doLog) do_Log(this + " initialize() ends");
}


/**
 *	loading xml file configuration
 */
OracleReportController.prototype._setOutputTypes = function()
{
	var msg = "OracleReportController.prototype._setOutputTypes ";
	if (ora_do_L) Logging.trace(msg + "check singleton = " + this);
	dom = this.configxml;
	if (ora_do_L) Logging.trace(msg + "dom.xml = " + (  ((null==dom) ? "null.dom?" : XML.showFullDom(dom)) ));	
	// for now, contiune to instantiate the OracleReportOutput objects, later on, we're going to do this 'staged'
	dom.setProperty("SelectionLanguage", "XPath");
	var outputNodes = dom.selectNodes("configuration/Outputs/Output");
	var outputNodesLength = outputNodes.length;
	if (ora_do_L) Logging.trace(msg  +" outputTypesNodesLength = " + outputNodesLength);
	for (var i=0; i < outputNodesLength; i++) 
	{
		var outputNode = outputNodes.item(i);
		var _OutputId = XML.selectNodeGetTextContent(outputNode, "Id");
		var _DisplayId = XML.selectNodeGetTextContent(outputNode, "NReference");
		var _x_eventId = "";
		var _x_eventCode = "";
		var _x_orderID = "";
		var _x_mainOrderID = "";
		var _x_hearingType = "";
		var _x_bulkPrint = "";
		var eventNodes = dom.selectNodes("configuration/Events/Event/Output[@id = '"+_OutputId+"']/..");
		if (eventNodes && 0 < eventNodes.length) 
		{
			var eventNode = eventNodes[0];
			_x_eventId = eventNode.getAttribute("id");
			_x_eventCode = eventNode.getAttribute("code"); 
			_x_orderID = eventNode.getAttribute("order"); 
			_x_mainOrderID = eventNode.getAttribute("mainOrderId"); 
			_x_hearingType = eventNode.getAttribute("hearingType"); 
			_x_bulkPrint = eventNode.getAttribute("bulkprint"); 
		}
		var _EventId = _x_eventId;
		var _EventCode = _x_eventCode;
		var orderID = _x_orderID;
		var mainOrderID = _x_mainOrderID;
		var hearingType = _x_hearingType;
		var bulkPrint = _x_bulkPrint;
		var _Description = XML.selectNodeGetTextContent(outputNode, "Description");
		var _QA = XML.selectNodeGetTextContent(outputNode, "QA");
		var _WP = XML.selectNodeGetTextContent(outputNode, "WP");
		var Reload = XML.selectNodeGetTextContent(outputNode, "Reload");
		OracleReportOutput.all[OracleReportOutput.all.length] = 
			new OracleReportOutput(_Description,_EventId ,_EventCode ,_OutputId,_DisplayId,orderID,mainOrderID,hearingType,bulkPrint);
	}
}
