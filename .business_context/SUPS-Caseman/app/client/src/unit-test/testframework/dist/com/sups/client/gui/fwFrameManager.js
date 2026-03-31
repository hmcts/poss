//==================================================================
//
// fwFrameManager.js
//
// Class for managing HTML Frames in the framework
//
//==================================================================



/**
 * fwFrameManager Constructor
 *
 * @constructor
 */
function fwFrameManager()
{
}

fwFrameManager.m_logger = new Category("fwFrameManager");


/**
 * The frame which is being managed by the fwFrameManager
 *
 * @type HTMLFrameElement
 * @private
 */
fwFrameManager.prototype.m_frame = null;


/**
 * The url that the frame is attempting to load
 *
 * @type String
 * @private
 */
fwFrameManager.prototype.m_url = null;


/**
 * The onload handler registered on the frame
 *
 * @type SUPSEventKey
 * @private
 */
fwFrameManager.prototype.m_loadHandler = null;


/**
 * The number of attempts made to access the frame's
 * document after the onload handler is called. This
 * is required as IE occasionally calls the onload
 * before the document is ready, leading to an 
 * permission denied exception being thrown.
 *
 * @type int
 * @private
 */
fwFrameManager.prototype.m_retries;


/**
 * The maximum number of attempts to access the frame's
 * document after the onLoadHandler has been fired that
 * the fwFrameManager will make before giving up
 *
 * @type int
 * @private
 */
fwFrameManager.MAX_NUMBER_OF_RETRIES = 20;

/**
 * Listeners who are interested in hearing about when
 * the frame's content is loaded. By this we mean loaded,
 * and the document can be accessed without the permission
 * denied exception being thrown.
 *
 * @type CallbackList
 * @private
 */
fwFrameManager.prototype.m_loadCompleteListeners = null;


/**
 * Create the fwFrameManager
 *
 * @param frame the HTMLFrameElement to manage
 */
fwFrameManager.create = function(frame)
{
	var fm = new fwFrameManager();
	fm.m_frame = frame;
	
	fm.m_loadHandler = SUPSEvent.addEventHandler(frame, 'load', function() {fm._loadComplete();});
	fm.m_loadCompleteListeners = new CallbackList();
	
	return fm;
}


/**
 * Dispose of the fwFrameManager. The HTMLFrameElement being managed is not disposed!
 */
fwFrameManager.prototype.dispose = function()
{
	if(null != this.m_loadHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_loadHandler);
		this.m_loadHandler = null;
	}
	
	// Set reference to iframe to null
	this.m_frame = null;
	
}


/**
 * Add a listener to fwFrameManager that is invoked when a load
 * completes. The listener should expect a single String argument. 
 * If the value of the argument is null then the page loaded 
 * successfully. If it is not null then the page failed
 * to load and the String contains a description of the error.
 *
 * @param cb the listener function to add
 */
fwFrameManager.prototype.addLoadCompleteListener = function(cb)
{
	this.m_loadCompleteListeners.addCallback(cb);
}


/**
 * Remove a previously added listener from fwFrameManager.
 *
 * @param cb the listener function to remove
 */
fwFrameManager.prototype.removeLoadCompleteListener = function(cb)
{
	this.m_loadCompleteListeners.removeCallback(cb);
}


/**
 * Get a reference to the frame being managed
 *
 * @return a reference to the frame being managed
 * @type HTMLFrameElement
 */
fwFrameManager.prototype.getFrame = function()
{
	return this.m_frame;
}


/**
 * Attempt to load a specified url into the managed frame.
 * The client of this class can register listeners using
 * addLoadCompleteListener to hear about the success or
 * failure of the load attempt
 *
 * @param url the URL to load into the managed frame
 */
fwFrameManager.prototype.load = function(url)
{
	if(fwFrameManager.m_logger.isDebug()) fwFrameManager.m_logger.debug("Starting load of url: '" + url + "'");
	this.m_retries = 0;
	this.m_url = url;
	this.m_frame.src = url;
}


/**
 * onLoad event handler method which is informed of 
 * the completion of loading of the frames content
 *
 * @private
 */
fwFrameManager.prototype._loadComplete = function()
{
	var doc = null;
	
	if(fwFrameManager.m_logger.isDebug()) fwFrameManager.m_logger.debug("Checking ready state of document: '" + this.m_url + "'");

	try
	{
		// Try to access the frame's content document
		doc = this.m_frame.contentWindow.document;
		
		// @todo. Ideally we would check that the document loaded
		// successfully - i.e. There was no error condition such
		// as a 404 or 500 etc. Unforunately this is simply not
		// possible, although one solution might be to require the
		// web server to generate a special custom error page
		// that we can detect by inspecting the document.

		if(fwFrameManager.m_logger.isDebug()) fwFrameManager.m_logger.debug("Notifying listeners of successful load of url: '" + this.m_url + "'");

		// If we got here no permission denied exception was thrown
		// so notify any listeners of success.
		try
		{
		    // Defect 1034. In the case of dynamic pages the callback function may
		    // raise an exception when the page's adaptors are initialised. This will
		    // not happen for forms as the adaptors are initialised after a timeout.
		    this.m_loadCompleteListeners.invoke(null);
		}
		catch(innerEx)
		{
		    // Pass error message to listener function.
		    this.m_loadCompleteListeners.invoke(innerEx.message);
		}
	}
	catch (ex)
	{
		if(this.m_retries < fwFrameManager.MAX_NUMBER_OF_RETRIES)
		{
			if(fwFrameManager.m_logger.isDebug()) fwFrameManager.m_logger.debug("Access denied to frames document - will retry: '" + this.m_url + "'");

			this.m_retries++;
			var thisObj = this;
			// Try again in a little while
			setTimeout(function() {thisObj._loadComplete(); }, 100);
		}
		else
		{
			if(fwFrameManager.m_logger.isDebug()) fwFrameManager.m_logger.debug("Notifying listeners of failure to load url: '" + this.m_url + "'");

			// Give up - notify any listeners of failure.
			this.m_loadCompleteListeners.invoke(ex.message);
		}
	}
}
