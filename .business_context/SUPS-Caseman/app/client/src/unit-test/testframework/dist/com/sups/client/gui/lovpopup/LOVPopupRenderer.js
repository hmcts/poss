// Class designed to render a LOVPopup
//
// The List of Values (LOV) Popup comprises a grid
// and two buttons (Ok and Cancel)
//

// Define constructor function

function LOVPopupRenderer() {};

/**
 * LOVPopupRenderer is a sub class of Renderer
 */
LOVPopupRenderer.prototype = new Renderer();
LOVPopupRenderer.prototype.constructor = LOVPopupRenderer;

/*
*
* Define CSS class name definitions
*
*/

LOVPopupRenderer.POPUP_CSS_CLASS = "popup";
LOVPopupRenderer.LOV_POPUP_CSS_CLASS = "lovPopup popup";
LOVPopupRenderer.LOV_POPUP_TABLE_CSS_CLASS = "lovPopupTable";

/**
 * Create a List of Values (LOV) selection pop up dialog at the current location in
 * the document while document is parsing.
 *
 * @param id the id of the LOV popup being created
 * @param label the title for the LOV popup box
 * @param columns an array containing the names of the columns in the grid
 * @param rows the number of rows in the table
 * @param groupSize the number of rows shown grouped together
 * @param isFiltered flag to determine the use of a regular or filtered grid
 *
 */
LOVPopupRenderer.createInline = function(
	id,
	label,
	columns,
	rows,
	groupSize,
	isFiltered
)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the LOV popup being created
		false		// The LOV popup has an internal input element which can accept focus, so the div should not accept focus
	);

	return LOVPopupRenderer._create(e, label, columns, rows, groupSize, isFiltered);
}

/**
 * Create a List of Values (LOV) selection pop up dialog in the document relative
 * to the supplied element.
 *
 * @param refElement the element relative to which the LOV popup should be rendered
 * @param relativePos the relative position of the LOV popup to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the LOV popup being created
 * @param label the title for the LOV popup box
 * @param columns an array containing the names of the columns in the grid
 * @param rows the number of rows in the table
 * @param groupSize the number of rows shown grouped together
 * @param isFiltered flag to determine the use of a regular or filtered grid
 *
 */
LOVPopupRenderer.createAsInnerHTML = function(
	refElement,
	relativePos,
	id,
	label,
	columns,
	rows,
	groupSize,
	isFiltered
)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the LOV popup being created
		false			// The LOV popup has an internal input element which can accept focus, so the div should not accept focus
	);

	return LOVPopupRenderer._create(e, label, columns, rows, groupSize, isFiltered);
}

/**
 * Create a List of Values (LOV) selection pop up dialog as a child of another element
 *
 * @param p the parent element to which the LOV popup should be added
 * @param id the id of the LOV popup being created
 * @param label the title for the LOV popup box
 * @param columns an array containing the names of the columns in the grid
 * @param rows the number of rows in the table
 * @param groupSize the number of rows shown grouped together
 * @param isFiltered flag to determine the use of a regular or filtered grid
 *
 */
LOVPopupRenderer.createAsChild = function(
	p,
	id,
	label,
	columns,
	rows,
	groupSize,
	isFiltered
)
{
	var e = Renderer.createAsChild(id);

	// Append the LOV popup's outer div to it's parent element
	p.appendChild(e);	

	return LOVPopupRenderer._create(e, label, columns, rows, groupSize, isFiltered);
}

LOVPopupRenderer._create = function(e, label, columns, rows, groupSize, isFiltered)
{
	e.className = LOVPopupRenderer.LOV_POPUP_CSS_CLASS;

	var lov = new LOVPopupRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	lov._initRenderer(e);

	lov.m_isFiltered = isFiltered;

	var id = e.id;

    // Create a division for the popup title 
	var title = Renderer.createElementAsChild(e, "div");
	title.className = "popupTitle";
	title.innerHTML = label;

	// Create a panel division to render the grid in
	var panel = Renderer.createElementAsChild(e, "div");
	panel.className = "panel";

	// Create the grid as a child of the panel division
    var gridId = id + "_grid";
    if(isFiltered == true)
    {
	    FilteredGrid.createAsInnerHTML(panel, Renderer.CHILD_ELEMENT, gridId, columns, rows, groupSize);
    }
    else
    {
	    Grid.createAsInnerHTML(panel, Renderer.CHILD_ELEMENT, gridId, columns, rows, groupSize);
    }

	// Create the actionbar
	ActionBarRenderer.createAsChild(
		e,
		id + "_actionbar",
		[
			{id: id + "_okButton", label: "OK"},
			{id: id + "_cancelButton", label: "Cancel"}
		],
		null
	);

	return lov;
}
