//==================================================================
//
// Renderer.js
//
// Base class for Renderers.
//
//==================================================================



/**
 * Renderer constructor - never used. Use factory methods of
 * derived classes to create instances of component views
 * 
 * @private
 * @constructor
 */
function Renderer()
{
}

/**
 * Define class constants
 *
 * Constants used to define relationship of div to be created
*/
Renderer.CHILD_ELEMENT  = 0;
Renderer.BEFORE_ELEMENT = 1;
Renderer.AFTER_ELEMENT  = 2;


/**
 * Reference to the main (outermost) div element contains the component
 * and defines its type by virtue of its CSS class name
 *
 * @private
 */
Renderer.prototype.m_element = null;


/**
 * Create the outer div of a component as a child of another element. Note this
 * method does not append the element to any parent element - this is the
 * responsiblity of the caller.
 *
 * @param id the id of the component being created must not be null or empty string
 * @return the newly created div element
 * @type HTMLDivElement
 * @throws ConfigurationException if id is null on empty string
 */
Renderer.createAsChild = function(id)
{
	if(null == id || "" == id)
	{
		throw new ConfigurationException("Must supply id to Renderer.createAsChild");
	}
	
	// All framework components which are not standard HTML controls
	// must be surrounded by an outer div and must have a unique id
	var e = window.document.createElement("div");
	e.id = id;
	
	return e;
}


/**
 * Render the outer div of a component at the current end of the document. If invoked
 * as an inline JavaScript function in an HTML document, the div will be written immediately
 * after the script tag which contained the call to createInline method.
 *
 * @param id the id of the component being created must not be null or empty string
 * @return the newly created div element
 * @type HTMLDivElement
 * @throws ConfigurationException if id is null on empty string
 */
Renderer.createInline = function(id, focusable)
{
	if(null == id || "" == id)
	{
		throw new ConfigurationException("Must supply id to Renderer.createInline");
	}
	
	var divHTML = "<div id='" + id + "'";
	if(true == focusable)
	{
		divHTML += " tabindex='1' hideFocus='true'";
	}
	divHTML += "></div>";
	
	var d = window.document;
	
	// Write the outer element to the document
	d.write(divHTML);

	// Get the element using its id
	var e = d.getElementById(id);
	
	return e;
}

/*

Renderer.createAsInnerHTML = function(afterElement, id, focussable)
{
	if(null == id || "" == id)
	{
		throw new ConfigurationException("Must supply id to Renderer.createInline");
	}

	// Create a wrapper div to temporarily contain the rendered element
	var wrapper = window.document.createElement("div");
                       
	wrapper.innerHTML = ("<div id='" + id + "' tabIndex='1' hideFocus='true'></div>");

	// Get the inner \<div\> element and remove it from the temporary wrapper
	var innerDiv = wrapper.childNodes[0];
	wrapper.removeChild(innerDiv);
  
	var nodeAfterElement = afterElement.nextSibling;

	// Insert innerDiv into  document immediately after the script tag to simulate what happens
	// when a normal renderer.createInline() is executed
	if (null == nodeAfterElement)
	{
		afterElement.parentNode.appendChild(innerDiv);
	}
	else
	{
		afterElement.parentNode.insertBefore(innerDiv, nodeAfterElement)
	}
	
	// Return the inner div which will contain the rest of the component
	return innerDiv;
}

*/

/**
 * Method creates the outer div for a component positioned relative to a
 * specified HTML element using the "innerHTML" method.
 *
 * @param refElement  The HTML element relative to which the new div will
 *                    be positioned
 * @param relativePos An integer value specifying the relationship between
 *                    the new div and the element "refElement". Valid values
 *                    are:
 *
 *                    Renderer.CHILD_ELEMENT    Create div as child of "refElement"
 *                    Renderer.BEFORE_ELEMENT   Div is created as preceeding sibling of "refElement"
 *                    Renderer.AFTER_ELEMENT    Div is created as following sibling of "refElement"
 * @param id     The identifier for the new element
 * @param focusable If "true" use framework focussing mechanism
 *
 * @return Returns the new element
 *
*/
Renderer.createAsInnerHTML = function(refElement, relativePos, id, focussable)
{
	if(null == id || "" == id)
	{
		throw new ConfigurationException("Must supply id to Renderer.createInline");
	}

	// Create a wrapper div to temporarily contain the rendered element
	var wrapper = window.document.createElement("div");
	
	var divHTML = "<div id='" + id + "'";
	
	if(focussable == true)
	{
	    divHTML += " tabindex='1'  hideFocus='true'";
	}
	
	divHTML += "></div>";
                       
	wrapper.innerHTML = (divHTML);

	// Get the inner \<div\> element and remove it from the temporary wrapper
	var innerDiv = wrapper.childNodes[0];
	wrapper.removeChild(innerDiv);
	
	// Add innerDiv to document with appropriate relationship
	// to refElement
	
	switch (relativePos)
	{
	
	    case Renderer.CHILD_ELEMENT:
	    
	        refElement.appendChild( innerDiv );
	        break;
	        
	    case Renderer.BEFORE_ELEMENT:
	    
	        refElement.parentNode.insertBefore( innerDiv, refElement );
	        break;
	        
	    case Renderer.AFTER_ELEMENT:
	    
	        var nodeAfterElement = refElement.nextSibling;
	        if(null == nodeAfterElement)
	        {
	            refElement.parentNode.appendChild(innerDiv);
	        }
	        else
	        {
	            refElement.parentNode.insertBefore( innerDiv, nodeAfterElement );
	        }
	        break;
	        
	    default:
	        break;
	            
	}
	
	// Return the inner div which will contain the rest of the component
	return innerDiv;
}


/**
 * Create a new element in the current document and append it to the supplied parent
 * element.
 *
 * @param p the parent HTMLElement
 * @param nodeName the type of element to create supplied a string. e.g. "div"
 * @return the newly created HTMLElement
 * @type HTMLElement
 */
Renderer.createElementAsChild = function(p, nodeName)
{
	var n = window.document.createElement(nodeName);
	p.appendChild(n);
	
	return n;
}

/**
 * Method creates a new div element as a child of the specified
 * parent element. This method is rather unusual, but it allows
 * the creation of divs after a page has loaded.
 *
 * @param parent The parent element
 * @param id     The identifier for the new element
 * @param focusable If "true" use framework focusiing mechanism
 *
 * @return Returns the new element
 *
*/

Renderer.createAsInnerHtml = function(parent, id, focusable)
{
    // Append script tag to parent
    var scriptTag = document.createElement( "script" );
    parent.appendChild(scriptTag);
      
    // Produce an anonymous function that as a wrapper around the script tag
                     
    var scriptText = "Renderer.createDivisionUsingInnerHTML('" +
                     id +
                     "',this.arguments[0],this.arguments[1]);";
                     
    var fn = new Function(scriptText);

    // Invoke the renderer function
    fn.call(fn, scriptTag, focusable);
    
    // Locate reference to new node
    var nodeChild = null;
    var e = null;
    
    var nodeChildren = parent.childNodes;
    
    for(var i = 0, l = nodeChildren.length; i < l; i++)
    {
    	nodeChild = nodeChildren[i];
    	
    	if(nodeChild.id == id)
    	{
            e = nodeChild;
            break;
        }
    }
    	
    return e;

}

/**
 * Create new element as sibling of script element. This method is
 * invoked by the method createAsInnerHtml in order to create
 * a element using the innerHTML property.
 *
 * @param id The identifier to be assigned to the new element
 * @param scriptTag The script tag to be associated with the new element
 *
*/

Renderer.createDivisionUsingInnerHTML = function(id, scriptTag, focusable)
{
    
    // Create a wrapper div to temporarily contain the rendered element
    var wrapper = document.createElement("div");
    
    var divHTML = "<div id='" + id + "'";
    
	if(true == focusable)
	{
		divHTML += " tabindex='1' hideFocus='true'";
		//divHTML += " tabindex='1'";
	}
	divHTML += "></div>";
                           
    wrapper.innerHTML = (divHTML);

    // Get the inner \<div\> element and remove it from the temporary wrapper
    var innerDiv = wrapper.childNodes[0];
    wrapper.removeChild(innerDiv);
      
    var nodeAfterScriptTag = scriptTag.nextSibling;

    // Insert innerDiv into  document immediately after the script tag to simulate what happens
    // when a normal renderer.createInline() is executed
    if (null == nodeAfterScriptTag)
    {
        scriptTag.parentNode.appendChild(innerDiv);
    }
    else
    {
        scriptTag.parentNode.insertBefore(innerDiv, nodeAfterScriptTag)
    }
          
}


/**
 * Get the main (outermost) div element of the component.
 *
 * @return the main (outermost) div element of the component
 * @type HTMLDivElement
 */
Renderer.prototype.getElement = function()
{
	return this.m_element;
}


/**
 * Set the main (outermost) div element of the component.
 *
 * @private
 * @param e the main (outermost) div element of the component
 */
Renderer.prototype._setElement = function(e)
{
	this.m_element = e;
}


/**
 * Set the main (outermost) div element of the component and
 * also write __renderer reference back to this renderer, so
 * that GUIAdaptors can locate this Renderer.
 */
Renderer.prototype._initRenderer = function(e)
{
	this.m_element = e;
	e.__renderer = this;
}
