/**
File Name			    :  CCBCShared.js
Description			    :
Owner	(EDS Net ID)	:  Khaled Gawad [ vzq598 ]
Modification History	:
======================================================================================= 
 *  Ver.	CR#		Date		 Modified	   Email                    Description
 *  -----------------------------------------------------------------------------------
 *  1.0a		  	23-06-2005	 Khaled		  khaled.gawad@eds.com        Construction
 *
 *
 */
 
/****************************************************************************************
	                           CONSTANTS                                           
****************************************************************************************/
var FORM_XPATH = "/ds/var/form";
var PAGE_XPATH = "/ds/var/page";
var REJECTED_MENU="RejectedRecords";
/****************************************************************************************
	                           VALIDATION FUNCTIONS                                           
****************************************************************************************/

/**
 @name isAlphaNumeric
 @param value
 @return boolean
 @desc return true if the value passed is alphanumeric, no problem with "%" sign to use in "where" clause  
*/
function isAlphaNumeric(value){
	var alphaNumericPattern = new RegExp(/^[%a-zA-Z0-9]+$/);
	if(alphaNumericPattern.test(value)) return true;
	else return false;
}
function isAlphaNumericWithoutWildcard(value){
	var alphaNumericPattern = new RegExp(/^[a-zA-Z0-9]+$/);
	if(alphaNumericPattern.test(value)) return true;
	else return false;
}
/**
 @name isNumeric
 @param value
 @return boolean
 @desc return true if the value passed is numeric, no problem with "%" sign to use in "where" clause 
*/
function isNumeric(value){
	var numericPattern = new RegExp(/^[%0-9]+$/); 
	if(numericPattern.test(value)) return true;
	else return false;
}
/**
 @name isNumericWithoutWildcard
 @param value
 @return boolean
 @desc return true if the value passed is numeric
*/
function isNumericWithoutWildcard(value){
	var numericPattern = new RegExp(/^[0-9]+$/); 
	if(numericPattern.test(value)) return true;
	else return false;
}
/**
 @name isAlpha
 @param value
 @return boolean
 @desc return true if the value passed is alpha, no problem with "%" sign to use in "where" clause  
*/
function isAlpha(value){
	var alphaPattern = new RegExp(/^[%a-zA-Z]+$/); 
	if(alphaPattern.test(value)) 
		return true;
	else 
		return false;
}
/**
 @name isValidMoney
 @param value
 @return boolean
 @desc return true if the value passed is in money pattern 999999.00 
*/
function isValidMoney(value){
	var moneyPattern = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);          
	if(moneyPattern.test(value)) return true;
	else return false;
}

/**
 @name isValidFileName
 @param value
 @return boolean
 @desc return true if the value passed is a valid file name according to the file name validation in 
          CCBC-001 Log Received Tapes-Legacy from SQL
          file name  -  must be 10 characters long
                     -  first 4 characters must be numeric
                     -  characters from 5 to 7 must be either "WT." , "WE.", "JG.", "PD."
                     -  characters 8 to 10 must be between 0 and 9
                     -  example:   1234PD.154,  1548WT.147, 1696JG.854  are valid file names.
                     -  all available values: xxxxPD.xxx,  xxxxJG.xxx,  xxxxWT.xxx, xxxxWE.xxx
*/
function isValidFileName(value){
	var fileNamePattern = new RegExp(/^\d{4}([J][G]|[J][E]|[P][D]|[W][ET])\.\d{3}$/);
	if(fileNamePattern.test(value)) return true;
	else return false;
}

function isPartialValidFileName(value){
	var fileNamePattern = new RegExp(/^([%0-9]*)(([J%][G%]?|[P%][D%]?|[W%][%ET]?)\.?)([%0-9]{0,3})$/)
	if(fileNamePattern.test(value)) return true;
	else return false;
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
 */
function isNonZeroInteger(value){
	var nonZeroPattern = new RegExp(/^[1-9]\d*$/);          
	if(nonZeroPattern.test(value)) return true;
	else return false;
}

/**
 @name validateDate
 @param value
 @return boolean
 @desc return Error message if date is invalid or return null is valid. 
*/
validateDate = function(value,errorMessageID)
{
  var caseNumberPattern = /^\d{1,2}(\-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(\-)\d{4}$/
  var valid = value.search(caseNumberPattern);
	
  var errorCode = null;
  if(value.length > 0 && 0 != valid)
  {
    errorCode = ErrorCode.getErrorCode(errorMessageID);
  }
  return errorCode;
}
/**
 @name isValidPersonName
 @param value
 @return boolean
 @desc return true if the value passed is a valid person name, like 'Mike Jordan' , 'Bill Gates'  'Mohammed Al Afifi' :))
*/                                                // only one space between each 2 literals.
function isPartialValidPersonName(value){
	var personNamePattern = new RegExp(/^[%a-zA-Z\s]+$/); 
	if(personNamePattern.test(value))return true;
	else return false;
};

//................................ TRIMMING FUNCTIONS ...............................................
function Trim(value){
	if(value.length < 1){
		return"";
	}
	value = RTrim(value);
	value = LTrim(value);
	if(value==""){
		return "";
	}
	else{
		return value;
	}
} //End Function Trim
function RTrim(value){
	var w_space = String.fromCharCode(32);
	var v_length = value.length;
	var strTemp = "";
	if(v_length < 0){
		return"";
	}
	var temp = v_length -1;	
	while(temp > -1){
		if(value.charAt(temp) == w_space){
		}
		else{
			strTemp = value.substring(0,temp +1);
			break;
		}
		temp = temp-1;	
	} //End While
	return strTemp;
} //End Function
function LTrim(value){
	var w_space = String.fromCharCode(32);
	if(v_length < 1){
		return"";
	}
	var v_length = value.length;
	var strTemp = "";	
	var temp = 0;	
	while(temp < v_length){
		if(value.charAt(temp) == w_space){
		}
		else{
			strTemp = value.substring(temp,v_length);
			break;
		}
		temp = temp + 1;
	} //End While
	return strTemp;
} //End Function
//..................................... END OF TRIMMING FUNCTIONS ..................


/**
 * Date validation helper
 * The date format is:
 * YYYY-MMM-DD
 *
 * YYYY The year. 
 * MMM is the first three capitalized letters of the month.
 * JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC
 * DD being a the numeric day.
 * See DateBehaviour for Date element life cycle .
 */
function isValidDate(dateValue)
{
	var caseNumberPattern =new RegExp(/^\d{4}(\-)\d{1,2}(\-)\d{1,2}$/);
  if(!caseNumberPattern.test(dateValue)){
    return false;
  }
  else{
  	return true;
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
function isValidDateTxt(dateValue)
{	
  var caseNumberPattern =new RegExp(/^\d{1,2}(\-)(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(\-)\d{4}$/);
  if(!caseNumberPattern.test(dateValue)){
    return false;
  }
  else{
  	return true;
  }

}
// functions for Sorting dates
function dateRank(value)
{

	var i=0;
	var month=0;
	for(i=0;i<12;i++)
	{
			if(value==ValidationHelper.MONTHS[i])
			{
				i=i+1;
				month=i;
				break;
			}
	}
	
	return month;
};
function SortDate(a,b)
{
	var dateElements1 = a.split('-');
	var yyyy1 = dateElements1[2];
	var mmNumber1 = dateElements1[1] ;
	
	var dd1 = dateElements1[0];
	var dateElements2 = b.split('-');
	var yyyy2 = dateElements2[2];
	var mmNumber2 = dateElements2[1] ;
	
	var dd2   = dateElements2[0];
		
	
	if(yyyy1 > yyyy2)
	{
	
		return -1;
	}
	else if(yyyy2 > yyyy1)
	{
		
		return 1;
	}
	else if(dateRank(mmNumber1) > dateRank(mmNumber2))
	{
		
		return -1;
	}
	else if(dateRank(mmNumber2) > dateRank(mmNumber1))
	{
		
		return 1;
	}
	else if(dd1 > dd2)
	{	
		
		return -1;
	}
	else if(dd2 > dd1)
	{
		
		return 1;
	}
	else
	{
		
		return 0;
	}
};
/*****************************************************************************************************/
function validateComments(value){
	if(value==null||value==""||value.length<=80)return true;
	else return false;
};
/*****************************************************************************************************/
function validateWarrantFees(value, fileType){
	if(fileType=="PD"||fileType=="JG")return true;
	if(isNaN(value)) return false;
	if(value<0)return false;
    if(isValidMoney(value))return true;
	else return false;
};
/*****************************************************************************************************/
function validateNoOfRecords(value){
	if(value==null||value.length==0) return false;
    else if(isNaN(value))  return false;
    else if(value==0) return false;
    else if(isNonZeroInteger(value)) return true;
    else {
    		var pattern = new RegExp(/^[1-9]*$/);
    		if(!pattern.test(value)) return false;   
    		else return true; 																	  
    }
};
/*****************************************************************************************************/
