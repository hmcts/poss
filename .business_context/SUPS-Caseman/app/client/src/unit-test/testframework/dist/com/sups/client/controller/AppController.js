//==================================================================
//
// AppController.js
//
// Application Controller. Responsibilities include:
//  - managing navigation between forms
//  - managing user session
//
//==================================================================

 
/**
 * Simple function that can be called from an onload handler to initialise the application controller.
 * @param contentFrameId ID of the frame which contains the content for the application
 * @param appConfig URL of the configuration file for this application
 */
function initAppController(contentFrameId, configURL, wsElement, headerLeft, headerTitle, headerRight, loggingConfigURL, rolesURL)
{
	LoggingImpl.initialise(loggingConfigURL);
	Logging.initialise(window);

	AppController.initialise(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight);
}


/**
 * Application Controller constructor 
 * @param contentFrameId name of the frame which contains the content for the application
 * @param appConfig URL of the configuration file for this application
 * @private
 * @constructor
 */
function AppController()
{
}

AppController.prototype._initialise = function(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight)
{
    this.startLoad = new Date();
	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("Application Controller Constructor.");

	// Prevent context menus and default keybindings in the top level document containing the AppController
	HTMLView.blockEventsForDocument(window.document);

	// Create instance of process performance monitor
	// Note, this code may be configured to be conditional
	// as it should only be used for development


	/*
	this.m_perfMonitor = new ProcessPerformanceMonitor();
	*/

	fc_assert(null != headerLeft && "" != headerLeft, "AppController(): headerLeft was null or empty: " + headerLeft);
	fc_assert(null != headerTitle && "" != headerTitle, "AppController(): headerTitle was null or empty: " + headerTitle);
	fc_assert(null != headerRight && "" != headerRight, "AppController(): headerRight was null or empty: " + headerRight);

	// Get the root URL for the application (protocol://domain)
	this.m_rootURL = getBaseURL(document);

	// Current request to the server
	this.m_requestTimeout = null;
	this.m_requestCount = 0;
	this.m_requestProgress = 0;
	
	// Store visibility of progress bar. Note, the value of m_requestCount
	// could also be used to check the visibility of the progress bar, but
	// m_progressBarVisible is changed immediately after the state of the
	// progress bar visibility changes.
	this.m_progressBarVisible = null;

	// The form currently displayed
	this.m_currentForm = null;

	// Get Elements of the header that we're interested in.
	this.m_headerLeft = document.getElementById(headerLeft);
	this.m_headerTitle = document.getElementById(headerTitle);
	this.m_headerRight = document.getElementById(headerRight);

	this.m_sessionData = null;
	this.m_errorMessages = new Array();

	// Callback list which is invoked when the application enters a modal state.
	this.m_modalCallbackList = new CallbackList();
	this.m_modal = false;
	
	// Move construction of AppConfig node before creation of main form view as this now
	// requires information from application configuration file.
	this.m_config = new AppConfig(configURL);
	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("ApplicationController() got the m_config for the specified url("+configURL+") " + this.m_config);

	this.m_mainFormView = HTMLFrameFormViewManager.manageExistingFrame(document.getElementById(contentFrameId));
	var ac = this;
	this.m_mainFormView.registerViewReadyListener(function() { ac._loadFormComplete(); });
	this.m_mainFormView.registerFormReadyListener(function() { ac._formReady(); });

    // Original location of application configuration file loading.
	//this.m_config = new AppConfig(configURL);
	//if(AppController.m_logger.isTrace()) AppController.m_logger.trace("ApplicationController() got the m_config for the specified url("+configURL+") " + this.m_config);

	this.m_appRoles = new AppRoles(rolesURL);
	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("ApplicationController() got the m_appRoles for the specified url("+rolesURL+") " + this.m_appRoles);

	this.m_serviceRequestCount = 0;
   
	// initialise the security context as null until the user logs on.
	this._setSecurityContext("Empty Session Key", "anonymous");
	
	// Set the AppController Frame
	this.m_styleManager = new StyleManager();
	this.m_styleManager.setConfiguration(this.m_config);

	// Create a view on the app controller window. In theory, a FormController
	// instance could be started on window, allowing components to be added to
	// the main application view. However the current implementation of
	// TabbingManager would need to be extended to support multiple frames, and
	// run across all active FormViews.
	this.m_appView = HTMLFormViewManager.create();
	this.m_appView._waitForFrameworkToLoad();
   
	this._loadInitialPage();
   
	this._showDate();
}

AppController.m_logger = new Category("AppController");

/**
 * Singleton instance for Application Controller
 */
AppController.m_instance = null;


/**
 * Form to navigate to when handling a form navigation event
 *
 * @type String
 * @private
 */
AppController.prototype.m_navigateToForm = null;

/**
 * Flag indicating that the loading of a form is associated with user
 * logging out
 *
*/
AppController.prototype.m_userLoggingOut = null;

/**
 * Timeout for handling navigate events
 *
 * @private
 */
AppController.prototype.m_eventProcessingTimeout = null;

/**
 * Reference to XMLHttpServiceRequest used to download
 * precompilation data
 *
*/
AppController.prototype.m_httpRequest = null; 


AppController.prototype.m_refDataCache = new Array();



AppController.SESSION_DATA_XPATH = "/ds/var/app";




/**
 * Initialise the application controller.
 *
 * @param contentFrameId ID of the frame which contains the content
 *   for the application
 * @param appConfig URL of the configuration file for this application
 * @private
 */
AppController.initialise = function(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight)
{
   fc_assert(null == AppController.m_instance, "ApplicationController.initialise(): instance already exists");
   if(AppController.m_logger.isTrace()) AppController.m_logger.trace("ApplicationController.initialise()");   
   AppController.m_instance = new AppController();
   AppController.m_instance._initialise(contentFrameId, configURL, rolesURL, headerLeft, headerTitle, headerRight);
   if(AppController.m_logger.isTrace()) AppController.m_logger.trace("ApplicationController.initialise() finished");
   // Cache the error messages node - contains references to each of the error message mapping documents
	AppController.m_errorMessages = AppController.buildErrorMessageDOMList(AppController.m_instance.m_config.m_errorMessagesNode);
}


AppController.prototype.getSecurityContext = function()
{
	return this.m_securityContext;
}


/**
 * Get the singleton instance of the AppController
 *
 * @return the instance of AppController
 */
AppController.getInstance = function()
{
	fc_assert(null != AppController.m_instance, "ApplicationController.getInstance() ApplicationController not initialised");

	return AppController.m_instance;
}

/**
 * Clean up memory and close AppController
 *
*/
AppController.shutdown = function()
{
    var ac = AppController.getInstance();
    
    ac.dispose();
    
    ac.shutdown();
}

/**
 * Clean up memory used by AppController before
 * exiting application.
 *
 */
AppController.prototype.dispose = function()
{
	// Dispose of the main form view.
    this.m_mainFormView.dispose();
    
    // Dispose of the app controllers view
    this.m_appView.dispose();
    
    // Clean instance member references
    this.m_styleManager.dispose();
    this.m_styleManager = null;
    
    this.m_securityContext = null;
    this.m_appRoles = null; // AppRoles and Config may require their own dispose methods
    this.m_config = null;
    
    this.m_modalCallbackList = null;
    this.m_errorMessages = null;
    this.m_sessionData = null;
    this.m_session = null;
    
    this.m_headerRight = null;
    this.m_headerTitle = null;
    this.m_headerLeft = null;
    
    this.m_currentForm = null;
    this.m_rootURL = null;
    
    /*
	this.m_perfMonitor = null;
	*/
	
}

/**
 * Get the root URL for the applicaton. This will be of the form:
 *   protocol://domain.name
 *
 * @return the root URL for the application
 */
AppController.prototype.getRootURL = function()
{
	return this.m_rootURL;
}


/**
 * Method returns reference to process performance monitor
 * stored in application controller. Note, again this
 * code's inclusion may be conditional as performance
 * monitoring will only occur during development.
 *
 * @return A reference to the instance of the performance monitor class
 *
 */
AppController.prototype.getPerformanceMonitor = function()
{
    return this.m_perfMonitor;
}


AppController.prototype.getDebugMode = function()
{
	return this.m_config.m_debugMode;
}

AppController.prototype.getWaitForConfigLoadingMode = function()
{
    return this.m_config.m_waitForConfigLoadingMode;
}

/**
 * Load the applications initial page
 * @private
 */
AppController.prototype._loadInitialPage = function()
{
   // Load the initial form
   var initialForm = this.m_config.getInitialPage();
   this.navigate(initialForm.getName());
}

/**
 * Retrieve name of initial page of application
 * @return String Defines name of initial form
 *
*/

AppController.prototype.getInitialFormName = function()
{
    return this.m_config.getInitialPage().getName();
}


/**
 * Register a callback which is called when the application enters
 * a modal dialog and requires application level gui components to be
 * disabled.
 *
 * @param callback The function to be called when a modal dialog is raised
 */
AppController.prototype.addModalCallback = function(callback)
{
	this.m_modalCallbackList.addCallback(callback);
}


/**
 * Cause the application to be in a modal state or not
 *
 * @param modal if true then the application enters a modal state
 *        if false then if exists the modal state
 */
AppController.prototype.modalState = function(modal)
{
	if(this.m_modal != modal)
	{
		this.m_modalCallbackList.invoke(modal);
		this.m_modal = modal;
	}
}


AppController.prototype.getFormController = function()
{
	return this.m_mainFormView.getFormController();
}


/**
 * This method performs a number of navigation actions including
 * navigating from one form to another, navigating from one form to another
 * and logginmg the current user off the application and exiting the application.
 *
 * Load a form public interface. Need to do this as an event (timeout)
 * because if the form processes a Navigate event on a form an invokes
 * the code in _loadForm syncronously then the FormController is disposed
 * halfway through processing the navigate event leading to all sorts of 
 * problems.
 *
 * @param name The name of the form to load
 * @param mode The mode of the navigation operation. This may be form, logout
 *              or exit.
 */ 
AppController.prototype.navigate = function(name, mode)
{
    if( mode == NavigateFormBusinessLifeCycle.EXIT)
    {
        // Setup delayed exit
        if(null == this.m_eventProcessingTimeout)
	    {
		    this.m_eventProcessingTimeout = setTimeout("AppController.getInstance()._exit()", 0);
		}
    }
    else
    {
        // Form navigation possibly including logout
        
	    // Record which form to navigate to.
	    this.m_navigateToForm = name;
	
	    // Check logoff status
	    if(mode == NavigateFormBusinessLifeCycle.LOGOUT)
	    {
	        this.m_userLoggingOut = true;
	    }
	    else
	    {
	        this.m_userLoggingOut = false;
	    }
	
	    if(null == this.m_eventProcessingTimeout)
	    {
		    this.m_eventProcessingTimeout = setTimeout("AppController.getInstance()._loadForm()", 0);
	    }
	}
}

/**
 * Set Security Context
 *
 * @param sessionKey - string
 * @param user - string
 */
AppController.prototype._setSecurityContext = function(sessionKey,user)
{
    var userObj = new User(user);
	this.m_securityContext = new SecurityContext(sessionKey, userObj, this) ;
	this._showUser();
} 

/**
 * Load a form in the main application frame given the form's name
 *
 */
AppController.prototype._loadForm = function()
{
    // Set a time on the appcontroller
    this.startLoad = new Date();
    
	// Reset the timeout
	this.m_eventProcessingTimeout = null;
	
	var name = this.m_navigateToForm;
	var userLoggingOut = this.m_userLoggingOut;
	
	// If we have an existing FormController running...
	var fc = this.m_mainFormView.getFormController();
	
	if(userLoggingOut)
	{
	    if(null != fc)
	    {
	        // If form dirty and navigate requested a warning to be raised the form
	        // security details will not have been cleared. Test for existence and
	        // clear if details exist.
	        
	        // Remove any existing roles in case we are logging in for a second time
	        var securityService = this.getSecurityServiceByName("getRoles");
	        var db = securityService.getDataBinding();
	        
	        var dataModel = fc.getDataModel();
	        
	        if(dataModel.exists(db))
	        {
	            dataModel.removeNode(db);
	        }
	        
	        // Clear down session data, including the ac stored session data
	        if(dataModel.exists( AppController.SESSION_DATA_XPATH ))
	        {
	            dataModel.removeNode(AppController.SESSION_DATA_XPATH);
	        }
	        
	        if(null != this.m_sessionData)
	        {
	            this.m_sessionData = null;
	        }
	    }
	    
	    // Replace user specific security context with anonymous user
	    this._setSecurityContext("Empty Session Key", "anonymous");
	}
	
	var form = this.m_config.getForm(name);
	// If called from loadInitialPage then there is no security context yet
	// RWW 10/08/05 Same with logout as context is reset. Consequently, the
	// new form must have no restricting roles
	if(null != form)
	{
		if(this.m_securityContext.hasAccess(form.getRoles()))
		{
			if(!userLoggingOut && (fc != null))
			{
			    // Take a copy of the session / app scoped data from the current form before we trash and load new form

			    // Before making copy of session / app scoped data remove any specified nodes
			    fc.removeXPathsBeforeFormNavigation();

				// If the current formcontroller has any session data (nodes under /ds/var/app)
				// then hang onto a copy of them so we can load them into the next form after
				// navigation
				var node = fc.getDataModel().getNode(AppController.SESSION_DATA_XPATH);
				this.m_sessionData = (null != node) ? node.cloneNode(true) : null;
			}
			
			this._showProgress();

			// Page URL
			var pageURL = this.getURLForForm(name);
		
			// Keep a reference to the current form
			this.m_currentForm = form;
			
			var styleSheets = this.getCSSDefinitionsForForm(name);
	
			// Load the view
			this.m_mainFormView.loadView(pageURL, styleSheets);
		}
		else
		{
		    // Enhancement 399. If defined, which it should be, use form
		    // title in preference to name.
		    var formTitle = form.getTitle();
		    
		    // Form title should not be null, but it might be blank
		    if(null == formTitle || formTitle == "")
		    {
		        formTitle = name;
		    }
		    
			var msg = "You do not have the appropriate role to access form " + formTitle;

			if(fc != null && this.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
			{
				// Raise standard OK dialog box
				fc.showAlert(msg);
	        }
			else
	    	{
	        	// Raise browser OK dialog box
	        	alert(msg);
	        }
		}
	}
	else
	{
		if(AppController.m_logger.isError()) AppController.m_logger.error("AppController._loadForm() form not found: " + this.m_navigateToForm);
	}
	
	// Reset the navigateToForm and userLoggingOut instance members
	this.m_navigateToForm = null;
	this.m_userLoggingOut = null;
}


AppController.prototype._formReady = function()
{
	// When FormController is completely initialised lower the status bar again.
	this._hideProgress();
}


/**
 * Handler which is called when the main form view HTMLFrameFormViewManager
 * has successfully loaded the view. This will only be invoked when the 
 * HTMLFrameFormViewManager has loaded the HTML for the page and the Framework.js
 * is also completely loaded.
 * 
 * @private
 */
AppController.prototype._loadFormComplete = function()
{   
    // Now that the form is loaded and framework in place - load the precompile
    // before starting the form controller.
    this.loadPrecompile();
}

/*
 * Check the server to see if some precompile exist for the current page.
 * If it does then load it into the loading iframe.
 *
 * only attempt to load a forms precompile if it 
 * has not been explicitly set to no
 *
 * NB currently does not work for subforms (the precompile is just loaded
 * into the main form view, where it does nothing as the form is already
 * initialised.
 */
AppController.prototype.loadPrecompile = function()
{   
    // static means the project is including the precompile as a method call within their screen.
	if( top.AppController.getInstance().m_config.getPrecompileEnabled() && 
	(this.m_currentForm.getPrecompile() != "no" && this.m_currentForm.getPrecompile() != "static") ){
	    
	    // this line should never be called if the application links preompile statically.
	    Logging.logMessage("Creating and loading Precompile for form", Logging.LOGGING_LEVEL_INFO);
	    
	    // Construct the url of the precompiled page.	    
    	var url = this.m_rootURL + this.m_config.getAppBaseURL() + "/precompile/" 
        	      + this.m_currentForm.getName() + ".js";
        
	    var async = false; // this can not be async, we need this loaded in before the reset of the JavaScript is processed
    
    	if(null == this.m_httpRequest)
	    {
    	    this.m_httpRequest = new XMLHttpServiceRequest();
	    }
    
    	this.m_httpRequest.initialise(this,url,async,null,handlePrecompileReadyStateChange);
    
	    this.m_httpRequest.sendGET("loadPrecompiled");
    }
	else{
		top.AppController.getInstance()._loadPrecompileComplete(); 
	}
}

function handlePrecompileReadyStateChange(handlerArgs)
{
    // Define reference to application controller
    var ac = top.AppController.getInstance();
    
    // Check status of request
    var httpRequest = ac.m_httpRequest;
    
    var request = httpRequest.getRequest();
    
    if(request.readyState == 4)
	{
	    if(request.status == 200) 
	    {
            // Found file - load into iframe
            var javascript = request.responseText;
            ac.m_mainFormView.m_frame.m_frame.contentWindow.eval(javascript);
	    }
	    
	    // Clean up request object
	    ac.m_httpRequest.dispose();
	    ac.m_httpRequest = null;
	    
        // Continue processing whether or not file returned.
        ac._loadPrecompileComplete(); 
	} 
}

/* 
 * Finalise loading the form including starting the FormController
*/
AppController.prototype._loadPrecompileComplete = function()
{   
	// Start the form controller on the page
	this.m_mainFormView._startFormController(this.getSessionDataFromPreviousForm(), null, this.m_currentForm.isFUnit());
	
	// Set the title
	this.m_headerTitle.innerHTML = this.m_currentForm.getTitle();

	// Hide the progress bar - moved to FormController.referenceDataLoaded
	//this._hideProgress();

	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppController.loadContentComplete() callback function invoked by the m_contenFrame.onload handler");
	//alert("AppController.loadContentComplete() callback function invoked by the m_contenFrame.onload handler");
}


/**
 * Exit the application
 *
*/
AppController.prototype._exit = function()
{
    this.m_eventProcessingTimeout = null;
    
	AppController.shutdown();
}

/* 
 * Get the configuration for the current form.
 */
AppController.prototype.getCurrentForm = function()
{
	return this.m_currentForm;
}

/* 
 * Let the AppController know what the current form is.
 */
AppController.prototype.setCurrentFormByName = function(formName)
{
	this.m_currentForm = this.m_config.getForm(formName);
}


AppController.prototype.getURLForForm = function(name)
{
	var form = this.m_config.getForm(name);

	var pageRelativeURL = form.getPageURL();
	
	var pageURL = this.m_config.getAppBaseURL();
	
	// If page URL starts with a / then ignore forms element BaseURL
	if(pageRelativeURL.indexOf('/') != 0)
	{
		pageURL += this.m_config.getFormsBaseURL() + '/';
	}

	pageURL += pageRelativeURL;

	return pageURL;
}


AppController.prototype.getURLForFrameworkSubForm = function(pageRelativeURL)
{
	var pageURL = this.m_config.getAppBaseURL();
	
	pageURL += pageRelativeURL;

	return pageURL;
}


AppController.prototype.getCSSDefinitionsForForm = function(name)
{
	var form = this.m_config.getForm(name);
	var ss1 = this.m_config.getCommonCSS();
	var ss2 = form.getFormCSS();
	
	var ss = [];
	
	if(null != ss1)
	{
		ss = ss.concat(ss1);
	}
	
	if(null != ss2)
	{
		ss = ss.concat(ss2);
	}
	
	return ss;
}


/*
 * Returns an array of nodes relative to /ds/var which should be 
 * used as initial data for a new form (usually after a navigate event)
 * Current implementation returns /ds/var/app nodeset.
 */
AppController.prototype.getSessionDataFromPreviousForm = function()
{
	if(this.m_sessionData)
	{
		var returnArray = new Array();
		returnArray.push(this.m_sessionData);
		return returnArray;
	}
	else
	{
		return null;
	}
}


AppController.prototype.getStyleManager = function()
{
	return this.m_styleManager;
}


AppController.prototype.shutdown = function()
{
	window.close();
}


AppController.prototype.getSecurityServices = function()
{
	return this.m_config.getSecurityServices();
}


AppController.prototype.getSecurityServiceByName = function(name)
{
	return this.m_config.getSecurityServiceByName(name);
}


AppController.prototype.getAppRoles = function()
{
	return this.m_appRoles;
}

AppController.prototype.setRefDataRootNodeForCurrentForm = function(serviceName, rootNodeName)
{
	this.m_refDataCache[serviceName] = rootNodeName;
}

AppController.prototype.getRefDataRootNodeForCurrentForm = function(serviceName)
{
	return this.m_refDataCache[serviceName];
}


/**
 * Logs the current user off
 *
 */
 AppController.prototype.logoff = function(formName, raiseWarningIfDOMDirty)
{
    if(raiseWarningIfDOMDirty != true)
	{
		raiseWarningIfDOMDirty = false;
	}
	
	var fc = this.m_mainFormView.getFormController();
	
	// If form data will not be saved if form dirty clear
	// security details
	
	if(!raiseWarningIfDOMDirty)
	{
	    // Remove any existing roles in case we are logging in for a second time
	    var securityService = this.getSecurityServiceByName("getRoles");
	    var db = securityService.getDataBinding();
	    fc.getDataModel().removeNode(db);
	    // Clear down session data, including the ac stored session data 
	    fc.getDataModel().removeNode(AppController.SESSION_DATA_XPATH);
	    this.m_sessionData = null;
	}

	// Optionally navigate to another screen, probably should be the login page
	if(formName == null)
	{
		formName = this.getInitialFormName();
	}
	
	// We can't call Services.navigate, or Services.dispatchEvent because they assume the context
	// of the IFrame where FormController.getInstance() is not null
	
    // Dispatch navigate event
	var adaptor = fc.getFormAdaptor();
	
	// Define event details
	var details = {
		formName: formName,
		raiseWarningIfDOMDirty: raiseWarningIfDOMDirty,

		// Add flag indicating that navigate is part of logout procedure
		mode: NavigateFormBusinessLifeCycle.LOGOUT
	};

	fc.dispatchBusinessLifeCycleEvent(adaptor.getId(), BusinessLifeCycleEvents.EVENT_NAVIGATE, details);
}

/**
 * Closes application
 *
*/
AppController.prototype.exit = function()
{
	// Get the FormController for the main view
    var fc = this.m_mainFormView.getFormController();
    
    // Get the form adaptor for the main view
    var adaptor = fc.getFormAdaptor();
    
    // Create detail object for navigate. This object has no formName
    // and the mode is set to "exit"
    var details = {
    	mode: NavigateFormBusinessLifeCycle.EXIT,

		// If we are not using form lifecycles then don't use the form dirty warning functionality
    	raiseWarningIfDOMDirty: (adaptor._getState() != null)
    };
    
    // Dispatch the exit navigation event to the form adaptor on the main form view
    fc.dispatchBusinessLifeCycleEvent(adaptor.getId(), BusinessLifeCycleEvents.EVENT_NAVIGATE, details);
     
}


AppController.prototype.getServiceRequestCount = function()
{
	return this.m_serviceRequestCount;
}

/**
 * Show the applications progress indicator
 *
 * @private
 */
AppController.prototype._showProgress = function()
{
	this.m_requestCount++;
	
	// If this is the first request raise the progress dialog
	if (1 == this.m_requestCount)
	{
		document.body.style.cursor = 'wait';
		this.m_requestProgress = 0;
		
		var progress = document.getElementById("progress");
		
		if(null != progress)
		{   
			progress.style.visibility = "visible";
			
			/*
			if(window.attachEvent)
		    {
		        // In IE browser assign focus to progress div
		        progress.focus();
		    }
		    */
		    
			this.m_progressBarVisible = true;
			this.m_requestTimeout = window.setTimeout("AppController._updateProgress()", 100);
		}
	}
}

/**
 * Hide the applications progress indicator
 *
 * @param fc In some cases it may be desirable to re-assert Internet
 *           Explorer's focus on the current focussed adaptor. This is
 *           usually after a service has been called as the user may
 *           assign focus to the progress bar by clicking the mouse
 *           button whilst the progress bar is displayed. Therefore,
 *           if this parameter contains a reference to an instance of a
 *           FormController the method will apply focus to the current
 *           focussed adaptor as recorded by the form's tabbing manager.
 *
 * @private
 */
AppController.prototype._hideProgress = function(fc)
{
	this.m_requestCount--;
	if (0 >= this.m_requestCount)
	{
		document.body.style.cursor = 'default';
		this.m_requestCount = 0;
		if(null != this.m_requestTimeout) window.clearTimeout(this.m_requestTimeout);
		
		var progress = document.getElementById("progress");
		
		if(null != progress)
		{
		    
		    if(window.attachEvent)
		    {
		        // Reset IE browser focus on current focussed adaptor
		        
		        if(null != fc)
		        {
		            var tm = fc.getTabbingManager();
		            
		            if(null != tm)
		            {
		                tm.resetBrowserFocusOnCurrentFocussedAdaptor();
		                
		                tm = null;
		            }
		        }
		    }
		    
			progress.style.visibility = "hidden";
			this.m_progressBarVisible = false;
		}
	}
	
	// Clear reference to FormController
    fc = null;
}

/**
 * Update the applications progress indicator
 *
 * @private
 */
AppController._updateProgress = function()
{
	var ac = AppController.getInstance();
	
	var progressIFrameElement = document.getElementById("progressFrame");
	if(null != progressIFrameElement)
	{
		var frameDoc = getIframeDocument( progressIFrameElement );
		if(null != frameDoc)
		{
			var bar = frameDoc.getElementById("progress_bar");
			if(null != bar)
			{
				ac.m_requestProgress++;
				if (ac.m_requestProgress > 100)
				{
					ac.m_requestProgress = 0;
				}
				bar.style.width = ac.m_requestProgress + "%";
			}
		}
	}	
	ac.m_requestTimeout = window.setTimeout("AppController._updateProgress()", 100);
}

AppController.prototype.handlePageError = function()
{
	var fc = this.m_mainFormView.getFormController();
	var msg = "Page reported an error";

	if(fc != null && this.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
	{
        var callbackFunction = function(userResponse)
        {
        	var ac = Services.getAppController();
			if(ac != null) ac._loadInitialPage();
        }
        
		// Raise standard OK dialog box
		fc.showAlert(msg, callbackFunction);
    }
	else
	{
		// Raise browser OK dialog box
		alert(msg);
		this._loadInitialPage();
	}
}


/**
 * Display the user name
 *
 * @private
 */
AppController.prototype._showUser = function()
{
	var userName = null;

	if(null != this.m_securityContext && this.m_securityContext.getCurrentUser().getUserName() != "anonymous") {
		var user = this.m_securityContext.getCurrentUser();
		userName = user.getUserName();
	}
	else
	{
		userName = "<i>Not logged in</i>";
	}
	this.m_headerLeft.innerHTML = "<b>User: </b>" + userName;
}


/**
 * Display the current date
 *
 * @private
 */
AppController.prototype._showDate = function()
{
	// Need to get currentDate from the server really...
	var t = new Date();
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var month = months[t.getMonth()];
	var day = t.getDate();
	if(t.getDate() < 10) day = "0" + t.getDate();
	
	this.m_headerRight.innerHTML = "<b>Date: </b>" + day + "-" + month + "-" + t.getFullYear();
}



/**
 * Gets the url for the js file that contains the source code for a custom component
 *
 * @return an array of GUIAdaptorRegistration objects
 * @throws AppConfigError if a configuration error occured.
 * @private
 */
AppController.prototype.getExternalComponents = function()
{
	if(AppController.m_logger.isInfo()) AppController.m_logger.info("AppController.getExternalComponents()");
	var result = new Array();
	if(null != this.m_config.m_externalComponentsNode)
	{
		var nodes = this.m_config.m_externalComponentsNode.selectNodes('externalComponent');
		if(AppController.m_logger.isInfo()) AppController.m_logger.info("AppController.getExternalComponents() nodes.length = " + nodes.length);
		for(var i=0;i<nodes.length;i++)
		{
			var c = new ExternalComponentConfig(nodes[i]);
			result[i] = c;
			if(AppController.m_logger.isInfo()) AppController.m_logger.info("AppController.getExternalComponents() found external component: " + c);
		}
	}
	return result;
}

/**
* Build an array of error message nodes
*
**/
AppController.buildErrorMessageDOMList = function(node)
{
	if(AppController.m_logger.isInfo()) AppController.m_logger.info("AppController.getErrorMessages()");
	var messageFiles = new Array();
	
	var nodes = node.selectNodes('file');
	if(AppController.m_logger.isInfo()) AppController.m_logger.info("AppController.getErrorMessages() nodes.length = "+nodes.length);
	var filePathNode=null;
	var dom=null;
	
	for(var i=0;i<nodes.length;i++)
	{
		filePathNode = nodes[i].getAttribute('path');
		if(null == filePathNode)
		{
			if(AppController.m_logger.isError()) AppController.m_logger.error("No path attribute found for error message file node from app configuration");
		}
		//dom = XML.createDOM(null, null, null);
		//if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppConfig():buildErrorMessageDOMList() created empty dom for error message node "+i);
		//dom.load(path);
		
		// Load error message DOM using new mechanism
		dom = Services.loadDOMFromURL( filePathNode );
		
		if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig():buildErrorMessageDOMList() loaded dom for URL: " + path);
		messageFiles[messageFiles.length]=dom;
	}
	return messageFiles;
}



/**
*
*	Return an error message for a given error code
*	@param the error code to look up
*/
AppController.prototype.getErrorMsgForCode = function(errorId)
{
	var dom = null;
	var messageNode = null;
	var tempErrorNode = null;
	var url="";
	for(var i=0;i<AppController.m_errorMessages.length&&null==messageNode;i++)
	{
		dom = AppController.m_errorMessages[i];
		url = "/errors/error[@id='"+errorId+"']";
		messageNode = dom.selectSingleNode(url);
		//message = dom.selectSingleNode(errorId);
	}
	if(null==messageNode)
	{
		if(AppController.m_logger.isWarn()) AppController.m_logger.warn("AppController.getErrorMsgForNode() No Error Message found for code: "+errorId);
	}
	return (null == messageNode) ? "":XML.getNodeTextContent(messageNode);
}

/**
 * Return array of menu panel items associated with menu panel
 *
*/
AppController.prototype.getMenuPanelItems = function( menuPanelXPath )
{
    return this.m_config.getMenuPanelItems( menuPanelXPath );
}

/**
 * Method returns name of project if defined in application configuration
 * XML file. If no project name is defined an empty string will be returned.
 *
*/
AppController.prototype.getProjectName = function()
{
    return this.m_config.getProjectName();
}

/**
 * Method returns name of dialog style if defined in application configuration
 * XML file. If not defined the dialog style defaults to Framework standard
 * dialogs.
 *
*/
AppController.prototype.getDialogStyle = function()
{
    return this.m_config.getDialogStyle();
}

/**
 * Method returns value of property validateWhitespaceOnlyEntryActive
 * defined in applicationconfig.xml. This property defines a boolean
 * value that will be "true" unless the property in the XML file is
 * set to the string "false".
 *
*/
AppController.prototype.getValidateWhitespaceOnlyEntryActive = function()
{
    return this.m_config.getValidateWhitespaceOnlyEntryActive();
}

/**
 * Method returns an array of exception handler objects if defined in application
 * configuration XML file. If not defined the array defaults to Framework
 * default exception handler objects. The Framework default exception handler
 * show a message in an OK dialog and then logs the user out when the OK button
 * is clicked.
 *
 * An object has the following properties:
 *     useDefault - boolean flag that determines whether the Framework default
 *                  or application supplied exception handler is used
 *     message    - string that defines the message that is shown in the OK
 *                  dialog. This is only applicable if useDefault is true
*/
AppController.prototype.getExceptionHandlers = function()
{
    return this.m_config.getExceptionHandlers();
}

/**
 * Method returns HTTP connection error retry limit as defined
 * in applicationConfig.xml file.
 *
 * @return Returns retry limit, if defined, or null.
 *
*/
AppController.prototype.getHttpConnectionErrorRetryLimit = function()
{
    return this.m_config.getHttpConnectionErrorRetryLimit();
}

/**
 * Method returns Http connection error retry response details defined
 * in applicationConfig.xml file.
 *
 * @return If defined, the Http connection error retry response details
 *         are returned as properties on an object. If not defined null
 *         is returned.
 *
*/
AppController.prototype.getHttpConnectionErrorRetryResponses = function()
{
    return this.m_config.getHttpConnectionErrorRetryResponses();
}

/**
 * Method returns boolean flag indicating whether or not the progress bar,
 * displayed whilst loading froms and invoking serevices, is currently
 * visible.
 *
*/
AppController.prototype.isProgressBarVisible = function()
{
    return this.m_progressBarVisible == true;
}

/**
 * Class which represents the application configuration
 *
 * @param configURL the url to the application configuration file
 * @private
 * @constructor
 */
function ExternalComponentConfig(node)
{
	var classNameNode = node.getAttribute('className');
	if(null == classNameNode)
	{
		if(AppController.m_logger.isError()) AppController.m_logger.error("No class name attribute found for external component node from app configuration");
		//throw new AppConfigError("No class name attribute found for external component node from app configuration");
	}
	this.m_className = classNameNode;
	
	var factoryMethodNode = node.getAttribute('factoryMethod');
	if(null == factoryMethodNode)
	{
		if(AppController.m_logger.isError()) AppController.m_logger.error("No factory method attribute found for external component node from app configuration");
		//throw new AppConfigError("No factory method attribute found for external component node from app configuration");
	}
	this.m_factoryMethod = factoryMethodNode
	
	var cssClassNameNode = node.getAttribute('cssClassName');
	if(null == cssClassNameNode)
	{
		if(AppController.m_logger.isError()) AppController.m_logger.error("No cssClassName attribute found for external component node from app configuration");
		//throw new AppConfigError("No factory method attribute found for external component node from app configuration");
	}
	this.m_cssClassName = cssClassNameNode;
}

ExternalComponentConfig.prototype.getClassName = function()
{
	return this.m_className;
}
ExternalComponentConfig.prototype.getCSSClassName = function()
{
	return this.m_cssClassName;
}
ExternalComponentConfig.prototype.getFactoryMethod = function()
{
	return this.m_factoryMethod;
}

ExternalComponentConfig.prototype.toString = function()
{
	return "[ExternalComponentConfig className: " + this.m_className + ", factoryMethod: " + this.m_factoryMethod + ", cssClassName:" + this.m_cssClassName + "]"
}


function AppRole(name, parent)
{
	this.m_name = name;
	this.m_parent = parent;
}
AppRole.prototype.getName = function()
{
	return this.m_name;
}
AppRole.prototype.getParent = function()
{
	return this.m_parent;
}

/**
 * Class which represents the list of system roles
 *
 * @param rolesURL the url to the roles configuration file
 * @private
 * @constructor
 */
function AppRoles(rolesURL)
{
	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppRoles("+rolesURL+") constructor starts");

	//var dom = XML.createDOM(null, null, null);
	//if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppRoles() created empty dom");
	
	// Load DOM using new mechanism
	var dom = Services.loadDOMFromURL(rolesURL);
	
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppRoles() loading roles configuration: " + rolesURL);
	
	this.m_rolesConfig = dom;
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig() storing dom (<font size=1>"+XML.showDom(this.m_rolesConfig)+"</font>)as m_rolesConfig of this AppRoles instance");

	// Cache the document root node - resolving things relative to this makes the XPaths shorter.
	this.m_rolesDocNode = dom.selectSingleNode('/Roles');
	if(null == this.m_rolesDocNode)
	{
		throw new AppConfigError("No roles node specified for the application");
	}

	// Cache the forms node - resolve form requests relative to this
	this.m_roleNodes = this.m_rolesDocNode.selectNodes('./Role');
	
	this.m_roles = new Array();
	var roleNodes = this.m_roleNodes;
	var roleNodesLength = roleNodes.length;
	
	for(var i=0; i<roleNodesLength; i++)
	{
		var roleNode = roleNodes[i];
		// We are not interested in the ID in the client, it's only used on the server side
		//var roleId = XML.getNodeTextContent(roleNode.selectSingleNode('./@id'));
		var name = roleNode.getAttribute('name');
		var parent = null;
		var parentId = roleNode.getAttribute('parent')
		if(parentId != null)
		{
			var parentNode = this.m_rolesDocNode.selectSingleNode('./Role[./@id = \'' + parentId + '\']');
			parent = parentNode.getAttribute('name');
		}
		this.m_roles[name] = new AppRole(name, parent);
	}
}

AppRoles.prototype.getRoles = function()
{
	return this.m_roles;
}

AppRoles.prototype.getRolesNode = function()
{
	return this.m_rolesDocNode;
}

AppRoles.prototype.getChildrenOfRole = function(roleName)
{
	var children = new Array();
	children = this.getChildren(roleName, children);
	return children;
}

AppRoles.prototype.getChildren = function(roleName, children)
{
	var roles = this.m_roles;
	for(var i in roles)
	{
		var role = roles[i];
		var parent = role.getParent();
		if(parent == roleName)
		{
			children[children] = i;
			this.getChildren(i, children);
		}
	}
	return children;
}

AppRoles.prototype.getParentsOfRole = function(roleName)
{
	var parents = new Array();
	parents = this.getParents(roleName, parents);
	return parents;
}

AppRoles.prototype.getParents = function(roleName, parents)
{
	var role = this.m_roles[roleName];
	if(role != null)
	{
		var parent = role.getParent();
		if(parent != null)
		{
			parents[parents.length] = parent;
			this.getParents(parent, parents);
		}
	}
	return parents;
}

/**
 * Class which represents the application configuration
 *
 * @param configURL the url to the application configuration file
 * @private
 * @constructor
 */
function AppConfig(configURL)
{
	if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppConfig("+configURL+") constructor starts");
	
	// Map containing all loaded forms
	this.m_loadedForms = new Array();

	//var dom = XML.createDOM(null, null, null);
	//if(AppController.m_logger.isTrace()) AppController.m_logger.trace("AppConfig() created empty dom");

	// Load DOM using new mechanism
	var dom = Services.loadDOMFromURL(configURL);
	
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig() loading application configuration: " + configURL);
	
	this.m_config = dom;
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig() storing dom (<font size=1>"+XML.showDom(this.m_config)+"</font>)as m_config of this AppConfig instance");
	
	// Cache the document root node - resolving things relative to this makes the XPaths shorter.
	this.m_configDocNode = dom.selectSingleNode('/application-config');
	
//	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("this.m_configDocNode: " + displayObjectProperties(this.m_configDocNode));
	fc_assert ( (null != this.m_configDocNode), "Problem using Application Configuration - no /application-config found.");

	// Cache whether we are running in development / debug mode, which removes the runtime exception catch all
	var debugNode = this.m_configDocNode.getAttribute('debug');
	this.m_debugMode = ((null != debugNode) && (debugNode == "true"));
	
	// Cache whether or not application should wait for associated javascript configuration
	// file to be loaded before initialising FormController for HTML page.
	var waitForConfigLoadingNode = this.m_configDocNode.getAttribute('waitForConfigLoading');
	
	this.m_waitForConfigLoadingMode = true;
	
	if((null != waitForConfigLoadingNode) && (waitForConfigLoadingNode == "false"))
	{
	    this.m_waitForConfigLoadingMode = false;
	}
	
	// Cache the forms node - resolve form requests relative to this
	this.m_formsNode = this.m_configDocNode.selectSingleNode('./forms');
	
	// Cache the external components node - used to register with the GUIAdaptorFactory
	this.m_externalComponentsNode = this.m_configDocNode.selectSingleNode('./externalComponents');
	
	// Cache the error messages node
	this.m_errorMessagesNode = this.m_configDocNode.selectSingleNode('./error_msg_files');
	
	// Cache the services node
	this.m_servicesNode = this.m_configDocNode.selectSingleNode('services');
	if(null == this.m_servicesNode)
	{
		throw new AppConfigError("No services node specified for the application");
	}
	
	// Get the application's services base URL
	var servicesBaseURLNode = this.m_servicesNode.getAttribute('baseURL');
	if(null == servicesBaseURLNode)
	{
		throw new AppConfigError("No services baseURL specified for the application");
	}
	this.m_servicesBaseURL = servicesBaseURLNode;
	if ( null == this.m_servicesBaseURL)
	{
		this.m_servicesBaseURL = "" ;
	}

	// Get the application's services security port (if defined)
	var servicesSecurePortNode = this.m_servicesNode.getAttribute('securePort');
	if(null == servicesSecurePortNode)
	{
			this.m_servicesSecurePort = "" ;
	}
	else
	{
		this.m_servicesSecurePort = servicesSecurePortNode;
		if ( null == this.m_servicesSecurePort)
		{
			this.m_servicesSecurePort = "" ;
		}
	}
	
	// Get the application's services common parameters - used to pass the court ID and 
	// businessProcessId without having to define it on every service
	var commonParametersNode = this.m_servicesNode.selectSingleNode('./commonParameters');
	if(commonParametersNode != null)
	{
		this.m_commonParameters = AppConfig.getParametersFromNode(commonParametersNode);
	}
	else
	{
		this.m_commonParameters = new Array();
	}
	
	// Defect 1046. Define reference to node containing HTTP connection
	// error retry response details.
	this.m_httpConnectionErrorRetryResponseNode = this.m_servicesNode.selectSingleNode( './httpConnectionErrorRetryResponse' );

	// Get the application base URL
	var appBaseURLNode = this.m_configDocNode.getAttribute('baseURL');
	if (null == appBaseURLNode)
	{
		throw new AppConfigError("No application baseURL specified for the application");
	}
	this.m_appBaseURL = appBaseURLNode;

	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("Application baseURL set to: " + this.m_appBaseURL);

	// Get the wordprocessing URL prefix
	// defaults to the same as the appBaseURLNode baseURL with '_' underscore
	var editorUrlNode = this.m_configDocNode.getAttribute('editorURL');
	if (null == editorUrlNode)
	{
    	this.m_editorURL	= "/";
	}
	else
	{
    	this.m_editorURL = editorUrlNode;
    }
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("Application editor prefix set to: " + this.m_editorURL);


    // retrieve the spell-check elements
    var spellCheckNode = this.m_configDocNode.selectSingleNode('./spell-check');    
    this.m_spellCheckURL = "/jspelliframe/JSpellIFrame.jsp";
    this.m_spellCheckPopup = "/jspelliframe/jspellpopup.html";
    if (spellCheckNode != null)
    {
        var courtXPathNode = spellCheckNode.selectSingleNode('./court-xpath');
        if (courtXPathNode != null)
        {
            this.m_courtXPath = XML.getNodeTextContent(courtXPathNode);
        }
    }
    if (spellCheckNode != null)
    {
        var dictionaryLabelNode = spellCheckNode.selectSingleNode('./dictionary-label');
        if (dictionaryLabelNode != null)
        {
            this.m_dictionaryLabel = XML.getNodeTextContent(dictionaryLabelNode);
        }
    }
    if (spellCheckNode != null)
    {
        var urlNode = spellCheckNode.selectSingleNode('./url');
        if (urlNode != null)
        {
            this.m_spellCheckURL = XML.getNodeTextContent(urlNode);
        }
    }
    if (spellCheckNode != null)
    {
        var popupNode = spellCheckNode.selectSingleNode('./popup-url');
        if (popupNode != null)
        {
            this.m_spellCheckPopup = XML.getNodeTextContent(popupNode);
        }
    }


	// Get the forms base URL
	var formsBaseURLNode = this.m_formsNode.getAttribute('baseURL');
	if (null == formsBaseURLNode)
	{
		throw new AppConfigError("No forms baseURL specified for the application");
	}	
	this.m_formsBaseURL = formsBaseURLNode;
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("Forms baseURL set to: " + this.m_formsBaseURL);
	
	// Cache menu bar node
	this.m_menuBarNode = this.m_configDocNode.selectSingleNode('./menuBar');
	if(null == this.m_menuBarNode)
	{
	    throw new AppConfigError("No navigation menu bar configuration specified for the application");
	}
	
	// Cache project details node
	this.m_projectNode = this.m_configDocNode.selectSingleNode('./project');
	
	// Initially set project name instance member to be null
	this.m_projectName = null; 

	// Initially set dialog style instance member to be null
	this.m_dialogStyle = null;
	
	// Initially set whitespace only entry validation active member to null.
	this.m_validateWhitespaceOnlyEntryActive = null;
	
	// Initially set exception handlers instance member to be null
	this.m_exceptionHandlers = null;

	// Create application wide CSS definitions applied to all forms
	// - Automatically add framework style sheet (fw_*) which is both
	// browser and colourscheme dependant
	
	var ac = Services.getAppController();	
	var baseStyleSheetURL = this.m_appBaseURL + this.m_formsBaseURL;
	this.m_appCSS = AppCSS.createFromChildren(this.m_formsNode,baseStyleSheetURL);

	// Cache whether we want loading of precompile files enabled for this project
	var precompileNode = this.m_configDocNode.getAttribute('enablePrecompile');
	this.m_precompileEnabled = ((null == precompileNode) || (precompileNode != "no"));

}


/**
 * Define class static constants
 */

/** 
 * List of allowed menu function component types. Note, that only one menu entry
 * is allowed for each component type.
 */
AppConfig.NAVIGATION_MENU_FUNCTIONAL_COMPONENT_TYPES = [ "help", "back", "logout", "exit" ];

/**
 * Dialog styles allowed in application configuration project's tag dialog-style attribute
 */
AppConfig.FRAMEWORK_DIALOG_STYLE = "framework";
AppConfig.BROWSER_DIALOG_STYLE = "browser";


AppConfig.prototype.getCommonCSS = function()
{
	return this.m_appCSS;
}


AppConfig.prototype.getCommonParameters = function()
{
	return this.m_commonParameters;
}


/**
 * Get the initial page for the application
 *
 * @private
 */
AppConfig.prototype.getInitialPage = function()
{
	var initialFormName = this.m_configDocNode.getAttribute('initialForm');
	if (null == initialFormName)
	{
		throw new AppConfigError("No initial form specified for applicaiton");
	}
	
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig.getInitialPage(): initialForm name: " + initialFormName);
	
	// Return the initial form
	return this.getForm(initialFormName);
}


/**
 * Get the default stylesheet name
 *
 * @private
 */
AppConfig.prototype.getDefaultStyleSheetName = function()
{
	var defaultStyleSheetNode = this.m_configDocNode.selectSingleNode('./stylesheets/@default');
	var defaultStyleSheetName = (null == defaultStyleSheetNode) ? null : XML.getNodeTextContent(defaultStyleSheetNode);
	if(AppController.m_logger.isDebug()) AppController.m_logger.debug("AppConfig.getDefaultStyleSheetName(): defaultStyleSheetName: " + defaultStyleSheetName);
	
	return defaultStyleSheetName;
}


AppConfig.prototype.getAvailableStyleSheets = function()
{
	var styleSheetNodes = this.m_configDocNode.selectNodes("./stylesheets/stylesheet");
	var styleSheets = new Array(styleSheetNodes.length);
	
	for(var i = 0, l = styleSheetNodes.length; i < l; i++)
	{
		styleSheets[i] = new AppStyleSheet(styleSheetNodes[i]);
	}
	
	return styleSheets;
}


/**
 * Get the applications base url
 *
 * @returns the base URL for the application
 * @private
 */
AppConfig.prototype.getAppBaseURL = function()
{
	return this.m_appBaseURL;
}

AppConfig.prototype.getEditorURL = function()
{    
    return this.m_editorURL;
}

/**
 * Get the base URL for the applications screens
 *
 * @returns the base URL for the application's screens
 * @private
 */
AppConfig.prototype.getFormsBaseURL = function()
{
	return this.m_formsBaseURL;
}


/**
 * Gets the url for the page that represents the form
 *
 * @param formName the name of the form to get
 * @return the AppForm class representing the Form
 * @throws AppConfigError if a configuration error occured.
 * @private
 */
AppConfig.prototype.getForm = function(formName)
{
	fc_assert(null != formName, "AppConfig.getFormURL(): null formName argument");

	var form = this.m_loadedForms[formName];
	if (null == form)
	{	
		var formNode = this.m_formsNode.selectSingleNode('form[@name = "' + formName + '"]');
		
		if(null == formNode)
		{
			throw new AppConfigError("Form with name '" + formName + "' not found in configuration file");
		}
		
		form = new AppForm(formNode, this);
		// add into cache
		this.m_loadedForms[formName] = form;
	}
	
	return form;
}


/**
 * Get the base URL for the applications services
 *
 * @returns the base URL for the applications service's
 * @private
 */
AppConfig.prototype.getServiceBaseURL = function()
{
	return this.m_servicesBaseURL;
}

/**
 * Get whether precompile is enabled for this application
 *
 * @returns whether precompile is enabled for this application
 * @private
 */
AppConfig.prototype.getPrecompileEnabled = function()
{
	return this.m_precompileEnabled;
}

AppConfig.prototype.setServiceBaseURL = function(serviceBaseURL)
{
	this.m_servicesBaseURL = serviceBaseURL;
}

AppConfig.prototype.getSecurityServiceByName = function(name)
{
	if(this.m_securityServicesByName == null)
	{
		this.m_securityServicesByName = new Array();
	}
	if(this.m_securityServicesByName[name] != null)
	{
		return this.m_securityServicesByName[name];
	}
	var sessionSecurityNode = this.m_servicesNode.selectSingleNode("./service[./@security = \'true\' and ./@name = \'" + name + "\']");
	if(sessionSecurityNode != null)
	{
		this.m_securityServicesByName[name] = new AppService(sessionSecurityNode);
		return this.m_securityServicesByName[name];
	}
	return null;
}


/**
 * Get the list of services called by the application to initialise the session data, called after a successful login
 * to load the default court and list of roles for that court.
 *
 * @param formName the name of the form
 * @param mappingName the name of the service mapping
 * @return the AppService object which represents the service
 * @private
 */
AppConfig.prototype.getSecurityServices = function()
{
	if(this.m_securityServices == null)
	{
		var sessionSecurityNodes = this.m_servicesNode.selectNodes("./service[@security = 'true']");
	
		this.m_securityServices = new Array();
		for(var i=0; i<sessionSecurityNodes.length; i++)
		{
			this.m_securityServices[this.m_securityServices.length] = new AppService(sessionSecurityNodes[i]);
		}
		
		this.m_securityServices.sort(AppConfig._sortSecurityServices);
		
	}
	return this.m_securityServices;
}


/**
 * Utility comparator function to help sort an array of FormControllerListeners, this is
 * used to order the nodes so we can test for and remove duplicates.
 * @param a FormControllerListener
 * @param b FormControllerListener
 */
AppConfig._sortSecurityServices = function(a, b)
{
	// what about the event type?
	if(a.getOrder() > b.getOrder())
	{
		return 1;
	}
	else if(a.getOrder() == b.getOrder())
	{
		return 0;
	}
	return -1;
}

/**
 * Get the service which is identified by a mapping within a form definition
 *
 * @param formName the name of the form
 * @param mappingName the name of the service mapping
 * @return the AppService object which represents the service - null if one is not found.
 * @private
 */
AppConfig.prototype.getServiceForFormMapping = function(formName, mappingName)
{
	var form = this.getForm(formName);
	var serviceName = form.getServiceNameForMapping(mappingName);
	var serviceNode = form.getLocalServiceNode(serviceName);
	
	// If there is no local service definition then look for a global one
	if(null == serviceNode)
	{
		serviceNode = this.m_servicesNode.selectSingleNode("./service[@name = '" + serviceName + "']");
	}
	
	if (null == serviceNode)
	{
		return null;
	}
	return new AppService(serviceNode);
}


/**
 * Retrieve array of menu items within menu panel.
 * Each menu panel corresponds to a "panel" node
 * within the menuBar element.
 *
 * @param menuPanelXPath XPath for panel element relative to menuBar node.
 * @return Array of menuPanelItems. Returns null if menuPanelXPath incorrect.
 */
AppConfig.prototype.getMenuPanelItems = function( menuPanelXPath )
{
    var menuPanelItems = null;
    
    // Retrieve node associated with menu panel
    
    var menuPanelNode = this.m_menuBarNode.selectSingleNode( menuPanelXPath );
    
    if(null != menuPanelNode)
    {
        var menuPanelNodeChildren = menuPanelNode.childNodes;
        
        if(null != menuPanelNodeChildren)
        {
            var noOfChildren = menuPanelNodeChildren.length;
            
            if(noOfChildren > 0)
            {
            
                // Process entries in menu panel definition
                var menuPanelChildNode = null;
                var nodeName = null;
                var menuPanelItem = null;
                var labelNode = null;
                var destinationNode = null;
                
                menuPanelItems = new Array();
                
                for(var i = 0; i < noOfChildren; i++)
                {
                    menuPanelChildNode = menuPanelNodeChildren[i];
                    
                    if(menuPanelChildNode.nodeType == XML.ELEMENT_NODE)
                    {
                        menuPanelItem = new MenuPanelItem();
                         
                        nodeName = menuPanelChildNode.nodeName;
                         
                        if(nodeName != MenuPanelItem.DIVISION)
                        {
                            // Retrieve node attribute "label"
                            var labelNode = menuPanelChildNode.getAttribute( 'label' );
                            if(null == labelNode)
                            {
                                throw new AppConfigError("No label attribute found for menu panel item #" + i);
                            }
                             
                            menuPanelItem.m_label = labelNode;
                             
                            if(nodeName == MenuPanelItem.ITEM)
                            {
                                menuPanelItem.m_type = MenuPanelItem.ITEM;
                                
                                // Retrieve node attribute "destination"
                                destinationNode = menuPanelChildNode.getAttribute( 'destination' );
                                if(null == destinationNode)
                                {
                                    throw new AppConfigError("No destination attribute found for menu bar node: " + 
                                                              nodeName +
                                                              " with label " +
                                                              menuPanelItem.m_label);
                                }
                                
                                menuPanelItem.m_destination = destinationNode;
                            }
                            else if(nodeName == MenuPanelItem.PANEL)
                            {
                                menuPanelItem.m_type = MenuPanelItem.PANEL;
                            }
                            else
                            {
                                // Menu panel item may be a functional component
                                if(this._isFunctionalMenuPanelItem(nodeName))
                                {
                                    // Define menu panel item
                                    menuPanelItem.m_type = MenuPanelItem.FUNCTION;
                                    
                                    // Store functional type
                                    menuPanelItem.m_functionType = nodeName;
                                    
                                    // Retrieve associated class and function names.
                                    // Note, all functional menu entries must specify
                                    // a function name at least, except the logout
                                    // entry.
                                    var classNameNode = null;
                                    var functionNameNode = null;
    
                                    var className = null;
                                    var functionName = null;
                                    
                                    // Retrieve className node (Note that this may not have been defined)
                                    classNameNode = menuPanelChildNode.getAttribute( 'className' );
    
                                    if(null != classNameNode)
                                    {
                                        className = classNameNode;
        
                                        if(null == className || className == "")
                                        {
                                            throw new AppConfigError( "ClassName attribute is incorrectly defined for menu bar node : " +
                                                                      nodeName +
                                                                      " with label " +
                                                                      menuPanelItem.m_label );
                                        }
                                        
                                        menuPanelItem.m_functionClassName = className;
                                    }
    
                                    // Retrieve functionName node
                                    functionNameNode = menuPanelChildNode.getAttribute( 'functionName' );
    
                                    if(null == functionNameNode)
                                    {
                                        if(nodeName != "logout")
                                        {
                                            throw new AppConfigError( "No functionName attribute found for menu bar node : " +
                                                                      nodeName +
                                                                      " with label " +
                                                                      menuPanelItem.m_label );
                                        }
                                    }
                                    else
                                    {
    
                                        functionName = functionNameNode;
    
                                        if(null == functionName || functionName == "")
                                        {
                                            throw new AppConfigError( "FunctionName attribute incorrectly defined for menu bar node : " +
                                                                      nodeName +
                                                                      " with label " +
                                                                      menuPanelItem.m_label );
                                        }
                                    
                                        menuPanelItem.m_functionName = functionName;
                                    }
                                        
                                    // Retrieve function parameters
                                    menuPanelItem.m_functionParams = this._getMenuPanelItemFunctionParams(menuPanelChildNode,
                                                                                                          menuPanelItem);
                                            
                                } // End of if(this._isFunctionalMenuPanelItem(nodeName))
                                
                            }
                             
                        }
                        else
                        {
                            // Menu panel item division
                            menuPanelItem.m_type = MenuPanelItem.DIVISION;
                        }
                         
                        // Add menu panel item to array
                        menuPanelItems[menuPanelItems.length] = menuPanelItem;
                         
                    }
                
                } // for
                
            }
            
        }
                
    }
    
    // Return menu panel items definition
    return menuPanelItems;
    
}

/**
 * Method determines whether or not a menu panel item node from the menu bar
 * configuration defines a functional component.
 *
 * @param nodeName The name of the menu panel item node
 *
 * @return Returns "true" if the node corresponds to a functional component type
 *         otherwise "false"
 *
*/
AppConfig.prototype._isFunctionalMenuPanelItem = function( nodeName )
{
    var isFunctionalMenuPanelItem = false;
    
    var functionalItemTypes = AppConfig.NAVIGATION_MENU_FUNCTIONAL_COMPONENT_TYPES;
    
    for( var i = 0, l = functionalItemTypes.length; i < l; i++ )
    {
        if(nodeName == functionalItemTypes[i])
        {
            isFunctionalMenuPanelItem = true;
            break;
        }
    }
    
    return isFunctionalMenuPanelItem;
}

/**
 * Method defines menu panel item function component function
 * parameters. Such parameters should be defined by XML <param>
 * child nodes of the main menu panel item menu entry.
 *
 * @param menuPanelItemNode The node containing the description of the menu panel item
 *                          including the function parameters.
 * @param menuPanelItem Instance of MenuPanelItem class associated
 *                      with menu panel item
 *
 * @return Returns an array of instances of the class MenuPanelItemFunctionParam.
 *         Each instance describes a parameter for the function.
 *
*/
AppConfig.prototype._getMenuPanelItemFunctionParams = function( menuPanelItemNode,
                                                                menuPanelItem )
{
    var menuPanelItemFuncParams = null;
    
    // Retrieve child param nodes if present
    var paramNodes = menuPanelItemNode.selectNodes( './param' );
    
    if(paramNodes != null)
    {
        var paramNodesLength = paramNodes.length;
        
        if(paramNodesLength > 0)
        {
            menuPanelItemFuncParams = new Array();
        
            // Process parameter nodes
            var paramNode;
            var nameNode;
            var positionNode;
            var positionStr;
            var positionInt;
            var typeNode;
            var type;
            var valueNode;
            var value;
            var menuPanelItemFuncParam;
        
            for(var i = 0; i < paramNodesLength; i++)
            {
                // Clean parameter node variables
                paramNode = null;
                nameNode = null;
                positionNode = null;
                positionStr = null;
                positionInt = null;
                typeNode = null;
                type = null;
                valueNode = null;
                value = null;
                menuPanelItemFuncParam = null;
            
                // Define new function parameter
                menuPanelItemFuncParam = new MenuPanelItemFunctionParam();
            
                paramNode = paramNodes[i];
            
                // Retrieve parameter name (if present)
                nameNode = paramNode.getAttribute( 'name' );
            
                if(nameNode != null)
                {
                    menuPanelItemFuncParam.m_name = nameNode;
                }
            
                // Retrieve parameter position
                positionNode = paramNode.getAttribute( 'position' );
            
                if(null == positionNode)
                {
                    if(paramNodesLength > 1)
                    {
                        throw new AppConfigError( "No position attribute found for parameter " +
                                                  i +
                                                  " for menu bar node : " +
                                                  menuPanelItem.m_functionType +
                                                  " with label " +
                                                  menuPanelItem.m_label );
                    }
                    else
                    {
                        // Defect 1044. To enable backward compatibility set default position
                        // value when there is a single parameter entry only.
                        menuPanelItemFuncParam.m_position = 0;
                    }
                }
                else
                {
                    // Determine position of parameter in function
                    // argument list
                    positionStr = positionNode;
                    positionInt = parseInt(positionStr);
            
                    if(isNaN(positionInt) || positionInt < 0)
                    {
                        throw new AppConfigError( "Invalid position attribute defined for parameter " +
                                                  i +
                                                  " for menu bar node : " +
                                                  menuPanelItem.m_functionType +
                                                  " with label " +
                                                  menuPanelItem.m_label );
                    }
             
                    menuPanelItemFuncParam.m_position = positionInt;
                }
            
                // Retrieve type parameter (if present)
                typeNode = paramNode.getAttribute('type' );
            
                if(null == typeNode)
                {
                    // Set default type "string"
                    menuPanelItemFuncParam.m_type = MenuPanelItemFunctionParam.STRING;
                }
                else
                {
                    type = typeNode;
                
                    if(!MenuPanelItemFunctionParam.isValidType(type))
                    {
                        throw new AppConfigError( "Invalid type attribute defined for parameter " +
                                                   i +
                                                   " for menu bar node : " +
                                                   menuPanelItem.m_functionType +
                                                   " with label " +
                                                   menuPanelItem.m_label );
                    }
                
                    menuPanelItemFuncParam.m_type = type;
                }
            
                // Retrieve parameter value
                valueNode = paramNode.getAttribute('value' );
            
                if(null == valueNode)
                {
                    throw new AppConfigError( "No value attribute found for parameter " +
                                              i +
                                              " for menu bar node : " +
                                              menuPanelItem.m_functionType +
                                              " with label " +
                                              menuPanelItem.m_label );
                }
            
                value = valueNode;
            
                if(value == "")
                {
                    throw new AppConfigError( "Empty value attribute defined for parameter " +
                                              i +
                                              " for menu bar node : " +
                                              menuPanelItem.m_functionType +
                                              " with label " +
                                              menuPanelItem.m_label );
                }
            
                // Set value on menu panel item function parameter
                menuPanelItemFuncParam.m_value = this._getMenuPanelItemFunctionParamValue( value,
                                                                                           menuPanelItemFuncParam.m_type,
                                                                                           i,
                                                                                           menuPanelItem );
            
                // Add parameter to array
                menuPanelItemFuncParams[menuPanelItemFuncParams.length] = menuPanelItemFuncParam;
            
            } // End of for loop
        
        }
        
    }
            
    return menuPanelItemFuncParams;
           
}

/**
 * Method converts a menu panel item function parameter value from
 * the string value stored in the XML configuration file into a
 * Javascript variable of the correct type.
 *
 * @param xmlValue      The string value defined for the parameter in the menu 
 *                      configuration.
 * @param type          The type of the variable as defined in the parameter's 
 *                      configuration.
 * @param paramPosition The position of the parameter within the menu items's
 *                      list of parameters.
 * @param menuPanelItem The associated menu panel item.
 *
 * @return Returns a javascript variable of the correct type assigned the value in
 *         xmlValue.
*/
AppConfig.prototype._getMenuPanelItemFunctionParamValue = function( xmlValue,
                                                                    type,
                                                                    paramPosition,
                                                                    menuPanelItem )
{
    var returnValue = null;
    
    switch (type)
    {
        case MenuPanelItemFunctionParam.BOOLEAN:
        {
            var lowerCaseXmlValue = xmlValue.toLowerCase();
            
            if(lowerCaseXmlValue == "true")
            {
                returnValue = true;
            }
            else if(lowerCaseXmlValue == "false")
            {
                returnValue = false;
            }
            else
            {
                throw new AppConfigError( "Invalid value for boolean attribute defined for parameter " +
                                          paramPosition +
                                          " for menu bar node : " +
                                          menuPanelItem.m_functionType +
                                          " with label " +
                                          menuPanelItem.m_label );
            }
            
            break;
        }
        
        case MenuPanelItemFunctionParam.INT:
        {
            returnValue = parseInt( xmlValue );
            
            if(isNaN(returnValue))
            {
                throw new AppConfigError( "Invalid value for integer attribute defined for parameter " +
                                           paramPosition +
                                           " for menu bar node : " +
                                           menuPanelItem.m_functionType +
                                           " with label " +
                                           menuPanelItem.m_label );
            }
            
            break;
        }
        
        case MenuPanelItemFunctionParam.FLOAT:
        {
            returnValue = parseFloat( xmlValue );
            
            if(isNaN(returnValue))
            {
                throw new AppConfigError( "Invalid value for attribute of type float defined for parameter " +
                                           paramPosition +
                                           " for menu bar node : " +
                                           menuPanelItem.m_functionType +
                                           " with label " +
                                           menuPanelItem.m_label );
            }
            
            break;
        }
        
        default:
        {
            returnValue = xmlValue;
            break;
        }
        
    }
    
    return returnValue;
}

/**
 * Return name of project as defined in the applicationconfig.xml file's
 * project tag.
 *
 * @return Returns name of project if defined. If not defined the
 *         project name is set to an empty string.
 *
*/
AppConfig.prototype.getProjectName = function()
{
    if(null == this.m_projectName)
    {
        // Initially set default value for project name
        this.m_projectName = "";
        
        if(null != this.m_projectNode)
        {
            var projectName = this.m_projectNode.getAttribute('name');
            
            if(null != projectName)
            {
                this.m_projectName = projectName;
            }
        }
    }
    
    return this.m_projectName;
}

/**
 * Return name of dialog style as defined in the applicationconfig.xml file's
 * project tag.
 *
 * @return Returns name of dialog style if defined. If not defined the
 *         dialog style defaults to Framework standard dialogs.
 *
*/
AppConfig.prototype.getDialogStyle = function()
{
    if(null == this.m_dialogStyle)
    {
        // Initially set default value for dialog style
        this.m_dialogStyle = AppConfig.FRAMEWORK_DIALOG_STYLE;
        
        if(null != this.m_projectNode)
        {
            var dialogStyle = this.m_projectNode.getAttribute('dialog-style');
            
            if(null != dialogStyle)
            {
            	dialogStyle = dialogStyle.toLowerCase();
            	
            	if(dialogStyle != AppConfig.FRAMEWORK_DIALOG_STYLE && dialogStyle != AppConfig.BROWSER_DIALOG_STYLE)
            	{
            		if(AppController.m_logger.isWarn()) AppController.m_logger.warn("<project dialog-style/> attribute '" + dialogStyle + "' is not a valid dialog style, using default");
                }
                else
                {
                	this.m_dialogStyle = dialogStyle;
                }
            }
        }
    }
    
    return this.m_dialogStyle;
}

/**
 * Return value of property validateWhitespaceOnlyEntryActive as defined in
 * the applicationconfig.xml file. If property is not defined default value
 * is "true".
 *
 * @return Returns boolean value indicating whether whitespace only entry
 *         validation should be active.
 *
*/
AppConfig.prototype.getValidateWhitespaceOnlyEntryActive = function()
{
    if(null == this.m_validateWhitespaceOnlyEntryActive)
    {
        // Default value of property is "true"
        this.m_validateWhitespaceOnlyEntryActive = true;
        
        if(null != this.m_projectNode)
        {
            var validateWhitespaceOnlyEntryActive = this.m_projectNode.getAttribute('validateWhitespaceOnlyEntryActive');
            
            if(null != validateWhitespaceOnlyEntryActive)
            {
                validateWhitespaceOnlyEntryActive = validateWhitespaceOnlyEntryActive.toLowerCase();
                
                if(validateWhitespaceOnlyEntryActive == "false")
                {
                    this.m_validateWhitespaceOnlyEntryActive = false;
                }
            }
        }
    }
    
    return this.m_validateWhitespaceOnlyEntryActive;
}

/**
 * Return contents of <exception-handlers> tag as defined in the applicationconfig.xml.
 *
 * @return Returns exception handlers if defined. If not defined exception
 *         handlers defaults to Framework default exception handlers.
*/
AppConfig.prototype.getExceptionHandlers = function()
{
    if(null == this.m_exceptionHandlers)
    {
    	var exceptionObj = new Object();
    	var exceptionHandlers = new Array();
    	
		// Initially set default values for InvalidUserSessionException
    	exceptionObj.useDefault = true;
    	exceptionObj.message = "Not logged in";
    	exceptionHandlers["InvalidUserSession"] = exceptionObj;

		exceptionObj = null;
		exceptionObj = new Object();
		
		// Initially set default values for AuthorizationException
    	exceptionObj.useDefault = false;
    	exceptionObj.message = null;
    	exceptionHandlers["Authorization"] = exceptionObj;
    	
		exceptionObj = null;
		
		// Get <exception-handlers> node from application config
		var exceptionsNode = this.m_configDocNode.selectSingleNode('./exception-handlers');
    	
        if(null != exceptionsNode)
        {
        	var exceptionsNodeChildren = exceptionsNode.childNodes;
            
            for(var i = exceptionsNodeChildren.length - 1; i >= 0; i--)
            {
            	var exceptionNode = exceptionsNodeChildren[i];
            	var nodeName = exceptionNode.nodeName;
            	
            	if(nodeName != "InvalidUserSession" && nodeName != "Authorization")
            	{
                	if(AppController.m_logger.isWarn()) AppController.m_logger.warn("Framework does not provide a default handler for '" + nodeName + "' exception");
            	}
				else
				{
	            	exceptionObj = new Object();
	            	
	            	// Initially set default values
	            	exceptionObj.useDefault = true;
	            	exceptionObj.message = null;
	            	
	            	// Get whether or not to use default handler node
	            	var useDefault = exceptionNode.getAttribute('use-default');
	            	
	            	if(useDefault != null)
	            	{            		
	            		useDefault = useDefault.toLowerCase();
	            		
	            		if(useDefault != "yes" && useDefault != "no")
	            		{
	                		if(AppController.m_logger.isWarn()) AppController.m_logger.warn("<" + nodeName + " use-default/> attribute '" + useDefault + "' is not a valid value, using default");
	                		useDefault = "yes";
	            		}
	            		
	            		exceptionObj.useDefault = (useDefault == "yes") ? true : false;
	            		
	            		if(useDefault == "yes")
	            		{
	            			// Configured to use Framework default handler for this exception,
	            			// so check for a user defined message
	            			var messageNode = exceptionNode.getAttribute('message');
	            			
	            			if(messageNode != null)
	            			{
	            				// Don't need to check for message being null because default
	            				// handler uses the exception's message in this case
	            				exceptionObj.message = messageNode;
	            			}
	            		}
	            	}
	            	
	            	exceptionHandlers[exceptionNode.nodeName] = exceptionObj;
	            	exceptionObj = null;
	            }
            }
        }
        
        this.m_exceptionHandlers = exceptionHandlers;
    }
    
    return this.m_exceptionHandlers;
}

/**
 * Spell-checking config: get the xpath to the current court id in the data model.
 */ 
AppConfig.prototype.getSpellCheckCourtXPath = function()
{
    return this.m_courtXPath;
}

/**
 * Spell-checking config: get the dictionary label to use.
 */ 
AppConfig.prototype.getSpellCheckDictionaryLabel = function()
{
    return this.m_dictionaryLabel;
}

/**
 * Spell-checking config: get the dictionary label to use.
 */ 
AppConfig.prototype.getSpellCheckURL = function()
{
    return this.m_spellCheckURL;
}

/**
 * Spell-checking config: get the dictionary label to use.
 */ 
AppConfig.prototype.getSpellCheckPopup = function()
{
    return this.m_spellCheckPopup;
}

/** 
 *  Method returns retry limit for Http connection error retries as defined
 *  in applicationConfig.xml file.
 *
 *  @return Returns retry limit, if defined, or null.
 *
*/
AppConfig.prototype.getHttpConnectionErrorRetryLimit = function()
{
    var retryLimit = null;
    
    if(null != this.m_httpConnectionErrorRetryResponseNode)
    {
        var retryLimitNode = this.m_httpConnectionErrorRetryResponseNode.selectSingleNode( './retryLimit' );
        
        if(null != retryLimitNode)
        {
            var retryLimitStr = XML.getNodeTextContent( retryLimitNode );
            
            if(null != retryLimitStr && retryLimitStr != "")
            {
                retryLimit = parseInt( retryLimitStr );
                
                if(isNaN(retryLimit) || retryLimit < 0)
                {
                    throw new AppConfigError( "Http connection error retry limit is not a valid number : " + retryLimit );
                }
                
            }
            
        }
        
    }
    
    return retryLimit; 
}

/**
 * Method returns Http connection error retry response details defined
 * in applicationConfig.xml file.
 *
 * @return If defined, the Http connection error retry response details
 *         are returned as properties on an object. If not defined
 *         null is returned.
 *
*/
AppConfig.prototype.getHttpConnectionErrorRetryResponses = function()
{
    var errorRetryResponses = null;
    
    if(null != this.m_httpConnectionErrorRetryResponseNode)
    {
        var errorRetryResponsesNode = this.m_httpConnectionErrorRetryResponseNode.selectSingleNode( './errorRetryResponses' );
    
        if(null != errorRetryResponsesNode)
        {
            var errorRetryResponsesNodeChildren = errorRetryResponsesNode.childNodes;
        
            if(null != errorRetryResponsesNodeChildren)
            {
                var noOfChildren = errorRetryResponsesNodeChildren.length;
            
                if(noOfChildren > 0)
                {
                    // Define locally used variables
                    var errorRetryResponseNode;
                    var responseStatusNode;
                    var responseStatus;
                    var retryNode;
                    var retryStr;
                    var retry;
                
                    for(var i = 0; i < noOfChildren; i++)
                    {
                        // Clean local variables
                        errorRetryResponseNode = null;
                        responseStatusNode = null;
                        responseStatus = null;
                        retryNode = null;
                        retryStr = null;
                        retry = null;
                    
                        // Extract details of error retry response
                        // First determine response status code
                        errorRetryResponseNode = errorRetryResponsesNodeChildren[i];

                        if(errorRetryResponseNode.nodeType == XML.ELEMENT_NODE)
                        {
                            responseStatusNode = errorRetryResponseNode.getAttribute('responseStatus' );
                        
                            if(null == responseStatusNode)
                            {
                                throw new AppConfigError( "No response status attribute defined for HTTP connection error retry response node #" + i);
                            }
                        
                            responseStatus = responseStatusNode;
                        
                            if(null == responseStatus || responseStatus == "")
                            {
                                throw new AppConfigError( "Invalid value defined for HTTP connection error retry attribute response status in node #" + i);
                            }

                            // Second determine value of retry attribute
                            retryNode = errorRetryResponseNode.getAttribute('retry' );
                        
                            if(null == retryNode)
                            {
                                throw new AppConfigError( "No retry attribute defined for HTTP connection error retry response node #" + i );
                            }
                        
                            retryStr = retryNode;
                        
                            if(null == retryStr || retryStr == "")
                            {
                                throw new AppConfigError( "Invalid value defined for HTTP connection error retry attribute retry in node #" + i );
                            }
                        
                            retryStr = retryStr.toLowerCase();
                        
                            if(retryStr == "true")
                            {
                                retry = true;
                            }
                            else if(retryStr == "false")
                            {
                                retry = false;
                            }
                            else
                            {
                                throw new AppConfigError( "Invalid value defined for HTTP connection error retry attribute retry in node #" + i );
                            }
                        
                            // Set retry properties on return object
                            if(null == errorRetryResponses)
                            {
                                errorRetryResponses = new Object();
                            }
                        
                            errorRetryResponses[ responseStatus ] = retry;
                        
                        } // End of if(errorRetryResponseNode.nodeType == XML.ELEMENT_NODE)
                    
                    } // End of for loop
                
                }  // End of if(noOfChildren > 0)
            
            } // End of if(null != errorRetryResponsesNodeChildren)
        
        } // End of if(null != errorRetryResponsesNode)
        
    } // End of if(null != this.m_httpConnectionErrorRetryResponseNode)
    
    // Return object containing Http connection error retry responses
    return errorRetryResponses;
}

/**
 * Static method to get the parameters from a node. This is a static method because it is used from AppConfig
 * and also in AppService
 */
AppConfig.getParametersFromNode = function(node)
{
	// Get the parameters for the service
	var paramNodes = node.selectNodes('./param');
	
	// Map containing parameters required by the service
	var parameters = new Array();

	for(var i=0; i<paramNodes.length; i++)
	{
		var paramNameNode = paramNodes[i].getAttribute('name');
		
		if(null == paramNameNode)
		{
			throw new AppConfigError("No name attribute found for parameter " + (i + 1));
		}

		var paramValueNode = paramNodes[i].getAttribute('value');
		
		if(null == paramValueNode)
		{
			throw new AppConfigError("No value attribute found for parameter " + (i + 1));
		}
		
		var nameAtt = paramNameNode;
		var valueAtt = paramValueNode;
		parameters[parameters.length] = {name: nameAtt, value: valueAtt}
		//parameters[XML.getNodeTextContent(paramNameNode)] = XML.getNodeTextContent(paramNameNode);
	}
	return parameters;
}

/**
 * Get the application config document's forms node.
 *
 * @return the forms node
 *
*/
AppConfig.prototype.getFormsNode = function()
{
    return this.m_formsNode;
}


/**
 * Exception thrown for Application Configuration errors
 *
 * @param message the message to report in the exception
 * @constructor
 */
function AppConfigError(message)
{
   this.message = message;
}


/**
 * AppConfigError is a sub class of Error
 */
AppConfigError.prototype = new Error();
AppConfigError.prototype.constructor = AppConfigError;



function AppStyleSheet(node)
{
	var nameNode = node.getAttribute('name');
	if(null == nameNode)
	{
		throw new AppConfigError("No name attribute found for stylesheet node: " + node.xml);
	}
	
	var titleNode = node.getAttribute('title');
	if(null == titleNode)
	{
		throw new AppConfigError("No title attribute found for stylesheet node: " + node.xml);
	}
	
	this.m_name = nameNode;
	if(null == this.m_name)
	{
		throw new AppConfigError("Empty name attribute found for stylesheet node: " + node.xml);
	}

	this.m_title = titleNode;
	if(null == this.m_title)
	{
		throw new AppConfigError("Empty title attribute found for stylesheet node: " + node.xml);
	}
}


AppStyleSheet.prototype.getName = function()
{
	return this.m_name;
}

AppStyleSheet.prototype.getTitle = function()
{
	return this.m_title;
}


function AppCSS(node)
{
}


AppCSS.createFromChildren = function(parentNode, parentURL)
{
	var cssNodes = parentNode.selectNodes('css');
	var appCSSs = [];
	
	for(var i = 0, l = cssNodes.length; i < l; i++)
	{
		appCSSs.push(AppCSS.createFromNode(cssNodes[i], parentURL));
	}
	
	return appCSSs;
}


AppCSS.createFromNode = function(node, parentURL)
{
	var n = node.getAttribute('baseURL');
	
	// Setup baseURL member variable
	if(null == n)
	{
		throw new AppConfigError("No baseURL attribute found for css node");
	}
	var baseURL = parentURL + "/" + n;

	// Setup browserDependant member variable
	n = node.getAttribute('browserDependant');
	var browserDependant = ((null != n) && (n == "true"));

	// Setup colourSchemeDependant member variable
	n = node.getAttribute('colourSchemeDependant');
	var colourSchemeDependant = ((null != n) && (n == "true"));
	
	return AppCSS.create(baseURL, browserDependant, colourSchemeDependant);
}


AppCSS.create = function(baseURL, browserDependant, colourSchemeDependant)
{
	var css = new AppCSS();
	css.m_baseURL = baseURL;
	css.m_browserDependant = browserDependant;
	css.m_colourSchemeDependant = colourSchemeDependant;
	
	return css;
}


AppCSS.prototype.getBaseURL = function()
{
	return this.m_baseURL;
}


AppCSS.prototype.getColourSchemeDependant = function()
{
	return this.m_colourSchemeDependant;
}


AppCSS.prototype.getBrowserDependant = function()
{
	return this.m_browserDependant;
}



/**
 * Class representing a form, as defined in the configuration file
 *
 * @param node the XML node from which to load the form's configuration
 * @throws AppConfigError if there was a problem with the form's configuration
 * @private
 * @constructor
 */
function AppForm(node, appConfig)
{
	// Keep hold of node for lazy loading of mappings and local services...
	this.m_node = node;

	// Get the name of the form
	var nameNode = node.getAttribute('name');
	if(null == nameNode)
	{
		throw new AppConfigError("No name attribute found for form node");
	}
	this.m_name = nameNode;
	

	// Get the pageurl of the form
	var urlNode = node.getAttribute('pageURL');
	if(null == urlNode)
	{
		throw new AppConfigError("No pageURL attribute found for form with name: " + this.m_name);
	}
	this.m_pageURL = urlNode;
	
	// Get the title of the form
	var titleNode = node.getAttribute('title');
	if(null == titleNode)
	{
		throw new AppConfigError("No title attribute found for form with name: " + this.m_name);
	}
	this.m_title = titleNode;
	
	// Get whether the form should not be precompiled
	var precompileNode = node.getAttribute('precompile');
	if(null != precompileNode)
	{
	   this.m_precompile = precompileNode;
	}
	else{
		this.m_precompile = "yes";
	}
    
	// Determine whether or not this is an FUnit Page
	var funitNode = node.getAttribute('funit');
	this.m_isFUnit = (null != funitNode && funitNode == "true");
	
	// Map containing the form mappings to services
	this.m_mappings = new Array();
	
	// Map containing form-local services
	this.m_services = new Array();
	
	// Map containing the list of roles for access
	this.m_roles = new Array();
	var accessNode = node.selectSingleNode('./access');
	if(accessNode != null)
	{
		var roleNodes = accessNode.selectNodes('./role');
		for(var i=0; i<roleNodes.length; i++)
		{
			var idNode = roleNodes[i].getAttribute('name');
			var role = idNode;
			this.m_roles[this.m_roles.length] = role;
		}
	}
	
	
	// CSS files to load
	var ac = Services.getAppController();	
	var baseStyleSheetURL = appConfig.m_appBaseURL + appConfig.m_formsBaseURL;
	this.m_formCSS = AppCSS.createFromChildren(node, baseStyleSheetURL);
}


AppForm.prototype.getFormCSS = function()
{
	return this.m_formCSS;
}

/**
 * Get whether this form should have been precompiled
 *
 * @return the precompile setting
 * @private
 */
AppForm.prototype.getPrecompile = function()
{
	return this.m_precompile;
}


/**
 * Get the forms name
 *
 * @return the forms name
 * @private
 */
AppForm.prototype.getName = function()
{
	return this.m_name;
}


/**
 * Get the forms title
 *
 * @return the forms title
 * @private
 */
AppForm.prototype.getTitle = function()
{
	return this.m_title;
}


AppForm.prototype.isFUnit = function()
{
	return this.m_isFUnit;
}


/**
 * Get the forms pageURL
 *
 * @return the forms pageURL
 * @private
 */
AppForm.prototype.getPageURL = function()
{
	return this.m_pageURL;
}

AppForm.prototype.getRoles = function()
{
	return this.m_roles;
}

/**
 * Get the service name for a named mapping.
 *
 * Returns the serviceName for the mapping. If no serviceName is found, then the mapping name
 * is used as the default serviceName.
 *
 * @param mappingName the name of the mapping who's serviceName to retrieve
 * @return the name of the service for the mapping
 * @private
 */
AppForm.prototype.getServiceNameForMapping = function(mappingName)
{
	var serviceNameNode = this.m_node.selectSingleNode("./mapping[@name = '" + mappingName + "']/@serviceName");

	// If serviceName atttribute not explicitly declared, use the mapping name by default.
	return (null == serviceNameNode) ? mappingName : XML.getNodeTextContent(serviceNameNode);
}


/**
 * Get a service node which is defined locally to this form
 *
 * @param serviceName the name of the service to return
 * @return the node representing the service
 * @private
 */
AppForm.prototype.getLocalServiceNode = function(serviceName)
{
	var serviceNode = this.m_node.selectSingleNode("./service[@name = '" + serviceName + "']");

	return serviceNode;
}

/**
 * Class representing a service, as defined in the configuration file
 *
 * @param node the XML node from which to load the service's configuration
 * @throws AppConfigError if there was a problem with the service's configuration
 * @private
 * @constructor
 */
function AppService(node)
{
	// Get the name of the service
	var nameNode = node.getAttribute('name'); 
	if(null == nameNode)
	{
		throw new AppConfigError("No name attribute found for service node");
	}
	this.m_name = nameNode;

	// Get the name of the service
	var orderNode = node.getAttribute('order'); 
	if(null != orderNode)
	{
		this.m_order = orderNode;
	}
	
	// Get caching strategy hint for the service
	this.m_cacheStrategy = null;
	var cacheNode = node.getAttribute('cache'); 
	if(null != cacheNode)
	{
		this.m_cacheStrategy = cacheNode;
	}
    
	var urlNode = node.getAttribute('url');
	if(null == urlNode)
	{
		throw new AppConfigError("No url attribute found for service with name: " + this.m_name);
	}
	this.m_url = urlNode;

	var componentNode = node.getAttribute('component');
	this.m_componentName = (null == componentNode) ? this.m_url : componentNode;	

	var methodNode = node.getAttribute('method');
	if(null == methodNode)
	{
		throw new AppConfigError("No method attribute found for service with name: " + this.m_name);
	}
	this.m_method = methodNode;
	
	var dataBindingNode = node.getAttribute('dataBinding');
	if(null != dataBindingNode)
	{
		this.m_dataBinding = dataBindingNode;
	}

	// These parameters are never used!!!! Remove them???
	// Get the parameters for the service
	var paramNodes = node.selectNodes('./param');
	
	// Map containing parameters required by the service
	this.m_parameters = new Array(paramNodes.length);
	for(var i=0; i<paramNodes.length; i++)
	{
		var paramNameNode = paramNodes[i].getAttribute('name');
		if(null == paramNameNode)
		{
			throw new AppConfigError("No name attribute found for parameter " + (i + 1) + " for service: " + this.m_name);
		}
		this.m_parameters[i] = paramNameNode;
	}
}

/**
 * Get the name for the service
 *
 * @return the URL for the service
 * @private
 */
AppService.prototype.getName = function()
{
	return this.m_name;
}

/**
 * Get the URL for the service
 *
 * @return the URL for the service
 * @private
 */
AppService.prototype.getOrder = function()
{
	return this.m_order;
}

/**
 * Get the URL for the service
 *
 * @return the URL for the service
 * @private
 */
AppService.prototype.getParameters = function()
{
	return this.m_parameters;
}

/**
 * Get the URL for the service
 *
 * @return the URL for the service
 * @private
 */
AppService.prototype.getDataBinding = function()
{
	return this.m_dataBinding;
}

/**
 * Get the URL for the service
 *
 * @return the URL for the service
 * @private
 */
AppService.prototype.getURL = function()
{
	return this.m_url;
}

/**
 * Returns the name of the component the service is part of
 *
 * @return the name of the component the service is part of
 * @private
 */
AppService.prototype.getComponentName = function()
{
	return this.m_componentName;
}

/**
 * Get the method name for this service
 *
 * @return the method name for this service
 * @private
 */
AppService.prototype.getMethod = function()
{
	return this.m_method;
}
