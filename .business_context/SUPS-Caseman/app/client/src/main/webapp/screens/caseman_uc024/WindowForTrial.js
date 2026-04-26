/** 
 * @fileoverview WindowForTrial.js:
 * This file contains the configurations for the UC024 - Maintain Window for Trial screen
 *
 * @author Chris Vincent
 *
 * Change History:
 * 14/06/2006 - Chris Vincent, changed transform to model on Judge field to strip
 *				out trailing and leading whitespace.
 * 22/08/2006 - Chris Vincent, fixed defect 4571 so that when exit an LOV, the next available
 * 				field has focus.
 * 25/08/2006 - Chris Vincent, updated the WindowForTrial_StatusLOVGrid.logic function to only
 * 				run when the LOV Grid Ok button fires and not the Cancel button as well.  Defect
 * 				4607.
 * 18/09/2006 - Chris Vincent, added the F6 keybinding to the WindowForTrial_ReasonForAdjournment field
 * 				on the WindowForTrial_ReasonForAdjournmentLOVGrid.raise configuration.  Post Build X
 * 				issue #15.
 */

/****************************** MAIN FORM *****************************************/

function windowForTrial() {}

/**
 * @author rzxd7g
 * 
 */
windowForTrial.initialise = function()
{
	// Set the case number passed in from another screen
	var caseNumber = Services.getValue(MaintainWftParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank( caseNumber ) )
	{
		// Refresh case data
		retrieveCaseData();
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
windowForTrial.onSuccess = function(dom)
{
	// Select the main node
	var data = dom.selectSingleNode(XPathConstants.DATA_XPATH);
	if( null != data )
	{
		Services.startTransaction();
		Services.replaceNode(XPathConstants.DATA_XPATH, data);
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "false");
		
		var caseType = Services.getValue(XPathConstants.CASE_XPATH + "/CaseType");
		CaseManUtils.setPartiesForHeaderGrid(caseType, XPathConstants.CASE_XPATH + "/Parties/Party", "PartyRoleCode");
		Services.endTransaction();
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
windowForTrial.onError = function(exception)
{
	alert(Messages.UNABLELOADDATA_MESSAGE);
	NavigationController.lastScreen();
}

// Load the reference data from the xml into the model
windowForTrial.refDataServices = [
	{name:"ReasonsForAdjournment", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getReasonForAdjList", serviceParams:[] },
	{name:"TrackList", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getTrackList", serviceParams:[] },
	{name:"WFTStatuses", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getWftStatusList", serviceParams:[] },
	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]}
];

/******************************* SUB-FORMS *****************************************/

function addNewWFT_subform() {}

addNewWFT_subform.subformName = "AddNewWFTSubform";

addNewWFT_subform.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_AddWindowForTrialButton"} ],
		keys: [ { key: Key.F2, element: "windowForTrial" } ]
	}
};

addNewWFT_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.NEWWFT_XPATH } ];

/**
 * @author rzxd7g
 * 
 */
addNewWFT_subform.processReturnedData = function() 
{
	Services.startTransaction();
	
	// Get the next Id in the sequence
	var id = generateWFTId();
	
	// Check to see if end date (and therefore start date) have been entered.
	var datesExistValue = "true";
	if ( CaseManUtils.isBlank( Services.getValue( XPathConstants.NEWWFT_XPATH + "/EndDate" ) ) )
	{
		datesExistValue = "false";
	}
	
	// Set the non-field values
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/CaseNumber", Services.getValue(Header_CaseNumber.dataBinding) );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/CurrentCourtCode", Services.getValue(Header_OwningCourtCode.dataBinding) );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/WFTId", id );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/Status", FormConstants.STATUS_NEW );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/StartAndEndDatesSet", datesExistValue );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/WFTStatus", WFTStatusesEnum.OUTSTANDING );
	Services.setValue( XPathConstants.NEWWFT_XPATH + "/StatusDate", CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	Services.addNode( Services.getNode(XPathConstants.NEWWFT_XPATH), XPathConstants.DATA_XPATH + "/WindowsForTrial");

	var wftXPathString = XPathConstants.DATA_XPATH + "/WindowsForTrial/WindowForTrial[./WFTId = '" + id + "']";
	var startDate = Services.getValue(wftXPathString + "/StartDate");
	var endDate = Services.getValue(wftXPathString + "/EndDate");

	// Check to see if data needs to be written to the event details field
	setEventDetails(wftXPathString, startDate, endDate, datesExistValue);

	// If start date and end date are provided, generate the dates for exclusion.
	if ( !CaseManUtils.isBlank( startDate ) && !CaseManUtils.isBlank( endDate ) )
	{
		// Add the Date nodes.
		dateArray = getDateArray( startDate, endDate );
		var blankNode = Services.loadDOMFromURL("NewDate.xml");
		for ( var i=0, l=dateArray.length; i<l; i++ )
		{
			var newDateNode = blankNode.cloneNode(true);
			newDateNode.selectSingleNode("/Date/Value").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( dateArray[i] ) ) );
			newDateNode.selectSingleNode("/Date/Excluded").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( "false" ) ) );
			Services.addNode(newDateNode, wftXPathString + "/Dates");
		}
		Services.setValue(wftXPathString + "/ExcludedDatesGenerated", "true");
	}
	else
	{
		Services.setValue(wftXPathString + "/ExcludedDatesGenerated", "false");
	}
	
	// Point the grid at the new record
	Services.setValue(Master_WindowForTrialGrid.dataBinding, id);

	// Ensure the changes made flag is set
	setChangesMade();
	Services.endTransaction();
}

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
addNewWFT_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/********************************** POPUPS *****************************************/

function ExcludedDates_Popup() {};

/**
 * @author rzxd7g
 * 
 */
ExcludedDates_Popup.prePopupPrepare = function()
{
	Services.startTransaction();
	
	// Remove previously selected rows
	Services.removeNode(ExludedDatesPopup_ExcludedDatesGrid.dataBinding);
	
	// Check if the included dates have been generated yet
	if ( Services.getValue(XPathConstants.EXCLUDED_DATES_GEN_XPATH) == "false" )
	{
		var sd = Services.getValue(WindowForTrial_StartDate.dataBinding);
		var ed = Services.getValue(WindowForTrial_EndDate.dataBinding);
	
		// Get an array of all the working days between the start and end dates
		// then add the ones that have not already been excluded.
		dateArray = getDateArray( sd, ed );
		var blankNode = Services.loadDOMFromURL("NewDate.xml");
		for ( var i=0, l=dateArray.length; i<l; i++ )
		{
			if ( Services.countNodes(XPathConstants.WFT_XPATH + "/Dates/Date[./Value = '" + dateArray[i] + "']") == 0)
			{
				var newDateNode = blankNode.cloneNode(true);
				newDateNode.selectSingleNode("/Date/Value").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( dateArray[i] ) ) );
				newDateNode.selectSingleNode("/Date/Excluded").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( "false" ) ) );
				Services.addNode(newDateNode, XPathConstants.WFT_XPATH + "/Dates");
			}
		}
		Services.setValue(XPathConstants.EXCLUDED_DATES_GEN_XPATH, "true");
	}
	Services.endTransaction();
}

ExcludedDates_Popup.lower = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "ExcludedDates_Popup" } ],
		singleClicks: [ {element: "ExludedDatesPopup_CancelButton"} ]
	}
};

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
ExcludedDates_Popup.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/******************************** LOV POPUPS ***************************************/

function WindowForTrial_StatusLOVGrid() {};
WindowForTrial_StatusLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/WFTStatus";
WindowForTrial_StatusLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/WFTStatuses";
WindowForTrial_StatusLOVGrid.rowXPath = "Status";
WindowForTrial_StatusLOVGrid.keyXPath = "Value";
WindowForTrial_StatusLOVGrid.columns = [
	{xpath: "Value"},
	{xpath: "Description"}
];

WindowForTrial_StatusLOVGrid.styleURL = "/css/WindowForTrial_StatusLOVGrid.css";
WindowForTrial_StatusLOVGrid.destroyOnClose = false;

WindowForTrial_StatusLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "WindowForTrial_StatusLOVButton"} ]
	}
};

/**
 * @author rzxd7g
 * @return "WindowForTrial_Judge"  
 */
WindowForTrial_StatusLOVGrid.nextFocusedAdaptorId = function() {
	return "WindowForTrial_Judge";
}

WindowForTrial_StatusLOVGrid.logicOn = [WindowForTrial_StatusLOVGrid.dataBinding];
WindowForTrial_StatusLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(WindowForTrial_StatusLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var wftStatus = Services.getValue(WindowForTrial_StatusLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(wftStatus) )
	{
		Services.setValue(WindowForTrial_Status.dataBinding, wftStatus);
		Services.setValue(WindowForTrial_StatusLOVGrid.dataBinding, "");
	}
}

/*********************************************************************************/

function WindowForTrial_ReasonForAdjournmentLOVGrid() {};
WindowForTrial_ReasonForAdjournmentLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/WFTReasonForAdjournment";
WindowForTrial_ReasonForAdjournmentLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/ReasonsForAdjournment";
WindowForTrial_ReasonForAdjournmentLOVGrid.rowXPath = "/Reason[./Value != 3]";
WindowForTrial_ReasonForAdjournmentLOVGrid.keyXPath = "/Description";
WindowForTrial_ReasonForAdjournmentLOVGrid.columns = [
	{xpath: "Description"}
];

WindowForTrial_ReasonForAdjournmentLOVGrid.styleURL = "/css/WindowForTrial_ReasonForAdjournmentLOVGrid.css";
WindowForTrial_ReasonForAdjournmentLOVGrid.destroyOnClose = false;
WindowForTrial_ReasonForAdjournmentLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "WindowForTrial_ReasonForAdjournmentLOVButton"} ],
		keys: [ { key: Key.F6, element: "WindowForTrial_ReasonForAdjournment" } ]
	}
};

/**
 * @author rzxd7g
 * @return "WindowForTrial_CaseManagementConferenceDate"  
 */
WindowForTrial_ReasonForAdjournmentLOVGrid.nextFocusedAdaptorId = function() {
	return "WindowForTrial_CaseManagementConferenceDate";
}

WindowForTrial_ReasonForAdjournmentLOVGrid.logicOn = [WindowForTrial_ReasonForAdjournmentLOVGrid.dataBinding];
WindowForTrial_ReasonForAdjournmentLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(WindowForTrial_ReasonForAdjournmentLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var wftReason = Services.getValue(WindowForTrial_ReasonForAdjournmentLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(wftReason) )
	{
		Services.startTransaction();
    	Services.setValue(WindowForTrial_ReasonForAdjournment.dataBinding, wftReason);
		Services.setValue(WindowForTrial_ReasonForAdjournmentLOVGrid.dataBinding, "");
		Services.endTransaction();
    }
}

/********************************** GRIDS *****************************************/

function Header_PartyTypeListGrid() {};
Header_PartyTypeListGrid.tabIndex = 1;
Header_PartyTypeListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Header_PartyTypeListGrid.srcDataOn = [XPathConstants.CASE_XPATH + "/Parties/Party/DisplayInHeader"];
Header_PartyTypeListGrid.srcData = XPathConstants.CASE_XPATH + "/Parties";
Header_PartyTypeListGrid.rowXPath = "Party[./DisplayInHeader = 'true']";
Header_PartyTypeListGrid.keyXPath = "SubjectPartyKey";
Header_PartyTypeListGrid.columns = [
	{xpath: "PartyRoleDescription"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

/*********************************************************************************/

function Master_WindowForTrialGrid() {};

/** Records with a Window for Trial status of OUTSTANDING are listed first followed 
 *  by other statuses in alphabetical order.  Records with the same status are listed 
 *  in order of start date (earliest first) with those records not having a start 
 *  date listed first.
 * @param a
 * @param b
 * @author rzxd7g
 * @return 1 , -1 , 0  
 */
Master_WindowForTrialGrid.sortStatusColumn = function(a,b)
{
	if ( a == "OUTSTANDING" && b != "OUTSTANDING" )
	{
		return 1;
	}
	else if ( a != "OUTSTANDING" && b == "OUTSTANDING" )
	{
		return -1;
	}
	else if ( a == "OUTSTANDING" && b == "OUTSTANDING" )
	{
		return 0;
	}
	else if ( a < b )
	{
		return 1;
	}
	else if ( a > b )
	{
		return -1;
	}
	else
	{
		return 0;
	}	
}

/**
 * Sort function is slightly different to the CaseManUtils function.
 * Sorts date ascending (earliest first), but displays blank dates
 * above all overs.
 * @param a
 * @param b
 * @author rzxd7g
 * @return 1 , -1 , 0  
 */
Master_WindowForTrialGrid.sortDateColumn = function(a,b)
{
	// Blank dates are listed first
	if ((a == null || a == "") && (b != null || b != "")){ 
		return  1;
	}
	else if ((a != null || a != "") && (b == null || b == "")){
		return -1;
	}
	else if ((a == null || a == "") && (b == null || b == "")){
		return 0;
	}
	var Date1 = CaseManUtils.createDate(a);
	var Date2 = CaseManUtils.createDate(b);

	var difference = Date1 - Date2;
	if (difference < 0){
		return 1;
	}
	if (difference > 0){
		return -1;
	}
	else{
		return 0;
	}
}

Master_WindowForTrialGrid.componentName = "Master Window for Trial Grid";
Master_WindowForTrialGrid.tabIndex = 2;
Master_WindowForTrialGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedWFT";
Master_WindowForTrialGrid.srcData = XPathConstants.DATA_XPATH + "/WindowsForTrial";
Master_WindowForTrialGrid.rowXPath = "WindowForTrial";
Master_WindowForTrialGrid.keyXPath = "WFTId";
Master_WindowForTrialGrid.columns = [
	{xpath: "StartDate", sort: Master_WindowForTrialGrid.sortDateColumn, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "EndDate", sort: Master_WindowForTrialGrid.sortDateColumn, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "WFTStatus", sort: Master_WindowForTrialGrid.sortStatusColumn, additionalSortColumns: [ { columnNumber: 0, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: transformWFTStatusToDisplay },
	{xpath: "CMCFlag"}
];

Master_WindowForTrialGrid.isEnabled = function()
{
	var gridDB = Services.getValue(Master_WindowForTrialGrid.dataBinding);
	return !CaseManUtils.isBlank(gridDB);
}

/*********************************************************************************/

function WindowForTrial_ExcludedDatesGrid() {};
WindowForTrial_ExcludedDatesGrid.tabIndex = 23;
WindowForTrial_ExcludedDatesGrid.srcDataOn = [Master_WindowForTrialGrid.dataBinding, XPathConstants.WFT_XPATH + "/Dates/Date/Excluded"];
WindowForTrial_ExcludedDatesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedExcludedDate";
WindowForTrial_ExcludedDatesGrid.srcData = XPathConstants.WFT_XPATH + "/Dates";
WindowForTrial_ExcludedDatesGrid.rowXPath = "Date[./Excluded = 'true']";
WindowForTrial_ExcludedDatesGrid.keyXPath = "Value";
WindowForTrial_ExcludedDatesGrid.columns = [
	{xpath: "Value", sort: sortWeekDays, transformToDisplay: transformWFTDayForGrid },
	{xpath: "Value", sort: sortDates, transformToDisplay: transformWFTDateForGrid },
	{xpath: "Value", sort: sortMonths, transformToDisplay: transformWFTMonthForGrid },
	{xpath: "Value", sort: "numerical", additionalSortColumns: [ { columnNumber: 2, orderOnAsc: "ascending", orderOnDesc: "descending" }, { columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: transformWFTYearForGrid }
];

WindowForTrial_ExcludedDatesGrid.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_ExcludedDatesGrid.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

/*********************************************************************************/

function ExludedDatesPopup_ExcludedDatesGrid() {};
ExludedDatesPopup_ExcludedDatesGrid.tabIndex = 40;
ExludedDatesPopup_ExcludedDatesGrid.multipleSelection = true;
ExludedDatesPopup_ExcludedDatesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedDates";
ExludedDatesPopup_ExcludedDatesGrid.srcData = XPathConstants.WFT_XPATH + "/Dates";
ExludedDatesPopup_ExcludedDatesGrid.srcDataOn = [Master_WindowForTrialGrid.dataBinding, XPathConstants.WFT_XPATH + "/Dates/Date/Excluded"];
ExludedDatesPopup_ExcludedDatesGrid.rowXPath = "Date[./Excluded = 'false']";
ExludedDatesPopup_ExcludedDatesGrid.keyXPath = "Value";
ExludedDatesPopup_ExcludedDatesGrid.columns = [
	{xpath: "Value", sort: sortWeekDays, transformToDisplay: transformWFTDayForGrid },
	{xpath: "Value", sort: sortDates, transformToDisplay: transformWFTDateForGrid },
	{xpath: "Value", sort: sortMonths, transformToDisplay: transformWFTMonthForGrid },
	{xpath: "Value", sort: "numerical", additionalSortColumns: [ { columnNumber: 2, orderOnAsc: "ascending", orderOnDesc: "descending" }, { columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending", transformToDisplay: transformWFTYearForGrid }
];

/***************************** DATA BINDINGS **************************************/

Header_CaseNumber.dataBinding = XPathConstants.CASE_XPATH + "/CaseNumber";
Header_OwningCourtCode.dataBinding = XPathConstants.CASE_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.CASE_XPATH + "/OwningCourt";

WindowForTrial_Track.dataBinding = XPathConstants.WFT_XPATH + "/Track";
WindowForTrial_StartDate.dataBinding = XPathConstants.WFT_XPATH + "/StartDate";
WindowForTrial_EndDate.dataBinding = XPathConstants.WFT_XPATH + "/EndDate";
WindowForTrial_Days.dataBinding = XPathConstants.WFT_XPATH + "/Days";
WindowForTrial_Hours.dataBinding = XPathConstants.WFT_XPATH + "/Hours";
WindowForTrial_Mins.dataBinding = XPathConstants.WFT_XPATH + "/Mins";
WindowForTrial_Status.dataBinding = XPathConstants.WFT_XPATH + "/WFTStatus";
WindowForTrial_StatusDate.dataBinding = XPathConstants.WFT_XPATH + "/StatusDate";
WindowForTrial_Judge.dataBinding = XPathConstants.WFT_XPATH + "/Judge";
WindowForTrial_ReasonForAdjournment.dataBinding = XPathConstants.WFT_XPATH + "/ReasonForAdjournment";
WindowForTrial_CaseManagementConferenceDate.dataBinding = XPathConstants.WFT_XPATH + "/CMCDate";
WindowForTrial_CaseManagementConferenceFlag.dataBinding = XPathConstants.WFT_XPATH + "/CMCFlag";
WindowForTrial_Notes.dataBinding = XPathConstants.WFT_XPATH + "/Notes";

/********************************* FIELDS ******************************************/

function Header_CaseNumber() {}
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.maxLength = 8;
Header_OwningCourtCode.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.isTemporary = function() { return true; }
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isTemporary = function() { return true; }
Header_OwningCourtCode.isMandatory = function() { return true; }
Header_OwningCourtCode.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isTemporary = function() { return true; }
Header_OwningCourtName.isMandatory = function() { return true; }
Header_OwningCourtName.isReadOnly = function() { return true; }

/*********************************************************************************/

function WindowForTrial_Track() {}
WindowForTrial_Track.srcData = XPathConstants.REF_DATA_XPATH + "/TrackList";
WindowForTrial_Track.rowXPath = "/Track";
WindowForTrial_Track.keyXPath = "/Value";
WindowForTrial_Track.displayXPath = "/Description";
WindowForTrial_Track.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Track.tabIndex = 10;
WindowForTrial_Track.helpText = "Track case is assigned to";
WindowForTrial_Track.componentName = "Track";

WindowForTrial_Track.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Track.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Track.isMandatory = function() { return true; }
WindowForTrial_Track.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Track.isReadOnly = transferredWFTExist;

/*********************************************************************************/

function WindowForTrial_StartDate() {}
WindowForTrial_StartDate.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_StartDate.tabIndex = 11;
WindowForTrial_StartDate.maxLength = 11;
WindowForTrial_StartDate.helpText = "Date of start of Window for Trial";
WindowForTrial_StartDate.componentName = "Start Date";
WindowForTrial_StartDate.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_StartDate.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_StartDate.mandatoryOn = [WindowForTrial_CaseManagementConferenceFlag.dataBinding];
WindowForTrial_StartDate.isMandatory = function()
{
	return CaseManUtils.isBlank(Services.getValue(WindowForTrial_CaseManagementConferenceFlag.dataBinding));
}

WindowForTrial_StartDate.readOnlyOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding, XPathConstants.DATES_ENTERED_XPATH];
WindowForTrial_StartDate.isReadOnly = function()
{
	// Check if status is transferred
	if ( transferredWFTExist() )
	{
		return true;
	}
	// Check if dates have been committed to the database
	return Services.getValue(XPathConstants.DATES_ENTERED_XPATH) == "true";
}

WindowForTrial_StartDate.validateOn = [WindowForTrial_EndDate.dataBinding,Master_WindowForTrialGrid.dataBinding];
WindowForTrial_StartDate.validate = function()
{
	var ec = null;

	// If dates have not been set yet, validate field
	if (Services.getValue(XPathConstants.DATES_ENTERED_XPATH) != "true")
	{
		var sd = Services.getValue(WindowForTrial_StartDate.dataBinding);
		var ed = Services.getValue(WindowForTrial_EndDate.dataBinding);
		var startDate = CaseManUtils.isBlank(sd) ? null : CaseManUtils.createDate(sd);
		var endDate = CaseManUtils.isBlank(ed) ? null : CaseManUtils.createDate(ed);
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		
		if (null != startDate && null != endDate)
		{
			if (CaseManUtils.compareDates(startDate, endDate) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_wftStartDateAfterEndDate_Msg");
			}
		}
		if (null == ec && null != startDate)
		{
			if (CaseManUtils.compareDates(today, startDate) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_wftStartDateCannotBeInThePast_Msg");
			}
		}
	}
	return ec;
}

/*********************************************************************************/

function WindowForTrial_EndDate() {}
WindowForTrial_EndDate.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_EndDate.tabIndex = 12;
WindowForTrial_EndDate.maxLength = 11;
WindowForTrial_EndDate.helpText = "The end date of the Window for Trial.";
WindowForTrial_EndDate.componentName = "End Date";
WindowForTrial_EndDate.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_StartDate.dataBinding];
WindowForTrial_EndDate.isEnabled = function()
{
	// Disabled if no Windows for Trial in the grid
	if ( CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) ) )
	{
		return false;
	}
	// Disabled if the start date is blank
	return !CaseManUtils.isBlank( Services.getValue(WindowForTrial_StartDate.dataBinding) );
}

WindowForTrial_EndDate.mandatoryOn = [WindowForTrial_StartDate.dataBinding];
WindowForTrial_EndDate.isMandatory = function()
{
	// Mandatory if start date has been entered.
	return !CaseManUtils.isBlank( Services.getValue(WindowForTrial_StartDate.dataBinding) );
}

WindowForTrial_EndDate.readOnlyOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding, XPathConstants.DATES_ENTERED_XPATH];
WindowForTrial_EndDate.isReadOnly = function()
{
	// Check if status is transferred
	if ( transferredWFTExist() )
	{
		return true;
	}
	// Check if dates have been committed to the database
	return Services.getValue(XPathConstants.DATES_ENTERED_XPATH) == "true";
}

WindowForTrial_EndDate.validateOn = [WindowForTrial_StartDate.dataBinding,Master_WindowForTrialGrid.dataBinding];
WindowForTrial_EndDate.validate = function()
{
	// If dates have not been set yet, validate field
	if (Services.getValue(XPathConstants.DATES_ENTERED_XPATH) != "true")
	{
		var sd = Services.getValue(WindowForTrial_StartDate.dataBinding);
		var ed = Services.getValue(WindowForTrial_EndDate.dataBinding);
		var startDate = CaseManUtils.isBlank(sd) ? null : CaseManUtils.createDate(sd);
		var endDate = CaseManUtils.isBlank(ed) ? null : CaseManUtils.createDate(ed);
		
		if (null != startDate && null != endDate)
		{
			if (CaseManUtils.compareDates(startDate, endDate) == -1)
			{
				return ErrorCode.getErrorCode("CaseMan_wftStartDateAfterEndDate_Msg");
			}
		}
	}
	return null;
}

WindowForTrial_EndDate.logicOn = [WindowForTrial_StartDate.dataBinding, WindowForTrial_EndDate.dataBinding];
WindowForTrial_EndDate.logic = function(event)
{
	if (event.getXPath() != WindowForTrial_StartDate.dataBinding &&
		event.getXPath() != WindowForTrial_EndDate.dataBinding )
	{
		return;
	}
	
	var sd = Services.getValue(WindowForTrial_StartDate.dataBinding)
	var ed = Services.getValue(WindowForTrial_EndDate.dataBinding)
	
	// If start date is cleared, clear the end date and exit
	if (CaseManUtils.isBlank(sd))
	{
		Services.setValue(WindowForTrial_EndDate.dataBinding, "");
		return;
	}

	// If start date is invalid, exit
	if ( !Services.getAdaptorById("WindowForTrial_StartDate").getValid() )
	{
		return;
	}

	Services.startTransaction();
	
	// If have start date but no end date, set default end date based on status
	if ( !CaseManUtils.isBlank(sd) && CaseManUtils.isBlank(ed) )
	{
		var startDate = CaseManUtils.createDate(sd);
		if (null != startDate)
		{	
			var track = Services.getValue(WindowForTrial_Track.dataBinding);
			var endDate = getEndDateFromTrack(track, startDate)
			Services.setValue(WindowForTrial_EndDate.dataBinding, endDate);
			Services.setFocus("WindowForTrial_EndDate");
		}
	}
	// If start date and end date both have a value, calculate the days array
	else if ( !CaseManUtils.isBlank(sd) && !CaseManUtils.isBlank(ed) )
	{
		// Remove existing nodes
		Services.removeNode(XPathConstants.WFT_XPATH + "/Dates");
	
		// Add the Date nodes.
		dateArray = getDateArray( sd, ed );
		var blankNode = Services.loadDOMFromURL("NewDate.xml");
		for ( var i=0, l=dateArray.length; i<l; i++ )
		{
			var newDateNode = blankNode.cloneNode(true);
			newDateNode.selectSingleNode("/Date/Value").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( dateArray[i] ) ) );
			newDateNode.selectSingleNode("/Date/Excluded").appendChild( newDateNode.createTextNode( CaseManUtils.getValidNodeValue( "false" ) ) );
			Services.addNode(newDateNode, XPathConstants.WFT_XPATH + "/Dates");
		}
		Services.setValue(XPathConstants.EXCLUDED_DATES_GEN_XPATH, "true");
	}
	
	Services.endTransaction();
}

/*********************************************************************************/

function WindowForTrial_Days() {}
WindowForTrial_Days.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Days.tabIndex = 13;
WindowForTrial_Days.maxLength = 3;
WindowForTrial_Days.helpText = "Number of days estimated for trial";
WindowForTrial_Days.componentName = "Days";
WindowForTrial_Days.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Days.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Days.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Days.isReadOnly = transferredWFTExist;
WindowForTrial_Days.validateOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Days.validate = function()
{
	return validateDays(Services.getValue(WindowForTrial_Days.dataBinding));
}

/*********************************************************************************/

function WindowForTrial_Hours() {}
WindowForTrial_Hours.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Hours.tabIndex = 14;
WindowForTrial_Hours.maxLength = 1;
WindowForTrial_Hours.helpText = "Number of hours estimated for trial";
WindowForTrial_Hours.componentName = "Hours";
WindowForTrial_Hours.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Hours.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Hours.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Hours.isReadOnly = transferredWFTExist;
WindowForTrial_Hours.validateOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Hours.validate = function()
{
	return validateHours(Services.getValue(WindowForTrial_Hours.dataBinding));
}

/*********************************************************************************/

function WindowForTrial_Mins() {}
WindowForTrial_Mins.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Mins.tabIndex = 15;
WindowForTrial_Mins.maxLength = 2;
WindowForTrial_Mins.helpText = "Number of minutes estimated for trial";
WindowForTrial_Mins.componentName = "Minutes";
WindowForTrial_Mins.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Mins.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Mins.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Mins.isReadOnly = transferredWFTExist;
WindowForTrial_Mins.validateOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Mins.validate = function()
{
	return validateMinutes(Services.getValue(WindowForTrial_Mins.dataBinding));
}

/*********************************************************************************/

function WindowForTrial_Status() {}
WindowForTrial_Status.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Status.tabIndex = -1;
WindowForTrial_Status.helpText = "Status of Window for Trial record";
WindowForTrial_Status.componentName = "Status";
WindowForTrial_Status.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Status.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Status.isMandatory = function() { return true; }
WindowForTrial_Status.isReadOnly = function() { return true; }
WindowForTrial_Status.transformToDisplay = transformWFTStatusToDisplay;
WindowForTrial_Status.logicOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Status.logic = function (event)
{
	if ( event.getXPath() != WindowForTrial_Status.dataBinding )
	{
		return;
	}
	// If the status is changed to anything other than Adjourned, clear the Adjourned fields
	var status = Services.getValue(WindowForTrial_Status.dataBinding);
	if ( WFTStatusesEnum.ADJOURNED != status )
	{
		Services.startTransaction();
		Services.setValue(WindowForTrial_Judge.dataBinding, "");
		Services.setValue(WindowForTrial_ReasonForAdjournment.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function WindowForTrial_StatusDate() {}
WindowForTrial_StatusDate.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_StatusDate.tabIndex = -1;
WindowForTrial_StatusDate.maxLength = 11;
WindowForTrial_StatusDate.helpText = "Date that Status was last updated";
WindowForTrial_StatusDate.componentName = "Status Date";
WindowForTrial_StatusDate.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_StatusDate.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_StatusDate.isReadOnly = function() {	return true; }
WindowForTrial_StatusDate.logicOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_StatusDate.logic = function(event)
{
	if (event.getXPath() != WindowForTrial_Status.dataBinding &&
		event.getType() != DataModelEvent.UPDATE )
	{
		return;
	}
	Services.setValue( WindowForTrial_StatusDate.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
}

/*********************************************************************************/

function WindowForTrial_Judge() {}
WindowForTrial_Judge.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Judge.tabIndex = 17;
WindowForTrial_Judge.maxLength = 30;
WindowForTrial_Judge.helpText = "Enter Judge's name and title, e.g. District Judge Rogers";
WindowForTrial_Judge.componentName = "Judge's Name";
WindowForTrial_Judge.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding];
WindowForTrial_Judge.isEnabled = function()
{
	if (Services.getValue(WindowForTrial_Status.dataBinding) != WFTStatusesEnum.ADJOURNED)
	{
		return false;
	}
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Judge.mandatoryOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Judge.isMandatory = function()
{
	return Services.getValue(WindowForTrial_Status.dataBinding) == WFTStatusesEnum.ADJOURNED;
}

WindowForTrial_Judge.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Judge.isReadOnly = transferredWFTExist;
WindowForTrial_Judge.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

WindowForTrial_Judge.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function WindowForTrial_ReasonForAdjournment() {}
WindowForTrial_ReasonForAdjournment.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_ReasonForAdjournment.srcData = XPathConstants.REF_DATA_XPATH + "/ReasonsForAdjournment";
WindowForTrial_ReasonForAdjournment.rowXPath = "Reason[./Value != 3]";
WindowForTrial_ReasonForAdjournment.keyXPath = "Description";
WindowForTrial_ReasonForAdjournment.displayXPath = "Description";
WindowForTrial_ReasonForAdjournment.strictValidation = false;
WindowForTrial_ReasonForAdjournment.tabIndex = 18;
WindowForTrial_ReasonForAdjournment.helpText = "Reason for adjournment if status is ADJOURNED.  Select value from list or enter the reason manually.";
WindowForTrial_ReasonForAdjournment.componentName = "Reason for Adjournment";
WindowForTrial_ReasonForAdjournment.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding];
WindowForTrial_ReasonForAdjournment.isEnabled = function()
{
	if (Services.getValue(WindowForTrial_Status.dataBinding) != WFTStatusesEnum.ADJOURNED)
	{
		return false;
	}
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_ReasonForAdjournment.validate = function()
{
	var reason = Services.getValue(WindowForTrial_ReasonForAdjournment.dataBinding);
	if ( !CaseManUtils.isBlank(reason) && reason.length > 35 )
	{
		var ec = ErrorCode.getErrorCode("FW_TEXTINPUT_InvalidFieldLength");
		ec.m_message = ec.getMessage() + 35;
		return ec;
	}
	return null;
}

WindowForTrial_ReasonForAdjournment.mandatoryOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_ReasonForAdjournment.isMandatory = function()
{
	return Services.getValue(WindowForTrial_Status.dataBinding) == WFTStatusesEnum.ADJOURNED;
}

WindowForTrial_ReasonForAdjournment.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_ReasonForAdjournment.isReadOnly = transferredWFTExist;

WindowForTrial_ReasonForAdjournment.transformToDisplay = function(value)
{
	return (null == value) ? "" : value.toUpperCase();
}

WindowForTrial_ReasonForAdjournment.transformToModel = function(value)
{
	return (null == value) ? "" : value.toUpperCase();
}

/*********************************************************************************/

function WindowForTrial_CaseManagementConferenceDate() {}
WindowForTrial_CaseManagementConferenceDate.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_CaseManagementConferenceDate.tabIndex = 20;
WindowForTrial_CaseManagementConferenceDate.maxLength = 11;
WindowForTrial_CaseManagementConferenceDate.helpText = "Date of Case Management Conference";
WindowForTrial_CaseManagementConferenceDate.componentName = "Date of Case Management Conference";
WindowForTrial_CaseManagementConferenceDate.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_CaseManagementConferenceDate.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_CaseManagementConferenceDate.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_CaseManagementConferenceDate.isReadOnly = transferredWFTExist;
WindowForTrial_CaseManagementConferenceDate.validateOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_CaseManagementConferenceDate.validate = function(event)
{
	var ec = null;
	var src = event.getXPath();

	// Only validate if CMC Date is changed, do not validate existing unchanged dates.
	if ( src == WindowForTrial_CaseManagementConferenceDate.dataBinding ||
	     ( src == Master_WindowForTrialGrid.dataBinding && Services.getValue(XPathConstants.WFT_XPATH + "/CMCDateChanged") == "true" ) )
	{
		var date = Services.getValue(WindowForTrial_CaseManagementConferenceDate.dataBinding);
		if ( !CaseManUtils.isBlank(date) )
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			var dateObj = CaseManUtils.createDate(date);
			
			if (CaseManUtils.compareDates(today, dateObj) == -1)
			{
				ec = ErrorCode.getErrorCode("CaseMan_wftCMCDateCannotBeInThePast_Msg");
			}
		}
	}
	
	return ec;
}

WindowForTrial_CaseManagementConferenceDate.logicOn = [WindowForTrial_CaseManagementConferenceDate.dataBinding];
WindowForTrial_CaseManagementConferenceDate.logic = function(event)
{
	if (event.getXPath() != WindowForTrial_CaseManagementConferenceDate.dataBinding)
	{
		return;
	}
	if (!CaseManUtils.isBlank( Services.getValue(WindowForTrial_CaseManagementConferenceDate.dataBinding) ))
	{
		Services.setValue(WindowForTrial_CaseManagementConferenceFlag.dataBinding, "Y");
	}
	Services.setValue(XPathConstants.WFT_XPATH + "/CMCDateChanged", "true");
}

/*********************************************************************************/

function WindowForTrial_CaseManagementConferenceFlag() {}
WindowForTrial_CaseManagementConferenceFlag.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_CaseManagementConferenceFlag.modelValue = {checked: "Y", unchecked: ''};
WindowForTrial_CaseManagementConferenceFlag.tabIndex = 21;
WindowForTrial_CaseManagementConferenceFlag.helpText = "Tick box or enter Y if Case Management Conference entered but no date given.";
WindowForTrial_CaseManagementConferenceFlag.componentName = "Case Management Conference Flag";
WindowForTrial_CaseManagementConferenceFlag.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_CaseManagementConferenceFlag.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_CaseManagementConferenceFlag.readOnlyOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding, WindowForTrial_CaseManagementConferenceDate.dataBinding];
WindowForTrial_CaseManagementConferenceFlag.isReadOnly = function()
{
	if ( transferredWFTExist() )
	{
		return true;
	}
	return !CaseManUtils.isBlank( Services.getValue(WindowForTrial_CaseManagementConferenceDate.dataBinding) );
}

/*********************************************************************************/

function WindowForTrial_Notes() {}
WindowForTrial_Notes.retrieveOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Notes.tabIndex = 22;
WindowForTrial_Notes.maxLength = 70;
WindowForTrial_Notes.helpText = "Notes";
WindowForTrial_Notes.componentName = "Notes";
WindowForTrial_Notes.enableOn = [Master_WindowForTrialGrid.dataBinding];
WindowForTrial_Notes.isEnabled = function()
{
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

WindowForTrial_Notes.readOnlyOn = [WindowForTrial_Status.dataBinding];
WindowForTrial_Notes.isReadOnly = transferredWFTExist;
WindowForTrial_Notes.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

WindowForTrial_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/******************************** BUTTONS *****************************************/

function Master_AddWindowForTrialButton() {}
Master_AddWindowForTrialButton.tabIndex = 3;
Master_AddWindowForTrialButton.enableOn = [Master_WindowForTrialGrid.dataBinding];
Master_AddWindowForTrialButton.isEnabled = function()
{
	return !transferredWFTExist();
}

/**********************************************************************************/

function WindowForTrial_StatusLOVButton() {}
WindowForTrial_StatusLOVButton.tabIndex = 16;
WindowForTrial_StatusLOVButton.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding];
WindowForTrial_StatusLOVButton.isEnabled = function()
{
	if ( CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) ) )
	{
		return false;
	}
	return !transferredWFTExist();
}

/**********************************************************************************/

function WindowForTrial_ReasonForAdjournmentLOVButton() {}
WindowForTrial_ReasonForAdjournmentLOVButton.tabIndex = 19;
WindowForTrial_ReasonForAdjournmentLOVButton.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding];
WindowForTrial_ReasonForAdjournmentLOVButton.isEnabled = function()
{
	if (Services.getValue(WindowForTrial_Status.dataBinding) != WFTStatusesEnum.ADJOURNED)
	{
		return false;
	}
	return !CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) );
}

/**********************************************************************************/

function WindowForTrial_ExcludedDateAddButton() {}

WindowForTrial_ExcludedDateAddButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "WindowForTrial_ExcludedDatesGrid" } ]
	}
};

WindowForTrial_ExcludedDateAddButton.tabIndex = 24;
WindowForTrial_ExcludedDateAddButton.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_Status.dataBinding, WindowForTrial_StartDate.dataBinding, WindowForTrial_EndDate.dataBinding];
WindowForTrial_ExcludedDateAddButton.isEnabled = function()
{
	if ( transferredWFTExist() )
	{
		return false;
	}
	if ( CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) ) )
	{
		return false;
	}
	if (CaseManUtils.isBlank( Services.getValue(WindowForTrial_StartDate.dataBinding) ) ||
		CaseManUtils.isBlank( Services.getValue(WindowForTrial_EndDate.dataBinding) ) )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
WindowForTrial_ExcludedDateAddButton.actionBinding = function()
{
	Services.dispatchEvent("ExcludedDates_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
}

/**********************************************************************************/

function WindowForTrial_ExcludedDateRemoveButton() {}

WindowForTrial_ExcludedDateRemoveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "WindowForTrial_ExcludedDatesGrid", alt: true } ]
	}
};

WindowForTrial_ExcludedDateRemoveButton.tabIndex = 25;
WindowForTrial_ExcludedDateRemoveButton.enableOn = [Master_WindowForTrialGrid.dataBinding, WindowForTrial_ExcludedDatesGrid.dataBinding, WindowForTrial_Status.dataBinding];
WindowForTrial_ExcludedDateRemoveButton.isEnabled = function()
{
	if ( transferredWFTExist() )
	{
		return false;
	}
	if ( CaseManUtils.isBlank( Services.getValue(Master_WindowForTrialGrid.dataBinding) ) )
	{
		return false;
	}
	if (CaseManUtils.isBlank( Services.getValue(WindowForTrial_StartDate.dataBinding) ) ||
		CaseManUtils.isBlank( Services.getValue(WindowForTrial_EndDate.dataBinding) ) )
	{
		return false;
	}
	return !CaseManUtils.isBlank( Services.getValue(WindowForTrial_ExcludedDatesGrid.dataBinding) );
}

/**
 * @author rzxd7g
 * 
 */
WindowForTrial_ExcludedDateRemoveButton.actionBinding = function()
{
	// Set the currently selected date to not excluded
	Services.setValue(XPathConstants.WFT_XPATH + "/Dates/Date[./Value = " + WindowForTrial_ExcludedDatesGrid.dataBinding + "]/Excluded", "false");
	
	// Ensure the changes made flag is set
	setChangesMade();
};

/**********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "windowForTrial" } ]
	}
};

Status_SaveButton.tabIndex = 30;
/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	// If no changes to save, do nothing.
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "true")
	{
		return;
	}

	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (0 != invalidFields.length)
	{
		return;
	}
	else
	{
		// Construct DOM for the Server
		var newNode = XML.createDOM(null, null, null);
		
		// Only send back Excluded Dates
		filterExcludedDates(newNode);
		
		// Create ds node to add the MaintainWindowForTrial node to
		var dsNode = XML.createElement(newNode, "ds");
		dsNode.appendChild(Services.getNode(XPathConstants.DATA_XPATH));
		newNode.appendChild(dsNode);

		var params = new ServiceParams();
		params.addDOMParameter("caseNumber", newNode );
		Services.callService("maintainWft", params, Status_SaveButton, true);
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	var navAfterSave = Services.getValue(XPathConstants.NAVIGATE_AFTER_SAVE_IND_XPATH);
	if ( "true" == navAfterSave )
	{
		handleNavigation();
	}
	else
	{
		// Refresh the page data
		retrieveCaseData();
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onError = function(exception)
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		retrieveCaseData();
	}
	else
	{
		exitScreen();
	}
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/**********************************************************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "windowForTrial" } ]
	}
};

Status_CloseButton.tabIndex = 31;
/**
 * @author rzxd7g
 * 
 */
Status_CloseButton.actionBinding = function()
{
	// Check to see if unsaved changes exist.
	if ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "true" && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.NAVIGATE_AFTER_SAVE_IND_XPATH, "true");
		Status_SaveButton.actionBinding();
	}
	else
	{
		handleNavigation();
	}
};

/**********************************************************************************/

function ExludedDatesPopup_OkButton() {}

ExludedDatesPopup_OkButton.tabIndex = 41;

ExludedDatesPopup_OkButton.enableOn = [ExludedDatesPopup_ExcludedDatesGrid.dataBinding + "/Value"];
ExludedDatesPopup_OkButton.isEnabled = function()
{
	return Services.countNodes(ExludedDatesPopup_ExcludedDatesGrid.dataBinding + "/Value") != 0;
}

/**
 * @author rzxd7g
 * 
 */
ExludedDatesPopup_OkButton.actionBinding = function()
{
	Services.dispatchEvent("ExcludedDates_Popup", BusinessLifeCycleEvents.EVENT_LOWER);

	Services.startTransaction();
	var dom = Services.getNode("/");
	var nodes = Services.getNodes(ExludedDatesPopup_ExcludedDatesGrid.dataBinding + "/Value");
	
	if (nodes.length > 0)
	{
		var nodeValue;
		for (var i=0; i<nodes.length; i++)
		{
			nodeValue = XML.getNodeTextContent(nodes[i]);
			Services.setValue(XPathConstants.WFT_XPATH + "/Dates/Date[./Value = '" + nodeValue + "']/Excluded", "true");
		}
		
		// Ensure the changes made flag is set
		setChangesMade();
		
		// Update the current wft's status field
		if ( Services.getValue(XPathConstants.WFT_XPATH + "/Status") != FormConstants.STATUS_NEW)
		{
			Services.setValue(XPathConstants.WFT_XPATH + "/Status" , FormConstants.STATUS_UPDATED);
		}
	}
	Services.endTransaction();
};

/**********************************************************************************/

function ExludedDatesPopup_CancelButton() {}
ExludedDatesPopup_CancelButton.tabIndex = 42;

/******************************* LOGIC DIVS ***************************************/

// Logic to detect when fields have been updated so the user can be prompted to
// Save when navigating away from the screen.

function updateDetailsLogic() {}

updateDetailsLogic.logicOn = [WindowForTrial_Track.dataBinding, WindowForTrial_StartDate.dataBinding, WindowForTrial_EndDate.dataBinding, WindowForTrial_Days.dataBinding, WindowForTrial_Hours.dataBinding, WindowForTrial_Mins.dataBinding, WindowForTrial_Status.dataBinding, WindowForTrial_Judge.dataBinding, WindowForTrial_ReasonForAdjournment.dataBinding, WindowForTrial_CaseManagementConferenceDate.dataBinding, WindowForTrial_CaseManagementConferenceFlag.dataBinding, WindowForTrial_Notes.dataBinding];
updateDetailsLogic.logic = function(event)
{
	// Check the correct input has called this function
	var invalidInput = true;
	for (var i=0; i<updateDetailsLogic.logicOn.length; i++)
	{
		if (event.getXPath() == updateDetailsLogic.logicOn[i])
		{
			invalidInput = false;
			break;
		}
	}

	if (invalidInput || event.getType() != DataModelEvent.UPDATE)
	{
		return;
	}

	// Check changes not already made
	setChangesMade();
	
	// Update the current wft's status field
	if ( Services.getValue(XPathConstants.WFT_XPATH + "/Status") != FormConstants.STATUS_NEW)
	{
		Services.setValue(XPathConstants.WFT_XPATH + "/Status" , FormConstants.STATUS_UPDATED);
	}
}
