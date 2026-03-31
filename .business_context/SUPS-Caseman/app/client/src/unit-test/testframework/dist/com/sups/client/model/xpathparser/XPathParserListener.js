//==================================================================
// XPathParserListener
//  Class definining the interface that needs to be implemented to
//  listen to events fired by the XPathParser.
//               
//==================================================================

/**
 * Interface definition for Listener used by the XPathParser
 * @constructor
 * @private
 */
function XPathParserListener()
{
}


/**
 * Called when the XPathParser encounters a complete
 * node definition when parsing an xpath
 *
 * @param name the name of the node excluding any
 *        leading or trailing / or any predicate. Node
 *        name may be * to indicate any element or /
 *        to indicate a recursive match.
 * @private
 */
XPathParserListener.prototype.node = undefined;


/**
 * Called when the XPathParser encounters a complete
 * predicate definition.
 *
 * @param pred the string representation of the predicate
 *        excluding the surrounding [ ] characters
 * @private
 */
XPathParserListener.prototype.predicate = undefined;
