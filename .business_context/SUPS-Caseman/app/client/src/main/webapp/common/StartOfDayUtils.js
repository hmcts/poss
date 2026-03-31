/** 
 * @fileoverview CaseMan Utility Class - Helper class which implements
 * common utility functions for start of day checking.  All functions are static.
 *
 * @author Mark Hallam
 * @version 1.0 
 */

StartOfDayUtils.SUITORS_CASH_START_OF_DAY = "CFO RUNDATE";
StartOfDayUtils.SUITORS_CASH_START_OF_DAY_SCREEN = "SuitorsCashStartOfDay";
StartOfDayUtils.SUITORS_CASH_RETURN_SCREEN = "";

function StartOfDayUtils () {}


/*****************************************************************************************************************
                                         CHECK START OF DAY
*****************************************************************************************************************/
/**
 * @param returnScreen
 * @author bz6s80
 * @return Screen  
 */
function StartOfDayUtils.checkSuitorsCashStartOfDay(returnScreen)
{
     StartOfDayUtils.SUITORS_CASH_RETURN_SCREEN = returnScreen;
     //Check the Suitors Cash Start Of Day

	 // Get the system date in YYYY-MM-DD format
	 date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	 // Return system date as a string in YYYYMMDD format
	 systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	 // check and see if the start of day reports have been run 
	 StartOfDayUtils.getRunStartOfDayStatus (StartOfDayUtils.SUITORS_CASH_START_OF_DAY, systemDate, Services.getValue(OwningCourt_Code.dataBinding));

}
			
/*****************************************************************************************************************
											GET RUN START OF DAY STATUS
*****************************************************************************************************************/
	
	
						
/**
 * Checks to see if the case number exists in the database.
 * @param runDate
 * @param systemDate
 * @param adminCourtCode
 * @author bz6s80
 * 
 */
function StartOfDayUtils.getRunStartOfDayStatus (runDate, systemDate, adminCourtCode)
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("runDate", runDate);
		params.addSimpleParameter("systemDate", systemDate);
		params.addSimpleParameter("adminCourtCode", adminCourtCode);
	Services.callService("getRunStartOfDayStatus", params, StartOfDayUtils.StartOfDayExistsHandler, true);
}
	

/*****************************************************************************************************************
											GET RUN START OF DAY STATUS HANDLER
*****************************************************************************************************************/

          
function StartOfDayUtils.StartOfDayExistsHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	StartOfDayUtils.StartOfDayExistsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node where the case number is stored
			var node = dom.selectSingleNode("ds/StartOfDay");
			if (node == null) {
				// store screen to return to.
				var navArray = new Array( StartOfDayUtils.SUITORS_CASH_RETURN_SCREEN );
				NavigationController.createCallStack(navArray, true);	

				// Start of day has not been run, Redirect to start of day screen
				Services.navigate(StartOfDayUtils.SUITORS_CASH_START_OF_DAY_SCREEN);
			}
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    StartOfDayUtils.StartOfDayExistsHandler.onError = function(exception) {  
    	// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var preExceptionMethod = null;
		// Loop through the exception hierachy from highest to lowest
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception?
			if(preExceptionMethod != undefined) {
				preExceptionMethod.call(this, exception);
				break;
			}
		}
	
    	Logging.error(exception.message);
		var err = null;
		if (exception.message.indexOf("'") < 0)
		{
			ErrorCode.getErrorCode("Caseman_Err" + exception.name);
		}
    
    	// if no message exists for exception type.
    	if (err == null || err.getMessage() == null || err.getMessage() == "") {
    		//FormController.getInstance().setStatusBarMessage(exception.message);
    		Services.setTransientStatusBarMessage(exception.message);
    		alert(exception.message);
    	} else { // display message.
    		//FormController.getInstance().setStatusBarMessage(err.getMessage());
    		Services.setTransientStatusBarMessage(err.message);
    		alert(err.message);
   		}
    
		// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var postExceptionMethod = null;
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception
			if(postExceptionMethod != undefined) {
				postExceptionMethod.call(this, exception);
				break;
			}
		}
	}  // End onError

/*****************************************************************************************************************
                                         CHECK END OF DAY
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function StartOfDayUtils.checkSuitorsCashEndOfDay()
{
     //Check the Suitors Cash End Of Day

	 // check and see if the start of day reports have been run 
	 StartOfDayUtils.getEndOfDayStatus (Services.getValue(OwningCourt_Code.dataBinding));
}

/*****************************************************************************************************************
											GET RUN END OF DAY STATUS
*****************************************************************************************************************/
	
	
						
/**
 * Checks to see if the case number exists in the database.
 * @param adminCourtCode
 * @author bz6s80
 * 
 */
function StartOfDayUtils.getEndOfDayStatus (adminCourtCode)
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("adminCourtCode", adminCourtCode);
	Services.callService("getSuitorsCashEndOfDayStatus", params, StartOfDayUtils.EndOfDayExistsHandler, true);
}
	
/*****************************************************************************************************************
											GET RUN END OF DAY STATUS HANDLER
*****************************************************************************************************************/

          
function StartOfDayUtils.EndOfDayExistsHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	StartOfDayUtils.EndOfDayExistsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node 
			var node = dom.selectSingleNode("/ds/EndOfDay");
			if (node != null) {
	            Services.replaceNode(REF_DATA_XPATH + "/EndOfDay", node );
            	Services.setTransientStatusBarMessage("End of Day Report has already been run for today");
			}
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    StartOfDayUtils.EndOfDayExistsHandler.onError = function(exception) {  
    	// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var preExceptionMethod = null;
		// Loop through the exception hierachy from highest to lowest
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception?
			if(preExceptionMethod != undefined) {
				preExceptionMethod.call(this, exception);
				break;
			}
		}
	
    	Logging.error(exception.message);
		var err = null;
		if (exception.message.indexOf("'") < 0)
		{
			ErrorCode.getErrorCode("Caseman_Err" + exception.name);
		}
    
    	// if no message exists for exception type.
    	if (err == null || err.getMessage() == null || err.getMessage() == "") {
    		//FormController.getInstance().setStatusBarMessage(exception.message);
    		Services.setTransientStatusBarMessage(exception.message);
    		alert(exception.message);
    	} else { // display message.
    		//FormController.getInstance().setStatusBarMessage(err.getMessage());
    		Services.setTransientStatusBarMessage(err.message);
    		alert(err.message);
   		}
    
		// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var postExceptionMethod = null;
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--) {
	    	postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception
			if(postExceptionMethod != undefined) {
				postExceptionMethod.call(this, exception);
				break;
			}
		}
	}  // End onError

	
