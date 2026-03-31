//==================================================================
//
// PageGUIAdaptor.js
//
// Class for implementing tabbed diaglouges for use in the
// framework
//
//==================================================================

/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 */
function PageGUIAdaptor(){};


/**
 * PageGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
PageGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
PageGUIAdaptor.prototype.constructor = PageGUIAdaptor;


/**
 * Add the required protocols to the PageGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('PageGUIAdaptor'); 
GUIAdaptor._addProtocol('PageGUIAdaptor', 'EnablementProtocol');            // Supports enablemen
GUIAdaptor._addProtocol('PageGUIAdaptor', 'ReadOnlyProtocol');			// Supports enablement/disablement
GUIAdaptor._addProtocol('PageGUIAdaptor', 'LabelProtocol');            // Supports labelling
GUIAdaptor._addProtocol('PageGUIAdaptor', 'ComponentContainerProtocol');				// 
GUIAdaptor._addProtocol('PageGUIAdaptor', 'ComponentVisibilityProtocol');


/**
 * CSS classes used to render the page in different states
 */
PageGUIAdaptor.CSS_CLASS_NAME = "page";
PageGUIAdaptor.DISABLED_CSS_CLASS_NAME = "pageDisabled";
PageGUIAdaptor.READONLY_CSS_CLASS_NAME = "pageReadOnly";
PageGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS = "pageNotSubmissible";


/**
 * Holds the currently net enablement state of the adaptor. This takes
 * into account both enablement and activation protocols.
 *
 * @type boolean
 * @private
 */
PageGUIAdaptor.prototype.m_netEnablementState = true;


/**
 * Callback list containing listeners to page enablement state changes
 *
 * @type CallbackList
 * @private
 */
PageGUIAdaptor.prototype.m_enablementCallbackList = null;


/**
 * Callback list containing listeners to page label changes
 *
 * @type CallbackList
 * @private
 */
PageGUIAdaptor.prototype.m_label_callbacklist = null;


/**
 * Callback list containing listeners to page visibility state changes
 *
 * @type CallbackList
 * @private
 */
PageGUIAdaptor.prototype.m_visibility_callbacklist = null;


/**
 * Create a new PageGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new PageGUIAdaptor
 * @type PageGUIAdaptor
 */
PageGUIAdaptor.create = function(element)
{
	Logging.logMessage("PageGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);

	var a = new PageGUIAdaptor();
	a._initialiseAdaptor(element);
	return a;
}


/**
 * Initialise the adaptor - override method in HTMLGUIAdaptor
 *
 * @param e the outermost html div element that represents the page
 * @private
 */
PageGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call the super class.
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	// Setup callback lists
	this.m_enablementCallbackList = new CallbackList();
	this.m_label_callbacklist = new CallbackList() ;
	this.m_visibility_callbacklist = new CallbackList() ;
}


/**
 * Cleanup any reference loops between the JavaScript and the DOM 
 */
PageGUIAdaptor.prototype._dispose = function()
{
    // Clean up callback function lists    
	this.m_enablementCallbackList.dispose();
	this.m_label_callbacklist.dispose();
	this.m_visibility_callbacklist.dispose();
	
	this.m_enablementCallbackList = null;
	this.m_label_callbacklist = null;
	this.m_visibility_callbacklist = null;
}

/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
PageGUIAdaptor.prototype._configure = function(cs)
{
	this.includeInValidation = false;
}


/**
 * Add listener that wants to hear changes in the page's enablement state
 *
 * @param callbackMethod the function to call when the page's enablement state changes
 */
PageGUIAdaptor.prototype.addEnablementChangeListener = function(callbackMethod)
{
	this.m_enablementCallbackList.addCallback(callbackMethod);
}


/**
 * Add listener that wants to hear changes in the page's label
 *
 * @param callbackMethod the function to call when the page's label changes
 */
PageGUIAdaptor.prototype.addLabelChangeListener = function(callbackMethod)
{
	this.m_label_callbacklist.addCallback(callbackMethod);
}


/**
 * Add listener that wants to hear changes in the page's visibility
 *
 * @param callbackMethod the function to call when the page's visibility changes
 */
PageGUIAdaptor.prototype.addVisibilityChangeListener = function(callbackMethod)
{	
	this.m_visibility_callbacklist.addCallback(callbackMethod);
}


/**
 * Update the components visual state based on its internal logical state
 */
PageGUIAdaptor.prototype.renderState = function()
{
    // Check to see if the adaptor needs to be re-rendered.
    if (renderStateChanged (this, this.m_netEnablementState))
    {
        this.m_netEnablementState = !this.m_netEnablementState;
        
        var className = PageGUIAdaptor.CSS_CLASS_NAME;
        if (this.m_netEnablementState)
        {
			if(!this.getAggregateState().isSubmissible())
			{
				className += " " + PageGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;
			}

			// If page is readonly, set appropriate CSS class
			if(this.getReadOnly())
			{
				className += " " + PageGUIAdaptor.READONLY_CSS_CLASS_NAME;
			}
	    }
	    else
	    {
            className += " " + PageGUIAdaptor.DISABLED_CSS_CLASS_NAME;
        }
		this.m_element.className = className;

		// Notify any listeners (usually the parent PagedAreaGUIAdaptor) of
		// the enablement state change. This is so that the PagedAreaGUIAdaptor
		// can notify the tab associated with this page that the page is disabled
		// so that the tab can be rendered as disabled.		
		this.m_enablementCallbackList.invoke(this.getId(), this.m_netEnablementState);
		
		this.m_enabledChanged = false;
	}	
	if ( true == this.m_labelChanged )
	{
		// Notify any label change listeneres (usually the parent PagedAreaGUIAdaptor)
		// of the label change. This is so that the PagedAreaGUIAdaptor can notify
		// the tab associated with this page that the page's label has change and so
		// the label on the tab should change.
		this.m_label_callbacklist.invoke(this.getId(), this.m_label);
		this.m_labelChanged = false ;
	}
}


/**
 * Show the page (implements required method supplied by the 
 * ComponentVisibilityProtocol).
 *
 * @param showMe true if the page is to shown or false if it is to hidden.
 */
PageGUIAdaptor.prototype.show = function(showMe)
{
	// Make the page visibile or not. Note that VISIBILITY_INHERIT means that page becomes visible if
	// it's parents are visible - our definition of visible in this case.
	this.m_element.style.visibility = showMe ? TabSelector.VISIBILITY_INHERIT : TabSelector.VISIBILITY_HIDDEN;

	// D231 - stop the hidden pages border showing through autocompletes etc drop downs by 
	// raising the visible page above the hidden pages in the z-order. (The default stacking
	// order is bottom-to-top in the order that the elements appear in the HTML source.)
	this.m_element.style.zIndex = showMe ? 1 : 0;

	// Notify any visibility change listeners (usually the parent PagedAreaGUIAdaptor)
	// of the visibility state change. This is so that the PagedAreaGUIAdaptor can notify
	// the tab associated with this page that the page's visibility has changed so
	// that the 
	this.m_visibility_callbacklist.invoke(this.m_element.id, showMe);
}

