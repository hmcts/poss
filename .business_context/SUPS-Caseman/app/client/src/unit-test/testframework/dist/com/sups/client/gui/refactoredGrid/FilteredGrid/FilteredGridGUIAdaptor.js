//==================================================================
//
// FilteredGridGUIAdaptor.js
//
// Class for adapting a text style input element for use in the
// framework
//
//==================================================================


/**
 * Base class for adapting html input elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 */
function FilteredGridGUIAdaptor()
{
}


/**
 * FilteredGridGUIAdaptor is a sub class of InputElementGUIAdaptor
 */
FilteredGridGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
FilteredGridGUIAdaptor.prototype.constructor = FilteredGridGUIAdaptor;

GUIAdaptor._setUpProtocols('FilteredGridGUIAdaptor'); 

/**
 * Clean up after the component
 */
FilteredGridGUIAdaptor.prototype._dispose = function()
{
    // Remove configuration items copied to window
    this._removeFilteredGridConfig();
    
	// Break circular reference in HTML
	this.m_element.__renderer = null;
	this.m_element = null;
}

/**
 * Create a new FilteredGridGUIAdaptor
 *
 * @param e the text input element to manage
 * @param f the gui adaptor factory
 * @return the new FilteredGridGUIAdaptor
 * @type FilteredGridGUIAdaptor
 */
FilteredGridGUIAdaptor.create = function(e, factory)
{
	Logging.logMessage("FilteredGridGUIAdaptor.create()", Logging.LOGGING_LEVEL_INFO);
	var a = new FilteredGridGUIAdaptor();
	a._initFilteredGridGUIAdaptor(e);
	
	//factory.parseChildren(e);
	
	return a;
}


/**
 * Initialise the FilteredGridGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
FilteredGridGUIAdaptor.prototype._initFilteredGridGUIAdaptor = function(e)
{
	Logging.logMessage("FilteredGridGUIAdaptor._initFilteredGridGUIAdaptor", Logging.LOGGING_LEVEL_INFO);
	this.m_element = e;
}

/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 */
FilteredGridGUIAdaptor.prototype._configure = function(cs)
{
	// copy across configuration for the grid from the filtered grid config
	var id = this.m_element.id;
	var gridId = id + "_filtered_grid";
	var ctor = function() {};
	window[gridId] = ctor;
	
	var currentConfig = window[id];
	for(var i in currentConfig)
	{
		ctor[i] = currentConfig[i];
	}
	
	// create the config for each of the filter input fields
	var columns = ctor.columns;

	if(null != columns)
	{
		for(var j=0,l=columns.length; j<l; j++)
		{
			var col = columns[j];
			// If we have defined a footer row then we need to create the config for the
			// dynamically created adaptor
			var filterXPath = this.createFilterFieldConfig(j, col);
			// put the filter xpath onto the column object literal, this will then be picked
			// up by the grid config and listened to for filtering events
			col.filterXPath = filterXPath;
		}
	}

}

FilteredGridGUIAdaptor.prototype.addDblclickListener = function(cb)
{
	var id = this.m_element.id;
	var gridId = id + "_filtered_grid";
	var grid = Services.getAdaptorById(gridId);
    grid.addDblclickListener(cb);
}

FilteredGridGUIAdaptor.prototype.removeDblclickListener = function(cb)
{
	var id = this.m_element.id;
	var gridId = id + "_filtered_grid";
	var grid = Services.getAdaptorById(gridId);
    grid.removeDblclickListener(cb);
}

FilteredGridGUIAdaptor.prototype.createFilterFieldConfig = function(colNumber, column)
{   
    var id = this.getId() + "_column_filter_col" + colNumber;
    
	var ctor = function() {};
	window[id] = ctor;
	var xpath = column.filterXPath;
	if(xpath == null)
	{
		xpath = DataModel.DEFAULT_TMP_BINDING_ROOT + "/filtering/" + id;
	}
	ctor.dataBinding = xpath;
	ctor.isTemporary = function() {return true;};
	// the additional stlying classes are required otherwise the input element adaptor
	// simply overwrites those that we set.
	ctor.additionalStylingClasses = " grid_filter_cell col" + colNumber;

	return xpath;
}

/**
 * Remove properties added to window for configuration of
 * inner grid and filters. If these properties are not removed the
 * filtered grid will leak memory.
 *
*/
FilteredGridGUIAdaptor.prototype._removeFilteredGridConfig = function()
{
    var id = this.m_element.id;
    var gridId = id + "_filtered_grid";
    
    // Retrieve grid configuration from window
    var gridConfig = window[gridId];
    
    if(null != gridConfig)
    {
    
        // First clean up column configuration
        var columns = gridConfig.columns;

        if(null != columns)
        {
    
            var columnId = null;
            var columnConfig = null;
        
            for(var i = 0, l = columns.length; i < l; i++)
            {
                columnId = this.getId() + "_column_filter_col" + i;
            
                columnConfig = window[columnId];
            
                if(null != columnConfig)
                {
                    // Clean up properties of configuration
                    if(null != columnConfig.dataBinding)columnConfig.dataBinding = null;
                    if(null != columnConfig.isTemporary)columnConfig.isTemporary = null;
                    if(null != columnConfig.additionalStylingClasses)columnConfig.additionalStylingClasses = null;
                
                    // Clear up window property
                    columnConfig = null;
                    window[columnId] = null;
                }
            
                columnId = null;
            }
        
        }
        
        // Clean up grid config
        for(var j in gridConfig)
        {
            gridConfig[j] = null;
        }
        
        gridConfig = null;
        window[gridId] = null;
        gridId = null;
        
    }
    
}

 

