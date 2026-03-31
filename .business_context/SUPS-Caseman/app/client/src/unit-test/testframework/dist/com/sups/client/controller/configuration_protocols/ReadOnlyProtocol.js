//==================================================================
//
// ReadOnlyProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support being readonly. When a GUIAdaptor is set to readonly
// it should stop responding to user input which affects its value.
// Other user interaction may continue as determined as appropriate
// by the GUIAdaptor. The GUIAdaptor should also render itself in 
// suitable manner to indicate that it is readonly.
//
// If the ReadOnly protocol is added to a GUIAdaptor, then the
// FormController will call the Adaptor's invokeIsReadOnly() method 
// to call any configured isReadOnly methods when any of the xpaths
// in the readOnlyOn array are modified.
// The FormController will then notify the adaptor of it's new
// readonly state by calling the setReadOnly() method supplied by
// this protocol. This sets the internal m_readOnly flag.
//
// It is the responsability of the adaptor itself to interpret the
// meaning of m_readOnly and render itself appropriately and disable
// any approriate event handling in its renderState() method.
//
//==================================================================


/*
 * ReadOnlyProtocol constructor
 *
 * @constructor
 */
function ReadOnlyProtocol()
{
}


/**
 * Current read only state of the adaptor - defaults to read/write.
 */
ReadOnlyProtocol.prototype.m_readOnly = false;

ReadOnlyProtocol.prototype.m_originalReadOnly = false;
ReadOnlyProtocol.prototype.m_containerReadOnly = false;

/*
 * Property to keep track of whether or not readonly state has
 * changed since last refresh
 */
ReadOnlyProtocol.prototype.m_readOnlyChanged = false;


/**
 * Array of XPaths which determine when the read only state of 
 * the GUI Adaptor is re-evaluated.
 *
 * @configuration
 */
ReadOnlyProtocol.prototype.readOnlyOn = null;


/**
 * Configuration function for object which determines whether
 * or not the field is readonly or not.
 *
 * @return true if the field is enabled or false otherwise.
 * @type boolean
 * @configuration
 */
ReadOnlyProtocol.prototype.isReadOnly = null;


/**
 * Initialisation method for ReadOnlyProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ReadOnlyProtocol.prototype.configReadOnlyProtocol = function(cs)
{
	// Need to determine how to merge readOnlyOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].readOnlyOn)
		{
			this.readOnlyOn = cs[i].readOnlyOn;
			break;
		}
	}
}


/*
 * Sets up the protocol. 
 */
ReadOnlyProtocol.prototype.initialiseReadOnlyProtocol = function(e)
{
	this.setReadOnly(this.invokeIsReadOnly(e));	
}


/**
 * Perform cleanup required by the ReadOnlyProtocol before
 * it is destroyed
 */
ReadOnlyProtocol.prototype.disposeReadOnlyProtocol = function()
{
}


/**
 * Get additional databindings that trigger a refresh of the
 * field's mandatory state.
 */
ReadOnlyProtocol.prototype.getReadOnlyOn = function()
{
	return this.readOnlyOn;
}


ReadOnlyProtocol.prototype.hasIsReadOnly = function()
{
	return this.hasConfiguredProperty("isReadOnly");
}


/**
 * Invoke the isReadOnly method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
ReadOnlyProtocol.prototype.invokeIsReadOnly = function(event)
{
	// Invoke all configurations, if any isReadOnly returns
	// true then the adapter is readonly.
	var cs = this.getConfigs();

	var readOnly = false;
	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].isReadOnly && cs[i].isReadOnly.call(this, event))
		{
			readOnly = true;
			break;
		}
	}
	
	return readOnly;
}

ReadOnlyProtocol.prototype.setContainerReadOnly = function(ro)
{
	var r = false;
	this.m_containerReadOnly = ro;
	if(ro == false)
	{
		if(this.m_readOnly != this.m_originalReadOnly)
		{
			this.m_readOnly = this.m_originalReadOnly;

			// Toggle mandatory change flag
			this.m_readOnlyChanged = !this.m_readOnlyChanged;

			r = true;
			
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.READONLY_TYPE, this.m_readOnly, this);
			this.changeAdaptorState(e);
		}
	}
	else
	{
		this.m_originalReadOnly = this.m_readOnly;
		if(ro != this.m_readOnly)
		{
			this.m_readOnly = ro;
			
			// Toggle mandatory change flag
			this.m_readOnlyChanged = !this.m_readOnlyChanged;

			r = true;
			
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.READONLY_TYPE, this.m_readOnly, this);
			this.changeAdaptorState(e);
		}
	}
	return r;	
}

/**
 * Set whether or not the GUI Element should be rendered in the
 * enabled state or not. We only take into account the read only
 * status if we are not being overwritten by our container's RO status.
 *
 * @param ro boolean that determines whether or not the field
 *   is rendered in the read only state or not
 * @return true if the state of adaptor changed
 * @type boolean
 */
ReadOnlyProtocol.prototype.setReadOnly = function(ro)
{
	var r = false;
	if(this.m_containerReadOnly == true)
	{
		this.m_originalReadOnly = ro;
	}
	if(this.m_containerReadOnly == false && ro != this.m_readOnly)
	{
		this.m_readOnly = ro;
		
		// Toggle mandatory change flag
		this.m_readOnlyChanged = !this.m_readOnlyChanged;
		
		r = true;

		// Trigger a StateChangeEvent if the value has changed
		var e = StateChangeEvent.create(StateChangeEvent.READONLY_TYPE, this.m_readOnly, this);
		this.changeAdaptorState(e);
	}
	return r;
}


/**
 * Get whether the GUI Element is rendered as read only or not
 *
 * @return true if the Element is rendered as read only or false
 * if it isn't
 * @type boolean
 */
ReadOnlyProtocol.prototype.getReadOnly = function()
{
	return this.m_readOnly;
}

/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
ReadOnlyProtocol.prototype.getListenersForReadOnlyProtocol = function()
{
	// Note enablement do not depend on the fields own values -
	// this would mean that they could become none editable depending
	// on what was entered, which does not make sense.
	
	//@todo This is hack to get initialisation of fields with static 
	// enablement rules to work correctly
    var listenerArray = new Array();
    
    if (!this.hasIsReadOnly())
    {
        return listenerArray; 
    } 
    
    var listener = FormControllerListener.create(this, FormController.READONLY);
    
    var db = this.dataBinding;
	if(null != db) 
    {
        listenerArray.push({xpath: db, listener: listener});
    }
    
	var on = this.getReadOnlyOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: listener});
		}
	}
    return listenerArray;
}
