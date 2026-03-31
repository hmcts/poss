//==================================================================
//
// Button.js
//
// Implementation of a Button GUI object using html div tags.
//
//==================================================================


/**
 * GUI Button object which is implemented using html div tags.
 *
 * To create an object, use one of the factory methods:
 *   Button.createInline()
 *   Button.createAsChild()
 *
 * @constructor
 * @private
 */
function Button()
{
}


/**
 * The main element of the button
 *
 * @type HTMLElement
 * @private
 */
Button.prototype.m_element = null;


/**
 * The inner element of the button
 *
 * @type HTMLElement
 * @private
 */
Button.prototype.m_inner = null;


/**
 * The enablement state of the button
 *
 * @type boolean
 * @private
 */
Button.prototype.m_disabled = false;


/**
 * The repeat interval for the button. When this
 * is none zero and the button is clicked and held,
 * the clickListeners will notified of a click at
 * this interval.
 *
 * @type Integer
 * @private
 */
Button.prototype.m_repeatInterval = 0;


Button.m_clickedButton = null;

Button.m_timeoutID = null;


/**
 * The pressed state of the button
 *
 * @type boolean
 * @private
 */
Button.prototype.m_pressed = false;


/**
 * Additional CSS classes for the button
 *
 * @type String
 * @private
 */
Button.prototype.m_addClasses = null;


/**
 * Button released flag
 *
 * @type boolean
 * @private
 */
Button.prototype.m_buttonReleased = true;


/**
 * Listeners which receive click events
 *
 * @type CallbackList
 * @private
 */
Button.prototype.m_clickListeners = null;


/**
 * Key to the event handler for mousedown events
 *
 * @type EventHandlerKey
 * @private
 */
Button.prototype.m_mousedownHandler = null;


/**
 * Key to the event handler for mousedown events
 *
 * @type EventHandlerKey
 * @private
 */
Button.prototype.m_mouseupHandler = null;


/**
 * Key to the event handler for mousedown events
 *
 * @type EventHandlerKey
 * @private
 */
Button.prototype.m_mouseoutHandler = null;


/**
 * Key to the event handler for mousedown events
 *
 * @type EventHandlerKey
 * @private
 */
Button.prototype.m_mouseoverHandler = null;


/**
 * Create a button at the current position in the HTML document
 *
 * @param id the id to give the newly created button
 * @return the newly created Button
 * @type Button
 */
Button.createInline = function(id)
{
  // Write the outer button element to the document
  document.write("<div id='" + id + "'></div>");

  // Get the element using its id
  var e = document.getElementById(id);

  // Create the rest of the button
  return Button._createButton(e, null);
}


/**
 * Create a button as a child of another html element
 *
 * @param p the parent element to add the Button to.
 * @param id the id to give the newly created button
 * @param ac additional css classes to add to the button
 * @return the newly created Button
 * @type Button
 */
Button.createAsChild = function(p, id, ac)
{
  // Create the outer button element
  var b = document.createElement("div");
  
  if(null != id) b.id = id;

  // Append the button to it's parent element
  p.appendChild(b);

  // Create the rest of the button
  return Button._createButton(b, ac);
}


/**
 * Common button creation code shared by factory methods.
 *
 * @param be the main button element
 * @param ac additional css classes to add to the button
 * @return the new Button object
 * @type Button
 * @private
 */
Button._createButton = function(be, ac)
{
  var b = new Button();
  b.m_element = be;
  b.m_inner = document.createElement("div");
  be.appendChild(b.m_inner);

  // Prevent selection of the button label
  preventSelection(be);

  b.m_disabled = false;
  b.m_addClasses = ac;
  b.m_buttonReleased = true;
  b.m_clickListeners = new CallbackList();
  b._render();

  this.m_mousedownHandler = null;
  this.m_mouseupHandler = null;
  this.m_mouseoutHandler = null;
  this.m_mouseoverHandler = null;

  // Set a property on the main div element so that the Adapter can have
  // rapid access to this class.
  be.__renderer = b;

  return b;
}


/**
 * Clean up after the component
 */
Button.prototype.dispose = function()
{
	// Break circular reference in HTML
	this.m_element.__renderer = null;

	this.stopEventHandlers();  

	unPreventSelection(this.m_element);

	// Get rid of listeners	
	this.m_clickListeners.dispose();
	this.m_clickListeners = null;
	this.m_element = null;
}


Button.prototype.startEventHandlers = function()
{
	if(null == this.m_mousedownHandler)
	{
		var b = this;
		b.m_mousedownHandler = SUPSEvent.addEventHandler(b.m_element, "mousedown", function() { b._handleMouseDown(); });
	}
}


Button.prototype.stopEventHandlers = function()
{
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
	if(null != this.m_mouseoutHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);
		this.m_mouseoutHandler = null;
	}
	
  	// Release event handlers
	if(null != this.m_mouseoverHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler);
		this.m_mouseoverHandler = null;
	}
}


/**
 * Set the disablement state of the button
 *
 * @param disable boolean to indicate whether the button is disabled or not.
 */
Button.prototype.setDisable = function(disable)
{
  if(this.m_disabled != disable)
    {
      this.m_disabled = disable;
      this._render();
    }
}


/**
 * Register a callback to be notified when the button is clicked.
 *
 * @param cb the function called when the button is clicked.
 */
Button.prototype.addClickListener = function(cb)
{
  this.m_clickListeners.addCallback(cb);
}


/**
 * Set the time interval in milliseconds between click notification
 * if the button is clicked and held.
 *
 * @param initialDelay the delay after the initial click before
 *   the button starts sending repeated click events.
 * @param repeatInterval the interval between click events when
 *   repeating
 */
Button.prototype.setRepeatInterval = function(initialDelay, repeatInterval)
{
	this.m_initialDelay = initialDelay;
	this.m_repeatInterval = repeatInterval;
}


/**
 * Event handler that is called when the mouse button is pressed
 *
 * @private
 */
Button.prototype._handleMouseDown = function()
{
	this.m_pressed = true;
	this.m_buttonReleased = false;
	b = this;

	// Add event handlers needed while button is pressed.
	if(null == this.m_mouseupHandler)
	{
		this.m_mouseupHandler = SUPSEvent.addEventHandler(document, "mouseup", function() { b._handleMouseUp(); }, null);
	}

	if(null == this.m_mouseoutHandler)
	{
		this.m_mouseoutHandler = SUPSEvent.addEventHandler(this.m_element, "mouseout", function() { b._handleMouseOut(); }, null);
	}

	if(null == this.m_mouseoverHandler)
	{
		this.m_mouseoverHandler = SUPSEvent.addEventHandler(this.m_element, "mouseover", function() { b._handleMouseOver(); }, null);
	}

	this._render();
	
	if(0 != this.m_repeatInterval)
	{
		Button.m_clickedButton = this;
		this._startRepeat(this.m_initialDelay);
	}
}


Button._clickRepeat = function()
{
	var b = Button.m_clickedButton;
	if(b != null)
	{
		b._startRepeat(b.m_repeatInterval);
	}
}


Button.prototype._startRepeat = function(timeout)
{
	// Listeners invoked immediately
	this.m_clickListeners.invoke();
	
	Button.m_timeoutID = setTimeout("Button._clickRepeat()", timeout);	
}


/**
 * Event handler called when the mouse button is released
 *
 * @private
 */
Button.prototype._handleMouseUp = function()
{
	this.m_pressed = false;
	this.m_buttonReleased = true;
	this._render();

	// Remove event handlers needed while button is pressed.
	SUPSEvent.removeEventHandlerKey(this.m_mouseupHandler);
	SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler);
	SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler);
	this.m_mouseupHandler = null;
	this.m_mouseoutHandler = null;
	this.m_mouseoverHandler = null;

	// If this is none repeating button, invoke the listeners when
	// it is released.
	if(0 == this.m_repeatInterval)
	{
		this.m_clickListeners.invoke();
	}
	else
	{
		if(null != Button.m_timeoutID)
		{
			clearTimeout(Button.m_timeoutID);
			Button.m_timeoutID = null;
		}
	}
	Button.m_clickedButton = null;
}


/**
 * Event handler called when the mouse pointer leaves the button
 *
 * @private
 */
Button.prototype._handleMouseOut = function()
{
  this.m_pressed = false;
  this._render();
}


/**
 * Event handler called when the mouse pointer enters the button
 *
 * @private
 */
Button.prototype._handleMouseOver = function()
{
  this.m_pressed = !this.m_buttonReleased;
  this._render();
}


/**
 * Method which renders the button according to its state
 *
 * @private
 */
Button.prototype._render = function()
{
  var oc = "button";
  var ic = "button_inner";
  var ac = "";
  if(this.m_disabled)
  {
    ac += " disabled";
  }
  else
  {
    if(this.m_pressed)
    {
      ac += " pressed";
    }
  }
  
  // Set class of inner div without additional classnames specified in the constructor
  this.m_inner.className = ic + ac;

  // Add any additional external style classes
  if(null != this.m_addClasses)
  {
    ac += " " + this.m_addClasses;
  }
  this.m_element.className = oc + ac;
}

