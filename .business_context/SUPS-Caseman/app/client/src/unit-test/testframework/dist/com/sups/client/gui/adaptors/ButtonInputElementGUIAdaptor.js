//==================================================================
//
// ButtonInputElementGUIAdaptor.js
//
// Class for adapting a text style input element for use in the
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
function ButtonInputElementGUIAdaptor()
{
}


/**
 * ButtonInputElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
ButtonInputElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

GUIAdaptor._setUpProtocols('ButtonInputElementGUIAdaptor'); 
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'BusinessLifeCycleProtocol');     // Supports business life cycle for actionBinding
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('ButtonInputElementGUIAdaptor', 'LabelProtocol');            // Supports Labelling

ButtonInputElementGUIAdaptor.prototype.constructor = ButtonInputElementGUIAdaptor;

ButtonInputElementGUIAdaptor.m_logger = new Category( "ButtonInputElementGUIAdaptor" );

ButtonInputElementGUIAdaptor.BUTTON_NOT_SUBMISSIBLE_CSS_CLASS = "notSubmissible";


ButtonInputElementGUIAdaptor.EVENT_ACTION = BusinessLifeCycleEvents.EVENT_ACTION;


/**
 * The click event handler key
 *
 * @type EventHandlerKey
 * @private
 */
ButtonInputElementGUIAdaptor.prototype.m_clickEventHandler = null;

/**
 * Variable stores number of action bindings associated
 * with button. If a button has no action bindings it
 * must be being used with an event binding. In this
 * case the life cycle should control the active state of
 * the button.
 *
*/
ButtonInputElementGUIAdaptor.prototype.m_noOfActionBindings = 0;

/**
 * Flag used to indicate whether, or not, the button should be
 * made inactive when a click event is processed.
 *
*/
ButtonInputElementGUIAdaptor.prototype.m_inactiveWhilstHandlingEvent = null;

/**
 * Flag used to indicate whether, or not, the button is currently
 * deactivated whilst running its action binding(s).
 *
*/
ButtonInputElementGUIAdaptor.prototype.m_deactivatedWhilstHandlingEvent = false;

/**
 * Create a new ButtonInputElementGUIAdaptor
 *
 * @param e the text input element to manage
 * @return the new ButtonInputElementGUIAdaptor
 * @type ButtonInputElementGUIAdaptor
 */
ButtonInputElementGUIAdaptor.create = function(e)
{
	var a = new ButtonInputElementGUIAdaptor();
	a.m_element = e;
	
	// Keep the original css classname set in the html
	a.m_viewClass = e.className;
	
	return a;
}


ButtonInputElementGUIAdaptor.prototype._dispose = function()
{
    if(null != this.m_clickEventHandler)
    {
	    // Remove the click event handler
	    SUPSEvent.removeEventHandlerKey(this.m_clickEventHandler);
	    this.m_clickEventHandler = null;
	}
	
	this.actionBinding = null;
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
ButtonInputElementGUIAdaptor.prototype._configure = function(cs)
{
	var actionBusinessLifeCycle = new ButtonActionBusinessLifeCycle();
	actionBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(actionBusinessLifeCycle);

	// Additional event bindings for button
	var actionEventBinding = null;

	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		// Count number of action bindings associated
		// with button
		if(null != c.actionBinding)
		{
		    this.m_noOfActionBindings++;
		} 
		
		// Get the event configuration objects for RAISE
		if(c.additionalBindings && null == actionEventBinding)
		{
			actionBusinessLifeCycle.configure(c.additionalBindings);

			actionEventBinding = actionBusinessLifeCycle.getEventBinding();			
		}
		
		// Check for flag indicating active state when handling event
		if(null != c.inactiveWhilstHandlingEvent && null == this.m_inactiveWhilstHandlingEvent)
		{
		    this.m_inactiveWhilstHandlingEvent = c.inactiveWhilstHandlingEvent;
		}
	}
	
	if(this.m_noOfActionBindings > 0)
	{
	    // As the button has associated event bindings add "onclick" handler
	    var thisObj = this;
	    this.m_clickEventHandler = SUPSEvent.addEventHandler( this.m_element,
	                                                          "click",
	                                                          function(evt){ return thisObj._handleClick(); } );
	}
	
	// Define flag indicating active state when handling event
	if(this.m_inactiveWhilstHandlingEvent != false)
	{
	    this.m_inactiveWhilstHandlingEvent = true;
	}

	// Start addtional event bindings
	if(null != actionEventBinding) actionEventBinding.start();
}


/**
 * Handle a click event on the button.
 *
 * Dispatches an event to cause the button's own actionBinding to be invoked.
 * Queuing the event in this way rather than invoking the actionBinding
 * immediately allows other components to update the DataModel before
 * the button action is invoked.
 *
 * @private
 */
ButtonInputElementGUIAdaptor.prototype._handleClick = function()
{                                                
	Services.dispatchEvent(this.getId(), ButtonInputElementGUIAdaptor.EVENT_ACTION, null);
}


/**
 * Invoke the button's action bindings
 *
 * The buttons actionBinding's are usually invoked by dispatching an
 * "action" event to the button via the Services.dispatchEvent interface.
 *
 * @private
 */
ButtonInputElementGUIAdaptor.prototype._invokeActionBindings = function()
{
	if (this.getEnabled()) 
	{
		// Get configurations
		var cs = this.getConfigs();
		
		// On click invoke all the actionBindings
		for(var i = 0, l = cs.length - 1; i < l; i++)
		{
			if(null != cs[i].actionBinding)
			{
				cs[i].actionBinding.call(this);
			}
		}
	}
}


/**
 * Render the button appropriately to reflect it's current state
 *
 */
ButtonInputElementGUIAdaptor.prototype.renderState = function()
{
	if((this.supportsProtocol("EnablementProtocol") && !this.m_enabled)
	    || (this.supportsProtocol("ActiveProtocol") && !this.isActive()))
	{
	  this.m_element.disabled = true;
	}
	else
	{
	  this.m_element.disabled = false;
	}

	//this.m_viewClass

	var css = this.m_viewClass
	if(!this.getAggregateState().isSubmissible())
	{
		css = css + " " + ButtonInputElementGUIAdaptor.BUTTON_NOT_SUBMISSIBLE_CSS_CLASS;
	}
	this.m_element.className = css;
	
	/*
	 * Fix for release 2 - stops buttons included on form but with no config
	 * having their labels blown away. Does mean that dynamically you can set 
	 * button to have an empty label but not a null label (which would be rendered
	 * badly in IE in any case
	 */
	if(null != this.m_label)
	{
		this.m_element.value = this.m_label;
	}
	this.m_labelChanged = false;
}

/**
 * Method sets button to active state providing adaptor is not in
 * list of adaptors deactivated owing to the raising of a popup.
 *
*/
ButtonInputElementGUIAdaptor.prototype.reactivate = function()
{
    var reactivate = true;
    
    // Before reactivating adaptor check that adaptor has not been
    // deactivated owing to raising of popup also. If deactivated by popup
    // do not reactivate.
    var deactivatedButtonAdaptors = AbstractPopupGUIAdaptor.m_buttonsDeactivatedWhilstHandlingEventOnRaise;
    
    if(null != deactivatedButtonAdaptors)
    {
        var deactivatedAdaptor = null;
        
        for(var i = 0, l = deactivatedButtonAdaptors.length; i < l; i++)
        {
            deactivatedAdaptor = deactivatedButtonAdaptors[i];
            
            if(this.getId() == deactivatedAdaptor.getId())
            {
                reactivate = false;
                break;
            }
        }
        
    }
    
    if(reactivate)
    {
        this.setActive(true);       
        this.renderState();
    }
    
    if(this.m_inactiveWhilstHandlingEvent)
    {
        // Reset flag indicating that button action bindings are executing
        this.m_deactivatedWhilstHandlingEvent = false;
    }
}

/**
 * Method returns a boolean value indicating whether, or not, button is
 * currently deactivated owing to its action bindings being executed.
 *
 * @returns Boolean value set to "true" if action bindings executing, otherwise "false"
 *
*/
ButtonInputElementGUIAdaptor.prototype.isDeactivatedWhilstHandlingEvent = function()
{
    return this.m_deactivatedWhilstHandlingEvent;
}

/**
 * Method sets value of boolean flag recording whether, or not, button is
 * currently deactivated owing to its action binding being executed.
 *
 * @param deactivated Boolean variable defining new value of flag
 *
*/
ButtonInputElementGUIAdaptor.prototype.setDeactivatedWhilstHandlingEvent = function( deactivated )
{
    this.m_deactivatedWhilstHandlingEvent = deactivated;
}


/**
 * BusinessLifeCycle to activate a buttons action
 */
function ButtonActionBusinessLifeCycle() {}

// ButtonActionBusinessLifeCycle is a sub class of BusinessLifeCycle
ButtonActionBusinessLifeCycle.prototype = new BusinessLifeCycle();
ButtonActionBusinessLifeCycle.prototype.constructor = ButtonActionBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
ButtonActionBusinessLifeCycle.prototype.getName = function()
{
	return BusinessLifeCycleEvents.EVENT_ACTION;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the button's actionBinding function to be invoked
 *
 * @param e the BusinessLifeCycleEvent
 */
ButtonActionBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	var buttonId = e.getComponentId();
	
	var button = FormController.getInstance().getAdaptorById(buttonId);
	
	if(null != button)
	{
	    if(button.m_noOfActionBindings > 0 && 
	       button.m_inactiveWhilstHandlingEvent && 
	       button.isActive())
	    {
	        button.setActive(false);
	        button.renderState();
	        button.setDeactivatedWhilstHandlingEvent(true);
	    }
	    
	    try
	    {
		    button._invokeActionBindings();
		}
		catch(ex)
		{
		    if(button.m_noOfActionBindings > 0 && 
		       button.m_inactiveWhilstHandlingEvent)
		    {
		        button.reactivate();
		    }
		    
		    throw ex;
		}
		
		if(button.m_noOfActionBindings > 0 &&
		   button.m_inactiveWhilstHandlingEvent)
		{
		    button.reactivate();
		}
		
	}
}


