//==================================================================
//
// CreateFormBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides form create event processing. This includes both
 * the configuration to handle form create events and the subsequent
 * data processing tasks associated with setting a form to the create
 * state.
 *
 * @constructor
 */
function CreateFormBusinessLifeCycle()
{
}


/**
 * CreateFormBusinessLifeCycle is a sub class of EditFormBusinessLifeCycle
 */
CreateFormBusinessLifeCycle.prototype = new EditFormBusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 */
CreateFormBusinessLifeCycle.prototype.constructor = CreateFormBusinessLifeCycle;


/**
 * Create a new instance of the CreateFormBusinessLifeCycle class
 *
 * @return a new instance of the class CreateFormBusinessLifeCycle
 *
*/
CreateFormBusinessLifeCycle.create = function()
{
	return new CreateFormBusinessLifeCycle();
}


/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
 */
CreateFormBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_CREATE;
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
CreateFormBusinessLifeCycle.prototype._getTargetState = function()
{
	// On successfully processing a CREATE event, the form should enter
	// the CREATE state.
	return FormLifeCycleStates.FORM_CREATE;
}
