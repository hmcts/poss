//==================================================================
// XPathParser
//  Exception class thrown by XPathParser
//==================================================================


/**
 * Exception thrown when an error occurs while parsing an XPath
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
function XPathParserListenerError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// XPathParseError is a sub class of Error
XPathParserListenerError.prototype = new Error();
XPathParserListenerError.prototype.constructor = XPathParserListenerError;
