//==================================================================
//
// EventBinding.js
//
//
//==================================================================


/**
 * EventBinding constructor
 *
 * @constructor
 */
function EventBinding(id) 
{
    this.m_id = id;
};

EventBinding.m_logger = new Category("EventBinding");

/**
 * Create array to store list of associated prototocols.
 * In this case this should contain the enablement
 * prototocol only.
 *
*/
EventBinding.prototype.m_protocols = new Array();

// Set up enablement protocol
GUIAdaptor._setUpProtocols('EventBinding');
GUIAdaptor._addProtocol('EventBinding', 'EnablementProtocol');


/**
 * List of ids of adaptors that have key bindings to trigger this event
 *
 * @type Array[String]
 */
EventBinding.prototype.m_keyAdaptors = null;


/**
 * List of ids of adaptors that have single click bindings to trigger this event
 *
 * @type Array[String]
 */
EventBinding.prototype.m_singleClickAdaptors = null;


/**
 * List of ids of adaptors that have double click bindings to trigger this event
 *
 * @type Array[String]
 */
EventBinding.prototype.m_doubleClickAdaptors = null;


/**
 * Flag to indicate whether event bindings have been started or not
 *
 * @type Boolean
 */
EventBinding.prototype.m_started = false;


/**
 * Configuration for the EventBinding. This is an Object with properties as
 * described by EventConfiguration.js
 *
 * @type Object(EventConfiguration)
 */
EventBinding.prototype.m_config = null;

/**
 * Reference to inner function that invokes method _handleEvent.
 * The inner function may be passed to a grid for callback following
 * double clicks.
 *
 * @type Function
 *
*/
EventBinding.prototype.m_eventHandler = null;

/**
 * Method returns identifier for event binding
 *
*/
EventBinding.prototype.getId = function()
{
    return this.m_id;
}

/**
 * Method getConfigs returns the event binding
 * configuration object as the first element
 * in an array.
 *
*/
EventBinding.prototype.getConfigs = function()
{
    var cs = new Array();
    
    if(null != this.m_config)
    {
        cs[cs.length] = this.m_config;
    }
    
    return cs;
}

/**
 * Method configures EventBinding instance setting up
 * any required adaptors.
 *
 * @param config The object describing the bindings
*/
EventBinding.prototype.configure = function(config)
{
    this.m_config = config;
    
    // Configure associated protocols
    var protocolName;
    
    var cs = this.getConfigs();
    
    for( var i = 0, l = this.m_protocols.length; i < l; i++ )
    {
        protocolName = this.m_protocols[i];
        
        if(EventBinding.m_logger.isTrace())
        {
            EventBinding.m_logger.trace( "Configuring protocol " +
                                         i +
                                         ": " +
                                         protocolName +
                                         " for event binding." );
        }
        
        this[ 'config' + protocolName ].call(this, cs);
    }
}

/**
 * Bind events as described by an object which has properties as
 * defined by an EventConfiguration object
 *
 * @param callback the client function to invoke when the event
 *    is triggered
 */
EventBinding.prototype.bind = function(callback)
{
    var config = this.m_config;
    
	this.m_keyAdaptors = this._locateAdaptors(config.keys);
	this.m_singleClickAdaptors = this._locateAdaptors(config.singleClicks);
	this.m_doubleClickAdaptors = this._locateAdaptors(config.doubleClicks);
	
	this.m_callback = callback;
	this.m_started = false;
}



EventBinding.prototype.dispose = function()
{
    // Remove event binding event handlers
	this.stop();
	
	// Dispose of any associated protocols
	var protocolName;
	
	var cs = this.getConfigs();
	
	for( var i = 0, l = this.m_protocols.length; i < l; i++ )
	{
	    protocolName = this.m_protocols[i];
	    
	    if(EventBinding.m_logger.isTrace())
        {
            EventBinding.m_logger.trace( "Disposing protocol " +
                                         i +
                                         ": " +
                                         protocolName +
                                         " for event binding." );
        }
        
        this[ 'dispose' + protocolName ].call(this, cs);
    }
	
}


EventBinding.prototype.start = function()
{
	fc_assert(this.m_callback, "Must bind EventBinding");

	var fc = FormController.getInstance();

	// Make start() idempotent
	if(false == this.m_started)
	{
		this.m_started = true;
		
		var thisObj = this;
		this.m_eventHandler = function() { return thisObj._handleEvent() };
		
		// Start all the key listeners		
		var iBindingPos = 0;
		this.m_keyBindings = new Array();
		var keys = this.m_config.keys;
		if(null != keys)
		{
			var qualifiers = null;
			var propagate;
			for(var i = 0, l = keys.length ; i <  l ; i++)
			{
				var key = keys[i];
				var adaptor = fc.getAdaptorById(key.element);
				if(adaptor.supportsProtocol("KeybindingProtocol"))
				{
					this.m_keyBindings[i] = new ElementKeyBindings(this.m_keyAdaptors[i]);
					
					if(key.ctrl == true || key.alt == true || key.shift == true)
					{
						qualifiers = new Object();
						qualifiers.ctrl = key.ctrl;
						qualifiers.alt = key.alt;
						qualifiers.shift = key.shift;
					}

					propagate = (key.propagate == true) ? true : false;
							
					this.m_keyBindings[i].bindKey(keys[i].key, this.m_eventHandler, qualifiers, propagate);
					
					// Copy the key binding object to the adaptor that handles the key press
					// This enables the adaptor to detect that a key has been bound via event binding
					if(adaptor.m_keys != null)
					{
						// Keys already bound to adaptor
						var keyCodeString = '' + keys[i].key.m_keyCode;
						keyCodeString += ElementKeyBindings.getQualifiersSuffix(key);
						
						if(null == adaptor.m_keys.m_keys[keyCodeString])
						{
							// Only bind key if not already bound					
							adaptor.bindKey(keys[i].key, this.m_eventHandler, qualifiers, propagate);
						}
					}
					else
					{
						// No keys bound, so we can just copy the object
						adaptor.m_keys = this.m_keyBindings[i];
					}
					
					if(null != qualifiers) qualifiers = null;
				}
				else
				{
					if(EventBinding.m_logger.isError()) EventBinding.m_logger.error("Adaptor does not support keybinding: " + adaptor.getId());
				}
			}
		}
	
		// Start all the single click listeners
		this.m_SClickBindings = new Array();
		for(var i = 0 ; i < this.m_singleClickAdaptors.length ; i++)
		{
			this.m_SClickBindings[i] = SUPSEvent.addEventHandler(this.m_singleClickAdaptors[i].getElement(), 'click', this.m_eventHandler);
		}
	
		// Start all the double click listeners
		this.m_DClickBindings = new Array();
		for(var i = 0; i < this.m_doubleClickAdaptors.length ; i++)
		{
		    if(!GridGUIAdaptor.isGridAdaptor(this.m_doubleClickAdaptors[i]))
		    {
			    this.m_DClickBindings[iBindingPos] = SUPSEvent.addEventHandler(this.m_doubleClickAdaptors[i].getElement(), 'dblclick', this.m_eventHandler);
			    
			    iBindingPos++;
			}
			else
			{
			    // Instance of grid adaptor
			    this.m_doubleClickAdaptors[i].addDblclickListener(this.m_eventHandler);
			}
		}	
	}
}


EventBinding.prototype.stop = function()
{
	// Make stop() idempotent
	if(true == this.m_started)
	{
		this.m_started = false;
		var iBindingPos = 0;
		
		// Stop all the key listeners
		for(var i = 0, l = this.m_keyBindings.length; i < l; i++)
		{
			this.m_keyBindings[i].dispose();		
		}
	
		// Stop all the single click listeners
		for(var i = 0, l = this.m_SClickBindings.length; i < l; i++)
		{
			SUPSEvent.removeEventHandlerKey(this.m_SClickBindings[i]);
			this.m_SClickBindings[i] = null;
		}
	
		for(var i = 0, l = this.m_doubleClickAdaptors.length; i < l; i++)
		{
		    if(!GridGUIAdaptor.isGridAdaptor(this.m_doubleClickAdaptors[i]))
		    {
			    SUPSEvent.removeEventHandlerKey(this.m_DClickBindings[iBindingPos]);
			    this.m_DClickBindings[iBindingPos] = null;
			    
			    iBindingPos++;
			}
			else
			{
			    // Instance of grid adaptor
			    this.m_doubleClickAdaptors[i].removeDblclickListener(this.m_eventHandler);
			}
		}
		
		// Clear reference to inner function
		this.m_eventHandler = null;
	}
}


EventBinding.prototype._locateAdaptors = function(bindings)
{
	var fc = FormController.getInstance();
	var targetAdaptors = new Array();
	if(bindings != null) 
	{
		// The following line does not work across frames probably because it compares
		// the reference to the constructor function
		//if(bindings.constructor != Array)
		if(bindings.length == null)
		{	
			throw new ConfigurationException("EventBinding properties must be arrays");
		}
	
		for(var i = 0, l = bindings.length ; i < l ; i++)
		{
			// TODO: May be able to replace this with associate array lookup
			targetAdaptors[i] = fc.getAdaptorById(bindings[i].element);
			if(null == targetAdaptors[i])
			{	
				throw new ConfigurationException("Invalid element ID in EventBinding binding: " + bindings[i].element);
			}
		}
	}
	return targetAdaptors;
}


EventBinding.prototype.getSources = function()
{
	fc_assert(this.m_callback, "Must bind EventBinding");
	// Concatenate the event generatation arrays
	if(null == this.m_sources)
	{
		this.m_sources = new Array();
		var all = this.m_keyAdaptors.concat(this.m_singleClickAdaptors.concat(this.m_doubleClickAdaptors));
	 	
	 	// Remove duplicates
	 	all.sort(function(a, b) { return String.strcmp(a.m_element.id, b.m_element.id); });

	 	var last = null;
	 	while(all.length > 0)
	 	{
	 		var candidate = all.pop();
	 		if(last != candidate.m_element.id)
	 		{
	 			last = candidate.m_element.id;
	 			this.m_sources.push(candidate);	
	 		}
	 	}
	 }

	// Return array
	return this.m_sources;
}

/**
 * Method handles event generated for event binding
 *
*/
EventBinding.prototype._handleEvent = function()
{
    if(this.getEnabled() == true)
    {
        this.m_callback.call();
    }
}

/**
 * Method returns listeners associated with event binding.
 *
*/
EventBinding.prototype.getListeners = function()
{
    var listenersForProtocol;
    
    var index = 0;
    var allListeners = new Array();
    
    for( var i = 0, l1 = this.m_listeningProtocols.length; i < l1; i++ )
    {
        listenersForProtocol = this[ 'getListenersFor' + this.m_listeningProtocols[i] ].call(this);
        
        for( var j = 0, l2 = listenersForProtocol.length; j < l2; j++)
        {
            allListeners[index] = listenersForProtocol[j];
            index++;
        }
        
        listenersForProtocol = null;
        
    }
    
    return allListeners;
}

/**
 * Method initialises prototcols implemented by EventBinding.
 *
*/
EventBinding.prototype.initialiseStates = function(e)
{
    Services.startTransaction();
    
    for( var i = 0, l = this.m_initialiseList.length; i < l; i++ )
    {
        this[ this.m_initialiseList[i] ].call( this, e );
    }
    
    Services.endTransaction();
}

EventBinding.prototype.hasConfiguredProperty = function(propName)
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

/**
 * This method is a dummy stub for the state change protocol method
 * "changeAdaptorState". The event binding class does not implement
 * the state change protocol although methods of this prototcol
 * are invoked by the enablement protocol. As the event binding
 * will never be submitted it does not need the submissibility
 * functionality.
 *
*/
EventBinding.prototype.changeAdaptorState = function(event)
{
    // Do nothing
}

/**
 * This method is a dummy stub for the "renderState" method implemented
 * by all adaptors. The event binding class is not a true adaptor
 * and does not need to be redrawn when the enablement state changes.
 *
*/
EventBinding.prototype.renderState = function()
{
    // Do nothing
}
