/** 
 * @fileoverview MaintainJudgments.js:
 * This file contains the form configurations for the UC004 - Maintain Judgments screen
 *
 * @author Mark Groen
 * @version 1.0
 * V5
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, added same max length, validation and mandatory rules to JudgmentDetails_JudgmentCosts
 *				and JudgmentDetails_JudgmentAmount fields as in the Add Judgment popup.  Otherwise, was a
 *				possibility that can click Amend Judgment to change the fields and save them as blank or
 *				invalid amounts.
 * 20/06/2006 - Chris Vincent, Changed JudgmentDetails_PaidInFullDate.logic to fix defect 3634 which states that
 *				event 79 should only be fired when ALL Judgments have a date in the Paid In Full field.  Logic
 *				now performs this check before setting JudgmentVariables.FINAL_PAYMENT_MADE.
 * 19/07/2006 - Mark Groen, defect 3990. E.g. Not validating Amount and Costs correctly 
 * 				when stored as 10.1
 * 24/08/2006 - Mark Groen, defect 4630. Add Application button not being disabled when the add popup is displayed
 *				This is a framework defect. Added following work around - defect due to time issue.  I.e. in 
 *				this case popup opened before button was disabled!
 * 29/08/2006 - Mark Groen, defect 4759. When the app to vary poup is displayed fixed so the grid is in focus.
 * 07/09/2006 - Mark Groen, defect 5137. When a hearing is created - event 200.  If Obligations exist, the user 
 *				is taken to the screen without choice, when saving the Judgment. Changed the navigation case statement
 * 07/09/2006 - Mark Groen, uct defect 653 - do not produce output if a ccbc case 
 * 07/09/2006 - Frederik Vandendriessche, uct defect 498, multiple events creating outputs
 * 11/10/2006 - Frederik Vandendriessche, Mark Groen, UCT 498
 * 24/11/2006 - Mark Groen, UCT 745 - Should only print a N246, when the applicant is 'PARTY AGAINST' on the new Vary
 * 24/11/2006 - Mark Groen, UCT 746 - When the applicant is 'BY CONSENT' on the Vary, claimant response and response date 
 *				are Read Only.
 * 24/11/2006 - Mark Groen, UCT 749 - Vary, if response is 'No Response within 16 days' - response date shopuld be disabled.
 * 25/11/2006 - Mark Groen, UCT 756 - Vary, if result is 'Refer To Judge' - validation should only happen if applicant is 
 *				'PARTY AGAINST'
 *
 * 12/01/2007 - Mark Groen, TEMP_CASEMAN 352 - When the applicant is 'PARTY FOR' on the Vary, claimant response and response date 
 *				are Read Only.
 * 15/01/2007 - Mark Groen, TEMP_CASEMAN 318 (in part) - Only create an event 600 when the Judgment has been registered. I.e. if there is a 
 *				Sent to Rtl date.
 * 23/03/2007 - Mark Groen, CASEMAN 6022 (TEMP_CASEMAN 303) - Should prompt for obligations if creating a varaiation for a PARTY_AGAINST
 * 18/04/2007 - Mark Groen, CASEMAN 6004 New result added for App To Set Aside - IN ERROR. When this value is selected no output is created.  
 *				Used when a user 
 * 15/01/2007 - Mark Groen, TEMP_CASEMAN 303 - Should prompt for obligations if creating a varaiation for a PARTY_AGAINST
 * 13/03/2007 - Mark Groen, GROUP 2 4410 - Only set the Judgment status to 'Varied' for non ccbs courts
 * 26/04/2007 - Mark Groen, UCT GROUP 2 1313 - Only produce event 600 for non ccbs courts
 * 26/04/2007 - Mark Groen, UCT GROUP 2 1316,  1367 - Only maintain obligations, when an event 170 created, for non ccbs courts
 * 02/05/2007 - Mark Groen, UCT GROUP 2 1337 - For ccbc... need extra validation re costs field.
 * 09/07/2007 - Chris Vincent, CaseMan Defect 6263, updated Status_Save.actionBinding to include createO31251 which ensures that
 * 				O_3_1_2_5_1 is produced with the event 170 for CCBC when the event 600 is not produced.
 * 19/07/2007 - Chris Vincent, UCT_Group2 1501: No Obligations prompt for event 140.
 * 30/07/2007 - Mark Groen, CASEMAN 6383 - For ccbc... Paid before calculation not correct when in unit of 10p - e.g. 7.10, 58.30
 * 08/08/2007 - Mark Groen, GROUP 2 DEFECT 1488 - For ccbc... EVENT 79 always produced when judgment paid in full.  The 
 * 				case status set to PAID when all the judgments on the case, are set to PAID.
 * 16/08/2007 - Mark Groen, GROUP 2 DEFECT 1526 - For ccbc only ... If Case Status is STAYED, can only view Judgments. I.e. 
 * 				cannot save changes. Added message.
 * 16/08/2007 - Mark Groen, GROUP 2 DEFECT 1533 - For all ccbc and normal ... Paid in full date is now always updateable, unless
 * 				the judgment status is 'Set Aside'.
 *
 * 11/10/2007 - Mark Groen, GROUP 2 DEFECT 1550 - For ccbc  ... Only produce the O_3_1_2_5_1 output for ccbc when the
 * 				apllicant to set aside is PROPER_OFFICER.
 * 07/11/2007 - Mark Groen, Amended set aside result and set aside result date readonly functions, to fix defect ccbc grp2 1549 (maintenaince release),
 * 				which states that for ccbc cases, the user should be allowed to still make the judgment 'set aside', when the judgment
 * 				had a status of CANCELLED and SATISFIED
 * 25/01/2008 - Mark Groen, CASEMAN 6475 - Ensure the case events from judgments have the case court code and not the 
 * 				Judgment court code. 
 * 14/02/2008 - Mark Groen, UCT GROUP2 1543 - When an application to vary has a result of refused.  The 140 event 
 * 				result should be set to REFUSED
 * 14/02/2008 - Mark Groen, Prog Testing 1070 - When an app to vary result is changed from a value to blank, need to reset the flags.
 * 18/10/2013 - Chris Vincent, Trac #4997 - added logic to set a flag when an application to set aside is set to REFUSED
 *				which is subsequently passed to the server side during the save button logic.  Required for CCBC SDT.
 * 04/02/2015 - Chris Vincent, Trac 5473.  When a Set Aside is updated, ASAUpdated flag is set to Y for that application.
 * 06/01/2017 - Chris Vincent. Trac 5879, RTL fields disabled for family enforcement cases.
 */
/****************************************************************************************************************
                                  MAIN FUNCTION CALLED BY HTML
****************************************************************************************************************/

// Global variables
var nextSurrogateKey = 0;

/*****************************************************************************************************************
                                               MAIN FORM
****************************************************************************************************************/
function MaintainJudgment() {}

/**
 * @author rzhh8k
 * 
 */
MaintainJudgment.initialise = function()
{
	JudgmentFunctions.getJudgments(true);// initial get	
}

/**
 * onSucess to handle the retrieval of reference data that is lazy loaded
 * @param dom
 * @param serviceName
 * @author rzhh8k
 * 
 */
MaintainJudgment.onSuccess = function(dom, serviceName)
{
	switch (serviceName){
		case "getJudgmentResultsetaside":
			Services.replaceNode(JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsAside", dom);
			break;
		case "getJudgmentApplicant":
			Services.replaceNode(JudgmentVariables.REF_DATA_XPATH + "/Applicants", dom);
			break;
		case "getJudgmentResultvarying":
			Services.replaceNode(JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsVary", dom);
			break;
		case "getJudgmentResponses":
			Services.replaceNode(JudgmentVariables.REF_DATA_XPATH + "/JudgmentClaimResponses", dom);
			break;
		case "getCostsForJudgmentList":
			Services.replaceNode(JudgmentVariables.REF_DATA_XPATH + "/Costs", dom); //GROUP2 1337
			break;		
		default:
			break;				
	}
}

// Load reference data from server-side service calls		
MaintainJudgment.refDataServices = [
	{name:"CurrentCurrency", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getCurrentCurrency", serviceParams:[]},
	{name:"JudgmentPeriods", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getJudgmentDeterminationperiods", serviceParams:[]},
	{name:"SystemDate", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/**
 * load data is a div tag in the html and is used to make the callback to onSuccess from the
 * @author rzhh8k
 * 
 */
function loadData() {}

/**
 * @param dom
 * @author rzhh8k
 * 
 */
loadData.onSuccess = function(dom)
{
	if(dom != null){
		var result = dom.selectSingleNode("/ds/MaintainJudgment");
		if(null != result){
			Services.replaceNode("/ds/MaintainJudgment", result);
			
			// Filter the parties for the header grid
			var caseType = Services.getValue("/ds/MaintainJudgment/CaseType");
			CaseManUtils.setPartiesForHeaderGrid(caseType, "/ds/MaintainJudgment/Parties/Party", "PartyRoleCode");
			
			// copy the edit fileds to tmp so know whether ead only or not (i.e. is it saved previously)
			JudgmentFunctions.copyEditFields();
		}
 	}// end of if (dom != null) 	
}// end onSuccess
/**
 * @param exception
 * @author rzhh8k
 * 
 */
loadData.onError = function(exception)
{
	alert(Messages.ERR_RET_JUDGMENTS_MESSAGE);
}

/*****************************************************************************************************************
                                             SUBFORMS
****************************************************************************************************************/

function judgmentPayee_subform() {};

judgmentPayee_subform.subformName = "JudgmentPayeeSubform";

judgmentPayee_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_PayeeDetailsButton"} ]
	}
};

/**
 * @author rzhh8k
 * 
 */
judgmentPayee_subform.prePopupPrepare = function()
{
	// Copy the currently selected Judgment's Payee node to /ds/var/form so the subform can use it
	var currentPayeeNode = Services.getNode(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Payee");
	Services.replaceNode("/ds/var/form/Subforms/judgmentPayeeSubform/Payee", currentPayeeNode);
}

judgmentPayee_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: "/ds/var/page/Temp/JudmentPayeeSubform/Payee" } ];
/**
 * @author rzhh8k
 * 
 */
judgmentPayee_subform.processReturnedData = function() 
{
	// Copy the node sent back from the subform to the judgment node
	var payeeNode = Services.getNode("/ds/var/page/Temp/JudmentPayeeSubform/Payee");
	Services.replaceNode(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Payee", payeeNode);
	
	// Set the save flag so user knows 
	JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
	
	JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));	
}

/**
 * @author rzhh8k
 * @return "Master_AgainstGrid"  
 */
judgmentPayee_subform.nextFocusedAdaptorId = function() {
	return "Master_AgainstGrid";
}

/*****************************************************************************************************************/

function hearingDetails_subform() {}
hearingDetails_subform.subformName = "judgmentHearingDetailsSubform";
/**
 * @author rzhh8k
 * 
 */
hearingDetails_subform.prePopupPrepare = function()
{
	JudgmentFunctions.setUpDefaultOwningCourt("/ds/var/form/Subforms/HearingDetailsSubform/OwningCourt");
	Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.NO);
	Services.setValue(AppToVary_Hearing.dataBinding, JudgmentVariables.NO);
}

hearingDetails_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: JudgmentVariables.NEW_HEARING_TMP_PATH } ];
/**
 * @author rzhh8k
 * 
 */
hearingDetails_subform.processReturnedData = function() 
{
	Services.setValue(JudgmentVariables.HEARING_EVENT_REQUIRED_PATH, JudgmentVariables.YES);
	Services.setValue(AppToVary_Hearing.dataBinding, JudgmentVariables.YES);
	var hearingXPath = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/JudgmentHearing";
	var hearingNode = Services.getNode(JudgmentVariables.NEW_HEARING_TMP_PATH);
	Services.addNode(hearingNode, hearingXPath);	
}

/**
 * @author rzhh8k
 * @return "Status_Save"  
 */
hearingDetails_subform.nextFocusedAdaptorId = function() 
{
	return "Status_Save";
}

/*****************************************************************************************************************/
function addJudgment_subform() {};
addJudgment_subform.subformName = "AddJudgmentSubform";
addJudgment_subform.replaceTargetNode = [{sourceNodeIndex: "0", dataBinding: JudgmentVariables.NEW_JUDGMENT_TMP_PATH}];
/**
 * @author rzhh8k
 * 
 */
addJudgment_subform.processReturnedData = function() 
{
    Services.startTransaction();
    
    // Add the new Judgment to the DOM and display
	// Also set the required flags
	var surrId = getNextSurrogateKey();
	JudgmentFunctions.addNewJudgment(surrId);
	JudgmentFunctions.setJudgmentToSave(surrId);
	JudgmentFunctions.setAddJudgment(JudgmentVariables.YES);
	JudgmentFunctions.setSaveNewJudgment(JudgmentVariables.YES);
	JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
	JudgmentFunctions.copyEditFields();
	JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
    
	Services.endTransaction();
}
addJudgment_subform.destroyOnClose = true;

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/*****************************************************************************************************************
                                             popups
****************************************************************************************************************/

function AppToSetAside() {};
/**
 * @author rzhh8k
 * 
 */
AppToSetAside.prePopupPrepare = function()
{
	// Load refdata
	JudgmentFunctions.loadJudgmentReferenceData(JudgmentVariables.SETASIDE_JUDGMENT_POPUP); //pRefDataSetToAdd
}
/*****************************************************************************************************************/
function AppToVary() {};
/**
 * @author rzhh8k
 * 
 */
AppToVary.prePopupPrepare = function()
{
	// Load refdata
	JudgmentFunctions.loadJudgmentReferenceData(JudgmentVariables.VARY_JUDGMENT_POPUP); //pRefDataSetToAdd
}

/*****************************************************************************************************************
                                        GRID DEFINITIONS
*****************************************************************************************************************/

function Header_PartyListGrid() {};
// Configure grid 
Header_PartyListGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedListParty";
Header_PartyListGrid.srcDataOn = ["/ds/MaintainJudgment/Parties/Party/DisplayInHeader"];
Header_PartyListGrid.srcData = "/ds/MaintainJudgment/Parties";
Header_PartyListGrid.rowXPath = "Party[./DisplayInHeader = 'true']";
Header_PartyListGrid.keyXPath = "PartyKey";
Header_PartyListGrid.columns = [
	{xpath: "PartyRoleDescription"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];
Header_PartyListGrid.isReadOnly = function()
{
	return true;
}
Header_PartyListGrid.tabIndex = -1;
/*****************************************************************************************************************/
function Master_AgainstGrid() {};
// Configure grid 
Master_AgainstGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedPartyAgainst";
Master_AgainstGrid.srcData = "/ds/MaintainJudgment/Judgments";
Master_AgainstGrid.rowXPath = "Judgment";
Master_AgainstGrid.keyXPath = "SurrogateId";   
Master_AgainstGrid.columns = [
	{xpath: "Date", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "PartyRoleCode"},
	{xpath: "CasePartyNumber"},
	{xpath: "PartyAgainstName"}
];
Master_AgainstGrid.tabIndex = 1;
Master_AgainstGrid.retrieveOn = [Master_AgainstGrid.dataBinding];

//Need logic to only allow user to select another Judgment ONLY if they have saved the current one
Master_AgainstGrid.logicOn = [Master_AgainstGrid.dataBinding];
Master_AgainstGrid.logic = function()
{
	Services.startTransaction();
	var adding = JudgmentFunctions.getAddJudgment();
	if(adding == null || adding == JudgmentVariables.NO){		
		// have we displayed the msg?
		var msgShown = JudgmentFunctions.hasMsgBeenShown(JudgmentVariables.SAVE_MSG_PATH);
		//First check to see if current Judgment needs saving.
		if(JudgmentFunctions.isSaveRequired() && !msgShown){
			// yes - msg and set grid to the row that needs saving
			alert(Messages.SAVE_JUDGMENT_MESSAGE);
			JudgmentFunctions.setSaveMsgDisplayedPath(JudgmentVariables.YES);
			var judgmentToSave = JudgmentFunctions.getJudgmentToSave();
			Services.setValue(Master_AgainstGrid.dataBinding, judgmentToSave);
		}
		else{
			var flag = Services.getValue(JudgmentVariables.INITIALISE_SCREEN);
			if(flag == null || flag == "" || flag == JudgmentVariables.NO){
				// resfresh the grid - need to set up read only on load
				var judgment = Services.getValue(Master_AgainstGrid.dataBinding);
				Services.setValue(Master_AgainstGrid.dataBinding, "");
				Services.setValue(Master_AgainstGrid.dataBinding, judgment);
				Services.setValue(JudgmentVariables.INITIALISE_SCREEN, JudgmentVariables.YES);
			}
			// reset the flags
			JudgmentFunctions.setSaveMsgDisplayedPath(JudgmentVariables.NO);
			// RFC 1473 - don't want to be able to amend other Judgments without selecting button
			Services.setValue(JudgmentVariables.AMEND_JUDGMENT, JudgmentVariables.NO);
		}
	}
	else{
		//reset add flag now so save next time
		JudgmentFunctions.setAddJudgment(JudgmentVariables.NO);		
	}
	Services.endTransaction();
}
/*****************************************************************************************************************/
function Master_InFavourListGrid() {};
// Configure grid 
Master_InFavourListGrid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedInFavour";
Master_InFavourListGrid.srcData = "/ds/MaintainJudgment/Judgments/Judgment[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/InFavourParties";
Master_InFavourListGrid.rowXPath = "Party";
Master_InFavourListGrid.keyXPath = "PartyKey";   
Master_InFavourListGrid.columns = [
	{xpath: "PartyRoleCode"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];
Master_InFavourListGrid.tabIndex = 2;
Master_InFavourListGrid.retrieveOn = [Master_AgainstGrid.dataBinding];
Master_InFavourListGrid.srcDataOn = [Master_AgainstGrid.dataBinding];
/*****************************************************************************************************************/
function AppToSetAside_Grid(){};
// Configure grid 
AppToSetAside_Grid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedAppToSetAside";
AppToSetAside_Grid.srcData = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside";
AppToSetAside_Grid.rowXPath = "Application";
AppToSetAside_Grid.keyXPath = "AsideSurrogateId";
AppToSetAside_Grid.columns = [
	{xpath: "AppDate", sort: CaseManUtils.sortGridDatesDsc,  /*defaultSort:"true",*/ transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "Applicant"},
	{xpath: "Result"},
	{xpath: "DateResult", sort: CaseManUtils.sortGridDatesDsc, defaultSort:"true", transformToDisplay: CaseManUtils.formatGridDate}
];
AppToSetAside_Grid.tabIndex = 50;
AppToSetAside_Grid.retrieveOn = [Master_AgainstGrid.dataBinding];
AppToSetAside_Grid.srcDataOn = [Master_AgainstGrid.dataBinding];
/*****************************************************************************************************************/
function AppToVary_Grid() {};
/**
 * Configure grid
 * @param pValue
 * @author rzhh8k
 * @return Value = pValue , Value != ""){, Value = CaseManUtils.isBlank(pValue) ? "", fVal , Value, 
 */
AppToVary_Grid.transformCurrencyGrid = function(pValue)
{
	var returnValue = pValue;
	if(returnValue != null && returnValue != ""){
		var fVal = parseFloat(pValue).toFixed(2);
		if(!isNaN(fVal)){
			returnValue = CaseManUtils.isBlank(pValue) ? "" : fVal;
		}
		var errCode = JudgmentFunctions.validateAmount( returnValue, 
														JudgmentVariables.CURRENCY_MAX_11_PATTERN, // the largest pattern to cover all
														false);// pCheckAmount
		if(errCode != null){
			returnValue = pValue;
		}
	}
	return returnValue;
}
AppToVary_Grid.dataBinding = "/ds/var/page/SelectedGridRow/SelectedAppToVary";
AppToVary_Grid.srcData = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary";
AppToVary_Grid.rowXPath = "Variation";
AppToVary_Grid.keyXPath = "VarySurrogateId";   
AppToVary_Grid.columns = [
	{xpath: "AppDate", sort: CaseManUtils.sortGridDatesDsc,  defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "Applicant"},
	{xpath: "AmountOffered", transformToDisplay: AppToVary_Grid.transformCurrencyGrid, sort: "numerical"},
	{xpath: "AmountOfferedPer"},
	{xpath: "Hearing"},
	{xpath: "ClaimResp"},
	{xpath: "RespDate", transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "Result"},
	{xpath: "DateResult", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate}	
];
AppToVary_Grid.retrieveOn = [Master_AgainstGrid.dataBinding];
AppToVary_Grid.srcDataOn = [Master_AgainstGrid.dataBinding];
AppToVary_Grid.tabIndex = 80;

/*****************************************************************************************************************
                                            Function
*****************************************************************************************************************/
/**
 * Call this function to get the next generated surrogate key
 * @author rzhh8k
 * @return "S" + (++ nextSurrogateKey)  
 */
function getNextSurrogateKey()
{
	return "S" + (++ nextSurrogateKey);	
}
/*****************************************************************************************************************
                                            DATA BINDINGS
*****************************************************************************************************************/

/*********************  HEADER DETAILS  - MAIN SCREEN *******/
Header_CaseNumber.dataBinding = "/ds/MaintainJudgment/CaseNumber";
Header_OwningCourtCode.dataBinding = "/ds/MaintainJudgment/OwningCourtCode";
Header_OwningCourtName.dataBinding = "/ds/MaintainJudgment/OwningCourt";

/*********************  JUDGMENT DETAILS  - MAIN SCREEN *******/
JudgmentDetails_CourtCode.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/VenueCode";
JudgmentDetails_CourtName.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/VenueName";
JudgmentDetails_Type.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Type";
JudgmentDetails_Date.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Date";
JudgmentDetails_DateToRTL.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/DateRTL";
JudgmentDetails_JointJudgment.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/JointJudgment";
JudgmentDetails_JudgmentAmountCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/AmountCurrency";
JudgmentDetails_JudgmentAmount.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Amount";
JudgmentDetails_JudgmentCostsCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/TotalCostsCurrency";
JudgmentDetails_JudgmentCosts.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/TotalCosts";
JudgmentDetails_JudgmentSubTotalCurrency.dataBinding = JudgmentDetails_JudgmentAmountCurrency.dataBinding;
JudgmentDetails_JudgmentSubTotal.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/SubTotal";
JudgmentDetails_PaidBeforeCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PaidBeforeCurrency";
JudgmentDetails_PaidBefore.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PaidBefore";
JudgmentDetails_TotalCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/TotalCurrency";
JudgmentDetails_Total.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Total";
JudgmentDetails_InstalAmountCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/InstallAmountCurrency";
JudgmentDetails_InstalAmount.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/InstallAmount";
JudgmentDetails_PeriodDesc.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PeriodDesc";
JudgmentDetails_FirstPayDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/FirstPayDate";
JudgmentDetails_PaidInFullDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/PaidInFullDate";
JudgmentDetails_NotReceiptDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/NotificationDate";
JudgmentDetails_Status.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/Status";


/*********************  APPLICATION TO SET ASIDE DETAILS *******/
AppToSetAside_Date.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = " + AppToSetAside_Grid.dataBinding + "]/AppDate";
AppToSetAside_Applicant.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = " + AppToSetAside_Grid.dataBinding + "]/Applicant";
AppToSetAside_Result.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = " +  AppToSetAside_Grid.dataBinding + "]/Result";
AppToSetAside_ResultDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = " + AppToSetAside_Grid.dataBinding + "]/DateResult";

/*********************  ADD APPLICATION TO SET ASIDE DETAILS *******/
AddSetAside_Date.dataBinding = JudgmentVariables.ADD_APP_TO_SETASIDE_TMP_PATH + "/AppDate";
AddSetAside_Applicant.dataBinding = JudgmentVariables.ADD_APP_TO_SETASIDE_TMP_PATH + "/Applicant";

/*********************  APPLICATION TO VARY DETAILS *******/
AppToVary_Date.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/AppDate";
AppToVary_Applicant.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Applicant";
AppToVary_AmountOffered.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/AmountOffered";
AppToVary_AmountOfferedCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/AmountOfferedCurrency";
AppToVary_Hearing.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Hearing";
AppToVary_Per.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/AmountOfferedPer";
AppToVary_ClaimResp.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/ClaimResp";
AppToVary_RespDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/RespDate";
AppToVary_Result.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result";
AppToVary_ResultDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/DateResult";
AppToVary_PayDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/PayDate";
AppToVary_ResultAmountCurrency.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/ResultAmountCurrency";
AppToVary_ResultAmount.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/ResultAmount";
AppToVary_ResultPer.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/ResultPerId";
AppToVary_Objector.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Objector";
AppToVary_ObjDate.dataBinding = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToVary/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/ObjectionDate";


/*********************  ADD APPLICATION TO VARY DETAILS *******/
AddVary_Date.dataBinding = JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AppDate";
AddVary_Applicant.dataBinding = JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/Applicant";
AddVary_InstAmount.dataBinding = JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AmountOffered";
AddVary_InstAmountCurrency.dataBinding = JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AmountOfferedCurrency";
AddVary_Per.dataBinding = JudgmentVariables.ADD_APP_TO_VARY_TMP_PATH + "/AmountOfferedPer";
AddVary_PerID.dataBinding = JudgmentVariables.APP_TO_VARY_TMP_PATH + "/AmountOfferedPerId";

/*****************************************************************************************************************
                                        INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/*****************************************************************************************************************
                                           HEADER INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

/****************************************************************************************************************/
function Header_CaseNumber() {}
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isTemporary = function()
{
	return true;
}
Header_CaseNumber.isReadOnly = function()
{
	return true;
}
Header_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_CaseNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning Court Code";
Header_OwningCourtCode.isTemporary = function()
{
	return true;
}
Header_OwningCourtCode.isReadOnly = function()
{
	return true;
}
Header_OwningCourtCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_OwningCourtCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "Owning Court Name";
Header_OwningCourtName.isTemporary = function()
{
	return true;
}
Header_OwningCourtName.isReadOnly = function()
{
	return true;
}
Header_OwningCourtName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Header_OwningCourtName.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/****************************************************************************************************************/

/*****************************************************************************************************************
                                           MAINTAIN JUDGMENT INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

function JudgmentDetails_CourtCode() {}
JudgmentDetails_CourtCode.tabIndex = -1;
JudgmentDetails_CourtCode.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_CourtCode.maxLength = 3;
JudgmentDetails_CourtCode.helpText = "Court where Judgment was made.";
JudgmentDetails_CourtCode.isMandatory = function()
{
	return true;
}
JudgmentDetails_CourtCode.isTemporary = function()
{
	return true;
}
JudgmentDetails_CourtCode.isReadOnly = function()
{
	return true;
}
JudgmentDetails_CourtCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_CourtCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function JudgmentDetails_CourtName() {}
JudgmentDetails_CourtName.tabIndex = -1;
JudgmentDetails_CourtName.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_CourtName.maxLength = 70;
JudgmentDetails_CourtName.helpText = "Court where Judgment was made.";
JudgmentDetails_CourtName.isMandatory = function()
{
	return true;
}
JudgmentDetails_CourtName.isTemporary = function()
{
	return true;
}
JudgmentDetails_CourtName.isReadOnly = function()
{
	return true;
}
JudgmentDetails_CourtName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_CourtName.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function JudgmentDetails_Type() {}
JudgmentDetails_Type.tabIndex = -1;
JudgmentDetails_Type.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_Type.componentName = "Judgment Details Type";
JudgmentDetails_Type.maxLength = 30;
JudgmentDetails_Type.helpText = "Select type of Judgment";
JudgmentDetails_Type.isTemporary = function()
{
	return true;
}
JudgmentDetails_Type.isReadOnly = function()
{
	return true;
}
JudgmentDetails_Type.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_Type.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function JudgmentDetails_Date() {}
JudgmentDetails_Date.tabIndex = -1;
JudgmentDetails_Date.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_Date.weekends = true; 
JudgmentDetails_Date.maxLength = 11;
JudgmentDetails_Date.componentName = "Judgment Date";
JudgmentDetails_Date.helpText = "The date of the Judgment.";
JudgmentDetails_Date.isReadOnly = function()
{
	return true;
}
JudgmentDetails_Date.isTemporary = function()
{
	return true;
}
JudgmentDetails_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
JudgmentDetails_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function JudgmentDetails_DateToRTL() {}
JudgmentDetails_DateToRTL.tabIndex = 4;
JudgmentDetails_DateToRTL.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_DateToRTL.weekends = true; 
JudgmentDetails_DateToRTL.maxLength = 11;
JudgmentDetails_DateToRTL.componentName = "Registration Date";
JudgmentDetails_DateToRTL.helpText = "Date Judgment sent for registration to RTL.";
JudgmentDetails_DateToRTL.updateMode="clickCellMode";
JudgmentDetails_DateToRTL.enableOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_DateToRTL.isEnabled = function()
{
	var blnEnabled = JudgmentFunctions.judgmentsExist();
	var jurisdiction = Services.getValue("/ds/MaintainJudgment/Jurisdiction");
	if ( blnEnabled && jurisdiction == "F" )
	{
		blnEnabled = false;
	}
	return blnEnabled;
}
/**
 * Used to set the save required flag
 */
JudgmentDetails_DateToRTL.logicOn = [JudgmentDetails_DateToRTL.dataBinding];
JudgmentDetails_DateToRTL.logic = function(event)
{	
	if(event.getXPath() == JudgmentDetails_DateToRTL.dataBinding){	
		Services.startTransaction();
		var rtlDate = Services.getValue(JudgmentDetails_DateToRTL.dataBinding);
		if(rtlDate != null && rtlDate != ""){
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
			// need to fire event 375
			Services.setValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED, JudgmentVariables.YES);
		}
		else{
			// need to unset event 375 - in case entered a value and then changed mind
			Services.setValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED, JudgmentVariables.NO);
		}
		// now check if status needs to change
		var paidInFullDate = Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding);
		var errCode = JudgmentFunctions.validateDate(paidInFullDate);
		if(errCode == null){
			var status = JudgmentFunctions.calculateStatus(paidInFullDate);
			var originalStatus = Services.getValue(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/Status");
			if(originalStatus == status){
				JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.NO);
			}
			else{
				JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.YES);
			}
			JudgmentFunctions.setStatus(status);
		}

		Services.endTransaction();
	}
}
JudgmentDetails_DateToRTL.readOnlyOn = [Master_AgainstGrid.dataBinding,
										JudgmentDetails_DateToRTL.dataBinding,
										"/ds/var/page/Tmp/EditJudgment/Status",
										JudgmentDetails_Status.dataBinding];
JudgmentDetails_DateToRTL.isReadOnly = function(event)
{
	// only read only if previous value entered or for certain status.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	var update = true;
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM
	if(event.getXPath() == Master_AgainstGrid.dataBinding || event.getXPath() == "/"){
		if(JudgmentFunctions.isSaveRequired() == false){
			// copy the edit fields to tmp so know whether read only or not (i.e. is it saved previously)
			JudgmentFunctions.copyEditFields();
		}
	}
	
	// check what the status is
	update = JudgmentFunctions.isJudgmentInUpdateState();
	if(update == false){
		readOnly = true;
	}
	else{
		readOnly = JudgmentFunctions.isReadOnlyEditField("DateRTL");
	}
	
	Services.endTransaction();
	return readOnly;
}
JudgmentDetails_DateToRTL.validateOn = [JudgmentDetails_DateToRTL.dataBinding,										
										Master_AgainstGrid.dataBinding];
JudgmentDetails_DateToRTL.validate = function()
{
	var date = Services.getValue(JudgmentDetails_DateToRTL.dataBinding);
	var errCode = JudgmentFunctions.validateDateInFuture(date);
	if(errCode == null){
		// check not precedes JudgDate
		var errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
																	 false);//adding?
	}
	return errCode;
}
JudgmentDetails_DateToRTL.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
JudgmentDetails_DateToRTL.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JointJudgment() {}
JudgmentDetails_JointJudgment.tabIndex = -1;
JudgmentDetails_JointJudgment.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JointJudgment.componentName = "Joint Judgment";
JudgmentDetails_JointJudgment.maxLength = 1;
JudgmentDetails_JointJudgment.helpText = "Does this Judgment name all Defendants (Y/N)?";
JudgmentDetails_JointJudgment.isReadOnly = function()
{
	return true;
}
JudgmentDetails_JointJudgment.isTemporary = function()
{
	return true;
}
JudgmentDetails_JointJudgment.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_JointJudgment.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentAmountCurrency() {}
JudgmentDetails_JudgmentAmountCurrency.tabIndex = -1;
JudgmentDetails_JudgmentAmountCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentAmountCurrency.maxLength = 3;
JudgmentDetails_JudgmentAmountCurrency.helpText = "Indicates the amount adjudged, including interest.";
JudgmentDetails_JudgmentAmountCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_JudgmentAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentAmount() {}
JudgmentDetails_JudgmentAmount.tabIndex = 6;
JudgmentDetails_JudgmentAmount.maxLength = 11;
JudgmentDetails_JudgmentAmount.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentAmount.componentName = "Judgment Amount";
JudgmentDetails_JudgmentAmount.helpText = "Indicates the amount adjudged, including interest.";
JudgmentDetails_JudgmentAmount.isMandatory = function() { return true; }
JudgmentDetails_JudgmentAmount.validate = function()
{
	var amount = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);
	// defect 3990 ensure in correct format - i.e. 2 decimal places.
	amount = JudgmentFunctions.transformCurrency(amount);
	var errCode = JudgmentFunctions.validateAmount(	amount, 
													JudgmentVariables.CURRENCY_MAX_10_PATTERN, 
													true);// pCheckAmount
	return errCode;
}

JudgmentDetails_JudgmentAmount.readOnlyOn = [JudgmentVariables.AMEND_JUDGMENT];
JudgmentDetails_JudgmentAmount.isReadOnly = function()
{
	//RFC 1473 - not readonly when Amend Judgment Button has been selected
	var readOnly = true;
	var amendJudg = Services.getValue(JudgmentVariables.AMEND_JUDGMENT);
	if(null != amendJudg && amendJudg == JudgmentVariables.YES){
		readOnly = false;
	}
	return readOnly;
}
JudgmentDetails_JudgmentAmount.logicOn = [JudgmentDetails_JudgmentAmount.dataBinding];
JudgmentDetails_JudgmentAmount.logic = function(event)
{
	//RFC 1473 - 
	Services.startTransaction();
	if(event.getXPath() == JudgmentDetails_JudgmentAmount.dataBinding){
		// set flag for save and event 236 flag if value has changed
		if(JudgmentFunctions.amendJudgmentChangesMade() == false){
			// not changed so  reset the flag
			Services.setValue(JudgmentVariables.EVENT236_REQUIRED_PATH, JudgmentVariables.NO);		
		}
		else{
			// value changed so set the flag and save required flags
			Services.setValue(JudgmentVariables.EVENT236_REQUIRED_PATH, JudgmentVariables.YES);
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
		}
	}
	
	Services.endTransaction();
}
JudgmentDetails_JudgmentAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
JudgmentDetails_JudgmentAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentCostsCurrency() {}
JudgmentDetails_JudgmentCostsCurrency.tabIndex = -1;
JudgmentDetails_JudgmentCostsCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentCostsCurrency.maxLength = 3;
JudgmentDetails_JudgmentCostsCurrency.helpText = "The total amount of costs owed on the Judgment";
JudgmentDetails_JudgmentCostsCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_JudgmentCostsCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentCosts() {}
JudgmentDetails_JudgmentCosts.tabIndex = 7;
JudgmentDetails_JudgmentCosts.maxLength = 8;
JudgmentDetails_JudgmentCosts.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentCosts.componentName = "Total Costs";
JudgmentDetails_JudgmentCosts.helpText = "The total amount of costs owed on the Judgment";
JudgmentDetails_JudgmentCosts.isMandatory = function() { return true; }
JudgmentDetails_JudgmentCosts.validateOn = [JudgmentDetails_JudgmentCosts.dataBinding,
											JudgmentDetails_Date.dataBinding,
											JudgmentDetails_JudgmentAmount.dataBinding];
JudgmentDetails_JudgmentCosts.validate = function()
{
	var amount = Services.getValue(JudgmentDetails_JudgmentCosts.dataBinding);
	// defect 3990 ensure in correct format - i.e. 2 decimal places.
	amount = JudgmentFunctions.transformCurrency(amount); 
	var errCode = JudgmentFunctions.validateAmount(	amount, 
													JudgmentVariables.CURRENCY_MAX_7_PATTERN, 
													false);// pCheckAmount
	// GROUP2 1337 - -  add validation re whether costs amount correct for CCBC
	if(errCode == null && JudgmentFunctions.isCCBCCourt() == true){
		var judgDate = Services.getValue(JudgmentDetails_Date.dataBinding);
		var judgAmt = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);
		var judgType = Services.getValue(JudgmentDetails_Type.dataBinding);
		if(amount != null && amount != "" && parseFloat(amount) > 0 && judgDate != null && judgDate != "" && 
					judgAmt != null && judgAmt != "" && parseFloat(judgAmt) > 0 && judgType != null && judgType != ""){
		
			var valid = JudgmentFunctions.isJudgmentCostValid(	amount, //pJudgmentCosts
																judgDate,//pJudgmentDate
																judgAmt, //pJudgmentAmount
																judgType, //pJudgmentType
																false); // pAdding
			if(valid == false){
				errCode = ErrorCode.getErrorCode('Caseman_invalidJudgmentCosts_Msg'); 
			}		
		}// if(amount != null && amount !=  ... 
	}//if(errCode == null && JudgmentFunctions.isCCBCCourt() == true){
	
	return errCode;
}

JudgmentDetails_JudgmentCosts.readOnlyOn = [JudgmentVariables.AMEND_JUDGMENT];
JudgmentDetails_JudgmentCosts.isReadOnly = function()
{
	//RFC 1473 - not readonly when Amend Judgment Button has been selected
	var readOnly = true;
	var amendJudg = Services.getValue(JudgmentVariables.AMEND_JUDGMENT);
	if(null != amendJudg && amendJudg == JudgmentVariables.YES){
		readOnly = false;
	}
	return readOnly;
}
JudgmentDetails_JudgmentCosts.logicOn = [JudgmentDetails_JudgmentCosts.dataBinding];
JudgmentDetails_JudgmentCosts.logic = function(event)
{
	//RFC 1473 - 
	Services.startTransaction();
	
	if(event.getXPath() == JudgmentDetails_JudgmentCosts.dataBinding){
		// set flag for save and event 236 flag if value has changed
		if(JudgmentFunctions.amendJudgmentChangesMade() == false){
			// not changed so  reset the flag
			Services.setValue(JudgmentVariables.EVENT236_REQUIRED_PATH, JudgmentVariables.NO);		
		}
		else{
			// value changed so set the flag and save required flags
			Services.setValue(JudgmentVariables.EVENT236_REQUIRED_PATH, JudgmentVariables.YES);
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
		}
	}
	Services.endTransaction();
}
JudgmentDetails_JudgmentCosts.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
JudgmentDetails_JudgmentCosts.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentSubTotalCurrency() {}
JudgmentDetails_JudgmentSubTotalCurrency.tabIndex = -1;
JudgmentDetails_JudgmentSubTotalCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentSubTotalCurrency.maxLength = 3;
JudgmentDetails_JudgmentSubTotalCurrency.helpText = "Total Costs plus Judgment amount";
JudgmentDetails_JudgmentSubTotalCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_JudgmentSubTotalCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_JudgmentSubTotal() {}
JudgmentDetails_JudgmentSubTotal.tabIndex = -1;
JudgmentDetails_JudgmentSubTotal.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_JudgmentSubTotal.componentName = "Sub Total";
JudgmentDetails_JudgmentSubTotal.helpText = "Total Costs plus Judgment amount";

JudgmentDetails_JudgmentSubTotal.isReadOnly = function(event)
{	
	return true;
}
JudgmentDetails_JudgmentSubTotal.logicOn = [JudgmentDetails_JudgmentSubTotal.dataBinding, 
											Master_AgainstGrid.dataBinding,
											JudgmentDetails_JudgmentCosts.dataBinding,
											JudgmentDetails_JudgmentAmount.dataBinding];
JudgmentDetails_JudgmentSubTotal.logic = function(event)
{
	Services.startTransaction;
	var amount = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);
	var costs = Services.getValue(JudgmentDetails_JudgmentCosts.dataBinding);
	var transformCosts = JudgmentFunctions.transformCurrency(costs);
	if(amount != null && amount != ""){		
		var subTotal = JudgmentFunctions.getSubTotal(amount, transformCosts);
		Services.setValue(JudgmentDetails_JudgmentSubTotal.dataBinding, subTotal);
	}
	Services.endTransaction;
}
/****************************************************************************************************************/
function JudgmentDetails_PaidBeforeCurrency() {}
JudgmentDetails_PaidBeforeCurrency.tabIndex = -1;
JudgmentDetails_PaidBeforeCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_PaidBeforeCurrency.maxLength = 3;
JudgmentDetails_PaidBeforeCurrency.helpText = "Amount paid between Claim and Judgment";
JudgmentDetails_PaidBeforeCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_PaidBeforeCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_PaidBefore() {}
JudgmentDetails_PaidBefore.tabIndex = -1;
JudgmentDetails_PaidBefore.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_PaidBefore.componentName = "Paid Before";
JudgmentDetails_PaidBefore.helpText = "Amount paid between Claim and Judgment";
JudgmentDetails_PaidBefore.isReadOnly = function()
{
	return true;
}
JudgmentDetails_PaidBefore.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
JudgmentDetails_PaidBefore.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_TotalCurrency() {}
JudgmentDetails_TotalCurrency.tabIndex = -1;
JudgmentDetails_TotalCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_TotalCurrency.maxLength = 3;
JudgmentDetails_TotalCurrency.helpText = "The total amount due to the Parties defined as 'In Favour Of' the Judgment";
JudgmentDetails_TotalCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_TotalCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_Total() {}
JudgmentDetails_Total.tabIndex = -1;
JudgmentDetails_Total.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_Total.componentName = "Total";
JudgmentDetails_Total.helpText = "The total amount due to the Parties defined as 'In Favour Of' the Judgment";
JudgmentDetails_Total.isReadOnly = function()
{
	return true;
}
JudgmentDetails_Total.logicOn = [JudgmentDetails_JudgmentSubTotal.dataBinding];
JudgmentDetails_Total.logic = function(event)
{
	Services.startTransaction;
	var amount = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);
	var costs = Services.getValue(JudgmentDetails_JudgmentCosts.dataBinding);
	var transformCosts = JudgmentFunctions.transformCurrency(costs);
	var paidBefore = Services.getValue(JudgmentDetails_PaidBefore.dataBinding);
	var transformPaidBefore = JudgmentFunctions.transformCurrency(paidBefore);
	if(amount != null && amount != ""){		
		var total = JudgmentFunctions.getTotal(amount, costs, transformPaidBefore); // pAmount, pCosts, pPaidBefore
		Services.setValue(JudgmentDetails_Total.dataBinding, total);
	}
	Services.endTransaction;
}
JudgmentDetails_Total.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
JudgmentDetails_Total.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_InstalAmountCurrency() {}
JudgmentDetails_InstalAmountCurrency.tabIndex = -1;
JudgmentDetails_InstalAmountCurrency.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_InstalAmountCurrency.maxLength = 3;
JudgmentDetails_InstalAmountCurrency.helpText = "Amount of the instalment to be paid by the Party, against the Judgment";
JudgmentDetails_InstalAmountCurrency.isReadOnly = function()
{
	return true;
}
JudgmentDetails_InstalAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_InstalAmount() {}
JudgmentDetails_InstalAmount.tabIndex = -1;
JudgmentDetails_InstalAmount.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_InstalAmount.componentName = "Instalment Amount";
JudgmentDetails_InstalAmount.helpText = "Amount of the instalment to be paid by the Party, against the Judgment";
JudgmentDetails_InstalAmount.isReadOnly = function()
{
	return true;
}
JudgmentDetails_InstalAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
JudgmentDetails_InstalAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function JudgmentDetails_PeriodDesc() {}
JudgmentDetails_PeriodDesc.tabIndex = -1;
JudgmentDetails_PeriodDesc.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_PeriodDesc.componentName = "Instalment Period";
JudgmentDetails_PeriodDesc.helpText = "Period";
JudgmentDetails_PeriodDesc.isReadOnly = function()
{
	return true;
}
JudgmentDetails_PeriodDesc.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_PeriodDesc.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function JudgmentDetails_FirstPayDate() {}
JudgmentDetails_FirstPayDate.tabIndex = -1;
JudgmentDetails_FirstPayDate.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_FirstPayDate.maxLength = 11;
JudgmentDetails_FirstPayDate.componentName = "First Payment";
JudgmentDetails_FirstPayDate.helpText = "The date of the first instalment, or in full if no instalment.";
JudgmentDetails_FirstPayDate.isReadOnly = function()
{
	return true;
}
JudgmentDetails_FirstPayDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
JudgmentDetails_FirstPayDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function JudgmentDetails_PaidInFullDate() {}
JudgmentDetails_PaidInFullDate.tabIndex = 8;
JudgmentDetails_PaidInFullDate.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_PaidInFullDate.weekends = true; 
JudgmentDetails_PaidInFullDate.maxLength = 11;
JudgmentDetails_PaidInFullDate.componentName = "Paid in full date";
JudgmentDetails_PaidInFullDate.helpText = "Date of the final payment(fully satisfying the Judgment).";
JudgmentDetails_PaidInFullDate.updateMode="clickCellMode";
JudgmentDetails_PaidInFullDate.enableOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_PaidInFullDate.isEnabled = function()
{
	return JudgmentFunctions.judgmentsExist();
}

JudgmentDetails_PaidInFullDate.readOnlyOn = [Master_AgainstGrid.dataBinding,
											"/ds/var/page/Tmp/EditJudgment/Status",
											 JudgmentDetails_Status.dataBinding];

JudgmentDetails_PaidInFullDate.isReadOnly = function()
{
	// defect uct group 2 1533
	var readOnly = false;
	var judStatus = Services.getValue(JudgmentDetails_Status.dataBinding);
	if(judStatus != null && judStatus == JudgmentVariables.STATUS_SET_ASIDE){
		readOnly = true;	
	}
	return readOnly;
}
JudgmentDetails_PaidInFullDate.mandatoryOn = [JudgmentDetails_NotReceiptDate.dataBinding,
											  JudgmentDetails_PaidInFullDate.dataBinding];
JudgmentDetails_PaidInFullDate.isMandatory = function()
{
	var isRequired = false;
	var  notificationDate = Services.getValue(JudgmentDetails_NotReceiptDate.dataBinding);
	if(notificationDate != null && notificationDate != ""){
		isRequired = true;
	}
	return isRequired;
}
/**
 * Used to set the save required flag and judgment status
 */
JudgmentDetails_PaidInFullDate.logicOn = [JudgmentDetails_PaidInFullDate.dataBinding];
JudgmentDetails_PaidInFullDate.logic = function(event)
{
	if(event.getXPath() == JudgmentDetails_PaidInFullDate.dataBinding){
		Services.startTransaction();

		var errCode = null;
		var paidDate = Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding);
		var notificationDate = Services.getValue(JudgmentDetails_NotReceiptDate.dataBinding);
		if(paidDate != null && paidDate != ""){
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
			
			if ( JudgmentFunctions.allJudgmentsPaidInFull() )
			{
				// need to fire event 79
				Services.setValue(JudgmentVariables.FINAL_PAYMENT_MADE, JudgmentVariables.YES);
			}
			else if (JudgmentFunctions.isCCBCCourt() == true){
				// need to fire event 79 - defect group 2 1488
				// Always fire an event 79 for ccbc
				Services.setValue(JudgmentVariables.PAYMENT_MADE_CCBC, JudgmentVariables.YES);
			}
			
			errCode = JudgmentFunctions.validateDate(paidDate);	
		}//if(paidDate != null && paidDate != ""){
		else if((paidDate == null || paidDate == "") && (notificationDate != null && notificationDate != "") ){
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
		}
		else{
			// need to reset the status changed flag if it has been set and status is Paid, i.e. it date paid has been reset
			var status =  Services.getValue(JudgmentDetails_Status.dataBinding);
			// need to unset event 79 - in case entered a value and then changed mind
			Services.setValue(JudgmentVariables.FINAL_PAYMENT_MADE, JudgmentVariables.NO);
			Services.setValue(JudgmentVariables.PAYMENT_MADE_CCBC, JudgmentVariables.NO);
		}// else{
		
		// now check if status needs to change		
		if(errCode == null){
			// still valid as null
			var status = JudgmentFunctions.calculateStatus(paidDate);
			var originalStatus = Services.getValue(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/Status");
			if(originalStatus == status){
				JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.NO);
			}
			else{
				JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.YES);
			}
			JudgmentFunctions.setStatus(status);
		}//if(errCode == null){
		
		Services.endTransaction();
	}	
}
JudgmentDetails_PaidInFullDate.validateOn = [JudgmentDetails_PaidInFullDate.dataBinding,
											 Master_AgainstGrid.dataBinding];
JudgmentDetails_PaidInFullDate.validate = function()
{
	var date = Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding);
	var errCode = JudgmentFunctions.validateDateInFuture(date);
	if(errCode == null){
		// check not precedes JudgDate
		var errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
																	 false);//adding?
	}
	return errCode;
}
JudgmentDetails_PaidInFullDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
JudgmentDetails_PaidInFullDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function JudgmentDetails_NotReceiptDate() {}
JudgmentDetails_NotReceiptDate.tabIndex = 9;
JudgmentDetails_NotReceiptDate.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_NotReceiptDate.weekends = true; 
JudgmentDetails_NotReceiptDate.maxLength = 11;
JudgmentDetails_NotReceiptDate.componentName = "Receipt Date";
JudgmentDetails_NotReceiptDate.helpText = "Date when notification of full payment received by the Court.";
JudgmentDetails_NotReceiptDate.updateMode="clickCellMode";
JudgmentDetails_NotReceiptDate.mandatoryOn = [JudgmentDetails_NotReceiptDate.dataBinding,
											  JudgmentDetails_PaidInFullDate.dataBinding];
JudgmentDetails_NotReceiptDate.isMandatory = function()
{
	var isRequired = false;
	var  fullDate = Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding);
	if(fullDate != null && fullDate != ""){
		isRequired = true;
	}
	return isRequired;
}
JudgmentDetails_NotReceiptDate.enableOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_NotReceiptDate.isEnabled = function()
{
	return JudgmentFunctions.judgmentsExist();
}
JudgmentDetails_NotReceiptDate.readOnlyOn = [Master_AgainstGrid.dataBinding,
											 "/ds/var/page/Tmp/EditJudgment/Status",
											 JudgmentDetails_Status.dataBinding];
JudgmentDetails_NotReceiptDate.isReadOnly = function(event)
{
	var readOnly = false;
	var update = true;
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM
	// I.e look at temp value if there Read Only
	
	// check what the status is first
	update = JudgmentFunctions.isJudgmentInUpdateState();
	if(update == false){
		readOnly = true;	
	}
	else{
		readOnly = JudgmentFunctions.isReadOnlyEditField("NotReceiptDate");
	}
	return readOnly;
}
/**
 * Used to set the save required flag
 */
JudgmentDetails_NotReceiptDate.logicOn = [JudgmentDetails_NotReceiptDate.dataBinding];
JudgmentDetails_NotReceiptDate.logic = function(event)
{	
	if (event.getXPath() == JudgmentDetails_NotReceiptDate.dataBinding){	
		Services.startTransaction();
		var notDate = Services.getValue(JudgmentDetails_NotReceiptDate.dataBinding);
		if(notDate != null && notDate != ""){
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.EDIT_JUDGMENT, false);
			var judgmentToSave =  Services.getValue(Master_AgainstGrid.dataBinding);
			JudgmentFunctions.setJudgmentToSave(judgmentToSave);
		}
		Services.endTransaction();
	}	
}
JudgmentDetails_NotReceiptDate.validateOn = [JudgmentDetails_NotReceiptDate.dataBinding, 
											 Master_AgainstGrid.dataBinding];
JudgmentDetails_NotReceiptDate.validate = function()
{
	var date = Services.getValue(JudgmentDetails_NotReceiptDate.dataBinding);
	var errCode = JudgmentFunctions.validateDateInFuture(date);
	return errCode;
}
JudgmentDetails_NotReceiptDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
JudgmentDetails_NotReceiptDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function JudgmentDetails_Status() {}
JudgmentDetails_Status.tabIndex = -1;
JudgmentDetails_Status.retrieveOn = [Master_AgainstGrid.dataBinding];
JudgmentDetails_Status.componentName = "Status";
JudgmentDetails_Status.helpText = "The current Status of the Judgment";
JudgmentDetails_Status.isReadOnly = function()
{
	return true;
}

JudgmentDetails_Status.logicOn = [JudgmentDetails_Status.dataBinding];
JudgmentDetails_Status.logic = function(event)
{
	if(event.getXPath() == Master_AgainstGrid.dataBinding || event.getXPath() == "/"){
		if(JudgmentFunctions.isSaveRequired() == false){
			// copy the edit fields to tmp so know whether read only or not (i.e. is it saved previously)
			JudgmentFunctions.copyEditFields();
		}
	}
}
JudgmentDetails_Status.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
JudgmentDetails_Status.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*****************************************************************************************************************
                        APPLICATIOM TO SET ASIDE POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

function AppToSetAside_Date() {}
AppToSetAside_Date.weekends = true; 
AppToSetAside_Date.retrieveOn = [AppToSetAside_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToSetAside_Date.tabIndex = -1;
AppToSetAside_Date.maxLength = 11;
AppToSetAside_Date.helpText = "The application date for making the 'Application to Set aside'.";
AppToSetAside_Date.isReadOnly = function()
{
	return true; 
}
AppToSetAside_Date.isTemporary = function()
{
	return false;
}
AppToSetAside_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToSetAside_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AppToSetAside_Applicant() {}
AppToSetAside_Applicant.retrieveOn = [AppToSetAside_Grid.dataBinding,
								      Master_AgainstGrid.dataBinding];
AppToSetAside_Applicant.tabIndex = -1;
AppToSetAside_Applicant.maxLength = 20;
AppToSetAside_Applicant.helpText = "The Party making the 'Application to Set Aside'";
AppToSetAside_Applicant.isReadOnly = function()
{
	return true;
}
AppToSetAside_Applicant.isTemporary = function()
{
	return false;
}
AppToSetAside_Applicant.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AppToSetAside_Applicant.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/*********************************************************************************/
function AppToSetAside_Result() {}
AppToSetAside_Result.tabIndex = 52;
AppToSetAside_Result.retrieveOn = [AppToSetAside_Grid.dataBinding,
								   Master_AgainstGrid.dataBinding];
// JavaScript: extra configurations for select list
AppToSetAside_Result.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsAside";
AppToSetAside_Result.rowXPath = "Result";
AppToSetAside_Result.keyXPath = "Value";
AppToSetAside_Result.displayXPath = "Value";
AppToSetAside_Result.enableOn = [AppToSetAside_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToSetAside_Result.isEnabled = function()
{
	return JudgmentFunctions.AppSetAsideExist();
}
AppToSetAside_Result.isTemporary = function()
{
	return false;
}
AppToSetAside_Result.logicOn = [AppToSetAside_Result.dataBinding];
AppToSetAside_Result.logic = function(event)
{
	if(event.getXPath() == AppToSetAside_Result.dataBinding){
		Services.startTransaction();
		// test the value and display a message appropriately if required
		var msg = null;
		var result = Services.getValue(AppToSetAside_Result.dataBinding);
		// Need to ensure date is not over one month in past
		msg = JudgmentFunctions.validateAppToSetAsideResult(result);
		if(msg != null){
			alert(msg);
		}
		// Set the save required flag.
		if(result != null && result != ""){
			JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_SET_ASIDE, false);
			// now set the status changed flag and status
			JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.YES);
		}
		else{
			// now set the status changed flag and status
			JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.NO);
		}
		
		if(result != null)
		{
			Services.setValue(JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/ApplicationsToSetAside/Application[./AsideSurrogateId = " +  AppToSetAside_Grid.dataBinding + "]/ASAUpdated", JudgmentVariables.YES);
			
			// set application set aside result = refused flag
			if ( result == JudgmentVariables.RESULT_REFUSED ) {
				Services.setValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED, JudgmentVariables.YES);
			}
			else {
				Services.setValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED, JudgmentVariables.NO);
			}
			
			// defect caseman 6004 - added if/else for IN ERROR value
			if(result == JudgmentVariables.RESULT_GRANTED || result == JudgmentVariables.RESULT_IN_ERROR){
				Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.YES);
				// defect ccbc UCT Grp2 1550
				// only produce output if ccbc and applicant is a proper_officer - tested later
				var app = Services.getValue(AppToSetAside_Applicant.dataBinding);
				if(app != null && app == JudgmentVariables.PROPER_OFFICER){
					Services.setValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER, JudgmentVariables.YES);
				}
				else{
					Services.setValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER, JudgmentVariables.NO);
				}
			}
			else
			{
				Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.NO);
				Services.setValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER, JudgmentVariables.NO);
			}			
		}
		else{
			Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.NO);
			Services.setValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER, JudgmentVariables.NO);
			Services.setValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED, JudgmentVariables.NO);
		}

		Services.endTransaction();
	}
}
AppToSetAside_Result.maxLength = 12;
AppToSetAside_Result.helpText = "Indicates the result of the event, if any.";
AppToSetAside_Result.mandatoryOn = [AppToSetAside_Result.dataBinding,
									AppToSetAside_ResultDate.dataBinding];
AppToSetAside_Result.isMandatory = function()
{
	var isRequired = false;
	var resDate = Services.getValue(AppToSetAside_ResultDate.dataBinding);
	if(resDate != null && resDate != ""){
		isRequired = true;
	}
	return isRequired;
}
AppToSetAside_Result.readOnlyOn = [AppToSetAside_Grid.dataBinding, 
								 JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH + "/Application[./AsideSurrogateId = " + 
																	AppToSetAside_Grid.dataBinding + "]/AsideSurrogateId"];
AppToSetAside_Result.isReadOnly = function(event)
{
	// only read only if previous value entered
	// these values are stored in the tmp part of the DOM
	var readOnly = false;
	if (event.getXPath() != "/"){		
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		// defect group 2 ccbc 1549 - logic changed
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& status != JudgmentVariables.STATUS_CANCELLED && status != JudgmentVariables.STATUS_SATISFIED
				&& JudgmentFunctions.isCCBCCourt() == true){
			readOnly = true;
		}
		else if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& JudgmentFunctions.isCCBCCourt() == false){
			readOnly = true;
		}
		else{
			readOnly = JudgmentFunctions.isReadOnlyAppToSetAsideField("Result", // pField
															      AppToSetAside_Grid.dataBinding); //pGridDataBinding 
		}
	}
	return readOnly;
}
/*********************************************************************************/
function AppToSetAside_ResultDate() {}
AppToSetAside_ResultDate.tabIndex = 53;
AppToSetAside_ResultDate.retrieveOn = [AppToSetAside_Grid.dataBinding,
								       Master_AgainstGrid.dataBinding];
AppToSetAside_ResultDate.maxLength = 11;
AppToSetAside_ResultDate.helpText = "Date result was given";
AppToSetAside_ResultDate.updateMode="clickCellMode";
AppToSetAside_ResultDate.isTemporary = function()
{
	return false;
}
AppToSetAside_ResultDate.enableOn = [AppToSetAside_Grid.dataBinding,
								     Master_AgainstGrid.dataBinding];
AppToSetAside_ResultDate.isEnabled = function()
{
	Services.startTransaction();
	var enableMe = JudgmentFunctions.AppSetAsideExist();
	Services.endTransaction();
	return enableMe;
}
AppToSetAside_ResultDate.mandatoryOn = [AppToSetAside_ResultDate.dataBinding,
								        AppToSetAside_Result.dataBinding];
AppToSetAside_ResultDate.isMandatory = function()
{
	var isRequired = false;
	var res = Services.getValue(AppToSetAside_Result.dataBinding);
	if(res != null && res != ""){
		isRequired = true;
	}
	return isRequired;
}
AppToSetAside_ResultDate.readOnlyOn = [AppToSetAside_Grid.dataBinding, 
								      JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH + "/Application[./AsideSurrogateId = " + 
																	AppToSetAside_Grid.dataBinding + "]/AsideSurrogateId"];
AppToSetAside_ResultDate.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	
	if(event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		// defect group 2 ccbc 1549 - logic changed
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& status != JudgmentVariables.STATUS_CANCELLED && status != JudgmentVariables.STATUS_SATISFIED
				&& JudgmentFunctions.isCCBCCourt() == true){
			readOnly = true;
		}
		else if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED 
			&& JudgmentFunctions.isCCBCCourt() == false){
			readOnly = true;
		}
		else{
			readOnly = JudgmentFunctions.isReadOnlyAppToSetAsideField("DateResult", // pField
															      AppToSetAside_Grid.dataBinding); //pGridDataBinding 
		}// end if/else
	}//end if(event.getXPath() != "/"){
	
	return readOnly;
}
AppToSetAside_ResultDate.logicOn = [AppToSetAside_ResultDate.dataBinding];
AppToSetAside_ResultDate.logic = function(event)
{
	if(event.getXPath() == AppToSetAside_ResultDate.dataBinding){
		// Need to ensure date is not over one month in past
		var date = Services.getValue(AppToSetAside_ResultDate.dataBinding);
		errCode = JudgmentFunctions.validateDateLessThanOneMonthInPast(date);	
		if(errCode != null){
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}
		// Set the save required flag. 
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_SET_ASIDE, false);
		// Only need to set for this field as it's mandatory to set both
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
	}
}
AppToSetAside_ResultDate.validateOn = [AppToSetAside_ResultDate.dataBinding,
									   AppToSetAside_Grid.dataBinding];
AppToSetAside_ResultDate.validate = function(event)
{	
	var errCode = null;
	if(event.getXPath() == AppToSetAside_ResultDate.dataBinding ||
			event.getXPath() == AppToSetAside_Grid.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AppToSetAside_ResultDate.dataBinding);
		if(date != null && date != ""){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// check date is not before the Application date if no error found yet
				errCode = JudgmentFunctions.validateDatePreceedsApplicationDate(date,
																		        JudgmentVariables.APP_TO_SET_ASIDE);
			}
		}
		Services.endTransaction();
	}
	return errCode;
}
AppToSetAside_ResultDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToSetAside_ResultDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/

/*****************************************************************************************************************
                          ADD SET ASIDE POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

function AddSetAside_Date() {}
AddSetAside_Date.tabIndex = 56;
AddSetAside_Date.maxLength = 11;
AddSetAside_Date.helpText = "The application date for making the 'Application to Set Aside'.";
AddSetAside_Date.updateMode="clickCellMode";
AddSetAside_Date.isMandatory = function()
{
	return true;
}
AddSetAside_Date.isTemporary = function()
{
	return true;
}
AddSetAside_Date.validateOn = [AddSetAside_Date.dataBinding];
AddSetAside_Date.validate = function()
{	
	var errCode = null;
	Services.startTransaction();
	
	var date = Services.getValue(AddSetAside_Date.dataBinding);
	if(date != null && date != ""){
		// check not precedes JudgDate
		var errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
																	 false);//adding?
		if(errCode == null){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// Need to ensure date is not over one month in past	
				errCode = JudgmentFunctions.validateDateLessThanOneMonthInPast(date);	
				if(errCode != null){
					alert(Messages.DATEOVER1MONTH_MESSAGE);
					errCode = null; // as only warning, allow the user to carry on
				}
			}// end if(errCode == null){
		}// end if(errCode == null){
	}//end  if(date != null && da...
	
	Services.endTransaction();
	return errCode;
}
AddSetAside_Date.logicOn = [AddSetAside_Date.dataBinding];
AddSetAside_Date.logic = function(event)
{	
	if (event.getXPath() == AddSetAside_Date.dataBinding){
		var today = JudgmentFunctions.getTodaysDate();
		var sideDate = Services.getValue(AddSetAside_Date.dataBinding);
		if(today != sideDate){
			// set flag to indict changes made and if cancel button select will need to display the message
			JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		}
	}
}
AddSetAside_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AddSetAside_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AddSetAside_Applicant() {}
AddSetAside_Applicant.tabIndex = 57;
// JavaScript: extra configurations for select list
AddSetAside_Applicant.srcData = JudgmentVariables.REF_DATA_XPATH + "/Applicants";
AddSetAside_Applicant.rowXPath = "Applicant";
AddSetAside_Applicant.keyXPath = "Value";
AddSetAside_Applicant.displayXPath = "Value";
AddSetAside_Applicant.maxLength = 20;
AddSetAside_Applicant.helpText = "The Party making the 'Application to Set Aside'";
AddSetAside_Applicant.isMandatory = function()
{
	return true; 
}
AddSetAside_Applicant.isTemporary = function()
{
	return true;
}
AddSetAside_Applicant.logicOn = [AddSetAside_Applicant.dataBinding];
AddSetAside_Applicant.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddSetAside_Applicant.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddSetAside_Applicant.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*****************************************************************************/

/*****************************************************************************************************************
                            APPLICATION TO VARY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

function AppToVary_Date() {}
AppToVary_Date.tabIndex = -1;
AppToVary_Date.retrieveOn = [AppToVary_Grid.dataBinding,
							 Master_AgainstGrid.dataBinding];
AppToVary_Date.weekends = true; 
AppToVary_Date.maxLength = 11;
AppToVary_Date.componentName = "Application to Vary date";
AppToVary_Date.helpText = "Date the Application to Vary was made.";
AppToVary_Date.isTemporary = function()
{
	return true;
}
AppToVary_Date.isReadOnly = function()
{
	return true;
}
AppToVary_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToVary_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*****************************************************************************/
function AppToVary_Applicant() {}
AppToVary_Applicant.retrieveOn = [AppToVary_Grid.dataBinding,
								  Master_AgainstGrid.dataBinding];
AppToVary_Applicant.tabIndex = -1;
AppToVary_Applicant.maxLength = 20;
AppToVary_Applicant.helpText = "Party submitting the reapplication to Vary the instalment order.";
AppToVary_Applicant.isReadOnly = function()
{
	return true;
}
AppToVary_Applicant.isTemporary = function()
{
	return true;
}
AppToVary_Applicant.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AppToVary_Applicant.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/*****************************************************************************/
function AppToVary_AmountOffered() {}
AppToVary_AmountOffered.retrieveOn = [AppToVary_Grid.dataBinding,
								      Master_AgainstGrid.dataBinding];
AppToVary_AmountOffered.tabIndex = -1;
AppToVary_AmountOffered.maxLength = 20;
AppToVary_AmountOffered.helpText = "New instalment amount requested";
AppToVary_AmountOffered.isReadOnly = function()
{
	return true;
}
AppToVary_AmountOffered.isTemporary = function()
{
	return true;
}
AppToVary_AmountOffered.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AppToVary_AmountOffered.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/******************************************************************************/
function AppToVary_AmountOfferedCurrency() {}
AppToVary_AmountOfferedCurrency.retrieveOn = [AppToVary_Grid.dataBinding];
AppToVary_AmountOfferedCurrency.tabIndex = -1;
AppToVary_AmountOfferedCurrency.maxLength = 3;
AppToVary_AmountOfferedCurrency.isReadOnly = function()
{
	return true;
}
AppToVary_AmountOfferedCurrency.isTemporary = function()
{
	return true;
}
AppToVary_AmountOfferedCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/*********************************************************************************/
function AppToVary_Hearing() {}
AppToVary_Hearing.retrieveOn = [AppToVary_Grid.dataBinding,
								Master_AgainstGrid.dataBinding];
AppToVary_Hearing.modelValue = {checked: 'Y', unchecked: 'N'};
AppToVary_Hearing.tabIndex = 82;
AppToVary_Hearing.helpText = "Is a Hearing required for this Application?";
AppToVary_Hearing.isTemporary = function()
{
	return true;
}
AppToVary_Hearing.readOnlyOn = [AppToVary_Grid.dataBinding, 
								JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/VarySurrogateId"];

AppToVary_Hearing.isReadOnly = function(event)
{	
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	
	if(event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else{	
			var tmpHearing = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
												"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Hearing");
			// defect 796 var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
												//"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
		  	if(tmpHearing != null && tmpHearing == "Y" ){ /* defect 796 || (tmpResult != null && tmpResult != "")){*/
				readOnly = true;
			}
		}
	}

	Services.endTransaction();	
	return readOnly;
}
AppToVary_Hearing.logicOn = [AppToVary_Hearing.dataBinding];
AppToVary_Hearing.logic = function(event)
{	
	if(event.getXPath() == AppToVary_Hearing.dataBinding){
		// If set the Hearing check box to Y - need to set flag 
		// so we ensure we create a hearing when the ok button is selected
		Services.startTransaction();
	
		var hearing = Services.getValue(AppToVary_Hearing.dataBinding);
		if(hearing != null){
			if(hearing == JudgmentVariables.YES){
				// set the flag so know need to create a Hearing when Save
				Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.YES);
				// set the save required flag - will only need if setting to yes
				JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
				// Only need to set for this field as it's mandatory to set both
				JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
			}
			else{
				Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.NO);
				// set the save required flag - will only need if setting to yes
				JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_VARY, false);
			}
		}		
		
		Services.endTransaction();
	}
}
AppToVary_Hearing.enableOn = [AppToVary_Grid.dataBinding,
							  Master_AgainstGrid.dataBinding];
AppToVary_Hearing.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
/*********************************************************************/
function AppToVary_Per() {}
AppToVary_Per.retrieveOn = [AppToVary_Grid.dataBinding,
						    Master_AgainstGrid.dataBinding];
AppToVary_Per.tabIndex = -1;
AppToVary_Per.maxLength = 30;
AppToVary_Per.helpText = "Frequency of the Instalment Offer";
AppToVary_Per.isTemporary = function()
{
	return true;
}
AppToVary_Per.isReadOnly = function()
{
	return true;
}
/*********************************************************************************/
function AppToVary_ClaimResp() {}
AppToVary_ClaimResp.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentClaimResponses";
AppToVary_ClaimResp.rowXPath = "Resp";
AppToVary_ClaimResp.keyXPath = "Value";
AppToVary_ClaimResp.displayXPath = "Description";
AppToVary_ClaimResp.isTemporary = function()
{
	return false;
}
AppToVary_ClaimResp.logicOn = [AppToVary_ClaimResp.dataBinding];
AppToVary_ClaimResp.logic = function(event)
{
	if(event.getXPath() == AppToVary_ClaimResp.dataBinding){
		Services.startTransaction();
		
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
		
		// set the result to Granted if THE response is accepts
		var resp = Services.getValue(AppToVary_ClaimResp.dataBinding);
		if(resp != null && resp == JudgmentVariables.CLAIM_RESPONSE_ACCEPTS){
			Services.setValue(AppToVary_Result.dataBinding, JudgmentVariables.RESULT_GRANTED);
		}
		
		Services.endTransaction();
	}
}
AppToVary_ClaimResp.retrieveOn = [AppToVary_Grid.dataBinding,
								  Master_AgainstGrid.dataBinding];
AppToVary_ClaimResp.tabIndex = 83;
AppToVary_ClaimResp.enableOn = [AppToVary_Grid.dataBinding,
								Master_AgainstGrid.dataBinding];
AppToVary_ClaimResp.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_ClaimResp.mandatoryOn = [ AppToVary_RespDate.dataBinding,
									AppToVary_ClaimResp.dataBinding,
									AppToVary_Result.dataBinding,
									AppToVary_ResultDate.dataBinding];
AppToVary_ClaimResp.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();		
	
	var res = Services.getValue(AppToVary_Result.dataBinding);
	if(res == null || res == ""){

		var respDate = Services.getValue(AppToVary_RespDate.dataBinding);
		var resDate = Services.getValue(AppToVary_ResultDate.dataBinding);
		if(respDate != null && respDate != ""){
			isRequired = true;
		}
		else if(resDate != null && resDate != ""){
			isRequired = true;
		}
	}
	else if(res != JudgmentVariables.RESULT_TRANSFERRED){
		isRequired = true;
	}
	
	// uct 746 and tmp caseman 352
	if(isRequired == true){
		// need to check the applicant - if 'by consent' then not mandatory and RO
		var applicant = Services.getValue(AppToVary_Applicant.dataBinding);
		if(applicant != null){ 
			if(applicant == JudgmentVariables.BY_CONSENT || applicant == JudgmentVariables.PARTY_FOR){
				isRequired = false;
			}
		}
	} // if(isRequired == true)

	Services.endTransaction();
	return isRequired;
}
AppToVary_ClaimResp.helpText = "Response to the Application to Vary the instalment amount.";
AppToVary_ClaimResp.readOnlyOn = [AppToVary_Grid.dataBinding, 
								  JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_ClaimResp.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	
	if(event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;
		}
		else{
			readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("ClaimResp", true, AppToVary_Grid.dataBinding);
		}
		
		// uct 746 and tmp caseman 352
		if(readOnly == false){
			// need to check the applicant - if 'by consent' then not mandatory and RO
			var applicant = Services.getValue(AppToVary_Applicant.dataBinding);
			if(applicant != null){ 
				if(applicant == JudgmentVariables.BY_CONSENT || applicant == JudgmentVariables.PARTY_FOR){
					readOnly = true;
				}
			}			
		} // if(readOnly == false)
	}
	
	Services.endTransaction();	
	return readOnly;
}
AppToVary_ClaimResp.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AppToVary_ClaimResp.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/*********************************************************************************/
function AppToVary_RespDate() {}
AppToVary_RespDate.retrieveOn = [AppToVary_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToVary_RespDate.weekends = true; 
AppToVary_RespDate.tabIndex = 84;
AppToVary_RespDate.maxLength = 11;
AppToVary_RespDate.helpText = "Date response received at Court.";
AppToVary_RespDate.isTemporary = function()
{
	return false;
}
AppToVary_RespDate.updateMode="clickCellMode";
AppToVary_RespDate.mandatoryOn = [ AppToVary_RespDate.dataBinding,
									AppToVary_ClaimResp.dataBinding,
									AppToVary_Result.dataBinding,
									AppToVary_ResultDate.dataBinding];
AppToVary_RespDate.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
	
	var res = Services.getValue(AppToVary_Result.dataBinding);	
	//uct 749
	var claimResponse = Services.getValue(AppToVary_ClaimResp.dataBinding);
	if(claimResponse != null && claimResponse == "NO RESPONSE"){
		isRequired = false;
	}		
	else if(res == null || res == ""){
		var resp = Services.getValue(AppToVary_ClaimResp.dataBinding);
		var resDate = Services.getValue(AppToVary_ResultDate.dataBinding);
		if(resp != null && resp != ""){
			isRequired = true;
		}		
		else if(resDate != null && resDate != ""){
			isRequired = true;
		}
	}
	else if(res != JudgmentVariables.RESULT_TRANSFERRED){
		isRequired = true;
	}
	
	// uct 746 and tmp caseman 352
	if(isRequired == true){
		// need to check the applicant - if 'by consent' then not mandatory and RO
		var applicant = Services.getValue(AppToVary_Applicant.dataBinding);
		if(applicant != null){ 
			if(applicant == JudgmentVariables.BY_CONSENT || applicant == JudgmentVariables.PARTY_FOR){
				isRequired = false;
			}
		}		
	} // if(isRequired == true)

	Services.endTransaction();
	return isRequired;
}
AppToVary_RespDate.readOnlyOn = [AppToVary_Grid.dataBinding,
								AppToVary_ClaimResp.dataBinding,
								JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_RespDate.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else{
			readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("RespDate", // pField
																true, // pCheckresult
																AppToVary_Grid.dataBinding); //pGridDataBinding 
		}
		
		//uct 749
		if(readOnly == false){
			var claimResponse = Services.getValue(AppToVary_ClaimResp.dataBinding);
			if(claimResponse != null && claimResponse == "NO RESPONSE"){
				readOnly = true;
				Services.setValue(AppToVary_RespDate.dataBinding, ""); // set the value to "" as not required
			}
		}
		
		
		// uct 746 and tmp caseman 352
		if(readOnly == false){
			// need to check the applicant - if 'by consent' then not mandatory and RO
			var applicant = Services.getValue(AppToVary_Applicant.dataBinding);
			if(applicant != null){ 
				if(applicant == JudgmentVariables.BY_CONSENT || applicant == JudgmentVariables.PARTY_FOR){
					readOnly = true;
				}
			}
		} // if(readOnly == false)
	}
	
	Services.endTransaction();	
	return readOnly;
}
AppToVary_RespDate.logicOn = [AppToVary_RespDate.dataBinding,
							  Master_AgainstGrid.dataBinding,
							  AppToVary_Grid.dataBinding];
AppToVary_RespDate.logic = function(event)
{
	if (event.getXPath() == AppToVary_RespDate.dataBinding){
		// Need to ensure date is not over one month in past
		var date = Services.getValue(AppToVary_RespDate.dataBinding);
		errCode = JudgmentFunctions.validateDateLessThanOneMonthInPast(date);	
		if(errCode != null){
			alert(Messages.DATEOVER1MONTH_MESSAGE);
			errCode = null; // as only warning, allow the user to carry on
		}
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
	}
}
AppToVary_RespDate.validateOn = [AppToVary_RespDate.dataBinding,
								AppToVary_Grid.dataBinding];
AppToVary_RespDate.validate = function(event)
{	
	var errCode = null;
	if(event.getXPath() == AppToVary_RespDate.dataBinding || 
			event.getXPath() == AppToVary_Grid.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AppToVary_RespDate.dataBinding);
		if(date != null && date != ""){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// check date is not before the Application date if no error found yet
				errCode = JudgmentFunctions.validateDatePreceedsApplicationDate(date,
																		        JudgmentVariables.APP_TO_VARY);
			}// end if(errCode== null){
		}// end if(date != null && date != ""){
		Services.endTransaction();
	}//end if(event.getXPath() == AppToVary_Resp...
	return errCode;
}
AppToVary_RespDate.enableOn = [AppToVary_Grid.dataBinding,
							   Master_AgainstGrid.dataBinding];
AppToVary_RespDate.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_RespDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToVary_RespDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AppToVary_Result() {}
AppToVary_Result.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentResultsVary";
AppToVary_Result.rowXPath = "Result";
AppToVary_Result.keyXPath = "Value";
AppToVary_Result.displayXPath = "Value";
AppToVary_Result.isTemporary = function()
{
	return false;
}
AppToVary_Result.retrieveOn = [AppToVary_Grid.dataBinding,
							   Master_AgainstGrid.dataBinding];
AppToVary_Result.tabIndex = 85;
AppToVary_Result.helpText = "The result of the application";
AppToVary_Result.mandatoryOn = [AppToVary_Result.dataBinding,
								AppToVary_ResultDate.dataBinding,
								AppToVary_PayDate.dataBinding,
								AppToVary_ResultAmount.dataBinding,
								AppToVary_ClaimResp.dataBinding,
								AppToVary_ResultPer.dataBinding];
AppToVary_Result.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
			
	var respDate = Services.getValue(AppToVary_RespDate.dataBinding);
	var resp = Services.getValue(AppToVary_ClaimResp.dataBinding);
	var resDate = Services.getValue(AppToVary_ResultDate.dataBinding);
	var payDate = Services.getValue(AppToVary_PayDate.dataBinding);
	var resAmnt = Services.getValue(AppToVary_ResultAmount.dataBinding);
	var resPer = Services.getValue(AppToVary_ResultPer.dataBinding);
	/*if(respDate != null && respDate != ""){
		isRequired = true;
	}*/
	if(resp != null && resp != "" && resp != JudgmentVariables.CLAIM_RESPONSE_REFUSE){
		isRequired = true;
	}
	else if(resDate != null && resDate != ""){
		isRequired = true;
	}
	else if(payDate != null && payDate != ""){
		isRequired = true;
	}
	else if(resAmnt != null && resAmnt != ""){
		isRequired = true;
	}
	else if(resPer != null && resPer != ""){
		isRequired = true;
	}
	Services.endTransaction();
	return isRequired;
}
AppToVary_Result.readOnlyOn = [AppToVary_Grid.dataBinding,
								JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_Result.isReadOnly = function(event)
{
	// only read only if previous value entered
	// these values are stored in the tmp part of the DOM
	var readOnly = false;
	Services.startTransaction();
	
	if(event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else{
			// If result is referred to judge then this field cannot be read only
			var result = Services.getValue(AppToVary_Result.dataBinding);
			var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
			if(result != null && result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				readOnly = false;
			}
			else if(tmpResult != null && tmpResult == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				// If the old value was referred to judge then not read only
				readOnly = false;
			}
			else{
				readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("Result", // pField
																	   false, // pCheckresult
																	   AppToVary_Grid.dataBinding); //pGridDataBinding
			}
		}
	}
	
	Services.endTransaction();
	return readOnly;
}
AppToVary_Result.enableOn = [AppToVary_Grid.dataBinding,
						     Master_AgainstGrid.dataBinding];
AppToVary_Result.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_Result.logicOn = [AppToVary_Result.dataBinding];
AppToVary_Result.logic = function(event)
{
	if(event.getXPath() == AppToVary_Result.dataBinding){
		Services.startTransaction();
		var result = Services.getValue(AppToVary_Result.dataBinding);
		if(result != null && result != ""){
			var resAmount = Services.getValue(AppToVary_ResultAmount.dataBinding);
			var resPer = Services.getValue(AppToVary_ResultPer.dataBinding);
			var payDate = Services.getValue(AppToVary_PayDate.dataBinding);
			var resDate = Services.getValue(AppToVary_ResultDate.dataBinding);
			// set the result date to the system date if not already entered
			if(resDate == null || resDate == ""){
				Services.setValue(AppToVary_ResultDate.dataBinding, JudgmentFunctions.getTodaysDate());
			}
			
			if(result == JudgmentVariables.RESULT_DETERMINED){
				// need to set result amount and per to offer amount and per (if not already specified)
				// defect UCT87 - if determined default to empty
				/*
				if(resAmount == null || resAmount == ""){
					var offerAmount = Services.getValue(AppToVary_AmountOffered.dataBinding);
					Services.setValue(AppToVary_ResultAmount.dataBinding, offerAmount);
				}
				if(resPer == null || resPer == ""){
					var offerPer = Services.getValue(AppToVary_Per.dataBinding);
					var offerPerId = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods/Period[./Description = '" + offerPer + "']/Value");
					Services.setValue(AppToVary_ResultPer.dataBinding, offerPerId);
				}
				*/
				Services.setValue(AppToVary_ResultAmount.dataBinding, "");
				Services.setValue(AppToVary_ResultPer.dataBinding, "");
				Services.setValue(AppToVary_PayDate.dataBinding, "");
				
				// need to fire event 155
				Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.YES);
			}// end if(result == JudgmentVariables.RESULT_DETERMINED){
			else if(result == JudgmentVariables.RESULT_REFUSED){
				// Result Date, Amount and per not required so remove any values
				if(resAmount != null && resAmount != ""){
					Services.setValue(AppToVary_ResultAmount.dataBinding, "");
				}
				if(resPer != null && resPer != ""){
					Services.setValue(AppToVary_ResultPer.dataBinding, "");
				}
				if(payDate != null && payDate != ""){
					Services.setValue(AppToVary_PayDate.dataBinding, "");
				}
				// defect 1543 need to update the original event 140.
				Services.setValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED, JudgmentVariables.YES);
			}// end else if(result == JudgmentVariables.RESULT_REFUSED){
			else if(result == JudgmentVariables.RESULT_GRANTED){
				// need to set result amount and per to offer amount and per.
				var offerAmount = Services.getValue(AppToVary_AmountOffered.dataBinding);
				Services.setValue(AppToVary_ResultAmount.dataBinding, offerAmount);
				var offerPer = Services.getValue(AppToVary_Per.dataBinding);	
				var offerPerId = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods/Period[./Description = '" + offerPer + "']/Value");
				Services.setValue(AppToVary_ResultPer.dataBinding, offerPerId);
				// need to FIRE event 150
				Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.YES);
			}// end else if(result == JudgmentVariables.RESULT_GRANTED){
			
			// reset the Objector and Objection Date fields if not determined
			if(result != JudgmentVariables.RESULT_DETERMINED){
				Services.setValue(AppToVary_Objector.dataBinding, "");
				Services.setValue(AppToVary_ObjDate.dataBinding, "");
				// need to reset event 155
				Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.NO);
			}
			if(result != JudgmentVariables.RESULT_GRANTED){
				// need to reset event 150
				Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.NO);
			}
			if(result != JudgmentVariables.RESULT_REFUSED){
				Services.setValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED, JudgmentVariables.NO);
			}
		}//end if(result != null){
		else{
			// result is blank - set flags accoringly...Defect , prog testing 1070
			Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.NO);
			Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.NO);
			Services.setValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED, JudgmentVariables.NO);
		}
		
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
		
		Services.endTransaction();
	}
}
AppToVary_Result.validateOn = [ AppToVary_Result.dataBinding,
								AppToVary_ClaimResp.dataBinding,
								AppToVary_Grid.dataBinding];
AppToVary_Result.validate = function(event)
{
	var errCode = null;
	if (event.getXPath() == AppToVary_Result.dataBinding || 
			event.getXPath() == AppToVary_ClaimResp.dataBinding ||
				event.getXPath() == AppToVary_Grid.dataBinding){
		Services.startTransaction();

		var result = Services.getValue(AppToVary_Result.dataBinding);
		var claimResponse = Services.getValue(AppToVary_ClaimResp.dataBinding);
		var applicant = Services.getValue(AppToVary_Applicant.dataBinding); // defect uct 756
		if(result == null){
			result = "";
		}
		if(applicant == null){
			applicant = "";
		}
		if(claimResponse == null){
			claimResponse = "";
		}

		if(applicant != JudgmentVariables.BY_CONSENT && applicant != JudgmentVariables.PARTY_FOR){
			// check response is correct
			if(result == JudgmentVariables.RESULT_DETERMINED && claimResponse != JudgmentVariables.CLAIM_RESPONSE_REFUSE){
				errCode = ErrorCode.getErrorCode("Caseman_invalidResponseForDeterminedResult_Msg");
			}
			else if(applicant == JudgmentVariables.PARTY_AGAINST && result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE && claimResponse != JudgmentVariables.CLAIM_RESPONSE_REFUSE){
				errCode = ErrorCode.getErrorCode("Caseman_invalidResponseForDeterminedResult2_Msg");
			}
		}
		
		Services.endTransaction();
	}
	return errCode;
}
/*********************************************************************************/
function AppToVary_ResultDate() {}
AppToVary_ResultDate.retrieveOn = [AppToVary_Grid.dataBinding,
								   Master_AgainstGrid.dataBinding];
AppToVary_ResultDate.weekends = true; 
AppToVary_ResultDate.tabIndex = 86;
AppToVary_ResultDate.maxLength = 11;
AppToVary_ResultDate.helpText = "Indicates the date the result was decided";
AppToVary_ResultDate.isTemporary = function()
{
	return false;
}
AppToVary_ResultDate.updateMode="clickCellMode";
AppToVary_ResultDate.enableOn = [AppToVary_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToVary_ResultDate.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_ResultDate.mandatoryOn = [AppToVary_Result.dataBinding,
									AppToVary_ClaimResp.dataBinding,
									AppToVary_ResultDate.dataBinding];
AppToVary_ResultDate.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
		
	var res = Services.getValue(AppToVary_Result.dataBinding);		
	if(res == null || res == ""){
		// see if response is not reuses terms
		var resp = Services.getValue(AppToVary_ClaimResp.dataBinding);
		//var respDate = Services.getValue(AppToVary_RespDate.dataBinding);
		if(resp != null && resp != "" && resp != JudgmentVariables.CLAIM_RESPONSE_REFUSE){
			isRequired = true;
		}		
		/*
		else if(respDate != null && respDate != ""){
			isRequired = true;
		}
 */
	}
	else{
		isRequired = true;
	}

	Services.endTransaction();
	return isRequired;
}
AppToVary_ResultDate.readOnlyOn = [AppToVary_Grid.dataBinding, 
								JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_ResultDate.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else{
			// If result is referred to judge then this field cannot be read only
			var result = Services.getValue(AppToVary_Result.dataBinding);
			var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
			if(result != null && result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				readOnly = false
			}
			else if(tmpResult != null && tmpResult == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				// If the old value was referred to judge then not read only
				readOnly = false;
			}
			else{
				readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("DateResult", // pField
																	   true, // pCheckresult
																	   AppToVary_Grid.dataBinding); //pGridDataBinding
			}
		}		
	}
	
	Services.endTransaction();	
	return readOnly;
}
AppToVary_ResultDate.validateOn = [AppToVary_ResultDate.dataBinding,
									AppToVary_Grid.dataBinding];
AppToVary_ResultDate.validate = function(event)
{	
	var errCode = null;
	if (event.getXPath() == AppToVary_ResultDate.dataBinding || 
			event.getXPath() == AppToVary_Grid.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AppToVary_ResultDate.dataBinding);
		if(date != null && date != ""){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// check date is not before the Application date if no error found yet
				errCode = JudgmentFunctions.validateDatePreceedsApplicationDate(date,
																		        JudgmentVariables.APP_TO_VARY);
			}// end if(errCode == null){
		}// end if(date != null && date != ""){
		Services.endTransaction();
	}
	return errCode;
}
AppToVary_ResultDate.logicOn = [AppToVary_ResultDate.dataBinding];
AppToVary_ResultDate.logic = function(event)
{
	if (event.getXPath() == AppToVary_ResultDate.dataBinding){
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
	}
}
AppToVary_ResultDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToVary_ResultDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AppToVary_PayDate() {}
AppToVary_PayDate.retrieveOn = [AppToVary_Grid.dataBinding,
								Master_AgainstGrid.dataBinding];
AppToVary_PayDate.tabIndex = 87;
AppToVary_PayDate.maxLength = 11;
AppToVary_PayDate.helpText = "Date of first Instalment, or in full if no instalment amount";
AppToVary_PayDate.isTemporary = function()
{
	return false;
}
AppToVary_PayDate.updateMode="clickCellMode";
AppToVary_PayDate.enableOn = [AppToVary_Grid.dataBinding,
							  Master_AgainstGrid.dataBinding];
AppToVary_PayDate.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_PayDate.mandatoryOn = [ AppToVary_PayDate.dataBinding,
								  AppToVary_Result.dataBinding];
AppToVary_PayDate.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
	
	var res = Services.getValue(AppToVary_Result.dataBinding);
	if(res != null && res != ""){
		if(res == JudgmentVariables.RESULT_DETERMINED || res == JudgmentVariables.RESULT_GRANTED){
			isRequired = true;
		}		
	}// end if(res != null && res != ""){){

	Services.endTransaction();
	return isRequired;
}
AppToVary_PayDate.logicOn = [AppToVary_ResultDate.dataBinding,
							AppToVary_ResultPer.dataBinding,
							AppToVary_PayDate.dataBinding,
							AppToVary_Result.dataBinding];
AppToVary_PayDate.logic = function(event)
{
	Services.startTransaction();
	if(event.getXPath() == AppToVary_Result.dataBinding){
		Services.setValue(AppToVary_PayDate.dataBinding, "");
	}
	else if(event.getXPath() == AppToVary_ResultDate.dataBinding){
		var period = Services.getValue(AppToVary_ResultPer.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		var resultDate = Services.getValue(AppToVary_ResultDate.dataBinding);
		var date = null;
		if(resultDate != null && resultDate != ""){//set date accordingly
			if(result != null && result != JudgmentVariables.RESULT_REFUSED){
				if(period == JudgmentVariables.PERIOD_WK){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_1WEEK); 
				}
				else if(period == JudgmentVariables.PERIOD_FOR){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_2WEEK);
				}
				else if(period == JudgmentVariables.PERIOD_MTH){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_1MTH);
				}
				else{
					date = JudgmentFunctions.getSysDatePlus(null);// returns system date
				}
			}
			//if(result != null && result == JudgmentVariables.RESULT_DETERMINED){
			//	Services.setValue(AppToVary_PayDate.dataBinding, "");
			//}
			//else{
			//	if(date == null){
			//		date = "";
			//	}
			Services.setValue(AppToVary_PayDate.dataBinding, date);
			//}
			
		}
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
	} // if(event.getXPath() == AppToVary_Result.dataBinding){
	else if(event.getXPath() == AppToVary_ResultPer.dataBinding){
		var period = Services.getValue(AppToVary_ResultPer.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		var date = null;
		if(period != null && period != ""){//set date accordingly
			if(result != null && result != JudgmentVariables.RESULT_REFUSED){
				if(period == JudgmentVariables.PERIOD_WK){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_1WEEK);
				}
				else if(period == JudgmentVariables.PERIOD_FOR){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_2WEEK);
				}
				else if(period == JudgmentVariables.PERIOD_MTH){
					date = JudgmentFunctions.getSysDatePlus(JudgmentVariables.PLUS_1MTH);
				}
				else{
					date = JudgmentFunctions.getSysDatePlus(null);// returns system date
				}
			}
			Services.setValue(AppToVary_PayDate.dataBinding, date);
		}
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		
	}//else if(event.getXPath() == AppToVary_ResultPer.dataBinding){
	else if(event.getXPath() == AppToVary_PayDate.dataBinding){
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
	}
	
	Services.endTransaction();
}

AppToVary_PayDate.readOnlyOn = [AppToVary_Grid.dataBinding,
								AppToVary_Result.dataBinding, 
								JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_PayDate.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	
	if(event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;
		}
		else if(result != null && result == JudgmentVariables.RESULT_REFUSED){
			readOnly = true;
		}
		else{
			// If result is referred to judge then this field cannot be read only
			if(result != null && result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				readOnly = false
			}
			else if(tmpResult != null && tmpResult == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				// If the old value was referred to judge then not read only
				readOnly = false;
			}
			else{
				readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("PayDate", // pField
																	   true, // pCheckresult
																	   AppToVary_Grid.dataBinding); //pGridDataBinding
			}
		}	
	}

	Services.endTransaction();
	return readOnly;
}
AppToVary_PayDate.validateOn = [AppToVary_PayDate.dataBinding,
								AppToVary_Grid.dataBinding,
								AppToVary_ResultDate.dataBinding];
AppToVary_PayDate.validate = function(event)
{	
	var errCode = null;
	if (event.getXPath() == AppToVary_PayDate.dataBinding || 
			event.getXPath() == AppToVary_Grid.dataBinding || 
				event.getXPath() == AppToVary_ResultDate.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AppToVary_PayDate.dataBinding);
		if(date != null && date != ""){
			// check date is not before the Result date 
			errCode = JudgmentFunctions.validateDatePreceedsResultDate(date);
		}// end if(date != null && date != ""){
		Services.endTransaction();
	}
	return errCode;
}
AppToVary_PayDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToVary_PayDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AppToVary_ResultAmountCurrency() {}
AppToVary_ResultAmountCurrency.retrieveOn = [AppToVary_Grid.dataBinding];
AppToVary_ResultAmountCurrency.tabIndex = -1;
AppToVary_ResultAmountCurrency.maxLength = 3;
AppToVary_ResultAmountCurrency.isTemporary = function()
{
	return false;
}
AppToVary_ResultAmountCurrency.isReadOnly = function()
{
	return true;
}
AppToVary_ResultAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/*********************************************************************************/
function AppToVary_ResultAmount() {}
AppToVary_ResultAmount.retrieveOn = [AppToVary_Grid.dataBinding,
								     Master_AgainstGrid.dataBinding];
AppToVary_ResultAmount.tabIndex = 88;
AppToVary_ResultAmount.maxLength = 12;
AppToVary_ResultAmount.helpText = "The determined instalment amount to be paid.";
AppToVary_ResultAmount.isTemporary = function()
{
	return false;
}
AppToVary_ResultAmount.enableOn = [AppToVary_Grid.dataBinding,
								   Master_AgainstGrid.dataBinding];
AppToVary_ResultAmount.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_ResultAmount.mandatoryOn = [ AppToVary_ResultAmount.dataBinding,
								       AppToVary_Result.dataBinding,
								       AppToVary_ResultPer.dataBinding];
AppToVary_ResultAmount.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
	
	var res = Services.getValue(AppToVary_Result.dataBinding);
	var resPer = Services.getValue(AppToVary_ResultPer.dataBinding);
	if(resPer != null && resPer != ""){
		isRequired = true;
	}
	else if(res != null && res != ""){
		if(res == JudgmentVariables.RESULT_DETERMINED){
			isRequired = true;
		}		
	}// end if(res != null && res != ""){){

	Services.endTransaction();
	return isRequired;
}
AppToVary_ResultAmount.readOnlyOn = [AppToVary_Grid.dataBinding,
									 AppToVary_Result.dataBinding,
								     JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_ResultAmount.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
		if(result == null){
			result = "";
		}
		
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;
		}
		else if(result == JudgmentVariables.RESULT_REFUSED || result == JudgmentVariables.RESULT_GRANTED){
				readOnly = true;
		}
		else{
			// If result is referred to judge then this field cannot be read only
			if(result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				readOnly = false
			}
			else if(tmpResult != null && tmpResult == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				// If the old value was referred to judge then not read only
				readOnly = false;
			}
			else{
				readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("ResultAmount", // pField
																	   true, // pCheckresult
																	   AppToVary_Grid.dataBinding); //pGridDataBinding
			}
		}
	}
	Services.endTransaction();
	return readOnly;	
}
AppToVary_ResultAmount.validateOn = [AppToVary_ResultAmount.dataBinding,
									 AppToVary_Grid.dataBinding];
AppToVary_ResultAmount.validate = function(event)
{
	var errCode = null;
	if (event.getXPath() == AppToVary_ResultAmount.dataBinding || 
			event.getXPath() == AppToVary_Grid.dataBinding){
		var amount = Services.getValue(AppToVary_ResultAmount.dataBinding);
		// ensure in correct format when copied in from other fields		
		amount = JudgmentFunctions.transformCurrency(amount);
		errCode = JudgmentFunctions.validateAmount(	amount, 
														JudgmentVariables.CURRENCY_MAX_11_PATTERN, 
														true);// pCheckAmount													
		if(errCode == null){
			// now check the instal amount is not greater than the judgment total
			var total = Services.getValue(JudgmentDetails_Total.dataBinding);
			if(total != null && total != ""){
				if(parseFloat(amount) > parseFloat(total)){
					errCode = ErrorCode.getErrorCode('CaseMan_amountGreaterThanJudgAmount_Msg');
				}
			}//end if(total != null && total...
		}// end if(errCode == null){...
	}
	return errCode;
}
AppToVary_ResultAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);

}

AppToVary_ResultAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/*********************************************************************************/
function AppToVary_ResultPer() {}

// JavaScript: extra configurations for Autocomplete
AppToVary_ResultPer.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods";
AppToVary_ResultPer.rowXPath = "Period";
AppToVary_ResultPer.keyXPath = "Value";
AppToVary_ResultPer.displayXPath = "Description";
AppToVary_ResultPer.isTemporary = function()
{
	return false;
}
AppToVary_ResultPer.enableOn = [AppToVary_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToVary_ResultPer.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_ResultPer.retrieveOn = [AppToVary_Grid.dataBinding,
								  Master_AgainstGrid.dataBinding];
AppToVary_ResultPer.tabIndex = 89;
AppToVary_ResultPer.maxLength = 10;
AppToVary_ResultPer.helpText = "Frequency of the actual Instalment Monthly, Weekly etc";
AppToVary_ResultPer.mandatoryOn = [ AppToVary_ResultPer.dataBinding,
								    AppToVary_Result.dataBinding,
								    AppToVary_ResultAmount.dataBinding];
AppToVary_ResultPer.isMandatory = function()
{
	var isRequired = false;
	Services.startTransaction();
	
	var res = Services.getValue(AppToVary_Result.dataBinding);
	var amount = Services.getValue(AppToVary_ResultAmount.dataBinding);
	if(amount != null && amount != ""){
		isRequired = true;
	}
	else if(res != null && res != ""){
		if(res == JudgmentVariables.RESULT_DETERMINED){
			isRequired = true;
		}		
	}// end if(res != null && res != ""){){

	Services.endTransaction();
	return isRequired;
}
AppToVary_ResultPer.readOnlyOn = [AppToVary_Grid.dataBinding,
									AppToVary_Result.dataBinding,
								     JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_ResultPer.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		var tmpResult = Services.getValue(JudgmentVariables.APP_TO_VARY_TMP_PATH + 
										"/Variation[./VarySurrogateId = " + AppToVary_Grid.dataBinding + "]/Result");
		if(result == null){
			result = "";
		}
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else if(result == JudgmentVariables.RESULT_REFUSED || result == JudgmentVariables.RESULT_GRANTED){
				readOnly = true;
		}
		else{
			// If result is referred to judge then this field cannot be read only
			if(result == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				readOnly = false
			}
			else if(tmpResult != null && tmpResult == JudgmentVariables.RESULT_REFERRED_TO_JUDGDE){
				// If the old value was referred to judge then not read only
				readOnly = false;
			}
			else{
				readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("ResultAmountPer", // pField
																	   true, // pCheckresult
																	   AppToVary_Grid.dataBinding); //pGridDataBinding
			}
		}
	}
	
	Services.endTransaction();	
	return readOnly;
	
}
AppToVary_ResultPer.logicOn = [AppToVary_ResultPer.dataBinding];
AppToVary_ResultPer.logic = function(event)
{
	if (event.getXPath() == AppToVary_ResultPer.dataBinding){
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
	}
}

/*********************************************************************************/
function AppToVary_Objector() {}
AppToVary_Objector.retrieveOn = [AppToVary_Grid.dataBinding,
								 Master_AgainstGrid.dataBinding];
AppToVary_Objector.srcData = JudgmentVariables.ALL_JUDGMENT_PARTIES_TMP_PATH;
AppToVary_Objector.rowXPath = "Party";
AppToVary_Objector.keyXPath = "CasePartyKey";
AppToVary_Objector.displayXPath = "DisplayName";
AppToVary_Objector.tabIndex = 90;
AppToVary_Objector.helpText = "The Party objecting to the determination.";
AppToVary_Objector.isTemporary = function()
{
	return false;
}
AppToVary_Objector.enableOn = [AppToVary_Grid.dataBinding,
							    Master_AgainstGrid.dataBinding];
AppToVary_Objector.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_Objector.mandatoryOn = [AppToVary_ObjDate.dataBinding,	
							      AppToVary_Objector.dataBinding];
AppToVary_Objector.isMandatory = function()
{
	var isRequired = false;
	var obj = Services.getValue(AppToVary_ObjDate.dataBinding);
	if(obj != null && obj != ""){
		isRequired = true;
	}
	return isRequired;
}
AppToVary_Objector.readOnlyOn = [AppToVary_Grid.dataBinding, 
									AppToVary_Result.dataBinding,
								     JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_Objector.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;			
		}
		else if(result == null || result == "" || result != JudgmentVariables.RESULT_DETERMINED){
			readOnly = true;
		}
		else{	
			readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("Objector", // pField
																   false, // pCheckresult
																   AppToVary_Grid.dataBinding); //pGridDataBinding 
		}
	}
	
	Services.endTransaction();	
	return readOnly;
	
}
AppToVary_Objector.logicOn = [AppToVary_Objector.dataBinding];
AppToVary_Objector.logic = function(event)
{
	if(event.getXPath() == AppToVary_Objector.dataBinding){
		Services.startTransaction();
		
		var obj = Services.getValue(AppToVary_Objector.dataBinding);
			if(obj != null && obj != ""){
				// need to fire event 55
				Services.setValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED, JudgmentVariables.YES);
			}
			else{
				// need to reset event 55
				Services.setValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED, JudgmentVariables.NO);
			}
		
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
		
		Services.endTransaction();
	}
}
AppToVary_Objector.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AppToVary_Objector.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/*********************************************************************************/
function AppToVary_ObjDate() {}
AppToVary_ObjDate.tabIndex = 91;
AppToVary_ObjDate.weekends = true;
AppToVary_ObjDate.maxLength = 11;
AppToVary_ObjDate.helpText = "Date objection received at Court";
AppToVary_ObjDate.isTemporary = function()
{
	return false;
}
AppToVary_ObjDate.retrieveOn = [AppToVary_Grid.dataBinding,
								Master_AgainstGrid.dataBinding];
AppToVary_ObjDate.updateMode="clickCellMode";
AppToVary_ObjDate.enableOn = [AppToVary_Grid.dataBinding,
							  Master_AgainstGrid.dataBinding];
AppToVary_ObjDate.isEnabled = function()
{
	return JudgmentFunctions.appVaryExist();
}
AppToVary_ObjDate.mandatoryOn = [AppToVary_Objector.dataBinding,
								 AppToVary_ObjDate.dataBinding];
AppToVary_ObjDate.isMandatory = function()
{
	var isRequired = false;
	var obj = Services.getValue(AppToVary_Objector.dataBinding);
	if(obj != null && obj != ""){
		isRequired = true;
	}
	return isRequired;
}
AppToVary_ObjDate.readOnlyOn = [AppToVary_Grid.dataBinding,
								AppToVary_Result.dataBinding,
								JudgmentVariables.APP_TO_VARY_TMP_PATH + "/Variation[./VarySurrogateId = " + 
																	AppToVary_Grid.dataBinding + "]/VarySurrogateId"];
AppToVary_ObjDate.isReadOnly = function(event)
{
	// only read only if previous value entered.
	// these values are stored in the tmp part of the DOM	
	var readOnly = false;
	Services.startTransaction();
	if (event.getXPath() != "/"){
		var status = Services.getValue(JudgmentDetails_Status.dataBinding);
		var result = Services.getValue(AppToVary_Result.dataBinding);
		if(status != null && status != "" && status != JudgmentVariables.STATUS_VARIED){
			readOnly = true;
		}
		else if(result == null || result == "" || result != JudgmentVariables.RESULT_DETERMINED){
			readOnly = true;
		}
		else{
			readOnly = JudgmentFunctions.isReadOnlyAppToVaryField("ObjectionDate", // pField
																   false, // pCheckresult
																   AppToVary_Grid.dataBinding); //pGridDataBinding 
		}
	}
	
	Services.endTransaction();
	return readOnly;
}
AppToVary_ObjDate.validateOn = [AppToVary_ObjDate.dataBinding,
								AppToVary_Grid.dataBinding,
								AppToVary_ResultDate.dataBinding];
AppToVary_ObjDate.validate = function(event)
{	
	var errCode = null;
	
	if(event.getXPath() == AppToVary_ObjDate.dataBinding || 
			event.getXPath() == AppToVary_Grid.dataBinding ||
				event.getXPath() == AppToVary_ResultDate.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AppToVary_ObjDate.dataBinding);
		if(date != null && date != ""){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// check date is not before the Result date 
				errCode = JudgmentFunctions.validateDatePreceedsResultDate(date);		
			}// end if(errCode == null){
		}// end if(date != null && date != ""){
		Services.endTransaction();
	}
	return errCode;
}
AppToVary_ObjDate.logicOn = [AppToVary_ObjDate.dataBinding];
AppToVary_ObjDate.logic = function(event)
{
	if (event.getXPath() == AppToVary_ObjDate.dataBinding){
		// Need to ensure date is not over one month in past
		var date = Services.getValue(AppToVary_ObjDate.dataBinding);
		errCode = JudgmentFunctions.validateDateLessThanOneMonthInPast(date);	
		if(errCode != null){
			alert(Messages.DATEOVER1MONTH_MESSAGE);
			errCode = null; // as only warning, allow the user to carry on
		}
		// set the save required flag
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
	}
}
AppToVary_ObjDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AppToVary_ObjDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/

/*****************************************************************************************************************
                         ADD APPLICATION TO VARY POPUP INPUT FIELD DEFINITIONS
*****************************************************************************************************************/

function AddVary_Date() {}
AddVary_Date.tabIndex = 94;
AddVary_Date.maxLength = 11;
AddVary_Date.helpText = "Date the Application to Vary was made";
AddVary_Date.isTemporary = function()
{
	return true;
}
AddVary_Date.updateMode="clickCellMode";
AddVary_Date.validateOn = [AddVary_Date.dataBinding];
AddVary_Date.validate = function(event)
{	
	var errCode = null;
	if(event.getXPath() == AddVary_Date.dataBinding){
		Services.startTransaction();
		var date = Services.getValue(AddVary_Date.dataBinding);
		if(date != null && date != ""){
			// check not in future
			var errCode = JudgmentFunctions.validateDateInFuture(date);
			if(errCode == null){
				// check date is not before the Judgment date if no error found yet
				errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
																		  false);//adding?	
				// Need to ensure date is not over one month in past
				if(errCode == null){
					errCode = JudgmentFunctions.validateDateLessThanOneMonthInPast(date);	
					if(errCode != null){
						alert(Messages.DATEOVER1MONTH_MESSAGE);
						errCode = null; // as only warning, allow the user to carry on
					}// end if(errCode != null){
				}// end if(errCode == null){
			}// end if(errCode == null){
		}// end if(date != null && date != ""){
		Services.endTransaction();
	}

	return errCode;
}
AddVary_Date.isMandatory = function()
{
	return true;
}
AddVary_Date.logicOn = [AddVary_Date.dataBinding];
AddVary_Date.logic = function(event)
{	
	if(event.getXPath() == AddVary_Date.dataBinding){	
		var today = JudgmentFunctions.getTodaysDate();
		var varyDate = Services.getValue(AddVary_Date.dataBinding);
		if(today != varyDate){
			// set flag to indict changes made and if cancel button select will need to display the message
			JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		}
	}
}
AddVary_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AddVary_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/
function AddVary_Applicant() {}
// JavaScript: extra configurations for select list
AddVary_Applicant.srcData = JudgmentVariables.REF_DATA_XPATH + "/Applicants";
AddVary_Applicant.rowXPath = "Applicant";
AddVary_Applicant.keyXPath = "Value";
AddVary_Applicant.displayXPath = "Value";
AddVary_Applicant.tabIndex = 95;
AddVary_Applicant.maxLength = 20;
AddVary_Applicant.helpText = "Party submitting the Application to Vary the Instalment Order";
AddVary_Applicant.isTemporary = function()
{
	return true;
}
AddVary_Applicant.isMandatory = function()
{
	return true;
}
AddVary_Applicant.logicOn = [AddVary_Applicant.dataBinding];
AddVary_Applicant.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}	
}
/*********************************************************************************/
function AddVary_InstAmountCurrency() {}
AddVary_InstAmountCurrency.tabIndex = -1;
AddVary_InstAmountCurrency.isTemporary = function()
{
	return true;
}
AddVary_InstAmountCurrency.isReadOnly = function()
{
	return true;
}
AddVary_InstAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/*********************************************************************************/
function AddVary_InstAmount() {}
AddVary_InstAmount.tabIndex = 96;
AddVary_InstAmount.maxLength = 12;
AddVary_InstAmount.helpText = "New Instalment Amount requested";
AddVary_InstAmount.isTemporary = function()
{
	return true;
}
AddVary_InstAmount.isMandatory = function()
{
	return true;
}
AddVary_InstAmount.validateOn = [AddVary_InstAmount.dataBinding];
AddVary_InstAmount.validate = function()
{
	Services.startTransaction();
	var amount = Services.getValue(AddVary_InstAmount.dataBinding);
	var errCode = null;
	if(amount != null && amount != ""){
		errCode = JudgmentFunctions.validateAmount(	amount, 
													JudgmentVariables.CURRENCY_MAX_11_PATTERN, 
													true);// pCheckAmount
		if(errCode == null){
			// now check the instal amount is not greater than the judgment total
			var total = Services.getValue(JudgmentDetails_Total.dataBinding);
			if(total != null && total != ""){
				if(parseFloat(amount) > parseFloat(total)){
					errCode = ErrorCode.getErrorCode('CaseMan_amountGreaterThanJudgAmount_Msg');
				}
			}//end if(total != null && total...
		}// end if(errCode == null){...
	}// end if(amount != nu...

	Services.endTransaction();
	return errCode;
}
AddVary_InstAmount.logicOn = [AddVary_InstAmount.dataBinding];
AddVary_InstAmount.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddVary_InstAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AddVary_InstAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/*********************************************************************************/
function AddVary_Per() {}
// JavaScript: extra configurations for select list
AddVary_Per.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods";
AddVary_Per.rowXPath = "Period";
AddVary_Per.keyXPath = "Description";
AddVary_Per.displayXPath = "Description";
AddVary_Per.isTemporary = function()
{
	return true;
}
AddVary_Per.logicOn = [AddVary_Per.dataBinding];
AddVary_Per.logic = function(event)
{
	if(event.getXPath() != "/"){
		Services.startTransaction();
		// need to set the id when we select the name
		// set xpaths
		var per = Services.getValue(AddVary_Per.dataBinding);
		var getXp = JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods/Period[./Description = '" + per + "']/Value"; 
		var id = Services.getValue(getXp);
		Services.setValue(AddVary_PerID.dataBinding, id);
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		
		Services.endTransaction();
	}
}
AddVary_Per.tabIndex = 97;
AddVary_Per.maxLength = 20;
AddVary_Per.helpText = "Frequency of the Instalment Offer";
AddVary_Per.isMandatory = function()
{
	return true;
}
/*********************************************************************************/
function AddVary_PerID() {}
AddVary_PerID.isTemporary = function()
{
	return true;
}
/*****************************************************************************************************************
                                        BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/

/*****************************************************************************************************************
										STANDARD BUTTONS															
****************************************************************************************************************/

function Status_Save() {}

Status_Save.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainJudgment" } ]
	}
};

Status_Save.tabIndex = 13;
/**
 * @author rzhh8k
 * 
 */
Status_Save.actionBinding = function()
{
	// Validate the form
	if(JudgmentFunctions.isSaveRequired()){
		// GROUP 2 DEFECT 1526
		var caseStatus = Services.getValue("/ds/MaintainJudgment/CaseStatus")
		if(JudgmentFunctions.isCCBCCourt() == true && caseStatus != null && caseStatus == JudgmentVariables.CASE_STATUS_STAYED){
			Services.setTransientStatusBarMessage(Messages.CCBC_STAYED_CASE_MESSAGE);			
		}
		else{
			// defect 6475 - set the case court code
			var caseCourtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
			var setCaseCourtCodeXp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/CourtCode";
			Services.setValue(setCaseCourtCodeXp, caseCourtCode);
			
			// defect 1543 need to update the original event 140.
			var updateEvent140Result = Services.getValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED);
			if(updateEvent140Result != null && updateEvent140Result == JudgmentVariables.YES){
				//set flag on Judgment
				var setEvent140ResultXp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/UpdateEvent140";
				Services.setValue(setEvent140ResultXp, updateEvent140Result);
				Services.setValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED, JudgmentVariables.NO);
			}
			
			var updateEvent160Result = Services.getValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED);
			if(updateEvent160Result != null && updateEvent160Result == JudgmentVariables.YES){
				//set flag on Judgment
				var setEvent160ResultXp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/UpdateEvent160";
				Services.setValue(setEvent160ResultXp, updateEvent160Result);
				Services.setValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED, JudgmentVariables.NO);
			}
			
			var invalidFields = FormController.getInstance().validateForm(true, true);
			if(invalidFields.length == 0){
				Services.startTransaction();						
				var obligationNoChoice = false;
				var obligationChoice = false;
				//defect 799 .  Left flag in below to pass to method. No longer navigate to WFT
				var windowsForTrialChoice = false;
				var createN441A = false;
				var createN35A = false;
				var createN35 = false;
				var createN246 = false; // uct 498
				var createO31251 = false; // CaseMan 6263
				var setAsideResult = Services.getValue(AppToSetAside_Result.dataBinding); // caseman 6004
				if(null == setAsideResult){
					setAsideResult = "";
				}
				
				if(JudgmentFunctions.hasJudgmentStatusChanged() == true){
					var status = Services.getValue(JudgmentDetails_Status.dataBinding);
					if(status != null && status != ""){
						if(status == JudgmentVariables.STATUS_CANCELLED || status == JudgmentVariables.STATUS_SATISFIED ||
																				status == JudgmentVariables.STATUS_SET_ASIDE){
							// rtl defect 318- only create a 600 if the judgment is registered
							var regDate = Services.getValue(JudgmentDetails_DateToRTL.dataBinding);
							if(regDate != null && regDate != "" && JudgmentFunctions.isCCBCCourt() == false){ // ccbc defect 1313 added if ccbc court							
									JudgmentFunctions.setEvent(JudgmentVariables.EVENT600);	
									if(setAsideResult != JudgmentVariables.RESULT_IN_ERROR){
										// caseman defect 6004 - if set aside status is IN ERROR do not create output										
										createN441A = true; //
								}
							}
						}
						/* rtl defect 318.  Only raise 79 when all judgments are paid
						else if(status == JudgmentVariables.STATUS_PAID){
							var finalPayDate = Services.getValue(JudgmentDetails_PaidInFullDate.dataBinding);
							if(finalPayDate != null && finalPayDate != ""){
								JudgmentFunctions.setEvent(JudgmentVariables.EVENT79);
								obligationNoChoice = true;
								Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT79);
							}					
						}// end if/else if
						*/	
					}// end if(status != null && status != ""){
				}
				// check if need to fire event 160
				var setAside = Services.getValue(JudgmentVariables.SET_ASIDE_ADDED_PATH);			
				if(setAside == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.SET_ASIDE_ADDED_PATH, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT160);
				}
				
				// check if need to fire event 170
				var setAsideGranted = Services.getValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH);
				if(setAsideGranted != null && setAsideGranted == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT170);
					// ccbc uct grp2 defect 1550
					//only create a 031251 when applicant is not the proper officer
					var appIsProperOfficer = Services.getValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER);
					if(JudgmentFunctions.isCCBCCourt() == false){
						createO31251 = true;
					}
					else if(appIsProperOfficer != null && appIsProperOfficer == JudgmentVariables.YES){
						// only produce for applicant of Proper Officer for CCBC
						createO31251 = true;
						// RESET FLAG
						Services.setValue(JudgmentVariables.SET_ASIDE_APPLICANT_PROPER_OFFICER, JudgmentVariables.NO);
					}					
					
					// removed defect 799 windowsForTrialChoice = true;
					if(setAsideResult == JudgmentVariables.RESULT_GRANTED){
						if(obligationNoChoice == false && JudgmentFunctions.isCCBCCourt() == false){ // ccbc defect 1316. added if ccbc court
							obligationChoice = true;
							Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT170);
						}
					}
				}
				
				// check if need to fire event 200
				var hearingEvent = Services.getValue(JudgmentVariables.HEARING_EVENT_REQUIRED_PATH);
				if(hearingEvent != null && hearingEvent == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.HEARING_EVENT_REQUIRED_PATH, JudgmentVariables.NO);
					obligationChoice = false;
					obligationNoChoice = true;
					Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT200);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT200);
				}
				
				// check if need to fire event 375
				var fireEvent375 = Services.getValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED);
				if(fireEvent375 != null && fireEvent375 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.REG_DATE_ENTERTED_AFTER_JUDGMENT_CREATED, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT375);
				}
				
				// check if need to fire event 79
				// defect 1488 - always produce an event 79 for ccbc and paid judgments
				var fireEvent79AllPaid = Services.getValue(JudgmentVariables.FINAL_PAYMENT_MADE);
				var ccbcFireEvent79 = Services.getValue(JudgmentVariables.PAYMENT_MADE_CCBC);
				if(fireEvent79AllPaid != null && fireEvent79AllPaid == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.FINAL_PAYMENT_MADE, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT79);
					obligationNoChoice = true;
					obligationChoice = false;
					Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT79);					
					
					if(JudgmentFunctions.isCCBCCourt() == true){
						// set flag - as final event 79
						var ccbcSetCaseStatusXp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = " + Master_AgainstGrid.dataBinding + "]/CCBCSetCaseStatus";
						Services.setValue(ccbcSetCaseStatusXp, JudgmentVariables.YES);

					}
				}
				else if(ccbcFireEvent79 != null && ccbcFireEvent79 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.PAYMENT_MADE_CCBC, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT79);
					obligationNoChoice = true;
					obligationChoice = false;
					Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT79);					
				}
				
				// check if need to fire event 140
				var fireEvent140 = Services.getValue(JudgmentVariables.APP_TO_VARY_MADE);
				if(fireEvent140 != null && fireEvent140 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.APP_TO_VARY_MADE, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT140);
					/* defect 660 - shouldn't go to Obligations
					if(!obligationNoChoice){
						obligationChoice = true;
					}
					*/
					// uct 745
					var printN246 = Services.getValue(JudgmentVariables.PRINT_N246);
					if(printN246 != null && printN246 == JudgmentVariables.YES){
						createN246 = true; // uct 498
						// temp caseman 6022 (303 tmp caseman)
						// Should prompt for obligations if creating a varaiation for PARTY_AGAINST
						// NB Only print N246 , if the variation is for the PARTY_AGAINST
						// UCT Group2 Defect 1501 - No Obligation Prompt for CCBC
						if( !JudgmentFunctions.isCCBCCourt() && obligationNoChoice == false){
							obligationChoice = true;
							Services.setValue(MaintainObligationsParams.EVENT_ID, JudgmentVariables.EVENT140);
						}
					}
					
				}
				
				// check if need to fire event 155
				var fireEvent155 = Services.getValue(JudgmentVariables.APP_TO_VARY_DETERMINED);
				if(fireEvent155 != null && fireEvent155 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT155);
					createN35 = false;
					createN35A = true; // can't have both
				}
				
				// check if need to fire event 150
				var fireEvent150 = Services.getValue(JudgmentVariables.APP_TO_VARY_GRANTED);
				if(fireEvent150 != null && fireEvent150 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT150);
					createN35A = false;
					createN35 = true; // can't have both
				}
				
				// check if need to fire event 55
				var fireEvent55 = Services.getValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED);
				if(fireEvent55 != null && fireEvent55 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT55);			
				}
				
				// RFC 1473 - new event to be fired when amending a judgment
				// check if need to fire event 236
				var fireEvent236 = Services.getValue(JudgmentVariables.EVENT236_REQUIRED_PATH);
				if(fireEvent236 != null && fireEvent236 == JudgmentVariables.YES){
					Services.setValue(JudgmentVariables.EVENT236_REQUIRED_PATH, JudgmentVariables.NO);
					JudgmentFunctions.setEvent(JudgmentVariables.EVENT236);			
				}
				// end RFC1473 fix
				
				// check all the output flags
				
				// set the flags correctly
				if(createN441A){
					//can only have one
					createN35A = false;
					createN35 = false;
					createO31251 = false;		
				}
				JudgmentFunctions.setWordProcessingFlags(createN441A, createN35A, createN35, createN246, createO31251);//uct 498
				// set the navigation flags
				JudgmentFunctions.setNavigationFlags(obligationNoChoice, obligationChoice, windowsForTrialChoice);
				
				// reset the add application flags
				Services.setValue(JudgmentVariables.ADD_APPLICATION_SET_PREVIOUSLY, JudgmentVariables.NO);
				Services.setValue(JudgmentVariables.ADDED_ASIDE_APPLICATION, JudgmentVariables.NO);
				Services.setValue(JudgmentVariables.ADDED_VARY_APPLICATION, JudgmentVariables.NO);
				
				// now save details
				var serviceName = "maintainJudgment";
				// Make service call
				var newDOM = XML.createDOM(null, null, null);
				var mcNode = Services.getNode("/ds/MaintainJudgment");
				var dsNode = XML.createElement(newDOM, "ds");
				dsNode.appendChild(mcNode);
				newDOM.appendChild(dsNode);		
				var params = new ServiceParams();		
				params.addDOMParameter("JudgmentSequence", newDOM);
				Services.callService(serviceName, params, Status_Save, true);
				// refresh
				JudgmentFunctions.setSaveRequired(JudgmentVariables.NO,
												 "", //save area - all in this case
												 true); // clear save popup flag
				Services.setValue(Master_AgainstGrid.dataBinding, "");
				JudgmentFunctions.setJudgmentToSave("");			
				
				Services.endTransaction();
			}// end if(invalidFields.length == 0){
		} // else
	}// end if(JudgmentFunctions.isSaveRequired()){
}
/**
 * @param dom
 * @author rzhh8k
 * 
 */
Status_Save.onSuccess = function(dom)
{
	if (null != dom){
		Services.startTransaction();
		// Put a success message in the status bar
		Services.setTransientStatusBarMessage(Messages.SAVEDSUCESSFULLY_MESSAGE);
		// taken out re defect 785 alert(Messages.SAVEDSUCESSFULLY_MESSAGE);
		// now look to navigation and Word Processing
		
		// Get Navigation Rules
		var navObligationWithMsg = Services.getValue(JudgmentVariables.OBLIGATIONS_MSG_NAVIGATION);
		var navObligationNoMsg = Services.getValue(JudgmentVariables.OBLIGATIONS_NO_MSG_NAVIGATION);
		//  removed defect 799 var navWft = Services.getValue(JudgmentVariables.WINDOW_FOR_TRIAL_NAVIGATION);
		var wp = Services.getValue(JudgmentVariables.WORD_PROCESSING_REQUIRED_FOR);
				
		// Set up the Navigation Array and set parameters in app section
		var navArray = new Array();
		
		if((navObligationWithMsg != null && navObligationWithMsg == JudgmentVariables.YES) || 
					(navObligationNoMsg != null && navObligationNoMsg == JudgmentVariables.YES)){
			// copy parameters to app section of the DOM
			JudgmentFunctions.setAppCaseNumberParameter(MaintainObligationsParams.CASE_NUMBER);
			
			if(navObligationWithMsg == JudgmentVariables.YES){
				// create mode in obligations
				Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "C");
				var eventSeqId = JudgmentFunctions.getEventSequence(dom, JudgmentVariables.EVENT170);
				Services.setValue(MaintainObligationsParams.EVENT_SEQ, eventSeqId);
				// add to nav array
				navArray.push(NavigationController.OBLIGATIONS_FORM);
			}
			else{
				// ensure that there are obligations to maintain
				var obsExist = Services.getValue("/ds/MaintainJudgment/ActiveObligations/Obligation");
				if(obsExist != null && obsExist == "true"){
					// maintain mode and navigating
					Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
					// add to nav array
					navArray.push(NavigationController.OBLIGATIONS_FORM);
				}
				else{
					// reset the obligation params
					Services.removeNode(MaintainObligationsParams.PARENT);					
				}
			}			
		}		

		// uct defect 653 - do not produce output if a ccbc case (except the 170 output O_3_1_2_5_1: CaseMan Defect 6263)
		if ( wp != null && wp != "" && ( wp == JudgmentVariables.WPO31251 || !JudgmentFunctions.isCCBCCourt() ) ){
			// Navigating to the Word Processing screen
			if(navArray.length > 0){
				// Add WP Node to the app section of the DOM as going somewhere else first
				// SERVER DATA TO SEND TO WP
				var wpXML = JudgmentFunctions.setupWordProcessingXML(dom, wp);
				Services.replaceNode(CaseManFormParameters.WPNODE_XPATH, wpXML);
				
				var xpStr = "/ds/var/app/WPData2";
				var xxx = Services.getNode(xpStr);
				if (null != xxx) Services.removeNode(xpStr);
				Services.addNode(dom, "/ds/var/app/WPData2");
			}
			// add to nav array
			navArray.push(NavigationController.WP_FORM);
		}
		
		// get flag so if know leaving screen
		var exitScreen = Services.getValue(JudgmentVariables.EXIT_SCREEN);
		
		Services.endTransaction(); 
		if(navArray.length > 0){
			if(exitScreen != null && exitScreen == JudgmentVariables.YES){
				// no need to add as will automatically go to Event screen
			}
			else{
				// Set Call Stack to return to the Judgments screen
				navArray.push(NavigationController.JUDGMENT_FORM);
			}			
			
			NavigationController.addToStack(navArray);
		}
		else{
			if(exitScreen != null && exitScreen == JudgmentVariables.YES){
				// we're out of here
				JudgmentFunctions.exitScreen();
			}
			else{
				// No need to navigate anywhere, refresh screen
				JudgmentFunctions.getJudgments(false);
			}
		}
		
		// Navigate away
		var refreshScreen = false; 
		var navigating = false;
		for(var i=0; i<navArray.length; i++){
			switch(navArray[i]){
				// Handle Navigation to Obligation screen
				case NavigationController.OBLIGATIONS_FORM:
					
					if(navObligationNoMsg == JudgmentVariables.YES){
						// Navigate to Obligation screen - no message required
						NavigationController.nextScreen();
						navigating = true;
					}
					else{
						if(confirm(Messages.OBL_MESSAGE)){
							// User wishes to Navigate to Obligation screen
							NavigationController.nextScreen();
							navigating = true;
						}
						else{
							// User does not wish to navigate to Obligations screen
							NavigationController.skipScreen();
							Services.removeNode(MaintainObligationsParams.PARENT); 
							refreshScreen = true;
						}
					}
					break;			

				// Handle Navigation to Word Processing Screens
				case NavigationController.WP_FORM:
					// Skip screen so does not go to surrogate WP page
					NavigationController.skipScreen();
					var nextScreen = NavigationController.getNextScreen();
					NavigationController.skipScreen();
					
					var wordProcessXML = JudgmentFunctions.setupWordProcessingXML(dom, wp);
					// call the word processing area
					// Make call to WP Controller
				
					Services.replaceNode(CaseManFormParameters.WPNODE_XPATH, wordProcessXML);
				
					Services.setValue(CaseManFormParameters.WPNODE_XPATH  +"/Request", "Create");
					var wpNode = Services.getNode(CaseManFormParameters.WPNODE_XPATH);
					var wpDom = XML.createDOM();
					wpDom.loadXML(wpNode.xml);
				
					var frmCtrl = FormController.getInstance();
				
					// has the close button been selected
					if(exitScreen != null && exitScreen == JudgmentVariables.YES){
						// yes it has - ensure navigate away from screen
				
						WP.ProcessWP(frmCtrl, wpDom, nextScreen, true );
						WP.CheckForMoreEvents(frmCtrl, dom, wpDom, nextScreen, true);
						Services.removeNode("/ds/var/app/WPData2");
		
						navigating = true;
					}
					else{
						// no it has not - stay in Judgments
						WP.ProcessWP(frmCtrl, wpDom, nextScreen, false );	
						WP.CheckForMoreEvents(frmCtrl, dom, wpDom, nextScreen, false);
						Services.removeNode("/ds/var/app/WPData2");
		
						refreshScreen = true;
					}
					frmCtrl = null;
					break;
			}// end switch
			
			// Exit as are navigating
			if (navigating == true){ 
				break; 
			}
		}// end for
		
		if(navigating == false && refreshScreen == true){			
			// retrieve the Judgments after save
			JudgmentFunctions.getJudgments(false);
			JudgmentFunctions.copyEditFields();
		}
	}//end if (null != dom){
	else{
		alert(Messages.NO_RESULTS_MESSAGE);
	}
}



/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	JudgmentFunctions.exitScreen();
}
/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onUpdateLockedException = function (exception)
{
	if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG)){
		JudgmentFunctions.getJudgments(false);
	}
	else{
		JudgmentFunctions.exitScreen();
	}
}
/**
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	JudgmentFunctions.exitScreen();
}
/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzhh8k
 * 
 */
Status_Save.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}
/****************************************************************************************************************/
function Status_Close() {}

Status_Close.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainJudgment" } ]
	}
};

Status_Close.tabIndex = 14;
/**
 * @author rzhh8k
 * 
 */
Status_Close.actionBinding = function()
{
	// Check if any unsaved data
	if(JudgmentFunctions.isSaveRequired() == true){
		if(confirm(Messages.DETSLOST_MESSAGE)){
			// set flag so know leaving screen
			Services.setValue(JudgmentVariables.EXIT_SCREEN, JudgmentVariables.YES);
			Status_Save.actionBinding();
		}
		else{
			JudgmentFunctions.exitScreen();
		}
	}//end if(JudgmentFunctions.i...
	else{
		JudgmentFunctions.exitScreen();
	}
}
/****************************************************************************************************************/
function Master_AddJudgmentBtn() {}

Master_AddJudgmentBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainJudgment" } ]
	}
};

Master_AddJudgmentBtn.tabIndex = 3;
/**
 * @author rzhh8k
 * 
 */
Master_AddJudgmentBtn.actionBinding = function()
{	
	if(JudgmentFunctions.isSaveRequired() == true){
		alert(Messages.SAVE_JUDGMENT_MESSAGE);
	}
	else{
		JudgmentFunctions.copyMaintainJudgmentForSubform();
		// GROUP2 1337 - -  add validation re whether costs amount correct for CCBC.  
		// Here retrieve the costs from the database
		if(JudgmentFunctions.isCCBCCourt() == true){
			JudgmentFunctions.loadJudgmentReferenceData(JudgmentVariables.GET_COSTS_FOR_CCBC); //GROUP2 1337
		}		
		Services.dispatchEvent("addJudgment_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/****************************************************************************************************************/
function Master_SetAsideButton() {}
Master_SetAsideButton.tabIndex = 10;
/**
 * @author rzhh8k
 * 
 */
Master_SetAsideButton.actionBinding = function()
{
	Services.startTransaction();

	if(JudgmentFunctions.isSaveRequired() == true){
		alert(Messages.SAVE_JUDGMENT_MESSAGE);
	}
	else{
		JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
		// Copy the Applications into a tmp area for validation purposes
		// and retriveal if changes made then the user cancels.
		JudgmentFunctions.createTmpAppSetAside(Master_AgainstGrid.dataBinding);
		// reset save area - if coming back in need to know if later changes are made
		JudgmentFunctions.setSaveRequired(  JudgmentVariables.NO, 
											JudgmentVariables.APP_TO_SET_ASIDE, //pArea, 
											false);// pSaveBtnPopupSelected

		// set the add app previous flag if required
		if(JudgmentFunctions.asideApplicationAdded() == true){
			Services.setValue(JudgmentVariables.ADD_APPLICATION_SET_PREVIOUSLY, JudgmentVariables.YES);
		}
		
		Services.dispatchEvent("AppToSetAside", PopupGUIAdaptor.EVENT_RAISE);
	}
	Services.endTransaction();
}
Master_SetAsideButton.enableOn = [Master_AgainstGrid.dataBinding];
Master_SetAsideButton.isEnabled = function()
{
	return JudgmentFunctions.judgmentsExist();
}
/****************************************************************************************************************/
function Master_VaryButton() {}
Master_VaryButton.tabIndex = 11;
/**
 * @author rzhh8k
 * 
 */
Master_VaryButton.actionBinding = function()
{	
	Services.startTransaction();

	if(JudgmentFunctions.isSaveRequired() == true){
		alert(Messages.SAVE_JUDGMENT_MESSAGE);
	}
	else{
		JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
		// Copy the Applications into a tmp area for validation purposes
		// and retriveal if changes made then the user cancels.
		JudgmentFunctions.createTmpAppToVary(Master_AgainstGrid.dataBinding);
		// reset save area - if coming back in need to know if later changes are made
		JudgmentFunctions.setSaveRequired(  JudgmentVariables.NO,
											JudgmentVariables.APP_TO_VARY, //pArea,
											false);// pSaveBtnPopupSelected
		// set up the Objector list
		JudgmentFunctions.setPartyJudgmentList();
		
		// set the add app previous flag if required
		if(JudgmentFunctions.varyApplicationAdded() == true){
			// set
			Services.setValue(JudgmentVariables.ADD_APPLICATION_SET_PREVIOUSLY, JudgmentVariables.YES);
		}
		
		Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_RAISE);
		Services.setFocus("AppToVary_Grid");
	}
	Services.endTransaction();
}
Master_VaryButton.enableOn = [Master_AgainstGrid.dataBinding];
Master_VaryButton.isEnabled = function()
{
	return JudgmentFunctions.judgmentsExist();
}
/****************************************************************************************************************/
function Master_PayeeDetailsButton() {}
Master_PayeeDetailsButton.tabIndex = 12;

Master_PayeeDetailsButton.enableOn = [Master_AgainstGrid.dataBinding];
Master_PayeeDetailsButton.isEnabled = function()
{
	if ( !JudgmentFunctions.isCCBCCourt() )
	{
		// Disable the button if the court is not CCBC
		return false;
	}
	
	// Button is enabled if Judgments exist on the Case
	return JudgmentFunctions.judgmentsExist();
}

/****************************************************************************************************************/
/**
 * rfc 1473.  Add new Amend Judgment Button
 *
 * @author rzhh8k
 * 
 */
function AmendJudgmentButton() {}
AmendJudgmentButton.tabIndex = 5;

AmendJudgmentButton.enableOn = [Master_AgainstGrid.dataBinding,
								JudgmentDetails_DateToRTL.dataBinding,
								JudgmentDetails_Status.dataBinding];
AmendJudgmentButton.isEnabled = function()
{	
	var enabled = false;
	Services.startTransaction();
	
	var regDate = Services.getValue(JudgmentDetails_DateToRTL.dataBinding);
	var judgeStatus = Services.getValue(JudgmentDetails_Status.dataBinding);
	if(null != regDate && regDate != ""){
		if(null == judgeStatus || judgeStatus == "" || judgeStatus == JudgmentVariables.STATUS_VARIED){
		 	enabled = true;
		}
	} 
	
	Services.endTransaction();
	return enabled;
}
/**
 * @author rzhh8k
 * 
 */
AmendJudgmentButton.actionBinding = function()
{
	Services.startTransaction();	
	
	if(JudgmentFunctions.isCCBCCourt() == true){
		JudgmentFunctions.loadJudgmentReferenceData(JudgmentVariables.GET_COSTS_FOR_CCBC); //GROUP2 1337
	}
	// Make appropriate fields not read only
	Services.setValue(JudgmentVariables.AMEND_JUDGMENT, JudgmentVariables.YES);
	// set the original values for comparison to see whether changed and serverside call required later
	var originalAmtAllowed = Services.getValue(JudgmentDetails_JudgmentAmount.dataBinding);	
	Services.setValue(JudgmentVariables.AMOUNT_ALLOWED_TMP_PATH, originalAmtAllowed);
	var originalCosts = Services.getValue(JudgmentDetails_JudgmentCosts.dataBinding);	
	Services.setValue(JudgmentVariables.COSTS_TMP_PATH, originalCosts);	
	
	Services.endTransaction();
}
/****************************************************************************************************************/
function AppToSetAside_OKBtn() {}
AppToSetAside_OKBtn.tabIndex = 54;
/**
 * @author rzhh8k
 * 
 */
AppToSetAside_OKBtn.actionBinding = function()
{
	Services.startTransaction();
	// validate fields	
	var valid = true;
	if(JudgmentFunctions.isSaveRequiredSetAside() == true){
		if(JudgmentFunctions.validateGrid("AppToSetAside_Grid") == true){
			var setAsideGranted = Services.getValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH);
			if(setAsideGranted != null && setAsideGranted == JudgmentVariables.YES){
				valid = JudgmentFunctions.areAppSetAsidesCorrect()
			}
			if(valid == true){
				if(JudgmentFunctions.isMultiAppToSetAsideWithNoResult() == true){
					if(setAsideGranted != null && setAsideGranted == JudgmentVariables.YES){
						// set the Judgment status to set aside
						JudgmentFunctions.setStatus(JudgmentVariables.STATUS_SET_ASIDE);
						
					}
					JudgmentFunctions.setSaveRequired(JudgmentVariables.YES,
													  JudgmentVariables.APP_TO_SET_ASIDE, // save area						
													  true); // add btn selected
					// reset temp area
					Services.removeNode(JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH);
					// set the edit tmp area status - in case can not edit now as set aside
					var status = Services.getValue(JudgmentDetails_Status.dataBinding);
					Services.setValue(JudgmentVariables.EDIT_JUDGMENT_TMP_PATH + "/Status", status);			
					Services.dispatchEvent("AppToSetAside", PopupGUIAdaptor.EVENT_LOWER);
				}
				else{
					alert(Messages.MORE_THAN_ONE_APP_NO_RESULT_MESSAGE);
				}
			}
			else{
				alert(Messages.STATUS_CANNOT_BE_SETASIDE_MESSAGE)
			}		
		}
		else{
			alert(Messages.INVALID_MESSAGE);
		}
	}
	else{
		Services.dispatchEvent("AppToSetAside", PopupGUIAdaptor.EVENT_LOWER);
	}
	Services.endTransaction();
}
/****************************************************************************************************************/
function AppToSetAside_CancelBtn() {}
AppToSetAside_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AppToSetAside" } ]
	}
};
AppToSetAside_CancelBtn.tabIndex = 55;
/**
 * @author rzhh8k
 * 
 */
AppToSetAside_CancelBtn.actionBinding = function()
{
	if(JudgmentFunctions.isSaveRequiredSetAside() == true){
		// only show the message if changes have been made
		if(confirm(Messages.CANCEL_MESSAGE)){
			// need to ensure data is back to original state as canceling
			// Therefore copy the tmp data (the original values) back to the DOM
			Services.startTransaction();
			
			// reset the flag to show if application been set to granted, to NO
			Services.setValue(JudgmentVariables.SET_ASIDE_GRANTED_PATH, JudgmentVariables.NO);
			// copy back the original set aside details
			var node = Services.getNode(JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH);
			var judgId = Services.getValue(Master_AgainstGrid.dataBinding);
			var xp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + judgId + "']/ApplicationsToSetAside";
			
			if(node != null){
				Services.replaceNode(xp, node);
				// reset temp area
				Services.removeNode(JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH);
			}
			else{
				// just need to remove the original
				Services.removeNode(xp);			
			}						
			
			// Reset update event 160 result refused flag
			Services.setValue(JudgmentVariables.UPDATE_EVENT_160_RESULT_REFUSED, JudgmentVariables.NO);
						
			// now set the status changed flag and status
			JudgmentFunctions.setJudgmentStatusChanged(JudgmentVariables.NO);
			JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_SET_ASIDE, false);
			if(JudgmentFunctions.isSaveRequired() == false){
				// if no saves are required - add, set aside, vary or edit - reset
				JudgmentFunctions.setJudgmentToSave("");
			}
						
			if(JudgmentFunctions.hasApplicationAddedPreviously() == false){
				// reset value
				Services.setValue(JudgmentVariables.ADDED_ASIDE_APPLICATION, JudgmentVariables.NO);	
				Services.setValue(JudgmentVariables.SET_ASIDE_ADDED_PATH, JudgmentVariables.NO);			
			}
			
			Services.dispatchEvent("AppToSetAside", PopupGUIAdaptor.EVENT_LOWER);
			
			Services.endTransaction();
		}// end if(confirm(Messages...
	}
	else{		
		Services.startTransaction();
		
		// reset temp area and have a tidy up
		Services.removeNode(JudgmentVariables.APP_TO_SET_ASIDE_TMP_PATH);
		JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_SET_ASIDE, false);
		if(JudgmentFunctions.isSaveRequired() == false){
			// if no saves are required - add, set aside, vary or edit - reset
			JudgmentFunctions.setJudgmentToSave("");
		}
		Services.dispatchEvent("AppToSetAside", PopupGUIAdaptor.EVENT_LOWER);
		
		Services.endTransaction();
	}// end if/else
}
/****************************************************************************************************************/
function AppToSetAside_AddBtn() {}
AppToSetAside_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "AppToSetAside" } ]
	}
};
// defect 4630 - time issue seems to mean btn not disabled when another popup is launched.  Added line below
AppToSetAside_AddBtn.inactiveWhilstHandlingEvent = false;
/**
 * @author rzhh8k
 * 
 */
AppToSetAside_AddBtn.actionBinding = function(){
	
	Services.startTransaction();

	if(JudgmentFunctions.asideApplicationAdded() == true){
		// CAN NOT ADDED ANOTHER UNTIL A SAVE HAS TAKEN PLACE
		alert(Messages.APP_ADDED_PREVIOUSLY_MESSAGE);
	}
	else{

		if(JudgmentFunctions.validateGrid("AppToSetAside_Grid") == true){
			// need to ensure can select the Add button
			var msg = JudgmentFunctions.isAddApplicationAllowed(JudgmentVariables.APP_TO_SET_ASIDE);
			if(msg == null){
				// set default data
				Services.setValue(AddSetAside_Date.dataBinding, JudgmentFunctions.getTodaysDate());
				JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
				Services.dispatchEvent("AddSetAside", PopupGUIAdaptor.EVENT_RAISE);
			}
			else{
				alert(msg);
			}
		}
		else{
			alert(Messages.INVALID_APP_MESSAGE);
		}
	}
	
	Services.endTransaction();
}
AppToSetAside_AddBtn.tabIndex = 51;
/****************************************************************************************************************/
function AddSetAside_OKBtn() {}
AddSetAside_OKBtn.tabIndex = 58;
/**
 * @author rzhh8k
 * 
 */
AddSetAside_OKBtn.actionBinding = function()
{
	Services.startTransaction();
	// Need to validate the data before returning to the Main Judgment screen
	// Validate the fields
	if(JudgmentFunctions.validateNewAppSetAside() == true){
		// add the new set aside to the dom
		var surrId = getNextSurrogateKey();
		JudgmentFunctions.addNewSetAside(surrId);
		//set the set aside grid
		Services.setValue(AppToSetAside_Grid.dataBinding, surrId);
		// reset the fields in the new set aside tmp
		JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_SET_ASIDE, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
		Services.setValue(JudgmentVariables.ADDED_ASIDE_APPLICATION, JudgmentVariables.YES);
		Services.dispatchEvent("AddSetAside", PopupGUIAdaptor.EVENT_LOWER);
	}
	else{
		alert(Messages.INVALID_MESSAGE);
	}		

	Services.endTransaction();
}
/****************************************************************************************************************/
function AddSetAside_CancelBtn() {}
AddSetAside_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddSetAside" } ]
	}
};
AddSetAside_CancelBtn.tabIndex = 59;
/**
 * @author rzhh8k
 * 
 */
AddSetAside_CancelBtn.actionBinding = function()
{
	if(JudgmentFunctions.displayCancelMessage() == true){
		if(confirm(Messages.CANCEL_MESSAGE)){
			JudgmentFunctions.resetNewSetAside();
			JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
			Services.dispatchEvent("AddSetAside", PopupGUIAdaptor.EVENT_LOWER);
		}
	}
	else{
		Services.dispatchEvent("AddSetAside", PopupGUIAdaptor.EVENT_LOWER);
	}
}
/****************************************************************************************************************/
function AppToVary_OKBtn() {}
AppToVary_OKBtn.tabIndex = 92;
/**
 * @author rzhh8k
 * 
 */
AppToVary_OKBtn.actionBinding = function()
{
	Services.startTransaction();
		
	if(JudgmentFunctions.isSaveRequiredVary() == true){
		// validate fields
		if(JudgmentFunctions.validateGrid("AppToVary_Grid") == true){
			var valid = JudgmentFunctions.isMultiAppToVaryWithNoResult();
			if(valid == true){
				JudgmentFunctions.setSaveRequired(JudgmentVariables.YES,
												  "", // save area						
												  true); // add btn selected
				Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_LOWER);
				// does the status need to be updated
				var determined = Services.getValue(JudgmentVariables.APP_TO_VARY_DETERMINED);
				var granted = Services.getValue(JudgmentVariables.APP_TO_VARY_GRANTED);
				
				// CCBC defect 4410 (TD Group 2) - only update the status for non CCBC courts
				if(determined != null && determined == JudgmentVariables.YES 
							&& JudgmentFunctions.isCCBCCourt() == false){
					JudgmentFunctions.setStatus(JudgmentVariables.STATUS_VARIED);
				}
				else if(granted != null && granted == JudgmentVariables.YES
							&& JudgmentFunctions.isCCBCCourt() == false){
					JudgmentFunctions.setStatus(JudgmentVariables.STATUS_VARIED);
				}// end if /else determined != null && determined == JudgmentVariables.YES){
				
				// SET CURRENCY FIELD
				var defaultCurrency = Services.getValue(JudgmentVariables.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
				Services.setValue(AppToVary_ResultAmountCurrency.dataBinding, defaultCurrency);
				// do we need to display the Hearings popup
				var hearing =  Services.getValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH);
				if(hearing != null && hearing == JudgmentVariables.YES){
					/*
					// set any popup default values here
					// e.g. venue stuff ....
					JudgmentFunctions.setUpDefaultOwningCourt(HearingDetails_VenueCode.dataBinding, HearingDetails_VenueName.dataBinding);
					Services.setValue(JudgmentVariables.NEW_HEARING_TMP_PATH + "/TypeOfHearingCode", JudgmentVariables.HEARING_TYPE_CODE);
					Services.setValue(HearingDetails_HearingTypeDesc.dataBinding, JudgmentVariables.HEARING_TYPE_DESC);
					// defect Caseman 580. Sould not enter a date of request to list
					//Services.setValue(JudgmentVariables.NEW_HEARING_TMP_PATH + "/DateOfRequestToList", JudgmentFunctions.getTodaysDate());
					// Reset the flag
					Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.NO);
					Services.dispatchEvent("Hearing_Details_Popup", PopupGUIAdaptor.EVENT_RAISE);		
					*/
					
					Services.dispatchEvent("hearingDetails_subform", PopupGUIAdaptor.EVENT_RAISE);					
				}//end if(hearing != null && 
				// reset temp area
				Services.removeNode(JudgmentVariables.APP_TO_VARY_TMP_PATH);
			}// end if(hearing != null && 
			else{
				alert(Messages.MORE_THAN_ONE_APP_NO_RESULT_MESSAGE)
			}	
		}
		else{
			alert(Messages.INVALID_MESSAGE);
		}
	}// end (JudgmentFunctions.isSaveRequiredvary()){
	else{
		Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_LOWER);
	}
	
	Services.endTransaction();
}
/****************************************************************************************************************/
function AppToVary_CancelBtn() {}
AppToVary_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AppToVary" } ]
	}
};
AppToVary_CancelBtn.tabIndex = 93;
/**
 * @author rzhh8k
 * 
 */
AppToVary_CancelBtn.actionBinding = function()
{
	if(JudgmentFunctions.isSaveRequiredVary() == true){
		// only show the message if changes have been made
		if(confirm(Messages.CANCEL_MESSAGE)){
			// need to ensure data is back to original state as canceling
			// Therefore copy the tmp data (the original values) back to the DOM
			Services.startTransaction();
			var node = Services.getNode(JudgmentVariables.APP_TO_VARY_TMP_PATH);
			var judgId = Services.getValue(Master_AgainstGrid.dataBinding);
			var xp = JudgmentVariables.JUDGMENT_PATH + "[./SurrogateId = '" + judgId + "']/ApplicationsToVary";
			if(node != null){
				Services.replaceNode(xp, node);
				// reset temp area
				Services.removeNode(JudgmentVariables.APP_TO_VARY_TMP_PATH);
			}
			else{
				// just need to remove the original
				Services.removeNode(xp);
			}
			
			JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_VARY, false);
			// need to reset event 150
			Services.setValue(JudgmentVariables.APP_TO_VARY_GRANTED, JudgmentVariables.NO);
			// need to reset event 155
			Services.setValue(JudgmentVariables.APP_TO_VARY_DETERMINED, JudgmentVariables.NO);
			// need to reset event 55
			Services.setValue(JudgmentVariables.APP_TO_VARY_OBJECTOR_ENTERED, JudgmentVariables.NO);
			// set the Hearing flag to N
			Services.setValue(JudgmentVariables.APPVARY_HEARING_REQUIRED_PATH, JudgmentVariables.NO);
			// defect 1543 need to update the original event 140.
			Services.setValue(JudgmentVariables.UPDATE_EVENT_140_RESULT_REFUSED, JudgmentVariables.NO);
			if(JudgmentFunctions.isSaveRequired() == false){
				// if no saves are required - add, set aside, vary or edit - reset
				JudgmentFunctions.setJudgmentToSave("");
			}
			
			if(JudgmentFunctions.hasApplicationAddedPreviously() == false){
				// reset value
				Services.setValue(JudgmentVariables.ADDED_VARY_APPLICATION, JudgmentVariables.NO);
				// need to RESET  event 140 flag
				Services.setValue(JudgmentVariables.APP_TO_VARY_MADE, JudgmentVariables.NO);
			}			
			
			Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_LOWER);
			
			Services.endTransaction();
		}// end if(confirm(Messages...
	}
	else{		
		// need to ensure data is back to original state as canceling
		// Therefore copy the tmp data (the original values) back to the DOM
		Services.startTransaction();
		// reset temp area
		var node = Services.getNode(JudgmentVariables.APP_TO_VARY_TMP_PATH);
		if(node != null){
			Services.removeNode(JudgmentVariables.APP_TO_VARY_TMP_PATH);
		}
		
		JudgmentFunctions.setSaveRequired(JudgmentVariables.NO, JudgmentVariables.APP_TO_VARY_TMP_PATH, false);
		if(JudgmentFunctions.isSaveRequired() == false){
			// if no saves are required - add, set aside, vary or edit - reset
			JudgmentFunctions.setJudgmentToSave("");
		}
		Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_LOWER);
		
		Services.endTransaction();
	}// end if/else
	//Services.dispatchEvent("AppToVary", PopupGUIAdaptor.EVENT_LOWER);
}
/****************************************************************************************************************/
function AppToVary_AddBtn() {}
AppToVary_AddBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "AppToVary" } ]
	}
};
// defect 4630 - time issue seems to mean btn not disabled when another popup is launched. Added line below
AppToVary_AddBtn.inactiveWhilstHandlingEvent = false;
AppToVary_AddBtn.tabIndex = 81;
/**
 * @author rzhh8k
 * 
 */
AppToVary_AddBtn.actionBinding = function()
{

	if(JudgmentFunctions.varyApplicationAdded() == true){
		// CAN NOT ADDED ANOTHER UNTIL A SAVE HAS TAKEN PLACE
		alert(Messages.APP_ADDED_PREVIOUSLY_MESSAGE);
	}
	else{
		// validate fields	
		if(JudgmentFunctions.validateGrid("AppToVary_Grid") == true){
			// need to ensure can select the Add button
			var msg = JudgmentFunctions.isAddApplicationAllowed(JudgmentVariables.APP_TO_VARY);
			if(msg == null){
				// set default data
				Services.setValue(AddVary_Date.dataBinding, JudgmentFunctions.getTodaysDate());
				JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
				Services.dispatchEvent("AddVary", PopupGUIAdaptor.EVENT_RAISE);
			}
			else{
				alert(msg);
			}
		}
		else{
			alert(Messages.INVALID_APP_MESSAGE);
		}
	}
}
/****************************************************************************************************************/
function AddVary_OKBtn() {}
AddVary_OKBtn.tabIndex = 98;
/**
 * @author rzhh8k
 * 
 */
AddVary_OKBtn.actionBinding = function()
{
	Services.startTransaction();

	// Need to validate the data before returning to the Main Judgment screen
	// Validate the fields
	if(JudgmentFunctions.validateNewAppVary() == true){
	
		// UCT 745.  Only print N246 when applicant is Party Against
		var applicant = Services.getValue(AddVary_Applicant.dataBinding);
		if(applicant != null && applicant == JudgmentVariables.PARTY_AGAINST){
			Services.setValue(JudgmentVariables.PRINT_N246, JudgmentVariables.YES);
		}
		else{
			Services.setValue(JudgmentVariables.PRINT_N246, JudgmentVariables.NO);
		}
		
		// add the new set aside to the dom
		var surrId = getNextSurrogateKey();
		JudgmentFunctions.addNewVary(surrId);
		// reset the fields in the new set aside tmp
		JudgmentFunctions.setSaveRequired(JudgmentVariables.YES, JudgmentVariables.APP_TO_VARY, false);
		JudgmentFunctions.setJudgmentToSave(Services.getValue(Master_AgainstGrid.dataBinding));
		// need to fire event 140
		Services.setValue(JudgmentVariables.APP_TO_VARY_MADE, JudgmentVariables.YES);
		JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
		Services.setValue(JudgmentVariables.ADDED_VARY_APPLICATION, JudgmentVariables.YES);		
		
		Services.dispatchEvent("AddVary", PopupGUIAdaptor.EVENT_LOWER);
	}
	else{
		alert(Messages.INVALID_MESSAGE);
	}

	Services.endTransaction();	
}
/****************************************************************************************************************/
function AddVary_CancelBtn() {}
AddVary_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddVary" } ]
	}
};
AddVary_CancelBtn.tabIndex = 99;
/**
 * @author rzhh8k
 * 
 */
AddVary_CancelBtn.actionBinding = function()
{
	if(JudgmentFunctions.displayCancelMessage() == true){
		if(confirm(Messages.CANCEL_MESSAGE)){
			JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
			JudgmentFunctions.resetNewVary();
			Services.dispatchEvent("AddVary", PopupGUIAdaptor.EVENT_LOWER);
		}
	}
	else{
		Services.dispatchEvent("AddVary", PopupGUIAdaptor.EVENT_LOWER);
	}	
}

/****************************************************************************************************************/
/*   PRINT ORDER JUDGMENT    */
/****************************************************************************************************************/

function Outputs_Popup_CloseButton() {}
/**
 * @author rzhh8k
 * 
 */
Outputs_Popup_CloseButton.actionBinding = function()
{
	Services.dispatchEvent("Outputs_Popup", PopupGUIAdaptor.EVENT_LOWER);
}

/**
 * This used to be NavBar_PrintJudgOrdersBtn.onSuccess()
 * @param dom
 * @author rzhh8k
 * 
 */
Outputs_Popup_CloseButton.onSuccess = function(dom)
{
	if (dom != null && dom.getElementsByTagName("Case").length != 0)
	{
	 
	var showPopup = false;
//	 var showPopup = wpCtrl.processJudgmentOrderPrinting(document, frmCtrl, dom, NavigationController.JUDGMENT_FORM);
	  if (true == showPopup) {	
	  	Services.dispatchEvent("Outputs_Popup", PopupGUIAdaptor.EVENT_RAISE);
	  }
	}
    else
    { 
      alert(Messages.PJO_MESSAGE_NOPO);
    }
}

/**
 * This is the callback function that is invoked when the print judgment orders button is clicked
 * in the menu bar and the print judgment order outputs service call returns successfully.
 * @author rzhh8k
 * 
 */
function MenuBarPrintJudgmentOrders() {}
MenuBarPrintJudgmentOrders.onSuccess = function(resultDom)
{
	var JUDGMENT_ORDER_OUTPUT_XPATH = "/ds/JudgmentOrderOutput";

	// If no data has been returned then inform the user and quit.
	if (null == resultDom.selectSingleNode(JUDGMENT_ORDER_OUTPUT_XPATH))
	{
		Services.setTransientStatusBarMessage(Messages.ERR_NO_JUDGMENT_EVENT_MESSAGE);
		return;
	}
	
	// Prepare the context xml to send to word processing.
	var wpXML= XML.createDOM(null, null, null);
	wpXML.loadXML("<WordProcessing>"+ 
					"<Request>Create</Request>"+
					"<Case>"+
						"<CaseNumber></CaseNumber>"+
					"</Case>"+
					"<Event>"+
						"<StandardEventId>230</StandardEventId>"+
						"<CaseEventSeq>125371</CaseEventSeq>"+	
						"<JudgmentId>102565</JudgmentId>"+
					"</Event>"+	
				"</WordProcessing>");

	// Load the context with the data returned from the service call.
	var caseNumber = "";
	var caseNumberNode = resultDom.selectSingleNode(JUDGMENT_ORDER_OUTPUT_XPATH + "/CaseNumber");
	if(caseNumberNode != null) {caseNumber = XML.getNodeTextContent(caseNumberNode);}			

	var eventId = "";
	var eventIdNode = resultDom.selectSingleNode(JUDGMENT_ORDER_OUTPUT_XPATH + "/EventId");
	if(eventIdNode != null) {eventId = XML.getNodeTextContent(eventIdNode);}			

	var caseEventSeq = "";
	var caseEventSeqNode = resultDom.selectSingleNode(JUDGMENT_ORDER_OUTPUT_XPATH + "/EventSeq");
	if(caseEventSeqNode != null) {caseEventSeq = XML.getNodeTextContent(caseEventSeqNode);}			
	
	var judgmentId = "";
	var judgmentIdNode = resultDom.selectSingleNode(JUDGMENT_ORDER_OUTPUT_XPATH + "/JudgmentId");
	if(judgmentIdNode != null) {judgmentId = XML.getNodeTextContent(judgmentIdNode);}				
	
	var wpNode = wpXML.selectSingleNode("/WordProcessing");
	XML.setElementTextContent( wpNode, "./Case/CaseNumber", caseNumber);
	XML.setElementTextContent( wpNode, "./Event/StandardEventId", eventId);
	XML.setElementTextContent( wpNode, "./Event/CaseEventSeq", caseEventSeq);
	XML.setElementTextContent( wpNode, "./Event/JudgmentId", judgmentId);

	// Call word processing.
	WP.ProcessWP(FormController.getInstance(), wpXML, NavigationController.JUDGMENT_FORM, true);	
}

/**
 * This is the callback function that is invoked when the print judgment orders button is clicked
 * in the menu bar and the print judgment order outputs service call fails.
 * @param exception
 * @author rzhh8k
 * 
 */
MenuBarPrintJudgmentOrders.onError = function(exception)
{
	alert(Messages.ERR_RET_JUDGMENT_ORDER_OUTPUTS_MESSAGE);
}
