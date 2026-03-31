//==================================================================
//
// ModifyFormBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides form modification event processing. This includes both
 * the configuration to handle form modification events and the subsequent
 * data processing tasks associated with setting a form to the modify
 * state.
 *
 * @constructor
 */
function ModifyFormBusinessLifeCycle()
{
}


/**
 * ModifyFormBusinessLifeCycle is a sub class of EditFormBusinessLifeCycle
 */
ModifyFormBusinessLifeCycle.prototype = new EditFormBusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 */
ModifyFormBusinessLifeCycle.prototype.constructor = ModifyFormBusinessLifeCycle;


/**
 * Create a new instance of the ModifyFormBusinessLifeCycle class
 *
 * @return a new instance of the class ModifyFormBusinessLifeCycle
 *
 */
ModifyFormBusinessLifeCycle.create = function()
{
    return new ModifyFormBusinessLifeCycle();
}


/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
 */
ModifyFormBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_MODIFY;
}


/**
 * Get the state that the EditFormBusinessLifeCycle should move the
 * form to when a Document containing the model data is successfully
 * loaded.
 *
 * @return the state that the form should move into
 * @type String
 * @protected
 */
ModifyFormBusinessLifeCycle.prototype._getTargetState = function()
{
	// On successfully processing a MODIFY event, the form should enter
	// the MODIFY state.
	return FormLifeCycleStates.FORM_MODIFY;
}
