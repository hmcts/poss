//==================================================================
//
// Scrollbar.js
//
// Implementation of a Scrollbar GUI object using html div tags.
//
//==================================================================


var isIE = !(document.implementation && document.implementation.createDocument);


function Scrollbar()
{
}

Scrollbar.m_logger = new Category("Scrollbar");

// Define class variable for minimum scroll bar size

Scrollbar.MINIMUM_HEIGHT = 40;

// Define instance variables

Scrollbar.prototype.m_element = null;

Scrollbar.prototype.m_vertical = true;

Scrollbar.prototype.m_decButton = null;

Scrollbar.prototype.m_container = null;

Scrollbar.prototype.m_slider = null;

Scrollbar.prototype.m_sliderInner = null;

Scrollbar.prototype.m_incButton = null;

Scrollbar.prototype.m_min = 0;

Scrollbar.prototype.m_max = 100;

Scrollbar.prototype.m_proportion = 100;

Scrollbar.prototype.m_position = 0;

Scrollbar.prototype.m_increment = 100;

Scrollbar.prototype.m_dragStartX = null;

Scrollbar.prototype.m_dragStartY = null;

Scrollbar.prototype.m_changeListeners = null;

Scrollbar.prototype.m_mousedownHandler = null;

Scrollbar.prototype.m_mouseupHandler = null;

Scrollbar.prototype.m_mousemoveHandler = null;

Scrollbar.prototype.m_registerWithStyleManager = null;

Scrollbar.prototype.m_resetVScrollbarHeight = null;

Scrollbar.REPEAT_INITIAL_DELAY = 250;

Scrollbar.REPEAT_INTERVAL = 100;

/**
 * Create a scrollbar at the current position in the HTML document
 *
 * @param id the id to give the newly created Scrollbar
 * @param vertical true if this a vertical scrollbar, false if it is horizontal
 * @param registerWithStyleManager In most cases scroll bars are rendered before
 *                                 a form's style sheets are loaded. When this occurs a
 *                                 small correction to the height of the scroll bar may
 *                                 be required. This is achieved by the scrollbar registering a 
 *                                 callback function with the style manager. In the case of
 *                                 the framework select component the scroll bar will be rendered
 *                                 after the form's style sheet has loaded. Therefore, a callback
 *                                 function is not required. This flag is used to indicate,
 *                                 whether or not, the callback function should be registered
 *                                 with the style manager. The default value is "true".
 * @return the newly created Button
 * @type Button
 */
Scrollbar.createInline = function(id, vertical, registerWithStyleManager)
{
  // Write the outer button element to the document
  document.write("<div id='" + id + "'></div>");

  // Get the element using its id
  var e = document.getElementById(id);

  // Create the rest of the button
  return Scrollbar._create(e, vertical, null, registerWithStyleManager);
}


/**
 * Create a scrollbar as a child of another html element
 *
 * @param p the parent element to add the Scrollbar to.
 * @param id the id to give the newly created Scrollbar - may be null
 * @param vertical true if this a vertical scrollbar, false if it is horizontal
 * @param ac additional css classes to add to the Scrollbar
 * @param registerWithStyleManager Boolean flag indicating whether, or not,
 *                                 the scroll bar should register a callback
 *                                 function with the style manager.
 * @return the newly created Button
 * @type Button
 */
Scrollbar.createAsChild = function(p, id, vertical, ac, registerWithStyleManager)
{
  // Create the outer button element
  var e = document.createElement("div");
  
  if(null != id) e.id = id;

  // Append the button to it's parent element
  p.appendChild(e);

  // Create the rest of the button
  return Scrollbar._create(e, vertical, ac, registerWithStyleManager);
}



Scrollbar._create = function(sbe, vertical, ac, registerWithStyleManager)
{
	var sb = new Scrollbar();
	
	sb.m_element = sbe;
	sb.m_element.className = "scrollbar scrollbar_" + (vertical ? "vertical" : "horizontal");
	
	if(registerWithStyleManager == false)
	{
	    sb.m_registerWithStyleManager = false;
	}
	else
	{
	    sb.m_registerWithStyleManager = true;
	}
	
	if(isIE)
	{
		// Normal stylesheets get this right in mozilla, however
		// on IE we need an expression to
		// calculate the height.
		sbe.style.height = Scrollbar._calculateHeight(sbe) + "px";
		
		if(vertical && sb.m_registerWithStyleManager)
		{
		    // Register function used to resize vertical scrollbar
		    // after CSS load
		    sb._registerResetVScrollBarHeight();
		}
	}

	sb.m_vertical = vertical;

	sb.m_decButton = Button.createAsChild(sb.m_element, null, "dec");
	sb.m_decButton.setRepeatInterval(Scrollbar.REPEAT_INITIAL_DELAY, Scrollbar.REPEAT_INTERVAL);
	sb.m_decButton.addClickListener(function() { sb._handleDecrementClick(); });
  
	sb.m_container = document.createElement("div");
	sb.m_container.className = "scrollbar_container";
	sb.m_element.appendChild(sb.m_container);

	sb.m_slider = document.createElement("div");
	sb.m_slider.className = "scrollbar_slider button";
	sb.m_container.appendChild(sb.m_slider);
	var sliderInner = document.createElement("div");
	sliderInner.className = "button_inner";
	sb.m_slider.appendChild(sliderInner);

	sb.m_incButton = Button.createAsChild(sb.m_element, null, "inc");
	sb.m_incButton.setRepeatInterval(Scrollbar.REPEAT_INITIAL_DELAY, Scrollbar.REPEAT_INTERVAL);
	sb.m_incButton.addClickListener(function() { sb._handleIncrementClick(); });

	sb.m_min = 0;
	sb.m_max = 100;
	sb.m_proportion = 100;
	sb.m_position = 0;
	sb.m_increment = 100;

	sb.m_dragStartX = null;
	sb.m_dragStartY = null;

	sb.m_dragStartSliderX = null;
	sb.m_dragStartSliderY = null;

	sb.m_changeListeners = new CallbackList();

	sb.m_mousedownHandler = null;
	sb.m_mouseupHandler = null;
	sb.m_mousemoveHandler = null;

	sb._render();
	
	// Set a property on the main div element so that the Adapter can have
	// rapid access to this class.
	sbe.__renderer = sb;
	
	return sb;
}


/**
 * Clean up after the component
 */
Scrollbar.prototype.dispose = function()
{
	// Get rid of event handlers
	this.stopEventHandlers();  

	// Get rid of child buttons
	this.m_incButton.dispose();
	this.m_decButton.dispose();

	// Break circular reference in HTML
	this.m_element.__renderer = null;

	// Get rid of listeners	
	this.m_changeListeners.dispose();
	this.m_changeListeners = null;
	
	if(isIE && this.m_vertical && this.m_registerWithStyleManager)
	{
	    // Unregister function which resets scrolbar height
	    // after CSS load
	    this._unregisterResetVScrollBarHeight();
	}
}


Scrollbar.prototype.startEventHandlers = function()
{
	var sb = this;
	sb.m_mousedownHandler = SUPSEvent.addEventHandler(sb.m_slider, "mousedown", function(e) { sb._handleDragMouseDown(e); }, null);

	// event handlers to handle scrolling the scrollbar by pressing the mouse down and holding it above or below the slider
	sb.m_containerMouseDownHandler = SUPSEvent.addEventHandler(sb.m_container, "mousedown", function(e) { sb._handleMouseDownContainer(e); }, null);
	sb.m_containerMouseUpHandler = SUPSEvent.addEventHandler(sb.m_container, "mouseup", function(e) { sb._handleMouseUpContainer(e); }, null);

	this.m_incButton.startEventHandlers();
	this.m_decButton.startEventHandlers();
}


Scrollbar.prototype.stopEventHandlers = function()
{
	this.m_incButton.stopEventHandlers();
	this.m_decButton.stopEventHandlers();

  	// Release event handlers
	if(null != this.m_mousedownHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mousedownHandler);
		this.m_mousedownHandler = null;
	}
	
  	// Release event handlers
	if(null != this.m_mouseupHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);
		this.m_mouseupHandler = null;
	}
	
  	// Release event handlers
	if(null != this.m_mousemoveHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);
		this.m_mouseoutHandler = null;
	}

	if(null != this.m_containerMouseDownHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_containerMouseDownHandler);
		this.m_containerMouseDownHandler = null;
	}

	if(null != this.m_containerMouseUpHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_containerMouseUpHandler);
		this.m_containerMouseUpHandler = null;
	}
}


Scrollbar.prototype.addPositionChangeListener = function(cb)
{
	this.m_changeListeners.addCallback(cb);
}


/**
 * Function call by proprietry Internet Explorer CSS
 * expression, which lays out the scrollbar correctly
 */
function ScrollbarCalculateHeightId(id)
{
	var sb = document.getElementById(id);
	return sb == null ? Scrollbar.MINIMUM_HEIGHT : Scrollbar._calculateHeight(sb);
}

Scrollbar._calculateHeight = function(scrollbar)
{
	var parent = scrollbar.parentElement;
	var height = parent.offsetHeight;
	
	return height < Scrollbar.MINIMUM_HEIGHT ? Scrollbar.MINIMUM_HEIGHT : parent.offsetHeight;
}


Scrollbar.prototype.setScaling = function(min, max, proportion, increment)
{
	this.m_min = min;
	this.m_max = max;
	this.m_proportion = proportion;
	
	this.m_increment = null == increment ? proportion : increment;
	
	this._render();
}


Scrollbar.prototype.setPosition = function(position)
{
	this.m_position = position;
}

Scrollbar.prototype.getPosition = function()
{
    return this.m_position;
}


Scrollbar.prototype._render = function()
{
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._render");
	var range = this.m_max - this.m_min;

	var scale;
	var start;
	if(0 == range)
	{
		scale = 1;
		start = 0;
	}
	else
	{
		scale = range/this.m_proportion;
		start = this.m_position;
	}
	
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Range: " + range + "\nScale: "+ scale + "\nStart: " + start);
	
	if(this.m_vertical)
	{
		// Need to calculate height of container - stylesheets don't work in this instance
		if(isIE)
		{
			this.m_element.style.height = Scrollbar._calculateHeight(this.m_element);
			// Stylesheets get this right in mozilla...
		}
		this.m_container.style.top = this.m_incButton.m_element.offsetHeight + "px";
		if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: this.m_container.style.top: " + this.m_container.style.top + "\nthis.m_incButton.m_element.offsetHeight: "+ this.m_incButton.m_element.offsetHeight);
		this.m_container.style.height = (this.m_element.offsetHeight - (this.m_incButton.m_element.offsetHeight + this.m_decButton.m_element.offsetHeight)) + "px";
	
		// Calculate the size of the button but make sure it doesn't get too small.
		var buttonSize = Math.floor(this.m_container.offsetHeight * scale);
		if(buttonSize < 10) buttonSize = 10;
	
		// Calculate the top of the slider
		var a = this.m_proportion -(this.m_max - this.m_min);
	 	var top = a == 0 ? 0 : (start * (this.m_container.offsetHeight - this.m_slider.offsetHeight)) / a;
	 	top = Math.floor(top);
		if(top > (this.m_container.offsetHeight - buttonSize))
		{
			top =  (this.m_container.offsetHeight - buttonSize);
		}
		
		this.m_slider.style.height = buttonSize + "px";
		this.m_slider.style.top = top + "px";
		// store the top and height so we can determine if we have clicked above or below the slider
		this.m_sliderTop = top;
		this.m_sliderHeight = buttonSize;
		
		if (isIE)
		{
			// Set size for "button_inner" if slider size has been initialized.
			var sliderHeight = this.m_slider.offsetHeight-4;
			var sliderWidth = this.m_slider.offsetWidth-4;
			
			if (sliderHeight > 0) { // Can't set height if sliderHeight is negative/undefined
			  this.m_slider.firstChild.style.height = sliderHeight + "px";
			}
			
			if (sliderWidth > 0) {
			  this.m_slider.firstChild.style.width = sliderWidth + "px";
			}
		}
		
		
		if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: top: " + top + "\nthis.m_slider.style.top: "+ this.m_slider.style.top);
		

		if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Vertical\nButtonSize: " + buttonSize + "\nTop Pos: " + top + "\nContainer height: " + this.m_container.offsetHeight);
	}
	else
	{
		var buttonSize = Math.floor(this.m_container.offsetWidth * scale);
		if(buttonSize < 10) buttonSize = 10;
		
		//var top = (this.m_position / range) * (this.m_container.offsetWidth - buttonSize);
		var a = this.m_proportion -(this.m_max - this.m_min);
	 	var top = a == 0 ? 0 : (start * (this.m_container.offsetWidth - this.m_slider.offsetWidth)) / a;
	 	top = Math.floor(top);
		if(top > (this.m_container.offsetWidth - buttonSize))
		{
			top =  (this.m_container.offsetWidth - buttonSize);
		}		
		this.m_slider.style.width = buttonSize + "px";
		this.m_slider.style.left = top + "px";

		//alert("Horizontal\nButtonSize: " + buttonSize + "\nLeft Pos: " + top + "\nContainer width: " + this.m_container.offsetWidth);
	}
}


Scrollbar.prototype._handleDragMouseDown = function(e)
{
	if(null == e) e = window.event;
	
	this.m_dragStartX = e.screenX;
	this.m_dragStartY = e.screenY;
	
	this.m_dragStartSliderX = this.m_slider.offsetLeft;
	this.m_dragStartSliderY = this.m_slider.offsetTop;
	
	var s = this;
	if(null == this.m_mouseupHandler)
	{
		this.m_mouseupHandler = SUPSEvent.addEventHandler(document, "mouseup", function() { s._handleDragMouseUp(); }, null);
	}
  
	if(null == this.m_mousemoveHandler)
	{
		this.m_mousemoveHandler = SUPSEvent.addEventHandler(document, "mousemove", function() { s._handleDragMouseMove(e); }, null);
	}
}


Scrollbar.prototype._handleDragMouseUp = function()
{
	SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);
	SUPSEvent.removeEventHandlerKey(this.m_mousemoveHandler);
	
	this.m_mouseupHandler = null;
	this.m_mousemoveHandler = null;
}


Scrollbar.prototype._handleDragMouseMove = function(e)
{
	if(null == e) e = window.event;
	
	var pos;
	var range;
	var size;
	var delta;
	
	if(this.m_vertical)
	{
		delta = e.screenY - this.m_dragStartY;
		pos = this.m_dragStartSliderY + delta;
		range = this.m_container.offsetHeight;
		size = this.m_slider.offsetHeight;
	}
	else
	{
		delta = e.screenX - this.m_dragStartX;
		pos = this.m_dragStartSliderX + delta;
		range = this.m_container.offsetWidth;
		size = this.m_slider.offsetWidth;
	}
	
	// Test whether the mouse drag changhed position in the axis we are intested in
	if(delta > 0)
	{
		// If the mouse was dragged far enough to pull the slider out of the container
		// put the slider at the end of the container
		if(pos + size > range) pos = range - size;
	}
	else
	{
		// If the mouse was dragged past the start of the container set the
		// slidebar to the start 
		if(pos < 0) pos = 0;
	}
	
	// Calculate container size - slider size
	var scrollEmptySize = range - size;
	
	// Calculate total number of rows being represented - number of rows that can be displayed at one time
	var logicalRange = this.m_proportion - (this.m_max - this.m_min);
	var scaledPosition = this.m_min + ((pos * logicalRange) / scrollEmptySize);
	this.m_position = parseInt(scaledPosition.toFixed(0));
	
	if(this.m_vertical)
	{
		this.m_slider.style.top = pos + "px";
	}
	else
	{
		this.m_slider.style.left = pos + "px";
	}
	
	this.m_changeListeners.invoke(pos, range, size);
}

Scrollbar.prototype._setScrollbarTimeout = function()
{
	// vary the speed depending upon the amount of paging required to scroll the entire scrollbar
	var numPages = this.m_proportion / (this.m_max - this.m_min);
	if(numPages < 5) numPages = 5;
	var timer = 20 + Math.round(600 / numPages);
	Scrollbar.scrollTimeout = timer;
}

Scrollbar.prototype._handleMouseDownContainer = function(evt)
{
	var target = SUPSEvent.getTargetElement(evt);
	
	// If the target is the slider then ignore
	if(target.className == "scrollbar_container")
	{
		// D892 - Respond to mouse clicks using a constant timeout
		// rather than varying the timeout with the amount of data
		//this._setScrollbarTimeout();
		Scrollbar.scrollTimeout = 35;
		
		// Mozilla and IE use different coordinate systems - great!		
		if(evt.layerY != null)
		{
			Scrollbar.clickY = evt.layerY;
		}
		else
		{
			Scrollbar.clickY = evt.offsetY;
		}
		if(Scrollbar.clickY < this.m_sliderTop)
		{
			Scrollbar.direction = "UP";
		}
		else
		{
			Scrollbar.direction = "DOWN";
		}
		Scrollbar.currentScrollbar = this;
		Scrollbar.mouseDownTimeout = setTimeout("Scrollbar._handleContainerScroll()", Scrollbar.scrollTimeout);
	}
}

Scrollbar.prototype._handleMouseUpContainer = function(evt)
{
	if(null == evt) evt = window.event;
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleMouseUpContainer()");

	Scrollbar.currentScrollbar = null;
	clearTimeout(Scrollbar.mouseDownTimeout);
	Scrollbar.mouseDownTimeout = null;
}

Scrollbar._handleContainerScroll = function()
{
	if(Scrollbar.currentScrollbar != null)
	{
		var scrollbar = Scrollbar.currentScrollbar;
		// position = number of rows in data
		// min and max define the number of rows in the view
		var numberOfRows = scrollbar.m_max - scrollbar.m_min;

		var scrolled = false;	
		if(Scrollbar.direction == "UP")
		{
			if(Scrollbar.clickY < scrollbar.m_sliderTop)
			{
				if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleClickContainer() clicked above slider so page up");
				// page up
				scrollbar.m_position = scrollbar.m_position - numberOfRows;
				if(scrollbar.m_position < scrollbar.m_min)
				{
					scrollbar.m_position = scrollbar.m_min;
				}
				scrolled = true;
			}
		}
		else
		{
			if(Scrollbar.clickY > scrollbar.m_sliderTop + scrollbar.m_sliderHeight)
			{
				if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar._handleClickContainer() clicked below slider so page down");
				// page down
				scrollbar.m_position = scrollbar.m_position + numberOfRows;
				if(scrollbar.m_position >= scrollbar.m_proportion - numberOfRows)
				{
					scrollbar.m_position = scrollbar.m_proportion - numberOfRows;
				}
				scrolled = true;
			}
		}
		if(scrolled == true)
		{
			scrollbar.m_changeListeners.invoke();
			Scrollbar.mouseDownTimeout = setTimeout("Scrollbar._handleContainerScroll()", Scrollbar.scrollTimeout);
		}
	}
}

Scrollbar.prototype._handleIncrementClick = function()
{
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._handleIncrementClick");
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: this.m_position == " + this.m_position + " this.m_proportion ==  " + this.m_proportion + " this.m_max == " + this.m_max + " this.m_min == " + this.m_min);
	
	// Is the first visible row less than the last row minus the number of visible rows
	// (i.e. First row visible plus the number of visible rows = the end of the list (i.e. no scroll possible)
	// firstVisibleRow = this.m_position;
	// totalVisibleRows = (this.m_max - this.m_min);
	// lastRowInData = this.m_proportion
	// firstVisibleRow + totalVisibleRows < lastRowInData then scroll down
	if(this.m_position < (this.m_proportion - (this.m_max - this.m_min)))
	{
		this.m_position++;
		
		this._render();
		
		this.m_changeListeners.invoke();
	}
}


Scrollbar.prototype._handleDecrementClick = function()
{
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: Scrollbar.prototype._handleDecrementClick");
	if(Scrollbar.m_logger.isTrace()) Scrollbar.m_logger.trace("SCROLLBAR: this.m_position == " + this.m_position + " this.m_min == " + this.m_min);
	if(this.m_position > this.m_min)
	{
		this.m_position--;
		
		this._render();
		
		this.m_changeListeners.invoke();
	}
}

Scrollbar.prototype._registerResetVScrollBarHeight = function()
{
    // Have to retrieve reference to AppController using complex method
    // because FormController created after scroll bar
    var ac = Services.getAppController();
    
    if(null != ac)
    {
        var sm = ac.getStyleManager();
        
        if(null != sm)
        {
            var thisObj = this;
            this.m_resetVScrollbarHeight = function(){return thisObj._resetVScrollbarHeight();};
            
            sm.registerOnLoadHandler(this.m_resetVScrollbarHeight, document);
        }
    }
    
}

Scrollbar.prototype._unregisterResetVScrollBarHeight = function()
{
    var ac = Services.getAppController();
    
    var sm = ac.getStyleManager();
    
    sm.unregisterOnLoadHandler(this.m_resetVScrollbarHeight, document);
    this.m_resetVScrollbarHeight = null;
    
}

/**
 * This method resizes a vertical scrollbar. If a form's stylesheet is
 * loaded lated in IE the scrollbar may be too large. Setting the
 * style height to "auto" causes the scroll bar to correctly size itself.
*/
Scrollbar.prototype._resetVScrollbarHeight = function()
{
    // Set scrollbar style height to be "auto" causing scrollbar
    // to readjust height
    this.m_element.style.height = "auto";
    
    // Redraw scrollbar
    this._render();
}
