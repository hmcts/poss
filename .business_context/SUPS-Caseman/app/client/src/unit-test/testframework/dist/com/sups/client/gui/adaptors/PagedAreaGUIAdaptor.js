//==================================================================
//
// PagedAreaGUIAdaptor.js
//
// Class for adapting a text style input element for use in the
// framework
//
//==================================================================

/**
 * Base class for adapting Page class DIV elements for use in the
 * framework.
 *
 * @param e the input element to manage
 * @constructor
 * @private
 */
function PagedAreaGUIAdaptor(){};


PagedAreaGUIAdaptor.m_logger = new Category("PagedAreaGUIAdaptor");


/**
 * PagedAreaGUIAdaptor is a sub class of HTMLElementGUIAdaptor
 */
PagedAreaGUIAdaptor.prototype = new HTMLElementGUIAdaptor();
PagedAreaGUIAdaptor.prototype.constructor = PagedAreaGUIAdaptor;


/**
 * Add the required protocols to the PagedAreaGUIAdaptor
 */
GUIAdaptor._setUpProtocols('PagedAreaGUIAdaptor'); 
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'ComponentContainerProtocol');		// Contains child components
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'DataBindingProtocol');				// Supports binding to data model
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'EnablementProtocol');				// Supports enablement
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'ReadOnlyProtocol');					// Supports enablement/disablement
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'NameProtocol');						// Supports naming of the element
GUIAdaptor._addProtocol('PagedAreaGUIAdaptor', 'DynamicLoadingProtocol');			// Supports dynamic loading and unloading of pages as a result of DataModel changes


/**
 * CSS classes used to render the page in different states
 */
PagedAreaGUIAdaptor.CSS_CLASS_NAME = "pagedArea";
PagedAreaGUIAdaptor.DISABLED_CSS_CLASS_NAME = "pagedAreaDisabled";
PagedAreaGUIAdaptor.READONLY_CSS_CLASS_NAME = "pagedAreaReadOnly";
PagedAreaGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS = "pagedAreaNotSubmissible";


/**
 * The id of the currently selected page. Null if no page selected.
 * Note that this is not necessarily the same as the m_currentPage
 * which is the currently displayed page. m_selectedPageId is used
 * to communicate a newly selected page between showPage() and 
 * getValueFromView().
 *
 * @type String
 * @private
 */
PagedAreaGUIAdaptor.prototype.m_selectedPageId = null;


/**
 * Map of dynamic page configurations, keyed by page id
 *
 * @type Map[Object]
 * @private
 */
PagedAreaGUIAdaptor.prototype.m_dynamicPageConfigs = null



/**
 * Create a new PagedAreaGUIAdaptor
 *
 * @param e the element to manage
 * @return the new PagedAreaGUIAdaptor
 * @type PagedAreaGUIAdaptor
 */
PagedAreaGUIAdaptor.create = function(e)
{
	if (PagedAreaGUIAdaptor.m_logger.isTrace()) PagedAreaGUIAdaptor.m_logger.trace("PagedAreaGUIAdaptor.create");

	var a = new PagedAreaGUIAdaptor();
	a._initialiseAdaptor(e);
	return a;
}


/**
 * Initialises the adaptor instance
 * @private
 */
PagedAreaGUIAdaptor.prototype._initialiseAdaptor = function(e)
{
	// Call the super class.
	HTMLElementGUIAdaptor.prototype._initialiseAdaptor.call(this, e);
}



/**
 * Clean up after the component
 */
PagedAreaGUIAdaptor.prototype._dispose = function()
{
	// Don't think this is necessary, but just incase...
    this.m_element = null;

    // Remove dynamic page configurations
    if(this.m_dynamicPageConfigs != null)
    {
		var cm = FormController.getInstance().getFormView().getConfigManager();
	    			
    	for(var i in this.m_dynamicPageConfigs)
    	{   		
    		// Remove dynamic page configuration from window - only present
    		// if page has been loaded
    		cm.removeConfig(this.m_dynamicPageConfigs[i].id);
    		
    		// Remove dynamic page configuration from array - only present if
    		// if page has never been loaded
    		for(var j in this.m_dynamicPageConfigs[i])
    		{
	    		delete j;
    		}
    		delete this.m_dynamicPageConfigs[i];
    	}
    	this.m_dynamicPageConfigs = null;
    }
}


/**
 * Configure the GUIAdaptor
 *
 * @param cs an Array of configuration objects ordered with
 *   most specific items first.
 * @private
 */
PagedAreaGUIAdaptor.prototype._configure = function(cs)
{
	this.includeInValidation = false;
	
	// No configuration objects
	this._registerStaticPageListeners();
	
	// Dynamic Page Configurations loaded into a map keyed by page id
	var dps = new Object();
	
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		var _showProgress = false;
		
		// Set dynamic page show progress flag from paged area configuration
		if(c.showProgress != null) _showProgress = c.showProgress;
		
		var dynamicPages = c.dynamicPages;
		
		if(dynamicPages != null)
		{
			for(var j = 0, m = dynamicPages.length; j < m; j++)
			{
				var dp = dynamicPages[j];

				this._checkMandatoryCfg(dp, "id");
				this._checkMandatoryCfg(dp, "viewURL");
				this._checkMandatoryCfg(dp, "configURL");
				// ToDo - Do we want the stylesheet to be mandatory?
				//this._checkMandatoryCfg(dp, "styleURL");
				
				// Check for duplicate page ids
				if(dps[dp.id] != null) throw new ConfigurationException("Duplicate dynamic page id: " + dp.id + " in Paged Area: " + this.getId());
				
				// Add show progress bar property for dynamic page. Note that
				// dynamic page configuration overrides paged area configuration
				if(dp.showProgress == null) dp.showProgress = _showProgress;
				
				// Add the page configuration to the map of dynamic pages
				dps[dp.id] = dp;
			}
		}
	}
	
	this.m_dynamicPageConfigs = dps;
}


PagedAreaGUIAdaptor.prototype._checkMandatoryCfg = function(config, propertyName)
{
	var property = config[propertyName];
	if(null == property || "" == property) throw new ConfigurationException(propertyName + " is a madatory configuration property for dynamic pages");
}


/**
 * Register a set of state change listeners with the pages on the paged area.
 *
 * @private
 */
PagedAreaGUIAdaptor.prototype._registerStaticPageListeners = function()
{
	var pageAdaptors = this._getPages();
	
	for(var i = 0, l = pageAdaptors.length; i < l; i++)
	{
		this._registerPageListeners(pageAdaptors[i]);
	}
}


PagedAreaGUIAdaptor.prototype._registerPageListeners = function(pageAdaptor)
{
	var hasAssociatedTabSelector = (this._getAssociatedTabSelector() != null);

	var thisObj = this;
	
	pageAdaptor.addVisibilityChangeListener(function(pageId, visible) { thisObj._pageVisibilityCallback(pageId, visible); });

	// Only care about enablement and label change events on pages if we have a tab selector to reflect them on.
	if(hasAssociatedTabSelector)
	{
		pageAdaptor.addEnablementChangeListener(function(pageId, enabled) { thisObj._pageEnablementCallback(pageId, enabled); });
		pageAdaptor.addLabelChangeListener(function(pageId, label) { thisObj._pageLabelCallback(pageId, label); });
	}
}


/**
 * Update the components visual state based on its internal logical state
 */
PagedAreaGUIAdaptor.prototype.renderState = function()
{   
	if(this.m_valueChanged)
	{
		// Hide currently displayed page.
		if(null != this.m_currentPage)
		{
			this.m_currentPage.show(false);
			
			this.m_currentPage = null;
		}
	
		// If we have a none null pageId, then attempt to locate the page
		if(null != this.m_value && "" != this.m_value)
		{
			// See if current page is staticly defined or dynamic page already loaded
			this.m_currentPage = this._getPageById(this.m_value);
			
			// Page not found - could be a dynamic page
			if(null == this.m_currentPage)
			{
				this.m_currentPage = this._findAndLoadDynamicPage(this.m_value);
			}

			// If we have a page then show it			
			if(null != this.m_currentPage)
			{   
				this.m_currentPage.show(true);
			}
		}
		
		// Reset value changed flag to indicate that adaptor has updated it's value
		this.m_valueChanged = false;
	}
	
	if (renderStateChanged (this, this.m_netEnablementState))
	{
		this.m_netEnablementState = !this.m_netEnablementState;
		
		var className = PagedAreaGUIAdaptor.CSS_CLASS_NAME;
        
		if (this.m_netEnablementState)
		{
			if(!this.getAggregateState().isSubmissible())
			{
				className += " " + PagedAreaGUIAdaptor.NOT_SUBMISSIBLE_CSS_CLASS;
			}
			
			// If paged area is readonly, set appropriate CSS class
			if(this.getReadOnly())
			{
				className += " " + PagedAreaGUIAdaptor.READONLY_CSS_CLASS_NAME;
			}
	    }
	    else
	    {
            className += " " + PagedAreaGUIAdaptor.DISABLED_CSS_CLASS_NAME;
        }
		this.m_element.className = className;
		
		this.m_enabledChanged = false;
	}
}


PagedAreaGUIAdaptor.prototype._getPageById = function(pageId)
{
	var page = null;
	
	// Search through array of statically defined pages and currently loaded pages
	var pageAdaptors = this._getPages();
	for(var i = 0, l = pageAdaptors.length ; i < l ; i++)
	{
		if(pageAdaptors[i].getId() == pageId)
		{
			page = pageAdaptors[i];
			
			// Have found the page referenced by the datamodel
			break;
		}
	}
	
	return page;
}


PagedAreaGUIAdaptor.prototype._findAndLoadDynamicPage = function(pageId)
{
	// The dynamic page GUIAdaptor
	var dynamicPage = null;
	
	// Look up the page using it's id in the configs.
	var pageConfig = this.m_dynamicPageConfigs[pageId];
	
	if(null != pageConfig)
	{
		var fc = FormController.getInstance();
		
		// Show the progress bar if required
		// Defect 1081 fix. Reposition display of
		// progress bar to renderState.
		//if(pageConfig.showProgress == true)
		//{
	    //    var ac = fc.getAppController();
	    //    ac._showProgress();
        //}
        
		// Create and setup the dynamic page div
		var pageDiv = document.createElement("div");
		pageDiv.id = pageId;
		pageDiv.className = DynamicPageGUIAdaptor.CSS_CLASS_NAME;
		pageDiv.innerHTML = "Page Loading...";
		
		// Append the page element to the pagedArea.
		this.m_element.appendChild(pageDiv);
		
		var fv = fc.getFormView();
		var cm = fv.getConfigManager();
		
		// Create the configuration for the page
		cm.setConfig(pageId, pageConfig);
		
		// Create the DynamicPageGUIAdaptor and add it to the FormController
		var gaf = fv.getGUIAdaptorFactory();
		
		var adaptors = gaf._parseElement(pageDiv, this, true);
		
		fc_assert(null != adaptors, "Failed to create DynamicPageGUIAdaptor");
		fc_assert(1 == adaptors.length, "Unexpected number of adaptors created when parsing DynamicPageGUIAdaptor. Expected 1 adaptor, got " + adaptors.length);
		
		dynamicPage = adaptors[0];
		
		// Add the page to the list of pages for the PagedArea.
		this.m_pages.push(dynamicPage);
		
		// Register listeners with page so that the paged area get notified when the page state changes
		this._registerPageListeners(dynamicPage);
		
		// Add the page to the FormController
		fc.addAdaptors(adaptors);
		
	}
	
	return dynamicPage;
}


PagedAreaGUIAdaptor.prototype._destroyDynamicPage = function(pageId)
{
	var page = null;
	
	// Remove required page from list of pages by rebuilding page array without requested page
	var pageAdaptors = this._getPages();
	var newPageAdaptors = [];
	var removedPage = null;
	for(var i = 0, l = pageAdaptors.length ; i < l ; i++)
	{
		var pa = pageAdaptors[i];
		if(pa.getId() != pageId)
		{
			newPageAdaptors.push(pa);
		}
		else
		{
			removedPage = pa;
		}
	}
	
	// Set the m_pages array to the new array which doesn't contain the page being destroyed
	this.m_pages = newPageAdaptors;
	
	// AL - this method can be invoked prior to the page being loaded
	if(removedPage != null)
	{
		// Get the div that represents the page
		var pageDiv = removedPage.getElement();
		
		// If the PagedArea has an associated TabSelector, then notify the TabSelector
		// of the visibility change, so it can update its visual if necessary state.
		var tabbedSelector = this._getAssociatedTabSelector();
		if(null != tabbedSelector)
		{
			tabbedSelector._handlePagedAreaVisibilityChanged(pageId, false);
		}

		// Remove the page and it's children from the FormController
		var fc = FormController.getInstance();
		fc.removeAdaptor(removedPage);

/*
	D874 - This also removes the configuration from m_dynamicPageConfigs, preventing the
	same page from being reloaded. Configuration is now removed in _dispose method

		// Remove dynamic page configuration
		var fv = fc.getFormView();
		var cm = fv.getConfigManager();
		
		cm.removeConfig(pageId);
*/
		// Remove the HTML node so that the page is removed from the view
		pageDiv.parentNode.removeChild(pageDiv);
		
		// If the currently displayed page was removed, remove the reference to the page
		if(removedPage == this.m_currentPage)
		{
			this.m_currentPage = null;
		}
	}
}


/**
 * Get all the pages contained in this Paged Area
 *
 * @return an array of DIV elements which represent the pages inside
 *         this page area.
 * @type Array[HTMLElement]
 * @private
 */
PagedAreaGUIAdaptor.prototype._getPages = function()
{
	if(null == this.m_pages)
	{
		this.m_pages = new Array();
	
		var pageAreaChildren = this.m_element.childNodes;
		for(var i = 0, l = pageAreaChildren.length; i < l; i++)
		{
			var child = pageAreaChildren[i];
			
			// Only interested in child element nodes (ignore text and comment nodes)
			if(child.nodeType == 1)
			{
				// Look for children that are pages
				if(child.nodeName == "DIV" && child.className.indexOf(PageGUIAdaptor.CSS_CLASS_NAME) == 0)
				{
					if(child.id.length > 0)
					{
						var pageAdaptor = Services.getAdaptorById(child.id)
						
						// Page found - add to the array
						this.m_pages.push(pageAdaptor);
					}
				}
				else
				{
					// All children should be divs with class "page" - log an error if this is not the case!
					PagedAreaGUIAdaptor.m_logger.error("PageAreaGUIAdaptor._getPages(): PageArea '" + this.getId() + "' has children which are not pages!");
				}
			}
		}
	}
	
	return this.m_pages;
}


/**
 * Return the tabselector associated with this PagedArea, or null if there is no
 * tabselector associated with this PagedArea
 * 
 * @return the TabSelectorGUIAdaptor associated with this PagedArea or null if
 *   there is no TabSelector associated with this paged area.
 * @type TabSelectorGUIAdaptor
 */
PagedAreaGUIAdaptor.prototype._getAssociatedTabSelector = function()
{
	if(null == this.m_associatedTabSelector)
	{
		// TabSelector and PagedArea should be siblings
		var kids = this.m_element.parentNode.childNodes;
		
		for(var i = 0, l = kids.length; i < l; i++)
		{
			var kid = kids[i];
			
			// Only care about elements of type div with className that corresponds to the tabbed area
			if(1 == kid.nodeType && "DIV" == kid.nodeName && TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME == kid.className)
			{
				if(kid.id.length > 0)
				{
					this.m_associatedTabSelector = Services.getAdaptorById(kid.id);
				}
				else
				{
					throw new ConfigurationException("TabSelector associated with PagedArea '" + this.getId() + "' must have an id");
				}
				break;
			}
		}
	}
	
	return this.m_associatedTabSelector;
}


/**
 * Show a page given its Id
 *
 * @param pageId the id of page to show
 */
PagedAreaGUIAdaptor.prototype.showPage = function(pageId)
{
	// Set the m_selectedPageId member variable, so that _getValueFromView() can
	// return it when update asks for the components value.
	this.m_selectedPageId = pageId;
	
	// Set the value of the paged area to the pageId and update the model
	this.update();
}


/**
 * Return the adaptors value, which in this case is the selected page (note -
 * not necessarily the same as the m_currentPage (currently displayed page, until
 * after renderState() has been called.
 *
 * @return the selected page id
 * @type String
 * @private
 */
PagedAreaGUIAdaptor.prototype._getValueFromView = function()
{
	return this.m_selectedPageId;
}


/**
 * Handler to process changes in a page's visibility
 *
 * @param pageId the id of page who's visibility has changed
 * @param visible whether the page was made visible (true) or invisible (false)
 * @private
 */
PagedAreaGUIAdaptor.prototype._pageVisibilityCallback = function(pageId, visible)
{
	// If a page is made visible using the visibility protocol, we need to update
	// the PagedArea's value in the DataModel
	if(visible)
	{
		this.showPage(pageId);
	}
	else
	{
		// If the current page has been hidden then the paged area no longer
		// displays a page (has null value)
		if(this.m_currentPage.getId() == pageId)
		{
			this.showPage(null);
		}
	}
	
	// If the PagedArea has an associated TabSelector, then notify the TabSelector
	// of the visibility change, so it can update its visual if necessary state.
	var tabbedSelector = this._getAssociatedTabSelector();
	if(null != tabbedSelector)
	{
		tabbedSelector._handlePagedAreaVisibilityChanged(pageId, visible);
	}
}


/**
 * Handler to process changes in a page's enablement state
 *
 * @param pageId the id of page who's enablement state has changed
 * @param enabled whether the page was enabled (true) or disabled (false)
 * @private
 */
PagedAreaGUIAdaptor.prototype._pageEnablementCallback = function(pageId, enabled)
{
	// If the PagedArea has an associated TabSelector, then notify the TabSelector
	// of the enablement change, so it can update its visual if necessary state.
	var tabbedSelector = this._getAssociatedTabSelector();
	if(null != tabbedSelector)
	{
		tabbedSelector._handlePagedAreaEnablementChanged(pageId, enabled);
	}
}


/**
 * Handler to process changes in a page's label
 *
 * @param pageId the id of page who's label has changed
 * @param label the new label for the page
 * @private
 */
PagedAreaGUIAdaptor.prototype._pageLabelCallback = function(pageId, label)
{
	var tabbedSelector = this._getAssociatedTabSelector();
	if(null != tabbedSelector)
	{
		tabbedSelector._handlePagedAreaLabelChanged(pageId, label);
	}
}


/**
 * Override register method of DynamicLoadingProtocol as we need to
 * register listeners with additional detail to identify which page
 * should be loaded/unloaded
 *
 * @param db 
 */
PagedAreaGUIAdaptor.prototype.getListenersForDynamicLoadingProtocol = function(db)
{
    var listenerArray = new Array();

	// Get configurations
	var cs = this.getConfigs();
	
	// Get paged area dataBinding - pages should always be checked for unloading
	// when this changes
	var dataBinding = this.getDataBinding();

	for(var i = 0, l = cs.length; i < l; i++)
	{
		var c = cs[i];
		
		var dynamicPages = c.dynamicPages;
		
		if(dynamicPages != null)
		{
			for(var j = 0, m = dynamicPages.length; j < m; j++)
			{
				var dp = dynamicPages[j];
				
				var on = dp.loadOn;
				if(null != on && on.length > 0)
				{
					var listener = FormControllerListener.create(this, FormController.LOAD, dp.id);
					
					for(var k = 0, n = on.length; k < n; k++)
					{
                        listenerArray.push({xpath: on[k], listener: listener});
					}
				}

				// Each page monitors the paged area's databinding to see if it can
				// be unloaded (when it is not displayed).
				var listener = FormControllerListener.create(this, FormController.UNLOAD, dp.id);
				listenerArray.push({xpath: dataBinding, listener: listener});
				
				on = dp.unloadOn;				
				if(null != on && on.length > 0)
				{
					for(var k = 0, n = on.length; k < n; k++)
					{
                        listenerArray.push({xpath: on[k], listener: listener});
					}
				}
			}
		}
	}
    
    return listenerArray;
}


/**
 * Method overridden by adaptor to handle a load of a dynamic page
 */
PagedAreaGUIAdaptor.prototype.handleLoad = function(d)
{
	var page = this._getPageById(d);

	// Check if page is already loaded	
	if(null == page)
	{		
		// Create the dynamic page
		page = this._findAndLoadDynamicPage(d);
		
		// If we have a page then show it
		if(page != null)
		{
			this.showPage(d);
		}
	}
}


/**
 * Method overridden by adaptor to handle an unload of a dynamic page
 */
PagedAreaGUIAdaptor.prototype.handleUnload = function(d)
{
	var page = this._getPageById(d);

	// Check if page is loaded	
	if(page != null)
	{
		// Destroy the dynamic page
		this._destroyDynamicPage(d);
	}
}


/**
 * Get load configurations which are to be invoked. Overrides 
 * default method in DynamicLoadingProtocol
 *
 * @param d additional detail parameter registered with listener
 */
PagedAreaGUIAdaptor.prototype.getOnLoadConfigs = function(d)
{
	// Get configurations
	var cs = this.getConfigs();
	
	// Build array of load function configurations
	var configs = [];
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var dynamicPages = cs[i].dynamicPages;
		
		if(null != dynamicPages)
		{
			for(var j = 0, m = dynamicPages.length; j < m; j++)
			{
				if(dynamicPages[j].id == d)
				{
					if(null != dynamicPages[j].load) configs.push(dynamicPages[j].load);
				}
			}
		}
	}
	
	return configs;
}


/**
 * Get unload configurations which are to be invoked. Overrides 
 * default method in DynamicLoadingProtocol
 *
 * @param d additional detail parameter registered with listener
 */
PagedAreaGUIAdaptor.prototype.getOnUnloadConfigs = function(d)
{
	// Get configurations
	var cs = this.getConfigs();
	
	// Build array of load function configurations
	var configs = [];

	// Add configurations for individual pages	
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var dynamicPages = cs[i].dynamicPages;
		
		if(null != dynamicPages)
		{
			for(var j = 0, m = dynamicPages.length; j < m; j++)
			{
				if(dynamicPages[j].id == d)
				{
					// Add a dynamically generated unload() function that prevents
					// the page being unloaded if it is currently displayed
					var thisObj = this;
					configs.push( function(d) { return thisObj.m_value != d; });
					
					// Add any unload configuration methods that the user has configured
					if(null != dynamicPages[j].unload) configs.push(dynamicPages[j].unload);
				}
			}
		}
	}
	
	return configs;
}


/**
 * Return all the id's of the DynamicPages defined on the PagedArea,
 * so that they can be loaded at initialisation time if necessary
 *
 */
PagedAreaGUIAdaptor.prototype._getDynamicLoadingDetails = function()
{
	// Get configurations
	var cs = this.getConfigs();
	
	var details = [];
	
	for(var i = 0, l = cs.length; i < l; i++)
	{
		var dynamicPages = cs[i].dynamicPages;
		
		if(null != dynamicPages)
		{
			for(var j = 0, m = dynamicPages.length; j < m; j++)
			{
				details.push({m_detail: dynamicPages[j].id});
			}
		}
	}
	
	return details;
}
