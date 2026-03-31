//==================================================================
//
// DynamicLabelGUIAdaptor.js
//
// Class for implementing a dynamic label adaptor used to display different
// labels based on an xpath in the dom
//
//==================================================================

/**
 * Dynamic label class
 *
 * @constructor
 * @private
 * @author kznwpr
 * 
 */
function DynamicLabelGUIAdaptor(){};

/**
 * DynamicLabelGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
DynamicLabelGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
DynamicLabelGUIAdaptor.prototype.constructor = DynamicLabelGUIAdaptor;

/**
 * The CSS class of the adapter. This is specified in the applicationconfig.xml
 * when the external adapter is registered
 */
DynamicLabelGUIAdaptor.CSS_CLASS_NAME = "caseManDynamicLabel";

/**
 * Add the required protocols to the DynamicLabelGUIAdaptor
 */
GUIAdaptor._setUpProtocols('DynamicLabelGUIAdaptor'); 
GUIAdaptor._addProtocol('DynamicLabelGUIAdaptor', 'LabelProtocol');

/**
 * Static factory method for creating a new DynamicLabelGUIAdaptor
 *
 * @param e the element to manage
 * @return the new DynamicLabelGUIAdaptor
 * @type DynamicLabelGUIAdaptor
 * @author kznwpr
 */
DynamicLabelGUIAdaptor.create = function(element)
{
	// Note there is no 'this' in this method
	// Create the adapter
	var a = new DynamicLabelGUIAdaptor();
	
	// Store a reference to the element that the adapter represents in the document
	a.m_element = element;
	Logging.logMessage("DynamicLabelGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);
	
	// Store a reference to the label element, which is what we will update when the label text changes
	var label = element.__renderer.m_labelElement;
	a.m_labelElement = label;
	return a;
}

/**
 * Tidy up
 * @author kznwpr
 * 
 */
DynamicLabelGUIAdaptor.prototype._dispose = function()
{
	this.m_element.__renderer = null;
	this.m_element = null;
}

/**
 * The framework requires this method to be present
 * so just provide an empty implementation
 * @param cs
 * @author kznwpr
 * 
 */
DynamicLabelGUIAdaptor.prototype._configure = function(cs)
{
}

/**
 * Set the contents of the label element to be the value contained in the label
 * state. This is how the adapter is dynamically updated
 * @author kznwpr
 * 
 */
DynamicLabelGUIAdaptor.prototype.renderState = function()
{
	// Only update the label if there is some text to display
	if(null != this.m_label)
	{
		this.m_labelElement.innerHTML = this.m_label;
	}
}
