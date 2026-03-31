/**
 * Class MenuModel
 *
 * This class controls the navigation menu. It receives menu events from
 * the renderer via the menu adaptor. This class responds to these events
 * using a model of the menu built from data held in the application controller.
 *
*/
function MenuModel( menuAdaptor )
{
    this.m_adaptor = menuAdaptor;
    this.m_menuRenderer = menuAdaptor.m_renderer;
    this.m_menuDataSourceId = this.m_menuRenderer.m_menuDataSourceId;
    this.m_menuDataSource = MenuDataSourceFactory.getInstance( this.m_menuDataSourceId );
    
    // Create array to store list of functional menu panel item types
    // configured for menu. At present, allow only one entry for each function type.
    this.m_functionalMenuItemTypes = new Array();
}

/**
 * Define class variables
 *
*/
MenuModel.MENU_PANEL_ID_PREFIX = "_MenuPanel_";
MenuModel.MENU_ITEM_ID_PREFIX = "_MenuItem_";

/**
 * XPath of base menu panel relative to menu bar node
 *
*/
MenuModel.BASE_MENU_PANEL_XPATH = "./panel";

MenuModel.m_logger = new Category( "MenuModel" );


/**
 * Define instance variables
 *
*/
MenuModel.prototype.m_menuPanel = null;


/**
 * Flag recording visibility of menu
 *
*/
MenuModel.prototype.m_menuDisplayed = false;


/**
 * Reference to base menu panel instance
 *
*/
MenuModel.prototype.m_baseMenuPanel = null;


/**
 * Counter used for menu panel identifiers
 *
*/
MenuModel.prototype.m_menuPanelCounter = 0;


/**
 * Menu panel lookup table
 *
*/
MenuModel.prototype.m_menuPanelLookup = new Array();

/**
 * Reference to currently selected menu panel
 *
*/
MenuModel.prototype.m_selectedMenuPanelId = null;

/**
 * Flag indicating position of mouse cursor with
 * respect to menu button
 *
*/
MenuModel.prototype.m_mouseOverMenuOption = null;


/**
 * Clean up memory after use
 *
*/
MenuModel.prototype._dispose = function()
{
    for(var i in this.m_menuPanelLookup)
    {
        this.m_menuPanelLookup[i]._dispose();
        this.m_menuPanelLookup[i] = null;
    }
    
    this.m_menuPanelLookup = null;
    
    this.m_baseMenuPanel = null;
    this.m_menuDataSource = null;
    this.m_menuRenderer = null;
    this.m_adaptor = null;
}


/**
 * Method handles mouse over menu option division
 *
*/
MenuModel.prototype.handleMenuOptionMouseOver = function(evt)
{
    this.m_mouseOverMenuOption = true;
    
    if(this.m_adaptor.m_active)
    {
        this.renderState();
    }
    
}


/**
 * Method handles mouse out on menu option division
 *
*/
MenuModel.prototype.handleMenuOptionMouseOut = function(evt)
{
    this.m_mouseOverMenuOption = false;
    
    if(this.m_adaptor.m_active)
    {
        this.renderState();
    }
    
}


/**
 * Method handles mouse down on menu option division
 *
 * param clickInsideMenuOption This is a boolean value defined when the
 *                             method is invoked following a mouse click.
 *                             If the click occurred over the menu button
 *                             the value will be "true", if not "false".
 *                             If this method is invoked by some other
 *                             mechanism, such as tabbing away from the menu
 *                             when it is displayed, the value will be null.
 *                             11/10/05 This parameter is no longer used.
 *
*/
MenuModel.prototype.handleMenuOptionMouseDown = function(clickInsideMenuOption)
{   
    if(this.m_adaptor.m_active)
    {
        if(!this.m_menuDisplayed)
        {
        
            // Set menu option CSS class
            //this.m_menuRenderer.renderMenuOption( MenuRenderer.MENU_BAR_BUTTON_INSET );
      
            // Display menu
            if(null == this.m_baseMenuPanel)
            {
                // Menu model base menu panel must be created
                // and rendered
        
                // Retrieve menu items on base menu panel
                var baseMenuItems = null;
                var menuComponentEnablement = null;
            
                if(this.m_menuDataSourceId == MenuDataSourceFactory.NAVIGATION_MENU)
                {
                    baseMenuItems = this.m_menuDataSource.getMenuPanelItems( MenuModel.BASE_MENU_PANEL_XPATH );
                
                    if(this.m_menuRenderer.m_includeCoreMenuPanelItems)
                    {
                        // Add core menu functions to base panel
                        this._addCoreMenuPanelItems(baseMenuItems);
                    }
                
                    menuComponentEnablement = false;
                }
                else
                {
                    baseMenuItems = this.m_menuDataSource.getMenuPanelItems(this.m_adaptor);
                
                    menuComponentEnablement = true;
                }
            
                if(null != baseMenuItems)
                {
                    var length = baseMenuItems.length;
                
                    if(length > 0)
                    {
                        // Create menu model base menu panel
                        var menuPanelId = this.m_menuRenderer.getElement().id +
                                          MenuModel.MENU_PANEL_ID_PREFIX + 
                                          this.m_menuPanelCounter;
                    
                        this.m_menuPanelCounter++;
                    
                        this.m_baseMenuPanel = this._createMenuPanel(menuPanelId,
                                                                     null,
                                                                     MenuModel.BASE_MENU_PANEL_XPATH,
                                                                     baseMenuItems,
                                                                     menuComponentEnablement);
                    
                        // Create menu panel lookup array and add base menu panel
                        this.m_menuPanelLookup = new Array();
                    
                        this.m_menuPanelLookup[menuPanelId] = this.m_baseMenuPanel;
                    
                        // Invoke renderer to create menu panel
                        this.m_menuRenderer.renderBaseMenuPanel(menuPanelId,
                                                                baseMenuItems);
                    
                        // Display base menu panel
                        this.m_baseMenuPanel.show();
                    }
                
                }
            
            }
            else
            {
                // Menu model base menu panel already exists
                this.m_baseMenuPanel.show();
            }
        
            this.m_menuDisplayed = true;
            
            // Redraw menu button
            this.renderState();
      
        }
        else
        {
        //if(null != clickInsideMenuOption)
        //{
            // Set menu option class
        //    if(clickInsideMenuOption)
        //    {
        //        this.m_menuRenderer.renderMenuOption( MenuRenderer.MENU_BAR_BUTTON_OUTSET );
        //    }
        //    else
        //    {
        //        this.m_menuRenderer.renderMenuOption( MenuRenderer.MENU_BAR_BUTTON );
        //    }
        //}
        //else
        //{
                //if(this.m_mouseOverMenuOption == true)
                //{
                //    this.m_menuRenderer.renderMenuOption( MenuRenderer.MENU_BAR_BUTTON_OUTSET );
                //}
                //else
                //{
                //    this.m_menuRenderer.renderMenuOption( MenuRenderer.MENU_BAR_BUTTON );
                //}
            
        //}   
      
            // Hide menu
            this.m_baseMenuPanel.hide(false);
        
            // Reset currently selected menu panel
            this.m_selectedMenuPanelId = null;
        
            this.m_menuDisplayed = false;
            
            // Redraw menu button
            this.renderState();
      
        }
        
    }
    else
    {
        // Adaptor made inactive through popup being displayed.
        
        if(this.m_menuDisplayed)
        {
            // Menu may be displayed if user uses short cut keys
            // to navigate off form whilst menu displayed
            
            // Hide menu
            this.m_baseMenuPanel.hide(false);
        
            // Reset currently selected menu panel
            this.m_selectedMenuPanelId = null;
        
            this.m_menuDisplayed = false;
            
            // Redraw menu button
            this.renderState();
            
        }
        
    }
    
    
}


/**
 * Method creates and populates an instance of the class MenuPanel
 * which represents a menu panel in the model
 *
*/
MenuModel.prototype.createMenuPanel = function(parentMenuPanelId,
                                               parentMenuItemPos,
                                               panelXPath)
{
    var menuPanel = null;
    
    // Retrieve details of menu panel items from application controller
    var menuPanelItems = null;
    
    if(this.m_menuDataSourceId == MenuDataSourceFactory.NAVIGATION_MENU)
    {
        menuPanelItems = this.m_menuDataSource.getMenuPanelItems( panelXPath );
    }
    
    if(null != menuPanelItems)
    {
        var length = menuPanelItems.length;
        
        if(length > 0)
        {
            var menuPanelId = this.m_menuRenderer.getElement().id + 
                              MenuModel.MENU_PANEL_ID_PREFIX +
                              this.m_menuPanelCounter;
                              
            this.m_menuPanelCounter++;
            
            // Create menu panel
            menuPanel = this._createMenuPanel(menuPanelId,
                                              parentMenuPanelId,
                                              panelXPath,
                                              menuPanelItems,
                                              false);
                                              
            // Add menu panel to look up array
            this.m_menuPanelLookup[menuPanelId] = menuPanel;
            
            // Instruct menu renderer to create HTML for menu panel
            this.m_menuRenderer.renderExtensionMenuPanel( parentMenuPanelId,
                                                          parentMenuItemPos,
                                                          menuPanelId,
                                                          menuPanelItems );
            
        }
        
    }
    
    return menuPanel;
    
}


/**
 * Method instructs menu renderer to make a menu panel visible
 *
*/
MenuModel.prototype.showMenuPanel = function(menuPanelId)
{
    // Display off menu panel is conditional of the main menu being displayed
    var menuPanelDisplayed = false;
    
    this.m_menuRenderer.showMenuPanel(menuPanelId);
}


/**
 * Method instructs menu renderer to hide a menu panel
 *
*/
MenuModel.prototype.hideMenuPanel = function(menuPanelId)
{
    this.m_menuRenderer.hideMenuPanel(menuPanelId);
}


/**
 * Method creates an instance of the menu model MenuPanel
 *
 * @param menuPanelId             The identifier for the menu panel
 * @param parentMenuPanelId       The identifier for the menu panel's parent
 *                                menu panel.
 * @param menuPanelXPath          XPath of node storing panel details in menu bar configuration
 * @param menuItems               Array of MenuPanelItems describing contents of menu panel.
 *                                The method adds extra details to these items before
 *                                they are passed to the menu bar renderer.
 * @param menuComponentEnablement Boolean flag indicating whether or not
 *                                menu panel items support enablement
 *
*/
MenuModel.prototype._createMenuPanel = function( menuPanelId, 
                                                 parentMenuPanelId,
                                                 menuPanelXPath,
                                                 menuItems,
                                                 menuComponentEnablement )
{
    // Create prefix for menu item identifiers
    var menuItemPrefix = menuPanelId + MenuModel.MENU_ITEM_ID_PREFIX;
    
    // Create empty menu panel definition
    var menuPanel = new MenuPanel( menuPanelId, 
                                   parentMenuPanelId, 
                                   this, 
                                   menuComponentEnablement );
    
    // Add menu panel items to menu panel
    var menuPanelItem = null;
    var type = null;
    var userAllowedAccess = null;
    var destination = null;
    var functionRef = null;
    var subformId = null;
    var panelXPath = null;
    
    var navigationComponent = null;
    var subMenuComponent = null;
    var quickLinkComponent = null;
    var functionComponent = null;
    
    var menuItemCounter = 0;
    
    // Loop through menu items adding components to menu panel
    for(var i = 0, l = menuItems.length; i < l; i++)
    {
        menuPanelItem = menuItems[i];
        
        type = menuPanelItem.m_type;
        
        if(type != MenuPanelItem.DIVISION)
        {
            if(type != MenuPanelItem.QUICK_LINK)
            {
                // Set menu item identifier
                menuPanelItem.m_id = menuItemPrefix + menuItemCounter;
            }
            
            if(type == MenuPanelItem.ITEM)
            {
                // Navigation component
                destination = menuPanelItem.m_destination;
                
                // Check user access to destination.
                userAllowedAccess = Services.hasAccessToForm(destination);
                
                if(userAllowedAccess)
                {
                    menuPanelItem.m_class = ActionComponent.ENABLED_ACTION_UNSELECTED;
                }
                else
                {
                    menuPanelItem.m_class = ActionComponent.DISABLED_ACTION_UNSELECTED;
                }
                
                navigationComponent = new NavigationComponent(menuItemCounter,
                                                              menuPanel,
                                                              destination,
                                                              userAllowedAccess);
                                                              
                menuPanel.addMenuComponent(navigationComponent);
                
            }
            else if(type == MenuPanelItem.PANEL)
            {
                // First synthesize XPath for sub menu definition
                panelXPath = menuPanelXPath + 
                             "/panel[@label='" +
                             menuPanelItem.m_label +
                             "']";
                             
                 // Check security. May need an unpleasant function here!
                 userAllowedAccess = this._hasAccessToSubMenu(panelXPath);
                 
                 // Set class on menu panel items
                 if(userAllowedAccess)
                 {
                     menuPanelItem.m_class = SubMenuComponent.ENABLED_SUBMENU_UNSELECTED;
                 }
                 else
                 {
                     menuPanelItem.m_class = SubMenuComponent.DISABLED_SUBMENU_UNSELECTED;
                 }
                 
                 subMenuComponent = new SubMenuComponent(menuItemCounter,
                                                         menuPanel,
                                                         userAllowedAccess,
                                                         panelXPath);
                                                         
                menuPanel.addMenuComponent(subMenuComponent);
                
            }
            else if(type == MenuPanelItem.QUICK_LINK)
            {
                destination = menuPanelItem.m_destination;
                subformId = menuPanelItem.m_subformId;
                
                if(null != destination)
                {
                    userAllowedAccess = Services.hasAccessToForm(destination);
                }
                else
                {
                    // Subform identifier identifies adaptor not actual sub form
                    var subFormAdaptor = FormController.getInstance().getAdaptorById(subformId);
                    if(null == subFormAdaptor)
                    {
                        throw new ConfigurationException( "Subform adaptor with identifier " +
                                                          subformId +
                                                          " defined in menu quick link configuration does not exist." );
                    }
                    // Retrieve sub form name from adaptor
                    var subformName = subFormAdaptor.subformName;
                    // Check user's access to sub form
                    userAllowedAccess = Services.hasAccessToForm(subformName);
                }
                
                // Check form context state of menu item
                isEnabled = this.isMenuComponentEnabled( menuPanelItem.m_id );
                
                // Set initial class for menu item
                if(userAllowedAccess && isEnabled)
                {
                    menuPanelItem.m_class = ActionComponent.ENABLED_ACTION_UNSELECTED;
                }
                else
                {
                    menuPanelItem.m_class = ActionComponent.DISABLED_ACTION_UNSELECTED;
                }
                
                quickLinkComponent = new QuickLinkComponent( menuPanelItem.m_id,
                                                             menuPanel,
                                                             destination,
                                                             subformId,
                                                             userAllowedAccess,
                                                             isEnabled,
                                                             menuPanelItem.m_guard,
                                                             menuPanelItem.m_prepare );
                                                             
                menuPanel.addMenuComponent( quickLinkComponent );
       
            }
            else if(type == MenuPanelItem.FUNCTION)
            {
                this._restrictFunctionalMenuPanelItemEntries(menuPanelItem.m_functionType);
                
                functionRef = this._defineMenuPanelItemFunctionRef(menuPanelItem);
                
                // RWW 03/08/05 At present, there are no security restraints
                // on function components
                userAllowedAccess = true;
                
                // Set class of menu panel item
                
                if(userAllowedAccess)
                {
                    menuPanelItem.m_class = ActionComponent.ENABLED_ACTION_UNSELECTED;
                }
                else
                {
                    menuPanelItem.m_class = ActionComponent.DISABLED_ACTION_UNSELECTED;
                }
                
                functionComponent = new FunctionComponent(menuItemCounter,
                                                          menuPanel,
                                                          functionRef,
                                                          menuPanelItem.getFunctionParamValuesAsArgumentArray(),
                                                          userAllowedAccess);
                                                          
                menuPanel.addMenuComponent( functionComponent );
            }
            else
            {
                // Unexpected menu item type
                throw new AppConfigError("Unexpected menu element type in node defined by xpath " + 
                                         menuPanelXPath);
            }
            
            menuItemCounter++;
            
        } // End of if(type != MenuPanelItem.DIVISION)
        
    } // End of for loop
    
    return menuPanel;
    
}


/**
 * Method handles mouse over event on a menu panel item
 *
*/
MenuModel.prototype.handleMenuPanelItemMouseOver = function( menuPanelId, menuItemPos )
{
    // Retrieve reference to menu panel
    var menuPanel = this.m_menuPanelLookup[ menuPanelId ];
    
    if(null != menuPanel)
    {
        menuPanel.handleMenuItemMouseOver( menuItemPos );
        
    }
    
}


/**
 * Method handles mouse out event on a menu panel item. The
 * mouse out event reflects a move of the cursor from one
 * menu panel to another or the background form.
 *
 *
*/
MenuModel.prototype.handleMenuPanelMouseOut = function( menuPanelId, targetMenuPanelId )
{
    var menuPanel = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanel)
    {
        menuPanel.handleMenuPanelMouseOut(targetMenuPanelId);
    }

}


/**
 * Method checks whether the specified menu panel item
 * is associated with an enabled action component
 *
*/
MenuModel.prototype.checkEnabledActionComponent = function(menuPanelId, menuPanelItemPos)
{
    var enabledActionComponent = false;
    
    var menuPanel = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanel)
    {
        enabledActionComponent = menuPanel.isEnabledActionComponent(menuPanelItemPos);
    }
    
    return enabledActionComponent;
    
}


/**
 * Method invokes action on specified menu component.
 *
*/
MenuModel.prototype.handleMenuPanelItemMouseClick = function( menuPanelId, menuPanelItemPos )
{
    var menuPanel = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanel)
    {
        menuPanel.invokeAction(menuPanelItemPos);
    }
    
}


/**
 * Method instructs renderer to set class on menu panel item
 *
*/
MenuModel.prototype.setMenuPanelItemClass = function( menuPanelId,
                                                      menuItemPos,
                                                      className )
{
    this.m_menuRenderer.setMenuPanelItemClass( menuPanelId,
                                               menuItemPos,
                                               className);
}


/**
 * Method determines whether or not a user has access to a sub-menu menu panel item
 * menu panel item. For the sub-menu menu panel item to be enabled
 * there must be at least one enabled action component beneath
 * the sub-menu menu panel.
 *
 * @param subMenuPanelXPath The XPath defining the panel node that
 *                          contains the sub-menu details
 * @return Returns "true" if the user can access the sub-menu otherwise "false"
*/
MenuModel.prototype._hasAccessToSubMenu = function(subMenuPanelXPath)
{ 
    var userHasAccessToSubMenu = false;
    
    // Retrieve menu panel items for sub-menu
    var ac = Services.getAppController();
    
    var menuPanelItems = ac.getMenuPanelItems(subMenuPanelXPath);
    
    if(null != menuPanelItems)
    {
        var length = menuPanelItems.length;
        
        if( length > 0 )
        {
            // Examine individual menu panel items
            var menuPanelItem = null;
           
            var type = null;
            var userAllowedAccess = null;
            var panelXPath = null;
           
            for(var i = 0; i < length; i++)
            {
                userAllowedAccess = false;
               
                menuPanelItem = menuPanelItems[i];
               
                type = menuPanelItem.m_type;
               
                if(type == MenuPanelItem.ITEM)
                {
                    // Navigation item
                    userAllowedAccess = Services.hasAccessToForm(menuPanelItem.m_destination);
                }
                else if(type == MenuPanelItem.PANEL)
                {
                    // Sub-menu item
                    panelXPath = subMenuPanelXPath + 
                                 "/panel[@label='" +
                                 menuPanelItem.m_label +
                                 "']";
                                
                    userAllowedAccess = this._hasAccessToSubMenu(panelXPath);
                   
                }
               
                if(userAllowedAccess)
                {
                    userHasAccessToSubMenu = true;
                    break;
                }
                
            } // End of for loop
            
        }
        
    }
    
    return userHasAccessToSubMenu;
}

MenuModel.prototype.isMenuComponentEnabled = function( menuPanelItemId )
{
    return this.m_adaptor.quickLinkEnabled(menuPanelItemId);
}

/**
 * Method sets the currently selected menu panel identifier
 *
*/
MenuModel.prototype.setSelectedMenuPanelId = function(menuPanelId)
{
    this.m_selectedMenuPanelId = menuPanelId;
}

/** Method returns the currently active menu panel.
 *
 *  @return If the menu is not currently displayed a value of null will be
 *          returned. If the menu is displayed, but no panel has been selected,
 *          the identifier of the base menu panel will be returned. If one, or
 *          more visible menu panel items have been selected, the identifier
 *          of the menu panel associated with the last selected item will be
 *          returned.
 *
*/
MenuModel.prototype.getActiveMenuPanelId = function()
{
    var menuPanelId = null;
    
    if(null != this.m_selectedMenuPanelId)
    {
        menuPanelId = this.m_selectedMenuPanelId;
    }
    else
    {
        // Return identifier of base menu panel
        menuPanelId = this.m_baseMenuPanel.getId();
    }
    
    return menuPanelId;
}

/**
 * Methods that handle key events routed from MenuGUIAdaptor
 *
*/
MenuModel.prototype.handleKeyUp = function()
{
    if(this.m_menuDisplayed)
    {
        var activeMenuPanelId = this.getActiveMenuPanelId();
        
        // Retrieve reference to menu panel instance
        var menuPanel = this.m_menuPanelLookup[activeMenuPanelId];
        
        if(null != menuPanel)
        {
            menuPanel.handleMenuPanelItemKeySelection(true);
        }
    }
    
}

MenuModel.prototype.handleKeyDown = function()
{
    if(this.m_menuDisplayed)
    {
        var activeMenuPanelId = this.getActiveMenuPanelId();
        
        // Retrieve reference to menu panel instance
        var menuPanel = this.m_menuPanelLookup[activeMenuPanelId];
        
        if(null != menuPanel)
        {
            menuPanel.handleMenuPanelItemKeySelection(false);
        }
    }
    
}

MenuModel.prototype.handleKeyLeft = function()
{
    if(this.m_menuDisplayed)
    {
        var activeMenuPanelId = this.getActiveMenuPanelId();
        
        if(activeMenuPanelId != this.m_baseMenuPanel.getId())
        {
            // If active menu panel is not the base menu panel
            // process left key action
            var menuPanel = this.m_menuPanelLookup[activeMenuPanelId];
            
            if(null != menuPanel)
            {
                menuPanel.handleMenuPanelKeyLeft();
            }
        }
    }
}

MenuModel.prototype.handleKeyRight = function()
{
    if(this.m_menuDisplayed)
    {
        var activeMenuPanelId = this.getActiveMenuPanelId();
        
        // Retrieve reference to menu panel instance
        var menuPanel = this.m_menuPanelLookup[activeMenuPanelId];
        
        if(null != menuPanel)
        {
            menuPanel.handleMenuPanelKeyRight();
        }
    }
}

MenuModel.prototype.handleKeyReturn = function()
{
    if(this.m_menuDisplayed)
    {
        var activeMenuPanelId = this.getActiveMenuPanelId();
        
        var menuPanel = this.m_menuPanelLookup[activeMenuPanelId];
        
        if(null != menuPanel)
        {
            menuPanel.handleKeyReturn();
        }
    }
}

/**
 * Method handles press of short cut key by simulating a mouse click/enter
 * key press on the menu button.
 *
*/
MenuModel.prototype.handleShortcutKey = function()
{
	// Get the identifier for the menu button
	var id = this.m_adaptor.getId();

	// Focus on the menu button
	Services.setFocus(id);

	// Create an event with the menu button as the source element
    var evt = new Object();
    evt.srcElement = new Object();
	evt.srcElement.id = id;

	// Call the on click handler for the menu button
	this.m_menuRenderer._handleMenuOptionMouseDown(evt);
}


/**
 * Method relays handling of key return to menu renderer. The behaviour
 * following a key return differs for IE and Mozilla. Therefore, the model
 * passes the responsibility back to the renderer. However, the model
 * does provide the associated menu panel and menu panel item.
 *
*/
MenuModel.prototype.relayKeyReturn = function(menuPanelId, menuPanelItemPos)
{
    this.m_menuRenderer.handleKeyReturn( menuPanelId, menuPanelItemPos );
}

/**
 * Method determines reference to function to be invoked by clicking
 * on a menu option. The functions details are provided by the menu bar
 * configuration or directly by the framework code.
 *
 * @param menuPanelItem Menu panel item instance containing function details
 *
 * @return Returns reference to specified function if it exists otherwise
 *         a ConfigurationException will be thrown.
 *
*/
MenuModel.prototype._defineMenuPanelItemFunctionRef = function(menuPanelItem)
{
    var funcRef = null;

    if(null != menuPanelItem.m_functionClassName)
    {
        var classRef = window[menuPanelItem.m_functionClassName];
        
        if(null == classRef)
        {
            throw new ConfigurationException( "Error : Unable to locate class " +
                                              menuPanelItem.m_functionClassName +
                                              " associated with menu item " +
                                              menuPanelItem.m_label );
        }
        else
        {
            funcRef = classRef[menuPanelItem.m_functionName];
        }
        
    }
    else
    {
        funcRef = window[menuPanelItem.m_functionName];
    }
    
    if(null == funcRef)
    {
        throw new ConfigurationException( "Error : Unable to locate function " +
                                          menuPanelItem.m_functionName +
                                          " associated with menu item " +
                                          menuPanelItem.m_label );
    }
    
    return funcRef;
}

/**
 * This method restricts the number of menu panel item entries allowed for
 * a particular function type. Basically, a menu can only contain one entry
 * for each function type. This is an artificial restriction applied to
 * prevent the misuse of the menu functionality.
 *
 * @param functionalType The functional type associated with a menu panel item
 *
*/
MenuModel.prototype._restrictFunctionalMenuPanelItemEntries = function(functionalType)
{
    
    var currentFunctionalTypes = this.m_functionalMenuItemTypes;
    
    for(var i = 0, l = currentFunctionalTypes.length; i < l; i++)
    {
        if(functionalType == currentFunctionalTypes[i])
        {
            throw new ConfigurationException( "Error : The menu configuration allows there to be one menu panel item of functional type " +
                                              functionalType +
                                              " only." ); 
        }
    }
    
    // New functional menu panel item type
    currentFunctionalTypes[currentFunctionalTypes.length] = functionalType;
    
}

/**
 * Method adds core menu functions to base menu panel. To date, 09/08/05, the
 * identified core menu options are logout and exit.
 *
 * @param baseMenuPanelItems Array of instances of class MenuPanelItem defining
 *                           items on base menu panel as defined by the application
 *                           configuration file
 *
*/
MenuModel.prototype._addCoreMenuPanelItems = function(baseMenuPanelItems)
{
    var i = null;
    var menuPanelItem = null;
    
    var length = baseMenuPanelItems.length;
    
    // First configure logout menu panel item.
    // Check for initial configuration from application configuration
    for(i = 0; i < length; i++)
    {
        if(baseMenuPanelItems[i].m_functionType == "logout")
        {
            menuPanelItem = baseMenuPanelItems[i];
            break;
        }
    }
    
    if(null != menuPanelItem)
    {
        if(null == menuPanelItem.m_functionName)
        {
            // Logout entry in menu configuration, but associated
            // function not defined.
            menuPanelItem.m_functionClassName = "Services";
            menuPanelItem.m_functionName = "logoff";
        }
        
    }
    else
    {
        // Create new menu panel item for logout
        menuPanelItem = new MenuPanelItem();
        
        menuPanelItem.m_type = MenuPanelItem.FUNCTION;
        menuPanelItem.m_functionType = "logout";
        menuPanelItem.m_label = "Logout";
        menuPanelItem.m_functionClassName = "Services";
        menuPanelItem.m_functionName = "logoff";
        
        // Defect 1044. Define default parameter for use by applications
        // that have implemented form life cycles. The value of this
        // parameter should not affect applications that have not
        // implemented life cycles.
        menuPanelItem.m_functionParams = new Array();
        
        var menuPanelItemFuncParam = new MenuPanelItemFunctionParam();
        
        menuPanelItemFuncParam.m_name = "raiseWarningIfDOMDirty";
        menuPanelItemFuncParam.m_position = 1;
        menuPanelItemFuncParam.m_type = MenuPanelItemFunctionParam.BOOLEAN;
        menuPanelItemFuncParam.m_value = true;
        
        menuPanelItem.m_functionParams[0] = menuPanelItemFuncParam;
        
        // Add menu panel item to list of menu items.
        baseMenuPanelItems[baseMenuPanelItems.length] = menuPanelItem;
        
        // Add division
        menuPanelItem = new MenuPanelItem();
        
        menuPanelItem.m_type = MenuPanelItem.DIVISION;
        baseMenuPanelItems[baseMenuPanelItems.length] = menuPanelItem;
        
    }
     
    // Configure exit menu panel item
    // First look for exit entry in base menu panel items
    menuPanelItem = null;
    
    for( i = 0; i < length; i++ )
    {
        if( baseMenuPanelItems[i].m_functionType == "exit" )
        {
            menuPanelItem =  baseMenuPanelItems[i];
            break;
        }
    }
    
    if(null == menuPanelItem)
    {
        // Create default exit menu panel item
        menuPanelItem = new MenuPanelItem();
    
        menuPanelItem.m_type = MenuPanelItem.FUNCTION;
        menuPanelItem.m_functionType = "exit";
        menuPanelItem.m_label = "Exit";
        menuPanelItem.m_functionClassName = "FormController";
        menuPanelItem.m_functionName = "exitApplication";
        
        baseMenuPanelItems[baseMenuPanelItems.length] = menuPanelItem;
    }   
            
}

/**
 * Method determines action to take when menu component loses focus
 * when displayed.
 *
*/
MenuModel.prototype.handleLostFocusWhilstDisplayed = function()
{
    if(this.m_menuDisplayed == true)
    {
        this.m_menuRenderer.handleLostFocusWhilstDisplayed();
    }
}

/**
 * Method redraws menu option button according to
 * current state of menu.
 *
*/
MenuModel.prototype.renderState = function()
{
    var menuClasses = null;
    
    if(this.m_menuDisplayed)
    {
        menuClasses = MenuRenderer.MENU_BAR_BUTTON_INSET;
    }
    else
    {
        if(this.m_mouseOverMenuOption == true)
        {
            menuClasses = MenuRenderer.MENU_BAR_BUTTON_OUTSET;
        }
        else
        {
            menuClasses = MenuRenderer.MENU_BAR_BUTTON;
        }
    }
    
    menuClasses += " ";
    
    if(this.m_adaptor.m_active)
    {
        menuClasses += MenuRenderer.MENU_BAR_BUTTON_ACTIVE;
    }
    else
    {
        menuClasses += MenuRenderer.MENU_BAR_BUTTON_INACTIVE;
    }
    
    // Instruct renderer to redraw button
    this.m_menuRenderer.renderMenuOption( menuClasses );
}