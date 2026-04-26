//==================================================================
//
// NameProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support naming of components. Names are used to refer to the
// field when interacting with the user, for instance when informing
// the user that a field is invalid when submitting a form.
//
//==================================================================


/*
 * NameProtocol constructor
 *
 * @constructor
 */
function NameProtocol()
{
}


/**
 * Configuration property that contains the name for the
 * GUI Element. Note that if this is not specified the controller
 * will try to determine the name from a label in the view or,
 * failing that, will generate a name based on the id string.
 *
 * @type String
 * @configuration
 */
NameProtocol.prototype.componentName = null; 


/**
 * Get the name of the GUI Element
 *
 * @return the name of the GUI Element.
 * @type String
 */
NameProtocol.prototype.getName = function()
{
	return null == this.componentName ? this.getId() : this.componentName;
}


/**
 * Initialisation method for NameProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
NameProtocol.prototype.configNameProtocol = function(cs)
{
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		if(null != cs[i].componentName)
		{
			// If there is specific name then just set this
			// Adaptors name configuration to it - there is no
			// chaining
			this.componentName = cs[i].componentName;
			break;
		}
	}
}


/**
 * Perform cleanup required by the NameProtocol before
 * it is destroyed
 */
NameProtocol.prototype.disposeNameProtocol = function()
{
}
