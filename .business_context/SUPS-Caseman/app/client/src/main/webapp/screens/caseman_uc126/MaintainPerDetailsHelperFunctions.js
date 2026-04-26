/** 
 * @fileoverview MaintainPerDetailsHelperFunctions.js:
 * This file contains the helper functions for UC126 - Maintain PER Details screen
 *
 * @author Chris Vincent
 * @version 0.1
 */

/**
 * Handles the exit from the screen back to the main menu
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form
 * @author rzxd7g
 * 
 */
function setDirtyFlag()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	if ( dirtyFlag != "true" )
	{
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "true");
	}
}

/*********************************************************************************/

/**
 * Function indicates whether or not the screen is in update mode
 *
 * @return boolean True if screen is in update mode, else false
 * @author rzxd7g
 */
function isScreenInUpdateMode()
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	return formState == FormStates.STATE_MODIFY;
}

/*********************************************************************************/

/**
 * Function returns the state of the data i.e. dirty or not
 *
 * @returns Boolean true if data is dirty, else false
 * @author rzxd7g
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	return (dirtyFlag == "true") ? true : false;
}

/*********************************************************************************/

/**
 * Function handles the clearing of the form's data
 * @author rzxd7g
 * 
 */
function clearFormData()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK);
	Services.endTransaction();
	Services.setFocus("Query_DetailCode");
}
