/****************************************************************************************************************
							Run CO Start of Day Reports: 
							
							Prints
							CM_CO_R8
							CM_CO_R1 

							Prints Outstanding 
							N449 
							EX223
							AO Paid Notice
							N339
							N61
							TCO for Judge.

							CO_EVENTS updated
							CO_REPRINTS updated - Not Necessary
							The user information is saved for future AE and CO production - Not Necessary
 * Changes:						
 * 03/08/2006 - Mark Groen, Defect 3842 -  - The validation of the ReportReference XML returned to 
 *				client does not currently check to see whether a value has been returned for the Id tag.  
 *				When a report has not been generated for some reason, this Id tag will be empty.  
 *				The clients-side should check this, and report an error saying "Report 
 *				not generated!" when the Id tag is blank.  								
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

var runDate 		= "";
var date 			= "";
var systemDate 		= "";
var adminCourtCode 	= "";

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author jzg9yw
 * 
 */
function OracleReportForm() {}
					
// load the System Date and Court Code and Name into the XML	
OracleReportForm.refDataServices = [
	{ name:"SystemDate",     dataBinding:REF_DATA_XPATH, serviceName:"getSystemDate",     serviceParams:[]},
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
/**
 * Creat the text area bolier plate text object
 * @author jzg9yw
 * 
 */
function TextAreaBoilerPlateText() {}
			
// Initialise the XPATH for the text area bolier plate text
TextAreaBoilerPlateText.dataBinding = PAGE_BMSR_XPATH + "/TextAreaBoilerPlateText";

			
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

/*****************************************************************************************************************
												READ ONLY FIELDS 
*****************************************************************************************************************/

			
/**
 * Make the Owning Court Name, Code fields and text area read only
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
				
TextAreaBoilerPlateText.isReadOnly = function()
{
	return true;
}

/*****************************************************************************************************************
												INITIALISATION
*****************************************************************************************************************/

/**
 * Create and initialise the variables that hold the Owning Court Name, Code and text area bolier plate text objects
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

// HARDCODED?? CCBC_REF_CODES.RV_MEANING NOT POPULATED WITH THIS DATA, REPLACE IT WITH A SERVICE THAT RETRIEVES THE DATA BELOW
var textAreaBoilerPlateText = "    Running this option will print:\n" +
							  "    - CO Case Events Report, CO Monitoring Report\n" +
							  "    - outstanding N61s\n" +
							  "    - N449, N339, EX223, AO Paid Notices\n\n" +
							  "    Do not run it until all today's N56 - Payments\n" + 
							  "    and not served process have been logged";
							  				
Services.setValue(PAGE_BMSR_XPATH + "/TextAreaBoilerPlateText", textAreaBoilerPlateText);

     //Assign the CO_RUN_DATE Variable
     runDate = "CO RUNDATE";
	 // Get the system date in YYYY-MM-DD format
	 date = Services.getValue(REF_DATA_XPATH + "/SystemDate");
	 // Return system date as a string in YYYYMMDD format
	 systemDate = date.replace (new RegExp(/-/g), ""); // Also works -> date.replace (/-/g, "");
	 
	 // Get the court code
	 adminCourtCode = Services.getValue(OwningCourt_Code.dataBinding);
	 
	 // check and see if the start of day reports have been run 
	 getRunStartOfDayStatus (runDate, systemDate, adminCourtCode);
}	



	

/*****************************************************************************************************************
											GET RUN START OF DAY STATUS
*****************************************************************************************************************/
	
	
						
/**
 * Checks to see if the case number exists in the database.
 * @param runDate
 * @param systemDate
 * @param adminCourtCode
 * @author jzg9yw
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
 * @author jzg9yw
 * @return failedValidation (errCode)  
 */
       	StartOfDayExistsHandler.onSuccess = function(dom)
       	{ 
         	  //check the DOM for contents
              if (dom != null)
              {
               	//select the node where the case number is stored
               	var node = dom.selectSingleNode("ds/StartOfDay");
                // if it is empty, inform the user that case entered was not found
               	if (node == null)
               	{
               		   // replace the empty node to the XPATH
               			Services.replaceNode(REF_DATA_XPATH + "/StartOfDay", node );
               			
			    }
               else
              	{
               			// replace the node to the XPATH. 
               			Services.replaceNode(REF_DATA_XPATH + "/StartOfDay", node );
               		
               		   // display to the user that the start of day reports have already been run.
               		   var errCode = ErrorCode.getErrorCode("CaseMan_runStartOfDayReportsFound_Msg");
			           return failedValidation (errCode);

               	}
              }
                    	 
       }
        	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
       StartOfDayExistsHandler.onError = function(exception)
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
											RUN START OF DAY REPORTS HANDLER
					        Handles any errors generated by the runStartOfDayReports() method 	
					        
				19-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and the reports handler is
				never called. This was implemented as part of CR 0153 - KG							        					
*****************************************************************************************************************/
	 

function runStartOfDayReportsHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
 	runStartOfDayReportsHandler.onError = function(exception)
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
 * @param dom
 * @author jzg9yw
 * 
 */
    runStartOfDayReportsHandler.onSuccess = function(dom)
    {   
           //check and display error messages, if any.
           var errorMsgElements = dom.selectNodes("ds/CoErrorMsgs/CoErrorMsg");
           if(errorMsgElements.length > 0)
           {
             //iterate and display all the error messages.
             for (var i=0; i<errorMsgElements.length; i++ )
             {
               var errorMsg = XML.getNodeTextContent(errorMsgElements[i]);
               alert(errorMsg);
             }
             
           }
           
           // Build the start of day DOM
           OracleReportForm.createStartOfDayDOM()
            // retrieve the dom from the XPATH
			var node = Services.getNode(REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus");
			// generate a parameter dom that we shall pass to the interface service that will update the database
			var params = new ServiceParams();
			params.addNodeParameter("systemDataDbUpdate", node);
		    Services.callService("insertUpdateRunStartOfDayStatus", params, insertUpdateRunStartOfDayStatusHandler, true);
				   
                    	 
    }
/*****************************************************************************************************************
											CREATE THE START OF DAY DOM
					 Create the DOM to pass to the insertUpdateRunStartOfDayStatus() method which 						
					 inserts or updates a row into the database after the start of day reports have been run 						
*****************************************************************************************************************/
/**
 * @author jzg9yw
 * 
 */
function OracleReportForm.createStartOfDayDOM()
{
  	// Create the dom to pass to the interface service
	var dom = XML.createDOM(null, null, null);
	
		// Create and insert the root element of the dom
		var insertUpdateRunStartOfDayStatusElement = dom.createElement("insertUpdateRunStartOfDayStatus"); // creates a child node element 
		dom.appendChild(insertUpdateRunStartOfDayStatusElement);		 // Adds the child node element to its parent
		
		// Create and insert the child element of the dom
		var rowElement = dom.createElement("row");
		insertUpdateRunStartOfDayStatusElement.appendChild(rowElement);
		

	 	 	// Create and insert the child elements
			var itemElement = dom.createElement("item"); // creates a child node element
			rowElement.appendChild(itemElement);		 // Adds the child node element to its parent
			
				// Append the global value to itemElement aka runDate
				itemElement.appendChild(dom.createTextNode(runDate));
			
			var itemValueElement = dom.createElement("itemValue"); 
			rowElement.appendChild(itemValueElement);	
			
				// Append the global value to itemValueElement aka systemDate
				itemValueElement.appendChild(dom.createTextNode(systemDate));

			var adminCourtCodeElement = dom.createElement("adminCourtCode"); 
			rowElement.appendChild(adminCourtCodeElement);		
			
				// Append the  global value to adminCourtCodeElement
				adminCourtCodeElement.appendChild(dom.createTextNode(adminCourtCode));
				
				
				// If that the node is already there
				if ( Services.countNodes(REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus") > 0 )
				{
				    // Remove it
				    Services.removeNode(REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus"); 
				}
				// Store the dom to the XPATH
				Services.addNode(dom, REF_DATA_XPATH);
					
			 	
	
}
	   	

/*****************************************************************************************************************
											INSERT/UPDATE ROW INTO THE SYSTEMDATA TABLE HANDLER
					 Handles any errors generated by the insertUpdateRunStartOfDayStatus() method which 						
					 inserts a row into the database after the start of day reports have been run 						
*****************************************************************************************************************/
function insertUpdateRunStartOfDayStatusHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
 	insertUpdateRunStartOfDayStatusHandler.onError = function(exception)
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
        
     	alert("failed"); 
    }
         	
/**
 * @author jzg9yw
 * 
 */
 	insertUpdateRunStartOfDayStatusHandler.onSuccess = function()
    { 
	 Services.setTransientStatusBarMessage("Report generated successfully.");
    }
/******************************************************************************************************
	      		More Validation 						   		
/*****************************************************************************************************/
	
		    
			
			/*****************************************************************************/
			/*      Start of Run Reports Button Enablement 								 */
			//Enable the Run report button when certain conditions are satisfied.
			//Set the fields to watch, the nodes for the ref data shown below
			Status_RunReportButton.enableOn = [REF_DATA_XPATH + "/StartOfDay", REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus"];
		 	Status_RunReportButton.isEnabled = function()
		 	{ 
			    var count1 = Services.countNodes(REF_DATA_XPATH + "/StartOfDay");
			    var count2 = Services.countNodes(REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus");
		    	if ( count1 != 0 || count2 != 0 ) // if start of day reports have been run
		    	{ 
		    	   //disable the Run Reports button
		      		return false;
		    	}
		 	
		 	return true;
		 	}	
		 	
		 	// Checks for the remaining invalidations and issues a warning pop up.
		 	Status_RunReportButton.validationList = [];
		 	
		 	/*      		End of Run Reports Button Enablement 						 */
		 	/*****************************************************************************/




/*****************************************************************************************************************
                                         HELPER CODE
*****************************************************************************************************************/
		
			
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
				   
				   // generate a parameter dom that we shall pass to the interface service that will run the reports
				   var params = new ServiceParams();
				   Services.callService("runInitialCoStartOfDayReports", params, runInitialCoStartOfDayReportsHandler, true);
				  
				   
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
			function failedValidation (ec)
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
	
/*****************************************************************************************************************
											RUN INITIAL START OF DAY REPORTS HANDLER
					        Handles any errors generated by the runInitialCoStartOfDayReports() method 						
*****************************************************************************************************************/
	 

function runInitialCoStartOfDayReportsHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
 	runInitialCoStartOfDayReportsHandler.onError = function(exception)
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
 * @param resultDom
 * @author jzg9yw
 * 
 */
    runInitialCoStartOfDayReportsHandler.onSuccess = function(resultDom)
    {  
	var reportIdNode 	= resultDom.selectSingleNode("/ReportReference/Id");
	// defect 3842, not used - var reportRefIdNode = resultDom.selectSingleNode("/ReportReference/Reference");
	if (reportIdNode != null)
	{
		var reportId = XML.getNodeTextContent(reportIdNode);
		// defect 3842, not used - var reportRefId = XML.getNodeTextContent(reportRefIdNode);
		if(reportId != null && reportId != ""){
			Services.replaceNode("/ds/ReportReference", resultDom);
			Services.setValue(Progress_Bar.dataBinding, "||");
			document.getElementById('Progress_Status').innerHTML = "";
			Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_RAISE);
	
			pollContentStore();
		}
		else{
			Services.setTransientStatusBarMessage("Report not generated.")       
		}
	}
	else{
		Services.setTransientStatusBarMessage("Report not generated.")       
	}
       	 
}			

/**
 * @author jzg9yw
 * 
 */
function pollContentStore() 
{
	Services.setValue(Progress_Bar.dataBinding, Services.getValue(Progress_Bar.dataBinding) + "||");
	var resultNode = Services.getNode("/ds/ReportReference");
	var params = new ServiceParams();
	params.addNodeParameter("ReportReference", resultNode);		
	
	if(!Popup_Cancel.cancelled) 
	{
		Services.callService("getReport", params, PollReport, null);
	}
}

/**
 * @author jzg9yw
 * 
 */
function PollReport()
{
}

/**
 * @param dom
 * @author jzg9yw
 * 
 */
PollReport.onSuccess = function(dom)
{
	//debugger;
	var statusNode	 	= dom.selectSingleNode("/ReportResponse/Status");
	var printStatusNode	= dom.selectSingleNode("/ReportResponse/PrintStatus");
	
	var status			= XML.getNodeTextContent(statusNode);
	var printStatus		= XML.getNodeTextContent(printStatusNode);
	
	document.getElementById('Progress_Status').innerHTML = getStatusBarMessage(status);
	
	if(status == '5') // Cancelled
	{
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		//NavigationController.nextScreen(); // Goes back to calling screen
	}
	else if(status == '4') // Error
	{
		var errorDescNode	= dom.selectSingleNode("/ReportResponse/Error");
		var errorDesc		= XML.getNodeTextContent(errorDescNode);
		document.getElementById('Progress_Status').innerHTML = errorDesc;	
		//NavigationController.nextScreen(); // Goes back to calling screen
	}	
	else if (status == "2")
	{
		// Show PDF
		Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
		var documentIdNode	= dom.selectSingleNode("/ReportResponse/DocumentId");
		var documentId		= XML.getNodeTextContent(documentIdNode);
		// defect 3842
		Services.setTransientStatusBarMessage("Report generated successfully.");	
	
		//run the rest of CO start of Day
		runCoStartOfDay();
	}
	else
	{
		getcontentStore = window.setTimeout("pollContentStore()", 2000);
		
	}

}

var getcontentStore = null;


/**
 * @author jzg9yw
 * 
 */
function runCoStartOfDay ()
{
				   //create a dom to pass to the interface service
			 	   var dom = XML.createDOM(null, null, null);
			 	   
			 	   // create and append elements
			 	   var events = dom.createElement("Events");
			 	   dom.appendChild(events);
			 	   			 	   
			 	   //create an array of event ids to pass to the interface service
			 	   var eventIdArray = new Array (6)
			 	   eventIdArray[0] =  "817";
			 	   eventIdArray[1] =  "813";
			 	   eventIdArray[2] =  "975";
			 	   eventIdArray[3] =  "815";
			 	   eventIdArray[4] =  "852";
			 	   eventIdArray[5] =  "174";			 	   
			 	   // loop thru the array
			 	   for (var i=0; i<eventIdArray.length; i++)
			 	   {
			 	   		var eventIdsElement = dom.createElement("EventIds");
			 	   		events.appendChild(eventIdsElement);
			 	   
			 	  		var eventIdElement = dom.createElement("EventId");
			 	   		eventIdsElement.appendChild(eventIdElement);
			 	   
			 	  		 eventIdElement.appendChild(dom.createTextNode(eventIdArray[i]));
			 	  } 
			 	   // generate a parameter dom that we shall pass to the interface service that will run the reports
				   var params = new ServiceParams();
				   params.addDOMParameter ("eventIds", dom)
				   
/**				19-Apr-2006 - NOTE: This has been superceded by the Asynchronisation stuff and runCoStartOfDayReports is
				never called. This was implemented as part of CR 0153 - KG						   
				//   Services.callService("runCoStartOfDayReports", params, runStartOfDayReportsHandler, true);  */
		
				   Reports.callAsync("asyncCoStartOfDay", params, CaseMan_AsyncMonitor.srcData);
				   Util.openPopup("CaseMan_AsyncMonitorPopup");
}


/**
 * @param status
 * @author jzg9yw
 * @return " Status, Report has been queued" , Report is being generated" , Report is being saved" , Report generation has completed" , " Ststus, Error in producing Report" , " "  
 */
function getStatusBarMessage(status) {
	switch(status) {
		case "0":
		return " Status: Report has been queued";
		break;
		
		case "1":
		return " Status: Report is being generated";
		break;
		
		case "2":
		return " Status: Report is being saved";
		break;
		
		case "3":
		return " Status: Report generation has completed";
		break;
		
		case "4":
		return " Ststus: Error in producing Report";
		break;
		
		case "5":
		return " ";
		break;
	}
}

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author jzg9yw
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}


/**
 * 19 Apr 2006 - KG. As part of CR 0153, Added Asynchronisation logic to this module
 * Async Stuff
 * @author jzg9yw
 * 
 */
function CaseMan_AsyncMonitorPopup() {};
function CaseMan_AsyncMonitor() {};


CaseMan_AsyncMonitor.srcData = "/ds/var/form/Async";
CaseMan_AsyncMonitor.dataBinding = CaseMan_AsyncMonitor.srcData + "/Id";
CaseMan_AsyncMonitor.asyncStateService = "getState";
CaseMan_AsyncMonitor.asyncCancelService = "cancel";
/**
 * @author jzg9yw
 * 
 */
CaseMan_AsyncMonitor.onComplete = function()
{
	//debugger;
	Util.closePopup("CaseMan_AsyncMonitorPopup");
	var dom = Services.getNode(CaseMan_AsyncMonitor.srcData + "/Response");
	//check and display error messages, if any.
    var errorMsgElements = dom.selectNodes("ds/CoErrorMsgs/CoErrorMsg");
    if(errorMsgElements.length > 0)
    {
    //iterate and display all the error messages.
    for (var i=0; i<errorMsgElements.length; i++ )
     {
      var errorMsg = XML.getNodeTextContent(errorMsgElements[i]);
      alert(errorMsg);
     }
             
    }
           
    // Build the start of day DOM
    OracleReportForm.createStartOfDayDOM()
    // retrieve the dom from the XPATH
	var node = Services.getNode(REF_DATA_XPATH + "/insertUpdateRunStartOfDayStatus");
	// generate a parameter dom that we shall pass to the interface service that will update the database
	var params = new ServiceParams();
	params.addNodeParameter("systemDataDbUpdate", node);
	Services.callService("insertUpdateRunStartOfDayStatus", params, insertUpdateRunStartOfDayStatusHandler, true);
				   
}

/**
 * @param error
 * @author jzg9yw
 * 
 */
CaseMan_AsyncMonitor.onError = function(error)
{
	//debugger;
    alert("Unable to initiate report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @author jzg9yw
 * 
 */
CaseMan_AsyncMonitor.onCancel = function()
{
	
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

/**
 * @param error
 * @author jzg9yw
 * 
 */
CaseMan_AsyncMonitor.onCancelError = function(error)
{
	//debugger;
    alert("Unable to cancel report: " + error.message);
    Util.closePopup("CaseMan_AsyncMonitorPopup");
}

    
