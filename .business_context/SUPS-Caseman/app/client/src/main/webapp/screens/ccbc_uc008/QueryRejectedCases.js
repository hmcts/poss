/*
File Name			:QueryRejectedCases.js
Description			:
Owner	(EDS Net ID)	:Hassan F Elhalafawy
Modification History	:
================================================================================
                         	Prior
Date        EDS Net ID           			Version    CR      Description
----------  --------------------------- 	--------   ------- -------------------------------
09-06-2005  Ahmed Bader  (rzm5xl)       	1.0       N/A      Constraction
15-06-2005  Hassan F Elhalafawy (vz618c)    1.1       N/A      Modification
05-09-2005  Khaled A. Gawad   (vzq598)      1.1b      N/A      Defect fixing.
05-10-2005  Khaled A. Gawad   (vzq598)      1.1c               PMC
================================================================================
*/

/****************************************************************************************************************
******************************* CONSTANTS and VARIABLES  ********************************************************
****************************************************************************************************************/
var QUERY_XPATH = "/Query";
var MODEL_XPATH = "/Model";
var REJECTEDCASE_XPATH = FORM_XPATH + MODEL_XPATH+ "/RejectedCases/RejectedCase";
var mainDom = null;
var isFirst = true;
function pageCount() {};
function currentPage() {};

/****************************************************************************************************************
*******************************	Constructors  ***********************************************************************
****************************************************************************************************************/
function Query_Rejected_Cases() {};
function RejectedCasesTabArea() {};
function RejectedCasesTabSelector() {};
function RejectedCasesPagedArea() {};

function Query_Creditor_Code_Txt() {};
function Query_Case_Number_Txt() {};
function Query_Claimant_Name_Txt() {};
function Query_Defendant_Name_Txt() {};
function Main_Search_Btn(){};

function Tabs_First_Page(){};
function Tabs_Case_Number_Txt() {};
function Tabs_Reject_Date_Cal() {};
function Tabs_Reject_Code_Txt() {};
function Tabs_Reject_Reason_Txt() {};
function Tabs_Despatch_Number_Txt() {};
function Tabs_Creditor_Code_Txt() {};
function Tabs_Claimant_Name_Txt(){};
function Tabs_Claimant_Address1_Txt(){};
function Tabs_Claimant_Address2_Txt(){};
function Tabs_Claimant_Address3_Txt(){};
function Tabs_Claimant_Address4_Txt(){};
function Tabs_Claimant_Address5_Txt(){};
function Tabs_ClaimantPostcode_Txt(){};

function Tabs_Claimant_DX_Number_Txt(){};
function Tabs_Claimant_Tel_Number_Txt(){};
function Tabs_Claimant_Fax_Txt(){};
function Tabs_Claimant_Email_Txt(){};
function Tabs_Claimant_CommMethod_Dbx(){};

function Tabs_Refrence_Txt() {};
function Tabs_Representative_Name_Txt() {};
function Tabs_Address1_Txt(){};
function Tabs_Address2_Txt(){};
function Tabs_Address3_Txt(){};
function Tabs_Address4_Txt(){};
function Tabs_Address5_Txt(){};

function Tabs_Rep_DX_Number_Txt(){};
function Tabs_Rep_Tel_Number_Txt(){};
function Tabs_Rep_CommMethod_Dbx(){};

function Tabs_Postcode_Txt() {};
function Tabs_Fax_Txt(){};
function Tabs_Email_Txt() {};


function Tabs_Second_Page() {};
function Tabs_Defendant_Grid() {};
function Tabs_Defendant_Id_Txt() {};
function Tabs_Defendant_Name_Txt() {};
function Tabs_Defendant_Address1_Txt() {};
function Tabs_Defendant_Address2_Txt() {};
function Tabs_Defendant_Address3_Txt() {};
function Tabs_Defendant_Address4_Txt() {};
function Tabs_Defendant_Address5_Txt() {};
function Tabs_Defendant_Postcode_Txt() {};

function Tabs_Defendant_DX_Number_Txt(){};
function Tabs_Defendant_Tel_Number_Txt(){};
function Tabs_Defendant_Fax_Txt(){};
function Tabs_Defendant_Email_Txt(){};
function Tabs_Defendant_CommMethod_Dbx(){};

function Tabs_Third_Page() {};
function Tabs_Amount_Claimed_Currency_Txt() {};
function Tabs_Amount_Claimed_Txt() {};
function Tabs_Court_Fee_Currency_Txt() {};
function Tabs_Court_Fee_Txt() {};
function Tabs_Solicitors_Costs_Currency_Txt() {};
function Tabs_Solicitors_Costs_Txt() {};
function Tabs_Total_Currency_Txt() {};
function Tabs_Total_Txt(){};
function Tabs_Date_Of_Issue_Cal() {};
function Tabs_Date_Of_Service_Cal() {};
function Tabs_Particulars_Of_Claim_Txt() {};
function Tabs_Validated_CBx() {};

function Main_Previous_Btn() {};
function Main_Next_Btn() {};
function Main_Clear_Btn() {};
function Main_Back_Btn() {};


/*****************************************************************************************************************
*******************************	DATA BINDINGS ********************************************************************
*****************************************************************************************************************/
pageCount.dataBinding   = FORM_XPATH + "/pageCount";
currentPage.dataBinding = FORM_XPATH + "/currentPage";

RejectedCasesTabSelector.dataBinding = "/ds/var/page/pagedarea/currentpage";
RejectedCasesPagedArea.dataBinding   = "/ds/var/page/pagedarea/currentpage";

Query_Creditor_Code_Txt.dataBinding  = PAGE_XPATH + QUERY_XPATH + "/CreditorCode";
Query_Case_Number_Txt.dataBinding    = PAGE_XPATH + QUERY_XPATH + "/CaseNumber";
Query_Claimant_Name_Txt.dataBinding  = PAGE_XPATH + QUERY_XPATH + "/ClaimantName";
Query_Defendant_Name_Txt.dataBinding = PAGE_XPATH + QUERY_XPATH + "/DefendantName";

Tabs_Case_Number_Txt.dataBinding         = REJECTEDCASE_XPATH + "/CaseNumber";
Tabs_Reject_Date_Cal.dataBinding         = REJECTEDCASE_XPATH + "/DateRejected";
Tabs_Reject_Code_Txt.dataBinding         = REJECTEDCASE_XPATH + "/RejectCode";
Tabs_Reject_Reason_Txt.dataBinding       = REJECTEDCASE_XPATH + "/RejectReason";
Tabs_Despatch_Number_Txt.dataBinding     = REJECTEDCASE_XPATH + "/DespatchNumber";
Tabs_Creditor_Code_Txt.dataBinding       = REJECTEDCASE_XPATH + "/CreditorCode";
Tabs_Claimant_Name_Txt.dataBinding       = REJECTEDCASE_XPATH + "/ClaimantName";
Tabs_Claimant_Address1_Txt.dataBinding   = REJECTEDCASE_XPATH + "/ClaimantAddress1";
Tabs_Claimant_Address2_Txt.dataBinding   = REJECTEDCASE_XPATH + "/ClaimantAddress2";
Tabs_Claimant_Address3_Txt.dataBinding   = REJECTEDCASE_XPATH + "/ClaimantAddress3";
Tabs_Claimant_Address4_Txt.dataBinding   = REJECTEDCASE_XPATH + "/ClaimantAddress4";
Tabs_Claimant_Address5_Txt.dataBinding   = REJECTEDCASE_XPATH + "/ClaimantAddress5";
Tabs_ClaimantPostcode_Txt.dataBinding    = REJECTEDCASE_XPATH + "/ClaimantAddress6";

Tabs_Claimant_DX_Number_Txt.dataBinding  = REJECTEDCASE_XPATH + "/ClaimantDXNo";
Tabs_Claimant_Tel_Number_Txt.dataBinding = REJECTEDCASE_XPATH + "/ClaimantTelNo";
Tabs_Claimant_Fax_Txt.dataBinding        = REJECTEDCASE_XPATH + "/ClaimantFaxNo";
Tabs_Claimant_Email_Txt.dataBinding      = REJECTEDCASE_XPATH + "/ClaimantEmail";
Tabs_Claimant_CommMethod_Dbx.dataBinding = REJECTEDCASE_XPATH + "/ClaimantPMC";

Tabs_Refrence_Txt.dataBinding     		 = REJECTEDCASE_XPATH + "/Reference";
Tabs_Representative_Name_Txt.dataBinding = REJECTEDCASE_XPATH + "/CorresRepName";
Tabs_Address1_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebAddress1";
Tabs_Address2_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebAddress2";
Tabs_Address3_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebAddress3";
Tabs_Address4_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebAddress4";
Tabs_Address5_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebAddress5";
Tabs_Postcode_Txt.dataBinding 			 = REJECTEDCASE_XPATH + "/CorresRebPostcode";

Tabs_Rep_DX_Number_Txt.dataBinding       = REJECTEDCASE_XPATH + "/CorresRepDXNumber";
Tabs_Rep_Tel_Number_Txt.dataBinding      = REJECTEDCASE_XPATH + "/CorresRepTelNumber";
Tabs_Rep_CommMethod_Dbx.dataBinding      = REJECTEDCASE_XPATH + "/CorresRepCommMethod";

Tabs_Fax_Txt.dataBinding 				 = REJECTEDCASE_XPATH + "/CorresRepFaxNo";
Tabs_Email_Txt.dataBinding 				 = REJECTEDCASE_XPATH + "/CoressRepEmail";

Tabs_Defendant_Grid.dataBinding          = REJECTEDCASE_XPATH + "/DefendantGrid";
Tabs_Defendant_Id_Txt.dataBinding 	     = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantId";
Tabs_Defendant_Name_Txt.dataBinding      = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Name";
Tabs_Defendant_Address1_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Address1";
Tabs_Defendant_Address2_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Address2";
Tabs_Defendant_Address3_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Address3";
Tabs_Defendant_Address4_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Address4";
Tabs_Defendant_Address5_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Address5";
Tabs_Defendant_Postcode_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/Postcode";

Tabs_Defendant_DX_Number_Txt.dataBinding  = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantDXNumber";
Tabs_Defendant_Tel_Number_Txt.dataBinding = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantTelNumber";
Tabs_Defendant_Fax_Txt.dataBinding        = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantFaxNumber";
Tabs_Defendant_Email_Txt.dataBinding      = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantEmailAddress";
Tabs_Defendant_CommMethod_Dbx.dataBinding = REJECTEDCASE_XPATH + "/Defendants/Defendant[./SurrogateKey="+Tabs_Defendant_Grid.dataBinding +"]/DefendantCommMethod";

Tabs_Amount_Claimed_Currency_Txt.dataBinding   = PAGE_XPATH 		+ "/AmountClaimedCurrency";
Tabs_Amount_Claimed_Txt.dataBinding            = REJECTEDCASE_XPATH + "/AmountClaimed";
Tabs_Court_Fee_Currency_Txt.dataBinding        = PAGE_XPATH 		+ "/CourtFeeCurrency";
Tabs_Court_Fee_Txt.dataBinding                 = REJECTEDCASE_XPATH + "/CourtFee";
Tabs_Solicitors_Costs_Currency_Txt.dataBinding = PAGE_XPATH   		+ "/SolicitorsCostsCurrency";
Tabs_Solicitors_Costs_Txt.dataBinding     	   = REJECTEDCASE_XPATH + "/SolicitorsCosts";
Tabs_Total_Currency_Txt.dataBinding 		   = PAGE_XPATH         + "/TotalCurrency";
Tabs_Total_Txt.dataBinding                     = REJECTEDCASE_XPATH + "/Total";
Tabs_Date_Of_Issue_Cal.dataBinding             = REJECTEDCASE_XPATH + "/DateOfIssue";
Tabs_Date_Of_Service_Cal.dataBinding           = REJECTEDCASE_XPATH + "/DateOfService";
Tabs_Particulars_Of_Claim_Txt.dataBinding      = REJECTEDCASE_XPATH + "/ParticularsOfClaim";
Tabs_Validated_CBx.dataBinding                 = REJECTEDCASE_XPATH + "/Validated";


/*****************************************************************************************************************
*******************************	INPUT FIELD DEFINITIONS **********************************************************
*****************************************************************************************************************/
/**
* Initilization for the form Query_Rejected_Cases
*/
Query_Rejected_Cases.initialise = function(){
	Services.setValue(RejectedCasesTabSelector.dataBinding, "Tabs_First_Page");
	Tabs_Amount_Claimed_Currency_Txt.setDefault();
	Tabs_Court_Fee_Currency_Txt.setDefault();
	Tabs_Solicitors_Costs_Currency_Txt.setDefault();
	Tabs_Total_Currency_Txt.setDefault();	
	Services.setFocus("Query_Creditor_Code_Txt");
}
/**
* Menu Bar and the quick links.
*/
menubar = 
{
	quickLinks: 
	[
		{
			id: "Log_Received_Tapes_Btn",                 // id for button
			formName: "ReceivedRecords",       // The name of the current form
			label: " Log Received Tapes ",                    // The label appear in the navigation bar
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
			formName: "ReturnedRecords",       // The name of the current form
			label: " Log Returned Tapes ",                    // The label appear in the navigation bar
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
			id: "View_Rejected_Judgments_Btn",                 // id for button
			formName: "QueryRejectedJudgments",       // The name of the current form
			label: " Rejected Judgments ",                    // The label appear in the navigation bar
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
			formName: "QueryRejectedWarrants",       // The name of the current form
			label: " Rejected Warrants ",                    // The label appear in the navigation bar
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
			id: "View_Rejected_Paid_Btn",                 // id for button
			formName: "QueryRejectedPaid",       // The name of the current form
			label: " Rejected Paid / Written Off Details ",// The label appear in the navigation bar
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
			formName: "ProduceCustomerFileReports",     
			label: " Print Customer File Reports ",                    // The label appear in the navigation bar
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
			formName: "Oracle_Reports_BC_ST_R2",     
			label: " Print Output Statistics Report ",                    // The label appear in the navigation bar
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
			label: " Maintain National Coded Parties ",  
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
* key Bindings for the form Query_Rejected_Cases
*/
Query_Rejected_Cases.keyBindings = [
	{
		/** Binding F1 to Main_Search_Btn */
	   key: Key.F1, action: function(){
			Main_Search_Btn.actionBinding();	
		}
	},
	{
		/** Binding F4 to Main_Back_Btn */
		key: Key.F4, action: function(){
			Main_Back_Btn.actionBinding();
		}
	}	
];

Query_Creditor_Code_Txt.maxLength=4;
Query_Creditor_Code_Txt.helpText="Creditor Code";
Query_Creditor_Code_Txt.componentName="Creditor Code";
/**
 * This function will be invoked to determine if 
 * the content of Query_Creditor_Code_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Creditor_Code_Txt.validate = function() {
	
	var ec = null;
	var value = Services.getValue(Query_Creditor_Code_Txt.dataBinding);
	
	if(!isNumericWithoutWildcard(value)){
		ec = ErrorCode.getErrorCode("CaseMan_CreditorCodeNotNumeric");
	} else if(value.length!=4) {
    	ec =  ErrorCode.getErrorCode("Caseman_creditorCodeNotFourDigits_Msg");	
    }	
	return ec;
}

Query_Claimant_Name_Txt.maxLength=70;
Query_Claimant_Name_Txt.helpText="Claimant Name";
Query_Claimant_Name_Txt.componentName="Claimant Name";
/**
* This function allows the displayed value to be
* arbitrarily transformed to upper case before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Claimant_Name_Txt.transformToModel = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Query_Claimant_Name_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}

Query_Case_Number_Txt.maxLength=8;
Query_Case_Number_Txt.helpText="Case Number";
Query_Case_Number_Txt.componentName="Case Number";
/**
 * This function will be invoked to determine if 
 * the content of Query_Case_Number_Txt
 * is valid.
 * @return ErrorCode object if the content is not valid
 */
Query_Case_Number_Txt.validate = function() {
	var ec = null;
	var value = Services.getValue(Query_Case_Number_Txt.dataBinding);
	// Check value is alphNumeric 
	if ( !isAlphanumExtra(value) ) {
		ec = ErrorCode.getErrorCode("CaseMan_CaseNumberNotAlphaNumeric");
	}
	return ec;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Query_Case_Number_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed to upper case before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Case_Number_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}


Query_Defendant_Name_Txt.maxLength=70;
Query_Defendant_Name_Txt.helpText="Defendant Name";
Query_Defendant_Name_Txt.componentName="Defendant Name";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Query_Defendant_Name_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/**
* This function allows the displayed value to be
* arbitrarily transformed to upper case before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Query_Defendant_Name_Txt.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Case_Number_Txt.isReadOnly = function(){
	return true;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Case_Number_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Case_Number_Txt.componentName="Case Number";
Tabs_Case_Number_Txt.helpText="Case Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Creditor_Code_Txt.isReadOnly = function(){
	return true;
}
Tabs_Creditor_Code_Txt.helpText="Creditor Code";
Tabs_Creditor_Code_Txt.componentName="Creditor Code";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Despatch_Number_Txt.isReadOnly = function(){
	return true;
}
Tabs_Despatch_Number_Txt.helpText="Despatch Number";
Tabs_Despatch_Number_Txt.componentName="Despatch Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Name_Txt.isReadOnly = function() {
	return true;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Name_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Name_Txt.componentName="Claimant Name";
Tabs_Claimant_Name_Txt.helpText="Claimant Name";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Address1_Txt.isReadOnly = function() {
	return true;
}
Tabs_Claimant_Address1_Txt.helpText="Claimant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Address1_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Address1_Txt.componentName="Claimant Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Address2_Txt.isReadOnly = function() {
	return true;
}
Tabs_Claimant_Address2_Txt.helpText="Claimant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Address2_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Address2_Txt.componentName="Claimant Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Address3_Txt.isReadOnly = function() {
	return true;
}
Tabs_Claimant_Address3_Txt.helpText="Claimant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Address3_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Address3_Txt.componentName="Claimant Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Address4_Txt.isReadOnly = function() {
	return true;
}
Tabs_Claimant_Address4_Txt.helpText="Claimant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Address4_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Address4_Txt.componentName="Claimant Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Address5_Txt.isReadOnly = function() {
	return true;
}
Tabs_Claimant_Address5_Txt.helpText="Claimant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Claimant_Address5_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Claimant_Address5_Txt.componentName="Claimant Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_ClaimantPostcode_Txt.isReadOnly = function() {
	return true;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_ClaimantPostcode_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_ClaimantPostcode_Txt.componentName="Claimant Postcode";
Tabs_ClaimantPostcode_Txt.helpText="Claimant Postcode";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Refrence_Txt.isReadOnly = function() {
	return true;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Refrence_Txt.transformToDisplay = function(value) {
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Refrence_Txt.componentName="Reference";
Tabs_Refrence_Txt.helpText="Reference";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Representative_Name_Txt.isReadOnly = function() {
	return true;
}
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Representative_Name_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Representative_Name_Txt.componentName="Correspondence/Representative Name";
Tabs_Representative_Name_Txt.helpText="Correspondence/Representative Name";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Address1_Txt.isReadOnly = function() {
	return true;
}
Tabs_Address1_Txt.helpText="Correspondence/Representative Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Address1_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Address1_Txt.componentName="Correspondence/Representative Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Address2_Txt.isReadOnly = function() {
	return true;
}
Tabs_Address2_Txt.helpText="Correspondence/Representative Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Address2_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Address2_Txt.componentName="Correspondence/Representative Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Address3_Txt.isReadOnly = function() {
	return true;
}
Tabs_Address3_Txt.helpText="Correspondence/Representative Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Address3_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Address3_Txt.componentName="Correspondence/Representative Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Address4_Txt.isReadOnly = function() {
	return true;
}
Tabs_Address4_Txt.helpText="Correspondence/Representative Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Address4_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Address4_Txt.componentName="Correspondence/Representative Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Address5_Txt.isReadOnly = function() {
	return true;
}
Tabs_Address5_Txt.helpText="Correspondence/Representative Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Address5_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Address5_Txt.componentName="Correspondence/Representative Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Postcode_Txt.isReadOnly = function() {
	return true;
}
Tabs_Postcode_Txt.helpText="Correspondence/Representative Postcode";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Postcode_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Postcode_Txt.componentName="Correspondence/Representative Postcode";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Rep_DX_Number_Txt.isReadOnly = function(){
	return true
};
Tabs_Rep_DX_Number_Txt.componentName="Correspondence/Representative DX Number";
Tabs_Rep_DX_Number_Txt.helpText="Correspondence/Representative Document Exchange Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Rep_Tel_Number_Txt.isReadOnly = function(){
	return true
};
Tabs_Rep_Tel_Number_Txt.componentName="Correspondence/Representative Telephone Number";
Tabs_Rep_Tel_Number_Txt.helpText="Correspondence/Representative Telephone Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Rep_CommMethod_Dbx.isReadOnly = function(){
	return true;
}
Tabs_Rep_CommMethod_Dbx.componentName="Correspondence/Representative Preferred Method of Communication";
Tabs_Rep_CommMethod_Dbx.helpText="Correspondence/Representative Preferred Method of Communication";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_DX_Number_Txt.isReadOnly = function(){
return true
};
Tabs_Claimant_DX_Number_Txt.componentName = "Claimant DX Number";
Tabs_Claimant_DX_Number_Txt.helpText = "Claimant Document Exchange Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Tel_Number_Txt.isReadOnly = function(){
	return true
};
Tabs_Claimant_Tel_Number_Txt.componentName = "Claimant Telephone Number";
Tabs_Claimant_Tel_Number_Txt.helpText = "Claimant Telephone Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Fax_Txt.isReadOnly = function(){
	return true
};
Tabs_Claimant_Fax_Txt.componentName = "Claimant Fax Number";
Tabs_Claimant_Fax_Txt.helpText = "Claimant Fax Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_Email_Txt.isReadOnly = function(){
	return true
};
Tabs_Claimant_Email_Txt.componentName = "Claimant Email Address";
Tabs_Claimant_Email_Txt.helpText = "Claimant Email Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Claimant_CommMethod_Dbx.isReadOnly = function(){
	return true;
}
Tabs_Claimant_CommMethod_Dbx.componentName = "Claimant Preferred Method of Communication";
Tabs_Claimant_CommMethod_Dbx.helpText =  "Claimant Preferred Method of Communication";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Fax_Txt.isReadOnly = function() {
	return true;
}
Tabs_Fax_Txt.helpText="Correspondence/Representative Fax Number";
Tabs_Fax_Txt.componentName="Correspondence/Representative Fax Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Email_Txt.isReadOnly = function() {
	return true;
}
Tabs_Email_Txt.helpText="Correspondence/Representative Email Address";
Tabs_Email_Txt.componentName="Correspondence/Representative Email Address";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Reject_Date_Cal.isReadOnly = function() {
	return true;
}
Tabs_Reject_Date_Cal.helpText="Date Rejected";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Reject_Date_Cal.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Reject_Date_Cal.componentName="Date Rejected";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Reject_Code_Txt.isReadOnly = function() {
	return true;
}
Tabs_Reject_Code_Txt.helpText="Reject Code";
Tabs_Reject_Code_Txt.componentName="Reject Code";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Reject_Reason_Txt.isReadOnly = function() {
	return true;
}
Tabs_Reject_Reason_Txt.helpText="Reason for Rejection";
Tabs_Reject_Reason_Txt.componentName=="Reason for Rejection";

Tabs_Defendant_Id_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Id_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Id_Txt.componentName="Defendant ID";

Tabs_Defendant_Grid.helpText="Defendants";
Tabs_Defendant_Grid.componentName="Defendants";
 
Tabs_Defendant_Id_Txt.helpText="Defendant Id";

Tabs_Defendant_Name_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Name_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Name_Txt.helpText="Defendant Name";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Name_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Name_Txt.componentName="Defendant Name";

Tabs_Defendant_Address1_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Address1_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Address1_Txt.helpText="Defendant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Address1_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Address1_Txt.componentName="Defendant Address";

Tabs_Defendant_Address2_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Address2_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Address2_Txt.helpText="Defendant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Address2_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Address2_Txt.componentName="Defendant Address";

Tabs_Defendant_Address3_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Address3_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Address3_Txt.helpText="Defendant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Address3_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Address3_Txt.componentName="Defendant Address";

Tabs_Defendant_Address4_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Address4_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Address4_Txt.helpText="Defendant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Address4_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Address4_Txt.componentName="Defendant Address";
Tabs_Defendant_Address5_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Address5_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Address5_Txt.helpText="Defendant Address";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Address5_Txt.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Address5_Txt.componentName="Defendant Address";

Tabs_Defendant_Postcode_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Postcode_Txt.isReadOnly = function() {
	return true;
}
Tabs_Defendant_Postcode_Txt.helpText="Defendant Postcode";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Postcode_Txt.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Postcode_Txt.componentName="Defendant Postcode";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_DX_Number_Txt.isReadOnly = function(){
	return true
};
Tabs_Defendant_DX_Number_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
Tabs_Defendant_DX_Number_Txt.componentName="Defendant DX Number";
Tabs_Defendant_DX_Number_Txt.helpText="Defendant Document Exchange Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Tel_Number_Txt.isReadOnly = function(){return true};
Tabs_Defendant_Tel_Number_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
Tabs_Defendant_Tel_Number_Txt.componentName="Defendant Telephone Number";
Tabs_Defendant_Tel_Number_Txt.helpText="Defendant Telephone Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Fax_Txt.isReadOnly = function(){
	return true	
};
Tabs_Defendant_Fax_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
Tabs_Defendant_Fax_Txt.componentName="Defendant Fax Number";
Tabs_Defendant_Fax_Txt.helpText="Defendant Fax Number";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_Email_Txt.isReadOnly = function(){
	return true
};
Tabs_Defendant_Email_Txt.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
Tabs_Defendant_Email_Txt.componentName="Defendant Email Address";
Tabs_Defendant_Email_Txt.helpText="Defendant Email Address";
Tabs_Defendant_CommMethod_Dbx.retrieveOn = [Tabs_Defendant_Grid.dataBinding];
/**
* This function allows the displayed value to be
* arbitrarily transformed before it is stored 
* in the data model.
* @param [String] value the value to be transformed
* @return the new value		 
*/
Tabs_Defendant_CommMethod_Dbx.transformToModel = function(value){
	value = Trim(value);
	if(value=="") value=null;
	return value;
};
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Defendant_CommMethod_Dbx.isReadOnly = function(){
	return true;
}
Tabs_Defendant_CommMethod_Dbx.componentName="Defendant Preferred Method of Communication";
Tabs_Defendant_CommMethod_Dbx.helpText="Defendant Preferred Method of Communication";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Amount_Claimed_Currency_Txt.isReadOnly = function() {
	return true;
}
Tabs_Amount_Claimed_Currency_Txt.helpText="Amount Claimed Currency";
Tabs_Amount_Claimed_Currency_Txt.componentName="Amount Claimed Currency";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Amount_Claimed_Txt.isReadOnly = function() {
	return true;
}
Tabs_Amount_Claimed_Txt.helpText="Amount Claimed";
Tabs_Amount_Claimed_Txt.componentName="Amount Claimed";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to 
* the format of 9999999.99 before it is
* displayed by the adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Amount_Claimed_Txt.transformToDisplay = function(value){
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
}
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Court_Fee_Txt.isReadOnly = function() {
	return true;
}
Tabs_Court_Fee_Txt.helpText="Court Fee";
Tabs_Court_Fee_Txt.componentName="Court Fee";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to 
* the format of 9999999.99 before it is
* displayed by the adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Court_Fee_Txt.transformToDisplay = function(value){
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
}
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Solicitors_Costs_Txt.isReadOnly = function() {
	return true;
}
Tabs_Solicitors_Costs_Txt.helpText="Solicitors Costs";
Tabs_Solicitors_Costs_Txt.componentName="Solicitors Costs";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to 
* the format of 9999999.99 before it is
* displayed by the adaptor. 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Solicitors_Costs_Txt.transformToDisplay = function(value){
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
}
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Total_Txt.isReadOnly = function() {
	return true;
}
Tabs_Total_Txt.helpText="Total";
Tabs_Total_Txt.componentName="Total";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to 
* the format of 9999999.99 before it is
* displayed by the adaptor. 
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
}
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Court_Fee_Currency_Txt.isReadOnly = function() {
	return true;
}
Tabs_Court_Fee_Currency_Txt.helpText="Court Fee Currency";
Tabs_Court_Fee_Currency_Txt.componentName="Court Fee Currency";
/** 
* This function set the default currency value
* for the field Tabs_Amount_Claimed_Currency_Txt
*/
Tabs_Amount_Claimed_Currency_Txt.setDefault = function() {
	Services.setValue(Tabs_Amount_Claimed_Currency_Txt.dataBinding,"\xA3");
}
Tabs_Amount_Claimed_Currency_Txt.componentName="Amount Claimed Currency";
/** 
* This function set the default currency value
* for the field Tabs_Court_Fee_Currency_Txt
*/
Tabs_Court_Fee_Currency_Txt.setDefault = function() {
	Services.setValue(Tabs_Court_Fee_Currency_Txt.dataBinding, "\xA3");
}
Tabs_Court_Fee_Currency_Txt.componentName="Court Fee Currency";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Solicitors_Costs_Currency_Txt.isReadOnly = function() {
	return true;
}
Tabs_Solicitors_Costs_Currency_Txt.helpText="Solicitors Costs Currency";
Tabs_Solicitors_Costs_Currency_Txt.componentName="Solicitors Costs Currency";
/** 
* This function set the default currency value
* for the field Tabs_Solicitors_Costs_Currency_Txt
*/
Tabs_Solicitors_Costs_Currency_Txt.setDefault = function() {
	Services.setValue(Tabs_Solicitors_Costs_Currency_Txt.dataBinding, "\xA3");
}
Tabs_Solicitors_Costs_Currency_Txt.componentName="Solicitors Costs Currency";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Total_Currency_Txt.isReadOnly = function() {
	return true;
}
Tabs_Total_Currency_Txt.helpText="Total Currency";
Tabs_Total_Currency_Txt.componentName="Total Currency";
/** 
* This function set the default currency value
* for the field Tabs_Total_Currency_Txt
*/
Tabs_Total_Currency_Txt.setDefault = function() {
	Services.setValue(Tabs_Total_Currency_Txt.dataBinding, "\xA3");
}
Tabs_Total_Currency_Txt.componentName="Total Currency";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Date_Of_Issue_Cal.isReadOnly = function() {
	return true;
}
Tabs_Date_Of_Issue_Cal.helpText="Date of Issue";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Date_Of_Issue_Cal.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Date_Of_Issue_Cal.componentName="Date of Issue";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Date_Of_Service_Cal.isReadOnly = function() {
	return true;
}
Tabs_Date_Of_Service_Cal.helpText="Date of Service";
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Date_Of_Service_Cal.transformToDisplay = function(value){
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Date_Of_Service_Cal.componentName="Date of Service";
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Particulars_Of_Claim_Txt.isReadOnly = function() {
	return true;
}
Tabs_Particulars_Of_Claim_Txt.helpText="Particulars of Claim";
Tabs_Particulars_Of_Claim_Txt.componentName="Particulars of Claim";

Tabs_Validated_CBx.modelValue = {checked: "Y", unchecked: "N"};
/** 
* This function specifies that the field is 
* a read only field.
* @return true
*/
Tabs_Validated_CBx.isReadOnly = function() {
	return true;
}
Tabs_Validated_CBx.helpText="Validated";
Tabs_Validated_CBx.componentName="Validated";

/*****************************************************************************************************************
*******************************	BUTTON FIELD DEFINITIONS *********************************************************
*****************************************************************************************************************/


Main_Search_Btn.helpText="Submit Query";
/**
 Binding Actions to Main_Search_Btn
*/
Main_Search_Btn.actionBinding = function(){

	var credCodeAdaptor  = Services.getAdaptorById("Query_Creditor_Code_Txt");
	var caseNumAdaptor   = Services.getAdaptorById("Query_Case_Number_Txt");
	var claimantAdaptor  = Services.getAdaptorById("Query_Claimant_Name_Txt");
	var defendantAdaptor = Services.getAdaptorById("Query_Defendant_Name_Txt");
	
	if(!credCodeAdaptor.getValid()){
		Services.setFocus("Query_Creditor_Code_Txt");
	}
	else if(!caseNumAdaptor.getValid()){
		Services.setFocus("Query_Case_Number_Txt");
	}
	else if(!claimantAdaptor.getValid()){
		Services.setFocus("Query_Claimant_Name_Txt");
	}
	else if(!defendantAdaptor.getValid()){
		Services.setFocus("Query_Defendant_Name_Txt");
	}
	
	else{
		isFirst = true;
		var callbackObj = new CallBackObject() ;
		var params = new ServiceParams();
		if(Services.getValue(Query_Creditor_Code_Txt.dataBinding)!=null)	
			params.addSimpleParameter("Creditor_Code", Services.getValue(Query_Creditor_Code_Txt.dataBinding));		
		if(Services.getValue(Query_Case_Number_Txt.dataBinding)!=null)	
			params.addSimpleParameter("Case_Number", Services.getValue(Query_Case_Number_Txt.dataBinding));
		if(Services.getValue(Query_Claimant_Name_Txt.dataBinding)!=null)			
			params.addSimpleParameter("Claimant_Name", Services.getValue(Query_Claimant_Name_Txt.dataBinding));
		if(Services.getValue(Query_Defendant_Name_Txt.dataBinding)!=null)			
			params.addSimpleParameter("Defendant_Name", Services.getValue(Query_Defendant_Name_Txt.dataBinding));
		
		Services.callService("getRejectedCases",params,callbackObj,true);
		Services.setFocus("Query_Creditor_Code_Txt");
	}

};
Main_Next_Btn.enableOn = [pageCount.dataBinding, currentPage.dataBinding];
/** 
* This function specifies if Main_Next_Btn
* is enabled
* @return boolean
*/	
Main_Next_Btn.isEnabled = function(){
	var index = parseInt(Services.getValue(currentPage.dataBinding));
	var pCount = parseInt(Services.getValue(pageCount.dataBinding));
	if(pCount > 1 && (index >= 1 &  index <= pCount)){
		if(index == pCount){
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
/**
 Binding Actions to Main_Next_Btn
*/
Main_Next_Btn.actionBinding = function()
{
	Services.startTransaction();		
	if(Main_Next_Btn.isEnabled()){
		if(Services.getValue(currentPage.dataBinding) == null || isNaN(Services.getValue(currentPage.dataBinding))){
			Services.setValue(currentPage.dataBinding, "1");
		}
		var newIndex = parseInt(Services.getValue(currentPage.dataBinding)) + 1;
		Services.setValue(currentPage.dataBinding, parseInt(newIndex));	
		Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding)+ " displayed");
			
		var dd = Services.getNode(PAGE_XPATH + "/RejectedCases/RejectedCase[" + Services.getValue(currentPage.dataBinding) + "]");
		Services.replaceNode(FORM_XPATH + "/Model/RejectedCases/RejectedCase", dd);
		checkDefendant2();
		
		Services.setValue(RejectedCasesTabSelector.dataBinding, "Tabs_First_Page");
	}
	var index = parseInt(Services.getValue(currentPage.dataBinding));
	var pCount = parseInt(Services.getValue(pageCount.dataBinding));
	if(index == pCount){
			Services.setTransientStatusBarMessage("Last record displayed");
	}
	else{
		Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding)+ " displayed");		
	}
	Services.setFocus("Main_Next_Btn");
	Services.endTransaction();	
}
/**
	key bindings for Main_Next_Btn Alt+N
*/
Main_Next_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_N, element: "Query_Rejected_Cases", alt: true }]
      }
};
Main_Previous_Btn.enableOn = [pageCount.dataBinding, currentPage.dataBinding];
/** 
* This function specifies if Main_Previous_Btn
* is enabled
* @return boolean
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
		    	Services.setTransientStatusBarMessage("First record displayed");
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
/**
 Binding Actions to Main_Previous_Btn
*/
Main_Previous_Btn.actionBinding = function()
{
	Services.startTransaction();
	
			if(Main_Previous_Btn.isEnabled()){
				var newIndex = parseInt(Services.getValue(currentPage.dataBinding)) - 1;
				Services.setValue(currentPage.dataBinding, parseInt(newIndex));	
				var dd = Services.getNode(PAGE_XPATH + "/RejectedCases/RejectedCase[" + Services.getValue(currentPage.dataBinding) + "]");
				Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding)+ " displayed");
				Services.replaceNode(FORM_XPATH + "/Model/RejectedCases/RejectedCase", dd);
				checkDefendant2();
				Services.setValue(RejectedCasesTabSelector.dataBinding, "Tabs_First_Page");
				
			}
			var index = parseInt(Services.getValue(currentPage.dataBinding));
			var pCount = parseInt(Services.getValue(pageCount.dataBinding));
			if(pCount > 1 && (index >= 1 &  index <= pCount)){
			
				if(index == 1){
					if(isFirst){
						Services.setTransientStatusBarMessage("Total Records retrieved is "+Services.getValue(pageCount.dataBinding));
				   	}
					else {
				    	Services.setTransientStatusBarMessage("First record displayed");
					}
				}
				else{
					Services.setTransientStatusBarMessage("Record Number " + Services.getValue(currentPage.dataBinding)+ " displayed");
					
				}
			}
	Services.setFocus("Main_Previous_Btn");		
	Services.endTransaction();
}
/**
	key bindings for Main_Previous_Btn Alt+P
*/
Main_Previous_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_P, element: "Query_Rejected_Cases", alt: true }]
      }
};
/**
 Binding Actions to Main_Clear_Btn
*/
Main_Clear_Btn.actionBinding = function(){
	_clearAll();	
	Services.setValue(RejectedCasesTabSelector.dataBinding, "Tabs_First_Page");
	Services.setFocus("Query_Creditor_Code_Txt");
}
/**
	key bindings for Main_Clear_Btn Alt+C
*/
Main_Clear_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_C, element: "Query_Rejected_Cases", alt: true }]
      }
};
/**
 Binding Actions to Main_Back_Btn
*/
Main_Back_Btn.actionBinding = function(){
	Services.navigate("MainMenu");
}

function Main_Zoom_Btn(){};
/**
 Binding Actions to Main_Zoom_Btn
*/
Main_Zoom_Btn.actionBinding = function(){
	var currentPage = Services.getValue(RejectedCasesTabSelector.dataBinding);
	switch(currentPage){
		case "Tabs_First_Page":	 
			var zoom1 = Services.getAdaptorById("Tabs_Claimant_Email_Txt");
			var zoom2 = Services.getAdaptorById("Tabs_Email_Txt");		
			
			if(zoom1.hasFocus()==true){
				Services.setValue(
					DataModel.DEFAULT_TMP_BINDING_ROOT + "/Tabs_Claimant_Email_Txt_textarea",
			    	Services.getValue(Tabs_Claimant_Email_Txt.dataBinding)); 
		    		 	
				 Services.dispatchEvent("Tabs_Claimant_Email_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			}
			
			else if(zoom2.hasFocus()==true){
				Services.setValue(
					DataModel.DEFAULT_TMP_BINDING_ROOT + "/Tabs_Email_Txt_textarea",
			    	Services.getValue(Tabs_Email_Txt.dataBinding)); 
		    		 	
				 Services.dispatchEvent("Tabs_Email_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			}
		 break;
		 
		case "Tabs_Second_Page": 
			 var zoom = Services.getAdaptorById("Tabs_Defendant_Email_Txt");
			 
			 if(zoom.getEnabled()){				
				 Services.setValue(
					DataModel.DEFAULT_TMP_BINDING_ROOT + "/Tabs_Defendant_Email_Txt_textarea",
			    	Services.getValue(Tabs_Defendant_Email_Txt.dataBinding)); 
		    		 	
				 Services.dispatchEvent("Tabs_Defendant_Email_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			 }			 
			break;
		
		case "Tabs_Third_Page" : 
			 var zoom = Services.getAdaptorById("Tabs_Particulars_Of_Claim_Txt");
		     
			 if(zoom.getEnabled()){				
				 Services.setValue(
					DataModel.DEFAULT_TMP_BINDING_ROOT + "/Tabs_Particulars_Of_Claim_Txt_textarea",
			    	Services.getValue(Tabs_Particulars_Of_Claim_Txt.dataBinding)); 
		    		 	
				 Services.dispatchEvent("Tabs_Particulars_Of_Claim_Txt_popup", PopupGUIAdaptor.EVENT_RAISE);
			 }
			break;
   }	
	
};
/**
	key bindings for Main_Zoom_Btn Alt+Z
*/
Main_Zoom_Btn.additionalBindings = {
      eventBinding: {
            singleClicks: [],
            doubleClicks: [],
            keys: [{ key: Key.CHAR_Z, element: "Query_Rejected_Cases", alt: true }]
      }
};
/*****************************************************************************************************************
*******************************	GRID DEFINITIONS *****************************************************************
*****************************************************************************************************************/
/**
* This function allows the value retrieved from 
* the data model to be arbitrarily transformed to upper case
* before it is displayed by the adaptor 
* @param [String] value the value to be transformed
* @return the new value
*/
Tabs_Defendant_Grid.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Tabs_Defendant_Grid.srcData = REJECTEDCASE_XPATH + "/Defendants";
Tabs_Defendant_Grid.rowXPath = "Defendant";
Tabs_Defendant_Grid.keyXPath = "SurrogateKey";
Tabs_Defendant_Grid.columns = [
	{xpath: "DefendantId" ,transformToDisplay: function(value) { return (null != value) ? value.toUpperCase() : null; } },
	{xpath: "Name" ,transformToDisplay: function(value) { return (null != value) ? value.toUpperCase() : null; }}
];


/*****************************************************************************************************************
*******************************	HELPER FUNCTIONS *****************************************************************
*****************************************************************************************************************/

var numb = '0123456789';
var lwr = 'abcdefghijklmnopqrstuvwxyz';
var upr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var percentage = '%';
var space = ' ';
/**
* The method specifies weather the param is
* valid as an input parameter
* @param  parm 
* @param  val
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
*
*  This method is executed to clear the main screen and reset 
*  the input fields to the default values. 
*  @param  none.
*  @return void	
*/
function _clearAll()
{
	Services.startTransaction();
	
		Services.removeNode(REJECTEDCASE_XPATH);
		Services.setValue(Tabs_Validated_CBx.dataBinding, "N");	
		Services.removeNode(PAGE_XPATH + QUERY_XPATH);		
		Services.setValue(pageCount.dataBinding, "");
		Services.setValue(currentPage.dataBinding, "0");
	
	Services.endTransaction();
	
	Tabs_Amount_Claimed_Currency_Txt.setDefault();
	Tabs_Court_Fee_Currency_Txt.setDefault();
	Tabs_Solicitors_Costs_Currency_Txt.setDefault();
	Tabs_Total_Currency_Txt.setDefault();		
	mainDom=null;
	
}
	 
function CallBackObject(){}
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
*
*  Search Action onSuccess function
*  @param  objDom returned dom resulted from the query
*  @return void	
*/
CallBackObject.prototype.onSuccess = function(objDom)
{
	callBackSuccess(objDom);
}
/**
*
*  callBackSuccess handles the display of  
*  search results
*  @param  objDom returned dom resulted from the query
*  @return void	
*/
function callBackSuccess(objDom) 
{ 
	Services.startTransaction();
	
		Services.removeNode(REJECTEDCASE_XPATH);	
		Services.replaceNode(PAGE_XPATH+"/RejectedCases", objDom);
		var dd = Services.getNode(PAGE_XPATH + "/RejectedCases/RejectedCase[1]");
		Services.addNode(dd, FORM_XPATH + "/Model/RejectedCases");
				
		checkDefendant2();
		var nodeCount = Services.countNodes(PAGE_XPATH+"/RejectedCases/RejectedCase");
						
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
		Services.setValue(RejectedCasesTabSelector.dataBinding, "Tabs_First_Page");

	Services.endTransaction();
}

/**
* The method specifies weather the param argument
* consists of ([a-z][A-Z][0-9]) or not.
* @param  parm 
* @return boolean	
*/
function isAlphanum(parm) {
	return isValid(parm,lwr+upr+numb);
} 
/**
* The method specifies weather the param argument
* consists of ([a-z][A-Z][space][%])  or not.
* @param  parm 
* @return boolean	
*/
function isAlphaExtra(parm) {
	return isValid(parm,lwr+upr+percentage+space);
}
/**
* The method specifies weather the param argument
* consists of ([0-9][%])  or not.
* @param  parm 
* @return boolean	
*/
function isNumExtra(parm) {
	return isValid(parm,numb+percentage);
}
/**
* The method specifies weather the param argument
* consists of ([a-z][A-Z][0-9][space][%])  or not.
* @param  parm 
* @return boolean	
*/
function isAlphanumExtra(parm) {
	return isValid(parm,lwr+upr+numb+space+percentage);
} 
/**
 * This method is to check if defendant_2_name
 * defendant_2_addr_1
 * defendant_2_addr_2
 * defendant_2_addr_3
 * defendant_2_addr_4
 * defendant_2_addr_5
 * defendant_2_postcode  are null
 */
function checkDefendant2(){

	var defendant2Name     = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Name");
	var defendant2Address1 = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Address1");
	var defendant2Address2 = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Address2");
	var defendant2Address3 = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Address3");
	var defendant2Address4 = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Address4");
	var defendant2Address5 = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Address5");
	var defendant2Postcode = Services.getValue(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]/Postcode");
	
	if(defendant2Name==null&&defendant2Address1==null&&defendant2Address2==null&&defendant2Address3==null&&defendant2Address4==null&&defendant2Address5==null&&defendant2Postcode==null)
	{
		Services.removeNode(FORM_XPATH + "/Model/RejectedCases/RejectedCase/Defendants/Defendant[2]");

	}
	
}