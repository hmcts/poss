//==================================================================
//
// fwComputedDataService.js
//
// DataService that loads data by invoking an application provided
// custom function.
//
//==================================================================


/**
 * DataService that loads data by invoking an application provided
 * custom function.
 * Supports aysnchronous and synchronous loading.
 *
 * @ctor
 */ 
function fwComputedDataService()
{
}


fwComputedDataService.prototype = new fwDataService();
fwComputedDataService.prototype.constructor = fwComputedDataService;


fwComputedDataService.prototype.load = function()
{
	// Create a dom
	var dom = XML.createDOM(null, null, null);
	
	// Only ever asynchronous if configured to be so
	var async = (true == this.m_config.computedAsync);
	
	// Call application custom function to populate DOM with data
	if(async)
	{
		// If this computed method needs to perform asynchronous
		// operations, such as serviceCalls, then the function
		// specified in the computed: configuration must accept
		// two additional parameters. The first is the function
		// which should be invoked when the computed: function
		// completes successfully (no parameters required) and
		// the second is the function which should be invoked when
		// the computed: function fails to load the data (an
		// exception indicating the reason for the failure
		// should be passed to the failure function).
		var thisObj = this;
		this.m_config.computed(
			dom,											// DOM to populate
			function() {thisObj._handleLoadSuccess(dom);},	// function to invoke if loading successful
			function(ex) {thisObj._handleLoadFail(ex);}		// function to invoke if loading failed - requires exception object as parameter
		);
	}
	else
	{
		// If the computed function is invoke synchronously,
		// the the _handleLoadSuccess method is invoked
		// immediately unless the computed function throws
		// any exceptions, in which case the _handleLoadFail
		// method is invoked.
		try
		{
			this.m_config.computed(dom);
			this._handleLoadSuccess(dom);
		}
		catch (ex)
		{
			this._handleLoadFail(ex);
		}
	}
}


/**
 * Handle successful loading of data
 *
 * @param dom the DOM containing the newly loaded data.
 */
fwComputedDataService.prototype._handleLoadSuccess = function(dom)
{
	// Just delegate to _handleResultDOM() which will check for parse errors etc
	this._handleResultDOM(dom);
}


/**
 * Handle loading data failure
 *
 * @param ex the exception that caused the failure
 */
fwComputedDataService.prototype._handleLoadFail = function(ex)
{
	// If no exception supplied then generate a default one...
	if(null == ex)
	{
		ex = new fwDataServiceException("Loading failed for Data Service: " + this.getDefaultName() + " no reason provided by application");
	}
	
	// Call the result handler
	this.handleException(ex);
}


/**
 * Get a name associated with the service based on its configuration
 *
 * @return the default name for the fwDataService
 * @type String
 */
fwComputedDataService.prototype.getDefaultName = function()
{
	// Can't produce a particularly useful name here...
	return "Computed Data Service";
}
