/**
 * Class MenuPanelRenderer
 *
 * This class is designed to render individual menu panels.
 *
*/


function MenuPanelRenderer(){}

/**
 * Define class variables
 *
*/

MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS = "MenuPanelDiv";

// Define additional classes for menu item divisions and cells

MenuPanelRenderer.MENU_ITEM_CELL = "menuItemCell";

MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW_CSS_CLASS = "DivisionsAboveAndBelow";
MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS = "divisionAbove";
MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS = "divisionBelow";
MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS_CSS_CLASS = "NoDivisions";

// Define constants used to store menu item division status

MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS = 0;
MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE = 1;
MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW = 2;
MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW = 3;

// Define constants used to identify mouse over element

MenuPanelRenderer.CELL_TAG_NAME = "TD";
MenuPanelRenderer.DIV_TAG_NAME = "DIV";

MenuPanelRenderer.m_logger = new Category( "MenuPanelRenderer" );

/**
 * Define instance members
 *
 * Reference to HTML div encompassing menu panel
*/

MenuPanelRenderer.prototype.m_element = null;

/**
 * Reference to controlling menu renderer
 *
*/

MenuPanelRenderer.prototype.m_menuRenderer = null;

/**
 * Reference to menu panel mouse over event handler
 *
*/

MenuPanelRenderer.prototype.m_menuPanelMouseOverHandler = null;

/**
 * Reference to menu panel mouse out event handler
 *
*/

MenuPanelRenderer.prototype.m_menuPanelMouseOutHandler = null;

/**
 * Reference to PopupLayer instance used to control visibility
 * of menu panel
 *
*/

MenuPanelRenderer.prototype.m_popupLayer = null;

/**
 * Array used to look up menu item position from identifier
*/

MenuPanelRenderer.prototype.m_menuPanelItemPosLookup = null;

/**
 * Array referencing primary menu item elements
 * These are the HTML Div elements within the table cells
 *
*/

MenuPanelRenderer.prototype.m_menuPanelItemElements = null;

/**
 * Array storing details of divisions for each menu item
 *
*/

MenuPanelRenderer.prototype.m_menuPanelItemDivStatus = null;

/**
 * Create menu panel as a child of another HTML element
 *
 * @param parentElement   The parent HTML element. Note that the parent element
 * @param menuRenderer    Reference to instance of menu renderer
 * @menuPanelId           The identifier for the base menu panel HTML element
 * @menuPanelItems        Array of instances of class MenuPanelItem which
 *                        describe menu items
 *
*/

MenuPanelRenderer.createAsChild = function( parentElement, 
                                            menuRenderer,
                                            menuPanelId,
                                            menuPanelItems )
{
    // Create HTML div which encompasses menu panel
    var menuPanelDiv = document.createElement( "div" );
    
    // Create MenuPanelRenderer instance and define contents of div
    var menuPanelRenderer = MenuPanelRenderer._createMenuPanel( menuPanelDiv,
                                                                menuRenderer,
                                                                menuPanelId,
                                                                menuPanelItems);
                                                                
    // Attach menu panel div to parent element
    //parentElement.appendChild(menuPanelDiv);
    parentElement.appendChild(menuPanelRenderer.m_element);
    
    return menuPanelRenderer;
    
}

/**
 * Method creates an instance of the class MenuPanelRenderer.
 *
*/

MenuPanelRenderer._createMenuPanel = function( menuPanelDiv,
                                               menuRenderer,
                                               menuPanelId,
                                               menuPanelItems)
{
    // Create instance of menu panel renderer
    var mpr = new MenuPanelRenderer();
    
    // Define base element
    mpr.m_element = menuPanelDiv;
    
    mpr.m_element.id = menuPanelId;
    mpr.m_element.className = MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS;
    
    // Store reference to menu bar renderer
    mpr.m_menuRenderer = menuRenderer;
    
    // Create storage arrays
    mpr.m_menuPanelItemPosLookup = new Array();
    mpr.m_menuPanelItemElements = new Array();
    mpr.m_menuPanelItemDivStatus = new Array();
    
    // Create table and tbody inside division
    var table = document.createElement( "table" );
    //menuPanelDiv.appendChild(table);
    mpr.m_element.appendChild(table);
    
    // Set table cell style
    table.cellPadding = "0";
    table.cellSpacing = "0";
    
    var tbody = document.createElement( "tbody" );
    table.appendChild( tbody );
    
    // Loop through array of menu panel items creating required
    // table entries
    
    var row = null;
    var cell = null;
    var innerDiv = null;
    var menuPanelItem = null;
    var divisionAbove = null;
    var divisionBelow = null;
    
    var length = menuPanelItems.length;
    var menuItemPos = 0;
    
    for(var i = 0; i < length; i++)
    {
        menuPanelItem = menuPanelItems[i];
        
        if(menuPanelItem.m_type != MenuPanelItem.DIVISION)
        {
            // Add menu item to table
            row = document.createElement( "tr" );
            tbody.appendChild( row );
            
            cell = document.createElement( "td" );
            row.appendChild( cell );
            
            innerDiv = document.createElement( "div" );
            cell.appendChild( innerDiv );
            
            // Define properties of table entries
            cell.id = menuPanelItem.m_id;
            
            // Set base classes on cell and innerDiv
            cell.className = MenuPanelRenderer.MENU_ITEM_CELL;
            
            innerDiv.className = menuPanelItem.m_class;
            
            // Search for presence of division above or below item
            // Note, divisions should not be set in the first and
            // last array positions
            
            divisionAbove = false;
            divisionBelow = false;
            
            if( i - 1 > 0 )
            {
                if(menuPanelItems[i - 1].m_type == MenuPanelItem.DIVISION)
                {
                    divisionAbove = true;
                }
            }
            
            if( i + 1 < length - 1 )
            {
                if(menuPanelItems[i + 1].m_type == MenuPanelItem.DIVISION)
                {
                    divisionBelow = true;
                }
            }
            
            // Modify class lists if necessary and store division details
            
            if(divisionAbove == true && divisionBelow == true)
            {
                cell.className += " " +
                                  MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS +
                                  " " +
                                  MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                                  
                innerDiv.className += " " +
                                      MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS +
                                      " " +
                                      MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                                  
                mpr.m_menuPanelItemDivStatus[menuItemPos] = MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW;
            }
            else if(divisionAbove == true && divisionBelow == false)
            {
                cell.className += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;
                                 
                innerDiv.className += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;
                                     
                mpr.m_menuPanelItemDivStatus[menuItemPos] = MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE;
                
            }
            else if(divisionAbove == false && divisionBelow == true)
            {
            
                cell.className += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                                 
                innerDiv.className += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                                     
                mpr.m_menuPanelItemDivStatus[menuItemPos] = MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW;
                
            }
            else
            {
                // No division above or below
                mpr.m_menuPanelItemDivStatus[menuItemPos] = MenuPanelRenderer.MENU_ITEM_NO_DIVISIONS;
                
            }
 
            // Set text in inner div
            innerDiv.innerHTML = menuPanelItem.m_label;
            
			// D855 - A sub-menu panel for a menu panel item is a child of a menu panel item.
			// This means it will have the same z-index as the parent menu panel item. As menu
			// panel items below this are higher in the stacking order then they show through
			// the sub-menu panel. To prevent this assign a z-index to each menu item in the
			// panel that decreases from the top to bottom menu items.
            innerDiv.style.zIndex = (length - i);
            
            // Store reference to inner div
            mpr.m_menuPanelItemElements[menuItemPos] = innerDiv;
            
            // Store menu panel item position in look up table
            mpr.m_menuPanelItemPosLookup[menuPanelItem.m_id] = menuItemPos;
            
            // Increment menu item counter
            menuItemPos++;
            
        } // End of if(menuPanelItem.m_type != MenuItemPanel.DIVISION)
        
    } // End of for loop
    
    // Create instance of PopupLayer class that controls
    // visibility of menu panel
    mpr.m_popupLayer = PopupLayer.create(mpr.m_element);
    
    // Start event handlers
    mpr.startMenuPanelEventHandlers();
    
    // Return instance of menu panel renderer class
    return mpr;
    
}

/**
 * Method returns identifier of parent menu panel.
 * If there is no parent menu panel the method returns null.
 *
*/

MenuPanelRenderer.getParentMenuPanelId = function(element)
{
    var menuPanelId = null;
    
    var className = null;
    
    // Retrieve parent element
    var parent = element.parentNode;
    
    while(null != parent)
    {
        className = parent.className;
        
        if(className == MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
        {
            menuPanelId = parent.id;
            break;
        }
        
        parent = parent.parentNode;
    }
    
    return menuPanelId;
    
}


/**
 * Method cleans up memory used by instance of class
 *
*/

MenuPanelRenderer.prototype._dispose = function()
{
    // Stop menu panel event handlers
    this.stopMenuPanelEventHandlers();
    
    // Set arrays to null
    this.m_menuPanelItemPosLookup = null;
    this.m_menuPanelItemElements = null;
    this.m_menuPanelItemDivStatus = null;

	this.m_popupLayer._dispose();    
    this.m_popupLayer = null;

    this.m_menuRenderer = null;
    this.m_element = null;
    
}
    

/**
 * Method makes menu panel visible
 *
*/

MenuPanelRenderer.prototype.show = function()
{
    this.m_popupLayer.show();
}

/**
 * Method hides menu panel
 *
*/

MenuPanelRenderer.prototype.hide = function()
{
    this.m_popupLayer.hide();
}

/**
 * Method sets class on menu panel item inner div
 *
*/

MenuPanelRenderer.prototype.setMenuPanelItemClass = function( menuItemPos,
                                                              className )
{

    if( menuItemPos >= 0 && menuItemPos < this.m_menuPanelItemElements.length)
    {
        // Retrieve reference to inner division
        var innerDiv = this.m_menuPanelItemElements[menuItemPos];
        
        // Define classes for menu item
        var divClasses = className;
        
        // Add auxilliary classes for division if required
        var menuItemDivStatus = this.m_menuPanelItemDivStatus[menuItemPos];
        
        switch(menuItemDivStatus)
        {
            case MenuPanelRenderer.MENU_ITEM_DIVISIONS_ABOVE_AND_BELOW:
                divClasses += " " +
                              MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS +
                              " " +
                              MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                break;
                
            case MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE:
                divClasses += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_ABOVE_CSS_CLASS;
                break;
                
            case MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW:
                divClasses += " " + MenuPanelRenderer.MENU_ITEM_DIVISION_BELOW_CSS_CLASS;
                break;
                
            default:
                break;
                
        }
        
        // Set classes on inner div
        innerDiv.className = divClasses;
                              
    }
    
}

/**
 * Method starts event handlers on menu panel
 *
*/

MenuPanelRenderer.prototype.startMenuPanelEventHandlers = function()
{
    var thisObj = this;
    
    if(null == this.m_menuPanelMouseOverHandler)
    {
        this.m_menuPanelMouseOverHandler = SUPSEvent.addEventHandler( this.m_element,
                                                                      "mouseover",
                                                                      function(evt){return thisObj._handleMenuPanelMouseOver(evt);} );
    }
    
    if(null == this.m_menuPanelMouseOutHandler)
    {
        this.m_menuPanelMouseOutHandler = SUPSEvent.addEventHandler( this.m_element,
                                                                     "mouseout",
                                                                     function(evt){return thisObj._handleMenuPanelMouseOut(evt);} );
    }
    
}

/**
 * Method stops menu panel event handlers
 *
*/

MenuPanelRenderer.prototype.stopMenuPanelEventHandlers = function()
{
    if(null != this.m_menuPanelMouseOverHandler)
    {
        SUPSEvent.removeEventHandlerKey(this.m_menuPanelMouseOverHandler);
        this.m_menuPanelMouseOverHandler = null;
    }
    
    if(null != this.m_menuPanelMouseOutHandler)
    {
        SUPSEvent.removeEventHandlerKey(this.m_menuPanelMouseOutHandler);
        this.m_menuPanelMouseOutHandler = null;
    }
    
}

/**
 * Method handles menu panel mouse over event
 *
*/

MenuPanelRenderer.prototype._handleMenuPanelMouseOver = function(evt)
{

    evt = (evt) ? evt : ((event) ? event : null );
    
    if(null != evt)
    {
        var srcElement = SUPSEvent.getTargetElement(evt);
        
        // Locate mouse over event generated by table cell or inner div
        var cellElement = null;
        
        if(srcElement.tagName == MenuPanelRenderer.CELL_TAG_NAME)
        {
            cellElement = srcElement;
        }
        else if(srcElement.tagName == MenuPanelRenderer.DIV_TAG_NAME)
        {
            var parentElement = srcElement.parentNode;
            
            if(parentElement.tagName == MenuPanelRenderer.CELL_TAG_NAME)
            {
                cellElement = parentElement;
            }
        
        }
        
        if(null != cellElement)
        {
            var menuItemPos = this.m_menuPanelItemPosLookup[ cellElement.id ];
            
            if(null != menuItemPos)
            {
                // Invoke selected method on menu renderer
                this.m_menuRenderer.handleMenuPanelItemMouseOver(this.m_element.id,
                                                                 menuItemPos);
            }
            
        }
        
        // Stop progagtion of mouse out event
        SUPSEvent.stopPropagation(evt);
        
    }
    
}

/**
 * Method handles menu panel mouse out event
 *
*/

MenuPanelRenderer.prototype._handleMenuPanelMouseOut = function(evt)
{
    evt = (evt) ? evt : ((event) ? event : null );
    
    if(null != evt)
    {
        var toElement = null;
        var srcElement = null;
        
        toElement = SUPSEvent.getRelatedElement(evt)
        
        // Identify target of mouse out
        var targetMenuPanelId = null;
        
        if(null != toElement)
        {
            // Take care checking class name as Mozilla can throw
            // permission exception if toElement a Mozilla component
            
            var className = null;
            
            var permissionExceptionOccurred = false;
            
            try
            {
                className = toElement.className;
            }
            catch(ex)
            {
                permissionExceptionOccurred = true;
            }
            
            if(!permissionExceptionOccurred)
            {
                if(className == MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
                {
                    targetMenuPanelId = toElement.id;
                }
                else
                {
                    targetMenuPanelId = MenuPanelRenderer.getParentMenuPanelId(toElement);
                }
            }
            
        }
        
        if(targetMenuPanelId != this.m_element.id)
        {
            this.m_menuRenderer.handleMenuPanelMouseOut( this.m_element.id,
                                                         targetMenuPanelId );
        }
        
        // Stop progagtion of mouse out event
        SUPSEvent.stopPropagation(evt);
        
    }
    
}

/**
 * Method returns position of menu panel item on menu
 * panel given menu panel item identifier
 *
 * @param menuPanelItemId The identifier associated with a table cell
 *                        containing a menu panel item
 * @return Returns the position of the menu panel within the menu panel
 *
*/

MenuPanelRenderer.prototype.getMenuPanelItemPosFromId = function(menuPanelItemId)
{
    return this.m_menuPanelItemPosLookup[menuPanelItemId];
}

/**
 * Method returns inner div associated with the menu panel item
 * specified by the input argument
 *
 * @param menuItemPos The position of the menu item on the menu panel
 * @return Returns associated table cell
 *
*/

MenuPanelRenderer.prototype.getMenuPanelItem = function(menuItemPos)
{
    var innerDiv = this.m_menuPanelItemElements[menuItemPos];
    
    return innerDiv;
}

/**
 * Method enables position of menu panel to be set. Note position is
 * relative to parent table cell on parent menu panel.
 *
*/

MenuPanelRenderer.prototype.setPosition = function( left, top )
{
    if(null != left)
    {
        this.m_element.style.left = left + "px";
    }
    
    if(null != top)
    {
        this.m_element.style.top = top + "px";
    }
}

