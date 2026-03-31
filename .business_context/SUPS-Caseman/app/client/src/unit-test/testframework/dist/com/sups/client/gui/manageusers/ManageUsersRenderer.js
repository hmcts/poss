//==================================================================
//
// ManageUsersRenderer.js
//
// Implementation of ManageUsers rendering class.
//
//==================================================================


/**
 * ManageUsersRenderer constructor - never used. Use factory methods
 * below to either render an ManageUsers into an HTML page, or create
 * an ManageUsers as a child of another element
 *
 * @private
 * @constructor
 */
function ManageUsersRenderer() {}

/**
 * ManageUsersRenderer is a sub class of Renderer
 */
ManageUsersRenderer.prototype = new Renderer();

/**
 * Set the constructor property so we can identify the type
 */
ManageUsersRenderer.prototype.constructor = ManageUsersRenderer;

/**
 * Logging category for the ManageUsersRenderer class
 *
 * @type Category
 * @private
 */
ManageUsersRenderer.m_logger = new Category("ManageUsersRenderer");

/**
 * CSS Class name of the outermost div of the manage users component
 */
ManageUsersRenderer.CSS_CLASS_NAME = "manage_users";

/**
 * Search and Edit Panel identifiers
 */
ManageUsersRenderer.SEARCH_PANEL = "_spPanel";
ManageUsersRenderer.EDIT_PANEL = "_epPanel";
ManageUsersRenderer.SP_ADAPTOR = "_spAdaptor";
ManageUsersRenderer.EP_ADAPTOR = "_epAdaptor";

/*
 * Create a manage users component at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the manage users being created
 */
ManageUsersRenderer.createInline = function(id)
{
	// Create the outer div by writing to the document
	var e = Renderer.createInline(
		id,			// The id of the manage users being created
		false		// The manage users has an internal input element which can accept focus, so the div should not accept focus
	);

	return ManageUsersRenderer._create(e);
}

/**
 * Create a manage users component in the document relative to the supplied element
 *
 * @param refElement the element relative to which the manage users should be rendered
 * @param relativePos the relative position of the manage users to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the manage users being created
 */
ManageUsersRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the manage users being created
		false			// The manage users has an internal input element which can accept focus, so the div should not accept focus
	);

	return ManageUsersRenderer._create(e);
}

/**
 * Create a manage users component as a child of another HTML element
 *
 * @param p the parent element to add the manage users component to
 * @param id the id of the manage users being created
 */
ManageUsersRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the manage users's outer div to it's parent element
	p.appendChild(e);	
	
	return ManageUsersRenderer._create(e);
}

/**
 * Create the HTML elements for a manage users component
 *
 * @param e the outer DIV of the manage users component
 */
ManageUsersRenderer._create = function(e)
{
	e.className = ManageUsersRenderer.CSS_CLASS_NAME;

	var mu = new ManageUsersRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	mu._initRenderer(e);	

	var muId = e.id;
	
	// Render the Search Panel components in a centre aligned panel
	var panel = Renderer.createElementAsChild(e, "div");
	panel.className = PanelGUIAdaptor.CSS_CLASS_NAME;
	panel.setAttribute("align", "center");
	panel.id = muId + ManageUsersRenderer.SEARCH_PANEL;

	SearchPanelRenderer.createAsChild(panel, muId + ManageUsersRenderer.SP_ADAPTOR);

	// Render the Edit Panel components in a centre aligned panel
	panel = Renderer.createElementAsChild(e, "div");
	panel.className = PanelGUIAdaptor.CSS_CLASS_NAME;
	panel.setAttribute("align", "center");
	panel.id = muId + ManageUsersRenderer.EDIT_PANEL;

	EditPanelRenderer.createAsChild(panel, muId + ManageUsersRenderer.EP_ADAPTOR);

	// Create the Save and Close button in an action bar
	ActionBarRenderer.createAsChild(
		e,
		muId + "_actionbar",
		[
			{id: muId + ManageUsersGUIAdaptor.SAVE, label: "Save"},
			{id: muId + ManageUsersGUIAdaptor.CLOSE, label: "Close"}
		],
		"status_line"
	);

	return mu;
}

ManageUsersRenderer.prototype.dispose = function()
{
}

ManageUsersRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, readonly, inactive)
{
}
