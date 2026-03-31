//==================================================================
//
// StandardDialogRenderer.js
//
// Renders HTML for Standard Prompt Dialogs that display a message and
// allow the user to select between available options by clicking
// on one of the buttons on the Popup's ActionBar.
//
//==================================================================


function StandardDialogRenderer()
{
}


/**
 * StandardDialogRenderer is a sub class of Renderer
 */
StandardDialogRenderer.prototype = new Renderer();
StandardDialogRenderer.prototype.constructor = StandardDialogRenderer;


/**
 * CSS Class name of the outermost div of the standard dialog
 */
StandardDialogRenderer.CSS_CLASS_NAME = "standard_dialog";

StandardDialogRenderer.DEFAULT_WIDTH = 500;
StandardDialogRenderer.FULLSCREEN_GAP = 10;

/**
 * Maximum number of buttons supported by a Standard Dialog
 *
 * @private
 * @type Integer
 */
StandardDialogRenderer.NUMBER_OF_BUTTONS = 3;


/**
 * Reference to the popup renderer used to create the standard dialog
 *
 * @private
 * @type PopupRenderer
 */
StandardDialogRenderer.prototype.m_popup = null;


/**
 * Reference to div element which contains the message
 * 
 * @private
 * type HTMLDivElement
 */
StandardDialogRenderer.prototype.m_messageContainer = null;


/**
 * Type of dialog which is currently renderered - see StandardDialogTypes
 * in ServicesConstants.js for actual values.
 *
 * @private
 * @type Integer
 */
StandardDialogRenderer.prototype.m_type = undefined;


/**
 * Create a standard dialog as a child of another element
 * (Which is usually the form element)
 *
 * @param id the id of the standard dialog being created
 */
StandardDialogRenderer.createAsChild = function(p, id)
{
	var e = Renderer.createAsChild(id);

	// Append the standard dialog's outer div to it's parent element
	p.appendChild(e);	
	
	return StandardDialogRenderer._create(e);
}


StandardDialogRenderer._create = function(e)
{
	e.className = StandardDialogRenderer.CSS_CLASS_NAME;

	var sdr = new StandardDialogRenderer();

	var id = e.id;

	// Generate array of buttons with generated ids and labels - labels
	// are updated later on.
	var buttons = new Array(StandardDialogRenderer.NUMBER_OF_BUTTONS);
	for(var i = 0, l = buttons.length; i < l; i++)
	{
		buttons[i] = {id: id + "_button_" + i, label: "button " + i};
	}

	sdr.m_popup = PopupRenderer.createAsChild(
		e,							// Parent of popup
		id + "_popup",				// Id of popup
		buttons,					// Generated array of buttons
		"standard_dialog_" + id		// Generated title
	);
	
	
	var contents = sdr.m_popup.getContentsContainerElement();
	var panel = Renderer.createElementAsChild(contents, "div");
	panel.className = "panel";
	
	sdr.m_messageContainer = Renderer.createElementAsChild(panel, "div");
	sdr.m_messageContainer.className = "message_container";

	// Initialise sets main element (which is the same as the popup's main element)
	// and the reference to the renderer in the dom
	sdr._initRenderer(sdr.m_popup.getElement());
	
	// RWW. Reference to renderer in DOM causes cyclic reference which must be broken
	sdr.m_popup.getElement().__renderer = null;

	return sdr;
}


StandardDialogRenderer.prototype.getButtons = function()
{
	return this.m_popup.getActionBarRenderer().getButtons();
}



StandardDialogRenderer.prototype.setTitle = function(title)
{
	this.m_popup.getTitleBarContainer().innerHTML = title;
}


StandardDialogRenderer.prototype.setMessage = function(message)
{
	this.m_messageContainer.innerHTML = message;
}


StandardDialogRenderer.prototype.setType = function(type)
{
	if(this.m_type != type)
	{
		// Array containing HTML input elements that implement the buttons
		var buttons = this.getButtons();

		// Get the types of buttons for this type of standard dialog
		var buttonTypes = StandardDialogRenderer.BUTTON_MAP[type];
		
		// Get the number of buttons needed for this type of standard dialog
		var buttonCount = buttonTypes.length;
		
		// Set up button labels	for the required buttons
		var i = 0;
		for(; i < buttonCount; i++)
		{
			buttons[i].value = StandardDialogRenderer.BUTTON_LABELS[buttonTypes[i]];
		}

		// Re-use counter
		i = 0;
		
		// Make required number of buttons visible
		for(; i < buttonCount; i++)
		{
			buttons[i].style.display = "";
		}
		// Hide the rest.
		for(l = buttons.length; i < l; i++)
		{
			buttons[i].style.display = "none";
		}
	
		// Remember the type
		this.m_type = type;
	}

}

/**
 * Set the width of the popup
 *
 * @param width the popup's required width
 * Optional, default width is 500px
 */
StandardDialogRenderer.prototype.setWidth = function(width)
{
	// Set default width if required
	width = Number(width);
	width =
		(isNaN(width) || 0 == width || width < 0)
		? StandardDialogRenderer.DEFAULT_WIDTH
		: width;

	// If wider than form's iframe set to iframe width
	var e = this.getElement();
	var docEl = e.ownerDocument.documentElement;
	var windowWidth =
		window.innerWidth != null
		? window.innerWidth				// W3C
		: docEl.clientWidth;			// IE

	// Leave a gap between dialog and screen left/right edges
	windowWidth -= (StandardDialogRenderer.FULLSCREEN_GAP * 2);

	if (width >= windowWidth) {
		width = windowWidth;
	}

	e.style.width = width  + "px";
}

/**
 * Position the popup in the centre of the form's iframe
 *
 * @param top the popup's top left y position.
 * Optional, default is to center in the forms's iframe
 * @param left the popup's top left x position.
 * Optional, default is to center in the forms's iframe
 */
StandardDialogRenderer.prototype.positionPopup = function(top, left)
{
	var e = this.getElement();
	var docEl = e.ownerDocument.documentElement;

	var windowHeight = 
		window.innerHeight != null
		? window.innerHeight			// W3C
		: docEl.clientHeight;			// IE
	var windowWidth =
		window.innerWidth != null
		? window.innerWidth				// W3C
		: docEl.clientWidth;			// IE
	var scrollY = 
		window.pageYOffset != null
		? window.pageYOffset			// W3C
		: docEl.scrollTop;				// IE

	var popupWidth = e.offsetWidth;
	var popupHeight = e.offsetHeight;

	var x = (null == left || isNaN(left)) ? (windowWidth - popupWidth) / 2 : Number(left);
	var y = (null == top || isNaN(top)) ? (windowHeight - popupHeight) / 2 : Number(top);

    // Check horizontal position of popup
    if (x + popupWidth > windowWidth)
    {  
        // Reset popup position so that right of popup is at right of window
        x = windowWidth - popupWidth;    
    }

	if (x < 0) {
		x = 0;
	}

    // Check vertical position of popup
    if (y + popupHeight > windowHeight + scrollY)
    { 
        // Reset popup position so that bottom of popup is at bottom of window   
        y = windowHeight - popupHeight;
    }

    if (y < 0) {
    	y = 0;
    }

	e.style.position = "absolute";
	e.style.left = x + "px";
	e.style.top = y + "px";
}


StandardDialogRenderer.prototype.getButtonClicked = function(button)
{
	// Get the button number from the id
	var buttonNumber = button.id.slice(-1);

	// Get the available button types for this type of standard dialog
	var buttonTypes = StandardDialogRenderer.BUTTON_MAP[this.m_type];
	
	// Get the button type clicked based on its button number
	var clickedButtonType = buttonTypes[buttonNumber];
	
	return clickedButtonType;
}



StandardDialogRenderer.BUTTON_MAP = [
	[StandardDialogButtonTypes.OK],
	[StandardDialogButtonTypes.OK, StandardDialogButtonTypes.CANCEL],
	[StandardDialogButtonTypes.YES, StandardDialogButtonTypes.NO],
	[StandardDialogButtonTypes.YES, StandardDialogButtonTypes.NO, StandardDialogButtonTypes.CANCEL]
];


StandardDialogRenderer.BUTTON_LABELS = [
	"OK",
	"Cancel",
	"Yes",
	"No"
];
