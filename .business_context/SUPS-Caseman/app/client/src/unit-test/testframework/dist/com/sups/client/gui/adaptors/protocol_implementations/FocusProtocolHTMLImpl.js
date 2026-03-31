//==================================================================
//
// FocusProtocolHTMLImpl.js
//
// Class which provides a default implementation of the GUI Adapter
// parts of the FocusProtocol for HTML elements.
//
//==================================================================


function FocusProtocolHTMLImpl() {};


FocusProtocolHTMLImpl.prototype.configFocusProtocolHTMLImpl = function()
{
}


FocusProtocolHTMLImpl.prototype.disposeFocusProtocolHTMLImpl = function()
{
}


FocusProtocolHTMLImpl.prototype.getFocusElement = function()
{
	// Defaults to main element for adaptor
	return this.getElement();
}
