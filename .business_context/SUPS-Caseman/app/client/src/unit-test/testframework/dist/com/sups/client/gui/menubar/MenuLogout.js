/**
 * MenuLogout.js defines a simple class used to mimic the implementation
 * of a custom menu "Logout" function. In practice, more sophisticated functions
 * will be provided by the SUPS application developers.
 *
*/

function MenuLogout() {}

/**
 * Static method that logs user off application.
 *
 * @param formName               The name of the form to display after the user
 *                               has logged off. This is usually the "login" page.
 * @param raiseWarningIfDOMDirty Boolean flag indicating whether, or not, the
 *                               application should warn the user that there are
 *                               unsaved data.
 *
*/
MenuLogout.logoff = function( formName, raiseWarningIfDOMDirty )
{
    var localFormName = formName;
    var localRaiseWarningIfDOMDirty = raiseWarningIfDOMDirty;
    
    var callbackFunction = function( userResponse )
    {
        switch( userResponse )
        {
            case StandardDialogButtonTypes.OK:
            
                Services.logoff( localFormName, localRaiseWarningIfDOMDirty );
                break;
                
            default:
            
                break;
                
        }
        
    }
    
    var title = null;
    var message = "Framework logout test example. Select OK to logout.";
    
    Services.showDialog( StandardDialogTypes.OK_CANCEL,
                         callbackFunction,
                         message,
                         title );
                         
}