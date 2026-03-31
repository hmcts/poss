/****************************************************************************************************************
						Run Pre-Payout report: CM_PPL
						
 * Change History *
 26 July 2006 Kevin Gichohi (EDS) - Check if the exception message being returned from the server is null or empty. CaseMan TD4068
					
****************************************************************************************************************/

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/
var reportModuleGroup = ""
var __tabIdx = 300;

// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

			
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
function ReleaseDate() {}

OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
ReleaseDate.dataBinding = "/ds/var/page/OracleReportForm/ReleaseDate";
		
/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/
OwningCourt_Code.isReadOnly = function() { return true; }
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
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);

    // Set the payment date as the previous working date
	var previousWorkingDate = CaseManUtils.getPreviousWorkingDate(REF_DATA_XPATH + "/SystemDate");
	Services.setValue(ReleaseDate.dataBinding, previousWorkingDate);

	checkSuitorsCashStartOfDay();
}			

/*****************************************************************************************************************
                                         BUTTONS
*****************************************************************************************************************/
Status_RunReportButton.validationList = ["ReleaseDate"];

function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;
			
/**
 * @author bz6s80
 * 
 */
Status_RunReportButton.actionBinding = function() {
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) ) {
		runPrePayout();
		exitScreen(); //DCA requested that the application should exit the screen after the report has run.
	} else {
		alert(Messages.POPUP_INVALID_MESSAGE);
	}				
}
			
//Enable the Proceed button when certain conditions are satisfied.
//Set the fields to watch, the nodes for the ref data shown below
Status_RunReportButton.enableOn = [REF_DATA_XPATH + "/PayoutProceed"];
Status_RunReportButton.isEnabled = function() { return checkPayoutProceed(); }	

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = __tabIdx++;
/**
 * @author bz6s80
 * 
 */
Status_Close_Btn.actionBinding = function() {
	exitScreen();
};

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

ReleaseDate.tabIndex = __tabIdx++;
ReleaseDate.componentName = "Release Date";
ReleaseDate.srcData = null;
ReleaseDate.rowXPath = null;
ReleaseDate.keyXPath = null;
ReleaseDate.displayXPath = null;
ReleaseDate.helpText = "Enter Release Date to which payments should be included";
ReleaseDate.isMandatory = function() { return true;	}
ReleaseDate.validateOn = [ReleaseDate.dataBinding];
ReleaseDate.validate = function(value)
{
    var releaseDate = Services.getValue(ReleaseDate.dataBinding);
    var releaseDateObj = CaseManUtils.isBlank(releaseDate) ? null : CaseManUtils.createDate(releaseDate);
    var ec = null;
    if(releaseDateObj != null)
    {
      ec = validateDate(releaseDateObj);     
    }
    return ec;		

}
/**
 * @author bz6s80
 * 
 */
ReleaseDate.setDefault = function()
	{
		Services.setValue(ReleaseDate.dataBinding, getTodaysDate());
	}

ReleaseDate.enableOn = [REF_DATA_XPATH + "/PayoutProceed"];
ReleaseDate.isEnabled = function() { return checkPayoutProceed(); }	

/**
 * @author bz6s80
 * @return !isRunning  
 */
function checkPayoutProceed() {
	var isRunning = false;
    var payoutProceed = Services.getNode(REF_DATA_XPATH + "/PayoutProceed");
   	if ( payoutProceed == null ) { 	
		isRunning = true;		
 	}	
 	return !isRunning;
}
		
/**
 * @param dateObj
 * @author bz6s80
 * @return null , faildedValidation (ec)  
 */
function validateDate(dateObj)
{    
  var todayDateObj = CaseManUtils.createDate(getTodaysDate());
  if(CaseManUtils.compareDates(dateObj, todayDateObj) == 1 ) {
      return null;
  } else {
    ec = ErrorCode.getErrorCode("CaseMan_dateCanOnlyBeInThePast_Msg");
    return faildedValidation (ec);
  }      
  return null;   
}

/**
 * @author bz6s80
 * @return date  
 */
function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	//alert(date);
	return date;
}

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
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						
	
/**
 * @param exception
 * @author bz6s80
 * 
 */
function handleError(exception) {
	// Kevin Gichohi (EDS) 07-June-2006. Framework removes all the : 
	// and other unwanted characters and returns the 
	// pure full message if catch(BusinessException e) is not called.
	// var message = exception.message.substring(exception.message.indexOf(":") + 2);
	var message = "An error occurred running the pre payout list report";
	if  (null != exception.message) 
	{
	    if ("" != exception.message)
	    {
	       message = exception.message;
		}   
	} 
	message = exception.message;
	Services.setTransientStatusBarMessage(message);
	alert(message);
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
	 getStartOfDayStatus ("CFO RUNDATE", systemDate, Services.getValue(OwningCourt_Code.dataBinding));

}
			
/*****************************************************************************************************************
											GET START OF DAY STATUS
*****************************************************************************************************************/
/**
 * @param runDate
 * @param systemDate
 * @param adminCourtCode
 * @author bz6s80
 * 
 */
function getStartOfDayStatus (runDate, systemDate, adminCourtCode)
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("runDate", runDate);
		params.addSimpleParameter("systemDate", systemDate);
		params.addSimpleParameter("adminCourtCode", adminCourtCode);
	Services.callService("getRunStartOfDayStatus", params, startOfDayExistsHandler, true);
}
	

/*****************************************************************************************************************
											GET START OF DAY STATUS HANDLER
*****************************************************************************************************************/
function startOfDayExistsHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	startOfDayExistsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node where the case number is stored
			var node = dom.selectSingleNode("ds/StartOfDay");
			if (node == null) {
				// store screen to return to.
				var navArray = new Array("PrintPrePayout");
				NavigationController.createCallStack(navArray);	

				// Start of day has not been run, Redirect to start of day screen
				Services.navigate("SuitorsCashStartOfDay");
			} else {  
				// Start of day has run
				checkSuitorsCashEndOfDay();
			}
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    startOfDayExistsHandler.onError = function(exception) {  
    	handleError(exception);
	}  // End onError

/*****************************************************************************************************************
                                         CHECK END OF DAY
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function checkSuitorsCashEndOfDay()
{
     //Check the Suitors Cash End Of Day

	 // check and see if the start of day reports have been run 
	 getEndOfDayStatus (Services.getValue(OwningCourt_Code.dataBinding));
}

/*****************************************************************************************************************
											GET RUN END OF DAY STATUS
*****************************************************************************************************************/
/**
 * @param adminCourtCode
 * @author bz6s80
 * 
 */
function getEndOfDayStatus (adminCourtCode)
{ 
	var params = new ServiceParams();
		params.addSimpleParameter("adminCourtCode", adminCourtCode);
	Services.callService("getSuitorsCashEndOfDayStatus", params, endOfDayExistsHandler, true);
}
	
/*****************************************************************************************************************
											GET RUN END OF DAY STATUS HANDLER
*****************************************************************************************************************/
function endOfDayExistsHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	endOfDayExistsHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node 
			var node = dom.selectSingleNode("/ds/EndOfDay");
			if (node != null) {
	            Services.replaceNode(REF_DATA_XPATH + "/EndOfDay", node );
            	Services.setTransientStatusBarMessage("End of Day Report has already been run for today");
			} else {
	            checkPayoutStatus();
            }
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    endOfDayExistsHandler.onError = function(exception) {  
    	handleError(exception);
 	}  // End onError


/*****************************************************************************************************************
                                         CHECK PRE-PAYOUT OK TO RUN
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function checkPayoutStatus()
{
	var params = new ServiceParams();
	var dom = XML.createDOM(null, null, null);

	params.addSimpleParameter("adminCourtCode", Services.getValue(OwningCourt_Code.dataBinding));

	Services.callService("checkPayoutStatus", params, payoutStatusHandler, true);
}
	
/*****************************************************************************************************************
											GET RUN END OF DAY STATUS HANDLER
*****************************************************************************************************************/
function payoutStatusHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	payoutStatusHandler.onSuccess = function(dom) { 
		//check the DOM for contents
		if (dom != null) {
			//select the node 
			var node = dom.selectSingleNode("/ds/PayoutProceed");
			if (node != null) {
			    Services.replaceNode(REF_DATA_XPATH + "/PayoutProceed", node );
			    Services.setFocus("ReleaseDate");
			}
		}
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    payoutStatusHandler.onError = function(exception) {  
    	handleError(exception);
	}  // End onError

/*****************************************************************************************************************
                                         RUN PRE-PAYOUT 
*****************************************************************************************************************/
/**
 * @author bz6s80
 * 
 */
function runPrePayout()
{
	Services.setTransientStatusBarMessage("Report Generation Requested: Please wait.");
	var params = new ServiceParams();
	var dom = XML.createDOM(null, null, null);

	var releaseDateXSD = CaseManUtils.createDate( Services.getValue(ReleaseDate.dataBinding) );
	params.addSimpleParameter("releaseDate", CaseManUtils.convertDateToPattern(releaseDateXSD, "DD-MMM-YYYY"));
	params.addSimpleParameter("callingOption", "P" );

	Services.callService("runPrePayout", params, runPrePayoutHandler, true);
}
	
/*****************************************************************************************************************
											RUN PRE-PAYOUT HANDLER
*****************************************************************************************************************/
function runPrePayoutHandler (){};
         	
/**
 * @param dom
 * @author bz6s80
 * 
 */
   	runPrePayoutHandler.onSuccess = function(dom) { 
   		Services.setTransientStatusBarMessage("Report Generation Complete");
	} // END onSuccess
        	
/**
 * @param exception
 * @author bz6s80
 * 
 */
    runPrePayoutHandler.onError = function(exception) {  
    	handleError(exception);
	}  // End onError
	
