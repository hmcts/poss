/** 
 * @fileoverview ManageEvents.js:
 * This file contains the field configurations for UC002 - Manage Case Events screen
 *
 * @author Chris Vincent
 * @version 0.1
 *
 * Change History:
 * 13/06/2006 - Chris Vincent, made some changes to the section where Oracle Reports
 *				called to use CaseManFormParameters.ORNODE_XPATH instead of WPNODE_XPATH
 *				for when both Oracle Reports and Word Processing are called for an event.
 * 14/06/2006 - Chris Vincent, transform to model on event details fields changed to 
 *				strip out trailing and leading spaces.
 * 14/06/2006 - Anoop Sehdev, changed way in which WP is called when double clicking on grid.
 * 20/06/2006 - Chris Vincent, implemented the CCBC Case Details button actionBinding.
 * 13/07/2006 - Chris Vincent, added Previous and Next buttons to allow paging on the case events
 * 				screen.  100 records at a time are returned.  Ref - defect 4018.
 * 28/07/2006 - Chris Vincent, added additional enablement rule to the fields in the Event Details 
 * 				Panel so are disabled if the grid is empty which is now possible with paging.
 * 02/08/2006 - Chris Vincent, The Details of Claim currency fields also were updated to increase the 
 * 				max length to 3 characters as migrated data with GBP in these fields were flagging as 
 * 				incorrect.  Problem discovered in DMST, awaiting defect number.
 * 03/08/2006 - Chris Vincent, added constant for automatic event subject type (as event 600 is auto
 * 				for CaseMan but can be manually added in CaseMan).  Events with this subject type are
 * 				treated the same as no subject so changes made throughout wherever no subject constant
 * 				is referenced.
 * 15/08/2006 - Chris Vincent, the call to WP.ProcessWP in the Add Event Save button onSuccess changed
 * 				to include the alwaysCallback parameter so if WP is called with no variable text screen
 * 				and no FCKEditor screen (e.g. event 43), the screen refreshes to see the new event.
 * 				Defect 4278.
 * 22/08/2006 - Chris Vincent, added guard in function AddEvent_Subject.logic() to prevent logic functionality
 * 				if the subject entered is not in the list of values.  Defect 4557.
 * 23/08/2006 - Chris Vincent, reorganised rules for AddEvent_SaveButton.isEnabled function as clearing a 
 * 				mandatory Details field and then clicking Save resulted in an unresponsive (and enabled) save
 * 				button.  Defect 4563.
 * 23/11/2006 - Chris Vincent, partial fix for defect 5827 by adding a HearingCreated node to the WP DOM passed
 * 				in the functions launchOutputLogic.logic() & selectEventOutput_subform.processReturnedData().
 * 25/11/2006 - Chris Vincent, gave the SubjectPopup_SubjectLOVGrid a tab index so focus is set on the grid 
 * 				when the Subject LOV popup is raised.  UCT Defect 719.
 * 30/11/2006 - Chris Vincent, added validation to the Master_AddEventButton.onSuccess() preventing event
 * 				creation (if configured) when no Part 20 Claimant or Part 20 Defendants exist (UCT Defect 790).
 * 15/01/2007 - Chris Vincent, change to Header_CaseNumber.onSuccess() when navigate to Case Events screen from
 * 				another screen and the case number entered does not exist (e.g. on foreign warrant).  Previously
 * 				had error and went to onError.  Now will handle in same way as if non-existant case number entered
 * 				directly.  Temp_CaseMan defect 408.
 * 16/01/2007 - Chris Vincent, added read only Header_MCOLCaseFlag field to indicate that a case is MCOL.
 * 				UCT_Group2 defect 1125.
 * 23/01/2007 - Chris Vincent, updated the currency field transform to display and model functions to use the standard
 * 				CaseManUtils functions.  Temp_CaseMan Defect 309.
 * 31/01/2007 - Chris Vincent, change made so if create event and are not navigating, ensure the Events screen
 * 				is removed from the callstack.  CaseMan Defect 5944.
 * 20/03/2007 - Chris Vincent, change to the case status not stayed validation on event creation to widen the
 * 				validation so some events can be invalid for a number of case statuses and not just one status.
 * 				Temp_CaseMan Defect 310.
 * 22/03/2007 - Chris Vincent, added EventDetails_CreatedBy.transformToDisplay() to display the User Alias instead
 * 				of the User Id if present in DCA_USER otherwise user id is displayed.  CaseMan Defect 6000.
 * 23/11/2006 - Mark Groen, fixing CaseMan defect 6039. This concerns reprinting reports and the user requiring 
 *				more detail in the selectEventOutput_subform. A correct description is now returned by the service
 *				and an addition tag now holds the ReportId.  Changed this file so it sends the correct detail to 
 *				the reprintReport service.
 * 18/04/2007 - Chris Vincent, new requirement for CCBC, added the subject type SubjectTypeCodes.CASEDEF which caters
 * 				for all defendants or CASE (similar to CPARTY_T6).
 * 24/04/2007 - Chris Vincent, part fixing CaseMan defect 6058 by introducing Determination Judgment validation i.e. 
 *				the instigators selected should match the parties for on the judgment where the party against is the
 *				the subject selected.
 * 01/05/2007 - Chris Vincent, adding two new validation rules, the first for events which cannot be created for non
 * 				CCBC cases and also for new ccbc Judgment validation on the subject.  Group2 Defect 1368.
 * 31/05/2007 - Chris Vincent, UCT Group2 Defect 1290 / CaseMan Defect 6171.  Populating new set case status flag for events
 * 				where the case status should be set if the subject is CASE or there is only one possible subject.
 * 05/07/2007 - Chris Vincent, UCT_Group2 Defect 1455, extended the work done for 1290/6171 to cover scenario where many
 *				defendants on the case and all of them are assigned a particular event.
 * 09/08/2007 - Chris Vincent, added some new CaseEventConstants for use by checkCCBCValidEvent() for UCT_Group2 Defect 1526
 * 05/10/2007 - Chris Vincent, updated Header_CaseDetailsReportButton.isEnabled to allow the Case Details
 * 				Report button to be called from non-CCBC courts if the user is a CCBC Manager or CCBC User.
 * 				UCT_Group2 Defect 1558.
 * 15/10/2007 - Chris Vincent, added enablement rules to Master_AddEventButton.additionalBindings to include
 * 				check if case is valid.  Also updated EventDetails_SubjectNumber.enableOn and 
 * 				Master_AddEventButton.isEnabled.  UCT_Group2 Defect 1555.
 * 02/11/2007 - Chris Vincent, updated case event retreival code to reset the main grid's sort order when a new
 * 				case record is loaded.  PPE issue #8
 * 13/11/2007 - Chris Vincent, added TransferCaseShortcutLogic functionality to allow F8 keybinding navigation
 * 				to the Transfer Cases screen (cannot use Menubar code as framework wil not apply keybindings to 
 * 				nav links in the quicklinks menu.  UCT_Group2 Defect 1415.
 * 14/07/2008 - Sandeep Mullangi (Logica) Adding Insolvency Number changes. RFC486
 * 11-08-2008 - Sandeep Mullangi - Changes to remove autotabbing for insolvency number & year
 * 11-11-2008 - Sandeep Mullangi - insolvency Number search - removing autotabbing of owning court field
 * 13-11-2008 - Sandeep Mullangi - Insolvency Number Changing the tabbing order and pre-populating owning court
 * 27-01-2009 - Sandeep Mullangi - Changing the Insolvency Number Required Message.
 * 20-04-2009 - Chris Vincent - Changed Insolvency Number field validation to cope with alphanumeric values and numeric values
 * 				less than 4 digits long.  TRAC Ticket 334.
 * 17-06-2009 - Mark Groen - When returning to this screen the court code does not always get updated. Pre populating the
 *              court code (insolvency change) was incorrect. TRAC Ticket 716.
 * 10/02/2010 - Mark Groen,  AddEvent_SaveButton.onSuccess(), set Oracle Report Court Code constant - TRAC 2446
 *				Clear the Oracle Report Court Code constant when load case events in Header_CaseNumber.onSuccess() TRAC 2446
 * 02/08/2010 - Chris Vincent, Clear the WP and Oracle Report /ds/var/app XPath constants when load case events in 
 *				Header_CaseNumber.onSuccess().  Trac 1947.
 * 02/08/2010 - Mark Groen,  In the function TransferCaseShortcutLogic.logic(), remove the code referencing the oustanding payments check. 
				This is to remove the check from hitting the F8 button that takes the user to Tranfer Case screen  - TRAC 2810
 * 11/06/2012 - Chris Vincent, change to Header_CaseNumber.onSuccess() to check for pending transfer and display warning.  Trac 4692.
 * 15/11/2012 - Chris Vincent, change to launchOutputLogic.logic() so pass the Welsh Translation indicator to the WP Controller.  
 *				TransferReason for the case event might also be passed in.  Trac 4761
 * 29/01/2013 - Chris Vincent, added new fields Track and Amount Claimed (Trac 4763), Preferred Court (Trac 4764) and Judge (Trac 4768)
 * 04/07/2013 - Chris Vincent (Trac 4908). Case numbering change which means Case Number validation now uses common 
 *				CaseManValidationHelper.validateCaseNumber function.
 * 12/10/2016 - Chris Vincent (Trac 5883). Adding jurisdiction to the word processing XML
 * 14/10/2016 - Chris Vincent (Trac 5880). Added warning when party on case has requested confidentiality.
 */

/**
 * XPath Constants
 * @author rzxd7g
 * 
 */
function XPathConstants() {};
XPathConstants.VAR_APP_XPATH = "/ds/var/app";
XPathConstants.VAR_FORM_XPATH = "/ds/var/form";
XPathConstants.VAR_PAGE_XPATH = "/ds/var/page";
XPathConstants.REF_DATA_XPATH = XPathConstants.VAR_FORM_XPATH + "/ReferenceData";
XPathConstants.DATA_XPATH = "/ds/ManageCaseEvents";
XPathConstants.EVENTS_XPATH = XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = /ds/var/page/SelectedGridRow/SelectedEvent]";
XPathConstants.OBLIGATIONS_EXIST_XPATH = XPathConstants.DATA_XPATH + "/ActiveObligationsExist";
XPathConstants.WFT_EXIST_XPATH = XPathConstants.DATA_XPATH + "/WindowsForTrialExist";
XPathConstants.CASE_EXISTS_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CaseExists"
XPathConstants.CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/ChangesMade";
XPathConstants.CASE_CHANGES_MADE_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CaseChangesMade";
XPathConstants.TEMP_XPATH = XPathConstants.VAR_PAGE_XPATH + "/Tmp";
XPathConstants.EVENTDATA_XPATH = XPathConstants.TEMP_XPATH + "/EventData";
XPathConstants.EVENTVALIDATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/CaseEventValidationData";
XPathConstants.DETAILSOFCLAIM_XPATH = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/DetailsOfClaim";
XPathConstants.SUBJECT_TYPE_XPATH = XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/SubjectType";
XPathConstants.EVENTNAVIGATION_XPATH = XPathConstants.EVENTDATA_XPATH + "/CaseEventNavigationList";
XPathConstants.NEWEVENT_XPATH = XPathConstants.TEMP_XPATH + "/NewEvent";
XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH = XPathConstants.NEWEVENT_XPATH + "/CaseFlag";
XPathConstants.SYSTEMDATE_XPATH = XPathConstants.REF_DATA_XPATH + "/SystemDate";
XPathConstants.CCBC_CREDITORCODE_XPATH = XPathConstants.DATA_XPATH + "/CreditorCode";
XPathConstants.CE_PAGENUMBER_XPATH = XPathConstants.VAR_PAGE_XPATH + "/CurrentPageNumber";
XPathConstants.INSOLVENCY_NO_CONJOINED = XPathConstants.DATA_XPATH + "/InsolvencyNumber";

/**
 * Event Status constants
 * @author rzxd7g
 * 
 */
function EventStatuses() {};
EventStatuses.STATUS_DETSCHANGED = "DETAILS_CHANGED";
EventStatuses.STATUS_ERRCHANGED = "ERROR_CHANGED";

/**
 * Constants used to indicate the action to perform following a save
 * @author rzxd7g
 * 
 */
function PostSaveActions() {};
PostSaveActions.ACTION_AFTER_SAVE = "";
PostSaveActions.ACTION_NAVIGATE = "NAVIGATE";
PostSaveActions.ACTION_RESETCASESTATUS = "RESET_CASE_STATUS";
PostSaveActions.ACTION_RESETCASETYPE = "RESET_CASE_TYPE";
PostSaveActions.ACTION_CREATENEWEVENT = "CREATE_NEW_EVENT";
PostSaveActions.ACTION_CLEARFORM = "CLEAR_FORM";
PostSaveActions.ACTION_EXIT = "EXIT_SCREEN";
PostSaveActions.ACTION_CASEDETAILSREPORT = "CASE_DETAILS_REPORT";

/**
 * Enumeration of Subject Type Codes
 * @author rzxd7g
 * 
 */
function SubjectTypeCodes() {};
SubjectTypeCodes.NONE = "NONE_T1";			// No Subject (Type 1)
SubjectTypeCodes.DEFENDANTS = "DEF_T2T4";	// Subject is Defendant (Types 2 & 4)
SubjectTypeCodes.ALLPARTIES = "PARTY_T3T5";	// Subject is any Party (Types 3 & 5)
SubjectTypeCodes.CASE = "CPARTY_T6";		// Subject is any Party or Case (Type 6)
SubjectTypeCodes.DEBTCOMPANY = "DEBTCO_T8";	// Subject is any Debtor or Company (Type 8)
SubjectTypeCodes.APPLICANT = "APP_T9";	    // Subject is any Applicant (Type 9)
SubjectTypeCodes.AUTO = "AUTO_T7";	    	// Subject is any Applicant (Type 9)
SubjectTypeCodes.CASEDEF = "CDEF_T10";	    // Subject is any Defendant or Case (Type 10)
SubjectTypeCodes.CASEONLY = "CASE";	    	// Subject can only be CASE
SubjectTypeCodes.DEBTCOMTRUST = "DEBTCOTRST_T11";	// Subject is any Debtor, Company or Trustee party  (Type 11)

/**
 * Enumeration of Instigator Type Codes
 * @author rzxd7g
 * 
 */
function InstigatorTypeCodes() {};
InstigatorTypeCodes.NONE = "NONE_T1T2T5";		// No Instigator (Types 1,2 & 5)
InstigatorTypeCodes.CLAIMANTS = "CLAIMANT_T4";	// Instigator is Claimant or Claimants (Type 4)
InstigatorTypeCodes.ALLPARTIES = "PARTY_T3";	// Instigator is Any Party or Parties (Type 3)
InstigatorTypeCodes.NOTOFFREC = "PEXOR_T6";		// Any party excluding Official Receiver (Type 6)
InstigatorTypeCodes.CRED659 = "CREX659INS_T7";	// Any Creditor excluding any instigators on event 659 (Type 7)
InstigatorTypeCodes.CREDITOR = "CR_T8";			// Any Creditor (Type 8)
InstigatorTypeCodes.INSPRACT = "IP_T9";			// Any Insolvency Practitioner (Type 9)
InstigatorTypeCodes.PET_T10 = "PETITIONER_T10";	// Any Petitioner (Type 10)
InstigatorTypeCodes.DEFENDANTS = "DEF_T11";		// Any Defendant (Type 11)
InstigatorTypeCodes.CREDITORTRST = "CREDTRUST_T12";		// Any Creditor or Trustee (Type 12)
InstigatorTypeCodes.INSPRACTTRST = "IPTRUST_T13";		// Any Insolvency Practitioner or Trustee (Type 13)
InstigatorTypeCodes.PETTRST = "PETTRUST_T14";			// Any Petitioner or Trustee (Type 14)

/**
 * Static Class representing Case Event Constants e.g. the default page size
 * @author rzxd7g
 * 
 */
function CaseEventConstants() {};
CaseEventConstants.PAGE_SIZE = 100;
CaseEventConstants.CCBC_VALID_EVENTS_FOR_STAYED = [756, 999];
CaseEventConstants.STATUS_STAYED = "STAYED";

/****************************** MAIN FORM *****************************************/

function manageEvents() {}

/**
 * @author rzxd7g
 * 
 */
manageEvents.initialise = function()
{
	var extCaseNumber = Services.getValue(ManageCaseEventsParams.CASE_NUMBER);
	if ( !CaseManUtils.isBlank(extCaseNumber) )
	{
		// Case Number passed into screen
		retrieveCaseEvents(extCaseNumber);
	}
    else{
        //TRAC Ticket 716
        // if no case number provided retrieve the list of courts.
        // only need to set the default user court in Header_OwningCourtCode.onSuccess
        var params = new ServiceParams();
        if ( !Services.exists(XPathConstants.REF_DATA_XPATH + "/Courts") ){
            Services.callService("getCourtsShort", params, Header_OwningCourtCode, true);
        }
    }
}


/**
 * Load the reference data from the xml into the model but only when needed
 * @param dom
 * @param serviceName
 * @author rzxd7g
 * 
 */
manageEvents.onSuccess = function(dom, serviceName)
{
	switch (serviceName)
	{
		case "getStandardEvents":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/StandardEvents", dom);
			break;
		case "getSystemDate":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/SystemDate", dom);
			break;
		case "getCurrentCurrency":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency", dom);
			var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
			Services.setValue(Header_AmountClaimedCurrency.dataBinding, defaultCurrency);
			break;
		case "getCourtsShort":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Courts", dom);
			break;
		case "getTrackList":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/TrackList", dom);
			break;
    }
}

/******************************* SUBFORMS *****************************************/

function changeCaseType_subform() {}
changeCaseType_subform.subformName = "ChangeCaseTypeSubform";
/**
 * @author rzxd7g
 * 
 */
changeCaseType_subform.prePopupPrepare = function()
{
	// Send any data over to the Reset Case Type Subform
	prepareSubFormData(XPathConstants.VAR_FORM_XPATH + "/SubForms/ChangeCaseType/Case");
}

changeCaseType_subform.replaceTargetNode = [ {sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_FORM_XPATH + "/SubForms/ChangeCaseType/Case"} ];
/**
 * @author rzxd7g
 * 
 */
changeCaseType_subform.processReturnedData = function()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	retrieveCaseEvents(caseNumber);
}

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
changeCaseType_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/*********************************************************************************/

function obsoleteCaseType_subform() {}
obsoleteCaseType_subform.subformName = "ObsoleteCaseTypeSubform";
/**
 * @author rzxd7g
 * 
 */
obsoleteCaseType_subform.prePopupPrepare = function()
{
	// Send any data over to the Obsolete Case Type Subform
	prepareSubFormData(XPathConstants.VAR_FORM_XPATH + "/SubForms/ObsoleteCaseType/Case");
}

obsoleteCaseType_subform.replaceTargetNode = [ {sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_FORM_XPATH + "/SubForms/ObsoleteCaseType/Case"} ];
/**
 * @author rzxd7g
 * 
 */
obsoleteCaseType_subform.processReturnedData = function()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	retrieveCaseEvents(caseNumber);
}

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
obsoleteCaseType_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/*********************************************************************************/

function resetCaseStatus_subform() {}
resetCaseStatus_subform.subformName = "ResetCaseStatusSubform";
/**
 * @author rzxd7g
 * 
 */
resetCaseStatus_subform.prePopupPrepare = function()
{
	// Send any data over to the Reset Case Status Subform
	prepareSubFormData(XPathConstants.VAR_FORM_XPATH + "/SubForms/ResetCaseStatus/Case");
}

resetCaseStatus_subform.replaceTargetNode = [ {sourceNodeIndex: "0", dataBinding: XPathConstants.VAR_FORM_XPATH + "/SubForms/ResetCaseStatus/Case"} ];
/**
 * @author rzxd7g
 * 
 */
resetCaseStatus_subform.processReturnedData = function()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	retrieveCaseEvents(caseNumber);
}

/**
 * @author rzxd7g
 * @return "Status_SaveButton"  
 */
resetCaseStatus_subform.nextFocusedAdaptorId = function() {
	return "Status_SaveButton";
}

/*********************************************************************************/

function selectEventOutput_subform() {};
selectEventOutput_subform.subformName = "selectEventOutputSubform";
/**
 * @author rzxd7g
 * 
 */
selectEventOutput_subform.prePopupPrepare = function()
{
	// Send any data over to the Subform
	var dataNode = Services.getNode(XPathConstants.EVENTS_XPATH + "/Outputs");
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
	var outputType = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Type");
	
	if ( outputType == "WP" )
	{
		// Call Word Processing		
		// Prepare the Word Processing Node
		var documentId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		if (null == documentId || documentId == "")
		{
			Services.setValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Create");
		}
		else
		{
			Services.setValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Request", "Open");
		}
		var applicant = Services.getValue(XPathConstants.EVENTS_XPATH + "/Applicant");			
		var eventSeq = Services.getValue(XPathConstants.EVENTS_XPATH + "/CaseEventSeq");
		var eventStdId = Services.getValue(XPathConstants.EVENTS_XPATH + "/StandardEventId");
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		var caseType = getXMLCompatibleString(Services.getValue(XPathConstants.DATA_XPATH + "/CaseType"));		

		// Defect 5827 - set WP flag indicating whether or not a hearing was created with the event
		var hrgSequence = Services.getValue(XPathConstants.EVENTS_XPATH + "/HearingSequence");
		var hearingCreated = CaseManUtils.isBlank(hrgSequence) ? "false" : "true";

		var wpNode = Services.getNode(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']");
		var wpDom = XML.createDOM();
		wpDom.loadXML(wpNode.xml);
		
		var txDOM = XML.createDOM();
		txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
          "<xsl:output method='xml' indent='yes' />" +
          "<xsl:template match='Output'>" +
               "<WordProcessing>" +
               		"<Event>" +
	             		"<CaseEventSeq>" + eventSeq + "</CaseEventSeq>" +
               			"<StandardEventId>" + eventStdId + "</StandardEventId>" +
               		"</Event>" +
               		"<Case>" +
	               		"<CaseNumber>" + caseNumber + "</CaseNumber>" +
               			"<CaseType>" + caseType + "</CaseType>" +
               		"</Case>" +
               		"<Judgment><Applicant>"+applicant+"</Applicant></Judgment>"+
               		"<HearingCreated>" + hearingCreated + "</HearingCreated>" +
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
		WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.EVENTS_FORM, false);	
	}
	else if ( outputType == "OR" )
	{
		// Call Oracle Reports
		var documentId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/DocumentId");
		//var reportId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/Description");//defect 6039 replaced with line below
		var reportId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/ReportId");
		var orderId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output[./OutputId = '" + outputId + "']/OutputId");
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
 * @return "Master_EventGrid"  
 */
selectEventOutput_subform.nextFocusedAdaptorId = function() 
{
	return "Master_EventGrid";
}

/*********************************************************************************/

function ProgressBar_SubForm() {}
ProgressBar_SubForm.subformName = "CasemanWpOrarepProgress";

/******************************* POPUPS *******************************************/

function Details_Of_Claim_Popup() {};
/**
 * @author rzxd7g
 * @return "AddEvent_Subject"  
 */
Details_Of_Claim_Popup.nextFocusedAdaptorId = function() {
	return "AddEvent_Subject";
}

/*********************************************************************************/

function AddEvent_Popup() {};
/**
 * @author rzxd7g
 * @return "Master_EventGrid"  
 */
AddEvent_Popup.nextFocusedAdaptorId = function() {
	return "Master_EventGrid";
}

/*********************************************************************************/

function SubjectLOV_Popup() {};
SubjectLOV_Popup.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddEvent_SubjectLOVButton"} ],
		keys: [ { key: Key.F6, element: "AddEvent_Subject" } ]
	}
};

SubjectLOV_Popup.lower = {
	eventBinding: {
		singleClicks: [ {element: "SubjectPopup_CancelButton"} ],
		keys: [ { key: Key.F4, element: "SubjectLOV_Popup" } ]
	}
};

/**
 * @author rzxd7g
 * @return "AddEvent_Subject"  
 */
SubjectLOV_Popup.nextFocusedAdaptorId = function() {
	return "AddEvent_Subject";
}

/***************************** LOV POPUPS *****************************************/

function Master_EventLOVGrid() {};
Master_EventLOVGrid.dataBinding = XPathConstants.VAR_FORM_XPATH + "/SelectedLOVRow/Event";
Master_EventLOVGrid.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_EventLOVGrid.rowXPath = "StandardEvent";
Master_EventLOVGrid.keyXPath = "StandardEventId";
Master_EventLOVGrid.columns = [
	{xpath: "StandardEventId", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending" },
	{xpath: "StandardEventDescription"}
];

Master_EventLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "Master_EventLOVButton"} ],
		keys: [ { key: Key.F6, element: "Master_EventId" }, { key: Key.F6, element: "Master_EventDescription" } ]
	}
};

/**
 * @author rzxd7g
 * @return "Master_AddEventButton"  
 */
Master_EventLOVGrid.nextFocusedAdaptorId = function() {
	return "Master_AddEventButton";
}

Master_EventLOVGrid.styleURL = "/css/Master_EventLOVGrid.css";
Master_EventLOVGrid.destroyOnClose = false;
Master_EventLOVGrid.logicOn = [Master_EventLOVGrid.dataBinding];
Master_EventLOVGrid.logic = function(event) 
{
	if ( event.getXPath().indexOf(Master_EventLOVGrid.dataBinding) == -1 )
	{
		return;
	}

	var eventId = Services.getValue(Master_EventLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(eventId) )
	{
		// Set the Event Id field and blank the LOV Subform's databinding
		Services.startTransaction();
		Services.setValue(Master_EventId.dataBinding, eventId);
		Services.setValue(Master_EventLOVGrid.dataBinding, "");
		Services.endTransaction();
	}
}

/*********************************************************************************/

function AddEvent_DetailsLOVGrid() {};
AddEvent_DetailsLOVGrid.dataBinding = XPathConstants.NEWEVENT_XPATH + "/LOVDetails";
AddEvent_DetailsLOVGrid.srcDataOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/LOVDetails/Option/Code"];
AddEvent_DetailsLOVGrid.srcData = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/LOVDetails/Options";
AddEvent_DetailsLOVGrid.rowXPath = "Option";
AddEvent_DetailsLOVGrid.keyXPath = "Code";
AddEvent_DetailsLOVGrid.columns = [
	{xpath: "Code"},
	{xpath: "Description"}
];

AddEvent_DetailsLOVGrid.raise = {
	eventBinding: {
		singleClicks: [ {element: "AddEvent_DetailsLOVButton"} ],
		keys: [ { key: Key.F6, element: "AddEvent_Details" } ]
	}
};

/**
 * @author rzxd7g
 * @return "AddEvent_Date"  
 */
AddEvent_DetailsLOVGrid.nextFocusedAdaptorId = function() {
	return "AddEvent_Date";
}

AddEvent_DetailsLOVGrid.logicOn = [AddEvent_DetailsLOVGrid.dataBinding];
AddEvent_DetailsLOVGrid.logic = function(event)
{
	if ( event.getXPath() != AddEvent_DetailsLOVGrid.dataBinding )
	{
		return;
	}
	
	var detailsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsDomain");
	var lovValue = Services.getValue(AddEvent_DetailsLOVGrid.dataBinding);
	if ( !CaseManUtils.isBlank(detailsLOV) && !CaseManUtils.isBlank(lovValue) )
	{
		// For Tick Box Events, concatenate the code and the description selected
		var detailsValue = lovValue;
		var tickBoxDesc = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/LOVDetails/Options/Option[./Code = '" + lovValue + "']/Description");
		if ( !CaseManUtils.isBlank(tickBoxDesc) )
		{
			// Only add the description for options that have a description
			detailsValue = detailsValue + ": " + tickBoxDesc;
		}
		Services.setValue(AddEvent_Details.dataBinding, detailsValue);
	}
}

/*********************************************************************************/

function AddEvent_BMSTaskLOVGrid() {};
AddEvent_BMSTaskLOVGrid.dataBinding = XPathConstants.NEWEVENT_XPATH + "/BMSTaskDescription";
AddEvent_BMSTaskLOVGrid.srcDataOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/BMSTaskLOV/Option/Description"];
AddEvent_BMSTaskLOVGrid.srcData = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/BMSTaskLOV/Options";
AddEvent_BMSTaskLOVGrid.rowXPath = "Option";
AddEvent_BMSTaskLOVGrid.keyXPath = "Description";
AddEvent_BMSTaskLOVGrid.columns = [
	{xpath: "Description"}
];

/*********************************************************************************/

function AddEvent_StatsModLOVGrid() {};
AddEvent_StatsModLOVGrid.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StatsModDescription";
AddEvent_StatsModLOVGrid.srcDataOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/StatsModLOV/Option/Description"];
AddEvent_StatsModLOVGrid.srcData = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/StatsModLOV/Options";
AddEvent_StatsModLOVGrid.rowXPath = "Option";
AddEvent_StatsModLOVGrid.keyXPath = "Description";
AddEvent_StatsModLOVGrid.columns = [
	{xpath: "Description"}
];

/******************************** GRIDS *******************************************/

function Header_PartyTypeListGrid() {};
Header_PartyTypeListGrid.tabIndex = 14;
Header_PartyTypeListGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedParty";
Header_PartyTypeListGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/Parties/Party/DisplayInHeader"];
Header_PartyTypeListGrid.srcData = XPathConstants.DATA_XPATH + "/Parties";
Header_PartyTypeListGrid.rowXPath = "Party[./DisplayInHeader = 'true']";
Header_PartyTypeListGrid.keyXPath = "PartyKey";
Header_PartyTypeListGrid.columns = [
	{xpath: "PartyRoleDescription"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "PartyName"}
];

Header_PartyTypeListGrid.enableOn = [XPathConstants.DATA_XPATH + "/CaseNumber", XPathConstants.CASE_EXISTS_XPATH];
Header_PartyTypeListGrid.isEnabled = caseExists;

/*********************************************************************************/

function Master_EventGrid() {};
Master_EventGrid.isRecord = true;
/**
 * @param eventKey
 * @author rzxd7g
 * @return "CASE" , subject  
 */
Master_EventGrid.transformSubjectForGrid = function(eventKey)
{
	// Subject is Case
	var caseFlag = Services.getValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = '" + eventKey + "']/CaseFlag");
	if ( caseFlag == "Y" )
	{
		return "CASE";
	}

	var index = Services.getValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = '" + eventKey + "']/SubjectPartyKey");

	// Get the Subject party type and number
	var number = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = '" + index + "']/CasePartyNumber");
	var type = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = '" + index + "']/PartyRoleCode");
	var subject = "";

	switch (type)
	{
		case PartyTypeCodesEnum.CLAIMANT:
		case PartyTypeCodesEnum.CREDITOR:
			// Claimants and Creditors should display 'C' + number
			subject = "C" + number;
			break;
		case PartyTypeCodesEnum.DEFENDANT:
		case PartyTypeCodesEnum.DEBTOR:
			// Defendants and Debtors should display 'D' + number
			subject = "D" + number;
			break;
		case PartyTypeCodesEnum.PART_20_DEFENDANT:
		case PartyTypeCodesEnum.PART_20_CLAIMANT:
			// Part 20 parties should display 'OP' + number
			subject = "OP" + number;
			break;
		case PartyTypeCodesEnum.APPLICANT:
			// Applicants should display 'A' + number
			subject = "A" + number;
			break;
		case PartyTypeCodesEnum.OFFICIAL_RECEIVER:
			// Official Receivers should display 'OR' + number
			subject = "OR" + number;
			break;
		case PartyTypeCodesEnum.INSOLVENCY_PRACTITIONER:
			// Insolvency Practitioners should display 'IP' + number
			subject = "IP" + number;
			break;
		case PartyTypeCodesEnum.PETITIONER:
			// Petitioners should display 'P' + number
			subject = "P" + number;
			break;
		case PartyTypeCodesEnum.THE_COMPANY:
			// The Company party should display 'CO' + number
			subject = "CO" + number;
			break;
		case PartyTypeCodesEnum.TRUSTEE:
			// The Trustee party should display 'TR' + number
			subject = "TR" + number;
			break;
		default:
			// Leave subject as blank
	}
	return subject;
}

/**
 * Automatically created event 640 has a description of ATTACHMENT OF EARNINGS EVENT
 * which isn't particularly helpful so for this event display the Event Details which
 * indicates which AE Event created the Case Event 640.
 * @param eventKey
 * @author rzxd7g
 * @return ( CaseManUtils.isBlank(description) ) ? "", description  
 */
Master_EventGrid.transformDescriptionForGrid = function(eventKey)
{
	var xp = XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = '" + eventKey + "']";
	var eventId = Services.getValue(xp + "/StandardEventId");

	switch (eventId)
	{
		case "640":
			xp = xp + "/EventDetails";
			break;

		default:
			xp = xp + "/StandardEventDescription";
	}

	var description = Services.getValue(xp);
	return ( CaseManUtils.isBlank(description) ) ? "" : description;
}

Master_EventGrid.componentName = "Master Event Grid";
Master_EventGrid.tabIndex = 100;
Master_EventGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedEvent";
Master_EventGrid.srcData = XPathConstants.DATA_XPATH + "/CaseEvents";
Master_EventGrid.rowXPath = "CaseEvent";
Master_EventGrid.keyXPath = "CaseEventSeq";
Master_EventGrid.columns = [
	{xpath: "CaseEventSeq", sort: "disabled", transformToDisplay: function() { return ""; } },
	{xpath: "EventDate", sort: CaseManUtils.sortGridDatesDsc, transformToDisplay: CaseManUtils.formatGridDate},
	{xpath: "StandardEventId", sort: "numerical"},
	{xpath: "CaseEventSeq", transformToDisplay: Master_EventGrid.transformDescriptionForGrid},
	{xpath: "CaseEventSeq", transformToDisplay: Master_EventGrid.transformSubjectForGrid},
	{xpath: "DeletedFlag", transformToDisplay: function(val) { return (val == "Y") ? "X" : ""; } }
];

/**
 * For events that are in error, display the grid row in a particular colour
 * @param rowId
 * @author rzxd7g
 * @return classList  
 */
Master_EventGrid.rowRenderingRule = function( rowId )
{
    var classList = "";
    if( null != rowId )
    {
    	var failedOutput = false;
      	var blnError = Services.getValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = " + rowId + "]/DeletedFlag");
      	var countOutputs = Services.countNodes(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = " + rowId + "]/Outputs/Output");
      	if ( countOutputs == 0 )
      	{
      		// No outputs, do not display icon
      		var finalInd = null;
      	}
      	else if ( countOutputs == 1 )
      	{
      		// One output, display the icon based upon the final indicator
      		var finalInd = Services.getValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = " + rowId + "]/Outputs/Output/Final");
      		
      		var documentId = Services.getValue(XPathConstants.DATA_XPATH + "/CaseEvents/CaseEvent[./CaseEventSeq = " + rowId + "]/Outputs/Output/DocumentId");
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

Master_EventGrid.enableOn = [XPathConstants.DATA_XPATH + "/CaseNumber", XPathConstants.CASE_EXISTS_XPATH];
Master_EventGrid.isEnabled = caseExists;

/*********************************************************************************/

function AddEvent_InstigatorGrid() {};
AddEvent_InstigatorGrid.tabIndex = 630;
AddEvent_InstigatorGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/Parties/Party/InstigatorForEvent"];
AddEvent_InstigatorGrid.multipleSelection = true;
AddEvent_InstigatorGrid.dataBinding = XPathConstants.NEWEVENT_XPATH + "/InstigatorList";
AddEvent_InstigatorGrid.srcData = XPathConstants.DATA_XPATH + "/Parties";
AddEvent_InstigatorGrid.rowXPath = "Party[./InstigatorForEvent = 'true']";
AddEvent_InstigatorGrid.keyXPath = "PartyKey";
AddEvent_InstigatorGrid.columns = [
	{xpath: "PartyRoleDescription"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "PartyName"}
];

AddEvent_InstigatorGrid.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType"];
AddEvent_InstigatorGrid.isEnabled = function()
{
	var instigatorType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType");
	if ( CaseManUtils.isBlank(instigatorType) )
	{
		return false;
	}
	return (instigatorType != InstigatorTypeCodes.NONE);
}

// Logic checks if multiple instigators can exist and if not produces an error message when it happens
AddEvent_InstigatorGrid.logicOn = [XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey", XPathConstants.NEWEVENT_XPATH + "/SubjectCasePartyKey"];
AddEvent_InstigatorGrid.logic = function(event)
{
	// Only perform action if an instigator is selected, event xpath will end in [x] so must use indexOf
	if ( event.getXPath().indexOf(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey") == -1 
		 && event.getXPath() != AddEvent_Subject.dataBinding )
	{
		return;
	}
	
	// Multi-select instigator validation
	var instigatorMultiSelect = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorMultiSelect");
	var countInstigators = Services.countNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey");
	if ( instigatorMultiSelect == "false" && countInstigators > 1 )
	{
		alert(Messages.MULTISELECT_INSTIGATOR_MESSAGE);
	}
	
	// Determination Judgment update validation (CaseMan Defect 6058)
	var subjInstCheckFlag = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/UpdateDeterminationJudgment");
	var subject = Services.getValue(AddEvent_Subject.dataBinding);
	if ( subjInstCheckFlag == "true" && !CaseManUtils.isBlank(subject) )
	{
		if ( countInstigators == 0 )
		{
			Services.setValue(XPathConstants.NEWEVENT_XPATH + "/JudgmentId", "");
			return;
		}
	
		var xpath = XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/JudgmentsForRedetermination/Judgment[./Against/Parties/Party/SubjectPartyKey = '" + subject + "'";
		var instigatorList = Services.getNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey");
		for (var i=0, l=instigatorList.length; i<l; i++)
		{
			var instigatorPartyKey = XML.getNodeTextContent( instigatorList[i] );
			xpath = xpath + " and ./InFavour/Parties/Party/SubjectPartyKey = '" + instigatorPartyKey + "'";
		}
		xpath = xpath + " and count(./InFavour/Parties/Party) = " + countInstigators + "]";
		
		if ( Services.countNodes(xpath) == 1 )
		{
			// Set the JudgmentId node
			var judgmentId = Services.getValue(xpath + "/JudgmentId");
			Services.setValue(XPathConstants.NEWEVENT_XPATH + "/JudgmentId", judgmentId);
		}
		else
		{
			alert(Messages.INVALID_SUBJECT_INSTIGATOR_COMB_MESSAGE);
			Services.setValue(XPathConstants.NEWEVENT_XPATH + "/JudgmentId", "");
		}
	}
}

/*********************************************************************************/

function SubjectPopup_SubjectLOVGrid() {};
SubjectPopup_SubjectLOVGrid.tabIndex = 990;
SubjectPopup_SubjectLOVGrid.srcDataOn = [XPathConstants.DATA_XPATH + "/Parties/Party/SubjectForEvent"];
SubjectPopup_SubjectLOVGrid.dataBinding = XPathConstants.VAR_PAGE_XPATH + "/SelectedGridRow/SelectedSubject";
SubjectPopup_SubjectLOVGrid.srcData = XPathConstants.DATA_XPATH + "/Parties";
SubjectPopup_SubjectLOVGrid.rowXPath = "Party[./SubjectForEvent = 'true']";
SubjectPopup_SubjectLOVGrid.keyXPath = "PartyKey";
SubjectPopup_SubjectLOVGrid.columns = [
	{xpath: "PartyRoleDescription"},
	{xpath: "CasePartyNumber", sort: "numerical", defaultSort:"true", defaultSortOrder:"ascending"},
	{xpath: "PartyName"}
];

/**************************** DATA BINDINGS ***************************************/

Header_CaseNumber.dataBinding = XPathConstants.DATA_XPATH + "/CaseNumber";
Header_InsolvSeqNo.dataBinding = XPathConstants.DATA_XPATH + "/Temp/InsolvSeqNo";
Header_InsolvYear.dataBinding = XPathConstants.DATA_XPATH + "/Temp/InsolvYear";
Header_OwningCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtCode";
Header_OwningCourtName.dataBinding = XPathConstants.DATA_XPATH + "/OwningCourtName";
Header_MCOLCaseFlag.dataBinding = XPathConstants.DATA_XPATH + "/MCOLCase";

Header_CaseAllocatedTo.dataBinding = XPathConstants.DATA_XPATH + "/Track";
Header_DefaultJudge.dataBinding = XPathConstants.DATA_XPATH + "/Judge";
Header_AmountClaimedCurrency.dataBinding = XPathConstants.DATA_XPATH + "/AmountClaimedCurrency";
Header_AmountClaimed.dataBinding = XPathConstants.DATA_XPATH + "/AmountClaimed";
Header_PreferredCourtCode.dataBinding = XPathConstants.DATA_XPATH + "/PreferredCourtCode";
Header_PreferredCourtName.dataBinding = XPathConstants.DATA_XPATH + "/PreferredCourtName";

Master_EventId.dataBinding = XPathConstants.EVENTDATA_XPATH + "/StandardEventId";
Master_EventDescription.dataBinding = XPathConstants.EVENTDATA_XPATH + "/StandardEventDescription";

EventDetails_DateReceived.dataBinding = XPathConstants.EVENTS_XPATH + "/ReceiptDate";
EventDetails_EventId.dataBinding = XPathConstants.EVENTS_XPATH + "/StandardEventId";
EventDetails_EventDescription.dataBinding = XPathConstants.EVENTS_XPATH + "/StandardEventDescription";
EventDetails_SubjectNumber.dataBinding = XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + XPathConstants.EVENTS_XPATH + "/SubjectPartyKey]/CasePartyNumber";
EventDetails_SubjectType.dataBinding = XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + XPathConstants.EVENTS_XPATH + "/SubjectPartyKey]/PartyRoleDescription";
EventDetails_SubjectName.dataBinding = XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + XPathConstants.EVENTS_XPATH + "/SubjectPartyKey]/PartyName";
EventDetails_Details.dataBinding = XPathConstants.EVENTS_XPATH + "/EventDetails";
EventDetails_ErrorFlag.dataBinding = XPathConstants.EVENTS_XPATH + "/DeletedFlag";
EventDetails_Applicant.dataBinding = XPathConstants.EVENTS_XPATH + "/Applicant";
EventDetails_Result.dataBinding = XPathConstants.EVENTS_XPATH + "/Result";
EventDetails_BMSTask.dataBinding = XPathConstants.EVENTS_XPATH + "/BMSTask";
EventDetails_StatMod.dataBinding = XPathConstants.EVENTS_XPATH + "/StatsModule";
EventDetails_CreatedBy.dataBinding = XPathConstants.EVENTS_XPATH + "/UserName";
EventDetails_Date.dataBinding = XPathConstants.EVENTS_XPATH + "/EventDate";

DetailsOfClaim_AmountClaimedCurrency.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/AmountClaimedCurrency";
DetailsOfClaim_AmountClaimed.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/AmountClaimed";
DetailsOfClaim_CourtFeeCurrency.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/CourtFeeCurrency";
DetailsOfClaim_CourtFee.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/CourtFee";
DetailsOfClaim_SolicitorsCostsCurrency.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/SolicitorsCostsCurrency";
DetailsOfClaim_SolicitorsCosts.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/SolicitorsCosts";
DetailsOfClaim_TotalCurrency.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/TotalCurrency";
DetailsOfClaim_Total.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/Total";
DetailsOfClaim_DateOfIssue.dataBinding = XPathConstants.DETAILSOFCLAIM_XPATH + "/DateOfIssue";

AddEvent_DateReceived.dataBinding = XPathConstants.NEWEVENT_XPATH + "/ReceiptDate";
AddEvent_EventId.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventId";
AddEvent_EventDescription.dataBinding = XPathConstants.NEWEVENT_XPATH + "/StandardEventDescription";
AddEvent_Subject.dataBinding = XPathConstants.NEWEVENT_XPATH + "/SubjectCasePartyKey";
AddEvent_InstigatorLabel.dataBinding = XPathConstants.NEWEVENT_XPATH + "/InstigatorLabel";
AddEvent_Details.dataBinding = XPathConstants.NEWEVENT_XPATH + "/EventDetails";
AddEvent_Date.dataBinding = XPathConstants.NEWEVENT_XPATH + "/EventDate";
AddEvent_WPCall.dataBinding = XPathConstants.NEWEVENT_XPATH + "/NavigateToWP";

/**************************** INPUT FIELDS ****************************************/

function Header_CaseNumber() {}
Header_CaseNumber.tabIndex = 10;
Header_CaseNumber.maxLength = 8;
Header_CaseNumber.helpText = "Unique identifier of a case quoted by all parties";
Header_CaseNumber.componentName = "Case Number";
Header_CaseNumber.isMandatory = function() { return true; }
Header_CaseNumber.transformToDisplay = convertToUpperCase;
Header_CaseNumber.transformToModel = convertToUpperCase;
Header_CaseNumber.validateOn = [XPathConstants.CASE_EXISTS_XPATH];
Header_CaseNumber.validate = function()
{
	var ec = null;
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	
	if ( !CaseManUtils.isBlank(caseNumber) )
	{
		// Check if format of CaseNumber is correct
		ec = CaseManValidationHelper.validateCaseNumber(caseNumber);
		
		if ( null == ec )
		{
			// Check is not a MAGS ORDER case
			ec = CaseManValidationHelper.validatePattern(caseNumber, CaseManValidationHelper.NONMAGSORDER_CASE_PATTERN, 'CaseMan_caseCannotBeMAGSORDER_Msg');
		}
		
		var caseExists = Services.getValue(XPathConstants.CASE_EXISTS_XPATH);
		if ( null == ec && caseExists == "false")
		{
			ec = ErrorCode.getErrorCode("CaseMan_caseDoesNotExist_Msg");
		}
	}
	return ec;
}
Header_CaseNumber.enableOn =[Header_CaseNumber.dataBinding, Header_InsolvSeqNo.dataBinding, Header_InsolvYear.dataBinding];
Header_CaseNumber.isEnabled = function()
{
	return !CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding))
		|| (CaseManUtils.isBlank(Services.getValue(Header_InsolvSeqNo.dataBinding))
			&& CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)));
}


Header_CaseNumber.logicOn = [Header_CaseNumber.dataBinding];
Header_CaseNumber.logic = function(event)
{
	if ( event.getXPath() != Header_CaseNumber.dataBinding )
	{
		return;
	}
	
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	if ( CaseManUtils.isBlank(caseNumber) )
	{
		// If Case Number is cleared, wipe out all data
		resetForm();
	}
	else
	{
		var caseExistsValue = Services.getValue(XPathConstants.CASE_EXISTS_XPATH);
		if ( null == Header_CaseNumber.validate() || caseExistsValue == "false" )
		{
			// Valid Case Number, load the Case Events data
			Services.setValue( XPathConstants.CE_PAGENUMBER_XPATH, "" );
			Services.setValue(CaseManFormParameters.CASEDATA_PENDINGTRANSFERWARNING_XPATH, "");
			retrieveCaseEvents(caseNumber);
		}
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onSuccess = function(dom)
{
	if ( null != dom )
	{
		// Select and insert the main node
		var data = dom.selectSingleNode(XPathConstants.DATA_XPATH);
		if( null != data )
		{
			// Reset the grid sort order
			CaseManUtils.resetGridSortOrder("Master_EventGrid");
			
			// Load the reference data for the screen now that a valid case record has been found
			loadCaseRelatedReferenceData();
		
			// Add the new data to the data model
			Services.startTransaction();
			Services.replaceNode(XPathConstants.DATA_XPATH, data);
			
			// Reset the Word Processing and Oracle Report APP nodes
			Services.removeNode(CaseManFormParameters.WPNODE_XPATH);
			Services.removeNode(CaseManFormParameters.ORNODE_XPATH);
			
			// Set the parties to be displayed in the header grid
			var owningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
			var showSolicitor = ( owningCourt == CaseManUtils.CCBC_COURT_CODE ) ? true : false;
			var caseType = Services.getValue(XPathConstants.DATA_XPATH + "/CaseType");
			CaseManUtils.setPartiesForHeaderGrid(caseType, XPathConstants.DATA_XPATH + "/Parties/Party", "PartyRoleCode", showSolicitor);
			
			//split InsolvencyNumberConjoined to seq and year.
			var fullInsolvNo = Services.getValue(XPathConstants.INSOLVENCY_NO_CONJOINED);
			if(fullInsolvNo != null){
				Services.setValue(Header_InsolvSeqNo.dataBinding, fullInsolvNo.substr(0,4));
				Services.setValue(Header_InsolvYear.dataBinding, fullInsolvNo.substr(4,4));
			}
			
			// Set the grid to point at the new event if one has just been created
			var newEventId = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/CaseEventSeq");
			if ( !CaseManUtils.isBlank(newEventId) )
			{
				Services.setValue(Master_EventGrid.dataBinding, newEventId);
				Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/CaseEventSeq", "");
			}
			
			// Add the Case Number to the app section to share with other screens
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			Services.setValue( ManageCaseEventsParams.CASE_NUMBER, caseNumber );

			// UCT_Group2 Defect 1125 - set the MCOL Case flag
			var mcolCaseCredCode = Services.getValue(XPathConstants.DATA_XPATH + "/CreditorCode");
			if ( mcolCaseCredCode == CaseManUtils.MCOL_CRED_CODE )
			{
				Services.setValue(Header_MCOLCaseFlag.dataBinding, "Y");
			}
			else
			{
				Services.setValue(Header_MCOLCaseFlag.dataBinding, "N");
			}
			
			// Set details changed to 'false'
			Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "false");
			Services.setValue(XPathConstants.CASE_CHANGES_MADE_XPATH, "false");
			Services.setValue(XPathConstants.CASE_EXISTS_XPATH, "true");
			var defaultCurrency = Services.getValue(XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
			Services.setValue(Header_AmountClaimedCurrency.dataBinding, defaultCurrency);
			Services.setFocus("Master_EventGrid");
			Services.endTransaction();

			// Check if owning court is different
			var msg_ind = Services.getValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH);
			var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			if ( !CaseManUtils.isBlank(owningCourt) && owningCourt != userOwningCourt && msg_ind != "true" )
			{
				alert(Messages.OWNING_COURT_MESSAGE);
				Services.setValue(CaseManFormParameters.CASEDATA_OWNINGCOURTWARNING_XPATH, "true");
			}
			
			// New Pending Transfer warning message (to be displayed once on first load).  Trac 4692.
			var pending_transfer_ind = Services.getValue(CaseManFormParameters.CASEDATA_PENDINGTRANSFERWARNING_XPATH);
			var transfer_status = Services.getValue(XPathConstants.DATA_XPATH + "/TransferStatus");
			if ( !CaseManUtils.isBlank(transfer_status) && transfer_status == "1" && pending_transfer_ind != "true" )
			{
				alert(Messages.TRANSFER_PENDING_ALERT);
				Services.setValue(CaseManFormParameters.CASEDATA_PENDINGTRANSFERWARNING_XPATH, "true");
			}
	
			// Check if case type is invalid.
			if ( obsoleteCaseType() )
			{
				// Raise Obsolete Case Type subform
				Services.dispatchEvent("obsoleteCaseType_subform", BusinessLifeCycleEvents.EVENT_RAISE);
			}
			
			
		}
		else
		{
			// A Case Number which does not exist has been entered, flag field as invalid
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			if ( CaseManUtils.isBlank(caseNumber) )
			{
				// Case number not entered so must have come from another screen, check the external case number
				caseNumber = Services.getValue(ManageCaseEventsParams.CASE_NUMBER);
			}
			
			var mainNode = XML.createElement(dom, "ManageCaseEvents");
			var cnNode = XML.createElement(dom, "CaseNumber");
			mainNode.appendChild(cnNode);
			dom.selectSingleNode("/ds").appendChild(mainNode);
			dom.selectSingleNode(XPathConstants.DATA_XPATH + "/CaseNumber").appendChild(dom.createTextNode( caseNumber ));
			Services.replaceNode(XPathConstants.DATA_XPATH, dom.selectSingleNode(XPathConstants.DATA_XPATH));
			
			Services.setValue(XPathConstants.CASE_EXISTS_XPATH, "false");
			Services.setFocus("Header_CaseNumber");
		}
	}
	
	// Clear the Oracle Report Court Code constant when load case events in Header_CaseNumber.onSuccess() - TRAC 2446
	Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, "");

	// Handle post save functionality
	if ( !CaseManUtils.isBlank(PostSaveActions.ACTION_AFTER_SAVE) )
	{
		postSaveHandler();
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Header_CaseNumber.onError = function(exception)
{
	if(confirm(Messages.FAILEDCASEDATALOAD_MESSAGE))
	{
		// Reload the case number field so that all data gets reloaded
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		Services.setValue(Header_CaseNumber.dataBinding, "");
		retrieveCaseEvents(caseNumber);
	}
	else
	{
		exitScreen();
	}
}

/*********************************************************************************/

function Header_InsolvSeqNo() {}
Header_InsolvSeqNo.tabIndex = 11;
Header_InsolvSeqNo.maxLength = 4;
Header_InsolvSeqNo.helpText = "Insolvency Sequence Number";
Header_InsolvSeqNo.componentName = "Insolvency Sequence Number";
Header_InsolvSeqNo.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH];
Header_InsolvSeqNo.isEnabled = function(){
	
	//disable when caseexists and there is no insolvency number
	if (caseExists() && CaseManUtils.isBlank(Services.getValue(Header_InsolvSeqNo.dataBinding))){
		return false;
	}
	else{
		return true;
	}
}
Header_InsolvSeqNo.isMandatory = function() {
    //only mandatory when the case number is not entered	
    if(CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding))){
    	return true;
    }else{
    	return false;
    }
}
Header_InsolvSeqNo.isReadOnly = function() {
	
	//non-editable when caseexists and insolency number exists
	if (caseExists() && !CaseManUtils.isBlank(Services.getValue(Header_InsolvSeqNo.dataBinding))){
		return true;
	}
	else{
		return false;
	}
}

//moving the focus back to casenumber field if insolvNo is blank
Header_InsolvSeqNo.moveFocus = function(isForward)
{
	
	if (isForward &&
		CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) && 
		CaseManUtils.isBlank(Services.getValue(Header_InsolvSeqNo.dataBinding)))
		{
			return 'Header_CaseNumber';
		}
	return null;
}


//validation
Header_InsolvSeqNo.validateOn = [Header_InsolvSeqNo.dataBinding];
Header_InsolvSeqNo.validate = function()
{
	var insolvNoValue = Services.getValue(Header_InsolvSeqNo.dataBinding);
    return CaseManValidationHelper.validateInsolvencyNumber(insolvNoValue);	
}

/*********************************************************************************/
function Header_InsolvYear() {}
Header_InsolvYear.tabIndex = 12;
Header_InsolvYear.maxLength = 4;
Header_InsolvYear.helpText = "Insolvency Year Value";
Header_InsolvYear.componentName = "Insolvency Year Value";
Header_InsolvYear.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH];
Header_InsolvYear.isEnabled = function(){
	//disable when caseexists and there is no insolvency number
	if (caseExists() && CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding))){
		return false;
	}
	else{
		return true;
	}
}
Header_InsolvYear.isMandatory = function() {
    //only mandatory when the case number is not entered	
    if(CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding))){
    	return true;
    }else{
    	return false;
    }
}
Header_InsolvYear.isReadOnly = function() { 	
	//readonly when caseexists and insolency number exists
	if (caseExists() && !CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding))){
		return true;
	}
	else{
		return false;
	}
}

Header_InsolvYear.validateOn = [Header_InsolvYear.dataBinding];
Header_InsolvYear.validate = function()
{
	var insolvYearValue = Services.getValue(Header_InsolvYear.dataBinding);
    return CaseManValidationHelper.validateInsolvencyNumber(insolvYearValue);
}

Header_InsolvYear.onSuccess = function(dom)
{
	if (CaseManUtils.isBlank(XML.getPathTextContent(dom,XPathConstants.DATA_XPATH+'/CaseNumber')))
	{
		var insolvancy = Services.getValue(Header_InsolvSeqNo.dataBinding) + ' of ' + Services.getValue(Header_InsolvYear.dataBinding);
		var courtNum = Services.getValue(Header_OwningCourtCode.dataBinding); 
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + courtNum + "]/Name");
		Services.showDialog(StandardDialogTypes.OK,function(){},Messages.format(Messages.INSOLVENCY_NUMBER_NOT_FOUND,[insolvancy,courtName]),'Case Not Found');
		Services.setFocus('Header_InsolvSeqNo');
	}
	else {
			Header_CaseNumber.onSuccess(dom);
	}
}

Header_InsolvYear.logicOn = [Header_InsolvYear.dataBinding, Header_InsolvSeqNo.dataBinding];
Header_InsolvYear.logic = function(){

	//Set the full insolvency number in the model - used for insert & update
	var insolvNo = Services.getValue(Header_InsolvSeqNo.dataBinding);
	var insolYear = Services.getValue(Header_InsolvYear.dataBinding);
	
	if(!caseExists() && 
	   !CaseManUtils.isBlank(insolvNo) && !CaseManUtils.isBlank(insolYear)){
		
		if(Services.getAdaptorById("Header_InsolvSeqNo").getValid() &&
		   Services.getAdaptorById("Header_InsolvYear").getValid()){
			//assuming that these values are valid
			var fullInsolvencyNo = Services.getValue(Header_InsolvSeqNo.dataBinding)+Services.getValue(Header_InsolvYear.dataBinding);
			Services.setValue(XPathConstants.INSOLVENCY_NO_CONJOINED,fullInsolvencyNo);
			
		}
	}
	
	
}

Header_InsolvYear.onError = Header_CaseNumber.onError;

/*********************************************************************************/

function Header_OwningCourtCode() {}
Header_OwningCourtCode.tabIndex = 13;
Header_OwningCourtCode.maxLength = 3;
Header_OwningCourtCode.helpText = "Owning court code";
Header_OwningCourtCode.componentName = "Owning Court Code";
Header_OwningCourtCode.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, Header_InsolvSeqNo.dataBinding, Header_InsolvYear.dataBinding];

Header_OwningCourtCode.isEnabled = function(){
	// Set the owning court defaulted to be the users home court, 
	// which will be required while searching for insolvency cases.
	// This is not use while searching for case using casenumber
    return true;
}

Header_OwningCourtCode.isMandatory = function() { return true; }
Header_OwningCourtCode.isReadOnly = caseExists;

Header_OwningCourtCode.validateOn = [Header_OwningCourtCode.dataBinding];

Header_OwningCourtCode.validate = function(event)
{
	
	var ec = null;
	if(event.getXPath() == Header_OwningCourtCode.dataBinding){
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + Header_OwningCourtCode.dataBinding + "]/Name");
		if( null == courtName )
		{
			// The entered court code is not a SUPS Court
			ec = ErrorCode.getErrorCode("CaseMan_invalidSUPSCourtCode_Msg");
		}
	}
	return ec;
}

Header_OwningCourtCode.logicOn = [Header_OwningCourtCode.dataBinding, XPathConstants.INSOLVENCY_NO_CONJOINED]
Header_OwningCourtCode.logic = function(event){
	
	
	if(event.getXPath() == Header_OwningCourtCode.dataBinding){
		var courtName = Services.getValue(XPathConstants.REF_DATA_XPATH + "/Courts/Court[./SUPSCourt = 'Y' and ./Code = " + Header_OwningCourtCode.dataBinding + "]/Name");
		if(courtName != null){
			Services.setValue(Header_OwningCourtName.dataBinding, courtName);			
		}
	}
	
	//If the casenumber is blank, and the 2 insolvancy fields and the court code are not blank
	//and are valid the get the case by insolvancy no.
	if (CaseManUtils.isBlank(Services.getValue(Header_CaseNumber.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvYear.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_InsolvSeqNo.dataBinding)) &&
		!CaseManUtils.isBlank(Services.getValue(Header_OwningCourtCode.dataBinding)))
	{
		if (Services.getAdaptorById("Header_InsolvSeqNo").getValid() &&
		    Services.getAdaptorById("Header_InsolvYear").getValid() &&
		    Services.getAdaptorById("Header_OwningCourtCode").getValid())
		{
			retrieveCaseEventsFromInsolvency();
		}
	}
}

Header_OwningCourtCode.onSuccess = function(dom, serviceName)
{
	switch (serviceName)                                                                      
	{
		case "getCourtsShort":
			Services.replaceNode(XPathConstants.REF_DATA_XPATH + "/Courts", dom);
			// Set the owning court defaulted to be the users home court,
	        // which will be required while searching for insolvency cases.
	        // This is not used while searching for case using casenumber

            var userOwningCourt = Services.getValue(CaseManFormParameters.COURTNUMBER_XPATH);
			Services.setValue(Header_OwningCourtCode.dataBinding, userOwningCourt);
	}
}
/*********************************************************************************/

function Header_OwningCourtName() {}
Header_OwningCourtName.tabIndex = -1;
Header_OwningCourtName.maxLength = 70;
Header_OwningCourtName.helpText = "Owning court name";
Header_OwningCourtName.componentName = "Owning Court Name";
Header_OwningCourtName.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, Header_OwningCourtCode.dataBinding];

Header_OwningCourtName.isEnabled = function()
{
	
	if ( !CaseManUtils.isBlank(Services.getValue(Header_OwningCourtName.dataBinding)) ){
		
		return true;
	}else{

	    return false;	
	}
}
Header_OwningCourtName.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_MCOLCaseFlag() {}
Header_MCOLCaseFlag.tabIndex = -1;
Header_MCOLCaseFlag.modelValue = {checked: 'Y', unchecked: 'N'};
Header_MCOLCaseFlag.helpText = "Indicates MCOL Case";
Header_MCOLCaseFlag.componentName = "MCOL Case";
Header_MCOLCaseFlag.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_MCOLCaseFlag.isEnabled = caseExists;
Header_MCOLCaseFlag.isReadOnly = function() { return true; }

/*********************************************************************************/

function Header_PreferredCourtCode() {}
Header_PreferredCourtCode.tabIndex = -1;
Header_PreferredCourtCode.maxLength = 3;
Header_PreferredCourtCode.helpText = "Preferred court code";
Header_PreferredCourtCode.componentName = "Preferred Court Code";
Header_PreferredCourtCode.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_PreferredCourtCode.isEnabled = caseExists;
Header_PreferredCourtCode.isReadOnly = function() { return true; }
Header_PreferredCourtCode.isTemporary = function() { return true; }

/*********************************************************************************/

function Header_PreferredCourtName() {}
Header_PreferredCourtName.tabIndex = -1;
Header_PreferredCourtName.maxLength = 70;
Header_PreferredCourtName.helpText = "Preferred court name";
Header_PreferredCourtName.componentName = "Preferred Court Name";
Header_PreferredCourtName.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_PreferredCourtName.isEnabled = caseExists;
Header_PreferredCourtName.isReadOnly = function() { return true; }
Header_PreferredCourtName.isTemporary = function() { return true; }

/*********************************************************************************/

function Header_CaseAllocatedTo() {}
Header_CaseAllocatedTo.srcData = XPathConstants.REF_DATA_XPATH + "/TrackList";
Header_CaseAllocatedTo.rowXPath = "/Track";
Header_CaseAllocatedTo.keyXPath = "/Value";
Header_CaseAllocatedTo.displayXPath = "/Description";
Header_CaseAllocatedTo.tabIndex = 18;
Header_CaseAllocatedTo.helpText = "Track that the case is provisionally allocated to";
Header_CaseAllocatedTo.componentName = "Case Provisionally Allocated To";
Header_CaseAllocatedTo.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_CaseAllocatedTo.isEnabled = caseExists;
Header_CaseAllocatedTo.logicOn = [Header_CaseAllocatedTo.dataBinding];
Header_CaseAllocatedTo.logic = function(event)
{
	if ( event.getXPath() != Header_CaseAllocatedTo.dataBinding )
	{
		return;
	}
	
	// Set the dirty flag if not previously set
	if ( Services.getValue(XPathConstants.CASE_CHANGES_MADE_XPATH) != "true" )
	{
		Services.setValue(XPathConstants.CASE_CHANGES_MADE_XPATH, "true");
	}
}

/*********************************************************************************/

function Header_DefaultJudge() {}
Header_DefaultJudge.tabIndex = 19;
Header_DefaultJudge.maxLength = 70;
Header_DefaultJudge.helpText = "Docketed/reserved judge";
Header_DefaultJudge.componentName = "Docketed/Res Judge";
Header_DefaultJudge.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_DefaultJudge.isEnabled = caseExists;
Header_DefaultJudge.transformToDisplay = convertToUpperCase;
Header_DefaultJudge.transformToModel = convertToUpperStripped;
Header_DefaultJudge.logicOn = [Header_DefaultJudge.dataBinding];
Header_DefaultJudge.logic = function(event)
{
	if ( event.getXPath() != Header_DefaultJudge.dataBinding )
	{
		return;
	}
	
	// Set the dirty flag if not previously set
	if ( Services.getValue(XPathConstants.CASE_CHANGES_MADE_XPATH) != "true" )
	{
		Services.setValue(XPathConstants.CASE_CHANGES_MADE_XPATH, "true");
	}
}

/*********************************************************************************/

function Header_AmountClaimedCurrency() {}
Header_AmountClaimedCurrency.tabIndex = -1;
Header_AmountClaimedCurrency.maxLength = 3;
Header_AmountClaimedCurrency.isReadOnly = function() { return true; }
Header_AmountClaimedCurrency.isTemporary = function() { return true; }
Header_AmountClaimedCurrency.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_AmountClaimedCurrency.isEnabled = caseExists;
Header_AmountClaimedCurrency.transformToDisplay = function(value)
{
	var returnValue = "";
	if ( !CaseManUtils.isBlank(value) )
	{
		returnValue = CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
	}
	return returnValue;
}

Header_AmountClaimedCurrency.transformToModel = function(value)
{
	return CaseManUtils.transformCurrencySymbolToModel(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencyCode");
}

/*********************************************************************************/

function Header_AmountClaimed() {}
Header_AmountClaimed.tabIndex = -1;
Header_AmountClaimed.maxLength = 11;
Header_AmountClaimed.helpText = "Amount claimed by claimant";
Header_AmountClaimed.componentName = "Amount Claimed";
Header_AmountClaimed.isTemporary = function() { return true; }
Header_AmountClaimed.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH];
Header_AmountClaimed.isEnabled = caseExists;
Header_AmountClaimed.isReadOnly = function() { return true; }
Header_AmountClaimed.transformToDisplay = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

Header_AmountClaimed.transformToModel = function(value)
{
	return CaseManUtils.transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function Master_EventId() {}
Master_EventId.tabIndex = 130;
Master_EventId.maxLength = 3;
Master_EventId.helpText = "The unique identifier for the standard event";
Master_EventId.isTemporary = function() { return true; }
Master_EventId.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH];
Master_EventId.isEnabled = caseExists;
Master_EventId.validate = function()
{
	var ec = null;
	var eventId = Services.getValue(Master_EventId.dataBinding);
	if ( !CaseManUtils.isBlank(eventId) )
	{
		// Check EventId exists in the list
		if ( !CaseManValidationHelper.validateNumber(eventId) || !Services.exists(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = '" + eventId + "']") )
		{
			ec = ErrorCode.getErrorCode("CaseMan_invalidEventId_Msg");
		}
	}
	return ec;
}

Master_EventId.logicOn = [Master_EventId.dataBinding];
Master_EventId.logic = function(event)
{
	if (event.getXPath() != Master_EventId.dataBinding)
	{
		return;
	}
	
	var eventId = Services.getValue(Master_EventId.dataBinding);
	if (!CaseManUtils.isBlank( eventId ) )
	{
		// Populate the Description field
		var eventDesc = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventId = " + Master_EventId.dataBinding + "]/StandardEventDescription");
		if (Services.getValue(Master_EventDescription.dataBinding) != eventDesc)
		{
			Services.setValue(Master_EventDescription.dataBinding, eventDesc);
		}
	}
	else
	{
		// EventId cleared so clear the Event Description
		Services.setValue(Master_EventDescription.dataBinding, "");
	}
}

/*********************************************************************************/

function Master_EventDescription() {}
Master_EventDescription.srcData = XPathConstants.REF_DATA_XPATH + "/StandardEvents";
Master_EventDescription.rowXPath = "StandardEvent";
Master_EventDescription.keyXPath = "StandardEventDescription";
Master_EventDescription.displayXPath = "StandardEventDescription";
Master_EventDescription.strictValidation = true;
Master_EventDescription.tabIndex = 140;
Master_EventDescription.helpText = "Description of the event, action, proceedings etc.";
Master_EventDescription.isTemporary = function() { return true; }
Master_EventDescription.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH];
Master_EventDescription.isEnabled = caseExists;
Master_EventDescription.logicOn = [Master_EventDescription.dataBinding];
Master_EventDescription.logic = function(event)
{
	if (event.getXPath() != Master_EventDescription.dataBinding)
	{
		return;
	}

	var eventDesc = Services.getValue(Master_EventDescription.dataBinding);
	if ( !CaseManUtils.isBlank( eventDesc ) )
	{
		// Populate the EventId field
		var eventId = Services.getValue(XPathConstants.REF_DATA_XPATH + "/StandardEvents/StandardEvent[./StandardEventDescription = " + Master_EventDescription.dataBinding + "]/StandardEventId");
		if (!CaseManUtils.isBlank(eventId) && Services.getValue(Master_EventId.dataBinding) != eventId)
		{
			Services.setValue(Master_EventId.dataBinding, eventId);
		}
	}
	else
	{
		if ( null == Master_EventId.validate() )
		{
			// Event Description cleared so clear the EventId field
			Services.setValue(Master_EventId.dataBinding, "");
		}
	}
}

/*********************************************************************************/

function EventDetails_DateReceived() {}
EventDetails_DateReceived.tabIndex = -1;
EventDetails_DateReceived.maxLength = 11;
EventDetails_DateReceived.helpText = "Date when work received at court.";
EventDetails_DateReceived.componentName = "Date Received";
EventDetails_DateReceived.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_DateReceived.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_DateReceived.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_DateReceived.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_EventId() {}
EventDetails_EventId.tabIndex = -1;
EventDetails_EventId.maxLength = 3;
EventDetails_EventId.helpText = "The unique identifier for the standard event";
EventDetails_EventId.componentName = "Event Id";
EventDetails_EventId.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_EventId.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_EventId.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_EventId.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_EventDescription() {}
EventDetails_EventDescription.tabIndex = -1;
EventDetails_EventDescription.maxLength = 70;
EventDetails_EventDescription.helpText = "Description of the event, action, proceedings etc.";
EventDetails_EventDescription.componentName = "Event Description";
EventDetails_EventDescription.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_EventDescription.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_EventDescription.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_EventDescription.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_SubjectNumber() {}
EventDetails_SubjectNumber.tabIndex = -1;
EventDetails_SubjectNumber.maxLength = 4;
EventDetails_SubjectNumber.helpText = "The party type of the subject of the event";
EventDetails_SubjectNumber.componentName = "Subject Number";
EventDetails_SubjectNumber.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_SubjectNumber.isReadOnly = function() { return true; }
EventDetails_SubjectNumber.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, XPathConstants.EVENTS_XPATH + "/SubjectPartyKey", XPathConstants.EVENTS_XPATH + "/CaseFlag", Master_EventGrid.dataBinding];
EventDetails_SubjectNumber.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return subjectEnabled();
}

/*********************************************************************************/

function EventDetails_SubjectType() {}
EventDetails_SubjectType.tabIndex = -1;
EventDetails_SubjectType.maxLength = 30;
EventDetails_SubjectType.helpText = "The party type of the subject of the event";
EventDetails_SubjectType.componentName = "Subject Type";
EventDetails_SubjectType.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_SubjectType.isReadOnly = function() { return true; }
EventDetails_SubjectType.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, XPathConstants.EVENTS_XPATH + "/SubjectPartyKey", XPathConstants.EVENTS_XPATH + "/CaseFlag", Master_EventGrid.dataBinding];
EventDetails_SubjectType.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return subjectEnabled()
}

/*********************************************************************************/

function EventDetails_SubjectName() {}
EventDetails_SubjectName.tabIndex = -1;
EventDetails_SubjectName.maxLength = 70;
EventDetails_SubjectName.helpText = "The full name of the subject of the event";
EventDetails_SubjectName.componentName = "Subject Name";
EventDetails_SubjectName.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_SubjectName.isReadOnly = function() { return true; }
EventDetails_SubjectName.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, XPathConstants.EVENTS_XPATH + "/SubjectPartyKey", XPathConstants.EVENTS_XPATH + "/CaseFlag", Master_EventGrid.dataBinding];
EventDetails_SubjectName.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return subjectEnabled()
}

/*********************************************************************************/

function EventDetails_Details() {}
EventDetails_Details.tabIndex = 200;
EventDetails_Details.maxLength = 250;
EventDetails_Details.helpText = "Enter value for Event Detail";
EventDetails_Details.componentName = "Event Details";
EventDetails_Details.retrieveOn = [Master_EventGrid.dataBinding, XPathConstants.EVENTS_XPATH + "/EditDetails"];
EventDetails_Details.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_Details.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_Details.transformToDisplay = convertToUpperCase;
EventDetails_Details.transformToModel = convertToUpperStripped;

// Some Events enforce a mandatory Details entry
EventDetails_Details.mandatoryOn = [Master_EventGrid.dataBinding, XPathConstants.EVENTS_XPATH + "/EditDetails"];
EventDetails_Details.isMandatory = function()
{
	return Services.getValue(XPathConstants.EVENTS_XPATH + "/EditDetails") == "M";
}

// Some Events enforce a non update of existing details
EventDetails_Details.readOnlyOn = [Master_EventGrid.dataBinding, XPathConstants.EVENTS_XPATH + "/EditDetails"];
EventDetails_Details.isReadOnly = function()
{
	return Services.getValue(XPathConstants.EVENTS_XPATH + "/EditDetails") == "N";
}

EventDetails_Details.logicOn = [EventDetails_Details.dataBinding];
EventDetails_Details.logic = function(event)
{
	if ( event.getXPath() != EventDetails_Details.dataBinding )
	{
		return;
	}
	
	// Set the dirty flag if not previously set
	if ( Services.getValue(XPathConstants.CHANGES_MADE_XPATH) != "true" )
	{
		Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "true");
	}
	
	// Update the current event's status field
	Services.setValue(XPathConstants.EVENTS_XPATH + "/Status" , EventStatuses.STATUS_DETSCHANGED);
}

/*********************************************************************************/

function EventDetails_ErrorFlag() {}
EventDetails_ErrorFlag.modelValue = {checked: 'Y', unchecked: 'N'};
EventDetails_ErrorFlag.tabIndex = 210;
EventDetails_ErrorFlag.componentName = "Error Flag";
EventDetails_ErrorFlag.helpText = "Indicates whether or not the event was entered in error";
EventDetails_ErrorFlag.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_ErrorFlag.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_ErrorFlag.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
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
	// Change the Event's Status so error flag is updated.
	Services.setValue(XPathConstants.EVENTS_XPATH + "/Status" , EventStatuses.STATUS_ERRCHANGED);
	
	if ( caseChangesMade() )
	{
		// Save the case changes first
		prepareCaseDataForUpdate();
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.VAR_PAGE_XPATH + "/CaseUpdate/Case");
		dataNode.appendChild(node);
		var params = new ServiceParams();
		params.addDOMParameter("case", dataNode);
		Services.callService("updateCaseTrackJudge", params, EventDetails_ErrorFlag, true);
	}
	else
	{
		// No case changes made, just save events
		// Call Save service but use EventDetails_ErrorFlag.onSuccess()
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH + "/CaseEvents");
		var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH + "/CaseEvents");
		dataNode.appendChild(strippedNode);
		
		var params = new ServiceParams();
		params.addDOMParameter("caseEvents", dataNode);
		Services.callService("updateCaseEvents", params, EventDetails_ErrorFlag, true);
	}
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
EventDetails_ErrorFlag.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "updateCaseTrackJudge" )
	{
		// Has been invoked from updateCaseTrackJudge service
		// Call Save service but use EventDetails_ErrorFlag.onSuccess()
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH + "/CaseEvents");
		var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH + "/CaseEvents");
		dataNode.appendChild(strippedNode);
		
		var params = new ServiceParams();
		params.addDOMParameter("caseEvents", dataNode);
		Services.callService("updateCaseEvents", params, EventDetails_ErrorFlag, true);
	}
	else
	{
		// Has been invoked from updateCaseEvents service
		if ( null != dom )
		{
			var node = dom.selectSingleNode("/Obligations/Type");
			var navigationRule = XML.getNodeTextContent(node);

			// Either Navigate to Obligations screen or refresh the page
			if ( navigationRule == "A" )
			{
				clearAppParameters(false, true, false);
				setAppCaseNumberParameter(MaintainObligationsParams.CASE_NUMBER);
				Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
				
				var navArray = Array(NavigationController.OBLIGATIONS_FORM, NavigationController.EVENTS_FORM);
				NavigationController.createCallStack( navArray );
				NavigationController.nextScreen();		
			}
			else
			{
				retrieveCaseEvents( Services.getValue(Header_CaseNumber.dataBinding) );
			}
		}
	}
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
		retrieveCaseEvents( Services.getValue(Header_CaseNumber.dataBinding) );	
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
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);

	// Set the dirty flag to false
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "false");
}

/*********************************************************************************/

function EventDetails_Applicant() {}
EventDetails_Applicant.tabIndex = -1;
EventDetails_Applicant.maxLength = 20;
EventDetails_Applicant.helpText = "The party making the application";
EventDetails_Applicant.componentName = "Applicant";
EventDetails_Applicant.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_Applicant.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_Applicant.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_Applicant.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_Result() {}
EventDetails_Result.tabIndex = -1;
EventDetails_Result.maxLength = 12;
EventDetails_Result.helpText = "Indicates the result of the event, if any.";
EventDetails_Result.componentName = "Result";
EventDetails_Result.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_Result.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_Result.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_Result.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_BMSTask() {}
EventDetails_BMSTask.tabIndex = -1;
EventDetails_BMSTask.maxLength = 5;
EventDetails_BMSTask.helpText = "The BMS Task Number for the event.";
EventDetails_BMSTask.componentName = "BMS Task Number";
EventDetails_BMSTask.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_BMSTask.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_BMSTask.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_BMSTask.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_StatMod() {}
EventDetails_StatMod.tabIndex = -1;
EventDetails_StatMod.maxLength = 5;
EventDetails_StatMod.helpText = "The Statistics Module for the event";
EventDetails_StatMod.componentName = "Statistics Module";
EventDetails_StatMod.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_StatMod.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_StatMod.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_StatMod.isReadOnly = function() { return true; }

/*********************************************************************************/

function EventDetails_CreatedBy() {}
EventDetails_CreatedBy.tabIndex = -1;
EventDetails_CreatedBy.maxLength = 30;
EventDetails_CreatedBy.helpText = "The user who created the event";
EventDetails_CreatedBy.componentName = "Created By";
EventDetails_CreatedBy.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_CreatedBy.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_CreatedBy.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_CreatedBy.isReadOnly = function() { return true; }
EventDetails_CreatedBy.transformToDisplay = function(modelValue)
{
	var alias = Services.getValue(XPathConstants.EVENTS_XPATH + "/UserAlias");
	if ( !CaseManUtils.isBlank(alias) )
	{
		modelValue = alias;
	}
	return modelValue;
}

/*********************************************************************************/

function EventDetails_Date() {}
EventDetails_Date.tabIndex = -1;
EventDetails_Date.maxLength = 11;
EventDetails_Date.helpText = "Enter the date event took place";
EventDetails_Date.componentName = "Event Date";
EventDetails_Date.retrieveOn = [Master_EventGrid.dataBinding];
EventDetails_Date.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.dataBinding];
EventDetails_Date.isEnabled = function()
{
	// Disabled if a case has not been loaded or the event grid is empty.
	if ( !caseExists() || isEventGridEmpty() )
	{
		return false;
	}
	return true;
}
EventDetails_Date.isMandatory = function() { return true; }
EventDetails_Date.isReadOnly = function() { return true; }

/*********************************************************************************/

function DetailsOfClaim_AmountClaimedCurrency() {}
DetailsOfClaim_AmountClaimedCurrency.tabIndex = -1;
DetailsOfClaim_AmountClaimedCurrency.maxLength = 3;
DetailsOfClaim_AmountClaimedCurrency.isTemporary = function() { return true; }
DetailsOfClaim_AmountClaimedCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_AmountClaimedCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function DetailsOfClaim_AmountClaimed() {}
DetailsOfClaim_AmountClaimed.tabIndex = -1;
DetailsOfClaim_AmountClaimed.maxLength = 11;
DetailsOfClaim_AmountClaimed.helpText = "Amount claimed by claimant";
DetailsOfClaim_AmountClaimed.isTemporary = function() { return true; }
DetailsOfClaim_AmountClaimed.isReadOnly = function() { return true; }
DetailsOfClaim_AmountClaimed.transformToDisplay = function(value)
{
	return transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_CourtFeeCurrency() {}
DetailsOfClaim_CourtFeeCurrency.tabIndex = -1;
DetailsOfClaim_CourtFeeCurrency.maxLength = 3;
DetailsOfClaim_CourtFeeCurrency.isTemporary = function() { return true; }
DetailsOfClaim_CourtFeeCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_CourtFeeCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function DetailsOfClaim_CourtFee() {}
DetailsOfClaim_CourtFee.tabIndex = -1;
DetailsOfClaim_CourtFee.maxLength = 7;
DetailsOfClaim_CourtFee.helpText = "The fee for issue of the claim";
DetailsOfClaim_CourtFee.isTemporary = function() { return true; }
DetailsOfClaim_CourtFee.isReadOnly = function() { return true; }
DetailsOfClaim_CourtFee.transformToDisplay = function(value)
{
	return transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_SolicitorsCostsCurrency() {}
DetailsOfClaim_SolicitorsCostsCurrency.tabIndex = -1;
DetailsOfClaim_SolicitorsCostsCurrency.maxLength = 3;
DetailsOfClaim_SolicitorsCostsCurrency.isTemporary = function() { return true; }
DetailsOfClaim_SolicitorsCostsCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_SolicitorsCostsCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function DetailsOfClaim_SolicitorsCosts() {}
DetailsOfClaim_SolicitorsCosts.tabIndex = -1;
DetailsOfClaim_SolicitorsCosts.maxLength = 7;
DetailsOfClaim_SolicitorsCosts.helpText = "Costs on issue of the claim";
DetailsOfClaim_SolicitorsCosts.isTemporary = function() { return true; }
DetailsOfClaim_SolicitorsCosts.isReadOnly = function() { return true; }
DetailsOfClaim_SolicitorsCosts.transformToDisplay = function(value)
{
	return transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_TotalCurrency() {}
DetailsOfClaim_TotalCurrency.tabIndex = -1;
DetailsOfClaim_TotalCurrency.maxLength = 3;
DetailsOfClaim_TotalCurrency.isTemporary = function() { return true; }
DetailsOfClaim_TotalCurrency.isReadOnly = function() { return true; }
DetailsOfClaim_TotalCurrency.transformToDisplay = function(value)
{
	return CaseManUtils.transformCurrencySymbolToDisplay(value, XPathConstants.REF_DATA_XPATH + "/CurrentCurrency/CurrencySymbol");
}

/*********************************************************************************/

function DetailsOfClaim_Total() {}
DetailsOfClaim_Total.tabIndex = -1;
DetailsOfClaim_Total.maxLength = 11;
DetailsOfClaim_Total.helpText = "Total";
DetailsOfClaim_Total.isTemporary = function() { return true; }
DetailsOfClaim_Total.isReadOnly = function() { return true; }
DetailsOfClaim_Total.transformToDisplay = function(value)
{
	return transformAmountToTwoDP(value, this.maxLength);
}

/*********************************************************************************/

function DetailsOfClaim_DateOfIssue() {}
DetailsOfClaim_DateOfIssue.tabIndex = -1;
DetailsOfClaim_DateOfIssue.maxLength = 11;
DetailsOfClaim_DateOfIssue.helpText = "The date claim issued";
DetailsOfClaim_DateOfIssue.isTemporary = function() { return true; }
DetailsOfClaim_DateOfIssue.isReadOnly = function() { return true; }

/*********************************************************************************/

function AddEvent_DateReceived() {}
AddEvent_DateReceived.tabIndex = 600;
AddEvent_DateReceived.maxLength = 11;
AddEvent_DateReceived.helpText = "Date when work received at court.";
AddEvent_DateReceived.isTemporary = function() { return true; }
AddEvent_DateReceived.isMandatory = function() { return true; }
AddEvent_DateReceived.validate = function()
{
	var ec = null;

	var d = Services.getValue(AddEvent_DateReceived.dataBinding);
	var date = CaseManUtils.isBlank(d) ? null : CaseManUtils.createDate(d);
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	var monthAgo = CaseManUtils.oneMonthEarlier(today);
	
	if (null != date)
	{
		// Check date is not in the future
		if (CaseManUtils.compareDates(today, date) == 1)
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
		
		// Check if date is more than 1 month in the past, if so give warning
		if (CaseManUtils.compareDates(monthAgo, date) == -1)
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
AddEvent_EventId.helpText = "The unique identifier for the standard event";
AddEvent_EventId.isTemporary = function() { return true; }
AddEvent_EventId.isMandatory = function() { return true; }
AddEvent_EventId.isReadOnly = function() { return true; }

/*********************************************************************************/

function AddEvent_EventDescription() {}
AddEvent_EventDescription.tabIndex = -1;
AddEvent_EventDescription.maxLength = 70;
AddEvent_EventDescription.helpText = "Description of the event, action, proceedings etc.";
AddEvent_EventDescription.isTemporary = function() { return true; }
AddEvent_EventDescription.isMandatory = function() { return true; }
AddEvent_EventDescription.isReadOnly = function() { return true; }

/*********************************************************************************/

function AddEvent_Subject() {}
AddEvent_Subject.srcDataOn = [XPathConstants.DATA_XPATH + "/Parties/Party/SubjectForEvent"];
AddEvent_Subject.srcData = XPathConstants.DATA_XPATH + "/Parties";
AddEvent_Subject.rowXPath = "Party[./SubjectForEvent = 'true']";
AddEvent_Subject.keyXPath = "PartyKey";
AddEvent_Subject.displayXPath = "SubjectValue";
AddEvent_Subject.strictValidation = true;
AddEvent_Subject.tabIndex = 610;
AddEvent_Subject.helpText = "The subject of the event";
AddEvent_Subject.isTemporary = function() { return true; }
AddEvent_Subject.validateOn = [XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey"];
AddEvent_Subject.validate = function(event)
{
	// Check value entered is actually a party.
	var subjectKey = Services.getValue(AddEvent_Subject.dataBinding);
	var subjectCaseFlag = Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH);
	if ( subjectCaseFlag != "Y" && ( CaseManUtils.isBlank(subjectKey) || !Services.exists(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = '" + subjectKey + "']") ) )
	{
		return null;
	}

	/*** Get Validation Flags returned by the Rules Engine ***/
	
	// Indicates there is validation surrounding Date of Service to be done
	var dateOfService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionDateOfServiceCheck");

	// Indicates if active judgment validation should be done
	// The list returned is a list of defendants with no judgment with a status of NULL or VARIED
	var activeJdg = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionActiveJudgment");

	// Indicates if the subject needs to be the party against in an unregistered Judgment of type 'JUDGES'
	var jdgForRedetermination = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionJudgmentForRedeterminationMustExist");

	// Indicates there are parties with a bar on judgment that cannot be subject
	var barOnJdg = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionBarOnJudgmentNotSet");
	
	// Returns a count of the event pre-requisites against the subject
	var eventPreReqCount = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustExist/Event[./PartyDependant != 'NO']");
	
	// Indicates if the subject cannot have a Judgment recorded against them with a particular status (blank, cancelled or satisfied)
	var judgmentStatusCheck = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionJudgmentSuitableForAdmissionOrDefence");
	
	// Indicates if the subject needs to have a warrant recorded against them
	var warrantAgainstCheck = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/CCBCPreConditionWarrantMustExistAgainstSubject");

	// Indicates if the subject must have a judgment recorded against them with a status of satisfied or cancelled	
	var ccbcJudgmentStatusCheck = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/CCBCCreateCertOfSatisfaction");
	
	var ec = null;
	if ( subjectCaseFlag == "Y" )
	{
		var partyTypeCode = null;
		
		// Subject Case Flag selected, validate all parties
		var countParties = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party");
		for ( var i=0; i<countParties; i++ )
		{
			partyTypeCode = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + (i + 1) + "]/PartyRoleCode");
			if ( partyTypeCode != PartyTypeCodesEnum.SOLICITOR )
			{
				// Filter out solicitors for validation
				subjectKey = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[" + (i + 1) + "]/PartyKey");
				ec = validateSubject(subjectKey, dateOfService, activeJdg, jdgForRedetermination, barOnJdg, eventPreReqCount, judgmentStatusCheck, warrantAgainstCheck, ccbcJudgmentStatusCheck);
	
				if ( null != ec )
				{
					// If any parties are invalid, display the invalid party in the
					// subject field with specific error message.  JavaScript alert can inform
					// user that CASE cannot be selected.
					Services.startTransaction();
					Services.setValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, "");
					Services.setValue(AddEvent_Subject.dataBinding, subjectKey);
					Services.endTransaction();
					
					// Inform user cannot select CASE
					alert(Messages.CANNOT_SELECT_SUBJECTCASEFLAG_MESSAGE);
					break;
				}
			}
		}
	}
	else
	{
		ec = validateSubject(subjectKey, dateOfService, activeJdg, jdgForRedetermination, barOnJdg, eventPreReqCount, judgmentStatusCheck, warrantAgainstCheck, ccbcJudgmentStatusCheck);	
	}
	
	return ec;
}

AddEvent_Subject.enableOn = [XPathConstants.SUBJECT_TYPE_XPATH];
AddEvent_Subject.isEnabled = function()
{
	// Disabled if no Subject
	var type = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	return ( type == SubjectTypeCodes.NONE || type == SubjectTypeCodes.AUTO ) ? false : true;
}

AddEvent_Subject.mandatoryOn = [XPathConstants.SUBJECT_TYPE_XPATH, XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH];
AddEvent_Subject.isMandatory = function()
{
	var type = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	if ( (type == SubjectTypeCodes.CASE || type == SubjectTypeCodes.CASEDEF) && 
		 Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH) == "Y" )
	{
		// Case Flag has been selected so field is read only and blank (if valid) (Therefore not mandatory)
		return !( null == AddEvent_Subject.validate() );
	}
	// Not mandatory if No Subject
	return ( type == SubjectTypeCodes.NONE || type == SubjectTypeCodes.AUTO ) ? false : true;
}

AddEvent_Subject.readOnlyOn = [XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH];
AddEvent_Subject.isReadOnly = function()
{
	var caseFlag = Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH);
	return ( caseFlag == "Y" && null == AddEvent_Subject.validate() );
}

AddEvent_Subject.logicOn = [AddEvent_Subject.dataBinding];
AddEvent_Subject.logic = function(event)
{
	// Do nothing if from wrong input
	if ( event.getXPath() != AddEvent_Subject.dataBinding )
	{
		return;
	}
	
	var subjectKey = Services.getValue(AddEvent_Subject.dataBinding);
	if ( !CaseManUtils.isBlank(subjectKey) && !Services.exists(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + AddEvent_Subject.dataBinding + "]") )
	{
		// Exit if the subject entered is not in the list of values
		return;
	}
	
	// Validation warning message for the subject field
	if ( !CaseManUtils.isBlank(subjectKey) )
	{
		var dateOfService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionDateOfServiceCheck");
		var subDateOfService = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/DateOfServiceCheck/Parties/Party[./SubjectPartyKey = '" + subjectKey + "']/DateOfService");
		if ( dateOfService == "true" && CaseManUtils.isBlank( subDateOfService ) )
		{
			alert(Messages.NO_DATEOFSERVICE_MESSAGE);
		}
	}
	
	var subjectType = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	if ( subjectType != SubjectTypeCodes.NONE && subjectType != SubjectTypeCodes.AUTO )
	{
		if ( !CaseManUtils.isBlank(subjectKey) )
		{
			// Get Instigator type and set the parties for Instigator selection
			var instigatorType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType");
			setInstigatorsForEvent(instigatorType);
		}
		else
		{
			clearPartyInstigators();
		}
	}
}

/*********************************************************************************/

function AddEvent_InstigatorLabel() {}
AddEvent_InstigatorLabel.tabIndex = -1;
AddEvent_InstigatorLabel.maxLength = 250;
AddEvent_InstigatorLabel.helpText = "Variable question for the grid below";
AddEvent_InstigatorLabel.isTemporary = function() { return true; }
AddEvent_InstigatorLabel.isReadOnly = function() { return true; }
AddEvent_InstigatorLabel.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType"];
AddEvent_InstigatorLabel.isEnabled = function()
{
	var instigatorType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType");
	if ( CaseManUtils.isBlank(instigatorType) )
	{
		return false;
	}
	return (instigatorType != InstigatorTypeCodes.NONE);
}

/*********************************************************************************/

function AddEvent_Details() {}
AddEvent_Details.tabIndex = 640;
AddEvent_Details.maxLength = 250;
AddEvent_Details.helpText = "Enter value for Event Detail";
AddEvent_Details.isTemporary = function() { return true; }
AddEvent_Details.transformToDisplay = convertToUpperCase;
AddEvent_Details.transformToModel = convertToUpperStripped;
AddEvent_Details.mandatoryOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsMandatory"];
AddEvent_Details.isMandatory = function()
{
	var isMandatory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsMandatory");
	return isMandatory == "true";
}

AddEvent_Details.readOnlyOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsDomain"];
AddEvent_Details.isReadOnly = function()
{
	var lovValue = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsDomain");
	return !CaseManUtils.isBlank(lovValue);
}

/*********************************************************************************/

function AddEvent_Date() {}
AddEvent_Date.tabIndex = 660;
AddEvent_Date.maxLength = 11;
AddEvent_Date.helpText = "The event creation date";
AddEvent_Date.isTemporary = function() { return true; }
AddEvent_Date.isMandatory = function() { return true; }
AddEvent_Date.validate = function()
{
	var ec = null;
	var d = Services.getValue(AddEvent_Date.dataBinding);
	var date = CaseManUtils.isBlank(d) ? null : CaseManUtils.createDate(d);
	var today = CaseManUtils.createDate( CaseManUtils.getSystemDate(XPathConstants.SYSTEMDATE_XPATH) );
	
	if (null != date)
	{
		// Check date is not in the future
		if (CaseManUtils.compareDates(today, date) == 1)
		{
			ec = ErrorCode.getErrorCode("CaseMan_dateCannotBeInTheFuture_Msg");
		}
	}
	return ec;
}

/*********************************************************************************/

function AddEvent_WPCall() {}
AddEvent_WPCall.modelValue = {checked: 'true', unchecked: 'false'};
AddEvent_WPCall.tabIndex = 670;
AddEvent_WPCall.isTemporary = function() { return true; }
AddEvent_WPCall.helpText = "Uncheck checkbox if no output required";
AddEvent_WPCall.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/WordProcessingCall"];
AddEvent_WPCall.isEnabled = function()
{
	var wpCallInd = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/WordProcessingCall");
	return ( wpCallInd == "true" ) ? true : false;
}

/*************************** BUTTON FIELDS ****************************************/

function Header_ObligationsExistButton() {}
Header_ObligationsExistButton.tabIndex = 15;
Header_ObligationsExistButton.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.OBLIGATIONS_EXIST_XPATH, XPathConstants.CASE_EXISTS_XPATH];
Header_ObligationsExistButton.isEnabled = function()
{
	if ( Services.getValue(XPathConstants.OBLIGATIONS_EXIST_XPATH) != "true")
	{
		return false;
	}
	return caseExists();
}

/**
 * @author rzxd7g
 * 
 */
Header_ObligationsExistButton.actionBinding = function()
{
	clearAppParameters(false, true, false);
	setAppCaseNumberParameter(MaintainObligationsParams.CASE_NUMBER);
	Services.setValue(MaintainObligationsParams.MAINTENANCE_MODE, "M");
	
	// Check to see if changes made before navigating away
	verifyNavigation( Array(NavigationController.OBLIGATIONS_FORM, NavigationController.EVENTS_FORM) );
};

/**********************************************************************************/

function Header_WindowsForTrialExistButton() {}
Header_WindowsForTrialExistButton.tabIndex = 16;
Header_WindowsForTrialExistButton.enableOn = [Header_CaseNumber.dataBinding, XPathConstants.WFT_EXIST_XPATH, XPathConstants.CASE_EXISTS_XPATH];
Header_WindowsForTrialExistButton.isEnabled = function()
{
	if ( Services.getValue(XPathConstants.WFT_EXIST_XPATH) != "true")
	{
		return false;
	}
	return caseExists();
}

/**
 * @author rzxd7g
 * 
 */
Header_WindowsForTrialExistButton.actionBinding = function()
{
	clearAppParameters(false, true, false);
	setAppCaseNumberParameter(MaintainWftParams.CASE_NUMBER);
	
	// Check to see if changes made before navigating away
	verifyNavigation( Array(NavigationController.WFT_FORM, NavigationController.EVENTS_FORM) );
};

/**********************************************************************************/

function Header_CaseDetailsReportButton() {}
Header_CaseDetailsReportButton.tabIndex = 17;
Header_CaseDetailsReportButton.enableOn = [XPathConstants.CASE_EXISTS_XPATH, Header_OwningCourtCode.dataBinding];
Header_CaseDetailsReportButton.isEnabled = function()
{
	var blnEnabled = false;
	if ( caseExists() )
	{
		var userRole = Services.getValue(CaseManFormParameters.SECURITYROLE_XPATH);
		if ( Services.getValue(Header_OwningCourtCode.dataBinding) == CaseManUtils.CCBC_COURT_CODE )
		{
			// Enabled if the Case Exists and the Case is CCBC (Court 335)
			blnEnabled = true;
		}
		else if ( userRole == "ccbcMan" || userRole == "ccbcUser" )
		{
			// UCT_Group2 Defect 1558: Also enabled on Non-CCBC courts for CCBC Manager
			// and CCBC User roles
			blnEnabled = true;
		}
	}
	return blnEnabled;
}

/**
 * @author rzxd7g
 * 
 */
Header_CaseDetailsReportButton.actionBinding = function()
{
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_CASEDETAILSREPORT;
		Status_SaveButton.actionBinding();
	}
	else
	{
		runCCBCCaseDetailsReport();
	}
};

/**********************************************************************************/

function Master_PreviousButton() {}
Master_PreviousButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_P, element: "manageEvents", alt: true } ]
	}
};
Master_PreviousButton.tabIndex = 110;
Master_PreviousButton.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, XPathConstants.CE_PAGENUMBER_XPATH];
Master_PreviousButton.isEnabled = function()
{
	if ( !caseExists() )
	{
		return false;
	}
	
	// Disable Previous button if on first page
	var pageNumber = Services.getValue(XPathConstants.CE_PAGENUMBER_XPATH);
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
	var pageNumber = parseInt(Services.getValue(XPathConstants.CE_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.CE_PAGENUMBER_XPATH, (pageNumber - 1) );
	
	// Dirty Flag Check
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		retrieveCaseEvents(caseNumber);
	}
}

/**********************************************************************************/

function Master_NextButton() {}
Master_NextButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_N, element: "manageEvents", alt: true } ]
	}
};
Master_NextButton.tabIndex = 120;
Master_NextButton.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH, Master_EventGrid.srcData];
Master_NextButton.isEnabled = function()
{
	if ( !caseExists() )
	{
		return false;
	}
	
	var countRecords = Services.countNodes( Master_EventGrid.srcData + "/" + Master_EventGrid.rowXPath );
	if ( countRecords == CaseEventConstants.PAGE_SIZE )
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
	var pageNumber = parseInt(Services.getValue(XPathConstants.CE_PAGENUMBER_XPATH));
	Services.setValue( XPathConstants.CE_PAGENUMBER_XPATH, (pageNumber + 1) );
	
	// Dirty Flag Check
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
	{
		Status_SaveButton.actionBinding();
	}
	else
	{
		// Invoke the retrieval service
		var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
		retrieveCaseEvents(caseNumber);
	}
}

/**********************************************************************************/

function Master_EventLOVButton() {}
Master_EventLOVButton.tabIndex = 150;
Master_EventLOVButton.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH];
Master_EventLOVButton.isEnabled = caseExists;

/**********************************************************************************/

function Master_AddEventButton() {}

Master_AddEventButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F2, element: "manageEvents" } ],
	    enableOn: [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH],
	    isEnabled: function() { return caseExists(); }
	}
};

Master_AddEventButton.tabIndex = 160;
Master_AddEventButton.enableOn = [Header_CaseNumber.dataBinding,XPathConstants.CASE_EXISTS_XPATH,Master_EventId.dataBinding];
Master_AddEventButton.isEnabled = function()
{
	if ( !caseExists() )
	{
		// Case loaded is not valid (UCT_Group2 Defect 1555)
		return false;
	}
	
	// Enable Add button if a valid Event has been selected
	var event = Services.getValue(Master_EventId.dataBinding);
	return ( !CaseManUtils.isBlank(event) &&  null == Master_EventId.validate() );
}

/**
 * @author rzxd7g
 * 
 */
Master_AddEventButton.actionBinding = function()
{
	var caseType = Services.getValue("ds/ManageCaseEvents/CaseType");
	// Check if any unsaved data
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE))
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_CREATENEWEVENT;
		Status_SaveButton.actionBinding();
	}
	//Check if insolvency case has been transferred from another SUPS court and insolvency number is blank. If so, show an alert and clear out the event number added
	else if (CaseManUtils.isInsolvencyCase(caseType) && (Services.getValue(XPathConstants.INSOLVENCY_NO_CONJOINED) == null || Services.getValue(XPathConstants.INSOLVENCY_NO_CONJOINED) == ""))
	{
		var owningCourtName = Services.getValue(Header_OwningCourtName.dataBinding);
		//Services.setValue(Master_EventId.dataBinding, "");
		Services.showDialog(StandardDialogTypes.OK,function(){},Messages.format(Messages.INSOLVENCY_NUMBER_REQUIRED,[owningCourtName]),'Insolvency Number required');
	}
	else
	{
		handleNewEventPopup();
	}
};

/**
 * @param dom
 * @author rzxd7g
 * @return null 
 */
Master_AddEventButton.onSuccess = function(dom)
{
	// Add the node to the DOM
	var node = dom.selectSingleNode("/CaseEventValidationData");
	Services.replaceNode(XPathConstants.EVENTVALIDATION_XPATH, node);
	
	// Check if event can be created for this court code
	var ccbcOnlyEvent = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/CCBCSpecificEvent");
	var caseOwningCourt = Services.getValue(Header_OwningCourtCode.dataBinding);
	if ( ccbcOnlyEvent == "true" && caseOwningCourt != CaseManUtils.CCBC_COURT_CODE )
	{
		var ec = ErrorCode.getErrorCode("CaseMan_CCBCOnlyEvent_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
		return;
	}

	// Check event pre-requisites that are not party specific
	var chkPreReqEvent = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionEventMustExist");
	var prEventsAgainstCaseList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustExist/Event[./PartyDependant = 'NO']/EventId");
	if ( chkPreReqEvent == "true" && prEventsAgainstCaseList.length > 0 )
	{
		var countPREventsPresent = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustExist/Event[./PartyDependant = 'NO' and ./RecordedAgainst/Case = 'true']");
		if ( countPREventsPresent == 0 )
		{
			// None of the event pre-requisites against the Case exist.
			var msgText = XML.getNodeTextContent( prEventsAgainstCaseList[0] );
			var errCode = "CaseMan_CaseEvent_SinglePreReqEvent_Msg";
			if ( prEventsAgainstCaseList.length > 1 )
			{
				// Construct the error message
				for (var i=1, l=prEventsAgainstCaseList.length; i<l; i++)
				{
					var nextEvent = XML.getNodeTextContent( prEventsAgainstCaseList[i] );
					if ( i == (l-1) )
					{
						msgText = msgText + " or " + nextEvent;
					}
					else
					{
						msgText = msgText + ", " + nextEvent;
					}
				}
				errCode = "CaseMan_CaseEvent_MultiPreReqEvent_Msg";
			}
			
			var ec = ErrorCode.getErrorCode(errCode);
			ec.m_message = ec.m_message.replace(/XXX/, msgText);
			Services.setTransientStatusBarMessage(ec.getMessage());
			return;
		}
	}
	
	// Event must NOT exist validation
	var chkEventNotExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionEventMustNotExist");
	if ( !CaseManUtils.isBlank(chkEventNotExist) )
	{
		var eventExists = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreConditionEventsMustNotExist/Event[./EventId = '" + chkEventNotExist + "']/RecordedAgainst/Case");
		if ( eventExists == "true" )
		{
			// The event which must not exist against the case does.
			var ec = ErrorCode.getErrorCode("CaseMan_CaseEvent_EventMustNotExist_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, chkEventNotExist);
			Services.setTransientStatusBarMessage( ec.getMessage() );
			return;
		}
	}

	// Check Active Judgment validation on the case
	var activeJudgment = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionActiveJudgment");
	var subjectType = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);

	// Get count of number of parties with an active Judgment
	var countJudgments = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/ActiveJudgments/Judgments/Judgment");
	if ( activeJudgment == "NOT_REQUIRED" && 
		(subjectType == SubjectTypeCodes.NONE || subjectType == SubjectTypeCodes.AUTO || subjectType == SubjectTypeCodes.CASEONLY) 
		&& countJudgments > 0 )
	{
		// Judgment cannot exist on the case, there is no subject and there are active Judgments
		var ec = ErrorCode.getErrorCode("CaseMan_judgmentExists_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
		return;
	}
	else if ( activeJudgment == "REQUIRED" && (subjectType == SubjectTypeCodes.NONE || subjectType == SubjectTypeCodes.AUTO) && countJudgments == 0 )
	{
		// Judgment must exist on the case, there is no subject and there are no active Judgments
		var ec = ErrorCode.getErrorCode("CaseMan_judgmentMustExist_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
		return;
	}
	
	// Case Status Validation
	var caseStatusStayed = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreconditionCaseStatusStayed");
	var caseStatusNotValid = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionNotCaseStatusCheck");
	var caseStatus = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/Case/Status");
	if ( caseStatusStayed == "true" && caseStatus != "STAYED" )
	{
		// Case Status MUST be 'STAYED' but it is not
		var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_caseMustBeStayed_Msg");
		Services.setTransientStatusBarMessage(ec.getMessage());
		return;
	}
	else if ( caseStatusNotValid == "true" )
	{
		// Event requires the case status cannot be one of a number of values (Temp_CaseMan Defect 310)
		var invalidCaseStatusList = Services.getNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PreRequisiteNotCaseStatuses/Status");
		var messageParam = null;
		for (var i=0, l=invalidCaseStatusList.length; i<l; i++)
		{
			var nextInvalidStatus = XML.getNodeTextContent( invalidCaseStatusList[i] );
			if ( caseStatus == nextInvalidStatus )
			{
				messageParam = nextInvalidStatus;
				break;
			}
		}
		
		if ( null != messageParam )
		{
			// Case Status is not valid for the event
			var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_caseCannotBeXXX_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, messageParam);
			Services.setTransientStatusBarMessage(ec.getMessage());
			return;
		}
	}

	// Party must exist validation
	var partyMustExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionPartyMustExist");
	if ( !CaseManUtils.isBlank(partyMustExist) )
	{
		var partyCount = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + partyMustExist + "']");
		if ( partyCount == 0 )
		{
			// The Pre-requisite party type does not exist on the case
			var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_missingParty_Msg");
			ec.m_message = ec.m_message.replace(/XXX/, PartyTypeCodesEnum.getPartyTypeDescription(partyMustExist) );
			Services.setTransientStatusBarMessage( ec.getMessage() );
			return;
		}
	}
	
	// Part 20 Parties must exist validation (UCT Defect 790)
	var part20PartyMustExist = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/Part20PartiesRequired");
	if ( part20PartyMustExist == "true" )
	{
		var part20defCount = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.PART_20_DEFENDANT + "']");
		var part20claimCount = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyRoleCode = '" + PartyTypeCodesEnum.PART_20_CLAIMANT + "']");
		if ( part20defCount == 0 || part20claimCount == 0 )
		{
			// There are either no Part 20 Defendants or no Part 20 Claimants on the case
			var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_missingPt20Parties_Msg");
			Services.setTransientStatusBarMessage( ec.getMessage() );
			return;
		}
	}
	
	var trackMustBeSet = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionTrackMustBeSet");
	if ( trackMustBeSet == "true" )
	{
		// Use value of OriginalTrack node as value shown on screen may be stale (user can change value then open add popup without saving changes)
		var originalTrack = Services.getValue(XPathConstants.DATA_XPATH + "/OriginalTrack");
		if (CaseManUtils.isBlank(originalTrack))
		{
			// The Track is currently blank, throw error message
			var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_trackIsBlank_Msg");
			Services.setTransientStatusBarMessage( ec.getMessage() );
			return;
		}
	}
	
	var familyEnforcOnly = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/PreConditionFamilyEnforcementOnly");
	if ( familyEnforcOnly == "true" )
	{
		// Determine if the case type is Family Enforcement
		var jurisdiction = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/Jurisdiction");
		if (jurisdiction != 'F')
		{
			// The case is not a Family Enforcement case
			var ec = ErrorCode.getErrorCode("CaseMan_caseEvent_familyEnforcementOnly_Msg");
			Services.setTransientStatusBarMessage( ec.getMessage() );
			return;
		}
	}
	
	// Raise Add Event popup.
	Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_RAISE);

	// Active AE Warning Check
	var aeExistenceCheck = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/AeExistenceCheck");
	if ( aeExistenceCheck == "true" )
	{
		var aeExists = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/AeExists");
		if ( aeExists == "true" )
		{
			// Warn user that Live AE exists on the case
			alert(Messages.LIVE_AEORDER_MESSAGE);
		}
	}
	
	var confidentialityWarning = Services.getValue(XPathConstants.DATA_XPATH + "/FlagConfidentiality");
	if ( confidentialityWarning == "true" )
	{
		// Warn user that a party on the case has requested confidentiality
		alert(Messages.CONFIDENTIALITY_MESSAGE);
	}

	// Check if Details of Claim popup needs to appear
	var detsOfClaim = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/DisplayClaimDetails");
	if (detsOfClaim == "true")
	{
		Services.dispatchEvent("Details_Of_Claim_Popup", BusinessLifeCycleEvents.EVENT_RAISE);
		Services.setFocus("DetailsOfClaim_CloseButton");
	}
	else
	{
		// If no details of claim popup, set up all other fields on the popup.
		configureAddEventPopup();
	}	
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
Master_AddEventButton.onError = function(exception)
{
	alert(Messages.SERVICE_CALL_FAILURE_MESSAGE);
	exitScreen();
}

/**********************************************************************************/

function Status_SaveButton() {}

Status_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "manageEvents" } ]
	}
};

Status_SaveButton.tabIndex = 400;
/**
 * @author rzxd7g
 * @return null 
 */
Status_SaveButton.actionBinding = function()
{
	// If no case has been loaded, do nothing.
	if ( !caseExists() )
	{
		return;
	}
	
	// Validate the form
	var invalidFields = FormController.getInstance().validateForm(true, true);
	if (0 != invalidFields.length)
	{
		return;
	}

	// Check if any changes exist
	if ( caseChangesMade() )
	{
		// Changes to Case details have been made, save those first
		prepareCaseDataForUpdate();
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.VAR_PAGE_XPATH + "/CaseUpdate/Case");
		dataNode.appendChild(node);
		
		var params = new ServiceParams();
		params.addDOMParameter("case", dataNode);
		Services.callService("updateCaseTrackJudge", params, Status_SaveButton, true);
	}
	else if ( changesMade() )
	{
		// No Case details changes, but Case Event changes exist
		var dataNode = XML.createDOM(null, null, null);
		var node = Services.getNode(XPathConstants.DATA_XPATH + "/CaseEvents")
		var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH + "/CaseEvents");
		dataNode.appendChild(strippedNode);
		
		var params = new ServiceParams();
		params.addDOMParameter("caseEvents", dataNode);
		Services.callService("updateCaseEvents", params, Status_SaveButton, true);
	}	
}

/**
 * @param dom
 * @author rzxd7g
 * 
 */
Status_SaveButton.onSuccess = function(dom, serviceName)
{
	if ( serviceName == "updateCaseTrackJudge" )
	{
		// Invoked from call to updateCaseEvents
		if ( changesMade() )
		{
			// Case Event changes made
			var dataNode = XML.createDOM(null, null, null);
			var node = Services.getNode(XPathConstants.DATA_XPATH + "/CaseEvents")
			var strippedNode = RecordsProtocol.stripCleanRecords(node, XPathConstants.DATA_XPATH + "/CaseEvents");
			dataNode.appendChild(strippedNode);
			
			var params = new ServiceParams();
			params.addDOMParameter("caseEvents", dataNode);
			Services.callService("updateCaseEvents", params, Status_SaveButton, true);
		}
		else
		{
			// No Case Event changes made, retrieve case event details
			retrieveCaseEvents( Services.getValue(Header_CaseNumber.dataBinding) );	
		}
	}
	else
	{
		// Invoked from call to updateCaseEvents, retrieve case event details
		retrieveCaseEvents( Services.getValue(Header_CaseNumber.dataBinding) );	
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
		retrieveCaseEvents( Services.getValue(Header_CaseNumber.dataBinding) );	
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
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);

	// Set the dirty flag to false
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "false");
}

/**********************************************************************************/

function Status_ClearButton() {}

Status_ClearButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.CHAR_C, element: "manageEvents", alt: true } ]
	}
};

Status_ClearButton.tabIndex = 410;
/**
 * @author rzxd7g
 * 
 */
Status_ClearButton.actionBinding = function()
{
	// Check if any unsaved data
	if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
	{
		PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_CLEARFORM;
		Status_SaveButton.actionBinding();
	}
	else
	{
		resetForm();
	}
};

/**********************************************************************************/

function Status_CloseButton() {}

Status_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "manageEvents" } ]
	}
};

Status_CloseButton.tabIndex = 420;
Status_CloseButton.actionBinding = checkChangesMadeBeforeExit;

/**********************************************************************************/

function DetailsOfClaim_CloseButton() {}
DetailsOfClaim_CloseButton.tabIndex = 500;
DetailsOfClaim_CloseButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "Details_Of_Claim_Popup" } ]
	}
};
/**
 * @author rzxd7g
 * 
 */
DetailsOfClaim_CloseButton.actionBinding = function()
{
	Services.dispatchEvent("Details_Of_Claim_Popup", BusinessLifeCycleEvents.EVENT_LOWER);

	// Setup all other fields on the Add Event popup.
	configureAddEventPopup();
};

/**********************************************************************************/

function AddEvent_SubjectLOVButton() {}
AddEvent_SubjectLOVButton.tabIndex = 620;
AddEvent_SubjectLOVButton.enableOn = [XPathConstants.SUBJECT_TYPE_XPATH, XPathConstants.DATA_XPATH + "/Parties/Party/SubjectForEvent"];
AddEvent_SubjectLOVButton.isEnabled = function()
{
	var type = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	var countPossibleSubjects = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./SubjectForEvent = 'true']");
	if ( countPossibleSubjects == 1 )
	{
		// Disable LOV button if only one possible Subject can be selected.
		return false;
	}
	
	// Disable LOV Button is the subject type is 1 (No Subject)
	return ( type == SubjectTypeCodes.NONE || type == SubjectTypeCodes.AUTO || type == SubjectTypeCodes.CASEONLY ) ? false : true;
}

/**********************************************************************************/

function AddEvent_DetailsLOVButton() {}
AddEvent_DetailsLOVButton.tabIndex = 650;
AddEvent_DetailsLOVButton.enableOn = [XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsDomain"];
AddEvent_DetailsLOVButton.isEnabled = function()
{
	var lovValue = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsDomain");
	return !CaseManUtils.isBlank(lovValue);
}

/**********************************************************************************/

function AddEvent_SaveButton() {}
AddEvent_SaveButton.tabIndex = 680;
AddEvent_SaveButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F3, element: "AddEvent_Popup" } ]
	}
};

AddEvent_SaveButton.enableOn = [AddEvent_DateReceived.dataBinding, AddEvent_Subject.dataBinding, AddEvent_Details.dataBinding, AddEvent_Date.dataBinding, XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey", XPathConstants.NEWEVENT_XPATH + "/JudgmentId"];
AddEvent_SaveButton.isEnabled = function(event)
{
	// Check Date fields
	var dateRequestReceived = Services.getValue(AddEvent_DateReceived.dataBinding);
	var dateReqRecValid = Services.getAdaptorById("AddEvent_DateReceived").getValid();
	var eventDate = Services.getValue(AddEvent_Date.dataBinding);
	var eventDateValid = Services.getAdaptorById("AddEvent_Date").getValid();
	if ( CaseManUtils.isBlank(dateRequestReceived) || CaseManUtils.isBlank(eventDate) || 
		 !dateReqRecValid || !eventDateValid )
	{
		// One of the date fields are blank or invalid
		return false;
	}
	
	// Check Details field which can be mandatory
	var isDetailsMandatory = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/LOVDetailsMandatory");
	var detailsValue = Services.getValue(AddEvent_Details.dataBinding);
	if ( isDetailsMandatory == "true" && CaseManUtils.isBlank(detailsValue) )
	{
		// Details field is mandatory and blank
		return false;
	}
	
	// Check validity of subject field
	var subjectType = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	var caseFlag = Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH);
	var subject = Services.getValue(AddEvent_Subject.dataBinding);
	var isMand = AddEvent_Subject.isMandatory();
	var isValid = Services.getAdaptorById("AddEvent_Subject").getValid();
	if ( subjectType == SubjectTypeCodes.CASE || subjectType == SubjectTypeCodes.CASEDEF )
	{
		if ( caseFlag != "Y" )
		{
			if ( !isValid || ( isMand && CaseManUtils.isBlank(subject) ) )
			{
				return false
			}
		}
	}
	else if ( subjectType == SubjectTypeCodes.DEFENDANTS || subjectType == SubjectTypeCodes.ALLPARTIES )
	{
		if ( !isValid || ( isMand && CaseManUtils.isBlank(subject) ) )
		{
			return false
		}
	}
	
	// Check Instigator grid
	var instigatorType = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorType");
	if ( !CaseManUtils.isBlank(instigatorType) && instigatorType != InstigatorTypeCodes.NONE )
	{
		// Make sure that at least one Instigator is selected
		var countInstigators = Services.countNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey");
		if ( countInstigators == 0 )
		{
			return false;
		}
		
		// Ensure if only one Instigator can be selected
		var instigatorMultiSelect = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/InstigatorMultiSelect");
		if ( instigatorMultiSelect == "false" && countInstigators > 1 )
		{
			return false;
		}
		
		// Check if a JudgmentId has to be set and has been
		var subjInstCheckFlag = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/UpdateDeterminationJudgment");
		var judgmentId = Services.getValue(XPathConstants.NEWEVENT_XPATH + "/JudgmentId");
		if ( subjInstCheckFlag == "true" && CaseManUtils.isBlank(judgmentId) )
		{
			return false;
		}
	}
	return true;
}

/**
 * @author rzxd7g
 * @return null 
 */
AddEvent_SaveButton.actionBinding = function()
{
	// Perform validation again
	if ( AddEvent_SaveButton.isEnabled() )
	{
		// Check if need to raise BMS or Stats Mod LOVs
		var bmsLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/BMSTaskLOVDomain");
		var bmsValue = Services.getValue(AddEvent_BMSTaskLOVGrid.dataBinding);
		var smLOV = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/StatsModLOVDomain");
		var smValue = Services.getValue(AddEvent_StatsModLOVGrid.dataBinding);
		var caseType = Services.getValue(XPathConstants.DATA_XPATH + "/CaseType");

		// If BMS Task needs to be selected and there is no current value, raise popup and exit function,
		// but only for non-insolvency cases
		if ( !CaseManUtils.isInsolvencyCase(caseType) && 
			 !CaseManUtils.isBlank(bmsLOV) && CaseManUtils.isBlank(bmsValue) )
		{
			Services.dispatchEvent("AddEvent_BMSTaskLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
			return;
		}
	
		// If Stats Mod needs to be selected and there is no current value, raise popup and exit function
		if ( !CaseManUtils.isBlank(smLOV) && CaseManUtils.isBlank(smValue) )
		{
			Services.dispatchEvent("AddEvent_StatsModLOVGrid", BusinessLifeCycleEvents.EVENT_RAISE);
			return;
		}
		
		Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
		Services.setValue(Master_EventId.dataBinding, "");
		
		var newEvent = Services.loadDOMFromURL("NewEvent.xml");
		newEvent.selectSingleNode("/CaseEvent/CaseNumber").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_CaseNumber.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/StandardEventId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_EventId.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/SubjectPartyKey").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Subject.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/EventDetails").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Details.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/EventDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_Date.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/UserName").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getCurrentUser() ) ) );
		newEvent.selectSingleNode("/CaseEvent/ReceiptDate").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_DateReceived.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/CaseFlag").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH) ) ) );
		newEvent.selectSingleNode("/CaseEvent/BMSTaskDescription").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_BMSTaskLOVGrid.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/StatsModDescription").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_StatsModLOVGrid.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/CourtCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(Header_OwningCourtCode.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/CreditorCode").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.CCBC_CREDITORCODE_XPATH) ) ) );
		newEvent.selectSingleNode("/CaseEvent/NavigateToWP").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(AddEvent_WPCall.dataBinding) ) ) );
		newEvent.selectSingleNode("/CaseEvent/JudgmentId").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.NEWEVENT_XPATH + "/JudgmentId") ) ) );
		newEvent.selectSingleNode("/CaseEvent/Track").appendChild( newEvent.createTextNode( CaseManUtils.getValidNodeValue( Services.getValue(XPathConstants.DATA_XPATH + "/OriginalTrack") ) ) );
		
		// UCT Group2 Defect 1290 / CaseMan Defect 6171, set flag for server so know to set case status if for certain events
		// the subject is CASE or there is only one defendant available for selection as subject.
		var ccbcCaseStatusSetFlag = Services.getValue(XPathConstants.EVENTVALIDATION_XPATH + "/CaseEventConfiguration/CCBCSetCaseStatusIfCaseOr1Def");
		if ( ccbcCaseStatusSetFlag == "true" )
		{
			var caseFlag = Services.getValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH);
			var countDefs = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./SubjectForEvent = 'true']");
			if ( caseFlag == "Y" || countDefs == 1 )
			{
				newEvent.selectSingleNode("/CaseEvent/CCBCSetCaseStatus").appendChild( newEvent.createTextNode("Y") );
			}
			else
			{
				var countPartiesAlreadyWithEvent = Services.countNodes(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PartiesWithSameEvent/Party[./CasePartyNumber != '']");
				if ( countPartiesAlreadyWithEvent == (countDefs - 1) )
				{
					// The number of defendants with this event already recorded is one shy of the total number of defendants
					// Need to check if the new event subject is the last defendant without this event - if so, set the case status
					// UCT_Group2 Defect 1455
					var subjectPartyRole = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + AddEvent_Subject.dataBinding + "]/PartyRoleCode");
					var subjectPartyNumber = Services.getValue(XPathConstants.DATA_XPATH + "/Parties/Party[./PartyKey = " + AddEvent_Subject.dataBinding + "]/CasePartyNumber");
					var subjectAlreadyHasEvent = Services.exists(XPathConstants.EVENTVALIDATION_XPATH + "/CaseRelatedData/PartiesWithSameEvent/Party[./CasePartyRole = '" + subjectPartyRole + "' and CasePartyNumber = " + subjectPartyNumber + " ]");
					if ( !subjectAlreadyHasEvent )
					{
						newEvent.selectSingleNode("/CaseEvent/CCBCSetCaseStatus").appendChild( newEvent.createTextNode("Y") );
					}
				}
				else if ( countPartiesAlreadyWithEvent == countDefs )
				{
					// Event already exists against all defendants, set the case status regardless
					newEvent.selectSingleNode("/CaseEvent/CCBCSetCaseStatus").appendChild( newEvent.createTextNode("Y") );
				}
			}
		}
		
		// Add Instigator Node
		var instNode = null;
		var partyNode = null;
		for (var i=0; i<Services.countNodes(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey"); i++)
		{
			// Have to create each Instigator an Instigator node under Instigator List
			// and put the PartyKey node under that.  This is a restriction placed upon
			// multiple select grids.
			instNode = XML.createElement(newEvent, "Instigator");
			newEvent.selectSingleNode("/CaseEvent/InstigatorList").appendChild(instNode);
			partyNode = Services.getNode(XPathConstants.NEWEVENT_XPATH + "/InstigatorList/PartyKey[" + (i+1) + "]");
			newEvent.selectSingleNode("/CaseEvent/InstigatorList/Instigator[" + (i+1) + "]").appendChild(partyNode);
		}
		
		var params = new ServiceParams();
		params.addDOMParameter("caseEvent", newEvent);
		Services.callService("addCaseEvent", params, AddEvent_SaveButton, true);
	}
};

/**
 * @param dom
 * @author rzxd7g
 * 
 */
AddEvent_SaveButton.onSuccess = function(dom)
{
	if ( null != dom )
	{
		var data = dom.selectSingleNode("/CaseEventNavigationList");
		if ( null != data )
		{
			Services.startTransaction();
			
			// Place the navigation rules in the DOM
			Services.replaceNode(XPathConstants.EVENTNAVIGATION_XPATH, data);
			
			// Clear any previous data in the App section of the DOM
			clearAppParameters(false, true, false);

			// Get Navigation Rules
			var NavHrg = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/Hearing");
			var NavJdg = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/Judgment");
			var NavObl = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/Obligations");
			var NavWft = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/WindowForTrial");
			var NavTrs = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/TransferCase");
			var NavWP = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/WordProcessing");
			var NavOR = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/NavigateTo/OracleReport");

			// Get Case Number for refreshing the screen			
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			
			// Set up the Navigation Array and set parameters in app section
			var navArray = new Array();

			if ( NavHrg == "true" )
			{
				// Navigating to Hearings screen
				setAppCaseNumberParameter(HearingParams.CASE_NUMBER);
				Services.setValue(HearingParams.HEARING_TYPE, HearingParamsConstants.CASE);
				navArray.push(NavigationController.HEARING_FORM);
			}
			
			if ( NavJdg == "true" )
			{
				// Navigating to Judgments screen
				setAppCaseNumberParameter(JudgmentParams.CASE_NUMBER);
				navArray.push(NavigationController.JUDGMENT_FORM);				
			}

			if ( NavObl == "true" )
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
						Services.replaceNode(MaintainObligationsParams.PARENT + "/Obligation", oblNode);
						navArray.push(NavigationController.OBLIGATIONS_FORM);
					}
				}
			}
			
			if ( NavTrs == "true" )
			{
				// Navigating to the Transfer Case screen
				setAppCaseNumberParameter(TransferCaseParams.CASE_NUMBER);
				navArray.push(NavigationController.TRANSFER_CASE_FORM);
			}
			
			if ( NavWft == "true" )
			{
				// Navigating to the Window for Trial screen
				// Set the Window for Trial prompt message, if any
				var wftCode = Services.getValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WindowForTrial/Prompt");
				var wftMsg;
				switch (wftCode)
				{
					case "A":
						wftMsg = "";
						break;
					case "B":
						wftMsg = Messages.WFT_MESSAGE_B;
						break;
					case "C":
						wftMsg = Messages.WFT_MESSAGE_C;
						break;
				}
				
				// If not called directly from this screen, set the message in the
				// app section for another screen
				if (navArray.length > 0)
				{
					Services.setValue(CaseManFormParameters.WFTMESSAGE_XPATH, wftMsg);
				}
				
				// Get copy of parameters to pass to the WFT screen
				var wftNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WindowForTrial");
				Services.replaceNode(MaintainWftParams.PARENT + "/WindowForTrial", wftNode);
				navArray.push(NavigationController.WFT_FORM);
			}
			
			if ( NavWP == "true" )
			{
				// Navigating to the Word Processing screen(s)
				// Add WP Node to the app section of the DOM
				var wpNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing");
				var wpDom = XML.createDOM();
				wpDom.loadXML(wpNode.xml);
				
				Services.replaceNode(CaseManFormParameters.WPNODE_XPATH, wpNode);
				navArray.push(NavigationController.WP_FORM);
			}

			if ( NavOR == "true" )
			{
				// Navigating to the Oracle Report screen(s)
				// Set Oracle Report Court Code to the owning court of the case record loaded - TRAC 2446
				Services.setValue(CaseManFormParameters.OR_COURT_CODE_XPATH, Services.getValue(Header_OwningCourtCode.dataBinding) );
				
				// Add WP Node to the app section of the DOM
				var orNode = Services.getNode(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[last()]");
				var orDom = XML.createDOM();
				orDom.loadXML(orNode.xml);
				
				Services.replaceNode(CaseManFormParameters.ORNODE_XPATH, orNode);				
				navArray.push(NavigationController.OR_FORM);
			}
						
			if ( navArray.length > 0 )
			{
				// Set Call Stack to return to the Events screen
				navArray.push(NavigationController.EVENTS_FORM);
				NavigationController.createCallStack(navArray);
			}
			else
			{
				// No need to navigate anywhere, refresh screen
				retrieveCaseEvents(caseNumber);
			}
			
			Services.endTransaction();
	
			// Navigate away
			var refreshScreen = false;
			var navigating = false;
			for (var i=0; i<navArray.length; i++)
			{
				switch (navArray[i])
				{
					// Handle Navigation to Hearings screen
					case NavigationController.HEARING_FORM:
				
						if ( confirm(Messages.HRG_MESSAGE) )
						{
							// User wishes to Navigate to Hearings screen
							NavigationController.nextScreen();
							navigating = true;
						}
						else
						{
							NavigationController.skipScreen();
						}
						break;
						
					// Handle Navigation to the Judgments screen
					case NavigationController.JUDGMENT_FORM:
				
						// Automatic navigation to Navigate to Judgments screen
						NavigationController.nextScreen();
						navigating = true;
						break;
				
					// Handle Navigation to Obligations screen
					case NavigationController.OBLIGATIONS_FORM:

						if ( oblActionFlow == "O" || oblActionFlow == "EM" )
						{
							// Navigation is optional, ask user to confirm
							if ( confirm(Messages.OBL_MESSAGE) )
							{
								// User wishes to Navigate to Obligations screen
								NavigationController.nextScreen();
								navigating = true;
							}
							else
							{
								// User does not wish to navigate to Obligations screen
								Services.removeNode(MaintainObligationsParams.PARENT);
								NavigationController.skipScreen();
								refreshScreen = true;
							}
						}
						else
						{
							// Navigation is mandatory
							NavigationController.nextScreen();
							navigating = true;
						}
						break;
						
					// Handle navigation to the Transfer Case screen
					case NavigationController.TRANSFER_CASE_FORM:
					
						// Automatic navigation to the Transfer Case screen
						NavigationController.nextScreen();
						navigating = true;
						break;
						
					// Handle Navigation to Window for Trial Screen
					case NavigationController.WFT_FORM:
					
						if ( CaseManUtils.isBlank(wftMsg) )
						{
							// Navigation is mandatory
							NavigationController.nextScreen();
							navigating = true;
						}
						else
						{
							// Navigation is optional, ask user to confirm
							if ( confirm(wftMsg) )
							{
								// User wishes to Navigate to Window for Trial screen
								NavigationController.nextScreen();
								navigating = true;
							}
							else
							{
								// User does not wish to navigate to Window for Trial screen
								Services.removeNode(MaintainWftParams.PARENT);
								NavigationController.skipScreen();
								refreshScreen = true;
							}
						}
						break;
						
					// Handle Navigation to Word Processing Screens
					case NavigationController.WP_FORM:
						
						// Skip screen so does not go to surrogate WP page
						NavigationController.skipScreen();
						// Make call to WP Controller
						Services.setValue(XPathConstants.EVENTNAVIGATION_XPATH + "/Params/WordProcessing[1]/Request", "Create");
						var wpNode = Services.getNode(CaseManFormParameters.WPNODE_XPATH);
						var wpDom = XML.createDOM();
						wpDom.loadXML(wpNode.xml);
						WP.ProcessWP(FormController.getInstance(), wpDom,  NavigationController.getNextScreen(), true );
						
						if ( NavOR == "true" )
						{
							// Event has an Oracle Reports output as well as a WP output
							NavigationController.skipScreen();
							orNode = Services.getNode(CaseManFormParameters.ORNODE_XPATH)
							orDom = XML.createDOM();
							orDom.loadXML(orNode.xml);
							WP.ProcessORA(FormController.getInstance(), orDom,  NavigationController.getNextScreen() );	
						}
						refreshScreen = true;
						navigating = true;
						break;

					// Handle Navigation to Oracle Report Parameter Screens
					case NavigationController.OR_FORM:
						// Skip screen so does not go to surrogate OR page
						NavigationController.skipScreen();
						navigating = true;
						WP.ProcessORA(FormController.getInstance(), orDom, NavigationController.getNextScreen());
						refreshScreen = true;
						break;						
						
				}
				// Exit as are navigating
				if (navigating) { break; }
			}
			
			if ( !navigating && refreshScreen )
			{
				// CaseMan defect 5944 - no navigation but call stack still lists Events screen
				var nextScreen = NavigationController.getNextScreen();
				if ( nextScreen == NavigationController.EVENTS_FORM )
				{
					NavigationController.skipScreen();
				}
				
				retrieveCaseEvents(caseNumber);
			}
		}
	}
}

/**
 * @param exception
 * @author rzxd7g
 * 
 */
AddEvent_SaveButton.onError = function(exception)
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
AddEvent_SaveButton.onAuthorizationException = function(exception) 
{
	alert(Messages.AUTHORIZATION_FAILED_MESSAGE);

	// Set the dirty flag to false
	Services.setValue(XPathConstants.CHANGES_MADE_XPATH, "false");
}

/**********************************************************************************/

function AddEvent_CancelButton() {}
AddEvent_CancelButton.additionalBindings = {
	eventBinding: {
		keys: [ { key: Key.F4, element: "AddEvent_Popup" } ]
	}
};
AddEvent_CancelButton.tabIndex = 690;
/**
 * @author rzxd7g
 * 
 */
AddEvent_CancelButton.actionBinding = function()
{
	Services.dispatchEvent("AddEvent_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
	Services.setValue(Master_EventId.dataBinding, "");
};

/**********************************************************************************/

function SubjectPopup_CaseButton() {}
SubjectPopup_CaseButton.tabIndex = 1000;
SubjectPopup_CaseButton.enableOn = [XPathConstants.SUBJECT_TYPE_XPATH];
SubjectPopup_CaseButton.isEnabled = function()
{
	// Only enabled for Subject Types of CASE
	var subjectType = Services.getValue(XPathConstants.SUBJECT_TYPE_XPATH);
	return ( subjectType == SubjectTypeCodes.CASE || subjectType == SubjectTypeCodes.CASEDEF );
}

/**
 * @author rzxd7g
 * 
 */
SubjectPopup_CaseButton.actionBinding = function()
{
	Services.dispatchEvent("SubjectLOV_Popup", BusinessLifeCycleEvents.EVENT_LOWER);

	// Set the Case Flag to 'Y'
	Services.startTransaction();
	Services.setValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, "Y");
	Services.setValue(AddEvent_Subject.dataBinding, "");
	Services.endTransaction();
};

/**********************************************************************************/

function SubjectPopup_OkButton() {}

SubjectPopup_OkButton.additionalBindings = {
	eventBinding: {
		doubleClicks: [ {element: "SubjectPopup_SubjectLOVGrid"} ]
	}
};

SubjectPopup_OkButton.tabIndex = 1010;
SubjectPopup_OkButton.enableOn = [SubjectPopup_SubjectLOVGrid.dataBinding];
SubjectPopup_OkButton.isEnabled = function()
{
	// Disabled if no rows selected
	return !CaseManUtils.isBlank( Services.getValue(SubjectPopup_SubjectLOVGrid.dataBinding) );
}

/**
 * @author rzxd7g
 * 
 */
SubjectPopup_OkButton.actionBinding = function()
{
	Services.startTransaction();
	Services.setValue(XPathConstants.NEWEVENT_SUBJECTCASEFLAG_XPATH, "");
	Services.setValue(AddEvent_Subject.dataBinding, Services.getValue(SubjectPopup_SubjectLOVGrid.dataBinding) );
	Services.endTransaction();
	Services.dispatchEvent("SubjectLOV_Popup", BusinessLifeCycleEvents.EVENT_LOWER);
};

/**********************************************************************************/

function SubjectPopup_CancelButton() {}
SubjectPopup_CancelButton.tabIndex = 1020;

/****************** ORACLE REPORTS PROGRESS BAR FIELDS ****************************/

function ProgressIndicator_Popup() {}
/**
 * @author rzxd7g
 * 
 */
ProgressIndicator_Popup.onPopupClose = function()
{
	var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
	retrieveCaseEvents(caseNumber);
}

function Progress_Bar() {}
Progress_Bar.dataBinding = "/ds/ProgressBar/Progress";
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
		doubleClicks: [ {element: "Master_EventGrid"} ],
		keys: []
	}
};

launchOutputLogic.logic = function()
{
	var countOutputs = Services.countNodes(XPathConstants.EVENTS_XPATH + "/Outputs/Output");
	if ( countOutputs == 1 )
	{
		var outputId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/OutputId");
		var outputType = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/Type");
		
		if ( outputType == "WP" )
		{
			// Call Word Processing	Code
			// Prepare the Word Processing Node
			var documentId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/DocumentId");
			if (null == documentId || documentId == "")
			{
				Services.setValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/Request", "Create");
			}
			else
			{
				Services.setValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/Request", "Open");
			}
			
			var applicant = Services.getValue(XPathConstants.EVENTS_XPATH + "/Applicant");
			var eventSeq = Services.getValue(XPathConstants.EVENTS_XPATH + "/CaseEventSeq");
			var eventStdId = Services.getValue(XPathConstants.EVENTS_XPATH + "/StandardEventId");
			var caseNumber = Services.getValue(Header_CaseNumber.dataBinding);
			var caseType = getXMLCompatibleString(Services.getValue(XPathConstants.DATA_XPATH + "/CaseType"));
			var jurisdiction = getXMLCompatibleString(Services.getValue(XPathConstants.DATA_XPATH + "/Jurisdiction"));
			var countWelshParties = Services.countNodes(XPathConstants.DATA_XPATH + "/Parties/Party[./WelshTranslation='Y']");
			var welshTranslation = (countWelshParties == 0) ? "N" : "Y";
			var transferReasonText = "";
			if (eventStdId == 340 || eventStdId == 350) 
			{
				var transferReason = Services.getValue(XPathConstants.EVENTS_XPATH + "/TransferReason");
				transferReasonText = "<TransferReason>" + transferReason + "</TransferReason>";
			}
			var trackText = "";
			if (eventStdId == 196)
			{
				var eventTrack = Services.getValue(XPathConstants.EVENTS_XPATH + "/Track");
				trackText = "<Track>" + eventTrack + "</Track>";
			}
			
			// Defect 5827 - set WP flag indicating whether or not a hearing was created with the event
			var hrgSequence = Services.getValue(XPathConstants.EVENTS_XPATH + "/HearingSequence");
			var hearingCreated = CaseManUtils.isBlank(hrgSequence) ? "false" : "true";
						
			var wpNode = Services.getNode(XPathConstants.EVENTS_XPATH + "/Outputs/Output");
			var wpDom = XML.createDOM();
			wpDom.loadXML(wpNode.xml);
			
			var txDOM = XML.createDOM();
			txDOM.loadXML("<xsl:stylesheet xmlns:xsl='http://www.w3.org/1999/XSL/Transform' version='1.0'> " +
	          "<xsl:output method='xml' indent='yes' />" +
	          "<xsl:template match='Output'>" +
	               "<WordProcessing>" +
	               		"<Event>" +
		               		"<CaseEventSeq>" + eventSeq + "</CaseEventSeq>" +
	               			"<StandardEventId>" + eventStdId + "</StandardEventId>" + transferReasonText + 
	               		"</Event>" +
	               		"<Case>" +
		               		"<CaseNumber>" + caseNumber + "</CaseNumber>" +
	               			"<CaseType>" + caseType + "</CaseType>" +
							"<Jurisdiction>" + jurisdiction + "</Jurisdiction>" +
							"<WelshTranslation>" + welshTranslation + "</WelshTranslation>" + trackText +
	               		"</Case>" +
	               		"<Judgment><Applicant>"+applicant+"</Applicant></Judgment>"+
	               		"<HearingCreated>" + hearingCreated + "</HearingCreated>" +
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
			WP.ProcessWP(FormController.getInstance(), newDom, NavigationController.EVENTS_FORM, false);
		}
		else if ( outputType == "OR" )
		{
			// Call Oracle Reports
			var documentId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/DocumentId");
			//var reportId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/Description");//defect 6039 replaced with line below
			var reportId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/ReportId");
			var orderId = Services.getValue(XPathConstants.EVENTS_XPATH + "/Outputs/Output/OutputId");
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

/**********************************************************************************/

/**
 * Logic to cater for the F8 shortcut to navigate to the Transfer Cases screen.  The framework
 * doesn't allow the user to apply keybindings to navigation links in the quicklinks dropdown
 * so this is the only way to create a keybinding to the action.
 * @author rzxd7g
 */
function TransferCaseShortcutLogic() {}
TransferCaseShortcutLogic.additionalBindings = {
	eventBinding: {
		singleClicks: [],
		doubleClicks: [],
		keys: [ { key: Key.F8, element: "manageEvents" } ]
	}
};

TransferCaseShortcutLogic.logic = function()
{
	if ( Services.hasAccessToForm(NavigationController.TRANSFER_CASE_FORM) )
	{
		// Current user has access to the Transfer Cases screen, check validation.
		var ec = null;
		if ( !caseExists() )
		{
			// Existing Case not loaded, throw error message
			ec = ErrorCode.getErrorCode("CaseMan_cannotNavigateToTransferScreen_Msg");
			Services.setTransientStatusBarMessage(ec.getMessage());
		}
		else if ( Services.getValue(XPathConstants.DATA_XPATH + "/OutstandingWarrant") == "true" )
		{
			// Cannot transfer a case with an outstanding warrant
			ec = ErrorCode.getErrorCode("CaseMan_cannotTransferCaseOustandingWarrant_Msg");
			Services.setTransientStatusBarMessage( ec.getMessage() );
		}
		 
		// Outstanding payments check (requires service call)
		if ( null == ec ){
			//TRAC 2810 - Remove payments check when select F8 button - check no longer requried.					
			//checkOutstandingPaymentsExist();
			
			// added code below from checkOutstandingPaymentsExist() as part of TRAC 2810
			// proceed with navigation to Transfer Cases screen.
			var navArray = new Array(NavigationController.TRANSFER_CASE_FORM, NavigationController.EVENTS_FORM);
			NavigationController.createCallStack(navArray);
			clearAppParameters(false, true, false);
			setAppCaseNumberParameter(TransferCaseParams.CASE_NUMBER);
			
			// Check the unsaved changes
			if ( ( changesMade() || caseChangesMade() ) && confirm(Messages.DETSLOST_MESSAGE) )
			{
				// User wishes to save before navigating, setup the params
				PostSaveActions.ACTION_AFTER_SAVE = PostSaveActions.ACTION_NAVIGATE;
				Status_SaveButton.actionBinding();
			}
			else
			{
				// No changes or wish to navigate without saving
				NavigationController.nextScreen();
			}
		}
		
	}
}
