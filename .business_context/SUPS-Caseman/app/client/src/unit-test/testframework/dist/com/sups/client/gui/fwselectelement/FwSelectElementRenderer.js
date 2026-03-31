//==================================================================
//
// FwSelectElementRenderer.js
//
//==================================================================

/**
 * Framework select element renderer
 *
 * @constructor
 */
function FwSelectElementRenderer()
{
}


/**
 * FwSelectElementRenderer is a sub class of Renderer
 */
FwSelectElementRenderer.prototype = new Renderer();
FwSelectElementRenderer.prototype.constructor = FwSelectElementRenderer;


FwSelectElementRenderer.m_logger = new Category("FwSelectElementRenderer");

FwSelectElementRenderer.prototype.m_handlersStarted = false;


/**
 * Array containing the divs representing the rows in the dropdown
 *
 * @type Array[HTMLDivElement]
 * @private
 */
FwSelectElementRenderer.prototype.m_rows = null;

/**
 * Number of rows in source data for select
 *
 * @type Integer
 * @private
 *
*/
FwSelectElementRenderer.prototype.m_numberOfSelectDataRows = null;

/**
 * The row currently highlighted, but not necessarily selected, by the user.
 *
 * @type Integer
 * @private
 *
*/
FwSelectElementRenderer.prototype.m_highlightedRow = null;

/**
 * Maximum allowed number of rows in framework select.
 *
 * @type Integer
 * @private
*/
FwSelectElementRenderer.prototype.m_maxNumberOfRows = null;

/**
 * The top visible row
 *
 * @type Integer
 * @private
 */
FwSelectElementRenderer.prototype.m_topRow = null;

/**
 * The row that the user has selected. May be null if the user
 * hasn't selected a row. Rows may be selected in a number of
 * ways including moving the curosr over a row and clicking,
 * or double clicking, the mouse or pressing the return key. Rows
 * may be selected by navigating up and down the options using
 * the arrow keys etc. also.
 *
 * A row will also be selected if a user presses a printable key
 * whilst the select has focus and the key matches the first character
 * of one of the select's display options.
 */
FwSelectElementRenderer.prototype.m_selectedRow = null;

/**
 * Optional array of hardcoded select options defined in HTML page
 *
*/
FwSelectElementRenderer.prototype.m_hardcodedOptions = null;

/**
 * Listeners to be notified when the value of the component changes
 */
FwSelectElementRenderer.prototype.m_valueChangeListeners = null;

/**
 * Key binding flag - static required to prevent keys after submit/cancel key(s)
 * raising the drop down
 */
FwSelectElementRenderer.showDropDown = true;

/**
 * Boolean flag indicating whether, or not, the width of the select
 * should be assigned dynamically. The value of this flag will be
 * determined from the value of the input argument "dynamicRowWidth"
 * of the appropriate renderer creation method.
 *
*/
FwSelectElementRenderer.prototype.m_dynamicRowWidth = null;

/**
 * Integer variable used to store the required maximum row width when
 * the width of the select element is set dynamically. This value
 * must be recalculated each time the select component's source data
 * changes.
 *
*/
FwSelectElementRenderer.prototype.m_maxRowWidth = null;

/**
 * Reference to main table row in select dropdown component
 *
*/
FwSelectElementRenderer.prototype.m_tableRow = null;

/**
 * Reference to table row cell used to store select options in divs.
 *
*/
FwSelectElementRenderer.prototype.m_rowsCell = null;

/**
 * Reference to table row cell used to store scrollbar when present
 *
*/
FwSelectElementRenderer.prototype.m_scrollbarCell = null;

/**
 * Reference to vertical scrollbar component when present
 *
*/
FwSelectElementRenderer.prototype.m_verticalScrollbar = null;

FwSelectElementRenderer.CSS_CLASS_NAME = "fwselectelement";
FwSelectElementRenderer.TABLE_CSS_CLASS_NAME = "fwselectelement_table";
FwSelectElementRenderer.TEMP_TABLE_CSS_CLASS_NAME = "fwselectelement_temp_table";
FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME = "fwselectelement_tablerow";
FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME = "fwselectelement_rowscell";
FwSelectElementRenderer.SCROLLCELL_CSS_CLASS_NAME = "fwselectelement_scrollcell";
FwSelectElementRenderer.ROW_CSS_CLASS_NAME = "fwselectelement_row";
FwSelectElementRenderer.ROW_SELECTED_CSS_CLASS_NAME = FwSelectElementRenderer.ROW_CSS_CLASS_NAME + " fwselectelement_rowselected";
FwSelectElementRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME = FwSelectElementRenderer.ROW_CSS_CLASS_NAME + " fwselectelement_rowSelectedNotSubmissible";
FwSelectElementRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME = FwSelectElementRenderer.ROW_CSS_CLASS_NAME + " fwselectelement_rowNotSubmissible";


FwSelectElementRenderer.DEFAULT_MAX_NUMBER_OF_ROWS = 8;
FwSelectElementRenderer.DEFAULT_INITIAL_WIDTH = "180px";

/**
 * Define width of drop down component's table cell containing
 * vertical scroll bar.
 *
*/
FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH = 16;

// Settings for button
FwSelectElementRenderer.REPEAT_INITIAL_DELAY = 1000;
FwSelectElementRenderer.REPEAT_INTERVAL = 200;




/**
 * Create a framework select element at the current location in the document
 * while document is parsing.
 *
 * @param id               The id of the framework select element being created
 * @param maxRows          The maximum number of rows in the drop down menu
 * @param dynamicRowWidth  Boolean flag indicating whether, or not, the select
 *                         width is dynamic. The default value is "true".
 * @param initialWidth     Width used for dynamically szied select when first rendered.
 * @param hardcodedOptions Optional array of hard coded selection options
 */
FwSelectElementRenderer.createInline = function(id, 
                                                maxRows, 
                                                dynamicRowWidth,
                                                initialWidth,
                                                hardcodedOptions)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the framework select element being created
		false		// The framework select element has an internal input element which can accept focus, so the div should not accept focus
	);

	return FwSelectElementRenderer._create(e, 
	                                       maxRows, 
	                                       dynamicRowWidth, 
	                                       initialWidth, 
	                                       hardcodedOptions);
}


/**
 * Create a framework select element in the document relative to the supplied element
 *
 * @param refElement the element relative to which the framework select element should be rendered
 * @param relativePos the relative position of the framework select element to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id               The id of the framework select element being created
 * @param maxRows          The maximum number of rows in the drop down menu
 * @param dynamicRowWidth  Boolean flag indicating whether, or not, the select
 *                         width is dynamic. The default value is "true".
 * @param initialWidth     Width used for dynamically szied select when first rendered.
 * @param hardcodedOptions Optional array of hard coded selection options
 */
FwSelectElementRenderer.createAsInnerHTML = function(refElement, 
                                                     relativePos, 
                                                     id, 
                                                     maxRows, 
                                                     dynamicRowWidth,
                                                     initialWidth,
                                                     hardcodedOptions)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the framework select element being created
		false			// The framework select element has an internal input element which can accept focus, so the div should not accept focus
	);

	return FwSelectElementRenderer._create(e, 
	                                       maxRows, 
	                                       dynamicRowWidth,
	                                       initialWidth, 
	                                       hardcodedOptions);
}


/**
 * Create a framework select element as a child of another element
 *
 * @param p                The parent element to which the framework select element should be added
 * @param id               The id of the framework select element being created
 * @param maxRows          The number of rows in the drop down menu
 * @param dynamicRowWidth  Boolean flag indicating whether, or not, the select
 *                         width is dynamic. The default value is "true".
 * @param initialWidth     Width used for dynamically szied select when first rendered.
 * @param hardcodedOptions Optional array of hard coded selection options
 */
FwSelectElementRenderer.createAsChild = function(p, 
                                                 id, 
                                                 maxRows,
                                                 dynamicRowWidth,
                                                 initialWidth,
                                                 hardcodedOptions)
{
	var e = Renderer.createAsChild(id);

	// Append the framework select element's outer div to it's parent element
	p.appendChild(e);	
	
	return FwSelectElementRenderer._create(e, 
	                                       maxRows, 
	                                       dynamicRowWidth,
	                                       initialWidth,
	                                       hardcodedOptions);
}


FwSelectElementRenderer._create = function(e, 
                                           maxRows,
                                           dynamicRowWidth,
                                           initialWidth,
                                           hardcodedOptions)
{
	e.className = FwSelectElementRenderer.CSS_CLASS_NAME;
	
	var fse = new FwSelectElementRenderer();
	
	// Initialise sets main element and the reference to the renderer in the dom
	fse._initRenderer(e);
	
	// Default the maximum number of rows to 8 if not specified
	if(null == maxRows)
	{
	    fse.m_maxNumberOfRows = FwSelectElementRenderer.DEFAULT_MAX_NUMBER_OF_ROWS;
	}
	else
	{
	    fse.m_maxNumberOfRows = maxRows;
	}
	
	// Determine whether, or not, framework select should be sized dynamically
	if(null != dynamicRowWidth)
	{
	    if(dynamicRowWidth == true)
	    {
	        fse.m_dynamicRowWidth = true;
	    }
	    else
	    {
	        fse.m_dynamicRowWidth = false;
	    }
	}
	else
	{
	    fse.m_dynamicRowWidth = true;
	}
	
	if(fse.m_dynamicRowWidth)
	{
	    // If using dynamic width set initial width to a sensible value.
	    if(null != initialWidth)
	    {
	        fse.m_element.style.width = initialWidth;
	    }
	    else
	    {
	        fse.m_element.style.width = FwSelectElementRenderer.DEFAULT_INITIAL_WIDTH;
	    }
	}
	
	// Store array of hardcoded options if defined
	if(null != hardcodedOptions)
	{
	    fse.m_hardcodedOptions = hardcodedOptions;
	}
	
	// Initialise the DropDownField part of the renderer
	fse.m_dropDownField = DropDownFieldRenderer.createAsChild(e, true);
	
	// Listen for show hide events
	fse.m_dropDownField.addShowHideListener(function(show) {fse._handleDropDownShowHide(show);});
	
	// Get the dropdown container
	var dropdown = fse.m_dropDownField._getDropDownElement();
	
	// Prevent selection of content in the dropdown
	preventSelection(dropdown);

	// Local reference to the document that we are adding elements to
	var d = window.document;

	// Create table to hold rows and scrollbar
	var table = d.createElement("table");
	table.className = FwSelectElementRenderer.TABLE_CSS_CLASS_NAME;
	
	// Ideally these attributes could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");

	// Require a tbody element
	var tableBody = d.createElement("tbody");

	// D643 - Override any centre/right alignment that may be set on a containing
	// table, otherwise the scrollbar gets moved to the right
	tableBody.setAttribute("align", "left");

	// Row to hold two cells.
	var tableRow = d.createElement("tr");
	fse.m_tableRow = tableRow;

	tableRow.className = FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME;

	var rowsCell = d.createElement("td");
	fse.m_rowsCell = rowsCell;
	rowsCell.className = FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME;

	tableRow.appendChild(rowsCell);
	tableBody.appendChild(tableRow);
	table.appendChild(tableBody);
	
	dropdown.appendChild(table);

	// Create new callback list for value change listeners
	fse.m_valueChangeListeners = new CallbackList();

	
	// No model yet
	fse.m_model = null;
	
	return fse.m_dropDownField.m_element;
}


FwSelectElementRenderer.prototype.startEventHandlers = function()
{
	// Makes this call idempotent
	if(!this.m_handlersStarted)
	{	
		this.m_handlersStarted = true;
		
		if(null != this.m_verticalScrollbar)
		{
		    this.m_verticalScrollbar.startEventHandlers();
		}

		var fse = this;
		this.m_keyupHndlr = SUPSEvent.addEventHandler(this.m_element, 'keyup', function(evt) { return fse._handleKeyUpEvent(evt); });
		this.m_keydownHndlr = SUPSEvent.addEventHandler(this.m_element, 'keydown', function(evt) { return fse._handleKeyDownEvent(evt); });
		
		this.m_rowsCell.onclick = function(evt) { fse._handleClick(evt); };
		this.m_rowsCell.ondblclick = function(evt) { fse._handleDoubleClick(evt); };
		this.m_rowsCell.onmouseover = function(evt) { fse._handleMouseOver(evt); };
	}
}


FwSelectElementRenderer.prototype.stopEventHandlers = function()
{
	// Makes this call idempotent
	if(this.m_handlersStarted)
	{
		this.m_handlersStarted = false;

        if(null != this.m_verticalScrollbar)
        {
		    this.m_verticalScrollbar.stopEventHandlers();
		}

		SUPSEvent.removeEventHandlerKey(this.m_keyupHndlr);
		this.m_keyupHndlr = null;

		SUPSEvent.removeEventHandlerKey(this.m_keydownHndlr);		
		this.m_keydownHndlr = null;
		
		this.m_rowsCell.onclick = null;
		this.m_rowsCell.ondblclick = null;
		this.m_rowsCell.onmouseover = null;
	}
}


FwSelectElementRenderer.prototype.dispose = function()
{
	this.stopEventHandlers();
	
	// Remove selection prevention event handler from drop down
	unPreventSelection(this.m_dropDownField._getDropDownElement());
	
	this.m_model = null;
	
	// Clear array of hard coded options if defined
	if(null != this.m_hardcodedOptions)
	{
	    this.m_hardcodedOptions = null;
	}
	
	if(null != this.m_verticalScrollbar)
	{
	    this.m_verticalScrollbar.dispose();
	    this.m_verticalScrollbar = null;
	}
	
	// Dispose of HTML references
	if(null != this.m_rows)
	{
	    for(var i = 0, l = this.m_rows.length; i < l; i++)
	    {
	        this.m_rows[i] = null;
	    }
	    
	    this.m_rows = null;
	}
	
	this.m_rowsCell = null;
	
	if(null != this.m_scrollbarCell)
	{
	    this.m_scrollbarCell = null;
	}
	
	this.m_tableRow = null;
	
	this.m_dropDownField.dispose();
	
	this.m_valueChangeListeners.dispose();
	delete this.m_valueChangeListeners;
	
    this.m_element = null;
}


/*
 * Add a listener which will be called if the display value of the 
 * field changes.
 *
 * @param callback the function invoked when the value changes
 */
FwSelectElementRenderer.prototype.addValueChangeListener = function(callback)
{
	this.m_valueChangeListeners.addCallback(callback);
}

FwSelectElementRenderer.prototype.setModel = function(model)
{
	this.m_model = model;
	
	this.m_dropDownField.m_guiAdaptor = model;
}


/**
 * Handle changes in the postion of the vertical scrollbar
 *
 * @private
 */
FwSelectElementRenderer.prototype._handleVerticalScroll = function()
{
	if(this.m_topRow != this.m_verticalScrollbar.m_position)
	{
		this.m_topRow = this.m_verticalScrollbar.m_position;
	
		this._renderRows();
	}
}


/**
 * Handle changes in the dropdown's visibility state. Function registered
 * with drop down field which invokes function to display select options.
 *
 * @param show true if the dropdown is to be shown or false if it to be hidden
 * @private
 */
FwSelectElementRenderer.prototype._handleDropDownShowHide = function(show)
{
	if(show)
	{
		if(null == this.m_model)
		{
		    if(null != this.m_verticalScrollbar)
		    {
			    // Set the scaling of the scrollbar to a sensible default
			    this.m_verticalScrollbar.setScaling(0, 100, 100);
			}
		}
		else
		{
			// Populate with data
			this._renderDropDown();
		}
	}
}


/**
 * Handle a click event on one of the rows in the drop down
 *
 * @param evt the click event - null on IE
 */
FwSelectElementRenderer.prototype._handleClick = function(evt)
{
	if (null == evt) evt = window.event;

	// If this is IE evt.detail will not be defined, however IE does not call
	// click handler twice on a double click. In Mozilla click handler is called
	// for each click and evt.detail contains the number of sucessive clicks, so
	// for a double click evt.detail will be two - we only want to handle single
	// clicks here so ignore clicks with evt.detail != 1. All double clicks are
	// handled in _handleDoubleClick below.
    if(evt.detail == undefined || evt.detail == 1)
	{
		// Update current match.
		this._useCurrentMatch(true);
	}
}


/**
 * Handle a double click on one of the rows in the drop down
 *
 * @param evt the double click event - null on IE
 * @private
 */
FwSelectElementRenderer.prototype._handleDoubleClick = function(evt)
{
	// As with onClick handler update current match
	this._useCurrentMatch(true);
}


/**
 * Method handles mouse over event on select option. Note that mouse over
 * causes row to be highlighted.
 *
 * @param evt the event structure.
 * @private
 */
FwSelectElementRenderer.prototype._handleMouseOver = function(evt)
{
	if (null == evt) evt = window.event;
	
	var target = SUPSEvent.getTargetElement(evt);
	
	if(null != this.m_rows)
	{
	
	    for(var i = 0, l = this.m_rows.length; i < l ; i++)
	    {
		    if(target == this.m_rows[i])
		    {
			    break;
		    }
	    }
	
	    if(i < l)
	    {
	        // Select option highlighted
		    this.m_highlightedRow = i + this.m_topRow;
		    
		    // If mouse over event occurs drop down must be raised.
		    this._renderRows();
	    }
	    
	}
	
}


/**
 * Key up handler for framework select element
 *
 * @param evt the event structure.
 * @return true to allow the event to propogate
 * @todo need to check for non-printable characters - and determine behavior!
 * @private
 */
FwSelectElementRenderer.prototype._handleKeyUpEvent = function(evt)
{
	// If IE the use the global event 
	evt = (null != evt) ? evt : window.event;
		
	// Get the keycode from the event - the same on IE and W3C compliant browsers
	var eventKeyCode = evt.keyCode;

	if(eventKeyCode == Key.ArrowUp.m_keyCode || eventKeyCode == Key.ArrowDown.m_keyCode) 
	{
		// Defect 973. In previous versions of code up or down key events caused
		// drop down component to be displayed. Post defect 973 up and
		// down arrow keys handled by key down handler only.
	}
	else if(eventKeyCode == Key.Return.m_keyCode)
	{
	    // As with "onClick" and "onDblClick" update selection
	    this._useCurrentMatch(true);
	}
	else if(!this._isPrintableChar(eventKeyCode))
	{
		// Ignore tabs - handled by focus in/out anyway. This avoids the
		// drop down being raised when the user first tabs into the field
		
		// Ignore esc - handled by drop down field anyway. This avoids the
		// drop down hiding itself then immediately showing itself again.
		
		// Ignore miscellaneous keys - prevents drop down showing for
		// these keys
	}
	else
	{
		if (FwSelectElementRenderer.m_logger.isDebug()) FwSelectElementRenderer.m_logger.debug("KeyHandler about to showMatches for key: " +  eventKeyCode);
		
		// If a key is bound via the Key Binding protocol or Event Binding then
		// we don't want to show the drop down.
		var keyBindings = new Array();
		keyBindings.push(this.m_model.getKeyBindings());

		// Submit/cancel lifecycles have a delay before a subform is closed. If a
		// key is bound to the submit/cancel lifecycle and it is pressed when in an
		// autocomplete then it's dropdown is raised before the subform is closed.
		// Don't show the drop down if the key press matches the bound key(s).
		var fa = FormController.getInstance().getFormAdaptor();

		if(fa instanceof SubformElementGUIAdaptor)
		{
			var cancelEventBinding = fa.m_lifeCycles.cancel.getEventBinding();
			var submitEventBinding = fa.m_lifeCycles.submit.getEventBinding();

			if(cancelEventBinding != null)
			{
				keyBindings = keyBindings.concat(cancelEventBinding.m_keyBindings);
			}

			if(submitEventBinding != null)
			{
				keyBindings = keyBindings.concat(submitEventBinding.m_keyBindings);
			}
		}

		var keyCodeString = '' + eventKeyCode;	
		var qualifiers = 0;

		// Get the qualifier keys from the event
		if(evt.ctrlKey) qualifiers |= ElementKeyBindings.CTRL_KEY_MASK;
		if(evt.altKey) qualifiers |= ElementKeyBindings.ALT_KEY_MASK;
		if(evt.shiftKey) qualifiers |= ElementKeyBindings.SHIFT_KEY_MASK;
		
		FwSelectElementRenderer.showDropDown = true;
		
		for(var i = 0, l = keyBindings.length; i < l; i++)
		{
			if(keyBindings[i].m_keys[keyCodeString] != null &&
				keyBindings[i].m_qualifiers[keyCodeString] == qualifiers)
			{
				FwSelectElementRenderer.showDropDown = false;
			}
		}
			
  		if(this.m_dropDownField.isRaised())
		{
			if(!FwSelectElementRenderer.showDropDown)
			{
				// Hide select drop down before matched key binding action occurs		
				this.m_dropDownField.hideDropDown();
			}
			else
			{		
				// Attempt to match input character with display options
			    this._matchInputCharacter(eventKeyCode, evt);
			}
		}
		else if(FwSelectElementRenderer.showDropDown)
		{
		    // Attempt to match input character with display options
			this._matchInputCharacter(eventKeyCode, evt);
		}
	}

	return true;
}


/**
 * Key down handler for framework select element. Move selection up/down drop down
 * if up/down arrows keys held down.
 *
 * @param evt the event structure.
 * @return Return "true" to let event propagate upwards unless key is
 *         a scrollable key because this would cause a surrounding
 *         scrolling div to scroll.
 * @private
 */
FwSelectElementRenderer.prototype._handleKeyDownEvent = function(evt)
{
    // If IE the use the global event 
	evt = (null != evt) ? evt : window.event;

	// Get the keycode from the event
    var eventKeyCode = evt.keyCode;

	switch(eventKeyCode)
	{
	
		case Key.ArrowUp.m_keyCode:
		{
			this._selectPreviousOption();
			break;
		}
		case Key.ArrowDown.m_keyCode:
		{
			this._selectNextOption();
			break;
		}
		case Key.PageUp.m_keyCode:
		{
			this._selectPreviousPageOption();
			break;
		}
		case Key.PageDown.m_keyCode:
		{
			this._selectNextPageOption();
			break;
		}
		case Key.Home.m_keyCode:
		{
			this._selectFirstOption();
			break;
		}
		case Key.End.m_keyCode:
		{
			this._selectLastOption();
			break;
		}

	}
	
	var returnValue = true;
	
	if(Key.isScrollKey(eventKeyCode))
	{
	    // Prevent default action because select component may be located
	    // within scrollable div and we do not want key press to cause
	    // div to scroll.
	    SUPSEvent.preventDefault(evt);
	    
	    returnValue = false;
	}
	
	return returnValue;
}

/**
 * Method updates renderer with latest option selection.
 *
 * @param hideDropDown Boolean flag indicating, whether, or not,
 *                     select drop down component should be hidden.
 *
 */
FwSelectElementRenderer.prototype._useCurrentMatch = function(hideDropDown)
{
	if(this.m_highlightedRow != null)
	{
		this.getInputElement().value = this.m_model.getMatch(this.m_highlightedRow);
		
		this.m_selectedRow = this.m_highlightedRow;
	}
	
	if(hideDropDown)
	{
	    this.m_dropDownField.hideDropDown();
	}
	
	// Notify listeners that the value has changed.
	this.m_valueChangeListeners.invoke();
}

/**
 * Draw, or redraw, rows in drop down.
 *
 */
FwSelectElementRenderer.prototype._renderDropDown = function()
{
	if(this.m_model != null)
	{
		
		// Retrieve current row selection. Note, post defect 973 this may not
		// be necessary as the adaptor is much better at keeping "m_selectedRow"
		// up to date.
		var currentRow = this.m_model.getRowNoFromDisplayValue(this.getTextFieldValue());
		
		// Set highlighted row to current selection. Note current selection will be
		// used to render dropdown. Highlighted row may be updated by cursor movement.
		this.m_highlightedRow = currentRow;
        
	    var visibleRows = this.m_rows.length;
			
		// Render rows including selected option.
		if(null != currentRow)
		{
			if(currentRow < visibleRows)
			{
			    this.m_topRow = 0;
			}
			else
			{
			    this.m_topRow = currentRow;
			    
			    if(this.m_topRow + visibleRows > this.m_numberOfSelectDataRows)
			    {
			        this.m_topRow = this.m_numberOfSelectDataRows - visibleRows;
			    }
			}
	    }
		else
		{
			// Current row may be null if no data in select
			this.m_topRow = 0;
		}
	
	    if(null != this.m_verticalScrollbar)
	    {
		    // Size the scrollbar correctly
		    this.m_verticalScrollbar.setScaling(0, visibleRows, this.m_numberOfSelectDataRows);
		}

		this._renderRows();
		
	}
	
}

/**
 * Method controls refresh of select options.
 *
 */
FwSelectElementRenderer.prototype._renderRows = function()
{
	// Render the visible rows.
	var i;

	for(i = 0, l = this.m_rows.length; i < l ; i++)
	{
		this._renderRow(i);
	}
	
	if(null != this.m_verticalScrollbar)
	{
	    // Position the scrollbar appropriately
	    this.m_verticalScrollbar.setPosition(this.m_topRow);
	    this.m_verticalScrollbar._render();
	}
}

/**
 * Method refreshes content of a single select row.
 *
 * @param rowNumber The position of the row within the drop down component.
 *
 */
FwSelectElementRenderer.prototype._renderRow = function(rowNumber)
{
	var r = this.m_rows[rowNumber];
	var dataRow = rowNumber + this.m_topRow;
	var isSubmissible = this.m_model.isKeyForMatchSubmissible(dataRow);
	var isSelected = this.m_highlightedRow == dataRow;

	// Set row content
	this._setRowContent( r, this.m_model.getMatch(dataRow) );
	
	var cN = "";
	if(isSubmissible == true)
	{
		cN = isSelected ? FwSelectElementRenderer.ROW_SELECTED_CSS_CLASS_NAME : FwSelectElementRenderer.ROW_CSS_CLASS_NAME;
	}
	else
	{
		cN = isSelected ? FwSelectElementRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME : FwSelectElementRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME;
	}
	
	r.className = cN;
	
}


FwSelectElementRenderer.prototype._selectPreviousOption = function()
{
	if(this.m_highlightedRow != null && this.m_highlightedRow != 0)
	{
		// Not at first row in options, so select previous row
		this._moveSelection(this.m_highlightedRow - 1);
	}
}


FwSelectElementRenderer.prototype._selectNextOption = function()
{
	if(0 == this.m_numberOfSelectDataRows)
	{
		// No options, so do nothing
		return;
	}
	if(null == this.m_highlightedRow)
	{
		// First press of down arrow in drop down, so select first row
		this._moveSelection(0);
	}
	else if(this.m_highlightedRow != (this.m_numberOfSelectDataRows - 1))
	{
		// Not at last row in options, so select next row
		this._moveSelection(this.m_highlightedRow + 1);
	}
}


FwSelectElementRenderer.prototype._selectPreviousPageOption = function()
{
	if(this.m_numberOfSelectDataRows != 0 && this.m_highlightedRow != 0)
	{
		// Has some data and not at first row, so move selection up from
		// the highlighted row by the number of rows in the drop down
		
		var rowToSelect = this.m_highlightedRow - this.m_rows.length + 1;
		
		if(rowToSelect < 0)
		{
			// Past first row in drop down, so select first row
			rowToSelect = 0;
		}
		
		this._moveSelection(rowToSelect);
	}
}


FwSelectElementRenderer.prototype._selectNextPageOption = function()
{
	var numberOfSelectDataRows  = this.m_numberOfSelectDataRows;
	var lastRow = numberOfSelectDataRows - 1;
		
	if(numberOfSelectDataRows != 0 && this.m_highlightedRow != lastRow)
	{
		// Has some data and not at last row, so move selection down from
		// the highlighted row by the number of rows in the drop down
			
		var rowToSelect = this.m_highlightedRow + this.m_rows.length - 1;
		
		if(rowToSelect > lastRow)
		{
			// Past last row in drop down, so select last row
			rowToSelect = lastRow;
		}
		
		this._moveSelection(rowToSelect);
	}
}


FwSelectElementRenderer.prototype._selectFirstOption = function()
{
	if(this.m_numberOfSelectDataRows != 0 && this.m_highlightedRow != 0)
	{
		// Has some data and not at first row, so move selection to the
		// first row in the drop down
		
		this._moveSelection(0);
	}
}


FwSelectElementRenderer.prototype._selectLastOption = function()
{
	var numberOfSelectDataRows  = this.m_numberOfSelectDataRows;
	var lastRow = numberOfSelectDataRows - 1;
	
	if(numberOfSelectDataRows != 0 && this.m_highlightedRow != lastRow)
	{
		// Has some data and not at last row, so move selection to the
		// last row in the drop down
				
		this._moveSelection(lastRow);
	}
}


FwSelectElementRenderer.prototype._moveSelection = function(newSelectedRow)
{
    if(this.m_dropDownField.isRaised())
    {
        // Drop down is raised so update current contents
	    if(newSelectedRow < this.m_topRow)
	    {
		    // Selected row is "above" the topmost displayed rows, so scroll to make it visible

		    // Make the selected row the top most visible row
		    this.m_topRow = newSelectedRow;
		
		    // Update the selected row
		    this.m_highlightedRow = newSelectedRow;
		
		    // All the rows will need re-rendering
		    this._renderRows();
	    }
	    else if(newSelectedRow > (this.m_topRow + this.m_rows.length - 1))
	    {
		    // Selected row is "below" the bottommost displayed rows, so scroll to make it visible
		    this.m_topRow = newSelectedRow - (this.m_rows.length - 1);
		
		    // Update the selected row
		    this.m_highlightedRow = newSelectedRow;
		
		    // All the rows will need re-rendering
		    this._renderRows();		
	    }
	    else
	    {
		    // Newly selected row is one of the currently displayed rows in the list, so just
		    // highlight it

		    var csr = this.m_highlightedRow;

		    // If there is a selected row and it is currently one of the displayed
		    // rows, then render it as unselected
		    if(null != csr && csr >= this.m_topRow && csr < (this.m_topRow + this.m_rows.length))
		    {
			    this.m_highlightedRow = null;
			    this._renderRow(csr - this.m_topRow);
		    }
		
		    // Render the newly selected row as rendered
		    this.m_highlightedRow = newSelectedRow;
		    this._renderRow(newSelectedRow - this.m_topRow);
	    }
	    
	}
	else
	{
	    // Drop down component is not raised so just update selected row
	    this.m_highlightedRow = newSelectedRow;
	}
	
	// Update display and, if necessary, persist change
	this._useCurrentMatch(false);
}


/**
 * Get the value of the text field of the dropdown
 */
FwSelectElementRenderer.prototype.getTextFieldValue = function()
{
	return this.m_dropDownField._getInputFieldElement().value;
}


FwSelectElementRenderer.prototype.resetSelectedMatch = function()
{
    this.m_selectedRow = null;
    
    // Also reset highlighted row as this should match selected row.
    this.m_highlightedRow = null;
}

FwSelectElementRenderer.prototype.getSelectedMatch = function()
{
	return this.m_selectedRow;
}

FwSelectElementRenderer.prototype.setSelectedRow = function( selectedRow )
{
    this.m_selectedRow = selectedRow;
    
    if(this.m_highlightedRow != this.m_selectedRow)
    {
        // Highlighted row should match selected row.
        this.m_highlightedRow = this.m_selectedRow;
    }
}

FwSelectElementRenderer.prototype.setValue = function(value)
{
	// Don't want to display "null" in the field.
	if(value == null) value="";

	// Set the value of the field
	this.getInputElement().value = value;
}


FwSelectElementRenderer.prototype.dataUpdate = function()
{
    var raised = false;
    
    var dropDownField = this.m_dropDownField;
    
    if(dropDownField.isRaised())
    {
        raised = true;
        
        // Hide drop down whilst updating contents
        dropDownField.hideDropDown();
    }
    
    // Update contents of dropdown component   
    this._createDynamicDropDownContent();
    
	if(raised)
	{   
		dropDownField.showDropDown();
	}
}


FwSelectElementRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isSubmissible, isServerValidationActive)
{   
	// D743 - Prevent key press showing drop down if not enabled
	if (disabled || readonly || inactive)
	{
		// Stop all input event handlers
		this.stopEventHandlers();
	}
	else
	{
		// Start all input event handlers
		this.startEventHandlers();		
	}

	this.m_dropDownField.render(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isSubmissible, isServerValidationActive);
}


FwSelectElementRenderer.prototype.getInputElement = function()
{
	return this.m_dropDownField._getInputFieldElement();
}

/**
 * Set the width of the drop down rows, so that text that is too wide for the
 * row is clipped. (In IE, if the width is not set then the drop down outer
 * div changes to fit the width of the longest row in view as the rows are
 * scrolled up and down.)
 */
FwSelectElementRenderer.prototype._setRowWidth = function()
{
	var elementWidth = this.m_element.clientWidth;
	
	var scrollBarWidth = 0;
	
	if(null != this.m_verticalScrollbar)
	{
	    scrollBarWidth = this.m_verticalScrollbar.m_element.clientWidth;
	}

    // Account for border on drop down component
    var dropDown = this.m_dropDownField._getDropDownElement();
	var borderWidth = this._getBorderWidth( dropDown );
	
	// Account for padding on select options
	var rowPaddingWidth = this._getDropDownRowPaddingWidth();

	var rowWidth = elementWidth - scrollBarWidth - borderWidth - rowPaddingWidth;

	var rows = this.m_rows;

	for (var i = 0, l = rows.length; i < l; i++)
	{
		rows[i].style.width = rowWidth;
	}

	// Make the overall drop down width narrower by the border width
	dropDown.style.width = elementWidth - borderWidth;
}

/**
 * Method sets width of select options based on previously
 * determined row widths.
 *
*/
FwSelectElementRenderer.prototype._setDynamicRowWidth = function()
{
    var maxRowWidth = this.m_maxRowWidth;
    
    if(null != maxRowWidth)
    {
    
        if(null == this.m_verticalScrollbar)
        {
            // If scrollbar not rendered row width must be increased
            maxRowWidth += FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH;
        }
        
        var rows = this.m_rows;
        
        for(var i = 0, l = rows.length; i < l; i++)
        {
            rows[i].style.width = maxRowWidth + "px";
        }
    }
    
}  

FwSelectElementRenderer.prototype.getHardcodedOptions = function()
{
    return this.m_hardcodedOptions;
}

/**
 * Method helps to identify certain classes of keys handled by
 * key up handler.
 *
 * Makes key handling control structure easier to read.
 *
*/
FwSelectElementRenderer.prototype._isPrintableChar = function( keyCode )
{
    var printableCharacter;
    
    switch(keyCode)
    {
    
       case Key.Tab.m_keyCode:
	   case Key.ESC.m_keyCode:
	   case Key.PageUp.m_keyCode: 
	   case Key.PageDown.m_keyCode:
	   case Key.ScrollLock.m_keyCode:
	   case Key.PrintScreen.m_keyCode:
	   case Key.Insert.m_keyCode:
	   case Key.NumLock.m_keyCode:
	   case Key.Menu.m_keyCode:
	   case Key.Home.m_keyCode:
	   case Key.End.m_keyCode:
	   case Key.Windows.m_keyCode:
	   {
	       printableCharacter = false;
	       break;
	   }
	   
	   default:
	   {
	       printableCharacter = true;
	       break;
	   }
	   
    }
    
    return printableCharacter
}

/**
 * Method returns position of select entry which matches
 * input key.
 *
*/
FwSelectElementRenderer.prototype._matchInputCharacter = function(eventKeyCode, evt)
{
    if(Key.isPrintableKey(eventKeyCode) &&
	   !evt.ctrlKey && 
	   !evt.altKey &&
	   !Key.isFunctionKey(eventKeyCode))
	{
	    // Key is printable, so search for match
	    var matchedRow = this.m_model.matchFirstCharacter(String.fromCharCode(eventKeyCode));
				    
	    if(null != matchedRow)
	    {
	        this.getInputElement().value = this.m_model.getMatch(matchedRow);
				    
		    this.m_selectedRow = matchedRow;
		    
		    this.m_highlightedRow = this.m_selectedRow;
				    
		    if(this.m_dropDownField.isRaised())
		    {
		        this._renderDropDown();
		    }
				    
		    this.m_valueChangeListeners.invoke();
	    }
	}
}

/**
 * Method populates the framework select element dropdown component with select
 * option rows.
 *
 *
*/
FwSelectElementRenderer.prototype._createDynamicDropDownContent = function()
{
    if(null != this.m_model)
    {
        var maxRows = this.m_maxNumberOfRows;
        
        // Retrieve current number of data rows in select
        this.m_numberOfSelectDataRows = this.m_model.getNumberOfSelectRows();
        
        // Use local reference to number of rows
        var numberOfSelectDataRows = this.m_numberOfSelectDataRows;
    
        if(null == this.m_rows)
        {
            // If this condition occurs this is the first time the dropdown has been
            // displayed and we need to create the dropdown components.
            
            // Defect 1067. The use of ">=" may look a little strange. However,
            // the number of options in the client side DOM may drop to zero
            // (usually temporarily) and the component must handle this gracefully.
        
            if(numberOfSelectDataRows >= 0)
            {
                // Stop event handlers if they have been started. Might
                // be interesting aren't we in such a handler?
                this.stopEventHandlers();
                
                if(this.m_dynamicRowWidth)
                {
                    this._setSelectElementWidth(numberOfSelectDataRows);
                }
            
                if(numberOfSelectDataRows > maxRows)
                {
                    // Create select option rows
                    this._createDynamicDropDownRows(maxRows);
                
                    if(null == this.m_verticalScrollbar)
                    {
                        // Create vertical scrollbar
                        this._createDynamicDropDownScrollbar();
                    }
                }
                else
                {
                    this._createDynamicDropDownRows(numberOfSelectDataRows);
                }
            
                // If width of select component is fixed set row width appropriately
                if(!this.m_dynamicRowWidth)
                {
                    this._setRowWidth();
                }
                else
                {
                    this._setDynamicRowWidth();
                }
            
                // Restart event handlers
                this.startEventHandlers();
            
            }
        
        }
        else
        {
            // Redisplaying dropdown after original creation.
            if(!this.m_hardcodedOptions)
            {   
                // Stop events whilst performing redraw.
                this.stopEventHandlers();
                
                // Remove existing rows
                this._removeDynamicDropDownRows();
                
                if(numberOfSelectDataRows >= 0)
                {
                    var scrollbarChange = false;
                        
                    if(this.m_dynamicRowWidth)
                    {
                        this._setSelectElementWidth(numberOfSelectDataRows);
                    }
                    
                    if(numberOfSelectDataRows > maxRows)
                    {
                        this._createDynamicDropDownRows(maxRows);
                        
                        if(null == this.m_verticalScrollbar)
                        {
                            // Create scrollbar
                            this._createDynamicDropDownScrollbar();
                            
                            scrollbarChange = true;
                        }
                        
                    }
                    else
                    {
                        if(null != this.m_verticalScrollbar)
                        {
                            this._removeDynamicDropDownScrollbar();
                            
                            scrollbarChange = true;
                        }
                        
                        this._createDynamicDropDownRows(numberOfSelectDataRows);
                    }
                    
                    if(!this.m_dynamicRowWidth)
                    {
                        // Set row width appropriately
                        if(scrollbarChange)
                        {
                            this._setRowWidth();
                        }
                    }
                    else
                    {
                        this._setDynamicRowWidth();
                    }
                    
                }
                
                // Restart event handlers
                this.startEventHandlers();
            
            } // this.m_hardcodedOptions if block
        
        } // End of this.m_rows if block
        
    } // End of this.m_model if block
    
}

/**
 * Method creates the rows within the framework select dropdown. These "rows" are
 * actually individual divs which reside within a table cell.
 *
 * @param numberOfRows The number of rows to be created.
 *
*/
FwSelectElementRenderer.prototype._createDynamicDropDownRows = function(numberOfRows)
{
    // Create new array to reference divs
    if(numberOfRows > 0)
    {
        this.m_rows = new Array( numberOfRows );
    }
    else
    {
        this.m_rows = new Array();
    }
    
    // Create div components
    var doc = window.document;
    
    for(var i = 0; i < numberOfRows; i++)
    {
        var r = doc.createElement( "div" );
        
        r.className = FwSelectElementRenderer.ROW_CSS_CLASS_NAME;
        
        this.m_rowsCell.appendChild( r );
        
        this.m_rows[i] = r;
    }
    
}

/**
 * Method removes current rows in framework select dropdown. These "rows" are
 * actually individual divs which reside within a table cell.
 *
*/
FwSelectElementRenderer.prototype._removeDynamicDropDownRows = function()
{
    if(null != this.m_rows)
    {   
        for(var i = 0, l = this.m_rows.length; i < l; i++)
        {
            var r = this.m_rows[i];
            
            // Clean up child nodes
            var childNodes = r.childNodes;
            
            for(var k = childNodes.length - 1; k >= 0; k--)
            {
                r.removeChild( childNodes[k] );
            }
            
            this.m_rowsCell.removeChild( r );
            
            this.m_rows[i] = null;
        }
        
        this.m_rows = null;
    }
    
}

/**
 * Method creates a vertical scrollbar for the framework select element dropdown
 * component.
 *
*/
FwSelectElementRenderer.prototype._createDynamicDropDownScrollbar = function()
{
    var doc = window.document;
    
    // Create scrollbar cell
    this.m_scrollbarCell = doc.createElement( "td" );
    
    this.m_scrollbarCell.className = FwSelectElementRenderer.SCROLLCELL_CSS_CLASS_NAME;
    
    // Create scrollbar component
    this.m_verticalScrollbar = Scrollbar.createAsChild( this.m_scrollbarCell,
                                                        this.getElement().id + "VerticalScrollbar",
                                                        true,
                                                        null,
                                                        false );
                  
    var thisObj = this;                                      
    this.m_verticalScrollbar.addPositionChangeListener( function() { thisObj._handleVerticalScroll(); } );
    
    // Append scroll bar cell to parent table row.
    this.m_tableRow.appendChild(this.m_scrollbarCell);
    
}

/**
 *  Method removes a vertical scrollbar from the framework select element dropdown.
 *
*/
FwSelectElementRenderer.prototype._removeDynamicDropDownScrollbar = function()
{
    // Dispose of scrollbar
    this.m_verticalScrollbar.dispose();
    this.m_verticalScrollbar = null;
    
    // Remove scrollbar HTML components
    var childNodes = this.m_scrollbarCell.childNodes;
    
    for(var k = childNodes.length - 1; k >= 0; k--)
    {
        this.m_scrollbarCell.removeChild( childNodes[k] );
    }
    
    // Remove table cell containing scrollbar
    this.m_tableRow.removeChild( this.m_scrollbarCell );
    
    this.m_scrollbarCell = null;
    
}

/**
 * Method calculates the required width of the select component when
 * using dynamic widths.
 *
*/
FwSelectElementRenderer.prototype._setSelectElementWidth = function(numberOfSelectDataRows)
{
    // Determine properties of select options rows
    var rowProperties = this._determineRowProperties(numberOfSelectDataRows);
    
    this.m_maxRowWidth = rowProperties[ "maxWidth" ];
    
    var rowPaddingWidth = rowProperties[ "rowPaddingWidth" ];
    
    if(null != this.m_maxRowWidth && null != rowPaddingWidth)
    {
        var dropdownBorderWidth = this._getBorderWidth( this.m_dropDownField._getDropDownElement() );
        
        var totalSelectElementWidth = this.m_maxRowWidth +
                                      rowPaddingWidth +
                                      dropdownBorderWidth +
                                      FwSelectElementRenderer.SCROLLCELL_CSS_WIDTH;
                                      
        // Set element width
       this.getElement().style.width = totalSelectElementWidth + "px";
       
       // Explicitly set width of dropdown component such that it sizes correctly
       this.m_dropDownField._getDropDownElement().style.width = ( totalSelectElementWidth -
                                                                  dropdownBorderWidth ) +
                                                                  "px";
    }
    
}

/**
 * Method determines the maximum row width required to display the current
 * select options plus the current padding width.
 *
 * @param numberOfSelectDataRows The current number of select options.
 *
 * @return Returns an object containing the maximum row width and the total
 *         of the left and right padding values for the select rows.
 *
*/
FwSelectElementRenderer.prototype._determineRowProperties = function(numberOfSelectDataRows)
{
    var doc = window.document;
    
    // Create temporary table into which current select options can be loaded.
    var container = doc.createElement( "div" );
    doc.appendChild(container)
    
    var table = doc.createElement( "table" );
    table.className = FwSelectElementRenderer.TEMP_TABLE_CSS_CLASS_NAME;
    
    table.setAttribute( "cellspacing", "0px" );
    table.setAttribute( "cellpadding", "0px" );
    
    container.appendChild( table );
    
    var tableBody = doc.createElement( "tbody" );
    
    tableBody.setAttribute( "align", "left" );
    
    table.appendChild( tableBody );
    
    var tableRow = doc.createElement( "tr" );
    tableRow.className = FwSelectElementRenderer.TABLEROW_CSS_CLASS_NAME;
    
    tableBody.appendChild( tableRow );
    
    var rowsCell = doc.createElement( "td" );
    rowsCell.className = FwSelectElementRenderer.ROWCELL_CSS_CLASS_NAME;
    
    tableRow.appendChild( rowsCell );
    
    // Create row into which select options will be written
    var row = doc.createElement( "div" );
    row.className = FwSelectElementRenderer.ROW_CSS_CLASS_NAME;
    
    rowsCell.appendChild( row );
    
    // Determine maximum row width
    var rowWidth = 0;
    var maxRowWidth = 0;
    
    for(var i = 0; i < numberOfSelectDataRows; i++)
    {
        var text = this.m_model.getMatch( i );
        
        this._setRowContent( row, text );
        
        rowWidth = row.offsetWidth;
        
        if(null != rowWidth)
        {
            if(rowWidth > maxRowWidth)
            {
                maxRowWidth = rowWidth;
            }
        }
        
    }
    
    // Increase maximum row width to account for border around input field and button.
    maxRowWidth += this._getBorderWidth( this.m_dropDownField.m_borderDiv );
    
    // Determine width of row padding
    var rowPaddingWidth = this._getPaddingWidth( row );
    
    // Construct return object
    var rowProperties = new Object();
    
    rowProperties[ "maxWidth" ] = maxRowWidth;
    rowProperties[ "rowPaddingWidth" ] = rowPaddingWidth;
    
    // Delete temporary table and all contents
    this._removeChildNodes( row );
    
    rowsCell.removeChild( row );
    row = null;
    
    tableRow.removeChild( rowsCell )
    rowsCell = null;
    
    tableBody.removeChild( tableRow );
    tableRow = null;
    
    table.removeChild( tableBody );
    tableBody = null;
    
    container.removeChild( table );
    table = null;
    
    doc.removeChild(container);
    container = null;
    
    // Return row properties
    return rowProperties;
}

/**
 * Method sets text displayed in a select option "row".
 *
 * @param row  The "div" representing a row of the select
 * @param text The text to be displayed
 *
*/
FwSelectElementRenderer.prototype._setRowContent = function( row, text )
{
    // Clean row content
    this._removeChildNodes( row );
    
    var textNodeContent = text;
    
    if(null == textNodeContent || "" == textNodeContent)
    {
        textNodeContent = "\u00a0";
    }
    
    var tn = window.document.createTextNode(textNodeContent);
    
    row.appendChild(tn);
}

/**
 * Method removes an HTML element's child nodes.
 *
*/
FwSelectElementRenderer.prototype._removeChildNodes = function(element)
{
    var childNodes = element.childNodes;
    
    for(var k = childNodes.length - 1; k >= 0; k--)
    {
        element.removeChild( childNodes[k] );
    }
}

/**
 * Method determines the total of an element's left and right border
 * width values when these values are defined in pixels.
 *
 * @param element An HTML element.
 *
 * @return Integer value representing combined left and right border widths in pixels.
 *
*/
FwSelectElementRenderer.prototype._getBorderWidth = function( element )
{
    var borderWidth = 0;
    
    var pixels = "px";
    
    // Retrieve current style for element
    var elementStyle = getCalculatedStyle(element);
    
    var borderLeft = null;
    var borderLeftWidth = elementStyle.borderLeftWidth;
    
    if(borderLeftWidth.indexOf(pixels) != -1)
    {
        borderLeft = parseInt(borderLeftWidth);
    }
    
    var borderRight = null;
    var borderRightWidth = elementStyle.borderRightWidth;
    
    if(borderRightWidth.indexOf(pixels) != -1)
    {
        borderRight = parseInt(borderRightWidth);
    }
    
    if(null != borderLeft)
    {
        borderWidth += borderLeft;
    }
    
    if(null != borderRight)
    {
        borderWidth += borderRight;
    }
    
    return borderWidth;
}

/**
 * Method returns total of left and right padding valuess for the select component's
 * select rows in pixels.
 *
 * @return Sum of left and right padding values for "divs" representing select
 *         options.
 *
*/
FwSelectElementRenderer.prototype._getDropDownRowPaddingWidth = function()
{
    var paddingWidth = 0;
    
    if(null != this.m_rows && this.m_rows.length > 0)
    {
        // First locate row with correct class
        
        var rows = this.m_rows;
        var row = null;
        
        for(var i = 0, l = rows.length; i < l; i++)
        {
            var r = rows[i];
            
            if(r.className.indexOf( FwSelectElementRenderer.ROW_CSS_CLASS_NAME ) != -1)
            {
                row = r;
                break;
            }
        }
        
        if(null != row)
        {
            paddingWidth = this._getPaddingWidth( row );
        }
        
    }
    
    return paddingWidth;
}

/**
 * Method returns the sum of an HTML element's left and right padding values
 * in pixels.
 *
 * @param element An HTML element.
 *
 * @return Integer value representing combined left and right padding widths in pixels.
 *
*/
FwSelectElementRenderer.prototype._getPaddingWidth = function(element)
{
    var paddingWidth = 0;
    
    var pixels = "px";
    
    var elementStyle = getCalculatedStyle( element );
    
    var paddingLeft = elementStyle.paddingLeft;
    var paddingLeftWidth = null;
            
    if(paddingLeft.indexOf(pixels) != -1)
    {
        paddingLeftWidth = parseInt(paddingLeft);
    }
            
    var paddingRight = elementStyle.paddingRight;
    var paddingRightWidth = null;
            
    if(paddingRight.indexOf(pixels) != -1)
    {
        paddingRightWidth = parseInt(paddingRight);
    }
            
    if(null != paddingLeftWidth)
    {
        paddingWidth += paddingLeftWidth;
    }
            
    if(null != paddingRightWidth)
    {
        paddingWidth += paddingRightWidth;
    }
    
    return paddingWidth;
    
}
    
    

