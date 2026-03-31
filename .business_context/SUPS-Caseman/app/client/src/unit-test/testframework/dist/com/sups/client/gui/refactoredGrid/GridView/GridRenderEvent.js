/**
 * GridRenderEvent encapsulates an event regarding the re-rendering of the entire grid and therefore
 * only contains 'global' grid information, i.e. enablement and focus. Grid events are only held in a 
 * single event on the grid model, and are overwritten if a new grid event arrives prior to a model
 * publishing the event to the view.
 */
function GridRenderEvent(valid, serverValid, enabled, readOnly, hasFocus, active, isSubmissible, isServerValidationActive)
{
	this.m_valid = valid;
	// Defect 766. Presumably m_serverValid should be set
	// to the value of the input argument "serverValid" and not "valid".
	this.m_serverValid = serverValid;
	this.m_enabled = enabled;
	this.m_readOnly = readOnly;
	this.m_hasFocus = hasFocus;
	this.m_active = active;
	this.m_isSubmissible = isSubmissible;
	this.m_isServerValidationActive = isServerValidationActive;
}

GridRenderEvent.prototype.toString = function()
{
	var msg = "[GridRenderEvent object: valid=" + this.m_valid + ", serverValid=" + this.m_serverValid + ", enabled=" + this.m_enabled + ", readOnly=" + this.m_readOnly + ", hasFocus=" + this.m_hasFocus + ", active=" + this.m_active + ", isSubmissible=" + this.m_isSubmissible + ", isServerValidationActive=" + this.m_isServerValidationActive + "]";
	return msg;
}

GridRenderEvent.prototype.getValid = function()
{
	return this.m_valid;
}

GridRenderEvent.prototype.getServerValid = function()
{
	return this.m_serverValid;
}

GridRenderEvent.prototype.getEnabled = function()
{
	return this.m_enabled;
}

GridRenderEvent.prototype.getReadOnly = function()
{
	return this.m_readOnly;
}

GridRenderEvent.prototype.getHasFocus = function()
{
	return this.m_hasFocus;
}

GridRenderEvent.prototype.getActive = function()
{
	return this.m_active;
}

GridRenderEvent.prototype.getIsSubmissible = function()
{
	return this.m_isSubmissible;
}

GridRenderEvent.prototype.getIsServerValidationActive = function()
{
	return this.m_isServerValidationActive;
}

function RowAggregateStateChangeEvent(rowKey, isSubmissible)
{
	this.m_key = rowKey;
	this.m_isSubmissible = isSubmissible;
}

RowAggregateStateChangeEvent.prototype.toString = function()
{
	var msg = "[RowAggregateStateChangeEvent object: key=" + this.m_key + ", isSubmissible=" + this.m_isSubmissible + "]";
	return msg;
}

RowAggregateStateChangeEvent.prototype.getKey = function()
{
	return this.m_key;
}

RowAggregateStateChangeEvent.prototype.getIsSubmissible = function()
{
	return this.m_isSubmissible;
}

/**
 * VerticalScrollbarRenderEvent encapsulates an event regarding the re-rendering of the the
 * vertical scrollbar and contains information about the position and the scale required for
 * rendering. The event is overwritten rather than queued because new events override old information.
 */
function VerticalScrollbarRenderEvent(position, scale)
{
	this.m_position = position;
	this.m_scale = scale;
}

VerticalScrollbarRenderEvent.prototype.equals = function(event)
{
	if(this.m_position == event.getPosition() && this.m_scale == event.getScale())
		return true;
	else
		return false;
}

VerticalScrollbarRenderEvent.prototype.toString = function()
{
	var msg = "[VerticalScrollbarRenderEvent object: position=" + this.m_position + ", scale=" + this.m_scale + "]";
	return msg;
}

VerticalScrollbarRenderEvent.prototype.getPosition = function()
{
	return this.m_position;
}

VerticalScrollbarRenderEvent.prototype.getScale = function()
{
	return this.m_scale;
}

/**
 * RowRenderEvent encapsulates an event regarding the re-rendering of a row. The event only contains
 * the information necessary to determine the row, the Grid view can then request the relevant 
 * information from the model. This allows for easy removal of duplicate render events in the model.
 * The view row number is only set just before the event is sent to the view.
 */
function RowRenderEvent(dataRowNumber, key, debug)
{
	this.m_dataRowNumber = dataRowNumber;
	this.m_key = key;
	this.m_viewRowNumber = null;
	this.m_debug = debug;
}

RowRenderEvent.prototype.toString = function()
{
	var msg = "[RowRenderEvent object: dataRowNumber=" + this.m_dataRowNumber + ", key=" + this.m_key + ", viewRowNumber=" + this.m_viewRowNumber + ", debug=" + this.m_debug + "]";
	return msg;
}

RowRenderEvent.prototype.getDataRowNumber = function()
{
	return this.m_dataRowNumber;
}

RowRenderEvent.prototype.setViewRowNumber = function(viewRowNumber)
{
	this.m_viewRowNumber = viewRowNumber;
}
RowRenderEvent.prototype.getViewRowNumber = function()
{
	return this.m_viewRowNumber;
}

RowRenderEvent.prototype.getKey = function()
{
	return this.m_key;
}

/**
 * RowSelectionEvent encapsulates an event regarding the selection of a row in the view.
 */
function RowSelectionEvent(viewRowNumber)
{
	this.m_viewRowNumber = viewRowNumber;
}

RowSelectionEvent.prototype.toString = function()
{
	var msg = "[RowSelectionEvent object: viewRowNumber=" + this.m_viewRowNumber + "]";
	return msg;
}

RowSelectionEvent.prototype.getViewRowNumber = function()
{
	return this.m_viewRowNumber;
}

/**
 * ColumnSortEvent encapsulates an event regarding the sorting of the data based on a column
 */ 
function ColumnSortEvent(columnNumber, sortDirection)
{
	this.m_columnNumber = columnNumber;
	this.m_sortDirection = sortDirection;
}

ColumnSortEvent.prototype.toString = function()
{
	var msg = "[ColumnSortEvent object: columnNumber=" + this.m_columnNumber + ", sortDirection=" + this.m_sortDirection + "]";
	return msg;
}

ColumnSortEvent.prototype.getColumnNumber = function()
{
	return this.m_columnNumber;
}

ColumnSortEvent.prototype.getSortDirection = function()
{
	return this.m_sortDirection;
}

