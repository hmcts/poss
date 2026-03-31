//==================================================================
//
// CancelSubformBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides form cancel event processing. This includes both
 * the configuration to handle form cancel events and the subsequent
 * data processing tasks associated with cancelling a form.
 *
 * @constructor
 *
*/
function CancelSubformBusinessLifeCycle()
{
}

/**
 * CancelSubformBusinessLifeCycle is a sub class of BusinessLifeCycle
 *
*/
CancelSubformBusinessLifeCycle.prototype = new BusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
*/
CancelSubformBusinessLifeCycle.prototype.constructor = CancelSubformBusinessLifeCycle;

/**
 * Instance variable stores flag indicating whether or not
 * the unsaved dialog box should be displayed when the subform
 * is dirty on cancel.
 *
 * Note that the default action is to display the unsaved dialog box.
 *
*/
CancelSubformBusinessLifeCycle.prototype.m_raiseWarningIfDOMDirty = true;


/**
 * Create a new instance of the CancelSubformBusinessLifeCycle class
 *
 * @return Returns a new instance of the class CancelSubformBusinessLifeCycle
*/
CancelSubformBusinessLifeCycle.create = function()
{
    var CancelSubformBusinessLifeCycle = new CancelSubformBusinessLifeCycle();
    return CancelSubformBusinessLifeCycle;
}


/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
*/
CancelSubformBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_CANCEL;
}


/**
 *  Configuration
*/
CancelSubformBusinessLifeCycle.prototype._configure = function(cancelConfig)
{
    if(null != cancelConfig)
    {
        if(cancelConfig.raiseWarningIfDOMDirty == false)
        {
            this.m_raiseWarningIfDOMDirty = false;
        }
    }
}


/**
 * Invoke the business logic associated with the cancel form business
 * life cycle
 *
 * @param e The business life cycle event
 *
*/
CancelSubformBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{   
    var raiseWarning = null;
    
    // First check detail on life cycle event. If "raiseWarningIfDOMDirty"
    // property set to either "true"use this instead of configured value.
    var details = e.getDetail();
    
    if(null != details && null != details.raiseWarningIfDOMDirty)
    {
        if(details.raiseWarningIfDOMDirty == true)
        {
            raiseWarning = true;
        }
        else if(details.raiseWarningIfDOMDirty == false)
        {
            raiseWarning = false;
        }
    }
    
    if(null == raiseWarning)
    {
        // Use value from life cycle configuration
        raiseWarning = this.m_raiseWarningIfDOMDirty;
    }
    
    if(raiseWarning)
    {   
	    var thisObj = this;

		// D814 - We don't want to perform the cancel lifecycle again after submitting data because
		// any changes made to the nodes in the returnDOMToParent method by the submit subform
		// lifecycle would be overwritten when the cancel lifecycle itself calls returnDOMToParent
		e = null;

	    FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(thisObj,
	                                                               BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,
	                                                               null,
	                                                               e,
	                                                               //thisObj._cancelSubform);
	                                                               // RWW Temporary hack see method description
	                                                               thisObj._cancelSubformTimeout);
	}
	else
	{
	    // Simply cancel subform on time out
	    this._cancelSubformTimeout();
	}
	
}

/**
 * This method is a temporary solution to the interference
 * between life cycle and tabbing events. The method delays
 * the dispatch of the life cycle event which closes the subform
 * to give the standard dialog time to focus on an element on
 * the subform before it is closed.
 *
 * RWW 01/08/05
 *
*/
CancelSubformBusinessLifeCycle.prototype._cancelSubformTimeout = function()
{
    setTimeout( "CancelSubformBusinessLifeCycle._cancelSubform()", 100 );
}

/**
 * Method performs actions required to close down a sub form.
 *
 * Temporarily make this method static for delayed timeout
 *
*/
CancelSubformBusinessLifeCycle._cancelSubform = function()
{
    // Return DOM to calling form.
    FormBusinessLifeCycleDelegate.returnDOMToParent();
    
	// Get invoking adaptor 
	var invokingAdaptor = FormController.getInstance().getInvokingAdaptor();
	
	// Lower sub form
	window.parent.Services.dispatchEvent( invokingAdaptor.getId(), PopupGUIAdaptor.EVENT_LOWER );
}




