//==================================================================
//
// ValidationProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support validation.
//
//==================================================================


/*
 * ValidationProtocol constructor
 *
 * @constructor
 */
function ValidationProtocol()
{
}

ValidationProtocol.prototype = new StateChangeEventProtocol();
ValidationProtocol.prototype.constructor = ValidationProtocol;


/**
 * Current validity state of the adaptor - defaults to valid
 */
ValidationProtocol.prototype.m_valid = true;

/**
 * Current validity state of the adaptor for any server-side validations - defaults to valid
 */
ValidationProtocol.prototype.m_serverValid = true;

ValidationProtocol.prototype.m_pendingServerValidation = false;

/**
 * Flag indicating whether or not server validation is
 * currently active.
 *
*/
ValidationProtocol.prototype.m_serverValidationActive = false;

/*
 * Property to keep track of whether or not valid state has
 * changed since last refresh
 */
ValidationProtocol.prototype.m_validChanged = false;




/**
 * Last validation error reported from a validation attempt
 */
ValidationProtocol.prototype.m_lastError = null;


/**
 * Array of XPaths which determine when the validation state of 
 * the GUI Adaptor is re-evaluated.
 *
 * @configuration
 */
ValidationProtocol.prototype.validateOn = null;


/**
 * Validation method for the element.
 *
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed.
 * @type ErrorCode
 * @configuration
 */ 
ValidationProtocol.prototype.validate = null;


/**
 * Array of XPaths which determine when the server validation state of 
 * the GUI Adaptor is re-evaluated.
 *
 * @configuration
 */
ValidationProtocol.prototype.serverValidateOn = null;


/**
 * Server validation configuration for the element.
 *
 * @configuration
 */ 
ValidationProtocol.prototype.serverValidate = null;


/**
 * Initialisation method for ValidationProtocol
 *
 *structure of serverValidate configuration:
 *	
 *	myField.serverValidate = {
 *		serviceParams: [{
 *			name: "caseid",
 *			value: "/ds/var/app/caseid",
 *			type: "simple" | "node";	
 *		}]
 *
 *		or simply:
 * 
 *		serviceName: "validateMyFieldOnServer",
 *		serviceParams: [];
 *	};
 *	
 *	Rules: 	there can be no service params,
 *			if no type is supplied then we assume simple,
 *			serviceParams must have at least a name and value,
 *			serviceName is mandatory
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ValidationProtocol.prototype.configValidationProtocol = function(cs)
{
	// Need to determine how to merge validateOn xpaths. At
	// the moment just use the first array found.
	var cs = this.getConfigs();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		if(null != cs[i].validateOn)
		{
			this.validateOn = cs[i].validateOn;
		}
		if(null != cs[i].serverValidateOn)
		{
			this.serverValidateOn = cs[i].serverValidateOn;
		}
		if(null != cs[i].serverValidate)
		{
			this.serverValidate = cs[i].serverValidate;
		}
	}
/*
	var serverValidate = this.serverValidate;
	if(serverValidate != null)
	{
		if(serverValidate.serviceName == null)
		{
			throw new ConfigurationException( "Service parameter 'serviceName' not defined for server-side validation for adaptor id = " + this.getId());
		}
		for(var i=0; i<serverValidate.serviceParams.length; i++)
		{
			var serviceParam = serverValidate.serviceParams[i];
			if(serviceParam.name == null)
			{
				throw new ConfigurationException( "Service parameter 'serviceName.name' not defined for server-side validation for adaptor id = " + this.getId());				
			}
			if(serviceParam.value == null)
			{
				throw new ConfigurationException( "Service parameter 'serviceName.value' not defined for server-side validation for adaptor id = " + this.getId());				
			}
			if(serviceParam.type == null)
			{
				serviceParam.type = "simple";
			}
		}
	}
*/
}

/*
 * Sets up the protocol. 
 */
ValidationProtocol.prototype.initialiseValidationProtocol = function(e)
{
	this.setValid(this.invokeValidate(e) == null);	
}

/**
 * Perform cleanup required by the ValidationProtocol before
 * it is destroyed
 */
ValidationProtocol.prototype.disposeValidationProtocol = function()
{
}

/**
 * Get additional databindings that trigger a refresh of the
 * field's mandatory state.
 */
ValidationProtocol.prototype.getServerValidateOn = function()
{
	return this.serverValidateOn;
}

/**
 * Get additional databindings that trigger a refresh of the
 * field's mandatory state.
 */
ValidationProtocol.prototype.getValidateOn = function()
{
	return this.validateOn;
}


ValidationProtocol.prototype.hasValidate = function()
{
	return this.hasConfiguredProperty("validate");
}

ValidationProtocol.prototype.hasServerValidate = function()
{
	return this.hasConfiguredProperty("serverValidate");
}

/**
 * Invoke the validate method(s) of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
ValidationProtocol.prototype.invokeValidate = function(event)
{
	var ec = null;
	
	// If there is no value then don't invoke validate.
	if(this.supportsProtocol("DataBindingProtocol") && this.hasValue())
	{
		// Invoke all configurations with least specific first.
		// If any validate returns an ErrorCode then the
		// adapter is invalid.
		var cs = this.getConfigs();
	
		for(var i = cs.length - 1; i >= 0 && null == ec ; i--)
		{
			if(null != cs[i].validate)
			{
				ec = cs[i].validate.call(this, event);
			}
		}	
	}
	
	return ec;
}

/**
 * Invoke the server-side validate method of the GUI Element. This invokes a service and waits for the 
 * asynch response. The server-side validation flag is immediately set to false so the field appears
 * invalid until the response comes back. Server-side validation is only invoked if the field in currently
 * valid (is this correct? what if we are invalid and then something changes to make this valid, but the server
 * side validation doesn't trigger off that part of the dom, we will have missed a server validation call????
 * This would make sense if validateOn and serverValidateOn where the same).
 *
 * @param event the DataModelEvent that triggered this call
 * @return the name of the GUI Element.
 * @type String
 */
ValidationProtocol.prototype.invokeServerValidate = function(event)
{
	var repaintAdaptor = false;
	// If there is no value then don't invoke validate.
	if (this.configDataBindingProtocol != null && this.hasValue())
	{
		if(this.m_valid == true)
		{
			this.m_serverValid = false;
			this.m_serverValidationActive = true;
			this.invokeService();
			this.triggerStateChangeEvent();
			repaintAdaptor = true;
		}
		else
		{
			this.m_pendingServerValidation = true;
		}
	}
	return repaintAdaptor;
}


ValidationProtocol.prototype.triggerStateChangeEvent = function()
{
	// Trigger a StateChangeEvent if the value has changed
	var e = StateChangeEvent.create(StateChangeEvent.VALID_TYPE, this.getValid(), this);
	this.changeAdaptorState(e);
}


ValidationProtocol.prototype.invokeService = function()
{
	var dm = FormController.getInstance().getDataModel();
	this.m_pendingServerValidation = false;

	var dL = ValidationProtocolServerValidationDataLoader.create(this.serverValidate, this);
	dL.load();
}


ValidationProtocol.prototype.handleServerValidationSuccess = function(dom)
{
	var errorCodeId = XML.selectNodeGetTextContent(dom, "//ErrorCode");
	if(errorCodeId == "" || errorCodeId == null)
	{
		//alert("Server validation for adaptor " + this.getDisplayName() + " succeeded");
		this.m_serverValid = true;
		this.setLastError(null);
	}
	else
	{
		var errorCode = null;
		var paramNodes = dom.selectNodes("//ErrorCode/Parameters/Parameter");
		if(paramNodes == null || paramNodes.length == 0)
		{
			errorCode = ErrorCode.getErrorCode(errorCodeId);
		}
		else
		{
			var params = new Array();
			params[0] =  "ErrorCode.getErrorCode(\"";
			params[1] =  errorCodeId;
			params[2] =  "\"";
			for(var i=0, l=paramNodes.length; i<l; i++)
			{
				params[params.length] = ", \"";
				params[params.length] = XML.getNodeTextContent(paramNodes[i]);
				params[params.length] = "\"";
			}
			params[params.length] = ");";
			var evalString = params.join("");
			errorCode = eval(evalString);
		}
	
		this.setLastError(errorCode);
		//alert("Server validation for adaptor " + this.getDisplayName() + " failed with error " + errorCode.getMessage());
	}
	
	this.triggerStateChangeEvent();
	FormController.getInstance().processEvents();
	
	// Set server validation active flag to inactive
	this.m_serverValidationActive = false;
}


ValidationProtocol.prototype.onServerValidationServerSuccess = function(dom)
{
	this.handleServerValidationSuccess(dom);
	this.renderState();
}


ValidationProtocol.prototype.handleServerValidationAbort = function()
{
	this.m_serverValid = false;
	
	this.triggerStateChangeEvent();
	FormController.getInstance().processEvents();
	
	// Set server validation active flag to inactive
	this.m_serverValidationActive = false;
}


ValidationProtocol.prototype.onServerValidationAbort = function(/*e*/)
{
	this.handleServerValidationAbort();	
	this.renderState();
//	alert("Server validation for adaptor " + this.getDisplayName() + " failed with exception " + e.getMessage());
}

/**
 * Get the error code reported last time the GUI Adaptor
 * was validated - will be null if no error was reported
 */
ValidationProtocol.prototype.getLastError = function()
{
	return this.m_lastError;
}

/**
 * Set the error code for the GUI adaptor.  Used in cases
 * where we don't want to call invokeValidate (ie field
 * is null) yet want to remove the last error
 */
ValidationProtocol.prototype.setLastError = function(lastError)
{
	this.m_lastError = lastError;
}


/**
 * Set whether or not the GUI Element should be rendered in the
 * valid state or not.
 *
 * @param v boolean that determines whether or not the element
 *   is rendered as valid or not.
 * @return true if the state of GUI Adaptor changed
 * @type boolean
 */
ValidationProtocol.prototype.setValid = function(v)
{
	var r = false;
	var invokeServer = false;
	if(this.m_pendingServerValidation == true && this.m_valid == false && v == true)
	{
		invokeServer = true;
	}
	if(v != this.m_valid)
	{
		this.m_valid = v;
		
		// Toggle mandatory change flag
		this.m_validChanged = !this.m_validChanged;
		
		r = true;
		
		this.triggerStateChangeEvent();
	}
	if(invokeServer == true)	
	{
		this.invokeServerValidate();
	}
	return r;
}


/**
 * Get whether the GUI Element is rendered as valid or not
 *
 * @return true if the Element is rendered as valid or false if
 *    it isn't. ANDs the valid and serverValid flags together
 * @type boolean
 */
ValidationProtocol.prototype.getValid = function()
{
	return (this.m_valid & this.m_serverValid);
}

ValidationProtocol.prototype.getPendingServerValidation = function()
{
	return this.m_pendingServerValidation;
}

ValidationProtocol.prototype.setServerValid = function(v)
{
	this.m_serverValid = v;
}

ValidationProtocol.prototype.getServerValid = function()
{
	return this.m_serverValid;
}

ValidationProtocol.prototype.m_validationListener = null;

ValidationProtocol.prototype.getValidationListener = function()
{
	if(this.m_validationListener == null) 
    {
        this.m_validationListener = FormControllerListener.create(this, FormController.VALIDATION);
    }
	return this.m_validationListener;
}

ValidationProtocol.prototype.m_serverValidationListener = null;
ValidationProtocol.prototype.getServerValidationListener = function()
{
	if(this.m_serverValidationListener == null) 
    {
        this.m_serverValidationListener = FormControllerListener.create(this, FormController.SERVER_VALIDATION);
    }
	return this.m_serverValidationListener;
}

/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
ValidationProtocol.prototype.getListenersForValidationProtocol = function()
{
    var listenerArray = new Array();
    
	if(this.hasValidate())
	{
		var listener = this.getValidationListener();

		// Fields with validation implicitly depend on their own data binding if they have one
        var db = this.dataBinding;
		if(null != db) 
		{
            listenerArray.push({xpath: db, listener: listener});
		}
		var on = this.getValidateOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
                listenerArray.push({xpath: on[i], listener: listener});
			}
		}
	}
	if(this.hasServerValidate())
	{
		var listener = this.getServerValidationListener();
		var on = this.getServerValidateOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
                listenerArray.push({xpath: on[i], listener: listener});
			}
		}
	}
    return listenerArray;
}

/**
 * Default maximum length validation
 *
 * @return Error code if maximum length exceeded otherwise null
 * @private
 */
ValidationProtocol.prototype._validateMaxLength = function()
{
	var mV = FormController.getInstance().getDataModel().getValue(this.dataBinding);
	var ec = null;
	
	if(mV != null && mV.length > this.maxLength)
	{
		ec = ErrorCode.getErrorCode('FW_TEXTINPUT_InvalidFieldLength');
		ec.m_message = ec.getMessage() + this.maxLength;
	}
	
	return ec;
}

/**
 * Method indicates whether or not the adaptor is currently executing
 * server validation.
 *
*/
ValidationProtocol.prototype.isServerValidationActive = function()
{
    return this.m_serverValidationActive;
}

/**
 * Default validate method used for adaptors where users can enter input via
 * the keyboard. Method checks whether, or not, the user input comprises
 * whitespace characters only. If true the value is considered invalid.
 *
*/
ValidationProtocol.prototype._validateWhitespaceOnlyEntry = function()
{
    // Retrieve current value for adaptor in data model
    var mV = FormController.getInstance().getDataModel().getValue(this.dataBinding);
    
    var ec = null;
    
    if(typeof mV == "string")
    {
        // Only apply validation for string data
        if(String.trim(mV) == "")
        {
            // Raise error because string is made up of whitespace only
            ec = ErrorCode.getErrorCode( 'FW_TEXTINPUT_WhitespaceOnlyEntry' );
        }
    }
    
    return ec;
}

/**
 * Method adds whitespace only entry validation method to list of validation
 * methods to be executed when an adaptor's value changes in the data model.
 *
*/
ValidationProtocol.prototype._addWhitespaceOnlyEntryValidation = function()
{
    var validationObj = new Object();
	    
	validationObj[ "validate" ] = this._validateWhitespaceOnlyEntry;
	    
	this.addConfig( validationObj );
}

/*ValidationProtocol.prototype._registerOrRemoveServerValidationListeners = function(db, deRegister)
{
	if(this.hasServerValidate())
	{
		var dm = FormController.getInstance().getDataModel();
		var listener = this.getValidationListener();

		// Fields with server-side validation do NOT implicitly depend on their own data binding if they have one
		// because the operation is potentially very expensive
		var on = this.getServerValidateOn();
		if(null != on)
		{
			for(var i = on.length-1; i>=0; i--)
			{
				if(deRegister == false)
				{
					dm.register(on[i], listener);
				}
				else
				{
					dm.deRegister(on[i], listener);
				}
			}
		}
	}
}

ValidationProtocol.prototype.registerServerValidationListeners = function(db)
{
	this._registerOrRemoveServerValidationListeners(db, false);
}



ValidationProtocol.prototype.deRegisterServerValidationListeners = function(db)
{
	this._deRegisterOrRemoveServerValidationListeners(db, true);
}

*/
