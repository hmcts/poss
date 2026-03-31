/**
 * Exception thrown when an error occurs in the BusinessLifeCycle
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 * @private
 */
function BusinessLifeCycleError(message, ex)
{
   this.message = message;
   this.exception = ex;
}


// XPathParseError is a sub class of Error
BusinessLifeCycleError.prototype = new Error();
BusinessLifeCycleError.prototype.constructor = BusinessLifeCycleError;
