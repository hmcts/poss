//==================================================================
//
// ValidationProtocolServerValidationDataLoader.js
//
// Class which handles lazy loading of data for the RecordsProtocol
//
//==================================================================


/**
 * Class which handles loading Data into the form's DataModel
 * during form initialisation
 */
function ValidationProtocolServerValidationDataLoader()
{
}


// Derived off fwDataLoader
ValidationProtocolServerValidationDataLoader.prototype = new fwDataLoader();
ValidationProtocolServerValidationDataLoader.prototype.constructor = ValidationProtocolServerValidationDataLoader;

/**
 * Logging category for ValidationProtocolServerValidationDataLoader
 *
 * @type Category
 * @private
 */
ValidationProtocolServerValidationDataLoader.m_logger = new Category("ValidationProtocolServerValidationDataLoader");



ValidationProtocolServerValidationDataLoader.prototype._successHandler = function(dom, name)
{
	// Delegate success back up to ValidationProtocol that created this DataLoader...
	this.m_validationProtocol.onServerValidationServerSuccess(dom);
}


ValidationProtocolServerValidationDataLoader.prototype._abort = function()
{
	// Delegate abort back up to ValidationProtocol that created this DataLoader...
	this.m_validationProtocol.onServerValidationAbort();
}


ValidationProtocolServerValidationDataLoader.create = function(config, validationProtocol)
{
	var dl = new ValidationProtocolServerValidationDataLoader();
	
	// 
	dl.m_validationProtocol = validationProtocol;
	
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
ValidationProtocolServerValidationDataLoader.prototype._getServiceTypeName = function()
{
	return "Server validation service";
}


/**
 * Get the message that should be displayed when the Cancel button is presed
 * on the Retry/Cancel dialog
 *
 * @return the message detailing the action that will be taken if the cancel
 *   button is pressed.
 * @type String
 */
ValidationProtocolServerValidationDataLoader.prototype._getAbortMessage = function()
{
	return "abort the server side validation (field will remain invalid)";
}
