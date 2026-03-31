//==================================================================
//
// TemporaryProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to act as a temporary field. A temporary field can provide normal
// validation and mandatory functionality when the user interacts
// with the field, however its mandatory and validation behaviour is
// ignored when the overall validity of the form is determined.
//
//==================================================================


/*
 * TemporaryProtocol constructor
 *
 * @constructor
 */
function TemporaryProtocol()
{
}


/**
 * Configuration function for object which determines whether
 * or not the field is enabled or not.
 *
 * @return true if the field is enabled or false otherwise.
 * @type boolean
 * @configuration
 */
TemporaryProtocol.prototype.isTemporary = null;


/**
 * Initialisation method for TemporaryProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
TemporaryProtocol.prototype.configTemporaryProtocol = function(cs)
{
}


/**
 * Perform cleanup required by the TemporaryProtocol before
 * it is destroyed
 */
TemporaryProtocol.prototype.disposeTemporaryProtocol = function()
{
}

							
TemporaryProtocol.prototype.hasTemporary = function()
{
	return this.hasConfiguredProperty("isTemporary");
}


/**
 * Invoke the isTemporary method(s) of the GUI Element
 *
 * @return the name of the GUI Element.
 * @type String
 */
TemporaryProtocol.prototype.invokeIsTemporary = function()
{
	// Invoke all configurations, if any isTemporary returns
	// true then the adapter is temporary.
	var cs = this.getConfigs();

	var temp = false;
	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].isTemporary)
		{
			temp = cs[i].isTemporary.call(this);

			this.setTemporary(temp);
		}
	}
	
	return temp;
}

/**
 * Set whether or not the GUI Element should be included in the
 * form validation or not.
 *
 * @param e boolean that determines whether or not the field
 *   should be included in the form validation or not.
 * @return true if the state of adaptor changed
 * @type boolean
 */
TemporaryProtocol.prototype.setTemporary = function(t)
{
	var r = false;
	if(t != this.m_temporary)
	{
		this.m_temporary = t;
		
		// Toggle temporary changed flag
		this.m_temporaryChanged = !this.m_temporaryChanged;
		
		r = true;

		// Trigger a StateChangeEvent if the state has changed
		var e = StateChangeEvent.create(StateChangeEvent.TEMPORARY_TYPE, this.m_temporary, this);
		this.changeAdaptorState(e);
	}
	return r;
}


/**
 * Get whether the GUI Element should be included in the form validation or not.
 *
 * @return true if the Element should be included in the form validation or not, or false if
 *    it shouldn't
 * @type boolean
 */
TemporaryProtocol.prototype.getTemporary = function()
{
	return this.m_temporary;
}
