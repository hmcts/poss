/** 
 * @fileoverview AddJudgment_SubForm.js:
 *
 * @author MGG
 *
 * 05/09/2006 - Paul Roberts, defect 5060.  Apostrophes in xpath.
 * 04/05/2007 - Mark Groen - CCBC DEFECT 1337. Extra validation re Judgment costs
 * 06/01/2017 - Chris Vincent. Trac 5879, RTL fields disabled for family enforcement cases.
 */

/*****************************************************************************************************************
 										FORM CONFIGURATIONS
*****************************************************************************************************************/

function AddJudgmentSubform() {}

/**
 * @author rzhh8k
 * 
 */
AddJudgmentSubform.initialise = function()
{
    Services.startTransaction();

	JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
	// set the default court data
	JudgmentFunctions.setUpDefaultOwningCourt(	JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueCode",
												JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueName");
	Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/TotalCosts", "0");
	Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Date", 		JudgmentFunctions.getTodaysDate());
	
	// Disable the RTL fields if the case has a family enforcement case type
	var jurisdiction = Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Jurisdiction");
	if ( jurisdiction == "F" ) 
	{
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/SendToRTL", 	JudgmentVariables.NO);
	}
	else
	{
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/DateRTL", 	JudgmentFunctions.getTodaysDate());
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/SendToRTL", 	JudgmentVariables.YES);
	}
    
	Services.endTransaction();
	
	var owningCourt = Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/OwningCourtCode");
	if ( owningCourt == CaseManUtils.CCBC_COURT_CODE )
	{
		// CCBC Case, retrieve the Payee for the Case and attach to the Judgment
		var caseNumber = Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/CaseNumber");
		var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", caseNumber);
		Services.callService("getJudgmentPayee", params, AddJudgmentSubform, true);
	}
}

// Load the reference data from the xml into the model
AddJudgmentSubform.refDataServices = [
	{name:"Courts", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[]},
	{name:"JudgmentTypes", dataBinding:JudgmentVariables.REF_DATA_XPATH, serviceName:"getJudgmentTypes", serviceParams:[]}	
];
/**
 * @param dom
 * @author rzhh8k
 * 
 */
AddJudgmentSubform.onSuccess = function(dom)
{
	var payeeNode = dom.selectSingleNode("/PayeeDetails/Payee");
	if ( null != payeeNode )
	{
		// Case does have a payee so add to the DOM
		Services.replaceNode(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Payee", payeeNode);
	}
}

AddJudgmentSubform.createLifeCycle =
{
    eventBinding: {
        keys: [],
        singleClicks: [],
        doubleClicks: []
    },
    fileName: "NewJudgment.xml",
    dataBinding: "/ds"
}

AddJudgmentSubform.submitLifeCycle = 
{
	eventBinding: { keys: [],
                    singleClicks: [ { element: "AddJudgment_OKBtn"} ], 
                    doubleClicks: []
                  },
	
	create : {},
	returnSourceNodes: [JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH], 
	postSubmitAction: {
		close: {}
	}
}

AddJudgmentSubform.cancelLifeCycle = {

	/*eventBinding: {	keys: [],
					singleClicks: [ { element: "AddJudgment_CancelBtn"} ],
					doubleClicks: []
				  },
 */
	raiseWarningIfDOMDirty: false
}

/*****************************************************************************************************************
 										HELPER FUNCTIONS
*****************************************************************************************************************/


/*****************************************************************************************************************
 										LOV DEFINITIONS
*****************************************************************************************************************/
function selectAddJudgment_Against_LOV() {};
selectAddJudgment_Against_LOV.dataBinding = "/ds/var/page/SelectedLOVRow/AddJudgmentAgainstParty";
selectAddJudgment_Against_LOV.srcData = JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties";
selectAddJudgment_Against_LOV.rowXPath = "Party";
selectAddJudgment_Against_LOV.keyXPath = "PartyKey";
selectAddJudgment_Against_LOV.columns = [
	{xpath: "PartyRoleCode", defaultSort:"true", filterXPath: "/ds/var/page/filters/grid/addJudgAgainstOne"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSortOrder:"ascending", filterXPath: "/ds/var/page/filters/grid/addJudgAgainstTwo"},
	{xpath: "Name", filterXPath: "/ds/var/page/filters/grid/addJudgAgainstThree"}
];
selectAddJudgment_Against_LOV.logicOn = [selectAddJudgment_Against_LOV.dataBinding];
/**
 * Implement the callback.  Need to set up the relevant against fields
 * @author rzhh8k
 * 
 */
selectAddJudgment_Against_LOV.logic = function()
{
	Services.startTransaction();
	var id = Services.getValue(selectAddJudgment_Against_LOV.dataBinding);
	if(id != null){
		// Lookup the court deatils in ref data from the code that is stored in value
		var xpathType = JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/PartyRoleCode";		
		var xpathNumber = JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/CasePartyNumber";		
		var xpathName = JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties/Party[./PartyKey = '" + id + "']/Name";
		
		var type = Services.getValue(xpathType);
		var number = Services.getValue(xpathNumber);
		var name = Services.getValue(xpathName);

		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyRoleCode", type);
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName", name);
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/CasePartyNumber", number);
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyKey", id);
	}
	Services.endTransaction();
} // end of logic()
// LOV Popup Raise configuration
selectAddJudgment_Against_LOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddJudgment_Against_LOVBtn"} ]
	}
};
 /*****************************************************************************************************/
function selectCourtLOV() {};
//AddJudgment_CourtCode.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueCode";
selectCourtLOV.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueCode";
selectCourtLOV.srcData = JudgmentVariables.REF_DATA_XPATH + "/Courts";
selectCourtLOV.rowXPath = "Court";
selectCourtLOV.keyXPath = "Code";
selectCourtLOV.columns = [
	{xpath: "Code", filterXPath: "/ds/var/page/filters/grid/selectCourtOne"},
	{xpath: "Name", filterXPath: "/ds/var/page/filters/grid/selectCourtTwo"}
];
// Configure the location in the model which will generate data change events
selectCourtLOV.logicOn = [selectCourtLOV.dataBinding];
/**
 * Implement the callback
 * @author rzhh8k
 * 
 */
selectCourtLOV.logic = function()
{
	Services.startTransaction();
	
	var id = Services.getValue(selectCourtLOV.dataBinding);
	if (id != null){
		// Lookup the court details in ref data from the code that is stored in value				
		var xpathName = JudgmentVariables.REF_DATA_XPATH + "/Courts/Court[Code = " + selectCourtLOV.dataBinding + "]/Name";		
		var courtName = Services.getValue(xpathName);
		Services.setValue(AddJudgment_CourtName.dataBinding, courtName);
	}
	
	Services.endTransaction();
} // end of logic()
// LOV Popup Raise configuration
selectCourtLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddJudgment_Court_LOVBtn"} ],
		keys: [ { key: Key.F6, element: "AddJudgment_CourtCode" }, { key: Key.F6, element: "AddJudgment_CourtName" } ]
	}
};

/*****************************************************************************************************************
 										DATA BINDINGS
*****************************************************************************************************************/
AddJudgment_CourtCode.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueCode";
AddJudgment_CourtName.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/VenueName";
AddJudgment_Against.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName";
AddJudgment_Type.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Type";
AddJudgment_Date.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Date";
AddJudgment_RegDate.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/DateRTL";
AddJudgment_SendToRTL.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/SendToRTL";
AddJudgment_JointJudgment.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/JointJudgment";
AddJudgment_JudgmentAmountCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/AmountCurrency";
AddJudgment_JudgmentAmount.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Amount";
AddJudgment_JudgmentCostsCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/TotalCostsCurrency";
AddJudgment_JudgmentCosts.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/TotalCosts";
AddJudgment_JudgmentSubTotalCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/SubTotalCurrency";
AddJudgment_JudgmentSubTotal.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/SubTotal";
AddJudgment_PaidBeforeCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PaidBeforeCurrency";
AddJudgment_PaidBefore.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PaidBefore";
AddJudgment_TotalCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/TotalCurrency";
AddJudgment_Total.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Total";
AddJudgment_InstalAmountCurrency.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InstallAmountCurrency";
AddJudgment_InstalAmount.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InstallAmount";
AddJudgment_PeriodCode.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PeriodCode";
AddJudgment_FirstPayDate.dataBinding = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/FirstPayDate";

/*****************************************************************************************************************
 										GRID DEFINITIONS
*****************************************************************************************************************/
/*****************************************************************************************************************/
function AddInFavourOf_Grid() {};
// Configure grid 
AddInFavourOf_Grid.multipleSelection = true;
AddInFavourOf_Grid.dataBinding = "/ds/var/page/SelectedGridRow/AddInFavourOfPopupGrid";
//AddInFavourOf_Grid.srcData = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/Parties";
AddInFavourOf_Grid.srcData = JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Parties";
AddInFavourOf_Grid.rowXPath = "Party";
AddInFavourOf_Grid.keyXPath = "PartyKey";
AddInFavourOf_Grid.columns = [
	{xpath: "PartyRoleCode"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

/*****************************************************************************************************************/
function AddJudgment_InFavourOfGrid() {};
// Configure grid 
AddJudgment_InFavourOfGrid.dataBinding = "/ds/var/page/SelectedGridRow/AddInFavourOf";
AddJudgment_InFavourOfGrid.srcData = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties";
AddJudgment_InFavourOfGrid.rowXPath = "Party";
AddJudgment_InFavourOfGrid.keyXPath = "PartyKey";   // not required
AddJudgment_InFavourOfGrid.columns = [
	{xpath: "PartyRoleCode"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];
AddJudgment_InFavourOfGrid.tabIndex = 31;
AddJudgment_InFavourOfGrid.componentName = "In Favour Grid";
AddJudgment_InFavourOfGrid.validateOn = [selectAddJudgment_Against_LOV.dataBinding,
								  		AddJudgment_Against.dataBinding,
								  		AddJudgment_InFavourOfGrid.dataBinding];
AddJudgment_InFavourOfGrid.validate = function()
{
	var errCode = null;

	var gridBinding = Services.getValue(AddJudgment_InFavourOfGrid.dataBinding);
	if(null == gridBinding || gridBinding == ""){
		errCode = ErrorCode.getErrorCode("Caseman_invalidJudgmentInFavourPartiesNoEntry_Msg");
	}
	
	return errCode;

}
/*****************************************************************************************************************
 										INPUT FIELDS
*****************************************************************************************************************/
function AddJudgment_Against() {}
AddJudgment_Against.helpText = "Party the Judgment is against";
AddJudgment_Against.componentName = "Party Against";
AddJudgment_Against.validateOn = [selectAddJudgment_Against_LOV.dataBinding,
								  AddJudgment_Against.dataBinding,
								  AddJudgment_InFavourOfGrid.dataBinding];
AddJudgment_Against.validate = function()
{
	//need to check have no current Judgment against them
	var errCode = null;
	Services.startTransaction();
	var clearData = false;
	var id = Services.getValue(selectAddJudgment_Against_LOV.dataBinding);
	errCode = JudgmentFunctions.isBar(id);
	if(errCode != null){
		clearData = true;
		// we have an invalid against party
		alert(errCode.getMessage() + " - - " + Services.getValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName"));
		
	}
	else{
		var againstId = Services.getValue(selectAddJudgment_Against_LOV.dataBinding);
		if(JudgmentFunctions.isValidAgainstParty(againstId) == false){
			clearData = true;
			// we have an invalid against party
			errCode = ErrorCode.getErrorCode("Caseman_invalidJudgmentAgainstParty_Msg");			
			alert(errCode.getMessage() + " - - " + Services.getValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName"));
		}
		else if(JudgmentFunctions.validRelationshipAddJudgment() == false){
			clearData = true;
			alert(Messages.AGAINST_INFAVOUR_RELATION_MESSAGE);
		}
	}
	
	if(clearData == true){
		// Clear the values for the Against Field
		//Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyRoleCode", null);
		//Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName", null);
		//Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/CasePartyNumber", null);
		//Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyKey", null);
		Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/clearData", "Y");
	}

	Services.endTransaction();
	return errCode;
}
AddJudgment_Against.isMandatory = function()
{
	return true;
}
AddJudgment_Against.isReadOnly = function()
{
	return true;
}
AddJudgment_Against.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddJudgment_Against.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddJudgment_Against.logicOn = [AddJudgment_Against.dataBinding];
AddJudgment_Against.logic = function(event)
{	
	if (event.getXPath() != "/"){
		Services.startTransaction();
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		
		var clearData = Services.getValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/clearData");
		if(clearData != null && clearData == "Y"){
			// Clear the values for the Against Field
			Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyRoleCode", null);
			Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyAgainstName", null);
			Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/CasePartyNumber", null);
			Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/PartyKey", null);
			Services.setValue(JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/clearData", null);
		}
		Services.endTransaction();
	}
}
/****************************************************************************************************************/
function AddJudgment_CourtCode() {}
AddJudgment_CourtCode.tabIndex = 33;
AddJudgment_CourtCode.maxLength = 3;
AddJudgment_CourtCode.helpText = "Court where the Judgment was made.";
AddJudgment_CourtCode.componentName = "Court Code";
AddJudgment_CourtCode.isMandatory = function()
{
	return true;
}
AddJudgment_CourtCode.isReadOnly = function()
{
	return false;
}
AddJudgment_CourtCode.validateOn = [AddJudgment_CourtCode.dataBinding,
									AddJudgment_CourtName.dataBinding];
AddJudgment_CourtCode.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var venueCode = Services.getValue(AddJudgment_CourtCode.dataBinding);
	if(venueCode != null && venueCode != ""){
		var xpathName = JudgmentVariables.REF_DATA_XPATH + "/Courts/Court[./Code = " + AddJudgment_CourtCode.dataBinding + "]/Name";
		var courtDesc = Services.getValue(xpathName);		
		if(courtDesc == null || courtDesc == ""){
			errCode = ErrorCode.getErrorCode('CaseMan_invalidCourtCode_Msg');
		}	
	}
	
	Services.endTransaction();
	
	return errCode;
}
/****************************************************************************************************************/
function AddJudgment_CourtName() {}
AddJudgment_CourtName.tabIndex = 34;
AddJudgment_CourtName.componentName = "Court Name";
AddJudgment_CourtName.srcData = JudgmentVariables.REF_DATA_XPATH + "/Courts";
AddJudgment_CourtName.rowXPath = "Court";
AddJudgment_CourtName.keyXPath = "Name";
AddJudgment_CourtName.displayXPath = "Name";
AddJudgment_CourtName.strictValidation = true;
AddJudgment_CourtName.helpText = "Court where the Judgment was made.";
AddJudgment_CourtName.logicOn = [AddJudgment_CourtName.dataBinding];
AddJudgment_CourtName.logic = function()
{
	Services.startTransaction();
	
	var venueName = Services.getValue(AddJudgment_CourtName.dataBinding);
	if(venueName != null && venueName != ""){
		var xpathCode = JudgmentVariables.REF_DATA_XPATH + "/Courts/Court[./Name = " + AddJudgment_CourtName.dataBinding + "]/Code";
		var courtCode = Services.getValue(xpathCode);		
		Services.setValue(AddJudgment_CourtCode.dataBinding, courtCode);
	}
	
	Services.endTransaction();
}
AddJudgment_CourtName.isMandatory = function()
{
	return true;
}
AddJudgment_CourtName.isReadOnly = function()
{
	return false; 
}
/****************************************************************************************************************/
function AddJudgment_Type() {}
AddJudgment_Type.componentName = "Type";
AddJudgment_Type.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentTypes";
AddJudgment_Type.rowXPath = "Type";
AddJudgment_Type.keyXPath = "Value";
AddJudgment_Type.displayXPath = "Value";
AddJudgment_Type.maxLength = 30;
AddJudgment_Type.helpText = "Select type of Judgment";
AddJudgment_Type.tabIndex = 36;
AddJudgment_Type.isMandatory = function()
{
	return true;
}
AddJudgment_Type.isReadOnly = function()
{
	return false;
}
AddJudgment_Type.logicOn = [AddJudgment_Type.dataBinding];
AddJudgment_Type.logic = function(event)
{	
	if (event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddJudgment_Type.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
AddJudgment_Type.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
/****************************************************************************************************************/
function AddJudgment_Date() {}
AddJudgment_Date.weekends = true; 
AddJudgment_Date.maxLength = 11;
AddJudgment_Date.helpText = "Date of the Judgment.";
AddJudgment_Date.componentName = "Judgment Date";
AddJudgment_Date.tabIndex = 38;
AddJudgment_Date.updateMode="clickCellMode";
AddJudgment_Date.validateOn = [AddJudgment_Date.dataBinding];
AddJudgment_Date.validate = function()
{
	var date = Services.getValue(AddJudgment_Date.dataBinding);
	var errCode = JudgmentFunctions.validateDateInFuture(date);
	return errCode;
}
AddJudgment_Date.logicOn = [AddJudgment_Date.dataBinding];
AddJudgment_Date.logic = function(event)
{	
	if (event.getXPath() != "/"){
		Services.startTransaction();
		
		var today = JudgmentFunctions.getTodaysDate();
		var judgDate = Services.getValue(AddJudgment_Date.dataBinding);
		if(today != judgDate){
			// set flag to indict changes made and if cancel button select will need to display the message
			JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		}
		
		Services.endTransaction();
	}
}
AddJudgment_Date.isMandatory = function()
{
	return true;
}
AddJudgment_Date.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AddJudgment_Date.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/****************************************************************************************************************/
function AddJudgment_RegDate() {}
AddJudgment_RegDate.weekends = true; 
AddJudgment_RegDate.maxLength = 11;
AddJudgment_RegDate.helpText = "Date Judgment sent for registration to RTL.";
AddJudgment_RegDate.componentName = "Registration Date";
AddJudgment_RegDate.tabIndex = 39;
AddJudgment_RegDate.updateMode="clickCellMode";
AddJudgment_RegDate.validateOn = [AddJudgment_RegDate.dataBinding,
								  AddJudgment_Date.dataBinding];
AddJudgment_RegDate.validate = function()
{
	var date = Services.getValue(AddJudgment_RegDate.dataBinding);
	var errCode = JudgmentFunctions.validateDateInFuture(date);
	if(errCode == null){
		errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
   																 true);// adding?
	}
	return errCode;
}
AddJudgment_RegDate.logicOn = [AddJudgment_RegDate.dataBinding];
AddJudgment_RegDate.logic = function(event)
{	
	if(event.getXPath() != "/"){
		var today = JudgmentFunctions.getTodaysDate();
		var regDate = Services.getValue(AddJudgment_RegDate.dataBinding);
		if(today != regDate){
			// set flag to indict changes made and if cancel button select will need to display the message
			JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
		}
	}
}
AddJudgment_RegDate.isMandatory = function()
{
	return false;
}
AddJudgment_RegDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AddJudgment_RegDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
AddJudgment_RegDate.isEnabled = function()
{
	var blnEnabled = true;
	var jurisdiction = Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Jurisdiction");
	if ( jurisdiction == "F" )
	{
		blnEnabled = false;
	}
	return blnEnabled;
}

/****************************************************************************************************************/
/**
 * AddJudgment_SendToRTL has been added as part of RFC1473
 * @author rzhh8k
 * 
 */
function AddJudgment_SendToRTL() {}
AddJudgment_SendToRTL.modelValue = {checked: 'Y', unchecked: 'N'};
AddJudgment_SendToRTL.tabIndex = 40;
AddJudgment_SendToRTL.helpText = "Is Judgment to be registered and sent to RTL?";
AddJudgment_SendToRTL.readOnlyOn = [ AddJudgment_RegDate.dataBinding];
AddJudgment_SendToRTL.isReadOnly = function()
{
	// only updateable if Reg Date entered
	var readOnly = true;
	var regdate = Services.getValue(AddJudgment_RegDate.dataBinding);
	if(null != regdate && regdate != ""){
		readOnly = false;
	}	
	return readOnly;
}
AddJudgment_SendToRTL.logicOn = [ AddJudgment_RegDate.dataBinding];
AddJudgment_SendToRTL.logic = function()
{
	var regdate = Services.getValue(AddJudgment_RegDate.dataBinding);
	if(null == regdate || regdate == ""){
		Services.setValue(AddJudgment_SendToRTL.dataBinding, JudgmentVariables.NO);
	}
}
AddJudgment_SendToRTL.isEnabled = function()
{
	var blnEnabled = true;
	var jurisdiction = Services.getValue(JudgmentVariables.SUBFORM_PARTIES_XPATH + "/Jurisdiction");
	if ( jurisdiction == "F" )
	{
		blnEnabled = false;
	}
	return blnEnabled;
}
/****************************************************************************************************************/
function AddJudgment_JointJudgment() {}
AddJudgment_JointJudgment.modelValue = {checked: 'Y', unchecked: 'N'};
AddJudgment_JointJudgment.helpText = "Does this Judgment name all Defendants (Y/N)?";
AddJudgment_JointJudgment.tabIndex = 37;
AddJudgment_JointJudgment.logicOn = [AddJudgment_JointJudgment.dataBinding];
AddJudgment_JointJudgment.isMandatory = function()
{
	return false;
}
AddJudgment_JointJudgment.isReadOnly = function()
{
	return false;
}
/****************************************************************************************************************/
function AddJudgment_JudgmentAmountCurrency() {}
AddJudgment_JudgmentAmountCurrency.maxLength = 3;
AddJudgment_JudgmentAmountCurrency.helpText = "Indicates the amount adjudged, including interest.";
AddJudgment_JudgmentAmountCurrency.tabIndex = -1;
AddJudgment_JudgmentAmountCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_JudgmentAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_JudgmentAmount() {}
AddJudgment_JudgmentAmount.maxLength = 11;
AddJudgment_JudgmentAmount.helpText = "Indicates the amount adjudged, including interest.";
AddJudgment_JudgmentAmount.componentName = "Amount";
AddJudgment_JudgmentAmount.tabIndex = 41;
AddJudgment_JudgmentAmount.validateOn = [AddJudgment_JudgmentAmount.dataBinding];
AddJudgment_JudgmentAmount.validate = function()
{
	var amount = Services.getValue(AddJudgment_JudgmentAmount.dataBinding);
	var errCode = JudgmentFunctions.validateAmount(	amount, 
													JudgmentVariables.CURRENCY_MAX_10_PATTERN, 
													true);// pCheckAmount
	return errCode;
}
AddJudgment_JudgmentAmount.logicOn = [AddJudgment_JudgmentAmount.dataBinding];
AddJudgment_JudgmentAmount.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddJudgment_JudgmentAmount.isMandatory = function()
{
	return true;
}
AddJudgment_JudgmentAmount.isReadOnly = function()
{
	return false;
}
AddJudgment_JudgmentAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AddJudgment_JudgmentAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_JudgmentCostsCurrency() {}
AddJudgment_JudgmentCostsCurrency.tabIndex = -1;
AddJudgment_JudgmentCostsCurrency.maxLength = 3;
AddJudgment_JudgmentCostsCurrency.helpText = "The total amount of costs owed on the Judgment";
AddJudgment_JudgmentCostsCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_JudgmentCostsCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_JudgmentCosts() {}
AddJudgment_JudgmentCosts.tabIndex = 42;
AddJudgment_JudgmentCosts.maxLength = 8;
AddJudgment_JudgmentCosts.helpText = "The total amount of costs owed on the Judgment";
AddJudgment_JudgmentCosts.componentName = "Costs";
AddJudgment_JudgmentCosts.validateOn = [AddJudgment_JudgmentCosts.dataBinding,
										AddJudgment_Date.dataBinding,
										AddJudgment_JudgmentAmount.dataBinding,
										AddJudgment_Type.dataBinding];
AddJudgment_JudgmentCosts.validate = function()
{
	var amount = Services.getValue(AddJudgment_JudgmentCosts.dataBinding);
	var errCode = JudgmentFunctions.validateAmount(	amount,
													JudgmentVariables.CURRENCY_MAX_7_PATTERN,
													false);// pCheckAmount
													
	// CCBC DEFECT 1337
	if(errCode == null && JudgmentFunctions.isCCBCCourtForAddJudgment() == true){
		var judgDate = Services.getValue(AddJudgment_Date.dataBinding);
		var judgAmt = Services.getValue(AddJudgment_JudgmentAmount.dataBinding);
		var judgType = Services.getValue(AddJudgment_Type.dataBinding);
		if(amount != null && amount != "" && parseFloat(amount) > 0 && judgDate != null && judgDate != "" && 
					judgAmt != null && judgAmt != "" && parseFloat(judgAmt) > 0 && judgType != null && judgType != ""){
		
			var valid = JudgmentFunctions.isJudgmentCostValid(	amount, //pJudgmentCosts
																judgDate,//pJudgmentDate
																judgAmt, //pJudgmentAmount
																judgType, //pJudgmentType
																true); // pAdding
			if(valid == false){
				errCode = ErrorCode.getErrorCode('Caseman_invalidJudgmentCosts_Msg'); 
			}		
		}// if(amount != null && amount !=  ... 
		
	}//if(errCode == null && JudgmentFunctions.isCCBCCourt() == true){
	
	return errCode;
}
AddJudgment_JudgmentCosts.isMandatory = function()
{
	return true;
}
AddJudgment_JudgmentCosts.isReadOnly = function()
{
	return false;
}
AddJudgment_JudgmentCosts.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AddJudgment_JudgmentCosts.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_JudgmentSubTotalCurrency() {}
AddJudgment_JudgmentSubTotalCurrency.tabIndex = -1;
AddJudgment_JudgmentSubTotalCurrency.maxLength = 3;
AddJudgment_JudgmentSubTotalCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_JudgmentSubTotalCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_JudgmentSubTotal() {}
AddJudgment_JudgmentSubTotal.tabIndex = -1;
AddJudgment_JudgmentSubTotal.isMandatory = function()
{
	return false;
}
AddJudgment_JudgmentSubTotal.isReadOnly = function()
{
	return true;
}
AddJudgment_JudgmentSubTotal.logicOn = [AddJudgment_JudgmentCosts.dataBinding,
								        AddJudgment_JudgmentAmount.dataBinding];
AddJudgment_JudgmentSubTotal.logic = function(event)
{
	if(event.getXPath() != "/"){
		Services.startTransaction();
		
		var amount = Services.getValue(AddJudgment_JudgmentAmount.dataBinding);
		var costs = Services.getValue(AddJudgment_JudgmentCosts.dataBinding);
		var subTotal = JudgmentFunctions.getSubTotal(amount, costs);	
		Services.setValue(AddJudgment_JudgmentSubTotal.dataBinding, subTotal);
		
		Services.endTransaction();
	}
}
/****************************************************************************************************************/
function AddJudgment_PaidBeforeCurrency() {}
AddJudgment_PaidBeforeCurrency.tabIndex = -1;
AddJudgment_PaidBeforeCurrency.maxLength = 3;
AddJudgment_PaidBeforeCurrency.helpText = "Amount paid between Claim and Judgment";
AddJudgment_PaidBeforeCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_PaidBeforeCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_PaidBefore() {}
AddJudgment_PaidBefore.tabIndex = 43;
AddJudgment_PaidBefore.maxLength = 12;
AddJudgment_PaidBefore.helpText = "Amount paid between Claim and Judgment";
AddJudgment_PaidBefore.componentName = "Paid Before";
AddJudgment_PaidBefore.validateOn = [AddJudgment_PaidBefore.dataBinding,
									 AddJudgment_JudgmentSubTotal.dataBinding];
AddJudgment_PaidBefore.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var amount = Services.getValue(AddJudgment_PaidBefore.dataBinding);
	errCode = JudgmentFunctions.validateAmount(	amount, 
												JudgmentVariables.CURRENCY_MAX_11_PATTERN, 
												false);// pCheckAmount
	if(errCode == null && amount != null && amount != ""){
		// now check the paid before amount is not greater than the sub total
		var subTotal = Services.getValue(AddJudgment_JudgmentSubTotal.dataBinding);
		if(parseFloat(amount) >= parseFloat(subTotal)){	
			errCode = ErrorCode.getErrorCode('CaseMan_paidBeforeIncorrectAmount_Msg');
		}
	}
	
	Services.endTransaction();
	return errCode;
}
AddJudgment_PaidBefore.logicOn = [AddJudgment_PaidBefore.dataBinding];
AddJudgment_PaidBefore.logic = function(event)
{	
	if(event.getXPath() != "/"){	
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddJudgment_PaidBefore.isMandatory = function()
{
	return false;
}
AddJudgment_PaidBefore.isReadOnly = function()
{
	return false;
}
AddJudgment_PaidBefore.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AddJudgment_PaidBefore.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_TotalCurrency() {}
AddJudgment_TotalCurrency.tabIndex = -1;
AddJudgment_TotalCurrency.maxLength = 3;
AddJudgment_TotalCurrency.helpText = "The total amount due to the Parties defined as 'In Favour Of' the Judgment";
AddJudgment_TotalCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_TotalCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_Total() {}
AddJudgment_Total.tabIndex = -1;
AddJudgment_Total.componentName = "Total";
AddJudgment_Total.maxLength = 11;
AddJudgment_Total.helpText = "The total amount due to the Parties defined as 'In Favour Of' the Judgment";
AddJudgment_Total.isMandatory = function()
{
	return false;
}
AddJudgment_Total.isReadOnly = function()
{
	return true;
}
AddJudgment_Total.logicOn = [AddJudgment_JudgmentCosts.dataBinding,
							 AddJudgment_JudgmentAmount.dataBinding,
							 AddJudgment_PaidBefore.dataBinding];
AddJudgment_Total.logic = function(event)
{
	if(event.getXPath() != "/"){
		Services.startTransaction();
		
		// get values to calculate total from
		var amount = Services.getValue(AddJudgment_JudgmentAmount.dataBinding);
		var costs = Services.getValue(AddJudgment_JudgmentCosts.dataBinding);
		var paidBefore = Services.getValue(AddJudgment_PaidBefore.dataBinding);
		var total = JudgmentFunctions.getTotal(amount, costs, paidBefore);		
		Services.setValue(AddJudgment_Total.dataBinding, total);
		
		Services.endTransaction();
	}
}
/****************************************************************************************************************/
function AddJudgment_InstalAmountCurrency() {}
AddJudgment_InstalAmountCurrency.tabIndex = -1;
AddJudgment_InstalAmountCurrency.maxLength = 3;
AddJudgment_InstalAmountCurrency.helpText = "Amount of the instalment to be paid by the Party, against the Judgment";
AddJudgment_InstalAmountCurrency.isReadOnly = function()
{
	return true;
}
AddJudgment_InstalAmountCurrency.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_InstalAmount() {}
AddJudgment_InstalAmount.tabIndex = 44;
AddJudgment_InstalAmount.maxLength = 12;
AddJudgment_InstalAmount.helpText = "Amount of the instalment to be paid by the Party, against the Judgment";
AddJudgment_InstalAmount.componentName = "Instalment Amount";
/**
 * Validates that when the Period is FORTHWITH no entry required 
 *
 */
AddJudgment_InstalAmount.validateOn = [AddJudgment_InstalAmount.dataBinding,
									   AddJudgment_PeriodCode.dataBinding,
									   AddJudgment_Total.dataBinding];
AddJudgment_InstalAmount.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var amount = Services.getValue(AddJudgment_InstalAmount.dataBinding);
	var per = Services.getValue(AddJudgment_PeriodCode.dataBinding);
	if(amount != null && amount != "" && per != null && per == JudgmentVariables.FORTHWITH_CODE){
		errCode = ErrorCode.getErrorCode('CaseMan_noInstalmentAmount_Msg') ;
	}

	if(amount != null && amount != "" && errCode == null){
		errCode = JudgmentFunctions.validateAmount(	amount, 
													JudgmentVariables.CURRENCY_MAX_11_PATTERN, 
													true);// pCheckAmount
		if(errCode == null){
			// now check the paid before amount is not greater than the sub total
			var total = Services.getValue(AddJudgment_Total.dataBinding);
			if(parseFloat(amount) > parseFloat(total)){
				errCode = ErrorCode.getErrorCode('CaseMan_amountGreaterThanJudgAmount_Msg');
			}
		}
	}
	
	Services.endTransaction();	
	return errCode;
}
AddJudgment_InstalAmount.logicOn = [AddJudgment_InstalAmount.dataBinding];
AddJudgment_InstalAmount.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
/**
 * Looks at the value of the period field.  If the value is Forthwith 
 * Not mandatory.
 */
AddJudgment_InstalAmount.mandatoryOn = [AddJudgment_PeriodCode.dataBinding,
										AddJudgment_InstalAmount.dataBinding];
AddJudgment_InstalAmount.isMandatory = function()
{
	var isRequired = true;
	var period = Services.getValue(AddJudgment_PeriodCode.dataBinding);
	if(period != null && period == JudgmentVariables.FORTHWITH_CODE){
		isRequired = false;
	}
	else if(period != null && period == JudgmentVariables.IN_FULL){
		isRequired = false;
	}
	return isRequired;
}
/**
 * Looks at the value of the period field.  If the value is Paid In Full 
 * Empty and Read Only.
 */
AddJudgment_InstalAmount.readOnlyOn = [AddJudgment_PeriodCode.dataBinding];
AddJudgment_InstalAmount.isReadOnly = function()
{
	var readOnly = false;
	Services.startTransaction();
	var period = Services.getValue(AddJudgment_PeriodCode.dataBinding);
	if(period != null && period == JudgmentVariables.IN_FULL){
		Services.setValue(AddJudgment_InstalAmount.dataBinding, "");
		readOnly = true;
	}
	Services.endTransaction();
	return readOnly;
}
AddJudgment_InstalAmount.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
AddJudgment_InstalAmount.transformToModel = function(value)
{
	return JudgmentFunctions.transformCurrency(value);
}
/****************************************************************************************************************/
function AddJudgment_PeriodCode() {}
AddJudgment_PeriodCode.tabIndex = 45;
AddJudgment_PeriodCode.srcData = JudgmentVariables.REF_DATA_XPATH + "/JudgmentPeriods";
AddJudgment_PeriodCode.rowXPath = "Period";
AddJudgment_PeriodCode.keyXPath = "Value";
AddJudgment_PeriodCode.displayXPath = "Description";
AddJudgment_PeriodCode.componentName = "Period Code";
AddJudgment_PeriodCode.maxLength = 3;
AddJudgment_PeriodCode.helpText = "Instalment Period";
AddJudgment_PeriodCode.isMandatory = function()
{
	return true;
}
AddJudgment_PeriodCode.isReadOnly = function()
{
	return false;
}
AddJudgment_PeriodCode.logicOn = [AddJudgment_PeriodCode.dataBinding];
AddJudgment_PeriodCode.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
/****************************************************************************************************************/
function AddJudgment_FirstPayDate() {}
AddJudgment_FirstPayDate.tabIndex = 46;
AddJudgment_FirstPayDate.weekends = true; 
AddJudgment_FirstPayDate.maxLength = 11;
AddJudgment_FirstPayDate.helpText = "Date of the first instalment, or in full if no instalment";
AddJudgment_FirstPayDate.componentName = "First Payment Date";
AddJudgment_FirstPayDate.updateMode="clickCellMode";
/**
 * Validates that when the Period is FORTHWITH no entry required 
 */
AddJudgment_FirstPayDate.validateOn = [AddJudgment_FirstPayDate.dataBinding,
									   AddJudgment_PeriodCode.dataBinding,
									   AddJudgment_Date.dataBinding];
AddJudgment_FirstPayDate.validate = function()
{
	var errCode = null;
	Services.startTransaction();
	
	var date = Services.getValue(AddJudgment_FirstPayDate.dataBinding);	
	var per = Services.getValue(AddJudgment_PeriodCode.dataBinding);
	if(date != null && date != "" && per != null && per == JudgmentVariables.FORTHWITH_CODE){ 
		errCode = ErrorCode.getErrorCode('CaseMan_noPayDateAmount_Msg') ;
	}
	// check date is not before the Judgment date if no error found yet
	if(errCode == null && date != null && date != "" ){
   		errCode = JudgmentFunctions.validateDatePreceedsJudgDate(date,
   																 true);// adding?
	}
	
	Services.endTransaction();	
	return errCode;
}
/**
 * Looks at the value of the period field.  If the value is Forthwith 
 * Not mandatory.
 *
 */
AddJudgment_FirstPayDate.mandatoryOn = [AddJudgment_PeriodCode.dataBinding,
										AddJudgment_FirstPayDate.dataBinding];
AddJudgment_FirstPayDate.isMandatory = function()
{
	var isRequired = true;
	var period = Services.getValue(AddJudgment_PeriodCode.dataBinding);
	if(period != null && period == JudgmentVariables.FORTHWITH_CODE){
		isRequired = false;
	}
	return isRequired;
}
AddJudgment_FirstPayDate.logicOn = [AddJudgment_FirstPayDate.dataBinding];
AddJudgment_FirstPayDate.logic = function(event)
{	
	if(event.getXPath() != "/"){
		// set flag to indict changes made and if cancel button select will need to display the message
		JudgmentFunctions.setCancelMessage(JudgmentVariables.YES);
	}
}
AddJudgment_FirstPayDate.transformToDisplay = function(value)
{
	return JudgmentFunctions.transformToDisplayDate(value);
}
AddJudgment_FirstPayDate.transformToModel = function(value)
{
	return JudgmentFunctions.transformToModelDate(value);
}
/*********************************************************************************/

/*****************************************************************************************************************
 										BUTTON FIELD DEFINITIONS
*****************************************************************************************************************/
/****************************************************************************************************************/
function AddJudgment_OKBtn() {}
AddJudgment_OKBtn.tabIndex = 47;
/****************************************************************************************************************/
function AddJudgment_CancelBtn() {}
AddJudgment_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddJudgmentSubform" } ]
	}
};
AddJudgment_CancelBtn.tabIndex = 48;
/**
 * @author rzhh8k
 * 
 */
AddJudgment_CancelBtn.actionBinding = function()
{
	if(JudgmentFunctions.displayCancelMessage() == true){
		if(confirm(Messages.CANCEL_MESSAGE)){
			JudgmentFunctions.resetNewJudgment();
			JudgmentFunctions.setCancelMessage(JudgmentVariables.NO);
			Services.dispatchEvent("AddJudgmentSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
		}
	}
	else{
		Services.dispatchEvent("AddJudgmentSubform", BusinessLifeCycleEvents.EVENT_CANCEL);
	}
}

/****************************************************************************************************************/
function AddJudgment_InFavourOf_EditBtn() {}
AddJudgment_InFavourOf_EditBtn.tabIndex = 32;
/**
 * @author rzhh8k
 * 
 */
AddJudgment_InFavourOf_EditBtn.actionBinding = function()
{	
	Services.dispatchEvent("AddInFavourOf", PopupGUIAdaptor.EVENT_RAISE);
}
/****************************************************************************************************************/
function AddInFavourOf_OKBtn() {}
/**
 * @author rzhh8k
 * 
 */
AddInFavourOf_OKBtn.actionBinding = function()
{	
	Services.startTransaction();	
	
	var parentNode = JudgmentVariables.SUBFORM_NEW_JUDGMENT_XPATH + "/InFavourParties";
	var listXpath = "/ds/var/page/SelectedGridRow/AddInFavourOfPopupGrid/PartyKey";
	JudgmentFunctions.resetInFavourOf();
	JudgmentFunctions.setInFavourOf(listXpath, parentNode);
	
	if(JudgmentFunctions.validRelationshipAddJudgment() == false){
		alert(Messages.AGAINST_INFAVOUR_RELATION_MESSAGE);
		JudgmentFunctions.resetInFavourOf();
	}

	Services.dispatchEvent("AddInFavourOf", PopupGUIAdaptor.EVENT_LOWER);

	
	Services.endTransaction();
	
	
}
/*****************************************************************************************************************
										LOV BUTTONS															
****************************************************************************************************************/

function AddJudgment_Court_LOVBtn() {}
AddJudgment_Court_LOVBtn.tabIndex = 35;

/****************************************************************************************************************/
function AddJudgment_Against_LOVBtn() {}
AddJudgment_Against_LOVBtn.tabIndex = 30;

