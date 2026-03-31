/**
 * MenuBack.js defines a simple class used to mimic the implementation
 * of a menu "Back" function. In practice, more sophisticated functions
 * will be provided by the SUPS application developers.
 *
*/

function MenuBack() {}

/**
 * Static method that drives back action
 *
*/
MenuBack.back = function()
{
    var callbackFunction = function( userResponse )
    {
        switch (userResponse)
        {
            case StandardDialogButtonTypes.OK:
            
                Services.navigate( "TestPageNavigation" );
                break;
                
            default:
                break;
        }
    }
    
    var fc = FormController.getInstance();
    
    var title = null;
    var message = "Framework back test example. Select OK to go back.";
    
    Services.showDialog(StandardDialogTypes.OK_CANCEL,
                        callbackFunction,
                        message,
                        title );
}