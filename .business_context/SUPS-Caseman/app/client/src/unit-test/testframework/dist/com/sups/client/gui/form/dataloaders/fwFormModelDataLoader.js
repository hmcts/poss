//==================================================================
//
// fwFormModelDataLoader.js
//
// Class which handles loading of model data for Create and Modify
// LifeCycles
//
//==================================================================


/**
 * Class which handles loading of model data for Create and Modify
 * LifeCycles
 */
function fwFormModelDataLoader()
{
}


// Derived off fwDataLoader
fwFormModelDataLoader.prototype = new fwDataLoader();
fwFormModelDataLoader.prototype.constructor = fwFormModelDataLoader;

/**
 * Logging category for fwFormModelDataLoader
 *
 * @type Category
 * @private
 */
fwFormModelDataLoader.m_logger = new Category("fwFormModelDataLoader");


/**
 * The form that this dataloader is loading data for
 *
 * @type EditFormBusinessLifeCycle
 * @private
 */
fwFormModelDataLoader.prototype.m_formLifeCycle;


/**
 * Method invoked when Document is loaded successfully
 *
 * @param dom the DOM containing the succesfully loaded document
 * @param name the name of the service
 */
fwFormModelDataLoader.prototype._successHandler = function(dom, name)
{
	this.m_formLifeCycle._handleDocumentLoadSuccess(dom, null, null);
}


/**
 * Abort the load operation
 *
 * Overrides default _abort() behaviour which shutsdown the application. If
 * loading fails in this case, the form simply stays in the same state with
 * no changes at all.
 */
fwFormModelDataLoader.prototype._abort = function()
{
	// Don't do anything if the user aborts a retry attempt - data is simply not loaded
}



/**
 * Create an instance of fwFormModelDataLoader based on the forms configuration
 *
 * @param config the configuration for the fwFormModelDataLoader
 * @param formLifeCycle the formlifecycle which is responsible for this DataLoader
 */
fwFormModelDataLoader.create = function(config, formLifeCycle)
{
	var dl = new fwFormModelDataLoader();
	
	// Hang onto the form lifecyle that created this DataLoader and the target state as we need them during in _successHandler
	dl.m_formLifeCycle = formLifeCycle;
	
	// Default dataBinding to form's modelXPath configuration if dataBinding not explicitly declared
	if(null == config.dataBinding)
	{
		config.dataBinding = formLifeCycle.getAdaptor().getModelParentXPath();
		if(fwFormModelDataLoader.m_logger.isInfo()) fwFormModelDataLoader.m_logger.info("Defaulting form " + formLifeCycle.getAdaptor().getId() + " life cycle " + formLifeCycle.getName() + " dataBinding to " + config.dataBinding + " - the parent of the form's modelXPath configuration");
	}
	
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
fwFormModelDataLoader.prototype._getServiceTypeName = function()
{
	return "Form data loading service";
}


/**
 * Get the message that should be displayed when the Cancel button is presed
 * on the Retry/Cancel dialog
 *
 * @return the message detailing the action that will be taken if the cancel
 *   button is pressed.
 * @type String
 */
fwFormModelDataLoader.prototype._getAbortMessage = function()
{
	return "abort the loading of form data (Existing data will remain)";
}
