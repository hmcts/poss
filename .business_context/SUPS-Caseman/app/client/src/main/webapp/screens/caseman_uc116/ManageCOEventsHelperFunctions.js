/** 
 * @fileoverview ManageCOEventsHelperFunctions.js:
 * This file contains the helper functions for UC116 - Manage CO Events screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 26/07/2006 - Chris Vincent, made changes to loadCORecord() to include paging parameters.
 * 22/08/2006 - Chris Vincent, fixed defect 4566 where when a new event is added and the event description field
 * 				is invalid, the invalid value is not filtered through to the add popup.
 * 15/11/2006 - Chris Vincent, fixing Candidate Build Z issue 174 which requires the Creditor Name dropdown
 * 				on the Add Event popup to display "Debt [Number] - [Creditor Name] instead of just Creditor
 * 				Name which can have duplicates.  launchAddEventPopup() & setDebtNumbers() updated.
 * 15/11/2006 - Chris Vincent, fixing Candidate Build Z issue 211b which requires that the Foreign CO flag
 * 				is reset when the screen clears or exits.  clearAppParameters() updated.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearFormData() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 14/11/2007 - Chris Vincent, change to clearFormData() to include a call to reset the grid
 * 				sort order.  CaseMan defect 6464.
 * 15/01/2009 - Sandeep Mullangi - ServiceDays changes RFC0655
 */
 
/**
 * Uses the form lifecycle state xpath to determine if a valid CO record has been loaded
 * @returns boolean true if a valid record has been loaded
 * @author rzxd7g
 */
function isCORecordLoaded()
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	return formState == FormStates.STATE_MODIFY;
}

/*********************************************************************************/

/**
 * Indicates whether or not any events exist on the CO record
 * @returns boolean true if the master events grid is empty
 * @author rzxd7g
 */
function isEventGridEmpty()
{
	var countEvents = Services.countNodes(XPathConstants.DATA_XPATH + "/COEvents/COEvent");
	return countEvents == 0;
}

/*********************************************************************************/

/**
 * Function calls the service to retrieve the CO Record details
 * @author rzxd7g
 * 
 */
function loadCORecord()
{
	// Lazy Load the reference data required when a CO record is loaded
	loadCOReferenceData();
	
	var pageNumber = Services.getValue(XPathConstants.CO_PAGENUMBER_XPATH);
	if ( CaseManUtils.isBlank(pageNumber) )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.CO_PAGENUMBER_XPATH, pageNumber);
	}

	// Get the currently selected CO Number from the query popup
	var coNumber = Services.getValue(QueryPopup_CONumberGrid.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	params.addSimpleParameter("pageSize", COEventConstants.PAGE_SIZE);
	params.addSimpleParameter("pageNumber", pageNumber);
	Services.callService("getCoEvents", params, QueryPopup_OkButton, true);
}

/*********************************************************************************/

/**
 * Function will set the currently loaded CO Number in the xpath supplied.
 * Used when setting parameters for screens when navigating.
 * @param [String] xp The xpath to set the CO Number
 * @author rzxd7g
 * 
 */
function setCONumberToApp(xp)
{
	var coNumber = Services.getValue(Query_CONumber.dataBinding);
	Services.setValue(xp, coNumber);
}

/*********************************************************************************/

/**
 * Function clears the /ds/var/app parameters that are no longer required
 * @author rzxd7g
 * 
 */
function clearAppParameters()
{
	Services.startTransaction();
	Services.removeNode(ManageCOEventsParams.PARENT);
	Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
	Services.setValue(CaseManFormParameters.CODATA_OWNINGCOURTWARNING_XPATH, "");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function clears the temporary Add Event fields from the DOM
 * @author rzxd7g
 * 
 */
function clearAddEventFields()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.NEWEVENT_XPATH);
	Services.setValue(Master_COEventId.dataBinding, "");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function will create a call stack based upon the array of screens passed in
 * and then navigate to the first screen in the stack.
 * @param [Array] navArray An array of screens to navigate to
 * @author rzxd7g
 * 
 */
function navigateToScreen(navArray)
{
	if ( NavigationController.callStackExists() )
	{
		// Call stack already exists, maintain the current stack and branch out with new stack
		NavigationController.addToStack( navArray );
	}
	else
	{
		// Create new stack
		NavigationController.createCallStack( navArray );
	}

	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_NAVIGATE);
		Status_SaveButton.actionBinding();
	}
	else
	{
		NavigationController.nextScreen();
	}
}

/*********************************************************************************/

/**
 * Function checks if any changes have been made before exiting the screen
 * @author rzxd7g
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_EXIT);
		Status_SaveButton.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function calculates the service date if the service status is postal
 * @returns Date in the format YYYY-MM-DD
 * @author rzxd7g
 */
function calculatePostalServiceDate()
{
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
//	var futureDate = CaseManUtils.daysInFuture(today, 2, true);
//	var modelDate = CaseManUtils.convertDateToPattern(futureDate);
	return calculateWorkingDay(today, 2, true);
}

function calculateWorkingDay(today, reqWorkingDays, inFuture){
	var params = new ServiceParams();
	params.addSimpleParameter("serviceDate", CaseManUtils.convertDateToPattern(today, CaseManUtils.DATE_MODEL_FORMAT));
	params.addSimpleParameter("reqWorkingDays", 2);
	params.addSimpleParameter("inFuture", true);
	Services.callService("calculateWorkingDay", params, calculateWorkingDay, false);
	//return date in modelDate format
	return Services.getValue(XPathConstants.VAR_SERVICEDATE_XPATH);
}

calculateWorkingDay.onSuccess = function(dom){
	if(dom != null){
		var workingDate = dom.selectSingleNode("/ds/workingDay");
		if (workingDate != null){
		    Services.setValue(XPathConstants.VAR_SERVICEDATE_XPATH, workingDate.text);
		}
	}
}

calculateWorkingDay.onError = function(){
	alert(exception.message);
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
 * Function returns the state of the data i.e. dirty or not
 * @returns Boolean true if data is dirty
 * @author rzxd7g
 */
function isDataDirty()
{
	var dirtyFlag = Services.getValue(XPathConstants.DIRTYFLAG_XPATH);
	return (dirtyFlag == "true") ? true : false;
}

/*********************************************************************************/

/**
 * Function handles the exit from the screen, checking if a call stack exists.  If a 
 * stack does exist, then navigates to the next screen in the stack.  Else will 
 * navigate back to the CO Menu screen.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	clearAppParameters();
	if ( NavigationController.callStackExists() && NavigationController.getNextScreen() != NavigationController.CO_EVENTS_FORM )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		// return to the CO Menu screen
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function handles the launching of the add event popup and the setting of the popup's
 * default values
 * @author rzxd7g
 * 
 */
function launchAddEventPopup()
{
	Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	// Set popup data with default data
	Services.startTransaction();
	Services.setValue(AddEvent_DateReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.setValue(AddEvent_Details.dataBinding, "");
	Services.setValue(AddEvent_EventDate.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.setValue(AddEvent_EventId.dataBinding, Services.getValue(Master_COEventId.dataBinding) );
	var eventDescription = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_COEventId.dataBinding + "]/StandardEventDescription");
	Services.setValue(AddEvent_EventDescription.dataBinding, eventDescription );
	
	// Candidate Build Z Issue 174: Set the Debt Numbers
	setDebtNumbers();
	
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function handles the clearing of the form's data
 * @author rzxd7g
 * 
 */
function clearFormData()
{
	// Reset the grid sort order
	CaseManUtils.resetGridSortOrder("Master_COEventGrid");
	
	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	clearAppParameters();
	Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK);
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	
	Services.endTransaction();
	Services.setFocus("Query_CONumber");
}

/*********************************************************************************/

/**
 * Function handles the loading of a new CO Number from the Query Popup
 * @author rzxd7g
 * 
 */
function loadNewCONumberFromQuery()
{
	clearAppParameters();	// Clear any existing data
	Services.setValue( Master_COEventId.dataBinding, "" );
	Services.setValue( XPathConstants.CO_PAGENUMBER_XPATH, "" );
	Services.setValue( XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK );
	Services.dispatchEvent("QueryCO_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	loadCORecord();
}

/*********************************************************************************/

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzxd7g
 * 
 */
function handleAuthorizationException(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
	Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "false");
}

/*********************************************************************************/

/**
 * Function to call the reference data required when an AE record is loaded
 * @author rzxd7g
 * 
 */
function loadCOReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents") )
	{
		Services.callService("getCoEventList", params, manageCOEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/SystemDate") )
	{
		Services.callService("getSystemDate", params, manageCOEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/StageList") )
	{
		Services.callService("getIssueStageList", params, manageCOEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/ServiceList") )
	{
		Services.callService("getServiceStatusList", params, manageCOEvents, true);
	}
}

/*********************************************************************************/

/**
 * Function sets the Debt Numbers for the Debts in the list if not previously done
 * @author rzxd7g
 * 
 */
function setDebtNumbers()
{
	var countDebtNumbers = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt/DebtNumber");
	if ( countDebtNumbers == 0 )
	{
		var index = 1;
		var countDebts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt");
		for ( var i=0; i<countDebts; i++ )
		{
			// Candidate Build Z Issue 174 - Display 'Debt [Number] - [Creditor Name]' in dropdown.
			var creditorName = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[" + index + "]/CreditorName");
			var combiName = "Debt " + index + " - " + creditorName;
			Services.setValue( XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[" + index + "]/DebtNumber", index );
			Services.setValue( XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[" + index + "]/CombiName", combiName );
			index++;
		}
	}
}
