/****************************************************************************************************************
											CM_CO_R6 : Produce CO District judge print out		
											CO/Co/co Stands for Consolidated Order
											COs/Cos/cos is the plural of the above i.e. Consolidated Orders								
****************************************************************************************************************/

/*****************************************************************************************************************
											GLOBAL VARIABLES
*****************************************************************************************************************/

		
var reportModuleGroup = ""
		
		
var __tabIdx = 300;
			
			
// XPath constants
var ROOT_XPATH = "/ds";
var REF_DATA_XPATH  = ROOT_XPATH + "/var/form/ReferenceData";
var PAGE_XPATH      = ROOT_XPATH + "/var/page";
var PAGE_BMSR_XPATH = PAGE_XPATH + "/OracleReportForm";  // Place all input/output data in page context

var CO_EXISTS_XPATH = "/ds/var/form/coExists";

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
		
// Header Fields and Save Button for WP Parameter form
		
			
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
			

		
/*****************************************************************************************************************
												DATA BINDINGS
*****************************************************************************************************************/
		
function EnterCoNumber() {}
function HearingDate() {}
function ReviewDate() {}

EnterCoNumber.dataBinding = "/ds/var/page/OracleReportForm/EnterCoNumber";
HearingDate.dataBinding = "/ds/var/page/OracleReportForm/HearingDate";
ReviewDate.dataBinding = "/ds/var/page/OracleReportForm/ReviewDate";		
		
/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS for EnterCoNumber
*****************************************************************************************************************/
	
	
EnterCoNumber.tabIndex = __tabIdx++;
EnterCoNumber.componentName = "Enter Co Number";		
EnterCoNumber.srcData = null;
EnterCoNumber.rowXPath = null;
EnterCoNumber.keyXPath = null;
EnterCoNumber.displayXPath = null;
EnterCoNumber.helpText = null;
EnterCoNumber.maxLength = 8;

EnterCoNumber.isMandatory = function()
{
	return false;
}


// Define the field enablement rules
EnterCoNumber.enableOn = [HearingDate.dataBinding, ReviewDate.dataBinding];
EnterCoNumber.isEnabled = function()
{
	var hearingDate = Services.getValue(HearingDate.dataBinding);
	var reviewDate  = Services.getValue(ReviewDate.dataBinding);
	if ( CaseManUtils.isBlank(hearingDate) && CaseManUtils.isBlank(reviewDate)  )
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
EnterCoNumber.transformToModel = function( value)
{
	return (null != value) ? value.toUpperCase() : null;
}

EnterCoNumber.transformToDisplay = function( value)
{	
	return (null != value) ? value.toUpperCase() : null;
}

// Define the field validation rules			
EnterCoNumber.validateOn = [CO_EXISTS_XPATH];
EnterCoNumber.validate = function()
{	
	var ec = null;

	//Retrieve the co number
	var coNumber = Services.getValue(EnterCoNumber.dataBinding);

	if ( !CaseManUtils.isBlank(coNumber) )
	{
		var error = CaseManValidationHelper.validateCoNumber(coNumber);
		if (null != error)
		{
			return error;
		}
		var coExists = Services.getValue(CO_EXISTS_XPATH);
		if ( null == ec && coExists == "false")
		{
			ec = ErrorCode.getErrorCode("CaseMan_Co_NotFound_Msg");
		}
	}
	return ec;	
}
		
// Define the logic for data retrieval
EnterCoNumber.logicOn = [EnterCoNumber.dataBinding];
EnterCoNumber.logic = function(event)
{		 
	if ( event.getXPath() != EnterCoNumber.dataBinding )
	{
		return;
	}
	
	Services.setValue(CO_EXISTS_XPATH, "");
	//Retrieve the Co number entered and if it is not blank, check the Co exists.
	 var coNumber = Services.getValue(EnterCoNumber.dataBinding);
	 if (  !CaseManUtils.isBlank(coNumber) )
	 {
		if ( null == EnterCoNumber.validate() )
		{
			// Valid Case Number, call service to check exists
			getCoExists(coNumber);
		}
	    
	 }
}		
						
/**
 * Checks to see if the Co number exists in the database.
 * @param coNumber
 * @author jzg9yw
 * 
 */
function getCoExists (coNumber)
{
	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	Services.callService("getCoExists", params, CoExistsHandler, true);
}
          
function CoExistsHandler (){};

/**
 * @param dom
 * @author jzg9yw
 * 
 */
CoExistsHandler.onSuccess = function(dom)
{ 
         	  
	//check the DOM for contents
	if (dom != null)
	{
		//select the node where the Co number is stored
		var node = dom.selectSingleNode("ds/Co");
		
		// replace the node to the XPATH
		Services.replaceNode(REF_DATA_XPATH + "/Co", node );
				
		// if it is empty, inform the user that Co entered was not found
		if (node == null)
		{
			//set the co exists xpath to false
			Services.setValue(CO_EXISTS_XPATH, "false");
			 
			// display to the user that cos matching that Co number were not found.
			Services.setFocus("EnterCoNumber"); //inserts red border.
			
			//moved to EnterCoNumber.validate() function
			//var errCode = ErrorCode.getErrorCode("CaseMan_Co_NotFound_Msg");
			//return faildedValidation (errCode);
		}
        else
       	{
   			//set the co exists xpath to true
   		  	Services.setValue(CO_EXISTS_XPATH, "true");
   		  		
   			//Build the XML to pass to the intermediate report service.
   			OracleReportForm.createCo_DJ_PrintOutsDOM(dom);
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

// Define the field validation rules
HearingDate.validateOn = [CO_EXISTS_XPATH];
HearingDate.validate = function(value)
{
	var ec = null;
	
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
		
	var coExists = Services.getValue(CO_EXISTS_XPATH);
	if ( null == ec && coExists == "false")
	{
		ec = ErrorCode.getErrorCode("CaseMan_hearingDateNotFound_Msg");
	}

	return ec;	
}


// Define the field enablement rules
HearingDate.enableOn = [EnterCoNumber.dataBinding, ReviewDate.dataBinding];
HearingDate.isEnabled = function()
{
	var enterCoNumber = Services.getValue(EnterCoNumber.dataBinding);
	var reviewDate    = Services.getValue(ReviewDate.dataBinding);
	if ( CaseManUtils.isBlank(enterCoNumber) && CaseManUtils.isBlank(reviewDate)  )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// Define the data retrieval for the hearing date 
HearingDate.logicOn = [HearingDate.dataBinding];
HearingDate.logic = function(event)
{
	if ( event.getXPath() != HearingDate.dataBinding )
	{
		return;
	}
	Services.setValue(CO_EXISTS_XPATH, "");
	//Retrieve the hearing date entered and if it is not blank, get all the cos for that date.
	var hearingDate = Services.getValue(HearingDate.dataBinding); 
	if ( !CaseManUtils.isBlank(hearingDate) )
	{
		if ( null == HearingDate.validate() )
		{
			// Valid date, call service to retrive the cases on that date
			getCosOnHearingDate(hearingDate);
		}
	}
}

/**
 * Retrieves all consolidated orders for the entered hearing date.
 * @param hearingDate
 * @author jzg9yw
 * 
 */
function getCosOnHearingDate (hearingDate)
{
	var adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
	var params = new ServiceParams();
	params.addSimpleParameter("hearingDate", hearingDate); 
	params.addSimpleParameter("adminCourtCode", adminCourtCode); 
	Services.callService("getCosOnHearingDate", params, CosOnHearingDateHandler, true);
}
          
function CosOnHearingDateHandler (){};
         	
/**
 * @param dom
 * @author jzg9yw
 * 
 */
CosOnHearingDateHandler.onSuccess = function(dom)
{
         	  
	//check the DOM for contents
	if (dom != null)
	{
		//select the first node where the Co details of the first Co found for the date entered are stored
		var node = dom.selectSingleNode("ds/Co");

		// replace the node to the XPATH
		Services.replaceNode(REF_DATA_XPATH + "/Co", node );
               			
		// if it is empty, inform the user that no Co was found for hearing date entered 
		if (node == null)
		{
			//set the co exists xpath to false
			Services.setValue(CO_EXISTS_XPATH, "false");	
	
			// display to the user that cos matching that co number were not found.
			Services.setFocus("HearingDate"); 
			
			// moved to HearingDate.validate() section	               		
			// display to the user that no co was found for hearing date entered
			// hearingDateErrCode = ErrorCode.getErrorCode("CaseMan_hearingDateNotFound_Msg");
			//return faildedValidation (hearingDateErrCode);
		}
	    else
	    {
			//set the co exists xpath to true
		 	Services.setValue(CO_EXISTS_XPATH, "true");	
		 	
			//Build the XML to pass to the intermediate report service.
			OracleReportForm.createCo_DJ_PrintOutsDOM(dom);
		}
	}
}
        	
/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS FOR ReviewDate
*****************************************************************************************************************/
	        	
ReviewDate.tabIndex = __tabIdx++;
ReviewDate.componentName = "Review Date";		
ReviewDate.srcData = null;
ReviewDate.rowXPath = null;
ReviewDate.keyXPath = null;
ReviewDate.displayXPath = null;
ReviewDate.helpText = null;

ReviewDate.isMandatory = function()
{
	return false;
}

// Define the field validation rules
ReviewDate.validateOn = [CO_EXISTS_XPATH];
ReviewDate.validate = function(value)
{
	var ec;
	
	var reviewDate    = Services.getValue(ReviewDate.dataBinding);
	var reviewDateObj = null;
	if ( reviewDate.search(CaseManValidationHelper.YYYYMMDD_DATE_PATTERN) != -1 )
	{
		// Convert XSD date to date object
		reviewDateObj = FWDateUtil.parseXSDDate(reviewDate);
	}
	else
	{
		return ErrorCode.getErrorCode("CaseMan_reviewDateNotFound_Msg");
	}
	
	// get todays date and convert it into an object.
	var todaysDateObj  = CaseManUtils.createDate( CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );	 
	
	// validate the date entered to make sure that it is not in the past
	ec =  validateNonPastDate(reviewDateObj, todaysDateObj);
	if ( ec != null )
	{
		return ec;
	}
		   
	// makes sure that date entered is on a working day
	ec = validateWorkingDay(ReviewDate.dataBinding);
	if ( ec != null )
	{
		return ec;
	}
	
	var coExists = Services.getValue(CO_EXISTS_XPATH);
	if ( null == ec && coExists == "false")
	{
		ec = ErrorCode.getErrorCode("CaseMan_reviewDateNotFound_Msg");
	}
	
	
	return ec	
		
}


// Define the field enablement rules
ReviewDate.enableOn = [EnterCoNumber.dataBinding, HearingDate.dataBinding];
ReviewDate.isEnabled = function()
{
	var enterCoNumber = Services.getValue(EnterCoNumber.dataBinding);
	var hearingDate    = Services.getValue(HearingDate.dataBinding);
	if ( CaseManUtils.isBlank(enterCoNumber) && CaseManUtils.isBlank(hearingDate)  )
	{
		return true;
	}
	else
	{
		return false;
	}
}

// Define the data retrieval for the hearing date 
ReviewDate.logicOn = [ReviewDate.dataBinding];
ReviewDate.logic = function(event)
{
	if ( event.getXPath() != ReviewDate.dataBinding )
	{
		return;
	}
	
	Services.setValue(CO_EXISTS_XPATH, "");
	//Retrieve the hearing date entered and if it is not blank, get all the cos for that date.
	var reviewDate = Services.getValue(ReviewDate.dataBinding); 
	if ( !CaseManUtils.isBlank(reviewDate))
	{
		if ( null == ReviewDate.validate() )
		{
			// Valid date, call service to retrive the cases on that date
			getCosOnReviewDate(reviewDate);
		}
	}
}

/**
 * Retrieves all Consolidated Orders of a given status for the entered review date.
 * @param reviewDate
 * @author jzg9yw
 * 
 */
function getCosOnReviewDate (reviewDate)
{
	var adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
 	var params = new ServiceParams();
 	params.addSimpleParameter("reviewDate", reviewDate); 
 	params.addSimpleParameter("adminCourtCode", adminCourtCode);
 	Services.callService("getCosOnReviewDate", params, CosOnReviewDateHandler, true);
}

function CosOnReviewDateHandler (){};

/**
 * @param dom
 * @author jzg9yw
 * 
 */
CosOnReviewDateHandler.onSuccess = function(dom)
{ 
	//check the DOM for contents
	if (dom != null)
	{
		//select the first node where the Co details of the first Co found for the date entered are stored
		var node = dom.selectSingleNode("ds/Co");
		
		// replace the node to the XPATH
		Services.replaceNode(REF_DATA_XPATH + "/Co", node );
				
		// if it is empty, inform the user that no Co was found for hearing date entered 
		if (node == null)
		{
			//set the co exists xpath to false
			Services.setValue(CO_EXISTS_XPATH, "false");	
			
			// display to the user that cos matching that co number were not found.
			Services.setFocus("ReviewDate"); 
			
			//moved to ReviewDate.validate() function	
			// display to the user that no Co was found for hearing date entered
			//reviewDateErrCode = ErrorCode.getErrorCode("CaseMan_reviewDateNotFound_Msg");
			//return faildedValidation (reviewDateErrCode);
		}
		else
		{
			//set the co exists xpath to true
			Services.setValue(CO_EXISTS_XPATH, "true");
			 		              			
			//Build the XML to pass to the intermediate report service.
			OracleReportForm.createCo_DJ_PrintOutsDOM(dom);
		}
	}
}

/******************************************************************************************************
	      		More Validation for Enter Co Number, Hearing Date and Review Date fields						   		
/*****************************************************************************************************/
// The hearing and review dates cannot fall on a weekend.
HearingDate.weekends = false;	
ReviewDate.weekends  = false;

  			
/*****************************************************************************/
/*      Start of Run Reports Button Enablement 								 */
//Enable the Run report button when certain conditions are satisfied.
//Set the fields to watch, the EnterCoNumber and HearingDate fields
Status_RunReportButton.enableOn = [EnterCoNumber.dataBinding, HearingDate.dataBinding, ReviewDate.dataBinding, CO_EXISTS_XPATH];
Status_RunReportButton.isEnabled = function()
{
    // retrieve the hearing date, Co number and review date
	var hearingDate    = Services.getValue(HearingDate.dataBinding);
	var coNumber 	   = Services.getValue(EnterCoNumber.dataBinding);
	var reviewDate     = Services.getValue(ReviewDate.dataBinding); 
	
	// If the hearing date entered is not valid e.g. a weekend, not well formed, in the past, non working day etc
	if ( !Services.getAdaptorById("HearingDate").getValid() )
	{
 			//disable the Run Reports button
 			return false;
	}
		    	
	//If the Co is not in the the required format, disable the Run Reports button
	if ( !Services.getAdaptorById("EnterCoNumber").getValid() )
	{
		//disable the Run Reports button
		return false;
	}		

	//If the review date entered is not in the the required format, disable the Run Reports button
	if ( !Services.getAdaptorById("ReviewDate").getValid() )
	{
		//disable the Run Reports button
		return false;
	}
				
	// if both Co number and hearing date are blank, then disable the Run Reports button
	if (CaseManUtils.isBlank(hearingDate) && CaseManUtils.isBlank(coNumber) && CaseManUtils.isBlank(reviewDate))
	{
		//disable the Run Reports button
		return false;
	}
		    	
  	// If the well formed Co number or Co(s) for the entered hearing date are not found, 
  	// then disable the Run Reports button.

	// count the number of cos entries in the XPATH.
  	//var count = Services.countNodes(REF_DATA_XPATH + "/Co");
	
	if ( !Services.getValue(CO_EXISTS_XPATH) )
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
Status_RunReportButton.validationList = ["EnterCoNumber", "HearingDate", "ReviewDate"];
		 	
		 	/*      		End of Run Reports Button Enablement 						 */
		 	/*****************************************************************************/


/*****************************************************************************************************************
                                         createCo_DJ_PrintOutsDOM 
Created the Co_DJ_PrintOuts that is passed to an interface method which eventually calls the reports creation to
create and display the reports.
*****************************************************************************************************************/


/**
 * @param coDom
 * @author jzg9yw
 * 
 */
function OracleReportForm.createCo_DJ_PrintOutsDOM(coDom)
{

	// Create the dom to pass to the interface service
	var dom = XML.createDOM(null, null, null);
	
	// Create and insert the child element of the dom
	var cosElement = dom.createElement("Cos"); // creates a child node element called param
	dom.appendChild(cosElement);		 // Adds the child node element to its parent
		
	// Loop through the DOM that has been passed in (coDom) and add the Co numbers to our DOM (dom)
		
	// extract all the co number elements and admin court code elements from the DOM that has been passed in (coDom)
	var coNumberElements 		= coDom.selectNodes("ds/Co/coNumber");	
	var adminCourtCodeElements	= coDom.selectNodes("ds/Co/AdminCourtCode"); 	
	
	// Iterate through all the elements
	for (var i=0; i<coNumberElements.length; i++)
	{
		// retrieve the text from each element
		var coNumber 		= XML.getNodeTextContent(coNumberElements[i]);
		var adminCourtCode 	= XML.getNodeTextContent(adminCourtCodeElements[i]);
									
		if (coNumber == null)
		{
			coNumber = "";
		}
		
		if (adminCourtCode == null)
		{
			adminCourtCode = "";
		}
		// Create and insert the child element of Co
		var coElement = dom.createElement("Co"); // creates a child node element 
		cosElement.appendChild(coElement);		 // Adds the child node element to its parent

		// Create and append a new Co Number element
		var coNumberElement = dom.createElement("CoNumber");
		coElement.appendChild(coNumberElement);

		// Append the new value to coNumberElement
		coNumberElement.appendChild(dom.createTextNode(coNumber));
			
		// Create and append a new Admin Court Code element
		var adminCourtCodeElement = dom.createElement("AdminCourtCode");
		coElement.appendChild(adminCourtCodeElement);
	
		// Append the new value to adminCourtCodeElement
		adminCourtCodeElement.appendChild(dom.createTextNode(adminCourtCode));	
	}
	
	// If that the node is already there
	if ( Services.countNodes(REF_DATA_XPATH + "/Cos") > 0 )
	{
	    // Remove it
	    Services.removeNode(REF_DATA_XPATH + "/Cos"); 
	}
	// Store the dom to the XPATH
	Services.addNode(dom, REF_DATA_XPATH);		 		
}

function runCoDistrictJudgesPrintoutsHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
runCoDistrictJudgesPrintoutsHandler.onError = function(exception)
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
runCoDistrictJudgesPrintoutsHandler.onSuccess = function()
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
		var node = Services.getNode(REF_DATA_XPATH + "/Cos");
		
		// generate a parameter dom that we shall pass to the interface service
	    var params = new ServiceParams();
		params.addNodeParameter("CO_DJ_PrintOuts", node);

		//call the interface service	
 	    Services.callService("runCoDistrictJudgesPrintouts", params, runCoDistrictJudgesPrintoutsHandler, true);
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
 * Exits the screen back to the consolidated orders menu
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
* @param string dateXPath. The XPath to the date.  Date is in the DOM format (YYYY-MM-DD)
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
 * makes sure that the date entered in not in the past by comparing the entered date with today's date
 * @param dateObj
 * @param todayDateObj
 * @author jzg9yw
 * @return faildedValidation (ec) , null  
 */
function validateNonPastDate  (dateObj, todayDateObj)
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
