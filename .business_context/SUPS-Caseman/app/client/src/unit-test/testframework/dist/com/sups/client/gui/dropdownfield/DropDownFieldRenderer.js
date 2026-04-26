//==================================================================
//
// DropDownFieldRenderer.js
//
// Implementation of DropDownField rendering class. This is a base
// class for components which consist of a text field and an
// associated button which displays some sort of drop down.
//
// 27/02/06 Functionality modified such that the input text
// field may be read only. This is required when the drop
// down field is a component of the framework select
// element.
//==================================================================



function DropDownFieldRenderer()
{
}

DropDownFieldRenderer.m_logger = new Category("DropDownFieldRenderer");

/**
 * The main container element for the component
 *
 * @type HTMLDivElement
 * @private
 */
DropDownFieldRenderer.prototype.m_element = null;


/**
 * The input field for the component
 *
 * @type HTMLInputElement
 * @private
 */
DropDownFieldRenderer.prototype.m_inputField = null;


/**
 * The popup layer used to help display the dropdown
 *
 * @type PopupLayer
 * @private
 */
DropDownFieldRenderer.prototype.m_popupLayer = null;


/**
 * The button which raises the dropdown for the component
 *
 * @type HTMLDivElement
 * @private
 */
DropDownFieldRenderer.prototype.m_button = null;


/**
 * The dropdown html div element
 *
 * @type HTMLDivElement
 * @private
 */
DropDownFieldRenderer.prototype.m_dropdown = null;


/**
 * Key to the click handler created when the dropdown is raised
 *
 * @type SUPSEventKey
 * @private
 */
DropDownFieldRenderer.prototype.m_clickEventKey = null;

/**
 * Key to click handler assigned to dropdown input field
 * when dropdown is operating in read only mode.
 *
 * @type SUPSEventKey
 * @private
*/
DropDownFieldRenderer.prototype.m_inputFieldClickEventKey = null;


/**
 * Flag to indiciate whether or not the drop down is rendered
 * above the field (true) or below it (false), or not at all (null).
 *
 * @type SUPSEventKey
 * @private
 */
DropDownFieldRenderer.prototype.m_dropDownPosition = null;


/**
 * Flag to indicate whether or not the drop down is capturing
 * mouse events. Only applicable in Internet explorer
 */
DropDownFieldRenderer.prototype.m_hasMouseCapture = false;


/**
 * Flag to indicate if the field is disabled or not
 *
 * @private
 * @type boolean
 */
DropDownFieldRenderer.prototype.m_disabled = false;


/**
 * Flag to indicate if the field is focussed or not
 *
 * @private
 * @type boolean
 */
DropDownFieldRenderer.prototype.m_focussed = false;


/**
 * Flag to indicate if the field is mandatory or not
 *
 * @private
 * @type boolean
 */
DropDownFieldRenderer.prototype.m_mandatory = false;


/**
 * Flag to indicate if the field is invalid or not
 *
 * @private
 * @type boolean
 */
DropDownFieldRenderer.prototype.m_invalid = false;


/**
 * Flag to indicate if the field is readonly or not
 *
 * @private
 * @type boolean
 */
DropDownFieldRenderer.prototype.m_readonly = false;


/**
 * CSS class for the dropdown container
 *
 * @type String
 */
DropDownFieldRenderer.CSS_CLASS_NAME = "dropdown_container";
DropDownFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME = "dropdown_table_border";
DropDownFieldRenderer.INPUT_FIELD_CSS_CLASS_NAME = "dropdown_field";


/**
 * Key to the keypress event handler which lowers the drop down
 * on a tab key press
 *
 * @type SUPSEventKey
 * @private
 */
DropDownFieldRenderer.prototype.m_keyEventHandlerKey = null;


/**
 * List of listeners interested in being notified when the
 * drop down is raised or lowered
 *
 * @type CallbackList
 * @private
 */
DropDownFieldRenderer.prototype.m_showHideListeners = null;

/**
 * Instance member indicating whether, or not, the input
 * text field should be read only.
 *
 * @type boolean
 * @private
 *
*/
DropDownFieldRenderer.prototype.m_inputFieldReadOnly = false;

/**
 * Create the drop down field as a child of another element
 *
 * @param p the parent element to create the child under
 * @param inputFieldReadOnly Boolean flag indicating, whether
 *                           or not, the input text field should
 *                           be read only. Default value will be
 *                           "false".
 * @return a new DropDownFieldRenderer instance
 * @type DropDownFieldRenderer
 */
DropDownFieldRenderer.createAsChild = function(p, inputFieldReadOnly)
{
	// Create the outer button element
	var e = document.createElement("div");
	  
	// Append the dropdown field to it's parent element
	p.appendChild(e);

	// Create the rest of the dropdown field
	return DropDownFieldRenderer._create(e, inputFieldReadOnly);
}


/**
 * Create the dropdown field.
 *
 * The html (with additional whitespace for clarity) for a dropdown is:
 *
 *  <div class="dropdown_container">
 *   <div>
 *    <table class="dropdown_table" cellspacing="0px" cellpadding="0px">
 *      <tbody>
 *        <tr>
 *          <td class="dropdown_field_container">
 *            <input class="dropdown_field" />
 *          </td>
 *          <td class="dropdown_button_container">
 *            <div class="button" onclick="showDropDown('dropdown2')"></div>
 *          </td>
 *        </tr>
 *      </tbody>
 *    </table>
 *   </div>
 *   <div class="dropdown"></div>
 *  </div>
 *
 * The additional whitespace must not be included! Styling is
 * provided by the associated DropDownField.css
 */
DropDownFieldRenderer._create = function(e, inputFieldReadOnly)
{
	var f = new DropDownFieldRenderer();
	
	if(inputFieldReadOnly == true)
	{
	    f.m_inputFieldReadOnly = true;
	}

	// Keep hold of the div element
	f.m_element = e;

	f.m_element.className = DropDownFieldRenderer.CSS_CLASS_NAME;

	// D695 - Table borders in IE cause problems when subforms are closed.
	// Use a div surrounding the table as a border
	f.m_borderDiv = document.createElement("div");
	f.m_borderDiv.className = DropDownFieldRenderer.TABLE_BORDER_CSS_CLASS_NAME;
	f.m_element.appendChild(f.m_borderDiv);

	var table = document.createElement("table");
	table.className = "dropdown_table";
	
	// Ideally these attributes could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");
	
	// Add the table to the container.
	f.m_borderDiv.appendChild(table);
	
	// Create table body
	var tbody = document.createElement("tbody");
	table.appendChild(tbody);
	
	// Create table row
	var tr = document.createElement("tr");
	tbody.appendChild(tr);
	
	// Create table cell which will contain the input field
	var inputFieldCell = document.createElement("td");
	inputFieldCell.className = "dropdown_field_container";
	tr.appendChild(inputFieldCell);
	
	// Create table cell which will contain the button
	var buttonCell = document.createElement("td");
	buttonCell.className = "dropdown_button_container";
	tr.appendChild(buttonCell);
	
	// Create input text field for drop down
	f.m_inputField = document.createElement("input");
	f.m_inputField.setAttribute("type", "text");
	f.m_inputField.className = DropDownFieldRenderer.INPUT_FIELD_CSS_CLASS_NAME;

	var parentId = e.parentNode.id;
	if(null != parentId && "" != parentId)
	{
		f.m_inputField.id = parentId + "_input";
	}
	
	if(f.m_inputFieldReadOnly == true)
	{
	    // Make input field read only
	    f.m_inputField.readOnly = true;
	    
	    // Prevent selection of text displayed in input field
	    preventSelection(f.m_inputField);
	}
	
	inputFieldCell.appendChild(f.m_inputField);
	
	// Create button to trigger drop down
	f.m_button = Button.createAsChild(buttonCell, null, "dropdown_button");

	// Attach the click callback
	f.m_button.addClickListener(function() {f._handleButtonClick();});

	// Create the div containing the drop down
	f.m_dropdown = document.createElement("div");
	f.m_dropdown.className = "dropdown";
	f.m_element.appendChild(f.m_dropdown);
	
	// Allow other components to be notified when the dropdown is raised or lowered
	f.m_showHideListeners = new CallbackList();

	// Start event handlers
	f.startDropDownEventHandlers();
	
	// Make a cache for the offsetSide of the parent node
	// This is a workaround for an IE bug which causes the screen to
	// flash under some circumstances when the offsetWidth is read.
	f.m_offsetWidth = 0;
	
	// Create the popuplayer used to show and hide the drop down
	f.m_popupLayer = PopupLayer.create(f.m_dropdown);
	
	return f;
}


DropDownFieldRenderer.prototype.dispose = function()
{
	// Break circular reference in HTML
	this.m_element.__renderer = null;
	this.m_guiAdaptor = null;

	// Free up the click event handler if it is still registered.
	if(null != this.m_clickEventKey)
	{
		SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);
		this.m_clickEventKey = null;
	}
	this.m_element.onlosecapture = null;

	// Stop any other event handlers
	this.stopDropDownEventHandlers();
	
	if(this.m_inputFieldReadOnly)
	{   
	    // Remove onClick handler
	    if(null != this.m_inputFieldClickEventKey)
	    {
	        SUPSEvent.removeEventHandlerKey( this.m_inputFieldClickEventKey );
	        this.m_inputFieldClickEventKey = null;
	    }
	     
	    // Remove selection prevention
	    unPreventSelection(this.m_inputField);
	}

	// Clean up the button
	this.m_button.dispose();
	
	// Get rid of listeners	
	this.m_showHideListeners.dispose();
	this.m_showHideListeners = null;

	this.m_popupLayer._dispose();
    this.m_popupLayer = null;
}


DropDownFieldRenderer.prototype.startDropDownEventHandlers = function()
{
	this.m_button.startEventHandlers();
	
	var dd = this;
	
	if(null == this.m_keyEventHandlerKey)
	{
		this.m_keyEventHandlerKey = SUPSEvent.addEventHandler(this.m_inputField, "keydown", function(evt) { dd._handleKeyEvents(evt); }, false);
	}
	
	if(this.m_inputFieldReadOnly == true)
	{
	    if(null == this.m_inputFieldClickEventKey)
	    {
	        this.m_inputFieldClickEventKey = SUPSEvent.addEventHandler( this.m_inputField,
	                                                                    "click",
	                                                                    function(){ dd._handleButtonClick(); },
	                                                                    false );
	    }
	    
	}
	
}


DropDownFieldRenderer.prototype.stopDropDownEventHandlers = function()
{
	this.m_button.stopEventHandlers();
	
	// Remove the key event handler
	if(null != this.m_keyEventHandlerKey) SUPSEvent.removeEventHandlerKey(this.m_keyEventHandlerKey);
	this.m_keyEventHandlerKey = null;
	
	if(this.m_inputFieldReadOnly == true)
	{
	    if(null != this.m_inputFieldClickEventKey)
	    {
	        SUPSEvent.removeEventHandlerKey(this.m_inputFieldClickEventKey);
	        this.m_inputFieldClickEventKey = null;
	    }
	}
	
}


DropDownFieldRenderer.prototype._handleKeyEvents = function(e)
{
	if(null == e) e = window.event;
	
	switch(e.keyCode)
	{
		case Key.Tab.m_keyCode:
		case Key.ESC.m_keyCode:
		{
			this.hideDropDown();
		}
	}
}


DropDownFieldRenderer.prototype._handleButtonClick = function()
{
	if(null == this.m_dropDownPosition)
	{
		this.showDropDown();
	}
	else
	{
		this.hideDropDown();
	}
}


/**
 * Check to see if the drop down is currently raised
 *
 * @return true if the dropdown is raised or false otherwise
 * @type Boolean
 */
DropDownFieldRenderer.prototype.isRaised = function()
{
	return (this.m_dropDownPosition != null);
}


DropDownFieldRenderer.prototype.showDropDown = function()
{
	if(null == this.m_dropDownPosition)
	{
		var above = this._getDropDownPosition(this.m_dropdown);

		// Keep this value - it is used during _render()
		this.m_dropDownPosition = above;
		
		// Set the drop down class appropriately so that it is positioned
		// with the least amount of clipping
		this.m_dropdown.className = "dropdown " + (above ? "above" : "below");
		
		var container = this.m_element;
		var dd = this;
				
		// Add event capturing event handlers. This is browser dependant
		if(container.attachEvent)
		{
			// This is Internet Explorer so do appropriate event capture
			container.setCapture(false);
			this.m_clickEventKey = SUPSEvent.addEventHandler(container, "click", function() { dd._handleClickIE(); }, false);
			container.onlosecapture = function() { dd._captureLostIE(container); return false };
			
			this.m_hasMouseCapture = true;
		}
		else if(container.addEventListener)
		{
			// This is a W3C browser so do the appropriate event capture.
			// Click events are handled during the propogation phase 
			this.m_clickEventKey = SUPSEvent.addEventHandler(window, "click", function(evt) { dd._handleClickMoz(evt); }, true);
		}
		else
		{
			alert("Unsupported browser");
		}
		
		// Set the focus on the input field
		this._focusInputField();
		
		// Render the dropdown
		this._render();
		
		// hide any selects that may be showing through our drop down
		this.m_popupLayer.show();
		
		// Invoke any listeners that are interested in the dropdown being shown.
		this.m_showHideListeners.invoke(true);
	}
}


/**
 * Handle a click event in the dropdown div element or one of its
 * children for Internet Explorer.
 */
DropDownFieldRenderer.prototype._handleClickIE = function()
{
	if(DropDownFieldRenderer.m_logger.isDebug()) DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._handleClickIE()");
	// The element where the click occurred
	var e = window.event.srcElement;
	
	// If click occurred outside of one of the child nodes of the dropdown
	// then hide the dropdown
	if(!this.m_element.contains(e))
	{
		this.m_element.releaseCapture();
	}
	else
	{
		this._focusDropDownControl(e);
	}
}


/**
 * Handle a click event in the dropdown div element or one of its
 * children for Mozillla.
 */
DropDownFieldRenderer.prototype._handleClickMoz = function(evt)
{
	if(DropDownFieldRenderer.m_logger.isDebug()) DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._handleClickMoz()");
	// The element where the click occurred
	var e = evt.target;

	// If the click didn't occur in a child element of the dropdown,
	// Close the window
	if(!this.m_element.contains(e))
	{
		// Hide the drop down
		this.hideDropDown();

		// Don't allow the event to propogate any further.
//		SUPSEvent.stopPropagation(evt);		
	}
	else
	{
		this._focusDropDownControl(e);
	}
}


/**
 * IE specific event handler to handle the loss of the event capture
 * on the dropdown element. Allows us to clean up after ourselves.
 *
 * @private
 */
DropDownFieldRenderer.prototype._captureLostIE = function()
{
	this.m_hasMouseCapture = false;
	this.hideDropDown();
	
	this.m_element.onlosecapture = null;
}


/**
 * If the HTML element is not a native HTML control,
 * move the focus back to the main input field
 *
 * @param e the element that was clicked on
 * @private
 */
DropDownFieldRenderer.prototype._focusDropDownControl = function(e)
{
	if(!this._isElementNativeControl(e))
	{
		this._focusInputField();
	}
}


/**
 * Check to see if the supplied element is a native HTML control
 *
 * @param e the element to check
 * @return true if the element is an input, select or text area element
 * @type boolean
 * @private
 */
DropDownFieldRenderer.prototype._isElementNativeControl = function(e)
{
	var nN = e.nodeName;
	return (nN == "INPUT" || nN == "SELECT" || nN == "TEXTAREA");
}


DropDownFieldRenderer.prototype.addShowHideListener = function(cb)
{
  this.m_showHideListeners.addCallback(cb);
}

/**
 * Hide the dropdown
 */
DropDownFieldRenderer.prototype.hideDropDown = function()
{
	if(null != this.m_dropDownPosition)
	{
		// Clean up event handler
		if(null != this.m_clickEventKey) SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);
		this.m_clickEventKey = null;
	
		this.m_dropDownPosition = null;
		
		// Drop down is hidden by removing the "raised" CSS class from the 
		// container's list of classes.
		this.m_element.className = this._getClassName();
	
		if(this.m_hasMouseCapture)
		{
			this.m_element.releaseCapture();
		}
	
		// restore any hidden selects to their original visibility setting
		this.m_popupLayer.hide();
		
		// Invoke any listeners that are interested in the dropdown being shown.
		this.m_showHideListeners.invoke(false);
	}
}


/**
 * Move the focus to the dropdown field's input field
 *
 * @private
 */
DropDownFieldRenderer.prototype._focusInputField = function()
{
	if (DropDownFieldRenderer.m_logger.isDebug()) DropDownFieldRenderer.m_logger.debug("DropDownFieldRenderer._focusInputField(): focussing input field");
	this.m_inputField.focus();
}


DropDownFieldRenderer.prototype._getDropDownElement = function()
{	
	return this.m_dropdown;
}


DropDownFieldRenderer.prototype._getInputFieldElement = function()
{	
	return this.m_inputField;
}


DropDownFieldRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isSubmissible, isServerValidationActive)
{
	this.m_disabled = disabled;
	this.m_focussed = focussed;
	this.m_mandatory = mandatory;
	this.m_invalid = invalid;
	this.m_serverInvalid = serverInvalid;
	this.m_readonly = readonly;
	this.m_inactive = inactive;
	this.m_isSubmissible = isSubmissible;
	this.m_isServerValidationActive = isServerValidationActive;
	
	this._render();
}

DropDownFieldRenderer.DROPDOWN_NOT_SUBMISSIBLE_CSS_CLASS = " dropdownNotSubmissible";
//SelectElementGUIAdaptor.SELECT_OPTION_SUBMISSIBLE_CSS_CLASS = "selectOptionSubmissible";
//SelectElementGUIAdaptor.SELECT_OPTION_NOT_SUBMISSIBLE_CSS_CLASS = "selectOptionNotSubmissible";

DropDownFieldRenderer.prototype._getClassName = function()
{
	var className = DropDownFieldRenderer.CSS_CLASS_NAME;

	if(this.m_disabled || this.m_inactive)
	{
		className += " disabled";
	}
	else
	{
		if(this.m_focussed)
		{
		    if(this.m_inputFieldReadOnly && !this.isRaised())
		    {
		        // Apply selection styling if dropdown has focus but
		        // not raised.
		        className += " readOnlyInputField_and_dropdown_not_raised";
		    }
		    else
		    {
			    className += " focus";
			}
		}
				
		if(this.m_guiAdaptor.hasValue())
		{
			if(this.m_invalid)
			{
				if(this.m_serverInvalid)
				{
					// If server validation in process colour text area orange. If
					// server invalid and process complete colour text area red.
					if(this.m_isServerValidationActive)
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
		
		if(this.m_readonly)
		{
			className += " readonly";
		}
		
		if(this.m_isSubmissible==false)
		{
			className += DropDownFieldRenderer.DROPDOWN_NOT_SUBMISSIBLE_CSS_CLASS;
		}
	
		// Add  "raised" CSS class to container CSS class. This has two effects:
		//  - Makes the drop down visible (see CSS selector:  .dropdown_container.raised .dropdown)
		//  - Raises the dropdown container in the z-index so that drop down appers above other
		//    elements in the documents. Note that we have to raise the _container_, not the dropdown
		//    itself, because the container has been declared with position: relative and therefore
		//    defines the stacking context as well as the positioning context. If you simply raise
		//    the z-index of the drop down it will be clipped by other elements in the document,
		//    because the z-index is relative to stacking context - to avoid this we have to raise
		//    the element which defines the stacking context to avoid clipping.
		//
		if(this.m_dropDownPosition != null)
		{
			className += " raised";
		}
	}
	
	return className;
}


DropDownFieldRenderer.prototype._render = function()
{

    if(!this.m_inputFieldReadOnly)
    {
    
	    // This fix is only required on IE which appears to have problems
	    // correctly interpretting width: 100% CSS styles on input fields...
	    //
	    // Dirty hack to fix the "dropdownfield resizing problem". The symptoms
	    // of the problems are that when text wider than the input field is 
	    // entered into framed field, the field resizes so that it is wide enough
	    // to accomodate its contained text. This means that the width of the
	    // parents is entirely ignored, causing layout problems for the whole
	    // form. 
	    // The field only resizes when it's layout is recalculated, and IE interprets
	    // width="100%" as 100% of content. The layout is recalulated when the
	    // CSS classes of its parents are changed (as happens below).
	    // The workaround is to explicitly set the the width of the input field
	    // so override the class style of "width: 100%". This is done immediately
	    // below. The same fix is applied in the FramedField code. This dropdown code
	    // needs to be re-implemented to make use of the Framed Field.
	    
	    // Defect 997. The framework select is designed to change width dynamically.
	    // Therefore, we do not want to fix the size of the input field etc..

	    if(this.m_offsetWidth == 0 
	       && this.m_inputField.parentNode.offsetWidth > 0)
	    {
		    var borderStyle = getCalculatedStyle(this.m_borderDiv);
	
		    var borderLeftWidth = borderStyle.borderLeftWidth.slice(0, -2);
		    // If stylesheet hasn't loaded then this will be "medium", if so default to 2px
		    borderLeftWidth = isNaN(borderLeftWidth) ? 2 : Number(borderLeftWidth);
	
		    var borderRightWidth = borderStyle.borderRightWidth.slice(0, -2);
		    // If stylesheet hasn't loaded then this will be "medium", if so default to 2px
		    borderRightWidth = isNaN(borderRightWidth) ? 2 : Number(borderRightWidth);
	
		    var elementStyle = getCalculatedStyle(this.m_guiAdaptor.getElement());
		    var elementWidth = elementStyle.width.slice(0, -2);
		    // If stylesheet hasn't loaded then this will be "auto", if so default to 160px
		    elementWidth = isNaN(elementWidth) ? 160 : Number(elementWidth);
		
		    var buttonCellWidth = this.m_button.m_element.parentNode.offsetWidth;
		    // If stylesheet hasn't loaded then button width won't be set, if so default to 18px
		    buttonCellWidth = isNaN(buttonCellWidth) ? 18 : Number(buttonCellWidth);

		    // Input field width is overall width minus the border and button widths
		    var inputFieldWidth = elementWidth - borderLeftWidth - buttonCellWidth - borderRightWidth;
		    // Subtract left and right 1px padding for two table cells
		    inputFieldWidth -= 4;

		    // Set input field and offset width cache widths
		    this.m_inputField.style.width = inputFieldWidth + "px";
		    this.m_offsetWidth = this.m_inputField.style.width;
	    }
	    else
	    {
		    this.m_inputField.style.width = this.m_offsetWidth;
	    }
	
    }

	if(this.m_disabled || this.m_readonly || this.m_inactive)
	{
		// Stop all input event handlers...
		this.stopDropDownEventHandlers();
	}
	else
	{
		// Start all input event handlers...
		this.startDropDownEventHandlers();		
	}
	
	var disabled = this.m_disabled || this.m_inactive;
	this.m_inputField.disabled = disabled;
	
	// Only toggle read only state of input field
	// if the field has not been set read only permanently
	if(!this.m_inputFieldReadOnly && disabled == false)
	{
		// only apply the readonly if we are enabled
		this.m_inputField.readOnly = this.m_readonly;
	}

	if(this.m_disabled || this.m_inactive)
	{
		// Disable adaptor help text
		if (this.m_guiAdaptor.getHelpText() != null) {
			this.m_guiAdaptor.unbindHelp();
		}
	}
	else
	{
		// Enable adaptor help text
		if (this.m_guiAdaptor.getHelpText() != null) {
			this.m_guiAdaptor.bindHelp();
		}
	}
	
	// Set the Element's CSS class so that it is rendered appropriately
	this.m_element.className = this._getClassName();

}


/**
 * Determines whether the dropdown will be shown above or below the input field
 *
 * @param dropdown the HTML that will rendered in the dropdown container
 * @return true if the dropdown will be shown above the input field, otherwise false
 *
 * @private
 */
DropDownFieldRenderer.prototype._getDropDownPosition = function(dropdown)
{
	var container = this.m_element;
	
	// Get the document relative position of the container
	var containerPos = getAbsolutePosition(container);

	// Get the <html> tag for the document in which this DropDownField exists
	var docEl = container.ownerDocument.documentElement;
	
	var dropdownHeight = dropdown.offsetHeight;
	
	// Document relative position of the top of the drop down,
	// if it were positioned above the container
	var topOfDropdownAbove = containerPos.top - dropdownHeight;
	
	// Document relative position of the top of the drop down,
	// if it were positioned above the container
	var bottomOfDropdownBelow = containerPos.top + container.offsetHeight + dropdownHeight;
	  
    // Calculate the gap between the top of the frame/window and the top of the 
    // drop down, it it were positioned above the container
	var gapAbove = topOfDropdownAbove - docEl.scrollTop;

    // Calculate the gap between the bottom of the frame/window and the bottom of the 
    // drop down, it it were positioned below the container
	var gapBelow = (docEl.scrollTop + docEl.clientHeight) - bottomOfDropdownBelow;

/*
	alert(
		"Dropdown height: " + dropdown.offsetHeight +
		"\nDocument relative top of drop down if positioned above container: " + topOfDropdownAbove +
		"\nDocument relative bottom of drop down if positioned below container: " + bottomOfDropdownBelow +
		"\nGap above drop down if positioned above container: " + gapAbove +
		"\nGap below drop down if positioned below container: " + gapBelow
	);
*/
	
	// Default to showing the popup below the container
	var above = false;
	
	// If the dropdown is going to be clipped by the frame
	// when displayed below the container, check to see if
	// positioning it above the container will show more
	// of the dropdown
	if(gapBelow < 0)
	{
		if(gapAbove < 0)
		{
			// If the dropdown will be clipped above as well,
			// the choose the position which will result in the
			// least clipping of the dropdown
			above = (gapAbove > gapBelow);
		}
		else
		{
			// Not clipped when positioned above, so lets do that.
			above = true;
		}
	}
	
	return above;
}
