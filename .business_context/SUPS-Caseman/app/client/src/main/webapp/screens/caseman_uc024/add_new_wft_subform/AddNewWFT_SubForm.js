/** 
 * @fileoverview AddNewWFT_SubForm.js:
 * This file contains the configurations for the Add New Window for Trial Subform
 *
 * @author Chris Vincent
 */


/************************** FORM CONFIGURATIONS *************************************/

function addNewWFTSubform() {}

addNewWFTSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "NewWindowForTrial.xml",
	dataBinding: "/ds"
}

addNewWFTSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },
	fileName: "NewWindowForTrial.xml",
	dataBinding: "/ds"
}

addNewWFTSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddWindowForTrialPopup_OkButton"} ],
                    doubleClicks: []
                  },
	modify: {},
	returnSourceNodes: [XPathConstants.SUBFORM_DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

addNewWFTSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addNewWFTSubform" } ],
					singleClicks: [ {element: "AddWindowForTrialPopup_CancelButton"} ],
					doubleClicks: []
				  },
	raiseWarningIfDOMDirty: false
}

/****************************** DATA BINDINGS **************************************/

AddWindowForTrialPopup_Track.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Track";
AddWindowForTrialPopup_StartDate.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/StartDate";
AddWindowForTrialPopup_EndDate.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/EndDate";
AddWindowForTrialPopup_Days.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Days";
AddWindowForTrialPopup_Hours.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Hours";
AddWindowForTrialPopup_Mins.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Mins";
AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CMCDate";
AddWindowForTrialPopup_CaseManagementConferenceFlag.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/CMCFlag";
AddWindowForTrialPopup_Notes.dataBinding = XPathConstants.SUBFORM_DATA_XPATH + "/Notes";

/******************************* INPUT FIELDS **************************************/

function AddWindowForTrialPopup_Track() {}
AddWindowForTrialPopup_Track.componentName = "Track";
AddWindowForTrialPopup_Track.srcData = XPathConstants.REF_DATA_XPATH + "/TrackList";
AddWindowForTrialPopup_Track.rowXPath = "/Track";
AddWindowForTrialPopup_Track.keyXPath = "/Value";
AddWindowForTrialPopup_Track.displayXPath = "/Description";
AddWindowForTrialPopup_Track.tabIndex = 1;
AddWindowForTrialPopup_Track.helpText = "Track case is assigned to";
AddWindowForTrialPopup_Track.isMandatory = function() { return true; }

/*********************************************************************************/

function AddWindowForTrialPopup_StartDate() {}
AddWindowForTrialPopup_StartDate.componentName = "Start Date";
AddWindowForTrialPopup_StartDate.tabIndex = 2;
AddWindowForTrialPopup_StartDate.maxLength = 11;
AddWindowForTrialPopup_StartDate.helpText = "Date of start of Window for Trial";
AddWindowForTrialPopup_StartDate.mandatoryOn = [AddWindowForTrialPopup_CaseManagementConferenceFlag.dataBinding];
AddWindowForTrialPopup_StartDate.isMandatory = function()
{
	return CaseManUtils.isBlank( Services.getValue(AddWindowForTrialPopup_CaseManagementConferenceFlag.dataBinding) );
}

AddWindowForTrialPopup_StartDate.validateOn = [AddWindowForTrialPopup_EndDate.dataBinding];
AddWindowForTrialPopup_StartDate.validate = function()
{
	var ec = null;

	var sd = Services.getValue(AddWindowForTrialPopup_StartDate.dataBinding);
	var ed = Services.getValue(AddWindowForTrialPopup_EndDate.dataBinding);
	var startDate = CaseManUtils.isBlank(sd) ? null : CaseManUtils.createDate(sd);
	var endDate = CaseManUtils.isBlank(ed) ? null : CaseManUtils.createDate(ed);
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	
	if ( null != startDate && null != endDate )
	{
		if ( CaseManUtils.compareDates(startDate, endDate) == -1 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_wftStartDateAfterEndDate_Msg");
		}
	}
	if ( null == ec && null != startDate )
	{
		if ( CaseManUtils.compareDates(today, startDate) == -1 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_wftStartDateCannotBeInThePast_Msg");
		}
	}

	return ec;
}

AddWindowForTrialPopup_StartDate.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_StartDate.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

/*********************************************************************************/

function AddWindowForTrialPopup_EndDate() {}
AddWindowForTrialPopup_EndDate.componentName = "End Date";
AddWindowForTrialPopup_EndDate.weekends = true;
AddWindowForTrialPopup_EndDate.tabIndex = 3;
AddWindowForTrialPopup_EndDate.maxLength = 11;
AddWindowForTrialPopup_EndDate.helpText = "The end date of the Window for Trial.";
AddWindowForTrialPopup_EndDate.mandatoryOn = [AddWindowForTrialPopup_StartDate.dataBinding];
AddWindowForTrialPopup_EndDate.isMandatory = function()
{
	return !CaseManUtils.isBlank( Services.getValue(AddWindowForTrialPopup_StartDate.dataBinding) );
}

AddWindowForTrialPopup_EndDate.enableOn = [AddWindowForTrialPopup_StartDate.dataBinding, AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_EndDate.isEnabled = function()
{
	if ( CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding)) )
	{
		return false;
	}
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_StartDate.dataBinding));
}

AddWindowForTrialPopup_EndDate.validateOn = [AddWindowForTrialPopup_StartDate.dataBinding];
AddWindowForTrialPopup_EndDate.validate = function()
{
	var sd = Services.getValue(AddWindowForTrialPopup_StartDate.dataBinding);
	var ed = Services.getValue(AddWindowForTrialPopup_EndDate.dataBinding);
	var startDate = CaseManUtils.isBlank(sd) ? null : CaseManUtils.createDate(sd);
	var endDate = CaseManUtils.isBlank(ed) ? null : CaseManUtils.createDate(ed);
	
	if ( null != startDate && null != endDate )
	{
		if ( CaseManUtils.compareDates(startDate, endDate) == -1 )
		{
			return ErrorCode.getErrorCode("CaseMan_wftStartDateAfterEndDate_Msg");
		}
	}

	return null;
}

AddWindowForTrialPopup_EndDate.logicOn = [AddWindowForTrialPopup_StartDate.dataBinding];
AddWindowForTrialPopup_EndDate.logic = function(event)
{
	if (event.getXPath() != AddWindowForTrialPopup_StartDate.dataBinding)
	{
		return;
	}

	var sd = Services.getValue(AddWindowForTrialPopup_StartDate.dataBinding);

	// If setting start date to blank, set end date to blank and exit
	if ( CaseManUtils.isBlank(sd) )
	{
		Services.setValue(AddWindowForTrialPopup_EndDate.dataBinding, "");
		return;
	}

	// If start date is invalid, exit
	if ( !Services.getAdaptorById("AddWindowForTrialPopup_StartDate").getValid() )
	{
		return;
	}
	
	// Start date is not blank and is valid so calculate end date
	if ( !CaseManUtils.isBlank(sd) && CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_EndDate.dataBinding)) )
	{
		var startDate = CaseManUtils.createDate(sd);
		if (null != startDate)
		{	
			var track = Services.getValue(AddWindowForTrialPopup_Track.dataBinding);
			var endDate = getEndDateFromTrack(track, startDate);
			Services.setValue(AddWindowForTrialPopup_EndDate.dataBinding, endDate);
			Services.setFocus("AddWindowForTrialPopup_EndDate");
		}
	}
}

/*********************************************************************************/

function AddWindowForTrialPopup_Days() {}
AddWindowForTrialPopup_Days.componentName = "Days";
AddWindowForTrialPopup_Days.tabIndex = 4;
AddWindowForTrialPopup_Days.maxLength = 3;
AddWindowForTrialPopup_Days.helpText = "Number of days estimated for trial";
AddWindowForTrialPopup_Days.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_Days.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

AddWindowForTrialPopup_Days.validate = function()
{
	return validateDays(Services.getValue(AddWindowForTrialPopup_Days.dataBinding));
}

/*********************************************************************************/

function AddWindowForTrialPopup_Hours() {}
AddWindowForTrialPopup_Hours.componentName = "Hours";
AddWindowForTrialPopup_Hours.tabIndex = 5;
AddWindowForTrialPopup_Hours.maxLength = 1;
AddWindowForTrialPopup_Hours.helpText = "Number of hours estimated for trial";
AddWindowForTrialPopup_Hours.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_Hours.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

AddWindowForTrialPopup_Hours.validate = function()
{
	return validateHours(Services.getValue(AddWindowForTrialPopup_Hours.dataBinding));
}

/*********************************************************************************/

function AddWindowForTrialPopup_Mins() {}
AddWindowForTrialPopup_Mins.componentName = "Minutes";
AddWindowForTrialPopup_Mins.tabIndex = 6;
AddWindowForTrialPopup_Mins.maxLength = 2;
AddWindowForTrialPopup_Mins.helpText = "Number of minutes estimated for trial";
AddWindowForTrialPopup_Mins.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_Mins.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

AddWindowForTrialPopup_Mins.validate = function()
{
	return validateMinutes(Services.getValue(AddWindowForTrialPopup_Mins.dataBinding));
}

/*********************************************************************************/

function AddWindowForTrialPopup_CaseManagementConferenceDate() {}
AddWindowForTrialPopup_CaseManagementConferenceDate.componentName = "Case Management Conference Date";
AddWindowForTrialPopup_CaseManagementConferenceDate.tabIndex = 7;
AddWindowForTrialPopup_CaseManagementConferenceDate.maxLength = 11;
AddWindowForTrialPopup_CaseManagementConferenceDate.helpText = "Date of Case Management Conference";
AddWindowForTrialPopup_CaseManagementConferenceDate.validate = function()
{
	var ec = null;

	var date = Services.getValue(AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding);
	if ( !CaseManUtils.isBlank(date) )
	{
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		var dateObj = CaseManUtils.createDate(date);
		
		if (CaseManUtils.compareDates(today, dateObj) == -1)
		{
			ec = ErrorCode.getErrorCode("CaseMan_wftCMCDateCannotBeInThePast_Msg");
		}
	}
	
	return ec;
}

AddWindowForTrialPopup_CaseManagementConferenceDate.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_CaseManagementConferenceDate.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

AddWindowForTrialPopup_CaseManagementConferenceDate.logicOn = [AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding];
AddWindowForTrialPopup_CaseManagementConferenceDate.logic = function(event)
{
	if (event.getXPath() != AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding)
	{
		return;
	}
	if (!CaseManUtils.isBlank( Services.getValue(AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding) ))
	{
		Services.setValue(AddWindowForTrialPopup_CaseManagementConferenceFlag.dataBinding, "Y");
	}
}

/*********************************************************************************/

function AddWindowForTrialPopup_CaseManagementConferenceFlag() {}
AddWindowForTrialPopup_CaseManagementConferenceFlag.componentName = "Case Management Conference";
AddWindowForTrialPopup_CaseManagementConferenceFlag.modelValue = {checked: "Y", unchecked: ''};
AddWindowForTrialPopup_CaseManagementConferenceFlag.tabIndex = 8;
AddWindowForTrialPopup_CaseManagementConferenceFlag.helpText = "Tick box or enter Y if Case Management Conference entered but no date given.";
AddWindowForTrialPopup_CaseManagementConferenceFlag.readOnlyOn = [AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding];
AddWindowForTrialPopup_CaseManagementConferenceFlag.isReadOnly = function()
{
	return !CaseManUtils.isBlank( Services.getValue(AddWindowForTrialPopup_CaseManagementConferenceDate.dataBinding) );
}

AddWindowForTrialPopup_CaseManagementConferenceFlag.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_CaseManagementConferenceFlag.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

/*********************************************************************************/

function AddWindowForTrialPopup_Notes() {}
AddWindowForTrialPopup_Notes.componentName = "Notes";
AddWindowForTrialPopup_Notes.tabIndex = 9;
AddWindowForTrialPopup_Notes.maxLength = 70;
AddWindowForTrialPopup_Notes.helpText = "Notes";
AddWindowForTrialPopup_Notes.enableOn = [AddWindowForTrialPopup_Track.dataBinding];
AddWindowForTrialPopup_Notes.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(AddWindowForTrialPopup_Track.dataBinding));
}

AddWindowForTrialPopup_Notes.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddWindowForTrialPopup_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/****************************** BUTTON FIELDS **************************************/

function AddWindowForTrialPopup_OkButton() {}
AddWindowForTrialPopup_OkButton.tabIndex = 10;

/**********************************************************************************/

function AddWindowForTrialPopup_CancelButton() {}
AddWindowForTrialPopup_CancelButton.tabIndex = 11;
