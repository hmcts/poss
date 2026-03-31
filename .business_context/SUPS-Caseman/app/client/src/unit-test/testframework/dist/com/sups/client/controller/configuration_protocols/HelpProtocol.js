//==================================================================
//
// HelpProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support help. It is up to the framework how this help is
// rendered. A default implementation of this protocol for HTML is
// provided (see HelpProtocolHTMLImpl.js) which by shows the help
// as popup help. Additionally the FormController displays the
// help text in the status bar when the field has focus.
//
//==================================================================


/*
 * HelpProtocol constructor
 *
 * @constructor
 */
function HelpProtocol()
{
}


/**
 * Configuration property that contains the help text for the
 * GUI Element.
 *
 * @type String
 * @configuration
 */
HelpProtocol.prototype.helpText = null; 


HelpProtocol.prototype.getHelpText = function()
{
	return this.helpText;
}


/**
 * Initialisation method for Help protocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
HelpProtocol.prototype.configHelpProtocol = function(cs)
{
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		if(null != cs[i].helpText)
		{
			// If there is specific help text then just set this
			// Adaptors helpText configuration to it - there is no
			// chaining
			this.helpText = cs[i].helpText;
			this.bindHelp();
			break;
		}
	}
}


HelpProtocol.prototype.disposeHelpProtocol = function()
{
    if(this.helpText != null)
    {
        if(this.unbindHelp != null)
        {
            // Remove help
            this.unbindHelp();
        }
    }
}

/**
 * Setup help on the adaptor. This must be implemented
 * by the adaptor, which knows how to add help to itself.
 *
 * @return void
 * @type void
 */
HelpProtocol.prototype.bindHelp = undefined;

/**
 * Remove help on the adaptor. This must be implemented by the
 * adaptor, which knows how to remove help itself.
 *
 * @return void
 * @type void
*/

HelpProtocol.prototype.unbindHelp = undefined;
