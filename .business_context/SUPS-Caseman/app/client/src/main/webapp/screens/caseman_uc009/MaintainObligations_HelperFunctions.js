/** 
 * @fileoverview MaintainObligations_HelperFunctions.js:
 * This file contains the helper functions for UC009 - Maintain Obligations screen
 *
 * @author Ian Stainer, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 13/06/2006 - Chris Vincent, made some changes to the section where Oracle Reports
 *				called to use CaseManFormParameters.ORNODE_XPATH instead of WPNODE_XPATH
 *				for when both Oracle Reports and Word Processing are called for an event.
 * 07/09/2006 - Frederik Vandendriessche, uct defect 498, multiple events creating outputs
 */

/**
 * Function indicates if the user has made any modifications
 *
 * @return [Boolean] True if changes have been made, else false
 * @author rzxd7g
 */
function changesMade()
{
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation[./Status = '" + Status.MODIFIED + "']";
	return Services.countNodes(xpath) > 0;
}

/***********************************************************************************/

/**
 * This function is called after a popup has been closed down.
 * Depending on the parameters passed to the screen popups are 
 * automatically launched. This function is called after a popup
 * has been closed down to set the screen mode so that enablement
 * rules will perform appropriately.
 * @author rzxd7g
 * 
 */
function setScreenMode()
{
	var maintenanceMode = Services.getValue(MaintainObligationsParams.MAINTENANCE_MODE);
	if ( maintenanceMode == MaintenanceMode.CREATE )
	{
		Services.setValue(XPathConstants.SCREEN_MODE_XPATH, ScreenMode.MAINTENANCE_CREATE);
	}
	else if ( maintenanceMode == MaintenanceMode.MODIFY )
	{
		Services.setValue(XPathConstants.SCREEN_MODE_XPATH, ScreenMode.MAINTENANCE_MODIFY);	
	}
}

/***********************************************************************************/

/**
 * This function determines if the entire screen should close down, based on the screen mode 
 * that is now set. This method is called from the auto launch popups after the popup has been closed
 * @author rzxd7g
 * 
 */
function processScreenClose()
{
	if (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_CREATE && 
		Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_MODIFY)
	{
		// The obligation rules determine that after closing the popup, the screen should exit
		Status_CloseBtn.actionBinding();
	}
}

/***********************************************************************************/

/**
 * Function handles the exiting of the Obligations screen
 * @author rzxd7g
 * @return null 
 */
function closeDownScreen()
{
	// Clear the Obligations params
	Services.removeNode(MaintainObligationsParams.PARENT);
	
	// If no call stack, return to the main menu
	if ( !NavigationController.callStackExists() )
	{
		Services.navigate(NavigationController.MAIN_MENU);
		return;
	}
	
	var nextScreen = NavigationController.getNextScreen();
	if ( nextScreen == NavigationController.WFT_FORM )
	{
		var wftMessage = Services.getValue(CaseManFormParameters.WFTMESSAGE_XPATH);
		if ( !CaseManUtils.isBlank(wftMessage) )
		{
			// If don't want to go to Window for Trial, skip screen and change nextScreen
			if (!confirm(wftMessage))
			{
				NavigationController.skipScreen();
				nextScreen = NavigationController.getNextScreen();
			}
		}
	}
	
	// nextScreen might have changed if rejected the chance to go to Window for Trial
	if ( nextScreen == NavigationController.WP_FORM )
	{
		// Skip screen so does not go to surrogate WP page
		NavigationController.skipScreen();
		nextScreen = NavigationController.getNextScreen();
		NavigationController.skipScreen();
		
		var navORAndWP = false;
		if ( nextScreen == NavigationController.OR_FORM )
		{
			// Navigating to Oracle Reports as well as Word Processing
			nextScreen = NavigationController.getNextScreen();
			NavigationController.skipScreen();
			navORAndWP = true;
		}
		
		// Make call to WP Controller
		Services.setValue(CaseManFormParameters.WPNODE_XPATH + "/Request", "Create");
		var wpNode = Services.getNode(CaseManFormParameters.WPNODE_XPATH);
		
		//defect uct caseman 241 fix
		var aenumber = Services.getValue("//ManageAEEvents/AENumber");
		var aeNumberNode = XML.createElement(wpNode,"AENumber");
		wpNode.selectSingleNode("/Event").appendChild(aeNumberNode);
		XML.setElementTextContent( wpNode, "./Event/AENumber", aenumber);
		//end defect uct caseman 241 fix
		
		var xxdom = Services.getNode("/ds/var/app/WPData2");
		/** TD 5842, 5844 **/
		var redirectAfterWP1 = true;
		var redirectAfterWP2 = true;
		
		if (null == xxdom) {
			redirectAfterWP2 = false;
			if (navORAndWP) {
				redirectAfterWP1 = false; }
		}
		else {
			if (navORAndWP) {
				redirectAfterWP1 = false;
				redirectAfterWP2 = false; }
			else {
			/**	redirectAfterWP1 = false;	**/
			}	
		}	
		
		/** End Of TD 5842, 5844 **/
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		WP.ProcessWP(FormController.getInstance(), wpDom, nextScreen, redirectAfterWP1);
		
		
		if (null != xxdom) WP.CheckForMoreEvents(FormController.getInstance(), xxdom, wpDom, nextScreen, redirectAfterWP2);
		
		Services.removeNode("/ds/var/app/WPData2");
		if ( navORAndWP )
		{
			// Call Oracle Reports as well as Word Processing
			Services.setValue(CaseManFormParameters.ORNODE_XPATH  + "/Request", "Create");
			var orNode = Services.getNode(CaseManFormParameters.ORNODE_XPATH);
			var orDom = XML.createDOM();
			orDom.loadXML(orNode.xml);
			WP.ProcessORA(FormController.getInstance(), orDom, nextScreen, true );
		}
	} 
	else if ( nextScreen == NavigationController.OR_FORM )
	{
		// Skip screen so does not go to surrogate OR page
		NavigationController.skipScreen();
		nextScreen = NavigationController.getNextScreen();
		//NavigationController.skipScreen();
		
		// Make call to WP Controller
		Services.setValue(CaseManFormParameters.ORNODE_XPATH  + "/Request", "Create");
		var orNode = Services.getNode(CaseManFormParameters.ORNODE_XPATH);
		var orDom = XML.createDOM();
		orDom.loadXML(orNode.xml);
		WP.ProcessORA(FormController.getInstance(), orDom, nextScreen, true );
	}	
	else
	{	
		NavigationController.nextScreen();
	}
}



/***********************************************************************************/

/**
 * Function Loads the application data for the screen
 * @author rzxd7g
 * @return null 
 */
function loadData()
{
	var externalCaseNumber = Services.getValue(MaintainObligationsParams.CASE_NUMBER);
	if ( CaseManUtils.isBlank( externalCaseNumber ) )
	{
		alert("No case number supplied so not calling any services.");
		return;
	}
	
	// Call retrieval service
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", externalCaseNumber);
	Services.callService(ObligationServices.RETRIEVAL_SERVICE, params, Header_CaseNumber, true);				
}

/***********************************************************************************/

/**
 * Function to clear out any data stored in the temporary area where
 * a new obligation is stored before the user clicks the ok/cancel button
 * @author rzxd7g
 * 
 */
function resetNewObligation()
{
	Services.startTransaction();
	Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/Days", "");
	Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/ExpiryDate", "");
	Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/Notes", "");
	Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/LastUpdateUser", "");
	Services.endTransaction();
}

/***********************************************************************************/

/**
 * Function to validate that the expiry date is not in the past.
 *
 * @param [String] xp The XPath for the expiry date to be validated
 * @return [ErrorCode] An appropriate error message if the date is invalid, else null
 * @author rzxd7g
 */
function validateExpiryDateNotInPast(xp)
{
	var ec = null;
	var value = Services.getValue(xp);
	var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));
	var date = CaseManUtils.createDate(value);
	
	// Check for a date in the past
	if ( null != date ) 
	{
		var compare = CaseManUtils.compareDates(today, date);
		if ( compare < 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg");
		}
	}
	return ec;	
}

/***********************************************************************************/

/**
 * Function checks the given date is not a non working day
 *
 * @param [String] date The Date to be validated in the format YYYY-MM-DD
 * @return [Boolean] True if the date is a non working day, else false
 * @author rzxd7g
 */
function isNonWorkingDate(date) 
{
 	var xpath = XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay/Date";
 	var nodes = Services.getNodes(xpath); 	
 	for ( var i=0, l=nodes.length; i<l; i++ ) 
 	{
 		var d = XML.getNodeTextContent(nodes[i]);
 		if ( date == d ) { return true; }
 	}
 	return false;
 }

/***********************************************************************************/

/**
 * Function returns the next unique surrogate identifier
 * @author rzxd7g
 * @return "S" + nextKey  
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/***********************************************************************************/

/**
 * This function determines whether or not to enable the header controls
 * If a case number is present then enable otherwise disable
 * 
 * @return [Boolean] True if the header fields can be enabled, else false
 * @author rzxd7g
 */
function enableHeader()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding));
}

/***********************************************************************************/

/**
 * This function determines whether or not to enable the detail controls
 * If there are obligations then the function returns true to enable otherwise
 * 
 * @return [Boolean] True if the Details fields can be enabled, else false.
 * @author rzxd7g
 */
function enableDetails()
{
	// The controls are always disabled when the screen mode is not maintenance create or maintenance modify
	if (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_CREATE && 
		Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_MODIFY)
	{
		return false;
	}

	// Disable fields if there are no Obligations
	var xpath = "/ds/MaintainObligations/Obligations/Obligation";
	return (Services.countNodes(xpath) > 0) ? true : false;
}

/***********************************************************************************/

/**
 * This function determines whether or not to set the detail controls to read only
 * If a case number is present then the function returns true to make read only
 * If a case number is absent the function returns false to make read/write
 *
 * @return [Boolean] True if the Details fields should be read only, else false
 * @author rzxd7g
 */
function readOnlyDetails()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	return CaseManUtils.isBlank(caseNumber) ? false : true;
}

/***********************************************************************************/

/**
 * Generic function to validate the various Days fields on the screen
 *
 * @param [Integer] days The Days value to be validated
 * @return [ErrorCode] An appropriate error code if the value is invalid, else null
 * @author rzxd7g
 */
function validateDays(days)
{
	var ec = null;
	var leadingMinus = false;
	
	// Check to see if the 1st character is a minus
	var firstChar = days.slice(0, 1);
	if (firstChar == "-")
	{
		// Remove the leading minus
		days = days.slice(1);
		leadingMinus = true;
	}
	
	// Test the string to see if it's a number
	if ( !CaseManValidationHelper.validateNumber(days) )
	{
		ec = ErrorCode.getErrorCode("CaseMan_maintainObligations_daysIncorrectFormat_Msg");
	}
	
	// Validate number is not negative
	if ( null == ec && leadingMinus)
	{
		ec = ErrorCode.getErrorCode("CaseMan_maintainObligations_daysNegative_Msg");
	}
	
	return ec;
}

/***********************************************************************************/

/**
 * Tests to see that the notes field has been entered for certain
 * obligation types. It is done this way because the notes control
 * becomes read only for obligations 10 & 21 and so does not appear
 * mandatory. The user uses the LOV control instead.
 *
 * @return [Boolean] True if the mandatory notes field has been completed, else false
 * @author rzxd7g
 */
function mandatoryNotesFieldEntered()
{
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	if ( obligationType == "10" || obligationType == "21" )
	{
		// The notes field must be entered
		var notes = Services.getValue(New_Obligation_Popup_Notes.dataBinding);
		if ( CaseManUtils.isBlank(notes) )
		{
			alert(Messages.NEW_OBL_ENTERNOTES_MESSAGE);
			return false;
		}
	}
	return true;
}

/***********************************************************************************/

/**
 * Advances a date control by the given number of days.
 * If the resulting date is a non-working day then a confirm dialog is launched
 * asking the user if he really wants to use the non-working day. He has the
 * option to use it or to use the first working day. 
 * @param days
 * @param formControl
 * @author rzxd7g
 * 
 */
function advanceDate(days, formControl)
{
	var expiryDate = new Date();
	expiryDate.setDate(expiryDate.getDate() + days);
	
	var supsModelDate = CaseManUtils.convertDateToPattern(expiryDate, "YYYY-MM-DD")
	// We simply set the date in the form control here. This will trigger the validate method
	// in which the checkNonWorkingDate function will be called
	Services.setValue(formControl.dataBinding, supsModelDate);		
}

/***********************************************************************************/

/**
 * Function handles the situation whereby the user selects a non working day for the
 * Expiry date.  The user is presented with a choice of using the non working day
 * or using the next available working day.
 *
 * @param [Date] expiryDate The expiry date object to be tested
 * @param [String] xp The Xpath where the new expiry date should be written to
 * @author rzxd7g
 * 
 */
function checkNonWorkingDate(expiryDate, xp)
{
	// If the expiry date is a non-working days then tell the user
	if ( expiryDate.getDay() == DayConstants.SATURDAY || expiryDate.getDay() == DayConstants.SUNDAY || 
		 isNonWorkingDate( CaseManUtils.convertDateToPattern(expiryDate, "YYYY-MM-DD") ) )
	{
		// Get back a formatted message with parameters substituted
		var msg = Messages.format(Messages.NONWORKINGDAY_MESSAGE, new Array(expiryDate.toLocaleDateString()));	
		
		// If the user selected the cancel button then execute this code
		if ( !confirm(msg) )
		{
			// Advance the expiry date to the first working day
			while ( expiryDate.getDay() == DayConstants.SATURDAY || 
					expiryDate.getDay() == DayConstants.SUNDAY || 
					isNonWorkingDate( CaseManUtils.convertDateToPattern(expiryDate, "YYYY-MM-DD") ) )
			{
				expiryDate.setDate(expiryDate.getDate() + 1);
			}				
		}
	}
	
	var supsModelDate = CaseManUtils.convertDateToPattern(expiryDate, "YYYY-MM-DD")
	Services.setValue(xp, supsModelDate);
}
