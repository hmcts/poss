//==================================================================
//
// EditPanelRenderer.js
//
// Implementation of EditPanel rendering class.
//
//==================================================================


/**
 * EditPanelRenderer constructor - never used. Use factory methods
 * below to either render an EditPanel into an HTML page, or create
 * an EditPanel as a child of another element
 *
 * @private
 * @constructor
 */
function EditPanelRenderer() {}

/**
 * EditPanelRenderer is a sub class of Renderer
 */
EditPanelRenderer.prototype = new Renderer();

/**
 * Set the constructor property so we can identify the type
 */
EditPanelRenderer.prototype.constructor = EditPanelRenderer;

/**
 * Logging category for the EditPanelRenderer class
 *
 * @type Category
 * @private
 */
EditPanelRenderer.m_logger = new Category("EditPanelRenderer");

/**
 * CSS Class name of the outermost div of the edit panel component
 */
EditPanelRenderer.CSS_CLASS_NAME = "edit_panel";

/**
 * Edit Panel identifiers
 */
EditPanelRenderer.BUTTON_PANEL = "_epButtonPanel";

/*
 * Create an edit panel at the current location in the document while document
 * is parsing.
 *
 * @param id the id of edit panel being created
 */
EditPanelRenderer.createInline = function(id)
{
	// Create the outer div by writing to the document
	var e = Renderer.createInline(
		id,			// The id of the edit panel being created
		false		// The edit panel has an internal input element which can accept focus, so the div should not accept focus
	);

	return EditPanelRenderer._create(e);
}

/**
 * Create an edit panel in the document relative to the supplied element
 *
 * @param refElement the element relative to which the edit panel should be rendered
 * @param relativePos the relative position of the edit panel to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the edit panel being created
 */
EditPanelRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the edit panel being created
		false			// The edit panel has an internal input element which can accept focus, so the div should not accept focus
	);

	return EditPanelRenderer._create(e);
}

/**
 * Create an edit panel as a child of another HTML element
 *
 * @param p the parent element to add the edit panel to
 * @param id the id of edit panel being created
 */
EditPanelRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the edit panel's outer div to it's parent element
	p.appendChild(e);	
	
	return EditPanelRenderer._create(e);
}

/**
 * Create the HTML elements for a edit panel component
 *
 * @param e the outer DIV of the edit panel component
 */
EditPanelRenderer._create = function(e)
{
	e.className = EditPanelRenderer.CSS_CLASS_NAME;

	var ep = new EditPanelRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	ep._initRenderer(e);	

	var epId = e.id;

	// Table for Assigned Roles grid, move buttons and Available Roles grid
	table = Renderer.createElementAsChild(e, "table");
	table.className = "roles_layout";
	tBody = Renderer.createElementAsChild(table, "tbody");

	// Grid titles row
	tRow = Renderer.createElementAsChild(tBody, "tr");

	// Assigned Roles title cell
	tCell = Renderer.createElementAsChild(tRow, "th");
	tCell.setAttribute("align", "center");
	tCell.innerHTML = "Assigned Roles";

	// Empty cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Available Roles title cell
	tCell = Renderer.createElementAsChild(tRow, "th");
	tCell.setAttribute("align", "center");
	tCell.innerHTML = "Available Roles";

	// Assigned Roles grid, left/right arrow buttons and Available Roles grid
	tRow = Renderer.createElementAsChild(tBody, "tr");
	
	// Assigned Roles grid cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create Assigned Roles grid
	var gridId = epId + "_" + EditPanelGUIAdaptor.ASSIGNED_ROLES;
	Grid.createAsChild(tCell, gridId, ["Role Name"], 10, 1);

	// Left/right arrows cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create the buttons in a panel so we can apply an enablement rule
	var panel = Renderer.createElementAsChild(tCell, "div");
	panel.className = PanelGUIAdaptor.CSS_CLASS_NAME;
	panel.id = epId + EditPanelRenderer.BUTTON_PANEL;

	// Create the Right Arrow button
	button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", ">");
	button.id = epId + EditPanelGUIAdaptor.RIGHT_ARROW;
	button.className = "arrow_button";
	panel.appendChild(button);

	Renderer.createElementAsChild(panel, "br");	

	// Create the Double Right Arrow button
	button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", ">>");
	button.id = epId + EditPanelGUIAdaptor.DOUBLE_RIGHT_ARROW;
	button.className = "arrow_button";
	panel.appendChild(button);

	Renderer.createElementAsChild(panel, "br");
	Renderer.createElementAsChild(panel, "br");

	// Create the Left Arrow button
	button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", "<");
	button.id = epId + EditPanelGUIAdaptor.LEFT_ARROW;
	button.className = "arrow_button";
	panel.appendChild(button);

	Renderer.createElementAsChild(panel, "br");

	// Create the Double Left Arrow button
	button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", "<<");
	button.id = epId + EditPanelGUIAdaptor.DOUBLE_LEFT_ARROW;
	button.className = "arrow_button";
	panel.appendChild(button);

	// Available Roles grid cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create Available Roles grid
	gridId = epId + "_" + EditPanelGUIAdaptor.AVAILABLE_ROLES;
	Grid.createAsChild(tCell, gridId, ["Role Name"], 10, 1);

	return ep;
}

EditPanelRenderer.prototype.dispose = function()
{
}

EditPanelRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, readonly, inactive)
{
}
