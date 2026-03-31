/**
File Name			    :  LogReceivedTapes.js
Description			    :
Owner	(EDS Net ID)	:  Khaled A. Gawad [ vzq598 ]
Modification History	:
=====================================================================================================
 *  Ver.	CR#		Date		 Modified	       Email                    Description
 *  -------------------------------------------------------------------------------------------------
 *  1.0a		  	11-07-2005	 Khaled	A. Gawad   khaled.gawad@eds.com        Construction
 *  1.0b            14-07-2005   Heba Salama       heba.salama@eds.com         Server integration
 *  1.0c            05-09-2005   Khaled A. Gawad   khaled.gawad@eds.com        Defect fixing
 *  1.0d            04-17-2005   Ahmed Tawfik      ahmed.tawfik@eds.com        Defect fixing
 */

var Temp_XPATH = FORM_XPATH + "/Temp" ;
var Query_XPATH = PAGE_XPATH + "/Query";
var GRID_XPATH = PAGE_XPATH + "/ReceivedTapes";
var TAPE_PATH = FORM_XPATH + "/Model/ReceivedTapes/ReceivedTape";
var FILE_PATH = TAPE_PATH + "/TapeFiles/TapeFile";
var Quick_XPATH = "/ds/var/Query";
var SAVING_FINISHED_XPATH = FORM_XPATH + "/Saving/Finished";
var tapeFilesDom = null;
var queryDom = null;
//variables for paging
var GRID_PAGE_SIZE = 20;
var GRID_PAGE_NUMBER = "/ds/var/page/pageNumber";

// paging fields in the Grid.
function Query_Grid_Prev() {}
function Query_Grid_PageNumber() {}
function Query_Grid_Next() {}

//paging data binding
Query_Grid_PageNumber.dataBinding = PAGE_XPATH + "/PageNumberGrid";	

/**********************************************************************************************************************
***************************************	MAIN FORM *********************************************************************
**********************************************************************************************************************/
/**
 * Constructor for the form LogReceivedTapes
*/
 function LogReceivedTapes() {};
 
/**
* Initialization of the form LogReceivedTapes
*/

LogReceivedTapes.initialise = function(){
	
	clearMainScreen();
	initialiseMainScreen();
}

/**
* Reference data for the form LogReceivedTapes
*/
LogReceivedTapes.refDataServices = [
	{
		name:"date",      dataBinding:FORM_XPATH + "/RefData", serviceName:"getTodayDate",serviceParams:[]
	}
];


/**
* Menu Bar and the quick links.
*/
menubar = 
{
	quickLinks: 
	[
		{		
			id: "Main_Query_Btn",                 // id for button
			formName: "LogReceivedTapes",       // The name of the current form
			label: " Query ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() {
				var libraryNumberAdaptor = Services.getAdaptorById("Main_Library_Number_Txt");
				if(libraryNumberAdaptor.getValid()){
				   var saveBtn = Services.getAdaptorById("Main_Save_Btn");
				   var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				   if(exitWithoutSavingFlag == 0) {
				   		exitWithoutSavingFlag = false;
				   } else {
						exitWithoutSavingFlag = true;
				   }
				   if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
						var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();		
						Services.showDialog(
							StandardDialogTypes.YES_NO_CANCEL,
							function QueryDialogCallBack(button){
								switch(button){		
							
									case StandardDialogButtonTypes.YES:
									{    
										
										Services.setValue("/ds/var/page/toDoFlag","QUERY");
										
									    var saveOnlyCallBackObject = 
																 new SaveOnlyCallBackObject();
										
						                var invalidFlds = saveForm(saveOnlyCallBackObject);  
						                Services.setFocus("Query_Library_Number_Txt");              
										break;
									}
									case StandardDialogButtonTypes.NO: 
									{	
										clearMainScreen();
										Query_Clear_Btn.actionBinding();
										var fc = FormController.getInstance();
										fc.showFormExtensionPopup("Query_popup");
										Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
										Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
										Services.setFocus("Query_Library_Number_Txt");
										break;
									}
									case StandardDialogButtonTypes.CANCEL: break;
								} // End of switch statment
					  	  	},// End of function QueryDialogCallBack
							msg,""
						);	
					} else{
						Query_Clear_Btn.actionBinding();
						var fc = FormController.getInstance();
						fc.showFormExtensionPopup("Query_popup");
						Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
 					}
   				} else {
	  				Services.setFocus("Main_Library_Number_Txt");
 				}
								
			}, // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */		
			prepare: function() {
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action, Ctrl+F1 will invoke 
			 * the Main_Query_Btn
			 */
			eventBinding: {
				keys: [{ key: Key.F1, element: "LogReceivedTapes", ctrl: true }],
				singleClicks: [],
				doubleClicks: []
			},
			onMenuBar: true   
		},
		{
			id: "Log_Returned_Tapes_Btn",                 // id for button
			formName: "ReturnedRecords",       // The name of the current form
			label: " Log Returned Tapes ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			
			guard: function() {		
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						ReturnedRecordsCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("ReturnedRecords");
	
				}	
			}, // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			
			prepare: function() {
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			 eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},
		{
			id: "View_Rejected_Cases_Btn",                 // id for button
			formName: "QueryRejectedCases",       // The name of the current form
			label: " Rejected Cases ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			
			guard: function() {
			
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag  == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedCasesCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("QueryRejectedCases");
	
				}	
			}, // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			
			prepare: function() {
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			},
			onMenuBar: true
		},
		{
			id: "View_Rejected_Judgments_Btn",                 // id for button
			formName: "QueryRejectedJudgments",       // The name of the current form
			label: " Rejected Judgments ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() {
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");	
				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}		
 				if(exitWithoutSavingFlag == true&&saveBtn.getEnabled()){
 					
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedJudgmentsCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("QueryRejectedJudgments");
	
				}	
			}, // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			
			prepare: function() {
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			 eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: true
		},		
		{
			id: "View_Rejected_Warrants_Btn",                 // id for button
			formName: "QueryRejectedWarrants",       // The name of the current form
			label: " Rejected Warrants ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			
			guard: function() {
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedWarrantsCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("QueryRejectedWarrants");
	
				}	
			},  // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			prepare: function() {
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			 eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			 },
			onMenuBar: false
		},
		{
			id: "View_Rejected_Paid_Btn",                 // id for button
			formName: "QueryRejectedPaid",       // The name of the current form
			label: " Rejected Paid / Written Off Details ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() {
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedPaidCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("QueryRejectedPaid");
	
				}	
			},  // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			prepare: function() {
			 
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			},
			onMenuBar: false
		},
		{
			id: "Print_Customer_File_Reports_Btn",                 // id for button
			formName: "ProduceCustomerFileReports",     
			label: " Print Customer File Reports ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			
			guard: function() {
				
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						ProduceCustomerFileReportsCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("ProduceCustomerFileReports");
	
				}	
			},  // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			
			prepare: function(){
			 
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			 eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			},
			onMenuBar: false
		},
		{
			id: "Print_Output_Statistics_Report_Btn",                 // id for button
			formName: "Oracle_Reports_BC_ST_R2",     
			label: " Print Output Statistics Report ",                    // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() {
				
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");		
 				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}
 				if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						ProduceOutputStatisticsReportCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("Oracle_Reports_BC_ST_R2");
	
				}	
			},  // End of guard funtion
			/**
			 * The framework calls this function before navigating
			 * to the quick links (sub-) form
			 */
			prepare: function(){
			 
			},                 
			/**
			 * Standard event binding that can be used for example to 
			 * set a function key to invoke the action
			 */	
			 eventBinding: {
				keys: [],
				singleClicks: [],
				doubleClicks: []
			},
			onMenuBar: false
		},
		{
			id: "NavBar_CodedPartiesButton",                 // id for button		
			formName: "MaintainNationalCodedParties",       // The name of the current form			
			label: " Maintain National Coded Parties ",                    // The label appear in the navigation bar			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() 
			{
				var saveBtn = Services.getAdaptorById("Main_Save_Btn");	
				var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
				if(exitWithoutSavingFlag == 0) {
					exitWithoutSavingFlag = false;
				} else {
					exitWithoutSavingFlag = true;
				}		
 				if(exitWithoutSavingFlag == true&&saveBtn.getEnabled()){
 					
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						MaintainNationalCodedPartiesCallBack,
						msg,
						""
					);
				} else {
					Services.navigate("MaintainNationalCodedParties");
	
				}			
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
* key Bindings for the form LogReceivedTapes
*/
LogReceivedTapes.keyBindings = [
	{		
		/** Binding F6 to Main_Customer_LOV_Btn */
		key: Key.F6, action: function(){		        
								var lovBtn = Services.getAdaptorById("Main_Customer_LOV_Btn");          
								var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
								queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);	                    			                    	                              	                    		      		                    	                    		     
    	                    	if(!queryPopupRaisedFlag &&lovBtn.getEnabled()) {
    	                    		Main_Customer_LOV_Btn.actionBinding();
    	                    	} else if (queryPopupRaisedFlag) {
    	                    		Query_Customer_LOV_Btn.actionBinding();							 
    	                    	}	
							 } // end of function
	},
	{		
		/** Binding F4 to Main_Back_Btn */
		key: Key.F4, action: function(){
    	                         Main_Back_Btn.actionBinding();     	                    	
							} // end of function
	},
	{		
		/** Binding F3 to Main_Save_Btn */
		key: Key.F3, action: function(){	      
								var saveBtn = Services.getAdaptorById("Main_Save_Btn");
    	                    	if(saveBtn.getEnabled()){
    	                  			Main_Save_Btn.actionBinding();    	                    		
								}
							} // end of function
	}
];

/**********************************************************************************************************************
************************************************ Main Form Constructors ***********************************************
**********************************************************************************************************************/

function pageMode(){};
/**
*	 Grid Constructors
*/
function Query_Tapes_Grid () {};
function Main_Tape_Files_Grid() {};

/**
*	LOV Constructors
*/
function Customer_Popup_LOV() {};
function Query_Customer_Popup_LOV(){};
/**
*	Logic fields Constructors
*/
function LogicObjectOne(){};
/**
*	 Master Section Constructors
*/
function Main_Library_Number_Txt() {};
function Main_Customer_ID_Txt() {};
function Main_Customer_Desc_Txt() {};
function Main_Date_Received_Cal() {};
function Main_Date_Returned_Cal() {};
function Main_Date_To_Operations_Cal() {};
function Main_Comments_Txt() {};
/**
*	 Query Popup Fields
*/
function Query_Library_Number_Txt() {};
function Query_Customer_ID_Txt() {};
function Query_Customer_Desc_Txt() {};
function Query_Date_Received_Txt() {};
function Query_Date_Returned_Txt() {};
function Query_Tape_File_Name_Txt() {};
/**
*	Details Section
*/
function Detail_File_Name_Txt() {};
function Detail_Number_Of_Records_Txt() {};
function Detail_Warrant_Fees_Txt() {};
function Detail_Warrant_Fees_Cur() {};
function Detail_Comments_Zoom() {};
function Detail_Status_Txt() {};
function Detail_Seq_No(){};
/**
*	 Add Popup Fields
*/
function Add_popup(){};
function Add_Seq_No(){};
function Add_File_Name_Txt() {};
function Add_Number_Of_Records_Txt() {};
function Add_Warrant_Fees_Cur() {};
function Add_Warrant_Fees_Txt() {};
function Add_Comments_Zoom(){};
function Add_RemovedSeqNO() {};
function Add_RemovedFlag() {};
function Saving_FinishedFlag(){};

/**********************************************************************************************************************
************************************************ Main Form Data Bindings **********************************************
**********************************************************************************************************************/

pageMode.dataBinding = FORM_XPATH + "/pageMode";
/**
*	Grid Section 
*/
Query_Tapes_Grid.dataBinding     = "/ds/var/page/QueryTapesGrid";
Main_Tape_Files_Grid.dataBinding = "/ds/var/page/MainTapeFilesGrid";
/**
*	LOV Section 
*/
Customer_Popup_LOV.dataBinding = "/ds/var/page/CustomerPopup";
Query_Customer_Popup_LOV.dataBinding = "/ds/var/page/QueryCustomerPopup";
/**
*	 Logic Object Fields
*/
LogicObjectOne.dataBinding            = FORM_XPATH + "/logic/LogicObjectOne";

/**
*	 Master Section Fields
*/
Main_Library_Number_Txt.dataBinding     = TAPE_PATH + "/LibraryNumber"			
Main_Customer_ID_Txt.dataBinding        = TAPE_PATH + "/CustomerCode"			
Main_Customer_Desc_Txt.dataBinding      = TAPE_PATH + "/CustomerName"			
Main_Date_Received_Cal.dataBinding      = TAPE_PATH + "/DateReceived"			
Main_Date_To_Operations_Cal.dataBinding = TAPE_PATH + "/DateToOperations"		
Main_Comments_Txt.dataBinding           = TAPE_PATH + "/Comments"			
Main_Date_Returned_Cal.dataBinding      = TAPE_PATH + "/DateReturned"
/**
*	Details Section Fileds 
*/
Detail_File_Name_Txt.dataBinding         = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/FileName"				
Detail_Number_Of_Records_Txt.dataBinding = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/NumberOfRecords"		
Detail_Warrant_Fees_Cur.dataBinding      = "/ds/var/page/Currency";  
Detail_Warrant_Fees_Txt.dataBinding      = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/Fees";				
Detail_Comments_Zoom.dataBinding         = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/Comments"				
Detail_Status_Txt.dataBinding            = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/Status"			
Detail_Seq_No.dataBinding                = FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/LibraryNumber"	
/**
*	 Query Popup Fields
*/
Query_Library_Number_Txt.dataBinding = Query_XPATH + "/LibraryNumber";
Query_Customer_ID_Txt.dataBinding    = Query_XPATH + "/CustomerCode";
Query_Customer_Desc_Txt.dataBinding  = Query_XPATH + "/CustomerName";
Query_Date_Received_Txt.dataBinding  = Query_XPATH + "/DateReceived";
Query_Date_Returned_Txt.dataBinding  = Query_XPATH + "/DateReturned";
Query_Tape_File_Name_Txt.dataBinding = Query_XPATH + "/FileName";

/**
*	 Add Popup Fields
*/
Add_File_Name_Txt.dataBinding         = FORM_XPATH + "/AddFile/TapeFile/FileName";
Add_Number_Of_Records_Txt.dataBinding = FORM_XPATH + "/AddFile/TapeFile/NumberOfRecords";
Add_Warrant_Fees_Cur.dataBinding      = FORM_XPATH + "/AddFile/WarrantFeesCur";
Add_Warrant_Fees_Txt.dataBinding      = FORM_XPATH + "/AddFile/TapeFile/Fees";
Add_Comments_Zoom.dataBinding         = FORM_XPATH + "/AddFile/TapeFile/Comments";
Add_Seq_No.dataBinding                = FORM_XPATH + "/AddFile/TapeFile/LibraryNumber";
Add_RemovedSeqNO.dataBinding 		  = FORM_XPATH + "/AddFile/TapeFile/Remove/OrderSeq";
Add_RemovedFlag.dataBinding			  = FORM_XPATH + "/AddFile/TapeFile/Remove/Removed";

/**********************************************************************************************************************
************************************************ GRID DEFINITIONS **********************************************
**********************************************************************************************************************/


/**
*	 Query Tapes Grid
*/

Query_Tapes_Grid.componentName = "Received Tapes Grid";
Query_Tapes_Grid.helpText = "Results returned by Query for a Tape.";
Query_Tapes_Grid.tabIndex = 90;
Query_Tapes_Grid.srcData = GRID_XPATH;
Query_Tapes_Grid.rowXPath = "ReceivedTape";
Query_Tapes_Grid.keyXPath = "SurrogateKey";
Query_Tapes_Grid.columns = [
	{
		xpath: "LibraryNumber", defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"
	},
	{
		xpath: "CustomerCode" 
	},
	{
		xpath: "CustomerName"
	},
	{
		xpath: "DateReceived",   defaultSort:"true", 
		
		transformToDisplay: function(value){
			
			if(value==null||value=="") {
				return "";
			}	
			var formattedDate = formatDateInGrid(value);
			return formattedDate;
		   	
		}, // End of transformToDisplay function
		sort:SortDate,
		defaultSortOrder:"ascending"
	},
	{
		xpath: "DateReturned",  defaultSort:"true", 
		
		transformToDisplay: function(value){
			if(value==null||value=="") {
				return "";
			}	
		    var formattedDate = formatDateInGrid(value);
			return formattedDate;
		}, // End of transformToDisplay function
		sort:SortDate,
		defaultSortOrder:"ascending"
	}
];
/** 
	used to configure adaptors to be excluded from Form Validation
	@return true
 */
Query_Tapes_Grid.isTemporary = function(){
	return true;
}

/**
*	 Main Tape Files Grid
*/
Main_Tape_Files_Grid.generateKeys = true;
Main_Tape_Files_Grid.tabIndex = 110;
Main_Tape_Files_Grid.helpText = "Tape Files associated with the displayed Tape.";
Main_Tape_Files_Grid.componentName = "";
Main_Tape_Files_Grid.srcData = TAPE_PATH + "/TapeFiles"	
Main_Tape_Files_Grid.rowXPath = "TapeFile";
Main_Tape_Files_Grid.keyXPath = "SurrogateKey";
Main_Tape_Files_Grid.columns = [
	{xpath: "FileName"}
];
/**********************************************************************************************************************
************************************************ LOV DEFINITION ****************************************************
**********************************************************************************************************************/

/**
*	 Customer Popup LOV
*/
Customer_Popup_LOV.srcData = FORM_XPATH + "/RefData/Customers"; 
Customer_Popup_LOV.rowXPath = "Customer";
Customer_Popup_LOV.keyXPath = "CustomerCode";
Customer_Popup_LOV.columns = [
	{xpath: "CustomerCode", defaultSort:"true", sort:"numerical"},
	{xpath: "CustomerName"}	
];

/**
*	 Query Customer PopupLOV
*/
Query_Customer_Popup_LOV.srcData = FORM_XPATH + "/RefData/Customers";  
Query_Customer_Popup_LOV.rowXPath = "Customer";
Query_Customer_Popup_LOV.keyXPath = "CustomerCode";
Query_Customer_Popup_LOV.columns = [
	{xpath: "CustomerCode" , defaultSort:"true", sort:"numerical" },
	{xpath: "CustomerName"}	
];
/**********************************************************************************************************************
************************************************ POPUP DEFINITION **************************************************
**********************************************************************************************************************/
/**
*	Query popup
*/
function Query_popup(){};
/**
* key Bindings for the Query_popup
*/
Query_popup.keyBindings = [
	
	{		
		/** Binding F6 to Query_Customer_LOV_Btn */	
		key: Key.F6, action: function(){		        								
	                   			Query_Customer_LOV_Btn.actionBinding();							 
							} // End of action function
	},
	{
		/** Binding F1 to Query_Search_Btn */			
		key: Key.F1, action: function(){	
								
                       		 	Query_Search_Btn.actionBinding();     	                    		
							} // End of action function
	},
	{		
		/** Binding F4 to Query_Cancel_Btn */	
		key: Key.F4, action: function(){		        								
	                    		Query_Cancel_Btn.actionBinding();						 
							} // End of action function
	}
];



/**
*	Add popup 
*/
function Add_popup(){};
Add_popup.keyBindings = [
	{		
		key: Key.F4, action: function(){		        								
		                         Add_Cancel_Btn.actionBinding(); 						 
							} // End of action function
	}
];
/**********************************************************************************************************************
************************************************ LOGIC FIELDS DEFINITION **********************************************
**********************************************************************************************************************/

LogicObjectOne.logicOn = [SAVING_FINISHED_XPATH];
/**
* the function will be called based on the changes to the underlying DOM 
*/
LogicObjectOne.logic = function(event){
	
	var saving_flag = Services.getValue(SAVING_FINISHED_XPATH);	
	switch(saving_flag){
	    case "":
	    {
	    	Services.setFocus("Main_Customer_ID_Txt");
	    	return; break;
	    } 
		case "OK_CLEAR":
		{
			clearMainScreen();
			Services.setFocus("Main_Customer_ID_Txt");
			break;
		}
		case "OK_QUERY":
		{	
					clearMainScreen();
					Query_Clear_Btn.actionBinding();
					Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
					var fc = FormController.getInstance();
					fc.showFormExtensionPopup("Query_popup");	
					Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
					Services.setFocus("Query_Library_Number_Txt");				
			break;
		}
		case "OK_BACK":
		{
			Services.navigate("MainMenu");			
		}
	}
};

/**********************************************************************************************************************
************************************************ INPUT FIELD DEFINITIONS **********************************************
**********************************************************************************************************************/
/**
* sets the default page mode to Insert(I)
*/
pageMode.setDefault = function(){
	Services.setValue(pageMode.dataBinding,"I");
}

Query_Library_Number_Txt.componentName = "Library Number";
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Query_Library_Number_Txt.isTemporary = function(){
	return true;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Library_Number_Txt.transformToModel = function(value){
	return (null != value) ? Trim(value) : null;
}
Query_Library_Number_Txt.maxLength = 9;
Query_Library_Number_Txt.tabIndex = 10;
Query_Library_Number_Txt.helpText = "Tape Library Number.";
/**
 * This function will be invoked to determine if 
 * the content of Query_Library_Number_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Library_Number_Txt.validate = function(){
    var libraryNumberValue = Services.getValue(Query_Library_Number_Txt.dataBinding);	
	if(isNumericWithoutWildcard(libraryNumberValue)) return null;
	else return ErrorCode.getErrorCode("Caseman_libraryNumberNotNumeric_Msg");
}
Query_Customer_ID_Txt.tabIndex = 20;
Query_Customer_ID_Txt.maxLength = 4;
Query_Customer_ID_Txt.logicOn = [Query_Customer_ID_Txt.dataBinding,Query_Customer_Popup_LOV.dataBinding];
/**
 * This function add a logic to the Query_Customer_ID_Txt, when the user enters 
 * a Custoner Id, the function will obtain the corresponding Customer description 
 * from the LOV and display the Customer description in the Query_Customer_Desc_Txt
 * field.
 */
Query_Customer_ID_Txt.logic = function(event){
	if(event.getXPath() == Query_Customer_ID_Txt.dataBinding){
		var codeId = Services.getValue(Query_Customer_ID_Txt.dataBinding);
		if(codeId==null||codeId==""){
			Services.setValue(Query_Customer_Desc_Txt.dataBinding,"");
		}else{
			if(IsInteger(codeId) && codeId.length == 4 && /^\d*$/.test(codeId)) {
				Services.setValue(Query_Customer_Desc_Txt.dataBinding,Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + codeId + "]/CustomerName"));
			}else{
				Services.setValue(Query_Customer_Desc_Txt.dataBinding,"");
			}
		}
	}
	if(event.getXPath() == Query_Customer_Popup_LOV.dataBinding){
		var lovSelectedCode = Services.getValue(Query_Customer_Popup_LOV.dataBinding);
		if(lovSelectedCode != null){
			var lovSelectedDesc = Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + lovSelectedCode + "]/CustomerName")
			Services.setValue(Query_Customer_ID_Txt.dataBinding, lovSelectedCode);
			if(IsInteger(lovSelectedCode) && lovSelectedCode.length == 4 && /^\d*$/.test(lovSelectedCode)) {
				Services.setValue(Query_Customer_Desc_Txt.dataBinding,lovSelectedDesc);
			}else{
				Services.setValue(Query_Customer_Desc_Txt.dataBinding,"");
			}
		}
	}
}
Query_Customer_ID_Txt.componentName = "Customer Code";
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/

Query_Customer_ID_Txt.isTemporary = function(){
	return true;
}
Query_Customer_ID_Txt.helpText = "Customer Code - list of values available.";
/**
 * This function will be invoked to determine if 
 * the content of Query_Customer_ID_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Customer_ID_Txt.validate = function(){
	var custCode = Services.getValue(Query_Customer_ID_Txt.dataBinding);
	if(isNumericWithoutWildcard(custCode)){
		if(new RegExp(/%/).test(custCode)) {
			return null;
		} else if(custCode.length!=4) {
			return ErrorCode.getErrorCode("CaseMan_CustomerCodeNot4Digits");
		} else {
			return null;	
		}	
	} else {
		return ErrorCode.getErrorCode("Caseman_CustomerCodeNotNumeric_Msg");
	}
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Customer_ID_Txt.transformToModel = function(value){
	return (null != value) ? Trim(value) : null;
}

Query_Customer_Desc_Txt.tabIndex = 30;
Query_Customer_Desc_Txt.maxLength = 70;
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Customer_Desc_Txt.transformToModel = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed before it 
* is displayed by an adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/

Query_Customer_Desc_Txt.transformToDisplay = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}


Query_Customer_Desc_Txt.componentName = "Customer Name.";
/**
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Query_Customer_Desc_Txt.isTemporary = function(){
	return true;
}
Query_Customer_Desc_Txt.helpText = "Customer Name.";
/**
 * This function will be invoked to determine if 
 * the content of Query_Customer_Desc_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Customer_Desc_Txt.validate = function(){
	return null;
	/*var creditorName = Services.getValue(Query_Customer_Desc_Txt.dataBinding);	
	if(isPartialValidPersonName(creditorName)) {
		return null;
	} else { 
		return ErrorCode.getErrorCode("Caseman_CustomerNameNotNumeric_Msg");
	}*/
}
Query_Customer_Desc_Txt.readOnlyOn = [];
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/			
Query_Customer_Desc_Txt.isReadOnly = function(event){ 
	return true;
}
Query_Date_Received_Txt.componentName = "Date Received";
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Query_Date_Received_Txt.isTemporary = function(){
	return true;
}
Query_Date_Received_Txt.tabIndex = 50;
Query_Date_Received_Txt.maxLength = 11;
Query_Date_Received_Txt.helpText = "Date tape or disk received.";
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Date_Received_Txt.transformToModel = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/**
 * This function will be invoked to determine if 
 * the content of Query_Date_Received_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Date_Received_Txt.validate = function(){    
	var ec = null;
	var  dateReceived = Services.getValue(Query_Date_Received_Txt.dataBinding);
	
	
	if(dateReceived.indexOf("%") == -1 ){
	
		if(!isValidDateTxt(dateReceived)) {
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
	} else { 
		var regExp = /\%?/g ;
			
		var updatedDateReceived = dateReceived.replace(regExp,"");
		if(updatedDateReceived.length < 3 ) {
			ec = ErrorCode.getErrorCode("CaseMan_DateReceivedInvalidLength_Msg");
		}
	}
	return ec;
}

Query_Date_Returned_Txt.componentName = "Date Returned";
Query_Date_Returned_Txt.tabIndex = 60;
Query_Date_Returned_Txt.maxLength = 11;
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Query_Date_Returned_Txt.isTemporary = function(){
	return true;
}
Query_Date_Returned_Txt.helpText = "Date tape or disk returned to the Customer.";
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Date_Returned_Txt.transformToModel = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/**
 * This function will be invoked to determine if 
 * the content of Query_Date_Returned_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */

Query_Date_Returned_Txt.validate = function(){    
	var ec = null;
	var  dateReturned = Services.getValue(Query_Date_Returned_Txt.dataBinding);
	if(dateReturned.indexOf("%") == -1 ){
		if(!isValidDateTxt(dateReturned)) {
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}	
	} else { 
		var regExp = /\%?/g ;
			
		var updatedDateReturned = dateReturned.replace(regExp,"");
		if(updatedDateReturned.length < 3 ) {
			ec = ErrorCode.getErrorCode("CaseMan_DateReturnedInvalidLength_Msg");
		}
	}
	return ec;
}

Query_Tape_File_Name_Txt.componentName = "File Name";
Query_Tape_File_Name_Txt.tabIndex = 70;
Query_Tape_File_Name_Txt.maxLength = 10;
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Query_Tape_File_Name_Txt.isTemporary = function(){
	return true;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Tape_File_Name_Txt.transformToModel = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}

Query_Tape_File_Name_Txt.logicOn = [Query_Customer_ID_Txt.dataBinding];
/**
* This function adds a logic Query_Tape_File_Name_Txt cause customer 
* code is part of the file name. 
*/
Query_Tape_File_Name_Txt.logic = function(){
    var custCode = Services.getValue(Query_Customer_ID_Txt.dataBinding);    
	var fileName = Services.getValue(Query_Tape_File_Name_Txt.dataBinding);
	if(fileName==null||fileName=="") {
		return
	}
	if(fileName!=null&&custCode!=null&&custCode.length==4&&!isNaN(custCode)){
		fileName = fileName.substring(4);
		fileName = custCode+fileName;
		Services.setValue(Query_Tape_File_Name_Txt.dataBinding, fileName);
	}	
}
Query_Tape_File_Name_Txt.helpText = "Name of file, eg. 1500JG.123.";
Query_Tape_File_Name_Txt.maxLength = 10;
/**
 * This function will be invoked to determine if 
 * the content of Query_Tape_File_Name_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Tape_File_Name_Txt.validate = function(){    
	var ec = null;
	var  fileName = Services.getValue(Query_Tape_File_Name_Txt.dataBinding);
	if(fileName.indexOf("%") == -1 && fileName.length < 10){
			ec = ErrorCode.getErrorCode("Caseman_FileNameNot10Characters_Msg");
	} else { 
		var regExp = /\%?/g ;
			/* remove % symbol from the text */
		var updatedFileName = fileName.replace(regExp,"");
			/* check if the number of chars is less than 3 */
		if(updatedFileName.length<3){
			ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
		}
		else{
				/* remove spaces and check that the text contains at least one char rather than spaces */
			updatedFileName = updatedFileName.replace(/ /g,"");		
			if(updatedFileName.length == 0){
				ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
			}
		}
	}
	return ec;


}
Main_Library_Number_Txt.tabIndex = 20;
Main_Library_Number_Txt.maxLength = 9;
Main_Library_Number_Txt.componentName = "Library Number";
Main_Library_Number_Txt.helpText = "Tape Library Number.";
/**
 * This function will be invoked to determine if 
 * the content of Main_Library_Number_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Main_Library_Number_Txt.validate = function(){
	var libraryNumberValue = Services.getValue(Main_Library_Number_Txt.dataBinding);	
	var numberPattern = new RegExp(/^\d*$/);
	if(numberPattern.test(libraryNumberValue)) { 
		return null 
	} else { 
		return ErrorCode.getErrorCode("Caseman_libraryNumberNotNumeric_Msg");
	}
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Main_Library_Number_Txt.transformToModel = function(value){
		return (null != value) ? Trim(value) : null;
}

Main_Library_Number_Txt.logicOn = [Main_Library_Number_Txt.dataBinding];
/**
* This function adds logic on the Main_Library_Number_Txt field
* to invoke search operation with the library number when the user 
* tabs outside the Main_Library_Number_Txt field.
*
*/
Main_Library_Number_Txt.logic = function(){
	var fc = FormController.getInstance() ;
	var libraryNumberAdaptor = fc.getAdaptorById("Main_Library_Number_Txt");
	var searchResultFlag = Services.getValue("/ds/var/page/searchResultFlag");
	searchResultFlag  = isTrueOrFalse(searchResultFlag);
	var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
	queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);	 
	if(!queryPopupRaisedFlag || searchResultFlag == false){
		if(Services.getValue(Main_Library_Number_Txt.dataBinding) == ""){
			Main_Clear_Btn.actionBinding();
		} else if(Services.getValue(Main_Library_Number_Txt.dataBinding) != null && libraryNumberAdaptor.getValid()){
			var newDOM = XML.createDOM(null, null, null);		
			var firstLibraryNumberSetFlag = Services.getValue("/ds/var/page/firstLibraryNumberSetFlag");
			if(firstLibraryNumberSetFlag == 0) {
				firstLibraryNumberSetFlag = false;
			} else {
				firstLibraryNumberSetFlag = true;
			}
			if(firstLibraryNumberSetFlag == true) {
			Services.startTransaction();			
				Services.setValue("/ds/var/page/firstLibraryNumberSetFlag",false);			
				var libraryNumber = Services.getValue(Main_Library_Number_Txt.dataBinding);
				Services.setValue(Quick_XPATH + "/LibraryNumber",Services.getValue(Main_Library_Number_Txt.dataBinding));
				Services.removeNode(FORM_XPATH + "/Model/ReceivedTapes");
				var mcNode = Services.getNode(Quick_XPATH);
			Services.endTransaction();	
				executeSearch(libraryNumber);
			}
		}
	} else{
		Services.setValue("/ds/var/page/searchResultFlag",false);
	}
}
Main_Customer_ID_Txt.maxLength=4;
Main_Customer_ID_Txt.tabIndex = 30;
Main_Customer_ID_Txt.componentName = "Customer Code";
Main_Customer_ID_Txt.helpText = "Customer Code - list of values available.";
/** 
* This function specifies if the field is 
* a mandatory field.
* @return true
*/
Main_Customer_ID_Txt.isMandatory = function(){       
	return true;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Main_Customer_ID_Txt.transformToModel = function(value){
		return (null != value) ? Trim(value) : null;
}
Main_Customer_ID_Txt.validateOn = [FORM_XPATH + "/RefData/Customers"];
/**
 * This function will be invoked to determine if 
 * the content of Main_Customer_ID_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Main_Customer_ID_Txt.validate = function(){
	var custCode = Services.getValue(Main_Customer_ID_Txt.dataBinding);
	var regExp = new RegExp(/^\d*$/);
	var ec = null;
	var customerCodeDBValidationFlag = Services.getValue("/ds/var/page/customerCodeDBValidationFlag");

	if(customerCodeDBValidationFlag == 0) {
		customerCodeDBValidationFlag = false;
	} else {
		customerCodeDBValidationFlag = true;
	}
	
	if(!regExp.test(custCode)){
		return ErrorCode.getErrorCode("CaseMan_CustomerCodeNotNumeric");
	} else if(custCode.length < 4){
		return ErrorCode.getErrorCode("CaseMan_CustomerCodeNot4Digits");
	} else if(customerCodeDBValidationFlag && Services.getNode(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + custCode + "]") == null){
		return ErrorCode.getErrorCode("CaseMan_CustomerCodeNotExists");
	} else if(customerCodeDBValidationFlag) {
		return null;
	}
}

Main_Customer_ID_Txt.readOnlyOn = [pageMode.dataBinding, Main_Customer_ID_Txt.dataBinding, Main_Customer_Desc_Txt.dataBinding];			
/** 
* This function specifies if the field is 
* a read only field.
* @return boolean
*/
Main_Customer_ID_Txt.isReadOnly = function(event){   	
	
	if(event.getXPath()== Main_Customer_Desc_Txt.dataBinding){ 
		if(Services.getValue(Main_Customer_Desc_Txt.dataBinding)==null||Services.getValue(Main_Customer_Desc_Txt.dataBinding)=="") {
			return false;
		} else {
			return true; 
		}	
	}
	
	if(event.getXPath()==Main_Customer_ID_Txt.dataBinding){
		if(Services.getValue(Main_Customer_ID_Txt.dataBinding)==null||Services.getValue(Main_Customer_ID_Txt.dataBinding)=="") {
			return false;
		}	
		var codeAdaptor = Services.getAdaptorById("Main_Customer_ID_Txt");
		if(codeAdaptor.getValid()){
			return true;
		}
	}
	
    if(Services.getValue(pageMode.dataBinding) == null || Services.getValue(pageMode.dataBinding) == "I"){
    	return false;
    } else {
    	return true;
    }    
}

function CustomerCallBackObject(){};
/**
 * callback handler which gets invoked upon the success 
 * return of the remote invocation.
 * @param [Dom] objDom the reurned domm object from the invocation
 */
CustomerCallBackObject.prototype.onSuccess = function(objDom){
	Services.replaceNode(FORM_XPATH + "/RefData/Customers", objDom);
}
/**
 * callback handler which gets invoked upon the error
 * return of the remote invocation.
 * @param [Exception] exception the resulting exception 
 * from the remote invocation
 */
CustomerCallBackObject.prototype.onError = function(){
	Services.setValue("/ds/var/page/disableNavigation",null);
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

Main_Customer_ID_Txt.logicOn = [Main_Customer_ID_Txt.dataBinding,Customer_Popup_LOV.dataBinding];
/**
* This function adds a logic on the Main_Customer_ID_Txt field 
* with valid Customer Code.
* @param evt
*/
Main_Customer_ID_Txt.logic = function(event){
  	var customerCodeDBValidationFlag = Services.getValue("/ds/var/page/customerCodeDBValidationFlag");
	if(customerCodeDBValidationFlag == 0) {
		customerCodeDBValidationFlag = false;
	} else {
		customerCodeDBValidationFlag = true;
	}
	if(event.getXPath() == Main_Customer_ID_Txt.dataBinding){
		var codeId = Services.getValue(Main_Customer_ID_Txt.dataBinding);
		if(codeId==null||codeId==""){
			Services.setValue(Main_Customer_Desc_Txt.dataBinding,"");
		}else{
			if(IsInteger(codeId) && codeId.length == 4 && /^\d*$/.test(codeId)) {
				Services.setValue(Main_Customer_Desc_Txt.dataBinding,Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + codeId + "]/CustomerName"));
			}else{
				Services.setValue(Main_Customer_Desc_Txt.dataBinding,"");
			}
		}
	}
	if(event.getXPath() == Customer_Popup_LOV.dataBinding){
		var lovSelectedCode = Services.getValue(Customer_Popup_LOV.dataBinding);
		if(lovSelectedCode != null){
			var lovSelectedDesc = Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + lovSelectedCode + "]/CustomerName")
			Services.setValue(Main_Customer_ID_Txt.dataBinding, lovSelectedCode);
			if(IsInteger(lovSelectedCode) && lovSelectedCode.length == 4 && /^\d*$/.test(lovSelectedCode)) {
				Services.setValue(Main_Customer_Desc_Txt.dataBinding,lovSelectedDesc);
			}else{
				Services.setValue(Main_Customer_Desc_Txt.dataBinding,"");
			}
		}
	}
}



Main_Customer_Desc_Txt.tabIndex = 40;
Main_Customer_Desc_Txt.maxLength = 70;
Main_Customer_Desc_Txt.componentName = "Customer Name.";
Main_Customer_Desc_Txt.helpText = "Customer Name.";
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Main_Customer_Desc_Txt.transformToModel = function(value){	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/		
Main_Customer_Desc_Txt.isReadOnly = function(){   
    return true;
}
Main_Customer_Desc_Txt.logicOn = [Main_Customer_ID_Txt.dataBinding];
/**
* This function adds a logic on the Main_Customer_Desc_Txt field 
* @param evt
*/
Main_Customer_Desc_Txt.logic = function(evt){
	var customerCodeDBValidationFlag = Services.getValue("/ds/var/page/customerCodeDBValidationFlag");
	if(customerCodeDBValidationFlag == 0) {
		customerCodeDBValidationFlag = false;
	} else {
		customerCodeDBValidationFlag = true;
	}	
	if(!customerCodeDBValidationFlag){
		return;
	}
}

Main_Date_Received_Cal.tabIndex = 50;
Main_Date_Received_Cal.componentName = "Date Received";
Main_Date_Received_Cal.helpText = "Date tape or disk received.";
/** 
* This function specifies if the field is 
* a mandatory field.
* @return true
*/		
Main_Date_Received_Cal.isMandatory = function(){
	return true;
}
Main_Date_Received_Cal.maxLength = 11; 
/** 
* This function sets the value of the 
* Main_Date_Received_Cal to the default date 
* value of today.
*/		
Main_Date_Received_Cal.setDefault = function(){  
	var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");	
	Services.setValue(Main_Date_Received_Cal.dataBinding, currentDate);
}

/**
 * This function will be invoked to determine if 
 * the content of Main_Date_Received_Cal
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Main_Date_Received_Cal.validate = function(){
	var ec = null;
	var receivedDateValue = Services.getValue(Main_Date_Received_Cal.dataBinding);

 	var todayVal = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");

	if (receivedDateValue > todayVal){
		ec = ErrorCode.getErrorCode("Caseman_dateReceivedInFuture_Msg");
		return ec;
	}    
	return null;
}

Main_Date_Received_Cal.logicOn = [Main_Date_Received_Cal.dataBinding];
/**
* This function adds a logic on the Main_Date_Received_Cal field 
* @param e
*/
Main_Date_Received_Cal.logic = function(e){
	if(e.getXPath() == Main_Date_Received_Cal.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}

Main_Date_To_Operations_Cal.componentName = "Date to Operations";
Main_Date_To_Operations_Cal.helpText = "Date tape or disk passed to Operations.";
/** 
* This function sets the value of the 
* Main_Date_Received_Cal to the default date 
* value of today.
*/		
Main_Date_To_Operations_Cal.setDefault = function(){  
	if(Services.getValue(pageMode.dataBinding) != "U"){
		var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");
		Services.setValue(Main_Date_To_Operations_Cal.dataBinding, currentDate);
		Services.setFocus("Main_Customer_ID_Txt");
	}
}
Main_Date_To_Operations_Cal.tabIndex = 70;
Main_Date_To_Operations_Cal.validateOn = [Main_Date_Received_Cal.dataBinding];
/**
 * This function will be invoked to determine if 
 * the content of Main_Date_To_Operations_Cal
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Main_Date_To_Operations_Cal.validate = function(){
	var ec = null;

	
	var toOperationDateValue = Services.getValue(Main_Date_To_Operations_Cal.dataBinding);
	var todayVal = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");
	
	
	if (toOperationDateValue > todayVal){
		ec = ErrorCode.getErrorCode("Caseman_dateToOperationInFuture_Msg");
		return ec;
	}
	else { 
		var receivedDateValue =  Services.getValue(Main_Date_Received_Cal.dataBinding);		
		if(isValidDate(receivedDateValue)){
			if(toOperationDateValue<receivedDateValue){
				ec = ErrorCode.getErrorCode("Caseman_dateToOperationEarlierReceived_Msg");
				return ec;
			}	
		}		
	}
	return null;
}
Main_Date_To_Operations_Cal.logicOn = [Main_Date_To_Operations_Cal.dataBinding];
/**
* This function adds a logic on the Main_Date_Received_Cal field 
* @param e
*/
Main_Date_To_Operations_Cal.logic = function(e){
	if(e.getXPath() == Main_Date_To_Operations_Cal.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}

Main_Comments_Txt.tabIndex = 100;
Main_Comments_Txt.maxLength = 50;
Main_Comments_Txt.componentName = "Comments";
Main_Comments_Txt.helpText = "Any comments relating to this tape or disk as a whole.";
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Main_Comments_Txt.transformToModel = function(value) {	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/** 
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed before it 
* is displayed by an adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/

Main_Comments_Txt.transformToDisplay = function(value) {	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
Main_Comments_Txt.logicOn = [Main_Comments_Txt.dataBinding];
/**
* This function adds a logic on the Main_Comments_Txt field 
* @param e
*/
Main_Comments_Txt.logic = function(e){
	if(e.getXPath() == Main_Comments_Txt.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}

Main_Date_Returned_Cal.tabIndex = 105;
Main_Date_Returned_Cal.componentName = "Date Returned";
Main_Date_Returned_Cal.helpText = "Date tape or disk returned to the Customer.";
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Main_Date_Returned_Cal.isReadOnly = function(){
	return true;
}
/**
 * This function will be invoked to determine if 
 * the content of Main_Date_Returned_Cal
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Main_Date_Returned_Cal.validate = function(){
	return null;
}
Detail_File_Name_Txt.retrieveOn = [Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Detail_File_Name_Txt.isReadOnly = function(){
	return true;
}

Detail_File_Name_Txt.tabIndex = 140;
Detail_File_Name_Txt.maxLength = 10;
Detail_File_Name_Txt.helpText = "Name of file, eg. 1500JG.123.";
Detail_Number_Of_Records_Txt.componentName = "Number of Records";
Detail_Number_Of_Records_Txt.helpText = "Number of records in the file.";
Detail_Number_Of_Records_Txt.mandatoryOn = [Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a mandatory field.
* @return true
*/
Detail_Number_Of_Records_Txt.isMandatory = function(){
	return true;
}
Detail_Number_Of_Records_Txt.tabIndex = 150;
Detail_Number_Of_Records_Txt.maxLength = 5;
Detail_Number_Of_Records_Txt.retrieveOn = [Main_Tape_Files_Grid.dataBinding];
Detail_Number_Of_Records_Txt.validateOn = [Main_Tape_Files_Grid.dataBinding];
/**
 * This function will be invoked to determine if 
 * the content of Detail_Number_Of_Records_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Detail_Number_Of_Records_Txt.validate = function(){	
    var noOfRecords = Services.getValue(Detail_Number_Of_Records_Txt.dataBinding); 
    if(noOfRecords.length==0) {
    	return null;
    }	
    if(isNaN(noOfRecords)) {
    	 return ErrorCode.getErrorCode("Caseman_noOfRecordNotNumber_Msg"); 
    }	 
    if(noOfRecords==0) {
    	return ErrorCode.getErrorCode("Caseman_NumberOfRecordsZero_Msg");
    }	
    if(isNonZeroInteger(noOfRecords)) {
    	return null;
    } else {
    		var pattern = new RegExp(/^[1-9]*$/);
    		if(!pattern.test(noOfRecords)) return ErrorCode.getErrorCode("Caseman_NumberOfRecordsNotWholeNumber_Msg");    																	      	    	
    }
}
Detail_Number_Of_Records_Txt.logicOn = [Detail_Number_Of_Records_Txt.dataBinding];
/**
* This function adds a logic on the Main_Comments_Txt field 
* @param e
*/
Detail_Number_Of_Records_Txt.logic = function(e){
	if(e.getXPath() == Detail_Number_Of_Records_Txt.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}
Detail_Number_Of_Records_Txt.enableOn = [TAPE_PATH + "/TapeFiles"];
/** 
* This function specifies if the field is 
* enabled field.
* @return boolean
*/	
Detail_Number_Of_Records_Txt.isEnabled = function(){
	var flag = false;
	if(Services.countNodes(FILE_PATH) > 0){
		flag = true;
	}
	return flag;
	
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Detail_Number_Of_Records_Txt.transformToModel = function(value){
	if(value==null) {
		return null;
	}
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') break;
		value = value.substring(1);			
	}
	return value;
}

Detail_Warrant_Fees_Cur.tabIndex = 160;
Detail_Warrant_Fees_Cur.helpText = "Currency symbol of Warrant fees";
Detail_Warrant_Fees_Cur.maxLength = 3;
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Detail_Warrant_Fees_Cur.isReadOnly = function(){
	return true;
}

Detail_Warrant_Fees_Txt.tabIndex = 170;
Detail_Warrant_Fees_Txt.helpText = "Amount of Warrant fees.";
Detail_Warrant_Fees_Txt.maxLength = 9;
Detail_Warrant_Fees_Txt.retrieveOn = [Main_Tape_Files_Grid.dataBinding];
Detail_Warrant_Fees_Txt.validateOn = [Main_Tape_Files_Grid.dataBinding];

/**
 * This function will be invoked to determine if 
 * the content of Detail_Warrant_Fees_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Detail_Warrant_Fees_Txt.validate = function(){	
	var warrantFeesValue = Services.getValue(Detail_Warrant_Fees_Txt.dataBinding);
	if(isNaN(warrantFeesValue)){
		return ErrorCode.getErrorCode("Caseman_MoneyNotNumeric_Msg");
	}
	if(warrantFeesValue<0) {
		return ErrorCode.getErrorCode("Caseman_MoneyLessThanZero_Msg");
	}	
    if(isValidMoney(warrantFeesValue)) {
    	return null;
    } else {
    	return ErrorCode.getErrorCode("Caseman_invalidMoneyFormat_Msg");
    }	
}
Detail_Warrant_Fees_Txt.componentName = "Warrant Fees";
Detail_Warrant_Fees_Txt.readOnlyOn = [Detail_File_Name_Txt.dataBinding, Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a read only field.
* @return boolean
*/
Detail_Warrant_Fees_Txt.isReadOnly = function(){
	var fileName = Services.getValue(Detail_File_Name_Txt.dataBinding);
    if(fileName == null) {
    	return true
    }
	var regExp = new RegExp(/[W][ET]/);	
	var fileNameAdaptor = Services.getAdaptorById("Detail_File_Name_Txt");
	if(fileNameAdaptor.getValid() && regExp.test(fileName)) {
		return false;
	} else {
		return true;
	}
}
Detail_Warrant_Fees_Txt.mandatoryOn = [Detail_File_Name_Txt.dataBinding, Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a mandatory field.
* @return boolean
*/	
Detail_Warrant_Fees_Txt.isMandatory = function(){
    var fileName = Services.getValue(Detail_File_Name_Txt.dataBinding);   
	var regExp = new RegExp(/[W][ET]/);	
	var fileNameAdaptor = Services.getAdaptorById("Detail_File_Name_Txt");
	if(fileNameAdaptor.getValid() && regExp.test(fileName)) {
		return true;
	} else {
		return false;
	}
}
Detail_Warrant_Fees_Txt.logicOn = [Detail_Warrant_Fees_Txt.dataBinding];
/**
* This function adds a logic on the Main_Comments_Txt field 
* @param e
*/
Detail_Warrant_Fees_Txt.logic = function(e){
	if(e.getXPath() == Detail_Warrant_Fees_Txt.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Detail_Warrant_Fees_Txt.transformToModel = function(value){
	
	if(value==null) {
		return null;
	}	
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') {
			break;
		}	
		value = value.substring(1);			
	}
	if(value=="") {
		return null;
	}	
	if(/^\d*$/.test(value)){
		value = value + ".00";
		return value;
	}
	var regExp = new RegExp(/^(\.)(\d\d)$/);
	if(regExp.test(value)){
		value = "0"+value;
		return value;
	}	
	regExp = new RegExp(/^(\.)(\d)$/);
	if(regExp.test(value)){
		value = "0"+value+"0";
		return value;
	}	
	regExp = new RegExp(/^(\d)*(\.)$/);
	if(regExp.test(value)){
		value = value + "00";
		return value;
	}
	regExp = new RegExp(/^(\d)*(\.)(\d)$/);
	if(regExp.test(value)){
		value = value + "0";
		return value;
	}	
	return value;
}
/** 
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed before it 
* is displayed by an adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Detail_Warrant_Fees_Txt.transformToDisplay = function(value){
	
	if(value==null) {
		return null;
	}	
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') {
			break;
		}	
		value = value.substring(1);			
	}
	if(value=="") {
		return null;
	}	
	if(/^\d*$/.test(value)){
		value = value + ".00";
		return value;
	}
	var regExp = new RegExp(/^(\.)(\d\d)$/);
	if(regExp.test(value)){
		value = "0"+value;
		return value;
	}	
	regExp = new RegExp(/^(\.)(\d)$/);
	if(regExp.test(value)){
		value = "0"+value+"0";
		return value;
	}	
	regExp = new RegExp(/^(\d)*(\.)$/);
	if(regExp.test(value)){
		value = value + "00";
		return value;
	}
	regExp = new RegExp(/^(\d)*(\.)(\d)$/);
	if(regExp.test(value)){
		value = value + "0";
		return value;
	}	
	return value;
}
Detail_Comments_Zoom.helpText = "Any comments relating to this file, maximum 80 characters allowed.";
Detail_Comments_Zoom.componentName = "Tape File Comments";
Detail_Comments_Zoom.retrieveOn = [Main_Tape_Files_Grid.dataBinding];
Detail_Comments_Zoom.tabIndex = 180;
Detail_Comments_Zoom.maxLength = 80;
Detail_Comments_Zoom.logicOn = [Detail_Comments_Zoom.dataBinding];
/**
* This function adds a logic on the Main_Comments_Txt field 
* @param e
*/
Detail_Comments_Zoom.logic = function(e){
	if(e.getXPath() == Detail_Comments_Zoom.dataBinding){
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
	}
}
/** 
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed before it 
* is displayed by an adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Detail_Comments_Zoom.transformToDisplay = function(value) {	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Detail_Comments_Zoom.transformToModel = function(value) {	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
Detail_Comments_Zoom.enableOn = [TAPE_PATH + "/TapeFiles"];
/** 
* This function specifies if the field is 
* enabled field.
* @return boolean
*/	
Detail_Comments_Zoom.isEnabled = function(){
	var flag = false;
	if(Services.countNodes(FILE_PATH) > 0){
		flag = true;
	}
	return flag;
}
Detail_Comments_Zoom.validateOn = [Main_Tape_Files_Grid.dataBinding];
/**
 * This function will be invoked to determine if 
 * the content of Detail_Comments_Zoom
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Detail_Comments_Zoom.validate = function(){
	var comments = Services.getValue(Detail_Comments_Zoom.dataBinding);
	
	if( comments != null && comments.length>80) { 
		return ErrorCode.getErrorCode("Caseman_CommentsTooLarge_Msg");
	} else {
		return null;
	}	
}


Detail_Status_Txt.retrieveOn = [Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Detail_Status_Txt.isReadOnly = function(){
	return true;
}
Detail_Status_Txt.logicOn = [Main_Tape_Files_Grid.dataBinding,Detail_File_Name_Txt.dataBinding];
/**
* This function adds a logic on the Detail_Status_Txt
* to check if the value of the status is invalid or null 
*/
Detail_Status_Txt.logic = function(){
		var TapeFileStatus = Services.getValue(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/TapeFileStatus");
		if(TapeFileStatus != null && TapeFileStatus != "") {
		 	var status = Services.getValue(Detail_Status_Txt.dataBinding);
			var grid = Services.getValue(Main_Tape_Files_Grid.dataBinding);
			var checkStatus = Services.getValue("/ds/var/page/checkStatus");
			checkStatus = isTrueOrFalse(checkStatus);
			if(checkStatus  && status == null && grid != null ) {
					var fileName = Services.getValue(Detail_File_Name_Txt.dataBinding);
					var msg = ErrorCode.getErrorCode("CaseMan_InvalidStatus_Msg").getMessage();
					msg = msg + fileName ; 
					Services.setTransientStatusBarMessage(msg);
			}
		}
}

Detail_Status_Txt.tabIndex = 190;
Detail_Status_Txt.maxLength = 7;

// Add File
Add_File_Name_Txt.componentName = "File Name";
Add_File_Name_Txt.helpText = "Name of file, eg. 1500JG.123.";
/** 
* This function specifies if the field is 
* a mandatory field.
* @return true
*/	
Add_File_Name_Txt.isMandatory = function(){
	return true;
}
Add_File_Name_Txt.maxLength = 10;
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Add_File_Name_Txt.isTemporary = function(){
	return true;
}
/**
 * This function will be invoked to determine if 
 * the content of Add_File_Name_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Add_File_Name_Txt.validate = function(e){
	var fileNameValue = Services.getValue(Add_File_Name_Txt.dataBinding);
	if(fileNameValue == null||fileNameValue.length==0) {
		return null;
	}	
	if(fileNameValue.length!=10) {
		return ErrorCode.getErrorCode("Caseman_FileNameNot10Characters_Msg");
	} else {
		var last3Characters  = fileNameValue.substring(7);
		var first4Characters = fileNameValue.substring(0,4);
		var numericPattern=new RegExp(/^[0-9]*$/);
        if(!numericPattern.test(last3Characters)||!numericPattern.test(first4Characters)) {
        	return ErrorCode.getErrorCode("Caseman_invalidFirst4andLast3Characters_Msg");  
        }	      
	}
	if(isValidFileName(fileNameValue)) 	{
		var first4Characters = fileNameValue.substring(0,4);
		if(first4Characters!=Services.getValue(Main_Customer_ID_Txt.dataBinding)) {
			 return ErrorCode.getErrorCode("Caseman_FileNamePrefixInvalid_Msg");
		}
	} else {
		return ErrorCode.getErrorCode("Caseman_invalidFileName_Msg");
	}		
	
	var params = new ServiceParams();		
	params.addSimpleParameter("FileName", fileNameValue);	
	var callbackObj = new uniqueTapeFileCallBackObject();
	Services.callService("getTapeFile",params,callbackObj,false);
	
	var FNode = Services.getNode(FILE_PATH + "[./FileName = '" + fileNameValue + "']")
	var FName = Services.getNode(FORM_XPATH+"/Temp/TapeFiles/TapeFile['0']/FileName");
	if(FName != null || FNode !=null ){
		return ErrorCode.getErrorCode("CaseMan_FileNameNotUnique");
	}
	
}

Add_File_Name_Txt.logicOn = [Add_File_Name_Txt.dataBinding];
/**
* This function adds a logic on the Add_File_Name_Txt
* @param e
*/
Add_File_Name_Txt.logic = function(e){
		if(e.getXPath() == Add_File_Name_Txt.dataBinding){
			Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",true);
	    }
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Add_File_Name_Txt.transformToModel = function(value) {
	return (null != value) ? Trim(value.toUpperCase()) : null;
}


Add_Number_Of_Records_Txt.componentName = "Number of records";
Add_Number_Of_Records_Txt.helpText = "Number of records in the file.";
Add_Number_Of_Records_Txt.maxLength = 5;
/** 
* This function specifies if the field is 
* a mandatory field.
* @return true
*/	
Add_Number_Of_Records_Txt.isMandatory = function(){
	return true;
}
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Add_Number_Of_Records_Txt.isTemporary = function(){
	return true;
}
Add_Number_Of_Records_Txt.logicOn = [Add_Number_Of_Records_Txt.dataBinding];
/**
* This function adds a logic on the Add_Number_Of_Records_Txt
* @param e
*/
Add_Number_Of_Records_Txt.logic = function(e){
		if(e.getXPath() == Add_Number_Of_Records_Txt.dataBinding){
			Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",true);
	    }
}
/**
 * This function will be invoked to determine if 
 * the content of Add_Number_Of_Records_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Add_Number_Of_Records_Txt.validate = function(){
    var noOfRecords = Services.getValue(Add_Number_Of_Records_Txt.dataBinding);
    noOfRecords = Trim(noOfRecords);
    //Services.setValue(Add_Number_Of_Records_Txt.dataBinding, noOfRecords);
    if(noOfRecords.length==0) { 
    	return null;
    }	
    if(isNaN(noOfRecords)) {
    	return ErrorCode.getErrorCode("Caseman_noOfRecordNotNumber_Msg");
    }	
    if(noOfRecords==0) {
    	return ErrorCode.getErrorCode("Caseman_NumberOfRecordsZero_Msg");
    }	
    if(isNonZeroInteger(noOfRecords)) {
    	return null;
    } else {
    	var pattern = new RegExp(/^[1-9]*$/);
    	if(!pattern.test(noOfRecords)) {
    		return ErrorCode.getErrorCode("Caseman_NumberOfRecordsNotWholeNumber_Msg");
    	}	
        return ErrorCode.getErrorCode("Caseman_noOfRecordNotNONZeroDigits_Msg");   	
    }
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Add_Number_Of_Records_Txt.transformToModel = function(value){
	if(value==null) {
		return null;
	}	
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') {
			break;
		}	
		value = value.substring(1);			
	}
	return value;
}
Add_Warrant_Fees_Cur.helpText = "Currency symbol of Warrant fees";
Add_Warrant_Fees_Cur.maxLength = 3;
/** 
* This function set the default currency value
* for the field Add_Warrant_Fees_Cur
*/
Add_Warrant_Fees_Cur.setDefault = function(){
	Services.setValue(Add_Warrant_Fees_Cur.dataBinding,"\xA3");
}
/** 
* This function specifies if the field is 
* a read only field.
* @return true
*/
Add_Warrant_Fees_Cur.isReadOnly = function(){   
  	return true;
}

Add_Warrant_Fees_Txt.componentName = "Warrant fees";
Add_Warrant_Fees_Txt.helpText = "Amount of Warrant fees.";
Add_Warrant_Fees_Txt.maxLength = 9;

Add_Warrant_Fees_Txt.mandatoryOn = [Add_File_Name_Txt.dataBinding];
/** 
* This function specifies if the field is 
* a mandatory field.
* @return boolean
*/	
Add_Warrant_Fees_Txt.isMandatory = function(){
	var fileName = Services.getValue(Add_File_Name_Txt.dataBinding);   
	var regExp = new RegExp(/[W][ET]/);	
	var fileNameAdaptor = Services.getAdaptorById("Add_File_Name_Txt");
	if(fileNameAdaptor.getValid() && regExp.test(fileName)) {
		return true;
	} else {
		return false;
	}
}

Add_Warrant_Fees_Txt.logicOn = [Add_Warrant_Fees_Txt.dataBinding];
/**
* This function adds a logic on the Add_Warrant_Fees_Txt
* @param e
*/
Add_Warrant_Fees_Txt.logic = function(e){
		if(e.getXPath() == Add_Warrant_Fees_Txt.dataBinding){
			Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",true);
	    }
}
/**
 * This function will be invoked to determine if 
 * the content of Add_Warrant_Fees_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */

Add_Warrant_Fees_Txt.validate = function(){
	var warrantFeesValue = Services.getValue(Add_Warrant_Fees_Txt.dataBinding);
	if(isNaN(warrantFeesValue)) {
		return ErrorCode.getErrorCode("Caseman_MoneyNotNumeric_Msg");	
	}	
	if(warrantFeesValue<0) {
		return ErrorCode.getErrorCode("Caseman_MoneyLessThanZero_Msg");	
	} else if(isValidMoney(warrantFeesValue)) {
		return null;
	} else {
		return ErrorCode.getErrorCode("Caseman_invalidMoneyFormat_Msg");
	}	
}
/** 
* This functions is used to configure adaptors to be 
* excluded from Form Validation
* @return true
*/
Add_Warrant_Fees_Txt.isTemporary = function(){
	return true;
}
Add_Warrant_Fees_Txt.readOnlyOn = [Add_File_Name_Txt.dataBinding];
/** 
* This function specifies if the field is 
* a read only field.
* @return boolean
*/	
Add_Warrant_Fees_Txt.isReadOnly = function(){	
    var fileName = Services.getValue(Add_File_Name_Txt.dataBinding);   
	var regExp = new RegExp(/[W][ET]/);	
	var fileNameAdaptor = Services.getAdaptorById("Add_File_Name_Txt");
	if(fileNameAdaptor.getValid() && regExp.test(fileName)) {
		return false;
	} else {
		return true;
	}
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Add_Warrant_Fees_Txt.transformToModel = function(value){
	
	if(value==null) {
		return null;
	}	
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') {
			break;
		}	
		value = value.substring(1);			
	}
	if(value=="") {
		return null;
	}	
	if(/^\d*$/.test(value)){
		value = value + ".00";
		return value;
	}
	var regExp = new RegExp(/^(\.)(\d\d)$/);
	if(regExp.test(value)){
		value = "0"+value;
		return value;
	}	
	regExp = new RegExp(/^(\.)(\d)$/);
	if(regExp.test(value)){
		value = "0"+value+"0";
		return value;
	}		
	regExp = new RegExp(/^(\d)*(\.)$/);
	if(regExp.test(value)){
		value = value + "00";
		return value;
	}
	regExp = new RegExp(/^(\d)*(\.)(\d)$/);
	if(regExp.test(value)){
		value = value + "0";
		return value;
	}	
	return value;
}
/** 
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed before it 
* is displayed by an adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Add_Warrant_Fees_Txt.transformToDisplay = function(value){
	
	if(value==null) {
		return null;
	}	
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') {
			break;
		}	
		value = value.substring(1);			
	}
	if(value=="") {
		return null;
	}	
	if(/^\d*$/.test(value)){
		value = value + ".00";
		return value;
	}
	var regExp = new RegExp(/^(\.)(\d\d)$/);
	if(regExp.test(value)){
		value = "0"+value;
		return value;
	}	
	regExp = new RegExp(/^(\.)(\d)$/);
	if(regExp.test(value)){
		value = "0"+value+"0";
		return value;
	}		
	regExp = new RegExp(/^(\d)*(\.)$/);
	if(regExp.test(value)){
		value = value + "00";
		return value;
	}
	regExp = new RegExp(/^(\d)*(\.)(\d)$/);
	if(regExp.test(value)){
		value = value + "0";
		return value;
	}	
	return value;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Add_Comments_Zoom.transformToModel = function(value) {	
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
Add_Comments_Zoom.helpText = "Any comments relating to this file, maximum 80 characters allowed.";
Add_Comments_Zoom.maxLength = 80;
Add_Comments_Zoom.logicOn = [Add_Comments_Zoom.dataBinding];
/**
* This function adds a logic on the Add_Comments_Zoom field
* @param e
*/
Add_Comments_Zoom.logic = function(e){
		if(e.getXPath() == Add_Comments_Zoom.dataBinding){
			Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",true);
	    }
}
/**
 * This function will be invoked to determine if 
 * the content of Add_Comments_Zoom
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Add_Comments_Zoom.validate = function(){
	var comments = Services.getValue(Add_Comments_Zoom.dataBinding);
	if(comments!= null && comments.length>80) {
		return ErrorCode.getErrorCode("Caseman_CommentsTooLarge_Msg");
	} else {
		return null;
	}	
}
/**********************************************************************************************************************
************************************************ BUTTON FIELD DEFINITIONS *********************************************
**********************************************************************************************************************/

function Main_Query_Btn() {};

function Query_Cancel_Btn() {};
Query_Cancel_Btn.helpText="Close without selecting.";
Query_Cancel_Btn.tabIndex = 120;
/**
 Binding Actions to Query_Cancel_Btn
 */
Query_Cancel_Btn.actionBinding = function(){
	resetQueryGrid();
	clearQueryFileds();   
	var msg = ErrorCode.getErrorCode("CaseMan_QueryCancelled_Msg").getMessage();
	Services.setTransientStatusBarMessage(msg);
	var fc = FormController.getInstance();	
	fc.hideFormExtensionPopup("Query_popup");	
	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);	
	Services.setFocus("Main_Customer_ID_Txt");
}

function Query_Search_Btn() {};
Query_Search_Btn.helpText="Search for Tapes / Tape Files.";
Query_Search_Btn.tabIndex = 80;
/**
 Binding Actions to Query_Search_Btn
  */
Query_Search_Btn.actionBinding = function(){
   	var invalidFlds = 0;  
    var libNumber = Services.getAdaptorById("Query_Library_Number_Txt");
    var custCode  = Services.getAdaptorById("Query_Customer_ID_Txt");
    var custName  = Services.getAdaptorById("Query_Customer_Desc_Txt");
    var dateRecv  = Services.getAdaptorById("Query_Date_Received_Txt");
    var dateRetr  = Services.getAdaptorById("Query_Date_Returned_Txt");
    var fileName  = Services.getAdaptorById("Query_Tape_File_Name_Txt");
    
  
    if(libNumber!=null&&!libNumber.getValid()){
    	Services.setFocus("Query_Library_Number_Txt");
    	invalidFlds++;    
    } else if(custCode!=null&&!custCode.getValid()){
    	Services.setFocus("Query_Customer_ID_Txt");
    	invalidFlds++;
    } else if(custName!=null&&!custName.getValid()){
    	Services.setFocus("Query_Customer_Desc_Txt");
    	invalidFlds++;
    } else if(dateRecv!=null&&!dateRecv.getValid()){
    	Services.setFocus("Query_Date_Received_Txt");
    	invalidFlds++;
    } else if(dateRetr!=null&&!dateRetr.getValid()){
    	Services.setFocus("Query_Date_Returned_Txt");
    	invalidFlds++;
    } else if(fileName!=null&&!fileName.getValid()){
    	Services.setFocus("Query_Tape_File_Name_Txt");
    	invalidFlds++;
    } else if(isEmptySearch()) {
    		var msg = ErrorCode.getErrorCode("CaseMan_EmptySearch_Msg").getMessage();
		  	Services.setTransientStatusBarMessage(msg);
		  	Services.setFocus("Query_Library_Number_Txt");  
    }else {      	 // form is valid
    	
       	var newDOM = XML.createDOM(null, null, null);		
        
		var mcNode = Services.getNode(Query_XPATH);
		if(mcNode == null){
			Services.setValue(Query_XPATH,"");
			mcNode = Services.getNode(Query_XPATH);
		}
		newDOM.appendChild(mcNode);
		queryDom = newDOM;
	Services.startTransaction();		
		resetQueryGrid();
		Services.setValue(GRID_PAGE_NUMBER,1);
	Services.endTransaction();
		var checkSize = GRID_PAGE_SIZE + 1;
		executeSummSearch(newDOM,checkSize,Services.getValue(GRID_PAGE_NUMBER)); 
		Services.setFocus("Query_Library_Number_Txt");
   }
}
function Main_Delete_Btn() {} ;

Main_Delete_Btn.tabIndex = 210;
Main_Delete_Btn.enableOn = [pageMode.dataBinding];
/** 
* This function specifies if Main_Delete_Btn 
* is enabled
* @return boolean
*/	
Main_Delete_Btn.isEnabled = function(){
	var EnableFlag = true;
	if(Services.getValue(pageMode.dataBinding) == null || Services.getValue(pageMode.dataBinding) == "I"){
		EnableFlag = false;
	}
	return EnableFlag;
}
/**
 Binding Actions to Main_Delete_Btn
*/
Main_Delete_Btn.actionBinding = function(){    
	var inValidFlds = FormController.getInstance().validateForm(true);
	if(inValidFlds.length == 0){		
			var msg = ErrorCode.getErrorCode("CaseMan_ConfirmDeletion").getMessage();
			Services.showDialog(
				StandardDialogTypes.OK_CANCEL,
				DeleteTapeDialogCallBack,
				msg,
				""
		);	 		
	
	}
}
/**
	key bindings for Main_Delete_Btn
*/
Main_Delete_Btn.additionalBindings = {
      eventBinding: {
            keys: [{ key: Key.CHAR_D, element: "LogReceivedTapes", alt: true }]
      }
};

function Main_Save_Btn() {};
Main_Save_Btn.tabIndex = 200;
Main_Save_Btn.enableOn = [Main_Customer_ID_Txt.dataBinding];
/** 
* This function specifies if Main_Save_Btn
* is enabled
* @return boolean
*/	
Main_Save_Btn.isEnabled = function(){
	var EnableFlag = true;
	if(Services.getValue(Main_Customer_ID_Txt.dataBinding) == null || Services.getValue(Main_Customer_ID_Txt.dataBinding) == ""){
		EnableFlag = false;
	}
	return EnableFlag;
}
/**
 Binding Actions to Main_Save_Btn
*/
Main_Save_Btn.actionBinding = function(){
			var callbackObj = new SaveCallBackObject() ;
			saveForm(callbackObj);
	
}

function Query_Clear_Btn() {};
Query_Clear_Btn.helpText="Clear search fields.";
Query_Clear_Btn.tabIndex = 110;
/**
 Binding Actions to Query_Clear_Btn
  */
Query_Clear_Btn.actionBinding = function(){
	resetQueryGrid();
	clearQueryFileds();
};
/**
	 key bindings for Main_Delete_Btn
*/
Query_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "Query_popup", alt: true }            	   
            	  ]
      }
};

function Query_Select_Btn() {};
Query_Select_Btn.helpText = "Request selection of a Tape.";
Query_Select_Btn.tabIndex = 100;
/**
 Binding Actions to Query_Select_Btn
*/
Query_Select_Btn.actionBinding = function(){   
	Services.setValue("/ds/var/page/searchResultFlag",true);
	Services.setValue(pageMode.dataBinding, "U");
	var select = Services.getNode(GRID_XPATH + "/ReceivedTape[./SurrogateKey="+Query_Tapes_Grid.dataBinding+"]");
	
	if(select!=null){
		Services.setValue("/ds/var/page/customerCodeDBValidationFlag",false);	
		Services.replaceNode(TAPE_PATH, select);
		var libraryNumber = Services.getValue(TAPE_PATH + "/LibraryNumber" );
		executeSearch(libraryNumber);
		
	}
}
/**
	 key bindings for Main_Delete_Btn
*/
Query_Select_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [ {element: "Query_Tapes_Grid"} ],
            keys: []
      }
}
Query_Select_Btn.enableOn = [GRID_XPATH];
/** 
* This function specifies if Query_Select_Btn
* is enabled
* @return boolean
*/
Query_Select_Btn.isEnabled = function(){
	var flag = false;
	if(Services.countNodes(GRID_XPATH+"/ReceivedTape") > 0){
		flag = true;
	}
	return flag;
	
}

function Query_Customer_LOV_Btn() {};
Query_Customer_LOV_Btn.helpText = "Request LOV for Customer";
Query_Customer_LOV_Btn.tabIndex = 40;
/**
 Binding Actions to Query_Customer_LOV_Btn
*/
Query_Customer_LOV_Btn.actionBinding = function(){
	Services.setValue(Query_Customer_Popup_LOV.dataBinding,null);
	FormController.getInstance().showFormExtensionPopup("Query_Customer_Popup_LOV");
};
function Main_Customer_LOV_Btn() {};
Main_Customer_LOV_Btn.helpText = "Request LOV for Customer";
/**
 Binding Actions to Main_Customer_LOV_Btn
*/
Main_Customer_LOV_Btn.actionBinding = function(){
	Services.setValue(Customer_Popup_LOV.dataBinding,null);
	FormController.getInstance().showFormExtensionPopup("Customer_Popup_LOV");
};
Main_Customer_LOV_Btn.enableOn = [Main_Customer_Desc_Txt.dataBinding];
/** 
* This function specifies if Main_Customer_LOV_Btn
* is enabled
* @return boolean
*/
Main_Customer_LOV_Btn.isEnabled = function(){
	if(Services.getValue(Main_Customer_Desc_Txt.dataBinding) != null && Services.getValue(Main_Customer_Desc_Txt.dataBinding) != ""){
		return false;
	}
	return true;
};

Main_Customer_LOV_Btn.tabIndex = 40;
function Main_Remove_Btn() {};
Main_Remove_Btn.helpText = "Request remove a Tape File.";
Main_Remove_Btn.enableOn = [Main_Tape_Files_Grid.dataBinding];
/** 
* This function specifies if Main_Remove_Btn
* is enabled
* @return boolean
*/
Main_Remove_Btn.isEnabled = function(){
	if(Services.getValue(Main_Tape_Files_Grid.dataBinding)==null
			||Services.getValue(Main_Tape_Files_Grid.dataBinding)==""){
		return false;
	}
	else return true;
	
};

Main_Remove_Btn.tabIndex = 130;
/**
 Binding Actions to Main_Remove_Btn
*/
Main_Remove_Btn.actionBinding = function(){  	
	var msg = ErrorCode.getErrorCode("CaseMan_ConfirmRemoval").getMessage();
	var filePathNodes = Services.getNodes(FILE_PATH);
	if(filePathNodes != null && filePathNodes.length != 0){
		Services.showDialog(
			StandardDialogTypes.OK_CANCEL,
			DeleteFileDialogCallBack,
			msg,
			""
		);		
	}
};
function Add_Cancel_Btn() {};
Add_Cancel_Btn.helpText = "Close the pop-up.";
/**
 Binding Actions to Add_Cancel_Btn
*/
Add_Cancel_Btn.actionBinding = function(){
  if( Services.getValue(Add_File_Name_Txt.dataBinding)=="" &&
      Services.getValue(Add_Number_Of_Records_Txt.dataBinding)=="" &&
      Services.getValue(Add_Warrant_Fees_Txt.dataBinding)==""   	
  	 ) {
  	 		Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",false);
  	 }
  var exitPopupWithoutSavingFlag = Services.getValue("/ds/var/page/exitPopupWithoutSavingFlag");
  if(exitPopupWithoutSavingFlag == 0) {
  		exitPopupWithoutSavingFlag = false;
  } else {
		exitPopupWithoutSavingFlag = true;
  }
  if(exitPopupWithoutSavingFlag){
		Services.showDialog(
			StandardDialogTypes.YES_NO_CANCEL,
			PopupCloseDialogCallBack,
			"Unsaved changes exist. Click Yes to save changes and continue; "+
			"click No to discard and continue; click Cancel to return to existing screen.",
			""
			);
  }  else{
	FormController.getInstance().hideFormExtensionPopup("Add_popup");
	Services.setValue("/ds/var/page/addPopupRaisedFlag", false);
	clearAddFields();
  }
}	

function Add_Clear_Btn() {};
Add_Clear_Btn.helpText = "Clear fields.";
/**
 Binding Actions to Add_Clear_Btn
*/
Add_Clear_Btn.actionBinding = function(){
	clearAddFields();
}
/**
	 key bindings for Add_Clear_Btn
*/
Add_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "Add_popup", alt: true }            	   
            	  ]
      }
}
function Main_Clear_Btn() {};

Main_Clear_Btn.tabIndex = 220;
/**
 Binding Actions to Main_Clear_Btn
*/
Main_Clear_Btn.actionBinding = function(){	
	var saveBtn = Services.getAdaptorById("Main_Save_Btn");
	var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
	if(exitWithoutSavingFlag == 0) {
		exitWithoutSavingFlag = false;
	} else {
		exitWithoutSavingFlag = true;
	}
	if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
		var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
		Services.showDialog(
			StandardDialogTypes.YES_NO_CANCEL,
			ClearDialogCallBack,
			msg,
			""
		);		 
	}
	
	else{
		clearMainScreen();		
	}
}
/**
	 key bindings for Main_Clear_Btn
*/
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "LogReceivedTapes", alt: true }            	   
            	  ]
      }
}
function Main_Zoom_Btn(){};
/**
 Binding Actions to Main_Zoom_Btn
*/
Main_Zoom_Btn.actionBinding = function(){
	var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
	queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);
	
	var addPopupRaisedFlag = Services.getValue("/ds/var/page/addPopupRaisedFlag");
	addPopupRaisedFlag = isTrueOrFalse(addPopupRaisedFlag);
	
	if(!queryPopupRaisedFlag && !addPopupRaisedFlag){

		 var zoom = Services.getAdaptorById("Detail_Comments_Zoom");
		 if(zoom.getEnabled()){
		 	Services.setValue(
		 		DataModel.DEFAULT_TMP_BINDING_ROOT + "/Detail_Comments_Zoom_textarea",
		 			 Services.getValue(Detail_Comments_Zoom.dataBinding)); 
		 	
			Services.dispatchEvent("Detail_Comments_Zoom_popup", PopupGUIAdaptor.EVENT_RAISE);
			
		 }
	} else if(addPopupRaisedFlag){
			var zoom = Services.getAdaptorById("Add_Comments_Zoom");
         	Services.setValue(
		 		DataModel.DEFAULT_TMP_BINDING_ROOT + "/Add_Comments_Zoom_textarea",
		 			 Services.getValue(Add_Comments_Zoom.dataBinding)); 
		 	
			Services.dispatchEvent("Add_Comments_Zoom_popup", PopupGUIAdaptor.EVENT_RAISE);
			
	}
	
};
/**
	 key bindings for Main_Zoom_Btn
*/
Main_Zoom_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_Z, element: "LogReceivedTapes", alt: true },
            	   { key: Key.CHAR_Z, element: "Add_popup", alt: true }
            	  ]
      }
};
function Main_Back_Btn(){};     
Main_Back_Btn.tabIndex = 230;
/**
 Binding Actions to Main_Back_Btn
  */
Main_Back_Btn.actionBinding = function(){
   var saveBtn = Services.getAdaptorById("Main_Save_Btn");
   var exitWithoutSavingFlag = Services.getValue("/ds/var/page/exitWithoutSavingFlag");
	if(exitWithoutSavingFlag == 0) {
		exitWithoutSavingFlag = false;
	} else {
		exitWithoutSavingFlag = true;
	}
	
   if(exitWithoutSavingFlag == true && saveBtn.getEnabled()){
		var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
		Services.showDialog(
			StandardDialogTypes.YES_NO_CANCEL,
			BackDialogCallBack,
			msg,
			""
		);
	} else {
		Services.navigate("MainMenu");		
	}	
} ;  

function Main_Add_Btn() {};
Main_Add_Btn.helpText = "Request add a new Tape File.";
Main_Add_Btn.tabIndex = 120;
Main_Add_Btn.enableOn = [Main_Customer_ID_Txt.dataBinding, FORM_XPATH + "/RefData/Customers"];
/** 
* This function specifies if Main_Add_Btn
* is enabled
* @return boolean
*/
Main_Add_Btn.isEnabled = function(){
    var custCodeAdaptor = Services.getAdaptorById("Main_Customer_ID_Txt");
    if(custCodeAdaptor.getValid()&&
    	Services.getValue(Main_Customer_ID_Txt.dataBinding) != null&&
    	Services.getValue(Main_Customer_ID_Txt.dataBinding) != ""){
    	return true;
    } else {
    	return false;
    }	
	var EnableFlag = true;
	if(Services.getValue(Main_Customer_ID_Txt.dataBinding) == null 
			|| Services.getValue(Main_Customer_ID_Txt.dataBinding) == "") 	{
		EnableFlag = false;
	}
	return EnableFlag;
}
/**
 Binding Actions to Main_Add_Btn
*/
Main_Add_Btn.actionBinding = function(){	
	var fc = FormController.getInstance();
	fc.showFormExtensionPopup("Add_popup");	

	Services.startTransaction();
		Services.setValue("/ds/var/page/addPopupRaisedFlag", true);
		Services.setValue("/ds/var/page/checkStatus", false);
		clearAddFields();
		Services.setValue(Add_File_Name_Txt.dataBinding, Services.getValue(Main_Customer_ID_Txt.dataBinding));
		var fileNameAdaptor = Services.getAdaptorById("Add_File_Name_Txt");
		fileNameAdaptor.setValid(true);
		Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",false);
	Services.endTransaction();		
}
function Add_OK_Btn() {};
Add_OK_Btn.helpText = "Request add the Tape File.";
/**
 Binding Actions to Add_OK_Btn
  */
Add_OK_Btn.actionBinding = function(){		
  var errorMessage =
		 "Form cannot be submitted as it has invalid values. The following fields have invalid values:";
  	var invalidFlds = 0;  
  	var statusMessage = "";
  	var fieldSetFocus = "";
  	var focusOK = true;
    var fileNameAdaptor    = Services.getAdaptorById("Add_File_Name_Txt");
    var noOfRecordAdaptor  = Services.getAdaptorById("Add_Number_Of_Records_Txt");   
    var warrantFeesAdaptor = Services.getAdaptorById("Add_Warrant_Fees_Txt");
    var zoomCommentAdaptor = Services.getAdaptorById("Add_Comments_Zoom");
    
    var fileName    = Services.getValue(Add_File_Name_Txt.dataBinding);
    var noOfRecord  = Services.getValue(Add_Number_Of_Records_Txt.dataBinding);   
    var warrantFees = Services.getValue(Add_Warrant_Fees_Txt.dataBinding);
    
    Services.setValue(Add_File_Name_Txt.dataBinding, "");
    Services.setValue(Add_File_Name_Txt.dataBinding, fileName);
    Services.setValue(Add_Warrant_Fees_Txt.dataBinding, warrantFees);
    
    if(!fileNameAdaptor.getValid()||(fileName==null||fileName==""&&fileNameAdaptor.getMandatory())){
    	fieldSetFocus = "Add_File_Name_Txt";
    	focusOK=false;
    	if(fileName==null||fileName=="") {
    		statusMessage = "No value is entered for mandatory field File Name.";
    	}	
    	invalidFlds++;
    	errorMessage = errorMessage + "<br>File Name";
    }
     if(!noOfRecordAdaptor.getValid()||(noOfRecord==null||noOfRecord==""&&noOfRecordAdaptor.getMandatory())){
       if(focusOK){
     		fieldSetFocus = "Add_Number_Of_Records_Txt";
     		focusOK=false;
     		if(noOfRecord==null||noOfRecord=="") {
     			statusMessage = "No value is entered for mandatory field Number of Records.";
     		}	
     	}
    	invalidFlds++;
    	errorMessage = errorMessage + "<br>Number of Record";
    }
     if(!warrantFeesAdaptor.getValid()||(warrantFees==null||warrantFees==""&&warrantFeesAdaptor.getMandatory())){    	
      if(focusOK){
        fieldSetFocus = "Add_Warrant_Fees_Txt";        
        focusOK=false;
        if(warrantFees==null||warrantFees=="") {
        	statusMessage = "No value is entered for mandatory field Warrant Fees.";
        }	
      }
    	invalidFlds++;
    	errorMessage = errorMessage + "<br>Warrant Fees";
    }
      
    if(invalidFlds>0){
		Services.showDialog(
			StandardDialogTypes.OK,
			function callback(){
				Services.setFocus(fieldSetFocus);
				if(statusMessage!=""){
					Services.setTransientStatusBarMessage(statusMessage);
				}	
				focusOK = true;
				return;
			},
			errorMessage,
			""
		);	
    	
    } else {			//Check if no errors found
		closeAddPopup();
	}	
}
/**
 Binding Actions to Query_Grid_Prev
  */
Query_Grid_Prev.actionBinding = function() {
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	if(isNaN(pageNumber)) {
		pageNumber = 1;
	} else {
		pageNumber--;
	}
	executeSummSearch(queryDom,GRID_PAGE_SIZE,pageNumber);
	Services.setValue(GRID_PAGE_NUMBER,pageNumber);	
}
/**
	 key bindings for Query_Grid_Prev
*/
Query_Grid_Prev.additionalBindings = {
      eventBinding: {
            keys: [{ key: Key.CHAR_P, element: "Query_popup", alt: true }]
      }
};


Query_Grid_Prev.helpText = "Display the previous page of records.";
Query_Grid_Prev.tabIndex = 95;
Query_Grid_Prev.enableOn = [GRID_PAGE_NUMBER,"/ds/var/page/disableNavigation"];
/** 
* This function specifies if Query_Grid_Prev
* is enabled
* @return boolean
*/
Query_Grid_Prev.isEnabled = function() {
	if(Services.getValue("/ds/var/page/disableNavigation")=="true"){
		return false;
	}
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	return (! isNaN(pageNumber) && pageNumber > 1);

}
/**
 Binding Actions to Query_Grid_Next
  */
Query_Grid_Next.actionBinding = function() {
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	if(isNaN(pageNumber)) {
		pageNumber = 2;
	} else {
		pageNumber++;
	}
	Services.removeNode(GRID_XPATH); 
	executeSummSearch(queryDom,GRID_PAGE_SIZE,pageNumber);
	Services.setValue(GRID_PAGE_NUMBER,pageNumber);
}
/**
	 key bindings for Query_Grid_Next
*/
Query_Grid_Next.additionalBindings = {
      eventBinding: {
            keys: [{ key: Key.CHAR_N, element: "Query_popup", alt: true }]
      }
};


Query_Grid_Next.helpText = "Display the next page of records.";
Query_Grid_Next.tabIndex = 96;
Query_Grid_Next.enableOn =  [GRID_PAGE_NUMBER,Query_Tapes_Grid.dataBinding,"/ds/var/page/disableNavigation"];
Query_Grid_Next.isEnabled = function() {
	if(Services.getValue("/ds/var/page/disableNavigation")=="true"){
		return false;
	}
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	var nodeCount = Services.countNodes(Query_Tapes_Grid.srcData + "/" + Query_Tapes_Grid.rowXPath);
	return nodeCount >= GRID_PAGE_SIZE;
}
//grid page number field
Query_Grid_PageNumber.isReadOnly = function() {
	return true;
}
Query_Grid_PageNumber.helpText = "Displaying page number";
Query_Grid_PageNumber.logicOn = [GRID_PAGE_NUMBER];
/**
* This function adds a logic on the Query_Grid_PageNumber
* @param e
*/
Query_Grid_PageNumber.logic = function(evt){
	Services.setValue(Query_Grid_PageNumber.dataBinding, Services.getValue(GRID_PAGE_NUMBER));
}


/**
*
*  Save Action and then close the screen onSuccess function
*  @param  exception  thrown from the query
*  @return void	
*/
function SaveOnlyCallBackObject(){};
SaveOnlyCallBackObject.prototype.onSuccess = function(objDom, serviceName){	
		var toDoFlag = Services.getValue("/ds/var/page/toDoFlag");
		switch(toDoFlag){
			case "CLEAR":
			{				
				Services.setValue(SAVING_FINISHED_XPATH, "OK_CLEAR");
				Services.setFocus("Main_Customer_ID_Txt");
				break;
			}			
			case "QUERY" :
			{			
				Services.startTransaction();	
				Services.setValue(SAVING_FINISHED_XPATH, "OK_QUERY");	
				Services.setFocus("Query_Library_Number_Txt");
				Services.endTransaction();			
				break;
			}
			case "BACK":
			{
				Services.startTransaction();	
				Services.setValue(SAVING_FINISHED_XPATH, "OK_BACK");	
				Services.endTransaction();			
				break;
			}
		}
}
/**
*
*  Save Action and then close the screen onError function displays a Dialog box with the following message
*	Error with connection to Server.!!
*	Check Server is running.
*	Check Database is running.
*	Contact system administrator !
*  @param  exception  thrown from the query
*  @return void	
*/
SaveOnlyCallBackObject.prototype.onError = function(exception){
	Services.setValue("/ds/var/page/disableNavigation",null);
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
	
};

/**
*
*  Save Action and then close the screen onUpdateLockedException function displays a Dialog box with the following message
*  when to concurrent users changes the same record 
*   Another user has made changes to this record. Your changes have not been saved.
*	Click OK to retrieve the record again.
*  @param  exception  thrown from the query
*  @return void	
*/
SaveOnlyCallBackObject.prototype.onUpdateLockedException = function (exception) {	

	Services.showDialog(
			StandardDialogTypes.OK_CANCEL,
			function callback(button){
				switch(button){
					case StandardDialogButtonTypes.OK:
					{						    
						Services.setValue(Main_Library_Number_Txt.dataBinding, "");
						var tempLibNumber = Services.getValue("/ds/var/page/tempLibNumber"); 
	 					Services.setValue(Main_Library_Number_Txt.dataBinding, tempLibNumber); 
						Services.setFocus("Main_Customer_ID_Txt");											   
						break;
					}	
					case StandardDialogButtonTypes.CANCEL:
					{	
						var toDoFlag = Services.getValue("/ds/var/page/toDoFlag");
						switch(toDoFlag){
							case "CLEAR": clearMainScreen(); Services.setFocus("Main_Customer_ID_Txt"); break;
							case "QUERY": clearMainScreen(); Main_Query_Btn.actionBinding(); Services.setFocus("Query_Library_Number_Txt"); break;
							case "BACK" : Main_Back_Btn.actionBinding(); break;
						}							
						break;
					}	
				}
			},
			"Another user has made changes to this record. Your changes have not been saved. Click OK to retrieve the record again.",
			""
		);	
    
};
/**
*
*  Save Action onSuccess function
*  @param  objDom returned dom resulted from the query
*  @param  serviceName could be "addTapes" or "updateTapes" or "deleteTape"
*  @return void	  
*/
function SaveCallBackObject() {};

SaveCallBackObject.prototype.onSuccess = function(objDom, serviceName){
	
		Services.startTransaction();
	
	if(serviceName == "addTapes"){		
		var libNumber = XML.getPathTextContent(objDom, "/ReceivedTapes/ReceivedTape/LibraryNumber");		
		Services.setValue(Main_Library_Number_Txt.dataBinding, libNumber);
		Services.removeNode(FORM_XPATH + "/Model/ReceivedTapes");
		Services.addNode(objDom, FORM_XPATH + "/Model");
		Services.setValue(pageMode.dataBinding, "U");		
		Services.setFocus("Main_Library_Number_Txt");
		Services.setValue("/ds/var/page/newTapeFlag",true);
		Services.showDialog
		(
			StandardDialogTypes.OK,			//Dialoge Type
			function(){
					return;
				},					//CallBack function
			"A new record of Library No. "+ libNumber +" has been created successfully.",	// Message
			"Success Saving"					//title
		);
	} else if(serviceName == "updateTapes"){		
		Services.removeNode(FORM_XPATH + "/Model/ReceivedTapes");
		Services.addNode(objDom, FORM_XPATH + "/Model");
		Services.setFocus("Main_Library_Number_Txt");
		Services.setTransientStatusBarMessage("OK");
	} else if(serviceName == "deleteTapes"){	
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
		clearMainScreen();	
		Services.setFocus("Main_Customer_ID_Txt");		
	}
	
	Services.endTransaction();
}
/**
*
*   Save Action onBusinessException function displays a Dialog box with the following message
*	Another user has deleted this record from the database
*	Your changes have not been saved.
*  @param  exception  thrown from the query
*  @return void	
*/
SaveCallBackObject.prototype.onBusinessException = function(exception){
	Services.setValue("/ds/var/page/disableNavigation",null);
	var mssg = exception.message;	
	if(mssg.indexOf("Existence check failure")>-1&&mssg.indexOf("/ReceivedTapes/ReceivedTape")>-1){	    
	    Services.showDialog(
			StandardDialogTypes.OK,
			ConfirmOKCallBack,
			"Another user has deleted this record from the database. Your changes have not been saved.",
			""
		);	
	}
}
/**
*
*  Save Action onError function displays a Dialog box with the following message
*	Error with connection to Server.!!
*	Check Server is running.
*	Check Database is running.
*	Contact system administrator !
*  @param  exception  thrown from the query
*  @return void	
*/
SaveCallBackObject.prototype.onError = function(exception){
	Services.setValue("/ds/var/page/disableNavigation",null);
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
/**
*
*  Save Action onUpdateLockedException function displays a Dialog box with the following message
*  when to concurrent users changes the same record 
*   Another user has made changes to this record. Your changes have not been saved.
*	Click OK to retrieve the record again.
*  @param  exception  thrown from the query
*  @return void	
*/
SaveCallBackObject.prototype.onUpdateLockedException = function (exception)
{
	if(Services.getValue(pageMode.dataBinding) == "U"){
		var tempLibNumber = Services.getValue(Main_Library_Number_Txt.dataBinding);
		Services.setValue("/ds/var/page/tempLibNumber", tempLibNumber);
		Services.showDialog(
			StandardDialogTypes.OK_CANCEL,
			ConfirmOKCancelUpdateCallBack,
			"Another user has made changes to this record. Your changes have not been saved. Click OK to retrieve the record again.",
			""
		);	
	}
}




/*****************************************************************************************************************
							HELPER FUNCTIONS
*****************************************************************************************************************/
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a reuslt attemping to save an unexisting record.
*  @param  button selected by the user.(Ok)
*  @return void	
*/
function ConfirmOKCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.OK:
			{			
				clearMainScreen();
				Services.setFocus("Main_Library_Number_Txt");	
				break;
			}	
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of  an updateLockedException
*  @param  button selected by the user. (Ok or Cancel)
*  @return void	
*/
function ConfirmOKCancelUpdateCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.OK:
			{			
				Services.setValue(Main_Library_Number_Txt.dataBinding, "");
				var tempLibNumber = Services.getValue("/ds/var/page/tempLibNumber");
				Services.setValue(Main_Library_Number_Txt.dataBinding, tempLibNumber); 
				Services.setFocus("Main_Library_Number_Txt");
				break;
			}	
		case StandardDialogButtonTypes.CANCEL:
			{		
				break;
			}	
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to delete a tape.
*  @param  button selected by the user. (Ok or Cancel)
*  @return void	
*/
function DeleteTapeDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.OK:
			{
				// Do confirmed action
			  if(Services.countNodes(FILE_PATH) == 0){					
					deleteTape();	
					Services.setFocus("Main_Customer_ID_Txt");	
			  }
			  else {
			  	var msg = ErrorCode.getErrorCode("Caseman_AssociatedTapeFilesExist_Msg").getMessage();
			  	Services.setTransientStatusBarMessage(msg);
			  }	
				break;
			}	
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation					
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to clear the screen.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function ClearDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				Services.setValue("/ds/var/page/toDoFlag","CLEAR");
				var clearCallBackObject = 
							 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);	
                Services.setFocus("Main_Customer_ID_Txt");					
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action									
			    clearMainScreen();	
			    Services.setFocus("Main_Customer_ID_Txt");
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation	
				break;
			}
	  
	  
	}
};
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to the main menu.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function BackDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);                	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("MainMenu");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close Add Tape popup and there is unsaved changes exists.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/

function PopupCloseDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES   : 
			{   
			    Add_OK_Btn.actionBinding();
				break;
			}
		case StandardDialogButtonTypes.NO    : 
			{  
			    clearAddFields();
				FormController.getInstance().hideFormExtensionPopup("Add_popup");		
				Services.setValue("/ds/var/page/addPopupRaisedFlag", false);		
				break;
			}
		case StandardDialogButtonTypes.CANCEL: break;
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to delete a tape.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function DeleteFileDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.OK:
			{	removeTapeFileFromGrid();				
				break;
			}			
		case StandardDialogButtonTypes.CANCEL:
			{	break; }
	}
}

/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Log Returned Records Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function ReturnedRecordsCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("ReturnedRecords");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
			    Services.navigate("ReturnedRecords");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Rejected Cases Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function QueryRejectedCasesCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("QueryRejectedCases");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("QueryRejectedCases");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Rejected Judgments Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function QueryRejectedJudgmentsCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("QueryRejectedJudgments");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("QueryRejectedJudgments");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Maintain National Coded Parties.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function MaintainNationalCodedPartiesCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var saveOnlyCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(saveOnlyCallBackObject);  
                Services.navigate("MaintainNationalCodedParties");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("MaintainNationalCodedParties");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}

/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Rejected Warrants Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function QueryRejectedWarrantsCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("QueryRejectedWarrants");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("QueryRejectedWarrants");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Rejected Paid Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function QueryRejectedPaidCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("QueryRejectedPaid");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("QueryRejectedPaid");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}
/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Print Customer File Reports Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function ProduceCustomerFileReportsCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("ProduceCustomerFileReports");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("ProduceCustomerFileReports");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}

/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*	as a result of attemping to close the screen and navigate to Produce Output Statistics Report Screens.
*  @param  button selected by the user. (Yes or No or Cancel)
*  @return void	
*/
function ProduceOutputStatisticsReportCallBack (button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action		
				Services.setValue("/ds/var/page/toDoFlag","BACK");	
				var clearCallBackObject = 
										 new SaveOnlyCallBackObject();
                var invalidFlds = saveForm(clearCallBackObject);  
                Services.navigate("Oracle_Reports_BC_ST_R2");	              	
				break;			
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);	
			    Services.navigate("Oracle_Reports_BC_ST_R2");		
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation				
				break;
			}
	}
}


/**
*
*  This method is executed when the user responds to the Confirm Dialog box appears 
*  after performing search operation that returns large number of records greater than the grid page size.
*  @param  button selected by the user. (OK or Cancel)
*  @return void	
*/
function MoreThan20RecordsCallBack(button) {
	switch(button){
		case StandardDialogButtonTypes.OK:
		{
			//Show the results
			Services.removeNode("/ds/var/page/tempTapes/ReceivedTapes/ReceivedTape[21]");
			var mcNode = Services.getNode("/ds/var/page/tempTapes/ReceivedTapes");
			Services.replaceNode( GRID_XPATH, mcNode);
			Services.removeNode("/ds/var/page/tempTapes");
			break;
		}
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation
				resetQueryGrid();
				Services.removeNode("/ds/var/page/tempTapes");
				break;
			}
	}
}


function  SummaryCallbackObject() {
}
function executeSummSearch(queryDOM,pageSize,pageNumber){
		var summaryCallbackObj = new SummaryCallbackObject() ;
		var summParams = new ServiceParams() ;
		summParams.addDOMParameter("Query", queryDOM);
		summParams.addSimpleParameter("pageNumber", pageNumber);	
		summParams.addSimpleParameter("pageSize", pageSize);
		Services.setValue("/ds/var/page/disableNavigation","true");		
		Services.callService("getSummaryTapes",summParams,summaryCallbackObj,true);
		Services.setFocus("Query_LibraryNumber_Txt");
}
/**
*
*  Summary data search action onSuccess function
*  @param  objDom returned dom resulted from the query
*  @return void	
*/
SummaryCallbackObject.prototype.onSuccess = function(objDom) {
		SummaryCallbackObjectSuccess(objDom);
} 
/**
*
*   Summary data search action onError function displays a Dialog box with the following message
*	Error with connection to Server.!!
*	Check Server is running.
*	Check Database is running.
*	Contact system administrator !
*  @param  exception  thrown from the query
*  @return void	
*/
SummaryCallbackObject.prototype.onError = function(exception) {
	Services.setValue("/ds/var/page/disableNavigation",null);
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
/**
*
*  SummaryCallbackObjectSuccess handles the query popup 
*  search results
*  @param  objDom returned dom resulted from the query
*  @return void	
*/
function SummaryCallbackObjectSuccess(objDom) {
	Services.setValue("/ds/var/page/disableNavigation",null);
	var libNum = XML.getPathTextContent(objDom,"/ReceivedTapes/ReceivedTape/LibraryNumber");
	if(libNum == null){
		//NoRecordsRetrieved
		Services.setValue( GRID_PAGE_NUMBER , "");
		var ec = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
	}else{
   		var nodeCount = parseInt(objDom.selectNodes("/ReceivedTapes/ReceivedTape").length);
   		var gpn = Services.getValue(GRID_PAGE_NUMBER);
   		if(nodeCount == 1 && gpn == 1){
			Services.replaceNode(GRID_XPATH,objDom);
			Query_Select_Btn.actionBinding();
		}else {
			if(nodeCount > GRID_PAGE_SIZE){
				Services.replaceNode("/ds/var/page/tempTapes/ReceivedTapes",objDom);
	   			var msg = ErrorCode.getErrorCode("CaseMan_MoreThan20Records_Msg").getMessage();
				Services.showDialog
				(
					StandardDialogTypes.OK_CANCEL, //Dialoge Type
					MoreThan20RecordsCallBack, //CallBack function
					msg, // Message
					""	//title
				);	
	   		}else{
	   			Services.replaceNode(GRID_XPATH,objDom);
	   		}
	   	}
   }
}


/**
*
*  This method is used to execute the search query by calling getTapes service. 
*  @param  newDOM contains search parameters.
*  @return void	
*/
function executeSearch(libraryNumber){
	var callbackObj = new CallBackObject() ;
	var params = new ServiceParams() ;
	params.addSimpleParameter("LibraryNumber",libraryNumber); 	
	Services.callService("getTapes",params,callbackObj,true);

}


function CallBackObject() {};
/**
*
*  Search Action onSuccess function
*  @param  objDom returned dom resulted from the query
*  @return void	
*/
CallBackObject.prototype.onSuccess = function(objDom){
	
	
	var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
	queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);
	
	if(queryPopupRaisedFlag){
		clearMainScreen();
		Services.removeNode(GRID_XPATH);
		Services.addNode(objDom, PAGE_XPATH);
		Services.setValue("/ds/var/page/searchResultFlag",true);
		Services.setValue(pageMode.dataBinding, "U");
		var select = Services.getNode(GRID_XPATH + "/ReceivedTape[./SurrogateKey="+Query_Tapes_Grid.dataBinding+"]");	
			
		if(select!=null){
			Services.setValue("/ds/var/page/customerCodeDBValidationFlag",false);	
			Services.replaceNode(TAPE_PATH, select);		
			
			if(Services.getValue(Query_Tape_File_Name_Txt.dataBinding)!=null)
			{
				var fileName=Services.getValue(Query_Tape_File_Name_Txt.dataBinding);
				
				var fileTapeNode= Services.getNode(GRID_XPATH + "/ReceivedTape[./SurrogateKey =" + Query_Tapes_Grid.dataBinding + "]/TapeFiles/TapeFile[./FileName='" + fileName+"']/OrderSeq");
				
				if(fileTapeNode!=null)
				{
					var orderSeq = XML.getPathTextContent(fileTapeNode, "/");	
					if(orderSeq!=null)
					{
						var gridNode = Services.getNode(FILE_PATH + "[./OrderSeq = " + orderSeq + "]/SurrogateKey");
						var key = XML.getPathTextContent(gridNode, "/");
						Services.setValue(Main_Tape_Files_Grid.dataBinding,'');
						Services.setValue(Main_Tape_Files_Grid.dataBinding,key);
					}
				}
			}			
				var fc = FormController.getInstance();
			 	fc.hideFormExtensionPopup("Query_popup");
				Services.setValue( GRID_PAGE_NUMBER , "");
				resetQueryGrid();
				clearQueryFileds();
			 	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);
			   	Services.setFocus("Main_Library_Number_Txt");
				Services.setTransientStatusBarMessage("OK");
			 	Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
			 	var tempLibNumber = Services.getValue(Main_Library_Number_Txt.dataBinding); 
			 	Services.setValue("/ds/var/page/tempLibNumber", tempLibNumber);

		}
	 }
	 
	 else {
		
		var tempLibNumber = Services.getValue(Main_Library_Number_Txt.dataBinding); 
	
		 	Services.setValue("/ds/var/page/tempLibNumber", tempLibNumber);
			Services.setValue("/ds/var/page/customerCodeDBValidationFlag",false);
			Services.removeNode(FORM_XPATH + "/Model/ReceivedTapes");
			Services.addNode(objDom, FORM_XPATH + "/Model");
				
		
		var nodeCount = parseInt(Services.countNodes(TAPE_PATH));
		if(nodeCount == 0){
			Services.setValue(pageMode.dataBinding, "I");
			clearMainScreen();
			var msg = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage();
			Services.setTransientStatusBarMessage(msg);
		} else {
			Services.setValue(pageMode.dataBinding, "U");	
			var newTapeFlag = Services.getValue("/ds/var/page/newTapeFlag");

			if(newTapeFlag == 0) {
				newTapeFlag = false;
			} else {
				newTapeFlag= true;
			}				
		    if(!newTapeFlag) {
		    	Services.setFocus("Main_Library_Number_Txt");
				
		    }

		}
		Services.setValue("/ds/var/page/firstLibraryNumberSetFlag",true);
	
	}
	
		
}
/**
*
*  Search Action onError function displays a Dialog box with the following message
*	Error with connection to Server.!!
*	Check Server is running.
*	Check Database is running.
*	Contact system administrator !
*  @param  exception  thrown from the query
*  @return void	
*/
CallBackObject.prototype.onError = function(exception){
	Services.setValue("/ds/var/page/disableNavigation",null);
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
/**
*
*  This method is used to execute the search query by calling addTapes or updateTapes service. 
*  @param  callbackObj used to handle save operation.
*  @return void	
*/
function saveForm(callbackObj){		
		var inValidFlds = FormController.getInstance().validateForm(false);
		var tempLibNumber = Services.getValue(Main_Library_Number_Txt.dataBinding);
		Services.setValue("/ds/var/page/tempLibNumber", tempLibNumber);	
		if(inValidFlds.length == 0){	
			if(Services.countNodes(FILE_PATH) == 0){
				Services.setTransientStatusBarMessage(
						ErrorCode.getErrorCode("Caseman_noTapeFilesExist_Msg").getMessage()
					);
				return 1;
		    } else {
				var paramDom = XML.createDOM(null,null,null);			
				var params = new ServiceParams() ;
				if(Services.getValue(pageMode.dataBinding) == "U"){				
					paramDom.appendChild(Services.getNode("/ds/var/form/Model/ReceivedTapes"));
					var filesNode = paramDom.selectSingleNode("/ReceivedTapes/ReceivedTape/TapeFiles");
					if(tapeFilesDom != null){
						var nodes = tapeFilesDom.selectNodes("/TapeFiles/TapeFile");
						for(i=0; i< nodes.length; i++){
							filesNode.appendChild(nodes[i]);
						}
					}
					tapeFilesDom = null;					
					params.addDOMParameter("Tapes", paramDom);				
					Services.callService("updateTapes",params,callbackObj,false);   		
					
				} else if(Services.getValue(pageMode.dataBinding) == null || Services.getValue(pageMode.dataBinding) == "I"){
					if(Services.getValue(Main_Date_To_Operations_Cal.dataBinding) == null){
						Services.setValue(Main_Date_To_Operations_Cal.dataBinding, "");
					}
					if(Services.getValue(Main_Comments_Txt.dataBinding) == null){
						Services.setValue(Main_Comments_Txt.dataBinding, "");
					}
					paramDom.appendChild(Services.getNode("/ds/var/form/Model/ReceivedTapes"));
					var NNode = paramDom.selectSingleNode("/ReceivedTapes/ReceivedTape");
					var LN = XML.createDOM(null,null,null);
					var LNEelement = LN.createElement("LibraryNumber");
					NNode.appendChild(LNEelement);
					params.addDOMParameter("Tapes", paramDom);
					Services.callService("addTapes",params,callbackObj,false);
				}
				Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
	     }
	 } else { 	
	 		var GRID_IS_NOT_VALID = false;
	 		var fieldToSetFocus = "";
	 		var statusBarMessage = null;
	 		var errorMessage =
						 "Form cannot be submitted as it has invalid values. The following fields have invalid values:";   	    		 
			fieldToSetFocus = inValidFlds[0].getId();		
	 	    for(var j=0;j<inValidFlds.length; j++){
	 		  	if(inValidFlds[j].getId()=="Main_Tape_Files_Grid"){
	 		  		GRID_IS_NOT_VALID = true ; 
	 		  		continue;
	 		  	}
	 		  	errorMessage = errorMessage + "<br>"+inValidFlds[j].getDisplayName();
	 		}
	 		
	    	if(GRID_IS_NOT_VALID&&inValidFlds.length==1){
	    		var fileCount = Services.countNodes(FILE_PATH);		
				for(var i=1; i<=fileCount; i++){
					var key = Services.getValue(FILE_PATH+"["+i+"]/SurrogateKey");
					var fileName    = Services.getValue(FILE_PATH+"["+i+"]/FileName");
					var noOfRecords = Services.getValue(FILE_PATH+"["+i+"]/NumberOfRecords");
					var warrantFees = Services.getValue(FILE_PATH+"["+i+"]/Fees");
					var fileComments= Services.getValue(FILE_PATH+"["+i+"]/Comments");
					
					var fileType = fileName.substring(4,6);
					
					if(!validateNoOfRecords(noOfRecords)){								
						Services.setValue(Main_Tape_Files_Grid.dataBinding,'');						
						Services.setValue(Main_Tape_Files_Grid.dataBinding,key);					
						fieldToSetFocus = "Detail_Number_Of_Records_Txt";
						errorMessage = errorMessage+"<br>Number of Records";
						if(noOfRecords==null||noOfRecords==""){							
							statusBarMessage = "No value is entered for mandatory field Number of Records.";
						}
						break;		// break the for loop		
					} else if(!validateWarrantFees(warrantFees, fileType)) {
						Services.setValue(Main_Tape_Files_Grid.dataBinding,'');						
						Services.setValue(Main_Tape_Files_Grid.dataBinding,key);					
						fieldToSetFocus = "Detail_Warrant_Fees_Txt";
						errorMessage = errorMessage+"<br>Warrant Fees";
						if(warrantFees==null||warrantFees==""){						
							statusBarMessage = "No value is entered for mandatory field Warrant Fees.";
						}
						
						break;     // break the for loop
					} else if(!validateComments(fileComments)){
						Services.setValue(Main_Tape_Files_Grid.dataBinding,'');						
						Services.setValue(Main_Tape_Files_Grid.dataBinding,key);					
						fieldToSetFocus = "Detail_Comments_Zoom";
						errorMessage = errorMessage+"<br>File Comments";
						break;     // break the for loop
					}
					
				}  // end for loop
				
	    	} else {
	    		var k=0;
	    		if(GRID_IS_NOT_VALID&&inValidFlds[0].getId()=="Main_Tape_Files_Grid")k=1;
	    		fieldToSetFocus = inValidFlds[k].getId();	    			    		
	    		if(inValidFlds[k].hasIsMandatory&&inValidFlds[k].getMandatory()){
	    			statusBarMessage = "No value is entered for mandatory field "+inValidFlds[k].getDisplayName()+".";
	    		}
	    	}	
	    	Services.showDialog(
	    		StandardDialogTypes.OK,
				function callBack(button){
					Services.setFocus(fieldToSetFocus);
					if(statusBarMessage!=null)
						Services.setTransientStatusBarMessage(statusBarMessage);
					return;
				},
				errorMessage,
				""
	    	);
    		return inValidFlds.length;
    	 }
}

/**
* To reset the grid
*/
function resetQueryGrid()
{
	Services.setValue(Query_Tapes_Grid.dataBinding , "");
	Services.setValue( GRID_PAGE_NUMBER , "");
	var mcNode =  Services.getNode(GRID_XPATH);
	if(mcNode != null)
	{
		Services.removeNode(GRID_XPATH);
	}
}

/**
*
*  This method is used to remove a tape file from the Grid. 
*  @param  none.
*  @return void	
*/
function removeTapeFileFromGrid(){

	Services.startTransaction();
	
	if(Services.getValue(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/OrderSeq") != null && Services.getValue(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/OrderSeq") != ""){
			Services.setValue(Add_RemovedSeqNO.dataBinding, Services.getValue(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]/OrderSeq"));
			Services.setValue(Add_RemovedFlag.dataBinding, "Y");
			var delFile = Services.getNode(FORM_XPATH + "/AddFile/TapeFile/Remove");			
			Services.addNode(delFile, FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]");
			var newNode = Services.getNode(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]");
			if(tapeFilesDom == null){
				tapeFilesDom = XML.createDOM(null,null,null);
				var newTapes = tapeFilesDom.createElement("TapeFiles");
				tapeFilesDom.appendChild(newTapes);
			}
			var tapesNode = tapeFilesDom.selectSingleNode("/TapeFiles");
			tapesNode.appendChild(newNode);
		}
		Services.removeNode(FILE_PATH + "[./SurrogateKey="+Main_Tape_Files_Grid.dataBinding+"]");
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);
		var filePathNodes = Services.getNodes(FILE_PATH);
		if(filePathNodes == null || filePathNodes.length == 0){
			var msg = ErrorCode.getErrorCode("CaseMan_TapeHasNoTapeFiles").getMessage();
			Services.setTransientStatusBarMessage(msg);
		}
		
	Services.endTransaction();		
}
/**
*
*  This method is used to execute the delete query and delete tape record by calling deleteTape service. 
*  @param  callbackObj used to handle save operation.
*  @return void	
*/
function deleteTape(){
  	
	var paramDom = XML.createDOM(null,null,null);
	var libraryNumber = Services.getValue(Main_Library_Number_Txt.dataBinding);	
	Services.setValue("/ds/var/page/temp/delete/ReceivedTapes/ReceivedTape/LibraryNumber",libraryNumber);
	Services.setValue("/ds/var/page/temp/delete/ReceivedTapes/ReceivedTape/TapeFiles/TapeFile/LibraryNumber",libraryNumber);
	var deleteDom = Services.getNode("/ds/var/page/temp/delete/ReceivedTapes");
	paramDom.appendChild(deleteDom);
	
	var callbackObj = new SaveCallBackObject() ;
	var params = new ServiceParams() ;
	params.addDOMParameter("Tapes", paramDom);
	Services.callService("deleteTapes",params,callbackObj,false);
		
	Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
}


/**
*
*  This method is executed to handle the close operation of the Add Tape popup.
*  @param  none.
*  @return void	
*/
function closeAddPopup(){	

	Services.startTransaction();
	Services.setValue(FORM_XPATH + "/AddFile/TapeFile/OrderSeq", "");
	var addFile = Services.getNode(FORM_XPATH + "/AddFile/TapeFile");			
	Services.addNode(addFile, TAPE_PATH + "/TapeFiles");
	Services.setValue("/ds/var/page/exitWithoutSavingFlag",true);	
	FormController.getInstance().hideFormExtensionPopup("Add_popup");
	Services.setValue("/ds/var/page/addPopupRaisedFlag", false);
	Services.endTransaction();	
}
/**
*
*  This method is executed to clear the main screen and reset the input fields to the default values. 
*  @param  none.
*  @return void	
*/
function clearMainScreen(){
	Services.startTransaction();
		Services.setValue("/ds/var/page/disableNavigation",null);
		Services.removeNode("/ds/var/form/Model");
		Services.setValue(Query_Tapes_Grid.dataBinding, null);	
		Services.setValue(SAVING_FINISHED_XPATH, "");
		Services.setValue(pageMode.dataBinding, "I");
		tapeFilesDom = null;
		queryDom = null;
		Main_Date_To_Operations_Cal.setDefault();
		Main_Date_Received_Cal.setDefault();
		Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
		Services.setValue("/ds/var/page/searchResultFlag",false);
		Services.setValue("/ds/var/page/firstLibraryNumberSetFlag",true);
		Services.setValue("/ds/var/page/customerCodeDBValidationFlag", true);
		Services.setValue("/ds/var/page/checkStatus", true);
		Services.setValue("/ds/var/page/toDoFlag","");	
		Services.setFocus("Main_Customer_ID_Txt");	
	Services.endTransaction();
}
/**
*
*  This method is executed to initialise the main screen. 
*  @param  none.
*  @return void	
*/
function initialiseMainScreen() {
	Services.startTransaction();
	Services.setValue(pageMode.dataBinding, "I");	
	Services.setFocus("Main_Customer_ID_Txt");	
	Services.setValue("/ds/var/page/firstLibraryNumberSetFlag",true);
	Services.setValue("/ds/var/page/searchResultFlag",false);
	Services.setValue("/ds/var/page/exitWithoutSavingFlag",false);
	Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",false);
	Services.setValue("/ds/var/page/customerCodeDBValidationFlag",true);
	Services.setValue("/ds/var/page/newTapeFlag",false);
	
	Services.setValue("/ds/var/page/toDoFlag","");
	Services.setValue("/ds/var/page/tempLibNumber", null);
	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);
	Services.setValue("/ds/var/page/addPopupRaisedFlag", false);
	Services.setValue("/ds/var/page/checkStatus", true);
	Services.setValue(Detail_Warrant_Fees_Cur.dataBinding,"\xA3");
	Services.setValue(Add_Warrant_Fees_Cur.dataBinding,"\xA3");
	Services.endTransaction();
	var params = new ServiceParams();		
	var callbackObj = new CustomerCallBackObject();
	Services.callService("getCustomers",params,callbackObj,true);
}
/**
*
*  This method is executed to clear the query fields to the defult values. 
*  @param  none.
*  @return void	
*/
function clearQueryFileds(){
	Services.startTransaction();
	Services.setValue(Query_Library_Number_Txt.dataBinding, "");
	Services.setValue(Query_Customer_ID_Txt.dataBinding, "");
	Services.setValue(Query_Customer_Desc_Txt.dataBinding, "");
	Services.setValue(Query_Date_Received_Txt.dataBinding, "");
	Services.setValue(Query_Date_Returned_Txt.dataBinding, "");
	Services.setValue(Query_Tape_File_Name_Txt.dataBinding, "");
	Services.setValue(Query_Tapes_Grid.dataBinding, null);
	Services.setValue(GRID_PAGE_NUMBER, "");
	Services.setValue("/ds/var/page/disableNavigation",null);
	Services.setFocus("Query_Library_Number_Txt");
	Services.endTransaction();	
}
/**
*
*  This method is executed to clear the Add popup fields to the defult values. 
*  @param  none.
*  @return void	
*/
function clearAddFields(){
	Services.startTransaction();
		Services.setValue(Add_File_Name_Txt.dataBinding, "");
		Services.setValue(Add_Number_Of_Records_Txt.dataBinding, "");
		Services.setValue(Add_Warrant_Fees_Txt.dataBinding, "");
		Services.setValue(Add_Comments_Zoom.dataBinding, "");
		Services.setValue(Add_RemovedSeqNO.dataBinding, "");
		Services.setValue(Add_RemovedFlag.dataBinding, "");
		Services.setValue("/ds/var/page/exitPopupWithoutSavingFlag",false);
		Services.setFocus("Add_File_Name_Txt");
	Services.endTransaction();	
}
/**
*
*  This method is executed to check weather the search is an empty search
*  The method returns true if the user didnt enter any search item in the fields , at least one of the search items Library Number, 
*  Customer Code, Date Received, Date Returned or File Name. 
*  @param  none.
*  @return boolean	
*/
function isEmptySearch() {
	var emptyFlag = true;
	
	var libraryNumber = Services.getValue(Query_Library_Number_Txt.dataBinding);	
	if(libraryNumber != "" && libraryNumber != null) {
		emptyFlag = false;
	}		

	var custCode = Services.getValue(Query_Customer_ID_Txt.dataBinding);
	if(custCode != ""  && custCode != null ) {
		emptyFlag = false;
	}		



	var  dateReceived = Services.getValue(Query_Date_Received_Txt.dataBinding);
	if(dateReceived != "" && dateReceived != null) {
		emptyFlag = false;
	}

	var  dateReturned = Services.getValue(Query_Date_Returned_Txt.dataBinding);
	if(dateReturned != "" && dateReturned != null) {
		emptyFlag = false;
	}

	var fileName = Services.getValue(Query_Tape_File_Name_Txt.dataBinding);
	if(fileName != "" && fileName!= null ) {
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
*  The method formats the dates displayed in the Search results grid
*  @param  date value.
*  @return date	
*/
function formatDateInGrid(value) {

	var day   = value.substring(8,10);
	var year  = value.substring(0,4);
	var month = value.substring(5,7);
	if(month.charAt(0)=='0') {
		month = month.substring(1);
	}				
	value = day+"-"+FWDateUtil.shortMonths[month-1]+"-"+year;
	return value;
}

/**
*
*  This method is executed to validate Numeric data.
*  @param  sText, the data to be validated as number
*  @return  IsNumber, true = valid, false = invalid
*/
function IsInteger(sText){
	var ValidChars = "0123456789";
	var Negative = "-";
	var IsNumber=true;
	var Char;
	if(null != sText && sText != ""){
		for (i = 0; i < sText.length && IsNumber == true; i++){
			Char = sText.charAt(i); 
			if (ValidChars.indexOf(Char) == -1){
				if(i==0 && Negative.indexOf(Char)>-1 ){
					IsNumber = true;
				}else{
					IsNumber = false;
				}
			}
		}
	}else{
		IsNumber = false;
	}
	return IsNumber;
}

/*********************************************************************************************/
function uniqueTapeFileCallBackObject(){};
/**
 * callback handler which gets invoked upon the success 
 * return of the remote invocation.
 * @param [Dom] objDom the reurned domm object from the invocation
 */
uniqueTapeFileCallBackObject.prototype.onSuccess = function(objDom){	

	Services.replaceNode(Temp_XPATH+"/TapeFiles" , objDom);
}
/**
 * callback handler which gets invoked upon the error
 * return of the remote invocation.
 * @param [Exception] exception the resulting exception 
 * from the remote invocation
 */
uniqueTapeFileCallBackObject.prototype.onError = function(){
	Services.setValue("/ds/var/page/disableNavigation",null);
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