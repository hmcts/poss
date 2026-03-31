/**
 * MenuGUIAdaptor.js
 *
 * The MenuGUIAdaptor relays events bewteen a menu component
 * and its associated menu model.
 *
*/
function MenuGUIAdaptor() {};

/**
 * MenuGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 *
*/
MenuGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
MenuGUIAdaptor.prototype.constructor = MenuGUIAdaptor;

/**
 * Add required prototcols
 *
 */
GUIAdaptor._setUpProtocols( 'MenuGUIAdaptor' );
GUIAdaptor._addProtocol( 'MenuGUIAdaptor', 'FocusProtocol' );
GUIAdaptor._addProtocol( 'MenuGUIAdaptor', 'FocusProtocolHTMLImpl' );
GUIAdaptor._addProtocol( 'MenuGUIAdaptor', 'KeybindingProtocol' );
GUIAdaptor._addProtocol( 'MenuGUIAdaptor', 'EnablementProtocol' );

/**
 * Define logging category
 *
*/
MenuGUIAdaptor.m_logger = new Category( "MenuGUIAdaptor" );

/**
 * Class variable indicating current browser
 *
*/
MenuGUIAdaptor.isIE = (document.attachEvent != null);


/**
 * Instance variable storing reference to menu model
 *
 */
MenuGUIAdaptor.prototype.m_menuModel = null;

/**
 * Set the default tabIndex so that it will not
 * be the first focused adaptor
 */
MenuGUIAdaptor.prototype.tabIndex = -1;

/**
 * Flag used to record whether or not short cut key combination
 * is currently being pressed down. Currently used by IE only as
 * Mozilla works in a different manner.
 *
*/
MenuGUIAdaptor.prototype.m_shortCutKeyPressed = false;

/**
 * Reference to key component of menu short cut key
 *
*/
MenuGUIAdaptor.prototype.m_keyObj = null;

/**
 * Handler for keyup events
 *
*/
MenuGUIAdaptor.prototype.m_keyUpEventHandler = null;

/**
 * Create an instance of MenuGUIAdaptor
 *
 * @param element The HTML div element representing the menu button
 * @return An instance of the class MenuGUIAdaptor
 *
 */
MenuGUIAdaptor.create = function(element)
{   
    var a = new MenuGUIAdaptor();
    
    // Initialise adaptor
    a._initialiseAdaptor(element);
    return a;
}

/**
 * Initialise instance of MenuGUIAdaptor
 *
 *  @param element The HTML div element representing the menu button
 *
*/

MenuGUIAdaptor.prototype._initialiseAdaptor = function(element)
{
	// Call parent class initialisation
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, element);
	
	// Create instance of MenuModel
	this.m_menuModel = new MenuModel( this );

	this.m_keyBindings = new Array();

}

MenuGUIAdaptor.prototype._dispose = function()
{
	var i;
	
	this.m_renderer._dispose();
	this.m_menuModel._dispose();
	
	var bindingsLength = this.m_keyBindings.length;
	
	if(bindingsLength > 0)
	{
	    if(MenuGUIAdaptor.isIE)
        {
            SUPSEvent.removeEventHandlerKey(this.m_keyUpEventHandler);
            this.m_keyUpEventHandler = null;
        }
	
	    for (i = 0; i < bindingsLength; i++)
		    this.m_keyBindings[i].dispose();
	}
	
	if(null != this.m_shortCutKeyConfig)
	{
		for (i in this.m_shortCutKeyConfig)
			this.m_shortCutKeyConfig[i] = null;
		
		this.m_shortCutKeyConfig = null;
	}
	
	if(null != this.m_keyObj) this.m_keyObj = null;

}


MenuGUIAdaptor.prototype._configure = function(cs)
{
	// Register event handler functions with renderer
	this._registerMenuButtonEventHandlers();
	this._registerMenuPanelEventHandlers();
    
	// Register authorisation function
	this._registerCheckEnabledActionComponent();
    
	this.m_renderer.startMenuEventHandlers();
	
	// Need to add isEnabled configuration so that normal
	// enablement protocol can work correctly.
	this.isEnabled = function()
	{
		return true;	
	}	
	
	// Loop through configs and get out quickLinks (if they are there) and menu button key binding.
	for (var i=0; i < cs.length; i++)
	{
		if (null != cs[i].quickLinks)
		{
			this.m_quickLinksConfig = cs[i].quickLinks;	
		}
		
		if (null != cs[i].eventBinding)
		{
			// Only use the first key binding in the keys array
			this.m_shortCutKeyConfig = cs[i].eventBinding.keys[0];
		}
	}

	this.m_quickLinksEnabled = new Array();	
	
	if (this.m_quickLinksConfig)
	{
		for (var i=0; i < this.m_quickLinksConfig.length; i++)
		{
			this.m_quickLinksEnabled[this.m_quickLinksConfig[i].id] = true;
		}	
	}
	
	// Configure short cut key
	var shortCutKeyConfig = this.m_shortCutKeyConfig;
	
	if(null != shortCutKeyConfig)
	{
	    var keyCode = shortCutKeyConfig.key.m_keyCode;
	    var adaptor;
	    
	    // Create new key definition
	    this.m_keyObj = new Key( keyCode );
	    
	    // Create the new qualifiers definition
	    var qualObj = new Object();
	    qualObj.ctrl = (shortCutKeyConfig.ctrl == true) ? true : false;
	    qualObj.alt = (shortCutKeyConfig.alt == true) ? true : false;
	    qualObj.shift = (shortCutKeyConfig.shift == true) ? true : false;
	    
	    if(null == shortCutKeyConfig.element)
	    {
	    	// Use form adaptor by default when key binding element not defined
	    	adaptor = FormController.getInstance().getFormAdaptor();
	    }
	    else
	    {
	    	adaptor = FormController.getInstance().getAdaptorById(shortCutKeyConfig.element);
	   	}
	    
	    // Set up key binding
	    this.m_keyBindings[0] = new ElementKeyBindings( adaptor );
	    
	    var thisObj = this;
	    this.m_keyBindings[0].bindKey( this.m_keyObj,
	                                   function() { thisObj._handleShortcutKey(); },
	                                   qualObj );
	    
	    if(MenuGUIAdaptor.isIE)
	    {
	        // For IE check for release of short cut key
	        this.m_keyUpEventHandler = SUPSEvent.addEventHandler( this.m_element,
	                                                              "keyup",
	                                                              function(evt){return thisObj._handleKeyUpEvent(evt);} );
	    }
	}
	
}


MenuGUIAdaptor.prototype.renderState = function()
{
    
    if(this.m_focusChanged)
    {
        this.m_focusChanged = false;
        
        // This is an adaptor specific solution to a problem
        // that needs a more generic solution
        if(this.m_focus)
        {
            if(MenuGUIAdaptor.isIE)
            {
                // For IE force focus on menu
                this.m_element.focus();
            }
                
        }
        
    }
    
    // Instruct model to redraw menu button
    this.m_menuModel.renderState();

}


/**
 * Register event handling functions with renderer
 *
 */
MenuGUIAdaptor.prototype._registerMenuButtonEventHandlers = function()
{
	var thisObj = this;
	var renderer = this.m_renderer;
    
	renderer.registerMenuOptionMouseOverHandler( function(evt){thisObj._handleMenuOptionMouseOver(evt)});
	renderer.registerMenuOptionMouseOutHandler( function(evt){thisObj._handleMenuOptionMouseOut(evt)});
	renderer.registerMenuOptionMouseDownHandler( function(clickInsideMenuOption){thisObj._handleMenuOptionMouseDown(clickInsideMenuOption)});
}

MenuGUIAdaptor.prototype._registerMenuPanelEventHandlers = function()
{
	var thisObj = this;
	var renderer = this.m_renderer;
    
	renderer.registerMenuPanelItemMouseOverHandler( function(menuPanelId, menuItemPos){ thisObj._handleMenuPanelItemMouseOver(menuPanelId, menuItemPos);});
	renderer.registerMenuPanelMouseOutHandler( function(menuPanelId, targetMenuPanelId){ thisObj._handleMenuPanelMouseOut( menuPanelId, targetMenuPanelId );});
	renderer.registerMenuPanelItemMouseClickHandler( function(menuPanelId, menuPanelItemPos){ thisObj._handleMenuPanelItemMouseClick( menuPanelId, menuPanelItemPos );});
}


/**
 * Register menu panel item component access function
 *
*/
MenuGUIAdaptor.prototype._registerCheckEnabledActionComponent = function()
{
    var thisObj = this;
    
    var renderer = this.m_renderer;
    
    renderer.registerCheckEnabledActionComponent( function(menuPanelId, menuPanelItemPos){ return thisObj._checkEnabledActionComponent( menuPanelId, menuPanelItemPos );});
}

/**
 * Methods which handle events from MenuBarRenderer
 *
*/
MenuGUIAdaptor.prototype._handleMenuOptionMouseOver = function(evt)
{
    // Relay event handling to menu model
    this.m_menuModel.handleMenuOptionMouseOver(evt);
}


MenuGUIAdaptor.prototype._handleMenuOptionMouseOut = function(evt)
{
    // Relay event handling to menu model
    this.m_menuModel.handleMenuOptionMouseOut(evt);
}


MenuGUIAdaptor.prototype._handleMenuOptionMouseDown = function(clickInsideMenuOption)
{   
    // Relay event handling to menu model
    this.m_menuModel.handleMenuOptionMouseDown(clickInsideMenuOption);
}


/**
 * Methods which handle events from the menu panels
 * routed via the renderer
 *
*/
MenuGUIAdaptor.prototype._handleMenuPanelItemMouseOver = function(
	menuPanelId,
	menuItemPos
)
{
	this.m_menuModel.handleMenuPanelItemMouseOver( menuPanelId, menuItemPos );
}


MenuGUIAdaptor.prototype._handleMenuPanelMouseOut = function(
	menuPanelId,
	targetMenuPanelId
)
{
	this.m_menuModel.handleMenuPanelMouseOut( menuPanelId, targetMenuPanelId );
}


/**
 * Method handles click on menu panel item
 *
 */
MenuGUIAdaptor.prototype._handleMenuPanelItemMouseClick = function(
	menuPanelId,
	menuPanelItemPos
)
{
    this.m_menuModel.handleMenuPanelItemMouseClick(menuPanelId, menuPanelItemPos);
}


/**
 * Method handles requests for user access to menu panel item components
 *
 */
MenuGUIAdaptor.prototype._checkEnabledActionComponent = function(
	menuPanelId,
	menuPanelItemPos
)
{
    return this.m_menuModel.checkEnabledActionComponent( menuPanelId, menuPanelItemPos );
}


/**
 *  Overrides the parent function as each listener needs a detail
 *  object to refer to a particular quick link. 
 */
MenuGUIAdaptor.prototype.getListenersForEnablementProtocol = function()
{
    var listenerArray = new Array();
	// For each quicklink item register listener.	
	if (!this.m_quickLinksConfig)
	{
		return listenerArray;
	}
	
	var dm = FormController.getInstance().getDataModel();
	var currentEnableOn;
	
	// For each quicklink loop through the enableOn array
	// and register a datamodel listener.	
	for (var i=0; i < this.m_quickLinksConfig.length; i++)
	{
		currentEnableOn = this.m_quickLinksConfig[i].enableOn;
		if (currentEnableOn == null)
		{
			continue;	
		} 
		for (var j=0; j < currentEnableOn.length; j++)
		{
            var listener = FormControllerListener.create(this,  
                                                      FormController.ENABLEMENT,  
                                                      this.m_quickLinksConfig[i].id)
                                                      
            listenerArray.push({xpath: currentEnableOn[j], listener: listener});
		}
	}	
    
    return listenerArray;
}


/*
 * Overrides the standard setEnabled to instead set the state of
 * an individual item on the quicklinks menu.
 */
MenuGUIAdaptor.prototype.setEnabled = function(value, listener)
{
	
	if (!this.m_quickLinksConfig)
	{
		return;	
	}
    
    // If there is no listener then just do all of the 
    // links (this is probably initialisation)
    if (!listener)    
    {
		for (var i=0; i < this.m_quickLinksConfig.length; i++)
		{
		    if(null != this.m_quickLinksConfig[i].isEnabled)
		    {
			    this.m_quickLinksEnabled[this.m_quickLinksConfig[i].id] = this.m_quickLinksConfig[i].isEnabled();
			}
			else
			{
			    this.m_quickLinksEnabled[quickLinkId] = true;
			}
		}	
        
        return;
    }
    
    
	// The listener will  tell us which quick link this
	// corresponds to.
	var quickLinkId = listener.m_detail;
	
	// Need to invoke isEnabled function for the particular quick link.
	for (var i=0; i < this.m_quickLinksConfig.length; i++)
	{
		if (this.m_quickLinksConfig[i].id == quickLinkId)
		{
			this.m_quickLinksEnabled[quickLinkId] = this.m_quickLinksConfig[i].isEnabled();
		}
	}	
}

/**
 *
 * Override general setFocus method to enable menu to be hidden
 * following a user tabbing off the menu when it is displayed
 *
 * Change the elements focus state
 *
 * @param f if true render the component as focussed, if false render the
 *   component as unfocussed.
 * @param wasClick Specifies whether focus was achieved by user clicking 
 *        on component (true) or moving onto component using tab key (false).
 *        To many components this value will not be of importance. However,
 *        in certain cases the TabSelectorGUIAdaptor has to implement
 *        different behaviours depending on how focus was achieved. This
 *        value is used only when focus is set not lost.
 * @return true if the GUI component's focus changed, or false otherwise
 * @type boolean
 */
MenuGUIAdaptor.prototype.setFocus = function(f,wasClick)
{
	if(MenuGUIAdaptor.m_logger.isDebug()) MenuGUIAdaptor.m_logger.debug("MenuGUIAdaptor.setFocus() adaptor " + this.getId() + ", focus = " + f);
	var r = false;
	if(f != this.m_focus)
	{
		this.m_focus = f;
		
		// Toggle focus change flag
		this.m_focusChanged = true;
		
		r = true;
		
		if(!this.m_focus)
		{
		    this.m_menuModel.handleLostFocusWhilstDisplayed();
		    
		    if(this.m_shortCutKeyPressed)
		    {
		        this.m_shortCutKeyPressed = false;
		    }
		}
	}
	else
	{
		this.m_focusChanged = false;
	}
	return r;
}


/**
 * Returns whether the selected quicklink is currently enabled.
 */
MenuGUIAdaptor.prototype.quickLinkEnabled = function(quickLinkId)
{
	return this.m_quickLinksEnabled[ quickLinkId ]; 
}

/**
 * Method handles press of arrow up key while adaptor has focus
 *
*/
MenuGUIAdaptor.prototype._handleKeyUp = function()
{
    this.m_menuModel.handleKeyUp();
}

/**
 * Method handles press of arrow down key while adaptor has focus
 *
*/
MenuGUIAdaptor.prototype._handleKeyDown = function()
{
    this.m_menuModel.handleKeyDown();
}

/**
 * Method handles press of left arrow key while adaptor has focus
 *
*/
MenuGUIAdaptor.prototype._handleKeyLeft = function()
{
    this.m_menuModel.handleKeyLeft();
}

/**
 * Method handles press of right arrow key while adaptor has focus
 *
*/
MenuGUIAdaptor.prototype._handleKeyRight = function()
{
    this.m_menuModel.handleKeyRight();
}

/**
 * Method handles press of return key while adaptor has focus
 *
*/
MenuGUIAdaptor.prototype._handleKeyReturn = function()
{
    this.m_menuModel.handleKeyReturn();
}

/**
 * Method handles press of short cut key
 *
*/
MenuGUIAdaptor.prototype._handleShortcutKey = function()
{
    if(MenuGUIAdaptor.isIE)
    {
        //if(this.m_keyBindings.length > 0)
        //{
            if(!this.m_shortCutKeyPressed)
            {
                this.m_shortCutKeyPressed = true;
                
                this.m_menuModel.handleShortcutKey();
            }
        //}
        //else
        //{
        //    this.m_menuModel.handleShortCutKey();
        //}
    }
    else
    {
	    this.m_menuModel.handleShortcutKey();
	}
}

/**
 * Method handles key up event. This is required to halt
 * flickering display of menu when short cut key is held
 * down.
 *
*/
MenuGUIAdaptor.prototype._handleKeyUpEvent = function(evt)
{
    if(this.m_shortCutKeyPressed)
    {
        evt = (evt) ? evt : ((event) ? event : null );
        
        var kc = evt.keyCode;
        
        if(kc == this.m_keyObj.m_keyCode)
        {
            this.m_shortCutKeyPressed = false;
        }
    }
    
}

MenuGUIAdaptor.prototype.keyBindings =
[
    {key: Key.ArrowUp, action: MenuGUIAdaptor.prototype._handleKeyUp},
    {key: Key.ArrowDown, action: MenuGUIAdaptor.prototype._handleKeyDown},
    {key: Key.ArrowLeft, action: MenuGUIAdaptor.prototype._handleKeyLeft},
    {key: Key.ArrowRight, action: MenuGUIAdaptor.prototype._handleKeyRight},
    {key: Key.Return, action: MenuGUIAdaptor.prototype._handleKeyReturn}
];






