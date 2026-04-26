//==================================================================
//
// RecordsProtocolLazyLoadingDataLoader.js
//
// Class which handles lazy loading of data for the RecordsProtocol
//
//==================================================================


/**
 * Class which handles loading Data into the form's DataModel
 * during form initialisation
 */
function RecordsProtocolLazyLoadingDataLoader()
{
}


// Derived off fwDataLoader
RecordsProtocolLazyLoadingDataLoader.prototype = new fwDataLoader();
RecordsProtocolLazyLoadingDataLoader.prototype.constructor = RecordsProtocolLazyLoadingDataLoader;

/**
 * Logging category for RecordsProtocolLazyLoadingDataLoader
 *
 * @type Category
 * @private
 */
RecordsProtocolLazyLoadingDataLoader.m_logger = new Category("RecordsProtocolLazyLoadingDataLoader");


/**
 * Reference to recordProtocol which created this DataLoader
 *
 * @type RecordsProtocol
 * @private
 */
RecordsProtocolLazyLoadingDataLoader.prototype.m_recordsProtocol = null;


/**
 * XPath to the data which is being lazy loaded
 *
 * @type String
 * @private
 */
RecordsProtocolLazyLoadingDataLoader.prototype.m_rowXPath;



RecordsProtocolLazyLoadingDataLoader.prototype._successHandler = function(dom, name)
{
	// Delegate success back up to RecordsProtocol that created this DataLoader...
	this.m_recordsProtocol.onLazyFetchingServerSuccess(dom, this.m_rowXPath, this.m_resultTargetXPath);
}


RecordsProtocolLazyLoadingDataLoader.prototype._abort = function()
{
	// Don't do anything if the user aborts a retry attempt - data is simply not loaded
}


RecordsProtocolLazyLoadingDataLoader.create = function(config, recordsProtocol, rowXPath, resultTargetXPath)
{
	var dl = new RecordsProtocolLazyLoadingDataLoader();
	
	// Hang onto records protocol, rowXPath and resultTargetXPath as we need them during in _successHandler
	dl.m_recordsProtocol = recordsProtocol;
	dl.m_rowXPath = rowXPath;
	dl.m_resultTargetXPath = resultTargetXPath;
	
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
RecordsProtocolLazyLoadingDataLoader.prototype._getServiceTypeName = function()
{
	return "Lazy loading data service";
}


/**
 * Get the message that should be displayed when the Cancel button is presed
 * on the Retry/Cancel dialog
 *
 * @return the message detailing the action that will be taken if the cancel
 *   button is pressed.
 * @type String
 */
RecordsProtocolLazyLoadingDataLoader.prototype._getAbortMessage = function()
{
	return "abort the data retrieval (data will not be available for viewing or editing)";
}
