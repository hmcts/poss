//==================================================================
//
// ButtonFieldRenderer.js
//
// Implementation of ButtonField rendering class. This is a base
// class for components which consist of a text field and an
// associated button.
//
//==================================================================



function ButtonFieldRenderer()
{
}

ButtonFieldRenderer.m_logger = new Category("ButtonFieldRenderer");

/**
 * The main container element for the component
 *
 * @type HTMLDivElement
 * @private
 */
//ButtonFieldRenderer.prototype.m_element = null;


/**
 * The input field for the component
 *
 * @type HTMLInputElement
 * @private
 */
//ButtonFieldRenderer.prototype.m_inputField = null;


/**
 * The button which raises the dropdown for the component
 *
 * @type Button
 * @private
 */
ButtonFieldRenderer.prototype.m_button = null;




/**
 * CSS class for the dropdown container
 *
 * @type String
 */
ButtonFieldRenderer.CSS_CLASS_NAME = "buttonfield";


/**
 * Create the drop down field as a child of another element
 *
 * @param p the parent element to create the child under
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 * @return a new ButtonFieldRenderer instance
 * @type ButtonFieldRenderer
 */
ButtonFieldRenderer.createAsChild = function(p, multiline)
{
	var f = new ButtonFieldRenderer();
	f.m_framedField = FramedFieldRenderer.createAsChild(p, ButtonFieldRenderer.CSS_CLASS_NAME, multiline);
	
	// Create table cell which will contain the button
	var buttonCell = f.m_framedField.addCellAfterField();
	buttonCell.className = "buttonfield_button_container";
	
	// Create button to trigger drop down
	f.m_button = Button.createAsChild(buttonCell, null, "buttonfield_button");

	return f;
}


ButtonFieldRenderer.prototype.dispose = function()
{
	// Clean up the button
	this.m_button.dispose();
	
	// Get rid of the framedField
	this.m_framedField.dispose();
}


ButtonFieldRenderer.prototype.startEventHandlers = function()
{
	this.m_button.startEventHandlers();
}


ButtonFieldRenderer.prototype.stopEventHandlers = function()
{
	this.m_button.stopEventHandlers();
}


ButtonFieldRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive)
{
	if(disabled || inactive)
	{
		this.stopEventHandlers();
	}
	else
	{
		this.startEventHandlers();
	}
	this.m_framedField.render(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive);
}
