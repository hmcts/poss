//==================================================================
//
// GridGUIAdaptor.js
//
// Class for adapting grid gui component as implemented in
// com.sups.client.gui.grid.Grid.js for use in the framework.
//
//==================================================================



/**
 * Class for adapting grid gui component as implemented in
 * com.sups.client.gui.grid.Grid.js for use in the framework.
 *
 * @param e the top most div element for the grid to manage
 * @constructor
 */
function GridGUIAdaptor()
{
	this.multipleSelection = false;
	this.isSortable = true;
	this.generateKeys = true;

	// create model and initialise
	this.m_model = new GridModel(this);
	
	// Add a callback list which is notified when the grid data changes
	this.m_dataChangeListeners = new CallbackList();
	
	// Add a callback list which is notified when the grid is paged, either
	// through the scrollbar etc.
	this.m_positionChangeListeners = new CallbackList();

	// Add a callback list which is notified when the grid is paged, either
	// through the scrollbar etc.
	this.m_selectionChangeListeners = new CallbackList();
	
	this.m_scrollRowTimeout = null;
}

GridGUIAdaptor.m_logger = new Category("GridGUIAdaptor");

GridGUIAdaptor.SORT_ASC = "ascending";
GridGUIAdaptor.SORT_DESC = "descending";

/**
 * Static method which may be used to identify an instance
 * of a grid adaptor.
 *
*/
GridGUIAdaptor.isGridAdaptor = function( adaptor )
{
    var isGrid = false;
    if( (typeof adaptor == "object") && (adaptor.constructor == GridGUIAdaptor || adaptor.constructor == FilteredGridGUIAdaptor) )
    {
        isGrid = true;
    }
    return isGrid;
}

/**
 * GridGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
GridGUIAdaptor.prototype = new HTMLElementGUIAdaptor();


/**
 * Make sure that the parent class' protocols are set up correctly for this GUIAdaptor
 */
GUIAdaptor._setUpProtocols("GridGUIAdaptor");


/**
 * Add the required protocols to the GridGUIAdaptor
 */
GUIAdaptor._addProtocol('GridGUIAdaptor', 'DataBindingProtocol');			// Supports databinding for selected item
GUIAdaptor._addProtocol('GridGUIAdaptor', 'ListSrcDataProtocol');			// Supports databinding for selected item
GUIAdaptor._addProtocol('GridGUIAdaptor', 'RecordsProtocol');				// Supports form dirty
GUIAdaptor._addProtocol('GridGUIAdaptor', 'ValidationProtocol');			// Supports validation
GUIAdaptor._addProtocol('GridGUIAdaptor', 'EnablementProtocol');			// Supports enablement/disablement
GUIAdaptor._addProtocol('GridGUIAdaptor', 'ReadOnlyProtocol');			// Supports enablement/disablement
GUIAdaptor._addProtocol('GridGUIAdaptor', 'FocusProtocol');					// Supports tabbing and focussing
GUIAdaptor._addProtocol('GridGUIAdaptor', 'FocusProtocolHTMLImpl');			// Include the default HTML implementation of focus
GUIAdaptor._addProtocol('GridGUIAdaptor', 'HelpProtocol');					// Supports helptext
GUIAdaptor._addProtocol('GridGUIAdaptor', 'HelpProtocolHTMLImpl');			// Include the default HTML implementation of help
GUIAdaptor._addProtocol('GridGUIAdaptor', 'InitialiseProtocol');			// Supports custom initialisation
GUIAdaptor._addProtocol('GridGUIAdaptor', 'KeybindingProtocol');			// Supports keybinding
GUIAdaptor._addProtocol('GridGUIAdaptor', 'NameProtocol');					// Supports naming of the element
GUIAdaptor._addProtocol('GridGUIAdaptor', 'MouseWheelBindingProtocol');			// Supports mouse wheel scrolling


/**
 * Set the constructor property so we can identify the type
 */
GridGUIAdaptor.prototype.constructor = GridGUIAdaptor;

/**
 * Column definitions in the form of an array of Objects
 * with the following properties:
 *
 *   xpath              - the xpath relative to srcData +
 *                        rowXPath where to find the data 
 *                        for this column. Required.
 *   dataType           - The dataType of the column. Used
 *                        to determine how columns should be
 *                        sorted. Optional, if not specified
 *                        then the column defaults to
 *                        alphanumeric sorting.
 *   transformToDisplay - The function to transform the
 *                        model data to a form suitable
 *                        for display. The function takes
 *                        a single modelValue argument and
 *                        returns the displayValue. Optional,
 *                        if not specified then no transform
 *                        is applied.
 *
 * ToDo: complete this comment
 *
 * @type Array[Object{xpath:String, dataType:String, transformToDisplay:Function}
 * @configuration Required. Number of column definitions must equal the number
 *   of columns on the view.
 */
GridGUIAdaptor.prototype.columns = null;


/**
 * The grid renderer component.
 *
 * @type Grid
 */
GridGUIAdaptor.prototype.m_renderer = null;

/**
 * This is a debug method that returns lots of information from the model and the renderer.
 */
GridGUIAdaptor.prototype._getDebugInfo = function()
{
	GridGUIAdaptor.m_logger.info("GridGUIAdaptor._getDebugInfo() view info = " + this.m_view._getDebugInfo());
	GridGUIAdaptor.m_logger.info("GridGUIAdaptor._getDebugInfo() model info = " + this.m_model._getDebugInfo());
}

/**
 * Create the GridGUIAdaptor
 *
 * @param e the outermost div element of the grid to manage
 */
GridGUIAdaptor.create = function(e)
{
	var a = new GridGUIAdaptor();

	a._initialiseAdaptor(e);
	
	return a;
}

/**
 * Initialise the GridGUIAdaptor
 *
 * @param e the outermost div element of the grid to manage
 */
GridGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	if (GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace("GridGUIAdaptor._initialiseAdaptor");

	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	// Take a reference to the renderer (view)
	var renderer = this.m_renderer;
	
	this.setView(renderer);
	this.m_model.setView(renderer);
	
	renderer.setAdaptor(this);
	renderer.startEventHandlers();
	
	this.m_model.verticalScroll(new VerticalScrollbarRenderEvent(0));
	this.publishGridRenderEvent();
}

GridGUIAdaptor.prototype.setView = function(renderer)
{
	this.m_view = renderer;
}
GridGUIAdaptor.prototype.getView = function()
{
	return this.m_view;
}

/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
GridGUIAdaptor.prototype._configure = function(cs)
{
	var sortEvent = null;
	// Run through configuration specific to this element
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		if(c.columns && this.columns == null)
		{
			this.columns = c.columns;
		}
		if(c.rowRenderingRule && this.rowRenderingRule == null)
		{
		    this.rowRenderingRule = c.rowRenderingRule;
		}
		if(c.multipleSelection!=null) this.multipleSelection = c.multipleSelection;
		if(c.isSortable!=null) this.isSortable = c.isSortable;
		if(c.updateSrcDataWithDeltas!=null) this.updateSrcDataWithDeltas = c.updateSrcDataWithDeltas;
	}
	if(null != this.columns)
	{
		var sortDirection = null;
		var initialSortingColumn = 0;
		for(var j=0,l=this.columns.length; j<l; j++)
		{
			var col = this.columns[j];
			this.srcDataOn[this.srcDataOn.length] = XPathUtils.concatXPaths(this._getRowXPath(), col.xpath);
			if(this.isSortable && col.defaultSort && (col.defaultSort == "true"))
			{
				initialSortingColumn = j;
				if(col.defaultSortOrder)
				{
				    // RWW Sort is wrong way around. Use "false" for ascending sort!
					sortDirection = (col.defaultSortOrder == "ascending") ? false : true;
				}
			}
			// It is possible to define filter xpaths on the columns but not use the footer
			// row, i.e. the fields could be placed anywhere on the screen and not use the
			// grid's inbuilt filter fields
			if(col.filterXPath != null)
			{
				if(this.srcDataFilterOn == null)
				{
					this.srcDataFilterOn = new Array();
				}
				this.srcDataFilterOn[this.srcDataFilterOn.length] = col.filterXPath;
			}
		}
		sortEvent = new ColumnSortEvent(initialSortingColumn, sortDirection);
	}
	
	// pass configuration onto relevant parts of the MVC
	// ToDO: need to complete this for all config items
	this.m_model.setRowXPath(this._getRowXPath());
	this.m_model.setKeyXPath(this.keyXPath);
	this.m_model.setIsSortable(this.isSortable);
	// we need to set is sortable prior to setting the columns
	this.m_model.setColumns(this.columns);
	this.m_model.setDataBinding(this.dataBinding);
	this.m_model.setMultipleSelectionMode(this.multipleSelection);
	this.m_model.setRowRenderingRule(this.rowRenderingRule);
	if(this.multipleSelection == true)
	{
		if(this.retrieveOn == null) this.retrieveOn = new Array();
		this.retrieveOn[this.retrieveOn.length] = XPathUtils.concatXPaths(this.dataBinding, this.keyXPath);
	}
	
	// sort on default column 
	if(sortEvent != null)
	{
		this.m_model.setSelectedColumn(sortEvent.getColumnNumber());
		this.m_model.sortData(sortEvent);
	}
}

GridGUIAdaptor.prototype._dispose = function()
{
    // First clear any hanging scroll timeout
    if(this.m_scrollRowTimeout != null)
	{
		clearTimeout(this.m_scrollRowTimeout);
		this.m_scrollRowTimeout = null;
	}
	
	if(this.m_view != null)
	{
		this.m_view.dispose();
		this.m_view = null;
	}
	if(this.m_model != null)
	{
		this.m_model.dispose();
		this.m_model = null;
	}
	if(this.m_dataChangeListeners != null)
	{
		this.m_dataChangeListeners.dispose();
		this.m_dataChangeListeners = null;
	}
	if(this.m_positionChangeListeners != null)
	{
		this.m_positionChangeListeners.dispose();
		this.m_positionChangeListeners = null;
	}
	if(this.m_selectionChangeListeners != null)
	{
		this.m_selectionChangeListeners.dispose();
		this.m_selectionChangeListeners = null;
	}
	if(this.m_renderer != null)
	{
		this.m_renderer = null;
	}
	if(this.m_element != null)
	{
		this.m_element = null;
	}
}

GridGUIAdaptor.prototype.addSelectionChangeListener = function( cb )
{
    this.m_selectionChangeListeners.addCallback(cb);
}

GridGUIAdaptor.prototype.removeSelectionChangeListener = function(cb)
{
    this.m_selectionChangeListeners.removeCallback(cb);
}

GridGUIAdaptor.prototype.addDataChangeListener = function( cb )
{
    this.m_dataChangeListeners.addCallback(cb);
}

GridGUIAdaptor.prototype.removeDataChangeListener = function(cb)
{
    this.m_dataChangeListeners.removeCallback(cb);
}

GridGUIAdaptor.prototype.addPositionChangeListener = function( cb )
{
    this.m_positionChangeListeners.addCallback(cb);
}

GridGUIAdaptor.prototype.removePositionChangeListener = function(cb)
{
    this.m_positionChangeListeners.removeCallback(cb);
}

GridGUIAdaptor.prototype.getRowRange = function()
{
    return this.m_model.getRowRange();
}

GridGUIAdaptor.prototype.getCurrentSelectedRow = function()
{
    return this.m_model.getCurrentSelectedRow();
}

GridGUIAdaptor.prototype.getSelectedRows = function()
{
    return this.m_model.getSelectedRows();
}

GridGUIAdaptor.prototype.getMultipleSelection = function()
{
	return this.multipleSelection;
}

GridGUIAdaptor.prototype.getRowDisplayEvent = function()
{
	var selectedRow = this.getCurrentSelectedRow();
	var rowRange = this.getRowRange();
	var startRowNumber = parseInt(rowRange.startRowNumber)+1;
	var numberOfRowsInView = rowRange.numberOfRowsInView;
	var maxNumberOfRows = rowRange.maxNumberOfRows;
	if(parseInt(numberOfRowsInView) > parseInt(maxNumberOfRows))
	{
		numberOfRowsInView = maxNumberOfRows;
	}
	if(maxNumberOfRows == 0)
	{
		startRowNumber = 0;
	}
	return {selectedRow: selectedRow, startRowNumber: startRowNumber, numberOfRowsInView: numberOfRowsInView, maxNumberOfRows: maxNumberOfRows}
	
}

GridGUIAdaptor.prototype.retrieve = function(event)
{
	this.m_model.refreshDataBinding(event);

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);

	// return true to force a repaint for now
	return true;
}


GridGUIAdaptor.prototype.retrieveSrcData = function(event)
{
	GridGUIAdaptor.m_logger.info("GridGUIAdaptor.retrieveSrcData() data model event = " + event.toString());
	this.m_model.refreshSrcData(event);

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_dataChangeListeners.invoke(event);
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
    
    if(null == this.m_scrollRowTimeout)
    {
	    // Scroll any selected row into view. Done on a timeout to allow the scrollbar to complete
	    // it's rendering
	    var thisObj = this;
	    this.m_scrollRowTimeout = setTimeout(function() { thisObj.scrollSelectedRowIntoView(); }, 0);
	}
	
	// return true to force a repaint for now
	return true;
}

/**
 * For now we will force a refresh of the src data which will 
 * query the current values for any column filters and reload
 * the src data before filtering it. We will need to reload the
 * src data in most cases in case the new filter allows more
 * src data to be shown in the grid.
 */
GridGUIAdaptor.prototype.filterSrcData = function(event)
{
	this.m_model.filterSrcData(event);

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_dataChangeListeners.invoke(event);
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);

	// return true to force a repaint for now
	return true;
}

/**
 * This function is not relevant for grid's, and the inherited function could cause the grid
 * problems because it relies on _getValueFromView() method which doesn't exist on the grid.
 */
GridGUIAdaptor.prototype.update = function()
{
}

GridGUIAdaptor.prototype.handleSelectionChange = function(selectEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleSelectionChange()");
	this.m_model.selectRow(selectEvent);
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_selectionChangeListeners.invoke(event);
}

GridGUIAdaptor.prototype.handleVerticalScroll = function(scrollEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleVerticalScroll() scrollEvent = " + scrollEvent.toString());
	this.m_model.verticalScroll(scrollEvent);
	
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Method scrolls the row selected in the data binding into view.
 * If the grid is multiple selection then the row with the lowest
 * data row number is scrolled into view.
 */
GridGUIAdaptor.prototype.scrollSelectedRowIntoView = function()
{
    if(this.m_scrollRowTimeout != null)
	{
		this.m_scrollRowTimeout = null;
	}
	
	if(null != this.m_model)
	{
	    // Defect 1154. This should not really be necessary, but
	    // the application teams can be very inventive!
	
	    this.m_model.scrollSelectedRowIntoView();

	    this.renderState();
	
        // Invoke any registered listeners
        var event = this.getRowDisplayEvent();
        this.m_positionChangeListeners.invoke(event);
        this.m_selectionChangeListeners.invoke(event);
    }
    
}

/**
 * Method refreshes the submissibility state of each row that has been
 * previously selected
*/
GridGUIAdaptor.prototype.refreshKeyStates = function()
{
	// Multiple selection grids don't have key states
	if(!this.getMultipleSelection())
	{
		this.m_model.refreshKeyStates();
	}
}

/**
 * Change the elements focus state. Overrides the default behaviour defined
 * in the EnablementProtocol to generate a grid rendering event.
 *
 * @param f if true render the component as focussed, if false render the
 *   component as unfocussed.
 * @param wasClick Specifies whether focus was achieved by user clicking 
 *        on component (true) or moving onto component using tab key (false).
 *        To many components this value will not be of importance. However,
 *        in certain cases the TabSelectorGUIAdaptor has to implement
 *        different behaviours depending on how focus was achieved. This
 *        value is used only when focus is set not lost.
 * @return true if the GUI component's focus changed, or false otherwise
 * @type boolean
 */
GridGUIAdaptor.prototype.setFocus = function(f,wasClick)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("FocusProtocol.setFocus() adaptor " + this.getId() + ", focus = " + f);
	var r = false;
	if(f != this.m_focus)
	{
		this.m_focus = f;
		
		// Toggle focus change flag
		//this.m_focusChanged = !this.m_focusChanged;
		this.m_focusChanged = true;
		
		r = true;
		this.publishGridRenderEvent();
	}
	else
	{
		this.m_focusChanged = false;
	}
	return r;
}

/**
 * Override of  the default behaviour defined in the Enablement Protocol to
 * generate a grid rendering event and stop/start the view event handlers
 * when the grid changes its enablement state.
 *
 * @param e boolean true if enabled, false if disabled
 * @return true if the state of adaptor changed, otherwise false
 * @type boolean
 */
GridGUIAdaptor.prototype.setEnabled = function(e)
{
	var changed = EnablementProtocol.prototype.setEnabled.call(this, e);
	
	if(changed == true)
	{
		this.publishGridRenderEvent();
		
		if(e == true)
		{
			this.m_view.startEventHandlers();
		}
		else
		{
			this.m_view.stopEventHandlers();
		}
	}
	
	return changed;
}

/**
 * Override of  the default behaviour defined in the Enablement Protocol to
 * stop/start the view event handlers when the parent container changes
 * its enablement state.
 *
 * @param e boolean true if enabled, false if disabled
 * @return true if the state of adaptor changed, otherwise false
 * @type boolean
 */
GridGUIAdaptor.prototype.setContainerEnabled = function(e)
{
	var changed = EnablementProtocol.prototype.setContainerEnabled.call(this, e);
	
	if(changed == true)
	{
		if(e == true)
		{
			this.m_view.startEventHandlers();
		}
		else
		{
			this.m_view.stopEventHandlers();
		}
	}
	
	return changed;
}

/**
 * This is used to determine the aggregate state in conjunction with the valid state, and for the grid we are not 
 * concerned with whether or not the grid actually has a value because it can be associated with the grid's srcdata
 * rather that the value at the databinding.
 * This has been changed to check if the srcData has any rows because otherwise
 */
GridGUIAdaptor.prototype.hasValue = function()
{
	return (this.m_model.getRowRange().maxNumberOfRows > 0);
}

/**
 * Set whether or not the GUI Element should be rendered in the
 * valid state or not.
 *
 * @param v boolean that determines whether or not the element
 *   is rendered as valid or not.
 * @return true if the state of GUI Adaptor changed
 * @type boolean
 */
GridGUIAdaptor.prototype.setValid = function(v)
{
	var r = ValidationProtocol.prototype.setValid.call(this, v);
	this.publishGridRenderEvent();
	
	return r;
}

/**
 * Override the default behaviour to additionally inform the model that the grid state is valid/invalid
 */
GridGUIAdaptor.prototype.onServerValidationServerSuccess = function(dom)
{
	this.handleServerValidationSuccess(dom);
	
	// Publish event to render grid as valid/invalid
	this.publishGridRenderEvent();

	this.renderState();
}

/**
 * Override the default behaviour to additionally inform the model that the grid state is invalid
 */
GridGUIAdaptor.prototype.onServerValidationAbort = function()
{
	this.handleServerValidationAbort();
	
	// Publish event to render grid as invalid
	this.publishGridRenderEvent();

	this.renderState();
}

/**
 * Override of  the default behaviour defined in the Active Protocol to
 * generate a grid rendering event and stop/start the view event handlers
 * when the grid changes its active state.
 *
 * @param elementActive boolean true if active, false if inactive
 */
GridGUIAdaptor.prototype.setActive = function(elementActive)
{
	if(elementActive != this.m_active)
	{
		this.m_active = elementActive;
		this.publishGridRenderEvent();
		
		if(elementActive == true)
		{
			this.m_view.startEventHandlers();
		}
		else
		{
			this.m_view.stopEventHandlers();
		}
	}
}

/**
 * Override the default behaviour to additionally inform the model that the grid state has changed
 */
GridGUIAdaptor.prototype.invokeUpdateAdaptorState = function(event, refreshDisplay)
{
	//if(StateChangeEventProtocol.m_logger.isError()) StateChangeEventProtocol.m_logger.error("StateChangeEventProtocol.invokeUpdateAdaptorState() id = " + this.getId() + ", event = " + event.toString());
	var changed = false;
	var key = null;
	if(this.dataBinding) 
	{
		key = Services.getValue(this.dataBinding);
	}
	
	// if setting the state changes the aggregate state then bubble events upwards
	var state = this.getAggregateState();
	changed = state.setState(event, key);
	var e = StateChangeEvent.create(StateChangeEvent.CHILD_TYPE, this.isSubmissible(), this);
	this.bubbleStateChangeEventToParents(e, changed);
	if(changed == true)
	{
		this.handleStateChangeEvent(key, event);
	}
	if(refreshDisplay != null)
	{
		this.renderState();
	}
	if(SubmissibleState.m_logger.isTrace()) SubmissibleState.m_logger.trace("StateChangeEventProtocol.invokeUpdateAdaptorState() adaptorId=" + this.getId() + ", this.isSubmissible()=" + this.isSubmissible() + ", changed=" + changed);
	return changed;
}

/**
 *
 */
GridGUIAdaptor.prototype.receiveStateChangeEvent = function(event)
{
	//if(StateChangeEventProtocol.m_logger.isError()) StateChangeEventProtocol.m_logger.error("StateChangeEventProtocol.receiveStateChangeEvent() id = " + this.getId() + ", event = " + event.toString());
	var adaptorId = event.getAdaptor().getId();
	var key = null;
	if(this.dataBinding) 
	{
		key = Services.getValue(this.dataBinding);
	}
	
	// if setting the state changes the aggregate state then bubble events upwards
	var state = this.getAggregateState();
	if(state.setState(event, key))
	{
		//if(StateChangeEventProtocol.m_logger.isError()) StateChangeEventProtocol.m_logger.error("StateChangeEventProtocol.receiveStateChangeEvent() bubbling CHILD event to parents");
		var e = StateChangeEvent.create(StateChangeEvent.CHILD_TYPE, this.isSubmissible(), this);
		this.fireStateChangeEvent(e);
		this.handleStateChangeEvent(key, event);
		this.renderState();		
	}	
}

GridGUIAdaptor.prototype.handleStateChangeEvent = function(key, event)
{
	// update the overall grid aggregate state		
	this.publishGridRenderEvent();
	
	if(key != null)
	{
		// If the state affects an individual row then update the state of the row
		if(event.getType() == StateChangeEvent.CHILD_TYPE && this.multipleSelection == false)
		{
			var rowEvent = new RowAggregateStateChangeEvent(key, event.getState());
			this.publishRowAggregateStateChangeEvent(rowEvent);
		}
	}
}

/**
 * Override of  the default behaviour defined in the Read Only Protocol to
 * generate a grid rendering event and stop/start the row event handlers
 * when the grid changes its read only state.
 *
 * @param ro boolean true if read only, false if not
 * @return true if the state of adaptor changed, otherwise false
 * @type boolean
 */
GridGUIAdaptor.prototype.setReadOnly = function(ro)
{
	var changed = ReadOnlyProtocol.prototype.setReadOnly.call(this, ro);
	
	if(changed == true)
	{
		this.publishGridRenderEvent();
		
		if(ro == true)
		{
			this.m_view.stopRowEventHandlers();
		}
		else
		{
			this.m_view.startRowEventHandlers();
		}
	}
	
	return changed;
}

/**
 * Override of  the default behaviour defined in the Read Only Protocol to
 * stop/start the row event handlers when the parent container changes its
 * read only state.
 *
 * @param e boolean true if read only, false if not
 * @return true if the state of adaptor changed, otherwise false
 * @type boolean
 */
GridGUIAdaptor.prototype.setContainerReadOnly = function(ro)
{
	var changed = ReadOnlyProtocol.prototype.setContainerReadOnly.call(this, ro);
	
	if(changed == true)
	{
		if(ro == true)
		{
			this.m_view.stopRowEventHandlers();
		}
		else
		{
			this.m_view.startRowEventHandlers();
		}
	}
	
	return changed;
}

GridGUIAdaptor.prototype.publishRowAggregateStateChangeEvent = function(event)
{
	this.m_model.handleRowAggregateStateChangeEvent(event);
}

GridGUIAdaptor.prototype.publishGridRenderEvent = function()
{
	var event = new GridRenderEvent(this.getValid(), this.getServerValid(), this.m_enabled, this.m_readOnly, this.m_focus, this.m_active, this.isSubmissible(), this.isServerValidationActive());
	this.m_model.publishGridRenderEvent(event);
}

GridGUIAdaptor.prototype.publishColumnRenderEvent = function(column, sortDirection)
{
	var event = new ColumnSortEvent(column, sortDirection);
	this.m_model.publishColumnRenderEvent(event);
}

GridGUIAdaptor.prototype.renderState = function()
{
	this.m_model.processRenderEvents();
}


/**
 * Handle the up arrow key on the grid. This should
 * move the cursor up one row.
 */
GridGUIAdaptor.prototype._handleKeyUp = function()
{
	this.m_model._handleKeyUp();
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Handle the down arrow key on the grid. This should
 * move the cursor down one row.
 */
GridGUIAdaptor.prototype._handleKeyDown = function()
{	
	this.m_model._handleKeyDown();
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Handle the pageup key on the grid. This should
 * move the cursor up a whole page of rows.
 */
GridGUIAdaptor.prototype._handleKeyPageUp = function()
{
	this.m_model._handleKeyPageUp();
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Handle the pagedown key on the grid. This should
 * move the cursor down a whole page of rows.
 */
GridGUIAdaptor.prototype._handleKeyPageDown = function()
{
	this.m_model._handleKeyPageDown();
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Handle the space key on the grid. This should
 * select/unselect the row currently highlighted by
 * the cursor. This needs to follow the rules for the
 * current mode of the grid: ie single select will
 * unselect the previously selected row while multiselect
 * will simply toogle the selection state of the
 * highlighted row.
 */
GridGUIAdaptor.prototype._handleKeySpace = function()
{
	this.m_model._handleKeySpace();
	this.renderState();
}

/**
 * Handle the left arrow key on the grid. This should move the column selection
 * one column left. If the column selection is already at the leftmost column
 * then the selection wraps to the rightmost column.
 */
GridGUIAdaptor.prototype._handleKeyLeft = function()
{
	if(this.isSortable && this.m_view.getHeaderRow() != null)
	{
		this.m_model._handleKeyLeft();
		this.renderState();
		
	    // Invoke any registered listeners
	    var event = this.getRowDisplayEvent();
	    this.m_dataChangeListeners.invoke(event);
	    this.m_positionChangeListeners.invoke(event);
	    this.m_selectionChangeListeners.invoke(event);
    }
}

/**
 * Handle the right arrow key on the grid. This should move the column selection
 * one column right. If the column selection is already at the rightmost column
 * then the selection wraps to the leftmost column.
 */
GridGUIAdaptor.prototype._handleKeyRight = function()
{
	if(this.isSortable && this.m_view.getHeaderRow() != null)
	{
		this.m_model._handleKeyRight();
		this.renderState();
	
	    // Invoke any registered listeners
	    var event = this.getRowDisplayEvent();
	    this.m_dataChangeListeners.invoke(event);
	    this.m_positionChangeListeners.invoke(event);
	    this.m_selectionChangeListeners.invoke(event);
	}
}

/**
 * Handle the shift plus up arrow key combination on the grid. This sorts
 * the selected column in descending order.
 */
GridGUIAdaptor.prototype._handleKeyShiftUp = function()
{
	if(this.isSortable && this.m_view.getHeaderRow() != null)
	{
		if(this.m_model._handleKeyShiftUp())
		{
			this.renderState();
		
		    // Invoke any registered listeners
		    var event = this.getRowDisplayEvent();
		    this.m_dataChangeListeners.invoke(event);
		    this.m_positionChangeListeners.invoke(event);
		    this.m_selectionChangeListeners.invoke(event);
	    }
	}
}

/**
 * Handle the shift plus down arrow key combination on the grid. This sorts
 * the selected column in ascending order.
 */
GridGUIAdaptor.prototype._handleKeyShiftDown = function()
{
	if(this.isSortable && this.m_view.getHeaderRow() != null)
	{
		if(this.m_model._handleKeyShiftDown())
		{
			this.renderState();
		
		    // Invoke any registered listeners
		    var event = this.getRowDisplayEvent();
		    this.m_dataChangeListeners.invoke(event);
		    this.m_positionChangeListeners.invoke(event);
		    this.m_selectionChangeListeners.invoke(event);
	    }
	}
}

/**
 * Define the keybindings for manual navigation of the grid. All of the handlers
 * for the grid delegate to the model handlers, the only reason they are here is
 * because the protocol only allows them to be defined on the adaptor.
 */
GridGUIAdaptor.prototype.keyBindings = 
[
	{key: Key.ArrowUp, action: GridGUIAdaptor.prototype._handleKeyUp},
	{key: Key.ArrowDown, action: GridGUIAdaptor.prototype._handleKeyDown},
	{key: Key.PageUp, action: GridGUIAdaptor.prototype._handleKeyPageUp},
	{key: Key.PageDown, action: GridGUIAdaptor.prototype._handleKeyPageDown},
	{key: Key.Space, action: GridGUIAdaptor.prototype._handleKeySpace},
	{key: Key.ArrowLeft, action: GridGUIAdaptor.prototype._handleKeyLeft},
	{key: Key.ArrowRight, action: GridGUIAdaptor.prototype._handleKeyRight},
	{key: Key.ArrowUp, action: GridGUIAdaptor.prototype._handleKeyShiftUp, shift: true},
	{key: Key.ArrowDown, action: GridGUIAdaptor.prototype._handleKeyShiftDown, shift: true}
];


GridGUIAdaptor.prototype.handleColumnHeaderClick = function(sortEvent)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("GridGUIAdaptor.handleColumnHeaderClick()");

	// Publish an event to render the current column as not selected
	this.publishColumnRenderEvent(this.m_model.getSelectedColumn(), null);

	// Set the column clicked on as the selected column
	this.m_model.setSelectedColumn(sortEvent.getColumnNumber());
	
	this.m_model.sortData(sortEvent);
	this.renderState();

    // Invoke any registered listeners
    var event = this.getRowDisplayEvent();
    this.m_dataChangeListeners.invoke(event);
    this.m_positionChangeListeners.invoke(event);
    this.m_selectionChangeListeners.invoke(event);
}

/**
 * Method allows another class to add a function to the list
 * of onDblclick listeners within the grid adaptor's associated
 * grid component. This should allow the adaptor to be used to
 * configure the behaviour of the grid following a double
 * click on a row.
 *
 * @param cb Function to be added to double click function call back list.
 *
*/
GridGUIAdaptor.prototype.addDblclickListener = function(cb)
{
    this.m_view.addDblclickListener(cb);
}

/**
 * Method allows another class to remove a function from the
 * list of onDblclick listeners within the grid adaptor's
 * associated grid component.
 *
 */
GridGUIAdaptor.prototype.removeDblclickListener = function(cb)
{
 	if(this.m_view != null)
 	{
    	this.m_view.removeDblclickListener(cb);
    }
 }

 /**
 * Method called when the mouse wheel is 'rotated' that triggers scrolling of the data up or down.
 */
GridGUIAdaptor.prototype.handleScrollMouse = function(evt)
{
	if(GridGUIAdaptor.m_logger.isTrace()) GridGUIAdaptor.m_logger.trace("GridGUIAdaptor.handleScrollMouse() evt.wheelDelta = " + evt.wheelDelta);
	if(evt.wheelDelta > 0)
	{
		this._handleKeyUp();
	}
	else
	{
		this._handleKeyDown();
	}
}

GridGUIAdaptor.prototype.setCursorRow = function(cursorRowNumber)
{
	this.m_model.setCursorRow(cursorRowNumber); 
	this._handleKeyDown();
	this._handleKeyUp();
}

/**
 * Override of StateChangeEventProtocol method. This is required so that we
 * can control if the grid valid state is checked in the submissibility.
 * Differs in that it has two arguments.
 *
 * @param key - grid row key
 * @param checkValid - grid valid state check. If true then valid state is
 * checked otherwise it is ignored
 */
GridGUIAdaptor.prototype.isSubmissible = function(key, checkValid)
{
	return this.getAggregateState().isSubmissible(key, checkValid);
}

/**
 * Override of StateChangeEventProtocol method. This is required so that
 * SubmissibleState methods can be overridden. Differs in that it creates
 * a class of GridSubmissibleState rather than SubmissibleState.
 */
GridGUIAdaptor.prototype.getAggregateState = function()
{
	if(this.m_aggregateState == null) this.m_aggregateState = GridSubmissibleState.create(this);
	return this.m_aggregateState;
}

/**
 * Create a sub class of SubmissibleState so that methods can be overridden
 */
function GridSubmissibleState(adaptor)
{
	SubmissibleState.prototype.constructor.call(this, adaptor);
}

/**
 * GridSubmissibleState is a sub class of SubmissibleState
 */
GridSubmissibleState.prototype = new SubmissibleState();
GridSubmissibleState.prototype.constructor = GridSubmissibleState;


GridSubmissibleState.create = function(adaptor)
{
	var state = new GridSubmissibleState(adaptor);
	return state;
}

/**
 * Override of SubmissibleState method. This is required to prevent the
 * submissable state being overridden by the valid state.
 *
 * @param stateChangeEvent - type of state change event
 * @param key - grid row key
 */
GridSubmissibleState.prototype.setState = function(stateChangeEvent, key)
{
	var changed = false;

	this.m_key = key;

	// Get the current state information for this grid
	var originalAggregateState = this.isSubmissible(key, false);
	var originalValidState = this.m_valid;
	
	// Get the latest state information for this grid
	this.getAdaptorState();

	switch(stateChangeEvent.getType())
	{
		case StateChangeEvent.SRCDATA_TYPE:
			// If source data has changed then this will return true so
			// aggregate state won't be checked
			changed = this.handleSrcDataEvent();
			break;
		case StateChangeEvent.CHILD_TYPE:
			this.handleChildEvent(stateChangeEvent, key);
			break;
		case StateChangeEvent.PARENT_TYPE:
			// If parent state has changed, form changing state to read only
			// for example, then this will return true. In this case we want
			// to force a repaint so aggregate state won't be checked
			changed = this.handleParentEvent(stateChangeEvent, key);
			break;
		case StateChangeEvent.REMOVED_ADAPTOR_TYPE:
			// If a row(s) has been deleted then this will return true so
			// aggregate state won't be checked
			changed = this.handleRemovedAdaptorEvent(stateChangeEvent);
			break;
		default:
			break;
	}

	if(changed == false)
	{
		// Aggregate state change check required
		var newAggregateState = this.isSubmissible(key, false);
		var newValidState = this.m_valid;
		
		changed = (originalAggregateState != newAggregateState);
		
		// Don't allow submissability change to be overridden by validity change
		if(changed == false) changed = (originalValidState != newValidState);
	}
	
	return(changed);
}

/**
 * Modified version of the SubmissibleState method. Differs in that:
 *
 * 1) It does not check mandatory state. Mandatory is not checked because
 *    grids don't support the Mandatory protocol.
 * 2) Validity is only checked when the form is validated and when a state
 *    change event is bubbled up to the parent. In setState the validity
 *    state would incorrectly override the submissable state of the grid.
 *
 * @param key - grid row key
 * @param checkValid - grid valid state check. If true then valid state is
 * checked otherwise it is ignored
 */
GridSubmissibleState.prototype.isSubmissible = function(key, checkValid)
{
	var result = true;
	
	// Default flag to true if not defined
	checkValid = (null == checkValid) ? true : checkValid;
	
	if(!this.m_enabled || this.m_temporary)
	{
		// If disabled or temporary then the field is submissible regardless of
		// other states
	}
	else
	{
		if(key != null)
		{
			result = this.isKeySubmissible(key);
		}
		else
		{
			result = this.areChildrenSubmissible();
		}
		
		if(result == true && checkValid == true)
		{
			if(this.m_adaptor.hasValue())
			{
				if(this.m_valid == false)
				{
					result = false;
				}
			}
		}
	}
	
	return result;
}

