//==================================================================
//
// HTMLFrameFormViewManager.js
//
// FormView for HTML Form Views with a frame.
//
//==================================================================


/**
 * HTMLFrameFormViewManager Constructor
 *
 * @constructor
 */
function HTMLFrameFormViewManager()
{
}

HTMLFrameFormViewManager.m_logger = new Category("HTMLFrameFormViewManager");

/**
 * HTMLFormView is a sub class of HTMLFormViewManager
 */
HTMLFrameFormViewManager.prototype = new HTMLFormViewManager();
HTMLFrameFormViewManager.prototype.constructor = HTMLFrameFormViewManager;


/**
 * The frame which is being managed by the HTMLFrameFormViewManager
 *
 * @type fwFrameManager
 * @private
 */
HTMLFrameFormViewManager.prototype.m_frame = null;


/**
 * Flag to indicate whether the lifecycle of the frame being
 * manage is controlled by the HTMLFrameFormViewManager
 *
 * @type boolean
 * @private
 */
HTMLFrameFormViewManager.prototype.m_manageLifeCycle = false;


/**
 * The url that the frame is attempting to load
 *
 * @type String
 * @private
 */
HTMLFrameFormViewManager.prototype.m_url = null;


/**
 * Factory method to create HTMLFrameFormViewManagers to manage an
 * existing iframe
 *
 * @param frame the frame to manage
 */
HTMLFrameFormViewManager.manageExistingFrame = function(frame)
{
	var fv = new HTMLFrameFormViewManager();
	
	fv.m_frame = fwFrameManager.create(frame);
	fv.m_manageLifeCycle = false;
	
	fv._initialise();
	
	return fv;
}


HTMLFrameFormViewManager.createManagedIFrame = function(p, className)
{
	var fv = new HTMLFrameFormViewManager();
	
	// Default to popupsubformframe
	var className = (className == null ? "popupsubformframe" : className);
	
	// Create the iframe which will contain the subform
    p.innerHTML = "<iframe width='100%' height='100%' frameborder='0' scrolling='no' class='" + className + "'></iframe>"
	
	// Get the iframe child and manage it
	fv.m_frame = fwFrameManager.create(p.childNodes[0]);
	fv.m_manageLifeCycle = true;
    
    fv._initialise();
    
    return fv;
}


HTMLFrameFormViewManager.prototype._initialise = function(frame)
{
	// Get the fwFrameManager to tell us about load success/failure of the frame
	// Defect 1034. Function registration should define argument passed to listener.
	var thisObj = this;
	this.m_frame.addLoadCompleteListener(function(errMsg) {thisObj._loadViewComplete(errMsg);});

	// Call super class
	HTMLFormViewManager.prototype._initialise.call(this);
}


HTMLFrameFormViewManager.prototype.dispose = function()
{
	// Call parent
	HTMLFormViewManager.prototype.dispose.call(this);

	// Hang onto the actual frame
	var frame = this.m_frame.getFrame();

	// Dispose of the fwFrameManager
	this.m_frame.dispose();
	this.m_frame = null;
	
	// Clean up logging static class instance
	frame.contentWindow.Logging.destroy();
	
	if(this.m_manageLifeCycle)
	{
		// Get rid of the frame
		frame.parentNode.innerHTML = "";
	}
	
}


HTMLFrameFormViewManager.prototype._getWindow = function()
{
	return this.m_frame.getFrame().contentWindow;
}


HTMLFrameFormViewManager.prototype.loadView = function(url, cssDefs)
{
	if(null != this.m_url)
	{
		this._unbindView();
		
		if(this.m_formController)
		{
			this._disposeFormController();
		}
	}
	
	this.m_frame.getFrame().style.visibility = "hidden";
	this.m_frame.load(url);
	this.m_url = url;
	this.m_cssDefs = cssDefs;
}


HTMLFrameFormViewManager.prototype._loadViewComplete = function(errorMessage)
{
	if(null == errorMessage)
	{   
		// Wait for the the Framework.js to be loaded - normally the document's
		// onload handler shouldn't be called until this has happened, but IE
		// occasionally get's this wrong and invokes the onload handler before
		// it is has loaded all the JavaScript files referenced in the HTML view.
		// This means we need to do some extra work to determine when the view
		// has actually really loaded and is ready to go.
		this._waitForFrameworkToLoad();
	}
	else
	{
	    // Defect 1034. Form of confirm was incorrect. Previously either option
	    // caused "true" to be returned.
		if( confirm("Unable to load form.\n\nException was: " + errorMessage + "\n\nPress OK to retry or Cancel to exit application") )
		{
			// Try reloading the form again
			this._loadView(this.m_url);
		}
		else
		{
			this.m_url = null;
			Services.getAppController().shutdown();
		}
	}
}


HTMLFrameFormViewManager.prototype._frameworkLoadComplete = function()
{
	// Make the frame visible again
	this.m_frame.getFrame().style.visibility = "inherit";
	
	// Invoke super class
	HTMLFormViewManager.prototype._frameworkLoadComplete.call(this);
}
