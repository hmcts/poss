function CellRenderer(element)
{
	this.m_element = element;
}

CellRenderer.prototype.dispose = function()
{
	this.m_element = null;
}
