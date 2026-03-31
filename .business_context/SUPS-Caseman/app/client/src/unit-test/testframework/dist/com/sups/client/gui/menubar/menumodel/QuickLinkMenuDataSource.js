/**
 * Class QuickLinkMenuDataSource
 *
 * Data source for a quick link menu panel
 *
*/

function QuickLinkMenuDataSource() {}

QuickLinkMenuDataSource.prototype = new MenuDataSource();
QuickLinkMenuDataSource.prototype.constructor = QuickLinkMenuDataSource;

/**
 * Method gets the menu panel items for the quick links menu button menu panel.
 *
 * @param quickLinksMenuButtonGUIAdaptor Quick links menu button GUI adaptor.
 *
*/
QuickLinkMenuDataSource.prototype.getMenuPanelItems = function(quickLinksMenuButtonGUIAdaptor)
{
	var menuPanelItems = null;
	
    if(null != quickLinksMenuButtonGUIAdaptor)
    {
        var quickLinkMenuItems = quickLinksMenuButtonGUIAdaptor.m_quickLinksConfig;
        
        // Create menu items for panel
        
        menuPanelItems = new Array();
        
        var menuPanelItem = null;
        var quickLinkMenuItem = null;
        var formName = null;
        var subformId = null;
        
        for(var i = 0, l = quickLinkMenuItems.length; i < l; i++)
        {
            quickLinkMenuItem = quickLinkMenuItems[i];
            
            menuPanelItem = new MenuPanelItem();
            
            menuPanelItem.m_type = MenuPanelItem.QUICK_LINK;
            
            menuPanelItem.m_id = quickLinkMenuItem.id;
            
            menuPanelItem.m_label = quickLinkMenuItem.label;
            
            // Determine destination
            formName = quickLinkMenuItem.formName;
            subformId = quickLinkMenuItem.subformId;
            
            if(null != formName && null != subformId)
            {
                throw new ConfigurationException( "Both formName and subformId defined for quick link " +
                                                  quickLinkMenuItem.id );
            }
            else if(null != formName && null == subformId)
            {
                menuPanelItem.m_destination = formName;
            }
            else if(null == formName && null != subformId)
            {
                menuPanelItem.m_subformId = subformId;
            }
            else
            {
                throw new ConfigurationException( "Neither formName nor subformId defined for quick link " +
                                                  quickLinkMenuItem.id );
            }
            
            if(null != quickLinkMenuItem.guard)
            {
                menuPanelItem.m_guard = quickLinkMenuItem.guard;
            }
            
            if(null != quickLinkMenuItem.prepare)
            {
                menuPanelItem.m_prepare = quickLinkMenuItem.prepare;
            }
            
            // Add menu panel item to array
            menuPanelItems[menuPanelItems.length] = menuPanelItem;
            
        }
        
    }
    
    return menuPanelItems;
    
}
        

