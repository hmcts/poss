/**
 * Class MenuPanel
 *
 * This class is used by the menu model to represent a menu panel
 * containing a collection of action and sub menu components.
 *
 */
function MenuPanel( id, parentMenuPanelId, menuModel, menuComponentEnablement )
{
    // Set identifier for menu panel
    this.m_id = id;
    
    // Set identifier for parent of menu panel
    this.m_parentMenuPanelId = parentMenuPanelId;
    
    // Store reference to menu model
    this.m_menuModel = menuModel;
    
    // Store whther or not menu components can be enabled
    this.m_menuComponentEnablement = menuComponentEnablement;
    
    // Create array used to store menu components
    this.m_menuComponents = new Array();
    
    // Set currently selected menu component to "no selected component" value
    this.m_selectedComponent = -1;
    
    // Set menu panel displayed flag to false
    this.m_menuPanelDisplayed = false;
}

/**
 * Define class variables
 *
*/
MenuPanel.NO_COMPONENT_SELECTED = -1;


/**
 * Method returns identifier of menu panel
 *
 */
MenuPanel.prototype.getId = function()
{
    return this.m_id;
}


/**
 * Method returns reference to instance of MenuModel
 *
*/
MenuPanel.prototype.getMenuModel = function()
{
    return this.m_menuModel;
}


/**
 * Method indicates whether or not the menu panel is currently visible
 *
*/
MenuPanel.prototype.isVisible = function()
{
    return this.m_menuPanelDisplayed;
}


/**
 * Method adds a menu component representing a menu item
 * to the menu panel.
 *
*/
MenuPanel.prototype.addMenuComponent = function(menuComponent)
{
    this.m_menuComponents[this.m_menuComponents.length] = menuComponent;
}

/**
 * Method instructs menu model to display menu panel
 *
*/
MenuPanel.prototype.show = function()
{

    if(this.m_menuComponentEnablement)
    {
       this._updateMenuComponentStatus();
    }
    
    this.m_menuModel.showMenuPanel(this.m_id);
    
    this.m_menuPanelDisplayed = true;
}


/**
 * Method deselects any currently selected menu option and then
 * instructs menu model to hide menu panel
 *
 * @param keyDeselection If menu item requires deselection indicates
 *                       whether deslection caused by cursor movement
 *                       or key press
 *
*/
MenuPanel.prototype.hide = function(keyDeselection)
{
    if(this.m_selectedComponent != MenuPanel.NO_COMPONENT_SELECTED)
    {
        // Deselect currently selected component
        var className = this.m_menuComponents[this.m_selectedComponent].deselect(keyDeselection,false);
        
        this.m_menuModel.setMenuPanelItemClass( this.m_id, this.m_selectedComponent, className );
        
        this.m_selectedComponent = MenuPanel.NO_COMPONENT_SELECTED;
    }
    
    this.m_menuModel.hideMenuPanel(this.m_id);
    
    this.m_menuPanelDisplayed = false;
    
}


/**
 * Method handles a mouse out event when the cursor is moved outside
 * the menu panel. The cursor may either move onto the screen background
 * or onto another menu panel.
 *
 * @param targetMenuPanelId The identifier of the menu panel to which the
 *                          cursor has moved. If the cursor has moved onto
 *                          the screen background this value is null.
 *
*/
MenuPanel.prototype.handleMenuPanelMouseOut = function(targetMenuPanelId)
{
    if(this.m_selectedComponent != MenuPanel.NO_COMPONENT_SELECTED)
    {
        var className = null;
        
        if(null == targetMenuPanelId)
        {
            // Deselect currently selected item
            className = this.m_menuComponents[this.m_selectedComponent].deselect(false,true);
            
            this.m_menuModel.setMenuPanelItemClass(this.m_id, this.m_selectedComponent, className );
            
            this.m_selectedComponent = MenuPanel.NO_COMPONENT_SELECTED;
        }
        else
        {
            if(targetMenuPanelId != this.m_id)
            {
                // Cursor has moved onto a different menu panel
                if(!this._isChildMenuPanel(targetMenuPanelId))
                {
                    //Deselect currently selected item
                    className = this.m_menuComponents[this.m_selectedComponent].deselect(false,true);
                    
                    this.m_menuModel.setMenuPanelItemClass(this.m_id, this.m_selectedComponent, className );
                    
                    this.m_selectedComponent = MenuPanel.NO_COMPONENT_SELECTED;
                    
                }
                
            }
            
        }
        
    }  
}


/**
 * This method handles handles the selection of a menu component
 * following the cursor being moved over the corresponding menu item.
 *
 * @param menuItemPos The position of the menu component to be selected
 *                    within the array of menu components stored by the
 *                    menu panel.
*/
MenuPanel.prototype.handleMenuItemMouseOver = function( menuItemPos )
{

    var className = null;
    
    var id = this.m_id;
    var menuModel = this.m_menuModel;
    
    // Set selected menu panel identifier on menu model
    menuModel.setSelectedMenuPanelId(id);

    if(this.m_selectedComponent == MenuPanel.NO_COMPONENT_SELECTED)
    {
        // No component currently selected
        this.m_selectedComponent = menuItemPos;
        
        className = this.m_menuComponents[menuItemPos].select(false);
        
        menuModel.setMenuPanelItemClass( id, menuItemPos, className );
        
    }
    else
    {
        // Component currently selected
        
        if(this.m_selectedComponent != menuItemPos)
        {
            className = this.m_menuComponents[this.m_selectedComponent].deselect(false,true);
            
            menuModel.setMenuPanelItemClass( id, this.m_selectedComponent, className );
            
            this.m_selectedComponent = menuItemPos;
            
            className = this.m_menuComponents[menuItemPos].select(false);
            
            menuModel.setMenuPanelItemClass( id, menuItemPos, className );
        }   
    }
    
}

/**
 * Method handles selection of menu panel items using keyboard
 * navigation. In this case, that is using the up and down
 * arrow keys.
 *
 * @param keyArrowUp Boolean flag indicating type of key pressed.
 *                   If arrow up key pressed value is "true" and
 *                   if arrow down key is pressed value is "false".
 *
*/
MenuPanel.prototype.handleMenuPanelItemKeySelection = function(keyArrowUp)
{
    var className = null;
    var menuPanelItemPos = null;
    
    // Store useful menu panel details locally
    var id = this.m_id;
    var menuModel = this.m_menuModel;
    
    var length = this.m_menuComponents.length;
    
    if(this.m_selectedComponent == MenuPanel.NO_COMPONENT_SELECTED)
    {
        // No component currently selected
        if(keyArrowUp)
        {
            menuPanelItemPos = length - 1;
        }
        else
        {
            menuPanelItemPos = 0;
        }
        
        this.m_selectedComponent = menuPanelItemPos;
        
        className = this.m_menuComponents[menuPanelItemPos].select(true);
        
        menuModel.setMenuPanelItemClass( id, menuPanelItemPos, className );
        
        // Set selected menu panel identifier on menu model
        menuModel.setSelectedMenuPanelId(id);
    }
    else
    {
        // Deselect currently selected component
        var selectNewComponent = true;
        
        var component = this.m_menuComponents[this.m_selectedComponent];
        
        if(component.constructor == SubMenuComponent)
        {
            // Apply deselect to sub menu component
            if(component.isMenuPanelVisible())
            {
                // Pass on key action to sub menu menu panel
                component.getMenuPanel().handleMenuPanelItemKeySelection(keyArrowUp);
                
                // Stop selection of new menu panel item on current menu panel
                selectNewComponent = false;
            }
            else
            {
                // Deselect sub menu component
                className = this.m_menuComponents[this.m_selectedComponent].deselect(true,false);
                
                menuModel.setMenuPanelItemClass(id, this.m_selectedComponent, className);
            }
            
        }
        else
        {
            // Deselect action component
            className = component.deselect();
            
            menuModel.setMenuPanelItemClass(id, this.m_selectedComponent, className);
        }
        
        if(selectNewComponent)
        {
            
            // Determine position of selected menu panel item
            if(keyArrowUp)
            {
                menuPanelItemPos = this.m_selectedComponent - 1;
                if(menuPanelItemPos < 0)
                {
                    menuPanelItemPos = length - 1;
                }
            }
            else
            {
                menuPanelItemPos = this.m_selectedComponent + 1;
                if(menuPanelItemPos > length - 1)
                {
                    menuPanelItemPos = 0;
                }
            }
            
            this.m_selectedComponent = menuPanelItemPos;
            
            component = this.m_menuComponents[menuPanelItemPos];
            
            if(component.constructor == SubMenuComponent)
            {
            
                if(component.isMenuPanelVisible())
                {
                    // Clear any delayed deselect and
                    // pass action to sub menu menu panel
                    component.clearDeselectionTimeout();
                    
                    component.getMenuPanel().handleMenuPanelItemKeySelection(keyArrowUp);
                    
                }
                else
                {
                    // Select sub menu panel item
                    className = component.select(true);
                    
                    menuModel.setMenuPanelItemClass( id, menuPanelItemPos, className );
                    
                    // Set selected menu panel identifier on menu model
                    //menuModel.setSelectedMenuPanelId(id);
                }
                
            }
            else
            {
                // Select action component
                className = component.select();
                
                menuModel.setMenuPanelItemClass(id, menuPanelItemPos, className);
                
                // Set selected menu panel identifier on menu model
                //menuModel.setSelectedMenuPanelId(id);
            }
                
        } // End of if(selectNewComponent)
        
    }
    
}

/**
 * Method handles a right arrow key press for a menu panel.
 *
*/
MenuPanel.prototype.handleMenuPanelKeyRight = function()
{
    if(this.m_selectedComponent != MenuPanel.NO_COMPONENT_SELECTED)
    {
        // Retrieve currently selected component
        var component = this.m_menuComponents[this.m_selectedComponent];
    
        if(component.constructor == SubMenuComponent)
        {
            if(!component.isMenuPanelVisible())
            {
                // Clear any selection timeout
                component.clearSelectionTimeout();
            
                // Display menu panel
                component.show();
            }
        
            // Select first option on menu. Assumes menu
            // panel will always be in an unselected state.
            component.getMenuPanel().handleMenuPanelItemKeySelection(false);
        
        }
    }
    
}

/**
 * Method handles a left arrow key press for a menu panel.
 *
*/
MenuPanel.prototype.handleMenuPanelKeyLeft = function()
{
    if(this.m_selectedComponent != MenuPanel.NO_COMPONENT_SELECTED)
    {
        var component = this.m_menuComponents[this.m_selectedComponent];
        
        if(component.constructor == SubMenuComponent)
        {
            if(component.isMenuPanelVisible())
            {
                // Clear any deselection time out
                component.clearDeselectionTimeout();
                
                // Hide sub menu menu panel
                component.hide();
                
                // Set current menu panel as selected menu panel
                //this.m_menuModel.setSelectedMenuPanelId(this.m_id);
            }
            else
            {
                // Hide this menu panel
                this.hide();
                
                // Set parent menu panel as currently selected menu panel
                this.m_menuModel.setSelectedMenuPanelId(this.m_parentMenuPanelId);
            }
            
        }
        else
        {
            // Hide this menu panel
            this.hide();
                
            // Set parent menu panel as currently selected menu panel
            this.m_menuModel.setSelectedMenuPanelId(this.m_parentMenuPanelId);
        }
        
    }
    
}

/**
 * Method handles initial processing of a key return press for a menu panel.
 *
*/
MenuPanel.prototype.handleKeyReturn = function()
{
    if(this.m_selectedComponent != MenuPanel.NO_COMPONENT_SELECTED)
    {
        // A menu panel item has been selected
        var menuPanelItemPos = this.m_selectedComponent;
        
        if(this.isEnabledActionComponent(menuPanelItemPos))
        {
            // Menu panel item is enabled
            this.m_menuModel.relayKeyReturn( this.m_id, menuPanelItemPos );
        }
    }
}

/**
 * This method determines whether or not a menu panel is an immediate child of
 * this menu panel.
 *
 * @param menuPanelId The identifier of the menu panel.
 *
*/
MenuPanel.prototype._isChildMenuPanel = function(menuPanelId)
{
    var isChild = false;
    
    var menuPanel = null;
    var component = null;
    
    for(var i = 0, l = this.m_menuComponents.length; i < l; i++)
    {
        component = this.m_menuComponents[i];
        
        if(component.constructor == SubMenuComponent)
        {
            menuPanel = component.getMenuPanel();
            
            if(null != menuPanel)
            {
                if(menuPanel.getId() == menuPanelId)
                {
                    isChild = true;
                    break;
                }
            }
            
        }
        
    }
    
    return isChild;
}


/**
 * Method instructs menu model to create (and render) a new
 * menu panel for a sub menu component.
 *
*/
MenuPanel.prototype.createSubMenuMenuPanel = function( subMenuComponentId,
                                                       subMenuPanelXPath )
{
    var menuPanel = this.m_menuModel.createMenuPanel( this.m_id,
                                                      subMenuComponentId,
                                                      subMenuPanelXPath );
                                                      
    return menuPanel;
}


/**
 * Method determines whether, or not, the specified menu component is
 * an ActionComponent that the current user is allowed access to.
 *
*/
MenuPanel.prototype.isEnabledActionComponent = function(menuPanelItemPos)
{
    var enabledActionComponent = false;
    
    var menuComponent = this.m_menuComponents[menuPanelItemPos];
    
    if(menuComponent.getUserAllowedAccess())
    {
        // User is allowed access
        if(null != menuComponent.invokeAction)
        {
            enabledActionComponent = true;
        }
    }
    
    return enabledActionComponent;
    
}


/**
 * Method invokeAction invokes the required action is the user
 * has access.
 *
*/
MenuPanel.prototype.invokeAction = function(menuPanelItemPos)
{
    // Retrieve menu component
    var menuComponent = this.m_menuComponents[menuPanelItemPos];
    
    // Recheck user access
    if(menuComponent.getUserAllowedAccess())
    {
        if(null != menuComponent.invokeAction)
        {
            // Invoke action
            menuComponent.invokeAction();
        }
    }    
}

MenuPanel.prototype._updateMenuComponentStatus = function()
{
    var className = null;
    var isEnabled = null;
    var component = null;
    
    for(var i = 0, l = this.m_menuComponents.length; i < l; i++)
    {
        component = this.m_menuComponents[i];
        
        isEnabled = this.m_menuModel.isMenuComponentEnabled( component.m_id );
        
        if(isEnabled != component.m_isEnabled)
        {
            component.m_isEnabled = isEnabled;
            
            className = component.deselect(false);
            
            this.m_menuModel.setMenuPanelItemClass( this.m_id, i, className);
        }
        
    }
    
}

/**
 * Clear instance for disposal
 *
*/
MenuPanel.prototype._dispose = function()
{
    // Clear menu panel components
    for(var i = 0, l = this.m_menuComponents.length; i < l; i++)
    {
        this.m_menuComponents[i]._dispose();
    }
    
    this.m_menuComponents = null;
    
    // Clear remaining references
    this.m_id = null;
    this.m_parentMenuPanelId = null;
    this.m_menuModel = null;
    this.m_menuComponentEnablement = null;
}
        
        