/**
File Name			    :  ProduceCustomerFileReports.js
Description			    :  
Author	(EDS Net ID)	:  Ahmed Tawfik [ kzgp4h ]
E-mail					:  ahmed.tawfik@eds.com
Date 					:  December 2005
Version 				:  1.0
CR						:  N/A 
Description				:  Construction
========================================================================================================
*/

/********************************************************************************************************
								CONSTANTS AND VARIABLES
********************************************************************************************************/
MODEL_XPATH = FORM_XPATH + "/Model";
FAP_USERS_XPATH = MODEL_XPATH + "/FapUsers";
DEFAULT_PRINTER_XPATH =  MODEL_XPATH + "/DefaultPrinter";
/*******************************************************************************************************
								MAIN FORM
********************************************************************************************************/

function ProduceCustomerFileReports() {};

	/** Initialising the Screen with the default values */
ProduceCustomerFileReports.initialise = function(){
	/**
	* set screen mode = "Initialise" to set default values.
	* set date values to today's date as a default value.
	* end date should be set first start date to perform intial comparison.
	*/
	Main_End_Date_Cal.setDefault();
	Main_Start_Date_Cal.setDefault();
	
	
	var FapCallBack = new FapCallBackObject() ;
	var params = new ServiceParams();
	params.addSimpleParameter("CourtId", "335");
	Services.callService("getFapId", params, FapCallBack, true);
	var PrinterCallBack = new PrinterCallBackObject();
	var	userID = Services.getCurrentUser();	
	var params = new ServiceParams();
	params.addSimpleParameter("UserId", userID);
	Services.callService("getUserPrinter", params, PrinterCallBack, true);
		
	/**
	*set screen mode = "Insert" and the focus to start date.
	*/
	Services.setFocus("Main_Start_Date_Cal");	
}

ProduceCustomerFileReports.refDataServices = [
{name:"date",      dataBinding:FORM_XPATH + "/RefData", serviceName:"getTodayDate",serviceParams:[]}
];


menubar = 
{
	quickLinks: 
	[
		{
			id: "Log_Received_Tapes_Btn",                 // id for button
			formName: "ReceivedRecords",                 // The name of the current form
			label: " Log Received Tapes ",              // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */	
			guard: function() 
			{
				Services.navigate("ReceivedRecords");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */				
			prepare: function()
			{
			 
			},                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},
		{
			id: "Log_Returned_Tapes_Btn",                 // id for button
			formName: "ReturnedRecords",                 // The name of the current form
			label: " Log Returned Tapes ",              // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */		
			guard: function() 
			{
				Services.navigate("ReturnedRecords");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */				
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},

		{
			id: "View_Rejected_Cases_Btn",                 // id for button
			formName: "QueryRejectedCases",               // The name of the current form
			label: " Rejected Cases ",                   // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() 
			{
				Services.navigate("QueryRejectedCases");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */				
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},
		{
			id: "View_Rejected_Judgments_Btn",                 // id for button
			formName: "QueryRejectedJudgments",               // The name of the current form
			label: " Rejected Judgments ",                   // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */	
			guard: function() 
			{
				Services.navigate("QueryRejectedJudgments");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */			
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},

		{
			id: "View_Rejected_Warrants_Btn",                 // id for button
			formName: "QueryRejectedWarrants",               // The name of the current form
			label: " Rejected Warrants ",                   // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */		
			guard: function() 
			{
				Services.navigate("QueryRejectedWarrants");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */						
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: false
		},
		{
			id: "View_Rejected_Paid_Btn",                            // id for button
			formName: "QueryRejectedPaid",                          // The name of the current form
			label: " Rejected Paid / Written Off Details ",        // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */					
			guard: function() 
			{
				Services.navigate("QueryRejectedPaid");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */			
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: false
		},
		{
			id: "Print_Output_Statistics_Report_Btn",                 // id for button
			formName: "Oracle_Reports_BC_ST_R2",                     // The name of the current form
			label: " Print Output Statistics Report ",              // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */		
			guard: function() 
			{
				Services.navigate("Oracle_Reports_BC_ST_R2");
			},
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */			
			prepare: function()
			 {
			 
			 },                 
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: false
		},
		{
			id: "NavBar_CodedPartiesButton",                 // id for button		
			formName: "MaintainNationalCodedParties",       // The name of the current form			
			label: " Maintain National Coded Parties ",    // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */		
			guard: function() 
			{
				Services.navigate("MaintainNationalCodedParties");
			},		
			
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */				
			prepare: function()
			{
				 
			},   
				/**
				 * Standard event binding that can be used for example to 
				 * set a function key to invoke the action
				 */
			 eventBinding: 
			 {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: false						
		}
		
	]
}

/**
* key Bindings for the form ProduceCustomerFileReports
*/
ProduceCustomerFileReports.keyBindings = [
	{		
		key: Key.F4, action: function(){		        
								Main_Exit_Btn.actionBinding();
							} 
	}
];

/*********************************************************************************************************
								MAIN FORM FIELD DEFINITIONS
**********************************************************************************************************/

function Main_Start_Date_Cal() {};
function Main_End_Date_Cal() {};


/*********************************************************************************************************
								MAIN FORM DATA BINDINGS                                                                                
**********************************************************************************************************/

Main_Start_Date_Cal.dataBinding         = MODEL_XPATH  + "/StartDate";
Main_End_Date_Cal.dataBinding           = MODEL_XPATH  + "/EndDate";
Main_Print_Btn.dataBinding           	= MODEL_XPATH  + "/PrintButton";
Main_Clear_Btn.dataBinding          	= MODEL_XPATH  + "/ClearButton";
Main_Exit_Btn.dataBinding          		= MODEL_XPATH  + "/ExitButton";
/*********************************************************************************************************
								MAIN FORM CLIENT SIDE CONFIGURATION                                                                               
**********************************************************************************************************/


Main_Start_Date_Cal.tabIndex = 10;
Main_Start_Date_Cal.componentName = "Start Date";
Main_Start_Date_Cal.helpText = "Start Date for report.";
Main_Start_Date_Cal.maxLength = 11; 

		/** 
		 * The function is called to see if the user must enter a value 
		 * @return true
		 */	
Main_Start_Date_Cal.isMandatory = function(){
	return true;
}
		/**
		* Set the default value to Main_Start_Date_Cal
		*/
Main_Start_Date_Cal.setDefault = function(){  
	var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");	
	Services.setValue(Main_Start_Date_Cal.dataBinding, currentDate);
}


Main_End_Date_Cal.tabIndex = 20;
Main_End_Date_Cal.componentName = "End Date";
Main_End_Date_Cal.helpText = "End Date for report.";
Main_End_Date_Cal.maxLength = 11; 

		/**
		 * The function is called to see if the user must enter a value 
		 * @return true
		 */	
Main_End_Date_Cal.isMandatory = function(){
	return true;
}
		/**
		* Set the default value to Main_End_Date_Cal
		*/
Main_End_Date_Cal.setDefault = function(){  
	var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");	
	Services.setValue(Main_End_Date_Cal.dataBinding, currentDate);
}
Main_End_Date_Cal.validateOn  = [Main_Start_Date_Cal.dataBinding];

		/**
		 * Function that will be invoked to determine if 
		 * the content of Main_End_Date_Cal
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Main_End_Date_Cal.validate = function(){
	var ec = null;
	/**
	* get the date values displayed on the screen.
	*/
    var startDateAdaptor = Services.getAdaptorById("Main_Start_Date_Cal");
    var startDateValue = Services.getValue(Main_Start_Date_Cal.dataBinding);
    var endDateAdaptor = Services.getAdaptorById("Main_End_Date_Cal");
    var endDateValue = Services.getValue(Main_End_Date_Cal.dataBinding);
    var validStartDate = startDateAdaptor.getValid();
   
	    /**
	     * if start date is valid, check if start date is earlier than end date.
	     */
    if((validStartDate == 1) && (endDateValue < startDateValue) ) {	
    	/**
    	*	if start date is  not earlier than end date set status bar error message and set the focus to end date.
      	*/
    	ec = ErrorCode.getErrorCode("CaseMan_wftEndDateEarlierThanStartDate_Msg");
    }	
	return ec;
}
   
	
	

/*********************************************************************************************************
								STATUS AND BUTTON BAR                                                                               
**********************************************************************************************************/

function Main_Print_Btn() {};
Main_Print_Btn.tabIndex = 30;
		/** Binding Actions to Main_Print_Btn */
Main_Print_Btn.actionBinding = function(){
	var validDates = true; 
	
		/** check if start date and end date are empty fields. */
	var startDateHasValue = Services.hasValue(Main_Start_Date_Cal.dataBinding);
	var endDateHasValue = Services.hasValue(Main_End_Date_Cal.dataBinding);
	
		/** if start and end date are empty fields set screen mode to "Error". */	
	if((!startDateHasValue) || (!endDateHasValue) ) {
		validDates = false; 
	}
	
		/** check if start date and end date are having valid date format. */
	var startDateAdaptor = Services.getAdaptorById("Main_Start_Date_Cal");
   	var validStartDate = startDateAdaptor.getValid();
	var endDateAdaptor = Services.getAdaptorById("Main_End_Date_Cal");
    var validEndDate =  endDateAdaptor.getValid();
    
		/**
		 * if the start date or end date are not having valid date format,
	 	 * set screen mode to "Error".
		 */		
	if((validStartDate != 1) || (validEndDate != 1) ) {
		validDates = false;
	}
	
	
		/**
		 * if screen mode = "Error", the print mode shouldn't be started.
		 */
	if(!validDates){
			/**
			 * if the start date is invalid or empty, the print mode shouldn't be started
			 * and the focus is set to start date.
			 */
      	if((validStartDate != 1) || (!startDateHasValue)) {
      		Services.setFocus("Main_Start_Date_Cal");
    	}
	    	/**
	    	 * if the end date is invalid or empty, the print mode shouldn't be started 
	    	 * and the focus is set to end date.
	    	 */
    	if((validEndDate != 1) || (!endDateHasValue)) {
    		Services.setFocus("Main_End_Date_Cal");
    	}
		    /**
		     *  else screen mode is set to "Print", the print mode should be started and the print popup is raised.
		     */	
    } else {
		Services.dispatchEvent("Print_Popup",PopupGUIAdaptor.EVENT_RAISE);
	}
}

function Main_Clear_Btn() {};
Main_Clear_Btn.tabIndex = 40;
		/** Binding Actions to Main_Clear_Btn */
Main_Clear_Btn.actionBinding = function(){
		/**
		* clear buttom reset the start end and the end date to the default values.
		* reseting the fields should be done as follow, set the two fields then call call the setDefault() method  
		* of end date before the setDefault method of start date to correctly handle the initial comparison.
		*/
	Services.setValue(Main_End_Date_Cal.dataBinding,null);
	Services.setValue(Main_Start_Date_Cal.dataBinding,null);
	Main_End_Date_Cal.setDefault();
	Main_Start_Date_Cal.setDefault();
		/**
		* set screen mode to  "Insert" and set the focus to start date.
		*/
	Services.setFocus("Main_Start_Date_Cal");	
}

	/** binding keys and mouse events to Main_Clear_Btn */
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "ProduceCustomerFileReports", alt: true }]
      }
};

function Main_Exit_Btn() {};
Main_Exit_Btn.helpText="Exit screen.";
Main_Exit_Btn.tabIndex = 50;
		/** Binding Actions to Main_Exit_Btn */
Main_Exit_Btn.actionBinding = function(){
	Services.navigate("MainMenu");
}


/****************************************************************************************************************
							 	Print Popup definition
****************************************************************************************************************/
function Print_Popup(){}

function Print_Options_Sel(){};
Print_Options_Sel.dataBinding = FORM_XPATH + "Print_Options_Sel";
Print_Options_Sel.componentName="Print Options";
Print_Options_Sel.tabIndex=60;


function Print_Print_Btn(){}; 
Print_Print_Btn.tabIndex=70;
		/** Binding Actions to Print_Print_Btn */
Print_Print_Btn.actionBinding = function() {
	print();							
}


function Print_Close_Btn(){}; 
Print_Close_Btn.tabIndex=80;
		/** Binding Actions to Print_Close_Btn */
Print_Close_Btn.actionBinding = function() {	
    Services.dispatchEvent("Print_Popup", PopupGUIAdaptor.EVENT_LOWER);
    Services.setValue(Print_Options_Sel.dataBinding,"Choose Print Option");
} 


/****************************************************************************************************************
							 	 Helper functions
****************************************************************************************************************/

/**
 *  The method gets the selected print option from the drop down menu
 *  and initialse the oracle report request with the selected report 
 *  name and the start and end date as two parameters taken by the report.
 *  The method also calls the print service and passes the oracle report 
 *	request dom as a parameter.
 *	
 * @param  none
 * @return void
 */

function print() {
	
	var OracleReportRequestDom = Services.loadDOMFromURL("../common/OracleReportRequest.xml");
	var printOption = Services.getValue(Print_Options_Sel.dataBinding);
	var fapid = Services.getValue(FAP_USERS_XPATH + "/Users/User/FapID");
	var defaultPrinter = Services.getValue(DEFAULT_PRINTER_XPATH  + "/Users/User/UserDefaultPrinter");
		 
	XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/Print/Destination/Server", fapid) ;
	XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/Print/Destination/Printer", defaultPrinter) ;
	
	XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/destype", "db") ;
	
	if(printOption == "Report of Files Logged") {
	  	
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/report", "TAPES_RECD.rdf") ;
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/desname", "tapes_recd001") ;
		setReportParameters();
		
	} else if(printOption == "Report of Files Loaded") {
		
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/report", "PROC_TAPES.rdf") ;
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/desname", "proc_tapes001") ;
		setReportParameters();
		
	
	} else if (printOption == "Report of Unprocessed Files") {
		
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/report", "UNPROC_TAPES.rdf") ;
		XML.setElementTextContent(OracleReportRequestDom, "/OracleReportRequest/OracleReport/OracleParameters/desname", "unproc_tapes001") ;
		setReportParameters();
		
	} else {
		return;
	}
 	Services.startTransaction();	
	
	Services.addNode(Services.getNode(PAGE_XPATH + "/param") , MODEL_XPATH + "/params");
	Services.removeNode(PAGE_XPATH + "/param");			
	var Node = Services.getNode(MODEL_XPATH + "/params");
	var parent = OracleReportRequestDom.selectSingleNode("OracleReportRequest/OracleReport/OracleParameters");
	var child = OracleReportRequestDom.selectSingleNode("OracleReportRequest/OracleReport/OracleParameters/params");
	parent.removeChild(child);
	parent.appendChild(Node);
	
	var PrintCallBack = new PrintCallBackObject() ;
	var params = new ServiceParams() ;
	params.addDOMParameter("OracleReportRequest", OracleReportRequestDom);
	Services.callService("printReport",params, PrintCallBack,true);  
	Services.removeNode(MODEL_XPATH + "/params");
	
 	Services.endTransaction();	
	return;
	
	
}

/**
 *  The method sets the two report parameters start and end date 
 *	in the page data model.
 * @param  none
 * @return void
 */
function setReportParameters() {
	
	var startDate  =  Services.getValue(Main_Start_Date_Cal.dataBinding);
	var reportStartDate = formatDate(startDate);
	var endDate =  Services.getValue(Main_End_Date_Cal.dataBinding);
	var reportEndDate = formatDate(endDate);
	var	userID = Services.getCurrentUser();
	
 	Services.startTransaction();	
	
	Services.setValue(PAGE_XPATH + "/param/name" , "P_START_DATE");
	Services.setValue(PAGE_XPATH + "/param/value" , reportStartDate);
	Services.addNode(Services.getNode(PAGE_XPATH + "/param") , MODEL_XPATH + "/params");
	Services.removeNode(PAGE_XPATH + "/param");
	
	Services.setValue(PAGE_XPATH + "/param/name" , "P_END_DATE");
	Services.setValue(PAGE_XPATH + "/param/value" , reportEndDate);	
	Services.addNode(Services.getNode(PAGE_XPATH + "/param") , MODEL_XPATH + "/params");
	Services.removeNode(PAGE_XPATH + "/param");
	
	Services.setValue(PAGE_XPATH + "/param/name" , "p_user");
	Services.setValue(PAGE_XPATH + "/param/value" , userID);	

 	Services.endTransaction();	
	return;
}
/**
 *  The method formats the input date to a the suitable format used
 *	by the oracle report.
 *	in the page data model.
 * @param  date in the format yyyy-mm-dd
 * @return date in the format dd-mm-yyyy
 */
function formatDate(date) {
	
	var dateElements = date.split('-');
	var day = dateElements[2];
	var month = dateElements[1];
	var year = dateElements[0];
	var reportDate= day.concat("-").concat(month).concat("-").concat(year); 
	return reportDate;
}


function PrinterCallBackObject(){}

	/**
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
PrinterCallBackObject.prototype.onSuccess = function(dom, serviceName) {
	Services.addNode(dom,DEFAULT_PRINTER_XPATH);
	
}
	/** 
	 * callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
PrinterCallBackObject.prototype.onError = function(exception){
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				"Error with connection to Server."+
				"<BR>-Check Server is running."+
				"<BR>-Check Database is running."+
				"<BR>Contact system administrator !",
				""
		);		
}

function FapCallBackObject(){}

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
FapCallBackObject.prototype.onSuccess = function(dom, serviceName) {
	Services.addNode(dom, FAP_USERS_XPATH);
}
	/**
	 *  callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
FapCallBackObject.prototype.onError = function(exception){
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				"Error with connection to Server."+
				"<BR>-Check Server is running."+
				"<BR>-Check Database is running."+
				"<BR>Contact system administrator !",
				""
		);		
}

function PrintCallBackObject(){};

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
PrintCallBackObject.prototype.onSuccess = function(dom){	
	Services.dispatchEvent("Print_Popup", PopupGUIAdaptor.EVENT_LOWER);
    var printOption = Services.getValue(Print_Options_Sel.dataBinding);
    Services.setValue(Print_Options_Sel.dataBinding,"Choose Print Option");
    Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				printOption+ " has been sent to the printer.",
				""
		);		
}
	/** 
	 * callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
PrintCallBackObject.prototype.onError = function(exception){
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				"Error with connection to Server."+
				"<BR>-Check Server is running."+
				"<BR>-Check Database is running."+
				"<BR>Contact system administrator !",
				""
		);		
}
