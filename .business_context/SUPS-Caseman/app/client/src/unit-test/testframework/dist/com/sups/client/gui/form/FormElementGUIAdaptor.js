//==================================================================
//
// FormElementGUIAdaptor.js
//
// Base class for adapting input elements for use in the framework
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @constructor
 */
function FormElementGUIAdaptor()
{
}


FormElementGUIAdaptor.m_logger = new Category("FormElementGUIAdaptor");


/**
 * FormElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
FormElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("FormElementGUIAdaptor");


/**
 * Add the required protocols to the FormElementGUIAdaptor
 */
GUIAdaptor._setUpProtocols('FormElementGUIAdaptor');
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'ComponentContainerProtocol');				// 
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'DataBindingProtocol');
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'BusinessLifeCycleProtocol');
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'EnablementProtocol');            // Supports enablemen
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'ReadOnlyProtocol');			// Supports enablement/disablement
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'FormDirtyProtocol');				// Supports form dirty
GUIAdaptor._addProtocol('FormElementGUIAdaptor', 'RecordsProtocol');				// Supports form dirty

/**
 * Set the constructor property so we can identify the type
 */
FormElementGUIAdaptor.prototype.constructor = FormElementGUIAdaptor;


/**
 * CSS class set on the form to indicate that it is not submissable
 */
FormElementGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS = "form_notsubmissable";


/**
 * Default location of the form's model data in the DataModel
 *
 * @type String
 */
FormElementGUIAdaptor.DEFAULT_MODEL_XPATH = DataModel.DEFAULT_ROOT;

/**
 * ID for the form's status line. Defaults to "status_line".
 *
 * @type String
 * @configuration
 */
FormElementGUIAdaptor.prototype.statusLine = "status_line";


/**
 * Reference to the status bar HTML element
 */
FormElementGUIAdaptor.prototype.m_statusLine = undefined;


/**
 * Define class members used to represent state of form
 *
 */
FormElementGUIAdaptor.FORM_BLANK = FormLifeCycleStates.FORM_BLANK;
FormElementGUIAdaptor.FORM_CREATE = FormLifeCycleStates.FORM_CREATE;
FormElementGUIAdaptor.FORM_MODIFY = FormLifeCycleStates.FORM_MODIFY;


/**
 * Names of the Nodes that are maintained by the form under its dataBinding
 */
FormElementGUIAdaptor.FORM_STATE_XPATH = "/state";
FormElementGUIAdaptor.FORM_DIRTY_XPATH = "/dirty";


/**
 * Variable to store a reference when the transient message on
 * the statusbar was set.
 */
FormElementGUIAdaptor.prototype.m_transientMessageTimeout = null;


/**
 * Amount of time (in milliseconds) after which a transient message
 * may be overwritten by an tabbing event. 
 */
FormElementGUIAdaptor.STATUSBAR_TIMEOUT = 1000;


/**
 * Stores an array of nodes (relative to /ds/var) which will 
 * not be cleared when clearDataModel is invoked.
 * Defaults to form parameters.
 */
FormElementGUIAdaptor.prototype.m_dmClearExclusionNodes = new Array("app","form");


/*
 * Defines the mandatory location for the form databinding.
 */
FormElementGUIAdaptor.prototype.FORM_REQUIRED_DATABINDING_ROOT = FormDatabindings.DEFAULT_FORM_DATABINDING_ROOT;


/**
 * Stores an array of XPaths which will be cleared when
 * the application navigates away from the form represented
 * by this adaptor.
 *
*/
FormElementGUIAdaptor.prototype.m_removeXPaths = null;


/**
 * Reference Data to be loaded on form initialisation
 *
 * @configuration
 * @type Array[Object]
 */
FormElementGUIAdaptor.prototype.refDataServices = [];


/**
 * Submit Lifecycle configuration
 *
 * @configuration
 * @type Object
 */
FormElementGUIAdaptor.prototype.submitLifeCycle = null;


/**
 * Clear Lifecycle configuration
 *
 * @configuration
 * @type Object
 */
FormElementGUIAdaptor.prototype.clearLifeCycle = null;


/**
 * Create Lifecycle configuration
 *
 * @configuration
 * @type Object
 */
FormElementGUIAdaptor.prototype.createLifeCycle = null;


/**
 * Modify Lifecycle configuration
 *
 * @configuration
 * @type Object
 */
FormElementGUIAdaptor.prototype.modifyLifeCycle = null;


/**
 * Navigate Lifecycle configuration
 *
 * @configuration
 * @type Object
 */
FormElementGUIAdaptor.prototype.navigation = null;


/**
 * startupState configuration for the form
 *
 * @configuration
 * @type varies 
 */
FormElementGUIAdaptor.prototype.startupState = null;


/**
 * The XPath of the node which contains the forms model data.
 */
FormElementGUIAdaptor.prototype.modelXPath = null;


/**
 * Data to load at form initialisation
 *
 * @deprecated
 */
FormElementGUIAdaptor.prototype.loadModelDataService = null;



/**
 * Override includeInValidation property from StateChangeProtocol
 * - forms are not included in validation message
 *
 * @type boolean
 */
FormElementGUIAdaptor.prototype.includeInValidation = false;


/**
 * The initial state of the form. Will be one of the Form
 * LifeCycle State constants.
 *
 * @type String
 * @private
 */ 
FormElementGUIAdaptor.prototype.m_initialFormState = null;


/**
 * Whether or not the form should be marked as dirty on initialisation
 *
 * @type boolean
 * @private
 */
FormElementGUIAdaptor.prototype.m_markAsDirtyOnInitialise = false;


/**
 * Initialise the FormElementGUIAdaptor
 *
 * @param e the input element to manage
 */
FormElementGUIAdaptor.create = function(e)
{
	var a = new FormElementGUIAdaptor();

	a._initialiseAdaptor(e);
	
	return a;
}


/**
 * Initialise the FormElementGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
FormElementGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);

	// Create default data binding for backwards compatibility
	// with forms that do not use the form life cycle
	this.dataBinding = this.FORM_REQUIRED_DATABINDING_ROOT + "/" + this.getId();
	
	// Default the Form's DataBindingProtocol m_value to the correct initial state.
	this._setInitialValue();	

	// Add handlers to block form events
	var thisObj = this;
	
	// If one and only one text box is on a form, pressing the return key fires the
	// onsubmit event. (Could also be any adaptor which contains an input box, e.g.
	// date picker.) We need to block the submit because when the browser refreshes
	// the page after the submit completes adaptors are not rendered correctly.
	this.m_submitHandler = SUPSEvent.addEventHandler(this.m_element, "submit", function(evt) { thisObj._blockEventsForForm(evt); }, null);	

	// Disable drag and drop functionality in the Framework
	this.m_dragStartHandler = SUPSEvent.addEventHandler(this.m_element, "dragstart", function(evt) { thisObj._disableDragAndDrop(evt); }, null);

	// Hide the focus border on the BODY tag otherwise it may flash when the browser
	// momentarily focuses on it when tabbing
	//Change to fix firefox problem where this.m_element.document does not exist
	this.m_element.ownerDocument.body.setAttribute("hideFocus", "true");
}


FormElementGUIAdaptor.prototype.reinitialise = function()
{
	// Reset the data model as follows:
	//  - re-run reference data loading (so that it generates DataModel events)
	//  - re-run initial form model loading (so that it generates DataModel events)
	this._reinitialiseDataModel();
}


FormElementGUIAdaptor.prototype._reinitialiseDataModel = function()
{
	// Clear form model data from DataModel
    this.clearFormDataModel();

	// Default the Form's DataBindingProtocol m_value to the correct initial state.
	this._setInitialValue();

	// Re-run reference data loading - generating DataModel events
	this._loadReferenceData(true);
	
	// Load the initial model data - generating DataModel events
	this._loadInitialModelData(true);
	
	// Write form's current state to the DataModel.
	this.update();
}


FormElementGUIAdaptor.prototype._setInitialValue = function()
{
	// Default the Form's DataBindingProtocol m_value to the correct initial state.
	this.m_value = {
		state:	FormElementGUIAdaptor.FORM_BLANK,
		dirty:	false
	}
}


FormElementGUIAdaptor.prototype._dispose = function()
{
    if(this.m_submitHandler != null)
    {
        SUPSEvent.removeEventHandlerKey(this.m_submitHandler);
        this.m_submitHandler = null;
    }

    if(this.m_dragStartHandler != null)
    {
        SUPSEvent.removeEventHandlerKey(this.m_dragStartHandler);
        this.m_dragStartHandler = null;
    }
}


FormElementGUIAdaptor.prototype.renderState = function()
{
	this._renderForm("");
}


FormElementGUIAdaptor.prototype._renderForm = function(className)
{
	if(!this.getAggregateState().isSubmissible())
	{
		className += " " + FormElementGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;
	}
	
	this.m_element.className = className;
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
FormElementGUIAdaptor.prototype._configure = function(cs)
{
	// Locate life cycle and form navigation configuration objects within form configuration
	var c;
	
	var refDataServices = [];
	
	for(var i = 0, l = cs.length; i < l; i++)
	{
	    c = cs[i];
	    
	    if(c.submitLifeCycle && this.submitLifeCycle == null)
	    {
	        this.submitLifeCycle = c.submitLifeCycle;
	    }
	    
	    if(c.clearLifeCycle && this.clearLifeCycle == null)
	    {
	        this.clearLifeCycle = c.clearLifeCycle;
	    }
	    
	    if(c.createLifeCycle && this.createLifeCycle == null)
	    {
	        this.createLifeCycle = c.createLifeCycle;
	    }
	    
	    if(c.modifyLifeCycle && this.modifyLifeCycle == null)
	    {
	        this.modifyLifeCycle = c.modifyLifeCycle;
	    }
	    
	    if(c.startupState && this.startupState == null)
	    {
	    	this.startupState = c.startupState;
	    }
	    
	    // Retrieve navigation configuration
	    if(c.navigation && this.navigation == null)
	    {
	        this.navigation = c.navigation;
	    }
	    
	    if(c.loadModelDataService && this.loadModelDataService == null)
	    {
	    	this.loadModelDataService = c.loadModelDataService;
	    }
	    
	    // Most specific configuration is used.
	   	if(c.statusLine != null)
	   	{
	   		this.statusLine = c.statusLine;
	   	}

	   	if(c.prepareModelData)
	   	{
			this.prepareModelData = c.prepareModelData;	   	
	   	}
	   	
	   	// Concatanate reference data services
	   	if(c.refDataServices && c.refDataServices.length && c.refDataServices.length > 0)
	   	{
	   		refDataServices = refDataServices.concat(c.refDataServices);
	   	}
	   	
	   	if(c.modelXPath && this.modelXPath == null)
	   	{
	   		this.modelXPath = c.modelXPath;
	   	}
	}
	
	// Set final set of configured reference data services
	this.refDataServices = refDataServices;
	
	// If model XPath is not set then set it to the default
	if(null == this.modelXPath)
	{
		this.modelXPath = FormElementGUIAdaptor.DEFAULT_MODEL_XPATH;
	}
	else
	{
		// Check that model is not under /ds/var which is an invalid model xpath
		if(0 == this.modelXPath.indexOf(DataModel.VARIABLES_ROOT))
		{
			throw new ConfigurationException("Form " + this.getId() + " modelXPath cannot be inside " + DataModel.VARIABLES_ROOT + ". modelXPath is: " + this.modelXPath);
		}
	}
	
	// Determine if the form's dataBinding is located in a valid location
	if(this.dataBinding.indexOf(this.FORM_REQUIRED_DATABINDING_ROOT) != 0) 
	{
		throw new ConfigurationException("Form dataBinding must be under " 
										 + this.FORM_REQUIRED_DATABINDING_ROOT 
										 + ". Actual location: " + this.dataBinding);
	}


	// Create form submit lifecycle (may already have been added by subclass)
	if (this.m_lifeCycles[BusinessLifeCycleEvents.EVENT_SUBMIT] == null) 
	{
		var submitFormBusinessLifeCycle = SubmitFormBusinessLifeCycle.create();
		submitFormBusinessLifeCycle.initialise(this);
		this.addBusinessLifeCycle(submitFormBusinessLifeCycle);
		if(null != this.submitLifeCycle)submitFormBusinessLifeCycle.configure(this.submitLifeCycle);
		submitFormBusinessLifeCycle.start();
	}
	
	// Create form clear lifecycle
	var clearFormBusinessLifeCycle = ClearFormBusinessLifeCycle.create();
	clearFormBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(clearFormBusinessLifeCycle);
	
	// Create form create lifecycle
	var createFormBusinessLifeCycle = CreateFormBusinessLifeCycle.create();
	createFormBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(createFormBusinessLifeCycle);
	
	// Create form modify lifecycle
	var modifyFormBusinessLifeCycle = ModifyFormBusinessLifeCycle.create();
	modifyFormBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(modifyFormBusinessLifeCycle);

	// Create form navigate lifecycle
	var navigateFormBusinessLifeCycle = NavigateFormBusinessLifeCycle.create();
	navigateFormBusinessLifeCycle.initialise(this);
	this.addBusinessLifeCycle(navigateFormBusinessLifeCycle);
	
	// Configure life cycles
	if(null != this.clearLifeCycle)clearFormBusinessLifeCycle.configure(this.clearLifeCycle);
	if(null != this.createLifeCycle)createFormBusinessLifeCycle.configure(this.createLifeCycle);
	if(null != this.modifyLifeCycle)modifyFormBusinessLifeCycle.configure(this.modifyLifeCycle);
	
	// Start form life cycle event handlers - Is this the right place for this?
	clearFormBusinessLifeCycle.start();
	createFormBusinessLifeCycle.start();
	modifyFormBusinessLifeCycle.start();
	
	// Store XPaths to be removed on navigation to another form
	if(null != this.navigation)
	{
	    this.m_removeXPaths = this.navigation[ "removeXPaths" ];
	}
	
	// Load reference data
	this._loadReferenceData(false);
	
	// Load the initial model data
	this._loadInitialModelData(false);	
}


/**
 * Load reference data
 */
FormElementGUIAdaptor.prototype._loadReferenceData = function(withEvents)
{
	var rd = this.refDataServices;
	var l = rd.length;
	if(l > 0)
	{
		for(var i = 0; i < l; i++)
		{
			if(FormElementGUIAdaptor.m_logger.isTrace()) FormElementGUIAdaptor.m_logger.trace("About to create ref data service number " + i);
			var refDataLoader = fwFormRefDataLoader.create(rd[i], this, withEvents);
			refDataLoader.load();
		}
	}
	else
	{
		if(FormElementGUIAdaptor.m_logger.isInfo()) FormElementGUIAdaptor.m_logger.info("No ref data services configured for form " + this.getId());
	}
}



/**
 * Load data into form, both ref data and model data
 *
 * @private
 */
FormElementGUIAdaptor.prototype._loadInitialModelData = function(withEvents)
{
	// Data Loader used to load form data
	var modelDataLoader = null;

	// Configuration used during initialisation
	var initialConfig = null;

	// Determine initial state of the form
	this.m_value.state = this._determineInitialState();
	
	switch(this.m_value.state)
	{
		case FormElementGUIAdaptor.FORM_CREATE:
		{
			if(null == this.createLifeCycle)
			{
				throw new ConfigurationException("Form " + this.getId() + " configured to initially enter CREATE state but no createLifeCycle configuration specified");
			}

			// Create a DataService object which will load the model data using the createLifeCycle configuration
			modelDataLoader = fwFormInitModelDataLoader.create(this.createLifeCycle, this, withEvents);
			
			// Use the create config as the initial config
			initialConfig = this.createLifeCycle;

			break;
		}
		
		case FormElementGUIAdaptor.FORM_MODIFY:
		{
			if(null == this.modifyLifeCycle)
			{
				throw new ConfigurationException("Form " + this.getId() + " configured to initially enter MODIFY state but no modifyLifeCycle configuration specified");
			}

			// Create a DataService object which will load the model data using the createLifeCycle configuration
			modelDataLoader = fwFormInitModelDataLoader.create(this.modifyLifeCycle, this, withEvents);
			
			// Use the create config as the initial config
			initialConfig = this.modifyLifeCycle;

			break;
		}
		
		case FormElementGUIAdaptor.FORM_BLANK:
		{
			break;
		}
		
		default:
		{
			// No state specified and no update or modify lifecycles configured, so we assume that
			// we are running in backwards compatability (i.e. no form life cycles) mode.
			// Form stays in the BLANK state but may load data using the loadModelDataService
			this.m_value.state = FormElementGUIAdaptor.FORM_BLANK;
			
			if(null != this.loadModelDataService)
			{
			    modelDataLoader = fwFormInitModelDataLoader.create(this.loadModelDataService, this, withEvents);
			    if(FormElementGUIAdaptor.m_logger.isError()) FormElementGUIAdaptor.m_logger.error("Form with id: '" + this.getId() + "' uses obsolete loadModelDataService");
			}
			break;
		}
	}

	// If the form is entering CREATE or MODIFY lifecycle on initialisation,
	// then check if the form should be marked as dirty after initialisation
	if(null != initialConfig && null != initialConfig.initialise && null != initialConfig.initialise.markAsDirty)
	{
		// Hang on to mark as dirty config
		this.m_markAsDirtyOnInitialise = initialConfig.initialise.markAsDirty;
	}

	// If there is some model data to be loaded, then load it now...
	if(null != modelDataLoader)
	{
		modelDataLoader.load();
	}
}


/**
 * Determine the initial lifecycle state of the form.
 *
 * @return the initial state of the form, or if no FormLifeCycles configuration
 * is available, null.
 */
FormElementGUIAdaptor.prototype._determineInitialState = function()
{
	var s = null;
	if(this.startupState != null)
	{
        // Determine desired state for form. Note, if form state is
        // "Blank" neither service is invoked.
        s = this._invokeStartupState();
    }

    // State not explicitly determined by config, so we'll try to derive it from available config
    if(null == s)
    {		
		// Local references to create and modify lifecycle configurations
		var createConfig = this.createLifeCycle;
		var modifyConfig = this.modifyLifeCycle;

		if(null != createConfig && null == modifyConfig)
		{
			// Configure data service to load blank XML template
			if(FormElementGUIAdaptor.m_logger.isDebug()) FormElementGUIAdaptor.m_logger.debug("About to create model data service for new data");
			s = FormElementGUIAdaptor.FORM_CREATE;
		}
		else if(null == createConfig && null != modifyConfig)
		{
		    //Configure data service to load existing data
		    if(FormElementGUIAdaptor.m_logger.isDebug()) FormElementGUIAdaptor.m_logger.debug("About to create model data service for update data");
		    s = FormElementGUIAdaptor.FORM_MODIFY;
		}
		else if(null != createConfig && null != modifyConfig)
		{
			// Error. StartUpState must be defined if both initial services defined.
			throw new ConfigurationException( "Incorrect configuration for form " + this.getId() + ". startupState must be defined if both create and update lifecycles configured." );
		}
		else
		{
			// No create or update lifecycles declared and no initial form state
			// specified, so we assume we are running a form which does not have
			// form lifecycles configured.
		}
	}
	
	return s;
}


/**
 * Determine the value of the startupState configuration, which may be
 * a simple string of a function which returns a string. The value of
 * the string must be one of the Form Lifecycle state constants:
 *
 *   FormElementGUIAdaptor.FORM_BLANK
 *   FormElementGUIAdaptor.FORM_CREATE
 *   FormElementGUIAdaptor.FORM_MODIFY
 *
 * @return the value of the startupState configuration
 * @type String
 * @private
 */
FormElementGUIAdaptor.prototype._invokeStartupState = function()
{
	var state = null;

	// Retrieve mode property off start up state object
	var mode = this.startupState.mode;
	    
	if(null != mode)
	{
		// Determine nature of mode property
		switch(typeof mode)
		{
			case "string":
			{
				state = mode;

				if(!this.isValidState(state))
				{
					throw new ConfigurationException("Initial state for form " + this.getId() + " is invalid" );
				}
				break;
			}

			case "function":
			{
				state = mode.call(this);
				    
				if(!this.isValidState(state))
				{
					throw new ConfigurationException( "Initial state of form " + this.getId() + " provided by custom function is invalid" );
				}
				break;
			}

			default:
			{
				throw new ConfigurationException( "Invalid configuration for form " + this.getId() + ". Mode parameter of startUpState must be a string or a custom function" );
			}
		}
	}
	else
	{
		throw new ConfigurationException( "Invalid configuration for form " + this.getId() + ". Parameter mode of startUpState must be defined." );
	}
	
	return state;
}


/**
 * Method determines whether or not the supplied parameter is
 * a valid form state or not.
 *
 * @param s String identifying state of form
 * @return boolean Returns "true" if argument "s" is a valid state otherwise "false"
 *
*/
FormElementGUIAdaptor.prototype.isValidState = function(s)
{
	return (s == FormElementGUIAdaptor.FORM_BLANK || s == FormElementGUIAdaptor.FORM_MODIFY || s == FormElementGUIAdaptor.FORM_CREATE);
}


/**
 * Should the form be dirty on initialisation
 *
 * @return true if the form should be marked dirty on initialisation or
 *   false if it should be marked clean on initialisation.
 * @type boolean
 */
FormElementGUIAdaptor.prototype.isDirtyOnInit = function()
{
	// Form is not dirty by default
	var isDirty = false;
	
	if(null != this.m_markAsDirtyOnInitialise)
	{
		// If markAsDirty is a function invoke it and keep the result
		if(typeof this.m_markAsDirtyOnInitialise == "function")
		{
			isDirty = this.m_markAsDirtyOnInitialise();
		}
		else
		{
			isDirty = this.m_markAsDirtyOnInitialise;
		}
		
		if(typeof isDirty != "boolean")
		{
			throw new ConfigurationException("markAsDirty configuration must be of type boolean or a function that returns a boolean");
		}
	}
	
	return isDirty;
}


/**
 * FormElementGUIAdaptor has a custom update function that writes both the 
 * Form lifecycle state and the dirty state of the form to the databinding
 */
FormElementGUIAdaptor.prototype.update = function()
{
	if(FormElementGUIAdaptor.m_logger.isDebug()) FormElementGUIAdaptor.m_logger.debug("FormElementGUIAdaptor.update(): " + this.getId());

	var db = this.dataBinding;
	if(null != db)
	{
		var fc = FormController.getInstance();
		var dm = fc.getDataModel();
		
		fc.startDataTransaction(this);


		// Determine whether or not the form state has changed or not and update it in the model if necessary		
		var state = this.m_value.state;
		var stateXPath = db + FormElementGUIAdaptor.FORM_STATE_XPATH;
		var origState = dm.getValue(stateXPath);
		var stateChanged = Services.compareStringValues(state, origState);
		
		var stateUpdated = false;
		if(!stateChanged)
		{
			stateUpdated = dm.setValue(stateXPath, state);
		}
		
		
		// Determine whether or not the form dirty state has changed or not and update it in the model if necessary		
		var dirty = this.m_value.dirty.toString();
		var dirtyXPath = db + FormElementGUIAdaptor.FORM_DIRTY_XPATH;
		var origDirty = dm.getValue(dirtyXPath);
		var dirtyChanged = Services.compareStringValues(state, origState);
		
		var dirtyUpdated = false;
		if(!dirtyUpdated)
		{
			dirtyUpdated = dm.setValue(dirtyXPath, dirty);
		}


		fc.endDataTransaction(this);
		return stateUpdated || dirtyUpdated;
	}
	else
	{
		throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = " + this.getId());
	}
}


FormElementGUIAdaptor.prototype._setState = function(state)
{
	this.m_value.state = state;
}


FormElementGUIAdaptor.prototype._getState = function()
{
	return this.m_value.state;
}


FormElementGUIAdaptor.prototype._setDirty = function(dirty)
{
	this.m_value.dirty = dirty;
}


FormElementGUIAdaptor.prototype._isDirty = function()
{
	return this.m_value.dirty;
}


/**
 * Method _getValueFromView is implemented to enable the FormElementGUIAdaptor
 * to update an associated data value in the client side DOM. Although, a form
 * has no associated display value the form life cycle requires the maintenance
 * of form state. The adaptor stores this state on the client side DOM. The adaptor
 * stores the state in the field m_value. This value is returned by the method
 * _getValueFromView to enable the DataBinding protocol method update to set
 * the state value on the client side DOM.
 *
 * @return String the state of the form as stored in the instance variable m_value
 *
 */
FormElementGUIAdaptor.prototype._getValueFromView = function()
{
    return this.m_value;
}

/**
 * Method retrieve is a dummy method. In the case of the form adaptor there
 * is no display value to update.
 *
 */
FormElementGUIAdaptor.prototype.retrieve = function()
{
}

/**
 * Method initialise sets the state of the form adaptor on the client side DOM.
 *
*/

FormElementGUIAdaptor.prototype.initialise = function()
{
    // Transfer form state to client side DOM.
    this.update();
}



/**
 * Handler function called when a Field takes focus
 *
 * @private
 */
FormElementGUIAdaptor.prototype._setCurrentFocusedField = function(a)
{
	var message = null;
	if(null != a)
	{
		if(a.supportsProtocol('ValidationProtocol'))
		{
			var lastError = a.getLastError();
	
			if(null != lastError)
			{
				message = lastError.getMessage();
			}
		}
	
		if(null == message && a.supportsProtocol('HelpProtocol'))
		{
			message = a.getHelpText();
		}
	}
					
	if(null == message)
	{
		message = "OK";
	}
	
    // Get current time and compare to timeout.
    // If not expired then don't set the statusBarMessage.	
    
    var date = new Date();
    var current_time = date.valueOf();
    if (this.m_transientMessageTimeout == null 
        || current_time - this.m_transientMessageTimeout > FormElementGUIAdaptor.STATUSBAR_TIMEOUT)
    {
      this.setStatusBarMessage(message);
    }
}


/**
 * Display a message on the status bar
 *
 * @param message the message to display
 * @private
 */
FormElementGUIAdaptor.prototype.setStatusBarMessage = function(message)
{
	if(this.m_statusLine === undefined)
	{
		this.m_statusLine = document.getElementById(this.statusLine);
	}
	
	if(this.m_statusLine) this.m_statusLine.innerHTML = message;
}


/**
 * Set a message which will override all setStatusBarMessage calls
 * made by the tabbing manager for a period of time (defined by
 * STATUSBAR_TIMEOUT).
 */
FormElementGUIAdaptor.prototype.setTransientMessage = function(message)
{
  // Update the status bar.
  this.setStatusBarMessage(message);
  
  // Record the system time for use as a timeout.
  var date = new Date();
  this.m_transientMessageTimeout = date.valueOf();
}


FormElementGUIAdaptor.prototype.getModelXPath = function()
{
	return this.modelXPath;
}


FormElementGUIAdaptor.prototype.getModelParentXPath = function()
{
	// Get the form's model xpath
	var parentXPath = this.getModelXPath();
	
	// Default is /ds so we just bind the loaded document into /ds
	// If modelXPath is not /ds (say /ds/formModel), then we need
	// to strip the trailing /formModel, as the loaded document will
	// contain the formModel node as it's root node.
	// Ideally all forms would specify modelXPath, but historically
	// this hasn't been the case - all of /ds was used as the model
	// with the exception of /ds/var. Backwards compatability is the
	// reason behind this slightly weird behaviour.
	if(FormElementGUIAdaptor.DEFAULT_MODEL_XPATH != parentXPath)
	{
		parentXPath = XPathUtils.removeTrailingNode(parentXPath);
	}
	
	return parentXPath;
}


/*
 * Function to remove the entire datamodel except those nodes in
 * /ds/var defined in m_dmClearExclusionNodes
 *
 */
FormElementGUIAdaptor.prototype.clearFormDataModel = function()
{
    var i, j, il, jl, tmpXPath;
    var removeXPaths = new Array();
    var dm = FormController.getInstance().getDataModel();
    
    var rootNode = dm._getRootNode(dm.m_dom);
    
    var rootNodeName = rootNode.nodeName;
    
    // Loop through children of root node removing all except "/ds/var/app"
    // and "/ds/var/form (actually, whatever is defined in  this.m_dmClearExclusionNodes.
    
    dm._startTransaction(); 
    
    var rootNodeChildren = rootNode.childNodes;
    
    for(i = 0, il = rootNodeChildren.length; i < il; i++)
    {
        if( rootNodeChildren[i].nodeType == XML.ELEMENT_NODE)
        {
            var rootChildNodeName = rootNodeChildren[i].nodeName;
        
            if( rootChildNodeName != "var" )
            {
                tmpXPath = "/" + rootNodeName + "/" + rootChildNodeName;
                removeXPaths[removeXPaths.length] = tmpXPath;
            }
            else
            {
                // Delete all nodes under var except those defined in this.m_dmClearExclusionNodes
                var varNodeChildren = rootNodeChildren[i].childNodes;
            
                for(j = 0, jl = varNodeChildren.length; j < jl; j++)
                {
                    if(varNodeChildren[j].nodeType == XML.ELEMENT_NODE)
                    {
                        var varChildNodeName = varNodeChildren[j].nodeName;
                
                        if(!ArrayUtils.contains(this.m_dmClearExclusionNodes, varChildNodeName))
                        {
                            tmpXPath = "/" + rootNodeName + "/var/" + varChildNodeName;
                    
                            removeXPaths[removeXPaths.length] = tmpXPath;
                        }
                    }
                }
            }
        }
    }
    
    
    // Remove nodes from data model
    for(i=0, il = removeXPaths.length; i < il; i++)
    {
        dm.removeNode( removeXPaths[i] );
    }
    
    // Set form to clean
   	this._setDirty(false);
    
    dm._endTransaction();
}

/**
 * Method removes selected XPaths from data model. Note this method is
 * intended for use cleaning unwanted data from the node "/ds/var/app"
 * either when navigating to a new form or following a clear event.
 *
*/

FormElementGUIAdaptor.prototype.removeSelectedXPaths = function( xPaths )
{

    if(null != xPaths)
    {
        var length = xPaths.length;
        
        if(length > 0)
        {
            // Remove XPaths from data model
            var dm = FormController.getInstance().getDataModel();
            
            dm._startTransaction();
            
            for(var i = 0; i < length; i++)
            {
                dm.removeNode( xPaths[i] );
            }
            
            dm._endTransaction();
            
        }
        
    }
    
}

/*
 * Function to block form events
 */
FormElementGUIAdaptor.prototype._blockEventsForForm = function(evt)
{
	if (null == evt) { evt = window.event; }
	SUPSEvent.preventDefault(evt);
	return false;
}

/**
 * Method disables drag and drop functionality
 * on form.
 *
 * @param evt Instance of onDragStart event.
 *
*/
FormElementGUIAdaptor.prototype._disableDragAndDrop = function(evt)
{
    if(null == evt) { evt = window.event; }
    
    var formElement = this.getElement();
    
    if(formElement.attachEvent)
    {
        // IE browser - do not prevent default action, rather set data
        // transfer effect allowed option to none to disable data transfer       
		try
		{
	        // D1118 - The data transfer object can sometimes be empty.
	        // Accessing it when it is results in an unspecified error
        	evt.dataTransfer.effectAllowed = "none";
        }
        catch(e)
        {
        	// Error occurred, so just prevent default browser action
        	SUPSEvent.preventDefault(evt);
        }
    }
    else if(formElement.addEventListener)
    {
        // W3C or Mozilla
        SUPSEvent.preventDefault(evt);
    }
    
    return false;
}


