/**
 * Exception thrown when a StyleManager error occurs
 *
 * @param message the message to report in the exception
 * @param ex a chained exception
 * @constructor
 */
function StyleManagerError(message, rootCause)
{
	this.message = message;
	this.m_rootCause = rootCause;
	this.exceptionHierarchy = new Array('Error','SystemException','StyleManagerError');
	this.name = 'StyleManagerError';
}


/**
 * StyleManagerError is a sub class of Error
 */
StyleManagerError.prototype = new Error();
StyleManagerError.prototype.constructor = StyleManagerError;
