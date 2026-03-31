//==================================================================
//
// CheckboxInputElementGUIAdaptor.js
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
function CheckboxInputElementGUIAdaptor()
{
}

CheckboxInputElementGUIAdaptor.m_logger = new Category("CheckboxInputElementGUIAdaptor");
CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS = 'invalid';
CheckboxInputElementGUIAdaptor.READONLY_CSS_CLASS = 'readOnly';

/**
 * CheckboxInputElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
CheckboxInputElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Add the required protocols to the CheckboxInputElementGUIAdaptor
 * Note: Does not use FieldElement etc. as did not want to inherit mandatory protocol
 */
GUIAdaptor._setUpProtocols('CheckboxInputElementGUIAdaptor'); 
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol
GUIAdaptor._addProtocol('CheckboxInputElementGUIAdaptor', 'ReadOnlyProtocol');            // Supports readonly protocol

CheckboxInputElementGUIAdaptor.prototype.constructor = CheckboxInputElementGUIAdaptor;

CheckboxInputElementGUIAdaptor.prototype.modelValue = {checked: "true", unchecked: "false"};

/**
 * Create a new CheckboxInputElementGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new CheckboxInputElementGUIAdaptor
 * @type CheckboxInputElementGUIAdaptor
 */
CheckboxInputElementGUIAdaptor.create = function(e)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor.create");

	var a = new CheckboxInputElementGUIAdaptor();
	a._initCheckboxInputElementGUIAdaptor(e);
	return a;
}


CheckboxInputElementGUIAdaptor.prototype.keyBindings = 
[
	{	key: Key.CHAR_Y,
		action: function()
		{
			if(!this.getReadOnly())
			{
				Services.setValue(this.dataBinding, this.modelValue.checked );
			}
		}
	},
	{	key: Key.CHAR_N,
		action: function()
		{
			if(!this.getReadOnly())
			{
				Services.setValue(this.dataBinding, this.modelValue.unchecked);
			}
		}
	},
	{	key: Key.CHAR_y,
		action: function()
		{
			if(!this.getReadOnly())
			{
				Services.setValue(this.dataBinding, this.modelValue.checked);
			}
		}
	},
	{	key: Key.CHAR_n,
		action: function()
		{
			if(!this.getReadOnly())
			{
				Services.setValue(this.dataBinding, this.modelValue.unchecked);
			}
		}
	}
];

/**
 * Initialise CheckboxInputElementGUIAdaptor
 *
 * @param e the checkbox input element to manage
 */
CheckboxInputElementGUIAdaptor.prototype._initCheckboxInputElementGUIAdaptor = function(e)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._initCheckboxInputElementGUIAdaptor");
	
	this.m_element = e;
	this._registerEventHandlers();
}

CheckboxInputElementGUIAdaptor.prototype._registerEventHandlers = function()
{
	var a = this;
	this.m_evtHandler = SUPSEvent.addEventHandler(this.m_element, "click", function(evt) { return a._handleClick(evt); });
}



CheckboxInputElementGUIAdaptor.prototype._dispose = function()
{
	SUPSEvent.removeEventHandlerKey(this.m_evtHandler);
	this.m_evtHandler = null;
}


/**
 * Get the value from the view, i.e. the HTML element. Default behaviour is to get the
 * value property from the HTML element, but this will need to be overridden for most adaptors
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 * @type string
 */
CheckboxInputElementGUIAdaptor.prototype._getValueFromView = function()
{
	if(CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace(this.getId() + ":CheckboxInputElementGUIAdaptor._getValueFromView()");
	if(null == this.m_element)
	{
		throw new GUIAdaptorError("CheckboxInputElementGUIAdaptor._getValueFromView(), this.m_element == null");
	}
	return this.m_element.checked;
}

/*
 * Called when mouse click on checkbox to set value
 */
CheckboxInputElementGUIAdaptor.prototype._handleClick = function(evt)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._handleClick");
	var propagateEvent = true;
	
	if(this.getReadOnly())
	{
		// Checkbox is read only, so prevent default checkbox action
	
		// If IE the use the global event
	    evt = (null != evt) ? evt : window.event;
	    
		SUPSEvent.preventDefault(evt);
		propagateEvent = false;
	}
	else
	{
		this.update();
	}
	
	return propagateEvent;
}

/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 * @throws ConfigurationException when modelValue missing properties or validation function defined
 */
CheckboxInputElementGUIAdaptor.prototype._configure = function(cs)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor.init");
	
	// Run through configuration specific to this element (no point checking the last)
	for(var i = 0, l = cs.length - 1; i < l; i++)
	{
		/*
		 * Process the modelValue object which determines how the 
		 */
		if(null != cs[i].modelValue)
		{
			// Set the modelValue property
			this.modelValue = cs[i].modelValue;
		
			// Ensure that checked and unchecked are specified
			// fc_assert(null != this.modelValue.checked && null != this.modelValue.unchecked);
			if(null == this.modelValue.checked || null == this.modelValue.unchecked)
			{
				throw new ConfigurationException("Must define checked and unchecked for modelValue");
			}
		}
		if(null != cs[i].transformToModel)
		{
			// if we find another transformToModel function throw an assert cos we don't support it
			throw new ConfigurationException("Cannot define transformToModel function for checkbox");
		}
		if(null != cs[i].transformToDisplay)
		{
			// if we find another transformToDisplay function throw an assert cos we don't support it
			throw new ConfigurationException("Cannot define transformToDisplay function for checkbox");
		}				
	}
}



/*
 * Always returns true as checkbox always has a validate function
 * @returns true
 */
CheckboxInputElementGUIAdaptor.prototype.hasValidate = function()
{
	return true;
}


/*
 * Validates that model matches configured checkbox options
 * @param val Value stored in datamodel
 * @returns An error code if model validation fails
 */
CheckboxInputElementGUIAdaptor.prototype.validate = function()
{
	var val = FormController.getInstance().getDataModel().getValue(this.dataBinding);
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._validateModelValue");
	
	// Checking that the model value matches the modelValue as configured
	var ec = null;
	
	if(val != this.modelValue.checked && val != this.modelValue.unchecked)
	{
		/*
		 * The model and the configured allowable values do not match, this
		 * indicates an issue with the configuration code or the server side services
		 * rather than a data input error
		 * Note: Method of throwing error not ideal but will be refactored when ErrorCode allows
		 */
		ec = ErrorCode.getErrorCode('FW_CHECKBOX_InvalidFieldLength');
	}
	return ec;
}

CheckboxInputElementGUIAdaptor.prototype.isNoneEmptyValue = function(mV)
{
     //return !(null == mV || "" == mV); // Can't use this a (""==false) is true
     return !(null == mV);
}

/*
 * transforms the true or false value of the checkbox into the model value
 * specified by the modelValue object
 */
CheckboxInputElementGUIAdaptor.prototype.transformToModel = function(dV)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._transformToModel");

	if(dV == true)
	{
		return this.modelValue.checked;
	}
	else
	{
		return this.modelValue.unchecked;
	}	
}

/*
 * transforms the value held in the model to true or false as specified by 
 * the modelValue object for use in checkbox HTML element
 */
CheckboxInputElementGUIAdaptor.prototype.transformToDisplay = function(mV)
{
	if (CheckboxInputElementGUIAdaptor.m_logger.isTrace()) CheckboxInputElementGUIAdaptor.m_logger.trace("CheckboxInputElementGUIAdaptor._transformToDisplay");
    
    if (mV == null)
    {
        return; // return a null if null held in datamodel so both
                // m_value and model value are in sync
    }

	if(mV == this.modelValue.checked)
	{
		return true;
	}
	else
	{
		return false;
	}	
}


CheckboxInputElementGUIAdaptor.prototype.renderState = function()
{
	var disabled = false;
	var className = null;

	if(this.m_valueChanged)
	{
		this.m_element.checked = this.m_value;
		
		// Reset valueChanged flag so we don't refresh unnecessarily
		this.m_valueChanged = false;
	}
	
	if((this.supportsProtocol("EnablementProtocol") && !this.m_enabled)
	    || (this.supportsProtocol("ActiveProtocol") && !this.isActive()))
	{
		disabled = true;
	}
	else
	{
		if(this.hasValue())
		{
			if(!this.getValid())
			{
				if(!this.getServerValid())
				{
					// If server validation in process colour text area orange. If
					// server invalid and process complete colour text area red.
					if(this.isServerValidationActive())
					{
						className += " notSubmissible";
					}
					else
					{
						className += " " + CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS;
					}
				}
				else
				{
					className += " " + CheckboxInputElementGUIAdaptor.INVALID_CSS_CLASS;
				}
			}
		}
		
		if(this.m_readOnly)
		{
			className += " " + CheckboxInputElementGUIAdaptor.READONLY_CSS_CLASS;
			/*
			 * D1015 - Logic on for another adaptor made a checkbox read only.
			 * Checkbox was clicked straight after the other adaptor generating
			 * a tabbing event. By the time the Tabbing Manager had processed
			 * this event the checkbox had changed state to disabled. Causing
			 * the Tabbing Manager and browser to get themselves tied in a knot.
			 * When checkbox is read only prevent the default action in the
			 * _handleClick method.
			disabled = true;
			*/
		}
	}
	
	this.m_element.disabled = disabled;
	this.m_element.className = className;
}
