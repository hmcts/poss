//==================================================================
//
// GUIAdaptor.js
//
// Base class for integrating GUI components with the form controller
// and configuring them.
//
//==================================================================


/**
 * Base class for integrating GUI components with the form controller
 * and configuring them.
 *
 * @constructor
 */
function GUIAdaptor()
{
}

GUIAdaptor.m_logger = new Category("GUIAdaptor");

/**
 * Configuration objects applied to the GUI Adaptor
 *
 * @type Array[Object]
 * @private
 */
GUIAdaptor.prototype.m_configs = null;


GUIAdaptor.prototype.m_stateChangeListener = null;
GUIAdaptor.prototype.register = function(listener)
{
	this.m_stateChangeListener = listener;
}


/**
 * Flag to speed up checking of whether form initialisation has completed or not - to be
 * replaced by proper implementation of form lifecycles
 *
 * @type Array[Object]
 * @private
 */
/*GUIAdaptor.prototype.m_formInitialisationComplete = false;

GUIAdaptor.prototype.setFormInitialisationComplete = function(flag)
{
	this.m_formInitialisationComplete = flag;
}
GUIAdaptor.prototype.getFormInitialisationComplete = function()
{
	return this.m_formInitialisationComplete;
}
GUIAdaptor.prototype.isFormInitialisationComplete = function()
{
	return this.m_formInitialisationComplete == true;
}*/


/**
 * Protocols supported by this GUI Adaptor
 *
 * @type Array[Object]
 * @private
 */
GUIAdaptor.prototype.m_protocols = new Array();


/**
 * Get the id for the component
 *
 * @return the id of the component as a string
 * @type String
 */
GUIAdaptor.prototype.getId = undefined;


/**
 * Force the initial state for all protocols, used during form initialisation. Replaced the old
 * method of simply firing all registered listeners in the DataModel. 
 *
 * The array m_initialList is setup when a protocol is added to the adaptor. 
 */
GUIAdaptor.prototype.initialiseStates = function(e)
{
	Services.startTransaction();
    for (var i = 0, l = this.m_initialiseList.length; i < l; i++)
	{
		this[this.m_initialiseList[i]].call(this,e);
	}
	Services.endTransaction();
}

/*
 *   Registers all listeners for protocols defined
 *   in this.m_listeningProtocols - which is build when the 
 *   protocols are added to the adaptor.
 */
GUIAdaptor.prototype.registerListeners = function() 
{ 
	var dm = FormController.getInstance().getDataModel();
    this.m_registeredListeners = new Array();
	   
	for (var i = 0, l = this.m_listeningProtocols.length; i < l; i++)
	{
	    // Get the array of listeners and xpaths.
	    var listeners = this["getListenersFor" + this.m_listeningProtocols[i]].call(this); 
	        
	    // Register them all with the datamodel.
	    dm.registerListenerArray(listeners); 
	        
	    // Store them for later removal
	    this.m_registeredListeners[this.m_listeningProtocols[i]] = listeners; 
	} 
}

/*  
 *  De-registers all previously registered listeners for this
 *  adaptor.
 */
GUIAdaptor.prototype.deRegisterListeners = function() 
{ 
    var dm = FormController.getInstance().getDataModel();
   
	for (var i in this.m_registeredListeners)
	{
		dm.deRegisterListenerArray(this.m_registeredListeners[i]);
	}
    this.m_registeredListeners = null; 
}

/**
 * Re-render the GUI component according to its state
 */
GUIAdaptor.prototype.renderState = function()
{
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
GUIAdaptor.prototype.configure = function(cs)
{
	// Add self to end of configuration list
	cs[cs.length] = this;
	
	// Hang on to the configuration objects
	this.m_configs = cs;
	
	// Configure protocols
	for(var i = 0, l = this.m_protocols.length; i < l; i++)
	{
		var protocolName = this.m_protocols[i];
		if(GUIAdaptor.m_logger.isTrace())
		{
			GUIAdaptor.m_logger.trace("Configuring protocol " + i + ": " + protocolName + " for adaptor " + this.getId());
		}
		// Configure each protocol in turn
		this['config' + protocolName].call(this, cs);
	}
	
	// Call adaptor specific initialisation
	this._configure(cs);
}


/**
 * Configure the GUIAdaptor.
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first, which includes the adaptor
 *   itself.
 */
GUIAdaptor.prototype._configure = function(cs)
{
}


/**
 * Perform GUIAdaptor cleanup.
 */
GUIAdaptor.prototype.dispose = function()
{
	// Clean up protocols
	for(var i = 0, l = this.m_protocols.length; i < l; i++)
	{
		var protocolName = this.m_protocols[i];
		if(GUIAdaptor.m_logger.isTrace())
		{
			GUIAdaptor.m_logger.trace("Disposing protocol " + i + ": " + protocolName + " for adaptor " + this.getId());
		}
		// Dispose each protocol in turn
		this['dispose' + protocolName].call(this, this.m_configs);
	}

	// Perform any clean up required by the adaptor itself
	this._dispose();

	// Clean up reference to parent
	this.m_parentContainer = null;
}


/**
 * Perform any GUIAdaptor specific cleanup
 */
GUIAdaptor.prototype._dispose = function()
{
	if(GUIAdaptor.m_logger.isError()) GUIAdaptor.m_logger.error("GUIAdaptor:_dispose(): _dispose() not overridden for adaptor with id: " + this.getId());
}


GUIAdaptor.prototype.getConfigs = function()
{
	return this.m_configs;
}

GUIAdaptor.prototype.addConfig = function(config)
{
    this.m_configs[this.m_configs.length] = config;
}

GUIAdaptor.prototype.hasConfiguredProperty = function(propName)
{
	var ret = false;
	var cs = this.getConfigs();
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		if(null != cs[i][propName])
		{
			ret = true;
			break;
		}
	}
	
	return ret;

}
/*
 * Property which is set during adaptor registration
 * to the container upon which this adapter is
 * visualy located on. For most adapters, this will be the form itself
 * which is NULL
 */
GUIAdaptor.prototype.m_parentContainer = null;
GUIAdaptor.prototype.setParentContainer = function(parentContainer)
{
	if(parentContainer != null)
	{
		if(GUIAdaptor.m_logger.isDebug()) GUIAdaptor.m_logger.debug(this.getId() + ":GUIAdaptor.setParentContainer() parent container adaptor id=" + parentContainer.getId());
		this.m_parentContainer = parentContainer;
		// setup the reverse relationship used for propogating state change events to contained children
		parentContainer.addContainedChild(this);
	}
	else
	{
		if(GUIAdaptor.m_logger.isDebug()) GUIAdaptor.m_logger.debug(this.getId() + ":GUIAdaptor.setParentContainer() parent container  = null");
	}
}
GUIAdaptor.prototype.getParentContainer = function()
{
	return this.m_parentContainer;
}

GUIAdaptor.prototype.m_containedChildren = null;
GUIAdaptor.prototype.getContainedChildren = function()
{
	return [];
}
GUIAdaptor.prototype.addContainedChild = function(childAdaptor)
{
	if(GUIAdaptor.m_logger.isError()) GUIAdaptor.m_logger.error(this.getId() + ":GUIAdaptor.addContainedChild() method is only valid for container adaptors");
}


/**
 * Check to see if this adaptor is a child of another adaptor
 *
 * @param a the adaptor that is to be checked to see if it is a parent of this adaptor
 * @return true if the supplied adaptor is a parent of this adaptor or false otherwise
 */
GUIAdaptor.prototype.isChildOf = function(a)
{
	var currentAdaptor = a;
	var currentParent = this.getParentContainer();
	
	while(null != currentParent)
	{
		if(a == currentParent)
		{
			return true;
		}
		
		currentParent = currentParent.getParentContainer();
	}
	
	return false;
}

/**
 * Add a protocol to the GUIAdaptor. This is a mechanism for
 * supporting a form of multiple inheritance in JavaScript.
 *
 * @param c a string containing the name of the GUI Adaptor to
 *   which the protocol is being added.
 * @param p a string containing the name of the Protocol to add
 *   to the GUI Adaptor.
 */
GUIAdaptor._addProtocol = function(c, p)
{
	var cproto = window[c].prototype;
	var pproto = window[p].prototype;
	
	// Copy the properties from the protocol prototype to the
	// GUI Adaptor prototype.
	for(var i in pproto)
	{
		cproto[i] = pproto[i];
	}
	
	// Get the list of protocols
	var ps = window[c].prototype.m_protocols;
	
	// Add the new protocol name to the list
	ps[ps.length] = p;
    
    // Now add the protocol to initialiseList    
    // Databinding protocol (if it exists) must be
    // the first element of the array.
	if (cproto['initialise' + p])
	{
	    cproto.m_initialiseList.push('initialise' + p);
	}
    
    // Order the protocols for correct intialisation
    cproto.m_initialiseList.sort(GUIAdaptor.protocolOrderComparator);
    
    // Determine which protocols require listeners in place
	if (cproto['getListenersFor' + p])
	{
		cproto.m_listeningProtocols.push(p);
	}
}

/*
 * Simple comparator which should put Databinding first, ListSrcData next 
 * and Logic last.
 */
GUIAdaptor.protocolOrderComparator =function(p1,p2)
{
	if (p1 == "initialiseDataBindingProtocol")
	{
	    return -1;
	}
    else if (p2 == "initialiseDataBindingProtocol")
    {
        return 1; 
    }
	else if (p1 == "initialiseLogicProtocol")
	{
	    return 1;
	}
    else if (p2 == "initialiseLogicProtocol")
    {
        return -1; 
    }
    else if (p1 == "initialiseListSrcDataProtocol")
    {
        return -1; 
    }
    else if (p2 == "initialiseListSrcDataProtocol")
    {
        return 1; 
    }
    
    return -1; 
    
}

GUIAdaptor._setUpProtocols = function(c)
{
	// Make a copy of the prototype array
	window[c].prototype.m_protocols = window[c].prototype.m_protocols.slice(0);
    
    if (window[c].prototype.m_initialiseList)
    {
    	window[c].prototype.m_initialiseList = window[c].prototype.m_initialiseList.slice(0);
    }
    else
    {
	   window[c].prototype.m_initialiseList = new Array();
    }
    
    if (window[c].prototype.m_listeningProtocols)
    {
    	window[c].prototype.m_listeningProtocols = window[c].prototype.m_listeningProtocols.slice(0);
    }
    else
    {
	   window[c].prototype.m_listeningProtocols = new Array();
    }
}


/**
 * Check if the adaptor supports a named protocol
 *
 * @param protocolName the name of the protocol to check for (e.g. ValidationProtocol)
 * @return true if the adaptor supports the protocol or false if it doesn't
 * @type boolean
 */
GUIAdaptor.prototype.supportsProtocol = function(protocolName)
{
	return this['config' + protocolName] != null;
}
