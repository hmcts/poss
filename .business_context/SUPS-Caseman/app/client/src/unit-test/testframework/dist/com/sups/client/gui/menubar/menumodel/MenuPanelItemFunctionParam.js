/**
 * Class MenuPanelItemFunctionParameters
 *
 * This class is designed to store the definition of one parameter
 * for a function invoked by the navigation menu. At present,
 * this definition comprises the name of the parameter and the
 * value of the parameter. The name is present for information only.
 *
 *
*/

function MenuPanelItemFunctionParam() {}

/**
 * Define allowed parameter types
 *
*/
MenuPanelItemFunctionParam.BOOLEAN = "boolean";
MenuPanelItemFunctionParam.STRING = "string";
MenuPanelItemFunctionParam.FLOAT = "float";
MenuPanelItemFunctionParam.INT = "int";

/**
 * Static method indicates whether, or not, a function parameter
 * type is valid.
 *
 * @param type The parameter type to be tested.
 *
 * @return Returns "true" if the parameter type is valid,
 *         otherwise "false".
 *
*/
MenuPanelItemFunctionParam.isValidType = function(type)
{
    var validType = null;
    
    var lowerCaseType = type.toLowerCase();
    
    switch (lowerCaseType)
    {
        case MenuPanelItemFunctionParam.STRING:
        case MenuPanelItemFunctionParam.BOOLEAN:
        case MenuPanelItemFunctionParam.FLOAT:
        case MenuPanelItemFunctionParam.INT:
        {
            validType = true;
            break;
        }
        
        default:
        {
            validType = false;
            break;
        }
    }
    
    return validType;
    
}

/**
 * Define instance members
 *
 * Name of function parameter
 *
*/
MenuPanelItemFunctionParam.prototype.m_name = null;

/**
 * Value of function parameter
 *
*/
MenuPanelItemFunctionParam.prototype.m_value = null;

/**
 * Position of parameter in function argument list
 *
*/
MenuPanelItemFunctionParam.prototype.m_position = null;

/**
 * Parameter data type
 *
*/
MenuPanelItemFunctionParam.prototype.m_type = null;