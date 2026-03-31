//==================================================================
//
// InputElementGUIAdaptor.js
//
// Base class for adapting input elements for use in the framework
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 */
function InputElementGUIAdaptor()
{
	GUIAdaptor._setUpProtocols("HTMLElementGUIAdaptor");
}


/**
 * InputElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
InputElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("InputElementGUIAdaptor");


/**
 * Add the required protocols to the InputElementGUIAdaptor
 */
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'MandatoryProtocol');             // Supports mandatory protocol
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('InputElementGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol		

InputElementGUIAdaptor.prototype.constructor = InputElementGUIAdaptor;


/**
 * Initialise the InputElementGUIAdaptor
 *
 * @param e the input element to manage
 */
InputElementGUIAdaptor.prototype._initInputElementGUIAdaptor = function(e)
{
	this.m_element = e;
}
