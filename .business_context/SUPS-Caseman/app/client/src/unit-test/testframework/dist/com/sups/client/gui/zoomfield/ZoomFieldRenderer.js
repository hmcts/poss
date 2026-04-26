//==================================================================
//
// ZoomFieldRenderer.js
//
// Implementation of ZoomField rendering class. Creates a field with
// a button next to it that raises a popup containing an enlarged
// text area and ok/cancel buttons.
//
//==================================================================



/**
 * ZoomFieldRenderer constructor - never used. Use factory methods
 * below to either render an ZoomField into an HTML page, or create
 * an ZoomField as a child of another element
 *
 * @private
 * @constructor
 */
function ZoomFieldRenderer()
{
}


/**
 * ZoomFieldRenderer is a sub class of Renderer
 */
ZoomFieldRenderer.prototype = new Renderer();
ZoomFieldRenderer.prototype.constructor = ZoomFieldRenderer;


/**
 * Logging category for the ZoomFieldRenderer
 *
 * @type Category
 * @private
 */
ZoomFieldRenderer.m_logger = new Category("ZoomFieldRenderer");


/**
 * Position of the bottom of any menu bar on the form
 *
 * @type Category
 * @private
 */
ZoomFieldRenderer.m_menuBarBottom = null;


/**
 * Default number of rows in the expanded text area
 *
 * @type Integer
 */
ZoomFieldRenderer.DEFAULT_NO_ROWS = 20;


/**
 * Default number of columns in the expanded text area
 *
 * @type Integer
 */
ZoomFieldRenderer.DEFAULT_NO_COLS = 80;


/**
 * CSS Class name of the outermost div of the zoom field
 *
 * @type String
 */
ZoomFieldRenderer.CSS_CLASS_NAME = "zoom_field";

ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME = "zoomfield_container";


/*
 * Create a zoom field at the current location in the document while document
 * is parsing.
 *
 * @param id the id of the zoom field being created
 * @param r the number of rows in the zoom field text area
 * @param c the number of columns in the zoom field text area
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 */
ZoomFieldRenderer.createInline = function(id, r, c, multiline)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the zoom field being created
		false		// The zoom field has an internal input element which can accept focus, so the div should not accept focus
	);

	return ZoomFieldRenderer._create(e, r, c, multiline);
}


/**
 * Create a zoom field in the document relative to the supplied element
 *
 * @param refElement the element relative to which the zoom field should be rendered
 * @param relativePos the relative position of the zoom field to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the zoom field being created
 * @param r the number of rows in the zoom field text area
 * @param c the number of columns in the zoom field text area
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 */
ZoomFieldRenderer.createAsInnerHTML = function(refElement, relativePos, id, r, c, multiline)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the zoom field being created
		false			// The zoom field has an internal input element which can accept focus, so the div should not accept focus
	);
	
	return ZoomFieldRenderer._create(e, r, c, multiline);
}


/**
 * Create a zoom field as a child of another element
 *
 * @param id the id of the zoom field being created
 * @param r the number of rows in the zoom field text area
 * @param c the number of columns in the zoom field text area
 * @param multiline determines what the input field is rendered as
 *        If true it is rendered as a text area otherwise as a text input box
 */
ZoomFieldRenderer.createAsChild = function(p, id, r, c, multiline)
{
	var e = Renderer.createAsChild(id);

	// Append the zoom field's outer div to it's parent element
	p.appendChild(e);	
	
	return ZoomFieldRenderer._create(e, r, c, multiline);
}


ZoomFieldRenderer._create = function(e, r, c, multiline)
{
	e.className = ZoomFieldRenderer.CSS_CLASS_NAME;

	var f = new ZoomFieldRenderer();

	// Initialise sets main element and the reference to the renderer in the dom
	f._initRenderer(e);	

	var zoomId = e.id;

	// Default the number of rows in the expanded text area, if value not supplied
	if(null == r)
	{
		r = ZoomFieldRenderer.DEFAULT_NO_ROWS;
	}
	
	// Default the number of columns in the expanded text area, if value not supplied
	if(null == c)
	{
		c = ZoomFieldRenderer.DEFAULT_NO_COLS;
	}
	
	// Require a container div whose CSS position attribute is
	// set to relative so that we can position the popup relative
	// to it. We can't use the outer div for this, because otherwise
	// the 
	var container = document.createElement("div");
	container.className = ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME;
	e.appendChild(container);

	// Default to single line input box if multiline not defined
	f.m_multiline = (null == multiline) ? false : multiline;

	f.m_buttonField = ButtonFieldRenderer.createAsChild(container, f.m_multiline);
	
	// Create popup
	f.m_popup = PopupRenderer.createAsChild(
		container, 
		zoomId + "_popup",
		[
			{id: zoomId + "_ok", label: "OK"},
			{id: zoomId + "_cancel", label: "Cancel"}
		]
	);	

	var popupContentsElement = f.m_popup.getContentsContainerElement();
	var panel = document.createElement("div");
	panel.className = "panel";
	popupContentsElement.appendChild(panel);

	// Create the textarea element
	f.m_textarea = document.createElement("textarea");
	f.m_textarea.setAttribute("rows", r);
	f.m_textarea.setAttribute("cols", c);
	f.m_textarea.setAttribute("wrap", "soft");
	f.m_textarea.id = zoomId + "_textarea";
	panel.appendChild(f.m_textarea);

	f.startEventHandlers();

	return f;
}


ZoomFieldRenderer.prototype.dispose = function()
{
	this.m_buttonField.dispose();
}


ZoomFieldRenderer.prototype.startEventHandlers = function()
{
	this.m_buttonField.startEventHandlers();
}


ZoomFieldRenderer.prototype.stopEventHandlers = function()
{
	this.m_buttonField.stopEventHandlers();
}


ZoomFieldRenderer.prototype.positionPopup = function()
{
	var p = this.m_popup.getElement();
	var zf = p.parentNode;

	// Get the popup height and width
	var ph = p.offsetHeight;
	var pw = p.offsetWidth;
	
	// Get the field height and width
	var zfh = zf.offsetHeight;
	var zfw = zf.offsetWidth;
	
	// Get the document relative position of the container
	var zfPos = getAbsolutePosition(zf);
	
	// Get the <html> tag for the document in which this DropDownField exists
	var docEl = zf.ownerDocument.documentElement;

	var windowHeight = 
		window.innerHeight != null
		? window.innerHeight			// W3C
		: docEl.clientHeight;			// IE
				
	var windowWidth =
		window.innerWidth != null
		? window.innerWidth				// W3C
		: docEl.clientWidth;			// IE

	var scrollY =
		window.scrollY != null
		? window.scrollY				// W3C
		: docEl.scrollTop;				// IE

	var scrollX =
		window.scrollX != null
		? window.scrollX				// W3C
		: docEl.scrollLeft;				// IE
	
	// Determine the popup's left border width
	var borderStyle = getCalculatedStyle(p);
	
	var borderLeftWidth = borderStyle.borderLeftWidth.slice(0, -2);
    // If stylesheet hasn't loaded then this will be "medium", if so default to 2px
    borderLeftWidth = isNaN(borderLeftWidth) ? 2 : Number(borderLeftWidth);
    
	if(null == ZoomFieldRenderer.m_menuBarBottom)
	{
		// Determine the position of the bottom of any menu bar	on the form	
		var divs = docEl.getElementsByTagName("DIV");
		
		ZoomFieldRenderer.m_menuBarBottom = 0;
		
		for(var i = 0, l = divs.length; i < l; i++)
		{
			var div = divs[i];
			
			if(div.className == MenuBarRenderer.MENU_BASE_DIV)
			{
				// Get the document relative position of the menu bar div
				var mbPos = getAbsolutePosition(div);
			    ZoomFieldRenderer.m_menuBarBottom = mbPos.top + div.offsetHeight;
			    
				// Assumes that there is only ever one menu bar per form
				break;
			}
		}
	}
	
	// Document relative position of the top of the drop down, if it
	// were positioned below the container
	var bottomOfPopupBelow = zfPos.top + zfh + ph;
	
	// Determine position of popup - by default popup will be positioned below
	// the field with the left hand borders aligned, however available screen space
	// may mean that this is not possible and an alternative postion will be
	// calculated.
	var popupTop = null;
	
	if(bottomOfPopupBelow <= (windowHeight + scrollY))
	{
		// Not clipped when positioned below, so let's do that
		popupTop = zfh;
	}
	else
	{
		// Get the document relative position of the container
		var zfPos = getAbsolutePosition(zf);
		
		// Document relative position of the top of the popup if it
		// were positioned above the container
		var topOfPopupAbove = ZoomFieldRenderer.m_menuBarBottom + ph;
		
		if(topOfPopupAbove <= (zfPos.top - scrollY))
		{
			// Not clipped when positioned above, so let's do that
			popupTop = p.offsetHeight;
		}
		else
		{
			// Determine the popup's top and bottom border widths
			var borderTopWidth = borderStyle.borderTopWidth.slice(0, -2);
			// If stylesheet hasn't loaded then this will be "medium", if so default to 2px
			borderTopWidth = isNaN(borderTopWidth) ? 2 : Number(borderTopWidth);
			
			var borderBottomWidth = borderStyle.borderBottomWidth.slice(0, -2);
			// If stylesheet hasn't loaded then this will be "medium", if so default to 2px
			borderBottomWidth = isNaN(borderBottomWidth) ? 2 : Number(borderBottomWidth);
			
			// Add the borders to the overall popup height
			ph += (borderTopWidth + borderBottomWidth);
			
			// Centre the popup vertically about the zoom field's centre
			popupTop = (ph - zfh) / 2;
			
			// Check again for top and bottom clipping
			bottomOfPopupBelow = zfPos.top + zfh + popupTop;
			topOfPopupAbove = zfPos.top - popupTop;

			if(bottomOfPopupBelow > (windowHeight + scrollY) || topOfPopupAbove < ZoomFieldRenderer.m_menuBarBottom)
			{
				// Clipped top or bottom, so position the popup in the centre of the form
				var gap = (windowHeight + scrollY - ph) / 2;
				popupTop = zfPos.top - gap - (ZoomFieldRenderer.m_menuBarBottom / 2);
			}
		}
		
		popupTop = -popupTop;
	}
	
	// Determine the horizontal positioning. By default we align the left hand
	// edges of the zoom field and the popup, but space may dictate that we
	// slide the popup left relative to the zoomfield to avoid clipping the
	// right hand edge.
	var popupLeft = -borderLeftWidth;
	
	// Calculate the gap between the right hand edge of the popup and the right
	// hand edge of its containing frame.
	var gapToRight = scrollX + windowWidth - (zfPos.left + pw);

	// If the gapToRight is negative, it indicates that popup right hand side
	// will be clipped by gapToRight pixels, so shift the popup left by gapToRight
	// pixels to compensate.
	if(gapToRight < 0)
	{
		popupLeft += gapToRight;
	}
	
	// Set the position of the popup div - remember this is relative to the
	// zoomfield element, as it has position: relative set in the .css file.
	p.style.top = popupTop + "px";
	p.style.left = popupLeft + "px";
	
	zf.className = 	ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME + " raised";
}


ZoomFieldRenderer.prototype.lowerPopup = function()
{
	this.m_popup.getElement().parentNode.className = ZoomFieldRenderer.CONTAINER_CSS_CLASS_NAME;
}


ZoomFieldRenderer.prototype.getTextArea = function()
{
	return this.m_textarea;
}


ZoomFieldRenderer.prototype.render = function(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive)
{
	this.m_buttonField.render(disabled, focussed, mandatory, invalid, serverInvalid, readonly, inactive, isServerValidationActive);
}

ZoomFieldRenderer.prototype._setAdaptor = function(adaptor)
{
	this.m_buttonField.m_framedField.m_guiAdaptor = adaptor;
}

ZoomFieldRenderer.prototype.getInputField = function()
{
	return this.m_buttonField.m_framedField.m_inputField;
}


ZoomFieldRenderer.prototype.getPopupButton = function()
{
	return this.m_buttonField.m_button;
}

ZoomFieldRenderer.prototype.getMultiline = function()
{
	return this.m_multiline;
}
