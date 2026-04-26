/**
 * The OracleReportOutput JavaScript Object represents 'an output'.
 *
 *	A OracleReportOutput is identified by
 *	- ref_n: the N* reference, as the customer prefers refering to outputs
 *  - ref_cjr: the CJR* reference, as eds refers to outputs (since RFC ...)
 *  - ref_txt: output title, excluding the above refs.
 *
 * The OracleReportController uses the OracleReportOutput object instances to 
 * identify the output needing creation. (The WPController will pass an xml snippet to the WPOutput's selector function).
 *
 * @constructor
 */
function OracleReportOutput(description, eventId, eventCode, refCJR, refN, orderID, mainOrderID, hearingType, bulkPrint) {
	this._description   = description;
	this._event_id 		= eventId;
	this._event_code 	= eventCode;
	this._ref_cjr 		= refCJR;
	this._ref_n 		= refN;
	this._ref_txt 		= null;
	this.orderID		= orderID;
	this.mainOrderID	= mainOrderID;
	this.hearingType	= hearingType;
	this._bulkprint		= bulkPrint;
	this._uniqueId		= "WPDOC_"+this._ref_cjr;
	if (ora_do_L) Logging.trace("Instantiated " + this + " with uniqueId " + this._uniqueId); }


OracleReportOutput.prototype = new WPOutput();

OracleReportOutput.prototype.constructor = OracleReportOutput;

/** Class attribut containing all output definitions**/
OracleReportOutput.all = new Array();
    
/**
 *
 */
OracleReportOutput.findDescription = function(eventId) {
	var l = OracleReportOutput.all.length;
	for (var i=0; i < l; i++) {
		var o = OracleReportOutput.all[i];
		 if (eventId == o.getEvent()) {
			var str = "";
			str += o.getCJRReference() + " " + o.getNReference() + " " + o.getDescription();
			return str; } }
	return "(No output description found.)"; }

/**
	Public getter for the Event id of the Output
**/
OracleReportOutput.prototype.getEvent = function() {
	return this._event_id; }


/**
	Public getter for the Description of the Output
**/
OracleReportOutput.prototype.getDescription = function() {
	return this._description; }

/**
	Public getter for the CJR Reference of this Output
**/
OracleReportOutput.prototype.getCJRReference = function() {
	return this._ref_cjr; }
	
/**
	Public getter for the N Reference of this Output
**/
OracleReportOutput.prototype.getNReference = function() {
	return this._ref_n; }

/**
	Public getter for the Bulk Print attribute of this Output
**/
OracleReportOutput.prototype.getBulkPrint = function() {
	return this._bulkprint; }
	
/**
	Public getter for the Text Reference of this Output
**/
OracleReportOutput.prototype.getTextReference = function() {
	return this._ref_txt; }

OracleReportOutput.prototype.getCreatingEventId = function() {
	return this._event_id; }
	
OracleReportOutput.prototype.getCreatingEventCode = function() {
	return this._event_code; }

/**
 * Public method returning boolean indicating whether this ouput's creation is triggered by the xml passed in
 * @arguments xml the 'context' xml
 * @returns boolean
 */
OracleReportOutput.prototype.isOutputFor = function(xml, callback) {  
	var msg = "OracleReportOutput.prototype.isOutputFor ";
	if (ora_do_L) Logging.trace(msg + "callback: " + callback);
	var eventId = XML.getNodeTextContent(xml.selectSingleNode(OracleReportXPath.rel2.eventNumber));
	orderNode = xml.selectSingleNode(OracleReportXPath.rel5.eventDetails)
	var orderId = null;
	if (orderNode != null) {
		orderId = XML.getNodeTextContent(orderNode);
		if (ora_do_L) Logging.trace(msg + "orderId: " + orderId); }
	else {
		if (ora_do_L) Logging.trace(msg + "orderId: NO order node found on " + OracleReportXPath.rel5.eventDetails); }
	var eventCode = "1"; 
	dom = WP.GetInstance("OracleReportController").getConfigXML();
	var eventNode = null;
	/** defect UCT 379 **/
	var updateMode = xml.selectSingleNode("WordProcessing/UpdateServiceFlag");
	var updateModeText = null;
	if (null != updateMode){
		updateModeText = updateMode.text; }	
	if (null != updateModeText && "Y" == updateModeText) {	
		if (this.getCJRReference() == 'CM_STD_DOC_P_NS') {
			return true; } }
	else {
		if (callback == "ManageCOEvents") {
			if (orderId == null) {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"'][@type='CO']"); }
			else if (eventId != 174) {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"'][@type='CO']"); }
			else {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"'][@order='"+orderId+"'][@type='CO']"); } }
		else {
			if (orderId == null) {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"']"); }
			else if (eventId != 177 && eventId != 179) {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"']"); }
			else {
				eventNode = dom.selectSingleNode("configuration/Events/Event[@id='"+eventId+"'][@code='"+eventCode+"'][@order='"+orderId+"']");	} }		
		if (ora_do_L) Logging.trace(msg + "orderId: " + orderId + " eventId: " + eventId +  " eventCode: " + eventCode);
		if(null != eventNode) {
			var outputNodes = eventNode.selectNodes("Output");
			var outputNodesLen = outputNodes.length;
			if (ora_do_L) Logging.trace("Found " + outputNodesLen + " output nodes under event / code " + eventId + " / " + eventCode);
			for (var i=0; i < outputNodesLen; i++) {
				outputNode = outputNodes[i];
				outputId = XML.getNodeTextContent(outputNode.selectSingleNode("@id"));
				if (this.getCJRReference() == outputId)  {
					if (ora_do_L) Logging.trace(msg + " " + this + " is output for " + xml.xml);
					if (ora_do_D) alert(msg + " " + this + " is output for " + xml.xml);
					return true; } } }
		else {
			if (ora_do_L) Logging.trace(msg+"no event found"); } }
	return false; }



/**
	Public pretty toString implementation.
	Returns an outputs NReference-CJRReference;
	See also toString()
 **/
OracleReportOutput.prototype.toStringNicePrint = function() {
	return this.getCJRReference()+ " ("+this.getNReference()+")"; }

/**
	Public toString implementation.
	Returns 'OracleReportOutput' and the toNiceString()
	See also toStringNicePrint()
 **/
OracleReportOutput.prototype.toString = function() {
	return "OracleReportOutput "+this.toStringNicePrint(); }