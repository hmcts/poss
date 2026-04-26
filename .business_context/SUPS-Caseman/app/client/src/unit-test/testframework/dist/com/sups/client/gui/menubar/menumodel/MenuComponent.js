/**
 * Class MenuComponent
 *
 * This class is the base class for the classes that represent
 * the menu options on a menu panel.
 *
*/
function MenuComponent(){}


/**
 * Define instance members
 *
 * Component identifier
 *
*/
MenuComponent.prototype.m_id = null;


/**
 * Reference to host menu panel
 *
*/
MenuComponent.prototype.m_hostMenuPanel = null;


/**
 * Reference to security status flag which indicates
 * whether current user can use menu option
 *
*/
MenuComponent.prototype.m_userAllowedAccess = null;


/**
 * Method to access component identifier
 *
*/
MenuComponent.prototype.getId = function()
{
    return this.m_id;
}


/**
 * Method to access security flag
 *
*/
MenuComponent.prototype.getUserAllowedAccess = function()
{
    return this.m_userAllowedAccess;
}
