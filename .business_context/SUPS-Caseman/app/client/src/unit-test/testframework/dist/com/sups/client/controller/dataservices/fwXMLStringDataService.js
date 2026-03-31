//==================================================================
//
// fwXMLStringDataService.js
//
// DataService that loads data by loading serialized XML from a
// string.
//
//==================================================================


function fwXMLStringDataService()
{
}


fwXMLStringDataService.prototype = new fwDataService();
fwXMLStringDataService.prototype.constructor = fwXMLStringDataService;

fwXMLStringDataService.prototype.load = function()
{
	var dom = XML.createDOM(null, null, null);

	// Parse the XML string and load it into the DOM
	dom.loadXML(this.m_config.xml);

	// Just delegate to _handleResultDOM() which will check for parse errors etc
	this._handleResultDOM(dom);
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwXMLStringDataService.prototype.getDefaultName = function()
{
	// Return the xml string configuration
	return this.m_config.xml;
}
