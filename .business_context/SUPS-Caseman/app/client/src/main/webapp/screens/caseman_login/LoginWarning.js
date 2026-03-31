/** 
 * @fileoverview LoginWarning.js:
 * This file contains the configurations for the Login Warning screen
 *
 * @author Chris Vincent
 */

LoginWarning =
{
	dataBinding			:"/ds/var/form/LoginWarning/state",
	initialise			:function() {}
}

Status_ContinueButton = 
{
/**
 * @author rzxd7g
 * 
 */
	actionBinding: function() {
		Services.navigate(NavigationController.MAIN_MENU);

	},
 	additionalBindings: {
		eventBinding: {
			keys: [ { key: Key.F3, element: "LoginWarning"} ]
		}
	}	
}

Status_ExitButton = 
{
/**
 * @author rzxd7g
 * 
 */
	actionBinding: function() {

		Services.getAppController().exit();
	},
 	additionalBindings: {
		eventBinding: {
			keys: [ { key: Key.F4, element: "LoginWarning"} ]
		}
	}	
}
