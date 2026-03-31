/**
 * MenuExit.js defines a simple class used to mimic the implementation
 * of a custom menu "Exit" function. In practice, more sophisticated functions
 * will be provided by the SUPS application developers.
 *
*/

function MenuExit() {}

/**
 * Static method that allows user to exit application
 *
*/
MenuExit.exit = function()
{
    var callbackFunction = function( userResponse )
    {
        switch ( userResponse )
        {
            case StandardDialogButtonTypes.OK:
            
                Services.getAppController().exit();
                break;
                
            default:
            
                break;
        }
        
    }
        
    var title = null;
    var message = "Framework exit test example. Select OK to exit.";
        
    Services.showDialog( StandardDialogTypes.OK_CANCEL,
                         callbackFunction,
                         message,
                         title );

}