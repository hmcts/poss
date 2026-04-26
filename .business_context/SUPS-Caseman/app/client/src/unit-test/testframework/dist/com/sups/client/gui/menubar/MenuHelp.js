/**
 * MenuHelp.js
 *
 * Class MenuHelp is a very simple class. It defines a class
 * with a static method that can be invoked to display
 * help information. In this case, the help information is
 * a simple standard dialog only. However, in the various SUPS
 * applications more complex help facilities will be defined.
 *
*/

function MenuHelp() {}

/**
 * Static method that displays help information
 *
*/
MenuHelp.help = function()
{
    var callbackFunction = function(userResponse)
    {
    }
    
    var fc = FormController.getInstance();
    
    var title = "Help";
    var message = "Framework help test example. Function: MenuHelp.help";
    
    Services.showDialog( StandardDialogTypes.OK,
                         callbackFunction,
                         message,
                         title );
}

/**
 * Define general function for test purposes
 *
*/
function help()
{
    var callbackFunction = function(userResponse)
    {
    }
    
    var fc = FormController.getInstance();
    
    var title = "Help";
    var message = "Framework help text example. Function : help";
    
    Services.showDialog( StandardDialogTypes.OK,
                         callbackFunction,
                         message,
                         title );
}