//==================================================================
//
// LabelledGrid.js
//
// This is the filtered grid factory class. Unfortunately it has the sa
//
//==================================================================



function LabelledGrid()
{
}

LabelledGrid.CSS_CLASS_NAME = "LabelledGrid";

/**
 * Create a labelled grid component at the current position in the HTML document
 *
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @return the newly created grid
 */
LabelledGrid.createInline = function(id, columns, rows, groupSize, ac)
{
	// create the outer wrapper that surrounds both the grid and the column filters
	var outerWrapperElementId = (id + "_labelled_grid");
	document.write("<div id='" + outerWrapperElementId + "' hideFocus='true' class='" + LabelledGrid.CSS_CLASS_NAME + "'></div>");

	// Get the element using its id
	var e = document.getElementById(outerWrapperElementId);
	
	LabelledGrid._create(e, id, columns, rows, groupSize, ac);
}

/**
 * Create a grid as a child of another html element
 *
 * @param p the parent element to add the Grid to.
 * @param id the id to give the newly created Grid
 * @param columns An array of column names or simply an integer specifying the number of columns
 * @param ac additional css classes to add to the grid?
 * @return the newly created grid
 */
LabelledGrid.createAsChild = function(p, id, columns, rows, groupSize, ac)
{
	// create the outer wrapper that surrounds both the grid and the column filters
	var outerWrapperElementId = (id + "_labelled_grid");
	var e = document.createElement("div");
	e.id = outerWrapperElementId;
	e.className = LabelledGrid.CSS_CLASS_NAME;

	LabelledGrid._create(e, id, columns, rows, groupSize, ac);

	// Append the grid to it's parent element
	p.appendChild(e);
}

/**
 * Create a filtered grid component in the document relative to the supplied element
 *
 * @param refElement the element relative to which the grid should be rendered
 * @param relativePos the relative position of the grid to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @return the newly created grid
 */
LabelledGrid.createAsInnerHTML = function(refElement, relativePos, id, columns, rows, groupSize)
{
	// Create the outer wrapper that surrounds both the grid and the column filters
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the grid being created
		true			// The grid does not have an internal input element that can accept focus, so the div itself needs to be able to accept focus
	);
	
	e.className = FilteredGrid.CSS_CLASS_NAME;

	// Create the normal grid as a child of the filtered's grid outer div
	Grid.createAsInnerHTML(e, Renderer.CHILD_ELEMENT, id + FilteredGrid.GRID_ID_SUFFIX, columns, rows, groupSize);

	// Create the filter area...
	LabelledGrid._create(e, id, columns, rows, groupSize, null);
}

LabelledGrid._create = function(e, id, columns, rows, groupSize, ac)
{
	var gridDiv = document.createElement("div");
	e.appendChild(gridDiv);
	
	// Call the normal grid rendering class
	Grid.createAsChild(gridDiv, id, columns, rows, groupSize, ac);
	
	// Create the filter fields underneath the grid
    var labelDiv = document.createElement("div");
    e.appendChild(labelDiv);

    var inputElement = document.createElement("input");
    var inputId = id + "_label";
    inputElement.id = inputId;
	var cN = "grid_label readOnly";
    inputElement.className = cN;
    labelDiv.appendChild(inputElement);
}
