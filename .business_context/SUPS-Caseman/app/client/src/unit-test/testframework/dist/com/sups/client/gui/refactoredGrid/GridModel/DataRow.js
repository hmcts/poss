/**
 * simple data transfer object to convert the model's internal format
 */
 
function DataRow(key, selected, cursor, submissible, cellData)
{
	this.m_key = key;
	this.m_selected = selected;
	this.m_cursor = cursor;
	this.m_submissible = submissible;
	this.m_additionalStylingClasses = null;
	this.m_cellData = cellData.slice(0);
}

DataRow.create = function(row)
{
	var newRow = new DataRow(row.key, row.selected, row.cursor, row.submissible, row.slice(0));
	return newRow;
}

DataRow.prototype.toString = function()
{
	var msg = "[Row object: rowNumber=" + this.m_rowNumber + ", key=" + this.m_key + ", selected=" + this.m_selected + ", cursor=" + this.m_cursor;
	msg += ", submissible=" + this.m_submissible + ", additionalStylingClasses=" + this.m_additionalStylingClasses + "]";
	return msg;
}

DataRow.prototype.getKey = function()
{
	return this.m_key;
}

DataRow.prototype.getCursor = function()
{
	return this.m_cursor;
}

DataRow.prototype.getSelected = function()
{
	return this.m_selected;
}

DataRow.prototype.getSubmissible = function()
{
	return this.m_submissible;
}

DataRow.prototype.getAdditionalStylingClasses = function()
{
	return this.m_additionalStylingClasses;
}
DataRow.prototype.setAdditionalStylingClasses = function(additionalStylingClasses)
{
	this.m_additionalStylingClasses = additionalStylingClasses;
}

DataRow.prototype.getCellData = function()
{
	return this.m_cellData;
}
