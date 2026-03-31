//==================================================================
//
// InitialiseProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support an configurable initialisation method.
//
// The FormController calls invokeInitialise after it has performed
// all initialisation activities that it needs to do (including
// creation, configuration and initialisation of all the adaptors
// on the form), but before the user can interact with the form.
//
//==================================================================


/*
 * InitialiseProtocol constructor
 *
 * @constructor
 */
function InitialiseProtocol()
{
}


/**
 * Configuration function which allows the GUI Element to perform
 * some custom initialisation.
 *
 * @type Function(): void
 * @configuration
 */
InitialiseProtocol.prototype.initialise = null;


/**
 * The default value for the GUI Element
 */
InitialiseProtocol.prototype.m_defaultValue = null;


InitialiseProtocol.prototype.hasInitialise = function()
{
	return this.hasConfiguredProperty("initialise");
}


/**
 * Invoke the initialise method(s) of the GUI Element
 *
 * @return the name of the GUI Element.
 * @type String
 */
InitialiseProtocol.prototype.invokeInitialise = function()
{
	// Invoke all configurations, with least specific first
	var cs = this.getConfigs();
	
	for(var i = cs.length - 1; i >= 0; i--)
	{
		if(null != cs[i].initialise) 
		{
			var dV = cs[i].initialise.call(this);
			if(null != dV)
			{
				this.m_defaultValue = dV;
			}
		}
	}
}


/**
 * Initialisation method for Initialise protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
InitialiseProtocol.prototype.configInitialiseProtocol = function(cs)
{
}


InitialiseProtocol.prototype.disposeInitialiseProtocol = function()
{
}
