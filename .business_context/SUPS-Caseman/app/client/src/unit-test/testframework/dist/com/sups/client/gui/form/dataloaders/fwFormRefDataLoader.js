function fwFormRefDataLoader()
{
}


fwFormRefDataLoader.prototype = new fwFormInitDataLoader();
fwFormRefDataLoader.prototype.constructor = fwFormRefDataLoader;


fwFormRefDataLoader.m_logger = new Category("fwFormRefDataLoader");


fwFormRefDataLoader.m_count = 0;

/**
 * Creates the loader responsible for ref data
 *
 * @param config.name - name of the reference data in the form - not mandatory.
 * @param config.dataBinding - location to place the returned data - not mandatory. 
 * @param serviceParams - an array of name value pairs - mandatory.
 * 
 * @param config.serviceName - this and the following 4 options are mutually 
                               exclusive and determing the type of DataService
                               to be created.
 * @param config.fileName
 * @param config.srcXPath
 * @param config.computed
 * @param config.xml
 * 
 */
fwFormRefDataLoader.create = function(config, form, generateEvents)
{
	var rdl = new fwFormRefDataLoader();
	
	rdl._setGenerateDMEvents(generateEvents);
	
	// If no name is specified then generate and use a default name
	if(null == config.name)
	{
		config.name = form.getId() + " reference data " + RefDataLoader.m_count;
		if(fwFormRefDataLoader.m_logger.isWarn()) RefDataLoader.m_logger.warn("Missing name for reference data in form " + form.getId() + ", defaulting to " + config.name);
		RefDataLoader.m_count++;
	}
	
	// If no dataBinding is specified then default dataBinding
	if(null == config.dataBinding)
	{
		// Ref data defaults to /ds/var/form
		// @todo - is this appropriate for subforms, or should this default to /ds/var/subform?
		config.dataBinding = "/ds/var/form";
		if(fwFormRefDataLoader.m_logger.isWarn()) RefDataLoader.m_logger.warn("Missing dataBinding for reference data " + this.m_name + " for form " + form.getId() + ", defaulting to " + config.dataBinding);
	}

	rdl._initialise(config);
	
	return rdl;
}


fwFormRefDataLoader.prototype.load = function()
{
	// Get the name which this reference data is stored under the reference data cache
	var cacheName = this._getCacheName();
	
	// Get the root node name of this reference data from the reference data cache
	var rootNodeName = Services.getAppController().getRefDataRootNodeForCurrentForm(cacheName);
	
	// Check if the reference data root node exists in the DataModel
	var nodeExists = false;
	if(null != rootNodeName)
	{
		// Calculate the XPath of the reference data root node in the DataModel
		var rootNodeInDM = XPathUtils.concatXPaths(this.m_config.dataBinding, rootNodeName);

		nodeExists = Services.exists(rootNodeInDM);
	}
	
	// If the node doesn't exist then we need to load the reference data - call base class to do it
	// If the node does exist, then we don't need to load the reference data - just end
	if(false == nodeExists)
	{
		fwFormInitDataLoader.prototype.load.call(this);
	}
}


fwFormRefDataLoader.prototype._successHandler = function(dom, name)
{
	// Reference data may be cached if it is loaded from a static file
	// or from a remove service - don't support caching of computed
	// or srcXPath loaded reference data
	var cacheName = this._getCacheName();
		
	// If data is to be cached then it needs a name in the cache.
	if(null != cacheName)
	{
		// Add the data to the cache
		var ac = Services.getAppController();
		var rootNode = XML.getRootNode(dom);
		
		ac.setRefDataRootNodeForCurrentForm(cacheName, rootNode.nodeName);
	}

	// Call parent class to actually add the reference data to the DataModel
	fwFormInitDataLoader.prototype._successHandler.call(this, dom, name);
}


/**
 * Get the name that is used to store the reference data in the 
 * reference data cache if the reference data is cachable. If the
 * reference data is not cacheable, then null will be returned.
 * Only data loaded from a using a remote web service call or loaded
 * from a remote URL is cacheable
 *
 * @return the name to store the data under in the reference data
 *  cache. Will be null if this refernce data is not cacheable.
 * @type String
 * @private
 */
fwFormRefDataLoader.prototype._getCacheName = function()
{
	var cacheName = null;
	
	if (this.m_dataService instanceof fwServiceCallDataService)
	{
		cacheName = this.m_config.serviceName;
	}
	else if (this.m_dataService instanceof fwFileDataService)
	{
		cacheName = this.m_config.fileName;
	}

	return cacheName;	
}


/**
 * Get a name associated with this type of service
 *
 * @return a string containing the name of this type of service
 * @type String
 * @protected
 */
fwFormRefDataLoader.prototype._getServiceTypeName = function()
{
	return "Reference data loading service";
}
