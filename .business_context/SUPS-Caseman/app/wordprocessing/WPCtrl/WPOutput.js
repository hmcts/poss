/**
 * SUPS Word Processing Output - represents the Word Processing Output to be processed.
 * @constructor
 */
function WPOutput(configxml) {
	/**
	 * WPOutput instance attribute String reprentation of the output's unique id on the server
	 */
	this.serverId = null;
	/**
	 * WPOutput instance attribute String reprentation of the output's unique id in this client
	 */
	this.clientId = null;
	/**
	 * WPOutput instance attribute XML DOM reprentation of this output's configuration
	 */
	this.configXml = configxml;
	/**
	 * Used to construct a unique client id
	 */
	this.hash = ""+new Date();
	if (this.initialise) this.initialise(); }

/**
 * Reference to all loaded WPOutput instances - avoids having to reparse xml
 */
WPOutput.Instances = new Array();

/**
 * SUPS Word Processing Output toString implementation returing "WPOutput"
 * @type String
 * @returns 'WPOutput'
 */
WPOutput.prototype.toString = function() {
	return "WPOutput"; }

/**
 * SUPS Word Processing Output returns the serverid of the output when the output exists on server
 * @type string
 * @returns unique id for this output - in the scope of the server app
 */
WPOutput.prototype.getServerId = function() {
	return this.serverId; }

/**
 * SUPS Word Processing Output sets the serverid of the output when the output exists on server
 * @argument serverid string
 */
WPOutput.prototype.setServerId = function(serverId) {
	this.serverId  = serverId; }
	
/**
 * SUPS Word Processing Output returns the clientid of this output - unique in this run of the app
 * @type string
 * @returns unique id for this output - in the scope of this client app
 */
WPOutput.prototype.getClientId = function() {
	return "OUTPUTON"+ this.hash; }

/**
 * SUPS Word Processing Output function returning the id to be used to record state (with key partId) in the WPCtrl
 * @type String
 * @returns the key to be used to record state on the WPCtrl
 */
WPOutput.prototype.getStateId = function(partId) {
	return this.getClientId() + "-" + partId; }

/**
 * SUPS Word Processing Output
 * @deprecated
 * @type string
 * @returns unique id for this output - in the scope of the system
 */
WPOutput.prototype.getUniqueId = function() { 
	this.getClientId(); }

/**
 * SUPS Word Processing Output Initialisation;
 * the configuration xml is passed in, to be parsed as appropriate.
 * @returns Array
 * @throws
 */
WPOutput.InitializeInstances = function(configXML) {
	return WPOutput.Instances; }

/**
 * SUPS Word Processing Output Initialisation;
 * the configuration xml is passed in, to be parsed as appropriate to the outputId
 * delegate function to WPOutput.InitializeInstances and WPOutput.FindOutputToProcess
 * @returns WPOutput
 * @argument wpctrl
 * @argument outputId
 * @argument outputClass
 * @returns output
 * @throws
 */
WPOutput.InitializeInstance = function(wpctrl, outputId, outputClass) {
	var output = null
	var config = wpctrl.getConfigXML();
	var __outputNode = config.selectSingleNode(CaseManWPXPath._FindOutputWithId(outputId));
	var str = "new " + outputClass + "(__outputNode);"
	if (doLog) do_Log("WPOutput.InitializeInstance about to create output instance " + str);
	output = eval(str);
	if (doLog) do_Log("WPOutput.InitializeInstance created output instance " + output);
	return output; }