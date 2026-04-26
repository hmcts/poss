/**
 * Superclass providing common functions for service
 * classes which contact the application server
 *
*/

// Define global variable used to store queue of
// service call requests
var xmlHttpServiceRequestQueue = new Array();

function fwServerCallDataService()
{
}

fwServerCallDataService.prototype = new fwDataService();
fwServerCallDataService.prototype.constructor = fwServerCallDataService;

fwServerCallDataService.m_logger = new Category("fwServerCallDataService");

/**
 * The default maximum number of times to retry server call
 */
fwServerCallDataService.MAX_RETRIES = 3;

/**
 * Server call HTTP error constants
 *
*/
fwServerCallDataService.HTTP_Error_Constants = { 400   : "Erroneous request made to the server.",
                                                 401   : "Not authorized to access this resource.",
                                                 403   : "Forbidden to access this resource.",
                                                 404   : "Service not found on server.",
                                                 500   : "An internal error has occurred at the server.",
                                                 501   : "Service not implemented.",
                                                 502   : "Service call timed out.",
                                                 12002 : "The request has timed out.",
                                                 12029 : "The attempt to connect to the server failed.",
                                                 12030 : "The connection with the server has been terminated.",
                                                 12031 : "The connection with the server has been reset.",
                                                 12152 : "The server response could not be parsed.",
                                                 13030 : "Request/response status not available."
};

/**
 * Define default Http connection error retry responses.
 *
 * Defect 1046. These default values enable the default retry actions of
 * framework release 9.0.29 to be identical to those of previous releases
 * of the framework.
 *
*/
fwServerCallDataService.DEFAULT_HTTP_CONNECTION_ERROR_RETRY_RESPONSES = { "12030": true,
                                                                          "12152": true };

/**
 * Constant denoting XMLHttpRequest request status unavailable.
 *
*/
fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE = 13030;
                                         

fwServerCallDataService.prototype._initialise = function( config, async, resultHandler )
{
    // Initialise retry count
    this.m_retryCount = 0;
    
    // Invoke _initialise on super class
    fwDataService.prototype._initialise.call( this, config, async, resultHandler );
}

/**
 * Core method for listening to the request and calling onSuccess or
 * onError/onXXX as required.
 *
 * @param request - the request object form the server.
 * @param handler - the handler on which to call onSucess etc.
 */
fwServerCallDataService.prototype.handleReadyStateChange = function(index)
{
    var requestInfo = xmlHttpServiceRequestQueue[index];
    
    if(null != requestInfo)
    {
        var request = requestInfo.server.getRequest();
        
        if(request.readyState == 4)
        {
            if (this.m_config.showProgress)
            {
                // Defect 1059. Define reference to FormController
                // and pass to method hideProgress to allow
                // method to reassert focus.
                var fc = FormController.getInstance();
                
	            this.m_appC.m_serviceRequestCount--;
	            this.m_appC._hideProgress(fc);
            }
            
            // Determine status of request
            var requestStatus = this._getRequestStatus(request);

            // Defect 1060. Successful service returns will be marked with
            // status 200. However, returns following system and business
            // exceptions will be marked with a new user specified code
            // of 999.
            //
            // In practice, both request types are handled in the same way. The
            // new error code simply prevents the results of service calls
            // which raise exceptions from being cached.
            if(requestStatus == 200 || requestStatus == 999)
            {
	            this.resetRetryCount();
                if(fwServerCallDataService.m_logger.isDebug()) fwServerCallDataService.m_logger.debug("Response text: " + request.responseText);
                if(fwServerCallDataService.m_logger.isDebug()) fwServerCallDataService.m_logger.debug("Status text: " + request.statusText);
            
                var dom = XML.createDOM(null, null, null);
		        dom.loadXML(request.responseText);
           	    this._handleResultDOM(dom);
           	    
           	    // Clean up references to objects used to call service
           	    requestInfo.server.dispose();
           	    requestInfo.server = null;
           	    
           	    delete xmlHttpServiceRequestQueue[index];
           	    requestInfo = null;
            }
            else
            {
                // Handle error status code.
                
                // First retrieve information required to handle error correctly.
                var errorRetryResponses = this._getHttpConnectionErrorRetryResponses();
                
                var retryStatus = this._isRetryStatus(requestStatus, errorRetryResponses);
                
                var httpConnectionExceptionHandlerExists = this.httpConnectionExceptionHandlerExists();
                
                // Handle special cases first.
                if(retryStatus && httpConnectionExceptionHandlerExists)
                {
                    // Pass HttpConnectionException to handler on service handler.
                    // Effectively let application determine whether or not to retry.
                    
                    // Reset count as application may respond to retry codes in
                    // different ways for different services.
                    this.resetRetryCount();
                    
                    var errorMessage = fwServerCallDataService.HTTP_Error_Constants[ requestStatus ];
                    
                    var exception;
                    
                    if(null != errorMessage)
                    {
                        exception = new HttpConnectionException( "Http connection error - " + errorMessage );
                    }
                    else
                    {
                        exception = new HttpConnectionException( "Request/response status defined in configured Http connection error retry responses detected. Request status : " +
                                                                 requestStatus );
                    }
                    
                    // Set status on exception
                    exception.setResponseStatus(requestStatus);
                    
                    // Clean up references to objects used to call service
           	        requestInfo.server.dispose();
           	        requestInfo.server = null;
           	    
           	        delete xmlHttpServiceRequestQueue[index];
           	        requestInfo = null;
           	        
           	        // Pass control to exception handler
           	        this.invokeOnHttpConnectionExceptionHandler(exception);
           	        
           	    }
                else if (retryStatus &&
                         (!httpConnectionExceptionHandlerExists) && 
                         this.getRetryCount() < this._getHttpConnectionErrorRetryLimit())
                {
                    // In this case default to framework retry mechanism.
        	        this.incrementRetryCount();
        	    
        	        // Clean up references to objects used to call service
           	        requestInfo.server.dispose();
           	        requestInfo.server = null;
           	    
           	        delete xmlHttpServiceRequestQueue[index];
           	        requestInfo = null;
           	    
           	        // Re-submit service call
                    this.load();
                }
                else // A HTTP level error 
                {
	                this.resetRetryCount();
                    if(fwServerCallDataService.m_logger.isDebug()) fwServerCallDataService.m_logger.debug("requestStatus: " + requestStatus);

                    var errorMessage = fwServerCallDataService.HTTP_Error_Constants[requestStatus];
                    var exception;
                    if (errorMessage != null)
                    {
                        exception = new SystemException("Network or System error - " + requestStatus + " : " + errorMessage);
                    }
                    else
                    {
                        exception = new SystemException("Erroneous or unexpected server response code: " + requestStatus);
                    }
                
                    // Clean up references to objects used to call service
           	        requestInfo.server.dispose();
           	        requestInfo.server = null;
           	    
           	        delete xmlHttpServiceRequestQueue[index];
           	        requestInfo = null;
           	    
           	        // Display error message
                    this.invokeOnError(exception);
                }
                
                // Reset local variables
                errorRetryResponses = null;
                retryStatus = null;
                httpConnectionExceptionHandlerExists = null;
                
            } // End of if(requestStatus == 200 || requestStatus == 999) logic
            
        } // End of if(request.readyState == 4)

    } // End of if(null != requestInfo)
    
}

/*
 * Increments the internal retry counter.
 */
fwServerCallDataService.prototype.incrementRetryCount = function() {
	this.m_retryCount++;
}

/*
 * Gets the internal retry counter.
 */
fwServerCallDataService.prototype.getRetryCount = function() {
	return this.m_retryCount;
}

/*
 * Sets the retry count back to 0.
 */
fwServerCallDataService.prototype.resetRetryCount = function() {
	this.m_retryCount = 0;
}

/**
 * Method returns request status of Http request.
 *
 * @param request An instance of the appropriate XMLHttpRequest object.
 *
 * @return Returns status of request following return from server. If no
 *         value available returns Mozilla default of 13030.
 *
*/
fwServerCallDataService.prototype._getRequestStatus = function( request )
{
    var requestStatus;
    
    try
    {
        if(request.status !== undefined && request.status != 0)
        {
            requestStatus = request.status;
        }
        else
        {
            requestStatus = fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE;
        }
        
    } 
    catch(ex)
    {
        requestStatus = fwServerCallDataService.HTTP_REQUEST_STATUS_UNAVAILABLE;
    }
    
    return requestStatus;
}

/**
 * Method determines maximum number of retries to be attempted if Http
 * connection occurs and retries are allowed.
 *
 * @return Returns maximum allowed number of retries.
 *
*/
fwServerCallDataService.prototype._getHttpConnectionErrorRetryLimit = function()
{
    var retryLimit = null;
    
    if(null != this.m_appC)
    {
        // For calls when the application loads the AppController may not exist.
        // In this case use default value defined for this class, otherwise
        // attempt to retrieve value from application configuration file.
        retryLimit = this.m_appC.getHttpConnectionErrorRetryLimit();
    }
    
    if(null == retryLimit)
    {
        // AppController does not exist or retry limit
        // not defined in configuration.
        retryLimit = fwServerCallDataService.MAX_RETRIES;
    }
    
    return retryLimit;
}

/**
 * Method returns details of error retry response for various request
 * status codes.
 *
 * @return Object with set of properties corresponding to request codes.
 *         The value of each property will be either "true" or "false".
 *
*/
fwServerCallDataService.prototype._getHttpConnectionErrorRetryResponses = function()
{
    var errorRetryResponses = null;
    
    if(null != this.m_appC)
    {
        // Retrieve responses defined in configuration file
        errorRetryResponses = this.m_appC.getHttpConnectionErrorRetryResponses();
    }
    
    if(null == errorRetryResponses)
    {
        // Application controller does not exist or error retry responses
        // not defined in configuration file.
        errorRetryResponses = fwServerCallDataService.DEFAULT_HTTP_CONNECTION_ERROR_RETRY_RESPONSES;
    }
    
    return errorRetryResponses;
}

/**
 * Method determines whether, or not, the framework should attempt a retry
 * following a Http connection error. The method looks up the requested retry
 * response for the request status in the error retry response details provided.
 *
 * @param requestStatus       The status code for the Http request/response
 * @param errorRetryResponses Object detailing retry response for various
 *                            status codes.
 *
 * @return Returns "true" or "false" depending on configuation. The default is "false".
 *
*/
fwServerCallDataService.prototype._isRetryStatus = function( requestStatus, errorRetryResponses )
{
    var isRetryStatus = errorRetryResponses[ requestStatus.toString() ];
    
    if(null == isRetryStatus)
    {
        isRetryStatus = false;
    }
    
    return isRetryStatus;
}