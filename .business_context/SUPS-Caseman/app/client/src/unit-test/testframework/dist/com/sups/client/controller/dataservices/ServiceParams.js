//==================================================================
//
// ServiceParams.js
//
// Class to represent and handle parameters passed to a remote
// service
//
//==================================================================



/**
 * Class which contains the parameters for a service request. Contains a number
 * of factory methods which add parameters to the set of parameters.
 */
function ServiceParams()
{
	// Create dom to carry parameters
	this.m_dom = XML.createDOM(null, null, null);

	// Create the root node for the parameters DOM	
	this.m_paramsNode = XML.createElement(this.m_dom, 'params');
  	this.m_dom.appendChild(this.m_paramsNode);
}


/**
 * Return the XML DOM containing the parameters
 *
 * @return the XML DOM containing the parameters
 */
ServiceParams.prototype.getDOM = function()
{
	return this.m_dom;
}


/**
 * Add a simple parameter to the set of parameters
 *
 * @param paramName the name of the parameter
 * @param value the item to add as the value of the parameters (must support toString()).
 */
ServiceParams.prototype.addSimpleParameter = function(paramName, value)
{
	var paramNode = this._createBaseParameterNode(paramName);
	if(value != null)
	{
		var valueNode = XML.createTextNode(this.m_dom, value.toString());
		paramNode.appendChild(valueNode);	
	}
}


/**
 * Add the contents of a DOM as a parameter
 *
 * @param paramName the name of the parameter
 * @param dom the XML DOM who's contents to add as the parameter
 */
ServiceParams.prototype.addDOMParameter = function(paramName, dom)
{
	var paramNode = this._createBaseParameterNode(paramName);
	
	// Copy DOM nodes to be children on the paramNode
	var copy = dom.documentElement.cloneNode(true);
	
	paramNode.appendChild(copy);
}


/**
 * Add the content of the node as a parameter
 *
 * @param paramName the name of the parameter
 * @param node The XML node to add
 */
ServiceParams.prototype.addNodeParameter = function(paramName, node)
{
	var paramNode = this._createBaseParameterNode(paramName);
	
	// Copy DOM node to be a child on the paramNode
	var copy = node.cloneNode(true);
	
	paramNode.appendChild(copy);
}


/**
 * Method to create a basic param node and add it to the ServiceParameter
 * DOM.
 *
 * @param paramName the name of the parameter to add.
 * @private
 */
ServiceParams.prototype._createBaseParameterNode = function(paramName)
{
	// Create a node for the parameter
	var paramNode = XML.createElement(this.m_dom, 'param');
	
	// Create a name attribute node and add it to the param element
	var nameNode = XML.createAttribute(this.m_dom, 'name');
	nameNode.value = paramName;
	paramNode.attributes.setNamedItem(nameNode);
	
	// Add the parameter to the list of parameters
	this.m_paramsNode.appendChild(paramNode);
	
	return paramNode;
}

ServiceParams.PAYLOAD_XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
ServiceParams.prototype.getPayload = function() 
{
	
    var xmlString = this.m_dom.xml;
	if(xmlString.indexOf(ServiceParams.PAYLOAD_XML_HEADER) == -1)
	{
		xmlString = ServiceParams.PAYLOAD_XML_HEADER + xmlString;
	}
    return xmlString;
}

