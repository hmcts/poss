//==================================================================
//
// TextInputElementGUIAdaptor.js
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
function TextInputElementGUIAdaptor()
{
}

TextInputElementGUIAdaptor.m_logger = new Category("TextInputElementGUIAdaptor");

/**
 * TextInputElementGUIAdaptor is a sub class of InputElementGUIAdaptor
 */
TextInputElementGUIAdaptor.prototype = new InputElementGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("TextInputElementGUIAdaptor");


/**
 * Add the required protocols to the TextInputElementGUIAdaptor
 */
GUIAdaptor._addProtocol('TextInputElementGUIAdaptor', 'DataBindingProtocol');		// Supports databinding
GUIAdaptor._addProtocol('TextInputElementGUIAdaptor', 'ReadOnlyProtocol');			// Supports read only

TextInputElementGUIAdaptor.prototype.constructor = TextInputElementGUIAdaptor;

/**
 * Define default style for input text box managed by adaptor
 *
*/
TextInputElementGUIAdaptor.CSS_CLASS_NAME = "textInputElementDefaultStyle";

/**
 * Maximum length of the text field
 *
 * @configuration
 * @merge-rule Most specific maxLength takes precedence
 */
TextInputElementGUIAdaptor.prototype.maxLength = null;

/**
 * Boolean flag recording whether, or not, user input validation
 * should include a check for whitespace only entry.
 *
*/
TextInputElementGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry = null;


/**
 * Create a new TextInputElementGUIAdaptor
 *
 * @param e the text input element to manage
 * @return the new TextInputElementGUIAdaptor
 * @type TextInputElementGUIAdaptor
 */
TextInputElementGUIAdaptor.create = function(e)
{
	var a = new TextInputElementGUIAdaptor();
	a._initTextInputElementGUIAdaptor(e);
	return a;
}


TextInputElementGUIAdaptor.prototype._initTextInputElementGUIAdaptor = function(e)
{
	this._initInputElementGUIAdaptor(e);

	var a = this;
	this.m_changeEventKey = SUPSEvent.addEventHandler(e, "change", function(evt) { return a._handleBlur(evt); });
	
	// Prevent autocompletion in Mozilla which can cause focussing problems
	e.setAttribute("autocomplete", "OFF");
}


TextInputElementGUIAdaptor.prototype._dispose = function()
{
	SUPSEvent.removeEventHandlerKey(this.m_changeEventKey);
	this.m_changeEventKey = null;
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
TextInputElementGUIAdaptor.prototype._configure = function(cs)
{
	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		// additionalStylingClasses used by grid filtering
		if(c.additionalStylingClasses && this.m_additionalStylingClasses == null)
		{
			this.m_additionalStylingClasses = c.additionalStylingClasses;
		}
		// Check for whitespace only entry validation
		if(FormController.getValidateWhitespaceOnlyEntryActive())
		{
		    if(null != c.validateWhitespaceOnlyEntry && this.m_validateWhitespaceOnlyEntry == null)
		    {
		        this.m_validateWhitespaceOnlyEntry = c.validateWhitespaceOnlyEntry;
		    }
		}
		// Check for maxLength validation
		if(null != c.maxLength)
		{
			// Override this adaptor maxLength configuration
			this.maxLength = c.maxLength;
			
			// Provide default validation rule based on maxLength
			this.validate = this._validateMaxLength;
			
			// Set the text fields maximum length to correspond to the
			// maximum allowable length
			this.getElement().maxLength = this.maxLength;
			
			// As soon as a maxLength configuration is found don't 
			// look for any more.
			break;
		}
	}
	
	// If whitespace only entry validation required create additional
	// configuration object with validate property and add to
	// adaptor configuration
	if(FormController.getValidateWhitespaceOnlyEntryActive() &&
	   this.m_validateWhitespaceOnlyEntry != false)
	{
	    if(this.maxLength != null)
	    {
	        this._addWhitespaceOnlyEntryValidation();
	    }
	    else
	    {
	        // Add whitespace validation as default validation
	        this.validate = this._validateWhitespaceOnlyEntry;
	    }
	}
	
}


TextInputElementGUIAdaptor.prototype._handleBlur = function()
{
	if(TextInputElementGUIAdaptor.m_logger.isDebug()) TextInputElementGUIAdaptor.m_logger.debug("TextInputElementGUIAdaptor._handleBlur(): performing update() for adaptor: " + this.getId());
	this.update();
}


TextInputElementGUIAdaptor.prototype.renderState = function()
{
	// On IE input elements cannot have null as a value, they have to have an empty string instead
	this.m_element.value = null == this.m_value ? "" : this.m_value;

	var disabled = false;
	var readOnly = false;
	
	// Defect 1123. Set default class type.
	var className = TextInputElementGUIAdaptor.CSS_CLASS_NAME;
	
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
						    className += " notSubmissible";
						}
						else
						{
						    className += " invalid";
						}
				}
				else
				{
					className += " invalid";
				}
			}
		}
		else
		{
			if(this.m_mandatory)
			{
				className += " mandatory";
			}
		}
		
		if(this.m_readOnly)
		{
			className += " readOnly";
			readOnly = true;
		}

		if(this.m_additionalStylingClasses != null)
		{
		    className += " " + this.m_additionalStylingClasses;
		}
	}
	
	// Make sure that the class of the actual GUI Element is maintained.
/*
	var defaultClass = this._getClassName();
	if(null != defaultClass)
	{
		className += " " + defaultClass;
	}
*/
	
	this.m_element.disabled = disabled;
	this.m_element.className = className;
	this.m_element.readOnly = readOnly;

	if(this.m_focusChanged)
	{
		// Hightlight text on focus
		if(this.m_focus)
		{
			this.m_element.select();
		}
		this.m_focusChanged = false;
	}
	
}
