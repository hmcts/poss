//==================================================================
//
// PanelGUIAdaptor.js
//
// Class for implementing a generic container adaptor used to set container
// level enablement and read-only states that propogate to all contained children.
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
function PanelGUIAdaptor(){};

/**
 * PanelGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
PanelGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
PanelGUIAdaptor.prototype.constructor = PanelGUIAdaptor;

PanelGUIAdaptor.CSS_CLASS_NAME = "panel";
PanelGUIAdaptor.CSS_NO_MARGIN_CLASS_NAME = "panel noMargin";
PanelGUIAdaptor.DISABLED_CSS_CLASS_NAME = "panel_disabled";

/**
 * Add the required protocols to the PanelGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('PanelGUIAdaptor'); 
GUIAdaptor._addProtocol('PanelGUIAdaptor', 'EnablementProtocol');            // Supports enablemen
GUIAdaptor._addProtocol('PanelGUIAdaptor', 'ReadOnlyProtocol');			// Supports enablement/disablement
GUIAdaptor._addProtocol('PanelGUIAdaptor', 'ComponentContainerProtocol');				// 


/**
 * The initial CSS class of the panel. Need to keep this as divs
 * with different CSS classes result in a PanelGUIAdaptor being
 * created
 *
 * @private
 * @type String
 */
PanelGUIAdaptor.prototype.m_cssClass = null;


/**
 * Create a new PanelGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new PanelGUIAdaptor
 * @type PanelGUIAdaptor
 */
PanelGUIAdaptor.create = function(element)
{
	Logging.logMessage("PanelGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);

	var a = new PanelGUIAdaptor();
	a._initPanelGUIAdaptor(element);
	return a;
}

PanelGUIAdaptor.prototype._initPanelGUIAdaptor = function(element)
{
	// Store the original CSS class
	this.m_cssClass = element.className;
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, element);
}

PanelGUIAdaptor.prototype._dispose = function()
{
	this.m_element = null;
}

PanelGUIAdaptor.prototype.renderState = function()
{
	// Start with the original CSS class that the panel was created with
	var className = this.m_cssClass;
	
	// If the panel is disabled or inactive then render it as disabled.
	if((this.supportsProtocol("EnablementProtocol") && !this.getEnabled())
	    || (this.supportsProtocol("ActiveProtocol") && !this.isActive()))
	{
		className += (" " + PanelGUIAdaptor.DISABLED_CSS_CLASS_NAME);
	}
	
	// The elements class name so that it is rendered correctly
	this.m_element.className = className;
}
