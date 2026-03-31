//==================================================================
//
// TabSelectorGUIAdaptor.js
//
// Class for implementing tabbed diaglouges for use in the
// framework
//
//==================================================================

/**
 * Base class for adapting DIV elements with a TabSelector class 
 * for use in the framework.
 *
 * @constructor
 * @private
 */
function TabSelectorGUIAdaptor(){};


TabSelectorGUIAdaptor.m_logger = new Category("TabSelectorGUIAdaptor");
 

/**
 * TabSelectorGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
TabSelectorGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
TabSelectorGUIAdaptor.prototype.constructor = TabSelectorGUIAdaptor;


/**
 * Add the required protocols to the TabSelectorGUIAdaptor
 */
GUIAdaptor._setUpProtocols('TabSelectorGUIAdaptor'); 
GUIAdaptor._addProtocol('TabSelectorGUIAdaptor', 'EnablementProtocol');             // Supports enablement
GUIAdaptor._addProtocol('TabSelectorGUIAdaptor', 'FocusProtocol');                  // Supports tabbing and focussing
GUIAdaptor._addProtocol('TabSelectorGUIAdaptor', 'FocusProtocolHTMLImpl');          // Include the default HTML implementation of focus
GUIAdaptor._addProtocol('TabSelectorGUIAdaptor', 'KeybindingProtocol');


/**
 * Holds the currently net enablement state of the adaptor. This takes
 * into account both enablement and activation protocols.
 *
 * @type boolean
 * @private
 */
TabSelectorGUIAdaptor.prototype.m_netEnablementState = true;




/**
 * Create a new TabSelectorGUIAdaptor
 *
 * @param e the checkbox input element to manage
 * @return the new TabSelectorGUIAdaptor
 * @type TabSelectorGUIAdaptor
 */
TabSelectorGUIAdaptor.create = function(element)
{
	if (TabSelectorGUIAdaptor.m_logger.isTrace()) TabSelectorGUIAdaptor.m_logger.trace("TabSelectorGUIAdaptor.create");

	var a = new TabSelectorGUIAdaptor();
	a._initialiseAdaptor(element);
	return a;
}

/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 */
TabSelectorGUIAdaptor.prototype._configure = function(cs)
{
	this.includeInValidation = false;
}

/**
 * Initialises the instance (called from creation)
 *
 * @param element the element to manage
 */
TabSelectorGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
	
	// Set tab click handler - overrides the temporary click handler set up by the renderer
	// which allows the tabbed area to function without any adaptors being created.
	var thisObj = this;
	this.m_renderer.setTabClickHandler( function(clickedTab) {thisObj._onTabClick(clickedTab);} );
	
	// Get id of pagedarea
	var pagedAreaId = this.m_renderer._getAssociatedPagedArea().id;
	
	// Copy enablement protocol configuration items from the pagedArea onto this adaptor
	// - saves application developers having to duplicate this configuration.
	var cm = FormController.getInstance().getFormView().getConfigManager();
	var cs = cm.getConfig(pagedAreaId);
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		if((null == this.isEnabled) && (null != c.isEnabled)) this.isEnabled = c.isEnabled;
		if((null == this.enableOn) && (null != c.enableOn)) this.enableOn= c.enableOn;
	}

	// Ensures that the bottom border of the spacer cell is wide enough
	this.m_renderer._setTabSelectorWidth();
}


/**
 * Disposes of all resources (event handlers and references to renderer)
 */
TabSelectorGUIAdaptor.prototype._dispose = function()
{
	this.m_renderer.dispose();	
	this.m_renderer = null;
	this.m_element = null;
}


/**
 * Renders the visual state and event handlers for this
 * adaptor based on its current state
 */
TabSelectorGUIAdaptor.prototype.renderState = function()
{
	if (renderStateChanged (this, this.m_netEnablementState))
	{
		this.m_netEnablementState = !this.m_netEnablementState;
		
		if(this.m_renderer.setEnabled(this.m_netEnablementState))
		{
			this.m_renderer.renderState();
		}
		
		this.m_enabledChanged = false;
	}
	
	if(this.m_focusChanged)
	{
		this.m_renderer.setFocus(this.m_focus);
		this.m_focusChanged = false;
	}
}


TabSelectorGUIAdaptor.prototype._getAssociatedPagedAreaGUIAdaptor = function()
{
	if(null == this.m_associatedPagedArea)
	{
		// Get the paged area associated with the tab selector
		var pagedAreaDiv = this.m_renderer._getAssociatedPagedArea();
		
		if(null == pagedAreaDiv)
		{
			throw new ConfigurationException("TabSelector '" + this.getId() + "' failed to find associated PagedArea div element");
		}

		this.m_associatedPagedArea = Services.getAdaptorById(pagedAreaDiv.id);
		
		if(null == this.m_associatedPagedArea)
		{
			throw new ConfigurationException("TabSelector '" + this.getId() + "' failed to find associated PagedAreaGUIAdaptor '" + pagedAreaDiv.id + "'");
		}
	}
	
	// If the focus changed, then if there is a currently selected tab update it's focussed state appropriately.
	if(this.m_focusChanged)
	{
		var tab = this.m_renderer.getCurrentlySelectedTab();
		if(null != tab)
		{
			if(tab.setFocus(this.m_focus))
			{
				tab.renderState();
			};
		}
	
		this.m_focusChanged = false;
	}
	
	return this.m_associatedPagedArea;
}


TabSelectorGUIAdaptor.prototype._onTabClick = function(clickedTab)
{
	// Get the PagedAreaGUIAdaptor for the PagedArea associated with this TabSelector
	var pagedArea = this._getAssociatedPagedAreaGUIAdaptor();
	
	// Show the page with the associated page
	pagedArea.showPage(clickedTab.getPageId());
}


/**
 * Handle enablement state change for the pagedArea's pages
 *
 * @param pageId the id of the page whose enablement state has changed.
 * @param enabled true if the page is enabled or false if it is disabled
 */
TabSelectorGUIAdaptor.prototype._handlePagedAreaEnablementChanged = function(pageId, enabled)
{
	// One of the pages has changed it's enablement state
	// Get the tab associated with the page
	var tab = this.m_renderer._getTabForPageId(pageId);

	// Not all pages are required to have tabs!
	if(null != tab)
	{
		this.m_renderer.setTabEnablementState(tab, enabled);
	}
}


TabSelectorGUIAdaptor.prototype._handlePagedAreaVisibilityChanged = function(pageId, visible)
{
	var tab = this.m_renderer._getTabForPageId(pageId);

	// Not all pages are required to have tabs!
	if(null != tab)
	{
		this.m_renderer.setTabSelectionState(tab, visible);
	}
}


TabSelectorGUIAdaptor.prototype._handlePagedAreaLabelChanged = function(pageId, label)
{
	var tab = this.m_renderer._getTabForPageId(pageId);

	if(null != tab)
	{
		this.m_renderer.setTabLabel(tab, label)
	}
}


/**
 * Method overridden from FocusProtocol. Can't accept the focus if
 * we don't have any enabled tabs
 *
 * @return true if the component can accept the focus or false to refuse it
 * @type boolean
 */
TabSelectorGUIAdaptor.prototype.acceptFocus = function()
{
	return !this._getAllTabsDisabled();
}


/**
 * Checks whether all tabs on the tabselector are disabled or not
 *
 * @return true if all tabs on the tab selector are disabled, false otherwise
 * @type boolean
 * @private
 */
TabSelectorGUIAdaptor.prototype._getAllTabsDisabled = function()
{
	return this.m_renderer.getAllTabsDisabled();
}


/**
 * Method handles press of left arrow key when tab selector is
 * in focus.
 *
 */
TabSelectorGUIAdaptor.prototype._handleKeyArrowLeft = function()
{
	this.m_renderer.selectPreviousTab();
}


/**
 * Method handles press of right arrow key when tab selector is
 * in focus.
 *
 */
TabSelectorGUIAdaptor.prototype._handleKeyArrowRight = function()
{
	this.m_renderer.selectNextTab();
}


/**
 * Method to handle press of arrow down key when tab selector
 * is in focus.
 *
*/
TabSelectorGUIAdaptor.prototype._handleKeyArrowDown = function()
{
	var tab = this.m_renderer.getCurrentlySelectedTab();
	
	if(null != tab)
	{
		var pageId = tab.getPageId();
	
		var fc = FormController.getInstance();
		
		// Retrieve adaptor for currently selected page
		var pageAdaptor = fc.getAdaptorById(pageId);
        
        // Use the firstFocusedAdaptorId to determine if the application has
        // specified which field should be focussed first when entering the page
        var focusAdaptorId = pageAdaptor.invokeFirstFocusedAdaptorId();
        
        // If none specified then use the first child of the page
        if(null == focusAdaptorId)
        {
        	if(pageAdaptor.m_containedChildren.length > 0)
        	{
        		focusAdaptorId = pageAdaptor.m_containedChildren[0].getId();
        	}
        }
        
        // If we have an adaptor id, then ask TabbingManager to focus on it.
        // TabbingManager will sort out whether or not adaptor can accept focus etc.
        if(null != focusAdaptorId)
        {
        	Services.setFocus(focusAdaptorId);
        }
    }
}


/**
 * Define key bindings
 *
*/
TabSelectorGUIAdaptor.prototype.keyBindings =
[
	{key: Key.ArrowLeft, action: TabSelectorGUIAdaptor.prototype._handleKeyArrowLeft},
	{key: Key.ArrowRight, action: TabSelectorGUIAdaptor.prototype._handleKeyArrowRight},
	{key: Key.ArrowDown, action: TabSelectorGUIAdaptor.prototype._handleKeyArrowDown}
];


