//==================================================================
//
// fwDataLoader.js
//
// Class which handles loading of Data by the framework given a
// DataService configuration.
//
//==================================================================


/**
 * Class which handles loading of Data by the framework
 */
function fwDataLoader()
{
}
/**
 * Define constant used to reference error handling preprocessing function
 * in data loader result handler.
 *
*/
fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING = "exceptionHandlerPreprocessing";

/**
 * Reference to configuration for this fwDataLoader
 *
 * @type Object
 * @private
 */
fwDataLoader.prototype.m_config = null;


/**
 * Reference to fwDataService which will actually perform the reference data loading
 *
 * @type fwDataService
 * @private
 */
fwDataLoader.prototype.m_dataService = null;


/**
 * Initialise basic FormDataLoader
 *
 * @param config the configuration for the FormDataLoader
 * @param form the FormElementGUIAdaptor for which this FormDataLoader was created
 * @protected
 */
fwDataLoader.prototype._initialise = function(config)
{
    this.m_config = config;

	// Determine the result handler.
	var resultHandler = this._getResultHandler();

	// Create the data service required to load the data. The fwDataService.create()
	// method inspects the configuration and creates an instance of the appropriate
	// fwDataService class which will actually do the loading of the data.
	this.m_dataService = this._createDataService(resultHandler);
}


/**
 * Attempts to load the XML Document. If successful the _successHandler is invoked,
 * if an error occured then an suitable exception handler is invoked if available
 * or, if no appropriate exception handler is registered for the exception, the
 * _defaultErrorHandler is invoked.
 */
fwDataLoader.prototype.load = function()
{
	// Start loading the data - may be asynchronous or synchronous. onSuccess method or appropriate
	// error handling method defined in this.m_resultHandler will be invoked to indicate that loading
	// is complete.
    try
    {
	   this.m_dataService.load();
    }
    catch(ex)
    {
         FormController.handleFatalException(new fwException("Exception thrown while loading data service",ex)); 
    }
}


/**
 * Get the resultHandler object for this fwDataLoder. Default implementation looks
 * up the property "errorHandler" on the config object passed to _initialise and
 * adds "onSuccess" and "onError" handlers that result in the fwDataLoader methods
 * _handleSuccess or _defaultErrorHandler being invoked respectivly.
 */
fwDataLoader.prototype._getResultHandler = function()
{
	// Inspect the configuration and create a suitable errorHandler object
	var thisObj = this;
	var resultHandler = new Object();
	var config = this.m_config;
	if(config.errorHandler)
	{
		for(var i in config.errorHandler)
		{
			if(i == "onSuccess")
			{
				// Framework defines onSuccess handler for all data loading, so configuration
				// should never specify an onSuccess method.
				throw new ConfigurationException("Cannot specify onSuccess handler for framework service call configurations");
			}
			else
			{
				// Copy the configuration to our result handler object
				resultHandler[i] = config.errorHandler[i];
			}
		}
	}

	// Create the onSuccess handler - calls object's _successHandler() method.
	resultHandler.onSuccess = function(dom, name) { thisObj._successHandler(dom, name); };

    // Add in the defaultErrorHandler handler
	resultHandler.defaultErrorHandler = function(ex, name) { thisObj._defaultErrorHandler(ex, name); };
	
	return resultHandler;
}


/**
 * Create the DataService which is used to create the XML Document being loaded.
 * Default implementation creates the DataService based on the configuration
 * passed to the fwDataLoader in _initialise.
 *
 * @param resultHandler the result handler object required by the DataService
 * @protected
 */ 
fwDataLoader.prototype._createDataService = function(resultHandler)
{
	return fwDataService.create(this.m_config, resultHandler, this.m_config.async);
}


/**
 * Retry the load operation
 *
 * Default retry behaviour is to call the fwDataService.load() method
 * again. The method may be overridden if this is not appropriate, or
 * additional steps need to be performed as part of the retry operation.
 *
 * @protected
 */
fwDataLoader.prototype._retry = function()
{
	// Call the DataService load method again.
	this.m_dataService.load();
}


/**
 * Abort the load operation
 *
 * Default behaviour is to shutdown the application. This may not
 * be appropriate for many situations and so this behaviour may
 * be overridden
 */
fwDataLoader.prototype._abort = function()
{
	try
	{
		// If Application Controller is not initialised then fc_assert
		// throws an exception with a message
		var ac = Services.getAppController();
		ac.shutdown();
	}
	catch(msg)
	{
		// Nothing else we can do but show message and abort
		alert(msg);
		window.close();
	}
}


/**
 * Method invoked when Document is loaded successfully
 *
 * @param dom the DOM containing the succesfully loaded document
 * @param name the name of the service
 */
fwDataLoader.prototype._successHandler = function(dom, name)
{
	fwAssertAlways("fwDataLoader::successHandler() must be overridden");
}


/**
 * Default error handler. This provides standard retry/cancel functionality
 * which invoke the DataLoader's _retry() and _abort() methods.
 *
 * @params e the exception that cause the error
 * @params name the name of the service.
 * @protected
 */
fwDataLoader.prototype._defaultErrorHandler = function(e, name)
{
	if(window.confirm(this._getAbortRetryMessage(e)))
	{
		// Retry the loading of reference data.
		this._retry();
	}
	else
	{
		// Abort
		this._abort();
	}
}


/**
 * Get a name associated with this type of service
 *
 * @return a string containing the name of this type of service
 * @type String
 * @protected
 */
fwDataLoader.prototype._getServiceTypeName = function()
{
	return "Data loading service";
}


fwDataLoader.prototype._getAbortRetryMessage = function(e)
{
	var serviceTypeName = this._getServiceTypeName();

	// Use the name configuration item by default
	var name = this.m_config.name;
	
	// If no name configuration is provided, then ask the dataService to generate
	// a default name based on its configuration
	if(null == name || "" == name)
	{
		name = this.m_dataService.getDefaultName();
	}
	
	// If there is still no name then provide a default string
	if(null == name || "" == name)
	{
		name = "Unknown"
	}
	
	// Trim excessively long names so dialog does not end up too large
	if(name.length > 200)
	{
		name = name.substring(0, 199);
	}
	
	// Create the error message
	var msg = serviceTypeName + " '" + name +
		"' reported the following error\n\n" + ((null == e) ? "No error message provided." : fwException.getErrorMessage(e)) +
		"\n\nPress OK to " + this._getRetryMessage() + " or Cancel to " + this._getAbortMessage();
	
	return msg;
}


fwDataLoader.prototype._getRetryMessage = function()
{
	return "retry";
}


/**
 * Get the message that should be displayed when the Cancel button is presed
 * on the Retry/Cancel dialog
 *
 * @return the message detailing the action that will be taken if the cancel
 *   button is pressed.
 * @type String
 */
fwDataLoader.prototype._getAbortMessage = function()
{
	return "abort the application";
}
