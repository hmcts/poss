//==================================================================
//
// AddressGUIAdaptor.js
//
// Class for adapting a text style input element for use in the
// framework
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 */
function DatePickerGUIAdaptor()
{
}

DatePickerGUIAdaptor.m_logger = new Category("DatePickerGUIAdaptor");

/**
 * Default maximum number of characters for the input box
 */
DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH = 11;

/**
 * DatePickerGUIAdaptor is a sub class of InputElementGUIAdaptor
 */
DatePickerGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
DatePickerGUIAdaptor.prototype.constructor = DatePickerGUIAdaptor;

/**
 * Add the required protocols to the CheckboxInputElementGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
 
GUIAdaptor._setUpProtocols('DatePickerGUIAdaptor'); 
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'MandatoryProtocol');            // Supports mandatory
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'ReadOnlyProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('DatePickerGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol


/**
 * Clean up after the component
 */
DatePickerGUIAdaptor.prototype._dispose = function()
{
	if(DatePickerGUIAdaptor.m_logger.isTrace()) DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor.dispose()");

	// Dispose of the renderer
	this.m_renderer.dispose();

	this.m_renderer = null;
}

/**
 * Create a new DatePickerGUIAdaptor
 *
 * @param e the text input element to manage
 * @param f the gui adaptor factory
 * @return the new DatePickerGUIAdaptor
 * @type DatePickerGUIAdaptor
 */
DatePickerGUIAdaptor.create = function(e, factory)
{
	if(DatePickerGUIAdaptor.m_logger.isTrace()) DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor.create()");
	var a = new DatePickerGUIAdaptor();
	a._initDatePickerGUIAdaptor(e);
	return a;
}


/**
 * Initialise the DatePickerGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
DatePickerGUIAdaptor.prototype._initDatePickerGUIAdaptor = function(e)
{
	if(DatePickerGUIAdaptor.m_logger.isTrace()) DatePickerGUIAdaptor.m_logger.trace("DatePickerGUIAdaptor._initDatePickerGUIAdaptor()");
	this.m_element = e;
	
	// Get a handle to the renderer instance
	this.m_renderer = e.__renderer;

	// Break circular reference in HTML
	this.m_element.__renderer = null;
	
	this.m_renderer.m_guiAdaptor = this;
	this.m_renderer.m_dropDownField.m_guiAdaptor = this;
}


/**
 * Handle a change in the value of the date picker
 *
 * @private
 */ 
DatePickerGUIAdaptor.prototype._handleValueChange = function()
{
	// Invoke DateBindingProtocol.update
	this.update();
}

DatePickerGUIAdaptor.prototype.getUpdateMode = function()
{
	return this.updateMode;
}

/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 */
DatePickerGUIAdaptor.prototype._configure = function(cs)
{
	if(DatePickerGUIAdaptor.m_logger.isInfo()) DatePickerGUIAdaptor.m_logger.info("DatePickerGUIAdaptor._configure()");

	for(var i = cs.length - 1; i >= 0; i--)
	{
		var c = cs[i];
		
		if(null != c.weekends && null == this.weekends) 
		{
			this.weekends = c.weekends;
		}

		if(null != c.updateMode) 
		{
			this.updateMode = c.updateMode;
			if(this.updateMode != DatePickerRenderer.LOSE_FOCUS_MODE && this.updateMode != DatePickerRenderer.CLICK_CELL_MODE)
			{
				if(DatePickerGUIAdaptor.m_logger.isError()) DatePickerGUIAdaptor.m_logger.error("DatePickerGUIAdaptor._configure() unknown updateMode in configuration for adaptor id=" + this.getId() + ", reverting to default of DatePickerRenderer.LOSE_FOCUS_MODE");
				this.updateMode = DatePickerRenderer.LOSE_FOCUS_MODE;
			}
		}
		else
		{
			this.updateMode = DatePickerRenderer.LOSE_FOCUS_MODE;
		}
	}
	
	if(this.weekends == null)
	{
		this.weekends = "true";
	}
	
	// previously all transformations for dates where to / from XSD format. Therefore we are discarding
	// any existing transformations because they will throw exceptions because they are expecting SUPS
	// format for internal values but we now use XSD format.
	this.transformToModel = null;
	this.transformToDisplay = null;

	// Configure the input box
	this._getInputField().maxLength = DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH;
}

/**
 * Get the value from the view, i.e. the HTML element. Default behaviour is to get the
 * value property from the HTML element, but this will need to be overridden for most adaptors
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 * @type ???
 */
DatePickerGUIAdaptor.prototype._getValueFromView = function()
{
	var d = this.m_renderer.getSelectedDate();
	
	var ret = null;
	
	if(d != null)
	{
		ret = FWDateUtil.ConvertDateToXSDString(d);
    }
	else
	{
		// Unknown format - simply return input field string
		ret = this.m_renderer.getValue();
		if(ret == "") ret = null;
	}
	
	return ret;
}


/*
 * Default validation method.
 *
 * @param event the DataModelEvent that triggered this method
 * @returns An error code if model validation fails
 */
DatePickerGUIAdaptor.prototype.validate = function(event)
{
	var mV = FormController.getInstance().getDataModel().getValue(this.dataBinding);
	var val = this.invokeTransformToDisplay(mV);

	if(DatePickerGUIAdaptor.m_logger.isInfo()) DatePickerGUIAdaptor.m_logger.info(this.m_element.id + ":DatePickerGUIAdaptor.validate() data model value = " + mV + ", transformed to display value = " + val);
    
    
    return FWDateUtil.validateXSDDate(val, this.weekends)

}


DatePickerGUIAdaptor.prototype.onBlur = function()
{
	this.update();
}

/**
 * Update the value in the data model. Default implementation is
 * to set the value of a single node in the underlying DOM.
 *
 * @return true if the DataModel changed as a result of the update
 * @type boolean
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
DatePickerGUIAdaptor.prototype.update = function()
{
	var db = this.dataBinding;
	if(null != db)
	{
		var fm = FormController.getInstance();
		var dm = fm.getDataModel();
		
		// this is not the correct place to set this, it should be inside a handleChange() method
		// on the adaptor because we need to handle the case where we start typing in a field, then
		// click on a button, BUT in this case the browser ensures we get the button click event before
		// we get the loseFocus() event from the text field. We may want to re-order events then at some 
		// point, and storing this information will help us.
		fm.startDataTransaction(this);
		
		var mV = this._getValueFromView();
		var dV = this.invokeTransformToModel(mV);
		
		var origValue = dm.getValue(db);
		var result = null;
		if(origValue == dV)
		{
			// This is to force the datePicker to re-render it's state even if the only change a user
			// makes is to enter the same date into a different format (WHY???)
			this.m_valueChanged = true;
			this.renderState();
			result = false;
		}
		else
		{
			result = dm.setValue(db, dV);
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.VALUE_TYPE, dV, this);
			this.changeAdaptorState(e);
		}
		fm.endDataTransaction(this);
		return result;
	}
	else
	{
		throw new DataBindingError("DataBindingProtocol.update(), no dataBinding specified for adaptor id = " + this.getId());
	}	
}


DatePickerGUIAdaptor.prototype.renderState = function()
{
	if(DatePickerGUIAdaptor.m_logger.isDebug())
	{
		DatePickerGUIAdaptor.m_logger.debug(this.getId() + ":DatePickerGUIAdaptor.renderState() this.m_enabled=" + this.m_enabled + ", this.m_readOnly=" + this.m_readOnly + ", this.getValid()=" + this.getValid() + ", this.m_mandatory=" + this.m_mandatory);
	}

	// Actions to take if fields focus state changes.
	if(this.m_focusChanged)
	{
		// Reset this immediately so that we don't end up recursing through this again
		this.m_focusChanged = false;

		if(this.m_focus)
		{
			// Highlight text on focus
			this.m_renderer.m_dropDownField._getInputFieldElement().select();
		}
		else
		{
			// Hide the drop down when the focus is lost
			this.m_renderer.m_dropDownField.hideDropDown();
		}
	}
	else
	{
	    if(this.m_valueChanged)
	    {
			// D927 - Only update the status bar message when this date picker has the focus
	        if(this.getUpdateMode() == DatePickerRenderer.CLICK_CELL_MODE && this.m_focus)
	        {
	            // Defect 758. Data value has changed. Update status bar message as appropriate
	            FormController.getInstance().getFormAdaptor()._setCurrentFocusedField(this);
	        }
	    }
	}

	// Set up value
	if(this.m_valueChanged)
	{
		this.m_renderer.setValue(this.m_value);
		this.m_valueChanged = false;
	}

	// Set up all states other than value
	this.m_renderer.render(
		!this.m_enabled,
		this.m_focus,
		this.m_mandatory,
		!this.getValid(),
		!this.getServerValid(),
		this.m_readOnly,
		!this.isActive(),
		this.isServerValidationActive()
	);
}

/**
 * Get the element to set focus on. For the DatePicker this
 * is the input text field
 */
DatePickerGUIAdaptor.prototype.getFocusElement = function()
{
	return this._getInputField();
}

/**
 * Get the component's input field.
 *
 * @return the component's input field
 * @type HTMLInputElement
 * @private
 */
DatePickerGUIAdaptor.prototype._getInputField = function()
{
	return this.m_renderer.m_dropDownField._getInputFieldElement();
}
