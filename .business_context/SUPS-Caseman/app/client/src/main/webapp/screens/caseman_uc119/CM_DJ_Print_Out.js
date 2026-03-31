/****************************************************************************************************************
											CM_DJ_* : Produce District judge print out										
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

var CASE_EXISTS_XPATH = "/ds/var/form/caseExists";


/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author jzg9yw
 * 
 */
function OracleReportForm() {}
					
// load the System Date, Non Working Days, Court code and name into the XML	
OracleReportForm.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
	{ name:"NonWorkingDays", dataBinding:REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{ name:"Courts",         dataBinding:REF_DATA_XPATH, serviceName:"getCourtsShort",    serviceParams:[]}
];
		
			
// Define the form key bindings
OracleReportForm.keyBindings = [
	{ 
/**
 * @author jzg9yw
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
			

// Generate the method for calling the service -start

		
/**
 * @author jzg9yw
 * 
 */
function requestReport()
{
	// Create the DOM
	var dom = Reports.createReportDom("CM_DJ_Print_Out.rdf");
	
	// Set the values of the case number and hearing date into the DOM			
	Reports.setValue(dom, "CASE_NUMBER",  Services.getValue(EnterCaseNumber.dataBinding) );								
	Reports.setValue(dom, "HEARING_DATE",  CaseManUtils.convertDateToDisplay(Services.getValue(HearingDate.dataBinding)) );								
			
	   // Run the report
	Reports.runReport(dom);
}	

		
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
		
function EnterCaseNumber() {}
function HearingDate() {}

EnterCaseNumber.dataBinding = "/ds/var/page/OracleReportForm/EnterCaseNumber";
HearingDate.dataBinding = "/ds/var/page/OracleReportForm/HearingDate";
		
		
/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS for EnterCaseNumber
*****************************************************************************************************************/
	
	
EnterCaseNumber.tabIndex = __tabIdx++;
EnterCaseNumber.componentName = "Enter Case Number";		EnterCaseNumber.srcData = null;
EnterCaseNumber.rowXPath = null;
EnterCaseNumber.keyXPath = null;
EnterCaseNumber.displayXPath = null;
EnterCaseNumber.helpText = null;
EnterCaseNumber.maxLength = 8;

EnterCaseNumber.isMandatory = function()
{
	return false;
}

// Define the field validation rules			
EnterCaseNumber.validateOn = [CASE_EXISTS_XPATH];
EnterCaseNumber.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(EnterCaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		// Check if format of CaseNumber is correct
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);
		
		var caseExists = Services.getValue(CASE_EXISTS_XPATH);
		if ( null == ec && caseExists == "false")
		{
			ec = ErrorCode.getErrorCode("CaseMan_caseDoesNotExist_Msg");
		}
	}
	return ec;
}

// Define the field enablement rules
EnterCaseNumber.enableOn = [HearingDate.dataBinding];
EnterCaseNumber.isEnabled = function()
{
			
	var hearingDate = Services.getValue(HearingDate.dataBinding);
	if ( CaseManUtils.isBlank(hearingDate) )
	{
			return true;
	}
	else
	{
			return false;
	}		
		
}

/**
 * Define how the field inputs will be displayed
 * @param value
 * @author jzg9yw
 * @return (null != value) ? value.toUpperCase() 
 */
EnterCaseNumber.transformToModel = function( value)
{
	return (null != value) ? value.toUpperCase() : null;
}

EnterCaseNumber.transformToDisplay = function( value)
{	
 return (null != value) ? value.toUpperCase() : null;
}
		
// Define the logic for data retrieval
EnterCaseNumber.logicOn = [EnterCaseNumber.dataBinding];
EnterCaseNumber.logic = function(event)
{
	if ( event.getXPath() != EnterCaseNumber.dataBinding )
	{
		return;
	}
	Services.setValue(CASE_EXISTS_XPATH, "");
	var caseNumber = Services.getValue(EnterCaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		if ( null == EnterCaseNumber.validate() )
		{
			// Valid Case Number, call service to check exists
			getCaseExists(caseNumber);
		}
	}
}		
						
/**
 * Checks to see if the case number exists in the database.
 * @param caseNumber
 * @author jzg9yw
 * 
 */
function getCaseExists (caseNumber)
{
	var params = new ServiceParams();
	params.addSimpleParameter("caseNumber", caseNumber);
	Services.callService("getCaseExists", params, CaseExistsHandler, true);
}
   
function CaseExistsHandler (){};
/**
 * @param dom
 * @author jzg9yw
 * 
 */
CaseExistsHandler.onSuccess = function(dom)
{ 
	//check the DOM for contents
	if (dom != null)
	{
		//select the node where the case number is stored
		var node = dom.selectSingleNode("ds/Case");
  	
		// replace the node (empty or not) to the XPATH
		Services.replaceNode(REF_DATA_XPATH + "/Case", node );

      	// if it is empty, inform the user that case entered was not found
     	if (node == null)
     	{
     		//set the case exists xpath to false
   		  	Services.setValue(CASE_EXISTS_XPATH, "false");	
   			
   		  	// display to the user that cases matching that case number were not found.
   		   	Services.setFocus("EnterCaseNumber"); 
   		   	
   		   	//moved to validate function
   		   	//var errCode = ErrorCode.getErrorCode("CaseMan_caseNumberNotFound_Msg");
    		//return faildedValidation (errCode);
		}
	    else
	    {
		        			
			//set the case exists xpath to false
		  	Services.setValue(CASE_EXISTS_XPATH, "true");
			
			//Build the XML to pass to the intermediate report service.
			OracleReportForm.createCM_DJ_PrintOutsDOM(dom);
        }
	}
}
        	
/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS FOR HearingDate
*****************************************************************************************************************/
	        	
HearingDate.tabIndex = __tabIdx++;
HearingDate.componentName = "Hearing Date";		
HearingDate.srcData = null;
HearingDate.rowXPath = null;
HearingDate.keyXPath = null;
HearingDate.displayXPath = null;
HearingDate.helpText = null;

HearingDate.isMandatory = function()
{
	return false;
}

// Define the field enablement rules
HearingDate.enableOn = [EnterCaseNumber.dataBinding];
HearingDate.isEnabled = function()
{
	var caseNumber = Services.getValue(EnterCaseNumber.dataBinding);
	if ( CaseManUtils.isBlank(caseNumber) )
	{
		return true;
	}
	else
	{
		return false;
	}
}
// Define the field validation rules
HearingDate.validateOn = [CASE_EXISTS_XPATH];
HearingDate.validate = function()
{
	var ec = null;
	
	// retrieve the hearing date
	var hearingDate    = Services.getValue(HearingDate.dataBinding);
	var hearingDateObj = null;
	if ( hearingDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1 )
	{
		// Convert XSD date to date object
		hearingDateObj = FWDateUtil.parseXSDDate(hearingDate);
	}
	else
	{
		return ErrorCode.getErrorCode("CaseMan_hearingDateNotFound_Msg");
			
	}
	
	// get todays date and convert it into an object.
	var todaysDateObj  = CaseManUtils.createDate( CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );	 
	
	// validate the date entered to make sure that it is not in the past
	ec =  validateNonPastDate(hearingDateObj, todaysDateObj);
	if ( ec != null )
	{
		return ec;
	}
		   
	// makes sure that date entered is on a working day
	ec = validateWorkingDay(HearingDate.dataBinding);
	if ( ec != null )
	{
		return ec;
	}
	
	var caseExists = Services.getValue(CASE_EXISTS_XPATH);
	if ( null == ec && caseExists == "false")
	{
		ec = ErrorCode.getErrorCode("CaseMan_hearingDateNotFound_Msg");
	}
	
	
	return ec	
}


// Define the data retrieval for the hearing date 
HearingDate.logicOn = [HearingDate.dataBinding];
HearingDate.logic = function(event)
{
	if ( event.getXPath() != HearingDate.dataBinding )
	{
		return;
	}
	Services.setValue(CASE_EXISTS_XPATH, "");
	//Retrieve the hearing date entered and if it is not blank, get all the cases for that date.
	var hearingDate = Services.getValue(HearingDate.dataBinding); 
	if ( !CaseManUtils.isBlank(hearingDate) )
	{
		if ( null == HearingDate.validate() )
		{
		// Valid date, call service to retrive the cases on that date
		getCasesOnHearingDate(hearingDate);
		}  
	}	
}

// The hearing date cannot fall on a weekend.
HearingDate.weekends = false;	
			
/**
 * Retrieves all cases for the entered hearing date. For all the cases, it retrieves all the defendants
 * @param hearingDate
 * @author jzg9yw
 * 
 */
function getCasesOnHearingDate (hearingDate)
{
 	var adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
 	var params = new ServiceParams();
 	params.addSimpleParameter("hearingDate", hearingDate); 
 	params.addSimpleParameter("adminCourtCode", adminCourtCode); 
 	Services.callService("getCasesOnHearingDate", params, CasesOnHearingDateHandler, true);
}
          
function CasesOnHearingDateHandler (){};
         	
/**
 * @param dom
 * @author jzg9yw
 * 
 */
CasesOnHearingDateHandler.onSuccess = function(dom)
{
	//check the DOM for contents
	if (dom != null)
	{
		// replace the node (empty or not) to the XPATH
		Services.replaceNode(REF_DATA_XPATH + "/Case", node );
		
		//select the first node where the case details of the first case found for the date entered are stored
		var node = dom.selectSingleNode("ds/Case");
		// if it is empty, inform the user that no case was found for hearing date entered 
		if (node == null)
		{
			
			//set the case exists xpath to false
			Services.setValue(CASE_EXISTS_XPATH, "false");	
			
			// display to the user that cases matching that case number were not found.
			Services.setFocus("HearingDate"); 
			
			// moved to HearingDate.validate() section	               		
			// display to the user that no case was found for hearing date entered
			// hearingDateErrCode = ErrorCode.getErrorCode("CaseMan_hearingDateNotFound_Msg");
			//return faildedValidation (hearingDateErrCode);
		}
        else
       	{
		  	//set the case exists xpath to true
		  	Services.setValue(CASE_EXISTS_XPATH, "true");	
		  	              	
			//Build the XML to pass to the intermediate report service.
			OracleReportForm.createCM_DJ_PrintOutsDOM(dom);
        }
	}             	 
}
        	
			
/*****************************************************************************/
/*      Start of Run Reports Button Enablement 								 */
//Enable the Run report button when certain conditions are satisfied.
//Set the fields to watch, the EnterCaseNumber and HearingDate fields
Status_RunReportButton.enableOn = [EnterCaseNumber.dataBinding, HearingDate.dataBinding, CASE_EXISTS_XPATH];
Status_RunReportButton.isEnabled = function()
{
    // retrieve the hearing date and case number
	var hearingDate    = Services.getValue(HearingDate.dataBinding);
	var caseNumber 	   = Services.getValue(EnterCaseNumber.dataBinding);
	
	// If the date entered is not valid e.g. a weekend, not well formed, in the past, non working day etc
	if ( !Services.getAdaptorById("HearingDate").getValid() )
	{
 			//disable the Run Reports button
 			return false;
	}		    	
   	
   	//If the case is not in the the required format, disable the Run Reports button
       if ( !Services.getAdaptorById("EnterCaseNumber").getValid() )
	{
 			//disable the Run Reports button
 			return false;
	}		
	
   	// if both case number and hearing date are blank, then disable the Run Reports button
   	if (CaseManUtils.isBlank(hearingDate) && CaseManUtils.isBlank(caseNumber))
	    {
     		//disable the Run Reports button
     		return false;
   	}
   	
   	// If the well formed case number or case(s) for the entered hearing date are not found, 
   	// then disable the Run Reports button.
	
	// count the number of cases entries in the XPATH.
   	//var count = Services.countNodes(REF_DATA_XPATH + "/Case");
   	
   	if ( !Services.getValue(CASE_EXISTS_XPATH) )
   	{ 
   	   //reset the hearingDateErrCode
   	   //hearingDateErrCode = null;
   	   
   	   //disable the Run Reports button
     		return false;
   	}
    	
	    	
   	// if all conditions above are met, enable the button 
 	return true;
}	
		 	
// Checks for the remaining invalidations and issues a warning pop up.
Status_RunReportButton.validationList = ["EnterCaseNumber", "HearingDate"];
		 	
		 	/*      		End of Run Reports Button Enablement 						 */
		 	/*****************************************************************************/


/*****************************************************************************************************************
                                         createCM_DJ_PrintOutsDOM 
Created the CM_DJ_PrintOuts that is passed to an interface method which eventually calls the reports creation to
create and display the reports.
*****************************************************************************************************************/


/**
 * @param caseDom
 * @author jzg9yw
 * 
 */
function OracleReportForm.createCM_DJ_PrintOutsDOM(caseDom)
{
	// Create the dom to pass to the interface service
	var dom = XML.createDOM(null, null, null);
	
	// Create and insert the child element of the dom
	var casesElement = dom.createElement("Cases"); // creates a child node element called param
	dom.appendChild(casesElement);		 // Adds the child node element to its parent

	// Loop through the DOM that has been passed in (caseDom) and add the case numbers to our DOM (dom)
		
	// extract all the case number elements and admin court code from the DOM that has been passed in (caseDom)
	var caseNumberElements 		= caseDom.selectNodes("ds/Case/CaseNumber");
	var adminCourtCodeElements	= caseDom.selectNodes("ds/Case/AdminCourtCode"); 		

	// Iterate through all the elements
	for (var i=0; i<caseNumberElements.length; i++)
	{
		// retrieve the text from each element
		var caseNumber 		= XML.getNodeTextContent(caseNumberElements[i]);
		var adminCourtCode 	= XML.getNodeTextContent(adminCourtCodeElements[i]);
									
		if (caseNumber == null)
		{
			caseNumber = "";
		}
		
		if (adminCourtCode == null)
		{
			adminCourtCode = "";
		}
		// Create and insert the child element of Cases
		var caseElement = dom.createElement("Case"); // creates a child node element called param
		casesElement.appendChild(caseElement);		 // Adds the child node element to its parent

		// Create and append a new Case Number element
		var caseNumberElement = dom.createElement("CaseNumber");
		caseElement.appendChild(caseNumberElement);

		// Append the new value to caseNumberElement
		caseNumberElement.appendChild(dom.createTextNode(caseNumber));

		// Create and append a new Admin Court Code element
		var adminCourtCodeElement = dom.createElement("AdminCourtCode");
		caseElement.appendChild(adminCourtCodeElement);

		// Append the new value to adminCourtCodeElement
		adminCourtCodeElement.appendChild(dom.createTextNode(adminCourtCode));
	}
	
	// If that the node is already there
	if ( Services.countNodes(REF_DATA_XPATH + "/Cases") > 0 )
	{
	    // Remove it
	    Services.removeNode(REF_DATA_XPATH + "/Cases"); 
	}
	// Store the dom to the XPATH
	Services.addNode(dom, REF_DATA_XPATH);
}

function runDistrictJudgesPrintoutsHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
runDistrictJudgesPrintoutsHandler.onError = function(exception)
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
     
/**
 * @author jzg9yw
 * 
 */
runDistrictJudgesPrintoutsHandler.onSuccess = function()
{   	  
	Services.setTransientStatusBarMessage("Report generated successfully.");         	 
}


/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/

/**
 * Create the Owning Court Name and Code objects
 * @author jzg9yw
 * 
 */
function OwningCourt_Name() {}
function OwningCourt_Code() {}

// Initialise the XPATH for the Owning Court Name and Code objects
OwningCourt_Code.dataBinding = PAGE_XPATH + "/tmp/OwningCourtCode";
OwningCourt_Name.dataBinding = REF_DATA_XPATH + "/Courts/Court[Code = " + OwningCourt_Code.dataBinding + "]/Name";

//retrieve the court code.
OwningCourt_Name.retrieveOn = [OwningCourt_Code.dataBinding];

/**
 * Make the Owning Court Name and Code fields read only
 * @author jzg9yw
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
			
/**
 * Create and initialise the variables that hold the Owning Court Name and Code objects
 * @author jzg9yw
 * 
 */
OracleReportForm.initialise = function()
{
	var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	Services.setValue(PAGE_XPATH + "/tmp/OwningCourtCode", ADMIN_CROWN_COURT);
	
	//Redundant as there is now a service that does this. getCourtsShort()
	//var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
	//Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
}			

/**
 * Create the Run Report Button status object
 * @author jzg9yw
 * 
 */
function Status_RunReportButton() {}

// Assign a value to the the Run Report Button status object tab index
Status_RunReportButton.tabIndex = __tabIdx++;

/**
 * When the Run Report Button is clicked ....
 * @author jzg9yw
 * 
 */
Status_RunReportButton.actionBinding = function() 
{
	// If the validation of the run report button status succeeds, request the report. 
	if ( CaseManValidationHelper.validateFields(Status_RunReportButton.validationList) )
	{
		// retrieve the dom from the XPATH
		var node = Services.getNode(REF_DATA_XPATH + "/Cases");
		
		// generate a parameter dom that we shall pass to the interface service
	    var params = new ServiceParams();
	   params.addNodeParameter("CM_DJ_PrintOuts", node);

		//call the interface service	
 	    Services.callService("runDistrictJudgesPrintouts", params, runDistrictJudgesPrintoutsHandler, true);
	}
  	else
  	{
  		alert(Messages.POPUP_INVALID_MESSAGE);
  	}				
}
			
/**
 * Create the close Button object
 * @author jzg9yw
 * 
 */
function Status_Close_Btn() {};

// Assign a value to the the close Button status object tab index
Status_Close_Btn.tabIndex = __tabIdx++;

/**
 * Exit the screen when the close button is clicked.
 * @author jzg9yw
 * 
 */
Status_Close_Btn.actionBinding = function()
{
	exitScreen();
};

/**
 * Displays the error message on the status bar
 * @param ec
 * @author jzg9yw
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
 * Exits the screen back to the case maintenance menu
 * @author jzg9yw
 * 
 */
function exitScreen()
{
	Services.navigate(NavigationController.MAIN_MENU);
}						


/**
* Function indicates whether or not a date passed in falls on a non working day
*
* @param string dateXPath The dates XPath.  Date is in the DOM format (YYYY-MM-DD)
* @returns ErrorCode an error code object if date falls on a non working day else null
 * @author jzg9yw
 */
function validateWorkingDay  (dateXPath)
{	
	if ( Services.exists(REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = " + dateXPath + "]") )
	{
		ec = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
		return faildedValidation (ec);
	}
	return null; 					
}	

/**
 * makes sure that the date entered in not in the past
 * @param dateObj
 * @param todayDateObj
 * @author jzg9yw
 * @return faildedValidation (ec) , null  
 */
function validateNonPastDate  (dateObj, todayDateObj)
{
	
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
