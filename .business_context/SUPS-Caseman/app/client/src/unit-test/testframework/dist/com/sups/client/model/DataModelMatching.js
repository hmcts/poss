/**
 * Replaces or overwrites the contents on a node at a specified xpath. If there are nodes
 * that are not in the new nodeset then they are removed, if there are existing nodes in the
 * dom and the new nodeset then they are updated, and if there are new nodes in the nodeset
 * then they are added to the dom. Essentially we are performing a removeNode followed by 
 * a addNodeSet except that we are aggregating the events from both operation and where
 * there is a remove and add event for the same node we are combining them to be an update
 * event.
 *
 * @param xp the xpath to overwrite the nodes in the dom
 * @param nodes the nodeset to overwrite the nodes in the dom
 * @throws DataModelError if there was an error
 */
DataModel.prototype.replaceNode = function(xp, nodes)
{
	/*("DataModel_replaceNode")*/

	if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("** DataModel.prototype.replaceNode(xp:" + xp + ")");

	this._startTransaction();
	var listeners = null;

	/*** remove the nodes at the specified xpath **************/
	var removedListeners = null;
	var nodesToRemove = this.m_dom.selectNodes(xp) ;
	if(nodesToRemove.length > 0)
	{
		listeners = this.matchAgainstNodes(xp, nodesToRemove);
		removedListeners = listeners.slice(0);
	}
	else
	{
		removedListeners = new Array();
	}
	var removeEvent = DataModelEvent.create(xp,DataModelEvent.REMOVE);

	// actually remove the nodes from the underlying dom
	var parent = null;
	for(var i = 0, l = nodesToRemove.length; i < l; i++)
	{
		var child = nodesToRemove[i] ;	
		parent = child.parentNode;
		parent.removeChild(child) ;	
	}
	/**********************************************************/

	/*** add the nodes at the specified xpath **************/
	if(null == nodes)
	{
		if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.replaceNode(), source dom is null, therefore we have only removed the node at the specified xpath");
		this.invokeListeners(removedListeners, removeEvent);
		this._endTransaction();
	}
	else
	{
		var rootNode = this._getRootNode(nodes);
		if(null == rootNode)
		{
			if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.replaceNode(), source dom rootNode is null, therefore we have only removed the node at the specified xpath");
			this.invokeListeners(removedListeners, removeEvent);
		}
		else
		{
			// It is possible for someone to replace a node that doesn't actually exist in the DOM
			// in which case we will need to create the elements to the specified path
			if(null == parent)
			{
				var l = this.parseXPath(xp);
				var toNode = l.createElementsToPath(true);
				parent = toNode["node"].parentNode;
				parent.removeChild(toNode["node"]) ;	
				parent.appendChild(rootNode.cloneNode(true));
			}
			else
			{
				parent.appendChild(rootNode.cloneNode(true));
			}
			
			listeners = this.matchAgainstNodes(xp, new Array(rootNode));
			var addedListeners = listeners.slice(0);
	
			var n = this.m_dom.selectNodes(xp);
			var position = n.length;
			var addedXp = xp + "[position() = " + position + "]";
			var addEvent = DataModelEvent.create(addedXp,DataModelEvent.ADD);
			var updateEvent = DataModelEvent.create(addedXp,DataModelEvent.UPDATE);
	
			// combine the events, remove duplicates and invoke events
			this.invokeCombinedListeners(addedListeners, removedListeners, addEvent, removeEvent, updateEvent);
		}
		this._endTransaction();
		nodes = null;
/*
		if (this.m_dirtyFlag == false)
		{
			if (this.isXPathInDirtyCheckedSubTree(xp))
			{
				this.setDirty(true) ;
			}
		}
		*/
	}
	/*("DataModel_replaceNode")*/
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
DataModel.prototype.addNodeSet = function(fromDom, toXPath)
{
	if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("** DataModel.prototype.addNodeSet(xp:" + toXPath + ")");

	/*("DataModel_addNodeSet")*/
	if(null == fromDom)
	{
		if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.addNodeSet(), source dom is null");
	}
	else
	{
		var rootNode = this._getRootNode(fromDom);
		var originalToXPath = toXPath ;
		if(null == rootNode)
		{
			if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.addNodeSet(), source dom rootNode is null");
		}
		else
		{
			this._startTransaction();
		
			var l = this.parseXPath(toXPath);
			var toNode = l.createElementsToPath(true);
			// Need to clone nodes...
			toNode["node"].appendChild(rootNode.cloneNode(true));
			
			toXPath = XPathUtils.concatXPaths(toXPath, rootNode.nodeName);
			var listeners = this.matchAgainstNodes(toXPath, new Array(rootNode));
	
			// add a predicate for adding nodes so we can select the added node inside the retrieveSrcData()
			// methods for applying deltas rather than re-getting all source data.
			var n = this.m_dom.selectNodes(toXPath);
			var position = n.length;
			toXPath = toXPath + "[position() = " + position + "]";
			var event = DataModelEvent.create(toXPath,DataModelEvent.ADD);
	
			// Invoke the listeners of the matched nodes with the DataModelEvent
			this.invokeListeners(listeners, event);
	
			this._endTransaction();
/*
			if (this.m_dirtyFlag == false)
			{
				var expandedXPath = originalToXPath + "/" + rootNode.nodeName ;
				if (this.isXPathInDirtyCheckedSubTree(expandedXPath))
				{
					this.setDirty(true) ;
				}
			}
*/
		}
		fromDom = null;
	}
	/*("DataModel_addNodeSet")*/
}
DataModel.prototype.addNodeSetWithoutEvents = function(fromDom, toXPath)
{
	/*("DataModelMatching_addNodeSetWithoutEvents")*/
	if(null == fromDom)
	{
		if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.addNodeSet(), source dom is null");
	}
	else
	{
		var rootNode = this._getRootNode(fromDom);
		if(null == rootNode)
		{
			if(DataModel.m_logger.isWarn()) DataModel.m_logger.warn("DataModel.addNodeSet(), source dom rootNode is null");
		}
		else
		{
			var l = this.parseXPath(toXPath);
			var toNode = l.createElementsToPath(false);
			//toNode["node"].appendChild(rootNode.cloneNode(true));
			
			// Add root node to target, but check for target
			// already having a child node with the same name
			var targetNode = toNode["node"];
			
			var targetChild = null;
			
			var childIndex = -1;
			var rootNodeName = rootNode.nodeName;
			var targetChildren = targetNode.childNodes;
			
			for(var i = 0, l = targetChildren.length; i < l; i++)
			{
			    targetChild = targetChildren[i];
			    if(targetChild.nodeType == XML.ELEMENT_NODE)
			    {
			        if(targetChild.nodeName == rootNodeName)
			        {
			            childIndex = i;
			            break;
			        }
			    }
			}
			
			if(childIndex == -1)
			{
			    // Target does not have a child node with
			    // the same name as the root node
			    targetNode.appendChild( rootNode.cloneNode(true) );
			}
			else
			{
			    // Target node does have an existing node with
			    // the same name as the root node
			    if(rootNode.childNodes.length > 0)
			    {
			        // Attempt to add children of root node
			        // to appropriate child of target
			        this._appendChildrenToTargetNode(targetChildren[childIndex], rootNode.childNodes);
			    }
			    else
			    {
			        // No children to transfer. Therefore, add duplicate child!
			        targetNode.appendChild( rootNode.cloneNode(true) );
			    }
			    
			}
			
		}
		fromDom = null;
	}
	/*("DataModelMatching_addNodeSetWithoutEvents")*/
}

/**
 * Method attempts to add a set of children to a target node. However,
 * if the target node already has an existing child node with the same name
 * as one of the nodes to be added the method will attempt to
 * add the children of the node to be added to the target node's
 * child. If the child node to be added has no children the node will
 * be added to the target node causing the target node to have two
 * child nodes with the same name.
 *
*/
DataModel.prototype._appendChildrenToTargetNode = function( target, children )
{
    var childIndex;
    var child;
    var targetChild;
    
    var targetChildren = target.childNodes;
    
    // Loop through children to be added to target
    for(var i = 0, il = children.length; i < il; i++)
    {
        child = children[i];
        
        if(child.nodeType == XML.ELEMENT_NODE)
        {
            // Determine whether target already has a child with this name.
            childIndex = -1;
            for(var j = 0, jl = targetChildren.length; j < jl; j++)
            {
                targetChild = targetChildren[j];
                if(targetChild.nodeType == XML.ELEMENT_NODE)
                {
                    if(targetChild.nodeName == child.nodeName)
                    {
                        childIndex = j;
                        break;
                    }
                }
                
            }
            
            if(childIndex == -1)
            {
                // Target does not have a child with the name of the child node 
                // being added
                target.appendChild( child.cloneNode(true) );
            }
            else
            {
                if(child.childNodes.length > 0)
                {
                    this._appendChildrenToTargetNode( targetChildren[j], child.childNodes );
                }
                else
                {
                    // Although target node has child of same name node to
                    // be appended has no children.
                    target.appendChild( child.cloneNode(true) );
                }
                
            }
            
        }
        
    }
    
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
* @return the nodes removed by this method
*/
DataModel.prototype.removeNode = function(xp)
{
	if(DataModel.m_logger.isDebug()) DataModel.m_logger.debug("** DataModel.prototype.removeNode(xp:" + xp + ")");

	/*("DataModel_removeNode")*/	
	this._startTransaction() ;

	var nodesToRemove = this.m_dom.selectNodes(xp) ;
	var listeners = this.matchAgainstNodes(xp, nodesToRemove);
	var event = DataModelEvent.create(xp,DataModelEvent.REMOVE);

	// Invoke the listeners of the matched nodes with the DataModelEvent
	this.invokeListeners(listeners, event);

	// actually remove the nodes from the underlying dom
	for(var i = 0, l = nodesToRemove.length; i < l; i++)
	{
		var child = nodesToRemove[i] ;	
		var parent = child.parentNode;
		parent.removeChild(child) ;	
	}
	
	//Check to see if there where any nodes to remove
	//Check to see if the dirty flag has already been set
/*
	if (this.m_dirtyFlag == false)
	{
		if (nodesToRemove.length > 0)
		{
			if (this.isXPathInDirtyCheckedSubTree(xp))
			{
				this.setDirty(true) ;
			}
		}
	}
*/
	this._endTransaction();
	/*("DataModel_removeNode")*/
	return nodesToRemove;
}

/**
 * Remove duplicates from a set of listeners and invoke
 **/
DataModel.prototype.invokeListenersFromHashMap = function(listeners, event)
{
	// Invoke the listeners of the matched nodes with the DataModelEvent
	var totalListeners = new Array();
	var m = listeners;
	for(var i in m)
	{
		if('/' != m[i].getValue())
		{
			var li = m[i].getListeners();
			for(var j = 0, ll = li.length; j < ll; j++)
			{
				//totalListeners.push(li[j]);
				totalListeners[totalListeners.length] = li[j];
			}
		}
	}
	this._invokeUniqueListeners(totalListeners, event);
}

/**
 * Remove duplicates from a set of listeners and invoke
 **/
DataModel.prototype.invokeListeners = function(listeners, event)
{
	// Invoke the listeners of the matched nodes with the DataModelEvent
	var totalListeners = new Array();
	var m = listeners;
	for(var i = m.length-1; i>=0; i--)
	{
		if('/' != m[i].getValue())
		{
			var li = m[i].getListeners();
			for(var j = li.length-1; j>=0; j--)
			{
				//totalListeners.push(li[j]);
				totalListeners[totalListeners.length] = li[j];
			}
		}
	}
	this._invokeUniqueListeners(totalListeners, event);
}

/**
 * Remove duplicates from a set of listeners and invoke
 **/
DataModel.prototype._invokeUniqueListeners = function(totalListeners, event)
{
 	// Invoke listeners, ignoring duplicates
 	var count = 0;
 	totalListeners.sort(FormControllerListener._sortFormControllerListeners);
 	var last = null;
 	while(totalListeners.length > 0)
 	{
 		var candidate = totalListeners.pop();
 		if(last != candidate)
 		{
 			last = candidate;
 			candidate.invoke(event);
 			count++;
 		}
 	}
 	if(DataModel.m_logger.isInfo())
 	{
	 	if(event.getType() == DataModelEvent.REMOVE)
	 	{
	 		if(DataModel.m_logger.isInfo()) DataModel.m_logger.info("***** invoked " + count + " listeners with REMOVE event");
	 	}
	 	else if(event.getType() == DataModelEvent.UPDATE)
	 	{
	 		if(DataModel.m_logger.isInfo()) DataModel.m_logger.info("***** invoked " + count + " listeners with UPDATE event");
	 	}
	 	else
	 	{
	 		if(DataModel.m_logger.isInfo()) DataModel.m_logger.info("***** invoked " + count + " listeners with ADD event");
	 	}
	 }
}

/**
 * combine the events, remove duplicates and invoke events
 **/
DataModel.prototype.invokeCombinedListeners = function(addedListeners, removedListeners, addEvent, removeEvent, updateEvent)
{
	var totalNodes = new Array();
	var adds = addedListeners;
	var removes = removedListeners;
	
	var removesHashMap = new Array();
	var addsHashMap = new Array();
	var combinedHashMap = new Array();

	// construct a hashmap of adds, removes and combined adds and removes
	for(var j=0, m=removes.length; j < m; j++)
	{
		var item = removes[j];
		removesHashMap[item.getObjectRef()] = item;
		combinedHashMap[item.getObjectRef()] = item;
	}
	for(var i=0, n=adds.length; i < n; i++)
	{
		var item = adds[i];
		addsHashMap[item.getObjectRef()] = item;
		combinedHashMap[item.getObjectRef()] = item;
	}

	// Check to see if registry nodes exist in both add and remove hashmaps
	// and if so then move to the updates array, and remove node from the add and remove maps
	for(var r in combinedHashMap)
	{
		var item = combinedHashMap[r];
		if(addsHashMap[r] && removesHashMap[r])
		{
			//totalNodes.push(item);
			totalNodes[totalNodes.length] = item;
			delete addsHashMap[r];
			delete removesHashMap[r];
		}
	}
	if(totalNodes.length > 0) this.invokeListeners(totalNodes, updateEvent);
	totalNodes.length = 0;

	this.invokeListenersFromHashMap(removesHashMap, removeEvent);
	this.invokeListenersFromHashMap(addsHashMap, addEvent);
}

/**
 * Find the set of listeners for removing a node and all it's children from the DOM
 **/
DataModel.prototype.matchAgainstNodes = function(xp, nodes)
{
	// parse the original xpath to get the set of listeners
	var l = this.parseXPath(xp);
	
	if(nodes.length > 0)
	{
		// then perform the additional recursive check of the listener tree
		// against the set of nodes to be removed from the dom so we can only
		// find the listeners that should be triggered by the remove
		l = l.matchAgainstNodes(nodes, xp);
	}
	return l;
}

/**
 * Find the set of listeners for removing a node and all it's children from the DOM
 **/
DataModel.prototype._getRootNode = function(fromDom)
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
 * For each of the matched nodes, loop through and check if the children of the registry node
 * match against the nodes in the removed / added dom. All of the results are then concatenated
 * sorted and any duplicates removed. 
 * ToDo: we need to store more information regarding the node
 **/
XPathMatchListener.prototype.matchAgainstNodes = function(nodes)
{
	this.m_totalMatches = new Array();

	// take a copy of the matched nodes for the top level removed node
	// we will take the root level xp as "/" because we are interested in
	// the relative path from the start point of deleting
	this.m_totalMatches["/"] = this.m_matchedNodes.slice(0);
	
	for(var i=0; i<this.m_matchedNodes.length; i++)
	{
		// get xp from the children of the registry node
		var registryNode = this.m_matchedNodes[i];
		
		if(registryNode.getValue()=="/")
		{
			this._matchListenerChildrenAgainstNodes(registryNode, nodes, "./");
		}
		else
		{
			this._matchListenerChildrenAgainstNodes(registryNode, nodes, ".");
		}
	}
	
	// amalgamate all matched listener arrays and remove duplicates, then return for listener invocations
	var totalMatches = new Array();
	for(var i in this.m_totalMatches)
	{
		totalMatches = totalMatches.concat(this.m_totalMatches[i]);
		delete this.m_totalMatches[i];
	}

 	// Remove duplicates
	this.m_totalMatches.length = 0;
 	totalMatches.sort(XPathRegistryNode._sortRegistryNodes);

 	var last = null;
 	var tm = this.m_totalMatches;
 	while(totalMatches.length > 0)
 	{
 		var candidate = totalMatches.pop();
 		if(last != candidate.getObjectRef())
 		{
 			last = candidate.getObjectRef();
 			//this.m_totalMatches.push(candidate);	
 			tm[tm.length] = candidate;
 		}
 	}

	return this.m_totalMatches;
}

/**
 * Recurse down over a set of registry nodes and their children matching against
 * the nodes removed to find the set of listeners that should be triggered by the node removal.
 *
 * @param registryNode the node to match the children against the nodes in the dom
 * @param nodes the nodeset that is being added or removed
 * @param xp the cumalitive xpath to this point which is used to select against the nodes to see if there is a match
 * @private
 **/
XPathMatchListener.prototype._matchListenerChildrenAgainstNodes = function(registryNode, nodes, xp)
{
	// For each existing matched node, attempt to match the new node to one
	// of the children of the existing matched node
	var children = registryNode.getChildren();
	for(var i in children)
	{
		var childXp = null;
		var bMatch = false;
		var child = children[i];
		var childValue = child.getValue();
		// if we have a recursive end of the xp then don't add another trailing '/'
		if(xp.length>2 && (xp.lastIndexOf("//") == (xp.length-2)))
		{
			childXp = xp + childValue;
		}
		else
		{
			childXp = xp + "/" + childValue;
		}
		
		if(childValue == "/" || childValue == "*")
		{
			this._addChildToTotalMatches(childXp, child);
			bMatch = true;
		}
		else
		{
			var result = null;
			for(var i=0, l=nodes.length; i<l ;i++)
			{
				result = nodes[i].selectNodes(childXp);
				if(result.length > 0) break;
			}
			if(result.length > 0)
			{
				this._addChildToTotalMatches(childXp, child);
				bMatch = true;
			}
		}
		
		if(bMatch)
		{
			// Match the children of this node
			this._matchListenerChildrenAgainstNodes(child, nodes, childXp);
		}
	}
}

XPathMatchListener.prototype._addChildToTotalMatches = function(xp, node)
{
	if(null == this.m_totalMatches[xp]) this.m_totalMatches[xp] = new Array();
	this.m_totalMatches[xp][this.m_totalMatches[xp].length] = node;
}

/**
 * Utility comparator function to help sort an array of XPathRegistryNodes, this is
 * used to order the nodes so we can test for and remove duplicates.
 * @param a XPathRegistryNode
 * @param b XPathRegistryNode
 */
XPathRegistryNode._sortRegistryNodes = function(a, b)
{
	if(a.getObjectRef() > b.getObjectRef())
	{
		return 1;
	}
	else if(a.getObjectRef() == b.getObjectRef())
	{
		return 0;
	}
	return -1;
}
