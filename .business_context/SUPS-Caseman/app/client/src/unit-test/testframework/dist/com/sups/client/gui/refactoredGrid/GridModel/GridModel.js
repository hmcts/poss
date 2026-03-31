
/**
 * Class to represent the visible portion of the total dataset. This is used to minimise updates 
 * to the view to only those rows that are visible. This range will be updated by paging events.
 *
 * ToDo: Clean up the Grid selection code. Pretty nasty at the moment. Separate the single and multiple selection
 * code, separate out the defaulting behaviour, always read from the DOM rather than internal members etc.
 */
function GridRowRange(model, startRowNumber, numberOfRows)
{
	this.m_model = model;
	this.m_startRowNumber = parseInt(startRowNumber);
	this.m_numberOfRows = parseInt(numberOfRows);
	this._calculateEndRowNumber();
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridRowRange() startRowNumber = " + startRowNumber + ", numberOfRows = " + numberOfRows);
}

GridRowRange.prototype.isRowVisible = function(rowNumber)
{
	var result = false;
	if(rowNumber>=this.m_startRowNumber && rowNumber<=this.m_endRowNumber)
	{
		result = true;
	}
	if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.m_model.getId() + " : GridRowRange.isRowVisible(rowNumber = " + rowNumber + ") startRowNumber = " + this.m_startRowNumber + ", endRowNumber = " + this.m_endRowNumber + ", returning " + result);
	return result;
}

GridRowRange.prototype.getStartRowNumber = function()
{
	return this.m_startRowNumber;
}
/**
 * Changing the start of the visible rows will cause a refresh of all rows in the view
 */
GridRowRange.prototype.setStartRowNumber = function(startRowNumber)
{
	if(startRowNumber < 0)
	{
		startRowNumber = 0;
	}
	if(this.m_startRowNumber != startRowNumber)
	{
		if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridRowRange.setStartRowNumber() new startRowNumber = " + startRowNumber + ". About to refresh all view rows.");
		this.m_startRowNumber = startRowNumber;
		this._calculateEndRowNumber();
		this.m_model.refreshAllViewRows();
		// update the scrollbar
		this.m_model.setVerticalScrollBarPosition(startRowNumber);
	}
}
GridRowRange.prototype.getEndRowNumber = function()
{
	return this.m_endRowNumber;
}
GridRowRange.prototype._calculateEndRowNumber = function()
{
	this.m_endRowNumber = parseInt((this.m_startRowNumber + this.m_numberOfRows)) - 1;
}

GridRowRange.prototype.getNumberOfRows = function()
{
	return this.m_numberOfRows;
}

/**
 * Main class to represent and provide access to the grid model.
 */
function GridModel(adaptor)
{
	this.m_adaptor = adaptor;
	this.m_rowRenderEventQueue = new RenderEventQueue();
	this.m_columnRenderEventQueue = new RenderEventQueue();
	this.m_gridModelEvent = null;
	
	// this is the actual data structure that holds the rows and cell information. It is
	// an array of arrays with additional properties on the rows.
	this.m_data = new Array();
	
	// this is an array of columns that hold information about the xpath, sorting etc.
	this.m_columns = new Array();

	this.m_isSortable = true;
	
	this.m_cursorRow = 0;
	this.m_verticalScrollBarScale = 0;
	this.m_verticalScrollBarPosition = 0;

	this.m_valid = true;
	this.m_enabled = true;
	this.m_readOnly = false;
	this.m_hasFocus = false;
	this.m_active = true;
}

GridModel.prototype.dispose = function()
{
	this.m_gridRenderer = null;
	this.m_adaptor = null;
}
/**
 * This is a debug method that returns lots of information about the underlying data
 * and the selected rows.
 */
GridModel.prototype._getDebugInfo = function()
{
	var debug = "GridModel id:" + this.getId() + ", multipleSelection:" + this.m_multipleSelection + ", cursorRow:" + this.m_cursorRow;
	debug += " \ndata: length = " + this.m_data.length;
	for(var i=0; i<this.m_data.length; i++)
	{
		debug += ", data[" + i + "].key = " + this.m_data[i].key;
	}
	return debug;
}

/**
 * Utility function that gets the ID of the component from the adaptor. This method
 * is only called from debug statements.
 */
GridModel.prototype.getId = function()
{
	return this.m_adaptor.getId();
}

GridModel.prototype.setView = function(gridRenderer)
{
	this.m_gridRenderer = gridRenderer;
	gridRenderer.setModel(this);

	// set the view row range, i.e. map the view rows onto the data rows
	this.m_rowRange = new GridRowRange(this, 0, gridRenderer.getNumberOfRowsInView());
	this.setVerticalScrollBarScale();
}

GridModel.prototype.getRowRange = function()
{
	var rowRange = new Object();
	rowRange.startRowNumber = this.m_rowRange.getStartRowNumber();
	rowRange.numberOfRowsInView = parseInt(rowRange.startRowNumber) + parseInt(this.m_gridRenderer.getNumberOfRowsInView());
	rowRange.maxNumberOfRows = this.m_data.length;
	return rowRange;
}

GridModel.prototype.getCurrentSelectedRow = function()
{
	return this.getDataRowNumberByKey(Services.getValue(this.m_dataBinding));
}

GridModel.prototype.getSelectedRows = function()
{
	var selectedRowsDataNumbers = new Array();
	var keys = Services.getNode(this.m_dataBinding);
	if(keys != null)
	{
		var keyXPath = this.getKeyXPath();
		var keyNodes = keys.selectNodes(keyXPath);
		for(var j=0, l=keyNodes.length; j<l; j++)
		{
			var key = XML.getNodeTextContent(keyNodes[j]);
			selectedRowsDataNumbers[selectedRowsDataNumbers.length] = this.getDataRowNumberByKey(key);
		}
	}
	return selectedRowsDataNumbers;
}

GridModel.prototype.getView = function()
{
	return this.m_gridRenderer;
}


GridModel.prototype.getAdaptor = function()
{
	return this.m_adaptor;
}

/**
 *
 */
GridModel.prototype.handleRowAggregateStateChangeEvent = function(event)
{
	var key = event.getKey();
	var dataRowNumber = this.getDataRowNumberByKey(key);

	if(dataRowNumber != null)
	{
		var dataRow = this.m_data[dataRowNumber];
		dataRow.submissible = event.getIsSubmissible();
	
		var event = new RowRenderEvent(dataRowNumber, key, "handleRowAggregateStateChangeEvent");
		this.publishRowRenderEvent(event);
	}
}

/**
 * Set the grid rendering event. These events are not queued and simple
 * overwrite the previous event because the grid only has simple attributes.
 */
GridModel.prototype.publishGridRenderEvent = function(event)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.publishGridRenderEvent() event = " + event.toString());
	this.m_valid = event.getValid();
	this.m_serverValid = event.getServerValid();
	this.m_enabled = event.getEnabled();
	this.m_readOnly = event.getReadOnly();
	this.m_hasFocus = event.getHasFocus();
	this.m_active = event.getActive();
	this.m_isSubmissible = event.getIsSubmissible();
	this.m_gridModelEvent = event;
}

/**
 * Set the grid rendering event. These events are not queued and simple
 * overwrite the previous event because the grid only has simple attributes.
 */
GridModel.prototype.publishVerticalScrollbarRenderEvent = function(event)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.publishVerticalScrollbarRenderEvent() event = " + event.toString());
	this.m_verticalScrollbarEvent = event;
}

/**
 * Add a row rendering event to the internal event queue
 */
GridModel.prototype.publishRowRenderEvent = function(event)
{
	if(GridGUIAdaptor.m_logger.isDebug())
	{
		GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.publishRowRenderEvent() event = " + event.toString());
		var viewRowNumber = event.getViewRowNumber();
		if(viewRowNumber < 0 || viewRowNumber > this.m_rowRange.getNumberOfRows())
		{
			GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.publishRowRenderEvent() warning, the view row number exceeds the actual number of rows in the view");
		}
	}
	this.m_rowRenderEventQueue.addEvent(event);
}

/**
 * Add a column rendering event to the internal event queue
 */
GridModel.prototype.publishColumnRenderEvent = function(event)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.publishColumnRenderEvent() event = " + event.toString());
	this.m_columnRenderEventQueue.addEvent(event);
}

GridModel.prototype.getViewRowNumberFromDataRowNumber = function(dataRowNumber)
{
	var startRowNumber = this.m_rowRange.getStartRowNumber();
	var viewRowNumber = parseInt(dataRowNumber) - parseInt(startRowNumber);
	return viewRowNumber;
}

/**
 * ToDo: need more on the removing of duplicates, especially when we remove a row from the grid
 * source data - need to send an additional event(s) because it can shift the data which can affect
 * the visible rows. Maybe we need to process add and update events first, and then process remove 
 * events, or examine the rows and build up a picture of what has changed to map this onto the 
 * view rows
 */
GridModel.prototype.processRenderEvents = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents()");
	var renderer = this.m_gridRenderer;
	
	// Process row events first
	var events = this.m_rowRenderEventQueue.getEvents();
	var processedEvents = new Array();
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents() number of row render events = " + events.length);
	// Process the row events in reverse order, i.e. the latest events first. This fixed the refresh problem in filtered grids
	// where the filtering generated multiple row events for the same key but with different data row numbers due to the
	// filtering. Because we are filtering out duplicate events for the same key we were processing the old data row number
	// which meant the latest event with the correct data row number was missed. An alternative solution is to always look up
	// the correct dataRowNumber based on the key but this may have performance problems.
	for(var i=events.length-1; i>=0; i--)
	{
		var event = events[i];
		var rowKey = event.getKey();
		
		// don't process the same event multiple times - the event triggers the 
		// getting of the information from the model
		if(processedEvents["" + rowKey] == null || rowKey == null)
		{
			if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.processRenderEvents() event number " + i + " for row with key = " + rowKey);
			// only send events for visible rows
			var dataRowNumber = event.getDataRowNumber();
			if(this.m_rowRange.isRowVisible(dataRowNumber))
			{
				// set the view row number prior to sending to the view
				event.setViewRowNumber(this.getViewRowNumberFromDataRowNumber(dataRowNumber));
				renderer.handleRowRenderEvent(event);
			}
			else
			{
				if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.processRenderEvents() event number " + i + " dataRowNumber " + dataRowNumber + " is not visible, therefore not sending event to view");
			}
			processedEvents[rowKey] = true;
		}
		else
		{
			if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.processRenderEvents() ignoring event number " + i + " rowKey = " + rowKey + ", processedEvents[rowKey] = " + processedEvents["" + rowKey]);
		}
	}
	// remove processed events
	this.m_rowRenderEventQueue.clear();

	// Process column events - don't bother removing duplicates because this should never really happen
	var events = this.m_columnRenderEventQueue.getEvents();
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents() number of column render events = " + events.length);
	for(var i=0, l=events.length; i<l; i++)
	{
		var event = events[i];
		if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.processRenderEvents() event for column number = " + event.getColumnNumber());
		renderer.handleColumnRenderEvent(event);
	}
	// remove processed events
	this.m_columnRenderEventQueue.clear();
	
	// Process grid event
	var gridModelEvent = this.m_gridModelEvent;
	if(gridModelEvent != null)
	{
		if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents() grid event is not null therefore processing");
		renderer.handleGridRenderEvent(gridModelEvent);
		this.m_gridModelEvent = null;
	}
	
	// Process vertical scrollbar event
	var verticalScrollbarEvent = this.m_verticalScrollbarEvent;
	var previousVerticalScrollbarEvent = this.m_previousVerticalScrollbarEvent;
	if(verticalScrollbarEvent != null)
	{
		if(previousVerticalScrollbarEvent!=null && previousVerticalScrollbarEvent.equals(verticalScrollbarEvent))
		{
			if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents() scrollbar event is the same as the previous event, therefore not processing");
		}
		else
		{
			if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.processRenderEvents() scrollbar event is not null therefore processing");
			renderer.handleVerticalScrollbarRenderEvent(verticalScrollbarEvent);
		}
		this.m_previousVerticalScrollbarEvent = verticalScrollbarEvent;
		this.m_verticalScrollbarEvent = null;
	}
}

GridModel.prototype.getColumns = function()
{
	return this.m_columns;
}
GridModel.prototype.setColumns = function(columns)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.setColumns() " + ((columns != null) ? "number of columns = " + columns.length : "columns is null!") );
	var renderer = this.getView();
	this.m_columns.length = 0;
	for(var i=0, l=columns.length; i<l; i++)
	{
		var column = columns[i];
		this.m_columns[i] = ColumnHeader.create(this, i, column);
		var sortComparator = (this.m_isSortable == true) ? column.sort : "disabled";
		renderer.configureHeaderSorting(i, sortComparator);
	}
}

GridModel.prototype.getData = function()
{
	return this.m_data;
}
GridModel.prototype.setData = function(data)
{
	this.m_data = data;
	
	this.resetStartRowNumberAfterDataChange();

	this.setVerticalScrollBarScale();
}

GridModel.prototype.resetStartRowNumberAfterDataChange = function()
{
	// If the new src data is smaller than the old data then we need to
	var maxNumberOfRows = this.m_data.length;
	var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
	var maxStartRowNumber = maxNumberOfRows - numberOfRowsInView;
	if(maxStartRowNumber < 0)
	{
		maxStartRowNumber = 0;
	}
	var startRowNumber = this.m_rowRange.getStartRowNumber();
	if(maxStartRowNumber < startRowNumber)
	{
		this.m_rowRange.setStartRowNumber(maxStartRowNumber);
	}
}

GridModel.prototype.getRowRenderingRule = function()
{
	return this.m_rowRenderingRule;
}
GridModel.prototype.setRowRenderingRule = function(rowRenderingRule)
{
	this.m_rowRenderingRule = rowRenderingRule;
}

/**
 * Method to fire an event for each row in the view to refresh the entire grid
 */
GridModel.prototype.refreshAllViewRows = function()
{
	var startRowNumber = this.m_rowRange.getStartRowNumber();
	var endRowNumber = this.m_rowRange.getEndRowNumber();
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.refreshAllViewRows() startRowNumber = " + startRowNumber + ", endRowNumber = " + endRowNumber);
	
	for(var i=startRowNumber; i<=endRowNumber; i++)
	{
		var rowData = this.m_data[i];
		var key = null;
		if(rowData != null)
		{
			key = rowData.key;
		}
		var event = new RowRenderEvent(i, key, "refreshAllViewRows");
		this.publishRowRenderEvent(event);
	}
}

/**
 * Method used to retrieve information about a data row, used by the view when the view
 * receives an event from the model containing a data row number.
 */
GridModel.prototype.getDataRowByDataRowNumber = function(rowNumber)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.getDataRowByDataRowNumber() dataRowNumber = " + rowNumber);
	var dataRow = null;
	var row = this.m_data[rowNumber];
	if(row != null)
	{
		dataRow = DataRow.create(row);
		if(null != this.m_rowRenderingRule)
		{
		    // Determine additional styling classes
		    var additionalStylingClasses = this.m_rowRenderingRule.call(this.m_adaptor, dataRow.getKey());
		    dataRow.setAdditionalStylingClasses(additionalStylingClasses);
		}	
	}
	return dataRow;
}

/**
 * Given a key, return the data row number
 */
GridModel.prototype.getDataRowNumberByKey = function(key)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.getDataRowNumberByKey() key = " + key);
	var dataRowNumber = this.m_data["key:" + key];
	if(this.m_data[dataRowNumber] == null) dataRowNumber = null;
	return dataRowNumber;
}

/**
 * Called when the data at the grid's dataBinding changes in the DOM. This will
 * update the selections on the grid.
 */
GridModel.prototype.refreshDataBinding = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.refreshDataBinding()");
	var db = this.m_dataBinding;
	if(null != db)
	{
		this.m_selectionStrategy.refreshSelectionsFromDataBinding();
	}
}

GridModel.prototype.filterSrcData = function(dataModelEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.filterSrcData() dataModelEvent = " + dataModelEvent.toString());
	this.refreshSrcData(dataModelEvent);
	// reset the start row number because filtering is likely to reduce the size of the data
	// and this can lead to the grid going blank until the user attempts to scroll or keyboard
	// navigate. This could potentially be a problem for refreshSrcData() as well???
	//this.m_rowRange.setStartRowNumber(0);
	this.resetStartRowNumberAfterDataChange();
}

/**
 * Called when the grid's underlying src data has changed. This is delegated to
 * the current loaded data loading strategy.
 */
GridModel.prototype.refreshSrcData = function(dataModelEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.refreshSrcData() dataModelEvent = " + dataModelEvent.toString());
	// ToDo: the refreshing of the src data needs to take into account the current sorting 
	// columns etc. Not a problem for the default strategy because all data is already loaded
	this.getDataLoadingStrategy().refreshSrcData(dataModelEvent);

	// then sort the data according to current sorting configuration
	this._sortData();
	
	// reloading the data can leave the row data structures with only the default values
	// for selection and the cursor row, we need to reset these to what they were prior to
	// the data refresh
	this.m_selectionStrategy.resetRowStatesAfterSrcDataRefresh();
}

// Configurations passed from the GUIAdaptor
GridModel.prototype.getKeyXPath = function()
{
	return this.m_keyXPath;
}
GridModel.prototype.setKeyXPath = function(keyXPath)
{
	this.m_keyXPath = keyXPath;
}

GridModel.prototype.getRowXPath = function()
{
	return this.m_rowXPath;
}
GridModel.prototype.setRowXPath = function(rowXPath)
{
	this.m_rowXPath = rowXPath;
}

GridModel.prototype.setMultipleSelectionMode = function(multipleSelection)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.setMultipleSelectionMode() multipleSelection = " + multipleSelection);
	this.m_multipleSelection = multipleSelection;
	this.m_selectionStrategy = GridSelectionStrategy.createGridSelectionStrategy(this, multipleSelection);	
}

GridModel.prototype.setDataBinding = function(dataBinding)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.setDataBinding() dataBinding = " + dataBinding);
	this.m_dataBinding = dataBinding;
}

GridModel.prototype.setIsSortable = function(isSortable)
{
	this.m_isSortable = isSortable;
}

// End of Configurations passed from the GUIAdaptor


/**
 * This returns the current data loading strategy. Need to determine whether
 * this is configured, or dynamically changes based on size of data etc.
 * ToDo: implement the lazy loading strategy, currently only got the load complete data strategy
 */
GridModel.prototype.getDataLoadingStrategy = function()
{
	if(this.m_currentDataLoadingStrategy == null)
	{
		this.m_currentDataLoadingStrategy = new LoadCompleteDataStrategy(this);
	}
	return this.m_currentDataLoadingStrategy;
}


GridModel.prototype.isGridSelectable = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.isGridSelectable() this.m_readOnly = " + this.m_readOnly + ", this.m_enabled = " + this.m_enabled + ", this.m_active = " + this.m_active + ", returning " + (this.m_readOnly == false && this.m_enabled == true && this.m_active == true));
	return (this.m_readOnly == false && this.m_enabled == true && this.m_active == true);
}

/**
 * Called when the user clicks on a row. This needs to update the datamodel with the selected
 * row(s), handle the grid's selected mode, and publish row render updates to the view to display
 * the selected rows.
 */
GridModel.prototype.selectRow = function(selectEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.selectRow() selectEvent = " + selectEvent.toString());
	if(this.isGridSelectable())
	{
		var startRowNumber = this.m_rowRange.getStartRowNumber();
		var viewRowNumber = selectEvent.getViewRowNumber();
		var dataRowNumber = parseInt(startRowNumber) + parseInt(viewRowNumber);
		this.m_selectionStrategy.selectRow(dataRowNumber, false);
	}
}

/**
 * Called when the user clicks on a row. This needs to update the datamodel with the selected
 * row(s), handle the grid's selected mode, and publish row render updates to the view to display
 * the selected rows.
 */
GridModel.prototype.setCursorRow = function(dataRowNumber)
{
	if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.setCursorRow() dataRowNumber = " + dataRowNumber);
	// remove the cursor from the previous cursor row, and publish a row event
	var currentCursorDataRowNumber = this.m_cursorRow;
	if(currentCursorDataRowNumber >= this.m_data.length)
	{
		currentCursorDataRowNumber = this.m_data.length - 1;
	}
	var currentCursorDataRow = this.m_data[currentCursorDataRowNumber];
	if(currentCursorDataRow != null)
	{
		if(this.m_rowRange.isRowVisible(currentCursorDataRowNumber))
		{
			// only send a row render event if the old row is still visible
			var event = new RowRenderEvent(currentCursorDataRowNumber, currentCursorDataRow.key, "setCursorRow");
			this.publishRowRenderEvent(event);
		}
		currentCursorDataRow.cursor = false;
	
		// set the cursor to the selected row, and publish a row event
		var dataRow = this.m_data[dataRowNumber];
		this.m_cursorRow = dataRowNumber;
		if(dataRow != null)
		{
			dataRow.cursor = true;
			if(this.m_rowRange.isRowVisible(dataRowNumber))
			{
				var event = new RowRenderEvent(dataRowNumber, dataRow.key, "setCursorRow");
				this.publishRowRenderEvent(event);
			}
		}
	}
	else
	{
		// Due to the src data refreshing, or filters being applied to the src data
		// the cursor row is no longer valid, therefore call one of the keypress handlers
		// because this will take care of resetting the cursor and top row to something
		//sensible including resetting the scrollbar scale etc.
		this.m_cursorRow = 0;
		this._handleKeyDown();
	}
}

/**
 * ToDo: generate a scroll bar event, that can be processed during and fired to the view
 */
GridModel.prototype.setVerticalScrollBarPosition = function(position, renderChangeInScrollbar)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.setVerticalScrollBarPosition() position = " + position);
	if(this.m_verticalScrollBarPosition != position)
	{
		this.m_verticalScrollBarPosition = position;
		var scrollbarEvent = new VerticalScrollbarRenderEvent(position, this.m_verticalScrollBarScale);
		this.publishVerticalScrollbarRenderEvent(scrollbarEvent);
	}
}

/**
 * ToDo: generate a scroll bar event, that can be processed during and fired to the view
 */
GridModel.prototype.setVerticalScrollBarScale = function()
{
	var maxNumberOfRows = this.m_data.length;
	var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
	this.m_verticalScrollBarScale = (numberOfRowsInView > maxNumberOfRows) ? numberOfRowsInView : maxNumberOfRows;
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.setVerticalScrollBarScale() verticalScrollBarScale = " + this.m_verticalScrollBarScale);
	
	var scrollbarEvent = new VerticalScrollbarRenderEvent(this.m_verticalScrollBarPosition, this.m_verticalScrollBarScale);
	this.publishVerticalScrollbarRenderEvent(scrollbarEvent);
}

/**
 * Method modifies grid rendering following a user pressing the down
 * key whilst the grid component has focus.
 *
*/
GridModel.prototype._handleKeyDown = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyDown()");
	var cursorRow = this.m_cursorRow;
	var topRow = this.m_rowRange.getStartRowNumber();
	var maxNumberOfRows = this.m_data.length;
	var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
    if(this.m_cursorRow < maxNumberOfRows - 1)
    {
        if(cursorRow >= topRow && cursorRow <= (topRow + numberOfRowsInView - 1))
        {
            // Cursor is visible so move cursor down
            if(cursorRow == (topRow + numberOfRowsInView - 1))
            {
                // Cursor is moving out of current view
                this.m_rowRange.setStartRowNumber(++topRow);
                this.setCursorRow(++cursorRow);
            }
            else
            {
                // Cursor is still in view. Therefore, reset styling of effected rows
                this.setCursorRow(++cursorRow);
            }
        }
        else
        {
            // Cursor is not currently visible. Move display to new cursor position.
            this.setCursorRow(++cursorRow);
            this.m_rowRange.setStartRowNumber(cursorRow);
            topRow = cursorRow;
            // Check top row for end of data array
            if(topRow + numberOfRowsInView > maxNumberOfRows - 1)
            {
            	topRow = maxNumberOfRows - numberOfRowsInView;
            	this.m_rowRange.setStartRowNumber(topRow);
            }
        }
    }
    else
    {
        // On last element in array. Do not move cursor but display if not visible.
        if(topRow < maxNumberOfRows - numberOfRowsInView)
        {
            topRow = maxNumberOfRows - numberOfRowsInView;
            this.m_rowRange.setStartRowNumber(topRow);
        }
    }
}

/**
 * Method modifies grid rendering following a user pressing the up
 * key whilst the grid component has focus.
 *
*/
GridModel.prototype._handleKeyUp = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyUp()");
	var cursorRow = this.m_cursorRow;
    if(cursorRow > 0)
    {
		var topRow = this.m_rowRange.getStartRowNumber();
		var maxNumberOfRows = this.m_data.length;
		var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
        if(cursorRow >= topRow && cursorRow <= (topRow + numberOfRowsInView - 1))
        {
            // Cursor is visible so move cursor up
            if(cursorRow == topRow)
            {
                // Cursor is moving out of current view
	            this.m_rowRange.setStartRowNumber(--topRow);
	            this.setCursorRow(--cursorRow);
            }
            else
            {
                // Cursor is still in view. Therefore, reset styling of effected rows.
	            this.setCursorRow(--cursorRow);
            }
        }
        else
        {
            // Cursor is not visible
	        this.m_rowRange.setStartRowNumber(--cursorRow);
	        this.setCursorRow(cursorRow);
            if(topRow + numberOfRowsInView > maxNumberOfRows - 1)
            {
                topRow = maxNumberOfRows - numberOfRowsInView;
                if(topRow < 0)
                {
                    topRow = 0;
                }
                this.m_rowRange.setStartRowNumber(topRow);
            }
        }
    }
    else
    {
        // Cursor at top row. If not visible display.
        if(topRow != 0)
        {
            topRow = 0;
            this.m_rowRange.setStartRowNumber(topRow);
        }
    }
}

/**
 * Method invokes row selection code for current cursor position. Returns true if
 * a row was selected;
 *
*/
GridModel.prototype._handleKeySpace = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeySpace()");
	var result = false;
	if(this.isGridSelectable())
	{
		var maxNumberOfRows = this.m_data.length;
	    if(maxNumberOfRows > 0)
	    {
			var cursorRow = this.m_cursorRow;
			var topRow = this.m_rowRange.getStartRowNumber();
			var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
	        // Grid has data to be selected
	        if(cursorRow >= topRow && cursorRow <= (topRow + numberOfRowsInView - 1))
	        {
	        }
	        else
	        {
	            // Row is not currently visible
	            topRow = cursorRow;
	            if(topRow + numberOfRowsInView > maxNumberOfRows - 1)
	            {
	                topRow = maxNumberOfRows - numberOfRowsInView;
	            }
	            this.m_rowRange.setStartRowNumber(topRow);
	        }
		    // send row selection event to the controller
			var selectEvent = new RowSelectionEvent(cursorRow - topRow);
			this.selectRow(selectEvent);
			result = true;
	    }
	}
    return result;
}

/**
 * Method moves cursor down grid one page.
 *
*/
GridModel.prototype._handleKeyPageDown = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handlePageDown()");
	var cursorRow = this.m_cursorRow;
	var topRow = this.m_rowRange.getStartRowNumber();
	var maxNumberOfRows = this.m_data.length;
	var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
    if(cursorRow < maxNumberOfRows - 1)
    {
        // Cursor is not at bottom of grid
        if(cursorRow >= topRow && cursorRow <= (topRow + numberOfRowsInView - 1))
        {
            // Cursor is visible. Move both cursor and top row.
            cursorRow += numberOfRowsInView;
            if(cursorRow > maxNumberOfRows - 1)
            {
                cursorRow = maxNumberOfRows - 1;
            }
            topRow += numberOfRowsInView;
            if(topRow + numberOfRowsInView > maxNumberOfRows - 1)
            {
                topRow = maxNumberOfRows - numberOfRowsInView;
                if(topRow < 0)
                {
                    topRow = 0;
                }
            }
        }
        else
        {
            // Cursor is not currently visible
            cursorRow += numberOfRowsInView;
            if(cursorRow > maxNumberOfRows - 1)
            {
                cursorRow = maxNumberOfRows - 1;
            }
            topRow = cursorRow;
            if(topRow + numberOfRowsInView > maxNumberOfRows - 1)
            {
                topRow = maxNumberOfRows - numberOfRowsInView;
            }
        }   
        this.m_rowRange.setStartRowNumber(topRow);
        this.setCursorRow(cursorRow);
    }
    else
    {
        // On last element in array. Do not move cursor but display if not visible.
        if(topRow < maxNumberOfRows - numberOfRowsInView)
        {
            topRow = maxNumberOfRows - numberOfRowsInView;
	        this.m_rowRange.setStartRowNumber(topRow);
        }
    }
}

/**
 * Method moves cursor up one grid page
*/
GridModel.prototype._handleKeyPageUp = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handlePageUp()");
	var cursorRow = this.m_cursorRow;
    if(cursorRow > 0)
    {
		var topRow = this.m_rowRange.getStartRowNumber();
		var maxNumberOfRows = this.m_data.length;
		var numberOfRowsInView = this.m_gridRenderer.getNumberOfRowsInView();
    
        // Cursor is not at top of grid
        if(cursorRow >= topRow && cursorRow <= (topRow + numberOfRowsInView - 1))
        {
            // Cursor is visible. Move both cursor and top row.
            cursorRow -= numberOfRowsInView;
            if(cursorRow < 0)
            {
                cursorRow = 0;
            }
            topRow -= numberOfRowsInView;
            if(topRow < 0)
            {
                topRow = 0;
            }
        }
        else
        {
            // Cursor is not currently visible
            cursorRow -= numberOfRowsInView;
            if(cursorRow < 0)
            {
                cursorRow = 0;
            }
            topRow = cursorRow;
        }
        this.m_rowRange.setStartRowNumber(topRow);
        this.setCursorRow(cursorRow);
    }
    else
    {
       // Cursor at top row. If not visible display.
        if(topRow != 0)
        {
            topRow = 0;
	        this.m_rowRange.setStartRowNumber(topRow);
        }
    }
}

/**
 * Method moves selected column one column left. If already at the leftmost
 * column then selection moves to the rightmost column.
*/
GridModel.prototype._handleKeyLeft = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyLeft()");

	var cols = this.getColumns();
	var firstColumn = cols[0].getColumnNumber();
	var selectedColumn;

	if(this.m_selectedColumn == firstColumn)
	{
		// At the leftmost column, so move to the rightmost columm
		var length = cols.length;
		selectedColumn = cols[length - 1].getColumnNumber();
	}
	else
	{
		// Move one column left	
		selectedColumn = cols[this.m_selectedColumn - 1].getColumnNumber();
	}
	
	// Publish an event to render the current column as not selected
	var event = new ColumnSortEvent(this.m_selectedColumn, null);
	this.publishColumnRenderEvent(event);

	// We have to render the column header with a sort ascending icon, sort
	// descending icon or not sorted icon
	var headerIcon = ColumnRenderer.SORT_NONE;
	
	// Determine which icon to use if the newly selected column is the sorted column
	if(selectedColumn == this.m_sortColumn)
	{
		var sortDirection = this.m_columns[selectedColumn].getSortDirection();
		
		if(true == sortDirection)
		{
			headerIcon = ColumnRenderer.SORT_ASC;
		}
		else if(false == sortDirection)
		{
			headerIcon = ColumnRenderer.SORT_DSC;
		}
	}
	
	// Publish an event to render the newly selected column's sort direction
	event = new ColumnSortEvent(selectedColumn, headerIcon);
	this.publishColumnRenderEvent(event);
	
	// Store the newly selected column
	this.m_selectedColumn = selectedColumn;
}

/**
 * Method moves selected column one column right. If already at the rightmost
 * column then selection moves to the leftmost column.
*/
GridModel.prototype._handleKeyRight = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyRight()");

	var cols = this.getColumns();
	var length = cols.length;
	var lastColumn = cols[length - 1].getColumnNumber();
	var selectedColumn;

	if(this.m_selectedColumn == lastColumn)
	{
		// At the rightmost column, so move to the leftmost columm
		selectedColumn = cols[0].getColumnNumber();
	}
	else
	{
		// Move one column right
		selectedColumn = cols[this.m_selectedColumn + 1].getColumnNumber();
	}

	// Publish an event to render the current column as not selected
	var event = new ColumnSortEvent(this.m_selectedColumn, null);
	this.publishColumnRenderEvent(event);
	
	// We have to render the column header with a sort ascending icon, sort
	// descending icon or not sorted icon
	var headerIcon = ColumnRenderer.SORT_NONE;
	
	// Determine which icon to use if the newly selected column is the sorted column
	if(selectedColumn == this.m_sortColumn)
	{
		var sortDirection = this.m_columns[selectedColumn].getSortDirection();
		
		if(true == sortDirection)
		{
			headerIcon = ColumnRenderer.SORT_ASC;
		}
		else if(false == sortDirection)
		{
			headerIcon = ColumnRenderer.SORT_DSC;
		}
	}
	
	// Publish an event to render the newly selected column's sort direction
	event = new ColumnSortEvent(selectedColumn, headerIcon);
	this.publishColumnRenderEvent(event);
	
	// Store the newly selected column
	this.m_selectedColumn = selectedColumn;
}

/**
 * Method sorts the selected column in descending order. 
*/
GridModel.prototype._handleKeyShiftUp = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyShiftUp()");

	var sorted = false;
	var sortDirection = this.m_columns[this.m_selectedColumn].getSortDirection();
	
	if(false == sortDirection || null == sortDirection)
	{
		// Column currently sorted as ascending, so sort as descending
		var sortEvent = new ColumnSortEvent(this.m_selectedColumn, true);
		this.sortData(sortEvent);
		sorted = true;
	}
	
	return sorted;
}

/**
 * Method sorts the selected column in ascending order. 
*/
GridModel.prototype._handleKeyShiftDown = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel._handleKeyShiftDown()");

	var sorted = false;
	var sortDirection = this.m_columns[this.m_selectedColumn].getSortDirection();

	if(true == sortDirection  || null == sortDirection)
	{
		// Column currently sorted as descending, so sort as ascending
		var sortEvent = new ColumnSortEvent(this.m_selectedColumn, false);
		this.sortData(sortEvent);
		sorted = true;
	}
	
	return sorted;
}

/**
 * Method sets the selected column member variable. 
*/
GridModel.prototype.setSelectedColumn = function(column)
{
	this.m_selectedColumn = column;
}

/**
 * Method gets the selected column member variable. 
*/
GridModel.prototype.getSelectedColumn = function()
{
	return this.m_selectedColumn;
}

/**
 * Method scrolls the vertical scroll bar
*/
GridModel.prototype.verticalScroll = function(scrollEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.verticalScroll() scrollEvent = " + scrollEvent.toString());
	var topRow = this.m_rowRange.getStartRowNumber();
	var scrollbarPosition = scrollEvent.getPosition();
	if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace(this.getId() + " : GridModel.verticalScroll() topRow = " + topRow + ", scrollbarPosition = " + scrollbarPosition);
	if(topRow != scrollbarPosition)
	{
		this.m_rowRange.setStartRowNumber(scrollbarPosition);
	}
}

/**
 * Method scrolls the selected row into view
*/
GridModel.prototype.scrollSelectedRowIntoView = function()
{
	this.m_selectionStrategy.scrollSelectedRowIntoView();
}

/**
 * Method refreshes the submissibilty state of each row that has been
 * previously selected
*/
GridModel.prototype.refreshKeyStates = function()
{
	var dataBinding = this.m_dataBinding;
	var currentSelection = Services.getValue(dataBinding);
	var keyStates = this.m_adaptor.getAggregateState().getKeyStates();
	
	for(var i in keyStates)
	{
		Services.setValue(dataBinding, i);
	}
	
	Services.setValue(dataBinding, currentSelection);
}

/**
 * Called when the user wants to sort on a column of data. This is delegated to
 * the current loaded data loading strategy in case we need to load data to be able 
 * to complete the sort.
 */
GridModel.prototype.sortData = function(sortEvent)
{
	// This method can be called after the refreshSrcData
	if(sortEvent != null)
	{
		if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.sortData() sortEvent = " + sortEvent.toString());
		var column = sortEvent.getColumnNumber();
		var sortDirection = sortEvent.getSortDirection();
		if(column == this.m_sortColumn)
		{
			if(sortDirection == null) sortDirection = !this.m_columns[column].getSortDirection();
			this.m_columns[column].setSortDirection(sortDirection);
		}
		else
		{
			if(sortDirection == null) sortDirection = false;
			if(this.m_sortColumn != null) this.m_columns[this.m_sortColumn].setSortDirection(null);
			this.m_sortColumn = column;
			this.m_columns[this.m_sortColumn].setSortDirection(sortDirection);
		}
	}
	this.getDataLoadingStrategy().loadDataForSort(sortEvent);
	
	this._sortData();
}

/**
 * Method _sortData() configures the parameters required by the method _sort()
 * to sort the displayed grid. Subsequently, the method invokes the Javascript
 * sort function on the internal data structure with _sort() as the custom sorting
 * function.
*/
GridModel.prototype._sortData = function()
{
	if(true == this.m_isSortable && this.m_data.length > 1 && !this._isColumnSortingDisabled(this.m_sortColumn))
	{
		var currentCursorRow = this.m_data[this.m_cursorRow];
	    var comparatorDetails = new Array();
	    
		// First configure main sort column parameters
		var sortColumn = this.m_sortColumn;
		comparatorDetails[0] = new ColumnSortConfiguration();
		comparatorDetails[0].m_columnNumber = sortColumn;
		comparatorDetails[0].m_comparator = this._getComparator(sortColumn);
		comparatorDetails[0].m_sortAsc = this.m_columns[sortColumn].getSortDirection();
		
		// Check for configuration of additional column sorts
		var additionalSortColumns = this.m_columns[sortColumn].getAdditionalSortColumns();
		if(additionalSortColumns != null && additionalSortColumns.length > 0)
		{
		    var additionalSortColumn;
		    for(var i=0, l=additionalSortColumns.length; i<l; i++)
		    {
		        comparatorDetails[i + 1] = new ColumnSortConfiguration();
		        additionalSortColumn = additionalSortColumns[i];
		        comparatorDetails[i + 1].m_columnNumber = additionalSortColumn.columnNumber;
		        comparatorDetails[i + 1].m_comparator = this._getComparator(additionalSortColumn.columnNumber);
		        if(!comparatorDetails[0].m_sortAsc)
		        {
		            // RWW To me this is the ascending sort
		            if(additionalSortColumn.orderOnAsc != null)
		            {
		                comparatorDetails[i + 1].m_sortAsc = this._setAdditionalSortColumnSortOrder(additionalSortColumn.orderOnAsc);
		            }
		        } else {
		            if(additionalSortColumn.orderOnDesc != null)
		            {
		                comparatorDetails[i + 1].m_sortAsc = this._setAdditionalSortColumnSortOrder(additionalSortColumn.orderOnDesc);
		            }
		        }
		        if(comparatorDetails[i + 1].m_sortAsc == null) comparatorDetails[i + 1].m_sortAsc = comparatorDetails[0].m_sortAsc;
		    }
		}
		this._sort["comparatorDetails"] = comparatorDetails;
		try {
			this.m_data.sort(this._sort);
		} catch(e) {
			alert("GridGUIAdaptor._sortData() caught exception = " + e.message);
		}
		this.maintainKeyToDataRowNumberMapping();
		this.refreshAllViewRows();
		
		//this.m_selectionStrategy.resetSelectedDataRowNumbers();
		this.resetCursorRow(currentCursorRow);
	}
}

/**
 * Currently we maintain the key to data row number mapping for quick lookup when we
 * receive a change to the databinding (selected rows). This should be abstracted behind
 * an interface.
 */
GridModel.prototype.maintainKeyToDataRowNumberMapping = function()
{
	var data = this.m_data;
	for(var i=0, l=data.length; i<l; i++)
	{
		data["key:" + data[i].key] = i;
	}
}

/**
 * When we sort the cursor row needs to be updated because we store the row number 
 * for fast lookup rather than the row key. We therefore need to update this to the new row number.
 */
GridModel.prototype.resetCursorRow = function(row)
{
	if(row != null)
	{
		if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.getId() + " : GridModel.resetCursorRow() this.m_cursorRow currently set to = " + this.m_cursorRow + ", resetting it based on key " + row.key + " to " + this.getDataRowNumberByKey(row.key));
		this.setCursorRow(this.getDataRowNumberByKey(row.key));
	}
}

/**
 * Method to determine whether or not the use has configured a column to disable sorting.
 */
GridModel.prototype._isColumnSortingDisabled = function(sortColumn)
{
	var result = false;
    var comparator = this.m_columns[sortColumn].getSortComparator();
    if(comparator == "disabled")
    {
    	result = true;
    }
    return result;
}

/**
 * Method _getComparator() returns the sorting function for a
 * specified grid column.
 *
 * @param sortColumn A number identifying the column that is to be used to sort the grid.
 * @private
*/
GridModel.prototype._getComparator = function(sortColumn)
{
    var comparator = this.m_columns[sortColumn].getSortComparator();
    
    if(comparator == "numerical")
    {
    	comparator = Comparators.numericalSort;
    }
    else if(comparator == "numericalFloatingPoint")
    {
        comparator = Comparators.numericalFloatingPointSort;
    }
    else if(comparator == "disabled")
    {
    	comparator = null;
    }
    else if(comparator == "alphabeticalCaseInsensitive")
    {
    	comparator = Comparators.alphabeticalCaseInsensitiveSort;
    }
    else if(comparator == "alphabetical" || null==comparator)
    {
    	comparator = Comparators.alphabeticalSort;
    }
    //if(comparator == "alphabeticalLocaleCompare") comparator = GridModel._alphabeticalLocaleCompareSort;
    // ToDo: 
    //if(comparator == "alphanumerical") comparator = GridModel._alphanumericalSort;
    //if(comparator == "date") comparator = GridModel._dateSort;
    return comparator;
}

/**
 * Method _setAdditionalSortColumnSortOrder() determines the sorting order
 * for a grid column from one of the additional sort column configuration
 * parameters "orderOnAsc" or "orderOnDesc".
 *
 * @param sortOrder - The sorting order as defined in the sort configuration.
 *                    Note, this value may be null in which case a null value
 *                    is returned.
 *
*/
GridModel.prototype._setAdditionalSortColumnSortOrder = function(sortOrder)
{
    var sortAsc = null;
    if(sortOrder == GridGUIAdaptor.SORT_ASC)
    {
        sortAsc = false;
    }
    else if(sortOrder == GridGUIAdaptor.SORT_DESC)
    {
        sortAsc = true;
    }
    return sortAsc;
}


/**
 * Method _sort() is passed to the Javascript method sort() as the custom sorting function 
 * when the method is invoked on the data display array m_data.
*/
GridModel.prototype._sort = function(a, b)
{
    var sortConfiguration = null;
    var returnValue = 0;
    var index = 0;
	var comparatorDetails = arguments.callee["comparatorDetails"];
    var length = comparatorDetails.length;
    while(returnValue == 0 && index < length)
    {
        sortConfiguration = comparatorDetails[index];
	    if(sortConfiguration.m_sortAsc)
	    {
		    returnValue =  sortConfiguration.m_comparator.call(arguments.callee, a[sortConfiguration.m_columnNumber], b[sortConfiguration.m_columnNumber]);
	    }
	    else
	    {
		    returnValue =  sortConfiguration.m_comparator.call(arguments.callee, b[sortConfiguration.m_columnNumber], a[sortConfiguration.m_columnNumber]);
	    }
	    index++;
	}
	return returnValue;
}
