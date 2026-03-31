/****************************************************************************************************************
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

var adminCourtCode 	= "";

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author hzw6j7
 * 
 */
function OracleReportForm() {}
					
// load the System Date and Non Working Days into the XML	
OracleReportForm.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
	{ name:"Courts",         dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort",    serviceParams:[]}
];
		
// Header Fields and Save Button for WP Parameter form
		
			
// Define the form key bindings
OracleReportForm.keyBindings = [
	{ 
/**
 * @author hzw6j7
 * 
 */
		key: Key.F3, action: function() 
		{ 
			Status_RunReportButton.actionBinding(); 
		} 
	},
	
	{ 
		key: Key.F4, action: exitScreen 
	}
];			
			
		
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/


function ReturnToDrawerDate() {}

ReturnToDrawerDate.dataBinding = "/ds/var/page/OracleReportForm/ReturnToDrawerDate";
		
ReturnToDrawerDate.tabIndex = __tabIdx++;
ReturnToDrawerDate.componentName = "Referred To Drawer Date";		
ReturnToDrawerDate.srcData = null;
ReturnToDrawerDate.rowXPath = null;
ReturnToDrawerDate.keyXPath = null;
ReturnToDrawerDate.displayXPath = null;
ReturnToDrawerDate.helpText = "Enter a Referred To Drawer Date";
ReturnToDrawerDate.isMandatory = function()
	{
		return true;
	}

// Define the field validation rules
ReturnToDrawerDate.validateOn = [ReturnToDrawerDate.dataBinding];
ReturnToDrawerDate.validate = function(value)
{
	// Retrieve the Return To Drawer Date
	var date = Services.getValue(ReturnToDrawerDate.dataBinding);
	
	if (CaseManUtils.convertDateToDisplay(date) == null) {
		ec = ErrorCode.getErrorCode('CaseMan_invalidDateFormat_Msg');		
	    return faildedValidation (ec);
	}
	
	var returnToDrawerDate = CaseManUtils.createDate(date);
	var todaysDate = CaseManUtils.createDate(getTodaysDate());

	// Check for a future date
	if(CaseManUtils.compareDates(todaysDate, returnToDrawerDate ) != 1 ) {
		return null;
	} else {
		ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
	    return faildedValidation (ec);
	}      
  
  	return null;	
}

		
/*****************************************************************************/
/*      Start of Run Reports Button Enablement 								 */
/* Enable the Run report button when certain conditions are satisfied.       */
/* Set the fields to watch the ReturnToDrawerDate fields	                 */

Status_RunReportButton.enableOn = [ReturnToDrawerDate.dataBinding];
Status_RunReportButton.isEnabled = function()
{
    // retrieve the Payment Date
	var returnToDrawerDate    = Services.getValue(ReturnToDrawerDate.dataBinding);

	
	// If the Payment Date entered is not valid e.g. not well formed, in the future etc
	if ( !Services.getAdaptorById("ReturnToDrawerDate").getValid() )
	{
		//disable the Run Reports button
		return false;
	}		    	

	
	// if the Payment Date is blank, then disable the Run Reports button
	if ( CaseManUtils.isBlank(returnToDrawerDate) )
    {
  		//disable the Run Reports button
  		return false;
	}

	// If all conditions above are met, enable the button 
	return true;
}	

// Checks for the remaining invalidations and issues a warning pop up.
Status_RunReportButton.validationList = ["ReturnToDrawerDate"];

/*      		End of Run Reports Button Enablement 						 */
/*****************************************************************************/
			
/**
 * Create the Owning Court Name and Code objects
 * @author hzw6j7
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}

// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";

OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];
		
/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/

			
/**
 * Make the Owning Court Name, Code fields and text area read only
 * @author hzw6j7
 * @return boolean 
 */
OwningCourt_Code.isReadOnly = function()
{ 
	return true;
}

OwningCourt_Name.isReadOnly = function()
{ 
	return true;
}
				
/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/

/**
 * Create and initialise the variables that hold the Owning Court Name, Code and text area bolier plate text objects
 * @author hzw6j7
 * 
 */
OracleReportForm.initialise = function()
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
					
	// Get the court code
	adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
	    // get the todays date in YYYY-MM-DD format
	var todaysDate = CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate");
	// set todays date as the default value
	Services.setValue(ReturnToDrawerDate.dataBinding, todaysDate);
		 
	StartOfDayUtils.checkSuitorsCashStartOfDay("ReturnToDrawerReport");
}	

/*****************************************************************************************************************
											RETURN TO DRAWER STATUS HANDLER
*****************************************************************************************************************/

function ReturnToDrawerStatusHandler (){};
         	
/**
 * @param dom
 * @author hzw6j7
 * 
 */
ReturnToDrawerStatusHandler.onSuccess = function(dom)
{ 
	Services.setTransientStatusBarMessage("Referred to Draw Report Complete.");
}
       	

/**
 * @param exception
 * @author hzw6j7
 * 
 */
ReturnToDrawerStatusHandler.onError = function(exception)
{  
	// Loop through the exception handlers (giving precedence to more specialist exceptions)
	var preExceptionMethod = null;
		// Loop through the exception hierachy from highest to lowest
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
		{
	    	preExceptionMethod = eval("this.onPre" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception?
			if(preExceptionMethod != undefined)
			{
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
    	if (err == null || err.getMessage() == null || err.getMessage() == "")
    	{
    		//FormController.getInstance().setStatusBarMessage(exception.message);
    		Services.setTransientStatusBarMessage(exception.message);
    		alert(exception.message);
    	}
    	else // display message.
    	{
    		//FormController.getInstance().setStatusBarMessage(err.getMessage());
    		Services.setTransientStatusBarMessage(err.message);
    		alert(err.message);
   		}
    
		// Loop through the exception handlers (giving precedence to more specialist exceptions)
		var postExceptionMethod = null;
		for (var i = exception.exceptionHierarchy.length - 1 ; i >= 0 ; i--)
		{
	    	postExceptionMethod = eval("this.onPost" + exception.exceptionHierarchy[i]);
			// Does the callback handler implement an exception handler for this exception
			if(postExceptionMethod != undefined)
			{
			postExceptionMethod.call(this, exception);
			break;
		
			}
		}
}              	  


/*****************************************************************************************************************
                                         REQUEST REPORT
*****************************************************************************************************************/
			
/**
 * @author hzw6j7
 * 
 */
function requestReport()
{

	var dom = Reports.createReportDom("CM_RDCHQ.rdf");
	
	Reports.setValue(dom, "P_PAYMENT_DATE",  
				CaseManUtils.convertDateToDisplay(Services.getValue(ReturnToDrawerDate.dataBinding)) );								
	
	Reports.runReport(dom);
}	

/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
			
Status_RunReportButton.validationList = [];
			
function Status_RunReportButton() {}
Status_RunReportButton.tabIndex = __tabIdx++;
			
/**
 * @author hzw6j7
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
 * @author hzw6j7
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
}

/**
 * Displays the error message on the status bar
 * @param ec
 * @author hzw6j7
 * @return ec  
 */
function failedValidation (ec)
{
  if(ec != null)
  {
    Services.setTransientStatusBarMessage(ec.getMessage());
  }
  return ec;
}			

/**
 * @author hzw6j7
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}	

		
/**
 * @author hzw6j7
 * @return date  
 */
function getTodaysDate() 
{
	var date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	return date;
}
			
/**
 * @param ec
 * @author hzw6j7
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
 * @author hzw6j7
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author hzw6j7
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}





	
