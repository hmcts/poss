/**
 * Class QuickLinkComponent
 *
*/

function QuickLinkComponent( id, 
                             hostMenuPanel, 
                             destination, 
                             subformId, 
                             userAllowedAccess, 
                             isEnabled,
                             guard,
                             prepare )
{

    this.m_id = id;
    this.m_hostMenuPanel = hostMenuPanel;
    this.m_destination = destination;
    this.m_subformId = subformId,
    this.m_userAllowedAccess = userAllowedAccess;
    this.m_isEnabled = isEnabled;
    this.m_guard = guard;
    this.m_prepare = prepare;
    
}

QuickLinkComponent.prototype = new ActionComponent();
QuickLinkComponent.prototype.constructor = QuickLinkComponent;

/**
 * Select method is invoked when the associated menu item is selected
 *
*/
QuickLinkComponent.prototype.select = function()
{
    var className = null;
    
    if(this.m_userAllowedAccess && this.m_isEnabled)
    {
        className = ActionComponent.ENABLED_ACTION_SELECTED;
    }
    else
    {
        className = ActionComponent.DISABLED_ACTION_SELECTED;
    }
    
    return className;    
}

/**
 * Deselect is invoked when associated menu item loses focus
 *
 */
QuickLinkComponent.prototype.deselect = function()
{
    var className = null;
    
    if(this.m_userAllowedAccess && this.m_isEnabled)
    {
        className = ActionComponent.ENABLED_ACTION_UNSELECTED;
    }
    else
    {
        className = ActionComponent.DISABLED_ACTION_UNSELECTED;
    }
    
    return className;    
}

/*

QuickLinkComponent.prototype.getCurrentClass = function(selectedComponent)
{
    var className = null;
    
    if(selectedComponent)
    {
    
        if(this.m_userAllowedAccess && this.m_isEnabled)
        {
            className = ActionComponent.ENABLED_ACTION_SELECTED;
        }
        else
        {
            className = ActionComponent.DISABLED_ACTION_SELECTED;
        }
    }
    else
    {
    
        if(this.m_userAllowedAccess && this.m_isEnabled)
        {
            className = ActionComponent.ENABLED_ACTION_UNSELECTED;
        }
        else
        {
            className = ActionComponent.DISABLED_ACTION_UNSELECTED;
        }
        
    }
    
    return className;
    
}

*/

QuickLinkComponent.prototype.getUserAllowedAccess = function()
{
    var accessAllowed = false;
    
    if(this.m_userAllowedAccess && this.m_isEnabled)
    {
        accessAllowed = true;
    }
    
    return accessAllowed;
}
    

QuickLinkComponent.prototype.invokeAction = function()
{
    var guardResult = true;
    
    if(null != this.m_guard)
    {
        guardResult = this.m_guard.call(this);
    }
    
    if(guardResult)
    {
        if(null != this.m_prepare)
        {
            this.m_prepare.call(this);
        }
        
        if(null != this.m_destination)
        {
            Services.navigate(this.m_destination);
        }
        else if(null != this.m_subformId)
        {
            Services.dispatchEvent(this.m_subformId,BusinessLifeCycleEvents.EVENT_RAISE);
        }
    }
    
}

/**
 * Clear up instance for disposal
 *
*/
QuickLinkComponent.prototype._dispose = function()
{
    this.m_id = null;
    this.m_hostMenuPanel = null;
    this.m_destination = null;
    this.m_subformId = null;
    this.m_userAllowedAccess = null;
    this.m_isEnabled = null;
    this.m_guard = null;
    this.m_prepare = null;
}