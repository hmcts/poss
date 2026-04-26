/*
 * Class of type fwDataLoader which provides a mechanism for
 * retrieving files from the server outside of the reference
 * and model data loading classes.
 *
*/

function fwFileDataLoader()
{
}

fwFileDataLoader.prototype = new fwDataLoader();
fwFileDataLoader.prototype.constructor = fwFileDataLoader;

fwFileDataLoader.m_logger = new Category( "fwFileDataLoader" );

fwFileDataLoader.create = function( fileName, handler, async, showProgress )
{
    var fdl = new fwFileDataLoader();
    
    var config = {
                     fileName: fileName,
                     handler: handler,
                     async: async,
                     showProgress: showProgress
                 };
                 
    fdl._initialise(config);
    
    return fdl;
}

fwFileDataLoader.prototype._getResultHandler = function()
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