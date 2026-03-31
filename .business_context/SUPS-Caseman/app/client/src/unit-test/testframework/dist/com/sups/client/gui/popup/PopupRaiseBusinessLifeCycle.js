//==================================================================
//
// PopupRaiseBusinessLifeCycle.js
//
// Business Life Cycle class for raising popups. This is along with
// PopupLowerBusinessLifeCycle are essentially BusinessLifeCycle
// adaptors for the ComponentVisibilityProtocol, and therefore can
// generally be re-used for all components supporting the
// ComponentVisibilityProtocol.
//
//==================================================================


/**
 * BusinessLifeCycle to raise a popup
 */
function PopupRaiseBusinessLifeCycle() {}

// PopupRaiseBusinessLifeCycle is a sub class of BusinessLifeCycle
PopupRaiseBusinessLifeCycle.prototype = new BusinessLifeCycle();
PopupRaiseBusinessLifeCycle.prototype.constructor = PopupRaiseBusinessLifeCycle;


/**
 * Get the name of the BusinessLifeCycle.
 *
 * @return the name of the BusinessLifeCycle
 * @type String
 */
PopupRaiseBusinessLifeCycle.prototype.getName = function()
{
	return BusinessLifeCycleEvents.EVENT_RAISE;
}


/**
 * Invoke the business logic associated with this BusinessLifeCycle.
 * In this case this cause the requested popup to be shown
 *
 * @param e the BusinessLifeCycleEvent
 */
PopupRaiseBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
    // Defect 1164. This life cycle action has become more complex owing
    // to problems with IE selects. If a popup is raised using a hot key
    // combination and the currently focussed adaptor on the background
    // form is an IE select the tabbing manager may not be able to focus
    // on the popup correctly. The problem is probably caused by the IE
    // select being disabled whilst it has focus.
    //
    // To prevent these problems the IE select must be unfocussed before
    // the popup is raised. In this case the identifier of the select
    // must be passed to the popup adaptor such that focus can be
    // returned to the select when the popup is closed.
    
    // Determine currently focussed adaptor
    var tm = FormController.getInstance().getTabbingManager();
    
    if(null != tm)
    {
        var currentFocussedAdaptor = tm.m_currentFocussedAdaptor;
        
        if(null != currentFocussedAdaptor &&
           (currentFocussedAdaptor instanceof SelectElementGUIAdaptor))
        {
            // Queue tabbing event corresponding to click on form background.
            // This will cause the select to lose focus.
            tm.queueTabbingEvent( new TabbingEvent( TabbingEvent.EVENTS.CLICK_FOCUS,
                                                    null ) );
                                                    
            // Tabbing events are processed after time out. Therefore, we must
            // delay invocation of popup show method.
            var adaptorId = this.m_adaptor.getId();
            var currentFocussedAdaptorId = currentFocussedAdaptor.getId();
            
            setTimeout( function(){ Services.getAdaptorById(adaptorId).show( true, currentFocussedAdaptorId ); }, 0 );
        }
        else
        {
            // Raise popup
            this.m_adaptor.show(true);
        }
    }
    else
    {
        // Raise popup
        this.m_adaptor.show(true);
    }
}


/**
 * Derived BusinessLifeCycle specific configuration.
 * For backwards compatability with existing code, the PopupRaiseBusinessLifeCycles
 * allows eventBindings to specified directly as the .raise configuration object,
 * rather than .raise.eventBindings. 
 *
 * @param config the BusinessLifeCycle configuration
 */ 
PopupRaiseBusinessLifeCycle.prototype._configure = function(config)
{
	// If eventBindings not configured already by base class, try to configure
	// then directly using the supplied config object here - for backwards 
	// compatability.
	if(null == this.m_eventBinding)
	{
	    var id = this.m_adaptor.getId() + 
	             "_" +
	             this.getName() +
	             "_eventBinding";
	             
		this.m_eventBinding = new EventBinding(id);
		
		this.m_eventBinding.configure(config);
		
		if(this.m_eventBinding.hasConfiguredProperty( "isEnabled" ) )
		{
		    FormController.getInstance().addEnablementEventBinding(this.m_eventBinding);
		}
		
		var thisObj = this;
		this.m_eventBinding.bind( function() { thisObj.dispatchEvent(); } );
	}
}
