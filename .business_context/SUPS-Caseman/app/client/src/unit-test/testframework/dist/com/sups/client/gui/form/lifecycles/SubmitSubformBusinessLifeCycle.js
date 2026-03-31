//==================================================================
//
// SubmitSubformBusinessLifeCycle.js
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
function SubmitSubformBusinessLifeCycle()
{
}

/**
 * SubmitSubformBusinessLifeCycle is a sub class of SubmitFormBusinessLifeCycle
 *
*/
SubmitSubformBusinessLifeCycle.prototype = new SubmitFormBusinessLifeCycle();

SubmitSubformBusinessLifeCycle.prototype.getName = function()
{
    return BusinessLifeCycleEvents.EVENT_SUBMIT;
}

SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE = "close";
            
/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
*/
SubmitSubformBusinessLifeCycle.prototype.constructor = SubmitSubformBusinessLifeCycle;


SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CANCEL = SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_NAVIGATE;

/*
 * See if close configuration option is selected, otherwise call parent.
 */
SubmitSubformBusinessLifeCycle.prototype._configure = function(submitConfig)
{
    // Retrieve life cycle configuration
    this.m_submitConfig = submitConfig;
    
    if( null != this.m_submitConfig )
    {
   		// Retrieve the source data arrays. 
        var returnSourceNodes = this.m_submitConfig[ "returnSourceNodes" ];

		if (null != returnSourceNodes)
		{
			// Setup configuration for data returned from the subform.
		    this.m_returnSourceNodes= new Array(); 
		                
		   	for (var i=0; i < returnSourceNodes.length; i++)
		   	{
			   		this.m_returnSourceNodes.push(returnSourceNodes[i]);	
		   	} 
		}        
    
    
        // Retrieve post submit action configuration
        this.m_postSubmitActionConfig = this.m_submitConfig[ "postSubmitAction" ];
        
        if(null == this.m_postSubmitActionConfig)
        {
            throw new ConfigurationException( "Missing postSubmitAction for form submit life cycle" );
        }
        
        // Check post submit action configuration close action.
        var closeAction = this.m_postSubmitActionConfig[ SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE ];
            
        if(null != closeAction)
        {
            this.m_postSubmitAction = SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE;
        }
    }
	else
	{
		return; //No configuration items.
	}                
	// Call parent and process remaining configuration items. 
	SubmitFormBusinessLifeCycle.prototype._configure.call(this,submitConfig);
}


/*
 *  Submit data to server and / or pass data back up to parent.
 */
SubmitSubformBusinessLifeCycle.prototype._submitData = function()
{
	// Check to see if a service is configured - if it is call it.   
    var dm = FormController.getInstance().getDataModel();
    var db = this.m_adaptor.dataBinding;
    var state = dm.getValue(db + FormElementGUIAdaptor.FORM_STATE_XPATH);
    var serviceConfig = this.m_submitConfig[ state ];
                
    if(null != serviceConfig && (fwDataService.isDataServiceConfigured(serviceConfig) || null != serviceConfig.name))
    {
    	// Service configured - just invoke parent.
    	// If successful the postSubmitAction will send data back
    	// to parent.
		SubmitFormBusinessLifeCycle.prototype._submitData.call(this);
   	}
   	else
   	{
   		// No service configured - just pass data back up to parent
   		// and do post submit action.
	    FormBusinessLifeCycleDelegate.returnDOMToParent();
	   	this.returnDataToParent();   	
		this._postSubmitAction();
   	}
}


/**
 * Method onSuccess continues life cycle processing following successful
 * submit to server.
 *
 * @param dom XML structure returned from server after service call
 *
*/
SubmitSubformBusinessLifeCycle.prototype.onSuccess = function(dom)
{
	// Return data and invoke postSubmitAction    
	FormBusinessLifeCycleDelegate.returnDOMToParent();
   	this.returnDataToParent();
   	this._postSubmitAction(dom);
}

/**
 * Method directs post submit processing. If a post submit event has been defined
 * the method _dynamicPostSubmitAction on the parent class SubmitFormBusinessLifeCycle
 * will be invoked. Otherwise, the method _staticPostSubmitAction on this class
 * will be invoked.
 *
*/
SubmitSubformBusinessLifeCycle.prototype._postSubmitAction = function(dom)
{
    if(null == this.m_dynamicPostSubmitEvent)
    {
        // Execute statically configured post submit action
        if(null != dom)
        {
            this._staticPostSubmitAction(dom);
        }
        else
        {
            this._staticPostSubmitAction();
        }
    }
    else
    {
        // Execute dynamically defined post submit action on parent
        SubmitFormBusinessLifeCycle.prototype._dynamicPostSubmitAction.call(this);
    }
}


/**
 * Processing required after a submit. 
 * Sets datamodel to clean then invokes the appropriate post submit action
 * as defined by the configuration.
 *
 * @param dom XML structure returned from server after service call
 *			  (can be null as submit may not have involved a service call)
*/
SubmitSubformBusinessLifeCycle.prototype._staticPostSubmitAction = function(dom)
{
    // Define references to form controller and data model
    //var fc = FormController.getInstance();
    //var dm = fc.getDataModel();
    
    // As submit successful set data model clean
    this.m_adaptor._setDirty(false);
    
    // Process configured post submit action
    if(this.m_postSubmitAction == SubmitSubformBusinessLifeCycle.POST_SUBMIT_ACTION_CLOSE)
    {
		// Queue a lower event.
		//this.lowerSubform();
        // D814 - Temporary hack see method description
		this.lowerSubformTimeout();
    }
    else
    {
		// Call parent to process other actions. 
		SubmitFormBusinessLifeCycle.prototype._postSubmitAction.call(this,dom);
    }
}



/*
 *  Returns data specified in m_addSourceNodes and m_returnSourceNodes
 *  to invoking adaptor. 
 */
SubmitSubformBusinessLifeCycle.prototype.returnDataToParent = function()
{
    // Get Nodes
    var returnNodes = null;
    if (this.m_returnSourceNodes != null
        && this.m_returnSourceNodes.length > 0)
	    {
	    returnNodes = new Array();
	   	for (var i=0; i < this.m_returnSourceNodes.length; i++)
	   	{
	   		returnNodes.push(Services.getNode(this.m_returnSourceNodes[i]));
	   	} 
	}
   	
	// Get invoking adaptor 
	var invokingAdaptor = FormController.getInstance().getInvokingAdaptor();
	
    // Process any outstanding events (probably not required, but we are
    // about to shift forms (in the AppController) so if there are
    // any left we should process them now)
    FormController.getInstance().processEvents();
    
	// Return nodes to invoking adaptor
	invokingAdaptor.setReturnedData(returnNodes);	
}

/**
 * This method is a temporary solution to the interference
 * between life cycle and tabbing events. The method delays
 * the dispatch of the life cycle event which closes the subform
 * to give the standard dialog time to focus on an element on
 * the subform before it is closed.
 *
 * D814 30/11/05
 *
*/
SubmitSubformBusinessLifeCycle.prototype.lowerSubformTimeout = function()
{
    setTimeout("SubmitSubformBusinessLifeCycle.lowerSubform()", 100);
}

/*
 * Queue a lower event with the invoking adaptor to lower this popup subform.
 */
SubmitSubformBusinessLifeCycle.lowerSubform = function()
{
	// Get invoking adaptor 
	var invokingAdaptor = FormController.getInstance().getInvokingAdaptor();
	
	window.parent.Services.dispatchEvent(invokingAdaptor.getId(),PopupGUIAdaptor.EVENT_LOWER);	
}
 
