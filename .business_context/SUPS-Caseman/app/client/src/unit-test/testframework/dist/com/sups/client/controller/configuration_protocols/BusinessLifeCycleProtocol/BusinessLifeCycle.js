//==================================================================
//
// BusinessLifeCycle.js
//
//
//==================================================================


/**
 * BusinessLifeCycle constructor
 *
 * @constructor
 */
function BusinessLifeCycle() {}

BusinessLifeCycle.m_logger = new Category( "BusinessLifeCycle" );

/**
 * Define class constants
 *
*/
BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG = 'Unsaved changes exist. Click "Yes" to save changes and continue; click "No" to discard changes and continue; click "Cancel" to return to existing screen.'; 


/**
 * Event trigger object that binds the view level events to the logical
 * BusinessLifeCycleEvent
 *
 * @private
 * @type EventBinding
 */
BusinessLifeCycle.prototype.m_eventBinding = null;


/**
 * The adaptor which this BusinessLifeCycle is associated with
 *
 * @private
 * @type GUIAdaptor
 */
BusinessLifeCycle.prototype.m_adaptor = null;


/**
 * Initialise the BusinessLifeCycle
 *
 * @param adaptor the adaptor to which the BusinessLifeCycle is bound
 */
BusinessLifeCycle.prototype.initialise = function(adaptor)
{
	this.m_adaptor = adaptor;
}


/**
 * Configure the BusinessLifeCycle
 *
 * @param config the BusinessLifeCycle configuration
 */
BusinessLifeCycle.prototype.configure = function(config)
{
	// Configure event bindings here
	if(null != config.eventBinding)
	{
	    var id = this.m_adaptor.getId() + 
	             "_" +
	             this.getName() +
	             "_eventBinding";
	             
		this.m_eventBinding = new EventBinding(id);
		
		this.m_eventBinding.configure(config.eventBinding);
		
		if(this.m_eventBinding.hasConfiguredProperty( "isEnabled" ) )
		{
		    FormController.getInstance().addEnablementEventBinding(this.m_eventBinding);
		}
		
		var thisObj = this;
		this.m_eventBinding.bind( function() { thisObj.dispatchEvent(); } );
	}

	// Call derived classes _configure method
	this._configure(config);
}


/**
 * Derived BusinessLifeCycle specific configuration.
 * Default implementation does nothing.
 *
 * @param config the BusinessLifeCycle configuration
 */ 
BusinessLifeCycle.prototype._configure = function(config)
{
}


/**
 * Dispose of the business life cycle
 */
BusinessLifeCycle.prototype.dispose = function()
{
	// Perform any adaptor specific cleanup
	this._dispose();

	// Get rid of any event bindings if any
	if(null != this.m_eventBinding)
	{
		this.m_eventBinding.dispose();
	}
}


/**
 * Derived BusinessLifeCycle specific dispose method.
 * Default implementation does nothing.
 *
 * @param config the BusinessLifeCycle configuration
 */ 
BusinessLifeCycle.prototype._dispose = function(config)
{
}


/**
 * Get the BusinessLifeCycle's EventBinding object
 *
 * @type EventBinding
 */
BusinessLifeCycle.prototype.getEventBinding = function()
{
	return this.m_eventBinding;
}


/**
 * Dispatch this BusinessLifeCycle's event to the adaptor to which this
 * BusinessLifeCycle is associated with.
 */
BusinessLifeCycle.prototype.dispatchEvent = function()
{
    //BusinessLifeCycle.m_logger.error( "BusinessLifeCycle dispatchEvent " + this.getName() );
    
	Services.dispatchEvent(this.m_adaptor.getId(), this.getName(), null);
}


/**
 * Get the name of the BusinessLifeCycle. Must be overriden by derived classes
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
BusinessLifeCycle.prototype.getName = function()
{
	fc_assertAlways("BusinessLifeCycle::getName(): Base class method must be overriden");
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle. Must be overriden by derived classes
 *
 * @param e the BusinessLifeCycleEvent
 */
BusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	fc_assertAlways("BusinessLifeCycle::invokeBusinessLifeCycle(): Base class method must be overriden");
}



/**
 * Start the life cycle's event binding functionality
 */
BusinessLifeCycle.prototype.start = function()
{
    if(null != this.m_eventBinding)
    {
        this.m_eventBinding.start();
    }
}

/**
 * Stop the life cycle's event binding functionality
 *
*/
BusinessLifeCycle.prototype.stop = function()
{
    if(null != this.m_eventBinding)
    {
        this.m_eventBinding.stop();
    }
}


/**
 * Get the adaptor to which this LifeCycle is bound
 *
 * @return the adaptor to which this LifeCycle is bound
 * @type GUIAdaptor
 */
BusinessLifeCycle.prototype.getAdaptor = function()
{
	return this.m_adaptor;
}
