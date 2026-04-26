/** 
 * @fileoverview HearingHelperFunctions.js:
 * This file contains the commonly used helper functions used for UC008
 * (Hearings/Hearings CO) screens and the Add Hearing Subform
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 21/08/2006 - Chris Vincent, Change to setDay() so for invalid dates (e.g. wrong format or a date
 * 				like 30 Feb) it returns a blank string instead of 'MONDAY' previously.  Defect 4520.
 * 05/09/2006 - Chris Vincent, updated validateTimeAt to handle the anomaly of changing from an invalid 
 * 				variation of 0 (e.g. 00.00) to the time 00:00 which also evaluates to 0 so the framework 
 * 				thinks no change has been made and the validate function does not fire.  Defect 5076.
 * 11/09/2006 - Chris Vincent, refixed defect 5076 (see above).  Original fix did not
 * 				refresh the display value so now the transformToModelTime and transformToDisplayTime
 * 				specifically filter out variations of 0 entered into the field and save a non numeric 
 * 				string into the DOM which the transformToDisplayTime looks for and converts to 00.00.
 */

/**
 * Function checks that a date passed in falls on a non working day
 *
 * @param string date The date to be checked in the model format (YYYY-MM-DD)
 * @return ErrorCode The error code CaseMan_dateNonWorkingDay_Msg if the date falls on a non working day else null
 * @author rzxd7g
 */
function validateNonWorkingDate(date) 
{
 	if ( Services.exists(XPathConstants.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") )
 	{
 		return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
 	}
 	return null;
}

/**********************************************************************************/

/**
 * Function checks that a time passed in in the correct format
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return ErrorCode The error code if the time passed in is invalid else null
 * @author rzxd7g
 */
function validateTimeAt(pTime, validTimeFlagXPath)
{
	if ( null == validTimeFlagXPath )
	{
		return null;
	}
	
	if(Services.getValue(validTimeFlagXPath) == "N")
	{
		return ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
	}
	
	// To get to this point, we know that validTimeFlagXPath is Y so has passed
	// the time format validation in the TransformToModel
	var errCode = null;
	if ( !CaseManUtils.isBlank(pTime) )
	{
		// The value put in the dom is supposed to be a number, so first check if it is numeric
		var validSeconds = pTime.search(/^\d+$/);
		if ( validSeconds != 0 )
		{
			// If the is number validation fails, we know the validate function has been called from
			// the setting of the validTimeFlagXPath (see validateOn[] config).
			// We know it is in a valid time format, but need to convert the value to a number for
			// validation purposes.
			pTime = CaseManUtils.convertTimeToSeconds(pTime);
		}
		
		// If it is numeric, check that it is within a valid range
		if ( pTime < 0 || pTime > 86400 )
		{
			errCode = ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
		}
	}
	return errCode;	
}

/**********************************************************************************/

/**
 * Function checks that an hour value passed in is valid
 *
 * @param string pHours The hour to be checked
 * @return ErrorCode The error code if the hour passed in is invalid else null
 * @author rzxd7g
 */
function validateHoursAllowed(pHours)
{
	errCode = null;	
	if( !CaseManUtils.isBlank(pHours) )
	{
		if( pHours.search(CaseManValidationHelper.VALID_HOURS_PATTERN) == -1 )
		{
			errCode = ErrorCode.getErrorCode("CaseMan_invalidAllowedHours_Msg");
		}			
	}
	return errCode;
}

/**********************************************************************************/

/**
 * Function checks that a minutes value passed in is valid
 *
 * @param string pMins The minutes value to be checked
 * @return ErrorCode The error code if the minutes passed in are invalid else null
 * @author rzxd7g
 */
function validateMinsAllowed(pMins)
{
	errCode = null;	
	if( !CaseManUtils.isBlank(pMins) )
	{
		if( pMins.search(CaseManValidationHelper.VALID_MINS_PATTERN) == -1 )
		{
			errCode = ErrorCode.getErrorCode("CaseMan_invalidAllowedMins_Msg");
		}
	}
	return errCode;
}

/**********************************************************************************/

/**
 * Function generates the next surrogate key in the current sequence when creating a 
 * new hearing
 *
 * @return string The next surrogate key in the sequence
 * @author rzxd7g
 */
function getNextSurrogateKey()
{
	var surrogateKey = Services.getValue(XPathConstants.SURROGATEKEY_XPATH);
	var nextKey = CaseManUtils.isBlank(surrogateKey) ? 1 : (parseInt(surrogateKey) + 1);
	Services.setValue(XPathConstants.SURROGATEKEY_XPATH, nextKey);
	return "S" + nextKey;
}

/**********************************************************************************/

/**
 * This method ensures a time is transformed so that it can be validated correctly.
 * If the pTime param is not a valid time then the method stores the incorrect value to the DOM
 * If an invalid time is entered, a flag is set at the xpath sent in as can be one of potentially
 * multiple hearings or even a new hearing.
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return string The time converted to seconds or the time as it was passed in if invalid
 * @author rzxd7g
 */
function transformToModelTime(pTime, validTimeFlagXPath)
{
	var validTimeInd = "N";
	var returnValue = pTime;
	if ( null != pTime )
	{
		if ( CaseManValidationHelper.validateTime(pTime) )
		{
			// Valid time format, convert the time to seconds after midnight
			validTimeInd = "Y";
			returnValue = CaseManUtils.convertTimeToSeconds(pTime);
		}
		else if ( pTime == 0 )
		{
			// Invalid time which meets the 0 value anomaly, store a non numeric string instead 
			// of 0 which force the validate and transform to display to fire when a valid time
			// is entered.
			returnValue = "00_00";
		}
	}
	
	// Set the hearing time valid flag and return the appropriate value for the model
	Services.setValue(validTimeFlagXPath, validTimeInd);
	return returnValue;
}

/**********************************************************************************/
	
/**
 * This method ensures a time is transformed from the DOM to display correctly.
 * Even if invalid must be displayed as the user entered.
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return string The time converted from seconds to time or as it was passed in if invalid
 * @author rzxd7g
 */
function transformToDisplayTime(pTime, validTimeFlagXPath)
{	
	if ( Services.getValue(validTimeFlagXPath) == "N" )
	{
		// If the time entered is not valid, check for the value stored when a 
		// variation of 0 is entered (due to problems comparing 00.00 to 0
		return ( pTime == "00_00" ) ? "00.00" : pTime;
	}
	
	if ( null != pTime && !isNaN(pTime) )
	{
		var convertedTime = CaseManUtils.convertSecondsToTime(pTime);
		if ( null != convertedTime )
		{
			if ( CaseManValidationHelper.validateTime(convertedTime) )
			{
				// Only return a converted time if it is a valid time
				return convertedTime;
			}
		}
	}
	return pTime;
}

/**********************************************************************************/

/**
 * Method returns a day for a supplied date, e.g. Monday, Tuesday etc.
 *
 * @param string pDate The date in the mdoel format (YYYY-MM-DD)
 * @return string The full week day for the date passed in or blank if date invalid
 * @author rzxd7g
 */
function setDay(pDate)
{
	var day = ""; // Day as text.  This is returned	
	var theDate;
	
	if ( !CaseManUtils.isBlank(pDate) && null != FWDateUtil.parseXSDDate(pDate) )
	{
		theDate = CaseManUtils.createDate(pDate);		
		day = CaseManUtils.FULLWEEKDAYS[ theDate.getDay() ];
		day = day.toUpperCase();	  	
  	}
  	
  	return day;  	
}

/**********************************************************************************/

/**
 * Validate method chceking a date is not in the future
 *
 * @param string value A date in the model format (YYYY-MM-DD)
 * @return ErrorCode The errorcode if the date is in the future else null
 * @author rzxd7g
 */
function validateDateInFuture(value)
{
    var errCode = null;
   	var today = CaseManUtils.createDate(CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));
   	var compare = CaseManUtils.compareDates(today, CaseManUtils.createDate(value));

   	if(compare > 0)
   	{
   		errCode = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
   	}    	
	return errCode;
}
