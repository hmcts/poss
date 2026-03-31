//==================================================================
//
// Grid.js
//
// This is the grid factory class. Unfortunately it has the sa
//
//==================================================================



function Grid()
{
}

/**
 * Create a grid component at the current location in the document while document
 * is parsing.
 *
 * @param id the id to give the newly created grid
 * @param columns an array containing the column titles or simply an integer specifying the number of columns in the grid
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @return the newly created grid
 */
Grid.createInline = function(id, columns, rows, groupSize)
{
	// Delegate to GridRenderer
	GridRenderer.createInline(id, columns, rows, groupSize);
}


/**
 * Create a grid component in the document relative to the supplied element
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
Grid.createAsInnerHTML = function(refElement, relativePos, id, columns, rows, groupSize)
{
	// Delegate to GridRenderer
	GridRenderer.createAsInnerHTML(refElement, relativePos, id, columns, rows, groupSize);
}


/**
 * Create a grid component as a child of another html element
 *
 * @param p the parent element to add the Grid to.
 * @param id the id to give the newly created Grid
 * @param columns An array of column names or simply an integer specifying the number of columns
 * @param rows the number of rows in the grid 
 * @params groupSize the number of rows grouped together using a common row styling
 * @param ac additional css classes to add to the grid?
 * @return the newly created grid
 */
Grid.createAsChild = function(p, id, columns, rows, groupSize, ac)
{
  // Delegate to GridRenderer
  return GridRenderer.createAsChild(p, id, columns, rows, groupSize, ac);
}

Grid.determineBrowser = function()
{

    switch(navigator.appName)
    {
    
	    case "Netscape":
	    {
		    Grid.isIE = false;
		    Grid.isMoz = true;
		    break;
	    }
	
	    case "Microsoft Internet Explorer":
	    {
		    Grid.isIE = true;
		    Grid.isMoz = false;
		    break;
	    }
	
	    default:
	    {
		    alert("Unknown browser type");
		    break;
	    }
	    
    }
	    
}
