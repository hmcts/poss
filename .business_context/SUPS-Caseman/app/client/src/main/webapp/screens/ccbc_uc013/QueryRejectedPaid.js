/*
File Name			:QueryRejectedPaid.js
Description			:
Owner	(EDS Net ID)	:Reham Zaki (lz0m1w)
Modification History	:
================================================================================
                         	Prior
Date       EDS Net ID        		  Version    CR      Description
---------- ------------- 			  --------   ------- -------------------------------
15-6-2005  Reham Zaki (lz0m1w)        1.0       N/A         Intial construction
4-08-2006  Ahmed Tawfik  			  1.1 	 	            Performance Improvement 
 
================================================================================
*/
/****************************************************************************************************************
******************************* CONSTANTS and VARIABLES  ********************************************************
****************************************************************************************************************/

// XPATH constants
var Model_XPATH = FORM_XPATH + "/Model/RejectedPaids";
var Query_XPATH = PAGE_XPATH + "/Query";
var RejectedPaid_XPATH = Model_XPATH+"/RejectedPaid";
//variables for paging
var GRID_PAGE_SIZE = 30;
var GRID_PAGE_NUMBER = PAGE_XPATH + "/pageNumber";
var COUNT = PAGE_XPATH + "/count";

//***************************************************************************************************************

/****************************************************************************************************************
*******************************	Constructors  *******************************************************************
****************************************************************************************************************/

/** Form ID */
function QueryRejectedPaid() {};

/**
* Initilization for the form QueryRejectedPaid
*/
QueryRejectedPaid.initialise = function(){
	Services.setFocus("Query_CreditorCode_Txt");
	Services.setValue(GRID_PAGE_NUMBER, 0);
	Services.setValue(Main_RejectedPaid_Grid_PageNumber.dataBinding,"");
}

menubar = 
{
	quickLinks: 
	[
		{
			id: "Log_Received_Tapes_Btn",                 // id for button
			formName: "ReceivedRecords",      			 // The name of the current form
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
			formName: "ReturnedRecords",       			 // The name of the current form
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
			formName: "QueryRejectedCases",   		      // The name of the current form
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
			id: "Print_Customer_File_Reports_Btn",                 // id for button
			formName: "ProduceCustomerFileReports",      		  // The name of the current form
			label: " Print Customer File Reports ",              // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				Services.navigate("ProduceCustomerFileReports");
				
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
/******************************************************************************************************
								Construction Functions
******************************************************************************************************/


function Query_CreditorCode_Txt() {};
function Query_CaseNumber_Txt() {};
function Query_FileSequence_Txt() {};
function Query_Search_Btn(){};
function Main_Clear_Btn() {};
function Main_Back_Btn() {};
function Main_RejectedPaid_Grid() {};

function Main_RejectedPaid_Grid_Prev() {}
function Main_RejectedPaid_Grid_PageNumber() {}
function Main_RejectedPaid_Grid_Next() {}
function Reject_Reason() {};
/**
* key Bindings for the form QueryRejectedPaid
*/
QueryRejectedPaid.keyBindings = [	
	{
		/** Binding F1 to Query_Search_Btn */
		key: Key.F1, action: function(){	
			Query_Search_Btn.actionBinding();	
		}
	},
		
	{
			/** Binding F4 to Main_Back_Btn */
		key: Key.F4, action: function(){
			Main_Back_Btn.actionBinding();
		}
	}
] ;

/*****************************************************************************************************************
*******************************	DATA BINDINGS ********************************************************************
*****************************************************************************************************************/
Query_CreditorCode_Txt.dataBinding = Query_XPATH + "/CreditorCode";
Query_FileSequence_Txt.dataBinding =  Query_XPATH + "/FileSequence";
Query_CaseNumber_Txt.dataBinding= Query_XPATH + "/CaseNumber";
Main_RejectedPaid_Grid.dataBinding = PAGE_XPATH + "/DetailsRejectedPaidGrid";
			     
Main_RejectedPaid_Grid_PageNumber.dataBinding = PAGE_XPATH + "/PageNumberGrid";
Reject_Reason.dataBinding      = RejectedPaid_XPATH + "[./SurrogateKey="+Main_RejectedPaid_Grid.dataBinding+"]/RejectReason"  ;
/*****************************************************************************************************************
******************************* GRID DEFINITIONS *****************************************************************
*****************************************************************************************************************/

//Configure the grid 

Main_RejectedPaid_Grid.helpText = "Query results";
Main_RejectedPaid_Grid.srcData = Model_XPATH;   //an intentionally no where xpath
Main_RejectedPaid_Grid.rowXPath = "RejectedPaid";   // this is the name of the node in html the marks the start of a new row
Main_RejectedPaid_Grid.keyXPath = "SurrogateKey";   // this is the name of the node in html the marks the id of  the row
Main_RejectedPaid_Grid.columns = [
	{xpath: "CreditorCode" , defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"},
	{xpath: "FileSequenceNumber" , defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"},
	{xpath: "CaseNumber" , defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Type" , defaultSort:"true", defaultSortOrder:"ascending",
		transformToDisplay: 
	           function(value) 
	           {
	              switch(value){
	              	case 'P': return "Paid";         break;
	              	case 'O': return "Written Off";  break;
	              	case 'D': return "Discontinued"; break;
	              	case 'W': return "Withdrawn";    break;
	              }
               }
		
	},
	{xpath: "DefendantId" , defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"},
	{xpath: "DatePaid" , defaultSort:"true", 
		transformToDisplay: function(value){
			if(value==null||value=="")return "";
		    var day   = value.substring(8,10);
		    var year  = value.substring(0,4);
			var month = value.substring(5,7);
			if(month.charAt(0)=='0')
				month = month.substring(1);			
			value = day+"-"+FWDateUtil.shortMonths[month-1]+"-"+year;
			return value;
		} ,        
       sort:SortDate,
       defaultSortOrder:"ascending"
	},
	{xpath: "Validated" , defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "DateRejected" , defaultSort:"true", 
		transformToDisplay: function(value){
			if(value==null||value=="")return "";
		    var day   = value.substring(8,10);
		    var year  = value.substring(0,4);
			var month = value.substring(5,7);
			if(month.charAt(0)=='0')
				month = month.substring(1);			
			value = day+"-"+FWDateUtil.shortMonths[month-1]+"-"+year;
			return value;
		} ,        
       sort:SortDate,
       defaultSortOrder:"ascending"
	},
    {xpath: "RejectedCode" , sort:"numerical", defaultSort:"true", defaultSortOrder:"ascending"},
    {xpath: "RejectReason"}
	 ];

Main_RejectedPaid_Grid.logicOn = [Main_RejectedPaid_Grid.dataBinding,Main_RejectedPaid_Grid.srcData]
Main_RejectedPaid_Grid.logic = function(evt){
	var nodeCount = Services.getValue(COUNT);
	Services.setTransientStatusBarMessage("Number of Records Found "+nodeCount);
}

// paging fields in the Grid.

		/** Binding Action to Main_RejectedPaid_Grid_Prev*/	
Main_RejectedPaid_Grid_Prev.actionBinding = function() {
	
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	pageNumber--;
	Services.setValue("/ds/var/page/initialSearch", false);
	Services.setValue(GRID_PAGE_NUMBER,pageNumber);
	queryRejectedPaid(GRID_PAGE_SIZE,pageNumber);
}

	/** binding keys and mouse events to Main_RejectedPaid_Grid_Prev */
Main_RejectedPaid_Grid_Prev.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_P, element: "QueryRejectedPaid", alt: true }            	   
            	  ]
      }
};

Main_RejectedPaid_Grid_Prev.helpText = "Display the previous page of records.";
Main_RejectedPaid_Grid_Prev.enableOn = [GRID_PAGE_NUMBER];

		/**
		* @return boolean based on the value of GRID_PAGE_NUMBER 
		*/
Main_RejectedPaid_Grid_Prev.isEnabled = function() {
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	return (! isNaN(pageNumber) && pageNumber > 1);

}

		/** Binding Actions to Main_RejectedPaid_Grid_Next*/
Main_RejectedPaid_Grid_Next.actionBinding = function() {
	
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	pageNumber++;
	Services.setValue("/ds/var/page/initialSearch", false);
	Services.setValue(GRID_PAGE_NUMBER,pageNumber);
	queryRejectedPaid(GRID_PAGE_SIZE,pageNumber);
}

	/** binding keys and mouse events to Main_RejectedPaid_Grid_Next */
Main_RejectedPaid_Grid_Next.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_N, element: "QueryRejectedPaid", alt: true }            	   
            	  ]
      }
};

Main_RejectedPaid_Grid_Next.helpText = "Display the next page of records.";
Main_RejectedPaid_Grid_Next.enableOn = [GRID_PAGE_NUMBER,COUNT];
		/**
		 * @return boolean based on the value of 
		 * GRID_PAGE_NUMBER and COUNT
		 */
Main_RejectedPaid_Grid_Next.isEnabled = function() {
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	if(!isNaN(pageNumber))
	{
		var nodesCount = parseInt(Services.getValue(COUNT));
		var remaining = parseInt(nodesCount - (pageNumber * GRID_PAGE_SIZE));
		return remaining >0;
	}
	else
	{
		return false;
	}
}

		/** 
		 * specifies that Main_RejectedPaid_Grid_PageNumber
		 * is a read only field
		 * @return true
		 */	
Main_RejectedPaid_Grid_PageNumber.isReadOnly = function() {
	return true;
}
Main_RejectedPaid_Grid_PageNumber.helpText = "Displaying page number";
Main_RejectedPaid_Grid_PageNumber.logicOn = [GRID_PAGE_NUMBER];


/** 
* The function will be applyed based on a change to the underlying DOM 
*@param evt
*/
Main_RejectedPaid_Grid_PageNumber.logic = function(evt){
	if(!isNaN(Services.getValue(GRID_PAGE_NUMBER)) && Services.getValue(GRID_PAGE_NUMBER)!="")
	{
		if(Services.getValue(GRID_PAGE_NUMBER) == 0)
		{
			Services.setValue(Main_RejectedPaid_Grid_PageNumber.dataBinding,"");
		}
		else
		{	
			Services.setValue(Main_RejectedPaid_Grid_PageNumber.dataBinding,"Page " + Services.getValue(GRID_PAGE_NUMBER));
		}
	}
}

Reject_Reason.retrieveOn = [Main_RejectedPaid_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Reject_Reason.isReadOnly = function(){
	return true;
}

Reject_Reason.maxLength = 70;
Reject_Reason.helpText="Reject Reason"

/*********************************************************************************************
*********************************** Helper Functions *****************************************
*********************************************************************************************/

		/**
		* To reset the values of the fields in the form
		*/
function resetForm()
{
	Services.startTransaction();
	
		Services.setValue(Query_CreditorCode_Txt.dataBinding, "");
		Services.setValue(Query_FileSequence_Txt.dataBinding, "");
		Services.setValue(Query_CaseNumber_Txt.dataBinding, "");
		Services.setValue(Main_RejectedPaid_Grid.dataBinding,"");
		Services.setValue(Main_RejectedPaid_Grid_PageNumber.dataBinding,"");
		Services.setValue(GRID_PAGE_NUMBER,"");
		Services.removeNode(Model_XPATH);
		
	Services.endTransaction();		
	
}
/*****************************************************************************************************************
*******************************	Input Fields' Definintions *******************************************************
*****************************************************************************************************************/
Query_CreditorCode_Txt.maxLength = 4;
Query_CreditorCode_Txt.helpText = "Creditor Code";
Query_CreditorCode_Txt.componentName = "Creditor Code";

		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_CreditorCode_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */	
Query_CreditorCode_Txt.validate = function(){	
	var ec = null;
	var value = Services.getValue(Query_CreditorCode_Txt.dataBinding);
	if(!isNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_CreditorCodeNotNumeric");
	}

    else if(value.length!=4)	ec =  ErrorCode.getErrorCode("Caseman_creditorCodeNotFourDigits_Msg");	
	return ec;
}

Query_CaseNumber_Txt.maxLength = 8;
Query_CaseNumber_Txt.helpText = "Case Number";
Query_CaseNumber_Txt.componentName = "Case Number";

		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_CaseNumber_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */	
Query_CaseNumber_Txt.validate = function(){
	var ec = null;
	var value = Services.getValue(Query_CaseNumber_Txt.dataBinding);
	if(!isAlphaNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_CaseNumberNotAlphaNumeric");
	}
	else if(value.length!=8)	ec =  ErrorCode.getErrorCode("CaseMan_CaseNumberInvalidLength_Msg");	
	return ec;
}

		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Query_CaseNumber_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Query_CaseNumber_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_FileSequence_Txt.maxLength = 3;
Query_FileSequence_Txt.helpText = "Customer File Sequence Number";
Query_FileSequence_Txt.componentName = "Customer File Sequence Number";
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_FileSequence_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_FileSequence_Txt.validate = function() {
	var ec = null;
	var value = Services.getValue(Query_FileSequence_Txt.dataBinding);
	if(!isNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_FileSequenceNumberNotNumeric");
	}
	else if(value.length!=3)	ec =  ErrorCode.getErrorCode("CaseMan_FileSeqNumberInvalidLength_Msg");	
	return ec;
}
/*****************************************************************************************************************
*******************************	BUTTON FIELD DEFINITIONS *********************************************************
*****************************************************************************************************************/
function CallBackCountObject(){}

/** 
 * callback handler which gets invoked upon the return
 * success of the remote invocation.
 * @param [Dom] objDom the reurned domm object from the invocation
 */	
CallBackCountObject.prototype.onSuccess = function(objDom)
{
	var nodeCount = parseInt(objDom.selectNodes("/RejectedPaids/RejectedPaid").length);
	Services.setValue(COUNT,nodeCount);
	if(nodeCount == 0){
		Services.setValue(GRID_PAGE_NUMBER, 0);
		Services.removeNode(RejectedPaid_XPATH);
		var msg = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage();
		Services.setTransientStatusBarMessage(msg);
	}
	else
	{		
	 	if(nodeCount <= 30){
	 		Services.setTransientStatusBarMessage("Number of Records Found "+nodeCount);
			Services.setValue(GRID_PAGE_NUMBER,1);
		 	Services.setValue("/ds/var/page/initialSearch", true);
	 		queryRejectedPaid(parseInt(GRID_PAGE_SIZE),Services.getValue(GRID_PAGE_NUMBER));
	 	}else{
	 		var msg = ErrorCode.getErrorCode("CaseMan_MoreThan30Records_Msg").getMessage();
	    	Services.showDialog(StandardDialogTypes.OK_CANCEL,MoreThan30RecordsCallBack,msg,"");
	 	}
	}
}
/** 
 * callback handler which gets invoked upon the return
 * error of the remote invocation.
 * @param [Exception] exception the resulting exception 
 * from the remote invocation
 */
	
CallBackCountObject.prototype.onError = function(exception)
{
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				"Error with connection to Server.!!"+
				"<BR>-Check Server is running."+
				"<BR>-Check Database is running."+
				"<BR>Contact system administrator !",
				""
		);	
}

function CallBackObject()
{
}

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */	
CallBackObject.prototype.onSuccess = function(objDom)
{
callBackObjectSuccess(objDom);
}

	/** 
	 * callBackObjectSuccess handles populating the search results on the screen
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */	
function callBackObjectSuccess(objDom)
{
	Services.startTransaction();
	Services.removeNode(FORM_XPATH + "/Model");
	Services.addNode(objDom, FORM_XPATH + "/Model");
	Services.endTransaction();
	var nodeCount = parseInt(objDom.selectNodes("/RejectedPaids/RejectedPaid").length);
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER)); 
	var initialSearch = Services.getValue("/ds/var/page/initialSearch");
	var nodeCount = Services.getValue(COUNT);
	initialSearch = isTrueOrFalse(initialSearch);
	Services.setTransientStatusBarMessage("Number of Records Found "+nodeCount);	
}
	/** 
	 * callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
	
CallBackObject.prototype.onError = function(exception)
{
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},
				"Error with connection to Server.!!"+
				"<BR>-Check Server is running."+
				"<BR>-Check Database is running."+
				"<BR>Contact system administrator !",
				""
		);	
}
 
		/** Binding Actions to Main_Back_Btn*/ 
Main_Back_Btn.actionBinding = function()
{	
Services.navigate("MainMenu");	
					
}     

Query_Search_Btn.helpText="Submit Query";

		/** Binding Actions to Query_Search_Btn*/
Query_Search_Btn.actionBinding = function(){ 
	 if(isEmptySearch()) {
	 	var msg = ErrorCode.getErrorCode("CaseMan_EmptySearch_Msg").getMessage();
		Services.setTransientStatusBarMessage(msg);
		Services.setFocus("Query_CreditorCode_Txt");
	 } else {
	 	queryRejectedPaid(0,0);
	 }
}

		/** Binding Actions to Main_Clear_Btn*/
Main_Clear_Btn.actionBinding = function()
{
	resetForm();
	Services.setFocus("Query_CreditorCode_Txt");
}

	/** binding keys and mouse events to Main_Clear_Btn */
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "QueryRejectedPaid", alt: true }]
      }
};

	/**
	 * Get the rejected paid based on the page size and page number
	 * @param [Integer] pageSize represents the size of the page that will be 
	 * retrieved
	 * @param [Integer] pageNumber the current page number*/
function queryRejectedPaid(pageSize, pageNumber) {

	var credCodeAdaptor = Services.getAdaptorById("Query_CreditorCode_Txt");
	var caseNumAdaptor  = Services.getAdaptorById("Query_CaseNumber_Txt");
	var fileSeqAdaptor  = Services.getAdaptorById("Query_FileSequence_Txt");
	
	if(!credCodeAdaptor.getValid()){
		Services.setFocus("Query_CreditorCode_Txt");		
	}
	else if(!caseNumAdaptor.getValid()){
		Services.setFocus("Query_CaseNumber_Txt");	
	}
	else if(!fileSeqAdaptor.getValid()){
		Services.setFocus("Query_FileSequence_Txt");	
	}
	
	else {
		var params = new ServiceParams();
		if(Services.getValue(Query_CreditorCode_Txt.dataBinding)!=null)	
			params.addSimpleParameter("Creditor_Code_Query", Services.getValue(Query_CreditorCode_Txt.dataBinding));		
		if(Services.getValue(Query_CaseNumber_Txt.dataBinding)!=null)	
			params.addSimpleParameter("Case_Number_Query", Services.getValue(Query_CaseNumber_Txt.dataBinding));
		if(Services.getValue(Query_FileSequence_Txt.dataBinding)!=null)			
			params.addSimpleParameter("File_Seq_Query", Services.getValue(Query_FileSequence_Txt.dataBinding));
		if(pageSize == 0 && pageNumber ==0)
		{
			var callbackCountObj = new CallBackCountObject() ;
			Services.callService("getRejectedPaidsCount",params,callbackCountObj,false,false);
		}
		else
		{
			var callbackObj = new CallBackObject() ;
			//parameters for paging.	
			params.addSimpleParameter("pageSize",pageSize );
			params.addSimpleParameter("pageNumber",pageNumber);
			Services.callService("getRejectedPaids",params,callbackObj,true);
		}
	}
}

/**
*
*  This method is executed to check weather the search is an empty search
*  The method returns true if the user didnt enter any search item in the fields , at least one of the search items Creditor Code, 
*  Case Number, File Sequence Number. 
*  @param  none.
*  @return boolean	
*/
function isEmptySearch() {
	var emptyFlag = true;
	
	var creditorCode = Services.getValue(Query_CreditorCode_Txt.dataBinding);	
	if(creditorCode != "" && creditorCode != null) {
		emptyFlag = false;
	}		

	var caseNumber = Services.getValue(Query_CaseNumber_Txt.dataBinding);
	if(caseNumber != ""  && caseNumber != null ) {
		emptyFlag = false;
	}		



	var  fileSequenceNum = Services.getValue(Query_FileSequence_Txt.dataBinding);
	if(fileSequenceNum != "" && fileSequenceNum != null) {
		emptyFlag = false;
	}

	return emptyFlag; 
}


/**
*  The method returns true if the flag value is not equal to zero and false if the flag value is zero.
*  @param  integer flag.
*  @return boolean	
*/
function isTrueOrFalse(flag) {

	if(flag == 0) {
		return false;
	} else {
		return true;
	}
}

/**
*  This method is executed when the user responds to the Confirm Dialog box appears 
*  after performing search operation that returns large number of records greater than the grid page size.
*  @param  button selected by the user. (OK or Cancel)
*  @return void	
*/
function MoreThan30RecordsCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.OK:
			{
				var nodeCount = Services.getValue(COUNT);
				Services.setTransientStatusBarMessage("Number of Records Found "+nodeCount);
				Services.setValue(GRID_PAGE_NUMBER,1);
			 	Services.setValue("/ds/var/page/initialSearch", true);
		 		queryRejectedPaid(parseInt(GRID_PAGE_SIZE),Services.getValue(GRID_PAGE_NUMBER));	
				break;			
			}
			
		
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation
				Services.setValue(GRID_PAGE_NUMBER, 0);
				Services.removeNode(RejectedPaid_XPATH);
				break;
			}
	}
}
