/**
 * Class NavigationComponent
 *
 * Instances of this class represent menu options which navigate the application
 * to new pages in the menu model.
 *
*/
function NavigationComponent( id, hostMenuPanel, destination, userAllowedAccess )
{
    this.m_id = id;
    this.m_hostMenuPanel = hostMenuPanel;
    this.m_destination = destination;
    this.m_userAllowedAccess = userAllowedAccess;
}


/**
 * Navigation component is a sub class of ActionComponent
 *
*/
NavigationComponent.prototype = new ActionComponent();
NavigationComponent.prototype.constructor = NavigationComponent;


/**
 * InvokeAction method performs the action required when the
 * associated menu option is clicked.
 *
*/
NavigationComponent.prototype.invokeAction = function()
{
    // Navigate to associated destination
    Services.navigate( this.m_destination );
}

/**
 * Clear up instance for disposal
 *
*/
NavigationComponent.prototype._dispose = function()
{
    this.m_id = null;
    this.m_hostMenuPanel = null;
    this.m_destination = null;
    this.m_userAllowedAccess = null;
}
