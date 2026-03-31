/** 
 * 	Holds an Output Object and lets the Controller queue and dequeue it for processing.
 *	
 *	This OracleReportRequest Implementation is presently only tested for Notice Of Issue create and view ouput.
 *	
 *	The WPPrintRequest implementation is tested for the Run Order Printing implementation of CaseMAN release 1.
 *
 * @constructor
 **/
function OracleReportRequest(contextXML, process)
{
	WPMSRequest.apply(this, ["OracleReportRequest",contextXML, process]);
	/** event causing this request */
	this._eventId = null;
	/** Contains the xml passed to the OracleReport controller Integration Point. */
	this._contextxml = contextXML;
	/** Contains reference to the OracleReportController*/
	this._controller = WP.GetInstance("OracleReportController");
	/** Contains the type of output this request is creating (set by the WPCtrl). */
	this._output = null; 
	
	if (ora_do_L) Logging.trace("OracleReportRequest instantiated. (Output="+this._output+")"); 
}

/**
 *
 */
OracleReportRequest.prototype = new WPMSRequest("CaseManCreateRequest");

/**
 *
 */
OracleReportRequest.prototype.constructor = OracleReportRequest;

/**
 * Instance funciton to get the event number for the request
 * @return the event number (standard event id)
 */
OracleReportRequest.prototype.getEventNumber = function() 
{
	var eventNo = XML.getNodeTextContent(this._contextxml.selectSingleNode(OracleReportXPath.rel2.eventNumber));	
	if (ora_do_D) alert("OracleReportRequest.prototype.getEventNumber() eventNo : " + eventNo);
	if (ora_do_L) Logging.trace("OracleReportRequest.prototype.getEventNumber() eventNo : " + eventNo);
	return eventNo; 
}

/**
 * Instance function to get the event primary key of this request
 * @retun the event db pk
 */
OracleReportRequest.prototype.getEventPK = function() 
{
	var eventId = XML.getNodeTextContent(this._contextxml.selectSingleNode(OracleReportXPath.rel2.eventPK));
	if (ora_do_D) alert("OracleReportRequest.prototype.getEventPK() event pk : " + eventId);
	if (ora_do_L) Logging.trace("OracleReportRequest.prototype.getEventPK() event pk: " + eventId);
	return eventId; 
}

/**
 * Instance function to get the case number of this request
 * @retun the case number
 */
OracleReportRequest.prototype.getCaseNumber = function() 
{
	var num = XML.getNodeTextContent(this._contextxml.selectSingleNode(OracleReportXPath.rel2.caseNumber));
	if (ora_do_D)alert("OracleReportRequest.prototype.getCaseNumber() : " + num);
	if (ora_do_L)Logging.trace("OracleReportRequest.prototype.getCaseNumber() : " + num);	
	return num; 
}
		
/**
 *	Public toString() implementation for a OracleReportRequest (create and view ouput)
 *	@returns String in the format of "OracleReportRequest (output: "+this._output+")"
 **/
OracleReportRequest.prototype.toString = function() 
{
	return "OracleReportRequest"; 
}

/**
 *
 */
OracleReportRequest.prototype.getOutput = function() 
{   
	return this._output; 
}

/**
 *
 */
OracleReportRequest.prototype.FindOutputToProcess = function(contextxml, process, wpctrl, outputClass) 
{
	var output = null;
	var config = wpctrl.getConfigXML();	
	if (null != config && null == output) 
	{	
		output = this._controller._findOutput(contextxml, process.getCallback());
		if (ora_do_L) Logging.trace("OracleReportRequest.prototype._findOutput() found output " + output);		
		if (ora_do_D && (null == this._output)) alert("No output could be found for " +config); 
	}
	return output; 
}
	