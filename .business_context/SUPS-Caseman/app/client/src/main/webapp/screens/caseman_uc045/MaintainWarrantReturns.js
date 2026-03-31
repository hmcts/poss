/** 
 * @fileoverview MaintainWarrantReturns.js:
 * This file contains the form and field configurations for the UC045 - Manage  
 * Warrant Returns screen.
 *
 * @author Tun Shwe, Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, convertToUpperStripped added to strip trailing and leading
 *				space as well as converting to upper case.  This is used for mandatory fields
 *				which cannot have whitespace as a value.
 * 07/08/2006 - Paul Robinson (Defect 4108) - allow CCBC legacy warrant numbers (format: XXnnnnn) to 
 * 				be included in validation criteria.
 * 18/08/2006 - Chris Vincent, updated the list of return codes which sets the default value for the Notice
 * 				check field to 'N' (UCT Defect 512).  In the process transformCodeToDisplay() was renamed
 * 				to getDefaultNoticeCheckForReturnCode and Add_Notice_Check.logic() was removed as it duplicated
 * 				the work.
 * 25/08/2006 - Paul Robinson (Defect 4219) Make Date Entered field read-only so that the server can populate new
 *				returns with the time-date stamp to allow for correct Report printout.
 * 01/09/2006 - Chris Vincent, updated requestReport() so call to runReport has a second parameter of false
 * 				meaning it will never exit the screen after running the report.  Defect 4509.
 * 02/10/2006 - Chris Vincent, fixed defect 5554 by updating the Add_Save_Btn.isEnabled() and actionBinding()
 * 				functions.  The functions now specifically test each field individually rather than allowing
 * 				the CaseManValidationHelper.validFields() to do it which can be unreliable.
 * 04/10/2006 - Chris Vincent, added functionality to allow double clicking on the warrant returns grid.  This
 * 				involved a change to the grid rowRenderingRule and the introduction of the superLogic GUI Adaptor
 * 				launchOutputLogic().
 * 11/10/2006 - Frederik Vandendriessche, Chris Vincent, UCT 512 - see the above.
 * 17/10/2006 - Chris Vincent, added helper functions validateTimeAt, transformToDisplayTime and transformToModelTime
 * 				which are used to convert the two time fields Details_AppointmentTime_Txt & Add_AppointmentTime_Txt
 * 				to seconds after midnight in the model and standard time format (hh:mm) for display.  Defect 5652.
 * 07/11/2006 - Chris Vincent, fixed Candidates for Build Z issue 190 by increasing the maximum length of the
 * 				read only Party For, Party Against 1 & Party Against 2 fields from 25 characters to 70.
 * 10/11/2006 - Chris Vincent, fixed UCT Defect 666 by ensuring that the Executing Court is not set to the user's
 * 				home court until AFTER the search is initiated when enter the screen.  This ensures the search
 * 				is not restricted to the user's home court.
 * 04/12/2006 - Chris Vincent, updated the Details_Verified_Date.validate function as comparison with Return Date
 * 				was incorrect.  Should be invalid if verified date is earlier than return date.  UT Defect 866.
 * 20/03/2007 - Chris Vincent, increased the maximum length of the Additional Details fields (Details_AdditionalDetails_Txt
 * 				and Add_AdditionalDetails_Txt) from 80 characters to 140 to match Legacy.  CaseMan defect 5997.
 * 21/03/2007 - Chris Vincent, change to SearchResultsLOVGrid.logic() to set the Executing Court Code of a warrant 
 * 				when selected in the search grid as may not always be the same value as the default user's home
 * 				court code.  CaseMan Defect 5985.
 * 22/03/2007 - Chris Vincent, added Details_CreatedBy_Txt.transformToDisplay() to display the User Alias instead
 * 				of the User Id if present in DCA_USER otherwise user id is displayed.  CaseMan Defect 6000.
 * 23/04/2007 - Frederik Vandendriessched, included 'AE' interim warrant output
 * 17/05/2007 - Chris Vincent, changes made to the enablement of the Add button so is always enabled for Warrants owned
 * 				by CCBC.  UCT Group2 Defect 1327.
 * 30/05/2007 - Chris Vincent, issue identfied during WIT around the courts xpaths which couldn't deal with 
 * 				apostrophes in the court name.  Also upped the maxlength on Issuing Court Name from 25 to 70.
 * 22/08/2007 - Chris Vincent.  Fixed problem found whilst retesting Group2 Defect 5142.  Updated saveData() so that
 * 				the court code associated with the warrant return and the automatic case event is the issuing court
 * 				code of the warrant.  Needed for specific CCBC updates as previously was using home court of user.
 * 09/11/2007 - Chris Vincent, added call to CaseManUtils.clearNavigationLinks() in clearForm() which clears
 * 				any navigation stack and form parameters allowing the user to return back to the main menu
 * 				when click close immediately after.  UCT_Group2 Defect 1415.
 * 01/02/2008 - Chris Vincent, Change to Details_Verified_Date.validate() and Details_Error_Check.onSuccess() to prevent
 * 				screen crashes when a warrant return has no receipt date.  CaseMan Defect 6491
 * 22/02/2010 - Chris Vincent, change to SearchResultsLOVGrid.onSuccess() to clear the Oracle Report Court Code XPath
 *				when a new Warrant's details are loaded.  Trac 2849.
 * 29/07/2010 - Chris Vincent, change to Courts reference data service.  Courts not in service are required so method
 *				changed to getAllCourtsShort.  Executing Court fields filter out Courts not in service.  Trac 2050.
 * 21/02/2012 - Chris Vincent, change to exitScreen() to clear down the Oracle Report court code in /ds/var/app when 
 *				exit the screen.  Trac 4554.
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Warrant Number validation now uses common 
 *				CaseManValidationHelper.validateNewWarrantNumber function.
 * 11/12/2013 - Chris Vincent (Trac 5025). TCE changes mean where EXECUTION warrants are referenced, CONTROL warrants must be 
 *				processed in the same way as they are replacing EXECUTION warrants.
 * 14/10/2016 - Chris Vincent (Trac 5880). Added warning when party on case has requested confidentiality.
 */

/*****************************************************************************************************************
		FUNCTION CLASSES
*****************************************************************************************************************/

function Header_WarrantID_Txt() {}; // Header_WarrantID_Txt is a hidden field
function Header_ExecutingCourtId_Txt() {};
function Header_ExecutingCourtDescription_Txt() {};
function Header_WarrantNumber_Txt() {};
function Header_CaseNumber_Txt() {};
function Header_LocalNumber_Txt() {};
function Header_CO_Txt() {};
function Def_PartyFor_Txt() {};
function Def_PartyAgainst1_Txt() {};
function Def_PartyAgainst2_Txt() {};
function Def_IssuingCourtId_Txt() {};
function Def_IssuingCourtDescription_Txt() {};
function Def_WarrantType_Txt() {};
function Details_Results_Grid() {};
function Details_ReturnCode_Txt() {};
function Details_ReturnDescription_Txt() {};
function Details_ReturnCategory_Txt() {}; // Details_ReturnCategory_Txt is a hidden field
function Details_ReturnCourtCode_Txt() {}; // Details_ReturnCourtCode_Txt is a hidden field
function Details_Return_Date() {};
function Details_Code_Txt() {};
function Details_Return_Txt() {};
function Details_AdditionalDetails_Txt() {};
function Details_Notice_Check() {};
function Details_Defendant_Sel() {};
function Details_Verified_Date() {};
function Details_Error_Check() {}
function Details_Appointment_Date() {};
function Details_AppointmentTime_Txt() {};
function Details_CreatedBy_Txt() {};
function Details_Receipt_Date() {};
function Details_ToTransfer_Txt() {}; // Details_ToTransfer_Txt is a hidden field
function Details_WarrantID_Txt() {}; // Details_WarrantID_Txt is a hidden field
function Details_WarrantReturnsID_Txt () {}; // Details_WarrantReturnsID_Txt is a hidden field
function Details_ReturnType_Txt () {}; // Details_ReturnType_Txt is a hidden field
function CourtsLOVGrid() {};
function ReturnsLOVGrid() {};
function SearchResultsLOVGrid() {};
function Add_Return_Date() {};
function Add_Code_Txt() {};
function Add_CourtCode_Txt() {}; // Add_CourtCode_Txt is a hidden field
function Add_Return_Txt() {};
function Add_AdditionalDetails_Txt() {};
function Add_Notice_Check() {};
function Add_Defendant_Sel() {};
function Add_Verified_Date() {}; // Add_Verified_Date is a hidden field
function Add_Error_Check() {} // Add_Error_Check is a hidden field
function Add_Appointment_Date() {};
function Add_AppointmentTime_Txt() {};
function Add_CreatedBy_Txt() {}; // Add_CreatedBy_Txt is a hidden field
function Add_ExecutingCourtId_Txt() {}; // Add_ExecutingCourtId_Txt is a hidden field
function Add_Receipt_Date() {};
function Add_ToTransfer_Txt() {}; // Add_ToTransfer_Txt is a hidden field
function Add_WarrantID_Txt() {}; // Add_WarrantID_Txt is a hidden field
function Add_WarrantReturnsID_Txt () {}; // Add_WarrantReturnsID_Txt is a hidden field
function Warrant_Returns_Popup() {};	// Add Warrant Return Popup

/******************************* CONSTANTS ****************************************/

var warrantID;
var warrantNumber;
var localNumber;
var caseNumber;
var executedBy;
var count = 0;
var selectedResultRow = null;

var RETURN_CODES_XPATH = "/ds/WarrantCodes";
var WARRANT_XPATH = "/ds/Warrants/Warrant";
var WARRANT_EVENTS_XPATH = "/ds/WarrantReturns/WarrantEvents";
var VAR_APP_XPATH = "/ds/var/app";
var VAR_FORM_XPATH = "/ds/var/form";
var VAR_PAGE_XPATH = "/ds/var/page";
var LOV_WARRANT_EVENTS_XPATH = VAR_PAGE_XPATH + "/Temp/NewWarrantReturn/WarrantEvents/WarrantEvent";
var REF_DATA_XPATH = VAR_FORM_XPATH + "/ReferenceData";
var SEARCH_RESULTS_XPATH = VAR_PAGE_XPATH + "/tmp/Warrants";
var SYSTEMDATE_XPATH = REF_DATA_XPATH + "/SystemDate";
var GRID_REFRESH = "/ds/GridRefresh";
var HAS_WARRANT_RETURNS = "/ds/HasWarrantReturns";
var CALL_FROM_MQW	= "/ds/CallFromMaintainQuery";
var DISABLE_HEADER_PANEL = "/ds/EnableHeaderPanel";
var CHANGES_MADE_XPATH = VAR_PAGE_XPATH + "/ChangesMade";
var CCBC_WARRANT_XPATH = WARRANT_XPATH + "/CCBCWarrant";
var INITIALISE_WARRANT_XPATH = "/ds/Warrant";

// Dirty Flag for navigating away after saving
var ACTION_RELOAD = "RELOAD";
var ACTION_NAVIGATE = "NAVIGATE";
var ACTION_CLEARFORM = "CLEAR_FORM";
var ACTION_EXIT = "EXIT_SCREEN";
var ACTION_AFTER_SAVE = ACTION_RELOAD;

/***************************** DATA BINDINGS **************************************/

Header_WarrantID_Txt.dataBinding = 					WARRANT_XPATH + "/WarrantID";
Header_ExecutingCourtId_Txt.dataBinding = 			WARRANT_XPATH + "/ExecutedBy";
Header_ExecutingCourtDescription_Txt.dataBinding = 	WARRANT_XPATH + "/ExecutedByName";
Header_WarrantNumber_Txt.dataBinding = 				WARRANT_XPATH + "/WarrantNumber";
Header_CaseNumber_Txt.dataBinding =					WARRANT_XPATH + "/CaseNumber";
Header_LocalNumber_Txt.dataBinding = 				WARRANT_XPATH + "/LocalNumber";
Header_CO_Txt.dataBinding = 						WARRANT_XPATH + "/CONumber";
Def_IssuingCourtId_Txt.dataBinding = 				WARRANT_XPATH + "/IssuedBy";
Def_IssuingCourtDescription_Txt.dataBinding = 		WARRANT_XPATH + "/IssuedByName";
Def_WarrantType_Txt.dataBinding = 					WARRANT_XPATH + "/WarrantType";
Def_PartyFor_Txt.dataBinding =						"/ds/PartyFor";
Def_PartyAgainst1_Txt.dataBinding = 				"/ds/PartyAgainst1";
Def_PartyAgainst2_Txt.dataBinding = 				"/ds/PartyAgainst2" ;
Details_Results_Grid.dataBinding = 					VAR_PAGE_XPATH + "/ResultsGrid/SelectedParty";
Details_ReturnCode_Txt.dataBinding = 				VAR_PAGE_XPATH + "/SelectedCode";
Details_ReturnDescription_Txt.dataBinding = 		VAR_PAGE_XPATH + "/SelectedDesc";
Details_ReturnCategory_Txt.dataBinding = 			RETURN_CODES_XPATH + "/WarrantCode[./Code=" + Details_ReturnCode_Txt.dataBinding + "]/Category";
Details_ReturnCourtCode_Txt.dataBinding = 			RETURN_CODES_XPATH + "/WarrantCode[./Code=" + Details_ReturnCode_Txt.dataBinding + "]/CourtCode";
Details_Return_Date.dataBinding = 					WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ReturnDate";
Details_Code_Txt.dataBinding = 						WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/Code";
Details_Return_Txt.dataBinding = 					WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ReturnText";
Details_AdditionalDetails_Txt.dataBinding =		 	WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AdditionalDetails";
Details_Notice_Check.dataBinding = 					WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/Notice";
Details_Defendant_Sel.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/Defendant";
Details_Verified_Date.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/Verified";
Details_Error_Check.dataBinding = 					WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/Error";
Details_Appointment_Date.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AppointmentDate";
Details_AppointmentTime_Txt.dataBinding = 			WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AppointmentTime";
Details_CreatedBy_Txt.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/CreatedBy";
Details_Receipt_Date.dataBinding = 					WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ReceiptDate";
Details_ToTransfer_Txt.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ToTransfer";
Details_WarrantID_Txt.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/WarrantID";
Details_WarrantReturnsID_Txt.dataBinding = 			WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/WarrantReturnsID";
Details_ReturnType_Txt.dataBinding = 				WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ReturnType";
CourtsLOVGrid.dataBinding = 						VAR_FORM_XPATH + "/LOVSubForms/SelectedCourt";
ReturnsLOVGrid.dataBinding = 						Details_ReturnCode_Txt.dataBinding;
SearchResultsLOVGrid.dataBinding = 					VAR_PAGE_XPATH + "/ds/var/page/SelectedGridRow/SelectedWarrant";
Add_Return_Date.dataBinding = 						LOV_WARRANT_EVENTS_XPATH + "/ReturnDate";
Add_Code_Txt.dataBinding = 							LOV_WARRANT_EVENTS_XPATH + "/Code";
Add_CourtCode_Txt.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/CourtCode";
Add_Return_Txt.dataBinding = 						LOV_WARRANT_EVENTS_XPATH + "/ReturnText";
Add_AdditionalDetails_Txt.dataBinding = 			LOV_WARRANT_EVENTS_XPATH + "/AdditionalDetails";
Add_Notice_Check.dataBinding = 						LOV_WARRANT_EVENTS_XPATH + "/Notice";
Add_Defendant_Sel.dataBinding =		 				LOV_WARRANT_EVENTS_XPATH + "/Defendant";
Add_Verified_Date.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/Verified";
Add_Error_Check.dataBinding = 						LOV_WARRANT_EVENTS_XPATH + "/Error";
Add_Appointment_Date.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/AppointmentDate";
Add_AppointmentTime_Txt.dataBinding = 				LOV_WARRANT_EVENTS_XPATH + "/AppointmentTime";
Add_CreatedBy_Txt.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/CreatedBy";
Add_ExecutingCourtId_Txt.dataBinding =				LOV_WARRANT_EVENTS_XPATH + "/ExecutedBy";
Add_Receipt_Date.dataBinding = 						LOV_WARRANT_EVENTS_XPATH + "/ReceiptDate";
Add_ToTransfer_Txt.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/ToTransfer";
Add_WarrantID_Txt.dataBinding = 					LOV_WARRANT_EVENTS_XPATH + "/WarrantID";
Add_WarrantReturnsID_Txt.dataBinding = 				LOV_WARRANT_EVENTS_XPATH + "/WarrantReturnsID";

/****************************** MAIN FORM *****************************************/

function MaintainWarrantReturns () {};

// Load the reference data from the XML into the model
MaintainWarrantReturns.refDataServices = [ 
	{name: "Courts", dataBinding: REF_DATA_XPATH, serviceName: "getAllCourtsShort", serviceParams: []}, 
	{name: "NonWorkingDays", dataBinding: REF_DATA_XPATH, serviceName: "getNonWorkingDays", serviceParams:[]}, 
	{name: "SystemDate", dataBinding: REF_DATA_XPATH, serviceName: "getSystemDate", serviceParams: []}
];

/**
 * @author jz89bc
 * 
 */
MaintainWarrantReturns.initialise = function()
{
	Services.startTransaction();
	Services.setValue(Header_CO_Txt.dataBinding, "");
	Services.setValue(Header_LocalNumber_Txt.dataBinding, "");
	Services.setValue(CHANGES_MADE_XPATH, "N");
	Services.endTransaction();
		
	var warrantID = Services.getValue(WarrantReturnsParams.WARRANT_ID);
	if ( !CaseManUtils.isBlank(warrantID) ) 
	{
		Services.setValue(CALL_FROM_MQW, "Y");
		var params = new ServiceParams();
		params.addSimpleParameter("warrantID", warrantID );
		Services.callService("getWarrant", params, Header_Search_Btn, true);
	}
	else
	{
		// Get external Case and CO Numbers
		var caseNumber = Services.getValue(WarrantReturnsParams.CASE_NUMBER);
		var coNumber = Services.getValue(WarrantReturnsParams.CO_NUMBER);
		var blnSearch = false;
		
		if ( !CaseManUtils.isBlank(caseNumber) )
		{
			Services.setValue(Header_CaseNumber_Txt.dataBinding, caseNumber);
			blnSearch = true;
		}
		if ( !CaseManUtils.isBlank(coNumber) )
		{
			Services.setValue(Header_CO_Txt.dataBinding, coNumber);
			blnSearch = true;
		}
		
		// Perform a search on the parameters passed in (if any)
		if ( blnSearch ) 
		{
			Header_Search_Btn.actionBinding(); 
		}
	}
	
	// UCT Defect 666 - move this code to set the Executing Court AFTER the search is initiated like the
	// Maintain Warrants screen so the executing court is not restricted to the User's Home Court.
	// Set the Owning Court
	Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
}

/**
 * @author jz89bc
 * @return "Header_ExecutingCourtId_Txt"  
 */
MaintainWarrantReturns.nextFocusedAdaptorId = function() 
{
	return "Header_ExecutingCourtId_Txt";
}

/****************************** SUBFORMS *****************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/*************************** HELPER FUNCTIONS *************************************/

/** 
 * reportRDFName will have one of the following values depending on the report being executed: 
 * CM_WRR.rdf, CM_WRR_147.rdf or CM_WRRI.rdf
 * @param reportRDFName
 * @author jz89bc
 * @return Id = Services.getValue(Details_WarrantReturnsID_Txt.dataBinding)  
 */
function requestReport(reportRDFName)
{
	var dom = Reports.createReportDom(reportRDFName);
	Reports.setValue(dom, "P_WARRANT_NUMBER", Services.getValue(Header_WarrantNumber_Txt.dataBinding));
	var returnId = Services.getValue(Details_WarrantReturnsID_Txt.dataBinding);
	Reports.setValue(dom, "P_WARRANT_RETURNS_ID", Services.getValue(Details_WarrantReturnsID_Txt.dataBinding));
	Reports.setValue(dom, "P_RETURN_CODE", Services.getValue(Details_Code_Txt.dataBinding));
	Reports.runReport(dom, false);
}

/**********************************************************************************/

/**
 * Logic to detect when (non-read-only) fields have been updated so the user can be prompted to
 * Save when navigating away from the screen
 * @author jz89bc
 * 
 */
function updateDetailsLogic() {};

updateDetailsLogic.logicOn = [Details_AdditionalDetails_Txt.dataBinding, Details_Notice_Check.dataBinding, Details_Verified_Date.dataBinding, Details_Error_Check.dataBinding, Details_Appointment_Date.dataBinding, Details_AppointmentTime_Txt.dataBinding];
updateDetailsLogic.logic = function(event)
{
	if ( Services.getValue(CHANGES_MADE_XPATH) == "Y" || 
		event.getXPath() == "/" || event.getType() != DataModelEvent.UPDATE )
	{
		return;
	}
	
	// Check the correct input has called this function
	var validInput = false;
	for (var i = 0; i < updateDetailsLogic.logicOn.length; i++)
	{
		if (event.getXPath() == updateDetailsLogic.logicOn[i])
		{
			validInput = true;
			break;
		}
	}
	
	// Check if fields are updated
	if (!validInput)
	{
		return;
	}
	
	Services.setValue(CHANGES_MADE_XPATH, "Y");
}

/**********************************************************************************/

/**
 * @author jz89bc
 * 
 */
function loadReturnCodes()
{
	var params = new ServiceParams();
	var courtCode = Services.getValue(Header_ExecutingCourtId_Txt.dataBinding);
	// courtCode will not be populated for this screen when navigated to from another screen
	if (CaseManUtils.isBlank(courtCode))
	{
		courtCode = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
	}
	params.addSimpleParameter("courtCode", courtCode);
	Services.callService("getWarrantCodes", params, loadReturnCodes, true);
}

/**
 * @param resultDom
 * @author jz89bc
 * 
 */
loadReturnCodes.onSuccess = function(resultDom)
{
	var results = resultDom.selectSingleNode(RETURN_CODES_XPATH);
	if ( null != results )
	{
		Services.replaceNode(RETURN_CODES_XPATH, results);
	}
}

/**********************************************************************************/

/**
 * @author jz89bc
 * 
 */
function clearForm()
{
	Services.startTransaction();
	Services.removeNode(RETURN_CODES_XPATH);
	Services.removeNode(WARRANT_XPATH);
	Services.removeNode(WARRANT_EVENTS_XPATH);
	Services.removeNode("/ds/Warrants");
	Services.removeNode("/ds/WarrantReturns");
	Services.removeNode(VAR_PAGE_XPATH + "/DefendantsList");
	Services.removeNode(VAR_PAGE_XPATH + "/PartyAgainstList");
	Services.removeNode(WarrantReturnsParams.PARENT);
	Services.removeNode("/ds/var/app/CaseData");
	Services.setValue(SearchResultsLOVGrid.dataBinding, "");
	Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH));
	Services.setValue(Header_WarrantNumber_Txt.dataBinding, "");
	Services.setValue(Header_CaseNumber_Txt.dataBinding, "");
	Services.setValue(Header_LocalNumber_Txt.dataBinding, "");
	Services.setValue(Header_CO_Txt.dataBinding, "");
	Services.setValue(Def_IssuingCourtId_Txt.dataBinding, "");
	Services.setValue(Def_IssuingCourtDescription_Txt.dataBinding, "");
	Services.setValue(Def_WarrantType_Txt.dataBinding, "");	
	Services.setValue(Def_PartyFor_Txt.dataBinding, "");
	Services.setValue(Def_PartyAgainst1_Txt.dataBinding, "");
	Services.setValue(Def_PartyAgainst2_Txt.dataBinding, "");
	Services.setValue(Details_ReturnCode_Txt.dataBinding, "");
	Services.setValue(Details_ReturnDescription_Txt.dataBinding, "");
	Services.setValue(CHANGES_MADE_XPATH, "N");
	Services.setValue(CALL_FROM_MQW, "");
	Services.setValue(DISABLE_HEADER_PANEL, "");
	Services.setFocus("Header_ExecutingCourtId_Txt");
	
	// Reset the navigation links
	CaseManUtils.clearNavigationLinks();
	
	Services.endTransaction();
	count = 0;
}

/**********************************************************************************/

/**
 * @author jz89bc
 * @return CodeCourt = Services.getValue(Details_ReturnCourtCode_Txt.dataBinding) , CodeCourt)  
 */
function saveData()
{
	Services.startTransaction();
	
	// Set Return Code Court Code if blank
	if ( CaseManUtils.isBlank(Services.getValue(Add_CourtCode_Txt.dataBinding)) )
	{
		var returnCodeCourt = Services.getValue(Details_ReturnCourtCode_Txt.dataBinding);
		Services.setValue(Add_CourtCode_Txt.dataBinding, returnCodeCourt);
	}
	
	// Set Additional Details field to default if blank
	if ( CaseManUtils.isBlank(Services.getValue(Add_AdditionalDetails_Txt.dataBinding)) )
	{
		Services.setValue(Add_AdditionalDetails_Txt.dataBinding, "");
	}

	// Set Verified field to blank string if empty
	if ( CaseManUtils.isBlank(Services.getValue(Add_Verified_Date.dataBinding)) )
	{
		Services.setValue(Add_Verified_Date.dataBinding, "");
	}

	// Set Error field to default if blank
	if ( CaseManUtils.isBlank(Services.getValue(Add_Error_Check.dataBinding)) )
	{
		Services.setValue(Add_Error_Check.dataBinding, "N");
	}

	// Set To Transfer field (if CCBC Court and CCBC is a Non SUPS court and the Warrant Type is 'EXECUTION' or 'CONTROL'
	// set the Warrant Return To Transfer to '1', else '0' and let the custom processor handle it).
	var CCBCCourt = Services.getValue(CCBC_WARRANT_XPATH);
	var isSUPSCourt = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Code = " + Def_IssuingCourtId_Txt.dataBinding + "]/SUPSCourt");
	var warrantType = Services.getValue(Def_WarrantType_Txt.dataBinding);
	var toTransfer = ( CCBCCourt == "Y" && isSUPSCourt == "N" && (warrantType == "EXECUTION" || warrantType == "CONTROL") ) ? "1" : "0";
	Services.setValue(Add_ToTransfer_Txt.dataBinding, toTransfer);

	// Set Executing Court Code field  (will be owning court code of automatic case event and also the warrant return)
	// Group2 Defect 5142
	var issuingCourtId =  Services.getValue(Def_IssuingCourtId_Txt.dataBinding);
	Services.setValue(Add_ExecutingCourtId_Txt.dataBinding, issuingCourtId);

	// Set Created By field
	var username = Services.getCurrentUser();
	Services.setValue(LOV_WARRANT_EVENTS_XPATH + "/CreatedBy", username);

	// Set Case Number field if not blank
	var caseNumber = Services.getValue(Header_CaseNumber_Txt.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		Services.setValue(LOV_WARRANT_EVENTS_XPATH + "/CaseNumber", caseNumber);
	}
	
	// Set CO Number field if not blank
	var coNumber = Services.getValue(Header_CO_Txt.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) )
	{
		Services.setValue(LOV_WARRANT_EVENTS_XPATH + "/CoNumber", coNumber);
	}
	
	// Set Local Number field if not blank (if present, a case event will not be created)
	var localNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
	if ( !CaseManUtils.isBlank(localNumber) )
	{
		Services.setValue(LOV_WARRANT_EVENTS_XPATH + "/LocalNumber", localNumber);
	}

	var newDOM = XML.createDOM(null, null, null);
	var dsNode = XML.createElement(newDOM, "ds");
	var newReturn = Services.getNode(VAR_PAGE_XPATH + "/Temp/NewWarrantReturn/WarrantEvents");
	dsNode.appendChild( XML.createElement(newDOM, "WarrantReturns") ).appendChild(newReturn);
	newDOM.appendChild(dsNode);
	
	var params = new ServiceParams();
	params.addDOMParameter("NewReturn", newDOM);
	Services.callService("insertWarrantReturns", params, saveData, true);
	Services.dispatchEvent("Warrant_Returns_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	Services.setValue(Details_ReturnCode_Txt.dataBinding, "");		
	Services.endTransaction();
}

/**
 * @param resultDom
 * @author jz89bc
 * 
 */
saveData.onSuccess = function(resultDom) {
	var code = XML.getNodeTextContent(resultDom.selectSingleNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent/Code"));
	var warrantNumber = Services.getValue(Header_WarrantNumber_Txt.dataBinding);	
	var wpReturnCode = null;
	if ("FN" == code || "NV" == code || "NP" == code || "NE" == code || "AE" == code || "AI" == code || "AX" == code || "AY" == code) {
		wpReturnCode = "0-InterimReturn-"+code; }
	else if ("159" == code || "160" == code || "DO" == code) {
		wpReturnCode = "0-FinalReturn-"+code; }
	else { /** nothing to do for this type of return code **/ }
	if (null != wpReturnCode) {	
		var partyAgainstNumber = Services.getValue(Add_Defendant_Sel.dataBinding);
		var welshParties = Services.getValue("/ds/AdditionalInfo/WelshParties");
		var wpXML= XML.createDOM(null, null, null);
		wpXML.loadXML("<WordProcessing><Request></Request><Case><CaseNumber></CaseNumber>"+
							"<WarrantId>"+warrantID+"</WarrantId>"+
							"<PartyAgainstNumber>"+partyAgainstNumber+"</PartyAgainstNumber>"+
							"<WelshTranslation>"+welshParties+"</WelshTranslation>"+
							"</Case><Event><StandardEventId></StandardEventId>"+
							"<CaseEventSeq></CaseEventSeq><WarrantReturnsId></WarrantReturnsId></Event></WordProcessing>");
		var caseEventSqnc = "";
		var caseEventSequenceNode = resultDom.selectSingleNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent/CaseEventSeq");
		if(caseEventSequenceNode != null) {
			caseEventSqnc = XML.getNodeTextContent(caseEventSequenceNode); }			
		var warrantReturnsId = "";
		var warrantReturnsIdNode = resultDom.selectSingleNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent/WarrantReturnsID");
		if(null != warrantReturnsIdNode) {
			warrantReturnsId = XML.getNodeTextContent(warrantReturnsIdNode); }			
		var wpNode = wpXML.selectSingleNode("/WordProcessing");
		XML.setElementTextContent( wpNode, "Request", "Create" );
		XML.setElementTextContent( wpNode, "./Case/CaseNumber",XML.getNodeTextContent(resultDom.selectSingleNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent/CaseNumber")) );
		XML.setElementTextContent( wpNode, "./Event/StandardEventId", wpReturnCode);
		XML.setElementTextContent( wpNode, "./Event/CaseEventSeq", caseEventSqnc);
		XML.setElementTextContent( wpNode, "./Event/WarrantReturnsId", warrantReturnsId);
		WP.ProcessWP(FormController.getInstance(), wpXML, NavigationController.WARRANT_RETURNS_FORM, true);	}
	else { /** If not calling word processing, call retrieval service **/
		var params = new ServiceParams();
		params.addSimpleParameter("warrantID", warrantID);
		Services.callService("getWarrantReturns", params, SearchResultsLOVGrid, true); } }

/**********************************************************************************/

/**
 * @author jz89bc
 * 
 */
function exitScreen()
{
	// Clear screen's parameters and exit the screen
	Services.removeNode(WarrantReturnsParams.PARENT);
	Services.removeNode(CaseManFormParameters.OR_COURT_CODE_XPATH);
	if ( NavigationController.callStackExists() )
	{
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**********************************************************************************/
/**
 * Checks whether changes have been made since the last save
 * Returns true if changes have been made, else false
 * @author jz89bc
 * @return ( Services.getValue(CHANGES_MADE_XPATH) == "Y" )  
 */
function changesMade()
{
	return ( Services.getValue(CHANGES_MADE_XPATH) == "Y" );
}

/**********************************************************************************/
/**
 * Ensures that the user is notified of unsaved changes before exiting the screen
 * @author jz89bc
 * 
 */
function checkChangesMadeBeforeExit()
{
	if ( changesMade() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_Save_Btn.actionBinding();
	}
	else
	{
		exitScreen();
	}
}

/**********************************************************************************/
/**
 * Ensures the correct party name is assigned to the parties on the case
 * @param warrantId
 * @author jz89bc
 * 
 */
function addClaimaintsDefendants(warrantId)
{
	Services.removeNode("/ds/var/page/DefendantsList");
	var claimant = Services.getNodes(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + warrantId + "']/Claimant");
	var defendants1 = Services.getNodes(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + warrantId + "']/Defendant1");
	var defendants2 = Services.getNodes(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + warrantId + "']/Defendant2");
	
	for(var i = 0; i < claimant.length; i++) 
	{
		var cName = XML.getNodeTextContent(claimant[i].selectSingleNode("Name"));
		if (!CaseManUtils.isBlank(cName))
		{
			Services.setValue(Def_PartyFor_Txt.dataBinding, cName);
		}
	}
	
	for(var i = 0; i < defendants1.length; i++) 
	{
		var d1Name = XML.getNodeTextContent(defendants1[i].selectSingleNode("Name"));
		if (!CaseManUtils.isBlank(d1Name))
		{
			Services.setValue(Def_PartyAgainst1_Txt.dataBinding, d1Name);
		}
	}
	
	for(var i = 0; i < defendants2.length; i++) 
	{
		var d2Name = XML.getNodeTextContent(defendants2[i].selectSingleNode("Name"));
		if (!CaseManUtils.isBlank(d2Name))
		{
			Services.setValue(Def_PartyAgainst2_Txt.dataBinding, d2Name);
		}
	}
}

/**********************************************************************************/
/**
 * Ensures that the correct party number is assigned to Party Against members
 * @param warrantId
 * @author jz89bc
 * 
 */
function populatePartyAgainstList(warrantId)
{
	Services.removeNode(VAR_PAGE_XPATH + "/PartyAgainstList");
	var defendants1 = Services.getNodes(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + warrantId + "']/Defendant1");
	var defendants2 = Services.getNodes(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + warrantId + "']/Defendant2");	

	for (var i = 0; i < defendants1.length; i++) 
	{
		var def1 = XML.getNodeTextContent(defendants1[i].selectSingleNode("Number"));
		var nameCheck = XML.getNodeTextContent(defendants1[i].selectSingleNode("Name"));
		if (!CaseManUtils.isBlank(def1))
		{
			// Need to set number to 1 if it's blank, because it's the key for the Defendant selection box
			if (def1 != "1")
			{
				defendants1[i].selectSingleNode("Number").text = "1";
			}
			
			var clonedNode = defendants1[i].cloneNode(true);
			Services.addNode(clonedNode, VAR_PAGE_XPATH + "/PartyAgainstList");
		}
		// For foreign warrants, number is blank but name is populated. Need to ensure a number (1) is assigned
		else if (!CaseManUtils.isBlank(nameCheck))
		{
			defendants1[i].selectSingleNode("Number").text = "1";
			var clonedNode = defendants1[i].cloneNode(true);
			Services.addNode(clonedNode, VAR_PAGE_XPATH + "/PartyAgainstList");
		}
	}

	for (var i = 0; i < defendants2.length; i++) 
	{
		var def2 = XML.getNodeTextContent(defendants2[i].selectSingleNode("Number"));
		var nameCheck = XML.getNodeTextContent(defendants2[i].selectSingleNode("Name"));
		if (!CaseManUtils.isBlank(def2))
		{
			// Need to set number to 2 if it's blank, because it's the key for the Defendant selection box
			if (def2 != "2")
			{
				defendants2[i].selectSingleNode("Number").text = "2";
			}
			
			var clonedNode = defendants2[i].cloneNode(true);
			Services.addNode(clonedNode, VAR_PAGE_XPATH + "/PartyAgainstList");
		}
		// For foreign warrants, number is blank but name is populated. Need to ensure a number (2) is assigned
		else if (!CaseManUtils.isBlank(nameCheck))
		{
			defendants2[i].selectSingleNode("Number").text = "2";
			var clonedNode = defendants2[i].cloneNode(true);
			Services.addNode(clonedNode, VAR_PAGE_XPATH + "/PartyAgainstList");
		}
	}
}

/**********************************************************************************/

/**
 * @author jz89bc
 * @return !( (CaseManUtils.isBlank(callFromMQW) || callFromMQW == "N") && (CaseManUtils.isBlank(disableHeaderPanel) || disableHeaderPanel == "N") )  
 */
function setReadOnly()
{
	var callFromMQW = Services.getValue(CALL_FROM_MQW);
	var disableHeaderPanel = Services.getValue(DISABLE_HEADER_PANEL);
	return !( (CaseManUtils.isBlank(callFromMQW) || callFromMQW == "N") && (CaseManUtils.isBlank(disableHeaderPanel) || disableHeaderPanel == "N") );
}

/**********************************************************************************/

/**
 * @param value
 * @author jz89bc
 * @return (value != null) ? value.toUpperCase(), null  
 */
function toUpperCase(value) 
{
	return (value != null) ? value.toUpperCase() : null;		
}

/*********************************************************************************/

/**
 * Function converts a string to upper case and strips out trailing and leading spaces.
 * Used for mandatory fields.
 *
 * @param [String] The string to be converted to upper case
 * @return [String] The converted string
 * @author jz89bc
 */
function convertToUpperStripped(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/**********************************************************************************/

/**
 * @param value
 * @author jz89bc
 * @return Services.getValue(VAR_PAGE_XPATH + "/PartyAgainstList/Defendant" + value + "/Name")  
 */
function toDefendantName(value)
{
	return Services.getValue(VAR_PAGE_XPATH + "/PartyAgainstList/Defendant" + value + "/Name");
}

/**********************************************************************************/

/**
 * Different warrant return codes set the Notice Checkbox field to either 'Y' or 'N'
 * This function determines what the default value should be for the current return
 * code being created.
 * 
 * @return [String] The default value for the Notice Checkbox (Y or N)
 * @author jz89bc
 */
function getDefaultNoticeCheckForReturnCode() 
{
	// Some Warrant Return Codes should set the default value for the Notice Check field to 'N', others to 'Y'
	var defaultNList = ["140","141","146","150","157","158","159","160","LC","LD","AY","AX","AI","NE","FE","DO","FN","NP","NV"];
	var defaultValue = "Y";
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	for ( var i=0, l=defaultNList.length; i<l; i++ )
	{
		if ( returnCode == defaultNList[i] )
		{
			defaultValue = "N";
			break;
		}
	}
	return defaultValue;
}

/**********************************************************************************/

/**
 * @param date
 * @author jz89bc
 * @return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg") , null  
 */
function validateNonWorkingDate(date) 
{
	if ( Services.exists(REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") )
	{
		return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
	}
	return null;
}

/**********************************************************************************/

/**
 * Function checks that a time passed in in the correct format. Added as part of fix for Defect 5652
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return ErrorCode The error code if the time passed in is invalid else null
 * @author Chris Vincent
 */
function validateTimeAt(pTime, validTimeFlagXPath)
{
	if ( null == validTimeFlagXPath )
	{
		return null;
	}
	
	if(Services.getValue(validTimeFlagXPath) == "N")
	{
		return ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
	}
	
	// To get to this point, we know that validTimeFlagXPath is Y so has passed
	// the time format validation in the TransformToModel
	var errCode = null;
	if ( !CaseManUtils.isBlank(pTime) )
	{
		// The value put in the dom is supposed to be a number, so first check if it is numeric
		var validSeconds = pTime.search(/^\d+$/);
		if ( validSeconds != 0 )
		{
			// If the is number validation fails, we know the validate function has been called from
			// the setting of the validTimeFlagXPath (see validateOn[] config).
			// We know it is in a valid time format, but need to convert the value to a number for
			// validation purposes.
			pTime = CaseManUtils.convertTimeToSeconds(pTime);
		}
		
		// If it is numeric, check that it is within a valid range
		if ( pTime < 0 || pTime > 86400 )
		{
			errCode = ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
		}
	}
	return errCode;	
}

/**********************************************************************************/

/**
 * This method ensures a time is transformed so that it can be validated correctly.
 * If the pTime param is not a valid time then the method stores the incorrect value to the DOM
 * If an invalid time is entered, a flag is set at the xpath sent in as can be one of potentially
 * multiple hearings or even a new hearing. Added as part of fix for Defect 5652
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return string The time converted to seconds or the time as it was passed in if invalid
 * @author Chris Vincent
 */
function transformToModelTime(pTime, validTimeFlagXPath)
{
	var validTimeInd = "N";
	var returnValue = pTime;
	if ( null != pTime )
	{
		if ( CaseManValidationHelper.validateTime(pTime) )
		{
			// Valid time format, convert the time to seconds after midnight
			validTimeInd = "Y";
			returnValue = CaseManUtils.convertTimeToSeconds(pTime);
		}
		else if ( pTime == 0 )
		{
			// Invalid time which meets the 0 value anomaly, store a non numeric string instead 
			// of 0 which force the validate and transform to display to fire when a valid time
			// is entered.
			returnValue = "00_00";
		}
	}
	
	// Set the hearing time valid flag and return the appropriate value for the model
	Services.setValue(validTimeFlagXPath, validTimeInd);
	return returnValue;
}

/**********************************************************************************/
	
/**
 * This method ensures a time is transformed from the DOM to display correctly.
 * Even if invalid must be displayed as the user entered. Added as part of fix for Defect 5652
 *
 * @param string pTime The time to be checked
 * @param string validTimeFlagXPath The xpath to the ValidTime node for the current Hearing
 * @return string The time converted from seconds to time or as it was passed in if invalid
 * @author Chris Vincent
 */
function transformToDisplayTime(pTime, validTimeFlagXPath)
{	
	if ( Services.getValue(validTimeFlagXPath) == "N" )
	{
		// If the time entered is not valid, check for the value stored when a 
		// variation of 0 is entered (due to problems comparing 00.00 to 0
		return ( pTime == "00_00" ) ? "00.00" : pTime;
	}
	
	if ( null != pTime && !isNaN(pTime) )
	{
		var convertedTime = CaseManUtils.convertSecondsToTime(pTime);
		if ( null != convertedTime )
		{
			if ( CaseManValidationHelper.validateTime(convertedTime) )
			{
				// Only return a converted time if it is a valid time
				return convertedTime;
			}
		}
	}
	return pTime;
}

/*****************************************************************************************************************
																				WARRANT HEADER PANEL FUNCTIONS
*****************************************************************************************************************/

Header_ExecutingCourtId_Txt.tabIndex = 1;
Header_ExecutingCourtId_Txt.maxLength = 3;
Header_ExecutingCourtId_Txt.componentName = "Executing Court ID";
Header_ExecutingCourtId_Txt.helpText = "Executing Court Code";
Header_ExecutingCourtId_Txt.transformToDisplay = toUpperCase;
Header_ExecutingCourtId_Txt.transformToModel = toUpperCase;
Header_ExecutingCourtId_Txt.readOnlyOn = [CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_ExecutingCourtId_Txt.isReadOnly = setReadOnly;
Header_ExecutingCourtId_Txt.isTemporary = function() { return true; }
Header_ExecutingCourtId_Txt.isMandatory = function() { return true; }

Header_ExecutingCourtId_Txt.logicOn = [Header_ExecutingCourtId_Txt.dataBinding];
Header_ExecutingCourtId_Txt.logic = function()
{
	Services.startTransaction();
	
	if(this.getValid()) 
	{
		var value = Services.getValue(this.dataBinding)
		Services.setValue(Header_ExecutingCourtDescription_Txt.dataBinding, value);
	}

	Services.endTransaction();
}

Header_ExecutingCourtId_Txt.validate = function()
{
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Code=" + this.dataBinding + " and ./InService = 'Y']/Name");
	if (courtName == null || value == CaseManUtils.CCBC_COURT_CODE) 
	{
		// The entered court code does not exist
		return ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	
	return null;	
}

/**********************************************************************************/

Header_ExecutingCourtDescription_Txt.srcData = REF_DATA_XPATH + "/Courts";
Header_ExecutingCourtDescription_Txt.rowXPath = "Court[./InService = 'Y']";
Header_ExecutingCourtDescription_Txt.keyXPath = "Code";
Header_ExecutingCourtDescription_Txt.displayXPath = "Name";
Header_ExecutingCourtDescription_Txt.strictValidation = true;
Header_ExecutingCourtDescription_Txt.tabIndex = 2;
Header_ExecutingCourtDescription_Txt.componentName = "Executing Court Name";
Header_ExecutingCourtDescription_Txt.helpText = "Executing Court Name";
Header_ExecutingCourtDescription_Txt.transformToDisplay = toUpperCase;
Header_ExecutingCourtDescription_Txt.transformToModel = toUpperCase;

Header_ExecutingCourtDescription_Txt.readOnlyOn = [Header_ExecutingCourtId_Txt.dataBinding, CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_ExecutingCourtDescription_Txt.isReadOnly = setReadOnly;
Header_ExecutingCourtDescription_Txt.isTemporary = function() { return true; }
Header_ExecutingCourtDescription_Txt.isMandatory = function() { return true; }

Header_ExecutingCourtDescription_Txt.logicOn = [Header_ExecutingCourtDescription_Txt.dataBinding];
Header_ExecutingCourtDescription_Txt.logic = function()
{
	Services.startTransaction();
	
	var value = Services.getValue(this.dataBinding);
	var courtName = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Code=" + this.dataBinding + " and ./InService = 'Y']/Name");
	if (courtName != null) 
	{
		// The entered value must be valid
		Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, value);
	}
	
	Services.endTransaction();
}

/**********************************************************************************/

function CourtsLOVButton() {};
CourtsLOVButton.tabIndex = 3;

CourtsLOVButton.enableOn = [Header_ExecutingCourtDescription_Txt.dataBinding, CALL_FROM_MQW, DISABLE_HEADER_PANEL];
CourtsLOVButton.isEnabled = function() 
{
	return !setReadOnly();
}

/**********************************************************************************/

Header_WarrantNumber_Txt.tabIndex = 4;
Header_WarrantNumber_Txt.maxLength = 8;
Header_WarrantNumber_Txt.componentName = "Warrant Number";
Header_WarrantNumber_Txt.helpText = "The number allocated to the warrant";
Header_WarrantNumber_Txt.transformToDisplay = toUpperCase;
Header_WarrantNumber_Txt.transformToModel = toUpperCase;
Header_WarrantNumber_Txt.readOnlyOn = [CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_WarrantNumber_Txt.isReadOnly = setReadOnly;
Header_WarrantNumber_Txt.isTemporary = setReadOnly;
Header_WarrantNumber_Txt.validate = function ()
{
    var ec = null;
    var warrantNumber =  Services.getValue(Header_WarrantNumber_Txt.dataBinding);
	var ecWarrant = CaseManValidationHelper.validateNewWarrantNumber(warrantNumber);
	var ecCCBC = CaseManValidationHelper.validateCCBCWarrantNumber(warrantNumber);
	if (ecWarrant != null && ecCCBC != null)
	{
		ec = ecWarrant;
	}
	return ec;
}

/**********************************************************************************/

Header_CaseNumber_Txt.tabIndex = 5;
Header_CaseNumber_Txt.maxLength = 8;
Header_CaseNumber_Txt.componentName = "Case Number";
Header_CaseNumber_Txt.helpText = "Number of the case on which this warrant exists";
Header_CaseNumber_Txt.transformToDisplay = toUpperCase;
Header_CaseNumber_Txt.transformToModel = toUpperCase;
Header_CaseNumber_Txt.readOnlyOn = [CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_CaseNumber_Txt.isReadOnly = setReadOnly;
Header_CaseNumber_Txt.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(Header_CaseNumber_Txt.dataBinding);
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		// Check if format of CaseNumber is correct
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);

	}
	return ec;
}

/**********************************************************************************/

Header_LocalNumber_Txt.tabIndex = 6;
Header_LocalNumber_Txt.maxLength = 8;
Header_LocalNumber_Txt.componentName = "Local Number";
Header_LocalNumber_Txt.helpText = "The unique number allocated to the foreign warrant";
Header_LocalNumber_Txt.transformToDisplay = toUpperCase;
Header_LocalNumber_Txt.transformToModel = toUpperCase;
Header_LocalNumber_Txt.readOnlyOn = [CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_LocalNumber_Txt.isReadOnly = setReadOnly;
Header_LocalNumber_Txt.validate = function ()
{
    var ec = null;
    var localWarrantNumber =  Services.getValue(Header_LocalNumber_Txt.dataBinding);		
    ec = CaseManValidationHelper.validateLocalWarrantNumber(localWarrantNumber);
    return ec;
}

/**********************************************************************************/

Header_CO_Txt.tabIndex = 7;
Header_CO_Txt.maxLength = 8;
Header_CO_Txt.componentName = "CO Number";
Header_CO_Txt.helpText = "The number of the consolidated order to which this warrant applies";
Header_CO_Txt.transformToDisplay = toUpperCase;
Header_CO_Txt.transformToModel = toUpperCase;
Header_CO_Txt.readOnlyOn = [CALL_FROM_MQW, DISABLE_HEADER_PANEL];
Header_CO_Txt.isReadOnly = setReadOnly;
Header_CO_Txt.validate = function()
{
   	var ec = null;
	var coNumber = Services.getValue(Header_CO_Txt.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) )
	{ 
		var coSearch = coNumber.search(CaseManValidationHelper.VALID_CONUMBER_PATTERN);
		if ( coSearch != 0 )
		{
			// Does not match any valid CO Number pattern
			ec = ErrorCode.getErrorCode("CaseMan_CO_invalidCONumberFormat_Msg");
		}
	}
	return ec;
}

/**********************************************************************************/

function Header_Search_Btn() {};
Header_Search_Btn.tabIndex = 8;

Header_Search_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "MaintainWarrantReturns" } ]
	}
};

Header_Search_Btn.enableOn = [Header_ExecutingCourtId_Txt.dataBinding, Header_ExecutingCourtDescription_Txt.dataBinding, CALL_FROM_MQW, DISABLE_HEADER_PANEL, Header_CO_Txt.dataBinding, Header_CaseNumber_Txt.dataBinding, Header_WarrantNumber_Txt.dataBinding, Header_LocalNumber_Txt.dataBinding];
Header_Search_Btn.isEnabled = function()
{
	//Expanded the number of validation in search button enablement
	//return ( !setReadOnly() && !CaseManUtils.isBlank(Services.getValue(Header_ExecutingCourtId_Txt.dataBinding)) );

    if ( setReadOnly() )
    {
      return false;
    }
    
    if ( CaseManUtils.isBlank(Services.getValue(Header_ExecutingCourtId_Txt.dataBinding)) )
    {
      return false;
    }
    
    if ( CaseManUtils.isBlank(Services.getValue(Header_ExecutingCourtDescription_Txt.dataBinding)) )
    {
      return false;
    }
    
    if (!Services.getAdaptorById("Header_ExecutingCourtId_Txt").getValid())
    {
        return false;
    }

    if (!Services.getAdaptorById("Header_ExecutingCourtDescription_Txt").getValid())
    {
        return false;
    }

    if (!Services.getAdaptorById("Header_CO_Txt").getValid())
    {
        return false;
    }
    
    if (!Services.getAdaptorById("Header_CaseNumber_Txt").getValid())
    {
        return false;
    }
        
    if (!Services.getAdaptorById("Header_WarrantNumber_Txt").getValid())
    {
        return false;
    }    
    if (!Services.getAdaptorById("Header_LocalNumber_Txt").getValid())
    {
        return false;
    }
   
    return true;

}

/**
 * @author jz89bc
 * 
 */
Header_Search_Btn.actionBinding = function()
{
	var warrantNumber = Services.getValue(Header_WarrantNumber_Txt.dataBinding);
	var warrantNumberParam = CaseManUtils.isBlank(warrantNumber) ? "" : warrantNumber;
	
	var localNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
	var localNumberParam = CaseManUtils.isBlank(localNumber) ? "" : localNumber;
	
	var caseNumber = Services.getValue(Header_CaseNumber_Txt.dataBinding);
	var caseNumberParam = CaseManUtils.isBlank(caseNumber) ? "" : caseNumber;
	
	var coNumber = Services.getValue(Header_CO_Txt.dataBinding);
	var coNumberParam = CaseManUtils.isBlank(coNumber) ? "" : coNumber;
	
	var executedBy = Services.getValue(Header_ExecutingCourtId_Txt.dataBinding);
	var executedByParam = CaseManUtils.isBlank(executedBy) ? "" : executedBy;
	
	var params = new ServiceParams();
	params.addSimpleParameter("warrantNumber", warrantNumberParam);
	params.addSimpleParameter("localNumber", localNumberParam);
	params.addSimpleParameter("caseNumber", caseNumberParam);
	params.addSimpleParameter("CONumber", coNumberParam);
	params.addSimpleParameter("executedBy", executedByParam);
	Services.callService("searchWarrants", params, Header_Search_Btn, true);
}

/**
 * @param resultDom
 * @author jz89bc
 * @return null, AgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]") , AgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]") , AgainstD2 ) 
 */
Header_Search_Btn.onSuccess = function(resultDom)
{
	if (resultDom != null) 
	{
		Services.startTransaction();
		
		// first see if this has been invoked via 'getWarrant' on initialise
		var node = resultDom.selectSingleNode(INITIALISE_WARRANT_XPATH);
		if (node != null ) 
		{
			Services.replaceNode(SEARCH_RESULTS_XPATH + "/Warrant", node);
		}
		else
		{
			// handle case where a search has been done on this screen
			var node = resultDom.selectSingleNode("/ds/Warrants");
			Services.replaceNode(SEARCH_RESULTS_XPATH, node);
		}
		
		count = Services.countNodes(SEARCH_RESULTS_XPATH + "/Warrant");
		if (count == 0) 
		{
			alert(Messages.NO_RESULTS_MESSAGE);
			Services.endTransaction();
			return;
		}
		
		// If result set is not empty, load return codes for the executing court
		loadReturnCodes();
		
		if (count == 1) 
		{
			// Set Warrant ID for global variable and form parameter if null (i.e. user came directly to this screen)
			warrantID = Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/WarrantID");
			Services.startTransaction();
			Services.setValue(WarrantReturnsParams.WARRANT_ID, warrantID);
			Services.setValue(Header_WarrantID_Txt.dataBinding, warrantID);
			Services.setValue(Header_WarrantNumber_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/WarrantNumber"));
			Services.setValue(Header_LocalNumber_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/LocalNumber"));
			Services.setValue(Header_CaseNumber_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/CaseNumber"));
			Services.setValue(Header_CO_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/CONumber"));
			Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/ExecutedBy"));
			Services.setValue(Def_IssuingCourtDescription_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/IssuedByName"));
			Services.setValue(Def_WarrantType_Txt.dataBinding, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/WarrantType"));
			Services.setValue(CCBC_WARRANT_XPATH, Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/CCBCWarrant") );
			Services.setValue(DISABLE_HEADER_PANEL, "Y");
			Services.setValue(WARRANT_XPATH + "/WarrantOwnedBy", Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/OwnedBy") );
			Services.setValue(WARRANT_XPATH + "/ToTransfer", Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/ToTransfer") );
			Services.endTransaction();
			
			addClaimaintsDefendants(warrantID);
			populatePartyAgainstList(warrantID);
			
			// Retrieve the details of the warrant
			var params = new ServiceParams();
			params.addSimpleParameter("warrantID", warrantID);
			Services.callService("getWarrantReturns", params, SearchResultsLOVGrid, true);				
		}
		else 
		{
	        // Create the live flag to be displayed in the search results grid
	        for ( var i=0; i<count; i++ )
	        {
	        	// Set the root xpath for the current warrant in the loop
	        	var warrantXPath = SEARCH_RESULTS_XPATH + "/Warrant[" + (i+1) + "]";
	        	var isWarrantLive = "Y";
	        	
	        	// Warrant is live if there are no final warrant returns
	        	var countFinalReturns = Services.countNodes(warrantXPath + "/FinalReturnCodes/FinalReturn");
	        	if ( countFinalReturns > 0 )
	        	{
		        	// Determine if there are two parties against, or just one
		        	var def2Name = Services.getValue(warrantXPath + "/Defendant2/Name");
		        	var twoDefendants = CaseManUtils.isBlank(def2Name) ? false : true;
		        	
		        	if ( twoDefendants )
		        	{
		        		// Two parties against, so is not live if a final return exists against
		        		// both parties, else live.
		        		var returnAgainstD1 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 1]");
		        		var returnAgainstD2 = Services.exists(warrantXPath + "/FinalReturnCodes/FinalReturn[./DefendantId = 2]");
						if ( returnAgainstD1 && returnAgainstD2 )
						{
							isWarrantLive = "N";
						}
		        	}
		        	else
		        	{
		        		// One party against so if any final returns exist, is not live
		        		isWarrantLive = "N";
		        	}
	            }
	            Services.setValue(warrantXPath + "/Live", isWarrantLive);
	        }
			
			Services.dispatchEvent("SearchResultsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
		}
		Services.endTransaction();
	}
}

/*****************************************************************************************************************
																				DEFENDANTS PANEL FUNCTIONS
*****************************************************************************************************************/

Def_PartyFor_Txt.tabIndex = -1;
Def_PartyFor_Txt.maxLength = 70;
Def_PartyFor_Txt.componentName = "Party For";
Def_PartyFor_Txt.helpText = "Name of the party for";
Def_PartyFor_Txt.isReadOnly = function() { return true; }
Def_PartyFor_Txt.isTemporary = function() { return true; }

/**********************************************************************************/

Def_PartyAgainst1_Txt.tabIndex = -1;
Def_PartyAgainst1_Txt.maxLength = 70;
Def_PartyAgainst1_Txt.componentName = "Party Against 1";
Def_PartyAgainst1_Txt.helpText = "Name of the first party against";
Def_PartyAgainst1_Txt.isReadOnly = function() { return true; }
Def_PartyAgainst1_Txt.isTemporary = function() { return true; }

/**********************************************************************************/

Def_PartyAgainst2_Txt.tabIndex = -1;
Def_PartyAgainst2_Txt.maxLength = 70;
Def_PartyAgainst2_Txt.componentName = "Party Against 2";
Def_PartyAgainst2_Txt.helpText = "Name of the second party against";
Def_PartyAgainst2_Txt.isReadOnly = function() { return true; }
Def_PartyAgainst2_Txt.isTemporary = function() { return true; }

/**********************************************************************************/

Def_IssuingCourtId_Txt.tabIndex = -1;
Def_IssuingCourtId_Txt.maxLength = 3;
Def_IssuingCourtId_Txt.componentName = "Issuing Court ID";
Def_IssuingCourtId_Txt.helpText = "The court code of the court that issued the warrant";
Def_IssuingCourtId_Txt.isReadOnly = function() { return true; }
Def_IssuingCourtId_Txt.isTemporary = function() { return true; }

Def_IssuingCourtId_Txt.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Code = " + this.dataBinding + "]/Name");
	if (courtName == null)
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;	
}

/**********************************************************************************/

Def_IssuingCourtDescription_Txt.tabIndex = -1;
Def_IssuingCourtDescription_Txt.maxLength = 70;
Def_IssuingCourtDescription_Txt.componentName = "Issuing Court Description";
Def_IssuingCourtDescription_Txt.helpText = "The name of the court that issued the warrant";
Def_IssuingCourtDescription_Txt.isReadOnly = function() { return true; }
Def_IssuingCourtDescription_Txt.isTemporary = function() { return true; }

Def_IssuingCourtDescription_Txt.logicOn = [Def_IssuingCourtDescription_Txt.dataBinding];
Def_IssuingCourtDescription_Txt.logic = function()
{
	var courtId = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Name = " + this.dataBinding + "]/Code");
	if (courtId != null)
	{
		// The entered value must be valid
		Services.startTransaction();
		Services.setValue(Def_IssuingCourtId_Txt.dataBinding, courtId);
		Services.endTransaction();
	}
}

/**********************************************************************************/

Def_WarrantType_Txt.tabIndex = -1;
Def_WarrantType_Txt.maxLength = 15;
Def_WarrantType_Txt.componentName = "Warrant Type";
Def_WarrantType_Txt.helpText = "Type of the warrant issued";
Def_WarrantType_Txt.isReadOnly = function() { return true; }
Def_WarrantType_Txt.isTemporary = function() { return true; }

/*****************************************************************************************************************
								WARRANT DETAILS PANEL FUNCTIONS
*****************************************************************************************************************/

Details_Results_Grid.componentName = "Warrant Returns Grid";
Details_Results_Grid.srcDataOn = ["/ds/WarrantReturns/WarrantEvents", GRID_REFRESH];
Details_Results_Grid.srcData = "/ds/WarrantReturns/WarrantEvents";
Details_Results_Grid.rowXPath = "WarrantEvent";
Details_Results_Grid.keyXPath = "SurrogateKey";
Details_Results_Grid.columns = [ 
	{xpath: "SurrogateKey", sort: "disabled", transformToDisplay: function() { return ""; } }, 
	{xpath: "ReturnDate", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate}, 
	{xpath: "Code"}, 
	{xpath: "ReturnText"}, 
	{xpath: "Error", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; }}	
];

Details_Results_Grid.tabIndex = 15;
/**
 * @param rowId
 * @author jz89bc
 * @return classList  
 */
Details_Results_Grid.rowRenderingRule = function(rowId)
{
	var classList = "";
    if( null != rowId )
    {
    	var failedOutput = false;
      	var blnError = Services.getValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey = " + rowId + "]/Error");
      	var countOutputs = Services.countNodes(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey = " + rowId + "]/Outputs/Output");
      	if ( countOutputs == 0 )
      	{
      		// No outputs, do not display icon
      		var finalInd = null;
      	}
      	else if ( countOutputs == 1 )
      	{
      		// One output, display the icon based upon the final indicator
      		var finalInd = Services.getValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey = " + rowId + "]/Outputs/Output/Final");
      		
      		var documentId = Services.getValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey = " + rowId + "]/Outputs/Output/DocumentId");
      		if (null == documentId || documentId == "")
      		{
      			failedOutput = true;
      		}
      	}
      	else
      	{
      		// Multiple outputs, display the final indicator icon
      		var finalInd = "Y";
      	}
      	
      	if( blnError == "Y" && null == finalInd )
      	{
	      	// errorClass (no output, just event is in error)
          	classList = "errorClass";
      	}
      	else if ( blnError == "Y" && finalInd == "N" )
      	{
      		if (!failedOutput)
      		{
      			// errorEditOutputClass (event in error with output to be edited)
          		classList = "errorEditOutputClass";
          	}
          	else
          	{
	          	// errorFailOutputClass (event in error with output failed)
          		classList = "errorFailOutputClass";
          	}
      	}
      	else if ( blnError == "N" && finalInd == "N" )
      	{
      		if (!failedOutput)
      		{
      			// editOutputClass (event NOT in error with output to be edited)
          		classList = "editOutputClass";
          	}
          	else
          	{
	          	// failOutputClass (event NOT in error with output failed)
          		classList = "failOutputClass";
          	}
      	}
      	else if ( blnError == "Y" && finalInd == "Y" )
      	{
      		if (!failedOutput)
      		{
      			// errorOpenOutputClass (event in error with output completed)
          		classList = "errorOpenOutputClass";
          	}
          	else
          	{
	          	// errorFailOutputClass (event in error with output failed)
          		classList = "errorFailOutputClass";
          	}
      	}
      	else if ( blnError == "N" && finalInd == "Y" )
      	{
      		if (!failedOutput)
      		{
      			// openOutputClass (event NOT in error with output completed)
          		classList = "openOutputClass";
          	}
          	else
          	{
          		// failOutputClass (event NOT in error with output failed)
          		classList = "failOutputClass";
          	}
      	}
	}
    return classList;
}

/**********************************************************************************/

Details_ReturnCode_Txt.tabIndex = 16;
Details_ReturnCode_Txt.maxLength = 3;
Details_ReturnCode_Txt.componentName = "Return Code";
Details_ReturnCode_Txt.helpText = "The warrant return code to be associated with the warrant";
Details_ReturnCode_Txt.transformToDisplay = toUpperCase;
Details_ReturnCode_Txt.transformToModel = toUpperCase;
Details_ReturnCode_Txt.isTemporary = function() { return true; }
Details_ReturnCode_Txt.readOnlyOn = [Def_PartyFor_Txt.dataBinding];
Details_ReturnCode_Txt.isReadOnly = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	return (CaseManUtils.isBlank(partyFor));
}

Details_ReturnCode_Txt.logicOn = [Details_ReturnCode_Txt.dataBinding];
Details_ReturnCode_Txt.logic = function(event)
{
	if (event.getXPath() != Details_ReturnCode_Txt.dataBinding)
	{
		return;
	}

	var returnCode = Services.getValue(Details_ReturnCode_Txt.dataBinding);
	if (!CaseManUtils.isBlank( returnCode ) )
	{
		// Populate the Description field
		var returnDesc = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']/Description");
		if (returnDesc != null)
		{
			Services.setValue(Details_ReturnDescription_Txt.dataBinding, returnCode);
		}	
	}
	else
	{
		// returnCode cleared so also clear the Return Description
		Services.setValue(Details_ReturnDescription_Txt.dataBinding, "");
	}
}

Details_ReturnCode_Txt.validate = function()
{
	var ec = null;
	var returnCodeCategory = null;
	var returnCodeType = null;
	var returnCodeCourt = null;
	//var results = null;
	var resultsLocalNumber = null;
	
	selectedResultRow = Services.getValue(SearchResultsLOVGrid.dataBinding);
	// If warrant was retrieved from a specific search, this value will be blank
	if (selectedResultRow == null || CaseManUtils.isBlank(selectedResultRow))
	{
		selectedResultRow = Services.getValue(Header_WarrantID_Txt.dataBinding);
	}

	var returnCode = Services.getValue(Details_ReturnCode_Txt.dataBinding);
	var warrantType = Services.getValue(Def_WarrantType_Txt.dataBinding);
	
	if (count > 0)
	{
		resultsLocalNumber = Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + selectedResultRow + "']/LocalNumber");	
	}
	else
	{
		resultsLocalNumber = Services.getValue(SEARCH_RESULTS_XPATH + "/Warrant/LocalNumber");
	}
		
	if (!CaseManUtils.isBlank(returnCode))
	{
		returnCodeCategory = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']/Category");
		returnCodeType = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']/Type");
		returnCodeCourt = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']/CourtCode");
	}
	
	var userCourt = Services.getValue(Header_ExecutingCourtId_Txt.dataBinding);
	if (returnCodeCategory == "L" && returnCodeCourt != userCourt)
	{
		ec = new ErrorCode("CaseMan_ReturnCodeDoesNotBelongToExecutingCourt_Msg", "Local return code does not belong to the executing court");
	}
	// If a final return (i.e. numerical) exists and the selected return code's type is interim and not AY, AX, LC or LD 
	// And the final return is not marked as an error
	var returnFinal = Services.exists(WARRANT_EVENTS_XPATH + "/WarrantEvent/Code[text()[contains(.,number())] and ../Error='N']");
	if ( returnFinal && returnCodeType == "I" && (returnCode != "AY" && returnCode != "AX" && returnCode != "LC" && returnCode != "LD") )
	{
		ec = ErrorCode.getErrorCode("CaseMan_enterOnlyFinalReturnCode_Msg");
	}
	// If Local Number is present, warrant is a foreign warrant
	if ( !CaseManUtils.isBlank(resultsLocalNumber) && returnCodeCategory == "L" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_foreignWarrantsCannotHaveLocalReturnCodes_Msg");
	}
	if ( returnCode == "AI" && (warrantType != "POSSESSION" && warrantType != "DELIVERY") )
	{
		ec = ErrorCode.getErrorCode("CaseMan_returnCodeOnlyAllowedForPossessionDelivery_Msg");		
	}
	if ( returnCode == "NE" && warrantType != "POSSESSION" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_returnCodeOnlyAllowedForCountyCourtPossession_Msg");
	}
	if ( CaseManUtils.isBlank(resultsLocalNumber) && (returnCode == "FE" || returnCode == "DO") )
	{
		ec = ErrorCode.getErrorCode("CaseMan_returnCodeOnlyAllowedForForeignWarrants_Msg");
	}
	if ( returnCode == "158" )
	{
		ec = ErrorCode.getErrorCode("CaseMan_returnCode158CannotBeCreated_Msg");
	}
	if (!CaseManUtils.isBlank(returnCode))
	{
		// Check returnCode exists in the list
		if (!Services.exists(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']"))
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidReturn_Msg");
		}
	}

	return ec;
}

/**********************************************************************************/

Details_ReturnDescription_Txt.tabIndex = 17;
Details_ReturnDescription_Txt.componentName = "Return Code Description";
Details_ReturnDescription_Txt.helpText = "The description of the warrant return code";
Details_ReturnDescription_Txt.transformToDisplay = toUpperCase;
Details_ReturnDescription_Txt.transformToModel = toUpperCase;
Details_ReturnDescription_Txt.isTemporary = function() { return true; }
Details_ReturnDescription_Txt.srcData = RETURN_CODES_XPATH;
Details_ReturnDescription_Txt.rowXPath = "WarrantCode";
Details_ReturnDescription_Txt.keyXPath = "Code";
Details_ReturnDescription_Txt.displayXPath = "Description";
Details_ReturnDescription_Txt.strictValidation = true;

Details_ReturnDescription_Txt.enableOn = [Def_PartyFor_Txt.dataBinding];
Details_ReturnDescription_Txt.isEnabled = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	return(!CaseManUtils.isBlank(partyFor));
}

Details_ReturnDescription_Txt.logicOn = [Details_ReturnDescription_Txt.dataBinding];
Details_ReturnDescription_Txt.logic = function(event)
{
	if (event.getXPath() != Details_ReturnDescription_Txt.dataBinding)
	{
		return;
	}

	var returnCode = Services.getValue(this.dataBinding);
	if (!CaseManUtils.isBlank( returnCode ) )
	{
		var returnDesc = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code='" + returnCode + "']/Description");
		if (returnDesc != null)
		{
			Services.setValue(Details_ReturnCode_Txt.dataBinding, returnCode);
		}	
	}
	else
	{
		// returnCode cleared so also clear the Return Description
		Services.setValue(Details_ReturnCode_Txt.dataBinding, "");
	}
}

/**********************************************************************************/

Details_ReturnCategory_Txt.retrieveOn = [Details_ReturnCode_Txt.dataBinding];

/**********************************************************************************/

Details_ReturnCourtCode_Txt.retrieveOn = [Details_ReturnCode_Txt.dataBinding];

/**********************************************************************************/

function ReturnsLOVButton() {};
ReturnsLOVButton.tabIndex = 18;

ReturnsLOVButton.enableOn = [Def_PartyFor_Txt.dataBinding];
ReturnsLOVButton.isEnabled = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	return (!CaseManUtils.isBlank(partyFor));
}

/**********************************************************************************/

function Details_AddReturn_Btn() {};
Details_AddReturn_Btn.tabIndex = 19;

Details_AddReturn_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "MaintainWarrantReturns" } ]
	}
};

Details_AddReturn_Btn.enableOn = [Details_ReturnCode_Txt.dataBinding, Details_ReturnDescription_Txt.dataBinding, Details_ToTransfer_Txt.dataBinding];
Details_AddReturn_Btn.isEnabled = function()
{
	var blnEnabled = false;
	var currentlyOwnedBy = Services.getValue(WARRANT_XPATH + "/WarrantOwnedBy");
	var returnCode = Services.getValue(Details_ReturnCode_Txt.dataBinding);
	var toTransfer = Services.getValue(WARRANT_XPATH + "/ToTransfer");
	
	if ( !CaseManUtils.isBlank(returnCode) && null == Details_ReturnCode_Txt.validate() )
	{
		// Return code has been entered and is valid, make other checks
		if ( currentlyOwnedBy == CaseManUtils.CCBC_COURT_CODE )
		{
			// Add button should be enabled for warrants owned by CCBC (UCT Group2 Defect 1327)
			blnEnabled = true;
		}	
		else if ( toTransfer != "1"  && toTransfer != "2" )
		{
			// For warrants not owned by CCBC, Add button should only be enabled if not transferred
			blnEnabled = true;
		}
	}

	return blnEnabled;
};

/**
 * @author jz89bc
 * @return Code = Services.getValue(Details_ReturnCode_Txt.dataBinding) , Code + "']/Description") , Code) , Description)  
 */
Details_AddReturn_Btn.actionBinding = function()
{
	Services.startTransaction();
		
	var newWarrantReturn = Services.loadDOMFromURL("NewWarrantReturn.xml");
	Services.replaceNode(LOV_WARRANT_EVENTS_XPATH, newWarrantReturn);

	var returnCode = Services.getValue(Details_ReturnCode_Txt.dataBinding);
	var returnDescription = Services.getValue(RETURN_CODES_XPATH + "/WarrantCode[./Code = '" + returnCode + "']/Description");
	
	Services.setValue(LOV_WARRANT_EVENTS_XPATH + "/AppointmentTimeValid", "");
	Services.setValue(Add_Code_Txt.dataBinding, returnCode);
	Services.setValue(Add_Return_Date.dataBinding, CaseManUtils.getSystemDate(SYSTEMDATE_XPATH));	
	Services.setValue(Add_Receipt_Date.dataBinding, CaseManUtils.getSystemDate(SYSTEMDATE_XPATH));	
	Services.setValue(Add_WarrantID_Txt.dataBinding, warrantID);
	Services.setValue(Add_Return_Txt.dataBinding, returnDescription);
	Services.setValue(Add_Notice_Check.dataBinding, getDefaultNoticeCheckForReturnCode() );
	Services.endTransaction();
	
	Services.dispatchEvent("Warrant_Returns_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	
	var confidentialityWarning = Services.getValue("/ds/AdditionalInfo/FlagConfidentiality");
	if ( confidentialityWarning == "true" )
	{
		// Warn user that a party on the case has requested confidentiality
		alert(Messages.CONFIDENTIALITY_MESSAGE);
	}
}

/**********************************************************************************/

Details_Return_Date.tabIndex = -1;
Details_Return_Date.componentName = "Date Entered";
Details_Return_Date.helpText = "Date return entered";
Details_Return_Date.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Return_Date.isReadOnly = function() { return true; }

Details_Return_Date.validate = function()
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);
	
	if (!CaseManUtils.isBlank(value)) 
	{
		var date = CaseManUtils.createDate(value);
		
		// Check if date is an invalid format
		if (date == null)
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			
			// Check date is not in the future
			if (CaseManUtils.compareDates(today, date) == 1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
			}
			if (ec == null)
			{
				// Check date is not on a bank holiday
				ec = validateNonWorkingDate(value);
			}
		}
	}

	return ec;
}

/**********************************************************************************/

Details_Code_Txt.tabIndex = -1;
Details_Code_Txt.maxLength = 3;
Details_Code_Txt.componentName = "Code";
Details_Code_Txt.helpText = "The appropriate code for the return made by the bailiff";
Details_Code_Txt.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Code_Txt.isReadOnly = function() { return true; }

/**********************************************************************************/

Details_Return_Txt.tabIndex = -1;
Details_Return_Txt.maxLength = 80;
Details_Return_Txt.componentName = "Return Text";
Details_Return_Txt.helpText = "A description of the warrant return code";
Details_Return_Txt.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Return_Txt.transformToDisplay = toUpperCase;
Details_Return_Txt.transformToModel = toUpperCase;
Details_Return_Txt.isReadOnly = function() { return true; }

/**********************************************************************************/

Details_AdditionalDetails_Txt.tabIndex = 23;
Details_AdditionalDetails_Txt.maxLength = 140;
Details_AdditionalDetails_Txt.componentName = "Additional Details";
Details_AdditionalDetails_Txt.helpText = "Additional information regarding the return code";
Details_AdditionalDetails_Txt.retrieveOn = [Details_Results_Grid.dataBinding];
Details_AdditionalDetails_Txt.transformToDisplay = toUpperCase;
Details_AdditionalDetails_Txt.transformToModel = convertToUpperStripped;

Details_AdditionalDetails_Txt.readOnlyOn =[Details_Results_Grid.dataBinding, Def_PartyFor_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_AdditionalDetails_Txt.isReadOnly = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var toTransfer = Services.getValue(Details_ToTransfer_Txt.dataBinding); // // Read-only if warrant has been transferred
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if ( hasWarrantReturns == "N" || 
			 CaseManUtils.isBlank(hasWarrantReturns) || 
			 ( toTransfer == "2" || toTransfer == "1" ) 
		   )
		{
			return true;
		}
		return false;
	}
	return true;
}

Details_AdditionalDetails_Txt.mandatoryOn = [Details_Code_Txt.dataBinding];
Details_AdditionalDetails_Txt.isMandatory = function() 
{
	var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
	if (returnCode == "AX" || returnCode == "AY" || returnCode == "147")
	{
		return true;
	}
	return false;
}

Details_AdditionalDetails_Txt.validate = function()
{
	var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
	var additionalDetails = Services.getValue(this.dataBinding);
	if (!CaseManUtils.isBlank(additionalDetails))
	{
		if (returnCode == "147")
		{
			var testCourtName = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Name=" + this.dataBinding + "]/Code");
			if (CaseManUtils.isBlank(testCourtName))
			{
				return ErrorCode.getErrorCode("CaseMan_validCourtMustBeEntered_Msg");
			}
		}
		else
		{
			return null;
		}
	}
	else
	{
		// Make sure value is blank rather than a number of spaces
		Services.setValue(this.dataBinding, "");
	}
}

/**********************************************************************************/

Details_Notice_Check.tabIndex = 24;
Details_Notice_Check.componentName = "Notice";
Details_Notice_Check.helpText = "Indication of whether a notice should be printed";
Details_Notice_Check.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Notice_Check.modelValue = { checked: 'Y', unchecked: 'N' };

Details_Notice_Check.readOnlyOn = [Details_Results_Grid.dataBinding, Def_PartyFor_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_Notice_Check.isReadOnly = function()
{
	var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
	return (returnCode == "AX" || returnCode == "AY");
}

Details_Notice_Check.enableOn = [Def_PartyFor_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_Notice_Check.isEnabled = function()
{ 
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if (hasWarrantReturns == "N")
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}

/**********************************************************************************/

Details_Defendant_Sel.tabIndex = -1;
Details_Defendant_Sel.transformToDisplay = toDefendantName;
Details_Defendant_Sel.transformToModel = toDefendantName;
Details_Defendant_Sel.componentName = "Party Against";
Details_Defendant_Sel.helpText = "The party against which this return relates";
Details_Defendant_Sel.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Defendant_Sel.isReadOnly = function() { return true; }

/**********************************************************************************/

Details_Verified_Date.tabIndex = 26;
Details_Verified_Date.componentName = "Verified";
Details_Verified_Date.helpText = "Date on which the return code was verified by the Bailiff Manager";
Details_Verified_Date.retrieveOn = [Details_Results_Grid.dataBinding];

Details_Verified_Date.readOnlyOn = [Details_Results_Grid.dataBinding, Def_PartyFor_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_Verified_Date.isReadOnly = function()
{ 
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if (hasWarrantReturns == "N")
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return true;
	}
}

Details_Verified_Date.validateOn = [Details_Results_Grid.dataBinding];
Details_Verified_Date.validate = function()
{
	var ec = null;
	var verifiedValue = Services.getValue(this.dataBinding);
	if ( !CaseManUtils.isBlank(verifiedValue) )
	{
		var verifiedDate = CaseManUtils.createDate(verifiedValue);
		
		// Check if date is an invalid format
		if ( verifiedDate == null )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		
		// UCT Defect 866 - Verified Date cannot be before the Return Date
		var returnDateValue = Services.getValue(Details_Receipt_Date.dataBinding);
		if ( !CaseManUtils.isBlank(returnDateValue) && verifiedDate < CaseManUtils.createDate(returnDateValue) )
		{
			ec = ErrorCode.getErrorCode("CaseMan_verifiedCannotBeEarlierThanReturnDate_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			
			// Check date is not in the future
			if (CaseManUtils.compareDates(today, verifiedDate) == 1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
			}
		}
	}
	
	return ec;
}

/**********************************************************************************/

Details_Error_Check.tabIndex = 27;
Details_Error_Check.componentName = "Error";
Details_Error_Check.helpText = "A flag indicating whether the return was created in error";
Details_Error_Check.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Error_Check.modelValue = { checked: 'Y', unchecked: 'N' };
Details_Error_Check.isReadOnly = function() { return false; }

Details_Error_Check.enableOn = [Def_PartyFor_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_Error_Check.isEnabled = function()
{ 
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if (hasWarrantReturns == "N")
		{
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return false;
	}
}
Details_Error_Check.logicOn = [Details_Error_Check.dataBinding];
Details_Error_Check.logic = function(event) 
{
	if ( event.getXPath() != Details_Error_Check.dataBinding || event.getType() != DataModelEvent.UPDATE )
	{
		return;
	}
	
	// Flag that the currently selected Warrant Return has been errored
	Services.setValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/ReturnUpdated","Y");

	// The error indicator has been updated for a warrant return, so save immediately
	var newDOM = XML.createDOM(null, null, null);
	var results = Services.getNode("/ds/WarrantReturns");
	var dsNode = XML.createElement(newDOM, "ds");
	
	dsNode.appendChild(results);
	newDOM.appendChild(dsNode);
	var params = new ServiceParams();
	params.addDOMParameter("NewReturn", newDOM);
	Services.callService("updateWarrantReturns", params, Details_Error_Check, true);
}

/**
 * @param dom
 * @param serviceName
 * @author jz89bc
 * @return Type = "" , Code = Services.getValue(Details_Code_Txt.dataBinding) , Code)), Type = "F" , Type = "I" , Type)  
 */
Details_Error_Check.onSuccess = function(dom, serviceName) 
{
	if(serviceName == "updateWarrantReturns") 
	{
		var receiptDate = Services.getValue(Details_Receipt_Date.dataBinding);
		var processingDate = Services.getValue(Details_Return_Date.dataBinding);
		var error = Services.getValue(Details_Error_Check.dataBinding);
		// Only perform this logic for foreign warrants
		var localNumber = Services.getValue(Header_LocalNumber_Txt.dataBinding);
		if ( !CaseManUtils.isBlank(localNumber) && localNumber != "" )
		{
			// Determine return type
			var returnType = "";
			var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
			regExp = /^[0-9]*$/; // Regular expression that tests true for a string containing numbers
			if (regExp.test(returnCode))
			{
				returnType = "F";
			}
			else
			{
				returnType = "I";
			}
			
			if ( CaseManUtils.isBlank(receiptDate) )
			{
				receiptDate = processingDate;
			}
		
			var params = new ServiceParams();
			params.addSimpleParameter("section", "WARRANTRETURN");
			params.addSimpleParameter("warrantId", warrantID);
			params.addSimpleParameter("receiptDate", receiptDate);
			params.addSimpleParameter("processingDate", processingDate);
			params.addSimpleParameter("returnType", returnType);
			params.addSimpleParameter("taskType", "B");
			params.addSimpleParameter("error", error);
			Services.callService("addBmsRuleNonEvent", params, Details_Error_Check, true);
		}
		// Perform the standard actions for a normal save
		Status_Save_Btn.onSuccess(dom);
	}
}

Details_Error_Check.onBusinessException = Status_Save_Btn.onBusinessException;
Details_Error_Check.onSystemException = Status_Save_Btn.onSystemException;

/**********************************************************************************/

Details_Appointment_Date.tabIndex = 28;
Details_Appointment_Date.componentName = "Appointment Date";
Details_Appointment_Date.helpText = "Enter the date of the appointment";
Details_Appointment_Date.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Appointment_Date.readOnlyOn = [Details_Results_Grid.dataBinding, Def_PartyFor_Txt.dataBinding, Details_Code_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_Appointment_Date.isReadOnly = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if (hasWarrantReturns == "N")
		{
			return true;
		}
		else
		{
			// Read-only if selected return code is not NE or AI
			var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
			if (returnCode != "NE" && returnCode != "AI")
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	else
	{
		return true;
	}
}

Details_Appointment_Date.mandatoryOn = [Details_Code_Txt.dataBinding];
Details_Appointment_Date.isMandatory = function()
{
	var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
	if (returnCode == "AI" || returnCode == "NE")
	{
		return true;
	}
	else
	{
		return false;
	}
}

Details_Appointment_Date.validateOn = [Details_Appointment_Date.dataBinding, Details_Results_Grid.dataBinding];
Details_Appointment_Date.validate = function(event)
{	
	// Get the warrant returns id from the currently selected record in the grid
	var warrantReturnsId = Services.getValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/WarrantReturnsID");
	// Get the appointment date as it was when we loaded the data for the record that is being edited
	var originalAppointmentDate = Services.getValue(VAR_PAGE_XPATH + "/OriginalLoadedData/WarrantReturns/WarrantEvents/WarrantEvent[WarrantReturnsID='" + warrantReturnsId + "']/AppointmentDate");

	// Only perform the validation if the current value in the editable part of the model
	// differs from the value that was last read from the database
	if (Services.getValue(this.dataBinding) == originalAppointmentDate) {return;}
	
	var ec = null;
	var value = Services.getValue(this.dataBinding);

	if (!CaseManUtils.isBlank(value))	
	{
		var date = CaseManUtils.createDate(value);
		
		// Check if date is an invalid format
		if (date == null)
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			
			// Check date is not in the past
			if (CaseManUtils.compareDates(today, date) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg");
			}
			if (ec == null)
			{
				var testError = validateNonWorkingDate(value); // Public holiday check
				if (testError != null || date.getDay() == "0") // Sunday check
				{
					ec = ErrorCode.getErrorCode("CaseMan_dateNonAppointmentDate_Msg");
				}
			}
		}
	}
	
	return ec;	
}

/**********************************************************************************/

Details_AppointmentTime_Txt.tabIndex = 29;
Details_AppointmentTime_Txt.maxLength = 5;
Details_AppointmentTime_Txt.componentName = "Appointment Time";
Details_AppointmentTime_Txt.helpText = "Enter the time of the appointment";
Details_AppointmentTime_Txt.retrieveOn = [Details_Results_Grid.dataBinding];

Details_AppointmentTime_Txt.readOnlyOn = [Details_Results_Grid.dataBinding, Def_PartyFor_Txt.dataBinding, Details_Code_Txt.dataBinding, HAS_WARRANT_RETURNS];
Details_AppointmentTime_Txt.isReadOnly = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	var hasWarrantReturns = Services.getValue(HAS_WARRANT_RETURNS);
	if (!CaseManUtils.isBlank(partyFor))
	{
		if (hasWarrantReturns == "N")
		{
			return true;
		}
		else
		{
			// Read-only if selected return code is not NE or AI
			var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
			if (returnCode != "NE" && returnCode != "AI")
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	else
	{
		return true;
	}
}

Details_AppointmentTime_Txt.mandatoryOn = [Details_Code_Txt.dataBinding];
Details_AppointmentTime_Txt.isMandatory = function()
{
	var returnCode = Services.getValue(Details_Code_Txt.dataBinding);
	if (returnCode == "AI" || returnCode == "NE")
	{
		return true;
	}
	return false;
}

/**
 * Validate, TransformToDisplay & TransformToModel updated/added as part of fix for defect 5652
 * which maintains a screen time of hh:mm and converts to a model time of seconds after midnight.
 */
Details_AppointmentTime_Txt.validateOn = [Details_Results_Grid.dataBinding];
Details_AppointmentTime_Txt.validate = function()
{
	var time = Services.getValue(Details_AppointmentTime_Txt.dataBinding);
	var xpath = WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AppointmentTimeValid";
	return validateTimeAt(time, xpath);
}

Details_AppointmentTime_Txt.transformToDisplay = function(value)
{
	var xpath = WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AppointmentTimeValid";
	return transformToDisplayTime(value, xpath);		
}

Details_AppointmentTime_Txt.transformToModel = function(value)
{
	var xpath = WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/AppointmentTimeValid";
	return transformToModelTime(value, xpath);	
}

/**********************************************************************************/

Details_CreatedBy_Txt.tabIndex = -1;
Details_CreatedBy_Txt.maxLength = 30;
Details_CreatedBy_Txt.componentName = "Created By";
Details_CreatedBy_Txt.helpText = "Id of the user that created the warrant return";
Details_CreatedBy_Txt.retrieveOn = [Details_Results_Grid.dataBinding];
Details_CreatedBy_Txt.isReadOnly = function() { return true; }
Details_CreatedBy_Txt.transformToDisplay = function(modelValue)
{
	var alias = Services.getValue(WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey=" + Details_Results_Grid.dataBinding + "]/UserAlias");
	if ( !CaseManUtils.isBlank(alias) )
	{
		modelValue = alias;
	}
	return modelValue;
}

/**********************************************************************************/

Details_Receipt_Date.tabIndex = -1;
Details_Receipt_Date.helpText = "Date of warrant return";
Details_Receipt_Date.retrieveOn = [Details_Results_Grid.dataBinding];
Details_Receipt_Date.isReadOnly = function() { return true; }

Details_Receipt_Date.validateOn = [Details_Receipt_Date.dataBinding];
Details_Receipt_Date.validate = function()
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);
	
	if (!CaseManUtils.isBlank(value))
	{
		var date = CaseManUtils.createDate(value);
		
		// Check if date is an invalid format
		if (date == null)
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			
			// Check date is not in the future
			if (CaseManUtils.compareDates(today, date) == 1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
			}
			if (ec == null)
			{
				// Check date is not on a bank holiday
				ec = validateNonWorkingDate(value);
			}
		}
	}
	
	return ec;
}

/*****************************************************************************************************************
																				STATUS BAR FUNCTIONS
*****************************************************************************************************************/

function Status_Save_Btn() {};
Status_Save_Btn.tabIndex = 32;

Status_Save_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "MaintainWarrantReturns" } ]
	}
};

Status_Save_Btn.enableOn = [Details_Results_Grid.dataBinding, Details_Return_Date.dataBinding, Details_Code_Txt.dataBinding, Details_Return_Txt.dataBinding, Details_AdditionalDetails_Txt.dataBinding, Details_Notice_Check.dataBinding, Details_Defendant_Sel.dataBinding, Details_Verified_Date.dataBinding, Details_Error_Check.dataBinding, Details_Appointment_Date.dataBinding, Details_AppointmentTime_Txt.dataBinding, Details_CreatedBy_Txt.dataBinding, Details_Receipt_Date.dataBinding];
Status_Save_Btn.isEnabled = function()
{
	var partyFor = Services.getValue(Def_PartyFor_Txt.dataBinding);
	return !CaseManUtils.isBlank(partyFor);
}

/**
 * @author jz89bc
 * 
 */
Status_Save_Btn.actionBinding = function()
{
	var invalidFields = FormController.getInstance().validateForm(true);
	if (invalidFields.length == 0)
	{
		var newDOM = XML.createDOM(null, null, null);
		var results = Services.getNode("/ds/WarrantReturns");
		var dsNode = XML.createElement(newDOM, "ds");
		
		dsNode.appendChild(results);
		newDOM.appendChild(dsNode);
		var params = new ServiceParams();
		params.addDOMParameter("NewReturn", newDOM);
		Services.callService("updateWarrantReturns", params, Status_Save_Btn, true); 
	}
}

/**
 * @param resultDom
 * @author jz89bc
 * 
 */
Status_Save_Btn.onSuccess = function(resultDom)
{
	// Put a success message in the status bar
	Services.setTransientStatusBarMessage("Changes saved.");
	
	var temp = ACTION_AFTER_SAVE;
	ACTION_AFTER_SAVE = ACTION_RELOAD;
	switch (temp)
	{
		case ACTION_RELOAD:
			// Reload the warrant return details
			var params = new ServiceParams();
			params.addSimpleParameter("warrantID", warrantID);
			Services.callService("getWarrantReturns", params, SearchResultsLOVGrid, true);
			break;
		case ACTION_NAVIGATE:
			NavigationController.nextScreen();
			break;
		case ACTION_CLEARFORM:
			clearForm();
			break;
		case ACTION_EXIT:
			exitScreen();
			break;
	}
}

/**
 * @param exception
 * @author jz89bc
 * 
 */
Status_Save_Btn.onBusinessException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author jz89bc
 * 
 */
Status_Save_Btn.onUpdateLockedException = function (exception)
{
	if(confirm(Messages.WRITE_WRITE_CONFLICT_MSG))
	{
		// Reload the warrant return details
		var params = new ServiceParams();
		params.addSimpleParameter("warrantID", warrantID);
		Services.callService("getWarrantReturns", params, SearchResultsLOVGrid, true);
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author jz89bc
 * 
 */
Status_Save_Btn.onSystemException = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**********************************************************************************/

function Status_Clear_Btn() {};
Status_Clear_Btn.tabIndex = 33;

Status_Clear_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "MaintainWarrantReturns", alt: true } ]
	}
};

/**
 * @author jz89bc
 * @return null 
 */
Status_Clear_Btn.actionBinding = function()
{
	if (changesMade())
	{
		if (confirm(Messages.DETSLOST_MESSAGE))
		{
			ACTION_AFTER_SAVE = ACTION_CLEARFORM;
			Status_Save_Btn.actionBinding();
		}
		else
		{
			clearForm();
		}
	}
	else
	{
		if (confirm(Messages.CONFIRM_CLEARSCREEN_MESSAGE))
		{
			clearForm();
		}
		else
		{
			return;
		}
	}
}

/**********************************************************************************/

function Status_Close_Btn() {};
Status_Close_Btn.tabIndex = 34;

Status_Close_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "MaintainWarrantReturns" } ]
	}
};

Status_Close_Btn.actionBinding = checkChangesMadeBeforeExit;

/*****************************************************************************************************************
																				LOV FUNCTIONS
*****************************************************************************************************************/

CourtsLOVGrid.srcData = REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court[./InService = 'Y']";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort: "true", defaultSortOrder: "ascending"}, 
	{xpath: "Name"}
];

CourtsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "CourtsLOVButton"} ],
		keys: [ { key: Key.F6, element: "Header_ExecutingCourtId_Txt" }, { key: Key.F6, element: "Header_ExecutingCourtDescription_Txt" } ]
	}
};

/**
 * @author jz89bc
 * @return "Header_ExecutingCourtId_Txt"  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() 
{
	return "Header_ExecutingCourtId_Txt";	
}

CourtsLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
CourtsLOVGrid.destroyOnClose = false;
CourtsLOVGrid.logicOn = [CourtsLOVGrid.dataBinding];
CourtsLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(CourtsLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var courtCode = Services.getValue(CourtsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, courtCode);
		Services.setValue(CourtsLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**********************************************************************************/

ReturnsLOVGrid.srcData = RETURN_CODES_XPATH;
ReturnsLOVGrid.rowXPath = "WarrantCode";
ReturnsLOVGrid.keyXPath = "Code";
ReturnsLOVGrid.columns = [
	{xpath: "Code"}, 
	{xpath: "Description"}
];

ReturnsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "ReturnsLOVButton"} ],
		keys: [ { key: Key.F6, element: "Details_ReturnCode_Txt" }, { key: Key.F6, element: "Details_ReturnDescription_Txt" } ]
	}
};

/**
 * @author jz89bc
 * @return "Details_ReturnCode_Txt"  
 */
ReturnsLOVGrid.nextFocusedAdaptorId = function() 
{
	return "Details_ReturnCode_Txt";
}

ReturnsLOVGrid.logicOn = [ReturnsLOVGrid.dataBinding];
ReturnsLOVGrid.logic = function()
{
	var value = Services.getValue(this.dataBinding);
	if (!CaseManUtils.isBlank(value))
	{
		Services.startTransaction();
		Services.setValue(Details_ReturnCode_Txt.dataBinding, value);
		Services.endTransaction();
	}
}

/**********************************************************************************/

SearchResultsLOVGrid.srcData = SEARCH_RESULTS_XPATH;
SearchResultsLOVGrid.rowXPath = "Warrant";
SearchResultsLOVGrid.keyXPath = "WarrantID";
SearchResultsLOVGrid.columns = [
	{xpath: "IssuedByName"},
	{xpath: "IssueDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.convertDateToDisplay},
	{xpath: "WarrantNumber"},
	{xpath: "LocalNumber"},
	{xpath: "CaseNumber"},
	{xpath: "CONumber"}
];

SearchResultsLOVGrid.logicOn = [SearchResultsLOVGrid.dataBinding];
SearchResultsLOVGrid.logic = function(event)
{
	var value = Services.getValue(this.dataBinding);
	if (!CaseManUtils.isBlank(value)) 
	{
		// Set the global Warrant ID
		warrantID = value;
	
		Services.setValue(Header_WarrantNumber_Txt.dataBinding, "");
		Services.setValue(Header_CaseNumber_Txt.dataBinding, "");
		Services.setValue(Header_CO_Txt.dataBinding, "");
		Services.setValue(Header_LocalNumber_Txt.dataBinding, "");
		Services.setValue(Def_WarrantType_Txt.dataBinding, "");
		Services.setValue(Def_IssuingCourtId_Txt.dataBinding, "");
		Services.setValue(Def_IssuingCourtDescription_Txt.dataBinding, "");
		
		selectedResultRow = Services.getValue(SearchResultsLOVGrid.dataBinding);
		var rootXPath = SEARCH_RESULTS_XPATH + "/Warrant[./WarrantID='" + selectedResultRow + "']";
		
		Services.startTransaction();
		Services.setValue(WarrantReturnsParams.WARRANT_ID, selectedResultRow);
		Services.setValue(Header_WarrantID_Txt.dataBinding, selectedResultRow);
		Services.setValue(Header_WarrantNumber_Txt.dataBinding, Services.getValue(rootXPath + "/WarrantNumber") );
		Services.setValue(Header_CaseNumber_Txt.dataBinding, Services.getValue(rootXPath + "/CaseNumber") );
		Services.setValue(Header_CO_Txt.dataBinding, Services.getValue(rootXPath + "/CONumber") );
		Services.setValue(Header_LocalNumber_Txt.dataBinding, Services.getValue(rootXPath + "/LocalNumber") );
		Services.setValue(Def_WarrantType_Txt.dataBinding, Services.getValue(rootXPath + "/WarrantType") );
		Services.setValue(Header_ExecutingCourtId_Txt.dataBinding, Services.getValue(rootXPath + "/ExecutedBy"));
		Services.setValue(Def_IssuingCourtDescription_Txt.dataBinding, Services.getValue(rootXPath + "/IssuedByName") );
		Services.setValue(CCBC_WARRANT_XPATH, Services.getValue(rootXPath + "/CCBCWarrant") );
		Services.setValue(WARRANT_XPATH + "/WarrantOwnedBy", Services.getValue(rootXPath + "/OwnedBy") );
		Services.setValue(WARRANT_XPATH + "/ToTransfer", Services.getValue(rootXPath + "/ToTransfer") );
		Services.endTransaction();
		
		addClaimaintsDefendants(selectedResultRow);
		populatePartyAgainstList(selectedResultRow);
		
		// Retrieve the details of the warrant
		var params = new ServiceParams();
		params.addSimpleParameter("warrantID", warrantID);
		Services.callService("getWarrantReturns", params, SearchResultsLOVGrid, true);			
	}
}

/**
 * @param resultDom
 * @author jz89bc
 * 
 */
SearchResultsLOVGrid.onSuccess = function(resultDom) 
{
	Services.startTransaction();
	if (resultDom != null) 
	{
		// Insert the Warrant Returns into the DOM
		var results = resultDom.selectSingleNode("/ds/WarrantReturns");
		Services.replaceNode("/ds/WarrantReturns", results);
		
		// Also store the warrant returns in a non-editable part of the dom so I have a copy of the 
		// originally loaded data as stored in the database. I need this for the validation rule for the
		// appointment date, which should only fire if the data has been edited ie. it should not fire
		// for saved data unless the user changes it.
		// I store the original so I can work out if the data has changed.
		Services.replaceNode("/ds/var/page/OriginalLoadedData/WarrantReturns", results);		

		// Insert the Payment Details into the DOM
		var paymentNode = resultDom.selectSingleNode("/ds/PaymentDetails");
		Services.replaceNode("/ds/PaymentDetails", paymentNode);
		
		// Insert the Additional Info into the DOM
		var additionalInfoNode = resultDom.selectSingleNode("/ds/AdditionalInfo");
		Services.replaceNode("/ds/AdditionalInfo", additionalInfoNode);
		
		// Set flag to mark that the warrant has >0 warrant returns
		var nodeCount = Services.countNodes("/ds/WarrantReturns/WarrantEvents/WarrantEvent");
		var warrantReturnFlag = "N";
		for (var i = 1; i <= nodeCount; i++)
		{
			if ( Services.getNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent[position()=" + i +"]/WarrantID") == null )
			{
				Services.removeNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent[position()=" + i + "]");
			}
			else if ( !CaseManUtils.isBlank(Services.getNode("/ds/WarrantReturns/WarrantEvents/WarrantEvent[position()=" + i +"]/WarrantID").text) )
			{
				warrantReturnFlag = "Y";
			}
		}
		
		// Set global variable warrantID if blank or not equal to form parameter
		// This is because the warrantID keeps somehow getting reset to former value
		// after calling getWarrantReturns service
		var formParamWarrantID = Services.getValue(WarrantReturnsParams.WARRANT_ID);
		if ( CaseManUtils.isBlank(warrantID) || ( !CaseManUtils.isBlank(formParamWarrantID) && warrantID != formParamWarrantID) )
		{
			warrantID = formParamWarrantID;
		}
		Services.setValue(HAS_WARRANT_RETURNS, warrantReturnFlag);
		Services.setValue(DISABLE_HEADER_PANEL, "Y");
		Services.setValue(GRID_REFRESH, "Y");
		Services.setValue(CHANGES_MADE_XPATH, "N");
		Services.setFocus("Details_ReturnCode_Txt");
		
		// Clear the Oracle Report Court Code constant when load Warrant Returns - TRAC 2849
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, "");
	}
	
	Services.endTransaction();
}

/**
 * @param exception
 * @author jz89bc
 * 
 */
SearchResultsLOVGrid.onBusinessException = function(exception) 
{
	alert("Unable to load warrant details.");
}

/**
 * @param exception
 * @author jz89bc
 * 
 */
SearchResultsLOVGrid.onSystemException = function(exception) 
{
	alert("Unable to load warrant details.");
}

/**
 * @author jz89bc
 * @return "Header_WarrantNumber_Txt"  
 */
SearchResultsLOVGrid.nextFocusedAdaptorId = function() 
{
	return "Header_WarrantNumber_Txt";
}

/*****************************************************************************************************************
																				POPUP FUNCTIONS
*****************************************************************************************************************/

Add_Return_Date.tabIndex = 35;
Add_Return_Date.componentName = "Date Entered";
Add_Return_Date.helpText = "Date return entered";
Add_Return_Date.isMandatory = function() { return true; }
Add_Return_Date.isTemporary = function() { return true; }
Add_Return_Date.isReadOnly = function() { return true; }

/**********************************************************************************/

Add_Code_Txt.tabIndex = -1;
Add_Code_Txt.maxLength = 3;
Add_Code_Txt.componentName = "Code";
Add_Code_Txt.helpText = "The appropriate code for the return made by the bailiff";
Add_Code_Txt.isReadOnly = function() { return true; }
Add_Code_Txt.isTemporary = function() { return true; }

/**********************************************************************************/

Add_Return_Txt.tabIndex = -1;
Add_Return_Txt.maxLength = 80;
Add_Return_Txt.componentName = "Return Text";
Add_Return_Txt.helpText = "A description of the warrant return code";
Add_Return_Txt.transformToDisplay = toUpperCase;
Add_Return_Txt.transformToModel = toUpperCase;
Add_Return_Txt.isReadOnly = function() { return true; }
Add_Return_Txt.isTemporary = function() { return true; }

/**********************************************************************************/

Add_AdditionalDetails_Txt.tabIndex = 38;
Add_AdditionalDetails_Txt.maxLength = 140;
Add_AdditionalDetails_Txt.componentName = "Additional Details";
Add_AdditionalDetails_Txt.helpText = "Additional information regarding the return code";
Add_AdditionalDetails_Txt.transformToDisplay = toUpperCase;
Add_AdditionalDetails_Txt.transformToModel = convertToUpperStripped;
Add_AdditionalDetails_Txt.isTemporary = function() { return true; }
Add_AdditionalDetails_Txt.mandatoryOn = [Add_Code_Txt.dataBinding];
Add_AdditionalDetails_Txt.isMandatory = function() 
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	if (returnCode == "AX" || returnCode == "AY" || returnCode == "147")
	{
		return true;
	}
	return false;
}

Add_AdditionalDetails_Txt.validate = function()
{
	var ec = null;
	var additionalDetails = Services.getValue(this.dataBinding);
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	if (!CaseManUtils.isBlank(additionalDetails))
	{
		if (returnCode == "147")
		{
			var testCourtName = Services.getValue(REF_DATA_XPATH + "/Courts/Court[./Name=" + this.dataBinding + "]/Code");
			if (testCourtName == null)
			{
				ec = ErrorCode.getErrorCode("CaseMan_validCourtMustBeEntered_Msg");
			}
		}
	}
	else
	{
		// Make sure value is blank rather than a number of spaces
		Services.setValue(this.dataBinding, "");
	}
	return ec;
}

/**********************************************************************************/

Add_Notice_Check.tabIndex = 39;
Add_Notice_Check.componentName = "Notice";
Add_Notice_Check.helpText = "Indication of whether a notice should be printed";
Add_Notice_Check.modelValue = { checked: 'Y', unchecked: 'N' };
Add_Notice_Check.isTemporary = function() { return true; }
Add_Notice_Check.isMandatory = function() { return true; }
Add_Notice_Check.readOnlyOn = [Add_Code_Txt.dataBinding];
Add_Notice_Check.isReadOnly = function()
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	return (returnCode == "AX" || returnCode == "AY");
}

/**********************************************************************************/

Add_Defendant_Sel.srcData = VAR_PAGE_XPATH + "/PartyAgainstList";
Add_Defendant_Sel.rowXPath = "*";
Add_Defendant_Sel.keyXPath = "Number";
Add_Defendant_Sel.displayXPath = "Name";
Add_Defendant_Sel.tabIndex = 40;
Add_Defendant_Sel.componentName = "Party Against";
Add_Defendant_Sel.helpText = "The party against which this return relates";
Add_Defendant_Sel.isTemporary = function() { return true; }
Add_Defendant_Sel.isMandatory = function() { return true; }
Add_Defendant_Sel.logicOn = [Add_Code_Txt.dataBinding];
Add_Defendant_Sel.logic = function()
{
	if (!Services.exists(VAR_PAGE_XPATH + "/PartyAgainstList/Defendant2"))
	{
		Services.setValue(this.dataBinding, Services.getValue(VAR_PAGE_XPATH + "/PartyAgainstList/Defendant1/Number"));
	}
}

/**********************************************************************************/

Add_Appointment_Date.tabIndex = 41;
Add_Appointment_Date.componentName = "Appointment Date";
Add_Appointment_Date.helpText = "Enter the date of the appointment";
Add_Appointment_Date.isTemporary = function() { return true; }
Add_Appointment_Date.readOnlyOn = [Add_Code_Txt.dataBinding];
Add_Appointment_Date.isReadOnly = function()
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	return (returnCode != "NE" && returnCode != "AI");
}

Add_Appointment_Date.mandatoryOn = [Add_Code_Txt.dataBinding]
Add_Appointment_Date.isMandatory = function()
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	return (returnCode == "NE" || returnCode == "AI");
}

Add_Appointment_Date.validateOn = [Add_Appointment_Date.dataBinding];
Add_Appointment_Date.validate = function()
{	
	var ec = null;
	var value = Services.getValue(this.dataBinding);

	if (!CaseManUtils.isBlank(value))
	{
		var date = CaseManUtils.createDate(value);
		
		// Check if date is an invalid format
		if (date == null)
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			
			// Check date is not in the past
			if (CaseManUtils.compareDates(today, date) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInThePast_Msg");
			}
			if (ec == null)
			{
				var testError = validateNonWorkingDate(value); // Public holiday check
				if (testError != null || date.getDay() == "0") // Sunday check
				{
					ec = ErrorCode.getErrorCode("CaseMan_dateNonAppointmentDate_Msg");
				}
			}
		}
	}
	
	return ec;	
}

/**********************************************************************************/

Add_AppointmentTime_Txt.tabIndex = 42;
Add_AppointmentTime_Txt.maxLength = 5;
Add_AppointmentTime_Txt.componentName = "Appointment Time";
Add_AppointmentTime_Txt.helpText = "Enter the time of the appointment";
Add_AppointmentTime_Txt.isTemporary = function() { return true; }
Add_AppointmentTime_Txt.readOnlyOn = [Add_Code_Txt.dataBinding];
Add_AppointmentTime_Txt.isReadOnly = function()
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	return (returnCode != "NE" && returnCode != "AI");
}

Add_AppointmentTime_Txt.mandatoryOn = [Add_Code_Txt.dataBinding];
Add_AppointmentTime_Txt.isMandatory = function()
{
	var returnCode = Services.getValue(Add_Code_Txt.dataBinding);
	return (returnCode == "NE" || returnCode == "AI");
}

/**
 * Validate, TransformToDisplay & TransformToModel updated/added as part of fix for defect 5652
 * which maintains a screen time of hh:mm and converts to a model time of seconds after midnight.
 */
Add_AppointmentTime_Txt.validate = function()
{	
	var time = Services.getValue(Add_AppointmentTime_Txt.dataBinding);
	var xpath = LOV_WARRANT_EVENTS_XPATH + "/AppointmentTimeValid";
	return validateTimeAt(time, xpath);
}

Add_AppointmentTime_Txt.transformToDisplay = function(value)
{
	var xpath = LOV_WARRANT_EVENTS_XPATH + "/AppointmentTimeValid";
	return transformToDisplayTime(value, xpath);
}

Add_AppointmentTime_Txt.transformToModel = function(value)
{
	var xpath = LOV_WARRANT_EVENTS_XPATH + "/AppointmentTimeValid";
	return transformToModelTime(value, xpath);	
}

/**********************************************************************************/

Add_Receipt_Date.tabIndex = 43;
Add_Receipt_Date.componentName = "Return Date";
Add_Receipt_Date.helpText = "Date of warrant return";
Add_Receipt_Date.isMandatory = function() { return true; }
Add_Receipt_Date.isTemporary = function() { return true; }
Add_Receipt_Date.updateMode = "clickCellMode";
Add_Receipt_Date.validateOn = [Add_Receipt_Date.dataBinding, Add_Return_Date.dataBinding];
Add_Receipt_Date.validate = function()
{
	var ec = null;
	var value = Services.getValue(this.dataBinding);
	
	if (!CaseManUtils.isBlank(value))
	{
		var date = CaseManUtils.createDate(value);

		// Check if date is an invalid format
		if (date == null)
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(SYSTEMDATE_XPATH) );
			var monthAgo = CaseManUtils.oneMonthEarlier(today);
			
			// Check if date is more than 1 month in the past
			if (CaseManUtils.compareDates(monthAgo, date) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateMoreThanOneMonthInPast_Msg");
			}
			// Check date is not in the future
			if (CaseManUtils.compareDates(today, date) == 1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
			}
			if (ec == null)
			{
				// Check date is before date entered
				var dateEntered = CaseManUtils.createDate(Services.getValue(Add_Return_Date.dataBinding));
				if (dateEntered != null) {
					if (CaseManUtils.compareDates(dateEntered, date) == 1)
					{
					ec = ErrorCode.getErrorCode("CaseMan_returnDateMustBeBeforeDateEntered_Msg");
					}
				}
			}
			if (ec == null)
			{
				// Check date is not on a weekend or a public holiday
				ec = validateNonWorkingDate(value); // Public holiday check
				if (ec == null)
				{
					var day = date.getDay();
					if (day == "6" || day == "0") // Saturday or Sunday check
					{
						ec = ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
					}
				}
			}
		}
	}

	return ec;
}

/**********************************************************************************/

function Add_Save_Btn() {};
Add_Save_Btn.tabIndex = 44;
Add_Save_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "Warrant_Returns_Popup" } ]
	}
};

Add_Save_Btn.enableOn = [Add_Return_Date.dataBinding, Add_AdditionalDetails_Txt.dataBinding, Add_Defendant_Sel.dataBinding, Add_Appointment_Date.dataBinding, Add_AppointmentTime_Txt.dataBinding, Add_Receipt_Date.dataBinding];
Add_Save_Btn.isEnabled = function()
{
	var retDateValue = Services.getValue(Add_Return_Date.dataBinding);
	var retDateObject = Services.getAdaptorById("Add_Return_Date");
	if ( CaseManUtils.isBlank(retDateValue) || !retDateObject.getValid() )
	{
		// Return date field is blank, disable button
		return false;
	}

	var additionalDetails = Services.getValue(Add_AdditionalDetails_Txt.dataBinding);
	if ( ( Add_AdditionalDetails_Txt.isMandatory() && CaseManUtils.isBlank(additionalDetails) ) ||
		  null != Add_AdditionalDetails_Txt.validate() )
	{
		// Additional Details is either Mandatory and blank or is invalid, disable button.
		return false;
	}
	
	var defSelValue = Services.getValue(Add_Defendant_Sel.dataBinding);
	var defSelObject = Services.getAdaptorById("Add_Defendant_Sel");
	if ( CaseManUtils.isBlank(defSelValue) || !defSelObject.getValid() )
	{
		// Defendant Select field is either blank (is always mandatory) or is invalid, disable button.
		return false;
	}
	
	var appDateValue = Services.getValue(Add_Appointment_Date.dataBinding);
	var appDateObject = Services.getAdaptorById("Add_Appointment_Date");
	if ( ( Add_Appointment_Date.isMandatory() && CaseManUtils.isBlank(appDateValue) ) || !appDateObject.getValid() )
	{
		// Appointment Date is either Mandatory and blank or is invalid, disable button.
		return false;
	}
	
	var appTimeValue = Services.getValue(Add_AppointmentTime_Txt.dataBinding);
	if ( ( Add_AppointmentTime_Txt.isMandatory() && CaseManUtils.isBlank(appTimeValue) ) || 
		 null != Add_AppointmentTime_Txt.validate() )
	{
		// Appointment Time is either Mandatory and blank or is invalid, disable button.
		return false;
	}
	
	var recDateValue = Services.getValue(Add_Receipt_Date.dataBinding);
	var recDateObject = Services.getAdaptorById("Add_Receipt_Date");
	if ( CaseManUtils.isBlank(recDateValue) || !recDateObject.getValid() )
	{
		// Receipt Date is either blank (is always mandatory) or is invalid, disable button.
		return false;
	}
	
	// All fields are now valid
	return true;
}

/**
 * @author jz89bc
 * 
 */
Add_Save_Btn.actionBinding = function()
{
	if ( Add_Save_Btn.isEnabled() )
	{
		// Only commit if the Save button is enabled (fields on popup are valid)
		saveData();
		Services.setFocus("Details_ReturnCode_Txt");
	}
}

/**********************************************************************************/

function Add_Cancel_Btn() {};
Add_Cancel_Btn.tabIndex = 45;
Add_Cancel_Btn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Warrant_Returns_Popup" } ]
	}
};
/**
 * @author jz89bc
 * 
 */
Add_Cancel_Btn.actionBinding = function()
{
	Services.dispatchEvent("Warrant_Returns_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	Services.setValue(Details_ReturnCode_Txt.dataBinding, "");
	Services.setFocus("Details_ReturnCode_Txt");
}

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";

Progress_Bar.isReadOnly = function() { return true; }	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author jz89bc
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
}

/************************** SUPER LOGIC DIVS **************************************/

/**
 * Logic to replace the framework's wordprocessor launch when double click the grid
 * Is a Super Logic GUI Adaptor that we can control ourselves
 * @author jz89bc
 * 
 */
function launchOutputLogic() {}

launchOutputLogic.additionalBindings = {
	eventBinding: {
		singleClicks: [],
		doubleClicks: [ {element: "Details_Results_Grid"} ],
		keys: []
	}
};

launchOutputLogic.logic = function()
{
	var selectedWarrantReturnXPath = WARRANT_EVENTS_XPATH + "/WarrantEvent[./SurrogateKey = " + Details_Results_Grid.dataBinding + "]";
	var countOutputs = Services.countNodes(selectedWarrantReturnXPath + "/Outputs/Output");
	if ( countOutputs == 1 ){
		var outputId = Services.getValue(selectedWarrantReturnXPath + "/Outputs/Output/OutputId");
		var outputType = Services.getValue(selectedWarrantReturnXPath + "/Outputs/Output/Type");
		if ( outputType == "WP" ) {
			var documentId = Services.getValue(selectedWarrantReturnXPath + "/Outputs/Output/DocumentId");
			if (null == documentId || documentId == "") {
				Services.setValue(selectedWarrantReturnXPath + "/Outputs/Output/Request", "Create"); }
			else {
				Services.setValue(selectedWarrantReturnXPath + "/Outputs/Output/Request", "Open"); }
			var caseNumber = Services.getValue(selectedWarrantReturnXPath + "/CaseNumber");
			var caseType = Services.getValue(selectedWarrantReturnXPath + "/CaseType");
			if (caseType == null) caseType = "";		
			var eventSeq = Services.getValue(selectedWarrantReturnXPath + "/CaseEventSeq");
			if (eventSeq == null) eventSeq = "";
			var warrantId = Services.getValue(selectedWarrantReturnXPath + "/WarrantID");
			var partyAgainst = Services.getValue(selectedWarrantReturnXPath + "/Defendant");
			var warrantReturnsId = Services.getValue(selectedWarrantReturnXPath + "/WarrantReturnsID");
			var returnType = Services.getValue(selectedWarrantReturnXPath + "/ReturnType");
			var returnCode = Services.getValue(selectedWarrantReturnXPath + "/Code");
			var welshParties = Services.getValue("/ds/AdditionalInfo/WelshParties");
			var eventStdId = "";
			
			if ("FN" == returnCode || "NV" == returnCode || "NP" == returnCode || "NE" == returnCode || "AE" == returnCode || "AI" == returnCode || "AX" == returnCode || "AY" == returnCode )
			{
				eventStdId = "0-InterimReturn-"+returnCode;
			}
			else if ("159" == returnCode || "160" == returnCode || "DO" == returnCode)
			{
				eventStdId = "0-FinalReturn-"+returnCode;	
			}	
				
				
			var wpNode = Services.getNode(selectedWarrantReturnXPath + "/Outputs/Output");
			var wpDom = XML.createDOM();
			wpDom.loadXML(wpNode.xml);
			var txDOM = XML.createDOM();
			txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
	          "<xsl:output method='xml' indent='yes' />" +
	          "<xsl:template match='Output'>" +
	               "<WordProcessing>" +
	               		"<Event>" +
		               		"<CaseEventSeq>" + eventSeq + "</CaseEventSeq>" +
	               			"<StandardEventId>" + eventStdId + "</StandardEventId>" +
	               			"<WarrantReturnsId>" + warrantReturnsId + "</WarrantReturnsId>"+	
	               			"<PartyAgainstNumber>" + partyAgainst + "</PartyAgainstNumber>"+	               			
	               		"</Event>" +
	               		"<Case>" +
		               		"<CaseNumber>" + caseNumber + "</CaseNumber>" +
	               			"<CaseType>" + caseType + "</CaseType>" +
	               			"<WarrantId>" + warrantId + "</WarrantId>"+	               			
	               			"<PartyAgainstNumber>" + partyAgainst + "</PartyAgainstNumber>"+
							"<WelshTranslation>" + welshParties + "</WelshTranslation>" +
	               		"</Case>" +
	                    "<xsl:apply-templates />" +
	               "</WordProcessing>" +
	          "</xsl:template>" +
	          "<xsl:template match='node()|@*'>" +
	               "<xsl:copy>" +
	                    "<xsl:apply-templates select='node()|@*' />" +
	               "</xsl:copy>" +
	          "</xsl:template></xsl:stylesheet>");
			var newDom = XML.createDOM();
			newDom.loadXML(wpDom.transformNode(txDOM));
			WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.WARRANT_RETURNS_FORM, true);
		}
	}
}

/**
 * @author jz89bc
 * 
 */
function ReprintOracleReport()
{
}

/**
 * @param resultDom
 * @author jz89bc
 * 
 */
ReprintOracleReport.onSuccess = function(resultDom)
{
	alert("Report Printed.");
}
