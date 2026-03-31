/* 
 * Class of type fwDataLoader which provides additional login processing
 */
 
 

function fwLoginDataLoader()
{
}

fwLoginDataLoader.prototype = new fwDataLoader();
fwLoginDataLoader.prototype.constructor = fwLoginDataLoader;


/**
 * Creates the loader responsible for logging in to the system. 
 *
 * @param config.username
 * @param config.password
 * @param config.handler - is the callback handler - implements success method "method",
 *                         and contains a reference to the target object "controller"
 * 
 */
fwLoginDataLoader.create = function(config)
{
    var ldl = new fwLoginDataLoader();
    
    var payload = null;
    
    config.serviceName = "login";
    config.secure = false;
    
    var serviceURL = this.m_secureServiceURL;
    var async = false;
    var showProgress = true;
    
    ldl._initialise(config);
    return ldl;
}


fwLoginDataLoader.prototype._getResultHandler = function()
{
    // Create a login handler as we need to do a bit of processing
    // before passing the response back to the originator.
    var loginHandler = new HTTPLoginHandler();
    loginHandler.handler = this.m_config.handler;
    loginHandler.username = this.m_config.username;
    
    return loginHandler;
}


/**
 * Get a name associated with this type of service
 *
 * @return a string containing the name of this type of service
 * @type String
 * @protected
 */
fwLoginDataLoader.prototype._getServiceTypeName = function()
{
    return "Login service";
}


/*
 * Simple login handler which will set the new security context then
 * invoke the handler for the LoginGUIAdaptor
 */
function HTTPLoginHandler(){};

/*
 * Name of the base node for when the server returns the secret from
 * a login attempt
 */
HTTPLoginHandler.secretNode = "SupsSessionKey";

/*
 * Name of the base node for when the server returns error from
 * a login attempt
 */
HTTPLoginHandler.errorNode = "SUPSLoginError";



/*
 * on "success" handler - note that success in this context simply means
 * there has been no "system" style exceptions - the login may still have
 * not worked and must be interpreted from the dom
 */
HTTPLoginHandler.prototype.onSuccess = function(dom)
{   
    // Get the secret from the dom if it exists
    var secretNodeArray = dom.selectNodes("/" + HTTPLoginHandler.secretNode);
    var secret = null;
     
    if (secretNodeArray.length > 0)
    {
        secret = XML.getNodeTextContent(secretNodeArray[0]);
    }

    // Construct authentication result
    var authResult = new Object();
    var appC = Services.getAppController();
    
    // If the result string has the secret in it then login was successful. 
    if(null != secret && secret.length != 0 && secret != "null")
    {   
        appC._setSecurityContext(secret, this.username);
        authResult.value = "authenticated";
    }
    else
    {
        authResult.value = null;
    }

    this.handler.method.call(this.handler.controller,appC.m_securityContext,authResult);
}


/*
 * Handler for when something goes wrong with the login. 
 * Not currently used - if the login throws an error just returns
 * the word "null" as the secret.
 */
HTTPLoginHandler.prototype.onInvalidUserSessionException = function(dom)
{
    var authResult = new Object();
    authResult.value = null;
    this.handler.method.call(this.handler.controller,appC.m_securityContext,authResult);
}


/*
 * If something goes wrong then just let the handler know
 */
HTTPLoginHandler.prototype.onError = function(ex,name)
{
    // Return authentication result
    var authResult = new Object();
    authResult.error = true;
    authResult.detail = fwException.getErrorMessage(ex);
    
    this.handler.method.call(this.handler.controller, null, authResult);
}
