function GridRenderer()
{
}


/**
 * GridRenderer is a sub class of Renderer
 */
GridRenderer.prototype = new Renderer();
GridRenderer.prototype.constructor = GridRenderer;


GridRenderer.CSS_CLASS_NAME = "grid";


/**
 * Create a grid component at the current position in the HTML document
 *
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @return the newly created grid
 */
GridRenderer.createInline = function(id, columns, rows, groupSize)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the grid being created
		true		// The grid does not have an internal input element that can accept focus, so the div itself needs to be able to accept focus
	);

	return GridRenderer._create(e, columns, rows, groupSize, null);
}


/**
 * Create a grid component in the document relative to the supplied element
 *
 * @param refElement the element relative to which the grid should be rendered
 * @param relativePos the relative position of the grid to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @return the newly created grid
 */
GridRenderer.createAsInnerHTML = function(refElement, relativePos, id, columns, rows, groupSize)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the grid being created
		true			// The grid does not have an internal input element that can accept focus, so the div itself needs to be able to accept focus
	);
	
	// Create the rest of the grid
	return GridRenderer._create(e, columns, rows, groupSize, null);
}


/**
 * Create a grid as a child of another html element
 *
 * @param p the parent element to add the Grid to.
 * @param id the id to give the newly created Grid
 * @param columns An array of column names or simply an integer specifying the number of columns
 * @param ac additional css classes to add to the grid?
 * @return the newly created grid
 */
GridRenderer.createAsChild = function(p, id, columns, rows, groupSize, ac)
{
	var e = Renderer.createAsChild(id);

	// Append the grid's outer div to it's parent element
	p.appendChild(e);
	
	// Create the rest of the grid
	return GridRenderer._create(e, columns, rows, groupSize, ac);
}


GridRenderer.prototype.dispose = function()
{
	// Get rid of all event handlers
	this.stopEventHandlers();
	
	// Dispose of child classes
	// Deactivate horizontal scrollbar code as it is not used. (PDL Pre-delete).
	//PDL if(this.m_horizontalScrollbar != null) this.m_horizontalScrollbar.dispose();
	if(this.m_verticalScrollbar != null) this.m_verticalScrollbar.dispose();
	
	// RWW 10/11/04 Short term solution. Remove reference to
	// grid adaptor.
	this.m_adaptor = null;
	
	// Remove reference to instance of GridModel
	this.m_gridModel = null;
	
	// Get rid of callbacks
	if(this.m_selectionChangeListeners != null)
	{
		this.m_selectionChangeListeners.dispose();
		this.m_selectionChangeListeners = null;
	}
	if(this.m_dblclickListeners != null)
	{
		this.m_dblclickListeners.dispose();
		this.m_dblclickListeners = null;
	}
	
	// Remove the variable added to the grid div to allow us to locate this component
	if(this.m_element != null)
	{
		unPreventSelection(this.m_element);
	    this.m_element.__renderer = null;
	    this.m_element = null;
    }

	if(this.m_rows != null)
	{
		for(var i = 0, l = this.m_rows.length; i < l; i++)
		{
			this.m_rows[i].dispose();
			this.m_rows[i] = null;
		}
		this.m_rows = null;
	}

	if(this.m_columns != null)
	{
		for(var i = 0, l = this.m_columns.length; i < l; i++)
		{
			this.m_columns[i].dispose();
			this.m_columns[i] = null;
		}
		this.m_columns = null;
	}

	// clear down references to created elements in the HTML DOM
	this.m_gridForm = null;
	this.m_element = null;
	this.m_gridTable = null;
	this.m_gridTableBody = null;
	this.m_gridTableHeaderRow = null;
	this.m_gridTableHeaderCell = null;
	this.m_gridTableHeaderEmptyCell = null;
	this.m_gridTableBodyRow = null;
	this.m_gridTableBodyCell = null;
	this.m_gridTableVScrollbarCell = null;
	this.m_verticalScrollbar = null;
	
	//PDL this.m_hScrollbarRow = null;
	//PDL this.m_hScrollbarCell = null;
	//PDL this.m_hScrollbarEmptyCell = null;
	//PDL this.m_horizontalScrollbar = null;
	
	this.m_headerRow = null;
	this.m_columns = null;
	this.m_rowContainer = null;
	this.m_rows = null;
	this.m_selectionChangeListeners = null;
	this.m_dblclickListeners = null;
}

/**
 * This is a debug method that returns lots of information about the underlying data
 * and the selected rows.
 */
GridRenderer.prototype._getDebugInfo = function()
{
	var debug = "GridRenderer id:" + this.m_adaptor.getId();
	debug += " \nRows: length = " + this.m_rows.length;
	for(var i=0; i<this.m_rows.length; i++)
	{
		debug += ", rows[" + i + "] = " + this.m_rows[i].toString();
	}
	return debug;
} 


GridRenderer._create = function(ge, columns, rows, groupSize, ac)
{
    Grid.determineBrowser();
    
	var g = new GridRenderer();
	
	// Interrogate columns argument to determine whether
	// it contains an array of column headers or just
	// the number of columns required.
	
	var columnHeadersRequired = false;
	if((typeof columns == "object") && (columns.constructor == Array))
	{
	    columnHeadersRequired = true;
	}
	else if(typeof columns == "number")
	{
	    if(columns != parseInt( columns.toString()))
	    {
	        // Input argument is not an integer value
	        throw new ConfigurationException( "Grid argument columns must be an integer value." );
	    }	    
	    else
	    {
	        // Input argument is an integer
	        if(columns <= 0)
	        {
	            throw new ConfigurationException( "Number of columns in grid should be greater than zero." );
	        }
	    }
	}
	else
	{
	    throw new ConfigurationException( "Grid columns argument must contain an array of column names or the number of columns only." );
	}
	
	// Store number of columns required
	var numberOfColumns;
	if(columnHeadersRequired)
	{
	    numberOfColumns = columns.length;
	}
	else
	{
	    numberOfColumns = columns;
	}
	
	// Define grid components  
	g.m_rows  = new Array(rows);
	g.setNumberOfRowsInView(rows);
	g.m_columns = new Array(numberOfColumns);
	g.m_groupSize = groupSize;
	
	g.m_sortColumn = 0;
	g.m_hasFocus = false;
	
	g.m_topRow = 0;
	g.m_headerRow = null;
	
	// Initialise sets main element and the reference to the renderer in the dom
	g._initRenderer(ge);

	g.m_element.className = GridRenderer.CSS_CLASS_NAME;
	
	// Prevent selection of content within the grid	
	preventSelection(ge);
	
	// Create grid FORM to catch keyboard events
	g.m_gridForm = document.createElement("form");
	g.m_element.appendChild(g.m_gridForm);

	// D695 - Table borders in IE cause problems when subforms are closed.
	// Use a div surrounding the table as a border
	var div = document.createElement("div");
	div.className = "grid_table_border";
	g.m_gridForm.appendChild(div);
	
	// Create grid TABLE for main grid layout
	g.m_gridTable = document.createElement("table");
	div.appendChild(g.m_gridTable);
	
	// Create grid TBODY for main grid layout
	g.m_gridTableBody = document.createElement("tbody");
	g.m_gridTable.appendChild(g.m_gridTableBody);
	
	if(columnHeadersRequired)
	{
	    // Create table TR row to contain header
	    g.m_gridTableHeaderRow = document.createElement("tr");
	    g.m_gridTableBody.appendChild(g.m_gridTableHeaderRow);
	
	    // Create table TD which contains the header elements
	    g.m_gridTableHeaderCell = document.createElement("td");
	    g.m_gridTableHeaderRow.appendChild(g.m_gridTableHeaderCell);
	
	    // Create table TD which represents the unused space in the top right corner of the grid
	    g.m_gridTableHeaderEmptyCell = document.createElement("td");
	    g.m_gridTableHeaderRow.appendChild(g.m_gridTableHeaderEmptyCell);

	    g.m_headerRow = document.createElement("div");
	    g.m_headerRow.className = "grid_header_row";
	}
	
	// Create table TR row to contain the rows and vertical scrollbar
	g.m_gridTableBodyRow = document.createElement("tr");
	g.m_gridTableBody.appendChild(g.m_gridTableBodyRow);
	
	// Create table TD element which contains the grid rows
	g.m_gridTableBodyCell = document.createElement("td");
	g.m_gridTableBodyRow.appendChild(g.m_gridTableBodyCell);

	// Create table TD element which contains the grid vertical scrollbar
	g.m_gridTableVScrollbarCell = document.createElement("td");
	g.m_gridTableVScrollbarCell.className = "grid_vscroll_cell";
	g.m_gridTableBodyRow.appendChild(g.m_gridTableVScrollbarCell);

	// Create vertical scrollbar
	g.m_verticalScrollbar = Scrollbar.createAsChild(g.m_gridTableVScrollbarCell, ge.id + "VerticalScrollbar", true, null);
	g.m_verticalScrollbar.addPositionChangeListener(function() { g._handleVerticalScroll(); });
	
	// Create row to hold the horizontal scrollbar
	//PDL g.m_hScrollbarRow = document.createElement("tr");
	
	// Create table TD element which contains the grid horizontal scrollbar
	//PDL g.m_hScrollbarCell = document.createElement("td");
	//PDL g.m_hScrollbarCell.className = "grid_hscroll_cell";
	//PDL g.m_hScrollbarEmptyCell = document.createElement("td");
	//PDL g.m_horizontalScrollbar = Scrollbar.createAsChild(g.m_hScrollbarCell, null, false, null);
	
	// Create columns
	for(var i = 0 ; i < numberOfColumns; i++)
	{
	    if(columnHeadersRequired)
	    {
		    g.m_columns[i] = new ColumnRenderer(g, i, columns[i]);
		}
		else
		{
		    g.m_columns[i] = new ColumnRenderer(g, i, null);
		}
	}

	if(columnHeadersRequired)
	{
	    g.m_gridTableHeaderCell.appendChild(g.m_headerRow);
	}
	
	// Add main row container including scrollbar
	g.m_rowContainer = document.createElement("div");
	g.m_rowContainer.className = "grid_row_container";
	
	// Add main rows
	for(var j = 0; j < rows; j++)
	{
		var rowElement = document.createElement("div");
		rowElement.className = "grid_row hidden";
		
		var r = new RowRenderer(rowElement, numberOfColumns, g, j, groupSize);
		g.m_rows[j] = r;
		for(var i = 0; i < numberOfColumns; i++)
		{
			var gridCell = document.createElement("span");
			gridCell.className = "grid_cell col" + i;
			gridCell.innerHTML = "&nbsp;";
			rowElement.appendChild(gridCell);
			
			var cell = new CellRenderer(gridCell);
			var column = g.m_columns[i];
			// Not needed anymore?
			//column.addCell(cell, j);
			g.m_rows[j].addCell(cell, i);
		}
		g.m_rowContainer.appendChild(rowElement);
	}
	g.m_gridTableBodyCell.appendChild(g.m_rowContainer);

	// Add a callback list which is notified when the selection changes
	g.m_selectionChangeListeners = new CallbackList();
	
	// Add a callback list which is notified when a row is double clicked
	g.m_dblclickListeners = new CallbackList();
	
	return g;
}

GridRenderer.prototype.m_groupSize = 0;


GridRenderer.prototype.setNumberOfRowsInView = function(numberOfRowsInView)
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.setNumberOfRowsInView() numberOfRowsInView = " + numberOfRowsInView);
	this.m_numberOfRowsInView = numberOfRowsInView;
}
GridRenderer.prototype.getNumberOfRowsInView = function()
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.setNumberOfRowsInView() numberOfRowsInView = " + this.m_numberOfRowsInView);
	return this.m_numberOfRowsInView;
}

GridRenderer.prototype.setModel = function(model)
{
	this.m_gridModel = model;
}

GridRenderer.prototype.setAdaptor = function(adaptor)
{
	this.m_adaptor = adaptor;
}

GridRenderer.prototype.addDblclickListener = function( cb )
{
    this.m_dblclickListeners.addCallback(cb);
}

GridRenderer.prototype.removeDblclickListener = function(cb)
{
    this.m_dblclickListeners.removeCallback(cb);
}

GridRenderer.prototype._handleRowDblclick = function(row)
{
    // Invoke any registered double click listeners
    this.m_dblclickListeners.invoke();
}

/*
 * Received a row rendering event from the model, therefore get the query the model for the row data
 * and re-render the row.
 */
GridRenderer.prototype.handleRowRenderEvent = function(event)
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.handleRowRenderEvent() event = " + event.toString());

	var dataRowNumber = event.getDataRowNumber();
	var row = this.m_gridModel.getDataRowByDataRowNumber(dataRowNumber);
	this.m_rows[event.getViewRowNumber()].render(dataRowNumber, row);
}

/*
 * Received a column rendering event, therefore re-render the appropriate column
 */
GridRenderer.prototype.handleColumnRenderEvent = function(event)
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.handleColumnRenderEvent() event = " + event.toString());
	this.m_columns[event.getColumnNumber()].render(event.getSortDirection());
}

GridRenderer.prototype.getHasFocus = function()
{
	return this.m_hasFocus;
}


GridRenderer.prototype.handleVerticalScrollbarRenderEvent = function(event)
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.handleVerticalScrollbarRenderEvent() event = " + event.toString());
	this.m_verticalScrollbar.setPosition(event.getPosition());
	this.m_verticalScrollbar.setScaling(0, this.m_numberOfRowsInView, event.getScale());
	// No need to call render on the scrollbar because this happens internally whenever the scaling is changed
	//this.m_verticalScrollbar._render();
}


GridRenderer.prototype.getReadOnly = function()
{
	return this.m_readOnly;
}

/*
 *
 */
GridRenderer.prototype.handleGridRenderEvent = function(event)
{
	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridRenderer.handleGridRenderEvent() event = " + event.toString());
	this.m_valid = event.getValid();
	this.m_serverValid = event.getServerValid();
	this.m_enabled = event.getEnabled();
	this.m_readOnly = event.getReadOnly();
	this.m_hasFocus = event.getHasFocus();
	this.m_active = event.getActive();
	this.m_isSubmissible = event.getIsSubmissible();
	this.m_isServerValidationActive = event.getIsServerValidationActive();
	this._renderGridStyles();
}

GridRenderer.prototype._renderGridStyles = function()
{
	var gridClass = "grid";
	if(!this.m_enabled || !this.m_active)
	{
		gridClass += " disabled";
	}
	else
	{
		if(this.m_hasFocus)
		{
			gridClass += " grid_focus";
		}
		if(this.m_readOnly)
		{
			gridClass += " grid_readOnly";
		}
		if(!this.m_valid)
		{
			if(!this.m_serverValid)
			{
				// If server validation in process colour text area orange. If
				// server invalid and process complete colour text area red.
				if(this.m_isServerValidationActive)
				{
					gridClass += " grid_not_submissible";
				}
				else
				{
					gridClass += " grid_invalid";
				}
			}
			else
			{
				gridClass += " grid_invalid";
			}
		}
		else
		{
			if(!this.m_isSubmissible)
			{
				gridClass += " grid_not_submissible";
			}
		}
	}
	this.m_element.className = gridClass;
}

GridRenderer.prototype.startRowEventHandlers = function()
{
	for(var i = 0, l = this.m_rows.length; i < l; i++)
	{
		this.m_rows[i].startEventHandlers();
	}
}

GridRenderer.prototype.stopRowEventHandlers = function()
{
	if(this.m_rows != null)
	{
		for(var i = 0, l = this.m_rows.length; i < l; i++)
		{
			this.m_rows[i].stopEventHandlers();
		}
	}
}

GridRenderer.prototype.startEventHandlers = function()
{
	this.startRowEventHandlers();
	
	for(var i = 0, l = this.m_columns.length; i < l; i++)
	{
		this.m_columns[i].startEventHandlers();
	}
	
	this.m_verticalScrollbar.startEventHandlers();
	//PDL this.m_horizontalScrollbar.startEventHandlers();
}


GridRenderer.prototype.stopEventHandlers = function()
{
	this.stopRowEventHandlers();

	if(this.m_columns != null)
	{
		for(var i = 0, l = this.m_columns.length; i < l; i++)
		{
			this.m_columns[i].stopEventHandlers();
		}
	}

	if(this.m_verticalScrollbar != null) this.m_verticalScrollbar.stopEventHandlers();
	//PDL if(this.m_horizontalScrollbar != null) this.m_horizontalScrollbar.stopEventHandlers();
}

GridRenderer.prototype._handleRowSelect = function(row)
{
    // Set selected row
	var viewRowNumber = row.getViewRowNumber();

    // send row selection event to the controller
	var selectEvent = new RowSelectionEvent(viewRowNumber);
	this.m_adaptor.handleSelectionChange(selectEvent);
}

GridRenderer.prototype._handleVerticalScroll = function(pos, range, size)
{
    // send row selection event to the controller
	var scrollEvent = new VerticalScrollbarRenderEvent(this.m_verticalScrollbar.m_position);
	this.m_adaptor.handleVerticalScroll(scrollEvent);
}



/**
 * ToDo: handle the sort from a column click
 */ 
GridRenderer.prototype._handleColumnHeaderClick = function(columnNumber)
{
	var sortEvent = new ColumnSortEvent(columnNumber);
	this.m_adaptor.handleColumnHeaderClick(sortEvent);
}

GridRenderer.prototype.configureHeaderSorting = function(i, sortComparator)
{
	var col = this.m_columns[i];
	if(col != null)
	{
		col.setSortEnabled(sortComparator != "disabled");
		col.render();
	}
	else
	{
		if(GridGUIAdaptor.m_logger.isWarn()) GridGUIAdaptor.m_logger.warn("GridRenderer.configureHeaderSorting() unknown column number i = " + i + ", sortComparator = " + sortComparator);
	}
}

GridRenderer.prototype.getHeaderRow = function()
{
	return this.m_headerRow;
}
