//==================================================================
//
// DynamicLoadingProtcol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support dynamic loading and unloading of content based
// on changes to the DataModel.
//
//==================================================================


/*
 * DynamicLoadingProtocol constructor
 *
 * @constructor
 */
function DynamicLoadingProtocol()
{
}


/**
 * Array of XPaths which determine when the load() method should
 * be re-evaluated.
 *
 * @configuration
 * @type Array[XPath]
 */
DynamicLoadingProtocol.prototype.loadOn = null;


/**
 * Configuration method that is invoked when the adaptor needs to
 * determine whether or not the content should be loaded
 *
 * @configuration
 * @type Function: boolean
 */
DynamicLoadingProtocol.prototype.load = null;


/**
 * Array of XPaths which determine when the unload() method should
 * be re-evaluated.
 *
 * @configuration
 * @type Array[XPath]
 */
DynamicLoadingProtocol.prototype.unloadOn = null;


/**
 * Configuration method that is invoked when the adaptor needs to
 * determine whether or not the content should be unloaded
 *
 * @configuration
 * @type Function: boolean
 */
DynamicLoadingProtocol.prototype.unload = null;


/**
 * Method overridden by adaptor to handle a load
 */
DynamicLoadingProtocol.prototype.handleLoad = function()
{
}


/**
 * Method overridden by adaptor to handle an unload
 */
DynamicLoadingProtocol.prototype.handleUnload = function()
{
}


/**
 * Configure the Protocol
 *
 * @param cs the configuration objects to inspect for protocol configuration properties
 * @type void
 */
DynamicLoadingProtocol.prototype.configDynamicLoadingProtocol = function(cs)
{
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		if(null == this.loadOn && null != c.loadOn) this.loadOn = c.loadOn;
		if(null == this.unloadOn && null != c.unloadOn) this.unloadOn = c.unloadOn;
	}
}


/*
 * Sets up the protocol
 */
DynamicLoadingProtocol.prototype.initialiseDynamicLoadingProtocol = function(e)
{
	// Because the component which implements the DynamicLoadingProtocol is managing
	// the lifecycle of other items, we need to get all these potential items and
	// invoke their load configuration to determine whether or not they should be
	// loaded at initialisation time.
	var ds = this._getDynamicLoadingDetails();
	
	if(null == ds)
	{
		this.invokeLoad(e, null);
	}
	else
	{
	for(var i = 0, l = ds.length; i < l; i++)
	{
		var d = ds[i];
		this.invokeLoad(e,d);
	}
}
}


/**
 * Perform cleanup required by the protocol before it is destroyed
 */
DynamicLoadingProtocol.prototype.disposeDynamicLoadingProtocol = function()
{
}


/**
 * Get XPaths that trigger the invocation of the load() method
 *
 * @return an array of XPaths that cause the load() method to be invoked
 * @type Array[XPath]
 */
DynamicLoadingProtocol.prototype.getLoadOn = function()
{
	return this.loadOn;
}


/**
 * Get XPaths that trigger the invocation of the unload() method
 *
 * @return an array of XPaths that cause the unload() method to be invoked
 * @type Array[XPath]
 */
DynamicLoadingProtocol.prototype.getUnloadOn = function()
{
	return this.unloadOn;
}


/**
 * Get load configurations which are to be invoked
 *
 * @param d additional detail parameter registered with listener
 */
DynamicLoadingProtocol.prototype.getOnLoadConfigs = function(d)
{
	// Get configurations
	var cs = this.getConfigs();
	
	// Build array of load function configurations
	var configs = [];
	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].load) configs.push(cs[i].load);
	}
	
	return configs;
}


/**
 * Get unload configurations which are to be invoked
 *
 * @param d additional detail parameter registered with listener
 */
DynamicLoadingProtocol.prototype.getOnUnloadConfigs = function(d)
{
	// Get configurations
	var cs = this.getConfigs();
	
	// Build array of load function configurations
	var configs = [];
	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].unload) configs.push(cs[i].unload);
	}
	
	return configs;
}


/**
 * Invoke the load method configured for the adaptor
 *
 * @param e the DataModelEvent that triggered this call
 * @param d additional detail registered by the listener
 */
DynamicLoadingProtocol.prototype.invokeLoad = function(e, d)
{
	var detail = (null == d ? null : d.m_detail);
	
	// Get configs to execute
	var configs = this.getOnLoadConfigs(detail);
	
	// If any of the configured load() methods returns true,
	// then the page is loaded
	var load = false;
	for(var i = 0, l = configs.length; i < l; i++)
	{
		if(configs[i].call(this, e))
		{
			load = true;
			break;
		}
	}
	
	if(load)
	{
		this.handleLoad(detail);
	}
}


/**
 * Invoke the unload method configured for the adaptor
 *
 * @param e the DataModelEvent that triggered this call
 * @param d additional detail registered by the listener
 */
DynamicLoadingProtocol.prototype.invokeUnload = function(e, d)
{
	var detail = (null == d ? null : d.m_detail);
	
	// Get configs to execute
	var configs = this.getOnUnloadConfigs(detail);
	
	// If all the configured unload() methods return true,
	// then the page is unloaded
	var unload = true;
	for(var i = 0, l = configs.length; i < l; i++)
	{
		if(!configs[i].call(this, e))
		{
			unload = false;
			break;
		}
	}
	
	if(unload)
	{
		this.handleUnload(detail);
	}
}


/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
DynamicLoadingProtocol.prototype.getListenersForDynamicLoadingProtocol = function()
{
    var listenerArray = new Array();
    var loadListener = FormControllerListener.create(this, FormController.LOAD);
    var unloadListener = FormControllerListener.create(this, FormController.UNLOAD);
    
	// Register onLoad Listeners
	var on = this.getLoadOn();
	if(null != on)
	{
		for(var i = 0, l = on.length; i < l; i++)
		{
            listenerArray.push({xpath: on[i], listener: loadListener});
		}
	}

	// Register onUnload Listeners
	on = this.getUnloadOn();
	if(null != on)
	{
		for(var i = 0, l = on.length; i < l; i++)
		{
            listenerArray.push({xpath: on[i], listener: unloadListener});
		}
	}
    
    return listenerArray;
}

/**
 * Get the detail parameter added to the DataModel Listener which allows
 * the DynamicLoadingProtocol to differentiate between multiple children.
 *
 * Where the component implementing the DynamicLoadingComponent is only
 * managing the life of a single component, no detail parameters are required
 * and this base implementation is sufficient.
 * 
 * If the component implementing the DynamicLoadingProtocol manages the
 * lifecycle of more than one child component, then a listener needs to be
 * registered for each child that specifies a different load/unload 
 * configuration. This detail parameter allows the DynamicLoadingProtocol
 * to determine for which child the load/unload event was for. In this case
 * the component implementing the DynamicLoadingProtocol will need to
 * override this method.
 *
 * Note that where this method is overridden by a component that manages
 * multiple children, it is usually the case that the component will also
 * need to override the following methods:
 * 
 *     getListenersForDynamicLoadingProtocol()
 *     getOnLoadConfigs()
 *	   getOnUnloadConfigs()
 */
DynamicLoadingProtocol.prototype._getDynamicLoadingDetails = function()
{
	return null;
}
