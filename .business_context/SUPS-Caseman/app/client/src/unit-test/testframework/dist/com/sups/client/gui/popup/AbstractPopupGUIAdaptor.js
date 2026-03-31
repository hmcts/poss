//==================================================================
//
// AbstractPopupGUIAdaptor.js
//
// Base class for implementing modal popups
//
//==================================================================


/**
 * Base class for implementing modal popups
 *
 * @constructor
 * @private
 */
function AbstractPopupGUIAdaptor(){};


AbstractPopupGUIAdaptor.m_logger = new Category("AbstractPopupGUIAdaptor");


/**
 * Array containing set of deactivated (disabled due to modal dialog
 * being raised) adaptors on the form
 *
 * @private
 * @type Array[GUIAdaptor]
 */
AbstractPopupGUIAdaptor.m_deactivatedAdaptors = null;

/**
 * Array containing set of buttons deactivated owing to their action
 * bindings executing when the popup is raised
 *
 * @private
 * @type Array[GUIAdaptor]
*/
AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise = null;

AbstractPopupGUIAdaptor.m_popups = new Array();


/**
 * PopupLayer for rendering the popup correctly
 *
 * @private
 * @type PopupLayer
 */
AbstractPopupGUIAdaptor.prototype.m_popupLayer = null


/**
 * Function which is invoked when the popup is lowered
 *
 * @type Function
 * @configuration
 */
AbstractPopupGUIAdaptor.prototype.onPopupClose = null;


/**
 * AbstractPopupGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
AbstractPopupGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Add the required protocols to the AbstractPopupGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('AbstractPopupGUIAdaptor'); 
GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor', 'InitialiseProtocol');				// Supports custom initialisation
GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor', 'ComponentVisibilityProtocol');		// Supports visibility - can be hidden and shown
GUIAdaptor._addProtocol('AbstractPopupGUIAdaptor', 'BusinessLifeCycleProtocol');		// Supports business life cycle events - raise and lower

AbstractPopupGUIAdaptor.prototype.constructor = AbstractPopupGUIAdaptor;


/**
 * The adaptor which had the focus immediately before the popup 
 * was raised. The default implementation of nextFocusedAdaptorId
 * uses this to restore the focus to adpator which had the focus
 * before the popup was raised.
 *
 * @private
 * @type GUIAdaptor
 */
AbstractPopupGUIAdaptor.prototype.m_parentFocussedAdaptor = null;


/**
 * Initialise the adaptor
 *
 * @param e the main element which represent the adaptor in the view
 */
AbstractPopupGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	// Create a PopupLayer around the main popup element to allow correct
	// rendering of the popup.
	this.m_popupLayer = PopupLayer.create(e);
}


/**
 * Clean up when the adaptor is destroyed
 */
AbstractPopupGUIAdaptor.prototype._dispose = function()
{
	this.m_raise = null;
	this.m_lower = null;

	this.m_popupLayer._dispose();
    this.m_popupLayer = null;
}


AbstractPopupGUIAdaptor.prototype._configure = function(cs)
{
	var raiseBusinessLifeCycle = new PopupRaiseBusinessLifeCycle();
	raiseBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(raiseBusinessLifeCycle);

	var lowerBusinessLifeCycle = new PopupLowerBusinessLifeCycle();
	lowerBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(lowerBusinessLifeCycle);

	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		// Get the event configuration objects for RAISE
		if(c.raise && this.m_raise == null)
		{
			raiseBusinessLifeCycle.configure(c.raise);

			this.m_raise = raiseBusinessLifeCycle.getEventBinding();			
		}
		
		// Get the event configuration objects for LOWER
		if(c.lower && this.m_lower == null)
		{
			lowerBusinessLifeCycle.configure(c.lower);

			this.m_lower = lowerBusinessLifeCycle.getEventBinding();			
		}
		
		// Get the method call before raising the popup		
		if(c.prePopupPrepare != null)
		{
			this.m_prePopupPrepare = c.prePopupPrepare; 	
		}
		
		
		// Override functions as required.
	    if(null != c.nextFocusedAdaptorId) 
	    {
	      this.nextFocusedAdaptorId = c.nextFocusedAdaptorId;
	    }
	}

	var raiseEventBinding = raiseBusinessLifeCycle.getEventBinding();
	var lowerEventBinding = lowerBusinessLifeCycle.getEventBinding();
	if(null != raiseEventBinding) raiseEventBinding.start();
	if(null != lowerEventBinding) lowerEventBinding.start();
}

/**
 * Method is used to show and hide popup.
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
AbstractPopupGUIAdaptor.prototype.show = function(showMe, currentFocussedAdaptorId)
{
	if(showMe)
	{
		if(AbstractPopupGUIAdaptor._isPopupRaised(this.getId()))
		{
			// Can only raise a popup if it is not already raise. Just log a 
			// warning if the popup isn't visible but received a raise event
			if(AbstractPopupGUIAdaptor.m_logger.isWarn()) AbstractPopupGUIAdaptor.m_logger.warn("Attempt to raise popup " + this.getId() + " which is already raised");
		}
		else
		{
			this._show(true, currentFocussedAdaptorId);

			// Make whole application go modal.
			Services.getAppController().modalState(true);
		}
	}
	else
	{
		var popupRaised = false;
		for(var i = 0, l = AbstractPopupGUIAdaptor.m_popups.length; i < l; i++)
		{
			if(AbstractPopupGUIAdaptor.m_popups[i] == this)
			{
				popupRaised = true;
				break;
			}
		}
		
		if(popupRaised)
		{
			this._show(false);
			
			if(0 == AbstractPopupGUIAdaptor.m_popups.length)
			{
				// re-enable rest of application when no modal popups are raised
				Services.getAppController().modalState(false);
			}
			
			var cs = this.getConfigs();
			
			for(var i = 0; i < cs.length; i++)
			{
				if(null != cs[i].onPopupClose)
				{
					cs[i].onPopupClose.call(this);
				}
			}
		}
		else
		{
			// Can only lower the popup if it is raise. Just log a 
			// warning if the popup isn't visible but received a lower event
			if(AbstractPopupGUIAdaptor.m_logger.isWarn()) AbstractPopupGUIAdaptor.m_logger.warn("Attempt to lower popup " + this.getId() + " which is not raised");
		}
	}
}

AbstractPopupGUIAdaptor.prototype._showPopupLayer = function(showMe)
{
	if(showMe == true)
	{
		this.m_popupLayer.show();
	}
	else
	{
		this.m_popupLayer.hide();
	}
}

/**
 * Private method used to display or hide popup.
 *
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
AbstractPopupGUIAdaptor.prototype._show = function(showMe, currentFocussedAdaptorId)
{
	if(showMe)
	{
		// Keep the currently focussed adaptor when showing the popup
		if(null != currentFocussedAdaptorId)
		{
		    this.m_parentFocussedAdaptor = Services.getAdaptorById( currentFocussedAdaptorId );
		}
		else
		{
		    this.m_parentFocussedAdaptor = FormController.getInstance().getTabbingManager().m_currentFocussedAdaptor;
		}
		
		// Call prepare method if it exists
		if (this.m_prePopupPrepare != null 
		    && typeof this.m_prePopupPrepare == "function")
		{
			this.m_prePopupPrepare();
		}
		
		// Determine what adaptors should be enabled and disabled due to modal popup being raised.
		if(AbstractPopupGUIAdaptor.m_popups.length > 0)
		{
			// Re-activate all previously de-activated adaptors
			this._reactivateParent()
		}
		// Determine the new set of de-activated adaptors
		this._deactivateParent();

		// Check to see if this popup is in fullscreen mode.
		var cssClass = this.m_element.className;
		if (cssClass.lastIndexOf("popup_fullscreen") > 0)
		{
			var docEl = this.m_element.ownerDocument.documentElement;
		
			var screenHeight = window.innerHeight != null
							 ? window.innerHeight			// W3C
							 : docEl.clientHeight;			// IE
				
			var screenWidth = window.innerWidth != null
							? window.innerWidth				// W3C
							: docEl.clientWidth;			// IE
				
			this.m_element.style.height = screenHeight + "px";
			this.m_element.style.width = screenWidth + "px";
			
			// Override any positioning
			this.m_element.style.top = "0px";
			this.m_element.style.left = "0px";
		}
		
		// Show the popup
		this._showPopupLayer(true);
		
		AbstractPopupGUIAdaptor.m_popups.push(this);
	}
	else
	{
		// Hide the popup
		this._showPopupLayer(false);
		
		// Re-activate all previously disabled adaptors
		this._reactivateParent();

		// Remove this popup from the popup stack.
		var newPopupArray = [];
		var oldPopupArray = AbstractPopupGUIAdaptor.m_popups;
		for(var i = 0, l = oldPopupArray.length; i < l; i++)
		{
			var popup = oldPopupArray[i];
			if(popup != this)
			{
				newPopupArray.push(popup);
			}
		}
		AbstractPopupGUIAdaptor.m_popups = newPopupArray;

		// If there are still popups raised, determine which adaptors should be de-activated			
		if(AbstractPopupGUIAdaptor.m_popups.length > 0)
		{
			// Determine the new set of de-activated adaptors 
			var newTopLevelPopup = AbstractPopupGUIAdaptor.m_popups[AbstractPopupGUIAdaptor.m_popups.length - 1];
			newTopLevelPopup._deactivateParent();
		}
	
		// Set the Focus to the correct element after container open.
		var nextFocusAdaptorID = this.invokeNextFocusedAdaptorId();
		
		// If focus not set programmatically, then attempt to restore focus
		// to component that had focus before the popup was raised.
		if (null == nextFocusAdaptorID && this.m_parentFocussedAdaptor != null)
		{
			nextFocusAdaptorID = this.m_parentFocussedAdaptor.getId();
		}
		
		// If we have an adaptor to focus on then set the focus to
		// that adaptor, otherwise focus on the first available field.
		Services.setFocus(nextFocusAdaptorID);
	}
}


/**
 * Check to see if a given popup is raised or not
 *
 * @param id the id of the popup to check for
 * @return true if the popup is raise or false otherwise
 * @type boolean
 * @protected
 */
AbstractPopupGUIAdaptor._isPopupRaised = function(id)
{
	var raisedPopups = AbstractPopupGUIAdaptor.m_popups;
	
	for(var i = 0, l = raisedPopups.length; i < l ; i++)
	{
		if(raisedPopups[i].getId() == id)
		{
			return true;
		}
	}
	
	return false;
}


AbstractPopupGUIAdaptor.prototype._deactivateParent = function()
{
	var fc = FormController.getInstance();
	var adaptors = fc.m_adaptors;
	
	AbstractPopupGUIAdaptor.m_deactivatedAdaptors = new Array();
	AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise = new Array();
	
	var inActiveElements = AbstractPopupGUIAdaptor.m_deactivatedAdaptors;
	var deactivatedButtons = AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;
	
 	for(var i = 0, l = adaptors.length; i < l; i++)
 	{
  		var a = adaptors[i];
  		
  		// If adaptor is a child of this popup or doesn't support activation then ignore it
  		if(this._isAdaptorChildOfPopup(a) || !a.supportsProtocol("ActiveProtocol"))
  		{
  			continue;
  		}
  		
		// If adaptor is active or is a button GUI adaptor which is configured to be inactive when
		// handling event then deactivate it
		if(a.isActive())
		{
			a.setActive(false);
			
			// Calling render state here is ugly - really the FormController should
			// determine when to call renderState, however in practice this shouldn't
			// have any negative side effects in practice.
			a.renderState();
			
			inActiveElements.push(a);
     	}
     	else
     	{
     	    if( a instanceof ButtonInputElementGUIAdaptor && a.isDeactivatedWhilstHandlingEvent())
     	    {
     	        // Defect 1141. Store buttons currently deactivated.
     	        deactivatedButtons.push(a);
     	    }
     	}
  	}
}


/**
 * Method which determines whether the supplied adaptor is a child of
 * this popup
 *
 * @param adaptor the adaptor to check to see if it is a child of the
 *    popup
 */
AbstractPopupGUIAdaptor.prototype._isAdaptorChildOfPopup = null;


AbstractPopupGUIAdaptor.prototype._reactivateParent = function()
{
    var a, i, l;
    
    // First reactivate adaptors
	var inActiveElements = AbstractPopupGUIAdaptor.m_deactivatedAdaptors;
	
	for(i = 0, l = inActiveElements.length; i < l; i++ )
	{
		a = inActiveElements[i];
		a.setActive(true);
		a.renderState();
	}
	
	// Reset array length to empty array
	AbstractPopupGUIAdaptor.m_deactivatedAdaptors = null;
	
	// Second reactivate deactivated buttons if appropriate
	var deactivatedButtons = AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;
	
	for(i = 0, l = deactivatedButtons.length; i < l; i++)
	{
	    a = deactivatedButtons[i];
	    
	    if(!(a.isDeactivatedWhilstHandlingEvent()))
	    {
	        a.setActive(true);
	        a.renderState();
	    }
	}
	
	// Reset array
	AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise = null;
}


/**
 * An override of the function defined in the GUIAdaptor class
 * The Popup parent container is defined by the parent of the 
 * visual element used to raise this popup
 */
AbstractPopupGUIAdaptor.prototype.getParentContainer = function()
{
	if(null == this.m_raise)
	{
		// Raise lifecycle not configured for this popup, so can't determine parent
		// Return default parent
		return GUIAdaptor.prototype.getParentContainer.call(this);
	}
	else
	{
		var raisingAdaptors = this.m_raise.getSources();
		
		/* D750 - Popup subform raised by two adaptors
		if(raisingAdaptors.length != 1)
		{
			throw new ConfigurationException("Multiple raising adaptors not supported for first invalid field");
		}
		*/

		// TODO: Should container or element that raised popup and sits in container be shown?
		return raisingAdaptors[0].getParentContainer();
	}
}


/**
 * Get a list of adaptors that can cause the popup to be shown
 *
 * @return an array of adaptors that act as event sources for
 *   the popups "raise" BusinessLifeCycle Event. null if no
 *   adaptors are configured to raise the popup
 * @type Array[GUIAdaptor]
 */
AbstractPopupGUIAdaptor.prototype.getSources = function()
{
	var raisingAdaptors = null;
	if(null != this.m_raise)
	{
		raisingAdaptors = this.m_raise.getSources();
	}
	return raisingAdaptors;
}


/**
 *  Wrapper to invoke nextFocusedAdaptorId function.
 */
AbstractPopupGUIAdaptor.prototype.invokeNextFocusedAdaptorId = function()
{
  return (this.nextFocusedAdaptorId !=null) ?  this.nextFocusedAdaptorId.call(this) : null;
}


/**
 * By default popups refocus the adaptor on the parent form that
 * had focus before the popup was raised.
 *
 * @configuration
 */
AbstractPopupGUIAdaptor.prototype.nextFocusedAdaptorId = function()
{
	var a = this.m_parentFocussedAdaptor;
	return (null != a ? a.getId() : null);
}
