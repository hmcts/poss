/**
 * Super class for all menu data source classes
 *
*/

function MenuDataSource(){}

/**
 * Sub classes must implement this method
 *
*/
MenuDataSource.prototype.getMenuPanelItems = function()
{
    throw new ConfigurationException( "MenuDataSource.getMenuPanelItems(), please supply an implementation of this method in your sub-class" );
}