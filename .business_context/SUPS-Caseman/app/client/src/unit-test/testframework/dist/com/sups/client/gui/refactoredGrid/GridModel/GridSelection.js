/**
 * Interface / ABC for data loading strategies, defines the common methods for the interface and contains some
 * common utilities used by each strategy
 *
 * ToDo: test the defaulting behaviour for single selection grids
 *		 test the removal of rows from src data impact on selected keys
 *
 */
function GridSelectionStrategy(model)
{
}

// called when the retrieve method is invoked, i.e. the value in the DOM for the dataBinding has changed
GridSelectionStrategy.refreshSelectionsFromDataBinding = function()
{
}

// Called when the user clicks on a row - delegates to the inverse selection function that is 
// specific to the strategy
GridSelectionStrategy.selectRow = function(dataRowNumber, forceUpdate)
{
}

// Called to reset the row states after a src data change
GridSelectionStrategy.resetRowStatesAfterSrcDataRefresh = function()
{
}

// Reset the selected data row after sorting
/*GridSelectionStrategy.resetSelectedDataRowNumbers = function()
{
}*/

GridSelectionStrategy.prototype.setKeyValue = function(dV)
{
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Factory method to construct the appropriate grid selection strategy
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
GridSelectionStrategy.createGridSelectionStrategy = function(model, multipleSelection)
{
	if(multipleSelection == false)
	{
		return new GridSingleSelectionStrategy(model);
	}
	else
	{
		return new GridMultipleSelectionStrategy(model);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Common utility functions used by all strategies
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
GridSelectionStrategy.prototype.getKeyFromDataRowNumber = function(dataRowNumber)
{
	var key = null;
	var data = this.m_model.m_data;
	var dataRow = data[dataRowNumber];
	if(dataRow != null)
	{
		key = dataRow.key;
	}
	return key;
}

GridSelectionStrategy.prototype.removeSelectionFromRowByKey = function(key)
{
	var dataRowNumber = this.m_model.getDataRowNumberByKey(key);
	if(dataRowNumber != null)
	{
		var data = this.m_model.m_data;
		var dataRow = data[dataRowNumber];
		if(dataRow != null)
		{
			dataRow.selected = false;
			var event = new RowRenderEvent(dataRowNumber, key, "removeSelectionFromRowByKey");
			this.m_model.publishRowRenderEvent(event);
		}
	}
}

GridSelectionStrategy.prototype.addSelectionToRowByKey = function(key)
{
	var dataRowNumber = this.m_model.getDataRowNumberByKey(key);
	if(dataRowNumber != null)
	{
		var data = this.m_model.m_data;
		var dataRow = data[dataRowNumber];
		if(dataRow != null)
		{
			dataRow.selected = true;
			var event = new RowRenderEvent(dataRowNumber, key, "addSelectionToRowByKey");
			this.m_model.publishRowRenderEvent(event);
			// This is used when attempting to reset row states after src data changes in case the selected row has been deleted
			this.m_currentSelectedDataRowNumber = dataRowNumber;
		}
	}
}

GridSelectionStrategy.isNullOrEmpty = function(value)
{
	return(value == null || value == "");
}

GridSelectionStrategy.prototype.scrollSelectedRowIntoView = function(dataRowNumber)
{
	var model = this.m_model;
	var topRow = model.m_rowRange.getStartRowNumber();
	var numberOfRowsInView = model.m_gridRenderer.getNumberOfRowsInView();
	
	if(dataRowNumber < topRow || dataRowNumber >= (topRow + numberOfRowsInView))
	{
		var numberOfRows = model.getData().length;
		
		topRow = dataRowNumber + numberOfRowsInView;
		
		if(topRow <= numberOfRows)
		{
			topRow = dataRowNumber;
		}
		else
		{
			var diff = numberOfRows - dataRowNumber;
			topRow = dataRowNumber - numberOfRowsInView + diff;
		}
					
		model.m_rowRange.setStartRowNumber(topRow);
		model.setCursorRow(dataRowNumber);
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Single Selection Strategy
// 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function GridSingleSelectionStrategy(model)
{
	this.m_model = model;
	this.m_dataBinding = model.m_dataBinding;
	this.m_keyXPath = model.getKeyXPath();
	this.type = "SingleSelection";
}

// GridSingleSelectionStrategy is a sub class of GridSelectionStrategy
GridSingleSelectionStrategy.prototype = new GridSelectionStrategy();
GridSingleSelectionStrategy.prototype.constructor = GridSingleSelectionStrategy;

GridSingleSelectionStrategy.prototype.refreshSelectionsFromDataBinding = function()
{
	// Before we update the value, remove the selection from that row
	this.removeSelectionFromRowByKey(this.m_value);
	
	// Store new value from the DOM
	this.m_value = Services.getValue(this.m_dataBinding);
	if(GridSelectionStrategy.isNullOrEmpty(this.m_value))
	{
		this.defaultSelectedRowToFirstRow();
	}
	else
	{
		this.addSelectionToRowByKey(this.m_value);
	}
}

// Called when the user clicks on a row - delegates to the inverse selection function that is 
// specific to the strategy
GridSingleSelectionStrategy.prototype.selectRow = function(dataRowNumber, forceUpdate)
{
	var key = this.getKeyFromDataRowNumber(dataRowNumber);
	if(key != null)
	{
		this.setKeyValue(key);
	}
	this.m_model.setCursorRow(dataRowNumber);
}

// The only difference between this and refreshSelectionsFromDataBinding() is that this has additional defaulting logic and can clear the
// dataBinding if it's no longer in the srcData - can we move that into refreshSelectionsFromDataBinding() and simply remove this function?
GridSingleSelectionStrategy.prototype.resetRowStatesAfterSrcDataRefresh = function()
{
	var setDefaultRow = false;
	var data = this.m_model.m_data;
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridModel.resetRowStatesAfterSrcDataRefresh() this.m_multipleSelection = " + this.m_multipleSelection + ", this.m_currentSelectedDataRowNumber = " + this.m_currentSelectedDataRowNumber);
	if(data.length > 0)
	{
		// Before we update the value, remove the selection from that row
		this.removeSelectionFromRowByKey(this.m_value);
		
		// Store new value from the DOM
		this.m_value = Services.getValue(this.m_dataBinding);
		if(GridSelectionStrategy.isNullOrEmpty(this.m_value))
		{
			this.defaultSelectedRowToFirstRow();
		}
		else
		{
			var dataRowNumber = this.m_model.getDataRowNumberByKey(this.m_value);
			if(dataRowNumber != null)
			{
				this.addSelectionToRowByKey(this.m_value);		
			}
			else
			{
				this.defaultSelectedRowToRemovedRow();
			}
		}
	}
	else
	{
		// If there is no src data then clear down any value in the databinding
		this.setKeyValue(null);
	}
}

GridSingleSelectionStrategy.prototype.setKeyValue = function(dV)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridModel._setKeyValue() db = " + db + ", dV = " + dV);
	return Services.setValue(this.m_dataBinding, dV);
}

// If we reload the data in single selection mode, and there is no selected 
// row then set to the first row, as long as we have some data
GridSingleSelectionStrategy.prototype.defaultSelectedRowToFirstRow = function()
{
	var data = this.m_model.m_data;
	if(data.length > 0)
	{
		this.selectRow(0, true);
	}
}

// If we reload the data in single selection mode, and there is no selected 
// row then set to the first row, as long as we have some data
GridSingleSelectionStrategy.prototype.defaultSelectedRowToRemovedRow = function()
{
	// If the existing dataBinding does not appear in the new src data then we need to default to the closest
	// row in terms on row number. If we are attempting to delete rows from the end of the grid then this will
	// allow the newly defaulted row to be the final row, rather than having to scroll down after every deletion
	if(this.m_currentSelectedDataRowNumber < this.m_model.m_data.length)
	{
		this.selectRow(this.m_currentSelectedDataRowNumber, true);
	}
	else
	{
		this.selectRow(this.m_model.m_data.length - 1, true);
	}
}

GridSingleSelectionStrategy.prototype.scrollSelectedRowIntoView = function()
{
	var dataRowNumber = this.m_model.getDataRowNumberByKey(this.m_value);
	
	if(dataRowNumber != null)
	{
		// Call parent class method
		GridSelectionStrategy.prototype.scrollSelectedRowIntoView.call(this, dataRowNumber);
	}
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Multiple Selection Strategy
// 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function GridMultipleSelectionStrategy(model)
{
	this.m_model = model;
	this.m_dataBinding = model.m_dataBinding;
	this.m_keyXPath = model.getKeyXPath();
	this.type = "MultipleSelection";
}

// LoadCompleteDataStrategy is a sub class of GridSelectionStrategy
GridMultipleSelectionStrategy.prototype = new GridSelectionStrategy();
GridMultipleSelectionStrategy.prototype.constructor = GridMultipleSelectionStrategy;

GridMultipleSelectionStrategy.prototype.resetRowStatesAfterSrcDataRefresh = function()
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridModel.resetRowStatesAfterSrcDataRefresh() this.m_multipleSelection = " + this.m_multipleSelection + ", this.m_currentSelectedDataRowNumber = " + this.m_currentSelectedDataRowNumber);
	if(this.m_model.m_data.length > 0)
	{
		this.refreshSelectionsFromDataBinding();

		// Reset the cursor row
		this.m_model.setCursorRow(this.m_model.m_cursorRow);
	}
	else
	{
		// If there is no data then clear down any value(s) in the databinding
		Services.removeNode(this.m_dataBinding);
	}
}

GridMultipleSelectionStrategy.prototype.selectRow = function(dataRowNumber, forceUpdate)
{
	var key = this.getKeyFromDataRowNumber(dataRowNumber);
	if(key != null)
	{
		var data = this.m_model.m_data;
		var row = data[dataRowNumber];
		if(row.selected == false)
		{
			this.setKeyValue(key);
		}
		else
		{
			this.deleteKey(key);
		}
	}
	this.m_model.setCursorRow(dataRowNumber);
}

GridMultipleSelectionStrategy.prototype.refreshSelectionsFromDataBinding = function()
{
	var data = this.m_model.m_data;
	
	// clear currently selected rows, only from the view, not the src data
	if(this.m_value != null)
	{
		for(var j=0, l=this.m_value.length; j<l; j++)
		{
			var key = XML.getNodeTextContent(this.m_value[j]);
			this.removeSelectionFromRowByKey(key);
			if(this.m_model.m_adaptor.checkForKeyExistence(key) == false)
			{
				// If there are any keys that existed before but are no longer in the src data then remove
				// then from the dataBinding
				this.deleteKey(key);
			}
		}
	}	
	this.m_value = this.getKeyNodes();
	if(this.m_value != null)
	{
		for(var j=0, l=this.m_value.length; j<l; j++)
		{
			var key = XML.getNodeTextContent(this.m_value[j]);
			this.addSelectionToRowByKey(key);
		}
	}
}

GridMultipleSelectionStrategy.prototype.getKeyNodes = function()
{
	var keyNodes = null;
	var keys = Services.getNode(this.m_dataBinding);
	if(keys != null)
	{
		keyNodes = keys.selectNodes(this.m_keyXPath);
	}
	return keyNodes;
}

GridMultipleSelectionStrategy.prototype.deleteKey = function(key)
{
	var found = false;
	var keyNodes = this.getKeyNodes();
	if(keyNodes != null)
	{
		for(var j=0,kl=keyNodes.length; j<kl; j++)
		{
			if(key == XML.getNodeTextContent(keyNodes[j]))
			{
				found = true;
				break;
			}
		}
	}
	if(found)
	{
		var xpath = XPathUtils.concatXPaths(this.m_dataBinding, XPathUtils.getLastNodeName(this.m_keyXPath)) + "[text()=\'" + key + "\']";
		Services.removeNode(xpath);
	}
}

GridMultipleSelectionStrategy.prototype.setKeyValue = function(dV)
{
	if(GridGUIAdaptor.m_logger.isDebug()) GridGUIAdaptor.m_logger.debug(this.m_model.getId() + " : GridModel._setKeyValue() db = " + db + ", dV = " + dV);

	Services.startTransaction();
	// construct xpath to remove using predicate based on unselected key value - always remove the node even
	// if selecting so we don't create duplicate nodes for the same key
	var xpath = XPathUtils.concatXPaths(this.m_dataBinding, XPathUtils.getLastNodeName(this.m_keyXPath)) + "[text()=\'" + dV + "\']";
	Services.removeNode(xpath);

	var node = FormController.getInstance().getDataModel().getInternalDOM().createElement(XPathUtils.getLastNodeName(this.m_keyXPath));		
	var newKeyNode = XML.createTextNode(node, dV);
	node.appendChild(newKeyNode);					
	Services.addNode(node, this.m_dataBinding);		

	Services.endTransaction();
	return true;
}

GridMultipleSelectionStrategy.prototype.scrollSelectedRowIntoView = function()
{
	var dataRowNumber = null;
	var keyNodes = this.getKeyNodes();
	
	if(keyNodes != null)
	{
		// Row(s) selected so get the lowest data row from the key(s)
		// as this will be used as the data row to scroll to
		
		var numberOfNodes = keyNodes.length;
		
		if(numberOfNodes != 0)
		{
			// Start with the last data row number
			dataRowNumber = this.m_model.getData().length;
			
			for(var i = numberOfNodes - 1; i >= 0; i--)
			{
				var key = keyNodes[i];
				var keyText = XML.getNodeTextContent(key);
				var temp = this.m_model.getDataRowNumberByKey(keyText);
				
				if(temp < dataRowNumber)
				{
					// Data row for current key is before stored data row,
					// so use that instead as the scroll row
					dataRowNumber = temp;
				}
			}
		}
	}
	
	if(dataRowNumber != null)
	{
		// Call parent class method
		GridSelectionStrategy.prototype.scrollSelectedRowIntoView.call(this, dataRowNumber);
	}
}
