/**
 * FormController Constructor
 *
 * @constructor
 */
function FormController(formViewManager, initialData)
{
	/*("FormController_constructor")*/

	// Create a HTML form view instance - this really should be some sort of abstract factory which
	// creates an approriate FormView class based on the view technology used...
	this.m_formView = HTMLFormView.create();

	// Hang on to the formViewManager
	this.m_formViewManager = formViewManager;

	formViewManager.setFormController(this);
	if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController()");
	
	// Flag to prevent second stage initialisation (initialisation performed
	// at reference data has been loaded) from starting before first stage
	// initialisation has completed.
	this.m_firstStageInitialisationComplete = false;
	
	// Array which will contain all the managed elements
	this.m_adaptors = null;
	
	// Array to contain all of the container adaptors
	this.m_containerAdaptors = new Array();
	
	// to hold the state of any running data services
	this.m_runningDataServices = new Array();
	
	// Data Model
	this.m_dataModel = new DataModel();
	
	// Filthy flag to differentiate when FormController is performing a true initialisation
	// or a re-initialisation
	this.m_isReinitialise = false;
	
	// Load initial data for form if not already passed in (for a form this is usually
	// session data, for a subform it will be a copy of /ds/var/form & /ds/var/app)
	if (initialData == null)
	{
		// Support older forms which may call this method themselves and
		// have not pre-configured m_initialData.
		initialData = this.getAppController().getSessionDataFromPreviousForm();
	}
	
	if(null != initialData)
	{
		if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController() about to load the following app scoped data into the dom:" + XML.showDom(initialData));
		
		// Add all of the nodes in initialData to /ds/var
		for (var i = 0; i < initialData.length ; i++)
		{
			this.m_dataModel.addNodeSet(initialData[i], "/ds/var");
		}
	}
	
	// Form Controller needs to hear about DataModel transactions
	this.m_dataModel.registerTransactionListener(new FCTransactionListener());
	
	// The GUIAdaptor which is currently engaged in a data transaction
	this.m_dataTransactionAdaptor = null;
	
	// Tabbing Manager
	this.m_tabbingManager = new TabbingManager();
	this.m_tabbingManager.initialise();
	
	// Event queues
	
	// Currently using the same queue and method name
	this.m_eventQueueMap = new EventQueueMap();
	this.m_eventQueueMap.addEventQueue(new DefaultEventQueue(), FormController.DEFAULT);
	this.m_eventQueueMap.addEventQueue(new ValidationEventQueue(), FormController.VALIDATION);
	this.m_eventQueueMap.addEventQueue(new EnablementEventQueue(), FormController.ENABLEMENT);
	this.m_eventQueueMap.addEventQueue(new MandatoryEventQueue(), FormController.MANDATORY);
	this.m_eventQueueMap.addEventQueue(new SrcDataEventQueue(), FormController.SRCDATA);
	this.m_eventQueueMap.addEventQueue(new SrcDataFilterEventQueue(), FormController.FILTER);
	this.m_eventQueueMap.addEventQueue(new RefreshEventQueue(), FormController.REFRESH);
	this.m_eventQueueMap.addEventQueue(new ReadOnlyEventQueue(), FormController.READONLY);
	this.m_eventQueueMap.addEventQueue(new LogicEventQueue(), FormController.LOGIC);
	this.m_eventQueueMap.addEventQueue(new DirtyRecordsEventQueue(), FormController.DIRTY_RECORD);
	this.m_eventQueueMap.addEventQueue(new LazyFetchEventQueue(), FormController.LAZY_FETCH_RECORD);
	this.m_eventQueueMap.addEventQueue(new FormDirtyEventQueue(), FormController.FORMDIRTY);
	this.m_eventQueueMap.addEventQueue(new LabelEventQueue(), FormController.LABEL);
	this.m_eventQueueMap.addEventQueue(new StateChangeEventQueue(), FormController.STATECHANGE);
	this.m_eventQueueMap.addEventQueue(new ServerValidationEventQueue(), FormController.SERVER_VALIDATION);
	this.m_eventQueueMap.addEventQueue(new LoadEventQueue(), FormController.LOAD);
	this.m_eventQueueMap.addEventQueue(new UnloadEventQueue(), FormController.UNLOAD);
	
	// Create BusinessLifeCycleEventQueue
	this.m_businessLifeCycleEventQueue = new Array();
	
	// Defect 1112. Flag indicating whether, or not, business life cycle events
	// should be submitted to the business life cycle queue. In certain cases
	// such as when a subform is being lowered the subform FormController
	// should not submit any more events to the queue.
	this.m_allowBusinessLifeCycleEventSubmission = true;
	
	// Define reference for time out for data service completion poll
	this.m_pollDataServiceCompletion = null;
	
	// Create array of references to instances of class WordProcessingGUIAdaptor
	// for form. This array is used to determine when all instances of
	// the FCKeditor have been loaded completely.
	this.m_wordProcessingGUIAdaptors = new Array();
	
	// Define reference for time out for FCKeditor load completion poll
	this.m_FCKeditorLoadCompletion = null;
	
	// Define array to store references to event bindings on form which
	// have associated enablement rules. Each such event binding will
	// have an associated FormControllerListener which must be
	// correctly "deserialised" when using precompilation.
	this.m_enablementEventBindings = new Array();
	
	/*("FormController_constructor")*/
}

FormController.m_logger = new Category("FormController");

FormController.DEFAULT = "default";
FormController.SRCDATA = "srcData";
FormController.DIRTY_RECORD = "dirtyRecords";
FormController.LAZY_FETCH_RECORD = "lazyFetch";
FormController.FILTER = "srcDataFilter";
FormController.VALIDATION = "validate";
FormController.ENABLEMENT = "enable";
FormController.MANDATORY = "mandatory";
FormController.REFRESH = "refresh";
FormController.READONLY = "readOnly";
FormController.LOGIC = "logic" ;
FormController.LABEL = "label";
FormController.STATECHANGE = "statechange";
FormController.FORMDIRTY = "formdirty";
FormController.LOAD = "load";
FormController.UNLOAD = "unload";


/**
 * Singleton instance for FormController
 */
FormController.m_formController = null;

FormController.getDebugMode = function()
{
	if(FormController.m_debugMode == null)
	{
		FormController.m_debugMode = top.AppController.getInstance().getDebugMode();
	}
	return FormController.m_debugMode;
}

/**
 * Method invokes method on AppController instance to determine whether, or not,
 * whitespace only entry validation should be applied to user text entry fields.
 *
 * @return Boolean value indicating, whether or not, whitespace only entry
 *        validation should be applied to user text input fields.
 *
*/
FormController.getValidateWhitespaceOnlyEntryActive = function()
{
    if(FormController.m_validateWhitespaceOnlyEntryActive == null)
    {
        FormController.m_validateWhitespaceOnlyEntryActive = top.AppController.getInstance().getValidateWhitespaceOnlyEntryActive();
    }
    return FormController.m_validateWhitespaceOnlyEntryActive;
}

/**
 * Initialise the Form
 *
 * @param form the form element which contains the elements managed by the Form Controller
 */
FormController.initialise = function(formViewManager, initialData,invokingAdaptor)
{	
	/*("FormController_initialise")*/
    var fc = null;
    
    if(FormController.getDebugMode() == false)
    {
	    try
	    {
		    FormController._initialise(formViewManager, initialData, invokingAdaptor);
		}
		catch(exception)
		{
		    // Check for existence of FormController
		    fc = FormController.m_formController;
		    
		    if(null != fc)
		    {
		        // If form controller exists check if data service 
		        // completion poll is operating
	            if(null != fc.m_pollDataServiceCompletion)
	            {
	                clearTimeout(fc.m_pollDataServiceCompletion);
	        
	                fc.m_pollDataServiceCompletion = null;
	            }
	            
	            // Also check if FCKeditor load completion poll
	            // is still operating
	            if(null != fc.m_FCKeditorLoadCompletion)
	            {
	                clearTimeout(fc.m_FCKeditorLoadCompletion);
	                
	                fc.m_FCKeditorLoadCompletion = null;
	            }
	            
	        }
	        
		    FormController.handleFatalException(exception);
		}
	}
	else
	{
		FormController._initialise(formViewManager, initialData, invokingAdaptor);
	}
	/*("FormController_initialise")*/
}

FormController._initialise = function(formViewManager, initialData, invokingAdaptor)
{	
    var fc = null;
    
    if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.initialise() started");

    Logging.initialise(top.window);

    fc_assert(FormController.m_formController == null, "FormController.initialise() called multiple times");

    fc = new FormController(formViewManager, initialData);
  
    FormController.m_formController = fc;

    // Set up invokingAdaptor if obtained 
    // (invoking adaptor is only relevant for subforms)
    fc.setInvokingAdaptor(invokingAdaptor); 

    // Initialise the elements
    fc.initElements();

	// Start polling for reference data loading completed
	fc._pollForSecondStageInitialisationStart();

    // Let TabbingManager know what is the form to operate on.
    var form = fc.getFormAdaptor();
    fc.getTabbingManager().setFormElementGUIAdaptor(form);

    fc.m_firstStageInitialisationComplete = true;

    if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.initialise() completed");
}

FormController.prototype._pollForSecondStageInitialisationStart = function()
{
    // Wait for reference data and initial model data to load  
	this.m_pollDataServiceCompletion = setTimeout("FormController.pollDataServiceCompletion()", 100);
}

FormController.prototype._pollForFCKeditorLoadCompletionStart = function()
{
    // Wait for all instances of FCKeditor to load
    this.m_FCKeditorLoadCompletion = setTimeout("FormController.pollFCKeditorLoadCompletion()", 100);
}


FormController.prototype.reinitialise = function(nodes)
{
	this.m_isReinitialise = true;

	var dm = this.m_dataModel;
	
	// Get the form 
	var form = this.getFormAdaptor(); 
	
	// Perform all updates with a DataModel transaction
	dm._startTransaction();

	// As part of this process we will reset the dirty state to false, so 
	// we don't want any dirty events to be processed as a result of the 
	// form's model being changed 
	form.suspendDirtyEvents(true); 

	if(null != nodes)
	{
		if(FormController.m_logger.isTrace())FormController.m_logger.trace("FormController() about to load the following initial data into the DataModel:" + XML.showDom(nodes));
		
		// Add all of the nodes in initialData to /ds/var
		for (var i = 0; i < nodes.length ; i++)
		{
			var node = nodes[i];
			var rootNodeName = node.nodeName;
			dm.replaceNode("/ds/var/" + rootNodeName, node);
		}
		
	}
    
	// Get the form to reinitialise itself
	form.reinitialise();
	
	// Start polling for reference data loading completed
	this._pollForSecondStageInitialisationStart();
}


/**
 * Clean up any objects created by the FormController which will not
 * be automatically garbage collected.
 */
FormController.prototype.dispose = function()
{
    var i, l;
    
    // Clear references to WordProcessingGUIAdaptors
    // in custom array
    for(i = 0, l = this.m_wordProcessingGUIAdaptors.length; i < l; i++)
    {
        this.m_wordProcessingGUIAdaptors[i] = null;
    }
    delete this.m_wordProcessingGUIAdaptors;
    
    // Clear array of event bindings with enablement rules.
    // Do not delete as event bindings themselves will be
    // disposed of with the adaptors.
	for(var j in this.m_enablementEventBindings)
	{
	    this.m_enablementEventBindings[j] = null;
	}
	
	// Defect 1059. Safety check for existence of progress bar
	// visible expando property on document.
	var doc = window.document;
	
	if(null != doc.framework_expando_progressBarVisible)
	{
	    doc.framework_expando_progressBarVisible = null;
	}
	
	this.m_enablementEventBindings = null;
	
	// Clear reference to form adaptor if set
	if(null != this.m_formAdaptor)
	{
	    this.m_formAdaptor = null;
	}
    
    // Dispose of form adaptors
	for(i = 0, l = this.m_adaptors.length; i < l; i++)
	{
		this.m_adaptors[i].dispose();
		
		delete this.m_adaptors[i];
	}
	delete this.m_adaptors;
	
	this.m_tabbingManager.dispose();
	delete this.m_tabbingManager;
	
	this.m_dataModel.dispose();
	delete this.m_dataModel;
	
	// Clear up the view
	this.m_formView.dispose();
	delete this.m_formView;
	
	// Clear up view manager reference
	this.m_formViewManager = null;
	
	// If form controller for sub form clear reference to invoking
	// adaptor
	if(null != this.getInvokingAdaptor())
	{
	    this.setInvokingAdaptor(null);
	}
	
	// Clear reference to debug mode as this is a reference
	// to a variable on another window
	if(null != FormController.m_debugMode)
	{
	    FormController.m_debugMode = null;
	}
	
	// Clear reference to validate whitespace only entry active
	// flag as this is a reference to a variable in another window
	if(null != FormController.m_validateWhitespaceOnlyEntryActive)
	{
	    FormController.m_validateWhitespaceOnlyEntryActive = null;
	}
	
	// No longer available
	delete this.m_formController;
}


/**
 * Get the FormController singleton instance.
 */
FormController.getInstance = function()
{
  return FormController.m_formController;
}


/**
 * Get the DataModel
 *
 * @return the DataModel for the form
 * @type DataModel
 * @private
 */
FormController.prototype.getDataModel = function()
{
	return this.m_dataModel;
}


/**
 * Get the TabbingManager
 *
 * @return the TabbingManager for the form
 * @type TabbingManager
 */
FormController.prototype.getTabbingManager = function()
{
	return this.m_tabbingManager;
}


/**
 * Get the FormView
 */
FormController.prototype.getFormView = function()
{
	return this.m_formView;
}


/**
 * Get the Application Controller
 *
 * @return the Application Controller
 */
FormController.prototype.getAppController = function()
{
	return top.AppController.getInstance();
}


/**
 * This method returns a reference to an adaptor identified by the supplied ID
 *
 * @param id the id of the adaptor to retrieve
 * @return the adaptor identified by the id parameter or null if no adaptor is
 *  found
 * @type GUIAdaptor
 */
FormController.prototype.getAdaptorById = function(id)
{
    return this.m_adaptors[id];
}


/**
 * Get the FormElementGUIAdaptor for the form which is managed by the FormController
 *
 * @return the FormElementGUIAdaptor for the form managed by the FormController
 * @type FormElementGUIAdaptor
 */
FormController.prototype.getFormAdaptor = function()
{
	if(this.m_formAdaptor == null)
	{
		var adaptors = this.m_adaptors;
		var length = adaptors.length;
		for(var i = 0; i < length; i++)
		{
			var adaptor = adaptors[i];
			if(adaptor.constructor == FormElementGUIAdaptor
			   || adaptor.constructor == SubformElementGUIAdaptor)
			{
				this.m_formAdaptor = adaptor;
				break;
			}
		}
	}
	return this.m_formAdaptor;
}


/*
 * Returns the invoking Adaptor of this subform.
 * 
 * SubformElementGUIAdaptors need to know which adaptor created them
 * for callback purposes
 * 
 * When the subform is initially being created the SubformElementGUIAdaptor
 * does not exist yet, so the parent must be registered here for it 
 * to use later
 * 
 */
FormController.prototype.getInvokingAdaptor = function()
{
   return FormController.prototype.m_invokingAdaptor;
}


/**
 * Sets the reference to the adaptor which invoked this formcontroller.
 * This is relevant to subforms which need to be able to call back 
 * to the adaptor to close them down 
 *
 */
FormController.prototype.setInvokingAdaptor = function(adaptor)
{
	FormController.prototype.m_invokingAdaptor = adaptor;
}

/**
 * Register external GUI components with the framework
 *
 * @adaptorFactory the GUIAdaptorFactory
 */
FormController.prototype.registerExternalAdaptors = function(adaptorFactory)
{
	var registered = this.getAppController().getExternalComponents();
	for(var i=0;i<registered.length;i++)
	{
		var cssClassName = registered[i].getCSSClassName();
		if(FormController.m_logger.isInfo()) FormController.m_logger.info("FormController.registerExternalAdaptors() cssClassName = " + cssClassName);
		var className = registered[i].getClassName();
		var factoryMethodName = registered[i].getFactoryMethod();
		if(null == factoryMethodName)
		{
			factoryMethodName = "create";
		}
		var a = window[className];
		if(null != a)
		{
			if(FormController.m_logger.isInfo()) FormController.m_logger.info("FormController.registerExternalAdaptors() found adaptor = " + a);
			var factoryMethod = a[factoryMethodName];
			if(FormController.m_logger.isInfo()) FormController.m_logger.info("FormController.registerExternalAdaptors() found factory method on adaptor = " + factoryMethod);
	
			var gar = GUIAdaptorRegistration.create(cssClassName, factoryMethod);
			adaptorFactory.register(gar);
		}
		else
		{
			if(FormController.m_logger.isWarn()) FormController.m_logger.warn("FormController.registerExternalAdaptors() external component configured in app config, but the corresponding javascript object does not exist in the window. It may not be needed in the current form.");
		}
	}
	return adaptorFactory;
}


FormController.pollDataServiceCompletion = function()
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.pollDataServiceCompletion()");

	var oneMinute = 1000 * 60;
	var pollDelay = 100;
	
	if(FormController.pollDataServiceCompletion.count == undefined)
	{
		FormController.pollDataServiceCompletion.count = 0;
	}
	else
	{
		FormController.pollDataServiceCompletion.count++;
	}
	
	
	if(FormController.pollDataServiceCompletion.count * pollDelay > oneMinute)
	{
		var fc = FormController.getInstance();
		var ac = fc.getAppController();

		var message = "The following services have failed to complete after " + oneMinute / 1000 + " seconds\n\n";

		for(var k in fc.m_runningDataServices)
		{
			if(true==fc.m_runningDataServices[k])
			{
				message += (k + "\n");
			}
		}
		
		message += "\nPress Ok to continue to wait or Cancel to abort the application";
				

		if(window.confirm(message))
		{
			// Reset the counter
			FormController.pollDataServiceCompletion.count = 0;
		}
		else
		{
			// Abort
			ac.shutdown();
		}
		
	}
	
	/*("FormController_pollDataServiceCompletion")*/

	var fc = FormController.getInstance();
	if(!fc.isRunningDataServices() && fc.m_firstStageInitialisationComplete)
	{
	    fc.m_pollDataServiceCompletion = null;
	    
	    // Reset counter in case form is reinitialised
	    FormController.pollDataServiceCompletion.count = 0;
	    
	    // Check if page is contains word processing GUI adaptors
	    var wordProcessingGUIAdaptors = fc.getWordProcessingGUIAdaptors();
	    
	    if(wordProcessingGUIAdaptors.length > 0)
	    {
	        // Poll for loading of FCKeditor
	        fc._pollForFCKeditorLoadCompletionStart();
	    }
	    else
	    {
		    fc.referenceDataLoaded();
		}
	}
	else
	{
		fc.m_pollDataServiceCompletion = setTimeout("FormController.pollDataServiceCompletion()", pollDelay);
	}
	
	/*("FormController_pollDataServiceCompletion")*/
}

/**
 * Method polls check for completion of loading of instances of FCKeditor
 * associated with WordProcessingGUIAdaptors.
 *
*/
FormController.pollFCKeditorLoadCompletion = function()
{
    if(FormController.m_logger.isDebug())
    {
        FormController.m_logger.debug("FormController.pollFCKeditorLoadCompletion()");
    }
    
    var oneMinute = 1000 * 60;
    var pollDelay = 100;
    
    // Define method execution counter
    if(FormController.pollFCKeditorLoadCompletion.count == undefined)
    {
        FormController.pollFCKeditorLoadCompletion.count = 0;
    }
    else
    {
        FormController.pollFCKeditorLoadCompletion.count++;
    }
    
    // Determine whether, or not, all instances of editor are loaded
    var fc = FormController.getInstance();
    
    if(fc.FCKeditorLoadingComplete())
    {
        fc.m_FCKeditorLoadCompletion = null;
        
        // Reset counter in case form is reinitialised
        FormController.pollFCKeditorLoadCompletion.count = 0;
        
        fc.referenceDataLoaded();
    }
    else
    {
        // Not all instances of the editor have been loaded
        if(FormController.pollFCKeditorLoadCompletion.count * pollDelay > oneMinute)
        {
            var message = "The instance(s) of FCKeditor used for word processing" +
                          "\nhave failed to load completely. Press OK to continue" +
                          "\nto wait or Cancel to abort the application.";
                          
            if(window.confirm(message))
            {
                // Restart poll for editor completion
                FormController.pollFCKeditorLoadCompletion.count = 0;
                
                fc.m_FCKeditorLoadCompletion = setTimeout("FormController.pollFCKeditorLoadCompletion()", pollDelay);
            }
            else
            {
                fc.getAppController().shutdown();
            }
            
        }
        else
        {
            // Continue polling for editor load completion
            fc.m_FCKeditorLoadCompletion = setTimeout("FormController.pollFCKeditorLoadCompletion()", pollDelay);
        }
        
    }
    
}

FormController.prototype.registerRunningDataService = function(key)
{
	this.m_runningDataServices[key] = true;
}


FormController.prototype.runningDataServiceComplete = function(key)
{
	this.m_runningDataServices[key] = false;
}

FormController.prototype.isRunningDataServices = function()
{
	var result = false;
	for(var k in this.m_runningDataServices)
	{
		if(true==this.m_runningDataServices[k])
		{
			result = true;
			break;
		}
	}
	return result;
}


FormController.prototype.referenceDataLoaded = function()
{
    if(FormController.getDebugMode() == false)
    {
	    try
	    {   
		    this._referenceDataLoaded();
		}
		catch(exception)
		{
		    FormController.handleFatalException(exception);
		}
	}
	else
	{
		this._referenceDataLoaded();
	}
}

FormController.prototype._referenceDataLoaded = function()
{
    if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.referenceDataLoaded()");
    var form = this.getFormAdaptor();

    // Invoke any model processing required by the form
    if (form.prepareModelData)
    {
	    form.prepareModelData();	
    }

	if(!this.m_isReinitialise)
	{
	    // Trigger all events to get the form into a reasonable initial state
	    this._initialiseAdaptorsStates(this.m_adaptors);
	}

    // Set the forms dirty state as appropriate	
    form._setDirty(form.isDirtyOnInit());

	if(!this.m_isReinitialise)
	{
	    // Add the adaptors to the tabbing manager
	    this.m_tabbingManager.addAdaptors(this.m_adaptors);
	
	    // Run initialise methods.
	    this.runInitialiseLifecycle(this.m_adaptors);

		// Notify the view that we're ready to go
	    //this.m_formViewManager.formControllerInitialised();
	}
	else
	{	
		// Restart dirty event tracking now form state has been updated 
		form.suspendDirtyEvents(false); 
    
		// End transaction to trigger event processing...
		this.m_dataModel._endTransaction();
		
	}
	
	// Notify the view that we are ready to go. This used to
	// be executed for forms and new subforms only, but now it is used
	// when reinitialising sub forms also. The "formReadyListener"
	// for subforms invoked by this method will remove the progress bar.
	this.m_formViewManager.formControllerInitialised();

    // Set the Focus to the correct element after form open.
    // If firstFocusAdaptorID is specified on the ContainerProtocol,
    // focus on the specified adaptor, otherwise simply focus on the
    // first available field
    // AL - this seems to be returning null so that are attempting to set
    // the focus to a null element!!!!!
    var firstFocusAdaptorID = form.invokeFirstFocusedAdaptorId();
    Services.setFocus(firstFocusAdaptorID);
	
    this.m_ready = true;

    ///*("FormController_referenceDataLoaded")*/
}

/**
 * Initialise all the elements on the form
 */
FormController.prototype.initElements = function()
{
/*("FormController_initElements")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.initElements()");
	// Get the GUIAdaptorFactory
	var f = this.getFormView().getGUIAdaptorFactory();
	
	// Register external adaptors...
	f = this.registerExternalAdaptors(f);
	
	// Create the adaptors for the view
	var as = f.bindView(document);
	
	this.manage(as);
/*("FormController_initElements")*/	
}


/**
 * Dynamically add adaptors to the set of adaptors managed by the FormController.
 * This method currently restricted to adding adaptors that do not have any
 * bindings to the DataModel - no attempt is made to bind adaptors to the DataModel
 * or StateChangeProtocol
 *
 * @param as an Array of adaptors to add
 * @private
 */
FormController.prototype.addAdaptors = function(as)
{
	/*("FormController_addAdaptors")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.addAdaptors()");
	this.m_adaptors = this.m_adaptors.concat(as);
	this._rebuildAdaptorMap();
	
	// Configure the newly added adaptors
	this._configureAdaptors(as);
	
	// setup and maintain the containers post configuration due to the use of getSources() for popups
	this._maintainContainerMap(as, true);
	
	// Configure each adaptor in turn
	for(var j = 0,al=as.length; j < al; j++)
	{
		this._bindLifeCycles(as[j], true);
		// commented out to make standard dialogs work until the proper fix is applied
		this._determineDataDependencies(as[j]);
	}

	// Initialise the newly added adaptors states
	this._initialiseAdaptorsStates(as);
	
	// Add adaptors to the tabbing manager.
	this.m_tabbingManager.addAdaptors(as);
	/*("FormController_addAdaptors")*/
}


/**
 * Remove an adaptor and its children from the Form Controller<b>
 * 
 * @param removeAdaptor the adaptor to remove
 */
FormController.prototype.removeAdaptor = function(removeAdaptor)
{
	/*("FormController_removeAdaptor")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.removeAdaptor() adaptor = " + removeAdaptor.getDisplayName());
	var newAdaptors = new Array();
	var disposeAdaptors = new Array();
	var disposeAdaptorIds = new Array();
	
	var as = this.m_adaptors;
	var removeId = removeAdaptor.getId();
	
	// Run through the current array of adaptors and build a new
	// list of managed adaptors (those which aren't the removeAdaptor
	// or one of its children), and a list of adaptors which are to be
	// disposed (the removeAdaptor and its children).
	for(var i = 0, l = as.length; i < l; i++)
	{
		var a = as[i];
		if(removeAdaptor != a && !a.isChildOf(removeAdaptor))
		{
			newAdaptors.push(a);
		}
		else
		{
			disposeAdaptors.push(a);
			disposeAdaptorIds.push(a.getId());
		}
	}

	// Set the list of adaptors and rebuild the map of adaptor ids to adaptors
	this.m_adaptors = newAdaptors;
	this._rebuildAdaptorMap();

    // Defect 754. Remove only disposed adaptors from
    // tab order
	//this.getTabbingManager().removeAdaptors(as);
	this.getTabbingManager().removeAdaptors(disposeAdaptors);
	
	this.removeAdaptorsFromDataModel(disposeAdaptors);
	this.removeAdaptorsFromStateChange(disposeAdaptorIds);
	this._maintainContainerMap(disposeAdaptors, false);
	
	// Dispose of the adaptors
	for(var i = 0, l = disposeAdaptors.length; i < l; i++)
	{
		var a = disposeAdaptors[i];
		this.m_eventQueueMap.removeEventsForAdaptor(a);
		a.dispose();
	}
	/*("FormController_removeAdaptor")*/
}

FormController.prototype._rebuildAdaptorMap = function()
{
	/*("FormController_rebuildAdaptorMap")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._rebuildAdaptorMap()");
	// Keep local reference for speed
	var as = this.m_adaptors;
	
	for(var i = 0, l = as.length; i < l ; i++)
	{
		var a = as[i];
		var id = a.getId();
		
		if(as[id] != null) throw new ConfigurationException("Attempt to add duplicate adaptor with id: " + id);
		
		as[id] = a;
	}
	/*("FormController_rebuildAdaptorMap")*/
}


FormController.prototype.manage = function(as)
{
	/*("FormController_manage")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.manage(): started");

    var fc = FormController.getInstance();
	this.m_adaptors = as;

	// Configure the adaptors
	this._configureAdaptors(as);

	// Check for container adaptors, used to determine data dependencies - post configuration due to the use of getSources() for popups
    // May be able to get rid of this as well.
	this._maintainContainerMap(as, true);

	// Configure each adaptor in turn
	for(var j = 0,al=as.length; j < al; j++)
	{
		this._bindLifeCycles(as[j]);
	}
    
    if (FormController.regNodes != null)
    {
        // Re-establish object references 
        var nodes = FormController.regNodes; 
        
        for (var a in nodes)
        {
            var node = nodes[a]; 
            
            // Recreate m_childNodes based on m_childRefArray
            node.m_childNodes = new Object(); 
            for (var i=0, l = node.m_childRefArray.length; i < l; i++)
            {
                var childNode = nodes[node.m_childRefArray[i]];
                node.m_childNodes[childNode.m_value]=childNode; 
            }
            node.m_childRefArray = null;
            
            // Recreate m_predicates based on m_predicateRefArray
            node.m_predicates = new Object(); 
            for (var i=0, l = node.m_predicateRefArray.length; i < l; i++)
            {
                var predicateNode = nodes[node.m_predicateRefArray[i]];
                node.m_predicates[predicateNode.m_value]=predicateNode; 
            }
            node.m_predicateRefArray = null;
            
            // Now for each listener, re-establish a connnection with the adaptor.
            for (var i=0, l = node.m_listeners.length; i < l; i++)
            {
                var listener = node.m_listeners[i];
                
                var adaptor = fc.getAdaptorById(listener.m_adaptorId);
                
                if(null != adaptor)
                {
                    listener.m_adaptor = adaptor;
                }
                else
                {
                    // This may occur if listener contains an event binding with
                    // an enablement rule instead of an adaptor.
                    listener.m_adaptor = fc.getEnablementEventBindingById(listener.m_adaptorId);
                }
            }
        }
        FormController.getInstance().getDataModel().m_root = nodes[0];
    }
    
    
    var dataDepArray = FormController.dataDepPreCompArray;
    if (!dataDepArray)
    {
		for(var j = 0,al=as.length; j < al; j++)
		{
			this._determineDataDependencies(as[j]);
		}
    }
    else // Use the precompiled data dependancy.
    {
        for (var i=0,l = dataDepArray.length; i<l; i++)
        {
            var preComp = dataDepArray[i];
            var adaptor = fc.m_adaptors[preComp[0]];
            
            adaptor.m_parents = SerialisationUtils.convertStringArrayToAdaptorObject(preComp[1]);
            adaptor.m_children = SerialisationUtils.convertStringArrayToAdaptorArray(preComp[2]);
            adaptor.m_containedChildren = SerialisationUtils.convertStringArrayToAdaptorArray(preComp[3]);
            adaptor.m_parentContainer = fc.m_adaptors[preComp[4]];
        }   
    }
	
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.manage(): completed");
	/*("FormController_manage")*/	
}

FormController.prototype._maintainContainerMap = function(as, addingAdaptors)
{
	/*("FormController_maintainContainerMap")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._maintainContainerMap(): addingAdaptors = " + addingAdaptors);
	if(addingAdaptors == true)
	{
		for(var i = 0, al=as.length ; i < al ; i++)
		{
		    var a = as[i];
		    var id = a.getId();
			
			// Identify adaptors that other 
			if(StateChangeEventProtocol._isContainerAdaptor(a))
			{
				this.m_containerAdaptors[id] = a;
			}
	    }
		// Configure static parent - child relationships, e.g. tabbed panels and paged areas, popups and raising buttons etc.
		this._addStaticContainerDependencies(as);
	}
	else
	{
		for(var i = 0, al=as.length ; i < al ; i++)
		{
		    var a = as[i];
		    var id = a.getId();
		    if(this.m_containerAdaptors[id] != null)
		    {
		    	delete this.m_containerAdaptors[id];
		    }
		}
		// Remvoe static parent - child relationships, e.g. tabbed panels and paged areas, popups and raising buttons etc.
		this._removeStaticContainerDependencies(as);
	}
	/*("FormController_maintainContainerMap")*/
}

FormController.prototype._addParentContainer = function(a, form)
{
	if(FormController.m_logger.isTrace()) FormController.m_logger.trace("FormController._addParentContainer(): adaptor = " + a.getDisplayName());
	var parent = a.getParentContainer()
	if(null != parent)
	{
		a.addDataDependency(parent);
	}
	else
	{
		// The default parent is the form, but only if there are no other dependencies
		var parents = a.getParents();
		if(parents == null || parents.length == 0)
		{
			a.addDataDependency(form);
		}
	}
}

FormController.prototype._addStaticContainerDependencies = function(as)
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._addStaticContainerDependencies()");
	// Configure static parent - child relationships, e.g. tabbed panels and paged areas
	var form = this.getFormAdaptor();
	var parents = null;
	var parent = null;
	for(var j = 0,al=as.length; j < al; j++)
	{
		var a = as[j];
		if(a.getId() != form.getId())
		{
			if(a instanceof PopupGUIAdaptor)
			{
				var raisingAdaptors = a.getSources();
				if(raisingAdaptors != null)
				{
					for(var i=raisingAdaptors.length-1; i>=0; i--)
					{
						a.addDataDependency(raisingAdaptors[i]);
					}
				}
				else
				{
					this._addParentContainer(a, form);
				}
			}
			else
			{
				this._addParentContainer(a, form);
			}
		}
	}
}

FormController.prototype._removeStaticContainerDependencies = function(as)
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._removeStaticContainerDependencies()");
	var adaptors = this.m_adaptors;
	var staticContainers = new Array();
	// filter out the popups from the list of removed adaptors
	for(var i = 0,asl=as.length; i < asl; i++)
	{
		var a = as[i];
		if(a instanceof PopupGUIAdaptor)
		{
			staticContainers[staticContainers.length] = a;
		}
	}
	// then remove them from the data dependencies on all existing adaptors
	for(var k=0, scl = staticContainers.length; k<scl; k++)
	{
		for(var j = 0,al=adaptors.length; j < al; j++)
		{
			var a = adaptors[j];
			a.removeDataDependency(staticContainers[k]);
		}
	}
}

/**
 * Force the initial state for all protocols for all adaptors, used
 * during form initialisation. Replaced the old method of simply 
 * firing all registered listeners in the DataModel.
 *
 * @param as array of GUIAdaptors that are to be initialised
 */
FormController.prototype._initialiseAdaptorsStates = function(as)
{
	/*("FormController_initialiseAdaptorsStates")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._initialiseAdaptorsStates()");
	var e = DataModelEvent.create('/', DataModelEvent.ADD);
	
	for(var i = 0, al=as.length ; i < al ; i++)
	{
	    var adaptor = as[i];
	    adaptor.initialiseStates(e);
        adaptor.renderState();
	}	
	/*("FormController_initialiseAdaptorsStates")*/
}

/**
 * Remove any listeners from the DataModel for adaptors being removed from the FC
 * due to unloading of a dynamic page
 */
FormController.prototype.removeAdaptorsFromDataModel = function(adaptors)
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.removeAdaptorsFromDataModel()");
	for(var i = 0, l = adaptors.length; i < l; i++)
	{
		adaptors[i].deRegisterListeners();
	}
}


/**
 * Inform the state change event protocol on all adaptors that an adaptor has been removed. To be used as part of the 
 * dynamic loading and unloading of panels
 *
 * @param adaptorIds and array of adaptor IDs to remove from the state change information on container adaptors, i.e. grids
 */
FormController.prototype.removeAdaptorsFromStateChange = function(adaptorIds)
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.removeAdaptorsFromStateChange()");
	var as = this.m_adaptors;
	for(var i = 0, l = this.m_adaptors.length; i < l; i++)
	{
		var e = StateChangeEvent.create(StateChangeEvent.REMOVED_ADAPTOR_TYPE, adaptorIds, null);
		this.m_adaptors[i].changeAdaptorState(e);
	}
}


/**
 * Run the initialise lifecycle for the supplied adaptors
 *
 * @param as Array containing adaptors to run the lifecycle for
 */
FormController.prototype.runInitialiseLifecycle = function(as)
{
	/*("FormController_runInitialiseLifecycle")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController.runInitialiseLifecycle()");

	for(var i = 0, l = as.length; i < l; i++)
	{
		var a = as[i];
		
		if(a.hasInitialise != null)
		{
			a.invokeInitialise();
		}
	}

	/*("FormController_runInitialiseLifecycle")*/	
}


/**
 * Configure the supplied adaptors
 *
 * @param as Array containing adaptors to configure
 * @private
 */
FormController.prototype._configureAdaptors = function(as)
{
	/*("FormController_configureAdaptors")*/
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController._configureAdaptors()");
	var cm = this.getFormView().getConfigManager();
	
	// Configure each adaptor in turn
	for(var j = 0,al=as.length; j < al; j++)
	{
		//if(FormController.m_logger.isTrace()) FormController.m_logger.trace("FormController._configureAdaptors() adaptor = " + as[j].getDisplayName());

		// Get the configuration objects that apply to the current adaptor
		var a = as[j];
		var cs = cm.getConfig(a.getId());
		a.configure(cs);
	}
	/*("FormController_configureAdaptors")*/
}

FormController.prototype.determineDataDependencies = function(adaptor, value, dataDependencyOnCheck)
{
	if(FormController.m_logger.isTrace()) FormController.m_logger.trace("FormController.determineDataDependencies() adaptor = " + adaptor.getDisplayName());
	if(value!=null && value!="")
	{
		var containerAdaptors = this.m_containerAdaptors;
		for(var i in containerAdaptors)
		{
			
			var container = containerAdaptors[i];
			var containerDb = container.dataBinding;
			var index = value.indexOf(containerDb);
			if(index!=-1 && (adaptor.getId() != container.getId()))
			{
				// We only want to determine a dependency if the container databinding is used in a predicate
				// to define a master detail. If the container databinding is a substring of another container's
				// databinding then we could find incorrect dependencies, hence we check that the next character
				// if an equals (after trimming any whitespace). The only exception to this is for tab selectors
				// and paged areas that share the same dataBinding, so if the dataBindings are the same then
				var sub = String.trim(value.substring(index + containerDb.length));
				var firstChar = null;
				if(sub.length > 0)
				{
					firstChar = sub.charAt(0);
					if(firstChar == "=" || firstChar == "]")
					{
						// setup the tree in both directons, we bubble event up the tree
						// but we may want to drive down the tree to find invalid fields etc.
						container.addChild(adaptor);
						adaptor.addDataDependency(container);
					}
					else
					{
						// ToDo: need to account for 'add' conditions, but for now can workaround
						// using dataDependencyOn configuration
					}
				}
				else
				{
					if(dataDependencyOnCheck == true)
					{
						// setup the tree in both directons, we bubble event up the tree
						// but we may want to drive down the tree to find invalid fields etc.
						container.addChild(adaptor);
						adaptor.addDataDependency(container);
					}
					else if(value == containerDb && container.constructor == TabSelectorGUIAdaptor && (adaptor.constructor == PagedAreaGUIAdaptor || adaptor.constructor == PageGUIAdaptor) )
					{
						// setup the tree in both directons, we bubble event up the tree
						// but we may want to drive down the tree to find invalid fields etc.
						container.addChild(adaptor);
						adaptor.addDataDependency(container);
					}
				}
			}
		}
	}
}


/*
 * The question is whether string concatenation and array splicing is slower than lots of regexp tests?
 */
FormController.prototype._bindLifeCycles = function(a, ignorePrecompile)
{
	/*("FormController_bindLifeCycles")*/
	if(FormController.m_logger.isTrace()) FormController.m_logger.trace("FormController._bindLifeCycles() adaptor = " + a.getDisplayName());
	
	// This is used by dynamic pages because the pre-compile does not generate the
	// regNodes for these pages.
	if(ignorePrecompile == null)
	{
		ignorePrecompile = false;
	}

	// register for state change events	
	a.register(FormControllerListener.create(a, FormController.STATECHANGE));
	
	// register the adaptors DataModel listeners
    if (!FormController.regNodes || ignorePrecompile == true)
    {
    	a.registerListeners();
    }
    
	/*("FormController_bindLifeCycles")*/
}


FormController.prototype._determineDataDependencies = function(a)
{
	/*("FormController_determineDataDependencies")*/
	var dm = this.m_dataModel;

	var db = null;
	if(null != a.getDataBinding)
	{
		db = a.getDataBinding();
		if(null != db)
		{
			this.determineDataDependencies(a, db);
		}
		var on = a.getRetrieveOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
				this.determineDataDependencies(a, on[i]);
			}
		}	
	}
	if ( a.getSrcData && (null != a.getSrcData()) ) 
	{
		var srcDataOn = a.getSrcDataOn() ;
		if ( null != srcDataOn )
		{
			for(var i = srcDataOn.length-1; i>=0; i--)
			{
				this.determineDataDependencies(a, srcDataOn[i]);
			}
		}
	}
	var on = a.getDataDependencyOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
			this.determineDataDependencies(a, on[i], true);
		}
	}
	/*("FormController_determineDataDependencies")*/
}


FormController.prototype.startDataTransaction = function(a)
{
	if(FormController.m_logger.isError()  && null!=this.m_dataTransactionAdaptor)
	{
		FormController.m_logger.error("FormController.startDataTransaction(): second data transaction started before previous transaction completed."
		 + " Current transaction adaptor: " + ((this.m_dataTransactionAdaptor == null) ? "null" : this.m_dataTransactionAdaptor.getId())
		 + " new transaction adaptor: " + ((a == null) ? "null" : a.getId()));
	}

	this.m_dataTransactionAdaptor = a;
	if(a.supportsProtocol("ValidationProtocol") && (a.hasValidate() || a.hasServerValidate()))	
	{
		this.m_dataTransactionAdaptorValidState = a.getValid();
		this.m_dataTransactionAdaptorValue = Services.getValue(a.dataBinding);
	}
}


FormController.prototype.endDataTransaction = function(a)
{
	if(FormController.m_logger.isError()  && a!=this.m_dataTransactionAdaptor)
	{
		FormController.m_logger.error("FormController.endDataTransaction(): previous transaction did not complete before this transaction completed."
		 + " Current transaction adaptor: " + ((this.m_dataTransactionAdaptor == null) ? "null" : this.m_dataTransactionAdaptor.getId())
		 + " new transaction adaptor: " + ((a == null) ? "null" : a.getId()));
	}
	if(a.supportsProtocol("ValidationProtocol") && (a.hasValidate() || a.hasServerValidate()))
	{
		var validStateChanged = false;
		var valueChanged = false;
		var validState = a.getValid();
		var value = Services.getValue(a.dataBinding);
		if(validState == false && this.m_dataTransactionAdaptorValidState == true) validStateChanged = true;
		if(this.m_dataTransactionAdaptorValue != value) valueChanged = true;
		
		if(validStateChanged == true || (validStateChanged == false && valueChanged == true && validState == false))
		{
		    // Defect 1174. If text box, or derivative, unfocus adaptor before submitting
		    // validation error tab event. Otherwise, browser does not highlight
		    // invalid text correctly.
		    if((a instanceof TextInputElementGUIAdaptor) ||
		       (a instanceof TextAreaElementGUIAdaptor) ||
		       (a instanceof DateTextInputElementGUIAdaptor))
		    {
		        this.m_tabbingManager._unfocusCurrentFocussedAdaptor( null, false );
		    }
		    
			if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Value of invalid field changed so resetting focus to invalid field.");
			this.m_tabbingManager.setValidationFailedAdaptor(a);
		}
		else
		{
			if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Value of invalid field has not changed - not resetting focus.");
		}
	}
	else
	{
		if(FormController.m_logger.isDebug()) FormController.m_logger.debug("endDataTransaction(): Updated field does not support validation - not resetting focus.");
	}
	this.m_dataTransactionAdaptor = null;
}

FormController.prototype.processEvents = function()
{
    if(FormController.getDebugMode() == false)
    {
	    try
	    {   
		    this._processEvents();
		}
		catch(exception)
		{
		    FormController.handleFatalException(exception);
		}
	}
	else
	{
		this._processEvents();
	}
}

FormController.prototype._processEvents = function()
{
    /*("FormController_processEvents")*/
    if(FormController.m_logger.isInfo()) FormController.m_logger.info("FormController.processEvents(). Starting processing events");
    var recheckQueue = false;
    var repaintQueue = new Array();
    
    // Fix for defect 870. Position dirty record queue before srcData queue.

    var queues = [
	    FormController.DEFAULT,
	    FormController.DIRTY_RECORD,
	    FormController.SRCDATA,
	    FormController.LAZY_FETCH_RECORD,
	    FormController.FILTER,
	    FormController.REFRESH,
	    FormController.VALIDATION,
	    FormController.ENABLEMENT,
	    FormController.MANDATORY,
	    FormController.READONLY,
	    FormController.LOGIC,
	    FormController.FORMDIRTY,
	    FormController.LABEL,
	    FormController.STATECHANGE,
	    FormController.LOAD,
	    FormController.UNLOAD
    ];

    // The count was a simple hack to test the effect of stopping the cascading effect of mutator
    // logics which can cause multiple loops around the processEvents loop.
    //var count = 0;
	
    // Process event queues until they are all empty
    do
    {
	    do
	    {
		    recheckQueue = false;
		    for(var i = 0, l = queues.length; i < l; i++)
		    {
			    repaintQueue = this.m_eventQueueMap.processEventsForQueue(queues[i], repaintQueue);
		    }
		
		    // Check queue lengths again see if there are further events to process. Events such
		    // as logic events may cause further updates to the client side DOM creating
		    // additional queue events.
		    recheckQueue = this.m_eventQueueMap.queuesHaveEvents( queues );
	    }
	    while(recheckQueue);

	    // Process business life cycle events after all updates to data model.
	    if(this._processBusinessLifeCycleEvents() == true) recheckQueue = true;
    }
    while(recheckQueue);

    // Process server-side validation events after all updates to data model.
    repaintQueue = this._processServerValidationEvents(repaintQueue);

    // If the currently focussed field's state has changed so that it can no longer
    // accept the focus we need to move the focus onto the next field that can accept
    // the focus. We need to do this before rendering the field, as disabling a field
    // which currently has focus tends to blow up Internet Explorer...
    this.m_tabbingManager.updateFocus();

    // @todo:
    // Should be processing tabbing events here and repainting fields which changed
    // focus as part of the repaint queue

    // Repaint here fields that need to be repainted
    for(var i in repaintQueue)
    {
	    repaintQueue[i].renderState();
    }
    
    // Defect 961. In some cases, especially involving tabbed paged areas, events
    // may remain unprocessed at this stage. If this is the case recursively call
    // method to clear event queue.
    if(this.m_eventQueueMap.queuesHaveEvents( queues ))
    {
        this._processEvents();
    }

    if(FormController.m_logger.isInfo()) FormController.m_logger.info("Finished processing events");
    /*("FormController_processEvents")*/
}


FormController.prototype._processServerValidationEvents = function(repaintQueue)
{
	repaintQueue = this.m_eventQueueMap.processEventsForQueue(FormController.SERVER_VALIDATION, repaintQueue);
	return repaintQueue;
}


FormController.prototype._processBusinessLifeCycleEvents = function()
{
	if(FormController.m_logger.isDebug()) 
	{
		FormController.m_logger.debug("Processing business life cycle events size: " + this.m_businessLifeCycleEventQueue.length);
	}

	// If this function wasn't triggered by a timeout, cancel any existing timeout
	if(this.m_businessLifeCycleEventTimeout != null)
	{
		clearTimeout(this.m_businessLifeCycleEventTimeout);
		this.m_businessLifeCycleEventTimeout = null;
	}

	var eventsProcessed = false;

	if(this.m_businessLifeCycleEventQueue.length > 0)
	{
		eventsProcessed = true;
		do
		{
			var q = this.m_businessLifeCycleEventQueue;
			this.m_businessLifeCycleEventQueue = new Array();
			
			if(q.length > 1)
			{
			    // Remove duplicate action events from queue
			    q = this._filterDuplicateActionBusinessLifeCycleEvents(q);
			}
			
			for(var i = 0, l = q.length; i < l; i++)
			{
				var e = q[i];
				var id = e.getComponentId();
				var a = this.getAdaptorById(id);
				
				if(null != a)
				{
					if(a.supportsProtocol(BusinessLifeCycleProtocol.PROTOCOL_NAME))
					{
						if(e.getType() == BusinessLifeCycleEvents.EVENT_NAVIGATE && this.getAppController().getServiceRequestCount() > 0)
						{
							this.m_pendingNavigationBusinessLifeCycleEvent = e;
							this.startNavigationTimeout();
						}
						else
						{
							a.handleBusinessLifeCycleEvent(e);
						}
					}
					else
					{
						if(FormController.m_logger.isError()) FormController.m_logger.error("FormController::_processBusinessLifeCycleEvents(): adaptor with id '" + id + "' does not support " + BusinessLifeCycleProtocol.PROTOCOL_NAME);
					}
				}
				else
				{
					if(FormController.m_logger.isError()) FormController.m_logger.error("FormController::_processBusinessLifeCycleEvents(): adaptor with id '" + id + "' not found");
				}
			}
		}
		while(0 != this.m_businessLifeCycleEventQueue.length);
	}
	
	return eventsProcessed;
}

/**
 * If a user clicks a button, or presses a hot key combination, rapidly it is possible
 * that the same business life cycle event may be queued twice. This is generally
 * undesirable and may cause real problems if the method _processEvents is invoked
 * from the data model listener. In this case data events from the two life cycles
 * will be processed together which may casue important events to be lost. To prevent
 * this happening this method removes any duplicate events from the business life cycle
 * queue.
 *
 * @param orginalQueue An array containing the life cycle events to be processed.
 * @return Returns an array of unique life cycle events
 *
 */
FormController.prototype._filterDuplicateActionBusinessLifeCycleEvents = function( originalQueue )
{
    // Create object used to store life cycle event references
    var refStore = new Object();
    
    var filteredQueue = new Array();
    
    for(var i = 0, l = originalQueue.length; i < l; i++)
    {
        var event = originalQueue[i];
        
        if(event.getType() == BusinessLifeCycleEvents.EVENT_ACTION)
        {
            var uniqueEventRef = event.getComponentId() +
                                 "_" +
                                 event.getType();
                             
            if(null == refStore[ uniqueEventRef ])
            {
                refStore[ uniqueEventRef ] = true;
            
                filteredQueue[ filteredQueue.length ] = event;
            }
        }
        else
        {
            filteredQueue[ filteredQueue.length ] = event;
        }
    }
    
    if(filteredQueue.length != originalQueue.length)
    {
        if(FormController.m_logger.isDebug()) 
	    {
		    FormController.m_logger.debug( "Duplicate business life cycle events removed by queue processing" );
	    }
    }
    
    // Clean reference store
    refStore = null;
    
    return filteredQueue
}

FormController.prototype.startNavigationTimeout = function()
{
	if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController::startNavigationTimeout(): this.getAppController().getServiceRequestCount() =  " + this.getAppController().getServiceRequestCount() + ", therefore pending navigation event until all requests complete");
	if(this.m_navigationBusinessLifeCycleEventTimeout != null)
	{
		clearTimeout(this.m_navigationBusinessLifeCycleEventTimeout);
		this.m_navigationBusinessLifeCycleEventTimeout = null;
	}
	this.m_navigationBusinessLifeCycleEventTimeout = setTimeout("FormController.getInstance()._processNavigationBusinessLifeCycleEvent()", 100);
}


FormController.prototype._processNavigationBusinessLifeCycleEvent = function()
{
	if(this.m_navigationBusinessLifeCycleEventTimeout != null)
	{
		clearTimeout(this.m_navigationBusinessLifeCycleEventTimeout);
		this.m_navigationBusinessLifeCycleEventTimeout = null;
	}
	if(this.getAppController().getServiceRequestCount() > 0)
	{
		if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController::_processNavigationBusinessLifeCycleEvent(): this.getAppController().getServiceRequestCount() =  " + this.getAppController().getServiceRequestCount() + ", therefore still pending navigation event until all requests complete");
		this.startNavigationTimeout();
	}
	else
	{
		var e = this.m_pendingNavigationBusinessLifeCycleEvent;
		var id = e.getComponentId();
		if(FormController.m_logger.isDebug()) FormController.m_logger.debug("FormController::_processNavigationBusinessLifeCycleEvent(): all service requests now completed, sending navigation event to adaptor " + id);
		var a = this.getAdaptorById(id);
		a.handleBusinessLifeCycleEvent(e);
	}
}

/**
 * Method to validate the entire form
 *
 * @param showErrorDialog if true, then an error dialog is shown to the user describing
 *        the invalid fields
 * @returns an array containing the invalid fields. If the array is empty then the
 *          form is valid.
 */
FormController.prototype.validateForm = function(showErrorDialog, showFirstInvalidField, ignoreSubmissibility)
{
	if(ignoreSubmissibility == true)
	{
		return this.validateFormIgnoringSubmissibility(showErrorDialog, showFirstInvalidField);
	}

	var invalidFields = new Array();

	// force a refresh of all temporay states because this state doesn't fire from data model events
	Services.startTransaction();
	var as = this.m_adaptors;
	for(var i = 0, l = as.length; i < l; i++)
	{
		var a = as[i];
		
		if(a.invokeIsTemporary)
		{
			a.invokeIsTemporary();
		}
	}
	Services.endTransaction();
	
	// We have commented out the code to make the form the root of the data dependency tree
	// as an attempt to increase performance
	var submissible = this.getFormAdaptor().isSubmissible();
	if(false == submissible)
	{
		var as = this.m_adaptors;
		for(var i = 0, l = as.length; i < l; i++)
		{
			var a = as[i];
			
			if(a.getDataBinding && !a.isSubmissible() && a.includeInValidation==true)
			{
				invalidFields[invalidFields.length] = a;
			}
		}
		
		if(invalidFields.length > 0)
		{
			this.showInvalidFields(invalidFields, showErrorDialog, showFirstInvalidField);
		}
	}	
	return invalidFields;
}


FormController.prototype.validateFormIgnoringSubmissibility = function(showErrorDialog, showFirstInvalidField)
{
	var invalidFields = new Array();
	
	var as = this.m_adaptors;
	for(var i = 0, l = as.length; i < l; i++)
	{
		var a = as[i];
		
		var supportsTemporary = (a.hasTemporary != null);
		
		// if (field does not support temporary || (field supports temporary && if field is not temporary))
		// then we need to check if field is valid
		if(!supportsTemporary || (supportsTemporary && !a.invokeIsTemporary()))
		{	
			// If field supports da`inding
			if(a.getDataBinding)
			{
				if(a.hasValue())
				{
					if(a.hasValidate && (a.getLastError() != null) && a.includeInValidation==true)
					{
						invalidFields[invalidFields.length] = a;
					}
				}
				else
				{
					if(a.hasIsMandatory && a.getMandatory() && a.includeInValidation==true)
					{
						invalidFields[invalidFields.length] = a;
					}
				}
			}
		}
	}
	
	if(invalidFields.length > 0)
	{
		this.showInvalidFields(invalidFields, showErrorDialog, showFirstInvalidField);
	}
	
	return invalidFields;
}

/**
 * Method that if required shows the invalid fields in a dialog and sets the focus on
 * the first invalid field.
 *
 * @param invalidFields array of adaptors for the invalid fields
 * @param showErrorDialog if true then show the invalid fields in a dialog
 * @param showFirstInvalidField if true then set the focus on the first invalid field
 */
FormController.prototype.showInvalidFields = function(invalidFields, showErrorDialog, showFirstInvalidField)
{
	if(showErrorDialog)
	{
		var dialogStyle = this.getAppController().getDialogStyle();
		var lineBreak = (AppConfig.FRAMEWORK_DIALOG_STYLE == dialogStyle) ? "<br>" : "\n";
		var msg = "Form cannot be submitted as it has invalid values. The following fields have invalid values: ";
		
		for (var i = 0; i < invalidFields.length; i++)
		{
			var a = invalidFields[i];
			msg += lineBreak + a.getDisplayName();
		}
		
		if(AppConfig.FRAMEWORK_DIALOG_STYLE == dialogStyle)
		{
			var thisObj = this;
			var _showFirstInvalidField = showFirstInvalidField;
			
	        var callbackFunction = function(userResponse)
	        {
				if(_showFirstInvalidField)
				{
					// Bring first invalid field into focus. Done on a timeout because showInvalidField
					// shows any popup/subform by a direct call to the show method not via a lifecycle.
					// The events generated by lowering the OK dialog box don't get processed before
					// the popup/subform is shown and any underlying selects are not hidden.
					setTimeout(function() { thisObj.showFirstInvalidField(invalidFields, false); }, 0);
				}
	        }
	        
			// Raise standard OK dialog box and call the set focus method when
			// OK is clicked
			Services.showDialog(StandardDialogTypes.OK, callbackFunction, msg);
			
			// Prevent the focus method from running twice
			showFirstInvalidField = false;
		}
		else
		{
			// Raise browser OK dialog box
			alert(msg);
		}
	}
	
	if(showFirstInvalidField)
	{
		// Bring first invalid field into focus
		this.showFirstInvalidField(invalidFields, false);
	}
}

/*
 * Only used for debug and FUnit tests
 */
FormController.prototype._getFirstInvalidField = function()
{
	return this.m_firstInvalidField;
}

// ToDo: this needs to be extended to set the key to the key that has
// a not-submissible aggregate state stored against it. 
// Modify so that Grid's aren't set focus to unless they are the only fields invalid
FormController.prototype.showFirstInvalidField = function(invalidFields, focusOnGrids)
{
	if(focusOnGrids == null) focusOnGrids = false;
	var foundField = false;
	var formAdaptor = this.getFormAdaptor();
	mainloop:
	for(var i=0; i < invalidFields.length ; i++)
	{
		var field = invalidFields[i];
		if(focusOnGrids==true || !(field instanceof GridGUIAdaptor))
		{
			try
			{
				this.showInvalidField(field);
				foundField = true;
							
				// Only show the first field we come across
				break mainloop;
			}
			catch(exception)
			{
				/*
				 * Ignore configuration exceptions at this release, indicates
				 * an external adaptor is in use which does not yet support
				 * containers
				 */
				if(exception.constructor != ConfigurationException)
				{
					throw exception;
				}
			}
		}
	}
	if(foundField==false && focusOnGrids==false && invalidFields.length > 0)
	{
		this.showFirstInvalidField(invalidFields, true);
	}
}


FormController.prototype.showInvalidField = function(field)
{
	// Get the parent containers of the field
	var containers = this._getParentContainers(field);

	while(containers.length > 0)
	{
		var container = containers.pop();
		if(container.configComponentVisibilityProtocol)
		{
			container.show(true);
		}
	}
	field.showNonSubmissibleParents();
	this.getTabbingManager().setFocusOnAdaptor(field) ;

	// Only used for debug and FUnit tests
	this.m_firstInvalidField = field;
}


FormController.prototype._getParentContainers = function(adaptor)
{
	var parent = adaptor.getParentContainer();

	if(null == parent)
	{
		// Bottom of the stack
		return [];
	}
	else
	{
		var containers = [parent];
		return containers.concat(this._getParentContainers(parent));
	}	
}


/**
 * Dispatch a BusinessLifeCycleEvent to a component
 *
 * @param id the id of the GUIAdaptor to send the event to
 * @param type the type of event to dispatch
 * @param detail additional detail object required by the particular event type. May be null.
 */
FormController.prototype.dispatchBusinessLifeCycleEvent = function(id, type, detail)
{
    var eventAdaptor = null;

    if( type == BusinessLifeCycleEvents.EVENT_RAISE )
    {
        eventAdaptor = FormController.getInstance().getAdaptorById( id );

        if( eventAdaptor instanceof PopupSubformGUIAdaptor )
        {
            if( eventAdaptor.subformViewFormControllerExists() )
            {
                // Defect 1112. If subform exists before raise the subform has been
                // raised previously and not destroyed on closing. Therefore, reactivate
                // submission of events to queue.
                eventAdaptor.setSubformViewFormControllerBusinessLifeCycleEventSubmission( true );
            }
        }
    }
    
    if( this.m_allowBusinessLifeCycleEventSubmission != false )
    {
    
	    if(FormController.m_logger.isDebug()) 
	    {
		    FormController.m_logger.debug("Dispath business life cycle event id: " + id + ", type: " + type + ", detail: " + detail);
	    }

	    var q = this.m_businessLifeCycleEventQueue;
	    q[q.length] = BusinessLifeCycleEvent.create(id, type, detail);
	
	    if(this.m_businessLifeCycleEventTimeout == null)
	    {
		    var thisObj = this;
		    this.m_businessLifeCycleEventTimeout = setTimeout(function() { thisObj.processEvents(); }, 0);
	    }
	    
	    if( type == BusinessLifeCycleEvents.EVENT_LOWER )
        {
            eventAdaptor = FormController.getInstance().getAdaptorById( id );
    
            if( eventAdaptor instanceof PopupSubformGUIAdaptor )
            {
                // Check popup subform contains a FormController
                // as popup may receive lower event when not displayed.
                if( eventAdaptor.subformViewFormControllerExists() )
                {
                    // Defect 1112. After submission of lower event to subform popup
                    // disable submission of life cycle events to queue.
                    eventAdaptor.setSubformViewFormControllerBusinessLifeCycleEventSubmission( false );
                }
            }
        }   
	    
	} // End of if( this.m_allowBusinessLifeCycleEventSubmission != false )
}

/**
 * Method updates flag used to control submission of business life cycle events.
 *
 * @param allowEventSubmission Boolean flag indicating whether, or not, business
 *                             life cycle events should be submitted to event queue.
 *
*/
FormController.prototype.setAllowBusinessLifeCycleEventSubmission = function( allowEventSubmission )
{
    this.m_allowBusinessLifeCycleEventSubmission = allowEventSubmission;
}

/**
 * Queue an event
 *
 * @param n the name of the queue to add the event to
 * @param a the adaptor to update
 * @param e the DataModelEvent which describes the change to the DataModel
 */
FormController.prototype.queueEvent = function(n, a, e, detail)
{
	//Commented out to resolve defect 266 regarding cleartext password being stored in event for statechangeevent.
	//if(FormController.m_logger.isDebug())
	//{
	//	if(FormController.m_logger.isDebug()) FormController.m_logger.debug(n + " event queued for field " + a.getId() + ". Event details: " + e);
	//}
	
	this.m_eventQueueMap.addEventToNamedQueue(n, a, e, detail);
}


/**
 * Method removes specified nodes from data model. This method is invoked
 * prior to storing the application state when navigating to a new form.
 *
 */
FormController.prototype.removeXPathsBeforeFormNavigation = function()
{
    // Retrieve list of XPaths to be removed
    var formAdaptor = this.getFormAdaptor();
    
    var removeXPaths = formAdaptor.m_removeXPaths;
    
    formAdaptor.removeSelectedXPaths( removeXPaths );
    
}

/**
 * Method relays application closure request to AppController. Require
 * static method on class to enable menu to lookup function.
 *
*/
FormController.exitApplication = function()
{
    var fc = FormController.getInstance();
    
    fc.getAppController().exit();
}




/**
 * General handler for fatal exceptions raised by form controller
 *
 * @param exception The exception to be handled
 *
*/
FormController.handleFatalException = function(exception)
{
    fwException.invokeFatalExceptionHandler(exception);
}

/**
 * Method allows framework general exception handler to be
 * overridden by a custom exception handler.
 *
 * @param func The custom exception handler function. Note that
 *             this function must define a single argument, the
 *             exception to be handled.
 *
*/
FormController.setFatalExceptionHandler = function(func)
{
    fwException.setFatalExceptionHandler(func);
}

/**
 * Method returns reference to array of WordProcessingGUIAdaptors
 * associated with form. Note that for many forms this array
 * will be empty.
 *
*/
FormController.prototype.getWordProcessingGUIAdaptors = function()
{
    return this.m_wordProcessingGUIAdaptors;
}

/**
 * Method used by WordProcessingGUIAdaptors to register themselves
 * as WordProcessingGUIAdaptors with FormController when they are
 * created.
 *
*/
FormController.prototype.addWordProcessingGUIAdaptor = function(adaptor)
{
    this.m_wordProcessingGUIAdaptors[this.m_wordProcessingGUIAdaptors.length] = adaptor;
}

/**
 * Method used to indicate whether, or not, all instances of FCKeditor
 * associated with a form have been loaded completely. One instance
 * of the editor is created for each instance of the class
 * WordProcessingGUIAdaptor.
 *
*/
FormController.prototype.FCKeditorLoadingComplete = function()
{
    var loadingComplete = true;
    
    // Check each word processing GUI adaptor for editor load
    var wordProcessingGUIAdaptors = this.m_wordProcessingGUIAdaptors;
    
    for(var i = 0, l = wordProcessingGUIAdaptors.length; i < l; i++ )
    {
        if(wordProcessingGUIAdaptors[i].getFCKeditorLoadComplete() == false)
        {
            loadingComplete = false;
            break;
        }
    }
    
    return loadingComplete;
}

/**
 * Displays a message in a Framework or browser OK dialog.
 *
 * @param msg - the message to display in the dialog.
 * @param callback - function to call when OK button clicked. If not defined
 * then a default function that does nothing is used.
 */ 
FormController.prototype.showAlert = function(msg, callback)
{
	var ac = this.getAppController();
	
	callback = (null == callback) ? function(userResponse) {} : callback;
	
	if (ac.getDialogStyle() == AppConfig.FRAMEWORK_DIALOG_STYLE)
	{
		Services.showDialog(StandardDialogTypes.OK, callback, msg);
	}
	else
	{
		alert(msg);
	}
}

/** 
 * Method adds a reference to an event binding to the array used 
 * to store event bindings with associated enablement rules.
 *
 */
FormController.prototype.addEnablementEventBinding = function( eventBinding )
{    
    var id = eventBinding.getId();        

    if( null == this.m_enablementEventBindings[ id ] )    
   {        
        this.m_enablementEventBindings[ id ] = eventBinding; 
   }
}

/** 
* Method returns a reference to an event binding with an associated 
* enablement rule based on the event binding's identifier 
*
*/
FormController.prototype.getEnablementEventBindingById = function( id )
{    
    return this.m_enablementEventBindings[ id ];
}




















//=========================================================================================
// OBSOLETE FUNCTIONALITY
//=========================================================================================


/**
 * Wrapper for backwards compatibility. Forms should now dispatch events to raise popups
 * but we do it for them, and have renamed the old code.
 */ 
FormController.prototype.showFormExtensionPopup = function(elementId)
{
	if(FormController.m_logger.isError())FormController.m_logger.error(
		"showFormExtensionPopup is deprecated - use Services.dispatchEvent(popup_id, PopupGUIAdaptor.EVENT_RAISE); to show popups");

    Services.dispatchEvent(elementId, PopupGUIAdaptor.EVENT_RAISE);
}


/**
 * Wrapper for backwards compatibility. Forms should now dispatch events to raise popups
 * but we do it for them, and have renamed the old code.
 */ 
FormController.prototype.hideFormExtensionPopup = function()
{
	if(FormController.m_logger.isError())FormController.m_logger.error(
		"hideFormExtensionPopup is deprecated - use Services.dispatchEvent(popup_id, PopupGUIAdaptor.EVENT_LOWER); to show popups");

	if(AbstractPopupGUIAdaptor.m_popups.length > 0)
	{
		Services.dispatchEvent(AbstractPopupGUIAdaptor.m_popups[AbstractPopupGUIAdaptor.m_popups.length - 1].getId(), PopupGUIAdaptor.EVENT_LOWER);
	}
}


FormController.prototype._setDOM = function(dom)
{
	alert("FormController._setDOM() is deprecated and is scheduled to be removed in the next Framework release.\nUsing it _will_ break your form and application!");
	if(FormController.m_logger.isError())FormController.m_logger.error("_setForm is deprecated!");

	fc_assert(null != dom, "DOM cannot be null");
	
	this.m_dataModel.setInternalDOM(dom);
}


FormController.prototype.getDOM = function(dom)
{
	alert("FormController.getDOM() is deprecated and is scheduled to be removed in the next Framework release.\nUsing it _will_ break your form and application!");
	if(FormController.m_logger.isError())FormController.m_logger.error("getDOM is deprecated!");

	return this.m_dataModel.getInternalDOM();
}

