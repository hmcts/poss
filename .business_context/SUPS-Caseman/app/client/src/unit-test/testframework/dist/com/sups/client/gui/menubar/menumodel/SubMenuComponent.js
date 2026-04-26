/**
 * Class SubMenuComponent
 *
 * This class is used by the menu model to represent menu items
 * which link to further menu panels. That is, sub menus.
 *
*/
function SubMenuComponent( id, hostMenuPanel, userAllowedAccess, panelXPath )
{
    // Set menu item identifier
    this.m_id = id;
    
    // Set reference to menu panel that contains this item
    this.m_hostMenuPanel = hostMenuPanel;
    
    // Store user access status flag
    this.m_userAllowedAccess = userAllowedAccess;
    
    // Store XPath to corresponding panel entry in menu bar configuration
    // Entry stores configuration for sub menu
    this.m_panelXPath = panelXPath;

}


/**
 * SubMenuComponent is a sub class of MenuComponent
*/
SubMenuComponent.prototype = new MenuComponent();
SubMenuComponent.prototype.constructor = SubMenuComponent;

/**
 * Define class variables
 *
*/
SubMenuComponent.ENABLED_SUBMENU_SELECTED = "menuItemDiv submenu submenu_selected";
SubMenuComponent.DISABLED_SUBMENU_SELECTED = "menuItemDiv submenu submenu_disabled submenu_selected submenu_disabled_selected";
SubMenuComponent.ENABLED_SUBMENU_UNSELECTED = "menuItemDiv submenu";
SubMenuComponent.DISABLED_SUBMENU_UNSELECTED = "menuItemDiv submenu submenu_disabled";

SubMenuComponent.SELECT_DELAY = 750;
SubMenuComponent.DESELECT_DELAY = 500;

SubMenuComponent.m_logger = new Category( "SubMenuComponent" );

/**
 * Define instance members
 *
 * Menu panel which stores sub menu contents
*/
SubMenuComponent.prototype.m_menuPanel = null;

/**
 * When sub menu deselected temporarily store
 * whether deselect was caused by mouse movement
 * or key press
 *
*/
SubMenuComponent.prototype.m_keyDeselection = null;


/**
 * Current time out identifier for delayed select
 *
*/
SubMenuComponent.prototype.m_selectedTimeoutId = null;


/**
 * Current time out identifier for delayed deselect
 *
*/
SubMenuComponent.prototype.m_deselectedTimeoutId = null;


/**
 * Method returns reference to menuPanel within SubMenuComponent
 *
*/
SubMenuComponent.prototype.getMenuPanel = function()
{
    return this.m_menuPanel;
}


/**
 * Select method is invoked when associated menu item is
 * selected.
 *
 * @param keySelection Boolean indicating whether or not
 *                     item selection caused by key press
 *
*/
SubMenuComponent.prototype.select = function(keySelection)
{
    
    // Define class for menu item
    var className = null;
    
    if(this.m_userAllowedAccess)
    {
        className = SubMenuComponent.ENABLED_SUBMENU_SELECTED;
    }
    else
    {
        className = SubMenuComponent.DISABLED_SUBMENU_SELECTED;
    }
    
    if(this.m_userAllowedAccess)
    {
    
        // If deselect time out has been set remove time out
        this.clearDeselectionTimeout();
        
        if(!keySelection)
        {
    
            // If required, set up time out for displaying sub menu
            var displaySubMenu = true;
    
            if(null != this.m_menuPanel)
            {
                // Menu panel has already been created.
                if(this.m_menuPanel.isVisible())
                {
                    displaySubMenu = false;
                }
        
            }

            if(displaySubMenu)
            {
              
                var thisObj = this;
        
                this.m_selectedTimeoutId = setTimeout( function(){thisObj.show();},
                                                       SubMenuComponent.SELECT_DELAY );
                                                 
            }
        
        }
        
    }
    
    return className;
    
}


/**
 * Deselect method is invoked when associated menu item is deselected
 *
 * @param keyDeselection Boolean indicating whether or not item deselction
 *                       caused by key press
 * @param delayDeselect  Boolean indicating whether or not there should be
 *                       a delay before hiding associated menu panel
*/
SubMenuComponent.prototype.deselect = function( keyDeselection, delayDeselect)
{
    
    // Define class for menu item
    var className = null;
    
    if(this.m_userAllowedAccess)
    {
        className = SubMenuComponent.ENABLED_SUBMENU_UNSELECTED;
    }
    else
    {
        className = SubMenuComponent.DISABLED_SUBMENU_UNSELECTED;
    }
    
    if(this.m_userAllowedAccess)
    {
    
        // If select time out has been set remove time out
        this.clearSelectionTimeout();
        
        if(!keyDeselection)
        {
    
            // If required, hide sub menu
            if(null != this.m_menuPanel)
            {
                if(this.m_menuPanel.isVisible())
                {
                    if(delayDeselect)
                    {
                    
                        // Delay invocation of hide function
                        this.m_keyDeselection = keyDeselection;
                        
                        var thisObj = this;
                
                        this.m_deselectedTimeoutId = setTimeout( function(){thisObj.hide();},
                                                                 SubMenuComponent.DESELECT_DELAY);
                    }
                    else
                    {
                        // Hide sub menu immediately
                        this.m_menuPanel.hide(keyDeselection);
                    }
            
                }
        
            }
            
        }
        
    }
    
    return className;
    
}


/**
 * Show method
 *
*/
SubMenuComponent.prototype.show = function()
{

    if(null == this.m_menuPanel)
    {
        
        this.m_menuPanel = this.m_hostMenuPanel.createSubMenuMenuPanel(this.m_id,
                                                                       this.m_panelXPath);
                                              
        this.m_menuPanel.show();                                                             
    }
    else
    {
        if(!this.m_menuPanel.isVisible())
        {
            this.m_menuPanel.show();
        }
    }
    
    this.m_selectedTimeout = null;
}


/**
 * Hide sub menu menu panel
 *
*/
SubMenuComponent.prototype.hide = function()
{
    if(null != this.m_menuPanel)
    {
        // Recheck visibility of menu panel before hide operation
        if(this.m_menuPanel.isVisible())
        {
            this.m_menuPanel.hide(this.m_keyDeselection);
        }
    }
    
    this.m_keyDeselection = null;
    this.m_deselectedTimeoutId = null;
    
}

/**
 * Method indicates whether, or not, the SubMenuComponent's menu panel
 * is currently visible.
 *
 * @return Returns "true" if menu panel exists and is visible otherwise "false".
 *
*/
SubMenuComponent.prototype.isMenuPanelVisible = function()
{
    var menuPanelIsVisible = false;
    
    if(null != this.m_menuPanel)
    {
        if(this.m_menuPanel.isVisible())
        {
            menuPanelIsVisible = true;
        }
    }
    
    return menuPanelIsVisible;
}

/**
 * Clear delayed selection timeout
 *
*/

SubMenuComponent.prototype.clearSelectionTimeout = function()
{
    if(null != this.m_selectedTimeoutId)
    {
        clearTimeout(this.m_selectedTimeoutId);
        this.m_selectedTimeoutId = null;
    }
}

/**
 * Clear delayed deselection timeout
 *
*/

SubMenuComponent.prototype.clearDeselectionTimeout = function()
{
    if(null != this.m_deselectedTimeoutId)
    {  
        clearTimeout(this.m_deselectedTimeoutId);
        this.m_deselectedTimeoutId = null;
    }
}

/**
 * Clear up instance for disposal
 *
*/
SubMenuComponent.prototype._dispose = function()
{
    // First clean up any time outs that may still exist
    this.clearSelectionTimeout();
    this.clearDeselectionTimeout();
    
    // Clean up instance members
    this.m_id = null;
    this.m_hostMenuPanel = null;
    this.m_userAllowedAccess = null;
    this.m_panelXPath = null;
    
    // Simply set menu panel reference to null.
    // Actual menu panel will be cleared by _dispose()
    // method on MenuModel.
    this.m_menuPanel = null;
}
