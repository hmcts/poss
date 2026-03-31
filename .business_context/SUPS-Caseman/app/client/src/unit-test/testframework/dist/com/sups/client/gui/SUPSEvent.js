//==================================================================
//
// SUPSEvent.js
//
//==================================================================

/**
 * Empty constuctor to declare SUPSEvent class namespace
 */
function SUPSEvent()
{
}

SUPSEvent.m_logger = new Category("SUPSEvent");



/**
 * Method to add an event handler to an element in a browser independant manner.
 *
 * @param element Element to attach the event to
 * @param eventName Name of the event In w3c dom level 2 format - i.e. without the 'on' prefix
 * @param action Reference to the function to call when the event is triggered
 * @return an object which can be used to remove the event handler again
 */
SUPSEvent.addEventHandler = function(element, eventName, action, capture)
{

  // Add onload event handler to allow us to resize the form
  if (element.attachEvent)
  {
	  // IE DOM syntax
      element.attachEvent("on" + eventName, action);    
  }
  else if (element.addEventListener)
  {
    // W3C DOM (and Mozilla) syntax
	element.addEventListener(eventName, action, null != capture ? capture : false);
  }
  else
  {
    // Browser is not IE or a W3C compliant browser so throw toys out of pram
  	fc_assertAlways("Cannot add event handler. Browser not IE or W3C compliant?");
  }
  
  
  // Return an object that can be used to remove the event handler
  var obj = new Object();
  obj.m_element = element;
  obj.m_eventName = eventName;
  obj.m_action = action;
  obj.m_capture = capture;
  
  return obj;
}


/**
 * Method to remove an event handler to an element in a browser independant manner.
 *
 * @param element Element to attach the event to
 * @param eventName Name of the event In w3c dom level 2 format - i.e. without the 'on' prefix
 * @param action Reference to the function to call when the event is triggered
 */
SUPSEvent.removeEventHandler = function(element, eventName, action, capture)
{
  if (element.detachEvent)
  {
    // IE DOM syntax
    element.detachEvent("on" + eventName, action);
  }
  else if (element.removeEventListener)
  {
    
    // W3C DOM (and Mozilla) syntax
    element.removeEventListener(eventName, action, null != capture ? capture : false);
  }
  else
  {
    // Browser is not IE or a W3C compliant browser so throw toys out of pram
  	fc_assertAlways("Cannot remove event handler. Browser not IE or W3C compliant?");
  }	
}


/**
 * Removes an event handler using the key returned by the addEventHandler method
 *
 * @param key the event key returned by the addEventHandler method
 */
SUPSEvent.removeEventHandlerKey = function(key)
{
	if(key != null)
	{
		SUPSEvent.removeEventHandler(key.m_element, key.m_eventName, key.m_action, key.m_capture);
		key.m_element = null;
		key = null;
	}
	else
	{
		if(SUPSEvent.m_logger.isWarn()) SUPSEvent.m_logger.warn("SUPSEvent.removeEventHandlerKey(key), key is null!");
	}
}


/**
 * Stops the propogation of the supplied event in a browser independant
 * way. In a W3C browser this may be invoked during the capture phase (in which
 * case the event is not propograted any further up the hierarchy towards its
 * target) or in the bubbling phase (in which case the event does not propogate
 * any further back up from the target element to the document). IE does not
 * support the capture phase, so propogation can only be prevented during event
 * bubbling.
 *
 * @param evt the event which is to have its propagation stopped.
 */
SUPSEvent.stopPropagation = function(evt)
{
	if(evt.stopPropagation != null)
	{
		// W3C
		evt.stopPropagation();
	}

	// On IE, set the cancelBubble property to prevent bubbling - does not
	// have any effect on other browsers
	evt.cancelBubble = true;		
}


/**
 * Prevent the default action associated with the event in a browser independant
 * way.
 *
 * @param evt the event which is to have its default action prevented
 */
SUPSEvent.preventDefault = function(evt)
{
	if(evt.preventDefault)
	{
		// W3C
		evt.preventDefault();
	}
	
	// On IE, set the returnValue property to false to prevent the default.
	// This does not have any effect on other browsers
	evt.returnValue = false;
}


/**
 * Get the target element of the event, depending on the browser
 *
 * @param evt the event whos target element to retreive.
 * @return the target element of the event
 * @type HTMLElement
 */
SUPSEvent.getTargetElement = function(evt)
{
	var target = null;
	if(evt.target != undefined)
	{
		target = evt.target;
	}
	else if(evt.srcElement != undefined)
	{
		target = evt.srcElement;
	}
	else
	{
		// This browser is unrecognised
		fc_assertAlways("Unknown browser");
	}
	
	return target;
}


SUPSEvent.getRelatedElement = function(evt)
{
	var e = null;
	if(evt.relatedTarget !== undefined)
	{
		e = evt.relatedTarget;
	}
	else if(evt.toElement !== undefined)
	{
		e = evt.toElement;
	}
	else
	{
		// Unrecognised browser
		fc_assertAlways("Unknown browser");
	}
	
	return e;
}


SUPSEvent.getPageX = function(e)
{
	if(e.pageX != null)
	{
		return e.pageX;
	}
	else if(e.clientX != null)
	{
		return e.clientX;
	}
	else
	{
		// This browser is unrecognised
		fc_assertAlways("Unknown browser");
	}
}


SUPSEvent.getPageY = function(e)
{
	if(e.pageY != null)
	{
		return e.pageY;
	}
	else if(e.clientY != null)
	{
		return e.clientY;
	}
	else
	{
		// This browser is unrecognised
		fc_assertAlways("Unknown browser");
	}
}
