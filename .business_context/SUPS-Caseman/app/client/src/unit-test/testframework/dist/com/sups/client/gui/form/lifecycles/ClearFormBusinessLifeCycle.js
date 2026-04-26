//==================================================================
//
// ClearFormBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides form clear event processing. This includes both
 * the configuration to handle form clear events and the subsequent
 * data processing tasks associated with clearing a form.
 *
 * @constructor
 *
*/
function ClearFormBusinessLifeCycle()
{
}

/**
 * ClearFormBusinessLifeCycle is a sub class of BusinessLifeCycle
 *
*/
ClearFormBusinessLifeCycle.prototype = new BusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
*/
ClearFormBusinessLifeCycle.prototype.constructor = ClearFormBusinessLifeCycle;


/**
 * Define class instance members
 *
 * Variable to store details for form clear
*/
ClearFormBusinessLifeCycle.prototype.m_clearConfig = null;


/**
 * Create a new instance of the ClearFormBusinessLifeCycle class
 *
 * @return Returns a new instance of the class ClearFormBusinessLifeCycle
*/
ClearFormBusinessLifeCycle.create = function()
{
    var clearFormBusinessLifeCycle = new ClearFormBusinessLifeCycle();
    return clearFormBusinessLifeCycle;
}


/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
*/
ClearFormBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_CLEAR;
}


/**
 * Locate and store reference to clear configuration object defined for form
 *
 * @param clearConfig Clear form life cycle configuration object from
 *                    form adaptor configuration
*/
ClearFormBusinessLifeCycle.prototype._configure = function(clearConfig)
{
    // Store clear form life cycle configuration object
    this.m_clearConfig = clearConfig; 
}


/**
 * Invoke the business logic associated with the clear form business
 * life cycle
 *
 * @param e The business life cycle event
 *
*/
ClearFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
    var details = e.getDetail();
    
    if(null == details || details.raiseWarningIfDOMDirty !== false)
    {
        var thisObj = this;

	    FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty( thisObj,
	                                                                BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,
	                                                                null,
	                                                                e,
	                                                                function()
	                                                                {
	                                                                    thisObj.clearForm();
	                                                                }
	                                                               );
	}
	else
	{
	    this.clearForm();
	}
}


/*
 * Clears the data model and sets the state to blank.
 */
ClearFormBusinessLifeCycle.prototype.clearForm = function()
{
    // Clear Data Model
    var adaptor = this.getAdaptor();
    
    var dm = FormController.getInstance().getDataModel();
    
    // Execute custom clear preprocessing function, if defined
    this.invokeClearBusinessLifeCyclePreprocessing();
    
    // Execute main form clean action
    adaptor.clearFormDataModel();
    
    // Reset form state to blank and make it clean
    adaptor._setState(FormElementGUIAdaptor.FORM_BLANK);
    adaptor._setDirty(false);
    adaptor.update();

    // D822 - If firstFocusAdaptorId is specified for this form then focus on
    // the specified adaptor. Otherwise focus on the first adaptor capable of
    // receiving the focus
    var focusAdaptorID = adaptor.invokeFirstFocusedAdaptorId();

	// When any Save Changes dialog is closed the AbstractPopupGUIAdaptor sets focus
	// on an adaptor. Sometimes the Tabbing Manager has not processed this event when
	// we attempt to set focus here. In which case this set focus event is lost. Set
	// focus on a timeout so that the Tabbing Manager processes both events.
	var thisObj = this;
	setTimeout(function() { thisObj._setFocus(focusAdaptorID); }, 0);
}


/**
 * Set focus on an adaptor. Called from timeout to allow Tabbing Manager to
 * process other queued programmatic event first
*/
ClearFormBusinessLifeCycle.prototype._setFocus = function(adaptorId)
{
	Services.setFocus(adaptorId);
}

/**
 * Method controls invocation of custom clear preprocessing function
 * when present.
 *
*/
ClearFormBusinessLifeCycle.prototype.invokeClearBusinessLifeCyclePreprocessing = function()
{
	var config = this.m_clearConfig;
	
	// If the lifecycle hasn't been configured for the form and the clear event
	// is dispatched to the form then this will be null
    if(null != config)
    {
    	if(null != config.preprocess)
    	{
        	FormBusinessLifeCycleDelegate.invokeMethod(this.m_clearConfig.preprocess);
        }
    }
}


