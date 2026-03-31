//==================================================================
//
// LOVProtocol.js
//
// Class which provides common code between LOV style
// components which currently includes LOVPopupGUIAdaptor and
// LOVSubformGUIAdaptor.
//
//==================================================================


/*
 * LOVProtocol constructor
 *
 * @constructor
 */
function LOVProtocol()
{
}


/**
 * Configuration property that contains the srcData XPath configuration
 * for the LOV's grid.
 *
 * @type String
 * @configuration
 */
LOVProtocol.prototype.srcData = null;


/**
 * Configuration property that contains the srcDataOn XPath configuration
 * for the LOV's grid.
 *
 * @type Array[String]
 * @configuration
 */
LOVProtocol.prototype.srcDataOn = null;


/**
 * Configuration property that contains the dataBinding for the LOV. This
 * is the XPath location where the item(s) selected in the LOV's grid will
 * be placed when the "OK" button on the grid is clicked.
 *
 * @type String
 * @configuration
 */
LOVProtocol.prototype.dataBinding = null;


/**
 * Configuration property that identifies the XPath to the child node in the
 * srcData that contains the data for a row.
 *
 * @type String
 * @configuration
 */
LOVProtocol.prototype.rowXPath = null;


/**
 * Configuration property that contains the configuration for each column in
 * the LOV's grid.
 *
 * @type Object
 * @configuration
 */
LOVProtocol.prototype.columns = null;


/**
 * Configuration property that contains the XPath to the child node of each
 * row which contains the key for each row in the LOV's grid
 *
 * @type String
 * @configuration
 */
LOVProtocol.prototype.keyXPath = null;


/**
 * Configuration property that contains the multipleSelection flag for the
 * LOV's grid.
 *
 * @type Boolean
 * @configuration
 */
LOVProtocol.prototype.multipleSelection = null;


/**
 * Initialisation method for LOVProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
LOVProtocol.prototype.configLOVProtocol = function(cs)
{
	for(var i = 0, l = cs.length; i < l ; i++)
	{
		var c = cs[i];
		
		// LOV Popup Data binding
		if(c.dataBinding && this.dataBinding == null)
		{
			this.dataBinding = c.dataBinding;
		}
		if(c.srcData != null && this.srcData == null)
		{
			this.srcData = c.srcData; 	
		}
		if(c.srcDataOn != null && this.srcDataOn == null)
		{
			this.srcDataOn = c.srcDataOn;
		}
		if(c.rowXPath != null && this.rowXPath == null)
		{
			this.rowXPath = c.rowXPath;
		}
		if(c.keyXPath != null && this.keyXPath == null)
		{
			this.keyXPath = c.keyXPath; 	
		}
		if(c.columns != null && this.columns == null)
		{
			this.columns = c.columns;
		}
		if(c.multipleSelection != null && this.multipleSelection == null)
		{
			this.multipleSelection = c.multipleSelection;
		}
	}
}

/**
 * Dispose method for LOVProtocol
 */
LOVProtocol.prototype.disposeLOVProtocol = function()
{
}
