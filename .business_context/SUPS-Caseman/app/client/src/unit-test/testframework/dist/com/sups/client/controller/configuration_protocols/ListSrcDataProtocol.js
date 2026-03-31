//==================================================================
//
// ListSrcDataProtocol.js
//
// Class which provides the members required by a GUIAdaptor for it
// to support a datasrc, e.g. grids or select options.
//
//==================================================================

/**
 * Utility class used to concatenate xpaths etc.
 *
 * @constructor
 * @public
 */
function XPathUtils()
{
}

XPathUtils.m_logger = new Category("XPathUtils");

/**
 * Concatenate 2 xpaths taking into account the separator character '/'
 *
 * @param xp1 the first xpath
 * @param xp2 the xpath to concatenate to xp1
 * @type string xpath containing the concatenation of xp1 and xp2
 * @public
 */
XPathUtils.concatXPaths = function(xp1, xp2)
{
	if(null==xp1 || xp1=="")
	{
		throw new ConfigurationException("XPathUtils.concatXPaths(), cannot concatenate an xpath to an empty xpath");
	}
	var result = xp1;
	if(null!=xp2 && xp2 != "")
	{
		if(xp1.lastIndexOf("/") != (xp1.length-1))
		{
			result += "/";
		}
		if(xp2.charAt(0) == '/')
		{
			xp2 = xp2.slice(1);
		}
		result += xp2;
	}
	if(XPathUtils.m_logger.isTrace())
	{
		XPathUtils.m_logger.trace("XPathUtils.concatXPaths(" + xp1 + ", " + xp2 + "): returning " + result);
	}
	return result;
}

XPathUtils.removeTrailingNode = function(xp)
{
	xp = XPathUtils.removeTrailingSlash(xp);
	var index = xp.lastIndexOf("/");
	xp = xp.substring(0, index);
	return xp;
}

XPathUtils.getTrailingNode = function(xp)
{
	xp = XPathUtils.removeTrailingSlash(xp);
	var index = xp.lastIndexOf("/");
	xp = xp.substring(index+1);
	return xp;
}

XPathUtils.removeLeadingSlash = function(xp)
{
	if(xp && (xp!=""))
	{
		if(xp.charAt(0) == '/')
		{
			xp = xp.slice(1);
		}
	}
	return xp;
}

XPathUtils.removeTrailingSlash = function(xp)
{
	if(xp && (xp!=""))
	{
		if(xp.charAt(xp.length-1) == '/')
		{
			xp = xp.slice(0, length-1);
		}
	}
	return xp;
}

/**
 * Determine name of last node in XPath.
 *
*/


XPathUtils.getLastNodeName = function(xp)
{
    if(xp && (xp != "") )
    {   
        // Clear any leading and trailing foreslashes
        
        xp = XPathUtils.removeLeadingSlash( xp );
        xp = XPathUtils.removeTrailingSlash( xp );
        
        // Locate last node name if more than one node in name
          
        var lastForeslash = xp.lastIndexOf( "/" );
              
        if(lastForeslash != -1)
        {      
            xp = xp.substr( lastForeslash + 1 );      
        }
        
        // Remove any predicates present
              
        var openSquareBracket = xp.indexOf( "[" );
              
        if(openSquareBracket != -1)
        {      
            xp = xp.substr( 0, openSquareBracket );      
        }
              
    }
          
    return xp;
          
}

/**
 * Method getNameOfLastNode performs a similar function to method
 * getLastNodeName. However, in this method any trailing predicates
 * are removed before the name of the last node is determined. This
 * prevents XPaths with trailing predicates which contain foreslashes
 * from confusing the determination of the name of the last node.
 *
 * At present (fw 9.0.16) this method is only used in the method
 * invokeMarkRecordDirty in the RecordsProtocol.
*/
XPathUtils.getNameOfLastNode = function(xp)
{
    if(xp && (xp != "") )
    {   
        // Clear any leading and trailing foreslashes
        
        xp = XPathUtils.removeLeadingSlash( xp );
        xp = XPathUtils.removeTrailingSlash( xp );

        // Clear trailing predicates
        xp = XPathUtils.removeTrailingPredicates( xp );
        
        // Locate last node name if more than one node in name
          
        var lastForeslash = xp.lastIndexOf( "/" );
              
        if(lastForeslash != -1)
        {      
            xp = xp.substr( lastForeslash + 1 );      
        }
              
    }
          
    return xp;
          
}

/**
 * Method removes one, or more, predicates which
 * trail the last node name in an XPath.
 *
*/
XPathUtils.removeTrailingPredicates = function(xpath)
{
    var xp = xpath;

    if(xp && (xp != ""))
    {
        var startLength = null;
        var endLength = null;

        do
        {
            if(null != endLength)
            {
                startLength = endLength;
            }
            else
            {
                startLength = xp.length;
            }

            // Remove trailing predicate, if present
            xp = XPathUtils.removeTrailingPredicate(xp);

            endLength = xp.length;

        } while(endLength > 0 && endLength < startLength)

    }

    return xp;

}

/**
 * Method removeTrailingPredicate removes the last
 * predicate trailing the last node name in an XPath
 * if such a predicate exists.
 *
*/
XPathUtils.removeTrailingPredicate = function(xpath)
{
    var xp = xpath;

    if(xp && (xp != ""))
    {
        var length = xp.length;

        if(xp.charAt(length - 1) == "]")
        {
            // Assume trailing predicate. Find start of predicate taking
            // possible nested predicates into account.
            var unmatchedCloseSquareBracketCount = 1;

            var searchPos = length - 2;
            var charAtPos = null;

            while(searchPos >= 0)
            {
                charAtPos = xp.charAt(searchPos);

                if(charAtPos == "]")
                {
                    unmatchedCloseSquareBracketCount += 1;
                }
                else if(charAtPos == "[")
                {
                    unmatchedCloseSquareBracketCount -= 1;

                    if(unmatchedCloseSquareBracketCount == 0)
                    {
                        // Location of matching open square bracket
                        break;
                    }
                }
                
                searchPos -= 1;
            }

            if(searchPos != -1)
            {
                xp = xp.substr(0, searchPos);
            }
            else
            {
                // Error condition. Closing square bracket
                // but no corresponding opening square bracket
                throw new ConfigurationException("XPathUtils.removeTrailingPredicate(), xpath " +
                                                 xp +
                                                 " contains unmatched square brackets.");
                
            }

        }

    }

    return xp;
} 


/**
 * Exception thrown when an error occurs while using the ListSrcDataProtocol
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
function SrcDataError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// SrcDataError is a sub class of Error
SrcDataError.prototype = new Error();
SrcDataError.prototype.constructor = SrcDataError;


/*
 * ListSrcDataProtocol constructor
 *
 * @constructor
 */
function ListSrcDataProtocol()
{
}

ListSrcDataProtocol.m_logger = new Category("ListSrcDataProtocol");

/**
 * Next key for default generateKey implementation
 */
ListSrcDataProtocol.prototype.m_keyNumber = 0;

/**
 * internal flag to determine whether or not we are using the original configuration
 * style, or the new style that contains xpath OR'ed together
 */
ListSrcDataProtocol.prototype.m_orMode = false;

/**
 * XPath to the root location of the source data
 *
 * @type String
 * @configuration Required
 */
ListSrcDataProtocol.prototype.srcData = null;


/**
 * Array of XPaths which will cause the grids list data to be
 * updated.
 *
 * @type Array[String]
 * @configuration Optional
 */
ListSrcDataProtocol.prototype.srcDataOn = null;

/**
 * Array of XPaths which will cause the grids list data to be
 * filtered.
 *
 * @type Array[String]
 * @configuration Optional
 */
ListSrcDataProtocol.prototype.srcDataFilterOn = null;

/**
 * XPath relative to srcData which contains the individual rows
 *
 * @type String
 * @configuration Required.
 */
ListSrcDataProtocol.prototype.rowXPath = null;


/**
 * XPath relative to srcData + rowXPath which provides a unique
 * identifier for the row.
 *
 * @type String
 * @configuration Required.
 */
ListSrcDataProtocol.prototype.keyXPath = null;

/*
 * Sets up the protocol. 
 */
ListSrcDataProtocol.prototype.initialiseListSrcDataProtocol = function(e)
{
	this.initialiseListSrcDataState(e);	
}

/**
 * Retrieve the srcdate and apply to the current adaptor. There is no default
 * method supplied as this needs to be supplied by the implementing adaptor.
 *
 * @param event the DataModelEvent that triggered this call
 * @type function
 * @return boolean to determine whether or not the adaptor is added to the repaint queue
 * @configuration
 */
ListSrcDataProtocol.prototype.retrieveSrcData = function(event)
{
	throw new ConfigurationException("ListSrcDataProtocol.retrieveSrcData(), please supply a retrieveSrcData method for this adaptor.");
}

/**
 * Apply a filter to the src data. There is no default
 * method supplied as this needs to be supplied by the implementing adaptor.
 *
 * @param event the DataModelEvent that triggered this call
 * @type function
 * @return boolean to determine whether or not the adaptor is added to the repaint queue
 * @configuration
 */
ListSrcDataProtocol.prototype.filterSrcData = function(event)
{
	throw new ConfigurationException("ListSrcDataProtocol.filterSrcData(), please supply a filterSrcData method for this adaptor.");
}

// Not sure what to do about the transformTo? methods, do we re-use the dataBinding
// methods or supply new methods. I suspect we need to re-use the databinding
// methods to avoid API methods.

/**
 * Configuration method used to transform the displayed value
 * into the value stored in the Data Model.
 * 
 * @param val the displayed value to transform.
 * @return the value suitable for storage in the DataModel. This
 *    needs to be of the same type as the value expected by the
 *    update() method for the field.
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
//ListSrcDataProtocol.prototype.transformToModel = null;

/**
 * Configuration method used to transform the value retrieved
 * from the Data Model into the value displayed.
 *
 * @param val the value retrieved from the DataModel to transform.
 *    The type of the argument will be the same as the value
 *    returned by the retrieve() method.
 * @return the value suitable for display on screen
 * @configuration
 * @merge-rule Most specific configuration overrides
 */
//ListSrcDataProtocol.prototype.tranformToDisplay = null;


/**
 * Initialisation method for ListSrcDataProtocol
 *
 * @param cs the configuration objects to apply to the GUIAdaptor
 * @type void
 */
ListSrcDataProtocol.prototype.configListSrcDataProtocol = function(cs)
{
	// Use the most specific configuration available - there's
	// no chaining of these methods, so simply assign the most
	// specific configuration to this GUI Adaptors own
	// configuration variables.
	for(var i=0; i<cs.length; i++)
	{
		if(null != cs[i].srcData) this.srcData = cs[i].srcData;
		if(null != cs[i].srcDataOn) this.srcDataOn = cs[i].srcDataOn;
		if(null != cs[i].rowXPath) this.rowXPath = cs[i].rowXPath;
		if(null != cs[i].keyXPath) 
		{
			this.keyXPath = XPathUtils.removeLeadingSlash(cs[i].keyXPath);
		}
		if(null != cs[i].generateKeys) this.generateKeys = cs[i].generateKeys;
	}
	if(ListSrcDataProtocol.m_logger.isTrace())
	{
		ListSrcDataProtocol.m_logger.trace("ListSrcDataProtocol.configListSrcDataProtocol(), " + ListSrcDataProtocol.toString(this));
	}

	if(this.srcData && ("" != this.srcData))
	{
		if(null == this.srcDataOn)
		{
			this.srcDataOn = new Array();
		}
		// do the new or'ed xpath concats for row definitions
		// i.e. srcData = "/ds/model/type1 | /ds/model/type2" etc.
		if(this.srcData.indexOf("|") != -1)
		{
			// Supports multiple source xpaths
			this.m_orMode = true;
			
			// Split the xpaths
			var ar = this.srcData.split("|");
			
			// Trim any leading and trailing white space from the each of the separate xpaths
			for(var i=0, l = ar.length; i<l ; i++)
			{
				// trim any leading or trailing whitespaces as these cause xpath parsing exceptions
				ar[i] = String.trim(ar[i]);
			}

			// Add the row xpaths to the srcDataOn xpaths
			this.srcDataOn = this.srcDataOn.concat(ar);
			
			// Hang on to the rowXPaths
			this.m_rowXPaths = ar;
		}
		else
		{
			// Does not support multiple source xpaths
			this.m_orMode = false;
			
			var rowXP = this._getRowXPath();

			// Default the srcDataOn to the key xpath
			this.srcDataOn[this.srcDataOn.length] = rowXP;
			
			// Row XPaths contains only the one row XPath.
			this.m_rowXPaths = [rowXP];
		}
	}
}


/**
 * Perform cleanup required by the ListSrcDataProtocol before
 * it is destroyed
 */
ListSrcDataProtocol.prototype.disposeListSrcDataProtocol = function()
{
}

/**
 * Return the srcData for this GUI Element
 */
ListSrcDataProtocol.prototype.getSrcData = function()
{
	return this.srcData;
}

/**
 * Get additional databindings that trigger a refresh of the src data
 */
ListSrcDataProtocol.prototype.getSrcDataOn = function()
{
	return this.srcDataOn;
}

/**
 * Get additional databindings that trigger a filtering of the src data
 */
ListSrcDataProtocol.prototype.getSrcDataFilterOn = function()
{
	return this.srcDataFilterOn;
}

ListSrcDataProtocol.prototype.initialiseListSrcDataState = function(e)
{
	if(null != this.getSrcData()) this.invokeRetrieveSrcData(e);
	// Only need to initialise source data.
	//var srcDataFilterOn = this.getSrcDataFilterOn();
	//if(srcDataFilterOn != null && srcDataFilterOn.length > 0) this.invokeFilterSrcData(e);
}
/**
 * Get XPath that defines a row
 *
 * This method should not be used, as ListSrcDataProtocol should
 * support multiple source XPaths using XPath concatination operator
 * (|). The getRowXPaths() method returns an array of source XPaths
 * and is the long term replacement for this method.
 *
 * @private
 * @deprecated
 */
ListSrcDataProtocol.prototype._getRowXPath = function()
{
	if(true == this.m_orMode)
	{
		return this.srcData;
	}
	else
	{
		return XPathUtils.concatXPaths(this.srcData, this.rowXPath);
	}
}


/**
 * Get row XPaths
 *
 * @return an Array of XPaths where rows for list are sourced from
 * @type Array[String]
 */
ListSrcDataProtocol.prototype.getRowXPaths = function()
{
	return this.m_rowXPaths;
}


/**
 * Return an xpath which will select the source data with additional
 * predicate constraints.
 *
 * @param suffix String which represents the suffix. May be null in which
 *   case no predicate is added.
 * @return an xpath containing which will select all rows for the souce
 *    data filtered by the supplied predicate.
 * @type String
 */
ListSrcDataProtocol.prototype.getRowXPathWithSuffix = function(predicate)
{
	// If null predicate then use an empty string in concatination below
	if(null == predicate) predicate="";
	
	// Produce a string of each of the rowXPaths separated by the predicate and
	// the XPath concatination operator "|".
	var xpath = this.m_rowXPaths.join(predicate + "|");

	// Add the predicate to the end of the xpath, as join only inserts it between
	// the elements of the array.	
	return xpath + predicate;
}



/**
 * Get an array of the row xpaths with the supplied suffix appended to each
 *
 * @param suffix String which represents the suffix. May be null in which
 *   case no predicate is added.
 * @return an Array containing all the row xpaths used to build up the rows
 *   with the supplied suffix appended.
 * @type Array[String]
 */
ListSrcDataProtocol.prototype.getRowXPathArrayWithSuffix = function(suffix)
{
	// Local reference for performance...
	var rowXPaths = this.m_rowXPaths;

	// Take a copy of the xpaths array
	var xpaths = rowXPaths.slice(0, rowXPaths.length);
	
	// Append the suffix if one was supplied
	if(null != suffix && "" != suffix)
	{
		for(var i = 0, l = rowXPaths; i < l ; i++)
		{
			xpaths[i] += suffix;
		}
	}
	
	return xpaths;
}

/**
 * Check that a key exists in the src data. Returns true if the key exists, and false if not.
 */
ListSrcDataProtocol.prototype.checkForKeyExistence = function(key)
{
	var keyXPath = this.getKeyXPath();
	
	// There is a bug in the microsoft XML parser that doesn't allow a xpath ending in /. to be appended with
	// a predicate, therefore we remove it because it evaluates to the same node
	if(keyXPath.lastIndexOf("/.") == keyXPath.length - 2)
	{
		keyXPath = keyXPath.substring(0, keyXPath.length - 2);
	}
	keyXPath += "[text()=" + Services.xPathToConcat(key) + "]";
	var keyNode = FormController.getInstance().getDataModel().getInternalDOM().selectSingleNode(keyXPath);

	return (null != keyNode);
}

/**
 * Get XPath that defines a key
 */
ListSrcDataProtocol.prototype.getKeyXPath = function()
{
	return XPathUtils.concatXPaths(this._getRowXPath(), this.keyXPath);
}

/**
 * Invoke the retrieve method of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @return the value of the data binding
 * @type String
 */
ListSrcDataProtocol.prototype.invokeRetrieveSrcData = function(event)
{
	if(this.generateKeys)
	{
		this.createKeyNodes();	
	}
	
	if(0 != this.findKeylessNodes().length)
	{
		throw new DataException("Source data is missing key nodes");
	}
	
	return this.retrieveSrcData.call(this, event);
}

/**
 * Invoke the filterSrcData method of the GUI Element
 *
 * @param event the DataModelEvent that triggered this call
 * @type String
 */
ListSrcDataProtocol.prototype.invokeFilterSrcData = function(event)
{
	return this.filterSrcData.call(this, event);
}

/**
 * Static method to implement a dummy toString method for this protocol - we can't do this on the
 * object because that would overwrite it for the adaptor, which we don't want
 */
ListSrcDataProtocol.toString = function(a)
{
	var msg = new String("ListSrcDataProtocol(adaptor id: " + a.getId() + "): ");
	if(null != a.srcData) msg += "srcData = " + a.srcData;
	if(null != a.rowXPath) msg += "rowXPath = " + a.rowXPath;
	if(null != a.keyXPath) msg += "keyXPath = " + a.keyXPath;
	if(null != a.srcDataOn)
	{
		msg += ", srcDataOn = [";
		for(var i=0; i<a.srcDataOn.length; i++)
		{
			msg += a.srcDataOn[i] + ", ";
		}
		msg += "]";
	}
	
	return msg;
}

ListSrcDataProtocol.selectValueFromNodeByXPath = function(node, xp)
{
	if(null == node)
	{
		throw new ConfigurationException("ListSrcDataProtocol.selectValueFromNodeByXPath() could not apply the xpath as the node was null");
	}
	var value = null;
	if(xp && (xp!=""))
	{
		var valueNode = node.selectSingleNode(xp);
		if(null == valueNode)
		{
			// ToDo: CaseMan blew up when I threw these exceptions because they populate a select srcData
			//       using multiple calls to setValue() which means that only part of the srcData is there
			//       and we don't have the display value in this instance - is this a serious issue. They
			//       should be using addNodeSet() to add the whole row to the srcData.
			//throw new ConfigurationException("ListSrcDataProtocol.selectValueFromNodeByXPath() could not find the value node, configured to xpath: " + xp);
			if(ListSrcDataProtocol.m_logger.isError()) ListSrcDataProtocol.m_logger.error("Warning: Field has a null value for part of the source data (missing node) - this can lead to data integrity problems!");
			if(ListSrcDataProtocol.m_logger.isInfo()) ListSrcDataProtocol.m_logger.info("ListSrcDataProtocol.selectValueFromNodeByXPath() could not find the value node, configured to xpath: " + xp);
		}
		else
		{
			value = XML.getNodeTextContent(valueNode);
		}
	}
	else
	{
		value = XML.getNodeTextContent(node);
	}
	if(null==value || ""==value)
	{
		// ToDo: CaseMan blew up when I threw these exceptions because they have an entry that has a null
		//       key which is used to dis-associate a relationship, i.e. it represents a null empty. I believe
		//       they should have a real key that points to an 'empty' entity.
		//throw new ConfigurationException("ListSrcDataProtocol.selectValueFromNodeByXPath() the XML content of the node is empty or null!");
		if(ListSrcDataProtocol.m_logger.isError()) ListSrcDataProtocol.m_logger.error("Warning: Field has a null value for part of the source data (null or empty value in node) - this can lead to data integrity problems!");
		if(ListSrcDataProtocol.m_logger.isInfo()) ListSrcDataProtocol.m_logger.info("ListSrcDataProtocol.selectValueFromNodeByXPath() the XML content of the node is empty or null!");
	}
	return value;	
}

/*
 * Function creates key nodes in the data model where they do not exist
 */
ListSrcDataProtocol.prototype.createKeyNodes = function()
{
	var nodes = this.findKeylessNodes();
	for(var i = 0 ; i < nodes.length ; i++)
	{	
		// Need to determine whether we have to add or replace the ID node
		var idNode = nodes[i].selectSingleNode(this.keyXPath);
		idNode = idNode ? idNode : XML.createElement(nodes[i], this.keyXPath); 
		nodes[i].appendChild(idNode);
	
		var textNode = XML.createTextNode(idNode.ownerDocument, this.generateKey());
		idNode.appendChild(textNode);		
	}
}

/*
 * Function is currently not in use becuase of issue in createKeyNodes() as commented above
 */
ListSrcDataProtocol.prototype.resolveNodeXPath = function(node)
{
	/*
	 * The vast majority of the time the XPath we are resolving will be the same
	 * as the xpath just resolved with the position incremented by one
	 * To optimise away the need to resolve the same path to root for every
	 * row in the grid, we first see if our guess is correct
	 */
	 if(null != this._lastXPathResolvedUsedPosition)
	 {
	 	var guessXPath = this._lastXPathResolved + "[position() = " + (this._lastXPathResolvedUsedPosition + 1) + "]";
	 	var guessNode = FormController.getInstance().getDataModel().getInternalDOM().selectSingleNode(guessXPath);
	 	if(guessNode == node)
	 	{
	 		// Guessed right!
	 		this._lastXPathResolvedUsedPosition++;
	 		return guessXPath;
	 	}
	 }
	 return this.getPathToRoot(node);
}

/*
 * Returns the set of nodes which currently do not have key nodes
 * as defined by the configuration
 * @return set of nodes
 */
ListSrcDataProtocol.prototype.findKeylessNodes = function()
{
	var keylessXPath;
	
	var predicate = "[count(./" + this.keyXPath + "/text()) = 0]";
	;
	if(this.m_orMode)
	{
		// TODO: Is rowXPath supported with orMode? Code below doesnt and is consistent with other code
		keylessXPath = this.srcData.replace(/\|/g, predicate + "|") + predicate;
	}
	else 
	{
		keylessXPath = this._getRowXPath() + predicate;
	} 
	
	var dom = FormController.getInstance().getDataModel().getInternalDOM();
	return dom.selectNodes(keylessXPath);
}

/*
 * Function is currently not in use becuase of issue in createKeyNodes() as commented above
 */
ListSrcDataProtocol.prototype.getPathToRoot = function(node)
{
	fc_assert(node, "Null node cannot have xpath to root");
	if("#document" == node.parentNode.nodeName)
	{
		return '/' + node.nodeName;
	}
	else
	{
		// Find position 
		
		var siblingNodes = node.parentNode.selectNodes(node.nodeName);
		var position = "";
		this._lastXPathResolvedUsedPosition = null;
		for(i = 0 ; i < siblingNodes.length ; i++)
		{
			if(siblingNodes[i] == node)
			{
				// Convert JS position to XPath position
				position = "[position() = " + (i + 1) + "]";
				this._lastXPathResolvedUsedPosition = i + 1;
				break;
			}
		}		
 
		this._lastXPathResolved = this.getPathToRoot(node.parentNode) + '/' + node.nodeName;
		return this._lastXPathResolved + position;
	}
}

/**
 * Generate a key for a row.
 *
 * Default implementation simply generates a sequence of
 * integers.
 *
 * @param xp the XPath to the row to generate a key for
 * @param isNewRow true if this is a new row to the collection
 */
ListSrcDataProtocol.prototype.generateKey = function(xp)
{
	return this.m_keyNumber++;
}



/**
 *  Returns all of the listeners for this adaptor for this protocol 
 *
 */
ListSrcDataProtocol.prototype.getListenersForListSrcDataProtocol = function(db)
{
    var listenerArray = new Array();
    var srcDataListener = FormControllerListener.create(this, FormController.SRCDATA);
    var filterListener = FormControllerListener.create(this, FormController.FILTER);
    
	var on = this.getSrcDataOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: srcDataListener});
		}
	}
	on = this.getSrcDataFilterOn();
	if(null != on)
	{
		for(var i = on.length-1; i>=0; i--)
		{
            listenerArray.push({xpath: on[i], listener: filterListener});
		}
	}
    return listenerArray;
}
