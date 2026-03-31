/**
 * Word Processing XPath class
 * Facilitates easy access to configurable xpahts.
 * The JavaScript WP code only uses references to XPaths.
 * These references are static attributes to this class.
 * The actual xpath corresponding to the reference is loaded
 * from the controller configuration xml.
 * @constructor
 */
function WPXPath(ref, path) {
	/**
	 * The reference to the WPXPath Static Attribute initalised
	 */
	this.ref = ref;
	/**
	 * The value with wich the WPXPath Static Attribute is initalised
	 */
	this.path = path; 
	WPXPath.Paths.push(this); }

/**
 * Class attribute storing all instances
 */
WPXPath.Paths = new Array()

/**
 *
 * @argument reference string
 * @type WPXPath
 * @returns WPXPath with matching reference
 */
WPXPath.getPath = function(ref) {
	var xP = null;  // the xpath to find
	var pL = WPXPath.Paths.length;
	var i = 0;
	while (xP == null && i < pL) {
		var aP = WPXPath.Paths[i]	
		if (aP.getRef() == ref) {
			xP = aP; }
		i++; }
	return xP; }

/** 
 * SUPS WP XPath - returns the refence of an WPXPath Instance, being the static
 * attribute which is populated with an xpath value
 * @type String
 * @returns ref for this xpaht
 */
WPXPath.prototype.getRef = function() {
	return this.ref; }

/** 
 * SUPS WP XPath - returns the value of an WPXPath Instance, being the xpath string itself
 * @type String
 * @returns the xpaht
 */
WPXPath.prototype.getPath = function() {
	return this.path; }

/**
 * Static Word Processing XPath function initializing this class by parsing the
 * xpaths from the wpctrl configuration xml into WPXPath instance objects.
 *
 * @type boolean indicating successful parse
 * @argument wpctrl WordProcessingController
 * @argument paths array of paths to be parsed
 * @argument klass String representation of the WPXPath subclass to instantiate
 * @returns boolean
 */
WPXPath.ParseConfigurationXPaths = function(wpctrl, paths, klass) {
	try {
		var configxml = wpctrl.getConfigXML();
		var patLen = paths.length;
		for (var i=0; i < patLen; i++) {
			var xp = paths[i];
			var xpOri = xp;
			var ploc = xp.indexOf('.');
			while (-1 != ploc) {
				xp = xp.substring(0, ploc) + '-' + xp.substring(ploc+1, xp.length);
				ploc = xp.indexOf('.'); }
			var xpNodePath = "/configuration/xpaths/"+xp;
			var xpNode = configxml.selectSingleNode(xpNodePath);
			var xpValue = null != xpNode ? WPS.getNodeTextContent(xpNode) : "[no xpNode found on '"+xpNodePath+"']";
			eval(xpOri+ " = \"" + xpValue+"\"");
			eval("new " + klass+"('"+xp +"', "+ xpOri+")"); 
			if (doLog) do_Log("WPXPath: new " + klass+"('"+xp +"', "+ xpOri+")");
			if (doLog) do_Log("WPXPath: " + xpOri+ " = \"" + xpValue+"\""); } }
	catch(err) {
		var str = this.toString + " WPXPath.ParseConfigurationXPaths caught exception";
		if (doLog) do_Log(str, err);
		return false; }
	return true; }

/**
 * Parses an empty context xml fragment from the configuration xml
 * @type boolean indicating successful parse
 * @argument wpctrl WordProcessingController 
 * @argument paths array of paths to be parsed
 * @argument klass String representation o fthe WPXPath subclass to instantiate
 * @returns boolean 
 */
WPXPath.ParseConfigurationContext = function(wpctrl, path, klass) {
	try {
		var configxml = wpctrl.getConfigXML();
		var xpOri = klass +"." + path;
		var xpNode = configxml.selectSingleNode("/configuration/context/*[1]");
		var xmlStr = xpNode.xml;
		var qa = "";
		var qb = "";
		var rt = "\n";
		var rtIdx = xmlStr.indexOf(rt);
		while (-1 != rtIdx) {
			qa = xmlStr.substring(0,rtIdx);
			qb = xmlStr.substring(rtIdx+1, xmlStr.length);
			xmlStr = qa.concat(qb);
			rtIdx = xmlStr.indexOf(rt); }
		if ("" != qb) xmlStr = qa.concat(qb);
		var evalStr = xpOri+ " = WPS.createDOM(); "+xpOri+ ".loadXML('"+ xmlStr +"')";
		var loadedXml = eval(evalStr);
		if (!loadedXml) throw new Error("Not loaded context XML: " + xmlStr); }
	catch(err) {
		var str = this.toString + " WPXPath.ParseConfiguration caught exception";
		if (doLog) do_Log(str, err);
		return false; }
	return true; }
	
/**
 * Abstract WPXPath Initialisation function
 * ! Subclasses MUST implement this method!!
 * @type boolean
 * @argument wpctrl Word Processing Controller instance
 * @returns boolean indicating successfull initialisation
 */
WPXPath.Initialize = function(wpctrl) {
	/** SAMPLE IMPLEMENTATION OF A SUBCLASS
	var xps = [ "CaseManWPXPath.CaseNumber",
				"CaseManWPXPath.CaseType",
				"CaseManWPXPath.EventStandardId",
				"CaseManWPXPath.EventPK" ]
	return WPXPath.ParseConfiguration(wpctrl, xps, CaseManWPXPath);
	**/
	var str = "SUPS Application specific XPath classes must implement the .Initialize function";
	do_X(str); }