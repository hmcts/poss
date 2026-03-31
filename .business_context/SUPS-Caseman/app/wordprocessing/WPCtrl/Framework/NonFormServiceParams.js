/**
 * This class subclasses the Framework ServiceParams class to make it generic again,
 * so one can invoke webservices from a non-forms javascript context.
 */
function NonFormServiceParams() {
	ServiceParams.apply(this, []);
}

NonFormServiceParams.prototype = new ServiceParams();

NonFormServiceParams.prototype.constructor = NonFormServiceParams;
 
/**
 * Add the contents of a DOM as a parameter
 * @param paramName the name of the parameter
 * @param dom the XML DOM who's contents to add as the parameter
 */
NonFormServiceParams.prototype.addDOMParameter = function(paramName, dom, recordOffset, targetXPath)
{
	var paramNode = this._createBaseParameterNode(paramName);
	//Import dom nodes to be children on the valueNode
	var copy = dom.documentElement.cloneNode(true);
	paramNode.appendChild(copy);
}

/**
 * Add the content of the node as a parameter
 * @param paramName the name of the parameter
 * @param node The XML node to add.
 */
NonFormServiceParams.prototype.addNodeParameter = function(paramName, node)
{
	var paramNode = this._createBaseParameterNode(paramName);
	
	var copy = node.cloneNode(true);
	paramNode.appendChild(copy);
}


/**
 * Add the content of the node as a parameter
 * @param paramName the name of the parameter
 * @param node The XML node to add.
 */
//ServiceParams.prototype.addNodeParameter = function(paramName, node, recordOffset, targetXPath)
//{
//	var paramNode = this._createBaseParameterNode(paramName);
//	var copy = node.cloneNode(true);
//	paramNode.appendChild(copy);
//}
