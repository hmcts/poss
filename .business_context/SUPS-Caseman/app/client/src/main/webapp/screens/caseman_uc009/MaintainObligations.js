/** 
 * @fileoverview MaintainObligations.js:
 * This file contains the field configurations for UC009 - Maintain Obligations screen
 *
 * @author Ian Stainer, Chris Vincent
 * @version 0.1
 *
 * Changes:
 * 06/06/2006 - Chris Vincent, moved the constants to the MaintainObligtaions.js from
 *				the separate constants file.
 * 14/06/2006 - Chris Vincent, added transform to model for all notes fields which can be
 *				mandatory which removes trailing and leading whitespace.
 * 06/07/2006 - Chris Vincent, changed the way the Notes field behaves with Obligation Type 21.
 * 				For this type only, the value stored is the Ref Data Code and the value displayed
 * 				is the Ref Data Description.  Previously the Description was stored and displayed.
 * 23/08/2006 - Chris Vincent, fixed defect 4603 as a call to Services.getValue() returned multiple
 * 				nodes causing a screen crash.  XPath needed to filter on non deleted Obligations in
 * 				Header_CaseNumber.onSuccess
 * 29/08/2006 - Chris Vincent, changed the validate() functions for the expiry date fields as was setting
 * 				fields which should be done in a logic.  Part of defect 4778.
 */

/**
 * Day Constants
 * @author kznwpr
 * 
 */
function DayConstants() {}
DayConstants.SUNDAY = 0;
DayConstants.SATURDAY = 6;

/**
 * The services called by this screen
 * @author kznwpr
 * 
 */
function ObligationServices() {}
ObligationServices.GET_CE_OBLIGATIONS_SERVICE = "getObligations";
ObligationServices.GET_AE_OBLIGATIONS_SERVICE = "getAEObligations";
ObligationServices.RETRIEVAL_SERVICE = "";
ObligationServices.UPDATE_OBLIGATIONS_SERVICE = "updateObligations";
ObligationServices.ADD_CE_OBLIGATION_SERVICE = "addObligation";
ObligationServices.ADD_AE_OBLIGATION_SERVICE = "addAEObligation";
ObligationServices.ADD_SERVICE = "";
ObligationServices.GET_OBLIGATION_DETAILS_SERVICE = "getObligationDetails";

/**
 * Enumeration of actions
 * @author kznwpr
 * 
 */
function Action() {}
Action.CREATE = "C";
Action.MODIFY = "M";

/**
 * Enumeration of mechanisms
 * @author kznwpr
 * 
 */
function Mechanism() {}
Mechanism.MANDATORY = "M";
Mechanism.OPTIONAL = "O";

/**
 * Enumeration of maintenance modes
 * @author kznwpr
 * 
 */
function MaintenanceMode() {}
MaintenanceMode.CREATE = "C";
MaintenanceMode.MODIFY = "M";

/**
 * Enumeration of screen modes
 * @author kznwpr
 * 
 */
function ScreenMode() {}
ScreenMode.MANDATORY_CREATE = "mandatory create";
ScreenMode.OPTIONAL_CREATE = "optional create";
ScreenMode.MANDATORY_MODIFY = "mandatory modify";
ScreenMode.MAINTENANCE_CREATE = "maintenance create";
ScreenMode.MAINTENANCE_MODIFY = "maintenance modify";

/**
 * Enumeration of status types. These define the states that any obligation can be in.
 * @author kznwpr
 * 
 */
function Status() {}
Status.NEW = "NEW";
Status.EXISTING = "EXISTING";
Status.MODIFIED = "MODIFIED";

/**
 * XPath Constants
 * @author kznwpr
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.BUSINESS_DATA_BINDING_ROOT = "/ds/MaintainObligations";
XPathConstants.OBLIGATION_DETAILS_DATA_BINDING_ROOT = "/ds/MaintainObligations/Obligations/Obligation[./ObligationSeq = ";
XPathConstants.NEW_OBLIGATION_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewObligation";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.NOTES_LOV_SRCDATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/NotesLOV/FeeTypes";
XPathConstants.MASTER_GRID_XPATH = XPathConstants.VAR_PAGE_XPATH + "/SelectedObligationGridRow/SelectedObligation"
XPathConstants.SELECTED_OBLIGATION_XPATH = XPathConstants.OBLIGATION_DETAILS_DATA_BINDING_ROOT + XPathConstants.MASTER_GRID_XPATH + "]";
XPathConstants.EXPIRY_DATE_STATUS_XPATH = XPathConstants.SELECTED_OBLIGATION_XPATH + "/ExpiryDateStatus";
XPathConstants.SURROGATEKEY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NextSurrogateKey";
XPathConstants.EXIT_SCREEN_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ExitScreen";
XPathConstants.SINGLEUSEOBLIGATION_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/SingleUseObligationStillInDOM";
XPathConstants.MODIFYOB_POPUP_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/ModifyObligationPopupVisible";
XPathConstants.NEWOBSEQ_SELECT_IND_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Temp/NewObligationSeqToSelect";
/** 
 * This variable reflects the state that the screen is running in
 * Screen Mode			Cancel btn on new obligation popup
 * =======================================================
 * mandatory create		disabled
 * optional create		enabled
 * maintenance create	enabled
 * maintenance modify	N/A
 */
XPathConstants.SCREEN_MODE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ScreenMode";

/**
 * Enumeration of Notes LOV Popup Mode
 * @author kznwpr
 * 
 */
function NotesLOVMode() {}
NotesLOVMode.CURRENT_MODE_XPATH = XPathConstants.VAR_FORM_XPATH + "/NotesLOV/NotesLOVMode";
NotesLOVMode.NEW_TYPE10 = "NEW_TYPE10";
NotesLOVMode.EXISTING_TYPE10 = "EXISTING_TYPE10";
NotesLOVMode.NEW_TYPE21 = "NEW_TYPE21";
NotesLOVMode.EXISTING_TYPE21 = "EXISTING_TYPE21";

/******************************* MAIN FORM *****************************************/

function maintainObligations() {}

maintainObligations.refDataServices = [
	{name:"ObligationTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getObligationTypes", serviceParams:[]},
	{name:"Type10FeeTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getType10Fees", serviceParams:[]},
	{name:"Type21FeeTypes", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getType21Fees", serviceParams:[]},
	{name:"SystemDate", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getSystemDate", serviceParams:[]},
	{name:"NonWorkingDays", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getNonWorkingDays", serviceParams:[]}
];

/**
 * This function automatically launches either the add or modify popups depending
 * on the values in the mechanism and action parameters passed to the screen.
 * These are the rules:
 * Mechanism	Action	Behaviour
 * ==============================
 * Mandatory	Create	Launch add obligation popup with cancel button disabled
 * Optional		Create	Launch add obligation popup with cancel button enabled
 * Mandatory	Modify	Launch the modify obligation popup
 * @author kznwpr
 * 
 */
maintainObligations.initialise = function()
{
	// Determine whether or not we are dealing with AE or Case Obligations
	var eventType = Services.getValue(MaintainObligationsParams.EVENT_TYPE);
	if ( eventType == "A" )
	{
		ObligationServices.RETRIEVAL_SERVICE = ObligationServices.GET_AE_OBLIGATIONS_SERVICE;
		ObligationServices.ADD_SERVICE = ObligationServices.ADD_AE_OBLIGATION_SERVICE;
	}
	else
	{
		// By default, show Case Obligations
		ObligationServices.RETRIEVAL_SERVICE = ObligationServices.GET_CE_OBLIGATIONS_SERVICE;
		ObligationServices.ADD_SERVICE = ObligationServices.ADD_CE_OBLIGATION_SERVICE;
	}

	// Load existing data
	loadData();
	
	var mechanism = Services.getValue(MaintainObligationsParams.MECHANISM);
	var action = Services.getValue(MaintainObligationsParams.ACTION);
	
	if (mechanism == Mechanism.MANDATORY && action == Action.CREATE)
	{
		// Mandatory create
		Services.setValue(XPathConstants.SCREEN_MODE_XPATH, ScreenMode.MANDATORY_CREATE);
		
		// Set the obligation type
		Services.setValue(Master_ObligationType.dataBinding, Services.getValue(MaintainObligationsParams.OBLIGATION_TYPE));
		Services.setValue(New_Obligation_Popup_Days.dataBinding, Services.getValue(MaintainObligationsParams.DEFAULT_DAYS));			
		Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_RAISE);					
	}
	else if (mechanism == Mechanism.OPTIONAL && action == Action.CREATE)
	{
		// Optional create
		Services.setValue(XPathConstants.SCREEN_MODE_XPATH, ScreenMode.OPTIONAL_CREATE);		
		
		// Set the obligation type
		Services.setValue(Master_ObligationType.dataBinding, Services.getValue(MaintainObligationsParams.OBLIGATION_TYPE));
		Services.setValue(New_Obligation_Popup_Days.dataBinding, Services.getValue(MaintainObligationsParams.DEFAULT_DAYS));	
		Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_RAISE);											
	}
	else if (mechanism == Mechanism.MANDATORY && action == Action.MODIFY)
	{
		// Mandatory modify
		Services.setValue(XPathConstants.SCREEN_MODE_XPATH, ScreenMode.MANDATORY_MODIFY);		
		// Display the popup. After the data has been loaded the grid is set to the appropriate row
		// which in turn loads the popup with data
		Services.dispatchEvent("Modify_Obligation_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
		Services.setValue(XPathConstants.MODIFYOB_POPUP_IND_XPATH, "true");
	}
	else
	{
		setScreenMode();
	}
}

/********************************** SUBFORMS *************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/******************************* GRIDS *********************************************/

function Header_PartiesGrid() {};
Header_PartiesGrid.tabIndex = 1;
Header_PartiesGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedPartiesGridRow/SelectedParty";
Header_PartiesGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Parties/Party/DisplayInHeader"];
Header_PartiesGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Parties";
Header_PartiesGrid.rowXPath = "Party[./DisplayInHeader = 'true']";
Header_PartiesGrid.keyXPath = "PartyId";
Header_PartiesGrid.columns = [
	{xpath: "Type"},
	{xpath: "Number", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

/***********************************************************************************/

function Master_ObligationsGrid() {};
Master_ObligationsGrid.tabIndex = 2;
Master_ObligationsGrid.componentName = "Obligations grid";
Master_ObligationsGrid.dataBinding = XPathConstants.MASTER_GRID_XPATH;
Master_ObligationsGrid.srcData = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations";
Master_ObligationsGrid.srcDataOn = [XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation/DeleteFlag"];
Master_ObligationsGrid.rowXPath = "Obligation";
Master_ObligationsGrid.keyXPath = "ObligationSeq";
Master_ObligationsGrid.columns = [
	{xpath: "EventId", sort: "numerical"},
	{xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "ObligationType", sort: "numerical"},
	{xpath: "Description"},
	{xpath: "DeleteFlag", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; }, additionalSortColumns: [ { columnNumber: 1, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true" }
];

/**
 * For deleted Obligations, display grid row in green
 * @param rowId
 * @author kznwpr
 * @return classList  
 */
Master_ObligationsGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
      	var obDeleted = Services.getValue(Master_ObligationsGrid.srcData + "/Obligation[./ObligationSeq = " + rowId + "]/DeleteFlag");
      	
      	if( obDeleted == "Y" )
      	{
	      	// errorClass (green)
          	classList = "errorClass";
      	}
 	}
    return classList;
}

/******************************* DATA BINDINGS *************************************/

Header_CaseNumber.dataBinding      = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CaseNumber";
Header_OwningCourtCode.dataBinding = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/OwningCourt"; 

Details_Event.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/EventId";
Details_EventDate.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/EventDate";
Details_ObligationType.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/ObligationType";
Details_Description.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/Description";
Details_Days.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/Days";
Details_ExpiryDate.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/ExpiryDate"; 
Details_Notes.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/Notes";
Details_LastUpdateUser.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/LastUpdateUser";

// Located on the master panel but really part of the new obligation popup
Master_ObligationType.dataBinding = XPathConstants.NEW_OBLIGATION_XPATH + "/ObligationType";
Master_Description.dataBinding = XPathConstants.NEW_OBLIGATION_XPATH + "/Description";

New_Obligation_Popup_Days.dataBinding = XPathConstants.NEW_OBLIGATION_XPATH + "/Days";
New_Obligation_Popup_ExpiryDate.dataBinding = XPathConstants.NEW_OBLIGATION_XPATH + "/ExpiryDate";
New_Obligation_Popup_Notes.dataBinding = XPathConstants.NEW_OBLIGATION_XPATH + "/Notes";

Modify_Obligation_Popup_Event.dataBinding 			= Details_Event.dataBinding;
Modify_Obligation_Popup_EventDate.dataBinding 		= Details_EventDate.dataBinding;
Modify_Obligation_Popup_ObligationType.dataBinding 	= Details_ObligationType.dataBinding;
Modify_Obligation_Popup_Description.dataBinding 	= Details_Description.dataBinding;
Modify_Obligation_Popup_Days.dataBinding 			= Details_Days.dataBinding;
Modify_Obligation_Popup_ExpiryDate.dataBinding 		= Details_ExpiryDate.dataBinding;
Modify_Obligation_Popup_Notes.dataBinding 			= Details_Notes.dataBinding;
Modify_Obligation_Popup_LastUpdateUser.dataBinding 	= Details_LastUpdateUser.dataBinding;

/******************************* LOV POPUPS ****************************************/

function NewObligation_ObligationTypeLOV() {};
NewObligation_ObligationTypeLOV.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/NewObligationType";
NewObligation_ObligationTypeLOV.srcData = XPathConstants.REF_DATA_XPATH + "/ObligationTypes";
NewObligation_ObligationTypeLOV.rowXPath = "ObligationType";
NewObligation_ObligationTypeLOV.keyXPath = "Id";
NewObligation_ObligationTypeLOV.columns = [
	{xpath: "Id", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "Description"}
];
NewObligation_ObligationTypeLOV.styleURL = "/css/NewObligationTypeLOVGrid.css";
NewObligation_ObligationTypeLOV.destroyOnClose = false;

/**
 * @author kznwpr
 * 
 */
NewObligation_ObligationTypeLOV.prePopupPrepare = function()
{
	Services.setValue(NewObligation_ObligationTypeLOV.dataBinding, "");
}

NewObligation_ObligationTypeLOV.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_ObligationTypeLOVBtn"} ],
		keys: [ { key: Key.F6, element: "Master_ObligationType" }, { key: Key.F6, element: "Master_Description" } ]
	}
};

NewObligation_ObligationTypeLOV.logicOn = [NewObligation_ObligationTypeLOV.dataBinding];
NewObligation_ObligationTypeLOV.logic = function(event)
{
	if ( event.getXPath().indexOf(NewObligation_ObligationTypeLOV.dataBinding) == -1 )
	{
		return;
	}

	var selectedType = Services.getValue(NewObligation_ObligationTypeLOV.dataBinding);
	Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/ObligationType", selectedType);
}

/***********************************************************************************/

function NotesTypeLOVGrid() {};
NotesTypeLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubForms/NotesLOVFee";
NotesTypeLOVGrid.srcData = XPathConstants.NOTES_LOV_SRCDATA_XPATH;
NotesTypeLOVGrid.rowXPath = "Fee";
NotesTypeLOVGrid.keyXPath = "Description";
NotesTypeLOVGrid.columns = [ {xpath: "Description"} ];
NotesTypeLOVGrid.styleURL = "/css/NotesLOVGrid.css";
NotesTypeLOVGrid.destroyOnClose = false;
/**
 * @author kznwpr
 * 
 */
NotesTypeLOVGrid.prePopupPrepare = function()
{
	Services.removeNode(XPathConstants.NOTES_LOV_SRCDATA_XPATH);
	Services.startTransaction();
	Services.setValue(NotesTypeLOVGrid.dataBinding, "");
	
	// Determine the source for the LOV Popup
	var srcNode = null;
	var lovMode = Services.getValue(NotesLOVMode.CURRENT_MODE_XPATH);
	if ( lovMode == NotesLOVMode.NEW_TYPE10 || lovMode == NotesLOVMode.EXISTING_TYPE10 )
	{
		srcNode = XPathConstants.REF_DATA_XPATH + "/Type10FeeTypes";
	}
	else if ( lovMode == NotesLOVMode.NEW_TYPE21 || lovMode == NotesLOVMode.EXISTING_TYPE21 )
	{
		srcNode = XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes";
	}
	
	// Move the relevant nodes to the popup's source data
	if ( null != srcNode )
	{
		var nodeList = Services.getNodes(srcNode + "/Fee");
		for ( var i=0, l=nodeList.length; i<l; i++ )
		{
			Services.addNode(nodeList[i], XPathConstants.NOTES_LOV_SRCDATA_XPATH);
		}
	}
	Services.endTransaction();
}

NotesTypeLOVGrid.logicOn = [NotesTypeLOVGrid.dataBinding];
NotesTypeLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(NotesTypeLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var selectedFee = Services.getValue(NotesTypeLOVGrid.dataBinding);
	if ( CaseManUtils.isBlank(selectedFee) )
	{
		return;
	}
	
	Services.startTransaction();
	var lovMode = Services.getValue(NotesLOVMode.CURRENT_MODE_XPATH);
	
	if ( lovMode == NotesLOVMode.NEW_TYPE21 || lovMode == NotesLOVMode.EXISTING_TYPE21 )
	{
		// Type 21 Obligations need to store the Id, but display the Description
		var feeId = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes/Fee[./Description = '" + selectedFee + "']/Id");
	}
	
	switch ( lovMode )
	{
		case NotesLOVMode.NEW_TYPE10:
			Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/Notes", selectedFee);
			break;
			
		case NotesLOVMode.NEW_TYPE21:
			Services.setValue(XPathConstants.NEW_OBLIGATION_XPATH + "/Notes", feeId);
			break;
			
		case NotesLOVMode.EXISTING_TYPE10:
			Services.setValue(Details_Notes.dataBinding, selectedFee);
			break;
			
		case NotesLOVMode.EXISTING_TYPE21:
			Services.setValue(Details_Notes.dataBinding, feeId);
			break;
	}
	Services.endTransaction();
}

/**
 * @author kznwpr
 * @return adaptor  
 */
NotesTypeLOVGrid.nextFocusedAdaptorId = function() 
{
	var adaptor = "Status_SaveBtn";
	var lovMode = Services.getValue(NotesLOVMode.CURRENT_MODE_XPATH);
	if ( lovMode == NotesLOVMode.NEW_TYPE10 || lovMode == NotesLOVMode.NEW_TYPE21 )
	{
		adaptor = "New_Obligation_Popup_SaveBtn";
	}
	return adaptor;
}

/******************************* HEADER PANEL **************************************/

function Header_CaseNumber() {};
Header_CaseNumber.tabIndex = -1;
Header_CaseNumber.isReadOnly = function() {return true;}
Header_CaseNumber.isEnabled = enableHeader;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";

/**
 * Handle the callback after a successful server call.
 * @param dom
 * @author kznwpr
 * 
 */
Header_CaseNumber.onSuccess = function(dom)
{
	// Select the MaintainObligations tag rather than the ds tag
	var data = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	if( null != data )
	{
		Services.replaceNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT, data);
		
		// Filter the parties for the header grid
		var caseType = Services.getValue(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/CaseType");
		CaseManUtils.setPartiesForHeaderGrid(caseType, XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Parties/Party", "TypeCode");
	}

	var mechanism = Services.getValue(MaintainObligationsParams.MECHANISM);
	var action = Services.getValue(MaintainObligationsParams.ACTION);

	// If the screen mode is mandatory modify we need to look up the obligation sequence for 
	// the given obligation type here and select that row. Do it here because the business data 
	// has now been loaded
	if (mechanism == Mechanism.MANDATORY && action == Action.MODIFY)
	{
		// Look for the row that contains the given obligation type. There will only ever be one of these for the event
		var obligationType = Services.getValue(MaintainObligationsParams.OBLIGATION_TYPE);
		var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation[./ObligationType = " + obligationType + " and ./DeleteFlag = 'N']/ObligationSeq";
		var obligationSeq = Services.getValue(xpath);					

		// Force the grid to select the obligation and that will display it in the mandatory modify popup
		Services.setValue(Master_ObligationsGrid.dataBinding, obligationSeq);    		
	}
	
	// This is set after the successful addition of an obligation
	var newObligationSeqToSelect = Services.getValue(XPathConstants.NEWOBSEQ_SELECT_IND_XPATH);
	if ( !CaseManUtils.isBlank(newObligationSeqToSelect) )
	{
		// We have reloaded the business data so now select the new obligation that was added
		Services.setValue(Master_ObligationsGrid.dataBinding, newObligationSeqToSelect);
		// Clear the variable
		Services.setValue(XPathConstants.NEWOBSEQ_SELECT_IND_XPATH, "");
	}
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Header_CaseNumber.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/***********************************************************************************/

function Header_OwningCourtCode() {};
Header_OwningCourtCode.tabIndex = -1;
Header_OwningCourtCode.isReadOnly = function() {return true;}
Header_OwningCourtCode.isEnabled = enableHeader;
Header_OwningCourtCode.helpText = "Owning court code";

/***********************************************************************************/

function Header_OwningCourtName() {};
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.isReadOnly = function() {return true;}
Header_OwningCourtName.isEnabled = enableHeader;
Header_OwningCourtName.helpText = "Owning court name";

/******************************* MASTER PANEL **************************************/

function Master_ObligationType() {}
Master_ObligationType.tabIndex = 3;
Master_ObligationType.helpText = "The unique identifier for the obligation type";
Master_ObligationType.maxLength = 3;
Master_ObligationType.isTemporary = function() {return true;}
Master_ObligationType.readOnlyOn = [Header_CaseNumber.dataBinding];
Master_ObligationType.isReadOnly = function()
{
	// The control is not read-only when the maintenance mode is create
	var maintenanceMode = Services.getValue(MaintainObligationsParams.MAINTENANCE_MODE);
	return ( maintenanceMode == MaintenanceMode.CREATE ) ? false : true;
}

Master_ObligationType.validate = function()
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

Master_ObligationType.logicOn = [Master_ObligationType.dataBinding];
Master_ObligationType.logic = function(event)
{
	if(!CaseManUtils.isBlank(Services.getValue(Master_ObligationType.dataBinding)))
	{
		// Populate the description field by looking up the obligation type in reference data
		var description = Services.getValue(XPathConstants.REF_DATA_XPATH + "/ObligationTypes/ObligationType[./Id = " + this.dataBinding + "]/Description");
		Services.setValue(Master_Description.dataBinding, description);
	}
	else
	{
		// The obligation type is blank so clear out the description
		Services.setValue(Master_Description.dataBinding, "");
	}
}

/***********************************************************************************/

function Master_Description() {}
Master_Description.tabIndex = -1;
Master_Description.isReadOnly = function() {return true;}
Master_Description.helpText = "Description of the obligation type";

/***********************************************************************************/

function Master_ObligationTypeLOVBtn() {}
Master_ObligationTypeLOVBtn.tabIndex = 4;
Master_ObligationTypeLOVBtn.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Master_ObligationTypeLOVBtn.isEnabled = function()
{
	// The button is only enabled when the screen mode is maintenance create
	var screenMode = Services.getValue(XPathConstants.SCREEN_MODE_XPATH);
	return ( screenMode == ScreenMode.MAINTENANCE_CREATE ) ? true : false;
}

/***********************************************************************************/

function Master_AddObligationBtn() {};
Master_AddObligationBtn.tabIndex = 5;
Master_AddObligationBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "maintainObligations" } ]
	}
};

Master_AddObligationBtn.enableOn = [Master_ObligationType.dataBinding];
Master_AddObligationBtn.isEnabled = function()
{
	// The button is disabled when the maintenance mode is not create
	var maintenanceMode = Services.getValue(MaintainObligationsParams.MAINTENANCE_MODE);
	if ( maintenanceMode != MaintenanceMode.CREATE )
	{
		return false;
	}
	
	// Disabled if the obligation type not entered or is invalid
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	if ( CaseManUtils.isBlank(obligationType) || null != Master_ObligationType.validate() )
	{
		return false;
	}
	return true;
}

/**
 * @author kznwpr
 * 
 */
Master_AddObligationBtn.actionBinding = function()
{
	// Check if any existing obligations have been modified
	if (changesMade())
	{
		var singleUseObligationStillInDOM = "false";
		if (confirm(Messages.DETSLOST_MESSAGE))
		{
			Status_SaveBtn.actionBinding();
		}
		else
		{
			// Cancel has been selected indicating not to save any outstanding changes
			// so check the dom for any modified rows whose DeleteFlag = 'Y' and is the
			// same obligation type as the obligation that is going to be added
			var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation[./Status = '" + Status.MODIFIED 
				+ "' and ./DeleteFlag = 'Y' and ./ObligationType = " + Services.getValue(Master_ObligationType.dataBinding) + "]";
			if (Services.countNodes(xpath) > 0) 
			{
				singleUseObligationStillInDOM = "true";
			}			
		}
		Services.setValue(XPathConstants.SINGLEUSEOBLIGATION_IND_XPATH, singleUseObligationStillInDOM);
	}

	// Get the obligation details
	var params = new ServiceParams();
	params.addSimpleParameter("obligationType", Services.getValue(Master_ObligationType.dataBinding));
	params.addSimpleParameter("eventID", Services.getValue(MaintainObligationsParams.EVENT_ID));	
	Services.callService(ObligationServices.GET_OBLIGATION_DETAILS_SERVICE, params, Master_AddObligationBtn, true);						
}

/**
 * Handle the callback after a successful server call.
 * @param dom
 * @author kznwpr
 * 
 */
Master_AddObligationBtn.onSuccess = function(dom)
{
	if (dom != null)
	{
		// Get the data out of the xml that is returned from the server
		var defaultDays = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/DefaultDays").text;
		var multiUse = dom.selectSingleNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/MultiUse").text;	
		if (multiUse == "true")
		{
			// Multiple instances of the obligation are permitted so open the popup
			Services.setValue(New_Obligation_Popup_Days.dataBinding, defaultDays);
			Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_RAISE);																	
		}
		else
		{
			// Multiple instances of the obligation are not permitted		
			// If the obligation already exists then display the error message
			var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation["
				+ "./ObligationType = " + Services.getValue(Master_ObligationType.dataBinding) 
				+ " and ./DeleteFlag = 'N']";
			var singleUseObligationStillInDOM = Services.getValue(XPathConstants.SINGLEUSEOBLIGATION_IND_XPATH);
			if (Services.countNodes(xpath) > 0 || singleUseObligationStillInDOM == "true" ) 
			{
				// The obligation already exists so show the error message
				alert(Messages.MULTI_USE_MESSAGE);
			}
			else
			{
				// The obligation does not exist so open the popup
				Services.setValue(New_Obligation_Popup_Days.dataBinding, defaultDays);			
				Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_RAISE);								
			}
		}
	}
}

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Master_AddObligationBtn.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/***********************************************************************************/

function Master_RemoveObligationBtn() {};
Master_RemoveObligationBtn.tabIndex = 6;
Master_RemoveObligationBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_D, element: "maintainObligations", alt: true } ]
	}
};

// Give the button a databinding property as a convenient place to store 
// the xpath which will be updated when the button is clicked
Master_RemoveObligationBtn.dataBinding = XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag";

Master_RemoveObligationBtn.enableOn = [Header_CaseNumber.dataBinding, Master_RemoveObligationBtn.dataBinding, XPathConstants.SCREEN_MODE_XPATH, Master_ObligationsGrid.dataBinding];
Master_RemoveObligationBtn.isEnabled = function()
{
	// The remove button is only enabled when the screen mode is maintenance create or maintenance modify
	if (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_CREATE && 
		Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_MODIFY)
	{
		return false;
	}
	
	// Disabled if the currently selected obligation is deleted
	var obDeleted = Services.getValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag");
	if ( obDeleted == "Y" )
	{
		return false;
	}

	// If there are obligations whose delete flag has not been set then enable the button
	var xpath = XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation[./DeleteFlag = 'N']";
	if (Services.countNodes(xpath) > 0)
	{
		// The button is enabled
		return true;
	}
	
	// Set the value in the grid's data binding to null when there are no obligations 
	// in the grid so the enable rule will fire for the details panel and disable the controls
	Services.setValue(Master_ObligationsGrid.dataBinding, null);

	// The button is disabled
	return false;	
}

/**
 * @author kznwpr
 * 
 */
Master_RemoveObligationBtn.actionBinding = function()
{
	Services.setValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/Status" , Status.MODIFIED);
	Services.setValue(Master_RemoveObligationBtn.dataBinding, 'Y');
}

/******************************* DETAILS PANEL *************************************/

function Details_Event() {}
Details_Event.tabIndex = -1;
Details_Event.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_Event.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_Event.isEnabled = enableDetails;
Details_Event.readOnlyOn = [Header_CaseNumber.dataBinding];
Details_Event.isReadOnly = readOnlyDetails;
Details_Event.helpText = "Event ID";

/***********************************************************************************/

function Details_EventDate() {}
Details_EventDate.tabIndex = -1;
Details_EventDate.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_EventDate.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_EventDate.isEnabled = enableDetails;
Details_EventDate.readOnlyOn = [Header_CaseNumber.dataBinding];
Details_EventDate.isReadOnly = readOnlyDetails;
Details_EventDate.helpText = "Date of the event created";

/***********************************************************************************/

function Details_ObligationType() {}
Details_ObligationType.tabIndex = -1;
Details_ObligationType.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_ObligationType.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_ObligationType.isEnabled = enableDetails;
Details_ObligationType.readOnlyOn = [Header_CaseNumber.dataBinding];
Details_ObligationType.isReadOnly = readOnlyDetails;
Details_ObligationType.helpText = "The unique identifier for the obligation type";

/***********************************************************************************/

function Details_Description() {}
Details_Description.tabIndex = -1;
Details_Description.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_Description.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_Description.isEnabled = enableDetails;
Details_Description.readOnlyOn = [Header_CaseNumber.dataBinding];
Details_Description.isReadOnly = readOnlyDetails;
Details_Description.helpText = "Description of the obligation type";

/***********************************************************************************/

function Details_Days() {}
Details_Days.tabIndex = 10;
Details_Days.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_Days.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_Days.isEnabled = enableDetails;
Details_Days.helpText = "Enter number of days - expiry date will be calculated automatically";
Details_Days.maxLength = 4;
Details_Days.readOnlyOn = [Master_ObligationsGrid.dataBinding, XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag"];
Details_Days.isReadOnly = function()
{
	var obDeleted = Services.getValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag");
	return ( obDeleted == "Y" ) ? true : false;
}

Details_Days.validateOn = [Master_ObligationsGrid.dataBinding];
Details_Days.validate = function()
{
	var days = Services.getValue(Details_Days.dataBinding);
	return validateDays(days);
}

Details_Days.logicOn = [Details_Days.dataBinding];
/**
 * Implement the callback
 * @param event
 * @author kznwpr
 * @return null, ;} 
 */
Details_Days.logic = function(event)
{	
	// Ignore if it is not an update event or the field is invalid
	if (event.getType() != DataModelEvent.UPDATE || !this.getValid())
	{
		return;
	}
	else
	{
		// Do not advance the date if the days control is empty
		if (CaseManUtils.isBlank(Services.getValue(Details_Days.dataBinding))) {return;}
		var days = Number(Services.getValue(Details_Days.dataBinding));	
		advanceDate(days, Details_ExpiryDate);			
	}
}

/***********************************************************************************/

function Details_ExpiryDate() {}
Details_ExpiryDate.tabIndex = 11;
Details_ExpiryDate.updateMode = "clickCellMode";
Details_ExpiryDate.componentName = "Expiry date";
Details_ExpiryDate.retrieveOn = [Master_ObligationsGrid.dataBinding];

Details_ExpiryDate.readOnlyOn = [Master_ObligationsGrid.dataBinding, XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag"];
Details_ExpiryDate.isReadOnly = function()
{
	var obDeleted = Services.getValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag");
	return ( obDeleted == "Y" ) ? true : false;
}

Details_ExpiryDate.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_ExpiryDate.isEnabled = enableDetails;
Details_ExpiryDate.mandatoryOn = [Master_ObligationsGrid.dataBinding];
Details_ExpiryDate.isMandatory = function() {return true;}
Details_ExpiryDate.helpText = "The date when the obligation will be expired";
Details_ExpiryDate.validateOn = [Master_ObligationsGrid.dataBinding, XPathConstants.EXPIRY_DATE_STATUS_XPATH];
Details_ExpiryDate.validate = function()
{
	// Only perform the validation if the status flag contains "MODIFIED"
	// This ensures date in the past validation occurs only after the date has been changed
	// and so does not validate existing data as soon as the row is selected, which could
	// invalidate existing obligations
	var ec = null;
	var expiryDateStatus = Services.getValue(XPathConstants.EXPIRY_DATE_STATUS_XPATH);
	if ( expiryDateStatus == Status.MODIFIED )
	{
		ec = validateExpiryDateNotInPast(Details_ExpiryDate.dataBinding);
	}
	return ec;
}

Details_ExpiryDate.logicOn = [Details_ExpiryDate.dataBinding];
Details_ExpiryDate.logic = function(event)
{
	if ( event.getXPath() != Details_ExpiryDate.dataBinding ) 
	{
		return;
	}
	
	// Create a date object from the date string that is stored in the dom
	var expiryDate = Services.getValue(Details_ExpiryDate.dataBinding);
	if ( !CaseManUtils.isBlank(expiryDate) && null != FWDateUtil.parseXSDDate(expiryDate) )
	{
		var dateCode = CaseManUtils.createDate( expiryDate );
		checkNonWorkingDate(dateCode, Details_ExpiryDate.dataBinding);
	}
	
	// Update the expiry date status for the currently selected row
	Services.setValue(XPathConstants.EXPIRY_DATE_STATUS_XPATH, Status.MODIFIED);
}

/***********************************************************************************/

function Details_Notes() {}
Details_Notes.tabIndex = 12;
Details_Notes.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_Notes.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_Notes.isEnabled = enableDetails;
Details_Notes.helpText = "Free format notes - LOV for obligation 10 & 21";
Details_Notes.maxLength = 60;
Details_Notes.mandatoryOn = [Master_ObligationsGrid.dataBinding];
Details_Notes.isMandatory = function() 
{
	var obligationType = Services.getValue(Details_ObligationType.dataBinding);

	if(obligationType == "10" || obligationType == "21" || obligationType == "27")
	{
		// The notes field must be entered. For types 10 and 21
		// the LOV must be used because this field is read only
		return true;
	}
	return false;
}

Details_Notes.readOnlyOn = [Master_ObligationsGrid.dataBinding, XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag"];
Details_Notes.isReadOnly = function()
{
	var obDeleted = Services.getValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag");
	if ( obDeleted == "Y" ) return true;

	var obligationType = Services.getValue(Details_ObligationType.dataBinding);

	if(obligationType == "10" || obligationType == "21")
	{
		// The notes field is read only and mandatory
		return true;
	}
	return false;
}

Details_Notes.transformToDisplay = function(value)
{
	var displayValue = null;
	var obligationType = Services.getValue(Details_ObligationType.dataBinding);
	if ( null != value && obligationType == "21" )
	{
		// For obligation type 21, convert the note ref data code to the note ref data description
		var noteCodeExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes/Fee[./Id = '" + value + "']");
		if ( noteCodeExists )
		{
			// The Notes value is a valid reference data code.  Get the corresponding description and display it
			// instead of the code.
			displayValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes/Fee[./Id = '" + value + "']/Description");
		}
		else
		{
			// The Notes value is not a valid reference data code, display whatever is currently in the model.
			displayValue = value;
		}
	}
	else
	{
		// For all other obligation types display the value in the model
		displayValue = value;
	}
	return displayValue;
}

Details_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

/***********************************************************************************/

function Details_NotesLOVBtn() {}
Details_NotesLOVBtn.tabIndex = 13;
Details_NotesLOVBtn.enableOn = [Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH, XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag"];
Details_NotesLOVBtn.isEnabled = function()
{
	var obDeleted = Services.getValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag");
	if ( obDeleted == "Y" ) return false;

	// The cancel button is only enabled when the screen mode is maintenance create or maintenance modify
	if (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_CREATE && 
		Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_MODIFY)
	{
		return false;
	}
	
	// The LOV is only enabled when the obligation type is either 10 or 21
	var obligation = Services.getValue(Details_ObligationType.dataBinding);
	if(obligation == "10" || obligation == "21")
	{
		return true;
	}
	return false;
}

/**
 * @author kznwpr
 * 
 */
Details_NotesLOVBtn.actionBinding = function()
{
	var obligationType = Services.getValue(Details_ObligationType.dataBinding);
	// The LOV button only enables when the obligation type is either 10 or 21
	if(obligationType == "10")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.EXISTING_TYPE10);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if(obligationType == "21")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.EXISTING_TYPE21);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
};

/***********************************************************************************/

function Details_LastUpdateUser() {}
Details_LastUpdateUser.tabIndex = -1;
Details_LastUpdateUser.retrieveOn = [Master_ObligationsGrid.dataBinding];
Details_LastUpdateUser.enableOn = [Header_CaseNumber.dataBinding, Master_ObligationsGrid.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
Details_LastUpdateUser.isEnabled = enableDetails;
Details_LastUpdateUser.readOnlyOn = [Header_CaseNumber.dataBinding];
Details_LastUpdateUser.isReadOnly = readOnlyDetails;
Details_LastUpdateUser.helpText = "The user who last updated the obligation";

Details_LastUpdateUser.logicOn = [Details_Notes.dataBinding, Details_ExpiryDate.dataBinding, XPathConstants.SELECTED_OBLIGATION_XPATH + "/DeleteFlag"];
Details_LastUpdateUser.logic = function(event)
{
	var srcXPath = event.getXPath();
	var validEntry = false;
	for ( var i=0, l=Details_LastUpdateUser.logicOn.length; i<l; i++ )
	{
		if ( srcXPath == Details_LastUpdateUser.logicOn[i] )
		{
			validEntry = true;
			break;
		}
	} 
	
	if ( validEntry )
	{
		var userName = Services.getCurrentUser();
		Services.setValue(Details_LastUpdateUser.dataBinding, userName);
	}
}

/******************************* ADD OBLIGATION POPUP ******************************/

function New_Obligation_Popup_Days() {}
New_Obligation_Popup_Days.validate = function()
{
	var days = Services.getValue(New_Obligation_Popup_Days.dataBinding);
	return validateDays(days);
}
New_Obligation_Popup_Days.helpText = "Enter number of days - expiry date will be calculated automatically";
New_Obligation_Popup_Days.maxLength = 4;
New_Obligation_Popup_Days.tabIndex = 20;

New_Obligation_Popup_Days.logicOn = [New_Obligation_Popup_Days.dataBinding];
/**
 * Implement the callback
 * @param event
 * @author kznwpr
 * @return null, ;} 
 */
New_Obligation_Popup_Days.logic = function(event)
{		
	// Ignore if it is the add event fired on form initialisation or the field is invalid
	if ((event.getType() == DataModelEvent.ADD && event.getXPath() == "/") || !this.getValid())
	{
		return;
	}
	else
	{
		// We now handle event updates and the add event which occurs when the user
		// first types a value into the days field (this causes an add event)
		if (CaseManUtils.isBlank(Services.getValue(New_Obligation_Popup_Days.dataBinding))) {return;}		
		var days = Number(Services.getValue(New_Obligation_Popup_Days.dataBinding));	
		advanceDate(days, New_Obligation_Popup_ExpiryDate);
	}	
}

/***********************************************************************************/

function New_Obligation_Popup_ExpiryDate() {}
New_Obligation_Popup_ExpiryDate.updateMode = "clickCellMode";
New_Obligation_Popup_ExpiryDate.isTemporary = function() { return true; }
New_Obligation_Popup_ExpiryDate.validate = function()
{
	return validateExpiryDateNotInPast(New_Obligation_Popup_ExpiryDate.dataBinding);
}

New_Obligation_Popup_ExpiryDate.logicOn = [New_Obligation_Popup_ExpiryDate.dataBinding];
New_Obligation_Popup_ExpiryDate.logic = function(event)
{
	if ( event.getXPath() != New_Obligation_Popup_ExpiryDate.dataBinding )
	{
		return;
	}
	
	// Create a date object from the date string that is stored in the dom
	var expiryDate = Services.getValue(New_Obligation_Popup_ExpiryDate.dataBinding);
	if ( !CaseManUtils.isBlank(expiryDate) && null != FWDateUtil.parseXSDDate(expiryDate) )
	{
		var dateCode = CaseManUtils.createDate( expiryDate );
		checkNonWorkingDate(dateCode, New_Obligation_Popup_ExpiryDate.dataBinding);
	}
}

New_Obligation_Popup_ExpiryDate.isMandatory = function() {return true;}
New_Obligation_Popup_ExpiryDate.helpText = "The date when the obligation will be expired";
New_Obligation_Popup_ExpiryDate.tabIndex = 21;

/***********************************************************************************/

function New_Obligation_Popup_Notes() {}
New_Obligation_Popup_Notes.isTemporary = function() {return true;}
New_Obligation_Popup_Notes.helpText = "Free format notes - LOV for obligation 10 & 21";
New_Obligation_Popup_Notes.maxLength = 60;
New_Obligation_Popup_Notes.tabIndex = 22;
New_Obligation_Popup_Notes.mandatoryOn = [Master_ObligationType.dataBinding];
New_Obligation_Popup_Notes.isMandatory = function()
{
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	// If the obligation type is 27 then the notes fiedd is mandatory.
	if(obligationType == "27")
	{
		return true;
	}
	return false;
}

New_Obligation_Popup_Notes.readOnlyOn = [Master_ObligationType.dataBinding];
New_Obligation_Popup_Notes.isReadOnly = function()
{
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	// If the obligation type is either 10 or 21 then the notes field is read only.
	// The only way for the user to enter notes is via the LOV
	if(obligationType == "10" || obligationType == "21")
	{
		return true;
	}
	return false;
}

New_Obligation_Popup_Notes.transformToDisplay = function(value)
{
	var displayValue = null;
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	if ( null != value && obligationType == "21" )
	{
		// For obligation type 21, convert the note ref data code to the note ref data description
		displayValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes/Fee[./Id = '" + value + "']/Description");
	}
	else
	{
		// For all other obligation types display the value in the model
		displayValue = value;
	}
	return displayValue;
}

New_Obligation_Popup_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

/***********************************************************************************/

function New_Obligation_Popup_NotesLOVBtn() {}
/**
 * @author kznwpr
 * 
 */
New_Obligation_Popup_NotesLOVBtn.actionBinding = function()
{
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	// The LOV button only enables when the obligation type is either 10 or 21
	if(obligationType == "10")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.NEW_TYPE10);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if(obligationType == "21")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.NEW_TYPE21);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
};

New_Obligation_Popup_NotesLOVBtn.tabIndex = 23;
New_Obligation_Popup_NotesLOVBtn.enableOn = [Master_ObligationType.dataBinding];
New_Obligation_Popup_NotesLOVBtn.isEnabled = function()
{
	var obligationType = Services.getValue(Master_ObligationType.dataBinding);
	// The LOV button only enables when the obligation type is either 10 or 21
	if(obligationType == "10" || obligationType == "21")
	{
		return true;
	}
	return false;
}

/***********************************************************************************/

function New_Obligation_Popup_SaveBtn() {}
New_Obligation_Popup_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "New_Obligation_Popup" } ]
	}
};
New_Obligation_Popup_SaveBtn.tabIndex = 24;
New_Obligation_Popup_SaveBtn.validationList = ["New_Obligation_Popup_Days", "Master_ObligationType", "New_Obligation_Popup_ExpiryDate", "New_Obligation_Popup_Notes"];
New_Obligation_Popup_SaveBtn.enableOn = [Master_ObligationType.dataBinding, New_Obligation_Popup_ExpiryDate.dataBinding, New_Obligation_Popup_Notes.dataBinding, New_Obligation_Popup_Days.dataBinding];
New_Obligation_Popup_SaveBtn.isEnabled = function(event)
{
	// This is to handle the initial state of the save button, which should be disabled
	// When the validateFields is called on initialisation it returns true even though mandatory fields are empty.
	// For some reason mandatory fields are not set to mandatory
	if (CaseManUtils.isBlank(Services.getValue(Master_ObligationType.dataBinding))) {return false;}
	
	// The Ok button is only when the expiry date is filled and if the obligation type is 27 the notes also needs to be filled
	if (CaseManUtils.isBlank(Services.getValue(New_Obligation_Popup_ExpiryDate.dataBinding)) ||
		(Services.getValue(Master_ObligationType.dataBinding) == "27" &&
		CaseManUtils.isBlank(Services.getValue(New_Obligation_Popup_Notes.dataBinding))))
	{
		return false;
	}	
		
	var validFields = CaseManValidationHelper.validateFields(New_Obligation_Popup_SaveBtn.validationList);
	return validFields;	
}

/**
 * @author kznwpr
 * @return ;}, boolean 
 */
New_Obligation_Popup_SaveBtn.actionBinding = function()
{
	// If any mandatory fields are empty or any fields are invalid then quit
	if (!mandatoryNotesFieldEntered() || !CaseManValidationHelper.validateFields(New_Obligation_Popup_SaveBtn.validationList)) {return;}
	
	Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_LOWER);	
	
	// Load the DOM with the xml structure for a new obligation
	var newObligation = Services.loadDOMFromURL("NewObligation.xml");
	var root = "/Obligation";

	// Set the data in the DOM for the new obligation
	var surrogateId = getNextSurrogateKey();
	newObligation.selectSingleNode(root + "/CaseNumber").appendChild(newObligation.createTextNode(Services.getValue(Header_CaseNumber.dataBinding)));	

	// Use the event data that is stored in the app scope
	newObligation.selectSingleNode(root + "/EventSeq").appendChild(newObligation.createTextNode(Services.getValue(MaintainObligationsParams.EVENT_SEQ)));	

	// Set the status
	newObligation.selectSingleNode(root + "/Status").appendChild(newObligation.createTextNode(Status.NEW));		

	// Use the event data that has been specified in the popup
	newObligation.selectSingleNode(root + "/ObligationType").appendChild(newObligation.createTextNode(Services.getValue(Master_ObligationType.dataBinding)));		
	newObligation.selectSingleNode(root + "/Description").appendChild(newObligation.createTextNode(Services.getValue(Master_Description.dataBinding)));

	if (CaseManUtils.isBlank(Services.getValue(New_Obligation_Popup_Days.dataBinding))) 
	{	
		newObligation.selectSingleNode(root + "/Days").appendChild(newObligation.createTextNode(""));	
	}
	else
	{
		newObligation.selectSingleNode(root + "/Days").appendChild(newObligation.createTextNode(Services.getValue(New_Obligation_Popup_Days.dataBinding)));
	}

	newObligation.selectSingleNode(root + "/ExpiryDate").appendChild(newObligation.createTextNode(Services.getValue(New_Obligation_Popup_ExpiryDate.dataBinding)));		

	if (CaseManUtils.isBlank(Services.getValue(New_Obligation_Popup_Notes.dataBinding))) 
	{	
		newObligation.selectSingleNode(root + "/Notes").appendChild(newObligation.createTextNode(""));	
	}
	else
	{
		newObligation.selectSingleNode(root + "/Notes").appendChild(newObligation.createTextNode(Services.getValue(New_Obligation_Popup_Notes.dataBinding)));
	}
	
	newObligation.selectSingleNode(root + "/LastUpdateUser").appendChild( newObligation.createTextNode( Services.getCurrentUser() ) );	
	newObligation.selectSingleNode(root + "/DeleteFlag").appendChild(newObligation.createTextNode("N"));			

	// Clear out the temp data
	resetNewObligation();	
	
	// Set the screen mode now that the popup has been closed down
	setScreenMode();
	
	// Persist the new obligation
	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	// Create the xml structure in the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	var maintainObligationsNode = XML.createElement(businessDataDOM, "MaintainObligations");
	var obligationsNode = XML.createElement(businessDataDOM, "Obligations");		
	
	// Append the new obligation to the obligations node
	obligationsNode.appendChild(newObligation.selectSingleNode(root));		
	// Append the obligations node to the maintain obligations node
	maintainObligationsNode.appendChild(obligationsNode);
	// Append the maintain obligations node to the ds node
	dsNode.appendChild(maintainObligationsNode);
	// Add the ds node, which now contains a copy of the new obligation
	businessDataDOM.appendChild(dsNode);		

	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("caseNumber", businessDataDOM);
	// Call the add service
	var returnedDOM = Services.callService(ObligationServices.ADD_SERVICE, params, Status_SaveBtn, true);
}

/***********************************************************************************/

function New_Obligation_Popup_CancelBtn() {}
New_Obligation_Popup_CancelBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "New_Obligation_Popup" } ]
	}
};
New_Obligation_Popup_CancelBtn.tabIndex = 25;
New_Obligation_Popup_CancelBtn.enableOn = [Master_ObligationType.dataBinding, XPathConstants.SCREEN_MODE_XPATH];
New_Obligation_Popup_CancelBtn.isEnabled = function(event)
{
	// The cancel button is only enabled when the screen mode is optional create or maintenance create
	if (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) == ScreenMode.OPTIONAL_CREATE || 
		Services.getValue(XPathConstants.SCREEN_MODE_XPATH) == ScreenMode.MAINTENANCE_CREATE)
	{
		return true;
	}
	return false;
}

/**
 * @author kznwpr
 * 
 */
New_Obligation_Popup_CancelBtn.actionBinding = function()
{
	Services.dispatchEvent("New_Obligation_Popup", BusinessLifeCycleEvents.EVENT_LOWER);	
	
	// Clear out the temp data
	resetNewObligation();		
	// Set the screen mode now that the popup has been closed down
	setScreenMode();	
	// Based on the screen mode that is now set work out if the entire screen should close down
	processScreenClose();
}

/******************************* MANDATORY MODIFY POPUP ****************************/

function Modify_Obligation_Popup_Event() {}
Modify_Obligation_Popup_Event.tabIndex = -1;
Modify_Obligation_Popup_Event.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_Event.isReadOnly = function() {return true;}
Modify_Obligation_Popup_Event.helpText = "Event ID";

/***********************************************************************************/

function Modify_Obligation_Popup_EventDate() {}
Modify_Obligation_Popup_EventDate.tabIndex = -1;
Modify_Obligation_Popup_EventDate.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_EventDate.isReadOnly = function() {return true;}
Modify_Obligation_Popup_EventDate.helpText = "Date of the event created";

/***********************************************************************************/

function Modify_Obligation_Popup_ObligationType() {}
Modify_Obligation_Popup_ObligationType.tabIndex = -1;
Modify_Obligation_Popup_ObligationType.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_ObligationType.isReadOnly = function() {return true;}
Modify_Obligation_Popup_ObligationType.helpText = "The unique identifier for the obligation type";

/***********************************************************************************/

function Modify_Obligation_Popup_Description() {}
Modify_Obligation_Popup_Description.tabIndex = -1;
Modify_Obligation_Popup_Description.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_Description.isReadOnly = function() {return true;}
Modify_Obligation_Popup_Description.helpText = "Description of the obligation type";

/***********************************************************************************/

function Modify_Obligation_Popup_Days() {}
Modify_Obligation_Popup_Days.tabIndex = 30;
Modify_Obligation_Popup_Days.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_Days.helpText = "Enter number of days - expiry date will be calculated automatically";
Modify_Obligation_Popup_Days.maxLength = 4;
Modify_Obligation_Popup_Days.validate = function()
{
	var days = Services.getValue(Modify_Obligation_Popup_Days.dataBinding);
	return validateDays(days);
}

/***********************************************************************************/

function Modify_Obligation_Popup_ExpiryDate() {}
Modify_Obligation_Popup_ExpiryDate.tabIndex = 31;
Modify_Obligation_Popup_ExpiryDate.updateMode = "clickCellMode";
Modify_Obligation_Popup_ExpiryDate.isTemporary = function() {return true;}
Modify_Obligation_Popup_ExpiryDate.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_ExpiryDate.isMandatory = function() {return true;}
Modify_Obligation_Popup_ExpiryDate.helpText = "The date when the obligation will be expired";
Modify_Obligation_Popup_ExpiryDate.validate = function()
{
	// Only validate this control when the popup is visible
	// All the controls on the modify popup share the same data bindings
	// as the details controls. We need to only validate when appropriate
	// otherwise these controls will appear as invalid when the details
	// controls are invalid when calling validateForm()
	var ec = null;
	var modifyObligationPopupVisible = Services.getValue(XPathConstants.MODIFYOB_POPUP_IND_XPATH);
	if ( modifyObligationPopupVisible = "true" ) 
	{
		ec = validateExpiryDateNotInPast(Modify_Obligation_Popup_ExpiryDate.dataBinding);
	}
	return ec;
}

/***********************************************************************************/

function Modify_Obligation_Popup_Notes() {}
Modify_Obligation_Popup_Notes.tabIndex = 32;
Modify_Obligation_Popup_Notes.isTemporary = function() {return true;}
Modify_Obligation_Popup_Notes.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_Notes.helpText = "Free format notes - LOV for obligation 10 & 21";
Modify_Obligation_Popup_Notes.maxLength = 60;
Modify_Obligation_Popup_Notes.isMandatory = function() 
{
	var obligationType = Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding);

	if(obligationType == "10" || obligationType == "21" || obligationType == "27")
	{
		// The notes field must be entered. For types 10 and 21
		// the LOV must be used because this field is read only
		return true;
	}
	return false;
}

Modify_Obligation_Popup_Notes.readOnlyOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_Notes.isReadOnly = function()
{
	var obligationType = Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding);

	if(obligationType == "10" || obligationType == "21")
	{
		// The notes field is read only and mandatory
		return true;
	}
	return false;
}

Modify_Obligation_Popup_Notes.transformToDisplay = function(value)
{
	var displayValue = null;
	var obligationType = Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding);
	if ( null != value && obligationType == "21" )
	{
		// For obligation type 21, convert the note ref data code to the note ref data description
		displayValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Type21FeeTypes/Fee[./Id = '" + value + "']/Description");
	}
	else
	{
		// For all other obligation types display the value in the model
		displayValue = value;
	}
	return displayValue;
}

Modify_Obligation_Popup_Notes.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value) : null;
}

/***********************************************************************************/

function Modify_Obligation_Popup_NotesLOVBtn() {}
Modify_Obligation_Popup_NotesLOVBtn.tabIndex = 33;
Modify_Obligation_Popup_NotesLOVBtn.enableOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_NotesLOVBtn.isEnabled = function()
{
	// The LOV is only enabled when the obligation type is either 10 or 21
	var obligation = Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding);
	if(obligation == "10" || obligation == "21")
	{
		return true;
	}
	return false;
}

/**
 * @author kznwpr
 * 
 */
Modify_Obligation_Popup_NotesLOVBtn.actionBinding = function()
{
	var obligationType = Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding);
	// The LOV button only enables when the obligation type is either 10 or 21
	if(obligationType == "10")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.EXISTING_TYPE10);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if(obligationType == "21")
	{
		Services.setValue(NotesLOVMode.CURRENT_MODE_XPATH, NotesLOVMode.EXISTING_TYPE21);
		Services.dispatchEvent("NotesTypeLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
};

/***********************************************************************************/

function Modify_Obligation_Popup_LastUpdateUser() {}
Modify_Obligation_Popup_LastUpdateUser.tabIndex = -1;
Modify_Obligation_Popup_LastUpdateUser.retrieveOn = [Master_ObligationsGrid.dataBinding];
Modify_Obligation_Popup_LastUpdateUser.isReadOnly = function() {return true;}
Modify_Obligation_Popup_LastUpdateUser.helpText = "The user who last updated the obligation";
Modify_Obligation_Popup_LastUpdateUser.logicOn = [Modify_Obligation_Popup_Notes.dataBinding, Modify_Obligation_Popup_ExpiryDate.dataBinding];
Modify_Obligation_Popup_LastUpdateUser.logic = function(event)
{
	var srcXPath = event.getXPath();
	var validEntry = false;
	for ( var i=0, l=Modify_Obligation_Popup_LastUpdateUser.logicOn.length; i<l; i++ )
	{
		if ( srcXPath == Modify_Obligation_Popup_LastUpdateUser.logicOn[i] )
		{
			validEntry = true;
			break;
		}
	} 
	
	if ( validEntry )
	{
		var userName = Services.getCurrentUser();
		Services.setValue(Modify_Obligation_Popup_LastUpdateUser.dataBinding, userName);
	}
}

/***********************************************************************************/

function Modify_Obligation_Popup_SaveBtn() {}
Modify_Obligation_Popup_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "Modify_Obligation_Popup" } ]
	}
};
Modify_Obligation_Popup_SaveBtn.tabIndex = 34;
Modify_Obligation_Popup_SaveBtn.validationList = ["Modify_Obligation_Popup_Days", "Modify_Obligation_Popup_ExpiryDate", "Modify_Obligation_Popup_Notes"];
Modify_Obligation_Popup_SaveBtn.enableOn = [Modify_Obligation_Popup_Days.dataBinding, Modify_Obligation_Popup_ExpiryDate.dataBinding, Modify_Obligation_Popup_Notes.dataBinding];
Modify_Obligation_Popup_SaveBtn.isEnabled = function(event)
{
	// This is to handle the initial state of the save button, which should be disabled
	// When the validateFields is called on initialisation it returns true even though mandatory fields are empty.
	// For some reason mandatory fields are not set to mandatory
	if (CaseManUtils.isBlank(Services.getValue(Modify_Obligation_Popup_ExpiryDate.dataBinding))) {return false;}
	
	// The Ok button is only when the expiry date is filled and if the obligation type is 27 the notes also needs to be filled
	if (CaseManUtils.isBlank(Services.getValue(Modify_Obligation_Popup_ExpiryDate.dataBinding)) ||
		(Services.getValue(Modify_Obligation_Popup_ObligationType.dataBinding) == "27" &&
		CaseManUtils.isBlank(Services.getValue(Modify_Obligation_Popup_Notes.dataBinding))))
	{
		return false;
	}	
		
	var validFields = CaseManValidationHelper.validateFields(Modify_Obligation_Popup_SaveBtn.validationList);
	return validFields;			
}

/**
 * @author kznwpr
 * @return ;} 
 */
Modify_Obligation_Popup_SaveBtn.actionBinding = function()
{
	// If any mandatory fields are empty or any fields are invalid then quit
	if (!CaseManValidationHelper.validateFields(Modify_Obligation_Popup_SaveBtn.validationList)) {return;}
	
	Services.dispatchEvent("Modify_Obligation_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	Services.setValue(XPathConstants.MODIFYOB_POPUP_IND_XPATH, "false");

	// Set the screen mode now that the popup has been closed down
	setScreenMode();	
	if (changesMade())
	{
		// Save the changes
		Status_SaveBtn.actionBinding();
	}
	else
	{
		// The user casn.t made any changes and just clicked save so now work out
		// if the entire screen should close down
		processScreenClose();
	}
}

/******************************* STATUS BUTTONS ************************************/

function Status_SaveBtn() {}
Status_SaveBtn.tabIndex = 40;
Status_SaveBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "maintainObligations" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.actionBinding = function()
{
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (0 != invalidFields.length) 
	{
		Services.setValue(XPathConstants.EXIT_SCREEN_IND_XPATH, "false");		
		return;
	}	

	// If there are no changes then quit
	if (!changesMade())
	{
		alert("Sorry, there are no changes to save.");
		return;
	}	
	
	// Create a new dom to send to the server
	var businessDataDOM = XML.createDOM(null, null, null);
	// Identify the /ds/MaintainObligations node in the existing dom and take a copy of it
	var maintainObligationsNode = Services.getNode(XPathConstants.BUSINESS_DATA_BINDING_ROOT);
	// Create the /ds node that will be added to the new dom
	var dsNode = XML.createElement(businessDataDOM, "ds");
	// Append the maintain obligations node to the ds node
	dsNode.appendChild(maintainObligationsNode);
	// Add the ds node, which now contains a copy of all the existing obligations
	businessDataDOM.appendChild(dsNode);
	
	// Pass the dom to the server
	var params = new ServiceParams();
	params.addDOMParameter("caseNumber", businessDataDOM);
	// Call the update service
	Services.callService(ObligationServices.UPDATE_OBLIGATIONS_SERVICE, params, Status_SaveBtn, true);
}
	
/**
 * @param dom
 * @param serviceName
 * @author kznwpr
 * @return null 
 */
Status_SaveBtn.onSuccess = function(dom, serviceName)
{
	if (dom != null && (serviceName == ObligationServices.UPDATE_OBLIGATIONS_SERVICE || serviceName == ObligationServices.ADD_SERVICE))
	{		
		// If we have come here by clicking the close button and there were changes to
		// save or the screen mode doesn't allow updates then close the screen down and 
		// don't bother reloading the data after the save
		var closeBtnClicked = Services.getValue(XPathConstants.EXIT_SCREEN_IND_XPATH);
		if ( closeBtnClicked == "true" || (Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_CREATE && 
			Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MAINTENANCE_MODIFY))
		{
			closeDownScreen();
			return;
		}
					
		if (serviceName == ObligationServices.ADD_SERVICE)
		{
			var n = dom.selectNodes(XPathConstants.BUSINESS_DATA_BINDING_ROOT + "/Obligations/Obligation/ObligationSeq");
			// Get the obligation sequence out of the returned document so that it can be selected after
			// the dom has been reloaded, which will be done in the Header_CaseNumber.onSuccess callback
			var newObligationSeqToSelect = XML.getNodeTextContent(n[0]);
			Services.setValue(XPathConstants.NEWOBSEQ_SELECT_IND_XPATH, newObligationSeqToSelect);
		}

		// Reload the saved data
		var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", Services.getValue(Header_CaseNumber.dataBinding));
		Services.callService(ObligationServices.RETRIEVAL_SERVICE, params, Header_CaseNumber, true);						
	}					
}	

/**
 * Handle the callback after an unsuccessful server call.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onError = function(exception)
{
	alert("The following exception was thrown from the server::\n" + exception);
}

/**
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		// Reload the saved data
		var params = new ServiceParams();
		params.addSimpleParameter("caseNumber", Services.getValue(Header_CaseNumber.dataBinding));
		Services.callService(ObligationServices.RETRIEVAL_SERVICE, params, Header_CaseNumber, true);
	}
	else
	{
		closeDownScreen();
	}
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author kznwpr
 * 
 */
Status_SaveBtn.onAuthorizationException = function(exception) {
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);
}

/***********************************************************************************/

function Status_CloseBtn() {}
Status_CloseBtn.tabIndex = 41;
Status_CloseBtn.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "maintainObligations" } ]
	}
};

/**
 * @author kznwpr
 * @return null 
 */
Status_CloseBtn.actionBinding = function()
{
	Services.setValue(XPathConstants.EXIT_SCREEN_IND_XPATH, "true");
	// Check if any unsaved data
	if ( changesMade() && Services.getValue(XPathConstants.SCREEN_MODE_XPATH) != ScreenMode.MANDATORY_MODIFY && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveBtn.actionBinding();
		return;
	}

	closeDownScreen();
}

/******************************* LOGIC DIVS ****************************************/

/**
 * Logic to detect when fields have been updated so we know when to prompt the
 * use to save when navigating away from the screen. Note that the delete button
 * sets the state explicitly and is not handled here. This is because as soon as the
 * delete flag is set the obligation disappears from the grid. The status therefore
 * needs to be set before the delete flag.
 * @author kznwpr
 * 
 */
function updateDetailsLogic() {}
updateDetailsLogic.logicOn = [Details_Days.dataBinding, Details_ExpiryDate.dataBinding, Details_Notes.dataBinding];
updateDetailsLogic.logic = function(event)
{
	if (event.getType() != DataModelEvent.UPDATE || event.getXPath() == XPathConstants.BUSINESS_DATA_BINDING_ROOT + "[position() = 1]") {return;}

	// Update the current event's status field
	Services.setValue(XPathConstants.SELECTED_OBLIGATION_XPATH + "/Status" , Status.MODIFIED);
}
