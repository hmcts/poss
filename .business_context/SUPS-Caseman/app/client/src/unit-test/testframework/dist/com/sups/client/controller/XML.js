//===========================================================================
//
// This file contains methods which provide a common API to browser XML
// functionality. Generally this means adding IE like methods to the Mozilla
// XML implementation
//
//===========================================================================
// This is mozilla, so add IE methods to XML DOM implementation for compatability
if(document.implementation && document.implementation.createDocument)
{
   /**
    * Add method to selectNodes to the Element object.
    *
    * @param binding XPath expression used to select the nodes relative to this element
    * @return a set of selected nodes.
    */
   Element.prototype.selectNodes = function(binding)
   {
      return this.ownerDocument.selectNodes(binding, this);
   }
   /**
    * Add method to selectNodes to the Element object.
    *
    * @param binding XPath expression used to select the nodes relative to this element
    * @return a set of selected nodes.
    */
   Element.prototype.selectSingleNode = function(binding)
   {
      return this.ownerDocument.selectSingleNode(binding, this);
   };
   /**
    * Selects
    */
   XMLDocument.prototype.selectSingleNode = function(binding, contextNode)
   {
      var nodes = this.selectNodes(binding, contextNode);
      return nodes.length > 0 ? nodes[0] : null;
   }
   XMLDocument.prototype.selectNodes = function(binding, contextNode)
   {
      //if(Logging.isCategoryLoggingAtLevel(null, Logging.LOGGING_LEVEL_DEBUG)) Logging.logMessage("Selecting nodes for binding: " + binding, Logging.LOGGING_LEVEL_DEBUG);
      var nodes = null;
      if(this.documentElement)
      {
         var namespaceResolver = this.createNSResolver(this.documentElement);
         var result = this.evaluate(binding,(null == contextNode ? this : contextNode), namespaceResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
         var nodes = new Array(result.snapshotLength);
         for(var i = nodes.length-1; i>=0 ; i--)
         {
            nodes[i] = result.snapshotItem(i);
         }
      }
      else 
      {
         // Return an empty array if there is no root (document) element
         nodes = new Array();
      }
      return nodes;
   }
   
   
   
	XMLDocument.prototype.loadXML = function (s) 
	{
		// Reset error
		this.__resetError();
	
		// change the readystate
		this.__changeReadyState(1);
		
		// Parse the string
		var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
		
		// Remove any existing nodes from the document
		while (this.hasChildNodes())
		{
			this.removeChild(this.lastChild);
		}

		// Import the nodes of the document created by parsing the string and add
		// them to this Document
		var cN = doc2.childNodes;
		for (var i = 0, l = cN.length; i < l; i++)
		{
			this.appendChild(this.importNode(cN[i], true)); 
		}

		// Handle any parsing errors
		this.__handleOnLoad();
		
		// change the readystate
		this.__changeReadyState(4);
	}
	
	
	XMLDocument.prototype.transformNode = function (xslDOM)	
	{
		pro = new XSLTProcessor();
		pro.importStylesheet(xslDOM);
	 	p = pro.transformToFragment(this,this);
		return (new  XMLSerializer()).serializeToString(p);
	}
	
	if(undefined === Node.prototype.xml)
	{
		Node.prototype.__defineGetter__(
			"xml",
			function () { return (new XMLSerializer()).serializeToString(this); }
		);
	}
	
	XMLDocument.prototype.readyState = 0;
	
	// Take copy of original Moz load fuction
	XMLDocument.prototype.__load__ = XMLDocument.prototype.load;
	
	XMLDocument.prototype.load = function(url)
	{
		// set the parseError to 0
		this.__resetError();

		// Set the ready state
		this.__changeReadyState(1);
		
		// Call the original method
		try
		{
			this.__load__(url);
		}
		catch (e)
		{
			// Set the parse error
			this.parseError = {
				errorCode: -9999999,	// Don't attempt to interpret errorCodes
				reason:	e.toString()	// try and get a reason
			};
			
			// Set the ready state to indicate that we've finished
			this.__changeReadyState(4);
		}
	}
	
	XMLDocument.prototype.__changeReadyState = function(readyState)
	{
		this.readyState = readyState;
		
		if(this.onreadystatechange != null && typeof this.onreadystatechange == "function")
		{
			this.onreadystatechange();
		}
	}
	
	
	XMLDocument.prototype.__handleOnLoad = function()
	{
		// check for parsing error and set errorCode if appropriate
		if(!this.documentElement)
		{
			this.__setError("Unknown loading error");
		}
		else if(this.documentElement.tagName == "parsererror")
		{
			this.__setError(XML.getNodeTextContent(this.documentElement));
		}
		
		// Change the ready state to indicate that loading has finished
		this.__changeReadyState(4);
	};
	
	
	XMLDocument.prototype.__resetError = function()
	{
		this.parseError = {	
			errorCode: 0,
			reason: null
		};
	}
	
	
	XMLDocument.prototype.parseError = {
		errorCode: 0,
		reason: null
	};
	
	
	XMLDocument.prototype.__setError = function(msg)
	{
		this.parseError = {
			errorCode: -9999999,
			reason:	msg
		};
	}
}





/**
 * XML utility class
 */
function XML()
{
}

/**
 * Find the root node in a dom
 **/
XML.getRootNode = function(fromDom)
{
	// The Document Node (the DOM) is allowed a single element node (the root node)
	// which is what we want. However the Document Node may include additional
	// nodes (say the <?xml ... ?> processing instruction) which may not be suitable
	// for appending to the target node. Therefore we need to find the root element
	// node and copy this.
	var rootNode = null;
	if(fromDom.nodeType == XML.ELEMENT_NODE)
	{
		rootNode = fromDom;
	}
	else
	{
		var childNodes = fromDom.childNodes;
		for(var i = childNodes.length-1; i>=0; i--)
		{
			if(childNodes[i].nodeType == XML.ELEMENT_NODE)
			{
				rootNode = childNodes[i];
				break;
			}
		}
	}
	return rootNode;
}

/** 
 * Static (debug ONLY!) function to produce a full HTML representation of an XMLDocument.
 * !! This is a very bad performing method as the replacing of < and > may take quite a while,
 * depending on the dom size... DO NOT USE IN PRODUCTION CODE - ONLY FOR DEVELOPMENT DEBUGGING!
 *
 * @param dom the XMLDocument to render
 * @return a string containing the HTML representation of the XMLDocument
 */
XML.showFullDom = function(dom)
{
	var msg = "DOM:";
	
	if (null != dom)
	{
		msg += encodeXML(dom.xml);
	}
	return msg;
}

XML.serializeToString = function(dom)
{
	return (new XMLSerializer()).serializeToString(dom);
}


/** 
 *
 *
 * @param name The name of the element to be created
 * @return The element created
 */
XML.createElement = function(node, name)
{
	fc_assert(null != node, "XML.createElement: node was null");
	if(node.ownerDocument)
	{
		// Adding to a node
		return node.ownerDocument.createElement(name);
	}
	else 
	{
		// Adding to root of DOM
		return node.createElement(name);
	}
}



/**
 * Convenience method to create an attribute node in a document or the document of a node
 *
 * @param node the node or DOM to add the attribute to
 * @param name the name of the attribute to add
 */
XML.createAttribute = function(node, name)
{
	if(node.ownerDocument)
	{
		// Adding to a node
		return node.ownerDocument.createAttribute(name);
	}
	else
	{
		// Adding to a DOM
		return node.createAttribute(name);
	}
}



/** 
 * Convenience method to create a text node in a document or the document of a node
 * @param value Value of the TextNode being created.
 * @return the created TextNode
 */
XML.createTextNode = function(node, value)
{
	if(node.ownerDocument)
	{
		// Adding to a node	
		return node.ownerDocument.createTextNode(value);
	}
	else 
	{
		// Adding to a dom
		return node.createTextNode(value);
	}
}


/**
 * Remove the children of a child node
 *
 * @param n the node who's children to remove
 */
XML.removeChildNodes = function(n)
{
	if (null != n)
	{
		while (n.hasChildNodes())
		{
			n.removeChild(n.firstChild);
		}
	}
}


/**
 * Factory to create an XML DOM object in a browser independant way.
 *
 * @param onloadCallback function called when document loaded. If
 *   null then the DOM will configured to load synchronously.
 * @param thisObj the object to call back on, if onloadCallback refers
 *   to a member function. This becomes the object's this reference
 * @param callbackArgs array of arguments passed to callback function.
 *   Ignored if onloadCallback is null.
 * @return the newly created XML DOM
 */
XML.createDOM = function(onloadCallback, thisObj, callbackArgs)
{
   var dom = XML.createDocument();
   if(null == onloadCallback)
   {
      dom.async = false;
   }
   else 
   {
      dom.async = true;
      dom.onreadystatechange = function()
      {
         //if(dom.readyState == 4) onloadCallback.apply(thisObj, callbackArgs);
         if(dom.readyState == 4)
         {
         	// add the dom as the first object in the callbackArgs
	         var args = new Array();
	         args[0] = dom;
	         if(callbackArgs.length != 0)
	         {
		         for(var i=0; i<callbackArgs.length; i++)
		         {
		         	args[args.length] = callbackArgs[i];
		         }
		     }
         	onloadCallback.apply(thisObj, args);
         }
      }
   }
   return dom;
}


XML.createDocument = function()
{
	var dom = null;
	if( typeof ActiveXObject != 'undefined')
	{
		dom = new ActiveXObject("Microsoft.XMLDOM");
		// Always use XPath as the selection language
		dom.setProperty("SelectionLanguage", "XPath");
	}
	else if(document.implementation && document.implementation.createDocument)
	{
		dom = document.implementation.createDocument("", "", null);
		dom.addEventListener(
			"load",
			function() {dom.__handleOnLoad();},
			false
		);
	}
	else 
	{
		fc_assertAlways("Browser doesn't support recognised XML DOM");
	}
	
	return dom;
}

/*

XML.loadStatic = function(url)
{   

	var dom = XML.createDocument();
    // Create a handle to be used by the HTTPServiceRequest object 
    var handler = new Object();
    handler.handleReadyStateChange = function(request,handler)
    {
	    if(request.readyState == 4)
	    {
	        if(request.status == 200) 
	        {
    	    	var theXML = request.responseText;
    	    	dom.loadXML(theXML);
	        }
	    } 
    }
    
    var callingObject = handler;
    var async = false; // we can not let the application/browser carry on untill the Static (XML) file has been downloaded
    var req = new XMLHttpServiceRequest();
    req.initialise(callingObject,url,async,handler);
    
    req.sendGET("loadStaticFile");

	return dom;
    
}

*/

/**
 * Note that this method should not be used. Equivalent functionality
 * is available using the fwFileDataLoader class.
 *
*/

XML.loadStatic = function(url)
{
    // Set up request information object. In this instance
    // store both request object and reference to dom in
    // request information object
    var index;
    var requestInfo = new Object();
    
    index = xmlHttpServiceRequestQueue.length;
    xmlHttpServiceRequestQueue.push(requestInfo);
    
    requestInfo.server = new XMLHttpServiceRequest();
    
    var dom = XML.createDocument();
    requestInfo.dom = dom;
    
    // Set up and invoke get request
    var async = false;
    
    requestInfo.server.initialise(null, url, async, null, handleLoadStaticReadyStateChange);
    
    var handlerArgs = new Array();
    handlerArgs[0] = index;
    
    requestInfo.server.sendGET("loadStaticFile", handlerArgs);
    
    // Return XML document
    return dom;
}

function handleLoadStaticReadyStateChange(handlerArgs)
{
    var index = handlerArgs[0];
    
    var requestInfo = xmlHttpServiceRequestQueue[index];
    
    if(null != requestInfo)
    {
        var request = requestInfo.server.getRequest();
        
        if(request.readyState == 4)
        {
            if(request.status == 200)
            {
                var theXML = request.responseText;
                requestInfo.dom.loadXML(theXML);
            }
            
            // Clean up request object
            requestInfo.server.dispose();
            requestInfo.server = null;
            
            // Dom referred to by reference in calling function
            requestInfo.dom = null;
            
            delete xmlHttpServiceRequestQueue[index];
        }
        
        requestInfo = null;
    }
    
}

/**
 * Get the text content of a node in a browser independant manner
 *
 * @param n the node who's text content to get
 * @result the text content of the node or null if there is none
 */
XML.getNodeTextContent = function(n)
{
  // fc_assert(null != n, "XML.getNodeTextContent(): node is null");
	var t = null;
	var f = false;

	// Locate the children to remove
	var cn = n.childNodes;
	for(var i = 0, l = cn.length; i < l; i++)
	{
		var c = cn[i];
		if(XML.TEXT_NODE == c.nodeType)
		{
			t = (null == t) ? c.nodeValue : t + c.nodeValue;
		}
	}
	
	return t;
}

/**
 * Get the text content of the node selected in the relative XPath
 *
 * @param node the node to select relative to
 * @param xpath the xpath to select the target node
 * @param the text content of the specified node or null if the no text content was
 *        found or the xpath does not resolve a node
 */
XML.getPathTextContent = function(node, xpath)
{
	var n = node.selectSingleNode(xpath);
	
	return null == n ? null : XML.getNodeTextContent(n);
}


/** 
 * Method to produce an HTML representation of a XMLDocument
 *
 * @param dom the XMLDocument to render
 * @return a string containing the HTML representation of the XMLDocument
 */
XML.showDom = function(dom)
{
		var msg = "DOM";
		if (dom.childNodes)
		{
   	msg += "<ul>";
   	msg += XML.showChildren(dom.childNodes);
    msg += "</ul>";
		}
		else
		{
				msg += " has no childNodes";
		}
		return msg;
}


/**
 * Method to produce an HTML representation of a set of nodes
 *
 * @param nodelist the list nodes to render
 * @return a string containing an HTML representation of the nodes
 */
XML.showChildren = function(nodelist, indent)
{
	var iindent = (null!=indent) ? indent++ : 1;
//	if (iindent == 1) alert("!!!!!1")
	var indentString = "";
	for (var i=0; i < iindent; i++)
	{
		indentString += "\t";	
	} 
	
   var msg = '';
   if (nodelist && nodelist.length)
   {
	   for(var i = 0; i < nodelist.length; i++)
	   {
	      var node = nodelist[i];
	      msg += "\n" + indentString +"<li>Node: type=" + XML.NODE_TYPES[node.nodeType - 1] + ", name=" + node.nodeName + ", value=" + node.nodeValue;
	      if(node.hasChildNodes())
	      {
	         msg += "<ul>";
	         msg += XML.showChildren(node.childNodes, iindent);
	         msg += "</ul>";
	      }
	      msg += "</li>";
	   }
   }
   return msg;
}


/**
 * Convenience method to get the text content of a node to be found
 * with an xpath (second argument) in a node (first argument).
 * Returns null or the text found.
 */
XML.selectNodeGetTextContent = function(node, xp)
{
	var text = null;
	var foundNode = node.selectSingleNode(xp)
	if (null != foundNode)
	{
		text = XML.getNodeTextContent(foundNode);
	}
	return text;
}


/**
 * Convenience method to set an element's text content
 *
 * @param node Root to search from
 * @param xp XPath to the node to set
 * @param value of the text to set in the node
 * @throws XMLException if the node is not found
 */
XML.setElementTextContent = function(node, xp, value)
{
	var text = null;
	var foundNode = node.selectSingleNode(xp);

	if(null != foundNode)
	{
		XML.replaceNodeTextContent(foundNode, value);
	}
	else
	{
		throw new XMLException("Unable to location child node at path: " + xp);
	}
}


/**
 * Set the specified node's text the value specified
 *
 * @param n the node whose text content to set
 * @param v the value to set the node text content to
 */
XML.replaceNodeTextContent = function(n, v)
{
	var r = new Array();  // Array containing child nodes to remove
	
	// Locate the children to remove
	var cn = n.childNodes;
	for(var i = 0, l = cn.length; i < l; i++)
	{
		var c = cn[i];
		if(XML.TEXT_NODE == c.nodeType)
		{
			r.push(c);
		}
	}
	
	// Remove children after search 
	for(var i = 0, l = r.length; i < l; i++)
	{
		n.removeChild(r[i]);
	}
	
	if(null != v)
	{
		// Set the text content of the node
		var t = XML.createTextNode(n.ownerDocument, v);
		n.appendChild(t);
	}
}


/**
 * Exception thrown for XML errors
 *
 * @param message the message to report in the exception
 */
function XMLException(message)
{
   this.message = message;
}


/**
 * AppConfigError is a sub class of Error
 */
XMLException.prototype = new Error();
XMLException.prototype.constructor = XMLException;


/**
 * Array containing nodetype values to human readable strings
 * refactor the offset in index!! use the true nodeType value as index in the array.
 */
XML.NODE_TYPES = new Array();
XML.NODE_TYPES[0] = 'Element';
XML.NODE_TYPES[1] = 'Attribute';
XML.NODE_TYPES[2] = 'Text';
XML.NODE_TYPES[3] = 'CData Section';
XML.NODE_TYPES[4] = 'Entity Reference';
XML.NODE_TYPES[5] = 'Entity';
XML.NODE_TYPES[6] = 'Processing Instruction';
XML.NODE_TYPES[7] = 'Comment';
XML.NODE_TYPES[8] = 'Document';
XML.NODE_TYPES[9] = 'Document Type';
XML.NODE_TYPES[10] = 'Document Fragment';
XML.NODE_TYPES[11] = 'Notation';

XML.ELEMENT_NODE = 1;
XML.ATTRIBUTE_NODE = 2;
XML.TEXT_NODE = 3;
XML.CDATA_SECTION = 4;
XML.ENTITY_REFERENCE = 5;
XML.ENTITY = 6;
XML.PROCESSING_INSTRUCTION = 7;
XML.COMMENT = 8;
XML.DOCUMENT = 9;
XML.DOCUMENT_TYPE = 10;
XML.DOCUMENT_FRAGMENT = 11;
XML.NOTATION = 12;

