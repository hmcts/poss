//==================================================================
//
// EditFormBusinessLifeCycle.js
//
// Common base class for Modify and Create Form Buisness Life Cycles
//
//==================================================================

/**
 * Common base class for Modify and Create Form Business Life Cycles
 *
 * @constructor
 *
 */
function EditFormBusinessLifeCycle()
{
}

/**
 * EditFormBusinessLifeCycle is a sub class of BusinessLifeCycle
 *
 */
EditFormBusinessLifeCycle.prototype = new BusinessLifeCycle();


/**
 *  Set the constructor property such that we can identify the type
 *  of the class
 *
 */
EditFormBusinessLifeCycle.prototype.constructor = EditFormBusinessLifeCycle;

/**
 * Enable logging capability
 *
*/
EditFormBusinessLifeCycle.m_logger = new Category( "EditFormBusinessLifeCycle" );

/**
 * Define class instance members
 *
 * Variable to store configuration details for life cycle
 *
 */
EditFormBusinessLifeCycle.prototype.m_config = null;


/**
 * Locate and store reference to modify configuration object defined for form
 *
 * @param config life cycle configuration object from form adaptor configuration
 *
*/
EditFormBusinessLifeCycle.prototype._configure = function(config)
{
    // Store life cycle configuration object
    this.m_config = config;
}


/**
 * Invoke the business logic associated with an EditFormBusinessLifeCycle
 *
 * @param e The business life cycle event
 */
EditFormBusinessLifeCycle.prototype.invokeBusinessLifeCycle = function(e)
{
	var details = e.getDetail();
	
	if(null == details || details.raiseWarningIfDOMDirty !== false)
	{
		var thisObj = this;
	
		FormBusinessLifeCycleDelegate.promptUserWhenDataModelDirty(
			thisObj,
			BusinessLifeCycle.UNSAVED_DATA_DIALOG_MSG,
			null,
			e,
			function()
			{
				thisObj.refreshDOM(e)
			}
		);
	}
	else
	{
		this.refreshDOM(e);
	}
}


/**
 * Used by edit lifecycles to set model data
 *
 * @param e the BusinessLifeCycle event which is being processed
 */
EditFormBusinessLifeCycle.prototype.refreshDOM = function(e)
{
    var refreshDOM = null;
    
    var fc = FormController.getInstance();
    var dm = fc.getDataModel();
    
    // First look for XML document in event details
    var eventDetails = e.m_detail;
    if(null != eventDetails)
    {
        refreshDOM = eventDetails.DOM;
    }
    
    if(null != refreshDOM)
    {
        // Load XML structure from detail
        
        // First determine data binding for XML in data model   
        var dataBinding = eventDetails.dataBinding;

		var isDirty = (eventDetails.isDirty === true);

		this._handleDocumentLoadSuccess(refreshDOM, dataBinding, isDirty);
    }
    else
    {
    	var dL = fwFormModelDataLoader.create(this.m_config, this);
    	dL.load();
    }
}


/**
 * Handle the successful loading of a Document containing the new model
 * data that is to be editted by the form
 *
 * @param dom the DOM containing the model data
 * @param dataBinding the XPath specifying the location in the DataModel
 *   where the data should be added. If this is null then the lifecycle
 *   will attempt to determine the dataBinding from the lifecycle
 *   configuration, and failing that, will ask the form for its 
 *   model XPath.
 * @param dirty whether or not to mark the form as dirty or not
 * @protected
 */
EditFormBusinessLifeCycle.prototype._handleDocumentLoadSuccess = function(dom, dataBinding, dirty)
{
	var adaptor = this.getAdaptor();

	// Get the target state for this EditFormBusinessLifeCycle
    var state = this._getTargetState();

	// If dataBinding not specified, then use the default model databinding for the form
    if(null == dataBinding)
    {
    	dataBinding = this._getModelDataBinding()
        // Attempt to use data binding for configured service
        if(null == dataBinding)
        {
            // No data binding is available - raise error
            throw new ConfigurationException(
            	"No Data binding for form '" + this.getAdaptor().getId() + "' "  + state + " lifeCycle" );
        }
    }


    var dm = FormController.getInstance().getDataModel();

	// Adding the removing the existing model data, adding the new model
	// data and updating the form state in the DataModel 
	// should happen as a single DataModel transaction, otherwise
	// events might be processed when the DataModel is in an inconsistent
	// state, or be triggered multiple times.
	dm._startTransaction();

	// @todo: The removal and addition of modal data nodes would be more efficient
	// if we could do a replaceNode, rather than separate removals and additions.
	// This isn't as simple as it should be, simply because we can't identify a
	// single node under /ds which represents the model. This could be changed if
	// we required people to specify modelXPath configuration. Alternatively we
	// could perform more efficient code here if modelXPath is specified and just
	// fallback to the current behaviour in the cases where modelXPath is not
	// specified.
	this.callPostBusinessLifeCycleAction(dom);
	
	// As part of this process we will reset the dirty state to false, so
	// we don't want any dirty events to be processed as a result of the 
	// form's model being changed
	adaptor.suspendDirtyEvents(true);

    // Clear data model
    adaptor.clearFormDataModel();

	// Add the node set.
    dm.addNodeSet(dom, this._getModelDataBinding());
    
    // Update form state
    adaptor._setState(state);
    adaptor._setDirty((dirty === true));
    adaptor.update();

	// Restart dirty event tracking now form state has been updated    
   	adaptor.suspendDirtyEvents(false);

    // End the DataModel transaction.
    dm._endTransaction();

}


EditFormBusinessLifeCycle.prototype.callPostBusinessLifeCycleAction = function(dom)
{
    // If present invoke custom post business life cycle processing
    if(null != this.m_config.postBusinessLifeCycleAction)
    {
        this.m_config.postBusinessLifeCycleAction.call(null, dom);
    }
}

/**
 * Determine the XPath where the LifeCycle should place the loaded
 * model data. Looks first at the lifecycle configuration for 
 * a dataBinding configuration item, and if that fails asks the form
 * for it's modelXPath.
 *
 * @return the XPath to the location in the DataModel where the
 *  loaded model data should be placed.
 * @type String
 * @private
 */ 
EditFormBusinessLifeCycle.prototype._getModelDataBinding = function()
{
	// If no dataBinding is specified in the LifeCycle, use the form's modelXPath
	// to derive a suitable location to bind the loaded document into.
	var dataBinding = this.m_config.dataBinding;
	
	if(null == dataBinding)
	{
		// Get the parent of form's model xpath - i.e. Where the loaded
		// document should be added.
		dataBinding = this.getAdaptor().getModelParentXPath();
	}

	return dataBinding;
}


/**
 * Get the state that the EditFormBusinessLifeCycle should move the
 * form to when a Document containing the model data is successfully
 * loaded.
 *
 * @return the state that the form should move into
 * @type String
 * @protected
 */
EditFormBusinessLifeCycle.prototype._getTargetState = function()
{
	fc_assertAlways("fwDataService._getTargetState() base class method must be overridden");
}
