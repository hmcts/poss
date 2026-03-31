//==================================================================
//
// fwException.js
//
// Base class for Framework Exceptions
//
//==================================================================


function fwException(msg, rootCause)
{
	this.message = msg;
	this.m_rootCause = rootCause;
    this.exceptionHierarchy = new Array('Error'); 
}


fwException.prototype = new Error();
fwException.prototype.constructor = fwException;

/*
 * Default fatalExceptionHandler - can be overriden by the setter method below
 */
fwException.m_fatalExceptionHandler = function(exception){fwException._defaultFatalExceptionHandler(exception);};

/*
 * Print out the error from the current message, and any previous root cause exceptions
 */
fwException.prototype.toString = function()
{
	var str = "Exception message: " + this.message;
	
	if(null != this.m_rootCause)
	{
		str += "\n  Root cause: " + fwException.getErrorMessage(this.m_rootCause);
	}
	
	return str;
}


fwException.prototype.getRootCause = function()
{
	return this.m_rootCause;
}

/*
 * Allows the default functionality of a fatal exception
 * to be overriden
 */
fwException.setFatalExceptionHandler = function(handler)
{
    fwException.m_fatalExceptionHandler = handler;
}


/*
 * Utilitity function to get the correct error message when the type
 * of the object throw in unknown.
 *
 * @param ex - is an object (probably an fwException or an Error)
 */
fwException.getErrorMessage = function(ex)
{
    if (ex instanceof fwException)
    {
        return ex.toString();        
    }
    else if (ex instanceof Error)
    {
        return ex.message; 
    }

    // Just some random object - do the best we can
	return "Non Error based object thrown, .toString() result is: " + ex.toString();
}

/*
 * Is the default handler, basically just gets the message out of the exception,
 * tells the user before forcing them to quit
 */
fwException._defaultFatalExceptionHandler = function(exception)
{
    // Use complex mechanism to retrieve reference
    // to AppController as exception may be thrown
    // before instance of FormController has been instantiated.
    appC = top.AppController.getInstance();
    
    // Before reporting exception check if progress bar displayed
    if(appC.m_requestCount > 0)
    {
        // Hide progress bar
        appC._hideProgress();
    }
    
    // Synthesize general exception message
    var exMsg = fwException.getErrorMessage(exception);
    var alertMsg = null;

    if(exMsg != null && exMsg != "")
    {
        alertMsg = "An unexpected application error has occurred. The associated error message is shown below: \n\n'" +
                    exMsg +
                    "'\n\n Unfortunately the application may no longer work correctly. Therefore, the application \n" +
                    "will terminate when you close this alert message.";
    }
    else
    {
        alertMsg = "An unexpected application error has occurred. Unfortunately, the application may no longer work\n" +
                   "correctly. Therefore, the application will terminate when you close this alert message.";
    }
    
    // Display alert message
    
    alert(alertMsg);
    
    // Shut down application
    appC.shutdown();
    
}


fwException.invokeFatalExceptionHandler = function(exception)
{
    fwException.m_fatalExceptionHandler(exception);
}

