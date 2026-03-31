/**
 * Class NavigationMenuDataSource
 *
 * This class supplies data for the navigation menu
*/

function NavigationMenuDataSource() {}

NavigationMenuDataSource.prototype = new MenuDataSource();
NavigationMenuDataSource.prototype.constructor = NavigationMenuDataSource;

NavigationMenuDataSource.prototype.getMenuPanelItems = function(panelXPath)
{
    var ac = Services.getAppController();
    
    return ac.getMenuPanelItems(panelXPath);
}