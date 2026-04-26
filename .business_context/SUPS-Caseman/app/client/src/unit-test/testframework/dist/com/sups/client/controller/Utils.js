/**
 * Prevent selection of content within an HTML element
 *
 * @param e the HTML element whose content should not be selectable
 */
function preventSelection(e)
{
  // Prevent selection of content. This is browser specific!
  if(typeof e.style.MozUserSelect == "string")
  {
    // Moz
    e.style.MozUserSelect = "none";
  }
  else if(typeof e.onselectstart != "undefined")
  {
    // IE
    //e.onselectstart = function() { return false; };
    e.onselectstart = preventElementTextSelection;
  }
}

function unPreventSelection(e)
{
  // Prevent selection of content. This is browser specific!
  if(typeof e.style.MozUserSelect == "none")
  {
    // Moz
    e.style.MozUserSelect = "string";
  }
  else if(typeof e.onselectstart != "undefined")
  {
    // IE
    e.onselectstart = null;
  }
}

/**
 * Method prevents selection of text in element.
 *
*/
function preventElementTextSelection()
{
    var event = window.event;
    
    event.returnValue = false;
    
    return false;
}

/**
 * Check to see if a function, object or object method or object property exist
 *
 * @param item string containing the item to check for
 * @return true if the item being checked for exists or false if it does not
 */
function checkItemExists(item)
{
	var functionExists = false;
	
  try
  {
  	functionExists = eval(item + ' ? true : false');
  }
  catch(e)
  {
  	// If an object or object property or object method is being checked for
  	// on an object that doesn't exists an exception will be thrown.
  	functionExists = false;
  }
	
	return functionExists;
}


/**
 * Check if an element is partially or totally contained within another
 *
 * @param e1 the first element
 * @param e2 the second element
 * @return true if e1 is partially or totally contained by e2
 */
function isContained(e1, e2)
{
	var e1Pos = getAbsolutePosition(e1);
	var e1X = e1Pos.left;
	var e1Y = e1Pos.top;
	var e1W = e1.offsetWidth;
	var e1H = e1.offsetHeight;

	var e2Pos = getAbsolutePosition(e2);
	var e2X = e2Pos.left;
	var e2Y = e2Pos.top;
	var e2W = e2.offsetWidth;
	var e2H = e2.offsetHeight;

/*
	alert(
		"Positions: " +
		"\ne1X: " + e1X + 
		"\ne1Y: " + e1Y +
		"\ne1W: " + e1W +
		"\ne1H: " + e1H +
		"\n" +
		"\ne2X: " + e2X + 
		"\ne2Y: " + e2Y +
		"\ne2W: " + e2W +
		"\ne2H: " + e2H
	);
*/


	if(e1X < e2X && (e1X + e1W) < e2X) return false;
	if(e1X > (e2X + e2W)) return false;
	if(e1Y < e2Y && (e1Y + e1H) < e2Y) return false;
	if(e1Y > (e2Y + e2H)) return false;
	
	return true;
}


/**
 * Get the absolute position of an element.
 *
 * @return an object containing the absolute positions of the left and top
 *   of the element. These maybe accessed as obj.left, obj.top properties of
 *   the result object
 */
function getAbsolutePosition(element)
{
	var leftPos = element.offsetLeft;
	// Defect 777. Add extra correction for scrollable components.
	var topPos = element.offsetTop - element.scrollTop;
	
	var parentElement = element.offsetParent;
	
	while (parentElement != null) {
		leftPos += parentElement.offsetLeft;
		// Defect 777. As above.
		topPos += (parentElement.offsetTop - parentElement.scrollTop);
		
		parentElement = parentElement.offsetParent;
	}
	
	var result = new Object();
	result.left = leftPos;
	result.top = topPos;
	
	return result;
}

/**
  Utility assertion function
  
  @param condition the expression to evaluate for the assertion
  @param message the message displayed when the assertion fails.
*/
function fc_assert(condition, message)
{
  if(!eval(condition))
  {
  	var msg = "Assertion failure: " + message;
  	if(Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_ERROR))
  	{
  		Logging.logMessage("<font color=red>"+msg+"</font>", Logging.LOGGING_LEVEL_ERROR);
  	}
 
  	var params = getURLParameters();
  	
  	if(params['showAssertionAlerts'] != null)
  	{
	    alert(msg);
  	}

    throw msg;
  }
}


/**
  Utility assertion function that always fires
  
  @param message the message displayed when the assertion fails.
*/
function fc_assertAlways(message)
{
  fc_assert(1 == 0, message);
}


/**
 * Debug utility which displays an objects properties and methods. The information
 * is displayed by appending a div tag containing the information to the end of the
 * current document.
 */
function displayObjectProperties(
  obj
)
{            
  var names = "";
  for(var name in obj)
  {
  	if(isNaN(name))
  	{
	  	var value = eval('obj.' + name);
  		names += ('<b>' + name + '</b> = ' + value + '<br>');
  	}
  }

  return names;
}


/**
 * Utility function to append a div element containing an arbitary piece of
 * HTML to the current document. Primarily intended to aid debugging
 *
 * @param msg the string containing the HTML to append to document.
 * @param doc the document to which logging will be appended - optional
 *            parameter. If not supplied the main windows docuement is used
 */
function addMessage(msg, doc)
{
  if (doc == null) doc = document;
  var extra = doc.createElement("div");
  extra.innerHTML = msg;
  doc.body.appendChild(extra);
}


/**
 * Utility function to extract parameters from the windows current location.
 * Returns a map of parameter names to parameter values.
 */
function getURLParameters()
{
  var args = new Array();
  var paramIndex = document.URL.indexOf('?');
  
  if(-1 != paramIndex && paramIndex < document.URL.length)
  {
    var query = document.URL.substring(paramIndex + 1);
    var pairs = query.split("&");
    for(var i = 0; i < pairs.length; i++)
    {
      var pos = pairs[i].indexOf('=');
      if (pos == -1) continue;
      var argname = pairs[i].substring(0, pos);
      var value = pairs[i].substring(pos + 1);
      args[argname] = unescape(value);
    }
  }
  
  return args;
}


/**
 * Gets the base URL for the specified document
 *
 * @param doc the document to get the base URL for
 */
function getBaseURL(doc)
{
	var baseRegexp = new RegExp("^https?://.*?/");
	var baseURL = baseRegexp.exec(doc.URL);
	
	if(null != baseURL)
	{
//		alert(baseURL.length);
		// Trim the trailing /
		var len = baseURL[0].length;
		baseURL = baseURL[0].substring(0, len - 1);
	}
	else
	{
		baseURL = doc.URL;
	}
	
	return baseURL;
}



/**
 * Utility function to check if an element is the child of another element.
 * The function iterates down the html element tree.
 *
 * @param child the element to test as the child
 * @param parent the element to test as the parent
 * @return true if the child element is a child of the parent element.
 */
function isParentOf(child, parent)
{
  if (child.parentNode == null)
  {
    return false;
  }
  else if (child.parentNode == parent)
  {
    return true;
  }
  else
  {
    return isParentOf(child.parentNode, parent);
  }
}


/**
 * Function to check if an element is visible
 *
 * @param el the element to check for visibility
 * @return true if the element is visible or false otherwise
 */
function isElementVisible(el)
{	
	while(el.tagName != 'HTML')
	{
		var style = getCalculatedStyle(el);
		/*if(Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_DEBUG))
		{
			Logging.logMessage("Element: " + el.tagName + " visibility: " +
				style.visibility + " display: " + style.display,
					Logging.LOGGING_LEVEL_DEBUG);
		}*/
		if(style.visibility == 'hidden' || style.display == 'none') return false;
		el = el.parentNode;
	}
	
	return true;
}


function getCalculatedStyle(el)
{
	return document.defaultView != null
		? document.defaultView.getComputedStyle(el,'')		// W3C compatible version
		: el.currentStyle;									// IE compatible version
}


/**
 * Replace special XML characters with their encodings
 *
 * @param text the text to encode
 * @return encoded text
 */
function encodeXML(text)
{
	return text.replace(/\&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}


/**
 * Replace XML encodings with their character representations
 *
 * @param text the text to encode
 * @return decoded text
 */
function decodeXML(text)
{
	return text.replace(/\&amp;/g, '&').replace(/\&lt;</g, '<').replace(/@gt;/g, '>');
}




/**
 * Function to test if the argument is a string or not. Checks for both
 * primitive strings and String objects
 *
 * @param str the item to test for "stringiness"
 * @return true if the supplied item is a primitive string or a String object.
 */
function isString(str)
{
	return (str instanceof String || typeof str == "string");
}

/**
 * Retrieve reference to the document within an iframe component
 *
 * @param  iframe A reference to an iframe component
 * @return the document which represents the forms HTML.
 */
 
function getIframeDocument( iframe )
{
	var doc = null;
	
	if (iframe.contentDocument)
	{
		// W3C compliant browser
		doc = iframe.contentDocument;
	}
	else if (iframe.Document)
	{
		// MS Internet Explorer
		doc = iframe.Document;
	}
	else
	{
		fc_assertAlways("Unrecognised browser: Unable to get iframe's document");
	}
	
	return doc;
	
}

function getIframeWindow( iframe )
{
	var wnd = null;
	
	if (iframe.defaultView)
	{
		// W3C compliant browser
		wnd = iframe.defaultView;
	}
	else if (iframe.contentWindow)
	{
		// MS Internet Explorer
		wnd = iframe.contentWindow;
	}
	else
	{
		fc_assertAlways("Unrecognised browser: Unable to get iframe's window");
	}
	
	return wnd;
	
}

/**
 * Utility function to convert a Date object into a String. This
 * is useful when examining the timing of program events.
 *
 * @param date                The date object to be converted into a string
 * @param includeMilliseconds Boolean flag indicating whether, or not,
 *                            string should include milliseconds component
 *
*/
function convertDateToString( date, includeMilliseconds)
{
    var dateStr = "";
    
    // Define date component
    var dayOfMonth = date.getDate();
    dateStr += padDateOrTimeElement(dayOfMonth) + "/";
    
    var month = date.getMonth() + 1;
    dateStr += padDateOrTimeElement(month) + "/";
    
    var year = date.getYear();
    if(year < 1000)
    {
        year +=1900;
    }
    
    dateStr += year + " ";
    
    // Define time component
    var hours = date.getHours();
    dateStr += padDateOrTimeElement(hours) + ":";
    
    var minutes = date.getMinutes();
    dateStr += padDateOrTimeElement(minutes) + ":";
    
    var seconds = date.getSeconds();
    dateStr += padDateOrTimeElement(seconds);
    
    if(includeMilliseconds == true)
    {
        var milliseconds = date.getMilliseconds();
        dateStr += "." + milliseconds;
    }
    
    return dateStr;
}

function padDateOrTimeElement(value)
{
    var valueStr = "";
    
    if(value >= 10)
    {
        valueStr = value;
    }
    else
    {
        valueStr = "0" + value;
    }
    
    return valueStr;
}
