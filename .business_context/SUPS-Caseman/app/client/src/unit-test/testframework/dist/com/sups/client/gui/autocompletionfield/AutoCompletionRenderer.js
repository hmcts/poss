//==================================================================
//
// AutoCompletionRenderer.js
//
//==================================================================


/**
 * Interface for AutoCompletionModel
 */
function IAutoCompletionModel() {}


IAutoCompletionModel.prototype.setMatchString = function(match)
{
}


/**
 * Get the display value of the match identified by the matchNumber parameter
 *
 * @param matchNumber the match number to retrieve
 * @return the display value for the match identified by the matchNumber
 * @type String
 */
IAutoCompletionModel.prototype.getMatch = function(matchNumber)
{
}

/**
 * Get the key for the match identified by the matchNumber parameter
 *
 * @param matchNumber the key to retrieve
 * @return the key for the match identified by the matchNumber
 * @type String
 */
IAutoCompletionModel.prototype.getMatchKey = function(matchNumber)
{
}

/*
function AutoCompletionMatch(displayValue)
{
	this.m_displayValue = displayValue;
}

AutoCompletionMatch.prototype.getDisplayValue = function()
{
	return this.m_displayValue;
}
*/


/**
 * AutoCompletion field renderer
 *
 * @constructor
 */
function AutoCompletionRenderer()
{
}


/**
 * AutoCompletionRenderer is a sub class of Renderer
 */
AutoCompletionRenderer.prototype = new Renderer();
AutoCompletionRenderer.prototype.constructor = AutoCompletionRenderer;


AutoCompletionRenderer.m_logger = new Category("AutoCompletionRenderer");
AutoCompletionRenderer.prototype.m_handlersStarted = false;


/**
 * Array containing the divs representing the rows in the dropdown
 *
 * @type Array[HTMLDivElement]
 * @private
 */
AutoCompletionRenderer.prototype.m_rows = null;


/**
 * The row currently highlighted (but not selected!) by the user.
 * 
 *
 * @type Integer
 * @private
 */
AutoCompletionRenderer.prototype.m_highlightedRow = null;


/**
 * Maximum allowed number of rows in autocomplete.
 *
 * @type Integer
 * @private
*/
AutoCompletionRenderer.prototype.m_maxNumberOfRows = null;

/**
 * Number of visible rows.
 *
 * @type Integer
 * @private
 */
AutoCompletionRenderer.prototype.m_visibleRows = null;

/**
 * The top visibile row
 *
 * @type Integer
 * @private
 */
AutoCompletionRenderer.prototype.m_topRow = null;

/**
 * The top visibile row
 *
 * @type Integer
 * @private
 */
AutoCompletionRenderer.prototype.m_selectionMode = null;

/**
 * The row that the user has selected. May be null if the user
 * hasn't selected a row. To select a row the user must either
 * double click on a row or press return while it is highlighted.
 */
AutoCompletionRenderer.prototype.m_selectedRow = null;

/**
 * Listeners to be notified when the value of the component changes
 */
AutoCompletionRenderer.prototype.m_valueChangeListeners = null;

/**
 * Key binding flag - static required to prevent keys after submit/cancel key(s)
 * raising the drop down
 */
AutoCompletionRenderer.showDropDown = true;

/**
 * Reference to main table row in autocompletion dropdown component
 *
*/
AutoCompletionRenderer.prototype.m_tableRow = null;

/**
 * Reference to table row cell used to store matches in divs.
 *
*/
AutoCompletionRenderer.prototype.m_rowsCell = null;

/**
 * Reference to table row cell used to store scrollbar when present
 *
*/
AutoCompletionRenderer.prototype.m_scrollbarCell = null;

/**
 * Reference to vertical scrollbar component when present
 *
*/
AutoCompletionRenderer.prototype.m_verticalScrollbar = null;

/**
 * Reference to array of all the selects in the document visibility and disabled state
 *
*/
AutoCompletionRenderer.prototype.m_selectsState = new Array(PopupLayer.m_allSelects.length);

/**
 * Reference to popup layer that this renderer's dropdown will be shown in
 *
*/
AutoCompletionRenderer.prototype.m_popupLayerCount = null;

AutoCompletionRenderer.CSS_CLASS_NAME = "autocomplete";
AutoCompletionRenderer.TABLE_CSS_CLASS_NAME = "autocomplete_table";
AutoCompletionRenderer.TABLEROW_CSS_CLASS_NAME = "autocomplete_tablerow";
AutoCompletionRenderer.ROWCELL_CSS_CLASS_NAME = "autocomplete_rowscell";
AutoCompletionRenderer.SCROLLCELL_CSS_CLASS_NAME = "autocomplete_scrollcell";
AutoCompletionRenderer.ROW_CSS_CLASS_NAME = "autocomplete_row";
AutoCompletionRenderer.ROW_HIDDEN_CSS_CLASS_NAME = AutoCompletionRenderer.ROW_CSS_CLASS_NAME + " autocomplete_rowhidden";
AutoCompletionRenderer.ROW_SELECTED_CSS_CLASS_NAME = AutoCompletionRenderer.ROW_CSS_CLASS_NAME + " autocomplete_rowselected";
AutoCompletionRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME = AutoCompletionRenderer.ROW_CSS_CLASS_NAME + " autocomplete_rowSelectedNotSubmissible";
AutoCompletionRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME = AutoCompletionRenderer.ROW_CSS_CLASS_NAME + " autocomplete_rowNotSubmissible";
AutoCompletionRenderer.DEFAULT_NUMBER_OF_ROWS = 8;

// Settings for button
AutoCompletionRenderer.REPEAT_INITIAL_DELAY = 1000;
AutoCompletionRenderer.REPEAT_INTERVAL = 200;

// Single matching states
AutoCompletionRenderer.DONT_MATCH = 2;
AutoCompletionRenderer.MATCH = 3;
AutoCompletionRenderer.FOUND_MATCH = 4;

// Drop down changing rows states
AutoCompletionRenderer.NO_CHANGE = 5;
AutoCompletionRenderer.ADDING_ROWS = 6;
AutoCompletionRenderer.REMOVING_ROWS = 7;

/**
 * Create an autocomplete at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the autocomplete being created
 * @param maxRows the maximum number of rows in the drop down menu
 */
AutoCompletionRenderer.createInline = function(id, maxRows)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the autocomplete being created
		false		// The autocomplete has an internal input element which can accept focus, so the div should not accept focus
	);

	return AutoCompletionRenderer._create(e, maxRows);
}


/**
 * Create an autocomplete in the document relative to the supplied element
 *
 * @param refElement the element relative to which the autocomplete should be rendered
 * @param relativePos the relative position of the autocomplete to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the autocomplete being created
 * @param maxRows the maximum number of rows in the drop down menu
 */
AutoCompletionRenderer.createAsInnerHTML = function(refElement, relativePos, id, maxRows)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the autocomplete being created
		false			// The autocomplete has an internal input element which can accept focus, so the div should not accept focus
	);

	return AutoCompletionRenderer._create(e, maxRows);
}


/**
 * Create an autocomplete as a child of another element
 *
 * @param p the parent element to which the autocomplete should be added
 * @param id the id of the autocomplete being created
 * @param maxRows the maximum number of rows in the drop down menu
 */
AutoCompletionRenderer.createAsChild = function(p, id, maxRows)
{
	var e = Renderer.createAsChild(id);

	// Append the autocomplete's outer div to it's parent element
	p.appendChild(e);	
	
	return AutoCompletionRenderer._create(e, maxRows);
}


AutoCompletionRenderer._create = function(e, maxRows)
{
	e.className = AutoCompletionRenderer.CSS_CLASS_NAME;
	
	var ac = new AutoCompletionRenderer();
	
	// Initialise sets main element and the reference to the renderer in the dom
	ac._initRenderer(e);	
	
	// Default the number of rows to 8 if not specified
	if(null == maxRows)
	{
		ac.m_maxNumberOfRows = AutoCompletionRenderer.DEFAULT_NUMBER_OF_ROWS;
	}
	else
	{
		ac.m_maxNumberOfRows = maxRows;
	}
	
	// Initialise the DropDownField part of the renderer
	ac.m_dropDownField = DropDownFieldRenderer.createAsChild(e);
	
	// Listen for show hide events
	ac.m_dropDownField.addShowHideListener(function(show) {ac._handleDropDownShowHide(show);});
	
	// Get the dropdown container
	var dropdown = ac.m_dropDownField._getDropDownElement();
	
	// Prevent selection of content in the dropdown
	preventSelection(dropdown);

	// Local reference to the document that we are adding elements to
	var d = window.document;

	// Create table to hold rows and scrollbar
	var table = d.createElement("table");
	table.className = AutoCompletionRenderer.TABLE_CSS_CLASS_NAME;
	
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
	ac.m_tableRow = tableRow;
	
	tableRow.className = AutoCompletionRenderer.TABLEROW_CSS_CLASS_NAME;

	var rowsCell = d.createElement("td");
	ac.m_rowsCell = rowsCell;
	rowsCell.className = AutoCompletionRenderer.ROWCELL_CSS_CLASS_NAME;

	tableRow.appendChild(rowsCell);
	tableBody.appendChild(tableRow);
	table.appendChild(tableBody);
	
	dropdown.appendChild(table);

	// Create new callback list for value change listeners
	ac.m_valueChangeListeners = new CallbackList();
	
	// No model yet
	ac.m_model = null;

	// Started in render() method
	//ac.startEventHandlers();
	
	return ac.m_dropDownField.m_element;
}


AutoCompletionRenderer.prototype.startEventHandlers = function()
{
	// Makes this call idempotent
	if(!this.m_handlersStarted)
	{	
		this.m_handlersStarted = true;
		
		if(this.m_verticalScrollbar != null)
		{
			this.m_verticalScrollbar.startEventHandlers();
		}

		var ac = this;
		this.m_keyupHndlr = SUPSEvent.addEventHandler(this.m_element, 'keyup', function(evt) { return ac._handleKeyUpEvent(evt); });
		this.m_keydownHndlr = SUPSEvent.addEventHandler(this.m_element, 'keydown', function(evt) { return ac._handleKeyDownEvent(evt); });

		// Started in DropDownFieldRenderer render() method
		//this.m_dropDownField.startDropDownEventHandlers();
		
		this.m_rowsCell.onclick = function(evt) { ac._handleClick(evt); };
		this.m_rowsCell.ondblclick = function(evt) { ac._handleDoubleClick(evt); };
		this.m_rowsCell.onmouseover = function(evt) { ac._handleMouseOver(evt); };
	}
}


AutoCompletionRenderer.prototype.stopEventHandlers = function()
{
	// Makes this call idempotent
	if(this.m_handlersStarted)
	{
		this.m_handlersStarted = false;

		if(this.m_verticalScrollbar != null)
		{
			this.m_verticalScrollbar.stopEventHandlers();
		}

		SUPSEvent.removeEventHandlerKey(this.m_keyupHndlr);
		this.m_keyupHndlr = null;

		SUPSEvent.removeEventHandlerKey(this.m_keydownHndlr);		
		this.m_keydownHndlr = null;

		// Stopped in DropDownFieldRenderer render() method
		//this.m_dropDownField.stopDropDownEventHandlers();
		
		this.m_rowsCell.onclick = null;
		this.m_rowsCell.ondblclick = null;
		this.m_rowsCell.onmouseover = null;
	}
}


AutoCompletionRenderer.prototype.dispose = function()
{
	this.stopEventHandlers();
	
	// Remove selection prevention event handler from drop down
	unPreventSelection(this.m_dropDownField._getDropDownElement());
	
	this.m_model = null;
	
	if(this.m_verticalScrollbar != null)
	{	
		this.m_verticalScrollbar.dispose();
	    this.m_verticalScrollbar = null;
	}

	// Dispose of HTML references
	if(this.m_rows != null)
	{
	    for(var i = 0, l = this.m_rows.length; i < l; i++)
	    {
	        this.m_rows[i] = null;
	    }
	    
	    this.m_rows = null;
	}
	
	this.m_tableRow = null;
	this.m_rowsCell = null;
	
	if(this.m_scrollbarCell != null)
	{
	    this.m_scrollbarCell = null;
	}
		
	this.m_dropDownField.dispose();
	
	this.m_valueChangeListeners.dispose();
	delete this.m_valueChangeListeners;
}



/*
 * Add a listener which will be called if the display value of the 
 * field changes.
 *
 * @param callback the function invoked when the value changes
 */
AutoCompletionRenderer.prototype.addValueChangeListener = function(callback)
{
	this.m_valueChangeListeners.addCallback(callback);
} 

AutoCompletionRenderer.prototype.setSelectionMode = function(mode)
{
	this.m_selectionMode = mode;
}

AutoCompletionRenderer.prototype.setModel = function(model)
{
	this.m_model = model;
}


/**
 * Handle changes in the postion of the vertical scrollbar
 *
 * @private
 */
AutoCompletionRenderer.prototype._handleVerticalScroll = function()
{
	if(this.m_topRow != this.m_verticalScrollbar.m_position)
	{
		this.m_topRow = this.m_verticalScrollbar.m_position;
	
		this._renderRows();
	}
}


/**
 * Handle changes in the dropdown's visibility state
 *
 * @param show true if the dropdown has been shown or false if it has been hidden
 * @private
 */
AutoCompletionRenderer.prototype._handleDropDownShowHide = function(show)
{
	if(show)
	{
		if(null == this.m_model)
		{
			// Set the scaling of the scrollbar to a sensible default
			this.m_verticalScrollbar.setScaling(0, 100, 100);
		}
		else
		{
			if(null == this.m_popupLayerCount)
			{
				// First time that dropdown has been shown, so store the
				// popup layer that this dropdown popup is shown in
				this.m_popupLayerCount = PopupLayer.m_popupCount - 1;
			}
			
		    // Update contents of dropdown component
			this._createDynamicDropDownContent();
			
			// Drop down may have been shown with more rows than required. In this case the popup layer
			// may have hidden selects that are visible when the drop down content is updated. Find all
			// the hidden selects and check that they are still overlapped. If they are not then restore
			// them to their previous visibility and disabled state.
			var hiddenSelects = this.m_dropDownField.m_popupLayer.m_hiddenSelects[this.m_popupLayerCount];
			
			if(hiddenSelects != null)
			{
				var container = this.m_rowsCell;

				// Currently popup layer puts all selects in the document in the hidden selects array,
				// even if they aren't hidden. This enables us to keep a simple 1 to 1 mapping between
				// the popup layer arrays and our select state array
				for(var i = hiddenSelects.length - 1; i >= 0; i--)
				{
					var s = hiddenSelects[i];
					var element = s.element;
					
					if(element.style.visibility == "hidden")
					{
	        			// Store the previous state of the hidden select
	        			var selectState = new Object();
						selectState.visibility = s.prevState;
						selectState.disabled = s.prevDisabled;
						
						this.m_selectsState[i] = selectState;
						
			    		// Check if select control is still overlapped by the drop down			
						if(!isContained(element, container))
						{
							// Not overlapped, so restore it's previous visibility and enabled state
							element.style.visibility = s.prevState;
							element.disabled = s.prevDisabled;
						}
						
						selectState = null;
    				}
				}
			}
			
			this._showMatches();
		}
	}
}


/**
 * Handle a click event on one of the rows in the drop down
 *
 * @param evt the click event - null on IE
 */
AutoCompletionRenderer.prototype._handleClick = function(evt)
{
	if (null == evt) evt = window.event;
	
	var target = SUPSEvent.getTargetElement(evt);

	// If this is IE evt.detail will not be defined, however IE does not call
	// click handler twice on a double click. In Mozilla click handler is called
	// for each click and evt.detail contains the number of sucessive clicks, so
	// for a double click evt.detail will be two - we only want to handle single
	// clicks here so ignore clicks with evt.detail != 1. All double clicks are
	// handled in _handleDoubleClick below.
    if(evt.detail == undefined || evt.detail == 1)
	{
		/*
		 * D434 - Highlighting of rows is now in _handleMouseOver() method
		 *
		for(var i = 0, l = this.m_rows.length; i < l ; i++)
		{
			if(target == this.m_rows[i])
			{
				break;
			}
		}
		
		if(i < l)
		{
			this.m_highlightedRow = i + this.m_topRow;
			this._renderRows();
			
			// If we are in click update mode then we set the value in the data model at this point
			if(this.m_updateMode == AutocompletionGUIAdaptor.CLICK_MODE)
			{
				this._useCurrentMatch();
			}
		}
		*/

		// If we are in click update mode then we set the value in the data model at this point
		if(this.m_selectionMode == AutocompletionGUIAdaptor.CLICK_MODE)
		{
			this._useCurrentMatch();
		}		
	}
}


/**
 * Handle a double click on one of the rows in the drop down
 *
 * @param evt the double click event - null on IE
 * @private
 */
AutoCompletionRenderer.prototype._handleDoubleClick = function(evt)
{
	// A row will have been selected in _handleMouseOver - we 
	// just need to use it.
	this._useCurrentMatch();
}


/**
 * Mouseover handler. Highlights the row as the mouse is moved into it.
 *
 * @param evt the event structure.
 * @private
 */
AutoCompletionRenderer.prototype._handleMouseOver = function(evt)
{
	if (null == evt) evt = window.event;
	
	var target = SUPSEvent.getTargetElement(evt);
	
	for(var i = 0, l = this.m_rows.length; i < l ; i++)
	{
		if(target == this.m_rows[i])
		{
			break;
		}
	}
	
	if(i < l)
	{
		this.m_highlightedRow = i + this.m_topRow;
		this._renderRows();
	}
}


/**
 * Key up handler for autocompletion field
 *
 * @param evt the event structure.
 * @return true to allow the event to propogate
 * @private
 */
AutoCompletionRenderer.prototype._handleKeyUpEvent = function(evt)
{
	// If IE the use the global event 
	evt = (null != evt) ? evt : window.event;
		
	// Get the keycode from the event - the same on IE and W3C compliant browsers
	var eventKeyCode = evt.keyCode;

	if(eventKeyCode == Key.ArrowUp.m_keyCode || eventKeyCode == Key.ArrowDown.m_keyCode) 
	{
		// Up/down arrow scrolling processed in key down handler, just show
		// drop down here
  		if(!this.m_dropDownField.isRaised())
		{
			// Update contents of dropdown component before showing it
			this._createDynamicDropDownContent();
			
			this.m_dropDownField.showDropDown();
		}
	}
	else if(eventKeyCode == Key.Return.m_keyCode)
	{
		this._useCurrentMatch();
	}
	else if(eventKeyCode == Key.Tab.m_keyCode ||
			eventKeyCode == Key.ESC.m_keyCode ||
			eventKeyCode == Key.PageUp.m_keyCode || eventKeyCode == Key.PageDown.m_keyCode ||
			eventKeyCode == Key.ScrollLock.m_keyCode ||
			eventKeyCode == Key.PrintScreen.m_keyCode ||
			eventKeyCode == Key.Insert.m_keyCode ||
			eventKeyCode == Key.NumLock.m_keyCode ||
			eventKeyCode == Key.Menu.m_keyCode ||
			eventKeyCode == Key.Home.m_keyCode || eventKeyCode == Key.End.m_keyCode ||
			eventKeyCode == Key.Windows.m_keyCode)
	{
		// Ignore tabs - handled by focus in/out anyway. This prevents the
		// drop down being raised when the user first tabs into the field
		
		// Ignore esc - handled by drop down field anyway. This prevents the
		// drop down hiding itself then immediately showing itself again
		
		// Ignore miscellaneous keys - prevents the drop down from showing
		// for these keys
	}
	else
	{
		if (AutoCompletionRenderer.m_logger.isDebug()) AutoCompletionRenderer.m_logger.debug("KeyHandler about to showMatches for key: " +  eventKeyCode);
		
		// If a key is bound via the Key Binding protocol or Event Binding then
		// we don't want to show the drop down.
		var keyBindings = new Array();
		keyBindings.push(this.m_guiAdaptor.getKeyBindings());

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
		
		AutoCompletionRenderer.showDropDown = true;
		
		for(var i = 0, l = keyBindings.length; i < l; i++)
		{
			if(keyBindings[i].m_keys[keyCodeString] != null &&
				keyBindings[i].m_qualifiers[keyCodeString] == qualifiers)
			{
				AutoCompletionRenderer.showDropDown = false;
			}
		}
		
  		if(this.m_dropDownField.isRaised())
		{
			// Popup is visible	
			if(!AutoCompletionRenderer.showDropDown)
			{
				// Hide before matched key binding action occurs		
				this.m_dropDownField.hideDropDown();
			}
			else
			{
			    // Update contents of dropdown component
    			var change = this._createDynamicDropDownContent();
				
				if(change != AutoCompletionRenderer.NO_CHANGE)
				{
					// Adding or removing dropdown rows
					this._refreshSelectElements(change);
				}
				
				this._showMatches();
			}
		}
		else if(AutoCompletionRenderer.showDropDown)
		{
			// Popup is not visible and no matched key binding need to show it
			
			// Check for printable key
			if((Key.isPrintableKey(eventKeyCode) &&
					!evt.ctrlKey && !evt.altKey &&
						!Key.isFunctionKey(eventKeyCode)) ||
								(eventKeyCode == Key.Backspace.m_keyCode))
			{
				// Key is printable, so OK to show
				
				// Update contents of dropdown component before showing it
				this._createDynamicDropDownContent();
				
				this.m_dropDownField.showDropDown();
			}
		}
	}

	return true;
}


/**
 * Key down handler for autocompletion field. Move selection up/down drop down
 * if up/down arrows keys held down.
 *
 * @param evt the event structure.
 * @return true to allow the event to propogate
 *
 * @private
 */
AutoCompletionRenderer.prototype._handleKeyDownEvent = function(evt)
{
	// If IE the use the global event
	evt = (null != evt) ? evt : window.event;
	
	// Get the keycode from the event
	var eventKeyCode = evt.keyCode;
	var propagateEvent = true;
	
	// If the popup is not raised let the key up handler process the key
	if(this.m_dropDownField.isRaised())
	{
		switch(eventKeyCode)
		{
			case Key.ArrowUp.m_keyCode:
			{
				this._selectPreviousMatch();
				break;
			}
			case Key.ArrowDown.m_keyCode:
			{
				this._selectNextMatch();
				break;
			}
			case Key.PageUp.m_keyCode:
			{
				this._selectPreviousPageMatch();
				
				// Prevent cursor moving to the start of the text in the input field
	    		SUPSEvent.preventDefault(evt);
				propagateEvent = false;
				
				break;
			}
			case Key.PageDown.m_keyCode:
			{
				this._selectNextPageMatch();
				
				// Prevent cursor moving to the end of the text in the input field
	    		SUPSEvent.preventDefault(evt);
				propagateEvent = false;
				
				break;
			}
			case Key.Home.m_keyCode:
			{
				this._selectFirstMatch();
				
				// Prevent cursor moving to the start of the text in the input field
	    		SUPSEvent.preventDefault(evt);
				propagateEvent = false;
				
				break;
			}
			case Key.End.m_keyCode:
			{
				this._selectLastMatch();
				
				// Prevent cursor moving to the end of the text in the input field
	    		SUPSEvent.preventDefault(evt);
				propagateEvent = false;
				
				break;
			}
		}
	}

	// Only perform single match processing if adaptor is in strict validation mode
	if(this.m_guiAdaptor.strictValidation)
	{
		var currentSelection = document.selection.createRange();

		if(eventKeyCode == Key.Backspace.m_keyCode ||
		  (evt.ctrlKey && (eventKeyCode == Key.CHAR_X.m_keyCode || eventKeyCode == Key.CHAR_x.m_keyCode)))
		{
			// Delete or cut, so we don't want to autocomplete single matches
			this.m_matchSingle = AutoCompletionRenderer.DONT_MATCH;
		}
		else if(currentSelection.text.length != 0)
		{
			// Text is selected
			
			if(eventKeyCode == Key.Delete.m_keyCode)
			{
				// Deleting selection, so we don't want to autocomplete single matches
				this.m_matchSingle = AutoCompletionRenderer.DONT_MATCH;
			}
			else if(eventKeyCode != Key.Tab.m_keyCode &&
			   eventKeyCode != Key.Home.m_keyCode && eventKeyCode != Key.End.m_keyCode &&
			   eventKeyCode != Key.PageUp.m_keyCode && eventKeyCode != Key.PageDown.m_keyCode &&
			   eventKeyCode != Key.ArrowLeft.m_keyCode && eventKeyCode != Key.ArrowRight.m_keyCode)
			{
				// Tab key selects text when moving into field, navigation keys de-select text.
				// Any other key press will replace the text, so allow single matching
				this.m_matchSingle = AutoCompletionRenderer.MATCH;
			}
		}
		else
		{
			// No text is selected
			
			if(this.m_matchSingle == AutoCompletionRenderer.FOUND_MATCH)
			{
				// Already matched, so only allow navigation and edit keys. Any others are blocked
		
				if(eventKeyCode != Key.Home.m_keyCode && eventKeyCode != Key.End.m_keyCode &&
				   eventKeyCode != Key.PageUp.m_keyCode && eventKeyCode != Key.PageDown.m_keyCode &&
				   eventKeyCode != Key.ArrowLeft.m_keyCode && eventKeyCode != Key.ArrowRight.m_keyCode &&
				 !(evt.ctrlKey && (eventKeyCode == Key.CHAR_A.m_keyCode || eventKeyCode == Key.CHAR_a.m_keyCode ||
				 				   eventKeyCode == Key.CHAR_C.m_keyCode || eventKeyCode == Key.CHAR_c.m_keyCode ||
				                   eventKeyCode == Key.CHAR_Z.m_keyCode || eventKeyCode == Key.CHAR_z.m_keyCode ||
				                   eventKeyCode == Key.CHAR_Y.m_keyCode || eventKeyCode == Key.CHAR_y.m_keyCode)))							 
				{

					// Not navigation or edit keys, so block key press
	    			SUPSEvent.preventDefault(evt);
					propagateEvent = false;
				}
			}
			else if(Key.isPrintableKey(eventKeyCode) && !Key.isFunctionKey(eventKeyCode) &&
				   !evt.ctrlKey && !evt.altKey)
			{
				// Valid key press, so allow single matching
				this.m_matchSingle = AutoCompletionRenderer.MATCH;
			}
		}
	}
	
	return propagateEvent;
}


AutoCompletionRenderer.prototype._useCurrentMatch = function()
{
	if(this.m_highlightedRow != null)
	{
		this.m_dropDownField._getInputFieldElement().value = this.m_model.getMatch(this.m_highlightedRow);
		
		// The selected row is the currently highlighted row
		this.m_selectedRow = this.m_highlightedRow;
		
		if(this.m_guiAdaptor.strictValidation)
		{
			// Selecting via a row in the drop down, is the same as
			// single matching via the keyboard
			this.m_matchSingle = AutoCompletionRenderer.FOUND_MATCH;
		}
	}
	
	// Hide the drop down
	this.m_dropDownField.hideDropDown();
	
	// Notify listeners that the value has changed.
	this.m_valueChangeListeners.invoke();
}


AutoCompletionRenderer.prototype._showMatches = function()
{
	if(this.m_model != null)
	{
		this.m_numberOfMatches = this.m_model.setMatchString(this.getTextFieldValue());
				
		// Reset the current selection
		this.m_topRow = 0;
		this.m_highlightedRow = null;
		this.m_selectedRow = null;
		
		// Size the scrollbar appropriately & determine how many rows are visible
		var scale = null;
		
		if (this.m_rows.length > this.m_numberOfMatches)
		{
			scale = this.m_rows.length;
			this.m_visibleRows = this.m_numberOfMatches;
		}
		else
		{
			scale = this.m_numberOfMatches;
			this.m_visibleRows = this.m_rows.length;
		}

		if(this.m_verticalScrollbar != null)
		{	
			// Size the scrollbar correctly
			this.m_verticalScrollbar.setScaling(0, this.m_rows.length, scale);
		}
		
		this._renderRows();
		
		// Only autocomplete single matches if adaptor is in strict validation mode
		// and single matching enabled
		if(this.m_guiAdaptor.strictValidation && this.m_guiAdaptor.m_singleMatchingEnabled)
		{
			// Only autocomplete if one match and not already matched a single entry
			if (this.m_numberOfMatches == 1 && this.m_matchSingle == AutoCompletionRenderer.MATCH)
			{
				this.m_matchSingle = AutoCompletionRenderer.FOUND_MATCH;

				// Set match in input box
				this.m_dropDownField._getInputFieldElement().value = this.m_model.getMatch(0);
				
				// Notify listeners of a change in value
				this.m_valueChangeListeners.invoke();
			}
		}
	}
}


AutoCompletionRenderer.prototype._renderRows = function()
{
	// Render the visible rows.
	var i;
	var topRow = this.m_topRow;
	for(i = 0, l = this.m_visibleRows; i < l ; i++)
	{
		this._renderRow(i);
	}

	var hiddenRowClass = AutoCompletionRenderer.ROW_HIDDEN_CSS_CLASS_NAME;
	for(i = this.m_visibleRows, l = this.m_rows.length; i < l; i++)
	{
		this.m_rows[i].className = hiddenRowClass;
	}
	
	if(this.m_verticalScrollbar != null)
	{
		// Position the scrollbar appropriately
		this.m_verticalScrollbar.setPosition(this.m_topRow);
		this.m_verticalScrollbar._render();
	}
}

AutoCompletionRenderer.prototype._renderRow = function(rowNumber)
{
	var dataRow = rowNumber + this.m_topRow;
	var r = this.m_rows[rowNumber];
	var text = this.m_model.getMatch(dataRow);
	
	this._setRowContent(r, text);
	
	var cN = "";
	var isSubmissible = this.m_model.isKeyForMatchSubmissible(dataRow);
	var isSelected = this.m_highlightedRow == dataRow;
	
	if(isSubmissible == true)
	{
		cN = isSelected ? AutoCompletionRenderer.ROW_SELECTED_CSS_CLASS_NAME : AutoCompletionRenderer.ROW_CSS_CLASS_NAME;
	}
	else
	{
		cN = isSelected ? AutoCompletionRenderer.ROW_SELECTED_AND_NOT_SUBMISSIBLE_CSS_CLASS_NAME : AutoCompletionRenderer.ROW_NOT_SUBMISSIBLE_CSS_CLASS_NAME;
	}
	
	r.className = cN;
	
	/*r.className = (this.m_highlightedRow == dataRow)
		? AutoCompletionRenderer.ROW_SELECTED_CSS_CLASS_NAME
		: AutoCompletionRenderer.ROW_CSS_CLASS_NAME;*/
}


AutoCompletionRenderer.prototype._selectPreviousMatch = function()
{
	if(0 == this.m_numberOfMatches)
	{
		// No matches, so do nothing
		return;
	}
	if(null == this.m_highlightedRow)
	{
		// First press of up arrow in drop down, so select first row
		this._moveSelection(0);
	}
	else if(this.m_highlightedRow != 0)
	{
		// Not at first row in matches, so select previous row
		this._moveSelection(this.m_highlightedRow - 1);
	}
}


AutoCompletionRenderer.prototype._selectNextMatch = function()
{
	if(0 == this.m_numberOfMatches)
	{
		// No matches, so do nothing
		return;
	}
	if(null == this.m_highlightedRow)
	{
		// First press of down arrow in drop down, so select first row
		this._moveSelection(0);
	}
	else if(this.m_highlightedRow != (this.m_numberOfMatches - 1))
	{
		// Not at last row in matches, so select next row
		this._moveSelection(this.m_highlightedRow + 1);
	}
}


AutoCompletionRenderer.prototype._selectPreviousPageMatch = function()
{
	var numberOfMatches  = this.m_numberOfMatches;
	
	if(numberOfMatches != 0 && this.m_highlightedRow != 0)
	{
		// Has some data and not at first row, so move selection up from the
		// highlighted row by the number of matched rows in the drop down
		
		var rowsInDropDown = this.m_rows.length;
		var rowsToPage = (numberOfMatches < rowsInDropDown) ? numberOfMatches : rowsInDropDown;		
		var rowToSelect = this.m_highlightedRow - rowsToPage + 1;
		
		if(rowToSelect < 0)
		{
			// Past first row in matches, so select first row
			rowToSelect = 0;
		}
		
		this._moveSelection(rowToSelect);
	}
}


AutoCompletionRenderer.prototype._selectNextPageMatch = function()
{
	var numberOfMatches  = this.m_numberOfMatches;
	var lastRow = numberOfMatches - 1;
	
	if(numberOfMatches != 0 && this.m_highlightedRow != lastRow)
	{
		// Has some data and not at last row, so move selection down from the
		// highlighted row by the number of matched rows in the drop down
		
		var rowsInDropDown = this.m_rows.length;
		var rowsToPage = (numberOfMatches < rowsInDropDown) ? numberOfMatches : rowsInDropDown;
		var rowToSelect = this.m_highlightedRow + rowsToPage - 1;
				
		if(rowToSelect > lastRow)
		{
			// Past last row in matches, so select last row
			rowToSelect = lastRow;
		}
		
		this._moveSelection(rowToSelect);
	}
}


AutoCompletionRenderer.prototype._selectFirstMatch = function()
{
	if(this.m_numberOfMatches != 0 && this.m_highlightedRow != 0)
	{
		// Has some data and not at first row, so move selection to the
		// first row in the drop down
		
		this._moveSelection(0);
	}
}


AutoCompletionRenderer.prototype._selectLastMatch = function()
{
	var numberOfMatches  = this.m_numberOfMatches;
	var lastRow = numberOfMatches - 1;
	
	if(numberOfMatches != 0 && this.m_highlightedRow != lastRow)
	{
		// Has some data and not at last row, so move selection to the
		// last row in the drop down
				
		this._moveSelection(lastRow);
	}
}


AutoCompletionRenderer.prototype._moveSelection = function(newSelectedRow)
{
	// If newly selected row is not visible make it visible
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


/**
 * Get the value of the text field of the dropdown
 */
AutoCompletionRenderer.prototype.getTextFieldValue = function()
{
	return this.m_dropDownField._getInputFieldElement().value;
}


AutoCompletionRenderer.prototype.resetSelectedMatch = function()
{
	this.m_selectedRow = null;
}

AutoCompletionRenderer.prototype.getSelectedMatch = function()
{
	return this.m_selectedRow;
}


AutoCompletionRenderer.prototype.setValue = function(value)
{
	// Don't want to display "null" in the field.
	if(value == null) value="";

	// Set the value of the field
	this.getInputElement().value = value;
}


AutoCompletionRenderer.prototype.dataUpdate = function()
{
    // Create or update contents of dropdown component
    var change = this._createDynamicDropDownContent();
	
	// If the dropdown is shown update it, otherwise wait until
	// dropdown is displayed
	if(this.m_dropDownField.isRaised())
	{
		if(change != AutoCompletionRenderer.NO_CHANGE)
		{
			// Adding or removing dropdown rows		
			this._refreshSelectElements(change);
		}
		
		this._showMatches();
	}
}


AutoCompletionRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isSubmissible, isServerValidationActive)
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


AutoCompletionRenderer.prototype.getInputElement = function()
{
	return this.m_dropDownField._getInputFieldElement();
}

/**
 * Set the width of the drop down rows, so that text that is too wide for the
 * row is clipped. (In IE, if the width is not set then the drop down outer
 * div changes to fit the width of the longest row in view as the rows are
 * scrolled up and down.)
 */
AutoCompletionRenderer.prototype._setRowWidth = function()
{
	// Use style rather than this.m_element.clientWidth because this can be zero
	// when display:none style is applied (As in the autocmpletion test page!).
	var style = getCalculatedStyle(this.m_guiAdaptor.getElement());
	
	var elementWidth = style.width.slice(0, -2);
	// If stylesheet hasn't loaded then this will be "auto", if so default to 180px
    elementWidth = isNaN(elementWidth) ? 180 : Number(elementWidth);
	
	style = getCalculatedStyle(this.m_dropDownField._getDropDownElement());
	
    var borderLeftWidth = style.borderLeftWidth.slice(0, -2);
    // If stylesheet hasn't loaded then this will be "medium", if so default to 1px
    borderLeftWidth = isNaN(borderLeftWidth) ? 1 : Number(borderLeftWidth);
	
    var borderRightWidth = style.borderRightWidth.slice(0, -2);
    // If stylesheet hasn't loaded then this will be "medium", if so default to 1px
    borderRightWidth = isNaN(borderRightWidth) ? 1 : Number(borderRightWidth);
	
	var borderWidth = borderLeftWidth + borderRightWidth;
	
	var scrollBarWidth = 0;
	if(this.m_verticalScrollbar != null)
	{
		scrollBarWidth = this.m_verticalScrollbar.m_element.clientWidth;
	}
	
	var rowWidth = elementWidth - scrollBarWidth - borderWidth;
	
	var rows = this.m_rows;

	for (var i = 0, l = rows.length; i < l; i++)
	{
		rows[i].style.width = rowWidth;
	}
	
	// Make the overall drop down width narrower by the border width
	var dropDown = this.m_dropDownField._getDropDownElement();
	dropDown.style.width = elementWidth - borderWidth;
}

/**
 * Method populates the autocompletion element dropdown component with match
 * rows.
 */
AutoCompletionRenderer.prototype._createDynamicDropDownContent = function()
{
	var change = AutoCompletionRenderer.NO_CHANGE;
            
    if(this.m_model != null)
    {
        var maxRows = this.m_maxNumberOfRows;
        var requiredRows = this.m_model.setMatchString(this.getTextFieldValue());
                
        if(0 == requiredRows)
        {
        	var srcDataRows = this.m_model.getSrcDataRowCount();
        	
        	// Set required rows in dropdown to lesser of source data and maximum rows
        	requiredRows = (srcDataRows != 0 && srcDataRows < maxRows) ? srcDataRows : maxRows;
        }
        
        if(null == this.m_rows)
        {
            // First time the dropdown has been displayed, so we need to create
            // the dropdown components
        
            // Stop event handlers if they have been started
            this.stopEventHandlers();
            
            if(requiredRows > maxRows)
            {
                // More rows required than rows in dropdown, so create rows
                // and vertical scrollbar in dropdown
                
                this._createDynamicDropDownRows(maxRows);
                this._createDynamicDropDownScrollbar();
            }
            else
            {
                // Less rows required than rows in dropdown, so just create
                // rows in dropdown
                
                this._createDynamicDropDownRows(requiredRows);
            }
            
            // Set the width of the drop down rows
            this._setRowWidth();
            
            // Restart event handlers
            this.startEventHandlers();
        }
        else
        {
          	// Dropdown has already been displayed, so we need to redraw
            // the dropdown components
            
            var currentDropdownRows = this.m_rows.length;
            
            // Stop events whilst performing redraw
            this.stopEventHandlers();
                       
        	if(requiredRows == currentDropdownRows)
        	{
        		// Same number of rows required as rows in dropdown, so just
        		// remove scrollbar if required. This happens if the dropdown
        		// currently has a scrollbar and if source data is loaded that
        		// has the same amount of rows as the dropdown. All data rows
        		// now fit in the dropdown, so scrollbar needs to be removed.
        		
                if(null != this.m_verticalScrollbar)
                {
                    this._removeDynamicDropDownScrollbar();
                }
        	}
        	else if(requiredRows < currentDropdownRows)
        	{        	            	
        		// Less rows required than rows in dropdown, so remove existing
        		// rows and scrollbar if required then create fewer new rows
        		
        		change = AutoCompletionRenderer.REMOVING_ROWS;
        		
	            this._removeDynamicDropDownRows();
	            
                if(null != this.m_verticalScrollbar)
                {
                    this._removeDynamicDropDownScrollbar();
                }
                
                this._createDynamicDropDownRows(requiredRows);
        	}
            else
            {
            	// More rows required than rows in dropdown, so remove existing
            	// rows and then determine how many new rows to create and whether
            	// or not a scrollbar is required
            	
            	change = AutoCompletionRenderer.ADDING_ROWS;
            	
	            if(requiredRows > maxRows)
	            {
	                // More rows required than maximum rows, so create maximum
	                // rows and vertical scrollbar in dropdown
		            
		            if(maxRows != currentDropdownRows)
		            {
		            	// Don't already have the maximum number of rows, so
		            	// remove existing rows and add maximum rows
		            	
	                	this._removeDynamicDropDownRows();
	                	this._createDynamicDropDownRows(maxRows);
	                }
	                
	                if(null == this.m_verticalScrollbar)
	                {
	                    this._createDynamicDropDownScrollbar();
	                }
	            }
	            else
	            {
	                // Less rows required than maximum rows, so just create
	                // required number of rows in dropdown
	             	
                	this._removeDynamicDropDownRows();
	                this._createDynamicDropDownRows(requiredRows);
	            }
			}
			
            // Set the width of the dropdown rows
            this._setRowWidth();
            
            // Restart event handlers
            this.startEventHandlers();
        }
    }
    
    return change;
}

/**
 * Method creates the rows within the autocompletion element dropdown. These
 * "rows" are actually individual divs which reside within a table cell.
 *
 * @param numberOfRows The number of rows to be created.
 */
AutoCompletionRenderer.prototype._createDynamicDropDownRows = function(numberOfRows)
{
    // Create new array to reference divs
    this.m_rows = new Array(numberOfRows);
    
    // Create div components
    var doc = window.document;
    
    for(var i = 0; i < numberOfRows; i++)
    {
		var r = doc.createElement("div");
		
		r.className = AutoCompletionRenderer.ROW_CSS_CLASS_NAME;
		
		// Give the row some initial text otherwise the dropdown
		// is sometimes rendered with zero height
		this._setRowContent(r, "row " + i);
		
		this.m_rowsCell.appendChild(r);
		
		this.m_rows[i] = r;
    }
}

/**
 * Method removes current rows in autocompletion element dropdown. These
 * "rows" are actually individual divs which reside within a table cell.
 */
AutoCompletionRenderer.prototype._removeDynamicDropDownRows = function()
{
    if(this.m_rows != null)
    {
        for(var i = 0, l = this.m_rows.length; i < l; i++)
        {
            var r = this.m_rows[i];
            
            // Clean up child nodes
            var childNodes = r.childNodes;
            
            for(var k = childNodes.length - 1; k >= 0; k--)
            {
                r.removeChild(childNodes[k]);
            }
            
            this.m_rowsCell.removeChild(r);
            this.m_rows[i] = null;
        }
        
        this.m_rows = null;
    }
}

/**
 * Method creates a vertical scrollbar for the autocompletion element dropdown
 * component.
 */
AutoCompletionRenderer.prototype._createDynamicDropDownScrollbar = function()
{
    var doc = window.document;
    
    // Create scrollbar cell
    this.m_scrollbarCell = doc.createElement("td");
    
    this.m_scrollbarCell.className = AutoCompletionRenderer.SCROLLCELL_CSS_CLASS_NAME;
    
    // Create scrollbar component
    this.m_verticalScrollbar = Scrollbar.createAsChild(this.m_scrollbarCell,
                                                       this.getElement().id + "VerticalScrollbar",
                                                       true,
                                                       null,
                                                       false);
    
    var thisObj = this;                    
    this.m_verticalScrollbar.addPositionChangeListener(function() { thisObj._handleVerticalScroll(); });
    
    // Append scroll bar cell to parent table row
    this.m_tableRow.appendChild(this.m_scrollbarCell);
}

/**
 *  Method removes a vertical scrollbar from the autocompletion element dropdown.
 */
AutoCompletionRenderer.prototype._removeDynamicDropDownScrollbar = function()
{
    // Dispose of scrollbar
    this.m_verticalScrollbar.dispose();
    this.m_verticalScrollbar = null;
    
    // Remove scrollbar HTML components
    this._removeChildNodes(this.m_scrollbarCell);
    
    // Remove table cell containing scrollbar
    this.m_tableRow.removeChild(this.m_scrollbarCell);
    
    this.m_scrollbarCell = null;
}

AutoCompletionRenderer.prototype._setRowContent = function(row, text)
{
    // Clean row content
    this._removeChildNodes(row);
    
    var textNodeContent = text;
    
    if(null == textNodeContent || "" == textNodeContent)
    {
        textNodeContent = "\u00a0";
    }
    
    var tn = window.document.createTextNode(textNodeContent);
    
    row.appendChild(tn);
}

AutoCompletionRenderer.prototype._removeChildNodes = function(element)
{
    var childNodes = element.childNodes;
    
    for(var k = childNodes.length - 1; k >= 0; k--)
    {
        element.removeChild( childNodes[k] );
    }
}

AutoCompletionRenderer.prototype._hideSelectElements = function()
{
	// Array of all the select elements in the document
	var selects = PopupLayer.m_allSelects;
	// Drop down container holds the table and it's rows
	var container = this.m_rowsCell;
	
	for(var i = selects.length - 1; i >= 0; i--)
	{
		var s = selects[i];
		
    	// Check if select control is overlapped by the drop down
    	if(isContained(s, container))
		{
		    // Is overlapped, so check if already hidden
			var visibility = s.style.visibility;
			
			if(visibility != "hidden")
			{
				// Not already hidden, so store it's visibility and disabled state			
				var selectState = new Object();
				selectState.visibility = visibility;
				selectState.disabled = s.disabled;
				
        		this.m_selectsState[i] = selectState;
        		
        		// Disable and hide the select
        		s.disabled = true;
        		s.style.visibility = "hidden";
        		
        		selectState = null;
        	}
		}
	}
}

AutoCompletionRenderer.prototype._showSelectElements = function()
{
	// Array of the select elements visibility states
	var selects = this.m_selectsState;
	// Drop down container holds the table and it's rows	
	var container = this.m_rowsCell;
	
	for(var i = selects.length - 1; i >= 0; i--)
	{
		var selectState = selects[i];
		
		if(selectState != null)
		{
			var element = PopupLayer.m_allSelects[i];
			
    		// Check if select control is still overlapped by the drop down			
			if(!isContained(element, container))
			{
				// Not overlapped, so restore it's previous visibility and disabled states
				element.style.visibility = selectState.visibility;
				element.disabled = selectState.disabled;
			}
		}
	}
}

AutoCompletionRenderer.prototype._refreshSelectElements = function(change)
{
	var dropDownField = this.m_dropDownField;
	var requiredPos = dropDownField._getDropDownPosition(this.m_rowsCell);
	
	// Number of rows in dropdown has changed, so determine whether the
	// dropdown being shown above or below the field will change
	
	if(requiredPos != dropDownField.m_dropDownPosition)
	{
		// Dropdown position will change
		
		// Hide dropdown in current position
		dropDownField.hideDropDown();
		
		// Restore any overlapped selects in the current position
		this._showSelectElements();
		
		// Show dropdown in new position
		dropDownField.showDropDown();
	}
	else
	{
		if(change == AutoCompletionRenderer.ADDING_ROWS)
		{
			// Adding rows, so hide any overlapped selects
			this._hideSelectElements();
		}
		else
		{
			// Removing rows, so restore any overlapped selects
			this._showSelectElements();
		}
	}
}

/*
 * Sets the single match flag. Called from _refreshDisplayedValue method on the adaptor.
 * @param matched - boolean flag that indicates whether or not a match was found
 */
AutoCompletionRenderer.prototype.setMatchSingle = function(matched)
{
	if(matched)
	{
		this.m_matchSingle = AutoCompletionRenderer.FOUND_MATCH;
	}
	else
	{
		this.m_matchSingle = AutoCompletionRenderer.MATCH;
	}
}
