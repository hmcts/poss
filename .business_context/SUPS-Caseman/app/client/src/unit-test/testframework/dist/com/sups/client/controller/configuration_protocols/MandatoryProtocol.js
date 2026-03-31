//==================================================================
//
// MandatoryProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support the concept of being mandatory. A mandatory field must
// have a value in order for the form to which it belongs to be 
// considered 'valid'. When the field is mandatory and has no value
// it should render itself suitably to indicate its mandatory
// nature. Once a mandatory field has a value, it should render
// itself normally.
//
// If the Mandatory protocol is added to a GUIAdaptor, then the
// FormController will call the Adaptor's invokeIsMandatory() method 
// to call any configured isEnabled methods when any of the xpaths
// in the enableOn array or the GUIAdaptors own dataBinding xpath 
// are modified.
// The FormController will then notify the adaptor of it's new
// mandatory state by calling the setMandatory() method supplied by
// this protocol. This sets the internal m_mandatory flag.
//
// It is the responsability of the adaptor itself to interpret the
// meaning of m_mandatory and render itself appropriately in its 
// renderState() method.
//
// NOTE: It does not make sense for adaptors which always have a
// value (e.g. a checkbox must be checked or unchecked - it cannot
// have a "null" value) to support the mandatory protocol.
//
//==================================================================


/*
 * MandatoryProtocol constructor
 *
 * @constructor
 */
function MandatoryProtocol()
{
}

MandatoryProtocol.m_logger = new Category("MandatoryProtocol");

/**
 * Current mandatory state of the adaptor - defaults to not 
 * mandatory.
 */
MandatoryProtocol.prototype.m_mandatory = false;


/*
 * Property to keep track of whether or not mandatory state has
 * changed since last refresh
 */
MandatoryProtocol.prototype.m_mandatoryChanged = false;


/**
 * Array of XPaths which determine when the mandatory state of 
 * the GUI Adaptor is re-evaluated.
 *
 * @configuration
 */
MandatoryProtocol.prototype.mandatoryOn = null;


/**
 * Mandatory function for the element
 *
 * @return true if the field is mandatory or false otherwise.
 * @type boolean
 * @configuration
 */
MandatoryProtocol.prototype.isMandatory = null;


/**
 * Initialisation method for MandatoryProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
MandatoryProtocol.prototype.configMandatoryProtocol = function(cs)
{
	// Need to determine how to merge mandatoryOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].mandatoryOn)
		{
			this.mandatoryOn = cs[i].mandatoryOn;
			break;
		}
	}
}

/*
 * Sets up the protocol. 
 */
MandatoryProtocol.prototype.initialiseMandatoryProtocol = function(e)
{
	this.setMandatory(this.invokeIsMandatory(e));	
}


/**
 * Perform cleanup required by the MandatoryProtocol before
 * it is destroyed
 */
MandatoryProtocol.prototype.disposeMandatoryProtocol = function()
{
}


/**
 * Get additional databindings that trigger a refresh of the
 * field's mandatory state.
 */
MandatoryProtocol.prototype.getMandatoryOn = function()
{
	return this.mandatoryOn;
}


MandatoryProtocol.prototype.hasIsMandatory = function()
{
	return this.hasConfiguredProperty("isMandatory");
}


/**
 * Invoke the isMandatory method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
MandatoryProtocol.prototype.invokeIsMandatory = function(event)
{
	// If there is a value then mandatory is automatically false
	if (this.configDataBindingProtocol != null && this.hasValue())
	{
		return false;	
	}
	
	var mandatory = false;
	// Invoke all configurations, if any isMandatory returns
	// true then the adapter is mandatory.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].isMandatory && cs[i].isMandatory.call(this, event))
		{
			mandatory = true;
			break;
		}
	}
	return mandatory;
}


/**
 * Set whether or not the GUI Element should be rendered in the
 * mandatory state or not.
 *
 * @param m boolean that determines whether or not the field
 *   is mandatory or not
 * @return true if the state of adaptor changed
 * @type boolean
 */
MandatoryProtocol.prototype.setMandatory = function(m)
{
	//if(MandatoryProtocol.m_logger.isError()) MandatoryProtocol.m_logger.error("MandatoryProtocol.setMandatory() this.getId()=" + this.getId() + ", mandatory=" + m);
	var r = false;
	if(m != this.m_mandatory)
	{
		this.m_mandatory = m;
		
		// Toggle mandatory change flag
		this.m_mandatoryChanged = !this.m_mandatoryChanged;
		
		r = true;
		this.fireMandatoryStateChangeEvent();
	}
	
	return r;
}

MandatoryProtocol.prototype.fireMandatoryStateChangeEvent = function()
{
	// Trigger a StateChangeEvent if the value has changed
	var e = StateChangeEvent.create(StateChangeEvent.MANDATORY_TYPE, this.m_mandatory, this);
	this.changeAdaptorState(e);
}

/**
 * Get whether the GUI Element is rendered as mandatory or not
 *
 * @return true if the Element is rendered as mandatory or false if
 *    it isn't
 * @type boolean
 */
MandatoryProtocol.prototype.getMandatory = function()
{
	return this.m_mandatory;
}

/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
MandatoryProtocol.prototype.getListenersForMandatoryProtocol = function()
{
    var listenerArray = new Array();
    
    if (!this.hasIsMandatory())
    {
//        alert("mandatory not found");
        return listenerArray; 
    } 
    
    var listener = FormControllerListener.create(this, FormController.MANDATORY);
    
	// Fields with mandatory behaviour implicitly depend on their own value
    var db = this.dataBinding;
	if(null != db)
    {
        listenerArray.push({xpath: db, listener: listener});
    }
	var on = this.getMandatoryOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: listener});
		}
	}
    return listenerArray;
}
