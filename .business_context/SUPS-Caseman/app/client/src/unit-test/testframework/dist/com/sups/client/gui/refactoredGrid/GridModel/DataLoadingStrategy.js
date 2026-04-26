/**
 * Interface for data loading strategies
 */
function DataLoadingStrategy(model)
{
}

DataLoadingStrategy.refreshSrcData = function(model, dataModelEvent)
{
}

DataLoadingStrategy.pageData = function(model, pagingEvent)
{
}

DataLoadingStrategy.loadDataForSort = function(model, sortingEvent)
{
}

/**
 * This strategy loads the complete data set in one go, this is the strategy implemented
 * in the original grid. This will still be a valid strategy for smaller data sets where
 * the added complexity of lazy loading is unneccessary.
 *
 * pageData() and sortData() have no implementation for this strategy because all data
 * is loaded by refreshSrcData()
 */
function LoadCompleteDataStrategy(model)
{
	this.m_model = model;
}

// LoadCompleteDataStrategy is a sub class of DataLoadingStrategy
LoadCompleteDataStrategy.prototype = new DataLoadingStrategy();
LoadCompleteDataStrategy.prototype.constructor = LoadCompleteDataStrategy;


/**
 * There is no need to load any data for this strategy because all of the data is already loaded.
 */
LoadCompleteDataStrategy.prototype.loadDataForSort = function(sortEvent)
{
}

LoadCompleteDataStrategy.prototype.refreshSrcData = function(dataModelEvent)
{
	if(GridGUIAdaptor.m_logger.isInfo()) GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.refreshSrcData(), event = " + dataModelEvent);
	
	// Defects 916 and 947. Historically the method "applyDeltaToSrcData" did not quite work correctly.
	// The method may, or may not, have added a row to the grid, but it always returned "false". Therefore,
	// the method "reloadAllSrcData" was always executed. I modified "applyDeltaToSrcData" to work
	// correctly but this revealed a number of undesirable knock effects. As such we have decided to
	// simply reload all of the data each time until a more comprehensive solution can be devised.
	// RWW 6/04/06.
	
	//if(!this.applyDeltaToSrcData(dataModelEvent))
	//{
		this.reloadAllSrcData();
	//}

	var adaptor = this.m_model.getAdaptor();
	// Trigger a StateChangeEvent if the srcData has changed
	// ToDo: this should take into account deltas
	var e = StateChangeEvent.create(StateChangeEvent.SRCDATA_TYPE, null, adaptor);
	adaptor.changeAdaptorState(e);
}

LoadCompleteDataStrategy.prototype.applyDeltaToSrcData = function(dataModelEvent)
{
    var returnValue = false;
    
	try
	{
		var eventType = dataModelEvent.getType();
		var eventXPath = String.trim(dataModelEvent.getXPath());
		// Don't bother to attempt to apply deltas during initialisation
		if(eventXPath == "/")
		{
			return returnValue;
		}
	
		if(eventType == DataModelEvent.UPDATE || eventType == DataModelEvent.ADD)
		{
			var key = this.getRowKeyFromEventXPath(eventXPath);
			
			if(key != null)
			{
				this.reloadRowFromSrcData(key);
				
				// If row successfully loaded return true to prevent
				// full load of data from dom.
				returnValue = true;
			}
		}
		else if(eventType == DataModelEvent.REMOVE)
		{
			// The data is no longer in the source data, therefore unless the key is specified in the predicate
			// we can't remove the row by key
		}		
	}
	catch(e) 
	{
		if(GridGUIAdaptor.m_logger.isError()) GridGUIAdaptor.m_logger.error("LoadCompleteDataStrategy.applyDeltaToSrcData() dataModelEvent = " + dataModelEvent.toString + ", caught exception attempting to apply deltas to src data, reloading entire src data for grid");
	}
	return returnValue;
}


LoadCompleteDataStrategy.prototype.getRowKeyFromEventXPath = function(eventXPath)
{
	var model = this.m_model;
	var arr = new Array(model.getRowXPath(), "[");
	var rowXPath = String.trim(arr.join(""));
	var index = eventXPath.indexOf(String.trim(rowXPath));
	if(index != -1)
	{
		index = rowXPath.length;
		var xp = eventXPath.substring(0, index);
		var remainingXP = eventXPath.substring(index);
		var closePredicateIndex = remainingXP.indexOf("]");
		if(closePredicateIndex != -1)
		{
			rowXPath = eventXPath.substring(0, index + closePredicateIndex + 1);

			var keyXPath = model.getKeyXPath();
			var rows = Services.getNodes(rowXPath);
			if(rows.length == 1)
			{
				var rowNode = rows[0];
				var keyNode = rowNode.selectSingleNode(keyXPath);
				var key = null;
				if(null != keyNode)
				{
					key = XML.getNodeTextContent(keyNode);
					return key;
				}
			}					
		}
	}
	return null;
}


LoadCompleteDataStrategy.prototype.reloadRowFromSrcData = function(rowKey)
{
	if(GridGUIAdaptor.m_logger.isInfo()) GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.reloadRowFromSrcData()");
	// rows is an array of DataRow objects which we will manipulate directly
	// using pass by reference to avoid copying objects
	var model = this.m_model;
	var data = model.getData();
	var columns = model.getColumns();

	// Refresh all view rows for now
	model.refreshAllViewRows();
	
	// clear down the key
	var dataRowNumber = model.getDataRowNumberByKey(rowKey);
	delete data["key:" + rowKey];
	
	// clear down the row data from the model
	//if(dataRowNumber != null)
	//{
	//	delete data[dataRowNumber];
	//}
	// Actually do this by creating new array without
	// row. This will prevent the array becoming filled
	// with null rows.
	var newData;
	
	if(null != dataRowNumber)
	{
	    newData = new Array();
	
	    var index = 0;
	
	    for(var i = 0, l = data.length; i < l; i++)
	    {
	        if( dataRowNumber != i )
	        {
	            newData[index] = data[i];
	            newData["key:" + newData[index].key] = index;
	            index++;
	        }
	    }
	    
	}
	else
	{
	    newData = data;
	}
	
	var arr = new Array(model.getRowXPath(), "[", model.getKeyXPath(), " = \'", rowKey, "\']");
	var currentSelectedRowXPath = String.trim(arr.join(""));
	
	// get the rows from the dom
	var rows = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(currentSelectedRowXPath);
	if(rows != null && rows.length > 0)
	{
		// add the rows to the existing rows - in this case there are none but we will re-use the addRows() method
		newData = this.addRowsToData(columns, newData, rows);
	}
		
	// update the data rows in the model
	model.setData(newData);
	model.refreshAllViewRows();
}

LoadCompleteDataStrategy.prototype.reloadAllSrcData = function()
{
	if(GridGUIAdaptor.m_logger.isInfo()) GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.reloadAllSrcData()");

	// rows is an array of DataRow objects which we will manipulate directly
	// using pass by reference to avoid copying objects
	var data = this.m_model.getData();
	var columns = this.m_model.getColumns();
	var model = this.m_model;

	// we clear any existing rows because we are reloading the entire dataset. We need to generate a
	// row rendering event for each row in case we are reloading with less data than before.
	model.refreshAllViewRows();
	// clear down the data rows
	for(var i=0, l=data.length; i<l; i++)
	{
		data[i] = null;
	}
	// clear down the keys
	for(var i in data)
	{
		delete data[i];
	}
	data.length = 0;

	// get the rows from the dom
	var rows = FormController.getInstance().getDataModel().getInternalDOM().selectNodes(this.m_model.getRowXPath());
	if(rows != null && rows.length > 0)
	{
		// add the rows to the existing rows - in this case there are none but we will re-use the addRows() method
		data = this.addRowsToData(columns, data, rows);
	}
		
	// update the data rows in the model
	model.setData(data);
	model.refreshAllViewRows();
}

LoadCompleteDataStrategy.prototype.addRowsToData = function(columns, data, rows)
{
	if(GridGUIAdaptor.m_logger.isInfo()) GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.addRows(): adding " + rows.length + " rows to the existing data set");
	if(null != rows)
	{
		var nCols = columns.length;
		var aggregateState = this.m_model.getAdaptor().getAggregateState();
		//var areGridChildrenSubmissible = aggregateState.areChildrenSubmissible();

		// get any filters defined on the columns
		var dom = FormController.getInstance().getDataModel().getInternalDOM();
		var columnFilters = new Array();
		var columnFilterModes = new Array();
		for(var j = 0; j < nCols ; j++)
		{
			var currentColumn = columns[j];
			var filterXPath = currentColumn.getFilterXPath();
			var filterMode = currentColumn.getFilterMode();
			var filterValue = null;
			if(filterXPath != null)
			{
				var currentFilterNode = dom.selectSingleNode(currentColumn.getFilterXPath());
				if(null != currentFilterNode)
				{
					filterValue = XML.getNodeTextContent(currentFilterNode);
				}
			}
			columnFilters[j] = filterValue;
			columnFilterModes[j] = filterMode;
		}

		var filterOutRow = false;
		var currentColumn = null;
		var currentFilterValue = null;
		var currentFilterMode = null;
		
		var keyXPath = this.m_model.getKeyXPath();
		
		for(var i=0,rl = rows.length; i<rl ; i++)
		{
			var rowNode = rows[i];
			var keyNode = rowNode.selectSingleNode(keyXPath);
			var key = null;
			if(null != keyNode)
			{
				key = XML.getNodeTextContent(keyNode);
			}
			var newRow = new Array();
			newRow.key = key;
			// Initialise row attributes
			newRow.selected = false;
			newRow.cursor = false;
			newRow.hasFocus = false;
			newRow.submissible = aggregateState.isKeySubmissible(key);
			//newRow.submissible = (areGridChildrenSubmissible == true) ? true : aggregateState.isKeySubmissible(key);
			
			filterOutRow = false;
			currentColumn = null;
			currentFilterValue = null;
			currentFilterMode = null;
			
			// set the content of the cells in the row
			for(var j = 0; j < nCols ; j++)
			{
				var value = null;
				currentColumn = columns[j];
				currentFilterValue = columnFilters[j];
				currentFilterMode = columnFilterModes[j];
				
				// Get the model value for this column
				var columnNode = rowNode.selectSingleNode(currentColumn.getXPath());
				if(null != columnNode)
				{
					value = XML.getNodeTextContent(columnNode);
				}
				// Apply the display transform if there is one or the default otherwise
				if(null != currentColumn.m_transformToDisplay)
				{
					value = currentColumn.m_transformToDisplay.call(currentColumn, value, key);
				}
				else
				{
					value = ColumnHeader.defaultColumnTransform(value);
				}
				
				if(currentFilterValue != null)
				{
					if(currentFilterMode == "caseSensitive")
					{
						if(value.indexOf(currentFilterValue) == -1)
						{
							filterOutRow = true;
							break;
						}
					}
					else
					{
						if(value.toUpperCase().indexOf(currentFilterValue.toUpperCase()) == -1)
						{
							filterOutRow = true;
							break;
						}
					}
				}
				
				// Set the value into the cell on the data row
				newRow[j] = value;
			}
			if(filterOutRow == false)
			{
				data[data.length] = newRow;
				// store the dataRowNumber against the key for fast retrieval by key
				// Defect 830. Look up table should store position of row in data
				// array not in source XML structure.
				//data["key:" + key] = i;
				data["key:" + key] = data.length - 1;
			}
			else
			{
				if(GridGUIAdaptor.m_logger.isInfo()) GridGUIAdaptor.m_logger.info("LoadCompleteDataStrategy.addRows(): filtered out row with key " + i + " due to filterValue of " + currentFilterValue + " on column " + currentColumn.getXPath() + " where the column value is " + value);
			}
		}
	}
	return data;
}
