//==================================================================
//
// AutocompletionGUIAdaptor.js
//
// Class for implementing tabbed diaglouges for use in the
// framework
//
//==================================================================

/**
 * Base class for adapting DIV elements with a TabSelector class 
 * for use in the framework.
 *
 * @constructor
 * @private
 */
function AutocompletionGUIAdaptor() 
{
//	this.m_enteredValue = null;
	
	// Only used if component has strictValidation configured as true.
	// If strictValidation is enabled, then this value is true if the
	// entered text is one of the values in the dropdown list, or false
	// if it isn't.
	this.m_usingListEntry = true;
};

AutocompletionGUIAdaptor.m_logger = new Category("AutocompletionGUIAdaptor");
 
/**
 * AutocompletionGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
AutocompletionGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Add the required protocols to the AutocompletionGUIAdaptor
 */
GUIAdaptor._setUpProtocols('AutocompletionGUIAdaptor'); 
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'ListSrcDataProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'RecordsProtocol');				// Supports form dirty
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'MandatoryProtocol');            // Supports mandatory
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'ReadOnlyProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol
GUIAdaptor._addProtocol('AutocompletionGUIAdaptor', 'MouseWheelBindingProtocol');	  // Supports mouse wheel scrolling

/**
 * Set the constructor property after setting up protocols
 */
AutocompletionGUIAdaptor.prototype.constructor = AutocompletionGUIAdaptor;

/**
 * Maximum length of the text field
 *
 * @configuration
 * @merge-rule Most specific maxLength takes precedence
 */
AutocompletionGUIAdaptor.prototype.maxLength = null;


/**
 * Determines whether or not strict validation is enabled or not.
 * If no configuration is specified (neither true nor false assigned)
 * then this configuration item will default to false.
 *
 * @configuration
 * @type Boolean
 */
AutocompletionGUIAdaptor.prototype.strictValidation = null;

/**
 * Boolean flag recording whether, or not, user input validation
 * should include a check for whitespace only entry.
 *
 * @configuration
 * @type Boolean
*/
AutocompletionGUIAdaptor.prototype.m_validateWhitespaceOnlyEntry = null;

/**
 * String storing autocompletion element selection mode
 *
*/
AutocompletionGUIAdaptor.prototype.m_selectionMode = null;

/**
 * Flag indicating whether, or not, the single matching functionality
 * of the renderer/adaptor is enabled.
 *
 * @configuration
 * @type Boolean
 *
*/
AutocompletionGUIAdaptor.prototype.m_singleMatchingEnabled = null;


/**
 * Create a new AutocompletionGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new AutocompletionGUIAdaptor
 * @type AutocompletionGUIAdaptor
 */
AutocompletionGUIAdaptor.create = function(element)
{
	if (AutocompletionGUIAdaptor.m_logger.isTrace())
	{
		AutocompletionGUIAdaptor.m_logger.trace("AutocompletionGUIAdaptor.create");
	}
	var a = new AutocompletionGUIAdaptor();
	a._initAutocompletionGUIAdaptor(element);
	return a;
}

/**
 * Initialises the instance (called from creation)
 *
 * @param element the element to manage
 */
AutocompletionGUIAdaptor.prototype._initAutocompletionGUIAdaptor = function(element)
{
	this.m_element = element;
	this.m_renderer = element.__renderer;
	element.__renderer = null;
	fc_assert(this.m_renderer != null, "AutocompletionGUIAdaptor._initAutocompletionGUIAdaptor(): the renderer is not defined!");
	this.m_renderer.m_guiAdaptor = this;
	this.m_renderer.m_dropDownField.m_guiAdaptor = this;

	// GUIAdaptor acts as the model for the AutoCompletionRenderer.
	this.m_renderer.setModel(this);
	
	var thisObj = this;
	this.m_renderer.addValueChangeListener(function(){thisObj._valueChangeCallback()});	
}


/**
 * Disposes of all resources (event handlers and references to renderer)
 */
AutocompletionGUIAdaptor.prototype._dispose = function()
{
	this.m_renderer.dispose();
	this.m_renderer = null;
}

/*
 * Override the ReadOnlyProtocol version to start and stop the appropriate
 * event handlers, before calling the parent version
 */
AutocompletionGUIAdaptor.prototype.setReadOnly = function(readOnly)
{
  // Start or stop listeners.
  if (readOnly)
  {
  	this.m_renderer.stopEventHandlers();
  }
  else
  {
  	this.m_renderer.startEventHandlers();
  }
  
  // Call parent method.
  return ReadOnlyProtocol.prototype.setReadOnly.call(this.m_renderer.m_guiAdaptor,readOnly);
}


AutocompletionGUIAdaptor.prototype.setMatchString = function(match)
{
	// Set the match string
	if(this.m_match != match)
	{
		this.m_match = match;
		
		this.m_matches = this._getMatchesFromDOM(this.m_match);
	}
	
	return (this.m_matches == null) ? 0 : this.m_matches.length;
}


AutocompletionGUIAdaptor.prototype.isKeyForMatchSubmissible = function(matchNumber)
{
	var key = this.getKeyForMatch(matchNumber);
	var isSubmissible = this.getAggregateState().isKeySubmissible(key);
	if (AutocompletionGUIAdaptor.m_logger.isTrace()) AutocompletionGUIAdaptor.m_logger.trace("AutocompletionGUIAdaptor.isKeyForMatchSubmissible() key=" + key + ", isSubmissible=" + isSubmissible);
	return isSubmissible;
}

AutocompletionGUIAdaptor.prototype.getKeyForMatch = function(matchNumber)
{
	var match = this.m_matches[matchNumber];
	var keyValueNode = null;
	if(match !=null)
	{
		keyValueNode = match.selectSingleNode(this.keyXPath);
	}
	return keyValueNode == null ? "" : XML.getNodeTextContent(keyValueNode);
}

AutocompletionGUIAdaptor.prototype.getMatch = function(matchNumber)
{
	var match = this.m_matches[matchNumber];
	var displayValueNode = null ;
	if (match != null)
	{
		displayValueNode = match.selectSingleNode(this.m_displayXPath);
	}
	return displayValueNode == null ? "" : XML.getNodeTextContent(displayValueNode);
}

AutocompletionGUIAdaptor.prototype._getMatchesFromDOM = function(matchString)
{
	//  With match string, each row XPath should be of the form
	//    /var/grid/type1[starts-with(translate(displayXPath, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'matchString')]
	//  Without match string, each row XPath should be of the form - will select all rows.
	//    /var/grid/type1

    // Create a matchString to use with the predicate - must be upper 
    // case and have all current escaped characters doubly escaped 
    matchString = matchString.toUpperCase();
    
	var predicateMatchString = Services.xPathToConcat(matchString);
	
	// Create a xpath fragment which selects the nodes which match the
	// matching string.
	var matchDisplayXPath = 
		((matchString == null || matchString == "")
		? ""											// No match string so don't add predicate
		: "[starts-with(" + this._translateXPathValueToUpperCase(this.m_displayXPath) + ", " + predicateMatchString +")]");	// Select nodes which start with the match
		
	// Select nodes which start with the supplied matchString (ignoring case)
	return this._getRowNodesFromDOM(matchDisplayXPath);
}


AutocompletionGUIAdaptor.prototype._getExactMatchesFromDOM = function(matchString)
{
	// The xpath to select row nodes who's display value exactly matches
	// the supplied match string will be of the form:
	//   /var/grid/type1[translate(displayXPath, 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHOIJKLMNOPQRSTUVWXYZ') = '<matchString>']
	
	// Create an xpath fragment which will select nodes who's display value
	// exactly matches (ignoring case!) the supplied string
	var upperMatchString = matchString.toUpperCase();
	var predicateMatchString = Services.xPathToConcat(upperMatchString);
	var matchDisplayXPath = "[" + this._translateXPathValueToUpperCase(this.m_displayXPath) + " = " + predicateMatchString + "]";
	
	// Select nodes which exactly match the supplied string (ignoring case)
	return this._getRowNodesFromDOM(matchDisplayXPath);
}


AutocompletionGUIAdaptor.prototype._getRowNodesFromDOM = function(predicate)
{
	// Select the rows resticted by the supplied predicate
	var xpath = this.getRowXPathWithSuffix(predicate);
	//alert("xpath is : " + xpath);
	var nodeArray = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(xpath);
	
	// Sort nodeArray if required.
	if (nodeArray != null 
	    && nodeArray.length > 0 
	    && this.comparator != null ){	

		// IE returns a type of nodeset - need to turn into an array for sorting.
		var newArray = Array(nodeArray.length);
		for(var i = 0, l = nodeArray.length; i < l; i++)
		{
			newArray[i] = nodeArray[i];	
		}
	
		// Create locals for use in closure
		var displayXPath = this.m_displayXPath;
		var comparatorFn = this.comparator;
		newArray.sort( function(a,b) { 
									var aNode = a.selectSingleNode(displayXPath);
									var bNode = b.selectSingleNode(displayXPath);
									var aText = (aNode == null ? "" : XML.getNodeTextContent(aNode));
									var bText = (bNode == null ? "" : XML.getNodeTextContent(bNode));
									return comparatorFn(aText,bText);
								  } );
		nodeArray = newArray;
	}
	return nodeArray;	
}

AutocompletionGUIAdaptor.prototype._sortDisplayValues = function(a,b) 
{
return 1;
	var aNode = a.selectSingleNode(displayXPath);
	var bNode = b.selectSingleNode(displayXPath);
	var aText = XML.getNodeTextContent(aNode);
	var bText = XML.getNodeTextContent(bNode);
  	if (aText == bText) {
	  return 0;
	}
	if (aText > bText) {
	  return 1;
	}
	if (aText < bText) {
	  return -1;
	}
}

AutocompletionGUIAdaptor.prototype._getMatchesForKeyFromDOM = function(key)
{
	var predicateMatchString = Services.xPathToConcat(key);
	var matchKeyXPath = "[" + this.keyXPath + " = " + predicateMatchString + "]";
	
	return this._getRowNodesFromDOM(matchKeyXPath);
}

AutocompletionGUIAdaptor.prototype._valueChangeCallback = function()
{
	if(AutocompletionGUIAdaptor.m_logger.isDebug())
	{
		AutocompletionGUIAdaptor.m_logger.debug("AutocompletionGUIAdaptor._valueChangeCallback()");
	}
	this.update();
}

/**
 * Get the value from the view, ...???
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
 * @type ???
 */
AutocompletionGUIAdaptor.prototype._getValueFromView = function()
{
	var selectedMatch = this.m_renderer.getSelectedMatch();
	var matchNode = null;
	var keyNode = null;
	var ret = null;

	// Set flag to indicate that value entered is in the list of possible values.
	// This may be overridden later on.
	this.m_usingListEntry = true;
	
	if(null == selectedMatch)
	{
		var enteredValue = this.m_renderer.getTextFieldValue();
		
		// Attempt to match entered value
		var matches = this._getExactMatchesFromDOM(enteredValue);
		
		if(0 == matches.length)
		{
			// No matches found for entered value
			// Set flag to indicate that value entered was not in the list
			this.m_usingListEntry = false;
		}
		else
		{
			// Use the first match returned.
			matchNode = matches[0];
		}
	}
	else
	{
		matchNode = this.m_matches[selectedMatch];
	}
	
	if(matchNode == null)
	{
		// Get the value entered into the field and use this.
		ret = this.m_renderer.getTextFieldValue();
		
		if(this.m_displayXPath != this.keyXPath)
		{
		    // In some cases when an autocomplete field uses both key and display values
		    // a user may type in the key value directly. To accommodate this check whether
		    // input text matches key values using case insensitive match. If a match is
		    // found set return value to key value.
		
		    var exactKeyNode = this._getCaseInsensitiveExactMatchForKeyFromDOM(ret);
		    
		    if(exactKeyNode.length == 1)
		    {
		        
		        keyNode = exactKeyNode[0].selectSingleNode(this.keyXPath);
		        
		        if(null == keyNode)
		        {
		            ret = null;
		        }
		        else
		        {
		            ret = XML.getNodeTextContent(keyNode);
		            
		            // Check if return value matches value currently
		            // stored in adaptor
		            if(ret == this.m_value)
		            {
		                // In this case the model value will not be updated and
		                // the view value will not be refreshed. Therefore, we
		                // must refresh the display explicitly.
		                var displayNode = exactKeyNode[0].selectSingleNode(this.m_displayXPath);
		                
		                if(null != displayNode)
		                {
		                    var displayValue = XML.getNodeTextContent(displayNode);
		                    
		                    if(null != displayValue)
		                    {
		                        this.m_renderer.setValue(displayValue);
		                    }
		                    
		                }
		                
		            } // End of if(ret == this.m_value)
		            
		        }
		    }
		    
		}
	}
	else
	{
		// Get the key for the selected node
		
	    keyNode = matchNode.selectSingleNode(this.keyXPath);
		
		if (null == keyNode)
		{
			// No key - this is strictly an error, however just return null
			ret = null;
		}
		else
		{
			ret = XML.getNodeTextContent(keyNode);
		}
	}
	
	return ret;
/*
	// m_usingListEntry used to determine validity when performing strict validation
	// i.e. validation of value against keys in srcData
	this.m_usingListEntry = true;
	var dataValue = this._transformDisplayValue(this.m_enteredValue);
	if(null == dataValue)
	{
		// If no match, validation against the list is off, used the display value
		dataValue = this.m_enteredValue;
		this.m_usingListEntry = false;
	}
	return dataValue;
*/
}


AutocompletionGUIAdaptor.prototype._getRowsMatchingKey = function(keyValue)
{
	// xpath to get row corresponding to the key
	//  /ds/grid/type1[<keyXPath> = '<this.m_value>']
	var predicateMatchString = Services.xPathToConcat(keyValue);
	var matchKeyPredicate = "[" + this.keyXPath + " = " + predicateMatchString + "]";
	
	return this._getRowNodesFromDOM(matchKeyPredicate)		
}


AutocompletionGUIAdaptor.prototype.onBlur = function()
{
	this.update();
}


/**
 * Renders the visual state and event handlers for this
 * adaptor based on its current state
 */
AutocompletionGUIAdaptor.prototype.renderState = function()
{
	if(this.m_focusChanged)
	{
		// Reset this immediately so that we don't end up recursing through this again
		this.m_focusChanged = false;

		if(this.m_focus)
		{
			// Hightlight text on focus
			this.m_renderer.m_dropDownField._getInputFieldElement().select();
		}
		else
		{
			// Hide the drop down when the focus is lost
			this.m_renderer.m_dropDownField.hideDropDown();
		}
	}

	// Set up value
	if(this.m_valueChanged)
	{
		this._refreshDisplayedValue();
		this.m_valueChanged = false;
	}

	// Set up all states other than value - we only use the areChildrenSubmissible here for the
	// orange state because the mandatory and invalid states are supported on this adaptor type
	// and we don't want to overwrite the red border etc.
	this.m_renderer.render(
		!this.m_enabled,
		this.m_focus,
		this.m_mandatory,
		!this.getValid(),
		!this.getServerValid(),
		this.m_readOnly,
		!this.isActive(),
		this.getAggregateState().areChildrenSubmissible(),
		this.isServerValidationActive()
	);
}


AutocompletionGUIAdaptor.prototype._refreshDisplayedValue = function()
{
	// Value defaults to the key value
	var val = this.m_value;

	// Get rowNodes which match the current key value
	var rowNodes = this._getRowsMatchingKey(val);

	// Default the flag to no key found
	var keyFound = false;
	
	if(rowNodes.length != 0)
	{
		// Key found, so set the flag and get the display value for the key
		keyFound = true;
		
		var displayValueNode = rowNodes[0].selectSingleNode(this.m_displayXPath);
		
		if(null != displayValueNode)
		{
			// Get the display value
			val = XML.getNodeTextContent(displayValueNode);
		}
	}
	
	if(true == this.strictValidation)
	{
		// Configured for strict validation, so set the single matching flag
		// on the renderer
		this.m_renderer.setMatchSingle(keyFound);
	}
	
	// Write the value to the view
	this.m_renderer.setValue(val);
}


AutocompletionGUIAdaptor.CLICK_MODE = "onClickMode";
AutocompletionGUIAdaptor.DBL_CLICK_MODE = "onDblClickMode";

/*
 * No custom configuration for this component, but does registger
 * callbacks on page elements at this point.
 */
AutocompletionGUIAdaptor.prototype._configure = function(cs)
{	
	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		if(c.displayXPath && this.m_displayXPath == null)
		{
			this.m_displayXPath = XPathUtils.removeLeadingSlash(c.displayXPath);
		}
		
		// If strict validation specified in this configuration and we haven't
		// previously set strict validation
		if(c.strictValidation && null == this.strictValidation)
		{
			// Set strict validation flag on this adaptor
			this.strictValidation = c.strictValidation;
			
			// If strict validation was enabled, then assign the validate
			// function on this adaptor
			if(true == this.strictValidation)
			{
				this.validate = this._strictValidate;
			}
		}

		if(null != c.selectionMode && this.m_selectionMode == null) 
		{
			this.m_selectionMode = c.selectionMode;
	    }
		
		if(null != cs[i].sortMode)
		{
			if (cs[i].sortMode == "numerical")
			{
				this.comparator = Comparators.numericalSort;
			}
			else if (cs[i].sortMode == "alphabetical")
			{
				this.comparator = Comparators.alphabeticalSort;
			}
			else if (cs[i].sortMode == "alphabeticalLowToHigh")
			{
				this.comparator = Comparators.alphabeticalSortLowToHigh;
			}
			else if (cs[i].sortMode == "alphabeticalLocaleCompare")
			{
				this.comparator = Comparators.alphabeticalLocaleCompareSort;
			}
			else if (cs[i].sortMode == "alphanumerical")
			{
				this.comparator = Comparators.alphanumerical;
			}
			else if (cs[i].sortMode == "alphabeticalCaseInsensitive")
			{
				this.comparator = Comparators.alphabeticalCaseInsensitiveSort ;
			}
			else
			{
				this.comparator = null;	
			}
		}
		if(null != c.maxLength && this.maxLength == null)
		{
			// Override this adaptor maxLength configuration
			this.maxLength = c.maxLength;
			
			// Provide default validation rule based on maxLength
			this.validate = this._validateMaxLength;
			
			// Set the text fields maximum length to correspond to the
			// maximum allowable length
			this.m_renderer.getInputElement().maxLength = this.maxLength;
		}
		
		// Check for single matching enablement
		if(null != c.singleMatchingEnabled && this.m_singleMatchingEnabled == null)
		{
		    this.m_singleMatchingEnabled = c.singleMatchingEnabled;
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
	
	// Check state of configuration 
	this._checkConfiguration();
	
	this.m_renderer.setSelectionMode(this.m_selectionMode);
	
	// Append displayValue xpaths to set of xpaths which trigger a refresh of source data
	var displayXPaths = this.getRowXPathArrayWithSuffix()
	this.srcDataOn = (null == this.srcDataOn) ? displayXPaths : this.srcDataOn.concat(displayXPaths);
	
	// If required set up adaptor to run strict validation if source data changes
	if(true == this.strictValidation)
	{
	    if(null != this.validateOn)
	    {
	        this.validateOn = this.validateOn.concat(this.srcDataOn);
	    }
	    else
	    {
	        this.validateOn = this.srcDataOn;
	    }
	}
	
	// Check single matching enablement value
	if(this.m_singleMatchingEnabled != false)
	{
	    this.m_singleMatchingEnabled = true;
	}
	
	// Configure whitespace only entry validation if required.
	if((this.strictValidation != true) &&
	   FormController.getValidateWhitespaceOnlyEntryActive() &&
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
	
}

AutocompletionGUIAdaptor.prototype._checkConfiguration = function()
{
	// srcData is mandatory
	if(null == this.srcData)
	{
		throw new ConfigurationException("srcData must be specified for adaptor: " + this.getId());
	}
	// keyXPath is mandatory
	if(null == this.keyXPath)
	{
		throw new ConfigurationException("keyXPath must be specified for adaptor: " + this.getId());
	}
	// D829 - Invalid to have both maximum length and strict validation configured
	if(this.maxLength != null && true == this.strictValidation)
	{
		throw new ConfigurationException("Cannot have both 'maxLength' and 'strictValidation' configured for adaptor: " + this.getId());
	}

	// Determine selection mode
	if(null != this.m_selectionMode)
	{
	    if(this.m_selectionMode != AutocompletionGUIAdaptor.CLICK_MODE && 
		   		this.m_selectionMode != AutocompletionGUIAdaptor.DBL_CLICK_MODE)
		{
		    if(AutocompletionGUIAdaptor.m_logger.isError())
			{
	            AutocompletionGUIAdaptor.m_logger.error("AutocompletionGUIAdaptor._configure() unknown selectionMode in configuration for adaptor id=" + this.getId() + ", reverting to default of AutocompletionGUIAdaptor.CLICK_MODE");
	        }
			
			this.m_selectionMode = AutocompletionGUIAdaptor.CLICK_MODE;
		}
		
	}
	else
	{
	    this.m_selectionMode = AutocompletionGUIAdaptor.CLICK_MODE;
	}

	// row is optionaly configured and derived from srcData if null
	this.m_absoluteRowXPath = this.rowXPath ? this.srcData + '/' + this.rowXPath : this.srcData;
	
	// displayXPath is optionally configured and derived from key if null
	this.m_displayXPath = this.m_displayXPath != null ? this.m_displayXPath : this.keyXPath;
	this.m_absoluteDisplayXPath = this.m_absoluteRowXPath + '/' + this.m_displayXPath;

	this.srcDataOn[this.srcDataOn.length] = this.m_absoluteDisplayXPath;
}


AutocompletionGUIAdaptor.prototype._strictValidate = function(modelValue)
{
	if(this.m_reevaluateValidity)
	{
		var enteredValue = this.m_value;

		// Attempt to match entered value
//		var matches = this._getExactMatchesFromDOM(enteredValue);
		var matches = this._getMatchesForKeyFromDOM(enteredValue);
		this.m_usingListEntry = true;
		
		if(0 == matches.length)
		{
			// No matches found for entered value
			// Set flag to indicate that value entered was not in the list
			this.m_usingListEntry = false;
		}
		
		this.m_reevaluateValidity = false;
	}

	if(this.m_usingListEntry)
	{
		return null;
	}
	else
	{
		var ec = ErrorCode.getErrorCode('InvalidFieldLength');
		ec.m_message = "Field value not in source data";
		return ec;
	}
}


AutocompletionGUIAdaptor.prototype.retrieve = function(event)
{
	this.m_reevaluateValidity = true;

	var db = this.dataBinding;
	if(null != db)
	{
		var mV = FormController.getInstance().getDataModel().getValue(db);
		var dV = this.invokeTransformToDisplay(mV);
		
		var valueChanged = this._setValue(dV);

		// If the value changed during this repaint cycle keep track of it.
		if(!this.m_valueChanged) this.m_valueChanged = valueChanged;

		if(valueChanged)
		{
			// this is to solve D255 because getValueFromView checks the selected match which
			// isn't overwritten by setting the internal value in m_value
			this.m_renderer.resetSelectedMatch();
			
			// Trigger a StateChangeEvent if the value has changed
			var e = StateChangeEvent.create(StateChangeEvent.VALUE_TYPE, dV, this);
			this.changeAdaptorState(e);
		}
		return valueChanged;
	}
	else
	{
		throw new DataBindingError("DataBindingProtocol.retrieve(), no dataBinding specified for adaptor id = " + this.getId());
	}
}


AutocompletionGUIAdaptor.prototype.retrieveSrcData = function(event)
{
	if(AutocompletionGUIAdaptor.m_logger.isInfo())
	{
		AutocompletionGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.retrieveSrcData()");
	}
	
	// Trigger a StateChangeEvent if the srcData has changed
	// ToDo: this should take into account deltas
	var e = StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE, null, this);
	this.changeAdaptorState(e);
	
	// Ensure that matches are re-evaluated.
	this.m_match = null;
	
	// Notify the renderer that the data has changed.
	this.m_renderer.dataUpdate();

	// Cause displayed value to be updated during renderState
	this.m_valueChanged = true;
	
	// Need to re-evaluate our validity state in strictValidationMode
	this.m_reevaluateValidity = true;

	// State has changed, so we need to be refreshed so return true.
	return true;
}


/**
 * Get the element to set focus on. For the autocomplete this
 * is the input text field
 */
AutocompletionGUIAdaptor.prototype.getFocusElement = function()
{
	return this.m_renderer.getInputElement();
}

/**
 * Method looks for case insensitive match for key.
 *
*/
AutocompletionGUIAdaptor.prototype._getCaseInsensitiveExactMatchForKeyFromDOM = function(keyMatch)
{
    var upperCaseKeyMatch = keyMatch.toUpperCase();
    
    var predicateKeyMatchString = Services.xPathToConcat(upperCaseKeyMatch);
    
    var matchKeyXPath = "[" + 
                        this._translateXPathValueToUpperCase(this.keyXPath) + 
                        " = " +
                        predicateKeyMatchString +
                        "]"; 
                          
    return this._getRowNodesFromDOM( matchKeyXPath );
}

AutocompletionGUIAdaptor.prototype._translateXPathValueToUpperCase = function(xpath)
{
	return "translate(" + xpath + ", 'abcdefghijklmnopqrstuvwxyz', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')";
}

/**
 * Override for the Validation protocol's default maximum length validation.
 * The default maximum length validation checks the model value. This can
 * cause problems for an autocomplete because the model/key value can be
 * different from the display value.
 *
 * @return Error code if maximum length exceeded otherwise null
 * @private
 */
AutocompletionGUIAdaptor.prototype._validateMaxLength = function()
{
	var ec = null;
	var value = this._getValue();

	// Get any matches for the entered value
	var matches = this._getMatchesForKeyFromDOM(value);
	
	// Only check maximum length if entered value does not match a key
	if(0 == matches.length && value != null && value.length > this.maxLength)
	{
		ec = ErrorCode.getErrorCode('FW_TEXTINPUT_InvalidFieldLength');
		ec.m_message = ec.getMessage() + this.maxLength;
	}
	
	return ec;
}

/**
 * Method called when the mouse wheel is 'rotated'.
 *
 * @param evt the event structure.
 */
AutocompletionGUIAdaptor.prototype.handleScrollMouse = function(evt)
{
    var propagateEvent = true;
    
	// Only handle mouse wheel rotate if drop down is showing
	if(this.m_renderer.m_dropDownField.isRaised())
	{		
		if(evt.wheelDelta > 0)
		{
			// Scroll up, move highlighting up one row in drop down
			this.m_renderer._selectPreviousMatch();
		}
		else
		{
			// Scroll down, move highlighting down one row in drop down		
			this.m_renderer._selectNextMatch();
		}
		
		// Prevent propagation of event to prevent scroll
		// being passed to any outer scrolling div
		propagateEvent = false;
	}
	
	return propagateEvent;
}

/**
 * Get the number of rows in the source data
 *
 * @return the number of rows in the source data
 */
AutocompletionGUIAdaptor.prototype.getSrcDataRowCount = function()
{
	return Services.countNodes(this.srcData + "/" + this.rowXPath);
}
