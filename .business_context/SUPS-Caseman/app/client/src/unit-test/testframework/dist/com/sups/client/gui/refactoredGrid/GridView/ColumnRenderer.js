function ColumnRenderer(grid, number, title)
{
	this.m_grid = grid;
	this.m_number = number;
	this.m_sortingEnabled = true;
	
	if(this.m_grid.m_headerRow != null)
	{
	    // Add header cell with column title
	    var e = document.createElement("span");
	    e.innerHTML = title;
	    grid.m_headerRow.appendChild(e);
	    this.m_headerElement = e;
	}
	this.render();
}

ColumnRenderer.prototype.dispose = function()
{
	this.stopEventHandlers();
	this.m_headerElement = null;
	this.m_grid = null;
}

ColumnRenderer.prototype.setSortEnabled = function(enabled)
{
	this.m_sortingEnabled = enabled;
}

ColumnRenderer.prototype.startEventHandlers = function()
{
    if(this.m_headerElement != null )
    {
	    var c = this;
		this.m_clickHandler = SUPSEvent.addEventHandler(this.m_headerElement, 'click', function() { c._handleHeaderClick(); });
    }
}

ColumnRenderer.prototype.stopEventHandlers = function()
{
    if(this.m_clickHandler != null)
    {
		SUPSEvent.removeEventHandlerKey(this.m_clickHandler);
	    this.m_clickHandler = null;
   }
}

/*
 * Column sorted states
 */
ColumnRenderer.SORT_NONE = 2;
ColumnRenderer.SORT_ASC = 3;
ColumnRenderer.SORT_DSC = 4;

ColumnRenderer.prototype.render = function(sortDirection)
{
    if(this.m_headerElement != null)
    {
	    var cN = "grid_header_cell col" + this.m_number;
	    if(sortDirection != null && this.m_sortingEnabled == true)
	    {
		    if(ColumnRenderer.SORT_ASC == sortDirection)
		    {
		    	cN += " sort_asc";
		    }
		    else if(ColumnRenderer.SORT_DSC == sortDirection)
		    {
		    	cN += " sort_dsc";
		    }
		    else
		    {
		    	cN += " sort_none";
		    }
	    }
	    this.m_headerElement.className = cN;
	}
}

/*
 * The column header has been clicked, this needs to be translated to a sort column event
 * in the GridGUIAdaptor, and passed up to the model, where the data will be re-sorted and
 * rendering events fired to the view
 */
ColumnRenderer.prototype._handleHeaderClick = function(e)
{
	if(null == e) e = window.event;
	
	this.m_grid._handleColumnHeaderClick(this.m_number);
}

