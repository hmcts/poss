//==================================================================
//
// fwFormInitDataLoader.js
//
// Class which handles loading Data into the form's DataModel
// during form initialisation
//
//==================================================================


/**
 * Class which handles loading Data into the form's DataModel
 * during form initialisation
 */
function fwFormInitDataLoader()
{
}

fwFormInitDataLoader.prototype = new fwDataLoader();
fwFormInitDataLoader.prototype.constructor = fwFormInitDataLoader;


fwFormInitDataLoader.m_logger = new Category("fwFormInitDataLoader");


/**
 * Reference to form to which this fwFormInitDataLoader belongs
 *
 * @type FormElementGUIAdaptor
 * @private
 */
fwFormInitDataLoader.prototype.m_form = null;

/**
 * Whether or not to generate datamodel events when 
 * data is loaded.
 *
 * @type boolean
 * @private
 */
fwFormInitDataLoader.prototype.m_generateDMEvents = false;


fwFormInitDataLoader.prototype._setGenerateDMEvents = function(generateEvents)
{
	this.m_generateDMEvents = generateEvents;
}


fwFormInitDataLoader.prototype.load = function()
{
	// Register the running data service with the FormController
	var fc = FormController.getInstance();
	fc.registerRunningDataService(this.m_config.name);
	
	// Perform the actual load
	fwDataLoader.prototype.load.call(this);
}


fwFormInitDataLoader.prototype._successHandler = function(dom, name)
{
	var fc = FormController.getInstance();
	var dm = fc.getDataModel();
	
	if(this.m_generateDMEvents)
	{
		// Add the model data to the dom and generate events.
		dm.addNodeSet(dom, this.m_config.dataBinding);
	}
	else
	{
		// Add the model data to the dom without generating events
		dm.addNodeSetWithoutEvents(dom, this.m_config.dataBinding);
	}
	
	// Let the FormController know that the DataService has loaded its data
	fc.runningDataServiceComplete(this.m_config.name);
}

/**
 * Class requires specific version of _getResultHandler. In addition to the
 * general properties set on the result handler sub-classes of this class
 * require some work to be done before the exception is handled. This
 * work is done by the function identified by the property
 * fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING on the result handler.
 *
*/
fwFormInitDataLoader.prototype._getResultHandler = function()
{
    // First use parent's _getResultHandler to create result handler object
    var resultHandler = fwDataLoader.prototype._getResultHandler.call(this);
    
    // Add additional function which must be executed before any error handling
    var thisObj = this;
    resultHandler[ fwDataLoader.EXCEPTION_HANDLER_PREPROCESSING ] = function() { thisObj._unregisterRunningDataService(); };
    
    return resultHandler;
}

/**
 * Method removes name of service from list of running services maintained
 * by FormController during form initialisation.
 *
*/
fwFormInitDataLoader.prototype._unregisterRunningDataService = function()
{
    FormController.getInstance().runningDataServiceComplete(this.m_config.name);
}
