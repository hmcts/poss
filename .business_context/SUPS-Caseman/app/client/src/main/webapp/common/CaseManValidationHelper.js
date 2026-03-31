/** 
 * @fileoverview CaseMan Validation Class - Helper class which implements utility 
 * methods for common validation methods.  All functions are static.
 *
 * @author Chris Vincent
 * @version 1.0.2
 * 
 * Change History
 * 03/08/2006 - Chris Vincent, updated the postcode regular expressions in validatePostCode() as the 
 * 				last two characters were not allowed to be the letter Z.  Defect 4137.
 * 17/08/2006 - Chris Vincent, updated the validateDateOfBirth function as the test for future
 * 				date was failing with dates past the year 3000.  Defect 4399.
 * 29/08/2006 - Chris Vincent, changed the YYYYMMDD_DATE_PATTERN so it matched years over 2999 (defect 4778)
 * 05/09/2006 - Chris Vincent, added VALID_EXISTINGCASEAE_PATTERN to cater for the 'existing case' AE number
 * 				format. Defect 5094.
 * 22/01/2007 - Chris Vincent, altered CCBC_VALID_WARRANTNUMBER_PATTERN to match the CCBC Warrant Number format
 * 				Group2 Defect 4405.
 * 15/07/2008 - Sandeep Mullangi, Added Insolvency Number pattern
 * 20-04-2009 - Chris Vincent - Added function validateInsolvencyNumber() as a common validation utility for several screens.  TRAC Ticket 334.
 * 04/07/2013 - Chris Vincent, Trac 4908. Case numbering changes to case and warrant number regular expressions
 *				as well as changes to the validatecaseNumber, validateLocalWarrantNumber and a new function 
 *				validateNewWarrantNumber to cater for the new warrant number format.
 * 09/12/2015 - Chris Vincent, Trac 5719. Change to validateAeNumber to allow old and new AE Number formats.
 */

/**
 * Constant regular expression checking for a date string in the format YYYY-MM-DD
 */
CaseManValidationHelper.YYYYMMDD_DATE_PATTERN = /^[1-9][0-9][0-9][0-9]-(0[0-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

/**
 * Constant regular expression checking for a date string in the format DD-MMM-YYYY
 */
CaseManValidationHelper.DDMMMYYYY_DATE_PATTERN = /^(0[1-9]|[12][0-9]|3[01])[- \/](JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)[- \/](19|20)[0-9][0-9]$/i;

/**
 * Constant regular expression checking for a MAGS ORDER Case Number (i.e. third character '/')
 */
CaseManValidationHelper.MAGSORDER_CASE_PATTERN = /^[A-Z]{2}[\/][\d]{5}/;

/**
 * Constant regular expression checking for a Non MAGS ORDER Case Number
 */
CaseManValidationHelper.NONMAGSORDER_CASE_PATTERN = /^[A-Z0-9]{8}$/;

/**
 * First Regular Expression pattern for a valid non MAGS ORDER case (creation only)
 */
CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_ONE = /^[\d][A-Z]{2}[\d]{5}$/;

/**
 * Second Regular Expression pattern for a valid non MAGS ORDER case (creation only)
 */
CaseManValidationHelper.NONMAGSCREATE_CASE_PATTERN_TWO = /^[A-Z]{2}[\d]{6}$/;

/**
 * First Regular Expression pattern for a valid non MAGS ORDER case (creation only) using the new numbering format
 */
CaseManValidationHelper.NEW_NONMAGSCREATE_CASE_PATTERN_ONE = /^[ABCDEFGHJKLMNPQRSTUVWXYZ]{1}[\d]{2}[A-Z]{2}[\d]{3}$/;

/**
 * Second Regular Expression pattern for a valid non MAGS ORDER case (creation only) using the new numbering format
 */
CaseManValidationHelper.NEW_NONMAGSCREATE_CASE_PATTERN_TWO = /^[\d]{3}[A-Z]{2}[\d]{3}$/;

/**
 * Constant regular expression checking for a valid Case Number (includes MAGS ORDER)
 */
CaseManValidationHelper.VALID_CASE_PATTERN = /^[A-Z0-9]{2}[A-Z0-9\/][A-Z0-9]{5}$/;

/**
 * Constant regular expression checking for a valid Non Magistrates AE Number
 */
CaseManValidationHelper.VALID_NONMAGSAE_PATTERN = /^[\d]{3}[A-Z][\d]{4}$/;

/**
 * Constant regular expression checking for a valid Non Magistrates AE Number in the new format
 */
CaseManValidationHelper.VALID_NEW_NONMAGSAE_PATTERN = /^[A-Z]{2}[\d]{6}$/;

/**
 * Constant regular expression checking for a valid existing case AE Number
 */
CaseManValidationHelper.VALID_EXISTINGCASEAE_PATTERN = /^[\d]{8}$/;

/**
 * Constant regular expression checking for a valid CO Number
 */
CaseManValidationHelper.VALID_CONUMBER_PATTERN = /^[\d]{6}[A-Z]{2}$/;

/**
 * Constant regular expression checking for a valid warrant number
 */
CaseManValidationHelper.VALID_WARRANTNUMBER_PATTERN = /^[A-Z]{1}[\d]{7}$/;

/**
 * Constant regular expression checking for a valid warrant number (new format)
 */
CaseManValidationHelper.VALID_NEWWARRANTNUMBER_PATTERN = /^[0-9]{1}[A-Z]{1}[\d]{6}$/;

/**
 * Constant regular expression checking for a valid re-issued warrant number
 */
CaseManValidationHelper.VALID_REISSUEDWARRANTNUMBER_PATTERN = /^[\d]{5}[\/][\d]{2}$/;

/**
 * Constant regular expression checking for a valid local warrant number
 */
CaseManValidationHelper.VALID_LOCALWARRANTNUMBER_PATTERN = /^FW[A-Z]{1}[\d]{5}$/;

/**
 * Constant regular expression checking for a valid CCBC warrant number
 */
CaseManValidationHelper.CCBC_VALID_WARRANTNUMBER_PATTERN = /^[A-Z][A-Z0-9][\d]{5}$/;

/**
 * Constant regular expression checking for a valid sort code (e.g. 11-22-33)
 * Alternative sort code pattern: /\b\d{2}-?\d{2}-?\d{2}\b/
 */
CaseManValidationHelper.VALID_SORTCODE_PATTERN = /^[\d]{2}-[\d]{2}-[\d]{2}$/;

/**
 * Constant regular expression checking for a valid Email address pattern
 */
CaseManValidationHelper.EMAIL_PATTERN = /^([a-z0-9][a-z0-9\._-]*[a-z0-9]@[a-z0-9][a-z0-9\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z])$/i;

/**
 * Constant regular expression checking for a valid currency pattern
 */
CaseManValidationHelper.CURRENCY_PATTERN = /^\-?[0-9]*(\.[0-9]{1,2})?$/;

/**
 * Constant regular expression checking for a valid number
 */
CaseManValidationHelper.NUMERIC_PATTERN = /^\d+$/;

/**
 * Constant regular expression checking for just alphabetic characters
 */
CaseManValidationHelper.ALPHABETIC_PATTERN = /^[A-Z]+$/;

/**
 * Constant regular expression checking for a valid time pattern (e.g. 12:00)
 */
CaseManValidationHelper.TIME_PATTERN = /^([01]\d|2[0-3])(\:[0-5][0-9])$/;

/**
 * Constant regular expression checking for a valid hours pattern (number between 1 and 999)
 */
CaseManValidationHelper.VALID_HOURS_PATTERN = /^([1-9][0-9]?[0-9]?)$/;

/**
 * Constant regular expression checking for a valid minutes pattern (number between 1 and 59)
 */
CaseManValidationHelper.VALID_MINS_PATTERN = /^([1-5]?[0-9])$/;

/**
 * Constant regular expression checking for a valid insolvency sequency number and year. (4 digits). 
 */
CaseManValidationHelper.VALID_INSOLVENCY_PATTERN = /^[0-9]{4}$/;

/**
 * @constructor
 * @author rzxd7g
 * 
 */
function CaseManValidationHelper()
{
}


/**
 * Validates an integer
 *
 * @param value The value to validate
 * @returns True if the value passed in is an integer
 * @author rzxd7g
 */
CaseManValidationHelper.validateNumber = function(value)
{
	var valid = value.search(CaseManValidationHelper.NUMERIC_PATTERN);

	var errorCode = null;
	if(value.length > 0 && 0 != valid)
  	{
    	return false;
  	}
	return true;
}


/**
 * Validates a floating point number
 *
 * @param value The value to validate
 * @returns True if the value passed in is a floating point number
 * @author rzxd7g
 */
CaseManValidationHelper.validateFloatNumber = function(value)
{
	return (value.length > 0 && isNaN(value)) ? false : true;
}


/**
 * Validates a time is in the format 00:00 - 24:00
 *
 * @param value The value to validate
 * @returns True if valid, otherwise false
 * @author rzxd7g
 */
CaseManValidationHelper.validateTime = function(value)
{
  	var valid = value.search(CaseManValidationHelper.TIME_PATTERN);
	
	if(value.length > 0 && 0 != valid)
  	{
  		// Commented out from SUPSValidationHelper
    	//errorCode = ErrorCode.getErrorCode('CaseMan_invalidTime_Msg');
		return false;
    	errorCode = ErrorCode.getErrorCode(ec);
  	}
	
	return true;	
}


/**
 * Utility function which checks all the fields provided in the array 
 * to see if they are all valid or mandatory and complete.  Useful for checking
 * fields in a popup are valid.
 *
 * @param {Array} fields - array of field id strings (note - NOT the objects)
 * @returns True if all fields are valid.
 * @author rzxd7g
 */
CaseManValidationHelper.validateFields = function(fields, skipMandatory )
{
	var checkMandatory = ( null == skipMandatory ) ? true : !skipMandatory;
	var validFields = true;
	for(var i = 0, l = fields.length; i < l; i++)
	{
		var a = Services.getAdaptorById(fields[i]);
		
		// If field supports dataBinding
		if(a.getDataBinding)
		{
			if( !a.getEnabled() )
			{
				continue;
			}
			if( !a.getValid() )
			{
				validFields = false;
				break;
			}
			// Only check mandatory if specified by user
			if( checkMandatory && a.getMandatory() && CaseManUtils.isBlank( Services.getValue(a.getDataBinding() ) ) )
			{
				validFields = false;
				break;
			}
		}
	}
	return validFields;
}


/**
 * Generic implementation of a validate method for a specified pattern.
 *
 * @param value The value of the HTML element that is being validated
 * @param aPattern The pattern that the value must conform to
 * @param anErrorCode The error code of the message to return if the value is not in the required format
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.validatePattern = function(value, aPattern, anErrorCode)
{
	// Checks included for Bombproof solution
	// Check that the pattern was specified
	if(aPattern == '' || aPattern == null)
	{
		var noPatternError = new Error("No pattern specified for Pattern Match Validation!");
		throw noPatternError;
	}
	// Check that the ErrorCode was specified
	if(anErrorCode == '' || anErrorCode == null)
	{
		var noErrorCodeError = new Error("No error code specified for Pattern Match Validation!");
		throw noErrorCodeError;
	}
	
	if(value == null)
	{
		return null;
	}
	
	return (value.length > 0 && (0 != value.search(aPattern))) ? ErrorCode.getErrorCode(anErrorCode) : null;
}


/**
 * This routine checks the value of the form element specified by the parameter for a 
 * valid match against an array of Regular Expressions.
 *
 * @param value The value of the HTML element that is being validated
 * @param expArray The array of Regular Expressions
 * @param errorMessage The Error Code to be returned if the value is not a match
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.checkRegExp = function(value, expArray, errorMessage)
{
    // Load up the string to check
    var testString = value;
    
    // Assume we're not going to find a valid match
    var valid = false;
      
    // Check the string against all patterns in the Regular Expression Array
    for ( var i=0; i<expArray.length; i++) {
        if (expArray[i].test(testString)) {
            // Set flag
            valid = true;
            // We found a valid match so break from loop
            break;
        }
    }
      
    // Return with either an Error message or null
    if (valid) {
        return null;
    } 
    else {
        return ErrorCode.getErrorCode(errorMessage);  
    }  
}


/**
 * Implementation of the validate() method against an Array of Acceptable values.
 *
 * @param value The value of the HTML element that is being validated
 * @param anArray The array of acceptable values that the value must conform to 
 * @param anErrorCode The error code of the message to return if the value is not in the required format
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.validateInSpecifiedArray = function(value, anArray, anErrorCode)
{
    // Checks included for Bombproof solution
	// Check that the array is present
	if(anArray == null)
	{
		var noAcceptableValuesError = new Error("No List of acceptable values specified!");
		throw noAcceptableValuesError;
	}
    // .. and if not null check it has some values
    if(anArray.length == 0)
   	{
		var noValuesInListError = new Error("No values are present in the List of acceptable values!");
		throw noValuesInListError;
	}
	// Check that the ErrorCode was specified
	if(anErrorCode == '' || anErrorCode == null)
	{
		var noErrorCodeError = new Error("No error code specified for List of acceptable values Validation!");
		throw noErrorCodeError;
	}

    // Check if it is in the list
  	if (!CaseManValidationHelper.arrayContainsValue(anArray, value))
  	{
  	    return ErrorCode.getErrorCode(anErrorCode);
  	}
	return null;
}

/**
 * General utility function to check if an array contains a particular value
 *
 * @param array the array to check
 * @param value the value to check for
 * @returns true if the value is found or false otherwise
 * @author rzxd7g
 */
CaseManValidationHelper.arrayContainsValue = function(array, elementValue)
{
	for (var i in array)
	{
		if (elementValue == array[i])
		{
			// No error so return null
			return true;
		}
	}
	return false;
}


/**
 * Implementation of the validate() method for reserved range validation. The value
 * of the element must NOT be in this reserved range.
 *
 * @param value The value of the HTML element that is being validated
 * @param aMinValue The minimum value of the reserved range 
 * @param aMaxValue The maximum value of the reserved range 
 * @param anErrorCode The error code of the message to return if the value is not in the required format
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.validateNotInReservedRange = function(value, aMinValue, aMaxValue, anErrorCode)
{
    // Check that the minimum value for the range was specified
	if(isNaN(aMinValue) || aMinValue == null)
	{
		var noMinimumValueError = new Error("No minimum value specified for Reserved Range Validation!");
		throw noMinimumValueError;
	}
	// Check that the maximum value for the range was specified
	if(isNaN(aMaxValue) || aMaxValue == null)
	{
		var noMaximumValueError = new Error("No maximum value specified for Reserved Range Validation!");
		throw noMaximumValueError;
	}
	// ... and finally :)
	if(aMaxValue <= aMinValue)
	{
		var logicError = new Error("Max value specified less than min value specified for Reserved Range Validation!");
		throw logicError;
	}
    // Check that the ErrorCode was specified
	if(anErrorCode == '' || anErrorCode == null)
	{
		var noErrorCodeError = new Error("No error code specified for Reserved Range Validation!");
		throw noErrorCodeError;
	}
    
    // value parsed as a Float
    var elementValue = parseFloat(value);

  	if ((elementValue >= aMinValue) && (elementValue <= aMaxValue))
  	{
  	    return ErrorCode.getErrorCode(anErrorCode);  
  	}
    else
	{
		return null;
	}

}


/**
 * Implementation of the validate() method for required range validation. The value
 * of the element must be in this reserved range.
 *
 * @param value The value of the HTML element that is being validated
 * @param aMinValue The minimum value of the required range 
 * @param aMaxValue The maximum value of the required range 
 * @param anErrorCode The error code of the message to return if the value is not in the required format
 * @returns null if the validation succeeded or an appropriate ErrorCode if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.validateValueInRange = function(value, aMinValue, aMaxValue, anErrorCode)
{
    // Check that the minimum value for the range was specified
	if(isNaN(aMinValue) || aMinValue == null)
	{
		var noMinimumValueError = new Error("No minimum value specified for Required Range Validation!");
		throw noMinimumValueError;
	}
	// Check that the maximum value for the range was specified
	if(isNaN(aMaxValue) || aMaxValue == null)
	{
		var noMaximumValueError = new Error("No maximum value specified for Required Range Validation!");
		throw noMaximumValueError;
	}
	// ... and finally :)
	if(aMaxValue <= aMinValue)
	{
		var logicError = new Error("Max value specified less than min value specified for Required Range Validation!");
		throw logicError;
	}
    // Check that the ErrorCode was specified
	if(anErrorCode == '' || anErrorCode == null)
	{
		var noErrorCodeError = new Error("No error code specified for Required Range Validation!");
		throw noErrorCodeError;
	}

    // value parsed as a Float
    var elementValue = parseFloat(value);

  	if ((elementValue < aMinValue) || (elementValue > aMaxValue))
  	{
  	    return ErrorCode.getErrorCode(anErrorCode);  
  	}
    else
	{
		return null;
	}

}


/**
 * This routine checks the value of the form element specified by the parameter
 * for a valid postcode. The space between the inward part and the outward part
 * is optional, although is inserted if not there as it is part of the postcode.
 * <p>  
 * The definition of a valid postcode has been taken from:
 * {@link http://www.royalmail.com/docContent/other/Downloadable_Files/PAF_Digest_Issue_5_0.pdf}
 * <p> 
 * If the element is a valid postcode, the function returns true,
 * otherwise it returns false.
 *
 * @param value The value of the HTML element that is being validated
 * @returns True if the validation succeeded or false if it failed
 * @author rzxd7g
 */
CaseManValidationHelper.validatePostCode = function(value)
{
    // This array holds the regular expressions for the valid postcodes
    var pcexp = new Array ();
    
    // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
    pcexp.push (/^([a-z]{1,2}[0-9]{1,2})(\s*)([0-9]{1}[abdefghjlnpqrstuwxyz]{2})$/i);
    
    // Expression for postcodes: ANA NAA, and AANA  NAA
    pcexp.push (/^([a-z]{1,2}[0-9]{1}[a-z]{1})(\s*)([0-9]{1}[abdefghjlnpqrstuwxyz]{2})$/i);
      
    // Exception for the special postcode GIR 0AA
    pcexp.push (/^(GIR)(\s*)(0AA)$/i);
    
    // Load up the string to check
    var postCode = value;
    
    // Assume we're not going to find a valid postcode
    var valid = false;
      
    // Check the string against both post codes
    for ( var i=0; i<pcexp.length; i++) {
        if (pcexp[i].test(postCode)) {
        
            // The post code is valid - split the post code into component parts
            pcexp[i].exec(postCode);
          
            // Copy it back into the original string, converting it to uppercase and
            // inserting a space between the inward and outward codes
            postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
          
            // Load new postcode back into the form element
            valid = true;
          
            // Remember that we have found that the code is valid and break from loop
            break;
        }
    }
      
    return valid; 
}


/**
* Custom Javascript used to validate inout entered in the CM_DJ_* (UC119) screen.
* It requires custom code since the one in the framework is insufficient to
* validate the input entered.
 */

/**
 * makes sure that the date entered in not in the past
 * @param dateObj
 * @param todayDateObj
 * @author rzxd7g
 * @return faildedValidation (ec) , null  
 */
CaseManValidationHelper.validateNonPastDate = function (dateObj, todayDateObj)
{
//var todayDateObj = CaseManUtils.createDate(CaseManValidationHelper.getTodaysDate());
if (dateObj != null)
{
 	if(CaseManUtils.compareDates(todayDateObj, dateObj) == -1 )
  	{
   		ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg");
   		return faildedValidation (ec);
  	}
    	else
  	{
   		return null;
  	}      
}	
 return null; 					
}
/* now redundant 
// Retrieves the system date from the XPATH.		
function CaseManValidationHelper.getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	return date;
}
 */

/**
 * DO NOT USE. RELIES ON ANOTHER FUNCTION THAT EXISTS ONLY IN CO_DJ_Print_Out.js (UC119)
 * (faildedValidation)
 *
 *
 *Function indicates whether or not a date passed in falls on a non working day
 *
 * @param string date The date in the DOM format (YYYY-MM-DD)
 * @returns ErrorCode an error code object if date falls on a non working day else null
 * @depracated 04/04/06
 * @author rzxd7g
 */
CaseManValidationHelper.validateWorkingDay = function (date)
{	
	if ( Services.exists(REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") )
	{
		ec = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
		return faildedValidation (ec);
	}
	return null; 					
}	

/**
 * Function indicates whether or not a case number passed in is in the required format
 *
 * @param string caseNumber The Case Number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateCaseNumber = function (caseNumber)
{
	var ec = null;
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		ec = CaseManValidationHelper.validatePattern(caseNumber, CaseManValidationHelper.VALID_CASE_PATTERN, 'Caseman_invalidCaseNumberFormat_Msg');
	}
	return ec;
}			  

/**
 * Function indicates whether or not a sort code passed in is valid
 *
 * @param string sortCode The sort code to be validated
 * @returns boolean true if the sort code passed in is valid 
 * @author rzxd7g
 */
CaseManValidationHelper.validateSortCode = function (sortCode)
{
  	var valid = sortCode.search(CaseManValidationHelper.VALID_SORTCODE_PATTERN);
	if( sortCode.length > 0 && 0 != valid )
  	{
		return false;
  	}
	return true;	
}

/**
 * Function performs validation on the date of birth field, i.e. cannot be in the future.
 *
 * @param string fieldXP The XPath of the field to be validated
 * @param string sysDateXP The XPath of the current system date (reference data)
 * @returns ErrorCode An error code if the date is in the future, else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateDateOfBirth = function (fieldXP, sysDateXP)
{
	var ec = null;
	var dateOfBirth = Services.getValue(fieldXP);
	var dateObject = CaseManUtils.isBlank(dateOfBirth) ? null : CaseManUtils.createDate(dateOfBirth);
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(sysDateXP) );
	if ( null != dateObject && dateObject > today )
	{
		// Check date is not in the future
		ec = ErrorCode.getErrorCode("CaseMan_dateOfBirthInFuture_Msg");
	}
	return ec;	
}

/**
 * Function indicates whether or not an AE number passed in is in the required format for a mags or non-mags AE number
 *
 * @param string aeNumber The AE Number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateAeNumber = function(aeNumber)
{
	if(!CaseManUtils.isBlank(aeNumber)) {
		var nonMagsResult = CaseManValidationHelper.validatePattern(
			aeNumber, CaseManValidationHelper.VALID_NONMAGSAE_PATTERN, 'Caseman_invalidAENumberFormat_Msg'
		);
		var newAEFormatResult = CaseManValidationHelper.validatePattern(
			aeNumber, CaseManValidationHelper.VALID_NEW_NONMAGSAE_PATTERN, 'Caseman_invalidAENumberFormat_Msg'
		);
		var magsResult = CaseManValidationHelper.validatePattern(
			aeNumber, CaseManValidationHelper.MAGSORDER_CASE_PATTERN, 'Caseman_invalidAENumberFormat_Msg'
		);
		if(newAEFormatResult == null || nonMagsResult == null || magsResult == null) {
			return null;
		}
		else {
			return nonMagsResult;
		}
	}
	return null;
}

/**
 * Function indicates whether or not a CO number passed in is in the required format
 *
 * @param string coNumber The CO Number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateCoNumber = function (coNumber)
{
	if ( !CaseManUtils.isBlank(coNumber) )
	{
		return CaseManValidationHelper.validatePattern(coNumber, CaseManValidationHelper.VALID_CONUMBER_PATTERN, 'Caseman_invalidCONumberFormat_Msg');
	}
	return null;
}

/**
 * Function indicates whether or not a warrant number passed in is in the required format
 *
 * @param string warrantNumber The warrant number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateWarrantNumber = function(warrantNumber)
{
	if(!CaseManUtils.isBlank(warrantNumber)) {
		var warrantResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.VALID_WARRANTNUMBER_PATTERN, 'Caseman_invalidWarrantNumberFormat_Msg'
		);
		var reissuedResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.VALID_REISSUEDWARRANTNUMBER_PATTERN, 'Caseman_invalidWarrantNumberFormat_Msg'
		);
		if(warrantResult == null || reissuedResult == null) {
			return null;
		}
		else {
			return warrantResult;
		}
	}
	return null;
}

/**
 * Function indicates whether or not a warrant number passed in is in the required format.
 * This checks the old format, new format and reissued warrant format.
 *
 * @param string warrantNumber The warrant number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateNewWarrantNumber = function(warrantNumber)
{
	var ec = null;
	var errMsg = "CaseMan_invalidWarrantNumberFormat2_Msg"
	if ( !CaseManUtils.isBlank(warrantNumber) ) 
	{
		var warrantResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.VALID_WARRANTNUMBER_PATTERN, errMsg
		);
		var reissuedResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.VALID_REISSUEDWARRANTNUMBER_PATTERN, errMsg
		);
		var newWarrantResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.VALID_NEWWARRANTNUMBER_PATTERN, errMsg
		);
		
		// If all three checks fail, return the error message
		if ( warrantResult != null && reissuedResult != null & newWarrantResult != null ) 
		{
			ec = ErrorCode.getErrorCode(errMsg);
		}
	}
	return ec;
}

/**
 * Function indicates whether or not a local warrant number passed in is in the required format.
 * Under the new case numbering schema, the local warrant number is set to the same value as the
 * warrant number, so now checks for all recognised warrant number formats as well as the old style
 * local warrant number format.
 *
 * @param string localNumber The local warrant number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateLocalWarrantNumber = function (localNumber)
{
	var ec = null;
	var errMsg = "Caseman_invalidLocalWarrantNumberFormat_Msg"
	if ( !CaseManUtils.isBlank(localNumber) )
	{
		var test1 = CaseManValidationHelper.validatePattern(
			localNumber, CaseManValidationHelper.VALID_WARRANTNUMBER_PATTERN, errMsg
		);	// Old style warrant number format
		var test2 = CaseManValidationHelper.validatePattern(
			localNumber, CaseManValidationHelper.VALID_REISSUEDWARRANTNUMBER_PATTERN, errMsg
		);	// Reissued warrant number format
		var test3 = CaseManValidationHelper.validatePattern(
			localNumber, CaseManValidationHelper.VALID_NEWWARRANTNUMBER_PATTERN, errMsg
		);	// New style warrant number format
		var test4 = CaseManValidationHelper.validatePattern(
			localNumber, CaseManValidationHelper.CCBC_VALID_WARRANTNUMBER_PATTERN, errMsg
		);	// old style CCBC warrant format (7 digit)
		var test5 = CaseManValidationHelper.validatePattern(
			localNumber, CaseManValidationHelper.VALID_LOCALWARRANTNUMBER_PATTERN, errMsg
		);	// Old style local warrant number format
		
		// If all five checks fail, return the error message
		if ( test1 != null && test2 != null & test3 != null && test4 != null && test5 != null ) 
		{
			ec = ErrorCode.getErrorCode(errMsg);
		}
	}
	return ec;
}

/**
 * Function indicates whether or not a warrant number passed in is in the required format
 * for CCBC legacy 
 * 
 * @param string warrantNumber The warrant number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateCCBCWarrantNumber = function (warrantNumber)
{
	if(!CaseManUtils.isBlank(warrantNumber)) {
		var warrantResult = CaseManValidationHelper.validatePattern(
			warrantNumber, CaseManValidationHelper.CCBC_VALID_WARRANTNUMBER_PATTERN, 'CaseMan_invalidWarrantCCBCFormat_Msg'
		);
		if(warrantResult == null) {
			return null;
		}
		else {
			return warrantResult;
		}
	}
	return null;
}


/**
 * Function indicates whether or not an insolvency number passed in is in the required format.  The insolvency
 * number will be either part of the 8 digit number (number or the year), and must be a 4 digit number.
 * 
 * @param string insolvencyNo The warrant number to be tested
 * @returns ErrorCode an error code object if invalid else null
 * @author rzxd7g
 */
CaseManValidationHelper.validateInsolvencyNumber = function (insolvencyNo)
{
	var errMsg = null;
	if ( !CaseManUtils.isBlank(insolvencyNo) ) 
	{
		if ( isNaN(insolvencyNo) )
		{
			// Alphanumeric value
			errMsg = ErrorCode.getErrorCode('CaseMan_invalidInsolvencyFormat_Msg');
		}
		else
		{
			// Validate the insolvency number is 4 numeric digits
			errMsg = CaseManValidationHelper.validatePattern(
				insolvencyNo, CaseManValidationHelper.VALID_INSOLVENCY_PATTERN, 'CaseMan_invalidInsolvency_Msg'
			);
		}
	}
	return errMsg;
}