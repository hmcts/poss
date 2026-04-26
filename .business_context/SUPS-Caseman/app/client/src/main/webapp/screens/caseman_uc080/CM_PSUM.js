/****************************************************************************************************************
						Print Payment Summary Report: CM_PSUM

	*Change History*
	  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 										 on the client as wrong message was being displayed. CaseMan TD4061	
 	 4 Dec 2006 Mark Groen (EDS) - uct defect 867 - When user selects to end accounting period, they should return to the main menu.
 	 7 Dec 2006 Steve Blair - Added screen to nav controller for navigating to start of day (defect 5894).
 	 18 Jan 2007 Mark Groen (EDS) - temp_caseman defect 405 - When report has been run once, cannot re run for same accounting period.
							
****************************************************************************************************************/

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/
var reportModuleGroup = ""
var __tabIdx = 300;
	
var todaysDate = null;

// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

var _eodExistsXPath = "/ds/var/page/OracleReportForm/EODExists";
var _lastDayOfMonthXPath = "/ds/var/page/OracleReportForm/LastDayOfMonth";
// defect tmp_caseman 405 - need a new variable to hold whether report has already been run or not
var _reportRun = "/ds/var/page/OracleReportForm/ReportRun";
var _endOfMonthDate = "/ds/var/page/OracleReportForm/LastMonthDate";

var SUITORS_CASH_RETURN_SCREEN = "EndAccountingPeriod";


/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
/**
 * Form element
 * @author bz6s80
 * 
 */
function OracleReportForm() {}
		
OracleReportForm.refDataServices = [
	{name:"SystemDate", dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"Courts", dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]}
];
			
// Form Keybindings
OracleReportForm.keyBindings = [
/**
 * @author bz6s80
 * 
 */
	{ key: Key.F3, action: function() { Status_RunReportButton.actionBinding(); } },
	{ key: Key.F4, action: exitScreen }
];			
			
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
function OwningCourt_Name() {}
function OwningCourt_Code() {}
function EndAccountingPeriod() {}
			
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
EndAccountingPeriod.dataBinding = "/ds/var/page/OracleReportForm/EndAccountingPeriod";

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/
OwningCourt_Code.isReadOnly = function() { return true;	}
OwningCourt_Name.isReadOnly = function() { return true; }
		
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
OracleReportForm.initialise = function()
{
	//debugger;
	todaysDate = CaseManUtils.createDate(CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate"));
	
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);

	Services.setValue(_lastDayOfMonthXPath, "false");
	Services.setValue(_eodExistsXPath, "false");
	// defect 405 - initialise flag
	Services.setValue(_reportRun, "false");
	Services.setValue(_endOfMonthDate, "");
	
	checkSuitorsCashStartOfDay();
	
}			

/*****************************************************************************************************************
                                         REQUEST REPORT
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function requestReport()
{
	//debugger;
	var dom = Reports.createReportDom("CM_PSUM.rdf");
	var endAccountPeriod = Services.getValue(EndAccountingPeriod.dataBinding);
	Reports.setValue(dom, "P_END_ACCOUNT_PERIOD",  endAccountPeriod);		
	if(endAccountPeriod != null && endAccountPeriod == 'X'){
		Reports.runReport(dom, true); //  uct defect 867 - added true (returntoscreen paramater) to the call and added the if statement.
	}
	else{
		Reports.runReport(dom);
	}
	
}	

/*****************************************************************************************************************
                                         CHECK START OF DAY
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function checkSuitorsCashStartOfDay()
{
     //Check the Suitors Cash Start Of Day

	 // Get the system date in YYYY-MM-DD format
	 date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	 // Return system date as a string in YYYYMMDD format
	 systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");

	 // check and see if the start of day reports have been run 
	 getRunStartOfDayStatus (StartOfDayUtils.SUITORS_CASH_START_OF_DAY, systemDate, Services.getValue(OwningCourt_Code.dataBinding));

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
function getRunStartOfDayStatus (runDate, systemDate, adminCourtCode)
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("runDate", runDate);
		params.addSimpleParameter("systemDate", systemDate);
		params.addSimpleParameter("adminCourtCode", adminCourtCode);
	Services.callService("getRunStartOfDayStatus", params, StartOfDayExistsHandler, true);
}
	

/*****************************************************************************************************************
											GET RUN START OF DAY STATUS HANDLER
*****************************************************************************************************************/

          
function StartOfDayExistsHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	StartOfDayExistsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node where the case number is stored
			var node = dom.selectSingleNode("ds/StartOfDay");
			if (node == null) {
				// store screen to return to.
				var navArray = new Array("EndAccountingPeriod");
				NavigationController.createCallStack(navArray);	

				// Start of day has not been run, Redirect to start of day screen
				Services.navigate(StartOfDayUtils.SUITORS_CASH_START_OF_DAY_SCREEN);
			}
		}
		
		checkSuitorsCashEndOfDayHasRun();
		
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    StartOfDayExistsHandler.onError = function(exception) {  
	var message = "An error occurred checking the start of day has run";
	/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
	alert(message);
	}  // End onError


/*****************************************************************************************************************
                                         CHECK END OF DAY HAS RUN
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function checkSuitorsCashEndOfDayHasRun()
{
     //Check the Suitors Cash End Of Day report has run
	var params = new ServiceParams();
		params.addSimpleParameter("adminCourtCode", Services.getValue(OwningCourt_Code.dataBinding));
//		debugger;
	Services.callService("getSuitorsCashEndOfDayStatus", params, endOfDayHasRunHandler, true);
}
	
/*****************************************************************************************************************
											GET RUN END OF DAY STATUS HANDLER
*****************************************************************************************************************/
function endOfDayHasRunHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	endOfDayHasRunHandler.onSuccess = function(dom) { 
//   		debugger;
		//check the DOM for contents
		if (dom != null) {
			//select the node 
			var node = dom.selectSingleNode("/ds/EndOfDay");
			if (node == null) {
	            Services.setTransientStatusBarMessage("The end of day has not been run for today");
			} else {
				// end of day has run so enable runReport button.
				Services.setValue(_eodExistsXPath, "true");
			}
		}
		//checkLastWorkingDayOfMonth();
		getNonWorkingDaysForMonth();		
		
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    endOfDayHasRunHandler.onError = function(exception) { 
//    	debugger; 
		Services.setValue(_eodExistsXPath, "false");
		var message = "An error occurred checking the end of day has run";
		/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
		if  (null != exception.message) 
		{
	    	if ("" != exception.message)
		    {
		       message = exception.message;
			}   
		} 
		Services.setTransientStatusBarMessage(message);
		alert(message);
	}  // End onError


/*****************************************************************************************************************
											GET HAS REPORT RUN HANDLER
*****************************************************************************************************************/
function reportRunHandler (){};
         	
/**
 * temp_caseman 405.  Cjheck the report has not already been run
 * @param dom
 * @author RZHH8K
 * 
 */
reportRunHandler.onSuccess = function(dom) { 
	//check the DOM for contents
	if(dom != null){
		//select the node 
		var endAccountReportRun = dom.selectSingleNode("/ds/PaymentSummary/ReportRun").text;
		if(endAccountReportRun != null && endAccountReportRun == "true"){				
            Services.setTransientStatusBarMessage("The account period has already ended.");
            Services.setValue(_reportRun, "true");
		} 
		else{
			// not run so can enable field and button if other validation is ok
			Services.setValue(_reportRun, "false");
		}
	}		
} // END onSuccess
        	
/**
 * temp_caseman 405.  Cjheck the report has not already been run
 * @param exception
 * @author RZHH8K
 * 
 */
reportRunHandler.onError = function(exception) { 
	Services.setValue(_eodExistsXPath, "false");
	var message = "An error occurred checking whether the accounting period has already ended.";
	if (null != exception.message){
    	if("" != exception.message){
	       message = exception.message;
		}   
	} 
	Services.setTransientStatusBarMessage(message);
}  // End onError

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
EndAccountingPeriod.tabIndex = __tabIdx++;
EndAccountingPeriod.componentName = "End Accounting Period";		
EndAccountingPeriod.srcData = null;
EndAccountingPeriod.rowXPath = null;
EndAccountingPeriod.keyXPath = null;
EndAccountingPeriod.displayXPath = null;
EndAccountingPeriod.helpText = null;
EndAccountingPeriod.isMandatory = function() {return true;}
EndAccountingPeriod.validateOn = [		];
EndAccountingPeriod.validate = function(value) {	}
/**
 * @author bz6s80
 * 
 */
EndAccountingPeriod.setDefault = function() {Services.setValue(EndAccountingPeriod.dataBinding, "");}
EndAccountingPeriod.modelValue = {checked: 'X', unchecked: ''};
	
Status_RunReportButton.validationList = [];
			
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
			
			
function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * @author bz6s80
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		requestReport();
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}
			
function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author bz6s80
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/**
 * @param ec
 * @author bz6s80
 * @return ec  
 */
function faildedValidation (ec)
{
  if(ec != null)
  {
    Services.setTransientStatusBarMessage(ec.getMessage());
  }
  return ec;
}		

/**
 * @author bz6s80
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
	
//Enable the Run report button when certain conditions are satisfied.
//Set the fields to watch, the nodes for the ref data shown below
Status_RunReportButton.enableOn = [_eodExistsXPath, _lastDayOfMonthXPath, _reportRun];
Status_RunReportButton.isEnabled = function()
{ 
	var enable = false;
    var endOfDay = Services.getValue(_eodExistsXPath);
    var lastDayOfMonth = Services.getValue(_lastDayOfMonthXPath);
    // tmp_caseman defect 405 only run the report once
    var reportRun = Services.getValue(_reportRun);    
    
   	if ( endOfDay == "true" && lastDayOfMonth == "true") { 	
		enable = true;		
 	}
 	
 	// tmp_caseman defect 405 only run the report once
	if(enable == true && reportRun == "true"){
		enable = false;
	}
 	return enable;
}	

//Enable the EndAccountingPeriod CheckBox when certain conditions are satisfied.
//Set the fields to watch, the nodes for the ref data shown below
EndAccountingPeriod.enableOn = [_eodExistsXPath, _lastDayOfMonthXPath, _reportRun];
EndAccountingPeriod.isEnabled = function()
{ 
	var enable = false;
    var endOfDay = Services.getValue(_eodExistsXPath);
    var lastDayOfMonth = Services.getValue(_lastDayOfMonthXPath);
    // tmp_caseman defect 405 only run the report once
    var reportRun = Services.getValue(_reportRun);
   	if ( endOfDay == "true" && lastDayOfMonth == "true") { 	
		enable = true;		
 	}
 	
 	// tmp_caseman defect 405 only run the report once
	if(enable == true && reportRun == "true"){
		enable = false;
	}
 	
 	return enable;
}	

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author bz6s80
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}

/**
 * @author bz6s80
 * 
 */
function checkLastWorkingDayOfMonth() {
//debugger;
	var lastWorkingDayOfMonth = CaseManUtils.getLastDateOfMonth(REF_DATA_XPATH + "/SystemDate", false);
	var lastDay = lastWorkingDayOfMonth.getDate();
	
	// weekend or non-working day - assumption: whole month will not be set to non-working
	while (lastWorkingDayOfMonth.getDay() == 0 || lastWorkingDayOfMonth.getDay() == 6
			|| Services.getValue("/ds/NonWorkingDays/NonWorkingDay[Day = " + lastDay + "]/Day") != null) 
	{
		lastWorkingDayOfMonth.setDate(--lastDay);
	}

	if (CaseManUtils.compareDates(todaysDate, lastWorkingDayOfMonth) == 0) {
		Services.setValue(_lastDayOfMonthXPath, "true");
		// tmp_caseman defect 405 - check if already ended account period. 
		// Need the date to check database
		Services.setValue(_endOfMonthDate, CaseManUtils.convertDateToPattern(lastWorkingDayOfMonth, CaseManUtils.DATE_MODEL_FORMAT));
	} else {
        Services.setTransientStatusBarMessage("Today is not the last working day of the month");
	}
	
	// tmp_caseman 405 Check not yet run report
	var endOfDay = Services.getValue(_eodExistsXPath);
	var lastDayOfMonth = Services.getValue(_lastDayOfMonthXPath);
	var endOfMonthDate = Services.getValue(_endOfMonthDate); 			
	
	if(endOfDay != null && endOfDay == "true" && lastDayOfMonth != null && lastDayOfMonth == "true" 
					&& endOfMonthDate != null && endOfMonthDate != ""){
					
		var params = new ServiceParams();
		params.addSimpleParameter("adminCourtCode", Services.getValue(OwningCourt_Code.dataBinding));
		params.addSimpleParameter("endOfMonthDate", endOfMonthDate);
		Services.callService("getEndOfAccountPeriodRun", params, reportRunHandler, true);
	}
}


/*****************************************************************************************************************
                                         GET NON WORKING DAYS FOR MONTH
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function getNonWorkingDaysForMonth()
{
	var params = new ServiceParams();
		params.addSimpleParameter("month", todaysDate.getMonth() + 1);
		params.addSimpleParameter("year", todaysDate.getYear());
	Services.callService("getNonWorkingDaysForMonth", params, nonWorkingDaysForMonthHandler, true);
}
	
/*****************************************************************************************************************
											GET NON WORKING DAYS FOR MONTH HANDLER
*****************************************************************************************************************/
function nonWorkingDaysForMonthHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	nonWorkingDaysForMonthHandler.onSuccess = function(dom) { 
//debugger;
		//check the DOM for contents
		if (dom != null) {
			//select the node 
			var node = dom.selectSingleNode("/NonWorkingDays");
			if (node != null) {
				Services.replaceNode("/ds/NonWorkingDays", node);
				checkLastWorkingDayOfMonth();
			}
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    nonWorkingDaysForMonthHandler.onError = function(exception) { 
//    	debugger; 
		var message = "An error occurred checking non working days for month";
		/*  26 July 2006 Kevin Gichohi (EDS) - Exception handling was changed on the server, hence it should also change
 		on the client as wrong message was being displayed. */
		if  (null != exception.message) 
		{
		    if ("" != exception.message)
		    {
		       message = exception.message;
			}   
		} 
		Services.setTransientStatusBarMessage(message);
		alert(message);
	}  // End onError
