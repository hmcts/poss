//==================================================================
//
// AuditSelectorRenderer.js
//
// Class for rendering the generic audit selector panel adaptor used to
// display panels for data history audit.
//
//==================================================================

function AuditSelectorRenderer() {}

/**
 * Static AuditSelectorRenderer css classes
 */
AuditSelectorRenderer.CSS_CLASS_NAME = "auditSelectorPanel";
AuditSelectorRenderer.TABLE_CSS_CLASS_NAME = "audit_table";
AuditSelectorRenderer.TABLEROW_CSS_CLASS_NAME = "audit_tablerow";
AuditSelectorRenderer.ROWCELL_CSS_CLASS_NAME = "audit_rowscell";
AuditSelectorRenderer.SCROLLCELL_CSS_CLASS_NAME = "audit_scrollcell";
AuditSelectorRenderer.ROW_CSS_CLASS_NAME = "audit_row";
AuditSelectorRenderer.ROW_HIGH_CSS_CLASS_NAME = "audit_row_high";
AuditSelectorRenderer.ROW_HIDDEN_CSS_CLASS_NAME = AuditSelectorRenderer.ROW_CSS_CLASS_NAME + " audit_rowhidden";
AuditSelectorRenderer.ROW_SELECTED_CSS_CLASS_NAME = AuditSelectorRenderer.ROW_CSS_CLASS_NAME + " audit_rowselected";
AuditSelectorRenderer.ROW_SELECTED_AND_NOT_ENABLED_CSS_CLASS_NAME = AuditSelectorRenderer.ROW_CSS_CLASS_NAME + " audit_rowSelectedNotEnabled";
AuditSelectorRenderer.ROW_NOT_ENABLED_CSS_CLASS_NAME = AuditSelectorRenderer.ROW_CSS_CLASS_NAME + " audit_rowNotEnabled";

/**
 * Static AuditSelectorRenderer maximum number of rows displayed at any one time
 */
AuditSelectorRenderer.MAX_ROWS = 5;

/**
 * Static constant representing the maximum visible width of the window
 */
AuditSelectorRenderer.MAX_SCREEN_WIDTH = 924;

/**
 * Static constant representing the width of the Audit Dropdown
 */
AuditSelectorRenderer.PANEL_WIDTH = 205;


/**
 * AuditSelectorRenderer member variables
 */
AuditSelectorRenderer.prototype._auditPanels = null;

AuditSelectorRenderer.prototype.m_keyEventHandlerKeys = null;

AuditSelectorRenderer.prototype.m_keyEventHandlerKey = null;

AuditSelectorRenderer.prototype.m_cellElementsCell = null;

AuditSelectorRenderer.prototype.m_cellElements = null;

AuditSelectorRenderer.prototype.m_guiAdaptor = null;

AuditSelectorRenderer.prototype.m_container = null;

AuditSelectorRenderer.prototype.m_verticalScrollbar = null;

AuditSelectorRenderer.prototype.m_highlightedRow = null;

AuditSelectorRenderer.prototype.m_selectedRow = null;

AuditSelectorRenderer.prototype.m_topRow = null;

AuditSelectorRenderer.prototype.m_visibleRows = null;

AuditSelectorRenderer.prototype.m_handlersStarted = null;

AuditSelectorRenderer.prototype.m_hiddenSelects = null;

AuditSelectorRenderer.prototype.m_popupDisplayed = null;

/**
 * Static createInline function to encapsulate the HTML element
 * implementation of the Audit Selector Panel
 * @param id
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.createInline = function(id)
{
	if( null == id )
	{
		throw new ConfigurationException("Must supply id to createInline");
	}
	
	// Write the outer element to the document
	document.write("<div id='" + id + "' tabIndex='9999'></div>");
	
	// Get the element using its id
	var element = document.getElementById(id);
	element.className = AuditSelectorRenderer.CSS_CLASS_NAME;
	
	// Put in link back to allow adaptor to get access to renderer
	element.__renderer = new AuditSelectorRenderer._create(element);
}


/**
 * Private create function to build the dropdown HTML element
 * @param element
 * @author rzxd7g
 * @return renderer  
 */
AuditSelectorRenderer._create = function(element)
{
	var renderer = new AuditSelectorRenderer();
	renderer.m_container = element;
	
	// Local reference to the document that we are adding elements to
	var d = window.document;

	// Create table to hold rows and scrollbar
	var table = d.createElement("table");
	table.className = AuditSelectorRenderer.TABLE_CSS_CLASS_NAME;

	// Ideally these attributes could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");

	// Require a tbody element
	var tableBody = d.createElement("tbody");

	// Row to hold two cells.
	var tableRow = d.createElement("tr");
	tableRow.className = AuditSelectorRenderer.TABLEROW_CSS_CLASS_NAME;

	var rowsCell = d.createElement("td");
	renderer.m_cellElementsCell = rowsCell;
	rowsCell.className = AuditSelectorRenderer.ROWCELL_CSS_CLASS_NAME;

	var scrollbarCell = d.createElement("td");
	scrollbarCell.className = AuditSelectorRenderer.SCROLLCELL_CSS_CLASS_NAME ;

	renderer.m_verticalScrollbar = Scrollbar.createAsChild( scrollbarCell, element.id + "VerticalScrollbar", true, null );
	renderer.m_verticalScrollbar.addPositionChangeListener( function() { renderer._handleVerticalScroll(); } );
	
	// Array containing the divs representing rows.
	renderer.m_cellElements = new Array();
	
	// Create the display rows
	for( i = 0; i < AuditSelectorRenderer.MAX_ROWS; i++ )
	{
		var r = d.createElement("div");
		r.className = AuditSelectorRenderer.ROW_CSS_CLASS_NAME;
		
		// Give the row some initial (empty) text
		r.innerHTML = "row " + i; //"&nbsp;";  
		rowsCell.appendChild(r);
		renderer.m_cellElements[i] = r;
	}
	
	tableRow.appendChild( rowsCell );
	tableRow.appendChild( scrollbarCell );
	tableBody.appendChild( tableRow );
	table.appendChild( tableBody );
	
	element.appendChild( table );

	renderer.startEventHandlers();
	return renderer;
}


/**
 * AuditSelectorRenderer Dispose function - clean up all event handlers
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype.dispose = function() 
{
	this.stopEventHandlers();
	
	this.m_verticalScrollbar.dispose();
}


/**
 * Start Event Handlers function
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype.startEventHandlers = function()
{
	// Makes this call idempotent
	if( !this.m_handlersStarted )
	{	
		this.m_handlersStarted = true;

		var a = this;
		this.m_keyEventHandlerKey = SUPSEvent.addEventHandler(this.m_container, "keydown", function(evt) { a._handleKeyEvents(evt); }, false);
	
		this.m_verticalScrollbar.startEventHandlers();
	
		this.m_cellElementsCell.onclick = function(evt) { a._handleClick(evt); };
		this.m_cellElementsCell.ondblclick = function(evt) { a._handleDoubleClick(evt); };
	}
}


/**
 * Stop Event Handlers function called by the dispose function
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype.stopEventHandlers = function()
{
	// Makes this call idempotent
	if( this.m_handlersStarted )
	{
		this.m_handlersStarted = false;

		// Remove the key events linked to the Audit Selector Div
		SUPSEvent.removeEventHandlerKey( this.m_keyEventHandlerKey );
		this.m_keyEventHandlerKey = null;
	
		this.m_verticalScrollbar.stopEventHandlers();
		
		this.m_cellElementsCell.onclick = null;
		this.m_cellElementsCell.ondblclick = null;
	}
}


/**
 * Handler for the single click event on an Audit Panel row
 * @param evt
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._handleClick = function(evt)
{
	// Get the Audit Panel Cell Object in the Div
	evt = ( null == evt ) ? window.event : evt;
	var target = SUPSEvent.getTargetElement(evt);

	// If this is IE evt.detail will not be defined, however IE does not call
	// click handler twice on a double click. In Mozilla click handler is called
	// for each click and evt.detail contains the number of sucessive clicks, so
	// for a double click evt.detail will be two - we only want to handle single
	// clicks here so ignore clicks with evt.detail != 1. All double clicks are
	// handled in _handleDoubleClick below.
    if( evt.detail == undefined || evt.detail == 1 )
	{	
		for( var i = 0, l = this.m_cellElements.length; i < l ; i++ )
		{
			if( target == this.m_cellElements[i] )
			{
				break;
			}
		}
		
		if( i < l )
		{
			var dataRow = i + this.m_topRow;
			var isEnabled = Services.getAdaptorById( this._auditPanels[dataRow] ).getEnabled();

			this.m_highlightedRow = dataRow;
			this._renderRows();
			this._useCurrentPanel(isEnabled);
		}
	}	
}


/**
 * Handle a double click on one of the rows in the drop down
 *
 * @param evt the double click event - null on IE
 * @private
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._handleDoubleClick = function(evt)
{
	// A row will have been selected in the click handler above
	var dataRow = this.m_highlightedRow + this.m_topRow;
	var isEnabled = Services.getAdaptorById( this._auditPanels[dataRow] ).getEnabled();

	this._useCurrentPanel(isEnabled);
}


/**
 * Function handling the key press events on the Audit Selector Panel Div
 * Eventually this will be extended to include up/down and space keys
 * @param e
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._handleKeyEvents = function(e)
{
	if ( null == e ) e = window.event;
	
	switch ( e.keyCode )
	{
		// At present if the user presses the Escape key, the dropdown will lower
		case Key.ESC.m_keyCode:
			this._hidePanel();
			break;
		
		// Move up an option when press Up Arrow Key
		case Key.ArrowUp.m_keyCode:
			this._selectPreviousPanel();
			break;
		
		// Move down an option when press Down Arrow Key
		case Key.ArrowDown.m_keyCode:
			this._selectNextPanel();
			break;
			
		// When click enter or space, use the selected row
		case Key.Return.m_keyCode:
		case Key.Space.m_keyCode:
			// Determine if the highlighted row is enabled
			var dataRow = this.m_highlightedRow + this.m_topRow;
			var isEnabled = Services.getAdaptorById( this._auditPanels[dataRow] ).getEnabled();

			this._useCurrentPanel(isEnabled);
			break;
			
		default:
			// For all other keys, do nothing
	}
}


/**
 * Set the current audit panel row as selected and if the AuditPanelGUIAdaptor is
 * enabled, call the Audit Subform
 * @param isEnabled
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._useCurrentPanel = function(isEnabled)
{
	if( this.m_highlightedRow != null )
	{
		// The selected row is the currently highlighted row
		this.m_selectedRow = this.m_highlightedRow;

		// Call the adaptor's handle selection function is panel enabled
		if ( isEnabled )
		{
			this.m_guiAdaptor.handleSelection( this._auditPanels[this.m_selectedRow] );
		}
	}
}


/**
 * Handles the keyboard navigation up the dropdown list to select the previous row
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._selectPreviousPanel = function()
{
	if( null == this.m_highlightedRow || 0 == this.m_highlightedRow )
	{
		// Select last element
		this._moveSelection( this._auditPanels.length -1 );
	}
	else
	{
		// Select previous element
		this._moveSelection( this.m_highlightedRow - 1 );
	}
}


/**
 * Handles the keyboard navigation down the dropdown list to select the next row
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._selectNextPanel = function()
{
	if( null == this.m_highlightedRow || this.m_highlightedRow == ( this._auditPanels.length -1 ) )
	{
		// Select first element
		this._moveSelection(0);
	}
	else
	{
		// Select next element
		this._moveSelection( this.m_highlightedRow + 1 );
	}
}


/**
 * Handles the keyboard navigation up/down the dropdown, rendering the rows and the scrollbar
 * accordingly.
 * @param newSelectedRow
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._moveSelection = function(newSelectedRow)
{
	// If newly selected row is not visible make it visible
	if( newSelectedRow < this.m_topRow )
	{
		// Selected row is "above" the topmost displayed rows, so scroll to make it visible

		// Make the selected row the top most visible row
		this.m_topRow = newSelectedRow;
		
		// Update the selected row
		this.m_highlightedRow = newSelectedRow;
		
		// All the rows will need re-rendering
		this._renderRows();
	}
	else if( newSelectedRow > ( this.m_topRow + this.m_cellElements.length - 1 ) )
	{
		// Selected row is "below" the bottommost displayed rows, so scroll to make it visible
		this.m_topRow = newSelectedRow - (this.m_cellElements.length - 1);
		
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
		if(null != csr && csr >= this.m_topRow && csr < (this.m_topRow + this.m_cellElements.length))
		{
			this.m_highlightedRow = null;
			this._renderRow( csr - this.m_topRow );
		}
		
		// Render the newly selected row as rendered
		this.m_highlightedRow = newSelectedRow;
		this._renderRow( newSelectedRow - this.m_topRow );
	}
}


/**
 * Function called when audit dropdown is invoked by clicking Audit Button
 * or Audit Function Key.  Constructs the array of AuditPanelGUIAdaptors on the current
 * form if not previously set, also calls the positioning function when called for the
 * first time.
 * @author rzxd7g
 * @return null 
 */
AuditSelectorRenderer.prototype._showPanelList = function()
{
	// Do nothing if the popup is already being displayed
	if ( this.m_popupDisplayed == true ) return;

	// Check if panel list has been constructed
	if ( null == this._auditPanels )
	{
		// Position the panel
		this.positionPanel();
	
		// Loop through all the adaptors and find the Audit Panels on the form
		this._auditPanels = new Array();
		var fc = FormController.getInstance();
		var as = fc.m_adaptors;
		for ( var i=0, al=as.length; i<al; i++ )
		{
			var a = as[i];
			if ( a.m_cssClass == AuditPanelGUIAdaptor.CSS_CLASS_NAME )
			{
				// Current adaptor is an Audit Panel, add it's id to the list
				this._auditPanels[ this._auditPanels.length ] = a.getId();
			}
		}
	}

	// Finally show the panel
	this._showPanel();
}


/**
 * Nicely position the Audit selector panel below the Audit Navigation button
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype.positionPanel = function()
{
	var button = Services.getAdaptorById( this.m_guiAdaptor.getAuditButtonId() );
	var position = button.getElementPosition();

	// Check if should be left or right aligned
	if ( (position.left + AuditSelectorRenderer.PANEL_WIDTH) >= AuditSelectorRenderer.MAX_SCREEN_WIDTH )
	{
		// Width would go off the visible screen, make right aligned
		var remainder = AuditSelectorRenderer.PANEL_WIDTH - position.width;
		this.m_container.style.left = position.left - remainder;
	}
	else
	{
		// Make left aligned
		this.m_container.style.left = position.left + 2;
	}

	// Set height and width
	this.m_container.style.top = position.top + position.height + 1;
	this.m_container.style.width = AuditSelectorRenderer.PANEL_WIDTH + "px";
}


/**
 * Hide the panel selector Div.
 * @author rzxd7g
 * @return null 
 */
AuditSelectorRenderer.prototype._hidePanel = function()
{
	// Do nothing if the popup is already hidden
	if ( this.m_popupDisplayed != true ) return;

	this._showSelectElements();
	this.m_container.style.visibility = "hidden";
	this.m_container.style.zIndex = 0;
	this.m_popupDisplayed = false;
}


/**
 * Show the panel selector Div.
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._showPanel = function()
{
	// Reset the current selection
	this.m_topRow = 0;
	this.m_highlightedRow = 0;
	this.m_selectedRow = null;

	this._hideSelectElements();

	// Size the scrollbar appropriately & determine how many rows are visible
	var scale = null;
	var numberPanels = this._auditPanels.length
	if ( this.m_cellElements.length > numberPanels )
	{
		scale = this.m_cellElements.length;
		this.m_visibleRows = numberPanels;
	}
	else
	{
		scale = numberPanels;
		this.m_visibleRows = this.m_cellElements.length;
	}

	// Size the scrollbar correctly
	this.m_verticalScrollbar.setScaling(0, this.m_cellElements.length, scale);

	this._renderRows();

	this.m_container.style.visibility = "visible";
	this.m_container.style.zIndex = 100;
	this.m_popupDisplayed = true;
}


/**
 * Handle changes in the postion of the vertical scrollbar
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._handleVerticalScroll = function()
{
	if(this.m_topRow != this.m_verticalScrollbar.m_position)
	{
		this.m_topRow = this.m_verticalScrollbar.m_position;
	
		this._renderRows();
	}
}


/**
 * Renders the Audit Panel rows in the dropdown accordingly
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._renderRows = function()
{
	// Render the visible rows.
	var i;
	var topRow = this.m_topRow;
	
	for(i = 0, l = this.m_visibleRows; i < l ; i++)
	{
		this._renderRow(i);
	}

	var hiddenRowClass = AuditSelectorRenderer.ROW_HIDDEN_CSS_CLASS_NAME;
	for(i = this.m_visibleRows, l = this.m_cellElements.length; i < l; i++)
	{
		this.m_cellElements[i].className = hiddenRowClass;
	}
	
	// Position the scrollbar appropriately
	this.m_verticalScrollbar.setPosition(this.m_topRow);
	this.m_verticalScrollbar._render();
}


/**
 * Renders a single Audit Panel row in the dropdown depending upon whether selected or
 * enabled/disabled.
 * @param rowNumber
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._renderRow = function(rowNumber)
{
	var r = this.m_cellElements[rowNumber];
	var dataRow = rowNumber + this.m_topRow;
	var isEnabled = Services.getAdaptorById( this._auditPanels[dataRow] ).getEnabled();
	var isSelected = this.m_highlightedRow == dataRow;
	r.innerHTML = Services.getAdaptorById( this._auditPanels[dataRow] ).panelName;
	
	var cN = "";
	if( isEnabled == true )
	{
		// Audit Panel enabled, display appropriately
		cN = isSelected ? AuditSelectorRenderer.ROW_SELECTED_CSS_CLASS_NAME : AuditSelectorRenderer.ROW_CSS_CLASS_NAME;
	}
	else
	{
		// Audit Panel disabled, display appropriately
		cN = isSelected ? AuditSelectorRenderer.ROW_SELECTED_AND_NOT_ENABLED_CSS_CLASS_NAME : AuditSelectorRenderer.ROW_NOT_ENABLED_CSS_CLASS_NAME;
	}
	
	r.className = cN;
}


/**
 * Creates an array of all the select lists on the form and renderers any that overlap with the
 * audit dropdown as hidden.
 * @author rzxd7g
 * 
 */
AuditSelectorRenderer.prototype._hideSelectElements = function()
{
	// Get all the select elements in the document - could potentially hang on to this?
	var selects = document.getElementsByTagName("SELECT");

	// Array to contain selects hidden by the element e
	var hiddenSelects = new Array();
	
	// The dropdown element
	var e = this.m_container;
	
	for (var i = 0, l = selects.length; i < l; i++)
	{
		var s = selects[i];

		// Create an object to record the current visibility state of the select...
    	var selectVisibilityState = new Object();
    	selectVisibilityState.element = s;
    	selectVisibilityState.prevState = s.style.visibility;
    	
    	// Keep the current state of this select
    	hiddenSelects.push(selectVisibilityState);

		// If the select is a child of the dropdown
        if(e.contains(s))
        {
			// If select was previously hidden
			if(s.style.visibility == "hidden")
			{
				// Make it visible now.
				s.style.visibility = "visible";
			}
			else
			{
				// Leave visibility as is...
			}
		}
		else
		{
	        // Hide select controls which are overlapped by the dropdown.
        	if(isContained(s, e))
			{
				// Hide the hidden select
	        	s.style.visibility = "hidden";
			}
		}
	}

	// Hang on to the select states
	this.m_hiddenSelects = hiddenSelects;
}


/**
 * Returns all hidden select lists back to their former state
 * @author rzxd7g
 * @return null 
 */
AuditSelectorRenderer.prototype._showSelectElements = function()
{
	var restoreSelects = this.m_hiddenSelects;
	if ( null == restoreSelects ) return;
	
	for(var i = 0, l = restoreSelects.length; i < l; i++)
	{
		var selectVisibilityState = restoreSelects[i];
		selectVisibilityState.element.style.visibility = selectVisibilityState.prevState;
	}
	
	this.m_hiddenSelects = null;
}
