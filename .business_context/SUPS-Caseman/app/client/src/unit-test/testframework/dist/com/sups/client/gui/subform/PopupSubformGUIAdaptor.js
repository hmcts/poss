//==================================================================
//
// PopupSubformGUIAdaptor.js
//
// Launches a subform in a popup
//
//==================================================================


//?? Temporary global variable
//??var openingPopup = false;

/**
 * Subform in a popup
 *
 * @constructor
 * @private
 */
function PopupSubformGUIAdaptor() {}


PopupSubformGUIAdaptor.CSS_CLASS_NAME = "popup popupsubform";
PopupSubformGUIAdaptor.CSS_CLASS_NAME_FULLPAGE = "popup popupsubform popup_fullscreen";

/**
 * Static variable storing identifier for subform currently being precompiled
*/
PopupSubformGUIAdaptor.m_currentPrecompilationSubformId = null;

PopupSubformGUIAdaptor.m_logger = new Category("PopupSubformGUIAdaptor");

/**
 * PopupSubformGUIAdaptor is a sub class of AbstractPopupGUIAdaptor
 */
PopupSubformGUIAdaptor.prototype = new AbstractPopupGUIAdaptor();

/**
 * Add the required protocols to the PopupSubformGUIAdaptor
 */
GUIAdaptor._setUpProtocols('PopupSubformGUIAdaptor');

// No further protocols required for this adaptor
//GUIAdaptor._addProtocol('PopupSubformGUIAdaptor', 'DynamicLoadingProtocol');			// Supports dynamic loading and unloading of subforms


PopupSubformGUIAdaptor.prototype.constructor = PopupSubformGUIAdaptor;


/**
 * The name of the subform to load
 *
 * @type String
 * @configuration
 */
PopupSubformGUIAdaptor.prototype.subformName = null;


/**
 * Flag indicating whether the subform should be destroyed when it is closed
 * (and re-created again from scratch when it is shown again), or whether it
 * is simply hidden (and simply re-initialised when it is shown again).
 *
 * @type boolean
 * @configuration
 */
PopupSubformGUIAdaptor.prototype.destroyOnClose = null;


/**
 * An array of nodes related to /ds/var returned by the subform.
 *
 * @type HTMLIFrameElement
 * @private
 */
PopupSubformGUIAdaptor.prototype.m_returnedDOM = null;


/**
 * The subform view manager
 *
 * @type HTMLFrameFormViewManager
 * @private
 */
PopupSubformGUIAdaptor.prototype.m_subformView = null;

/**
 * Instance variable storing reference to HttpRequest object used
 * to download precompilation data.
 *
 * @type XMLHttpServiceRequest
 * @private
*/
PopupSubformGUIAdaptor.prototype.m_httpRequest = null;


/**
 * Flag to keep track of whether the subform's FormController has been initialised or not
 *
 * @type boolean
 * @private
 */
PopupSubformGUIAdaptor.prototype.m_subformInitialised = false;

/**
 * Create a new PopupSubformGUIAdaptor
 *
 * @param e the div element which represents the popup subform on the parent form
 * @return the new PopupSubformGUIAdaptor
 * @type PopupSubformGUIAdaptor
 */
PopupSubformGUIAdaptor.create = function(e)
{
    if(PopupSubformGUIAdaptor.m_logger.isTrace()) PopupSubformGUIAdaptor.m_logger.trace("create()");
    var a = new PopupSubformGUIAdaptor();
    a._initialiseAdaptor(e);
    return a;
}


/**
 * Initialise the PopupSubformGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
PopupSubformGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
    if(PopupSubformGUIAdaptor.m_logger.isTrace()) PopupSubformGUIAdaptor.m_logger.trace("_initialiseAdaptor()");
    
    // Call parent class initialisation
    AbstractPopupGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
    
}


/**
 * Clean up after the component
 */
PopupSubformGUIAdaptor.prototype._dispose = function()
{
    // Get rid of the subform iframe and any running formcontroller.
    this._destroySubForm();

    // Call super class dispose
    AbstractPopupGUIAdaptor.prototype._dispose.call(this);
}



/**
 * Perform any GUIAdaptor specific configuration
 *
 * @param cs an array of objects containing configuration properties
 */
PopupSubformGUIAdaptor.prototype._configure = function(cs)
{
    // Call super class _configure
    AbstractPopupGUIAdaptor.prototype._configure.call(this, cs);
    
    for(var i = 0, l = cs.length; i < l; i++)
    {
        var c = cs[i];
    
        if(c.subformName != null && this.subformName == null)
        {
            this.subformName = c.subformName;
        }

        if(c.styleURL != null && this.styleURL == null)
        {
            this.m_styleURL = c.styleURL;
        }
        
        if(c.processReturnedData != null && this.processReturnedData == null)
        {
            this.m_processReturnedData = c.processReturnedData;     
        }
        
        if (c.replaceTargetNode != null && this.replaceTargetNode == null)
        {
            // Setup configuration for data returned from the subform.
            this.replaceTargetNode = c.replaceTargetNode; 
        }
        
        if (c.addTargetNode != null && this.addTargetNode == null)
        {
            // Setup configuration for data returned from the subform.
            this.addTargetNode = c.addTargetNode;
        }
        
        if(c.destroyOnClose != null && this.destroyOnClose == null)
        {
        	this.destroyOnClose = c.destroyOnClose;
        }
    }
    
    // Default destroyOnClose to false
    if(null == this.destroyOnClose || typeof this.destroyOnClose != 'boolean')
    {
    	this.destroyOnClose = true;
    }
    
    if(null == this.subformName)
    {
        throw new ConfigurationException("PopupSubformGUIAdaptor, no subformName specified for adaptor id = " + this.getId() + ", this is a mandatory configuration property!");
    }
}


/*
 * D760/D828 - D760 fix was to move the border onto the body element but this
 * caused problems for Crest with grid columns wrapping as subform had shrunk
 * in width by 4 pixels. So the solution is for popup subforms is to hide any
 * selects that they overlap when the subform is raised. We can use the basic
 * popup layer for this.
 *
PopupSubformGUIAdaptor.prototype._showPopupLayer = function(showMe)
{
	if(showMe == true)
	{
		this.m_popupLayer.show(false);
	}
	else
	{
		this.m_popupLayer.hide(false);
	}
}
*/

/**
 * Method handles display and hiding of subform popup.
 *
 * @param showMe Boolean value indicating whether to display popup or hide popup.
 * @param currentFocussedAdaptorId This parameter is generally null. However,
 *                                 when a popup is raised using a hot key combination
 *                                 and the current focussed adaptor on the main form
 *                                 is an IE select this parameter will contain the
 *                                 identifier of the select.
 *
*/
PopupSubformGUIAdaptor.prototype._show = function(showMe, currentFocussedAdaptorId)
{
    var ac = null;
    
    if(showMe)
    {
        // Display progress bar to stop users interfering with popup
        // whilst it is created and data loaded
        ac = Services.getAppController();
        
        ac._showProgress();
    }
    //??else
    //??{
        // Temporaily use this to close progress bar until formReady
        // handler reactivated
        //??var ac = FormController.getInstance().getAppController();
    
        //??ac._hideProgress();
    //??}
       
    // Make div invisible so that nothing is accessible while sub form initialises    
    this.getElement().style.visibility = "hidden";

	// Invoke parent show(). Because we are doing this before loading/initialising
	// the subform then if it does not have a height set then the first time it is
	// raised any selects that it overlaps will not be hidden and will show through
	// the subform's border.
	AbstractPopupGUIAdaptor.prototype._show.call(this, showMe, currentFocussedAdaptorId);
	
	if(showMe)
	{
	    //??openingPopup = true;
	    
		if(null == this.m_subformView)
		{
			this.invokeLoad();
		}
		else
		{
		    // Defect 1113. Inform appcontroller
		    // that subform is the current form.
		    ac.setCurrentFormByName(this.subformName);
		    
		    // Set up initial data for subform
			this._initialiseSubForm();
		}
	}
	else
	{
		this.invokeUnload();
		
		//??openingPopup = false;
	}
}



PopupSubformGUIAdaptor.prototype._isAdaptorChildOfPopup = function(adaptor)
{
    // When a popup subform is raised, all adaptors on the parent 
    // adaptors are to be disabled.
    return false;
}



PopupSubformGUIAdaptor.prototype._createFormView = function()
{
    this._createIFrame();
}


PopupSubformGUIAdaptor.prototype._createIFrame = function()
{
    var ac = Services.getAppController();
    
    // Store the "old" form config to be used when the subform is closed    
    this.m_previousFormName = ac.getCurrentForm().getName();
    
    // Set the current form in the appcontroller to be the subform
    ac.setCurrentFormByName(this.subformName);
    
    // Get the outer div element
    var e = this.getElement();

	// Create the subform view, and register a handler with it that will
	// be invoked when the view is loaded.
    this.m_subformView = HTMLFrameFormViewManager.createManagedIFrame(e, "popupsubformframe");
    
	// Register listeners in an isolated function to reduce scope of closure.
	this.registerViewAndFormReadyListeners();

    // Get the URL for the subform and instruct the subform view to load the URL
    var subformURL = this._getSubformURL();
    var styleSheets = ac.getCSSDefinitionsForForm(this.subformName);
    
    this.m_subformView.loadView(subformURL, styleSheets);
    
}

/**
 * Assign view and form ready listeners in isolated function such that closure
 * does not include any unrelated variables.
 *
*/

PopupSubformGUIAdaptor.prototype.registerViewAndFormReadyListeners = function()
{
    var thisObj = this;
    
    // Register a listener with the view to let us know when the html and the framework are loaded
    this.m_subformView.registerViewReadyListener(function() { thisObj._viewLoaded(); });
	
	// Register a listener with the view to let us know when everything is ready to go
	this.m_subformView.registerFormReadyListener(function() { thisObj._formReadyHandler(); });
}


PopupSubformGUIAdaptor.prototype._getSubformURL = function()
{
    var ac = Services.getAppController();
    
	return ac.getURLForForm(this.subformName);
}

PopupSubformGUIAdaptor.prototype._initialiseSubForm = function()
{
    // Get the nodes to pass to the subform
    var initialData = Services.getNodes("/ds/var/app | /ds/var/form");

	if(this.m_subformInitialised)
	{
		// Get the subform's FormController to re-initialise itself
		var fc = this._getSubformFormController();
		fc.reinitialise(initialData);
	}
	else
	{
	    // Start the FormController on the page
    	this.m_subformView._startFormController(initialData, this, false);
    	
    	// Keep track of the fact that the subform's FormController has been initialised.
    	this.m_subformInitialised = true;
    }
    
    // Clear the returned DOM
    this.m_returnedDOM = null;  
}


PopupSubformGUIAdaptor.prototype._formReadyHandler = function()
{
    // Note that this listener function will be executed
    // when both new and reinitialised subforms enter
    // the form ready state.

	var cssClass = this.getElement().className;

	if(cssClass.lastIndexOf("popup_fullscreen") == -1)
	{
		var iframeDoc = this.m_subformView._getDocument();

		// Get the style for the div
		var style = getCalculatedStyle(this.getElement());
		var contentHeight;

		// Check if div has a height specified
		if(style.height != "auto")
		{
			// iframe height based on height of div
			contentHeight = Number(style.height.slice(0, -2));
		
			// Resize content height to fill div
			iframeDoc.body.style.height = contentHeight;
		}
		else
		{
			// iframe height based on height of content
			contentHeight = iframeDoc.body.clientHeight;

			// Set the height of the div to prevent it sizing to the bottom of
			// the screen and then shrinking to the content height. (Can't avoid
			// this first time subform is raised but sizes it correctly next time.)
			this.getElement().style.height = contentHeight + "px";
		}

		// Resize iframe height
		var iframe = this.m_subformView.m_frame.getFrame();
		iframe.style.height = contentHeight + "px";
	}

    // Make the div containing the iframe visible
    this.getElement().style.visibility = "inherit";
    
    // Remove progress bar because subform is properly loaded
    var ac = FormController.getInstance().getAppController();

    ac._hideProgress();
}


PopupSubformGUIAdaptor.prototype.setReturnedDOM = function(nodes)
{
    this.m_returnedDOM = nodes;
    
    // Apply DOM datamodel changes from the subform
    if (this.m_returnedDOM != null)
    {
        Services.replaceNode("/ds/var/app", this.m_returnedDOM["app"]);
        Services.replaceNode("/ds/var/form", this.m_returnedDOM["form"]);
    }
}

/*
 * Callback function from the subform which passes in the subform specific
 * DOM fragments to be applied to the form's DOM.
 *
 * @param addSourceNodes - an array of nodes to be added to the corresponding 
 *                   addTargetNode location.
 * @param replaceSourceNodes - an array of nodes to replace the corresponding 
 *                       replaceTargetNode location.
 */
PopupSubformGUIAdaptor.prototype.setReturnedData = function(returnSourceNodes)
{
    // Temporarily reset the AppController's current for back to the parent.
    var ac = Services.getAppController();
    ac.setCurrentFormByName(this.m_previousFormName);
    
    var targetNode;
    var returnedNode;
    
    if (returnSourceNodes == null)
    {
        return; 
    }

    if (this.replaceTargetNode != null)
    {
        for (var i=0; i < this.replaceTargetNode.length; i++)
        {
            targetNode = this.replaceTargetNode[i];
            returnedNode = returnSourceNodes[targetNode.sourceNodeIndex];
            Services.replaceNode(targetNode.dataBinding, returnedNode);
        }
    }
    
    if (this.addTargetNode != null)
    {
        for (var i=0; i < this.addTargetNode.length; i++)
        {
            targetNode = this.addTargetNode[i];
            returnedNode = returnSourceNodes[targetNode.sourceNodeIndex];
            
            Services.addNode(returnedNode, targetNode.dataBinding);
        }
    }
    
    // Invoke custom processing function
    if (this.m_processReturnedData != null 
        && typeof this.m_processReturnedData == "function")
    {
        this.m_processReturnedData();
    }
    
    // Fire processEvents as we want to catch any outstanding businessLifeCycles
    FormController.getInstance().processEvents();
    
    // Reset the form to the subform 
    ac.setCurrentFormByName(this.subformName);
}


PopupSubformGUIAdaptor.prototype._destroySubForm = function()
{
	if(null != this.m_subformView)
	{
	    // Make iframe invisible
	    this.getElement().style.visibility = "hidden";
	    
		// Dispose of the subform FormController
		this.m_subformView._disposeFormController();
		
		// Unbind view
		this.m_subformView.dispose();
		
		this.m_subformView = null;

		// Get the outer div element
		var e = this.getElement();
		
		// Eradicate the IFrame
		e.innerHTML = ""
	
	    // Will need to re-initialise the form controller next time.
	    this.m_subformInitialised = false;
	}    
}


PopupSubformGUIAdaptor.prototype._getSubformFormController = function()
{
	return this.m_subformView.getFormController();
}



/**
 * @todo: Ideally we'd implement this using the DynamicLoadingProtocol,
 *   however time constraints mean this is not possible at this time.
 *
 *   DynamicLoadingProtocol would allow the application to precisely
 *   control the loading and unloading of the PopupSubform using the
 *   load()/unload()/loadOn/unloadOn configuration items.
 *   Note that if DynamicLoadingProtocol is implemented, there will be
 *   a need to split the current form controller initialisation into
 *   a further phase as follows:
 *
 *     - At the time of loading it will be only possible to perform
 *       the following parts of form controller initialisation:
 *        - Parsing of HTML to locate/create adaptors
 *        - Configuration of adaptors
 *        - Initialisation of tabbing manager with correct tabbing
 *          order.
 *       It will not be possible to execute the following activities
 *        - Anything which depends on the state of datamodel, as the
 *          subform's datamodel cannot be initialised until it is raised,
 *          as there is no guarantee that the parent DataModel is in the
 *          correct state to populate the the subforms DataModel with its
 *          initial data.
 *          - Loading of reference data which depends on parameters
 *            extracted from the Data Model
 *          - Loading of model data
 *          - Determination and setting of the initial states of the form
 *            fields (such as enablement, value, readonly etc).
 *
 *   The current solution is forward compatible with any
 *   DynamicLoadingProtocol - the code is included below - the issue is
 *   entirely with FormController initialisation. 
 *
 */
PopupSubformGUIAdaptor.prototype.invokeLoad = function()
{
	this._createFormView();
}


PopupSubformGUIAdaptor.prototype.invokeUnload = function()
{
	if(this.destroyOnClose)
	{
		this._destroySubForm()
	}
    // Set the current form back to what it was before.
	var ac = Services.getAppController();
    ac.setCurrentFormByName(this.m_previousFormName);	    
}

/*
PopupSubformGUIAdaptor.prototype.load = function()
{
	// Load the popup if it is not raised
	return AbstractPopupGUIAdaptor._isPopupRaised(this.getId());
}


PopupSubformGUIAdaptor.prototype.unload = function()
{
	var isRaised = AbstractPopupGUIAdaptor._isPopupRaised(this.getId());
	// Don't unload popup if it is raised or destroyOnClose is false
	return (!(isRaised || !this.destroyOnClose));
}


PopupSubformGUIAdaptor.prototype.handleLoad = function()
{
	this._createFormView();
}


PopupSubformGUIAdaptor.prototype.handleUnload = function()
{	
	this._destroySubForm();
}
*/

/**
 * Method determines whether, or not, the FormController class instance
 * associated with the subform's view exists.
 *
 * @return Returns "true" if FormController associated with subform view
 *         exists otherwise "false".
 *
*/
PopupSubformGUIAdaptor.prototype.subformViewFormControllerExists = function()
{
    var formControllerExists = false;

    if(null != this.m_subformView)
    {
        if(null != this.m_subformView.getFormController())
        {
            formControllerExists = true;
        }
    }

    return formControllerExists;
}

/**
 * Method sets flag on subform view's associated FormController controlling enablement
 * of submission of life cycle events.
 *
 * @param allowEventSubmission Boolean flag indicating whether, or not, the subform view's
 *                             associated form controller should allow life cycle events
 *                             to be submitted.
 *
*/
PopupSubformGUIAdaptor.prototype.setSubformViewFormControllerBusinessLifeCycleEventSubmission = function( allowEventSubmission )
{
    this.m_subformView.getFormController().setAllowBusinessLifeCycleEventSubmission( allowEventSubmission );
}

/**
 * Method invoked after HTML for subform has loaded.
 *
*/
PopupSubformGUIAdaptor.prototype._viewLoaded = function()
{
    // Load the page specific stylesheet
    if(this.m_styleURL != null)
    {
        var headElement = GUIUtils.getDocumentHeadElement(this.m_subformView._getDocument());
        GUIUtils.createStyleLinkElement(headElement, this.m_styleURL, null);
    }

    // Initiate precompilation loading if required
    this._loadPrecompile();
}

/**
 * Method loads precompilation file corresponding to subform using
 * HttpRequest object.
 *
*/
PopupSubformGUIAdaptor.prototype._loadPrecompile = function()
{
    var ac = Services.getAppController();

    // Get details of subform
    var subformDetails = ac.getCurrentForm();

    // Check whether, or not, subform has been precompiled
    if(ac.m_config.getPrecompileEnabled() && 
       (subformDetails.getPrecompile() != "no"))
    {
        // Prepare for download of precompilation data

        // Store reference to subform identifier. This will be required by the
        // service call ready state change handler
        PopupSubformGUIAdaptor.m_currentPrecompilationSubformId = this.getId();

        // Construct URL of precompiled page
        var url = ac.m_rootURL + 
                  ac.m_config.getAppBaseURL() +
                  "/precompile/" +
                  subformDetails.getName() +
                  ".js";

        // Set async to "false" as call must be synchronous
        var async = false;

        // Create and initialise XMLHttpRequest wrapper object
        this.m_httpRequest = new XMLHttpServiceRequest();

        this.m_httpRequest.initialise( this, url, async, null, handleSubformPrecompileReadyStateChange );

        // Send "GET" request
        this.m_httpRequest.sendGET( "loadPrecompiled" );
    }
    else
    {
        // Subform does not require precompilation
        this._loadPrecompileComplete();
    }
}

/**
 * Independent function used to handle ready state changes on 
 * XMLHttpRequest object used to download subform precompilation
 * data.
*/
function handleSubformPrecompileReadyStateChange()
{
    // Define reference to form controller. This should be
    // the form controller in the window of the main form.
    var fc = FormController.getInstance();
    
    // Determine reference to popup subform GUI adaptor
    var adaptor = fc.getAdaptorById( PopupSubformGUIAdaptor.m_currentPrecompilationSubformId );
    
    // Retrieve request object
    var request = adaptor.m_httpRequest.getRequest();
    
    if(request.readyState == 4)
    {
        if(request.status == 200)
        {
            var javascript = request.responseText;
            
            // Execute precompilation code in subform window
            adaptor.m_subformView.m_frame.m_frame.contentWindow.eval(javascript);
        }
        
        // Clean up request object
        adaptor.m_httpRequest.dispose();
        adaptor.m_httpRequest = null;
        
        // Clear stored subform id
        PopupSubformGUIAdaptor.m_currentPrecompilationSubformId = null;
        
        // Invoke subform post pre-compilation code
        adaptor._loadPrecompileComplete();
    }
    
    // Clean remaining references
    request = null;
    adaptor = null;
    fc = null;
}

/**
 * Method continues subform initialisation following precompilation
 * or view ready state achieved if no precompilation.
 *
*/
PopupSubformGUIAdaptor.prototype._loadPrecompileComplete = function()
{
    // Initialise the form controller in the subform
    this._initialiseSubForm();
}
    
