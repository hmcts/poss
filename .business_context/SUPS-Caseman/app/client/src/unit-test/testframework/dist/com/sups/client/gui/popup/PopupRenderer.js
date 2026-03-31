//==================================================================
//
// PopupRenderer.js
//
// Class which renders outline for a popup
//
//==================================================================


/**
 * PopupRenderer constructor - never used. Use factory methods
 * below to either render a Popup into an HTML page, or create
 * a popup as a child of another element
 *
 * @private
 * @constructor
 */
function PopupRenderer()
{
}


/**
 * PopupRenderer is a sub class of Renderer
 */
PopupRenderer.prototype = new Renderer();
PopupRenderer.prototype.constructor = PopupRenderer;


/**
 * The CSS Classname of the outer div element of a popup
 *
 * @type String
 */
PopupRenderer.CSS_CLASS_NAME = "popup";
PopupRenderer.CSS_CLASS_NAME_FULLPAGE = "popup popup_fullscreen";



PopupRenderer.createAsChild = function(p, id, buttons, title)
{
	var popup = Renderer.createAsChild(id);
	
	var pr = PopupRenderer._create(popup, buttons, title);
	
	p.appendChild(popup);
	
	return pr;
}

PopupRenderer._create = function(p, buttons, title)
{
	var pr = new PopupRenderer();
	
	// Need to keep hold of reference to popup div so it can be raised and lowered.
	pr._setElement(p);
	
	p.className = PopupRenderer.CSS_CLASS_NAME;
	
	// Add a table, so that popup shrinkwraps around its content
	var table = Renderer.createElementAsChild(p, "table");
	table.setAttribute("cellspacing", "0px");
	table.setAttribute("cellpadding", "0px");
	table.className = "popup_layout";
	
	var tbody = Renderer.createElementAsChild(table, "tbody");	
	
	if(null != title)
	{
		var titleRow = Renderer.createElementAsChild(tbody, "tr");
		var titleCell = Renderer.createElementAsChild(titleRow, "td");
		pr.m_titleContainer = Renderer.createElementAsChild(titleCell, "div");
		pr.m_titleContainer.className = "popupTitle";
		pr.m_titleContainer.innerHTML = title;
	}
	
	var contentsRow = Renderer.createElementAsChild(tbody, "tr");
	
	// Create td element which contains the popup's contents
	pr.m_container = Renderer.createElementAsChild(contentsRow, "td");
	pr.m_container.className = "popup_contents";
	
	var actionBarRow = Renderer.createElementAsChild(tbody, "tr");
	var actionBarCell = Renderer.createElementAsChild(actionBarRow, "td");
	actionBarCell.className = "actionbar_container";
	
	// Create the actionbar
	pr.m_actionBar = ActionBarRenderer.createAsChild(
		actionBarCell,
		p.id + "_actionbar",
		buttons
	);
	
	return pr;
}


/**
 * Get the HTML element which contains the popup's contents
 *
 * @return the HTML element which contains the popup's contents.
 * @type HTMLTDElement
 */
PopupRenderer.prototype.getContentsContainerElement = function()
{
	return this.m_container;
}


/**
 * Get the ActionBarRenderer for the popup
 *
 * @return the ActionBarRenderer for the popup
 * @type ActionBarRenderer
 */
PopupRenderer.prototype.getActionBarRenderer = function()
{
	return this.m_actionBar;
}


/**
 * Get the HTML element which contains the popup's title bar contents
 *
 * @return the HTML element which contains the popup's title bar contents.
 * @type HTMLTDElement
 */
PopupRenderer.prototype.getTitleBarContainer = function()
{
	return this.m_titleContainer;
}