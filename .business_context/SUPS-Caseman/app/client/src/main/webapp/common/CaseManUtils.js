/** 
 * @fileoverview CaseMan Utility Class - Helper class which implements
 * common utility functions.  All functions are static.
 *
 * @author Chris Vincent
 * @version 1.0 
 *
 * Change History
 * 08/06/2006 - Chris Vincent, added new Insolvency Case Type which included
 *				updating the function setPartiesForHeaderGrid()
 * 26/07/2006 - Chris Vincent, added a new key binding (CCBC Specific) to the show keys
 * 				popup ( function showKeys() ).
 * 23/08/2006 - Paul Roberts, changed transformamounttotwodp.  See defect 3880.
 * 16/01/2007 - Chris Vincent, added CaseManUtils.MCOL_CRED_CODE as part of UCT_Group2 Defect 1125
 * 23/01/2007 - Chris Vincent, added Currency constants and transform functions for the screens.
 *				Temp_CaseMan defect 309.
 * 20/09/2007 - Chris Vincent, added CaseManUtils.getBMSLiveDateObject() for CaseMan Defect 6317.
 * 02/11/2007 - Chris Vincent, added CaseManUtils.resetGridSortOrder() to reset a particular grid's
 * 				sort order to the grid's own defined default sort.  CCBC PPE Issue #8.
 * 09/11/2007 - Chris Vincent, added CaseManUtils.clearNavigationLinks() for UCT_Group2 Defect 1415
 * 04/08/2009 - Chris Vincent, DisplayDMSParams.PARENT added to list of xpaths to remove in the function
 *              CaseManUtils.clearNavigationLinks().  TRAC Ticket 1186.
 * 10/02/2010 - Mark Groen, add Xpath Constant for Oracle Report Court Code to CaseManUtils.clearNavigationLinks() - TRAC 2446
 * 02/08/2010 - Chris Vincent, added WP and Oracle Reports XPath Constants to be cleared in CaseManUtils.clearNavigationLinks()
 *				Trac 1947.
 * 19/09/2011 - Chris Vincent, added function CaseManUtils.isCCBCNationalCodedParty() to determine whether coded party code is
 *				a CCBC National Coded Party or not.  Trac 4553.
 * 05/12/2011 - Nilesh Mistry, added new insolvency case type of COMPANY ADMIN ORDERS and amended CaseManUtils.setPartiesForHeaderGrid
                                so that The Company is displayed in Events Party Grid. TRAC #4594
 */

/**
 * Constant array containing the days in the week, i.e. Sunday to Saturday.
 */
CaseManUtils.FULLWEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/**
 * Constant array containing the days in a month followed by 'st', 'nd', 'rd' or 'th'.
 */
CaseManUtils.FULLDAYS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th", "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];

/**
 * Constant array containing the full month names i.e. January to December.
 */
CaseManUtils.FULLMONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * Constant array containing the shortened month names i.e. Jan to Dec.
 */
CaseManUtils.MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Constant holding the displayed date format
 */
CaseManUtils.DATE_DISPLAY_FORMAT = "DD-MMM-YYYY";

/**
 * Constant holding the model date format
 */
CaseManUtils.DATE_MODEL_FORMAT = "YYYY-MM-DD";

/**
 * Constant for the CaseMan global court code
 */
CaseManUtils.GLOBAL_COURT_CODE = 0;

/**
 * Constant for the CCBC court code
 */
CaseManUtils.CCBC_COURT_CODE = 335;

/**
 * Constant for the MCOL Creditor Code
 */
CaseManUtils.MCOL_CRED_CODE = 1999;

/**
 * Constants for Currency symbols and codes
 */
CaseManUtils.CURRENCY_POUNDSYMBOL = "£";
CaseManUtils.CURRENCY_POUNDCODE = "GBP";
CaseManUtils.CURRENCY_EUROSYMBOL = "€";
CaseManUtils.CURRENCY_EUROCODE = "EUR";

/**
 * Constant array listing the new SUPS Insolvency Case Types
 */
CaseManUtils.INSOLV_CASETYPE_APPSETSTATDEMD = "APP TO SET STAT DEMD";
CaseManUtils.INSOLV_CASETYPE_CREDPET = "CREDITORS PETITION";
CaseManUtils.INSOLV_CASETYPE_DEBTPET = "DEBTORS PETITION";
CaseManUtils.INSOLV_CASETYPE_APPONDEBTPET = "APP ON DEBT PETITION";
CaseManUtils.INSOLV_CASETYPE_WINPET = "WINDING UP PETITION";
CaseManUtils.INSOLV_CASETYPE_APPINTORD = "APP INT ORD (INSOLV)";
CaseManUtils.INSOLV_CASETYPE_COMPANYADMINORDER = "COMPANY ADMIN ORDER";
CaseManUtils.INSOLVENCY_CASETYPE_LIST = [CaseManUtils.INSOLV_CASETYPE_APPSETSTATDEMD, CaseManUtils.INSOLV_CASETYPE_CREDPET, CaseManUtils.INSOLV_CASETYPE_DEBTPET, CaseManUtils.INSOLV_CASETYPE_WINPET, CaseManUtils.INSOLV_CASETYPE_APPINTORD, CaseManUtils.INSOLV_CASETYPE_COMPANYADMINORDER, CaseManUtils.INSOLV_CASETYPE_APPONDEBTPET];


/**
 * @constructor
 * @author rzxd7g
 * 
 */
function CaseManUtils()
{
}


/**
 * Outputs the DOM into the Logging window
 * @author rzxd7g
 * 
 */
CaseManUtils.showDOM = function()
{
	Logging.error("showDOM(): " + Services.getNode("/").xml);
}


/**
 * Static method that displays help information, specifically key bindings
 * @author rzxd7g
 * 
 */
CaseManUtils.showKeys = function()
{
    var callbackFunction = function(userResponse)
    {
    }
    
    var title = "<center>CaseMan Keys</center>";
    var message = "<table border=0>"
    				+ "<tr><td style=\"width: 160px;\"><b>F1</b></td><td>Search</td></tr>"
    				+ "<tr><td><b>F2</b></td><td>Create New Record</td></tr>"
    				+ "<tr><td><b>F3</b></td><td>Save Record</td></tr>"
    				+ "<tr><td><b>F4</b></td><td>Back</td></tr>"
    				+ "<tr><td><b>F5</b></td><td>&nbsp;</td></tr>"
    				+ "<tr><td><b>F6</b></td><td>Access LOV Popup</td></tr>"
    				+ "<tr><td><b>F7</b></td><td>&nbsp;</td></tr>"
    				+ "<tr><td><b>F8</b></td><td>Screen Specific Navigation Link</td></tr>"
    				+ "<tr><td><b>F9</b></td><td>Screen Specific Navigation Link</td></tr>"
    				+ "<tr><td><b>F10</b></td><td>Screen Specific Navigation Link</td></tr>"
    				+ "<tr><td><b>F11</b></td><td>Screen Specific Navigation Link</td></tr>"
    				+ "<tr><td><b>F12</b></td><td>Screen Specific Navigation Link</td></tr>"
    				+ "<tr><td><b>ALT A</b></td><td>Access Audit</td></tr>"
    				+ "<tr><td><b>ALT C</b></td><td>Clear Screen</td></tr>"
    				+ "<tr><td><b>ALT D</b></td><td>Delete Record</td></tr>"
    				+ "<tr><td><b>ALT M</b></td><td>Menu</td></tr>"
    				+ "<tr><td><b>ALT N</b></td><td>Next Record Set</td></tr>"
    				+ "<tr><td><b>ALT P</b></td><td>Previous Record Set</td></tr>"
    				+ "<tr><td><b>ALT Q</b></td><td>Open Quicklinks Dropdown</td></tr>"
    				+ "<tr><td><b>ALT Z</b></td><td>Zoom (Zoom Fields Only)</td></tr>"
    				+ "<tr><td><b>CTRL F1</b></td><td>Open Search Dialogue (CCBC Only)</td></tr>"
    				+ "<tr><td><b>ARROW KEYS</b></td><td>Navigate</td></tr>"
    				+ "<tr><td><b>TAB / SHIFT TAB</b></td><td>Next / Previous Field</td></tr>"
    				+ "</table>";
    
    Services.showDialog( StandardDialogTypes.OK,
                         callbackFunction,
                         message,
                         title );
}


/**
 * Returns the current system date, based on the getSystemDate server call.
 * If a valid date value exists at the OverrideSystem_Date XPath, then this is used in preference.
 * If there is a problem with the System date, the local computer's date is provided instead.
 *
 * @param {String} xp The XPath of the date brought back from the getSystemDate service
 * @returns returned date is in the format YYYY-MM-DD
 * @author rzxd7g
 */
CaseManUtils.getSystemDate = function(xp) 
{
	var date = null;
	var overrideDate = Services.getValue("/ds/var/app/OverrideSystemDate");
		
	if ( !CaseManUtils.isBlank(overrideDate) && null == FWDateUtil.validateXSDDate(overrideDate) )
	{
		// Use the override date
		date = overrideDate;
	}
	else
	{
		if ( null == xp )
		{
			// Invalid input
			return null;
		}
		else
		{
			// Get the date from the DOM
			date = Services.getValue(xp);
			if ( CaseManUtils.isBlank(date) )
			{
				// The xpath did not return a value, return local computer's date
				date = CaseManUtils.convertDateToPattern(new Date(), CaseManUtils.DATE_MODEL_FORMAT);
			}
		}
	}
	return date;
}


/**
 * Returns the previous working date, based on the getSystemDate server call.
 * If a valid date value exists at the OverrideSystem_Date XPath, then this is used in preference.
 * If there is a problem with the System date, the local computer's date is provided instead.
 *
 * @param {String} xp The XPath of the date brought back from the getSystemDate service
 * @returns returned date is in the format YYYY-MM-DD
 * @author rzxd7g
 */
CaseManUtils.getPreviousWorkingDate = function(xp) 
{
	var NewDate = CaseManUtils.createDate(CaseManUtils.getSystemDate(xp));
	
	NewDate.setDate( NewDate.getDate() - 1);
	
	// Use the friday before if previous date is a weekend
	while (NewDate.getDay() == 0 || NewDate.getDay() == 6)
	{
		NewDate.setDate( NewDate.getDate() - 1);
	}
	return CaseManUtils.convertDateToPattern(NewDate, CaseManUtils.DATE_MODEL_FORMAT);

}


/**
 * Returns the date passed in into the format DD-MMM-YYYY if the pattern 
 * passed in is "DD-MMM-YYYY" or in format YYYY-MM-DD if any other pattern is
 * passed in.
 * @param {Date} date The date object to convert
 * @param {String} pattern The pattern to return the date in
 * @returns The date string for the date
 * @author rzxd7g
 */
CaseManUtils.convertDateToPattern = function(date, pattern)
{
	var dateString;
	if ( pattern == CaseManUtils.DATE_DISPLAY_FORMAT )
	{
		// Return date in display format (DD-MMM-YYYY)
		dateString = FWDateUtil.ConvertDateToString(date);
	}
	else
	{
		// Return date in XSD format (YYYY-MM-DD)
		dateString = FWDateUtil.ConvertDateToXSDString(date);
	}
	return dateString;
}


/**
 * Remove trailing and leading whitespace from a variable textVal
 * MGG Amended 12/05/06 as the original functionality was removing all non alphanumeric
 * characters as well as whitespace - e.g. %!"^&*()
 * @param {String} textVal The text string
 * @returns The text string minus trailing and leading whitespace
 * @author rzxd7g
 */
CaseManUtils.stripSpaces = function(textVal)
{
	// return (null == textVal) ? null : (textVal.replace(/^\W+/,'')).replace(/\W+$/,'');
	return (null == textVal) ? null : (textVal.replace(/^\s+/,'')).replace(/\s+$/,'');
}


/**
 * Checks if the value passed in is null or blank
 * @param {String} i The text string
 * @returns true if the value passed in is null or blank
 * @author rzxd7g
 */
CaseManUtils.isBlank = function(pInputValue)
{
	var isItBlank = false;
	if ( null == pInputValue ){
		isItBlank =  true;
	}
	else{
	    var inputTypeAsString = pInputValue + '';
	    var tempStr = CaseManUtils.stripSpaces(inputTypeAsString);
	    if ( tempStr.length == 0 ) {
		        isItBlank =  true;
		}
		
	   	// mgg defect 3344  - "%" string is evaluated as ""from strip spaces
	    // Also changed multi returns as a result
	    // added if below so that it was impossible to have a string that contained just space.
	    if(isItBlank == true && pInputValue != ""){
	    	isItBlank =  false;
	    }
   	}

	return isItBlank;
}


/**
 * Converts date in DOM format (YYYY-MM-DD) to display format (DD-MON-YYYY)
 * @param {String} modelDate The date string in DOM Format
 * @returns the new date string or null if modelDate is blank
 * @author rzxd7g
 */
CaseManUtils.convertDateToDisplay = function(modelDate)
{
	if ( !CaseManUtils.isBlank(modelDate) && modelDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1 ) 
	{
		var dateObj = FWDateUtil.parseXSDDate(modelDate);
		return FWDateUtil.ConvertDateToString(dateObj);
	}
	return null;
}


/**
 * Converts time (e.g. 12:00) to seconds past midnight
 * @param {String} pTime The time string
 * @returns Number of seconds passed midnight
 * @author rzxd7g
 */
CaseManUtils.convertTimeToSeconds = function(pTime)
{ 
    var S1 = Date.parse(pTime+" 1/1/1970 GMT")/1000;

    if (CaseManUtils.isBlank(pTime) || isNaN(S1)) 
    {
        return null;
    }
    return S1;
}


/**
 * Utility function to help convert seconds to time
 * @param x
 * @author rzxd7g
 * @return (x<0||x>9?"", "0")+x 
 */
CaseManUtils.LZ = function(x)
{
	return(x<0||x>9?"":"0")+x
}

/**
 * Converts seconds to time (e.g. 12:00)
 * @param {int} pSeconds The number of seconds
 * @returns The seconds converted to time of day.
 * @author rzxd7g
 */
CaseManUtils.convertSecondsToTime = function(pSeconds) 
{ 
    if(CaseManUtils.isBlank(pSeconds) || isNaN(pSeconds) || !(pSeconds >= 0 && pSeconds <= 86399) ) {
        return null;
    }
    else 
    {
        var T1 = CaseManUtils.LZ(Math.floor(pSeconds/3600)) + ':' + CaseManUtils.LZ(Math.floor((pSeconds/60)%60));
        return T1;
    }
}


/**
 * Sort function to sort dates in a grid ascending i.e. oldest date first
 * Used in grid column sort: attribute e.g. {xpath: "EventDate", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate}
 * Note - This requires the use of the formatGridDate function in the transformToDisplay attribute so sort the dates correctly.
 * To work, CaseManUtils MUST be included in the HTML document BEFORE the form's own JavaScript file.
 * @param {String} a The first date to compare
 * @param {String} b The second date to compare
 * @returns 0, 1 or -1 depending upon the comparison between the two dates
 * @author rzxd7g
 */
CaseManUtils.sortGridDatesAsc = function(a,b)
{
	// Blank dates are listed last
	if ((a == null || a == "") && (b != null || b != "")){ 
		return  -1;
	}
	else if ((a != null || a != "") && (b == null || b == "")){
		return 1;
	}
	else if ((a == null || a == "") && (b == null || b == "")){
		return 0;
	}
	var Date1 = CaseManUtils.createDate(a);
	var Date2 = CaseManUtils.createDate(b);

	var difference = Date1 - Date2;
	if (difference < 0){
		return 1;
	}
	if (difference > 0){
		return -1;
	}
	else{
		return 0;
	}
}


/**
 * Sort function to sort dates in a grid descending i.e. youngest date first
 * Used in grid column sort: attribute e.g. {xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate}
 * Note - This requires the use of the formatGridDate function in the transformToDisplay attribute so sort the dates correctly.
 * To work, CaseManUtils MUST be included in the HTML document BEFORE the form's own JavaScript file.
 * @param {String} a The first date to compare
 * @param {String} b The second date to compare
 * @returns 0, 1 or -1 depending upon the comparison between the two dates
 * @author rzxd7g
 */
CaseManUtils.sortGridDatesDsc = function(a,b)
{
	return CaseManUtils.sortGridDatesAsc(b,a);
}


/**
 * Converts a null value to a blank string.  Is used when adding blank nodes into
 * the DOM which will result in an error if the node is null.
 * @param value The node value
 * @returns A blank string if the node value is null, else the original value
 * @author rzxd7g
 */
CaseManUtils.getValidNodeValue = function(value)
{
	return (null == value) ? "" : value;
}


/**
 * Formats the dates for grids into pattern dd-MMM-YYYY.  Is different to convertDateToDisplay
 * as this function returns "" and convertDateToDisplay returns null which you don't want to see
 * in a grid.
 *
 * @param {String} value The DOM Format Date string
 * @returns The date in display format or a blank string
 * @see #convertDateToDisplay
 * @author rzxd7g
 */
CaseManUtils.formatGridDate = function(value)
{	
	var correctDateFormat = CaseManUtils.convertDateToDisplay(value);
	if(correctDateFormat == null)
	{
		correctDateFormat = "";
	}
	return correctDateFormat;
}


/**
 * Returns a date a number of months before the date supplied
 * @param {Date} date The Date object to start from
 * @param {Int} months The number of months 
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.monthsInPast = function(date, months)
{
	var lastMonth = date.getMonth();
	var lastYear = date.getFullYear();
	
	for(var i = 0 ; i < months ; i++)
	{
		if(0 == lastMonth)
		{
			lastMonth = 11;
			lastYear--;
		}
		else
		{
			lastMonth--;
		}
	}
	return new Date(lastYear, lastMonth, date.getDate());
}


/**
 * Returns a date one month previous to the date supplied
 * @param {Date} date The Date object to start from
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.oneMonthEarlier = function(date)
{
    return CaseManUtils.monthsInPast(date, 1); 
}


/**
 * Returns a date one year previous to the date supplied
 * @param {Date} date The Date object to start from
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.oneYearEarlier = function(date)
{
    return CaseManUtils.monthsInPast(date, 12);
}


/**
 * Return a date x days from the date supplied.
 * @param {Date} date The Date object to start from
 * @param {int} days The number of days in the future
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.daysInFuture = function(date, days, weekend)
{
	var NewDate = date;
	NewDate.setDate( NewDate.getDate() + days );
	
	// Handle fields that cannot be a weekend
	if (!weekend)
	{
		// Use the monday after if weekend
		while (NewDate.getDay() == 0 || NewDate.getDay() == 6)
		{
			NewDate.setDate( NewDate.getDate() + 1);
		}
	}
	return NewDate;
}


/**
 * Return a date x days before the date supplied.
 * @param {Date} date The Date object to start from
 * @param {int} days The number of days in the past
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.daysInPast = function(date, days, weekend)
{
	var NewDate = date;
	NewDate.setDate( NewDate.getDate() - days );
	
	// Handle fields that cannot be a weekend
	if (!weekend)
	{
		// Use the monday after if weekend
		while (NewDate.getDay() == 0 || NewDate.getDay() == 6)
		{
			NewDate.setDate( NewDate.getDate() + 1);
		}
	}
	return NewDate;
}


/**
 * Return a date of date supplied plus 4 months
 * @param {Date} date The Date object to start from
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.fourMonthsInFuture = function(date, weekend)
{
	var month = date.getMonth() + 4;
	var year = date.getFullYear();
	var day = date.getDate();

	if(month > 11)
	{
		month = (month - 12);
		year++;
	}
	var newDate = new Date(year, month, day);

	// Handle fields that cannot be a weekend
	if (!weekend)
	{
		// Use the friday before if weekend
		while (newDate.getDay() == 0 || newDate.getDay() == 6)
		{
			newDate.setDate(day--);
		}
	}
	return newDate;
}


/**
 * Returns the last date of the month, based on the getSystemDate server call.
 * @param {Date} date The Date object to start from
 * @param {boolean} weekend True if new date can fall on a weekend
 * @returns A Date object
 * @author rzxd7g
 */
CaseManUtils.getLastDateOfMonth = function(xp, weekend)
{
	var date = CaseManUtils.createDate(CaseManUtils.getSystemDate(xp));
	var month = date.getMonth();
	var year = date.getFullYear();
	var day = CaseManUtils.getLastDayOfMonth(date);

	var newDate = new Date(year, month, day);

	// Handle fields that cannot be a weekend
	if (!weekend)
	{
		// Use the friday before if weekend
		while (newDate.getDay() == 0 || newDate.getDay() == 6)
		{
			newDate.setDate(day--);
		}
	}
	return newDate;

}


/**
 * Return the last day of the month
 * @param {Date} date The Date object to start from
 * @returns int
 * @author rzxd7g
 */
CaseManUtils.getLastDayOfMonth = function (date) 
{
   // returns the last day of a given month
    var m = new Number(date.getMonth());
    var y = new Number(date.getYear());

    var tmpDate = new Date(y, m, 28);
    var checkMonth = tmpDate.getMonth();
    var lastDay = 27;

    while(lastDay <= 31){
        temp = tmpDate.setDate(lastDay + 1);
        if(checkMonth != tmpDate.getMonth())
            break;
        lastDay++
    }
    return lastDay;
}


/**
 * Capitalize the first letters of every word in the string provided and convert
 * all other letters to lower case.
 * @param {String} theString The string to be converted
 * @returns The converted string
 * @author rzxd7g
 */
CaseManUtils.superInitCaps = function(theString)
{
	theString = theString.toLowerCase();
	var re=/(^.|\s.)/gi;
	var arr=theString.match(re);
	for ( var i=0, l=arr.length; i<l; i++ )
	{
		theString=theString.replace(arr[i],arr[i].toUpperCase());
	}
	var re=/(Mc(.)|Mac(.)|'(.)|-(.))/g;
	var arr=theString.match(re);
	if (arr)
	{
		for ( var i=0, l=arr.length; i<l; i++ )
		{
			theString = theString.replace(arr[i],arr[i].substring(0,arr[i].length-1)+(arr[i].substring(arr[i].length-1,arr[i].length)).toUpperCase());
		}
	}
	return theString;
}


/**
 * Compares two dates passed in
 * all other letters to lower case.
 * @param {Date} date1 The first date
 * @param {Date} date2 The second date
 * @returns 1 if date1 is BEFORE date2, -1 if date1 is AFTER date2 or 0 if dates are the same
 * @author rzxd7g
 */
CaseManUtils.compareDates = function(date1, date2)
{		
	// Compare years
	var date1Year = date1.getFullYear();
	var date2Year = date2.getFullYear();
	
	if (date1Year < date2Year) {return 1;}
	if (date1Year > date2Year) {return -1;}
	
	// ... then months
	var date1Month = date1.getMonth();
	var date2Month = date2.getMonth();
	
	if (date1Month < date2Month) {return 1;}
	if (date1Month > date2Month) {return -1;}
	
	// ... then days
	var date1Day = date1.getDate();
	var date2Day = date2.getDate();
	
	if (date1Day < date2Day) {return 1;}
	if (date1Day > date2Day) {return -1;}
	
	// dates must be equal 
	return 0;
	
}


/**
 * Create a Date object from the value passed in in the format DD-MMM-YYYY or 
 * YYYY-MM-DD
 * @param {String} aValue DateString to be converted into a Date object
 * @returns A Date object or null if an incorrect string is passed in.
 * @author rzxd7g
 */
CaseManUtils.createDate = function(aValue)
{	
	var elementValue = aValue;
	
	if( elementValue == null || elementValue.length <1 )
	{
		// Should never get here since must associate a PatternMatchValidator with date fields!
		var noDateDataError = new Error("No Date data present to create a Date!");
		throw noDateDataError;
	}

	var dateObj = null;
	if ( elementValue.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1 )
	{
		// Convert XSD date to date object
		dateObj = FWDateUtil.parseXSDDate(elementValue);
	}
	else if ( elementValue.search(CaseManValidationHelper.DDMMMYYYY_DATE_PATTERN) != -1 )
	{
		// Convert Display date to date object
		dateObj = FWDateUtil.parseDate(elementValue);
	}
	else
	{
		dateObj = new Date();
	}

	return dateObj;
}


/**
 * Returns a user parameter e.g. User name, security role or owning court
 *
 * @param {String} xp xpath of the user parameter
 * @param {String} defaultValue Optional parameter for setting a default value in the absence of a user parameter
 * @returns Value of the user parameter or default value if specified
 * @author rzxd7g
 */
CaseManUtils.getUserParameter = function(xp, defaultValue)
{
	var value = Services.getValue(xp);
	if ( !CaseManUtils.isBlank(value) )
	{
		return value;
	}
	return CaseManUtils.isBlank(defaultValue) ? "" : defaultValue;
}


/**
 * Returns a currency amount to two decimal places
 * @param {Integer} value Amount to be converted
 * @param {Integer} maxLength Maximum length of the amount field
 * @returns The currency amount to two decimal places.
 * @author rzxd7g
 */
CaseManUtils.transformAmountToTwoDP = function(value, maxLength)
{
	if(isNaN(value))
	{
		return value;
	}
	
	var fVal = parseFloat(value).toFixed(2);
	if (null != maxLength && fVal.length > maxLength)
	{
		return value;
	}
	return CaseManUtils.isBlank(value) ? "" : fVal;	
}


/**
 * Function indicates if the case type passed in is an Insolvency Case Type
 *
 * @returns [String] caseType The case type to test
 * @returns [Boolean] true if case is an insolvency case
 * @param caseType
 * @author rzxd7g
 */
CaseManUtils.isInsolvencyCase = function(caseType)
{
	if ( CaseManUtils.isBlank(caseType) )
	{
		return false;
	}

	var blnIns = false;
	for ( var i=0, l=CaseManUtils.INSOLVENCY_CASETYPE_LIST.length; i<l; i++ )
	{
		if ( CaseManUtils.INSOLVENCY_CASETYPE_LIST[i] == caseType )
		{
			blnIns = true;
			break;
		}
	}
	return blnIns;
}


/**
 * Generic function which sets a display flag for each party in the list indicating whether
 * or not the party should be displayed in the screen's header party grid based upon the case
 * type.  For insolvency cases, different parties are displayed in the grid, whereas non 
 * insolvency cases should display only claimants and defendants.
 *
 * The screen's party grid should have a srcDataOn of rootPartyXPath + "/DisplayInHeader" and
 * the rowXPath should look like this: "Party[./DisplayInHeader = 'true']"
 *
 * @param [String] caseType The case type of the case on the screen 
 * @param [String] rootPartyXPath The root xpath to the party nodes (e.g. /ds/Data/Parties/Party)
 * @param [String] partyRoleCodeXPath The xpath under the Party node for the party role code 
 * @param [Boolean] showSolicitor True if the solicitors are to be displayed
 * @author rzxd7g
 * 
 */
CaseManUtils.setPartiesForHeaderGrid = function(caseType, rootPartyXPath, partyRoleCodeXPath, showSolicitor)
{
	var isInsolvencyCase = CaseManUtils.isInsolvencyCase(caseType);
	var partyTypeCode = null;
	var blnSubject = null;
	
	Services.startTransaction();
	var countParties = Services.countNodes(rootPartyXPath);
	for ( var i=1; i<=countParties; i++ )
	{
		partyTypeCode = Services.getValue( rootPartyXPath + "[" + i + "]/" + partyRoleCodeXPath );
		switch ( partyTypeCode )
		{
			case PartyTypeCodesEnum.CLAIMANT:
			case PartyTypeCodesEnum.DEFENDANT:
				// Claimants and Defendants should always be displayed for non insolvency cases
				blnSubject = ( isInsolvencyCase ) ? "false" : "true";
				break;
				
			case PartyTypeCodesEnum.DEBTOR:
				// Debtors should be displayed if the case type is CREDITOR/DEBTOR PETITION/APP INTERIM ORD (Insolvency)
				blnSubject = ( caseType == CaseManUtils.INSOLV_CASETYPE_CREDPET || 
							   caseType == CaseManUtils.INSOLV_CASETYPE_DEBTPET ||
							   caseType == CaseManUtils.INSOLV_CASETYPE_APPONDEBTPET ||
							   caseType == CaseManUtils.INSOLV_CASETYPE_APPINTORD ) ? "true" : "false";
				break;
				
			case PartyTypeCodesEnum.THE_COMPANY:
				// The Company party should be displayed if the case type is WINDING UP PETITION/COMPANY ADMIN ORDER (Insolvency)
				blnSubject = ( caseType == CaseManUtils.INSOLV_CASETYPE_WINPET || caseType == CaseManUtils.INSOLV_CASETYPE_COMPANYADMINORDER ) ? "true" : "false";				
				break;
				
			case PartyTypeCodesEnum.APPLICANT:
				// The Applicant party should be displayed if the case type is APP TO SET STAT DEMD (Insolvency)
				blnSubject = ( caseType == CaseManUtils.INSOLV_CASETYPE_APPSETSTATDEMD ) ? "true" : "false";				
				break;

			case PartyTypeCodesEnum.SOLICITOR:
				// Solicitor parties only displayed for CCBC
				blnSubject = ( showSolicitor == true ) ? "true" : "false";	
				break;
				
			case PartyTypeCodesEnum.TRUSTEE:
				// Trustees should be displayed on insolvency case types except for APP TO SET STAT DEMD
				blnSubject = ( caseType == CaseManUtils.INSOLV_CASETYPE_CREDPET || 
							   caseType == CaseManUtils.INSOLV_CASETYPE_DEBTPET ||
							   caseType == CaseManUtils.INSOLV_CASETYPE_APPONDEBTPET ||
							   caseType == CaseManUtils.INSOLV_CASETYPE_APPINTORD ||
							   caseType == CaseManUtils.INSOLV_CASETYPE_WINPET || 
							   caseType == CaseManUtils.INSOLV_CASETYPE_COMPANYADMINORDER) ? "true" : "false";
				break;

			default:
				// Any other party type is not displayed
				blnSubject = "false";
				break;
		}
		Services.setValue(rootPartyXPath + "[" + i + "]/DisplayInHeader", blnSubject);
	}
	Services.endTransaction();
}


/**
 * Function returns the current user's alias stored in /ds/var/app
 *
 * @returns [String] The user's alias, else null if not available
 * @author rzxd7g
 */
CaseManUtils.getCurrentUserAlias = function()
{
	var userAlias = Services.getValue(CaseManFormParameters.USER_ALIAS_XPATH);
	return CaseManUtils.isBlank(userAlias) ? null : userAlias;
}

/**
 * This function ensures that a currency is in the correct format. e.g. nnn.nn
 *
 * @param pValue the value to display
 * @return value for display
 * @author rzxd7g
 */
CaseManUtils.transformCurrency = function(pValue)
{
	var returnValue = pValue;	
	if(returnValue != null && returnValue != ""){
		var fVal = parseFloat(pValue).toFixed(2);
		
		if(!isNaN(fVal)){
			returnValue = CaseManUtils.isBlank(pValue) ? "" : fVal;
		}		
	}
	return returnValue;
}

/**
 * This function transforms a currency value (e.g. GBP/EUR) to the display format e.g. £
 *
 * @param currencyCode The currency code from the model (e.g. GBP)
 * @param defaultXPath The Xpath for the default currency if the currencyCode is blank
 * @param defaultSymbol The default symbol to be used if the currencyCode is blank
 * @return The currency symbol to display (e.g. £)
 * @author Chris Vincent
 */
CaseManUtils.transformCurrencySymbolToDisplay = function(currencyCode, defaultXPath, defaultSymbol)
{
	// Identify the Currency symbol to return for display
	var returnValue = null;
	switch (currencyCode)
	{
		case CaseManUtils.CURRENCY_POUNDCODE:
			returnValue = CaseManUtils.CURRENCY_POUNDSYMBOL;
			break;
		case CaseManUtils.CURRENCY_EUROCODE:
			returnValue = CaseManUtils.CURRENCY_EUROSYMBOL;
			break;
		default:
			// By default set the default currency to Pounds
			var defaultCurrency = CaseManUtils.CURRENCY_POUNDSYMBOL;
			if ( null != defaultXPath )
			{
				// An xpath to the default currency in the database has been specified
				defaultCurrency = Services.getValue(defaultXPath);
			} 
			else if ( null != defaultSymbol )
			{
				// An alternative for the default has been specified (e.g. blank)
				defaultCurrency = defaultSymbol;
			}
			returnValue = defaultCurrency;
	}
	return returnValue;
}

/**
 * This function transforms a currency symbol (e.g. £) to the model format e.g. GBP
 *
 * @param currencySymbol The currency symbol from the display (e.g. £)
 * @param defaultXPath The Xpath for the default currency if the currencySymbol is blank
 * @param defaultCode The default code to be used if the currencySymbol is blank
 * @return The currency code to return to the model (e.g. GBP)
 * @author Chris Vincent
 */
CaseManUtils.transformCurrencySymbolToModel = function(currencySymbol, defaultXPath, defaultCode)
{
	// Identify the Currency Code to return for display
	var returnValue = null;
	switch (currencySymbol)
	{
		case CaseManUtils.CURRENCY_POUNDSYMBOL:
			returnValue = CaseManUtils.CURRENCY_POUNDCODE;
			break;
		case CaseManUtils.CURRENCY_EUROSYMBOL:
			returnValue = CaseManUtils.CURRENCY_EUROCODE;
			break;
		default:
			// By default set the default currency to Pounds
			var defaultCurrency = CaseManUtils.CURRENCY_POUNDCODE;
			if ( null != defaultXPath )
			{
				// An xpath to the default currency in the database has been specified
				defaultCurrency = Services.getValue(defaultXPath);
			} 
			else if ( null != defaultCode )
			{
				// An alternative for the default has been specified (e.g. blank)
				defaultCurrency = defaultCode;
			}
			returnValue = defaultCurrency;
	}
	return returnValue;
}

/**
 * This function returns a date object representing the BMS Live Date.  The BMS Live Date is
 * stored in the SYSTEM_DATA table as a number in the format YYYYMMDD and first needs to be 
 * transformed. 
 *
 * @param bmsLiveDateXPath The Xpath for the BMS Live Date
 * @return [Date] Date object for the BMS Live Date
 * @author Chris Vincent
 */
CaseManUtils.getBMSLiveDateObject = function(bmsLiveDateXPath)
{
	var dateParseRegex = /^(\d{4})(\d{2})(\d{2})$/;
	var bmsLiveDateString = Services.getValue(bmsLiveDateXPath);
	var bmsLiveDateObj = dateParseRegex.exec(bmsLiveDateString) ? new Date (RegExp.$1, (RegExp.$2 - 1), RegExp.$3, 0, 0, 0): null;
	return bmsLiveDateObj;
}

/**
 * This function returns the grid's sort order back to its initial state
 *
 * @param pGridName The identifier of the grid to be reset
 * @author rzxd7g
 */
CaseManUtils.resetGridSortOrder = function(pGridName)
{
	// Get the grid object
	var gridObject = Services.getAdaptorById(pGridName);
	if ( null != gridObject )
	{
		// Publish an event to render the current column as not selected
		gridObject.publishColumnRenderEvent(gridObject.m_model.getSelectedColumn(), null);
		
		var sortDirection = null;
		var initialSortingColumn = 0;
		for(var j=0,l=gridObject.columns.length; j<l; j++)
		{
			var col = gridObject.columns[j];
			if(gridObject.isSortable && col.defaultSort && (col.defaultSort == "true"))
			{
				initialSortingColumn = j;
				if(col.defaultSortOrder)
				{
				    // RWW Sort is wrong way around. Use "false" for ascending sort!
					sortDirection = (col.defaultSortOrder == "ascending") ? false : true;
				}
			}
		}
		sortEvent = new ColumnSortEvent(initialSortingColumn, sortDirection);
	
		// Set the column clicked on as the selected column
		gridObject.m_model.setSelectedColumn(sortEvent.getColumnNumber());
		
		gridObject.m_model.sortData(sortEvent);
		gridObject.renderState();
	}
}

/**
 * This function clears the navigation links that exist and removes the navigation stack.
 * Requested as part of UCT_Group2 Defect 1415. 
 *
 * @author Chris Vincent
 */
CaseManUtils.clearNavigationLinks = function()
{
	// Reset Navigation Stack
	NavigationController.resetCallStack();
	
	// Clear all form parameters
	// Add Xpath Constant for Oracle Report Court Code to CaseManUtils.clearNavigationLinks()  - TRAC 2446
	var xPathArray = [CreateCaseParams.PARENT, ManageCaseEventsParams.PARENT, "/ds/var/app/CaseData", CaseManFormParameters.OR_COURT_CODE_XPATH,
					  HearingParams.PARENT, JudgmentParams.PARENT, BarJudgmentParams.PARENT, MaintainObligationsParams.PARENT,
					  HumanRightsActParams.PARENT, TransferCaseParams.PARENT, HomeWarrantsParams.PARENT, MaintainWarrantsParams.PARENT,
					  WarrantReturnsParams.PARENT, ReissueWarrantsParams.PARENT, MaintainWarrantAmountParams.PARENT, 
					  MaintainWftParams.PARENT, ManageAEEventsParams.PARENT, ManageAEParams.PARENT, MaintainAEAmountParams.PARENT,
					  PERCalculatorParams.PARENT, ManageCOEventsParams.PARENT, DeterminationOfMeansParams.PARENT, 
					  ManageCOParams.PARENT, ViewPaymentsParams.PARENT, ViewDividendsParams.PARENT, TransferCOParams.PARENT,
					  CompletePayoutParams.PARENT, CaseManFormParameters.QUERYBYPARTY_ROOT_XPATH, DisplayDMSParams.PARENT,
					  CaseManFormParameters.WPNODE_XPATH, CaseManFormParameters.ORNODE_XPATH];
	Services.startTransaction();
	for ( var i=0, l=xPathArray.length; i<l; i++ )
	{
		Services.removeNode(xPathArray[i]);
	}
	Services.endTransaction();
}

/**
 * Function determines if the code passed in is that of a CCBC National Coded Party or not.
 * @param code [Integer] Code to be tested
 * @return [Boolean] true if code is a CCBC National Coded Party code, else false.
 */
CaseManUtils.isCCBCNationalCodedParty = function(code)
{
	var ccbcncp = false;
	// Define the minimum and maximum code ranges
	var minRange = [1500,7355,7517,7588,7720,7791,7835,7909,8247,8334,8636,8677,8825,8930,9530,9634,9668,9790,9907];
	var maxRange = [1999,7455,7586,7675,7772,7828,7894,7977,8298,8361,8675,8724,8854,8964,9632,9666,9755,9822,9960];
	
	for ( var i=0, l=minRange.length; i<l; i++ )
	{
		if ( code >= minRange[i] && code <= maxRange[i] )
		{
			// Code falls in a CCBC National Coded Party range, exit loop and return true.
			ccbcncp = true;
			break;
		}
	}

	return ccbcncp;
}

/**
 * AuthorizationException class definition.
 * @param message
 * @param causedBy
 * @param exceptionHierarchy
 * @author rzxd7g
 * 
 */
function AuthorizationException(message, causedBy, exceptionHierarchy)
{
   this.message = message;
   this.causedBy = causedBy;
   
   if(undefined == exceptionHierarchy)
   {
      this.exceptionHierarchy = new Array('Error','BusinessException', 'AuthorizationException');
   }
   else
   {
      this.exceptionHierarchy = exceptionHierarchy;
   }
   this.name = 'AuthorizationException';
}
AuthorizationException.prototype = new BusinessException()
AuthorizationException.prototype.constructor = AuthorizationException;