/* 
 * Class of type fwDataLoader which provides additional ServiceCall processing
 */
 
 

function fwServiceCallDataLoader()
{
}

fwServiceCallDataLoader.prototype = new fwDataLoader();
fwServiceCallDataLoader.prototype.constructor = fwServiceCallDataLoader;

fwServiceCallDataLoader.m_logger = new Category("fwServiceCallDataLoader");

/* 
 * Create method which takes the same parameters as Services.callService
 * 
 * @param handler must have an onSuccess method defined.
 */
fwServiceCallDataLoader.create = function (mappingName,parameters,handler,async,showProgress)
{
    var scdl = new fwServiceCallDataLoader();
 
    var config = {
                    serviceName: mappingName,
                    callServiceParams: parameters,
                    handler: handler,
                    async:  async,
                    showProgress: showProgress  
    }   
    
    scdl._initialise(config);
    return scdl;
}

fwServiceCallDataLoader.prototype._getResultHandler = function()
{
	// Inspect the configuration and create a suitable errorHandler object
	var thisObj = this;
	var handler = this.m_config.handler; 
	var config = this.m_config;
    
    if (handler.onSuccess == null)
    {
	   throw new ConfigurationException("onSuccess must be defined for service calls.");
    } 
    
	// Add in the defaultErrorHandler handler
    handler.defaultErrorHandler = function(ex, name) { thisObj._defaultErrorHandler(ex, name); };
	
	return handler;
}





