/**
 * 	These are functions as first coded.
 *  See comments in WPU.js before editing this file.
 */
 
 /**
  * Obviously, these have been ripped out of their original contexts...
 */
  

 
/**
 *Get the expiry date of the obligation
 *@return the exiry date
 * @author nz5zpz
 * @return (Services.getNodes("/ds/wp/MaintainObligations/Obligations/Obligation/ExpiryDate")[maxI].text)  
 */
 function getExpiryDate()
 {
	var expiryDate;

	var obNode = Services.getNodes("/ds/wp/MaintainObligations/Obligations/Obligation/ObligationSeq");

	var max = obNode[0].text;
	var maxI = 0;

	for(var i=0;i < obNode.length; i++) {
		if(new Number(obNode[i].text) > new Number(max)) {
					max = obNode[i].text;
					maxI = i;
		}
	}
	
	return (Services.getNodes("/ds/wp/MaintainObligations/Obligations/Obligation/ExpiryDate")[maxI].text); 
 }
 
/**
 * Is the case type of County Court
 *@return true if county court
 * @author nz5zpz
 * @return !( null != cd && cd.length > 0)  
 */
 function isCountyCourt()
 { 
	var cd = Services.getValue("/ds/ManageCase/CourtDivision");			
	return !( null != cd && cd.length > 0);
 }
 
 
 
 /**
 *Deprecated: Does not fit use of framework: use validateCurrencyValue in WPU.js
 *Checks that the paramater 'value' does not exceed the paramater 'max'
 * Returns an error message string if value is greater than max
 *@param: value
 *@param max
 *@return errorMessage
 * @param value
 * @param max
 * @author nz5zpz
 * @return stringMsg  
 */
 function checkMaxAmount( value, max)
 {
 	var errCode = null;
	var maxExd = false;
	var stringMsg = null;
	if (!CaseManUtils.isBlank(value))
	{
	   errCode = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
	   if(null == errCode)
	   {  if( 0 > value ) 
		  { errCode = ErrorCode.getErrorCode("CaseMan_negativeAmountEntered_Msg");}
		    
		       if(value > max )
		       {   errCode = ErrorCode.getErrorCode("CaseMan_maximum_amount_exceeded_Msg");
	               maxExd = true;
		       }
		   }
		}
		
	 if( errCode != null)
	 {  stringMsg = errCode.getMessage();
	    if( maxExd ){  stringMsg += max; }
	 }

	return stringMsg;
  }

/**
 * @param date
 * @author nz5zpz
 * @return convertedDate  
 */
function transformDateToModel(date)
{
	var convertedDate = date;
	if(date != null){
		if(date.search(CaseManValidationHelper.DDMMMYYYY_DATE_PATTERN) != -1){
			convertedDate = CaseManUtils.convertDateToPattern(date, "YYYY-MM-DD");
			if(convertedDate == null){
				// problem converting date so save value entered by the user
				convertedDate = date;
			}
		}
	}
	return convertedDate;
}
	
