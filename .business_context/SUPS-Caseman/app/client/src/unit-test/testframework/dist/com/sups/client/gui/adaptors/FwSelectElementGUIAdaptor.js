//==================================================================
//
// FwSelectElementGUIAdaptor.js
//
// Class implements a multi option select component similar
// in functionality to the HTML select component.
//
//==================================================================

/**
 *
 * @constructor
 * @private
 */
function FwSelectElementGUIAdaptor() 
{
};

FwSelectElementGUIAdaptor.m_logger = new Category("FwSelectElementGUIAdaptor");
 
/**
 * FwSelectElementGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
FwSelectElementGUIAdaptor.prototype = new HTMLElementGUIAdaptor();

/**
 * Add the required protocols to the FwSelectElementGUIAdaptor
 */
GUIAdaptor._setUpProtocols('FwSelectElementGUIAdaptor'); 
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'DataBindingProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'ListSrcDataProtocol');			// Supports binding to data model
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'RecordsProtocol');				// Supports form dirty
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'EnablementProtocol');            // Supports enablement
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'FocusProtocol');                 // Supports focusing
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'FocusProtocolHTMLImpl');         // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'HelpProtocol');                  // Supports helptext
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'HelpProtocolHTMLImpl');          // Include the default HTML implementation of help
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'InitialiseProtocol');            // Supports custom initialisation
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'KeybindingProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'MandatoryProtocol');            // Supports mandatory
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'NameProtocol');                  // Supports naming of the element
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'ReadOnlyProtocol');            // Supports keybinding
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'TemporaryProtocol');             // Supports temporary behaviour
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'ValidationProtocol');            // Supports validation protocol
GUIAdaptor._addProtocol('FwSelectElementGUIAdaptor', 'MouseWheelBindingProtocol');	   // Supports mouse wheel scrolling

FwSelectElementGUIAdaptor.CLICK_MODE = "onClickMode";
FwSelectElementGUIAdaptor.DBL_CLICK_MODE = "onDblClickMode";

FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE = "loseFocusMode";
FwSelectElementGUIAdaptor.ON_CHANGE_MODE = "onChangeMode";

/**
 * Set the constructor property after setting up protocols
 */
FwSelectElementGUIAdaptor.prototype.constructor = FwSelectElementGUIAdaptor;

/**
 * Array containing current data for select
 *
*/
FwSelectElementGUIAdaptor.prototype.m_selectDataRows = null;

/**
 * Boolean flag indicating whether select uses hardcoded
 * options or data from client side data model
 *
*/
FwSelectElementGUIAdaptor.prototype.m_hardcodedOptions = false;

/**
 * String storing value to display when no value selected
 *
*/
FwSelectElementGUIAdaptor.prototype.nullDisplayValue = null;

/**
 * String storing select element selection mode
 *
*/
FwSelectElementGUIAdaptor.prototype.m_selectionMode = null;

/**
 * String storing update mode for select element
 *
*/
FwSelectElementGUIAdaptor.prototype.m_updateMode = null;

/**
 * Create a new FwSelectElementGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new FwSelectElementGUIAdaptor
 * @type FwSelectElementGUIAdaptor
 */
FwSelectElementGUIAdaptor.create = function(element)
{
	if (FwSelectElementGUIAdaptor.m_logger.isTrace())
	{
		FwSelectElementGUIAdaptor.m_logger.trace("FwSelectElementGUIAdaptor.create");
	}
	var a = new FwSelectElementGUIAdaptor();
	a._initFwSelectElementGUIAdaptor(element);
	return a;
}

/**
 * Initialises the instance (called from creation)
 *
 * @param element the element to manage
 */
FwSelectElementGUIAdaptor.prototype._initFwSelectElementGUIAdaptor = function(element)
{
	this.m_element = element;
	this.m_renderer = element.__renderer;
	
	// Break circular reference associated with renderer
	element.__renderer = null;
	
	fc_assert(this.m_renderer != null, "FwSelectElementGUIAdaptor._initFwSelectElementGUIAdaptor(): the renderer is not defined!");

	// GUIAdaptor acts as the model for the FwSelectElementRenderer.
	this.m_renderer.setModel(this);
	
	// Check renderer for presence of hard coded options
	var hardcodedOptions = this.m_renderer.getHardcodedOptions();
	
	if(null != hardcodedOptions)
	{
	    this.m_hardcodedOptions = true;
	    
	    // Load hard coded options
	    this.m_selectDataRows = this._getAllRowsFromHardcodedOptions( hardcodedOptions );
	}
	
	var thisObj = this;
	this.m_renderer.addValueChangeListener(function(){thisObj._valueChangeCallback()});	
}


/**
 * Disposes of all resources (event handlers and references to renderer)
 */
FwSelectElementGUIAdaptor.prototype._dispose = function()
{
	this.m_renderer.dispose();
	this.m_renderer = null;
	
	this.m_selectDataRows = null;
	this.m_element = null;
}

/*
 * Override the ReadOnlyProtocol version to start and stop the appropriate
 * event handlers, before calling the parent version
 */
FwSelectElementGUIAdaptor.prototype.setReadOnly = function(readOnly)
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
  return ReadOnlyProtocol.prototype.setReadOnly.call(this ,readOnly);
}

/**
 * Method returns current number of select options.
 *
*/
FwSelectElementGUIAdaptor.prototype.getNumberOfSelectRows = function()
{   
    return (this.m_selectDataRows == null) ? 0 : this.m_selectDataRows.length;
}

/**
 * Method returns flag indicating whether or not select options
 * are currently loaded.
 *
*/
FwSelectElementGUIAdaptor.prototype.selectOptionsLoaded = function()
{
    return this.getNumberOfSelectRows() > 0;
}

/**
 * Method checks whether key associated with current match is submissible.
 *
*/
FwSelectElementGUIAdaptor.prototype.isKeyForMatchSubmissible = function(matchNumber)
{
	var key = this.getKeyForMatch(matchNumber);
	var isSubmissible = this.getAggregateState().isKeySubmissible(key);
	if (FwSelectElementGUIAdaptor.m_logger.isTrace()) FwSelectElementGUIAdaptor.m_logger.trace("FwSelectElementGUIAdaptor.isKeyForMatchSubmissible() key=" + key + ", isSubmissible=" + isSubmissible);
	return isSubmissible;
}

/**
 * Return key value associated with row number.
 *
 * @param matchNumber The currently selected row on the renderer.
 *
*/
FwSelectElementGUIAdaptor.prototype.getKeyForMatch = function(matchNumber)
{
    var keyValue = null;
    
    if(this.selectOptionsLoaded())
    {
	    var match = this.m_selectDataRows[matchNumber];
	    keyValue = match.getKey();
	}

	return keyValue == null ? "" : keyValue;
}

/**
 * Return display value associated with row number.
 *
 * @param matchNumber The currently selected row on the renderer.
 *
*/
FwSelectElementGUIAdaptor.prototype.getMatch = function(matchNumber)
{
    var match = null;
    
    if(this.selectOptionsLoaded())
    {
	    match = this.m_selectDataRows[matchNumber];
	}

	return match == null ? "" : match.getDisplay();
}

/**
 * Method returns all rows associated with select from data model.
 *
*/
FwSelectElementGUIAdaptor.prototype._getAllRowNodesFromDOM = function()
{
    // Use row XPath to retrieve all data from DOM
    var xpath = this._getRowXPath();
    
    var nodeArray = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(xpath);
    
    // Generate array of select element entries
    var selectElementArray = nodeArray;
    
    if(nodeArray != null && nodeArray.length > 0)
    {
        selectElementArray = new Array(nodeArray.length);
        
        for(var i = 0, l = nodeArray.length; i < l; i++)
        {
            selectElementArray[i] = this._createSelectElementArrayEntry( nodeArray[i] );
        }
        
        if(null != this.comparator)
        {
            
            this._sortArray( selectElementArray );
                                                    
        }
        
        // Add nothing selected value
        selectElementArray = this._addNothingSelected( selectElementArray );
        
    }
    
    return selectElementArray;
}

FwSelectElementGUIAdaptor.prototype._sortArray = function(array)
{
    var comparatorFn = this.comparator;
    
    array.sort( function( a, b ) {
                                     var aValue = a.getDisplay();
                                     var bValue = b.getDisplay();
                                     
                                     return comparatorFn( aValue, bValue );
                                 } );
}

FwSelectElementGUIAdaptor.prototype._valueChangeCallback = function()
{
	if(FwSelectElementGUIAdaptor.m_logger.isDebug())
	{
		FwSelectElementGUIAdaptor.m_logger.debug("FwSelectElementGUIAdaptor._valueChangeCallback()");
	}
	 
	if(this.m_updateMode == FwSelectElementGUIAdaptor.ON_CHANGE_MODE)
	{   
	    this.update();
    }
}

/**
 * Get value to be stored in data model using current displayed value
 *
 * @return the value of the component, usually a string but it could be a complicated multi-value
*/
FwSelectElementGUIAdaptor.prototype._getValueFromView = function()
{	
	var selectedRow = null;
	var returnValue = null;
	
	// First attempt to retrieve selected row number from renderer
	var selectedRowNo = this.m_renderer.getSelectedMatch();
	
	if(null == selectedRowNo)
	{
	    // Renderer value may be set to null for defect 255 (see
	    // retrieve method). If so search for row number in source
	    // data.
	    selectedRowNo = this.getRowNoFromDisplayValue(this.m_renderer.getTextFieldValue());
	}
	
	if(null != selectedRowNo && this.selectOptionsLoaded())
	{
		selectedRow = this.m_selectDataRows[selectedRowNo];
	}
	
	if(null == selectedRow)
	{
		// Get the value entered into the field and use this.
		returnValue = this.m_renderer.getTextFieldValue();
	}
	else
	{
		// Get the key for the selected row
		returnValue = selectedRow.getKey();
	}
	
	return returnValue;
}

FwSelectElementGUIAdaptor.prototype.onBlur = function()
{
    if(this.m_updateMode == FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE)
    {
	    this.update();
	}
}


/**
 * Renders the visual state and event handlers for this
 * adaptor based on its current state
 */
FwSelectElementGUIAdaptor.prototype.renderState = function()
{   
	if(this.m_focusChanged)
	{
		// Reset this immediately so that we don't end up recursing through this again
		this.m_focusChanged = false;

		if(!this.m_focus)
		{
			// Hide the drop down when the focus is lost
			this.m_renderer.m_dropDownField.hideDropDown();
		}
	}
	else
	{
	    if(this.m_valueChanged)
	    {
	        if(this.m_updateMode == FwSelectElementGUIAdaptor.ON_CHANGE_MODE && this.m_focus)
	        {
	            // Similar to defect 927 for the DataPicker we must update status bar
	            // message when select component has focus.
	            FormController.getInstance().getFormAdaptor()._setCurrentFocusedField(this);
	        }
	    }
	}

	if(this.m_valueChanged)
	{
	    // Update renderer display   
		this._refreshDisplayedValue();
		
		this.m_valueChanged = false;
	}
	
	// Set default selection first time render state
	// with select options loaded
	if(this.m_value == null &&
	   this.selectOptionsLoaded() &&
	   this.m_renderer.getSelectedMatch() == null)
	{
	    this.m_renderer.setSelectedRow(0);
	    
	    this.m_renderer.setValue(this.m_selectDataRows[0].getDisplay());
	    
	    if(this.m_hardcodedOptions)
	    {   
	        // If options are hard coded update data model because
	        // default key value may not be a blank string.
	        this.update();
	    }
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

/**
 * Method sets value displayed on renderer based on current adaptor
 * value.
 *
 */
FwSelectElementGUIAdaptor.prototype._refreshDisplayedValue = function()
{
	// Value defaults to the key value
	var val = this.m_value;
	
	// Note rowNo may be null when either
	
	//  i) The value stored in the adaptor does not match one of the option keys
    //     (this may occur if the source data is changed)
    
    //  or
    
    //  ii) Render state is executed before the adaptor's data has been loaded
    
	var rowNo = this._getRowNoFromKey(val);
	    
	var currentSelectedRow = this.m_renderer.getSelectedMatch();
	    
	if(null == rowNo)
	{
	    // Adaptor value does not match an option key.
	        
	    // Defect 973. Display invalid value.
	    if(null != currentSelectedRow)
	    {
	        this.m_renderer.resetSelectedMatch();
	    }
	}
	else
	{
	    // Selected row has changed probably owing to
	    // change in source data
	    this.m_renderer.setSelectedRow(rowNo);
	            
	    val = this.m_selectDataRows[rowNo].getDisplay();    
	}

	// Write the value to the view
	this.m_renderer.setValue(val);
}

/**
 * Configure the select adaptor.
 * 
 */
FwSelectElementGUIAdaptor.prototype._configure = function(cs)
{	
	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		if(!this.m_hardcodedOptions)
		{
		    if(c.displayXPath && this.m_displayXPath == null)
		    {
			    this.m_displayXPath = XPathUtils.removeLeadingSlash(c.displayXPath);
		    }
		}
		
		if(null != c.selectionMode && this.m_selectionMode == null) 
		{
			this.m_selectionMode = c.selectionMode;
	    }
	    
	    if(null != c.updateMode && this.m_updateMode == null)
	    {
	        this.m_updateMode = c.updateMode;
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
		
		if(null != c.nullDisplayValue && this.nullDisplayValue == null)
		{
		    this.nullDisplayValue = c.nullDisplayValue;
		}
		
	}
	
	// Determine selection mode
	if(null != this.m_selectionMode)
	{
	    if(this.m_selectionMode != FwSelectElementGUIAdaptor.CLICK_MODE && 
		   this.m_selectionMode != FwSelectElementGUIAdaptor.DBL_CLICK_MODE)
		{
		    if(FwSelectElementGUIAdaptor.m_logger.isError())
			{
	            FwSelectElementGUIAdaptor.m_logger.error("FwSelectElementGUIAdaptor._configure() unknown selectionMode in configuration for adaptor id=" + this.getId() + ", reverting to default of FwSelectElementGUIAdaptor.CLICK_MODE");
	        }
			
			this.m_selectionMode = FwSelectElementGUIAdaptor.CLICK_MODE;
		}
		
	}
	else
	{
	    this.m_selectionMode = FwSelectElementGUIAdaptor.CLICK_MODE;
	}
	
	// Determine update mode
	if(null != this.m_updateMode)
	{
	    if(this.m_updateMode != FwSelectElementGUIAdaptor.LOSE_FOCUS_MODE &&
	       this.m_updateMode != FwSelectElementGUIAdaptor.ON_CHANGE_MODE)
	    {
	        if(FwSelectElementGUIAdaptor.m_logger.isError())
			{
	            FwSelectElementGUIAdaptor.m_logger.error("FwSelectElementGUIAdaptor._configure() unknown updateMode in configuration for adaptor id=" + this.getId() + ", reverting to default of FwSelectElementGUIAdaptor.ON_CHANGE_MODE");
	        }
	        
	        this.m_updateMode = FwSelectElementGUIAdaptor.ON_CHANGE_MODE;
	    }
	    
	}
	else
	{
	    this.m_updateMode = FwSelectElementGUIAdaptor.ON_CHANGE_MODE;
	}
	
	// Set default value for nothing selected
	if(null == this.nullDisplayValue)
	{
	    this.nullDisplayValue = "";
	}
	
	if(!this.m_hardcodedOptions)
	{
	    // Check state of configuration 
	    this._checkConfiguration();
	
	    // Append displayValue xpaths to set of xpaths which trigger a refresh of source data
	    var displayXPaths = this.getRowXPathArrayWithSuffix()
	    this.srcDataOn = (null == this.srcDataOn) ? displayXPaths : this.srcDataOn.concat(displayXPaths);
	    
	    // Set up adaptor to run validate if source data changes
	    if(null != this.validateOn)
	    {
	        this.validateOn = this.validateOn.concat(this.srcDataOn);
	    }
	    else
	    {
	        this.validateOn = this.srcDataOn;
	    }
	    
	}
	
}

FwSelectElementGUIAdaptor.prototype._checkConfiguration = function()
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

	// Row is optionaly configured and derived from srcData if null
	if(null != this.rowXPath)
	{
	    if(this.rowXPath.indexOf('/') == 0)
	    {
	        this.m_absoluteRowXPath = this.srcData + this.rowXPath;
	    }
	    else
	    {   
	        this.m_absoluteRowXPath = this.srcData + '/' + this.rowXPath;
	    }
	}
	else
	{
	    this.m_absoluteRowXPath = this.srcData;
	}
	
	// displayXPath is optionally configured and derived from key if null
	this.m_displayXPath = this.m_displayXPath != null ? this.m_displayXPath : this.keyXPath;
	
	if(this.m_displayXPath.indexOf('/') == 0)
	{
	    this.m_absoluteDisplayXPath = this.m_absoluteRowXPath + this.m_displayXPath;
	}
	else
	{
	    this.m_absoluteDisplayXPath = this.m_absoluteRowXPath + '/' + this.m_displayXPath;
	}

	this.srcDataOn[this.srcDataOn.length] = this.m_absoluteDisplayXPath;
}


FwSelectElementGUIAdaptor.prototype.retrieve = function(event)
{
	var db = this.dataBinding;
	if(null != db)
	{
		var mV = FormController.getInstance().getDataModel().getValue(db);
		
		// Should we really be doing this? Use transform to display to
		// convert data for display but here we are setting selected value
		// on adaptor based on key.
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


FwSelectElementGUIAdaptor.prototype.retrieveSrcData = function(event)
{
	if(FwSelectElementGUIAdaptor.m_logger.isInfo())
	{
		FwSelectElementGUIAdaptor.m_logger.info(this.getId() + ":SelectElementGUIAdaptor.retrieveSrcData()");
	}
	
	// Trigger a StateChangeEvent if the srcData has changed
	// ToDo: this should take into account deltas
	var e = StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE, null, this);
	this.changeAdaptorState(e);
	
	var changed = false;
	
	if(!this.m_hardcodedOptions)
	{
	    // State has changed, so ensure view refreshed
	    changed = true;
	    
	    // Retrieve data from data model
	    this.m_selectDataRows = this._getAllRowNodesFromDOM();
	
	    // Notify the renderer that the data has changed.
	    this.m_renderer.dataUpdate();

	    // Cause displayed value to be updated during renderState
	    this.m_valueChanged = true;
	}
	
	return changed;
}

/**
 * Method provides a dedicated validate method for the framework select
 * component.
 *
 * @param event Detail describing data model event which caused validate to execute.
 *
 * @return Returns null if valid or an error code instance if not.
 *
 */
FwSelectElementGUIAdaptor.prototype.validate = function( event )
{
    var ec = null;
    
    // Look up current adaptor key value in source data
    var rowNo = this._getRowNoFromKey(this.m_value);
    
    if(null == rowNo)
    {
        // Current value is not in source data
        ec = ErrorCode.getErrorCode( "FW_FWSELECT_InvalidKey" );
    }
    
    return ec;
}

/**
 * Get the element to set focus on. For the framework select this
 * is the input text field
 */
FwSelectElementGUIAdaptor.prototype.getFocusElement = function()
{
	return this.m_renderer.getInputElement();
}

/**
 * Method converts a select entry node retrieved from
 * the data model into the format used to store select
 * entries for interaction with the select element
 * renderer.
 *
 * @param node Node retrieved from data model data for select.
*/
FwSelectElementGUIAdaptor.prototype._createSelectElementArrayEntry = function( node )
{
    var keyNode;
    var keyValue;
    var displayNode;
    var displaySrcValue;
    var displayValue;
    var upperCaseDisplayValue;
    
    // Extract key value
    
    keyNode = node.selectSingleNode(this.keyXPath);
    
    if(null != keyNode)
    {
        keyValue = XML.getNodeTextContent(keyNode);
    }
    else
    {
        keyValue = null;
    }
    
    // Extract display value and determine upper case value
    displayNode = node.selectSingleNode(this.m_displayXPath);
    
    if(null != displayNode)
    {
        displaySrcValue = XML.getNodeTextContent(displayNode);
        displayValue = this.invokeTransformToDisplay(displaySrcValue);
        upperCaseDisplayValue = this._convertToUpperCase( displayValue );
    }
    else
    {
        if(this.m_displayXPath != this.keyXPath)
        {
            displaySrcValue = "";
            displayValue = this.invokeTransformToDisplay(displaySrcValue);
            upperCaseDisplayValue = this._convertToUpperCase( displayValue );
        }
        else
        {
            // Display XPaths not used, display uses key value
            displaySrcValue = keyValue;
            displayValue = this.invokeTransformToDisplay(displaySrcValue);
            upperCaseDisplayValue = this._convertToUpperCase( displayValue );
        }
            
    }
    
    return new FwSelectElementArrayEntry( keyValue,
                                          displayValue,
                                          upperCaseDisplayValue );
}

/**
 * Method adds default "nothing selected" value to array
 * of entries for select.
 *
*/
FwSelectElementGUIAdaptor.prototype._addNothingSelected = function( selectElementArray )
{
    var newArray = Array( selectElementArray.length + 1 );
    
    var nothingSelectedValue = this.nullDisplayValue;
    
    var upperCaseValue = this._convertToUpperCase( nothingSelectedValue );
    
    newArray[0] = new FwSelectElementArrayEntry( "", 
                                                 nothingSelectedValue,
                                                 upperCaseValue );
                                                 
    if(selectElementArray.length > 0)
    {
        for( var i = 0, l = selectElementArray.length; i < l; i++ )
        {
            newArray[ i + 1 ] = selectElementArray[ i ];
        }
    }
    
    return newArray; 
}

/**
 * Method returns row number for given key value.
 *
*/
FwSelectElementGUIAdaptor.prototype._getRowNoFromKey = function(keyValue)
{
    var returnValue = null;
    
    if(this.selectOptionsLoaded() && null != keyValue)
    {
        var selectArrayEntry = null;
        
        for(var i = 0, l = this.m_selectDataRows.length; i < l; i++)
        {
            selectArrayEntry = this.m_selectDataRows[i];
            
            // Note, custom retrieve method transforms key value
            // using invokeTransformToDisplay such that value stored
            // in adaptor is transformed value.
            if(keyValue == this.invokeTransformToDisplay( selectArrayEntry.getKey() ))
            {
                returnValue = i;
                break;
            }
        }
        
    }
    
    return returnValue;
}

/**
 * Method returns row number for given display value.
 *
*/
FwSelectElementGUIAdaptor.prototype.getRowNoFromDisplayValue = function(displayValue)
{
    var returnValue = null;
    
    if(this.selectOptionsLoaded() && null != displayValue)
    {
        var selectArrayEntry = null;
        
        for(var i = 0, l = this.m_selectDataRows.length; i < l; i++)
        {
            selectArrayEntry = this.m_selectDataRows[i];
            
            if(displayValue == selectArrayEntry.getDisplay())
            {
                returnValue = i;
                break;
            }
        }
        
    }
    
    return returnValue;
}

/**
 * Method loads source data for adaptor from array of hard coded options
 * passed as an argument into the corresponding renderer instance.
 *
 * @param hardcodedOptions Array of objects defining select options.
 *
*/
FwSelectElementGUIAdaptor.prototype._getAllRowsFromHardcodedOptions = function(hardcodedOptions)
{
    var selectElementArray = hardcodedOptions;
    
    var length = hardcodedOptions.length;
    
    if(length > 0)
    {
        selectElementArray = new Array(length);
        
        for(var i = 0; i < length; i++)
        {
            selectElementArray[i] = this._createArrayEntryFromHardcodedOption( hardcodedOptions[i] );
        }
        
        if(null != this.comparator)
        {
            this._sortArray( selectElementArray );
        }
    }
    
    return selectElementArray;
}

/**
 * Method creates an instance of the class FwSelectElementArrayEntry from
 * a hard coded select option object.
 *
*/
FwSelectElementGUIAdaptor.prototype._createArrayEntryFromHardcodedOption = function( hardcodedOption )
{
    // Determine key value
    
    var keyValue;
    
    if(null == hardcodedOption[ "key" ])
    {
        throw new ConfigurationException( "Hard coded select option for select '" +
                                          this.getId() +
                                          "'\n does not define value for key" );
    }
    else
    {
        keyValue = hardcodedOption[ "key" ];
    }
    
    // Determine display value
    
    var displaySrcValue = hardcodedOption[ "display" ];
    
    if(null == displaySrcValue)
    {
        displaySrcValue = keyValue;
    }
    
    var displayValue = this.invokeTransformToDisplay( displaySrcValue );
    
    var upperCaseDisplayValue = this._convertToUpperCase( displayValue );
    
    return new FwSelectElementArrayEntry( keyValue,
                                          displayValue,
                                          upperCaseDisplayValue );
} 

FwSelectElementGUIAdaptor.prototype._convertToUpperCase = function(value)
{
    var upperCaseValue;
    
    if(value != "")
    {
        upperCaseValue = value.toUpperCase();
    }
    else
    {
        upperCaseValue = "";
    }
    
    return upperCaseValue;
    
}

FwSelectElementGUIAdaptor.prototype.areOptionsHardcoded = function()
{
    return this.m_hardcodedOptions;
}

FwSelectElementGUIAdaptor.prototype.matchFirstCharacter = function(firstChar)
{
    var matchedRow = null;
    
    var upperCaseFirstChar = firstChar.toUpperCase();
    
    var selectedDataRows = this.m_selectDataRows;
    
    if(null != selectedDataRows)
    {
    
        // Search array for matches to first character
        var selectArrayEntry;
        var upperCaseDisplayValue;
    
        var selectDataRowsLength = selectedDataRows.length;
        var matchedEntries = new Array();
    
        for( var i = 0; i < selectDataRowsLength; i++)
        {
            selectArrayEntry = selectedDataRows[i];
            
            upperCaseDisplayValue = selectArrayEntry.getUpperCaseDisplay();
            
            if(upperCaseFirstChar == upperCaseDisplayValue.charAt(0))
            {
                matchedEntries[matchedEntries.length] = selectArrayEntry;
                matchedEntries[matchedEntries.length - 1]["index"] = i;
            }
        }
        
        var matchedEntriesLength = matchedEntries.length;
        
        if(matchedEntriesLength > 0)
        {
            var currentTextFieldValue = this.m_renderer.getTextFieldValue();
            
            var currentPosition = null;
            var entryDisplayValue = null;
            
            for( var j = 0; j < matchedEntriesLength; j++ )
            {
                entryDisplayValue = matchedEntries[j].getDisplay();
                
                if(entryDisplayValue == currentTextFieldValue)
                {
                    currentPosition = j;
                    break;
                }
            }
            
            if(null == currentPosition)
            {
                // Use first match
                matchedRow = matchedEntries[0]["index"];
            }
            else
            {
                // If more than one match move to next match
                if(matchedEntriesLength > 1)
                {
                    currentPosition += 1;
                    
                    if(currentPosition > matchedEntriesLength - 1)
                    {
                        currentPosition = 0;
                    }
                    
                    matchedRow = matchedEntries[currentPosition]["index"];
                }
                
            }
            
        } // Matched entries > 0
        
    }
    
    return matchedRow;
    
}

/**
 * Method called when the mouse wheel is 'rotated'.
 *
 * @param evt the event structure.
 */
FwSelectElementGUIAdaptor.prototype.handleScrollMouse = function(evt)
{
	if(evt.wheelDelta > 0)
	{
		// Scroll up, move highlighting up one row in drop down
		this.m_renderer._selectPreviousOption();
	}
	else
	{
		// Scroll down, move highlighting down one row in drop down		
		this.m_renderer._selectNextOption();
	}
}

/**
 * Method initialise is called when initialising adaptor states in
 * the second phase of form initialisation. As such it is a good
 * time to create the contents of framework select components
 * with hard coded select lists because any associated style
 * sheets will have been loaded.
 *
 * For framework select components with source data in the client side DOM
 * the drop down contents are created in the method retrieveSrcData. 
*/
FwSelectElementGUIAdaptor.prototype.initialise = function()
{
    if(this.m_hardcodedOptions)
    {
        // Create contents of framework select drop down
        this.m_renderer._createDynamicDropDownContent();
    }
}

/**
 * Class used to store entries in select element array
 *
*/
function FwSelectElementArrayEntry( key, display, upperCaseDisplay )
{
    this.m_key = key;
    this.m_display = display;
    this.m_upperCaseDisplay = upperCaseDisplay;
}

FwSelectElementArrayEntry.prototype.getKey = function()
{
    return this.m_key;
}

FwSelectElementArrayEntry.prototype.getDisplay = function()
{
    return this.m_display;
}

FwSelectElementArrayEntry.prototype.getUpperCaseDisplay = function()
{
    return this.m_upperCaseDisplay;
}
