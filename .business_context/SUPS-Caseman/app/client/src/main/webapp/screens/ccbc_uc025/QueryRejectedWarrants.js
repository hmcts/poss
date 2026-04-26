/**
* File Name				: QueryRejectedWarrants.js
* Description			:
* @author	(EDS Net ID): gz9kns
* Modification History	:
* ==============================================================================
*                          	Prior
* Date        EDS Net ID     Version    CR      Description
* ----------  -------------	---------  ---- 	-------------------------------
* 13-06-2004	gz9kns       	1.0		N/A		Starting the Construction Phase
*				vzq598        	1.1				Online Integaration and Testing
* 13-08-2006	kzgp4h			1.2				Performance improvement.
* ==============================================================================
*/

//****************************************************************************//
//****************************** CONSTANTS and VARIABLES  ********************//
//****************************************************************************//

// XPATH constants
var Model_XPATH = FORM_XPATH + "/Model/RejectedWarrants/RejectedWarrant";
var Query_XPATH = PAGE_XPATH + "/Query";
var isFirst = true;

function pageCount() {};
function currentPage() {};

//****************************************************************************//
//*****************************	Constructors  ********************************//
//****************************************************************************//

function queryRejectedWarants() {};
function rejectedWarrantTabArea() {};
function rejectedWarrantTabSelector() {};
function rejectedWarrantPagedArea() {};
function Tabs_First_Page() {};
function Tabs_Second_Page() {};
function Tabs_CreditorCode_Txt() {};
function Tabs_CaseNumber_Txt() {};
function Tabs_WarrantNumber_Txt() {};
function Tabs_ClaimantDetails_Txt() {};
function Tabs_Refrence_Txt() {};
function Tabs_FileSequence_Txt() {};
function Tabs_DefendantName_Txt() {};
function Tabs_DefendantAddress1_Txt() {};
function Tabs_DefendantAddress2_Txt() {};
function Tabs_DefendantAddress3_Txt() {};
function Tabs_DefendantAddress4_Txt() {};
function Tabs_DefendantAddress5_Txt() {};
function Tabs_DefPostcode_Txt() {};
function Tabs_EnforcingCourtCode_Txt() {};
function Tabs_DXNumber_Txt() {};
function Tabs_TelephoneNumber_Txt() {};
function Tabs_FaxNumber_Txt() {};
function Tabs_EmailAddress_Txt() {};
function Tabs_CommMethod_Dbx() {};
function Tabs_BalanceOfDebt_Txt() {};
function Tabs_Amount_Txt() {};
function Tabs_Fees_Txt() {};
function Tabs_Costs_Txt() {};
function Tabs_Validated_CBx() {};
function Tabs_RejectDate_Cal() {};
function Tabs_RejectCode_Txt() {};
function Tabs_RejectReason_Txt() {};
function Tabs_Amount_Cur() {};
function Tabs_Fees_Cur() {};
function Tabs_Costs_Cur() {};
function Tabs_Balance_Cur() {};

function Main_Next_Btn(){};
function Main_Previous_Btn(){};
function Main_Back_Btn(){};
function Main_Clear_Btn(){};
function Query_Search_Btn() {};

function Query_CreditorCode_Txt(){};
function Query_CaseNumber_Txt(){};
function Query_WarrantNumber_Txt() {};
function Query_ClaimantDetails_Txt(){};
function Query_FileSequence_Txt() {};
function Query_DefendantName_Txt() {};

//****************************************************************************//
//*****************************	Key Bindings  ********************************//
//****************************************************************************//

queryRejectedWarants.keyBindings = [	
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

//****************************************************************************//
//*****************************	Initialisation  ******************************//
//****************************************************************************//
/** Initialising the Screen with the default values */
queryRejectedWarants.initialise = function(){
	Services.setValue(Tabs_Balance_Cur.dataBinding, "\xA3");
	Services.setValue(Tabs_Amount_Cur.dataBinding, "\xA3");
	Services.setValue(Tabs_Fees_Cur.dataBinding, "\xA3");
	Services.setValue(Tabs_Costs_Cur.dataBinding, "\xA3");
	Services.setValue(rejectedWarrantTabSelector.dataBinding,"Tabs_First_Page");
	Services.setFocus("Query_CreditorCode_Txt");
	Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
}

//****************************************************************************//
//*******************************	Menu Bar  ********************************//
//****************************************************************************//

menubar = {
	quickLinks: [{
			id: "Log_Received_Tapes_Btn", // id for button
			formName: "ReceivedRecords",  // The name of the current form
			label:" Log Received Tapes ", //The label in the navigation bar
			
			/**
			 * The framework calls this function before navigating
			 * to the quick link (sub-) form.
			 * @return boolean returns true if it is ok to proceed,false otherwise
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
			id: "View_Rejected_Paid_Btn",                        // id for button
			formName: "QueryRejectedPaid",                      // The name of the current form
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
			formName: "ProduceCustomerFileReports",               // The name of the current form
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
			formName: "Oracle_Reports_BC_ST_R2",   					 // The name of the current form
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
				 * to the quick quick link???s (sub-) form.
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
/*****************************************************************************************************************
*******************************	DATA BINDINGS ********************************************************************
*****************************************************************************************************************/


pageCount.dataBinding = FORM_XPATH + "/pageCount";
currentPage.dataBinding = FORM_XPATH + "/currentPage";

rejectedWarrantTabArea.dataBinding = PAGE_XPATH + "/pagedarea/currentpage";
rejectedWarrantPagedArea.dataBinding = PAGE_XPATH + "/pagedarea/currentpage";
rejectedWarrantTabSelector.dataBinding = PAGE_XPATH + "/pagedarea/currentpage";

Tabs_CreditorCode_Txt.dataBinding = FORM_XPATH + "/CredCode";
Tabs_CaseNumber_Txt.dataBinding = FORM_XPATH + "/CaseNumber";
Tabs_WarrantNumber_Txt.dataBinding = FORM_XPATH + "/WarrantNumber";
Tabs_ClaimantDetails_Txt.dataBinding = FORM_XPATH + "/ClaimantDetails";
Tabs_Refrence_Txt.dataBinding = FORM_XPATH + "/Refrence";
Tabs_FileSequence_Txt.dataBinding= FORM_XPATH + "/CustomerFileSeq";
Tabs_DefendantName_Txt.dataBinding= FORM_XPATH + "/DefendantName";
Tabs_DefendantAddress1_Txt.dataBinding = FORM_XPATH + "/DefendantAddress1";
Tabs_DefendantAddress2_Txt.dataBinding = FORM_XPATH + "/DefendantAddress2";
Tabs_DefendantAddress3_Txt.dataBinding = FORM_XPATH + "/DefendantAddress3";
Tabs_DefendantAddress4_Txt.dataBinding = FORM_XPATH + "/DefendantAddress4";
Tabs_DefendantAddress5_Txt.dataBinding = FORM_XPATH + "/DefendantAddress5";
Tabs_DefPostcode_Txt.dataBinding = FORM_XPATH + "/DefendantPostCode";
Tabs_EnforcingCourtCode_Txt.dataBinding= FORM_XPATH + "/EnforcingCourtCode";
Tabs_DXNumber_Txt.dataBinding = FORM_XPATH + "/DefendantDXNumber";
Tabs_TelephoneNumber_Txt.dataBinding = FORM_XPATH + "/DefendantTelephoneNumber";
Tabs_FaxNumber_Txt.dataBinding = FORM_XPATH + "/DefendantFaxNumber";
Tabs_EmailAddress_Txt.dataBinding = FORM_XPATH + "/DefendantEmailAddress";
Tabs_CommMethod_Dbx.dataBinding = FORM_XPATH + "/DefendantCommMethod";
Tabs_BalanceOfDebt_Txt.dataBinding = FORM_XPATH + "/Details/RejectedWarrants/RejectedWarrant/BalanceOfDebt";
Tabs_Amount_Txt.dataBinding = FORM_XPATH + "/Details/RejectedWarrants/RejectedWarrant/Amount";
Tabs_Fees_Txt.dataBinding = FORM_XPATH + "/Details/RejectedWarrants/RejectedWarrant/Fee";
Tabs_Costs_Txt.dataBinding = FORM_XPATH + "/Details/RejectedWarrants/RejectedWarrant/Costs";
Tabs_Validated_CBx.dataBinding = FORM_XPATH + "/Details/RejectedWarrants/RejectedWarrant/Validated";
Tabs_RejectDate_Cal.dataBinding = FORM_XPATH + "/DateRejected";
Tabs_RejectCode_Txt.dataBinding = FORM_XPATH + "/RejectCode";
Tabs_RejectReason_Txt.dataBinding = FORM_XPATH + "/RejectReason";
Tabs_Amount_Cur.dataBinding = PAGE_XPATH + "/AmountCurrency";
Tabs_Fees_Cur.dataBinding = PAGE_XPATH + "/FeeCurrency";
Tabs_Costs_Cur.dataBinding = PAGE_XPATH + "/CostsCurrency";
Tabs_Balance_Cur.dataBinding = PAGE_XPATH + "/BalanceOfDebtCurrency";

Tabs_Second_Page.dataBinding   =  PAGE_XPATH + "/TabsSecondPage";
Query_CreditorCode_Txt.dataBinding = Query_XPATH + "/CredCode";
Query_CaseNumber_Txt.dataBinding = Query_XPATH + "/CaseNumber";
Query_WarrantNumber_Txt.dataBinding = Query_XPATH + "/WarrantNumber";
Query_ClaimantDetails_Txt.dataBinding = Query_XPATH + "/ClaimantDetails";
Query_FileSequence_Txt.dataBinding = Query_XPATH + "/CustomerFileSeq";
Query_DefendantName_Txt.dataBinding = Query_XPATH + "/DefendantName";

/******************************************************************************************************
***************************************	Input Fields' Definintions ************************************
******************************************************************************************************/

Tabs_Second_Page.logicOn = [rejectedWarrantTabArea.dataBinding];
	/** 
	*the function will be applyed based on a change to the underlying DOM 
	* @param event
	*/
Tabs_Second_Page.logic = function(event){
		
		var selectedPage = Services.getValue(rejectedWarrantTabSelector.dataBinding);
		var secondTabEmptyFlag = Services.getValue(PAGE_XPATH + "/secondTabEmptyFlag");
		if(secondTabEmptyFlag == 0) {
			secondTabEmptyFlag = false;
		} else {
			secondTabEmptyFlag = true;
		}
		if(selectedPage == "Tabs_Second_Page" && secondTabEmptyFlag ){
	
		
			var rowId = Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/RowId");
			
			if(rowId != null) {
			
				var callbackObj = new DetailCallBackObject() ;
				var params = new ServiceParams() ;
				params.addSimpleParameter("Rejected_Warrants_RowId", rowId );
				Services.callService("getRejectedWarrants",params,callbackObj,true);
				Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",false);
				
			}
		}	
		
}


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
	} else if(value.length!=4) {
    	ec =  ErrorCode.getErrorCode("Caseman_creditorCodeNotFourDigits_Msg");	
    }	
	return ec;
}


Query_CaseNumber_Txt.maxLength = 8;
Query_CaseNumber_Txt.helpText = "Case Number";
Query_CaseNumber_Txt.componentName = "Case Number";
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
/**
* This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_CaseNumber_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}	
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
	} else if(value.length!=8) {
		ec =  ErrorCode.getErrorCode("CaseMan_CaseNumberInvalidLength_Msg");	
	}	
	return ec;                                   
}


Query_WarrantNumber_Txt.maxLength = 8;
Query_WarrantNumber_Txt.helpText = "Warrant Number";
Query_WarrantNumber_Txt.componentName = "Warrant Number";
/**
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Query_WarrantNumber_Txt.transformToDisplay = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}
/**
* This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_WarrantNumber_Txt.transformToModel = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}	
/**
 * Function that will be invoked to determine if 
 * the content of Query_WarrantNumber_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_WarrantNumber_Txt.validate = function(){
	var ec = null;
	var value = Services.getValue(Query_WarrantNumber_Txt.dataBinding);
	if(!isAlphaNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_WarrantNumberNotAlphaNumeric");
	} else if(value.length < 6) {
		ec =  ErrorCode.getErrorCode("CaseMan_WarrantInvalidLength_Msg");	
	}
	return ec;
}


Query_ClaimantDetails_Txt.maxLength = 70;
Query_ClaimantDetails_Txt.helpText = "Claimant Name";
Query_ClaimantDetails_Txt.componentName = "Claimant Name";
/**
* This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Query_ClaimantDetails_Txt.transformToDisplay = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}	
/**
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_ClaimantDetails_Txt.transformToModel = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}
/**
 * Function that will be invoked to determine if 
 * the content of Query_ClaimantDetails_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_ClaimantDetails_Txt.validate = function(){

	var ec = null;
	var claimantDetails = Services.getValue(Query_ClaimantDetails_Txt.dataBinding);
	if(! (claimantDetails.indexOf("%") == -1) ){
		var regExp = /\%?/g ;
			/* remove % symbol from the text */
		var updatedclaimantDetails = claimantDetails.replace(regExp,"");
		/* check if the number of chars is less than 3 */
		if(updatedclaimantDetails.length<3){
			ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
		}else{
				/* remove spaces and check that the text contains at least one char rather than spaces */
			updatedclaimantDetails = updatedclaimantDetails.replace(/ /g,"");		
			if(updatedclaimantDetails.length == 0 ){
				ec = ErrorCode.getErrorCode("CaseMan_ClaimantDetailsInvalidLength_Msg");
			}
		}
	}		
	return ec;
};


Query_DefendantName_Txt.maxLength = 70;
Query_DefendantName_Txt.helpText = "Defendant Name";
Query_DefendantName_Txt.componentName = "Defendant Name";
/**
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Query_DefendantName_Txt.transformToDisplay = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}
/**
 * This function allows the displayed value to be
 * arbitrarily transformed before it is stored 
 * in the DataModel.
 * @param [String] value the value to be transformed
 * @return the new value		 
 */
Query_DefendantName_Txt.transformToModel = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}
/**
 * Function that will be invoked to determine if 
 * the content of Master_FileComments_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_DefendantName_Txt.validate = function(){

	var ec = null;
	var defendantName = Services.getValue(Query_DefendantName_Txt.dataBinding);
	if(!(defendantName.indexOf("%") == -1) ){
		var regExp = /\%?/g ;
			/* remove % symbol from the text */
		var updatedDefendantName = defendantName.replace(regExp,"");
		/* check if the number of chars is less than 3 */
		if(updatedDefendantName.length<3){
			ec = ErrorCode.getErrorCode("CaseMan_FileNameInvalidLength_Msg");
		}else{
				/* remove spaces and check that the text contains at least one char rather than spaces */
			updatedDefendantName = updatedDefendantName.replace(/ /g,"");		
			if(updatedDefendantName.length == 0 ){
				ec = ErrorCode.getErrorCode("CaseMan_DefendantNameInvalidLength_Msg");
			}
		}
	}		
	return ec;
};


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
	} else if(value.length!=3) {
		ec =  ErrorCode.getErrorCode("CaseMan_FileSeqNumberInvalidLength_Msg");	
	}	
	return ec;
}

// ReadOnly fields.
Tabs_CreditorCode_Txt.helpText = "Creditor Code";
Tabs_CreditorCode_Txt.componentName = "Creditor Code";
Tabs_CreditorCode_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding];

	/** 
	*this function will be applyed based on a change to the underlying DOM 
	*@param event
	*/
Tabs_CreditorCode_Txt.logic = function(event){
	Services.setValue(Tabs_CreditorCode_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/CredCode"));
}
/**
 * specifies that Tabs_CreditorCode_Txt
 * is a read only field
 * @return true
 */
Tabs_CreditorCode_Txt.isReadOnly = function(){
	return true;
}

Tabs_CaseNumber_Txt.helpText = "Case Number";
Tabs_CaseNumber_Txt.componentName = "Case Number";
Tabs_CaseNumber_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

	/** 
	* The function will be applyed based on a change to the underlying DOM 
	*@param event
	*/
Tabs_CaseNumber_Txt.logic = function(event){
	Services.setValue(Tabs_CaseNumber_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/CaseNumber"));
}
/**
 * specifies that Tabs_CaseNumber_Txt
 * is a read only field
 * @return true
 */	
Tabs_CaseNumber_Txt.isReadOnly = function()
{
	return true;
}


Tabs_WarrantNumber_Txt.helpText = "Warrant Number";
Tabs_WarrantNumber_Txt.componentName = "Warrant Number";
Tabs_WarrantNumber_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_WarrantNumber_Txt.logic = function(event){
	Services.setValue(Tabs_WarrantNumber_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/WarrantNumber"));
}		
/**
 * specifies that Tabs_WarrantNumber_Txt
 * is a read only field
 * @return true
 */	
Tabs_WarrantNumber_Txt.isReadOnly = function(){
	return true;
}


Tabs_ClaimantDetails_Txt.helpText = "Claimant Name";
Tabs_ClaimantDetails_Txt.componentName = "Claimant Name";
Tabs_ClaimantDetails_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_ClaimantDetails_Txt.logic = function(event){
	Services.setValue(Tabs_ClaimantDetails_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/ClaimantDetails"));
}
/**
 * specifies that Tabs_ClaimantDetails_Txt
 * is a read only field
 * @return true
 */	
Tabs_ClaimantDetails_Txt.isReadOnly = function(){
	return true;
}


Tabs_Refrence_Txt.helpText = "Reference";
Tabs_Refrence_Txt.componentName = "Reference";
Tabs_Refrence_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_Refrence_Txt.logic = function(event){
	Services.setValue(Tabs_Refrence_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/Reference"));
}
/**
 * specifies that Tabs_Refrence_Txt
 * is a read only field
 * @return true
 */	
Tabs_Refrence_Txt.isReadOnly = function()
{
	return true;
}


Tabs_FileSequence_Txt.helpText = "Customer File Sequence Number";
Tabs_FileSequence_Txt.componentName = "Customer File Sequence Number";
Tabs_FileSequence_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_FileSequence_Txt.logic = function(event){
	Services.setValue(Tabs_FileSequence_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/CustomerFileSequence"));
}
/** 
 * specifies that Tabs_FileSequence_Txt
 * is a read only field
 * @return true
 */	
Tabs_FileSequence_Txt.isReadOnly = function()
{
	return true;
}

Tabs_DefendantName_Txt.helpText = "Defendant Name";
Tabs_DefendantName_Txt.componentName = "Defendant Name";
Tabs_DefendantName_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantName_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantName_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantName"));
}
/** 
 * specifies that Tabs_DefendantName_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantName_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefendantAddress1_Txt.helpText = "Defendant Address";
Tabs_DefendantAddress1_Txt.componentName = "Defendant Address";
Tabs_DefendantAddress1_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantAddress1_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantAddress1_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantAddress1"));
}
/** 
 * specifies that Tabs_DefendantAddress1_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantAddress1_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefendantAddress2_Txt.helpText = "Defendant Address";
Tabs_DefendantAddress2_Txt.componentName = "Defendant Address";
Tabs_DefendantAddress2_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantAddress2_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantAddress2_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantAddress2"));
}
/** 
 * specifies that Tabs_DefendantAddress2_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantAddress2_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefendantAddress3_Txt.helpText = "Defendant Address";
Tabs_DefendantAddress3_Txt.componentName = "Defendant Address";
Tabs_DefendantAddress3_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantAddress3_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantAddress3_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantAddress3"));
}
/** 
 * specifies that Tabs_DefendantAddress3_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantAddress3_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefendantAddress4_Txt.helpText = "Defendant Address";
Tabs_DefendantAddress4_Txt.componentName = "Defendant Address";
Tabs_DefendantAddress4_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantAddress4_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantAddress4_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantAddress4"));
}
/**
 * specifies that Tabs_DefendantAddress4_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantAddress4_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefendantAddress5_Txt.helpText = "Defendant Address";
Tabs_DefendantAddress5_Txt.componentName = "Defendant Address";
Tabs_DefendantAddress5_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefendantAddress5_Txt.logic = function(event){
	Services.setValue(Tabs_DefendantAddress5_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantAddress5"));
}
/**
 * specifies that Tabs_DefendantAddress5_Txt
 * is a read only field
 * @return true
 */	
Tabs_DefendantAddress5_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DefPostcode_Txt.helpText = "Defendant Postcode";
Tabs_DefPostcode_Txt.componentName = "Defendant Postcode";
Tabs_DefPostcode_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DefPostcode_Txt.logic = function(event){
	Services.setValue(Tabs_DefPostcode_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantPostCode"));
}
/**
 * specifies that Tabs_DefPostcode_Txt
 * is a read only field
 * @return true
 */
Tabs_DefPostcode_Txt.isReadOnly = function()
{
	return true;
}


Tabs_EnforcingCourtCode_Txt.helpText = "Enforcing Court Code";
Tabs_EnforcingCourtCode_Txt.componentName = "Enforcing Court Code";
Tabs_EnforcingCourtCode_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_EnforcingCourtCode_Txt.logic = function(event){
	Services.setValue(Tabs_EnforcingCourtCode_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/EnforcingCourtCode"));
}
/**
 * specifies that Tabs_EnforcingCourtCode_Txt
 * is a read only field
 * @return true
 */	
Tabs_EnforcingCourtCode_Txt.isReadOnly = function()
{
	return true;
}


Tabs_DXNumber_Txt.componentName = "DX Number";
Tabs_DXNumber_Txt.helpText = "Defendant Document Exchange Number";
/**
 * specifies that Tabs_DXNumber_Txt
 * is a read only field
 * @return true
 */	
Tabs_DXNumber_Txt.isReadOnly = function() {
	return true;
}

Tabs_DXNumber_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_DXNumber_Txt.logic = function(event){
	Services.setValue(Tabs_DXNumber_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantDXNumber"));
}


Tabs_TelephoneNumber_Txt.componentName = "Telephone Number";
Tabs_TelephoneNumber_Txt.helpText = "Defendant Telephone Number";
/**
 * specifies that Tabs_TelephoneNumber_Txt
 * is a read only field
 * @return true
 */	
Tabs_TelephoneNumber_Txt.isReadOnly = function() {
	return true;
}
Tabs_TelephoneNumber_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_TelephoneNumber_Txt.logic = function(event){
	Services.setValue(Tabs_TelephoneNumber_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantTelephoneNumber"));
}


Tabs_FaxNumber_Txt.componentName = "Fax Number";
Tabs_FaxNumber_Txt.helpText = "Defendant Fax Number";
/** 
 * specifies that Tabs_FaxNumber_Txt
 * is a read only field
 * @return true
 */	
Tabs_FaxNumber_Txt.isReadOnly = function() {
	return true;
}
Tabs_FaxNumber_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_FaxNumber_Txt.logic = function(event){
	Services.setValue(Tabs_FaxNumber_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantFaxNumber"));
}


Tabs_EmailAddress_Txt.componentName = "Email Address";
Tabs_EmailAddress_Txt.helpText = "Defendant Email Address";
/** 
 * specifies that Tabs_EmailAddress_Txt
 * is a read only field
 * @return true
 */	
Tabs_EmailAddress_Txt.isReadOnly = function() {
	return true;
}
Tabs_EmailAddress_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_EmailAddress_Txt.logic = function(event){
	Services.setValue(Tabs_EmailAddress_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantEmailAddress"));
}


Tabs_CommMethod_Dbx.componentName = "Communication Method";
Tabs_CommMethod_Dbx.helpText = "Defendant Preferred Method of Communication";
/** 
 * specifies that Tabs_CommMethod_Dbx
 * is a read only field
 * @return true
 */	
Tabs_CommMethod_Dbx.isReadOnly = function() {
	return true;
}
Tabs_CommMethod_Dbx.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_CommMethod_Dbx.logic = function(event){
	Services.setValue(Tabs_CommMethod_Dbx.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DefendantCommMethod"));
};


Tabs_BalanceOfDebt_Txt.helpText = "Balance of Debt";
Tabs_BalanceOfDebt_Txt.componentName = "Balance of Debt";
Tabs_BalanceOfDebt_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_BalanceOfDebt_Txt.logic = function(event){
	Services.setValue(Tabs_BalanceOfDebt_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/BalanceOfDebt"));
}
/** 
 * specifies that Tabs_BalanceOfDebt_Txt
 * is a read only field
 * @return true
 */	
Tabs_BalanceOfDebt_Txt.isReadOnly = function() {
	return true;
}
/** 
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Tabs_BalanceOfDebt_Txt.transformToDisplay = function(value){	
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


Tabs_Amount_Txt.helpText = "Amount";
Tabs_Amount_Txt.componentName = "Amount";
Tabs_Amount_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_Amount_Txt.logic = function(event){
	Services.setValue(Tabs_Amount_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/Amount"));
}
/** 
 * specifies that Tabs_Amount_Txt
 * is a read only field
 * @return true
 */	
Tabs_Amount_Txt.isReadOnly = function() {
	return true;
}
/** 
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Tabs_Amount_Txt.transformToDisplay = function(value){
	
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


Tabs_Fees_Txt.componentName = "Fee";
Tabs_Fees_Txt.helpText = "Fee";
Tabs_Fees_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_Fees_Txt.logic = function(event){
	Services.setValue(Tabs_Fees_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/Fee"));
}
/** 
 * specifies that Tabs_Fees_Txt
 * is a read only field
 * @return true
 */	
Tabs_Fees_Txt.isReadOnly = function()
{
	return true;
}
/** 
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Tabs_Fees_Txt.transformToDisplay = function(value){
	
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


Tabs_Costs_Txt.componentName = "Costs";
Tabs_Costs_Txt.helpText = "Costs";
Tabs_Costs_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
	
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_Costs_Txt.logic = function(event){
	Services.setValue(Tabs_Costs_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/Costs"));
}
/** 
 * specifies that Tabs_Costs_Txt
 * is a read only field
 * @return true
 */	
Tabs_Costs_Txt.isReadOnly = function()
{
	return true;
}
/** 
 * This function allows the value retrieved from 
 * the Data Model to be arbitrarily transformed before it 
 * is displayed by an adaptor. 
 * @param [String] value the value to be transformed
 * @return the new value
 */
Tabs_Costs_Txt.transformToDisplay = function(value){
	
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


Tabs_Validated_CBx.componentName = "Validated";
Tabs_Validated_CBx.helpText = "Validated";
Tabs_Validated_CBx.modelValue = {checked: "Y", unchecked: "N"};
Tabs_Validated_CBx.logicOn = [currentPage.dataBinding, pageCount.dataBinding]
/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_Validated_CBx.logic = function(event){
	Services.setValue(Tabs_Validated_CBx.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/Validated"));
}
/** 
 * specifies that Tabs_Validated_CBx
 * is a read only field
 * @return true
 */	
Tabs_Validated_CBx.isReadOnly = function()
{
	return true;
}



Tabs_RejectDate_Cal.helpText = "Date Rejected";
Tabs_RejectDate_Cal.componentName = "Date Rejected";
Tabs_RejectDate_Cal.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_RejectDate_Cal.logic = function(event){
	Services.setValue(Tabs_RejectDate_Cal.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/DateRejected"));
}
/** 
 * specifies that Tabs_RejectDate_Cal
 * is a read only field
 * @return true
 */	
Tabs_RejectDate_Cal.isReadOnly = function()
{
	return true;
}


Tabs_RejectReason_Txt.componentName = "Reason for Rejection";
Tabs_RejectReason_Txt.helpText = "Reason for Rejection";
Tabs_RejectReason_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_RejectReason_Txt.logic = function(event){
	Services.setValue(Tabs_RejectReason_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/RejectReason"));
}
/** 
 * specifies that Tabs_RejectReason_Txt
 * is a read only field
 * @return true
 */	
Tabs_RejectReason_Txt.isReadOnly = function()
{
	return true;
}


Tabs_RejectCode_Txt.componentName = "Reject Code";
Tabs_RejectCode_Txt.helpText = "Reject Code";
Tabs_RejectCode_Txt.logicOn = [currentPage.dataBinding, pageCount.dataBinding]

/** 
* The function will be applyed based on a change to the underlying DOM 
*@param event
*/
Tabs_RejectCode_Txt.logic = function(event){
	Services.setValue(Tabs_RejectCode_Txt.dataBinding, Services.getValue(Model_XPATH + "[" + Services.getValue(currentPage.dataBinding) + "]/RejectCode"));
}
/** 
 * specifies that Tabs_RejectCode_Txt
 * is a read only field
 * @return true
 */	
Tabs_RejectCode_Txt.isReadOnly = function()
{
	return true;
}


Tabs_Balance_Cur.componentName="Balance Currency";
/** 
 * specifies that Tabs_Balance_Cur
 * is a read only field
 * @return true
 */	
Tabs_Balance_Cur.isReadOnly = function()
{
	return true;
}


Tabs_Amount_Cur.componentName="Amount Currency";
/** 
 * specifies that Tabs_Amount_Cur
 * is a read only field
 * @return true
 */	
Tabs_Amount_Cur.isReadOnly = function()
{
	return true;
}


Tabs_Fees_Cur.componentName= "Fees Currency";
/** 
 * specifies that Tabs_Fees_Cur
 * is a read only field
 * @return true
 */	
Tabs_Fees_Cur.isReadOnly = function() {
	return true;
}


Tabs_Costs_Cur.componentName="Costs Currency";
/** 
 * specifies that Tabs_Costs_Cur
 * is a read only field
 * @return true
 */	
Tabs_Costs_Cur.isReadOnly = function() {
	return true;
}


/****************************************************************************************************
************************************ Button Actions**************************************************
****************************************************************************************************/

		/** Binding Actions to Main_Clear_Btn */
Main_Clear_Btn.actionBinding = function()
{
   Services.setValue(rejectedWarrantTabSelector.dataBinding, "Tabs_First_Page");
   resetForm();
};
	/** binding keys and mouse events to Main_Clear_Btn */
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "queryRejectedWarants", alt: true }]
      }
};

		/** Binding Actions to Main_Clear_Btn */
Main_Back_Btn.actionBinding = function()
{
	Services.navigate("MainMenu");
};


function CallBackObject(){
}
/** 
 * callback handler which gets invoked upon the return
 * success of the remote invocation.
 * @param [Dom] objDom the reurned domm object from the invocation
 */
CallBackObject.prototype.onSuccess = function(objDom){
	callBackObjectSuccess (objDom);
} 
/** 
 * callBackObjectSuccess handles the population of the search result data
 * @param [Dom] objDom the reurned domm object from the invocation
 */
function callBackObjectSuccess (objDom){
	
	Services.removeNode(FORM_XPATH);

	Services.addNode(objDom, FORM_XPATH + "/Model");
	var nodeCount = parseInt(Services.countNodes(Model_XPATH));	
	if(nodeCount == 0){
		var msg = ErrorCode.getErrorCode("Caseman_noRecordFound_Msg").getMessage();
		Services.setTransientStatusBarMessage(msg);
	}
	else{
		
		if(nodeCount >= 1){			
			Services.setTransientStatusBarMessage("Total Records retrieved is "+nodeCount);
		}
		Services.setValue(pageCount.dataBinding, nodeCount);
		Services.setValue(currentPage.dataBinding, "1");
	}

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


function  DetailCallBackObject(){
}
/** 
 * callback handler which gets invoked upon the return
 * success of the remote invocation.
 * @param [Dom] objDom the reurned domm object from the invocation
 */
DetailCallBackObject.prototype.onSuccess = function(objDom){
	detailCallBackObjectSuccess (objDom);
	
} 
/** 
 * Called to handle the return of the remote invocation 
 * @param [Dom] objDom returned from the remotw invocation
 */
function detailCallBackObjectSuccess  (objDom){

	Services.removeNode(FORM_XPATH + "/Details");
	Services.addNode(objDom, FORM_XPATH + "/Details");
	
}
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


Query_Search_Btn.helpText = "Submit Query";

		/** Binding Actions to Query_Search_Btn*/
Query_Search_Btn.actionBinding = function()
{
	var credCodeAdaptor   = Services.getAdaptorById("Query_CreditorCode_Txt");
	var caseNumAdaptor    = Services.getAdaptorById("Query_CaseNumber_Txt");
	var warrantNumAdaptor = Services.getAdaptorById("Query_WarrantNumber_Txt");
	var claimantAdaptor   = Services.getAdaptorById("Query_ClaimantDetails_Txt");
	var fileSeqAdaptor    = Services.getAdaptorById("Query_FileSequence_Txt");
	var defendantAdaptor  = Services.getAdaptorById("Query_DefendantName_Txt");
	
	if(!credCodeAdaptor.getValid()){
		Services.setFocus("Query_CreditorCode_Txt");
	}
	else if(!caseNumAdaptor.getValid()){
		Services.setFocus("Query_CaseNumber_Txt");
	}
	else if(!warrantNumAdaptor.getValid()){
		Services.setFocus("Query_WarrantNumber_Txt");
	}
	else if(!claimantAdaptor.getValid()){
		Services.setFocus("Query_ClaimantDetails_Txt");
	}
	else if(!fileSeqAdaptor.getValid()){
		Services.setFocus("Query_FileSequence_Txt");
	}
	else if(!defendantAdaptor.getValid()){
		Services.setFocus("Query_DefendantName_Txt");
	}
	else if(isEmptySearch()) {
	 	var msg = ErrorCode.getErrorCode("CaseMan_EmptySearch_Msg").getMessage();
		Services.setTransientStatusBarMessage(msg);
		Services.setFocus("Query_CreditorCode_Txt");
	}
	
	else {  // form is valid
		isFirst = true;
		Services.setValue(rejectedWarrantTabSelector.dataBinding, "Tabs_First_Page");
		var newDOM = XML.createDOM(null, null, null);		
		var mcNode = Services.getNode(Query_XPATH);
		if(mcNode == null){
			Services.setValue(Query_XPATH,"");
			mcNode = Services.getNode(Query_XPATH);
		}
		newDOM.appendChild(mcNode);
		var callbackObj = new CallBackObject() ;
		var params = new ServiceParams() ;
		params.addDOMParameter("Rejected_Warrants_Query", newDOM);
		Services.callService("getSummaryRejectedWarrants",params,callbackObj,true);
		Services.setFocus("Query_CreditorCode_Txt");
		Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag", true);
	}

};



Main_Next_Btn.enableOn = [pageCount.dataBinding, currentPage.dataBinding];
/** 
 * @return boolean based on the value of pageCount.dataBinding and
 * currentPage.dataBinding 
 */
Main_Next_Btn.isEnabled = function(){
	var index = parseInt(Services.getValue(currentPage.dataBinding));
	var pCount = parseInt(Services.getValue(pageCount.dataBinding));
	if(pCount > 1 && (index >= 1 &  index <= pCount)){
		if(index == pCount){
			Services.setTransientStatusBarMessage("Last Record displayed");
			return false;
		}
		else{
			return true;
		}
	}
	else{
		return false;
	}
}
/** Binding Actions to Main_Next_Btn */
Main_Next_Btn.actionBinding = function()
{
	Services.startTransaction();
	
	if(Main_Next_Btn.isEnabled()){
		Services.setValue(rejectedWarrantTabSelector.dataBinding, "Tabs_First_Page");
		if(Services.getValue(currentPage.dataBinding) == null || isNaN(Services.getValue(currentPage.dataBinding))){
			Services.setValue(currentPage.dataBinding, "1");
		}
		var newIndex = parseInt(Services.getValue(currentPage.dataBinding)) + 1;
		Services.setValue(currentPage.dataBinding, parseInt(newIndex));
		if(parseInt(Services.getValue(currentPage.dataBinding)) > 1 && parseInt(Services.getValue(currentPage.dataBinding)) < parseInt(Services.getValue(pageCount.dataBinding))){						
			Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding) + " displayed");
		}
		Services.setFocus("Main_Next_Btn");
		
	}
	Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",true);
	
	Services.endTransaction();	
	
}
	/** binding keys and mouse events to Main_Next_Btn */
Main_Next_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_N, element: "queryRejectedWarants", alt: true }]
      }
};

Main_Previous_Btn.enableOn = [pageCount.dataBinding, currentPage.dataBinding];
/** 
 * @return boolean based on the value of pageCount.dataBinding
 * and currentPage.dataBinding 
 */	
Main_Previous_Btn.isEnabled = function(){
	var index = parseInt(Services.getValue(currentPage.dataBinding));
	var pCount = parseInt(Services.getValue(pageCount.dataBinding));
	if(pCount > 1 && (index >= 1 &  index <= pCount)){
		if(index == 1){
		   	if(isFirst){
		   		Services.setTransientStatusBarMessage("Total Records retrieved is "+Services.getValue(pageCount.dataBinding));
		   		isFirst = false;
		   	}
		   	else
				Services.setTransientStatusBarMessage("First Record displayed");
			return false;
		}
		else{
			return true;
		}
	}
	else{
		return false;
	}
}
/** Binding Actions to Main_Previous_Btn */
Main_Previous_Btn.actionBinding = function()
{
	Services.startTransaction();
	
	Services.setValue(rejectedWarrantTabSelector.dataBinding, "Tabs_First_Page");
	if(Main_Previous_Btn.isEnabled()){
		var newIndex = parseInt(Services.getValue(currentPage.dataBinding)) - 1;
		Services.setValue(currentPage.dataBinding, parseInt(newIndex));
		if(parseInt(Services.getValue(currentPage.dataBinding)) > 1 && parseInt(Services.getValue(currentPage.dataBinding)) < parseInt(Services.getValue(pageCount.dataBinding))){
			Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding) + " displayed");
		}
		Services.setFocus("Main_Previous_Btn");
	}
	Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",true);
	
	Services.endTransaction();	
}
	/** binding keys and mouse events to Main_Previous_Btn */
Main_Previous_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_P, element: "queryRejectedWarants", alt: true }]
      }
};


function Zoom_Hidden_Btn(){};

		/** Binding Actions to Zoom_Hidden_Btn*/
Zoom_Hidden_Btn.actionBinding = function(){	
	if(Services.getValue(rejectedWarrantTabSelector.dataBinding)=="Tabs_First_Page"){
			
		 	Services.setValue(
			DataModel.DEFAULT_TMP_BINDING_ROOT +
					"/Tabs_EmailAddress_Txt_textarea",	 Services.getValue(Tabs_EmailAddress_Txt.dataBinding)); 
			 	
			Services.dispatchEvent("Tabs_EmailAddress_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);	
	}
};
	/** binding keys and mouse events to Zoom_Hidden_Btn */
Zoom_Hidden_Btn.additionalBindings = {
	eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_Z, element: "queryRejectedWarants", alt: true }]
      }
};

/**
*Reset the value of fields in the form 
*/
function resetForm(){
 	Services.startTransaction();
 	   
	Services.removeNode(Query_XPATH);
	Services.removeNode(FORM_XPATH + "Model");
	Services.setValue(pageCount.dataBinding, "");
	Services.setValue(currentPage.dataBinding, "0");
	Services.setValue(PAGE_XPATH + "/secondTabEmptyFlag",true);
	Services.setFocus("Query_CreditorCode_Txt");
	
	Services.endTransaction();	
}


/**
*
*  This method is executed to check weather the search is an empty search
*  The method returns true if the user didnt enter any search item in the fields , at least one of the search items Creditor Code, 
*  Case Number, File Sequence Number, Claimant Name or Defendant Name . 
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

	var warrantNumber = Services.getValue(Query_WarrantNumber_Txt.dataBinding);
	if(warrantNumber != ""  && warrantNumber != null ) {
		emptyFlag = false;
	}	

	var  fileSequenceNum = Services.getValue(Query_FileSequence_Txt.dataBinding);
	if(fileSequenceNum != "" && fileSequenceNum != null) {
		emptyFlag = false;
	}

	var claimantDetails = Services.getValue(Query_ClaimantDetails_Txt.dataBinding);
	if(claimantDetails != "" && claimantDetails != null) {
		emptyFlag = false;
	}
	
	var defendantName = Services.getValue(Query_DefendantName_Txt.dataBinding);
	if(defendantName != "" && defendantName != null) {
		emptyFlag = false;
	}
	return emptyFlag; 
}

 

