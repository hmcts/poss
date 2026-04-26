//==================================================================
//
// fwFileDataService.js
//
// DataService that loads data by loading serialized XML from a URL
//
//==================================================================


function fwFileDataService()
{
}


fwFileDataService.prototype = new fwServerCallDataService();
fwFileDataService.prototype.constructor = fwFileDataService;


/*
 * Set up the object
 *
 * @param config - in this case at least fileName, dataBinding and name
 * @param resultHandler - handler containing methods onSuccess, onError and defaultErrorHandler
 * @param async - currently ignored, will be set to false
 *
 */
fwFileDataService.prototype._initialise = function(config, async, resultHandler)
{   
    // Define showProgress flag
    var showProgress = config.showProgress;
    config.showProgress = (null == showProgress) ? true : showProgress;
    
    if(config.showProgress)
    {
        // Define reference to application controller used to
        // show and hide progress bar
        this.m_appC = Services.getAppController();
    }
    
	// Invoke _initialise method on parent class
    fwServerCallDataService.prototype._initialise.call(this, config, async, resultHandler);
}

/*
fwFileDataService.prototype.oldLoad = function()
{
	var dom = null;
	
	if(this.m_async)
	{
		var thisObj = this;
		dom = XML.createDOM(function() {thisObj._handleLoadComplete(dom)}, null, [])
	}
	else
	{
		dom = XML.createDOM(null, null, null);
	}

	// Actually do the load...
	//dom.load(this.m_config.fileName);
	dom = XML.loadStatic(this.m_config.fileName);
	
	// If loading synchronously, then invoke handleLoadComplete immediately,
	// if loading asynchronously, then handleLoadComplete is invoked when the
	// callback handler supplied to createDOM() is called.
	if(!this.m_async)
	{
		this._handleLoadComplete(dom);
	}
}
*/


fwFileDataService.prototype.load = function()
{
    // Relay call to service specific method
    this.retrieveFileUsingXMLHttpServiceRequest();
}

fwFileDataService.prototype.retrieveFileUsingXMLHttpServiceRequest = function()
{
    // Start the progress bar / update the service request count 
    if (this.m_config.showProgress)
    {
	    this.m_appC._showProgress();
		this.m_appC.m_serviceRequestCount++;
    }
        
    // Set up and store request information object
    var index;
    var requestInfo = new Object();
    
    index = xmlHttpServiceRequestQueue.length;
    xmlHttpServiceRequestQueue.push(requestInfo);
    
    requestInfo.server = new XMLHttpServiceRequest();
    
    // Ensure async parameter has a definite value
    var async;
    
    if(this.m_async == false)
    {
        async = false;
    }
    else
    {
        async = true;
    }
    
    // Initialise request
    requestInfo.server.initialise( this, 
                                   this.m_config.fileName, 
                                   async,
                                   null,
                                   handleRequestReadyStateChange );
                                   
    // Request file using "GET" method
    var handlerArgs = new Array();
    handlerArgs[0] = index;
    
    requestInfo.server.sendGET( "loadStaticFile", handlerArgs );
}


fwFileDataService.prototype._handleLoadComplete = function(dom)
{
	// Just delegate to _handleResultDOM() which will check for parse errors etc
	this._handleResultDOM(dom);
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwFileDataService.prototype.getDefaultName = function()
{
	// Default name is the name of the URL being loaded
	return this.m_config.fileName;
}
