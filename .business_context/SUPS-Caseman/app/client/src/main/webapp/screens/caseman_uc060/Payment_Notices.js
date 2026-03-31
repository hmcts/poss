/****************************************************************************************************************
			Payment Notices. 
			Running this module will run the following reports in the order mentioned
			CM_PAYMENTS_HEADER (Payment Notices Header Page)
			CM_CHQRT (Notices of payments by Cheque)
			CM_N243 (Notices of Payments In Satisfaction. Note Payments in Satisfaction are now redundant therefore this report is no longer required.)
			CM_N330 (Notices of Payment for Judgments over £500)
			CM_N335 (Notice of Payment under Warrant)
			and CM_PAYMENTS_FOOTER (Payment Notices Footer page)							
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

/*****************************************************************************************************************
												MAIN FORM
*****************************************************************************************************************/
			
/**
 * Form element
 * @author jzg9yw
 * 
 */
function OracleReportForm() {}
					
// load the System Date, Court Code and Name into the XML	
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
		

function PaymentDate() {}

PaymentDate.dataBinding = "/ds/var/page/OracleReportForm/PaymentDate";
	

/*****************************************************************************************************************
											INPUT FIELD DEFINITIONS FOR PaymentDate
*****************************************************************************************************************/
	        	
PaymentDate.tabIndex = __tabIdx++;
PaymentDate.componentName = "Payment Date";		
PaymentDate.srcData = null;
PaymentDate.rowXPath = null;
PaymentDate.keyXPath = null;
PaymentDate.displayXPath = null;
PaymentDate.helpText = null;

PaymentDate.isMandatory = function()
{
	return true;
}


// Define the field validation rules
PaymentDate.validateOn = [PaymentDate.dataBinding];
PaymentDate.validate = function(value)
{
	
	// retrieve the Payment Date
	var paymentDate = Services.getValue(PaymentDate.dataBinding);
			
	// validate the date entered to make sure that it is not in the future
	var ec =  validateDate(paymentDate);
	if ( ec != null )
	{
		return ec;
	}
	
}


// Define the data retrieval for the Payment Date 
PaymentDate.logicOn = [PaymentDate.dataBinding];
PaymentDate.logic = function(event)
{
		 //Retrieve the Payment Date entered and if it is not blank, build the DOM to pass to the custom report module
		 var paymentDate = Services.getValue(PaymentDate.dataBinding); 
		 if ( !CaseManUtils.isBlank(paymentDate) && Services.getAdaptorById("PaymentDate").getValid())
		 {
		   
		    OracleReportForm.PaymentNoticesDOM();
		 }
		
}

    			
			/*****************************************************************************/
			/*      Start of Run Reports Button Enablement 								 */
			//Enable the Run report button when certain conditions are satisfied.
			//Set the fields to watch, the EnterCoNumber and PaymentDate fields
			Status_RunReportButton.enableOn = [PaymentDate.dataBinding];
		 	Status_RunReportButton.isEnabled = function()
		 	{
			    // retrieve the Payment Date
				var paymentDate    = Services.getValue(PaymentDate.dataBinding);

				
				// If the Payment Date entered is not valid e.g. not well formed, in the future etc
				if ( !Services.getAdaptorById("PaymentDate").getValid() )
				{
		  			//disable the Run Reports button
		  			return false;
				}		    	

				
		    	// if the Payment Date is blank, then disable the Run Reports button
		    	if ( CaseManUtils.isBlank(paymentDate) )
		 	    {
		      		//disable the Run Reports button
		      		return false;
		    	}
		    	
	
			    	
		   	// if all conditions above are met, enable the button 
		 	return true;
		 	}	
		 	
		 	// Checks for the remaining invalidations and issues a warning pop up.
		 	Status_RunReportButton.validationList = ["PaymentDate"];
		 	
		 	/*      		End of Run Reports Button Enablement 						 */
		 	/*****************************************************************************/


/*****************************************************************************************************************
                                         createPaymentNoticesDOM 
Creates the Payment Notices DOM that is passed to an interface method which eventually calls the reports creation to
create and display the reports.
*****************************************************************************************************************/


/**
 * @author jzg9yw
 * 
 */
function OracleReportForm.PaymentNoticesDOM()
{
  
	// Create the dom to pass to the interface service
	var dom = XML.createDOM(null, null, null);
	
		// Create and insert the child element of the dom
		var paymentsElement = dom.createElement("Payments"); // creates a child node element
		dom.appendChild(paymentsElement);		 // Adds the child node element to its parent
		
					// Create and insert the child element of PaymentDates
					var paymentDatesElement = dom.createElement("PaymentDates"); // creates a child node element 
					paymentsElement.appendChild(paymentDatesElement);		 // Adds the child node element to its parent
			
						// Create and insert the child element of PaymentDate
					    var paymentDateElement = dom.createElement("PaymentDate"); // creates a child node element 
					    paymentDatesElement.appendChild(paymentDateElement);	 // Adds the child node element to its parent
			
						// get the payment date entered in YYYY-MM-DD format
						var paymentDateXSD = CaseManUtils.createDate( Services.getValue(PaymentDate.dataBinding) );
						// convert it to DD-MMM-YYYY format.
						var paymentDate = CaseManUtils.convertDateToPattern(paymentDateXSD, "DD-MMM-YYYY");
						
						// Append the date to paymentDateElement
						paymentDateElement.appendChild(dom.createTextNode(paymentDate));
			
				
				// If that the node is already there
				if ( Services.countNodes(REF_DATA_XPATH + "/Payments") > 0 )
				{
				    // Remove it
				    Services.removeNode(REF_DATA_XPATH + "/Payments"); 
				}
				// Store the dom to the XPATH
				Services.addNode(dom, REF_DATA_XPATH);
					
			 		
}

function runPaymentNoticesHandler (){};
         	
/**
 * @param exception
 * @author jzg9yw
 * 
 */
 	runPaymentNoticesHandler.onError = function(exception)
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
    runPaymentNoticesHandler.onSuccess = function()
    { 
         	  
           	Services.setTransientStatusBarMessage("Report generated successfully.");
    		//alert("Success!: Report Generated!");
            exitScreen();        	 
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
				// Stop screen calling itself on exit.
				if(NavigationController.getNextScreen() == "PaymentNotices") 
				{
					NavigationController.resetCallStack();
				}
				

				
				var ADMIN_CROWN_COURT = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
				Services.setValue(OwningCourt_Code.dataBinding, ADMIN_CROWN_COURT);
				
				//Redundant as there is now a service that does this. getCourtsShort()
				//var ADMIN_CROWN_COURT_NAME = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNAME_XPATH);
				//Services.setValue(PAGE_XPATH + "/tmp/OwningCourtName", ADMIN_CROWN_COURT_NAME);
			    
			    // get the todays date in YYYY-MM-DD format
				var todaysDate = CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate");
				// set todays date as the default value
				Services.setValue(PaymentDate.dataBinding, todaysDate);
				
				//Checks to see if the Suitors Cash start of day has been run
				StartOfDayUtils.checkSuitorsCashStartOfDay("PaymentNotices");
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
					var node = Services.getNode(REF_DATA_XPATH + "/Payments");
					
					// generate a parameter dom that we shall pass to the interface service
				    var params = new ServiceParams();
				   params.addNodeParameter("Payment_Notices", node);

					//call the interface service	
			 	    Services.callService("runPaymentNotices", params, runPaymentNoticesHandler, true);
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
 * makes sure that todays date is not in the future
 * @param date
 * @author jzg9yw
 * @return null , faildedValidation (ec)  
 */
			function validateDate(date)
			{    
			  var dateObj = CaseManUtils.isBlank(date) ? null : CaseManUtils.createDate(date);
			  var todayDateObj = CaseManUtils.createDate( CaseManUtils.getSystemDate(REF_DATA_XPATH + "/SystemDate") );
			  if(CaseManUtils.compareDates(todayDateObj, dateObj)!= 1 )
			  {
			      return null;
			  }
			  else
			  {
			    ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
			    return faildedValidation (ec);
			  }      
			  return null;   
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

