//==================================================================
//
// fwFormSubmitDataLoader.js
//
// Class which handles submission of form model data
//
//==================================================================


/**
 * Class which handles submission of form model data
 */
function fwFormSubmitDataLoader()
{
}


// Derived off fwDataLoader
fwFormSubmitDataLoader.prototype = new fwDataLoader();
fwFormSubmitDataLoader.prototype.constructor = fwFormSubmitDataLoader;

/**
 * Logging category for fwFormSubmitDataLoader
 *
 * @type Category
 * @private
 */
fwFormSubmitDataLoader.m_logger = new Category("fwFormSubmitDataLoader");


/**
 * The form that this dataloader is loading data for
 *
 * @type SubmitFormBusinessLifeCycle
 * @private
 */
fwFormSubmitDataLoader.prototype.m_formLifeCycle;


/**
 * Method invoked when Document is loaded successfully
 *
 * @param dom the DOM containing the succesfully loaded document
 * @param name the name of the service
 */
fwFormSubmitDataLoader.prototype._successHandler = function(dom, name)
{
	this.m_formLifeCycle.onSuccess(dom);
}


/**
 * Abort the load operation
 *
 * Overrides default _abort() behaviour which shutsdown the application. If
 * submit fails in this case, the form simply stays in the same state with
 * no changes at all.
 */
fwFormSubmitDataLoader.prototype._abort = function()
{
	// Don't do anything if the user aborts a retry attempt - data is simply not loaded
}



/**
 * Create an instance of fwFormSubmitDataLoader based on the form's submit configuration
 *
 * @param config the configuration for the fwFormSubmitDataLoader
 * @param formLifeCycle the formlifecycle which is responsible for this DataLoader
 */
fwFormSubmitDataLoader.create = function(config, formLifeCycle)
{
	var dl = new fwFormSubmitDataLoader();
	
	// Hang onto the form lifecyle that created this DataLoader as we need it during _successHandler
	dl.m_formLifeCycle = formLifeCycle;

    // Convert serviceParams array of name value pairs into a ServiceParams object
    // and setup clean record stripping
    config.callServiceParams = fwServiceCallDataService._createParameters(config.serviceParams, true);
    
	dl._initialise(config);
	
	return dl;
}


/**
 * Get a name associated with this type of service
 *
 * @return a string containing the name of this type of service
 * @type String
 * @protected
 */
fwFormSubmitDataLoader.prototype._getServiceTypeName = function()
{
	return "Form data submission service";
}


/**
 * Get the message that should be displayed when the Cancel button is presed
 * on the Retry/Cancel dialog
 *
 * @return the message detailing the action that will be taken if the cancel
 *   button is pressed.
 * @type String
 */
fwFormSubmitDataLoader.prototype._getAbortMessage = function()
{
	return "abort the submission of form data";
}
