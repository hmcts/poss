//==================================================================
//
// SubmitFormBusinessLifeCycle.js
//
//
//==================================================================

/**
 * Class provides Form submit event processing. This includes both
 * the configuration to handle form submission events and the subsequent
 * data processing tasks associated with submitting a form.
 *
 * @constructor
 *
*/
function SubmitFormBusinessLifeCycle()
{
}

/**
 * SubmitFormBusinessLifeCycle is a sub class of BusinessLifeCycle
 *
*/
SubmitFormBusinessLifeCycle.prototype = new BusinessLifeCycle();

/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
*/
SubmitFormBusinessLifeCycle.prototype.constructor = SubmitFormBusinessLifeCycle;


SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE = "navigate";
SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM = "form";
SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM = "custom";

/* 
 * Define class logger
 */
SubmitFormBusinessLifeCycle.m_logger = new Category( "SubmitFormBusinessLifeCycle" );

/**
 * Define class instance members
 *
 * Variable to store details for form submit
 *
*/
SubmitFormBusinessLifeCycle.prototype.m_submitConfig = null;

/**
 * Variable to store details of post submit action when action
 * defined by additional event on life cycle event detail
 *
*/
SubmitFormBusinessLifeCycle.prototype.m_dynamicPostSubmitEvent = null;

/**
 * Variable used to indicate what to do with returned DOM when form
 * remains on the same page in either create or modify mode
 *
*/
SubmitFormBusinessLifeCycle.prototype.m_useSubmitResponseAsModel = null;


/**
 * Create a new instance of the SubmitFormBusinessLifeCycle class
 *
 * @return Returns a new instnace of the class SubmitFormBusinessLifeCycle
 *
*/
SubmitFormBusinessLifeCycle.create = function()
{
    var submitFormBusinessLifeCycle = new SubmitFormBusinessLifeCycle();
    return submitFormBusinessLifeCycle;
}

/**
 * Create closure for submit service exception handler. Note, this function
 * differs from the generic function on FormBusinessLifeCycleDelegate because
 * the exception handler requires details of any dynamic post submit life cycle
 * event.
 *
 * @param exceptionName  Name of exception to be handled
 * @param thisObj        Reference to instance of class SubmitFormBusinessLifeCycle
 *
*/
SubmitFormBusinessLifeCycle.createClosureForExceptionHandler = function(exceptionName, thisObj)
{
    return function(e){ return thisObj.m_exceptionHandlers[exceptionName](e, thisObj.m_dynamicPostSubmitEvent);};
}


/**
 * Get the name of the business life cycle
 *
 * @return String the name of the business life cycle
 *
*/
SubmitFormBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_SUBMIT;
}


/**
 * Locate and store reference to submit configuration object defined for form
 *
 * @param cs an Array of configuration objects ordered with
 *           most specific items first.
 *
*/
SubmitFormBusinessLifeCycle.prototype._configure = function(submitConfig)
{
    // Retrieve life cycle configuration
    this.m_submitConfig = submitConfig;
    
    if( null == this.m_submitConfig )
    {
    	return;
    }
    
    // Configure the check to see if a clean data model should stop a submit action
    if (null != this.m_submitConfig.stopOnCleanData)
    {
   		this.m_stopOnCleanData =  this.m_submitConfig.stopOnCleanData;
    }
    else
    {
    	//default
   		this.m_stopOnCleanData = function(){return false;};
    }
    
    // Retrieve post submit action configuration
    this.m_postSubmitActionConfig = this.m_submitConfig[ "postSubmitAction" ];
        
    if(null == this.m_postSubmitActionConfig)
    {
        throw new ConfigurationException( "Missing postSubmitAction for form submit life cycle" );
    }
    
    // Check post submit action configuration for desired action
    var navigationAction = this.m_postSubmitActionConfig[ SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE ];
    var formAction = this.m_postSubmitActionConfig[ SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM ];
    var customAction = this.m_postSubmitActionConfig[ SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM ];
            
    if(null != navigationAction)
    {
        this.m_postSubmitAction = SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE;
                
        // Retrieve navigation form target
        this.m_formName = navigationAction[ "formName" ];
                
        if(null == this.m_formName)
        {
            throw new ConfigurationException( "Missing form name for form post submit navigation action configuration" );
        }
                
        // Retrieve pre-navigate state save information
        this.m_state = null;
        var state = navigationAction[ "state" ];
                
        if(state != null)
        {
            var stateLength = state.length;
                    
            if(stateLength > 0)
            {
                this.m_state = new Array(stateLength);
                        
                for(var i = 0; i < stateLength; i++)
                {
                    this.m_state[i] = state[i];
                }
            }
        }
    }
    else if(null != formAction)
    {
        // Configure form action
        this.m_postSubmitAction = SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM;
        
        if(typeof formAction == "string")
        {
            this.m_formAction = formAction;
        }
        else if(typeof formAction == "object")
        {
            // Form action defined by object with properties
            // state and useSubmitResponseAsModel
            this.m_formAction = formAction[ "state" ];
            
            var useSubmitResponseAsModel = formAction[ "useSubmitResponseAsModel" ];
            
            if(null != useSubmitResponseAsModel)
            {
                this.m_useSubmitResponseAsModel = useSubmitResponseAsModel;
            }
        }
                
        if(!this._validState(this.m_formAction))
        {
            throw new ConfigurationException( "Invalid form state in form post submit action configuration" );
        }
                
    }
    else if(null != customAction)
    {
        // Configure custom action
                
        this.m_postSubmitAction = SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM;
                
        this.m_customAction = customAction;
                
        if( typeof this.m_customAction != "function" )
        {
            throw new ConfigurationException( "Invalid form post submit action configuration. Custom option must define a function." );
        }
    }
            
	if (this.m_postSubmitAction == null)
	{
        throw new ConfigurationException( "Invalid form configuration. The postSubmitAction configuration must define the post submit action." );
	}            
    // Reset local variables storing configuration details
    navigationAction = null;
    formAction = null;
    customAction = null;
    
    // Check for pre-dynamic post submit event processing property
    var preDynamicPostSubmitEventProcess = this.m_submitConfig.preDynamicPostSubmitEventProcess;
    
    if(null != preDynamicPostSubmitEventProcess)
    {
        if(typeof preDynamicPostSubmitEventProcess != "function")
        {
            throw new ConfigurationException( 'Error with configuration property ' +
                                              'preDynamicPostSubmitEventProcess. ' +
                                              'Property must be of type "function"' );
        }
    }
    
    preDynamicPostSubmitEventProcess = null;
}


/**
 * Invoke the business logic associated with the submit form business
 * life cycle
 *
 * @param e The business life cycle event
*/
SubmitFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
    // Check event detail for dynamic post submit event. This will be present
    // if submit is performing a save for a different life cycle event.
    this.m_dynamicPostSubmitEvent = null;
    
    var eventDetail = e.getDetail();
    
    if(null != eventDetail)
    {
        this.m_dynamicPostSubmitEvent = eventDetail[ "postSubmitEventDetails" ];
    }
    
    // Submit form data to server
	var state = this.m_adaptor._getState();
    
    if(state != FormElementGUIAdaptor.FORM_CREATE &&
       state != FormElementGUIAdaptor.FORM_MODIFY)
    {
    	var ac = Services.getAppController();
		var title = ac.getCurrentForm().getTitle();
		var msg;

		// If no title then use id from <form> HTML tag
		if (null == title || "" == title)
		{
			title = this.m_adaptor.getId();
		}
        
        msg = "Form '" + title + "' cannot be submitted in its current state";

        // Raise OK dialog box
        Services.showAlert( msg );

        return;
    }
    
   	if (!this._formValid())
   	{
   		return;
   	} 
    
   	// If the form has dirty data then submit it, otherwise do _postSubmitAction
   	// if next state in not MODIFY. 
   	if (this.m_adaptor._isDirty())
   	{
   		this._submitData();
   	}
   	else
   	{
   		// If configured to stop if the datamodel is not dirty OR
   		// If the next state is modify then we can't go forward
   		// as we need to receive data from the server.
		if (this.m_stopOnCleanData() == true ||
		    (this.m_postSubmitAction == SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM
			&&  this.m_formAction == FormElementGUIAdaptor.FORM_MODIFY)
		    )
   		{        			
	        // Raise OK dialog box
	        Services.showAlert( "Not submitting data to server as nothing has changed" );

   			return;
   		}
   		else
   		{
   			// Not calling service but still do postSubmitAction
			this._postSubmitAction();		
   		}
   	} 
}


/*
 * Checks form validity
 *
 * @returns - true if form valid, false otherwise.
 */
SubmitFormBusinessLifeCycle.prototype._formValid = function()
{
    var fc = FormController.getInstance();
    
    var invalidFields = fc.validateForm(true,true);
    if(invalidFields.length != 0)
    {
    	return false;
    }
    return true;
}


/*
 * Submits data to the where ever it should go. In this implementation
 * that is a service call to the server.
 * Is overriden in subclass.
 */
SubmitFormBusinessLifeCycle.prototype._submitData = function()
{
   	this._callService();
}


/*
 * Calls a web service on the server
 */
SubmitFormBusinessLifeCycle.prototype._callService = function()
{
	var adaptor = this.getAdaptor();
    var state = adaptor._getState();
    
    // Apply custom pre-submit processing
    FormBusinessLifeCycleDelegate.invokeMethod(this.m_submitConfig.preprocess);
    
    // Configure service used to save form data
    var serviceConfig = this.m_submitConfig[ state ];

    if(null == serviceConfig)
    {
        throw new ConfigurationException( "Form " + adaptor.getId() +
                                          " is not configured for submit whilst in " +
                                          state + " state." );
    }


	// This is complicated by the fact that we are attempting to maintain
	// backwards compatability with pre-8.4 versions. These earlier versions
	// didn't use the normal serviceName and serviceParam configuration
	// properties to configure remote services, choosing instead to use the
	// names "name" and "params" for these properties. Here we try and create
	// the fwDataLoader using the, now standard properties for fwDataService
	// configuration, and if that fails we try again with the old property
	// names...
	var dL = null;	
	try
	{
		dL = fwFormSubmitDataLoader.create(serviceConfig, this);
	}
	catch(ex)
	{
		// Failed to create DataLoader - try using the deprecated names for service params and try again
		serviceConfig.serviceName = serviceConfig.name;
		serviceConfig.serviceParams = serviceConfig.params;
		
		dL = fwFormSubmitDataLoader.create(serviceConfig, this);
		
		// If this didn't throw an exception Log an error
		if(SubmitFormBusinessLifeCycle.m_logger.isError()) SubmitFormBusinessLifeCycle.m_logger.trace("Submit configuration for form: " + adaptor.getId() + " is using deprecated name and params configuration properties - please update to use serviceName and serviceParams properties");		
	}
	
	dL.load();
}


/**
 * Method onSuccess continues life cycle processing following successful
 * submit to server.
 *
 * @param dom XML structure returned from server after service call
 *
*/
SubmitFormBusinessLifeCycle.prototype.onSuccess = function(dom)
{
    if(null == this.m_dynamicPostSubmitEvent)
    {
        // Standard submit life cycle
	    this._postSubmitAction(dom);
	}
	else
	{
	    // Save before performing a different life cycle
	    this._dynamicPostSubmitAction(dom);
	}
}


/**
 * Processing required after a submit. 
 * Sets datamodel to clean then invokes the appropriate post submit action
 * as defined by the configuration. Essentially, this method performs
 * the post submit actions defined by the static postSubmitAction
 * configuration.
 *
 * @param dom XML structure returned from server after service call
 *			  (can be null as submit may not have involved a service call)
*/
SubmitFormBusinessLifeCycle.prototype._postSubmitAction = function(dom)
{
    
    // As submit successful set data model clean
    this.m_adaptor._setDirty(false);
    this.m_adaptor.update();
    
    // Process configured post submit action
    if(this.m_postSubmitAction == SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE)
    {
    	this._navigate();
    }
    else if(this.m_postSubmitAction == SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_FORM)
    {
    	this._refreshForm(dom);
    }
    else if(this.m_postSubmitAction == SubmitFormBusinessLifeCycle.POST_SUBMIT_ACTION_CUSTOM)
    {
        // Post submit action is to execute a custom function
        this.m_customAction.call(this,dom);
    }
}

/*
 * Navigate to another form - copying data from the sourceNodes to the
 * target nodes.
 */
SubmitFormBusinessLifeCycle.prototype._navigate = function()
{
        var fc = FormController.getInstance();
            
        // First transfer any values to be saved
        if(null != this.m_state)
        {
            var state = null;
            var sourceValue = null;
            var sourceNode = null;
            var source = null;
            var target = null;
            var targetNode = null;
            var targetNodeChildName = null;
            var dm = fc.getDataModel();
            
            for( var i = 0, l = this.m_state.length; i < l; i++ )
            {
                state = this.m_state[i];
                
                target = state[ "target" ];
                
                if(null != target)
                {
                    sourceValue = state[ "sourceValue" ];
                    sourceNode = state[ "sourceNode" ];
                    
                    if(null != sourceValue)
                    {
                        source = dm.getValue( sourceValue );
                        
                        if(null != source)
                        {
                            dm.setValue( target, source );
                        }
                    }
                    else if(null != sourceNode)
                    {
                        source = dm.getNode(sourceNode);
                        
                        // Check for existance of target node
                        
                        targetNodeChildName = target +
                                              "/" +
                                              source.nodeName;
                        
                        targetNode = dm.getNode(targetNodeChildName);
                        
                        if(null == targetNode)
                        {
                            dm.addNodeSet(source, target);
                        }
                        else
                        {
                            dm.replaceNode(targetNodeChildName, source);
                        }
                    }
                    
                    source = null;
                    sourceValue = null;
                    sourceNode = null;
                    targetNode = null;
                }
            }
        }
       
       	var details = new Object(); 
        
		details[ "formName" ] = this.m_formName;        
		
        // Dispatch navigate event
        fc.dispatchBusinessLifeCycleEvent(this.m_adaptor.getId(),
                                          BusinessLifeCycleEvents.EVENT_NAVIGATE,
                                          details);
}


/*
 * Puts a form into the appropriate post submit state
 * 
 * @param - dom - the xml returned by web service if this call follows a
 *                webservice.  
 * @throws - ConfigurationException if the post submit state is create or modify and 
 *           the dom passed in is null.
 */
SubmitFormBusinessLifeCycle.prototype._refreshForm = function(dom)
{
	var fc = FormController.getInstance();
    // Post submit action is to refresh current form
    if(this.m_formAction == FormElementGUIAdaptor.FORM_BLANK)
    {
        // Dispatch a clear event
        fc.dispatchBusinessLifeCycleEvent( this.m_adaptor.getId(),
                                           BusinessLifeCycleEvents.EVENT_CLEAR,
                                           null );
    }
    else if(this.m_formAction == FormElementGUIAdaptor.FORM_CREATE)
    {
        // Dispatch a create event
        var detail = null;
            
        if(this.m_useSubmitResponseAsModel == true)
        {
            if(dom != null)
            {
                detail = new Object();
                detail.DOM = dom;
            }
            else
            {
        	    throw new ConfigurationException( "Post submit condition is create, but not service has been configured for submit" );
            }
        }
            
        fc.dispatchBusinessLifeCycleEvent( this.m_adaptor.getId(),
                                           BusinessLifeCycleEvents.EVENT_CREATE,
                                           detail );
    }
    else if(this.m_formAction == FormElementGUIAdaptor.FORM_MODIFY)
    {
        // Dispatch a modify event
        var detail = null;
            
        if(this.m_useSubmitResponseAsModel != false)
        {
            // Modify uses replacment XML structure returned by service
            if(dom != null)
            {
                detail = new Object();
                detail.DOM = dom;
            }
            else
            {
        	    throw new ConfigurationException( "Post submit condition is modify, but not service has been configured for submit" );
            }
        }
        
        fc.dispatchBusinessLifeCycleEvent( this.m_adaptor.getId(),
                                           BusinessLifeCycleEvents.EVENT_MODIFY,
                                           detail );
    }
}

/**
 * Method performs dynamic post submit action defined by detail
 * included in submit life cycle dispatch method call.
 *
 * @param dom XML structure returned from server after service call
 *			  (can be null as submit may not have involved a service call)
 *
*/
SubmitFormBusinessLifeCycle.prototype._dynamicPostSubmitAction = function(dom)
{
    // Retrieve post submit life cycle event type
    var postSubmitEvent = this.m_dynamicPostSubmitEvent;
    
    // If required apply pre-dynamic post submit event
    // custom processing
    var preDynamicPostSubmitEventProcess = this.m_submitConfig.preDynamicPostSubmitEventProcess;
    
    if(null != preDynamicPostSubmitEventProcess)
    {
        preDynamicPostSubmitEventProcess.call(this, 
                                              postSubmitEvent.getType(),
                                              dom);
    }
    
    // As submit successful set data model flag clean
    this.m_adaptor._setDirty(false);
    this.m_adaptor.update();
    
    // Populate submit dispatch with details from post submit event
    
    Services.dispatchEvent( postSubmitEvent.getComponentId(),
                            postSubmitEvent.getType(),
                            postSubmitEvent.getDetail() );
                            
}


/**
 * Method checks whether input argument form state is a valid state
 *
*/
SubmitFormBusinessLifeCycle.prototype._validState = function(state)
{
    var validState = true;
    
    if(state != FormElementGUIAdaptor.FORM_BLANK &&
       state != FormElementGUIAdaptor.FORM_CREATE &&
       state != FormElementGUIAdaptor.FORM_MODIFY)
    {
        validState = false;
    }
    return validState;
}


/**
 * Method parses a given xpath returning an array containing
 * the names of the nodes in the xpath.
 *
 * @param xp String The xpath to be parsed
 * @return Array of node names in xpath
 *
*/
SubmitFormBusinessLifeCycle.prototype._parseXPathNodeNames = function(xp)
{
    var s = 0;
    var lastSlash = -1;
    var nodeNames = new Array();
    var length = xp.length;
          
    if(length > 0)
    {
        if(xp.charAt(s) == '/')
        {
            s = 1;
            lastSlash = 0;
        }
          
        while( s < length )
        {
            switch(xp.charAt(s))
            {
                case '/':
                    if( s > lastSlash + 1)
                    {
                        nodeNames[nodeNames.length] = xp.substring( lastSlash + 1, s);
                        lastSlash = s;
                        s++;
                    }
                    else
                    {
                        throw new ConfigurationException( "Error target node definition contains unexpected double foreslashes" );
                    }
                    break;
                      
                default:
                    s++;
                    break;
            }
        }
        if( lastSlash != length - 1)
        {
            nodeNames[nodeNames.length] = xp.substring( lastSlash + 1, s)
        }
    }
    return nodeNames;
}



