function ColumnHeader(model, columnNumber, xpath, sortComparator, defaultSort, additionalSortColumns, transformToDisplay, filterXPath, filterMode)
{
	this.m_sortComparator = null;
	this.m_model = model;
	this.m_columnNumber = columnNumber;
	this.m_xpath = xpath;
	this.m_sortComparator = sortComparator;
	this.m_defaultSort = defaultSort;
	this.m_additionalSortColumns = additionalSortColumns;
	this.m_transformToDisplay = transformToDisplay;
	this.m_filterXPath = filterXPath;
	if(filterMode == null)
	{
		this.m_filterMode = "caseInsensitive";
	}
	else
	{
		this.m_filterMode = filterMode;
	}
}

ColumnHeader.create = function(model, columnNumber, column)
{
	return new ColumnHeader(model, columnNumber, column.xpath, column.sort, column.defaultSort, column.additionalSortColumns, column.transformToDisplay, column.filterXPath, column.filterMode);
}

ColumnHeader.defaultColumnTransform = function(mV)
{
	return (null == mV ? "" : mV);
}

ColumnHeader.prototype.getColumnNumber = function()
{
	return this.m_columnNumber;
}

ColumnHeader.prototype.getXPath = function()
{
	return this.m_xpath;
}

ColumnHeader.prototype.getSortComparator = function()
{
	return this.m_sortComparator;
}

ColumnHeader.prototype.getSortDirection = function()
{
	return this.m_sortDirection;
}

ColumnHeader.prototype.setSortDirection = function(sortDirection)
{
	this.m_sortDirection = sortDirection; 
	var headerIcon = null;
	
	// Sort direction is a boolean (or null) whereas a column header can be
	// rendered with no icon, sort ascending icon, sort descending icon or
	// not sorted icon
	if(true == sortDirection)
	{
		headerIcon = ColumnRenderer.SORT_ASC;
	}
	else if(false == sortDirection)
	{
		headerIcon = ColumnRenderer.SORT_DSC;
	}
	
	// publish a column rendering event so we can render the sorting direction icon
	var event = new ColumnSortEvent(this.m_columnNumber, headerIcon);
	this.m_model.publishColumnRenderEvent(event);
}

ColumnHeader.prototype.getDefaultSort = function()
{
	return this.m_defaultSort;
}

ColumnHeader.prototype.getAdditionalSortColumns = function()
{
	return this.m_additionalSortColumns;
}

ColumnHeader.prototype.getTransformToDisplay = function()
{
	return this.m_transformToDisplay;
}

ColumnHeader.prototype.getFilterXPath = function()
{
	return this.m_filterXPath;
}

ColumnHeader.prototype.getFilterMode = function()
{
	return this.m_filterMode;
}
