//==================================================================
//
// ActionBarRenderer.js
//
// Implementation of ActionBar rendering class. Creates a horizontal
// bar at the bottom of a form or popup, which can contain zero or
// more "action buttons" (these are simply normal HTML input buttons
// which can be configured in the framework in the normal way) and
// also an optional status bar area.
//
//==================================================================


/**
 * ActionBarRenderer constructor - never used. Use factory methods
 * below to either render an ActionBar into an HTML page, or create
 * an actionbar as a child of another element
 *
 * @private
 * @constructor
 */
function ActionBarRenderer() {}


/**
 * ActionBarRenderer is a sub class of Renderer
 */
ActionBarRenderer.prototype = new Renderer();
ActionBarRenderer.prototype.constructor = ActionBarRenderer;


/**
 * The CSS Classname of the outer element of an action bar
 *
 * @type String
 */
ActionBarRenderer.CSS_CLASS_NAME = "action_bar";


/**
 * An array which contains the buttons on the action bar
 *
 * @type Array[HTMLInputElement]
 * @private
 */
ActionBarRenderer.prototype.m_buttons = null;


/**
 * Render an action bar which includes a status message area at the current
 * location in the document while document is parsing. This is typically used
 * to create actionbars for a form.
 *
 * @param id the id of the action bar
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element. If not specified
 *  then this defaults to "status_line".
 */
ActionBarRenderer.createInline = function(id, buttons, statusBarId)
{
	ActionBarRenderer._createInline(id, buttons, null == statusBarId ? "status_line" : statusBarId);
}


/**
 * Render an action bar without a status line at the current location in the
 * document while document is parsing. This is typically used to create action
 * bars for popups.
 *
 * @param id the id of the action bar
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 */ 
ActionBarRenderer.createInlineNoStatusBar = function(id, buttons)
{
	ActionBarRenderer._createInline(id, buttons, null);
}


/**
 * Render an action bar which includes a status message area in the document relative
 * to the supplied element. This is typically used to create actionbars for a form.
 *
 * @param refElement the element relative to which the action bar should be rendered
 * @param relativePos the relative position of the action bar to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the action bar
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element. If not specified
 *  then this defaults to "status_line".
 */
ActionBarRenderer.createAsInnerHTML = function(refElement, relativePos, id, buttons, statusBarId)
{
	ActionBarRenderer._createAsInnerHTML(refElement, relativePos, id, buttons, null == statusBarId ? "status_line" : statusBarId);
}


/**
 * Render an action bar without a status line in the document relative to the
 * supplied element. This is typically used to create action bars for popups.
 *
 * @param refElement the element relative to which the action bar should be rendered
 * @param relativePos the relative position of the action bar to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the action bar
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 */ 
ActionBarRenderer.createAsInnerHTMLNoStatusBar = function(refElement, relativePos, id, buttons)
{
	ActionBarRenderer._createAsInnerHTML(refElement, relativePos, id, buttons, null);
}


/**
 * Create an actionbar at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the action bar being created
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element.
 * @private
 */
ActionBarRenderer._createInline = function(id, buttons, statusBarId)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the actionbar being created
		false		// The actionbar has an internal input element which can accept focus, so the div should not accept focus
	);

	return ActionBarRenderer._create(e, buttons, statusBarId);
}


/**
 * Create an actionbar in the document immediately after the supplied element
 *
 * @param refElement the element relative to which the grid should be rendered
 * @param relativePos the relative position of the grid to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the actionbar being created
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element.
 * @private
 */
ActionBarRenderer._createAsInnerHTML = function(refElement, relativePos, id, buttons, statusBarId)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the actionbar being created
		false			// The actionbar has an internal input element which can accept focus, so the div should not accept focus
	);

	return ActionBarRenderer._create(e, buttons, statusBarId);
}


/**
 * Create an actionbar as a child of another element
 * 
 * @param p the parent element to which the actionbar should be added
 * @param id the id of the actionbar being created
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element
 */
ActionBarRenderer.createAsChild = function(p, id, buttons, statusBarId)
{
	var e = Renderer.createAsChild(id);

	// Append the actionbar's outer div to it's parent element
	p.appendChild(e);

	return ActionBarRenderer._create(e, buttons, statusBarId);
}


/**
 * Create the html elements that make up an actionbar
 *
 * @param e the outer element of the actionbar
 * @param buttons an array of objects containing the properties:
 *    id: the id of the button
 *    label: the label of the button
 *    className: CSS class to set on the button
 * @param statusBarId the id of the statusbar element. If null,
 *   then no statusbar will be created.
 * @private
 */
ActionBarRenderer._create = function(e, buttons, statusBarId)
{
	e.className = ActionBarRenderer.CSS_CLASS_NAME;

	var b = new ActionBarRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	//b._initRenderer(e);
	// Action bar renderer does not have an associated adaptor. Therefore,
	// we should not use _initRenderer method as it sets up a cyclic reference.
	b.m_element = e;	

	var d = document;

	// Create a table for the status label, status message and buttons
	var table = d.createElement("table");
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");
	table.className = "action_bar_container";
	
	var tbody = d.createElement("tbody");
	table.appendChild(tbody);
	
	var tr = d.createElement("tr");
	tr.className = "action_bar_container_row";
	tbody.appendChild(tr);
	
	if(statusBarId != null)
	{
		// Create a table cell for the status label
		var statusLabelCell = d.createElement("td");
		statusLabelCell.className = "status_label";
		tr.appendChild(statusLabelCell);
	
		// Create a table cell for the status message
		var statusMessageCell = d.createElement("td");
		statusMessageCell.className = "status_message";
		tr.appendChild(statusMessageCell);

		// Set text in status label table cell
		statusLabelCell.innerHTML = "Status";
		
		// Create status message element
		var span = d.createElement("span");
		span.id = statusBarId;
		
		// Add status message element to table cell
		statusMessageCell.appendChild(span);
	}
	
	if(null != buttons && buttons.length > 0)
	{
		// Create a table cell for the buttons
		var buttonsCell = d.createElement("td");
		tr.appendChild(buttonsCell);

		b.m_buttons = new Array(buttons.length);

		// Create buttons container element
		var buttonContainer = d.createElement("div");
		buttonContainer.className = "button_container";

		// Create buttons
		for(var i = 0; i < buttons.length; i++)
		{
			var button = d.createElement("input");
			button.id = buttons[i].id;
			button.setAttribute("type", "button");
			button.setAttribute("value", buttons[i].label);
			button.className = buttons[i].className;
			buttonContainer.appendChild(button);
		
			b.m_buttons[i] = button;
		}
		
		// Add buttons container to table cell
		buttonsCell.appendChild(buttonContainer);
	}
	else
	{
		b.m_buttons = null;
	}

	e.appendChild(table);
	
	return b;
}

/**
 * Get set of buttons on the ActionBar
 *
 * @return an array containing references to the buttons on the ActionBar
 * @type Array[HTMLInputElements]
 */
ActionBarRenderer.prototype.getButtons = function()
{
	return this.m_buttons;
}