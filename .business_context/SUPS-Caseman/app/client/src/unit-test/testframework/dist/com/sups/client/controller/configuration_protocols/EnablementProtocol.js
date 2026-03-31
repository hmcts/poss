//==================================================================
//
// EnablementProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support enablement and disablement. When a GUIAdaptor is set
// to disabled it should stop responding to user input of any kind
// and render itself in suitable manner to indicate that it is 
// disabled (typically some form of greying out).
//
// If the Enablement protocol is added to a GUIAdaptor, then the
// FormController will call the Adaptor's invokeIsEnabled() method 
// to call any configured isEnabled methods when any of the xpaths
// in the enableOn array are modified.
// The FormController will then notify the adaptor of it's new
// enablement state by calling the setEnabled() method supplied by
// this protocol. This sets the internal m_enabled flag.
//
// It is the responsability of the adaptor itself to interpret the
// meaning of m_enabled and render itself appropriately and disable
// any approriate event handling in its renderState() method.
//
//==================================================================


/*
 * EnablementProtocol constructor
 *
 * @constructor
 */
function EnablementProtocol()
{
}


/**
 * Current enablement state of the adaptor - defaults to enabled.
 */
EnablementProtocol.prototype.m_enabled = true;

EnablementProtocol.prototype.m_originalEnabled = true;
EnablementProtocol.prototype.m_containerEnabled = true;

/**
 * Keep track of previous enablement state
 */
EnablementProtocol.prototype.m_enabledChanged = false;


/**
 * Array of XPaths which determine when the enablement state of 
 * the GUI Adaptor is re-evaluated.
 *
 * @configuration
 * @merge-rule
 */
EnablementProtocol.prototype.enableOn = null;


/**
 * Configuration function for object which determines whether
 * or not the field is enabled or not.
 *
 * @return true if the field is enabled or false otherwise.
 * @type boolean
 * @configuration
 * @merge-rule Least specific rule processed first - if parent
 *   component isn't enabled, then there is no point evaluating
 *   child enablement.
 */
EnablementProtocol.prototype.isEnabled = null;


/**
 * Initialise the protocol
 *
 * @param e the DataModelEvent for initialisation
 */
EnablementProtocol.prototype.initialiseEnablementProtocol = function(e)
{
	this.setEnabled(this.invokeIsEnabled(e));	
}


/**
 * Configure the Protocol
 *
 * @param cs the configuration objects to inspect for protocol configuration properties
 * @type void
 */
EnablementProtocol.prototype.configEnablementProtocol = function(cs)
{
	// Need to determine how to merge enableOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].enableOn)
		{
			this.enableOn = cs[i].enableOn;
			break;
		}
	}
}


/**
 * Perform cleanup required by the protocol before it is destroyed
 */
EnablementProtocol.prototype.disposeEnablementProtocol = function()
{
}


/**
 * Get additional databindings that trigger a refresh of the
 * field's enablement state.
 */
EnablementProtocol.prototype.getEnableOn = function()
{
	return this.enableOn;
}


EnablementProtocol.prototype.hasIsEnabled = function()
{
	return this.hasConfiguredProperty("isEnabled");
}


/**
 * Invoke the isEnabled method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
EnablementProtocol.prototype.invokeIsEnabled = function(event)
{
	// Invoke all configurations, if any isEnabled returns
	// false then the adapter is disabled.
	var cs = this.getConfigs();

	var enabled = true;	
	for(var i = 0, l = cs.length; i < l && enabled; i++)
	{
		if(null != cs[i].isEnabled && !cs[i].isEnabled.call(this, event))
		{
			enabled = false;
			break;
		}
	}
	
	return enabled;
}

EnablementProtocol.prototype.setContainerEnabled = function(e)
{
	var r = false;
	this.m_containerEnabled = e;
	if(e == true)
	{
		if(this.m_enabled != this.m_originalEnabled)
		{
			this.m_enabled = this.m_originalEnabled;

			// Toggle mandatory change flag
			this.m_enabledChanged = !this.m_enabledChanged;

			r = true;
			
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE, this.m_enabled, this);
			this.changeAdaptorState(e);
		}
	}
	else
	{
		this.m_originalEnabled = this.m_enabled;
		if(e != this.m_enabled)
		{
			this.m_enabled = e;
			
			// Toggle mandatory change flag
			this.m_enabledChanged = !this.m_enabledChanged;

			r = true;
			
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE, this.m_enabled, this);
			this.changeAdaptorState(e);
		}
	}
	return r;
}

/**
 * Set whether or not the GUI Element should be rendered in the
 * enabled state or not.
 *
 * @param e boolean that determines whether or not the field
 *   is rendered in the enabled state or not
 * @param detail is an object providing additional information
 *               Ignored in the default implementation.
 * @return true if the state of adaptor changed
 * @type boolean
 */
EnablementProtocol.prototype.setEnabled = function(e, detail)
{
	var r = false;
	if(this.m_containerEnabled == false)
	{
		this.m_originalEnabled = e;
	}
	if(this.m_containerEnabled == true && e != this.m_enabled)
	{
		this.m_enabled = e;
		
		this.m_enabledChanged = !this.m_enabledChanged;
		
		r = true;

		// Trigger a StateChangeEvent if the value has changed
		var e = StateChangeEvent.create(StateChangeEvent.ENABLED_TYPE, this.m_enabled, this);
		this.changeAdaptorState(e);
	}
	return r;
}


/**
 * Get whether the GUI Element is rendered as enabled or not
 *
 * @return true if the Element is rendered as enabled or false if
 *    it isn't
 * @type boolean
 */
EnablementProtocol.prototype.getEnabled = function()
{
	return this.m_enabled;
}


/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
EnablementProtocol.prototype.getListenersForEnablementProtocol = function()
{
	// Note enablement do not depend on the fields own values -
	// this would mean that they could become none editable depending
	// on what was entered, which does not make sense.
	
	//@todo This is hack to get initialisation of fields with static 
	// enablement rules to work correctly
    
    var listenerArray = new Array();
    
    if (!this.hasIsEnabled())
    {
        return listenerArray; 
    } 
    
    var listener = FormControllerListener.create(this, FormController.ENABLEMENT);
    
    var db = this.dataBinding;
        
	if(null != db) 
    {
        listenerArray.push({xpath: db, listener: listener});
    }
	var on = this.getEnableOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: listener});
		}
	}
    
    return listenerArray;
}
