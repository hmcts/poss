//==================================================================
//
// MouseWheelBindingProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support keybindings.
//
//==================================================================


/*
 * MouseWheelBindingProtocol constructor
 *
 * @constructor
 */
function MouseWheelBindingProtocol()
{
}


/**
 * Initialisation method for Keybinding protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
MouseWheelBindingProtocol.prototype.configMouseWheelBindingProtocol = function(cs)
{
}


MouseWheelBindingProtocol.prototype.disposeMouseWheelBindingProtocol = function()
{
}


MouseWheelBindingProtocol.prototype.getKeyBindings = function()
{
	if(null == this.m_keys) this.m_keys = new ElementKeyBindings(this);
	return this.m_keys;
}
/**
 * Method called when the mouse wheel is 'rotated' that triggers scrolling of the data up or down.
 */
MouseWheelBindingProtocol.prototype.handleScrollMouse = function(evt)
{
}

