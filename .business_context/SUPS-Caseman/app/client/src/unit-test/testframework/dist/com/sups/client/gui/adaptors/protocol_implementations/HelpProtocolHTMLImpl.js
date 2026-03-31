//==================================================================
//
// HelpProtocolHTMLImpl.js
//
// Class which provides a default implementation of the GUI Adapter
// parts of the HelpProtocol for HTML elements.
//
//==================================================================


function HelpProtocolHTMLImpl() {};


/**
 * Setup popup help on the adaptor.
 *
 * @param k the key to be bound
 * @param a the action to called when the key is pressed.
 * @return void
 * @type void
 */
HelpProtocolHTMLImpl.prototype.bindHelp = function()
{
	PopupHelp.getInstance().addToElement(this);
}

/**
 * Remove popup help on adaptor
 *
 * @return void
 * @type void
*/

HelpProtocolHTMLImpl.prototype.unbindHelp = function()
{
    PopupHelp.getInstance().removeFromElement(this);
}

/**
 * Get the help text for an adaptor
 * This can be string or a function that returns a string
 *
 * @return Help text for adaptor
 * @type string
*/

HelpProtocolHTMLImpl.prototype.getHelpText = function()
{
	var text = this.helpText;

    // Evaluate conditional help text if required
	if (typeof text == "function") text = text.call();

	return(text);
}

HelpProtocolHTMLImpl.prototype.configHelpProtocolHTMLImpl = function()
{
}

HelpProtocolHTMLImpl.prototype.disposeHelpProtocolHTMLImpl = function()
{
}
