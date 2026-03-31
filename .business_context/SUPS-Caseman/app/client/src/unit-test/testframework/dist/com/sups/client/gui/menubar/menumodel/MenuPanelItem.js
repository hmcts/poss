/**
 * Class MenuPanelItem
 *
 * This class is used to store the required information
 * about an item in a menu panel.
 *
 * The basic parameters are retrieved from the application config file,
 * but other parameters such as class will depend on the user's security roles.
 *
*/
function MenuPanelItem() {}

/**
 * Define class constants
 *
*/
MenuPanelItem.ITEM = "item";
MenuPanelItem.PANEL = "panel";
MenuPanelItem.DIVISION = "division";
MenuPanelItem.QUICK_LINK = "quickLink";
MenuPanelItem.FUNCTION = "function";

/**
 * Define instance variables
 *
 * Menu item identifier
*/
MenuPanelItem.prototype.m_id = null;


/**
 * Menu item type
 *
*/
MenuPanelItem.prototype.m_type = null;


/**
 * Menu item label
 *
*/
MenuPanelItem.prototype.m_label = null;


/**
 * Menu item destination 
 *
*/
MenuPanelItem.prototype.m_destination = null;

/**
 * Menu sub form identifier
 *
*/
MenuPanelItem.prototype.m_subformId = null;


/**
 * Menu item class
 *
*/
MenuPanelItem.prototype.m_class = null;

/**
 * Menu item guard function - used by quick link component
 *
*/
MenuPanelItem.prototype.m_guard = null;

/**
 * Menu item prepare function - used by quick link component
 *
*/
MenuPanelItem.prototype.m_prepare = null;

/**
 * Menu item function class name - used by function component
 *
*/
MenuPanelItem.prototype.m_functionClassName = null;

/**
 * Menu item function name - used by function component
 *
 */
MenuPanelItem.prototype.m_functionName = null;

/**
 * Menu item function parameters - used by function component
 *
*/
MenuPanelItem.prototype.m_functionParams = null;

/**
 * Menu item functional type - used to restrict menu entries of a 
 * particular function type
 *
*/
MenuPanelItem.prototype.m_functionType = null;

/**
 * Method returns function parameter values (when parameters present)
 * as an array of values suitable for passing to a function as an
 * argument list.
 *
 * @return Returns function parameter values as an array with value location
 *         controlled by "m_position" value defined for parameter.
 *
*/
MenuPanelItem.prototype.getFunctionParamValuesAsArgumentArray = function()
{
    var paramValueArray = null;
    
    if(null != this.m_functionParams)
    {
        var length = this.m_functionParams.length;
        
        if(length > 0)
        {
            // Define local variables
            var i;
            var functionParam;
            
            var maxPosition = 0;
            
            // Determine maximum position of value in array
            for( i = 0; i < length; i++ )
            {
                functionParam = this.m_functionParams[i];
                
                if(functionParam.m_position > maxPosition)
                {
                    maxPosition = functionParam.m_position;
                }
            }
            
            // Create array of appropriate size and set all values
            // to null initially
            paramValueArray = new Array( maxPosition + 1 );
            
            for( i = 0; i <= maxPosition; i++ )
            {
                paramValueArray[i] = null;
            }
            
            // Set array values to appropriate function parameter values
            for( i = 0; i < length; i++ )
            {
                functionParam = this.m_functionParams[i];
                
                paramValueArray[functionParam.m_position] = functionParam.m_value;
            }
            
        }
        
    }
    
    return paramValueArray;
}
