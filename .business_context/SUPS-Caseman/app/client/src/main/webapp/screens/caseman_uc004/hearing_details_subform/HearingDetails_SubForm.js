/** 
 * @fileoverview HearingDetails_SubForm.js:
 * This file contains the configurations for the Hearing Details Subform
 *
 * @author Chris Vincent
 * 
 * Change History:
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
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.DATA_XPATH = "/ds/Hearing";
XPathConstants.FORM_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/Subforms/HearingDetailsSubform";
XPathConstants.SUBFORM_REF_DATA_XPATH = "/ds/var/subform/ReferenceData";
XPathConstants.HEARING_TIME_VALID_XPATH = XPathConstants.DATA_XPATH + "/TimeValid";

/************************** FORM CONFIGURATIONS *************************************/

function hearingDetailsSubform() {}

/**
 * @author rzxd7g
 * 
 */
hearingDetailsSubform.initialise = function()
{
	// Set the venue code with the Case's owning court
	var owningCourt = Services.getValue(XPathConstants.FORM_DATA_XPATH + "/OwningCourt");
	Services.startTransaction();
	Services.setValue(HearingDetails_VenueCode.dataBinding, owningCourt);
	Services.setValue(HearingDetails_HearingType.dataBinding, JudgmentVariables.HEARING_TYPE_DESC);
	Services.setValue(XPathConstants.DATA_XPATH + "/TypeOfHearingCode", JudgmentVariables.HEARING_TYPE_CODE);
	Services.endTransaction();
}

// Load the reference data from the xml into the model
hearingDetailsSubform.refDataServices = [
	{name:"Courts", dataBinding:XPathConstants.SUBFORM_REF_DATA_XPATH, serviceName:"getCourts", serviceParams:[]},
	{name:"NonWorkingDays", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]}
];

hearingDetailsSubform.loadExisting = 
{
	name: "formLoadExisting",
	fileName: "HearingDOM.xml",
	dataBinding: "/ds"
}

hearingDetailsSubform.modifyLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [],
                    doubleClicks: []
                  },

	fileName: "HearingDOM.xml",
	dataBinding: "/ds"
}

hearingDetailsSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "HearingDetails_OkButton"} ],
                    doubleClicks: []
                  },

	modify: {},

	returnSourceNodes: [XPathConstants.DATA_XPATH],
	postSubmitAction: {
		close: {}
	}
}

hearingDetailsSubform.cancelLifeCycle = {

	eventBinding: {	keys: [],
					singleClicks: [],
					doubleClicks: []
				  },
				  
	raiseWarningIfDOMDirty: false
}

/**************************** HELPER FUNCTIONS *************************************/

/**
 * @param date
 * @author rzxd7g
 * @return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg") , null  
 */
function validateNonWorkingDate(date) 
{
 	if ( Services.exists(JudgmentVariables.REF_DATA_XPATH + "/NonWorkingDays/NonWorkingDay[./Date = '" + date + "']") )
 	{
 		return ErrorCode.getErrorCode("CaseMan_dateNonWorkingDay_Msg");
 	}
 	return null;
}

/******************************* LOV POPUPS ****************************************/

function CourtsLOVGrid() {};
CourtsLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedLOVRow/Court";
CourtsLOVGrid.srcData = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts";
CourtsLOVGrid.rowXPath = "Court";
CourtsLOVGrid.keyXPath = "Code";
CourtsLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

CourtsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "HearingDetails_VenueLOVButton"} ],
		keys: [ { key: Key.F6, element: "HearingDetails_VenueCode" },
				{ key: Key.F6, element: "HearingDetails_VenueName" } ]
	}
};

CourtsLOVGrid.logicOn = [CourtsLOVGrid.dataBinding];
CourtsLOVGrid.logic = function(event)
{
	if (event.getXPath() != CourtsLOVGrid.dataBinding)
	{
		return;
	}

	var value = Services.getValue(CourtsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		Services.startTransaction();
		Services.setValue(HearingDetails_VenueCode.dataBinding, value);
		Services.setValue(CourtsLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**
 * @author rzxd7g
 * @return "HearingDetails_VenueCode"  
 */
CourtsLOVGrid.nextFocusedAdaptorId = function() {
	return "HearingDetails_VenueCode";
}

/********************************* GRIDS *******************************************/

function HearingDetails_VenueAddressesGrid() {};

/**
 * Transform the data displayed in the grid to be address line 1, address line 2
 * @param index
 * @author rzxd7g
 * @return addressString  
 */
HearingDetails_VenueAddressesGrid.concatAddrLines = function(index)
{
	var addressString = "" + Services.getValue(XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + index + "]/Line[1]");
	addressString = addressString + ", " + Services.getValue(XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + index + "]/Line[2]");
	return addressString;
}

HearingDetails_VenueAddressesGrid.tabIndex = 6;
HearingDetails_VenueAddressesGrid.retrieveOn = [XPathConstants.DATA_XPATH + "/VenueCode"];
HearingDetails_VenueAddressesGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/VenueCode"];
HearingDetails_VenueAddressesGrid.dataBinding = XPathConstants.DATA_XPATH + "/Address/AddressID";
HearingDetails_VenueAddressesGrid.srcData = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails";
HearingDetails_VenueAddressesGrid.rowXPath = "Address";
HearingDetails_VenueAddressesGrid.keyXPath = "AddressId";
HearingDetails_VenueAddressesGrid.columns = [
	{xpath: "AddressId", transformToDisplay: HearingDetails_VenueAddressesGrid.concatAddrLines}
];

/****************************** DATA BINDINGS **************************************/

HearingDetails_VenueCode.dataBinding = XPathConstants.DATA_XPATH + "/VenueCode";
HearingDetails_VenueName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/tmp/VenueNameAutocomplete"
HearingDetails_HearingType.dataBinding = XPathConstants.DATA_XPATH + "/TypeOfHearing";
HearingDetails_Date.dataBinding = XPathConstants.DATA_XPATH + "/Date";
HearingDetails_Time.dataBinding = XPathConstants.DATA_XPATH + "/Time";
HearingDetails_ContactDetails_Address_Line1.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/Line[1]";
HearingDetails_ContactDetails_Address_Line2.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/Line[2]";
HearingDetails_ContactDetails_Address_Line3.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/Line[3]";
HearingDetails_ContactDetails_Address_Line4.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/Line[4]";
HearingDetails_ContactDetails_Address_Line5.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/Line[5]";
HearingDetails_ContactDetails_Address_Postcode.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/Address[./AddressId = " + HearingDetails_VenueAddressesGrid.dataBinding + "]/PostCode";
HearingDetails_ContactDetails_DX.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/DXNumber";
HearingDetails_ContactDetails_TelephoneNumber.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/TelephoneNumber";
HearingDetails_ContactDetails_FaxNumber.dataBinding = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + XPathConstants.DATA_XPATH + "/VenueCode]/ContactDetails/FaxNumber";

/******************************* INPUT FIELDS **************************************/

function HearingDetails_VenueCode() {}
HearingDetails_VenueCode.tabIndex = 1;
HearingDetails_VenueCode.maxLength = 3;
HearingDetails_VenueCode.helpText = "The court code of the Hearing venue";
HearingDetails_VenueCode.componentName = "Hearing Venue Code";
HearingDetails_VenueCode.isMandatory = function() { return true; }

HearingDetails_VenueCode.validate = function()
{
	var ec = null;
	var venueName = Services.getValue(XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + HearingDetails_VenueCode.dataBinding + "]/Name");
	if( null == venueName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

HearingDetails_VenueCode.logicOn = [HearingDetails_VenueCode.dataBinding];
HearingDetails_VenueCode.logic = function(event)
{
	if ( event.getXPath() != HearingDetails_VenueCode.dataBinding)
	{
		return;
	}
	
	if( this.getValid() )
	{
		var venueName = Services.getValue(XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + HearingDetails_VenueCode.dataBinding + "]/Name");
		Services.setValue(XPathConstants.DATA_XPATH + "/VenueName", venueName);
		Services.setValue(HearingDetails_VenueName.dataBinding, Services.getValue(HearingDetails_VenueCode.dataBinding));
	}
}

HearingDetails_VenueCode.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

HearingDetails_VenueCode.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/**********************************************************************************/

function HearingDetails_VenueName() {}
HearingDetails_VenueName.srcData = XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts";
HearingDetails_VenueName.rowXPath = "Court";
HearingDetails_VenueName.keyXPath = "Code";
HearingDetails_VenueName.displayXPath = "Name";
HearingDetails_VenueName.strictValidation = true;
HearingDetails_VenueName.tabIndex = 2;
HearingDetails_VenueName.helpText = "The name of the court for the Hearing venue";
HearingDetails_VenueName.componentName = "Hearing Venue Name";
HearingDetails_VenueName.isMandatory = function() { return true; }
HearingDetails_VenueName.logicOn = [HearingDetails_VenueName.dataBinding];
HearingDetails_VenueName.logic = function()
{
	var value = Services.getValue(HearingDetails_VenueName.dataBinding);
	var courtName = Services.getValue(XPathConstants.SUBFORM_REF_DATA_XPATH + "/Courts/Court[./Code = " + HearingDetails_VenueName.dataBinding + "]/Name");
	if( null != courtName ) 
	{
		// The entered value must be valid
		Services.setValue(HearingDetails_VenueCode.dataBinding, value);
		Services.setValue(XPathConstants.DATA_XPATH + "/VenueName", courtName);
	}
}

/**********************************************************************************/

function HearingDetails_HearingType() {}
HearingDetails_HearingType.tabIndex = -1;
HearingDetails_HearingType.helpText = "Indicate the type of Hearing.";
HearingDetails_HearingType.componentName = "Hearing Type";
HearingDetails_HearingType.isMandatory = function() { return true; }
HearingDetails_HearingType.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_Time() {}
HearingDetails_Time.tabIndex = 5;
HearingDetails_Time.helpText = "The time scheduled for the Hearing";
HearingDetails_Time.componentName = "Hearing Time";
HearingDetails_Time.maxLength = 5;
HearingDetails_Time.isMandatory = function() { return true; }
HearingDetails_Time.validate = function()
{
	// If we already know the value is bad, throw the error straight away
	if ( Services.getValue(XPathConstants.HEARING_TIME_VALID_XPATH) == "N" )
	{
		return ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
	}
	
	// To get to this point, we know that XPathConstants.HEARING_TIME_VALID_XPATH is Y so has passed
	// the time format validation in the TransformToModel
	var value = Services.getValue(HearingDetails_Time.dataBinding);
	var errCode = null;
	if ( !CaseManUtils.isBlank(value) )
	{
		// The value put in the dom is supposed to be a number, so first check if it is numeric
		var validSeconds = value.search(/^\d+$/);
		if ( validSeconds != 0 )
		{
			// If the is number validation fails, we know the validate function has been called from
			// the setting of the XPathConstants.HEARING_TIME_VALID_XPATH (see validateOn[] config).
			// We know it is in a valid time format, but need to convert the value to a number for
			// validation purposes.
			value = CaseManUtils.convertTimeToSeconds(value);
		}
		
		// If it is numeric, check that it is within a valid range
		if ( value < 0 || value > 86400 )
		{
			errCode = ErrorCode.getErrorCode("CaseMan_invalidTime_Msg");
		}
	}
	return errCode;
}

HearingDetails_Time.transformToDisplay = function(value)
{
	if ( Services.getValue(XPathConstants.HEARING_TIME_VALID_XPATH) == "N" )
	{
		// If the time entered is not valid, check for the value stored when a 
		// variation of 0 is entered (due to problems comparing 00.00 to 0
		return ( value == "00_00" ) ? "00.00" : value;
	}
	
	if( null != value && !isNaN(value) )
	{
		var convertedTime = CaseManUtils.convertSecondsToTime(value);
		if ( null != convertedTime )
		{
			if ( CaseManValidationHelper.validateTime(convertedTime) )
			{
				// Only return a converted time if it is a valid time
				return convertedTime;
			}
		}			
	}		
	return value;
}

HearingDetails_Time.transformToModel = function(value)
{
	var validTimeInd = "N";
	var returnValue = value;
	if ( null != value )
	{
		if ( CaseManValidationHelper.validateTime(value) )
		{
			// Valid time format, convert the time to seconds after midnight
			validTimeInd = "Y";
			returnValue = CaseManUtils.convertTimeToSeconds(value);
		}
		else if ( value == 0 )
		{
			// Invalid time which meets the 0 value anomaly, store a non numeric string instead 
			// of 0 which force the validate and transform to display to fire when a valid time
			// is entered.
			returnValue = "00_00";
		}
	}
	
	// Set the hearing time valid flag and return the appropriate value for the model
	Services.setValue(XPathConstants.HEARING_TIME_VALID_XPATH, validTimeInd);
	return returnValue;
}

/**********************************************************************************/

function HearingDetails_Date() {}
HearingDetails_Date.weekends = false;
HearingDetails_Date.tabIndex = 4;
HearingDetails_Date.maxLength = 11;
HearingDetails_Date.helpText = "The date scheduled for the Hearing";
HearingDetails_Date.componentName = "Hearing Date";
HearingDetails_Date.isMandatory = function() { return true; }
HearingDetails_Date.validate = function()
{
	var value = Services.getValue(HearingDetails_Date.dataBinding);
	return validateNonWorkingDate(value);
}

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line1() {}
HearingDetails_ContactDetails_Address_Line1.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line1.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line1.maxLength = 35;
HearingDetails_ContactDetails_Address_Line1.helpText = "First line of the Hearing address";
HearingDetails_ContactDetails_Address_Line1.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Line1.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line2() {}
HearingDetails_ContactDetails_Address_Line2.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Line2.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line2.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line2.maxLength = 35;
HearingDetails_ContactDetails_Address_Line2.helpText = "Second line of the Hearing address";
HearingDetails_ContactDetails_Address_Line2.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line3() {}
HearingDetails_ContactDetails_Address_Line3.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Line3.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line3.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line3.maxLength = 35;
HearingDetails_ContactDetails_Address_Line3.helpText = "Third line of the Hearing address";
HearingDetails_ContactDetails_Address_Line3.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line4() {}
HearingDetails_ContactDetails_Address_Line4.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Line4.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line4.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line4.maxLength = 35;
HearingDetails_ContactDetails_Address_Line4.helpText = "Fourth line of the Hearing address";
HearingDetails_ContactDetails_Address_Line4.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Line5() {}
HearingDetails_ContactDetails_Address_Line5.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Line5.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Line5.tabIndex = -1;
HearingDetails_ContactDetails_Address_Line5.maxLength = 35;
HearingDetails_ContactDetails_Address_Line5.helpText = "Fifth line of the Hearing address";
HearingDetails_ContactDetails_Address_Line5.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_Address_Postcode() {}
HearingDetails_ContactDetails_Address_Postcode.isTemporary = function() { return true; }
HearingDetails_ContactDetails_Address_Postcode.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_Address_Postcode.tabIndex = -1;
HearingDetails_ContactDetails_Address_Postcode.maxLength = 8;
HearingDetails_ContactDetails_Address_Postcode.helpText = "Postcode line of the Hearing address";
HearingDetails_ContactDetails_Address_Postcode.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_DX() {}
HearingDetails_ContactDetails_DX.isTemporary = function() { return true; }
HearingDetails_ContactDetails_DX.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_DX.tabIndex = -1;
HearingDetails_ContactDetails_DX.maxLength = 35;
HearingDetails_ContactDetails_DX.helpText = "Document exchange reference number";
HearingDetails_ContactDetails_DX.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_TelephoneNumber() {}
HearingDetails_ContactDetails_TelephoneNumber.isTemporary = function() { return true; }
HearingDetails_ContactDetails_TelephoneNumber.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_TelephoneNumber.tabIndex = -1;
HearingDetails_ContactDetails_TelephoneNumber.maxLength = 24;
HearingDetails_ContactDetails_TelephoneNumber.helpText = "Telephone number for enquiries";
HearingDetails_ContactDetails_TelephoneNumber.isReadOnly = function() { return true; }

/**********************************************************************************/

function HearingDetails_ContactDetails_FaxNumber() {}
HearingDetails_ContactDetails_FaxNumber.isTemporary = function() { return true; }
HearingDetails_ContactDetails_FaxNumber.retrieveOn = [HearingDetails_VenueAddressesGrid.dataBinding];
HearingDetails_ContactDetails_FaxNumber.tabIndex = -1;
HearingDetails_ContactDetails_FaxNumber.maxLength = 24;
HearingDetails_ContactDetails_FaxNumber.helpText = "Fax number for enquiries";
HearingDetails_ContactDetails_FaxNumber.isReadOnly = function() { return true; }

/****************************** BUTTON FIELDS **************************************/

function HearingDetails_VenueLOVButton() {}
HearingDetails_VenueLOVButton.tabIndex = 3;

/*********************************************************************************/

function HearingDetails_OkButton() {}
HearingDetails_OkButton.tabIndex = 10;

/*********************************************************************************/

function HearingDetails_CancelButton() {}
HearingDetails_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "hearingDetailsSubform" } ]
	}
};
HearingDetails_CancelButton.tabIndex = 11;
/**
 * @author rzxd7g
 * 
 */
HearingDetails_CancelButton.actionBinding = function()
{
	if( confirm(Messages.CANCEL_HEARING_MESSAGE) )
	{
		Services.dispatchEvent("hearingDetailsSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
	}
}
