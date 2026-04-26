//===========================================================================
//
// CallbackList class for registering and invoking callbacks
//
//===========================================================================


/**
 * Simple callback list
 *
 * @constructor
 * @private
 */
function CallbackList()
{
	this.m_callbacks = new Array();
}


/**
 * Add a callback function to the list of callbacks
 *
 * @param callback the callback function to register
 * @private
 */
CallbackList.prototype.addCallback = function(callback)
{
	fc_assert(typeof callback == "function", "CallbackList.addCallback(): callback must be function");
	
	this.m_callbacks[this.m_callbacks.length] = callback;
}

/**
 * Remove a callback function from the list of callbacks
 *
 * @param callback the callback function to be removed.
 *
 */
 
CallbackList.prototype.removeCallback = function(callback)
{
    var position = -1;
    
    for( var i = 0, len=this.m_callbacks.length; i < len; i++ )
    {
    
        if( callback == this.m_callbacks[i] )
        {
            position = i;
            break;
        }
        
    }
        
    if( position != -1 )
    {
    
        // Remove function from array
        
        this.m_callbacks.splice( position, 1 );
    }
    
}

/**
 * Invoke the list of callback functions, passing an optional
 * set of arguments to each callback. Any arguments passed to
 * this function are forwarded to the callback function.
 *
 * @private
 */
CallbackList.prototype.invoke = function()
{
	for(var i = 0, l = this.m_callbacks.length; i < l ; i++)
	{
		if(arguments.length == 0)
		{
			this.m_callbacks[i].apply(null);
		}
		else
		{
			this.m_callbacks[i].apply(null, arguments);
		}
	}
}

/**
 * Invoke selected callback. First argument in argument list
 * should specify position of function in callback list.
 * Method returns any value returned by the callback method.
 *
*/

CallbackList.prototype.invokeSelectedCallbackMethod = function()
{
    var returnValue = null;
    
    var length = arguments.length;
    
    if( length == 1 )
    {
        returnValue = this.m_callbacks[arguments[0]].apply(null);
    }
    else if( length > 1 )
    {
        var methodIndex = arguments[0];
        
        var newArguments = new Array();
        
        for(var i = 1; i < length; i++)
        {
            newArguments[i-1] = arguments[i];
        }
        
        returnValue = this.m_callbacks[methodIndex].apply(null, newArguments);
        
    }
    
    return returnValue;
    
}
            


/**
 * Perform any cleanup required before the object is destroyed
 */
CallbackList.prototype.dispose = function()
{
	for(var i = this.m_callbacks.length; i >= 0 ; i--)
	{
		delete this.m_callbacks[this.m_callbacks.length];
	}
}
