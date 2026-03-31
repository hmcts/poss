/** 
 * @fileoverview DisplayDMSDailyReport.js:
 * This file contains the form and field configurations for the UC022 - Display Daily DMS 
 * screen.
 *
 * @author Dave Turner, Chris Vincent
 * @version 0.1
 * 
 * 25/08/2006 - Chris Vincent, introduced the Oracle Reports Progress Bar Popup to the screen
 * 				to fix defect 4747.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 10/10/2006 - Chris Vincent, defect 5638 - introduction of paging to this screen.  Changes to the
 * 				retrieval and commit of data via Search, Delete, Previous and Next buttons.
 * 22/03/2007 - Chris Vincent, changed the owning court fields to read only so autocomplete becomes
 * 				a text field and LOV (inc button) removed.  Temp_CaseMan defect 363.  Is now CaseMan
 * 				Defect 6082.
 * 04/08/2009 - Chris Vincent, change to DMSDailyReport.initialise() function to load data automatically
 *              if navigating back to the screen.
 *              Removed Claimant and Defendant columns from the Results_ResultsGrid.columns array.
 *              Added line in exitScreen() to remove the /ds/var/app parameter for the screen.
 *              TRAC Ticket 1186.
 * 17/12/2009 - Chris Vincent, change to the default sort order of the obligations grid to cater for the
 * 		       two party columns that were previously removed.  TRAC Ticket 2622.
 * 29/01/2013 - Chris Vincent, new parameters for screen and report added as part of RFS 3719.  Trac 4767 
 */

/**
 * XPath Constants
 * @author Chris Vincent
 */
function XPathConstants() {};
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DISPLAYBUTTON_ENABLED_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DisplayButtonEnabled";
XPathConstants.DATA_XPATH = "/ds/OverdueObligations";
XPathConstants.QUERY_COURTCODE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/QueryCourtCode";
XPathConstants.DMS_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";

/****************************** MAIN FORM *****************************************/

function DMSDailyReport () {};	

/**
 * Initialise function for the Display DMS Screen.  Sets the default values for the screen.
 * @author Dave Turner, Chris Vincent
 */
DMSDailyReport.initialise = function()
{
	var courtCode = CaseManUtils.getUserParameter(CaseManFormParameters.COURTNUMBER_XPATH);
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + CaseManFormParameters.COURTNUMBER_XPATH + "]/Name");
	Services.setValue(Header_OwningCourtCode.dataBinding, courtCode);
	Services.setValue(Header_OwningCourtName.dataBinding, courtName);

	var externalPageNo = Services.getValue(DisplayDMSParams.PAGE_NUMBER);
	if ( !CaseManUtils.isBlank(externalPageNo) )
	{
		// Navigating back into the screen from a previous search - reload data
		Services.setValue(XPathConstants.DMS_PAGENUMBER_XPATH, externalPageNo);
		Services.setValue(XPathConstants.QUERY_COURTCODE_XPATH, courtCode);
		retrieveOverdueObligations(true);
	}
	else
	{
		// Navigating into the screen from main menu
		Services.setValue(XPathConstants.DMS_PAGENUMBER_XPATH, 0);
		Services.setValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH, "true");
	}
}

// Load the reference data from the xml into the model
DMSDailyReport.refDataServices = [
	{ name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] },
	{ name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[] },
	{ name:"ObligationTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getObligationTypes", serviceParams:[]}
];

/************************** HELPER FUNCTIONS **************************************/

/**
 * Handles the exit from the screen back to the main menu if not called from elsewhere.
 * @author Dave Turner
 */
function exitScreen()
{
	Services.removeNode(DisplayDMSParams.PARENT);
    if ( NavigationController.callStackExists() )
	{
		// Call stack exists, go to the next screen
		NavigationController.nextScreen();
	}
	else
	{
		Services.navigate(NavigationController.MAIN_MENU);
	}
}

/**********************************************************************************/

/**
 * Clears the details of the screen down and resets the screen
 */
function clearScreen()
{
	Services.startTransaction();
	Services.removeNode(XPathConstants.VAR_PAGE_XPATH + "/QueryData");
	Services.removeNode(XPathConstants.DATA_XPATH);
	Services.removeNode(DisplayDMSParams.PARENT);
	CaseManUtils.clearNavigationLinks();
	
	Services.setValue(XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedObligation", "");
	Services.setValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH, "true");
	Services.setValue(XPathConstants.DMS_PAGENUMBER_XPATH, 0);
	Services.endTransaction();
	
	CaseManUtils.resetGridSortOrder("Results_ResultsGrid");
	Services.setFocus("Header_DisplayOverdueObligationsBtn");
}

/**********************************************************************************/

/**
 * Calls the search service.  Introduced as part of defect 5638.
 * @author Chris Vincent
 * 
 * @param blnNextButton [Boolean] Indicates whether or not has been called from the Next button.
 */
function retrieveOverdueObligations(blnNextButton) 
{
	// Build and submit search query to service	
	var params = new ServiceParams();

	// Set up the Court Code
	var courtcode = Services.getValue(XPathConstants.QUERY_COURTCODE_XPATH);
	params.addSimpleParameter("CourtCode", courtcode);
	
	// Set the page parameters
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	params.addSimpleParameter("pageNumber", pageNumber );
	params.addSimpleParameter("pageSize", CaseManFormParameters.DEFAULT_PAGE_SIZE );
	
	var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
	var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
	var obligationType = Services.getValue(DMS_Query_ObligationTypeCode.dataBinding);
	
	params.addSimpleParameter("startDate", CaseManUtils.isBlank(startDate) ? "" : startDate );
	params.addSimpleParameter("endDate", CaseManUtils.isBlank(endDate) ? "" : endDate );
	params.addSimpleParameter("obligationType", CaseManUtils.isBlank(obligationType) ? "" : obligationType );
	
	// Use a different onSuccess handler for the Next button	
	if ( blnNextButton )
	{
		Services.callService("getOverdueObligations", params, Results_NextButton, true);
	}
	else
	{
    	Services.callService("getOverdueObligations", params, Header_DisplayOverdueObligationsBtn, true);
    }
}

/**********************************************************************************/

function getTodaysDate() 
{
	var date = Services.getValue(XPathConstants.REF_DATA_XPATH + "/SystemDate");
	if ( date == null )
	{
		var date = CaseManUtils.convertDateToPattern(new Date(),"YYYY-MM-DD");
	}
	return date;
}

/********************************** GRIDS *****************************************/

function Results_ResultsGrid() {};

/**
 * Sort function for the Overdue Obligations grid - Obligation Type column.  Business requirement
 * dictates that type 2, 32 and 33 should be displayed first, followed by type 4, then type 3, then any other 
 * type (except type 27) and finally type 27 obligations last.
 * @author Chris Vincent
 * 
 * @param a The first obligation type to be compared
 * @param b The second obligation type to be compared
 * @return 1 if a should be above b in the sort, 0 if equal and -1 if a should be below b.
 */
Results_ResultsGrid.sortObligationType = function(a,b)
{
	var aIdx = (a == "2" || a == "32" || a == "33") ? 0 : (a == "4") ? 1 : (a == "3") ? 2 : (a == "27") ? 4 : 3; 
	var bIdx = (b == "2" || b == "32" || b == "33") ? 0 : (b == "4") ? 1 : (b == "3") ? 2 : (b == "27") ? 4 : 3;
	
	var aInt = parseInt(a);
	var bInt = parseInt(b);
	
	return (aIdx > bIdx) ? -1 : (aIdx < bIdx) ? 1 : (aInt > bInt) ? -1 : (aInt < bInt) ? 1 : 0;
}

Results_ResultsGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedObligation";
Results_ResultsGrid.tabIndex = 10;
Results_ResultsGrid.srcData = XPathConstants.DATA_XPATH;
Results_ResultsGrid.rowXPath = "Obligation";
Results_ResultsGrid.keyXPath = "SurrogateKey";
Results_ResultsGrid.columns = [
	{ xpath: "ObligationType", sort: Results_ResultsGrid.sortObligationType, defaultSort:"true", defaultSortOrder:"ascending", additionalSortColumns: [ { columnNumber: 2, orderOnAsc: "ascending", orderOnDesc: "descending" }, { columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending" } ] },
	{ xpath: "CaseNumber" },
	{ xpath: "ExpiryDate", sort: CaseManUtils.sortGridDatesAsc, transformToDisplay: CaseManUtils.formatGridDate },
	{ xpath: "LastUsedBy" },
	{ xpath: "Notes" }
];

Results_ResultsGrid.enableOn = [XPathConstants.DMS_PAGENUMBER_XPATH];
Results_ResultsGrid.isEnabled = function()
{
	// Disabled if no data displayed
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	return ( pageNumber == 0 ) ? false : true;
}

/******************************* LOV POPUPS ****************************************/

function DMS_Query_ObligationTypeLOV() {};
DMS_Query_ObligationTypeLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/ObligationType";
DMS_Query_ObligationTypeLOV.srcData = XPathConstants.REF_DATA_XPATH + "/ObligationTypes";
DMS_Query_ObligationTypeLOV.rowXPath = "ObligationType";
DMS_Query_ObligationTypeLOV.keyXPath = "Id";
DMS_Query_ObligationTypeLOV.columns = [
	{xpath: "Id", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
DMS_Query_ObligationTypeLOV.styleURL = "/css/ObligationTypeLOVGrid.css";
DMS_Query_ObligationTypeLOV.destroyOnClose = false;

DMS_Query_ObligationTypeLOV.prePopupPrepare = function()
{
	Services.setValue(DMS_Query_ObligationTypeLOV.dataBinding, "");
}

DMS_Query_ObligationTypeLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "DMS_Query_ObligationTypeLOVBtn"} ],
		keys: [ { key: Key.F6, element: "DMS_Query_ObligationTypeCode" }, { key: Key.F6, element: "DMS_Query_ObligationTypeName" } ]
	}
};

DMS_Query_ObligationTypeLOV.logicOn = [DMS_Query_ObligationTypeLOV.dataBinding];
DMS_Query_ObligationTypeLOV.logic = function(event)
{
	if ( event.getXPath().indexOf(DMS_Query_ObligationTypeLOV.dataBinding) == -1 )
	{
		return;
	}

	var selectedType = Services.getValue(DMS_Query_ObligationTypeLOV.dataBinding);
	Services.setValue(DMS_Query_ObligationTypeCode.dataBinding, selectedType);
}

/**************************** DATA BINDINGS ***************************************/

Header_OwningCourtCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/UserData/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/UserData/OwningCourtName";
DMS_Query_StartDate.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/QueryData/StartDate";
DMS_Query_EndDate.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/QueryData/EndDate";
DMS_Query_ObligationTypeCode.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/QueryData/ObligationTypeCode";
DMS_Query_ObligationTypeName.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/QueryData/ObligationTypeName";
ObligationDescription_Txt.dataBinding = XPathConstants.DATA_XPATH + "/Obligation[./SurrogateKey=" + Results_ResultsGrid.dataBinding + "]/ObligationDescription";

/********************************* FIELDS ******************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.isReadOnly = function() { return true; }
 
/***********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.isReadOnly = function() { return true; }

/***********************************************************************************/

function DMS_Query_StartDate() {}
DMS_Query_StartDate.tabIndex = 3;
DMS_Query_StartDate.helpText = "Start date";
DMS_Query_StartDate.readOnlyOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH];
DMS_Query_StartDate.isReadOnly = function() 
{ 
	var searchEnabled = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return (searchEnabled == "true") ? false : true;
}
DMS_Query_StartDate.mandatoryOn = [DMS_Query_EndDate.dataBinding];
DMS_Query_StartDate.isMandatory = function()
{
	// Mandatory if an End Date specified
	var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
	return (CaseManUtils.isBlank(endDate)) ? false : true;
}

DMS_Query_StartDate.validateOn = [DMS_Query_StartDate.dataBinding, DMS_Query_EndDate.dataBinding];
DMS_Query_StartDate.validate = function()
{
	var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
	var startDateObj = CaseManUtils.isBlank(startDate) ? null : CaseManUtils.createDate(startDate);

	var ec = null;
	if(startDateObj != null)
	{
		var validDate = FWDateUtil.parseXSDDate(startDate);
		if ( validDate == null )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			// Valid date, check other validation
			var todayDateObj = CaseManUtils.createDate(getTodaysDate());
			if ( CaseManUtils.compareDates(startDateObj, todayDateObj) != 1 )
			{
				// Date must be in the past
				ec = ErrorCode.getErrorCode("CaseMan_dateCanOnlyBeInThePast_Msg");
			}
			else
			{	
				// Date is in the past
				var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
				var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);
				if ( endDateObj != null && CaseManUtils.compareDates(startDateObj, endDateObj) == -1 )
				{
					// Start date cannot be after the End Date
					ec = ErrorCode.getErrorCode("CaseMan_startDateCannotBeLaterThanEndDate_Msg");
				}
			}
		}    
	}

    return ec;
}

/***********************************************************************************/

function DMS_Query_EndDate() {}
DMS_Query_EndDate.tabIndex = 4;
DMS_Query_EndDate.helpText = "End date";
DMS_Query_EndDate.readOnlyOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH];
DMS_Query_EndDate.isReadOnly = function() 
{ 
	var searchEnabled = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return (searchEnabled == "true") ? false : true;
}
DMS_Query_EndDate.mandatoryOn = [DMS_Query_StartDate.dataBinding];
DMS_Query_EndDate.isMandatory = function()
{
	// Mandatory if a Start Date specified
	var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
	return (CaseManUtils.isBlank(startDate)) ? false : true;
}

DMS_Query_EndDate.validate = function()
{
	var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
	var endDateObj = CaseManUtils.isBlank(endDate) ? null : CaseManUtils.createDate(endDate);

	var ec = null;
	if(endDateObj != null)
	{
		var validDate = FWDateUtil.parseXSDDate(endDate);
		if ( validDate == null )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidDateFormat_Msg");
		}
		else
		{
			// Valid date, check other validation
			var todayDateObj = CaseManUtils.createDate(getTodaysDate());
			if ( CaseManUtils.compareDates(endDateObj, todayDateObj) != 1 )
			{
				// Date must be in the past
				ec = ErrorCode.getErrorCode("CaseMan_dateCanOnlyBeInThePast_Msg");
			}
		}    
	}

    return ec;
}

/***********************************************************************************/

function DMS_Query_ObligationTypeCode() {}
DMS_Query_ObligationTypeCode.tabIndex = 5;
DMS_Query_ObligationTypeCode.helpText = "The unique identifier for the obligation type";
DMS_Query_ObligationTypeCode.maxLength = 3;
DMS_Query_ObligationTypeCode.isTemporary = function() {return true;}
DMS_Query_ObligationTypeCode.validate = function()
{
	var ec = null;
	var description = Services.getValue(XPathConstants.REF_DATA_XPATH + "/ObligationTypes/ObligationType[./Id = " + this.dataBinding + "]/Description");	
	if ( CaseManUtils.isBlank(description) )
	{
		// The entered obligation does not exist
		ec = ErrorCode.getErrorCode("CaseMan_maintainObligations_invalidObligation_Msg");
	}
	return ec;
}

DMS_Query_ObligationTypeCode.logicOn = [DMS_Query_ObligationTypeCode.dataBinding];
DMS_Query_ObligationTypeCode.logic = function(event)
{
	if(!CaseManUtils.isBlank(Services.getValue(DMS_Query_ObligationTypeCode.dataBinding)))
	{
		// Populate the description field by looking up the obligation type in reference data
		var description = Services.getValue(XPathConstants.REF_DATA_XPATH + "/ObligationTypes/ObligationType[./Id = " + this.dataBinding + "]/Description");
		Services.setValue(DMS_Query_ObligationTypeName.dataBinding, description);
	}
	else
	{
		// The obligation type is blank so clear out the description
		Services.setValue(DMS_Query_ObligationTypeName.dataBinding, "");
	}
}

DMS_Query_ObligationTypeCode.readOnlyOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH];
DMS_Query_ObligationTypeCode.isReadOnly = function() 
{ 
	var searchEnabled = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return (searchEnabled == "true") ? false : true;
}

/***********************************************************************************/

function DMS_Query_ObligationTypeName() {}
DMS_Query_ObligationTypeName.srcData = XPathConstants.REF_DATA_XPATH + "/ObligationTypes";
DMS_Query_ObligationTypeName.rowXPath = "ObligationType";
DMS_Query_ObligationTypeName.keyXPath = "Description";
DMS_Query_ObligationTypeName.displayXPath = "Description";
DMS_Query_ObligationTypeName.strictValidation = true;
DMS_Query_ObligationTypeName.tabIndex = 6;
DMS_Query_ObligationTypeName.helpText = "Description of the obligation type";
DMS_Query_ObligationTypeName.isTemporary = function() { return true; }
DMS_Query_ObligationTypeName.logicOn = [DMS_Query_ObligationTypeName.dataBinding];
DMS_Query_ObligationTypeName.logic = function(event)
{
	if (event.getXPath() != DMS_Query_ObligationTypeName.dataBinding)
	{
		return;
	}

	var oblDesc = Services.getValue(DMS_Query_ObligationTypeName.dataBinding);
	if ( !CaseManUtils.isBlank( oblDesc ) )
	{
		// Populate the Code field
		var code = Services.getValue(XPathConstants.REF_DATA_XPATH + "/ObligationTypes/ObligationType[./Description = " + this.dataBinding + "]/Id");
		if (!CaseManUtils.isBlank(code) && Services.getValue(DMS_Query_ObligationTypeCode.dataBinding) != code)
		{
			Services.setValue(DMS_Query_ObligationTypeCode.dataBinding, code);
		}
	}
	else
	{
		if ( null == DMS_Query_ObligationTypeCode.validate() )
		{
			// Obligation Type Description cleared so clear the Obligation Type Code field
			Services.setValue(DMS_Query_ObligationTypeCode.dataBinding, "");
		}
	}
}

DMS_Query_ObligationTypeName.readOnlyOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH];
DMS_Query_ObligationTypeName.isReadOnly = function() 
{ 
	var searchEnabled = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return (searchEnabled == "true") ? false : true;
}

/***********************************************************************************/

function ObligationDescription_Txt() {};
ObligationDescription_Txt.tabIndex = -1;
ObligationDescription_Txt.retrieveOn = [Results_ResultsGrid.dataBinding];
ObligationDescription_Txt.helpText = "Description of currently selected obligation type"
ObligationDescription_Txt.isReadOnly = function() { return true; }
ObligationDescription_Txt.enableOn = [Results_ResultsGrid.dataBinding];
ObligationDescription_Txt.isEnabled = function()
{
	var gridDB = Services.getValue(Results_ResultsGrid.dataBinding);
	return CaseManUtils.isBlank(gridDB) ? false : true;
}

/******************************** BUTTONS *****************************************/

function Header_DisplayOverdueObligationsBtn() {};
Header_DisplayOverdueObligationsBtn.tabIndex = 1;
Header_DisplayOverdueObligationsBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "DMSDailyReport" } ]
	}
};

/**
 * Sets the page to 1 and searches for overdue obligations on the Owning Court entered
 * @author Dave Turner
 */
Header_DisplayOverdueObligationsBtn.actionBinding = function()
{
	// When click Search, set the page number to be 1
	Services.setValue(XPathConstants.DMS_PAGENUMBER_XPATH, 1);
	
	// Set the query court code in case the user tinkers with the field value
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	Services.setValue(XPathConstants.QUERY_COURTCODE_XPATH, courtCode);
	
	// Retrieve the search results
	retrieveOverdueObligations();
}

/**
 * If Overdue Obligations exist for the Owning Court entered, puts the records into
 * the grid src data or displays a not found message if no overdue obligations exist.
 * @author Dave Turner
 * 
 * @param newResultsDom The DOM returned by the retrieval service
 */
Header_DisplayOverdueObligationsBtn.onSuccess = function(newResultsDom)
{
	var results = newResultsDom.selectSingleNode(XPathConstants.DATA_XPATH);
	if ( null != results && results.getElementsByTagName("Obligation").length != 0 )
	{
		Services.startTransaction();
		Services.setValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH, "false");			
		Services.replaceNode(XPathConstants.DATA_XPATH, results);
		Services.endTransaction();
		Services.setFocus("Header_DeleteObligationsBtn");
	}
	else
	{
		// No overdue obligations for the court selected.  Reset the page number and display alert
		Services.setValue(XPathConstants.DMS_PAGENUMBER_XPATH, 0);
		alert(Messages.OBL_NOFIND_MESSAGE);
	}
}

Header_DisplayOverdueObligationsBtn.enableOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH, Header_OwningCourtCode.dataBinding,DMS_Query_StartDate.dataBinding, DMS_Query_EndDate.dataBinding, DMS_Query_ObligationTypeCode.dataBinding];
Header_DisplayOverdueObligationsBtn.isEnabled = function ()
{
	var courtCode = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( CaseManUtils.isBlank(courtCode) )
	{
		// Disabled if the court code is blank
		return false;
	}
	
	var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
	var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
	var obligationType = Services.getValue(DMS_Query_ObligationTypeCode.dataBinding);
	
	if ( !CaseManUtils.isBlank(startDate) )
	{
		// Start Date populated, check End Date is populated and Start Date is valid
		if ( CaseManUtils.isBlank(endDate) || DMS_Query_StartDate.validate() != null )
		{
			return false;
		}
	}
	
	if ( !CaseManUtils.isBlank(endDate) )
	{
		// End Date populated, check Start Date is populated and End Date is valid
		if ( CaseManUtils.isBlank(startDate) || DMS_Query_EndDate.validate() != null )
		{
			return false;
		}
	}
	
	if ( !CaseManUtils.isBlank(obligationType) )
	{
		// Obligation Type populated, check field is valid
		if ( DMS_Query_ObligationTypeCode.validate() != null )
		{
			return false;
		}
	}

	var enabler = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return ( enabler == "true" ) ? true : false;
}

/***********************************************************************************/

function Header_DeleteObligationsBtn(){};
Header_DeleteObligationsBtn.tabIndex = 2;
Header_DeleteObligationsBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "DMSDailyReport", alt: true } ]
	}
};

Header_DeleteObligationsBtn.enableOn = [XPathConstants.DMS_PAGENUMBER_XPATH];
Header_DeleteObligationsBtn.isEnabled = function()
{
	// Disabled if no data displayed
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	return ( pageNumber == 0 ) ? false : true;
}

/**
 * Delete Overdue Obligations button - asks for confirmation before setting all the
 * overdue obligations on the Owning Court selected to deleted (logic delete).
 * @author Dave Turner
 */
Header_DeleteObligationsBtn.actionBinding = function()
{
	Services.showDialog(
		StandardDialogTypes.YES_NO,
		function DeleteObligationsCallBack(button)
		{
			switch(button)
			{		
				case StandardDialogButtonTypes.YES:
					var params = new ServiceParams();
					var courtcode = Services.getValue(XPathConstants.QUERY_COURTCODE_XPATH);
					params.addSimpleParameter("CourtCode", courtcode);
					
					var startDate = Services.getValue(DMS_Query_StartDate.dataBinding);
					var endDate = Services.getValue(DMS_Query_EndDate.dataBinding);
					var obligationType = Services.getValue(DMS_Query_ObligationTypeCode.dataBinding);
					
					params.addSimpleParameter("startDate", CaseManUtils.isBlank(startDate) ? "" : startDate );
					params.addSimpleParameter("endDate", CaseManUtils.isBlank(endDate) ? "" : endDate );
					params.addSimpleParameter("obligationType", CaseManUtils.isBlank(obligationType) ? "" : obligationType );
					
					Services.callService("deleteOverdueObligations", params, Header_DeleteObligationsBtn, true);           
					break;
				case StandardDialogButtonTypes.NO: 
					break;
			} // End of switch statment
		},// End of function QueryDialogCallBack
		Messages.DEL_OO_MESSAGE,
		"Delete Overdue Obligations"
	);
	
	/**
	var choice = window.showModalDialog("confirm.html",window,"dialogHeight: 120px; dialogWidth: 210px; center: yes; help: no; resizable: no; status: no;");
	if ( choice == "True" )
	{

	}**/
}

/**
 * Service success handler for the logical deletion of overdue obligations
 * @author Dave Turner
 */
Header_DeleteObligationsBtn.onSuccess = function()
{
	clearScreen();
}

/*********************************************************************************/

function DMS_Query_ObligationTypeLOVBtn() {}
DMS_Query_ObligationTypeLOVBtn.tabIndex = 7;
DMS_Query_ObligationTypeLOVBtn.enableOn = [XPathConstants.DISPLAYBUTTON_ENABLED_XPATH];
DMS_Query_ObligationTypeLOVBtn.isEnabled = function() 
{ 
	var searchEnabled = Services.getValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH);
	return (searchEnabled == "true") ? true : false;
}

/*********************************************************************************/

function Results_PreviousButton() {}
Results_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "DMSDailyReport", alt: true } ]
	}
};
Results_PreviousButton.tabIndex = 11;
Results_PreviousButton.enableOn = [XPathConstants.DMS_PAGENUMBER_XPATH];
Results_PreviousButton.isEnabled = function(event)
{
	// Disable Previous button if on first page or search has not been made/returned any results
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	if ( pageNumber == 0 || pageNumber == 1 )
	{
		return false;
	}
	return true;
}

/**
 * Paging Previous button - displays the previous 50 overdue obligations for the Owning
 * Court selected.
 * @author Chris Vincent
 */
Results_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.DMS_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Retrieve the search results
	retrieveOverdueObligations();
}

/**********************************************************************************/

function Results_NextButton() {}
Results_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "DMSDailyReport", alt: true } ]
	}
};
Results_NextButton.tabIndex = 12;
Results_NextButton.enableOn = [Results_ResultsGrid.srcData];
Results_NextButton.isEnabled = function()
{
	var countRecords = Services.countNodes( Results_ResultsGrid.srcData + "/" + Results_ResultsGrid.rowXPath );
	if ( countRecords == CaseManFormParameters.DEFAULT_PAGE_SIZE )
	{
		return true;
	}
	return false;
}

/**
 * Paging Next button - displays the next 50 overdue obligations for the Owning
 * Court selected.
 * @author Chris Vincent
 */
Results_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt( Services.getValue(XPathConstants.DMS_PAGENUMBER_XPATH) );
	Services.setValue( XPathConstants.DMS_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Retrieve the search results
	retrieveOverdueObligations(true);
}

/**
 * Retrieval service success handler which is only called for the Next button.
 * Different to the other retrieval success handler in that if no records returned
 * then an alert is not raised.
 * @author Chris Vincent
 * @param dom The DOM returned from the retrieval service.
 */
Results_NextButton.onSuccess = function(dom)
{
	var results = dom.selectSingleNode(XPathConstants.DATA_XPATH);
	if ( null != results )
	{
		Services.startTransaction();
		Services.setValue(XPathConstants.DISPLAYBUTTON_ENABLED_XPATH, "false");			
		Services.replaceNode(XPathConstants.DATA_XPATH, results);
		Services.endTransaction();
		Services.setFocus("Header_DeleteObligationsBtn");
	}
}

/***********************************************************************************/

function Status_ClearBtn() {};
Status_ClearBtn.tabIndex = 20;
Status_ClearBtn.actionBinding = clearScreen;
Status_ClearBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "DMSDailyReport", alt: true } ]
	}
};

/***********************************************************************************/

function Status_CloseBtn() {};
Status_CloseBtn.tabIndex = 21;
Status_CloseBtn.actionBinding = exitScreen;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "DMSDailyReport" } ]
	}
};

/************************** PROGRESS BAR POPUP *************************************/

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() {
	return true;
}	

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;

/**
 * Report Progresss Bar popup cancel button action binding - cancels the creation
 * of the DMS report and closes the popup.
 * @author Chris Vincent
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}