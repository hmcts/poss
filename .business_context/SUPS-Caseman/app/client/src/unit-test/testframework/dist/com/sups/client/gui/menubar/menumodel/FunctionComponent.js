/**
 * Class FunctionComponent
 *
 * Instances of this class represent menu items which are associated
 * with functions. The function may be be defined in the applicationconfig.xml
 * file's menu bar configuration or possibly provided directly by the framework.
 *
*/

function FunctionComponent( id, 
                            hostMenuPanel, 
                            functionRef, 
                            functionParams, 
                            userAllowedAccess )
{
    this.m_id = id;
    this.m_hostMenuPanel = hostMenuPanel;
    this.m_functionRef = functionRef;
    this.m_functionParams = functionParams;
    this.m_userAllowedAccess = userAllowedAccess;
}

/**
 * FunctionComponent is a sub-class of ActionComponent
 *
 *
*/
FunctionComponent.prototype = new ActionComponent();
FunctionComponent.prototype.constructor = FunctionComponent;

/**
 * Invoke action executes the function identified by the function reference
 * when the associated menu item is clicked
 *
*/
FunctionComponent.prototype.invokeAction = function()
{
    if(this.m_functionParams != null && this.m_functionParams.length > 0)
    {
        this.m_functionRef.apply(this,this.m_functionParams);
    }
    else
    {
        this.m_functionRef.call(this);
    }
}

/**
 * This method cleans up the instance when it is no longer required
 *
*/
FunctionComponent.prototype._dispose = function()
{
    this.m_id = null;
    this.m_hostMenuPanel = null;
    this.m_functionRef = null;
    this.m_userAllowedAccess = null;
}