/**
 * Class ActionComponent
 *
 * This is the base class for all menu components that
 * represent menu options which perform a specific function,
 * such as navigating the application to a new page, when
 * clicked.
 *
*/
function ActionComponent(){}


/**
 * ActionComponent is a sub class of MenuComponent
 *
*/
ActionComponent.prototype = new MenuComponent();
ActionComponent.prototype.constructor = ActionComponent;


/**
 * Define class variables
 *
*/
ActionComponent.ENABLED_ACTION_SELECTED = "menuItemDiv enabled_action_selected";
ActionComponent.DISABLED_ACTION_SELECTED = "menuItemDiv disabled_action_selected";
ActionComponent.ENABLED_ACTION_UNSELECTED = "menuItemDiv enabled_action_unselected";
ActionComponent.DISABLED_ACTION_UNSELECTED = "menuItemDiv disabled_action_unselected";


/**
 * Select method is invoked when the associated menu item is selected
 *
*/
ActionComponent.prototype.select = function()
{
    var className = null;
    
    if(this.m_userAllowedAccess)
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
ActionComponent.prototype.deselect = function()
{
    var className = null;
    
    if(this.m_userAllowedAccess)
    {
        className = ActionComponent.ENABLED_ACTION_UNSELECTED;
    }
    else
    {
        className = ActionComponent.DISABLED_ACTION_UNSELECTED;
    }
    
    return className;    
}


/**
 * Invoke action method defines action to be undertaken when associated
 * menu item is clicked. This function must be provided by a sub class
 * of ActionComponent.
 *
*/
ActionComponent.prototype.invokeAction = function()
{
    throw new ConfigurationException( "ActionComponent.invokeAction(), please supply an implementation of this method in your sub class.");
}
