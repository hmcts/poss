// This file contains several utility / inenr classes used by the GridModel. They have been
// placed into their own file to help reduce the clutter in GridModel.

/**
 * event queue to hold row render events before processing them and dispatching to 
 * the view (GridRenderer)
 */
function RenderEventQueue()
{
	this.m_queue = new Array()
}

RenderEventQueue.prototype.addEvent = function(event)
{
	this.m_queue[this.m_queue.length] = event;
}

RenderEventQueue.prototype.getEvents = function()
{
	return this.m_queue;
	
}

RenderEventQueue.prototype.clear = function()
{
	this.m_queue.length = 0;
}

/**
 * Class ColumnSortConfiguration
 *
 * Instances of this class store the information required to
 * sort the grid by a column.
 *
*/

function ColumnSortConfiguration() {};

/**
 * m_columnNumber - The column used to sort the grid
 *
*/

ColumnSortConfiguration.prototype.m_columnNumber = null;

/**
 * m_comparator - the function used to compare column values during the sort
 *
*/

ColumnSortConfiguration.prototype.m_comparator = null;

/**
 * m_sortAsc - Boolean value specifying order of sort
 *
*/

ColumnSortConfiguration.prototype.m_sortAsc;
