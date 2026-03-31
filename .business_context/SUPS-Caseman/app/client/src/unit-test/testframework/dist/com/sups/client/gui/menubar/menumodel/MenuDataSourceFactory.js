/**
 * Class MenuDataSourceFactory
 *
 * A factory source for menu data sources
 *
*/

function MenuDataSourceFactory() {}

MenuDataSourceFactory.NAVIGATION_MENU = 1;
MenuDataSourceFactory.QUICK_LINK_MENU = 2;

MenuDataSourceFactory.m_navigationMenuDataSource = null;
MenuDataSourceFactory.m_quickLinkMenuDataSource = null;

MenuDataSourceFactory.getInstance = function(factoryType)
{

    var dataSource;
    
    if(factoryType == MenuDataSourceFactory.NAVIGATION_MENU)
    {
        if(null == MenuDataSourceFactory.m_navigationMenuDataSource)
        {
            MenuDataSourceFactory.m_navigationMenuDataSource = new NavigationMenuDataSource();
        }
        
        dataSource = MenuDataSourceFactory.m_navigationMenuDataSource;
        
    }
    else if(factoryType == MenuDataSourceFactory.QUICK_LINK_MENU)
    {
        if(null == MenuDataSourceFactory.m_quickLinkMenuDataSource)
        {
            MenuDataSourceFactory.m_quickLinkMenuDataSource = new QuickLinkMenuDataSource();
        }
        
        dataSource = MenuDataSourceFactory.m_quickLinkMenuDataSource;   
    }
    
    return dataSource;
    
}

