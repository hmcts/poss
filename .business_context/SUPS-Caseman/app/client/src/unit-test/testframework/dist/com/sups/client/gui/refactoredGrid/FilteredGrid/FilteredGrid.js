//==================================================================
//
// FilteredGrid.js
//
// This is the filtered grid factory class. Unfortunately it has the sa
//
//==================================================================



function FilteredGrid()
{
}


FilteredGrid.CSS_CLASS_NAME = "filteredGrid";


FilteredGrid.GRID_ID_SUFFIX = "_filtered_grid";

/**
 * Create a filtered grid component at the current location in the document while document
 * is parsing.
 *
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @param ac additional css classes to add to the grid?
 * @return the newly created grid
 */
FilteredGrid.createInline = function(id, columns, rows, groupSize, ac)
{
	// Create the outer wrapper that surrounds both the grid and the column filters
	var e = Renderer.createInline(
		id,			// The id of the filtered grid being created
		true		// The filtered grid doesn't have any internal input element which can accept focus, so the div should accept focus
	);

	e.className = FilteredGrid.CSS_CLASS_NAME;

	// Create the normal grid as a child of the filtered's grid outer div
	Grid.createAsInnerHTML(e, Renderer.CHILD_ELEMENT, id + FilteredGrid.GRID_ID_SUFFIX, columns, rows, groupSize);

	// Create the filtered area...
	FilteredGrid._create(e, id, columns, rows, groupSize, ac);
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
FilteredGrid.createAsInnerHTML = function(refElement, relativePos, id, columns, rows, groupSize)
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
	FilteredGrid._create(e, id, columns, rows, groupSize, null);
}

/**
 * Create a grid component as a child of another html element
 *
 * NOTE: THERE IS A DEFECT ASSOCIATED WITH THIS METHOD ON INTERNET EXPLORER.
 *  On IE it is not possible to set the tabindex in any other way but directly
 *  in the HTML. Unfortunately tabindex _must_ be set inorder for the
 *  element to be able to accept the focus as a result of a element.focus()
 *  call. 
 *
 * @param p the parent element to add the Grid to.
 * @param id the id to give the newly created Grid
 * @param columns An array of column names or simply an integer specifying the number of columns
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @param ac additional css classes to add to the grid?
 * @return the newly created grid
 */
FilteredGrid.createAsChild = function(p, id, columns, rows, groupSize, ac)
{
	// Create the outer wrapper that surrounds both the grid and the column filters
	var e = Renderer.createAsChild(id);
	
	e.className = FilteredGrid.CSS_CLASS_NAME;

	// Call the normal grid rendering class
	Grid.createAsChild(e, id + FilteredGrid.GRID_ID_SUFFIX, columns, rows, groupSize, ac);

	// Create the filter area...
	FilteredGrid._create(e, id, columns, rows, groupSize, ac);

	// Append the grid's outer div to it's parent element
	p.appendChild(e);
}


FilteredGrid._create = function(e, id, columns, rows, groupSize, ac)
{
	// Create the filter fields underneath the grid
    var filterDiv = document.createElement("div");
    e.appendChild(filterDiv);

    var gridFilterContainer = document.createElement("div");
    gridFilterContainer.className = "grid_filter";
    filterDiv.appendChild(gridFilterContainer);

    var gridFilterRow = document.createElement("div");
    //gridFilterRow.className = "grid_filter_row";
    gridFilterContainer.appendChild(gridFilterRow);

	// Interrogate columns argument to determine whether
	// it contains an array of column headers or just
	// the number of columns required.
	var columnHeadersRequired = false;
	if((typeof columns == "object") && (columns.constructor == Array))
	{
	    columnHeadersRequired = true;
	}
	else if(typeof columns == "number")
	{
	    if(columns != parseInt( columns.toString()))
	    {
	        // Input argument is not an integer value
	        throw new ConfigurationException( "Grid argument columns must be an integer value." );
	    }	    
	    else
	    {
	        // Input argument is an integer
	        if(columns <= 0)
	        {
	            throw new ConfigurationException( "Number of columns in grid should be greater than zero." );
	        }
	    }
	}
	else
	{
	    throw new ConfigurationException( "Grid columns argument must contain an array of column names or the number of columns only." );
	}
	// Store number of columns required
	var numberOfColumns;
	if(columnHeadersRequired)
	{
	    numberOfColumns = columns.length;
	}
	else
	{
	    numberOfColumns = columns;
	}

	// Create columns
	for(var i = 0 ; i < numberOfColumns; i++)
	{
	    var inputElement = document.createElement("input");
	    var inputId = id + "_column_filter_col" + i;
	    inputElement.id = inputId;
		var cN = "grid_filter_cell col" + i;
	    inputElement.className = cN;
	    gridFilterRow.appendChild(inputElement);
	}
}
