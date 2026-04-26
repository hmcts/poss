/** 
 * @fileoverview ManageAEEvents.js:
 * This file contains the form and field configurations for the UC092 - Manage AE 
 * Events screen.
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 05/06/2006 - Chris Vincent, changed global variables to static variables.
 * 13/06/2006 - Chris Vincent, made some changes to the section where Oracle Reports
 *				called to use CaseManFormParameters.ORNODE_XPATH instead of WPNODE_XPATH
 *				for when both Oracle Reports and Word Processing are called for an event.
 * 14/06/2006 - Anoop Sehdev, changed way in which WP is called when double clicking on grid.
 * 14/06/2006 - Chris Vincent, changed the transform to models to remove trailing
 *				and leading whitespace on the two Event Details fields.
 * 26/07/2006 - Chris Vincent, added Previous and Next buttons to allow paging on the ae events
 * 				screen.  100 records at a time are returned.  Ref - defect 4018.
 * 26/07/2006 - Chris Vincent, change made for defect 4021.  When creating a new event with dirty data,
 * 				the dirty flag check and subsequent save occurs after the validation service is called
 * 				which could mean validation occurs on the previous data.  Validation now occurs after
 * 				the dirty flag check and subsequent save.
 * 28/07/2006 - Chris Vincent, fixed defect 4030.  The error message CaseMan_AE_OutstandingAEOnePence_Msg
 * 				was not invoked because the client and server node names did not match.  In Chrs Hutt's 
 * 				absence, the fix involved changing the client side node.  The amount test was also updated
 *				so error occurs if amount is less than or equal to a penny to match the error message.
 * 03/08/2006 - Chris Vincent, as part of pagination defect (4018), issue stage validation referencing existing
 * 				events had to be changed, as not all existing events may be available in the DOM.  Data 
 * 				returned in getValidationData service so xpaths in AddEvent_Stage.validate + logic updated. 
 * 22/08/2006 - Chris Vincent, fixed defect 4566 where when a new event is added and the event description field
 * 				is invalid, the invalid value is not filtered through to the add popup.
 * 05/09/2006 - Chris Vincent, added condition to AddEvent_Details.isMandatory function so is always mandatory
 * 				if there is a LOV associated with the Details field.  Defect 5092.
 * 05/09/2006 - Chris Vincent, added validation to the AE Number field to ensure the 'existing case' AE number
 * 				format is catered for.  Defect 5094.
 * 05/09/2006 - Paul Roberts, defect 5060 - handling of apostrophes.
 * 11/10/2006 - Frederik Vandendriessche, post build x issue 24 - handling reopening of ae event outputs
 * 13/11/2006 - Gareth Lewis, Build Z issue 142 - AE Events with Maintain Obligations showing broken output icon
 * 04/01/2007 - Chris Vincent, Temp_CaseMan defect 356 fixed by adding additional checks for the error message
 * 				CaseMan_AE_EmpAddressIncomplete_Msg as some events don't require the Employer Named Person.
 * 24/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 22/03/2007 - Chris Vincent, added EventDetails_CreatedBy.transformToDisplay() to display the User Alias instead
 * 				of the User Id if present in DCA_USER otherwise user id is displayed.  CaseMan Defect 6000.
 * 23/11/2006 - Mark Groen, fixing CaseMan defect 6039. This concerns reprinting reports and the user requiring 
 *				more detail in the selectEventOutput_subform. A correct description is now returned by the service
 *				and an addition tag now holds the ReportId.  Changed this file so it sends the correct detail to 
 *				the reprintReport service.
 * 15/01/2009 - Sandeep Mullangi - ServiceDays changes RFC0655
 * 10/02/2010 - Mark Groen,  AddEvent_SaveButton.onSuccess(), set Oracle Report Court Code constant TRAC 2446
 *				EventDetails_Service.onSuccess(), set Oracle Report Court Code constant TRAC 2446
 *				lear the Oracle Report Court Code constant when load case events in QueryPopup_OkButton.onSuccess()	
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.	
 * 09/12/2015 - Chris Vincent, Trac 5719.  AE Number validation changes to allow old and new formats.
 * 12/10/2016 - Chris Vincent. Trac 5883. Adding juridiction node to WordProcessing XML
 * 14/10/2016 - Chris Vincent (Trac 5880). Added warning when party on case has requested confidentiality.
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
XPathConstants.DATA_XPATH = "/ds/ManageAEEvents";
XPathConstants.SELECTED_EVENT_XPATH = XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = /ds/var/page/SelectedGridRow/AEEvent]";
XPathConstants.NEWEVENT_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/NewEvent";
XPathConstants.QUERY_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Query";
XPathConstants.EVENTDATA_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/EventData";
XPathConstants.EVENTVALIDATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/AeEventValidationData";
XPathConstants.EVENTNAVIGATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/AeEventNavigationList";
XPathConstants.FORM_STATE_XPATH = XPathConstants.VAR_FORM_XPATH + "/CurrentForm/state"
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.TEMP_PERDETAILS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/PERNDRDetails";
XPathConstants.MAGSORDER_IND_XPATH = XPathConstants.VAR_FORM_XPATH + "/Tmp/MAGSOrderCase";
XPathConstants.DIRTYFLAG_XPATH = XPathConstants.VAR_PAGE_XPATH + "/DirtyFlag";
XPathConstants.PERSTATUS_XPATH = XPathConstants.TEMP_PERDETAILS_XPATH + "/Status";
XPathConstants.ACTION_AFTER_SAVE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ActionAfterSave";
XPathConstants.ACTION_AFTER_RET_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp/ActionAfterRetrieval";
XPathConstants.AE_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
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
 * Enumeration of AE Event Status Code (Helps update service identify the changes made)
 * @author rzxd7g
 * 
 */
function UpdateAECode() {};
UpdateAECode.STATUSCODE_DETSCHANGED = 1;
UpdateAECode.STATUSCODE_ERRCHANGED = 2;
UpdateAECode.STATUSCODE_NOTSERVED = 4;
UpdateAECode.PERSTATUS_DETSCHANGED = "DETS_CHANGED";

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
ActionAfterSave.ACTION_LOADNEWAE = "LOAD_NEW_AE";
ActionAfterSave.ACTION_PERREPORT = "RUN_PER_REPORT";

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
 * Static Class representing AE Event Constants e.g. the default page size
 * @author rzxd7g
 * 
 */
function AEEventConstants() {};
AEEventConstants.PAGE_SIZE = 100;
AEEventConstants.ORA_REPS_NO_REPRINT = ['N64', 'P851', 'P851-I', 'P851-R', 'P851-S', 'P871', 'P871-X', 'P880', 'P883'];

/****************************** MAIN FORM *****************************************/

function manageAEEvents() {}

/**
 * @author rzxd7g
 * 
 */
manageAEEvents.initialise = function()
{
	var extCaseNumber = CaseManUtils.getValidNodeValue( Services.getValue(ManageAEEventsParams.CASE_NUMBER) );
	var extAENumber = CaseManUtils.getValidNodeValue( Services.getValue(ManageAEEventsParams.AE_NUMBER) );
	if ( !CaseManUtils.isBlank(extCaseNumber) || !CaseManUtils.isBlank(extAENumber) )
	{
		// Screen has been passed either a Case Number or an AE Number or both
		Services.setValue(XPathConstants.DATA_XPATH + "/CaseNumber", extCaseNumber);
		Services.setValue(XPathConstants.DATA_XPATH + "/AENumber", extAENumber);
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
 * onSucess to handle the retrieval of reference data that is lazy loaded
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
manageAEEvents.onSuccess = function(dom, serviceName)
{
	switch (serviceName)
	{
		case "getAeEventList":
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
		case "getCalculatedPeriods":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CalculatedPeriods", dom);
			break;
		case "getCurrentCurrency":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency", dom);
			break;
	}
}

// Load the reference data from the xml into the model (only load what is required when enter screen)
manageAEEvents.refDataServices = [
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
		// Prepare the Word Processing Node
		var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		if (null == documentId || documentId == "")
		{
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Create");
		}
		else
		{
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Open");
		}
		var eventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/EventSeq");
		var AEEventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/AEEventSeq");		
		var eventStdId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId");
		var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
		var aeType = Services.getValue(XPathConstants.DATA_XPATH + "/ApplicationType");
		var aeNumber = Services.getValue(Query_AENumber.dataBinding);
		var jurisdiction = Services.getValue(XPathConstants.DATA_XPATH + "/Jurisdiction");
		var welshParties = Services.getValue(XPathConstants.DATA_XPATH + "/WelshParties");
		var welshEmployer = Services.getValue(XPathConstants.DATA_XPATH + "/WelshEmployer");
		if ( welshEmployer == "Y" ) { welshParties = "Y"; }
		
		var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		var txDOM = XML.createDOM();
		/** 
		   Note the addition of AEEventSeq - required for transaction integrity fix to work
		   Note that CaseEventSeq remains to contain the ae event seq, as to not to break the current loading
		**/
		txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
          "<xsl:output method='xml' indent='yes' />" +
          "<xsl:template match='Output'>" +
               "<WordProcessing>" +
               		"<Event>" +
	             		"<CaseEventSeq>" + AEEventSeq + "</CaseEventSeq>" + 
	             		"<AEEventSeq>" + AEEventSeq + "</AEEventSeq>" +
               			"<StandardEventId>" + eventStdId + "</StandardEventId>" +
               			"<AENumber>" + aeNumber + "</AENumber>" +
               		"</Event>" +
               		"<Case>" +
	               		"<CaseNumber>" + caseNumber + "</CaseNumber>" +
               			"<CaseType>" + aeType + "</CaseType>" +
						"<Jurisdiction>" + jurisdiction + "</Jurisdiction>" +
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
		WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.AE_EVENTS_FORM, false);	
	}
	else if ( outputType == "OR" )
	{
		// Call Oracle Reports
		var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/ReportId");
		var orderId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/OutputId");
		
		if ( isOraReportReprinted(orderId) )
		{
			// Can be reprinted
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
		else
		{
			// Should be opened in an Adobe Acrobat Reader Window
			Services.showDocument(documentId, documentId);
		}
	}
}

/**
 * @author rzxd7g
 * @return "Master_AEEventGrid"  
 */
selectEventOutput_subform.nextFocusedAdaptorId = function() 
{
	return "Master_AEEventGrid";
}

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/********************************** POPUPS *****************************************/

function QueryAE_Popup() {};
QueryAE_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "QueryPopup_CancelButton"} ],
		keys: [ { key: Key.F4, element: "QueryAE_Popup" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_AEEventGrid"  
 */
QueryAE_Popup.nextFocusedAdaptorId = function() {
	return "Master_AEEventGrid";
}

/*********************************************************************************/

function AddEvent_Popup() {};
/**
 * @author rzxd7g
 * @return "Master_AEEventGrid"  
 */
AddEvent_Popup.nextFocusedAdaptorId = function() {
	return "Master_AEEventGrid";
}

/*********************************************************************************/

function PERNDRDetails_Popup() {};
/**
 * @author rzxd7g
 * 
 */
PERNDRDetails_Popup.prePopupPrepare = function()
{
	// Load the reference data required for the PER/NDR popup
	loadPERNDRReferenceData();

	// Transfer the Data Node to the Popup
	var dataPERNode = Services.getNode(XPathConstants.DATA_XPATH + "/PERNDRDetails");
	Services.replaceNode(XPathConstants.TEMP_PERDETAILS_XPATH, dataPERNode);
}

PERNDRDetails_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "Header_PERNDRButton"} ]
	}
};

PERNDRDetails_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "PERNDRDetailsPopup_CancelButton"} ],
		keys: [ { key: Key.F4, element: "PERNDRDetails_Popup" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_AEEventGrid"  
 */
PERNDRDetails_Popup.nextFocusedAdaptorId = function() {
	return "Master_AEEventGrid";
}

/******************************** LOV POPUPS ***************************************/

function Query_OwningCourtLOVGrid() {};
Query_OwningCourtLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubFormGrids/SelectedCourt";
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

function Master_AEEventLOVGrid() {};
Master_AEEventLOVGrid.srcDataOn = [XPathConstants.MAGSORDER_IND_XPATH];
Master_AEEventLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/LOVSubFormGrids/SelectedEvent";
Master_AEEventLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_AEEventLOVGrid.rowXPath = "StandardEvent[./StandardEventId = '999' or ./MagsEvent = " + XPathConstants.MAGSORDER_IND_XPATH + "]";
Master_AEEventLOVGrid.keyXPath = "StandardEventId";
Master_AEEventLOVGrid.columns = [
	{xpath: "StandardEventId", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "StandardEventDescription"}
];

Master_AEEventLOVGrid.styleURL = "/css/StandardEventsLOVGrid.css";
Master_AEEventLOVGrid.destroyOnClose = false;
Master_AEEventLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_AEEventLOVButton"} ],
		keys: [ { key: Key.F6, element: "Master_AEEventId" }, { key: Key.F6, element: "Master_AEEventDescription" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_AEEventId"  
 */
Master_AEEventLOVGrid.nextFocusedAdaptorId = function() {
	return "Master_AEEventId";
}

Master_AEEventLOVGrid.logicOn = [Master_AEEventLOVGrid.dataBinding];
Master_AEEventLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(Master_AEEventLOVGrid.dataBinding) == -1 )
	{
		return;
	}
	
	var eventId = Services.getValue(Master_AEEventLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(eventId) )
	{
		// Set the Event Id field and blank the LOV Subform's databinding
		Services.startTransaction();
		Services.setValue(Master_AEEventId.dataBinding, eventId);
		Services.setValue(Master_AEEventLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function AddEvent_DetailsLOVGrid() {};

AddEvent_DetailsLOVGrid.dataBinding = XPathConstants.NEWEVENT_XPATH + "/LOVDetails";
AddEvent_DetailsLOVGrid.srcData = XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/LOVDetails/Options";
AddEvent_DetailsLOVGrid.rowXPath = "Option";
AddEvent_DetailsLOVGrid.keyXPath = "Code";
AddEvent_DetailsLOVGrid.columns = [
	{ xpath: "Code" },
	{ xpath: "Description" }
];

AddEvent_DetailsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddEvent_DetailsLOVButton"} ]
	}
};

/**
 * @author rzxd7g
 * @return "AddEvent_Service"  
 */
AddEvent_DetailsLOVGrid.nextFocusedAdaptorId = function() {
	return "AddEvent_Service";
}

AddEvent_DetailsLOVGrid.logicOn = [AddEvent_DetailsLOVGrid.dataBinding];
AddEvent_DetailsLOVGrid.logic = function(event)
{
	if ( event.getXPath() != AddEvent_DetailsLOVGrid.dataBinding )
	{
		return;
	}
	
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain");
	var lovValue = Services.getValue(AddEvent_DetailsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(detailsLOV) && !CaseManUtils.isBlank(lovValue) )
	{
		var detailsValue = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/LOVDetails/Options/Option[./Code = " + AddEvent_DetailsLOVGrid.dataBinding + "]/Description");
		if ( detailsLOV == "EVT_100_AE DESCRIPTION" )
		{
			// Judgment Debtor / Judgment Creditor LOV, store the description
			Services.setValue(AddEvent_Details.dataBinding, detailsValue);
		}
		else
		{
			// For Tick Box Events, concatenate the code and the description selected
			var tickBoxDesc = lovValue + ": " + detailsValue;
			Services.setValue(AddEvent_Details.dataBinding, tickBoxDesc);
		}
	}
}

/********************************** GRIDS *****************************************/

function Master_AEEventGrid() {}
Master_AEEventGrid.isRecord = true;
Master_AEEventGrid.componentName = "Master AE Event Grid";
Master_AEEventGrid.tabIndex = 10;
Master_AEEventGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/AEEvent";
Master_AEEventGrid.srcData = XPathConstants.DATA_XPATH + "/AEEvents";
Master_AEEventGrid.rowXPath = "AEEvent";
Master_AEEventGrid.keyXPath = "AEEventSeq";
Master_AEEventGrid.columns = [
	{xpath: "AEEventSeq", sort: "disabled", transformToDisplay: function() { return ""; } },
	{xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "StandardEventId", sort: "numerical"},
	{xpath: "StandardEventDescription"},
	{xpath: "Stage"},
	{xpath: "ErrorInd", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; } }
];

/**
 * For events that are in error, display the grid row in a particular colour
 * @param rowId
 * @author rzxd7g
 * @return classList  
 */
Master_AEEventGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
    	var failedOutput = false;
      	var blnError = Services.getValue(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + rowId + "]/ErrorInd");
      	var countOutputs = Services.countNodes(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + rowId + "]/Outputs/Output");
      	if ( countOutputs == 0 )
      	{
      		// No outputs, do not display icon
      		var finalInd = null;
      	}
      	else if ( countOutputs == 1 )
      	{
      		// One output, display the icon based upon the final indicator
      		var finalInd = Services.getValue(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + rowId + "]/Outputs/Output/Final");
      		
      		var documentId = Services.getValue(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + rowId + "]/Outputs/Output/DocumentId");
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

// Disable the grid if no AE loaded or no AE Events exist
Master_AEEventGrid.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.srcData];
Master_AEEventGrid.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function QueryPopup_AENumberGrid() {};
QueryPopup_AENumberGrid.tabIndex = 60;
QueryPopup_AENumberGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedAERecord";
QueryPopup_AENumberGrid.srcData = XPathConstants.QUERY_XPATH + "/Results";
QueryPopup_AENumberGrid.rowXPath = "AERecord";
QueryPopup_AENumberGrid.keyXPath = "AENumber";
QueryPopup_AENumberGrid.columns = [
	{xpath: "CaseNumber"},
	{xpath: "AENumber"},
	{xpath: "JudgmentDebtor/PartyName"},
	{xpath: "JudgmentDebtor/ContactDetails/Address/Line[1]"},
	{xpath: "Live"}
];

/***************************** DATA BINDINGS **************************************/

Query_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Query_AENumber.dataBinding = XPathConstants.DATA_XPATH + "/AENumber";
Query_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Query_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtName";
Header_ApplicationType.dataBinding = XPathConstants.DATA_XPATH + "/ApplicationTypeDescription";
Header_JudgmentCreditor.dataBinding = XPathConstants.DATA_XPATH + "/JudgmentCreditor/PartyName";
Header_JudgmentDebtor.dataBinding = XPathConstants.DATA_XPATH + "/JudgmentDebtor/PartyName";
Master_AEEventId.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/AddEvent/EventId";
Master_AEEventDescription.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/Tmp/AddEvent/EventDescription";
EventDetails_DateReceived.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ReceiptDate";
EventDetails_EventId.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId";
EventDetails_EventDescription.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventDescription";
EventDetails_Stage.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/Stage";
EventDetails_Details.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/EventDetails";
EventDetails_ErrorFlag.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ErrorInd";
EventDetails_Service.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/Service";
EventDetails_BailiffId.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/BailiffId";
EventDetails_ServiceDate.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/ServiceDate";
EventDetails_CreatedBy.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/UserName";
EventDetails_Date.dataBinding = XPathConstants.SELECTED_EVENT_XPATH + "/EventDate";
AddEvent_DateReceived.dataBinding = XPathConstants.NEWEVENT_XPATH + "/ReceiptDate";
AddEvent_EventId.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventId";
AddEvent_EventDescription.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventDescription";
AddEvent_Stage.dataBinding = XPathConstants.NEWEVENT_XPATH + "/IssueStage";
AddEvent_Details.dataBinding = XPathConstants.NEWEVENT_XPATH + "/Details";
AddEvent_Service.dataBinding = XPathConstants.NEWEVENT_XPATH + "/Service";
AddEvent_BailiffId.dataBinding = XPathConstants.NEWEVENT_XPATH + "/BailiffId";
AddEvent_EventDate.dataBinding = XPathConstants.NEWEVENT_XPATH + "/EventDate";
PERNDRDetailsPopup_PERRateCurrency.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/PERRateCurrency";
PERNDRDetailsPopup_PERRate.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/PERRate";
PERNDRDetailsPopup_PERPeriod.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/PERPeriod";
PERNDRDetailsPopup_NDRRateCurrency.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/NDRRateCurrency";
PERNDRDetailsPopup_NDRRate.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/NDRRate";
PERNDRDetailsPopup_NDRPeriod.dataBinding = XPathConstants.TEMP_PERDETAILS_XPATH + "/NDRPeriod";

/********************************* FIELDS ******************************************/

function Query_CaseNumber() {}
Query_CaseNumber.tabIndex = 1;
Query_CaseNumber.maxLength = 8;
Query_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Query_CaseNumber.componentName = "Case Number";
Query_CaseNumber.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_CaseNumber.isReadOnly = isAERecordLoaded;
Query_CaseNumber.isTemporary = function() { return true; }
Query_CaseNumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Query_CaseNumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_CaseNumber.validate = function()
{
	var ec = null;
	var value = Services.getValue(Query_CaseNumber.dataBinding);
	if ( !CaseManUtils.isBlank(value) )
	{
		// Check the format of the Case Number is correct
		ec = CaseManValidationHelper.validateCaseNumber(value);
		
		// Check if MAGS ORDER Case, the first 2 characters are alphabetic
		if ( null == ec && value.charAt(2) == "/" )
		{
			ec = CaseManValidationHelper.validatePattern(value, CaseManValidationHelper.MAGSORDER_CASE_PATTERN, 'Caseman_invalidMAGSORDERCaseNumberFormat_Msg');
		}
	}
	return ec;
}

Query_CaseNumber.logicOn = [XPathConstants.FORM_STATE_XPATH]
Query_CaseNumber.logic = function(event)
{
	var formState = Services.getValue(XPathConstants.FORM_STATE_XPATH);
	if ( event.getXPath() == XPathConstants.FORM_STATE_XPATH && formState == FormStates.STATE_MODIFY )
	{
		// When a record is loaded, transfer the Case Number and AE Number to the query fields
		var caseNumber = Services.getValue(XPathConstants.DATA_XPATH + "/CaseNumber");
		var aeNumber = Services.getValue(XPathConstants.DATA_XPATH + "/AENumber");
		if ( !CaseManUtils.isBlank(caseNumber) && !CaseManUtils.isBlank(aeNumber) )
		{
			Services.startTransaction();
			Services.setValue(ManageAEEventsParams.CASE_NUMBER, caseNumber);
			Services.setValue(ManageAEEventsParams.AE_NUMBER, aeNumber);

			// Check if owning court is different
			var court = Services.getValue(Query_OwningCourtCode.dataBinding);
			var owningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			var msg_ind = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
			if ( !CaseManUtils.isBlank(court) && court != owningCourt && msg_ind != "true" )
			{
				alert(Messages.OWNING_COURT_MESSAGE);
				Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
			}

			// Check if MAGS ORDER
			var magsOrderInd = "false";
			if ( isMAGSOrderCase() )
			{
				magsOrderInd = "true";
			}
			Services.setValue(XPathConstants.MAGSORDER_IND_XPATH, magsOrderInd);
			Services.endTransaction();
		}
	}
}

/*********************************************************************************/

function Query_AENumber() {}
Query_AENumber.tabIndex = 2;
Query_AENumber.maxLength = 8;
Query_AENumber.helpText = "Attachment of Earnings application number";
Query_AENumber.componentName = "AE Number";
Query_AENumber.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_AENumber.isReadOnly = isAERecordLoaded;
Query_AENumber.isTemporary = function() { return true; }
Query_AENumber.transformToDisplay = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}
Query_AENumber.transformToModel = function(value)
{
	return (null != value) ? value.toUpperCase() : null;
}

Query_AENumber.validate = function()
{
	var ec = null;
	var aeNumber = Services.getValue(Query_AENumber.dataBinding);
	if ( !CaseManUtils.isBlank(aeNumber) )
	{
		var aeSearch = aeNumber.search(CaseManValidationHelper.VALID_NONMAGSAE_PATTERN);
		var magsSearch = aeNumber.search(CaseManValidationHelper.MAGSORDER_CASE_PATTERN);
		var existingCaseAeSearch = aeNumber.search(CaseManValidationHelper.VALID_EXISTINGCASEAE_PATTERN);
		var newAeSearch = aeNumber.search(CaseManValidationHelper.VALID_NEW_NONMAGSAE_PATTERN);
		
		if ( aeSearch != 0 && magsSearch != 0 && existingCaseAeSearch != 0 && newAeSearch != 0 )
		{
			// Does not match any valid AE Number pattern
			ec = ErrorCode.getErrorCode("CaseMan_AE_invalidAENumberFormat_Msg");
		}
		else if ( existingCaseAeSearch == 0 )
		{
			var countCourts = Services.countNodes(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./Code = '" + aeNumber.substring(0, 3) + "']");
			if ( countCourts == 0 )
			{
				// For the existing case AE number format, the first 3 characters must match a valid court code
				ec = ErrorCode.getErrorCode("CaseMan_AE_invalidAENumberFormat_Msg");
			}
		}
	}
	return ec;
}

/*********************************************************************************/

function Query_OwningCourtCode() {}
Query_OwningCourtCode.tabIndex = 3;
Query_OwningCourtCode.maxLength = 3;
Query_OwningCourtCode.helpText = "Owning court code";
Query_OwningCourtCode.componentName = "Owning Court Code";
Query_OwningCourtCode.readOnlyOn = [XPathConstants.FORM_STATE_XPATH];
Query_OwningCourtCode.isReadOnly = isAERecordLoaded;
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
Query_OwningCourtName.isReadOnly = isAERecordLoaded;
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

function Header_ApplicationType() {}
Header_ApplicationType.tabIndex = -1;
Header_ApplicationType.maxLength = 70;
Header_ApplicationType.helpText = "Application type";
Header_ApplicationType.componentName = "Application Type";
Header_ApplicationType.isTemporary = function() { return true; }
Header_ApplicationType.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_ApplicationType.isEnabled = isAERecordLoaded;
Header_ApplicationType.isMandatory = function() { return true; }
Header_ApplicationType.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_JudgmentCreditor() {}
Header_JudgmentCreditor.tabIndex = -1;
Header_JudgmentCreditor.helpText = "Name of the Judgment Creditor";
Header_JudgmentCreditor.componentName = "Judgment Creditor";
Header_JudgmentCreditor.isTemporary = function() { return true; }
Header_JudgmentCreditor.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_JudgmentCreditor.isEnabled = isAERecordLoaded;
Header_JudgmentCreditor.isMandatory = function() { return true; }
Header_JudgmentCreditor.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_JudgmentDebtor() {}
Header_JudgmentDebtor.tabIndex = -1;
Header_JudgmentDebtor.helpText = "Name of the Judgment Debtor";
Header_JudgmentDebtor.componentName = "Judgment Debtor";
Header_JudgmentDebtor.isTemporary = function() { return true; }
Header_JudgmentDebtor.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_JudgmentDebtor.isEnabled = isAERecordLoaded;
Header_JudgmentDebtor.isMandatory = function() { return true; }
Header_JudgmentDebtor.isReadOnly = function() { return true; }

/*********************************************************************************/

function Master_AEEventId() {}
Master_AEEventId.tabIndex = 13;
Master_AEEventId.maxLength = 3;
Master_AEEventId.helpText = "AE event ID code";
Master_AEEventId.isTemporary = function() { return true; }
Master_AEEventId.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_AEEventId.isEnabled = isAERecordLoaded; 
Master_AEEventId.validate = function()
{
	var ec = null;
	var eventId = Services.getValue(Master_AEEventId.dataBinding);
	if ( !CaseManUtils.isBlank(eventId) )
	{
		// Check EventId exists in the list
		var eventExists = Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_AEEventId.dataBinding + " and (./StandardEventId = '999' or ./MagsEvent = " + XPathConstants.MAGSORDER_IND_XPATH + ") ]");
		if ( !CaseManValidationHelper.validateNumber(eventId) || !eventExists )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidEventId_Msg");
		}
	}
	return ec;
}

Master_AEEventId.logicOn = [Master_AEEventId.dataBinding];
Master_AEEventId.logic = function(event)
{
	if (event.getXPath() != Master_AEEventId.dataBinding)
	{
		return;
	}
	
	var eventId = Services.getValue(Master_AEEventId.dataBinding);
	if (!CaseManUtils.isBlank( eventId ) )
	{
		// Populate the Description field
		var eventDesc = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_AEEventId.dataBinding + " and (./StandardEventId = '999' or ./MagsEvent = " + XPathConstants.MAGSORDER_IND_XPATH + ") ]/StandardEventDescription");
		if (Services.getValue(Master_AEEventDescription.dataBinding) != eventDesc)
		{
			Services.setValue(Master_AEEventDescription.dataBinding, eventDesc);
		}
	}
	else
	{
		// EventId cleared so clear the Event Description
		Services.setValue(Master_AEEventDescription.dataBinding, "");
	}
}

/*********************************************************************************/

function Master_AEEventDescription() {}
Master_AEEventDescription.srcDataOn = [XPathConstants.MAGSORDER_IND_XPATH];
Master_AEEventDescription.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_AEEventDescription.rowXPath = "StandardEvent[./StandardEventId = '999' or ./MagsEvent = " + XPathConstants.MAGSORDER_IND_XPATH + "]";
Master_AEEventDescription.keyXPath = "StandardEventDescription";
Master_AEEventDescription.displayXPath = "StandardEventDescription";
Master_AEEventDescription.strictValidation = true;
Master_AEEventDescription.sortMode = "alphabeticalLowToHigh";
Master_AEEventDescription.tabIndex = 14;
Master_AEEventDescription.helpText = "Description of the event";
Master_AEEventDescription.isTemporary = function() { return true; }
Master_AEEventDescription.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_AEEventDescription.isEnabled = isAERecordLoaded;
Master_AEEventDescription.logicOn = [Master_AEEventDescription.dataBinding];
Master_AEEventDescription.logic = function(event)
{
	if (event.getXPath() != Master_AEEventDescription.dataBinding)
	{
		return;
	}

	var eventDesc = Services.getValue(Master_AEEventDescription.dataBinding);
	if ( !CaseManUtils.isBlank( eventDesc ) )
	{
		// Populate the EventId field
		var eventId = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventDescription = " + Master_AEEventDescription.dataBinding + " and ./MagsEvent = " + XPathConstants.MAGSORDER_IND_XPATH + "]/StandardEventId");
		if (!CaseManUtils.isBlank(eventId) && Services.getValue(Master_AEEventId.dataBinding) != eventId)
		{
			Services.setValue(Master_AEEventId.dataBinding, eventId);
		}
	}
	else
	{
		if ( null == Master_AEEventId.validate() )
		{
			// Event Description cleared so clear the EventId field
			Services.setValue(Master_AEEventId.dataBinding, "");
		}
	}
}

/*********************************************************************************/

function EventDetails_DateReceived() {}
EventDetails_DateReceived.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_DateReceived.tabIndex = -1;
EventDetails_DateReceived.maxLength = 11;
EventDetails_DateReceived.helpText = "Date when work received at court.";
EventDetails_DateReceived.componentName = "Date Received";
EventDetails_DateReceived.isTemporary = function() { return true; }
EventDetails_DateReceived.isMandatory = function() { return true; }
EventDetails_DateReceived.isReadOnly = function() { return true; }
EventDetails_DateReceived.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_DateReceived.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_EventId() {}
EventDetails_EventId.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_EventId.tabIndex = -1;
EventDetails_EventId.maxLength = 3;
EventDetails_EventId.helpText = "AE event ID code";
EventDetails_EventId.componentName = "Event Id";
EventDetails_EventId.isTemporary = function() { return true; }
EventDetails_EventId.isMandatory = function() { return true; }
EventDetails_EventId.isReadOnly = function() { return true; }
EventDetails_EventId.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_EventId.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_EventDescription() {}
EventDetails_EventDescription.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_EventDescription.tabIndex = -1;
EventDetails_EventDescription.maxLength = 70;
EventDetails_EventDescription.helpText = "Description of the event";
EventDetails_EventDescription.componentName = "Event Description";
EventDetails_EventDescription.isTemporary = function() { return true; }
EventDetails_EventDescription.isMandatory = function() { return true; }
EventDetails_EventDescription.isReadOnly = function() { return true; }
EventDetails_EventDescription.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_EventDescription.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

/*********************************************************************************/

function EventDetails_Stage() {}
EventDetails_Stage.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_Stage.tabIndex = -1;
EventDetails_Stage.maxLength = 70;
EventDetails_Stage.helpText = "The issue stage for the event";
EventDetails_Stage.componentName = "Stage";
EventDetails_Stage.isTemporary = function() { return true; }
EventDetails_Stage.isReadOnly = function() { return true; }
EventDetails_Stage.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_Stage.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if no stage for the event
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

EventDetails_Stage.transformToDisplay = function(value)
{
	var displayValue = "";
	if ( !CaseManUtils.isBlank(value) )
	{
		displayValue = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StageList/Stage[./Value = '" + value + "']/Description");
	}
	return displayValue;
}

/*********************************************************************************/

function EventDetails_Details() {}
EventDetails_Details.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_Details.tabIndex = 20;
EventDetails_Details.maxLength = 500;
EventDetails_Details.helpText = "Event Details";
EventDetails_Details.componentName = "Details";
EventDetails_Details.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_Details.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

EventDetails_Details.mandatoryOn = [Master_AEEventGrid.dataBinding, EventDetails_Stage.dataBinding];
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

EventDetails_Details.readOnlyOn = [Master_AEEventGrid.dataBinding, EventDetails_ErrorFlag.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_Details.isReadOnly = function()
{
	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	if ( errorFlag == "Y" && renderInvalid != "true"  )
	{
		// Read Only is event marked in error
		return true;
	}
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
	if ( statusCode == 0 || statusCode == UpdateAECode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateAECode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_ErrorFlag() {}
EventDetails_ErrorFlag.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_ErrorFlag.modelValue = {checked: 'Y', unchecked: 'N'};
EventDetails_ErrorFlag.tabIndex = 21;
EventDetails_ErrorFlag.helpText = "Indicates whether or not the event was entered in error";
EventDetails_ErrorFlag.componentName = "Error Flag";
EventDetails_ErrorFlag.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_ErrorFlag.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}

EventDetails_ErrorFlag.readOnlyOn = [Master_AEEventGrid.dataBinding, EventDetails_ErrorFlag.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_ErrorFlag.isReadOnly = function()
{
	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	if ( errorFlag == "Y" && renderInvalid != "true" )
	{
		// Read Only is event marked in error
		return true;
	}
	return false;
}

EventDetails_ErrorFlag.validateOn = [Master_AEEventGrid.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_ErrorFlag.validate = function()
{
	var ec = null;
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	if ( renderInvalid == "true" )
	{
		// Event has marked in error but it was not the most recent order event
		ec = ErrorCode.getErrorCode("CaseMan_AE_NotRecentOrderEvent_Msg");
	}
	return ec;
}

EventDetails_ErrorFlag.logicOn = [EventDetails_ErrorFlag.dataBinding];
EventDetails_ErrorFlag.logic = function(event)
{
	if ( !( event.getXPath() == EventDetails_ErrorFlag.dataBinding && event.getType() == DataModelEvent.UPDATE ) )
	{
		return;
	}
	
	setDirtyFlag();
	var okToSetInError = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/OkToSetToError");
	var errFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	if ( errFlag == "Y" && okToSetInError == "false" )
	{
		// Cannot mark an event in error if it is not the most recent order event
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid", "true");
		return;
	}
	else if ( errFlag == "N" )
	{
		// User is unmarking an event in error as when in error, is invalid
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid", "false");
		return;
	}
	
	// Validate the form

	var invalidFields = FormController.getInstance().validateForm(true, true);
	if ( 0 != invalidFields.length )
	{
		// Reset the error flag to 'N' and return
		// Need current Event Id as validateForm may focus on a different event
		Services.setValue(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + Master_AEEventGrid.dataBinding + "]/ErrorInd", "N");
		return;
	}
	else
	{
		// Change the Event's Status so server knows to update it accordingly
		var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
		statusCode = statusCode + UpdateAECode.STATUSCODE_ERRCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);

		// Create ds node to add the main data node to	
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH)
		var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
		dataNode.appendChild(strippedNode);
		
		// Call the update AE Events service
		var params = new ServiceParams();
		params.addDOMParameter("aeEvents", dataNode);
		Services.callService("updateAeEvents", params, EventDetails_ErrorFlag, true);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onSuccess = function(dom)
{
	if ( null != dom )
	{
		var node = dom.selectSingleNode("/AeEventNavigationList/NavigateTo/Obligations");

		// Either Navigate to Obligations screen or refresh the page
		if ( null != node && XML.getNodeTextContent(node) == "true" )
		{
			setCaseNumberToApp(MaintainObligationsParams.CASE_NUMBER);
			Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
			Services.setValue(MaintainObligationsParams.EVENT_TYPE, "A");
			var navArray = Array(NavigationController.OBLIGATIONS_FORM, NavigationController.AE_EVENTS_FORM);
			navigateToScreen(navArray, false);
		}
		else
		{
			loadAERecord();
		}
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
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		loadAERecord();
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
EventDetails_Service.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_Service.tabIndex = 22;
EventDetails_Service.helpText = "The service required for the event";
EventDetails_Service.isMandatory = function() { return true; }
EventDetails_Service.componentName = "Service";
EventDetails_Service.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding, EventDetails_Stage.dataBinding];
EventDetails_Service.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isAERecordLoaded() || isEventGridEmpty() )
	{
		return false;
	}
	// Disabled if stage is blank
	var stage = Services.getValue(EventDetails_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

EventDetails_Service.readOnlyOn = [EventDetails_ErrorFlag.dataBinding, Master_AEEventGrid.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_Service.isReadOnly = function()
{
	// Read Only is event marked in error
	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	return (renderInvalid == "true") ? false : (errorFlag == "Y") ? true : false;
}

/*
EventDetails_Service.validateOn = [EventDetails_ErrorFlag.dataBinding, Master_AEEventGrid.dataBinding];
EventDetails_Service.validate = function()
{
	var ec = null;
	var service = Services.getValue(EventDetails_Service.dataBinding);
	var eventId = Services.getValue(EventDetails_EventId.dataBinding);
	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var eventKey = Services.getValue(Master_AEEventGrid.dataBinding);

	var eventExists = Services.exists(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./StandardEventId = '" + eventId + "' and ./Service = '" + service + "' and ./ErrorInd = 'N' and ./AEEventSeq != " + eventKey + "]");
	if ( errorFlag == "N" && service != ServiceStatuses.NOTSERVED && eventExists )
	{
		// Valid event with same event id and service status (except NOT SERVED) already exists
		ec = ErrorCode.getErrorCode("CaseMan_AE_previousEventAwaitingService_Msg");
	}
	return ec;
}
 */

EventDetails_Service.logicOn = [EventDetails_Service.dataBinding];
EventDetails_Service.logic = function(event)
{
	if ( event.getXPath() != EventDetails_Service.dataBinding )
	{
		return;
	}
	
	var service = Services.getValue(EventDetails_Service.dataBinding);
	if ( service == ServiceStatuses.NOTSERVED )
	{
		// Clear the Service Date and BailiffId fields
		Services.setValue(EventDetails_ServiceDate.dataBinding, "");
		Services.setValue(EventDetails_BailiffId.dataBinding, "");
		
	
		// Service status has been changed to NOT SERVED - server call required
		// Validate the form	
		var invalidFields = FormController.getInstance().validateForm(true, true);
		if ( 0 != invalidFields.length )
		{
			// Reset the select box to blank
			// Need current Event Id as validateForm may focus on a different event
			Services.setValue(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./AEEventSeq = " + Master_AEEventGrid.dataBinding + "]/Service", "");
			return;
		}
		else
		{
			// Get current userID - TRAC 1908
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/UpdatingUser", Services.getCurrentUser() );
			
			// Change the Event's Status so server knows to update it accordingly
			var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
			statusCode = statusCode + UpdateAECode.STATUSCODE_NOTSERVED
			Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	
			// Create ds node to add the main data node to	
			var dataNode = XML.createDOM(null, null, null);
			var node = Services.getNode(XPathConstants.DATA_XPATH)
			var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
			dataNode.appendChild(strippedNode);

			//Services.addNode(dataNode, XPathConstants.DATA_XPATH + "/ServiceChangedToNotServed");
			
			// Call the update AE Events service
			var params = new ServiceParams();
			params.addDOMParameter("aeEvents", dataNode);
			Services.callService("updateAeEvents", params, EventDetails_Service, true);
		}
	}
	else
	{
		// HANDLE SETTING OF DEFAULT VALUES BASED ON SERVICE STATUS
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
		if ( statusCode != UpdateAECode.STATUSCODE_DETSCHANGED )
		{
			// Details of the event have changed
			statusCode = statusCode + UpdateAECode.STATUSCODE_DETSCHANGED;
		}
	
		// Set the dirty flag and status code when value in field changes
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
		setDirtyFlag();
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
EventDetails_Service.onSuccess = function(dom)
{
	// Oracle reports Call if change AE Event service status to NOT SERVED
	Services.replaceNode(XPathConstants.EVENTNAVIGATION_XPATH, dom);
	var navToOR = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/OracleReport");

	// Either Navigate to Oracle Reports screen or refresh the page
	if ( navToOR == "true" )
	{
		// defect UCT 379 - need flag to test within the wordprocessing.js, so we know whether we are updaing and therefore which report to produce.
		Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing/UpdateServiceFlag", "Y");
		// end of UCT 379 change
		
		var orNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing");
		var orDom = XML.createDOM();
		orDom.loadXML(orNode.xml);
		
		Services.replaceNode(CaseManFormParameters.ORNODE_XPATH, orNode);
		
		// Set Oracle Report Court Code to the owning court of the case record loaded - trac 2446
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Query_OwningCourtCode.dataBinding) );
		
		WP.ProcessORA(FormController.getInstance(), orDom, NavigationController.AE_EVENTS_FORM );
	}
	else
	{
		// No call to oracle reports
		loadAERecord();
	}
	
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_Service.onError = function(exception)
{
	alert(Messages.FAILEDSAVE_MESSAGE);
	exitScreen();
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
EventDetails_Service.onUpdateLockedException = function (exception)
{
	if( confirm(Messages.WRITE_WRITE_CONFLICT_MSG) )
	{
		loadAERecord();
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
EventDetails_Service.onAuthorizationException = function(exception) 
{
	handleAuthorizationException(exception);
}

/*********************************************************************************/

function EventDetails_BailiffId() {}
EventDetails_BailiffId.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_BailiffId.tabIndex = 23;
EventDetails_BailiffId.maxLength = 2;
EventDetails_BailiffId.helpText = "The Bailiff's area number";
EventDetails_BailiffId.componentName = "Bailiff Id";
EventDetails_BailiffId.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding, EventDetails_Stage.dataBinding, EventDetails_Service.dataBinding];
EventDetails_BailiffId.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isAERecordLoaded() || isEventGridEmpty() )
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

EventDetails_BailiffId.readOnlyOn = [Master_AEEventGrid.dataBinding, EventDetails_ErrorFlag.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_BailiffId.isReadOnly = function()
{
	// Read Only is event marked in error
	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	return (renderInvalid == "true") ? false : (errorFlag == "Y") ? true : false;
}

EventDetails_BailiffId.validateOn = [Master_AEEventGrid.dataBinding];
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
	if ( statusCode == 0 || statusCode == UpdateAECode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateAECode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_ServiceDate() {}
EventDetails_ServiceDate.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_ServiceDate.tabIndex = 24;
EventDetails_ServiceDate.maxLength = 11;
EventDetails_ServiceDate.helpText = "The service date.";
EventDetails_ServiceDate.componentName = "Service Date";
EventDetails_ServiceDate.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding, EventDetails_Stage.dataBinding, EventDetails_Service.dataBinding];
EventDetails_ServiceDate.isEnabled = function()
{
	// Disabled if no record loaded
	if ( !isAERecordLoaded() || isEventGridEmpty() )
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

EventDetails_ServiceDate.readOnlyOn = [Master_AEEventGrid.dataBinding, EventDetails_ErrorFlag.dataBinding, EventDetails_Service.dataBinding, XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid"];
EventDetails_ServiceDate.isReadOnly = function()
{
	// Read Only is event marked in error
	var service = Services.getValue(EventDetails_Service.dataBinding);
	if ( service == ServiceStatuses.POSTAL )
	{
		return true;
	}

	var errorFlag = Services.getValue(EventDetails_ErrorFlag.dataBinding);
	var renderInvalid = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/RenderEventInvalid");
	return (renderInvalid == "true") ? false : (errorFlag == "Y") ? true : false;
}

EventDetails_ServiceDate.validateOn = [Master_AEEventGrid.dataBinding, EventDetails_Date.dataBinding];
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
	
	// Check if the service date entered is not at least 5 days prior to the first hearing date
	var serviceDate = Services.getValue(EventDetails_ServiceDate.dataBinding);
	var hearingDate = Services.getValue(XPathConstants.DATA_XPATH + "/FutureHearings/Hearing[1]/HearingDate");
	if ( !CaseManUtils.isBlank(serviceDate) && !CaseManUtils.isBlank(hearingDate) )
	{
		var serviceDateObj = CaseManUtils.createDate( serviceDate );
		var hearingDateObj = CaseManUtils.createDate( hearingDate );
		var fiveDaysPriorToHrgDate = CaseManUtils.daysInPast(hearingDateObj, 5, true);
		
		if ( CaseManUtils.compareDates(fiveDaysPriorToHrgDate, serviceDateObj) == 1 )
		{
			// The service date entered is after the date 5 days prior to the hearing date
			alert(Messages.AE_SERVICE5DAYSPRIORTOHRG_MESSAGE)
		}
	}
	
	// Change the Event's Status so server knows to update it accordingly
	var statusCode = parseInt( Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status") );
	if ( statusCode == 0 || statusCode == UpdateAECode.STATUSCODE_NOTSERVED )
	{
		// Details have not yet been changed, add the details changed error code
		statusCode = statusCode + UpdateAECode.STATUSCODE_DETSCHANGED;
		Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Status", statusCode);
	}
	
	// Set the dirty flag when value in field changes
	setDirtyFlag();
}

/*********************************************************************************/

function EventDetails_CreatedBy() {}
EventDetails_CreatedBy.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_CreatedBy.tabIndex = -1;
EventDetails_CreatedBy.maxLength = 30;
EventDetails_CreatedBy.helpText = "The user who created the event";
EventDetails_CreatedBy.componentName = "Created By";
EventDetails_CreatedBy.isTemporary = function() { return true; }
EventDetails_CreatedBy.isMandatory = function() { return true; }
EventDetails_CreatedBy.isReadOnly = function() { return true; }
EventDetails_CreatedBy.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_CreatedBy.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
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

EventDetails_Date.retrieveOn = [Master_AEEventGrid.dataBinding];
EventDetails_Date.tabIndex = -1;
EventDetails_Date.maxLength = 11;
EventDetails_Date.helpText = "The date event took place";
EventDetails_Date.componentName = "Event Date";
EventDetails_Date.isTemporary = function() { return true; }
EventDetails_Date.isMandatory = function() { return true; }
EventDetails_Date.isReadOnly = function() { return true; }
EventDetails_Date.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.dataBinding];
EventDetails_Date.isEnabled = function()
{
	if ( !isAERecordLoaded() || isEventGridEmpty() )
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
AddEvent_EventId.helpText = "AE event ID code";
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
AddEvent_Stage.rowXPath = "/Stage";
AddEvent_Stage.keyXPath = "/Value";
AddEvent_Stage.displayXPath = "/Description";
AddEvent_Stage.tabIndex = 41;
AddEvent_Stage.helpText = "The issue stage for the event";
AddEvent_Stage.isTemporary = function() { return true; }
AddEvent_Stage.isMandatory = function() { return true; }
AddEvent_Stage.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/IssueStage"];
AddEvent_Stage.isEnabled = function()
{
	var issueStageEnabled = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/IssueStage");
	return issueStageEnabled == "true";
}

AddEvent_Stage.validateOn = [AddEvent_DateReceived.dataBinding];
AddEvent_Stage.validate = function()
{
	var ec = null;
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( null == ec && stage == IssueStages.REISSUE )
	{
		// Can only create an event with a stage of REISSUE if the same event currently exists with a stage of ISSUE
		var countEventNodes = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/IssueDetail/Events/Event[./Stage = '" + IssueStages.ISSUE + "']");
		if ( countEventNodes == 0 )
		{
			ec = ErrorCode.getErrorCode("CaseMan_EventPreviouslyIssued_Msg");
		}
	}
	
	if ( null == ec && stage == IssueStages.SUBSERVICE )
	{
		// If the issue stage is 'S/S' then there should be a Substituted Service address for the debtor
		subServiceAddressExists = Services.getValue(XPathConstants.DATA_XPATH + "/JudgmentDebtor/SubServiceAddressExists");
		if ( subServiceAddressExists == "false" )
		{
			ec = ErrorCode.getErrorCode("CaseMan_AE_noSubServiceAddress_Msg");
		}
	}

	return ec;
}

AddEvent_Stage.logicOn = [AddEvent_Stage.dataBinding, AddEvent_DateReceived.dataBinding];
AddEvent_Stage.logic = function(event)
{
	if ( event.getXPath() != AddEvent_Stage.dataBinding && event.getXPath() != AddEvent_DateReceived.dataBinding )
	{
		return;
	}
	
	var countEventNodes = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/IssueDetail/Events/Event[./Stage = " + AddEvent_Stage.dataBinding + " and ./ReceiptDate = " + AddEvent_DateReceived.dataBinding + "]");
	if ( countEventNodes > 0 )
	{
		// User has attempted to create the same event with the same issue stage on the same date
		alert(Messages.AE_NOTICEALREADYISSUED_MESSAGE);
	}
	
	if ( event.getXPath() != AddEvent_Stage.dataBinding )
	{
		// Don't proceed any further if come to this function following a change in Date Received
		return;
	}
	
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( !CaseManUtils.isBlank(stage) && null == AddEvent_Stage.validate() )
	{
		var defaultService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/ServiceType");
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
AddEvent_Details.mandatoryOn = [AddEvent_Stage.dataBinding, XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain", XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/EditDetails"];
AddEvent_Details.isMandatory = function()
{
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	if ( stage == IssueStages.SUBSERVICE )
	{
		// Details is mandatory if the stage is 'S/S'
		return true;
	}
	
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain");
	if ( !CaseManUtils.isBlank(detailsLOV) )
	{
		// Details are mandatory if there is an LOV associated with the field
		return true;
	}
	
	var detailsMandatory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/EditDetails");
	return detailsMandatory == "M";
}

AddEvent_Details.readOnlyOn = [XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain"];
AddEvent_Details.isReadOnly = function()
{
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain");
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
AddEvent_Service.isMandatory = function() { return true; }
AddEvent_Service.isTemporary = function() { return true; }
AddEvent_Service.enableOn = [AddEvent_Stage.dataBinding];
AddEvent_Service.isEnabled = function()
{
	// Disabled if stage is blank
	var stage = Services.getValue(AddEvent_Stage.dataBinding);
	return !CaseManUtils.isBlank(stage);
}

/*
AddEvent_Service.validate = function()
{
	var ec = null;
	var service = Services.getValue(AddEvent_Service.dataBinding);
	var eventId = Services.getValue(AddEvent_EventId.dataBinding);
	
	var eventExists = Services.exists(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./StandardEventId = '" + eventId + "' and ./Service = '" + service + "' and ./ErrorInd = 'N']");
	if ( eventExists )
	{
		// Valid event with same event id and service status already exists
		ec = ErrorCode.getErrorCode("CaseMan_AE_previousEventAwaitingService_Msg");
	}
	return ec;
}
 */

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
AddEvent_BailiffId.enableOn = [AddEvent_Stage.dataBinding, AddEvent_Service.dataBinding];
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

function AddEvent_EventDate() {}
AddEvent_EventDate.tabIndex = 46;
AddEvent_EventDate.maxLength = 11;
AddEvent_EventDate.helpText = "The date event took place";
AddEvent_EventDate.isTemporary = function() { return true; }
AddEvent_EventDate.isMandatory = function() { return true; }
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
	}
	return ec;
}

/*********************************************************************************/

function PERNDRDetailsPopup_PERRateCurrency() {}
PERNDRDetailsPopup_PERRateCurrency.tabIndex = -1;
PERNDRDetailsPopup_PERRateCurrency.isTemporary = function() { return true; }
PERNDRDetailsPopup_PERRateCurrency.isReadOnly = function() { return true; }
PERNDRDetailsPopup_PERRateCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function PERNDRDetailsPopup_PERRate() {}
PERNDRDetailsPopup_PERRate.tabIndex = 70;
PERNDRDetailsPopup_PERRate.maxLength = 8;
PERNDRDetailsPopup_PERRate.helpText = "Enter the Value for Protected Earnings Rate";
PERNDRDetailsPopup_PERRate.componentName = "Protected Earnings Rate";
PERNDRDetailsPopup_PERRate.isTemporary = function() { return true; }
PERNDRDetailsPopup_PERRate.mandatoryOn = [PERNDRDetailsPopup_PERPeriod.dataBinding];
PERNDRDetailsPopup_PERRate.isMandatory = function()
{
	// PER Rate is mandatory if the PER Period has been entered.
	var PERPeriod = Services.getValue(PERNDRDetailsPopup_PERPeriod.dataBinding);
	return !CaseManUtils.isBlank(PERPeriod);
}

PERNDRDetailsPopup_PERRate.validate = function()
{
	var ec = null;
	var PERRate = Services.getValue(PERNDRDetailsPopup_PERRate.dataBinding);

	if ( !CaseManUtils.isBlank(PERRate) )
	{
		ec = CaseManValidationHelper.validatePattern(PERRate, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if ( null == ec && PERRate < 0)
		{
			ec = ErrorCode.getErrorCode("CaseMan_negativeRateEntered_Msg");
		}
		else if ( null == ec && PERRate >= 100000)
		{
			ec = ErrorCode.getErrorCode("CaseMan_maximumAmountXExceded_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, 99999.99);
		}
	}
	return ec;
}

PERNDRDetailsPopup_PERRate.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

PERNDRDetailsPopup_PERRate.logicOn = [PERNDRDetailsPopup_PERRate.dataBinding];
PERNDRDetailsPopup_PERRate.logic = function(event)
{
	if ( event.getXPath() != PERNDRDetailsPopup_PERRate.dataBinding )
	{
		return;
	}
	
	var detailsExist = Services.getValue(XPathConstants.DATA_XPATH + "/PERNDRDetails/PERRateExists");
	if ( detailsExist == "true" )
	{
		// Display warning message that details have already been set in the PER Calculator
		alert(Messages.AE_PERDETAILSALREADYSET_MESSAGE);
	}
	
	// Set the status field
	Services.setValue(XPathConstants.PERSTATUS_XPATH, UpdateAECode.PERSTATUS_DETSCHANGED);
}

/*********************************************************************************/

function PERNDRDetailsPopup_PERPeriod() {}
PERNDRDetailsPopup_PERPeriod.srcData = XPathConstants.REF_DATA_XPATH + "/CalculatedPeriods";
PERNDRDetailsPopup_PERPeriod.rowXPath = "/Period";
PERNDRDetailsPopup_PERPeriod.keyXPath = "/Id";
PERNDRDetailsPopup_PERPeriod.displayXPath = "/Description";
PERNDRDetailsPopup_PERPeriod.tabIndex = 71;
PERNDRDetailsPopup_PERPeriod.helpText = "Enter the value for Protected Earnings Period";
PERNDRDetailsPopup_PERPeriod.componentName = "Protected Earnings Period";
PERNDRDetailsPopup_PERPeriod.isTemporary = function() { return true; }
PERNDRDetailsPopup_PERPeriod.mandatoryOn = [PERNDRDetailsPopup_PERRate.dataBinding];
PERNDRDetailsPopup_PERPeriod.isMandatory = function()
{
	// PER Period is mandatory if the PER Rate has been entered.
	var PERRate = Services.getValue(PERNDRDetailsPopup_PERRate.dataBinding);
	return !CaseManUtils.isBlank(PERRate);
}

PERNDRDetailsPopup_PERPeriod.readOnlyOn = [XPathConstants.DATA_XPATH + "/PERNDRDetails/PERRateExists"];
PERNDRDetailsPopup_PERPeriod.isReadOnly = function()
{
	var detailsExist = Services.getValue(XPathConstants.DATA_XPATH + "/PERNDRDetails/PERRateExists");
	if ( detailsExist == "true" )
	{
		return true;
	}
	return false;
}

PERNDRDetailsPopup_PERPeriod.logicOn = [PERNDRDetailsPopup_PERPeriod.dataBinding];
PERNDRDetailsPopup_PERPeriod.logic = function(event)
{
	if ( event.getXPath() != PERNDRDetailsPopup_PERPeriod.dataBinding )
	{
		return;
	}

	// Set the status field
	Services.setValue(XPathConstants.PERSTATUS_XPATH, UpdateAECode.PERSTATUS_DETSCHANGED);
}

/*********************************************************************************/

function PERNDRDetailsPopup_NDRRateCurrency() {}
PERNDRDetailsPopup_NDRRateCurrency.tabIndex = -1;
PERNDRDetailsPopup_NDRRateCurrency.isTemporary = function() { return true; }
PERNDRDetailsPopup_NDRRateCurrency.isReadOnly = function() { return true; }
PERNDRDetailsPopup_NDRRateCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function PERNDRDetailsPopup_NDRRate() {}
PERNDRDetailsPopup_NDRRate.tabIndex = 72;
PERNDRDetailsPopup_NDRRate.maxLength = 7;
PERNDRDetailsPopup_NDRRate.helpText = "Enter the Value for Normal Deduction Rate";
PERNDRDetailsPopup_NDRRate.componentName = "Normal Deduction Rate";
PERNDRDetailsPopup_NDRRate.isTemporary = function() { return true; }
PERNDRDetailsPopup_NDRRate.mandatoryOn = [PERNDRDetailsPopup_NDRPeriod.dataBinding];
PERNDRDetailsPopup_NDRRate.isMandatory = function()
{
	// NDR Rate is mandatory if the NDR Period has been entered.
	var NDRPeriod = Services.getValue(PERNDRDetailsPopup_NDRPeriod.dataBinding);
	return !CaseManUtils.isBlank(NDRPeriod);
}

PERNDRDetailsPopup_NDRRate.validate = function()
{
	var ec = null;
	var NDRRate = Services.getValue(PERNDRDetailsPopup_NDRRate.dataBinding);

	if ( !CaseManUtils.isBlank(NDRRate) )
	{
		ec = CaseManValidationHelper.validatePattern(NDRRate, CaseManValidationHelper.CURRENCY_PATTERN, "CaseMan_invalidAmountFormat_Msg");
		if ( null == ec && NDRRate < 0)
		{
			ec = ErrorCode.getErrorCode("CaseMan_negativeRateEntered_Msg");
		}
		else if ( null == ec && NDRRate >= 10000)
		{
			ec = ErrorCode.getErrorCode("CaseMan_maximumAmountXExceded_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, 9999.99);
		}
	}
	return ec;
}

PERNDRDetailsPopup_NDRRate.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

PERNDRDetailsPopup_NDRRate.logicOn = [PERNDRDetailsPopup_NDRRate.dataBinding];
PERNDRDetailsPopup_NDRRate.logic = function(event)
{
	if ( event.getXPath() != PERNDRDetailsPopup_NDRRate.dataBinding )
	{
		return;
	}

	// Set the status field
	Services.setValue(XPathConstants.PERSTATUS_XPATH, UpdateAECode.PERSTATUS_DETSCHANGED);
}

/*********************************************************************************/

function PERNDRDetailsPopup_NDRPeriod() {}
PERNDRDetailsPopup_NDRPeriod.srcData = XPathConstants.REF_DATA_XPATH + "/CalculatedPeriods";
PERNDRDetailsPopup_NDRPeriod.rowXPath = "/Period";
PERNDRDetailsPopup_NDRPeriod.keyXPath = "/Id";
PERNDRDetailsPopup_NDRPeriod.displayXPath = "/Description";
PERNDRDetailsPopup_NDRPeriod.tabIndex = 73;
PERNDRDetailsPopup_NDRPeriod.helpText = "Enter the Value for Normal Deduction Period";
PERNDRDetailsPopup_NDRPeriod.componentName = "Normal Deduction Period";
PERNDRDetailsPopup_NDRPeriod.isTemporary = function() { return true; }
PERNDRDetailsPopup_NDRPeriod.mandatoryOn = [PERNDRDetailsPopup_NDRRate.dataBinding];
PERNDRDetailsPopup_NDRPeriod.isMandatory = function()
{
	// NDR Period is mandatory if the NDR Rate has been entered.
	var NDRRate = Services.getValue(PERNDRDetailsPopup_NDRRate.dataBinding);
	return !CaseManUtils.isBlank(NDRRate);
}

PERNDRDetailsPopup_NDRPeriod.logicOn = [PERNDRDetailsPopup_NDRPeriod.dataBinding];
PERNDRDetailsPopup_NDRPeriod.logic = function(event)
{
	if ( event.getXPath() != PERNDRDetailsPopup_NDRPeriod.dataBinding )
	{
		return;
	}

	// Set the status field
	Services.setValue(XPathConstants.PERSTATUS_XPATH, UpdateAECode.PERSTATUS_DETSCHANGED);
}

/******************************** BUTTONS *****************************************/

function Query_OwningCourtLOVButton() {}
Query_OwningCourtLOVButton.tabIndex = 5;
Query_OwningCourtLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Query_OwningCourtLOVButton.isEnabled = function()
{
	return !isAERecordLoaded();
}

/**********************************************************************************/

function Query_SearchButton() {}
Query_SearchButton.tabIndex = 6;
Query_SearchButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F1, element: "manageAEEvents" } ]
	}
};

Query_SearchButton.enableOn = [Query_CaseNumber.dataBinding, Query_AENumber.dataBinding, XPathConstants.FORM_STATE_XPATH];
Query_SearchButton.isEnabled = function()
{
	var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
	var aeNumber = Services.getValue(Query_AENumber.dataBinding);
	if ( CaseManUtils.isBlank(caseNumber) && CaseManUtils.isBlank(aeNumber) )
	{
		// No case number or AE number entered in search
		return false;
	}
	else if ( null != Query_CaseNumber.validate() || null != Query_AENumber.validate() )
	{
		// Case Number or AE number entered are invalid
		return false;
	}
	else if ( isAERecordLoaded() && Services.countNodes(XPathConstants.QUERY_XPATH + "/Results/AERecord") == 1 )
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
	if ( isAERecordLoaded() )
	{
		Services.dispatchEvent("QueryAE_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else
	{
		var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
		var aeNumber = Services.getValue(Query_AENumber.dataBinding);
		var owningCourtCode = Services.getValue(Query_OwningCourtCode.dataBinding);
		var params = new ServiceParams();

		// Any submitted 'like' search criteria must be surounded by "%"
		var paramValue = CaseManUtils.isBlank(caseNumber) ? "" : caseNumber;
		params.addSimpleParameter("caseNumber", paramValue);

		var paramValue = CaseManUtils.isBlank(aeNumber) ? "" : aeNumber;
		params.addSimpleParameter("aeNumber", paramValue);

		var paramValue = CaseManUtils.isBlank(owningCourtCode) ? "" : owningCourtCode;
		params.addSimpleParameter("owningCourtCode", paramValue);

		Services.callService("searchAe", params, Query_SearchButton, true);	
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
	var numberResults = Services.countNodes(XPathConstants.QUERY_XPATH + "/Results/AERecord");
	if ( numberResults > 1 )
	{
		// Process the Live AE Events to detemine if the AE is Live
		setAELiveStatusFlags(numberResults);
	
		// Multiple records returned from query, launch popup
		Services.dispatchEvent("QueryAE_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
	}
	else if ( numberResults == 1 )
	{
		// Single record returned, skip the popup and load the data
		loadAERecord();
	}
	else
	{
		// No results returned
		alert(Messages.NO_RESULTS_MESSAGE);
		Services.setFocus("Query_CaseNumber");
	}
}

Query_SearchButton.onError = function(exception) {}

/**********************************************************************************/

function Header_ObligationsExistButton() {}
Header_ObligationsExistButton.tabIndex = 7;
Header_ObligationsExistButton.enableOn = [XPathConstants.DATA_XPATH + "/ActiveObligationsExist", XPathConstants.FORM_STATE_XPATH];
Header_ObligationsExistButton.isEnabled = function()
{
	if ( Services.getValue(XPathConstants.DATA_XPATH + "/ActiveObligationsExist") != "true")
	{
		return false;
	}
	return isAERecordLoaded();
}

/**
 * @author rzxd7g
 * 
 */
Header_ObligationsExistButton.actionBinding = function()
{
	setCaseNumberToApp(MaintainObligationsParams.CASE_NUMBER);
	Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
	Services.setValue(MaintainObligationsParams.EVENT_TYPE, "A");
	var navArray = Array(NavigationController.OBLIGATIONS_FORM, NavigationController.AE_EVENTS_FORM);
	navigateToScreen(navArray);
};

/**********************************************************************************/

function Header_PERNDRButton() {}
Header_PERNDRButton.tabIndex = 8;
Header_PERNDRButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Header_PERNDRButton.isEnabled = isAERecordLoaded;

/**********************************************************************************/

function Master_PreviousButton() {}
Master_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "manageAEEvents", alt: true } ]
	}
};
Master_PreviousButton.tabIndex = 11;
Master_PreviousButton.enableOn = [XPathConstants.FORM_STATE_XPATH, XPathConstants.AE_PAGENUMBER_XPATH];
Master_PreviousButton.isEnabled = function()
{
	if ( !isAERecordLoaded() )
	{
		return false;
	}
	
	// Disable Previous button if on first page
	var pageNumber = Services.getValue(XPathConstants.AE_PAGENUMBER_XPATH);
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
	var pageNumber = parseInt(Services.getValue(XPathConstants.AE_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.AE_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Dirty Flag Check
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		loadAERecord();
	}
}

/**********************************************************************************/

function Master_NextButton() {}
Master_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "manageAEEvents", alt: true } ]
	}
};
Master_NextButton.tabIndex = 12;
Master_NextButton.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventGrid.srcData];
Master_NextButton.isEnabled = function()
{
	if ( !isAERecordLoaded() )
	{
		return false;
	}
	
	var countRecords = Services.countNodes( Master_AEEventGrid.srcData + "/" + Master_AEEventGrid.rowXPath );
	if ( countRecords == AEEventConstants.PAGE_SIZE )
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
	var pageNumber = parseInt(Services.getValue(XPathConstants.AE_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.AE_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Dirty Flag Check
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		loadAERecord();
	}
}

/**********************************************************************************/

function Master_AEEventLOVButton() {}
Master_AEEventLOVButton.tabIndex = 15;
Master_AEEventLOVButton.enableOn = [XPathConstants.FORM_STATE_XPATH];
Master_AEEventLOVButton.isEnabled = isAERecordLoaded;

/**********************************************************************************/

function Master_AddAEEventButton() {}
Master_AddAEEventButton.tabIndex = 16;
Master_AddAEEventButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "manageAEEvents" } ]
	}
};

Master_AddAEEventButton.enableOn = [XPathConstants.FORM_STATE_XPATH, Master_AEEventId.dataBinding];
Master_AddAEEventButton.isEnabled = function()
{
	if ( !isAERecordLoaded() )
	{
		return false;
	}
	var eventId = Services.getValue(Master_AEEventId.dataBinding);
	if ( CaseManUtils.isBlank(eventId) || !Services.getAdaptorById("Master_AEEventId").getValid() )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
Master_AddAEEventButton.actionBinding = function()
{
	if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
	{
		// User wishes to save changes before attempting to create a new event.
		Services.setValue(XPathConstants.ACTION_AFTER_RET_XPATH, ActionAfterSave.ACTION_CREATENEWEVENT);
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Call the validation service and ignore any changes made
		callNewEventValidationService();
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Master_AddAEEventButton.onSuccess = function(dom)
{
	Services.replaceNode(XPathConstants.EVENTVALIDATION_XPATH, dom);
	var mainEventId = Services.getValue(Master_AEEventId.dataBinding);
	
	/********** ERROR MESSAGE CHECKS *************/
	var ec = null;
	
	// Perform Pre-requisite Event Check
	var chkPreReqEvts = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionEventMustExist");
	var chkPreReqRspFiled = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionLaterResponseEventCheck");
	var chkPrevOrderRspTime = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionServiceDateCheck");
	if ( null == ec && ( chkPreReqEvts == "true" || chkPreReqRspFiled == "true" || chkPrevOrderRspTime == "true" ) )
	{
		// Check if any pre-requisite events DO exist
		var countPreReqEvts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreConditionEventsMustExist/Event[./RecordedAgainstAe = 'true']");
		
		// Check if any pre-requisite events have responses filed
		var countPreReqRspEvts = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreConditionEventsMustExist/Event[./ResponseFiled = 'true']");
		
		if ( chkPreReqEvts == "true" && countPreReqEvts == 0 )
		{
			// No Prerequisite events exist
			// Get a list of pre-requisite events that need exist against the AE
			var eventList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreConditionEventsMustExist/Event/EventId");
			if ( mainEventId == "871" )
			{
				// Event 871 has specific rules around pre-requisite events - if 851 is not available
				// Display warning message
				evt851DoesNotExist = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreConditionEventsMustExist/Event[./EventId = 851 and ./RecordedAgainstAe = 'false']");
				if ( evt851DoesNotExist )
				{
					alert( Messages.AE_NON55SERVED_MESSAGE );
				}
			}
			else
			{
				// Construct the error message dynamically
				var msgText = XML.getNodeTextContent(eventList[0]);
				var el = eventList.length;
				if ( el > 1 )
				{
					// Multiple missing events
					for ( var i=1; i<el; i++ )
					{
						var eventId = XML.getNodeTextContent(eventList[i]);
						if ( i == (el-1) )
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
		}
		else if ( chkPreReqRspFiled == "true" && mainEventId != "871" && countPreReqRspEvts > 0 )
		{
			// If the required previous event does exist but has a later response (i.e. events 858 or 859 already exist), display warning message: RESPONSEHASBEENFILED_MESSAGE
			// When create event other than event 871, if the required previous event exists and is 851, 852 or 853, then if there is a response exists against the previous event, display warning message: RESPONSEHASBEENFILED_MESSAGE
			alert( Messages.RESPONSEHASBEENFILED_MESSAGE );
		}
		else if ( chkPrevOrderRspTime == "true" )
		{
			// Get a list of all service dates for pre-req events where a response has NOT been filed
			var serviceDateList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreConditionEventsMustExist/Event[./ResponseFiled = 'false']/ServiceDate");
			var sdl = serviceDateList.length
			if ( null != serviceDateList && sdl != 0 )
			{
				var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
				var eightDaysInPast = CaseManUtils.daysInPast(today, 8, true);
				
				for ( var i=0; i<sdl; i++ )
				{
					var tempServiceDate = XML.getNodeTextContent(serviceDateList[i]);
					if ( null != tempServiceDate )
					{
						var serviceDate = CaseManUtils.createDate( tempServiceDate );
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
	
	// Perform PER Details Validation Check
	var chkPERDetails = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PERDetailsRequired");
	if ( null == ec && chkPERDetails == "true" )
	{
		var PERDetailsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PerAndNdrPeriodsExist");
		if ( PERDetailsExist == "false" )
		{
			// PER/NDR Details must exist but they are missing
			ec = ErrorCode.getErrorCode("CaseMan_PERNDRIncomplete_Msg");
		}
	}
	
	// Perform Employer Details Validation Check
	var chkEmpDetails = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/EmployerDetailsRequired");
	if ( null == ec && chkEmpDetails == "true" )
	{
		var EmpNamedPersonRequired = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/EmployerNamedPersonRequired");
		if ( EmpNamedPersonRequired == "true" )
		{
			var EmpDetailsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/EmpAndNamedPersonDetailsExist");
			if ( EmpDetailsExist == "false" )
			{
				// Employer Details must exist but they are missing
				ec = ErrorCode.getErrorCode("CaseMan_AE_EmpAddressIncomplete_Msg");
			}			
		}
		else
		{
			var EmpDetailsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/EmployerDetailsExist");
			if ( EmpDetailsExist == "false" )
			{
				// Employer Details must exist but they are missing
				ec = ErrorCode.getErrorCode("CaseMan_AE_EmpAddressIncomplete_Msg");
			}			
		}
	}
	
	// Perform Outstanding Balance Validation Check
	var chkOutBalance = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionAEOutstandingBalanceCheck");
	if ( null == ec && chkOutBalance == "true" )
	{
		var outBalance = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/OutstandingBalance");
		if ( parseFloat(outBalance) <= 0.01 )
		{
			// Outstanding balance must be greater than 0.01
			ec = ErrorCode.getErrorCode("CaseMan_AE_OutstandingAEOnePence_Msg");
		}
	}
	
	// Previous AE Hearing Type Check
	var chkPrevAEHrgType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionPastAeHearingCheck");
	if ( null == ec && chkPrevAEHrgType == "true" )
	{
		var prevHrgsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/HasPastAeHearings");
		if ( prevHrgsExist == "false" )
		{
			// No previous Hearings of with an AE Hearing Type exist
			ec = ErrorCode.getErrorCode("CaseMan_AE_PrevHrgDoesNotExist_Msg");
		}
	}
	
	// AE Hearing Type Check
	var chkAEHrgType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionAeHearingCheck");
	if ( null == ec && chkAEHrgType == "true" )
	{
		var hrgsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/HasAeHearings");
		if ( hrgsExist == "false" )
		{
			// No Hearings of with an AE Hearing Type exist
			ec = ErrorCode.getErrorCode("CaseMan_AE_HrgDoesNotExist_Msg");
		}
	}
	
	// Perform AE Type Checks
	var chkAETypes = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/ValidAETypes");
	if ( null == ec && chkAETypes == "true" )
	{
		var currentAEType = Services.getValue(XPathConstants.DATA_XPATH + "/ApplicationType");
		var validType = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/AeTypes/AeType[./Code = '" + currentAEType + "']");
	
		if ( validType == false )
		{
			var typeCategory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/AeTypes/AeType[1]/Code");
			switch (typeCategory)
			{		
				case "MN":
					// Event requires a Maintenance Arrears AE Type
					ec = ErrorCode.getErrorCode("CaseMan_AE_NonMaintenanceArrearsAEType_Msg");
					break;
					
				case "PM":
					// Event requires a Priority Maintenance AE Type
					ec = ErrorCode.getErrorCode("CaseMan_AE_NonPriorityMaintenanceAEType_Msg");
					break;
				
				default:
					// Event requires a Judgment AE Type
					ec = ErrorCode.getErrorCode("CaseMan_AE_NonJudgmentAEType_Msg");
			}
		}
	}
	
	/********** END ERROR MESSAGE CHECKS *************/
	
	if ( null == ec )
	{
		/********** WARNING MESSAGE CHECKS *************/	

		// Order Event - Hearing Date Passed Validation
		var chkOrderEvtHrgDate = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionFutureAeHearingCheck");
		if ( chkOrderEvtHrgDate == "true" )
		{
			var futureHrgsExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/HasFutureAeHearings");
			if ( futureHrgsExist == "true" )
			{
				var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
				var countHearings = Services.countNodes(XPathConstants.DATA_XPATH + "/FutureHearings/Hearing");
				
				for ( var i=1; i<=countHearings; i++ )
				{
					// Get the Hearing Date
					var hrgDate = Services.getValue(XPathConstants.DATA_XPATH + "/FutureHearings/Hearing[" + i + "]/HearingDate");
					var hrgDateObj = CaseManUtils.createDate( hrgDate );
					
					if ( CaseManUtils.compareDates(today, hrgDateObj) == 1 )
					{
						// The hearing has not yet passed, display dynamically generated warning message
						var hrgType = Services.getValue(XPathConstants.DATA_XPATH + "/FutureHearings/Hearing[" + i + "]/HearingType");
						var dispHrgDate = CaseManUtils.convertDateToDisplay(hrgDate);
						alert( Messages.format( Messages.HRGDATENOTPASSED_MESSAGE, Array(hrgType, dispHrgDate) ) );
					}
				}
			}
		}
		
		// Check if a previous order has been served
		var chkPrevOrderServed = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/PreConditionPreviousOrderCheck");
		if ( chkPrevOrderServed == "true" )
		{
			var isServed = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeRelatedData/PreviousOrderExists");
			if ( isServed == "true" )
			{
				// Warn user that a previous order has been served
				alert( Messages.PREVORDERNOTSERVED_MESSAGE );
			}
		}

		/********** END WARNING MESSAGE CHECKS *************/

		// Raise the add event popup
		Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
		
		var confidentialityWarning = Services.getValue(XPathConstants.DATA_XPATH + "/FlagConfidentiality");
		if ( confidentialityWarning == "true" )
		{
			// Warn user that a party on the case has requested confidentiality
			alert(Messages.CONFIDENTIALITY_MESSAGE);
		}
		
		// Set popup data with default data
		Services.startTransaction();
		Services.setValue(AddEvent_DateReceived.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.setValue(AddEvent_Details.dataBinding, "");
		Services.setValue(AddEvent_EventDate.dataBinding, CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
		Services.setValue(AddEvent_EventId.dataBinding, Services.getValue(Master_AEEventId.dataBinding) );
		var eventDescription = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_AEEventId.dataBinding + "]/StandardEventDescription");
		Services.setValue(AddEvent_EventDescription.dataBinding, eventDescription );
		Services.endTransaction();

	}
	else
	{
		// Set the error message in the status bar
		Services.setTransientStatusBarMessage( ec.getMessage() );
	}
}

/**********************************************************************************/

function Status_SaveButton() {}
Status_SaveButton.tabIndex = 30;
Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "manageAEEvents" } ]
	}
};

/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	// Check if Data has been loaded and is dirty
	if ( isAERecordLoaded() && isDataDirty() )
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
			var node = Services.getNode(XPathConstants.DATA_XPATH);
			var updatedNodes = Services.countNodes(XPathConstants.DATA_XPATH + "/AEEvents/AEEvent[./Status != 0]");
			if ( updatedNodes == 0 )
			{
				// No Ae Events have been updated, only PER/NDR Details, cannot send back no AE Events
				// so send them all back
				dataNode.appendChild(node);
			}
			else
			{
				// At least one AE Event has been updated so only send back those that have been updated
				var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH);
				dataNode.appendChild(strippedNode);
			}

			var params = new ServiceParams();
			params.addDOMParameter("aeEvents", dataNode);
			Services.callService("updateAeEvents", params, Status_SaveButton, true);
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
			
		case ActionAfterSave.ACTION_CLEARFORM:
			// User wishes to clear the form following a save
			clearFormData();
			break;
			
		case ActionAfterSave.ACTION_EXIT:
			// User wishes to exit the screen following a save
			exitScreen();
			break;
		
		case ActionAfterSave.ACTION_LOADNEWAE:
			// User loading a new record from query following a save
			loadNewAENumberFromQuery();
			break;
			
		case ActionAfterSave.ACTION_PERREPORT:
			// User requesting to run the PER Report from the navigation bar dropdown
			runPERReport();
			break;
			
		default:
			// No actions to save, 
			loadAERecord();
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
		loadAERecord();
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
Status_SaveButton.onAuthorizationException = function(exception) 
{
	handleAuthorizationException(exception);
}

/**********************************************************************************/

function Status_ClearButton() {}
Status_ClearButton.tabIndex = 31;
Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "manageAEEvents", alt: true } ]
	}
};

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
Status_CloseButton.tabIndex = 42;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;
Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "manageAEEvents" } ]
	}
};

/**********************************************************************************/

function AddEvent_DetailsLOVButton() {}
AddEvent_DetailsLOVButton.tabIndex = 43;
AddEvent_DetailsLOVButton.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain"];
AddEvent_DetailsLOVButton.isEnabled = function()
{
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/AeEventConfiguration/DetailsLOVDomain");
	return !CaseManUtils.isBlank(detailsLOV);
}

/**********************************************************************************/

function AddEvent_SaveButton() {}
AddEvent_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "AddEvent_Popup" } ]
	}
};
AddEvent_SaveButton.tabIndex = 47;
AddEvent_SaveButton.validationList = ["AddEvent_DateReceived","AddEvent_Stage","AddEvent_Details","AddEvent_Service","AddEvent_BailiffId","AddEvent_EventDate"];
AddEvent_SaveButton.enableOn = [AddEvent_DateReceived.dataBinding,AddEvent_Stage.dataBinding,AddEvent_Details.dataBinding,AddEvent_Service.dataBinding,AddEvent_BailiffId.dataBinding,AddEvent_EventDate.dataBinding];
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
		// Lower the add event popup
		Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	
		// Construct New Event DOM to pass to the server
		var newEvent = Services.loadDOMFromURL("NewAEEvent.xml");
		newEvent.selectSingleNode("/AEEvent/OwningCourtCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Query_OwningCourtCode.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/CaseNumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Query_CaseNumber.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/AENumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Query_AENumber.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/JudgmentDebtorPartyRoleCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.DATA_XPATH + "/JudgmentDebtor/PartyRoleCode") ) ) );
		newEvent.selectSingleNode("/AEEvent/JudgmentDebtorCasePartyNumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.DATA_XPATH + "/JudgmentDebtor/CasePartyNumber") ) ) );
		newEvent.selectSingleNode("/AEEvent/StandardEventId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventId.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/StandardEventDescription").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventDescription.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/EventDetails").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Details.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/EventDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventDate.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/Stage").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Stage.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/Service").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Service.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/BailiffId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_BailiffId.dataBinding) ) ) );
		newEvent.selectSingleNode("/AEEvent/ErrorInd").appendChild( newEvent.createTextNode( "N" ) );
		newEvent.selectSingleNode("/AEEvent/AEType").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.DATA_XPATH + "/ApplicationType") ) ) );

		// Calculate the default service date if the service status POSTAL
		var userId = Services.getCurrentUser();
		var serviceDate = (Services.getValue(AddEvent_Service.dataBinding) == ServiceStatuses.POSTAL) ? calculatePostalServiceDate() : "";
		newEvent.selectSingleNode("/AEEvent/ServiceDate").appendChild( newEvent.createTextNode( serviceDate ) );
		newEvent.selectSingleNode("/AEEvent/UserName").appendChild( newEvent.createTextNode( userId ) );
		newEvent.selectSingleNode("/AEEvent/ReceiptDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_DateReceived.dataBinding) ) ) );

		clearAddEventFields();

		// Call the service
		var params = new ServiceParams();
		params.addDOMParameter("aeEvent", newEvent);
		Services.callService("addAeEvent", params, AddEvent_SaveButton, true);
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

	// Determine which screens to navigate to	
	var navigateToOb = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/Obligations");
	var navigateToWP = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/WordProcessing");
	var navigateToOR = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/OracleReport");
	
	// Set up the Navigation Array and set parameters in app section
	var navArray = new Array();
	
	if ( navigateToOb == "true" )
	{
		// Navigating to Obligations screen, check for multiuse = N mechanisms
		var oblActionFlow = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/Obligation/ActionFlow");
		if ( oblActionFlow == "EA" || oblActionFlow == "EO" )
		{
			// Inform user the obligation already exists
			alert(Messages.EVENTOBL_EXISTS_MESSAGE);
		}
		else
		{
			var blnOk = true;
			if ( oblActionFlow == "EM" ) 
			{
				// Check if obligation already exists
				alert(Messages.EVENTOBL_EXISTS_MESSAGE);
				var mMode = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/Obligation/ObligationRule/MaintenanceMode");
				if ( mMode != "C" )
				{
					blnOk = false;
				}
			}
			
			if ( blnOk )
			{
				// Get copy of parameters to pass to the Obligations screen
				var oblNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/Obligation");
				if ( oblActionFlow == "O" || oblActionFlow == "EM" )
				{
					// Navigation is optional, ask user to confirm
					if ( confirm(Messages.OBL_MESSAGE) )
					{
						// User wishes to Navigate to Obligations screen
						Services.replaceNode(MaintainObligationsParams.PARENT + "/Obligation", oblNode);
						navArray.push(NavigationController.OBLIGATIONS_FORM);
					}
				}
				else
				{
					// Navigation is mandatory
					Services.replaceNode(MaintainObligationsParams.PARENT + "/Obligation", oblNode);
					navArray.push(NavigationController.OBLIGATIONS_FORM);
				}
			}
		}
	}

	if ( navigateToWP == "true" )
	{
		// Navigating to the Word Processing / Oracle screen(s)
		// Add WP Node to the app section of the DOM
		var wpNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		
		// Build Z issue 142 - include AEEventSeq in the WpData node of the CaseMan form parameters, this is
		// where wordprocessing information is extracted from when navigated to via Maintain Obligations
		var aeEventSeqNode = dom.selectSingleNode("//AEEventSeq");
		if (null != aeEventSeqNode)
		{
			aeEventSeqNode = aeEventSeqNode.cloneNode(true);
			var wpEventNode = wpNode.selectSingleNode("Event");
			if (null != wpEventNode)
			{
				wpEventNode.appendChild(aeEventSeqNode);
			}
		}
					
		Services.replaceNode(CaseManFormParameters.WPNODE_XPATH, wpNode);

		navArray.push(NavigationController.WP_FORM);
	}
	if ( navigateToOR == "true" )
	{
		// Navigating to the Oracle Parameter screen.
		// Add OR Node to the app section of the DOM
		var orNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[last()]");
		var orDom = XML.createDOM();
		orDom.loadXML(orNode.xml);
		
		Services.replaceNode(CaseManFormParameters.ORNODE_XPATH, orNode);
		
		// Set Oracle Report Court Code to the owning court of the case record loaded - TRAC 2446
		Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Query_OwningCourtCode.dataBinding) );
		
		navArray.push(NavigationController.OR_FORM);
	}
	if ( navArray.length > 0 )
	{
		// Set Call Stack to return to the Events screen
		navArray.push(NavigationController.AE_EVENTS_FORM);
		NavigationController.createCallStack(navArray);
		for (var i=0; i<navArray.length; i++)
		{
			if (navArray[i] == NavigationController.OR_FORM)
			{
				// Handle Navigation to Oracle Report Parameter Screens
				// Skip screen so does not go to surrogate OR page
				NavigationController.skipScreen();
				var nextScreen = NavigationController.getNextScreen();
				NavigationController.skipScreen();
				
				// Make call to Oracle Report Controller
				navigating = true;
				WP.ProcessORA(FormController.getInstance(), orDom, nextScreen );
				refreshScreen = true;
			}
			else if (navArray[i] == NavigationController.WP_FORM)
			{
				// Handle Navigation to Oracle Report Parameter Screens
				// Skip screen so does not go to surrogate WP page
				NavigationController.skipScreen();
				var nextScreen = NavigationController.getNextScreen();
				NavigationController.skipScreen();
				
				var navORAndWP = false;
				if ( nextScreen == NavigationController.OR_FORM )
				{
					// Check to ensure events which go to both WP and OR don't fall over
					nextScreen = NavigationController.getNextScreen();
					NavigationController.skipScreen();
					navORAndWP = true;
				}
				
				var aenumber = Services.getValue("/ds/ManageAEEvents/AENumber");
				var wpNode = wpDom.selectSingleNode("WordProcessing/Event");
				var aeNumberNode = XML.createElement(wpNode,"AENumber");
				wpNode.appendChild(aeNumberNode);
				XML.setElementTextContent( wpNode, "./AENumber", aenumber);

				var aeEventSeqNode = dom.selectSingleNode("//AEEventSeq");
				var aeEventSeq = "";
				if (null != aeEventSeqNode) {
					aeEventSeqNode = aeEventSeqNode.cloneNode(true);				
					wpNode.appendChild(aeEventSeqNode);
				}
				
				// Make call to Word Processing Controller
				WP.ProcessWP(FormController.getInstance(), wpDom, nextScreen );
				
				if ( navORAndWP )
				{
					// Make call to Oracle Report Controller
					WP.ProcessORA(FormController.getInstance(), orDom, nextScreen );
				}
				
				refreshScreen = true;
				navigating = true;
			}
			else
			{
				navigating = true;
				NavigationController.nextScreen();
			}
			if (navigating) { break; }
		}
	}

	else
	{
		// No need to navigate anywhere, refresh screen
		loadAERecord();
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
AddEvent_CancelButton.tabIndex = 48;
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
QueryPopup_OkButton.tabIndex = 61;
QueryPopup_OkButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "QueryPopup_AENumberGrid"} ]
	}
};

/**
 * @author rzxd7g
 * 
 */
QueryPopup_OkButton.actionBinding = function()
{
	if ( isAERecordLoaded() )
	{
		var currentAENumber = Services.getValue(Query_AENumber.dataBinding);
		var selectedAENumber = Services.getValue(QueryPopup_AENumberGrid.dataBinding);
		
		if ( currentAENumber == selectedAENumber )
		{
			// Same record selected, lower popup without loading the data again
			Services.dispatchEvent("QueryAE_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		}
		else
		{
			// New record selected
			if ( isDataDirty() && confirm(Messages.DETSLOST_MESSAGE) )
			{
				Services.setValue(XPathConstants.ACTION_AFTER_SAVE_XPATH, ActionAfterSave.ACTION_LOADNEWAE);
				Status_SaveButton.actionBinding();
			}
			else
			{
				loadNewAENumberFromQuery();
			}
		}
	}
	else
	{
		Services.dispatchEvent("QueryAE_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		loadAERecord();	
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
QueryPopup_OkButton.onSuccess = function(dom)
{
	// replace the main node
	Services.startTransaction();
	Services.replaceNode(XPathConstants.DATA_XPATH, dom);
	Services.setValue(XPathConstants.FORM_STATE_XPATH, FormStates.STATE_MODIFY);
	Services.setValue(XPathConstants.DIRTYFLAG_XPATH, "");
	Services.endTransaction();
	
	var tempAction = Services.getValue(XPathConstants.ACTION_AFTER_RET_XPATH);
	Services.setValue(XPathConstants.ACTION_AFTER_RET_XPATH, "");
	if ( ActionAfterSave.ACTION_CREATENEWEVENT == tempAction )
	{
		// User wishes to attempt to create a new event after saving (must be done after retrieval)
		callNewEventValidationService();
	}
	else
	{
		// Set the grid to point at the new event if one has just been created
		var newEventId = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/AEEventSeq");
		if ( !CaseManUtils.isBlank(newEventId) )
		{
			Services.setValue(Master_AEEventGrid.dataBinding, newEventId);
			Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/AEEventSeq", "");
		}
	}
	
	// Clear the Oracle Report Court Code constant when load case events in QueryPopup_OkButton.onSuccess() - TRAC 2446
	Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, "");
}

/**********************************************************************************/

function QueryPopup_CancelButton() {}
QueryPopup_CancelButton.tabIndex = 62;

/**********************************************************************************/

function PERNDRDetailsPopup_OkButton() {}
PERNDRDetailsPopup_OkButton.tabIndex = 74;
PERNDRDetailsPopup_OkButton.validationList = ["PERNDRDetailsPopup_PERRate", "PERNDRDetailsPopup_PERPeriod", "PERNDRDetailsPopup_NDRRate", "PERNDRDetailsPopup_NDRPeriod"];
PERNDRDetailsPopup_OkButton.enableOn = [PERNDRDetailsPopup_PERRate.dataBinding, PERNDRDetailsPopup_PERPeriod.dataBinding, PERNDRDetailsPopup_NDRRate.dataBinding, PERNDRDetailsPopup_NDRPeriod.dataBinding];
PERNDRDetailsPopup_OkButton.isEnabled = function()
{
	// Perform mandatory field checks
	var perRate = Services.getValue(PERNDRDetailsPopup_PERRate.dataBinding);
	if ( PERNDRDetailsPopup_PERRate.isMandatory() && CaseManUtils.isBlank(perRate) )
	{
		return false;
	}
	
	var perPeriod = Services.getValue(PERNDRDetailsPopup_PERPeriod.dataBinding);
	if ( PERNDRDetailsPopup_PERPeriod.isMandatory() && CaseManUtils.isBlank(perPeriod) )
	{
		return false;
	}

	var ndrRate = Services.getValue(PERNDRDetailsPopup_NDRRate.dataBinding);
	if ( PERNDRDetailsPopup_NDRRate.isMandatory() && CaseManUtils.isBlank(ndrRate) )
	{
		return false;
	}
	
	var ndrPeriod = Services.getValue(PERNDRDetailsPopup_NDRPeriod.dataBinding);
	if ( PERNDRDetailsPopup_NDRPeriod.isMandatory() && CaseManUtils.isBlank(ndrPeriod) )
	{
		return false;
	}

	// Disabled if any invalid fields
	if ( !CaseManValidationHelper.validateFields(PERNDRDetailsPopup_OkButton.validationList, true) )
	{
		return false;
	}
	return true;
}

/**
 * @author rzxd7g
 * 
 */
PERNDRDetailsPopup_OkButton.actionBinding = function()
{
	if ( PERNDRDetailsPopup_OkButton.isEnabled() )
	{
		// Transfer the Temporary Data to the Main Data Node
		var tempPERNode = Services.getNode(XPathConstants.TEMP_PERDETAILS_XPATH);
		Services.replaceNode(XPathConstants.DATA_XPATH + "/PERNDRDetails", tempPERNode);

		if ( Services.getValue(XPathConstants.PERSTATUS_XPATH) == UpdateAECode.PERSTATUS_DETSCHANGED )
		{
			// Set the dirty flag when details change
			setDirtyFlag();
		}

		Services.dispatchEvent("PERNDRDetails_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	}
};

/**********************************************************************************/

function PERNDRDetailsPopup_CancelButton() {}
PERNDRDetailsPopup_CancelButton.tabIndex = 75;

/****************** ORACLE REPORTS PROGRESS BAR FIELDS ****************************/

function ProgressIndicator_Popup() {}
ProgressIndicator_Popup.onPopupClose = loadAERecord;

function Progress_Bar() {}
Progress_Bar.dataBinding 	= "/ds/ProgressBar/Progress";
Progress_Bar.isReadOnly = function() { return true; }

function Popup_Cancel() {};
Popup_Cancel.cancelled = false;
/**
 * @author rzxd7g
 * 
 */
Popup_Cancel.actionBinding = function() 
{
	Popup_Cancel.cancelled = true;
	Services.dispatchEvent("ProgressIndicator_Popup", PopupGUIAdaptor.EVENT_LOWER);
}

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
		doubleClicks: [ {element: "Master_AEEventGrid"} ],
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
			var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/DocumentId");
			if (null == documentId || documentId == "")
			{
				Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Request", "Create");
			}
			else
			{
				Services.setValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/Request", "Open");
			}
			
			var eventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/AEEventSeq");
			var caseEventSeq = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/CaseEventSeq");
			
			var eventDetails = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/EventDetails");
			var eventStdId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/StandardEventId");
			var caseNumber = Services.getValue(Query_CaseNumber.dataBinding);
			var aeType = Services.getValue(XPathConstants.DATA_XPATH + "/ApplicationType");
			var aeNumber = Services.getValue(Query_AENumber.dataBinding);
			var welshParties = Services.getValue(XPathConstants.DATA_XPATH + "/WelshParties");
			var welshEmployer = Services.getValue(XPathConstants.DATA_XPATH + "/WelshEmployer");
			if ( welshEmployer == "Y" ) { welshParties = "Y"; }
			
			var wpNode = Services.getNode(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output");
			var wpDom = XML.createDOM();
			wpDom.loadXML(wpNode.xml);	
			
			var txDOM = XML.createDOM();
			txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
	          "<xsl:output method='xml' indent='yes' />" +
	          "<xsl:template match='Output'>" +
	               "<WordProcessing>" +
	               		"<Event>" +
		               		"<AEEventSeq>" + eventSeq + "</AEEventSeq>" +
	               			"<CaseEventSeq>" + caseEventSeq + "</CaseEventSeq>" +
	               			"<StandardEventId>" + eventStdId + "</StandardEventId>" +
	               			"<AENumber>" + aeNumber + "</AENumber>" +
	               			"<EventDetails>" + eventDetails +"</EventDetails>"+
	               		"</Event>" +
	               		"<Case>" +
		               		"<CaseNumber>" + caseNumber + "</CaseNumber>" +
	               			"<CaseType>" + aeType + "</CaseType>" +
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
			WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.AE_EVENTS_FORM, false);			
		}
		else if ( outputType == "OR" )
		{
			// Call Oracle Reports
			var documentId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/DocumentId");
			var reportId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/ReportId");
			var orderId = Services.getValue(XPathConstants.SELECTED_EVENT_XPATH + "/Outputs/Output/OutputId");
			
			if ( isOraReportReprinted(orderId) )
			{
				// Can be reprinted
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
			else
			{
				// Should be opened in an Adobe Acrobat Reader Window
				Services.showDocument(documentId, documentId);
			}
		}
	}
	else if ( countOutputs > 1 )
	{
		// Launch the subform
		Services.dispatchEvent("selectEventOutput_subform", BusinessLifeCycleEvents.EVENT_RAISE);
	}
}

/**
 * @author rzxd7g
 * 
 */
function ReprintOracleReport()
{
}

/**
 * @param resultDom
 * @author rzxd7g
 * 
 */
ReprintOracleReport.onSuccess = function(resultDom)
{
	alert("Report Printed.");
}
