//==================================================================
//
// ComponentVisibilityProtocol.js
//
//
//==================================================================

ComponentVisibilityProtocol.VISIBILITY_VISIBLE = "visible";

/*
 * ComponentVisibilityProtocol constructor
 *
 * @constructor
 */
function ComponentVisibilityProtocol()
{
}

/**
 * Initialisation method for ComponentContainer protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ComponentVisibilityProtocol.prototype.configComponentVisibilityProtocol = function(cs)
{
}


/**
 * Perform cleanup required by the ComponentVisibilityProtocol before
 * it is destroyed
 */
ComponentVisibilityProtocol.prototype.disposeComponentVisibilityProtocol = function()
{
}

/**
 * Make this component visible immediatly
 */
ComponentVisibilityProtocol.prototype.show = function(showMe)
{
	fc_assert(false, "Must implement show function");
}



