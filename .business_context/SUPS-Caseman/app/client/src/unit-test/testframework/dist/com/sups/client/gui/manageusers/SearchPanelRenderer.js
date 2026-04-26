//==================================================================
//
// SearchPanelRenderer.js
//
// Implementation of Search Panel rendering class.
//
//==================================================================


/**
 * SearchPanelRenderer constructor - never used. Use factory methods
 * below to either render a Search Panel into an HTML page, or create
 * a Search Panel as a child of another element
 *
 * @private
 * @constructor
 */
function SearchPanelRenderer() {}

/**
 * SearchPanelRenderer is a sub class of Renderer
 */
SearchPanelRenderer.prototype = new Renderer();

/**
 * Set the constructor property so we can identify the type
 */
SearchPanelRenderer.prototype.constructor = SearchPanelRenderer;

/**
 * Logging category for the SearchPanelRenderer class
 *
 * @type Category
 * @private
 */
SearchPanelRenderer.m_logger = new Category("SearchPanelRenderer");

/**
 * CSS Class name of the outermost div of the search panel component
 */
SearchPanelRenderer.CSS_CLASS_NAME = "search_panel";

/**
 * Create a search panel at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the search panel being created
 */
SearchPanelRenderer.createInline = function(id)
{
	// Create the outer div by writing to the document
	var e = Renderer.createInline(
		id,			// The id of the search panel being created
		false		// The search panel has an internal input element which can accept focus, so the div should not accept focus
	);

	return SearchPanelRenderer._create(e);
}

/**
 * Create a search panel in the document relative to the supplied element
 *
 * @param refElement the element relative to which the search panel should be rendered
 * @param relativePos the relative position of the search panel to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the search panel being created
 */
SearchPanelRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the search panel being created
		false			// The search panel has an internal input element which can accept focus, so the div should not accept focus
	);

	return SearchPanelRenderer._create(e);
}

/**
 * Create a search panel as a child of another HTML element
 *
 * @param p the parent element to add the search panel to
 * @param id the id of the search panel being created
 */
SearchPanelRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the search panel's outer div to it's parent element
	p.appendChild(e);

	return SearchPanelRenderer._create(e);
}

/**
 * Create the HTML elements for a search panel component
 *
 * @param e the outer DIV of the search panel component
 */
SearchPanelRenderer._create = function(e)
{
	e.className = SearchPanelRenderer.CSS_CLASS_NAME;

	var sp = new SearchPanelRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	sp._initRenderer(e);

	var spId = e.id;

	// Table for User ID input box, Court Code input box and Search button
	var table = Renderer.createElementAsChild(e, "table");
	var tBody = Renderer.createElementAsChild(table, "tbody");

	var tRow = Renderer.createElementAsChild(tBody, "tr");

	// User ID label cell
	var tCell = Renderer.createElementAsChild(tRow, "td");

	var userId = spId + "_" + SearchPanelGUIAdaptor.USER_ID;

	// Create the User ID label element
	var label = Renderer.createElementAsChild(tCell, "label");	
	label.setAttribute("for", userId);
	label.innerHTML = "User ID";

	// User ID input box cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create the User ID input box element
	var textBox = Renderer.createElementAsChild(tCell, "input");
	textBox.setAttribute("type", "text");
	textBox.setAttribute("size", "10");	
	textBox.id = userId;

	// Court code label cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	courtCodeId = spId + "_" + SearchPanelGUIAdaptor.COURT_CODE;

	// Create the Court Code label element
	label = Renderer.createElementAsChild(tCell, "label");	
	label.setAttribute("for", courtCodeId);
	label.innerHTML = "Court Code";

	// Court Code input box cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create the Court Code input box element
	textBox = Renderer.createElementAsChild(tCell, "input");
	textBox.setAttribute("type", "text");
	textBox.setAttribute("size", "4");	
	textBox.id = courtCodeId;

	// Spacing cell
	tCell = Renderer.createElementAsChild(tRow, "td");
	tCell.setAttribute("width", "25px");

	// Search button cell
	tCell = Renderer.createElementAsChild(tRow, "td");

	// Create the Search button
	var button = document.createElement("input");
	button.setAttribute("type", "button");
	button.setAttribute("value", "Search");
	button.id = spId + SearchPanelGUIAdaptor.SEARCH;
	tCell.appendChild(button);

	return sp;
}

SearchPanelRenderer.prototype.dispose = function()
{
}

SearchPanelRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, readonly, inactive)
{
}
