//==================================================================
//
// LabelledGridGUIAdaptor.js
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
function LabelledGridGUIAdaptor()
{
}


/**
 * LabelledGridGUIAdaptor is a sub class of InputElementGUIAdaptor
 */
LabelledGridGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
LabelledGridGUIAdaptor.prototype.constructor = LabelledGridGUIAdaptor;

GUIAdaptor._setUpProtocols('LabelledGridGUIAdaptor'); 

/**
 * Clean up after the component
 */
LabelledGridGUIAdaptor.prototype.dispose = function()
{
	// Break circular reference in HTML
	this.m_element.__renderer = null;
	this.m_element = null;
}

/**
 * Create a new LabelledGridGUIAdaptor
 *
 * @param e the text input element to manage
 * @param f the gui adaptor factory
 * @return the new LabelledGridGUIAdaptor
 * @type LabelledGridGUIAdaptor
 */
LabelledGridGUIAdaptor.create = function(e, factory)
{
	Logging.logMessage("LabelledGridGUIAdaptor.create()", Logging.LOGGING_LEVEL_INFO);
	var a = new LabelledGridGUIAdaptor();
	a._initLabelledGridGUIAdaptor(e);
	
	//factory.parseChildren(e);
	
	return a;
}


/**
 * Initialise the LabelledGridGUIAdaptor
 *
 * @param e the HTMLElement for the select element to be managed
 * @private
 */
LabelledGridGUIAdaptor.prototype._initLabelledGridGUIAdaptor = function(e)
{
	Logging.logMessage("LabelledGridGUIAdaptor._initLabelledGridGUIAdaptor", Logging.LOGGING_LEVEL_INFO);
	this.m_element = e;
}

/**
 * Perform any GUIAdaptor specific configuration - this also creates the config
 * objects for the sub-components dynamically
 */
LabelledGridGUIAdaptor.prototype._configure = function(cs)
{
	var id = this.m_element.id;
	var index = id.lastIndexOf("_labelled_grid");
	var gridId = id.substring(0, index);
	var labelId = gridId + "_label";
	
	var ctor = function() {};
	window[labelId] = ctor;
	var xpath = "/ds/var/page/labels/" + id + "/" + labelId;
	ctor.dataBinding = xpath;
	ctor.isTemporary = function() {return true;};
	ctor.isReadOnly = function() {return true;};
	ctor.additionalStylingClasses = " grid_label";
	
	var handleDataChange = function(){ 
			var grid = Services.getAdaptorById(gridId);
			var selectedRow = grid.getCurrentSelectedRow();
			var rowRange = grid.getRowRange();
			var startRowNumber = parseInt(rowRange.startRowNumber)+1;
			var numberOfRowsInView = rowRange.numberOfRowsInView;
			var maxNumberOfRows = rowRange.maxNumberOfRows;
			if(parseInt(numberOfRowsInView) > parseInt(maxNumberOfRows))
			{
				numberOfRowsInView = maxNumberOfRows;
			}
			if(maxNumberOfRows == 0)
			{
				startRowNumber = 0;
			}
			var msg = startRowNumber + " to " + numberOfRowsInView + " of " + maxNumberOfRows;
			if(selectedRow != null)
			{
				msg += ", selected row is " + selectedRow;
			}
			Services.setValue(xpath, msg); 
		};

	ctor.initialise = function() {
			var grid = Services.getAdaptorById(gridId);
			var label = Services.getAdaptorById(labelId);
			grid.addDataChangeListener(handleDataChange);
			grid.addPositionChangeListener(handleDataChange);
			grid.addSelectionChangeListener(handleDataChange);
			return true;
		};

}
