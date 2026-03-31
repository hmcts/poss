/*
 * Class renders the menu bar at the top of a form.
 *
*/

// Determine current browser in use
 
switch(navigator.appName)
{
	case "Netscape":
	{
		MenuBarRenderer.isIE = false;
		MenuBarRenderer.isMoz = true;
		break;
	}
	
	case "Microsoft Internet Explorer":
	{
		MenuBarRenderer.isIE = true;
		MenuBarRenderer.isMoz = false;
		break;
	}
	
	default:
	{
		alert("Unknown browser type");
	    break;
	}
	
}

function MenuBarRenderer()
{
}


/**
 * MenuBarRenderer is a sub class of Renderer
 */
MenuBarRenderer.prototype = new Renderer();
MenuBarRenderer.prototype.constructor = MenuBarRenderer;

/*
 * CSS class name definitions
 *
*/

MenuBarRenderer.MENU_BASE_DIV = "MenuBaseDiv";
MenuBarRenderer.MENU_BAR_DIV = "MenuBarDiv";
MenuBarRenderer.MENU_PANEL_DIV = "MenuPanelDiv";
MenuBarRenderer.MENU_BAR_BUTTON_DIV = "MenuBarButtonDiv";

/*
 * Class constants
 *
*/

MenuBarRenderer.DEFAULT_MENUBAR_ID = "menubar";
MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX = "_navigationmenu";
MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX = "_quicklinksmenu";
MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON = "_quicklinkhiddenbutton";
/*
MenuBarRenderer.MENU_BASE_DIV_ID = "MenuBaseDivId";
MenuBarRenderer.MENU_BAR_DIV_ID = "MenuBarDivId";
MenuBarRenderer.MENU_OPTION_DIV_ID = "MenuOptionDivId";
*/
MenuBarRenderer.m_logger = new Category( "MenuBarRenderer" );

/**
 * Instance variables
 *
*/

/**
 * References to menu bar components
 *
 * Menu bar division
 *
*/

MenuBarRenderer.prototype.m_menuBar = null;

/**
 * Navigation menu
 *
*/

MenuBarRenderer.prototype.m_navigationMenu = null;

/**
 * Array storing references to quick link buttons
 *
*/

MenuBarRenderer.prototype.m_quickLinkButtons = null;

/**
 * Reference to quick links menu
 *
*/
MenuBarRenderer.prototype.m_quickLinksMenu = null;

/**
 * Create a menu bar at the current location in the document while document
 * is parsing.
 *
 * Method createInline renders the basic menu bar. This comprises the
 * menu option, quick links and , if required, the quick links extension
 * menu button. Further components of the menu, that is menu panels,
 * will be rendered as required on a lazy initialisation basis.
 *
 * @param id the id of the menu bar being created. If not specified this defaults
 * to menubar.
 */

MenuBarRenderer.createInline = function(id)
{
	// If id no specified, then use the default 
	if(id == null || id == "")
	{
		id = MenuBarRenderer.DEFAULT_MENUBAR_ID;
	}

	// Create the outer div by writing to the document
	var e = Renderer.createInline(
		id,			// The id of the menu bar being created
		false		// The menu bar has an internal input element which can accept focus, so the div should not accept focus
	);

	return MenuBarRenderer._create(e);
}

/**
 * Create a menu bar in the document relative to the supplied element.
 *
 * Method createAsInnerHTML renders the basic menu bar. This comprises the
 * menu option, quick links and , if required, the quick links extension
 * menu button. Further components of the menu, that is menu panels,
 * will be rendered as required on a lazy initialisation basis.
 *
 * @param refElement the element relative to which the menu bar should be rendered
 * @param relativePos the relative position of the menu bar to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"
 * @param id the id of the menu bar being created. If not specified this defaults
 * to menubar.
 */

MenuBarRenderer.createAsInnerHTML = function(refElement, relativePos, id)
{
	// If id no specified, then use the default 
	if(id == null || id == "")
	{
		id = MenuBarRenderer.DEFAULT_MENUBAR_ID;
	}

	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the menu bar being created
		false			// The menu bar has an internal input element which can accept focus, so the div should not accept focus
	);

	return MenuBarRenderer._create(e);
}

/**
 * Create a menu bar as a child of another element
 *
 * Method createAsChild renders the basic menu bar. This comprises the
 * menu option, quick links and , if required, the quick links extension
 * menu button. Further components of the menu, that is menu panels,
 * will be rendered as required on a lazy initialisation basis.
 *
 * @param p the parent element to which the menu bar should be added
 * @param id the id of the menu bar being created. If not specified this defaults
 * to menubar.
 */

MenuBarRenderer.createAsChild = function(p, id)
{
	// If id no specified, then use the default 
	if(id == null || id == "")
	{
		id = MenuBarRenderer.DEFAULT_MENUBAR_ID;
	}

	var e = Renderer.createAsChild(id);

	// Append the menu bar's outer div to it's parent element
	p.appendChild(e);	

	return MenuBarRenderer._create(e);
}

/**
 * Method _create creates the basic elements that comprise the
 * menu bar.
 *
 * @param element Reference to HTML div element that encompasses menu
 *
*/

MenuBarRenderer._create = function( element )
{
    if(MenuBarRenderer.m_logger.isError())MenuBarRenderer.m_logger.error("Creating MenuBarRenderer");

    // Set class on base element
    element.className = MenuBarRenderer.MENU_BASE_DIV;

    // Create menu bar renderer instance
    var mbr = new MenuBarRenderer();
    
	// Initialise sets main element and the reference to the renderer in the dom
	mbr._initRenderer(element);	
    
    // Create menu bar
    mbr.m_menuBar = document.createElement( "div" );
    mbr.m_menuBar.className = MenuBarRenderer.MENU_BAR_DIV;
    element.appendChild( mbr.m_menuBar );
    
    // Navigation menu button is created when the adaptor is initialised
    mbr.m_navigationMenu = null;
    
	// Create division to contain menu buttons
	mbr.m_quickLinksContainer = document.createElement( "div" );
	mbr.m_quickLinksContainer.className = MenuBarRenderer.MENU_BAR_BUTTON_DIV;
	mbr.m_menuBar.appendChild(mbr.m_quickLinksContainer);

	// E348 - The quick link buttons are rendered during the menu bar adaptor's
	// configuration. The divs get resized, causing the menu button text to move.
	// (NB: Setting the height of the divs in the style sheet doesn't prevent this
	// effect.) Add a hidden button so the div is rendered at the correct height.
	var button = document.createElement( "input" );
	button.id = element.id + MenuBarRenderer.QUICK_LINK_HIDDEN_BUTTON;
	button.type = "button";
	button.style.width = "0px";
	button.style.visibility = "hidden";
	mbr.m_quickLinksContainer.appendChild(button);

    // Prevent selection of menu text
    preventSelection(element);
    
    return mbr;
}

MenuBarRenderer.prototype._dispose = function()
{
	// Remove select prevention event handler.
	unPreventSelection(this.m_element);
    
    // Set references to null
    this.m_quickLinksMenu = null;
    this.m_quickLinkButtons = null;
    this.m_navigationMenu = null;
    this.m_menuBar = null;
    
    this.m_element.__renderer = null;
    this.m_element = null;
}

/**
 * Method renders navigation menu button on menu bar
 *
 * @param navigationButtonLabel Label for the navigation menu button.
 *								If not defined then a default of "Menu" is used.
*/
MenuBarRenderer.prototype.renderNavigationMenuButton = function(navigationButtonLabel)
{
    var navigationMenuId = this.m_element.id + MenuBarRenderer.NAVIGATION_MENU_ID_SUFFIX;
    
	if(null == navigationButtonLabel)
	{
		navigationButtonLabel = "Menu";
	}
    
    this.m_navigationMenu = MenuRenderer.createAsInnerHTML( this.m_quickLinksContainer,
                                                        	Renderer.BEFORE_ELEMENT,
                                                        	navigationMenuId, 
                                                        	navigationButtonLabel,
                                                        	true,
                                                        	MenuDataSourceFactory.NAVIGATION_MENU,
                                                        	true );
}

/**
 * Method renders quick links on menu bar
 *
 * @param quickLinkButtons Array of quick link buttons
 * @param quickLinkMenuItems Array of quick link menu items
 * @param quickLinkMenuButtonLabel Label for the quick links menu button.
 *								   If not defined then a default of ">>" is used.
*/
MenuBarRenderer.prototype.renderQuickLinks = function(
	quickLinkButtons,
    quickLinkMenuItems,
    quickLinkMenuButtonLabel
)
{
    var quickLinkButtonsLength = quickLinkButtons.length;
    var quicklinkMenuItemsLength = quickLinkMenuItems.length;
    
    if( quickLinkButtonsLength > 0 )
    {       
        // Create buttons
        var i;
        var button;
        var quickLinkButton;
        
        this.m_quickLinksButtons = new Array();
        
        for( i = 0; i < quickLinkButtonsLength; i++ )
        {
            quickLinkButton = quickLinkButtons[i];
            
            button = document.createElement("input");
            button.type = "button";
            button.id = quickLinkButton.id;
            button.value = quickLinkButton.label;
           
            this.m_quickLinksContainer.appendChild( button );
            this.m_quickLinksButtons[ quickLinkButton.id ] = button;            
        }
    }
    
    if(quicklinkMenuItemsLength > 0 )
    {
        var quickLinksMenuId = this.m_element.id + MenuBarRenderer.QUICK_LINK_MENU_ID_SUFFIX;
        
        if(null == quickLinkMenuButtonLabel)
        {
            quickLinkMenuButtonLabel = ">>";
        }
        
        this.m_quickLinksMenu = MenuRenderer.createAsInnerHTML( this.m_quickLinksContainer,
                                                                Renderer.AFTER_ELEMENT,
                                                                quickLinksMenuId,
                                                                quickLinkMenuButtonLabel,
                                                                false,
                                                                MenuDataSourceFactory.QUICK_LINK_MENU,
                                                                false );
    }
}
