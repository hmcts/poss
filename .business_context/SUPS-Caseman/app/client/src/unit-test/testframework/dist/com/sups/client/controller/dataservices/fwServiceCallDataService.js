//==================================================================
//
// fwServiceCallDataService.js
//
// DataService that loads data by calling a remote web service
//
//==================================================================


function fwServiceCallDataService()
{
}


fwServiceCallDataService.prototype = new fwServerCallDataService();
fwServiceCallDataService.prototype.constructor = fwServiceCallDataService;

fwServiceCallDataService.m_logger = new Category("fwServiceCallDataLoader");

/**
 * Name of the servlet used to receive the HTTP requests.
 *
 * @type String
 * @private
 */
fwServiceCallDataService.servletName = "InvokerServlet";

/**
 * The maximum lenght a "PUT" url request string can be
 *
 */
fwServiceCallDataService.MAX_PUT_URL_LENGTH = 2028;

/*
 * Name of the tag used to return exception strings in the dom
 */
fwServiceCallDataService.SUPS_ExceptionTag = "SupsServiceException";

/*
 * Setup the object
 *
 * @param config.secure - boolean which determines whether the service should use https 
 * @param config.serviceName - corresponds to the name attribue of the mapping tag. 
 * @param config.username - optional parameter which will be used if passed in (for login, for example) 
 * @param config.password - will be sent if provided - currently only used by login. 
 * @param config.callServiceParams - an optional ServiceParams object  - will be used in preference
 *                                   to serviceParams (below) if it exists.
 * @param config.serviceParams - an array of name value pairs (where the array can be scalar or a node etc)
 *                               Not used if callServiceParams exists. 
 */
fwServiceCallDataService.prototype._initialise = function(config, async, resultHandler)
{
    this.m_appC = Services.getAppController();
    
    var mappingName = config.serviceName;

    // Get the parameters for the service call - can either be passed in "readymade" (callServiceParams)
    // or can be an array of name value pairs which will be converted into a ServiceParams object.
    var parameters = (config.callServiceParams != null
    				 ? config.callServiceParams
    				 : fwServiceCallDataService._createParameters(config.serviceParams, false));
    
    // Construct the service URL - if the service is to be secure covert to https. 
    this.m_serviceURL = this.m_appC.m_rootURL + this.m_appC.m_config.getServiceBaseURL() 
                        + "_invoker/" + fwServiceCallDataService.servletName;
    if (config.secure) 
    {
        var securePort = this.m_appC.m_config.m_servicesSecurePort;    
        this.m_serviceURL = this.m_serviceURL.replace(/^http[s]{0,1}:/,"https:");
        this.m_serviceURL = this.m_serviceURL.replace(/^(https:\/\/[^:\/]*)[:,0-9]*(.*)/,"$1:" + securePort + "$2" );
    }
    
    // Get the URL for the servlet, the name of the service and the method to call 
    var formName = this.m_appC.m_currentForm.getName();
    var service = this.m_appC.m_config.getServiceForFormMapping(formName, mappingName);
    if (service == null)
    {
        throw new ConfigurationException("No Service found for mapping: " + mappingName + " in form: " + formName);    
    }
    var serviceURL = this.m_serviceURL;
    var serviceName = service.getURL();
    
    var method = service.getMethod();
    
    // Set up username and password
    var username;
    if (config.username == null)
    {
        username = this.m_appC.getSecurityContext().getCurrentUser().getUserName();
    }
    else
    {
        username = config.username; 
    }
    var password = config.password; 
    
    // Add any common parameters to the existing list - this should contain courtId at the minimum
    // as it is required by the security to authorise
    var commonParameters = this.m_appC.m_config.getCommonParameters();
    for(var i=0; i < commonParameters.length; i++)
    {
        parameters.addSimpleParameter(commonParameters[i].name, Services.getValue(commonParameters[i].value));
    }
    
    // Get the payload, or set empty of no parameters provided. 
    var payload = parameters.getPayload(); 
    
    // Check to see if get should be used, and if so for how long. 
    var cacheStrategy = service.m_cacheStrategy;  

    var thisObj = this;
	var exceptionHandlers = this.m_appC.getExceptionHandlers();
	var useDefault = exceptionHandlers["InvalidUserSession"].useDefault;
	
    if(null == resultHandler.onInvalidUserSessionException && true == useDefault)
    {
    	// InvalidUserSessionException handler not specified in the configuration
    	// and not disabled in applicationconfig.xml, so use a default one
    	var invalidUserSessionMsg = exceptionHandlers["InvalidUserSession"].message;
    	
        resultHandler.onInvalidUserSessionException = function(ex, name)
        {
        	thisObj.defaultExceptionHandler(invalidUserSessionMsg, ex.message);
		};
    }
    
	useDefault = exceptionHandlers["Authorization"].useDefault;
	
    if(null == resultHandler.onAuthorizationException && true == useDefault)
    {
    	// AuthorizationException handler not specified in the configuration
    	// and not disabled in applicationconfig.xml, so use a default one
    	var authorizationMsg = exceptionHandlers["Authorization"].message;
    	
        resultHandler.onAuthorizationException = function(ex, name)
        {
        	thisObj.defaultExceptionHandler(authorizationMsg, ex.message);
		};
    }
    
	// Default call to asynchronous if not defined
	var async = (null == config.async) ? true : config.async;    

	// Default progress bar to being shown if not defined
	var showProgress = (null == config.showProgress) ? true : config.showProgress;    

    var fullConfig = {
        url: serviceURL,
        serviceName: serviceName,
        method: method,
        handler: resultHandler,
        payload: payload,
        username: username,
        password: password,
        async: async,
        showProgress: showProgress,
        cacheStrategy: cacheStrategy,
        secure: config.secure
    } 
    
    // Call parent function
    fwServerCallDataService.prototype._initialise.call(this, fullConfig, async, resultHandler);
}

/*
 * Handler for Framework default exceptions.
 *
 * @param uMsg - the message defined by the user in the applicationconfig.xml
 * @param eMsg - the message provided by the exception
 */
fwServiceCallDataService.prototype.defaultExceptionHandler = function(uMsg, eMsg)
{
	if(null == uMsg)
	{
		// No user defined message, so use the message from the exception
		uMsg = eMsg;
	}
	
	if(this.m_appC.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
	{
	    var callbackFunction = function(userResponse)
	    {
	    	var ac = Services.getAppController();
			if(ac != null)
			{
				ac.logoff(null, false);
			}
	    }
	    
		this.m_appC._hideProgress();
		Services.showDialog(StandardDialogTypes.OK, callbackFunction, uMsg);
	}
	else
	{
		this.m_appC._hideProgress();
		alert(uMsg);
		this.m_appC.logoff(null, false);
	}
}

/*
 * Core function invoked by the loader to create the document.
 */
fwServiceCallDataService.prototype.load = function()
{
    this.callHTTPService();
}

/**
 * Calls a fwServiceCallDataService.
 * 
 * Automatically attaches the following headers 
 *
 * SUPS-User -  Same as that used during last login. If never logged in the default (anonymous) is used. 
 * SUPS-Pass -  Will be sent if parameter 'password' is not null, otherwise no header is attached.
 * SUPS-Mac - Will be passed if the parameter 'password' is null and the user has previously logged in. 
 * SUPS-Method - Will be the same as the parameter 'method'
 * SUPS-Service - Will be the same as the parameter 'service'
 *
 * No actual params but relies on this.m_config to have the following properties.
 * @param url - the url of the servlet to be accessed.
 * @param service - the service (probably mapped to an ejb) on which to call the method.
 * @param method - the method to call.
 * @param callBackHandler - object of type HTTPCallback
 * @param payload - the message to be sent to the service.
 * @param password - used for authentication if required. 
 * @param async boolean determines whether or not to call the service asyncronously or not
 * @param showProgress - whether or not to graphically display the service's progress
 */
fwServiceCallDataService.prototype.callHTTPService = function()
{
	if(fwServiceCallDataService.m_logger.isTrace()) fwServiceCallDataService.m_logger.trace("fwServiceCallDataService.callService");
    
    var config = this.m_config;
	
	try {
		// Must determine whether handler is valid at this stage as cannot
		// throw exceptions later without handler...
        var handler = config.handler;
		if(handler == null)
		{
			throw new ConfigurationException("Null handler object");
		}
		else if(handler.onSuccess == undefined)
		{
			throw new ConfigurationException("Must implement onSuccess");
		}
		
		var url = config.url;
		var serviceName = config.serviceName;
		var method = config.method;
		var handler = config.handler;
		var payload = config.payload;
		var username = config.username;
		var password = config.password;
		var async = config.async;
		var showProgress = config.showProgress;
		var cacheStrategy = config.cacheStrategy;
        var secure = config.secure;
	
		if(fwServiceCallDataService.m_logger.isDebug()) fwServiceCallDataService.m_logger.debug("processing request for serviceName: " + serviceName);

		// Start the progress bar / update the service request count 
        if (showProgress)
        {
		   this.m_appC._showProgress();
		   this.m_appC.m_serviceRequestCount++;
        }
	
	    // Add required member variables to the handler
	    handler.serviceName = serviceName;
        
        // Setup the request
        var index;
        var requestInfo = new Object();
        
        index = xmlHttpServiceRequestQueue.length;
        xmlHttpServiceRequestQueue.push(requestInfo);
        
	    requestInfo.server = new XMLHttpServiceRequest();
        requestInfo.server.initialise(this,url,async,handler,handleRequestReadyStateChange);
        
        // Defect 1061. Previously HTTP "GET" requests supplied the
        // user name as a parameter. Modify code such that user name
        // is now sent as HTTP header value. Note, HTTP "POST"s
        // always submitted user name as HTTP header value.
	    requestInfo.server.addHeader("SUPS-User", username);
	    
	    requestInfo.server.addParameter("SUPS-Method", method);
	    requestInfo.server.addParameter("SUPS-Service", serviceName);
	        
	    // If password is provided use that - otherwise send a mac for authentication.
	    if (password != null)
	    {
	        requestInfo.server.addHeader("SUPS-Password", password);
	    }
	    else
	    {
	        var macString = this.m_appC.m_securityContext.generateMac(payload); 
	        requestInfo.server.addHeader("SUPS-Mac", macString);
	    }
	   
        // TODO: investigate the following if statement  
        // https doesn't seem to like having payload for some reason. 
        if (secure)
        {
            payload = null; 
        }
        
        // Define handler parameters in array to allow
        // flexibility
        var handlerArgs = new Array();
        handlerArgs[0] = index;

		// Send the message 
	    if (cacheStrategy != null && cacheStrategy == "GET")
	    {
	    	requestInfo.server.sendGET(payload, handlerArgs);
	    }
	    else //default
	    {
	    	requestInfo.server.sendPOST(payload, handlerArgs);
	    }
    }
    catch (ex) 
    {
        throw new SystemException("Exception thrown calling service.",ex);
    }
}

/*
 * Overrides the parent to check if an exception has been thrown by the server
 * and then invoke the appropriate handler.
 */
fwServiceCallDataService.prototype._processSuccessfulDOMCreation = function(dom)
{
    var exceptionNodeArray = dom.selectNodes("/" + fwServiceCallDataService.SUPS_ExceptionTag);
    if (exceptionNodeArray.length == 0)
    {
        // Successful call, just invoke parent class and return.
        fwDataService.prototype._processSuccessfulDOMCreation.call(this,dom); 
        return;
    }
    
    // Process returned exception string looking for the correct handler.
    // eg string will be of the form: BusinessException|TestBusinessException||Message 
    var exceptionString = XML.getNodeTextContent(exceptionNodeArray[0]);
    
    // Break string into exception hierachy and message
    // ie BusinessException|TestBusinessException and Message
    var exceptionStringArray = exceptionString.split("||");
    
    // Split exception hierachy into elements
    // ie BusinessException and TestBusinessException
    var exceptionArray = exceptionStringArray[0].split("|");
    
    // Reform message
    exceptionStringArray.shift();
    var exceptionMessage = exceptionStringArray.join();
    
    // Loop through handler looking for exceptions handlers, most specific first. 
    var exceptionHandled = false;
    var handler = this.m_config.handler;
    
    // Create a fwException 
    var exception = new fwException(exceptionMessage);
                                    
    exception.exceptionHierarchy = exceptionArray;
    
    this.handleException(exception); 
}

/*
 * Class responsible for actually making the request.
 * Stores all required parameters and can be used to make 
 * either GET or POST request
 */
function XMLHttpServiceRequest(){};

/*
 * @param callingObject must implement handlereadystatechange(..)
 */
XMLHttpServiceRequest.prototype.initialise = function(callingObject,url,async,handler,readyStateHandler)
{
    this.m_async = async;
    this.m_url = url;
    this.m_firstParam = true;
    this.m_params = new Array();
    this.m_headers = new Array();
    this.m_callingObject = callingObject;
    this.m_handler = handler;
    
    // Set request instance reference to null
    this.m_request = null;
    
    this.m_readyStateHandler = readyStateHandler;
}

XMLHttpServiceRequest.prototype.dispose = function()
{
    // Clear reference to calling object
    this.m_callingObject = null;
    
    // Clear reference to handler
    this.m_handler = null;
    
    // Clear reference to function which handles ready state change
    this.m_readyStateHandler = null;
    
    // Clear reference to instance of XMLHttpServiceRequest
    this.m_request = null;
}

XMLHttpServiceRequest.prototype.addParameter = function(name, value)
{
    this.m_params.push({Name: name, Value: value});
}

XMLHttpServiceRequest.prototype.addHeader = function(name, value)
{
    this.m_headers.push({Name: name, Value: value});
}

XMLHttpServiceRequest.prototype.sendGET = function(payload, handlerArgs)
{
    var firstParam = true;
    
    var url = this.m_url + "?PARAMS=" + encodeURIComponent(payload); 
    
    for (var i = 0, l = this.m_params.length; i < l; i++)
    { 
        var name = this.m_params[i].Name;
        var value = this.m_params[i].Value;
        
	    if (name == null || name == "" || value == null) 
	    {
	    	throw new ConfigurationException("Empty parameter name or null value");
	    }
	    
	    url = url + "&" + name + "=" +  encodeURIComponent(value); 
    }
    
    // alert("url length is : " + url.length + "    url is: " + url);
    
    if (url.length > fwServiceCallDataService.MAX_PUT_URL_LENGTH)
    {
        this.sendPOST(payload, handlerArgs);
        return;
    }
    
    var request = this._getRequest(handlerArgs); 
    
    request.open("GET", url, this.m_async);
    
    //request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    // Careful with this one - can stop caching if the wrong one is set
    request.setRequestHeader("Content-Type", "application/x-javascript");
    
    // Add required headers (will not affect the caching)
    for (var i = 0, l = this.m_headers.length; i < l; i++)
    { 
        var name = this.m_headers[i].Name;
        var value = this.m_headers[i].Value;
        request.setRequestHeader(name, value);
    }
    
    request.send(null); 
}

XMLHttpServiceRequest.prototype.sendPOST = function(payload, handlerArgs)
{
    var request = this._getRequest(handlerArgs); 
    request.open("POST", this.m_url, this.m_async);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    // Send parameters as headers for post
    for (var i = 0, l = this.m_params.length; i < l; i++)
    { 
        var name = this.m_params[i].Name;
        var value = this.m_params[i].Value;
        request.setRequestHeader(name, value);
    }
    
    for (var i = 0, l = this.m_headers.length; i < l; i++)
    { 
        var name = this.m_headers[i].Name;
        var value = this.m_headers[i].Value;
        request.setRequestHeader(name, value);
    }
    
    request.send(payload);
}

XMLHttpServiceRequest.prototype._getRequest = function(handlerArgs)
{
    // DIR Changes: Removed IE / Mozilla browser check around initialisation of m_request - application will only be
    // accessed via IE.  This resolves Login via SSL issue under IE7 without having to change browser settings.
    this.m_request = new ActiveXObject("Microsoft.XMLHTTP");
   
    var localHandlerArgs = handlerArgs;
    
    var thisObj = this;
    //this.m_request.onreadystatechange = function(){ thisObj.m_readyStateHandler.call(thisObj, handlerArgs); };

    //Code change courtesy of https://bugzilla.mozilla.org/attachment.cgi?id=234988
    if( typeof ActiveXObject == 'undefined') {
        // Firefox uses onload, but only when you have multiple AJAX requests going.
        // Usually you can bind to onreadystatechange, but only if you are not doing too many requests at once.
        this.m_request.onload = function( e ) {
            var evt = window.event ? window.event : e;
            var targ = evt.target ? evt.target : evt.srcElement;
            thisObj.m_readyStateHandler.call(thisObj, handlerArgs);
        }
    }
    else {
        // IE does not have an onload handler, so bind the onreadystatechange
        this.m_request.onreadystatechange = function(){ thisObj.m_readyStateHandler.call(thisObj, handlerArgs); };
    }
    
    return this.m_request;
}

/**
 * Return reference to store XMLHttpServiceRequest instance
 *
*/
XMLHttpServiceRequest.prototype.getRequest = function()
{
    return this.m_request;
}

/**
 * Separate function used to handle readyState changes on request
 *
*/

function handleRequestReadyStateChange(handlerArgs)
{
    var index = handlerArgs[0];
    
    var requestInfo = xmlHttpServiceRequestQueue[index];
    
    if(null != requestInfo)
    {
        // Retrieve request object
        requestInfo.server.m_callingObject.handleReadyStateChange(index);
        
        requestInfo = null;
    }
}

/**
 * Creates the parameters from the array of name values pairs passed in. 
 *
 * @param see config.serviceParams in _initialise.
 * @param flag for clean record stripping
 */
fwServiceCallDataService._createParameters = function(paramConfigs, stripCleanRecords)
{
	var params = new ServiceParams();
	// Turn off clean record stripping if not defined
	var _stripCleanRecords = (null == stripCleanRecords) ? false : stripCleanRecords;
	
	for(var i in paramConfigs)
	{
		var paramConfig = paramConfigs[i];
		var paramName = paramConfig.name;
		
        if(null == paramName)
        {
            throw new ConfigurationException("Service parameter name not defined." );
        }
		
		// Deal with value parameter which extracts a value from the DOM from a given XPath
		if(null != paramConfig.value)
		{
			var value = Services.getValue(paramConfig.value);
			if(null == value)
			{
				// currently hack because there is no test data
				value = "";
			}
			if(fwServiceCallDataService.m_logger.isTrace()) fwServiceCallDataService.m_logger.debug("fwServiceCallDataService._createParameters(): adding parameter to ServiceParams, name = " + paramName + ", from XPath = '" + paramConfig.value + "', value = " + value);
			params.addSimpleParameter(paramName, value);
		}
		
		// Deal with constant parameter
		else if(null != paramConfig.constant)
		{
			var value = paramConfig.constant;
			if(null == value)
			{
				value = "";
			}
			if(fwServiceCallDataService.m_logger.isTrace()) fwServiceCallDataService.m_logger.debug("fwServiceCallDataService._createParameters():, adding constant parameter to ServiceParams, name = " + paramName + ", value = " + value);
			params.addSimpleParameter(paramName, value);
		}
		
		// Deal with node parameter
		else if(null != paramConfig.node)
		{
			// Create empty XML document
			var tmpDOM = XML.createDOM(null,null,null);

			// Retrieve a copy of the node to be saved
			var paramXPath = paramConfig.node;
			
			// Save node from client side DOM
			var saveNode = Services.getNode(paramXPath);
				
			var targetXPath = paramConfig.target;
			if(null != targetXPath)
			{
				// Create node structure above target node
				var targetNodeParents = fwServiceCallDataService._parseXPathNodeNames( targetXPath );
				var pathNodes = new Array();
				for( var j = 0, jl = targetNodeParents.length; j < jl; j++)
				{
					// Create node
					pathNodes[j] = XML.createElement( tmpDOM, targetNodeParents[j] );
				
					if(j > 0)
					{
						pathNodes[j-1].appendChild(pathNodes[j]);
					}
				}
				
				// Append save node to bottom of structure
				pathNodes[j-1].appendChild(saveNode);
				
				// Append node structure to DOM
				tmpDOM.appendChild(pathNodes[0]);
			}
		    else
		    {
		        // Attempt to save node in temporary DOM
		        tmpDOM.appendChild(saveNode);
		    }

			if(_stripCleanRecords)
			{
	            // If there are records defined we need to know what the XPath offset
	            // is to be able to match the DOM against the record XPaths which are
	            // defined against the DOM's structure, i.e. /ds/ManageCase/...
	            var recordOffset = XPathUtils.removeTrailingNode(paramXPath);
	
				// Strip clean records from the temporary DOM
				tmpDOM = RecordsProtocol.stripCleanRecords(tmpDOM, recordOffset, targetXPath);
			}

			// Add XML structure to params
			params.addDOMParameter(paramName, tmpDOM);
		}
	}
    return params;
}

/**
 * Method parses a given xpath returning an array containing
 * the names of the nodes in the xpath.
 *
 * @param xp String The xpath to be parsed
 * @return Array of node names in xpath
 *
*/
fwServiceCallDataService._parseXPathNodeNames = function(xp)
{
    var s = 0;
    var lastSlash = -1;
    var nodeNames = new Array();
    var length = xp.length;
          
    if(length > 0)
    {
        if(xp.charAt(s) == '/')
        {
            s = 1;
            lastSlash = 0;
        }
          
        while( s < length )
        {
            switch(xp.charAt(s))
            {
                case '/':
                    if( s > lastSlash + 1)
                    {
                        nodeNames[nodeNames.length] = xp.substring( lastSlash + 1, s);
                        lastSlash = s;
                        s++;
                    }
                    else
                    {
                        throw new ConfigurationException( "Error target node definition contains unexpected double foreslashes" );
                    }
                    break;
                      
                default:
                    s++;
                    break;
            }
        }
        if( lastSlash != length - 1)
        {
            nodeNames[nodeNames.length] = xp.substring( lastSlash + 1, s)
        }
    }
    return nodeNames;
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwServiceCallDataService.prototype.getDefaultName = function()
{
	// Return the serviceName configuration
	return this.m_config.serviceName;
}

