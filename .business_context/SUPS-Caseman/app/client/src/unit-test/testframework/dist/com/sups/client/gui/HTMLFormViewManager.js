//==================================================================
//
// HTMLFormViewManager.js
//
// FormView for HTML Form Views with a frame.
//
//==================================================================


/**
 * HTMLFormViewManager Constructor
 *
 * @constructor
 */
function HTMLFormViewManager()
{
}

HTMLFormViewManager.m_logger = new Category("HTMLFormViewManager");


HTMLFormViewManager.prototype.m_viewBound = false;


/**
 * Listeners that are interested in knowing when the view is 
 * loaded. In this context loaded means that the following
 * activities have completed:
 *    - The Form's HTML has been loaded
 *    - The Framework has completed loading in the Form's window.
 * The following activities may not have completed at this stage:
 *    - Loading of CSS by the stylemanager
 * The following activities will not have been started at this
 * stage:
 *    - Starting the Form Controller 
 *
 * @type CallbackList
 * @private
 */
HTMLFormViewManager.prototype.m_viewReadyListeners = null;


/**
 * Listeners that are interested in knowning when the view is
 * ready for user interaction. In this context this means the
 * following activities have completed:
 *    - The Form's HTML has been loaded
 *    - The Framework has completed loading in the Form's window.
 *    - CSS added by the StyleManager has competed loadeing (only guaranteed on IE)
 *    - The Form Controller has completed initialisation
 */ 
HTMLFormViewManager.prototype.m_formReadyListeners = null;


HTMLFormViewManager.prototype.m_cssDefs = null;

/**
 * Application wide flag indicating whether or not initialisation of
 * form controller should wait until javascript configuration file
 * associated with current form HTML page has been fully loaded.
 *
*/
HTMLFormViewManager.prototype.m_waitForConfigLoading = null; 


/**
 * Create a managed view on the current frame
 */
HTMLFormViewManager.create = function()
{
	var fv = new HTMLFormViewManager();
	
	fv._initialise();
	
	return fv;
}


HTMLFormViewManager.prototype._initialise = function()
{
	this.m_viewReadyListeners = new CallbackList();
	this.m_formReadyListeners = new CallbackList();
	
	// Define configuration file loading flag. Have to use direct reference
	// to AppController instance as FormController may not exist.
	this.m_waitForConfigLoading = top.AppController.getInstance().getWaitForConfigLoadingMode();
}


HTMLFormViewManager.prototype.dispose = function()
{    
	// Unbind view level event handlers
	this._unbindView();
	
	// Clear reference to value on application controller window
	this.m_waitForConfigLoading = null;
}


/**
 * Manage the current window by default
 */
HTMLFormViewManager.prototype._getWindow = function()
{
	return window;
}


/**
 * Get the document which contains the HTML for the view
 */
HTMLFormViewManager.prototype._getDocument = function()
{
	return this._getWindow().document;
}


/**
 * Get the FormController from the HTML View that is being managed
 */
HTMLFormViewManager.prototype.getFormController = function()
{
	var FCClass = this._getWindow().FormController;
	return (FCClass != null) ? FCClass.getInstance() : null;
}


HTMLFormViewManager.prototype.registerViewReadyListener = function(cb)
{
	this.m_viewReadyListeners.addCallback(cb);
}


HTMLFormViewManager.prototype.registerFormReadyListener = function(cb)
{
	this.m_formReadyListeners.addCallback(cb);
}


HTMLFormViewManager.prototype._bindView = function()
{
	if(!this.m_viewBound)
	{
		// Get the document that contains the HTML for the view...
		var doc = this._getDocument();
		

		// Set the appropriate stylesheet
		var sm = Services.getAppController().getStyleManager();
		
		// Need to know when stylemanager controlled CSS has loaded
		this.m_cssLoaded = false;
		var thisObj = this;
		this.m_cssListener = function() { thisObj._viewCSSLoaded(); };
		sm.registerOnLoadHandler(this.m_cssListener, doc);
		
		// Register the view's document with stylemanager
		sm.registerDocument(doc, this.m_cssDefs);
		
		// Keep track of whether or not view is bound
		this.m_viewBound = true;
	}
}


HTMLFormViewManager.prototype._unbindView = function()
{
	if(this.m_viewBound)
	{
		// Get the document that contains the HTML for the view...
		var doc = this._getDocument();
	
		// Remove the Form from the style managers list of registered documents.
		var ac = Services.getAppController();
		ac.m_styleManager.unregisterDocument(doc);
	
		// Keep track of whether or not view is bound
		this.m_viewBound = false;
	}
}


HTMLFormViewManager.prototype._viewCSSLoaded = function()
{
	// Remove the CSS changed listener from the 
	var sm = Services.getAppController().getStyleManager();
	var doc = this._getDocument();
	sm.unregisterOnLoadHandler(this.m_cssListener, doc);
	this.m_cssListener = null;
	
	this.m_cssLoaded = true;
}


HTMLFormViewManager.prototype._waitForFrameworkToLoad = function()
{
    //??if(openingPopup != true)
    //??{
	var cW = this._getWindow();
	
	// Check to see if the Framework has completed loading in the child frame -
	// I.E. sometimes reports that the view is completely loaded, when it is 
	// infact not yet ready. The last thing done while the framework is loading
	// is that the Services.frameworkLoaded flag is set to true, so we just poll
	// for this value, retrying until it is set to true.
	//
	// Polling may be extended to look for Services.formConfigLoaded
	// which should be defined at the end of a form's configuration file.
	var waitForConfigLoading = this.m_waitForConfigLoading;
	
	if((undefined !== cW.Services) && 
	   (true == cW.Services.frameworkLoaded) &&
	   ((waitForConfigLoading == false) || 
	    (waitForConfigLoading == true && cW.Services.formConfigLoaded == true)))
	{
		this._frameworkLoadComplete();
	}
	else
	{
		// Wait for a little while and then check the Services.frameworkLoaded flag again.
		var thisObj = this;
		setTimeout(function(){thisObj._waitForFrameworkToLoad();}, 50);
	}
	//??}
}


HTMLFormViewManager.prototype._frameworkLoadComplete = function()
{
    //??if(openingPopup != true)
    //??{
	  // Bind the view into the framework
	  this._bindView();

	  // Notify any listeners that are interested in when the view is loaded.
	  this.m_viewReadyListeners.invoke();
	//??}
}


HTMLFormViewManager.prototype._startFormController = function(initialData, invokingAdaptor, funit)
{
	var cW = this._getWindow();
	var thisObj = this;

	if(funit)
	{
		// If we are running as part of an FUnit test run, we need to perform a
		// slightly more complex initialisation procedure. As well as initialising
		// the FormController on the Form that is being managed, we also set the
		// FormController's fatal exception handler to simply re-throw the exception
		// so that it can be caught by the FUnit framework and appropriately checked
		// by that. We also need to kick off the FUnit tests themselves, once we have
		// initialised the FormController.
		cW.setTimeout(function() { 
				// Set fatal exception handler to a handler that simply rethrows the exception
				cW.FormController.setFatalExceptionHandler(function(e) { throw e; });
				
				// Initialise FormController
				cW.FormController.initialise(thisObj, initialData, invokingAdaptor);
				
				// Start funits if there are any
				cW.FUnit.continueTestRun();
			},
			0
		);
	}
	else
	{
		cW.setTimeout(function() {
			cW.FormController.initialise(thisObj, initialData, invokingAdaptor); }, 0);
	}
}


HTMLFormViewManager.prototype._disposeFormController = function()
{
	// Dispose of the FormController for the view we are managing.
	this.m_formController.dispose();
	
	// Clear reference to form controller
	this.m_formController = null;
}


HTMLFormViewManager.prototype.setFormController = function(formController)
{
	this.m_formController = formController;
}


HTMLFormViewManager.prototype.formControllerInitialised = function()
{
	// If CSS is loaded as well then we're all good so notify
	// formReadyListeners, otherwise wait a while to give CSS
	// a chance to load.
	if(this.m_cssLoaded)
	{
		// Notify all listeners that the form is ready for action.
		this.m_formReadyListeners.invoke();
	}
	else
	{
		var thisObj = this;
		setTimeout(function() {thisObj.formControllerInitialised();}, 50);
	}
}
