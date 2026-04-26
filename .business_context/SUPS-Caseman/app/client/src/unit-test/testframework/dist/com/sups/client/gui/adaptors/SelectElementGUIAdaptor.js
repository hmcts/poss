//==================================================================
//
// SelectElementGUIAdaptor.js
//
// Class for adapting a select style dropdown element for use in the
// framework. Select elements can either be configured to set their
// options from somewhere specified in the data model using xpaths, or
// can be hardcoded into the HTML. A default validate method is supplied
// that checks if the value in the datamodel binding matches a value
// in the options list.
//
//==================================================================


/**
 * Constructor for the Select GUI adaptor. SelectElementGUIAdaptor is a 
 * sub class of HTMLElementGUIAdaptor. The following protocols are implemented 
 * by the select adaptor: DataBindingProtocol, EnablementProtocol, FocusProtocol, 
 * HelpProtocol, HelpProtocolHTMLImpl, InitialiseProtocol, KeybindingProtocol, 
 * MandatoryProtocol, NameProtocol, ReadOnlyProtocol, 
 * TemporaryProtocol, ValidationProtocol.
 *
 * @constructor
 * @private
 */
function SelectElementGUIAdaptor()
{
}

SelectElementGUIAdaptor.m_logger = new Category("SelectElementGUIAdaptor");

/**
 * SelectElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor (which adds
 * no protocols).
 */
SelectElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
SelectElementGUIAdaptor.prototype.constructor = SelectElementGUIAdaptor;

SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS = "selectNotSubmissible";
SelectElementGUIAdaptor.SELECT_OPTION_SUBMISSIBLE_CSS_CLASS = "selectOptionSubmissible";
SelectElementGUIAdaptor.SELECT_OPTION_NOT_SUBMISSIBLE_CSS_CLASS = "selectOptionNotSubmissible";

/**
 * Add the required protocols to the SelectElementGUIAdaptor
 * Note: Does not use InputElement because this is not derived from a HTML input tag
 */
 
GUIAdaptor._setUpProtocols('SelectElementGUIAdaptor'); 
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'ListSrcDataProtocol');			// Supports binding of the src data to the data model
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'RecordsProtocol');				// Supports form dirty
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'MandatoryProtocol');            // Supports mandatory
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'ReadOnlyProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol
GUIAdaptor._addProtocol('SelectElementGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding

/**
 * XPath relative to srcData + rowXPath which provides a unique
 * value to display for the row.
 *
 * @type String
 * @configuration Optional.
 */
SelectElementGUIAdaptor.prototype.displayXPath = null;

/**
 * Reference to adaptor onChange event handler.
 *
*/

SelectElementGUIAdaptor.prototype.m_onChangeHandler = null;

/**
 * Create a new SelectElementGUIAdaptor
 
 * @param e the select element to manage
 * @return the new SelectElementGUIAdaptor
 * @type SelectElementGUIAdaptor
 */
SelectElementGUIAdaptor.create = function(e)
{
	var a = new SelectElementGUIAdaptor();
	a._initSelectElementGUIAdaptor(e);
	return a;
}


/**
 * Initialise the SelectElementGUIAdaptor, and adds an event handler to
 * the HTML element to callback when a 'change' event is received.
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
SelectElementGUIAdaptor.prototype._initSelectElementGUIAdaptor = function(e)
{
	if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(e.id + ":SelectElementGUIAdaptor._initSelectElementGUIAdaptor");
	this.m_element = e;
}


/**
 * Callback function to handle a selection change and update the data model
 */
SelectElementGUIAdaptor.prototype._handleChange = function()
{
	if(SelectElementGUIAdaptor.m_logger.isDebug()) SelectElementGUIAdaptor.m_logger.debug(this.getId() + ":SelectElementGUIAdaptor");	
	this.update();
}

/**
 * Get XPath that defines a the value to display in the dropdown
 */
SelectElementGUIAdaptor.prototype.getDisplayXPath = function()
{
	return XPathUtils.concatXPaths(this._getRowXPath(), this.displayXPath);
	return this.keyXPath;
}


SelectElementGUIAdaptor.LOSE_FOCUS_MODE = "loseFocusMode";
SelectElementGUIAdaptor.ON_CHANGE_MODE = "onChangeMode";

/**
 * Configure the GUIAdaptor. It is possible to have a select with a set of options hardcoded 
 * into the HTML in which case the only JS configuration required would be dataBinding from
 * the DataBindingProtocol.
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 * @throws ConfigurationException when modelValue missing properties or validation function defined
 */
SelectElementGUIAdaptor.prototype._configure = function(cs)
{
	if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor._configure");

	// Run through configuration specific to this element (no point checking the last)
	for(var i = 0; i < cs.length; i++)
	{
		if(null != cs[i].displayXPath) this.displayXPath = cs[i].displayXPath;
		if(null != cs[i].validate) this.validate = cs[i].validate;
		if(null != cs[i].nullDisplayValue) this.nullDisplayValue = cs[i].nullDisplayValue;
		if(null != cs[i].updateMode) 
		{
			this.updateMode = cs[i].updateMode;
			if(this.updateMode != SelectElementGUIAdaptor.LOSE_FOCUS_MODE && this.updateMode != SelectElementGUIAdaptor.ON_CHANGE_MODE)
			{
				if(SelectElementGUIAdaptor.m_logger.isError()) SelectElementGUIAdaptor.m_logger.error("SelectElementGUIAdaptor._configure() unknown updateMode in configuration for adaptor id=" + this.getId() + ", reverting to default of SelectElementGUIAdaptor.ON_CHANGE_MODE");
				this.updateMode = SelectElementGUIAdaptor.ON_CHANGE_MODE;
			}
		}
		else
		{
			this.updateMode = SelectElementGUIAdaptor.ON_CHANGE_MODE;
		}
	}
	if(null == this.nullDisplayValue)
	{
		this.nullDisplayValue = "";
	}
	if(null == this.displayXPath)
	{
		this.displayXPath = this.keyXPath;
	}
	this.displayXPath = XPathUtils.removeLeadingSlash(this.displayXPath);

	this.m_hardcodedOptions = !(this.srcData && ("" != this.srcData));

	var a = this;
	if(this.updateMode == SelectElementGUIAdaptor.ON_CHANGE_MODE)
	{
		this.m_onChangeHandler = SUPSEvent.addEventHandler(this.m_element, "change", function(evt) { return a._handleChange(); });
	}
	else
	{
		this.m_onChangeHandler = SUPSEvent.addEventHandler(this.m_element, "blur", function(evt) { return a._handleChange(); });
	}
}

/**
 * Get the value from the view, i.e. the HTML element. Default behaviour is to get the
 * value property from the HTML element, but this will need to be overridden for most adaptors
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 * @type string
 */
SelectElementGUIAdaptor.prototype._getValueFromView = function()
{
	if(SelectElementGUIAdaptor.m_logger.isTrace())SelectElementGUIAdaptor.m_logger.trace(this.getId() + ":SelectElementGUIAdaptor._getValueFromView()");
	var value = null;
	if(null == this.m_element)
	{
		throw new GUIAdaptorError("SelectElementGUIAdaptor._getValueFromView(), this.m_element == null");
	}
	for(var i=0; i<this.m_element.options.length; i++)
	{
		var option = this.m_element.options[i];
		if(option.selected)
		{
			value = option.value;
			if(SelectElementGUIAdaptor.m_logger.isTrace())SelectElementGUIAdaptor.m_logger.trace(this.getId() + ":SelectElementGUIAdaptor._getValueFromView(), value = " + value);
			break;
		}
	}

	return value;
}

/**
 * Method invoked to refresh the options data when the dataSrc changes, as set in srcDataOn attribute
 *
 * @ToDo use the event param to restrict the amount of updates by checking against the xpath that caused this event.
 * @param event the DataModelEvent that triggered this call
 * @throws ConfigurationException when the sizeof keys and values don't match
 */
SelectElementGUIAdaptor.prototype.retrieveSrcData = function(event)
{
	if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.retrieveSrcData()");

	// Trigger a StateChangeEvent if the srcData has changed
	// ToDo: this should take into account deltas
	var e = StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE, null, this);
	this.changeAdaptorState(e);
	
	var changed = false;
	if(!this.m_hardcodedOptions)
	{
		changed = true;
		// remove old options
		var options = this.m_element.options;
		var length = options.length;
	
		for(var p=0; p<length; p++)
		{
			options[p] = null;
		}
		options.length = 0;
		// add a default empty value
		options[0] = new Option(this.nullDisplayValue, "");
		
		var rows = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this._getRowXPath());
		for(var i=0; i<rows.length; i++)
		{
			var n = rows[i];
			var key = ListSrcDataProtocol.selectValueFromNodeByXPath(n, this.keyXPath);
			var displaySrc = ListSrcDataProtocol.selectValueFromNodeByXPath(n, this.displayXPath);

			// Allow the display values of the select box to be transformed - note
			// we are transforming source data here.
			display = this.invokeTransformToDisplay(displaySrc);

			// generate options
			options[i+1] = new Option(display, key);
			if(options[i+1].value == this.m_value)
			{
				options[i+1].selected = true;
			}
		}
	}
	return changed;
}

SelectElementGUIAdaptor.prototype.areOptionsHardcoded = function()
{
	return this.m_hardcodedOptions;
}

/*
 * Method called to render the changed state of the select element. The rendering is managed by applying 
 * stylesheet classes and setting the disabled property of the HTML element.
 *
 */
SelectElementGUIAdaptor.prototype.renderState = function()
{
	if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.renderState() this.m_value=" + this.m_value + ", this.m_enabled=" + this.m_enabled + ", this.m_readOnly=" + this.m_readOnly + ", this.getValid()=" + this.getValid() + ", this.m_mandatory=" + this.m_mandatory);

	var disabled = false;
	var readOnly = false;
	var className = null;
	
	var length = this.m_element.options.length;
	
	var aggregateState = this.getAggregateState();
	
	var foundValue = false;
	for(var p=0; p<length; p++)
	{
		var option = this.m_element.options[p];
		var optionValue = option.value;
		if(optionValue == this.m_value)
		{
			if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.renderState() setting selected=true at options[" + p + "]");
			foundValue = true;
			option.selected = true;
		}
		else
		{
			option.selected = false;
		}
		if(!aggregateState.isKeySubmissible(optionValue))
		{
			option.className = SelectElementGUIAdaptor.SELECT_OPTION_NOT_SUBMISSIBLE_CSS_CLASS;
		}
		else
		{
			option.className = "";
		}
	}
	
	if(!foundValue && this.m_value == null && length>0)
	{
	    // D207. Select element has no selected value. This can occur
	    // at initialisation or when the select adaptor is bound
	    // to a data binding with no value.
	    
	    if(!this.m_hardcodedOptions)
	    {
	        // Use "nothing selected" default
	        this.m_element.options[0].selected = true;
	    }
	    // Note - Hardcoded select boxes will default to option 1
	}
		
	// Don't attempt to validate if there are no options in the select element
	if(this.m_value && (this.m_value!="") && length>0 && (this.m_element.options[0].value!="" || length>1) )
	{
		if(!foundValue)
		{
			if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.renderState() could not match this.m_value to a valid option, setting the class to invalid")
			this.setValid(false);
			// If the value does not exist in the options list then set to the first 
			// option if this contains an empty string, otherwise do nothing
			if(length>0 && this.m_element.options[0].value=="")
			{
				this.m_element.options[0].selected = true;
			}
		}
		else
		{
			if(!this.validate)
			{
				// Only set the internal valid state to true if we don't have a user configured
				// validate method
				if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.renderState() matched this.m_value to a valid option, setting the class to valid")
				this.setValid(true);
			}
		}
	}
		
	if(!aggregateState.isSubmissible())
	{
		className = SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS;
	}

	// render the select states
	if((this.supportsProtocol("EnablementProtocol") && !this.getEnabled())
	    || (this.supportsProtocol("ActiveProtocol") && !this.isActive()))
	{
		className = "disabled";
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
						className = SelectElementGUIAdaptor.SELECT_NOT_SUBMISSIBLE_CSS_CLASS;
					}
					else
					{
						className = "invalid";
					}
				}
				else
				{
					className = "invalid";
				}
			}
		}
		else
		{
			if(this.m_mandatory)
			{
				className = "mandatory";
			}
		}
		
		if(this.m_readOnly)
		{
			className = "readOnly";
			// The readOnly attribute is only a member of the input box, I have therefore applied a class
			// and set it to be disabled to prevent the user from changing it's value
			//readOnly = true;
			disabled = true;
		}
	}
	
	this.m_element.disabled = disabled;
	this.m_element.className = className;
	this.m_element.readOnly = readOnly;

	if(SelectElementGUIAdaptor.m_logger.isInfo()) SelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.renderState() element className =" + className);
}

/**
 * Remove onChange event handler assigned on initialisation
 *
*/

SelectElementGUIAdaptor.prototype._dispose = function()
{

    if(this.m_onChangeHandler != null)
    {
        SUPSEvent.removeEventHandlerKey(this.m_onChangeHandler);
    }
}


