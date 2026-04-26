//==================================================================
//
// FWDateUtil.js
//
// Class containing utility functions and definitions for the
// DatePicker.
//
//==================================================================


function FWDateUtil()
{
}

FWDateUtil.m_logger = new Category("FWDateUtil");

FWDateUtil.shortMonths = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
FWDateUtil.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// List of Days - start at Sunday as JavaScript Date.getDay() returns 0 for Sunday
FWDateUtil.shortDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

FWDateUtil.NO_OF_MONTHS = 12;
FWDateUtil.NO_OF_WEEKDAYS = 7;


/**
 * The number of milliseconds in a day
 *
 * @type Integer
 */
FWDateUtil.MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Date Format is <whitespace>DD<whitespace>x<whitespace>MMM<whitespace>x<whitespace>YYYY<whitespace>
 * where x is one of: whitespace, "-" or "/"
 */
FWDateUtil.dateParseRegex = /^\s*0?(\d|1\d|2\d|3[01])\s*?(\-|\s|\/)\s*?(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*?(\-|\s|\/)\s*?([1-9]\d{3})\s*$/i;
FWDateUtil.dateXSDParseRegex = /^(\d{4})\-(\d{2})\-(\d{2})$/;

FWDateUtil.shortMonthLookup = function(month)
{
	var ms = FWDateUtil.shortMonths;
	var uMonth = month.toUpperCase();
	
	for(var i = 0, l = ms.length; i < l; i++)
	{
		if(ms[i].toUpperCase() == uMonth)
		{
			return i;
		}
	}
	return null;
}

/*
 *  Returns the parsed date.  If the date is invalid returns null.
 */
FWDateUtil.parseDate = function(dateString)
{
	if(FWDateUtil.m_logger.isDebug())
	{
		FWDateUtil.m_logger.debug("FWDateUtil.parseDate(" + dateString + ")");
	}

    // Extract day/month/year from string - then check that they have not "moved" (see below)
    if (FWDateUtil.dateParseRegex.exec(dateString))
    {
      var day = parseInt(RegExp.$1);
      var month = FWDateUtil.shortMonthLookup(RegExp.$3);
      var year = RegExp.$5;
      
      var dateObj = new Date (year, month, day, 0, 0, 0); 
      
      // Need to check that date has not been "moved" (ie 31-Feb-2004 is moved to 02-Mar-2004)
      if (dateObj.getDate() == day 
          && dateObj.getMonth() == month)
      {
        return dateObj;
      }
    }
    
    return null; // invalid date
}

FWDateUtil.parseXSDDate = function(dateString)
{
	if(FWDateUtil.m_logger.isDebug()) FWDateUtil.m_logger.debug("FWDateUtil.parseXSDDate(" + dateString + ")");

	return FWDateUtil.dateXSDParseRegex.exec(dateString)
		? new Date (RegExp.$1, (RegExp.$2 - 1), RegExp.$3, 0, 0, 0)
		: null;
}

/**
 * Check if two date objects (which can also represent more fine
 * grained units of time, such as hours and minutes) represent
 * the same date
 *
 * @param d1 the first date to compare
 * @param d2 the second date to compare
 * @return true if the two date objects have the same date, month and year
 *   or false otherwise
 */
FWDateUtil.datesEqual = function(d1, d2)
{
	return (d1.getDate() == d2.getDate()) && (d1.getMonth() == d2.getMonth()) && (d1.getFullYear() == d2.getFullYear());
}

/**
 * Check if the two supplied dates are equal. Returns
 * true if:
 *   d1 == null and d2 != null 
 *  or
 *   d1 != null and d2 == null
 *  or 
 *   d1 != null and d2 != null and d1 does not represent the same date as d2
 *
 * @param d1 the first date (may be null)
 * @param d2 the second date (may be null)
 * @returns true if the two argument dates represent the same date, or false otherwise.
 * @type boolean
 */
FWDateUtil.compareDates = function(d1, d2)
{
	return
		(d1 == null && d2 != null) ||
		(d1 != null && d2 == null) ||
		(d1 != null && d2 != null && !FWDateUtil.datesEqual(d1, d2));
}




/**
 * Get the number of days difference between two dates
 *
 * @param d1 First date
 * @param d2 First date
 */
FWDateUtil.getDaysDifference = function(d1, d2)
{
	// Get difference between the dates in milliseconds
	var difference = d1 - d2;

	//if(DatePickerRenderer.m_logger.isTrace()) DatePickerRenderer.m_logger.trace("FWDateUtil.getDaysDifference() d1=" + d1.getTime() + ", d2=" + d2.getTime() + ", difference=" + difference + ", FWDateUtil.MILLISECONDS_PER_DAY=" + FWDateUtil.MILLISECONDS_PER_DAY);
	//if(DatePickerRenderer.m_logger.isTrace()) DatePickerRenderer.m_logger.trace("FWDateUtil.getDaysDifference() d1=" + d1.toString() + ", d2=" + d2.toString() + ", difference / FWDateUtil.MILLISECONDS_PER_DAY=" + difference / FWDateUtil.MILLISECONDS_PER_DAY + ", floored = " + Math.floor(difference / FWDateUtil.MILLISECONDS_PER_DAY));
	
	// Calculate the difference in days
	return Math.round(difference / FWDateUtil.MILLISECONDS_PER_DAY);
}

/** 
 *  Validate that the input date is in xsd format and corresponds to 
 *  a valid day.
 *
 *  @param dateValue - is the date in question (string)
 *  @param weekends - determins whether or not weekends are considered
 *         valid (true = valid)
 *
 */
FWDateUtil.validateXSDDate = function(dateValue, weekends)
{
    var ec = null;
	var valid = false;

	// the default is now in XSD format rather than SUPS
	var date = FWDateUtil.parseXSDDate(dateValue);
	if(null != date)
	{
		var day = date.getDay();
		if(weekends)
		{
			valid = true;
		}
		else
		{
			if(day>=1 && day<=5)
			{
				valid = true;
			}
			else
			{
				ec = ErrorCode.getErrorCode('InvalidFieldLength');
				ec.m_message = "Cannot enter a weekend date as this field is configured for weekdays only";
			}
		}
	}
	else
	{
		ec = ErrorCode.getErrorCode('InvalidFieldLength');
		ec.m_message = "The value does not conform to a valid date format of DD-MMM-YYYY, or is an invalid date";
	}

	if(FWDateUtil.m_logger.isInfo()) FWDateUtil.m_logger.info("FWDateUtils.validate() returning = " + ec);
	
	return ec;
}

/*
 *  Takes a date and returns a string of format YYYY-MM-DD
 *  
 *  @param Date object
 */
FWDateUtil.ConvertDateToXSDString = function(dateObj)
{
    // Convert date to string, padding single digit dates
	var date = dateObj.getDate();
	date = (date < 10) ? "0" + date : date;

	// Convert month to string, padding single digit dates
	var month = dateObj.getMonth() + 1;
	month = (month < 10) ? "0" + month : month;
		
	// return in XSD format		YYYY-MM-DD
	var ret = dateObj.getFullYear() + "-" + month + "-" + date;
	
	return ret;
}

/*
 *  Takes a date and returns a string of format DD-MMM-YYYY
 *  
 *  @param Date object
 */
FWDateUtil.ConvertDateToString = function(dateObj)
{
    // Convert date to string, padding single digit dates
	var day = dateObj.getDate();
	day = (day < 10) ? "0" + day : day;

	// Convert month to string, padding single digit dates
	var month = FWDateUtil.shortMonths[dateObj.getMonth()];
	
	// Do year as well
	var year = dateObj.getFullYear();
		
	// return Date in DD-MMM-YYY format
	return day + "-" + month + "-" + year;
}
