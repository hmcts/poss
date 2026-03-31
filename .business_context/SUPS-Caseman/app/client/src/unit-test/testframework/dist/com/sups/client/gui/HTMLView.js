//==================================================================
//
// HTMLView.js
//
// This is a utility class for which contains utility methods which
// relate to HTML documents.
//
//==================================================================

/**
 * This is a utility class for which contains utility methods which
 * relate to HTML documents.
 *
 * @constructor
 * @private
 */
function HTMLView()
{
}


/**
 * Logging category for HTMLView
 * 
 * @private
 */
HTMLView.m_logger = new Category("HTMLView");


/**
 * Public variable that identifies if this is Internet Explorer or not
 */
HTMLView.isIE = (document.attachEvent != null);


HTMLView.preventBubblingHandler = function()
{
	return false;
}


/**
 * Add event handlers that prevent context menu, help and default
 * key bindings on the supplied document.
 *
 * @param d the HTML document to add the event handlers to
 */
HTMLView.blockEventsForDocument = function(d)
{
	d.onhelp = HTMLView.preventBubblingHandler;
	d.oncontextmenu = HTMLView.preventBubblingHandler;
	
	if (HTMLView.isIE)
	{
		d.onkeydown = HTMLView._blockEvents;
	}
	else
	{
		// Mozilla - onkeydown doesn't prevent default for all keys
		d.onkeypress = HTMLView._blockEvents;
	}
}


/**
 * Remove event handlers from the supplied document that prevent
 * context menu, help and default key bindings
 *
 * @param d the HTML document to remove the event handlers from
 */
HTMLView.unblockEventsForDocument = function(d)
{
	d.onhelp = null;
	d.oncontextmenu = null;

	if (HTMLView.isIE)
	{
		d.onkeydown = null;
	}
	else
	{
		d.onkeypress = null;
	}
}


/**
 * Add event handlers that prevent default actions for the progress bar
 *
 * @param e the HTML element to add the event handlers to
 */
HTMLView.blockEventsForProgress = function(e)
{
	e.onhelp = HTMLView.preventBubblingHandler;
	e.oncontextmenu = HTMLView.preventBubblingHandler;
	e.onclick = HTMLView.preventBubblingHandler;
	
	if (HTMLView.isIE)
	{
		e.onkeydown = HTMLView._blockProgressEvents;
	}
	else
	{
		// Mozilla - onkeydown doesn't prevent default for all keys
		e.onkeypress = HTMLView._blockProgressEvents;
	}
}


/**
 * Remove event handlers that prevent default actions for the progress bar
 *
 * @param e the HTML element to remove the event handlers from
 */
HTMLView.unblockEventsForProgress = function(e)
{
	e.onclick = null;

	HTMLView.unblockEventsForDocument(e);
}


HTMLView._blockProgressEvents = function(evt)
{
	if (null == evt) {evt = window.event; } 

	if (null != evt)
	{
		SUPSEvent.stopPropagation(evt);
		SUPSEvent.preventDefault(evt);

		if (HTMLView.isIE && !evt.altKey) {
			// If IE and not Alt-key combination, reset key code otherwise
			// default action is not cancelled by IE
			try
			{
				evt.keyCode = 0;
			}
			catch(e)
			{
			}
		}
	}

	return false;
}


/**
 * Check for unfreed event handlers in the view which can cause memory leaks.
 * Should only be used while debugging/testing. 
 */
HTMLView.checkForEventHandlers = function()
{
	var events = [
		"onabort",
		"onblur",
		"onchange",
		"oncontextmenu",
		"onclick",
		"ondblclick",
		"onerror",
		"onfocus",
		"onkeydown",
		"onkeyup",
		"onkeypress",
		"onload",
		"onmousedown",
		"onmousemove",
		"onmouseout",
		"onmouseover",
		"onmouseenter",
		"onmouseleave",
		"onreset",
		"onresize",
		"onselect",
		"onselectstart",
		"onselectend",
		"onscroll",
		"onsubmit",
		"onunload"
	];

	var unfreedHandlers = new Array();	
	
	HTMLView._checkElementsForEventHandlers(document.documentElement, events, unfreedHandlers);
	
	
	if(unfreedHandlers.length > 0)
	{
		var msg = "Unfreed event handlers detected:\n";
	
		for(var i = 0, l = unfreedHandlers.length; i < l ; i++)
		{
			var unfreedHandler = unfreedHandlers[i];
			var element = unfreedHandler.element;
			var event = unfreedHandler.event;
			msg +=
				"Unfreed handler: '" + event +
				"' on element (nodeName: '" + element.nodeName + "' id: '" + element.id + "' class: '" + element.className + "')\n";
		}
		
		alert(msg);
	}
}


/**
 * Check an HTML element and its children for unfreed model 0 event handlers.
 *
 * @param e the element to check
 * @param events array containing the events to check for
 * @param array of objects which will be populated with the 
 */
HTMLView._checkElementsForEventHandlers = function(e, events, unfreedHandlers)
{
	// Check element e for unfreed event handlers
	HTMLView._checkElementForEventHandlers(e, events, unfreedHandlers);
	
	// Check all elements e's children for unfreed event handlers.
	for(var i = 0, l = e.childNodes.length; i < l; i++)
	{
		HTMLView._checkElementsForEventHandlers(e.childNodes[i], events, unfreedHandlers);
	}
}


HTMLView._checkElementForEventHandlers = function(e, events, unfreedHandlers)
{
	for(var i = 0, l = events.length; i < l; i++)
	{
		var event = events[i];
		if(HTMLView.m_logger.isDebug()) HTMLView.m_logger.debug("Checking for event handler: " + event + " value is: " +e[event]);
		if(e[event] != null)
		{
			if(HTMLView.m_logger.isWarn()) HTMLView.m_logger.warn("Unfreed " + event + " event handler detected");
			unfreedHandlers.push({element: e, event: event});
		}
	}
}


HTMLView._blockEvents = function(evt)
{   
	if (null == evt) { evt = window.event; } 

	if (null != evt)
	{
	    // Defect 1000.
	    // First determine whether, or not, application progress bar is visible.
	    // Even though the progress bar is visible if an HTML component on the underlying
	    // document has focus key press events will be routed to this handler method.
	    // In such cases the the key press default action must be stopped.
	    
	    // Defect 1059. As Familyman use the tab key to initiate service calls
	    // we need to be more careful. If a key handler fires with the propagate
	    // property set to "true" the key handler will check the visibility state
	    // of the progress bar and set an expando property on the document. If
	    // this property exists and is set to "false" the key press should not be
	    // blocked.
	    var cancelKeyPress = false;
	    
	    var doc = window.document;
	    
	    if(null == doc.framework_expando_progressBarVisible)
	    {
	        // Key action cancellation depends on current state of progress bar
	    
	        var ac = Services.getAppController();
	    
	        if(null != ac)
	        {
	            if(ac.isProgressBarVisible())
	            {
	                cancelKeyPress = true;
	            }
	        }
	        
	    }
	    else
	    {
	        // Key action cancellation depends on state of progress bar
	        // before key binding function executed
	        if(doc.framework_expando_progressBarVisible != false)
	        {
	            cancelKeyPress = true;
	        }
	        
	        // Clean up expando property
	        doc.framework_expando_progressBarVisible = null;
	    }
	    
	    if(cancelKeyPress)
	    {
	        // Cancel key press
	        return HTMLView._cancelKeyPress(evt);
	    }
	    else
	    {
		    // If Alt key is pressed in W3C use 'keyCode' property otherwise 'which'
		    var keyCode = (HTMLView.isIE || evt.altKey) ? evt.keyCode : evt.which;
		
		    if (HTMLView.m_logger.isDebug()) HTMLView.m_logger.debug("Key pressed: " + String.fromCharCode(keyCode) + " Key code: " + keyCode + " Ctrl key: " + evt.ctrlKey + " Alt key: " + evt.altKey + " Shift key: " + evt.shiftKey);

		    var target = SUPSEvent.getTargetElement(evt);

		    if (
			    // Prevent backspace key performing the browser "back" functionality if the target element does not absorb the backspace key
			    (keyCode == Key.Backspace.m_keyCode && !HTMLView._canAcceptBackspaceKeyEvents(target)) ||
			    // Prevent actions bound to function keys from propagating (NB: 'keyCode' property used for function keys in Mozilla)
			    HTMLView._isFunctionKey(evt.keyCode) ||
			    // Prevent Escape key presses
			    Key.ESC.m_keyCode == keyCode ||
			    // Only allow a subset of Ctrl key combinations to perform the default browser functionality
			    evt.ctrlKey && !(Key.CHAR_X.m_keyCode == keyCode || Key.CHAR_x.m_keyCode == keyCode ||
				  			     Key.CHAR_C.m_keyCode == keyCode || Key.CHAR_c.m_keyCode == keyCode ||
							     Key.CHAR_V.m_keyCode == keyCode || Key.CHAR_v.m_keyCode == keyCode ||
							     Key.CHAR_A.m_keyCode == keyCode || Key.CHAR_a.m_keyCode == keyCode ||
							     Key.CHAR_Z.m_keyCode == keyCode || Key.CHAR_z.m_keyCode == keyCode ||
							     Key.CHAR_Y.m_keyCode == keyCode || Key.CHAR_y.m_keyCode == keyCode ||							 
							     Key.Home.m_keyCode == keyCode ||
							     Key.End.m_keyCode == keyCode) ||
			    // Prevent actions bound to Alt key (if possible, Alt+Home for example still works in IE)
			    evt.altKey)
		    {
			    if (HTMLView.m_logger.isDebug()) HTMLView.m_logger.debug("Cancelling key: " + keyCode + " Ctrl key: " + evt.ctrlKey + " Alt key: " + evt.altKey + " Shift key: " + evt.shiftKey);

			    return HTMLView._cancelKeyPress(evt);
		    }
		    
	    } // End of (cancelKeyPress) if block
	    
	} // End of (null != evt) if block

	return true;
}




/**
 * Returns true if the supplied element should allow the backspace key. 
 * Elements that can accept backspace keys are textareas that are not
 * readonly and text/password fields that are not readonly.
 *
 * @param e the element to test
 * @return true if the element should allow the backspace key, or false
 *   otherwise
 * @type boolean
 */
HTMLView._canAcceptBackspaceKeyEvents = function(e)
{
	return ((e.nodeName == "TEXTAREA" && !e.readOnly) || (e.nodeName == "INPUT" && (e.type=="text" || e.type=="password") && !e.readOnly));
}


/**
 * Returns true if the supplied keyCode is a function key or false
 * otherwise.
 *
 * @param keyCode the keyCode to check
 * @return true if the keycode represents a function key or false otherwise
 */
HTMLView._isFunctionKey = function(keyCode)
{
	return (keyCode >= Key.F1.m_keyCode && keyCode <= Key.F12.m_keyCode) ? true: false;
}

/**
 * Method performs actions to cancel a key press.
 *
 * @param evt The event associated with a key press.
 *
*/
HTMLView._cancelKeyPress = function(evt)
{
    SUPSEvent.stopPropagation(evt);
	SUPSEvent.preventDefault(evt);

	if (HTMLView.isIE && !evt.altKey)
	{
	    // If IE and not Alt-key combination, reset key code otherwise
	    // default action is not cancelled by IE
		try
		{
		    evt.keyCode = 0;
		}
		catch(e)
		{
		}
	}

	return false;
}
