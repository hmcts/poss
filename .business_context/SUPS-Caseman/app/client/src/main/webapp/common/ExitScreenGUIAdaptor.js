/** 
 * @fileoverview ExitScreenGUIAdaptor.js - Class for implementing a custom 
 * adaptor used for attaching a function to the closing of the window either
 * via clicking the 'X' in the upper right hand corner or via ending the task
 * in Task Manager.
 *
 * @author Chris Vincent
 * @version 1.0
 */

/**
 * @author rzxd7g
 * 
 */
function ExitScreenGUIAdaptor()
{
}

/**
* Subclass of HTMLElementGUIAdaptor
 */
ExitScreenGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
ExitScreenGUIAdaptor.prototype.constructor = ExitScreenGUIAdaptor;

/**
 * Class member variables
 */
ExitScreenGUIAdaptor.m_logger = new Category("ExitScreenGUIAdaptor");
ExitScreenGUIAdaptor.CSS_CLASS_NAME = "exitScreenAdaptor";

ExitScreenGUIAdaptor.prototype.m_element = null;
ExitScreenGUIAdaptor.prototype.m_onUnloadHandler = null;

/**
 * Add the required protocols to the adaptors
 */
GUIAdaptor._setUpProtocols("ExitScreenGUIAdaptor");

/**
 * Create a new ExitScreenGUIAdaptor
 
 * @param e the logic element to manage
 * @return the new ExitScreenGUIAdaptor
 * @type ExitScreenGUIAdaptor
 * @author rzxd7g
 */
ExitScreenGUIAdaptor.create = function(e)
{
	var a = new ExitScreenGUIAdaptor();
	a._initExitScreenGUIAdaptor(e);
	return a;
}


/**
 * Initialise the ExitScreenGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 * @author rzxd7g
 * 
 */
ExitScreenGUIAdaptor.prototype._initExitScreenGUIAdaptor = function(e)
{
	if(ExitScreenGUIAdaptor.m_logger.isInfo()) ExitScreenGUIAdaptor.m_logger.info(e.id + ":ExitScreenGUIAdaptor._initExitScreenGUIAdaptor");
	
	this.m_element = e;
	var a = this;	
}


/**
 * Configure the ExitScreenGUIAdaptor
 *
 * @param cs an Array of configuration objects
 * @author rzxd7g
 * @return a.handleExit()  })  
 */
ExitScreenGUIAdaptor.prototype._configure = function(cs)
{
	// Run through configuration specific to this element
	for( var i=0, l=cs.length; i<l; i++ )
	{
		var c = cs[i];
		if ( null != c.handleExit ) 
		{
			this.handleExit = c.handleExit;
		}
		else
		{
			throw new ConfigurationException("ExitScreenGUIAdaptor: You must configure a handleExit function for the adaptor");
		}
	}

	var a = this;
	if ( null != a.handleExit )
	{
		// If the handleExit function has been specified for the adaptor, attach
		// the function to the parent window's onBeforeUnload event.
		this.m_onUnloadHandler = SUPSEvent.addEventHandler(window.parent, "beforeunload", function(evt) { return a.handleExit(); });
	}
}


/**
 * Dispose method
 * @author rzxd7g
 * 
 */
ExitScreenGUIAdaptor.prototype._dispose = function()
{
	this.m_element = null;
    if(this.m_onUnloadHandler != null)
    {
    	// Remove the event handler
        SUPSEvent.removeEventHandlerKey(this.m_onUnloadHandler);
    }
}
