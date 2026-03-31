//==================================================================
//
// NavigateFormBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides form navigate event processing. This includes both
 * the configuration to handle form navigate events and the subsequent
 * data processing tasks associated with navigating away from a form.
 *
 * @constructor
 *
*/
function NavigateFormBusinessLifeCycle()
{
}

/**
 * NavigateFormBusinessLifeCycle is a sub class of BusinessLifeCycle
 *
*/
NavigateFormBusinessLifeCycle.prototype = new BusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
*/
NavigateFormBusinessLifeCycle.prototype.constructor = NavigateFormBusinessLifeCycle;

/**
 * Define static class constants
 *
 * Used to indicate nature of navigate operation
 *
*/
NavigateFormBusinessLifeCycle.FORM = "form";
NavigateFormBusinessLifeCycle.LOGOUT = "logout";
NavigateFormBusinessLifeCycle.EXIT = "exit";


/**
 * Create a new instance of the NavigateFormBusinessLifeCycle class
 *
 * @return Returns a new instance of the class NavigateFormBusinessLifeCycle
 *
*/
NavigateFormBusinessLifeCycle.create = function()
{
    var navigateFormBusinessLifeCycle = new NavigateFormBusinessLifeCycle();
    
    return navigateFormBusinessLifeCycle;
}

/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
 *
*/
NavigateFormBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_NAVIGATE;
}

/**
 * Invoke the business logic associated with the navigate form business
 * life cycle
 *
 * @param e The business life cycle event
 *
*/
NavigateFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	// Retrieve current state of form
	var state = this.m_adaptor._getState();
	var navigate = false;
	
	// Retrieve event details
	var details = e.getDetail();

	switch (state) {
		case FormElementGUIAdaptor.FORM_BLANK:
		    Services.getAppController().navigate(details[ "formName" ], details[ "mode" ]);
			break;
		case FormElementGUIAdaptor.FORM_CREATE:
		case FormElementGUIAdaptor.FORM_MODIFY:
		default:
		    if(details[ "raiseWarningIfDOMDirty" ])
		    {
		        var thisObj = this;
	            
	            FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty( thisObj,
	                                                                        BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,
	                                                                        null,
	                                                                        e,
	                                                                        function(){Services.getAppController().navigate(details[ "formName" ], details[ "mode" ]);} );
	                                                                        
	        }
	        else
	        {
	            Services.getAppController().navigate(details[ "formName" ], details[ "mode" ]);
	        }
			break;
	}
}


