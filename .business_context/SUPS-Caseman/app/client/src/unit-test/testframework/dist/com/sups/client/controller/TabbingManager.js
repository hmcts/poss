function TabbingEvent(type, detail)
{
	this.m_type = type;
	this.m_detail = detail;
	
	// Defect 1106. In the case of mouse clicks sometimes it is
	// necessary to know whether the adaptor could accept focus
	// when it was clicked.
	this.m_acceptFocusOnClick = null;
}


TabbingEvent.EVENTS = {
	TAB_FORWARD:  {priority: 1},
	TAB_BACKWARD:  {priority: 1},
	VALIDATION_FAILURE:  {priority: 2},
	CLICK_FOCUS:  {priority: 3},
	PROGRAMMATIC_FOCUS:  {priority: 4},
	INITIAL_FOCUS: {priority: 5}
}

TabbingEvent.prototype.setAcceptFocusOnClick = function( acceptFocusOnClick )
{
    this.m_acceptFocusOnClick = acceptFocusOnClick;
}

TabbingEvent.prototype.getType = function()
{
	return this.m_type;
}


TabbingEvent.prototype.getDetail = function()
{
	return this.m_detail;
}

TabbingEvent.prototype.getPriority = function()
{
	return this.m_type.priority;
}

TabbingEvent.prototype.getAcceptFocusOnClick = function()
{
    return this.m_acceptFocusOnClick;
}


function TabbingManager()
{
}


/**
 * Logging category for TabbingManager 
 *
 * @private
 * @type Category
 */
TabbingManager.m_logger = new Category("TabbingManager");

/**
 * Key to the event handler used to detect Tab key presses.
 *
 * @private
 */
TabbingManager.prototype.m_keyDownHandler = null;


/**
 * Reference to the form on which to act.
 *
 * @private
 */
TabbingManager.prototype.m_formElementGUIAdaptor = null;


/**
 * Used to identify an adaptor's getFocusElement method's element when
 * a non-native HTML adaptor is the target for a HTML LABEL's FOR.
 *
 * @private
 */
TabbingManager.NON_NATIVE_FOCUS_ID = "_fwNonNativeFocusID";


/**
 * Timeout reference for handling tabbing events.
 *
 * @private
 */
TabbingManager.m_timeout = null;


/**
 * Initialises the Tabbing Manager
 *
 */
TabbingManager.prototype.initialise = function()
{
	/*("TabbingManager_initialise")*/

	// Create an array to hold all the click event handlers
	this.m_clickEventHandlers = new Array();

	// Array containing adaptors in the order that they should be tabbed through
	this.m_tabOrder = [];

	// We haven't start capturing keyDown events on the window. This will
	// only ever be used on browsers which don't support native focussing
	// on all elements. Only used on non-IE browsers
	this.m_captureSet = false;

	// Add an event handler to catch click events on the document. This event
	// handler will always be invoked after the a click on an component in the
	// document, as we are handling the event in the bubbling phase of event
	// propogation (which is the only phase that IE supports anyway).
	var tm = this;
	this.m_clickHandler = SUPSEvent.addEventHandler(document, "mousedown", function(evt) {tm._documentClickEventHandler(evt);}, false);

	// Add an event handler to catch mouse wheel events on the document. This event 
	// will be passed down to the currently focussed adaptor if it supports the
	// MouseWheelBindingProtocol. This is because the default browser behaviour is
	// to fire the event to whatever element the mouse is over rather than the element
	// that has the current focus.
	this.m_mouseWheelEventHandler = SUPSEvent.addEventHandler(document, "mousewheel", function(evt) { tm.handleScrollMouse(evt); }, null);

	// Add window event handlers if this is not IE.
	if(window.addEventListener)
	{
		// This is non IE browsers - ie Mozilla
	
		var tm = this;
		// Add an event handler to catch keydown events on the window during the W3C event capture phase
		this.m_keyDownHandler = SUPSEvent.addEventHandler(window, "keydown", function(evt) { tm._tabKeyEventHandler(evt); }, true);
		
		// Add a dummy hidden field which can accept the focus when non native controls have the focus
		this.m_hiddenField = document.createElement("input");
		this.m_hiddenField.setAttribute("type", "hidden");
		document.body.appendChild(this.m_hiddenField);
	}
	else
	{
		// This is IE
		
		// Add an event handler	on the document, so that if the focus is on 
		// a none adaptor element, hitting the tab key will continue in the tabbing
		// order	
		this.m_keyDownHandler = SUPSEvent.addEventHandler(window.document, "keydown", function(evt) { tm._tabKeyEventHandler(evt); }, false);
	}

	// Default to no focussed adaptor
	this.m_currentFocussedAdaptor = null;
	/*("TabbingManager_initialise")*/
}


/**
 * Order the supplied adaptors according to their tabIndex attribute. Adaptors
 * which specify a tabIndex attribute are placed at the first in the returned
 * array, ordered by their tabIndex attribute. Adaptors without tabIndex attribute
 * are placed at the end of the returned array in the order that they were in
 * supplied array.
 *
 * @param adaptors the adaptors to order according to their tabIndex
 * @return an array of adaptors ordered according to their tabIndex
 * @type Array[GUIAdaptor]
 * @private
 */
TabbingManager.prototype._produceTabbingOrder = function(adaptors)
{
	var ordered = new Array();
	var unordered = new Array();
	
	for(var i = 0, l = adaptors.length; i < l; i++)
	{
		var a = adaptors[i];

		// Check to see if the adaptors supports focussing. If it doesn't
		// then it is ignored in the tabbing order.
		if(null != a.configFocusProtocol)
		{
			var index = a.getTabIndex();
			
			if(0 == index)
			{
				// Add to the unsorted list which will be simply appended to
				// the ordered list after it has been sorted
				unordered.push(a);
			}
			else
			{
				if(index > 0)
				{
					// Add to the ordered list which will be sorted shortly
					ordered.push(a);
				}
				else
				{
					// Negative values of tabIndex mean the adaptor is not in
					// the tab order. RWW - However, if adaptor is focusable
					// the component click handler should be bound to adaptor
					// element
					this._bindEventHandlers(a);
				}
				
				// Set the tab index on the adaptor's focus element HTML tag so
				// that browser tabbing is in the same order as Tabbing Manager
				var focusElement = a.getFocusElement();
				focusElement.setAttribute("tabIndex", index.toString());
			}
		}
	}
		
	// Sort adaptors which have tabIndex specified according to their tabIndex
	ordered.sort(TabbingManager._comparableTabs);
	
	// Set the tab index for the unordered adaptors to the last ordered tab index
	// plus one
	var lastAdaptor = ordered[ordered.length - 1];
	var index = (null == lastAdaptor) ? "1" : String(lastAdaptor.getTabIndex() + 1);
	
	for(i = unordered.length - 1; i >= 0; i--)
	{
		var focusElement = unordered[i].getFocusElement();
		focusElement.setAttribute("tabIndex", index);
	}
	
	// Append the unorder adaptors to the end of the ordered adaptors to produce
	// the final tabbing order.
	ordered = ordered.concat(unordered);

	return ordered;
}


/**
 * Function to compare two adaptors with respect to their tabIndex. Used
 * as a comparator function for JavaScript array sort().
 *
 * @param a the first adaptor
 * @param b the second adaptor
 */
TabbingManager._comparableTabs = function(a, b)
{
	return a.getTabIndex() - b.getTabIndex();
}


/**
 * Add additional adaptors to TabbingManager's tabbing order. Note
 * this method is very limited, and simply adds the supplied adaptors
 * to the end of the tabbing order in the order that they appear in the
 * array. No account is taken of the tabIndex of either the new adaptors
 * or adaptors in the current tabbing order.
 *
 * @param as the Array of adaptors to add.
 */
TabbingManager.prototype.addAdaptors = function(as)
{
	// Produce a new list of adaptors
	var adaptors = this.m_tabOrder.concat(as);
	
	// Regenerate the tab order - this is a list of adaptors that can accept the focus
	// Comment out FormController.tabOrder logic as this does not improve performance
	// and will cause problems with dynamic pages
    //if (!FormController.tabOrder)
    //{
    	this.m_tabOrder = this._produceTabbingOrder(adaptors);
    //}
    //else
    //{
    //    this.m_tabOrder = SerialisationUtils.convertStringArrayToAdaptorArray(FormController.tabOrder); 
    //}
	
	// AL - bind event handlers to the adaptors
	this._bindEventHandlersToAdaptors(this.m_tabOrder);
}


/**
 * Bind tabbing manager event handlers to supplied adaptors
 *
 * @param adaptors the adaptors to which tabbing manager should bind its event
 *   handlers
 */
TabbingManager.prototype._bindEventHandlersToAdaptors = function(adaptors)
{
	for(var i = 0, l = adaptors.length; i < l; i++)
	{
		this._bindEventHandlers(adaptors[i]);
	}
}


/**
 * Bind the required event handlers to the adaptor
 *
 * @param a the adaptor to bind the event handlers for
 */
TabbingManager.prototype._bindEventHandlers = function(a)
{
	// Register a click handler on the main element of the adaptor -
	// the element recognised by the GuiAdaptorFactory and returned
	// by getElement(). Click events in child elements should be bubbled
	// up to the main element (unless they are explicitly prevented
	// from doing so, which would be unusual and is not the case in
	// any current adaptors.
	
	var id = a.getId();
	if(null == this.m_clickEventHandlers[id])
	{
		var tm = this;
		this.m_clickEventHandlers[id] = SUPSEvent.addEventHandler(
			a.getElement(),
			"mousedown",
			function(evt) {tm._handleComponentClick(a, evt);},
			false
		);
	}
}


TabbingManager.prototype._unbindEventHandlers = function(adaptors)
{
	for(var i = 0, l = adaptors.length; i < l; i++)
	{
		var a = adaptors[i];
		
		var id = a.getId();
		var clickEventKey = this.m_clickEventHandlers[id];
		
		if(null != clickEventKey)
		{
		    SUPSEvent.removeEventHandlerKey(clickEventKey);
		    delete this.m_clickEventHandlers[id];
		}
	}
}


TabbingManager.prototype.removeAdaptors = function(as)
{
	var newTabOrder = new Array();
	var currentTabOrder = this.m_tabOrder;
	var currentFocussedAdaptorRemoved = false
	var currentFocussedAdaptor = this.m_currentFocussedAdaptor;
	var currentFocussedAdaptorTabPosition = null;

	var removedAdaptors = new Array();

	// This is not a particularly efficient way of doing this - looping through both arrays
	// More efficient implementations are probably possible
	for(var j = 0, m = as.length; j < m; j++)
	{
		var a = as[j];
		
		for(var i = 0, l = currentTabOrder.length; i < l; i++)
		{
			if(currentTabOrder[i] == a)
			{
				// Check to see if the removed adaptor was the currently focussed adaptor
				if(a == currentFocussedAdaptor)
				{
					currentFocussedAdaptorRemoved = true;
					currentFocussedAdaptorTabPosition = i;
				}

				// If this adaptor is to be removed from the tabindex, set the reference to null
				currentTabOrder[i] = null;
				
				// Add adaptor to list of removed adaptors
				removedAdaptors.push(a);
				
				// Should only be single instance of the adaptor in the tabOrder to skip the rest
				break;
			}
		}
	}
	
	// Free up event handlers associated with removed adaptors
	this._unbindEventHandlers(removedAdaptors);
	
	// If the currently focussed adaptor was removed then look for an adaptor immediately before it
	// in the tab index, or failing that one immmediately after it. If that fails, unset the focus.
	if(currentFocussedAdaptorRemoved)
	{
		var moveFocusAdaptor = null;
		
		// Search backwards...
		for(var i = currentFocussedAdaptorTabPosition; i >= 0; i--)
		{
			if(currentTabOrder[i] != null)
			{
				moveFocusAdaptor = currentTabOrder[i];
				break;
			}
		}
		
		// If no suitable adaptor found, search forwards
		if(null == moveFocusAdaptor)
		{
			for(var i = currentFocussedAdaptorTabPosition, l = currentTabOrder.length; i < l; i++)
			{
				if(currentTabOrder[i] != null)
				{
					moveFocusAdaptor  = currentTabOrder[i];
					break;
				}
			}
		}
		
		// Dispatch a programmic focus event
		this.setFocusOnAdaptor(moveFocusAdaptor);
	}

	// Create the new tab order array
	for(var i = 0, l = currentTabOrder.length; i < l; i++)
	{
		var a = currentTabOrder[i];
		if(a != null)
		{
			newTabOrder.push(a);
		}
	}
	
	// Set the new tab order array
	this.m_tabOrder = newTabOrder;
}


/**
 * Dispose of the tabbing manager. Cleans up event handlers
 */
TabbingManager.prototype.dispose = function()
{
	if(this.m_timeout != null)
	{
		window.clearTimeout(this.m_timeout);
		this.m_timeout = null;
	}

	SUPSEvent.removeEventHandlerKey(this.m_keyDownHandler);
	this.m_keyDownHandler = null;
	
	if( null != this.m_clickEventHandlers )
	{
	    // Protect against possible error when user exits page
	    // before array defined. This probably only occurs when
	    // a page has very many HTML elements like the memory
	    // test pages.
	    var clickEventHandlerKeys = this.m_clickEventHandlers;	
		for(var adaptorId in clickEventHandlerKeys)
		{
			var clickEventHandlerKey = clickEventHandlerKeys[adaptorId];
		    SUPSEvent.removeEventHandlerKey(clickEventHandlerKey);
		    delete clickEventHandlerKeys[adaptorId];
		}

	    var clickEventHandlerKeys = this.m_clickEventHandlers;
	    for(var i = 0, l = clickEventHandlerKeys.length; i < l; i++)
	    {
		    SUPSEvent.removeEventHandlerKey(clickEventHandlerKeys[i])
		    this.m_clickEventHandlers[i] = null;
	    }
	    
	}
	
	if(null != this.m_clickHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_clickHandler);
		this.m_clickHandler = null;
	}

	if(null != this.m_mouseWheelEventHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_mouseWheelEventHandler);
		this.m_mouseWheelEventHandler = null;
	}
}

/*
 * Method used by the form controller to register the form to act upon.
 *
 * @param formElementGUIAdaptor the form adaptor
 * @todo this should be replaced with a general mechanism to allow listeners
 *    to receive "focus changed" events.
 */
TabbingManager.prototype.setFormElementGUIAdaptor = function (formElementGUIAdaptor)
{
	this.m_formElementGUIAdaptor = formElementGUIAdaptor;
}


/**
 * Move the focus to first available field in the tabbing order
 */
TabbingManager.prototype.focusFirstAvailableField = function()
{
	/*("TabbingManager_focusFirstAvailableField")*/
	this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.INITIAL_FOCUS));
	/*("TabbingManager_focusFirstAvailableField")*/
}


/**
 * Resets focus to adaptor whose value was updated, and subsequently failed validation
 *
 * @param a the adaptor whose value was just updated and failed validation
 */
TabbingManager.prototype.setValidationFailedAdaptor = function(a)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.setValidationFailedAdaptor() adaptor = " + a.getId());

	this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.VALIDATION_FAILURE, a));
}


/**
 * Set the focus programmatically from the application
 *
 * @param a the adaptor to set the focus on
 */
TabbingManager.prototype.setFocusOnAdaptor = function(a)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.setFocusOnAdaptor() adaptor = " + TabbingManager._getAdaptorDisplayName(a));

	this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS, a));
}


/**
 * Event Handler to pick up tab key events.
 * Note that this handler is invoked in different ways on
 * different browser. On Mozilla the event in handled on
 * with window during the Event Capture Phase as keys events 
 * cannot be bound to arbitrary elements (or rather the focus
 * cannot be set to arbitrary elements, so key events are
 * never sent to these elements). On IE, focus can be set to
 * any element so keys event handlers can be registered on
 * these elements. We cannot use the same mechanism as we
 * use for Mozilla as IE does not support an Event Capture
 * Phase, only Event Bubbling (see any comparison of the
 * W3C and IE event models for a detailed description of the
 * various Event handling phases).
 *
 * @param e the Key event - will be null on IE
 * @private
 */
TabbingManager.prototype._tabKeyEventHandler = function(e)
{
	if(null == e) e = window.event;
	if(e.keyCode == Key.Tab.m_keyCode)
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._tabKeyEventHandler() e.keyCode == Key.Tab.m_keyCode");

		// Queue the tab key event. If shift key is not pressed, tab forwards, if shift key is pressed, tab backwards
		this.queueTabbingEvent(new TabbingEvent(e.shiftKey ? TabbingEvent.EVENTS.TAB_BACKWARD : TabbingEvent.EVENTS.TAB_FORWARD));

		SUPSEvent.stopPropagation(e);		// Prevent the event from propograting any further up the DOM
	}
}


/**
 * Handle a click on an adaptor
 *
 * @param a the adaptor that clicked upon
 * @param evt the click event - only used for debug logging
 */
TabbingManager.prototype._handleComponentClick = function(a, evt)
{
	if(TabbingManager.m_logger.isDebug())
	{
		if(null == evt) evt = window.event;
	
		// Work around a problem with funit - it doesn't send fully functional events yet
		if(null != evt)
		{
			var targetElement = SUPSEvent.getTargetElement(evt);
		
			TabbingManager.m_logger.debug(
				"TabbingManager._handleComponentClick() adaptor = " + ((a == null) ? a : a.getId())
				 + " target element was of type: " + targetElement.nodeName + " and has id: " + targetElement.id
			);
		}
	}

    // Defect 1106. Major change. Allow all click events to
    // be submitted to tabbing event queue as we can only check
    // adaptor for ability to accept focus after unfocussing
    // current adaptor. However, it is useful to record state
    // of adaptor when mouse click occurred.
	var tabbingEvent = new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS, a);
	
	// Record state of adaptor when clicked
	tabbingEvent.setAcceptFocusOnClick( this._canAdaptorAcceptFocus(a) );
	
	// Queue tabbing event
	this.queueTabbingEvent( tabbingEvent );
}


/**
 * Handle a click event on the html document during the event bubbling phase
 *
 * This event handler will always be invoked after the a click on a
 * component in the document, as we are handling the event in the 
 * bubbling phase of event propogation (which is the only phase that
 * IE supports anyway).
 *
 * @param evt the click event detail (W3C only)
 * @private
 */
TabbingManager.prototype._documentClickEventHandler = function(evt)
{
	var focussedOnAdaptor = false;

	// Determine if component click event handlers added to the adaptors
	// recorded a click on an adaptor.
	var clickedComponent = null;	
	if(this.m_tabbingEvent != null && this.m_tabbingEvent.getType() == TabbingEvent.EVENTS.CLICK_FOCUS)
	{
		clickedComponent = this.m_tabbingEvent.getDetail();
		focussedOnAdaptor = true;
	}
	
	
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._documentClickEventHandler(): Clicked component: " + (null == clickedComponent ? "none" : clickedComponent.getId()));
	
	// If an adaptor was clicked on then we don't do anything here, otherwise
	// we check to see if a label was clicked on, or failing that, the background
	// was clicked on.
	if(null == clickedComponent)
	{
		// Get the event on Internet Explorer
		if(null == evt) evt = window.event;
	
		// If we clicked on a label then focus on the adaptor associated with the label.
		var targetElement = SUPSEvent.getTargetElement(evt);
		var targetForId = targetElement.htmlFor;
		if(targetElement.nodeName == "LABEL" && targetForId != null && targetForId != "")
		{
			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._documentClickEventHandler(): Label click for html id: " + targetForId);

			// If Label's FOR ID has been replaced for non-native adaptor's focus element
			// ID, then work out the actual adaptor id from the adaptor's focus field id.
			var adaptorId = targetForId;
			if(targetElement.fwNonNativeFocus)
			{
				var index = targetForId.indexOf(TabbingManager.NON_NATIVE_FOCUS_ID);
				adaptorId = targetForId.substr(0, index);
			}
			
			// Look up the adaptor
			var targetAdaptor = FormController.getInstance().getAdaptorById(adaptorId);

			// If the adaptor was found which corresponds to the the label forId then we
			// treat a click on the label in the same way as a click on the adaptor. If 
			// the adaptor contains a native HTML control that can accept the focus natively,
			// then we re-write for forId of the label to point at the internal native
			// HTML control. This is required as the browser bubbles the click event on the
			// label up through the element itself, regardless of the actual HTML heirarchy
			// (i.e. the click event on the label starts on the label, bubbles up through the
			// element identified by it's forId and then continues to bubble up through the
			// document element heirarchy in the usual way.
			if(null != targetAdaptor)
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._documentClickEventHandler(): Adaptor found for label for html id: " + targetElement.htmlFor);
				
				if(this._canAdaptorAcceptFocus(targetAdaptor))
				{
				    // Defect 1016. Focus can be assigned to adaptor when the
				    // adaptor is in certain states only.

				    var adaptorElement = targetAdaptor.getElement();
				
			 	    if (!targetElement.fwNonNativeFocus && 
			 	        !this._isHTMLNativeControl(adaptorElement) &&
			 	        this._redirectClickOnLabel(targetAdaptor))
			 	    {
			 	        // Defect 1072. In general, we want to redirect clicks
			 	        // on label to the associated adaptor's focussable element.
			 	        // However, in the case of some adaptors, notably the
			 	        // FwSelectElementGUIAdaptor, we do not wish to do this.
			 	         
			 		    // Non-native control, so we need to focus on the element
			 		    // supplied by the getFocusElement method if there is one
			 		    var focusElement = targetAdaptor.getFocusElement();

			 		    if (adaptorElement != focusElement)
					    {
		
						    // Not focussing on the adaptor itself, so we need to get the browser to
						    // send the onclick event for the label to the focus element. Do this by
						    // by replacing the label's FOR ID with the focus element's ID.
						    
						    // Set an ID for the focus element and replace the label's FOR ID
			 			    focusElement.id = targetAdaptor.getId() + TabbingManager.NON_NATIVE_FOCUS_ID;
			 			    targetElement.htmlFor = focusElement.id;
						
						    // Flag replacement of label's For ID
						    targetElement.fwNonNativeFocus = true;
						
						    //if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._documentClickEventHandler(): Replaced label's FOR ID, now ID is: " + targetElement.htmlFor);
					    }
				    }
				    
				    // Queue tabbing event
				    var tabbingEvent = new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS, targetAdaptor);
				    
				    tabbingEvent.setAcceptFocusOnClick( true );
				    
				    this.queueTabbingEvent( tabbingEvent );
				
				    // Logically, we treat clicking on a label as being equivelent to clicking
				    // on the adaptor, from the point of view of setting the focus.
				    focussedOnAdaptor = true;
				}
			}
			else
			{
				// Adaptor not found for the given id - log an error!
				if(TabbingManager.m_logger.isError()) TabbingManager.m_logger.error("TabbingManager._documentClickEventHandler(): NO Adaptor found for label for html id: " + adaptorId);
			}
		}
		else if(this._isHTMLNativeControl(targetElement))
		{
		    if(targetElement.type != "checkbox")
		    {
		    
		        // Defect 1106. For a native HTML element, except for the checkbox,
		        // not to activate the method _handleComponentClick() the element
		        // must be disabled. In this case we need to submit a click event
		        // to the tabbing manager queue and let the method 
		        // processTabbingEvents() determine whether, or not, to assign focus
		        // to the adaptor.
		        
		        if(targetElement.id && targetElement.id != "")
		        {
		            var targetAdaptor = FormController.getInstance().getAdaptorById(targetElement.id);
		            
		            if(null != targetAdaptor)
		            {
		                var tabbingEvent = new TabbingEvent( TabbingEvent.EVENTS.CLICK_FOCUS, targetAdaptor );
		                
		                tabbingEvent.setAcceptFocusOnClick( false );
		                
		                this.queueTabbingEvent( tabbingEvent );

		                focussedOnAdaptor = true;
		            }
		        }
		    } // Element not a checkbox
		}
		else
		{
			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._documentClickEventHandler(): Document level click did not occur on a label");
		}
	
		// If we didn't click on an adaptor or its label and we have a currently
		// focussed adaptor, then unfocus the current adaptor.
		if(!focussedOnAdaptor && null != this.m_currentFocussedAdaptor)
		{
			this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.CLICK_FOCUS, null));
		}
		
	}
}

/**
 * Method determines whether, or not, clicks on labels
 * should be redirected to their associated adaptors.
 * In the first instance only clicks on labels for
 * framework select elements should not be redirected.
 *
 * @param a The adaptor to be tested.
 * @return Returns "true" if clicks may be redirected otherwise "false"
 *
*/
TabbingManager.prototype._redirectClickOnLabel = function(a)
{
    var redirectClick = true;
    
    if(a instanceof FwSelectElementGUIAdaptor)
    {
        redirectClick = false;
    }
    
    return redirectClick;
}


TabbingManager.prototype._canAcceptFocusNatively = function(a)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._canAcceptFocusNatively()");
	if(window.addEventListener)
	{
		// Mozilla can only accept focus directly on basic form input elements
		var e = a.getFocusElement();
		var isNativeControl = this._isHTMLNativeControl(e);
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._canAcceptFocusNatively() returning" + isNativeControl);
		return isNativeControl;
	}
	else if(window.attachEvent)
	{
		// IE can accept focus on all elements
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._canAcceptFocusNatively(). All elements in IE can accept focus natively so returning true");
		return true;
	}
	else
	{
		fc_assertAlways("TabbingManager._canAcceptFocusNatively: cannot determine browser type");
	}
}


TabbingManager.prototype._isHTMLNativeControl = function(e)
{
	return ("INPUT" == e.nodeName || "SELECT" == e.nodeName || "TEXTAREA" == e.nodeName);
}

/**
 * Important note. This version of _focusAdaptor has been superceded by
 * the version at the end of this file. This version of the method has
 * been temporarily commented out prior to removal if the newer version
 * works correctly.
*/

/*
TabbingManager.prototype._focusAdaptor = function(a, wasClick)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() adaptor = " + a.getId() + ", this.m_currentFocussedAdaptor = " + ((this.m_currentFocussedAdaptor == null) ? "null" : this.m_currentFocussedAdaptor.getId()) + ", wasClick = " + wasClick);
	if(this.m_currentFocussedAdaptor != a)
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() adaptor to focus is different to the currently focussed adaptor. About to unfocus currently focussed adaptor");

		// Clear all selections on the screen (some text fields may still have selected text)
		// Basically just select a TextRange of zero size at the next element.
        //if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() window.attachEvent = " + window.attachEvent + ", this.m_currentFocussedAdaptor = " + this.m_currentFocussedAdaptor);
        var browserSelectionRemoved = false;
        
        if(window.attachEvent 
           && a != null
           && wasClick != true) // if IE and adaptor exists and focus not set by mouse click (Defect 773)
        {
        	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() selecting on a text range to remove selection decided by browser");
          browserSelectionRemoved = true;
          
          var range = document.body.createTextRange();
          range.moveToElementText(a.m_element); 
		  range.moveStart("textedit",1); // Move start of range to end of text
		  range.select(); 
		}
		
		// If unfocus moved the focus programmatically...
		if(null != this.m_servicesSetFocusAdaptor)
		{
			a = this.m_servicesSetFocusAdaptor;
			this.m_servicesSetFocusAdaptor = null;
		}
	
		if(null != a)
		{
			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Adaptor to focus is NOT null. Moving focus to adaptor: " + a.getId());
			this.m_currentFocussedAdaptor = a;
			
			if(null != this.m_currentFocussedAdaptor.onFocus)
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed adaptor has onFocus() method so notifying adaptor of focus loss through FocusProtocol.onFocus()");
				this.m_currentFocussedAdaptor.onFocus()
			}
			else
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed adaptor does not provide an onFocus() method - cannot notify of focus loss");
			}

			if(this._canAcceptFocusNatively(this.m_currentFocussedAdaptor))
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed adaptor can accept the focus natively - setting focus natively");
				
				
				// TODO: Doing this check here doesn't seem to make sense to me!!! Shouldn't we:
				//   a) apply this to non-native adaptors as well and
				//   b) Know that the adaptor is enabled and visisble before we try and set focus on it?
				if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
				{
					//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed native adaptor is enabled and visible");
					if(!wasClick)
					{
						//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed native adaptor was not clicked, so we need to explicitly set focus on the native component");

						// Accept keyboard focus natively using focus() method on element
						//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() calling focus() on getFocusElement() = " + this.m_currentFocussedAdaptor.getFocusElement().id);
						this.m_currentFocussedAdaptor.getFocusElement().focus();
					}
					else
					{
					    // RWW. 18/10/05. Action following click depends on whether IE code to
					    // remove text selected by browser invoked. However, selects do
					    // not display properly if focus is set again!
					    // RWW. 20/10/05 Temporarily comment this out as we need to rethink this problem through
					    //if(browserSelectionRemoved == true)
					    //{
					        //if(!(this.m_currentFocussedAdaptor instanceof SelectElementGUIAdaptor))
					        //{
					        //    this.m_currentFocussedAdaptor.getFocusElement().focus();
					        //}
					    //}
					    //else
					    //{
						    //if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed native adaptor was clicked, so don't need to explicitly call focus on it - normal browser mechanism should focus it!");
						//}
					}
				}
				else
				{
					//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Newly focussed native adaptor either not enabled or not visible (or both)");
				}
			}
			else
			{
				// Note: THIS CODE WILL ONLY EVER BE INVOKED ON MOZILLA AS IE ALLOWS FOCUSSING ON ALL ELEMENTS
				//   THIS CODE WILL NOT WORK ON INTERNET EXPLORER AS IT DOES NOT SUPPORT THE captureEvents() METHOD!
				// Intercept keyboard events on the window and re-route them to
				// the adaptor which the TabbingManager has focussed.
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() calling focus() on this.m_hiddenField = " + this.m_hiddenField);
				this.m_hiddenField.focus();
				window.captureEvents(Event.KEYDOWN);
				window.onkeydown = TabbingManager.handleNonNativeComponentKeyEvents;
				this.m_captureSet = true;
			}

			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() Setting adaptor's FocusProtocol internal focus state to true to enable renderState to determine whether the component should be rendered in the focussed state or not");
			if(this.m_currentFocussedAdaptor.setFocus(true, wasClick))
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() focus state of adaptor has changed. Invoking renderState()");
				
				// @TODO This probably should be actually performed by the FormController
				this.m_currentFocussedAdaptor.renderState();
			}
		}
		else
		{
			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor(). Adaptor to focus IS null. Not focussing anyother component");
		}
	}
	else
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor(): Newly focussed adaptor is the same as currently focussed adaptor");
	
		// Need this else condition for the case where we are setting the focus back on the same
		// adaptor if the adaptor fails validation
		if(this._canAcceptFocusNatively(this.m_currentFocussedAdaptor))
		{
			// TODO: Doing this check here doesn't seem to make sense to me!!! Shouldn't we:
			//   a) apply this to non-native adaptors as well and
			//   b) Know that the adaptor is enabled and visisble before we try and set focus on it?
			if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
			{
				// If focus was set by click, then focus will be set automatically
				if(!wasClick)
				{
					// Accept keyboard focus natively using focus() method on element
					//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() calling focus() on getFocusElement() = " + this.m_currentFocussedAdaptor.getFocusElement().id);
					this.m_currentFocussedAdaptor.getFocusElement().focus();
				}
			}
		}
		else
		{
			// Intercept keyboard events on the window and re-route them to
			// the adaptor which the TabbingManager has focussed.
			//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor() calling focus() on this.m_hiddenField = " + this.m_hiddenField);
			this.m_hiddenField.focus();
			this.m_captureSet = true;
		}
		// need to force a change in the adaptor so that dropdowns refresh themselves, this
		// means we need to force the focus to change, and call render state each time
		// @TODO This definately!!! should be actually performed by the FormController
		if(!wasClick)
		{
			if(null != this.m_currentFocussedAdaptor.onBlur) this.m_currentFocussedAdaptor.onBlur();
			if(null != this.m_currentFocussedAdaptor.onFocus) this.m_currentFocussedAdaptor.onFocus();
		}

		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("Focussed Adaptor: " + this.m_currentFocussedAdaptor.getId());
	}
	this.m_formElementGUIAdaptor._setCurrentFocusedField(this.m_currentFocussedAdaptor);

	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._focusAdaptor(): Focussed adaptor is now: " + (this.m_currentFocussedAdaptor == null ? "null" : this.m_currentFocussedAdaptor.getId()));
}
*/


/**
 * Unfocus the currently focussed adaptor
 *
 * @param moveToAdaptor      The current adaptor to which focus is to be moved.
 * @param forceFocus         Boolean flag indicating whether or not focus must be forced.
 *                           This is the general case as focus must be forced unless
 *                           the focus change is caused by a mouse click.
 * @param acceptFocusOnClick Boolean flag used when value of "forceFocus" is "false".
 *                           Flag is "true" if adaptor was able to accept focus
 *                           when mouse click event occurred. Otherwise, value
 *                           "false". For tabbing events other than mouse clicks
 *                           the value of this argument is null.
 */
TabbingManager.prototype._unfocusCurrentFocussedAdaptor = function( moveToAdaptor, 
                                                                    forceFocus,
                                                                    acceptFocusOnClick
                                                                   )
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._unfocusCurrentFocussedAdaptor() this.m_currentFocussedAdaptor = " + ((this.m_currentFocussedAdaptor == null) ? "null" : this.m_currentFocussedAdaptor.getId()) + ", this.m_captureSet = " + this.m_captureSet);
	if(null != this.m_currentFocussedAdaptor)
	{
		if(this.m_captureSet)
		{
			window.onkeydown = null;
			window.releaseEvents(Event.KEYDOWN);
			this.m_captureSet = false;
		}
		if(this.m_currentFocussedAdaptor.setFocus(false))
		{
			// @TODO This probably should be actually performed by the FormController
			this.m_currentFocussedAdaptor.renderState();
		}
		
		if(null != this.m_currentFocussedAdaptor.onBlur) this.m_currentFocussedAdaptor.onBlur();
		
		// Defect 1106. Determine whether focus is to be put on another
		// adaptor or the background window
		if(forceFocus)
		{
		    // Focus change has not been caused by mouse click event
		    if(null == moveToAdaptor)
		    {
		        this._determineBackgroundFocus();
		    }
		}
		else
		{
		    if(null != moveToAdaptor)
		    {
		        // Click on adaptor. Check whether adaptor can accept focus.
		        if(!this._canAdaptorAcceptFocus(moveToAdaptor) &&
		           acceptFocusOnClick != true)
		        {
		            this._determineBackgroundFocus();
		        }
		    }
		    else
		    {
		        // Click on background.
		        this._determineBackgroundFocus();
		    }
		}
		
		this.m_currentFocussedAdaptor = null;
	}
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._unfocusCurrentFocussedAdaptor() completed, this.m_currentFocussedAdaptor = " + TabbingManager._getAdaptorDisplayName(this.m_currentFocussedAdaptor));
}



TabbingManager.handleNonNativeComponentKeyEvents = function(evt)
{
	var tm = FormController.getInstance().getTabbingManager();
	var adaptor = tm.m_currentFocussedAdaptor;
	
	if(adaptor.configKeybindingProtocol && adaptor.m_keys)
	{
		adaptor.m_keys.handleKeyEvent(evt);
	}
}

TabbingManager.prototype.handleScrollMouse = function(evt)
{
    var propagateEvent = true;
	var adaptor = this.m_currentFocussedAdaptor;
	
	if(adaptor && adaptor.configMouseWheelBindingProtocol)
	{
		// If IE the use the global event
		if(null == evt) { evt = window.event; }
		
		propagateEvent = adaptor.handleScrollMouse(evt);
		
		if(propagateEvent != true)
		{
			// Adaptor doesn't want to propagate the event or
			// not defined, so prevent default action of event
			SUPSEvent.preventDefault(evt);
		}
	}
	
	return propagateEvent;
}


TabbingManager.prototype.updateFocus = function()
{
	// Check that currently focussed adaptor can still accept focus, otherwise perform a TAB_FORWARD event to shift to the next available field
	if((null == this.m_tabbingEvent) && (null != this.m_currentFocussedAdaptor) && !this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
	{	
		// D1127 - If currently focussed adaptor is a button GUI adaptor and button is configured to be inactive when handling
		// event then don't queue the tabbing event because button will be reactivated when event handling has completed
		if(!(this.m_currentFocussedAdaptor instanceof ButtonInputElementGUIAdaptor && this.m_currentFocussedAdaptor.m_inactiveWhilstHandlingEvent))
		{
			this.queueTabbingEvent(new TabbingEvent(TabbingEvent.EVENTS.TAB_FORWARD));
		}
	}	
}

/**
 * Important note. This version of processTabbingEvents has been superceded by
 * the version at the end of this file. This version of the method has
 * been temporarily commented out prior to removal if the newer version
 * works correctly.
*/

/*
TabbingManager.prototype.processTabbingEvents = function()
{
	if(null != this.m_tabbingEvent)
	{
		var moveToAdaptor = null;
		var forceFocus = true;
	
		// Get local reference to tabbing event - processing current tabbing events 
		// may result in the generation of new events of higher priority, in which
		// case we may need to re-enter the tab processing event loop. 
		var tabbingEvent = this.m_tabbingEvent;
	
		switch(this.m_tabbingEvent.getType())
		{
			case TabbingEvent.EVENTS.TAB_FORWARD:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling TAB_FORWARD event");
				// Move the focus to next adaptor in the tabbing order that can accept focus.
				// Invoke moveFocus method on current adaptor if configured
				moveToAdaptor = this._tabFromAdaptor(this.m_currentFocussedAdaptor, true);
				break;
			}
			
			case TabbingEvent.EVENTS.TAB_BACKWARD:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling TAB_BACKWARD event");
				// Move the focus to previous adaptor in the tabbing order that can accept focus.
				// Invoke moveFocus method on current adaptor if configured
				moveToAdaptor = this._tabFromAdaptor(this.m_currentFocussedAdaptor, false);
				break;
			}
			
			case TabbingEvent.EVENTS.VALIDATION_FAILURE:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling VALIDATION_FAILURE event");
				// Move the focus back to the field which was just updated and failed validation.
				// Detail attribute of event contains the adaptor to move focus back to.
				moveToAdaptor = this.m_tabbingEvent.getDetail();
				break;
			}
			
			case TabbingEvent.EVENTS.CLICK_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling CLICK_FOCUS event");
				// Move the focus to the adaptor that was clicked on, also handles clicking on form
				// which causes no adaptor to be focussed.
				moveToAdaptor = this.m_tabbingEvent.getDetail()
				
				forceFocus = false;
				break;
			}
			
			case TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling PROGRAMMATIC_FOCUS event");
				// Focus explicitly set by the application. Detail contains the adaptor to focus. May
				// be null to unset the focus.
				moveToAdaptor = this._handleProgrammaticEvent(this.m_tabbingEvent.getDetail());
				break;
			}
			
			case TabbingEvent.EVENTS.INITIAL_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling INITIAL_FOCUS event");
				// Find the first available adaptor on the form
				moveToAdaptor = this._tabFromAdaptor(null, true);
				break;
			}
		}
		
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): this.m_currentFocussedAdaptor = " + TabbingManager._getAdaptorDisplayName(this.m_currentFocussedAdaptor) + ", moveToAdaptor = " + TabbingManager._getAdaptorDisplayName(moveToAdaptor));

		// Unfocussing adaptors might generate additional tabbing events.
		// A specific scenario is when adaptors use the FocusProtcols
		// onBlur and onFocus methods to update the model (for instance
		// the AutoComplete and DatePicker adaptors). The onBlur()
		// method is called during the unfocusCurrentFocussedAdaptor
		// method below, which will result in the DataModel being
		// updated. If the component has a validation method which fails
		// as a result of the new value being written to the DataModel
		// a validation failure tabbing event may be generated, in which
		// case we need to reprocess the tabbing events to ensure that
		// there isn't a higher priority tabbing event that should be
		// processed instead
		if(moveToAdaptor != this.m_currentFocussedAdaptor)
		{
			this._unfocusCurrentFocussedAdaptor(
				null != moveToAdaptor		// Is another adaptor about to be focussed?
			);
		}
		
		// If a new height priority tabbing event has been generated,
		// then re-process tabbing events now...
		if(this.m_tabbingEvent != tabbingEvent)
		{
			this.processTabbingEvents();
		}
		else
		{
			// Process the current tabbing event as normal
			if(null != moveToAdaptor)
			{
				this._focusAdaptor(moveToAdaptor, !forceFocus);
			}
		}
		
		this.m_tabbingEvent = null;
	}
}
*/

TabbingManager._getAdaptorDisplayName = function(adaptor)
{
	return (null == adaptor ? "null" : adaptor.getDisplayName());
}

/**
 * Queues a tabbing event. Note that the event will be ignored if there is
 * a tabbing event already queued with equal or higher prioity. Likewise a
 * previously queued tabbing event may be disposed of if the new tabbing
 * event is of higher priority. 
 */
TabbingManager.prototype.queueTabbingEvent = function(evt)
{
	if(null == this.m_tabbingEvent)
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.queueTabbingEvent(): no event queued so queuing event");
		// No event queued so queue this one.
		this.m_tabbingEvent = evt;
	}
	else
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.queueTabbingEvent(): existing event priority: " + this.m_tabbingEvent.getPriority() + " new event of priority: " + evt.getPriority());
		// Already have an existing event queued, so need to determine
		// whether or not to keep the current queued event or whether to
		// replace it with the new one. This is done on basis of the priority
		// of the event
		if(this.m_tabbingEvent.getPriority() < evt.getPriority())
		{
			this.m_tabbingEvent = evt;
		}
	}
	
	if(null == this.m_timeout)
	{
		this.m_timeout = setTimeout("TabbingManager._processTabbingEvents()", 0);
	}
}


TabbingManager.prototype._getEventType = function(evt)
{
	for(i in TabbingEvent.EVENTS)
	{
		if(evt == TabbingEvent.EVENTS[i])
		{
			return i;
		}
	}
	
	return null;
}




TabbingManager._processTabbingEvents = function()
{
	var fc = FormController.getInstance();
	
	// Check for existance of FormController as occasionally cancelling timeout in dispose()
	// does not work, and this may fail
	if(null != fc)
	{
		var tm = fc.getTabbingManager();
		
		// Reset the timeout
		tm.m_timeout = null;
		
		// Process the queued event
		tm.processTabbingEvents();
	}
}




TabbingManager.prototype._tabFromAdaptor = function(adaptor, forward)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._tabForwardFromAdaptor()");
	
	// Adaptor to start searching from. By default we start from the initial adaptor
	var startAdaptor = adaptor;

	// Check to see if the initial adaptor wants to force a move
	// to a particular next adaptor due to application configuration
	var moveToAdaptor = null;
	if(null != adaptor)
	{
		moveToAdaptor = this._checkForProgrammaticMove(adaptor, forward);
	}
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._tabForward() moveToAdaptor = " + ((moveToAdaptor == null) ? "null" : moveToAdaptor.getId()) );
	
	// If the initial adaptor returned an adaptor to focus on next, check to see 
	// if it can accept the focus. If it can't, then we need to search forward from
	// the moveToAdaptor
	if(null != moveToAdaptor && !this._canAdaptorAcceptFocus(moveToAdaptor))
	{
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._tabForwardFromAdaptor() moveToAdaptor could not accept focus. Searching forward through tabbing order from moveToAdaptor");
		
		// Override our initial 
		startAdaptor = moveToAdaptor;
		
		// Force search by reseting this value to null...
		moveToAdaptor = null;
	}

	// If the adaptor did not force a move to a next adaptor or the moveToAdaptor
	// could not accept the focus, then search through the tabbing order (forwards
	// or backwards as determined by the forward parameter) for the next adaptor
	// in the tabbing order that can accept the focus.
	if(null == moveToAdaptor)
	{
		moveToAdaptor = forward ? this._searchTabbingOrderForward(startAdaptor) : this._searchTabbingOrderBackward(startAdaptor);
	}

	// No adaptor found which can accept the focus - we'll log an error for now...	
	if (null == moveToAdaptor)
	{
		if(TabbingManager.m_logger.isError()) TabbingManager.m_logger.error("TabbingManager._tabFromAdaptor(): No adaptor available which can accept the focus");
	}
	
	return moveToAdaptor;
}


TabbingManager.prototype._checkForProgrammaticMove = function(adaptor, forward)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._checkForProgrammicMove() this.m_currentFocussedAdaptor = " + adaptor.getId());
	var moveToAdaptor = null;
	
	// If we have a currently focussed adaptor, check to see if it
	// wants to force the focus somewhere.
	moveToAdaptorId = adaptor.invokeMoveFocus(forward);
	for(var i = 0, l = this.m_tabOrder.length; i < l; i++)
	{
		if(this.m_tabOrder[i].getId() == moveToAdaptorId)
		{
			moveToAdaptor = this.m_tabOrder[i];
			break;
		}
	}
	
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._checkForProgrammicMove() moveToAdaptor = " + ((moveToAdaptor == null) ? "null" : moveToAdaptor.getId()) );
	return moveToAdaptor;
}


TabbingManager.prototype._searchTabbingOrderForward = function(startAdaptor)
{
	var moveToAdaptor = null;
	
	// Default to last position in the tab order
	var startPosition = this.m_tabOrder.length - 1;

	if(null != startAdaptor)
	{
		// Get the position of the startAdaptor from the tabOrder
		var currentPosition = this._getTabPositionOfAdaptor(startAdaptor);

	    // If the adaptor was found in the tab order, then set the new
	    // position to that of the currentPosition, otherwise leave the
	    // position at the start of the tabOrder
		if(currentPosition != null)
		{
			startPosition = currentPosition;
		}
	}
		
	// Search forwards in the tabbing order until we find an enabled adaptor
	// that can accept the focus, or we loop back round to the tabOrder to
	// where we started from.
	var position = startPosition;
	var found = false;
	if(this.m_tabOrder.length > 0)
	{
		do
		{
			// Move to the next position in the tab order and wrap
			// round to the beginning of the tab order if necessary
			position++;
			if(position > this.m_tabOrder.length - 1)
			{
				position = 0;
			}
	
			// If adaptor can accept the focus then this is the adaptor that
			// will receive the focus
			found = this._canAdaptorAcceptFocus(this.m_tabOrder[position]);
		}
		while(position != startPosition && !found)
	}
		
	if(found)
	{
		moveToAdaptor = this.m_tabOrder[position];
	}

	return moveToAdaptor;
}




TabbingManager.prototype._searchTabbingOrderBackward = function(startAdaptor)
{
	var moveToAdaptor = null;

	// Default positon to start of the tabbing order
	var startPosition = 0;

	// If we have a currently focussed adaptor
	if(null != startAdaptor)
	{
		// Get the position of the currently focussed adaptor in the tab order
		var currentPosition = this._getTabPositionOfAdaptor(startAdaptor);

	    // If the adaptor was found in the tab order, then set the new
	    // position to that of the currentPosition, otherwise leave the
	    // position at the start of the tabOrder
		if(currentPosition != null)
		{
			startPosition = currentPosition;
		}
	}
	
	// Search backwards in the tabbing order until we find an enabled adaptor
	var position = startPosition;
	var found = false;
	if(this.m_tabOrder.length > 0)
	{
		do
		{
			// Move to the previous position in the tab order and wrap
			// round to the start of the tab order if necessary
			position--;
			if(position < 0)
			{
				position = this.m_tabOrder.length - 1;
			}
			
			// If adaptor can accept the focus then this is the adaptor that
			// will receive the focus
			found = this._canAdaptorAcceptFocus(this.m_tabOrder[position]);
		}
		while(position != startPosition && !found)
	}

	if(found)
	{
		moveToAdaptor = this.m_tabOrder[position];
	}
	
	return moveToAdaptor;
}



TabbingManager.prototype._getTabPositionOfAdaptor = function(a)
{
	// Id of the adaptor being searched for
	var id = a.getId();
	
	for(var i = 0, l = this.m_tabOrder.length; i < l; i++)
	{
		if(this.m_tabOrder[i].getId() == id)
		{
			return i;
		}
	}
	
	return null;
}


TabbingManager.prototype._handleProgrammaticEvent = function(a)
{
	// If adaptor can accept focus, then simply return the adaptor,
	// otherwise search forwards through the tabbing order until
	// the an adaptor is found that can accept the focus.
	if(a != null && this._canAdaptorAcceptFocus(a))
	{
		return a;
	}
	else
	{
		return this._tabFromAdaptor(a, true);
	}
}

TabbingManager.prototype._canAdaptorAcceptFocus = function(a)
{
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._canAdaptorAcceptFocus() adaptor = " + a.getId());
	// If adaptor supports enablement and isEnabled or doesn't support enablement
	// (and is therefore always enabled) and is currently visible.
	
	// Check if the adaptor is prepared to accept the focus. Safe to do this without
	// checking for focusProtocol, because by definition all adaptors in the
	// tabbing order have FocusProtocol. Enables an adaptor to reject the focus for
	// any reason.
	var accept = a.acceptFocus();
	
	var enabled = false ;
	var active = false ;
	var readonly = false ;
	
	//If it does not support the enabled protocol the it is enabled
	if (false == a.supportsProtocol("EnablementProtocol"))
	{
		enabled = true ;
	}
	else
	{
		enabled = a.getEnabled() ;
	}
	
	//If it does not support the active protocol the it is active
	if (false == a.supportsProtocol("ActiveProtocol"))
	{
		active = true ;
	}
	else
	{
		active = a.isActive() ;
	}
	
	//If it does not support the readOnly protocol then it is not readonly
	if (false == a.supportsProtocol("ReadOnlyProtocol"))
	{
		readonly = false ;
	}
	else
	{
		readonly = a.getReadOnly();
	}

	var result = accept && enabled && active && !readonly && isElementVisible(a.getElement());
	//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager._canAdaptorAcceptFocus() returning " + result);

	return result;
}

/**
 * This method resets the browser focus on the current focussed adaptor focus element. In
 * explanation when a service is invoked and the progress bar is raised the browser focus
 * must be assigned to the progress bar such that key presses and mouse clicks are blocked.
 * However, the logically focussed adaptor does not change. When the progress bar is
 * lowered the browser focus should return to the currently focussed adaptor.
 *
*/
TabbingManager.prototype.resetBrowserFocusOnCurrentFocussedAdaptor = function()
{
    if(null != this.m_currentFocussedAdaptor)
    {
        // This may seem strange but we need to check that we really
        // can set focus on the current focussed adaptor. The adaptor
        // may have been made temporarily inactive.
        if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
        {
            this.m_currentFocussedAdaptor.getFocusElement().focus();
        }
    }
}

/**
 * Reworked versions of processTabbingEvents and _focusAdaptor for fix
 * of defect 1077.
 *
 *
*/

/**
 * Method processes current tabbing event in queue.
 *
*/
TabbingManager.prototype.processTabbingEvents = function()
{
	if(null != this.m_tabbingEvent)
	{
	    var tabForward = null;
		var moveToAdaptor = null;
		var forceFocus = true;
		var clearTabEvent = true;
	
		// Get local reference to tabbing event - processing current tabbing events 
		// may result in the generation of new events of higher priority, in which
		// case we may need to re-enter the tab processing event loop. 
		var tabbingEvent = this.m_tabbingEvent;
	
		switch(this.m_tabbingEvent.getType())
		{
			case TabbingEvent.EVENTS.TAB_FORWARD:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling TAB_FORWARD event");
				// Move the focus to next adaptor in the tabbing order that can accept focus.
				// Invoke moveFocus method on current adaptor if configured
				moveToAdaptor = this._tabFromAdaptor(this.m_currentFocussedAdaptor, true);
				tabForward = true;
				break;
			}
			
			case TabbingEvent.EVENTS.TAB_BACKWARD:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling TAB_BACKWARD event");
				// Move the focus to previous adaptor in the tabbing order that can accept focus.
				// Invoke moveFocus method on current adaptor if configured
				moveToAdaptor = this._tabFromAdaptor(this.m_currentFocussedAdaptor, false);
				tabForward = false;
				break;
			}
			
			case TabbingEvent.EVENTS.VALIDATION_FAILURE:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling VALIDATION_FAILURE event");
				// Move the focus back to the field which was just updated and failed validation.
				// Detail attribute of event contains the adaptor to move focus back to.
				moveToAdaptor = this.m_tabbingEvent.getDetail();
				break;
			}
			
			case TabbingEvent.EVENTS.CLICK_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling CLICK_FOCUS event");
				// Move the focus to the adaptor that was clicked on, also handles clicking on form
				// which causes no adaptor to be focussed.
				moveToAdaptor = this.m_tabbingEvent.getDetail()
				
				forceFocus = false;
				break;
			}
			
			case TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling PROGRAMMATIC_FOCUS event");
				// Focus explicitly set by the application. Detail contains the adaptor to focus. May
				// be null to unset the focus.
				moveToAdaptor = this._handleProgrammaticEvent(this.m_tabbingEvent.getDetail());
				break;
			}
			
			case TabbingEvent.EVENTS.INITIAL_FOCUS:
			{
				//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): Handling INITIAL_FOCUS event");
				// Find the first available adaptor on the form
				moveToAdaptor = this._tabFromAdaptor(null, true);
				break;
			}
		}
		
		//if(TabbingManager.m_logger.isDebug()) TabbingManager.m_logger.debug("TabbingManager.processTabbingEvents(): this.m_currentFocussedAdaptor = " + TabbingManager._getAdaptorDisplayName(this.m_currentFocussedAdaptor) + ", moveToAdaptor = " + TabbingManager._getAdaptorDisplayName(moveToAdaptor));
		
		// Defect 1093.
		// When changing focus using tab keys temporarily store reference to current
		// focussed adaptor as we must recalculate move to adaptor in case
		// defocussing the current adaptor enables a more suitable adaptor to
		// accept focus.
		var previousFocussedAdaptor = null;
		
		if(null != tabForward)
		{
		    previousFocussedAdaptor = this.m_currentFocussedAdaptor;
		}

		// Unfocussing adaptors might generate additional tabbing events.
		// A specific scenario is when adaptors use the FocusProtcols
		// onBlur and onFocus methods to update the model (for instance
		// the AutoComplete and DatePicker adaptors). The onBlur()
		// method is called during the unfocusCurrentFocussedAdaptor
		// method below, which will result in the DataModel being
		// updated. If the component has a validation method which fails
		// as a result of the new value being written to the DataModel
		// a validation failure tabbing event may be generated, in which
		// case we need to reprocess the tabbing events to ensure that
		// there isn't a higher priority tabbing event that should be
		// processed instead
		
		if(moveToAdaptor != this.m_currentFocussedAdaptor)
		{   
			this._unfocusCurrentFocussedAdaptor(
				moveToAdaptor, 
				forceFocus,
				tabbingEvent.getAcceptFocusOnClick()	// Is another adaptor about to be focussed?
			);
		}
		
		// If a new height priority tabbing event has been generated,
		// then re-process tabbing events now...
		if(this.m_tabbingEvent != tabbingEvent)
		{
			this.processTabbingEvents();
		}
		else
		{
			// Process the current tabbing event as normal.
			
			// Defect 1106. When processing click event check
			// whether adaptor that received click can now accept
			// focus. If not deactivate focussing operation by
			// setting moveToAdaptor to null.
			if(!forceFocus &&
			   (null != moveToAdaptor) &&
			   (tabbingEvent.getAcceptFocusOnClick()!= true))
			{
			    if(!this._canAdaptorAcceptFocus(moveToAdaptor))
			    {
			        moveToAdaptor = null;
			    }
			}
			    
			if(null != moveToAdaptor)
			{
			    if(null != tabForward)
			    {
			        if(null == this.m_currentFocussedAdaptor)
			        {
			            // Defect 1093.
			            // If using tab keys re-check move to adaptor.
			            var newMoveToAdaptor = this._tabFromAdaptor( previousFocussedAdaptor,
			                                                         tabForward );
			        
			            if(newMoveToAdaptor && newMoveToAdaptor != moveToAdaptor)
			            {
			                moveToAdaptor = newMoveToAdaptor;
			                newMoveToAdaptor = null;
			            }
			            
			        }
			        
			        previousFocussedAdaptor = null;
			        
			    }
			    
			    // Focus on move to adaptor
			    var focusDetails = this._focusAdaptor(moveToAdaptor, 
			                                          !forceFocus,
			                                          tabbingEvent.getAcceptFocusOnClick());
			    
				if(!focusDetails["focusSetOnAdaptor"])
				{
				    // Change of circumstances means that focus cannot be assigned
				    // to adaptor. This is probably because "onBlur" of previous
				    // focussed adaptor caused target adaptor to be disabled.
				    // Locate new adaptor target and submit to tabbing queue.
				    var focusAdaptor = focusDetails["focusAdaptor"];
				    
				    var newFocusAdaptor = this._tabFromAdaptor(focusAdaptor, true);
				    
				    if(null != newFocusAdaptor)
				    {
				        // Prevent method from clearing tabbing event queue
				        // because we need to submit new tabbing event
				        clearTabEvent = false;
				        
				        if((!forceFocus) &&
				           (focusAdaptor instanceof SelectElementGUIAdaptor))
				        {
				            // For some reason refocussing on new adaptor after
				            // clicking on select does not work correctly without
				            // moving focus away from select.
				            window.focus();
				        }
				        
				        this.queueTabbingEvent( new TabbingEvent( TabbingEvent.EVENTS.PROGRAMMATIC_FOCUS,
				                                                  newFocusAdaptor ) );
				    }
				    else
				    {
				        // If get here we cannot focus on any adaptor!!
				        window.focus();
				    }
				}
			}
		}
		
		if(clearTabEvent)
		{
		    this.m_tabbingEvent = null;
		}
	} // End of if(null != this.m_tabbingEvent)
}

/**
 * Method controls assignment of focus to a new adaptor.
 *
 * @param a                  The adaptor to which focus is to be assigned
 * @param wasClick           Boolean flag indicating whether, or not, focus
 *                           assignment was initiated by a mouse click over an
 *                           adaptor component.
 * @param acceptFocusOnClick Boolean flag used when value of "wasClick" is "true".
 *                           Flag is "true" if adaptor was able to accept focus
 *                           when mouse click event occurred. Otherwise, value
 *                           "false". For tabbing events other than mouse clicks
 *                           the value of this argument is null.
 *
 * @return         Returns a object with two properties. "focusSetOnAdaptor"
 *                 is a boolean flag indicating whether, or not, the focus
 *                 assignment was successful. "focusAdaptor" identifies
 *                 the adaptor to which focus assignment was attempted.
 */
TabbingManager.prototype._focusAdaptor = function(a, wasClick, acceptFocusOnClick)
{
    // Set default value
    var focusSetOnAdaptor = true;
    
	if(this.m_currentFocussedAdaptor != a)
	{
		// Clear all selections on the screen (some text fields may still have selected text)
		// Basically just select a TextRange of zero size at the next element.
        
        if(window.attachEvent 
           && a != null
           && wasClick != true) // if IE and adaptor exists and focus not set by mouse click (Defect 773)
        {
          
          var range = document.body.createTextRange();
          range.moveToElementText(a.m_element); 
		  range.moveStart("textedit",1); // Move start of range to end of text
		  // DIR changes: Removed range.select() as it caused screen contents to scroll down in IE7 
		}
		
		// If unfocus moved the focus programmatically...
		if(null != this.m_servicesSetFocusAdaptor)
		{
			a = this.m_servicesSetFocusAdaptor;
			this.m_servicesSetFocusAdaptor = null;
		}
	
		if(null != a)
		{
		    // Attempt to move focus to new adaptor
		    focusSetOnAdaptor = this._moveFocusToAdaptor( a, wasClick, acceptFocusOnClick );
		}
		else
		{
		    // Adaptor is null
		}
	}
	else
	{
		// Need this else condition for the case where we are setting the focus back on the same
		// adaptor if the adaptor fails validation
		if(this._canAcceptFocusNatively(this.m_currentFocussedAdaptor))
		{
			// TODO: Doing this check here doesn't seem to make sense to me!!! Shouldn't we:
			//   a) apply this to non-native adaptors as well and
			//   b) Know that the adaptor is enabled and visisble before we try and set focus on it?
			if(this._canAdaptorAcceptFocus(this.m_currentFocussedAdaptor))
			{
				// If focus was set by click, then focus will be set automatically
				if(!wasClick)
				{
					// Accept keyboard focus natively using focus() method on element
					this.m_currentFocussedAdaptor.getFocusElement().focus();
				}
			}
		}
		else
		{
			// Intercept keyboard events on the window and re-route them to
			// the adaptor which the TabbingManager has focussed.
			this.m_hiddenField.focus();
			this.m_captureSet = true;
		}
		// need to force a change in the adaptor so that dropdowns refresh themselves, this
		// means we need to force the focus to change, and call render state each time
		// @TODO This definately!!! should be actually performed by the FormController
		if(!wasClick)
		{
			if(null != this.m_currentFocussedAdaptor.onBlur) this.m_currentFocussedAdaptor.onBlur();
			if(null != this.m_currentFocussedAdaptor.onFocus) this.m_currentFocussedAdaptor.onFocus();
		}

	}
	
	this.m_formElementGUIAdaptor._setCurrentFocusedField(this.m_currentFocussedAdaptor);
	
	// Return both flag indicating whether, or not, focus has been put on
	// adaptor and adaptor itself as this may not be the same as the adaptor
	// passed in.
	var returnProperties = new Object();
	
	returnProperties["focusSetOnAdaptor"] = focusSetOnAdaptor;
	returnProperties["focusAdaptor"] = a;

    return returnProperties;
}

/**
 * Method assigns focus to adaptor.
 *
 * @param a                  The adaptor to which focus is to be assigned
 * @param wasClick           Boolean flag indicating whether, or not, focus
 *                           assignment was initiated by a mouse click over an
 *                           adaptor component.
 * @param acceptFocusOnClick Boolean flag used when value of "wasClick" is "true".
 *                           Flag is "true" if adaptor was able to accept focus
 *                           when mouse click event occurred. Otherwise, value
 *                           "false". For tabbing events other than mouse clicks
 *                           the value of this argument is null.
 *
 * @return         Returns "true" if adaptor able to accept focus.
 *                 Otherwise returns "false".
 *
*/
TabbingManager.prototype._moveFocusToAdaptor = function( adaptor, 
                                                         wasClick, 
                                                         acceptFocusOnClick )
{
    var focusMovedToAdaptor = true;
    
    if(this._canAcceptFocusNatively(adaptor))
    {
        // Essentially means browser is IE as in IE most HTML components
        // can accept focus.
        
        if(this._canAdaptorAcceptFocus(adaptor))
        {
            // Perform tasks required to place focus on adaptor
            this.m_currentFocussedAdaptor = adaptor;
            
            if(null != this.m_currentFocussedAdaptor.onFocus)
            {
                this.m_currentFocussedAdaptor.onFocus();
            }
            
            if(!wasClick)
            {
                // User tabbed onto adaptor so we have to set focus on
                // adaptor's focus element
                this.m_currentFocussedAdaptor.getFocusElement().focus();
            }
            else
            {
                // Focus being set by click. Check state of adaptor when
                // mouse click occurred.
                if(!acceptFocusOnClick)
                {
                    if(this.m_currentFocussedAdaptor instanceof SelectElementGUIAdaptor)
                    {
                        // For some reason focus must be reassigned to select adaptor
                        this.m_currentFocussedAdaptor.getFocusElement().focus();
                    }
                }
            }
            
            if(this.m_currentFocussedAdaptor.setFocus( true, wasClick ))
            {
                this.m_currentFocussedAdaptor.renderState();
            }
            
        }
        else
        {
            // Target adaptor cannot accept focus
            focusMovedToAdaptor = false;
        }
        
    }
    else
    {
        // Mozilla (w3c)? specific code section
        // Basically implement same actions as original
        // "_focusAdaptor" method.
        this.m_currentFocussedAdaptor = adaptor;
            
        if(null != this.m_currentFocussedAdaptor.onFocus)
        {
            this.m_currentFocussedAdaptor.onFocus();
        }
        
        this.m_hiddenField.focus();
		window.captureEvents(Event.KEYDOWN);
		window.onkeydown = TabbingManager.handleNonNativeComponentKeyEvents;
	    this.m_captureSet = true;
	    
	    if(this.m_currentFocussedAdaptor.setFocus( true, wasClick ))
        {
            this.m_currentFocussedAdaptor.renderState();
        }
    }
    
    return focusMovedToAdaptor; 
}

/**
 * Determines where to put the background focus. If there is a current focussed
 * adaptor and the adaptor has a parent then the focus is placed on the parent
 * otherwise the focus is placed on the window.
*/
TabbingManager.prototype._determineBackgroundFocus = function()
{
	if(this.m_currentFocussedAdaptor != null)
	{
	    var parentContainer = this.m_currentFocussedAdaptor.getParentContainer();
	    
	    if(parentContainer != null)
	    {
	    	// We have a parent container, so get it's focus element
			var focusElement = parentContainer.supportsProtocol("FocusProtocolHTMLImpl") ?
							   parentContainer.getFocusElement() :
							   parentContainer.getElement();
			
		    if(focusElement.tagName == 'FORM')
		    {
		        // Replace form element with parent body if possible because form
		        // elements cannot accept the focus
		        var parent = focusElement.parentNode;
		        
		        while(parent != null)
		        {
		            if(parent.tagName == 'BODY')
		            {
		                focusElement = parent;
		                break;
		            }
		            
		            parent = parent.parentNode;
		        }
		    }
		    
		    if(!focusElement.disabled && isElementVisible(focusElement) && focusElement.focus)
		    {
				// Focus element is enabled, visible and can accept focus, so OK to focus on it
				focusElement.focus();
			}
			else
			{
		    	// Focus element is disabled or hidden or can't accept focus, so focus on the window
	    		window.focus();
			}
	    }
	    else
	    {
	    	// No parent container for the current focussed adaptor, so focus on the window
	    	window.focus();
	    }
    }
    else
    {
    	// No current focussed adaptor, so focus on the window
    	window.focus();
    }
}
