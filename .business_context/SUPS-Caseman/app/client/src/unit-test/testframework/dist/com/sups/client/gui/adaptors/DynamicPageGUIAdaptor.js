//==================================================================
//
// DynamicPageGUIAdaptor.js
//
// Class for implementing Dynamic pages (loaded during the lifetime
// of the form) within Paged Areas
//
//==================================================================


/**
 * Dynamic Page GUIAdaptor for pages on PagedArea
 *
 * @constructor
 * @private
 */
function DynamicPageGUIAdaptor(){};


/**
 * DynamicPageGUIAdaptor is a sub class of PageGUIAdaptor
 */
DynamicPageGUIAdaptor.prototype = new PageGUIAdaptor();

/**
 * Add the required protocols to the DynamicPageGUIAdaptor
 */
GUIAdaptor._setUpProtocols('DynamicPageGUIAdaptor'); 


DynamicPageGUIAdaptor.prototype.constructor = DynamicPageGUIAdaptor;


/**
 * CSS classes used to render the page in different states
 */
DynamicPageGUIAdaptor.CSS_CLASS_NAME = "dynamicPage " + PageGUIAdaptor.CSS_CLASS_NAME;


/**
 * Loading states of a DynamicPage
 */
DynamicPageGUIAdaptor.STATE_CREATED = 0;
DynamicPageGUIAdaptor.STATE_LOADING = 1;
DynamicPageGUIAdaptor.STATE_LOADED = 2;


/**
 * Regular expression used to re-write inline component creation
 * scripts from the form:
 *  xxxRenderer.createInline(param1, param2);
 * to:
 *  xxxRenderer.createAsInnerHTML(document.getElementById("_scriptId", Renderer.AFTER_ELEMENT, param1, param2);
 *
 * @type RegExp
 * @private
 */
DynamicPageGUIAdaptor.SCRIPT_REWRITE_REGEX = new RegExp("createInline([^(]*)\\(");


/**
 * Loading state of the DynamicPage
 *
 * @type integer
 * @private
 */
DynamicPageGUIAdaptor.prototype.m_loadingState = DynamicPageGUIAdaptor.STATE_CREATED;


/**
 * URL of the HTML containing the dynamic panel
 *
 * @type String
 * @private
 */
DynamicPageGUIAdaptor.prototype.m_viewURL = null;

/**
 * Reference to script tag which contains configuration for
 * dynamic page
 *
*/
DynamicPageGUIAdaptor.prototype.m_configScript = null;


/**
 * Reference to LINK element which loads the CSS styles for the Dynamic Page
 *
 * @type HTMLElement
 * @private
 */
DynamicPageGUIAdaptor.prototype.m_stylesheetLink = null;


/**
 * Reference to the Dynamic Page's CSS styles onload event handler
 *
 * @type Object
 * @private
 */
DynamicPageGUIAdaptor.prototype.m_onLoadHandlerKey = null;

/**
 * Reference to exception raised whilst creating and configuring
 * the contents of the dynamic page.
 *
 * @type Object
 * @private
*/
DynamicPageGUIAdaptor.prototype.m_pageCreationException = null;

/**
 * Create a new PageGUIAdaptor
 *
 * @param e the div element that represents the outer div of the page
 * @return the new PageGUIAdaptor
 * @type PageGUIAdaptor
 */
DynamicPageGUIAdaptor.create = function(e)
{
	Logging.logMessage("PageGUIAdaptor.create", Logging.LOGGING_LEVEL_TRACE);

	var a = new DynamicPageGUIAdaptor();
	a._initialiseAdaptor(e);
	return a;
}


/**
 * Initialise the adaptor - override method in PageGUIAdaptor
 *
 * @param e the outermost html div element that represents the page
 * @private
 */
DynamicPageGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call the super class.
	PageGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
}


/**
 * Clean up after the component 
 */
DynamicPageGUIAdaptor.prototype._dispose = function()
{
    // Remove configuration script from document
    if(null != this.m_configScript)
    {
        this.m_configScript.parentNode.removeChild(this.m_configScript);
        this.m_configScript = null;
    }
    
    // Remove style sheet reference from document
	if(null != this.m_stylesheetLink)
	{
		// Remove the HTML LINK node so that the dynamic page's stylesheet is removed from the document
		this.m_stylesheetLink.parentNode.removeChild(this.m_stylesheetLink);
		this.m_stylesheetLink = null;
	}
	
	// Clean references to general properties
	this.m_viewURL = null;
	this.m_configURL = null;
	this.m_styleURL = null;
	this.m_cssLoaded = null;
	
	// In case of CSS load failure remove style sheet onload handler
	if(null != this.m_onLoadHandlerKey)
	{
		SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);
		this.m_onLoadHandlerKey = null;
	}
	
	// Call the super class.
	PageGUIAdaptor.prototype._dispose.call(this);
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 * @private
 */
DynamicPageGUIAdaptor.prototype._configure = function(cs)
{
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		if(null == this.m_viewURL && null != c.viewURL) this.m_viewURL = c.viewURL;
		if(null == this.m_configURL && null != c.configURL) this.m_configURL = c.configURL;
		if(null == this.m_styleURL && null != c.styleURL) this.m_styleURL = c.styleURL;
		if(null == this.m_showProgress && null != c.showProgress) this.m_showProgress = c.showProgress;
	}
	
	// Default page specific CSS loaded flag if no style URL
	if(null == this.m_styleURL) this.m_cssLoaded = true;
	
	// Default value for show progress bar
	if(null == this.m_showProgress) this.m_showProgress = false;	
}


/**
 * Show the page. If the dynamic page is not loaded it starts loading
 *
 * @param showMe true if the page is to shown or false if it is to hidden.
 */
DynamicPageGUIAdaptor.prototype.show = function(showMe)
{
	// Call the super class show method
	PageGUIAdaptor.prototype.show.call(this, showMe);

	// Load the page if necessary
	if(showMe)
	{
	    if(this.m_loadingState == DynamicPageGUIAdaptor.STATE_CREATED)
	    {
	        // Note that the progress bar need be displayed only if
	        // the dynamic page is being created for the first time.
	        // Some applications do not load and unload a dynamic
	        // page each time it is displayed.
	        if(this.m_showProgress == true)
	        {
	            var ac = FormController.getInstance().getAppController();
	            ac._showProgress();
	        }
	    }
	    
		// Invoke the page load in a timeout to allow the "Page loading ..."
		// message and/or progress bar to be rendered
		var thisObj = this;
		setTimeout(function() { thisObj._loadPage(); }, 0);
	}
}


/**
 * Load's the contents of the dynamic page if necessary
 *
 * @private
 */
DynamicPageGUIAdaptor.prototype._loadPage = function()
{
	// If we haven't already loaded the page, and aren't in the process
	// of loading it, then start loading it now 
	if(DynamicPageGUIAdaptor.STATE_CREATED == this.m_loadingState)
	{
		var thisObj = this;

		this.m_loadingState = DynamicPageGUIAdaptor.STATE_LOADING;
		this.m_configLoadingState = DynamicPageGUIAdaptor.STATE_LOADING;
		
		// Attach the javascript config file
		this.m_configScript = document.createElement("script");
		
		// Defect 1081. Following the delay in loading dynamic pages
		// to allow the progress bar to be raised the order of the 
		// next two statements has been important. Previously, the
		// script source code was loaded before the script tag was 
		// attached to the document body. However, this seemed to
		// cause IE to crash which is not desirable.
		document.body.appendChild(this.m_configScript);
		this.m_configScript.src = this.m_configURL;

		// Load the page specific stylesheet
		if(this.m_styleURL != null)
		{
			var headElement = GUIUtils.getDocumentHeadElement(document);
			this.m_stylesheetLink = GUIUtils.createStyleLinkElement(headElement, this.m_styleURL, null);
			
			// Set stylesheet not yet loaded
			this.m_cssLoaded = false;
			
			if(HTMLView.isIE)
			{
			    // Add onload event handler to page specific stylesheet link element
			    this.m_onLoadHandlerKey = SUPSEvent.addEventHandler(this.m_stylesheetLink, "load", function() { thisObj._pageCSSLoaded(); });
			}
			else
			{
				// Invoke onload event handler immediately on non IE browsers
				this._pageCSSLoaded();
			}
		}

		// Create a temporary iframe into which the dynamic page content will be loaded		
		var iframe = document.createElement("iframe");
		iframe.style.visibility = "hidden";

		// Temporarily append the iframe to the page - it is removed once page loading is completed.
		document.body.parentNode.appendChild(iframe);
		
		// Create a fwFrameManager around the iframe to handle the actual content loading.
		this.m_iframe = fwFrameManager.create(iframe);
		this.m_iframe.addLoadCompleteListener(function(errMsg) {thisObj._iframeLoaded(errMsg);});
			
		// Start loading the view
		this.m_iframe.load(this.m_viewURL);
	}
}

/**
 * Method sets up and configures dynamic page. The innerHTML of the temporary
 * iframe is copied into the dynamic page div. The javascript tags within
 * the HTML DOM are modified and then executed. Lastly, the method
 * _pageAndConfigReady is invoked to create and configure the corresponding
 * adaptors.
 *
 * @param errorMessage If an error occurs loading the HTML, or a later
 *                     error is raised by this method and the method invoked 
 *                     a second time by the caller method, the parameter
 *                     errorMessage contains details of the error.
 *
*/
DynamicPageGUIAdaptor.prototype._iframeLoaded = function(errorMessage)
{
    var destroyIframe = true;

	if(null == errorMessage)
	{
	    
	    try
	    {
		    // Get iframe's document
		    var iframe = this.m_iframe.getFrame();
		    var iframeDoc = getIframeDocument(iframe);
		
		    // Search for the dynamic panel - looking for a div with CSS class=DynamicPageGUIAdaptor.CSS_CLASS_NAME ("dynamicPage page")
		    var divs = iframeDoc.getElementsByTagName("DIV");
		
		    var i = 0;
		    var l = divs.length;
		    for(i = 0; i < l; i++)
		    {
			    if(DynamicPageGUIAdaptor.CSS_CLASS_NAME == divs[i].className) break;
		    }
	
		    if(i < l)
		    {
			    // Found dynamic page div, so copy across the html.
			    var innerHTML = divs[i].innerHTML;
			    this.m_element.innerHTML = innerHTML;
			
			    // Rewrite and execute each inline script
			    var scripts = this.m_element.getElementsByTagName("SCRIPT");
			    for(i = 0, l = scripts.length; i < l; i++)
			    {
				    var script = scripts[i];
				    var scriptText = script.innerHTML.replace(
					    DynamicPageGUIAdaptor.SCRIPT_REWRITE_REGEX,
					    "createAsInnerHTML$1(scriptTag, Renderer.AFTER_ELEMENT, "
				    );
				
				    // Create a new function to execute rewritten function in.
				    var fn = new Function(
					    "scriptTag",		// Re-written function requires scriptTag argument
					    scriptText			// The re-written script which makes up the body of the Function
				    );
				
				    // Call the function, passing in the script element reference in as an argument.
				    fn.call(null, script);
			    }
	
			    // View is ready.
			    this.m_loadingState = DynamicPageGUIAdaptor.STATE_LOADED;

			    // Check if config is loaded and if it is start adding adaptors to the form controller.
			    if(DynamicPageGUIAdaptor.STATE_LOADED == this.m_configLoadingState)
			    {
				    this._pageAndConfigReady(true);
			    }
		    }
		    else
		    {
			    // Failed to find dynamic page div
			    throw new fwException( "Failed to load page. Couldn't find DynamicPanel." );
		    }
		    
		}
		catch(ex)
		{
		    // Exception may be caused by exception in page creation or failure to locate
		    // dynamic page div.
            
            // Exception handling depends on debug mode of application
            if(FormController.getDebugMode() == false)
            {
                // First hide progress bar
                this._hideProgressBar();
                
                // Production mode so handle exception as fatal error
                destroyIframe = false;
                
                // Store exception for delayed handling
                this.m_pageCreationException = ex;
                
                var thisObj = this;
                setTimeout( function(){ thisObj._handlePageCreationException(); }, 0 );
            }
            else
            {
                // Debug mode. Throw exception to be handled by loading mechanism.
                throw ex;
            }
		}
	}
	else
	{
	    // Input error message was not null.
		this.m_element.innerHTML = "Failed to load page. Error message was:<br>" + errorMessage;

		this._hideProgressBar();
	}
		
	if(destroyIframe)
	{	
	    // Remove iframe - needs to be done after event handler has finished executing
	    var thisObj = this;
	    setTimeout(function() { thisObj._destroyIframe(); }, 0);
	}
}


DynamicPageGUIAdaptor.prototype._configLoaded = function()
{
	this.m_configLoadingState = DynamicPageGUIAdaptor.STATE_LOADED;
	
	if(DynamicPageGUIAdaptor.STATE_LOADED == this.m_loadingState)
	{
		this._pageAndConfigReady();
	}
}

/**
 * Method sets up dynamic page adaptors after the associated HTML, javascript
 * configuration and stylesheet pages have been loaded.
 *
 * @param exceptionsHandledExternally Optional boolean flag that indicates
 *                                    whether or not exceptions thrown by
 *                                    the method will be handled in a
 *                                    try/catch method further up the
 *                                    call stack. If not defined the value is
 *                                    assumed to be "false".
 *
*/
DynamicPageGUIAdaptor.prototype._pageAndConfigReady = function( exceptionsHandledExternally )
{
	// If stylesheet is loaded as well then we're all good, so add adaptors
	// to page. Otherwise wait a while to give stylesheet a chance to load.
	if(this.m_cssLoaded)
	{
	    if(exceptionsHandledExternally == true)
	    {
	        // Set up adaptors for dynamic page components
		    this._createAndConfigureAdaptors();
		
		    // If necessary hide progress bar
		    this._hideProgressBar();
		}
		else
		{
		    // Exceptions must be handled by this method
		    var progressBarHidden = false;
		    
		    try
		    {
		        // Set up adaptors for dynamic page components
		        this._createAndConfigureAdaptors();
		
		        // If necessary hide progress bar
		        this._hideProgressBar();
		        
		        progressBarHidden = true;
		        
		    }
		    catch(ex)
		    {
		        if(!progressBarHidden)
		        {
		            this._hideProgressBar();
		        }
		        
		        // Handle exception
		        if(FormController.getDebugMode() == false)
		        {
		            var fwEx = ex instanceof fwException ? ex : new fwException( ex.message );
		            
		            fwException.invokeFatalExceptionHandler( fwEx );
		        }
		        else
		        {
		            // Set content of dynamic page inner HTML
		            this.m_element.innerHTML = "Failed to load page. Error message was:<br>" +
		                                       ex.message;
		        }
		    }  // End of catch block
		}
	}
	else
	{   
		var thisObj = this;
		setTimeout(function() { thisObj._pageAndConfigReady(); }, 50);
	}
	
}


DynamicPageGUIAdaptor.configLoadComplete = function(pageId)
{
	Services.getAdaptorById(pageId)._configLoaded();
}


DynamicPageGUIAdaptor.prototype._destroyIframe = function()
{
	// Hang on to iframe itself
	var iframe = this.m_iframe.getFrame();
	
	// Dispose of the fwFrameManager class
	this.m_iframe.dispose();
	this.m_iframe = null;
	
	// Remove the iframe
	iframe.parentNode.removeChild(iframe);
}


DynamicPageGUIAdaptor.prototype._pageCSSLoaded = function()
{
	// Set stylesheet now loaded
	this.m_cssLoaded = true;
	
	// Remove page stylesheet onload handler
	if(null != this.m_onLoadHandlerKey)
	{
		SUPSEvent.removeEventHandlerKey(this.m_onLoadHandlerKey);
		this.m_onLoadHandlerKey = null;
	}
}

DynamicPageGUIAdaptor.prototype._handlePageCreationException = function()
{
    // Process stored exception
    var ex = this.m_pageCreationException;
    this.m_pageCreationException = null;
    
    ex = ex instanceof fwException ? ex : new fwException( ex.message );
    
    // Remove temporary iframe
    this._destroyIframe();
    
    // Handle exception
    fwException.invokeFatalExceptionHandler( ex );
}     

/**
 * Method creates, configures and, if necessary, initialises the
 * adaptors for the dynamic page's components.
 *
*/
DynamicPageGUIAdaptor.prototype._createAndConfigureAdaptors = function()
{
    var fc = FormController.getInstance();
    
    // Create the DynamicPageGUIAdaptor and add it to the Form Controller
	var gaf = fc.getFormView().getGUIAdaptorFactory();
		
	// Get adaptors which are children of this page
	var adaptors = gaf._parseElement(this.m_element, this, false);
		
	// Add the page to the Form Controller
	fc.addAdaptors(adaptors);
		
	// Run initialise methods for dynamic page adaptors
	fc.runInitialiseLifecycle(adaptors);
}

/**
 * Method hides progress bar if dynamic page has been configured
 * to display progress bar when loaded.
 *
 */
DynamicPageGUIAdaptor.prototype._hideProgressBar = function()
{
    if(this.m_showProgress)
    {
        var ac = FormController.getInstance().getAppController();
        ac._hideProgress();
    }
}
