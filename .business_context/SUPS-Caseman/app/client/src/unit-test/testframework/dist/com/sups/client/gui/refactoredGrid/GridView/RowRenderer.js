function RowRenderer(element, numberOfColumns, grid, viewRowNumber, groupSize)
{
	this.m_element = element;
	this.m_numberOfColumns = numberOfColumns;
	this.m_cells = new Array(numberOfColumns);
	this.m_viewRowNumber = viewRowNumber;
	this.m_grid = grid;
	this.m_groupSize = groupSize;
	this.m_dataRowNumber = null;

	this.m_clickEventHandler = null;
	this.m_dblclickEventHandler = null;
}

RowRenderer.prototype.toString = function()
{
	return "[Row: viewRowNumber:" + this.m_viewRowNumber + ", this.m_element.className:" + this.m_element.className + "]";
}

RowRenderer.prototype.startEventHandlers = function()
{
	var r = this;
	if(null == this.m_clickEventHandler)
	{
		r.m_clickEventHandler = SUPSEvent.addEventHandler(this.m_element, "click", function(evt) { r._handleClick(evt); }, null);
	}
	if(null == this.m_dblclickEventHandler)
	{
		r.m_dblclickEventHandler = SUPSEvent.addEventHandler(this.m_element, "dblclick", function(evt) { r._handleDblclick(evt); }, null);
	}
}

RowRenderer.prototype.dispose = function()
{
	for(var i=0, l=this.m_cells.length; i<l; i++)
	{
		var cell = this.m_cells[i];
		cell.dispose();
		cell = null;
	}
	this.m_element = null;
	this.m_grid = null;
	this.m_dataRowNumber = null;

	this.stopEventHandlers();
	this.m_clickEventHandler = null;
	this.m_dblclickEventHandler = null;
}

RowRenderer.prototype.stopEventHandlers = function()
{
	if(null != this.m_clickEventHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_clickEventHandler);
		this.m_clickEventHandler = null;
	}
	
	if(null != this.m_dblclickEventHandler)
	{
	    SUPSEvent.removeEventHandlerKey(this.m_dblclickEventHandler);
	    this.m_dblclickEventHandler = null;
	}
}


RowRenderer.prototype.addCell = function(cell, columnNumber)
{
	this.m_cells[columnNumber] = cell;
}


RowRenderer.prototype.getCell = function(columnNumber)
{
	return this.m_cells[columnNumber];
}


RowRenderer.prototype._handleClick = function(evt)
{
    if(Grid.isIE)
    {
        this.m_grid._handleRowSelect(this);
    }
    else if(Grid.isMoz)
    {
        if(evt.detail == 1)
        {
            // Only invoke selection handler on first click
            // of double click
            this.m_grid._handleRowSelect(this);
        }
    }
}

RowRenderer.prototype._handleDblclick = function(evt)
{
    this.m_grid._handleRowDblclick(this);
}

RowRenderer.prototype.setDataRowNumber = function(no)
{
	this.m_dataRowNumber = no;
}

RowRenderer.prototype.getDataRowNumber = function()
{
    return this.m_dataRowNumber;
}

RowRenderer.prototype.getViewRowNumber = function()
{
	return this.m_viewRowNumber;
}

/** 
 * render function to take a row from the model and render it into the view
 */
RowRenderer.prototype.render = function(dataRowNumber, modelRow)
{
	this.m_dataRowNumber = dataRowNumber;
	this.applyRowStyling(modelRow);
	this.setCellData(modelRow);
}

/**
 * Method applies styling classes to a row
*/
RowRenderer.prototype.applyRowStyling = function(modelRow)
{
	var cN = "grid_row ";
	// It is valid to have a null row in the view, in the case where there are less
	// rows of data than visible rows, and render can get triggered when a row is removed,
	// and the render needs to clear down the existing data.
	if(modelRow != null)
	{
		var isHigh = (this.m_dataRowNumber % (this.m_groupSize * 2)) >= this.m_groupSize;
		var key = modelRow.getKey();
	    var submissible = modelRow.getSubmissible();
	    var selected = modelRow.getSelected();
	    var cursor = modelRow.getCursor();
	    var additionalStylingClasses = modelRow.getAdditionalStylingClasses();
	
		// See if we need to render the cursor
		if(cursor==true && this.m_grid.getHasFocus())
		{
			cN += "cursor ";
		}
		if(!submissible) 
		{
			if(true == selected) {
				if(cursor==true && this.m_grid.getHasFocus())
				{
					cN += "selected_and_cursor_and_not_submissible ";
				}
				else
				{
					cN += "selected_and_not_submissible ";
				}
			} else {
				cN += "grid_row_not_submissible " + (isHigh ? "hi" : "lo");
			}
		}
		else
		{
			if(true == selected) {
				if(cursor==true && this.m_grid.getHasFocus())
				{
					cN += "selected_and_cursor ";
				}
				else
				{
					cN += "selected";
				}
			} else {
				cN += (isHigh ? "hi" : "lo");
			}
		}
		
	    if(additionalStylingClasses != null && additionalStylingClasses != Grid.BLANK)
	    {
	        // Append additional classes to current classes
	        cN += " " + additionalStylingClasses;
	    }
	}
	else
	{
		// If the row has no data then hide it
		cN += "hidden ";
	}
	// set styles onto row element	
	this.m_element.className = cN;

	//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("RowRenderer.applyRowStyling(" + this.m_viewRowNumber + ") className = " + cN);
}

RowRenderer.prototype.setCellData = function(modelRow)
{
	if(modelRow != null)
	{
		var rowData = modelRow.getCellData();
		for(var j = 0, l = rowData.length; j < l; j++)
		{
			var cell = this.getCell(j);
	
			// IE throws a runtime exception if you try to do
			// the obvious thing as shown below
			//	cell.m_element.innerHTML = rowData[j];
			// So we have to do the complex thing shown below...
			var cE = cell.m_element;
			var cN = cE.childNodes;
			for(var k = cN.length - 1; k >= 0; k--)
			{
				cE.removeChild(cN[k]);
			}
			var content = rowData[j];
			if(null == content || "" == content)
			{
			// \u00a0 is unicode for &nbsp; - can't use &nbsp; here as createTextNode escapes the &
				content = "\u00a0";
			}
			var tn = document.createTextNode(rowData[j]);
			cE.appendChild(tn);
		}
		//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("RowRenderer.setCellData(" + this.m_viewRowNumber + ") rowData = " + rowData.join());
	}
	else
	{
		// clear down the row of any cell data
		for(var i=0;i<this.m_numberOfColumns;i++)
		{
			var cell = this.getCell(i);
			var cE = cell.m_element;
			var cN = cE.childNodes;
			for(var k = cN.length - 1; k >= 0; k--)
			{
				cE.removeChild(cN[k]);
			}
			// \u00a0 is unicode for &nbsp; - can't use &nbsp; here as createTextNode escapes the &
			var tn = document.createTextNode("\u00a0");
			cE.appendChild(tn);
		}
		//if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug("RowRenderer.setCellData(" + this.m_viewRowNumber + ") rowData is null");
	}
}




