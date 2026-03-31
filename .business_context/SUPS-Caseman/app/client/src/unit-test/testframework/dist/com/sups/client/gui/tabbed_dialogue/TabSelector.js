// Just to help define what we are expecting for tab selector initialisation
function TabDef(tabLabel, pageId)
{
	this.tabLabel = tabLabel;
	this.pageId = pageId;
}


function _fwTab(selector, tdElement, label, pageId)
{
	this.m_tabSelector = selector;
	this.m_tdElement = tdElement;
	this.m_label = label;
	this.m_pageId = pageId;
}


_fwTab.prototype.m_tabSelector = null;

_fwTab.prototype.m_enabled = true;

_fwTab.prototype.m_label = null;

_fwTab.prototype.m_tdElement = null;

_fwTab.prototype.m_pageId = null;

_fwTab.prototype.m_clickHandler = null;

_fwTab.prototype.m_selected = false;

_fwTab.prototype.m_submissable = true;



_fwTab.prototype.setEnabled = function(enabled)
{
	if(this.m_enabled != enabled)
	{
		this.m_enabled = enabled;
		return true;
	}
	else
	{
		return false;
	}
}


_fwTab.prototype.isEnabled = function()
{
	return this.m_enabled;
}


_fwTab.prototype.setLabel = function(label)
{
	if(this.m_label != label)
	{
		this.m_label = label;
		return true;
	}
	else
	{
		return false;
	}
}


_fwTab.prototype.setSelected = function(selected)
{
	if(this.m_selected != selected)
	{
		this.m_selected = selected;
		return true;
	}
	else
	{
		return false;
	}
}

_fwTab.prototype.isSelected = function(selected)
{
	return this.m_selected;
}

_fwTab.prototype.setSubmissible = function(submissible)
{
	this.m_submissable = submissible;
}

_fwTab.prototype.getPageId = function()
{
	return this.m_pageId;
}


_fwTab.prototype.renderState = function()
{
	var cellElement = this.m_tdElement;
	var tdClassName = TabSelector.TAB_CELL_CSS_CLASS;
	var divClassName = TabSelector.TAB_CELL_DIV_CSS_CLASS;
	
	if(this.m_enabled && this.m_tabSelector.isEnabled())
	{
		if(null == this.m_clickHandler)
		{
			var thisObj = this;
			this.m_clickHandler = SUPSEvent.addEventHandler(cellElement, "mousedown", function(evt) { thisObj.m_tabSelector._onCellClick(thisObj); }, false);
		}
		
		if(this.m_selected)
		{
			tdClassName += " " + TabSelector.TAB_CELL_SELECTED_CSS_CLASS;

			if(this.m_tabSelector.m_focussed)
			{
				tdClassName += " " + TabSelector.TAB_CELL_FOCUSSED_CSS_CLASS;
				divClassName += " " + TabSelector.TAB_CELL_DIV_FOCUSSED_CSS_CLASS;
                
                if(cellElement.focus)
                {
	                // We need to focus the div to make sure that the 
	                // key events (ie arrow keys) are applied to the
	                // correct element.
	                cellElement.focus();
	            }
			}
		}
        		
		if(!this.m_submissable)
		{
			tdClassName += " " + TabSelector.TAB_CELL_NOT_SUBMISSIBLE_CSS_CLASS;
		}
		
	}
	else
	{
		tdClassName += " " + TabSelector.TAB_CELL_DISABLED_CSS_CLASS;
	
		this._removeClickHandler();
	}
	
	cellElement.className = tdClassName;
	cellElement.firstChild.className = divClassName;
	cellElement.firstChild.innerHTML = this.m_label;	
}


_fwTab.prototype._removeClickHandler = function()
{
	if(null != this.m_clickHandler)
	{
		SUPSEvent.removeEventHandlerKey(this.m_clickHandler);
		this.m_clickHandler = null;
	}
}


_fwTab.prototype.dispose = function()
{
	this._removeClickHandler();
}


function TabSelector(){};

/**
 * TabSelector is a sub class of Renderer
 */
TabSelector.prototype = new Renderer();
TabSelector.prototype.constructor = TabSelector;

TabSelector.prototype.m_cellClickHandlers = null;

/*
 * CSS Class name defintions
 */
TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME = "tabselectorwrapper";
TabSelector.TAB_SELECTOR_CSS_CLASS = "tabselector";
TabSelector.TAB_CELL_CSS_CLASS = "tabCell";
TabSelector.TAB_CELL_UNSELECTED_CSS_CLASS = "tabCellUnselected";
TabSelector.TAB_CELL_SELECTED_CSS_CLASS = "tabCellSelected";
TabSelector.TAB_CELL_DISABLED_CSS_CLASS = "tabCellDisabled";
TabSelector.TAB_CELL_FOCUSSED_CSS_CLASS = "tabCellFocus";
TabSelector.TAB_CELL_NOT_SUBMISSIBLE_CSS_CLASS = "tabCellNotSubmissible";
TabSelector.TAB_CELL_DIV_CSS_CLASS = "tabCellDiv";
TabSelector.TAB_CELL_DIV_FOCUSSED_CSS_CLASS = "tabCellDivFocus";
TabSelector.SPACER_CSS_CLASS = "tabSpacer";
TabSelector.VISIBILITY_HIDDEN = "hidden";
TabSelector.VISIBILITY_INHERIT = "inherit";
TabSelector.VISIBILITY_VISIBLE = "visible";
TabSelector.TABBED_AREA_CSS_CLASS_NAME = "tabbedArea";


/**
 * Enablement state of the tab selector. Defaults to enabled when initially rendered
 *
 * @type boolean
 * @private
 */
TabSelector.prototype.m_enabled = true;


/**
 * Flag to indicate overall TabSelector enablement state has changed since last render
 *
 * @type boolean
 * @private
 */
TabSelector.prototype.m_enabledChanged = false;


/**
 * Flag to indicate whether or not the tab selector has focus or not
 *
 * @type boolean
 * @private
 */
TabSelector.prototype.m_focussed = false;


/**
 * Create a tab selector at the current location in the document while document
 * is parsing.
 *
 * The tabDefs parameter is an array of objects which define the tabs
 * to create in the selector. Each object must have pageId and tabLabel
 * properties. tabLabel is the text to display in the tab. pageId is the 
 * ID of the HTML page element associated with this tab.
 *
 * @param id the id of the tab selector being created
 * @param tabDefs an array which defines the tabs to create in the tab selector
 */
TabSelector.createInline = function(id, tabDefs)
{
	// Create the outer div by writing to the document.
	var e = Renderer.createInline(
		id,			// The id of the tab selector being created
		true		// The tab selector doesn't have any internal input element which can accept focus, so the div should accept focus
	);

	return TabSelector._create(e, tabDefs);
}

/**
 * Create a tab selector in the document relative to the supplied element
 *
 * The tabDefs parameter is an array of objects which define the tabs
 * to create in the selector. Each object must have pageId and tabLabel
 * properties. tabLabel is the text to display in the tab. pageId is the 
 * ID of the HTML page element associated with this tab.
 *
 * @param refElement the element relative to which the tab selector should be rendered
 * @param relativePos the relative position of the tab selector to "refElement".
 * Valid values are:
 *     Renderer.CHILD_ELEMENT    Created as a child of "refElement"
 *     Renderer.BEFORE_ELEMENT   Created as preceeding sibling of "refElement"
 *     Renderer.AFTER_ELEMENT    Created as following sibling of "refElement"

 * @param id the id of the tab selector being created
 * @param tabDefs an array which defines the tabs to create in the tab selector
 */
TabSelector.createAsInnerHTML = function(refElement, relativePos, id, tabDefs)
{
	var e = Renderer.createAsInnerHTML(
		refElement,		// The element relative to which to create the outer div in the document
		relativePos,	// Relative position of the outer div to the reference element
		id,				// The id of the tab selector being created
		true			// The tab selector doesn't have any internal input element which can accept focus, so the div should accept focus
	);

	return TabSelector._create(e, tabDefs);
}

/**
 * Create a tab selector as a child of another element
 *
 * The tabDefs parameter is an array of objects which define the tabs
 * to create in the selector. Each object must have pageId and tabLabel
 * properties. tabLabel is the text to display in the tab. pageId is the 
 * ID of the HTML page element associated with this tab.
 *
 * @param p the parent element to which the tab selector should be added
 * @param id the id of the tab selector being created
 * @param tabDefs an array which defines the tabs to create in the tab selector
 */
TabSelector.createAsChild = function(p, id, tabDefs)
{
	var e = Renderer.createAsChild(id);

	// Append the tab selector's outer div to it's parent element
	p.appendChild(e);	

	return TabSelector._create(e, tabDefs);
}

TabSelector._create = function(e, tabDefs)
{
	// Set the class of the element wrapping this selector
	e.className = TabSelector.TABSEL_WRAPPER_CSS_CLASS_NAME;

	var r = new TabSelector();
	
	// Initialise sets main element and the reference to the renderer in the dom
	r._initRenderer(e);
	
	r.m_cellClickHandlers = new Array();

	// Prevent the selection of text content in the tab selector
	preventSelection(e);
	
	// Create the table element and set its class
	r.m_tabsTable = Renderer.createElementAsChild(e, "table");
	r.m_tabsTable.className = TabSelector.TAB_SELECTOR_CSS_CLASS;
	
	// Ideally this attribute could be specified in the stylesheet,
	// but CSS support in this area is too flaky.
	r.m_tabsTable.setAttribute("cellspacing", "0px");
	r.m_tabsTable.setAttribute("cellpadding", "0px");

	var tbody = Renderer.createElementAsChild(r.m_tabsTable, "tbody");
	var row = Renderer.createElementAsChild(tbody, "tr");
	
	r.m_tabs = new Array(tabDefs.length);
	
	var cellIdBase = e.id + "_id";
	
	for(var i = 0 ; i < tabDefs.length ; i++)
	{
		var tabDef = tabDefs[i];
		var pageId = tabDef.pageId;
		var label = tabDef.tabLabel;
		if(null == pageId || "" == pageId || null == label || "" == label)
		{
			throw new ConfigurationException("tabDefs parameter must contain objects with a pageId and tabLabel properties");
		}

	    // Create cell element
		var cellId = cellIdBase + i.toString();
		var cell = Renderer.createElementAsChild(row, "td")
		cell.id = cellId;
		cell.className = TabSelector.TAB_CELL_CSS_CLASS;
				
		// Create inner division to store text
		var cellInnerDiv = Renderer.createElementAsChild( cell, "div" );
		cellInnerDiv.innerHTML = label;
		cellInnerDiv.className = TabSelector.TAB_CELL_DIV_CSS_CLASS;

		r.m_tabs[i] = new _fwTab(r, cell, label, pageId);
		r.m_tabs[i].renderState();
	}
	
	var spacer = Renderer.createElementAsChild(row, "td");
	spacer.className = TabSelector.SPACER_CSS_CLASS;
	// Need to have something in the cell otherwise the border is not rendered
	spacer.innerHTML = "&nbsp;";

	r.setTabClickHandler(function(clickedTab) {r._unmanagedClickHandler(clickedTab);});
	
	return r;
}


/**
 * Called by tabselector GUI adaptor to dispose of 
 * this object
 * @private
 */
TabSelector.prototype.dispose = function()
{
	// Remove selection prevention event handler from drop down
	unPreventSelection(this.m_element);

	for(var i = 0, l = this.m_tabs.length ; i < l ; i++) 
	{
		this.m_tabs[i].dispose();
	}
}


/**
 * onClick event handler which is used only when the TabbedDialogue 
 * is used outside of the framework (i.e. when the HTML screen painter
 * is developing the screens).
 *
 * @param tab The _fwTab which was clicked on
 * @private
 */
TabSelector.prototype._onCellClick = function(clickedTab)
{
	// If there has been a change in the currently selected tab
	if(this.m_currentTab != clickedTab)
	{
		// Call the function which is currently handling tab clicks
		this.m_tabClickHandler.call(null, clickedTab);
	}
}


/**
 * Set the handler function which deals with clicks on tabs in the tabselector
 *
 * @param handler the function to invoke when a tab is clicked on in the tabselector
 */
TabSelector.prototype.setTabClickHandler = function(handler)
{
	this.m_tabClickHandler = handler;
}


/**
 * Default tab click handler - allows the tab selector to display
 * pages in a paged area without involvement of GUIAdaptors. Useful
 * during page development.
 *
 * @param clickedTab the _fwTab that was clicked on
 */
TabSelector.prototype._unmanagedClickHandler = function(clickedTab)
{
	// Check for initialisation condition
	if(null != this.m_currentTab)
	{
		this.m_currentTab.setSelected(false);
		this.m_currentTab.renderState();
	}
	
	this.m_currentTab = clickedTab;
	this.m_currentTab.setSelected(true);
	this.m_currentTab.renderState();
	
	// Check for initialisation condition
	if(null != this.m_currentPageElement)
	{
		this.m_currentPageElement.style.visibility = TabSelector.VISIBILITY_HIDDEN;
	}
	
	// Find the page element
	this.m_currentPageElement = document.getElementById(this.m_currentTab.getPageId());
	
	// It's possible that page is a dynamic page and has therefore not yet been created yet.
	// Alternatively it could just be a bad id, but we can only determine this once the
	// GUIAdaptors have been created.
	if(null != this.m_currentPageElement)
	{
		this.m_currentPageElement.style.visibility = TabSelector.VISIBILITY_INHERIT;			
	}
}


/**
 * Get the tab which correspondes to a give page id
 *
 * @param pageId the id of the page for which to get the corresponding tab
 * @return the tab which corresponds to the given pageId or null if no 
 *    corresponding tab was found
 */
TabSelector.prototype._getTabForPageId = function(pageId)
{
	var t = this.m_tabs;

	for(var i = 0, l = t.length; i < l; i++)
	{
		if(pageId == t[i].getPageId())
		{
			return t[i];
		}
	}
	
	return null;
}


/**
 * Get the Paged Area associated with this tab selector
 *
 * @return the div which represents the paged area
 * @throws ConfigurationException if a paged area was not found
 * @private
 */
TabSelector.prototype._getAssociatedPagedArea = function()
{
	if(null == this.m_associatedPagedArea)
	{
		// TabSelector and PagedArea should be siblings
		var kids = this.m_element.parentNode.childNodes;
		
		for(var i = 0, l = kids.length; i < l; i++)
		{
			var kid = kids[i];
			
			// Only care about elements of type div with className that corresponds to the paged area
			if(1 == kid.nodeType && "DIV" == kid.nodeName && PagedAreaGUIAdaptor.CSS_CLASS_NAME == kid.className)
			{
				this.m_associatedPagedArea = kid;
				break;
			}
		}
		
		if (null == this.m_associatedPagedArea) throw new ConfigurationException("Could not find pagedArea associated with TabSelector: " + this.m_element.id);
	}
	
	return this.m_associatedPagedArea;
}


/**
 * Enable or disable the tabselector
 *
 * @param enabled true to enable, false to disable
 * @return true if the enablement state of the TabSelector changed
 * @type boolean
 */
TabSelector.prototype.setEnabled = function(enabled)
{
	if(this.m_enabled != enabled)
	{
		this.m_enabled = enabled;
		
		// Toggle m_enabledChanged flags
		this.m_enabledChanged = !this.m_enabledChanged;
		return true;
	}
	else
	{
		return false;
	}
}


TabSelector.prototype.isEnabled = function()
{
	return this.m_enabled;
}


TabSelector.prototype.renderState = function()
{
	if(this.m_enabledChanged)
	{
		// If enablement state of the TabSelector has changed, need
		// to re-render all of the tabs on the TabSelector
		var t = this.m_tabs;

		for(var i = 0, l = t.length; i < l; i++)
		{
			t[i].renderState();
		}
		this.m_enabledChanged = false
	}
}


/**
 * Checks whether all tabs on the tabselector are disabled or not
 *
 * @return true if all tabs on the tab selector are disabled, false otherwise
 * @type boolean
 * @private
 */
TabSelector.prototype.getAllTabsDisabled = function()
{
	var t = this.m_tabs;
	
	for(var i = 0, l = t.length; i < l; i++)
	{
		if(t[i].isEnabled()) return false;
	}
	
	return true;
}


TabSelector.prototype.getCurrentlySelectedTab = function()
{
	// Get the position of the currently selected tab
	var pos = this._getPositionOfCurrentlySelectedTab();
	
	// Return the currently selected tab, if there is one
	return (null == pos ? null : this.m_tabs[pos]);
}


TabSelector.prototype.setFocus = function(focussed)
{
	this.m_focussed = focussed;
	var tab = this.getCurrentlySelectedTab();
	if(null != tab)
	{
		tab.renderState();
	}
}


TabSelector.prototype.setTabSelectionState = function(tab, selected)
{
	if(tab.setSelected(selected))
	{
		tab.renderState();
	}
}


TabSelector.prototype.setTabLabel = function(tab, label)
{
	if(tab.setLabel(label))
	{
		tab.renderState();
	}
}


TabSelector.prototype.setTabEnablementState = function(tab, enabled)
{	
	if(tab.setEnabled(enabled))
	{
		// Ought to track which tabs have changed and then render them all at the end.
		tab.renderState();
	}
}


TabSelector.prototype.selectPreviousTab = function()
{
	// Get the position of the currently selected tab if there is one
	var initialPos = this._getPositionOfCurrentlySelectedTab();
	
	// If no currently selected tab, then wrap round the rightmost tab (actually start at beginning of tab order and work backwards)
	if(null == initialPos) initialPos = 0;
	
	var pos = initialPos;
	
	// loop round through the array, wrapping round, until we reach our starting position again.
	do
	{
		// Move to previous tab
		pos--;
		
		// If we've gone past the beginning of the array, wrap round to the end
		if(pos < 0) pos = this.m_tabs.length - 1;
		
		// When we find a tab that can accept the focus, break out of the loop
		if(this.m_tabs[pos].isEnabled()) break;
	} while (pos != initialPos);
	
	// If position is not the same position as we started on then select the new tab 
	// (and corresponding page). This is treated as a click on the tab
	if(pos != initialPos)
	{
		// Found another tab that could accept the focus
		this._onCellClick(this.m_tabs[pos]);
	}
}


TabSelector.prototype.selectNextTab = function()
{
	// Get the position of the currently selected tab if there is one
	var initialPos = this._getPositionOfCurrentlySelectedTab();
	
	// If no currently selected tab, then wrap round the leftmost tab (actually start at end of tab order and work forwards)
	if(null == initialPos) initialPos = this.m_tabs.length - 1;
	
	var pos = initialPos;
	
	// loop round through the array, wrapping round, until we reach our starting position again.
	do
	{
		// Move to previous tab
		pos++;
		
		// If we've gone past the end of the array, wrap round to the beginning
		if(pos >= this.m_tabs.length) pos = 0;
		
		// When we find a tab that can accept the focus, break out of the loop
		if(this.m_tabs[pos].isEnabled()) break;
	} while (pos != initialPos);
	
	// If position is not the same position as we started on then select the new tab 
	// (and corresponding page). This is treated as a click on the tab
	if(pos != initialPos)
	{
		// Found another tab that could accept the focus
		this._onCellClick(this.m_tabs[pos]);
	}
}


TabSelector.prototype._getPositionOfCurrentlySelectedTab = function()
{
	var t = this.m_tabs;

	for(var i = 0, l = t.length; i < l; i++)
	{
		if(t[i].isSelected()) return i;
	}
	
	return null;
}


/**
 * Style sheet puts a -2px margin on the table containing the tab selector.
 * This adjusts the overall width of the outer div to ensure that the bottom
 * border of the spacer cell extends to the right border of the paged area.
 *
 * @private
 */
TabSelector.prototype._setTabSelectorWidth = function()
{
	var pagedArea = this._getAssociatedPagedArea();

	var style = getCalculatedStyle(pagedArea);
	var borderWidth = style.borderRightWidth.slice(0, -2);

	// If stylesheet has not loaded then this will be "medium", if so default to 1px
	borderWidth = isNaN(borderWidth) ? 1 : Number(borderWidth);

	style = getCalculatedStyle(this.m_tabsTable);
	var marginWidth = style.marginRight.slice(0, -2);

	// If stylesheet has not loaded then this will be "auto", if so default to 2px
	marginWidth = isNaN(marginWidth) ? 2 : Math.abs(Number(marginWidth));

	// Adjust width for the table right margin plus the paged area right border
	this.m_element.style.width = pagedArea.offsetWidth + marginWidth + borderWidth + "px";
}

