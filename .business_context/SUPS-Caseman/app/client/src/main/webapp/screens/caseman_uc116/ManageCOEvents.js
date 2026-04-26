/** 
 * @fileoverview ManageCOEvents.js:
 * This file contains the form and field configurations for the UC116 - Manage 
 * CO Events screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 05/06/2006 - Chris Vincent, changed global variables to static variables.  Also 
 *				moved the constants to this file from the separate constants file.
 * 06/06/2006 - Chris Vincent, fixed defect 3522 by replacing all wpdom variables with
 *				wpDom variables (i.e. upper case 'd').
 * 13/06/2006 - Chris Vincent, made some changes to the section where Oracle Reports
 *				called to use CaseManFormParameters.ORNODE_XPATH instead of WPNODE_XPATH
 *				for when both Oracle Reports and Word Processing are called for an event.
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the two Event Details fields.
 * 14/06/2006 - Anoop Sehdev, changed way in which WP is called when double clicking on grid.
 * 26/07/2006 - Chris Vincent, added Previous and Next buttons to allow paging on the co events
 * 				screen.  100 records at a time are returned.  Ref - defect 4018.
 * 26/07/2006 - Chris Vincent, change made for defect 3972.  For event 174, if TCO27 is selected
 * 				from the Details Tick Box LOV List, the Creditor field needs to be enabled to allow
 * 				the user to select a Debt.
 * 26/07/2006 - Chris Vincent, change made for defect 3969.  The error message CaseMan_PrevOrderResponseNotExpired_Msg
 * 				was not invoked due to invalid logic.  Coded restructured.
 * 26/07/2006 - Chris Vincent, change made for defects 3974 & 3975.  Two error messages were not invoked:
 * 				CaseMan_CO_ReleasableMoneyInCourt_Msg and CaseMan_CO_NonReleasableMoneyInCourt_Msg
 * 				as the client side was looking for true/false when the server sent Y/N.
 * 02/08/2006 - Chris Vincent, changed the validation check on Releasable Money in Court so that validation
 * 				only occurred if the amount passed by by the service is not null.  Non releaseable error 
 * 				message also changed so XXX is replaced by the amount in court.
 * 02/08/2006 - Chris Vincent, changed AddEvent_CreditorName.validate() as the TC027 validation (defect 3972)
 * 				was incorrect.
 * 03/08/2006 - Chris Vincent, as part of pagination defect (4018), issue stage validation referencing existing
 * 				events had to be changed, as not all existing events may be available in the DOM.  Data 
 * 				returned in getValidationData service so xpaths in AddEvent_Stage.validate updated.
 * 15/08/2006 - Chris Vincent, the releaseable money map from the validation service has been altered again
 * 				so client side changed to match again.  Defect 3975.
 * 04/10/2006 - Chris Vincent, updated the xpaths around the PreConditionMoneyInCourtCheck validation as the
 * 				MoneyInCourt/Amount node is no longer returned.  Now using ReleaseableMoney node instead.
 * 				Defect 5616.
 * 11/10/2006 - Frederik Vandendriessche, post build x issue 24 - handling reopening of event outputs
 * 15/11/2006 - Chris Vincent, fixing Candidate Build Z issue 174 which requires the Creditor Name dropdown
 * 				on the Add Event popup to display "Debt [Number] - [Creditor Name] instead of just Creditor
 * 				Name which can have duplicates.
 * 15/11/2006 - Chris Vincent, fixing CaseMan defect 5772 which requires the Debtor Name to be passed to the
 * 				add CO Event service call.
 * 16/01/2007 - Chris Vincent, change to Query_CONumber.logic() to display a warning if the CO has been
 * 				transferred (Temp_CaseMan defect 417). 
 * 16/01/2007 - Chris Vincent, aded filter to AddEvent_Stage.rowXPath to prevent user selecting Substituted 
 * 				Service as the Issue Stage for new CO Events.  Temp_CaseMan defect 414.
 * 24/01/2007 - Chris Vincent, updated the currency symbol transforms to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 22/03/2007 - Chris Vincent, added EventDetails_CreatedBy.transformToDisplay() to display the User Alias instead
 * 				of the User Id if present in DCA_USER otherwise user id is displayed.  CaseMan Defect 6000.
 * 23/03/2007 - Mark Groen, fixing CaseMan defect 6039. This concerns reprinting reports and the user requiring 
 *				more detail in the selectEventOutput_subform. A correct description is now returned by the service
 *				and an addition tag now holds the ReportId.  Changed this file so it sends the correct detail to 
 *				the reprintReport service.
 * 11/05/2007 - Chris Vincent, fixing problem identified in WIT regarding navigation post creation of CO Event that
 *				creates an Oracle Report output only.  Was erroneously adding a navigation into the call stack.
 * 15/01/2009 - Sandeep Mullangi - ServiceDays changes RFC0655
 * 10/02/2010 - Mark Groen, AddEvent_SaveButton.onSuccess(), set Oracle Report Court Code constant TRAC 2446
 *				Clear the Oracle Report Court Code constant when load case events in QueryPopup_OkButton.onSuccess() TRAC 2446
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/ManageCOEvents";
XPathConstants.SELECTED_EVENT_XPATH = XPathConstants.DATA_XPATH + "/COEvents/COEvent[./COEventSeq = /ds/var/page/SelectedGridRow/COEvent]";
XPathConstants.NEWEVENT_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewEvent";
XPathConstants.QUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Query";
XPathConstants.EVENTDATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/EventData";
XPathConstants.EVENTVALIDATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/CoEventValidationData";
XPathConstants.EVENTNAVIGATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/COEventNavigationList";
XPathConstants.FORM_STATE_XPATH = XPathConstants.VAR_FORM_XPATH + "/CurrentForm/state"
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.DIRTYFLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DirtyFlag";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ActionAfterSave";
XPathConstants.CO_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
XPathConstants.VAR_SERVICEDATE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ServiceDate";

/**
 * Enumeration of Form States
 * @author rzxd7g
 * 
 */
function FormStates() {};
FormStates.STATE_BLANK = "blank";
FormStates.STATE_MODIFY = "modify";

/**
 * Enumeration of CO Event Status Code (Helps update service identify the changes made)
 * @author rzxd7g
 * 
 */
function UpdateCOCode() {};
UpdateCOCode.STATUSCODE_DETSCHANGED = 1;
UpdateCOCode.STATUSCODE_MARKERROR = 2;
UpdateCOCode.STATUSCODE_UNMARKERROR = 4;
UpdateCOCode.STATUSCODE_NOTSERVED = 8;

/**
 * Actions After Saving
 * @author rzxd7g
 * 
 */
function ActionAfterSave() {};
ActionAfterSave.ACTION_NAVIGATE = "NAVIGATE";
ActionAfterSave.ACTION_CREATENEWEVENT = "CREATE_NEW_EVENT";
ActionAfterSave.ACTION_CLEARFORM = "CLEAR_FORM";
ActionAfterSave.ACTION_EXIT = "EXIT_SCREEN";
ActionAfterSave.ACTION_LOADNEWCO = "LOAD_NEW_CO";

/**
 * Enumeration of Service Statuses
 * @author rzxd7g
 * 
 */
function ServiceStatuses() {};
ServiceStatuses.BAILIFF = "BAILIFF";
ServiceStatuses.NOTSERVED = "NOT SERVED";
ServiceStatuses.PERSONAL = "PERSONAL";
ServiceStatuses.POSTAL = "POSTAL";
ServiceStatuses.NONE = "NONE";

/**
 * Enumeration of Issue Stages
 * @author rzxd7g
 * 
 */
function IssueStages() {};
IssueStages.ISSUE = "ISS";
IssueStages.REISSUE = "R/I";
IssueStages.SUBSERVICE = "S/S";

/**
 * Enumeration of New Event Details LOV Domains
 * @author rzxd7g
 * 
 */
function DetailsLOVDomains() {};
DetailsLOVDomains.EVT_111 = "EVT_111 DESCRIPTION";
DetailsLOVDomains.EVT_174 = "EVT_174_CO DESCRIPTION";

/**
 * Static Class representing CO Event Constants e.g. the default page size
 * @author rzxd7g
 * 
 */
function COEventConstants() {};
COEventConstants.PAGE_SIZE = 100;
COEventConstants.CO_TRANSFERRED_STATUS = "TRANSFERRED";

/****************************** MAIN FORM *****************************************/

function manageCOEvents() {}
/**
 * @author rzxd7g
 * 
 */
manageCOEvents.initialise = function()
{
	var extCONumber = CaseManUtils.getValidNodeValue( Services.getValue(ManageCOEventsParams.CO_NUMBER) );
	if ( !CaseManUtils.isBlank(extCONumber) )
	{
		// Screen has been passed a CO Number, load the details
		Services.setValue(XPathConstants.DATA_XPATH + "/CONumber", extCONumber);
		Query_SearchButton.actionBinding();
	}
	else if ( !CaseManUtils.isBlank( Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) ) )
	{
		// Set the owning court value to the user's owning court
		var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
		Services.setValue(Query_OwningCourtCode.dataBinding, owningCourt);
	}
}

/**
 * onSuccess to handle the retrieval of reference data that is lazy loaded
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
manageCOEvents.onSuccess = function(dom, serviceName)
{
	switch (serviceName)
	{
		case "getCoEventList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/StandardEvents", dom);
			break;
		case "getSystemDate":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/SystemDate", dom);
			break;
		case "getIssueStageList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/StageList", dom);
			break;
		case "getServiceStatusList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/ServiceList", dom);
			break;
	}
}

// Load the reference data from the xml into the model (only load what is required when enter screen)
manageCOEvents.refDataServices = [
	{ name:"Courts", dataBinding:XPathConstants.REF_DATA_XPATH, serviceName:"getCourtsShort", serviceParams:[] }
];

/******************************* SUB-FORMS *****************************************/

function selectEventOutput_subform() {};
selectEventOutput_subform.subformName = "selectEventOutputSubform";
/**
 * @author rzxd7g
 * 
 */
selectEventOutput_subform.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var dataNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs");
	Services.replaceNode(XPathConstants.VAR_FORM_XPATH + "/Subforms/SelectOutputData/Outputs", dataNode);
}

selectEventOutput_subform.replaceTargetNode = [ { sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_PAGE_XPATH + "/SelectedEventOutput/OutputId" } ];
/**
 * @author rzxd7g
 * 
 */
selectEventOutput_subform.processReturnedData = function() 
{
	// NOTE - If calls to Word Processing fail here, set something in the DOM and use it in OnPopupClose()
	var outputId = Services.getValue(XPathConstants.VAR_PAGE_XPATH + "/SelectedEventOutput/OutputId");
	var outputType = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Type");
	if ( outputType == "WP" )
	{
		// Call Word Processing
		// Prepare the Word Processing / Oracle Report Node
		/*
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Open");
		var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		WP.ProcessWP(FormController.getInstance, wpDom, NavigationController.CO_EVENTS_FORM, false)
		*/
		var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		if (null == documentId || documentId == "")
		{
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Create");
		}
		else
		{
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Open");
		}

		var eventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/COEventSeq");
		var eventStdId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId");
		var coNumber = Services.getValue(Query_CONumber.dataBinding);
		
		var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		
		var txDOM = XML.createDOM();
		txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
          "<xsl:output method='xml' indent='yes' />" +
          "<xsl:template match='Output'>" +
               "<WordProcessing>" +
               		"<Event>" +
		               	"<COEventSeq>" + eventSeq + "</COEventSeq>" +
	               		"<StandardEventId>" + eventStdId + "</StandardEventId>" +
	               		"<CONumber>" + coNumber + "</CONumber>" +
	               	"</Event>" +
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
		WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.CO_EVENTS_FORM, false);		
	}
	else if ( outputType == "OR" )
	{
		// Call Oracle Reports
		var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		//var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Description");//defect 6039 replaced with line below
		var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/ReportId");
		var orderId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/OutputId");
		var params = new ServiceParams();
		var dom = XML.createDOM();
		var fWReportIDElement = dom.createElement("FWReportId");
		fWReportIDElement.appendChild(dom.createTextNode(reportId));
		
		var orderIDElement = dom.createElement("OrderId");
		orderIDElement.appendChild(dom.createTextNode(orderId));				
		
		var suitorsCashReportElement = dom.createElement("SuitorsCashReport");
		suitorsCashReportElement.appendChild(fWReportIDElement);
		suitorsCashReportElement.appendChild(orderIDElement);
		
		var paramNode = XML.createDOM();
		paramNode.appendChild(suitorsCashReportElement);
		
		params.addDOMParameter("ReprintReport", paramNode);
		Services.callService("reprintReport", params, ReprintOracleReport, null);		
	}
}

/**
 * @author rzxd7g
 * @return "Master_COEventGrid"  
 */
selectEventOutput_subform.nextFocusedAdaptorId = function() 
{
	return "Master_COEventGrid";
}

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/********************************** POPUPS *****************************************/

function AddEvent_Popup() {};
/**
 * @author rzxd7g
 * @return "Master_COEventGrid"  
 */
AddEvent_Popup.nextFocusedAdaptorId = function() {
	return "Master_COEventGrid";
}

/*********************************************************************************/

function QueryCO_Popup() {};
QueryCO_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "QueryPopup_CancelButton"} ],
		keys: [ { key: Key.F4, element: "QueryCO_Popup" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_COEventGrid"  
 */
QueryCO_Popup.nextFocusedAdaptorId = function() {
	return "Master_COEventGrid";
}

/******************************** LOV POPUPS ***************************************/

function Query_OwningCourtLOVGrid() {};
Query_OwningCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/SelectedValues/OwningCourtLOV";
Query_OwningCourtLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Query_OwningCourtLOVGrid.rowXPath = "Court";
Query_OwningCourtLOVGrid.keyXPath = "Code";
Query_OwningCourtLOVGrid.columns = [
	{xpath: "Code", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "Name"}
];

Query_OwningCourtLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Query_OwningCourtLOVButton"} ],
		keys: [ { key: Key.F6, element: "Query_OwningCourtCode" }, { key: Key.F6, element: "Query_OwningCourtName" } ]
	}
};

Query_OwningCourtLOVGrid.styleURL = "../common_lov_subforms/CourtsLOVGrid.css";
Query_OwningCourtLOVGrid.destroyOnClose = false;
Query_OwningCourtLOVGrid.logicOn = [Query_OwningCourtLOVGrid.dataBinding];
Query_OwningCourtLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(Query_OwningCourtLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var courtCode = Services.getValue(Query_OwningCourtLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(courtCode) )
	{
		Services.startTransaction();
		Services.setValue(Query_OwningCourtCode.dataBinding, courtCode);
		Services.setValue(Query_OwningCourtLOVGrid.dataBinding, null);
		Services.endTransaction();
	}
}

/**
 * @author rzxd7g
 * @return "Query_SearchButton"  
 */
Query_OwningCourtLOVGrid.nextFocusedAdaptorId = function() 
{
	return "Query_SearchButton";
}

/*********************************************************************************/

function Master_COEventLOVGrid() {};
Master_COEventLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/AddEvent/EventId";
Master_COEventLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_COEventLOVGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/COType"];
Master_COEventLOVGrid.rowXPath = "StandardEvent[./COType = 'ALL' or ./COType = " + XPathConstants.DATA_XPATH + "/COType" + "]";
Master_COEventLOVGrid.keyXPath = "StandardEventId";
Master_COEventLOVGrid.columns = [
	{xpath: "StandardEventId", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "StandardEventDescription"}
];

Master_COEventLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_COEventLOVButton"} ],
		keys: [ { key: Key.F6, element: "Master_COEventId" }, { key: Key.F6, element: "Master_COEventDescription" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_COEventId"  
 */
Master_COEventLOVGrid.nextFocusedAdaptorId = function() {
	return "Master_COEventId";
}

/*********************************************************************************/

function AddEvent_DetailsLOVGrid() {};
AddEvent_DetailsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/SelectedValues/LOVDetails";
AddEvent_DetailsLOVGrid.srcData = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/Options";
AddEvent_DetailsLOVGrid.rowXPath = "Option";
AddEvent_DetailsLOVGrid.keyXPath = "Code";
AddEvent_DetailsLOVGrid.columns = [
	{ xpath: "Code" },
	{ xpath: "Description" }
];

/**
 * @author rzxd7g
 * 
 */
AddEvent_DetailsLOVGrid.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var dataNode = Services.getNode(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Options");
	Services.replaceNode(AddEvent_DetailsLOVGrid.srcData, dataNode);
}

/**
 * @author rzxd7g
 * @return "AddEvent_Service"  
 */
AddEvent_DetailsLOVGrid.nextFocusedAdaptorId = function() {
	return "AddEvent_Service";
}

AddEvent_DetailsLOVGrid.styleURL = "/css/DetailsTickBoxLOVGrid.css";
AddEvent_DetailsLOVGrid.destroyOnClose = false;
AddEvent_DetailsLOVGrid.logicOn = [AddEvent_DetailsLOVGrid.dataBinding];
AddEvent_DetailsLOVGrid.logic = function(event)
{
	if ( event.getXPath().indexOf(AddEvent_DetailsLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var lovValue = Services.getValue(AddEvent_DetailsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(lovValue) )
	{
		// For Tick Box Events, concatenate the code and the description selected
		var tickBoxDesc = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Options/Option[./Code = '" + lovValue + "']/Description");
		var detailsValue = lovValue + ": " + tickBoxDesc;
		Services.setValue(AddEvent_Details.dataBinding, detailsValue);
		Services.setValue(AddEvent_DetailsLOVGrid.dataBinding, "");
	}
}

/*********************************************************************************/

function AddEvent_PartyDetailsLOVGrid() {};

/**
 * Transforms the party type displayed in the LOV Grid
 * @param partyType
 * @author rzxd7g
 * @return displayValue  
 */
AddEvent_PartyDetailsLOVGrid.transformCOPartyType = function(partyType)
{
	var displayValue = "";
	switch (partyType)
	{
		case "CO DEBTOR":
			displayValue = "DEBTOR";
			break;
		case "CO CRED":
			displayValue = "CREDITOR";
			break;
		case "CO EMPLOYER":
			displayValue = "EMPLOYER";
			break;
		default:
			// Leave displayValue as blank
	}
	return displayValue;
}

/**
 * Sort function for the Party Type, order is:
 * Debtor, Creditor(s), Employer
 * @param a
 * @param b
 * @author rzxd7g
 * @return 1 , -1 , 0  
 */
AddEvent_PartyDetailsLOVGrid.sortPartyType = function(a,b)
{
	// Debtor always displayed first
	if ( a == "DEBTOR" ) return 1;
	if ( b == "DEBTOR" ) return -1;

	if ( a == "CREDITOR" && b == "EMPLOYER" ) return 1;
	if ( a == "EMPLOYER" && b == "CREDITOR" ) return -1;

	return 0;
}

AddEvent_PartyDetailsLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/SelectedValues/LOVPartyDetails";
AddEvent_PartyDetailsLOVGrid.srcData = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/COParties";
AddEvent_PartyDetailsLOVGrid.rowXPath = "COParty[./Type != 'CO PAYEE']";
AddEvent_PartyDetailsLOVGrid.keyXPath = "PartyId";
AddEvent_PartyDetailsLOVGrid.columns = [
	{ xpath: "Name" },
	{ xpath: "Type", transformToDisplay: AddEvent_PartyDetailsLOVGrid.transformCOPartyType, sort: AddEvent_PartyDetailsLOVGrid.sortPartyType, additionalSortColumns: [ { columnNumber: 0, orderOnAsc: "ascending", orderOnDesc: "descending" } ], defaultSort:"true", defaultSortOrder:"ascending" }
];

/**
 * @author rzxd7g
 * 
 */
AddEvent_PartyDetailsLOVGrid.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var dataNode = Services.getNode(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/COParties");
	Services.replaceNode(AddEvent_PartyDetailsLOVGrid.srcData, dataNode);
}

/**
 * @author rzxd7g
 * @return "AddEvent_Service"  
 */
AddEvent_PartyDetailsLOVGrid.nextFocusedAdaptorId = function() {
	return "AddEvent_Service";
}

AddEvent_PartyDetailsLOVGrid.styleURL = "/css/PartyDetailsLOVGrid.css";
AddEvent_PartyDetailsLOVGrid.destroyOnClose = false;
AddEvent_PartyDetailsLOVGrid.logicOn = [AddEvent_PartyDetailsLOVGrid.dataBinding];
AddEvent_PartyDetailsLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(AddEvent_PartyDetailsLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var lovValue = Services.getValue(AddEvent_PartyDetailsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(lovValue) )
	{
		// Debtor/Creditor/Employer list in the Details LOV, write the Party Type to the Details field
		var detailsValue = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/COParties/COParty[./PartyId = '" + lovValue + "']/Type");
		Services.setValue(AddEvent_Details.dataBinding, AddEvent_PartyDetailsLOVGrid.transformCOPartyType(detailsValue) );
		
		// If a Creditor selected, populate the Creditor field
		if ( detailsValue == "CO CRED" )
		{
			var debtSeqNumber = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/COParties/COParty[./PartyId = '" + lovValue + "']/DebtSeqNumber");
			Services.setValue(AddEvent_CreditorName.dataBinding, debtSeqNumber);
		}
		Services.setValue(AddEvent_PartyDetailsLOVGrid.dataBinding, "");
	}
}

/*********************************************************************************/

function AddEvent_CreditorLOVGrid() {};
AddEvent_CreditorLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/SelectedValues/CreditorName";
AddEvent_CreditorLOVGrid.srcData = XPathConstants.VAR_FORM_XPATH + "/LOVSubformData/Debts";
AddEvent_CreditorLOVGrid.rowXPath = "Debt";
AddEvent_CreditorLOVGrid.keyXPath = "DebtSeqNumber";
AddEvent_CreditorLOVGrid.columns = [
	{ xpath: "DebtNumber", sort: "numerical" },
	{ xpath: "CreditorName" },
	{ xpath: "DebtStatus" }
];

/**
 * @author rzxd7g
 * 
 */
AddEvent_CreditorLOVGrid.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var dataNode = Services.getNode(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts");
	Services.replaceNode(AddEvent_CreditorLOVGrid.srcData, dataNode);
}

AddEvent_CreditorLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddEvent_CreditorLOVButton"} ],
		keys: [ { key: Key.F6, element: "AddEvent_CreditorName" } ]
	}
};

/**
 * @author rzxd7g
 * @return "AddEvent_EventDate"  
 */
AddEvent_CreditorLOVGrid.nextFocusedAdaptorId = function() {
	return "AddEvent_EventDate";
}

AddEvent_CreditorLOVGrid.styleURL = "/css/CreditorsLOVGrid.css";
AddEvent_CreditorLOVGrid.destroyOnClose = false;
AddEvent_CreditorLOVGrid.logicOn = [AddEvent_CreditorLOVGrid.dataBinding];
AddEvent_CreditorLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(AddEvent_CreditorLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var creditor = Services.getValue(AddEvent_CreditorLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(creditor) )
	{
		// Set the Creditor Name field and blank the LOV Subform's databinding
		Services.startTransaction();
		Services.setValue(AddEvent_CreditorName.dataBinding, creditor);
		Services.setValue(AddEvent_CreditorLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/********************************** GRIDS *****************************************/

function QueryPopup_CONumberGrid() {};
QueryPopup_CONumberGrid.tabIndex = 60;
QueryPopup_CONumberGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedCORecord";
QueryPopup_CONumberGrid.srcData = XPathConstants.QUERY_XPATH + "/Results";
QueryPopup_CONumberGrid.rowXPath = "CoRecord";
QueryPopup_CONumberGrid.keyXPath = "CONumber";
QueryPopup_CONumberGrid.columns = [
	{xpath: "CONumber"},
	{xpath: "OldCONumber"},
	{xpath: "Debtor/PartyName"},
	{xpath: "Debtor/ContactDetails/Address/Line[1]"},
	{xpath: "Status"}
];

/*********************************************************************************/

function Master_COEventGrid() {}
Master_COEventGrid.isRecord = true;
Master_COEventGrid.componentName = "Master CO Event Grid";
Master_COEventGrid.tabIndex = 10;
Master_COEventGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/COEvent";
Master_COEventGrid.srcData = XPathConstants.DATA_XPATH + "/COEvents";
Master_COEventGrid.rowXPath = "COEvent";
Master_COEventGrid.keyXPath = "COEventSeq";
Master_COEventGrid.columns = [
	{xpath: "COEventSeq", sort: "disabled", transformToDisplay: function() { return ""; } },
	{xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "StandardEventId", sort: "numerical"},
	{xpath: "StandardEventDescription"},
	{xpath: "IssueStage"},
	{xpath: "ErrorInd", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; } }
];

/**
 * For events that are in error, display the grid row in a particular colour
 * @param rowId
 * @author rzxd7g
 * @return classList  
 */
Master_COEventGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
    	var failedOutput = false;
      	var blnError = Services.getValue(XPathConstants.DATA_XPATH + "/COEvents/COEvent[./COEventSeq = " + rowId + "]/ErrorInd");
      	var countOutputs = Services.countNodes(XPathConstants.DATA_XPATH + "/COEvents/COEvent[./COEventSeq = " + rowId + "]/Outputs/Output");
      	if ( countOutputs == 0 )
      	{
      		// No outputs, do not display icon
      		var finalInd = null;
      	}
      	else if ( countOutputs == 1 )
      	{
      		// One output, display the icon based upon the final indicator
      		var finalInd = Services.getValue(XPathConstants.DATA_XPATH + "/COEvents/COEvent[./COEventSeq = " + rowId + "]/Outputs/Output/Final");
      		
      		var documentId = Services.getValue(XPathConstants.DATA_XPATH + "/COEvents/COEvent[./COEventSeq = " + rowId + "]/Outputs/Output/DocumentId");
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

// Disable the grid if no CO loaded or no CO Events exist
Master_COEventGrid.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.srcData];
Master_COEventGrid.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/***************************** DATA BINDINGS **************************************/

Query_CONumber.dataBinding = XPathConstants.DATA_XPATH + "/CONumber";
Query_OldCONumber.dataBinding = XPathConstants.DATA_XPATH + "/OldCONumber";
Query_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Query_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtName";
Header_COType.dataBinding = XPathConstants.DATA_XPATH + "/COType";
Header_COStatus.dataBinding = XPathConstants.DATA_XPATH + "/COStatus";
Header_DebtorName.dataBinding = XPathConstants.DATA_XPATH + "/Debtor/PartyName";
Master_COEventId.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/AddEvent/EventId";
Master_COEventDescription.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/AddEvent/EventDescription";
EventDetails_DateReceived.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ReceiptDate";
EventDetails_EventId.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId";
EventDetails_EventDescription.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventDescription";
EventDetails_Stage.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/IssueStage";
EventDetails_Details.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/EventDetails";
EventDetails_ErrorFlag.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ErrorInd";
EventDetails_Service.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/Service";
EventDetails_BailiffId.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/BailiffId";
EventDetails_ServiceDate.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ServiceDate";
EventDetails_CreditorName.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/CreditorName";
EventDetails_BMSTask.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/BMSTask";
EventDetails_CreatedBy.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/UserName";
EventDetails_Date.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/EventDate";
AddEvent_DateReceived.dataBinding = XPathConstants.NEWEVENT_XPATH + "/ReceiptDate";
AddEvent_EventId.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventId";
AddEvent_EventDescription.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventDescription";
AddEvent_Stage.dataBinding = XPathConstants.NEWEVENT_XPATH + "/IssueStage";
AddEvent_Details.dataBinding = XPathConstants.NEWEVENT_XPATH + "/EventDetails";
AddEvent_Service.dataBinding = XPathConstants.NEWEVENT_XPATH + "/Service";
AddEvent_BailiffId.dataBinding = XPathConstants.NEWEVENT_XPATH + "/BailiffId";
AddEvent_CreditorName.dataBinding = XPathConstants.NEWEVENT_XPATH + "/CreditorName";
AddEvent_EventDate.dataBinding = XPathConstants.NEWEVENT_XPATH + "/EventDate";

/********************************* FIELDS ******************************************/

function Query_CONumber() {}
Query_CONumber.tabIndex = 1;
Query_CONumber.maxLength = 8;
Query_CONumber.helpText = "Unique Consolidated Order identifier";
Query_CONumber.componentName = "CO Number";
Query_CONumber.isTemporary = function() { return true; }
Query_CONumber.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_CONumber.isReadOnly = isCORecordLoaded;
Query_CONumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_CONumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_CONumber.logicOn = [XPathConstants.FORM_STATE_XPATH]
Query_CONumber.logic = function(event)
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	if ( event.getXPath() == XPathConstants.FORM_STATE_XPATH && formState == FormStates.STATE_MODIFY )
	{
		var coNumber = Services.getValue(Query_CONumber.dataBinding);
		if ( !CaseManUtils.isBlank(coNumber) )
		{
			Services.startTransaction();
			Services.setValue( ManageCOEventsParams.CO_NUMBER, coNumber )

			// Check if owning court is different
			var court = Services.getValue(Query_OwningCourtCode.dataBinding);
			var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			var msg_ind = Services.getValue(CaseManFormParameters.CODATA_OWNINGCOURTWARNING_XPATH);
			if ( !CaseManUtils.isBlank(court) && court != owningCourt && msg_ind != "true" )
			{
				alert(Messages.CO_OWNING_COURT_MESSAGE);
				Services.setValue(CaseManFormParameters.CODATA_OWNINGCOURTWARNING_XPATH, "true");
			}
			
			// Temp_CaseMan 417 - Warning message if the CO has been transferred.
			var coStatus = Services.getValue(Header_COStatus.dataBinding);
			if ( coStatus == COEventConstants.CO_TRANSFERRED_STATUS )
			{
				alert(Messages.CO_TRANSFERREDCO_MESSAGE);
			}
			
			Services.endTransaction();
		}
	}
}

Query_CONumber.validate = function()
{
	var ec = null;
	var coNumber = Services.getValue(Query_CONumber.dataBinding);
	if ( !CaseManUtils.isBlank(coNumber) )
	{
		var coSearch = coNumber.search(CaseManValidationHelper.VALID_CONUMBER_PATTERN)
		if ( coSearch != 0 )
		{
			// Does not match a valid CO Number pattern
			ec = ErrorCode.getErrorCode("CaseMan_CO_invalidCONumberFormat_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function Query_OldCONumber() {}
Query_OldCONumber.tabIndex = 2;
Query_OldCONumber.maxLength = 9;
Query_OldCONumber.helpText = "The previous CO number for the CO";
Query_OldCONumber.componentName = "Old CO Number";
Query_OldCONumber.isTemporary = function() { return true; }
Query_OldCONumber.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_OldCONumber.isReadOnly = isCORecordLoaded;
Query_OldCONumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_OldCONumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

/*********************************************************************************/

function Query_OwningCourtCode() {}
Query_OwningCourtCode.tabIndex = 3;
Query_OwningCourtCode.maxLength = 3;
Query_OwningCourtCode.helpText = "Owning court code";
Query_OwningCourtCode.componentName = "Owning Court Code";
Query_OwningCourtCode.isTemporary = function() { return true; }
Query_OwningCourtCode.validate = function()
{
	var ec = null;
	var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_OwningCourtCode.dataBinding + "]/Name");
	if( null == courtName )
	{
		// The entered court code does not exist
		ec = ErrorCode.getErrorCode("CaseMan_invalidCourtCode_Msg");
	}
	return ec;
}

Query_OwningCourtCode.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_OwningCourtCode.isReadOnly = isCORecordLoaded;
Query_OwningCourtCode.logicOn = [Query_OwningCourtCode.dataBinding];
Query_OwningCourtCode.logic = function(event)
{
	if (event.getXPath() != Query_OwningCourtCode.dataBinding)
	{
		return;
	}

	var courtCode = Services.getValue(Query_OwningCourtCode.dataBinding);
	if ( !CaseManUtils.isBlank( courtCode ) )
	{
		// Populate the Court Name field
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = " + Query_OwningCourtCode.dataBinding + "]/Name");
		if ( !CaseManUtils.isBlank(courtName) && Services.getValue(Query_OwningCourtName.dataBinding) != courtName )
		{
			Services.setValue(Query_OwningCourtName.dataBinding, courtName);
		}
	}
	else
	{
		Services.setValue(Query_OwningCourtName.dataBinding, "");
	}
}

/*********************************************************************************/

function Query_OwningCourtName() {}
Query_OwningCourtName.srcData = XPathConstants.REF_DATA_XPATH + "/Courts";
Query_OwningCourtName.rowXPath = "Court";
Query_OwningCourtName.keyXPath = "Name";
Query_OwningCourtName.displayXPath = "Name";
Query_OwningCourtName.strictValidation = true;
Query_OwningCourtName.tabIndex = 4;
Query_OwningCourtName.helpText = "Owning court name";
Query_OwningCourtName.componentName = "Owning Court Name";
Query_OwningCourtName.isTemporary = function() { return true; }
Query_OwningCourtName.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_OwningCourtName.isReadOnly = isCORecordLoaded;
Query_OwningCourtName.logicOn = [Query_OwningCourtName.dataBinding];
Query_OwningCourtName.logic = function(event)
{
	if (event.getXPath() != Query_OwningCourtName.dataBinding)
	{
		return;
	}

	var courtName = Services.getValue(Query_OwningCourtName.dataBinding);
	if ( !CaseManUtils.isBlank( courtName ) )
	{
		// Populate the Court Code field
		var courtCode = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Name = " + Query_OwningCourtName.dataBinding + "]/Code");
		if ( !CaseManUtils.isBlank(courtCode) && Services.getValue(Query_OwningCourtCode.dataBinding) != courtCode )
		{
			Services.setValue(Query_OwningCourtCode.dataBinding, courtCode);
		}
	}
	else
	{
		// Court Name cleared so clear the Court Code field
		Services.setValue(Query_OwningCourtCode.dataBinding, "");
	}
}

/*********************************************************************************/

function Header_COType() {}
Header_COType.tabIndex = -1;
Header_COType.helpText = "Consolidated Order type";
Header_COType.componentName = "CO Type";
Header_COType.isTemporary = function() { return true; }
Header_COType.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_COType.isEnabled = isCORecordLoaded;
Header_COType.isMandatory = function() { return true; }
Header_COType.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_COStatus() {}
Header_COStatus.tabIndex = -1;
Header_COStatus.helpText = "Status of the Consolidated Order";
Header_COStatus.componentName = "CO Status";
Header_COStatus.isTemporary = function() { return true; }
Header_COStatus.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_COStatus.isEnabled = isCORecordLoaded;
Header_COStatus.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_DebtorName() {}
Header_DebtorName.tabIndex = -1;
Header_DebtorName.helpText = "Debtor Name for the Consolidated Order";
Header_DebtorName.componentName = "Debtor Name";
Header_DebtorName.isTemporary = function() { return true; }
Header_DebtorName.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_DebtorName.isEnabled = isCORecordLoaded;
Header_DebtorName.isMandatory = function() { return true; }
Header_DebtorName.isReadOnly = function() { return true; }

/*********************************************************************************/

function Master_COEventId() {}
Master_COEventId.tabIndex = 13;
Master_COEventId.maxLength = 3;
Master_COEventId.helpText = "CO event ID code";
Master_COEventId.isTemporary = function() { return true; }
Master_COEventId.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_COEventId.isEnabled = isCORecordLoaded;
Master_COEventId.validate = function()
{
	var ec = null;
	var eventId = Services.getValue(Master_COEventId.dataBinding);
	if ( !CaseManUtils.isBlank(eventId) )
	{
		// Check EventId exists in the list
		if ( !CaseManValidationHelper.validateNumber(eventId) || !Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = '" + eventId + "' and (./COType = 'ALL' or ./COType = " + Header_COType.dataBinding + ") ]") )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidEventId_Msg");
		}
	}
	return ec;
}

Master_COEventId.logicOn = [Master_COEventId.dataBinding];
Master_COEventId.logic = function(event)
{
	if ( event.getXPath() != Master_COEventId.dataBinding )
	{
		return;
	}
	
	var eventId = Services.getValue(Master_COEventId.dataBinding);
	if ( !CaseManUtils.isBlank( eventId ) )
	{
		// Populate the Description field
		var eventDesc = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_COEventId.dataBinding + " and (./COType = 'ALL' or ./COType = " + Header_COType.dataBinding + ") ]/StandardEventDescription");
		if ( Services.getValue(Master_COEventDescription.dataBinding) != eventDesc )
		{
			Services.setValue(Master_COEventDescription.dataBinding, eventDesc);
		}
	}
	else
	{
		// EventId cleared so clear the Event Description
		Services.setValue(Master_COEventDescription.dataBinding, "");
	}
}

/*********************************************************************************/

function Master_COEventDescription() {}
Master_COEventDescription.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_COEventDescription.rowXPath = "StandardEvent[./COType = 'ALL' or ./COType = " + Header_COType.dataBinding + "]";
Master_COEventDescription.keyXPath = "StandardEventDescription";
Master_COEventDescription.displayXPath = "StandardEventDescription";
Master_COEventDescription.strictValidation = true;
Master_COEventDescription.sortMode = "alphabeticalLowToHigh";
Master_COEventDescription.tabIndex = 14;
Master_COEventDescription.helpText = "Description of the event";
Master_COEventDescription.isTemporary = function() { return true; }
Master_COEventDescription.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_COEventDescription.isEnabled = isCORecordLoaded;
Master_COEventDescription.logicOn = [Master_COEventDescription.dataBinding];
Master_COEventDescription.logic = function(event)
{
	if ( event.getXPath() != Master_COEventDescription.dataBinding )
	{
		return;
	}

	var eventDesc = Services.getValue(Master_COEventDescription.dataBinding);
	if ( !CaseManUtils.isBlank( eventDesc ) )
	{
		// Populate the EventId field
		var eventId = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventDescription = " + Master_COEventDescription.dataBinding + "]/StandardEventId");
		if ( !CaseManUtils.isBlank(eventId) && Services.getValue(Master_COEventId.dataBinding) != eventId )
		{
			Services.setValue(Master_COEventId.dataBinding, eventId);
		}
	}
	else
	{
		if ( null == Master_COEventId.validate() )
		{
			// Event Description cleared so clear the EventId field
			Services.setValue(Master_COEventId.dataBinding, "");
		}
	}
}

/*********************************************************************************/

function EventDetails_DateReceived() {}
EventDetails_DateReceived.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_DateReceived.tabIndex = -1;
EventDetails_DateReceived.maxLength = 11;
EventDetails_DateReceived.helpText = "Date when work received at court.";
EventDetails_DateReceived.componentName = "Date Received";
EventDetails_DateReceived.isTemporary = function() { return true; }
EventDetails_DateReceived.isMandatory = function() { return true; }
EventDetails_DateReceived.isReadOnly = function() { return true; }
EventDetails_DateReceived.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_DateReceived.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_EventId() {}
EventDetails_EventId.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_EventId.tabIndex = -1;
EventDetails_EventId.maxLength = 3;
EventDetails_EventId.helpText = "CO event ID code";
EventDetails_EventId.componentName = "Event Id";
EventDetails_EventId.isTemporary = function() { return true; }
EventDetails_EventId.isMandatory = function() { return true; }
EventDetails_EventId.isReadOnly = function() { return true; }
EventDetails_EventId.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_EventId.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_EventDescription() {}
EventDetails_EventDescription.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_EventDescription.tabIndex = -1;
EventDetails_EventDescription.maxLength = 70;
EventDetails_EventDescription.helpText = "Description of the event";
EventDetails_EventDescription.componentName = "Event Description";
EventDetails_EventDescription.isTemporary = function() { return true; }
EventDetails_EventDescription.isMandatory = function() { return true; }
EventDetails_EventDescription.isReadOnly = function() { return true; }
EventDetails_EventDescription.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_EventDescription.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_Stage() {}
EventDetails_Stage.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_Stage.tabIndex = -1;
EventDetails_Stage.maxLength = 3;
EventDetails_Stage.helpText = "The issue stage for the event";
EventDetails_Stage.componentName = "Issue Stage";
EventDetails_Stage.isTemporary = function() { return true; }
EventDetails_Stage.isReadOnly = function() { return true; }
EventDetails_Stage.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_Stage.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if no stage for the event
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

EventDetails_Stage.transformToDisplay = function(value)
{
	var displayValue = ""
	if ( !CaseManUtils.isBlank(value) )
	{
		displayValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StageList/Stage[./Value = '" + value + "']/Description");
	}
	return displayValue;
}

/*********************************************************************************/

function EventDetails_Details() {}
EventDetails_Details.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_Details.tabIndex = 20;
EventDetails_Details.maxLength = 500;
EventDetails_Details.helpText = "Event Details";
EventDetails_Details.componentName = "Event Details";
EventDetails_Details.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_Details.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

EventDetails_Details.mandatoryOn = [Master_COEventGrid.dataBinding, EventDetails_Stage.dataBinding];
EventDetails_Details.isMandatory = function()
{
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	if ( stage == IssueStages.SUBSERVICE )
	{
		// Details is mandatory if the stage is 'S/S'
		return true;
	}
	// Event specific rule - Event must be mandatory
	var editDetails = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/EditDetails");
	return editDetails == "M";
}

EventDetails_Details.readOnlyOn = [Master_COEventGrid.dataBinding];
EventDetails_Details.isReadOnly = function()
{
	// Event specific rule - Event must be read only
	var editDetails = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/EditDetails");
	return editDetails == "N";
}

EventDetails_Details.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

EventDetails_Details.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

EventDetails_Details.logicOn = [EventDetails_Details.dataBinding];
EventDetails_Details.logic = function(event)
{
	if ( event.getXPath() != EventDetails_Details.dataBinding )
	{
		return;
	}
	
	// Change the Event's Status so server knows to update it accordingly
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	if ( statusCode == 0 || statusCode == UpdateCOCode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateCOCode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_ErrorFlag() {}
EventDetails_ErrorFlag.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_ErrorFlag.modelValue = {checked: 'Y', unchecked: 'N'};
EventDetails_ErrorFlag.tabIndex = 21;
EventDetails_ErrorFlag.helpText = "Indicates whether or not the event was entered in error";
EventDetails_ErrorFlag.componentName = "Error Flag";
EventDetails_ErrorFlag.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_ErrorFlag.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

EventDetails_ErrorFlag.logicOn = [EventDetails_ErrorFlag.dataBinding];
EventDetails_ErrorFlag.logic = function(event)
{
	if ( !( event.getXPath() == EventDetails_ErrorFlag.dataBinding && event.getType() == DataModelEvent.UPDATE ) )
	{
		return;
	}
	
	// Change the Event's Status so server knows to update it accordingly
	var errorValue = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	
	if ( errorValue == "Y" )
	{
		// Marking the event as in error
		statusCode = statusCode + UpdateCOCode.STATUSCODE_MARKERROR;
	}
	else
	{
		// Unmarking the event in error
		statusCode = statusCode + UpdateCOCode.STATUSCODE_UNMARKERROR;
	}
	
	Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);

	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length )
	{
		return;
	}
	else
	{
		// Create the data node
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH)
		var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
		dataNode.appendChild(strippedNode);
		
		var params = new ServiceParams();
		params.addDOMParameter("coEvents", dataNode);
		Services.callService("updateCoEvents", params, EventDetails_ErrorFlag, true);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onSuccess = function(dom)
{
	// Reload the form
	loadCORecord();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		loadCORecord();
	}
	else
	{
		exitScreen();
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onError = function(exception) 
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onAuthorizationException = function(exception) 
{
	handleAuthorizationException(exception);
}

/*********************************************************************************/

function EventDetails_Service() {}
EventDetails_Service.srcData = XPathConstants.REF_DATA_XPATH + "/ServiceList";
EventDetails_Service.rowXPath = "/Service";
EventDetails_Service.keyXPath = "/Value";
EventDetails_Service.displayXPath = "/Value";
EventDetails_Service.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_Service.tabIndex = 22;
EventDetails_Service.helpText = "The service required for the event";
EventDetails_Service.componentName = "Service";
EventDetails_Service.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding, EventDetails_Stage.dataBinding];
EventDetails_Service.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if stage is blank
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

EventDetails_Service.readOnlyOn = [Master_COEventGrid.dataBinding];
EventDetails_Service.isReadOnly = function()
{
	// Read only if the event is obsolete
	var obsoleteFlag = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Obsolete");
	return ( obsoleteFlag == "Y" ) ? true : false;
}

EventDetails_Service.isMandatory = function() { return true; }
EventDetails_Service.validateOn = [Master_COEventGrid.dataBinding];
EventDetails_Service.validate = function() { return null; }
EventDetails_Service.logicOn = [EventDetails_Service.dataBinding];
EventDetails_Service.logic = function(event)
{
	if ( event.getXPath() != EventDetails_Service.dataBinding )
	{
		return;
	}
	
	// HANDLE SETTING OF DEFAULT VALUES BASED ON SERVICE STATUS
	var service = Services.getValue(EventDetails_Service.dataBinding);
	if ( service != ServiceStatuses.BAILIFF )
	{
		// Clear the Bailiff field if service is not BAILIFF
		Services.setValue(EventDetails_BailiffId.dataBinding, "");
	}

	if ( service == ServiceStatuses.POSTAL )
	{
		// Set service date to system date + 2 days if service is POSTAL
		Services.setValue(EventDetails_ServiceDate.dataBinding, calculatePostalServiceDate());
	}
	else
	{
		// For all other service types, blank the service date
		Services.setValue(EventDetails_ServiceDate.dataBinding, "");
	}
	
	// HANDLE SETTING OF STATUS FLAG SO SERVER CAN UPDATE CORRECT FIELDS
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	if ( statusCode >= UpdateCOCode.STATUSCODE_NOTSERVED && service != ServiceStatuses.NOTSERVED )
	{
		// Service status has been changed from the original value to NOT SERVED to another value
		statusCode = statusCode - UpdateCOCode.STATUSCODE_NOTSERVED;
	}
	
	if ( service == ServiceStatuses.NOTSERVED )
	{
		// Service status has been changed to NOT SERVED
		statusCode = statusCode + UpdateCOCode.STATUSCODE_NOTSERVED;
	}
	else
	{
		if ( statusCode != UpdateCOCode.STATUSCODE_DETSCHANGED )
		{
			// Details of the event have changed
			statusCode = statusCode + UpdateCOCode.STATUSCODE_DETSCHANGED;
		}
	}

	// Set the dirty flag and status code when value in field changes
	Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_BailiffId() {}
EventDetails_BailiffId.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_BailiffId.tabIndex = 23;
EventDetails_BailiffId.maxLength = 2;
EventDetails_BailiffId.helpText = "The Bailiff's area number";
EventDetails_BailiffId.componentName = "Bailiff Id";
EventDetails_BailiffId.readOnlyOn = [Master_COEventGrid.dataBinding];
EventDetails_BailiffId.isReadOnly = function()
{
	// Read only if the event is obsolete
	var obsoleteFlag = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Obsolete");
	return ( obsoleteFlag == "Y" ) ? true : false;
}

EventDetails_BailiffId.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding, EventDetails_Service.dataBinding, EventDetails_Stage.dataBinding];
EventDetails_BailiffId.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if stage is blank
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	if ( CaseManUtils.isBlank(stage) )
	{
		return false;
	}
	// Enabled if service is 'BAILIFF'
	var service = Services.getValue(EventDetails_Service.dataBinding);
	return service == ServiceStatuses.BAILIFF;
}

EventDetails_BailiffId.validateOn = [Master_COEventGrid.dataBinding];
EventDetails_BailiffId.validate = function()
{
	var ec = null;
	var bailiffId = Services.getValue(EventDetails_BailiffId.dataBinding)
	if ( !CaseManValidationHelper.validateNumber(bailiffId) )
	{
		ec = ErrorCode.getErrorCode("CaseMan_nonNumericBailiffId_Msg");
	}
	return ec;
}

EventDetails_BailiffId.logicOn = [EventDetails_BailiffId.dataBinding];
EventDetails_BailiffId.logic = function(event)
{
	if ( event.getXPath() != EventDetails_BailiffId.dataBinding )
	{
		return;
	}

	// Change the Event's Status so server knows to update it accordingly
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	if ( statusCode == 0 || statusCode == UpdateCOCode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateCOCode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_ServiceDate() {}
EventDetails_ServiceDate.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_ServiceDate.tabIndex = 24;
EventDetails_ServiceDate.maxLength = 11;
EventDetails_ServiceDate.helpText = "The service date";
EventDetails_ServiceDate.componentName = "Service Date";
EventDetails_ServiceDate.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding, EventDetails_Service.dataBinding, EventDetails_Stage.dataBinding];
EventDetails_ServiceDate.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if stage is blank
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	if ( CaseManUtils.isBlank(stage) )
	{
		return false;
	}
	// Disabled if service is 'NOT SERVED'
	var service = Services.getValue(EventDetails_Service.dataBinding);
	return service != ServiceStatuses.NOTSERVED;
}

EventDetails_ServiceDate.readOnlyOn = [Master_COEventGrid.dataBinding, EventDetails_Service.dataBinding];
EventDetails_ServiceDate.isReadOnly = function()
{
	// Read Only is event has a service status of POSTAL or Event is obsolete
	var service = Services.getValue(EventDetails_Service.dataBinding);
	var obsoleteFlag = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Obsolete");
	if ( service == ServiceStatuses.POSTAL || obsoleteFlag == "Y" )
	{
		return true;
	}
	return false;
}

EventDetails_ServiceDate.validateOn = [Master_COEventGrid.dataBinding, EventDetails_Date.dataBinding];
EventDetails_ServiceDate.validate = function()
{
	var ec = null;
	var serviceDate = Services.getValue(EventDetails_ServiceDate.dataBinding);

	if ( !CaseManUtils.isBlank(serviceDate) )
	{
		serviceDate = CaseManUtils.createDate( serviceDate );
		var eventDate = CaseManUtils.createDate( Services.getValue(EventDetails_Date.dataBinding) );	
		var serviceStatus = Services.getValue(EventDetails_Service.dataBinding);
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		
		if ( CaseManUtils.compareDates(eventDate, serviceDate) == -1 )
		{
			// The service date entered is before the date the event is created
			ec = ErrorCode.getErrorCode("CaseMan_ServiceDateBeforeEventDate_Msg");		
		}
		else if ( CaseManUtils.compareDates(today, serviceDate) == 1 && serviceStatus != ServiceStatuses.POSTAL )
		{
			// The date entered is in future and the service status is not POSTAL
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
	}

	return ec;
}

EventDetails_ServiceDate.logicOn = [EventDetails_ServiceDate.dataBinding];
EventDetails_ServiceDate.logic = function(event)
{
	if ( event.getXPath() != EventDetails_ServiceDate.dataBinding )
	{
		return;
	}
	
	// Change the Event's Status so server knows to update it accordingly
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	if ( statusCode == 0 || statusCode == UpdateCOCode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateCOCode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_CreditorName() {}
EventDetails_CreditorName.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_CreditorName.tabIndex = -1;
EventDetails_CreditorName.maxLength = 70;
EventDetails_CreditorName.helpText = "The name of the creditor linked to the event.";
EventDetails_CreditorName.componentName = "Creditor Name";
EventDetails_CreditorName.isTemporary = function() { return true; }
EventDetails_CreditorName.isReadOnly = function() { return true; }
EventDetails_CreditorName.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_CreditorName.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	
	var creditor = Services.getValue(EventDetails_CreditorName.dataBinding);
	return !CaseManUtils.isBlank(creditor);
}

/*********************************************************************************/

function EventDetails_BMSTask() {}
EventDetails_BMSTask.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_BMSTask.tabIndex = -1;
EventDetails_BMSTask.maxLength = 5;
EventDetails_BMSTask.helpText = "The BMS Task Number for the event";
EventDetails_BMSTask.componentName = "BMS Task";
EventDetails_BMSTask.isTemporary = function() { return true; }
EventDetails_BMSTask.isReadOnly = function() { return true; }
EventDetails_BMSTask.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_BMSTask.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_CreatedBy() {}
EventDetails_CreatedBy.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_CreatedBy.tabIndex = -1;
EventDetails_CreatedBy.maxLength = 30;
EventDetails_CreatedBy.helpText = "The user who created the event";
EventDetails_CreatedBy.componentName = "Created By";
EventDetails_CreatedBy.isTemporary = function() { return true; }
EventDetails_CreatedBy.isMandatory = function() { return true; }
EventDetails_CreatedBy.isReadOnly = function() { return true; }
EventDetails_CreatedBy.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_CreatedBy.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_CreatedBy.transformToDisplay = function(modelValue)
{
	var alias = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/UserAlias");
	if ( !CaseManUtils.isBlank(alias) )
	{
		modelValue = alias;
	}
	return modelValue;
}

/*********************************************************************************/

function EventDetails_Date() {}
EventDetails_Date.retrieveOn = [Master_COEventGrid.dataBinding];
EventDetails_Date.tabIndex = -1;
EventDetails_Date.maxLength = 11;
EventDetails_Date.helpText = "The date event took place";
EventDetails_Date.componentName = "Event Date";
EventDetails_Date.isTemporary = function() { return true; }
EventDetails_Date.isMandatory = function() { return true; }
EventDetails_Date.isReadOnly = function() { return true; }
EventDetails_Date.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.dataBinding];
EventDetails_Date.isEnabled = function()
{
	if ( !isCORecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function AddEvent_DateReceived() {}
AddEvent_DateReceived.tabIndex = 40;
AddEvent_DateReceived.maxLength = 11;
AddEvent_DateReceived.helpText = "Date when work received at court.";
AddEvent_DateReceived.isTemporary = function() { return true; }
AddEvent_DateReceived.isMandatory = function() { return true; }
AddEvent_DateReceived.validateOn = [AddEvent_Service.dataBinding];
AddEvent_DateReceived.validate = function()
{
	var ec = null;
	var dateReceived = Services.getValue(AddEvent_DateReceived.dataBinding);

	if ( !CaseManUtils.isBlank(dateReceived) )
	{
		dateReceived = CaseManUtils.createDate( dateReceived );
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		var monthAgo = CaseManUtils.oneMonthEarlier(today);
		var serviceStatus = Services.getValue(AddEvent_Service.dataBinding);
		
		if ( CaseManUtils.compareDates(today, dateReceived) == 1 && serviceStatus != ServiceStatuses.POSTAL )
		{
			// The date entered is in future and the service status is not POSTAL
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		
		// Check if date is more than 1 month in the past, if so give warning
		if (CaseManUtils.compareDates(monthAgo, dateReceived) == -1)
		{
			alert(Messages.DATEOVER1MONTH_MESSAGE);
		}
	}
	return ec;
}

/*********************************************************************************/

function AddEvent_EventId() {}
AddEvent_EventId.tabIndex = -1;
AddEvent_EventId.maxLength = 3;
AddEvent_EventId.helpText = "CO event ID code";
AddEvent_EventId.isTemporary = function() { return true; }
AddEvent_EventId.isMandatory = function() { return true; }
AddEvent_EventId.isReadOnly = function() { return true; }

/*********************************************************************************/

function AddEvent_EventDescription() {}
AddEvent_EventDescription.tabIndex = -1;
AddEvent_EventDescription.maxLength = 70;
AddEvent_EventDescription.helpText = "Description of the event";
AddEvent_EventDescription.isTemporary = function() { return true; }
AddEvent_EventDescription.isMandatory = function() { return true; }
AddEvent_EventDescription.isReadOnly = function() { return true; }

/*********************************************************************************/

function AddEvent_Stage() {}
AddEvent_Stage.srcData = XPathConstants.REF_DATA_XPATH + "/StageList";
AddEvent_Stage.rowXPath = "/Stage[./Value != 'S/S']";
AddEvent_Stage.keyXPath = "/Value";
AddEvent_Stage.displayXPath = "/Description";
AddEvent_Stage.tabIndex = 41;
AddEvent_Stage.helpText = "The issue stage for the event";
AddEvent_Stage.isTemporary = function() { return true; }
AddEvent_Stage.isMandatory = function() { return true; }
AddEvent_Stage.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/IssueStage"];
AddEvent_Stage.isEnabled = function()
{
	// Validation data decides if event has an Issue Stage
	var issueStageEnabled = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/IssueStage");
	return (issueStageEnabled == "true") ? true : false;
}

AddEvent_Stage.validateOn = [AddEvent_DateReceived.dataBinding];
AddEvent_Stage.validate = function()
{
	var ec = null;

	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( stage == IssueStages.REISSUE )
	{
		// Can only create an event with a stage of REISSUE if the same event currently exists with a stage of ISSUE
		var countEventNodes = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/IssueDetail/Events/Event[./Stage = '" + IssueStages.ISSUE + "']");
		if ( countEventNodes == 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_EventPreviouslyIssued_Msg");
		}
	}

	return ec;
}

AddEvent_Stage.logicOn = [AddEvent_Stage.dataBinding];
AddEvent_Stage.logic = function(event)
{
	if ( event.getXPath() != AddEvent_Stage.dataBinding )
	{
		return;
	}
	
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( !CaseManUtils.isBlank(stage) && null == AddEvent_Stage.validate() )
	{
		var defaultService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/ServiceType");
		Services.setValue(AddEvent_Service.dataBinding, defaultService);
	}
	else
	{
		Services.setValue(AddEvent_Service.dataBinding, "");
	}
}

/*********************************************************************************/

function AddEvent_Details() {}
AddEvent_Details.tabIndex = 42;
AddEvent_Details.maxLength = 500;
AddEvent_Details.helpText = "Event Details";
AddEvent_Details.isTemporary = function() { return true; }
AddEvent_Details.mandatoryOn = [AddEvent_Stage.dataBinding, XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/EditDetails"];
AddEvent_Details.isMandatory = function()
{
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( stage == IssueStages.SUBSERVICE )
	{
		// Details are mandatory if the stage is 'S/S'
		return true;
	}
	var detailsMandatory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/EditDetails");
	var lovDetailsMandatory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVMandatory");
	return ( detailsMandatory == "M" || lovDetailsMandatory == "true" ) ? true : false;
}

AddEvent_Details.readOnlyOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain"];
AddEvent_Details.isReadOnly = function()
{
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	return !CaseManUtils.isBlank(detailsLOV);
}

AddEvent_Details.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

AddEvent_Details.transformToModel = function(value)
{
	return (null != value) ? CaseManUtils.stripSpaces(value).toUpperCase() : null;
}

/*********************************************************************************/

function AddEvent_Service() {}
AddEvent_Service.srcData = XPathConstants.REF_DATA_XPATH + "/ServiceList";
AddEvent_Service.rowXPath = "/Service[./DisplayOnCreate != 'CG']";
AddEvent_Service.keyXPath = "/Value";
AddEvent_Service.displayXPath = "/Value";
AddEvent_Service.tabIndex = 44;
AddEvent_Service.helpText = "The service required for the event";
AddEvent_Service.isTemporary = function() { return true; }
AddEvent_Service.isMandatory = function() { return true; }
AddEvent_Service.enableOn = [AddEvent_Stage.dataBinding];
AddEvent_Service.isEnabled = function()
{
	// Disabled if stage is blank
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

AddEvent_Service.logicOn = [AddEvent_Service.dataBinding];
AddEvent_Service.logic = function(event)
{
	if ( event.getXPath() != AddEvent_Service.dataBinding )
	{
		return;
	}
	var service = Services.getValue(AddEvent_Service.dataBinding);
	if ( service != ServiceStatuses.BAILIFF )
	{
		// Clear the Bailiff field if service is not BAILIFF
		Services.setValue(AddEvent_BailiffId.dataBinding, "");
	}
}

/*********************************************************************************/

function AddEvent_BailiffId() {}
AddEvent_BailiffId.tabIndex = 45;
AddEvent_BailiffId.maxLength = 2;
AddEvent_BailiffId.helpText = "The Bailiff's area number.";
AddEvent_BailiffId.isTemporary = function() { return true; }
AddEvent_BailiffId.enableOn = [AddEvent_Service.dataBinding, AddEvent_Stage.dataBinding];
AddEvent_BailiffId.isEnabled = function()
{
	// Disabled if stage is blank
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( CaseManUtils.isBlank(stage) )
	{
		return false;
	}
	// Enabled if service is 'BAILIFF'
	var service = Services.getValue(AddEvent_Service.dataBinding);
	return service == ServiceStatuses.BAILIFF;
}

AddEvent_BailiffId.validate = function()
{
	var ec = null;
	var bailiffId = Services.getValue(AddEvent_BailiffId.dataBinding)
	if ( !CaseManValidationHelper.validateNumber(bailiffId) )
	{
		ec = ErrorCode.getErrorCode("CaseMan_nonNumericBailiffId_Msg");
	}
	return ec;
}

/*********************************************************************************/

function AddEvent_CreditorName() {}
AddEvent_CreditorName.srcData = XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts";
AddEvent_CreditorName.rowXPath = "Debt";
AddEvent_CreditorName.keyXPath = "DebtSeqNumber";
AddEvent_CreditorName.displayXPath = "CombiName";
AddEvent_CreditorName.strictValidation = true;
AddEvent_CreditorName.tabIndex = 46;
AddEvent_CreditorName.helpText = "The name of the creditor linked to the event.";
AddEvent_CreditorName.isTemporary = function() { return true; }
AddEvent_CreditorName.isMandatory = function() { return true; }
AddEvent_CreditorName.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/CreditorFieldEnabled", XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain", AddEvent_Details.dataBinding];
AddEvent_CreditorName.isEnabled = function()
{
	var lovDomain = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	if ( lovDomain == DetailsLOVDomains.EVT_111 )
	{
		// User must select a party from the Details LOV before creditor can be enabled
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( CaseManUtils.isBlank(detailsValue) )
		{
			// No selection made, disable creditor field
			return false;
		}
		else
		{
			// Enable creditor if selection is a CREDITOR
			return (detailsValue == "CREDITOR") ? true : false;
		}
	}
	else if ( lovDomain == DetailsLOVDomains.EVT_174 )
	{
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( CaseManUtils.isBlank(detailsValue) )
		{
			// No selection made, disable creditor field
			return false;
		}
		else
		{
			// Enable creditor if TCO27 is selected from the Tick Box LOV List
			return ( detailsValue.indexOf("TCO27") == -1 ) ? false : true;
		}
	}
	else
	{
		var enablementFlag = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/CreditorFieldEnabled");
		return (enablementFlag == "true") ? true : false;
	}
}

AddEvent_CreditorName.validateOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionValidDebtStatusCheck", AddEvent_DetailsLOVGrid.dataBinding];
AddEvent_CreditorName.validate = function()
{
	var ec = null;
	var creditor = Services.getValue(AddEvent_CreditorName.dataBinding);

	if ( !CaseManUtils.isBlank(creditor) )
	{
		// Check for validation on the debt status if the event specifies a specific valid status
		var chkValidDebtsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionValidDebtStatusCheck");
		if ( chkValidDebtsExist == "true" )
		{
			var debtStatus = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[./DebtSeqNumber = '" + creditor + "']/DebtStatus");
			var debtExistsInValidList = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ValidDebtStatuses[./ValidDebtStatus = '" + debtStatus + "']");
		
			if ( !debtExistsInValidList )
			{
				// Debt selected invalid for event, construct error message
				var validDebtStatusList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ValidDebtStatuses/ValidDebtStatus");
				var msgText = XML.getNodeTextContent(validDebtStatusList[0]);
				var l = validDebtStatusList.length;
				if ( l > 1 )
				{
					// Multiple missing events
					for ( var i=1; i<l; i++ )
					{
						var status = XML.getNodeTextContent(validDebtStatusList[i]);
						if ( i == (l-1) )
						{
							msgText = msgText + " or " + status;
						}
						else
						{
							msgText = msgText + ", " + status;
						}
					}
				}
				// Replace XXX in the error message with the list of missing events
				ec = ErrorCode.getErrorCode("CaseMan_CO_debtHasInvalidStatus_Msg");
				ec.m_message = ec.m_message.replace(/XXX/, msgText);
			}
		}
		
		// Check that if event 174 entered for CAEO CO & Details = TCO27 that Debt selected is linked to a Case Number
		if ( null == ec )
		{
			var eventId = Services.getValue(AddEvent_EventId.dataBinding);
			var coType = Services.getValue(Header_COType.dataBinding);
			var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
			var debtCaseNumber = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[./DebtSeqNumber = '" + creditor + "']/CaseNumber");
			
			if ( eventId == "174" && detailsValue.indexOf("TCO27") != -1 && coType == "CAEO" && CaseManUtils.isBlank(debtCaseNumber) )
			{
				ec = ErrorCode.getErrorCode("CaseMan_CO_CAEODebtHasNoCaseNumber_Msg");
			}
		}
		
	}
	return ec;
}

AddEvent_CreditorName.logicOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain", AddEvent_Details.dataBinding];
AddEvent_CreditorName.logic = function()
{
	var lovDomain = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	if ( lovDomain == DetailsLOVDomains.EVT_111 )
	{
		// Clear the creditor field if the LOV Parties List is changed to a non-creditor
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( detailsValue != "CREDITOR" )
		{
			Services.setValue(AddEvent_CreditorName.dataBinding, "");
		}
	}
	else if ( lovDomain == DetailsLOVDomains.EVT_174 )
	{
		// Clear the creditor field if the the Tick Box Event selected is not 'TCO27'
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( !CaseManUtils.isBlank(detailsValue) && detailsValue.indexOf("TCO27") == -1 )
		{
			Services.setValue(AddEvent_CreditorName.dataBinding, "");
		}
	}
}

/*********************************************************************************/

function AddEvent_EventDate() {}
AddEvent_EventDate.tabIndex = 48;
AddEvent_EventDate.maxLength = 11;
AddEvent_EventDate.helpText = "The date event took place";
AddEvent_EventDate.isTemporary = function() { return true; }
AddEvent_EventDate.isMandatory = function() { return true; }
AddEvent_EventDate.validateOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionPaymentDetailsExistCheck"];
AddEvent_EventDate.validate = function()
{
	var ec = null;
	var eventDate = Services.getValue(AddEvent_EventDate.dataBinding);

	if ( !CaseManUtils.isBlank(eventDate) )
	{
		eventDate = CaseManUtils.createDate( eventDate );
		var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );

		if ( CaseManUtils.compareDates(today, eventDate) == 1 )
		{
			// The date entered is in future
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		
		var chkPaymentValues = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionPaymentDetailsExistCheck");
		if ( null == ec && chkPaymentValues == "true" )
		{
			var firstPaymentDate = CaseManUtils.createDate( Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/FirstPaymentDate") );
			if ( CaseManUtils.compareDates(firstPaymentDate, eventDate) == 1 )
			{
				// First payment date cannot be earlier than event date
				ec = ErrorCode.getErrorCode("CaseMan_CO_FirstPaymentEatlierThanEventDate_Msg");
			}
		}
	}
	return ec;
}

/******************************** BUTTONS *****************************************/

function Query_OwningCourtLOVButton() {}
Query_OwningCourtLOVButton.tabIndex = 5;
Query_OwningCourtLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Query_OwningCourtLOVButton.isEnabled = function()
{
	return !isCORecordLoaded();
}

/**********************************************************************************/

function Query_SearchButton() {}
Query_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "manageCOEvents" } ]
	}
};
Query_SearchButton.tabIndex = 6;
Query_SearchButton.enableOn = [Query_CONumber.dataBinding, Query_OldCONumber.dataBinding, XPathConstants.FORM_STATE_XPATH];
Query_SearchButton.isEnabled = function()
{
	var coNumber = Services.getValue(Query_CONumber.dataBinding);
	var oldCONumber = Services.getValue(Query_OldCONumber.dataBinding);
	if ( CaseManUtils.isBlank(coNumber) && CaseManUtils.isBlank(oldCONumber) )
	{
		// No CO Number or Old CO Number entered in search
		return false;
	}
	else if ( null != Query_CONumber.validate() )
	{
		// CO Number entered is invalid
		return false;
	}
	else if ( isCORecordLoaded() && Services.countNodes(XPathConstants.QUERY_XPATH + "/Results/CoRecord") == 1 )
	{
		// Record is loaded, but only 1 record returned in search, disable button
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Query_SearchButton.actionBinding = function()
{
	if ( isCORecordLoaded() )
	{
		Services.dispatchEvent("QueryCO_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		var coNumber = Services.getValue(Query_CONumber.dataBinding);
		var oldCONumber = Services.getValue(Query_OldCONumber.dataBinding);
		var owningCourtCode = Services.getValue(Query_OwningCourtCode.dataBinding);
		var params = new ServiceParams();

		var paramValue = CaseManUtils.isBlank(coNumber) ? "" : coNumber;
		params.addSimpleParameter("coNumber", paramValue);

		var paramValue = CaseManUtils.isBlank(oldCONumber) ? "" : oldCONumber;
		params.addSimpleParameter("oldCoNumber", paramValue);

		var paramValue = CaseManUtils.isBlank(owningCourtCode) ? "" : owningCourtCode;
		params.addSimpleParameter("owningCourtCode", paramValue);

		Services.callService("searchCo", params, Query_SearchButton, true);	
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Query_SearchButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.QUERY_XPATH + "/Results", dom);
	var numberResults = Services.countNodes(XPathConstants.QUERY_XPATH + "/Results/CoRecord");
	if ( numberResults > 1 )
	{
		// Multiple records returned from query, launch popup
		Services.dispatchEvent("QueryCO_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if ( numberResults == 1 )
	{
		// Single record returned, skip the popup and load the data
		loadCORecord();
	}
	else
	{
		// No results returned
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setFocus("Query_CONumber");
	}
}

Query_SearchButton.onError = function(exception) {}

/**********************************************************************************/

function Master_PreviousButton() {}
Master_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "manageCOEvents", alt: true } ]
	}
};
Master_PreviousButton.tabIndex = 11;
Master_PreviousButton.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.CO_PAGENUMBER_XPATH];
Master_PreviousButton.isEnabled = function()
{
	if ( !isCORecordLoaded() )
	{
		return false;
	}
	
	// Disable Previous button if on first page
	var pageNumber = Services.getValue(XPathConstants.CO_PAGENUMBER_XPATH);
	if ( !CaseManUtils.isBlank(pageNumber) && parseInt(pageNumber) > 1 )
	{
		return true;
	}
	return false;
}

/**
 * @author rzxd7g
 * 
 */
Master_PreviousButton.actionBinding = function()
{
	// Decrement the page number
	var pageNumber = parseInt(Services.getValue(XPathConstants.CO_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.CO_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Dirty Flag Check
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		loadCORecord();
	}
}

/**********************************************************************************/

function Master_NextButton() {}
Master_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "manageCOEvents", alt: true } ]
	}
};
Master_NextButton.tabIndex = 12;
Master_NextButton.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventGrid.srcData];
Master_NextButton.isEnabled = function()
{
	if ( !isCORecordLoaded() )
	{
		return false;
	}
	
	var countRecords = Services.countNodes( Master_COEventGrid.srcData + "/" + Master_COEventGrid.rowXPath );
	if ( countRecords == COEventConstants.PAGE_SIZE )
	{
		return true;
	}
	return false;
}

/**
 * @author rzxd7g
 * 
 */
Master_NextButton.actionBinding = function()
{
	// Increment the page number
	var pageNumber = parseInt(Services.getValue(XPathConstants.CO_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.CO_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Dirty Flag Check
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		loadCORecord();
	}
}

/**********************************************************************************/

function Master_COEventLOVButton() {}
Master_COEventLOVButton.tabIndex = 15;
Master_COEventLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_COEventLOVButton.isEnabled = function()
{
	return isCORecordLoaded();
}

/**********************************************************************************/

function Master_AddCOEventButton() {}
Master_AddCOEventButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "manageCOEvents" } ]
	}
};
Master_AddCOEventButton.tabIndex = 16;
Master_AddCOEventButton.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_COEventId.dataBinding];
Master_AddCOEventButton.isEnabled = function()
{
	if ( !isCORecordLoaded() )
	{
		return false;
	}
	var eventId = Services.getValue(Master_COEventId.dataBinding);
	if ( CaseManUtils.isBlank(eventId) || !Services.getAdaptorById("Master_COEventId").getValid() )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Master_AddCOEventButton.actionBinding = function()
{
	var coNumber = Services.getValue(Query_CONumber.dataBinding);
	var eventId = Services.getValue(Master_COEventId.dataBinding);

	var params = new ServiceParams();
	params.addSimpleParameter("coNumber", coNumber);
	params.addSimpleParameter("eventId", eventId);
	Services.callService("getCoEventValidationData", params, Master_AddCOEventButton, true);
};

/**
 * @param dom
 * @author rzxd7g
 * @return null 
 */
Master_AddCOEventButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.EVENTVALIDATION_XPATH, dom);
	
	/********** ERROR MESSAGE CHECKS *************/
	var ec = null;

	// Perform Pre-requisite Event Checks
	var chkPreReqEvts = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionEventMustExist");
	var chkPreReqRspFiled = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionResponseFiledCheck");
	var chkPrevOrderRspTime = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionPreviousOrderResponseTimeCheck");
	
	if ( null == ec && ( chkPreReqEvts == "true" || chkPreReqRspFiled == "true" || chkPrevOrderRspTime == "true" ) )
	{
		// Check if any pre-requisite events DO exist
		var countPreReqEvts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/PreConditionEventsMustExist/Event[./RecordedAgainstCo = 'true']");
		
		// Check if any pre-requisite events have responses filed
		var countPreReqRspEvts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/PreConditionEventsMustExist/Event[./ResponseFiled = 'true']");
		
		if ( chkPreReqEvts == "true" && countPreReqEvts == 0 )
		{
			// No Pre-requisite events exist
			// Get a list of pre-requisite events that need exist against the CO
			var eventList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/PreConditionEventsMustExist/Event/EventId");
			var l = eventList.length;
			
			// Construct the error message dynamically
			var msgText = msgText = XML.getNodeTextContent(eventList[0]);
			if ( l > 1 )
			{
				// Multiple missing events
				for ( var i=1; i<l; i++ )
				{
					var eventId = XML.getNodeTextContent(eventList[i]);
					if ( i == (l-1) )
					{
						msgText = msgText + " or " + eventId;
					}
					else
					{
						msgText = msgText + ", " + eventId;
					}
				}
			}
			// Replace XXX in the error message with the list of missing events
			ec = ErrorCode.getErrorCode("CaseMan_EventPrerequisitesMissing_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, msgText);
		}
		else if ( chkPreReqRspFiled == "true" && countPreReqRspEvts > 0 )
		{
			// A pre-requisite event has had a response filed
			ec = ErrorCode.getErrorCode("CaseMan_responseHasBeenFiled_Msg");
		}
		else if ( chkPrevOrderRspTime == "true" )
		{
			// Get a list of all service dates for pre-req events where a response has NOT been filed
			var serviceDateList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/PreConditionEventsMustExist/Event[./ResponseFiled = 'false']/ServiceDate");
			var l = serviceDateList.length;

			if ( null != serviceDateList && l > 0 )
			{
				var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
				var eightDaysInPast = CaseManUtils.daysInPast(today, 8, true);
				
				for ( var i=0; i<l; i++ )
				{
					var serviceDateObj = XML.getNodeTextContent( serviceDateList[i] );
					if ( null != serviceDateObj )
					{
						var serviceDate = CaseManUtils.createDate(serviceDateObj);
						if ( null != serviceDate && CaseManUtils.compareDates(eightDaysInPast, serviceDate) == 1 )
						{
							// There was no response and the pre-requisite event is less than 8 days old
							ec = ErrorCode.getErrorCode("CaseMan_PrevOrderResponseNotExpired_Msg");
							break;		
						}
					}
				}
			}
		}
	}

	// Perform Valid CO Status Check
	var chkValidCOStatus = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionValidCOStatusCheck");
	if ( null == ec && chkValidCOStatus == "true" )
	{
		var currentStatus = Services.getValue(Header_COStatus.dataBinding);
		var validStatus = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ValidCOStatuses[./ValidCOStatus = '" + currentStatus + "']");
		if ( !validStatus )
		{
			// Current Status is not in the list of valid statuses for this event
			ec = ErrorCode.getErrorCode("CaseMan_CO_StatusNotValidForEvent_Msg");
		}
	}
	
	// Perform Payment Validation Checks
	var chkPaymentValues = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionPaymentDetailsExistCheck");
	if ( null == ec && chkPaymentValues == "true" )
	{
		var instalmentAmount = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/InstalmentAmount");
		var paymentFrequency = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/PaymentFrequency");
		var firstPaymentDate = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/FirstPaymentDate");
	
		if ( CaseManUtils.isBlank(instalmentAmount) )
		{
			// The Instalment Amount is blank
			ec = ErrorCode.getErrorCode("CaseMan_CO_InstalmentAmountBlank_Msg");		
		}
		else if ( CaseManUtils.isBlank(paymentFrequency) )
		{
			// The Payment Frequency is blank
			ec = ErrorCode.getErrorCode("CaseMan_CO_PaymentFrequencyBlank_Msg");
		}
		else if ( CaseManUtils.isBlank(firstPaymentDate) )
		{
			// The First Payment Date is blank
			ec = ErrorCode.getErrorCode("CaseMan_CO_FirstPaymentDateBlank_Msg");
		}
	}
	
	// Perform PER Details Validation Check
	var chkPERDetails = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PERDetailsRequired");
	if ( null == ec && chkPERDetails == "true" )
	{
		var PERDetailsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/PerNdrDetailsComplete");
		if ( PERDetailsExist == "N" )
		{
			// PER/NDR Details must exist but they are missing
			ec = ErrorCode.getErrorCode("CaseMan_PERNDRIncomplete_Msg");
		}
	}
	
	// Perform Employer Details Validation Check
	var chkEmpDetails = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/EmployerDetailsRequired");
	if ( null == ec && chkEmpDetails == "true" )
	{
		var EmpDetailsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/EmployerDetailsExist");
		if ( EmpDetailsExist == "false" )
		{
			// Employer Details must exist but they are missing
			ec = ErrorCode.getErrorCode("CaseMan_CO_employerDetsIncomplete_Msg");
		}
	}
	
	// Perform Employer Named Person Validation Check
	var chkEmpNPDetails = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/EmployersNamedPersonRequired");
	if ( null == ec && chkEmpNPDetails == "true" )
	{
		var EmpDetailsNPExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/EmployersNamedPersonExists");
		if ( EmpDetailsNPExist == "false" )
		{
			// Employer's Named Person must exist but they are missing
			ec = ErrorCode.getErrorCode("CaseMan_CO_namedPersonCannotBeBlank_Msg");
		}
	}

	// Perform Valid Debt Checks
	var chkValidDebtsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionValidDebtStatusCheck");
	if ( null == ec && chkValidDebtsExist == "true" )
	{
		var validDebtStatusList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ValidDebtStatuses/ValidDebtStatus");
		var validDebtExists = false;
		var l = validDebtStatusList.length;
	
		// Loop through all the valid statuses until debt(s) exist
		for (var i=0; i<l && !validDebtExists; i++ )
		{
			var tempStatus = XML.getNodeTextContent( validDebtStatusList[i] );
			var countDebts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Debts/Debt[./DebtStatus = '" + tempStatus + "']");
			validDebtExists = ( countDebts > 0 ) ? true : false;
		}
	
		if ( !validDebtExists )
		{
			// No Debts exist with the pre requisite status(es) required
			var msgText = XML.getNodeTextContent(validDebtStatusList[0]);
			if ( l > 1 )
			{
				// Multiple missing events
				for ( var i=1; i<l; i++ )
				{
					var status = XML.getNodeTextContent(validDebtStatusList[i]);
					if ( i == (l-1) )
					{
						msgText = msgText + " or " + status;
					}
					else
					{
						msgText = msgText + ", " + status;
					}
				}
			}
			// Replace XXX in the error message with the list of missing events
			ec = ErrorCode.getErrorCode("CaseMan_CO_noLiveValidStatusesDebtsOnCO_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, msgText);
		}
	}

	// Perform Debts Exist Validation
	var chkDebtsMustExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionDebtsMustExistCheck");
	if ( null == ec && chkDebtsMustExist == "true" )
	{
		var debtsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ExistingDebts");
		if ( debtsExist == "false" )
		{
			// No Debts exist on the CO Record
			ec = ErrorCode.getErrorCode("CaseMan_CO_noDebtsOnCO_Msg");
		}
	}

	// Perform Warrant Exists Validation
	var chkWarrantsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionWarrantExistsCheck");
	if ( null == ec && !CaseManUtils.isBlank(chkWarrantsExist) )
	{
		var warrantExists = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/WarrantData/WarrantExists");
		if ( warrantExists == "true" )
		{
			// The warrant the event is supposed to create already exists
			ec = ErrorCode.getErrorCode("CaseMan_CO_LiveWarrantTypeExists_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, chkWarrantsExist);
		}
	}

	// Perform Revoked/Discharged Date Set Validation
	var chkDischargedDateSet = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionDischargedDateSetCheck");
	if ( null == ec && chkDischargedDateSet == "true" )
	{
		var dischargeDate = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/ConsolidatedOrderDetails/CO/RevokedDischargedDate");
		if ( !CaseManUtils.isBlank(dischargeDate) )
		{
			// The revoked/discharge date has already been set
			ec = ErrorCode.getErrorCode("CaseMan_CO_RevokedDischargedDateSet_Msg");
		}
	}
	
	// Perform Check on Releasable Money in Court
	var chkReleasableMoney = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionReleasableMoneyCheck");
	if ( null == ec && chkReleasableMoney == "true" )
	{
		var releasableMoney = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/MoneyInCourt/ReleaseableMoney");
		var nonReleasableMoney = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/MoneyInCourt/NonReleaseableMoney");
		
		if ( releasableMoney != 0 )
		{
			// Releasable money in court
			ec = ErrorCode.getErrorCode("CaseMan_CO_ReleasableMoneyInCourt_Msg");
		}
		else if ( nonReleasableMoney != 0 )
		{
			// Non-releasable money in court
			var currencyCode = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/MoneyInCourt/Currency");
			var currencySymbol = CaseManUtils.transformCurrencySymbolToDisplay(currencyCode, null, "");
			var replacementString = currencySymbol + parseFloat(nonReleasableMoney).toFixed(2);
			
			ec = ErrorCode.getErrorCode("CaseMan_CO_NonReleasableMoneyInCourt_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, replacementString);
		}
	}
	
	/********** END ERROR MESSAGE CHECKS *************/

	if ( null == ec )
	{
		/********* PRE-REQUISITE EVENT WARNINGS CHECK *************/
	
		// If the event has event 920 as a pre-requisite event and that particular event DOES NOT exist
		// ask user to confirm they want to continue
		var eventPreReqWarning = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionEventMustExistWarning");
		if ( eventPreReqWarning == "true" )
		{
			// Check Event 920 missing
			var event920NotExist = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/PreConditionEventsMustExistWarning/Event[./EventId = 920 and ./RecordedAgainstCo = 'false']");
			if ( event920NotExist && !confirm(Messages.CO_NOADMINORDEREVENT_MESSAGE) )
			{
				// User does not wish to proceed
				return;
			}
		}
	
		/********** WARNING MESSAGE CHECKS *************/
	
		// Order Event - Hearing Date Passed Validation
		var chkOrderEvtHrgDate = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionHearingDateCheck");
		if ( chkOrderEvtHrgDate == "true" )
		{
			var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
			var countHearings = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Hearings/Hearing");
			
			for ( var i=1; i<=countHearings; i++ )
			{
				// Get the Hearing Date
				var hrgDate = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Hearings/Hearing[" + i + "]/HearingDate");
				var hrgDateObj = CaseManUtils.createDate( hrgDate );
				
				if ( CaseManUtils.compareDates(today, hrgDateObj) == 1 )
				{
					// The hearing has not yet passed, display dynamically generated warning message
					var hrgType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/Hearings/Hearing[" + i + "]/HearingType");
					var dispHrgDate = CaseManUtils.convertDateToDisplay(hrgDate);
					alert( Messages.format( Messages.HRGDATENOTPASSED_MESSAGE, Array(hrgType, dispHrgDate) ) );
				}
			}
		}
		
		// Check if money is in court for dividend
		var chkMoneyInCourt = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionMoneyInCourtCheck");
		if ( chkMoneyInCourt == "true" )
		{
			var amount = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/MoneyInCourt/ReleaseableMoney");
			if ( !CaseManUtils.isBlank(amount) && amount > 0 )
			{
				// Inform user how much money is in court
				var currency = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/MoneyInCourt/Currency");
				currency = CaseManUtils.transformCurrencySymbolToDisplay(currency, null, "");
				var msgStr = currency + amount;
				var tempArr = new Array
				alert( Messages.format( Messages.CO_MONEYFORDIVIDEND_MESSAGE, Array(msgStr) ) );
			}
		}
		
		// Check if a previous order has been served
		var chkPrevOrderServed = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/PreConditionPreviousOrderServedCheck");
		if ( chkPrevOrderServed == "true" )
		{
			var isServed = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoRelatedData/HasPreviousOrdersServed");
			if ( isServed == "true" )
			{
				// Warn user that a previous order has been served
				alert( Messages.PREVORDERNOTSERVED_MESSAGE );
			}
		}

		/********** END WARNING MESSAGE CHECKS *************/

		// Event is valid - raise the popup
		if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
		{
			Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CREATENEWEVENT);
			Status_SaveButton.actionBinding();
		}
		else
		{
			// Event is valid - raise the popup
			launchAddEventPopup();
		}
	}
	else
	{
		// Set the error message in the status bar
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
}

/**********************************************************************************/

function Status_SaveButton() {}
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "manageCOEvents" } ]
	}
};
Status_SaveButton.tabIndex = 30;
/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	// Check if Data has been loaded and data is dirty
	if ( isCORecordLoaded() && isDataDirty() )
	{
		// Validate the form
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if ( 0 != invalidFields.length )
		{
			Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
			return;
		}
		else
		{
			var dataNode = XML.createDOM(null, null, null);
			var node = Services.getNode(XPathConstants.DATA_XPATH)
			var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
			dataNode.appendChild(strippedNode);
	
			var params = new ServiceParams();
			params.addDOMParameter("coEvents", dataNode);
			Services.callService("updateCoEvents", params, Status_SaveButton, true);
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom)
{
	var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_SAVE_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, "");
	
	switch (tempAction)
	{
		case ActionAfterSave.ACTION_NAVIGATE:
			// User wishes to navigate following a save
			NavigationController.nextScreen();
			break;
			
		case ActionAfterSave.ACTION_CREATENEWEVENT:
			// User wishes to create a new event following a save
			launchAddEventPopup();
			break;
			
		case ActionAfterSave.ACTION_CLEARFORM:
			// User wishes to clear the form following a save
			clearFormData();
			break;
			
		case ActionAfterSave.ACTION_EXIT:
			// User wishes to exit the screen following a save
			exitScreen();
			break;
		
		case ActionAfterSave.ACTION_LOADNEWCO:
			// User loading a new record from query following a save
			loadNewCONumberFromQuery();
			break;
			
		default:
			// No actions to save, 
			loadCORecord();
	}
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
		loadCORecord();
	}
	else
	{
		exitScreen();
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
 * This exception handler is invoked when the user attempts to perform an
 * operation on a service but does not have the required roles e.g. a view only
 * user attempting to save changes made in the screen.
 * @param exception
 * @author rzxd7g
 * 
 */
Status_SaveButton.onAuthorizationException = function(exception) 
{
	handleAuthorizationException(exception);
}

/**********************************************************************************/

function Status_ClearButton() {}
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "manageCOEvents", alt: true } ]
	}
};
Status_ClearButton.tabIndex = 31;
/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	// Additional clear required to remove relevant app params
	// Workaround until enhancement available on the Clear lifecycle to clear additional nodes
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_CLEARFORM);
		Status_SaveButton.actionBinding();
	}
	else
	{
		clearFormData();
	}
}

/**********************************************************************************/

function Status_CloseButton() {}
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "manageCOEvents" } ]
	}
};
Status_CloseButton.tabIndex = 42;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;

/**********************************************************************************/

function AddEvent_DetailsLOVButton() {}
AddEvent_DetailsLOVButton.tabIndex = 43;
AddEvent_DetailsLOVButton.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain"];
AddEvent_DetailsLOVButton.isEnabled = function()
{
	// Disable the Details LOV button if there is no list of values
	var detailsDomain = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	return CaseManUtils.isBlank(detailsDomain) ? false : true;
}

/**
 * @author rzxd7g
 * 
 */
AddEvent_DetailsLOVButton.actionBinding = function()
{
	var lovDomain = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	if ( lovDomain == DetailsLOVDomains.EVT_174 )
	{
		// For Tick Box Events, concatenate the code and the description selected
		Services.dispatchEvent("AddEvent_DetailsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if ( lovDomain == DetailsLOVDomains.EVT_111 )
	{
		// Debtor/Creditor/Employer list in the Details LOV
		Services.dispatchEvent("AddEvent_PartyDetailsLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/**********************************************************************************/

function AddEvent_CreditorLOVButton() {}
AddEvent_CreditorLOVButton.tabIndex = 47;
AddEvent_CreditorLOVButton.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/CreditorFieldEnabled", XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain", AddEvent_Details.dataBinding];
AddEvent_CreditorLOVButton.isEnabled = function()
{
	var lovDomain = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/DetailsLOVDomain");
	if ( lovDomain == DetailsLOVDomains.EVT_111 )
	{
		// User must select a party from the Details LOV before creditor can be enabled
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( CaseManUtils.isBlank(detailsValue) )
		{
			// No selection made, disable creditor field
			return false;
		}
		else
		{
			// Enable creditor if selection is a CREDITOR
			return (detailsValue == "CREDITOR") ? true : false;
		}
	}
	else if ( lovDomain == DetailsLOVDomains.EVT_174 )
	{
		var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
		if ( CaseManUtils.isBlank(detailsValue) )
		{
			// No selection made, disable creditor field
			return false;
		}
		else
		{
			// Enable creditor if TCO27 is selected from the Tick Box LOV List
			return ( detailsValue.indexOf("TCO27") == -1 ) ? false : true;
		}
	}
	else
	{
		var enablementFlag = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CoEventConfiguration/CreditorFieldEnabled");
		return (enablementFlag == "true") ? true : false;
	}
}

/**********************************************************************************/

function AddEvent_SaveButton() {}
AddEvent_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "AddEvent_Popup" } ]
	}
};
AddEvent_SaveButton.tabIndex = 49;
AddEvent_SaveButton.validationList = ["AddEvent_DateReceived","AddEvent_Stage","AddEvent_Details","AddEvent_Service","AddEvent_BailiffId","AddEvent_CreditorName","AddEvent_EventDate"];
AddEvent_SaveButton.enableOn = [AddEvent_DateReceived.dataBinding,AddEvent_Stage.dataBinding,AddEvent_Details.dataBinding,AddEvent_Service.dataBinding,AddEvent_BailiffId.dataBinding,AddEvent_CreditorName.dataBinding,AddEvent_EventDate.dataBinding];
AddEvent_SaveButton.isEnabled = function()
{
	// Disabled if any mandatory fields are blank or any invalid fields
	if ( !CaseManValidationHelper.validateFields(AddEvent_SaveButton.validationList, true) )
	{
		return false;
	}
	
	// Check the permanently mandatory fields are not blank
	var dateReceived = Services.getValue(AddEvent_DateReceived.dataBinding);
	var eventDate = Services.getValue(AddEvent_EventDate.dataBinding);
	if ( CaseManUtils.isBlank(dateReceived) || CaseManUtils.isBlank(eventDate) )
	{
		return false;
	}
	
	// Check the Issue Stage field is not blank (if mandatory)
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( AddEvent_Stage.isEnabled() && CaseManUtils.isBlank(stage) )
	{
		return false;
	}
	
	// Check the Details field is not blank (if mandatory)
	var details = Services.getValue(AddEvent_Details.dataBinding);
	if ( AddEvent_Details.isMandatory() && CaseManUtils.isBlank(details) )
	{
		return false;
	}
	
	// Check the Service field is not blank (if mandatory)
	var service = Services.getValue(AddEvent_Service.dataBinding);
	if ( AddEvent_Service.isEnabled() && CaseManUtils.isBlank(service) )
	{
		return false;
	}
	
	// Check the Creditor field is not blank (if mandatory)
	var creditor = Services.getValue(AddEvent_CreditorName.dataBinding);
	if ( AddEvent_CreditorName.isEnabled() && CaseManUtils.isBlank(creditor) )
	{
		return false;
	}
	
	return true;
}

/**
 * @author rzxd7g
 * 
 */
AddEvent_SaveButton.actionBinding = function()
{
	if ( AddEvent_SaveButton.isEnabled() )
	{
		Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	
		var newEvent = Services.loadDOMFromURL("NewCOEvent.xml");
		newEvent.selectSingleNode("/COEvent/CONumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Query_CONumber.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/StandardEventId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventId.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/StandardEventDescription").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventDescription.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/EventDetails").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Details.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/EventDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventDate.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/IssueStage").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Stage.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/Service").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Service.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/BailiffId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_BailiffId.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/DebtSeqNumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_CreditorName.dataBinding) ) ) );

		// Calculate the default service date if the service status POSTAL
		var serviceDate = (Services.getValue(AddEvent_Service.dataBinding) == ServiceStatuses.POSTAL) ? calculatePostalServiceDate() : "";
		var userId = Services.getCurrentUser();
		newEvent.selectSingleNode("/COEvent/ServiceDate").appendChild( newEvent.createTextNode( serviceDate ) );
		newEvent.selectSingleNode("/COEvent/UserName").appendChild( newEvent.createTextNode( userId ) );
		newEvent.selectSingleNode("/COEvent/ReceiptDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_DateReceived.dataBinding) ) ) );
		newEvent.selectSingleNode("/COEvent/OwningCourtCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Query_OwningCourtCode.dataBinding) ) ) );

		// Added Debtor Name (CaseMan Defect 5772)
		newEvent.selectSingleNode("/COEvent/DebtorName").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_DebtorName.dataBinding) ) ) );

		clearAddEventFields();
	
		// Call the service
		var params = new ServiceParams();
		params.addDOMParameter("coEvent", newEvent);
		Services.callService("addCoEvent", params, AddEvent_SaveButton, true);
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
AddEvent_SaveButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.EVENTNAVIGATION_XPATH, dom);
	
	var caseStatusChanged = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NewCOStatus");
	if ( !CaseManUtils.isBlank(caseStatusChanged) )
	{
		// The CO Status has changed, need to display a message
		Services.setValue(ManageCOEventsParams.CO_STATUS, caseStatusChanged)
	}
	
	// Determine if have to navigate to the Word Processing or Oracle Reports screens
	var navigateToWP = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/WordProcessing");
	var navigateToOR = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/OracleReport");
	
	if ( navigateToWP == "true"  && navigateToOR == "true")
	{
		// Navigating to both Word Processing and Oracle Reports
		
		// Set Oracle Report Court Code to the owning court of the case record loaded TRAC 2446
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Query_OwningCourtCode.dataBinding) );
		
		var wpDom = XML.createDOM(null, null, null);
		Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[1]/Request", "Create");
		var wpNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH+ "/Params/WordProcessing[1]" ); 
		wpDom.appendChild( wpNode );
		WP.ProcessWP(FormController.getInstance(), wpDom, NavigationController.CO_EVENTS_FORM, true);
		
		Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[last()]/Request", "Create");
		var orNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[last()]");
		var orDom = XML.createDOM();
		orDom.loadXML(orNode.xml);
		WP.ProcessORA(FormController.getInstance(), orDom, NavigationController.CO_EVENTS_FORM, true);
	}
	else if ( navigateToOR == "true" )
	{
		// Navigating to Oracle Reports only
		
		// Set Oracle Report Court Code to the owning court of the case record loaded TRAC 2446
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Query_OwningCourtCode.dataBinding) );
		
		Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing/Request", "Create");
		var orNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing");
		var orDom = XML.createDOM();
		orDom.loadXML(orNode.xml);
		WP.ProcessORA(FormController.getInstance(), orDom, NavigationController.CO_EVENTS_FORM, true);
	}
	else if ( navigateToWP == "true")
	{
		// Navigating to Word Processing Only
		var wpDom = XML.createDOM(null, null, null);
		Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing/Request", "Create");
		var wpNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH+ "/Params/WordProcessing" ); //
		wpDom.appendChild( wpNode );
		WP.ProcessWP(FormController.getInstance(), wpDom, NavigationController.CO_EVENTS_FORM, false);
	}
	
	if ( navigateToWP != "true" && navigateToOR != "true" )
	{
		// No need to navigate anywhere, refresh screen
		loadCORecord();
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
AddEvent_SaveButton.onAuthorizationException = function(exception) 
{
	handleAuthorizationException(exception);
}

/**********************************************************************************/

function AddEvent_CancelButton() {}
AddEvent_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddEvent_Popup" } ]
	}
};
AddEvent_CancelButton.tabIndex = 50;
/**
 * @author rzxd7g
 * 
 */
AddEvent_CancelButton.actionBinding = function()
{
	Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	clearAddEventFields();
};

/**********************************************************************************/

function QueryPopup_OkButton() {}
QueryPopup_OkButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "QueryPopup_CONumberGrid"} ]
	}
};
QueryPopup_OkButton.tabIndex = 61;
/**
 * @author rzxd7g
 * 
 */
QueryPopup_OkButton.actionBinding = function()
{
	if ( isCORecordLoaded() )
	{
		var currentCONumber = Services.getValue(Query_CONumber.dataBinding);
		var selectedCONumber = Services.getValue(QueryPopup_CONumberGrid.dataBinding);
		
		if ( currentCONumber == selectedCONumber )
		{
			// Same record selected, lower popup without loading the data again
			Services.dispatchEvent("QueryCO_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		}
		else
		{
			// New record selected
			if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
			{
				Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_LOADNEWCO);
				Status_SaveButton.actionBinding();
			}
			else
			{
				loadNewCONumberFromQuery();
			}
		}
	}
	else
	{
		Services.dispatchEvent("QueryCO_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		loadCORecord();	
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
QueryPopup_OkButton.onSuccess = function(dom)
{
	if( null != dom )
	{
		// Insert the main node
		Services.startTransaction();
		Services.replaceNode(XPathConstants.DATA_XPATH, dom);
		Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_MODIFY);
		Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "");
		
		// Set the grid to point at the new event if one has just been created
		var newEventId = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/COEventSeq");
		if ( !CaseManUtils.isBlank(newEventId) )
		{
			Services.setValue(Master_COEventGrid.dataBinding, newEventId);
			Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/COEventSeq", "");
		}
		
		var newCOStatus = Services.getValue(ManageCOEventsParams.CO_STATUS);
		if ( !CaseManUtils.isBlank(newCOStatus) )
		{
			// CO Status has changed, display message in status bar
			var ec = ErrorCode.getErrorCode("CaseMan_CO_StatusChanged_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, newCOStatus);
			Services.setTransientStatusBarMessage( ec.getMessage() );
			Services.setValue(ManageCOEventsParams.CO_STATUS, "");
		}
		
		// Clear the Oracle Report Court Code constant when load case events in QueryPopup_OkButton.onSuccess() TRAC 2446
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, "");
		
		Services.endTransaction();
	}
}

/**********************************************************************************/

function QueryPopup_CancelButton() {}
QueryPopup_CancelButton.tabIndex = 62;

/******************************* LOGIC DIVS ***************************************/

/**
 * Logic handles any additional processing that must occur when the form
 * changes state e.g. from modify to clear.  The code is in here because
 * the framework's form lifecycle solution is currently inadequate to 
 * meet our requirements.
 * @author rzxd7g
 * 
 */
function formLifecycleStateLogic() {}
formLifecycleStateLogic.logicOn = [XPathConstants.FORM_STATE_XPATH];
formLifecycleStateLogic.logic = function(event)
{
	if ( event.getXPath() != XPathConstants.FORM_STATE_XPATH )
	{
		return;
	}

	if ( Services.getValue(XPathConstants.FORM_STATE_XPATH) == FormStates.STATE_BLANK && 
		 !CaseManUtils.isBlank( Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH) ) )
	{
		var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
		Services.setValue(Query_OwningCourtCode.dataBinding, owningCourt);
	}
}

/************************** SUPER LOGIC DIVS **************************************/

/**
 * Logic to replace the framework's wordprocessor launch when double click the grid
 * Is a Super Logic GUI Adaptor that we can control ourselves
 * @author rzxd7g
 * 
 */
function launchOutputLogic() {}
launchOutputLogic.additionalBindings = {
	eventBinding: {
		singleClicks: [],
		doubleClicks: [ {element: "Master_COEventGrid"} ],
		keys: []
	}
};
launchOutputLogic.logic = function()
{
	var countOutputs = Services.countNodes(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output");
	if ( countOutputs == 1 )
	{
		var outputId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/OutputId");
		var outputType = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Type");
		
		if ( outputType == "WP" )
		{
			// Call Word Processing		
			// Prepare the Word Processing Node
			/*
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Request", "Open");
			var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output");
			var wpDom = XML.createDOM();
			wpDom.loadXML(wpNode.xml);
			WP.ProcessWP(FormController.getInstance, wpDom, NavigationController.CO_EVENTS_FORM, false);
			*/
			var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/DocumentId");
			if (null == documentId || documentId == "")
			{
				Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Request", "Create");
			}
			else
			{
				Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Request", "Open");
			}

			var eventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/COEventSeq");
			var eventStdId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId");
			var coNumber = Services.getValue(Query_CONumber.dataBinding);
			var debtSeq =  Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/DebtSeqNumber");
			
			var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output");
			var wpDom = XML.createDOM();
			wpDom.loadXML(wpNode.xml);
			
			var txDOM = XML.createDOM();
			txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
	          "<xsl:output method='xml' indent='yes' />" +
	          "<xsl:template match='Output'>" +
	               "<WordProcessing>" +
	               		"<Event>" +
		               		"<COEventSeq>" + eventSeq + "</COEventSeq>" +
	               			"<StandardEventId>" + eventStdId + "</StandardEventId>" +
	               			"<CONumber>" + coNumber + "</CONumber>" +
	               			"<DebtSeqNumber>" + debtSeq + "</DebtSeqNumber>"+
	               		"</Event>" +
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
			WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.CO_EVENTS_FORM, false);
			
		}
		else if ( outputType == "OR" )
		{
			// Call Oracle Reports
			var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/DocumentId");
			//var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Description"); defect 6039 replaced with line below
			var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/ReportId");
			var orderId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/OutputId");
			var params = new ServiceParams();
			var dom = XML.createDOM();
			var fWReportIDElement = dom.createElement("FWReportId");
			fWReportIDElement.appendChild(dom.createTextNode(reportId));
			
			var orderIDElement = dom.createElement("OrderId");
			orderIDElement.appendChild(dom.createTextNode(orderId));				
			
			var suitorsCashReportElement = dom.createElement("SuitorsCashReport");
			suitorsCashReportElement.appendChild(fWReportIDElement);
			suitorsCashReportElement.appendChild(orderIDElement);
			
			var paramNode = XML.createDOM();
			paramNode.appendChild(suitorsCashReportElement);
			
			params.addDOMParameter("ReprintReport", paramNode);
			Services.callService("reprintReport", params, ReprintOracleReport, null);				
		}
	}
	else if ( countOutputs > 1 )
	{
		// Launch the subform
		Services.dispatchEvent("selectEventOutput_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

function ReprintOracleReport() {}
/**
 * @param resultDom
 * @author rzxd7g
 * 
 */
ReprintOracleReport.onSuccess = function(resultDom)
{
	alert("Report Printed.");
}
