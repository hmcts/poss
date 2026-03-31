//==================================================================
//
// DateTextInputElementGUIAdaptor.js
//
// Class for inputting and validating dates.  (essentially
// datepicker without the dropdown/overhead).
//
//==================================================================


/**
 * Define the class itself.
 *
 */
function DateTextInputElementGUIAdaptor()
{
}

 
/**
 * TextInputElementGUIAdaptor is a sub class of TextInputElementGUIAdaptor
 * NB - Look at the _configure method - it uses the one from DatePickerGUIAdaptor
 */
DateTextInputElementGUIAdaptor.prototype = new TextInputElementGUIAdaptor();


/*
 * Default validation method.
 *
 * @param event the DataModelEvent that triggered this method
 * @returns An error code if model validation fails
 */
DateTextInputElementGUIAdaptor.prototype.validate = function(event)
{
    var mV = FormController.getInstance().getDataModel().getValue(this.dataBinding);
	
    return FWDateUtil.validateXSDDate(mV, this.weekends);
}

/**
 * Create a new DateTextInputElementGUIAdaptor
 *
 * @param e the text input element to manage
 * @return the new TextInputElementGUIAdaptor
 * @type TextInputElementGUIAdaptor
 */
DateTextInputElementGUIAdaptor.create = function(e)
{
	var a = new DateTextInputElementGUIAdaptor();
	a._initTextInputElementGUIAdaptor(e); // Call parent class
	return a;
}

/*
 * Configures the DateTextInputGUIAdaptor.  Delegated direclty to
 * DatePickerGUIAdaptor.prototype._configure
 */
DateTextInputElementGUIAdaptor.prototype._configure = function(cs)
{
	// Call configure from DatePickerGUIAdaptor!
	for(var i = cs.length - 1; i >= 0; i--)
	{
		var c = cs[i];
		
		if(null != c.weekends && null == this.weekends) 
		{
			this.weekends = c.weekends;
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
	this.m_element.maxLength = DatePickerGUIAdaptor.DEFAULT_MAX_LENGTH;
	
}


/**
 * Get the value from the view, i.e. the HTML element. Default behaviour is to get the
 * value property from the HTML element, but this will need to be overridden for most adaptors
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 */
DateTextInputElementGUIAdaptor.prototype._getValueFromView = function()
{
    // Get the date string and convert it to a date object.
	var dateString = this.m_element.value;
	var d = FWDateUtil.parseDate(dateString);
	
	var ret = null;
	
	if(d != null)
	{
		ret = FWDateUtil.ConvertDateToXSDString(d);
	}
	else
	{
		// Unknown format - simply return input field string
		ret = dateString;
	}
	
	return ret;
}

/*
 * Render function which gets the date from the model value and
 * converts it to the desired output format.  Then calls
 * the parent render function
 */
DateTextInputElementGUIAdaptor.prototype.renderState = function()
{
    // Get model value
    var mV = FormController.getInstance().getDataModel().getValue(this.dataBinding);
	
    // Convert to display value.
    var dateObj = FWDateUtil.parseXSDDate(mV);
    
    // Set m_value then invoke parent function to set it like any other text field.
    if (dateObj != null) 
    {
      this.m_value = FWDateUtil.ConvertDateToString(dateObj); 
    }
    else
    {
      this.m_value = mV; 
    }
    
    TextInputElementGUIAdaptor.prototype.renderState.call(this);
}
