//==================================================================
//
// PopupGUIAdaptor.js
//
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
function PopupGUIAdaptor(){};

PopupGUIAdaptor.m_logger = new Category("PopupGUIAdaptor");


/**
 * PopupGUIAdaptor is a sub class of AbstractPopupGUIAdaptor
 */
PopupGUIAdaptor.prototype = new AbstractPopupGUIAdaptor();

/**
 * Add the required protocols to the PopupGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('PopupGUIAdaptor'); 
GUIAdaptor._addProtocol('PopupGUIAdaptor', 'ComponentContainerProtocol');				 
GUIAdaptor._addProtocol('PopupGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('PopupGUIAdaptor', 'ReadOnlyProtocol');				 // Supports enablement/disablement
GUIAdaptor._addProtocol('PopupGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding

PopupGUIAdaptor.prototype.constructor = PopupGUIAdaptor;



/**
 * Business Life Cycle Event to raise a popup
 *
 * @type String
 */
PopupGUIAdaptor.EVENT_RAISE = BusinessLifeCycleEvents.EVENT_RAISE;


/**
 * Business Life Cycle Event to lower a popup
 *
 * @type String
 */
PopupGUIAdaptor.EVENT_LOWER = BusinessLifeCycleEvents.EVENT_LOWER;


/**
 * Create a new PopupGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new PopupGUIAdaptor
 * @type PopupGUIAdaptor
 */
PopupGUIAdaptor.create = function(e)
{
	if (PopupGUIAdaptor.m_logger.isTrace()) PopupGUIAdaptor.m_logger.trace("PopupGUIAdaptor.create");

	var a = new PopupGUIAdaptor();
	a._initialiseAdaptor(e);
	return a;
}


PopupGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call parent class initialisation
	AbstractPopupGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
}


/**
 * Method controls the display and hiding of the popup.
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
PopupGUIAdaptor.prototype._show = function(showMe, currentFocussedAdaptorId)
{
	if(showMe)
	{
		// Invoke parent show()
		AbstractPopupGUIAdaptor.prototype._show.call(this, showMe, currentFocussedAdaptorId);

		// Set the Focus to the correct element after container open.
		// If firstFocusAdaptorID is specified on the ContainerProtocol,
		// focus on the specified adaptor, otherwise simply focus on the
		// first available field
		var firstFocusAdaptorID = this.invokeFirstFocusedAdaptorId();
		Services.setFocus(firstFocusAdaptorID);
	}
	else
	{
		// Invoke parent show()
		AbstractPopupGUIAdaptor.prototype._show.call(this, showMe);
	}
}


PopupGUIAdaptor.prototype._isAdaptorChildOfPopup = function(adaptor)
{
	// For inline popups
	// @todo: Use GUIAdaptor parent and container protcol's list of children
	// will probably achieve the same result more quickly as this, which looks
	// at the HTML to determine parentage.
	return (adaptor.m_element==this.m_element) || isParentOf(adaptor.m_element, this.m_element);
}


