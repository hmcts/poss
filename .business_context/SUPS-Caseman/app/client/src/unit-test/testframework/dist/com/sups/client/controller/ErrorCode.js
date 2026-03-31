/**
 * Class to represnent an error message
 *
 * @param errorId the id for the error. Must be unique
 * @param message the message corresponding to this error
 */
/*function ErrorCode(errorId, message)
{
  this.m_message = message;
  
  if (null == ErrorCode.m_errors[errorId])
  {
    ErrorCode.m_errors[errorId] = this;
  }
  else
  {
  	fc_assertAlways(
      "Duplicate error id '" + errorId +
      "' with message '" + message + 
      "'. Existing error had message '" + ErrorCode.m_errors[errorId] + "'."
    );
  }
}*/

function ErrorCode(errorId,message)
{
	this.m_message=message;
	this.m_errorId=errorId;
}

/**
 * Static array to hold all errors
 */
//ErrorCode.m_errors = new Array();


/**
 * Factory method to get an ErrorCode object
 *
 * @param the id of the ErrorCode to retrieve
 * @param variable number of parameters to replace ${1}, ${2} etc in the ErrorCode message
 */
ErrorCode.getErrorCode = function(errorId)
{
	var message = Services.getAppController().getErrorMsgForCode(errorId);
	var arguments = ErrorCode.getErrorCode.arguments;

	for (var i = 1, l = arguments.length, index = 0; i < l; i++)
	{
		index = message.indexOf("${" + String(i) + "}", index);
		if (index != -1)
		{
			var re = new RegExp("\\$\\{" + String(i) + "\\}", "i");
			message = message.replace(re, String(arguments[i]));
		}
	}

	return new ErrorCode(errorId, message);
}


/**
 * Get error message
 *
 * @return the error message
 */
ErrorCode.prototype.getMessage = function()
{
	return this.m_message;
}
