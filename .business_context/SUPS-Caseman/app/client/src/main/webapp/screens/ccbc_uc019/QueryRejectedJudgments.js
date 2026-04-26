/**
 * @author Ahmed Badr (ahmed.mahmoud@eds.com)
 * 
 * 
 *  Ver.	CR#		Date		Modified	                                      Description                   
 *  -------------------------------------------------------------------------------------------------           
 *  1.0a		  	02-06-2005	Ahmed Badr    (ahmed.mahmoud@eds.com)               Initial                     
 *  1.0b            09-06-2005  Khaled Gawad  (khaled.gawad@eds.com)                                            
 *	1.0c			30-06-2005	Heba Salama	  (heba.salama@eds.com)					Adding LOV Functionallity
 *  1.0d            20-09-2005  Khaled Gawad  (khaled.gawad@eds.com)                Fixing defects
 *  1.0e            14-08-2006  Ahmed Tawfik  (ahmed.tawfik@eds.com)                Performance Improvement 
 */

/****************************************************************************************************************
******************************* CONSTANTS and VARIABLES  ********************************************************
****************************************************************************************************************/

var currentRecord = 0;
var resultCount = 0;
var Query_XPATH = PAGE_XPATH +"/Query";


/****************************************************************************************************************
*******************************	Constructors  *******************************************************************
****************************************************************************************************************/

		/** Constructor for form Maintain System Data */
		
	/** Form ID */
function QueryRejectedJudgments() {}; 

/**
* Initilization for the form QueryRejectedJudgments
*/
QueryRejectedJudgments.initialise = function(){
	
	Services.startTransaction();	
	
		Services.setValue(RejectedJudgmentsTabSelector.dataBinding, "FirstPage");	
		Services.setFocus("Query_Creditor_Code_Txt");
		Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
		Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag", true);
	
	Services.endTransaction();
	
	Tabs_Judgment_Amount_Cur.setDefault();
	Tabs_Interest_Cur.setDefault();
	Tabs_Total_Costs_Cur.setDefault();
	Tabs_Instalment_Amount_Cur.setDefault();	
	Tabs_Paid_Before_Judgment_Cur.setDefault();
	Tabs_Total_Cur.setDefault();

}
/**
* Reference data for the form LogReceivedTapes
*/
QueryRejectedJudgments.refDataServices = [
]

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
			formName: "ReturnedRecords",      			 // The name of the current form
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
			formName: "QueryRejectedCases",       		  // The name of the current form
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
			id: "View_Rejected_Warrants_Btn",                 // id for button
			formName: "QueryRejectedWarrants",       		 // The name of the current form
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
			 
			onMenuBar: true
		},
		
		{
			id: "View_Rejected_Paid_Btn",            		     // id for button
			formName: "QueryRejectedPaid",     				    // The name of the current form
			label: " Rejected Paid / Written Off Details ",    // The label appear in the navigation bar
			
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
			                
				/*
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
			formName: "ProduceCustomerFileReports",     		  // The name of the current form
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
			formName: "Oracle_Reports_BC_ST_R2",     				 // The name of the current form
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
* key Bindings for the form QueryRejectedJudgments
*/
QueryRejectedJudgments.keyBindings = [	
	{
		 /** Binding F1 to Query_Search_Btn */
	   key: Key.F1, action: function(){	 	     
	     Query_Search_Btn.actionBinding();	
      } 
    },
    {
    	/** Binding F6 to Query_Customer_LOV_Btn */
       key: Key.F6, action: function(){
       	    Query_Customer_LOV_Btn.actionBinding();
       }	
    },        
    {
    	/** Binding F4 to Main_Back_Btn */
       key: Key.F4, action: function(){
       		Master_Back.actionBinding();
       }	
    }
    
];

/****************************************************************************************************************
*******************************	DATA BINDINGS *******************************************************************
****************************************************************************************************************/

	/** Search Area */
Query_Case_Number_Txt.dataBinding          = PAGE_XPATH +"/Query/CaseNumber";
Query_Payee_Name_Txt.dataBinding           = PAGE_XPATH +"/Query/PayeeName";
Query_File_Sequence_Number_Txt.dataBinding = PAGE_XPATH +"/Query/CustFileSequence";
Query_Creditor_Code_Txt.dataBinding        = PAGE_XPATH +"/Query/CredCode";
Query_Customer_Name_Txt.dataBinding        = PAGE_XPATH +"/Query/CustName";

	/** Tabbed Area */
RejectedJudgmentsTabSelector.dataBinding = PAGE_XPATH +"/pagedarea/currentpage";
RejectedJudgmentsPagedArea.dataBinding = PAGE_XPATH +"/pagedarea/currentpage";
resultCounter.dataBinding = PAGE_XPATH+ "/resultCount";

FirstPage.dataBinding =  PAGE_XPATH + "/FirstPage";
SecondPage.dataBinding = PAGE_XPATH + "/SecondPage";
ThirdPage.dataBinding =  PAGE_XPATH + "/ThirdPage";

Tabs_Case_Number_Txt.dataBinding        = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/CaseNumber";						
Tabs_Date_Rejected_Cal.dataBinding      = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DateRejected";
Tabs_Reject_Code_Txt.dataBinding        = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/RejectCode";
Tabs_Reject_Reason_Txt.dataBinding      = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/RejectReason";
Tabs_File_Sequence_Txt.dataBinding      = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/CustFileSequence";
Tabs_Creditor_Code_Txt.dataBinding      = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/CredCode";
Tabs_Defendant_Id_Txt.dataBinding       = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantId";
Tabs_Defendant_Address1_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantAddr1";
Tabs_Defendant_Address2_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantAddr2";
Tabs_Defendant_Address3_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantAddr3";
Tabs_Defendant_Address4_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantAddr4";
Tabs_Defendant_Address5_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantAddr5";
Tabs_Post_Code_Txt.dataBinding          = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantPostCode";

Tabs_Judgment_Type_Txt.dataBinding        = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/JudgmentType";
Tabs_Joint_CBx.dataBinding                = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/JointJudgment";
Tabs_Frequency_Txt.dataBinding            = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/Frequency";
Tabs_DX_Number_Txt.dataBinding            = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantDXNumber";
Tabs_Telephone_Number_Txt.dataBinding     = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantTelephoneNumber";
Tabs_Fax_Number_Txt.dataBinding    		  = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantFaxNumber";
Tabs_Email_Address_Txt.dataBinding        = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantEmailAddress";
Tabs_Comm_Method_Txt.dataBinding          = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantCommMethod";

Tabs_First_Payment_Date_Cal.dataBinding   = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/FirstPaymentDate";
Tabs_DoB_Cal.dataBinding   = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/DefendantDOB";
Tabs_Judgment_Amount_Cur.dataBinding      = PAGE_XPATH+"/JudgmentAmountCurrency";
Tabs_Judgment_Amount_Txt.dataBinding      = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/JudgmentAmount";
Tabs_Interest_Cur.dataBinding   		  = PAGE_XPATH+"/InterestCurrency";
Tabs_Interest_Txt.dataBinding 			  = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/Interest";
Tabs_Total_Costs_Cur.dataBinding 		  = PAGE_XPATH+"/TotalCostsCurrency";
Tabs_Total_Costs_Txt.dataBinding 		  = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/TotalCosts";
Tabs_Paid_Before_Judgment_Cur.dataBinding = PAGE_XPATH+"/PaidBeforeJudgmentCurrency";
Tabs_Paid_Before_Judgment_Txt.dataBinding = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/PaidBeforeJudgment";
Tabs_Total_Cur.dataBinding 				  = PAGE_XPATH+"/TotalCurrency";
Tabs_Total_Txt.dataBinding                = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/Total";
Tabs_Instalment_Amount_Cur.dataBinding    = PAGE_XPATH+"/InstalmentAmountCurrency";
Tabs_Instalment_Amount_Txt.dataBinding    = FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment/InstalmentAmount";

Tabs_Payee_Name_Txt.dataBinding      = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeName";
Tabs_Payee_Address1_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeAddr1";
Tabs_Payee_Address2_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeAddr2";
Tabs_Payee_Address3_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeAddr3";
Tabs_Payee_Address4_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeAddr4";
Tabs_Payee_Address5_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeAddr5";
Tabs_Payee_Postcode_Txt.dataBinding  = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeePostCode";
Tabs_Payee_Telephone_Txt.dataBinding = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeTelephoneNumber";
Tabs_Payee_DX_Txt.dataBinding 		 = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeDXNumber";
Tabs_Payee_Fax_Txt.dataBinding 		 = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeFaxNumber";
Tabs_Payee_Email_Txt.dataBinding 		 = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeEmailAddress";
Tabs_Payee_Comm_Method_Txt.dataBinding 		 = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeCommMethod";

Tabs_Reference_Txt.dataBinding       = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/PayeeReference";
Tabs_Validated_CBx.dataBinding       = FORM_XPATH + "/PayeeModel/RejectedJudgments/RejectedJudgment/Validated";
																									  
Tabs_Slip_Codeline1_Txt.dataBinding         = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/SlipCodeLine1";
Tabs_Slip_Codeline2_Txt.dataBinding         = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/SlipCodeLine2";
Tabs_Bank_Sort_Code_Txt.dataBinding         = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeBankSortCode";
Tabs_Bank_Account_Number_Txt.dataBinding    = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeBankAccNo";
Tabs_Account_Holder_Txt.dataBinding         = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeAccHolder";
Tabs_Bank_Name_Txt.dataBinding              = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeBankName";
Tabs_Bank_Information1_Txt.dataBinding      = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeBankInfo1";
Tabs_Bank_Information2_Txt.dataBinding      = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeBankInfo2";
Tabs_Giro_Account_Number_Txt.dataBinding    = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeGiroAccNo";
Tabs_Giro_Transaction_Code1_Txt.dataBinding = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeGiroTransCode1";
Tabs_Giro_Transaction_Code2_Txt.dataBinding = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeGiroTransCode2";
Tabs_APACS_Transaction_Code_Txt.dataBinding = FORM_XPATH + "/DetailsModel/RejectedJudgments/RejectedJudgment/PayeeApacsTransCode";

/****************************************************************************************************************
*******************************	LOV DEFINITIONS *****************************************************************
****************************************************************************************************************/

function customerLOV() {};
customerLOV.dataBinding = FORM_XPATH + "/RefData/customerLOVGrid";
customerLOV.srcData = FORM_XPATH + "/RefData/Customers";
customerLOV.rowXPath = "Customer";
customerLOV.keyXPath = "CustomerCode";
customerLOV.columns = [
	{xpath: "CustomerCode"},
	{xpath: "CustomerName"}
];

/****************************************************************************************************************
*******************************	INPUT FIELD DEFINITIONS *********************************************************
****************************************************************************************************************/

	/** Search Area */
	
		/** Query_Case_Number_Txt */
function Query_Case_Number_Txt (){};
Query_Case_Number_Txt.maxLength = 8;
Query_Case_Number_Txt.componentName = "Case Number";
Query_Case_Number_Txt.helpText = "Case Number";
	
/**
 * Function that will be invoked to determine if 
 * the content of Query_Case_Number_Txt.validate
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Case_Number_Txt.validate = function(){

    var ec = null;
	var value = Services.getValue(Query_Case_Number_Txt.dataBinding);
	if(!isAlphaNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_CaseNumberNotAlphaNumeric");
	}
	else if(value.length!=8)	ec =  ErrorCode.getErrorCode("CaseMan_CaseNumberInvalidLength_Msg");	
	return ec;
	                                     
}
/**
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_Case_Number_Txt.transformToModel = function(value)
{	    
	return (null != value) ? value.toUpperCase() : null;
};

	/** Query_Payee_Name_Txt */
function Query_Payee_Name_Txt (){};
Query_Payee_Name_Txt.componentName = "Payee Name";
Query_Payee_Name_Txt.helpText = "Payee Name.";
Query_Payee_Name_Txt.maxLength = 70;
/**
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_Payee_Name_Txt.transformToModel = function(value)
{	    
	return (null != value) ? value.toUpperCase() : null;
};
	
/**
 * Function that will be invoked to determine if 
 * the content of Query_Payee_Name_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */	
Query_Payee_Name_Txt.validate = function(){

	var ec = null;
	var payeeName = Services.getValue(Query_Payee_Name_Txt.dataBinding);
	if(payeeName.indexOf("%") == -1 ){
		if(!isPartialValidPersonName(payeeName)) {
			ec = ErrorCode.getErrorCode("Caseman_invalidPayeeName_Msg");
		}	
		
	} else { 
		var regExp = /\%?/g ;
			/* remove % symbol from the text */
		var updatedpayeeName = payeeName.replace(regExp,"");
			/* check if the number of chars is less than 3 */
		if(updatedpayeeName.length<3){
			ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
		}else{
				/* remove spaces and check that the text contains at least one char rather than spaces */
			updatedpayeeName = updatedpayeeName.replace(/ /g,"");		
			if(updatedpayeeName.length == 0 ){
				ec = ErrorCode.getErrorCode("CaseMan_PayeeNameInvalidLength_Msg");
			}
		}
	}
	return ec;
};
	/** Query_File_Sequence_Number_Txt */
function Query_File_Sequence_Number_Txt(){};
Query_File_Sequence_Number_Txt.componentName = "Customer File Sequence Number";
Query_File_Sequence_Number_Txt.helpText = "Customer File Sequence Number";
Query_File_Sequence_Number_Txt.maxLength = 3;
	
/**
 * Function that will be invoked to determine if 
 * the content of Query_File_Sequence_Number_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */	
Query_File_Sequence_Number_Txt.validate = function(){        
   var ec = null;
	var value = Services.getValue(Query_File_Sequence_Number_Txt.dataBinding);
	if(!isNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_FileSequenceNumberNotNumeric");
	}
	else if(value.length!=3)	ec =  ErrorCode.getErrorCode("CaseMan_FileSeqNumberInvalidLength_Msg");	
	return ec;
}
	/** Query_Creditor_Code_Txt */
var LOV_FLAG = true;
function Query_Creditor_Code_Txt(){};
Query_Creditor_Code_Txt.logicOn = [customerLOV.dataBinding, Query_Creditor_Code_Txt.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param e
*/
Query_Creditor_Code_Txt.logic = function(e){ 
	var code = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
	var codeAdaptor = Services.getAdaptorById("Query_Creditor_Code_Txt");
	if(e.getXPath()==customerLOV.dataBinding){ 
 	 	Services.setValue(Query_Creditor_Code_Txt.dataBinding,Services.getValue(FORM_XPATH + "/RefData/Customers/Customer[./CustomerCode = " + customerLOV.dataBinding + "]/CustomerCode")); 	
 	 	LOV_FLAG = false;
 	}
 	else if(LOV_FLAG&&code!=""&&code!=null&&e.getXPath()==Query_Creditor_Code_Txt.dataBinding){
 		if(/^%$/.test(code) || !codeAdaptor.getValid() ) return;
 		var params = new ServiceParams();		
		var callbackObj = new CustomerCallBackObject();
		Services.callService("getCustomers",params,callbackObj,true);  
 	}
}

	/** Query_Creditor_Code_Txt */
Query_Creditor_Code_Txt.componentName = "Creditor Code";
Query_Creditor_Code_Txt.maxLength = 4;
Query_Creditor_Code_Txt.helpText = "Creditor Code.";
Query_Creditor_Code_Txt.maxLength = 4;
	
		/**
		 * Function that will be invoked to determine if 
		 * the content of Master_FileComments_Txt
		 * is valid.
		 * @return ErrorCode object if the content is not valid
		 */	
Query_Creditor_Code_Txt.validate = function(){	
	
	var ec = null;
	var value = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
	if(!isNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_CreditorCodeNotNumeric");
	}

    else if(value.length!=4)	ec =  ErrorCode.getErrorCode("Caseman_creditorCodeNotFourDigits_Msg");	
	return ec;
	 
}

	/** Query_Customer_Name_Txt */
function Query_Customer_Name_Txt(){};
Query_Customer_Name_Txt.helpText = "Customer Name";
Query_Customer_Name_Txt.logicOn = [Query_Creditor_Code_Txt.dataBinding, FORM_XPATH + "/RefData/Customers"];
/** 
* The function will be applyed based on a change to the underlying DOM 
*/
Query_Customer_Name_Txt.logic = function(){	
	 var custCodeAdaptor = Services.getAdaptorById("Query_Creditor_Code_Txt");
	 var code = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
	 var wildCardPattern = new RegExp("[%]");
	 if(!custCodeAdaptor.getValid()||wildCardPattern.test(code)){
	 		Services.setValue(Query_Customer_Name_Txt.dataBinding, null);
	 		return;
	 	}
	 if(Services.getValue(Query_Creditor_Code_Txt.dataBinding)==""||Services.getValue(Query_Creditor_Code_Txt.dataBinding)==null)
		Services.setValue(Query_Customer_Name_Txt.dataBinding, null);
	 else{
		var customerCode = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
		var customerName = Services.getValue(                           
				"/ds/var/form/RefData/Customers/Customer[./CustomerCode="+customerCode+"]/CustomerName"
				);
		Services.setValue(Query_Customer_Name_Txt.dataBinding, customerName);		
	}  	
};	

		/** 
		 *specifies that Query_Customer_Name_Txt
		 * is a read only field
		 * @return true
		 */
Query_Customer_Name_Txt.isReadOnly = function() { 
	return true;
};
//---------------------------------------------------------------------------------------
function RejectedJudgmentsTabArea() {};
function RejectedJudgmentsTabSelector() {};
function RejectedJudgmentsPagedArea() {};

function resultCounter(){};
		/*************** FirstPage ***************/
function FirstPage(){};

		/**
		 * specifies that FirstPage
		 * is not a read only field
		 * @return false
		 */
FirstPage.isReadOnly = function() { 
	  return false; 
};

function Tabs_Case_Number_Txt(){};
Tabs_Case_Number_Txt.helpText = "Case Number";

		/** 
		 *specifies that Tabs_Case_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Case_Number_Txt.isReadOnly = function() {
	 return true; 
};


function Tabs_Date_Rejected_Cal(){};
Tabs_Date_Rejected_Cal.helpText = "Date Rejected";

		/**
		 * specifies that Tabs_Date_Rejected_Cal
		 * is a read only field
		 * @return true
		 */
Tabs_Date_Rejected_Cal.isReadOnly = function() {
	 return true;
};


function Tabs_Reject_Code_Txt(){};
Tabs_Reject_Code_Txt.helpText = "Reject Code";

		/** 
		 *specifies that Tabs_Reject_Code_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Reject_Code_Txt.isReadOnly = function() {
	 return true;
};


function Tabs_Reject_Reason_Txt(){};
Tabs_Reject_Reason_Txt.helpText = "Reason for Rejection";

		/** 
		 *specifies that Tabs_Reject_Reason_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Reject_Reason_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_File_Sequence_Txt(){};
Tabs_File_Sequence_Txt.helpText = "Customer File Sequence Number";

		/** 
		 *specifies that Tabs_File_Sequence_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_File_Sequence_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Creditor_Code_Txt(){};
Tabs_Creditor_Code_Txt.helpText = "Creditor Code";

		/**
		 * specifies that Tabs_Creditor_Code_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Creditor_Code_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Id_Txt(){};
Tabs_Defendant_Id_Txt.helpText = "Defendant Id";

		/** 
		 * specifies that Tabs_Defendant_Id_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Id_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Address1_Txt(){};
Tabs_Defendant_Address1_Txt.helpText = "Defendant Address";

		/** 
		 *specifies that Tabs_Defendant_Address1_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Address1_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Address2_Txt(){};
Tabs_Defendant_Address2_Txt.helpText = "Defendant Address";

		/** 
		 * specifies that Tabs_Defendant_Address2_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Address2_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Address3_Txt(){};
Tabs_Defendant_Address3_Txt.helpText = "Defendant Address";

		/** 
		 * specifies that Tabs_Defendant_Address3_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Address3_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Address4_Txt(){};
Tabs_Defendant_Address4_Txt.helpText = "Defendant Address";

		/** 
		 * specifies that Tabs_Defendant_Address4_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Address4_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Defendant_Address5_Txt(){};
Tabs_Defendant_Address5_Txt.helpText = "Defendant Address";

		/** 
		 * specifies that Tabs_Defendant_Address5_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Defendant_Address5_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Post_Code_Txt(){};
Tabs_Post_Code_Txt.helpText = "Defendant Postcode";

		/** 
		 * specifies that Tabs_Post_Code_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Post_Code_Txt.isReadOnly = function() { 
	return true; 
};


function Zoom_Hidden_Btn(){};

		/** Binding Actions to Zoom_Hidden_Btn */
Zoom_Hidden_Btn.actionBinding = function(){
	
	var currentPage = Services.getValue(RejectedJudgmentsTabSelector.dataBinding);
	switch(currentPage){

		case "FirstPage":
			
		 	Services.setValue(
			DataModel.DEFAULT_TMP_BINDING_ROOT +
					"/Tabs_Email_Address_Txt_textarea",	 Services.getValue(Tabs_Email_Address_Txt.dataBinding)); 
			 	
			Services.dispatchEvent("Tabs_Email_Address_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			break;
			
	   case "SecondPage": 
	   		
		 	Services.setValue(
			DataModel.DEFAULT_TMP_BINDING_ROOT +
					"/Tabs_Payee_Email_Txt_textarea",	 Services.getValue(Tabs_Payee_Email_Txt.dataBinding)); 
			 	
			Services.dispatchEvent("Tabs_Payee_Email_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			break;
	}
	
};

	/** binding keys and mouse events to Zoom_Hidden_Btn */
Zoom_Hidden_Btn.additionalBindings = {
	eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_Z, element: "QueryRejectedJudgments", alt: true }]
      }
};
		/*************** SecondPage ***************/
		
function SecondPage(){};

		/** 
		 * specifies that SecondPage
		 * is not a read only field
		 * @return false
		 */
SecondPage.isReadOnly = function() { 
	return false; 
};

function Tabs_Judgment_Type_Txt(){};
Tabs_Judgment_Type_Txt.helpText = "Judgment Type";

		/** 
		 * specifies that Tabs_Judgment_Type_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Judgment_Type_Txt.isReadOnly = function() { 
	return true; 
};

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Judgment_Type_Txt.transformToDisplay = function(value) {
	if(value == "D") {
		value = "Default";
	} else if (value == "A"){
		value="Admission";	
	} 
	return (value);
}



function Tabs_Joint_CBx(){};
Tabs_Joint_CBx.helpText = "Joint Judgment";
Tabs_Joint_CBx.modelValue = {checked: "Y", unchecked: "N"};

		/**
		 * specifies that Tabs_Joint_CBx
		 * is a read only field
		 * @return true
		 */
Tabs_Joint_CBx.isReadOnly = function() { 
	return true; 
};


function Tabs_Frequency_Txt(){};
Tabs_Frequency_Txt.helpText = "Frequency";

		/**
		 * specifies that Tabs_Frequency_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Frequency_Txt.isReadOnly = function() { 
	return true; 
};

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Frequency_Txt.transformToDisplay = function(value) {
	if(value == "W") {
		value = "Weekly";
	} else if (value == "F"){
		value = "Fortnightly";
	} else if(value == "M"){
		value="Monthly";
	}
	return (value);
}


function Tabs_DX_Number_Txt(){};
Tabs_DX_Number_Txt.helpText = "Defendant Document Exchange Number";

		/** 
		 * specifies that Tabs_DX_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_DX_Number_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Telephone_Number_Txt(){};
Tabs_Telephone_Number_Txt.helpText = "Defendant Telephone Number";

		/** 
		 * specifies that Tabs_Telephone_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Telephone_Number_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Fax_Number_Txt(){};
Tabs_Fax_Number_Txt.helpText = "Defendant Fax Number";

		/** 
		 * specifies that Tabs_Fax_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Fax_Number_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Email_Address_Txt(){};
Tabs_Email_Address_Txt.helpText = "Defendant Email Address";

		/** 
		 * specifies that Tabs_Email_Address_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Email_Address_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Comm_Method_Txt(){};
Tabs_Comm_Method_Txt.helpText = "Defendant Preferred Method of Communication";

		/** 
		 * specifies that Tabs_Comm_Method_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Comm_Method_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_First_Payment_Date_Cal(){};
Tabs_First_Payment_Date_Cal.helpText = "First Payment Date";

		/** 
		 * specifies that Tabs_First_Payment_Date_Cal
		 * is a read only field
		 * @return true
		 */
Tabs_First_Payment_Date_Cal.isReadOnly = function() { 
	return true; 
};


function Tabs_DoB_Cal(){};
Tabs_DoB_Cal.maxLength = 11;
Tabs_DoB_Cal.weekends = true;
Tabs_DoB_Cal.helpText = "Defendant's Date of Birth";

		/** 
		 * specifies that Tabs_DoB_Cal
		 * is a read only field
		 * @return true
		 */
Tabs_DoB_Cal.isReadOnly = function() { 
	return true; 
};


function Tabs_Judgment_Amount_Cur(){};

		/** 
		 * specifies that Tabs_Judgment_Amount_Cur
		 * is a read only field
		 * @return true
		 */
Tabs_Judgment_Amount_Cur.isReadOnly = function() {
	 return true;
};
		/**
		*Set the default value to Tabs_Judgment_Amount_Cur
		*/
Tabs_Judgment_Amount_Cur.setDefault = function() {
	Services.setValue(Tabs_Judgment_Amount_Cur.dataBinding,"\xA3");
}

function Tabs_Judgment_Amount_Txt(){};
Tabs_Judgment_Amount_Txt.helpText = "Judgment Amount";

		/** 
		 * specifies that Tabs_Judgment_Amount_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Judgment_Amount_Txt.isReadOnly = function() { 
	return true; 
};

		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Judgment_Amount_Txt.transformToDisplay = function(value){
	
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


function Tabs_Interest_Cur(){};

		/**
		 * specifies that Tabs_Interest_Cur
		 * is a read only field
		 * @return true
		 */	
Tabs_Interest_Cur.isReadOnly = function() { 
	return true; 
};
		/**
		*Set the default value to Tabs_Interest_Cur
		*/
Tabs_Interest_Cur.setDefault = function() {
	Services.setValue(Tabs_Interest_Cur.dataBinding,"\xA3");
}

function Tabs_Interest_Txt(){};
Tabs_Interest_Txt.helpText = "Interest";

		/** 
		 * specifies that Tabs_Interest_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Interest_Txt.isReadOnly = function() { 
	return true; 
};

		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Interest_Txt.transformToDisplay = function(value){
	
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


function Tabs_Total_Costs_Cur(){};

		/** 
		 * specifies that Tabs_Total_Costs_Cur
		 * is a read only field
		 * @return true
		 */
Tabs_Total_Costs_Cur.isReadOnly = function() { 
	return true; 
};
		/**
		* Set the default value to Tabs_Total_Costs_Cur
		*/
Tabs_Total_Costs_Cur.setDefault = function() {
	Services.setValue(Tabs_Total_Costs_Cur.dataBinding,"\xA3");
}


function Tabs_Total_Costs_Txt(){};
Tabs_Total_Costs_Txt.helpText = "Total Costs";

		/**
		 * specifies that Tabs_Total_Costs_Txt
		 * is a read only field
		 * @return true
		 */	
Tabs_Total_Costs_Txt.isReadOnly = function() { 
	return true; 
};
		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Total_Costs_Txt.transformToDisplay = function(value){
	
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


function Tabs_Paid_Before_Judgment_Cur(){};

		/** 
		 * specifies that Tabs_Paid_Before_Judgment_Cur
		 * is a read only field
		 * @return true
		 */
Tabs_Paid_Before_Judgment_Cur.isReadOnly = function() { 
	return true; 
};
		/**
		*Set the default value to Tabs_Paid_Before_Judgment_Cur
		*/
Tabs_Paid_Before_Judgment_Cur.setDefault = function() {
	Services.setValue(Tabs_Paid_Before_Judgment_Cur.dataBinding,"\xA3");
}

function Tabs_Paid_Before_Judgment_Txt(){};
Tabs_Paid_Before_Judgment_Txt.helpText = "Paid Before Judgment";

		/**
		 * specifies that Tabs_Paid_Before_Judgment_Txt
		 * is a read only field
		 * @return true
		 */	

Tabs_Paid_Before_Judgment_Txt.isReadOnly = function() { 
	return true;
};

		/**
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Paid_Before_Judgment_Txt.transformToDisplay = function(value){
	
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


function Tabs_Total_Cur(){};

		/**
		 * specifies that Tabs_Total_Cur
		 * is a read only field
		 * @return true
		 */	
Tabs_Total_Cur.isReadOnly = function() {
	 return true; 
};
		/** 
		* Set the default value to Tabs_Total_Cur
		*/
Tabs_Total_Cur.setDefault = function() {
	Services.setValue(Tabs_Total_Cur.dataBinding,"\xA3");
}


function Tabs_Total_Txt(){};
Tabs_Total_Txt.helpText = "Total";

		/**
		 * specifies that Tabs_Total_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Total_Txt.isReadOnly = function() { 
	return true; 
};

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Total_Txt.transformToDisplay = function(value){
	
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


function Tabs_Instalment_Amount_Cur(){};

		/**
		 * specifies that Tabs_Instalment_Amount_Cur
		 * is a read only field
		 * @return true
		 */
Tabs_Instalment_Amount_Cur.isReadOnly = function() { 
	return true; 
};
		/**
		* Set the default value to Tabs_Instalment_Amount_Cur
		*/
Tabs_Instalment_Amount_Cur.setDefault = function() {
	Services.setValue(Tabs_Instalment_Amount_Cur.dataBinding,"\xA3");
}


function Tabs_Instalment_Amount_Txt(){};
Tabs_Instalment_Amount_Txt.helpText = "Instalment Amount";

		/** 
		 * specifies that Tabs_Instalment_Amount_Txt
		 * is a read only field
		 * @return true
		 */	
Tabs_Instalment_Amount_Txt.isReadOnly = function() { 
	return true; 
};

		/** 
		 * This function allows the value retrieved from 
		 * the Data Model to be arbitrarily transformed before it 
		 * is displayed by an adaptor. 
		 * @param [String] value the value to be transformed
		 * @return the new value
		 */
Tabs_Instalment_Amount_Txt.transformToDisplay = function(value){
	
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

		/*************** ThirdPage ***************/
		
function ThirdPage(){};

		/**
		 * specifies that ThirdPage
		 * is a read only field
		 * @return true
		 */
ThirdPage.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Name_Txt(){};
Tabs_Payee_Name_Txt.helpText = "Payee Name";

		/**
		 *  specifies that Tabs_Payee_Name_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Name_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Address1_Txt(){};
Tabs_Payee_Address1_Txt.helpText = "Payee Address";

		/**
		 * specifies that Tabs_Payee_Address1_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Address1_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Address2_Txt(){};
Tabs_Payee_Address2_Txt.helpText = "Payee Address";

		/** 
		 * specifies that Tabs_Payee_Address2_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Address2_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Address3_Txt(){};
Tabs_Payee_Address3_Txt.helpText = "Payee Address";

		/** 
		 * specifies that Tabs_Payee_Address3_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Address3_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Address4_Txt(){};
Tabs_Payee_Address4_Txt.helpText = "Payee Address";

		/** 
		 * specifies that Tabs_Payee_Address4_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Address4_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Address5_Txt(){};
Tabs_Payee_Address5_Txt.helpText = "Payee Address";

		/** 
		 * specifies that Tabs_Payee_Address5_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Address5_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Postcode_Txt(){};
Tabs_Payee_Postcode_Txt.helpText = "Payee Postcode";

		/**
		 * specifies that Tabs_Payee_Postcode_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Postcode_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_DX_Txt(){};
Tabs_Payee_DX_Txt.helpText = "Payee Document Exchange Number";

		/**
		 * specifies that Tabs_Payee_DX_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_DX_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Fax_Txt(){};
Tabs_Payee_Fax_Txt.helpText = "Payee Fax Number";

		/**
		 * specifies that Tabs_Payee_Fax_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Fax_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Email_Txt(){};
Tabs_Payee_Email_Txt.helpText = "Payee Email Address";

		/** 
		 * specifies that Tabs_Payee_Email_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Email_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Comm_Method_Txt(){};
Tabs_Payee_Comm_Method_Txt.helpText = "Payee Preferred Method of Communication";

		/** 
		 * specifies that Tabs_Payee_Comm_Method_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Comm_Method_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Payee_Telephone_Txt(){};
Tabs_Payee_Telephone_Txt.helpText = "Payee Telephone Number";

		/** 
		 * specifies that Tabs_Payee_Telephone_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Payee_Telephone_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Reference_Txt(){};
Tabs_Reference_Txt.helpText ="Payee Reference";

		/**
		 *  specifies that Tabs_Reference_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Reference_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Validated_CBx(){};
Tabs_Validated_CBx.helpText = "Validated";
Tabs_Validated_CBx.modelValue = {checked: "Y", unchecked: "N"};

		/** 
		 * specifies that Tabs_Validated_CBx
		 * is a read only field
		 * @return true
		 */
Tabs_Validated_CBx.isReadOnly = function() { 
	return true; 
};


function Tabs_Slip_Codeline1_Txt(){};
Tabs_Slip_Codeline1_Txt.helpText = "Slip Codeline 1";

		/** 
		 * specifies that Tabs_Slip_Codeline1_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Slip_Codeline1_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Slip_Codeline2_Txt(){};
Tabs_Slip_Codeline2_Txt.helpText = "Slip Codeline 2";

		/** 
		 * specifies that Tabs_Slip_Codeline2_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Slip_Codeline2_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Bank_Sort_Code_Txt(){};
Tabs_Bank_Sort_Code_Txt.helpText = "Payee Bank Sort Code";

		/** 
		 * specifies that Tabs_Bank_Sort_Code_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Bank_Sort_Code_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Bank_Account_Number_Txt(){};
Tabs_Bank_Account_Number_Txt.helpText = "Bank Account Number";

		/** 
		 * specifies that Tabs_Bank_Account_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Bank_Account_Number_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Account_Holder_Txt(){};
Tabs_Account_Holder_Txt.helpText = "Bank Account Holder";

		/** 
		 * specifies that Tabs_Account_Holder_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Account_Holder_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Bank_Name_Txt (){};
Tabs_Bank_Name_Txt.helpText = "Bank Name";

		/**
		 * specifies that Tabs_Bank_Name_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Bank_Name_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Bank_Information1_Txt(){};
Tabs_Bank_Information1_Txt.helpText = "Bank Information 1";

		/**
		 * specifies that Tabs_Bank_Information1_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Bank_Information1_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Bank_Information2_Txt(){};
Tabs_Bank_Information2_Txt.helpText = "Bank Information 2";

		/**
		 * specifies that Tabs_Bank_Information2_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Bank_Information2_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Giro_Account_Number_Txt(){};
Tabs_Giro_Account_Number_Txt.helpText = "Giro Account Number";

		/** 
		 * specifies that Tabs_Giro_Account_Number_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Giro_Account_Number_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Giro_Transaction_Code1_Txt(){};
Tabs_Giro_Transaction_Code1_Txt.helpText = "Giro Transaction Code 1";

		/**
		 * specifies that Tabs_Giro_Transaction_Code1_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Giro_Transaction_Code1_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_Giro_Transaction_Code2_Txt(){};
Tabs_Giro_Transaction_Code2_Txt.helpText = "Giro Transaction Code 2";

		/** 
		 * specifies that Tabs_Giro_Transaction_Code2_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_Giro_Transaction_Code2_Txt.isReadOnly = function() { 
	return true; 
};


function Tabs_APACS_Transaction_Code_Txt(){};
Tabs_APACS_Transaction_Code_Txt.helpText = "APACS Transaction Code";

		/** 
		 * specifies that Tabs_APACS_Transaction_Code_Txt
		 * is a read only field
		 * @return true
		 */
Tabs_APACS_Transaction_Code_Txt.isReadOnly = function() { 
	return true; 
};


/****************************************************************************************************************
*******************************	BUTTON FIELD DEFINITIONS ********************************************************
****************************************************************************************************************/

function Query_Customer_LOV_Btn(){};
Query_Customer_LOV_Btn.helpText = "Select a Customer";

		/** Binding Actions to Query_Customer_LOV_Btn */
Query_Customer_LOV_Btn.actionBinding = function()
{	
	Services.startTransaction();
	
    Services.setValue(customerLOV.dataBinding, ""); 
    Services.setValue(
    	"/ds/var/page/tmp/filtering/customerLOV_grid_column_filter_col0", null);

	Services.setValue(
    	"/ds/var/page/tmp/filtering/customerLOV_grid_column_filter_col1", null);
	
	Services.endTransaction();
	
    var params = new ServiceParams();		
	var callbackObj = new CustomerCallBackObject();
	Services.callService("getCustomers",params,callbackObj,true);  
	Services.dispatchEvent("customerLOV", PopupGUIAdaptor.EVENT_RAISE, null);     
}

function CallBackObject(){}

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

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
CallBackObject.prototype.onSuccess = function(objDom)
{
   	Services.startTransaction();
    
		if(Services.getValue(PAGE_XPATH + "/RejectedJudgments")==null){ 	          	     
	             Services.setValue(PAGE_XPATH + "/RejectedJudgments", "");
	        }
	
	     
		Services.addNode(objDom, PAGE_XPATH);	
		resultCount = Services.countNodes(PAGE_XPATH + "/RejectedJudgments/RejectedJudgment");	
		if(resultCount==1) Services.setValue(resultCounter.dataBinding, "1");
	   	if(resultCount>0){
	   	     currentRecord = 1;
	   	     if(resultCount>1)Services.setValue(resultCounter.dataBinding, currentRecord);   	    
		   	_loadRecord(currentRecord); 
		    	Services.setTransientStatusBarMessage("Total Records retrieved is "+resultCount);
		   	}
		
	    else {
	           _clearResults();
	           Services.setTransientStatusBarMessage(
		    	     ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage());
		      }
		Services.setFocus("Query_Creditor_Code_Txt");
	
	Services.endTransaction();
} 
  
          
function Query_Search_Btn(){};
Query_Search_Btn.helpText = "Submit Query";

		/** Binding Actions to Query_Search_Btn */
Query_Search_Btn.actionBinding = function()
{ 	
   	Services.startTransaction();
   	
	Services.setValue(RejectedJudgmentsTabSelector.dataBinding, "FirstPage");
    Services.removeNode(FORM_XPATH + "/Model");  
    Services.removeNode(PAGE_XPATH + "/RejectedJudgments");   
    
    _clearResults();      	    
    
      var caseNumAdaptor  = Services.getAdaptorById("Query_Case_Number_Txt");
      var payeeAdaptor    = Services.getAdaptorById("Query_Payee_Name_Txt");
      var fileSeqAdaptor  = Services.getAdaptorById("Query_File_Sequence_Number_Txt");
      var credCodeAdaptor = Services.getAdaptorById("Query_Creditor_Code_Txt");
      
      
      if(!caseNumAdaptor.getValid()){
      	Services.setFocus("Query_Case_Number_Txt");
      }
      else if(!payeeAdaptor.getValid()){
      	Services.setFocus("Query_Payee_Name_Txt");
      }
      else if(!fileSeqAdaptor.getValid()){
      	Services.setFocus("Query_File_Sequence_Number_Txt");
      }
      else if(!credCodeAdaptor.getValid()){
      	Services.setFocus("Query_Creditor_Code_Txt");
      } else if(isEmptySearch()) {
	 	var msg = ErrorCode.getErrorCode("CaseMan_EmptySearch_Msg").getMessage();
		Services.setTransientStatusBarMessage(msg);
		Services.setFocus("Query_Creditor_Code_Txt");
	 }
	
	  else {	
	  			
		        Services.removeNode(resultCounter.dataBinding);
			    // form is valid    			    
				var params = new ServiceParams();
				var caseNumber  = Services.getValue(Query_Case_Number_Txt.dataBinding);
				var payeeName   = Services.getValue(Query_Payee_Name_Txt.dataBinding);
				var custFileSeq = Services.getValue(Query_File_Sequence_Number_Txt.dataBinding);
				var credCode    = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
				
				if(caseNumber!=null) params.addSimpleParameter('CaseNumber', caseNumber);
				if(payeeName!=null)  params.addSimpleParameter('PayeeName', payeeName);
				if(custFileSeq!=null) params.addSimpleParameter('CustFileSequence', custFileSeq);
				if(credCode!=null)   params.addSimpleParameter('CredCode',credCode );            
            	
            	var callbackObj = new CallBackObject() ;			
		        Services.callService("getSummaryRejectedJudgments", params, callbackObj, true);
		        Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
		        Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag", true);
		}
		
   	Services.endTransaction();		
}


function Master_Next(){};
/** Binding Actions to Master_Next*/
Master_Next.actionBinding = function(){    
   	Services.startTransaction();
  
       if(currentRecord<resultCount){
          currentRecord = currentRecord+1; 
         _loadRecord(currentRecord);          
         Services.setValue(resultCounter.dataBinding, currentRecord) ;
         var mssg = null;
         if(currentRecord==resultCount) mssg = ErrorCode.getErrorCode("Caseman_lastRecordDisplayed_Msg").getMessage();
         else mssg = "Record Number "+currentRecord+" displayed.";
         Services.setTransientStatusBarMessage(mssg);
       }     
       else if(resultCount>0){          
       	  Services.setTransientStatusBarMessage( 
       	  		ErrorCode.getErrorCode("Caseman_lastRecordDisplayed_Msg").getMessage());
       }
    Services.setValue(RejectedJudgmentsTabSelector.dataBinding, "FirstPage");
    Services.setFocus("Master_Next");
    Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
    Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag", true);
    
   	Services.endTransaction();
}

	/** binding keys and mouse events to Master_Next */
Master_Next.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_N, element: "QueryRejectedJudgments", alt: true }]
      }
};

Master_Next.enableOn = [resultCounter.dataBinding];

		/**
		* @return boolean based on the value of resultCounter.dataBinding 
		*/
Master_Next.isEnabled = function(){
	var count = parseInt(Services.getValue(resultCounter.dataBinding));
	if(count==0)return false;
	if(resultCount==1) return false;
	if(count<resultCount) return true;
	else return false;
}


function Master_Previous_Btn(){};
/** Binding Actions to Master_Previous_Btn */
Master_Previous_Btn.actionBinding = function(){	
   	Services.startTransaction();
   	
	if(currentRecord>1){
		 currentRecord = currentRecord-1;
	    _loadRecord(currentRecord);		     
	    Services.setValue(resultCounter.dataBinding, currentRecord) ;
	    var mssg = null
	    if(currentRecord==1) mssg = ErrorCode.getErrorCode("Caseman_firstRecordDisplayed_Msg").getMessage();
	    else mssg = "Record Number "+currentRecord+" displayed.";
	    Services.setTransientStatusBarMessage(mssg); 
	    
	}  

	else if(resultCount>0){
       	  Services.setTransientStatusBarMessage(
       	  	ErrorCode.getErrorCode("Caseman_firstRecordDisplayed_Msg").getMessage());
       }
       
   Services.setValue(RejectedJudgmentsTabSelector.dataBinding, "FirstPage");
   Services.setFocus("Master_Previous_Btn");
   Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
   Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag", true);
   
   	Services.endTransaction();   
}

	/** binding keys and mouse events to Master_Previous_Btn */
Master_Previous_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_P, element: "QueryRejectedJudgments", alt: true }]
      }
};

Master_Previous_Btn.enableOn = [resultCounter.dataBinding];

		/** 
		 * @return boolean based on the value of resultCounter.dataBinding 
		 */
Master_Previous_Btn.isEnabled = function(){
	var count = parseInt(Services.getValue(resultCounter.dataBinding));
	if(count>1) return true;
	else return false;
}


function Master_Clear(){};

		/** Binding Actions to Master_Clear*/
Master_Clear.actionBinding = function(){     
	_clearAll();
   	Services.startTransaction(); 	
   	
		Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
		Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag", true);
		Services.setValue(RejectedJudgmentsTabSelector.dataBinding, "FirstPage");
		
   	Services.endTransaction(); 		
}

	/** binding keys and mouse events to Master_Clear */
Master_Clear.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "QueryRejectedJudgments", alt: true }]
      }
};


function Master_Back() {};

		/** Binding Actions to Master_Back*/
Master_Back.actionBinding = function() {	
	Services.navigate("MainMenu");
}

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
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
CustomerCallBackObject.prototype.onError = function(){
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


SecondPage.logicOn = [RejectedJudgmentsTabSelector.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
SecondPage.logic = function(event){
		
		var selectedPage = Services.getValue(RejectedJudgmentsTabSelector.dataBinding);

		
		var secondTabEmptyFlag = Services.getValue(PAGE_XPATH + "/secondTabEmptyFlag");
		if(secondTabEmptyFlag == 0) {
			secondTabEmptyFlag = false;
		} else {
			secondTabEmptyFlag = true;
		}
		if(selectedPage == "SecondPage" && secondTabEmptyFlag ){

		Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",false);
		
		
		var rowId = Services.getValue(PAGE_XPATH + "/RejectedJudgments/RejectedJudgment" + "[" + Services.getValue(resultCounter.dataBinding) + "]/RowId");
		
		if(rowId != null) {
				
				var callbackObj = new PayeeCallBackObject() ;
				var params = new ServiceParams() ;
				params.addSimpleParameter("Rejected_Payee_RowId", rowId );
				Services.callService("getPayeeRejectedJudgments",params,callbackObj,true);
				Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",false);
			}
		}	
}

function PayeeCallBackObject(){}

	/** 
	 *callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
PayeeCallBackObject.prototype.onError = function(exception)
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

	/**
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
PayeeCallBackObject.prototype.onSuccess = function(objDom) {
	Services.removeNode(FORM_XPATH + "/PayeeModel");
	Services.addNode(objDom, FORM_XPATH + "/PayeeModel");
} 
  


ThirdPage.logicOn = [RejectedJudgmentsTabSelector.dataBinding];

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
ThirdPage.logic = function(event){
		
		var selectedPage = Services.getValue(RejectedJudgmentsTabSelector.dataBinding);
	
		var thirdTabEmptyFlag = Services.getValue(PAGE_XPATH + "/thirdTabEmptyFlag");
		if(thirdTabEmptyFlag == 0) {
			thirdTabEmptyFlag = false;
		} else {
			thirdTabEmptyFlag = true;
		}
		if(selectedPage == "ThirdPage" && thirdTabEmptyFlag ){
		
			var rowId = Services.getValue(PAGE_XPATH + "/RejectedJudgments/RejectedJudgment" + "[" + Services.getValue(resultCounter.dataBinding) + "]/RowId");
	
			if(rowId != null) {
					var callbackObj = new DetailCallBackObject() ;
					var params = new ServiceParams() ;
					params.addSimpleParameter("Rejected_Details_RowId", rowId );
					Services.callService("getDetailsRejectedJudgments",params,callbackObj,true);
					Services.setValue(PAGE_XPATH + "/thirdTabEmptyFlag",false);
				}
		}	
}


function DetailCallBackObject(){}

	/**
	 * callback handler which gets invoked upon the return
	 * error of the remote invocation.
	 * @param [Exception] exception the resulting exception 
	 * from the remote invocation
	 */
DetailCallBackObject.prototype.onError = function(exception)
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

	/** 
	 * callback handler which gets invoked upon the return
	 * success of the remote invocation.
	 * @param [Dom] objDom the reurned domm object from the invocation
	 */
DetailCallBackObject.prototype.onSuccess = function(objDom) {
	Services.removeNode(FORM_XPATH + "/DetailsModel");
	Services.addNode(objDom, FORM_XPATH + "/DetailsModel");
} 

/*****************************************************************************************************************
*******************************	HELPER FUNCTIONS *****************************************************************
*****************************************************************************************************************/

		/**
		 *@param [Event] evt
		 */
function _onclick(evt)
{
	evt = evt == null ? event : evt;
	var element = null != evt.target ? evt.target : evt.srcElement;
	Services.navigate(element.__formAlias);
}

		/**
		 * Loads a record at certain index
		 * @param [Integer] index 
		 */
function _loadRecord(index){ 
		
		
		if(Services.getNode (FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment")==null)
			Services.setNode(FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment", "");
		Services.replaceNode(FORM_XPATH + "/Model/RejectedJudgments/RejectedJudgment",
			                 Services.getNode(PAGE_XPATH + "/RejectedJudgments/RejectedJudgment["+index+"]"));	
		
		}   // end of _loadRecord function

		/**
		* Clear all fields in the screan 
		*/
function _clearAll(){
	Services.startTransaction();
	
	Services.setValue(Query_Case_Number_Txt.dataBinding, null);
	Services.setValue(Query_Payee_Name_Txt.dataBinding, null);
	Services.setValue(Query_File_Sequence_Number_Txt.dataBinding, null);
	Services.setValue(Query_Creditor_Code_Txt.dataBinding, null);
	Services.setValue(Query_Customer_Name_Txt.dataBinding, null);
	LOV_FLAG = true;
	_clearResults();
	
	Services.removeNode(FORM_XPATH + "/RefData/Customers");
	Services.setFocus("Query_Creditor_Code_Txt");
	
	Services.endTransaction();
}

		/**
		* remove previous search results 
		*/
function _clearResults(){	

	Services.startTransaction();
		
	Services.removeNode(FORM_XPATH + "/Model");
	Services.removeNode(FORM_XPATH + "/PayeeModel");
	Services.removeNode(FORM_XPATH + "/DetailsModel");
	Services.removeNode(PAGE_XPATH + "/RejectedJudgments");	
    Services.setValue( Tabs_Joint_CBx.dataBinding , "N"); 	
    Services.setValue( Tabs_Validated_CBx.dataBinding ,  "N");
    Services.setValue(resultCounter.dataBinding, "0");
    
	Services.endTransaction();    
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
	
	var creditorCode = Services.getValue(Query_Creditor_Code_Txt.dataBinding);	
	if(creditorCode != "" && creditorCode != null) {
		emptyFlag = false;
	}		

	var caseNumber = Services.getValue(Query_Case_Number_Txt.dataBinding);
	if(caseNumber != ""  && caseNumber != null ) {
		emptyFlag = false;
	}		



	var  fileSequenceNum = Services.getValue(Query_File_Sequence_Number_Txt.dataBinding);
	if(fileSequenceNum != "" && fileSequenceNum != null) {
		emptyFlag = false;
	}

	var payeeName = Services.getValue(Query_Payee_Name_Txt.dataBinding);
	if(payeeName != "" && payeeName != null) {
		emptyFlag = false;
	}
	return emptyFlag; 
}

 
