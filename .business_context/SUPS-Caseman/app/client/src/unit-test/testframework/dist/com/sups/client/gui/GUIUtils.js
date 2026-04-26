//==================================================================
//
// GUIUtils.js
//
// Contains general definitions and utility functions
//
//==================================================================


function GUIUtils() {}

GUIUtils.INVALID_CSS_CLASS_NAME = "invalid";
GUIUtils.MANDATORY_CSS_CLASS = "mandatory";
GUIUtils.READONLY_CSS_CLASS = "readOnly";

// Determines whether the adaptor should be rendered again.
// Returns true if either the render state has changed or
// it cannot be determined because it does not implement 
// the correct protocols.
// param: adaptor - the GUIAdaptor being rendered
// param: oldRenderState - boolean, true if the adaptor was rendered "on" last time.
// returns: boolean
function renderStateChanged (adaptor, oldRenderState)
{
    var renderState = true;
    
    if (adaptor.supportsProtocol("EnablementProtocol") && !adaptor.getEnabled())
    {
       renderState = false;
    }
    
    if (adaptor.supportsProtocol("ActiveProtocol") && !adaptor.isActive())
    {
       renderState = false;
    }
    
    if (renderState != oldRenderState)
    {
       return true;
    }
    
    return false;
}


GUIUtils.getDocumentHeadElement = function(d)
{
	var headElement = null;
	var headElements = d.getElementsByTagName("HEAD")
	
	if(0 == headElements.length)
	{
		var htmlElement = d.getElementsByTagName("HTML");
		
		if(null == htmlElement) throw new Error("Unable to locate HTML element in document", null);

		headElement = d.createElement("HEAD");
		htmlElement.appendChild(headElement);
	}
	else
	{
		// Assume there is only one HEAD element which is reasonable for Valid HTML 4.0.1 docs
		headElement = headElements[0];
	}
	
	return headElement;
}

/**
 * For defect 355 added optional capability to set onLoad handler on link.
 * This is required by IE when loading of style sheets is delayed.
 *
*/
GUIUtils.createStyleLinkElement = function(headElement, url, id)
{
	var d = headElement.ownerDocument;
	
	var link = d.createElement("LINK");
	if(null != id && "" != id)
	{
		link.setAttribute("id", StyleManager.FRAMEWORK_STYLESHEET_ID);
	}
	link.setAttribute("rel", "stylesheet");
	link.setAttribute("type", "text/css");
	link.setAttribute("title", StyleManager.FRAMEWORK_STYLESHEET_TITLE);
	link.setAttribute("href", url);
	
	headElement.appendChild(link);	
	
	return link;
}