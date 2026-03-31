//==================================================================
//
// DataModel.js
//
//==================================================================

/**
 * DataModel class which manages the form data on behalf of the
 * framework.
 *
 * @constructor
 * @private
 */
function DataModel()
{
	this._initialise();
}

DataModel.m_logger = new Category("DataModel");


DataModel.DEFAULT_ROOT = "/ds";

DataModel.VARIABLES_ROOT = "/ds/var";

DataModel.DEFAULT_PAGE_BINDING_ROOT = "/ds/var/page";

DataModel.DEFAULT_APP_BINDING_ROOT = "/ds/var/app";

DataModel.DEFAULT_FORM_BINDING_ROOT = "/ds/var/form";

DataModel.DEFAULT_TMP_BINDING_ROOT = "/ds/var/page/tmp";

DataModel.DEFAULT_REF_DATA_ROOT = DataModel.DEFAULT_FORM_BINDING_ROOT;

/**
 * The XPathParser instance used by the DataModel during
 * registration and matching
 *
 * @type XPathParser
 * @private
 */
DataModel.prototype.m_xpathParser = null;


/**
 * The XPathListener used to listen to parsing events during XPath
 * registration
 *
 * @type XPathRegistryListener
 * @private
 */
DataModel.prototype.m_registerListener = null;


/**
 * The XPathListener used to listen to parsing events during XPath
 * matching
 *
 * @type XPathMatchListener
 * @private
 */
DataModel.prototype.m_matchListener = null;


/**
 * The root node for the tree containing the registered XPaths
 *
 * @type XPathRegistryNode
 * @private
 */
DataModel.prototype.m_root = null;


/**
 * The root DOM which represents the DataModel
 *
 * @type Document
 * @private
 */
DataModel.prototype.m_dom = null;


/**
 * The list of DataModel transaction listener objects
 *
 * @type Array[DataModelTransactionListeners]
 * @private
 */
DataModel.prototype.m_transactionListeners = null;

/**
 * Stores the dirty status of the model
 */
//DataModel.prototype.m_dirtyFlag = false ; 


/**
 * Initialise a DataModel instance
 *
 * @private
 */
DataModel.prototype._initialise = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype._initialise()");
	this._resetCache();
	
	// Create objects that will be used through the lifetime of
	// this instance
	this.m_xpathParser = new XPathParser();
	this.m_registerListener = new XPathRegistryListener(this);
	this.m_matchListener = new XPathMatchListener(this);
	
	this.m_registerCache = new Array() ;
	
	// List of Listeners that are notified about transaction start and end points
	this.m_transactionListeners = new Array();
	this.m_transactionCount = 0;
	
	// Root node for the node structure used to match XPaths
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;_initialise() creating the null root node for the XPathRegistryListener tree");
	this.m_root = new XPathRegistryNode(null, "");
	
	// Create an empty DOM
    this.m_dom = XML.createDOM(null, null, null);

	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype._initialise() completed");
//	this.m_dirtyFlag = false ;
}


DataModel.prototype.dispose = function()
{
	for(var i = 0; i < this.m_transactionListeners.length; i++)
	{
		this.m_transactionListeners[i] = null;
	}
	this.m_transactionListeners = null;
	
	for(var i in this.m_parseCache)
	{
		this.m_parseCache[i] = null;
	}
	this.m_parseCache = null;

	for(var i in this.m_registerCache)
	{
		this.m_registerCache[i] = null;
	}
	this.m_registerCache = null;

	this.m_xpathParser = null;
	this.m_registerListener = null;
	this.m_matchListener = null;
	
	this.m_root.dispose();
	this.m_root = null;

	this.m_dom = null;
}


DataModel.prototype._resetCache = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype._resetCache()");
	this.m_parseCache = null;
	// Create array (hashmap) to cache results of xpath parses
	this.m_parseCache = new Array();
}


/**
 * Get the DOM which contains the DataModel data
 *
 * @private
 * @deprecated
 */
DataModel.prototype.getInternalDOM = function()
{
	return this.m_dom;
}


/**
 * Set the DOM representing the DataModel data
 *
 * @param d the DOM
 * @private
 * @deprecated
 */
DataModel.prototype.setInternalDOM = function(d)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype.setDOM()");
	this._startTransaction();
	
	// Set the dom	
	this.m_dom = d;
	
	this._invokeAllListeners();	

	this._endTransaction();
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype.setDOM() completed");
}


/**
 * Set the DOM representing the DataModel data
 *
 * @param d the DOM
 * @private
 * @deprecated
 */
DataModel.prototype.invokeUpdateEventGeneration = function()
{
/*("DataModel_invokeUpdateEventGeneration")*/
	//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("DataModel.invokeUpdateEventGeneration()");
	this._startTransaction();
	
	this._invokeAllListeners();	

	this._endTransaction();
/*("DataModel_invokeUpdateEventGeneration")*/	
}


/**
 * Invoke all listeners on the DOM
 *
 * @todo is UPDATE the appropriate type or is something else needed?
 * @private
 */
DataModel.prototype._invokeAllListeners = function()
{
/*("DataModel_invokeAllListeners")*/
	/*this._startTransaction() ;
	//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug ("_invokeAllListeners()") ;
	var xpath = "/";
	var listeners = this.parseXPath(xpath);
	var e = DataModelEvent.create(xpath,DataModelEvent.ADD);
	//Maybe extract m_matchedNodes from the array and send down...
	for (var i=0, length = listeners.m_matchedNodes.length; i < length; i++)
	{
		listeners.invokeRecursiveMatchedNodeListeners(e,listeners.m_matchedNodes[i]);
	}
	this._endTransaction();*/

	// Notify all listeners that the data has changed.
	var listeners = this.m_root.getListenersRecursive();

	var event = new DataModelEvent();
	
	// Set up the event so listeners can find out about what is going on.
	var e = DataModelEvent.create('/', DataModelEvent.ADD);

	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.invokeUpdateEventGeneration() listeners.length = " + listeners.length);
	for(var i = 0, l = listeners.length; i < l; i++)
	{
		listeners[i].invoke(e);
	}
	/*("DataModel_invokeAllListeners")*/	
}


/**
 * Get the value of the specified XPath. The xpath must select
 * a single node in the document otherwise an exception will be
 * thrown.
 *
 * @param xp the xpath to select the node
 * @return the value of the specified XPath
 * @type String
 * @throws DataModelError if the xpath selects multiple nodes
 */
DataModel.prototype.getValue = function(xp)
{
	/*("DataModel_getValue")*/
	var v = null;

	// Select the nodes according to the XPath
	var n = this.m_dom.selectNodes(xp);
	
	switch(n.length)
	{
		case 0:
			// No nodes found
			break;
			
		case 1:
			// Single node so get it's value
			v = XML.getNodeTextContent(n[0]);
			break;

		default:
			// Multiple nodes returned - not supported!
			throw new DataModelError("Value for multiple nodes cannot be retrieved!");
			break;
	}
	/*("DataModel_getValue")*/
	return v;
}




/**
 * Set the value on the specified XPath
 *
 * @param xp the xpath to select the node to set
 * @param v the value to set the selected node to
 * @throws DataModelError if there was an error
 */
DataModel.prototype.setValue = function(xp, v)
{
	if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("** DataModel.prototype.setValue(xp:" + xp + ", v:" + v + ")");
	this._startTransaction();
	
	var currentValue = this.getValue(xp);
	var changed = false;
	
	if(currentValue != v)
	{
		var l = this.parseXPath(xp);
			
		// Set the value on the underlying dom, returns true if it is a new value
		var created = l.setDOMValue(v);
		
		
		// Set the event type
		var eventType = created ? DataModelEvent.ADD : DataModelEvent.UPDATE;
		//Create the DataModel Event
		var e = DataModelEvent.create(xp, eventType);
		
		// Invoke the listeners of the matched nodes with the DataModelEvent
		l.invokeMatchedNodesListeners(e);
		
		//If the Data Model Dirty flag is already set to true do not bother checking if XP is in excluded region of the DOM
/*
		if (this.m_dirtyFlag == false)
		{
			//Check to see if the XPath we are updating is in the portion of the DOM that is eligible for dirty flag checking
			if (this.isXPathInDirtyCheckedSubTree(xp))
			{
				this.setDirty(true) ;
			}
		}
*/
		changed = true;
	}

	this._endTransaction();
	
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.setValue(xp:" + xp + ", v:" + v + ") completed");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
	
	return changed;
}

/**
* Remove the selected XPath from the Data Model
* and informs all listeners to the node represented by the XPath
* AND all the child nodes of the removed XPath
* Extension to the DataModelEvent for the inclusion of the root node 
*
* If we remove an XP need to remove this item from the cache used in setValue
* 
* @param xp the XPath used to select the node set for removal
*/

/*DataModel.prototype.oldRemoveNode = function(xp)
{	
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.removeNode(xp:" + xp + ")");
	this._startTransaction() ;
	//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug ("In RemoveNode of DataModel for XPath " + xp) ;
	//Listener of type XPathMatchListener
	var listeners = this.parseXPath(xp);
	var e = DataModelEvent.create(xp,DataModelEvent.REMOVE);
	var children = this.m_dom.selectNodes(xp) ;
	e.setNode(children);
	//Maybe extract m_matchedNodes from the array and send down...
	for (var i=0, length = listeners.m_matchedNodes.length; i < length; i++)
	{
		listeners.invokeRecursiveMatchedNodeListeners(e,listeners.m_matchedNodes[i]) ;
	}
	//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug ("About to remove child Node for XPath");
	
	for(var i = 0, l = children.length; i < l; i++)
	{
		var child = children[i] ;	
		var parent = child.parentNode;
		parent.removeChild(child) ;	
	}
	this._endTransaction();
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.removeNode(xp:" + xp + ") completed");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
}*/

/**
 * Returns the node as selected by the supplied XPath
 *
 * @param xp the XPath used to select the node set.
 * @return the selected node set - may be null
 * @type Element
 */
DataModel.prototype.getNode = function(xp)
{
	var n = this.m_dom.selectSingleNode(xp);
	
	// Return a copy so that DataModel internals are 
	// not interfered with.
	return null == n ? null : n.cloneNode(true);
}

/**
 * Returns the nodes as selected by the supplied XPath
 *
 * @param xp the XPath used to select the node set.
 * @return the selected node set - may be null
 * @type Array
 */
DataModel.prototype.getNodes = function(xp)
{
	var nodes = this.m_dom.selectNodes(xp);
	var result = new Array();
	for(var i=0, l=nodes.length; i<l; i++)
	{
		// Return a copy so that DataModel internals are not interfered with.
		result[i] = nodes[i].cloneNode(true);
	}
	return result;
}


DataModel.prototype._startTransaction = function()
{
	// Invoke transaction listeners start method
	if(this.m_transactionCount == 0)
	{
		//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("DataModel._startTransaction() starting transaction listeners");
		for(var i = 0, l = this.m_transactionListeners.length; i < l; i++)
		{
			/*("DataModel_startTransaction")*/
			this.m_transactionListeners[i].start();
		}
	} 
	/*else 
	{
		if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("DataModel._startTransaction() ignoring start, this.m_transactionCount = " + this.m_transactionCount);
	}*/
	this.m_transactionCount++;
}


DataModel.prototype._endTransaction = function()
{
	// Invoke transaction listeners end method
	if(this.m_transactionCount > 0)
	{
		this.m_transactionCount--;
	}
	else
	{
		if(DataModel.m_logger.isError()) DataModel.m_logger.error("Error: DataModel._endTransaction() transactionCount is already 0, the number of start and end transactions do not match!");
	}
	if(this.m_transactionCount == 0)
	{
		//if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("DataModel._endTransaction() calling transaction listeners");
		for(var i = 0, l = this.m_transactionListeners.length; i < l; i++)
		{
			this.m_transactionListeners[i].end();
			/*("DataModel_startTransaction")*/
		}
	}
	/*else
	{
		if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("DataModel._endTransaction() ignoring end transaction, this.m_transactionCount = " + this.m_transactionCount);
	}*/
}

/**
 * Adds the contents of the DOM to the DataModel.m_dom at the specified XPath
 * ToDo doesn't handle namespace conflicts, need to implement importNode (or IE and Mozilla)
 * ToDo currently doesn't generate events, but only used for initialisation so far
 *
 * @param xp the xpath to copy the nodes to
 * @param fromDom the dom to copy the nodeset from
 * @throws DataModelError if there was an error
 */
/*DataModel.prototype.oldAddNodeSet = function(fromDom, toXPath)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.addNodeSet(toXPath:" + toXPath + ")");
	if(null == fromDom)
	{
		//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.addNodeSet(), source dom is null");
	}
	else
	{
		this._startTransaction();
		
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
			for(var i = 0, l = fromDom.childNodes.length; i < l; i++)
			{
				if(fromDom.childNodes[i].nodeType == XML.ELEMENT_NODE)
				{
					rootNode = fromDom.childNodes[i];
					break;
				}
			}
		}
	
		var l = this.parseXPath(toXPath);
		var toNode = l.createElementsToPath(true);
		
		// Need to clone nodes...
		toNode["node"].appendChild(rootNode.cloneNode(true));
		
		//Invoke Listeners - TM
		
		toXPath = XPathUtils.concatXPaths(toXPath, rootNode.nodeName);
		var listeners = this.parseXPath(toXPath);
		
		// add a predicate for adding nodes so we can select the added node inside the retrieveSrcData()
		// methods for applying deltas rather than re-getting all source data.
		var n = this.m_dom.selectNodes(toXPath);
		var position = n.length;
		toXPath = toXPath + "[position() = " + position + "]";
		
		var e = DataModelEvent.create(toXPath,DataModelEvent.ADD);
		//Maybe extract m_matchedNodes from the array and send down...
		for (var i=0, length = listeners.m_matchedNodes.length; i < length; i++)
		{
			listeners.invokeRecursiveMatchedNodeListeners(e,listeners.m_matchedNodes[i]) ;
		}
		this._endTransaction();
		
		fromDom = null;
	}
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.addNodeSet(toXPath:" + toXPath + ") completed");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
}*/

DataModel.prototype.parseXPath = function(xp)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("DataModel.prototype.parseXPath(xp: " + xp + ")");
	var l;
	// Cache the results of the matchListener
	if(null == this.m_parseCache[xp])
	{
		//Get the list of listeners (l) for the XPath
		l = this.m_matchListener;
		l.reset();	
		try
		{
			// Parse the xpath
			this.m_xpathParser.parse(xp, l);
		}
		catch (ex)
		{
			throw new DataModelError("Error while parsing XPath", ex);
		}
		// Complete the matching
		l.finishMatch();

		// Store result in the cache
		this.m_parseCache[xp] = XPathMatchListener.clone(l);
	}

	return XPathMatchListener.clone(this.m_parseCache[xp]);
}

DataModel.prototype.addChildrenNodes = function(nodelist, toNode)
{
	if (nodelist && nodelist.length)
	{
		for(var i = 0; i < nodelist.length; i++)
		{
			var node = nodelist[i];
		      
			var newNode = toNode.appendChild(node);
		      
			if(node.hasChildNodes())
			{
				addChildrenNodes(node.childNodes, newNode);
			}
		}
	}
}


/**
 * Checks to see if a node has a value.
 *
 * @param xp the xpath of the node to check
 * @return true if the node exists and has a none empty text value
 * @type Boolean
 * @throws DataModelError if the xpath selects multiple nodes
 */
DataModel.prototype.hasValue = function(xp)
{
	var v = this.getValue(xp);
	return (null != v && "" != v);
}


/**
 * Checks to see if a node exist
 *
 * @param xp the xpath of the node to check
 * @return true if the node exists
 * @type Boolean
 */
DataModel.prototype.exists = function(xp)
{
	// Select the nodes according to the XPath
	var n = this.m_dom.selectNodes(xp);
	
	return (n.length != 0)
}


/**
 * Returns the number of nodes selected by the XPath
 *
 * @param xp the xpath of the nodes to count
 * @return the number of nodes selected by the XPath
 * @type Integer
 */
DataModel.prototype.countNodes = function(xp)
{
	var n = this.m_dom.selectNodes(xp);
	
	return n.length;
}

/*
 *  Registers all listeners defined in the listenerArray.
 *  Each object in the array has propeties called 'xpath'
 *  and 'listener'
 */
DataModel.prototype.registerListenerArray = function(listenerArray)
{
    for (var i = 0, l = listenerArray.length; i < l; i++)
    {
        this._register(listenerArray[i].xpath,listenerArray[i].listener);    
    }
}

/*
 *  De-registers all listeners defined in the listenerArray.
 *  Each object in the array has propeties called 'xpath'
 *  and 'listener'
 */
DataModel.prototype.deRegisterListenerArray = function(listenerArray)
{
    for (var i = 0, l = listenerArray.length; i < l; i++)
    {
        this._deRegister(listenerArray[i].xpath,listenerArray[i].listener);    
    }
}
/**
 * Register a listener on a particular XPath
 *
 * @param xp the string representation of the xpath
 * @param listener the listener to invoke when the path is matched
 * @throws XPathParseError if an error occured parsing the XPath
 */
DataModel.prototype._register = function(xp, listener)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.register(xp: " + xp + ", listener: " + listener + ")");
	// this should really maintain the cache by removing the xp property from the cache array
	this._resetCache();

	//Check to see if the XPath is in the cache
	if (null != this.m_registerCache[xp]) 
	{
		var n = this.m_registerCache[xp] ;
		n.addListener (listener) ;		
	}
	else
	{

		var l = this.m_registerListener;
		l.reset();
			
		this.m_xpathParser.parse(xp, l);
	
		var n = l.getCurrentNode();
		listener._setXPath(xp);
		n.addListener(listener);
		this.m_registerCache[xp] = n ;
	}
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***** DataModel.prototype.register(xp: " + xp + ", listener: " + listener + ") completed");
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("***************************************************************************");
}

/**
 * Register a listener on a particular XPath
 *
 * @param xp the string representation of the xpath
 * @param listener the listener to invoke when the path is matched
 * @throws XPathParseError if an error occured parsing the XPath
 */
DataModel.prototype._deRegister = function(xp, listener)
{
	this._resetCache();

	//Check to see if the XPath is in the cache
	var n = this.m_registerCache[xp];
	if (null != n) 
	{
		// Remove from cache
		delete this.m_registerCache[xp];
	}
	else
	{

		var l = this.m_registerListener;
		l.reset();
			
		this.m_xpathParser.parse(xp, l);
	
		n = l.getCurrentNode();
	}

	// Remove listener from node
	n.removeListener(listener);
}

/**
 * Register a transaction listener on the DataModel
 *
 * @param listener the transaction listener
 */
DataModel.prototype.registerTransactionListener = function(listener)
{
	// this should really maintain the cache by removing the xp property from the cache array
	this._resetCache();

	this.m_transactionListeners.push(listener);
}


/**
 * Returns true if the data model has changed
 * Currently this is filtered so changes to /ds/var/ are ignored
 *
 */
/*
DataModel.prototype.isDirty = function()
{
	return this.m_dirtyFlag ;
}
*/

/**
 * Sets the dirty flag state of the data model
 *
 */
/* 
DataModel.prototype.setDirty = function(dirtyState)
{
	this.m_dirtyFlag = dirtyState ;
}
*/

/**
 * Returns true if the XPath is in part of the DOM considered in dirty flag checking
 * Currently this excludes /ds/var/app and /ds/var/form
 */
DataModel.prototype.isXPathInDirtyCheckedSubTree = function(xp)
{
	var shouldBeChecked = true ;
//	var excludedSubTrees = ['/ds/var/app','/ds/var/form'] ;

	// markc: Changed this to simply /ds/var. Anything outside of /ds/var is model,
	// anything inside /ds/var is not part of the model!
	var excludedSubTrees = ['/ds/var'];
	
	for (var i=0, l = excludedSubTrees.length; i< l; i++)
	{
		if (xp.indexOf(excludedSubTrees[i]) == 0)
		{
			shouldBeChecked = false ;
			break ;
		}
	}
	
	return shouldBeChecked ;
}

/**
 * Exception thrown when an error occurs while using the DataModel
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
function DataModelError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// XPathParseError is a sub class of Error
DataModelError.prototype = new Error();
DataModelError.prototype.constructor = DataModelError;



/**
 * Class to represent a datamodel event
 * 
 * @private
 */
function DataModelEvent()
{
}


/**
 * Event type for when a node is added
 *
 * @type int
 * @private
 */
DataModelEvent.ADD = 0;


/**
 * Event type for when a node is removed
 *
 * @type int
 * @private
 */
DataModelEvent.REMOVE = 1;


/**
 * Event type for when a node is updated
 *
 * @type int
 * @private
 */
DataModelEvent.UPDATE = 2;


/**
 * The XPath of the affected node
 *
 * @type String
 * @private
 */
DataModelEvent.prototype.m_xPath = null;


/**
 * The type of this event. Will be one of:
 *  DataModelEvent.ADD
 *  DataModelEvent.REMOVE
 *  DataModelEvent.UPDATE
 *
 * @type Integer
 * @private
 */
DataModelEvent.prototype.m_type = null;

/**
 * The node removed from the data model. Only used by the DataModel.removeNode()
 *
 * @type Integer
 * @private
 */
DataModelEvent.prototype.m_node = null;


/**
 *
 */
DataModelEvent.create = function(xp, t, node)
{
	var e = new DataModelEvent();
	
	e.m_xPath = xp;
	e.m_type = t;
	e.m_node = node;
	
	return e;
}


/**
 * Compare this DataModelEvent to another
 *
 * @param e the DataModelEvent to compare to this one
 * @return true if the DataModelEvents are the same or
 *   false if they are not
 * @type boolean
 */
DataModelEvent.prototype.isEqual = function(e)
{
	return (e.m_xPath == this.m_xPath) && (e.m_type == this.m_type);
}

/**
 * Get the type of event. Will be one of:
 *  DataModelEvent.ADD
 *  DataModelEvent.REMOVE
 *  DataModelEvent.UPDATE
 *
 * @return the type of the event
 * @type Integer
 */
DataModelEvent.prototype.getType = function()
{
	return this.m_type;
}


/**
 * Set the type of event. Will be one of:
 *
 * @param t the type of the event which must be
 *   a valid event type.
 * @private
 */
/*
DataModelEvent.prototype.setType = function(t)
{
	this.m_type = t;
}
*/


/**
 * Get the XPath of the node which the event relates to
 *
 * @return the xpath of the node to which the event relates to
 * @type String
 */
DataModelEvent.prototype.getXPath = function()
{
	return this.m_xPath;
}


/**
 * Set the XPath of the node which the event relates to
 *
 * @param the xp of the node to which the event relates to
 * @private
 */
DataModelEvent.prototype.setXPath = function(xp)
{
	return this.m_xPath = xp;
}


/**
 * Get the node.
 *
 * @return the dom node removed from the data model
 * @private
 */
DataModelEvent.prototype.getNode = function()
{
	return this.m_node;
}
/**
 * Set the node removed.
 *
 * @param n the dom node removed from the data model
 * @private
 */
DataModelEvent.prototype.setNode = function(n)
{
	this.m_node = n;
}

/**
 * Set the XPath and type of an Event in a single operation
 *
 * @param xp the XPath of the node to which the event relates to
 * @param t the type of the event
 * @private
 */
/*
DataModelEvent.prototype.setEvent = function(xp, t)
{
	this.m_xPath = xp;
	this.m_type = t;
}
*/

/**
 * Method used to clean up the data model event, specifically created to delete
 * the reference to the dom node which is an ActiveX object and can cause memory
 * leaks in IE.
 *
 * @private
 */
DataModelEvent.prototype.dispose = function()
{
	if(this.m_node != null)
	{
		delete this.m_node;
		this.m_node = null;
	}
	this.m_xPath = null;
	this.m_type = null;
}
 
/**
 * Overridden toString() method
 *
 * @param the xp of the node to which the event relates to
 * @private
 */
DataModelEvent.prototype.toString = function()
{
	var type = "";
	switch(this.m_type)
	{
		case DataModelEvent.ADD:
			type = "ADD";
			break;
			
		case DataModelEvent.REMOVE:
			type = "REMOVE";
			break;
			
		case DataModelEvent.UPDATE:
			type = "UPDATE";
			break

		default:
			break;
	}
	return "{m_xPath: " + this.m_xPath + ", m_type: " + type + "}";
}

/*

DataModelEvent.ADD = 0;
DataModelEvent.REMOVE = 1;
DataModelEvent.UPDATE = 2;

*/

/**
 * Interface used to register interest in the DataModel
 *
 * @constructor
 * @private
 */
function DataModelListener()
{
}


/**
 * Method called when the Listener is invoked
 *
 * @param e the DataModelEvent
 * @private
 */
DataModelListener.prototype.invoke = function(e)
{
}


/**
 * Method called when the Listener is destroyed
 *
 * @private
 */
DataModelListener.prototype.dispose = function()
{
}


function DataModelTransactionListener()
{
}


DataModelTransactionListener.prototype.start = function()
{
}

DataModelTransactionListener.prototype.end = function()
{
}


/**
 * Class which represents a node within the matching tree
 *
 * @param v the value of the node
 * @param path the total 'path' to this node in the listener tree
 * @constructor
 * @private
 */
function XPathRegistryNode(v, path)
{
	this.m_objectRef = XPathRegistryNode.m_objectRef++;
	this.m_childNodes = {};
	this.m_predicates = {};
	this.m_listeners = new Array();
	this.m_value = v;
	if(v==null)
	{
		this.m_xp = path;
	}
	else
	{
		// if we end in a recursive xpath then don't add another trailing slash
		if(path.length>=2 && (path.lastIndexOf("//") == (path.length-2)))
		{
			this.m_xp = path + v;
		}
		else
		{
			this.m_xp = path + "/" + v;
		}
	}
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("XPathRegistryNode(node: " + v + ") this = " + this.toString());
}


XPathRegistryNode.m_objectRef = 0;

XPathRegistryNode.prototype.dispose = function()
{
	this.m_childNodes = null;
	
	this.m_predicates = null;
	
	var listeners = this.m_listeners;
	for(var i = 0, l = listeners.length; i < l; i++)
	{
		listeners[i].dispose();
		this.m_listeners[i] = null;
	}
	this.m_listeners = null;
}

XPathRegistryNode.prototype.toString = function()
{
	return "[\"" + this.m_value + "\" (ref:" + this.m_objectRef + ", " + this.m_xp + ")]";
}

/**
 * Get the unique identifier for this node
 *
 * @return the objectRef of the node
 * @type String
 * @private
 */
XPathRegistryNode.prototype.getObjectRef = function()
{
	return this.m_objectRef;
}

/**
 * Get the value of the node
 *
 * @return the value of the node
 * @type String
 * @private
 */
XPathRegistryNode.prototype.getValue = function()
{
	return this.m_value;
}


/**
 * Add a node to represent a child node in the XPath
 *
 * @param n the name of the child node
 * @return the new child node
 * @type XPathRegistryNode
 * @private
 */
XPathRegistryNode.prototype.addChildNode = function(n)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("XPathRegistryNode.prototype.addChildNode(n: " + n + ")");
	var c = this.m_childNodes[n];
	if(null == c)
	{
		c = new XPathRegistryNode(n, this.m_xp);
		this.m_childNodes[n] = c;
	}
	return c;
}


/**
 * Private method to get number of child nodes.
 * Note this is used only for unit testing and performance is slow!
 *
 * @return the number of child nodes
 * @type int
 * @private
 */
XPathRegistryNode.prototype._noOfChildNodes = function()
{
	var c = 0;
	for(var i in this.m_childNodes) c++;
	return c;
}


/**
 * Get a child node by name from this node.
 *
 * @private
 * @param n the name of the child node to retrieve
 * @return the child XPathRegistryNode or null if the named node is not found
 * @type XPathRegistryNodes
 */
XPathRegistryNode.prototype.getChildNode = function(n)
{
	var c = this.m_childNodes[n];
	return (undefined == c ? null : c);
}


/**
 * Get the map of child nodes, called from XPathMatchingListener
 *
 * @return the map of child nodes
 * @type Map[XPathRegistryNodes]
 * @private
 */
XPathRegistryNode.prototype.getChildren = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryNode.prototype.getChildren() from node " + this.toString());

	/*if(DataModel.m_logger.isError())
	{
		var msg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.m_childNodes = [";
		for(var i in this.m_childNodes)
		{
			msg += i + ", ";
		}
		msg += "]";
		DataModel.m_logger.error(msg);
	}*/

	return this.m_childNodes;
}


/**
 * Add a node to represent a predicate in the XPath
 * 
 * @param n the string representing the predicate
 * @return the new child node
 * @type XPathRegistryNode
 * @private
 */
XPathRegistryNode.prototype.addPredicateNode = function(n)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("XPathRegistryNode.prototype.addPredicateNode(n: " + n + ")");
	var c = this.m_predicates[n];
	if(null == c)
	{
		c = new XPathRegistryNode(n, this.m_xp);
		this.m_predicates[n] = c;
	}
	return c;
}


/**
 * Private method to get number of predicate nodes.
 * Note this is used only for unit testing and performance is slow!
 *
 * @return the number of predicate nodes for the node
 * @type int
 * @private
 */
XPathRegistryNode.prototype._noOfPredicateNodes = function()
{
	var c = 0;
	for(var i in this.m_predicates) c++;
	return c;
}


/**
 * Get a named predicate node
 *
 * @param n the string representing the the predicate node to get
 * @return the predicate node or null if the named predicate is not
 *         a predicate child of this node.
 * @type XPathRegistryNode
 * @private
 */
XPathRegistryNode.prototype.getPredicateNode = function(n)
{
	var p = this.m_predicates[n];
	return (undefined == p ? null : p);
}


/**
 * Get the map of predicate nodes
 *
 * @return the map of child nodes
 * @type Map[XPathRegistryNodes]
 * @private
 */
XPathRegistryNode.prototype.getPredicates = function()
{
	return this.m_predicates;
}


/**
 * Add a DataModelListener to the node
 *
 * @param l the DataModelListener to add
 * @private
 */
XPathRegistryNode.prototype.addListener = function(l)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("XPathRegistryNode.prototype.addListener(listener: " + l + ")");
	this.m_listeners.push(l);
}


/**
 * Remove a DataModelListener from the node
 *
 * @param l the DataModelListener to add
 * @private
 */
XPathRegistryNode.prototype.removeListener = function(l)
{
	var listeners = this.m_listeners;
	var newListeners = [];
	for(var i = listeners.length - 1; i >= 0; i--)
	{
		var li = listeners[i];
		if(l == li)
		{
			li.dispose();
		}
		else
		{
			newListeners.push(li);
		}
	}

	this.m_listeners = newListeners;
}

/**
 * Private method to get the number of listeners registered
 * on this node. Only used during Unit testing
 *
 * @return the number of listener registered on this node
 * @type int
 * @private
 */
XPathRegistryNode.prototype._noOfListeners = function()
{
	return this.m_listeners.length;
}


/**
 * Get the array of DataModelListeners that are associated
 * with this node
 *
 * @return the array of the DataModelListeners for this node
 * @type Array[DataModelListeners]
 * @private
 */
XPathRegistryNode.prototype.getListeners = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryNode.prototype.getListeners() from node " + this.toString());

	/*if(DataModel.m_logger.isError())
	{
		var msg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.m_listeners(length " + this.m_listeners.length + ") = [";
		for(var j=0,len=this.m_listeners.length; j<len; j++)
		{
			msg += this.m_listeners[j] + ", ";
		}
		msg += "]";
		DataModel.m_logger.error(msg);
	}*/
	return this.m_listeners;
}


/**
 * Get an array containing all the DataModelListeners that are
 * associated with this node and its children.
 *
 * @return an array containing all the DataModelListeners for
 *   this node and its children.
 * @type Array[DataModelListeners]
 * @private
 */
XPathRegistryNode.prototype.getListenersRecursive = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryNode.prototype.getListenersRecursive() from node " + this.toString());

	// Copy this nodes listeners
	var ls = new Array();
	
	// Get the initial list of child nodes to process
	ls = this._getListenersRecursive(ls, this);
	
	return ls;
}

XPathRegistryNode.prototype._getListenersRecursive = function(ls, n)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryNode.prototype.getListenersRecursive(ls: " + ls + ", n: " + n + ") from node " + this.toString());

	// Append this nodes listeners to the list
	ls = n.m_listeners.concat(ls);
	
	// Add all listeners for child nodes
	for(var c in n.m_childNodes)
	{
		ls = this._getListenersRecursive(ls, n.m_childNodes[c]);
	}
	
	// Add all listeners for predicate nodes
	for(var p in n.m_predicates)
	{
		ls = this._getListenersRecursive(ls, n.m_predicates[p]);
	}
	
	// Return all the listeners
	return ls;
}
/*
 * Convert a node to string form, which can be read back in at a later date.
 * Takes the form of:
 * FormController.regNodes[4]=XPathRegistryNode.deserialise(
 *       '4' ,
 *       '/ds/var/form/db' ,
 *       'db' ,
 *       [] ,
 *       [16,27] ,
 *       [FormControllerListener.deserialise('DataBindingTestForm',
 *                                           'refresh',
 *                                           'DataBindingTestForm:refresh',
 *                                           '{}') ] 
 *   );
 *
 *   where : 
 *    the first parameter of FormControllerListener.deserialise is the objectRef used for later reconstruction
 *    the second is the Xpath the node corresponds to
 *    the third is the name of the node in the array (when reconstructed)
 *    the forth are the objectRefs of any predicates Nodes attached 
 *    the fifth are the objectRefs of the children of this node
 *    the sixth are the listeners attached to this node
 */
XPathRegistryNode.prototype.serialise = function()
{
    var xp = "'" + this.m_xp + "'\n";
    var value = "'" + this.m_value + "'\n";
    var objectRef = "'" + this.m_objectRef + "'\n";

    // Child nodes
    var childObjectRefArray = new Array(); 
    for (var a in this.m_childNodes)
    {
        if (a != "__parent__" && a != "__proto__") // Done for Mozilla
        {
            childObjectRefArray.push(this.m_childNodes[a].m_objectRef); 
        } 
    }
    var childRef = SerialisationUtils.stringArrayToLiteral(childObjectRefArray)+ "\n";   
    
    // Predicate nodes
    var predicateObjectRefArray = new Array(); 
    for (var a in this.m_predicates)
    {
        if (a != "__parent__" && a != "__proto__") // Done for Mozilla
        {
            predicateObjectRefArray.push(this.m_predicates[a].m_objectRef); 
        } 
    }
    var predicateRef = SerialisationUtils.stringArrayToLiteral(predicateObjectRefArray)+ "\n";   
    
    // Get the listeners attached to the node.
    var lstr = "[";    
    var foundListener = false;
    for (var i=0; i < this.m_listeners.length; i++)
    {
        lstr += this.m_listeners[i].serialise() + ","; 
        foundListener = true;
    }   
    if (foundListener)
    {
        lstr = lstr.substring(0,lstr.length-1); 
    }
    lstr += "]\n";

    // Construct final string.
    var str = "FormController.regNodes[" + this.m_objectRef + "]=XPathRegistryNode.deserialise(" +objectRef + "," + xp + "," + value + "," + predicateRef + "," + childRef + "," + lstr + ");\n";

    return str; 
}


XPathRegistryNode.deserialise = function(objectRef,xp,value,predicates,childRef,listeners)
{
   var node = new XPathRegistryNode();
   node.m_objectRef = objectRef;
   node.m_xp = xp;
   node.m_value = value;
   node.m_predicateRefArray = predicates;
   node.m_childRefArray=childRef;
   node.m_listeners = listeners;
   return node;
}




/**
 * Listener class used by the XPathRegistry to construct the XPath
 * matching tree
 *
 * @param dataModel the DataModel which is building its match tree
 * @constructor
 * @private
 */
function XPathRegistryListener(dataModel)
{
	this.m_objectRef = XPathRegistryListener.m_objectRef++;
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryListener() this = " + this.toString());
	this.m_dataModel = dataModel;
	
	this.reset();
}


// XPathRegistryListener is a sub class of XPathParserListener
XPathRegistryListener.prototype = new XPathParserListener();
XPathRegistryListener.prototype.constructor = XPathRegistryListener;

XPathRegistryListener.m_objectRef = 0;

XPathRegistryListener.prototype.toString = function()
{
	return "[XPathRegistryListener objectRef:" + this.m_objectRef + "]";
}

/**
 * Called when the XPathParser encounters a complete
 * element definition when parsing an xpath
 *
 * @param name the name of the element excluding any
 *        leading or trailing / or any predicate. Element
 *        name may be * to indicate any element or /
 *        to indicate a recursive match.
 * @private
 */
XPathRegistryListener.prototype.node = function(name)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryListener.prototype.node(name: " + name + ")");
	this.m_currentNode = this.m_currentNode.addChildNode(name);
}


/**
 * Called when the XPathParser encounters a complete
 * predicate definition.
 *
 * @param pred the string representation of the predicate
 *        excluding the surrounding [ ] characters
 * @private
 */
XPathRegistryListener.prototype.predicate = function(pred)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryListener.prototype.predicate(pred: " + pred + ")");
	//this.m_currentNode = this.m_currentNode.addPredicateNode(pred);
}


/**
 * Reset the listener so that it can be reused for a subsequent parse
 *
 * @private
 */
XPathRegistryListener.prototype.reset = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryListener.prototype.reset()");
	this.m_currentNode = this.m_dataModel.m_root;
}


/**
 * Get the node with the registration tree that has been
 * matched so far
 *
 * @return the XPathRegistryNode that has been matched so far
 * @type XPathRegistryNode
 * @private
 */
XPathRegistryListener.prototype.getCurrentNode = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathRegistryListener.prototype.getCurrentNode()");
	return this.m_currentNode;
}


/**
 * Listener class used by the XPathRegistry to construct the XPath
 * matching tree
 *
 * @param dataModel the DataModel which is building its match tree
 * @constructor
 * @private
 */
function XPathMatchListener(dataModel)
{
	this.m_objectRef = XPathMatchListener.m_objectRef++;
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener() this = " + this.toString());
	this.m_dataModel = dataModel;

	this.reset();	
}

XPathMatchListener.clone = function(source)
{
	// Store result in the cache
	var target = new XPathMatchListener(source.m_dataModel);
	
	for(var i in source)
	{
		target[i] = source[i];
	}
	
	for(var j in source.m_parentXPaths)
	{
		target.m_parentXPaths[j] = source.m_parentXPaths[j];
	}
	for(var k in source.m_matchedNodes)
	{
		target.m_matchedNodes[k] = source.m_matchedNodes[k];
	}

	return target;
}


// XPathMatchListener is a sub class of XPathParserListener
XPathMatchListener.prototype = new XPathParserListener();
XPathMatchListener.prototype.constructor = XPathMatchListener;

XPathMatchListener.clone = function(source)
{
	// Store result in the cache
	var target = new XPathMatchListener(source.m_dataModel);
	
	for(var i in source)
	{
		target[i] = source[i];
	}
	for(var j in source.m_parentXPaths)
	{
		target.m_parentXPaths[j] = source.m_parentXPaths[j];
	}
	for(var k in source.m_matchedNodes)
	{
		target.m_matchedNodes[k] = source.m_matchedNodes[k];
	}

	return target;
}

XPathMatchListener.m_objectRef = 0;

XPathMatchListener.prototype.toString = function()
{
	return "[XPathMatchListener objectRef:" + this.m_objectRef + "]";
}

/**
 * Called when the XPathParser encounters a complete
 * element definition when parsing an xpath
 *
 * @param name the name of the element excluding any
 *        leading or trailing / or any predicate. Element
 *        name may be * to indicate any element or /
 *        to indicate a recursive match.
 * @private
 */
XPathMatchListener.prototype.node = function(name)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.node(name: " + name + ")");
	fc_assert("*" != name, "Cannot use xpath wildcard match when setting a value");
	fc_assert("/" != name, "Cannot use xpath decendant match when setting a value");

	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node() this.m_lastName = " + this.m_lastName);
	if(null != this.m_lastName)
	{
		// Match against the matching tree
		this._matchCurrentNodeChildren(this.m_lastName);
		
		// See if the DOM contains a suitable child
		this._matchDOMNode(this.m_lastName, this.m_lastPred);
	}
	
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node() setting this.m_lastName = " + name);
	this.m_lastName = name;
}


/**
 *
 */
XPathMatchListener.prototype._matchDOMNode = function(name, pred)
{
	////if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype._matchDOMNode(name: " + name + ", predicate: " + pred + ")");
	var xp = name;

	if(pred.length != 0)
	{
		var predicatesStr = "";
		
		do {
			predicatesStr += ('[' + pred.shift() + ']');
		} while(pred.length != 0);

		xp += predicatesStr;
	}

	// Keep list of parent XPaths
	this.m_aggregateXPath += ("/" + xp);
	////if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_matchDOMNode() this.m_aggregateXPath = " + this.m_aggregateXPath);
	
	// When creating a parent nodes we need to notify the application
	// of the newly created nodes. Keep a list of XPathRegistry nodes
	// whose listeners will need to be notified if this element in the
	// document needs to be created.
	var notifyNodes = new Array();
	for(var i = 0, l = this.m_matchedNodes.length; i < l; i++)
	{
		var matchedNode = this.m_matchedNodes[i];
		if(matchedNode.getValue() != '/')
		{
			////if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_matchDOMNode() adding node to notifyNodes[length=" + notifyNodes.length + "], matchedNode = " + matchedNode);
			notifyNodes[notifyNodes.length] = matchedNode;
		}
	}
	
	////if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;_matchDOMNode() adding object to this.m_parentXPaths");
	this.m_parentXPaths.push({parent: this.m_aggregateXPath, node: name, notify: notifyNodes});
}


/**
 * Determine which of the currently matched node's children match the 
 * specified node name, and add them to the list of matched nodes
 *
 * @param name the name of the node to match
 * @private
 */
XPathMatchListener.prototype._matchCurrentNodeChildren = function(name)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype._matchCurrentNodeChildren(name: " + name + ")");
	// For each existing matched node, attempt to match the new node to one
	// of the children of the existing matched node
	var m = this.m_matchedNodes;
	var l = m.length;  // Handle all currently matched nodes
	for(var i = 0; i < l; i++)
	{
		var n = m.shift();
		//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; removed node " + n + " from this.m_matchedNodes");
		
		// Add recursive matches back into the list of matched nodes.
		if('/' == n.getValue()) m.push(n);

		//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; match the children from this.m_matchedNodes, matching against node " + n);
		// Match the children of this node
		this._matchChildren(n, name);
	}
}


/**
 * Determine which of the specified node's children match the specified
 * node name, and add them to the list of matched nodes
 *
 * @param n the node whose children to test for a match
 * @param name the name of the node to match
 * @private
 */
XPathMatchListener.prototype._matchChildren = function(n, name)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype._matchChildren(parentNode: " + n + ", node to match: " + name + ")");
	// Match children
	var c = n.getChildren();
	for(var i in c)
	{
		switch(i)
		{
			case '/':
				// Add the recursive match to the list of nodes to match
				//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child = \"/\" therefore adding child node " + c[i] + " to this.m_matchedNodes");
				this.m_matchedNodes.push(c[i]);
				
				// Match all children of the recursive node immediately
				this._matchChildren(c[i], name);
				break;
		
			case '*':
				// * Matches all nodes
				//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child = \"*\" therefore adding child node " + c[i] + " to this.m_matchedNodes");
				this.m_matchedNodes.push(c[i]);
				break;
		
			default:
				// If the name of the match node matches the child, then add the child node
				if(i == name)
				{
					//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;child node equals node to match therefore adding child node " + c[i] + " to this.m_matchedNodes");
					this.m_matchedNodes.push(c[i]);
				}
				break;
		}
	}

	/*if(DataModel.m_logger.isError())
	{	
		var msg = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;this.m_matchedNodes(length=" + this.m_matchedNodes.length + ") = [";
		for(var j=0; j<this.m_matchedNodes.length; j++)
		{
			msg += this.m_matchedNodes[j] + ", ";
		}
		msg += "]";
		DataModel.m_logger.error(msg);
	}*/

	// Match children of any predicates as well - note predicates in the matching xpath are ignored!
	var p = n.getPredicates();
	for(var i in p)
	{
		this._matchChildren(p[i], name);
	}
}


/**
 * Called when the XPathParser encounters a complete
 * predicate definition.
 *
 * @param pred the string representation of the predicate
 *        excluding the surrounding [ ] characters
 * @private
 */
XPathMatchListener.prototype.predicate = function(pred)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.predicate(predicate: " + pred + ")");
	this.m_lastPred.push(pred);
}


/**
 * Reset the listener so that it may be reused in a subsequent parse
 *
 * @private
 */
XPathMatchListener.prototype.reset = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.reset(), this = " + this.toString());
	
	this.m_lastName = null;
	this.m_lastPred = new Array();

	// The list of matched nodes located so far.
	this.m_matchedNodes = new Array();

	// Start at root node of matching tree
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;reset(), adding the root registry node this.m_dataModel.m_root to this.m_matchedNodes");
	this.m_matchedNodes.push(this.m_dataModel.m_root);

	// The matched xpath as the parse progresses	
	this.m_aggregateXPath = "";
	
	// Array containing the xpath to select a node at each level of the parse
	this.m_parentXPaths = new Array();


	// The list of nodes that need to be constructed in the DOM when setting the value
//	this.m_constructNodes = new Array();
	
	// Start at root node of DOM
//	this.m_domNode = this.m_dataModel.m_dom;
	
	// Contains the last node that exists in the DOM for the matched XPath
	// m_constructNodes contains that need to added below this node
//	this.m_lastDOMNode = null;
	
}




XPathMatchListener.prototype.finishMatch = function()
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.finishMatch(), this = " + this.toString());
	if(null != this.m_lastName)
	{
		// Perform any remaining matching that needs to be done
		this._matchCurrentNodeChildren(this.m_lastName);

		// See if the DOM contains a suitable child
		this._matchDOMNode(this.m_lastName, this.m_lastPred);

		this.m_lastName = null;
	}
}

XPathMatchListener.prototype.createElementsToPath = function(invokeListeners)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.createElementsToPath()");
	var pxps = this.m_parentXPaths;
	var dom = this.m_dataModel.m_dom;
	var n = null;
	var i = pxps.length - 1;
	var found = false;
	var created = false;
	
	while(i >= 0 && !found)
	{
		// See whether the element exists in the DOM or not
		var ns = dom.selectNodes(pxps[i].parent);
	
		switch(ns.length)
		{
			case 0:
				// No node found at this level - move up to the next parent
				i--;
				break;
			
			case 1:
				// Keep the found child as the most recently found node
				var found = true;
				i++;
				n = ns[0];
				break;
				
			default:
				// Cannot set multiple children
				throw new XPathParserListenerError("Multiple nodes selected by xpath fragment: " + pxps[i].parent);
				break;
		}
	}

	// If no node was found, use the dom as the root to start creating nodes.	
	if(null == n)
	{
		n = dom;
		i = 0;
	}

	var newNodes = new Array;
	if(i < pxps.length)
	{
		// We're creating the node rather than updating it
		created = true;
		
		// Create any necessary parent nodes
		var length = pxps.length;
		for(var j = i; j < length; j++)
		{
			//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createElementsToPath(), creating element " + pxps[j].node);
			var c = dom.createElement(pxps[j].node);
			n.appendChild(c);
			n = c;
			//Do not fire events for the last element being created as this will be handled by the set value
			//Method that invokes this.
			if (j <pxps.length)
			{
				if(invokeListeners == true)
				{
					// Notify listeners to the XPath of the newly created element that
					// it has been created
					var notifyNodes = pxps[j].notify;
					for(var k = notifyNodes.length-1; k>=0 ; k--)
					{
						newNodes.push(notifyNodes[k]);
						var e = DataModelEvent.create(pxps[j].parent, DataModelEvent.ADD);
						var li = notifyNodes[k].getListeners();
						//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createElementsToPath(), about to notify nodes of newly created element, event = " + e);
						for(var m = 0; m < li.length; m++)
						{
							//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createElementsToPath(), invoking listener " + li[m] + " with event = " + e);
							li[m].invoke(e);
						}					
					}
				}
			}
		}
	}
	//n["created"] = created;
	var wrapper = new Array();
	wrapper["node"] = n;
	wrapper["created"] = created;
	// array of XPathRegistryNodes
	wrapper["notifyNodes"] = newNodes;
	return wrapper;
}


/**
 * Set the value in the underlying DOM, creating any required
 * nodes as required.
 *
 * @param value the value to set the node to.
 * @return true if a new was created, or false if the node existed and
 *   was simply updated.
 * @type Boolean
 * @private
 */
XPathMatchListener.prototype.setDOMValue = function(v)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.setDOMValue(v:" + v + ")");
	var n = this.createElementsToPath(true);

	// Replace the text content Lof the selected Node
	XML.replaceNodeTextContent(n["node"], v);
	
	//if(DataModel.m_logger.isInfo()) DataModel.m_logger.info("XPathMatchListener.setDOMValue() node[created] = " + n["created"]);
	
	return n["created"];
}


/**
 * Invoke the listeners of matched nodes
 *
 * @param t the eventType as defined in DataModelListener
 * @private
 */
XPathMatchListener.prototype.invokeMatchedNodesListeners = function(t)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.invokeMatchedNodesListeners(DataModelEvent: " + t + ")");
	// Get list of real matches - ignoring recursive match elements which
	// may be in the matched array
	var m = this.m_matchedNodes;
	for(var i = 0, l = m.length; i < l; i++)
	{
		if('/' != m[i].getValue())
		{
			var li = m[i].getListeners();
			for(var j = 0, ll = li.length; j < ll; j++)
			{
				//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.invokeMatchedNodesListeners() invoking listener number " + j);
				li[j].invoke(t);
			}
		}
	}	
}

/**
* Invoke the listeners for a XPathRegistryNode recursively down through all child nodes
*
* @param t the eventType as defined in DataModelListener
* @param m the XPathRegistryNode
*/

XPathMatchListener.prototype.invokeRecursiveMatchedNodeListeners = function(t,m)
{
	//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.invokeRecursiveMatchedNodeListeners(DataModelEvent: " + t + ", XPathRegistryNode: " + m + ")");
		//m is an XPathRegistryNode
		if ('/' != m.getValue())
		{
			var listeners = m.getListeners() ;
			
			for (var j=0, c = listeners.length; j < c; j++)
			{
				//if(DataModel.m_logger.isError()) DataModel.m_logger.error("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;XPathMatchListener.prototype.invokeRecursiveMatchedNodeListeners() invoking listener number " + j);
				listeners[j].invoke(t) ;
			}
			var children = m.getChildren() ;
			for (var k in children)
			{
				this.invokeRecursiveMatchedNodeListeners(t,children[k]);				
			}
		}
}




