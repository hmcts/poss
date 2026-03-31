//==================================================================
//
// MenuRenderer.js
//
// Implementation of Menu rendering class. Creates a menu entry on a
// menu bar and manages it's associated Menu Panel
//
//==================================================================

// Determine current browser in use
 
switch(navigator.appName)
{
	case "Netscape":
	{
		MenuRenderer.isIE = false;
		MenuRenderer.isMoz = true;
		break;
	}
	
	case "Microsoft Internet Explorer":
	{
		MenuRenderer.isIE = true;
		MenuRenderer.isMoz = false;
		break;
	}
	
	default:
	{
		alert("Unknown browser type");
	    break;
	}
	
}


/**
 * MenuRenderer constructor - never used. Use factory methods
 * below to create a Menu as a child of another element
 *
 * @private
 * @constructor
 */
function MenuRenderer()
{
}


/**
 * MenuRenderer is a sub class of Renderer
 */
MenuRenderer.prototype = new Renderer();
MenuRenderer.prototype.constructor = MenuRenderer;


/**
 * Logging category for the MenuRenderer
 *
 * @type Category
 * @private
 */
MenuRenderer.m_logger = new Category("MenuRenderer");


/**
 * CSS Class name of the outermost div of the Menu
 *
 * @type String
 */
MenuRenderer.MENU_BAR_BUTTON = "MenuBarButton";
MenuRenderer.MENU_BAR_BUTTON_INSET = "MenuBarButton MenuBarButtonInset";
MenuRenderer.MENU_BAR_BUTTON_OUTSET = "MenuBarButton MenuBarButtonOutset";

/**
 * Additional styling for menu button
 *
*/
MenuRenderer.MENU_BAR_BUTTON_ACTIVE = "MenuBarButtonActive";
MenuRenderer.MENU_BAR_BUTTON_INACTIVE = "MenuBarButtonInactive";

/**
 * Instance variables
 *
*/

/**
 * Base menu panel
 *
*/
MenuRenderer.prototype.m_baseMenuPanel = null;

/**
 * Reference to menu data source type
 *
*/
MenuRenderer.prototype.m_menuDataSourceId = null;

/**
 * References to event handlers
 *
 * Menu option mouse over handler
 *
*/
MenuRenderer.prototype.m_menuOptionMouseOverHandler = null;

/**
 * Menu option mouse out handler
 *
*/
MenuRenderer.prototype.m_menuOptionMouseOutHandler = null;

/**
 * Menu option mouse down handler
 *
*/
MenuRenderer.prototype.m_menuOptionMouseDownHandler = null;

/**
 * Flag indicating capture of mouse events is activated
 *
*/
MenuRenderer.prototype.m_hasMouseCapture = false;

/**
 * Flag indicating loss of mouse capture
 *
*/

MenuRenderer.prototype.m_mouseCaptureLost = false;

/**
 * For IE temporarily store click details of event causing loss
 * of mouse capture.
 *
 * Store whether or not click was on a menu panel
*/
MenuRenderer.prototype.m_clickOnMenuPanelItem = null;

/**
 * If not a click on a menu panel item store event details
 *
*/
MenuRenderer.prototype.m_lastClickEventSrcElement = null;

/**
 * If click on menu panel item store menu panel and item identifiers
 *
*/
MenuRenderer.prototype.m_clickOnMenuPanelId = null;
MenuRenderer.prototype.m_clickOnMenuPanelItemPos = null;

/**
 * General mouse click event handler whilst menu displayed
 *
*/
MenuRenderer.prototype.m_clickEventKey = null;

/**
 * References to event callback function lists
 *
 * Menu option mouse over callback list
*/
MenuRenderer.prototype.m_menuOptionMouseOver_callbackList = null;

/**
 * Menu option mouse out callback list
 *
*/
MenuRenderer.prototype.m_menuOptionMouseOut_callbackList = null;

/**
 * Menu option mouse down callback list
 *
*/
MenuRenderer.prototype.m_menuOptionMouseDown_callbackList = null;

/**
 * Menu panel item mouse over callback list
 * Note, the event handler for this event is handled by the
 * menu panel renderers
 *
*/
MenuRenderer.prototype.m_menuPanelItemMouseOver_callbackList = null;

/**
 * Menu panel mouse out callback list.
 * Note, the event handler for this event is handled by the
 * menu panel renderers
 *
*/
MenuRenderer.prototype.m_menuPanelMouseOut_callbackList = null;

/**
 * Callback list used to check menu panel item represents an action
 * component which the current user is allowed access to
 *
*/
MenuRenderer.prototype.m_checkEnabledActionComponent_callbackList = null;

/**
 * Menu panel item mouse click callback list.
 * Note, the event handler for this event is the general
 * mouse click event handler used when the menu is displayed.
 *
*/
MenuRenderer.prototype.m_menuPanelItemMouseClick_callbackList = null;

/**
 * Array acting as look up table for rendered menu panels
 *
*/
MenuRenderer.prototype.m_menuPanelLookup = null;

/**
 * Flag indicating alignment of base menu panel with respect to menu button
 *
*/

MenuRenderer.prototype.m_baseMenuPanelLeftAlign = null;

/**
 * Flag inicating whether or not menu should include core menu
 * functions (i.e. logout and exit)
 *
*/
MenuRenderer.prototype.m_includeCoreMenuPanelItems = null;


/**
 * Create a menu in the document relative to the supplied element.
 *
 * Static createAsInnerHTML function enables menu component to
 * be created lazily and still act as a tab stop.
 *
 * @param refElement the element relative to which the menu should be rendered
 * @param relativePos the relative position of the menu to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the menu being created
 * @param label the name of the menu
 * @param baseMenuPanelLeftAlign the menu panel alignment flag
 * @param menuDataSourceId which data source to use for the menu
 * @param includeCoreMenuPanelItems Flag indicating whether or not menu should
 *                                  incorporate core menu panel items (i.e. logout and exit)
 */
MenuRenderer.createAsInnerHTML = function( refElement,
                                           relativePos,
                                           id,
                                           label,
                                           baseMenuPanelLeftAlign,
                                           menuDataSourceId,
                                           includeCoreMenuPanelItems )
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the menu being created
		true			// The menu doesn't have any internal input element which can accept focus, so the div should accept focus
	);
	                                        
    // Create instance of menu renderer
    return MenuRenderer._create(e, 
                                label, 
                                baseMenuPanelLeftAlign, 
                                menuDataSourceId,
                                includeCoreMenuPanelItems);
}


/**
 * Create the body of the menu
 *
 * @param e the outermost div of menu.
 * @param label the menu label
 * @param baseMenuPanelLeftAlign the menu panel alignment flag
 * @param menuDataSourceId which data source to use for the menu
 * @param includeCoreMenuPanelItems Flag indicating whether or not menu should
 *                                  incorporate core menu panel items (i.e. logout and exit)
 */
MenuRenderer._create = function(e, 
                                label, 
                                baseMenuPanelLeftAlign,
                                menuDataSourceId,
                                includeCoreMenuPanelItems)
{
	// Set the class name
	e.className = MenuRenderer.MENU_BAR_BUTTON;
	e.innerHTML = label;
	
    // Prevent selection of menu text
    preventSelection(e);
    
    // Create instance of MenuRenderer
    var mr = new MenuRenderer();
    
	// Initialise sets main element and the reference to the renderer in the dom
	mr._initRenderer(e);	
    
    // Set alignment of base menu panel
    
    if(null != baseMenuPanelLeftAlign)
    {
        mr.m_baseMenuPanelLeftAlign = baseMenuPanelLeftAlign;
    }
    else
    {
        mr.m_baseMenuPanelLeftAlign = true;
    }
    
    mr.m_menuDataSourceId = menuDataSourceId;
    
    if(true == includeCoreMenuPanelItems)
    {
        mr.m_includeCoreMenuPanelItems = true;
    }
    else
    {
        mr.m_includeCoreMenuPanelItems = false;
    }
    
    // Create callback lists to store functions from adaptor
    // that are invoked following events on menu button and panels
    
    mr.m_menuOptionMouseOver_callbackList = new CallbackList();
    mr.m_menuOptionMouseOut_callbackList = new CallbackList();
    mr.m_menuOptionMouseDown_callbackList = new CallbackList();
    mr.m_menuPanelItemMouseOver_callbackList = new CallbackList();
    mr.m_menuPanelMouseOut_callbackList = new CallbackList();
    mr.m_checkEnabledActionComponent_callbackList = new CallbackList();
    mr.m_menuPanelItemMouseClick_callbackList = new CallbackList();
    
    return mr;
    
}


MenuRenderer.prototype._dispose = function()
{
	unPreventSelection(this.m_element);
	
	// Clean up menu panels
    for(var i in this.m_menuPanelLookup)
    {
        this.m_menuPanelLookup[ i ]._dispose();
    }

    // Stop event handlers
    this.stopMenuEventHandlers();
    
    // Clean callback lists
    this.m_menuOptionMouseOver_callbackList.dispose();
    this.m_menuOptionMouseOut_callbackList.dispose();
    this.m_menuOptionMouseDown_callbackList.dispose();
    this.m_menuPanelItemMouseOver_callbackList.dispose();
    this.m_menuPanelMouseOut_callbackList.dispose();
    this.m_checkEnabledActionComponent_callbackList.dispose();
    this.m_menuPanelItemMouseClick_callbackList.dispose();
    
    // Set references to null
    this.m_baseMenuPanel = null;
    this.m_menuPanelLookup = null;
    
    this.m_element.__renderer = null;
    this.m_element = null;
}

/**
 * Method renders base menu panel
 *
 */
MenuRenderer.prototype.renderBaseMenuPanel = function( menuPanelId, baseMenuPanelItems )
{
    // Create look up array for all menu panels
    this.m_menuPanelLookup = new Array();
    
    // Create base menu panel
    var baseMenuPanel = MenuPanelRenderer.createAsChild( this.m_element,
                                                         this,
                                                         menuPanelId,
                                                         baseMenuPanelItems );
                                                         
    // Store reference to base menu panel
    this.m_baseMenuPanel = baseMenuPanel;
                                                         
    // Add menu panel to look up table
    this.m_menuPanelLookup[menuPanelId] = baseMenuPanel;
    
    // Determine location of menu panel
    var left = 0;
    var top = this.m_element.offsetHeight;
    
    if(this.m_baseMenuPanelLeftAlign)
    {
        // Align left edge of menu panel with left edge of menu button
        left = this.m_element.offsetLeft;
    }
    else
    {
        // Align right edge of menu panel with right edge of menu button
        if(MenuRenderer.isIE)
        {
            var baseMenuStyle = getCalculatedStyle(baseMenuPanel.m_element);
            
            var baseMenuWidth = baseMenuPanel.m_element.offsetWidth +
                                parseInt(baseMenuStyle.borderLeftWidth) +
                                parseInt(baseMenuStyle.borderRightWidth);
                                 
    
            left = this.m_element.offsetLeft + (this.m_element.offsetWidth - baseMenuWidth);
        }
        else if(MenuRenderer.isMoz)
        {
            left = this.m_element.offsetLeft + (this.m_element.offsetWidth - baseMenuPanel.m_element.offsetWidth);
        }
        
    }
    
    baseMenuPanel.setPosition( left, top );
      
}

/**
 * Method renders a menu panel which extends the menu to include
 * a further sub menu panel
 *
 */
MenuRenderer.prototype.renderExtensionMenuPanel = function( 
  parentMenuPanelId,
  parentMenuItemPos,
  menuPanelId,
  menuPanelItems
)
{
    // Retrieve reference to parent menu panel instance
    var parentMenuPanel = this.m_menuPanelLookup[parentMenuPanelId];
    
    // Retrieve reference to inner div that is the parent of the new menu panel
    var parentMenuItem = parentMenuPanel.getMenuPanelItem(parentMenuItemPos);
    
    // Create new menu panel
    var menuPanel = MenuPanelRenderer.createAsChild( parentMenuItem,
                                                     this,
                                                     menuPanelId,
                                                     menuPanelItems );
                                                     
    // Add new menu panel to lookup array
    this.m_menuPanelLookup[menuPanelId] = menuPanel;
    
    // Define position of new menu panel
    var left;
    var top;
    
    if(MenuRenderer.isIE)
    {
        // Subtract left padding value from inner div offset width
        var paddingLeft = parentMenuItem.currentStyle.paddingLeft;
        
        left = parentMenuItem.offsetWidth - parseInt(paddingLeft);
        
        // Shift menu panel slightly left to create overlap
        left = left - 4;
        
        var paddingTop = parentMenuItem.currentStyle.paddingTop;
        
        top = -parseInt(paddingTop);
    
    }
    else if(MenuRenderer.isMoz)
    {
        left = parentMenuItem.offsetWidth;
        
        var menuPanelStyle = getCalculatedStyle( menuPanel.m_element );
        
        top = -parseInt( menuPanelStyle.borderTopWidth );
        
    }
    
    // Set position of menu panel
    
    menuPanel.setPosition( left, top );
    
}


/**
 * Method sets class on menu option division
 *
 */
MenuRenderer.prototype.renderMenuOption = function( className )
{
    this.m_element.className = className;
}


/**
 * Method displays specified menu panel
 *
 */
MenuRenderer.prototype.showMenuPanel = function(menuPanelId)
{
    var menuPanelRenderer = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanelRenderer)
    {
        menuPanelRenderer.show();
    }
}


/**
 * Method hides specified menu panel
 *
 */
MenuRenderer.prototype.hideMenuPanel = function(menuPanelId)
{
    var menuPanelRenderer = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanelRenderer)
    {
        menuPanelRenderer.hide();
    }
}

/**
 * Methods which register callback functions on adaptor
 *
 * Register menu option mouse over handler
 *
*/
MenuRenderer.prototype.registerMenuOptionMouseOverHandler = function(callbackListMethod)
{
    this.m_menuOptionMouseOver_callbackList.addCallback(callbackListMethod);
}


/**
 * Register menu option mouse out handler
 *
*/

MenuRenderer.prototype.registerMenuOptionMouseOutHandler = function(callbackListMethod)
{
    this.m_menuOptionMouseOut_callbackList.addCallback(callbackListMethod);
}

/**
 * Register menu option mouse down handler
 *
*/

MenuRenderer.prototype.registerMenuOptionMouseDownHandler = function(callbackListMethod)
{
    this.m_menuOptionMouseDown_callbackList.addCallback(callbackListMethod);
}

/**
 * Register menu panel item mouse over handler
 *
*/

MenuRenderer.prototype.registerMenuPanelItemMouseOverHandler = function(callbackListMethod)
{
    this.m_menuPanelItemMouseOver_callbackList.addCallback(callbackListMethod);
}

/**
 * Register menu panel mouse out handler
 *
*/

MenuRenderer.prototype.registerMenuPanelMouseOutHandler = function(callbackListMethod)
{
    this.m_menuPanelMouseOut_callbackList.addCallback(callbackListMethod);
}

/**
 * Register callback function to check menu panel item represents
 * an action component that the current user is allowed access to.
 *
*/

MenuRenderer.prototype.registerCheckEnabledActionComponent = function(callbackListMethod)
{
    this.m_checkEnabledActionComponent_callbackList.addCallback(callbackListMethod);
}

/**
 * Register menu panel item mouse click handler
 *
*/

MenuRenderer.prototype.registerMenuPanelItemMouseClickHandler = function(callbackListMethod)
{
    this.m_menuPanelItemMouseClick_callbackList.addCallback(callbackListMethod);
}

/**
 * Methods that are invoked following events on the menu bar
 *
*/

MenuRenderer.prototype._handleMenuOptionMouseOver = function(evt)
{   
    evt = (evt) ? evt : ((event) ? event : null );
    
    var targetElement = SUPSEvent.getTargetElement(evt);
    
    if(targetElement.id == this.m_element.id)
    {
        this.m_menuOptionMouseOver_callbackList.invoke(evt);
    }
}

MenuRenderer.prototype._handleMenuOptionMouseOut = function(evt)
{
    evt = (evt) ? evt : ((event) ? event : null );
    
    var targetElement = SUPSEvent.getTargetElement(evt);
    
    if(targetElement.id == this.m_element.id)
    {
        this.m_menuOptionMouseOut_callbackList.invoke(evt);
    }
}

MenuRenderer.prototype._handleMenuOptionMouseDown = function(evt)
{
    
    evt = (evt) ? evt : ((event) ? event : null );
    
    var targetElement = SUPSEvent.getTargetElement(evt);
    
    if(null != targetElement)
    {
    
        if(targetElement.id == this.m_element.id)
        {
        
            // Genuine click on menu button
    
            if(!this.m_hasMouseCapture)
            {
        
                if(MenuRenderer.isIE)
                {
                    if(!this.m_mouseCaptureLost)
                    {
                        this._captureMouseEvents();
                        
                        //this.m_menuOptionMouseDown_callbackList.invoke(true);
                        this.m_menuOptionMouseDown_callbackList.invoke(null);
                    }
                    
                    SUPSEvent.stopPropagation(evt);
                }
                else if(MenuRenderer.isMoz)
                {
                    this._captureMouseEvents();
                    
                    //this.m_menuOptionMouseDown_callbackList.invoke(true);
                    this.m_menuOptionMouseDown_callbackList.invoke(null);
                }
        
            }
            else
            {
                // IE passes clicks on menu option here even though
                // mouse capture is active
                if(MenuRenderer.isIE)
                {
                    // Redirect to general mouse click handler
                    this._handleClickIE();
                }
        
            }
            
        }
        
    }
    
    // Flag mouse capture lost as false
    if(MenuRenderer.isIE)
    {
        this.m_mouseCaptureLost = false;
    }
    
}

/**
 * Methods to start event handlers on menu button
 *
*/

MenuRenderer.prototype.startMenuEventHandlers = function()
{
    this._startMenuButtonEventHandlers();
}

MenuRenderer.prototype._startMenuButtonEventHandlers = function()
{
    var thisObj = this;
    
    // Start with mouse over and mouse out handlers
    
    if(null == this.m_menuOptionMouseOverHandler)
    {
        this.m_menuOptionMouseOverHandler = SUPSEvent.addEventHandler( this.m_element,
                                                                       "mouseover",
                                                                       function(evt){ return thisObj._handleMenuOptionMouseOver(evt);});
    }
    
    if(null == this.m_menuOptionMouseOutHandler)
    {
        this.m_menuOptionMouseOutHandler = SUPSEvent.addEventHandler( this.m_element,
                                                                      "mouseout",
                                                                      function(evt){ return thisObj._handleMenuOptionMouseOut(evt);});
                                                                      
    }
    
    // Mouse down handler
    
    if(null == this.m_menuOptionMouseDownHandler)
    {
        this.m_menuOptionMouseDownHandler = SUPSEvent.addEventHandler( this.m_element,
                                                                       "click",
                                                                       function(evt){ return thisObj._handleMenuOptionMouseDown(evt);});
                                                                       
    }
    
}

/**
 * Methods to stop event handlers on menu button
 *
*/

MenuRenderer.prototype.stopMenuEventHandlers = function()
{
    this._stopMenuButtonEventHandlers();
}

MenuRenderer.prototype._stopMenuButtonEventHandlers = function()
{

    // Stop mouse over and mouse out handlers
    
    if(null != this.m_menuOptionMouseOverHandler)
    {
        SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseOverHandler);
        this.m_menuOptionMouseOverHandler = null;
    }
    
    if(null != this.m_menuOptionMouseOutHandler)
    {
        SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseOutHandler);
        this.m_menuOptionMouseOutHandler = null;
    }
    
    if(null != this.m_menuOptionMouseDownHandler)
    {
        SUPSEvent.removeEventHandlerKey(this.m_menuOptionMouseDownHandler);
        this.m_menuOptionMouseDownHandler = null;
    }

}

/**
 * Methods invoked by menu panel renderers following events
 * on menu panels
 *
*/

MenuRenderer.prototype.handleMenuPanelItemMouseOver = function(menuPanelId,
                                                               menuItemPos)
{
    this.m_menuPanelItemMouseOver_callbackList.invoke(menuPanelId, menuItemPos);
}

MenuRenderer.prototype.handleMenuPanelMouseOut = function(menuPanelId, targetMenuPanelId)
{
    this.m_menuPanelMouseOut_callbackList.invoke( menuPanelId, targetMenuPanelId );
}

/**
 * Method checks that the specified menu panel item is associated
 * with an action component that the current user is authorised 
 * to use.
 *
*/

MenuRenderer.prototype._checkEnabledActionComponent = function(menuPanelId, menuPanelItemPos)
{
    return this.m_checkEnabledActionComponent_callbackList.invokeSelectedCallbackMethod( 0, menuPanelId, menuPanelItemPos );
}

/**
 * Method handles mouse click over menu panel item. This method
 * is invoked as part of the general mouse click event capture
 * process when the menu is displayed.
 *
*/

MenuRenderer.prototype._handleMenuPanelItemMouseClick = function(menuPanelId, menuPanelItemPos)
{
    this.m_menuPanelItemMouseClick_callbackList.invoke(menuPanelId, menuPanelItemPos);
}

/**
 * Method handles a press of the return key. Key presses are initially
 * relayed to the MenuGUIAdaptor through the KeybindingProtocol. Usually
 * such events are handled by the MenuModel. However, the handling of
 * the return key is browser dependent. Therefore, the menu model
 * determines the associated menu panel and menu panel item and relays
 * the handling of the event back to the renderer.
 *
 * @param menuPanelId      The identifier of the active menu panel when the
 *                         return key was pressed.
 * @param menuPanelItemPos The position of the selected menu panel item when
 *                         the return key was pressed.
 *
*/
MenuRenderer.prototype.handleKeyReturn = function(menuPanelId, menuPanelItemPos)
{
    if(MenuRenderer.isIE)
    {
        this._handleKeyReturnIE(menuPanelId, menuPanelItemPos);
    }
    else if(MenuRenderer.isMoz)
    {
        this._handleKeyReturnMoz(menuPanelId, menuPanelItemPos);
    }
}

MenuRenderer.prototype._handleKeyReturnMoz = function( menuPanelId, menuPanelItemPos )
{
    // Remove general capture of mouse events
    this.removeMouseEventCapture();
    
    // Hide menu
    //this.m_menuOptionMouseDown_callbackList.invoke(false);
    this.m_menuOptionMouseDown_callbackList.invoke(null);
    
    // Perform related action. Use mouse click functionality.
    this._handleMenuPanelItemMouseClick( menuPanelId, menuPanelItemPos );
}

MenuRenderer.prototype._handleKeyReturnIE = function( menuPanelId, menuPanelItemPos )
{
    // Store details to be used in method _captureLostIE
    // Essentially treat press of return key in same manner as a click on a menu panel item
    this.m_clickOnMenuPanelItem = true;
    
    this.m_clickOnMenuPanelId = menuPanelId;
    this.m_clickOnMenuPanelItemPos = menuPanelItemPos;
    
    // Release capture of mouse events
    this.m_element.releaseCapture();
}
    

/**
 * Method causes mouse events to be captured when menu displayed
 *
*/

MenuRenderer.prototype._captureMouseEvents = function()
{
    var thisObj = this;
    var container = this.m_element;
    
    if(container.attachEvent)
    {
        
        if(null == this.m_clickEventKey)
        {
            container.setCapture(false);
        
            this.m_clickEventKey = SUPSEvent.addEventHandler( container, "click", function(){thisObj._handleClickIE();}, false);
            
            container.onlosecapture = function(){thisObj._captureLostIE(container); return false; };
            
            this.m_hasMouseCapture = true;
            
        }
                
    }
    else if(container.addEventListener)
    {
        if(null == this.m_clickEventKey)
        {
            this.m_clickEventKey = SUPSEvent.addEventHandler( window, "click", function(evt){thisObj._handleClickMoz(evt);}, true );
            
            this.m_hasMouseCapture = true;
        }
        
    }
    
}

/**
 * General event handlers for mouse clicks when menu displayed
 *
*/

MenuRenderer.prototype._handleClickMoz = function(evt)
{
    // Determine target element
    var e = evt.target;
    
    // Determine whether click was inside a menu panel or not
    var menuPanelId = this._clickInsideMenuPanel(e);
    
    if(null != menuPanelId)
    {
        // Determine menu item over which click occurred
        var cellElement = this._getCellElement(e);
        
        if(null != cellElement)
        {
            // Click on cell element. Determine menu panel item position
            var menuPanel = this.m_menuPanelLookup[menuPanelId];
            
            if(null != menuPanel)
            {
                var menuPanelItemPos = menuPanel.getMenuPanelItemPosFromId(cellElement.id);
                
                if(null != menuPanelItemPos)
                {
                
                    // Check for enabled action component
                
                    if(this._checkEnabledActionComponent(menuPanelId, menuPanelItemPos))
                    {
                        // Remove general event handler
                        if(null != this.m_clickEventKey)
                        {
                            SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);
                            this.m_clickEventKey = null;
            
                            this.m_hasMouseCapture = false;
            
                        }
            
                        // Close the menu
                        //this.m_menuOptionMouseDown_callbackList.invoke(false);
                        this.m_menuOptionMouseDown_callbackList.invoke(null);
            
                        // Invoke action
                        this._handleMenuPanelItemMouseClick(menuPanelId, menuPanelItemPos);
                        
                    }
                    
                }
                
            }
            
        } // End if if cellElement not null
        
    }
    else
    {
    
        // Remove general event handler
        if(null != this.m_clickEventKey)
        {
            SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);
            this.m_clickEventKey = null;
            
            this.m_hasMouseCapture = false;
            
        }
        
        var clickInsideMenuOption = false;
        
        if(e.id == this.m_element.id)
        {
            clickInsideMenuOption = true;
            
            // Stop event propagation
            SUPSEvent.stopPropagation(evt);
        }
        
        // Hide menu
        //this.m_menuOptionMouseDown_callbackList.invoke(clickInsideMenuOption);
        this.m_menuOptionMouseDown_callbackList.invoke(null);
        
    }
    
}

MenuRenderer.prototype._handleClickIE = function()
{
    var event = window.event;
    
    var e = event.srcElement;
    
    // Determine whether click was inside a menu panel or not
    var menuPanelId = this._clickInsideMenuPanel(e);
    
    if(null != menuPanelId)
    {
        var cellElement = this._getCellElement(e);
        
        if(null != cellElement)
        {
        
            // Click on cell element. Determine menu item position
            var menuPanel = this.m_menuPanelLookup[menuPanelId];
            
            if(null != menuPanel)
            {
            
                var menuPanelItemPos = menuPanel.getMenuPanelItemPosFromId(cellElement.id);
                
                if(null != menuPanelItemPos)
                {
                
                    // Check for enabled action component
                    if(this._checkEnabledActionComponent(menuPanelId, menuPanelItemPos))
                    {
                        // Click on menu panel item
                        this.m_clickOnMenuPanelItem = true;
            
                        // Store details of clicked menu item
                        this.m_clickOnMenuPanelId = menuPanelId;
                        this.m_clickOnMenuPanelItemPos = menuPanelItemPos;
            
                        // Release capture
                        this.m_element.releaseCapture();
            
                    }
                    
                }
                
            }
            
        } // End of if cellElement not null
        
    }
    else    
    {
        // Click outside menu panel
        this.m_clickOnMenuPanelItem = false;
        
        // Store details of click event
        this.m_lastClickEventSrcElement = e;
        
        // Release capture
        this.m_element.releaseCapture();
    }
    
}

MenuRenderer.prototype._captureLostIE = function()
{
    if(null != this.m_clickEventKey)
    {
        SUPSEvent.removeEventHandlerKey( this.m_clickEventKey );
        this.m_clickEventKey = null;
        
        this.m_hasMouseCapture = false;
    }
    
    if(null != this.m_clickOnMenuPanelItem)
    {
    
        if(!this.m_clickOnMenuPanelItem)
        {
            // Click outside menu panel. Check location of click.
    
            var clickInsideMenuOption = false;
    
            if(null != this.m_lastClickEventSrcElement)
            {
                if(this.m_lastClickEventSrcElement.id == this.m_element.id)
                {
                    clickInsideMenuOption = true;
                    
                    this.m_mouseCaptureLost = true;
                }
        
                this.m_lastClickEventSrcElement = null;
        
            }
            else
            {
                // Capture lost owing to key event
                clickInsideMenuOption = null;
                
            }
    
            //this.m_menuOptionMouseDown_callbackList.invoke(clickInsideMenuOption);
            this.m_menuOptionMouseDown_callbackList.invoke(null);
            
        }
        else if(this.m_clickOnMenuPanelItem)
        {
            // Click on menu panel item. Hide menu.
            //this.m_menuOptionMouseDown_callbackList.invoke(false);
            this.m_menuOptionMouseDown_callbackList.invoke(null);
            
            // Invoke action
            
            this._handleMenuPanelItemMouseClick( this.m_clickOnMenuPanelId, this.m_clickOnMenuPanelItemPos);
            
            // Clean temporary storage
            this.m_clickOnMenuPanelId = null;
            this.m_clickOnMenuPanelItemPos = null;
            
        }
        
        // Clean flag indicating location of click
        this.m_clickOnMenuPanelItem = null;
        
    }
    else
    {
        // If get here instance member m_clickOnMenuPanelItem is null
        //this.m_menuOptionMouseDown_callbackList.invoke(false);
        this.m_menuOptionMouseDown_callbackList.invoke(null);
    }
            
    // Clean lose capture property
    
    this.m_element.onlosecapture = null;
    
}

/**
 * Remove event handler used to handle mouse events whilst
 * menu is displayed.
 *
*/
MenuRenderer.prototype.removeMouseEventCapture = function()
{
    // Remove general event handler
    if(null != this.m_clickEventKey)
    {
        SUPSEvent.removeEventHandlerKey(this.m_clickEventKey);
        this.m_clickEventKey = null;
            
        this.m_hasMouseCapture = false;        
    }
}

/**
 * Method investigates whether or not a mouse click occurred over a
 * menu panel division.
 *
 * @param targetElement The element which received the mouse click
 * @return Returns the menu panel id if click over menu panel or null
 *
*/

MenuRenderer.prototype._clickInsideMenuPanel = function(targetElement)
{
    var menuPanelId = null;
    
    // First check class name of target element
    var exceptionOccurred = false;
    
    try
    {
        if(targetElement.className == MenuPanelRenderer.MENU_PANEL_DIV_CSS_CLASS)
        {
            menuPanelId = targetElement.id;
        }
        
    }
    catch(ex)
    {
        // Attempting to retrieve class from protected element
        exceptionOccurred = true;
    }
    
    if(!exceptionOccurred)
    {
        if(null == menuPanelId)
        {
            // Check for click on element inside menu panel div
            menuPanelId = MenuPanelRenderer.getParentMenuPanelId(targetElement);
        }
    }
    
    // Return menu panel id
    return menuPanelId;
    
}

/**
 * Method returns reference to menu panel item table cell from mouse
 * click target. Mouse click must have occurred over a menu panel.
 *
*/

MenuRenderer.prototype._getCellElement = function(targetElement)
{
    var cellElement = null;
        
    if(targetElement.tagName == MenuPanelRenderer.CELL_TAG_NAME)
    {
        cellElement = targetElement;
    }
    else if(targetElement.tagName == MenuPanelRenderer.DIV_TAG_NAME)
    {
        var parentElement = targetElement.parentNode;
            
        if(parentElement.tagName == MenuPanelRenderer.CELL_TAG_NAME)
        {
            cellElement = parentElement;
        }
    }
    
    return cellElement;
    
}

/**
 * Method sets class on menu panel item following selection or
 * deselection
 *
*/

MenuRenderer.prototype.setMenuPanelItemClass = function( menuPanelId,
                                                         menuItemPos,
                                                         className )
{
    // Retrieve reference to appropriate menu panel renderer
    var menuPanel = this.m_menuPanelLookup[menuPanelId];
    
    if(null != menuPanel)
    {
        menuPanel.setMenuPanelItemClass( menuItemPos, className );
    }
    
}

/**
 * Method handles loss of focus when menu displayed. This
 * will occur when a user tabs away from a menu onto another
 * component.
 *
*/
MenuRenderer.prototype.handleLostFocusWhilstDisplayed = function()
{
    if(MenuRenderer.isIE)
    {
        this._handleLostFocusWhilstDisplayedIE();
    }
    else if(MenuRenderer.isMoz)
    {
        this._handleLostFocusWhilstDisplayedMoz();
    }
}

/**
 * Mozilla specific handler for loss of focus
 *
*/
MenuRenderer.prototype._handleLostFocusWhilstDisplayedMoz = function()
{
    if(null != this.m_clickEventKey)
    {
        SUPSEvent.removeEventHandlerKey(this.m_clickEventKey)
        this.m_clickEventKey = null;
        
        this.m_hasMouseCapture = false;
    }
    
    this.m_menuOptionMouseDown_callbackList.invoke(null);
}

/**
 * IE specific handler for loss of focus
 *
*/
MenuRenderer.prototype._handleLostFocusWhilstDisplayedIE = function()
{
    this.m_clickOnMenuPanelItem = false;
    
    // Set last click event source element to null to
    // indicate closure not caused by click event
    this.m_lastClickEventSrcElement = null;
    
    // Release capture
    this.m_element.releaseCapture();
}

        
        
                                   
 
  

