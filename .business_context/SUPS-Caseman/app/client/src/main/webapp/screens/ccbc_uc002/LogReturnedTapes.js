/**
File Name			:LogReturnedTapes.js
Description			:
Owner	(EDS Net ID)	:Hassan Elhalafawy (vz618c)
Modification History	:
================================================================================
                         	Prior
Date        EDS Net ID           			Version      CR       Description
----------  ----------------- 	    		--------     -------  -------------
15-06-2005  Mohamed Lotfy  (kz1b05)         1.0a   	     N/A      Construction
03-07-2005  Hassan Elhalafawy (vz618c)      1.0b         N/A      Modification
            Khaled A. Gawad (vzq598)                     ....     Defect Fixing and CR
================================================================================
*/
var TAPE_PATH = "/ds/var/form/Model/ReturnedTapes/ReturnedTape";
var FILE_PATH = TAPE_PATH + "/TapeFiles/TapeFile";
var QUERY_PATH= PAGE_XPATH + "/Query";
var Model_XPATH = FORM_XPATH + "/Model/ReturnedTapes/ReturnedTape";
var VAR_XPATH = "/ds/var";
var GRID_XPATH = "/ds/var/page/ReturnedTapes";
var Quick_XPATH = "/ds/var/Query";
var queryDom = null;
//variables for paging
var GRID_PAGE_SIZE = 20;
var GRID_PAGE_NUMBER = "/ds/var/page/pageNumber";

// Popups are active
var SEARCH_RESULTS_POPUP_FLAG = false;
var FIRST_LIBRARY_NUMBER_SET= true;
var SEARCH_RESULT = false;
var EXIT_WITHOUT_SAVING = false;
var to_do_flag = "";
var SAVING_FINISHED_XPATH = FORM_XPATH + "/Saving/Finished";
function LogReturnedTapes() {};

/**
* Initialization of the form LogReturnedTapes
*/

LogReturnedTapes.initialise = function(){
	clearMainScreen();
	Services.startTransaction();
	Services.setFocus("Master_LibraryNumber_Txt");
	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);
	Services.setValue(Master_WarrantFeesCurrencySign_Txt.dataBinding,"\xA3");
	Services.endTransaction();
	var params = new ServiceParams();		
	var callbackObj = new CustomerCallBackObject();
	Services.callService("getCustomers",params,callbackObj,true);
}

/**
* Reference data for the form LogReturnedTapes
*/
LogReturnedTapes.refDataServices = [                                
	{name:"date",      dataBinding:FORM_XPATH + "/RefData", serviceName:"getTodayDate",serviceParams:[]}
];

menubar = 
{
	quickLinks: 
	[
		{		
			id: "Master_Query_Btn",                 // id for button
			formName: "LogReturnedTapes",          // The name of the current form
			label: " Query ",                     // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() 
			{			
				var libraryNumberAdaptor = Services.getAdaptorById("Master_LibraryNumber_Txt");
				
				if(libraryNumberAdaptor.getValid()){
					if(EXIT_WITHOUT_SAVING == true){
						var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
						QUERY_CONFIRM_FLAG = true;
						Services.showDialog(
							StandardDialogTypes.YES_NO_CANCEL,
							QueryDialogCallBack,
							msg,
							""
						);	
				 	 } else{
						var fc = FormController.getInstance();
						SEARCH_RESULTS_POPUP_FLAG=true;
						fc.showFormExtensionPopup("Query_popup");
						Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
						clearSearchScreen();
					  }
			  	}else {
			  			Services.setFocus("Master_LibraryNumber_Txt");
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
				keys: [{ key: Key.F1, element: "LogReturnedTapes", ctrl: true }],
				singleClicks: [],
				doubleClicks: []
			 },
			 
			onMenuBar: true   
		},
		
		{
			id: "Log_Received_Tapes_Btn",           // id for button
			formName: "ReceivedRecords",           // The name of the current form
			label: " Log Received Tapes ",        // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
						var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
			
						Services.showDialog(
							StandardDialogTypes.YES_NO_CANCEL,
							ReceivedRecordsCallBack,
							msg,
							""
						);		
				} else{
					Services.navigate("ReceivedRecords");
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
			 
			onMenuBar: true
		},
		
		{
			id: "View_Rejected_Cases_Btn",          // id for button
			formName: "QueryRejectedCases",        // The name of the current form
			label: " Rejected Cases ",            // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedCasesCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("QueryRejectedCases");
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
			 
			onMenuBar: true
		},
		
		{
			id: "View_Rejected_Judgments_Btn",      // id for button
			formName: "QueryRejectedJudgments",    // The name of the current form
			label: " Rejected Judgments ",        // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
								Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedJudgmentsCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("QueryRejectedJudgments");
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
			 
			onMenuBar: true
		},
		
		{
			id: "View_Rejected_Warrants_Btn",       // id for button
			formName: "QueryRejectedWarrants",     // The name of the current form
			label: " Rejected Warrants ",         // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */					
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
								Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedWarrantsCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("QueryRejectedWarrants");
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
		},
		
		{
			id: "View_Rejected_Paid_Btn",          				 // id for button
			formName: "QueryRejectedPaid",        				// The name of the current form
			label: " Rejected Paid / Written Off Details ",    // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */				
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
								Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						QueryRejectedPaidCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("QueryRejectedPaid");
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
		},
		
		{
			id: "Print_Customer_File_Reports_Btn",               // id for button
			formName: "ProduceCustomerFileReports",             // The name of the current form
			label: " Print Customer File Reports ",            // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						ProduceCustomerFileReportsCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("ProduceCustomerFileReports");
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
		},
		
		{
			id: "Print_Output_Statistics_Report_Btn",            // id for button
			formName: "Oracle_Reports_BC_ST_R2",                // The name of the current form
			label: " Print Output Statistics Report ",         // The label appear in the navigation bar
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						ProduceOutputStatisticsReportCallBack,
						msg,
						""
					);		
				} else{
					Services.navigate("Oracle_Reports_BC_ST_R2");
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
		},
		
		{
			id: "NavBar_CodedPartiesButton",                     // id for button		
			formName: "MaintainNationalCodedParties",           // The name of the current form			
			label: " Maintain National Coded Parties ",        // The label appear in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,  false otherwise
			 */			
			guard: function() 
			{
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
					var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
					Services.showDialog(
						StandardDialogTypes.YES_NO_CANCEL,
						MaintainNationalCodedPartiesCallBack,
						msg,
						""
					);		
				} else{
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
/** Screen Key Binding */
LogReturnedTapes.keyBindings = [
	{
			/** Binding F4 to Main_Back_Btn */	
		key: Key.F4, action: function(){
						       	Main_Back_Btn.actionBinding();  // exit screen
		             		} // end of function
	},
	{
			/** Binding F3 to Main_Save_Btn */
		key: Key.F3, action: function(){
							var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
            				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
            				if(isSaveBtnEnabled){    
            					Main_Save_Btn.actionBinding();	                      
							}
		} // end of function
	},
	{		
			/** Binding F6 to the Query Popup Window */	
		key: Key.F6, action: function(){
								var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
								queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);
							  	if(queryPopupRaisedFlag)
							 	{
							  	  Master_CustomerLOV.actionBinding();
								}
		} // end of function
	}
];



		/****************** Constructors ******************/

	/** Query Area  */
function Master_Query_Btn(){};
function Query_LibraryNumber_Txt() {}
function Query_CustomerID_Txt() {}
function Query_CustomerDescription_Txt() {}
//function Query_DateReceived_Cal() {}
function Query_DateReceived_Txt() {}
function Query_DateReturned_Txt() {}
function Query_FileName_Txt(){}
function Master_CustomerLOV() {}
function Query_Tapes_Grid() {}

	/** paging fields in the Grid */
function Query_Grid_Prev() {}
function Query_Grid_PageNumber() {}
function Query_Grid_Next() {}
//***********************************************************************************
	/** Query Area Buttons */
function Query_Search_Btn(){}
function Query_Select_Btn(){}
function Query_Cancel_Btn () {}
function Query_Clear_Btn(){}

//***********************************************************************************
	/** Main Screen Area */
function Page_Mode(){}
function Master_LibraryNumber_Txt() {}
function Master_Degaussed_CBx() {}
function Master_CustomerID_Txt() {}
function Master_CustomerDescription_Txt() {}
function Master_DateReceived_Cal() {}
function Master_DateReturned_Cal() {}
function Master_DateToOperations_Cal() {}
function Master_Comments_Txt() {}
//***********************************************************************************
	/** Tape Files construct */
function Master_TapeFiles_Grid() {}
function Master_File_Name_Txt(){}
function Master_Number_Of_Records_Txt(){}
function Master_WarrantFeesCurrencySign_Txt(){}
function Master_WarrantFeesAmount_Txt(){}
function Master_FileComments_Txt(){}
function Master_Status_Txt(){}
//***********************************************************************************
	/** Main Screen Buttons */
function Main_Save_Btn(){};
function Main_Clear_Btn(){};
function Main_Back_Btn(){};

function LogicObjectOne(){};

function Query_popup() {};
	/** Query popup Key Binding */
Query_popup.keyBindings = [
	{	
			/** Binding F6 to Master_CustomerLOV */			
		key: Key.F6, action: function(){		        								
	            	  Master_CustomerLOV.actionBinding();						 
		} // end of function
	},
	
	{		
			/** Binding F6 to Query_Search_Btn */				
		key: Key.F1, action: function(){	
						Query_Search_Btn.actionBinding();    	                    		
		} // end of function
	},
	
	{	
			/** Binding F6 to Query_Cancel_Btn */			
		key: Key.F4, action: function(){		        							
					  Query_Cancel_Btn.actionBinding();	
					  Services.setFocus("Master_LibraryNumber_Txt");					 
		} // end of function
	}
];
/*****************************************************************************************************************
*******************************	DATA BINDINGS ********************************************************************
*****************************************************************************************************************/

	/** Query Area */
Query_LibraryNumber_Txt.dataBinding       = QUERY_PATH + "/LibraryNumber";
Query_CustomerID_Txt.dataBinding 		  = QUERY_PATH + "/CustomerID";
Query_CustomerDescription_Txt.dataBinding = QUERY_PATH + "/CustomerDescription";
Query_DateReceived_Txt.dataBinding 		  = QUERY_PATH + "/DateRecieved";
Query_DateReturned_Txt.dataBinding 		  = QUERY_PATH + "/DateReturned";
Query_FileName_Txt.dataBinding            = QUERY_PATH + "/FileName";


/***********************************************************************************/

Query_Tapes_Grid.dataBinding      = "/ds/var/page/SelectedGridRow/Query_Tapes_Grid";
Master_TapeFiles_Grid.dataBinding = "/ds/var/page/SelectedGridRow/TapeFiles_Grid";


/******************************Main Screen Buttons **********************************/
Page_Mode.dataBinding= PAGE_XPATH + "/Mode";
Master_LibraryNumber_Txt.dataBinding         = TAPE_PATH+"/LibraryNumber";
Master_Degaussed_CBx.dataBinding             = TAPE_PATH+"/Degaussed";
Master_CustomerID_Txt.dataBinding            = TAPE_PATH+"/CustomerCode";
Master_CustomerDescription_Txt.dataBinding   = TAPE_PATH+"/CustomerDescription";
Master_DateReceived_Cal.dataBinding          = TAPE_PATH+"/DateRecieved";
Master_DateReturned_Cal.dataBinding          = TAPE_PATH+"/DateReturned";
Master_DateToOperations_Cal.dataBinding      = TAPE_PATH+"/DateToOperations";
Master_Comments_Txt.dataBinding 			 = TAPE_PATH+"/Comments";


/*****************************Tape File  Area***************************************/
Master_File_Name_Txt.dataBinding               = TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/FileName";;
Master_Number_Of_Records_Txt.dataBinding       = TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/NumberOfRecords";
Master_WarrantFeesAmount_Txt.dataBinding       = TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/Fees";
Master_WarrantFeesCurrencySign_Txt.dataBinding = "/ds/var/app/FeesCurrency";
Master_FileComments_Txt.dataBinding            = TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/Comments";
Master_Status_Txt.dataBinding                  = TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/Status";


/*****************************paging data binding***********************************/
Query_Grid_PageNumber.dataBinding = PAGE_XPATH + "/PageNumberGrid";	

LogicObjectOne.dataBinding = FORM_XPATH + "/logic/LogicObjectOne";

Main_Save_Btn.dataBinding = FORM_XPATH + "/SaveButton";
Query_Select_Btn.dataBinding = FORM_XPATH + "/SelectButton";


/*******************************   LOV    ******************************************/
function Customer_LOV() {};

Customer_LOV.dataBinding = PAGE_XPATH + "/QueryCodedCreditorPopup";
Customer_LOV.srcData = FORM_XPATH + "/RefData/Customers"
Customer_LOV.rowXPath = "Customer";
Customer_LOV.keyXPath = "CustomerCode";
Customer_LOV.columns = [  {xpath: "CustomerCode"},{xpath: "CustomerName"}];


/******************************* Search Grid ***************************************/	 
Query_Tapes_Grid.helpText="Results returned by Query for a Tape.";
Query_Tapes_Grid.tabIndex = 90;
Query_Tapes_Grid.srcData = GRID_XPATH;
Query_Tapes_Grid.rowXPath = "ReturnedTape";
Query_Tapes_Grid.keyXPath = "SurrogateKey";
Query_Tapes_Grid.columns = [
	{xpath: "LibraryNumber" ,defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"},
	{xpath: "CustomerCode"  ,defaultSort:"true", sort:"numerical", defaultSortOrder:"ascending"},
	{xpath: "CustomerDescription"},
	{xpath: "DateRecieved",transformToDisplay: function(value){
			if(value==null||value=="")return "";
		    var formattedDate = formatDateInGrid(value);
			return formattedDate;
		},
		sort:SortDate},
	{xpath: "DateReturned",transformToDisplay: function(value){
			if(value==null||value=="")return "";
		    var formattedDate = formatDateInGrid(value);
			return formattedDate;
		},
		sort:SortDate}
];
	/** Dispatches a Business Event to a GUI Adaptor */
Query_Tapes_Grid.actionBinding= function()
{
	Services.dispatchEvent(Query_Select_Btn, ButtonInputElementGUIAdaptor.EVENT_ACTION);
}


/****************************** Main Screen Files Grid***********************************/
Master_TapeFiles_Grid.tabIndex = 120;
Master_TapeFiles_Grid.helpText="Tape Files associated with the displayed Tape.";
Master_TapeFiles_Grid.srcData = TAPE_PATH +"/TapeFiles";
Master_TapeFiles_Grid.componentName = "Tape Files";
Master_TapeFiles_Grid.rowXPath = "TapeFile";
Master_TapeFiles_Grid.keyXPath = "SurrogateKey";
Master_TapeFiles_Grid.columns = [
	{xpath: "FileName"}
];

/*****************************************************************************************************************/

LogicObjectOne.logicOn = [SAVING_FINISHED_XPATH];

	/** the function will be applyed based on a change to the underlying DOM */
LogicObjectOne.logic = function(event){	
  
	var saving_flag = Services.getValue(SAVING_FINISHED_XPATH);	
	switch(saving_flag){
	    case "":
	    {
	    	return; break;
	    } 
		case "OK_CLEAR":
		{
			clearMainScreen();
			Services.setFocus("Master_LibraryNumber_Txt");
			break;
		}
		case "OK_QUERY":
		{	
			clearMainScreen();
			var fc = FormController.getInstance();
			SEARCH_RESULTS_POPUP_FLAG=true;
			fc.showFormExtensionPopup("Query_popup");
			Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
			clearSearchScreen();
			Services.setFocus("Query_LibraryNumber_Txt");			
			break;
		}
		case "OK_BACK":
		{
			Services.navigate("MainMenu");			
		}
	}
 
};



/******************************* Query Area*******************************************************/
		/** Library Number */
Query_LibraryNumber_Txt.helpText="Tape Library Number";
Query_LibraryNumber_Txt.tabIndex = 10;
Query_LibraryNumber_Txt.maxLength=9;
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_LibraryNumber_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_LibraryNumber_Txt.validate = function(){
	var libraryNumberValue = Services.getValue(Query_LibraryNumber_Txt.dataBinding);	
	if(isNumericWithoutWildcard(libraryNumberValue)) return null;
	else return ErrorCode.getErrorCode("Caseman_libraryNumberNotNumeric_Msg");
}

/** 
	used to configure adaptors to be excluded from Form Validation
	@return true
 */
Query_LibraryNumber_Txt.isTemporary = function(){
	return true;
}
Query_LibraryNumber_Txt.componentName="Tape Library Number";


//*****************************************************************************************************************/
		/** Customer ID */
Query_CustomerID_Txt.maxLength=4;
Query_CustomerID_Txt.tabIndex = 20;
Query_CustomerID_Txt.helpText="Customer Code - list of values available.";
Query_CustomerID_Txt.logicOn = [Query_CustomerID_Txt.dataBinding,Customer_LOV.dataBinding];

	/** the function will be applyed based on a change to the underlying DOM */
Query_CustomerID_Txt.logic = function(event){
	if(event.getXPath() == Query_CustomerID_Txt.dataBinding){
		var codeId = Services.getValue(Query_CustomerID_Txt.dataBinding);
		if(codeId==null||codeId==""){
			Services.setValue(Query_CustomerDescription_Txt.dataBinding,"");
		}else{
			if(IsInteger(codeId) && codeId.length == 4 && /^\d*$/.test(codeId)) {
				Services.setValue(Query_CustomerDescription_Txt.dataBinding,Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + codeId + "]/CustomerName"));
			}else{
				Services.setValue(Query_CustomerDescription_Txt.dataBinding,"");
			}
		}
	}
	if(event.getXPath() == Customer_LOV.dataBinding){
		var lovSelectedCode = Services.getValue(Customer_LOV.dataBinding);
		if(lovSelectedCode != null){
			var lovSelectedDesc = Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + lovSelectedCode + "]/CustomerName")
			Services.setValue(Query_CustomerID_Txt.dataBinding, lovSelectedCode);
			if(IsInteger(lovSelectedCode) && lovSelectedCode.length == 4 && /^\d*$/.test(lovSelectedCode)) {
				Services.setValue(Query_CustomerDescription_Txt.dataBinding,lovSelectedDesc);
			}else{
				Services.setValue(Query_CustomerDescription_Txt.dataBinding,"");
			}
		}
	}
}
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_CustomerID_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_CustomerID_Txt.validate = function()
{
	var custCode = Services.getValue(Query_CustomerID_Txt.dataBinding);
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
	used to configure adaptors to be excluded from Form Validation
	@return true
 */	
Query_CustomerID_Txt.isTemporary = function(){
	return true;
}
Query_CustomerID_Txt.componentName="Customer Code";


//*****************************************************************************************************************/
		/** Customer Description */
Query_CustomerDescription_Txt.maxLength=70;
Query_CustomerDescription_Txt.tabIndex = 30;
Query_CustomerDescription_Txt.helpText="Customer Name.";
Query_CustomerDescription_Txt.componentName="Customer Name.";
/** 
	used to configure adaptors to be excluded from Form Validation
	@return true
 */	
Query_CustomerDescription_Txt.isTemporary = function(){
	return true;
}

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Query_CustomerDescription_Txt.transformToDisplay = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}

		/** 
		 * This function allows the displayed value to be
		 * arbitrarily transformed before it is stored 
		 * in the DataModel.
		 * @param [String] value the value to be transformed
		 * @return the new value		 
		 */
Query_CustomerDescription_Txt.transformToModel = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_CustomerDescription_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_CustomerDescription_Txt.validate = function(){
	return null;
	/*var creditorName = Services.getValue(Query_CustomerDescription_Txt.dataBinding);	
	if(isPartialValidPersonName(creditorName)) {
		return null;
	} else { 
		return ErrorCode.getErrorCode("Caseman_CustomerNameNotNumeric_Msg");
	}*/
};
Query_CustomerDescription_Txt.readOnlyOn = [];	

		/** 
		 * specifies that Query_CustomerDescription_Txt
		 * is a read only field
		 * @return true
		 */		
Query_CustomerDescription_Txt.isReadOnly = function(event){ 
	return true;
}



/*********************************************************************************************/
		/** Date Received */
Query_DateReceived_Txt.helpText="Date tape or disk received.";
Query_DateReceived_Txt.componentName="Date tape or disk received.";
Query_DateReceived_Txt.tabIndex = 50;
Query_DateReceived_Txt.maxLength=11;
/** 
	used to configure adaptors to be excluded from Form Validation
	@return true
 */
Query_DateReceived_Txt.isTemporary = function(){
	return true;
}

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Query_DateReceived_Txt.transformToDisplay = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}

		/** 
		 * This function allows the displayed value to be
		 * arbitrarily transformed before it is stored 
		 * in the DataModel.
		 * @param [String] value the value to be transformed
		 * @return the new value		 
		 */
Query_DateReceived_Txt.transformToModel = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_DateReceived_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_DateReceived_Txt.validate = function() {
	var ec = null;
	var  dateReceived = Services.getValue(Query_DateReceived_Txt.dataBinding);
	
	
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


/********************************************************************************************************/
		/** Date Returned */
Query_DateReturned_Txt.helpText="Date tape or disk returned to the Customer.";
Query_DateReturned_Txt.componentName="Date Returned";
Query_DateReturned_Txt.tabIndex = 60;
/** 
	used to configure adaptors to be excluded from Form Validation
	@return true
 */
Query_DateReturned_Txt.isTemporary = function(){
	return true;
}
Query_DateReturned_Txt.maxLength=11;


		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Query_DateReturned_Txt.transformToDisplay = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}


		/**
		 * This function allows the displayed value to be
		 * arbitrarily transformed before it is stored 
		 * in the DataModel.
		 * @param [String] value the value to be transformed
		 * @return the new value		 
		 */
Query_DateReturned_Txt.transformToModel = function(value)
{
	return (null != value) ? Trim(value.toUpperCase()) : null;
}
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_DateReturned_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_DateReturned_Txt.validate = function() {
	var ec = null;
	var  dateReturned = Services.getValue(Query_DateReturned_Txt.dataBinding);
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
}//*****************************************************************************************************************/
// File Name
Query_FileName_Txt.maxLength=10;
Query_FileName_Txt.tabIndex = 70;
Query_FileName_Txt.helpText="Name of file, eg. 1500JG.123.";
Query_FileName_Txt.componentName="File Name";

		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Query_FileName_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}


		/**
		 * This function allows the displayed value to be
		 * arbitrarily transformed before it is stored 
		 * in the DataModel.
		 * @param [String] value the value to be transformed
		 * @return the new value		 
		 */
Query_FileName_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Query_FileName_Txt.isTemporary = function(){
	return true;
}
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Query_FileName_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */
Query_FileName_Txt.validate = function(){  
	var ec = null;
	var  fileName = Services.getValue(Query_FileName_Txt.dataBinding);
	if(fileName.indexOf("%") == -1 && fileName.length < 10){
			ec = ErrorCode.getErrorCode("Caseman_FileNameNot10Characters_Msg");
	} else { 
		var regExp = /\%?/g ;
			/* remove % symbol from the text */
		var updatedFileName = fileName.replace(regExp,"");
			/* check if the number of chars is less than 3 */
		if(updatedFileName.length<3){
			ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
		}else{
				/* remove spaces and check that the text contains at least one char rather than spaces */
			updatedFileName = updatedFileName.replace(/ /g,"");		
			if(updatedFileName.length == 0 ){
				ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
			}
		}
	}
	return ec;

}


/****************************** paging fields in the Grid.***********************************/

		/** Binding Actions to Query_Grid_Prev */
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

		/**Binding keys and mouse events to Query_Grid_Prev*/
Query_Grid_Prev.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_P, element: "Query_popup", alt: true }            	   
            	  ]
      }
};

Query_Grid_Prev.helpText = "Display the previous page of records.";
Query_Grid_Prev.tabIndex = 94;
Query_Grid_Prev.enableOn = [GRID_PAGE_NUMBER,"/ds/var/page/disableNavigation"];

/**
 * @return boolean based on the value of GRID_PAGE_NUMBER
 */
Query_Grid_Prev.isEnabled = function() {
	if(Services.getValue("/ds/var/page/disableNavigation")=="true"){
		return false;
	}
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	return (! isNaN(pageNumber) && pageNumber > 1);
}


		/** Binding Actions to Query_Grid_Next */
Query_Grid_Next.actionBinding = function() {
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	if(isNaN(pageNumber)) {
		pageNumber = 2;
	} else {
		pageNumber++;
	}
	Services.removeNode(GRID_XPATH); 
	executeSummSearch(queryDom,GRID_PAGE_SIZE ,pageNumber);
	Services.setValue(GRID_PAGE_NUMBER,pageNumber);
}

/**Binding keys and mouse events to Query_Grid_Next*/
Query_Grid_Next.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_N, element: "Query_popup", alt: true }            	   
            	  ]
      }
};

Query_Grid_Next.helpText = "Display the next page of records.";
Query_Grid_Next.tabIndex = 98;
Query_Grid_Next.enableOn = [GRID_PAGE_NUMBER,Query_Tapes_Grid.dataBinding,"/ds/var/page/disableNavigation"];

/**
 * @return boolean based on the value of GRID_PAGE_NUMBER and 
 * Query_Tapes_Grid.dataBinding
 */
Query_Grid_Next.isEnabled = function() {
	if(Services.getValue("/ds/var/page/disableNavigation")=="true"){
		return false;
	}
	var pageNumber = parseInt(Services.getValue(GRID_PAGE_NUMBER));
	var nodeCount = Services.countNodes(Query_Tapes_Grid.srcData + "/" + Query_Tapes_Grid.rowXPath);
	return nodeCount >= GRID_PAGE_SIZE;
}

/** 
 * specifies that Query_Grid_PageNumber
 * is a read only field
 * @return true
 */		
Query_Grid_PageNumber.isReadOnly = function() {
	return true;
}
Query_Grid_PageNumber.helpText = "Displaying page number";
Query_Grid_PageNumber.tabIndex = 96;
Query_Grid_PageNumber.logicOn = [GRID_PAGE_NUMBER];


/**
 The function will be applyed based on a change to the underlying DOM 
 */
Query_Grid_PageNumber.logic = function(evt){
	Services.setValue(Query_Grid_PageNumber.dataBinding, Services.getValue(GRID_PAGE_NUMBER));
}

/******************************Library Number***************************************************/
Master_LibraryNumber_Txt.helpText="Tape Library Number";
Master_LibraryNumber_Txt.tabIndex = 10;
Master_LibraryNumber_Txt.maxLength=9;
Master_LibraryNumber_Txt.componentName="Tape Library Number";

	
/**
 * Function that will be invoked to determine if 
 * the content of Master_LibraryNumber_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Master_LibraryNumber_Txt.validate = function()
{
	var ec = null;
	var value = Services.getValue(Master_LibraryNumber_Txt.dataBinding);
	// Check value is a valid number
	if ( !isNum(value))
	{
		ec = ErrorCode.getErrorCode("CaseMan_LibraryNumberNotNumeric_Msg");
	}
	return ec;
	
}

Master_LibraryNumber_Txt.logicOn = [Master_LibraryNumber_Txt.dataBinding];


/** 
	The function will be applyed based on a change to the underlying DOM 
*/
Master_LibraryNumber_Txt.logic = function()
{
	var fc = FormController.getInstance() ;
	var libraryNumberAdaptor = fc.getAdaptorById("Master_LibraryNumber_Txt");
	if(SEARCH_RESULT == false){
		if(Services.getValue(Master_LibraryNumber_Txt.dataBinding) == ""){
			clearMainScreen();
		}
		else if(Services.getValue(Master_LibraryNumber_Txt.dataBinding) != null && libraryNumberAdaptor.getValid()){
			var newDOM = XML.createDOM(null, null, null);		
			if(FIRST_LIBRARY_NUMBER_SET== true)
			{
				FIRST_LIBRARY_NUMBER_SET = false;				
				var libraryNumber = Services.getValue(Master_LibraryNumber_Txt.dataBinding);
				executeSearch(libraryNumber);

	
			}
		}
	}
	else{
		SEARCH_RESULT = false;
	}
}

/**
 * The function is called to see if the user must enter a value 
 * @return true
 */
Master_LibraryNumber_Txt.isMandatory = function()
{
	return true;
}

/* 
 * specifies that Master_LibraryNumber_Txt
 * is a read only field
 * @return true
 */	
Master_LibraryNumber_Txt.isReadOnly = function()
{
	return false;
}

/******************************Degaussed***************************************************/
Master_Degaussed_CBx.helpText="Has tape or disk been degaussed?";
Master_Degaussed_CBx.tabIndex = 30;
Master_Degaussed_CBx.maxLength = 1;
Master_Degaussed_CBx.componentName="Degaussed";

Master_Degaussed_CBx.enableOn = [Page_Mode.dataBinding];

/** 
* The function checks weather the check box Master_Degaussed_CBx is enabled 
* @return boolean based on the value of Page_Mode.dataBinding
 */
Master_Degaussed_CBx.isEnabled= function()
{
	var Mode= Services.getValue(Page_Mode.dataBinding);
	if(Mode=="U"){
		return true;
	}
	else{
		return false;
	}
}

Master_Degaussed_CBx.logicOn=[Master_Degaussed_CBx.dataBinding];


/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Master_Degaussed_CBx.logic=function(e)
{	
	if(e.getXPath() == Master_Degaussed_CBx.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
};


/******************************Customer ID***************************************************/
Master_CustomerID_Txt.maxLength=4;
Master_CustomerID_Txt.tabIndex = 40;
Master_CustomerID_Txt.helpText="Customer Code.";
Master_CustomerID_Txt.componentName="Customer Code - list of values available.";

/** 
 * specifies that Master_CustomerID_Txt
 * is a read only field
 * @return true
 */	
Master_CustomerID_Txt.isReadOnly = function()
{
	return true;
}
/******************************Customer Description**********************************************/

Master_CustomerDescription_Txt.maxLength=70;
Master_CustomerDescription_Txt.tabIndex = 50;
Master_CustomerDescription_Txt.helpText="Customer Name.";
Master_CustomerDescription_Txt.componentName="Customer Name.";

/** 
 * specifies that Master_CustomerDescription_Txt
 * is a read only field
 * @return true
 */	
Master_CustomerDescription_Txt.isReadOnly = function()
{
	return true;
}
/****************************** Date Received****************************************************/

Master_DateReceived_Cal.helpText="Date tape or disk received.";
Master_DateReceived_Cal.componentName="Date tape or disk received.";
Master_DateReceived_Cal.tabIndex = 60;

/**
 * specifies that Master_DateReceived_Cal
 * is a read only field
 * @return true
 */	
Master_DateReceived_Cal.isReadOnly = function()
{
	return true;
}
/******************************Date Returned*****************************************************/

Master_DateReturned_Cal.helpText="Date tape or disk returned to the Customer.";
Master_DateReturned_Cal.componentName="Date Returned";
Master_DateReturned_Cal.tabIndex = 70;

/** 
 * The function is called to see if the user must enter a value 
 * @return true
 */
Master_DateReturned_Cal.isMandatory = function()
{
	return true;
}

/** 
 * specifies that Master_DateReturned_Cal
 * is a read only field
 * @return true
 */	
Master_DateReturned_Cal.isReadOnly = function()
{
	return false;
}

	
/**
 * Function that will be invoked to determine if 
 * the content of Master_DateReturned_Cal
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Master_DateReturned_Cal.validate = function()
{
	var ec = null;


	var returnedDateValue = Services.getValue(Master_DateReturned_Cal.dataBinding);
	var receivedDateValue = Services.getValue(Master_DateReceived_Cal.dataBinding);
	
	var todayVal = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");
	
	if (returnedDateValue!= null && returnedDateValue!= ''&& returnedDateValue > todayVal){
		ec = ErrorCode.getErrorCode("CaseMan_DateReturnedInFuture_Msg");
		return ec;
	}
	else if(returnedDateValue!=null && returnedDateValue!=''&& receivedDateValue!= null && returnedDateValue < receivedDateValue)
	{
		ec = ErrorCode.getErrorCode("CaseMan_DateReturnedEarlierThanDateReceived_Msg");
		return ec;
	}
	
}

Master_DateReturned_Cal.logicOn=[Master_DateReturned_Cal.dataBinding];


/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Master_DateReturned_Cal.logic=function(e)
{
	if(e.getXPath() == Master_DateReturned_Cal.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
};

Master_DateReturned_Cal.enableOn = [Page_Mode.dataBinding];

/**
 * The function checks weather the field Master_DateReturned_Cal is enabled
 * @return boolean based on the value of Page_Mode.dataBinding 
 */
Master_DateReturned_Cal.isEnabled= function()
{
	var Mode= Services.getValue(Page_Mode.dataBinding);
	if(Mode=="U"){
		return true;
	}
	else{
		return false;
	}
}


/****************************** Date To Operation*********************************************************/
Master_DateToOperations_Cal.helpText="Date tape or disk passed to Operations.";
Master_DateToOperations_Cal.componentName="Date To Operations";
Master_DateToOperations_Cal.tabIndex = 80;

/**
 * specifies that Master_DateToOperations_Cal
 * is a read only field
 * @return true
 */	
Master_DateToOperations_Cal.isReadOnly = function()
{
	return true;
}


/******************************Comments****************************************************/
Master_Comments_Txt.maxLength=50;
Master_Comments_Txt.tabIndex = 110;
Master_Comments_Txt.helpText="Any comments relating to this tape or disk as a whole.";
Master_Comments_Txt.componentName="Comments";

/**
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Master_Comments_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Master_Comments_Txt.logicOn = [Master_Comments_Txt.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Master_Comments_Txt.logic = function(e){
	if(e.getXPath() == Master_Comments_Txt.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
}

Master_Comments_Txt.enableOn = [Page_Mode.dataBinding];

/**
* The function checks weather the Master_Comments_Txt field is enabled 
* @return boolean based on the value of Page_Mode.dataBinding 
*/
Master_Comments_Txt.isEnabled= function()
{
	var Mode= Services.getValue(Page_Mode.dataBinding);
	if(Mode=="U"){
		return true;
	}
	else{
		return false;
	}
}


//*****************************************************************************************************************/
//*****************************************************************************************************************/
// Tape File Details
//*****************************************************************************************************************/
// File Name

Master_File_Name_Txt.maxLength=10;
Master_File_Name_Txt.tabIndex = 130;

/**
 * specifies that Master_File_Name_Txt
 * is a read only field
 * @return true
 */	
Master_File_Name_Txt.isReadOnly = function()
{
	return true;
}
Master_File_Name_Txt.helpText="Name of file, eg. 1500JG.123.";
Master_File_Name_Txt.componentName="File Name";

/** 
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Master_File_Name_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Master_File_Name_Txt.retrieveOn=[Master_TapeFiles_Grid.dataBinding];
//*****************************************************************************************************************/
// Number Of records
Master_Number_Of_Records_Txt.maxLength=5;
Master_Number_Of_Records_Txt.tabIndex = 140;

/** 
 * specifies that Master_Number_Of_Records_Txt
 * is a read only field
 * @return true
 */	
Master_Number_Of_Records_Txt.isReadOnly = function (){
	return true;   	
};

Master_Number_Of_Records_Txt.mandatoryOn = [Master_TapeFiles_Grid.dataBinding];

/** 
 * The function is called to see if the user must enter a value 
 * @return true
 */		 
Master_Number_Of_Records_Txt.isMandatory = function()
{
	return true;
}

Master_Number_Of_Records_Txt.helpText="Number of records in the file.";
Master_Number_Of_Records_Txt.componentName="Number Of Records";
Master_Number_Of_Records_Txt.validateOn = [Master_TapeFiles_Grid.dataBinding];
	
/**
 * Function that will be invoked to determine if 
 * the content of Master_Number_Of_Records_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Master_Number_Of_Records_Txt.validate = function()
{
	var ec = null;
	var value = Services.getValue(Master_Number_Of_Records_Txt.dataBinding);

	// Check value is Numeric 
	if ( !isNumPluseDotPluseMinus(value) )
	{
		ec = ErrorCode.getErrorCode("CaseMan_NumberOfRecordsNotNumeric_Msg");
	}
	else if(!isWholeNumber(value))
	{
		ec = ErrorCode.getErrorCode("CaseMan_NumberOfRecordsNotWholeNumber_Msg");
	}
	else if(value.length>5)
	{
	ec = ErrorCode.getErrorCode("CaseMan_NumberOfRecordsMoreThan5Digits_Msg");
	}
	else if(value==0)
	{                            
	ec = ErrorCode.getErrorCode("CaseMan_NumberOfRecordsZero_Msg");
	}
	return ec;
	
}

Master_Number_Of_Records_Txt.retrieveOn=[Master_TapeFiles_Grid.dataBinding];
Master_Number_Of_Records_Txt.logicOn = [Master_Number_Of_Records_Txt.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Master_Number_Of_Records_Txt.logic = function(e){
	if(e.getXPath() == Master_Number_Of_Records_Txt.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
};

Master_Number_Of_Records_Txt.enableOn = [TAPE_PATH + "/TapeFiles"];

/**
 * The function checks weather Master_Number_Of_Records_Txt field is enabled
 * @return boolean based on the value of [TAPE_PATH + "/TapeFiles"] 
 */
Master_Number_Of_Records_Txt.isEnabled = function(){
	var flag = false;
	if(Services.countNodes(FILE_PATH) > 0){
		flag = true;
	}
	return flag;
};

/** 
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Master_Number_Of_Records_Txt.transformToModel = function(value){
	if(value==null) return null;
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') break;
		value = value.substring(1);			
	}
	return value;
};

/******************************Warrant Fees Singn**********************************************/

Master_WarrantFeesCurrencySign_Txt.maxLength = 1;
Master_WarrantFeesCurrencySign_Txt.tabIndex = 150;
Master_WarrantFeesCurrencySign_Txt.helpText="Currency symbol of Warrant fees.";
Master_WarrantFeesCurrencySign_Txt.componentName="Currency symbol of Warrant fees.";

/** 
 * specifies that Master_Number_Of_Records_Txt
 * is a read only field
 * @return true
 */	
Master_WarrantFeesCurrencySign_Txt.isReadOnly = function()
{
	return true;
}	
/** 
* This function sets the default value to Master_WarrantFeesCurrencySign_Txt
*/
Master_WarrantFeesCurrencySign_Txt.setDefault = function() {
	Services.setValue(Master_WarrantFeesCurrencySign_Txt.dataBinding, "\xA3");	
}


/******************************Warrant Fees Amount*****************************************************/

Master_WarrantFeesAmount_Txt.helpText="Amount of Warrant fees.";
Master_WarrantFeesAmount_Txt.tabIndex = 160;
Master_WarrantFeesAmount_Txt.componentName="Warrant Fees Amount";
Master_WarrantFeesAmount_Txt.retrieveOn=[Master_TapeFiles_Grid.dataBinding];
Master_WarrantFeesAmount_Txt.maxLength=9;
Master_WarrantFeesAmount_Txt.validateOn = [Master_TapeFiles_Grid.dataBinding];

	
/**
 * Function that will be invoked to determine if 
 * the content of Master_WarrantFeesAmount_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */	
Master_WarrantFeesAmount_Txt.validate = function()
{
 var ec = null;
 var value = Services.getValue(Master_WarrantFeesAmount_Txt.dataBinding);
	
	
 	if(!isNumPluseDotPluseMinus(value))
	{ 
		ec = ErrorCode.getErrorCode("CaseMan_WarrantFeesNotNumeric_Msg");
	}
	else if(value<0 )
	{
	ec = ErrorCode.getErrorCode("CaseMan_WarrantFeesLessThanZero_Msg");
	}
	else if ( !isValidMoney(value) )
	{
		ec = ErrorCode.getErrorCode("CaseMan_WarrantFeesIncorrectFormat_Msg");
	}
	
	return ec;
 
}

/** 
 * specifies that Master_WarrantFeesAmount_Txt
 * is a read only field
 * @return true
 */	
Master_WarrantFeesAmount_Txt.isReadOnly = function(){
	return true;
};
Master_WarrantFeesAmount_Txt.mandatoryOn = [Master_File_Name_Txt.dataBinding, Master_TapeFiles_Grid.dataBinding];

/** 
 * The function is called to see if the user must enter a value 
 * @return true
 */		
Master_WarrantFeesAmount_Txt.isMandatory = function(){
    var fileName = Services.getValue(Master_File_Name_Txt.dataBinding);   
	var regExp = new RegExp(/[W][ET]/);	
	var fileNameAdaptor = Services.getAdaptorById("Master_File_Name_Txt");
	if(fileNameAdaptor.getValid() && regExp.test(fileName)) {return true;}
	else {return false;}
};

Master_WarrantFeesAmount_Txt.logicOn = [Master_WarrantFeesAmount_Txt.dataBinding];

/** 
 * The function will be applyed based on a change to the underlying DOM 
 */
Master_WarrantFeesAmount_Txt.logic = function(e){
	if(e.getXPath() == Master_WarrantFeesAmount_Txt.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
};


/** 
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed		
 * @return the new value 
 */
Master_WarrantFeesAmount_Txt.transformToModel = function(value){
	
	if(value==null) return null;
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') break;
		value = value.substring(1);			
	}
	if(value=="") return null;
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
};

/** 
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Master_WarrantFeesAmount_Txt.transformToDisplay = function(value){
	
	if(value==null) return null;
	value = Trim(value);
	while (value.charAt(0) == '0') {   // remove leading zeros
		if(value=='0') break;
		value = value.substring(1);			
	}
	if(value=="") return null;
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
};

//*****************************************************************************************************************/
Master_FileComments_Txt.tabIndex = 170;

/** 
 * specifies that Master_WarrantFeesAmount_Txt
 * is a read only field
 * @return true
 */	
Master_FileComments_Txt.isReadOnly = function()
{
	return false;
}

/**
 *  This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed		
 * @return the new value 
 */
Master_FileComments_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Master_FileComments_Txt.maxLength=80;
Master_FileComments_Txt.validateOn = [Master_TapeFiles_Grid.dataBinding];
	
/**
 * Function that will be invoked to determine if 
 * the content of Master_FileComments_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */	
Master_FileComments_Txt.validate = function(){
	var comments = Services.getValue(Master_FileComments_Txt.dataBinding);
	if(comments != null && comments.length>80) return ErrorCode.getErrorCode("Caseman_CommentsTooLarge_Msg");
	else return null;
};
Master_FileComments_Txt.helpText="Any comments relating to this file, maximum 80 characters allowed.";
Master_FileComments_Txt.componentName="Tape File Comments";
Master_FileComments_Txt.retrieveOn=[Master_TapeFiles_Grid.dataBinding];
Master_FileComments_Txt.logicOn = [Master_FileComments_Txt.dataBinding];

/** 
 * The function will be applyed based on a change to the underlying DOM 
 */
Master_FileComments_Txt.logic = function(e){
	if(e.getXPath() == Master_FileComments_Txt.dataBinding){
		EXIT_WITHOUT_SAVING = true;
	}
};

Master_FileComments_Txt.enableOn = [TAPE_PATH + "/TapeFiles"];

/**
* The function checks weather the Master_FileComments_Txt field is enabled
* @return boolean based on the value of Page_Mode.dataBinding 
*/
Master_FileComments_Txt.isEnabled = function(){
	var flag = false;
	if(Services.countNodes(FILE_PATH) > 0){
		flag = true;
	}
	return flag;
};
Master_Status_Txt.tabIndex = 180;

/**
 * specifies that Master_Status_Txt
 * is a read only field
 * @return true
 */	
Master_Status_Txt.isReadOnly = function()
{
	return true;
}
Master_Status_Txt.componentName="Status";
Master_Status_Txt.maxLength=7;
Master_Status_Txt.retrieveOn=[Master_TapeFiles_Grid.dataBinding];

Master_Status_Txt.logicOn = [Master_TapeFiles_Grid.dataBinding, Master_File_Name_Txt.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Master_Status_Txt.logic = function(){
	var TapeFileStatus = Services.getValue(TAPE_PATH+"/TapeFiles/TapeFile[./SurrogateKey="+Master_TapeFiles_Grid.dataBinding+"]/TapeFileStatus");
	if(TapeFileStatus != "" &&  TapeFileStatus != null) {
		var status = Services.getValue(Master_Status_Txt.dataBinding);
		var grid = Services.getValue(Master_TapeFiles_Grid.dataBinding);
	
		if(status == null && grid != null ) {
		
			var fileName = Services.getValue(Master_File_Name_Txt.dataBinding);
			var msg = ErrorCode.getErrorCode("CaseMan_InvalidStatus_Msg").getMessage();
			msg = msg + fileName ; 
			Services.setTransientStatusBarMessage(msg);
		}
	}		 
}
/*****************************************************************************************/
/**
 * Function to be invoked when the dialog button is pressed.
 * @param [Button] button the presses button
 */
function QueryDialogCallBack(button){
	switch(button){		
		
		case StandardDialogButtonTypes.YES:
			{   
				to_do_flag = "QUERY";
				var saveCallBackObject = new SaveOnlyCallBackObject();
				saveForm(saveCallBackObject);	
				Services.setFocus("Query_LibraryNumber_Txt");			
				break;
			}
		case StandardDialogButtonTypes.NO: 
			{	
			    clearMainScreen();
				var fc = FormController.getInstance();
				SEARCH_RESULTS_POPUP_FLAG=true;
				fc.showFormExtensionPopup("Query_popup");
				Services.setValue("/ds/var/page/queryPopupRaisedFlag", true);
				clearSearchScreen();
				Services.setFocus("Query_LibraryNumber_Txt");
				break;
			}
		case StandardDialogButtonTypes.CANCEL: break;
	}
};
// Buttons

////////////////////////////////////////////////////////////
function CustomerCallBackObject(){};

	/**
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
CustomerCallBackObject.prototype.onSuccess = function(objDom){
	Services.startTransaction();
		Services.replaceNode(FORM_XPATH + "/RefData/Customers", objDom);				
	Services.endTransaction();
};

	/**
	 * callback handler which gets invoked upon the return 
	 * error of the remote invocation.
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

Master_CustomerLOV.tabIndex = 40;

		/** Binding Actions to Master_CustomerLOV*/	
Master_CustomerLOV.actionBinding = function()
{
	Services.setValue(Customer_LOV.dataBinding,null);
	FormController.getInstance().showFormExtensionPopup("Customer_LOV");
}
Master_CustomerLOV.componentName="Customer LOV";
Master_CustomerLOV.helpText = "Request LOV for Customer";

function CallBackObject()
{
}

	/**
	 * callback handler which gets invoked upon the return 
	 * error of the remote invocation.
	 * @param [Exception] exception from the invocation
	 */
CallBackObject.prototype.onError = function(exception)
{
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
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
CallBackObject.prototype.onSuccess = function(objDom)
{
		CallBackObjectSuccess(objDom);
} 

	/** 
	 * function to handle the dom resulting from the remote invocation	
	 * @param [Dom] objDom resulting form the invocation
	 */
function CallBackObjectSuccess (objDom)
{
		
	if(SEARCH_RESULTS_POPUP_FLAG == false){
		clearMainScreen();
		if(objDom.selectNodes("/ReturnedTapes/ReturnedTape").length > 0){
		var drValue = XML.getPathTextContent(objDom, "/ReturnedTapes/ReturnedTape/DateReturned");
		if(drValue == null || drValue == ""){
			var currentTime = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");			
			XML.setElementTextContent(objDom, "/ReturnedTapes/ReturnedTape/DateReturned", currentTime)
		 }
	    }
		
		
		Services.removeNode(FORM_XPATH + "/Model/ReturnedTapes");
		Services.addNode(objDom, FORM_XPATH + "/Model");
		var nodeCount = parseInt(Services.countNodes(TAPE_PATH));
		if(nodeCount == 0){
			var msg = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage();
			clearMainScreen();
			Services.setValue(Page_Mode.dataBinding,'');
			Services.setTransientStatusBarMessage(msg);
		}
		else Services.setValue(Page_Mode.dataBinding,'U');
		
		FIRST_LIBRARY_NUMBER_SET = true;
		Services.setFocus("Master_LibraryNumber_Txt");
		
	}
	else{		
		Services.removeNode(VAR_XPATH + "/page/ReturnedTapes");
		Services.addNode(objDom, VAR_XPATH + "/page");
		var nodeCount = parseInt(Services.countNodes(GRID_XPATH +"/ReturnedTape"));
			
		if(nodeCount == 0){
			var msg = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage();			
			Services.setTransientStatusBarMessage(msg);
		}
		else if(nodeCount == 1)
		{
			Query_Select_Btn.actionBinding();
			Services.setFocus("Master_LibraryNumber_Txt");
		}
	}

}

	/**
	 * Update the DateReturned in the dom object
	 * with the current date based on the value 
	 * of "/ReturnedTape/LibraryNumber"	and return the updated 
	 * dom object
	 * @param [Dom] objDom to be updated
	 * @return the updated dom object
	 */
function setDefaultDate(objDom){	
		var drValue = XML.getPathTextContent(objDom, "/ReturnedTape/LibraryNumber");
		if(drValue == null || drValue == ""){
			var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");			
			XML.setElementTextContent(objDom, "/ReturnedTape/DateReturned", currentDate);
		}	
	return objDom;
}
//*******************************************************************************************************
function SaveOnlyCallBackObject(){};


	/** 
	 * callback handler which gets invoked upon the return 
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
SaveOnlyCallBackObject.prototype.onError = function(exception)
{
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
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
SaveOnlyCallBackObject.prototype.onSuccess = function(objDom) {	
	switch(to_do_flag){
			case "CLEAR":
			{				
				Services.setValue(SAVING_FINISHED_XPATH, "OK_CLEAR");
				Services.setFocus("Master_LibraryNumber_Txt");
				break;
			}			
			case "QUERY" :
			{			
				Services.startTransaction();	
				Services.setValue(SAVING_FINISHED_XPATH, "OK_QUERY");	
				Services.setFocus("Query_LibraryNumber_Txt");
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
} ;

	/** 
	 * callback handler which gets invoked upon the return 
	 * UpdateLockedException of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */

SaveOnlyCallBackObject.prototype.onUpdateLockedException = function (exception) {
		
		Services.showDialog(
			StandardDialogTypes.OK_CANCEL,
			function callback(button){
				switch(button){
					case StandardDialogButtonTypes.OK:
					{	
						var currentLibNumber = Services.getValue(Master_LibraryNumber_Txt.dataBinding);					    
						Services.setValue(Master_LibraryNumber_Txt.dataBinding, "");
						Services.setValue(Master_LibraryNumber_Txt.dataBinding, currentLibNumber); 											   
						break;
					}	
					case StandardDialogButtonTypes.CANCEL:
					{	
						switch(to_do_flag){
							case ""     : break;
							case "CLEAR": clearMainScreen();Services.setFocus("Master_LibraryNumber_Txt"); break;
							case "QUERY": clearMainScreen(); Services.setFocus("Query_LibraryNumber_Txt"); Master_Query_Btn.actionBinding(); break;
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


//*******************************************************************************************************
function SaveCallBackObject()
{
}

	/**
	 *  callback handler which gets invoked upon the return 
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
SaveCallBackObject.prototype.onError = function(exception)
{
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
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
SaveCallBackObject.prototype.onSuccess = function(objDom) {
	Services.replaceNode(TAPE_PATH,objDom);
	var msg = ErrorCode.getErrorCode("CaseMan_ChangesSaved_Msg").getMessage();
	Services.showDialog(
				StandardDialogTypes.OK,
				function(){
					return;
				},msg);
	Services.setFocus("Master_LibraryNumber_Txt");	
	
} 
	/** 
	 * callback handler which gets invoked upon the return 
	 * UpdateLockedException of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
SaveCallBackObject.prototype.onUpdateLockedException = function (exception) {

		Services.showDialog(
			StandardDialogTypes.OK_CANCEL,
			function callback(button){
				switch(button){
					case StandardDialogButtonTypes.OK:
					{	
						var currentLibNumber = Services.getValue(Master_LibraryNumber_Txt.dataBinding);					    
						Services.setValue(Master_LibraryNumber_Txt.dataBinding, "");
						Services.setValue(Master_LibraryNumber_Txt.dataBinding, currentLibNumber); 											   
						break;
					}	
					case StandardDialogButtonTypes.CANCEL:
					{	
						switch(to_do_flag){
							case ""     : break;
							case "CLEAR": clearMainScreen(); break;
							case "QUERY": clearMainScreen(); Master_Query_Btn.actionBinding(); break;
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
//**************************************************************************************************

Query_Search_Btn.componentName="Search Button";
Query_Search_Btn.tabIndex = 80;
Query_Search_Btn.helpText = "Search for Tapes / Tape Files.";

		/** Binding Actions to Query_Search_Btn */
Query_Search_Btn.actionBinding = function()
{
	var fc = FormController.getInstance() ;
	var libraryNumberAdaptor = fc.getAdaptorById("Query_LibraryNumber_Txt");
	var customerIDAdaptor = fc.getAdaptorById("Query_CustomerID_Txt");
	var customerDescAdaptor = fc.getAdaptorById("Query_CustomerDescription_Txt");
	var dateReceivedAdaptor = fc.getAdaptorById("Query_DateReceived_Txt"); 
	var dateReturnedAdaptor = fc.getAdaptorById("Query_DateReturned_Txt"); 
	var fileNameAdaptor = fc.getAdaptorById("Query_FileName_Txt");
	var ec = null;
		
	if(libraryNumberAdaptor !=null && !libraryNumberAdaptor.getValid()){	
		Services.setFocus("Query_LibraryNumber_Txt");
	}
	else if(customerIDAdaptor !=null && !customerIDAdaptor.getValid()){
    	Services.setFocus("Query_CustomerID_Txt");
	}
	else if(customerDescAdaptor !=null && !customerDescAdaptor.getValid()){
    	Services.setFocus("Query_CustomerDescription_Txt");
	}
	else if(dateReceivedAdaptor!=null && !dateReceivedAdaptor.getValid()){
    	Services.setFocus("Query_DateReceived_Txt");
	}
	else if(dateReturnedAdaptor!=null && !dateReturnedAdaptor.getValid()){
    	Services.setFocus("Query_DateReturned_Txt");
	}
	else if(fileNameAdaptor != null && !fileNameAdaptor.getValid()){
    	Services.setFocus("Query_FileName_Txt");	
	} 
	else if(isEmptySearch()) {
    		var msg = ErrorCode.getErrorCode("CaseMan_EmptySearch_Msg").getMessage();
		  	Services.setTransientStatusBarMessage(msg);
		  	Services.setFocus("Query_LibraryNumber_Txt");  
    } else { // form is valid
		
		var newDOM = XML.createDOM(null, null, null);
		var mcNode = Services.getNode(QUERY_PATH);
		if(mcNode == null){
			Services.setValue(QUERY_PATH,"");
			mcNode = Services.getNode(QUERY_PATH);
		}
		
		newDOM.appendChild(mcNode);
		queryDom = newDOM;
		resetQueryGrid();
		Services.setValue(GRID_PAGE_NUMBER,1);
		var checkSize = GRID_PAGE_SIZE + 1;
		executeSummSearch(newDOM,checkSize,Services.getValue(GRID_PAGE_NUMBER));
		Services.setFocus("Query_LibraryNumber_Txt");
	}
}
function SummaryCallbackObject() {
}

		/** To get ReturnedTapes  */
function executeSummSearch(queryDOM,pageSize,pageNumber){
		var summaryCallbackObj = new SummaryCallbackObject() ;
		var summParams = new ServiceParams() ;
		summParams.addSimpleParameter("pageNumber", pageNumber);	
		summParams.addSimpleParameter("pageSize", pageSize);		
		summParams.addDOMParameter("Query", queryDOM);
		Services.setValue("/ds/var/page/disableNavigation","true");		
	    Services.callService("getSummaryTapes",summParams,summaryCallbackObj,true);
		Services.setFocus("Query_LibraryNumber_Txt");
}

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */

SummaryCallbackObject.prototype.onSuccess = function(objDom)
{
		SummaryCallbackObjectSuccess(objDom);
} 
	/**
	 *  callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
SummaryCallbackObject.prototype.onError = function(exception){
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
	 * function will be called upon the return
	 * success of the remote invocation.
	*/
function SummaryCallbackObjectSuccess(objDom){
	Services.setValue("/ds/var/page/disableNavigation",null);
	var libNum = XML.getPathTextContent(objDom,"/ReturnedTapes/ReturnedTape/LibraryNumber");
	if(libNum == null){
		//NoRecordsRetrieved
		Services.setValue( GRID_PAGE_NUMBER , "");
		var ec = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
	}else{
   		var nodeCount = parseInt(objDom.selectNodes("/ReturnedTapes/ReturnedTape").length);
   		var gpn = Services.getValue(GRID_PAGE_NUMBER);
   		if(nodeCount == 1 && gpn == 1){
			Services.replaceNode(GRID_XPATH,objDom);
			Query_Select_Btn.actionBinding();
		}else {
			if(nodeCount > GRID_PAGE_SIZE){
				Services.replaceNode("/ds/var/page/tempTapes/ReturnedTapes",objDom);
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
		* The finction performs a search operation to
		* get ReturnedTapes according to the libraryNumber 
		*/
function executeSearch(libraryNumber){
		var callbackObj = new CallBackObject() ;
		var params = new ServiceParams() ;
		params.addSimpleParameter("LibraryNumber",libraryNumber);
		Services.callService("getReturnedTapes",params,callbackObj,true);

}

Query_Select_Btn.componentName="Select Button";
Query_Select_Btn.tabIndex = 100;
Query_Select_Btn.helpText = "Request selection of a Tape.";

Query_Select_Btn.enableOn=[GRID_XPATH];
/**
 * The function checked wether the Query_Select_Btn is enabled
 * @return boolean based on the value of GRID_XPATH +"/ReturnedTape"
 */
Query_Select_Btn.isEnabled= function(){
	var nodeCount = parseInt(Services.countNodes(GRID_XPATH +"/ReturnedTape"));
	if(nodeCount==0){
		return false;
	}else{
		return true;
	}
}

		/** Binding Actions to Query_Select_Btn*/
Query_Select_Btn.actionBinding = function()
{
	SEARCH_RESULTS_POPUP_FLAG=false;
	SEARCH_RESULT = true;
	var key = Services.getValue(Query_Tapes_Grid.dataBinding);
	var mcNode = Services.getNode(GRID_XPATH + "/ReturnedTape[./SurrogateKey =" + key + "]");
	var newDom = XML.createDOM(null,null,null);
	newDom.appendChild(mcNode);
	var drValue = XML.getPathTextContent(newDom, "/ReturnedTape/DateReturned");
	if(drValue == null || drValue == ""){
		var currentDate = Services.getValue(FORM_XPATH + "/RefData/Date/TodayDate");
		XML.setElementTextContent(newDom, "/ReturnedTape/DateReturned", currentDate);
	}
	Services.replaceNode(TAPE_PATH, newDom)
	var libraryNumber = Services.getValue(TAPE_PATH + "/LibraryNumber" );
	FIRST_LIBRARY_NUMBER_SET = false;
	executeSearch(libraryNumber);
	
	var fc = FormController.getInstance();
	fc.hideFormExtensionPopup("Query_popup");
	Services.setValue(GRID_PAGE_NUMBER , "");
	resetQueryGrid();
	clearSearchScreen();
	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);
	Services.setValue(Page_Mode.dataBinding,'U');
	Services.setFocus("Master_LibraryNumber_Txt");
	Services.setTransientStatusBarMessage("OK");
	
}

	/** binding keys and mouse events to Query_Select_Btn */
Query_Select_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [ {element: "Query_Tapes_Grid"} ],
            keys: []
      }
};

Main_Save_Btn.tabIndex = 190;
Main_Save_Btn.enableOn=[Page_Mode.dataBinding];

	/** binding keys and mouse events to Page_Mode.dataBinding */
Main_Save_Btn.isEnabled= function()
{
	var Mode= Services.getValue(Page_Mode.dataBinding);
	if(Mode=="U"){
		return true;
	}
	else{
		return false;
	}
}
//***********************************************************************

		/** Binding Actions to Main_Save_Btn*/
Main_Save_Btn.actionBinding = function()
{
	var saveCallback = new SaveCallBackObject() ;
	saveForm(saveCallback);
};

/******************************************************************/

	/** Save the Updated Form*/
function saveForm(save_callbackObj){
	 		
				 		
	var InValidFlds = FormController.getInstance().validateForm(false);	
	if(InValidFlds.length == 0){
		
		var newDOM = XML.createDOM(null, null, null);		
		var mcNode = Services.getNode(TAPE_PATH);
		if(mcNode == null){
			Services.setValue(TAPE_PATH,"");
			mcNode = Services.getNode(TAPE_PATH);
		}
		newDOM.appendChild(mcNode);
		var params = new ServiceParams() ;
		params.addDOMParameter("ReturnedTape", newDOM);
		Services.callService("updateTapes",params,save_callbackObj,true);
		
		EXIT_WITHOUT_SAVING = false;
	}
	else { 	
	  		var GRID_IS_NOT_VALID = false;
	 		var fieldToSetFocus = "";
	 		var statusBarMessage = null; 
	 		var errorMessage =
						 "Form cannot be submitted as it has invalid values. The following fields have invalid values:";   	    		 
			fieldToSetFocus = InValidFlds[0].getId();	
	 	    for(var j=0;j<InValidFlds.length; j++){
	 		  	if(InValidFlds[j].getId()=="Master_TapeFiles_Grid"){GRID_IS_NOT_VALID = true ; continue;}
	 		  	errorMessage = errorMessage + "<br>"+InValidFlds[j].getDisplayName();
	 		}
	 		
	    	if(GRID_IS_NOT_VALID&&InValidFlds.length==1){
				var fileCount = Services.countNodes(FILE_PATH);		
				for(var i=1; i<=fileCount; i++){
					var key = Services.getValue(FILE_PATH+"["+i+"]/SurrogateKey");
					var fileName    = Services.getValue(FILE_PATH+"["+i+"]/FileName");
					var noOfRecords = Services.getValue(FILE_PATH+"["+i+"]/NumberOfRecords");
					var warrantFees = Services.getValue(FILE_PATH+"["+i+"]/Fees");
					var fileComments= Services.getValue(FILE_PATH+"["+i+"]/Comments");
					
					var fileType = fileName.substring(4,6);
					
					if(!validateNoOfRecords(noOfRecords)){								
						Services.setValue(Master_TapeFiles_Grid.dataBinding,'');						
						Services.setValue(Master_TapeFiles_Grid.dataBinding,key);						
						fieldToSetFocus = "Master_Number_Of_Records_Txt";	
						errorMessage = errorMessage+"<br>Number of Records";
						if(noOfRecords==null||noOfRecords=="")
							statusBarMessage = "No value is entered for mandatory field Number of Records.";
						break;		// break the for loop		
					}
					else if(!validateWarrantFees(warrantFees, fileType)) {
						Services.setValue(Master_TapeFiles_Grid.dataBinding,'');						
						Services.setValue(Master_TapeFiles_Grid.dataBinding,key);
						fieldToSetFocus = "Master_WarrantFeesAmount_Txt";
						errorMessage = errorMessage+"<br>Warrant Fees";
						if(warrantFees==null||warrantFees=="")
							statusBarMessage = "No value is entered for mandatory field Warrant Fees.";
						
						break;     // break the for loop
					}					
				}  // end for loop
	    	}
	    	else {
	    		var k=0;
	    		if(GRID_IS_NOT_VALID&&InValidFlds[0].getId()=="Master_TapeFiles_Grid")k=1;
	    		fieldToSetFocus = InValidFlds[k].getId();	    			    		
	    		if(InValidFlds[k].hasIsMandatory&&InValidFlds[k].getMandatory())
	    			statusBarMessage = "No value is entered for mandatory field "+InValidFlds[k].getDisplayName()+".";
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
    		return InValidFlds.length;
    	 }
	 		    	    	 
};

/****************************************************************/
Query_Cancel_Btn.componentName="Cancel Button";
Query_Cancel_Btn.tabIndex = 120;
Query_Cancel_Btn.helpText = "Close without selecting.";

		/** Binding Actions to Query_Cancel_Btn*/
Query_Cancel_Btn.actionBinding = function()
{
	resetQueryGrid();
	clearSearchScreen();
	Services.startTransaction();
    SEARCH_RESULTS_POPUP_FLAG=false;
	FormController.getInstance().hideFormExtensionPopup("Query_popup");
	Services.setValue("/ds/var/page/queryPopupRaisedFlag", false);
	var msg = ErrorCode.getErrorCode("CaseMan_QueryCancelled_Msg").getMessage();
	Services.setFocus("Master_LibraryNumber_Txt");
	Services.setTransientStatusBarMessage(msg);
	Services.endTransaction();
}

		/**
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */

function ClearDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				to_do_flag = "CLEAR";
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);					
					Services.setFocus("Master_LibraryNumber_Txt");				
				}				   		
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action									
			    clearMainScreen();
			    Services.setFocus("Master_LibraryNumber_Txt");	
				break;
			}
			
		case StandardDialogButtonTypes.CANCEL:
			{
				// Abort the whole operation	
				break;
			}
	  
	  
	}
};

Main_Clear_Btn.tabIndex = 200;

		/** Binding Actions to Master_CustomerLOV*/
Main_Clear_Btn.actionBinding = function() {   
    var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
	var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
	if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){	    
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

	/** binding keys and mouse events to Main_Clear_Btn */
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "LogReturnedTapes", alt: true }]
      }
};
function Main_Clear_Obj(){};
function Main_Zoom_Btn(){};

		/** Binding Actions to Main_Zoom_Btn*/
Main_Zoom_Btn.actionBinding = function(){
	var queryPopupRaisedFlag = Services.getValue("/ds/var/page/queryPopupRaisedFlag");  
	queryPopupRaisedFlag = isTrueOrFalse(queryPopupRaisedFlag);
	if(!queryPopupRaisedFlag){
         var zoom = Services.getAdaptorById("Master_FileComments_Txt");
      	 if(zoom.getEnabled()){
		
		 	Services.setValue(
		 		DataModel.DEFAULT_TMP_BINDING_ROOT + "/Master_FileComments_Txt_textarea",
		 			 Services.getValue(Master_FileComments_Txt.dataBinding)); 
    		 	
	     Services.dispatchEvent("Master_FileComments_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
		}	
	}
};

	/** binding keys and mouse events to Main_Zoom_Btn */
Main_Zoom_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_Z, element: "LogReturnedTapes", alt: true }]
      }
};

	/** To clear the fields in the Main Screen */
function clearMainScreen()
{
	Services.setValue("/ds/var/page/disableNavigation",null);
	Services.removeNode("/ds/var/form/Model");
	Services.setValue(Master_Degaussed_CBx.dataBinding, '');
	EXIT_WITHOUT_SAVING = false;
    Services.setValue(Page_Mode.dataBinding,'');  
    to_do_flag = "";  
    Services.setValue(SAVING_FINISHED_XPATH, "");
	Services.setValue(Master_TapeFiles_Grid.dataBinding, null);
	Services.setFocus("Master_LibraryNumber_Txt");
	var queryDom = null;
}

Query_Clear_Btn.componentName="Clear Button";
Query_Clear_Btn.tabIndex = 110;
Query_Clear_Btn.helpText = "Clear search fields.";

		/** Binding Actions to Query_Clear_Btn*/
Query_Clear_Btn.actionBinding = function() {
	resetQueryGrid();
	clearSearchScreen();
}

	/** binding keys and mouse events to Query_Clear_Btn */
Query_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "Query_popup", alt: true }            	   
            	  ]
      }
};

/**
* The function clear the fields in the search screen
*/
function clearSearchScreen(){
	Services.startTransaction();	
	Services.setValue(Query_LibraryNumber_Txt.dataBinding, '');	
	Services.setValue(Query_CustomerID_Txt.dataBinding, '');	
	Services.setValue(Query_CustomerDescription_Txt.dataBinding, '');	
	Services.setValue(Query_DateReceived_Txt.dataBinding, '');
	Services.setValue(Query_DateReturned_Txt.dataBinding, '');	
	Services.setValue(Query_FileName_Txt.dataBinding, '');					
	Services.removeNode("/ds/var/page/ReturnedTapes");
	Services.setValue(GRID_PAGE_NUMBER, "");
	Services.setValue("/ds/var/page/disableNavigation",null);
	Services.setFocus("Query_LibraryNumber_Txt");
	Services.endTransaction();	
}

/**
* Function to be invoked when the dialog button is pressed.
* @param [Button] button the presses button
*/
function BackDialogCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				to_do_flag = "BACK";
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				    break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("MainMenu");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function ReceivedRecordsCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("ReceivedRecords");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("ReceivedRecords");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function QueryRejectedCasesCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("QueryRejectedCases");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("QueryRejectedCases");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function MaintainNationalCodedPartiesCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("MaintainNationalCodedParties");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("MaintainNationalCodedParties");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function QueryRejectedJudgmentsCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("QueryRejectedJudgments");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("QueryRejectedJudgments");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function QueryRejectedWarrantsCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("QueryRejectedWarrants");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("QueryRejectedWarrants");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function QueryRejectedPaidCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("QueryRejectedPaid");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("QueryRejectedPaid");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function ProduceCustomerFileReportsCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("ProduceCustomerFileReports");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("ProduceCustomerFileReports");		
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
		 * Function to be invoked when the dialog button is pressed.
		 * @param [Button] button the presses button
		 */
function ProduceOutputStatisticsReportCallBack(button){
	switch(button){
		case StandardDialogButtonTypes.YES:
			{
				// Do confirmed action	
				var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
				var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
				if(isSaveBtnEnabled){
					var saveCallbackObject = new SaveOnlyCallBackObject();
					saveForm(saveCallbackObject);				 
				}
				Services.navigate("Oracle_Reports_BC_ST_R2");
				break;
			}
			
		case StandardDialogButtonTypes.NO:
			{
				// Don't do confirmed action					
			    EXIT_WITHOUT_SAVING = false;	
			    Services.navigate("Oracle_Reports_BC_ST_R2");		
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
*  after performing search operation that returns large number of records greater than the grid page size.
*  @param  button selected by the user. (OK or Cancel)
*  @return void	
*/
function MoreThan20RecordsCallBack(button) {
	switch(button){
		case StandardDialogButtonTypes.OK:
		{
			//Show the results
			Services.removeNode("/ds/var/page/tempTapes/ReturnedTapes/ReturnedTape[21]");
			var mcNode = Services.getNode("/ds/var/page/tempTapes/ReturnedTapes");
			Services.replaceNode(GRID_XPATH, mcNode);
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
Main_Back_Btn.tabIndex = 210;

		/** Binding Actions to Main_Back_Btn*/
Main_Back_Btn.actionBinding = function() {
    var saveBtnAdaptor = Services.getAdaptorById("Main_Save_Btn");	
	var isSaveBtnEnabled = saveBtnAdaptor.getEnabled();
	if(EXIT_WITHOUT_SAVING == true&&isSaveBtnEnabled){
		var msg = ErrorCode.getErrorCode("CaseMan_UnsavedData").getMessage();
		
		Services.showDialog(
			StandardDialogTypes.YES_NO_CANCEL,
			BackDialogCallBack,
			msg,
			""
		);		
	}
	else{
		Services.navigate("MainMenu");
	}
}

/*******************************	HELPER FUNCTIONS *****************************************************************/

		/**
		 * checkes if the input parameter matches money Pattern
		 * @param [String] value to be checked
		 * @return boolean */
function isWholeNumber(value){
	var moneyPattern = new RegExp(/^\d+$/);          
	if(moneyPattern.test(value)) return true;
	else return false;
}

		/**
		 * checkes if the input parameter matches certain pattern
		 * @param [String] value to be checked
		 * @return boolean 
		 */
function validatePattren (value) {
 pattern = /^[1-999999]+\.[0-99]$/;   
	 if( !pattern.test( value) ) {
		  return false;
	 }else{
		 return true;
	}
}

var numb = '0123456789';
var lwr = 'abcdefghijklmnopqrstuvwxyz';
var upr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var percentage = '%';
var space = ' ';
 
 		/**
		 * checkes if the param is a valid character
		 * @param 
		 * @val  
		 * @return boolean 
		 */
function isValid(parm,val) {
  if (parm == "") return true;
  for (i=0; i<parm.length; i++) {
    if (val.indexOf(parm.charAt(i),0) == -1) return false;
  }
  return true;
}
	     /**
		 * checkes if the param is valid number 
		 * @param 
		 * @return boolean 
		 */
function isNum(parm) {return isValid(parm,numb);}
  		 /**
		 * checkes if the param is valid number with percentage sign 
		 * @param 
		 * @return boolean 
		 */
function isNumPartial(parm) {return isValid(parm,numb+percentage);}
		/**
		 * checkes if the param is valid number plus a dot plus a minus sign
		 * @param 
		 * @return boolean 
		 */
function isNumPluseDotPluseMinus(parm) {return isValid(parm,"-"+numb+".");}


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
*  This method is executed to check weather the search is an empty search
*  The method returns true if the user didnt enter any search item in the fields , at least one of the search items Library Number, 
*  Customer Code, Date Received, Date Returned or File Name. 
*  @param  none.
*  @return boolean	
*/
function isEmptySearch() {
	var emptyFlag = true;
	
	var libraryNumber = Services.getValue(Query_LibraryNumber_Txt.dataBinding);	
	if(libraryNumber != "" && libraryNumber != null) {
		emptyFlag = false;
	}		

	var custCode = Services.getValue(Query_CustomerID_Txt.dataBinding);
	if(custCode != ""  && custCode != null ) {
		emptyFlag = false;
	}		



	var  dateReceived = Services.getValue(Query_DateReceived_Txt.dataBinding);
	if(dateReceived != "" && dateReceived != null) {
		emptyFlag = false;
	}

	var  dateReturned = Services.getValue(Query_DateReturned_Txt.dataBinding);
	if(dateReturned != "" && dateReturned != null) {
		emptyFlag = false;
	}

	var fileName = Services.getValue(Query_FileName_Txt.dataBinding);
	if(fileName != "" && fileName!= null ) {
		emptyFlag = false;
	}

	return emptyFlag; 
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