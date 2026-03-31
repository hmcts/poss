//==================================================================
//
// DataBindingProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support mandatoriness.
//
//==================================================================


/**
 * Exception thrown when an error occurs while using the DataBindingProtocol
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
function DataBindingError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// DataBindingError is a sub class of Error
DataBindingError.prototype = new Error();
DataBindingError.prototype.constructor = DataBindingError;

/*
 * DataBindingProtocol constructor
 *
 * @constructor
 */
function DataBindingProtocol()
{
}

DataBindingProtocol.m_logger = new Category("DataBindingProtocol");

/**
 * Current value rendered by the GUI Element
 */
DataBindingProtocol.prototype.m_value = null;


/**
 * Flag to indicate whether or not the value has changed since last refresh
 *
 * @type Boolean
 * @private
 */
DataBindingProtocol.prototype.m_valueChanged = false;


/**
 * The XPath indicating where the value for the field is bound.
 * This value may be re-interpretted if update and retrieve
 * methods are implemented.
 *
 * @configuration
 * @merge-rule Concatinate strings to form an aggregate xpath,
 *   starting with the most specific (i.e. user configuration)
 *   component and ending with the least specific (i.e.
 *   adaptor specified
 */
DataBindingProtocol.prototype.dataBinding = null;


/**
 * The list of XPaths that cause the GUI Element to have it's
 * value refreshed.
 *
 * Note: This value is intimately connected to the retrieve
 *       method, which actually gets the value out of the DOM.
 *       Because of this, it could be the responsibility of
 *       the retrieve method to register these update DataBindings.
 *
 * Note: This used to be called updateOn, however this is
 *  confusing as it is does not trigger the update method.
 *
 * @type Array[XPath];
 * @configuration
 * @merge-rule NBD - does dataBinding xpath impact on this?
 */
DataBindingProtocol.prototype.retrieveOn = null;


/**
 * Update the value in the data model. Default implementation is
 * to set the value of a single node in the underlying DOM.
 *
 * @return true if the DataModel changed as a result of the update
 * @type boolean
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
DataBindingProtocol.prototype.update = function()
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
		
		var changed = false;
		var mV = this._getValueFromView();
		var dV = this.invokeTransformToModel(mV);

		// If the original values in the dom or the adaptor or null and / or empty string
		// then treat these as equivalent for purposes of a change to the data model		
		var origValue = dm.getValue(db);
		if((mV == "" || mV == null) && (origValue == "" || origValue == null))
		{
			changed = true;
		}
		else
		{
			changed = (origValue == dV);
		}
		
		var result = null;
		if(changed == true)
		{
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


/**
 * Retrieve the value from the data model, transforms the value and
 * stores the value in the intermediate property until renderState()
 * is called to render the new value. Default 
 * implementation is to get the value of a single node
 * in the underlying DOM.
 *
 * @param event the DataModelEvent that triggered this call
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
DataBindingProtocol.prototype.retrieve = function(event)
{
	var db = this.dataBinding;
	if(null != db)
	{
		var mV = FormController.getInstance().getDataModel().getValue(db);
		var dV = this.invokeTransformToDisplay(mV);
		
		var valueChanged = this._setValue(dV);

		// If the value changed during this repaint cycle keep track of it.
		if(!this.m_valueChanged) this.m_valueChanged = valueChanged;

		//if(valueChanged)
		//{
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.VALUE_TYPE, dV, this);
			this.changeAdaptorState(e);
		//}
		return valueChanged;
	}
	else
	{
		throw new DataBindingError("DataBindingProtocol.retrieve(), no dataBinding specified for adaptor id = " + this.getId());
	}
}


/**
 * Set the default value for the field. There is
 * no default implementation for this method.
 * This configuration method is invoked when a
 * new Node is created that corresponds to one of
 * the XPaths in the setDefaultOn configuration item,
 * and the Adaptor's isNoneEmptyValue returns true.
 *
 * @param e the DataModelEvent which triggered the setDefault
 * @configuration
 */
DataBindingProtocol.prototype.setDefault = null;


/**
 * Array of XPaths which cause the Adaptor to set its default value
 *
 * @type Array[XPath];
 * @configuration
 */
DataBindingProtocol.prototype.setDefaultOn = null;


/**
 * Checks to see if the field interprets the supplied 
 * value as a none empty value in. Default implementation
 * is compatible with the default implementation of
 * retrieve, which returns a simple String.
 *
 * @param mV the model value
 */
DataBindingProtocol.prototype.isNoneEmptyValue = function(mV)
{
	return !(null == mV || "" == mV);
}


/**
 * Configuration method used to transform the displayed value
 * into the value stored in the Data Model.
 * 
 * @param val the displayed value to transform.
 * @return the value suitable for storage in the DataModel. This
 *    needs to be of the same type as the value expected by the
 *    update() method for the field.
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
DataBindingProtocol.prototype.transformToModel = null;


/**
 * Configuration method used to transform the value retrieved
 * from the Data Model into the value displayed.
 *
 * @param val the value retrieved from the DataModel to transform.
 *    The type of the argument will be the same as the value
 *    returned by the retrieve() method.
 * @return the value suitable for display on screen
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
DataBindingProtocol.prototype.tranformToDisplay = null;


/**
 * Initialisation method for DataBindingProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
DataBindingProtocol.prototype.configDataBindingProtocol = function(cs)
{
	// Use the most specific configuration available - there's
	// no chaining of these methods, so simply assign the most
	// specific configuration to this GUI Adaptors own
	// configuration variables.
	for(var i = cs.length - 1; i >= 0; i--)
	{
		var c = cs[i];
		
		if(null != c.update) this.update = c.update;
		if(null != c.retrieve) this.retrieve = c.retrieve;
		if(null != c.transformToModel) this.transformToModel = c.transformToModel;
		if(null != c.transformToDisplay) this.transformToDisplay = c.transformToDisplay;
		
		if(null != c.dataBinding) this.dataBinding = c.dataBinding;
		
		if(null != c.retrieveOn) this.retrieveOn = c.retrieveOn;
		if(null != c.setDefaultOn) this.setDefaultOn = c.setDefaultOn;
		if(null != c.setDefault) this.setDefault = c.setDefault;
	}
	if(null == this.dataBinding || "" == this.dataBinding)
	{
		throw new ConfigurationException("DataBindingProtocol.configDataBindingProtocol(), no dataBinding specified for adaptor id = " + this.getId() + ", this is a mandatory configuration property!");
	}
	if(DataBindingProtocol.m_logger.isTrace())
	{
		DataBindingProtocol.m_logger.trace("DataBindingProtocol.configDataBindingProtocol(), " + DataBindingProtocol.toString(this));
	}

}


/**
 * Perform cleanup required by the DataBindingProtocol before
 * it is destroyed
 */
DataBindingProtocol.prototype.disposeDataBindingProtocol = function()
{
}


/**
 * Return the dataBinding for this GUI Element
 */
DataBindingProtocol.prototype.getDataBinding = function()
{
	return this.dataBinding;
}

/**
 * Initialise the protocol.
 */
DataBindingProtocol.prototype.initialiseDataBindingProtocol = function(e)
{
    this.initialiseDataBindingState(e);
}


DataBindingProtocol.prototype.initialiseDataBindingState = function(e)
{
	db = this.getDataBinding();
	if(null != db)
	{
		this.invokeRetrieve(e);
		// Only invoke retrieve's if they are specifically bound to the initialisation xpath "/"
		var on = this.getSetDefaultOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
				if(on[i] == "/")
				{
					this.invokeSetDefault(e);
				}
			}
		}
	}
}

/**
 * Get additional databindings that trigger a refresh of the field
 */
DataBindingProtocol.prototype.getRetrieveOn = function()
{
	return this.retrieveOn;
}


/**
 * Get XPaths that trigger a setDefault
 */
DataBindingProtocol.prototype.getSetDefaultOn = function()
{
	return this.setDefaultOn;
}


/**
 * Invoke the update method of the GUI Element
 *
 * @param the model value to set
 * @return the name of the GUI Element.
 * @type String
 */
DataBindingProtocol.prototype.invokeUpdate = function(mV)
{	
	return this.update.call(this, mV);
}


/**
 * Invoke the retrieve method of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the value of the data binding
 * @type String
 */
DataBindingProtocol.prototype.invokeRetrieve = function(event)
{	
	return this.retrieve.call(this, event);
}


/**
 * Invoke the transformToModel method of the GUI Element
 *
 * @param dV the display value to transform
 * @return the model value
 * @type String
 */
DataBindingProtocol.prototype.invokeTransformToModel = function(dV)
{	
	return (null == this.transformToModel) ? dV : this.transformToModel.call(this, dV);
}


/**
 * Invoke the transformToDisplay method of the GUI Element
 *
 * @param dV the model value to transform
 * @return the display value
 * @type String
 */
DataBindingProtocol.prototype.invokeTransformToDisplay = function(mV)
{	
	return (null == this.transformToDisplay) ? mV : this.transformToDisplay.call(this, mV);
}


DataBindingProtocol.prototype.hasSetDefault = function()
{
	return this.hasConfiguredProperty("setDefault");
}


/**
 *
 *
 * @param e the DataModelEvent that caused setDefault to be invoked.
 */
DataBindingProtocol.prototype.invokeSetDefault = function(e)
{
	var mV = null;
	if(null != this.dataBinding)
	{
		mV = Services.getValue(this.dataBinding);
	}

	if(DataBindingProtocol.m_logger.isDebug())
	{
		DataBindingProtocol.m_logger.debug("Type: " + e.getType());
		DataBindingProtocol.m_logger.debug("X Path: " + e.getXPath());
	}

	if(
		null != this.setDefault &&                     // If we have a setDefault method
		e.getType() == DataModelEvent.ADD &&           // and the DataModelEvent is an addition..
		!this.isNoneEmptyValue(mV)  				   // and the Adaptors value is empty
	)                                                  // then call the setDefault method
	{
		this.setDefault.call(this, e);	
	}
}


/**
 * Get the value of the GUI element
 *
 * @return the value of the element.
 * @type varies depending on the type of component
 */
DataBindingProtocol.prototype._getValue = function()
{
	return this.m_value;
}


/**
 * Set the value of the GUI element onto an internal property which can
 * later be used by renderState to update the visual state.
 *
 * @param v the value of the element. The varies depending
 *   on the type of component.
 */
DataBindingProtocol.prototype._setValue = function(v)
{
	var changed = (v != this.m_value);
	this.m_value = v;
	

	return changed;
}


/**
 * Check if the GUI element has a value
 *
 * @return true if the GUI component has a value or false otherwise
 * @type boolean
 */
DataBindingProtocol.prototype.hasValue = function()
{
	return this.isNoneEmptyValue(this.m_value);
}

/**
 * Static method to implement a dummy toString method for this protocol - we can't do this on the
 * object because that would overwrite it for the adaptor, which we don't want
 */
DataBindingProtocol.toString = function(a)
{
	var msg = new String("DataBindingProtocol(adaptor id: " + a.getId() + "): ");
	if(null != a.dataBinding) msg += "dataBinding = " + a.dataBinding;
	if(null != a.retrieveOn)
	{
		msg += ", retrieveOn = [";
		for(var i=0; i<a.retrieveOn.length; i++)
		{
			msg += a.retrieveOn[i] + ", ";
		}
		msg += "]";
	}
	if(null != a.defaultOn)
	{
		msg += ", defaultOn = [";
		for(var i=0; i<a.defaultOn.length; i++)
		{
			msg += a.defaultOn[i] + ", ";
		}
		msg += "]";
	}
	/*if(null != a.update) msg += ", update = " + a.update;
	if(null != a.retrieve) msg += ", retrieve = " + a.retrieve;
	if(null != a.setDefault) msg += ", setDefault = " + a.setDefault;
	if(null != a.transformToModel) msg += ", transformToModel = " + a.transformToModel;
	if(null != a.transformToDisplay) msg += ", transformToDisplay = " + a.transformToDisplay;*/
	
	return msg;
}


/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
DataBindingProtocol.prototype.getListenersForDataBindingProtocol = function()
{
    var listenerArray = new Array();
    var refreshListener = FormControllerListener.create(this, FormController.REFRESH);
    var defaultListener = FormControllerListener.create(this, FormController.DEFAULT);
    
	db = this.getDataBinding();
	if(null != db)
	{
		// Field with databinding must have an update method
		listenerArray.push({xpath: db, listener: refreshListener});
		if(this.hasSetDefault())
		{
			listenerArray.push({xpath: db, listener: defaultListener});
			var setDefaultOn = this.getSetDefaultOn();
			if(null != setDefaultOn)
			{
				for(var i = setDefaultOn.length-1; i>=0; i--)
				{
					listenerArray.push({xpath: setDefaultOn[i], listener: defaultListener});
				}
			}
		}
	}
	var on = this.getRetrieveOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
			listenerArray.push({xpath: on[i], listener: refreshListener});
		}
	}	
    
    return listenerArray;
}
