/** 
 * @fileoverview WindowForTrialHelperFunctions.js:
 * This file contains the helper functions for UC024 - Maintain Window for Trial screen
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 09/11/2006 - Chris Vincent, fixed candidate release Z issue #197 by removing code
 * 				in the else statement of exitScreen().  In theory, this code shouldn't
 * 				be reached in live, but if it ever did, now will not fall over, instead
 * 				will return to the Main Menu.
 */

/**
 * Calls the main retrieval service using the case number in the app section of the DOM
 * @author rzxd7g
 * 
 */
function retrieveCaseData()
{
	var caseNumber = Services.getValue(MaintainWftParams.CASE_NUMBER);
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getWft", params, windowForTrial, true);
}

/*********************************************************************************/

/**
 * Function generates an array of all the working dates between the two dates provided
 *
 * @param String start The start date in the DOM format YYYY-MM-DD
 * @param String end The end date in the DOM format YYYY-MM-DD
 * @returns String[] An array of all working dates between the two dates provided
 * @author rzxd7g
 */
function getDateArray(start, end)
{
    var startDate = CaseManUtils.createDate(start);
	var endDate = CaseManUtils.createDate(end);
	var dateArray = new Array();
	var tempDate;
	
	while (	CaseManUtils.compareDates(startDate, endDate) != -1)
	{
		// Check is not a weekend
		if (startDate.getDay() != 0 && startDate.getDay() != 6)
		{
			// Check for non working days
			tempDate = CaseManUtils.convertDateToPattern( startDate, CaseManUtils.DATE_MODEL_FORMAT);
			if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + tempDate + "']") )
			{
				dateArray[dateArray.length] = tempDate;
			}
		}
		startDate.setDate( startDate.getDate() + 1 );
	}
	return dateArray;
}

/*********************************************************************************/

/**
 * Function generates the next window for trial identifier on the case using the 
 * largest current window for trial identifier
 *
 * @returns integer The next window for trial identifier (unique to case)
 * @author rzxd7g
 */
function generateWFTId()
{
	var wftId = 0;
	var temp = "";
	for (var i=0, l=Services.countNodes(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial"); i<l; i++)
	{
		temp = parseInt(Services.getValue(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[" + (i+1) + "]/WFTId" ));
		if (temp > wftId)
		{
			wftId = temp;
		}
	}
	return (wftId + 1);
}

/*********************************************************************************/

/**
 * Function handles the exiting of the screen by clearing the form's parameters
 * in /ds/var/app and navigating to the next screen in the call stack
 * @author rzxd7g
 * 
 */
function exitScreen()
{
	Services.removeNode(MaintainWftParams.PARENT);
	if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		// Clear data and return to the Menu screen
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/*********************************************************************************/

/**
 * Prepares data to be written to the Event Details field for the Event being created.
 * Is used when navigating to WFT screen off the back of creating a Case Event.  Depending
 * upon the WFT created, the Case Event's Details field will be automatically populated.
 *
 * @param String wftXPathString The xpath to the window for trial record created
 * @param String startDate he start date of the WFT in the DOM format YYYY-MM-DD
 * @param String endDate The end date of the WFT in the DOM format YYYY-MM-DD
 * @param String datesExistValue Indicates whether or not the WFT has a start and end date
 * @author rzxd7g
 * 
 */
function setEventDetails(wftXPathString, startDate, endDate, datesExistValue)
{
	if ( Services.exists(MaintainWftParams.CASE_EVENT_SEQ) && !CaseManUtils.isBlank(Services.getValue(MaintainWftParams.CASE_EVENT_SEQ)) )
	{
		// If details has not been set yet, use the Details in the app section
		if ( !Services.exists(XPathConstants.EVENT_XPATH + "/EventDetails") || CaseManUtils.isBlank(Services.getValue(XPathConstants.EVENT_XPATH + "/EventDetails")) )
		{
			// Use getValidNodeValue so don't have string of "null" if blank
			var detailsText = CaseManUtils.getValidNodeValue( Services.getValue(MaintainWftParams.CASE_EVENT_DETS) );
		}
		else
		{
			var detailsText = Services.getValue(XPathConstants.EVENT_XPATH + "/EventDetails");			
		}

		// Create the new Event Details text string
		if (datesExistValue == "true")
		{
			detailsText = "WFT " + CaseManUtils.convertDateToDisplay(startDate) + " TO " + CaseManUtils.convertDateToDisplay(endDate) + " " + detailsText;
		}
		if ( !CaseManUtils.isBlank( Services.getValue(wftXPathString + "/CMCFlag") ) )
		{
			var cmcDate = Services.getValue(wftXPathString + "/CMCDate");
			if ( CaseManUtils.isBlank( cmcDate ) )
			{
				detailsText = "CMC NO DATE " + detailsText;
			}
			else
			{
				detailsText = "CMC " + CaseManUtils.convertDateToDisplay(cmcDate) + " " + detailsText;
			}
		}
		
		// Safety net to prevent the server call from failing, Details has a maximum length of 250 characters
		if (detailsText.length <= 250)
		{
			Services.startTransaction();
			Services.setValue(XPathConstants.EVENT_XPATH + "/CaseEventSeq", Services.getValue(MaintainWftParams.CASE_EVENT_SEQ) );
			Services.setValue(XPathConstants.EVENT_XPATH + "/EventDetails", detailsText);
			Services.endTransaction();
		}
	}
}

/*********************************************************************************/

/**
 * Function removes any included dates from the Windows for Trial so that only the Excluded
 * Dates are returned to the Server.
 *
 * @param DOM newNode The Blank DOM Object to use to create new nodes
 * @author rzxd7g
 * 
 */
function filterExcludedDates(newNode)
{
	var tempNode = null;
	var excludedDates = null;
	var datesGen = "";
	Services.startTransaction();
	for (var i=1, l=Services.countNodes(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial"); i<=l; i++)
	{
		// Find out if current WFT has included dates
		includedDates = Services.countNodes(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[" + i + "]/Dates/Date[./Excluded = 'false']");
		if ( includedDates > 0 )
		{
			// Get an array of all the excluded dates and replace the existing dates node with it
			tempNode = XML.createElement(newNode, "Dates");
			excludedDates = Services.getNodes(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[" + i + "]/Dates/Date[./Excluded = 'true']");
			for (var j=0, jl=excludedDates.length; j<jl; j++)
			{
				tempNode.appendChild(excludedDates[j]);
			}
			Services.replaceNode(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[" + i + "]/Dates", tempNode);
			tempNode = null;
			excludedDates = null;
		}
	}
	Services.endTransaction();
}

/*********************************************************************************/

/**
 * Function sets the dirty flag on the form to indicate changes have been made
 * @author rzxd7g
 * 
 */
function setChangesMade()
{
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "true")
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "true");
	}

	// If a WFT record is updated, set the WftExtractedForDm node to blank (if not already blank)	
	var extractedForDM = Services.getValue(XPathConstants.WFT_XPATH + "/WftExtractedForDm");
	if ( !CaseManUtils.isBlank(extractedForDM) )
	{
		Services.setValue(XPathConstants.WFT_XPATH + "/WftExtractedForDm", "");
	}
}

/*********************************************************************************/

/**
 * Returns the full day (e.g. MONDAY) for the date provided, used as a transform
 * function for a grid.
 *
 * @param String date The date in the DOM format YYYY-MM-DD
 * @returns String The full day of the date provided
 * @author rzxd7g
 */
function transformWFTDayForGrid(date)
{
	var d = CaseManUtils.createDate(date);
	return CaseManUtils.FULLWEEKDAYS[d.getDay()];
}

/*********************************************************************************/

/**
 * Returns the day (e.g. 1st) for the date provided, used as a transform
 * function for a grid.
 *
 * @param String date The date in the DOM format YYYY-MM-DD
 * @returns String The day of the date provided
 * @author rzxd7g
 */
function transformWFTDateForGrid(date)
{
	var d = CaseManUtils.createDate(date);
	return CaseManUtils.FULLDAYS[d.getDate()-1];
}

/*********************************************************************************/

/**
 * Returns the full month (e.g. JANUARY) for the date provided, used as a transform
 * function for a grid.
 *
 * @param String date The date in the DOM format YYYY-MM-DD
 * @returns String The full month of the date provided
 * @author rzxd7g
 */
function transformWFTMonthForGrid(date)
{
	var d = CaseManUtils.createDate(date);
	return CaseManUtils.FULLMONTHS[d.getMonth()];
}

/*********************************************************************************/

/**
 * Returns the full year (e.g. 2005) for the date provided, used as a transform
 * function for a grid.
 *
 * @param String date The date in the DOM format YYYY-MM-DD
 * @returns String The full year of the date provided
 * @author rzxd7g
 */
function transformWFTYearForGrid(date)
{
	var d = CaseManUtils.createDate(date);
	return d.getFullYear();
}

/*********************************************************************************/

/**
 * Generic validate days function which validates the WFT Days field
 *
 * @param String value The number of WFT days entered
 * @returns ErrorCode The invalid WFT day ErrorCode or null if valid
 * @author rzxd7g
 */
function validateDays(value)
{
	var ec = null;
	if ( !CaseManUtils.isBlank(value) )
	{
		if( !CaseManValidationHelper.validateNumber(value) || parseInt(value) < FormConstants.MIN_DAYS )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidWFTEstimatedDays_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

/**
 * Generic validate hours function which validates the WFT Hours field
 *
 * @param String value The number of WFT hours entered
 * @returns ErrorCode The invalid WFT hour ErrorCode or null if valid
 * @author rzxd7g
 */
function validateHours(value)
{
	var ec = null;
	if ( !CaseManUtils.isBlank(value) )
	{
		if( !CaseManValidationHelper.validateNumber(value) || 
			parseInt(value) < FormConstants.MIN_HOURS || 
			parseInt(value) > FormConstants.MAX_HOURS )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidWFTEstimatedHours_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

/**
 * Generic validate minutes function which validates the WFT Minutes field
 *
 * @param String value The number of WFT minutes entered
 * @returns ErrorCode The invalid WFT minutes ErrorCode or null if valid
 * @author rzxd7g
 */
function validateMinutes(value)
{
	var ec = null;
	if ( !CaseManUtils.isBlank(value) )
	{
		if( !CaseManValidationHelper.validateNumber(value) || 
			parseInt(value) < FormConstants.MIN_MINS || 
			parseInt(value) > FormConstants.MAX_MINS )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidWFTEstimatedMinutes_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

/**
 * Indicates whether or not any Window For Trials exist with a status of TRANSFERRED
 *
 * @returns boolean True if there is more than one WFT with a status of TRANSFERRED
 * @author rzxd7g
 */
function transferredWFTExist()
{
	return Services.countNodes(XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[./WFTStatus = '" + WFTStatusesEnum.TRANSFERRED + "']") > 0;
}

/*********************************************************************************/

/**
 * Function calculates the End Date of the WFT based upon the Start Date and the Track
 * entered.
 *
 * @param String track The WFT Track entered
 * @param Date startDate The start date entered as a Date object
 * @returns String The End Date in the DOM format YYYY-MM-DD
 * @author rzxd7g
 */
function getEndDateFromTrack(track, startDate)
{
	var endDate = "";
	switch (track)
	{
		case "FAST":
			endDate = CaseManUtils.convertDateToPattern( CaseManUtils.daysInFuture(startDate, FormConstants.FAST_TRACK_ENDDATE, false), CaseManUtils.DATE_MODEL_FORMAT);
			break;

		case "MULTI":
			endDate = CaseManUtils.convertDateToPattern( CaseManUtils.daysInFuture(startDate, FormConstants.MULTI_TRACK_ENDDATE, false), CaseManUtils.DATE_MODEL_FORMAT);
			break;

		default:
	}
	return endDate;
}

/**********************************************************************************/

/**
 * Sort function used by both the excluded date grids to sort the
 * months e.g. January, February etc.
 *
 * @param String a The first value to compare
 * @param String b The second value to compare
 * @returns integer The sort index based upon a comparison of the two values passed in
 * @author rzxd7g
 */
function sortMonths(a, b)
{
	for (var i=0; i<CaseManUtils.FULLMONTHS.length; i++)
	{
		if (a == CaseManUtils.FULLMONTHS[i])
		{
			var aIdx = i;
		}
		if (b == CaseManUtils.FULLMONTHS[i])
		{
			var bIdx = i;
		}
	}
	return (aIdx < bIdx) ? 1 : (aIdx > bIdx) ? -1 : 0;
}

/**********************************************************************************/

/**
 * Sort function used by both the excluded date grids to sort the
 * dates e.g. 1st, 2nd etc.
 *
 * @param String a The first value to compare
 * @param String b The second value to compare
 * @returns integer The sort index based upon a comparison of the two values passed in
 * @author rzxd7g
 */
function sortDates(a, b)
{
	for (var i=0; i<CaseManUtils.FULLDAYS.length; i++)
	{
		if (a == CaseManUtils.FULLDAYS[i])
		{
			var aIdx = i;
		}
		if (b == CaseManUtils.FULLDAYS[i])
		{
			var bIdx = i;
		}
	}
	return (aIdx < bIdx) ? 1 : (aIdx > bIdx) ? -1 : 0;
}

/**********************************************************************************/

/**
 * Sort function used by both the excluded date grids to sort the
 * week days e.g. monday, tuesday etc.
 *
 * @param String a The first value to compare
 * @param String b The second value to compare
 * @returns integer The sort index based upon a comparison of the two values passed in
 * @author rzxd7g
 */
function sortWeekDays(a, b)
{
	for (var i=0; i<CaseManUtils.FULLWEEKDAYS.length; i++)
	{
		if (a == CaseManUtils.FULLWEEKDAYS[i])
		{
			var aIdx = i;
		}
		if (b == CaseManUtils.FULLWEEKDAYS[i])
		{
			var bIdx = i;
		}
	}
	return (aIdx < bIdx) ? 1 : (aIdx > bIdx) ? -1 : 0;
}

/*********************************************************************************/

/**
 * Handles navigation away from the screen, if coming to WFT off the back of creating
 * a new Case Event, the next screen could be a Word Processing variable text screen.
 * @author rzxd7g
 * 
 */
function handleNavigation()
{
	var nextScreen = NavigationController.getNextScreen();
	if ( nextScreen == NavigationController.WP_FORM )
	{
		// Skip screen so does not go to surrogate WP page
		NavigationController.skipScreen();
		nextScreen = NavigationController.getNextScreen();
		NavigationController.skipScreen();
		
		// Make call to WP Controller
		Services.setValue(CaseManFormParameters.WPNODE_XPATH + "/Request", "Create");
		var wpNode = Services.getNode(CaseManFormParameters.WPNODE_XPATH);
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		WP.ProcessWP(FormController.getInstance(), wpDom, nextScreen, true);
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

/**
 * Function transforms the WFT Status in the DOM to the corresponding description
 *
 * @param [String] wftStatus The Window For Trial Status code
 * @return [String] The Window For Trial Status Decsription
 * @author rzxd7g
 */
function transformWFTStatusToDisplay(wftStatus)
{
	var statusExistsInRefData = Services.exists(XPathConstants.REF_DATA_XPATH + "/WFTStatuses/Status[./Value = '" + wftStatus + "']");
	if ( !statusExistsInRefData )
	{
		// The Status is does not exist in reference data so return the value
		return wftStatus;
	}
	
	// The status is in the reference data, retrieve the description and return it
	var wftStatusDesc = Services.getValue(XPathConstants.REF_DATA_XPATH + "/WFTStatuses/Status[./Value = '" + wftStatus + "']/Description");
	return wftStatusDesc;
}
