/** 
 * @fileoverview AddHearing_SubForm.js:
 * This file contains the configurations for the Add Hearing Subform used 
 * on the CreateUpdateHearing and HearingCO screens
 *
 * @author Tim Connor, Chris Vincent
 * 
 * Change History:
 * 29/08/2006 - Chris Vincent, fixed defect 4795 by altering the hearing type code and hearing type name
 * 				logic xpaths to reference the field data bindings rather than the literal value which if
 * 				contains an apostrophe will cause a screen crash.
 * 05/09/2006 - Chris Vincent, updated validation around the time field to handle the 
 * 				anomaly of changing from an invalid variation of 0 (e.g. 00.00) to the
 * 				time 00:00 which also evaluates to 0 so the framework thinks no change
 * 				has been made and the validate function does not fire.  Defect 5076.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 11/09/2006 - Chris Vincent, refixed defect 5076 (see above).  Original fix did not
 * 				refresh the display value so now the Transform to Model and Transform to
 * 				Display specifically filter out variations of 0 entered into the field and
 * 				save a non numeric string into the DOM which the Transform to Display looks
 * 				for and converts to 00.00.
 */

/**
 * Subform Specific XPath Constants
 */
XPathConstants.SUBFORM_HEARING_XPATH = "/ds/Hearing";
XPathConstants.SUBFORM_VENUE_XPATH = "/ds/Venue";

/************************** FORM CONFIGURATIONS *************************************/

function addHearingSubform() {}

/**
 * @author fzj0yl
 * 
 */
addHearingSubform.initialise = function()
{
    Services.startTransaction();

    // Set up the default values for the owning court
    Services.setValue( AddHearing_VenueCode.dataBinding, Services.getValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtCode") );
    Services.setValue( AddHearing_VenueName.dataBinding, Services.getValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourt") );
    Services.replaceNode( XPathConstants.SUBFORM_HEARING_XPATH + "/Address", Services.getNode(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtAddressDetail/Address") );
    Services.setValue( AddHearing_ContactDetails_Address_DXNumber.dataBinding, Services.getValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtAddressDetail/DXNumber") );
    Services.setValue( AddHearing_ContactDetails_TelephoneNumber.dataBinding, Services.getValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtAddressDetail/TelephoneNumber") );
    Services.setValue( AddHearing_ContactDetails_FaxNumber.dataBinding, Services.getValue(XPathConstants.ADD_HEARING_SUBFORM_PATH + "/OwningCourtAddressDetail/FaxNumber") );
    
	// Set 'Date to List' to today's date
	Services.setValue(AddHearing_DateOfRequestToList.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH));	
    Services.endTransaction();
    
    // Call reference data services but only if they don't already exist
    if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts") )
    {
		var params = new ServiceParams();
		Services.callService("getCourts", params, addHearingSubform, true);	
    }
    if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/HearingTypes") )
    {
		var params = new ServiceParams();
		params.addSimpleParameter( "hearingTypeList", Services.getValue(HearingParams.HEARING_TYPE) );
		Services.callService("getHearingTypeList", params, addHearingSubform, true);	
    }
}

/**
 * @param dom
 * @param serviceName
 * @author fzj0yl
 * 
 */
addHearingSubform.onSuccess = function(dom, serviceName)
{
	switch ( serviceName )
	{
		case "getCourts":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Courts", dom);
			break;
		case "getHearingTypeList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/HearingTypes", dom);
			break;			
	}
}

addHearingSubform.createLifeCycle =
{
    eventBinding: {
        keys: [],
        singleClicks: [],
        doubleClicks: []
    },
    fileName: "NewHearing.xml",
    dataBinding: "/ds"
}

addHearingSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddHearing_OKBtn"} ],
                    doubleClicks: []
                  },
	modify: {},
	returnSourceNodes: [XPathConstants.SUBFORM_HEARING_XPATH],
/**
 * @author fzj0yl
 * 
 */
	preProcess: function() {
	},
	postSubmitAction: {
		close: {}
	}
}
addHearingSubform.cancelLifeCycle = {

	eventBinding: {	keys: [ { key: Key.F4, element: "addHearingSubform" } ],
					singleClicks: [ { element: "AddHearing_CancelBtn"} ],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/*************************** HELPER FUNCTIONS *************************************/

/**
 * Function clears the details of the venue popup when the user exits the popup
 * @author fzj0yl
 * 
 */
function resetVenuePopup()
{
	var myXPaths = [XPathConstants.SUBFORM_VENUE_XPATH + "/VenueCode",
					XPathConstants.SUBFORM_VENUE_XPATH + "/VenueName",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[1]",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[2]",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[3]",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[4]",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[5]",
					XPathConstants.SUBFORM_VENUE_XPATH + "/Address/PostCode",
					XPathConstants.SUBFORM_VENUE_XPATH + "/DXNumber",
					XPathConstants.SUBFORM_VENUE_XPATH + "/TelephoneNumber",
					XPathConstants.SUBFORM_VENUE_XPATH + "/FaxNumber",
					selectVenueLOV.dataBinding];
				
	Services.startTransaction();
	for ( var i=0, l=myXPaths.length; i<l; i++ )
	{
		Services.setValue( myXPaths[i], "" );
	}
	Services.endTransaction();
}

/**********************************************************************************/
 
/**
 * Utility function which calculates whether a date is within a month in the past.
 * Based on CaseManValidationHelper method that was not working correctly.
 * Didn't change as may have had effect on where it was being used.
 *
 * @param string pDate A date in the model format (YYYY-MM-DD)
 * @return boolean false if invalid, true if ok
 * @author fzj0yl
 */
function validateDateLessThanOneMonthInPast(pDate)
{
	var oneMonthAgo = CaseManUtils.oneMonthEarlier( CaseManUtils.createDate( CaseManUtils.getSystemDate( XPathConstants.SYSTEMDATE_XPATH ) ) );
	compare = CaseManUtils.compareDates(CaseManUtils.createDate(pDate), oneMonthAgo);
	return ( compare > 0 ) ? false : true;
}

/****************************** DATA BINDINGS **************************************/

AddHearing_DateOfRequestToList.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/DateOfRequestToList";
AddHearing_HearingType_Code.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/TypeOfHearingCode";
AddHearing_HearingType_Name.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/TypeOfHearing"; 
AddHearing_HearingOnDate.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Date";
AddHearing_HearingOnDay.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Day";
AddHearing_HearingOnTime.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Time";
AddHearing_HearingTimeAllowedHours.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/HoursAllowed";
AddHearing_HearingTimeAllowedMins.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/MinsAllowed";
AddHearing_VenueCode.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/VenueCode";
AddHearing_VenueName.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/VenueName";
AddHearing_ContactDetails_Address_Line1.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/Line[1]";
AddHearing_ContactDetails_Address_Line2.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/Line[2]";
AddHearing_ContactDetails_Address_Line3.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/Line[3]";
AddHearing_ContactDetails_Address_Line4.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/Line[4]";
AddHearing_ContactDetails_Address_Line5.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/Line[5]";
AddHearing_ContactDetails_Address_Postcode.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/Address/PostCode";
AddHearing_ContactDetails_Address_DXNumber.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/DXNumber";
AddHearing_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/TelephoneNumber";
AddHearing_ContactDetails_FaxNumber.dataBinding = XPathConstants.SUBFORM_HEARING_XPATH + "/FaxNumber";

/************************  SELECT VENUE  - POPUP ************************************/

SelectVenue_VenueCode.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/VenueCode";
SelectVenue_VenueName.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/VenueName";
SelectVenue_ContactDetails_Address_Line1.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[1]";
SelectVenue_ContactDetails_Address_Line2.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[2]";
SelectVenue_ContactDetails_Address_Line3.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[3]";
SelectVenue_ContactDetails_Address_Line4.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[4]";
SelectVenue_ContactDetails_Address_Line5.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/Line[5]";
SelectVenue_ContactDetails_Address_Postcode.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/Address/PostCode";
SelectVenue_ContactDetails_Address_DXNumber.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/DXNumber";
SelectVenue_ContactDetails_Address_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/TelephoneNumber";
SelectVenue_ContactDetails_Address_FaxNumber.dataBinding = XPathConstants.SUBFORM_VENUE_XPATH + "/FaxNumber";
selectVenue_Address_Grid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedAddress";

selectHearingTypeLOV.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedLOVRow/HearingType";
selectVenueLOV.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedLOVRow/OwningCourt";

/******************************* INPUT FIELDS **************************************/

function AddHearing_DateOfRequestToList() {}

AddHearing_DateOfRequestToList.tabIndex = 1;

AddHearing_DateOfRequestToList.validate = function()
{	
	var errCode = null;
	var date = Services.getValue(AddHearing_DateOfRequestToList.dataBinding);

	// Ensure date is not on a bank holiday	
	var errCode = validateNonWorkingDate(date);

	// Need to check date is not in future
	if( errCode == null )
	{
		errCode = validateDateInFuture(date);
	}

	// Also need to ensure date is not over one month in past	
	if( errCode == null )
	{
		if( !validateDateLessThanOneMonthInPast(date) )
		{
			// Warn user date is over 1 month in past
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}
	}
	return errCode;
}
AddHearing_DateOfRequestToList.maxLength = 11;
AddHearing_DateOfRequestToList.helpText = "Date when case became available for listing";
AddHearing_DateOfRequestToList.weekends = false; 
AddHearing_DateOfRequestToList.isMandatory = function() { return true; }
AddHearing_DateOfRequestToList.updateMode="clickCellMode";

/**********************************************************************************/

function AddHearing_HearingType_Code() {}
AddHearing_HearingType_Code.tabIndex = 2;
AddHearing_HearingType_Code.maxLength = 22;
AddHearing_HearingType_Code.helpText = "Hearing Type code";
AddHearing_HearingType_Code.isMandatory = function() { return true; }

AddHearing_HearingType_Code.logicOn = [AddHearing_HearingType_Code.dataBinding];
AddHearing_HearingType_Code.logic = function()
{
	var hearingCode = Services.getValue(AddHearing_HearingType_Code.dataBinding);
	if ( !CaseManUtils.isBlank(hearingCode) )
	{
		// Hearing type code is not blank, find the corresponding hearing type description
		var xpath = XPathConstants.REF_DATA_XPATH + "/HearingTypes/HearingType[./Value = " + AddHearing_HearingType_Code.dataBinding + "]/Description";
		var hearTypeDesc = Services.getValue(xpath);
		if ( !CaseManUtils.isBlank(hearTypeDesc) )
		{
			// set the description field appropriately
			Services.setValue(AddHearing_HearingType_Name.dataBinding, hearTypeDesc);		
		}
		else
		{
			// Not a valid hearing type code so blank the type description
			Services.setValue(AddHearing_HearingType_Name.dataBinding, "");
		}
	}
	else
	{
		// The hearing type code is blank so blank the description
		Services.setValue(AddHearing_HearingType_Name.dataBinding, "");
	}
}

AddHearing_HearingType_Code.validate = function()
{
	var typeCode = Services.getValue(AddHearing_HearingType_Code.dataBinding);
	var errCode = null;
	if ( !CaseManUtils.isBlank(typeCode) )
	{
		if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/HearingTypes/HearingType[./Value = " + AddHearing_HearingType_Code.dataBinding + "]") )
		{
			// The hearing type code entered does not match a valid hearing type in the reference data
			errCode = ErrorCode.getErrorCode('CaseMan_invalidHearingType_Msg');
		}
	}
	return errCode;
}

AddHearing_HearingType_Code.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddHearing_HearingType_Code.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_HearingType_Name() {}
AddHearing_HearingType_Name.srcData = XPathConstants.REF_DATA_XPATH + "/HearingTypes";
AddHearing_HearingType_Name.rowXPath = "HearingType";
AddHearing_HearingType_Name.keyXPath = "Description";
AddHearing_HearingType_Name.displayXPath = "Description";
AddHearing_HearingType_Name.strictValidation = true;
AddHearing_HearingType_Name.retrieveOn = [AddHearing_HearingType_Name.dataBinding];
AddHearing_HearingType_Name.tabIndex = 3;
AddHearing_HearingType_Name.helpText = "The type of hearing (eg. Small claim, Pre-Trial Review etc) - list available";
AddHearing_HearingType_Name.isMandatory = function() { return true; }

AddHearing_HearingType_Name.logicOn = [AddHearing_HearingType_Name.dataBinding];
AddHearing_HearingType_Name.logic = function(event)
{
	if (event.getXPath() != AddHearing_HearingType_Name.dataBinding)
	{
		return;
	}

	var value = Services.getValue(AddHearing_HearingType_Name.dataBinding);
	if ( !CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/HearingTypes/HearingType[./Description = " + AddHearing_HearingType_Name.dataBinding + "]/Value");
		if ( !CaseManUtils.isBlank(code) && Services.getValue(AddHearing_HearingType_Code.dataBinding) != code )
		{
			Services.setValue(AddHearing_HearingType_Code.dataBinding, code);
		}
	}
}

/**********************************************************************************/

function AddHearing_HearingOnDate() {}
AddHearing_HearingOnDate.weekends = false; 
AddHearing_HearingOnDate.tabIndex = 5;
AddHearing_HearingOnDate.maxLength = 11;
AddHearing_HearingOnDate.helpText = "The date scheduled for the hearing.";
AddHearing_HearingOnDate.isMandatory = function() { return true; }

AddHearing_HearingOnDate.validate = function()
{
	var date = Services.getValue(AddHearing_HearingOnDate.dataBinding);
	return validateNonWorkingDate(date);
}
AddHearing_HearingOnDate.updateMode="clickCellMode";
/**********************************************************************************/

function AddHearing_HearingOnDay() {}
AddHearing_HearingOnDay.tabIndex = -1;
AddHearing_HearingOnDay.maxLength = 9;
AddHearing_HearingOnDay.helpText = "Day the Hearing is to be heard.";
AddHearing_HearingOnDay.isMandatory = function() { return true; }
AddHearing_HearingOnDay.isReadOnly = function() { return true; }

AddHearing_HearingOnDay.logicOn = [AddHearing_HearingOnDate.dataBinding];
AddHearing_HearingOnDay.logic = function()
{
	// Set the day as we now now the user has selected a date 
	// for the Hearing to be heard on.
	// Date on represents the value entered but as 2004-12-25
	var dateOn = Services.getValue(AddHearing_HearingOnDate.dataBinding);
	var day = setDay(dateOn);
	// Now set the day to the field value
	Services.setValue(AddHearing_HearingOnDay.dataBinding, day);
} // END OF logic()

AddHearing_HearingOnDay.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddHearing_HearingOnDay.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_HearingOnTime() {}
AddHearing_HearingOnTime.tabIndex = 6;
AddHearing_HearingOnTime.helpText = "The time scheduled for the hearing.";
AddHearing_HearingOnTime.isMandatory = function() { return true; }
AddHearing_HearingOnTime.validate = function()
{	
	var time = Services.getValue(AddHearing_HearingOnTime.dataBinding);
	var xpath = XPathConstants.SUBFORM_HEARING_XPATH + "/ValidTime";
	return validateTimeAt(time, xpath);
}

AddHearing_HearingOnTime.transformToDisplay = function(value)
{
	var xpath = XPathConstants.SUBFORM_HEARING_XPATH + "/ValidTime";
	return transformToDisplayTime(value, xpath);
}

AddHearing_HearingOnTime.transformToModel = function(value)
{
	var xpath = XPathConstants.SUBFORM_HEARING_XPATH + "/ValidTime";
	return transformToModelTime(value, xpath);	
}

/**********************************************************************************/

function AddHearing_HearingTimeAllowedHours() {}
AddHearing_HearingTimeAllowedHours.tabIndex = 7;
AddHearing_HearingTimeAllowedHours.maxLength = 3;
AddHearing_HearingTimeAllowedHours.helpText = "The hours allowed for the hearing.";

AddHearing_HearingTimeAllowedHours.validate = function()
{
	var hearingTimeHours = Services.getValue(AddHearing_HearingTimeAllowedHours.dataBinding);
	return validateHoursAllowed(hearingTimeHours);		
}

/**********************************************************************************/

function AddHearing_HearingTimeAllowedMins() {}
AddHearing_HearingTimeAllowedMins.tabIndex = 8;
AddHearing_HearingTimeAllowedMins.maxLength = 2;
AddHearing_HearingTimeAllowedMins.helpText = "The minutes allowed for the hearing.";

AddHearing_HearingTimeAllowedMins.validate = function()
{
	var hearingTimeMins = Services.getValue(AddHearing_HearingTimeAllowedMins.dataBinding);
	return validateMinsAllowed(hearingTimeMins);	
}

/**********************************************************************************/

function AddHearing_VenueCode() {}
AddHearing_VenueCode.tabIndex = -1;
AddHearing_VenueCode.maxLength = 3;
AddHearing_VenueCode.helpText = "Unique three digit court location code - list available.";
AddHearing_VenueCode.isMandatory = function() { return true; }
AddHearing_VenueCode.isReadOnly = function() { return true; }
AddHearing_VenueCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_VenueName() {}
AddHearing_VenueName.tabIndex = -1;
AddHearing_VenueName.maxLength = 30;
AddHearing_VenueName.helpText = "Name of the Court.";
AddHearing_VenueName.isMandatory = function() { return true; }
AddHearing_VenueName.isReadOnly = function() { return true; }
AddHearing_VenueName.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Line1() {}
AddHearing_ContactDetails_Address_Line1.tabIndex = -1;
AddHearing_ContactDetails_Address_Line1.maxLength = 35;
AddHearing_ContactDetails_Address_Line1.helpText = "First line of Hearing address";
AddHearing_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Line2() {}
AddHearing_ContactDetails_Address_Line2.tabIndex = -1;
AddHearing_ContactDetails_Address_Line2.maxLength = 35;
AddHearing_ContactDetails_Address_Line2.helpText = "Second line of Hearing address";
AddHearing_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Line3() {}
AddHearing_ContactDetails_Address_Line3.tabIndex = -1;
AddHearing_ContactDetails_Address_Line3.maxLength = 35;
AddHearing_ContactDetails_Address_Line3.helpText = "Third line of Hearing address";
AddHearing_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Line4() {}
AddHearing_ContactDetails_Address_Line4.tabIndex = -1;
AddHearing_ContactDetails_Address_Line4.maxLength = 35;
AddHearing_ContactDetails_Address_Line4.helpText = "Fourth line of Hearing address";
AddHearing_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Line5() {}
AddHearing_ContactDetails_Address_Line5.tabIndex = -1;
AddHearing_ContactDetails_Address_Line5.maxLength = 35;
AddHearing_ContactDetails_Address_Line5.helpText = "Fifth line of Hearing address";
AddHearing_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_Postcode() {}
AddHearing_ContactDetails_Address_Postcode.tabIndex = -1;
AddHearing_ContactDetails_Address_Postcode.maxLength = 8;
AddHearing_ContactDetails_Address_Postcode.helpText = "Postcode for the address of the Hearing";
AddHearing_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
AddHearing_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function AddHearing_ContactDetails_Address_DXNumber() {}
AddHearing_ContactDetails_Address_DXNumber.tabIndex = -1;
AddHearing_ContactDetails_Address_DXNumber.maxLength = 35;
AddHearing_ContactDetails_Address_DXNumber.helpText = "DX number for the Hearing Court";
AddHearing_ContactDetails_Address_DXNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function AddHearing_ContactDetails_TelephoneNumber() {}
AddHearing_ContactDetails_TelephoneNumber.tabIndex = -1;
AddHearing_ContactDetails_TelephoneNumber.maxLength = 24;
AddHearing_ContactDetails_TelephoneNumber.helpText = "Telephone number for enquiries about the hearing.";
AddHearing_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function AddHearing_ContactDetails_FaxNumber() {}
AddHearing_ContactDetails_FaxNumber.tabIndex = -1;
AddHearing_ContactDetails_FaxNumber.maxLength = 24;
AddHearing_ContactDetails_FaxNumber.helpText = "Fax number for the Hearing Court";
AddHearing_ContactDetails_FaxNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function SelectVenue_VenueCode() {}
SelectVenue_VenueCode.tabIndex = 20;
SelectVenue_VenueCode.isTemporary = function() { return true; }
SelectVenue_VenueCode.maxLength = 3;
SelectVenue_VenueCode.helpText = "Unique three digit court location code - list available.";
SelectVenue_VenueCode.isMandatory = function() { return true; }

SelectVenue_VenueCode.logicOn = [SelectVenue_VenueCode.dataBinding];
/**
 * Implement the callback
 * @author fzj0yl
 * 
 */
SelectVenue_VenueCode.logic = function()
{
	var xpathName = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + SelectVenue_VenueCode.dataBinding + "]/Name";
	var xpathId = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + SelectVenue_VenueCode.dataBinding + "]/Id";
	var venueName = Services.getValue(xpathName);
	var venueId = Services.getValue(xpathId);

	// Set the data in the business part of the model
	if( !CaseManUtils.isBlank(venueName) )
	{
		// set the description field appropriately
		Services.startTransaction();
		Services.setValue(SelectVenue_VenueName.dataBinding, venueName);		
		Services.setValue(selectVenueLOV.dataBinding, venueId);
		Services.endTransaction();
	}
	else{
		// Clear the fields
		Services.setValue(SelectVenue_VenueName.dataBinding, "");
	}
} // end of logic()

SelectVenue_VenueCode.validateOn = [SelectVenue_VenueCode.dataBinding,
									SelectVenue_VenueName.dataBinding];
SelectVenue_VenueCode.validate = function()
{
	var venueCode = Services.getValue(SelectVenue_VenueCode.dataBinding);
	var venueDesc = Services.getValue(SelectVenue_VenueName.dataBinding);	
	var errCode = null;
	if( !CaseManUtils.isBlank(venueCode) )
	{
		// need to ensure that correct value has been entered.  
		// If a one has there will be a corresponding Description
		// &&& NB Will need to look at this in future when auto complete is implemented
		if( CaseManUtils.isBlank(venueDesc) )
		{
			errCode = ErrorCode.getErrorCode('CaseMan_invalidCourtCode_Msg');
		}	
	}// end of if(typeCode != null && typeCode != ""){	
	return errCode;
}

/**********************************************************************************/

function SelectVenue_VenueName() {}

SelectVenue_VenueName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
SelectVenue_VenueName.rowXPath = "Court";
SelectVenue_VenueName.keyXPath = "Name";
SelectVenue_VenueName.displayXPath = "Name";
SelectVenue_VenueName.strictValidation = true;
SelectVenue_VenueName.isTemporary = function() { return true; }
SelectVenue_VenueName.tabIndex = 21;
SelectVenue_VenueName.helpText = "Name of the Court.";
SelectVenue_VenueName.isMandatory = function() { return true; }

SelectVenue_VenueName.logicOn = [SelectVenue_VenueName.dataBinding];
SelectVenue_VenueName.logic = function(event)
{
	if (event.getXPath() != SelectVenue_VenueName.dataBinding)
	{
		return;
	}

	var value = Services.getValue(SelectVenue_VenueName.dataBinding);
	if ( !CaseManUtils.isBlank( value ) )
	{
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + SelectVenue_VenueName.dataBinding + "]/Code");
		if (!CaseManUtils.isBlank(code) && Services.getValue(SelectVenue_VenueCode.dataBinding) != code)
		{
			Services.setValue(SelectVenue_VenueCode.dataBinding, code);
		}
	}
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Line1() {}
SelectVenue_ContactDetails_Address_Line1.tabIndex = -1;
SelectVenue_ContactDetails_Address_Line1.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Line1.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Line1.isMandatory = function() { return true; }
SelectVenue_ContactDetails_Address_Line1.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Line2() {}
SelectVenue_ContactDetails_Address_Line2.tabIndex = -1;
SelectVenue_ContactDetails_Address_Line2.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Line2.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Line2.isMandatory = function() { return true; }
SelectVenue_ContactDetails_Address_Line2.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Line3() {}
SelectVenue_ContactDetails_Address_Line3.tabIndex = -1;
SelectVenue_ContactDetails_Address_Line3.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Line3.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Line3.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Line4() {}
SelectVenue_ContactDetails_Address_Line4.tabIndex = -1;
SelectVenue_ContactDetails_Address_Line4.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Line4.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Line4.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Line5() {}
SelectVenue_ContactDetails_Address_Line5.tabIndex = -1;
SelectVenue_ContactDetails_Address_Line5.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Line5.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Line5.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_Postcode() {}
SelectVenue_ContactDetails_Address_Postcode.tabIndex = -1;
SelectVenue_ContactDetails_Address_Postcode.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_Postcode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_TelephoneNumber() {}
SelectVenue_ContactDetails_Address_TelephoneNumber.tabIndex = -1;
SelectVenue_ContactDetails_Address_TelephoneNumber.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_TelephoneNumber.isReadOnly = function() { return true; }
SelectVenue_ContactDetails_Address_TelephoneNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_DXNumber() {}
SelectVenue_ContactDetails_Address_DXNumber.tabIndex = -1;
SelectVenue_ContactDetails_Address_DXNumber.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_DXNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function SelectVenue_ContactDetails_Address_FaxNumber() {}
SelectVenue_ContactDetails_Address_FaxNumber.tabIndex = -1;
SelectVenue_ContactDetails_Address_FaxNumber.isTemporary = function() { return true; }
SelectVenue_ContactDetails_Address_FaxNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

/**
 * Grid control List of Venues in select venue
 * @author fzj0yl
 * 
 */
function selectVenue_Address_Grid() {};
selectVenue_Address_Grid.tabIndex = 23;
selectVenue_Address_Grid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + selectVenueLOV.dataBinding + "]/ContactDetails"; //List of Courts/venues addresses
selectVenue_Address_Grid.rowXPath = "Address";		// Individual Court/venue
selectVenue_Address_Grid.keyXPath = "AddressId";  	// Unique identifier for a Court/venue
selectVenue_Address_Grid.columns = [   				// column bindings
	{xpath: "Line[1]"},
	{xpath: "Line[2]"}
];

selectVenue_Address_Grid.retrieveOn = [selectVenueLOV.dataBinding];
selectVenue_Address_Grid.srcDataOn = [selectVenueLOV.dataBinding];

// When  a different Address row is selected, get the associated Address Data
selectVenue_Address_Grid.logicOn = [selectVenue_Address_Grid.dataBinding,selectVenueLOV.dataBinding];
selectVenue_Address_Grid.logic = function()
{
	var courtId = Services.getValue(selectVenueLOV.dataBinding);
	var addressId = Services.getValue(selectVenue_Address_Grid.dataBinding);
	if ( !CaseManUtils.isBlank(courtId) && !CaseManUtils.isBlank(addressId) )
	{
		// Set the address details as necessary.
		// Set up xpaths
		var xpathAdd1 = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/Line[1]";	
		var xpathAdd2 = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/Line[2]";	
		
		var xpathAdd3 = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/Line[3]";	
		var xpathAdd4 = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/Line[4]";	
		var xpathAdd5 = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/Line[5]";	
		var xpathPostcode = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/Address[./AddressId = " + addressId + "]/PostCode";	
		
		var xpathDXNo = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/DX";	
		var xpathTelNo = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/TelephoneNumber";	
		var xpathFaxNo = XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Id = " + courtId + "]/ContactDetails/FaxNumber";	
		
		// retrieve values from the DOM
		var add1 = Services.getValue(xpathAdd1);
		var add2 = Services.getValue(xpathAdd2);
		
		// These values are optional, use getValidNodeValue to convert null values
		// to empty strings	
		var add3 = CaseManUtils.getValidNodeValue(Services.getValue(xpathAdd3));
		var add4 = CaseManUtils.getValidNodeValue(Services.getValue(xpathAdd4));
		var add5 = CaseManUtils.getValidNodeValue(Services.getValue(xpathAdd5));
		var postcode = CaseManUtils.getValidNodeValue(Services.getValue(xpathPostcode));
		var dxNo = CaseManUtils.getValidNodeValue(Services.getValue(xpathDXNo));
		var telNo = CaseManUtils.getValidNodeValue(Services.getValue(xpathTelNo));
		var faxNo = CaseManUtils.getValidNodeValue(Services.getValue(xpathFaxNo));
		
		// Set the data in the tmp part of the model
		Services.startTransaction();
		Services.setValue(XPathConstants.SUBFORM_VENUE_XPATH + "/Address/AddressId", addressId);
		Services.setValue(SelectVenue_ContactDetails_Address_Line1.dataBinding, add1);
		Services.setValue(SelectVenue_ContactDetails_Address_Line2.dataBinding, add2);
		Services.setValue(SelectVenue_ContactDetails_Address_Line3.dataBinding, add3);
		Services.setValue(SelectVenue_ContactDetails_Address_Line4.dataBinding, add4);
		Services.setValue(SelectVenue_ContactDetails_Address_Line5.dataBinding, add5);
		Services.setValue(SelectVenue_ContactDetails_Address_Postcode.dataBinding, postcode);		
		Services.setValue(SelectVenue_ContactDetails_Address_DXNumber.dataBinding, dxNo);
		Services.setValue(SelectVenue_ContactDetails_Address_TelephoneNumber.dataBinding, telNo);
		Services.setValue(SelectVenue_ContactDetails_Address_FaxNumber.dataBinding, faxNo);		
		Services.endTransaction();
	}
}

/****************************** BUTTON FIELDS **************************************/

function AddHearing_HearingType_LOVBtn() {}
AddHearing_HearingType_LOVBtn.tabIndex = 4;

/**********************************************************************************/

function AddHearing_AddVenueBtn() {}
AddHearing_AddVenueBtn.tabIndex = 9;

/**********************************************************************************/

function AddHearing_OKBtn() {}
AddHearing_OKBtn.tabIndex = 30;

/**********************************************************************************/

function AddHearing_CancelBtn() {}
AddHearing_CancelBtn.tabIndex = 31;

/**********************************************************************************/

function SelectVenue_VenueLOVBtn() {}
SelectVenue_VenueLOVBtn.tabIndex = 22;

/**********************************************************************************/

function SelectVenue_OKBtn() {}

SelectVenue_OKBtn.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "selectVenue_Address_Grid"} ]
	}
};

SelectVenue_OKBtn.tabIndex = 24;

SelectVenue_OKBtn.validationList = ["SelectVenue_VenueCode","SelectVenue_VenueName","SelectVenue_ContactDetails_Address_Line1","SelectVenue_ContactDetails_Address_Line2"];
/**
 * @author fzj0yl
 * 
 */
SelectVenue_OKBtn.actionBinding = function()
{
	var screenValid = CaseManValidationHelper.validateFields(SelectVenue_OKBtn.validationList);
	if(screenValid)
	{
		Services.dispatchEvent("SelectVenue", BusinessLifeCycleEvents.EVENT_LOWER);

		// Get values from the DOM
		var venueCode = Services.getValue(SelectVenue_VenueCode.dataBinding);
		var venueName = Services.getValue(SelectVenue_VenueName.dataBinding);
		var dxNo = Services.getValue(SelectVenue_ContactDetails_Address_DXNumber.dataBinding);
		var telNo = Services.getValue(SelectVenue_ContactDetails_Address_TelephoneNumber.dataBinding);
		var faxNo = Services.getValue(SelectVenue_ContactDetails_Address_FaxNumber.dataBinding);
		var addressNode = Services.getNode(XPathConstants.SUBFORM_VENUE_XPATH + "/Address");

		// Set the data in the business part of the model
		Services.startTransaction();
		
		Services.setValue(AddHearing_VenueCode.dataBinding, venueCode);
		Services.setValue(AddHearing_VenueName.dataBinding, venueName);
		Services.replaceNode(XPathConstants.SUBFORM_HEARING_XPATH + "/Address", addressNode);
		Services.setValue(AddHearing_ContactDetails_Address_DXNumber.dataBinding, dxNo);
		Services.setValue(AddHearing_ContactDetails_TelephoneNumber.dataBinding, telNo);
		Services.setValue(AddHearing_ContactDetails_FaxNumber.dataBinding, faxNo);

		Services.endTransaction();
		
		// Clear out the temp data
		resetVenuePopup();	
	}
	else
	{
		alert(Messages.VENUEDETS_MESSAGE);
	}	
}

/**********************************************************************************/

function SelectVenue_CancelBtn() {}
SelectVenue_CancelBtn.tabIndex = 25;
SelectVenue_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "SelectVenue" } ]
	}
};

/**
 * @author fzj0yl
 * 
 */
SelectVenue_CancelBtn.actionBinding = function()
{
	Services.dispatchEvent("SelectVenue", BusinessLifeCycleEvents.EVENT_LOWER);
	// Clear out the temp data
	resetVenuePopup();
}

/****************************** LOVS ***********************************************/

function selectHearingTypeLOV() {};

selectHearingTypeLOV.srcData = XPathConstants.REF_DATA_XPATH + "/HearingTypes";
selectHearingTypeLOV.rowXPath = "HearingType";
selectHearingTypeLOV.keyXPath = "id";
selectHearingTypeLOV.columns = [
	{xpath: "Value"},
	{xpath: "Description"}
];

selectHearingTypeLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddHearing_HearingType_LOVBtn"} ],
		keys: [ { key: Key.F6, element: "AddHearing_HearingType_Code" }, { key: Key.F6, element: "AddHearing_HearingType_Name" } ]
	}
};

// Configure the location in the model which will generate data change events
selectHearingTypeLOV.logicOn = [selectHearingTypeLOV.dataBinding];
/**
 * Implement the callback
 * @author fzj0yl
 * 
 */
selectHearingTypeLOV.logic = function()
{
	var id = Services.getValue(selectHearingTypeLOV.dataBinding);		
	if ( !CaseManUtils.isBlank(id) )
	{
		// Lookup the hearing type in ref data from the code that is stored in value
		var xpathCode = XPathConstants.REF_DATA_XPATH + "/HearingTypes/HearingType[id = " + id + "]/Value";		
		var xpathDesc = XPathConstants.REF_DATA_XPATH + "/HearingTypes/HearingType[id = " + id + "]/Description";		
		var hearingTypeCode = Services.getValue(xpathCode);
		var hearingTypeName = Services.getValue(xpathDesc);
		
		// Set the data in the business part of the model
		Services.startTransaction();
		Services.setValue(AddHearing_HearingType_Code.dataBinding, hearingTypeCode);
		Services.setValue(AddHearing_HearingType_Name.dataBinding, hearingTypeName);
		Services.endTransaction();
	}
}

/**
 * @author fzj0yl
 * @return "AddHearing_HearingOnDate"  
 */
selectHearingTypeLOV.nextFocusedAdaptorId = function() {
	return "AddHearing_HearingOnDate";
}

/**********************************************************************************/

function selectVenueLOV() {};
selectVenueLOV.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
selectVenueLOV.rowXPath = "Court";
selectVenueLOV.keyXPath = "Id";
selectVenueLOV.columns = [
	{xpath: "Code"},
	{xpath: "Name"}
];

selectVenueLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "SelectVenue_VenueLOVBtn"} ],
		keys: [ { key: Key.F6, element: "SelectVenue_VenueCode" }, { key: Key.F6, element: "SelectVenue_VenueName" } ]
	}
};

// Configure the location in the model which will generate data change events
selectVenueLOV.logicOn = [selectVenueLOV.dataBinding];
/**
 * Implement the callback
 * @author fzj0yl
 * 
 */
selectVenueLOV.logic = function()
{
	var id = Services.getValue(selectVenueLOV.dataBinding);
	if ( !CaseManUtils.isBlank(id) )
	{
		// Lookup the hearing type in ref data from the code that is stored in value
		var xpathCode = XPathConstants.REF_DATA_XPATH + "/Courts/Court[Id = " + id + "]/Code";		
		var xpathName = XPathConstants.REF_DATA_XPATH + "/Courts/Court[Id = " + id + "]/Name";		
		var courtCode = Services.getValue(xpathCode);
		var courtName = Services.getValue(xpathName);
		
		// Set the data in the business part of the model
		Services.startTransaction();
		Services.setValue(SelectVenue_VenueCode.dataBinding, courtCode);
		Services.setValue(SelectVenue_VenueName.dataBinding, courtName);
		Services.endTransaction();
	}
} // end of logic()

/**
 * @author fzj0yl
 * @return "selectVenue_Address_Grid"  
 */
selectVenueLOV.nextFocusedAdaptorId = function() {
	return "selectVenue_Address_Grid";
}

/****************************** POPUPS *********************************************/

function SelectVenue() {};

SelectVenue.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddHearing_AddVenueBtn"} ]
	}
};

/**
 * @author fzj0yl
 * @return "AddHearing_OKBtn"  
 */
SelectVenue.nextFocusedAdaptorId = function() {
	return "AddHearing_OKBtn";
}
