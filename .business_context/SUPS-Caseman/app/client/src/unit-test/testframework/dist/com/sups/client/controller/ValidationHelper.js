/**
 * Helper class which implements utility methods for 
 * common validation methods.
 * All functions are static, instanciating this class is not
 * required.
 */	
function ValidationHelper()
{
}

ValidationHelper.m_logger = new Category("ValidationHelper");

ValidationHelper.MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
/**
 * Crest case number validation method.
 * The format of the Crest case number is:
 * 1 character followed by 8 digits
 * ie: A12345678
 *
 * @param value the value to validated
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed.
 */
ValidationHelper.validateCrestCaseNo = function(value)
{
  var caseNumberPattern = /^[a-zA-Z]{1}\d{8}$/;
	
  var errorCode = null;

  var valid = value.search(caseNumberPattern);	
  if(value.length > 0 && 0 != valid )
  {
    return ErrorCode.getErrorCode('InvalidCaseNumberFormat');
  }
  return null;
}

/**
 * Yes No fields can have two values 'Y' or 'N'
 */ 
ValidationHelper.validateYorN = function(value)
{
  // Ensure value is upper case	
	var errorCode = null;
	
	if ( value.length > 0 && 'Y' != value && 'N' != value &&'y' != value && 'n' != value )
	{
    	return ErrorCode.getErrorCode('BooleanFieldValueNotYorN');
	}else{
		// Write the upper case value back to the form
		value = value.toUpperCase();
		return null;
	}	
}

/**
 * Date validation helper
 * The date format is:
 * DD-MMM-YYYY
 *
 * DD being a the numeric day.
 * MMM is the first three capitalized letters of the month.
 * JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC
 * YYYY The year.
 * See DateBehaviour for Date element life cycle .
 */
ValidationHelper.validateDate = function(value)
{
  var caseNumberPattern = /^\d{1,2}(\-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(\-)\d{4}$/;
  var valid = value.search(caseNumberPattern);
	
  var errorCode = null;
  if(value.length > 0 && 0 != valid)
  {
    errorCode = ErrorCode.getErrorCode('InvalidDateFormat');
  }
  if(ValidationHelper.m_logger.isDebug()) ValidationHelper.m_logger.debug('Error code is :'+ errorCode);
  return errorCode;

}

/**
 * Validate an Integer
 */
ValidationHelper.validateNumber = function(value)
{
	return (value.length > 0 && isNaN(parseInt(value))) ? ErrorCode.getErrorCode('NotInteger') : null;
}

/**
 * Validate a floating point number
 */
ValidationHelper.validateFloatNumber = function(value)
{
	return (value.length > 0 && isNaN(parseFloat(value))) ? ErrorCode.getErrorCode('NotNumber') : null;
}

/**
 * Validate Sterling currency ensuring value contains two decimal places for pence.
 */
ValidationHelper.validateCurrency = function(value)
{
	var currencyPattern = /^[0-9]*(\.[0-9]{2})?$/;

	return (value.length > 0 && (0 != value.search(currencyPattern))) ? ErrorCode.getErrorCode('NotCurrency') : null;
}


/**
 * Compare two dates and return an integer value as result.
 * @param fistValue string representation of date
 * @param secondValue string representation of date
 * @returns: int
 * If first date is after second date return 1
 * If first date is before second date return -1
 * If dates are equal return 0
 */
ValidationHelper.compareDates = function(firstValue, secondValue)
{		
	return ValidationHelper.compareParsedDates(
		ValidationHelper.parseDate(firstValue),
		ValidationHelper.parseDate(secondValue));
}

/**
 * Compare two Date objects
 * @param firstDate date object
 * @param secondDate date object
 */
ValidationHelper.compareParsedDates = function(firstDate, secondDate)
{
	var res = null;
	if      (firstDate > secondDate) {res = 1;}
	else if (firstDate < secondDate) {res = -1;}
	else    {res =0;}
	return res;
}

/**
 * @Return currentDate 
 */
ValidationHelper.todaysDate = function()
{
	// Need to get currentDate from the server really...
	var currentTime = new Date();
	
	// Get rid of the time component
	return new Date(currentTime.getYear(), currentTime.getMonth(), currentTime.getDate());
}

/**
 * Get today's date in correct format
 *
 * @return a string containing todays date in DD-MON-YYYY format
 *   of the element. These maybe accessed as obj.left, obj.top properties of
 *   the result object
 */
ValidationHelper.getTodayFormatted = function()
{
	//var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
	var today = new Date();
	var dd = today.getDate();
	if (dd.length == 1) { "0" + dd; }
	var mm = today.getMonth();
	var mon = ValidationHelper.MONTHS[mm];
	var yyyy = today.getFullYear();
	var todayFormated = dd + "-" + mon + "-" + yyyy;
	return todayFormated
}

/**
 * Internal function to create a date
 */
ValidationHelper._createDate = function(value)
{	
	if(value == null || value.length <1)
	{
		return null;
	}
	var day, month, year;
	day = value.substring(0,1);
	year = value.slice(value.length-4, value.length);
	for(var i = 0; i < ValidationHelper.MONTHS.length; i++)
	{
		var temp = value.slice(value.length-8 ,value.length-5);
		if(ValidationHelper.MONTHS[i] == temp)
		{
			month = i;
			return  new Date(year, month-1, day);
		}
	}

	return null;
}

/**
 * CASEMAN case number validation method.
 * The format of the Crest case number is:
 * 3 character followed by 5 digits
 * ie: ABC12345
 *
 * @param value the value to validated
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed.
 */
ValidationHelper.parseCaseManDate = function(dateString)
{
	// Split on '-' separator
	var dateElements = dateString.split('-');
	
	// Should be three elements: day, month and year
	if (3 != dateElements.length) return null;
	
	// Check day is an integer
	var day = parseInt(dateElements[0]);
	if (isNaN(day)) return null;
	
	// Check month is one of the elements in the MONTHS array
	var month = -1;
	for (var i = 0; i < ValidationHelper.MONTHS.length; i++)
	{
		if(ValidationHelper.MONTHS[i] == dateElements[1])
		{
			month = i;
			break;
		}
	}
	if (-1 == month) return null;
	
	// Check year is a valid 4 digit number
	if (dateElements[2].length != 4) return null;
	var year = parseInt(dateElements[2]);
	if (isNaN(year)) return null;
	
	return new Date(year, month, day);
}

/**
 * Helper function to validate time.
 * The format for time is 00:00 - 24:00
 */
ValidationHelper.validateTime = function(value)
{
	var timePattern = /^[0-2][0-9](\:[0-5][0-9])?$/;
  	var valid = value.search(timePattern);
	
	var errorCode = null;
	
	if(value.length > 0 && 0 != valid)
  	{
    	errorCode = ErrorCode.getErrorCode('InvalidTimeFormat');
  	}

	return errorCode;	
}

/**
 * Utility function which calculates whether a date is 
 * within a month in the past
 */
ValidationHelper.validateDateWithinOneMonth = function(value)
{
		var res = ValidationHelper.validateDate(value);
		if(res != null){
			return res;
		}
		var oneMonthAgo = oneMonthEarlier(new Date());
		var testDate = ValidationHelper.parseCaseManDate (value);
		if(testDate.getTime() < oneMonthAgo.getTime())
		{
			Services.showAlert("Warning: This Date is more than one month in the past");
		}
}


/**
 * Return a date one month previous to the date supplied
 */
function oneMonthEarlier(date)
{
	var lastMonth = date.getMonth();
	var lastYear = date.getYear();
	if(0 == lastMonth)
	{
		lastMonth = 11;
		lastYear--;
	}
	else
	{
		lastMonth--;
	}
	
	// Return a Date object which represents the date 1 month prior to the supplied date
	return new Date(lastYear, lastMonth, date.getDate());
}

	// Internal function to check for capital the first letters of every word
	//ie. the bRown fOx 
	// becomes The Brown Fox
	
	// use superInitCaps to capitalize	
	ValidationHelper.capitalize = function(theString) 
	{
		// Assumption: First character in the string is a letter & should be a capital.
		theString = theString.substr(0, 1).toUpperCase() + theString.substring(1, theString.length);
		
		var i = 0;
		var j = 0;
		while((j = theString.indexOf(" ", i)) && (j != -1)) 
		{
			theString = theString.substring(0, j + 1) + 
						theString.substr(j + 1, 1).toUpperCase() + 
						theString.substring(j + 2, theString.length);
			i = j+1;
		}		
		return theString
	}
	
	
	ValidationHelper.superInitCaps = function(theString)
	{
		var res = theString;
		
		// If all uppercase, convert to all lowercase
		if (res == res.toUpperCase()) res = res.toLowerCase();
		
		// Check for capital letter if any, return original string
		if(res == res.toLowerCase())
		{
			// Capitalize 
			res = ValidationHelper.capitalize(res);
		}
		//alert("Did superInit");
		return res;
	}
	