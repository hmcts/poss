//==================================================================
//
// fwSrcXPathDataService.js
//
// DataService that loads data by selecting a node from the
// DataModel
//
//==================================================================


/**
 * DataService that loads data by selecting a node from the
 * DataModel
 *
 * @ctor
 */
function fwSrcXPathDataService()
{
}


fwSrcXPathDataService.prototype = new fwDataService();
fwSrcXPathDataService.prototype.constructor = fwSrcXPathDataService;


/**
 * Load data by selecting an existing node from the DataModel.
 * Asynchronous loading does not make sense in the context of
 * this DataService, so the asynchronous flag is ignored.
 */
fwSrcXPathDataService.prototype.load = function()
{
	var dom = XML.createDOM(null, null, null);
	try
	{
		var srcNode = Services.getNode(this.m_config.srcXPath);
		if(null != srcNode)
		{
			dom.appendChild(srcNode);
		}

		// Just delegate to _handleResultDOM() which will check for parse errors etc
		this._handleResultDOM(dom);
	}
	catch(ex)
	{
		// If exception thrown that pass this to the result handler
		this.handleException(ex);
	}
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwSrcXPathDataService.prototype.getDefaultName = function()
{
	// Return the srcXPath configuration
	return this.m_config.srcXPath;
}
