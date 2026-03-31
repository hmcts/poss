function fwDataService()
{
}

/**
 * Logging category for fwDataService
 *
 * @private
 */
fwDataService.m_logger = new Category("fwDataService");


/**
 * Data Service Configuration object
 *
 * @type Object
 * @protected
 */
fwDataService.prototype.m_config = null;


/**
 * Fuction that handles the result of call to load()
 *
 * @type Function
 * @private
 */
fwDataService.prototype.m_resultHandler = null;


/**
 * Reference to DOM created during load().<b> 
 *
 * @type DOM
 * @private
 */
fwDataService.prototype.m_dom = null;


/**
 * Load the data
 *
 * @protected
 */
fwDataService.prototype.load = function()
{
	fc_assertAlways("fwDataService.load() base class method must be overridden");
}


/**
 * Handles an apparently successful XML Document creation
 * by checking the result DOM for parseErrors. If no
 * parseErrors exist, then the dom is passed to handleValidDom
 * as a successful Document creation, otherwise a suitable
 * fwDataServiceException is created and is passed to 
 * handleException as a Document creation exception
 *
 * @param dom the apparently successfully loaded DOM
 * @protected
 */
fwDataService.prototype._handleResultDOM = function(dom)
{
	var error = dom.parseError;
	
	if(error.errorCode != 0)
	{
		// Invoke handleException with a suitable exception
		this.handleException(
			new fwDataServiceException(
				"Loaded Document contained parsing error." +
				"\nReason for failure: " + error.reason
			)
		);
	}
	else
	{
		// Invoke handleValidDom without exception - onSuccess should be invoked.
		this.handleValidDom(dom);
	}
}

/*
 * Handle a successfully parsed dom
 */
fwDataService.prototype.handleValidDom = function(dom)
{
	try
	{
		if(null != dom)
		{
			if(null != this.m_resultHandler.onSuccess)
			{
                // Process the document - may have an exception thrown from the serverside,
                // in which case a handler should be invoked
                // If either the dom is ok or a handler is successfully found and processed then the
                // processing is considered to be successful.
                // If unsuccessful onError should be invoked.
                this._processSuccessfulDOMCreation(dom);
			}
			else
			{
				// No onSuccess handler defined - throw exception which is caught
				// in the outer catch block
				throw new ConfigurationException("No onSuccess method defined on handler.");
			}
		}
		else
		{
			this.handleException(new fwDataServiceException("Empty DOM returned from server."));
		}
	}
	catch(exception) 
	{
        this.handleException(exception)
	}
}



/*
 * Find the most specific exception handler available and invoke it. Note that,
 * some data services like the reference data and model initialisation services
 * require some additional work to be done, deregistering the
 * services from the FormController services running list, before the
 * exception can be handled.
 *
 */
fwDataService.prototype.handleException = function(ex)
{
    try
    {
        // First apply any specified pre-exception handling processing
        var handler = this.m_resultHandler;
        this._executeExceptionHandlingPreprocessing(handler);
        
        // Handle exception
		var exceptionHandled = false;
    	if(ex instanceof fwException)
    	{
		    var exceptionArray = ex.exceptionHierarchy;
	        
			for(var i = exceptionArray.length - 1; i > -1; i--)
			{
		        if (handler["on" + exceptionArray[i]] != null)
		        {
		            // Invoke the appropriate handler and
		            // create the parent exception containing the message.
		            handler["on" + exceptionArray[i]](ex, this.m_serviceMethodName);
		            exceptionHandled = true;
	                break;
		        }
		    }
		}
		else
		{
			// This is not an fwException, so wrap it up in one and pass it
			// to onError
			ex = new fwException("Runtime exception throw", ex);
		}
	    
	    if (!exceptionHandled)
	    {
            this.invokeOnError(ex);
		}
	}
	catch(exception)
	{
        var newException = new fwException("Exception thrown handling result of document creation - " 
                                           + fwException.getErrorMessage(exception), ex);
        FormController.handleFatalException(newException); 
	}
}


/*
 * Invoke the onError method in the result handler.
 *
 * throws fwException
 */                
fwDataService.prototype.invokeOnError = function(ex, name)
{
	if(null != this.m_resultHandler.onError)
	{
		this.m_resultHandler.onError(ex, this.m_serviceMethodName);
	}
	else
	{
        this.m_resultHandler.defaultErrorHandler(ex, this.m_serviceMethodName);
	}
}


/*
 * Handle a successful dom creation (may be overriden by sublclasses 
 * (for example a successful dom creation may still not be a successful call)
 */                
fwDataService.prototype._processSuccessfulDOMCreation = function(dom)
{
    // Success loading the data - invoke the onSuccess method
	this.m_resultHandler.onSuccess(dom, this.m_serviceMethodName);
}

/*
 * Factory method to create the appropriate DataService subclass
 *
 * @param config.serviceName - this and the following 4 options are mutually 
                               exclusive and determing the type of DataService
                               to be created.
 * @param config.fileName;
 * @param config.srcXPath;
 * @param config.computed;
 * @param config.xml;
 *
 * @param resultHandler - handler containing methods onSuccess, onError and onXXXX(?)
 * @param async - boolean flag that indicates whether or not data service is asyncronous
 *
 */
fwDataService.create = function(config, resultHandler, async)
{
	if(null == config)
	{
		throw new ConfigurationException("No configuration provided");
	}

	// Check that only a single method of retrieving the data has been specified
	if (!(fwDataService.isDataServiceConfigured(config)))
	{
		throw new ConfigurationException("Form fwDataService configuration must specify one and only of serviceName, fileName, srcXPath, xml or computed properties");
	}
	
	// Create the appropriate type of fwDataService
	var dS = null;
	if(config.serviceName != null)
	{
		dS = new fwServiceCallDataService();
	}
	else if(config.fileName != null)
	{
		dS = new fwFileDataService();
	}
	else if(config.computed != null)
	{
		dS = new fwComputedDataService();
	}
	else if(config.srcXPath != null)
	{
		dS = new fwSrcXPathDataService();
	}
	else if(config.xml != null)
	{
		dS = new fwXMLStringDataService();
	}
	
	dS._initialise(config, async, resultHandler);
	
	return dS;
}


fwDataService.isDataServiceConfigured = function(config)
{
	// Determine what sort of fwDataService has been configured.
	var serviceName = config.serviceName;
	var fileName = config.fileName;
	var srcXPath = config.srcXPath;
	var computed = config.computed;
	var xml = config.xml;
	
	// Check that only a single method of retrieving the data has been specified
	return (
		(null != serviceName && null == fileName && null == srcXPath && null == computed && null == xml) ||
		(null == serviceName && null != fileName && null == srcXPath && null == computed && null == xml) ||
		(null == serviceName && null == fileName && null != srcXPath && null == computed && null == xml) ||
		(null == serviceName && null == fileName && null == srcXPath && null != computed && null == xml) ||
		(null == serviceName && null == fileName && null == srcXPath && null == computed && null != xml)
	);
}


fwDataService.prototype._setResultDOM = function(dom)
{
	this.m_dom = dom;
}


fwDataService.prototype._initialise = function(config, async, resultHandler)
{
	this.m_config = config;
	this.m_resultHandler = resultHandler;
	this.m_async = async;
    this.m_serviceMethodName = config.method; // Unfortunate backwards compatibility requirement.
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwDataService.prototype.getDefaultName = function()
{
	// Derived fwDataServices should replace this with a more meaningful identification string
	return "Unknown";
}

/**
 * Method runs any pre-exception handling processing specified in the service call
 * result handler object. At present, such functions will only be present for form
 * reference and model initialisation data services.
 *
*/
fwDataService.prototype._executeExceptionHandlingPreprocessing = function(resultHandler)
{
    var preProcessingFunc = resultHandler[ fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING ];
    
    if(null != preProcessingFunc)
    {
        preProcessingFunc.call(this);
    }
}

/**
 * Method checks whether service handler contains a handler for Http
 * connection exceptions.
 *
 * @return Returns "true" if result handler has the property onHttpConnectionException
 *         defined, otherwise returns "false".
 *
*/
fwDataService.prototype.httpConnectionExceptionHandlerExists = function()
{
    return null != this.m_resultHandler.onHttpConnectionException;
}

/**
 * Method invokes Http connection exception handler on result handler passing
 * exception in as an argument.
 *
*/
fwDataService.prototype.invokeOnHttpConnectionExceptionHandler = function(ex)
{
    this.m_resultHandler.onHttpConnectionException(ex, this.m_serviceMethodName);
}

