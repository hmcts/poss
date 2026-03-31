//==================================================================
//
// HTMLElementGUIAdaptor.js
//
// Specialisation of GUIAdaptor which adds methods specific to the
// HTML implementions of the GUIAdaptors.
//
//==================================================================

/**
 * Exception thrown when an error occurs while using the adaptor
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
/*function GUIAdaptorError(message, ex)
{
   this.message = message;
   this.exception = ex;
}
GUIAdaptorError.prototype = new Error();
GUIAdaptorError.prototype.constructor = GUIAdaptorError;
*/
/**
 * Specialisation of GUIAdaptor which adds methods specific to the
 * HTML implementions of the GUIAdaptors.
 *
 * @constructor
 */
function HTMLElementGUIAdaptor()
{
}

/**
 * FormElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
HTMLElementGUIAdaptor.prototype = new GUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("HTMLElementGUIAdaptor");

/**
 * Add the required protocols to the HTMLElementGUIAdaptor
 */
GUIAdaptor._addProtocol('HTMLElementGUIAdaptor', 'StateChangeEventProtocol');	// Supports receiving and bubbling of state change events
GUIAdaptor._addProtocol('HTMLElementGUIAdaptor', 'LogicProtocol');
GUIAdaptor._addProtocol('HTMLElementGUIAdaptor', 'ActiveProtocol');			//  All HTML Element based adaptors support logic


/**
 * Set the constructor property so we can identify the type
 */
HTMLElementGUIAdaptor.prototype.constructor = HTMLElementGUIAdaptor;


/**
 * The HTML element which represents the GUI Element
 *
 * @type HTMLElement
 */
HTMLElementGUIAdaptor.prototype.m_element = null;


/**
 * Reference to the Renderer instance used to create the view
 * for this component - may be null if no Renderer was used
 * to create the component
 *
 * @type Object
 */
HTMLElementGUIAdaptor.prototype.m_renderer = null;


/**
 * Initialise the adaptor
 */
HTMLElementGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	this.m_element = e;
	
	if(null != e.__renderer)
	{
		// Get a handle to the renderer instance
		this.m_renderer = e.__renderer;

		// Break circular reference in HTML to avoid memory leaks
		this.m_element.__renderer = null;
	}
}


/**
 * Get the id for the component
 *
 * @return the id of the component as a string
 * @type String
 */
HTMLElementGUIAdaptor.prototype.getId = function()
{
	return this.m_element.id;
}

/**
 * Get a display name for the adaptor, usually used for reporting errors to the user. Uses the name if it
 * supported, or else returns the ID.
 */ 
HTMLElementGUIAdaptor.prototype.getDisplayName = function()
{
	return (null == this.getName ? this.getId() : this.getName());
}

/**
 * Get the main HTML element for the GUI element
 */
HTMLElementGUIAdaptor.prototype.getElement = function()
{
	return this.m_element;
}


/**
 * Get the value from the view, i.e. the HTML element. Default behaviour is to get the
 * value property from the HTML element, but this will need to be overridden for most adaptors
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 * @type ???
 */
HTMLElementGUIAdaptor.prototype._getValueFromView = function()
{
	if(null == this.m_element)
	{
		throw new GUIAdaptorError("HTMLElementGUIAdaptor._getValueFromView(), this.m_element == null");
	}
	if(undefined == this.m_element.value)
	{
		throw new GUIAdaptorError("HTMLElementGUIAdaptor._getValueFromView(id: " + this.getId() + "), this.m_element contains no \'value\' property. The adaptor should override this method.");
	}

	return this.m_element.value;
}


/*
 * Method called to determine the absolute pixel position of the element on the browser. This could
 * be used to hide selects in IE when attempting to display other elements on top of them, due to
 * the z-index IE bug with selects.
 */
HTMLElementGUIAdaptor.prototype.getElementPosition = function()
{
	if(null != this.m_position) return this.m_position;
	
	var style = this.m_element.style;
	if(style.position == "absolute")
	{
		// ToDo - needs more work
		return {left: style.left, top: style.top, width: style.width, height: style.height};
	}
	
	var offsetTrail = this.m_element;
	var offsetLeft = 0;
	var offsetTop = 0;
	var offsetWidth = offsetTrail.offsetWidth;
	var offsetHeight = offsetTrail.offsetHeight;
	while(offsetTrail)
	{
		offsetLeft += offsetTrail.offsetLeft;
		offsetTop += offsetTrail.offsetTop;
		offsetTrail = offsetTrail.offsetParent;
	}
	this.m_position = {left: offsetLeft, top: offsetTop, width: offsetWidth, height: offsetHeight};
	return this.m_position;
}
