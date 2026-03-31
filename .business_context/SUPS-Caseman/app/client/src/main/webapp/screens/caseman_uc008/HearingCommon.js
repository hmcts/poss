/** 
 * @fileoverview HearingCommon.js:
 * This file contains the commonly field configurations for UC008
 * (Hearings/Hearings CO) screens.
 *
 * @author Chris Vincent
 * @version 0.1
 * 
 * Change History:
 * 14/08/2006 - Chris Vincent, removed the mandatory rules from the venue code and venue name
 * 				fields so now are optional (read only so cannot be updated anyway).  Defect 
 * 				4236.
 * 29/08/2006 - Chris Vincent, changed HearingDetails_DateOfRequestToList to accept weekend dates
 * 				even though in theory this would never happen in live environment.  Defect 4764.
 * 05/09/2006 - Chris Vincent, updated validation around the time field to handle the 
 * 				anomaly of changing from an invalid variation of 0 (e.g. 00.00) to the
 * 				time 00:00 which also evaluates to 0 so the framework thinks no change
 * 				has been made and the validate function does not fire.  Defect 5076.
 * 11/09/2006 - Chris Vincent, refixed defect 5076 (see above).  Original fix did not
 * 				refresh the display value so now the Transform to Model and Transform to
 * 				Display specifically filter out variations of 0 entered into the field and
 * 				save a non numeric string into the DOM which the Transform to Display looks
 * 				for and converts to 00.00.
 * 26/09/2006 - Chris Vincent, refixed defect 4618. Added HearingDetails_HearingOnDate.updateMode="clickCellMode";
 *				Previously had only made change in Add Judgment
 */

/******************************* SUBFORMS ******************************************/

function addHearing_subform() {};
addHearing_subform.subformName = "AddHearingSubform";
/**
 * @author rzxd7g
 * 
 */
addHearing_subform.prePopupPrepare = function()
{
    // Pass the owning court details to the subform
    Services.setValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtCode", Services.getValue(XPathConstants.DATA_XPATH + "/OwningCourtCode"));
    Services.setValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourt", Services.getValue(XPathConstants.DATA_XPATH + "/OwningCourt"));
    Services.replaceNode(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtAddressDetail", Services.getNode(XPathConstants.DATA_XPATH + "/OwningCourtAddressDetail"));
}
addHearing_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.NEW_HEARING_TMP_PATH } ];
/**
 * @author rzxd7g
 * 
 */
addHearing_subform.processReturnedData = function() 
{
    Services.startTransaction();
    var surrogateId = getNextSurrogateKey();
    Services.setValue(XPathConstants.NEW_HEARING_TMP_PATH + "/SurrogateId", surrogateId);
    
    var userName = Services.getCurrentUser();
    Services.setValue(XPathConstants.NEW_HEARING_TMP_PATH + "/CreatedBy", userName);

	// Add the entire Hearing branch to the Hearings node
	var hearingsNode = XPathConstants.DATA_XPATH + "/Hearings";		
	Services.addNode(Services.getNode(XPathConstants.NEW_HEARING_TMP_PATH), hearingsNode);
	
	// Set details changed flag
	if (Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "Y")
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
	}
	
	// Force the master grid to select the newly added Hearing
	Services.setValue(Master_HearingsListGrid.dataBinding, surrogateId);
	
	Services.endTransaction();
}
addHearing_subform.destroyOnClose = true;
/**
 * @author rzxd7g
 * @return "HearingDetails_HearingOnDate"  
 */
addHearing_subform.nextFocusedAdaptorId = function() {
	return "HearingDetails_HearingOnDate";
}

/***************************** LOV POPUPS ******************************************/

function selectHearingOutcomeLOV() {};
selectHearingOutcomeLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/HearingOutcome";
selectHearingOutcomeLOV.srcData = XPathConstants.REF_DATA_XPATH + "/HearingOutcomes";
selectHearingOutcomeLOV.rowXPath = "HearingOutcome";
selectHearingOutcomeLOV.keyXPath = "Type";
selectHearingOutcomeLOV.columns = [
	{xpath: "Type"},
	{xpath: "Description"}
];

selectHearingOutcomeLOV.styleURL = "/css/HearingOutcomeLOVGrid.css";
selectHearingOutcomeLOV.destroyOnClose = false;
selectHearingOutcomeLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "HearingDetails_HearingOutcome_LOVBtn"} ],
		keys: [ { key: Key.F6, element: "HearingDetails_HearingOutcomeCode" }, { key: Key.F6, element: "HearingDetails_HearingOutcome" } ]
	}
};

selectHearingOutcomeLOV.logicOn = [selectHearingOutcomeLOV.dataBinding];
selectHearingOutcomeLOV.logic = function(event)
{
	if ( event.getXPath().indexOf(selectHearingOutcomeLOV.dataBinding) == -1 )
	{
		return;
	}

	var outcome = Services.getValue(selectHearingOutcomeLOV.dataBinding);
	if ( !CaseManUtils.isBlank(outcome) )
	{			
		Services.setValue(HearingDetails_HearingOutcomeCode.dataBinding, outcome);
		Services.setValue(selectHearingOutcomeLOV.dataBinding, "");
	}
}

/**
 * @author rzxd7g
 * @return "Status_Save"  
 */
selectHearingOutcomeLOV.nextFocusedAdaptorId = function() {
	return "Status_Save";
}

/******************************** GRIDS ********************************************/

/**
 * Grid control List of Hearings
 * @author rzxd7g
 * 
 */
function Master_HearingsListGrid() {};
Master_HearingsListGrid.tabIndex = 2;
Master_HearingsListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedHearing"; // will use this below to bind fields correctly to correct bit of xml
Master_HearingsListGrid.srcData = XPathConstants.DATA_XPATH + "/Hearings"; //List of Hearings
Master_HearingsListGrid.rowXPath = "Hearing";		// Individual Hearings
Master_HearingsListGrid.keyXPath = "SurrogateId";  	// Unique identifier for a Hearing
Master_HearingsListGrid.columns = [   				// column bindings
	{xpath: "TypeOfHearing"},
	{xpath: "Date", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "VenueName"}
];

Master_HearingsListGrid.enableOn = [XPathConstants.HEARING_PATH];
Master_HearingsListGrid.isEnabled = function()
{
	return Services.countNodes(XPathConstants.HEARING_PATH) != 0
}

/**************************** DATA BINDINGS ****************************************/

HearingDetails_DateOfRequestToList.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/DateOfRequestToList";
HearingDetails_HearingType_Code.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/TypeOfHearingCode";
HearingDetails_HearingType_Name.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/TypeOfHearing";
HearingDetails_HearingOnDate.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Date";
HearingDetails_HearingOnDay.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Day";
HearingDetails_HearingOnTime.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Time";
HearingDetails_HearingTimeAllowedHours.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HoursAllowed"; // &&& need to concatenate hours and mins
HearingDetails_HearingTimeAllowedMins.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/MinsAllowed"; // &&& need to concatenate hours and mins
HearingDetails_VenueCode.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/VenueCode";
HearingDetails_VenueName.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/VenueName";
HearingDetails_ContactDetails_Address_Line1.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/Line[1]";
HearingDetails_ContactDetails_Address_Line2.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/Line[2]";
HearingDetails_ContactDetails_Address_Line3.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/Line[3]";
HearingDetails_ContactDetails_Address_Line4.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/Line[4]";
HearingDetails_ContactDetails_Address_Line5.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/Line[5]";
HearingDetails_ContactDetails_Address_Postcode.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/Address/PostCode";
HearingDetails_ContactDetails_Address_DXNumber.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/DXNumber";
HearingDetails_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/TelephoneNumber";
HearingDetails_ContactDetails_FaxNumber.dataBinding = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/FaxNumber";

/**************************** INPUT FIELDS *****************************************/

function HearingDetails_DateOfRequestToList() {}
HearingDetails_DateOfRequestToList.weekends = true; 
HearingDetails_DateOfRequestToList.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_DateOfRequestToList.tabIndex = -1;
HearingDetails_DateOfRequestToList.componentName = "Date Of Request To List";
HearingDetails_DateOfRequestToList.maxLength = 11;
HearingDetails_DateOfRequestToList.helpText = "Date when case became available for listing";
HearingDetails_DateOfRequestToList.isReadOnly = function() { return true; }
/**********************************************************************************/

function HearingDetails_HearingType_Code() {}
HearingDetails_HearingType_Code.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingType_Code.tabIndex = -1;
HearingDetails_HearingType_Code.componentName = "Hearing Type Code";
HearingDetails_HearingType_Code.maxLength = 25;
HearingDetails_HearingType_Code.helpText = "Hearing Type code";
HearingDetails_HearingType_Code.isMandatory = function() { return true; }
HearingDetails_HearingType_Code.isReadOnly = function() { return true; }
HearingDetails_HearingType_Code.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_HearingType_Name() {}
HearingDetails_HearingType_Name.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingType_Name.tabIndex = -1;
HearingDetails_HearingType_Name.componentName = "Hearing Type Name";
HearingDetails_HearingType_Name.maxLength = 35;
HearingDetails_HearingType_Name.helpText = "The type of hearing (eg. Small claim, Pre-Trial Review etc) - list available";
HearingDetails_HearingType_Name.isMandatory = function() { return true; }
HearingDetails_HearingType_Name.isReadOnly = function() { return true; }
HearingDetails_HearingType_Name.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_HearingOnDate() {}
HearingDetails_HearingOnDate.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnDate.weekends = false; 
HearingDetails_HearingOnDate.tabIndex = 10;
HearingDetails_HearingOnDate.maxLength = 11;
HearingDetails_HearingOnDate.componentName = "Hearing On Date";
HearingDetails_HearingOnDate.helpText = "The date scheduled for the hearing.";
HearingDetails_HearingOnDate.mandatoryOn = [HearingDetails_HearingOnDate.dataBinding];
HearingDetails_HearingOnDate.isMandatory = function() { return true; }
HearingDetails_HearingOnDate.logicOn = [HearingDetails_HearingOnDate.dataBinding, 
										HearingDetails_HearingOnTime.dataBinding];
HearingDetails_HearingOnDate.logic = function(event)
{
	if(event.getXPath() == HearingDetails_HearingOnDate.dataBinding || event.getXPath() == HearingDetails_HearingOnTime.dataBinding){	
		// Defect 3959 - need to update event 200 if change the date or hearing time
		Services.setValue(XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingDateAndTimeChanged", "Y");
	}
}
HearingDetails_HearingOnDate.validateOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnDate.validate = function()
{	
	var date = Services.getValue(HearingDetails_HearingOnDate.dataBinding);
	return validateNonWorkingDate(date);
}

HearingDetails_HearingOnDate.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnDate.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}
HearingDetails_HearingOnDate.updateMode="clickCellMode";
/**********************************************************************************/

function HearingDetails_HearingOnDay() {}
HearingDetails_HearingOnDay.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnDay.componentName = "Hearing On Day";
HearingDetails_HearingOnDay.tabIndex = -1;

// Need to calculate the date when Master_HearingsListGrid changes as not held in DOM at the beginning
HearingDetails_HearingOnDay.logicOn = [HearingDetails_HearingOnDate.dataBinding,
									   Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnDay.logic = function()
{
	// Set the day as we now know the user has selected a date 
	// for the Hearing to be heard on.
	// Date on represents the value entered but as 2004-12-25
	var dateOn = Services.getValue(HearingDetails_HearingOnDate.dataBinding);
	var day = setDay(dateOn);
	Services.setValue(HearingDetails_HearingOnDay.dataBinding, day);
}

HearingDetails_HearingOnDay.maxLength = 10;
HearingDetails_HearingOnDay.helpText = "Day of the week Hearing is to be held";
HearingDetails_HearingOnDay.isMandatory = function() { return true; }
HearingDetails_HearingOnDay.isReadOnly = function() { return true; }
HearingDetails_HearingOnDay.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_HearingOnTime() {}
HearingDetails_HearingOnTime.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnTime.tabIndex = 11;
HearingDetails_HearingOnTime.helpText = "The time scheduled for the hearing.";
HearingDetails_HearingOnTime.mandatoryOn = [HearingDetails_HearingOnTime.dataBinding];
HearingDetails_HearingOnTime.isMandatory = function() { return true; }
HearingDetails_HearingOnTime.componentName = "Hearing On Time";

HearingDetails_HearingOnTime.validateOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnTime.validate = function()
{
	var time = Services.getValue(HearingDetails_HearingOnTime.dataBinding);
	var xpath = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/ValidTime";
	return validateTimeAt(time, xpath);
}

HearingDetails_HearingOnTime.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingOnTime.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

HearingDetails_HearingOnTime.transformToDisplay = function(value)
{
	var xpath = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/ValidTime";
	return transformToDisplayTime(value, xpath);		
}

HearingDetails_HearingOnTime.transformToModel = function(value)
{
	var xpath = XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/ValidTime";
	return transformToModelTime(value, xpath);	
}

/**********************************************************************************/

function HearingDetails_HearingTimeAllowedHours() {}
HearingDetails_HearingTimeAllowedHours.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedHours.tabIndex = 12;
HearingDetails_HearingTimeAllowedHours.componentName = "Allowed Hours";
HearingDetails_HearingTimeAllowedHours.maxLength = 3;
HearingDetails_HearingTimeAllowedHours.helpText = "The hours allowed for the hearing.";

HearingDetails_HearingTimeAllowedHours.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedHours.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

HearingDetails_HearingTimeAllowedHours.validateOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedHours.validate = function()
{
	var hearingTimeHours = Services.getValue(HearingDetails_HearingTimeAllowedHours.dataBinding);
	return validateHoursAllowed(hearingTimeHours);		
}

/**********************************************************************************/

function HearingDetails_HearingTimeAllowedMins() {}
HearingDetails_HearingTimeAllowedMins.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedMins.tabIndex = 13;
HearingDetails_HearingTimeAllowedMins.componentName = "Allowed Minutes";
HearingDetails_HearingTimeAllowedMins.maxLength = 2;
HearingDetails_HearingTimeAllowedMins.helpText = "The minutes allowed for the hearing.";

HearingDetails_HearingTimeAllowedMins.enableOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedMins.isEnabled = function()
{
	// If there are no Hearings associated with a case then need to disable the fields
	var gridBinding = Services.getValue(Master_HearingsListGrid.dataBinding);
	return !CaseManUtils.isBlank(gridBinding);
}

HearingDetails_HearingTimeAllowedMins.validateOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_HearingTimeAllowedMins.validate = function()
{
	var hearingTimeMins = Services.getValue(HearingDetails_HearingTimeAllowedMins.dataBinding);
	return validateMinsAllowed(hearingTimeMins);	
}
/**********************************************************************************/

function HearingDetails_VenueCode() {}
HearingDetails_VenueCode.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_VenueCode.tabIndex = -1;
HearingDetails_VenueCode.maxLength = 3;
HearingDetails_VenueCode.helpText = "Unique three digit court location code - list available.";
HearingDetails_VenueCode.isReadOnly = function() { return true; }
HearingDetails_VenueCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_VenueName() {}
HearingDetails_VenueName.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_VenueName.tabIndex = -1;
HearingDetails_VenueName.maxLength = 30;
HearingDetails_VenueName.helpText = "Name of the Court.";
HearingDetails_VenueName.isReadOnly = function() { return true; }
HearingDetails_VenueName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line1() {}
HearingDetails_ContactDetails_Address_Line1.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line1.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line1.maxLength = 35;
HearingDetails_ContactDetails_Address_Line1.helpText = "First line of Hearing address";
HearingDetails_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line2() {}
HearingDetails_ContactDetails_Address_Line2.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line2.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line2.maxLength = 35;
HearingDetails_ContactDetails_Address_Line2.helpText = "Second line of Hearing address";
HearingDetails_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line3() {}
HearingDetails_ContactDetails_Address_Line3.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line3.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line3.maxLength = 35;
HearingDetails_ContactDetails_Address_Line3.helpText = "Third line of Hearing address";
HearingDetails_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line4() {}
HearingDetails_ContactDetails_Address_Line4.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line4.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line4.maxLength = 35;
HearingDetails_ContactDetails_Address_Line4.helpText = "Fourth line of Hearing address";
HearingDetails_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line5() {}
HearingDetails_ContactDetails_Address_Line5.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line5.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line5.maxLength = 35;
HearingDetails_ContactDetails_Address_Line5.helpText = "Fifth line of Hearing address";
HearingDetails_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Postcode() {}
HearingDetails_ContactDetails_Address_Postcode.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_Postcode.tabIndex = -1;
HearingDetails_ContactDetails_Address_Postcode.maxLength = 8;
HearingDetails_ContactDetails_Address_Postcode.helpText = "Postcode for the address of the Hearing";
HearingDetails_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
HearingDetails_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_DXNumber() {}
HearingDetails_ContactDetails_Address_DXNumber.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_Address_DXNumber.componentName = "DX Number";
HearingDetails_ContactDetails_Address_DXNumber.tabIndex = -1;
HearingDetails_ContactDetails_Address_DXNumber.maxLength = 35;
HearingDetails_ContactDetails_Address_DXNumber.helpText = "DX number for the Hearing Court";
HearingDetails_ContactDetails_Address_DXNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_TelephoneNumber() {}
HearingDetails_ContactDetails_TelephoneNumber.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_TelephoneNumber.tabIndex = -1;
HearingDetails_ContactDetails_TelephoneNumber.maxLength = 24;
HearingDetails_ContactDetails_TelephoneNumber.helpText = "Telephone number for enquiries about the hearing.";
HearingDetails_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_FaxNumber() {}
HearingDetails_ContactDetails_FaxNumber.retrieveOn = [Master_HearingsListGrid.dataBinding];
HearingDetails_ContactDetails_FaxNumber.tabIndex = -1;
HearingDetails_ContactDetails_FaxNumber.maxLength = 24;
HearingDetails_ContactDetails_FaxNumber.helpText = "Fax number for the Hearing Court";
HearingDetails_ContactDetails_FaxNumber.isReadOnly = function() { return true; }

/******************************** LOGICS *******************************************/

/**
 * load data is a div tag in the html and is used to make the callback to onSuccess from the
 * get hearing service call
 * @author rzxd7g
 * 
 */
function loadData() {}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
loadData.onSuccess = function(dom)
{
	if ( null != dom )
	{
		var result = dom.selectSingleNode(XPathConstants.DATA_XPATH);		
		if ( null != result )
		{
			Services.startTransaction();
			Services.replaceNode(XPathConstants.DATA_XPATH, result);
			Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "N");
			Services.endTransaction();
		}
 	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
loadData.onError = function(exception)
{
	alert(Messages.ERR_RET_HRGS_MESSAGE);
}

/**********************************************************************************/

/**
 * Logic to detect when fields have been updated so the user can be prompted to
 * Save when navigating away from the screen.
 * @author rzxd7g
 * 
 */
function updateDetailsLogic() {}

updateDetailsLogic.logicOn = [HearingDetails_HearingOnDate.dataBinding, HearingDetails_HearingOnTime.dataBinding, HearingDetails_HearingTimeAllowedHours.dataBinding, HearingDetails_HearingTimeAllowedMins.dataBinding, XPathConstants.HEARING_PATH + "[./SurrogateId = " + Master_HearingsListGrid.dataBinding + "]/HearingOutcomeCode"];
updateDetailsLogic.logic = function(event)
{
	if ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) == "Y" || event.getXPath() == "/" )
	{
		return;
	}

	// Check the correct input has called this function
	var validInput = false;
	for (var i=0; i<updateDetailsLogic.logicOn.length; i++)
	{
		if (event.getXPath() == updateDetailsLogic.logicOn[i])
		{
			validInput = true;
			break;
		}
	}

	// Check if fields are updated
	if (!validInput || event.getType() != DataModelEvent.UPDATE)
	{
		return;
	}

	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "Y");
}
