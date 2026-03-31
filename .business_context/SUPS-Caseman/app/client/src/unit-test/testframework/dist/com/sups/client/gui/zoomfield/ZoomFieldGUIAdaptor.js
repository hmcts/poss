//==================================================================
//
// ZoomFieldGUIAdaptor.js
//
// Class for integrating a zoomable text field with the Framework.
//
//==================================================================


/**
 * Class for integrating a zoomable text field with the Framework.
 *
 * @constructor
 * @private
 */
function ZoomFieldGUIAdaptor() {}



ZoomFieldGUIAdaptor.m_logger = new Category("ZoomFieldGUIAdaptor");

/**
 * DatePickerGUIAdaptor is a sub class of InputElementGUIAdaptor
 */
ZoomFieldGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Add the required protocols to the ZoomFieldGUIAdaptor
 */
GUIAdaptor._setUpProtocols('ZoomFieldGUIAdaptor');
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'DataBindingProtocol');			 // Supports binding to data model
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'MandatoryProtocol');             // Supports mandatory
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'ReadOnlyProtocol');            	 // Supports read only protocol
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol
GUIAdaptor._addProtocol('ZoomFieldGUIAdaptor', 'KeybindingProtocol');       	 // Supports key binding


ZoomFieldGUIAdaptor.prototype.constructor = ZoomFieldGUIAdaptor;

/**
 * Maximum length of the text field
 *
 * @configuration
 * @merge-rule Most specific maxLength takes precedence
 */
ZoomFieldGUIAdaptor.prototype.maxLength = null;

/**
 * Boolean flag recording whether, or not, user input validation
 * should include a check for whitespace only entry.
 *
 * @configuration
 * @type Boolean
*/
ZoomFieldGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry = null;


/**
 * Create a new ZoomFieldGUIAdaptor
 *
 * @param e the text input element to manage
 * @param f the gui adaptor factory
 * @return the new ZoomFieldGUIAdaptor
 * @type ZoomFieldGUIAdaptor
 */
ZoomFieldGUIAdaptor.create = function(e, factory)
{
	if(ZoomFieldGUIAdaptor.m_logger.isTrace()) ZoomFieldGUIAdaptor.m_logger.trace("create()");
	var a = new ZoomFieldGUIAdaptor();
	a._initialiseAdaptor(e);
	return a;
}


/**
 * Initialise the ZoomFieldGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
ZoomFieldGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	if(ZoomFieldGUIAdaptor.m_logger.isTrace()) ZoomFieldGUIAdaptor.m_logger.trace("_initialiseAdaptor()");
	
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	this.m_keyBindings = new Array();
	
	this.m_renderer._setAdaptor(this);
}


/**
 * Clean up after the component
 */
ZoomFieldGUIAdaptor.prototype._dispose = function()
{
	if(ZoomFieldGUIAdaptor.m_logger.isTrace()) ZoomFieldGUIAdaptor.m_logger.trace("ZoomFieldGUIAdaptor.dispose()");

	// Dispose of the renderer
	this.m_renderer.dispose();
	this.m_renderer = null;

	// Remove the popup configuration
	var cm = FormController.getInstance().getFormView().getConfigManager();
	var zoomId = this.getId();

	cm.removeConfig(zoomId + "_popup");
	cm.removeConfig(zoomId + "_ok");
	cm.removeConfig(zoomId + "_cancel");
	cm.removeConfig(zoomId + "_textarea");

	// Dispose of any key bindings
	for (var i = 0, l = this.m_keyBindings.length; i < l; i++)
		this.m_keyBindings[i].dispose();
}


/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 */
ZoomFieldGUIAdaptor.prototype._configure = function(cs)
{
	if(ZoomFieldGUIAdaptor.m_logger.isTrace()) ZoomFieldGUIAdaptor.m_logger.trace("_configure()");

	// Iterate through the configuration, using most specific configurations first
	for(var i = 0; i < cs.length; i++)
	{
		var c = cs[i];
		if(null != c.maxLength && null == this.maxLength)
		{
			this.maxLength = c.maxLength;

			// Provide default validation rule based on maxLength
			this.validate = this._validateMaxLength;
		}
		
		// Check for whitespace only entry validation
		if(FormController.getValidateWhitespaceOnlyEntryActive())
		{
		    if(null != c.validateWhitespaceOnlyEntry && this.m_validateWhitespaceOnlyEntry == null)
		    {
		        this.m_validateWhitespaceOnlyEntry = c.validateWhitespaceOnlyEntry;
		    }
		}
		
	}

	// Configure the input box
	if(null != this.maxLength) this._getInputField().maxLength = this.maxLength;
	
	// Configure whitespace only entry validation if required.
	if(FormController.getValidateWhitespaceOnlyEntryActive() &&
	   this.m_validateWhitespaceOnlyEntry != false)
	{
	    if(this.maxLength != null)
	    {
	        // Maxlength validation in operation so add whitespace validation
	        // as additional configuration object
	        this._addWhitespaceOnlyEntryValidation();
	    }
	    else
	    {
	        // Add whitespace validation as default validation
	        this.validate = this._validateWhitespaceOnlyEntry;
	    }
	}
	
	// Configure zoom field sub components

	var fc = FormController.getInstance();
	var cm = fc.getFormView().getConfigManager();
	var zoomId = this.getId();
	var thisObj = this;
	var popupId = zoomId + "_popup";

	// Configure the action binding for the OK button
	cm.setConfig(
		zoomId + "_ok",
		{
			actionBinding: function() { thisObj._handleOk(); }
		}
	);
	
	// Configure the action and key bindings for the Cancel button
	cm.setConfig(
		zoomId + "_cancel",
		{
			actionBinding: function() { thisObj._handleCancel(); },
			additionalBindings: {
				eventBinding: {
					keys: [ { key: Key.F4, element: popupId } ]
				}
			}
		}
	);
	
	// Configure the text area
	var textAreaId = zoomId + "_textarea";
	
	this.m_textAreaDataBinding = DataModel.DEFAULT_TMP_BINDING_ROOT + "/" + textAreaId;
	
	// The configuration specific to this field - propogate some of it to the
	// textArea.
	//var fieldConfig = cs[0];
	
	var textAreaConfigObj = {
			                    includeInValidation: false,
			                    dataBinding: this.m_textAreaDataBinding,
			                    maxLength: this.maxLength
		                    };
		                      
    if(FormController.getValidateWhitespaceOnlyEntryActive())
    {
        textAreaConfigObj[ "m_validateWhitespaceOnlyEntry" ] = this.m_validateWhitespaceOnlyEntry;
    }
    
	cm.setConfig( textAreaId, textAreaConfigObj );

	// Override the text area's default "onchange" event handler with the
	// Zoom Field's GUI adaptor's handler
	var a = fc.getAdaptorById(textAreaId);
	a._handleBlur = thisObj._handleTextAreaBlur;

	// Set up configuration of the popup	
	cm.setConfig(
		popupId,
		{
			// Make sure focus is returned to this field when the popup is lowered
			nextFocusedAdaptorId: function() { return zoomId; }
		}
	);

	// Setup the field's button to raise the popup
	this._getPopupButton().addClickListener(function() { thisObj._raisePopup(); });
	
	// Setup default key binding of Atl+Z to raise popup. NB: we don't want to
	// use the popup raise event binding as the adaptor's _raisePopup method is 
	// not called (because the PopupGUIAdaptor shows the popup). This results in
	// the input box value not being copied to the text area and the popup not
	// being positioned correctly.
	var keyObj = new Object();
	var qualObj = new Object();
	qualObj.alt = true;

	if(HTMLView.isIE) {
		// Bind upper case z for IE
		keyObj.m_keyCode = Key.CHAR_Z.m_keyCode;
	}
	else {
		// Bind lower case z for Mozilla
		keyObj.m_keyCode = Key.CHAR_z.m_keyCode;
	}

	this.m_keyBindings[0] = new ElementKeyBindings(this);
	this.m_keyBindings[0].bindKey(keyObj, function() { thisObj._handleDefaultKey(); }, qualObj);	
}


/**
 * Handle a click on the OK button
 *
 * @private
 */
ZoomFieldGUIAdaptor.prototype._handleOk = function()
{
	// Lower the popup
	this._lowerPopup();

	// Get the popup's textarea's value
	var textAreaValue = this._getTextArea().value;

	// Does input field accept linefeeds and carriage returns
	if(!this._getMultiline())
	{
		// No, so convert linefeeds and carriage returns to space characters
		textAreaValue = textAreaValue.replace(new RegExp("[\\n\\r]", "gm"), " ");
	}

	// Copy the value from the popup text area to the main input field
	this._getInputField().value = textAreaValue;

	// Update the data model
	this.update();
}


/**
 * Handle a click on the Cancel button
 *
 * @private
 */
ZoomFieldGUIAdaptor.prototype._handleCancel = function()
{
	// Just hide the popup
	this._lowerPopup();
	
}


ZoomFieldGUIAdaptor.prototype._lowerPopup = function()
{
	// Hide the popup
	Services.dispatchEvent(this.getId() + "_popup", PopupGUIAdaptor.EVENT_LOWER);

	// Notify the renderer that the popup is being lowered.
	this.m_renderer.lowerPopup();
}


/**
 * Handle a click on the field's button which shows the popup
 *
 * @private
 */
ZoomFieldGUIAdaptor.prototype._raisePopup = function()
{
	// Copy the value for the input area into the text area
	Services.setValue(this.m_textAreaDataBinding, this._getInputField().value);

	// Apply the OK button and text area states before the popup is positioned
	// otherwise the button is not rendered and the popup height and width
	// are not set
	this._prePopupPrepare();
	
	// Position popup.
	this.m_renderer.positionPopup();

	// Show the popup
	Services.dispatchEvent(this.getId() + "_popup", PopupGUIAdaptor.EVENT_RAISE);
}


/**
 * Get the value from the view.
 *
 * @return the value of the input field
 * @type String
 */
ZoomFieldGUIAdaptor.prototype._getValueFromView = function()
{
	// Get the value of the input field
	return this._getInputField().value;
}


/**
 * Method invoked by tabbing manager to notify the component that it has lost focus
 *
 */
ZoomFieldGUIAdaptor.prototype.onBlur = function()
{
	// Update the model when the Tabbing Manager notifies us that we've lost focus
	this.update();
}


ZoomFieldGUIAdaptor.prototype.renderState = function()
{
	if(ZoomFieldGUIAdaptor.m_logger.isDebug())
	{
		ZoomFieldGUIAdaptor.m_logger.debug(this.getId() + ":ZoomFieldGUIAdaptor.renderState() this.m_enabled=" + this.m_enabled + ", this.m_readOnly=" + this.m_readOnly + ", this.getValid()=" + this.getValid() + ", this.m_mandatory=" + this.m_mandatory + ", this.isActive()=" + this.isActive());
	}

	// Set up value
	if(this.m_valueChanged)
	{
		// On IE input elements cannot have null as a value, they have to have an empty string instead
		this._getInputField().value = (null == this.m_value ? "" : this.m_value);
		this.m_valueChanged = false;
	}


	// Hightlight text on focus
	if(this.m_focusChanged)
	{
		if(this.m_focus)
		{
			this._getInputField().select();
		}
		this.m_focusChanged = false;
	}
	
	// Propogate readOnly changes to textarea
/*
	if(this.m_readOnlyChanged)
	{
		var ta = this._getTextArea();
		ta.readOnly = this.m_readOnly;
		ta.className = this.m_readOnly ? "readOnly" : "";
		
		this.m_readOnlyChanged = false;
	}
*/

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
 * Get the element to set focus on. For the ZoomField this
 * is the FramedField's input text field
 */
ZoomFieldGUIAdaptor.prototype.getFocusElement = function()
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
ZoomFieldGUIAdaptor.prototype._getInputField = function()
{
	return this.m_renderer.getInputField();
}


/**
 * Get the textarea on the component's popup
 * 
 * @return the component's popup textarea field
 * @type HTMLTextAreaElement
 * @private
 */
ZoomFieldGUIAdaptor.prototype._getTextArea = function()
{
	return this.m_renderer.getTextArea();
}


ZoomFieldGUIAdaptor.prototype._getPopupButton = function()
{
	return this.m_renderer.getPopupButton();
}


ZoomFieldGUIAdaptor.prototype._getMultiline = function()
{
	return this.m_renderer.getMultiline();
}


/**
 * Handle the Alt+Z default key binding
 * 
 * @private
 */
ZoomFieldGUIAdaptor.prototype._handleDefaultKey = function()
{
	if (!AbstractPopupGUIAdaptor._isPopupRaised(this.getId()+ "_popup"))
	{
		// Only raise the popup if it is not already raised
		this._raisePopup();
	}
}


/**
 * Override for the text area's "onchange" handler.
 *
 * Applies the zoom field's validate, mandatory and read only rules to the
 * popup's text area.
 *
 * Validation etc rules can be written to get the zoom field's value and then
 * do some processing with that value. Just copying the rules to the text area
 * and letting the Framework invoke them when the text area is updated can cause
 * problems if the coding in the rule does not account for this.
 *
 * If the user has clicked anywhere other than the OK or Cancel buttons then
 * this method does the following:
 * 1) Stores the zoom field's model value
 * 2) Gets the text area value and copies it into the zoom field's input box
 * 3) Updates the text area
 * 4) Applies the valid, mandatory and read only states of the zoom field to
 *    the text area
 * 5) Restores the zoom field's original model value
 *
 * @param evt the onchange event
 * @private
 */
ZoomFieldGUIAdaptor.prototype._handleTextAreaBlur = function(evt)
{
	// If IE then use the global event object
	evt = (evt) ? evt : ((event) ? event : null);
	
	// Get the element in which the event occurred
	var eventX = SUPSEvent.getPageX(evt);
	var eventY = SUPSEvent.getPageY(evt);
	var pointElement = document.elementFromPoint(eventX, eventY);
	
	if(pointElement != null)
	{
		var pointElementId = pointElement.id;
		// NB: 'this' references the text area not the zoom field
		var textAreaId = this.getId();
		var zoomFieldId = textAreaId.substring(0, textAreaId.lastIndexOf("_textarea"));

		if(pointElementId != (zoomFieldId + "_ok") && pointElementId != (zoomFieldId + "_cancel"))
		{
			var fc = FormController.getInstance();
			var dm = fc.getDataModel();

			// Get the zoom field's adaptor and original model value	
			var zf = fc.getAdaptorById(zoomFieldId);
			var db = zf.dataBinding;
			var origValue = dm.getValue(db);

			// Copy the text area value into the zoom field
			var mv = this._getValueFromView();
			dm.setValue(db, mv);

			// Update the text area
			this.update();

			// Set the valid, server valid, mandatory and read only states of the text area
			this.setValid(zf.getValid());
			this.m_serverValid = zf.getServerValid();
			this.setMandatory(zf.getMandatory());
			this.setReadOnly(zf.getReadOnly());

			// Restore the zoom field's original model value
			dm.setValue(db, origValue);
		}
		else
		{
			// OK or Cancel button clicked, just update the text area
			this.update();
		}
	}
	else
	{
		// Cannot determine an element in which the event occurred,
		// just update the text area
		this.update();
	}
}


/**
 * Called before the Zoom Field's popup is raised. Sets up the state of the
 * OK button and the popup's text area
 *
 * @private
 */
ZoomFieldGUIAdaptor.prototype._prePopupPrepare = function()
{
	var zoomId = this.getId();
	
	// Disable the popup OK button if this Zoom Field is read only
	var a = Services.getAdaptorById(zoomId + "_ok");
	var readOnly = this.getReadOnly();

	if(a.setEnabled(!readOnly))
	{
		// Ensure state gets applied to the OK button if changed
		a.renderState();
	}

	// Popup could be raised by clicking button after typing in the field
	// without tabbing or clicking off the field, so we need to update it
	if(!readOnly) this.update();
	
	// Set the valid, server valid, mandatory and read only states
	// of the Zoom Field's popup text area based upon the state of
	// the Zoom Field
	a = Services.getAdaptorById(zoomId + "_textarea");

	var validChanged = a.setValid(this.getValid());
	var mandatoryChanged =  a.setMandatory(this.getMandatory());
	var readOnlyChanged = a.setReadOnly(readOnly);

	var serverValidChanged = a.m_serverValid;
	a.m_serverValid = this.getServerValid();
	serverValidChanged = !(serverValidChanged == a.m_serverValid);
	
	if(validChanged || mandatoryChanged || readOnlyChanged || serverValidChanged)
	{
		// Ensure states get applied to the text area if changed
		a.renderState();
	}
}
