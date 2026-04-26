 /**
 * Popup help class. To be used as a singleton!
 *
 * The user moves the mouse into an element which causes the mouseover event to
 * fire. The showEvent handler is called. This creates the tooltip help within
 * an IFRAME. It then sets a timeout for the showTrigger method to be called after
 * 1 second.
 *
 * If the user moves the mouse within the element the mousemove event fires. The
 * moveEvent handler is called. This stores the current mouse co-ordinates so that
 * the tooltip help can be shown at the final position of the mouse within the element.
 * In IE, adaptors with a drop down, e.g. date pickers, capture the mouse. To prevent
 * the tooltip help appearing anywhere other than within the element the moveEvent
 * method also determines whether or not the mouse is within the element. This sets a
 * show/don't show tooltip help flag used by the show method.
 *
 * If after 1 second the user has not moved out of the element then the showTrigger
 * method is called. This then calls the show method. The 1 second delay before calling
 * the show method prevents the tooltip help from being shown as the user moves over
 * elements in a form.
 *
 * The show method alters the position of the tooltip help if necessary and makes it
 * visible. It then sets a timeout for the hideTrigger method to called after 3 seconds.
 *
 * If the user clicks in the element the mousedown event fires. The clickEvent handler
 * is called. This determines if the click is within the element, if so then the hide
 * method is called.
 *
 * If the user moves the mouse out of an element then the mouseout event fires. The
 * hideEvent handler is called. This first determines whether the mouseout is within
 * the element. If it is then don't do anything otherwise the hide method is called
 * to make the tooltip help invisible.
 *
 * If after 3 seconds the user has not clicked in or moved out of the element then the
 * hideTrigger method is called. This then calls the hide method.
 *
 * The hide method makes the tooltip help invisible and clears timeouts etc.
 */

// First determine current browser in use
if (window.attachEvent)
{
	// IE DOM syntax
	PopupHelp.isIE = true;
	PopupHelp.isMoz = false;
}
else if (window.addEventListener)
{
	// W3C DOM (and Mozilla) syntax
	PopupHelp.isIE = false;
	PopupHelp.isMoz = true;
}
else
{
	// This browser is unrecognised
	fc_assertAlways("Unknown browser type");
}

function PopupHelp()
{
	// Create the div tag that will contain the popup help
	this.m_popup = document.createElement("div");
	this.m_popup.className = 'popuphelp';

	// Append popup to body of document
	document.body.appendChild(this.m_popup);
	
	if(PopupHelp.isIE)
	{
        // Create iframe to allow help tip to float over select element
        this.m_iframe = document.createElement( "iframe" );
        this.m_iframe.className = 'popuphelp';
        this.m_iframe.setAttribute("scrolling", "no");
    	this.m_iframe.setAttribute("frameBorder", 0);
    
        // Append iframe to popup
	    this.m_popup.appendChild(this.m_iframe);
	    
	    // Can't create frame document structure right now - iframe document doesn't yet exist
	    this.m_cell = null;
	}
	else
	{
		this.m_iframe = null;
	}
	
	// Member variables to store mouseover event details until
	// the timeout event needs them.
	this.m_timeoutID = null;
	this.m_eventX = 0;
	this.m_eventY = 0;
	this.m_eventAdaptor = null;
	this.m_displayDate = null;
	this.m_showHelp = false;
	
	// Counter to track how many event handlers have been registered.
	this.m_helpCount = 0;
	
	// The adaptor for which help is about to be displayed. This is required
	// to work around an IE bug, which causes the mouseover event to be called
	// multiple times when the mouse is over the select component - even if
	// mouse does not leave the select component
//	this.m_showAdaptor = null;

	this.m_mouseoverHandler = new Array();
	this.m_mouseoutHandler = new Array();
	this.m_mousedownHandler = new Array();
	this.m_mousemoveHandler = new Array();

	// Track whether or not help for an adapator is bound
	this.m_helpBound = new Array();
}

PopupHelp.m_logger = new Category("PopupHelp");

/**
 * Singleton instance for PopupHelp
 */
PopupHelp.m_instance = null;

/**
 * Tooltip offset from y co-ordinate of cursor
 */
PopupHelp.TOOLTIP_Y_OFFSET = 22;


/**
 * Get the PopupHelp instance.
 *
 * @return the singleton instance for PopupHelp
 */
PopupHelp.getInstance = function()
{
	// Create popup help if necessary.
	if(PopupHelp.m_instance == null)
	{
		PopupHelp.m_instance = new PopupHelp();
	}
	
	return PopupHelp.m_instance;
}


/**
 * Add popup help to an input element. The help text is
 * retrieved from the javascript property <elementID>.helpText
 * Where <elementID> is the id of the element provided as an
 * argument.
 *
 * @param a the GUI Adaptor
 */
PopupHelp.prototype.addToElement = function(a)
{
	var id = a.getId();

	// Add only if there is adaptor help text and it is not bound
	if(null != a.getHelpText() && true != this.m_helpBound[id])
	{
		var e = a.getElement();
		
		// If the item has help text then add events to the element to show and hide it.

		this.m_mouseoverHandler[id] = SUPSEvent.addEventHandler(e, "mouseover", function(evt) { PopupHelp.showEvent(a, evt); }, null);
		this.m_mouseoutHandler[id] = SUPSEvent.addEventHandler(e, "mouseout", function(evt)  { PopupHelp.hideEvent(evt); }, null);
		this.m_mousedownHandler[id] = SUPSEvent.addEventHandler(e, "mousedown", function(evt) { PopupHelp.clickEvent(evt); }, null);
        
		// Keep count of how many handlers have been registered.
		this.m_helpCount++;

		// Help for adaptor is bound.
		this.m_helpBound[id] = true;
	}
}


/**
 * Remove event handlers on disposal of page.
 *
*/
PopupHelp.prototype.removeFromElement = function(a)
{
   	var id = a.getId();

	// Remove only if there is adaptor help text and it is bound
    if(null != a.getHelpText() && true == this.m_helpBound[id])
    {
        if(null != this.m_mouseoverHandler[id])
        {
            SUPSEvent.removeEventHandlerKey(this.m_mouseoverHandler[id]);
            this.m_mouseoverHandler[id] = null;
        }
        
        if(null != this.m_mouseoutHandler[id])
        {
           SUPSEvent.removeEventHandlerKey(this.m_mouseoutHandler[id]);
           this.m_mouseoutHandler[id] = null;
        }
        
        if(null != this.m_mousedownHandler[id])
        {
        	SUPSEvent.removeEventHandlerKey(this.m_mousedownHandler[id]);
        	this.m_mousedownHandler[id] = null;
        }

        if(null != this.m_mousemoveHandler[id])
        {
        	SUPSEvent.removeEventHandlerKey(this.m_mousemoveHandler[id]);
			this.m_mousemoveHandler[id] = null;        	
        }

        this.m_helpCount--;

        // Help for adaptor is no longer bound
		this.m_helpBound[id] = false;

        // If we are using an iframe to display popup help, unregister the iframe's document with
        // the application controller
        if(0 == this.m_helpCount && null != this.m_iframe)
        {
			Services.getAppController().getStyleManager().unregisterDocument(getIframeDocument(this.m_iframe));
        }
    }
}


PopupHelp.prototype._createHelpDocument = function()
{
	var iFrameDoc = getIframeDocument( this.m_iframe );

	// Override the iframes document with this one...
	
	// D355. Note that the style manager uses the class assigned to the body element
	// to identify instances of the popuphelp iframe when their style sheets are loaded.
	// If you change the class of the body element please update the style manager.
	iFrameDoc.open();
	iFrameDoc.write('<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3c.org/TR/html4/strict.dtd">');
	iFrameDoc.write('<html><head><title>PopupHelp</title></head><body class="popuphelp"><table><tbody><tr><td id="cell"></td></tr></tbody></table></body></html>');
	iFrameDoc.close();

    this.m_cell = iFrameDoc.getElementById("cell");

	// Register the popup help document with the style manager so that the style sheet is
	// updated when the style of the application is changed.	    
	Services.getAppController().getStyleManager().registerDocument(iFrameDoc, null);
}


/**
 * Event handler to catch mouseover events for an element.
 * Actual display of help is delayed by a second, and is handled by
 * PopupHelp.showTrigger().
 *
 * @param a the GUI Adaptor which the mouse moved over
 * @param evt the mouseover event.
 * @todo sort out X and Y position of event in a browser independant way.
 */
 
PopupHelp.showEvent = function(a, evt)
{
    
	// If IE then use the global event object.
	evt = (evt) ? evt : ((event) ? event : null);
	
	// Retrieve reference to element mouse moving in

	var srcElement = SUPSEvent.getTargetElement(evt);
	var element = a.getElement();

	if(element.contains(srcElement))
	{

	  if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug("PopupHelp.showEvent(): show help event for adaptor: " + a.getId());
	
	  // Get instance of popup help
	  var popupHelp = PopupHelp.getInstance();
	
	  if(popupHelp.m_eventAdaptor == null)
	  {

		  if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug("PopupHelp.showEvent(): registering timeout for adaptor: " + a.getId());
		  
		  // If there is an existing timeout, get rid of it now
		  if(popupHelp.m_timeoutID != null)
		  {
			  clearTimeout(popupHelp.m_timeoutID);
			  popupHelp.m_timeoutID = null;
		  }

		  // If we're using an iframe to display help, then create the html structure inside
		  // the iframe document if this is the first time through
		  if(popupHelp.m_iframe != null && popupHelp.m_cell == null)
		  {
			  // Create the document inside the iframe which we'll use to display the help
			  popupHelp._createHelpDocument();
		  }
		
		  // Store essential information from the event
		  popupHelp.m_eventX = SUPSEvent.getPageX(evt);
		  popupHelp.m_eventY = SUPSEvent.getPageY(evt);
		
		  if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug( "PopupHelp.showEvent() - Location x: " + popupHelp.m_eventX + " y: " + popupHelp.m_eventY );
	
		  popupHelp.m_eventAdaptor = a;

		  var text = a.getHelpText();

		  if(null != text)
		  {
		      if(popupHelp.m_cell)
		      {
			      popupHelp.m_cell.innerHTML = text;
			  }
			  else
			  {
			      popupHelp.m_popup.innerHTML = text;
			  }
		  }

          // Add mousemove event handler to get help final cursor position
          popupHelp.m_mousemoveHandler[a.getId()] =
              SUPSEvent.addEventHandler(element, "mousemove",
                  function(evt) { PopupHelp.moveEvent(a, evt); }, null);

          // Display the popup 1 second after this the user mouses over the field
	      // which prevents popups appearing as the user moves the mouse across the
	      // page.
	      popupHelp.m_timeoutID = setTimeout("PopupHelp.showTrigger()", 1000);
	   }
	
	}

}


/**
 * Event handler to catch mouseout events which cause popup help
 * to be lowered.
 *
 * @param the evt (in w3c compliant browsers)
 */
PopupHelp.hideEvent = function(evt)
{
	// If IE then use the global event object.
	evt = (evt) ? evt : ((event) ? event : null);
	
	// Retrieve details of element mouse currently over
	var toElement = null != evt.relatedTarget ? evt.relatedTarget : evt.toElement;

	var popupHelp = PopupHelp.getInstance();
	
	if(popupHelp.m_eventAdaptor != null)
	{
	    var processHideEvent = true;
	    
	    // Check whether move is simply within adaptor
	    if(popupHelp.m_eventAdaptor.getElement().contains(toElement))
	    {
	        processHideEvent = false;
	    }

	    if(processHideEvent)
	    {
	        // Get rid of any triggers, they've been superceeded by the 
	        // user moving the mouse out of the field.
	        if(popupHelp.m_timeoutID != null)
	        {
		        clearTimeout(popupHelp.m_timeoutID);
		        popupHelp.m_timeoutID = null;
	        }

            // Remove mousemove event handler as it is no longer required
	        var id = popupHelp.m_eventAdaptor.getId();
	      
            if(popupHelp.m_mousemoveHandler[id] != null)
            {
                SUPSEvent.removeEventHandlerKey(popupHelp.m_mousemoveHandler[id]);
				popupHelp.m_mousemoveHandler[id] = null;
            }

	        // Set adaptor reference to null
	        popupHelp.m_eventAdaptor = null;
	        popupHelp.m_displayDate = null;
        	  	  
	        if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug( "PopupHelp.hideEvent() - Location x: " + SUPSEvent.getPageX(evt) + " y: " + SUPSEvent.getPageY(evt) );

	        // Get rid of the popup help if it is up.
	        popupHelp.hide(true);
	    }
	}
}

/**
 * Event handler to catch mouseclick events for an element.
 * Hide the tooltip help if clicking in the element.
 *
 * @param the evt (in w3c compliant browsers)
 */
PopupHelp.clickEvent = function(evt)
{
	var popupHelp = PopupHelp.getInstance();

	if(popupHelp.m_eventAdaptor != null)
	{    
		// If IE then use the global event object.
		evt = (evt) ? evt : ((event) ? event : null);

		var targetElement = SUPSEvent.getTargetElement(evt);		

		if(popupHelp.m_eventAdaptor.getElement().contains(targetElement))
		{
	        // Get rid of any triggers, they've been superceeded by the user
	        // clicking in the field.
	        if(popupHelp.m_timeoutID != null)
	        {
		      clearTimeout(popupHelp.m_timeoutID);
		      popupHelp.m_timeoutID = null;
	        }

            // Remove mousemove event handler as it is no longer required
	        var id = popupHelp.m_eventAdaptor.getId();
	      
            if(popupHelp.m_mousemoveHandler[id] != null)
            {
                SUPSEvent.removeEventHandlerKey(popupHelp.m_mousemoveHandler[id]);
                popupHelp.m_mousemoveHandler[id] = null;
            }
        
		    popupHelp.hide(true);
		}
	}
}


/**
 * Event handler to catch mousemove events for an element.
 * Capture the final mouse cursor position at which the help will be displayed.
 * Also determines whether the mouse cursor is in this adaptor, a different one
 * or none at all. In IE adaptors with a drop down capture the mouse, we need to
 * prevent the tool tip displaying in other adaptors which don't have the focus
 * or a blank area of the form.
 *
 * @param the evt (in w3c compliant browsers)
 */
PopupHelp.moveEvent = function(a, evt)
{
	var popupHelp = PopupHelp.getInstance();

	// If IE then use the global event object
	evt = (evt) ? evt : ((event) ? event : null);

	// Store co-ordinates of mouse pointer
	popupHelp.m_eventX = SUPSEvent.getPageX(evt);
	popupHelp.m_eventY = SUPSEvent.getPageY(evt);

	if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug("PopupHelp.moveEvent()- Location x: " + popupHelp.m_eventX + " y: " + popupHelp.m_eventY);
	
	if (PopupHelp.isIE)
	{
		var pointElement = document.elementFromPoint(popupHelp.m_eventX, popupHelp.m_eventY);

		if (pointElement != null)
		{
			// Mouse moving over this adaptor
			if (a.getElement().contains(pointElement)) {
				popupHelp.m_showHelp = true;
			}
			// Mouse moving over another adaptor
			else {
				popupHelp.m_showHelp = false;
			}
		}
		else
		{
			// Moving outside the client window
			popupHelp.m_showHelp = false;
		}

		// For IE get the amount scrolled (Included in the co-cordinates for Mozilla)
		popupHelp.m_eventX += document.documentElement.scrollLeft;
		popupHelp.m_eventY += document.documentElement.scrollTop;
	}
	else
	{
		// Mouse is not captured so other adaptors receive the focus, so
		// it is OK to display the help if there is a drop down showing
		popupHelp.m_showHelp = true;	
	}
}


/**
 * Show the popup help after a delay
 */
PopupHelp.showTrigger = function()
{
	PopupHelp.getInstance().show();
}


/**
 * Hide the popup help after it has been displayed for defined period of time
 */
PopupHelp.hideTrigger = function()
{
	var popupHelp = PopupHelp.getInstance();
	popupHelp.m_timeoutID = null;

	popupHelp.hide(false);
}


/**
 * Show the popup help and position it in a suitable place.
 */
PopupHelp.prototype.show = function()
{
    // Because adaptors with drop downs, e.g. date picker, capture the mouse
    // in IE, only show help if in this adaptor  
    if(this.m_eventAdaptor != null && this.m_showHelp)
    {
	    if(PopupHelp.m_logger.isDebug()) PopupHelp.m_logger.debug("PopupHelp.show(): showing help for adaptor: " + this.m_eventAdaptor.getId());

	    if(null != this.m_eventAdaptor.getHelpText())
	    {
	        // Position popup help at event location
	        if(this.m_iframe != null)
	        {
	            // Using an iframe, so recalculate the size of the iframe based on its content
		        var height = this.m_cell.offsetHeight;
		        var width = this.m_cell.offsetWidth;

		    	// Add extra pixels to iframe to prevent bottom and right borders of
		    	// body being obscured by table cell
		        this.m_iframe.style.width = width + 2;
		        this.m_iframe.style.height = height + 2;
		    }
		    else
		    {
		        // Retrieve height of popup such that origin position can be determined
		        var height = this.m_popup.offsetHeight;
		        var width = this.m_popup.offsetWidth;
		    }
		    
		    // Determine position of tool tip
		    
		    var xPos = this.m_eventX;
		    var yPos = this.m_eventY; 
		    
		    if(PopupHelp.isIE)
		    {
		        if( (typeof this.m_eventAdaptor == "object") &&
		            (this.m_eventAdaptor.constructor == SelectElementGUIAdaptor) )
		        {
		            // Apply small offset to avoid problems with tool tip
		            // confusing the mouse over and out events.
		            
		            xPos += 2;
		            yPos += 2;
		        }
		    } 

			yPos += PopupHelp.TOOLTIP_Y_OFFSET;
			    
		    // Retrieve HTML element   
		    var element = this.m_eventAdaptor.getElement();
		    
		    if(null != element)
		    {
		        // Defect 1155. Intermittantly, this method may fire during page navigation.
		        // If this is the case "element" will be null and executing the code in
		        // this if block would cause a run time error. 

		        // Check origin of help hint.			
		        var helpTextOrigin = PopupHelp.checkHelpTextOrigin( element,
		                                                            xPos,
		                                                            yPos,
		                                                            width,
		                                                            height );
		                                                    
	            // Set origin for help hint
	            this.m_popup.style.left = helpTextOrigin.x + "px";
		        this.m_popup.style.top  = helpTextOrigin.y + "px";
		        this.m_popup.style.zIndex = "10000";
		
		        // Make hint visible
		        this.m_popup.style.visibility = "visible";
		    
		        this.m_displayDate = new Date();
		
		        this.m_popup.m_timeoutID = setTimeout("PopupHelp.hideTrigger()", 3000);
	        }
	    }
	}
}

/**
 * Hide the popup help
 */
PopupHelp.prototype.hide = function(hideEventOccurred)
{		
    if(hideEventOccurred)
    {
    
        // Hide popup owing to mouseclick or mouseout event
             
        if(this.m_popup.style.visibility == "visible")
        {
	        this.m_popup.style.visibility = "hidden";
	    }
    }
    else
    {
        // Hide popup owing to expiry of display time
        
        if(this.m_displayDate != null)
        {
        
            // Check expiry timeout
            var currentDate = new Date();
            
            var timeExpired = currentDate - this.m_displayDate;
            
            if(timeExpired > 2750)
            {
                // Hide popup if necessary
                this.m_displayDate = null;
               
                if(this.m_popup.style.visibility == "visible")
                {
	                this.m_popup.style.visibility = "hidden";
	            }
	            
	        }
	        else
	        {
	            // Reinvoke hide as display period has not expired
	            
	            this.m_timeoutID = setTimeout( "PopupHelp.hideTrigger()", 500 );
	            
	        }
	        
	    }
	    else
	    {   
	        // Date has been cleared probably by hide event
        
	        // Check status of popup
            if(this.m_popup.style.visibility == "visible")
            {
	           this.m_popup.style.visibility = "hidden";
	        }       

        }
        
    }

}

/**
 * Method calculates the origin of the help popup text relative
 * to position of adapter HTML element.
 *
 * RWW 06/12/2004 Method not currently in use.
*/

PopupHelp.prototype.calculateHelpTextOrigin = function( element )
{
    var elementPosition = getAbsolutePosition( element );
    
    var originLeft = elementPosition.left;
    var originTop = elementPosition.top - element.offsetHeight;
    
    var result = new Object();
    
    result.left = originLeft;
    result.top = originTop;
    
    return result;
}

/**
 * Method moves help hint origin if help iframe extends beyond
 * size of display.
 *
*/

PopupHelp.checkHelpTextOrigin = function(element, x, y, helpTextWidth, helpTextHeight)
{
    var width, height, scrollX, scrollY;

	if (PopupHelp.isIE)
    {
    	// Retrieve reference to containing document (HTML head and body)
		var documentElement = element.ownerDocument.documentElement;

    	width = documentElement.clientWidth;
    	height = documentElement.clientHeight;
    	scrollX = documentElement.scrollLeft;
    	scrollY = documentElement.scrollTop;
    }
    else
	{
    	width = window.innerWidth;
    	height = window.innerHeight;
    	scrollX = window.scrollX;
    	scrollY = window.scrollY;
    }

    // Modify position of help text if necessary
    
    var result = new Object();

    // Check horizontal position of help text
    if (x + helpTextWidth > width + scrollX)
    {  
        // Reset tool tip so that right of rectangle is at x co-ordinate of cursor     
        result.x = x - helpTextWidth;
        
        if (result.x < 0)
        {
            result.x = 0;
        }
    }
    else
    {
        result.x = x;
    }
    
    // Check vertical position of help text 
    if (y + helpTextHeight > height + scrollY)
    { 
        // Reset tooltip so that bottom of rectangle is at y co-ordinate of cursor
        // plus offset to move tool tip away from cursor hot spot
        result.y = y - helpTextHeight - PopupHelp.TOOLTIP_Y_OFFSET - 10;

        if (result.y < 0)
        {
            result.y = 0;
        }
    }
    else
    {
        result.y = y;
    }

    // Return origin co-ordinates
    return result;
}
