//==================================================================
//
// BusinessLifeCycleProtocol.js
//
//
//==================================================================


/*
 * BusinessLifeCycleProtocol constructor
 *
 * @constructor
 */
function BusinessLifeCycleProtocol()
{
}


BusinessLifeCycleProtocol.PROTOCOL_NAME = "BusinessLifeCycleProtocol";

/**
 * Map of BusinessLifeCycles that the GUIAdaptor supports, indexed
 * by the BusinessLifeCycle name.
 *
 * @type Map[String, BusinessLifeCycle]
 * @private
 */
BusinessLifeCycleProtocol.prototype.m_lifeCycles = null;


/**
 * Initialisation method for BusinessLifeCycleProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
BusinessLifeCycleProtocol.prototype.configBusinessLifeCycleProtocol = function(cs)
{
	// New map to contain BusinessLifeCycles
	this.m_lifeCycles = new Array();
}


/**
 * Perform cleanup required by the BusinessLifeCycleProtocol before
 * it is destroyed
 */
BusinessLifeCycleProtocol.prototype.disposeBusinessLifeCycleProtocol = function()
{
	// Dispose all lifecycles...
	var lifeCycles = this.m_lifeCycles;
	for(var i in lifeCycles)
	{
		lifeCycles[i].dispose();
	}
}


/**
 * Handles a business lifecycle event by dispatching it to the appropriate BusinessLifeCycle
 *
 * @param event the BusinessLifeCycleEvent
 */
BusinessLifeCycleProtocol.prototype.handleBusinessLifeCycleEvent = function(event)
{
	var lifeCycle = this.m_lifeCycles[event.getType()];
	
	if(null != lifeCycle)
	{
		// LifeCycle exists on this adaptor so invoke its logic
		lifeCycle.invokeBusinessLifeCycle(event);
	}
	else
	{
		// LifeCycle does not exist of this adaptor so throw exception
		throw new BusinessLifeCycleError("Adaptor '" + this.getId() + "' does not support event of type '" + event.getType() + "'");
	}
}

/**
 * Add a BusinessLifeCycle to the set of the BusinessLifeCycles supported by the
 * adaptor. BusinessLifeCycles must have a unique name within the GUIAdaptor.
 *
 * @param lifeCycle the BusinessLifeCycle to add
 */
BusinessLifeCycleProtocol.prototype.addBusinessLifeCycle = function(lifeCycle)
{
	var lifeCycles = this.m_lifeCycles;
	var name = lifeCycle.getName();
	if(null == lifeCycles[name])
	{
		lifeCycles[name] = lifeCycle;
	}
	else
	{
		throw new BusinessLifeCycleError("Duplicate lifecycle '" + name + "' added to adaptor '" + this.getId() + "'");
	}
}

/**
 * Determine listeners associated with protocol.
 *
*/
BusinessLifeCycleProtocol.prototype.getListenersForBusinessLifeCycleProtocol = function()
{
    var eventBinding;
    var lifeCycle;
    var lifeCycleListeners;
    
    // Array of all listeners from life cycles
    var lifeCyclesListeners = new Array();
    
    // Search each life cycle for listeners on event binding
    var index = 0;
    var lifeCycles = this.m_lifeCycles;
    
    for( var i in lifeCycles )
    {
        lifeCycle = lifeCycles[i];
        
        eventBinding = lifeCycle.getEventBinding();
        
        if(null != eventBinding)
        {
            lifeCycleListeners = eventBinding.getListeners();
            
            for( var j = 0, l = lifeCycleListeners.length; j < l; j++ )
            {
                lifeCyclesListeners[index] = lifeCycleListeners[j];
                index++;
            }
            
            lifeCycleListeners = null;
            eventBinding = null;
        }
        
    }
    
    return lifeCyclesListeners;
}

/**
 * Initialise any protocols on event bindings which require
 * initialisation.
 *
*/
BusinessLifeCycleProtocol.prototype.initialiseBusinessLifeCycleProtocol = function(e)
{
    var lifeCycle;
    var eventBinding;
    
    var lifeCycles = this.m_lifeCycles;
    
    for( var i in lifeCycles )
    {
        lifeCycle = lifeCycles[i];
        
        eventBinding = lifeCycle.getEventBinding();
        
        if(null != eventBinding)
        {
            eventBinding.initialiseStates(e);
        }
    }
    
}
