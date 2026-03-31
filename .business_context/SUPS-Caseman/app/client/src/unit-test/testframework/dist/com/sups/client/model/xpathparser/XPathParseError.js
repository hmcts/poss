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
function XPathParseError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// XPathParseError is a sub class of Error
XPathParseError.prototype = new Error();
XPathParseError.prototype.constructor = XPathParseError;
