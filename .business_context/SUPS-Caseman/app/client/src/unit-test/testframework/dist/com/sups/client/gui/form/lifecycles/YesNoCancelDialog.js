//==================================================================
//
// YesNoCancelDialog.js
//
// Class provides Yes No Cancel dialog event handling.
//
//==================================================================

/**
 * Stores an instance of the dialog object
 */
var yncDlgInstance;

/**
 * Creates a dialog object and starts the event handlers
 */
initialise = function()
{
	yncDlgInstance = new yesNoCancelDialog();
	yncDlgInstance.startEventHandlers();
}

/**
 * Stops the event handlers and disposes of the dialog object
 */
dispose = function()
{
	yncDlgInstance.stopEventHandlers();
	delete yncDlgInstance;
	yncDlgInstance = null;
}

/**
 * @constructor
 */
function yesNoCancelDialog()
{
	this.m_yesClickHandler = null;
	this.m_noClickHandler = null;
	this.m_cancelClickHandler = null;
}

/**
 * Starts the dialog's event handlers
 * 
 * @private
 */
yesNoCancelDialog.prototype.startEventHandlers = function()
{
	var thisObj = this;
	var element;
	
	if(null == this.m_yesClickHandler)
	{
		element = document.getElementById("yesButton");
		this.m_yesClickHandler = SUPSEvent.addEventHandler(element, "click", function() { thisObj._yesClickHandler(); });	
	}

	if(null == this.m_noClickHandler)
	{
		element = document.getElementById("noButton");
		this.m_yesClickHandler = SUPSEvent.addEventHandler(element, "click", function() { thisObj._noClickHandler(); });	
	}

	if(null == this.m_cancelClickHandler)
	{
		element = document.getElementById("cancelButton");
		this.m_yesClickHandler = SUPSEvent.addEventHandler(element, "click", function() { thisObj._cancelClickHandler(); });	
	}
}

/**
 * Stops the dialog's event handlers
 * 
 * @private
 */
yesNoCancelDialog.prototype.stopEventHandlers = function()
{
	if(this.m_yesClickHandler != null)
	{
		SUPSEvent.removeEventHandlerKey(this.m_yesClickHandler);
		this.m_yesClickHandler = null;
	}

	if(this.m_noClickHandler != null)
	{
		SUPSEvent.removeEventHandlerKey(this.m_noClickHandler);
		this.m_noClickHandler = null;
	}

	if(this.m_cancelClickHandler != null)
	{
		SUPSEvent.removeEventHandlerKey(this.m_cancelClickHandler);
		this.m_cancelClickHandler = null;
	}
}

/**
 * Yes button click handler
 * 
 * @private
 */
yesNoCancelDialog.prototype._yesClickHandler = function()
{
	window.returnValue = StandardDialogButtonTypes.YES;
	window.close();
}

/**
 * No button click handler
 * 
 * @private
 */
yesNoCancelDialog.prototype._noClickHandler = function()
{
	window.returnValue = StandardDialogButtonTypes.NO;
	window.close();
}

/**
 * Cancel button click handler
 * 
 * @private
 */
yesNoCancelDialog.prototype._cancelClickHandler = function()
{
	window.returnValue = StandardDialogButtonTypes.CANCEL;
	window.close();
}
