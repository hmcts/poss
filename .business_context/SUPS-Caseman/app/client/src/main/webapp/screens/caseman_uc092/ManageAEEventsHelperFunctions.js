/** 
 * @fileoverview ManageAEEventsHelperFunctions.js:
 * This file contains the helper functions for UC092 - Manage AE Events screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 26/07/2006 - Chris Vincent, made changes to loadAERecord() to include paging parameters.
 * 26/07/2006 - Chris Vincent, change made for defect 4021.  Removed launchAddEventPopup and 
 * 				added callNewEventValidationService.
 * 03/09/2007 - Chris Vincent, added checkOutstandingPaymentsExist() to replace the existing outstanding payments
 * 				validation in the MenuBarCode.  CaseMan Defect 6420.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearFormData() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 14/11/2007 - Chris Vincent, change to clearFormData() to include a call to reset the grid
 * 				sort order.  CaseMan defect 6464.
 * 15/01/2009 - Sandeep Mullangi - ServiceDays changes RFC0655
 * 29-07-2009 - Chris Vincent - Remove checkOutstandingPaymentsExist()  and associated onSuccess function as validation
 *		       check no longer required.  See TRAC Ticket 1155.
 * 25/11/2015 - Chris Vincent, added function isOraReportReprinted() for bulk printing.  Trac 5725
 */

/**
 * Uses the form lifecycle state xpath to determine if a valid AE record has been loaded
 * @returns boolean true if a valid record has been loaded
 * @author rzxd7g
 */
function isAERecordLoaded()
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	return formState == FormStates.STATE_MODIFY;
}

/*********************************************************************************/

/**
 * Indicates whether or not any events exist on the AE record
 * @returns boolean true if the master events grid is empty
 * @author rzxd7g
 */
function isEventGridEmpty()
{
	var countEvents = Services.countNodes(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent");
	return countEvents == 0;
}

/*********************************************************************************/

/**
 * Function calls the service to retrieve the AE Record details
 * @author rzxd7g
 * 
 */
function loadAERecord()
{
	// Lazy Load the reference data required when an AE record is loaded
	loadAEReferenceData();
	
	var pageNumber = Services.getValue(XPathConstants.AE_PAGENUMBER_XPATH);
	if ( CaseManUtils.isBlank(pageNumber) )
	{
		pageNumber = 1;
		Services.setValue(XPathConstants.AE_PAGENUMBER_XPATH, pageNumber);
	}

	// Get the currently selected aeNumber from the query popup
	var aeNumber = Services.getValue(QueryPopup_AENumberGrid.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("aeNumber", aeNumber);
	params.addSimpleParameter("pageSize", AEEventConstants.PAGE_SIZE);
	params.addSimpleParameter("pageNumber", pageNumber);
	Services.callService("getAeEvents", params, QueryPopup_OkButton, true);
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
	Services.removeNode(ManageAEEventsParams.PARENT);
	Services.removeNode(CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH);
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
	Services.setValue(Master_AEEventId.dataBinding, "");
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function will set the currently loaded Case Number in the xpath supplied.
 * Used when setting parameters for screens when navigating.
 * @param [String] xp The xpath to set the Case Number
 * @author rzxd7g
 * 
 */
function setCaseNumberToApp(xp)
{
	var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
	Services.setValue(xp, caseNumber);
}

/*********************************************************************************/

/**
 * Function will set the currently loaded AE Number in the xpath supplied.
 * Used when setting parameters for screens when navigating.
 * @param [String] xp The xpath to set the AE Number
 * @author rzxd7g
 * 
 */
function setAENumberToApp(xp)
{
	var aeNumber = Services.getValue(Query_AENumber.dataBinding);
	Services.setValue(xp, aeNumber);
}

/*********************************************************************************/

/**
 * Indicates whether or not the currently loaded Case record is MAGS ORDER
 * @returns boolean true if the Case record loaded is MAGS ORDER
 * @author rzxd7g
 */
function isMAGSOrderCase()
{
	if ( !isAERecordLoaded() )
	{
		return false;
	}
	var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
	return (caseNumber.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN) == 0) ? true : false;
}

/*********************************************************************************/

/**
 * Function will create a call stack based upon the array of screens passed in
 * and then navigate to the first screen in the stack.
 * @param [Array] navArray An array of screens to navigate to
 * @param [Boolean] checkDirty If set to false, will not perform dirty flag check
 * @author rzxd7g
 * 
 */
function navigateToScreen(navArray, checkDirty)
{
	var blnChkDirty = ( checkDirty == false) ? checkDirty : true;

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
	
	if ( blnChkDirty && isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
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
 * navigate back to the AE Menu screen.
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	// Additional clear required to remove relevant app params
	clearAppParameters();

	if ( NavigationController.callStackExists() && NavigationController.getNextScreen() != NavigationController.AE_EVENTS_FORM )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		// return to the AE Menu screen
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Function calls the service to retrieve validation data when creating a new AE Event.
 * @author rzxd7g
 * 
 */
function callNewEventValidationService()
{
	var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
	var aeNumber = Services.getValue(Query_AENumber.dataBinding);
	var eventId = Services.getValue(Master_AEEventId.dataBinding);

	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	params.addSimpleParameter("aeNumber", aeNumber);
	params.addSimpleParameter("eventId", eventId);
	Services.callService("getAeEventValidationData", params, Master_AddAEEventButton, true);
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
	CaseManUtils.resetGridSortOrder("Master_AEEventGrid");

	Services.startTransaction();
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH);
	clearAppParameters();
	Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK);
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	
	Services.endTransaction();
	Services.setFocus("Query_CaseNumber");
}

/*********************************************************************************/

/**
 * Function handles the loading of a new AE Number from the Query Popup
 * @author rzxd7g
 * 
 */
function loadNewAENumberFromQuery()
{
	clearAppParameters();	// Clear any existing data
	Services.setValue( Master_AEEventId.dataBinding, "" );
	Services.setValue( XPathConstants.AE_PAGENUMBER_XPATH, "" );
	Services.setValue( XPathConstants.FORM_STATE_XPATH, FormStates.STATE_BLANK );
	Services.dispatchEvent("QueryAE_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	loadAERecord();
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
function loadAEReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents") )
	{
		Services.callService("getAeEventList", params, manageAEEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/SystemDate") )
	{
		Services.callService("getSystemDate", params, manageAEEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/StageList") )
	{
		Services.callService("getIssueStageList", params, manageAEEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/ServiceList") )
	{
		Services.callService("getServiceStatusList", params, manageAEEvents, true);
	}
}

/*********************************************************************************/

/**
 * Function to call the reference data required when the PER/NDR details popup is raised
 * @author rzxd7g
 * 
 */
function loadPERNDRReferenceData()
{
	var params = new ServiceParams();
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CalculatedPeriods") )
	{
		Services.callService("getCalculatedPeriods", params, manageAEEvents, true);
	}
	if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency") )
	{
		Services.callService("getCurrentCurrency", params, manageAEEvents, true);
	}
}

/*********************************************************************************/

/**
 * Function to call the PER Report (from the navigation bar dropdown)
 * @author rzxd7g
 * 
 */
function runPERReport()
{
	var AENumber = Services.getValue(Query_AENumber.dataBinding);
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	var AEProcessingDate = CaseManUtils.convertDateToPattern(today, CaseManUtils.DATE_DISPLAY_FORMAT);

	var dom = Reports.createReportDom("CM_PER_R1.rdf");			
	Reports.setValue(dom, "P_AE_NUMBER",  AENumber );											
	Reports.setValue(dom, "P_AE_Processing_Date",  AEProcessingDate);								
	Reports.runReport(dom, false);
}

/*********************************************************************************/

/**
 * This function sets the LiveStatus flag for each AE on the Case loaded based on AE Events
 * If the AE has any of the following events it is not live:
 * 888: Application Dismissed
 * 889: Application withdrawn
 * 890: Application withdrawn/Fee Refunded
 * However, if the AE subsequentially has an event 900, it is live again.
 * The query returns the AE Events in order of creation, with the latest event first
 *
 * @param [Integer] countAEs The number of AEs returned in the query
 * @author rzxd7g
 * 
 */
function setAELiveStatusFlags(countAEs)
{
	Services.startTransaction();
	for ( var i=0; i<countAEs; i++ )
	{
		var aeRootXPath = XPathConstants.QUERY_XPATH + "/Results/AERecord[" + (i + 1) + "]";
		var countEvents = Services.countNodes(aeRootXPath + "/AEEvents/Event");
		var liveStatus = "Y";
		if ( countEvents > 0 )
		{
			var latestEventId = Services.getValue(aeRootXPath + "/AEEvents/Event[1]/EventId");
			liveStatus = ( latestEventId == "900" ) ? "Y" : "N";
		}
		Services.setValue(aeRootXPath + "/Live", liveStatus);
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * This function indicates if the order id passed in is an Oracle Report that can be
 * reprinted or if not should be displayed in a new Adobe Reader window.
 *
 * @param [Boolean] true if the report can be reprinted else false
 * @author rzxd7g
 * 
 */
function isOraReportReprinted(orderId)
{
	blnReprinted = true;
	for ( var i=0, l=AEEventConstants.ORA_REPS_NO_REPRINT.length; i<l; i++ )
	{
		if ( AEEventConstants.ORA_REPS_NO_REPRINT[i] == orderId )
		{
			// Order is in the array list that cannot be reprinted
			blnReprinted = false;
			break;
		}
	}
	return blnReprinted;
}